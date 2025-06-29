// 标题场景
import { getUIHelper } from "../utils/UIHelper.js";

export class TitleScene {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;

    // 获取UI辅助工具
    this.uiHelper = getUIHelper();

    // 主按钮配置
    this.button = {
      text: "开始游戏",
      x: width / 2,
      y: height * 0.68,
      width: 180,
      height: 50,
    };

    // 游客模式文字链接配置
    this.guestText = {
      text: "游客模式",
      x: width / 2,
      y: height * 0.78,
      visible: false, // 默认不显示，需要时再显示
      color: "#8B4513", // 使用主按钮的棕色
    };

    // 加载封面图片
    this.coverImage = wx.createImage();
    this.coverImage.src = "images/cover.png";
  }

  // 处理点击事件
  handleTap(x, y) {
    // 检查主按钮点击
    const btn = this.button;
    if (
      x >= btn.x - btn.width / 2 &&
      x <= btn.x + btn.width / 2 &&
      y >= btn.y - btn.height / 2 &&
      y <= btn.y + btn.height / 2
    ) {
      if (this.onStart) {
        this.onStart();
      }
    }

    // 检查游客模式文字点击
    const guestText = this.guestText;
    if (
      guestText.visible &&
      x >= guestText.x - 50 &&
      x <= guestText.x + 50 &&
      y >= guestText.y - 20 &&
      y <= guestText.y + 20
    ) {
      if (this.onGuestMode) {
        this.onGuestMode();
      }
    }
  }

  // 设置开始回调
  setOnStart(callback) {
    this.onStart = callback;
  }

  // 设置游客模式回调
  setOnGuestMode(callback) {
    this.onGuestMode = callback;
  }

  // 更新按钮文本
  updateButtonText(text) {
    this.button.text = text;
  }

  // 显示/隐藏游客模式文字
  showGuestButton(visible) {
    if (this.guestText) {
      this.guestText.visible = visible;
    }
  }

  // 绘制场景
  draw() {
    const { ctx, width, height, button } = this;

    // 绘制背景
    if (this.coverImage) {
      ctx.drawImage(this.coverImage, 0, 0, width, height);
    }

    // 绘制按钮
    ctx.save();

    // 绘制主按钮
    this.drawButton(ctx, button, button.text);

    // 如果游客模式文字可见，绘制游客模式文字
    if (this.guestText && this.guestText.visible) {
      this.drawGuestText(ctx);
    }

    ctx.restore();

    // 绘制历史声明
    this.drawHistoricalDisclaimer();
  }

  // 绘制按钮的通用方法
  drawButton(ctx, button, text, color = "#D4AF37") {
    const x = button.x - button.width / 2;
    const y = button.y - button.height / 2;

    // 绘制外框
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, button.width, button.height);

    // 绘制内框
    ctx.strokeStyle = this.darkenColor(color);
    ctx.strokeRect(x + 4, y + 4, button.width - 8, button.height - 8);

    // 绘制装饰角
    const cornerSize = button.height > 45 ? 10 : 8; // 根据按钮大小调整角大小
    ctx.strokeStyle = color;
    // 左上角
    ctx.beginPath();
    ctx.moveTo(x - 2, y + cornerSize);
    ctx.lineTo(x - 2, y - 2);
    ctx.lineTo(x + cornerSize, y - 2);
    ctx.stroke();
    // 右上角
    ctx.beginPath();
    ctx.moveTo(x + button.width + 2, y + cornerSize);
    ctx.lineTo(x + button.width + 2, y - 2);
    ctx.lineTo(x + button.width - cornerSize, y - 2);
    ctx.stroke();
    // 左下角
    ctx.beginPath();
    ctx.moveTo(x - 2, y + button.height - cornerSize);
    ctx.lineTo(x - 2, y + button.height + 2);
    ctx.lineTo(x + cornerSize, y + button.height + 2);
    ctx.stroke();
    // 右下角
    ctx.beginPath();
    ctx.moveTo(x + button.width + 2, y + button.height - cornerSize);
    ctx.lineTo(x + button.width + 2, y + button.height + 2);
    ctx.lineTo(x + button.width - cornerSize, y + button.height + 2);
    ctx.stroke();

    // 绘制文字
    ctx.fillStyle = color;
    ctx.shadowColor = "#000000";
    ctx.shadowBlur = 2;
    ctx.font =
      button.height > 45
        ? this.uiHelper.getFont(28, "FangSong", true)
        : this.uiHelper.getFont(22, "FangSong", true);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, button.x, button.y);
  }

  // 颜色加深方法
  darkenColor(color) {
    // 简单处理几种常见颜色
    if (color === "#D4AF37") return "#8B4513"; // 金色变棕色
    if (color === "#5F9EA0") return "#2F4F4F"; // 青绿色变深青绿色
    return color; // 默认返回原色
  }

  // 绘制游客模式文字
  drawGuestText(ctx) {
    ctx.save();
    ctx.fillStyle = this.guestText.color;
    ctx.font = this.uiHelper.getFont(18, "FangSong");
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // 添加下划线效果
    const textWidth = ctx.measureText(this.guestText.text).width;
    const x = this.guestText.x;
    const y = this.guestText.y;

    // 绘制文字
    ctx.fillText(this.guestText.text, x, y);

    // 绘制下划线
    ctx.beginPath();
    ctx.moveTo(x - textWidth / 2, y + 12);
    ctx.lineTo(x + textWidth / 2, y + 12);
    ctx.strokeStyle = this.guestText.color;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }

  // 绘制圆角矩形
  drawRoundRect(x, y, width, height, radius) {
    const { ctx } = this;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // 绘制历史声明
  drawHistoricalDisclaimer() {
    const ctx = this.ctx;
    ctx.save();

    ctx.fillStyle = "rgba(244, 236, 228, 0.6)";
    ctx.font = this.uiHelper.getFont(12, "FangSong");
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(
      "游戏对历史事件进行了艺术改编，与真实历史存在差异",
      this.width / 2,
      this.height - 10
    );

    ctx.restore();
  }
}
