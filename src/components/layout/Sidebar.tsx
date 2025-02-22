import React, { useState, useEffect } from 'react';
import { SearchBar } from '@components/search/SearchBar';
import { CardGrid } from '@components/cards/CardGrid';
import { FolderCard } from '@components/folders/FolderCard';
import { FolderNavigation } from '@components/navigation/FolderNavigation';
import type { CardData } from '@components/cards/Card';
import type { Folder } from '@/types/folder';
import type { Note } from '@/types/note';
import { AddNewMenu } from '@components/modals/AddNewMenu';
import { getFolders, saveFolders } from '@/storage/folderStorage';
import { getNotes } from '@/storage/noteStorage';
import { BottomActionBar } from '@components/layout/BottomActionBar';
import { AISettings } from '@components/settings/AISettings';
import { getAllBookmarks } from '@/storage/bookmarkStorage';

export const Sidebar: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mockFolders, setMockFolders] = useState<Folder[]>([]);
  const [notes, setNotes] = useState<CardData[]>([]);

  // Convert Note to CardData
  const convertNoteToCard = (note: Note): CardData => ({
    id: note.id,
    type: 'note',
    title: note.title,
    description: note.content,
    tags: note.tags,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
    folderId: note.folderId,
  });

  // Load folders and notes from storage on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load folders
        const storedFolders = await getFolders();
        if (storedFolders.length > 0) {
          setMockFolders(storedFolders);
        } else {
          // Initialize with default folders if none exist
          const defaultFolders: Folder[] = [
            { id: '1', name: 'Research', parentId: null, color: '#1a4d63' },
            { id: '2', name: 'Projects', parentId: null },
            { id: '3', name: 'Articles', parentId: '1' },
            { id: '4', name: 'Ideas', parentId: '2' },
          ];
          setMockFolders(defaultFolders);
          await saveFolders(defaultFolders);
        }

        // Load notes and convert them to CardData
        const storedNotes = await getNotes();
        const noteCards = storedNotes.map(convertNoteToCard);

        // Load bookmarks and convert them to CardData
        const storedBookmarks = await getAllBookmarks();
        const bookmarkCards = storedBookmarks.map(bookmark => ({
          id: bookmark.id,
          type: 'bookmark' as const,
          title: bookmark.title,
          description: bookmark.description,
          url: bookmark.url,
          tags: bookmark.tags,
          createdAt: new Date(bookmark.createdAt),
          updatedAt: new Date(bookmark.updatedAt),
          folderId: bookmark.folderId,
          screenshot: bookmark.screenshot,
        }));

        // Combine notes and bookmarks
        setNotes([...noteCards, ...bookmarkCards]);
      } catch (error) {
        console.error('Failed to load data:', error);
        // TODO: Show error message to user
      }
    };
    loadData();
  }, []);

  // Save folders whenever they change
  useEffect(() => {
    saveFolders(mockFolders);
  }, [mockFolders]);

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
    return notes.filter(c => 
      c.folderId === folderId || childFolderIds.includes(c.folderId || '')
    );
  };

  // Get current folder and its items
  const currentFolder = currentFolderId 
    ? mockFolders.find(f => f.id === currentFolderId)
    : null;
  const currentItems = currentFolderId 
    ? notes.filter(c => c.folderId === currentFolderId)
    : [];

  const handleColorChange = (folderId: string, color: string) => {
    setMockFolders(prev => {
      const updated = prev.map(folder => 
        folder.id === folderId 
          ? { ...folder, color } 
          : folder
      );
      return updated;
    });
  };

  const handleAddBookmark = async (folderId: string) => {
    // Refresh bookmarks list after bookmark creation
    const updatedBookmarks = await getAllBookmarks();
    const bookmarkCards = updatedBookmarks.map(bookmark => ({
      id: bookmark.id,
      type: 'bookmark' as const,
      title: bookmark.title,
      description: bookmark.description,
      url: bookmark.url,
      tags: bookmark.tags,
      createdAt: new Date(bookmark.createdAt),
      updatedAt: new Date(bookmark.updatedAt),
      folderId: bookmark.folderId,
    }));
    setNotes(prev => [...prev.filter(note => note.type !== 'bookmark'), ...bookmarkCards]);
  };

  const handleAddNote = async (folderId: string) => {
    // Refresh notes list after note creation
    const updatedNotes = await getNotes();
    setNotes(updatedNotes.map(convertNoteToCard));
  };

  const handleAddFlowDiagram = (folderId: string) => {
    // TODO: Implement flow diagram creation
    console.log('Adding flow diagram to folder:', folderId);
  };

  const handleCreateFolder = (parentId: string | null) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: `New Folder ${mockFolders.length + 1}`,
      parentId,
    };
    setMockFolders(prev => [...prev, newFolder]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Search and Navigation */}
      <div className="flex-none p-4 border-b border-gray-200">
        <SearchBar onSearch={handleSearch} />
        {currentFolder ? (
          <FolderNavigation
            currentFolder={currentFolder}
            folders={mockFolders}
            onBack={() => setCurrentFolderId(null)}
            onFolderSelect={setCurrentFolderId}
          />
        ) : (
          <div className="flex items-center justify-between mt-4">
            <h2 className="text-lg font-medium text-primary-dark">My Folders</h2>
            <div className="flex items-center gap-2">
              <button
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setViewMode('list')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setViewMode('grid')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {currentFolder ? (
            <CardGrid
              cards={currentItems}
              onCardClick={handleCardClick}
              onCardEdit={handleCardEdit}
              viewMode={viewMode}
              folderColor={currentFolder.color}
            />
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {rootFolders.map(folder => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  items={getFolderItems(folder.id)}
                  onOpen={setCurrentFolderId}
                  onColorChange={handleColorChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex-none">
        <BottomActionBar
          folders={mockFolders}
          currentFolderId={currentFolderId}
          onAddNote={handleAddNote}
          onAddBookmark={handleAddBookmark}
          onAddFlowDiagram={handleAddFlowDiagram}
          onAddFolder={handleCreateFolder}
        />
      </div>

      {/* Modals */}
      <AddNewMenu
        isOpen={isAddMenuOpen}
        onClose={() => setIsAddMenuOpen(false)}
        onAddBookmark={handleAddBookmark}
        onAddNote={handleAddNote}
        onAddFlowDiagram={handleAddFlowDiagram}
        folders={mockFolders}
        onCreateFolder={handleCreateFolder}
      />

      {isSettingsOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsSettingsOpen(false)}
          />
          <div className="absolute inset-4 sm:inset-auto sm:top-[5%] sm:left-1/2 sm:-translate-x-1/2 sm:w-[600px] sm:max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-medium">AI Settings</h2>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <AISettings />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 