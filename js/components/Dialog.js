// 自定义弹窗组件
export class Dialog {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.visible = false;
    this.content = "";
    this.title = ""; // 标题
    this.showButton = false; // 是否显示按钮
    this.buttonText = "我知道了"; // 按钮文字
    this.onClose = null;
    this.startTime = 0;
    this.duration = 5000;
    this.alpha = 0; // 用于淡入淡出效果

    // 按钮相关属性
    this.buttonPressed = false;
  }

  // 显示弹窗
  show(options) {
    // 支持传入字符串（兼容旧版本）或对象参数
    if (typeof options === "string") {
      this.content = options;
      this.title = "";
      this.showButton = false;
      this.buttonText = "我知道了";
      this.onClose = arguments[1] || null;
      this.duration = 5000;
    } else {
      this.content = options.content || "";
      this.title = options.title || "";
      this.showButton = options.showButton === true; // 需要明确设置为true才显示
      this.buttonText = options.buttonText || "我知道了";
      this.onClose = options.onClose || null;
      this.duration = options.duration || 5000;
    }

    this.visible = true;
    this.startTime = Date.now();
    this.alpha = 0;
    this.buttonPressed = false;
  }

  // 处理触摸事件
  handleTouch(x, y) {
    console.log("Dialog handleTouch called:", {
      x,
      y,
      visible: this.visible,
      showButton: this.showButton,
    });

    if (!this.visible || !this.showButton) return false;

    const buttonRect = this.getButtonRect();
    console.log("Button rect:", buttonRect);

    if (this.isPointInRect(x, y, buttonRect)) {
      console.log("Button clicked! Closing dialog...");
      this.buttonPressed = true;
      this.close();
      return true;
    }
    console.log("Touch outside button area");
    return false;
  }

  // 获取按钮矩形区域
  getButtonRect() {
    const dialogWidth = this.width * 0.75;
    const dialogHeight = this.height * 0.35; // 增加高度以容纳标题和按钮
    const dialogX = (this.width - dialogWidth) / 2;
    const dialogY = this.height * 0.325;

    const buttonWidth = 120;
    const buttonHeight = 40;
    const buttonX = dialogX + (dialogWidth - buttonWidth) / 2;
    const buttonY = dialogY + dialogHeight - 60;

    return { x: buttonX, y: buttonY, width: buttonWidth, height: buttonHeight };
  }

  // 检查点是否在矩形内
  isPointInRect(x, y, rect) {
    return (
      x >= rect.x &&
      x <= rect.x + rect.width &&
      y >= rect.y &&
      y <= rect.y + rect.height
    );
  }

  // 关闭弹窗
  close() {
    console.log("Dialog closing, onClose callback:", this.onClose);
    this.visible = false;
    if (this.onClose) {
      console.log("Calling onClose callback");
      this.onClose();
    }
  }

  // 更新状态
  update() {
    if (!this.visible) return;

    const elapsed = Date.now() - this.startTime;

    // 如果显示按钮，则不自动关闭
    if (this.showButton) {
      // 淡入效果
      if (elapsed < 200) {
        this.alpha = elapsed / 200;
      } else {
        this.alpha = 1;
      }
    } else {
      // 原有的自动关闭逻辑
      // 淡入效果
      if (elapsed < 200) {
        this.alpha = elapsed / 200;
      }
      // 淡出效果
      else if (elapsed > this.duration - 200) {
        this.alpha = Math.max(0, 1 - (elapsed - (this.duration - 200)) / 200);
        if (this.alpha === 0) {
          this.close();
        }
      }
      // 保持显示
      else {
        this.alpha = 1;
      }
    }
  }

  // 绘制弹窗
  draw() {
    if (!this.visible) return;

    const ctx = this.ctx;
    const dialogWidth = this.width * 0.75;
    const dialogHeight = this.height * 0.35; // 增加高度以容纳标题和按钮
    const x = (this.width - dialogWidth) / 2;
    const y = this.height * 0.325;

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

    // 绘制标题（如果有）
    if (this.title) {
      ctx.fillStyle = "#8B4513";
      ctx.font = "bold 20px FangSong";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(this.title, x + width / 2, y + 35);

      // 绘制标题下方的装饰线
      const titleLineY = y + 55;
      ctx.strokeStyle = "#8B4513";
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.moveTo(x + 30, titleLineY);
      ctx.lineTo(x + width - 30, titleLineY);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // 计算内容区域
    const contentStartY = this.title ? y + 75 : y + 30;
    const contentEndY = this.showButton ? y + height - 80 : y + height - 30;
    const contentHeight = contentEndY - contentStartY;

    // 绘制内容文字
    ctx.fillStyle = "#5C3317";
    ctx.font = "18px FangSong";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // 自动换行显示文字
    const maxWidth = width * 0.85;
    const words = this.content.split("");
    let line = "";
    let posY = contentStartY + 20;
    const lineHeight = 28;
    const maxLines = Math.floor(contentHeight / lineHeight);
    let currentLine = 0;

    for (let i = 0; i < words.length && currentLine < maxLines; i++) {
      const testLine = line + words[i];
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, x + width / 2, posY);
        line = words[i];
        posY += lineHeight;
        currentLine++;
      } else {
        line = testLine;
      }
    }

    // 绘制最后一行
    if (currentLine < maxLines && line) {
      ctx.fillText(line, x + width / 2, posY);
    }

    // 绘制按钮（如果启用）
    if (this.showButton) {
      const buttonRect = this.getButtonRect();
      this.drawButton(ctx, buttonRect);
    }
  }

  // 绘制按钮
  drawButton(ctx, rect) {
    const { x, y, width, height } = rect;

    // 按钮阴影
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(x + 2, y + 2, width, height);

    // 按钮背景
    if (this.buttonPressed) {
      ctx.fillStyle = "#D2B48C"; // 按下时的颜色
    } else {
      ctx.fillStyle = "#F5E6D3"; // 正常状态
    }
    ctx.fillRect(x, y, width, height);

    // 按钮边框
    ctx.strokeStyle = "#8B4513";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    // 按钮内边框装饰
    ctx.strokeStyle = "#8B4513";
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    ctx.strokeRect(x + 3, y + 3, width - 6, height - 6);
    ctx.globalAlpha = 1;

    // 按钮文字
    ctx.fillStyle = "#5C3317";
    ctx.font = "bold 16px FangSong";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.buttonText, x + width / 2, y + height / 2);
  }
}
