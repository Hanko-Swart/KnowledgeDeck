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
  screenshot?: string;
}

interface CardProps {
  data: CardData;
  onClick?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
  folderColor?: string;
}

export const Card: React.FC<CardProps> = ({ data, onClick, onEdit, onDelete, className = '', folderColor }) => {
  const handleClick = () => onClick?.(data.id);
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(data.id);
  };
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(data.id);
  };

  return (
    <div
      className={`group relative bg-white rounded-lg shadow-sm hover:shadow-md hover:translate-y-[-1px] transition-all duration-300 p-4 cursor-pointer border border-gray-200 ${
        folderColor ? `border-l-4 border-l-${folderColor}-500` : ''
      } ${className}`}
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
        <div className="flex items-center gap-1">
          <button
            onClick={handleEdit}
            className="p-1.5 rounded-md transition-colors bg-gray-100 hover:bg-gray-200"
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
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-md transition-colors bg-gray-100 hover:bg-red-100"
          >
            <svg
              className="w-4 h-4 text-gray-700 hover:text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Screenshot Preview (for bookmarks) */}
      {data.type === 'bookmark' && data.screenshot && (
        <div className="relative w-full h-32 mb-3 rounded-md overflow-hidden">
          <img
            src={data.screenshot}
            alt={`Screenshot of ${data.title}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

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