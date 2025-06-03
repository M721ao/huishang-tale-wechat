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
        
        // 加载图片资源
        this.cardImages = {}
    }
    
    // 初始化事件和状态
    init(events, initialState, onStateChange) {
        this.events = events
        this.gameState = {...initialState}
        this.onStateChange = onStateChange
        this.currentEventIndex = 0
        this.loadEventImages()
    }
    
    // 加载事件图片
    loadEventImages() {
        // 创建默认图片
        const defaultImage = wx.createImage()
        defaultImage.src = 'images/events/default.png'
        
        this.events.forEach(event => {
            this.cardImages[event.id] = defaultImage
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
        if (!this.isDragging) return
        
        const currentEvent = this.events[this.currentEventIndex]
        
        // 根据拖动方向选择
        if (Math.abs(this.dragOffset) > 100) {
            const choice = this.dragOffset > 0 ? 'right' : 'left'
            this.makeChoice(currentEvent, choice)
            this.currentEventIndex++
        }
        
        this.isDragging = false
        this.dragOffset = 0
    }
    
    // 做出选择
    makeChoice(event, choice) {
        const choiceData = event.choices[choice]
        
        // 更新游戏状态
        Object.entries(choiceData.effects).forEach(([key, value]) => {
            this.gameState[key] += value
        })
        
        // 通知状态更新
        if (this.onStateChange) {
            this.onStateChange(this.gameState, event, choice, choiceData)
        }
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
        const ctx = this.ctx
        const leftChoice = event.choices.left
        const rightChoice = event.choices.right
        
        ctx.font = '20px FangSong'
        ctx.textAlign = 'center'
        
        // 左侧选项
        ctx.fillStyle = this.dragOffset < -50 ? '#FF4D4D' : '#666666'
        ctx.fillText('← ' + leftChoice.text, x - this.cardWidth*0.3, y + this.cardHeight*0.3)
        
        // 右侧选项
        ctx.fillStyle = this.dragOffset > 50 ? '#4CAF50' : '#666666'
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
    draw() {
        if (this.currentEventIndex >= this.events.length) {
            // 所有事件已完成
            this.drawEndScreen()
            return
        }
        
        const currentEvent = this.events[this.currentEventIndex]
        this.drawCard(currentEvent)
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
