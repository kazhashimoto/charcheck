chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.insertCSS({
    target: { tabId: tab.id },
    files: ['charcheck.css']
  });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['charcheck.js']
  });
  chrome.action.onClicked.addListener(
    () => {
      toggleBadgeText();
   }
  );
  toggleBadgeText();

  function toggleBadgeText() {
    chrome.action.getBadgeText({tabId: tab.id})
      .then(result => {
        const state = (result == 'ON')? 'OFF': 'ON';
        chrome.action.setBadgeText({text: state});
      });
  }
});
