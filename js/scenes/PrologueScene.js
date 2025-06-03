// 引子场景
export class PrologueScene {
    constructor(ctx, width, height) {
        this.ctx = ctx
        this.width = width
        this.height = height
        this.scrollY = this.height // 从底部开始
        this.scrollSpeed = 1 // 滚动速度
        this.lines = [
            '前世不修，',
            '生在徽州。',
            '十三四岁，',
            '往外一丢。'
        ]
        this.lineHeight = 60
        this.totalHeight = this.lines.length * this.lineHeight
        this.finished = false
        this.onFinishCallback = null
    }

    // 设置完成回调
    setOnFinish(callback) {
        this.onFinishCallback = callback
    }

    // 绘制场景
    draw() {
        const { ctx, width, height } = this
        
        // 清空画布
        ctx.clearRect(0, 0, width, height)
        
        // 设置文字样式
        ctx.save()
        ctx.fillStyle = '#ffffff'
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 3
        ctx.font = 'bold 36px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        
        // 绘制每行文字
        this.lines.forEach((line, index) => {
            const y = this.scrollY + (index * this.lineHeight)
            if (y >= -50 && y <= height + 50) { // 只绘制可见区域的文字
                ctx.strokeText(line, width/2, y)
                ctx.fillText(line, width/2, y)
            }
        })
        
        ctx.restore()
        
        // 更新滚动位置
        this.scrollY -= this.scrollSpeed
        
        // 检查是否滚动完成
        if (this.scrollY + this.totalHeight < height * 0.3) {
            if (!this.finished && this.onFinishCallback) {
                this.finished = true
                this.onFinishCallback()
            }
        }
    }
}
