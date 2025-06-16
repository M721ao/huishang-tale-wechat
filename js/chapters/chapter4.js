export const chapter4 = {
    title: '第四章 无徽不成镇',
    
    // 故事场景脚本
    storyScript: [
        {
            text: '承租上庇荫，今天是我和江家小姐的婚礼',
            background: 'images/backgrounds/chapter3/cha3-1.png',
            character: null,
            position: 'center'
        },
        // {
        //     text: '说起江家，就不得不说这一段往事',
        //     background: 'images/backgrounds/chapter3/cha3-1.png',
        //     character: null,
        //     position: 'center'
        // },
        // {
        //     text: '15年前，淮盐最大的运销口岸汉口突生变故，汉口盐商联合起来囤积居奇，盐价随之飞涨上天',
        //     background: 'images/backgrounds/chapter3/cha3-1.png',
        //     character: null,
        //     position: 'center'
        // },
        // {
        //     text: '百姓见状纷纷前往盐店抢购，谁知盐商见势立刻停业不卖',
        //     background: 'images/backgrounds/chapter3/cha3-1.png',
        //     character: null,
        //     position: 'center'
        // },
        // {
        //     text: '百姓的愤怒几乎酿成民变',
        //     background: 'images/backgrounds/chapter3/cha3-1.png',
        //     character: null,
        //     position: 'center'
        // },
        // {
        //     text: '为此朝廷专开会议商讨核定食盐成本来确定售价',
        //     background: 'images/backgrounds/chapter3/cha3-1.png',
        //     character: null,
        //     position: 'center'
        // },
        // {
        //     text: '两位大员为成本究竟是3两还是7两争论不休，乾隆帝便派遣苏州巡抚同新任巡盐御史赴两淮考察',
        //     background: 'images/backgrounds/chapter3/cha3-1.png',
        //     character: null,
        //     position: 'center'
        // },
        // {
        //     text: '这自然难不倒两淮的徽州盐商们，他们轻车熟路搞定了两位钦差，最后敲定每引六两',
        //     background: 'images/backgrounds/chapter3/cha3-1.png',
        //     character: null,
        //     position: 'center'
        // },
        // {
        //     text: '5年前，乾隆皇帝南巡，首次驾临扬州，以江春为首的盐商接驾，而皇帝离开后不久，一道圣旨突然改变了运行十年的限定盐价，允许市场定价，盐价随之飞涨',
        //     background: 'images/backgrounds/chapter3/cha3-1.png',
        //     character: null,
        //     position: 'center'
        // }
    ],
    
    // 卡牌事件配置
    cardEvents: [
        {
            id: 'event1',
            title: '高门岳丈',
            description: '',
            choices: [
                {
                    text: '搞好关系',
                    governmentRelation: 10
                },
                {
                    text: '不结交',
                    governmentRelation: -10
                }
            ]
        },
        {
            id: 'event2',
            title: '接驾翻修',
            description: '皇帝第二次南巡，江家安排随行官员住进你的宅园，需要你出资翻修',
            choices: [
                    {
                        text: '自掏腰包修缮一新',
                        governmentRelation: 20
                    },
                    {
                        text: '简单布置即可',
                        governmentRelation: -10
                    }
                ]
            },
            {
                id: 'event3',
                title: '白塔之语',
                description: '皇帝感叹大虹园缺少白塔',
                choices: [
                    {
                        text: '抓住机会贿赂近侍获取白塔图样',
                        governmentRelation: 20
                    },
                    {
                        text: '让这句话随风而去吧',
                        governmentRelation: 0
                    }
                ]
            },
            {
                id: 'event4',
                title: '落魄文人',
                description: '有落魄文人登门拜访',
                choices: [
                    {
                        text: '盛情相迎入府居住',
                        governmentRelation: 10
                    },
                    {
                        text: '吃顿饭意思意思就是了',
                        governmentRelation: 0
                    }
                ]
            },
            {
                id: 'event5',
                title: '石桥火灾',
                description: '城内石桥毁于火灾',
                choices: [
                    {
                        text: '捐助重修',
                        governmentRelation: 20
                    },
                    {
                        text: '自顾不暇',
                        governmentRelation: 0
                    }
                ]
            },
            {
                id: 'event6',
                title: '南巡选曲',
                description: '皇帝即将再次南巡，为了取悦上意，安排你去梨园选曲',
                choices: [
                    {
                        text: '南巡必须演新剧',
                        governmentRelation: 20
                    },
                    {
                        text: '用经典旧戏',
                        governmentRelation: 0
                    }
                ]
            },
            {
                id: 'event7',
                title: '徽商会馆',
                description: '你因公旅京，恰逢徽商会馆筹办',
                choices: [
                    {
                        text: '慷慨捐助',
                        governmentRelation: 10
                    },
                    {
                        text: '备礼祝贺不过分参与',
                        governmentRelation: 0
                    }
                ]
            },
            {
                id: 'event8',
                title: '军费支出',
                description: '国家战事频起，朝廷军政费用支出浩繁',
                choices: [
                    {
                        text: '主动加入捐输',
                        governmentRelation: 20
                    },
                    {
                        text: '不过分出头，参与即可',
                        governmentRelation: 10
                    }
                ]
            },
            {
                id: 'event9',
                title: '书院兴建',
                description: '扬州城内兴建书院，你是否参与捐资',
                choices: [
                    {
                        text: '捐',
                        governmentRelation: 20
                    },
                    {
                        text: '啊，手头有点紧',
                        governmentRelation: 0
                    }
                ]
            },
            {
                id: 'event10',
                title: '帮学子打点',
                description: '南巡接驾前夕，有同乡学子请你帮忙打点召试',
                choices: [
                    {
                        text: '帮忙打点上下助其一臂之力',
                        governmentRelation: 20
                    },
                    {
                        text: '语重心长告知要公平竞争走流程',
                        governmentRelation: 0
                    }
                ]
            },
            {
                id: 'event11',
                title: '灾情连绵',
                description: '灾情连绵，是否主动眷属',
                choices: [
                    {
                        text: '捐',
                        governmentRelation: 20
                    },
                    {
                        text: '啊，手头有点紧',
                        governmentRelation: -10
                    }
                ]
            },
            {
                id: 'event12',
                title: '修建祠堂',
                description: '族人提议修建祠堂以彰显家族地位，需耗资五年收入',
                choices: [
                    {
                        text: '建',
                        governmentRelation: 20
                    },
                    {
                        text: '啊，手头有点紧',
                        governmentRelation: 0
                    }
                ]
            },
            {
                id: 'event13',
                title: '对联之争',
                description: '你途径江苏新安镇，听闻本地人抱怨悦来集一对联',
                choices: [
                    {
                        text: '赞同，觉得略有不妥',
                        governmentRelation: 0
                    },
                    {
                        text: '觉得这位仁兄太敏感了',
                        governmentRelation: 0
                    }
                ]
            },
            {
                id: 'event14',
                title: '治理河道',
                description: '治理河道，官员暗示眷属',
                choices: [
                    {
                        text: '捐',
                        governmentRelation: 20
                    },
                    {
                        text: '啊，手头有点紧',
                        governmentRelation: -10
                    }
                ]
            },
            {
                id: 'event15',
                title: '园子迎亲',
                description: '长子结婚，是否为他新建一座园子',
                choices: [
                    {
                        text: '建',
                        governmentRelation: 10
                    },
                    {
                        text: '儿啊，你该独立了',
                        governmentRelation: 0
                    }
                ]
            },
            {
                id: 'event16',
                title: '皇帝庆典',
                description: '皇帝执政庆典，江家率捐',
                choices: [
                    {
                        text: '捐',
                        governmentRelation: 20
                    },
                    {
                        text: '啊，手头有点紧',
                        governmentRelation: -10
                    }
                ]
            },
            {
                id: 'event17',
                title: '资金紧张',
                description: '捐输不断，生意流水愈发吃紧',
                choices: [
                    {
                        text: '买通御史，诬告竞争对手走私',
                        governmentRelation: -20
                    },
                    {
                        text: '变卖家产，借贷维持',
                        governmentRelation: 0
                    }
                ]
            },
            {
                id: 'event18',
                title: '清剿白莲教',
                description: '清剿白莲教，是否捐输',
                choices: [
                    {
                        text: '捐',
                        governmentRelation: 20
                    },
                    {
                        text: '实在捐不动了',
                        governmentRelation: -10
                    }
                ]
            },
            {
                id: 'event19',
                title: '追缴税款',
                description: '朝廷开始追缴积欠课税',
                choices: [
                    {
                        text: '赶快补交',
                        governmentRelation: 0
                    },
                    {
                        text: '法不责众，就是不补',
                        governmentRelation: -20
                    }
                ]
            },
            {
                id: 'event20',
                title: '票盐制改革',
                description: '盐政改革推行票盐制，生意一落千丈',
                choices: [
                    {
                        text: '倒卖官盐',
                        governmentRelation: -50
                    },
                    {
                        text: '唉，再借些高利贷吧',
                        governmentRelation: 0
                    }
                ]
            }
    ]
}