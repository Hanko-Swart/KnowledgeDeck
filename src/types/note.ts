export interface Note {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  folderId: string | null;
  createdAt: Date;
  updatedAt: Date;
  type: 'note';
  template?: string;
} 