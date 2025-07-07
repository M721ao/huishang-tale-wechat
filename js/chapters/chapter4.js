export const chapter4 = {
  title: "第四章 无徽不成镇",

  // 故事场景脚本
  storyScript: [
    {
      text: "自百年前先人高中进士，我家生意便随之腾飞。",
      background: "bg-cha4",
      character: null,
      position: "center",
    },
    {
      text: "又为扩展商路，今日便是我迎娶江家小姐之日。",
      background: "bg-cha4",
      character: null,
      position: "center",
    },
    {
      text: "十五年前，淮盐重镇汉口突生波澜。盐商联手囤积，盐价直上青天。",
      background: "bg-cha4",
      character: null,
      position: "center",
    },
    {
      text: "百姓争相涌入盐店抢购，岂料盐商干脆关门停业。民怨四起，几至哗变。",
      background: "bg-cha4",
      character: null,
      position: "center",
    },
    {
      text: "为平息乱象，朝廷特设大议，欲以核算成本重新厘定盐价。",
      background: "bg-cha4",
      character: null,
      position: "center",
    },
    {
      text: "两位重臣为到底是三两还是七两争得面红耳赤，乾隆帝遂命苏州巡抚携新任巡盐御史亲赴两淮查勘。",
      background: "bg-cha4",
      character: null,
      position: "center",
    },
    {
      text: "可这样的差事，怎会难倒老成精细的两淮徽商？几番打点下来，终敲定每引六两。",
      background: "bg-cha4",
      character: null,
      position: "center",
    },
    {
      text: "五年前，乾隆帝南巡，首次驻跸扬州，以江春为首的徽州盐商趋前接驾。",
      background: "bg-cha4",
      character: null,
      position: "center",
    },
    {
      text: "圣驾前脚刚走，一道上谕便废止了十年的限价，改由市面浮动，盐价再度高企。",
      background: "bg-cha4",
      character: null,
      position: "center",
    },
  ],

  // 卡牌事件配置
  cardEvents: [
    {
      id: "event1",
      title: "高门岳丈",
      description: "江家乃当地望族，与岳丈打好关系，或可借势而行。",
      choices: [
        {
          text: "悉心维系，与江家亲厚无间",
          governmentRelation: 10,
        },
        {
          text: "不愿攀附权贵，只求本分",
          governmentRelation: 0,
        },
      ],
    },
    {
      id: "event2",
      title: "接驾翻修",
      description:
        "皇帝再度南巡，江家安排随行官员暂居你府中，需你出资整修宅园。",
      choices: [
        {
          text: "倾资翻修，务使焕然一新",
          governmentRelation: 20,
        },
        {
          text: "略作粉饰，不必太过张扬",
          governmentRelation: -10,
        },
      ],
    },
    {
      id: "event3",
      title: "白塔之语",
      description: "皇帝行至大虹园，随口感叹园中若有白塔更为雅致。",
      choices: [
        {
          text: "抓住时机，贿赂近侍求得白塔图纸",
          governmentRelation: 20,
        },
        {
          text: "权作耳边风，不以为意",
          governmentRelation: 0,
        },
      ],
    },
    {
      id: "event4",
      title: "落魄文人",
      description: "一位穷困潦倒的文人来府上投帖求见。",
      choices: [
        {
          text: "盛情款待，留其在府中栖身",
          governmentRelation: 10,
        },
        {
          text: "只设一席便饭略尽地主之谊",
          governmentRelation: 0,
        },
      ],
    },
    {
      id: "event5",
      title: "石桥火灾",
      description: "城内石桥遭祝融吞噬，百姓往来受阻。",
      choices: [
        {
          text: "慷慨解囊助其重修",
          governmentRelation: 20,
        },
        {
          text: "此时自顾尚且不暇",
          governmentRelation: 0,
        },
      ],
    },
    {
      id: "event6",
      title: "南巡选曲",
      description: "为迎接圣驾，再度吩咐你前往梨园遴选曲目。",
      choices: [
        {
          text: "坚持要演全新剧目讨好上意",
          governmentRelation: 20,
        },
        {
          text: "沿用历年旧戏稳妥为上",
          governmentRelation: -10,
        },
      ],
    },
    {
      id: "event7",
      title: "徽商会馆",
      description: "恰逢你因事赴京，正值徽商合力筹建新会馆。",
      choices: [
        {
          text: "当即捐资助力",
          governmentRelation: 10,
        },
        {
          text: "备薄礼致贺，不多参与",
          governmentRelation: -10,
        },
      ],
    },
    {
      id: "event8",
      title: "军费支出",
      description: "国库为连年征战所困，军饷筹集迫在眉睫。",
      choices: [
        {
          text: "率先捐输以表忠诚",
          governmentRelation: 20,
        },
        {
          text: "跟随捐输，避免过于显眼",
          governmentRelation: 10,
        },
      ],
    },
    {
      id: "event9",
      title: "书院兴建",
      description: "扬州计划兴办书院以广育俊才。",
      choices: [
        {
          text: "出资助成",
          governmentRelation: 20,
        },
        {
          text: "叹息囊中羞涩，只能作罢",
          governmentRelation: 0,
        },
      ],
    },
    {
      id: "event10",
      title: "帮学子打点",
      description: "南巡前夕，同乡学子求你打点场次以求捷报。",
      choices: [
        {
          text: "倾力相助，上下打点一应俱全",
          governmentRelation: 20,
        },
        {
          text: "劝其凭真才实学自取功名",
          governmentRelation: 0,
        },
      ],
    },
    {
      id: "event11",
      title: "灾情连绵",
      description: "水旱蝗灾接踵而至，民不聊生。",
      choices: [
        {
          text: "再行捐助，尽绵薄之力",
          governmentRelation: 20,
        },
        {
          text: "实在拮据，无力再捐",
          governmentRelation: 0,
        },
      ],
    },
    {
      id: "event12",
      title: "修建祠堂",
      description: "族中耆老倡议修建宗祠以显门第，需倾注数年之营收。",
      choices: [
        {
          text: "同意，彰显家声",
          governmentRelation: 20,
        },
        {
          text: "叹曰家计尚紧，不敢妄动",
          governmentRelation: 0,
        },
      ],
    },
    {
      id: "event13",
      title: "对联之争",
      description:
        "途经江苏新安镇，闻当地人议论文昌阁楹联“分黄山半点秀气，镇东海一郡文风”。",
      choices: [
        {
          text: "提笔改之为“分黄山秀气，振东海文风”",
          governmentRelation: 10,
        },
        {
          text: "只觉此地之人小题大作",
          governmentRelation: -10,
        },
      ],
    },
    {
      id: "event14",
      title: "治理河道",
      description: "河道整治事关运盐通道，官员私下示意捐助。",
      choices: [
        {
          text: "从命捐银，以保顺畅",
          governmentRelation: 20,
        },
        {
          text: "推托称困，暂不相应",
          governmentRelation: -10,
        },
      ],
    },
    {
      id: "event15",
      title: "园子迎亲",
      description: "长子即将完婚，族中望你为其新筑园宅。",
      choices: [
        {
          text: "允诺修建，以示家门气派",
          governmentRelation: 10,
        },
        {
          text: "教其自立，方能自持门户",
          governmentRelation: 20,
        },
      ],
    },
    {
      id: "event16",
      title: "皇帝庆典",
      description: "皇帝登基周年庆，江家率先巨额捐输。",
      choices: [
        {
          text: "随即慷慨解囊",
          governmentRelation: 20,
        },
        {
          text: "心力交瘁，只得婉拒",
          governmentRelation: -10,
        },
      ],
    },
    {
      id: "event17",
      title: "资金紧张",
      description: "频频捐输致周转吃紧，生意愈发艰难。",
      choices: [
        {
          text: "买通御史，暗害对手以图翻身",
          governmentRelation: -20,
        },
        {
          text: "典卖田庄，四处借贷维系",
          governmentRelation: 0,
        },
      ],
    },
    {
      id: "event18",
      title: "清剿白莲教",
      description: "白莲教再起，官府张榜募捐讨伐军费。",
      choices: [
        {
          text: "再掏一笔，免生后患",
          governmentRelation: 20,
        },
        {
          text: "实在囊空如洗，婉拒捐输",
          governmentRelation: -20,
        },
      ],
    },
    {
      id: "event19",
      title: "追缴税款",
      description: "朝廷紧急追查历年积欠盐课。",
      choices: [
        {
          text: "痛快补缴，以求平安",
          governmentRelation: 0,
        },
        {
          text: "法不责众，断然拒付",
          governmentRelation: -30,
        },
      ],
    },
    {
      id: "event20",
      title: "票盐制改革",
      description: "盐政推行票盐制，旧法尽废，盐利断崖。",
      choices: [
        {
          text: "铤而走险，私售官盐",
          governmentRelation: -50,
        },
        {
          text: "再借些高利贷以图缓急",
          governmentRelation: 0,
        },
      ],
    },
  ],
};
