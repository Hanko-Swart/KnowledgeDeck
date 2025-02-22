import { db } from './db';
import { generateId } from '@/utils/id';

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description: string;
  folderId: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  type: 'bookmark';
  screenshot?: string; // Base64 encoded screenshot
}

export interface CreateBookmarkData {
  title: string;
  url: string;
  description: string;
  folderId: string;
  tags: string[];
  screenshot?: string;
}

// Function to resize a base64 image
const resizeScreenshot = async (base64Image: string, maxWidth: number = 1280): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      // Set canvas dimensions and draw resized image
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to base64 with reduced quality
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = base64Image;
  });
};

// Function to capture screenshot of the current tab
export const captureScreenshot = async (): Promise<string> => {
  try {
    // Get the current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.id) throw new Error('No active tab found');

    // Get the current window ID
    const currentWindow = await chrome.windows.getCurrent();
    if (!currentWindow.id) throw new Error('No window ID found');

    // Capture the visible area of the tab
    const screenshot = await chrome.tabs.captureVisibleTab(currentWindow.id, {
      format: 'png',
      quality: 80
    });

    // Resize the screenshot before returning
    return await resizeScreenshot(screenshot);
  } catch (error) {
    console.error('Failed to capture screenshot:', error);
    throw error;
  }
};

export const saveBookmark = async (data: CreateBookmarkData): Promise<Bookmark> => {
  const now = Date.now();
  
  // If no screenshot is provided, try to capture one
  let screenshot = data.screenshot;
  if (!screenshot) {
    try {
      screenshot = await captureScreenshot();
    } catch (error) {
      console.warn('Failed to capture screenshot:', error);
      // Continue without screenshot if capture fails
    }
  }

  const bookmark: Bookmark = {
    id: generateId(),
    ...data,
    screenshot,
    createdAt: now,
    updatedAt: now,
    type: 'bookmark',
  };

  await db.bookmarks.add(bookmark);
  return bookmark;
};

export const getBookmark = async (id: string): Promise<Bookmark | undefined> => {
  return db.bookmarks.get(id);
};

export const updateBookmark = async (id: string, data: Partial<CreateBookmarkData>): Promise<void> => {
  await db.bookmarks.update(id, {
    ...data,
    updatedAt: Date.now(),
  });
};

export const deleteBookmark = async (id: string): Promise<void> => {
  await db.bookmarks.delete(id);
};

export const getBookmarksByFolder = async (folderId: string): Promise<Bookmark[]> => {
  return db.bookmarks.where('folderId').equals(folderId).toArray();
};

export const getAllBookmarks = async (): Promise<Bookmark[]> => {
  return db.bookmarks.toArray();
};

export const searchBookmarks = async (query: string): Promise<Bookmark[]> => {
  const normalizedQuery = query.toLowerCase();
  return db.bookmarks
    .filter(bookmark => 
      bookmark.title.toLowerCase().includes(normalizedQuery) ||
      bookmark.description.toLowerCase().includes(normalizedQuery) ||
      bookmark.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
    )
    .toArray();
}; 