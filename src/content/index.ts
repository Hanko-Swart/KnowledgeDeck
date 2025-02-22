console.log('KnowledgeDeck content script loaded');

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Content script received message:', message);
  sendResponse({ status: 'received by content script' });
}); 