chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: replaceText
  });
});

function replaceText() {
  let bodyText = document.body.innerHTML;
  bodyText = bodyText.replace(/x/g, '6969');
  document.body.innerHTML = bodyText;
}
