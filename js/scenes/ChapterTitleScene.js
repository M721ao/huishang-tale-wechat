export class ChapterTitleScene {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.title = '';
        this.startTime = 0;
        this.duration = 3000; // 3秒后自动消失
        this.onFinishCallback = null;
    }

    // 设置章节标题
    setTitle(title) {
        this.title = title;
        this.startTime = Date.now();
    }

    // 设置完成回调
    setOnFinish(callback) {
        this.onFinishCallback = callback;
    }

    // 绘制场景
    draw() {
        const { ctx, width, height, title } = this;
        
        // 清空画布
        ctx.clearRect(0, 0, width, height);
        
        // 绘制黑色背景
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);
        
        // 设置文字样式
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 3;
        ctx.font = 'bold 36px FangSong';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // 绘制标题
        ctx.strokeText(title, width/2, height/2);
        ctx.fillText(title, width/2, height/2);
        
        ctx.restore();
        
        // 检查是否需要结束
        if (Date.now() - this.startTime >= this.duration) {
            if (this.onFinishCallback) {
                this.onFinishCallback();
            }
        }
    }
}
