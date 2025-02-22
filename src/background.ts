// Chrome Extension Background Service Worker
// Handles core tasks, AI requests, and data synchronization

// Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('KnowledgeDeck installed');
    // Initialize storage with default settings
    chrome.storage.local.set({
      settings: {
        aiEnabled: true,
        autoTagging: true,
        autoSummarize: true,
        theme: 'light',
      },
    });
  }
});

// Listen for messages from the popup/sidebar
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'GET_CURRENT_TAB':
      getCurrentTab().then(sendResponse);
      return true; // Will respond asynchronously

    case 'PROCESS_AI_REQUEST':
      handleAIRequest(message.data).then(sendResponse);
      return true; // Will respond asynchronously

    default:
      console.log('Unknown message type:', message.type);
  }
});

// Helper function to get the current active tab
async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  return tab;
}

// Handle AI-related requests
async function handleAIRequest(data: any) {
  // TODO: Implement AI processing logic
  // This will integrate with your chosen AI service
  return {
    success: true,
    data: {
      tags: ['example', 'placeholder'],
      summary: 'This is a placeholder summary.',
    },
  };
}

// Export type for TypeScript
export type BackgroundWorker = typeof self; 