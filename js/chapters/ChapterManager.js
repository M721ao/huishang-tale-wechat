// 章节管理器
import { chapter1 } from './chapter1.js'
import { chapter2 } from './chapter2.js'
import { chapter3 } from './chapter3.js'
import { chapter4 } from './chapter4.js'
import { chapter5 } from './chapter5.js'
import { chapter6 } from './chapter6.js'
import { Dialog } from '../components/Dialog.js'

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
                title: '红顶商人',
                condition: (attributes) => {
                    return attributes.wealth >= 1000 && attributes.reputation >= 80
                }
            },
            {
                id: 'ending-2',
                title: '普通商人',
                condition: (attributes) => {
                    return attributes.wealth >= 500 && attributes.reputation >= 50
                }
            },
            {
                id: 'ending-3',
                title: '落魄商人',
                condition: (attributes) => {
                    return true // 默认结局
                }
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
            if (ending.condition(attributes)) {
                return ending
            }
        }
        return null
    }

    // 显示结局
    showEnding(ending) {
        // TODO: 显示结局场景
        console.log('触发结局：', ending.title)
        this.game.setScene(this.game.titleScene, 'title')
    }

    // 开始章节卡牌
    startChapterCards() {
        const chapter = this.getCurrentChapter()
        
        console.log('Current chapter:', chapter.title)
        
        // 初始化卡牌场景
        const cardEvents = chapter.cardEvents
        if (!cardEvents || !Array.isArray(cardEvents)) {
            console.error('Invalid card events in chapter:', chapter)
            return
        }
        
        console.log('Initializing card scene with', cardEvents.length, 'events')
        
        // 准备章节信息
        const chapterInfo = {
            title: chapter.title,
            number: this.currentChapter
        }
        
        // 初始化卡牌场景
        this.game.cardScene.init(cardEvents, this.getChapterAttributes(), (state, event, choice, choiceData) => {
            // 更新状态
            this.updateAttributes(state)
            
            // 特殊处理第一章的选择结果
            if (this.currentChapter === 1 && choiceData.result) {
                console.log('显示选择结果:', choiceData.result)
                this.game.dialog.show(choiceData.result, () => {
                    // 处理结果
                    if (choiceData.ending) {
                        const ending = this.endings.find(e => e.id === choiceData.ending)
                        if (ending) {
                            this.showEnding(ending)
                        }
                    } else if (choiceData.nextChapter) {
                        this.currentChapter++
                        this.startChapterTitle()
                    }
                })
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
