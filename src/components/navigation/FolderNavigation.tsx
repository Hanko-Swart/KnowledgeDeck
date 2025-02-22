import React, { useState } from 'react';
import { FolderList } from '@components/folders/FolderList';
import { Folder } from '@/types/folder';

interface FolderNavigationProps {
  currentFolder: Folder;
  onBack: () => void;
  onFolderSelect: (folderId: string) => void;
}

export const FolderNavigation: React.FC<FolderNavigationProps> = ({
  currentFolder,
  onBack,
  onFolderSelect,
}) => {
  const [isFolderPanelOpen, setIsFolderPanelOpen] = useState(false);

  return (
    <>
      {/* Navigation Bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between h-14 px-4 border-b border-secondary/20 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-secondary/10 text-primary transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-lg font-medium text-primary-dark">
            {currentFolder.name}
          </h1>
        </div>

        <button
          onClick={() => setIsFolderPanelOpen(!isFolderPanelOpen)}
          className={`p-1.5 rounded-full transition-colors ${
            isFolderPanelOpen 
              ? 'bg-primary-dark/10 text-primary-dark' 
              : 'hover:bg-secondary/10 text-primary'
          }`}
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
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
        </button>
      </div>

      {/* Backdrop with blur - positioned behind the panel */}
      {isFolderPanelOpen && (
        <div
          className="fixed inset-0 bg-white/10 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsFolderPanelOpen(false)}
        />
      )}

      {/* Folder Panel - positioned above the backdrop */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-20 ${
          isFolderPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-secondary/20 bg-secondary/5">
          <h2 className="text-sm font-medium text-primary-dark">Folders</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100%-57px)]">
          <FolderList
            onFolderSelect={(folderId) => {
              onFolderSelect(folderId);
              setIsFolderPanelOpen(false);
            }}
            selectedFolderId={currentFolder.id}
          />
        </div>
      </div>
    </>
  );
}; 