// 章节配置
export const chapters = [
    {
        id: 1,
        title: '第一章：寄命于商',
        description: '主角来到徽州，开始经商之路',
        unlocked: true,
        background: 'images/chapters/ch1_bg.png'
    },
    {
        id: 2,
        title: '第二章：盐引争锋',
        description: '逐步涉足盐业贸易',
        unlocked: false,
        background: 'images/chapters/ch2_bg.png'
    },
    {
        id: 3,
        title: '第三章：儒贾之道',
        description: '拓展茶叶贸易版图',
        unlocked: false,
        background: 'images/chapters/ch3_bg.png'
    },
    {
        id: 4,
        title: '第四章：无徽不成镇',
        description: '与其他商家建立联盟',
        unlocked: false,
        background: 'images/chapters/ch4_bg.png'
    },
    {
        id: 5,
        title: '第五章：风雨飘摇',
        description: '参与漕运贸易的机遇与挑战',
        unlocked: false,
        background: 'images/chapters/ch5_bg.png'
    },
    {
        id: 6,
        title: '第六章：红顶落幕',
        description: '建立徽商会馆，扩大影响力',
        unlocked: false,
        background: 'images/chapters/ch6_bg.png'
    },
]

// 获取章节信息
export function getChapter(id) {
    return chapters.find(chapter => chapter.id === id)
}

// 解锁新章节
export function unlockChapter(id) {
    const chapter = getChapter(id)
    if (chapter) {
        chapter.unlocked = true
    }
}

// 获取已解锁的章节
export function getUnlockedChapters() {
    return chapters.filter(chapter => chapter.unlocked)
}

// 保存游戏进度
export function saveProgress() {
    wx.setStorageSync('gameProgress', {
        chapters: chapters.map(({id, unlocked}) => ({id, unlocked}))
    })
}

// 加载游戏进度
export function loadProgress() {
    const progress = wx.getStorageSync('gameProgress')
    if (progress) {
        // 加载已解锁的章节
        for (const chapter of chapters) {
            if (progress.unlockedChapters.includes(chapter.id)) {
                chapter.unlocked = true
            }
        }
    }
    return progress
}

// 初始游戏状态
export const initialState = {
    money: 10,      // 初始10两银子
    reputation: 0,  // 声望
    relations: {},  // 人际关系
    inventory: {}   // 库存
}
