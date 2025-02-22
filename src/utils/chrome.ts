interface TabInfo {
  url: string;
  title: string;
}

export const getCurrentTab = async (): Promise<TabInfo | null> => {
  if (!chrome?.tabs?.query) {
    return null;
  }

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url || !tab.title) {
      return null;
    }

    return {
      url: tab.url,
      title: tab.title,
    };
  } catch (error) {
    console.error('Failed to get current tab:', error);
    return null;
  }
}; 