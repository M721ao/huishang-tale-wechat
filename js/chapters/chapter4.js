export const chapter3 = {
    title: '第四章 无徽不成镇',
    
    // 故事场景脚本
    storyScript: [
        {
            text: '改革的风暴正在酝酿',
            background: 'images/backgrounds/chapter3/cha3-1.png',
            character: null,
            position: 'center'
        },
        {
            text: '盐政改革的消息传来，引起了扬州城内外的轩然大波',
            background: 'images/backgrounds/chapter3/cha3-1.png',
            character: null,
            position: 'center'
        },
        {
            text: '作为新晋盐商，你将如何在这场变革中寻找机遇？',
            background: 'images/backgrounds/chapter3/cha3-1.png',
            character: null,
            position: 'center'
        }
    ],
    
    // 卡牌事件配置
    cardEvents: [
        {
            id: 'event1',
            title: '改革风波',
            description: '盐政改革的消息传来',
            choices: [
                {
                    text: '静观其变',
                    saltChange: 0
                },
                {
                    text: '提前布局',
                    saltChange: 1
                }
            ]
        },
        {
            id: 'event2',
            title: '新政议论',
            description: '盐商们纷纷议论新政影响',
            choices: [
                {
                    text: '保持低调',
                    saltChange: 0
                },
                {
                    text: '参与讨论',
                    saltChange: 0.5
                }
            ]
        },
        {
            id: 'event3',
            title: '官员态度',
            description: '地方官员对改革态度暧昧',
            choices: [
                {
                    text: '送礼探路',
                    saltChange: 1
                },
                {
                    text: '按兵不动',
                    saltChange: 0
                }
            ]
        }
    ]
}