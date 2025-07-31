import {
  loadProgress,
  saveProgress,
  saveGameProgress,
  loadGameProgress,
  initialState,
} from "./js/chapters/chapterConfig.js";
import { getAudioUrl, getImageUrl } from "./js/config/resourceConfig.js";
import { TitleScene } from "./js/scenes/TitleScene.js";
import { PrologueScene } from "./js/scenes/PrologueScene.js";
import { StoryScene } from "./js/scenes/StoryScene.js";
import { CardScene } from "./js/scenes/CardScene.js";
import { EndingScene } from "./js/scenes/EndingScene.js";
import { Dialog } from "./js/components/Dialog.js";
import { ChapterTitleScene } from "./js/scenes/ChapterTitleScene.js";
import { ChapterManager } from "./js/chapters/ChapterManager.js";
import { UserManager } from "./js/utils/UserManager.js";
import { ChapterSelectScene } from "./js/scenes/ChapterSelectScene.js";
// 移除测试工具引用，避免在真机环境中出现window未定义错误
// import "./js/utils/cosTest.js"; // 导入COS测试工具
// import "./js/utils/serverTest.js"; // 导入服务器测试工具

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
    
    // 保存分享参数，稍后处理
    this.shareParams = wx.getLaunchOptionsSync().query;

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
    this.chapterSelectScene = new ChapterSelectScene(
      ctx,
      windowWidth,
      windowHeight
    );

    // 初始化弹窗
    this.dialog = new Dialog(ctx, windowWidth, windowHeight);

    // 初始化用户管理器
    this.userManager = new UserManager(this);
    this.userManager.init();

    // 初始化章节管理器
    this.chapterManager = new ChapterManager(this);
    
    // 现在可以安全地处理分享参数
    this.handleShareParams();

    // 初始化背景音乐
    // this.initBGM();

    // 延迟设置回调，确保UserManager完全初始化
    setTimeout(() => {
      this.setupTitleSceneCallbacks();
    }, 100);
  }

  handleShareParams() {
    const url = this.shareParams;
    if (url && (url.from === "share" || url.from === "timeline")) {
      const chapter = url.chapter ? parseInt(url.chapter, 10) : 0;
      const shareSource = url.from === "timeline" ? "朋友圈" : "好友分享";

      if (chapter > 0 && this.chapterManager) {
        this.progress.currentChapter = chapter;
        this.chapterManager.currentChapter = chapter;
        saveGameProgress(this.progress);
        console.log(`从${shareSource}链接加载章节:`, chapter);
      } else {
        console.log(`${shareSource}链接未携带章节信息，从标题场景开始`);
      }

      // 记录分享来源，可用于统计分析
      this.shareSource = url.from;
      console.log("分享来源:", shareSource);
    }
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

    // 设置章节选择回调
    this.titleScene.setOnChapterSelect(() => {
      this.setScene(this.chapterSelectScene, "chapterSelect");
    });

    // 设置游客模式回调
    this.titleScene.setOnGuestMode(() => {
      if (this.userManager) {
        this.userManager.enableGuestMode();
      }
    });

    // 设置章节选择场景的回调
    this.chapterSelectScene.setOnChapterSelect((chapter) => {
      this.startSelectedChapter(chapter);
    });

    this.chapterSelectScene.setOnBack(() => {
      this.setScene(this.titleScene, "title");
    });
  }

  // 初始化背景音乐
  // initBGM() {
  //   if (!this.bgmAudio) {
  //     this.bgmAudio = wx.createInnerAudioContext();
  //     this.bgmAudio.src = getAudioUrl("audio/bgm.mp3");
  //     this.bgmAudio.loop = true;
  //     this.bgmAudio.volume = 0.5;
  //     // 先尝试直接播放
  //     this.bgmAudio.play();
  //     // 兼容微信自动播放策略：如未成功，首次用户交互后再播放
  //     const tryPlay = () => {
  //       this.bgmAudio.play();
  //       wx.offTouchStart(tryPlay); // 只绑定一次
  //     };
  //     wx.onTouchStart(tryPlay);
  //   }
  // }

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
      // 停用当前场景
      if (typeof this.currentScene.deactivate === "function") {
        this.currentScene.deactivate();
      }
    }

    this.currentScene = scene;
    this.currentSceneType = type;

    // 激活新场景
    if (typeof scene.activate === "function") {
      scene.activate();
    }

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
    saveGameProgress(this.progress);

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
    saveGameProgress(this.progress);
    this.setScene(this.titleScene, "title");
  }

  // 启动游戏
  start() {
    console.log("游戏开始");
    this.setScene(this.titleScene, "title");
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

      // 检查是否有游戏进度，有进度才显示章节选择按钮
      const userProgress = this.userManager.getGameProgress();
      const hasProgress = userProgress && userProgress.currentChapter > 0;

      // 只在有游戏进度时显示章节选择按钮
      if (this.titleScene.chapterSelectButton) {
        this.titleScene.chapterSelectButton.visible = hasProgress;
      }

      if (status.isGuestMode) {
        console.log("当前为游客模式");
      }
    } else {
      // 未登录，显示"开始游戏"按钮
      this.titleScene.updateButtonText("开始游戏");
      this.titleScene.showGuestButton(true); // 显示游客模式按钮

      // 未登录时隐藏章节选择按钮
      if (this.titleScene.chapterSelectButton) {
        this.titleScene.chapterSelectButton.visible = false;
      }
    }
  }

  // 开始主游戏
  startMainGame() {
    // 设置引子文字
    this.prologueScene.setText(
      "黄山市古称徽州府，下辖歙、黟、休、祁、绩、婺六县。这里山多田少，却孕育出纵横天下的徽商，他们肩挑一枚铜钱，行走千里商道，书写出百年的荣枯传奇。"
    );
    this.setScene(this.prologueScene, "prologue");

    // 设置引子结束后的回调
    this.prologueScene.setOnFinish(() => {
      // 引子结束后，设置章节为1并开始第一章
      this.progress.currentChapter = 1;
      this.chapterManager.currentChapter = 1;
      saveGameProgress(this.progress);
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

  // 启动选定的章节
  startSelectedChapter(chapter) {
    console.log("启动选定章节:", chapter);

    // 设置当前章节
    this.progress.currentChapter = chapter.id;
    this.chapterManager.currentChapter = chapter.id;

    // 重置属性，为新章节做准备
    this.progress.attributes = {};

    // 保存进度
    saveGameProgress(this.progress);

    // 如果用户已登录，同步到服务器
    if (this.userManager && this.userManager.isLoggedIn) {
      this.userManager.saveGameProgress(chapter.id);
    }

    // 启动章节标题场景
    this.chapterManager.startChapterTitle();
  }
}

// 创建游戏实例
const game = new Game();

// 加载封面图片
const coverImage = wx.createImage();
coverImage.src = getImageUrl("game-cover");

// 游戏主循环
function gameLoop() {
  game.update();
  game.draw();
  requestAnimationFrame(gameLoop);
}

// 触摸事件处理
wx.onTouchStart((e) => {
  // 优先检查Dialog是否需要处理触摸事件
  if (game.dialog && game.dialog.visible) {
    // Dialog显示时，不传递事件给场景
    return;
  }

  if (game.currentScene && game.currentScene.handleTouchStart) {
    game.currentScene.handleTouchStart(e);
  } else if (game.currentScene && game.currentScene.handleTap) {
    game.currentScene.handleTap(e.touches[0].clientX, e.touches[0].clientY);
  }
});

wx.onTouchMove((e) => {
  // 优先检查Dialog是否需要处理触摸事件
  if (game.dialog && game.dialog.visible) {
    // Dialog显示时，不传递事件给场景
    return;
  }

  if (game.currentScene && game.currentScene.handleTouchMove) {
    game.currentScene.handleTouchMove(e);
  }
});

wx.onTouchEnd((e) => {
  // 优先检查Dialog是否需要处理触摸事件
  if (game.dialog && game.dialog.visible) {
    const touch = e.changedTouches[0];
    const handled = game.dialog.handleTouch(touch.clientX, touch.clientY);
    if (handled) {
      return; // Dialog处理了事件，不传递给场景
    }
  }

  if (game.currentScene && game.currentScene.handleTouchEnd) {
    game.currentScene.handleTouchEnd(e);
  }
});

// 等待图片加载完成后启动游戏
coverImage.onload = () => {
  game.start();
  gameLoop();

  // 初始化微信分享功能
  initWeChatShare();
};

// 微信分享功能初始化
function initWeChatShare() {
  // 显示当前页面的转发按钮和朋友圈分享按钮
  wx.showShareMenu({
    withShareTicket: true,
    menus: ["shareAppMessage", "shareTimeline"], // 同时显示转发和朋友圈分享
    success: (res) => {
      console.log("分享菜单显示成功");
    },
    fail: (err) => {
      console.error("分享菜单显示失败:", err);
    },
  });

  // 设置转发内容（分享给好友/群聊）
  wx.onShareAppMessage(() => {
    // 根据游戏当前状态生成不同的分享标题
    const getShareTitle = () => {
      if (game && game.progress) {
        const currentChapter = game.progress.currentChapter;
        if (currentChapter === 0) {
          return "快来体验这个精彩的互动故事游戏！";
        } else if (currentChapter > 0) {
          return `我已经通关第${currentChapter}章了，你也来挑战一下吧！`;
        }
      }
      return "一起来玩这个有趣的互动故事游戏吧！";
    };

    return {
      title: getShareTitle(),
      imageUrl: "", // 可以设置分享图片路径，比如: 'images/share-cover.jpg'
      query: `from=share&chapter=${game?.progress?.currentChapter || 0}`, // 携带分享来源和章节信息
      success: (res) => {
        console.log("分享成功");
        // 分享成功后的逻辑
        if (res.shareTickets && res.shareTickets.length > 0) {
          console.log("分享到群聊成功，shareTicket:", res.shareTickets[0]);
        }

        // 可以在这里添加分享奖励逻辑
        // 例如：给玩家一些游戏内奖励
      },
      fail: (err) => {
        console.error("分享失败:", err);
      },
    };
  });

  // 设置朋友圈分享内容
  wx.onShareTimeline(() => {
    // 生成朋友圈分享标题
    const getTimelineTitle = () => {
      if (game && game.progress) {
        const currentChapter = game.progress.currentChapter;
        if (currentChapter === 0) {
          return "发现了一个超棒的互动故事游戏，剧情丰富，选择很重要！";
        } else if (currentChapter > 0) {
          return `刚通关了这个互动故事游戏的第${currentChapter}章，每个选择都影响剧情走向，太有意思了！`;
        }
      }
      return "推荐一个很棒的互动故事游戏，每个选择都会影响结局！";
    };

    return {
      title: getTimelineTitle(),
      imageUrl: "", // 可以设置朋友圈分享图片，建议使用正方形图片
      query: `from=timeline&chapter=${game?.progress?.currentChapter || 0}`, // 携带朋友圈分享来源
      success: (res) => {
        console.log("朋友圈分享成功");
        // 朋友圈分享成功后的逻辑
        // 可以在这里添加分享奖励
      },
      fail: (err) => {
        console.error("朋友圈分享失败:", err);
      },
    };
  });
}
