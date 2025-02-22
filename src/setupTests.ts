import '@testing-library/jest-dom';
import { vi } from 'vitest';

interface Chrome {
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

declare global {
  interface Window {
    chrome: Chrome;
  }
}

// Mock Chrome Extension API
window.chrome = {
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
} as Chrome; 