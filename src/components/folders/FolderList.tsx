import React, { useState } from 'react';
import { Folder } from '@/types/folder';

interface FolderListProps {
  onFolderSelect?: (folderId: string) => void;
  selectedFolderId?: string;
}

export const FolderList: React.FC<FolderListProps> = ({ onFolderSelect, selectedFolderId }) => {
  // Temporary mock data - will be replaced with actual data from storage
  const [folders] = useState<Folder[]>([
    { id: '1', name: 'Research', parentId: null },
    { id: '2', name: 'Projects', parentId: null },
    { id: '3', name: 'Articles', parentId: '1' },
    { id: '4', name: 'Ideas', parentId: '2' },
  ]);

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

  const renderFolders = (parentId: string | null = null, level: number = 0): JSX.Element[] => {
    return folders
      .filter(folder => folder.parentId === parentId)
      .map(folder => {
        const hasChildren = folders.some(f => f.parentId === folder.id);
        const isExpanded = expandedFolders.has(folder.id);
        const isSelected = selectedFolderId === folder.id;

        return (
          <div key={folder.id} style={{ paddingLeft: `${level * 16}px` }}>
            <button
              className={`group flex items-center w-full px-3 py-2 rounded-lg transition-all ${
                isSelected
                  ? 'bg-primary text-white'
                  : 'hover:bg-secondary/10 text-primary-dark'
              }`}
              onClick={() => handleFolderClick(folder.id)}
            >
              {/* Expand/Collapse button */}
              {hasChildren && (
                <button
                  className={`p-0.5 rounded-md mr-2 transition-colors ${
                    isSelected
                      ? 'hover:bg-white/20 text-white'
                      : 'hover:bg-secondary/20 text-primary'
                  }`}
                  onClick={(e) => toggleExpand(folder.id, e)}
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
                  isSelected ? 'text-white' : 'text-primary group-hover:text-primary-dark'
                }`}
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

              {/* Folder Name */}
              <span className="flex-1 truncate">{folder.name}</span>

              {/* Item Count */}
              <span
                className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-secondary/10 text-primary-dark'
                }`}
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