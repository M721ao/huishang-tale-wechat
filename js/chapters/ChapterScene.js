// 章节场景类
export class ChapterScene {
    constructor(ctx, width, height) {
        this.ctx = ctx
        this.width = width
        this.height = height
        this.buttons = []
        this.scrollY = 0
        this.maxScroll = 0
    }

    // 初始化章节选择界面
    init(chapters) {
        this.chapters = chapters
        this.createChapterButtons()
        
        // 监听触摸事件
        wx.onTouchStart(this.handleTouchStart.bind(this))
        wx.onTouchMove(this.handleTouchMove.bind(this))
        wx.onTouchEnd(this.handleTouchEnd.bind(this))
    }

    // 创建章节按钮
    createChapterButtons() {
        const buttonHeight = 120
        const spacing = 20
        this.buttons = this.chapters.map((chapter, index) => {
            return {
                chapter,
                x: this.width / 2,
                y: 150 + index * (buttonHeight + spacing),
                width: this.width * 0.8,
                height: buttonHeight
            }
        })
        
        // 计算最大滚动距离
        const totalHeight = this.buttons.length * (buttonHeight + spacing)
        this.maxScroll = Math.max(0, totalHeight - this.height + 150)
    }

    // 处理触摸开始
    handleTouchStart(e) {
        this.touchStartY = e.touches[0].clientY
        this.lastTouchY = this.touchStartY
    }

    // 处理触摸移动
    handleTouchMove(e) {
        const touchY = e.touches[0].clientY
        const deltaY = touchY - this.lastTouchY
        this.scrollY = Math.max(0, Math.min(this.maxScroll, this.scrollY - deltaY))
        this.lastTouchY = touchY
    }

    // 处理触摸结束
    handleTouchEnd(e) {
        const touch = e.changedTouches[0]
        const adjustedY = touch.clientY + this.scrollY
        
        // 检查是否点击了章节按钮
        this.buttons.forEach(button => {
            if (this.isPointInButton(touch.clientX, adjustedY, button)) {
                this.onChapterSelect(button.chapter)
            }
        })
    }

    // 检查点击是否在按钮范围内
    isPointInButton(x, y, button) {
        return x >= button.x - button.width/2 &&
               x <= button.x + button.width/2 &&
               y >= button.y - button.height/2 &&
               y <= button.y + button.height/2
    }

    // 绘制章节按钮
    drawChapterButton(button) {
        const { ctx } = this
        const { chapter } = button
        
        ctx.save()
        
        // 绘制按钮背景
        ctx.fillStyle = chapter.unlocked ? 'rgba(0, 0, 0, 0.6)' : 'rgba(100, 100, 100, 0.3)'
        ctx.strokeStyle = chapter.unlocked ? '#ffffff' : '#999999'
        ctx.lineWidth = 2
        
        // 绘制圆角矩形
        this.drawRoundRect(
            ctx,
            button.x - button.width/2,
            button.y - button.height/2 - this.scrollY,
            button.width,
            button.height,
            10
        )
        ctx.fill()
        ctx.stroke()
        
        // 绘制章节标题
        ctx.fillStyle = chapter.unlocked ? '#ffffff' : '#999999'
        ctx.font = 'bold 24px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(
            chapter.title,
            button.x,
            button.y - 20 - this.scrollY
        )
        
        // 绘制章节描述
        ctx.font = '16px Arial'
        ctx.fillText(
            chapter.description,
            button.x,
            button.y + 10 - this.scrollY
        )
        
        ctx.restore()
    }

    // 绘制圆角矩形
    drawRoundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath()
        ctx.moveTo(x + radius, y)
        ctx.lineTo(x + width - radius, y)
        ctx.arcTo(x + width, y, x + width, y + radius, radius)
        ctx.lineTo(x + width, y + height - radius)
        ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius)
        ctx.lineTo(x + radius, y + height)
        ctx.arcTo(x, y + height, x, y + height - radius, radius)
        ctx.lineTo(x, y + radius)
        ctx.arcTo(x, y, x + radius, y, radius)
        ctx.closePath()
    }

    // 绘制场景
    draw() {
        const { ctx, width, height } = this
        
        // 清空画布
        ctx.clearRect(0, 0, width, height)
        
        // 绘制标题
        ctx.save()
        ctx.fillStyle = '#ffffff'
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 4
        ctx.font = 'bold 36px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.strokeText('选择章节', width/2, 60)
        ctx.fillText('选择章节', width/2, 60)
        ctx.restore()
        
        // 绘制所有章节按钮
        this.buttons.forEach(button => this.drawChapterButton(button))
    }

    // 章节选择回调
    onChapterSelect(chapter) {
        if (chapter.unlocked) {
            console.log(`选择章节: ${chapter.title}`)
            // TODO: 实现章节切换逻辑
        }
    }
}
