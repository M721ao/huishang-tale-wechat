/**
 * 服务器连接测试工具
 */

class ServerTest {
  constructor() {
    this.serverUrl = "https://huishangwuyu.site/api";
  }

  /**
   * 测试服务器连接性
   */
  async testServerConnection() {
    console.log("🚀 开始测试服务器连接...");

    return new Promise((resolve) => {
      if (typeof wx !== "undefined") {
        wx.request({
          url: `${this.serverUrl}/`,
          method: "GET",
          success: (res) => {
            console.log("✅ 服务器连接成功:", res);
            resolve({
              status: "success",
              statusCode: res.statusCode,
              data: res.data,
            });
          },
          fail: (err) => {
            console.log("❌ 服务器连接失败:", err);
            resolve({
              status: "error",
              error: err,
              errorMsg: err.errMsg,
            });
          },
        });
      } else {
        console.log("非微信环境，无法测试");
        resolve({
          status: "skip",
          message: "非微信环境",
        });
      }
    });
  }

  /**
   * 测试登录接口
   */
  async testLoginEndpoint() {
    console.log("🧪 测试登录接口...");

    return new Promise((resolve) => {
      if (typeof wx !== "undefined") {
        wx.request({
          url: `${this.serverUrl}/user/login`,
          method: "POST",
          data: { code: "test-code" },
          header: {
            "content-type": "application/json",
          },
          success: (res) => {
            console.log("登录接口响应:", res);
            resolve({
              status: "success",
              statusCode: res.statusCode,
              data: res.data,
              message: "登录接口可访问（即使参数错误）",
            });
          },
          fail: (err) => {
            console.log("❌ 登录接口访问失败:", err);
            resolve({
              status: "error",
              error: err,
              errorMsg: err.errMsg,
            });
          },
        });
      } else {
        resolve({
          status: "skip",
          message: "非微信环境",
        });
      }
    });
  }

  /**
   * 测试游戏进度获取接口（使用假的userId）
   */
  async testGameProgressEndpoint() {
    console.log("🎮 测试游戏进度接口...");

    const testUserId = "507f1f77bcf86cd799439011"; // 假的ObjectId格式

    return new Promise((resolve) => {
      if (typeof wx !== "undefined") {
        wx.request({
          url: `${this.serverUrl}/game/progress/${testUserId}`,
          method: "GET",
          success: (res) => {
            console.log("游戏进度接口响应:", res);
            resolve({
              status: "success",
              statusCode: res.statusCode,
              data: res.data,
              message: "游戏进度接口可访问",
            });
          },
          fail: (err) => {
            console.log("❌ 游戏进度接口访问失败:", err);
            resolve({
              status: "error",
              error: err,
              errorMsg: err.errMsg,
            });
          },
        });
      } else {
        resolve({
          status: "skip",
          message: "非微信环境",
        });
      }
    });
  }

  /**
   * 获取当前用户的真实userId进行测试
   */
  async testWithRealUserId() {
    console.log("👤 使用真实userId测试...");

    // 尝试从本地存储获取用户数据
    let userData = null;
    if (typeof wx !== "undefined") {
      try {
        userData = wx.getStorageSync("userData");
      } catch (e) {
        console.log("无法获取本地用户数据");
      }
    }

    if (!userData || !userData.userId) {
      return {
        status: "skip",
        message: "没有找到有效的用户ID",
      };
    }

    console.log("找到用户ID:", userData.userId);

    return new Promise((resolve) => {
      wx.request({
        url: `${this.serverUrl}/game/progress/${userData.userId}`,
        method: "GET",
        success: (res) => {
          console.log("✅ 真实用户游戏进度获取成功:", res);
          resolve({
            status: "success",
            statusCode: res.statusCode,
            data: res.data,
            message: "真实用户进度获取成功",
            userId: userData.userId,
          });
        },
        fail: (err) => {
          console.log("❌ 真实用户游戏进度获取失败:", err);
          resolve({
            status: "error",
            error: err,
            errorMsg: err.errMsg,
            userId: userData.userId,
          });
        },
      });
    });
  }

  /**
   * 完整测试套件
   */
  async runFullTest() {
    console.log("🔍 开始完整的服务器测试...");

    const results = {
      serverConnection: await this.testServerConnection(),
      loginEndpoint: await this.testLoginEndpoint(),
      gameProgressEndpoint: await this.testGameProgressEndpoint(),
      realUserTest: await this.testWithRealUserId(),
    };

    this.generateReport(results);
    return results;
  }

  /**
   * 生成测试报告
   */
  generateReport(results) {
    console.log("\n📊 服务器测试报告");
    console.log("=".repeat(60));

    // 服务器连接测试
    const serverConn = results.serverConnection;
    if (serverConn.status === "success") {
      console.log("✅ 服务器连接: 正常");
    } else if (serverConn.status === "error") {
      console.log("❌ 服务器连接: 失败");
      console.log(`   错误信息: ${serverConn.errorMsg}`);
    }

    // 登录接口测试
    const loginTest = results.loginEndpoint;
    if (loginTest.status === "success") {
      console.log("✅ 登录接口: 可访问");
      console.log(`   状态码: ${loginTest.statusCode}`);
    } else if (loginTest.status === "error") {
      console.log("❌ 登录接口: 失败");
      console.log(`   错误信息: ${loginTest.errorMsg}`);
    }

    // 游戏进度接口测试
    const progressTest = results.gameProgressEndpoint;
    if (progressTest.status === "success") {
      console.log("✅ 游戏进度接口: 可访问");
      console.log(`   状态码: ${progressTest.statusCode}`);
    } else if (progressTest.status === "error") {
      console.log("❌ 游戏进度接口: 失败");
      console.log(`   错误信息: ${progressTest.errorMsg}`);
    }

    // 真实用户测试
    const realUserTest = results.realUserTest;
    if (realUserTest.status === "success") {
      console.log("✅ 真实用户测试: 成功");
      console.log(`   用户ID: ${realUserTest.userId}`);
      console.log(`   返回数据:`, realUserTest.data);
    } else if (realUserTest.status === "error") {
      console.log("❌ 真实用户测试: 失败");
      console.log(`   用户ID: ${realUserTest.userId}`);
      console.log(`   错误信息: ${realUserTest.errorMsg}`);
    } else {
      console.log("⚠️  真实用户测试: 跳过（无用户数据）");
    }

    console.log("=".repeat(60));

    // 分析问题
    this.analyzeIssues(results);
  }

  /**
   * 分析可能的问题
   */
  analyzeIssues(results) {
    console.log("\n🔍 问题分析:");

    if (results.serverConnection.status === "error") {
      console.log("💡 建议: 服务器连接失败，请检查:");
      console.log("   1. 服务器是否正常运行");
      console.log("   2. 域名是否在小程序后台配置");
      console.log("   3. 网络连接是否正常");
      return;
    }

    if (results.gameProgressEndpoint.status === "error") {
      console.log("💡 建议: 游戏进度接口失败，可能原因:");
      console.log("   1. 路由配置问题");
      console.log("   2. 数据库连接问题");
      console.log("   3. 权限或CORS问题");
      return;
    }

    if (results.realUserTest.status === "error") {
      console.log("💡 建议: 真实用户测试失败，可能原因:");
      console.log("   1. 用户ID无效或格式错误");
      console.log("   2. 数据库中不存在该用户");
      console.log("   3. 权限验证问题");
      return;
    }

    if (results.realUserTest.status === "skip") {
      console.log("💡 建议: 先完成登录，然后再测试游戏进度获取");
      return;
    }

    console.log("✅ 所有测试通过，服务器运行正常！");
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
  globalObj.ServerTest = ServerTest;

  // 提供便捷的全局测试函数
  globalObj.testServer = async function () {
    const tester = new ServerTest();
    return await tester.runFullTest();
  };

  globalObj.quickServerTest = async function () {
    const tester = new ServerTest();
    const result = await tester.testWithRealUserId();
    console.log("快速服务器测试结果:", result);
    return result;
  };
}

// ES模块导出（用于import方式）
export { ServerTest };
export const testServer = async function () {
  const tester = new ServerTest();
  return await tester.runFullTest();
};

export const quickServerTest = async function () {
  const tester = new ServerTest();
  const result = await tester.testWithRealUserId();
  console.log("快速服务器测试结果:", result);
  return result;
};

console.log("🛠️ 服务器测试工具已加载！");
console.log("使用方法:");
console.log("1. 完整测试: testServer()");
console.log("2. 快速测试: quickServerTest()");
