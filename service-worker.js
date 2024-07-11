chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, {action: 'captureAndCrop'});
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'takeScreenshot') {
    chrome.tabs.captureVisibleTab(null, {format: 'png'}, (dataUrl) => {
      chrome.storage.local.set({screenshot: dataUrl}, () => {
        sendResponse({success: true});
      });
    });
    return true; // Indicates we will send a response asynchronously
  }
});