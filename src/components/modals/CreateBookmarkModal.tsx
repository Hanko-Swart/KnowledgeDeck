import React, { useState, useEffect } from 'react';
import type { Folder } from '@/types/folder';
import { saveBookmark } from '@/storage/bookmarkStorage';
import { RichTextEditor } from '@components/editor/RichTextEditor';
import { useAI } from '@/hooks/useAI';
import { extractPageContent } from '@/utils/content';

interface CreateBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: Folder[];
  currentFolderId: string | null;
  onBookmarkCreated?: () => void;
  initialUrl?: string;
  initialTitle?: string;
}

export const CreateBookmarkModal: React.FC<CreateBookmarkModalProps> = ({
  isOpen,
  onClose,
  folders,
  currentFolderId,
  onBookmarkCreated,
  initialUrl = '',
  initialTitle = '',
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [url, setUrl] = useState(initialUrl);
  const [description, setDescription] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState(currentFolderId || '');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { generateSummary, isLoading: isAILoading } = useAI();

  useEffect(() => {
    if (isOpen) {
      resetForm();
      if (initialUrl) {
        setUrl(initialUrl);
        loadPageContent(initialUrl);
      }
    }
  }, [isOpen, initialUrl]);

  const resetForm = () => {
    setTitle(initialTitle);
    setUrl(initialUrl);
    setDescription('');
    setSelectedFolderId(currentFolderId || '');
    setTags([]);
    setTagInput('');
    setError(null);
  };

  const loadPageContent = async (urlToLoad: string) => {
    if (!urlToLoad) return;

    try {
      const content = await extractPageContent(urlToLoad);
      setTitle(content.title || initialTitle);
      setDescription(content.metaDescription || '');
    } catch (err) {
      console.error('Failed to extract page content:', err);
      setError('Failed to extract page content');
    }
  };

  const handleUrlChange = async (newUrl: string) => {
    setUrl(newUrl);
    if (newUrl && isValidUrl(newUrl)) {
      await loadPageContent(newUrl);
    }
  };

  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const handleGenerateDescription = async () => {
    setIsGeneratingDescription(true);
    setError(null);
    
    try {
      const content = await extractPageContent(url);
      const summary = await generateSummary(content.content);
      if (summary && summary.trim() !== '') {
        setDescription(summary);
      } else {
        setError('Failed to generate description - empty response from AI service');
      }
    } catch (err) {
      console.error('Failed to generate description:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate description');
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFolderId || !title.trim() || !url.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setError(null);
      await saveBookmark({
        title: title.trim(),
        url: url.trim(),
        description: description || '',
        folderId: selectedFolderId,
        tags,
      });
      onBookmarkCreated?.();
      onClose();
    } catch (error) {
      console.error('Failed to create bookmark:', error);
      setError('Failed to save bookmark. Please try again.');
    }
  };

  const handleTagInput = (input: string) => {
    if (input.endsWith(',') || input.endsWith(' ')) {
      const newTag = input.replace(/[, ]$/, '').trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      return '';
    }
    return input;
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-4 sm:inset-auto sm:top-[5%] sm:left-1/2 sm:-translate-x-1/2 sm:w-[600px] sm:max-h-[90vh] bg-background rounded-lg shadow-lg z-50 flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <h2 className="text-lg font-medium text-foreground">Create New Bookmark</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-accent rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-muted-foreground"
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* URL Input */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                    url && !isValidUrl(url) 
                      ? 'border-destructive focus:ring-destructive' 
                      : 'border-input'
                  } placeholder:text-muted-foreground`}
                  placeholder="Enter webpage URL..."
                  required
                />
                {url && !isValidUrl(url) && (
                  <p className="mt-1 text-sm text-destructive">
                    Please enter a valid URL
                  </p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                  placeholder="Enter bookmark title..."
                  required
                />
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-foreground">
                    Description
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateDescription}
                    className="text-sm text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                    disabled={isGeneratingDescription || isAILoading}
                  >
                    {isGeneratingDescription ? 'Generating...' : 'Generate AI Description'}
                  </button>
                </div>

                <RichTextEditor
                  content={description}
                  onChange={setDescription}
                  placeholder="Enter or generate a description..."
                />
              </div>

              {/* Folder Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Folder
                </label>
                <select
                  value={selectedFolderId}
                  onChange={(e) => setSelectedFolderId(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  <option value="" className="bg-card text-foreground">Select a folder...</option>
                  {folders.map(folder => (
                    <option key={folder.id} value={folder.id} className="bg-card text-foreground">
                      {folder.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-foreground">
                    Tags
                  </label>
                </div>
                
                {/* Tag Input */}
                <div className="flex flex-wrap gap-2 p-2 border border-input rounded-lg min-h-[42px] bg-card">
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-primary/80"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    className="flex-1 min-w-[100px] focus:outline-none bg-transparent text-foreground placeholder:text-muted-foreground"
                    placeholder={tags.length === 0 ? "Add tags..." : ""}
                    value={tagInput}
                    onChange={(e) => {
                      const result = handleTagInput(e.target.value);
                      if (result !== undefined) {
                        setTagInput(result);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.currentTarget.value.trim();
                        if (input && !tags.includes(input)) {
                          setTags([...tags, input]);
                          setTagInput('');
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-lg">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="px-4 py-3 border-t border-border mt-auto shrink-0">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors"
              >
                Save Bookmark
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}; 