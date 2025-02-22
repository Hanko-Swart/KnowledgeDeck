import React, { useState } from 'react';
import type { Folder } from '@/types/folder';
import { CreateNoteModal } from '@components/modals/CreateNoteModal';

interface BottomActionBarProps {
  onAddBookmark?: (folderId: string) => void;
  onAddNote?: (folderId: string) => void;
  onAddFlowDiagram?: (folderId: string) => void;
  onCreateFolder?: (name: string) => void;
  currentFolderId: string | null;
  folders: Folder[];
}

export const BottomActionBar: React.FC<BottomActionBarProps> = ({
  onAddBookmark,
  onAddNote,
  onAddFlowDiagram,
  onCreateFolder,
  currentFolderId,
  folders,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg transition-all duration-300 z-50">
        {/* Main Bar */}
        <div className="flex items-center justify-between px-4 h-16">
          {/* Quick Actions */}
          <div className="flex items-center gap-4">
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
              onClick={() => onAddBookmark?.(currentFolderId || '')}
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
              onClick={() => onCreateFolder?.('New Folder')}
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
                  d="M9 13h6m-3-3v6m-9-6h.01M4 20h16a2 2 0 002-2V8a2 2 0 00-2-2h-7.93a2 2 0 01-1.66-.9l-.82-1.2A2 2 0 008.93 3H4a2 2 0 00-2 2v13c0 1.1.9 2 2 2z"
                />
              </svg>
              <span className="text-xs mt-1">Folder</span>
            </button>
          </div>

          {/* More Actions */}
          <button
            className={`p-2 rounded-lg hover:bg-secondary/10 transition-all transform ${
              isExpanded ? 'rotate-180' : ''
            } text-primary-dark`}
            onClick={() => setIsExpanded(!isExpanded)}
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
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* Expanded Panel */}
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
      />
    </>
  );
}; 