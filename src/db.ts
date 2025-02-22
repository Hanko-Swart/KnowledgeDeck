// Database module for handling local storage
// Uses Chrome's storage API for data persistence

import type { Folder } from '@/types/folder';
import type { Note } from '@/types/note';
import type { Bookmark } from '@/types/bookmark';

// Storage keys
const STORAGE_KEYS = {
  FOLDERS: 'folders',
  NOTES: 'notes',
  BOOKMARKS: 'bookmarks',
  SETTINGS: 'settings',
} as const;

// Initialize storage with default values
export async function initializeStorage() {
  const storage = await chrome.storage.local.get(null);
  
  if (!storage[STORAGE_KEYS.FOLDERS]) {
    await chrome.storage.local.set({ [STORAGE_KEYS.FOLDERS]: [] });
  }
  
  if (!storage[STORAGE_KEYS.NOTES]) {
    await chrome.storage.local.set({ [STORAGE_KEYS.NOTES]: [] });
  }
  
  if (!storage[STORAGE_KEYS.BOOKMARKS]) {
    await chrome.storage.local.set({ [STORAGE_KEYS.BOOKMARKS]: [] });
  }
}

// Folder operations
export async function getFolders(): Promise<Folder[]> {
  const storage = await chrome.storage.local.get(STORAGE_KEYS.FOLDERS);
  return storage[STORAGE_KEYS.FOLDERS] || [];
}

export async function saveFolder(folder: Folder): Promise<void> {
  const folders = await getFolders();
  const index = folders.findIndex(f => f.id === folder.id);
  
  if (index >= 0) {
    folders[index] = folder;
  } else {
    folders.push(folder);
  }
  
  await chrome.storage.local.set({ [STORAGE_KEYS.FOLDERS]: folders });
}

export async function deleteFolder(folderId: string): Promise<void> {
  const folders = await getFolders();
  const filteredFolders = folders.filter(f => f.id !== folderId);
  await chrome.storage.local.set({ [STORAGE_KEYS.FOLDERS]: filteredFolders });
}

// Note operations
export async function getNotes(): Promise<Note[]> {
  const storage = await chrome.storage.local.get(STORAGE_KEYS.NOTES);
  return storage[STORAGE_KEYS.NOTES] || [];
}

export async function saveNote(note: Note): Promise<void> {
  const notes = await getNotes();
  const index = notes.findIndex(n => n.id === note.id);
  
  if (index >= 0) {
    notes[index] = note;
  } else {
    notes.push(note);
  }
  
  await chrome.storage.local.set({ [STORAGE_KEYS.NOTES]: notes });
}

export async function deleteNote(noteId: string): Promise<void> {
  const notes = await getNotes();
  const filteredNotes = notes.filter(n => n.id !== noteId);
  await chrome.storage.local.set({ [STORAGE_KEYS.NOTES]: filteredNotes });
}

// Bookmark operations
export async function getBookmarks(): Promise<Bookmark[]> {
  const storage = await chrome.storage.local.get(STORAGE_KEYS.BOOKMARKS);
  return storage[STORAGE_KEYS.BOOKMARKS] || [];
}

export async function saveBookmark(bookmark: Bookmark): Promise<void> {
  const bookmarks = await getBookmarks();
  const index = bookmarks.findIndex(b => b.id === bookmark.id);
  
  if (index >= 0) {
    bookmarks[index] = bookmark;
  } else {
    bookmarks.push(bookmark);
  }
  
  await chrome.storage.local.set({ [STORAGE_KEYS.BOOKMARKS]: bookmarks });
}

export async function deleteBookmark(bookmarkId: string): Promise<void> {
  const bookmarks = await getBookmarks();
  const filteredBookmarks = bookmarks.filter(b => b.id !== bookmarkId);
  await chrome.storage.local.set({ [STORAGE_KEYS.BOOKMARKS]: filteredBookmarks });
}

// Search operations
export async function searchItems(query: string): Promise<(Note | Bookmark)[]> {
  const [notes, bookmarks] = await Promise.all([getNotes(), getBookmarks()]);
  const searchRegex = new RegExp(query, 'i');
  
  const matchedNotes = notes.filter(note =>
    searchRegex.test(note.title) ||
    searchRegex.test(note.content) ||
    note.tags?.some(tag => searchRegex.test(tag))
  );
  
  const matchedBookmarks = bookmarks.filter(bookmark =>
    searchRegex.test(bookmark.title) ||
    searchRegex.test(bookmark.description || '') ||
    searchRegex.test(bookmark.url) ||
    bookmark.tags?.some(tag => searchRegex.test(tag))
  );
  
  return [...matchedNotes, ...matchedBookmarks];
}

// Settings operations
export async function getSettings<T>(): Promise<T> {
  const storage = await chrome.storage.local.get(STORAGE_KEYS.SETTINGS);
  return storage[STORAGE_KEYS.SETTINGS];
}

export async function saveSettings<T>(settings: T): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEYS.SETTINGS]: settings });
}

// Initialize storage when the module is imported
initializeStorage().catch(console.error); 