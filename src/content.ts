// Content script for web page interaction
// Handles web clipping, snippet capture, and highlighting

let isSelectionMode = false;
let selectedElements: Element[] = [];

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'START_SELECTION':
      startSelectionMode();
      sendResponse({ success: true });
      break;

    case 'STOP_SELECTION':
      stopSelectionMode();
      sendResponse({ success: true });
      break;

    case 'CAPTURE_SCREENSHOT':
      captureVisibleContent().then(sendResponse);
      return true; // Will respond asynchronously

    case 'GET_PAGE_METADATA':
      sendResponse(getPageMetadata());
      break;

    default:
      console.log('Unknown message type:', message.type);
  }
});

// Start selection mode for web clipping
function startSelectionMode() {
  if (isSelectionMode) return;
  isSelectionMode = true;

  // Add hover effect styles
  const style = document.createElement('style');
  style.id = 'knowledge-deck-selection-style';
  style.textContent = `
    .knowledge-deck-hoverable {
      cursor: pointer !important;
      outline: 2px dashed #10656d !important;
    }
    .knowledge-deck-selected {
      background-color: rgba(16, 101, 109, 0.1) !important;
      outline: 2px solid #10656d !important;
    }
  `;
  document.head.appendChild(style);

  // Add hover and click handlers
  document.addEventListener('mouseover', handleHover);
  document.addEventListener('click', handleClick);
}

// Stop selection mode
function stopSelectionMode() {
  if (!isSelectionMode) return;
  isSelectionMode = false;

  // Remove styles and handlers
  document.getElementById('knowledge-deck-selection-style')?.remove();
  document.removeEventListener('mouseover', handleHover);
  document.removeEventListener('click', handleClick);

  // Clear selections
  selectedElements.forEach(el => {
    el.classList.remove('knowledge-deck-selected');
    el.classList.remove('knowledge-deck-hoverable');
  });
  selectedElements = [];
}

// Handle element hover during selection mode
function handleHover(e: MouseEvent) {
  if (!isSelectionMode) return;
  e.stopPropagation();

  const target = e.target as Element;
  if (target.classList.contains('knowledge-deck-hoverable')) {
    target.classList.remove('knowledge-deck-hoverable');
  } else {
    target.classList.add('knowledge-deck-hoverable');
  }
}

// Handle element click during selection mode
function handleClick(e: MouseEvent) {
  if (!isSelectionMode) return;
  e.preventDefault();
  e.stopPropagation();

  const target = e.target as Element;
  if (target.classList.contains('knowledge-deck-selected')) {
    target.classList.remove('knowledge-deck-selected');
    selectedElements = selectedElements.filter(el => el !== target);
  } else {
    target.classList.add('knowledge-deck-selected');
    selectedElements.push(target);
  }
}

// Capture visible content (for bookmarking)
async function captureVisibleContent() {
  // TODO: Implement screenshot capture using chrome.tabs.captureVisibleTab
  return {
    success: true,
    data: {
      screenshot: null,
      selectedContent: selectedElements.map(el => ({
        html: el.outerHTML,
        text: el.textContent,
      })),
    },
  };
}

// Get page metadata
function getPageMetadata() {
  const metadata = {
    title: document.title,
    description: '',
    image: '',
    url: window.location.href,
  };

  // Get meta description
  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) {
    metadata.description = descriptionMeta.getAttribute('content') || '';
  }

  // Get OpenGraph image
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage) {
    metadata.image = ogImage.getAttribute('content') || '';
  }

  return metadata;
}

// Export type for TypeScript
export type ContentScript = typeof self; 