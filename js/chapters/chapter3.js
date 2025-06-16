export const chapter3 = {
    title: '第三章 诗书商道',
    
    // 故事场景脚本
    storyScript: [
        {
            text: '1560年，明万历十八年，徽州 · x府',
            background: 'images/backgrounds/chapter3/cha3-1.png',
            character: null,
            position: 'center'
        },
    ],
    
    // 卡牌事件配置
    cardEvents: [
            {
              id: 'event1',
              title: '抓周仪式',
              description: '母亲抱着你举办抓周仪式，你选',
              choices: [
                {
                  text: '算盘',
                  learningProgress: -1,
                },
                {
                  text: '朱子',
                  learningProgress: 10,
                }
              ]
            },
            {
                id: 'event2',
                title: '抓周仪式',
                description: '母亲抱着你举办抓周仪式，你选',
                choices: [
                  {
                    text: '算盘',
                    learningProgress: 0,
                  },
                  {
                    text: '朱子',
                    learningProgress: 0,
                  }
                ]
              },  {
                id: 'event3',
                title: '抓周仪式',
                description: '母亲抱着你举办抓周仪式，你选',
                choices: [
                  {
                    text: '算盘',
                    learningProgress: 0,
                  },
                  {
                    text: '朱子',
                    learningProgress: 0,
                  }
                ]
              },  {
                id: 'event4',
                title: '抓周仪式',
                description: '母亲抱着你举办抓周仪式，你选',
                choices: [
                  {
                    text: '算盘',
                    learningProgress: 0,
                  },
                  {
                    text: '朱子',
                    learningProgress: 0,
                  }
                ]
              },
              {
                id: 'event5',
                title: '抓周仪式',
                description: '母亲抱着你举办抓周仪式，你选',
                choices: [
                  {
                    text: '算盘',
                    learningProgress: 0,
                  },
                  {
                    text: '朱子',
                    learningProgress: 0,
                  }
                ]
              },
            
            {
              id: 'event6',
              title: '竹山书院',
              description: '进了这么厉害的书院，你决定花几分力气读书？',
              choices: [
                {
                  text: '马马虎虎就行了',
                  learningProgress: 0
                },
                {
                  text: '非常努力！',
                  learningProgress: 2
                }
              ]
            },
            {
              id: 'event7',
              title: '朱子语类',
              description: '父亲决定效仿吴珮，你觉得',
              choices: [
                {
                  text: '他真浪费钱',
                  learningProgress: 0
                },
                {
                  text: '请母亲为你找来《朱子语类》连夜学习',
                  learningProgress: 2
                }
              ]
            },
            {
              id: 'event8',
              title: '黄牡丹雅集',
              description: '作诗好无聊，我只想看金杯，还是专心听他们说话学习？',
              choices: [
                {
                  text: '作诗好无聊，我只想看金杯',
                  learningProgress: 1
                },
                {
                  text: '专心听他们说话学习',
                  learningProgress: 2
                }
              ]
            },
            {
              id: 'event9',
              title: '父亲教诲',
              description: '在父亲身边这两年，这句训诫便昼夜叩在耳畔',
              choices: [
                {
                  text: '做生意多好，吃香的喝辣的，百无一用是书生',
                  learningProgress: 0
                },
                {
                  text: '父亲说的对，万般皆下品，唯有读书高',
                  learningProgress: 2
                }
              ]
            },
            {
              id: 'event10',
              title: '好友备考',
              description: '回乡后，好友找你习举文汇备考县试',
              choices: [
                {
                  text: '架不住好友软磨硬泡终是答应',
                  learningProgress: 1
                },
                {
                  text: '欣然答应，日夜切磋',
                  learningProgress: 2
                }
              ]
            },
            {
              id: 'event11',
              title: '中了秀才',
              description: '母亲问你想要什么',
              choices: [
                {
                  text: '求娶邻女',
                  learningProgress: 0
                },
                {
                  text: '拜师深造',
                  learningProgress: 2
                }
              ]
            },
            {
              id: 'event12',
              title: '中了举人',
              description: '父亲已然年老，你要继续读书还是接管家业？',
              choices: [
                {
                  text: '接！',
                  learningProgress: 0
                },
                {
                  text: '坚持读书',
                  learningProgress: 2
                }
              ]
            },
            {
              id: 'event13',
              title: '前往会试',
              description: '前往中央参与会试',
              choices: [
                {
                  text: '我要走着去！用脚丈量山河',
                  learningProgress: 1
                },
                {
                  text: '坐车早日到达早点开始复习',
                  learningProgress: 2
                }
              ]
            },
            {
              id: 'event14',
              title: '诱惑当前',
              description: '住地遇到几位公子邀请你去勾栏听曲',
              choices: [
                {
                  text: '去去去！',
                  learningProgress: 0
                },
                {
                  text: '复习重要',
                  learningProgress: 2
                }
              ]
            },
            {
              id: 'event15',
              title: '徽州同乡',
              description: '遇到徽州同乡被欺',
              choices: [
                {
                  text: '为他出头',
                  learningProgress: 1
                },
                {
                  text: '保持低调',
                  learningProgress: 2
                }
              ]
            },
            {
              id: 'event16',
              title: '打点之路',
              description: '那几位公子告诉你有一条打点的路子',
              choices: [
                {
                  text: '说来听听？',
                  learningProgress: 1
                },
                {
                  text: '公平竞争',
                  learningProgress: 1
                }
              ]
            },
            {
              id: 'event17',
              title: '会试前夜',
              description: '会试前夜，你打算',
              choices: [
                {
                  text: '睡个好觉',
                  learningProgress: 2
                },
                {
                  text: '通宵冲刺等到黎明前往考场',
                  learningProgress: 1
                }
              ]
            }
          ]
          
    
}