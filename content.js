function replaceText() {
    let bodyText = document.body.innerHTML;
    bodyText = bodyText.replace(/x/g, '6969');
    document.body.innerHTML = bodyText;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "replace") {
        replaceText();
    }
});
