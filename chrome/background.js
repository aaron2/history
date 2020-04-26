chrome.webNavigation.onCommitted.addListener(function(completedDetails) {
  if (completedDetails.frameId > 0) {
    return;
  }
  if (completedDetails.transitionType == "reload") {
    return;
  }
  chrome.tabs.get(completedDetails.tabId, function(tab) {
    chrome.tabs.executeScript(completedDetails.tabId, { file: "gettext.js" }, function(pagedata) {
      fetch("https://_YOUR_HOST_HERE_/history/add", {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: tab.url,
          title: pagedata[0].title,
          text: pagedata[0].text,
          referrer: pagedata[0].referrer,
          transition_type: completedDetails.transitionType,
        }),
      });
    });
  });
});

