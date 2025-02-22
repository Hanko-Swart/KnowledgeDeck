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
}

export const Card: React.FC<CardProps> = ({ data, onClick, onEdit, className = '' }) => {
  const handleClick = () => onClick?.(data.id);
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(data.id);
  };

  // Generate complementary colors based on the folder color
  const getColorStyles = (baseColor: string = '#10656d') => {
    return {
      background: `linear-gradient(to right bottom, ${baseColor}02, ${baseColor}05)`,
      borderColor: `${baseColor}15`,
      hoverBorder: `${baseColor}30`,
      accentColor: baseColor,
    };
  };

  const colors = getColorStyles(data.folderColor);

  return (
    <div
      className={`group relative bg-white rounded-lg shadow-sm hover:shadow-md hover:translate-y-[-1px] transition-all duration-300 p-4 cursor-pointer border ${className}`}
      style={{
        background: colors.background,
        borderColor: colors.borderColor,
        '--hover-border': colors.hoverBorder,
        '--accent-color': colors.accentColor,
      } as React.CSSProperties}
      onClick={handleClick}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span 
            className="p-1.5 rounded-md"
            style={{ backgroundColor: `${colors.accentColor}10` }}
          >
            {data.type === 'bookmark' ? (
              <svg 
                className="w-4 h-4"
                style={{ color: colors.accentColor }}
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
                style={{ color: colors.accentColor }}
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
              className="text-base font-medium leading-tight transition-colors"
              style={{ color: colors.accentColor }}
            >
              {data.title}
            </h3>
            <span className="text-xs" style={{ color: `${colors.accentColor}60` }}>
              {new Date(data.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <button
          onClick={handleEdit}
          className="p-1.5 rounded-md transition-colors -mr-1"
          style={{ 
            color: `${colors.accentColor}60`,
            ['--hover-bg' as string]: `${colors.accentColor}10`
          }}
        >
          <svg
            className="w-4 h-4"
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
          style={{ color: `${colors.accentColor}80` }}
        >
          {data.description}
        </p>
      )}

      {/* URL (for bookmarks) */}
      {data.type === 'bookmark' && data.url && (
        <div 
          className="flex items-center text-xs mb-3 transition-colors"
          style={{ color: `${colors.accentColor}70` }}
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
              className="px-2 py-0.5 text-xs font-medium rounded-md transition-colors"
              style={{ 
                backgroundColor: `${colors.accentColor}08`,
                color: `${colors.accentColor}90`,
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