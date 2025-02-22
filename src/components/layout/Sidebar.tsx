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
import { FolderOutlined, NoteAddOutlined, BookmarkAddOutlined, AccountTreeOutlined } from '@mui/icons-material';
import { ConfirmationModal } from '@components/modals/ConfirmationModal';

export const Sidebar: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mockFolders, setMockFolders] = useState<Folder[]>([]);
  const [notes, setNotes] = useState<CardData[]>([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    type: 'folder' | 'card';
    id: string;
    name: string;
  } | null>(null);

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
        setMockFolders(storedFolders);

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

  const handleDeleteFolder = async (folderId: string) => {
    const folder = mockFolders.find(f => f.id === folderId);
    if (!folder) return;

    setDeleteConfirmation({
      isOpen: true,
      type: 'folder',
      id: folderId,
      name: folder.name
    });
  };

  const handleDeleteCard = async (cardId: string) => {
    const card = notes.find(n => n.id === cardId);
    if (!card) return;

    setDeleteConfirmation({
      isOpen: true,
      type: 'card',
      id: cardId,
      name: card.title
    });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation) return;

    const { type, id } = deleteConfirmation;

    try {
      if (type === 'folder') {
        // Get all descendant folder IDs (including the folder to delete)
        const folderIdsToDelete = new Set<string>();
        
        const collectFolderIds = (parentId: string) => {
          folderIdsToDelete.add(parentId);
          mockFolders
            .filter(f => f.parentId === parentId)
            .forEach(f => collectFolderIds(f.id));
        };
        
        collectFolderIds(id);
        
        // Remove all folders in the set
        const updatedFolders = mockFolders.filter(f => !folderIdsToDelete.has(f.id));
        
        // Remove all cards in the deleted folders
        const updatedCards = notes.filter(c => c.folderId && !folderIdsToDelete.has(c.folderId));
        
        // Update storage and state
        await saveFolders(updatedFolders);
        setMockFolders(updatedFolders);
        setNotes(updatedCards);
        
        // If we deleted the current folder or any of its ancestors, go back to home
        if (currentFolder && folderIdsToDelete.has(currentFolder.id)) {
          setCurrentFolderId(null);
        }
      } else {
        // Remove the card from state
        const updatedCards = notes.filter(c => c.id !== id);
        setNotes(updatedCards);
        
        // Remove from appropriate storage based on type
        const card = notes.find(n => n.id === id);
        if (card?.type === 'bookmark') {
          await chrome.storage.local.remove([`bookmark_${id}`]);
        } else {
          await chrome.storage.local.remove([`note_${id}`]);
        }
      }

      // Close the confirmation modal
      setDeleteConfirmation(null);
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      // TODO: Show error message to user
    }
  };

  const handleFolderSelect = (folderId: string) => {
    const selectedFolder = mockFolders.find(f => f.id === folderId);
    if (selectedFolder) {
      setCurrentFolderId(selectedFolder.id);
    }
  };

  const handleEditFolder = (folderId: string) => {
    // TODO: Implement folder editing
    console.log('Edit folder:', folderId);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Main Header */}
      <div className="flex items-center justify-between px-4 h-14 bg-white border-b border-gray-200">
        <h1 className="text-xl font-semibold text-primary-dark">KnowledgeDeck</h1>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Search and Navigation */}
      <div className="flex-none bg-white">
        <div className="p-4 border-b border-gray-200">
          <SearchBar onSearch={handleSearch} />
        </div>
        {currentFolder ? (
          <FolderNavigation
            currentFolder={currentFolder}
            folders={mockFolders}
            onBack={() => setCurrentFolderId(null)}
            onFolderSelect={handleFolderSelect}
          />
        ) : (
          <div className="flex items-center justify-between h-14 px-4 bg-white border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">My Folders</h2>
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
          {/* Folder grid or card grid based on current view */}
          {!currentFolder ? (
            mockFolders.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockFolders.map((folder) => (
                  <FolderCard
                    key={folder.id}
                    folder={folder}
                    items={notes.filter(c => c.folderId === folder.id)}
                    onOpen={handleFolderSelect}
                    onClick={handleFolderSelect}
                    onEdit={handleEditFolder}
                    onColorChange={handleColorChange}
                    onDelete={handleDeleteFolder}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <FolderOutlined className="w-16 h-16 mb-4" />
                <p className="text-sm text-center">
                  No folders yet. Create your first folder to get started!
                  <br />
                  <button
                    onClick={() => handleCreateFolder(null)}
                    className="mt-2 text-primary-dark hover:text-primary transition-colors"
                  >
                    Create Folder
                  </button>
                </p>
              </div>
            )
          ) : (
            currentItems.length > 0 ? (
              <CardGrid
                cards={currentItems}
                onCardClick={handleCardClick}
                onCardEdit={handleCardEdit}
                onCardDelete={handleDeleteCard}
                viewMode={viewMode}
                folderColor={currentFolder.color}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <NoteAddOutlined className="w-16 h-16 mb-4" />
                <p className="text-sm text-center">
                  This folder is empty. Add some content to get started!
                  <br />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleAddNote(currentFolder.id)}
                      className="text-primary-dark hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <NoteAddOutlined className="w-4 h-4" />
                      Add Note
                    </button>
                    <button
                      onClick={() => handleAddBookmark(currentFolder.id)}
                      className="text-primary-dark hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <BookmarkAddOutlined className="w-4 h-4" />
                      Add Bookmark
                    </button>
                    <button
                      onClick={() => handleAddFlowDiagram(currentFolder.id)}
                      className="text-primary-dark hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <AccountTreeOutlined className="w-4 h-4" />
                      Add Flow
                    </button>
                  </div>
                </p>
              </div>
            )
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteConfirmation}
        onClose={() => setDeleteConfirmation(null)}
        onConfirm={confirmDelete}
        title={`Delete ${deleteConfirmation?.type === 'folder' ? 'Folder' : 'Item'}`}
        message={deleteConfirmation ? (
          deleteConfirmation.type === 'folder'
            ? `Are you sure you want to delete "${deleteConfirmation.name}" and all its contents? This action cannot be undone.`
            : `Are you sure you want to delete "${deleteConfirmation.name}"? This action cannot be undone.`
        ) : ''}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        type="danger"
      />
    </div>
  );
}; 