export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  color: string;
  createdAt: Date;
  updatedAt: Date;
} 