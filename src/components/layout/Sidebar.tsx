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
import {
  Folder as FolderIcon,
  FileText,
  Bookmark,
  GitBranch,
  Settings,
  List,
  Grid,
  Upload,
  Download,
  RefreshCw
} from 'lucide-react';
import { ConfirmationModal } from '@components/modals/ConfirmationModal';
import { CreateFolderModal } from '@components/modals/CreateFolderModal';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ThemeToggle } from '@/components/theme/ThemeToggle';

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
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);

  // Convert Note to CardData
  const convertNoteToCard = (note: Note): CardData => ({
    id: note.id,
    type: 'note',
    title: note.title,
    description: note.content,
    tags: note.tags,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
    folderId: note.folderId || undefined,
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

  const handleAddBookmark = async (_folderId: string) => {
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

  const handleAddNote = async (_folderId: string) => {
    // Refresh notes list after note creation
    const updatedNotes = await getNotes();
    setNotes(updatedNotes.map(convertNoteToCard));
  };

  const handleAddFlowDiagram = (folderId: string) => {
    // TODO: Implement flow diagram creation
    console.log('Adding flow diagram to folder:', folderId);
  };

  const handleCreateFolder = (parentId: string | null) => {
    setCurrentFolderId(parentId);
    setIsCreateFolderModalOpen(true);
  };

  const handleFolderCreated = async (folderId: string) => {
    try {
      // Refresh folders from storage
      const updatedFolders = await getFolders();
      setMockFolders(updatedFolders);
      
      // Update UI state
      setIsCreateFolderModalOpen(false);
      setCurrentFolderId(folderId);
    } catch (error) {
      console.error('Failed to refresh folders:', error);
      // TODO: Show error message to user
    }
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
    <div className="flex flex-col h-screen bg-background">
      {/* Main Header */}
      <div className="flex items-center justify-between px-4 h-14 bg-card border-b border-border">
        <h1 className="text-xl font-semibold text-foreground">KnowledgeDeck</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSettingsOpen(true)}
          className="text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Search and Navigation */}
      <div className="flex-none bg-card">
        <div className="p-4 border-b border-border">
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
          <div className="flex items-center justify-between h-14 px-4 bg-card border-b border-border">
            <h2 className="text-lg font-medium text-foreground">My Folders</h2>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-5 w-5 text-foreground" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-5 w-5 text-foreground" />
              </Button>
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
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <FolderIcon className="w-16 h-16 mb-4" />
                <p className="text-sm text-center">
                  No folders yet. Create your first folder to get started!
                  <br />
                  <button
                    onClick={() => handleCreateFolder(null)}
                    className="mt-2 text-primary hover:text-primary/80 transition-colors"
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
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <FileText className="w-16 h-16 mb-4" />
                <p className="text-sm text-center">
                  This folder is empty. Add some content to get started!
                  <br />
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddNote(currentFolder.id)}
                      className="flex items-center gap-1"
                    >
                      <FileText className="h-4 w-4" />
                      Add Note
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddBookmark(currentFolder.id)}
                      className="flex items-center gap-1"
                    >
                      <Bookmark className="h-4 w-4" />
                      Add Bookmark
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddFlowDiagram(currentFolder.id)}
                      className="flex items-center gap-1"
                    >
                      <GitBranch className="h-4 w-4" />
                      Add Flow
                    </Button>
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

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Theme Toggle */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Theme</h3>
              <ThemeToggle />
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <Upload className="h-5 w-5" />
                  Import Bookmarks
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <Download className="h-5 w-5" />
                  Export Data
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <RefreshCw className="h-5 w-5" />
                  Sync Status
                </Button>
              </div>
            </div>

            {/* AI Settings */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">AI Settings</h3>
              <AISettings />
            </div>
          </div>
        </DialogContent>
      </Dialog>

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

      {/* Create Folder Modal */}
      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
        folders={mockFolders}
        currentFolderId={currentFolderId}
        onFolderCreated={handleFolderCreated}
      />
    </div>
  );
}; 