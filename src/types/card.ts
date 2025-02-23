export type CardType = 'note' | 'bookmark' | 'flow';

export interface Card {
  id: string;
  type: CardType;
  title: string;
  description?: string;
  content?: string;
  url?: string;
  tags?: string[];
  folderId: string;
  createdAt: Date;
  updatedAt: Date;
} 