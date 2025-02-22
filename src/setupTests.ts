import '@testing-library/jest-dom';
import { expect, vi } from 'vitest';

// Define a minimal subset of Chrome API types that we need for testing
interface ChromeAPI {
  runtime: {
    sendMessage: typeof vi.fn;
    onMessage: {
      addListener: typeof vi.fn;
      removeListener: typeof vi.fn;
    };
  };
  storage: {
    local: {
      get: typeof vi.fn;
      set: typeof vi.fn;
    };
    sync: {
      get: typeof vi.fn;
      set: typeof vi.fn;
    };
  };
  tabs: {
    query: typeof vi.fn;
    sendMessage: typeof vi.fn;
  };
}

// Create mock implementation
const mockChrome: ChromeAPI = {
  runtime: {
    sendMessage: vi.fn(),
    onMessage: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
    },
  },
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
    },
    sync: {
      get: vi.fn(),
      set: vi.fn(),
    },
  },
  tabs: {
    query: vi.fn(),
    sendMessage: vi.fn(),
  },
};

// Extend window interface
declare global {
  interface Window {
    chrome: ChromeAPI;
  }
}

// Set up mock
window.chrome = mockChrome;

// Export for use in tests
export { mockChrome }; 