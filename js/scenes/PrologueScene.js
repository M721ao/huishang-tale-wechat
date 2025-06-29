// 引子场景
import { getUIHelper } from "../utils/UIHelper.js";

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
    this.backgroundImage.src = "images/backgrounds/prologue.png";

    // 滚动的文字
    this.scrollingLines = [];

    // 优化墨迹效果相关属性
    this.inkEffects = []; // 存储墨迹效果对象
    this.lastInkTime = 0; // 上次生成墨迹的时间
    this.inkInterval = 100; // 生成墨迹的时间间隔
    this.currentTextIndex = 0; // 当前显示的文字索引
    this.textRevealSpeed = 1200; // 文字显示速度（毫秒）- 增加间隔让两行一起显示
    this.lineSpacing = 40; // 行间距

    // 固定在底部的说明文字
    this.footerText = [
      "黄山市前身徽州府，下辖歙县、黟县、休宁县、",
      "祁门县、绩溪县和婺源县（现属江西省）。",
      "黄山是徽商的故乡，徽商从这里走向全国。",
    ];
    this.lineHeight = 50;
    this.totalHeight = this.scrollingLines.length * this.lineHeight;
    // 底部说明文字的位置
    this.footerY = this.height * 0.9;
    // 添加底部安全距离
    this.footerPadding = this.uiHelper.getAdaptiveSize(20);
    this.finished = false;
    this.onFinishCallback = null;
  }

  // 设置文字
  setText(text) {
    // 按换行符分割，如果没有换行符则按空格分割
    if (text.includes("\n")) {
      this.scrollingLines = text
        .split("\n")
        .filter((line) => line.trim().length > 0);
    } else {
      this.scrollingLines = text
        .split(" ")
        .filter((line) => line.trim().length > 0);
    }

    // 重置墨迹效果相关参数
    this.inkEffects = [];
    this.currentTextIndex = 0;
    this.lastInkTime = 0;

    // 更新总高度
    this.totalHeight = this.scrollingLines.length * this.lineHeight;
    // 重置滚动位置
    this.scrollY = this.height * 0.7;
    // 重置完成状态
    this.finished = false;
  }

  // 设置完成回调
  setOnFinish(callback) {
    this.onFinishCallback = callback;
  }

  // 创建溶解效果的文字
  createDissolveEffect(text, x, y) {
    return {
      text: text,
      x: x,
      y: y,
      alpha: 0, // 透明度
      scale: 0.8, // 初始缩放
      rotation: 0, // 移除旋转，保持文字水平
      startTime: Date.now(),
      duration: 2000, // 溶解动画持续时间
      dissolveProgress: 0, // 溶解进度
      noiseOffset: Math.random() * 1000, // 噪声偏移，用于溶解效果
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
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, width, height);

    // 设置文字样式
    ctx.save();
    ctx.fillStyle = "#F4ECE4"; // 粉红色
    ctx.strokeStyle = "#8B4513"; // 棕色
    ctx.lineWidth = 2;
    ctx.font = this.uiHelper.getFont(28, "FangSong", true); // 仪宋字体
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // 绘制溶解展开效果的文字
    const now = Date.now();
    const centerY = height / 2;

    // 更新当前显示的文字索引 - 四行一起显示
    if (
      this.scrollingLines.length > 0 &&
      now - this.lastInkTime > this.textRevealSpeed &&
      this.currentTextIndex < this.scrollingLines.length
    ) {
      // 检查是否有足够的文字来显示四行
      const remainingLines = this.scrollingLines.length - this.currentTextIndex;

      if (remainingLines >= 4) {
        // 创建四行文字效果
        const text1 = this.scrollingLines[this.currentTextIndex];
        const text2 = this.scrollingLines[this.currentTextIndex + 1];
        const text3 = this.scrollingLines[this.currentTextIndex + 2];
        const text4 = this.scrollingLines[this.currentTextIndex + 3];

        // 计算四行文字的垂直位置，确保不重合
        const lineSpacing = this.lineSpacing * 1.8; // 增加行间距，让文字更分散
        const firstLineY = centerY - lineSpacing * 1.5;
        const secondLineY = centerY - lineSpacing * 0.5;
        const thirdLineY = centerY + lineSpacing * 0.5;
        const fourthLineY = centerY + lineSpacing * 1.5;

        // 四行文字
        this.inkEffects.push(
          this.createDissolveEffect(text1, width / 2, firstLineY)
        );

        this.inkEffects.push(
          this.createDissolveEffect(text2, width / 2, secondLineY)
        );

        this.inkEffects.push(
          this.createDissolveEffect(text3, width / 2, thirdLineY)
        );

        this.inkEffects.push(
          this.createDissolveEffect(text4, width / 2, fourthLineY)
        );

        this.currentTextIndex += 4; // 跳过四行
      } else if (remainingLines >= 2) {
        // 如果只剩2-3行，显示剩余的所有行
        const texts = [];
        const positions = [];
        const lineSpacing = this.lineSpacing * 1.8; // 保持与上面一致的行距

        for (let i = 0; i < remainingLines; i++) {
          texts.push(this.scrollingLines[this.currentTextIndex + i]);
          const lineY = centerY + (i - (remainingLines - 1) / 2) * lineSpacing;
          positions.push(lineY);
        }

        texts.forEach((text, index) => {
          this.inkEffects.push(
            this.createDissolveEffect(text, width / 2, positions[index])
          );
        });

        this.currentTextIndex += remainingLines;
      } else if (remainingLines === 1) {
        // 只剩一行
        const text = this.scrollingLines[this.currentTextIndex];
        this.inkEffects.push(
          this.createDissolveEffect(text, width / 2, centerY)
        );
        this.currentTextIndex += 1;
      }

      this.lastInkTime = now;
    }

    // 绘制溶解效果
    this.inkEffects.forEach((effect, index) => {
      const elapsed = now - effect.startTime;
      const progress = Math.min(elapsed / effect.duration, 1);

      // 使用缓入缓出函数让动画更自然
      const easeInOut = (t) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const easedProgress = easeInOut(progress);

      // 文字完全显现后保持显示，不消失
      effect.alpha = Math.min(easedProgress * 1.2, 1); // 透明度从0到1，然后保持
      effect.scale = 0.8 + easedProgress * 0.2; // 缩放从0.8到1，然后保持
      effect.dissolveProgress = Math.min(easedProgress, 1); // 溶解进度，最大为1，然后保持

      // 应用变换
      ctx.save();
      ctx.globalAlpha = effect.alpha;
      ctx.translate(effect.x, effect.y);
      ctx.scale(effect.scale, effect.scale);
      ctx.rotate(effect.rotation);

      // 如果溶解完成，直接绘制完整文字
      if (effect.dissolveProgress >= 1) {
        ctx.strokeText(effect.text, 0, 0);
        ctx.fillText(effect.text, 0, 0);
      } else {
        // 否则绘制溶解效果的文字
        this.drawDissolveText(
          ctx,
          effect.text,
          0,
          0,
          effect.dissolveProgress,
          effect.noiseOffset
        );
      }

      ctx.restore();
    });

    // 绘制底部说明文字背景
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    // 使用自适应的padding
    ctx.fillRect(
      0,
      this.footerY - this.footerPadding,
      width,
      height - this.footerY + this.footerPadding * 2
    );

    // 绘制底部说明文字
    ctx.fillStyle = "#F4ECE4"; // 浅棕色
    ctx.strokeStyle = "#8B4513"; // 深棕色
    ctx.lineWidth = 1;
    ctx.font = this.uiHelper.getFont(12, "FangSong");
    // 使用自适应的行高
    const lineHeight = this.uiHelper.getLineHeight(24);
    this.footerText.forEach((line, index) => {
      const y = this.footerY + index * lineHeight;
      ctx.strokeText(line, width / 2, y);
      ctx.fillText(line, width / 2, y);
    });

    ctx.restore();

    this.update();
  }

  // 绘制溶解效果的文字
  drawDissolveText(ctx, text, x, y, dissolveProgress, noiseOffset) {
    const textWidth = ctx.measureText(text).width;
    // 修复文字高度计算，使用更可靠的方法
    const textHeight = parseInt(ctx.font) || 28; // 默认高度为28

    // 确保Canvas尺寸至少为1x1
    const canvasWidth = Math.max(textWidth + 20, 1);
    const canvasHeight = Math.max(textHeight + 20, 1);

    // 创建临时canvas来实现溶解效果
    const tempCanvas = wx.createCanvas();
    const tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;

    // 在临时canvas上绘制文字
    tempCtx.font = ctx.font;
    tempCtx.fillStyle = ctx.fillStyle;
    tempCtx.strokeStyle = ctx.strokeStyle;
    tempCtx.lineWidth = ctx.lineWidth;
    tempCtx.textAlign = "center";
    tempCtx.textBaseline = "middle";

    // 绘制描边和填充
    tempCtx.strokeText(text, tempCanvas.width / 2, tempCanvas.height / 2);
    tempCtx.fillText(text, tempCanvas.width / 2, tempCanvas.height / 2);

    // 获取图像数据
    const imageData = tempCtx.getImageData(
      0,
      0,
      tempCanvas.width,
      tempCanvas.height
    );
    const data = imageData.data;

    // 应用右下擦开效果
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0) {
        // 如果像素不是透明的
        // 计算像素位置
        const pixelX = (i / 4) % tempCanvas.width;
        const pixelY = Math.floor(i / 4 / tempCanvas.width);

        // 计算从右下角到当前像素的距离比例
        const distanceFromBottomRight = Math.sqrt(
          Math.pow(pixelX - tempCanvas.width, 2) +
            Math.pow(pixelY - tempCanvas.height, 2)
        );
        const maxDistance = Math.sqrt(
          Math.pow(tempCanvas.width, 2) + Math.pow(tempCanvas.height, 2)
        );
        const distanceRatio = distanceFromBottomRight / maxDistance;

        // 添加一些随机性，让擦开效果更自然
        const noise = this.simpleNoise(
          pixelX * 0.05 + noiseOffset,
          pixelY * 0.05
        );
        const threshold = dissolveProgress + (noise - 0.5) * 0.1;

        // 如果距离比例大于阈值，则让像素消失
        if (distanceRatio > threshold) {
          data[i + 3] = 0; // 设置为透明
        }
      }
    }

    // 将处理后的图像数据放回临时canvas
    tempCtx.putImageData(imageData, 0, 0);

    // 将临时canvas的内容绘制到主canvas
    ctx.drawImage(
      tempCanvas,
      x - tempCanvas.width / 2,
      y - tempCanvas.height / 2
    );
  }

  // 简单的噪声函数
  simpleNoise(x, y) {
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return n - Math.floor(n);
  }

  update() {
    // 记录开始时间
    if (!this.startTime) {
      this.startTime = Date.now();
    }

    const now = Date.now();

    // 检查是否全部文字已显示
    if (
      this.currentTextIndex >= this.scrollingLines.length &&
      Date.now() - this.startTime >= 5000 &&
      !this.finished
    ) {
      this.finished = true;
      if (this.onFinishCallback) {
        this.onFinishCallback();
      }
    }
  }
}
