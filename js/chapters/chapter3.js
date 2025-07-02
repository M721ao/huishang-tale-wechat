export const chapter3 = {
  title: "第三章 诗书商道",

  // 故事场景脚本
  storyScript: [
    {
      text: "万历十八年 · 黟县",
      background: "images/backgrounds/chapter3/cha3-1.png",
      character: null,
      position: "center",
    },
  ],

  // 卡牌事件配置
  cardEvents: [
    {
      id: "event1",
      description: "母亲怀抱着你，眼前摆满琳琅物件，你将手伸向——",
      choices: [
        {
          text: "算盘",
          learningProgress: -1,
        },
        {
          text: "朱子",
          learningProgress: 10,
          nextId: "event6",
        },
      ],
    },
    {
      id: "event2",
      title: "抓周仪式",
      description: "你拿起算盘，父亲却温柔拿过又把你放回地上",
      choices: [
        {
          text: "算盘",
          learningProgress: 0,
        },
        {
          text: "朱子",
          learningProgress: 5,
          nextId: "event6",
        },
      ],
    },
    {
      id: "event3",
      title: "抓周仪式",
      description: "你拿起算盘，父亲却温柔拿过又把你放回地上",
      choices: [
        {
          text: "算盘",
          learningProgress: 0,
        },
        {
          text: "朱子",
          learningProgress: 2,
          nextId: "event6",
        },
      ],
    },
    {
      id: "event4",
      title: "抓周仪式",
      description: "你拿起算盘，父亲却温柔拿过又把你放回地上",
      choices: [
        {
          text: "算盘",
          learningProgress: 0,
        },
        {
          text: "朱子",
          learningProgress: 2,
          nextId: "event6",
        },
      ],
    },
    {
      id: "event5",
      title: "抓周仪式",
      description: "你偏要拿算盘，父亲却强压你小手，直至选了朱子",
      choices: [
        {
          text: "朱子",
          learningProgress: 1,
        },
        {
          text: "朱子",
          learningProgress: 1,
        },
      ],
    },
    {
      id: "event6",
      description:
        "抓周礼后，父亲便启程远行，母亲常牵你于桂花飘香的院落低语先贤旧事",
      choices: [
        {
          text: "看风景",
          learningProgress: 0,
        },
        {
          text: "虽然不懂，但把读书记在心间",
          learningProgress: 1,
        },
      ],
    },

    {
      id: "event7",
      description:
        "你进入村中书院，院墙上镌着“介无分畛域，率之为善”，先生高声朗诵。",
      choices: [
        {
          text: "不甚理解",
          learningProgress: 0,
        },
        {
          text: "心中触动",
          learningProgress: 1,
        },
      ],
    },
    {
      id: "event8",
      description: "在书院中，你决定付出几分心力？",
      choices: [
        { text: "马马虎虎，聊以应付", learningProgress: 0 },
        { text: "全力以赴，手不释卷", learningProgress: 2 },
      ],
    },
    {
      id: "event9",
      title: "朱子之学",
      description:
        "父亲寄书言道，休宁商人吴珮常年助刻《朱子语类》，其子高中进士。他欲效之，你觉得——",
      choices: [
        { text: "不甚理解", learningProgress: 0 },
        { text: "请母亲寻来《朱子语类》彻夜苦读", learningProgress: 2 },
      ],
    },
    {
      id: "event10",
      title: "黄牡丹雅集",
      description: "前往扬州探望父亲恰逢影园牡丹盛开，群贤毕至赋诗，你更在意——",
      choices: [
        { text: "那对‘黄牡丹赏最’的金杯", learningProgress: 0 },
        { text: "趁机聆听高士谈吐，博采学问", learningProgress: 1 },
      ],
    },
    {
      id: "event11",
      title: "父亲箴言",
      description: "在父亲膝下的时光，他常告诫你：“毋效贾竖子为也”。",
      choices: [
        { text: "生意好啊，衣食无忧，书生哪管用", learningProgress: 0 },
        { text: "父亲有理，书香门第方为正道", learningProgress: 1 },
      ],
    },
    {
      id: "event12",
      title: "同窗砥砺",
      description: "回乡后，好友缠你共习举文，备考县试。",
      choices: [
        { text: "架不住软磨硬泡，终是应了", learningProgress: 2 },
        { text: "欣然允诺，废寝忘食共研", learningProgress: 2 },
      ],
    },
    {
      id: "event13",
      title: "高中秀才",
      description: "不负期望，你中了秀才。母亲喜极而问：可有什么心愿？",
      choices: [
        { text: "想娶那邻家姑娘为妻", learningProgress: 0 },
        { text: "欲再拜名师，深造学业", learningProgress: 2 },
      ],
    },
    {
      id: "event14",
      title: "举人之路",
      description: "三年后，你又中举人。你见父亲年迈——",
      choices: [
        { text: "毅然接管生意", learningProgress: 0 },
        { text: "进京，搏那一第", learningProgress: 2 },
      ],
    },
    {
      id: "event15",
      title: "进京赶考",
      description: "你启程赴会试，准备——",
      choices: [
        { text: "徒步前行，寄情山河", learningProgress: 1 },
        { text: "乘车早到，先行温习", learningProgress: 2 },
      ],
    },
    {
      id: "event16",
      description: "投宿京城数日，几位公子邀你同往勾栏听曲。",
      choices: [
        { text: "去去去，逍遥痛快", learningProgress: 0 },
        { text: "书卷在心，更要抓紧复习", learningProgress: 2 },
      ],
    },
    {
      id: "event17",
      title: "同乡被辱",
      description: "街头偶遇徽州同乡被欺凌。",
      choices: [
        { text: "挺身而出替他解围", learningProgress: 1 },
        { text: "低眉敛首，不招是非", learningProgress: 2 },
      ],
    },
    {
      id: "event18",
      title: "打点之策",
      description: "几位公子悄声道：‘不如另辟蹊径，打点一番。’",
      choices: [
        { text: "洗耳恭听", learningProgress: 1 },
        { text: "摇头谢绝，仍要光明磊落", learningProgress: 1 },
      ],
    },
    {
      id: "event19",
      title: "临阵抉择",
      description: "会试前夜，你打算如何度过？",
      choices: [
        { text: "睡个好觉，养足精神", learningProgress: 2 },
        { text: "挑灯夜战，通宵温书", learningProgress: 1 },
      ],
    },
  ],
};
