import React, { useState } from 'react';
import type { Folder } from '@/types/folder';
import { CreateNoteModal } from '@components/modals/CreateNoteModal';
import { CreateBookmarkModal } from '@components/modals/CreateBookmarkModal';
import { getCurrentTab } from '@/utils/chrome';

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
  const [isExpanded, setIsExpanded] = useState(false);
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
      <div className="relative bg-white border-t shadow-lg z-30">
        {/* Main Action Bar */}
        <div className="flex items-center justify-between p-2">
          {/* Left Side - Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Add Note */}
            <button
              className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-secondary/10 transition-colors text-primary-dark"
              onClick={() => setIsNoteModalOpen(true)}
            >
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span className="text-xs mt-1">Note</span>
            </button>

            {/* Add Bookmark */}
            <button
              className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-secondary/10 transition-colors text-primary-dark"
              onClick={handleAddBookmark}
            >
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
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              <span className="text-xs mt-1">Bookmark</span>
            </button>

            {/* Add Flow Diagram */}
            <button
              className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-secondary/10 transition-colors text-primary-dark"
              onClick={() => onAddFlowDiagram?.(currentFolderId || '')}
            >
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
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
              <span className="text-xs mt-1">Flow</span>
            </button>

            {/* Create Folder */}
            <button
              className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-secondary/10 transition-colors text-primary-dark"
              onClick={() => onAddFolder?.(currentFolderId)}
            >
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-xs mt-1">Folder</span>
            </button>
          </div>

          {/* Right Side - Expand Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-secondary/10 transition-colors text-primary-dark"
          >
            <svg
              className={`w-6 h-6 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
        </div>

        {/* Expandable Section */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isExpanded ? 'max-h-64' : 'max-h-0'
          }`}
        >
          <div className="p-4 space-y-4">
            {/* Recent Items */}
            <div>
              <h3 className="text-sm font-medium text-primary-dark mb-2">Recent Items</h3>
              <div className="space-y-2">
                {/* Add recent items here */}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-medium text-primary-dark mb-2">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-2 text-sm text-primary-dark hover:bg-secondary/10 rounded-lg transition-colors">
                  Import Bookmarks
                </button>
                <button className="p-2 text-sm text-primary-dark hover:bg-secondary/10 rounded-lg transition-colors">
                  Export Data
                </button>
                <button className="p-2 text-sm text-primary-dark hover:bg-secondary/10 rounded-lg transition-colors">
                  Sync Status
                </button>
                <button className="p-2 text-sm text-primary-dark hover:bg-secondary/10 rounded-lg transition-colors">
                  Settings
                </button>
              </div>
            </div>
          </div>
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