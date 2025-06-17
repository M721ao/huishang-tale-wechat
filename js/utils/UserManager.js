// 用户管理类
export class UserManager {
    constructor(game) {
        this.game = game;
        this.userInfo = null;
        this.gameProgress = {
            currentChapter: 1
        };
        this.isLoggedIn = false;
        this.userId = null;
        this.isGuestMode = false; // 游客模式标记
        this.serverUrl = 'http://localhost:3000/api'; // 开发环境使用本地服务器
    }

    // 初始化用户管理器
    init() {
        // 尝试从本地存储加载用户数据
        this.loadUserData();
        
        // 如果已登录且有userId，则从服务器获取最新游戏进度
        if (this.isLoggedIn && this.userId && !this.isGuestMode) {
            this.fetchGameProgress();
        }
        // 注意：不再自动登录，需要用户手动点击登录按钮
    }

    // 检查登录状态
    checkLoginStatus() {
        return {
            isLoggedIn: this.isLoggedIn,
            isGuestMode: this.isGuestMode,
            currentChapter: this.gameProgress.currentChapter
        };
    }
    
    // 启用游客模式
    enableGuestMode() {
        this.isGuestMode = true;
        this.isLoggedIn = true; // 游客模式也视为登录状态，但不会与服务器同步
        this.userInfo = { nickName: '游客玩家' };
        this.saveUserData();
        if (this.game.startMainGame) {
            this.game.startMainGame();
        }
    }
    
    // 手动登录方法，需要由按钮点击触发
    login() {
        if (typeof wx !== 'undefined') {
            // 使用微信用户按钮登录
            wx.getUserProfile({
                desc: '用于完善用户资料', // 声明获取用户信息后的用途，后续会展示在弹窗中
                success: (userInfoRes) => {
                    this.userInfo = userInfoRes.userInfo;
                    
                    // 获取微信登录凭证
                    wx.login({
                        success: (res) => {
                            if (res.code) {
                                console.log('微信登录成功，获取到code:', res.code);
                                // 将code发送到后端服务器换取openid等信息
                                this.loginToServer(res.code);
                            } else {
                                console.error('微信登录失败:', res.errMsg);
                                this.showLoginFailDialog();
                            }
                        },
                        fail: (err) => {
                            console.error('微信登录API调用失败:', err);
                            this.showLoginFailDialog();
                        }
                    });
                },
                fail: (err) => {
                    console.log('用户拒绝授权:', err);
                    this.showLoginFailDialog();
                }
            });
        } else {
            console.log('非微信环境，使用模拟登录');
            // 开发环境下可以设置一个默认用户
            this.userInfo = { nickName: '开发测试用户' };
            this.isLoggedIn = true;
            this.userId = 'dev-user-id';
            this.saveUserData();
        }
    }
    
    // 显示登录失败对话框
    showLoginFailDialog() {
        if (this.game && this.game.dialog) {
            this.game.dialog.show('登录失败，请重试', () => {
                // 可以在这里重新显示登录按钮
            });
        }
    }
    
    // 登录到服务器
    loginToServer(code) {
        if (typeof wx !== 'undefined') {
            wx.request({
                url: `${this.serverUrl}/user/login`,
                method: 'POST',
                data: { code },
                success: (res) => {
                    if (res.data && res.data.success) {
                        this.userId = res.data.userId;
                        this.familyName = res.data.familyName || '';
                        this.isLoggedIn = true;
                        
                        this.saveUserData();
                        
                        // 如果是新用户或没有设置家族姓氏，显示设置界面
                        if (res.data.isNewUser || !this.familyName) {
                            this.showFamilyNameInput();
                        } else {
                            // 获取游戏进度
                            this.fetchGameProgress();
                        }
                    } else {
                        console.error('服务器登录失败:', res.data);
                    }
                },
                fail: (err) => {
                    console.error('服务器请求失败:', err);
                }
            });
        } else {
            // 开发环境模拟
            setTimeout(() => {
                this.getUserInfo();
            }, 500);
        }
    }

    // 获取用户信息
    getUserInfo() {
        if (typeof wx !== 'undefined') {
            // 创建用户信息按钮
            const button = wx.createUserInfoButton({
                type: 'text',
                text: '点击授权获取用户信息',
                style: {
                    left: 10,
                    top: 76,
                    width: 200,
                    height: 40,
                    lineHeight: 40,
                    backgroundColor: '#ff0000',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontSize: 16,
                    borderRadius: 4
                }
            });
            
            button.onTap((res) => {
                if (res.userInfo) {
                    this.userInfo = res.userInfo;
                    this.isLoggedIn = true;
                    button.destroy();
                    
                    // 保存用户信息
                    this.saveUserData();
                    
                    // 如果还没有设置家族姓氏，显示设置界面
                    if (!this.familyName) {
                        this.showFamilyNameInput();
                    }
                } else {
                    console.log('用户拒绝授权');
                }
            });
        }
    }



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
        if (typeof wx !== 'undefined') {
            const progressData = {
                userId: this.userId,
                currentChapter: this.gameProgress.currentChapter
            };
            
            wx.request({
                url: `${this.serverUrl}/game/progress`,
                method: 'POST',
                data: progressData,
                success: (res) => {
                    if (res.data && res.data.success) {
                        console.log('游戏进度保存成功');
                    } else {
                        console.error('保存游戏进度失败:', res.data);
                    }
                },
                fail: (err) => {
                    console.error('服务器请求失败:', err);
                }
            });
        }
    }
    
    // 从服务器获取游戏进度
    fetchGameProgress() {
        if (!this.userId) return;
        
        if (typeof wx !== 'undefined') {
            wx.request({
                url: `${this.serverUrl}/game/progress/${this.userId}`,
                method: 'GET',
                success: (res) => {
                    if (res.data && res.data.success && res.data.progress) {
                        const serverProgress = res.data.progress;
                        
                        // 更新本地游戏进度
                        this.gameProgress.currentChapter = serverProgress.currentChapter;
                        
                        console.log('从服务器获取游戏进度成功:', this.gameProgress);
                        this.saveUserData();
                    } else {
                        console.log('没有找到游戏进度或获取失败');
                    }
                },
                fail: (err) => {
                    console.error('服务器请求失败:', err);
                }
            });
        }
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
            gameProgress: this.gameProgress
        };
        
        if (typeof wx !== 'undefined') {
            wx.setStorageSync('userData', userData);
        } else {
            // 开发环境下使用localStorage
            try {
                localStorage.setItem('userData', JSON.stringify(userData));
            } catch (e) {
                console.error('保存用户数据失败:', e);
            }
        }
    }

    // 从本地加载用户数据
    loadUserData() {
        let userData = null;
        
        if (typeof wx !== 'undefined') {
            userData = wx.getStorageSync('userData');
        } else {
            // 开发环境使用localStorage
            try {
                const dataStr = localStorage.getItem('userData');
                if (dataStr) {
                    userData = JSON.parse(dataStr);
                }
            } catch (e) {
                console.error('解析用户数据失败:', e);
            }
        }
        
        if (userData) {
            this.userInfo = userData.userInfo || null;
            this.isLoggedIn = userData.isLoggedIn || false;
            this.userId = userData.userId || null;
            this.isGuestMode = userData.isGuestMode || false;
            this.gameProgress = userData.gameProgress || { currentChapter: 1 };
            
            console.log('用户数据加载成功:', userData);
        }
    }
}
