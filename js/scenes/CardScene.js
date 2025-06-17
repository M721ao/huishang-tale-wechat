// 卡牌场景
import { getUIHelper } from '../utils/UIHelper.js'

export class CardScene {
    constructor(game, ctx, width, height) {
        this.game = game;
        this.ctx = ctx
        this.width = width
        this.height = height
        
        // 获取UI辅助工具
        this.uiHelper = getUIHelper()
        
        // 卡牌状态
        this.currentEventIndex = 0
        this.events = []
        this.cardX = width / 2
        this.cardY = height / 2
        this.cardWidth = width * 0.8
        this.cardHeight = height * 0.7
        this.dragStartX = 0
        this.isDragging = false
        this.dragOffset = 0
        
        // 游戏状态
        this.gameState = null
        this.onStateChange = null
        this.onFinish = null
        this.chapterTitle = ''
        this.chapterNumber = 1
        
        // 加载图片资源
        this.cardImages = {}
        
        // 初始化背景纹理
        this.patterns = {
            1: this.createPattern('#F4ECE4', '#E8D5C4'),  // 第一章：淡粉色
            2: this.createPattern('#E3F4F4', '#D2E9E9'),  // 第二章：淡蓝色
            3: this.createPattern('#D4E2D4', '#C4D7B2'),  // 第三章：淡绿色
            4: this.createPattern('#FFE3E1', '#FFD1D1'),  // 第四章：淡红色
            5: this.createPattern('#E8D5C4', '#DFD3C3'),  // 第五章：淡棕色
            6: this.createPattern('#F8EDE3', '#DFD3C3')   // 第六章：淡黄色
        }
    }
    
    // 初始化事件和状态
    init(events, initialState, onStateChange, chapterInfo) {
        this.events = events
        this.gameState = {...initialState}
        this.onStateChange = onStateChange
        this.currentEventIndex = 0
        this.chapterTitle = chapterInfo.title
        this.chapterNumber = chapterInfo.chapterNumber || chapterInfo.number // 兼容两种命名方式
        // console.log('初始化章节号:', this.chapterNumber)
        this.loadEventImages()
    }
    
    // 获取章节默认卡牌图片
    getDefaultCardImage() {
        const defaultImages = {
            1: 'images/card_events/one.png',
            2: 'images/card_events/two.png',
            3: 'images/card_events/three.png',
            4: 'images/card_events/four.png',
        }
        return defaultImages[this.chapterNumber] || 'images/card_events/one.png'
    }

    // 加载事件图片
    loadEventImages() {
        // 创建默认图片
        const defaultImage = wx.createImage()
        defaultImage.src = this.getDefaultCardImage()
        
        this.events.forEach(event => {
            if (event.image) {
                const img = wx.createImage()
                img.src = event.image
                this.cardImages[event.id] = img
            } else {
                this.cardImages[event.id] = defaultImage
            }
        })
    }
    
    // 处理触摸开始
    handleTouchStart(e) {
        if (this.currentEventIndex >= this.events.length) return
        
        const touch = e.touches[0]
        this.dragStartX = touch.clientX
        this.isDragging = true
        this.dragOffset = 0
    }
    
    // 处理触摸移动
    handleTouchMove(e) {
        if (!this.isDragging) return
        
        const touch = e.touches[0]
        this.dragOffset = touch.clientX - this.dragStartX
        
        // 限制拖动范围
        this.dragOffset = Math.max(Math.min(this.dragOffset, 150), -150)
    }
    
    // 处理触摸结束
    handleTouchEnd() {
        console.log('触摸结束:', {
            isDragging: this.isDragging,
            dragOffset: this.dragOffset,
            currentEventIndex: this.currentEventIndex
        })
        
        if (this.isDragging) {
            // 判断是否做出选择
            if (Math.abs(this.dragOffset) > 100) {
                const event = this.events[this.currentEventIndex]
                // console.log('当前事件:', event)
                const choice = this.dragOffset > 0 ? 'right' : 'left';
                const shouldAdvance = this.makeChoice(event, choice);
                if (shouldAdvance) {
                    this.currentEventIndex++;
                }
            }
        }
        
        // 重置拖动状态
        this.isDragging = false
        this.dragOffset = 0
    }
    
    // 做出选择
    makeChoice(event, choice) {
        let shouldAdvance = true; // 默认推进事件

        // 第二章 event3 特殊分支处理
        if (this.chapterNumber === 2 && event.id === 'event3') {
            this.loanBranch = (choice === 'left') ? 'wife' : 'loan';
            if (this.loanBranch === 'wife') {
                this.events = this.events.filter(ev => ev.id !== 'event14');
            } else {
                this.events = this.events.filter(ev => ev.id !== 'event13');
            }
            console.log('剩余事件ID:', this.events.map(e => e.id).join(', '));
        }

        // 第三章 抓周仪式特殊处理
        if (this.chapterNumber === 3 && ['event1', 'event2', 'event3', 'event4', 'event5'].includes(event.id)) {
            if (choice === 'left') {
                if (this.game && this.game.dialog) {
                    const message = (event.id !== 'event5')
                        ? '父亲温柔地把算盘放回地上，请你再选一次'
                        : '父亲一声叹气：为夫盼你不复贾竖子之道';
                    this.game.dialog.show(message, () => {});
                } else {
                    console.error('无法获取 Dialog 实例');
                }
            } else {
                // 如果选择朱子，则直接跳到 event6
                const nextEventIndex = this.events.findIndex(ev => ev.id === 'event6');
                if (nextEventIndex !== -1) {
                    this.currentEventIndex = nextEventIndex - 1; // 设置为目标索引前一个，因为 handleTouchEnd 会自增
                }
            }
        }

        const choiceObj = choice === 'right' ? event.choices[1] : event.choices[0];
        if (!choiceObj) return shouldAdvance; // 如果没有选择对象，则直接返回

        // 更新游戏状态
        if (choiceObj.effects) {
            Object.entries(choiceObj.effects).forEach(([key, value]) => {
                this.gameState[key] = (this.gameState[key] || 0) + value;
            });
        }

        // 特殊处理第二章的监测点
        if (this.chapterNumber === 2 && this.currentEventIndex < 10) {
            if (typeof choiceObj.saltChange !== 'undefined') {
                if (!this.gameState.saltChanges) {
                    this.gameState.saltChanges = [];
                }
                this.gameState.saltChanges.push(choiceObj.saltChange);
                if (this.currentEventIndex === 9) {
                    const totalProgress = this.gameState.saltChanges.reduce((sum, change) => sum + change, 0);
                    this.gameState.saltProgress = totalProgress;
                }
            }
        }
        
        // 特殊处理第三章的学力进度
        if (this.chapterNumber === 3) {
            if (typeof choiceObj.learningProgress !== 'undefined') {
                // 初始化学力进度
                if (!this.gameState.learningProgress) {
                    this.gameState.learningProgress = 0;
                }
                // 累加学力进度
                this.gameState.learningProgress += choiceObj.learningProgress;
                console.log('更新学力进度:', this.gameState.learningProgress);
            }
        }
        
        // 特殊处理第四章的政府关系
        if (this.chapterNumber === 4) {
            if (typeof choiceObj.governmentRelation !== 'undefined') {
                // 初始化政府关系
                if (!this.gameState.governmentRelation) {
                    this.gameState.governmentRelation = 0;
                }
                // 累加政府关系值
                this.gameState.governmentRelation += choiceObj.governmentRelation;
                console.log('更新政府关系:', this.gameState.governmentRelation);
            }
        }

        if (this.onStateChange) {
            this.onStateChange(this.gameState, event, choice, choiceObj, this.currentEventIndex);
        }

        return shouldAdvance;
        
        // 检查是否需要结束章节
        if (choiceObj.ending) {
            if (this.onFinish) {
                this.onFinish({ ending: choiceObj.ending })
            }
        } else if (choiceObj.nextChapter) {
            if (this.onFinish) {
                this.onFinish({ nextChapter: true })
            }
        } else if (this.currentEventIndex >= this.events.length) {
            if (this.onFinish) {
                this.onFinish()
            }
        }
    }
    
    // 设置结束回调
    setOnFinish(callback) {
        this.onFinish = callback
    }
    
    // 绘制卡牌
    drawCard(event) {
        const ctx = this.ctx
        const x = this.cardX + this.dragOffset
        const y = this.cardY
        
        // 根据拖动距离计算旋转角度
        const rotation = (this.dragOffset / 150) * 0.3
        
        ctx.save()
        
        // 移动到卡牌中心并旋转
        ctx.translate(x, y)
        ctx.rotate(rotation)
        ctx.translate(-x, -y)
        
        // 绘制卡牌背景
        ctx.fillStyle = '#F4ECE4'
        ctx.strokeStyle = '#8B4513'
        ctx.lineWidth = 3
        // 绘制圆角矩形
        ctx.beginPath()
        const radius = 10
        ctx.moveTo(x - this.cardWidth/2 + radius, y - this.cardHeight/2)
        ctx.lineTo(x + this.cardWidth/2 - radius, y - this.cardHeight/2)
        ctx.arcTo(x + this.cardWidth/2, y - this.cardHeight/2, x + this.cardWidth/2, y - this.cardHeight/2 + radius, radius)
        ctx.lineTo(x + this.cardWidth/2, y + this.cardHeight/2 - radius)
        ctx.arcTo(x + this.cardWidth/2, y + this.cardHeight/2, x + this.cardWidth/2 - radius, y + this.cardHeight/2, radius)
        ctx.lineTo(x - this.cardWidth/2 + radius, y + this.cardHeight/2)
        ctx.arcTo(x - this.cardWidth/2, y + this.cardHeight/2, x - this.cardWidth/2, y + this.cardHeight/2 - radius, radius)
        ctx.lineTo(x - this.cardWidth/2, y - this.cardHeight/2 + radius)
        ctx.arcTo(x - this.cardWidth/2, y - this.cardHeight/2, x - this.cardWidth/2 + radius, y - this.cardHeight/2, radius)
        ctx.fill()
        ctx.stroke()
        
        // 绘制事件图片
        const imgHeight = this.cardHeight * 0.4
        const img = this.cardImages[event.id]
        if (img) {
            ctx.drawImage(
                img,
                x - this.cardWidth*0.4,
                y - this.cardHeight*0.4,
                this.cardWidth*0.8,
                imgHeight
            )
        }
        
        // 绘制标题
        ctx.fillStyle = '#5C3317'
        ctx.font = this.uiHelper.getFont(22, 'FangSong', true)
        ctx.textAlign = 'center'
        ctx.fillText(event.title, x, y - this.cardHeight*0.35 + 30)
        
        // 绘制描述
        ctx.font = this.uiHelper.getFont(16, 'FangSong')
        this.drawWrappedText(
            ctx,
            event.description,
            x,
            y+10,
            this.cardWidth * 0.9,
            25
        )
        
        // 绘制选项
        this.drawChoices(event, x, y)
        
        ctx.restore()
    }
    
    // 绘制选项
    drawChoices(event, x, y) {
        if (!event.choices || !Array.isArray(event.choices) || event.choices.length < 2) {
            console.error('Invalid choices in event:', event)
            return
        }
        
        const ctx = this.ctx
        const leftChoice = event.choices[0]
        const rightChoice = event.choices[1]
        
        if (!leftChoice || !rightChoice || typeof leftChoice.text !== 'string' || typeof rightChoice.text !== 'string') {
            console.error('Invalid choice text:', leftChoice, rightChoice)
            return
        }
        
        ctx.font = this.uiHelper.getFont(16, 'FangSong')
        ctx.textAlign = 'center'
        
        // 左侧选项
        ctx.fillStyle = this.dragOffset < 0 ? '#4CAF50' : '#666666'
        ctx.fillText( leftChoice.text, x - this.cardWidth*0.25, y + this.cardHeight*0.3)
        
        // 右侧选项
        ctx.fillStyle = this.dragOffset > 0 ? '#4CAF50' : '#666666'
        ctx.fillText(rightChoice.text, x + this.cardWidth*0.35, y + this.cardHeight*0.3)
    }
    
    // 绘制自动换行文本
    drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
        // 使用自适应行高
        const adaptiveLineHeight = this.uiHelper.getLineHeight(lineHeight)
        const words = text.split('')
        let line = ''
        let posY = y
        
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i]
            const metrics = ctx.measureText(testLine)
            
            if (metrics.width > maxWidth && i > 0) {
                ctx.fillText(line, x, posY)
                line = words[i]
                posY += adaptiveLineHeight
            } else {
                line = testLine
            }
        }
        
        ctx.fillText(line, x, posY)
    }
    
    // 绘制场景
    // 创建背景纹理
    createPattern(color1, color2) {
        const size = 40
        const canvas = wx.createCanvas()
        canvas.width = size
        canvas.height = size
        const patternCtx = canvas.getContext('2d')

        // 绘制格子纹理
        patternCtx.fillStyle = color1
        patternCtx.fillRect(0, 0, size, size)
        
        patternCtx.fillStyle = color2
        patternCtx.beginPath()
        patternCtx.moveTo(0, 0)
        patternCtx.lineTo(size/2, 0)
        patternCtx.lineTo(0, size/2)
        patternCtx.fill()
        
        patternCtx.beginPath()
        patternCtx.moveTo(size, size)
        patternCtx.lineTo(size/2, size)
        patternCtx.lineTo(size, size/2)
        patternCtx.fill()

        return this.ctx.createPattern(canvas, 'repeat')
    }

    // 绘制背景
    drawBackground() {
        const pattern = this.patterns[this.chapterNumber] || this.patterns[1]
        this.ctx.fillStyle = pattern
        this.ctx.fillRect(0, 0, this.width, this.height)
    }

    // 绘制章节标题
    drawChapterTitle() {
        const ctx = this.ctx
        const y = 20

        // 绘制标题
        ctx.fillStyle = '#5C3317'
        ctx.font = this.uiHelper.getFont(20, 'FangSong', true)
        ctx.textAlign = 'center'
        ctx.fillText(this.chapterTitle, this.width/2, y)
    }

    // 绘制底部提示
    drawHint() {
        const ctx = this.ctx
        const y = this.height - 40

        // 绘制提示文本
        ctx.fillStyle = '#666666'
        ctx.font = this.uiHelper.getFont(14, 'FangSong')
        ctx.textAlign = 'center'
        ctx.fillText('← 左右滑动做出选择 →', this.width/2, y)
    }

    draw() {
        if (this.currentEventIndex >= this.events.length) {
            // 所有事件已完成
            this.drawEndScreen()
            return
        }
        
        // 绘制背景和标题
        this.drawBackground()
        this.drawChapterTitle()
        
        const currentEvent = this.events[this.currentEventIndex]
        this.drawCard(currentEvent)
        
        // 绘制底部提示
        this.drawHint()
    }
    
    // 绘制结束画面
    drawEndScreen() {
        const ctx = this.ctx
        
        ctx.fillStyle = '#F4ECE4'
        ctx.fillRect(0, 0, this.width, this.height)
        
        // ctx.fillStyle = '#5C3317'
        // ctx.font = this.uiHelper.getFont(26, 'FangSong', true)
        // ctx.textAlign = 'center'
        // ctx.fillText('第一章完成', this.width/2, this.height*0.4)
        
        ctx.font = this.uiHelper.getFont(18, 'FangSong')
        ctx.fillText('点击继续...', this.width/2, this.height*0.8)
    }
}
