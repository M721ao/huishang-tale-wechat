# 腾讯云 COS 配置说明

## 1. 配置文件位置

资源配置文件位于：`js/config/resourceConfig.js`

## 2. 配置步骤

### 第一步：在腾讯云控制台创建 COS 存储桶

1. 登录腾讯云控制台
2. 进入对象存储 COS 服务
3. 创建新的存储桶，记录下存储桶名称和地域

### 第二步：上传游戏资源

上传你的资源文件到 COS 存储桶：

### 第三步：修改配置文件

编辑 `js/config/resourceConfig.js` 文件：

```javascript
// 资源配置文件 - 腾讯云COS配置
class ResourceConfig {
  constructor() {
    // 腾讯云COS配置
    this.cosConfig = {
      // 替换为你的COS存储桶域名
      baseUrl: "https://your-bucket-name.cos.ap-beijing.myqcloud.com",

      // 如果你配置了CDN加速，使用CDN域名（推荐）
      // baseUrl: 'https://your-cdn-domain.com',
    };
  }
  // ... 其他代码保持不变
}
```

## 3. 获取 COS 域名

### 方法 1：使用默认域名

COS 存储桶的默认域名格式为：

```
https://[存储桶名称].cos.[地域].myqcloud.com
```

例如：

- 存储桶名称：`my-game-1234567890`
- 地域：`ap-beijing`
- 完整域名：`https://my-game-1234567890.cos.ap-beijing.myqcloud.com`

### 方法 2：使用 CDN 加速域名（推荐）

1. 在 COS 控制台中为存储桶配置 CDN 加速
2. 获得 CDN 域名，格式通常为：`https://xxxxxxx.file.myqcloud.com`
3. 使用 CDN 域名可以提高访问速度

## 4. 配置示例

### 使用默认域名：

```javascript
baseUrl: 'https://my-game-1234567890.cos.ap-beijing.myqcloud.com',
```

### 使用 CDN 域名：

```javascript
baseUrl: 'https://my-game.example.com',
```

### 使用自定义域名：

```javascript
baseUrl: 'https://cdn.mygame.com',
```

## 5. 权限配置

确保存储桶设置为**公有读私有写**：

1. 在 COS 控制台中选择你的存储桶
2. 进入权限管理 > 存储桶 ACL
3. 设置为公有读私有写，允许游戏访问资源

## 6. CORS 配置（如果需要）

如果遇到跨域问题，在 COS 控制台配置 CORS：

```json
[
  {
    "allowedOrigins": ["*"],
    "allowedMethods": ["GET"],
    "allowedHeaders": ["*"],
    "maxAgeSeconds": 600
  }
]
```

## 7. 测试配置

修改配置后，重新编译并测试游戏：

1. 检查控制台是否有加载错误
2. 确认图片和音频正常显示/播放
3. 如有问题，检查 COS 域名和文件路径是否正确

## 8. 注意事项

- 确保上传的文件路径与代码中的路径完全一致
- 文件名区分大小写
- 推荐使用 CDN 加速以提高加载速度
- 定期检查 COS 存储用量，避免超出免费额度
