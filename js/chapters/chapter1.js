export const chapter1 = {
  title: "第一章 寄命于商",

  storyScript: [
    {
      text: "成化十六年 · 黟县",
      background: "bg-cha1",
      character: null,
      position: "center",
    },
  ],

  cardEvents: [
    {
      id: "event1",
      description: "母亲翻出家中仅余的最后一个铜板，郑重地放到你掌心。",
      choices: [{ text: "默默接过" }, { text: "母亲……我不想走" }],
    },
    {
      id: "event2",
      description:
        "父亲已离家十载无音讯，母亲日夜操劳，你明白无论是否情愿，都得外出闯荡谋生。",
      choices: [{ text: "开始收拾行囊" }, { text: "……母亲，我该去哪里呢" }],
    },
    {
      id: "event3",
      description:
        "母亲望着你稚弱的身影，轻声道：“去杭州吧，你父亲当年便是往那去的，也许能寻到些消息。”",
      choices: [
        { text: "我知道了，母亲" },
        { text: "可父亲去了就没再回来，我……" },
      ],
    },
    {
      id: "event4",
      description: "几日后，换上母亲亲手缝的新鞋，你踏上了前往杭州的漫漫长路。",
      choices: [{ text: "赶路中" }, { text: "赶路中" }],
    },
    {
      id: "event5",
      title: "初到杭州",
      description: "初到杭州，在喧闹的码头上遇到一位佝偻的老乞丐。",
      choices: [{ text: "赠予他剩余的盘缠" }, { text: "假装没听到快步走开" }],
    },
    {
      id: "event6",
      description: "几经碰壁，终于看见茶庄门前贴出招募学徒的告示。",
      choices: [
        { text: "虽屡败屡战，坚持公平竞争" },
        { text: "讨好账房请他帮你说好话" },
      ],
    },
    {
      id: "event7",
      description: "你总算在茶庄落了脚，开始了学徒生涯。",
      choices: [
        { text: "认真干活，闲时也不忘学习茶叶知识" },
        { text: "很快和师兄弟混在一起，偷懒耍滑" },
      ],
    },
    {
      id: "event8",
      description: "偶然间在街巷里，你认出了家中旧仆的背影。",
      choices: [
        { text: "连忙追上询问父亲下落" },
        { text: "连忙追上询问父亲下落" },
      ],
    },
    {
      id: "event9",
      description: "他叹息着说早已与父亲走散，只说出失散时的大概方位。",
      choices: [
        { text: "决心近日就出发寻找父亲" },
        { text: "生活适才稳定，从长计议吧", nextId: "event14" },
      ],
    },
    {
      id: "event10",
      description: "你试探向掌柜提及请几日假，掌柜神色有些迟疑。",
      choices: [
        { text: "告诉他原委，动之以情" },
        { text: "不知该如何说出口，从长计议吧", nextId: "event14" },
      ],
    },
    {
      id: "event11",
      description: "几番辗转，你终于在一座破庙里找到父亲，已是孤坟冷灰。",
      choices: [
        { text: "就近安葬父亲，对母亲瞒下此事", nextId: "event14" },
        { text: "修书给掌柜，决心带父亲返乡" },
      ],
    },
    {
      id: "event12",
      description: "你带着父亲回乡安葬，陪伴母亲短短几日。",
      choices: [{ text: "返回杭州茶庄" }, { text: "返回杭州茶庄" }],
    },
    {
      id: "event13",
      description: "掌柜并未责怪，只是你能感觉到言语间多了几分疏远。",
      choices: [
        { text: "如往常表现", nextId: "event15" },
        { text: "自己羽翼渐丰，也想另谋出路" },
      ],
    },
    {
      id: "event14",
      description: "相熟的师兄想自立门户，邀你一同前往，许诺同享利润。",
      choices: [
        { text: "立刻投靠师兄" },
        { text: "去师兄的茶庄看看再做决定", nextId: "event16" },
      ],
    },
    {
      id: "event15",
      description: "你发觉师兄的茶庄有人暗中以次充好，牟取私利。",
      choices: [{ text: "当即揭穿" }, { text: "多一事不如少一事" }],
    },
    {
      id: "event16",
      description: "日子照旧流淌，不论在哪个茶庄，终究都是茶叶与账册间奔忙。",
      choices: [{ text: "安于现状" }, { text: "总期待着新的机遇" }],
    },
    {
      id: "event17",
      description: "转眼已至弱冠之年，母亲来信催促你回乡成亲。",
      choices: [{ text: "好吧好吧" }, { text: "回信再次婉拒" }],
    },
    {
      id: "event18",
      description: "又是十年倏忽而逝，这日一位同乡登门，劝你北上扬州闯盐业。",
      choices: [
        { text: "决心转行盐业", nextChapter: true },
        { text: "风险太高还是留守茶业", ending: "ending-1" },
      ],
    },
  ],
};
