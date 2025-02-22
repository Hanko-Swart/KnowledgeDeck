import Dexie, { Table } from 'dexie';
import type { Note } from '@/types/note';
import type { Bookmark } from './bookmarkStorage';
import type { Folder } from '@/types/folder';

class KnowledgeDeckDatabase extends Dexie {
  notes!: Table<Note>;
  bookmarks!: Table<Bookmark>;
  folders!: Table<Folder>;

  constructor() {
    super('KnowledgeDeckDB');
    this.version(2).stores({
      notes: '++id, folderId, createdAt, updatedAt, type',
      bookmarks: '++id, folderId, createdAt, updatedAt, type, screenshot',
      folders: '++id, parentId, createdAt, updatedAt',
    });
  }
}

export const db = new KnowledgeDeckDatabase(); 