// 引子场景
export class PrologueScene {
    constructor(ctx, width, height) {
        this.ctx = ctx
        this.width = width
        this.height = height
        this.scrollY = this.height * 0.7 // 从底部1/3位置开始
        this.scrollSpeed = 1 // 滚动速度
        
        // 加载背景图片
        this.backgroundImage = wx.createImage()
        this.backgroundImage.src = 'images/backgrounds/prologue.png'
        
        // 滚动的文字
        this.scrollingLines = [
            
        ]
        
        // 固定在底部的说明文字
        this.footerText = [
            '黄山市的前身是徽州府，下辖歙县、黟县、休宁县、',
            '祁门县、绩溪县和婺源县（现属江西省）。',
            '黄山是徽商的故乡，徽商从这里走向全国。'
        ]
        this.lineHeight = 50
        this.totalHeight = this.scrollingLines.length * this.lineHeight
        this.footerY = this.height * 0.75 // 底部说明文字的位置
        this.finished = false
        this.onFinishCallback = null
    }

    // 设置文字
    setText(text) {
        // 按句号分割
        this.scrollingLines = text.split('。').filter(line => line.trim().length > 0)
        // 更新总高度
        this.totalHeight = this.scrollingLines.length * this.lineHeight
        // 重置滚动位置
        this.scrollY = this.height * 0.7
        // 重置完成状态
        this.finished = false
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
        
        // 绘制背景图片
        if (this.backgroundImage) {
            ctx.drawImage(this.backgroundImage, 0, 0, width, height)
        }
        
        // 添加半透明黑色遮罩
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
        ctx.fillRect(0, 0, width, height)
        
        // 设置文字样式
        ctx.save()
        ctx.fillStyle = '#F4ECE4' // 粉红色
        ctx.strokeStyle = '#8B4513' // 棕色
        ctx.lineWidth = 2
        ctx.font = '28px FangSong' // 仪宋字体
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        
        // 绘制滚动文字
        this.scrollingLines.forEach((line, index) => {
            const y = this.scrollY + index * this.lineHeight
            if (y > 0 && y < height) {
                // 添加句号
                const text = line + '。'
                ctx.strokeText(text, width/2, y)
                ctx.fillText(text, width/2, y)
            }
        })
        
        // 绘制底部说明文字背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
        ctx.fillRect(0, this.footerY - 20, width, height - this.footerY + 20)
        
        // 绘制底部说明文字
        ctx.fillStyle = '#F4ECE4' // 浅棕色
        ctx.strokeStyle = '#8B4513' // 深棕色
        ctx.lineWidth = 1
        ctx.font = '20px FangSong'
        this.footerText.forEach((line, index) => {
            const y = this.footerY + index * 30
            ctx.strokeText(line, width/2, y)
            ctx.fillText(line, width/2, y)
        })
        
        ctx.restore()
        
        this.update()
    }

    update() {
        // 记录开始时间
        if (!this.startTime) {
            this.startTime = Date.now()
        }
        
        // 更新滚动位置
        this.scrollY -= 1.0 // 增加滚动速度
        
        // 5秒后结束
        if (Date.now() - this.startTime >= 5000 && !this.finished) {
            this.finished = true
            if (this.onFinishCallback) {
                this.onFinishCallback()
            }
        }
    }
}
