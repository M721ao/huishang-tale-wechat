// 章节管理器
import { chapter1 } from './chapter1.js'
import { chapter2 } from './chapter2.js'
import { chapter3 } from './chapter3.js'
import { chapter4 } from './chapter4.js'
import { chapter5 } from './chapter5.js'
import { chapter6 } from './chapter6.js'

export class ChapterManager {
    constructor(game) {
        this.game = game
        this.currentChapter = 1
        this.chapters = {
            1: chapter1,
            2: chapter2,
            3: chapter3,
            4: chapter4,
            5: chapter5,
            6: chapter6,
        }
        
        // 结局条件
        this.endings = [
            {
                id: 'ending-1',
                title: '安心茶商',
                description: '你成功经营了茶商，过上了安稳的生活',
                image: 'images/backgrounds/endings/ending-1.png'
            },
            {
                id: 'ending-2',
                title: '落寞回乡',
                description: '没能在扬州立足，最终落寞回乡',
                image: 'images/backgrounds/endings/ending-2.png'
            },
            {
                id: 'ending-3',
                title: '急流勇退',
                description: '奋斗一生，选择急流勇退',
                image: 'images/backgrounds/endings/ending-1.png'
            },
            {
                id: 'ending-4',
                title: '普通商人',
               
            },
            {
                id: 'ending-5',
                title: '落魄商人',
               
            }
        ]
    }

    // 获取当前章节数据
    getCurrentChapter() {
        return this.chapters[this.currentChapter]
    }

    // 开始章节标题
    startChapterTitle() {
        const chapter = this.getCurrentChapter()
        this.game.setScene(this.game.chapterTitleScene, 'chapterTitle')
        this.game.chapterTitleScene.setTitle(`第${this.currentChapter}章`)
        this.game.chapterTitleScene.setOnFinish(() => {
            this.startChapterStory()
        })
    }

    // 开始章节故事
    startChapterStory() {
        const chapter = this.getCurrentChapter()
        this.game.setScene(this.game.storyScene, 'story')
        this.game.storyScene.loadScript(chapter.storyScript)
        this.game.storyScene.setOnFinish(() => {
            this.startChapterCards()
        })
    }

    // 检查结局
    checkEnding() {
        const attributes = this.game.progress.attributes[this.currentChapter] || {}
        for (const ending of this.endings) {
            if (ending.condition && ending.condition(attributes)) {
                return ending
            }
        }
        return null
    }

    // 显示结局
    showEnding(ending) {
        console.log('显示结局:', ending)
        this.game.endingScene.init(ending.title, ending.description, ending.image, () => {
            // 结局后返回标题场景
            this.game.setScene(this.game.titleScene, 'title')
        })
        this.game.setScene(this.game.endingScene, 'ending')
    }

    // 获取章节属性
    getChapterAttributes() {
        return this.game.progress.attributes[this.currentChapter] || {}
    }

    // 更新章节属性
    updateAttributes(state) {
        this.game.progress.attributes[this.currentChapter] = state
    }

    // 检查第二章监测点
    checkChapter2Progress(eventIndex, attributes) {
        if (eventIndex === 9) { // 第10个选择后检查
            if (attributes.saltProgress < 5) {
                return this.endings.find(e => e.id === 'ending-2') // 监测点结局
            }
        }
        return null
    }

// 检查第三章监测点
checkChapter3Progress(eventIndex, attributes, lastChoice, grabZhouCount) {
    // 抓周仪式特殊处理
    if (eventIndex === 0) { // 第一个事件
        if (lastChoice === 'left') { // 假设左边是算盘
            if (grabZhouCount < 4) {
                // 弹窗提示父亲温柔劝说
                this.game.dialog.show('父亲温柔地把算盘放回地上，请你再选一次', () => {});
                return { special: true, holdEvent: true }; // 不推进事件
            } else if (grabZhouCount === 4) {
                // 第5次还选算盘，弹窗父亲叹气并推进
                this.game.dialog.show('父亲一声叹气：为夫盼你不复贾竖子之道', () => {
                    // 推进到下一个事件
                    this.game.cardScene.currentEventIndex++;
                    this.game.cardScene.nextEvent && this.game.cardScene.nextEvent();
                });
                return { special: true, holdEvent: false }; // 推进事件
            }
        }
    }

    // 普通学力结局判定
    if (eventIndex === 14) { // 第15个选择后检查
        if (attributes.learningProgress < 7) {
            return this.endings.find(e => e.id === 'ending-3'); // 学力不足结局
        }
    }
    return null;
}

    // 检查是否需要显示弹窗
    shouldShowDialog(chapterNum, eventIndex) {
        switch(chapterNum) {
            case 1:
                return true // 第一章总是显示弹窗
            case 2:
                return eventIndex >= 10 // 第二章从第11个选择开始显示弹窗
            case 3:
                return eventIndex >= 15 // 第三章从第16个选择开始显示弹窗
            default:
                return false
        }
    }

    // 开始章节卡牌
    startChapterCards() {
        const chapter = this.getCurrentChapter()
        
        console.log('Current chapter:', chapter.title)
        
        // 启动章节卡牌场景
        const cardEvents = this.chapters[this.currentChapter].cardEvents
        const chapterInfo = {
            chapterNumber: this.currentChapter,
            title: this.chapters[this.currentChapter].title
        }
        
        this.game.cardScene.init(cardEvents, this.getChapterAttributes(), (state, event, choice, choiceData, eventIndex) => {
            // 特殊呼叫，用于获取 Dialog 实例
            if (state === 'getDialog') {
                return this.game.dialog;
            }
            
            this.updateAttributes(state)
            
            // 检查章节特殊监测点
            let ending = null
            if (this.currentChapter === 2) {
                ending = this.checkChapter2Progress(eventIndex, state)
            } else if (this.currentChapter === 3) {
                ending = this.checkChapter3Progress(eventIndex, state)
            }

            // 如果需要显示弹窗
            if (this.shouldShowDialog(this.currentChapter, eventIndex) && choiceData && choiceData.result) {
                console.log('显示选择结果:', choiceData.result)
                this.game.dialog.show(choiceData.result, () => {
                    if (ending) {
                        this.showEnding(ending)
                    } else if (choiceData.ending) {
                        const choiceEnding = this.endings.find(e => e.id === choiceData.ending)
                        if (choiceEnding) {
                            this.showEnding(choiceEnding)
                        }
                    } else if (choiceData.nextChapter) {
                        this.currentChapter++
                        this.startChapterTitle()
                    }
                })
            } else if (ending) {
                this.showEnding(ending)
            } else if (choiceData && choiceData.ending) {
                const choiceEnding = this.endings.find(e => e.id === choiceData.ending)
                if (choiceEnding) {
                    this.showEnding(choiceEnding)
                }
            } else if (choiceData && choiceData.nextChapter) {
                this.currentChapter++
                this.startChapterTitle()
            }
        }, chapterInfo)
        
        // 切换到卡牌场景
        this.game.setScene(this.game.cardScene, 'card')
    }

    // 获取当前章节属性
    getChapterAttributes() {
        return this.game.progress.attributes[this.currentChapter] || {
            wealth: 0,
            reputation: 0
        }
    }

    // 更新属性
    updateAttributes(changes) {
        const currentAttributes = this.getChapterAttributes()
        this.game.progress.attributes[this.currentChapter] = {
            wealth: currentAttributes.wealth + (changes.wealth || 0),
            reputation: currentAttributes.reputation + (changes.reputation || 0)
        }
        // this.game.saveProgress()
    }
}
