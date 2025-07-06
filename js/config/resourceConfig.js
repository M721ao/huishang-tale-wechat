// 资源配置文件 - 腾讯云COS配置
class ResourceConfig {
  constructor() {
    // 直接配置COS资源链接
    this.cosResources = {
      // 封面图片
      "game-cover":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/cover.png",

      // 卡牌图片
      "card-1":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card%2Fone.png",
      "card-2":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card%2Fthree.png",
      "card-3":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card%2Fthree.png",
      "card-4":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card%2Ffour.png",

      // 章节背景
      "bg-cha1":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/cha1-1.png",
      "bg-cha2":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/cha2-1.png",
      "bg-cha3":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/cha3.png",
      "bg-cha4":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/cha4.png",
      "bg-cha5":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/cha5.png",
      "bg-cha6":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/cha6.png",
      "bg-cha7":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/cha7.png",

      // 引子背景
      "prologue.png":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/prologue.png",

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
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/final.png",

      // 音频文件
      "audio/bgm.mp3":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/bgm.mp3",

      // 章节选择页面背景
      "chapter-select-bg":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/selector.png",
      "chapter-title":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/chapter-title.png",
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
