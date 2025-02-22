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

  return (
    <div
      className={`card bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer ${className}`}
      onClick={handleClick}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-primary-dark font-medium text-base line-clamp-2">
          {data.title}
        </h3>
        <button
          onClick={handleEdit}
          className="text-gray-400 hover:text-primary-dark p-1 -mr-1"
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
        <p className="text-gray-600 text-sm line-clamp-3 mb-3">
          {data.description}
        </p>
      )}

      {/* URL (for bookmarks) */}
      {data.type === 'bookmark' && data.url && (
        <div className="flex items-center text-gray-500 text-xs mb-3">
          <svg
            className="w-3 h-3 mr-1"
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
          <span className="truncate">{data.url}</span>
        </div>
      )}

      {/* Tags */}
      {data.tags && data.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {data.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
        <span>{new Date(data.createdAt).toLocaleDateString()}</span>
        <span>{data.type === 'bookmark' ? '🔖' : '📝'}</span>
      </div>
    </div>
  );
}; 