import React, { useState } from 'react';
import { FolderList } from '@components/folders/FolderList';
import { SearchBar } from '@components/search/SearchBar';

export const Sidebar: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Search Bar */}
      <div className="p-4">
        <SearchBar />
      </div>

      {/* Folders Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-2 flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-600">Folders</h2>
          <button 
            className="text-primary-dark hover:text-primary-dark/80 p-1"
            onClick={() => {/* TODO: Implement new folder creation */}}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
        <FolderList />
      </div>

      {/* Other Favourites Section */}
      <div className="border-t border-gray-200 p-4">
        <button className="flex items-center space-x-2 text-gray-600 hover:text-primary-dark">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          <span>Other favourites</span>
        </button>
      </div>
    </div>
  );
}; 