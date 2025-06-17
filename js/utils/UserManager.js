// 用户管理类
export class UserManager {
    constructor(game) {
        this.game = game;
        this.userInfo = null;
        this.gameProgress = {
            currentChapter: 1,
        };
        this.isLoggedIn = false;
        this.userId = null;
        this.serverUrl = 'http://localhost:3000/api'; // 开发环境使用本地服务器
    }

    // 初始化用户管理器
    init() {
        // 尝试从本地存储加载用户数据
        this.loadUserData();
        
        // 如果已登录且有userId，则从服务器获取最新游戏进度
        if (this.isLoggedIn && this.userId) {
            this.fetchGameProgress();
        }
        // 注意：不再自动登录，需要用户手动点击登录按钮
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
      
        
        // 如果这个章节还没有完成过，则添加到已完成章节列表
        if (!this.gameProgress.completedChapters.includes(chapter - 1) && chapter > 1) {
            this.gameProgress.completedChapters.push(chapter - 1);
        }
        
        // 保存到本地
        this.saveUserData();
        
        // 保存到服务器
        if (this.userId) {
            this.saveProgressToServer();
        }
    }
    
    // 将游戏进度保存到服务器
    saveProgressToServer() {
        if (typeof wx !== 'undefined') {
            const progressData = {
                userId: this.userId,
                currentChapter: this.gameProgress.currentChapter,
            };
            
            wx.request({
                url: `${this.serverUrl}/game/progress`,
                method: 'POST',
                data: progressData,
                success: (res) => {
                    if (res.data && res.data.success) {
                        console.log('游戏进度保存到服务器成功');
                    } else {
                        console.error('保存游戏进度到服务器失败:', res.data);
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
                        
                        // 更新特定属性
                        if (serverProgress.saltProgress) {
                            this.gameProgress.attributes.saltProgress = serverProgress.saltProgress;
                        }
                        if (serverProgress.learningProgress) {
                            this.gameProgress.attributes.learningProgress = serverProgress.learningProgress;
                        }
                        if (serverProgress.governmentRelation) {
                            this.gameProgress.attributes.governmentRelation = serverProgress.governmentRelation;
                        }
                        
                        console.log('从服务器获取游戏进度成功:', this.gameProgress);
                        this.saveUserData();
                    } else {
                        console.error('获取游戏进度失败:', res.data);
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

    // 保存用户数据到本地存储
    saveUserData() {
        const userData = {
            userInfo: this.userInfo,
            familyName: this.familyName,
            gameProgress: this.gameProgress,
            isLoggedIn: this.isLoggedIn
        };
        
        if (typeof wx !== 'undefined') {
            wx.setStorage({
                key: 'huishang_user_data',
                data: JSON.stringify(userData),
                success: () => {
                    console.log('用户数据保存成功');
                },
                fail: (err) => {
                    console.error('保存用户数据失败:', err);
                }
            });
        } else {
            // 开发环境使用localStorage
            try {
                localStorage.setItem('huishang_user_data', JSON.stringify(userData));
                console.log('用户数据保存成功');
            } catch (e) {
                console.error('保存用户数据失败:', e);
            }
        }
    }

    // 从本地存储加载用户数据
    loadUserData() {
        if (typeof wx !== 'undefined') {
            wx.getStorage({
                key: 'huishang_user_data',
                success: (res) => {
                    try {
                        const userData = JSON.parse(res.data);
                        this.userInfo = userData.userInfo;
                        this.familyName = userData.familyName;
                        this.gameProgress = userData.gameProgress;
                        this.isLoggedIn = userData.isLoggedIn;
                        
                        console.log('用户数据加载成功:', userData);
                        
                        // 如果已登录但还没有设置家族姓氏，显示设置界面
                        if (this.isLoggedIn && !this.familyName) {
                            this.showFamilyNameInput();
                        }
                    } catch (e) {
                        console.error('解析用户数据失败:', e);
                    }
                },
                fail: (err) => {
                    console.log('没有找到用户数据或读取失败:', err);
                }
            });
        } else {
            // 开发环境使用localStorage
            try {
                const userData = JSON.parse(localStorage.getItem('huishang_user_data'));
                if (userData) {
                    this.userInfo = userData.userInfo;
                    this.familyName = userData.familyName;
                    this.gameProgress = userData.gameProgress;
                    this.isLoggedIn = userData.isLoggedIn;
                    
                    console.log('用户数据加载成功:', userData);
                    
                    // 如果已登录但还没有设置家族姓氏，显示设置界面
                    if (this.isLoggedIn && !this.familyName) {
                        this.showFamilyNameInput();
                    }
                }
            } catch (e) {
                console.error('解析用户数据失败:', e);
            }
        }
    }
}
