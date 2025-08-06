// 资源配置文件 - 腾讯云COS配置
class ResourceConfig {
  constructor() {
    // 直接配置COS资源链接
    this.cosResources = {
      // 封面图片
      "game-cover":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/cover.png",

      // 章节背景
      "chapter-title":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/%E5%9C%A8%E5%9C%B0%E5%9B%BE%E7%89%87/%E7%A4%BE%E5%8C%BA%E8%A7%92%E8%90%BD1.JPG",
      "bg-cha1":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/%E5%9C%A8%E5%9C%B0%E5%9B%BE%E7%89%87/%E7%AF%81%E5%A2%A9%E8%80%81%E7%89%8C%E5%9D%8A.jpg",
      "bg-cha2":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/8.6%E5%9B%BE%E7%89%87%E6%9B%BF%E6%8D%A2/cha2.jpeg",
      "bg-cha3":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/8.6%E5%9B%BE%E7%89%87%E6%9B%BF%E6%8D%A2/cha3.jpg",
      "bg-cha4":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/8.6%E5%9B%BE%E7%89%87%E6%9B%BF%E6%8D%A2/cha4.jpeg",
      "bg-cha5":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/8.6%E5%9B%BE%E7%89%87%E6%9B%BF%E6%8D%A2/cha5.jpg",
      "bg-cha6":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/8.6%E5%9B%BE%E7%89%87%E6%9B%BF%E6%8D%A2/cha6.jpeg",
      "bg-cha7":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/%E5%9C%A8%E5%9C%B0%E5%9B%BE%E7%89%87/%E7%A2%A7%E5%B1%B1%E6%9D%91.jpg",

      // 引子背景
      "prologue.png":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/%E5%9C%A8%E5%9C%B0%E5%9B%BE%E7%89%87/%E5%8D%97%E6%BA%AA%E5%8D%97.jpg",

      // 结局图片
      "ending-1":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/ending-1.png",
      "ending-2":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/ending-2.png",
      "ending-3":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/ending-3.png",
      "ending-4":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/ending-4.png",
      "final-scene":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/8.6%E5%9B%BE%E7%89%87%E6%9B%BF%E6%8D%A2/ending.JPG",

      // 音频文件
      "audio/bgm.mp3":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/bgm.mp3",

      // 章节选择页面背景
      "chapter-select-bg":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/selector.png",

      // 第一章卡牌图片
      "chapter1-card-1":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card%2Fone.png",
      "chapter1-card-2":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card/1-2.png",
      "chapter1-card-3":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card/1-3.png",
      "chapter1-card-4":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card/1-2.png",

      // 第二章卡牌图片
      "chapter2-card-1":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card%2Ftwo.png",
      "chapter2-card-2":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card/2-2.png",
      "chapter2-card-3":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card/2-3.png",
      "chapter2-card-4":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card/2-4.png",

      // 第三章卡牌图片
      "chapter3-card-1":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card%2Fthree.png",
      "chapter3-card-2":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card/3-2.png",
      "chapter3-card-3":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card/3-3.png",
      "chapter3-card-4":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card/3-2.png",

      // 第四章卡牌图片
      "chapter4-card-1":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card%2Ffour.png",
      "chapter4-card-2":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card/4-2.png",
      "chapter4-card-3":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card/4-3.png",
      "chapter4-card-4":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card/4-4.png",
    };
  }

  // 获取资源URL - 简单直接的映射
  getResourceUrl(path) {
    // 如果已经是完整URL，直接返回
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    // 查找配置的COS链接
    if (this.cosResources[path]) {
      return this.cosResources[path];
    }

    // 如果没有找到配置，返回原始路径（用于本地开发）
    console.warn(`资源未配置COS链接: ${path}`);
    return path;
  }

  // 获取图片URL
  getImageUrl(imagePath) {
    return this.getResourceUrl(imagePath);
  }

  // 获取音频URL
  getAudioUrl(audioPath) {
    return this.getResourceUrl(audioPath);
  }

  // 获取背景图片URL
  getBackgroundUrl(backgroundPath) {
    return this.getResourceUrl(backgroundPath);
  }

  // 获取章节背景URL
  getChapterBackgroundUrl(backgroundPath) {
    return this.getResourceUrl(backgroundPath);
  }

  // 获取结局图片URL
  getEndingImageUrl(endingPath) {
    return this.getResourceUrl(endingPath);
  }

  // 添加新的资源配置
  addResource(path, cosUrl) {
    this.cosResources[path] = cosUrl;
  }

  // 批量添加资源配置
  addResources(resources) {
    Object.assign(this.cosResources, resources);
  }
}

// 创建单例实例
const resourceConfig = new ResourceConfig();

// 导出配置实例和便捷函数
export { resourceConfig };

// 导出便捷函数
export const getResourceUrl = (path) => resourceConfig.getResourceUrl(path);
export const getImageUrl = (path) => resourceConfig.getImageUrl(path);
export const getAudioUrl = (path) => resourceConfig.getAudioUrl(path);
export const getBackgroundUrl = (path) => resourceConfig.getBackgroundUrl(path);
export const getChapterBackgroundUrl = (path) =>
  resourceConfig.getChapterBackgroundUrl(path);
export const getEndingImageUrl = (path) =>
  resourceConfig.getEndingImageUrl(path);
