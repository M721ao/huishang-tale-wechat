import { getUIHelper } from '../utils/UIHelper.js'

export class ChapterTitleScene {
    constructor(ctx, width, height) {
        this.ctx = ctx
        this.width = width
        this.height = height
        
        // 获取UI辅助工具
        this.uiHelper = getUIHelper();
        this.title = '';
        this.subtitle = '';
        this.startTime = 0;
        this.duration = 3000; // 3秒后自动消失
        this.onFinishCallback = null;
        
        // 加载背景图片
        this.backgroundImage = wx.createImage();
        this.backgroundImage.onload = () => {
            this.draw();
        }
    }

    // 设置章节标题
    setTitle(title) {
        this.title = title;
        // 设置副标题
        const chapterNum = parseInt(title.match(/\d+/)[0]);
        switch(chapterNum) {
            case 1:
                this.subtitle = '徽商缘起';
                this.backgroundImage.src = 'images/backgrounds/chapter1/cha1-1.png';
                break;
            case 2:
                this.subtitle = '盐引之争';
                this.backgroundImage.src = 'images/backgrounds/chapter2/cha2-1.png';
                break;
            case 3:
                this.subtitle = '诗书商道';
                this.backgroundImage.src = 'images/backgrounds/chapter2/cha2-1.png';
                break;
            case 4:
                this.subtitle = '无徽不成镇';
                this.backgroundImage.src = 'images/backgrounds/chapter2/cha2-1.png';
                break;
            case 5:
                this.subtitle = '风雨飘摇';
                this.backgroundImage.src = 'images/backgrounds/chapter2/cha2-1.png';
                break;
            case 6:
                this.subtitle = '红顶落幕';
                this.backgroundImage.src = 'images/backgrounds/chapter2/cha2-1.png';
                break;
                case 7:
                    this.subtitle = '现代徽商';
                    this.backgroundImage.src = 'images/backgrounds/chapter2/cha2-1.png';
                    break;
            default:
                this.subtitle = '';
        }
        this.startTime = Date.now();
    }

    // 设置完成回调
    setOnFinish(callback) {
        this.onFinishCallback = callback;
    }

    // 绘制场景
    draw() {
        const { ctx, width, height, title, subtitle } = this;
        
        // 清空画布
        ctx.clearRect(0, 0, width, height);
        
        // 绘制背景
        if (this.backgroundImage) {
            ctx.drawImage(this.backgroundImage, 0, 0, width, height);
        }
        
        // 添加半透明黑色遮罩
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, width, height);
        
        ctx.save();
        
        // 绘制装饰线条
        const lineWidth = 200;
        const lineY = height * 0.4;
        

        
        // 绘制标题
        ctx.fillStyle = '#F4ECE4';
        ctx.font = this.uiHelper.getFont(28, 'FangSong', true);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText("--"+title+"--", width/2, height * 0.4);
        
        // 绘制副标题
        if (subtitle) {
            ctx.font = this.uiHelper.getFont(40, 'FangSong');
            ctx.fillText(subtitle, width/2, height * 0.5);
        }
        
        ctx.restore();
        
        // 检查是否需要结束
        if (Date.now() - this.startTime >= this.duration) {
            if (this.onFinishCallback) {
                this.onFinishCallback();
            }
        }
    }
}
