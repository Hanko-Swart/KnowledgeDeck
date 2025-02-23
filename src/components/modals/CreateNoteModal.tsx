import React, { useState, useEffect } from 'react';
import type { Folder } from '@/types/folder';
import { saveNote } from '@/storage/noteStorage';
import { RichTextEditor } from '@components/editor/RichTextEditor';
import { noteTemplates } from '@/templates/noteTemplates';
import { useAI } from '@/hooks/useAI';
import { Sparkles, SparklesIcon } from 'lucide-react';

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: Folder[];
  currentFolderId: string | null;
  onNoteCreated?: () => void;
}

export const CreateNoteModal: React.FC<CreateNoteModalProps> = ({
  isOpen,
  onClose,
  folders,
  currentFolderId,
  onNoteCreated,
}) => {
  const { error: aiError, generateTags, generateSummary } = useAI();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState(currentFolderId || '');
  const [tags, setTags] = useState<string[]>([]);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('blank');

  const resetForm = () => {
    setTitle('');
    setContent('');
    setSelectedFolderId(currentFolderId || '');
    setTags([]);
    setSuggestedTags([]);
    setSelectedTemplate('blank');
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    } else {
      setSelectedFolderId(currentFolderId || '');
    }
  }, [isOpen, currentFolderId]);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = noteTemplates.find(t => t.id === templateId);
    if (template) {
      if (templateId !== 'blank') {
        setContent(template.content);
        if (!title) {
          setTitle(`New ${template.name}`);
        }
      } else {
        const isContentFromTemplate = noteTemplates.some(t => t.content === content);
        if (isContentFromTemplate) {
          setContent('');
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFolderId || !title.trim()) return;

    setIsCreating(true);
    try {
      await saveNote({
        title: title.trim(),
        content,
        folderId: selectedFolderId,
        tags,
        template: selectedTemplate,
        type: 'note',
      });
      onNoteCreated?.();
      onClose();
    } catch (error) {
      console.error('Failed to create note:', error);
    } finally {
      setIsCreating(false);
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

  const handleGenerateAITags = async () => {
    if (!content) return;
    
    setIsGeneratingTags(true);
    try {
      const generatedTags = await generateTags(content);
      setSuggestedTags(generatedTags);
    } catch (error) {
      console.error('Failed to generate tags:', error);
    } finally {
      setIsGeneratingTags(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!content) return;
    
    setIsGeneratingSummary(true);
    try {
      const summary = await generateSummary(content);
      setContent(prev => `${prev}\n\nSummary:\n${summary}`);
    } catch (error) {
      console.error('Failed to generate summary:', error);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const addSuggestedTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setSuggestedTags(suggestedTags.filter(t => t !== tag));
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
          <h2 className="text-lg font-medium text-foreground">New Note</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
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

        {/* Content - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Template
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {noteTemplates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name} - {template.description}
                  </option>
                ))}
              </select>
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
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter note title..."
                required
              />
            </div>

            {/* Rich Text Editor */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-foreground">
                  Content
                </label>
                <button
                  type="button"
                  onClick={handleGenerateSummary}
                  className="text-sm text-primary hover:text-primary/80 transition-colors disabled:opacity-50 flex items-center gap-1"
                  disabled={isGeneratingSummary || !content}
                >
                  <Sparkles className={`h-4 w-4 ${isGeneratingSummary ? 'animate-spin' : ''}`} />
                  Summarize
                </button>
              </div>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Start writing..."
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
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="">Select a folder...</option>
                {folders.map(folder => (
                  <option key={folder.id} value={folder.id}>
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
                <button
                  type="button"
                  onClick={handleGenerateAITags}
                  className="text-sm text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                  disabled={isGeneratingTags || !content}
                >
                  {isGeneratingTags ? 'Generating...' : 'Generate AI Tags'}
                </button>
              </div>
              
              {/* Tag Input */}
              <div className="flex flex-wrap gap-2 p-2 border border-input rounded-lg bg-background min-h-[42px]">
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
                  onChange={(e) => {
                    const newValue = handleTagInput(e.target.value);
                    e.target.value = newValue;
                  }}
                />
              </div>

              {/* Suggested Tags */}
              {suggestedTags.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-1">Suggested tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addSuggestedTag(tag)}
                        className="px-2 py-1 rounded-md bg-secondary/20 text-secondary-foreground text-sm hover:bg-secondary/30 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Error Message */}
              {aiError && (
                <p className="mt-2 text-sm text-destructive">
                  {aiError}
                </p>
              )}
            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="flex items-center justify-end gap-3 px-4 py-3 border-t border-border mt-auto shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || !selectedFolderId || !title.trim()}
              className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50"
            >
              {isCreating ? 'Creating...' : 'Create Note'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}; 