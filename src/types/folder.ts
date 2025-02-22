export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  icon?: string;
  color?: string;
} 