// 事件类型枚举
export const EventType = {
    STORY: 'story',      // 剧情
    TRADE: 'trade',      // 贸易
    SOCIAL: 'social',    // 人际
    DISASTER: 'disaster' // 灾难
}

// 选项结果类型
export const ResultType = {
    RESOURCES: 'resources',  // 资源变化
    REPUTATION: 'reputation',// 声望变化
    RELATION: 'relation',    // 关系变化
    UNLOCK: 'unlock'        // 解锁新内容
}

// 游戏状态
export class GameState {
    constructor() {
        this.money = 1000;       // 银两
        this.reputation = 0;     // 声望
        this.relations = {};     // 人际关系
        this.inventory = {};     // 库存
        this.unlockedEvents = new Set(); // 已解锁事件
    }

    // 更新游戏状态
    update(changes) {
        for (const [key, value] of Object.entries(changes)) {
            if (typeof this[key] === 'number') {
                this[key] += value;
            } else if (typeof this[key] === 'object') {
                Object.assign(this[key], value);
            }
        }
    }

    // 保存游戏状态
    save() {
        wx.setStorageSync('gameState', {
            money: this.money,
            reputation: this.reputation,
            relations: this.relations,
            inventory: this.inventory,
            unlockedEvents: Array.from(this.unlockedEvents)
        });
    }

    // 加载游戏状态
    load() {
        const saved = wx.getStorageSync('gameState');
        if (saved) {
            this.money = saved.money;
            this.reputation = saved.reputation;
            this.relations = saved.relations;
            this.inventory = saved.inventory;
            this.unlockedEvents = new Set(saved.unlockedEvents);
        }
    }
}

// 游戏状态类型
export const StateTypes = {
    MONEY: 'money',          // 钱财
    REPUTATION: 'reputation', // 声望
    HEALTH: 'health',        // 健康
    WISDOM: 'wisdom',        // 智慧
    RELATION: 'relation'     // 人际关系
}

// 事件类型
export const EventTypes = {
    TRADE: 'trade',         // 商贸
    SOCIAL: 'social',       // 社交
    DISASTER: 'disaster',   // 灾难
    OPPORTUNITY: 'opportunity' // 机遇
}

// 事件结果类型
export const ResultTypes = {
    GOOD: 'good',
    BAD: 'bad',
    NEUTRAL: 'neutral'
}

// 第一章事件列表
export const chapter1Events = [
    {
        id: 'event_001',
        type: EventTypes.TRADE,
        title: '茶商邀约',
        description: '一位茶商向你推销新采的明前龙井，声称可以代理销售。',
        image: 'images/events/default.png',
        choices: {
            left: {
                text: '拒绝',
                result: '省下了一笔钱，但错过了赚钱机会。',
                effects: {
                    [StateTypes.MONEY]: 0,
                    [StateTypes.REPUTATION]: -5
                }
            },
            right: {
                text: '接受',
                result: '花费5两银子购入茶叶，转手卖出获得8两。',
                effects: {
                    [StateTypes.MONEY]: 3,
                    [StateTypes.REPUTATION]: 5
                }
            }
        }
    },
    {
        id: 'event_002',
        type: EventTypes.SOCIAL,
        title: '路遇求助',
        description: '一位老者在路边晕倒，周围无人理会。',
        image: 'images/events/default.png',
        choices: {
            left: {
                text: '视而不见',
                result: '避免了可能的麻烦，但心中不安。',
                effects: {
                    [StateTypes.REPUTATION]: -10,
                    [StateTypes.WISDOM]: -5
                }
            },
            right: {
                text: '施以援手',
                result: '老者是退休的盐官，赠予你一块盐引作为感谢。',
                effects: {
                    [StateTypes.REPUTATION]: 15,
                    [StateTypes.RELATION]: 10
                }
            }
        }
    },
    {
        id: 'event_003',
        type: EventTypes.DISASTER,
        title: '暴雨山洪',
        description: '途经山路时遇到暴雨，前方可能有山洪。',
        image: 'images/events/flood.png',
        choices: {
            left: {
                text: '原路返回',
                result: '安全返回，但耽误了行程。',
                effects: {
                    [StateTypes.MONEY]: -2,
                    [StateTypes.HEALTH]: 0
                }
            },
            right: {
                text: '冒险前行',
                result: '虽然通过了，但受了风寒。',
                effects: {
                    [StateTypes.HEALTH]: -10,
                    [StateTypes.WISDOM]: 5
                }
            }
        }
    },
    {
        id: 'event_004',
        type: EventTypes.OPPORTUNITY,
        title: '书生论道',
        description: '遇到一位赶考的书生，邀你一起讨论时事。',
        image: 'images/events/default.png',
        choices: {
            left: {
                text: '婉拒',
                result: '错过了学习机会。',
                effects: {
                    [StateTypes.WISDOM]: -5,
                    [StateTypes.RELATION]: -5
                }
            },
            right: {
                text: '切磋',
                result: '获得了不少见识，还结识了这位未来的官员。',
                effects: {
                    [StateTypes.WISDOM]: 10,
                    [StateTypes.RELATION]: 15
                }
            }
        }
    },
    {
        id: 'event_005',
        type: EventTypes.TRADE,
        title: '集市交易',
        description: '集市上有人低价出售一批丝绸，称是为了快速周转。',
        image: 'images/events/default.png',
        choices: {
            left: {
                text: '谨慎避开',
                result: '虽然错过了机会，但避免了可能的风险。',
                effects: {
                    [StateTypes.MONEY]: 0,
                    [StateTypes.WISDOM]: 5
                }
            },
            right: {
                text: '购入',
                result: '发现是赃物，被官府盘查，花钱摆平。',
                effects: {
                    [StateTypes.MONEY]: -20,
                    [StateTypes.REPUTATION]: -10
                }
            }
        }
    },
    {
        id: 'event_006',
        type: EventTypes.SOCIAL,
        title: '酒肆闲谈',
        description: '酒肆中几位商人正在谈论生意经，似乎有意与你结交。',
        image: 'images/events/default.png',
        choices: {
            left: {
                text: '独饮',
                result: '保持了独立，但错过了人脉。',
                effects: {
                    [StateTypes.RELATION]: -10,
                    [StateTypes.WISDOM]: 0
                }
            },
            right: {
                text: '加入',
                result: '结识了几位行商，获得了不少商道经验。',
                effects: {
                    [StateTypes.RELATION]: 15,
                    [StateTypes.WISDOM]: 10
                }
            }
        }
    },
    {
        id: 'event_007',
        type: EventTypes.OPPORTUNITY,
        title: '神秘商机',
        description: '有人告诉你徽州最近要修建新的官道，建议你囤积木材。',
        image: 'images/events/default.png',
        choices: {
            left: {
                text: '保守观望',
                result: '没有冒险，但也没有收益。',
                effects: {
                    [StateTypes.MONEY]: 0,
                    [StateTypes.WISDOM]: 5
                }
            },
            right: {
                text: '投资',
                result: '消息属实，木材价格上涨，获得丰厚回报。',
                effects: {
                    [StateTypes.MONEY]: 30,
                    [StateTypes.REPUTATION]: 10
                }
            }
        }
    },
    {
        id: 'event_008',
        type: EventTypes.DISASTER,
        title: '盗匪劫道',
        description: '路过偏僻山路，遭遇盗匪拦路。',
        image: 'images/events/default.png',
        choices: {
            left: {
                text: '给钱了事',
                result: '失去一些钱财，但保住了性命。',
                effects: {
                    [StateTypes.MONEY]: -15,
                    [StateTypes.HEALTH]: 0
                }
            },
            right: {
                text: '奋力反抗',
                result: '虽然击退盗匪，但受了轻伤。',
                effects: {
                    [StateTypes.HEALTH]: -15,
                    [StateTypes.REPUTATION]: 20
                }
            }
        }
    },
    {
        id: 'event_009',
        type: EventTypes.TRADE,
        title: '瓷器生意',
        description: '遇到景德镇的瓷商，提议合作运送瓷器到杭州。',
        image: 'images/events/porcelain.png',
        choices: {
            left: {
                text: '婉拒',
                result: '避免了风险，但失去了机会。',
                effects: {
                    [StateTypes.MONEY]: 0,
                    [StateTypes.RELATION]: -5
                }
            },
            right: {
                text: '合作',
                result: '虽然辛苦，但获得了不错的收益。',
                effects: {
                    [StateTypes.MONEY]: 25,
                    [StateTypes.REPUTATION]: 15
                }
            }
        }
    },
    {
        id: 'event_010',
        type: EventTypes.OPPORTUNITY,
        title: '官员宴请',
        description: '县衙的一位官员邀请你参加家宴。',
        image: 'images/events/official_dinner.png',
        choices: {
            left: {
                text: '推辞',
                result: '避免了攀附权贵之嫌，但错过了机会。',
                effects: {
                    [StateTypes.REPUTATION]: 5,
                    [StateTypes.RELATION]: -10
                }
            },
            right: {
                text: '赴宴',
                result: '结识了几位官员，打通了一些关系。',
                effects: {
                    [StateTypes.RELATION]: 20,
                    [StateTypes.REPUTATION]: -5
                }
            }
        }
    }
]

// 初始状态
export const initialState = {
    [StateTypes.MONEY]: 10,      // 初始10两银子
    [StateTypes.REPUTATION]: 50,  // 初始50点声望
    [StateTypes.HEALTH]: 100,    // 初始100点健康
    [StateTypes.WISDOM]: 50,     // 初始50点智慧
    [StateTypes.RELATION]: 30    // 初始30点人际关系
}

// 保存游戏状态
export function saveGameState(state) {
    wx.setStorageSync('gameState', state)
}

// 加载游戏状态
export function loadGameState() {
    return wx.getStorageSync('gameState') || {...initialState}
}

// 事件配置
export const events = {
    "event_001": {
        id: "event_001",
        type: EventType.STORY,
        title: "初到徽州",
        description: "你带着父亲给你的盘缠，来到了繁华的徽州...",
        image: "images/events/arrive_huizhou.png",
        choices: [
            {
                text: "先找个住处安顿下来",
                results: [
                    {
                        type: ResultType.RESOURCES,
                        changes: { money: -100 },
                        description: "花费100两银子租了一间小屋"
                    },
                    {
                        type: ResultType.UNLOCK,
                        eventId: "event_002",
                        description: "解锁新的机会"
                    }
                ]
            },
            {
                text: "去拜访父亲的故交",
                results: [
                    {
                        type: ResultType.RELATION,
                        changes: { "老王": 10 },
                        description: "获得了老王的好感"
                    },
                    {
                        type: ResultType.UNLOCK,
                        eventId: "event_003",
                        description: "解锁新的人脉"
                    }
                ]
            }
        ],
        requirements: null // 初始事件无要求
    },
    // 可以继续添加更多事件...
}
