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
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary text-white">
        <div className="flex items-center gap-2">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <span className="text-lg font-semibold">KnowledgeDeck</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title="Create New"
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
          <button
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title="Settings"
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
      </div>

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