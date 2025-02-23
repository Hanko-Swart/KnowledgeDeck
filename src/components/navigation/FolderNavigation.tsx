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
  items: { [folderId: string]: number };
}

export const FolderNavigation: React.FC<FolderNavigationProps> = ({
  currentFolder,
  onBack,
  onFolderSelect,
  folders,
  items,
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

      {/* Folder Panel - Slide from right */}
      {isFolderPanelOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setIsFolderPanelOpen(false)}
          />
          {/* Panel */}
          <div className="fixed right-0 top-0 bottom-0 w-80 bg-card border-l border-border z-50 shadow-lg transform transition-transform duration-200 ease-in-out">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-border">
                <h2 className="text-lg font-medium text-foreground">All Folders</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {folders.map(folder => (
                  <button
                    key={folder.id}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors ${
                      folder.id === currentFolder.id
                        ? 'text-white'
                        : 'hover:bg-accent/50 text-foreground'
                    }`}
                    style={folder.id === currentFolder.id && folder.color ? {
                      backgroundColor: folder.color
                    } : undefined}
                    onClick={() => {
                      onFolderSelect(folder.id);
                      setIsFolderPanelOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Home className="w-5 h-5" />
                      <span className="flex-1 truncate text-left">{folder.name}</span>
                    </div>
                    <span className={`text-xs ${folder.id === currentFolder.id ? 'text-white/80' : 'text-muted-foreground'}`}>
                      {items[folder.id] || 0} items
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}; 