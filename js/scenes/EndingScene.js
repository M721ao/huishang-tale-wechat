// 结局场景
export class EndingScene {
    constructor(ctx, width, height) {
        this.ctx = ctx
        this.width = width
        this.height = height
        this.title = ''
        this.description = ''
        this.imagePath = ''
        this.image = null
        this.onFinish = null
        this.alpha = 0
        this.startTime = 0
    }

    // 初始化结局
    init(title, description, imagePath, onFinish) {
        this.title = title
        this.description = description
        this.imagePath = imagePath
        this.onFinish = onFinish
        this.alpha = 0
        this.startTime = Date.now()

        // 加载结局图片
        this.image = wx.createImage()
        this.image.src = this.imagePath
    }

    // 更新状态
    update() {
        const elapsed = Date.now() - this.startTime
        if (elapsed < 1000) {
            this.alpha = Math.min(1, elapsed / 1000)
        }
    }

    // 绘制场景
    draw() {
        const ctx = this.ctx
        ctx.save()
        ctx.globalAlpha = this.alpha

        // 绘制背景
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, this.width, this.height)

        // 绘制结局图片
        if (this.image && this.image.complete) {
            const imageWidth = this.width * 0.8
            const imageHeight = this.height * 0.5
            const x = (this.width - imageWidth) / 2
            const y = this.height * 0.15
            ctx.drawImage(this.image, x, y, imageWidth, imageHeight)
        }

        // 绘制标题
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 36px FangSong'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(this.title, this.width/2, this.height * 0.75)

        // 绘制描述文本
        ctx.font = '24px FangSong'
        this.drawWrappedText(ctx, this.description, this.width/2, this.height * 0.85, this.width * 0.8, 36)

        // 绘制提示文本
        ctx.font = '20px FangSong'
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
        ctx.fillText('点击屏幕继续', this.width/2, this.height * 0.95)

        ctx.restore()
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

    // 处理点击
    handleTap() {
        if (this.onFinish) {
            this.onFinish()
        }
    }
}
