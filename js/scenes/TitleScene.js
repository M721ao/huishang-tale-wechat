// 标题场景
export class TitleScene {
    constructor(ctx, width, height) {
        this.ctx = ctx
        this.width = width
        this.height = height
        
        // 按钮配置
        this.button = {
            text: '开始游戏',
            x: width / 2,
            y: height * 0.7,
            width: 180,
            height: 50
        }
        
        // 加载封面图片
        this.coverImage = wx.createImage()
        this.coverImage.src = 'images/cover.png'
    }
    
    // 处理点击事件
    handleTap(x, y) {
        const btn = this.button
        if (x >= btn.x - btn.width/2 && x <= btn.x + btn.width/2 &&
            y >= btn.y - btn.height/2 && y <= btn.y + btn.height/2) {
            if (this.onStart) {
                this.onStart()
            }
        }
    }
    
    // 设置开始回调
    setOnStart(callback) {
        this.onStart = callback
    }
    
    // 绘制场景
    draw() {
        const { ctx, width, height, button } = this
        
        // 绘制背景
        if (this.coverImage) {
            ctx.drawImage(this.coverImage, 0, 0, width, height)
        }
        
        // 绘制按钮
        ctx.save()
        
        // 绘制按钮
        const x = button.x - button.width/2
        const y = button.y - button.height/2
        
        // 绘制外框
        ctx.strokeStyle = '#D4AF37' // 金色
        ctx.lineWidth = 2
        ctx.strokeRect(x, y, button.width, button.height)
        
        // 绘制内框
        ctx.strokeStyle = '#8B4513' // 棕色
        ctx.strokeRect(x + 4, y + 4, button.width - 8, button.height - 8)
        
        // 绘制装饰角
        const cornerSize = 10
        ctx.strokeStyle = '#D4AF37'
        // 左上角
        ctx.beginPath()
        ctx.moveTo(x - 2, y + cornerSize)
        ctx.lineTo(x - 2, y - 2)
        ctx.lineTo(x + cornerSize, y - 2)
        ctx.stroke()
        // 右上角
        ctx.beginPath()
        ctx.moveTo(x + button.width + 2, y + cornerSize)
        ctx.lineTo(x + button.width + 2, y - 2)
        ctx.lineTo(x + button.width - cornerSize, y - 2)
        ctx.stroke()
        // 左下角
        ctx.beginPath()
        ctx.moveTo(x - 2, y + button.height - cornerSize)
        ctx.lineTo(x - 2, y + button.height + 2)
        ctx.lineTo(x + cornerSize, y + button.height + 2)
        ctx.stroke()
        // 右下角
        ctx.beginPath()
        ctx.moveTo(x + button.width + 2, y + button.height - cornerSize)
        ctx.lineTo(x + button.width + 2, y + button.height + 2)
        ctx.lineTo(x + button.width - cornerSize, y + button.height + 2)
        ctx.stroke()
        
        // 绘制文字
        ctx.fillStyle = '#D4AF37'
        ctx.shadowColor = '#000000'
        ctx.shadowBlur = 2
        ctx.font = 'bold 28px FangSong'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('开始游戏', button.x, button.y)
        
        ctx.restore()
    }
    
    // 绘制圆角矩形
    drawRoundRect(x, y, width, height, radius) {
        const { ctx } = this
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
        ctx.fill()
        ctx.stroke()
    }
}
