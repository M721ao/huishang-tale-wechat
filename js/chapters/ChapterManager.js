// 章节管理器
import { chapter1 } from "./chapter1.js";
import { chapter2 } from "./chapter2.js";
import { chapter3 } from "./chapter3.js";
import { chapter4 } from "./chapter4.js";
import { chapter5 } from "./chapter5.js";
import { chapter6 } from "./chapter6.js";
import { chapter7 } from "./chapter7.js";
import { getEndingImageUrl } from "../config/resourceConfig.js";

export class ChapterManager {
  constructor(game) {
    this.game = game;
    this.currentChapter = 1;
    this.chapters = {
      1: chapter1,
      2: chapter2,
      3: chapter3,
      4: chapter4,
      5: chapter5,
      6: chapter6,
      7: chapter7,
    };

    // 结局条件
    this.endings = [
      {
        id: "ending-1",
        title: "富贵茶商",
        description:
          "你一生专注茶业，虽未踏足更高仕途，却也自成一方富贵。最终将母亲接到杭州，共享平稳安乐的岁月。",
        image: getEndingImageUrl("ending-1"),
      },
      {
        id: "ending-2",
        title: "落寞回乡",
        description:
          "十年扬州客，终成一场黄粱梦。商路险恶，群雄逐利，你始终难以立足。两鬓染霜后，终于收拾行囊，踏上回乡之路。",
        image: getEndingImageUrl("ending-2"),
      },
      {
        id: "ending-3",
        title: "书香渐息",
        description:
          "商路依旧繁忙，铺面人来人往，然而家族始终缺少庙堂荫护，家业也只能困守一隅，风光。",
        image: getEndingImageUrl("ending-3"),
      },

      {
        id: "ending-4",
        title: "朱楼倾覆",
        description:
          "再富丽的朱楼，也禁不起积重难返。终究因家道衰落而轰然坍塌，昔日繁华只余断瓦残垣。",
        image: getEndingImageUrl("ending-4"),
      },
    ];
  }

  // 获取当前章节数据
  getCurrentChapter() {
    return this.chapters[this.currentChapter];
  }

  // 开始章节标题
  startChapterTitle() {
    const chapter = this.getCurrentChapter();
    this.game.setScene(this.game.chapterTitleScene, "chapterTitle");
    this.game.chapterTitleScene.setTitle(`第${this.currentChapter}章`);
    this.game.chapterTitleScene.setOnFinish(() => {
      this.startChapterStory();
    });
  }

  // 开始章节故事
  startChapterStory() {
    const chapter = this.getCurrentChapter();
    this.game.setScene(this.game.storyScene, "story");
    this.game.storyScene.loadScript(chapter.storyScript);
    this.game.storyScene.setOnFinish(() => {
      // 检查是否有卡牌事件
      if (chapter.cardEvents && chapter.cardEvents.length > 0) {
        this.startChapterCards();
      } else {
        console.log(
          "章节 " + this.currentChapter + " 没有卡牌事件，直接进入下一章"
        );
        // 如果是最后一章，显示结局
        if (this.currentChapter >= Object.keys(this.chapters).length) {
          this.showEnding({
            title: "游戏结束",
            description: "感谢您的游玩，故事已经结束。",
            image: getEndingImageUrl("final-scene"),
          });
        } else {
          // 否则进入下一章
          this.currentChapter++;
          this.startChapterTitle();
        }
      }
    });
  }

  // 检查结局
  checkEnding() {
    const attributes = this.game.progress.attributes[this.currentChapter] || {};
    for (const ending of this.endings) {
      if (ending.condition && ending.condition(attributes)) {
        return ending;
      }
    }
    return null;
  }

  // 显示结局
  showEnding(ending) {
    console.log("显示结局:", ending);
    this.game.endingScene.init(
      ending.title,
      ending.description,
      ending.image,
      () => {
        // 结局后重置游戏进度为章节1
        console.log("结局结束，重置游戏进度");
        this.currentChapter = 1;
        this.game.progress.currentChapter = 1;
        this.game.progress.attributes = {}; // 清空属性

        // 保存重置后的进度
        if (this.game.userManager) {
          this.game.userManager.saveGameProgress(1);
        }

        // 返回标题场景
        this.game.setScene(this.game.titleScene, "title");
      }
    );
    this.game.setScene(this.game.endingScene, "ending");
  }

  // 获取章节属性
  getChapterAttributes() {
    // 确保 attributes 对象存在
    if (!this.game.progress.attributes) {
      this.game.progress.attributes = {};
    }

    return (
      this.game.progress.attributes[this.currentChapter] || {
        wealth: 0,
        reputation: 0,
      }
    );
  }

  // 更新章节属性
  updateAttributes(changes) {
    // 确保 attributes 对象存在
    if (!this.game.progress.attributes) {
      this.game.progress.attributes = {};
    }

    // 直接使用传入的完整状态对象，而不是只保存部分属性
    this.game.progress.attributes[this.currentChapter] = { ...changes };

    console.log("属性已更新:", {
      chapter: this.currentChapter,
      attributes: this.game.progress.attributes[this.currentChapter],
    });
    // this.game.saveProgress()
  }

  // 检查第二章监测点
  checkChapter2Progress(eventIndex, attributes) {
    if (eventIndex === 19) {
      console.log("检查第二章监测点", attributes.saltProgress);
      if (attributes.saltProgress < 8.5) {
        return this.endings.find((e) => e.id === "ending-2");
      }
    }
    return null;
  }

  // 检查第三章监测点
  checkChapter3Progress(eventIndex, attributes) {
    // 普通学业进展结局判定
    if (eventIndex === 18) {
      console.log("检查第三章监测点", attributes.learningProgress);
      if (attributes.learningProgress < 18) {
        return this.endings.find((e) => e.id === "ending-3"); // 学业进展不足结局
      } else {
        // 创建一个特殊对象来标记需要进入下一章
        return { nextChapter: true };
      }
    }
    return null;
  }

  // 检查第四章监测点
  checkChapter4Progress(eventIndex, attributes) {
    // 政府关系结局判定
    if (eventIndex === 19) {
      // 第20个选择后检查
      console.log("检查第四章监测点", attributes.governmentRelation);
      if (attributes.governmentRelation < 50) {
        return this.endings.find((e) => e.id === "ending-4"); // 政府关系不足结局（抄家）
      } else {
        // 创建一个特殊对象来标记需要进入下一章
        return { nextChapter: true };
      }
    }
    return null;
  }

  // 检查是否需要显示弹窗
  shouldShowDialog(chapterNum, eventIndex) {
    switch (chapterNum) {
      case 1:
        return true; // 第一章总是显示弹窗
      case 2:
        return eventIndex >= 10; // 第二章从第11个选择开始显示弹窗
      case 3:
        return eventIndex >= 15; // 第三章从第16个选择开始显示弹窗
      default:
        return false;
    }
  }

  // 开始章节卡牌
  startChapterCards() {
    const chapter = this.getCurrentChapter();

    console.log("Current chapter:", chapter.title);

    // 检查是否有卡牌事件
    if (!chapter.cardEvents || chapter.cardEvents.length === 0) {
      console.log(
        "章节 " + this.currentChapter + " 没有卡牌事件，直接进入下一章"
      );
      // 如果是最后一章，显示结局
      if (this.currentChapter >= Object.keys(this.chapters).length) {
        this.showEnding({
          title: "游戏结束",
          description: "感谢您的游玩，故事已经结束。",
          image: getEndingImageUrl("final-scene"),
        });
      } else {
        // 否则进入下一章
        this.currentChapter++;
        this.startChapterTitle();
      }
      return;
    }

    // 启动章节卡牌场景
    const cardEvents = chapter.cardEvents;
    const chapterInfo = {
      chapterNumber: this.currentChapter,
      title: chapter.title,
    };

    this.game.cardScene.init(
      cardEvents,
      this.getChapterAttributes(),
      (state, event, choice, choiceData, eventIndex) => {
        // 特殊呼叫，用于获取 Dialog 实例
        if (state === "getDialog") {
          return this.game.dialog;
        }

        this.updateAttributes(state);

        // 检查章节特殊监测点
        let ending = null;
        if (this.currentChapter === 2) {
          ending = this.checkChapter2Progress(eventIndex, state);
        } else if (this.currentChapter === 3) {
          ending = this.checkChapter3Progress(eventIndex, state);
        } else if (this.currentChapter === 4) {
          ending = this.checkChapter4Progress(eventIndex, state);
        }

        // 如果需要显示弹窗
        if (
          this.shouldShowDialog(this.currentChapter, eventIndex) &&
          choiceData &&
          choiceData.result
        ) {
          console.log("显示选择结果:", choiceData.result);
          this.game.dialog.show(choiceData.result, () => {
            if (ending) {
              // 检查是否是进入下一章节的信号
              if (ending.nextChapter) {
                this.currentChapter++;
                this.startChapterTitle();
              } else {
                // 显示结局解释弹窗，然后显示结局
                this.showEndingExplanation(ending, state, () => {
                  this.showEnding(ending);
                });
              }
            } else if (choiceData.ending) {
              const choiceEnding = this.endings.find(
                (e) => e.id === choiceData.ending
              );
              if (choiceEnding) {
                // 显示结局解释弹窗，然后显示结局
                this.showEndingExplanation(choiceEnding, state, () => {
                  this.showEnding(choiceEnding);
                });
              }
            } else if (choiceData.nextChapter) {
              this.currentChapter++;
              this.startChapterTitle();
            }
          });
        } else if (ending) {
          // 检查是否是进入下一章节的信号
          if (ending.nextChapter) {
            this.currentChapter++;
            this.startChapterTitle();
          } else {
            // 显示结局解释弹窗，然后显示结局
            this.showEndingExplanation(ending, state, () => {
              this.showEnding(ending);
            });
          }
        } else if (choiceData && choiceData.ending) {
          const choiceEnding = this.endings.find(
            (e) => e.id === choiceData.ending
          );
          if (choiceEnding) {
            // 显示结局解释弹窗，然后显示结局
            this.showEndingExplanation(choiceEnding, state, () => {
              this.showEnding(choiceEnding);
            });
          }
        } else if (choiceData && choiceData.nextChapter) {
          this.currentChapter++;
          this.startChapterTitle();
        }
      },
      chapterInfo
    );

    // 切换到卡牌场景
    this.game.setScene(this.game.cardScene, "card");
  }

  // 获取结局解释文本
  getEndingExplanation(endingId, attributes) {
    const explanations = {
      "ending-1":
        "你选择了安稳的茶业道路，错过了徽商即将在盐业掀起的风云变化。",
      "ending-2":
        "你虽握盐引在手，却疏于经营人脉与资财，未能为日后奠下厚实根基，终难立足于扬州这片商潮之地",
      "ending-3": "你未能及第入仕，为家族赢得庇荫。",
      "ending-4":
        "贩卖私盐成了压垮骆驼的最后一根稻草，政局多变、暗潮汹涌，你终未能在这场博弈中全身而退。",
    };
    return explanations[endingId] || "你的选择决定了这个结局。";
  }

  // 显示结局前的解释弹窗
  showEndingExplanation(ending, attributes, callback) {
    console.log("showEndingExplanation called:", {
      ending: ending.id,
      callback: typeof callback,
    });
    const explanation = this.getEndingExplanation(ending.id, attributes);
    console.log("Explanation:", explanation);

    this.game.dialog.show({
      title: "进入结局",
      content: explanation,
      showButton: true,
      buttonText: "我知道了",
      onClose: () => {
        console.log("Dialog onClose callback triggered");
        if (callback) {
          console.log("Calling ending callback");
          callback();
        }
      },
    });
  }
}
