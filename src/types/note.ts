export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  tags: string[];
  template: string;
  createdAt: Date;
  updatedAt: Date;
} 