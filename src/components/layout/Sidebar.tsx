import React, { useState } from 'react';
import { SearchBar } from '@components/search/SearchBar';
import { CardGrid } from '@components/cards/CardGrid';
import { FolderCard } from '@components/folders/FolderCard';
import { FolderNavigation } from '@components/navigation/FolderNavigation';
import type { CardData } from '@components/cards/Card';
import type { Folder } from '@/types/folder';

export const Sidebar: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  // Temporary mock data - will be replaced with actual data from storage
  const mockFolders: Folder[] = [
    { id: '1', name: 'Research', parentId: null },
    { id: '2', name: 'Projects', parentId: null },
    { id: '3', name: 'Articles', parentId: '1' },
    { id: '4', name: 'Ideas', parentId: '2' },
  ];

  const mockCards: CardData[] = [
    {
      id: '1',
      type: 'bookmark',
      title: 'Getting Started with Chrome Extensions',
      description: 'Learn how to build Chrome extensions using Manifest V3',
      url: 'https://developer.chrome.com/docs/extensions/mv3/getstarted/',
      tags: ['chrome', 'development', 'tutorial'],
      createdAt: new Date('2024-02-22'),
      updatedAt: new Date('2024-02-22'),
      folderId: '1'
    },
    {
      id: '2',
      type: 'note',
      title: 'Extension Ideas',
      description: 'Some ideas for future extension features:\n- AI integration\n- Better search\n- Dark mode',
      tags: ['ideas', 'features'],
      createdAt: new Date('2024-02-22'),
      updatedAt: new Date('2024-02-22'),
      folderId: '2'
    }
  ];

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // TODO: Implement search functionality
  };

  const handleCardClick = (id: string) => {
    console.log('Card clicked:', id);
    // TODO: Implement card detail view
  };

  const handleCardEdit = (id: string) => {
    console.log('Edit card:', id);
    // TODO: Implement card editing
  };

  // Get top-level folders and their items
  const rootFolders = mockFolders.filter(f => !f.parentId);
  const getFolderItems = (folderId: string) => {
    const childFolderIds = mockFolders
      .filter(f => f.parentId === folderId)
      .map(f => f.id);
    return mockCards.filter(c => 
      c.folderId === folderId || childFolderIds.includes(c.folderId || '')
    );
  };

  // Get current folder and its items
  const currentFolder = currentFolderId 
    ? mockFolders.find(f => f.id === currentFolderId)
    : null;
  const currentItems = currentFolderId 
    ? mockCards.filter(c => c.folderId === currentFolderId)
    : [];

  return (
    <div className="flex flex-col h-screen bg-white relative">
      {/* Search Bar */}
      <div className="p-4">
        <SearchBar onSearch={handleSearch} />
      </div>

      {currentFolder ? (
        // Folder View
        <>
          <FolderNavigation
            currentFolder={currentFolder}
            onBack={() => setCurrentFolderId(null)}
            onFolderSelect={setCurrentFolderId}
          />

          {/* View Toggle */}
          <div className="px-4 py-2 flex items-center justify-end border-b border-gray-200">
            <div className="flex items-center gap-2">
              <button
                className={`p-1.5 rounded ${
                  viewMode === 'list'
                    ? 'text-primary-dark bg-gray-100'
                    : 'text-gray-400 hover:text-primary-dark'
                }`}
                onClick={() => setViewMode('list')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button
                className={`p-1.5 rounded ${
                  viewMode === 'grid'
                    ? 'text-primary-dark bg-gray-100'
                    : 'text-gray-400 hover:text-primary-dark'
                }`}
                onClick={() => setViewMode('grid')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Folder Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <CardGrid
              cards={currentItems}
              viewMode={viewMode}
              onCardClick={handleCardClick}
              onCardEdit={handleCardEdit}
            />
          </div>
        </>
      ) : (
        // Home View
        <>
          {/* Folders Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {rootFolders.map(folder => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  items={getFolderItems(folder.id)}
                  onOpen={setCurrentFolderId}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}; 