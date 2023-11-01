import { money_to_time } from './wage_and_time_calculator';

function replaceCurrency(text, wage) {
    let regex = /(\$|€|£|RS|USD|EUR|)\s*\d{1,4}(?:,\d{3})*(?:\.\d{2})?/g;
    let replacementText = money_to_time(100, wage);
    return text.replace(regex, 'foo');
}
function replaceText(wage) {
    let walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    let node;
    while ((node = walker.nextNode())) {
        node.textContent = replaceCurrency(node.textContent, wage);
    }
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.wage !== undefined) {
        replaceText(request.wage);
    } else {
        console.log(request);
    }
});

