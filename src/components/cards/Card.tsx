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
      className={`group relative bg-white rounded-lg shadow-sm hover:shadow-md hover:translate-y-[-1px] transition-all duration-300 p-4 cursor-pointer border border-gray-200 ${className}`}
      onClick={handleClick}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-md bg-gray-100">
            {data.type === 'bookmark' ? (
              <svg 
                className="w-4 h-4 text-gray-700"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            ) : (
              <svg 
                className="w-4 h-4 text-gray-700"
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
            <h3 className="text-base font-medium leading-tight text-gray-900">
              {data.title}
            </h3>
            <span className="text-xs text-gray-500">
              {new Date(data.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <button
          onClick={handleEdit}
          className="p-1.5 rounded-md transition-colors -mr-1 bg-gray-100 hover:bg-gray-200"
        >
          <svg
            className="w-4 h-4 text-gray-700"
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
        <div 
          className="prose prose-sm max-w-none mb-3 line-clamp-3 text-gray-600"
          dangerouslySetInnerHTML={{ __html: data.description }}
        />
      )}

      {/* URL (for bookmarks) */}
      {data.type === 'bookmark' && data.url && (
        <div className="flex items-center text-xs mb-3 text-gray-600">
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
              className="px-2 py-0.5 text-xs font-medium rounded-md bg-gray-100 text-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}; 