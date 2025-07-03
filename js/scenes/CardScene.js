// 卡牌场景
import { getUIHelper } from "../utils/UIHelper.js";
import { getImageUrl } from "../config/resourceConfig.js";

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

    // 初始化背景纹理
    this.patterns = {
      1: this.createPattern("#FDFBF7", "#8B4513"), // 第一章：宣纸白配深棕色
      2: this.createPattern("#F0F8FF", "#4682B4"), // 第二章：青花瓷蓝配钢青色
      3: this.createPattern("#F5F5DC", "#556B2F"), // 第三章：米色配橄榄绿
      4: this.createPattern("#FFF5EE", "#CD5C5C"), // 第四章：贝壳白配印度红
      5: this.createPattern("#FDF5E6", "#8B7355"), // 第五章：象牙白配棕色
      6: this.createPattern("#F0F8FF", "#2F4F4F"), // 第六章：淡蓝配深青灰
    };
  }

  // 初始化事件和状态
  init(events, initialState, onStateChange, chapterInfo) {
    this.events = events;
    this.gameState = { ...initialState };
    this.onStateChange = onStateChange;
    this.currentEventIndex = 0;
    this.chapterTitle = chapterInfo.title;
    this.chapterNumber = chapterInfo.chapterNumber || chapterInfo.number; // 兼容两种命名方式
    // console.log('初始化章节号:', this.chapterNumber)
    this.loadEventImages();
  }

  // 获取默认卡牌图片
  getDefaultCardImage() {
    const defaultImages = {
      1: "card-1",
      2: "card-2",
      3: "card-3",
      4: "card-4",
      // 5: "card-5",
      // 6: "card-6",
    };
    return defaultImages[this.chapterNumber] || "card-1";
  }

  // 加载事件图片
  loadEventImages() {
    // 创建默认图片
    const defaultImage = wx.createImage();
    defaultImage.src = getImageUrl(this.getDefaultCardImage());

    this.events.forEach((event) => {
      if (
        event.image &&
        typeof event.image === "string" &&
        event.image.trim() !== ""
      ) {
        const img = wx.createImage();
        img.src = getImageUrl(event.image);
        this.cardImages[event.id] = img;
      } else {
        this.cardImages[event.id] = defaultImage;
        if (event.image) {
          console.log(
            "CardScene: 无效的事件图片路径:",
            event.image,
            "for event:",
            event.id
          );
        }
      }
    });
  }

  // 处理触摸开始
  handleTouchStart(e) {
    if (this.currentEventIndex >= this.events.length) return;

    const touch = e.touches[0];
    this.dragStartX = touch.clientX;
    this.isDragging = true;
    this.dragOffset = 0;
  }

  // 处理触摸移动
  handleTouchMove(e) {
    if (!this.isDragging) return;

    const touch = e.touches[0];
    this.dragOffset = touch.clientX - this.dragStartX;

    // 限制拖动范围
    this.dragOffset = Math.max(Math.min(this.dragOffset, 150), -150);
  }

  // 处理触摸结束
  handleTouchEnd() {
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

    // // 第三章 抓周仪式特殊处理
    // if (
    //   this.chapterNumber === 3 &&
    //   ["event1", "event2", "event3", "event4", "event5"].includes(event.id)
    // ) {
    //   if (choice === "left") {
    //     if (this.game && this.game.dialog) {
    //       const message =
    //         event.id !== "event5"
    //           ? "父亲温柔地把算盘放回地上，请你再选一次"
    //           : "父亲一声叹气：为夫盼你不复贾竖子之道";
    //       this.game.dialog.show(message, () => {});
    //     } else {
    //       console.error("无法获取 Dialog 实例");
    //     }
    //   } else {
    //     // 如果选择朱子，则直接跳到 event6
    //     const nextEventIndex = this.events.findIndex(
    //       (ev) => ev.id === "event6"
    //     );
    //     if (nextEventIndex !== -1) {
    //       this.currentEventIndex = nextEventIndex - 1; // 设置为目标索引前一个，因为 handleTouchEnd 会自增
    //     }
    //   }
    // }

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

    // 特殊处理第三章的学力进度
    if (this.chapterNumber === 3) {
      if (typeof choiceObj.learningProgress !== "undefined") {
        // 初始化学力进度
        if (!this.gameState.learningProgress) {
          this.gameState.learningProgress = 0;
        }
        // 累加学力进度
        this.gameState.learningProgress += choiceObj.learningProgress;
        console.log("更新学力进度:", this.gameState.learningProgress);
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

    // 绘制事件图片（正方形区域，内容居中裁剪）
    const maxImgHeight = this.cardHeight * 0.45;
    const maxImgWidth = this.cardWidth * 0.7;
    const squareSize = Math.min(maxImgWidth, maxImgHeight);
    const img = this.cardImages[event.id];
    if (img && img.width && img.height) {
      // 计算原图中正方形裁剪区域
      const srcSize = Math.min(img.width, img.height);
      const srcX = (img.width - srcSize) / 2;
      const srcY = (img.height - srcSize) / 2;
      ctx.drawImage(
        img,
        srcX,
        srcY,
        srcSize,
        srcSize, // 裁剪原图正方形
        x - squareSize / 2,
        y - this.cardHeight * 0.45,
        squareSize,
        squareSize
      );
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

    // 根据拖动方向显示对应选项
    if (this.dragOffset < -20) {
      // 向左滑动，显示左侧选项
      ctx.fillStyle = "#4CAF50";
      ctx.fillText(leftChoice.text, x, y + this.cardHeight * 0.3);
    } else if (this.dragOffset > 20) {
      // 向右滑动，显示右侧选项
      ctx.fillStyle = "#4CAF50";
      ctx.fillText(rightChoice.text, x, y + this.cardHeight * 0.3);
    } else {
      // 没有滑动或滑动距离很小，显示提示
      ctx.fillStyle = "#999999";
      ctx.font = this.uiHelper.getFont(14, "FangSong");
      ctx.fillText("左右滑动选择", x, y + this.cardHeight * 0.3);
    }
  }

  // 绘制自动换行文本
  drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
    // 使用自适应行高
    const adaptiveLineHeight = this.uiHelper.getLineHeight(lineHeight);
    const words = text.split("");
    let line = "";
    let posY = y;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i];
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, x, posY);
        line = words[i];
        posY += adaptiveLineHeight;
      } else {
        line = testLine;
      }
    }

    ctx.fillText(line, x, posY);
  }

  // 绘制场景
  // 创建背景纹理
  createPattern(color1, color2) {
    const size = 80;
    const canvas = wx.createCanvas();
    canvas.width = size;
    canvas.height = size;
    const patternCtx = canvas.getContext("2d");

    // 绘制中国传统纹理背景
    patternCtx.fillStyle = color1;
    patternCtx.fillRect(0, 0, size, size);

    // 绘制云纹纹理
    patternCtx.strokeStyle = color2;
    patternCtx.lineWidth = 1;
    patternCtx.globalAlpha = 0.15;

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
    patternCtx.globalAlpha = 0.08;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const x = 20 + i * 20;
        const y = 20 + j * 20;
        drawCloudPattern(x, y);
      }
    }

    return this.ctx.createPattern(canvas, "repeat");
  }

  // 绘制背景
  drawBackground() {
    const pattern = this.patterns[this.chapterNumber] || this.patterns[1];
    this.ctx.fillStyle = pattern;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  // 绘制章节标题
  drawChapterTitle() {
    const ctx = this.ctx;
    const y = 50; // 将y位置设置为固定值，确保标题可见

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
    let hintText = "左右滑动选择选项";

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
    if (this.currentEventIndex >= this.events.length) {
      // 所有事件已完成
      this.drawEndScreen();
      return;
    }

    // 绘制背景和标题
    this.drawBackground();
    this.drawChapterTitle();

    const currentEvent = this.events[this.currentEventIndex];
    this.drawCard(currentEvent);

    // 绘制底部提示
    this.drawHint();
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
}
