import React from 'react';
import {
  FileText,
  Bookmark,
  MoreVertical,
  Edit,
  Trash,
  ExternalLink
} from 'lucide-react';

export interface CardData {
  id: string;
  type: 'bookmark' | 'note';
  title: string;
  description: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  folderId?: string;
  url?: string;
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
              <Bookmark className="h-5 w-5" />
            ) : (
              <FileText className="h-5 w-5" />
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
          <ExternalLink className="h-4 w-4 mr-1.5 flex-shrink-0" />
          <span className="truncate hover:underline">{data.url}</span>
        </div>
      )}

      {/* Tags */}
      {data.tags && data.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {data.tags.map((tag: string) => (
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