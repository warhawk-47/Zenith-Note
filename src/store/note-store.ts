import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Note } from '@shared/types';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
type NoteState = {
  notes: Note[];
  selectedNoteId: string | null;
  isLoading: boolean;
  isSaving: boolean;
  actions: {
    fetchNotes: () => Promise<void>;
    selectNote: (noteId: string | null) => void;
    createNote: () => Promise<void>;
    updateNote: (noteId: string, data: Partial<Pick<Note, 'title' | 'content'>>) => Promise<void>;
    deleteNote: (noteId: string) => Promise<void>;
  };
};
export const useNoteStore = create<NoteState>()(
  immer((set, get) => ({
    notes: [],
    selectedNoteId: null,
    isLoading: true,
    isSaving: false,
    actions: {
      fetchNotes: async () => {
        set({ isLoading: true });
        try {
          const notes = await api<Note[]>('/api/notes');
          set({ notes, isLoading: false });
        } catch (error) {
          console.error('Failed to fetch notes:', error);
          toast.error('Failed to load notes.');
          set({ isLoading: false });
        }
      },
      selectNote: (noteId) => {
        set({ selectedNoteId: noteId });
      },
      createNote: async () => {
        try {
          const newNote = await api<Note>('/api/notes', { method: 'POST' });
          set((state) => {
            state.notes.unshift(newNote);
            state.selectedNoteId = newNote.id;
          });
          toast.success('New note created.');
        } catch (error) {
          console.error('Failed to create note:', error);
          toast.error('Failed to create a new note.');
        }
      },
      updateNote: async (noteId, data) => {
        set({ isSaving: true });
        const originalNotes = get().notes;
        // Optimistic update
        set(state => {
            const note = state.notes.find(n => n.id === noteId);
            if (note) {
                note.title = data.title ?? note.title;
                note.content = data.content ?? note.content;
                note.updatedAt = Date.now();
                // Move updated note to the top
                state.notes = [note, ...state.notes.filter(n => n.id !== noteId)];
            }
        });
        try {
          await api<Note>(`/api/notes/${noteId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
          });
        } catch (error) {
          console.error('Failed to update note:', error);
          toast.error('Failed to save changes.');
          // Rollback on failure
          set(state => {
            const originalNote = originalNotes.find(n => n.id === noteId);
            if (originalNote) {
                const noteIndex = state.notes.findIndex(n => n.id === noteId);
                if (noteIndex !== -1) {
                    state.notes[noteIndex] = originalNote;
                }
            }
          });
        } finally {
          set({ isSaving: false });
        }
      },
      deleteNote: async (noteId) => {
        const originalNotes = get().notes;
        set(state => {
            state.notes = state.notes.filter(n => n.id !== noteId);
            if (state.selectedNoteId === noteId) {
                state.selectedNoteId = state.notes.length > 0 ? state.notes[0].id : null;
            }
        });
        try {
          await api(`/api/notes/${noteId}`, { method: 'DELETE' });
          toast.success('Note deleted.');
        } catch (error) {
          console.error('Failed to delete note:', error);
          toast.error('Failed to delete note.');
          set({ notes: originalNotes });
          if (get().selectedNoteId === null && originalNotes.length > 0) {
            set({ selectedNoteId: noteId });
          }
        }
      },
    },
  }))
);
