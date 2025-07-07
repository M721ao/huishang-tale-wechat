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
    this.textAreaHeight = height * 0.25; // 保持文字区域高度
    this.textAreaY = height - this.textAreaHeight - 35; // 再上移15像素
    this.padding = 20; // 减小内边距

    // 文字动画设置
    this.currentText = "";
    this.targetText = "";
    this.textSpeed = 1.5;
    this.isTyping = false;
    this.textOpacity = 0;

    // 当前剧情进度
    this.currentScriptIndex = 0;
    this.currentScript = null;

    // 角色名称显示区域
    this.nameBoxWidth = 180;
    this.nameBoxHeight = 45;
    this.nameBoxX = this.padding;
    this.nameBoxY = this.textAreaY - this.nameBoxHeight - 10;
    this.nameOpacity = 0;

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
    this.clickHintScale = 1;

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
      if (this.clickHintTimer > 30) {
        // 减少等待时间到0.5秒
        this.clickHintOpacity =
          0.4 + 0.15 * Math.sin(this.clickHintTimer * 0.05);
      }
    } else if (this.currentText.length > 10) {
      // 当显示超过10个字时就开始显示提示
      this.clickHintTimer += 1;
      if (this.clickHintTimer > 30) {
        this.clickHintOpacity =
          0.3 + 0.1 * Math.sin(this.clickHintTimer * 0.05);
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

    // 绘制背景
    if (this.backgroundImage) {
      ctx.save();

      // 计算保持宽高比的缩放和位置
      const scale = Math.max(
        width / this.backgroundImage.width,
        height / this.backgroundImage.height
      );

      const scaledWidth = this.backgroundImage.width * scale;
      const scaledHeight = this.backgroundImage.height * scale;
      const x = (width - scaledWidth) / 2;
      const y = (height - scaledHeight) / 2;

      // 绘制背景图片
      ctx.globalAlpha = this.backgroundOpacity;
      ctx.drawImage(this.backgroundImage, x, y, scaledWidth, scaledHeight);

      // 添加轻微的暗色叠加，增加层次感
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, width, height);

      // 添加渐变阴影效果
      const gradient = ctx.createLinearGradient(0, height * 0.5, 0, height);
      gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0.5)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, height * 0.5, width, height * 0.5);

      ctx.restore();
    }

    // 绘制对话框背景
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    this.drawRoundedRect(
      ctx,
      this.padding,
      this.textAreaY,
      width - this.padding * 2,
      this.textAreaHeight,
      12
    );
    ctx.fill();

    // 添加对话框装饰
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 2;
    this.drawRoundedRect(
      ctx,
      this.padding + 5,
      this.textAreaY + 5,
      width - this.padding * 2 - 10,
      this.textAreaHeight - 10,
      10
    );
    ctx.stroke();

    // 绘制角色立绘
    if (this.characterImage) {
      ctx.save();
      ctx.globalAlpha = this.characterOpacity;

      // 计算立绘位置和大小
      const charHeight = height * 0.8;
      const charWidth =
        (this.characterImage.width / this.characterImage.height) * charHeight;
      let charX;

      // 根据位置设置X坐标
      switch (this.currentPosition) {
        case "left":
          charX = -charWidth * 0.2;
          break;
        case "right":
          charX = width - charWidth * 0.8;
          break;
        default: // center
          charX = (width - charWidth) / 2;
      }

      const charY = height - charHeight;

      // 应用缩放动画
      const scaledWidth = charWidth * this.characterScale;
      const scaledHeight = charHeight * this.characterScale;
      const scaleOffsetX = (charWidth - scaledWidth) / 2;
      const scaleOffsetY = (charHeight - scaledHeight) / 2;

      ctx.drawImage(
        this.characterImage,
        charX + scaleOffsetX,
        charY + scaleOffsetY,
        scaledWidth,
        scaledHeight
      );
      ctx.restore();
    }

    // 绘制角色名称框
    if (this.currentCharacter) {
      ctx.save();
      ctx.globalAlpha = this.nameOpacity;

      // 绘制名称框背景
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      this.drawRoundedRect(
        ctx,
        this.nameBoxX,
        this.nameBoxY,
        this.nameBoxWidth,
        this.nameBoxHeight,
        8
      );
      ctx.fill();

      // 添加名称框装饰
      ctx.strokeStyle = "rgba(255, 215, 0, 0.6)";
      ctx.lineWidth = 2;
      this.drawRoundedRect(
        ctx,
        this.nameBoxX + 3,
        this.nameBoxY + 3,
        this.nameBoxWidth - 6,
        this.nameBoxHeight - 6,
        6
      );
      ctx.stroke();

      // 绘制角色名称
      ctx.font = this.uiHelper.getFont(20, "FangSong", true);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#F4ECE4";
      ctx.fillText(
        this.currentCharacter,
        this.nameBoxX + this.nameBoxWidth / 2,
        this.nameBoxY + this.nameBoxHeight / 2
      );
      ctx.restore();
    }

    // 绘制对话文本
    if (this.currentText) {
      ctx.save();
      ctx.globalAlpha = this.textOpacity;
      this.drawWrappedText(
        this.currentText,
        this.padding * 2,
        this.textAreaY + this.padding * 2,
        width - this.padding * 4
      );
      ctx.restore();
    }

    // 绘制点击提示
    if (this.clickHintOpacity > 0) {
      ctx.save();
      ctx.globalAlpha = this.clickHintOpacity;

      // 绘制提示文字和箭头
      ctx.font = this.uiHelper.getFont(16, "FangSong");
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#FFFFFF";

      // 调整提示位置到对话框内部
      const tipX = width - this.padding * 3;
      const tipY = this.textAreaY + this.textAreaHeight - this.padding * 1.5;

      // 绘制文字
      ctx.fillText("点击继续", tipX - 10, tipY);

      // 绘制简单的箭头
      ctx.beginPath();
      const arrowX = tipX + 5;
      const arrowSize = 8;

      // 箭头动画
      const bounce = Math.sin(this.clickHintTimer * 0.1) * 3;

      ctx.moveTo(arrowX + bounce, tipY);
      ctx.lineTo(arrowX + arrowSize + bounce, tipY);
      ctx.lineTo(arrowX + arrowSize + bounce, tipY - arrowSize / 2);
      ctx.lineTo(arrowX + arrowSize * 2 + bounce, tipY);
      ctx.lineTo(arrowX + arrowSize + bounce, tipY + arrowSize / 2);
      ctx.lineTo(arrowX + arrowSize + bounce, tipY);
      ctx.closePath();
      ctx.fill();

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
    let lineHeight = 38;
    let currentY = y;

    ctx.font = this.uiHelper.getFont(20, "FangSong");

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
