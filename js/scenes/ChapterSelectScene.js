// 章节选择场景
import { chapters } from "../chapters/chapterConfig.js";
import { getUIHelper } from "../utils/UIHelper.js";
import { resourceConfig } from "../config/resourceConfig.js";

export class ChapterSelectScene {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.uiHelper = getUIHelper();

    // 章节按钮配置 - S型布局，一行一个，左右交替
    this.buttonWidth = width * 0.45; // 统一宽度，稍微小一点避免重叠
    this.buttonHeight = 100; // 扩大按钮高度
    this.buttonSpacing = -15; // 负间距，让按钮重叠
    this.startY = 120; // 整体下移
    this.leftX = width * 0.1; // 左侧位置
    this.rightX = width * 0.45; // 右侧位置，确保宽度统一

    // 返回按钮 - 缩小尺寸
    this.backButton = {
      x: 20,
      y: 40,
      text: "返回",
    };

    // 背景图片
    this.backgroundImage = wx.createImage();
    this.backgroundImage.src =
      resourceConfig.getResourceUrl("chapter-select-bg");
    this.backgroundLoaded = false;

    this.backgroundImage.onload = () => {
      this.backgroundLoaded = true;
    };

    // 章节图片缓存
    this.chapterImages = {};
    this.loadChapterImages();

    // 中文数字映射
    this.chineseNumbers = ["", "壹", "贰", "叁", "肆", "伍", "陆", "柒"];

    // 回调函数
    this.onChapterSelect = null;
    this.onBack = null;

    // 防止触摸事件穿透
    this.isActive = false;
    this.activationTime = 0;
  }

  // 激活场景
  activate() {
    this.isActive = true;
    this.activationTime = Date.now();
    console.log("ChapterSelectScene activated");
  }

  // 停用场景
  deactivate() {
    this.isActive = false;
    console.log("ChapterSelectScene deactivated");
  }

  // 加载章节图片
  loadChapterImages() {
    chapters.forEach((chapter) => {
      const image = wx.createImage();
      image.src = chapter.background;
      image.onload = () => {
        this.chapterImages[chapter.id] = image;
      };
      image.onerror = () => {
        console.warn(`章节${chapter.id}图片加载失败:`, chapter.background);
      };
    });
  }

  // 设置章节选择回调
  setOnChapterSelect(callback) {
    this.onChapterSelect = callback;
  }

  // 设置返回回调
  setOnBack(callback) {
    this.onBack = callback;
  }

  // 处理触摸结束
  handleTouchEnd(e) {
    console.log("handleTouchEnd");

    // 检查场景是否激活
    if (!this.isActive) {
      console.log("场景未激活，忽略触摸事件");
      return;
    }

    // 检查场景激活时间，防止事件穿透
    const currentTime = Date.now();
    if (currentTime - this.activationTime < 200) {
      console.log("场景刚激活，忽略触摸事件以防止穿透");
      return;
    }

    // 检查事件对象是否存在以及是否有changedTouches属性
    if (!e || !e.changedTouches || e.changedTouches.length === 0) {
      console.warn("handleTouchEnd: 无效的触摸事件对象");
      return;
    }

    const touch = e.changedTouches[0];
    const x = touch.clientX;
    const y = touch.clientY;

    console.log("触摸位置:", x, y);

    // 检查返回按钮点击
    if (this.isPointInButton(x, y, this.backButton)) {
      console.log("点击了返回按钮");
      if (this.onBack) {
        this.onBack();
      }
      return;
    }

    // 检查章节按钮点击（从后往前检查，因为后面的按钮在上层）
    for (let i = chapters.length - 1; i >= 0; i--) {
      const chapter = chapters[i];
      const button = this.getChapterButtonBounds(i);

      console.log(
        `检查章节 ${chapter.id} (${chapter.title}), 按钮位置:`,
        button
      );

      if (this.isPointInButtonBounds(x, y, button)) {
        console.log(`点击了章节 ${chapter.id}: ${chapter.title}`);
        // 直接选择章节，不再检查解锁状态
        if (this.onChapterSelect) {
          this.onChapterSelect(chapter);
        }
        return;
      }
    }

    console.log("没有点击到任何按钮");
  }

  // 获取章节按钮位置 - S型布局，一行一个，重叠布局
  getChapterButtonBounds(index) {
    const isLeft = index % 2 === 0; // 偶数索引在左，奇数索引在右

    return {
      x: isLeft ? this.leftX : this.rightX,
      y: this.startY + index * (this.buttonHeight + this.buttonSpacing),
      width: this.buttonWidth,
      height: this.buttonHeight,
      isLeft: isLeft,
    };
  }

  // 检查点是否在返回按钮内
  isPointInButton(x, y, button) {
    return (
      x >= button.x && x <= button.x + 80 && y >= button.y && y <= button.y + 30
    );
  }

  // 检查点是否在按钮边界内
  isPointInButtonBounds(x, y, bounds) {
    return (
      x >= bounds.x &&
      x <= bounds.x + bounds.width &&
      y >= bounds.y &&
      y <= bounds.y + bounds.height
    );
  }

  // 绘制场景
  draw() {
    const { ctx, width, height } = this;

    // 绘制背景图片（不使用蒙版）
    if (this.backgroundLoaded) {
      ctx.drawImage(this.backgroundImage, 0, 0, width, height);
    } else {
      // 备用渐变背景
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#2c1810");
      gradient.addColorStop(0.3, "#3d2817");
      gradient.addColorStop(0.7, "#1f1208");
      gradient.addColorStop(1, "#0f0804");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    // 绘制装饰性光晕
    this.drawDecorations();

    // 绘制章节列表
    this.drawChapterList();

    // 绘制返回按钮
    this.drawBackButton();
  }

  // 绘制装饰性元素
  drawDecorations() {
    const { ctx, width, height } = this;

    ctx.save();

    // 绘制左上角暖色光晕
    const topGradient = ctx.createRadialGradient(
      width * 0.2,
      height * 0.15,
      0,
      width * 0.2,
      height * 0.15,
      width * 0.4
    );
    topGradient.addColorStop(0, "rgba(139, 69, 19, 0.12)");
    topGradient.addColorStop(0.5, "rgba(139, 69, 19, 0.06)");
    topGradient.addColorStop(1, "rgba(139, 69, 19, 0)");
    ctx.fillStyle = topGradient;
    ctx.fillRect(0, 0, width, height * 0.5);

    // 绘制右下角金色光晕
    const bottomGradient = ctx.createRadialGradient(
      width * 0.8,
      height * 0.85,
      0,
      width * 0.8,
      height * 0.85,
      width * 0.3
    );
    bottomGradient.addColorStop(0, "rgba(212, 175, 55, 0.08)");
    bottomGradient.addColorStop(0.5, "rgba(212, 175, 55, 0.04)");
    bottomGradient.addColorStop(1, "rgba(212, 175, 55, 0)");
    ctx.fillStyle = bottomGradient;
    ctx.fillRect(width * 0.5, height * 0.5, width * 0.5, height * 0.5);

    ctx.restore();
  }

  // 绘制章节列表
  drawChapterList() {
    const { ctx } = this;

    ctx.save();

    // 设置裁剪区域，适应整体下移的布局
    ctx.beginPath();
    ctx.rect(0, 100, this.width, this.height - 100);
    ctx.clip();

    // 从前往后绘制，让后面的章节覆盖前面的
    chapters.forEach((chapter, index) => {
      this.drawChapterButton(chapter, index);
    });

    ctx.restore();
  }

  // 绘制章节按钮
  drawChapterButton(chapter, index) {
    const { ctx } = this;
    const bounds = this.getChapterButtonBounds(index);
    // 当前版本所有章节都显示为解锁状态
    const isLocked = false;

    ctx.save();

    // 绘制圆角平行四边形
    this.drawRoundedParallelogram(
      ctx,
      bounds.x,
      bounds.y,
      bounds.width,
      bounds.height,
      bounds.isLeft,
      6,
      isLocked
    );

    // 绘制章节内容
    this.drawChapterContent(
      ctx,
      chapter,
      bounds.x,
      bounds.y,
      bounds.width,
      bounds.height,
      isLocked
    );

    ctx.restore();
  }

  // 绘制圆角平行四边形
  drawRoundedParallelogram(
    ctx,
    x,
    y,
    width,
    height,
    isLeft,
    radius,
    isLocked = false
  ) {
    const skew = 0; // 增加倾斜度，让重叠效果更明显
    const skewDirection = isLeft ? 1 : -1; // 左右交替倾斜方向

    ctx.save();

    // 绘制主体背景渐变
    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    if (isLocked) {
      // 未解锁章节使用灰色渐变
      gradient.addColorStop(0, "#C0C0C0"); // 银灰色
      gradient.addColorStop(0.5, "#A0A0A0"); // 深灰色
      gradient.addColorStop(1, "#808080"); // 更深灰色
    } else {
      // 解锁章节使用原来的米色渐变
      gradient.addColorStop(0, "#dfdfdf"); // 米色
      gradient.addColorStop(0.5, "#dfdfdf"); // 卡其色
      gradient.addColorStop(1, "#DDD8C0"); // 浅米色
    }
    ctx.fillStyle = gradient;

    this.drawParallelogramPath(
      ctx,
      x,
      y,
      width,
      height,
      skew * skewDirection,
      radius
    );
    ctx.fill();

    // 绘制边框 - 增加边框宽度，增强层次感
    ctx.strokeStyle = isLocked ? "#aea69b" : "#aea69b"; // 灰色或暗金色边框
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // 如果是未解锁章节，添加半透明遮罩
    if (isLocked) {
      ctx.fillStyle = "rgba(128, 128, 128, 0.4)";
      this.drawParallelogramPath(
        ctx,
        x,
        y,
        width,
        height,
        skew * skewDirection,
        radius
      );
      ctx.fill();
    }

    ctx.restore();
  }

  // 绘制平行四边形路径（带圆角）
  drawParallelogramPath(ctx, x, y, width, height, skew, radius) {
    ctx.beginPath();

    // 计算四个顶点
    const topLeft = { x: x + radius, y: y };
    const topRight = { x: x + width - radius + skew, y: y };
    const bottomRight = { x: x + width - radius + skew, y: y + height };
    const bottomLeft = { x: x + radius, y: y + height };

    // 绘制带圆角的平行四边形
    // 顶边
    ctx.moveTo(topLeft.x, topLeft.y);
    ctx.lineTo(topRight.x, topRight.y);

    // 右上角圆角
    ctx.quadraticCurveTo(
      topRight.x + radius,
      topRight.y,
      topRight.x + radius,
      topRight.y + radius
    );

    // 右边
    ctx.lineTo(bottomRight.x + radius, bottomRight.y - radius);

    // 右下角圆角
    ctx.quadraticCurveTo(
      bottomRight.x + radius,
      bottomRight.y,
      bottomRight.x,
      bottomRight.y
    );

    // 底边
    ctx.lineTo(bottomLeft.x, bottomLeft.y);

    // 左下角圆角
    ctx.quadraticCurveTo(
      bottomLeft.x - radius,
      bottomLeft.y,
      bottomLeft.x - radius,
      bottomLeft.y - radius
    );

    // 左边
    ctx.lineTo(topLeft.x - radius, topLeft.y + radius);

    // 左上角圆角
    ctx.quadraticCurveTo(topLeft.x - radius, topLeft.y, topLeft.x, topLeft.y);

    ctx.closePath();
  }

  // 绘制章节内容
  drawChapterContent(ctx, chapter, x, y, width, height, isLocked) {
    ctx.save();

    // 根据解锁状态调整透明度
    const alpha = isLocked ? 0.5 : 1.0;
    ctx.globalAlpha = alpha;

    // 先绘制章节图片作为背景（位于文字底下）
    this.drawChapterImage(
      ctx,
      chapter,
      x + width - 85,
      y + 10,
      70,
      80,
      isLocked
    );

    // 绘制大写中文数字（左上角）
    ctx.fillStyle = isLocked ? "#1a1a1a" : "#1a1a1a";
    ctx.font = this.uiHelper.getFont(24, "FangSong", true);
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(this.chineseNumbers[chapter.id], x + 15, y + 15);

    // 绘制章节标题（中间偏左）
    ctx.fillStyle = isLocked ? "#1a1a1a" : "#1a1a1a";
    ctx.font = this.uiHelper.getFont(18, "FangSong", true);
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(chapter.title, x + 32, y + height / 2 + 10);

    // 当前版本不需要锁定图标，但保留代码以便未来扩展
    // if (isLocked) {
    //   this.drawLockIcon(ctx, x + width - 30, y + 15, 20, 20);
    // }

    ctx.restore();
  }

  // 绘制章节图片（替代剪影）
  drawChapterImage(ctx, chapter, x, y, width, height, isLocked = false) {
    ctx.save();

    const image = this.chapterImages[chapter.id];
    if (image) {
      // 设置整体透明度，让图片作为背景不遮盖文字
      ctx.globalAlpha = isLocked ? 0.15 : 0.25;

      // 绘制水墨风格的遮罩层
      this.drawInkWashEffect(ctx, x, y, width, height);

      // 绘制圆角矩形裁剪区域 - 手动绘制以确保兼容性
      const radius = 6;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
      );
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.clip();

      // 绘制章节图片
      ctx.drawImage(image, x, y, width, height);

      // 添加水墨渐变效果
      this.drawInkGradientOverlay(ctx, x, y, width, height, isLocked);
    } else {
      // 图片未加载时显示占位符
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = isLocked ? "#A0A0A0" : "#DDD8C0";

      // 绘制圆角矩形占位符
      const radius = 6;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
      );
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = isLocked ? "#696969" : "#8B4513";
      ctx.lineWidth = 1;
      ctx.stroke();

      // 显示加载提示
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = isLocked ? "#696969" : "#8B4513";
      ctx.font = this.uiHelper.getFont(10, "Arial");
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("加载中", x + width / 2, y + height / 2);
    }

    ctx.restore();
  }

  // 绘制水墨效果背景
  drawInkWashEffect(ctx, x, y, width, height) {
    ctx.save();

    // 创建径向渐变模拟水墨扩散效果
    const centerX = x + width * 0.6;
    const centerY = y + height * 0.4;
    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      Math.max(width, height) * 0.8
    );

    gradient.addColorStop(0, "rgba(0, 0, 0, 0.1)");
    gradient.addColorStop(0.3, "rgba(0, 0, 0, 0.05)");
    gradient.addColorStop(0.7, "rgba(0, 0, 0, 0.02)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);

    ctx.restore();
  }

  // 绘制水墨渐变遮罩
  drawInkGradientOverlay(ctx, x, y, width, height, isLocked) {
    ctx.save();

    // 创建从右上到左下的渐变，模拟水墨晕染效果
    const gradient = ctx.createLinearGradient(x + width, y, x, y + height);

    if (isLocked) {
      gradient.addColorStop(0, "rgba(128, 128, 128, 0.3)");
      gradient.addColorStop(0.5, "rgba(128, 128, 128, 0.1)");
      gradient.addColorStop(1, "rgba(128, 128, 128, 0)");
    } else {
      gradient.addColorStop(0, "rgba(139, 69, 19, 0.2)");
      gradient.addColorStop(0.5, "rgba(139, 69, 19, 0.1)");
      gradient.addColorStop(1, "rgba(139, 69, 19, 0)");
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);

    // 添加一些随机的水墨点效果
    this.drawInkDots(ctx, x, y, width, height, isLocked);

    ctx.restore();
  }

  // 绘制水墨点效果
  drawInkDots(ctx, x, y, width, height, isLocked) {
    ctx.save();

    // 绘制几个小的水墨点
    const dotColor = isLocked
      ? "rgba(128, 128, 128, 0.15)"
      : "rgba(139, 69, 19, 0.15)";
    ctx.fillStyle = dotColor;

    // 固定位置的水墨点，避免每次绘制都变化
    const dots = [
      { x: x + width * 0.2, y: y + height * 0.3, r: 3 },
      { x: x + width * 0.7, y: y + height * 0.6, r: 2 },
      { x: x + width * 0.4, y: y + height * 0.8, r: 1.5 },
      { x: x + width * 0.8, y: y + height * 0.2, r: 2.5 },
    ];

    dots.forEach((dot) => {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  // 绘制返回按钮
  drawBackButton() {
    const { ctx } = this;
    const btn = this.backButton;

    ctx.save();

    // 绘制返回文字 - 使用白色
    ctx.fillStyle = "#1a1a1a";
    ctx.font = this.uiHelper.getFont(16, "FangSong", true);
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("返回", btn.x, btn.y + 18);

    ctx.restore();
  }
}
