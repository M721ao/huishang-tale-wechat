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

    // 获取系统信息用于安全区域计算
    const systemInfo = wx.getSystemInfoSync();
    this.safeArea = systemInfo.safeArea || {
      top: 0,
      bottom: height,
      left: 0,
      right: width,
    };

    // 计算安全区域的可用高度
    const safeHeight = this.safeArea.bottom - this.safeArea.top;
    const bottomSafeMargin = Math.max(height - this.safeArea.bottom, 0);

    // 文字显示区域设置 - 使用更合理的比例和边距
    this.textAreaHeight = Math.max(
      height * 0.3,
      this.uiHelper.getAdaptiveSize(200)
    ); // 稍微增加对话框高度以容纳更大的文字边距
    this.textAreaY =
      height -
      this.textAreaHeight -
      this.uiHelper.getAdaptiveMargin(45) -
      bottomSafeMargin; // 增加上方边距
    this.padding = this.uiHelper.getAdaptiveMargin(24); // 增加外边距

    // 对话框内部边距
    this.innerPadding = this.uiHelper.getAdaptiveMargin(16); // 对话框内部边距
    this.textPaddingX = this.uiHelper.getAdaptiveMargin(20); // 文字左右边距
    this.textPaddingY = this.uiHelper.getAdaptiveMargin(32); // 大幅增加文字上边距，让文字不再紧贴上边框

    // 文字动画设置
    this.currentText = "";
    this.targetText = "";
    this.textSpeed = 1.5;
    this.isTyping = false;
    this.textOpacity = 0;

    // 当前剧情进度
    this.currentScriptIndex = 0;
    this.currentScript = null;

    // 角色名称显示区域 - 使用更美观的尺寸
    this.nameBoxWidth = this.uiHelper.getAdaptiveSize(160);
    this.nameBoxHeight = this.uiHelper.getAdaptiveSize(40);
    this.nameBoxX = this.padding + this.uiHelper.getAdaptiveMargin(8); // 稍微内缩
    this.nameBoxY =
      this.textAreaY - this.nameBoxHeight - this.uiHelper.getAdaptiveMargin(12); // 增加与对话框的间距
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

  // 彻底重置画布变换状态
  _resetCanvas() {
    const { ctx } = this;
    if (!ctx) return;
    
    try {
      // 方法1：使用setTransform重置变换矩阵
      if (ctx.setTransform) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }
      
      // 方法2：使用resetTransform重置
      if (ctx.resetTransform) {
        ctx.resetTransform();
      }
      
      // 方法3：使用save/restore重置状态
      ctx.save();
      ctx.restore();
      
      // 方法4：重置所有可能的变换属性
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      ctx.filter = 'none';
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'low';
      ctx.strokeStyle = '#000000';
      ctx.fillStyle = '#000000';
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'rgba(0, 0, 0, 0)';
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.lineCap = 'butt';
      ctx.lineJoin = 'miter';
      ctx.lineWidth = 1;
      ctx.miterLimit = 10;
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'start';
      ctx.textBaseline = 'alphabetic';
      ctx.direction = 'inherit';
    } catch (e) {
      console.error('重置画布状态失败:', e);
    }
  }
  
  // 初始化场景
  init(storyScript, onFinish) {
    // 初始化时重置画布状态
    this._resetCanvas();
    this.loadScript(storyScript);
    this.onFinishCallback = onFinish;
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
    // 切换对话前重置画布状态
    this._resetCanvas();
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

  // 处理触摸事件
  handleTouchStart(e) {
    // 触摸开始前重置画布状态
    this._resetCanvas();
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
    if (this.currentText.length > 0) {
      // 只要有文字就开始计时
      this.clickHintTimer += 1;
      if (this.clickHintTimer > 15) {
        // 减少等待时间到0.25秒
        const baseOpacity = this.isTyping ? 0.3 : 0.5; // 打字时透明度低一些
        this.clickHintOpacity =
          baseOpacity + 0.1 * Math.sin(this.clickHintTimer * 0.05);
      }
    } else {
      this.clickHintTimer = 0;
      this.clickHintOpacity = 0;
    }
  }

  // 绘制场景
  draw() {
    const { ctx, width, height } = this;

    // 每次绘制前彻底重置画布变换
    this._resetCanvas();

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
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)"; // 稍微提高透明度
    this.drawRoundedRect(
      ctx,
      this.padding,
      this.textAreaY,
      width - this.padding * 2,
      this.textAreaHeight,
      this.uiHelper.getAdaptiveSize(16) // 更大的圆角
    );
    ctx.fill();

    // 添加对话框内部装饰边框
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = this.uiHelper.getAdaptiveSize(1.5);
    const decorMargin = this.uiHelper.getAdaptiveSize(6);
    this.drawRoundedRect(
      ctx,
      this.padding + decorMargin,
      this.textAreaY + decorMargin,
      width - this.padding * 2 - decorMargin * 2,
      this.textAreaHeight - decorMargin * 2,
      this.uiHelper.getAdaptiveSize(12)
    );
    ctx.stroke();

    // 添加微妙的渐变效果
    const gradient = ctx.createLinearGradient(
      0,
      this.textAreaY,
      0,
      this.textAreaY + this.textAreaHeight
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.05)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    this.drawRoundedRect(
      ctx,
      this.padding,
      this.textAreaY,
      width - this.padding * 2,
      this.textAreaHeight,
      this.uiHelper.getAdaptiveSize(16)
    );
    ctx.fill();
    ctx.restore();

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

      // 绘制名称框背景 - 使用渐变背景
      const nameGradient = ctx.createLinearGradient(
        this.nameBoxX,
        this.nameBoxY,
        this.nameBoxX,
        this.nameBoxY + this.nameBoxHeight
      );
      nameGradient.addColorStop(0, "rgba(20, 20, 20, 0.9)");
      nameGradient.addColorStop(1, "rgba(10, 10, 10, 0.95)");
      ctx.fillStyle = nameGradient;
      this.drawRoundedRect(
        ctx,
        this.nameBoxX,
        this.nameBoxY,
        this.nameBoxWidth,
        this.nameBoxHeight,
        this.uiHelper.getAdaptiveSize(12) // 更大的圆角
      );
      ctx.fill();

      // 添加名称框装饰边框
      ctx.strokeStyle = "rgba(255, 215, 0, 0.7)";
      ctx.lineWidth = this.uiHelper.getAdaptiveSize(1.5);
      const nameBoxMargin = this.uiHelper.getAdaptiveSize(2);
      this.drawRoundedRect(
        ctx,
        this.nameBoxX + nameBoxMargin,
        this.nameBoxY + nameBoxMargin,
        this.nameBoxWidth - nameBoxMargin * 2,
        this.nameBoxHeight - nameBoxMargin * 2,
        this.uiHelper.getAdaptiveSize(10)
      );
      ctx.stroke();

      // 添加微妙的内阴影效果
      ctx.strokeStyle = "rgba(255, 215, 0, 0.3)";
      ctx.lineWidth = this.uiHelper.getAdaptiveSize(0.5);
      this.drawRoundedRect(
        ctx,
        this.nameBoxX + this.uiHelper.getAdaptiveSize(1),
        this.nameBoxY + this.uiHelper.getAdaptiveSize(1),
        this.nameBoxWidth - this.uiHelper.getAdaptiveSize(2),
        this.nameBoxHeight - this.uiHelper.getAdaptiveSize(2),
        this.uiHelper.getAdaptiveSize(11)
      );
      ctx.stroke();

      // 绘制角色名称 - 添加阴影效果
      ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
      ctx.shadowBlur = this.uiHelper.getAdaptiveSize(3);
      ctx.shadowOffsetX = this.uiHelper.getAdaptiveSize(1);
      ctx.shadowOffsetY = this.uiHelper.getAdaptiveSize(1);

      ctx.font = this.uiHelper.getFont(18, "FangSong", true); // 稍微减小字体
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#F5F0E8";
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
        this.padding + this.textPaddingX, // 使用专门的文字左边距
        this.textAreaY + this.textPaddingY, // 使用专门的文字上边距
        width - this.padding * 2 - this.textPaddingX * 2 // 计算文字可用宽度
      );
      ctx.restore();
    }

    // 绘制点击提示
    if (this.clickHintOpacity > 0) {
      ctx.save();
      ctx.globalAlpha = this.clickHintOpacity;

      // 绘制提示文字和箭头 - 使用稍微小一点的字体
      ctx.font = this.uiHelper.getFont(14, "FangSong");
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#E8E0D6";

      // 调整提示位置 - 更贴近对话框右边
      const tipX = width - this.padding - this.uiHelper.getAdaptiveMargin(12);
      const tipY =
        this.textAreaY +
        this.textAreaHeight -
        this.uiHelper.getAdaptiveMargin(16);

      // 添加文字阴影
      ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
      ctx.shadowBlur = this.uiHelper.getAdaptiveSize(2);
      ctx.shadowOffsetX = this.uiHelper.getAdaptiveSize(1);
      ctx.shadowOffsetY = this.uiHelper.getAdaptiveSize(1);

      // 绘制文字
      ctx.fillText("点击继续", tipX - this.uiHelper.getAdaptiveSize(16), tipY);

      // 清除阴影设置
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // 绘制简单的箭头 - 使用更精致的设计
      ctx.beginPath();
      const arrowX = tipX - this.uiHelper.getAdaptiveSize(8);
      const arrowSize = this.uiHelper.getAdaptiveSize(6);

      // 箭头动画 - 减小动画幅度
      const bounce =
        Math.sin(this.clickHintTimer * 0.1) * this.uiHelper.getAdaptiveSize(2);

      ctx.moveTo(arrowX + bounce, tipY);
      ctx.lineTo(arrowX + arrowSize + bounce, tipY);
      ctx.lineTo(arrowX + arrowSize + bounce, tipY - arrowSize / 2);
      ctx.lineTo(arrowX + arrowSize * 1.8 + bounce, tipY);
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
    const lineHeight = this.uiHelper.getLineHeight(42); // 增加行高，让文字更易读
    let currentY = y;

    ctx.font = this.uiHelper.getFont(19, "FangSong"); // 稍微减小字体，更协调

    // 计算每行最大字符数（基于屏幕宽度调整）
    const baseFontSize = this.uiHelper.getFontSize(19);
    const maxCharsPerLine = Math.floor(maxWidth / baseFontSize) - 1;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i];
      const metrics = ctx.measureText(testLine);

      if (
        (metrics.width > maxWidth && i > 0) ||
        (i > 0 && line.length >= maxCharsPerLine)
      ) {
        // 绘制文字阴影 - 更柔和的阴影效果
        ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
        ctx.shadowBlur = this.uiHelper.getAdaptiveSize(3);
        ctx.shadowOffsetX = this.uiHelper.getAdaptiveSize(1.5);
        ctx.shadowOffsetY = this.uiHelper.getAdaptiveSize(1.5);

        // 绘制描边 - 更细的描边
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = this.uiHelper.getAdaptiveSize(3);
        ctx.strokeText(line, x, currentY);

        // 绘制文字 - 使用更温暖的白色
        ctx.fillStyle = "#F5F0E8";
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
      ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
      ctx.shadowBlur = this.uiHelper.getAdaptiveSize(3);
      ctx.shadowOffsetX = this.uiHelper.getAdaptiveSize(1.5);
      ctx.shadowOffsetY = this.uiHelper.getAdaptiveSize(1.5);

      // 绘制描边
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = this.uiHelper.getAdaptiveSize(3);
      ctx.strokeText(line, x, currentY);

      // 绘制文字
      ctx.fillStyle = "#F5F0E8";
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
