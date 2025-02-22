import React, { useState } from 'react';
import type { Folder } from '@/types/folder';
import { CreateNoteModal } from '@components/modals/CreateNoteModal';
import { CreateBookmarkModal } from '@components/modals/CreateBookmarkModal';
import { getCurrentTab } from '@/utils/chrome';
import {
  Plus,
  FileText,
  Bookmark,
  GitBranch,
  Folder as FolderIcon
} from 'lucide-react';

interface BottomActionBarProps {
  folders: Folder[];
  currentFolderId: string | null;
  onAddNote?: (folderId: string) => void;
  onAddBookmark?: (folderId: string) => void;
  onAddFlowDiagram?: (folderId: string) => void;
  onAddFolder?: (parentId: string | null) => void;
}

export const BottomActionBar: React.FC<BottomActionBarProps> = ({
  folders,
  currentFolderId,
  onAddNote,
  onAddBookmark,
  onAddFlowDiagram,
  onAddFolder,
}) => {
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const [bookmarkInitialData, setBookmarkInitialData] = useState({ url: '', title: '' });

  const handleAddBookmark = async () => {
    const tabInfo = await getCurrentTab();
    setBookmarkInitialData({
      url: tabInfo?.url || '',
      title: tabInfo?.title || '',
    });
    setIsBookmarkModalOpen(true);
  };

  return (
    <>
      <div className="bg-white border-t shadow-lg">
        <div className="flex items-center justify-around p-2">
          <button
            onClick={() => setIsNoteModalOpen(true)}
            className="flex flex-col items-center p-2 text-primary-dark hover:bg-secondary/10 rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span className="text-xs mt-1">Note</span>
          </button>
          <button
            onClick={handleAddBookmark}
            className="flex flex-col items-center p-2 text-primary-dark hover:bg-secondary/10 rounded-lg transition-colors"
          >
            <Bookmark className="h-4 w-4" />
            <span className="text-xs mt-1">Bookmark</span>
          </button>
          <button
            onClick={() => onAddFolder?.(currentFolderId)}
            className="flex flex-col items-center p-2 text-primary-dark hover:bg-secondary/10 rounded-lg transition-colors"
          >
            <FolderIcon className="h-4 w-4" />
            <span className="text-xs mt-1">Folder</span>
          </button>
          <button
            onClick={() => onAddFlowDiagram?.(currentFolderId || '')}
            className="flex flex-col items-center p-2 text-primary-dark hover:bg-secondary/10 rounded-lg transition-colors"
          >
            <GitBranch className="h-4 w-4" />
            <span className="text-xs mt-1">Flow</span>
          </button>
        </div>
      </div>

      {/* Create Note Modal */}
      <CreateNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        folders={folders}
        currentFolderId={currentFolderId}
        onNoteCreated={() => {
          setIsNoteModalOpen(false);
          onAddNote?.(currentFolderId || '');
        }}
      />

      {/* Create Bookmark Modal */}
      <CreateBookmarkModal
        isOpen={isBookmarkModalOpen}
        onClose={() => setIsBookmarkModalOpen(false)}
        folders={folders}
        currentFolderId={currentFolderId}
        onBookmarkCreated={() => {
          setIsBookmarkModalOpen(false);
          onAddBookmark?.(currentFolderId || '');
        }}
        initialUrl={bookmarkInitialData.url}
        initialTitle={bookmarkInitialData.title}
      />
    </>
  );
}; 