export const chapter2 = {
  title: "第二章 盐引争锋",

  // 故事场景脚本
  storyScript: [
    {
      text: "天下三分明月夜，二分无赖是扬州",
      background: "bg-cha2",
      character: null,
      position: "center",
    },
    {
      text: "在你到来之前，已有数不清的徽州商人在这里发了大财",
      background: "bg-cha2",
      character: null,
      position: "center",
    },
    {
      text: "也有不少客居的山陕商人，实力强劲，堪称巨鳄",
      background: "bg-cha2",
      character: null,
      position: "center",
    },
    {
      text: "首先，获得盐引在扬州站稳脚跟吧",
      background: "bg-cha2",
      character: null,
      position: "center",
    },
  ],

  // 卡牌事件配置
  cardEvents: [
    {
      id: "event1",
      description: "了解盐引如何获取",
      choices: [
        {
          text: "直接前往盐运司衙门",
          saltChange: 0.5,
          nextId: "event2",
        },
        {
          text: "先前往会馆了解情况",
          saltChange: 1,
          nextId: "event4",
        },
      ],
    },
    {
      id: "event2",
      description: "同乡劝你先向同乡前辈了解情况",
      choices: [
        {
          text: "同意，前往会馆",
          saltChange: 1,
          nextId: "event4",
        },
        {
          text: "执意自行前往衙门",
          saltChange: 0,
        },
      ],
    },
    {
      id: "event3",
      description: "衙门称近日不发放盐引给新商，你吃了闭门羹",
      choices: [
        {
          text: "你正要口出狂言之际被同乡拉走",
          saltChange: -0.5,
        },
        {
          text: "想起同乡劝告前往会馆",
          saltChange: 0.5,
        },
      ],
    },
    {
      id: "event4",
      description:
        "从徽州前辈处得知不少有用信息，盐引获取后还需支盐贩盐，你需要资金提前准备",
      choices: [
        {
          text: "抵押妻子的嫁妆",
          saltChange: 1,
        },
        {
          text: "寻求高利贷款",
          saltChange: 1,
        },
      ],
    },

    {
      id: "event5",
      description: "你在扬州还未稳定，母亲便写信要你照顾来投奔你的家中小辈",
      choices: [
        {
          text: "把他再介绍去杭州的茶庄",
          saltChange: 0,
        },
        {
          text: "多个人帮忙也好",
          saltChange: 1,
        },
      ],
    },
    {
      id: "event6",
      description: "听说有门路快速获得盐引",
      choices: [
        {
          text: "不妨听听",
          saltChange: 1,
        },
        {
          text: "别是什么歪门邪道",
          saltChange: 0,
          nextId: "event12",
        },
      ],
    },
    {
      id: "event7",
      title: "",
      description: "原来是有位晋商想转手盐引",
      choices: [
        {
          text: "请人介绍前往了解",
          saltChange: 0.5,
        },
        {
          text: "不知晋商是否可信，算了",
          saltChange: 0,
          nextId: "event12",
        },
      ],
    },
    {
      id: "event8",
      description: "前往拜访晋商",
      choices: [
        {
          text: "略备薄礼独自前往",
          saltChange: 0,
        },
        {
          text: "认真准备礼物并带上仆从",
          saltChange: 0.5,
        },
      ],
    },
    {
      id: "event9",
      description: "一番寒暄后你刚落座，其仆从便打翻了你的茶杯",
      choices: [
        {
          text: '笑称"碎碎平安"，把话拉回正题',
          saltChange: 0.5,
        },
        {
          text: "愤然离席",
          saltChange: -0.5,
          nextId: "event12",
        },
      ],
    },
    {
      id: "event10",
      description: "晋商称自己要回山西，盐引支取贩售有地区限制故而出手",
      choices: [
        {
          text: "相信，询问价格",
          saltChange: 0,
        },
        {
          text: "有点怪，来都来了问问价",
          saltChange: 0,
        },
      ],
    },
    {
      id: "event11",
      description: "盐引价格竟比官价还高，晋商解释次批支盐日期临近风险很低",
      choices: [
        {
          text: "原来遇到盐引贩子了……告辞离去",
          saltChange: 0.5,
        },
        {
          text: "你心动了，告辞回去筹款",
          saltChange: -0.5,
        },
      ],
    },
    {
      id: "event12",
      description: "同乡告诉你今年产量浮动严重，晋商恐是担心支取才想法脱手",
      choices: [
        {
          text: "你连连称谢，庆幸自己没有掏钱",
          saltChange: 0.5,
        },
        {
          text: "虽有风险，但确实能快速获得盐引",
          saltChange: 1,
        },
      ],
    },
    {
      id: "event13",
      description:
        "是夜，你发现了下午遗漏的重要信息，盐产量浮动，得盐引但若无法支取该如何",
      choices: [
        {
          text: "产生退缩之意",
          saltChange: -2,
        },
        {
          text: "绝不可半途放弃",
          saltChange: 1,
        },
      ],
    },
    {
      id: "event14",
      description: "你得知有位徽州盐商正在寻找合作伙伴",
      choices: [
        {
          text: "前往洽谈",
          saltChange: 0.5,
        },
        {
          text: "暂时不做合伙打算",
          saltChange: 0,
          nextId: "event16",
        },
      ],
    },
    {
      id: "event15",
      description: "原来是前辈想资助一些新商，要求占股三成",
      choices: [
        {
          text: "拒绝好意",
          saltChange: 0,
        },
        {
          text: "接受并签订合同",
          saltChange: 1,
        },
      ],
    },
    {
      id: "event16",
      description: "你收到同乡请你去青楼的邀约",
      choices: [
        {
          text: "推辞不去",
          saltChange: 0,
          nextId: "event18",
        },
        {
          text: "同意前往",
          saltChange: 1,
        },
      ],
    },
    {
      id: "event17",
      description: "你遇到一位红颜知己，她宽慰你下个月或许有获得盐引的机会",
      choices: [
        {
          text: "一笑而过",
          saltChange: 0.5,
        },
        {
          text: "记在心里",
          saltChange: 0,
        },
      ],
    },
    {
      id: "event18",
      description: "战事突起，两淮盐商纷纷捐款",
      choices: [
        {
          text: "你也跟随捐款",
          saltChange: 1,
        },
        {
          text: "资金紧张，算了",
          saltChange: 0.5,
        },
      ],
    },
    {
      id: "event19",
      description: "运司衙门张贴告示，可前往认购新一批盐引",
      choices: [
        {
          text: "立即动身",
          saltChange: 0.5,
        },
        {
          text: "时不我待",
          saltChange: 0.5,
        },
      ],
    },
    {
      id: "event20",
      description: "衙门口人头攒动，已排起长队",
      choices: [
        {
          text: "前往队尾耐心等待",
          saltChange: 0.5,
        },
        {
          text: "张望有无熟人想要插队",
          saltChange: 1,
        },
      ],
    },

    {
      id: "event21",
      title: "为妻赎嫁",
      description: "站稳脚跟，是否为妻子赎回陪嫁",
      choices: [
        {
          text: "坚持高价赎回",
        },
        {
          text: "妻子体恤你生意不易，称算了",
        },
      ],
    },
    {
      id: "event22",
      title: "偿还贷款",
      description: "贷款到期，是否如数偿还",
      choices: [
        {
          text: "如数偿还",
        },
        {
          text: "暂缓处理",
        },
      ],
    },

    {
      id: "event23",
      description: "一徽州学子登门请你资助科举",
      choices: [
        {
          text: "包揽全部费用",
        },
        {
          text: "手头紧，介绍给同乡会",
        },
      ],
    },
    {
      id: "event24",
      title: "晋商遇劫",
      description: "听闻有位晋商盐船遭“水匪”",
      choices: [
        {
          text: "趁火打劫",
        },
        {
          text: "派人护航",
        },
      ],
    },
    {
      id: "event25",
      description: "盐场遭倭寇袭击",
      choices: [
        {
          text: "组织乡勇抵抗",
        },
        {
          text: "花钱买平安",
        },
      ],
    },

    {
      id: "event26",
      title: "担保请求",
      description: "同乡商人资金断裂求你担保",
      choices: [
        {
          text: "联名作保",
        },
        {
          text: "撇清关系",
        },
      ],
    },
    {
      id: "event27",
      description: "你名声渐起，有人散布你偷税传闻",
      choices: [
        {
          text: "重金打点",
        },
        {
          text: "如实呈报",
        },
      ],
    },
    {
      id: "event28",
      description: "家乡修办学堂",
      choices: [
        {
          text: "大力资助，全部顶配",
        },
        {
          text: "点到为止即可",
        },
      ],
    },
    {
      id: "event29",
      description: "长子成年，想来扬州接手生意",
      choices: [
        {
          text: "不同意，希望他专心科举",
        },
        {
          text: "同意，还是交给儿子最放心",
        },
      ],
    },
    {
      id: "event30",
      description: "家书还未寄出，长子已经来到扬州",
      choices: [
        {
          text: "希望他从基层干起",
        },
        {
          text: "别没苦硬吃，把他带在身边",
        },
      ],
    },
    {
      id: "event31",
      description: "长子和后辈都开始独当一面，是时候放手",
      choices: [
        {
          text: "回乡与妻子团聚",
        },
        {
          text: "流连扬州风华，只偶尔回去探亲",
        },
      ],
    },
    {
      id: "event32",
      description: "正德七年，你身体每况愈下；夜色之中，你回想起这一生的浮沉。",
      choices: [
        {
          text: "我此生虽辛苦，却无悔于心",
          nextChapter: true,
        },
        {
          text: "这灯火扬州，我也算留下一笔",
          nextChapter: true,
        },
      ],
    },
  ],
};
