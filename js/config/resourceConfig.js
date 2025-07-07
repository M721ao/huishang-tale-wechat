// 资源配置文件 - 腾讯云COS配置
class ResourceConfig {
  constructor() {
    // 直接配置COS资源链接
    this.cosResources = {
      // 封面图片
      "game-cover":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/cover.png",

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
      "card-4":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card%2Ffour.png",

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

      // 第一章卡牌图片
      "chapter1-card-1":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card%2Fone.png",
      "chapter1-card-2":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card%2F1-2.png?q-sign-algorithm=sha1&q-ak=AKIDeiuOALOQWOLDAeb2DxxcSzDHexkRI8A6ZXmrbJF-zqpanhSt_OxQgM2Yflkr5CCX&q-sign-time=1751881566;1751885166&q-key-time=1751881566;1751885166&q-header-list=host&q-url-param-list=ci-process&q-signature=89004d933590ec52dbefec4df9a7d8a27c3c75bb&x-cos-security-token=j4sIYQ0SmEtAzQ4Zbl5Iwjqyq9tYzSuaa9b16859af2a47f232f19f40b5266666-np4-WiIBqOUBqQedFZ7SFv6Pfs3OYBwLGghtcd92deZaPP3DJGXPsPABWeAZ8GqiNE7NHq26W-wGGGF7vKy-HGJobtSJu_f4lKSoWlfBwt6q0p-8lUgm7jMMXeSRfmysQh1zIjv6LAoVVrhz5m50B2p2z-YERlk8NE39VPV2aXXZgiY6CJmBoGRUCnG6JHV-Ds7RXnLKeqCFC_IOAqDS9IFcK5x80zTRUpQR2cW9r_MhuE9pg83cWIv-wt-FDwUDFIVkSVIvS9Un4-7zkG8zg&ci-process=originImage",
      "chapter1-card-3":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card%2F1-3.png?q-sign-algorithm=sha1&q-ak=AKID9BMK2DDR0Ltaw5S2FptaJm6mNyr6qbFoMBBLXkvTRwTgVDc-o9MLptjVQKkA6k2E&q-sign-time=1751881705;1751885305&q-key-time=1751881705;1751885305&q-header-list=host&q-url-param-list=ci-process&q-signature=0f4292ecb22266af76b8b20f03514bba48ca6b2c&x-cos-security-token=2AqachhSTzCp06eKtiTrY2af1rcj8a0ab9c5f88218d8d88751a47e6ad5ecf9ceGz9qgzERNB5htY1sKIU14z4offqyHVr5WX1ny1aHCPxrzni2x_GoBVLH1abKr_xarqpzscPEWNcFLYp4dgXGMJ28WaXVOCu4JBLlSi36pIs4SQZT2m1of978DBpPB9ZWP8mEf47zIMA95-8dexI_hUICKjHJ0YYsi5EzR2iugeuxH5J-ySfIMsm1s8lmNNuQVhIM6l0gb7mvIisPuo7slWtwvuaW1VUo9cT8MFOpU3-BEvp-BLek7cofpBrnAxFrU_f1BNpGlW-xoNKhiaBWZA&ci-process=originImage",
      "chapter1-card-4":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card%2F1-2.png?q-sign-algorithm=sha1&q-ak=AKIDPxf0WJH0amI50YMgqcgF47pH8usdDbHpujbDeGBFG9w28CoVrD_Eex7O5X3rB7oW&q-sign-time=1751881732;1751885332&q-key-time=1751881732;1751885332&q-header-list=host&q-url-param-list=ci-process&q-signature=1045f7ccbc3c71a05e762a6f67e39caa4a058326&x-cos-security-token=j4sIYQ0SmEtAzQ4Zbl5Iwjqyq9tYzSua0bba5c9cafd3e3b9d13fefdf2032f097-np4-WiIBqOUBqQedFZ7SEbR5QR77YgLA7raCyA6GNaIGyyKOolA81H9o4aw0PhFH0VN7hbsbfj29LJ7mLlRrB0EmYlzQNdDtT3jSgfHsyADHkUWWBEMDi1keSzqw32YYmmTWNOxXAroS1nb3DPP-gqtzeBLgkP5nKpOGjUHD6Ds1AiIV8IiG2KcDRYLh8imYvvaOn_1fLdDwOEdyb1uLaxlBrorYjZkHsWppSR8QyQyRbgwFwgEbPwA0p0f-sBvWM4YRuYqNSjwjaXGhaWkqw&ci-process=originImage",

      // 第二章卡牌图片
      "chapter2-card-1":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card%2Ftwo.png",
      "chapter2-card-2":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card%2F2-2.png?q-sign-algorithm=sha1&q-ak=AKIDwJuedAHqh--uhX3Y8cVfxuK48RQcfe3s85JAukQYJRXriBZRSQ0Q21KyUJ0Z7mKW&q-sign-time=1751881927;1751885527&q-key-time=1751881927;1751885527&q-header-list=host&q-url-param-list=ci-process&q-signature=0449f410b2e03254955dbf611114cd50ad5031cc&x-cos-security-token=j4sIYQ0SmEtAzQ4Zbl5Iwjqyq9tYzSua2582b4e18b6db25851e7e1af346e2e7b-np4-WiIBqOUBqQedFZ7SMRcR7vj8FffsyJFB2zVfLsLPoaJwYxCsX5vwO-xsuC1pBnchxSp9B3vCojSeGXqt5zpRJV3JAOG_u8iWYegCRfaf6rzyO5Wdt-uGseMrP35-vQoTY-9fXdna7YqAxjrzA-xekVxn-95hXR05G1LBiIKd8zS6fS95ZysejGdo2xHjcSRuTlHFNJYwWW_WF1yQn5bNn3MP95Hyxk6EPpjhB8DVzK-RXct-Bv4HbslnF9kKHvco1x92cVDAKpkS0z90w&ci-process=originImage",
      "chapter2-card-3":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card%2F2-3.png?q-sign-algorithm=sha1&q-ak=AKIDiSUuoGjBpLHnVLqMGnceaoIWkH3lspmlrZ9in94I_MQIvhy03Gn0H0OuBGtyG-fs&q-sign-time=1751881934;1751885534&q-key-time=1751881934;1751885534&q-header-list=host&q-url-param-list=ci-process&q-signature=4c688080f3695cf7818076a38921a4d791c863eb&x-cos-security-token=j4sIYQ0SmEtAzQ4Zbl5Iwjqyq9tYzSuaeb45f9b53ae985f41895c12057e1bb94-np4-WiIBqOUBqQedFZ7SL2flL2Z52pL_cHBqMAWBcpV4mLZc-n0OciPcsW789lQ7HI3oO5pSy9yuaJM4T4k-t4qvOO1iMxBbXAM3l5Kv9tHOTvFQqTwbyvdfNGBrxBB3NzJ80l_dsoPymK8UNIRmXNya0idouuAigQ9addACgWENwZ3jkx-ixsR7z9G7-eO6R0O9kArZN4x87-i-2G5OLFB5iCsxOvWvzmxGyDma6WfdvyMlg6V4WBkHEQ0mNi6jVhM7_oUmPcniZhW-Uav-g&ci-process=originImage",
      "chapter2-card-4":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card%2F2-4.png?q-sign-algorithm=sha1&q-ak=AKIDGxLltH4qNLcB5fzp6vGaMvmO6CpBBV10p0Xbqe8iu4RYuXrJWfd5JTmF5cNa1HWD&q-sign-time=1751881942;1751885542&q-key-time=1751881942;1751885542&q-header-list=host&q-url-param-list=ci-process&q-signature=aef42f3b14eda339272d4881b6c2ae54ac89847a&x-cos-security-token=j4sIYQ0SmEtAzQ4Zbl5Iwjqyq9tYzSua2efe3c06bfaf94d2e6b0b5a4fef8583b-np4-WiIBqOUBqQedFZ7SLxeYA1npxVjLIvEKconKurUoZ_mgHxxTVX9yJRQ3jJeWNfEGIQr-sb7rcFWZe7HZZAaM25GakmHSS8yRExunDWZOaX1-XT-R9aJKzx1R7NixvvLFQ9gM9w_v5kvbwoXCQX1UHwrbLkTMxUE07aZlwfSMOaLNvCh3Iq2qkHA5fxa6hVXobm46YSprxhizjeYxbEMBre_z14FaV3jWRsjQmfSqhSSBHqq4R9cuM9BkjlpdQLJQPQ_LscGPEx__fAmwQ&ci-process=originImage",

      // 第三章卡牌图片
      "chapter3-card-1":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card%2Fthree.png",
      "chapter3-card-2":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card%2F3-2.png?q-sign-algorithm=sha1&q-ak=AKID6vy9reounbPMAVNkfvjmbFOGxQE4B939m01TR18NZXHcGEZe1nSaFi8fXJP6DjPR&q-sign-time=1751882040;1751885640&q-key-time=1751882040;1751885640&q-header-list=host&q-url-param-list=ci-process&q-signature=2154dc9e95264231845a4f64dc4ba2653f3622e1&x-cos-security-token=j4sIYQ0SmEtAzQ4Zbl5Iwjqyq9tYzSua0e369eea871bcd685f96fd3e6acc783b-np4-WiIBqOUBqQedFZ7SO-7d_GKpefp1OnRaXtj3aUvngfFKaJPNGdkGIT30lMWiugipwi9SdNAALa94yFpRHkepxyy4YqxgxwfZq6lB54n4KTfp5pXQtYJD16cY12VxMgxpMEmg17NdMc6EnFrEctpvIKD0kQZDfQXIJ_kaDCYRiKjFX2hH-B9j_6vFhvSS3-EsM7EKBC_wtU-EBxoSxctzeZAzjDxWC-qOlo2PmbwlfTaBCbxDsjg6lbjeea-uMVcA_4FumFP3xXcnE3eQA&ci-process=originImage",
      "chapter3-card-3":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card%2F3-3.png?q-sign-algorithm=sha1&q-ak=AKID983AWqaQ9cTMluzV13O1DFlGSYNPGXZsWBHNKOfKg2pepbfMD6-3-PcDqwcp0mw3&q-sign-time=1751881958;1751885558&q-key-time=1751881958;1751885558&q-header-list=host&q-url-param-list=ci-process&q-signature=c70fbfc3c18e08a255aab6729afe59c1a74b6629&x-cos-security-token=j4sIYQ0SmEtAzQ4Zbl5Iwjqyq9tYzSua85b96d86f1e6698139d3ae78b6b14a11-np4-WiIBqOUBqQedFZ7SPV73QBDP_3_WygBzZpZ91FMRI_l6j16ILqI549Wp01pCsEul7mnH8NrDHeZgsePb-pJmuCdT2mVKAiJEZfgUahfky5gRC3lhB2mPYRjTN7wipBhApfw6bQediVWJXW7NgAdq2ylEENl_7f7UI9auTBHRZ1V9lBXd0YDKuYV13rrnOvLQJB8KCSBuHwzuukcInt5sXf3a5jK0h94PS8CcMmidvxrG0hoZ12XfurAPOBNAjnFS-__Z4gH7Csq47NvNw&ci-process=originImage",
      "chapter3-card-4":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card%2F3-2.png?q-sign-algorithm=sha1&q-ak=AKID6vy9reounbPMAVNkfvjmbFOGxQE4B939m01TR18NZXHcGEZe1nSaFi8fXJP6DjPR&q-sign-time=1751882040;1751885640&q-key-time=1751882040;1751885640&q-header-list=host&q-url-param-list=ci-process&q-signature=2154dc9e95264231845a4f64dc4ba2653f3622e1&x-cos-security-token=j4sIYQ0SmEtAzQ4Zbl5Iwjqyq9tYzSua0e369eea871bcd685f96fd3e6acc783b-np4-WiIBqOUBqQedFZ7SO-7d_GKpefp1OnRaXtj3aUvngfFKaJPNGdkGIT30lMWiugipwi9SdNAALa94yFpRHkepxyy4YqxgxwfZq6lB54n4KTfp5pXQtYJD16cY12VxMgxpMEmg17NdMc6EnFrEctpvIKD0kQZDfQXIJ_kaDCYRiKjFX2hH-B9j_6vFhvSS3-EsM7EKBC_wtU-EBxoSxctzeZAzjDxWC-qOlo2PmbwlfTaBCbxDsjg6lbjeea-uMVcA_4FumFP3xXcnE3eQA&ci-process=originImage",

      // 第四章卡牌图片
      "chapter4-card-1":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card%2Ffour.png",
      "chapter4-card-2":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card%2F4-2.png?q-sign-algorithm=sha1&q-ak=AKIDwuOur0ILJvlYV0IEA-jHQHCP5ItnhZCExKIchM6mD_jiOKygaDLRDoO0HPP-VArB&q-sign-time=1751882057;1751885657&q-key-time=1751882057;1751885657&q-header-list=host&q-url-param-list=ci-process&q-signature=e88d4eb237c09ec5c0e12a98aa7d976756524e89&x-cos-security-token=j4sIYQ0SmEtAzQ4Zbl5Iwjqyq9tYzSua6b0e869d585ac7ca5781eb01ba8063d2-np4-WiIBqOUBqQedFZ7SH-EgUUhBP4z8hkt9rwjFnEA-KRGltTiP1jonPVOZtrxUItE_ZMVD4bxva-pwOX9hFSIEGeiYnIuHOz0RN-UdedShJcYh8_eT7PCjrJbTJsQ85xg9vmXCP0cii2l263fZ7Jy-s8MX08Syi96JFTUBSXNvk4bbNVstTDyooy_ez66mLOnrprVFjxUUiUlh987V4oatHpEQeQ2kLpH-3aVRRpGTQBsoU1-eqoFkKiAcZiOmD9QVlTCq8gvT36sOwbomg&ci-process=originImage",
      "chapter4-card-3":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card%2F4-3.png?q-sign-algorithm=sha1&q-ak=AKIDkWAmfiN65Adh3Srw0lAm5JhtubUa6JOEnmxtS_4kjydPHkbUvLS-lCpnzzCqjyMR&q-sign-time=1751881993;1751885593&q-key-time=1751881993;1751885593&q-header-list=host&q-url-param-list=ci-process&q-signature=7382a02915c284029dffdb1af00ae16ed7aca803&x-cos-security-token=j4sIYQ0SmEtAzQ4Zbl5Iwjqyq9tYzSuaa085141d9f8407a2c29079f39ddb5d50-np4-WiIBqOUBqQedFZ7SOs7grOrAD1ETmg-DoYtAwsrvyVod_fdMBSN7axjZXfOaihgINPKnkVdHPlksEGhROCUIthEgw4LH04KZM_CFa1aWmaOh4c85LFMABoN1ooVduBJoqeN13k-LCcSN2hdyENWoay9R7rjIpVJH6oNDj5CVtNLbvUKFC_6JpTtvrDpQ7Ses8_dAsaxucoQ2dm-Em9EVky_jNXkHRpzELhRvBk4eVrTCq1HzYDX-m-WfUnsLN15rJDvm3BnuKcgURW-pg&ci-process=originImage",
      "chapter4-card-4":
        "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/card%2F4-4.png?q-sign-algorithm=sha1&q-ak=AKIDhrNTmzr_35uRutt68OvHFK_6K-9JMzw-kiBLV0BNrdLoxPtS3gEZo4yd-Z9Ew5oM&q-sign-time=1751882000;1751885600&q-key-time=1751882000;1751885600&q-header-list=host&q-url-param-list=ci-process&q-signature=41ea8e13afc58bf70543a8486a84a7e19a29af40&x-cos-security-token=j4sIYQ0SmEtAzQ4Zbl5Iwjqyq9tYzSuace319b1473cf84e62a98c7a1ea2e2fe3-np4-WiIBqOUBqQedFZ7SFZ7WkUeXjBqds-hAuRLsTK60uj6Jga7YhadoN_ETruiqelFnFcV4gMgfTjTXVWwLlCHmFdF2ILLCLeS5abX720gGybiLwi8T7EPPr0UMQNG05mxlMlz1TeA2ktcf3wezr65eH_wHlwzmaudNTIOg0lIJrjRPdXlfGw84_JuI1SrerAbWPSMaVW9_AH7JHDbOPjk3-F3vdF0OnIUODc43lNSqCWd5F_qDn1-m1Tkn46cPS2dNaiINwC1RShtOFSh6g&ci-process=originImage",
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
