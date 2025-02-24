// 常量定义
const CANVAS_WIDTH = 600; // 画布固定宽度
const FONT_SIZES = {
    small: 16,
    medium: 24,
    large: 32
};

// 预设样式
const PRESET_STYLES = {
    simple: {
        background: '#FFFFFF',
        text: '#000000'
    },
    warm: {
        background: '#F5E6D3',
        text: '#2C1810'
    },
    dark: {
        background: '#2C3E50',
        text: '#ECF0F1'
    }
};

// 获取DOM元素
const quoteText = document.getElementById('quoteText');
const wordCount = document.querySelector('.word-count');
const canvas = document.getElementById('previewCanvas');
const ctx = canvas.getContext('2d');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');

// 当前样式状态
let currentStyle = {
    style: 'simple',
    fontFamily: 'Microsoft YaHei',
    textColor: '#000000',
    bgColor: '#FFFFFF',
    fontSize: 'medium',
    textAlign: 'center'
};

// 初始化事件监听
document.addEventListener('DOMContentLoaded', () => {
    // 文本输入监听
    quoteText.addEventListener('input', () => {
        const length = quoteText.value.length;
        wordCount.textContent = `${length}/200`;
        generateBtn.disabled = length === 0;
    });

    // 样式按钮点击事件
    document.querySelectorAll('.style-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.style-btn.active').classList.remove('active');
            btn.classList.add('active');
            currentStyle.style = btn.dataset.style;
            applyPresetStyle(currentStyle.style);
        });
    });

    // 字体选择事件
    document.getElementById('fontFamily').addEventListener('change', (e) => {
        currentStyle.fontFamily = e.target.value;
    });

    // 颜色选择事件
    document.getElementById('textColor').addEventListener('input', (e) => {
        currentStyle.textColor = e.target.value;
    });

    document.getElementById('bgColor').addEventListener('input', (e) => {
        currentStyle.bgColor = e.target.value;
    });

    // 字体大小按钮事件
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.size-btn.active').classList.remove('active');
            btn.classList.add('active');
            currentStyle.fontSize = btn.dataset.size;
        });
    });

    // 对齐方式按钮事件
    document.querySelectorAll('.align-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.align-btn.active').classList.remove('active');
            btn.classList.add('active');
            currentStyle.textAlign = btn.dataset.align;
        });
    });

    // 生成图片按钮事件
    generateBtn.addEventListener('click', generateImage);

    // 下载按钮事件
    downloadBtn.addEventListener('click', downloadImage);
});

// 应用预设样式
function applyPresetStyle(styleName) {
    const style = PRESET_STYLES[styleName];
    document.getElementById('bgColor').value = style.background;
    document.getElementById('textColor').value = style.text;
    currentStyle.bgColor = style.background;
    currentStyle.textColor = style.text;
}

// 生成图片
function generateImage() {
    const text = quoteText.value;
    if (!text) return;

    // 计算画布高度
    const fontSize = FONT_SIZES[currentStyle.fontSize];
    const padding = fontSize * 2;
    const lineHeight = fontSize * 1.5;
    
    // 设置字体和计算文本换行
    ctx.font = `${fontSize}px ${currentStyle.fontFamily}`;
    const lines = getTextLines(text, CANVAS_WIDTH - padding * 2);
    
    // 设置画布尺寸
    const canvasHeight = padding * 2 + lineHeight * lines.length;
    canvas.width = CANVAS_WIDTH;
    canvas.height = canvasHeight;

    // 绘制背景
    ctx.fillStyle = currentStyle.bgColor;
    ctx.fillRect(0, 0, CANVAS_WIDTH, canvasHeight);

    // 绘制文本
    ctx.fillStyle = currentStyle.textColor;
    ctx.font = `${fontSize}px ${currentStyle.fontFamily}`;
    ctx.textBaseline = 'middle';
    
    lines.forEach((line, index) => {
        const y = padding + lineHeight * index + lineHeight / 2;
        let x;
        
        switch (currentStyle.textAlign) {
            case 'left':
                x = padding;
                ctx.textAlign = 'left';
                break;
            case 'right':
                x = CANVAS_WIDTH - padding;
                ctx.textAlign = 'right';
                break;
            default: // center
                x = CANVAS_WIDTH / 2;
                ctx.textAlign = 'center';
        }

        ctx.fillText(line, x, y);
    });

    downloadBtn.disabled = false;
}

// 文本换行处理
function getTextLines(text, maxWidth) {
    const words = text.split('');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + word).width;
        if (width < maxWidth) {
            currentLine += word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

// 下载图片
function downloadImage() {
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '');
    link.download = `quote_${timestamp}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}