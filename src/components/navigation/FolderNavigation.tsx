import React, { useState } from 'react';
import type { Folder } from '@/types/folder';

interface FolderNavigationProps {
  currentFolder: Folder;
  onBack: () => void;
  onFolderSelect: (folderId: string) => void;
  folders: Folder[];
}

export const FolderNavigation: React.FC<FolderNavigationProps> = ({
  currentFolder,
  onBack,
  onFolderSelect,
  folders,
}) => {
  const [isFolderPanelOpen, setIsFolderPanelOpen] = useState(false);

  return (
    <div className="relative">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full transition-colors hover:bg-gray-100"
          >
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-lg font-medium text-gray-900">
            {currentFolder.name}
          </h1>
        </div>

        <button
          onClick={() => setIsFolderPanelOpen(!isFolderPanelOpen)}
          className="p-1.5 rounded-full transition-colors hover:bg-gray-100"
        >
          <svg
            className="w-5 h-5 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Folder Panel */}
      {isFolderPanelOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-10"
            onClick={() => setIsFolderPanelOpen(false)}
          />
          {/* Panel */}
          <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-20">
            <div className="p-2 space-y-1">
              {folders.map(folder => (
                <button
                  key={folder.id}
                  className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors ${
                    folder.id === currentFolder.id
                      ? 'bg-gray-100 text-gray-900'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                  onClick={() => {
                    onFolderSelect(folder.id);
                    setIsFolderPanelOpen(false);
                  }}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                  <span className="flex-1 truncate">{folder.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}; 