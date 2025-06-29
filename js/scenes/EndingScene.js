// 结局场景
import { getUIHelper } from "../utils/UIHelper.js";

export class EndingScene {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;

    // 获取UI辅助工具
    this.uiHelper = getUIHelper();
    this.title = "";
    this.description = "";
    this.imagePath = "";
    this.image = null;
    this.onFinish = null;
    this.alpha = 0;
    this.startTime = 0;

    // 创建中国风背景纹理
    this.backgroundPattern = this.createBackgroundPattern();
  }

  // 创建背景纹理
  createBackgroundPattern() {
    const size = 80;
    const canvas = wx.createCanvas();
    canvas.width = size;
    canvas.height = size;
    const patternCtx = canvas.getContext("2d");

    // 绘制中国传统纹理背景
    patternCtx.fillStyle = "#FDFBF7"; // 宣纸白
    patternCtx.fillRect(0, 0, size, size);

    // 绘制云纹纹理
    patternCtx.strokeStyle = "#8B4513"; // 深棕色
    patternCtx.lineWidth = 1;
    patternCtx.globalAlpha = 0.1;

    // 绘制简化的云纹图案
    const drawCloudPattern = (x, y) => {
      patternCtx.beginPath();
      patternCtx.moveTo(x, y + 10);
      patternCtx.quadraticCurveTo(x + 5, y, x + 10, y + 5);
      patternCtx.quadraticCurveTo(x + 15, y, x + 20, y + 10);
      patternCtx.quadraticCurveTo(x + 15, y + 15, x + 10, y + 12);
      patternCtx.quadraticCurveTo(x + 5, y + 15, x, y + 10);
      patternCtx.stroke();
    };

    // 在四个角落绘制云纹
    drawCloudPattern(10, 10);
    drawCloudPattern(size - 30, 10);
    drawCloudPattern(10, size - 30);
    drawCloudPattern(size - 30, size - 30);

    // 在中心区域绘制细密的云纹装饰
    patternCtx.globalAlpha = 0.05;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const x = 20 + i * 20;
        const y = 20 + j * 20;
        drawCloudPattern(x, y);
      }
    }

    return this.ctx.createPattern(canvas, "repeat");
  }

  // 初始化结局
  init(title, description, imagePath, onFinish) {
    this.title = title;
    this.description = description;
    this.imagePath = imagePath;
    this.onFinish = onFinish;
    this.alpha = 0;
    this.startTime = Date.now();

    // 加载结局图片
    this.image = wx.createImage();
    this.image.src = this.imagePath;
  }

  // 更新状态
  update() {
    const elapsed = Date.now() - this.startTime;
    if (elapsed < 1500) {
      // 使用缓动函数使渐变更自然
      const progress = Math.min(1, elapsed / 1500);
      this.alpha = this.easeInOutCubic(progress);
    } else {
      this.alpha = 1;
    }
  }

  // 缓动函数
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // 绘制场景
  draw() {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = this.alpha;

    // 绘制背景纹理
    ctx.fillStyle = this.backgroundPattern;
    ctx.fillRect(0, 0, this.width, this.height);

    // 添加半透明遮罩
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(0, 0, this.width, this.height);

    // 绘制主内容区域
    this.drawMainContent(ctx);

    ctx.restore();
  }

  // 绘制主内容区域
  drawMainContent(ctx) {
    const contentWidth = this.width * 0.9;
    const contentHeight = this.height * 0.85;
    const contentX = (this.width - contentWidth) / 2;
    const contentY = (this.height - contentHeight) / 2;

    // 绘制内容区域背景
    ctx.fillStyle = "#FDFBF7"; // 宣纸白
    ctx.fillRect(contentX, contentY, contentWidth, contentHeight);

    // 绘制外边框
    ctx.strokeStyle = "#8B4513"; // 深棕色
    ctx.lineWidth = 3;
    ctx.strokeRect(contentX, contentY, contentWidth, contentHeight);

    // 绘制内边框装饰
    ctx.strokeStyle = "#8B4513";
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4;
    ctx.strokeRect(
      contentX + 10,
      contentY + 10,
      contentWidth - 20,
      contentHeight - 20
    );
    ctx.globalAlpha = 1;

    // 绘制四个角的装饰
    ctx.fillStyle = "#8B4513";
    ctx.globalAlpha = 0.7;
    const cornerSize = 12;

    // 左上角
    ctx.fillRect(contentX - 2, contentY - 2, cornerSize, cornerSize);
    // 右上角
    ctx.fillRect(
      contentX + contentWidth - cornerSize + 2,
      contentY - 2,
      cornerSize,
      cornerSize
    );
    // 左下角
    ctx.fillRect(
      contentX - 2,
      contentY + contentHeight - cornerSize + 2,
      cornerSize,
      cornerSize
    );
    // 右下角
    ctx.fillRect(
      contentX + contentWidth - cornerSize + 2,
      contentY + contentHeight - cornerSize + 2,
      cornerSize,
      cornerSize
    );
    ctx.globalAlpha = 1;

    // 绘制顶部装饰区域
    this.drawTopDecoration(ctx, contentX, contentY, contentWidth);

    // 绘制结局图片
    if (this.image && this.image.complete) {
      const imageWidth = contentWidth * 0.6;
      const imageHeight = contentHeight * 0.4;
      const imageX = contentX + (contentWidth - imageWidth) / 2;
      const imageY = contentY + 80;

      // 绘制图片阴影
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;

      ctx.drawImage(this.image, imageX, imageY, imageWidth, imageHeight);

      // 重置阴影
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // 绘制图片边框
      ctx.strokeStyle = "#8B4513";
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.3;
      ctx.strokeRect(imageX, imageY, imageWidth, imageHeight);
      ctx.globalAlpha = 1;
    }

    // 绘制标题区域
    this.drawTitleSection(ctx, contentX, contentY, contentWidth, contentHeight);

    // 绘制描述区域
    this.drawDescriptionSection(
      ctx,
      contentX,
      contentY,
      contentWidth,
      contentHeight
    );

    // 绘制底部装饰
    this.drawBottomDecoration(
      ctx,
      contentX,
      contentY,
      contentWidth,
      contentHeight
    );
  }

  // 绘制顶部装饰
  drawTopDecoration(ctx, x, y, width) {
    const decorationHeight = 60;
    const decorationY = y + 20;

    // 绘制装饰性分隔线
    ctx.strokeStyle = "#8B4513";
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;

    // 左侧装饰线
    ctx.beginPath();
    ctx.moveTo(x + 40, decorationY + decorationHeight / 2);
    ctx.lineTo(x + width / 2 - 80, decorationY + decorationHeight / 2);
    ctx.stroke();

    // 右侧装饰线
    ctx.beginPath();
    ctx.moveTo(x + width / 2 + 80, decorationY + decorationHeight / 2);
    ctx.lineTo(x + width - 40, decorationY + decorationHeight / 2);
    ctx.stroke();

    // 绘制装饰性圆点
    ctx.fillStyle = "#8B4513";
    ctx.globalAlpha = 0.8;

    // 左侧圆点
    ctx.beginPath();
    ctx.arc(x + 35, decorationY + decorationHeight / 2, 4, 0, Math.PI * 2);
    ctx.fill();

    // 右侧圆点
    ctx.beginPath();
    ctx.arc(
      x + width - 35,
      decorationY + decorationHeight / 2,
      4,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // 绘制中心装饰
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(
      this.width / 2,
      decorationY + decorationHeight / 2,
      6,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.globalAlpha = 1;
  }

  // 绘制标题区域
  drawTitleSection(ctx, x, y, width, height) {
    const titleY = y + height * 0.55;

    // 绘制标题背景装饰
    ctx.fillStyle = "#8B4513";
    ctx.globalAlpha = 0.15;
    ctx.fillRect(x + width * 0.15, titleY - 20, width * 0.7, 50);
    ctx.globalAlpha = 1;

    // 绘制标题
    ctx.fillStyle = "#5C3317"; // 深棕色
    ctx.font = this.uiHelper.getFont(24, "FangSong", true);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.title, this.width / 2, titleY + 5);
  }

  // 绘制描述区域
  drawDescriptionSection(ctx, x, y, width, height) {
    const descY = y + height * 0.7;

    // 绘制描述文本
    ctx.font = this.uiHelper.getFont(18, "FangSong");
    ctx.fillStyle = "#5C3317";
    ctx.globalAlpha = 0.9;
    this.drawWrappedText(
      ctx,
      this.description,
      this.width / 2,
      descY,
      width * 0.8,
      28
    );
    ctx.globalAlpha = 1;
  }

  // 绘制底部装饰
  drawBottomDecoration(ctx, x, y, width, height) {
    const bottomY = y + height * 0.9;

    // 绘制装饰性分隔线
    ctx.strokeStyle = "#8B4513";
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.4;

    const lineWidth = width * 0.7;
    ctx.beginPath();
    ctx.moveTo(x + (width - lineWidth) / 2, bottomY);
    ctx.lineTo(x + (width + lineWidth) / 2, bottomY);
    ctx.stroke();

    // 绘制提示文本
    const now = Date.now();
    const pulseFactor = 0.4 + 0.6 * Math.sin(now / 1000); // 更缓慢的脉动效果

    ctx.font = this.uiHelper.getFont(16, "FangSong");
    ctx.fillStyle = `rgba(139, 69, 19, ${0.4 + 0.5 * pulseFactor})`; // 深棕色脉动
    ctx.fillText("点击屏幕继续", this.width / 2, bottomY + 30);

    ctx.globalAlpha = 1;
  }

  // 绘制自动换行文本
  drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split("");
    let line = "";
    let posY = y;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i];
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, x, posY);
        line = words[i];
        posY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, posY);
  }

  // 处理点击
  handleTap() {
    if (this.onFinish) {
      this.onFinish();
    }
  }
}
