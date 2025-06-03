// 章节配置
export const chapters = [
    {
        id: 1,
        title: '第一章：初入徽州',
        description: '主角来到徽州，开始经商之路',
        unlocked: true,
        background: 'images/chapters/ch1_bg.png'
    },
    {
        id: 2,
        title: '第二章：盐商之路',
        description: '逐步涉足盐业贸易',
        unlocked: false,
        background: 'images/chapters/ch2_bg.png'
    },
    {
        id: 3,
        title: '第三章：茶叶经营',
        description: '拓展茶叶贸易版图',
        unlocked: false,
        background: 'images/chapters/ch3_bg.png'
    },
    {
        id: 4,
        title: '第四章：徽商联盟',
        description: '与其他商家建立联盟',
        unlocked: false,
        background: 'images/chapters/ch4_bg.png'
    },
    {
        id: 5,
        title: '第五章：漕运兴衰',
        description: '参与漕运贸易的机遇与挑战',
        unlocked: false,
        background: 'images/chapters/ch5_bg.png'
    },
    {
        id: 6,
        title: '第六章：会馆兴建',
        description: '建立徽商会馆，扩大影响力',
        unlocked: false,
        background: 'images/chapters/ch6_bg.png'
    },
    {
        id: 7,
        title: '第七章：徽商传奇',
        description: '成为徽商领袖，书写传奇',
        unlocked: false,
        background: 'images/chapters/ch7_bg.png'
    }
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
    if (progress && progress.chapters) {
        progress.chapters.forEach(({id, unlocked}) => {
            const chapter = getChapter(id)
            if (chapter) {
                chapter.unlocked = unlocked
            }
        })
    }
}
