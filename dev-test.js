/**
 * 开发环境测试工具
 * 仅用于开发调试，不要在生产环境中引用此文件
 */

// 在开发工具或浏览器环境中运行测试
if (typeof window !== "undefined") {
  // 动态导入测试工具
  import("./js/utils/cosTest.js")
    .then(() => {
      console.log("✅ COS测试工具已加载");
    })
    .catch((err) => {
      console.log("❌ COS测试工具加载失败:", err);
    });

  import("./js/utils/serverTest.js")
    .then(() => {
      console.log("✅ 服务器测试工具已加载");
    })
    .catch((err) => {
      console.log("❌ 服务器测试工具加载失败:", err);
    });

  console.log("🔧 开发测试工具已启动");
  console.log("可用命令:");
  console.log("- testCOS() : 测试COS资源");
  console.log("- quickTestCOS() : 快速测试核心资源");
  console.log("- testServer() : 测试服务器连接");
  console.log("- quickServerTest() : 快速服务器测试");
} else {
  console.log("⚠️ 当前环境不支持测试工具（非浏览器环境）");
}
