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

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getPageContent') {
        const pageContent = getPageContent();
        sendResponse(pageContent);
    }
    return true;
});