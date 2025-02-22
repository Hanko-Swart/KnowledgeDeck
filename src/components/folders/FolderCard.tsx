import React from 'react';
import { Folder } from '@/types/folder';
import { CardData } from '@/components/cards/Card';

interface FolderCardProps {
  folder: Folder;
  items: CardData[];
  onOpen: (folderId: string) => void;
  onColorChange?: (folderId: string, color: string) => void;
  className?: string;
}

export const FolderCard: React.FC<FolderCardProps> = ({ 
  folder, 
  items, 
  onOpen, 
  onColorChange,
  className = '' 
}) => {
  // Get unique tags from all items in the folder
  const tags = Array.from(new Set(items.flatMap(item => item.tags || [])));
  
  // Generate color styles based on the folder's color
  const getColorStyles = (baseColor: string = '#10656d') => {
    return {
      background: `linear-gradient(to right bottom, ${baseColor}08, ${baseColor}15)`,
      borderColor: `${baseColor}20`,
      accentColor: baseColor,
    };
  };

  const colors = getColorStyles(folder.color);

  return (
    <div
      className={`group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-4 cursor-pointer border border-secondary/10 ${className}`}
      onClick={() => onOpen(folder.id)}
      style={{
        background: colors.background,
        borderColor: colors.borderColor,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span 
            className="p-1.5 rounded-lg"
            style={{ backgroundColor: `${colors.accentColor}15` }}
          >
            <svg
              className="w-5 h-5"
              style={{ color: colors.accentColor }}
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
          </span>
          <div>
            <h3 
              className="text-base font-medium leading-tight"
              style={{ color: colors.accentColor }}
            >
              {folder.name}
            </h3>
            <span 
              className="text-xs"
              style={{ color: `${colors.accentColor}70` }}
            >
              {items.length} items
            </span>
          </div>
        </div>

        {/* Color Picker */}
        {onColorChange && (
          <div className="flex items-center gap-1">
            {['#1a4d63', '#2c7c8f', '#45919f', '#7a9f4c', '#b5cc94', '#d4956a'].map(color => (
              <button
                key={color}
                className="w-4 h-4 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ 
                  backgroundColor: color,
                  transform: folder.color === color ? 'scale(1.1)' : 'scale(1)',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onColorChange(folder.id, color);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Preview */}
      {items.length > 0 ? (
        <div className="space-y-2 mb-3">
          {items.slice(0, 2).map(item => (
            <div 
              key={item.id} 
              className="text-sm truncate"
              style={{ color: `${colors.accentColor}80` }}
            >
              {item.type === 'bookmark' ? '🔖' : '📝'} {item.title}
            </div>
          ))}
          {items.length > 2 && (
            <div 
              className="text-sm"
              style={{ color: `${colors.accentColor}60` }}
            >
              +{items.length - 2} more...
            </div>
          )}
        </div>
      ) : (
        <div 
          className="text-sm mb-3"
          style={{ color: `${colors.accentColor}60` }}
        >
          Empty folder
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs rounded-lg"
              style={{ 
                backgroundColor: `${colors.accentColor}10`,
                color: `${colors.accentColor}90`,
              }}
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span 
              className="text-xs"
              style={{ color: `${colors.accentColor}60` }}
            >
              +{tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}; 