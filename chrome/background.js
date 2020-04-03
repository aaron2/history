chrome.webNavigation.onCommitted.addListener(function(completedDetails) {
  if (completedDetails.frameId > 0) {
    return;
  }
  if (completedDetails.transitionType == "reload") {
    return;
  }
  chrome.tabs.get(completedDetails.tabId, function(tab) {
    fetch("https://_YOUR_HOST_HERE_/history/add", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: tab.url,
        transition_type: completedDetails.transitionType,
      }),
    });
  });
});
