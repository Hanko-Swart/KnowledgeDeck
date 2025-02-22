import React, { useState } from 'react';
import { Folder } from '@/types/folder';

interface AddNewMenuProps {
  isOpen: boolean;
  onClose: () => void;
  folders: Folder[];
  onAddBookmark?: (folderId: string) => void;
  onAddNote?: (folderId: string) => void;
  onAddFlowDiagram?: (folderId: string) => void;
  onCreateFolder?: (name: string) => void;
}

export const AddNewMenu: React.FC<AddNewMenuProps> = ({
  isOpen,
  onClose,
  folders,
  onAddBookmark,
  onAddNote,
  onAddFlowDiagram,
  onCreateFolder,
}) => {
  const [selectedOption, setSelectedOption] = useState<'bookmark' | 'note' | 'flow' | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleAction = () => {
    if (!selectedFolderId && !isCreatingFolder) return;

    if (isCreatingFolder && newFolderName && onCreateFolder) {
      onCreateFolder(newFolderName);
      setNewFolderName('');
      setIsCreatingFolder(false);
    } else {
      switch (selectedOption) {
        case 'bookmark':
          onAddBookmark?.(selectedFolderId);
          break;
        case 'note':
          onAddNote?.(selectedFolderId);
          break;
        case 'flow':
          onAddFlowDiagram?.(selectedFolderId);
          break;
      }
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed top-16 right-4 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
        <h3 className="text-lg font-medium text-primary-dark mb-4">Add New</h3>
        
        {/* Options */}
        <div className="space-y-2 mb-4">
          <button
            className={`w-full p-3 flex items-center gap-3 rounded-lg transition-colors ${
              selectedOption === 'bookmark'
                ? 'bg-primary-dark text-white'
                : 'hover:bg-secondary/10 text-primary-dark'
            }`}
            onClick={() => setSelectedOption('bookmark')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span>Bookmark Current Page</span>
          </button>

          <button
            className={`w-full p-3 flex items-center gap-3 rounded-lg transition-colors ${
              selectedOption === 'note'
                ? 'bg-primary-dark text-white'
                : 'hover:bg-secondary/10 text-primary-dark'
            }`}
            onClick={() => setSelectedOption('note')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Create New Note</span>
          </button>

          <button
            className={`w-full p-3 flex items-center gap-3 rounded-lg transition-colors ${
              selectedOption === 'flow'
                ? 'bg-primary-dark text-white'
                : 'hover:bg-secondary/10 text-primary-dark'
            }`}
            onClick={() => setSelectedOption('flow')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            <span>Create Flow Diagram</span>
          </button>
        </div>

        {/* Folder Selection */}
        {selectedOption && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Select Folder</label>
            <select
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={selectedFolderId}
              onChange={(e) => {
                setSelectedFolderId(e.target.value);
                setIsCreatingFolder(false);
              }}
            >
              <option value="">Select a folder...</option>
              {folders.map(folder => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
              <option value="new">+ Create New Folder</option>
            </select>

            {/* New Folder Input */}
            {isCreatingFolder && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Enter folder name..."
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
              </div>
            )}

            {/* Action Button */}
            <button
              className={`w-full p-2 rounded-lg mt-4 transition-colors ${
                (selectedFolderId || (isCreatingFolder && newFolderName))
                  ? 'bg-primary text-white hover:bg-primary-dark'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              onClick={handleAction}
              disabled={!selectedFolderId && !isCreatingFolder}
            >
              Create
            </button>
          </div>
        )}
      </div>
    </>
  );
}; 