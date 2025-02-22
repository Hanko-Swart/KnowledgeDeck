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
}

export interface CreateBookmarkData {
  title: string;
  url: string;
  description: string;
  folderId: string;
  tags: string[];
}

export const saveBookmark = async (data: CreateBookmarkData): Promise<Bookmark> => {
  const now = Date.now();
  const bookmark: Bookmark = {
    id: generateId(),
    ...data,
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