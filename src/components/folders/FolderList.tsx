import React, { useState } from 'react';
import { Folder } from '@/types/folder';

interface FolderListProps {
  onFolderSelect?: (folderId: string) => void;
}

export const FolderList: React.FC<FolderListProps> = ({ onFolderSelect }) => {
  // Temporary mock data - will be replaced with actual data from storage
  const [folders] = useState<Folder[]>([
    { id: '1', name: 'Research', parentId: null },
    { id: '2', name: 'Projects', parentId: null },
    { id: '3', name: 'Articles', parentId: '1' },
    { id: '4', name: 'Ideas', parentId: '2' },
  ]);

  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const handleFolderClick = (folderId: string) => {
    setSelectedFolder(folderId);
    onFolderSelect?.(folderId);
  };

  const renderFolders = (parentId: string | null = null): JSX.Element[] => {
    return folders
      .filter(folder => folder.parentId === parentId)
      .map(folder => (
        <div key={folder.id} className="ml-4">
          <button
            className={`flex items-center gap-2 px-2 py-1 rounded-md w-full text-left transition-colors ${
              selectedFolder === folder.id
                ? 'text-primary-dark font-medium'
                : 'text-gray-600 hover:text-primary-dark'
            }`}
            onClick={() => handleFolderClick(folder.id)}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            <span>{folder.name}</span>
          </button>
          {renderFolders(folder.id)}
        </div>
      ));
  };

  return (
    <div className="space-y-1 py-2">
      <div className="flex items-center justify-between px-3 py-2">
        <h2 className="text-sm font-semibold text-gray-600">Folders</h2>
        <button
          className="text-primary hover:text-primary-dark"
          onClick={() => {/* TODO: Implement new folder creation */}}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
      {renderFolders()}
    </div>
  );
}; 