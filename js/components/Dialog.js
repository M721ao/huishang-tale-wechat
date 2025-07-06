// 自定义弹窗组件
export class Dialog {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.visible = false;
    this.content = "";
    this.onClose = null;
    this.startTime = 0;
    this.duration = 5000;
    this.alpha = 0; // 用于淡入淡出效果
  }

  // 显示弹窗
  show(content, onClose) {
    this.content = content;
    this.onClose = onClose;
    this.visible = true;
    this.startTime = Date.now();
    this.alpha = 0;
  }

  // 更新状态
  update() {
    if (!this.visible) return;

    const elapsed = Date.now() - this.startTime;

    // 淡入效果
    if (elapsed < 200) {
      this.alpha = elapsed / 200;
    }
    // 淡出效果
    else if (elapsed > this.duration - 200) {
      this.alpha = Math.max(0, 1 - (elapsed - (this.duration - 200)) / 200);
      if (this.alpha === 0) {
        this.visible = false;
        if (this.onClose) {
          this.onClose();
        }
      }
    }
    // 保持显示
    else {
      this.alpha = 1;
    }
  }

  // 绘制弹窗
  draw() {
    if (!this.visible) return;

    const ctx = this.ctx;
    const dialogWidth = this.width * 0.75;
    const dialogHeight = this.height * 0.25;
    const x = (this.width - dialogWidth) / 2;
    const y = this.height * 0.35;

    ctx.save();

    // 设置透明度
    ctx.globalAlpha = this.alpha;

    // 绘制半透明背景
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, this.width, this.height);

    // 绘制古典风格弹窗
    this.drawClassicDialog(ctx, x, y, dialogWidth, dialogHeight);

    ctx.restore();

    // 更新状态
    this.update();
  }

  // 绘制古典风格弹窗
  drawClassicDialog(ctx, x, y, width, height) {
    // 绘制外阴影
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fillRect(x + 4, y + 4, width, height);

    // 绘制主背景 - 宣纸色
    ctx.fillStyle = "#FDFBF7";
    ctx.fillRect(x, y, width, height);

    // 绘制外边框
    ctx.strokeStyle = "#8B4513";
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);

    // 绘制内边框装饰
    ctx.strokeStyle = "#8B4513";
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4;
    ctx.strokeRect(x + 8, y + 8, width - 16, height - 16);
    ctx.globalAlpha = 1;

    // 绘制四个角的装饰
    ctx.fillStyle = "#8B4513";
    ctx.globalAlpha = 0.6;
    const cornerSize = 6;

    // 左上角
    ctx.fillRect(x - 2, y - 2, cornerSize, cornerSize);
    // 右上角
    ctx.fillRect(x + width - cornerSize + 2, y - 2, cornerSize, cornerSize);
    // 左下角
    ctx.fillRect(x - 2, y + height - cornerSize + 2, cornerSize, cornerSize);
    // 右下角
    ctx.fillRect(
      x + width - cornerSize + 2,
      y + height - cornerSize + 2,
      cornerSize,
      cornerSize
    );
    ctx.globalAlpha = 1;

    // 绘制装饰性分隔线
    const lineY = y + height * 0.15;
    ctx.strokeStyle = "#8B4513";
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.moveTo(x + 20, lineY);
    ctx.lineTo(x + width - 20, lineY);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // 绘制文字
    ctx.fillStyle = "#5C3317";
    ctx.font = "18px FangSong";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // 自动换行显示文字
    const maxWidth = width * 0.85;
    const words = this.content.split("");
    let line = "";
    let posY = y + height * 0.4;
    const lineHeight = 28;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i];
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, this.width / 2, posY);
        line = words[i];
        posY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, this.width / 2, posY);
  }
}
