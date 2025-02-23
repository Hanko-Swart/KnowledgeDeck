import React, { useState } from 'react';
import type { Folder } from '@/types/folder';
import type { CardData } from '@components/cards/Card';
import {
  Folder as FolderIcon,
  Edit,
  Trash,
} from 'lucide-react';

interface FolderCardProps {
  folder: Folder;
  items: CardData[];
  onOpen: (folderId: string) => void;
  onClick: (folderId: string) => void;
  onEdit: (folderId: string) => void;
  onDelete: (folderId: string) => void;
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
    onClick(folder.id);
    onOpen(folder.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(folder.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(folder.id);
  };

  return (
    <div
      className={`group relative bg-card text-card-foreground rounded-lg shadow-sm hover:shadow-md transition-all p-4 cursor-pointer border border-border ${className}`}
      onClick={handleClick}
    >
      {folder.color && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
          style={{ backgroundColor: folder.color }}
        />
      )}
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-muted">
            <FolderIcon className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-base font-medium leading-tight">
              {folder.name}
            </h3>
            <span className="text-xs text-muted-foreground">
              {items.length} items
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleEdit}
            className="p-1.5 rounded-md transition-colors bg-muted hover:bg-muted/80"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-md transition-colors bg-muted hover:bg-destructive hover:text-destructive-foreground"
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
              className="text-sm truncate text-muted-foreground"
            >
              {item.type === 'bookmark' ? '🔖' : '📝'} {item.title}
            </div>
          ))}
          {items.length > 2 && (
            <div className="text-sm text-muted-foreground">
              +{items.length - 2} more...
            </div>
          )}
        </div>
      ) : (
        <div className="text-sm mb-3 text-muted-foreground">
          Empty folder
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs rounded-lg bg-muted text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}; 