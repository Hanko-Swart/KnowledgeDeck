import React from 'react';
import { Folder } from '@/types/folder';
import { CardData } from '@/components/cards/Card';

interface FolderCardProps {
  folder: Folder;
  items: CardData[];
  onOpen: (folderId: string) => void;
  className?: string;
}

export const FolderCard: React.FC<FolderCardProps> = ({ folder, items, onOpen, className = '' }) => {
  // Get unique tags from all items in the folder
  const tags = Array.from(new Set(items.flatMap(item => item.tags || [])));
  
  return (
    <div
      className={`group bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-4 cursor-pointer ${className}`}
      onClick={() => onOpen(folder.id)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium text-primary-dark group-hover:text-primary">
          {folder.name}
        </h3>
        <span className="text-sm text-gray-500">
          {items.length} items
        </span>
      </div>

      {/* Preview */}
      {items.length > 0 ? (
        <div className="space-y-2 mb-3">
          {items.slice(0, 2).map(item => (
            <div key={item.id} className="text-sm text-gray-600 truncate">
              {item.type === 'bookmark' ? '🔖' : '📝'} {item.title}
            </div>
          ))}
          {items.length > 2 && (
            <div className="text-sm text-gray-400">
              +{items.length - 2} more...
            </div>
          )}
        </div>
      ) : (
        <div className="text-sm text-gray-400 mb-3">
          Empty folder
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="px-2 py-0.5 text-gray-400 text-xs">
              +{tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Folder icon in bottom right */}
      <div className="absolute bottom-4 right-4 text-primary-dark/10 group-hover:text-primary/20 transition-colors">
        <svg
          className="w-8 h-8"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20 5h-8.586L9.707 3.293A.997.997 0 0 0 9 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V7c0-1.103-.897-2-2-2z" />
        </svg>
      </div>
    </div>
  );
}; 