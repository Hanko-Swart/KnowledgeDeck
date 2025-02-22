import React, { useState } from 'react';
import type { Folder } from '@/types/folder';
import {
  ChevronLeft,
  Home
} from 'lucide-react';

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
      <div className="flex items-center justify-between h-14 px-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full transition-colors hover:bg-accent"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-lg font-medium text-foreground">
            {currentFolder.name}
          </h1>
        </div>

        <button
          onClick={() => setIsFolderPanelOpen(!isFolderPanelOpen)}
          className="p-1.5 rounded-full transition-colors hover:bg-accent"
        >
          <Home className="h-5 w-5 text-foreground" />
        </button>
      </div>

      {/* Folder Panel */}
      {isFolderPanelOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-10"
            onClick={() => setIsFolderPanelOpen(false)}
          />
          {/* Panel */}
          <div className="absolute right-0 top-full mt-1 w-64 bg-card rounded-lg shadow-lg border border-border overflow-hidden z-20">
            <div className="p-2 space-y-1">
              {folders.map(folder => (
                <button
                  key={folder.id}
                  className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors ${
                    folder.id === currentFolder.id
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-accent/50 text-foreground'
                  }`}
                  onClick={() => {
                    onFolderSelect(folder.id);
                    setIsFolderPanelOpen(false);
                  }}
                >
                  <Home className="w-5 h-5 mr-2 text-foreground" />
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