import React, { useState, useEffect } from 'react';
import type { Folder } from '@/types/folder';
import { saveFolders } from '@/storage/folderStorage';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: Folder[];
  currentFolderId: string | null;
  onFolderCreated?: (folderId: string) => void;
}

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  isOpen,
  onClose,
  folders,
  currentFolderId,
  onFolderCreated,
}) => {
  const [folderName, setFolderName] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(currentFolderId);
  const [selectedColor, setSelectedColor] = useState<string>('#10656d'); // Default color

  const colors = [
    '#0c3547', // Very dark blue
    '#10656d', // Very dark cyan
    '#598f91', // Mostly desaturated dark cyan
    '#93b071', // Mostly desaturated dark green
    '#ede2cc', // Light grayish orange
    '#edae93', // Very soft orange
    '#dd6670', // Soft red
  ];

  useEffect(() => {
    if (!isOpen) {
      setFolderName('');
      setSelectedParentId(currentFolderId);
      setSelectedColor('#10656d');
    } else {
      setSelectedParentId(currentFolderId);
    }
  }, [isOpen, currentFolderId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    const newFolder: Folder = {
      id: Date.now().toString(),
      name: folderName.trim(),
      parentId: selectedParentId,
      color: selectedColor,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      // Save the updated folders list
      await saveFolders([...folders, newFolder]);
      onFolderCreated?.(newFolder.id);
      onClose();
    } catch (error) {
      console.error('Failed to create folder:', error);
      // TODO: Show error message to user
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-background rounded-lg shadow-lg border border-border sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-foreground">New Folder</h3>
            <button
              onClick={onClose}
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Folder Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Folder Name
              </label>
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                placeholder="Enter folder name..."
                required
              />
            </div>

            {/* Parent Folder Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Parent Folder (Optional)
              </label>
              <select
                value={selectedParentId || ''}
                onChange={(e) => setSelectedParentId(e.target.value || null)}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">No parent (root level)</option>
                {folders.map(folder => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Folder Color
              </label>
              <div className="flex flex-wrap gap-2">
                {colors.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? 'border-primary scale-110'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="mt-4 p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: selectedColor }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="white"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-foreground" style={{ color: selectedColor }}>
                    {folderName || 'New Folder'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedParentId
                      ? `Inside: ${folders.find(f => f.id === selectedParentId)?.name}`
                      : 'Root level folder'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-foreground bg-background border border-input rounded-lg hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                disabled={!folderName.trim()}
              >
                Create Folder
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 