/**
 * COS资源可访问性测试工具
 */

class COSTest {
  constructor() {
    this.baseUrl =
      "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com";
    this.testResources = [
      "cover.png",
      "bgm.mp3",
      "final.png",
      "one.png",
      "two.png",
      "three.png",
      "four.png",
      "five.png",
      "six.png",
      "chapter1.png",
      "chapter2.png",
      "chapter3.png",
      "chapter4.png",
      "chapter5.png",
      "chapter6.png",
      "chapter7.png",
    ];
  }

  /**
   * 测试单个资源的可访问性
   */
  async testSingleResource(resourcePath) {
    return new Promise((resolve) => {
      const fullUrl = `${this.baseUrl}/${resourcePath}`;

      // 对于图片资源使用wx.createImage测试
      if (resourcePath.endsWith(".png") || resourcePath.endsWith(".jpg")) {
        const img = wx.createImage();

        img.onload = () => {
          console.log(`✅ 图片加载成功: ${resourcePath}`);
          resolve({ resource: resourcePath, status: "success", url: fullUrl });
        };

        img.onerror = (err) => {
          console.log(`❌ 图片加载失败: ${resourcePath}`, err);
          resolve({
            resource: resourcePath,
            status: "error",
            url: fullUrl,
            error: err,
          });
        };

        img.src = fullUrl;
      }
      // 对于音频文件使用wx.request测试
      else if (resourcePath.endsWith(".mp3")) {
        wx.request({
          url: fullUrl,
          method: "HEAD", // 只获取头部信息，不下载文件内容
          success: (res) => {
            console.log(`✅ 音频文件可访问: ${resourcePath}`, res.statusCode);
            resolve({
              resource: resourcePath,
              status: "success",
              url: fullUrl,
              statusCode: res.statusCode,
            });
          },
          fail: (err) => {
            console.log(`❌ 音频文件访问失败: ${resourcePath}`, err);
            resolve({
              resource: resourcePath,
              status: "error",
              url: fullUrl,
              error: err,
            });
          },
        });
      }
      // 其他文件类型使用wx.request测试
      else {
        wx.request({
          url: fullUrl,
          method: "HEAD",
          success: (res) => {
            console.log(`✅ 资源可访问: ${resourcePath}`, res.statusCode);
            resolve({
              resource: resourcePath,
              status: "success",
              url: fullUrl,
              statusCode: res.statusCode,
            });
          },
          fail: (err) => {
            console.log(`❌ 资源访问失败: ${resourcePath}`, err);
            resolve({
              resource: resourcePath,
              status: "error",
              url: fullUrl,
              error: err,
            });
          },
        });
      }
    });
  }

  /**
   * 测试所有资源
   */
  async testAllResources() {
    console.log("🚀 开始测试COS资源可访问性...");
    const results = [];

    for (const resource of this.testResources) {
      const result = await this.testSingleResource(resource);
      results.push(result);

      // 添加小延迟避免请求过频
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return this.generateReport(results);
  }

  /**
   * 生成测试报告
   */
  generateReport(results) {
    const successCount = results.filter((r) => r.status === "success").length;
    const errorCount = results.filter((r) => r.status === "error").length;

    console.log("\n📊 COS资源测试报告");
    console.log("=".repeat(50));
    console.log(`总计资源: ${results.length}`);
    console.log(`✅ 成功: ${successCount}`);
    console.log(`❌ 失败: ${errorCount}`);
    console.log("=".repeat(50));

    const errorResources = results.filter((r) => r.status === "error");
    if (errorResources.length > 0) {
      console.log("\n❌ 失败的资源:");
      errorResources.forEach((item) => {
        console.log(
          `  - ${item.resource}: ${item.error?.errMsg || "Unknown error"}`
        );
      });
    }

    const successResources = results.filter((r) => r.status === "success");
    if (successResources.length > 0) {
      console.log("\n✅ 成功的资源:");
      successResources.forEach((item) => {
        console.log(`  - ${item.resource}`);
      });
    }

    return {
      total: results.length,
      success: successCount,
      error: errorCount,
      results: results,
    };
  }

  /**
   * 快速测试核心资源
   */
  async quickTest() {
    console.log("⚡ 快速测试核心资源...");
    const coreResources = ["cover.png", "bgm.mp3", "final.png"];
    const results = [];

    for (const resource of coreResources) {
      const result = await this.testSingleResource(resource);
      results.push(result);
    }

    return this.generateReport(results);
  }
}

// 导出测试工具
// 兼容不同环境的全局对象
const globalObj =
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof global !== "undefined"
    ? global
    : typeof window !== "undefined"
    ? window
    : {};

// 只在支持的环境中挂载到全局对象
if (typeof globalObj !== "undefined") {
  globalObj.COSTest = COSTest;

  // 提供便捷的全局测试函数
  globalObj.testCOS = async function () {
    const tester = new COSTest();
    return await tester.testAllResources();
  };

  globalObj.quickTestCOS = async function () {
    const tester = new COSTest();
    return await tester.quickTest();
  };
}

// ES模块导出（用于import方式）
export { COSTest };
export const testCOS = async function () {
  const tester = new COSTest();
  return await tester.testAllResources();
};

export const quickTestCOS = async function () {
  const tester = new COSTest();
  return await tester.quickTest();
};

console.log("💡 COS测试工具已加载！");
console.log("使用方法:");
console.log("1. 完整测试: testCOS()");
console.log("2. 快速测试: quickTestCOS()");
