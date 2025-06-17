// UI辅助工具类
export class UIHelper {
    constructor() {
        // 获取系统信息
        this.systemInfo = wx.getSystemInfoSync()
        this.screenWidth = this.systemInfo.windowWidth
        this.screenHeight = this.systemInfo.windowHeight
        this.designWidth = 375 // 设计基准宽度，通常是iPhone 6的宽度
        this.pixelRatio = this.systemInfo.pixelRatio || 2
        
        console.log('屏幕信息:', this.systemInfo)
    }
    
    // 将rpx转换为px
    rpxToPx(rpx) {
        // rpx 是微信小程序中的响应式像素单位
        // 规则是屏幕宽度/750 = 单位rpx的px值
        const scale = this.screenWidth / 750
        return rpx * scale
    }
    
    // 根据屏幕宽度计算自适应字体大小
    getFontSize(baseSize) {
        // baseSize是基准字体大小（通常基于设计稿）
        const scale = this.screenWidth / this.designWidth
        return Math.round(baseSize * scale)
    }
    
    // 获取带字体大小的完整字体样式
    getFont(size, fontFamily = 'FangSong', bold = false) {
        const fontSize = this.getFontSize(size)
        const boldText = bold ? 'bold ' : ''
        return `${boldText}${fontSize}px ${fontFamily}`
    }
    
    // 获取自适应的行高
    getLineHeight(baseLineHeight) {
        const scale = this.screenWidth / this.designWidth
        return Math.round(baseLineHeight * scale)
    }
    
    // 获取自适应的元素尺寸（宽度、高度等）
    getAdaptiveSize(baseSize) {
        const scale = this.screenWidth / this.designWidth
        return Math.round(baseSize * scale)
    }
    
    // 获取自适应的边距或间距
    getAdaptiveMargin(baseMargin) {
        const scale = this.screenWidth / this.designWidth
        return Math.round(baseMargin * scale)
    }
}

// 创建全局单例实例
let instance = null

export function getUIHelper() {
    if (!instance) {
        instance = new UIHelper()
    }
    return instance
}
