import React from 'react';
import { Handle, Position } from 'reactflow';
import { Bookmark, FileText, GitBranch } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardNodeData {
  label: string;
  type: 'note' | 'bookmark' | 'flow';
  description: string;
  tags: string[];
}

interface FolderNodeData {
  label: string;
  color: string;
}

export const CardNode: React.FC<{ data: CardNodeData }> = ({ data }) => {
  const getIcon = () => {
    switch (data.type) {
      case 'bookmark':
        return <Bookmark className="w-4 h-4" />;
      case 'note':
        return <FileText className="w-4 h-4" />;
      case 'flow':
        return <GitBranch className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-sm">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!bg-muted-foreground" 
      />
      
      <div className="flex items-center gap-2 mb-2">
        <span className="p-1.5 rounded-md bg-muted text-foreground">
          {getIcon()}
        </span>
        <span className="font-medium text-sm truncate text-foreground">{data.label}</span>
      </div>
      
      {data.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
          {data.description}
        </p>
      )}
      
      {data.tags && data.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {data.tags.map((tag, index) => (
            <span
              key={index}
              className="px-1.5 py-0.5 bg-accent/10 text-accent-foreground rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!bg-muted-foreground" 
      />
    </div>
  );
};

export const FolderNode: React.FC<{ data: FolderNodeData }> = ({ data }) => {
  return (
    <div
      className={cn(
        "rounded-lg p-3 shadow-sm text-primary-foreground",
        "bg-primary hover:bg-primary/90 transition-colors"
      )}
    >
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!bg-primary-foreground" 
      />
      
      <div className="flex items-center gap-2">
        <span className="font-medium">{data.label}</span>
      </div>
    </div>
  );
}; 