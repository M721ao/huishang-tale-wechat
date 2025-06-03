export class StoryScene {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        
        // 文字显示区域设置
        this.textAreaHeight = height * 0.3;
        this.textAreaY = height - this.textAreaHeight;
        this.padding = 20;
        
        // 文字动画设置
        this.currentText = '';
        this.targetText = '';
        this.textSpeed = 2; // 每帧显示的字符数
        this.isTyping = false;
        
        // 当前剧情进度
        this.currentScriptIndex = 0;
        this.currentScript = null;
        
        // 角色名称显示区域
        this.nameBoxWidth = 150;
        this.nameBoxHeight = 40;
        this.nameBoxX = this.padding;
        this.nameBoxY = this.textAreaY - this.nameBoxHeight;
        
        // 回调函数
        this.onFinishCallback = null;
    }

    // 加载剧情脚本
    loadScript(script) {
        this.currentScript = script;
        this.currentScriptIndex = 0;
        this.showNextDialogue();
    }

    // 设置结束回调
    setOnFinish(callback) {
        this.onFinishCallback = callback;
    }

    // 显示下一段对话
    showNextDialogue() {
        if (!this.currentScript || this.currentScriptIndex >= this.currentScript.length) {
            if (this.onFinishCallback) {
                this.onFinishCallback();
            }
            return;
        }

        const dialogue = this.currentScript[this.currentScriptIndex];
        this.targetText = dialogue.text;
        this.currentText = '';
        this.isTyping = true;
        this.currentCharacter = dialogue.character;
        this.currentBackground = dialogue.background;
        this.currentPosition = dialogue.position || 'center';
        
        // 加载背景图
        if (dialogue.background) {
            const img = wx.createImage()
            img.onload = () => {
                this.backgroundImage = img
            }
            img.src = dialogue.background
        }
        
        // 加载立绘如果有的话
        if (dialogue.character && dialogue.characterImage) {
            this.characterImage = wx.createImage();
            this.characterImage.src = dialogue.characterImage;
        }
    }

    // 处理点击事件
    handleTap() {
        if (this.isTyping) {
            // 如果正在打字，则直接显示完整文本
            this.currentText = this.targetText;
            this.isTyping = false;
        } else {
            // 否则显示下一段对话
            this.currentScriptIndex++;
            this.showNextDialogue();
        }
    }

    // 更新文字动画
    update() {
        if (this.isTyping && this.currentText !== this.targetText) {
            const nextCharCount = Math.min(
                this.textSpeed,
                this.targetText.length - this.currentText.length
            );
            this.currentText += this.targetText.substr(
                this.currentText.length,
                nextCharCount
            );
            
            if (this.currentText === this.targetText) {
                this.isTyping = false;
            }
        }
    }

    // 绘制场景
    draw() {
        const { ctx, width, height } = this;
        
        // 清空画布
        ctx.clearRect(0, 0, width, height);
        
        // 绘制背景
        if (this.backgroundImage) {
            ctx.drawImage(this.backgroundImage, 0, 0, width, height)
        } else {
            // 默认背景
            ctx.fillStyle = '#000000'
            ctx.fillRect(0, 0, width, height)
        }
        
        // 绘制立绘
        if (this.characterImage) {
            const charWidth = height * 0.8;
            const charHeight = height * 0.8;
            let charX = 0;
            
            switch (this.currentPosition) {
                case 'left':
                    charX = -charWidth * 0.3;
                    break;
                case 'right':
                    charX = width - charWidth * 0.7;
                    break;
                default: // center
                    charX = (width - charWidth) / 2;
            }
            
            ctx.drawImage(this.characterImage, charX, height - charHeight, charWidth, charHeight);
        }
        
        // 绘制文字背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, this.textAreaY, width, this.textAreaHeight);
        
        // 绘制角色名称框
        if (this.currentCharacter) {
            ctx.fillStyle = 'rgba(139, 69, 19, 0.9)';
            ctx.fillRect(
                this.nameBoxX,
                this.nameBoxY,
                this.nameBoxWidth,
                this.nameBoxHeight
            );
            
            ctx.fillStyle = '#F4ECCB';
            ctx.font = 'bold 20px FangSong';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
                this.currentCharacter,
                this.nameBoxX + this.nameBoxWidth / 2,
                this.nameBoxY + this.nameBoxHeight / 2
            );
        }
        
        // 绘制对话文字
        ctx.textAlign = 'left'
        ctx.textBaseline = 'top'
        this.drawWrappedText(
            this.currentText,
            this.padding + 20,
            this.textAreaY + this.padding,
            width - (this.padding + 20) * 2
        )
    }

    // 绘制自动换行文本
    drawWrappedText(text, x, y, maxWidth) {
        const { ctx } = this
        const words = text.split('') // 按字符分割
        let line = ''
        let lineHeight = 35 // 增加行高
        let currentY = y
        
        ctx.font = '24px FangSong' // 增大字号
        
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i]
            const metrics = ctx.measureText(testLine)
            
            // 每15个字符强制换行
            if ((metrics.width > maxWidth && i > 0) || (i > 0 && i % 15 === 0)) {
                ctx.strokeStyle = '#000000'
                ctx.lineWidth = 3
                ctx.strokeText(line, x, currentY)
                ctx.fillStyle = '#F4ECE4'
                ctx.fillText(line, x, currentY)
                
                line = words[i]
                currentY += lineHeight
            } else {
                line = testLine
            }
        }
        
        // 绘制最后一行
        if (line) {
            ctx.strokeStyle = '#000000'
            ctx.lineWidth = 3
            ctx.strokeText(line, x, currentY)
            ctx.fillStyle = '#F4ECE4'
            ctx.fillText(line, x, currentY)
        }
    }
}
