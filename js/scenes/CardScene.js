// 卡牌场景
export class CardScene {
    constructor(ctx, width, height) {
        this.ctx = ctx
        this.width = width
        this.height = height
        
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
        this.chapterNumber = chapterInfo.number
        this.loadEventImages()
    }
    
    // 加载事件图片
    loadEventImages() {
        // 创建默认图片
        const defaultImage = wx.createImage()
        defaultImage.src = 'images/card_events/one.png'
        
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
                console.log('当前事件:', event)
                const choice = this.dragOffset > 0 ? 'right' : 'left'
                this.makeChoice(event, choice)
                this.currentEventIndex++
            }
        }
        
        // 重置拖动状态
        this.isDragging = false
        this.dragOffset = 0
    }
    
    // 做出选择
    makeChoice(event, choice) {
        // 根据选择更新游戏状态
        const choiceObj = choice === 'right' ? event.choices[1] : event.choices[0]
        // console.log('选择对象:', choiceObj)
        
        // 更新状态并调用回调
        if (this.onStateChange) {
            const choiceData = {
                result: choiceObj.result,
                ending: choiceObj.ending,
                nextChapter: choiceObj.nextChapter
            }
            // console.log('传递给回调的数据:', choiceData)
            this.onStateChange(this.gameState, event, choice, choiceData)
        }
        
        // 如果有属性效果，更新属性
        if (choiceObj.effects) {
            Object.entries(choiceObj.effects).forEach(([key, value]) => {
                this.gameState[key] += value
            })
        }
        
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
        ctx.font = 'bold 24px FangSong'
        ctx.textAlign = 'center'
        ctx.fillText(event.title, x, y - this.cardHeight*0.35 + 30)
        
        // 绘制描述
        ctx.font = '18px FangSong'
        this.drawWrappedText(
            ctx,
            event.description,
            x,
            y,
            this.cardWidth * 0.8,
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
        
        ctx.font = '20px FangSong'
        ctx.textAlign = 'center'
        
        // 左侧选项
        ctx.fillStyle = this.dragOffset < 0 ? '#FF4D4D' : '#666666'
        ctx.fillText('← ' + leftChoice.text, x - this.cardWidth*0.3, y + this.cardHeight*0.3)
        
        // 右侧选项
        ctx.fillStyle = this.dragOffset > 0 ? '#4CAF50' : '#666666'
        ctx.fillText(rightChoice.text + ' →', x + this.cardWidth*0.3, y + this.cardHeight*0.3)
    }
    
    // 绘制自动换行文本
    drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split('')
        let line = ''
        let posY = y
        
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i]
            const metrics = ctx.measureText(testLine)
            
            if (metrics.width > maxWidth && i > 0) {
                ctx.fillText(line, x, posY)
                line = words[i]
                posY += lineHeight
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
        const y = 50

        // 绘制背景条
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
        ctx.fillRect(0, 0, this.width, 70)

        // 绘制标题
        ctx.fillStyle = '#5C3317'
        ctx.font = 'bold 24px FangSong'
        ctx.textAlign = 'center'
        ctx.fillText(this.chapterTitle, this.width/2, y)
    }

    // 绘制底部提示
    drawHint() {
        const ctx = this.ctx
        const y = this.height - 40

        // 绘制半透明背景条
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
        ctx.fillRect(0, this.height - 60, this.width, 60)

        // 绘制提示文本
        ctx.fillStyle = '#666666'
        ctx.font = '20px FangSong'
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
        
        ctx.fillStyle = '#5C3317'
        ctx.font = 'bold 30px FangSong'
        ctx.textAlign = 'center'
        ctx.fillText('第一章完成', this.width/2, this.height*0.4)
        
        ctx.font = '20px FangSong'
        ctx.fillText('点击继续...', this.width/2, this.height*0.6)
    }
}
