export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  screenshot?: string;
  tags?: string[];
  folderId: string | null;
  createdAt: Date;
  updatedAt: Date;
  type: 'bookmark';
} 