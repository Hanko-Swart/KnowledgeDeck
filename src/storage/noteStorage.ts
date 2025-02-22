import { Note } from '@/types/note';

const NOTES_STORAGE_KEY = 'knowledgeDeck_notes';

export const getNotes = async (): Promise<Note[]> => {
  const result = await chrome.storage.local.get(NOTES_STORAGE_KEY);
  return result[NOTES_STORAGE_KEY] || [];
};

export const saveNote = async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
  const notes = await getNotes();
  
  const newNote: Note = {
    ...note,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await chrome.storage.local.set({
    [NOTES_STORAGE_KEY]: [...notes, newNote],
  });

  return newNote;
};

export const updateNote = async (noteId: string, updates: Partial<Note>): Promise<Note> => {
  const notes = await getNotes();
  const noteIndex = notes.findIndex(note => note.id === noteId);
  
  if (noteIndex === -1) {
    throw new Error(`Note with id ${noteId} not found`);
  }

  const updatedNote = {
    ...notes[noteIndex],
    ...updates,
    updatedAt: new Date(),
  };

  notes[noteIndex] = updatedNote;
  
  await chrome.storage.local.set({
    [NOTES_STORAGE_KEY]: notes,
  });

  return updatedNote;
};

export const deleteNote = async (noteId: string): Promise<void> => {
  const notes = await getNotes();
  const filteredNotes = notes.filter(note => note.id !== noteId);
  
  await chrome.storage.local.set({
    [NOTES_STORAGE_KEY]: filteredNotes,
  });
}; 