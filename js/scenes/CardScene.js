// 卡牌场景
import { getUIHelper } from "../utils/UIHelper.js";
import { getImageUrl } from "../config/resourceConfig.js";
import { resourceConfig } from "../config/resourceConfig.js";

export class CardScene {
  constructor(game, ctx, width, height) {
    this.game = game;
    this.ctx = ctx;
    this.width = width;
    this.height = height;

    // 获取UI辅助工具
    this.uiHelper = getUIHelper();

    // 卡牌状态
    this.currentEventIndex = 0;
    this.events = [];
    this.cardX = width / 2;
    this.cardY = height / 2;
    this.cardWidth = width * 0.8;
    this.cardHeight = height * 0.7;
    this.dragStartX = 0;
    this.isDragging = false;
    this.dragOffset = 0;

    // 游戏状态
    this.gameState = null;
    this.onStateChange = null;
    this.onFinish = null;
    this.chapterTitle = "";
    this.chapterNumber = 1;

    // 加载图片资源
    this.cardImages = {};

    // 加载章节选择器背景图片
    this.backgroundImage = wx.createImage();
    this.backgroundImage.src =
      resourceConfig.getResourceUrl("chapter-select-bg");
    this.backgroundLoaded = false;

    this.backgroundImage.onload = () => {
      this.backgroundLoaded = true;
    };

    this.backgroundImage.onerror = () => {
      console.warn("卡牌场景背景图片加载失败");
      this.backgroundLoaded = false;
    };

    // 章节目标配置
    this.chapterObjectives = {
      1: {
        title: "",
        description:
          "前世不修，身在徽州。十三四岁，往外一丢。你已年满十四，是时候外出闯荡，加油！",
      },
      2: {
        title: "",
        description:
          "机遇与风险并存，积累足够的盐业资本，在这场激烈的商战中站稳脚跟，避免被淘汰出局",
      },
      3: {
        title: "",
        description:
          "徽商素贾好儒，常借仕途以荫家族。你肩挑众望，愿一举登科，光耀门楣",
      },
      4: {
        title: "",
        description:
          "盐商与官府历来唇齿相依，却也暗藏刀光。在这场潜流涌动的政治角力里，必须谨慎应对，维系足够的政府关系，才能保家业安稳。",
      },
      // 5: {
      //   title: "第五章目标",
      //   description: "在商业帝国的巅峰时期，做出关键决策，决定家族的最终命运。",
      // },
      // 6: {
      //   title: "第六章目标",
      //   description:
      //     "面对时代变迁，在传统与革新之间找到平衡，为家族寻找新的出路。",
      // },
    };

    // 目标弹窗显示状态
    this.objectiveShown = false;
  }

  // 初始化事件和状态
  init(events, initialState, onStateChange, chapterInfo) {
    this.events = events;
    this.gameState = { ...initialState };
    this.onStateChange = onStateChange;
    this.currentEventIndex = 0;
    this.chapterTitle = chapterInfo.title;
    this.chapterNumber = chapterInfo.chapterNumber || chapterInfo.number; // 兼容两种命名方式
    this.objectiveShown = false;

    // console.log('初始化章节号:', this.chapterNumber)
    this.loadEventImages();

    // 显示章节目标弹窗
    this.showObjectiveDialog();
  }

  // 显示章节目标弹窗
  showObjectiveDialog() {
    const objective = this.chapterObjectives[this.chapterNumber];
    if (objective && this.game.dialog) {
      this.game.dialog.show({
        title: "章节目标",
        content: objective.description,
        showButton: true,
        buttonText: "我知道了",
        onClose: () => {
          this.objectiveShown = true;
        },
      });
    } else {
      this.objectiveShown = true;
    }
  }

  // 加载事件图片
  loadEventImages() {
    this.events.forEach((event, index) => {
      // 如果事件已经配置了图片，直接使用
      if (
        event.image &&
        typeof event.image === "string" &&
        event.image.trim() !== ""
      ) {
        const img = wx.createImage();
        img.src = getImageUrl(event.image);
        this.cardImages[event.id] = img;
      } else {
        // 否则根据章节和事件索引循环分配图片
        const imageKey = this.getEventImageByChapter(index);
        const img = wx.createImage();
        img.src = getImageUrl(imageKey);
        this.cardImages[event.id] = img;
      }
    });
  }

  // 根据章节循环分配图片
  getEventImageByChapter(eventIndex) {
    // 每个章节使用4张图片循环
    const imageIndex = (eventIndex % 4) + 1;

    // 各章节使用专属图片
    const imageKey = `chapter${this.chapterNumber}-card-${imageIndex}`;

    console.log(
      `章节 ${this.chapterNumber} 事件 ${eventIndex} -> 图片: ${imageKey}`
    );
    return imageKey;
  }

  // 处理触摸开始
  handleTouchStart(e) {
    // 如果目标弹窗还在显示，不处理卡牌触摸事件
    if (!this.objectiveShown || this.game.dialog.visible) {
      return;
    }

    if (this.currentEventIndex >= this.events.length) return;

    const touch = e.touches[0];
    this.dragStartX = touch.clientX;
    this.isDragging = true;
    this.dragOffset = 0;
  }

  // 处理触摸移动
  handleTouchMove(e) {
    // 如果目标弹窗还在显示，不处理卡牌触摸事件
    if (!this.objectiveShown || this.game.dialog.visible) {
      return;
    }

    if (!this.isDragging) return;

    const touch = e.touches[0];
    this.dragOffset = touch.clientX - this.dragStartX;

    // 限制拖动范围
    this.dragOffset = Math.max(Math.min(this.dragOffset, 120), -120);
  }

  // 处理触摸结束
  handleTouchEnd() {
    // 如果目标弹窗还在显示，不处理卡牌触摸事件
    if (!this.objectiveShown || this.game.dialog.visible) {
      return;
    }

    console.log("触摸结束:", {
      isDragging: this.isDragging,
      dragOffset: this.dragOffset,
      currentEventIndex: this.currentEventIndex,
    });

    if (this.isDragging) {
      // 判断是否做出选择
      if (Math.abs(this.dragOffset) > 100) {
        const event = this.events[this.currentEventIndex];
        // console.log('当前事件:', event)
        const choice = this.dragOffset > 0 ? "right" : "left";
        const shouldAdvance = this.makeChoice(event, choice);
        if (shouldAdvance) {
          this.currentEventIndex++;
        }
      }
    }

    // 重置拖动状态
    this.isDragging = false;
    this.dragOffset = 0;
  }

  // 做出选择
  makeChoice(event, choice) {
    let shouldAdvance = true; // 默认推进事件

    const choiceObj = choice === "right" ? event.choices[1] : event.choices[0];
    if (!choiceObj) return shouldAdvance;

    // 跳转到指定事件
    if (choiceObj.nextId) {
      const nextIndex = this.events.findIndex(
        (ev) => ev.id === choiceObj.nextId
      );
      if (nextIndex !== -1) {
        this.currentEventIndex = nextIndex;
        shouldAdvance = false; // 不自动+1
      }
    }

    // 第二章 event4 特殊分支处理
    if (this.chapterNumber === 2 && event.id === "event4") {
      this.loanBranch = choice === "left" ? "wife" : "loan";
      if (this.loanBranch === "wife") {
        this.events = this.events.filter((ev) => ev.id !== "event22");
      } else {
        this.events = this.events.filter((ev) => ev.id !== "event21");
      }
    }

    // 更新游戏状态
    if (choiceObj.effects) {
      Object.entries(choiceObj.effects).forEach(([key, value]) => {
        this.gameState[key] = (this.gameState[key] || 0) + value;
      });
    }

    // 特殊处理第二章的监测点
    if (this.chapterNumber === 2) {
      if (typeof choiceObj.saltChange !== "undefined") {
        if (!this.gameState.saltChanges) {
          this.gameState.saltChanges = [];
        }
        this.gameState.saltChanges.push(choiceObj.saltChange);

        // 每次有saltChange时都计算总进度，而不仅仅在event20时
        const totalProgress = this.gameState.saltChanges.reduce(
          (sum, change) => sum + change,
          0
        );
        this.gameState.saltProgress = totalProgress;
        console.log(
          "第二章盐业进度更新:",
          totalProgress,
          "当前事件索引:",
          this.currentEventIndex
        );
      }
    }

    // 特殊处理第三章的学业进度
    if (this.chapterNumber === 3) {
      if (typeof choiceObj.learningProgress !== "undefined") {
        // 初始化学进度
        if (!this.gameState.learningProgress) {
          this.gameState.learningProgress = 0;
        }
        // 累加学业进度
        this.gameState.learningProgress += choiceObj.learningProgress;
        console.log("更新学业进度:", this.gameState.learningProgress);
      }
    }

    // 特殊处理第四章的政府关系
    if (this.chapterNumber === 4) {
      if (typeof choiceObj.governmentRelation !== "undefined") {
        // 初始化政府关系
        if (!this.gameState.governmentRelation) {
          this.gameState.governmentRelation = 0;
        }
        // 累加政府关系值
        this.gameState.governmentRelation += choiceObj.governmentRelation;
        console.log("更新政府关系:", this.gameState.governmentRelation);
      }
    }

    if (this.onStateChange) {
      this.onStateChange(
        this.gameState,
        event,
        choice,
        choiceObj,
        this.currentEventIndex
      );
    }

    return shouldAdvance;

    // 检查是否需要结束章节
    if (choiceObj.ending) {
      if (this.onFinish) {
        this.onFinish({ ending: choiceObj.ending });
      }
    } else if (choiceObj.nextChapter) {
      if (this.onFinish) {
        this.onFinish({ nextChapter: true });
      }
    } else if (this.currentEventIndex >= this.events.length) {
      if (this.onFinish) {
        this.onFinish();
      }
    }
  }

  // 设置结束回调
  setOnFinish(callback) {
    this.onFinish = callback;
  }

  // 绘制卡牌
  drawCard(event) {
    const ctx = this.ctx;
    const x = this.cardX + this.dragOffset;
    const y = this.cardY;

    // 根据拖动距离计算旋转角度
    const rotation = (this.dragOffset / 150) * 0.3;

    ctx.save();

    // 移动到卡牌中心并旋转
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.translate(-x, -y);

    // 根据章节获取对应的颜色主题
    const cardColors = this.getCardColors();

    // 绘制卡牌背景
    ctx.fillStyle = cardColors.background;
    ctx.strokeStyle = cardColors.border;
    ctx.lineWidth = 3;
    // 绘制圆角矩形
    ctx.beginPath();
    const radius = 10;
    ctx.moveTo(x - this.cardWidth / 2 + radius, y - this.cardHeight / 2);
    ctx.lineTo(x + this.cardWidth / 2 - radius, y - this.cardHeight / 2);
    ctx.arcTo(
      x + this.cardWidth / 2,
      y - this.cardHeight / 2,
      x + this.cardWidth / 2,
      y - this.cardHeight / 2 + radius,
      radius
    );
    ctx.lineTo(x + this.cardWidth / 2, y + this.cardHeight / 2 - radius);
    ctx.arcTo(
      x + this.cardWidth / 2,
      y + this.cardHeight / 2,
      x + this.cardWidth / 2 - radius,
      y + this.cardHeight / 2,
      radius
    );
    ctx.lineTo(x - this.cardWidth / 2 + radius, y + this.cardHeight / 2);
    ctx.arcTo(
      x - this.cardWidth / 2,
      y + this.cardHeight / 2,
      x - this.cardWidth / 2,
      y + this.cardHeight / 2 - radius,
      radius
    );
    ctx.lineTo(x - this.cardWidth / 2, y - this.cardHeight / 2 + radius);
    ctx.arcTo(
      x - this.cardWidth / 2,
      y - this.cardHeight / 2,
      x - this.cardWidth / 2 + radius,
      y - this.cardHeight / 2,
      radius
    );
    ctx.fill();
    ctx.stroke();

    // 绘制事件图片（正方形区域，内容居中裁剪，带虚化边缘）
    const maxImgHeight = this.cardHeight * 0.45;
    const maxImgWidth = this.cardWidth * 0.7;
    const squareSize = Math.min(maxImgWidth, maxImgHeight);
    const img = this.cardImages[event.id];
    if (img && img.width && img.height) {
      // 保存当前状态
      ctx.save();

      // 创建圆角遮罩
      const imgX = x - squareSize / 2;
      const imgY = y - this.cardHeight * 0.45;
      const imgRadius = 12;

      ctx.beginPath();
      ctx.moveTo(imgX + imgRadius, imgY);
      ctx.lineTo(imgX + squareSize - imgRadius, imgY);
      ctx.arcTo(
        imgX + squareSize,
        imgY,
        imgX + squareSize,
        imgY + imgRadius,
        imgRadius
      );
      ctx.lineTo(imgX + squareSize, imgY + squareSize - imgRadius);
      ctx.arcTo(
        imgX + squareSize,
        imgY + squareSize,
        imgX + squareSize - imgRadius,
        imgY + squareSize,
        imgRadius
      );
      ctx.lineTo(imgX + imgRadius, imgY + squareSize);
      ctx.arcTo(
        imgX,
        imgY + squareSize,
        imgX,
        imgY + squareSize - imgRadius,
        imgRadius
      );
      ctx.lineTo(imgX, imgY + imgRadius);
      ctx.arcTo(imgX, imgY, imgX + imgRadius, imgY, imgRadius);
      ctx.clip();

      // 计算原图中正方形裁剪区域
      const srcSize = Math.min(img.width, img.height);
      const srcX = (img.width - srcSize) / 2;
      const srcY = (img.height - srcSize) / 2;
      ctx.drawImage(
        img,
        srcX,
        srcY,
        srcSize,
        srcSize,
        imgX,
        imgY,
        squareSize,
        squareSize
      );

      // 恢复状态
      ctx.restore();

      // 绘制从中心向四周的虚化效果
      ctx.save();

      // 创建矩形遮罩区域
      ctx.beginPath();
      ctx.moveTo(imgX + imgRadius, imgY);
      ctx.lineTo(imgX + squareSize - imgRadius, imgY);
      ctx.arcTo(
        imgX + squareSize,
        imgY,
        imgX + squareSize,
        imgY + imgRadius,
        imgRadius
      );
      ctx.lineTo(imgX + squareSize, imgY + squareSize - imgRadius);
      ctx.arcTo(
        imgX + squareSize,
        imgY + squareSize,
        imgX + squareSize - imgRadius,
        imgY + squareSize,
        imgRadius
      );
      ctx.lineTo(imgX + imgRadius, imgY + squareSize);
      ctx.arcTo(
        imgX,
        imgY + squareSize,
        imgX,
        imgY + squareSize - imgRadius,
        imgRadius
      );
      ctx.lineTo(imgX, imgY + imgRadius);
      ctx.arcTo(imgX, imgY, imgX + imgRadius, imgY, imgRadius);
      ctx.clip();

      // 创建从中心向四周的径向渐变
      const centerX = imgX + squareSize / 2;
      const centerY = imgY + squareSize / 2;
      const maxRadius = Math.sqrt(
        Math.pow(squareSize / 2, 2) + Math.pow(squareSize / 2, 2)
      );

      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        maxRadius * 0.3,
        centerX,
        centerY,
        maxRadius * 0.8
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 0)"); // 中心完全透明
      gradient.addColorStop(0.7, "rgba(255, 255, 255, 0.3)"); // 70%处开始虚化
      gradient.addColorStop(1, cardColors.background); // 边缘完全遮盖

      ctx.fillStyle = gradient;
      ctx.fillRect(imgX, imgY, squareSize, squareSize);

      ctx.restore();
    }

    // 绘制标题
    // ctx.fillStyle = cardColors.text;
    // ctx.font = this.uiHelper.getFont(20, "FangSong", true);
    // ctx.textAlign = "center";
    // ctx.fillText(event.title, x, y - this.cardHeight * 0.35 + 30);

    // 绘制描述
    ctx.fillStyle = cardColors.text;
    ctx.font = this.uiHelper.getFont(16, "FangSong");
    this.drawWrappedText(
      ctx,
      event.description,
      x,
      y + 20,
      this.cardWidth * 0.9,
      25
    );

    // 绘制选项
    this.drawChoices(event, x, y);

    ctx.restore();
  }

  // 获取卡牌颜色主题
  getCardColors() {
    const colorThemes = {
      1: {
        background: "#FDFBF7", // 宣纸白
        border: "#8B4513", // 深棕色
        text: "#5C3317", // 深棕色文字
      },
      2: {
        background: "#F0F8FF", // 青花瓷蓝
        border: "#4682B4", // 钢青色
        text: "#2F4F4F", // 深青灰文字
      },
      3: {
        background: "#F5F5DC", // 米色
        border: "#556B2F", // 橄榄绿
        text: "#3C4A3C", // 深绿文字
      },
      4: {
        background: "#FFF5EE", // 贝壳白
        border: "#CD5C5C", // 印度红
        text: "#8B3A3A", // 深红文字
      },
      5: {
        background: "#FDF5E6", // 象牙白
        border: "#8B7355", // 棕色
        text: "#5C4A3A", // 深棕文字
      },
      6: {
        background: "#F0F8FF", // 淡蓝
        border: "#2F4F4F", // 深青灰
        text: "#1C2C2C", // 深灰文字
      },
    };

    return colorThemes[this.chapterNumber] || colorThemes[1];
  }

  // 绘制选项
  drawChoices(event, x, y) {
    if (
      !event.choices ||
      !Array.isArray(event.choices) ||
      event.choices.length < 2
    ) {
      console.error("Invalid choices in event:", event);
      return;
    }

    const ctx = this.ctx;
    const leftChoice = event.choices[0];
    const rightChoice = event.choices[1];

    if (
      !leftChoice ||
      !rightChoice ||
      typeof leftChoice.text !== "string" ||
      typeof rightChoice.text !== "string"
    ) {
      console.error("Invalid choice text:", leftChoice, rightChoice);
      return;
    }

    ctx.font = this.uiHelper.getFont(16, "FangSong");
    ctx.textAlign = "center";

    const choiceY = y + this.cardHeight * 0.3;

    // 根据拖动方向显示对应选项
    if (this.dragOffset < -20) {
      // 向左滑动，显示左侧选项 - 朱红色主题
      this.drawChoiceWithBackground(
        ctx,
        leftChoice.text,
        x,
        choiceY,
        "#DC143C",
        "rgba(0, 0, 0, 0.1)"
      );
    } else if (this.dragOffset > 20) {
      // 向右滑动，显示右侧选项 - 墨绿色主题
      this.drawChoiceWithBackground(
        ctx,
        rightChoice.text,
        x,
        choiceY,
        "#2E8B57",
        "rgba(0, 0, 0, 0.1)"
      );
    } else {
      // 没有滑动或滑动距离很小，显示提示
      ctx.fillStyle = "#999999";
      ctx.font = this.uiHelper.getFont(14, "FangSong");
      ctx.fillText("长按卡牌左右滑动查看选项", x, choiceY);
    }
  }

  // 绘制带背景的选项文字
  drawChoiceWithBackground(ctx, text, x, y, textColor, backgroundColor) {
    // 测量文字尺寸
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const textHeight = 20;

    // 计算背景矩形尺寸和位置 - 增加更多padding
    const padding = 20;
    const bgWidth = textWidth + padding * 2;
    const bgHeight = textHeight + padding * 1.2;
    const bgX = x - bgWidth / 2;
    const bgY = y - textHeight / 2 - padding * 0.6;

    // 绘制黑色半透明背景
    ctx.fillStyle = backgroundColor;
    ctx.beginPath();
    const radius = 12;
    ctx.moveTo(bgX + radius, bgY);
    ctx.lineTo(bgX + bgWidth - radius, bgY);
    ctx.arcTo(bgX + bgWidth, bgY, bgX + bgWidth, bgY + radius, radius);
    ctx.lineTo(bgX + bgWidth, bgY + bgHeight - radius);
    ctx.arcTo(
      bgX + bgWidth,
      bgY + bgHeight,
      bgX + bgWidth - radius,
      bgY + bgHeight,
      radius
    );
    ctx.lineTo(bgX + radius, bgY + bgHeight);
    ctx.arcTo(bgX, bgY + bgHeight, bgX, bgY + bgHeight - radius, radius);
    ctx.lineTo(bgX, bgY + radius);
    ctx.arcTo(bgX, bgY, bgX + radius, bgY, radius);
    ctx.fill();

    // 添加金色边框装饰
    ctx.strokeStyle = "rgba(255, 215, 0, 0.1)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // 绘制文字
    ctx.fillStyle = textColor;
    ctx.font = this.uiHelper.getFont(16, "FangSong", true);
    ctx.fillText(text, x, y);
  }

  // 绘制自动换行文本
  drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split("");
    let line = "";
    let currentY = y;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i];
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && i > 0) {
        ctx.fillText(line, x, currentY);
        line = words[i];
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  }

  // 绘制背景
  drawBackground() {
    const ctx = this.ctx;

    // 使用章节选择器的背景图片
    if (this.backgroundLoaded) {
      ctx.drawImage(this.backgroundImage, 0, 0, this.width, this.height);

      // 添加半透明遮罩以确保卡牌内容清晰可见
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, this.width, this.height);
    } else {
      // 备用渐变背景（如果图片未加载）
      const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
      gradient.addColorStop(0, "#2c1810");
      gradient.addColorStop(0.3, "#3d2817");
      gradient.addColorStop(0.7, "#1f1208");
      gradient.addColorStop(1, "#0f0804");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  // 绘制章节标题
  drawChapterTitle() {
    const ctx = this.ctx;
    const y = 64; // 将y位置设置为固定值，确保标题可见

    // 绘制标题
    ctx.fillStyle = "#5C3317";
    ctx.font = this.uiHelper.getFont(18, "FangSong", true);
    ctx.textAlign = "center";
    ctx.fillText(this.chapterTitle, this.width / 2, y);
  }

  // 绘制底部提示
  drawHint() {
    const ctx = this.ctx;
    const y = this.height - 40;

    // 根据拖动状态显示不同提示
    let hintText = "长按卡牌左右滑动查看选项";

    if (this.dragOffset < -20) {
      hintText = "← 向左滑动选择";
    } else if (this.dragOffset > 20) {
      hintText = "向右滑动选择 →";
    }

    // 绘制提示文本
    ctx.fillStyle = "#666666";
    ctx.font = this.uiHelper.getFont(14, "FangSong");
    ctx.textAlign = "center";
    ctx.fillText(hintText, this.width / 2, y);
  }

  draw() {
    // 绘制背景和标题
    this.drawBackground();
    this.drawChapterTitle();

    // 绘制数值显示（标题下方）
    this.drawStatusChanges();

    if (this.currentEventIndex >= this.events.length) {
      // 所有事件已完成
      this.drawEndScreen();
      return;
    }

    const currentEvent = this.events[this.currentEventIndex];
    this.drawCard(currentEvent);

    // 绘制底部提示
    this.drawHint();

    // 如果目标弹窗还没显示完，在底部显示提示
    if (!this.objectiveShown && this.game.dialog.visible) {
      const ctx = this.ctx;
      ctx.save();
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.font = this.uiHelper.getFont(14, "FangSong");
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText("请先阅读章节目标", this.width / 2, this.height - 60);
      ctx.restore();
    }
  }

  // 绘制结束画面
  drawEndScreen() {
    const ctx = this.ctx;

    ctx.fillStyle = "#F4ECE4";
    ctx.fillRect(0, 0, this.width, this.height);

    // ctx.fillStyle = '#5C3317'
    // ctx.font = this.uiHelper.getFont(26, 'FangSong', true)
    // ctx.textAlign = 'center'
    // ctx.fillText('第一章完成', this.width/2, this.height*0.4)

    ctx.font = this.uiHelper.getFont(18, "FangSong");
    ctx.fillText("点击继续...", this.width / 2, this.height * 0.8);
  }

  // 绘制数值变化展示
  drawStatusChanges() {
    // 第一章不显示数值
    if (this.chapterNumber === 1) return;

    const ctx = this.ctx;

    // 获取当前章节的关键数值
    const statusInfo = this.getChapterStatusInfo();
    if (!statusInfo) return;

    // 收集需要显示的当前数值
    const currentValues = {};

    // 各章节特殊数值
    if (this.chapterNumber === 2 && this.gameState.saltProgress !== undefined) {
      currentValues.saltProgress = this.gameState.saltProgress;
    }
    if (
      this.chapterNumber === 3 &&
      this.gameState.learningProgress !== undefined
    ) {
      currentValues.learningProgress = this.gameState.learningProgress;
    }
    if (
      this.chapterNumber === 4 &&
      this.gameState.governmentRelation !== undefined
    ) {
      currentValues.governmentRelation = this.gameState.governmentRelation;
    }

    // 过滤出需要显示的数值
    const displayValues = {};
    Object.keys(currentValues).forEach((key) => {
      if (statusInfo.keys.includes(key)) {
        displayValues[key] = currentValues[key];
      }
    });

    if (Object.keys(displayValues).length === 0) return;

    // 计算位置 - 标题下方固定位置
    const boxWidth = 120;
    const boxHeight = 40;
    const boxX = this.width / 2 - boxWidth / 2;
    const boxY = 85;

    ctx.save();

    // 绘制数值项 - 居中显示
    Object.keys(displayValues).forEach((key) => {
      const value = displayValues[key] || 0;
      const statusName = statusInfo.names[key] || key;

      // 绘制数值名称和数值在同一行
      ctx.fillStyle = "#1a1a1a";
      ctx.font = this.uiHelper.getFont(14, "FangSong", true);
      ctx.textAlign = "center";
      ctx.fillText(
        `${statusName}: ${value}`,
        boxX + boxWidth / 2,
        boxY + boxHeight / 2 + 5
      );
    });

    ctx.restore();
  }

  // 获取章节状态信息配置
  getChapterStatusInfo() {
    const statusConfig = {
      1: {
        keys: [], // 第一章不显示数值
        names: {},
      },
      2: {
        keys: ["saltProgress"],
        names: {
          saltProgress: "盐业资本",
        },
      },
      3: {
        keys: ["learningProgress"],
        names: {
          learningProgress: "学业进展",
        },
      },
      4: {
        keys: ["governmentRelation"],
        names: {
          governmentRelation: "政府关系",
        },
      },
    };

    return statusConfig[this.chapterNumber];
  }
}
