// 引子场景
import { getUIHelper } from "../utils/UIHelper.js";
import { getBackgroundUrl } from "../config/resourceConfig.js";

export class PrologueScene {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;

    // 获取UI辅助工具
    this.uiHelper = getUIHelper();

    this.scrollY = this.height * 0.7; // 从底部1/3位置开始
    this.scrollSpeed = 1; // 滚动速度

    // 加载背景图片
    this.backgroundImage = wx.createImage();
    this.backgroundImage.src = getBackgroundUrl("card-4");

    // 滚动的文字
    this.scrollingLines = [];

    // 文字显示相关属性
    this.inkEffects = []; // 存储文字效果对象
    this.lastInkTime = 0; // 上次生成文字的时间
    this.currentTextIndex = 0; // 当前显示的文字索引
    this.textRevealSpeed = 200; // 默认文字显示速度（毫秒），会在setText中动态调整
    this.lineSpacing = 24; // 行间距

    this.lineHeight = 40; // 行高
    this.totalHeight = this.scrollingLines.length * this.lineHeight;
    this.finished = false;
    this.onFinishCallback = null;
  }

  // 设置文字
  setText(text) {
    // 清理文字，去掉换行符和多余空格
    const cleanText = text.replace(/\n/g, "").replace(/\s+/g, "").trim();

    if (cleanText.length <= 0) {
      this.scrollingLines = [];
      return;
    }

    // 将文字按字符分割，准备竖直排列
    this.characters = cleanText.split("");
    this.scrollingLines = []; // 用于存储每列的文字

    // 根据字符数量动态调整显示速度，确保6秒内完成显示
    const totalChars = this.characters.length;
    const displayTime = 6000; // 6秒内显示完所有文字
    this.textRevealSpeed = Math.max(50, Math.floor(displayTime / totalChars)); // 最快50毫秒一个字符

    // 重置显示相关参数
    this.inkEffects = [];
    this.currentTextIndex = 0;
    this.lastInkTime = 0;
    this.finished = false;
  }

  // 设置完成回调
  setOnFinish(callback) {
    this.onFinishCallback = callback;
  }

  // 创建文字效果
  createTextEffect(text, x, y) {
    return {
      text: text,
      x: x,
      y: y,
      alpha: 0, // 透明度
      scale: 0.8, // 初始缩放
      startTime: Date.now(),
      duration: 1500, // 动画持续时间
    };
  }

  // 绘制场景
  draw() {
    const { ctx, width, height } = this;

    // 清空画布
    ctx.clearRect(0, 0, width, height);

    // 绘制背景图片
    if (this.backgroundImage) {
      ctx.drawImage(this.backgroundImage, 0, 0, width, height);
    }

    // 添加半透明黑色遮罩
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, width, height);

    // 设置文字样式 - 中国风配色
    ctx.save();
    ctx.fillStyle = "#F5E6D3"; // 宣纸色
    ctx.strokeStyle = "#8B4513"; // 深棕色描边
    ctx.lineWidth = 1.5;
    ctx.font = this.uiHelper.getFont(28, "FangSong", true); // 仪宋字体，稍大一些
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const now = Date.now();

    // 竖直排列参数
    const columnSpacing = 45; // 列间距
    const charHeight = 35; // 字符高度
    const maxColumnHeight = height * 0.7; // 最大列高度
    const maxCharsPerColumn = Math.floor(maxColumnHeight / charHeight); // 每列最多字符数
    const startX = width * 0.85; // 从右边85%位置开始
    const startY = height * 0.15; // 从顶部15%位置开始

    // 逐个显示字符
    if (
      this.characters &&
      this.characters.length > 0 &&
      now - this.lastInkTime > this.textRevealSpeed &&
      this.currentTextIndex < this.characters.length
    ) {
      // 计算当前字符应该在哪一列和哪一行
      const currentChar = this.characters[this.currentTextIndex];
      const columnIndex = Math.floor(this.currentTextIndex / maxCharsPerColumn);
      const rowIndex = this.currentTextIndex % maxCharsPerColumn;

      // 计算位置
      const x = startX - columnIndex * columnSpacing;
      const y = startY + rowIndex * charHeight;

      // 添加字符效果
      this.inkEffects.push(this.createTextEffect(currentChar, x, y));

      this.currentTextIndex++;
      this.lastInkTime = now;
    }

    // 管理文字效果的生命周期
    this.inkEffects.forEach((effect, index) => {
      const elapsed = now - effect.startTime;
      const progress = Math.min(elapsed / effect.duration, 1);

      effect.alpha = progress;
      effect.scale = 0.8 + progress * 0.2;
    });

    // 绘制文字效果 - 竖直书法风格
    this.inkEffects.forEach((effect, index) => {
      // 应用变换
      ctx.save();
      ctx.globalAlpha = effect.alpha;
      ctx.translate(effect.x, effect.y);
      ctx.scale(effect.scale, effect.scale);

      // 绘制阴影效果
      ctx.save();
      ctx.fillStyle = "rgba(139, 69, 19, 0.4)"; // 深棕色阴影
      ctx.translate(3, 3);
      ctx.fillText(effect.text, 0, 0);
      ctx.restore();

      // 绘制描边
      ctx.strokeText(effect.text, 0, 0);

      // 绘制主文字
      ctx.fillText(effect.text, 0, 0);

      ctx.restore();
    });

    ctx.restore();

    this.update();
  }

  update() {
    // 记录开始时间
    if (!this.startTime) {
      this.startTime = Date.now();
    }

    const now = Date.now();

    // 检查是否全部字符已显示
    const allTextShown =
      this.characters && this.currentTextIndex >= this.characters.length;

    // 如果所有文字都显示完了，记录完成显示的时间
    if (allTextShown && !this.allTextShownTime) {
      this.allTextShownTime = now;
    }

    const displayTime = 6000; // 6秒内显示完所有文字
    const readingTime = 4000; // 显示完后再给4秒阅读时间
    const totalTime = displayTime + readingTime; // 总共10秒

    // 场景结束条件：要么总时间到了，要么文字显示完且阅读时间到了
    const shouldEnd =
      now - this.startTime >= totalTime ||
      (allTextShown &&
        this.allTextShownTime &&
        now - this.allTextShownTime >= readingTime);

    if (shouldEnd && !this.finished) {
      this.finished = true;
      if (this.onFinishCallback) {
        this.onFinishCallback();
      }
    }
  }
}
