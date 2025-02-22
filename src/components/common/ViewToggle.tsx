import React from 'react';
import { ViewMode } from '@/types/view';

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
      <button
        className={`px-3 py-1 rounded-md transition-colors ${
          currentView === 'list'
            ? 'bg-white text-primary-dark shadow-sm'
            : 'text-gray-600 hover:text-primary-dark'
        }`}
        onClick={() => onViewChange('list')}
      >
        List
      </button>
      <button
        className={`px-3 py-1 rounded-md transition-colors ${
          currentView === 'grid'
            ? 'bg-white text-primary-dark shadow-sm'
            : 'text-gray-600 hover:text-primary-dark'
        }`}
        onClick={() => onViewChange('grid')}
      >
        Grid
      </button>
      <button
        className={`px-3 py-1 rounded-md transition-colors ${
          currentView === 'mindmap'
            ? 'bg-white text-primary-dark shadow-sm'
            : 'text-gray-600 hover:text-primary-dark'
        }`}
        onClick={() => onViewChange('mindmap')}
      >
        Mind Map
      </button>
    </div>
  );
}; 