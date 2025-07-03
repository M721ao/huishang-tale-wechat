# COS 403 错误解决方案

## 🚨 问题现象

```
GET https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/bgm.mp3 403 (Forbidden)
GET https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/cover.png 403 (Forbidden)
```

## 🔍 原因分析

403 Forbidden 错误通常由以下原因造成：

1. **COS 存储桶权限设置问题**
2. **小程序域名白名单未配置**
3. **COS 防盗链设置过严**
4. **文件访问权限问题**

## 🛠️ 解决方案

### 1. 检查 COS 存储桶权限设置

#### 步骤 1：进入 COS 控制台

1. 登录腾讯云控制台
2. 进入对象存储 COS 服务
3. 找到你的存储桶：`huishangwuyu-1320493202`

#### 步骤 2：设置存储桶权限

1. 点击存储桶名称进入详情页
2. 进入**权限管理** → **存储桶 ACL**
3. 设置为：**公有读私有写**

#### 步骤 3：检查对象权限

1. 进入**文件列表**
2. 选中有问题的文件（如 bgm.mp3, cover.png 等）
3. 点击**详情** → **权限设置**
4. 确保设置为**公有读**

### 2. 配置小程序域名白名单

#### 微信小程序后台配置：

1. 登录微信小程序后台：https://mp.weixin.qq.com
2. 进入**开发管理** → **开发设置**
3. 在**服务器域名**中添加：

**request 合法域名：**

```
https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com
```

**downloadFile 合法域名：**

```
https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com
```

### 3. 检查 COS 跨域设置（CORS）

1. 在 COS 控制台进入**安全管理** → **跨域访问 CORS 设置**
2. 添加规则：

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "HEAD"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 600
    }
  ]
}
```

### 4. 检查防盗链设置

1. 进入 COS 控制台的**安全管理** → **防盗链设置**
2. 选择**关闭防盗链**或添加微信域名到白名单：
   - `*.qq.com`
   - `*.weixin.qq.com`
   - `servicewechat.com`

### 5. 验证资源访问

在浏览器中直接访问以下链接，确认是否能正常访问：

```
https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/cover.png
https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/bgm.mp3
https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/final.png
```

### 6. 开发工具设置

在微信开发者工具中：

1. 点击右上角**详情**
2. 在**本地设置**中：
   - ✅ 勾选**不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书**
   - ✅ 勾选**不校验 request 域名**

## 🧪 测试步骤

### 1. 浏览器测试

直接在浏览器地址栏输入 COS 链接，看是否能访问

### 2. 开发者工具测试

在控制台输入：

```javascript
wx.request({
  url: "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/cover.png",
  method: "GET",
  success: (res) => console.log("success:", res),
  fail: (err) => console.log("fail:", err),
});
```

### 3. 图片加载测试

```javascript
const img = wx.createImage();
img.onload = () => console.log("图片加载成功");
img.onerror = (err) => console.log("图片加载失败:", err);
img.src =
  "https://huishangwuyu-1320493202.cos.ap-nanjing.myqcloud.com/cover.png";
```

## ⚡ 快速解决方案

如果上述步骤都正确但仍有问题，可以尝试：

### 方案 1：使用 CDN 加速域名

1. 在 COS 控制台为存储桶开启 CDN 加速
2. 获得 CDN 域名（如：`https://xxxxx.file.myqcloud.com`）
3. 将 CDN 域名添加到小程序域名白名单
4. 修改配置文件使用 CDN 域名

### 方案 2：临时测试方案

在开发阶段，可以在 `project.config.json` 中设置：

```json
{
  "setting": {
    "urlCheck": false
  }
}
```

## 📝 配置检查清单

- [ ] COS 存储桶设置为公有读私有写
- [ ] 文件对象权限设置为公有读
- [ ] 小程序后台添加 COS 域名到白名单
- [ ] COS 跨域设置已配置
- [ ] 防盗链设置已关闭或添加白名单
- [ ] 开发者工具关闭域名校验（开发期间）
- [ ] 浏览器能直接访问 COS 链接

## 🆘 如果仍有问题

1. 检查腾讯云账户是否欠费
2. 确认 COS 存储桶地域是否正确
3. 联系腾讯云技术支持
4. 考虑使用其他 CDN 服务
