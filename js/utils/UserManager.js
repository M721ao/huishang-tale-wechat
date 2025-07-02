// 用户管理类
export class UserManager {
  constructor(game) {
    this.game = game;
    this.userInfo = null;
    this.gameProgress = {
      currentChapter: 0,
    };
    this.isLoggedIn = false;
    this.userId = null;
    this.isGuestMode = false; // 游客模式标记
    this.serverUrl = "https://huishangwuyu.site/api"; // 服务器地址
  }

  // 初始化用户管理器
  init() {
    // 尝试从本地存储加载用户数据
    this.loadUserData();

    // 移除自动获取游戏进度的调用，避免与登录后的进度获取冲突
    // if (this.isLoggedIn && this.userId && !this.isGuestMode) {
    //   this.fetchGameProgress();
    // }
  }

  // 检查登录状态
  checkLoginStatus() {
    return {
      isLoggedIn: this.isLoggedIn,
      isGuestMode: this.isGuestMode,
      currentChapter: this.gameProgress.currentChapter,
    };
  }

  // 启用游客模式
  enableGuestMode() {
    this.isGuestMode = true;
    this.isLoggedIn = true; // 游客模式也视为登录状态，但不会与服务器同步
    this.userInfo = { nickName: "游客玩家" };
    this.saveUserData();

    // 使用标准的游戏开始流程
    if (this.game && this.game.handleGameStart) {
      this.game.handleGameStart();
    }
  }

  // 手动登录方法，需要由按钮点击触发
  login() {
    console.log("开始微信登录");

    // 显示登录提示
    if (typeof wx !== "undefined") {
      wx.showLoading({
        title: "正在登录...",
        mask: true,
      });
    }

    if (typeof wx !== "undefined") {
      // 直接调用微信登录获取code
      wx.login({
        success: (res) => {
          if (res.code) {
            console.log("微信登录成功，获取到code:", res.code);
            // 将code发送到后端服务器
            this.loginToServer(res.code);
          } else {
            console.error("微信登录失败:", res.errMsg);
            wx.hideLoading();
            this.showLoginFailDialog();
          }
        },
        fail: (err) => {
          console.error("微信登录API调用失败:", err);
          wx.hideLoading();
          this.showLoginFailDialog();
        },
      });
    } else {
      console.log("非微信环境，使用模拟登录");
      // 开发环境下可以设置一个默认用户
      this.userInfo = { nickName: "开发测试用户" };
      this.isLoggedIn = true;
      this.userId = "dev-user-id";
      this.saveUserData();

      // 开发环境也要获取游戏进度并开始游戏
      this.fetchGameProgressAndStartGame();
    }
  }

  // 显示登录失败对话框
  showLoginFailDialog() {
    if (this.game && this.game.dialog) {
      this.game.dialog.show("登录失败，请重试", () => {
        // 可以在这里重新显示登录按钮
      });
    }
  }

  // 登录到服务器
  loginToServer(code) {
    console.log("开始服务器登录，code:", code);
    if (typeof wx !== "undefined") {
      wx.request({
        url: `${this.serverUrl}/user/login`,
        method: "POST",
        data: { code },
        header: {
          "content-type": "application/json",
        },
        success: (res) => {
          console.log("服务器响应:", res);

          // 隐藏loading
          wx.hideLoading();

          if (res.statusCode === 200 && res.data && res.data.success) {
            console.log("登录成功:", res.data);
            this.userId = res.data.userId;
            this.isLoggedIn = true;
            this.isNewUser = res.data.isNewUser;

            this.saveUserData();

            // 显示登录成功提示
            wx.showToast({
              title: "登录成功",
              icon: "success",
              duration: 1500,
            });

            // 先获取游戏进度，然后再开始游戏
            this.fetchGameProgressAndStartGameWithDelay();
          } else {
            console.error("服务器登录失败:", res);
            this.showLoginFailDialog();
          }
        },
        fail: (err) => {
          console.error("服务器请求失败:", err);
          wx.hideLoading();
          this.showLoginFailDialog();
        },
      });
    } else {
      // 开发环境模拟
      console.log("开发环境模拟登录");
      this.isLoggedIn = true;
      this.userId = "dev-user-id";
      this.saveUserData();

      // 开发环境也要获取游戏进度并开始游戏
      this.fetchGameProgressAndStartGame();
    }
  }

  // 获取用户信息
  // getUserInfo() {
  //   if (typeof wx !== "undefined") {
  //     // 创建用户信息按钮
  //     const button = wx.createUserInfoButton({
  //       type: "text",
  //       text: "点击授权获取用户信息",
  //       style: {
  //         left: 10,
  //         top: 76,
  //         width: 200,
  //         height: 40,
  //         lineHeight: 40,
  //         backgroundColor: "#ff0000",
  //         color: "#ffffff",
  //         textAlign: "center",
  //         fontSize: 16,
  //         borderRadius: 4,
  //       },
  //     });

  //     button.onTap((res) => {
  //       if (res.userInfo) {
  //         this.userInfo = res.userInfo;
  //         this.isLoggedIn = true;
  //         button.destroy();

  //         // 保存用户信息
  //         this.saveUserData();
  //       } else {
  //         console.log("用户拒绝授权");
  //       }
  //     });
  //   }
  // }

  // 保存游戏进度
  saveGameProgress(chapter) {
    this.gameProgress.currentChapter = chapter;

    // 保存到本地
    this.saveUserData();

    // 只有非游客模式才保存到服务器
    if (this.userId && !this.isGuestMode) {
      this.saveProgressToServer();
    }
  }

  // 将游戏进度保存到服务器
  saveProgressToServer() {
    if (typeof wx !== "undefined") {
      const progressData = {
        userId: this.userId,
        currentChapter: this.gameProgress.currentChapter,
      };

      console.log("保存游戏进度到服务器:", progressData);

      wx.request({
        url: `${this.serverUrl}/game/progress`,
        method: "POST",
        data: progressData,
        header: {
          "content-type": "application/json",
        },
        success: (res) => {
          console.log("保存游戏进度响应:", res);
          if (res.statusCode === 200 && res.data && res.data.success) {
            console.log("游戏进度保存成功");
          } else {
            console.error("保存游戏进度失败:", res.data);
            // 显示错误提示
            wx.showToast({
              title: "进度保存失败",
              icon: "none",
              duration: 2000,
            });
          }
        },
        fail: (err) => {
          console.error("服务器请求失败:", err);
          wx.showToast({
            title: "网络错误",
            icon: "none",
            duration: 2000,
          });
        },
      });
    }
  }

  // 从服务器获取游戏进度
  fetchGameProgress() {
    if (!this.userId) return Promise.resolve();

    return new Promise((resolve, reject) => {
      if (typeof wx !== "undefined") {
        wx.request({
          url: `${this.serverUrl}/game/progress/${this.userId}`,
          method: "GET",
          success: (res) => {
            console.log("服务器返回的游戏进度响应:", res);
            console.log("状态码:", res.statusCode);
            console.log("响应数据:", res.data);

            // 处理304状态码（缓存有效）和200状态码
            if (res.statusCode === 200 || res.statusCode === 304) {
              if (res.data && res.data.success && res.data.progress) {
                const serverProgress = res.data.progress;
                console.log("服务器进度数据:", serverProgress);
                console.log("服务器章节:", serverProgress.currentChapter);

                // 检查服务器进度是否为空对象或无效
                if (
                  serverProgress &&
                  typeof serverProgress.currentChapter === "number"
                ) {
                  // 更新本地游戏进度
                  this.gameProgress.currentChapter =
                    serverProgress.currentChapter;
                  console.log("更新后的本地进度:", this.gameProgress);
                  this.saveUserData();
                } else {
                  console.log("服务器返回的进度数据无效，保持本地进度");
                }

                // 进度同步完成
                console.log("进度同步完成");
                resolve();
              } else if (res.statusCode === 304) {
                // 304状态码表示数据未修改，使用本地缓存
                console.log("服务器返回304，使用本地缓存的游戏进度");
                resolve();
              } else {
                console.log("没有找到游戏进度或获取失败，使用默认进度");
                // 如果没有找到进度，确保有一个默认值
                if (this.gameProgress.currentChapter === undefined) {
                  this.gameProgress.currentChapter = 0;
                }
                resolve();
              }
            } else {
              console.error("服务器返回错误状态码:", res.statusCode);
              reject(new Error(`服务器错误: ${res.statusCode}`));
            }
          },
          fail: (err) => {
            console.error("服务器请求失败:", err);
            reject(err);
          },
        });
      } else {
        // 开发环境下直接使用本地进度
        console.log("开发环境：使用本地游戏进度");
        console.log("当前本地进度:", this.gameProgress);
        resolve();
      }
    });
  }

  // 获取游戏进度
  getGameProgress() {
    return this.gameProgress;
  }

  // 保存用户数据到本地
  saveUserData() {
    const userData = {
      userInfo: this.userInfo,
      isLoggedIn: this.isLoggedIn,
      userId: this.userId,
      isGuestMode: this.isGuestMode,
      gameProgress: this.gameProgress,
    };

    if (typeof wx !== "undefined") {
      try {
        wx.setStorageSync("userData", userData);
        console.log("用户数据保存成功");
      } catch (error) {
        console.error("保存用户数据失败:", error);
        // 不抛出错误，只记录日志
      }
    } else {
      // 开发环境下使用localStorage
      try {
        localStorage.setItem("userData", JSON.stringify(userData));
        console.log("用户数据保存成功(开发环境)");
      } catch (e) {
        console.error("保存用户数据失败:", e);
      }
    }
  }

  // 从本地加载用户数据
  loadUserData() {
    let userData = null;

    if (typeof wx !== "undefined") {
      try {
        userData = wx.getStorageSync("userData");
        console.log("用户数据读取成功");
      } catch (error) {
        console.error("读取用户数据失败:", error);
        userData = null;
      }
    } else {
      // 开发环境使用localStorage
      try {
        const dataStr = localStorage.getItem("userData");
        if (dataStr) {
          userData = JSON.parse(dataStr);
          console.log("用户数据读取成功(开发环境)");
        }
      } catch (e) {
        console.error("解析用户数据失败:", e);
        userData = null;
      }
    }

    console.log("从本地存储加载的原始数据:", userData);

    if (userData) {
      this.userInfo = userData.userInfo || null;
      this.isLoggedIn = userData.isLoggedIn || false;
      this.userId = userData.userId || null;
      this.isGuestMode = userData.isGuestMode || false;
      this.gameProgress = userData.gameProgress || { currentChapter: 0 }; // 默认从引子开始

      console.log("用户数据加载成功:");
      console.log("- isLoggedIn:", this.isLoggedIn);
      console.log("- userId:", this.userId);
      console.log("- isGuestMode:", this.isGuestMode);
      console.log("- gameProgress:", this.gameProgress);
    } else {
      console.log("没有找到本地用户数据，使用默认值");
      // 确保有默认的游戏进度
      this.gameProgress = { currentChapter: 0 };
    }
  }

  // 先获取游戏进度，然后再开始游戏
  fetchGameProgressAndStartGame() {
    console.log("开始获取游戏进度并启动游戏");
    this.fetchGameProgress()
      .then(() => {
        console.log("游戏进度获取完成，启动游戏");
        if (this.game && this.game.onLoginSuccess) {
          this.game.onLoginSuccess();
        }
      })
      .catch((err) => {
        console.error("获取游戏进度失败:", err);
        // 即使获取进度失败，也要继续游戏
        if (this.game && this.game.onLoginSuccess) {
          this.game.onLoginSuccess();
        }
      });
  }

  // 登录成功后延迟启动游戏（用于显示toast）
  fetchGameProgressAndStartGameWithDelay() {
    console.log("登录成功，延迟启动游戏");
    // 显示延迟的登录成功提示
    setTimeout(() => {
      this.fetchGameProgressAndStartGame();
    }, 1500); // 等待toast显示完毕
  }
}
