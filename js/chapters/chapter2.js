export const chapter2 = {
    title: '第二章 盐引之争',
    
    // 故事场景脚本
    storyScript: [
        {
            text: '天下三分明月夜，二分无赖是扬州',
            background: 'images/backgrounds/chapter2/cha2-1.png',
            character: null,
            position: 'center'
        },
        {
            text: '在你到来之前，已有数不清的徽州商人在这里发了大财',
            background: 'images/backgrounds/chapter2/cha2-1.png',
            character: null,
            position: 'center'
        },
        {
            text: '也有不少客居的山陕商人，实力强劲，堪称巨鳄',
            background: 'images/backgrounds/chapter2/cha2-1.png',
            character: null,
            position: 'center'
        }
    ],
    
    // 卡牌事件配置
    cardEvents: [
        {
            id: 'event1',
            title: '初到扬州',
            description: '你亟需获得盐引立住脚跟',
            choices: [
              {
                text: '默默跟随人群排队',
                saltChange: 0
              },
              {
                text: '塞钱给差役插队',
                saltChange: 1
              }
            ]
          },
          {
            id: 'event2',
            title: '验资风波',
            description: '轮到你购买，却被要求：“新商需得验资“',
            choices: [
              {
                text: '据理力争',
                saltChange: 0
              },
              {
                text: '恳请延期验资',
                saltChange: -0.5
              }
            ]
          },
          {
            id: 'event3',
            title: '筹资难题',
            description: '为筹资金抵押称贷',
            choices: [
              {
                text: '抵押妻子陪嫁',
                saltChange: 0.5
              },
              {
                text: '寻求高利贷款',
                saltChange: 0.5
              }
            ]
          },
          {
            id: 'event4',
            title: '干股引荐',
            description: '同乡引荐前辈，要求三成干股',
            choices: [
              {
                text: '让出三成干股',
                saltChange: 1.5
              },
              {
                text: '拒绝好意',
                saltChange: 0
              }
            ]
          },
          {
            id: 'event5',
            title: '盐运使寿宴',
            description: '恰逢盐运使寿宴',
            choices: [
              {
                text: '打点关系赴宴',
                saltChange: 0.5
              },
              {
                text: '拖同乡带你赴宴',
                saltChange: 0.5
              }
            ]
          },
          {
            id: 'event6',
            title: '寿宴贺礼',
            description: '为寿宴准备贺礼',
            choices: [
              {
                text: '重金准备',
                saltChange: 0.5
              },
              {
                text: '略备薄礼',
                saltChange: -0.5
              }
            ]
          },
          {
            id: 'event7',
            title: '晋商挑衅',
            description: '宴会上，一晋商仆从故意打翻酒杯',
            choices: [
              {
                text: '笑称"碎碎平安"',
                saltChange: 0.5
              },
              {
                text: '愤然离席',
                saltChange: -1
              }
            ]
          },
          {
            id: 'event8',
            title: '小妾索礼',
            description: '盐运使小妾暗示索要礼物',
            choices: [
              {
                text: '连夜送礼',
                saltChange: 1
              },
              {
                text: '无视之',
                saltChange: -0.5
              }
            ]
          },
          {
            id: 'event9',
            title: '翻修祠堂',
            description: '适逢年关，妻子写信告诉你宗族要翻新祠堂',
            choices: [
              {
                text: '应允出资',
                saltChange: 0.5
              },
              {
                text: '手头困难拒绝',
                saltChange: 0
              }
            ]
          },
          {
            id: 'event10',
            title: '再次购引',
            description: '再次尝试购引，又遇晋商刁难',
            choices: [
              {
                text: '贿赂通关',
                saltChange: 1.5
              },
              {
                text: '公开抗议',
                saltChange: 0.5
              }
            ]
          },
        //   event11-29
          {
            id: 'event11',
            title: '盐商互助',
            description: '一位落魄的盐商请求你的帮助',
            choices: [
                {
                    text: '会合互助',
                    result: '你们绔结成盟，共同幸存',
                },
                {
                    text: '拒绝请求',
                    result: '你选择独行，但失去了盟友',
                }
            ]
        },
        {
            id: 'event12',
            title: '母亲来信',
            description: '母亲发来书信，同族后生想来扬州投靠',
            choices: [
                {
                    text: '同意',
                    result: '你接纳了后生，为家族传承播下种子',
                },
                {
                    text: '以根基不稳拒绝',
                    result: '你婉拒了来投之意，心中却难以释怀',
                }
            ]
        },
        {
            id: 'event13',
            title: '为妻赎嫁',
            description: '站稳脚跟，妻子希望你帮忙赎回陪嫁',
            choices: [
                {
                    text: '高价赎回',
                    result: '你不惜重金，终于物归原主',
                },
                {
                    text: '按数偿还',
                    result: '你讲信修睦，赢得岳家尊重',
                }
            ]
        },
        {
            id: 'event14',
            title: '偿还贷款',
            description: '贷款到期，是否如数偿还',
            choices: [
                {
                    text: '如数偿还',
                    result: '你守信还债，声誉渐隆',
                },
                {
                    text: '暂缓处理',
                    result: '你暂缓还款，信用蒙尘',
                }
            ]
        },
        {
            id: 'event15',
            title: '盐工工钱',
            description: '今年产量浮动严重，是否按时发放工钱',
            choices: [
                {
                    text: '如数发放',
                    result: '你体恤工人，赢得人心',
                },
                {
                    text: '拖延一下',
                    result: '你选择拖延，引发怨声载道',
                }
            ]
        },
        {
            id: 'event16',
            title: '资助科举',
            description: '徽州学子求你资助科举',
            choices: [
                {
                    text: '包揽全部费用',
                    result: '你慷慨解囊，学子感恩铭记',
                },
                {
                    text: '手头紧，介绍给同乡会',
                    result: '你尽力斡旋，略感歉疚',
                }
            ]
        },
        {
            id: 'event17',
            title: '垫付军饷',
            description: '战事突起，朝廷暗示盐商垫付军饷',
            choices: [
                {
                    text: '冒险垫付军饷',
                    result: '你博得朝廷青睐，却也风险并存',
                },
                {
                    text: '婉拒',
                    result: '你明哲保身，少了升迁之机',
                }
            ]
        },
        {
            id: 'event18',
            title: '晋商遇劫',
            description: '听闻晋商盐船遭“水匪”',
            choices: [
                {
                    text: '趁火打劫',
                    result: '你乘虚而入，获利颇丰但名声受损',
                },
                {
                    text: '派人护航',
                    result: '你仗义出手，赢得友商敬重',
                }
            ]
        },
        {
            id: 'event19',
            title: '盐税压力',
            description: '产量连年大幅波动，盐工纷纷逃亡，朝廷仍强征固定盐税',
            choices: [
                {
                    text: '提议浮动税制',
                    result: '你进言得策，朝廷深思之',
                },
                {
                    text: '压榨盐工补缺',
                    result: '你压榨工人，换来短暂安稳',
                }
            ]
        },
        {
            id: 'event20',
            title: '女儿拒婚',
            description: '女儿拒嫁盐运使之子',
            choices: [
                {
                    text: '强令完婚',
                    result: '你牺牲亲情换取政治筹码',
                },
                {
                    text: '送其入道观',
                    result: '你尊重选择，却断了婚姻之路',
                }
            ]
        },
        {
            id: 'event21',
            title: '晋商走私',
            description: '发现晋商走私证据',
            choices: [
                {
                    text: '向盐运使举报',
                    result: '你正直报官，赢得清誉',
                },
                {
                    text: '暗中要挟合作',
                    result: '你借势而谋，隐患犹存',
                }
            ]
        },
        {
            id: 'event22',
            title: '倭寇袭盐场',
            description: '盐场遭倭寇袭击',
            choices: [
                {
                    text: '组织乡勇抵抗',
                    result: '你奋起保盐，声威大震',
                },
                {
                    text: '花钱买平安',
                    result: '你花重金保全，但士气低迷',
                }
            ]
        },
        {
            id: 'event23',
            title: '茶业价格战',
            description: '晋商突然在茶业发难打价格战',
            choices: [
                {
                    text: '暗中帮助同乡商会',
                    result: '你暗助徽商，团结共进',
                },
                {
                    text: '公开联合徽商反制',
                    result: '你公开反制，掀起商战风云',
                }
            ]
        },
        {
            id: 'event24',
            title: '担保请求',
            description: '同乡商人资金断裂求你担保',
            choices: [
                {
                    text: '联名作保',
                    result: '你挺身而出，风险共担',
                },
                {
                    text: '撇清关系',
                    result: '你避责为上，惹人非议',
                }
            ]
        },
        {
            id: 'event25',
            title: '偷税传闻',
            description: '有人散布你偷税传闻，钦差南下巡查账目',
            choices: [
                {
                    text: '重金打点',
                    result: '你用金钱摆平风波，但真相难辨',
                },
                {
                    text: '如实呈报',
                    result: '你自信无愧，静待清查结果',
                }
            ]
        },
        {
            id: 'event26',
            title: '家乡学堂',
            description: '家乡修办学堂',
            choices: [
                {
                    text: '大力资助，全部顶配',
                    result: '你厚植桑梓，乡人感念不已',
                },
                {
                    text: '点到为止即可',
                    result: '你量力而为，略显保守',
                }
            ]
        },
        {
            id: 'event27',
            title: '纲盐法推行',
            description: '盐引积滞，引发盐商普遍不满，朝廷颁布纲盐法',
            choices: [
                {
                    text: '积极入册',
                    result: '你顺势而动，掌握主动',
                },
                {
                    text: '顺其自然',
                    result: '你观望观局，错失良机',
                }
            ]
        },
        {
            id: 'event28',
            title: '邻省积粮',
            description: '听闻邻近省份有积粮',
            choices: [
                {
                    text: '向官府尽数收购',
                    result: '你果断出手，粮利双收',
                },
                {
                    text: '放弃屯粮',
                    result: '你谨慎退让，失去先机',
                }
            ]
        },
        {
            id: 'event29',
            title: '城中失火',
            description: '城中失火，有桥被烧毁',
            choices: [
                {
                    text: '慷慨捐赠修复',
                    result: '你慷慨解囊，名动一时',
                },
                {
                    text: '自顾不暇',
                    result: '你明哲保身，却寒了民心',
                }
            ]
        },
        {
            id: 'event30',
            title: '税监横征',
            description: '稅监太监大肆征税',
            choices: [
                {
                    text: '联络朝臣对抗',
                    result: '你联络朝臣，共谋对策',
                },
                {
                    text: '忍气吞声',
                    result: '你逆来顺受，积怨日深',
                }
            ]
        },
        {
            id: 'event31',
            title: '徽商领袖',
            description: '被推举为徽商领袖',
            choices: [
                {
                    text: '乘势而上',
                    result: '你走上权力巅峰，众望所归',
                    nextChapter: true
                },
                {
                    text: '激流勇退',
                    result: '你急流勇退，留得清誉满身',
                    ending: 'ending-3'
                }
            ]
        },
    ]
}
