// 创建浮动操作菜单
function createFloatingMenu() {
    const menu = document.createElement('div');
    menu.id = 'quote-floating-menu';
    menu.style.cssText = `
        position: fixed;
        background: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        display: none;
        z-index: 999999;
    `;

    const button = document.createElement('button');
    button.textContent = '生成金句卡片';
    button.style.cssText = `
        background: #4a90e2;
        color: white;
        border: none;
        padding: 4px 8px;
        border-radius: 3px;
        cursor: pointer;
        font-size: 12px;
    `;
    menu.appendChild(button);

    document.body.appendChild(menu);
    return menu;
}

// 显示浮动菜单
function showFloatingMenu(x, y) {
    const menu = document.getElementById('quote-floating-menu') || createFloatingMenu();
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.style.display = 'block';
}

// 隐藏浮动菜单
function hideFloatingMenu() {
    const menu = document.getElementById('quote-floating-menu');
    if (menu) {
        menu.style.display = 'none';
    }
}

// 获取网页内容
function getPageContent() {
    // 获取主要文本内容
    const article = document.querySelector('article');
    const main = document.querySelector('main');
    const content = document.querySelector('.content');
    
    let text = '';
    
    // 按优先级尝试不同的内容区域
    if (article) {
        text = article.innerText;
    } else if (main) {
        text = main.innerText;
    } else if (content) {
        text = content.innerText;
    } else {
        // 如果找不到特定区域，获取body中的所有文本
        const bodyText = document.body.innerText;
        // 移除脚本和样式内容
        text = bodyText.replace(/\{[^}]*\}/g, '')
                      .replace(/\<[^>]*\>/g, '')
                      .trim();
    }
    
    return {
        url: window.location.href,
        title: document.title,
        content: text
    };
}

// 处理选中文本
function handleTextSelection(e) {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const x = e.pageX || (rect.left + window.scrollX);
        const y = e.pageY || (rect.top + window.scrollY);

        showFloatingMenu(x, y);

        const menu = document.getElementById('quote-floating-menu');
        const button = menu.querySelector('button');
        
        // 移除之前的事件监听器
        button.replaceWith(button.cloneNode(true));
        
        // 添加新的事件监听器
        menu.querySelector('button').addEventListener('click', () => {
            chrome.runtime.sendMessage({
                action: 'openPopup',
                text: selectedText
            });
            hideFloatingMenu();
        });
    } else {
        hideFloatingMenu();
    }
}

// 初始化事件监听
document.addEventListener('mouseup', handleTextSelection);
document.addEventListener('click', (e) => {
    const menu = document.getElementById('quote-floating-menu');
    if (menu && !menu.contains(e.target)) {
        hideFloatingMenu();
    }
});

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getPageContent') {
        const pageContent = getPageContent();
        sendResponse(pageContent);
    }
    return true;
});