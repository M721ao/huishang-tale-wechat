import { loadProgress, saveProgress } from './js/chapters/chapterConfig.js'
import { PrologueScene } from './js/scenes/PrologueScene.js'
import { ChapterTitleScene } from './js/scenes/ChapterTitleScene.js'
import { StoryScene } from './js/scenes/StoryScene.js'
import { CardScene } from './js/scenes/CardScene.js'
import { chapter1Events, initialState, saveGameState } from './js/events/EventConfig.js'

// 初始化游戏画布
const canvas = wx.createCanvas()
const ctx = canvas.getContext('2d')

// 获取屏幕尺寸
const { windowWidth, windowHeight } = wx.getSystemInfoSync()
canvas.width = windowWidth
canvas.height = windowHeight

// 游戏状态
let currentSceneType = 'title' // title, prologue, chapterTitle, story
let currentScene = null
let gameProgress = wx.getStorageSync('gameProgress') || {
    currentChapter: 1,
    currentScene: 'title',
    storyProgress: 0
}

// 加载封面图片
const coverImage = wx.createImage()
coverImage.src = 'images/cover.png'

// 初始化场景
const prologueScene = new PrologueScene(ctx, windowWidth, windowHeight)
const chapterTitleScene = new ChapterTitleScene(ctx, windowWidth, windowHeight)
const storyScene = new StoryScene(ctx, windowWidth, windowHeight)
const cardScene = new CardScene(ctx, windowWidth, windowHeight)

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

// 开始新游戏
function startNewGame() {
    // 初始化游戏进度
    gameProgress = {
        currentChapter: 1,
        currentScene: 'prologue'
    }
    
    // 显示引子
    currentSceneType = 'prologue'
    currentScene = prologueScene
    
    // 设置引子剧情
    const prologueText = '前世不修，生在徽州。十三四岁，往外一丢。'
    prologueScene.setText(prologueText)
    prologueScene.setOnFinish(() => {
        showChapterTitle(1)
    })
    
    // 保存进度
    saveProgress(gameProgress)
}

// 继续游戏
function continueGame() {
    const savedProgress = wx.getStorageSync('gameProgress')
    if (savedProgress) {
        gameProgress = savedProgress
        if (gameProgress.currentScene === 'story') {
            startChapterStory(gameProgress.currentChapter)
        } else {
            showChapterTitle(gameProgress.currentChapter)
        }
    } else {
        startNewGame()
    }
}

// 显示章节标题
function showChapterTitle(chapter) {
    currentSceneType = 'chapterTitle'
    currentScene = chapterTitleScene
    
    // 设置章节标题
    let title = ''
    if (chapter === 1) {
        title = '第一章：出师'
    }
    
    chapterTitleScene.setTitle(title)
    chapterTitleScene.setOnFinish(() => {
        startChapterStory(chapter)
    })
}

// 开始章节剧情
function startChapterStory(chapter) {
    currentSceneType = 'story'
    currentScene = storyScene
    
    // 设置第一章的剧情
    if (chapter === 1) {
        const script = [
            {
                text: '年幼丧父家中贫寒，16岁你刚完婚，便带着家中的最后一枚铜钱外出谋求生路；',
                background: 'images/backgrounds/default.png',
                character: null,
                position: 'center'
            },
            {
                text: '你背着行囊走过村口的石桥，回头望了一眼家乡，又低头看了一眼手里的铜钱，踏上了徽杭古道。',
                background: 'images/backgrounds/default.png',
                character: null,
                position: 'center'
            }
        ]
        storyScene.loadScript(script)
        
        // 设置故事场景结束后的回调
        storyScene.setOnFinish(() => {
            startCardGame()
        })
    }
    
    // 保存进度
    gameProgress.currentChapter = chapter
    gameProgress.currentScene = 'story'
    saveProgress(gameProgress)
}

// 开始卡牌游戏
function startCardGame() {
    currentSceneType = 'card'
    currentScene = cardScene
    
    // 初始化卡牌场景
    cardScene.init(chapter1Events, initialState, (state, event, choice, choiceData) => {
        // 状态更新回调
        saveGameState(state)
        
        // 显示选择结果
        console.log(`选择了${choice === 'left' ? '左' : '右'}边选项：${choiceData.text}`)
        console.log(`结果：${choiceData.result}`)
    })
    
    // 保存进度
    gameProgress.currentScene = 'card'
    saveProgress(gameProgress)
}

// 游戏主循环
function gameLoop() {
    ctx.clearRect(0, 0, windowWidth, windowHeight)

    if (currentSceneType === 'title') {
        drawTitleScene()
    } else if (currentScene) {
        currentScene.draw()
    }
    
    requestAnimationFrame(gameLoop)
}

// 触摸事件处理
wx.onTouchStart(e => {
    if (currentSceneType === 'title') {
        handleTitleTouch(e)
    } else if (currentSceneType === 'card') {
        cardScene.handleTouchStart(e)
    }
})

wx.onTouchMove(e => {
    if (currentSceneType === 'card') {
        cardScene.handleTouchMove(e)
    }
})

wx.onTouchEnd(e => {
    if (currentSceneType === 'title') {
        handleTitleTouchEnd(e)
    } else if (currentSceneType === 'story') {
        storyScene.handleTap()
    } else if (currentSceneType === 'card') {
        cardScene.handleTouchEnd()
    }
})

// 标题页触摸处理
function handleTitleTouch(e) {
    const touch = e.touches[0]
    const x = touch.clientX
    const y = touch.clientY

    titleButtons.forEach((button, index) => {
        if (x >= button.x - button.width/2 &&
            x <= button.x + button.width/2 &&
            y >= button.y - button.height/2 &&
            y <= button.y + button.height/2) {
            buttonAnimation.activeButton = index
            button.scale = 0.95
        }
    })
}

function handleTitleTouchEnd(e) {
    if (buttonAnimation.activeButton === null) return
    
    const touch = e.changedTouches[0]
    const x = touch.clientX
    const y = touch.clientY
    const button = titleButtons[buttonAnimation.activeButton]
    
    if (x >= button.x - button.width/2 &&
        x <= button.x + button.width/2 &&
        y >= button.y - button.height/2 &&
        y <= button.y + button.height/2) {
        
        if (buttonAnimation.activeButton === 0) {
            startNewGame()
        } else {
            continueGame()
        }
    }
    
    button.scale = 1
    buttonAnimation.activeButton = null
}

// 监听触摸事件
wx.onTouchStart(e => {
    if (currentSceneType === 'title') {
        const touch = e.touches[0]
        const x = touch.clientX
        const y = touch.clientY

        titleButtons.forEach((button, index) => {
            if (x >= button.x - button.width/2 &&
                x <= button.x + button.width/2 &&
                y >= button.y - button.height/2 &&
                y <= button.y + button.height/2) {
                buttonAnimation.activeButton = index
                button.scale = 0.95 // 按下缩放
            }
        })
    }
})

wx.onTouchEnd(e => {
    if (currentSceneType === 'title' && buttonAnimation.activeButton !== null) {
        const touch = e.changedTouches[0]
        const x = touch.clientX
        const y = touch.clientY
        const button = titleButtons[buttonAnimation.activeButton]
        
        if (x >= button.x - button.width/2 &&
            x <= button.x + button.width/2 &&
            y >= button.y - button.height/2 &&
            y <= button.y + button.height/2) {
            
            if (buttonAnimation.activeButton === 0) {
                startNewGame()
            } else {
                continueGame()
            }
        }
        
        button.scale = 1 // 恢复原始大小
        buttonAnimation.activeButton = null
    } else if (currentSceneType === 'story') {
        storyScene.handleTap()
    }
})

// 等待图片加载完成后启动游戏
coverImage.onload = () => {
    gameLoop()
}
