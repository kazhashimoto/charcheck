chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.removeCSS({
    target: { tabId: tab.id },
    files: ['charcheck.css']
  });
  chrome.scripting.insertCSS({
    target: { tabId: tab.id },
    files: ['charcheck.css']
  });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['charcheck.js']
  });
  toggleBadgeText();

  async function toggleBadgeText() {
    const badge = await chrome.action.getBadgeText({tabId: tab.id});
    const state = (badge === 'ON')? 'OFF': 'ON';
    chrome.action.setBadgeText({text: state, tabId: tab.id});
  }
});
