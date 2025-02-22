import { Folder } from '@/types/folder';

const FOLDERS_STORAGE_KEY = 'knowledgeDeck_folders';

export const getFolders = async (): Promise<Folder[]> => {
  const result = await chrome.storage.local.get(FOLDERS_STORAGE_KEY);
  return result[FOLDERS_STORAGE_KEY] || [];
};

export const saveFolders = async (folders: Folder[]): Promise<void> => {
  await chrome.storage.local.set({ [FOLDERS_STORAGE_KEY]: folders });
}; 