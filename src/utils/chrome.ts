interface TabInfo {
  url: string;
  title: string;
}

export const formatPageTitle = (url: string, pageTitle: string): string => {
  try {
    // Extract the website name from the URL
    const hostname = new URL(url).hostname;
    const websiteName = hostname
      .replace(/^www\./, '') // Remove www.
      .split('.')
      .slice(0, -1) // Remove TLD
      .join('.')
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Clean up the page title
    const cleanPageTitle = pageTitle
      .replace(/\s*[|\-–—]\s*.*$/, '') // Remove website name if it's after a separator
      .trim();

    return `${websiteName} | ${cleanPageTitle}`;
  } catch (error) {
    console.error('Failed to format page title:', error);
    return pageTitle; // Return original title if formatting fails
  }
};

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
      title: formatPageTitle(tab.url, tab.title),
    };
  } catch (error) {
    console.error('Failed to get current tab:', error);
    return null;
  }
}; 