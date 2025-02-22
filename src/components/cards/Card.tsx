import React from 'react';

export interface CardData {
  id: string;
  type: 'bookmark' | 'note';
  title: string;
  description?: string;
  url?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  folderId?: string;
  folderColor?: string;
}

interface CardProps {
  data: CardData;
  onClick?: (id: string) => void;
  onEdit?: (id: string) => void;
  className?: string;
  folderColor?: string;
}

export const Card: React.FC<CardProps> = ({ data, onClick, onEdit, className = '', folderColor }) => {
  const handleClick = () => onClick?.(data.id);
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(data.id);
  };

  // Generate complementary colors based on the folder color
  const getColorStyles = (baseColor: string = '#10656d') => {
    // Calculate luminance to determine if we should use light or dark text
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    const isLight = luminance > 0.5;

    // For light backgrounds, we use darker shades of the same color
    // For dark backgrounds, we use lighter shades of white
    const getShade = (opacity: number) => {
      if (isLight) {
        // Darken the base color for text on light backgrounds
        const darkenAmount = 0.4; // 40% darker
        const darkR = Math.max(r - darkenAmount, 0);
        const darkG = Math.max(g - darkenAmount, 0);
        const darkB = Math.max(b - darkenAmount, 0);
        return `rgba(${darkR * 255}, ${darkG * 255}, ${darkB * 255}, ${opacity})`;
      } else {
        // Use white with opacity for text on dark backgrounds
        return `rgba(255, 255, 255, ${opacity})`;
      }
    };

    return {
      background: baseColor,
      borderColor: isLight ? `${baseColor}70` : 'rgba(255, 255, 255, 0.2)',
      accentColor: baseColor,
      textColor: getShade(1), // Full opacity for main text
      mutedTextColor: getShade(0.8), // 80% opacity for secondary text
      lightTextColor: getShade(0.6), // 60% opacity for tertiary text
      tagBg: isLight ? `${baseColor}30` : 'rgba(255, 255, 255, 0.15)',
      tagText: isLight ? getShade(1) : '#ffffff',
      iconBg: isLight ? `${baseColor}20` : 'rgba(255, 255, 255, 0.15)',
    };
  };

  const colors = getColorStyles(folderColor || data.folderColor);

  return (
    <div
      className={`group relative bg-white rounded-lg shadow-sm hover:shadow-md hover:translate-y-[-1px] transition-all duration-300 p-4 cursor-pointer border ${className}`}
      style={{
        background: colors.background,
        borderColor: colors.borderColor,
        '--hover-border': colors.accentColor,
        '--accent-color': colors.accentColor,
      } as React.CSSProperties}
      onClick={handleClick}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span 
            className="p-1.5 rounded-md"
            style={{ backgroundColor: colors.iconBg }}
          >
            {data.type === 'bookmark' ? (
              <svg 
                className="w-4 h-4"
                style={{ color: colors.textColor }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            ) : (
              <svg 
                className="w-4 h-4"
                style={{ color: colors.textColor }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            )}
          </span>
          <div>
            <h3 
              className="text-base font-medium leading-tight"
              style={{ color: colors.textColor }}
            >
              {data.title}
            </h3>
            <span className="text-xs" style={{ color: colors.mutedTextColor }}>
              {new Date(data.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <button
          onClick={handleEdit}
          className="p-1.5 rounded-md transition-colors -mr-1"
          style={{ backgroundColor: colors.iconBg }}
        >
          <svg
            className="w-4 h-4"
            style={{ color: colors.textColor }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
      </div>

      {/* Card Content */}
      {data.description && (
        <p 
          className="text-sm leading-relaxed mb-3 line-clamp-3"
          style={{ color: colors.mutedTextColor }}
        >
          {data.description}
        </p>
      )}

      {/* URL (for bookmarks) */}
      {data.type === 'bookmark' && data.url && (
        <div 
          className="flex items-center text-xs mb-3"
          style={{ color: colors.mutedTextColor }}
        >
          <svg
            className="w-3 h-3 mr-1.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          <span className="truncate hover:underline">{data.url}</span>
        </div>
      )}

      {/* Tags */}
      {data.tags && data.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {data.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs font-medium rounded-md"
              style={{ 
                backgroundColor: colors.tagBg,
                color: colors.tagText,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}; 