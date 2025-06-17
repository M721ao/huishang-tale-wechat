// 引子场景
import { getUIHelper } from '../utils/UIHelper.js'

export class PrologueScene {
    constructor(ctx, width, height) {
        this.ctx = ctx
        this.width = width
        this.height = height
        
        // 获取UI辅助工具
        this.uiHelper = getUIHelper()
        
        this.scrollY = this.height * 0.7 // 从底部1/3位置开始
        this.scrollSpeed = 1 // 滚动速度
        
        // 加载背景图片
        this.backgroundImage = wx.createImage()
        this.backgroundImage.src = 'images/backgrounds/prologue.png'
        
        // 滚动的文字
        this.scrollingLines = [
        ]
        
        // 增加墨迹效果相关属性
        this.inkEffects = [] // 存储墨迹效果对象
        this.lastInkTime = 0 // 上次生成墨迹的时间
        this.inkInterval = 100 // 生成墨迹的时间间隔
        this.currentTextIndex = 0 // 当前显示的文字索引
        this.textRevealSpeed = 800 // 文字显示速度（毫秒）
        this.lineSpacing = 40 // 行间距
        
        // 固定在底部的说明文字
        this.footerText = [
            '黄山市前身徽州府，下辖歙县、黟县、休宁县、',
            '祁门县、绩溪县和婺源县（现属江西省）。',
            '黄山是徽商的故乡，徽商从这里走向全国。'
        ]
        this.lineHeight = 50
        this.totalHeight = this.scrollingLines.length * this.lineHeight
        // 底部说明文字的位置
        this.footerY = this.height * 0.9
        // 添加底部安全距离
        this.footerPadding = this.uiHelper.getAdaptiveSize(20)
        this.finished = false
        this.onFinishCallback = null
    }

    // 设置文字
    setText(text) {
        // 按句号分割
        this.scrollingLines = text.split('。').filter(line => line.trim().length > 0)
        // 重置墨迹效果相关参数
        this.inkEffects = []
        this.currentTextIndex = 0
        this.lastInkTime = 0
        
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
    
    // 创建墨迹效果
    createInkEffect(text, x, y) {
        // 创建墨迹效果对象
        return {
            text: text,
            x: x,
            y: y,
            alpha: 0,          // 透明度
            scale: 0.5,        // 初始缩放
            rotation: (Math.random() - 0.5) * 0.2, // 微小旋转
            inkDrops: [],      // 墨滴效果
            startTime: Date.now(),
            duration: 3000  // 持续时间
        }
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
        ctx.font = this.uiHelper.getFont(28, 'FangSong', true) // 仪宋字体
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        
        // 绘制墨迹展开效果的文字
        const now = Date.now();
        const centerY = height / 2;
        
        // 更新当前显示的文字索引
        if (this.scrollingLines.length > 0 && now - this.lastInkTime > this.textRevealSpeed && 
            this.currentTextIndex < this.scrollingLines.length) {
            // 创建新的墨迹效果
            const text = this.scrollingLines[this.currentTextIndex] + '。';
            // 计算文字应该显示的垂直位置，上下两行排列
            const lineIndex = this.currentTextIndex % 2; // 0或者1，分别表示上行和下行
            const lineOffset = lineIndex === 0 ? -this.lineSpacing : this.lineSpacing;
            
            this.inkEffects.push({
                text: text,
                x: width / 2,
                y: centerY + lineOffset, // 上下两行排列
                alpha: 0,
                scale: 0.3,  // 调小初始缩放比例
                rotation: (Math.random() - 0.5) * 0.05,  // 减小旋转幅度
                startTime: now,
                duration: 1500  // 增加动画时间，让墨迹展开更加自然
            });
            this.currentTextIndex++;
            this.lastInkTime = now;
        }
        
        // 绘制墨迹效果
        this.inkEffects.forEach((effect, index) => {
            const elapsed = now - effect.startTime;
            const progress = Math.min(elapsed / effect.duration, 1);
            
            // 计算动画参数，使用缓动函数让动画更自然
            // 使用缓入缓出函数
            const easeInOut = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            const easedProgress = easeInOut(progress);
            
            effect.alpha = Math.min(easedProgress * 1.5, 1); // 透明度从0到1
            effect.scale = 0.3 + easedProgress * 0.7; // 缩放从0.3到1
            
            // 应用变换
            ctx.save();
            ctx.globalAlpha = effect.alpha;
            ctx.translate(effect.x, effect.y);
            ctx.scale(effect.scale, effect.scale);
            ctx.rotate(effect.rotation);
            
            // 绘制文字
            ctx.strokeText(effect.text, 0, 0);
            ctx.fillText(effect.text, 0, 0);
            
            ctx.restore();
        })
        
        // 绘制底部说明文字背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
        // 使用自适应的padding
        ctx.fillRect(0, this.footerY - this.footerPadding, width, height - this.footerY + this.footerPadding * 2)
        
        // 绘制底部说明文字
        ctx.fillStyle = '#F4ECE4' // 浅棕色
        ctx.strokeStyle = '#8B4513' // 深棕色
        ctx.lineWidth = 1
        ctx.font = this.uiHelper.getFont(12, 'FangSong')
        // 使用自适应的行高
        const lineHeight = this.uiHelper.getLineHeight(24)
        this.footerText.forEach((line, index) => {
            const y = this.footerY + index * lineHeight
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
        
        // 不再清理墨迹效果，让文字保持显示
        const now = Date.now()
        
        // 检查是否全部文字已显示
        if (this.currentTextIndex >= this.scrollingLines.length && 
            Date.now() - this.startTime >= 3000 && 
            !this.finished) {
            this.finished = true
            if (this.onFinishCallback) {
                this.onFinishCallback()
            }
        }
    }
}
