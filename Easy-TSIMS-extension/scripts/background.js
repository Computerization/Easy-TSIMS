chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { hostEquals: "101.230.1.163" },
        })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});
