import React, { useState } from 'react';
import { FolderList } from '@components/folders/FolderList';
import { Folder } from '@/types/folder';

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

  // Generate color styles based on the folder's color
  const getColorStyles = (baseColor: string = '#10656d') => {
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    const isLight = luminance > 0.5;

    return {
      background: baseColor,
      textColor: isLight ? '#1a4d63' : '#ffffff',
      mutedTextColor: isLight ? 'rgba(26, 77, 99, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      iconBg: isLight ? `${baseColor}20` : 'rgba(255, 255, 255, 0.15)',
    };
  };

  const colors = getColorStyles(currentFolder?.color || '#dd6670'); // Use folder color or default to red

  return (
    <div className="relative">
      {/* Navigation Bar */}
      <div 
        className="flex items-center justify-between h-14 px-4 border-b transition-colors"
        style={{ 
          background: colors.background,
          borderColor: 'rgba(0, 0, 0, 0.1)',
          color: colors.textColor
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full transition-colors hover:bg-black/10"
            style={{ color: colors.textColor }}
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
          <h1 className="text-lg font-medium" style={{ color: colors.textColor }}>
            {currentFolder.name}
          </h1>
        </div>

        <button
          onClick={() => setIsFolderPanelOpen(!isFolderPanelOpen)}
          className="p-1.5 rounded-full transition-colors hover:bg-black/10"
          style={{ color: colors.textColor }}
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
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Folder Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-30 ${
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
            folders={folders}
          />
        </div>
      </div>

      {/* Backdrop */}
      {isFolderPanelOpen && (
        <div 
          className="fixed inset-0 bg-black/5 backdrop-blur-sm transition-all duration-300 z-20"
          onClick={() => setIsFolderPanelOpen(false)}
        />
      )}
    </div>
  );
}; 