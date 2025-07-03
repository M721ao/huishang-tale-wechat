import { getUIHelper } from "../utils/UIHelper.js";
import { getBackgroundUrl } from "../config/resourceConfig.js";

export class ChapterTitleScene {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;

    // 获取UI辅助工具
    this.uiHelper = getUIHelper();
    this.title = "";
    this.subtitle = "";
    this.startTime = 0;
    this.duration = 3000; // 3秒后自动消失
    this.onFinishCallback = null;

    // 转场动画状态
    this.sceneOpacity = 0; // 场景整体透明度
    this.titleOpacity = 0; // 标题透明度
    this.subtitleOpacity = 0; // 副标题透明度
    this.decorationOpacity = 0; // 装饰元素透明度
    this.animationTimer = 0; // 动画计时器
    this.isAnimating = true; // 是否正在动画中

    // 加载背景图片
    this.backgroundImage = wx.createImage();
    this.backgroundImage.onload = () => {
      this.draw();
    };

    // 根据章节设置不同的背景图片
    this.currentChapter = 1; // 默认第一章
  }

  // 设置章节标题
  setTitle(title, subtitle = "") {
    this.title = title;

    // 根据标题设置章节编号
    const chapterMatch = title.match(/第(\d+)章/);
    if (chapterMatch) {
      this.currentChapter = parseInt(chapterMatch[1]);
    }

    // 根据章节设置副标题和背景图片
    switch (this.currentChapter) {
      case 1:
        this.subtitle = subtitle || "徽商缘起";
        this.backgroundImage.src = getBackgroundUrl("bg-cha1");
        break;
      case 2:
        this.subtitle = subtitle || "盐引之争";
        this.backgroundImage.src = getBackgroundUrl("bg-cha2");
        break;
      case 3:
        this.subtitle = subtitle || "诗书商道";
        this.backgroundImage.src = getBackgroundUrl("bg-cha3");
        break;
      case 4:
        this.subtitle = subtitle || "无徽不成镇";
        this.backgroundImage.src = getBackgroundUrl("bg-cha4");
        break;
      case 5:
        this.subtitle = subtitle || "风雨飘摇";
        this.backgroundImage.src = getBackgroundUrl("bg-cha5");
        break;
      case 6:
        this.subtitle = subtitle || "红顶落幕";
        this.backgroundImage.src = getBackgroundUrl("bg-cha6");
        break;
      case 7:
        this.subtitle = subtitle || "金字招牌";
        this.backgroundImage.src = getBackgroundUrl("bg-cha7");
        break;
      default:
        this.subtitle = subtitle || "";
        this.backgroundImage.src = getBackgroundUrl("bg-cha7");
    }

    this.startTime = Date.now();

    // 开始转场动画
    this.startTransition();
  }

  // 开始转场动画
  startTransition() {
    this.sceneOpacity = 0;
    this.titleOpacity = 0;
    this.subtitleOpacity = 0;
    this.decorationOpacity = 0;
    this.animationTimer = 0;
    this.isAnimating = true;
  }

  // 更新动画
  update() {
    if (!this.isAnimating) return;

    this.animationTimer++;

    // 场景整体淡入 (0-45帧)
    if (this.animationTimer <= 45) {
      this.sceneOpacity = this.animationTimer / 45;
    }

    // 装饰元素淡入 (15-60帧)
    if (this.animationTimer >= 15 && this.animationTimer <= 60) {
      this.decorationOpacity = (this.animationTimer - 15) / 45;
    }

    // 标题淡入 (30-75帧)
    if (this.animationTimer >= 30 && this.animationTimer <= 75) {
      this.titleOpacity = (this.animationTimer - 30) / 45;
    }

    // 副标题淡入 (45-90帧)
    if (this.animationTimer >= 45 && this.animationTimer <= 90) {
      this.subtitleOpacity = (this.animationTimer - 45) / 45;
    }

    // 动画完成
    if (this.animationTimer >= 90) {
      this.isAnimating = false;
      this.sceneOpacity = 1;
      this.titleOpacity = 1;
      this.subtitleOpacity = 1;
      this.decorationOpacity = 1;
    }
  }

  // 设置完成回调
  setOnFinish(callback) {
    this.onFinishCallback = callback;
  }

  // 绘制场景
  draw() {
    const { ctx, width, height, title, subtitle } = this;

    // 清空画布
    ctx.clearRect(0, 0, width, height);

    // 绘制背景
    if (this.backgroundImage) {
      ctx.save();
      ctx.globalAlpha = this.sceneOpacity;
      ctx.drawImage(this.backgroundImage, 0, 0, width, height);
      ctx.restore();
    }

    // 添加半透明黑色遮罩（可选，淡化遮罩）
    ctx.save();
    ctx.globalAlpha = 0.25 * this.sceneOpacity; // 更淡的遮罩
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    // 装饰线条
    ctx.save();
    ctx.globalAlpha = this.decorationOpacity;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width * 0.2, height * 0.38);
    ctx.lineTo(width * 0.8, height * 0.38);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(width * 0.2, height * 0.62);
    ctx.lineTo(width * 0.8, height * 0.62);
    ctx.stroke();
    ctx.restore();

    // 绘制标题
    ctx.save();
    ctx.globalAlpha = this.titleOpacity;
    ctx.fillStyle = "#fff";
    ctx.font = this.uiHelper.getFont(32, "FangSong", true);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 8;
    ctx.fillText("-- " + title + " --", width / 2, height * 0.45);
    ctx.restore();

    // 绘制副标题
    if (subtitle) {
      ctx.save();
      ctx.globalAlpha = this.subtitleOpacity;
      ctx.font = this.uiHelper.getFont(48, "FangSong");
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "#000";
      ctx.shadowBlur = 12;
      ctx.fillText(subtitle, width / 2, height * 0.55);
      ctx.restore();
    }

    // 检查是否需要结束
    if (Date.now() - this.startTime >= this.duration) {
      if (this.onFinishCallback) {
        this.onFinishCallback();
      }
    }
  }
}
