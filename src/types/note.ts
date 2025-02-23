export type NoteType = 'note' | 'flow';

export interface Note {
  id: string;
  type: NoteType;
  title: string;
  content: string;
  folderId: string;
  tags: string[];
  template?: string;
  createdAt: Date;
  updatedAt: Date;
} 