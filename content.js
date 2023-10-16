function replaceCurrency(text, placeholder = '***') {
    let regex = /(\$|€|£|RS|USD|EUR|)\s*\d{1,4}(?:,\d{3})*(?:\.\d{2})?/g;
    return text.replace(regex, placeholder);
  }
  function replaceText() {
    let walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    let node;
    while((node = walker.nextNode())) {
      
      node.textContent = replaceCurrency(node.textContent);
    }
  }
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "replace") {
      replaceText();
    }
  });