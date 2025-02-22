import React, { useState } from 'react';
import { Folder } from '@/types/folder';
import { CardData } from '@/components/cards/Card';

interface FolderCardProps {
  folder: Folder;
  items: CardData[];
  onOpen: (folderId: string) => void;
  onColorChange?: (folderId: string, color: string) => void;
  className?: string;
}

// Predefined colors based on our design system
const FOLDER_COLORS = [
  { id: 'blue1', color: '#1a4d63', label: 'Deep Ocean' },
  { id: 'blue2', color: '#2c7c8f', label: 'Ocean Teal' },
  { id: 'blue3', color: '#45919f', label: 'Soft Ocean' },
  { id: 'green1', color: '#7a9f4c', label: 'Forest Moss' },
  { id: 'green2', color: '#b5cc94', label: 'Sage' },
  { id: 'green3', color: '#c8dba4', label: 'Light Olive' },
  { id: 'earth1', color: '#d4956a', label: 'Terracotta' },
  { id: 'earth2', color: '#c17f59', label: 'Cedar' },
  { id: 'earth3', color: '#e8c5a2', label: 'Peach' },
  { id: 'accent1', color: '#b54d55', label: 'Deep Rose' },
  { id: 'accent2', color: '#e88e96', label: 'Soft Coral' },
  { id: 'accent3', color: '#f0b3b8', label: 'Light Pink' },
];

export const FolderCard: React.FC<FolderCardProps> = ({ 
  folder, 
  items, 
  onOpen, 
  onColorChange,
  className = '' 
}) => {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  
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

  const handleColorClick = (e: React.MouseEvent, color: string) => {
    e.stopPropagation();
    onColorChange?.(folder.id, color);
    setIsColorPickerOpen(false);
  };

  return (
    <div
      className={`group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-4 cursor-pointer border border-secondary/10 ${className}`}
      onClick={() => onOpen(folder.id)}
      style={{
        background: colors.background,
        borderColor: colors.borderColor,
      }}
    >
      {/* Color Picker Button */}
      <div className="absolute top-3 right-3 z-20">
        <button
          className="p-1.5 rounded-lg hover:bg-black/5 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setIsColorPickerOpen(!isColorPickerOpen);
          }}
          title="Change folder color"
        >
          <svg
            className="w-4 h-4"
            style={{ color: colors.accentColor }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            />
          </svg>
        </button>

        {/* Color Picker Popup */}
        {isColorPickerOpen && (
          <>
            <div 
              className="fixed inset-0 z-30" 
              onClick={(e) => {
                e.stopPropagation();
                setIsColorPickerOpen(false);
              }}
            />
            <div 
              className="absolute right-0 top-8 bg-white rounded-lg shadow-xl border border-gray-200 p-3 w-48 z-40"
              onClick={e => e.stopPropagation()}
            >
              <div className="grid grid-cols-4 gap-2">
                {FOLDER_COLORS.map(({ id, color }) => (
                  <button
                    key={id}
                    className={`w-10 h-10 rounded-lg transition-all duration-200 ${
                      folder.color === color 
                        ? 'ring-2 ring-primary ring-offset-2 scale-105' 
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={(e) => handleColorClick(e, color)}
                  >
                    {folder.color === color && (
                      <span className="absolute inset-0 flex items-center justify-center text-white">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span 
          className="p-1.5 rounded-lg relative"
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
          {/* Color indicator dot */}
          {folder.color && (
            <span 
              className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white"
              style={{ backgroundColor: folder.color }}
            />
          )}
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