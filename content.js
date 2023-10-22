function replaceCurrency(text, time = '***') {
    let regex = /(\$|€|£|RS|USD|EUR|)\s*\d{1,4}(?:,\d{3})*(?:\.\d{2})?/g;
    return text.replace(regex, time);
}
function replaceText(time) {
    let walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    let node;
    while ((node = walker.nextNode())) {
        node.textContent = replaceCurrency(node.textContent, time);
    }
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.time !== undefined) {
        replaceText(request.time);
    } else {
        console.log(request);
    }
});

