export interface PageContent {
  title: string;
  content: string;
  metaDescription?: string;
}

export const extractPageContent = async (_url: string): Promise<PageContent> => {
  try {
    // Query the active tab to get the page content
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.id) {
      throw new Error('No active tab found');
    }

    // Inject and execute content script to extract page content
    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        // Get meta description
        const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        
        // Get main content using various selectors that typically contain the main article content
        const mainSelectors = [
          'article',
          '[role="main"]',
          'main',
          '.main-content',
          '#main-content',
          '.post-content',
          '.article-content',
          '.content'
        ];

        let mainContent = '';
        for (const selector of mainSelectors) {
          const element = document.querySelector(selector);
          if (element) {
            mainContent = element.textContent || '';
            break;
          }
        }

        // If no main content found, try to get the most relevant content
        if (!mainContent) {
          // Remove navigation, header, footer, and sidebar elements
          const elementsToRemove = [
            'nav',
            'header',
            'footer',
            'aside',
            '.nav',
            '.header',
            '.footer',
            '.sidebar',
            '#nav',
            '#header',
            '#footer',
            '#sidebar',
            '[role="navigation"]',
            '[role="banner"]',
            '[role="contentinfo"]',
            '[role="complementary"]'
          ];

          // Clone the body to avoid modifying the actual page
          const body = document.body.cloneNode(true) as HTMLElement;
          
          // Remove unwanted elements
          elementsToRemove.forEach(selector => {
            body.querySelectorAll(selector).forEach(el => el.remove());
          });

          // Get the remaining text content
          mainContent = body.textContent || '';
        }

        // Clean up the content
        mainContent = mainContent
          .replace(/\\s+/g, ' ') // Replace multiple spaces with single space
          .replace(/\\n+/g, '\\n') // Replace multiple newlines with single newline
          .trim();

        return {
          title: document.title,
          content: mainContent,
          metaDescription: metaDesc
        };
      }
    });

    return result.result;
  } catch (error) {
    console.error('Failed to extract page content:', error);
    throw error;
  }
};

export const sendMessageToContentScript = async (_url: string) => {
  // ... existing code ...
}; 