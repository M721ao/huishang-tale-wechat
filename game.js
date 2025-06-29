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
    this.progress = wx.getStorageSync("gameProgress") || {
      currentChapter: 1,
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

    // 设置标题场景的开始回调
    this.titleScene.setOnStart(() => {
      // 检查是否已登录
      if (this.userManager && this.userManager.isLoggedIn) {
        // 已登录，直接开始游戏
        this.startMainGame();
      } else {
        // 未登录，显示登录选项
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
      const chapter = this.chapterManager.getCurrentChapter();
      this.userManager.saveGameProgress(chapter);
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
      currentChapter: 1,
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
    // 显示游客模式文字链接
    this.titleScene.showGuestButton(true);

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
      // 已登录，显示“继续游戏”按钮
      this.titleScene.updateButtonText("继续游戏");
      this.titleScene.showGuestButton(false); // 隐藏游客模式按钮

      if (status.isGuestMode) {
        console.log("当前为游客模式");
      }
    } else {
      // 未登录，显示“开始游戏”按钮
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
      this.chapterManager.startChapterTitle();
    });
  }

  // 继续游戏
  continueGame() {
    const progress = loadProgress();
    if (progress) {
      this.progress = progress;
      this.chapterManager.currentChapter = progress.currentChapter;
      switch (progress.currentScene) {
        case "title":
          this.chapterManager.startChapterTitle();
          break;
        case "prologue":
          this.chapterManager.startChapterPrologue();
          break;
        case "story":
          this.chapterManager.startChapterStory();
          break;
        case "card":
          this.chapterManager.startChapterCards();
          break;
      }
    } else {
      this.startNewGame();
    }
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
  game.startNewGame();
  gameLoop();
};
