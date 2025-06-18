// 结局场景
import { getUIHelper } from '../utils/UIHelper.js'

export class EndingScene {
    constructor(ctx, width, height) {
        this.ctx = ctx
        this.width = width
        this.height = height
        
        // 获取UI辅助工具
        this.uiHelper = getUIHelper()
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
        if (elapsed < 1500) {
            // 使用缓动函数使渐变更自然
            const progress = Math.min(1, elapsed / 1500)
            this.alpha = this.easeInOutCubic(progress)
        } else {
            this.alpha = 1
        }
    }
    
    // 缓动函数
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }

    // 绘制场景
    draw() {
        const ctx = this.ctx
        ctx.save()
        ctx.globalAlpha = this.alpha

        // 绘制渐变背景
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height)
        gradient.addColorStop(0, '#000000')
        gradient.addColorStop(0.7, '#1a1a2e')
        gradient.addColorStop(1, '#16213e')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, this.width, this.height)
        
        // 绘制装饰性边框
        const borderWidth = this.width * 0.9
        const borderHeight = this.height * 0.85
        const borderX = (this.width - borderWidth) / 2
        const borderY = (this.height - borderHeight) / 2
        
        ctx.strokeStyle = 'rgba(244, 236, 228, 0.3)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.rect(borderX, borderY, borderWidth, borderHeight)
        ctx.stroke()
        
        // 绘制装饰性角落
        const cornerSize = 20
        ctx.strokeStyle = 'rgba(244, 236, 228, 0.6)'
        ctx.lineWidth = 3
        
        // 左上角
        ctx.beginPath()
        ctx.moveTo(borderX, borderY + cornerSize)
        ctx.lineTo(borderX, borderY)
        ctx.lineTo(borderX + cornerSize, borderY)
        ctx.stroke()
        
        // 右上角
        ctx.beginPath()
        ctx.moveTo(borderX + borderWidth - cornerSize, borderY)
        ctx.lineTo(borderX + borderWidth, borderY)
        ctx.lineTo(borderX + borderWidth, borderY + cornerSize)
        ctx.stroke()
        
        // 左下角
        ctx.beginPath()
        ctx.moveTo(borderX, borderY + borderHeight - cornerSize)
        ctx.lineTo(borderX, borderY + borderHeight)
        ctx.lineTo(borderX + cornerSize, borderY + borderHeight)
        ctx.stroke()
        
        // 右下角
        ctx.beginPath()
        ctx.moveTo(borderX + borderWidth - cornerSize, borderY + borderHeight)
        ctx.lineTo(borderX + borderWidth, borderY + borderHeight)
        ctx.lineTo(borderX + borderWidth, borderY + borderHeight - cornerSize)
        ctx.stroke()

        // 绘制结局图片
        if (this.image && this.image.complete) {
            const imageWidth = this.width * 0.7
            const imageHeight = this.height * 0.45
            const x = (this.width - imageWidth) / 2
            const y = this.height * 0.22
            
            // 绘制图片阴影
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
            ctx.shadowBlur = 15
            ctx.shadowOffsetX = 5
            ctx.shadowOffsetY = 5
            
            ctx.drawImage(this.image, x, y, imageWidth, imageHeight)
            
            // 重置阴影
            ctx.shadowColor = 'transparent'
            ctx.shadowBlur = 0
            ctx.shadowOffsetX = 0
            ctx.shadowOffsetY = 0
            
            // 绘制图片边框
            ctx.strokeStyle = 'rgba(244, 236, 228, 0.5)'
            ctx.lineWidth = 2
            ctx.strokeRect(x, y, imageWidth, imageHeight)
        }

        // 绘制装饰性分隔线
        const lineWidth = this.width * 0.6
        const lineY = this.height * 0.72
        
        ctx.beginPath()
        ctx.moveTo((this.width - lineWidth) / 2, lineY)
        ctx.lineTo((this.width + lineWidth) / 2, lineY)
        ctx.strokeStyle = 'rgba(244, 236, 228, 0.4)'
        ctx.lineWidth = 1
        ctx.stroke()

        // 绘制标题
        ctx.fillStyle = '#F4ECE4'
        ctx.font = this.uiHelper.getFont(38, 'FangSong', true)
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(this.title, this.width/2, this.height * 0.78)

        // 绘制描述文本
        ctx.font = this.uiHelper.getFont(24, 'FangSong')
        ctx.fillStyle = 'rgba(244, 236, 228, 0.9)'
        this.drawWrappedText(ctx, this.description, this.width/2, this.height * 0.85, this.width * 0.7, 32)

        // 绘制提示文本
        const now = Date.now()
        const pulseFactor = 0.6 + 0.4 * Math.sin(now / 500) // 创建脉动效果
        
        ctx.font = this.uiHelper.getFont(20, 'FangSong')
        ctx.fillStyle = `rgba(244, 236, 228, ${0.4 + 0.2 * pulseFactor})`
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
