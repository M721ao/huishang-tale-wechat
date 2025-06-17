// 事件场景
import { getUIHelper } from '../utils/UIHelper.js'

export class EventScene {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        
        // 获取UI辅助工具
        this.uiHelper = getUIHelper();
        this.currentEvent = null;
        this.cardY = 0;          // 卡片当前Y位置
        this.startY = 0;         // 触摸开始Y位置
        this.isDragging = false;
        this.choiceSelected = false;
        
        // 卡片尺寸和位置
        this.cardWidth = width * 0.9;
        this.cardHeight = height * 0.7;
        this.cardX = (width - this.cardWidth) / 2;
        this.baseCardY = height * 0.15;
        
        // 选项按钮尺寸
        this.buttonHeight = 60;
        this.buttonSpacing = 20;
        
        // 加载通用资源
        this.backgroundImage = wx.createImage();
        this.backgroundImage.src = 'images/event_bg.png';
    }

    // 设置当前事件
    setEvent(event) {
        this.currentEvent = event;
        this.cardY = this.baseCardY;
        this.choiceSelected = false;
        
        // 加载事件图片
        if (event.image) {
            this.eventImage = wx.createImage();
            this.eventImage.src = event.image;
        }
    }

    // 处理触摸开始
    handleTouchStart(e) {
        if (this.choiceSelected) return;
        
        const touch = e.touches[0];
        this.startY = touch.clientY;
        this.isDragging = true;
    }

    // 处理触摸移动
    handleTouchMove(e) {
        if (!this.isDragging || this.choiceSelected) return;
        
        const touch = e.touches[0];
        const deltaY = touch.clientY - this.startY;
        this.cardY = Math.max(
            this.baseCardY - 100,
            Math.min(this.baseCardY + 100, this.baseCardY + deltaY)
        );
    }

    // 处理触摸结束
    handleTouchEnd(e) {
        if (!this.isDragging || this.choiceSelected) return;
        
        this.isDragging = false;
        const deltaY = this.cardY - this.baseCardY;
        
        // 如果移动距离足够大，触发选择
        if (Math.abs(deltaY) > 50) {
            this.choiceSelected = true;
            const choiceIndex = deltaY > 0 ? 0 : 1;
            this.onChoice(choiceIndex);
        } else {
            // 否则回到原位
            this.cardY = this.baseCardY;
        }
    }

    // 绘制事件卡片
    drawEventCard() {
        const { ctx, currentEvent, cardX, cardY, cardWidth, cardHeight } = this;
        
        // 绘制卡片背景
        ctx.save();
        ctx.fillStyle = 'rgba(244, 236, 203, 0.95)';
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        this.drawRoundRect(cardX, cardY, cardWidth, cardHeight, 15);
        ctx.fill();
        ctx.stroke();
        
        // 绘制事件图片
        if (this.eventImage) {
            const imgHeight = cardHeight * 0.4;
            ctx.drawImage(
                this.eventImage,
                cardX,
                cardY,
                cardWidth,
                imgHeight
            );
        }
        
        // 绘制标题
        ctx.fillStyle = '#5C3317';
        ctx.font = this.uiHelper.getFont(28, 'FangSong', true);
        ctx.textAlign = 'center';
        ctx.fillText(
            currentEvent.title,
            this.width / 2,
            cardY + cardHeight * 0.5
        );
        
        // 绘制描述文本
        ctx.font = this.uiHelper.getFont(20, 'FangSong');
        this.drawWrappedText(
            currentEvent.description,
            this.width / 2,
            cardY + cardHeight * 0.6,
            cardWidth - 40
        );
        
        // 绘制选项提示
        ctx.font = this.uiHelper.getFont(16, 'FangSong');
        ctx.fillStyle = 'rgba(92, 51, 23, 0.6)';
        ctx.fillText(
            '上滑：' + currentEvent.choices[0].text,
            this.width / 2,
            cardY + cardHeight - 50
        );
        ctx.fillText(
            '下滑：' + currentEvent.choices[1].text,
            this.width / 2,
            cardY + cardHeight - 25
        );
        
        ctx.restore();
    }

    // 绘制自动换行文本
    drawWrappedText(text, x, y, maxWidth) {
        const { ctx } = this;
        const characters = text.split('');
        let line = '';
        let lineHeight = 25;
        
        for (let i = 0; i < characters.length; i++) {
            const testLine = line + characters[i];
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && i > 0) {
                ctx.fillText(line, x, y);
                line = characters[i];
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y);
    }

    // 绘制圆角矩形
    drawRoundRect(x, y, width, height, radius) {
        const { ctx } = this;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.arcTo(x + width, y, x + width, y + radius, radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
        ctx.lineTo(x + radius, y + height);
        ctx.arcTo(x, y + height, x, y + height - radius, radius);
        ctx.lineTo(x, y + radius);
        ctx.arcTo(x, y, x + radius, y, radius);
        ctx.closePath();
    }

    // 绘制场景
    draw() {
        const { ctx, width, height } = this;
        
        // 清空画布
        ctx.clearRect(0, 0, width, height);
        
        // 绘制背景
        if (this.backgroundImage) {
            ctx.drawImage(this.backgroundImage, 0, 0, width, height);
        }
        
        // 绘制事件卡片
        if (this.currentEvent) {
            this.drawEventCard();
        }
    }

    // 选项选择回调
    onChoice(choiceIndex) {
        // 由外部实现具体逻辑
        console.log('选择了选项:', choiceIndex);
    }
}
