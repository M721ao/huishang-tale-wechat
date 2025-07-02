import {
  loadProgress,
  saveProgress,
  initialState,
} from "./js/chapters/chapterConfig.js";
import { TitleScene } from "./js/scenes/TitleScene.js";
import { PrologueScene } from "./js/scenes/PrologueScene.js";
import { StoryScene } from "./js/scenes/StoryScene.js";
import { CardScene } from "./js/scenes/CardScene.js";
import { EndingScene } from "./js/scenes/EndingScene.js";
import { Dialog } from "./js/components/Dialog.js";
import { ChapterTitleScene } from "./js/scenes/ChapterTitleScene.js";
import { ChapterManager } from "./js/chapters/ChapterManager.js";
import { UserManager } from "./js/utils/UserManager.js";

// 初始化游戏画布
const canvas = wx.createCanvas();
const ctx = canvas.getContext("2d");

// 获取屏幕尺寸
const { windowWidth, windowHeight } = wx.getSystemInfoSync();
canvas.width = windowWidth;
canvas.height = windowHeight;

// 游戏状态
class Game {
  constructor() {
    this.currentSceneType = "title";
    this.currentScene = null;

    // 安全地加载游戏进度
    let savedProgress = null;
    try {
      savedProgress = wx.getStorageSync("gameProgress");
      console.log("游戏进度读取成功");
    } catch (error) {
      console.error("读取游戏进度失败:", error);
    }

    this.progress = savedProgress || {
      currentChapter: 0,
      currentScene: "title",
      storyProgress: 0,
      attributes: {}, // 每章节的属性
    };

    // 初始化场景
    this.titleScene = new TitleScene(ctx, windowWidth, windowHeight);
    this.prologueScene = new PrologueScene(ctx, windowWidth, windowHeight);
    this.chapterTitleScene = new ChapterTitleScene(
      ctx,
      windowWidth,
      windowHeight
    );
    this.storyScene = new StoryScene(ctx, windowWidth, windowHeight);
    this.cardScene = new CardScene(this, ctx, windowWidth, windowHeight);
    this.endingScene = new EndingScene(ctx, windowWidth, windowHeight);

    // 初始化弹窗
    this.dialog = new Dialog(ctx, windowWidth, windowHeight);

    // 初始化用户管理器
    this.userManager = new UserManager(this);
    this.userManager.init();

    // 初始化章节管理器
    this.chapterManager = new ChapterManager(this);

    // 初始化背景音乐
    this.initBGM();

    // 延迟设置回调，确保UserManager完全初始化
    setTimeout(() => {
      this.setupTitleSceneCallbacks();
    }, 100);
  }

  setupTitleSceneCallbacks() {
    // 设置标题场景的开始回调
    this.titleScene.setOnStart(() => {
      // 检查是否已登录
      if (this.userManager && this.userManager.isLoggedIn) {
        // 已登录，先获取最新游戏进度再开始游戏
        console.log("用户已登录，获取最新游戏进度");
        if (!this.userManager.isGuestMode) {
          // 非游客模式，从服务器获取最新进度
          this.userManager.fetchGameProgressAndStartGame();
        } else {
          // 游客模式，直接开始游戏
          this.handleGameStart();
        }
      } else {
        // 未登录，直接触发登录，登录成功后会自动开始游戏
        this.showLoginOptions();
      }
    });

    // 设置游客模式回调
    this.titleScene.setOnGuestMode(() => {
      if (this.userManager) {
        this.userManager.enableGuestMode();
      }
    });
  }

  // 初始化背景音乐
  initBGM() {
    if (!this.bgmAudio) {
      this.bgmAudio = wx.createInnerAudioContext();
      this.bgmAudio.src = "audio/bgm.mp3";
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = 0.5;
      // 先尝试直接播放
      this.bgmAudio.play();
      // 兼容微信自动播放策略：如未成功，首次用户交互后再播放
      const tryPlay = () => {
        this.bgmAudio.play();
        wx.offTouchStart(tryPlay); // 只绑定一次
      };
      wx.onTouchStart(tryPlay);
    }
  }

  // 切换场景
  setScene(scene, type) {
    if (!scene) {
      console.error("Attempting to set invalid scene:", scene);
      return;
    }

    console.log("Switching scene to:", type);

    // 如果是同一个场景，不做任何处理
    if (this.currentScene === scene) {
      console.log("Scene is already active:", type);
      return;
    }

    // 清理当前场景
    if (this.currentScene) {
      if (typeof this.currentScene.cleanup === "function") {
        this.currentScene.cleanup();
      }
    }

    this.currentScene = scene;
    this.currentSceneType = type;

    // 如果是章节切换，保存游戏进度
    if (type === "chapterTitle" && this.chapterManager && this.userManager) {
      const chapterNumber = this.chapterManager.currentChapter;
      this.userManager.saveGameProgress(chapterNumber);
    }

    // 如果是标题场景，更新登录UI
    if (type === "title") {
      this.updateLoginUI();
    }

    this.progress.currentScene = type;
    saveProgress(this.progress);

    console.log("Scene switched successfully");
  }

  // 开始新游戏
  startNewGame() {
    this.progress = {
      currentChapter: 0, // 新游戏从引子开始
      currentScene: "title",
      storyProgress: 0,
      attributes: {},
    };
    saveProgress(this.progress);
    this.setScene(this.titleScene, "title");
  }

  // 启动游戏
  start() {
    // 设置初始场景
    this.setScene(this.titleScene, "title");

    // 检查登录状态，更新按钮显示
    this.updateLoginUI();
  }

  // 显示登录选项
  showLoginOptions() {
    // 可以延迟显示游客模式按钮，给用户更多时间完成登录
    setTimeout(() => {
      this.titleScene.showGuestButton(true);
    }, 3000); // 3秒后才显示游客模式选项

    // 直接触发登录
    if (this.userManager) {
      this.userManager.login();
    }
  }

  // 更新登录相关UI
  updateLoginUI() {
    if (!this.userManager || !this.titleScene) return;

    const status = this.userManager.checkLoginStatus();

    if (status.isLoggedIn) {
      // 已登录，显示"继续游戏"按钮
      this.titleScene.updateButtonText("继续游戏");
      this.titleScene.showGuestButton(false); // 隐藏游客模式按钮

      if (status.isGuestMode) {
        console.log("当前为游客模式");
      }
    } else {
      // 未登录，显示"开始游戏"按钮
      this.titleScene.updateButtonText("开始游戏");
      this.titleScene.showGuestButton(true); // 显示游客模式按钮
    }
  }

  // 开始主游戏
  startMainGame() {
    // 设置引子文字
    this.prologueScene.setText("前世不修 生在徽州 十三四岁 往外一丢");
    this.setScene(this.prologueScene, "prologue");

    // 设置引子结束后的回调
    this.prologueScene.setOnFinish(() => {
      // 引子结束后，设置章节为1并开始第一章
      this.progress.currentChapter = 1;
      this.chapterManager.currentChapter = 1;
      saveProgress(this.progress);
      this.chapterManager.startChapterTitle();
    });
  }

  // 继续游戏
  continueGame() {
    console.log("=== 开始continueGame ===");

    // 使用UserManager中已同步的进度，而不是本地存储的旧进度
    const userProgress = this.userManager.getGameProgress();
    console.log("UserManager进度数据:", userProgress);

    // 同时也检查本地进度作为对比
    const localProgress = loadProgress();
    console.log("本地进度数据:", localProgress);

    // 使用UserManager的进度作为主要数据源
    if (userProgress && userProgress.currentChapter > 0) {
      this.progress.currentChapter = userProgress.currentChapter;
      this.chapterManager.currentChapter = userProgress.currentChapter;

      console.log("当前章节:", userProgress.currentChapter);

      // 对于继续游戏，通常应该从章节标题开始
      console.log("启动章节标题场景");
      this.chapterManager.startChapterTitle();
    } else if (localProgress) {
      // 如果UserManager没有有效进度，使用本地进度
      console.log("使用本地进度");
      this.progress = localProgress;
      this.chapterManager.currentChapter = localProgress.currentChapter;
      console.log("当前章节:", localProgress.currentChapter);
      console.log("当前场景:", localProgress.currentScene);

      switch (localProgress.currentScene) {
        case "title":
          console.log("启动章节标题场景");
          this.chapterManager.startChapterTitle();
          break;
        case "prologue":
          console.log("启动引子场景");
          this.chapterManager.startChapterPrologue();
          break;
        case "story":
          console.log("启动故事场景");
          this.chapterManager.startChapterStory();
          break;
        case "card":
          console.log("启动卡牌场景");
          this.chapterManager.startChapterCards();
          break;
        default:
          console.log("未知场景，启动章节标题场景");
          this.chapterManager.startChapterTitle();
          break;
      }
    } else {
      console.log("没有任何进度，启动新游戏");
      this.startNewGame();
    }
    console.log("=== continueGame结束 ===");
  }

  // 登录成功后的回调
  onLoginSuccess() {
    console.log("登录成功，开始游戏");
    // 更新UI状态
    this.updateLoginUI();
    // 开始游戏
    this.handleGameStart();
  }

  // 处理游戏开始逻辑
  handleGameStart() {
    console.log("=== 开始处理游戏开始逻辑 ===");

    // 使用UserManager中的游戏进度，而不是本地存储的progress
    const userProgress = this.userManager.getGameProgress();
    console.log("当前用户游戏进度:", userProgress);
    console.log("userProgress类型:", typeof userProgress);

    // 获取当前章节
    let currentChapter = 0;
    if (userProgress && typeof userProgress.currentChapter === "number") {
      currentChapter = userProgress.currentChapter;
      console.log("从userProgress获取到章节:", currentChapter);
    } else {
      console.log("无法从userProgress获取章节，使用默认值0");
      console.log("userProgress存在:", !!userProgress);
      if (userProgress) {
        console.log(
          "userProgress.currentChapter类型:",
          typeof userProgress.currentChapter
        );
        console.log(
          "userProgress.currentChapter值:",
          userProgress.currentChapter
        );
      }
    }

    console.log("最终当前章节:", currentChapter);

    if (currentChapter > 0) {
      // 有进度且章节大于0，直接继续游戏
      console.log("检测到有效进度，开始继续游戏到章节:", currentChapter);
      // 同步本地进度
      this.progress.currentChapter = currentChapter;
      this.chapterManager.currentChapter = currentChapter;
      saveProgress(this.progress);
      console.log("调用continueGame()");
      this.continueGame();
    } else {
      // 章节为0或没有进度，进入引子
      console.log("没有有效进度，进入引子");
      console.log("调用startMainGame()");
      this.startMainGame();
    }

    console.log("=== 游戏开始逻辑处理完成 ===");
  }

  // 更新游戏
  update() {
    if (this.currentScene && this.currentScene.update) {
      this.currentScene.update();
    }

    // 更新弹窗
    if (this.dialog && this.dialog.visible) {
      this.dialog.update();
    }
  }

  // 绘制游戏
  draw() {
    ctx.clearRect(0, 0, windowWidth, windowHeight);
    if (this.currentScene && this.currentScene.draw) {
      this.currentScene.draw();
    }

    // 绘制弹窗
    if (this.dialog && this.dialog.visible) {
      this.dialog.draw();
    }
  }
}

// 创建游戏实例
const game = new Game();

// 加载封面图片
const coverImage = wx.createImage();
coverImage.src = "images/cover.png";

// 游戏主循环
function gameLoop() {
  game.update();
  game.draw();
  requestAnimationFrame(gameLoop);
}

// 触摸事件处理
wx.onTouchStart((e) => {
  if (game.currentScene && game.currentScene.handleTouchStart) {
    game.currentScene.handleTouchStart(e);
  } else if (game.currentScene && game.currentScene.handleTap) {
    game.currentScene.handleTap(e.touches[0].clientX, e.touches[0].clientY);
  }
});

wx.onTouchMove((e) => {
  if (game.currentScene && game.currentScene.handleTouchMove) {
    game.currentScene.handleTouchMove(e);
  }
});

wx.onTouchEnd((e) => {
  if (game.currentScene && game.currentScene.handleTouchEnd) {
    game.currentScene.handleTouchEnd();
  }
});

// 等待图片加载完成后启动游戏
coverImage.onload = () => {
  game.start();
  gameLoop();
};
