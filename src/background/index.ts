import { db } from '@/storage/db';

// Listen for extension installation or update
chrome.runtime.onInstalled.addListener(async () => {
  console.log('KnowledgeDeck extension installed or updated');
  
  try {
    // Initialize the database
    await db.open();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
  
  // Enable the side panel by default
  await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

// Handle extension icon click
chrome.action.onClicked.addListener(async (tab) => {
  // The side panel will be shown automatically due to setPanelBehavior
  console.log('Extension icon clicked, opening side panel');
});

// Listen for messages from the popup/content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message);
  // TODO: Handle different message types
  sendResponse({ status: 'received' });
}); 