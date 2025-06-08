// 自定义弹窗组件
export class Dialog {
    constructor(ctx, width, height) {
        this.ctx = ctx
        this.width = width
        this.height = height
        this.visible = false
        this.content = ''
        this.onClose = null
        this.startTime = 0
        this.duration = 2000 // 显示2秒后自动关闭
        this.alpha = 0 // 用于淡入淡出效果
    }

    // 显示弹窗
    show(content, onClose) {
        this.content = content
        this.onClose = onClose
        this.visible = true
        this.startTime = Date.now()
        this.alpha = 0
    }

    // 更新状态
    update() {
        if (!this.visible) return

        const elapsed = Date.now() - this.startTime

        // 淡入效果
        if (elapsed < 300) {
            this.alpha = elapsed / 300
        }
        // 淡出效果
        else if (elapsed > this.duration - 300) {
            this.alpha = Math.max(0, 1 - (elapsed - (this.duration - 300)) / 300)
            if (this.alpha === 0) {
                this.visible = false
                if (this.onClose) {
                    this.onClose()
                }
            }
        }
        // 保持显示
        else {
            this.alpha = 1
        }
    }

    // 绘制弹窗
    draw() {
        if (!this.visible) return

        const ctx = this.ctx
        const dialogWidth = this.width * 0.8
        const dialogHeight = this.height * 0.2
        const x = (this.width - dialogWidth) / 2
        const y = this.height * 0.4

        ctx.save()

        // 设置透明度
        ctx.globalAlpha = this.alpha

        // 绘制半透明背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
        ctx.fillRect(0, 0, this.width, this.height)

        // 绘制弹窗背景
        ctx.fillStyle = '#F4ECE4'
        ctx.strokeStyle = '#8B4513'
        ctx.lineWidth = 2
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
        ctx.shadowBlur = 10
        ctx.shadowOffsetX = 5
        ctx.shadowOffsetY = 5

        // 绘制圆角矩形
        ctx.beginPath()
        ctx.roundRect(x, y, dialogWidth, dialogHeight, [10])
        ctx.fill()
        ctx.stroke()

        // 绘制文字
        ctx.fillStyle = '#5C3317'
        ctx.shadowColor = 'transparent'
        ctx.font = '20px FangSong'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        
        // 自动换行显示文字
        const maxWidth = dialogWidth * 0.8
        const words = this.content.split('')
        let line = ''
        let posY = y + dialogHeight * 0.3
        const lineHeight = 30

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i]
            const metrics = ctx.measureText(testLine)
            
            if (metrics.width > maxWidth && i > 0) {
                ctx.fillText(line, this.width/2, posY)
                line = words[i]
                posY += lineHeight
            } else {
                line = testLine
            }
        }
        ctx.fillText(line, this.width/2, posY)

        ctx.restore()

        // 更新状态
        this.update()
    }
}
