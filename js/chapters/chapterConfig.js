// 章节配置
import { getChapterBackgroundUrl } from "../config/resourceConfig.js";

export const chapters = [
  {
    id: 1,
    title: "寄命于商",
    description: "徽州人离乡谋生，把命运托付于商贾之道。",
    unlocked: true,
    background: getChapterBackgroundUrl("bg-cha1"),
  },
  {
    id: 2,
    title: "盐引争锋",
    description: "盐业之利滚滚，徽商于盐引间激烈争夺，各显手段。",
    unlocked: false,
    background: getChapterBackgroundUrl("bg-cha2"),
  },
  {
    id: 3,
    title: "诗书商道",
    description: "盐利之外，家中诗书传世，士商并重的风雅悄然扎根。",
    unlocked: false,
    background: getChapterBackgroundUrl("bg-cha3"),
  },
  {
    id: 4,
    title: "无徽不成镇",
    description: "商路四通八达，哪有繁镇不见徽商身影？",
    unlocked: false,
    background: getChapterBackgroundUrl("bg-cha4"),
  },
  {
    id: 5,
    title: "风雨飘摇",
    description: "战火与政局骤变，家业在动荡中摇曳如浮萍。",
    unlocked: false,
    background: getChapterBackgroundUrl("bg-cha5"),
  },
  {
    id: 6,
    title: "红顶落幕",
    description: "红顶商人风光不再，徽帮亦渐失旧日荣光。",
    unlocked: false,
    background: getChapterBackgroundUrl("bg-cha6"),
  },
  {
    id: 7,
    title: "金字招牌",
    description: "虽经百年兴衰，犹有老字号在市井传唱徽味。",
    unlocked: false,
    background: getChapterBackgroundUrl("bg-cha7"),
  },
];

// 获取章节信息
export function getChapter(id) {
  return chapters.find((chapter) => chapter.id === id);
}

// 解锁新章节
export function unlockChapter(id) {
  const chapter = getChapter(id);
  if (chapter) {
    chapter.unlocked = true;
  }
}

// 获取已解锁的章节
export function getUnlockedChapters() {
  return chapters.filter((chapter) => chapter.unlocked);
}

// 保存完整的游戏进度
export function saveGameProgress(progress) {
  try {
    wx.setStorageSync("gameProgress", progress);
    console.log("游戏进度保存成功");
  } catch (error) {
    console.error("保存游戏进度失败:", error);
  }
}

// 加载完整的游戏进度
export function loadGameProgress() {
  try {
    const progress = wx.getStorageSync("gameProgress");
    console.log("游戏进度加载成功");
    return progress;
  } catch (error) {
    console.error("加载游戏进度失败:", error);
    return null;
  }
}

// 保存章节解锁状态
export function saveProgress() {
  try {
    wx.setStorageSync("gameProgress", {
      chapters: chapters.map(({ id, unlocked }) => ({ id, unlocked })),
    });
    console.log("游戏进度保存成功");
  } catch (error) {
    console.error("保存游戏进度失败:", error);
    // 如果存储失败，不抛出错误，只记录日志
  }
}

// 加载章节解锁状态
export function loadProgress() {
  try {
    const progress = wx.getStorageSync("gameProgress");
    if (progress && progress.chapters) {
      // 加载已解锁的章节
      for (const chapter of chapters) {
        const saved = progress.chapters.find((c) => c.id === chapter.id);
        if (saved) {
          chapter.unlocked = saved.unlocked;
        }
      }
    }
    console.log("游戏进度加载成功");
    return progress;
  } catch (error) {
    console.error("加载游戏进度失败:", error);
    // 如果加载失败，返回null，使用默认值
    return null;
  }
}

// 初始游戏状态
export const initialState = {
  wealth: 0,
  reputation: 0,
  saltProgress: 0,
  saltChanges: [],
  learningProgress: 0,
  governmentRelation: 0,
  attributes: {}, // 确保attributes对象存在
};
