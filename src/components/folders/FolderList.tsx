import React, { useState } from 'react';
import { Folder } from '@/types/folder';

interface FolderListProps {
  onFolderSelect?: (folderId: string) => void;
  selectedFolderId?: string;
  folders: Folder[];
}

export const FolderList: React.FC<FolderListProps> = ({ 
  onFolderSelect, 
  selectedFolderId,
  folders 
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const handleFolderClick = (folderId: string) => {
    onFolderSelect?.(folderId);
  };

  const toggleExpand = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  // Get color styles based on the folder's color
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

  const renderFolders = (parentId: string | null = null, level: number = 0): JSX.Element[] => {
    return folders
      .filter(folder => folder.parentId === parentId)
      .map(folder => {
        const hasChildren = folders.some(f => f.parentId === folder.id);
        const isExpanded = expandedFolders.has(folder.id);
        const isSelected = selectedFolderId === folder.id;
        const colors = isSelected && folder.color ? getColorStyles(folder.color) : null;

        return (
          <div key={folder.id} style={{ paddingLeft: `${level * 16}px` }}>
            <button
              className={`group flex items-center w-full px-3 py-2 rounded-lg transition-all ${
                isSelected
                  ? 'text-white'
                  : 'hover:bg-secondary/10 text-primary-dark'
              }`}
              onClick={() => handleFolderClick(folder.id)}
              style={isSelected && colors ? {
                background: colors.background,
                color: colors.textColor
              } : undefined}
            >
              {/* Expand/Collapse button */}
              {hasChildren && (
                <button
                  className={`p-0.5 rounded-md mr-2 transition-colors ${
                    isSelected
                      ? 'hover:bg-white/20'
                      : 'hover:bg-secondary/20 text-primary'
                  }`}
                  onClick={(e) => toggleExpand(folder.id, e)}
                  style={isSelected && colors ? {
                    backgroundColor: colors.iconBg,
                    color: colors.textColor
                  } : undefined}
                >
                  <svg
                    className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}

              {/* Folder Icon */}
              <svg
                className={`w-5 h-5 mr-2 transition-colors ${
                  isSelected ? '' : 'text-primary group-hover:text-primary-dark'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={isSelected && colors ? { color: colors.textColor } : undefined}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>

              {/* Folder Name */}
              <span className="flex-1 truncate">{folder.name}</span>

              {/* Item Count */}
              <span
                className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                  isSelected
                    ? ''
                    : 'bg-secondary/10 text-primary-dark'
                }`}
                style={isSelected && colors ? {
                  backgroundColor: colors.iconBg,
                  color: colors.textColor
                } : undefined}
              >
                {folders.filter(f => f.parentId === folder.id).length}
              </span>
            </button>

            {/* Children */}
            {hasChildren && isExpanded && (
              <div className="mt-1 space-y-1">
                {renderFolders(folder.id, level + 1)}
              </div>
            )}
          </div>
        );
      });
  };

  return (
    <div className="p-2 space-y-1">
      {renderFolders()}
    </div>
  );
}; 