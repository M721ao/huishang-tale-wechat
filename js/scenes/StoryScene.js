// 故事场景
import { getUIHelper } from "../utils/UIHelper.js";
import { getImageUrl, getBackgroundUrl } from "../config/resourceConfig.js";

export class StoryScene {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;

    // 获取UI辅助工具
    this.uiHelper = getUIHelper();

    // 文字显示区域设置
    this.textAreaHeight = height * 0.28; // 降低文字区域高度从0.35到0.28
    this.textAreaY = height - this.textAreaHeight;
    this.padding = 25; // 增加内边距

    // 文字动画设置
    this.currentText = "";
    this.targetText = "";
    this.textSpeed = 1.5; // 稍微减慢打字速度
    this.isTyping = false;
    this.textOpacity = 0; // 文字透明度动画

    // 当前剧情进度
    this.currentScriptIndex = 0;
    this.currentScript = null;

    // 角色名称显示区域
    this.nameBoxWidth = 180; // 增加名称框宽度
    this.nameBoxHeight = 45; // 增加名称框高度
    this.nameBoxX = this.padding;
    this.nameBoxY = this.textAreaY - this.nameBoxHeight - 10; // 增加间距
    this.nameOpacity = 0; // 名称透明度动画

    // 角色立绘动画
    this.characterOpacity = 0;
    this.characterScale = 0.8;
    this.characterTargetScale = 1.0;

    // 背景切换动画
    this.backgroundOpacity = 1;
    this.newBackgroundImage = null;
    this.isBackgroundTransitioning = false;

    // 点击提示动画
    this.clickHintOpacity = 0;
    this.clickHintTimer = 0;

    // 回调函数
    this.onFinishCallback = null;
  }

  // 加载剧情脚本
  loadScript(script) {
    this.currentScript = script;
    this.currentScriptIndex = 0;
    this.showNextDialogue();
  }

  // 设置结束回调
  setOnFinish(callback) {
    this.onFinishCallback = callback;
  }

  // 显示下一段对话
  showNextDialogue() {
    if (
      !this.currentScript ||
      this.currentScriptIndex >= this.currentScript.length
    ) {
      if (this.onFinishCallback) {
        this.onFinishCallback();
      }
      return;
    }

    const dialogue = this.currentScript[this.currentScriptIndex];
    this.targetText = dialogue.text;
    this.currentText = "";
    this.isTyping = true;
    this.currentCharacter = dialogue.character;
    this.currentPosition = dialogue.position || "center";

    // 重置动画状态
    this.textOpacity = 0;
    this.nameOpacity = 0;
    this.characterOpacity = 0;
    this.characterScale = 0.8;
    this.clickHintOpacity = 0;

    // 加载背景图片
    this.loadCurrentBackground(dialogue);

    // 加载立绘如果有的话
    if (
      dialogue.character &&
      dialogue.characterImage &&
      typeof dialogue.characterImage === "string" &&
      dialogue.characterImage.trim() !== ""
    ) {
      const img = wx.createImage();
      img.onload = () => {
        this.characterImage = img;
        // 延迟显示角色立绘
        setTimeout(() => {
          this.characterOpacity = 1;
        }, 200);
      };
      // 转换为COS链接
      img.src = getImageUrl(dialogue.characterImage);
    } else {
      this.characterImage = null;
    }
  }

  // 处理点击事件
  handleTap() {
    if (this.isTyping) {
      // 如果正在打字，则直接显示完整文本
      this.currentText = this.targetText;
      this.isTyping = false;
      this.textOpacity = 1;
    } else {
      // 否则显示下一段对话
      this.currentScriptIndex++;
      this.showNextDialogue();
    }
  }

  // 更新文字动画
  update() {
    // 更新文字透明度
    if (this.textOpacity < 1) {
      this.textOpacity = Math.min(1, this.textOpacity + 0.05);
    }

    // 更新名称透明度
    if (this.nameOpacity < 1) {
      this.nameOpacity = Math.min(1, this.nameOpacity + 0.08);
    }

    // 更新角色立绘动画
    if (this.characterOpacity < 1) {
      this.characterOpacity = Math.min(1, this.characterOpacity + 0.03);
    }
    if (this.characterScale < this.characterTargetScale) {
      this.characterScale = Math.min(
        this.characterTargetScale,
        this.characterScale + 0.02
      );
    }

    // 更新背景切换动画
    if (this.isBackgroundTransitioning && this.backgroundOpacity < 1) {
      this.backgroundOpacity = Math.min(1, this.backgroundOpacity + 0.02);
    }

    // 更新打字动画
    if (this.isTyping && this.currentText !== this.targetText) {
      const nextCharCount = Math.min(
        this.textSpeed,
        this.targetText.length - this.currentText.length
      );
      this.currentText += this.targetText.substr(
        this.currentText.length,
        nextCharCount
      );

      if (this.currentText === this.targetText) {
        this.isTyping = false;
      }
    }

    // 更新点击提示动画
    if (!this.isTyping && this.currentText === this.targetText) {
      this.clickHintTimer += 1;
      if (this.clickHintTimer > 60) {
        // 1秒后开始显示提示，减少闪动频率
        this.clickHintOpacity =
          0.4 + 0.15 * Math.sin(this.clickHintTimer * 0.05); // 降低频率和幅度
      }
    } else {
      this.clickHintTimer = 0;
      this.clickHintOpacity = 0;
    }
  }

  // 绘制场景
  draw() {
    const { ctx, width, height } = this;

    // 清空画布
    ctx.clearRect(0, 0, width, height);

    // 绘制背景（完全原色显示，无任何遮罩）
    if (this.backgroundImage) {
      // 确保背景图片完全原色显示，不使用透明度
      ctx.save();
      ctx.globalAlpha = 1.0; // 强制完全不透明
      // 计算背景图片的显示区域（不包含文字区域）
      const bgHeight = height - this.textAreaHeight;
      ctx.drawImage(this.backgroundImage, 0, 0, width, bgHeight);
      ctx.restore();
    } else {
      // 默认渐变背景
      const gradient = ctx.createLinearGradient(
        0,
        0,
        0,
        height - this.textAreaHeight
      );
      gradient.addColorStop(0, "#1a1a2e");
      gradient.addColorStop(1, "#16213e");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height - this.textAreaHeight);
    }

    // 绘制立绘
    if (this.characterImage) {
      ctx.save();
      ctx.globalAlpha = this.characterOpacity;

      const charWidth = height * 0.85;
      const charHeight = height * 0.85;
      let charX = 0;

      switch (this.currentPosition) {
        case "left":
          charX = -charWidth * 0.25;
          break;
        case "right":
          charX = width - charWidth * 0.75;
          break;
        default: // center
          charX = (width - charWidth) / 2;
      }

      // 应用缩放动画
      const scaledWidth = charWidth * this.characterScale;
      const scaledHeight = charHeight * this.characterScale;
      const scaledX = charX + (charWidth - scaledWidth) / 2;
      const scaledY = height - charHeight + (charHeight - scaledHeight) / 2;

      ctx.drawImage(
        this.characterImage,
        scaledX,
        scaledY,
        scaledWidth,
        scaledHeight
      );
      ctx.restore();
    }

    // 绘制文字区域（古典中国风，简洁优雅）
    // 深色半透明背景
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(0, this.textAreaY, width, this.textAreaHeight);

    // 淡金色细边框
    ctx.strokeStyle = "rgba(212, 175, 55, 0.6)";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, this.textAreaY, width, this.textAreaHeight);

    // 绘制角色名称框（古典风格）
    if (this.currentCharacter) {
      ctx.save();
      ctx.globalAlpha = this.nameOpacity;

      // 名称框背景（深棕色半透明）
      ctx.fillStyle = "rgba(101, 67, 33, 0.9)";
      this.drawRoundedRect(
        ctx,
        this.nameBoxX,
        this.nameBoxY,
        this.nameBoxWidth,
        this.nameBoxHeight,
        6
      );

      // 淡金色边框
      ctx.strokeStyle = "rgba(212, 175, 55, 0.8)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 绘制角色名称
      ctx.fillStyle = "#F4ECE4";
      ctx.font = this.uiHelper.getFont(22, "FangSong", true);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        this.currentCharacter,
        this.nameBoxX + this.nameBoxWidth / 2,
        this.nameBoxY + this.nameBoxHeight / 2
      );
      ctx.restore();
    }

    // 绘制对话文字
    ctx.save();
    ctx.globalAlpha = this.textOpacity;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    this.drawWrappedText(
      this.currentText,
      this.padding + 15,
      this.textAreaY + this.padding + 10,
      width - (this.padding + 15) * 2
    );
    ctx.restore();

    // 绘制点击提示
    if (this.clickHintOpacity > 0) {
      ctx.save();
      ctx.globalAlpha = this.clickHintOpacity;
      ctx.fillStyle = "#F4ECE4";
      ctx.font = this.uiHelper.getFont(16, "FangSong");
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText("点击继续", width / 2, height - 15);
      ctx.restore();
    }
  }

  // 绘制圆角矩形
  drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  }

  // 绘制自动换行文本
  drawWrappedText(text, x, y, maxWidth) {
    const { ctx } = this;
    const words = text.split("");
    let line = "";
    let lineHeight = 38; // 增加行高
    let currentY = y;

    ctx.font = this.uiHelper.getFont(20, "FangSong"); // 增大字号

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i];
      const metrics = ctx.measureText(testLine);

      if ((metrics.width > maxWidth && i > 0) || (i > 0 && i % 80 === 0)) {
        // 绘制文字阴影
        ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // 绘制描边
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 4;
        ctx.strokeText(line, x, currentY);

        // 绘制文字
        ctx.fillStyle = "#F4ECE4";
        ctx.fillText(line, x, currentY);

        line = words[i];
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }

    // 绘制最后一行
    if (line) {
      // 绘制文字阴影
      ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      // 绘制描边
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 4;
      ctx.strokeText(line, x, currentY);

      // 绘制文字
      ctx.fillStyle = "#F4ECE4";
      ctx.fillText(line, x, currentY);
    }
  }

  // 加载背景图片
  loadCurrentBackground(dialogue) {
    // 检查当前背景和新背景是否不同，需要切换
    if (
      this.currentBackground &&
      dialogue.background &&
      this.currentBackground !== dialogue.background
    ) {
      this.isBackgroundTransitioning = true;
      this.backgroundOpacity = 0;

      // 立即隐藏当前背景，防止闪现
      this.backgroundImage = null;

      const img = wx.createImage();
      img.onload = () => {
        this.newBackgroundImage = img;
        // 延迟显示新背景
        setTimeout(() => {
          this.backgroundImage = this.newBackgroundImage;
          this.currentBackground = dialogue.background;
          this.isBackgroundTransitioning = false;
        }, 300);
      };

      // 只有在背景路径有效时才设置图片源
      if (
        dialogue.background &&
        typeof dialogue.background === "string" &&
        dialogue.background.trim() !== ""
      ) {
        // 转换为COS链接
        img.src = getImageUrl(dialogue.background);
      } else {
        console.log("StoryScene: 无效的背景图片路径:", dialogue.background);
      }
    } else if (
      dialogue.background &&
      typeof dialogue.background === "string" &&
      dialogue.background.trim() !== ""
    ) {
      const img = wx.createImage();
      img.onload = () => {
        this.backgroundImage = img;
      };
      // 转换为COS链接
      img.src = getImageUrl(dialogue.background);
    }

    // 加载立绘如果有的话
    if (
      dialogue.character &&
      dialogue.characterImage &&
      typeof dialogue.characterImage === "string" &&
      dialogue.characterImage.trim() !== ""
    ) {
      const img = wx.createImage();
      img.onload = () => {
        this.characterImage = img;
        // 延迟显示角色立绘
        setTimeout(() => {
          this.characterOpacity = 1;
        }, 200);
      };
      // 转换为COS链接
      img.src = getImageUrl(dialogue.characterImage);
    } else {
      this.characterImage = null;
    }
  }
}
