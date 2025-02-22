import React, { useState } from 'react';
import type { Folder } from '@/types/folder';
import type { CardData } from '@components/cards/Card';
import {
  Folder as FolderIcon,
  MoreVertical,
  Edit,
  Trash,
  Palette
} from 'lucide-react';

interface FolderCardProps {
  folder: Folder;
  items: CardData[];
  onOpen: (folderId: string) => void;
  onClick?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onColorChange?: (folderId: string, color: string) => void;
  className?: string;
}

export const FolderCard: React.FC<FolderCardProps> = ({ 
  folder, 
  items, 
  onOpen,
  onClick,
  onEdit,
  onDelete,
  onColorChange,
  className = '' 
}) => {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  
  // Get unique tags from all items in the folder
  const tags = Array.from(new Set(items.flatMap(item => item.tags || [])));

  const handleClick = () => {
    onClick?.(folder.id);
    onOpen(folder.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(folder.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(folder.id);
  };

  return (
    <div
      className={`group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-4 cursor-pointer border border-gray-200 ${className}`}
      onClick={handleClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-gray-100">
            <FolderIcon className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-base font-medium leading-tight text-gray-900">
              {folder.name}
            </h3>
            <span className="text-xs text-gray-500">
              {items.length} items
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleEdit}
            className="p-1.5 rounded-md transition-colors bg-gray-100 hover:bg-gray-200"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-md transition-colors bg-gray-100 hover:bg-red-100"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Preview */}
      {items.length > 0 ? (
        <div className="space-y-2 mb-3">
          {items.slice(0, 2).map(item => (
            <div 
              key={item.id} 
              className="text-sm truncate text-gray-600"
            >
              {item.type === 'bookmark' ? '🔖' : '📝'} {item.title}
            </div>
          ))}
          {items.length > 2 && (
            <div className="text-sm text-gray-500">
              +{items.length - 2} more...
            </div>
          )}
        </div>
      ) : (
        <div className="text-sm mb-3 text-gray-500">
          Empty folder
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs rounded-lg bg-gray-100 text-gray-700"
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="text-xs text-gray-500">
              +{tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}; 