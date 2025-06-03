import { chapters, loadProgress, saveProgress } from './js/chapters/chapterConfig.js'
import { ChapterScene } from './js/chapters/ChapterScene.js'
import { PrologueScene } from './js/scenes/PrologueScene.js'

// 初始化游戏画布
const canvas = wx.createCanvas()
const ctx = canvas.getContext('2d')

// 获取屏幕尺寸
const { windowWidth, windowHeight } = wx.getSystemInfoSync()
canvas.width = windowWidth
canvas.height = windowHeight

// 游戏状态
let currentScene = 'title' // title, prologue, chapters, game

// 加载封面图片
const coverImage = wx.createImage()
coverImage.src = 'images/cover.png'

// 初始化场景
const chapterScene = new ChapterScene(ctx, windowWidth, windowHeight)
const prologueScene = new PrologueScene(ctx, windowWidth, windowHeight)

// 按钮动画状态
const buttonAnimation = {
    scale: 1,
    scaleDirection: 1,
    activeButton: null,
    animationSpeed: 0.02
}

// 按钮配置
const titleButtons = [
    {
        text: '开始游戏',
        x: windowWidth / 2,
        y: windowHeight * 0.65,
        width: 200,
        height: 60,
        scale: 1
    },
    {
        text: '继续游戏',
        x: windowWidth / 2,
        y: windowHeight * 0.65 + 80,
        width: 200,
        height: 60,
        scale: 1
    }
]

// 绘制圆角矩形
function drawRoundRect(ctx, x, y, width, height, radius) {
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

// 绘制按钮
function drawButton(button) {
    ctx.save()
    
    // 应用缩放动画
    ctx.translate(button.x, button.y)
    ctx.scale(button.scale || 1, button.scale || 1)
    ctx.translate(-button.x, -button.y)
    
    const x = button.x - button.width/2
    const y = button.y - button.height/2
    
    // 绘制主要背景
    ctx.fillStyle = 'rgba(244, 236, 203, 0.9)' // 笔质纸色
    ctx.strokeStyle = '#8B4513' // 深棕色边框
    ctx.lineWidth = 3
    
    // 绘制外部边框
    drawRoundRect(ctx, x, y, button.width, button.height, 8)
    ctx.fill()
    ctx.stroke()
    
    // 绘制内部装饰线
    ctx.strokeStyle = 'rgba(139, 69, 19, 0.3)' // 半透明的棕色
    ctx.lineWidth = 1
    drawRoundRect(ctx, x + 4, y + 4, button.width - 8, button.height - 8, 6)
    ctx.stroke()
    
    // 绘制角落装饰
    ctx.strokeStyle = '#8B4513'
    ctx.lineWidth = 2
    // 左上角
    ctx.beginPath()
    ctx.moveTo(x + 8, y + 4)
    ctx.lineTo(x + 4, y + 4)
    ctx.lineTo(x + 4, y + 8)
    ctx.stroke()
    // 右上角
    ctx.beginPath()
    ctx.moveTo(x + button.width - 8, y + 4)
    ctx.lineTo(x + button.width - 4, y + 4)
    ctx.lineTo(x + button.width - 4, y + 8)
    ctx.stroke()
    // 左下角
    ctx.beginPath()
    ctx.moveTo(x + 8, y + button.height - 4)
    ctx.lineTo(x + 4, y + button.height - 4)
    ctx.lineTo(x + 4, y + button.height - 8)
    ctx.stroke()
    // 右下角
    ctx.beginPath()
    ctx.moveTo(x + button.width - 8, y + button.height - 4)
    ctx.lineTo(x + button.width - 4, y + button.height - 4)
    ctx.lineTo(x + button.width - 4, y + button.height - 8)
    ctx.stroke()
    
    // 绘制文字
    ctx.fillStyle = '#5C3317' // 古木色
    ctx.font = '24px FangSong' // 使用仲宋字体
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    // 文字描边效果
    ctx.strokeStyle = 'rgba(139, 69, 19, 0.2)'
    ctx.lineWidth = 3
    ctx.strokeText(button.text, button.x, button.y)
    ctx.fillText(button.text, button.x, button.y)
    
    ctx.restore()
}

// 绘制标题场景
function drawTitleScene() {
    // 清空画布
    ctx.clearRect(0, 0, windowWidth, windowHeight)
    
    // 绘制背景图
    ctx.drawImage(coverImage, 0, 0, windowWidth, windowHeight)
    
    // 绘制按钮
    titleButtons.forEach(drawButton)
    
    // 绘制免责声明
    ctx.save()
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.font = '14px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'
    ctx.fillText('注：本游戏为虚构作品，为保证游戏性和剧情连贯，', windowWidth/2, windowHeight - 30)
    ctx.fillText('对部分历史事件和人物进行了艺术加工，请勿以此为准。', windowWidth/2, windowHeight - 10)
    ctx.restore()
    
    // 更新按钮动画
    if (buttonAnimation.activeButton !== null) {
        const button = titleButtons[buttonAnimation.activeButton]
        button.scale = buttonAnimation.scale
        
        buttonAnimation.scale += 0.04 * buttonAnimation.scaleDirection
        if (buttonAnimation.scale >= 1.1) {
            buttonAnimation.scaleDirection = -1
        } else if (buttonAnimation.scale <= 0.9) {
            buttonAnimation.scaleDirection = 1
        }
    }
}

// 游戏主循环
function gameLoop() {
    if (currentScene === 'title') {
        drawTitleScene()
    } else if (currentScene === 'prologue') {
        prologueScene.draw()
    } else if (currentScene === 'chapters') {
        chapterScene.draw()
    }
    
    // 继续下一帧
    requestAnimationFrame(gameLoop)
}

// 监听触摸事件
wx.onTouchStart(res => {
    if (currentScene === 'title') {
        const touch = res.touches[0]
        const x = touch.clientX
        const y = touch.clientY

        titleButtons.forEach((button, index) => {
            if (x >= button.x - button.width/2 &&
                x <= button.x + button.width/2 &&
                y >= button.y - button.height/2 &&
                y <= button.y + button.height/2) {
                // 设置按钮动画
                buttonAnimation.activeButton = index
                buttonAnimation.scale = 1
                buttonAnimation.scaleDirection = -1
                
                // 0.3秒后执行场景切换
                setTimeout(() => {
                    buttonAnimation.activeButton = null
                    if (index === 0) {
                        // 开始新游戏，先进入引子
                        currentScene = 'prologue'
                        prologueScene.setOnFinish(() => {
                            loadProgress()
                            currentScene = 'chapters'
                            chapterScene.init(chapters)
                        })
                    } else {
                        // 继续游戏
                        loadProgress()
                        currentScene = 'chapters'
                        chapterScene.init(chapters)
                    }
                }, 300)
            }
        })
    }
})

// 等待图片加载完成后启动游戏
coverImage.onload = () => {
    gameLoop()
}
