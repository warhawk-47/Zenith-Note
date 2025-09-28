import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNoteStore } from '@/store/note-store';
import { useDebounce } from '@/hooks/useDebounce';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TextareaAutosize from 'react-textarea-autosize';
export function NoteEditor() {
  const notes = useNoteStore((state) => state.notes);
  const selectedNoteId = useNoteStore((state) => state.selectedNoteId);
  const isSaving = useNoteStore((state) => state.isSaving);
  const updateNote = useNoteStore((state) => state.actions.updateNote);
  const selectedNote = useMemo(() => {
    return notes.find(note => note.id === selectedNoteId);
  }, [notes, selectedNoteId]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const debouncedTitle = useDebounce(title, 500);
  const debouncedContent = useDebounce(content, 500);
  const isInitialMount = useRef(true);
  // Effect to update local state when selectedNote changes
  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
      // Reset the initial mount flag on note change to prevent immediate save
      isInitialMount.current = true;
    }
  }, [selectedNote]);
  // Effect for auto-saving, separated from state synchronization
  useEffect(() => {
    // Skip the very first run on component mount or after a new note is selected
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (selectedNote) {
      // Only save if there's an actual change from the selected note's current state in the store
      if (debouncedTitle !== selectedNote.title || debouncedContent !== selectedNote.content) {
        updateNote(selectedNote.id, { title: debouncedTitle, content: debouncedContent });
      }
    }
  }, [debouncedTitle, debouncedContent, selectedNote, updateNote]);
  if (!selectedNote) {
    return <EmptyState />;
  }
  return (
    <div className="h-full flex flex-col">
      <div className="p-6 md:p-8 flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <TextareaAutosize
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Note"
            className="w-full text-3xl md:text-4xl font-bold tracking-tight resize-none bg-transparent border-none focus:outline-none p-0 mb-4 text-foreground placeholder:text-muted-foreground"
          />
          <TextareaAutosize
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing..."
            className="w-full text-lg resize-none bg-transparent border-none focus:outline-none p-0 leading-relaxed text-foreground/90 placeholder:text-muted-foreground min-h-[400px]"
            minRows={15}
          />
        </div>
      </div>
      <footer className="p-4 border-t bg-background/80 backdrop-blur-sm sticky bottom-0">
        <div className="max-w-4xl mx-auto flex items-center justify-end">
          <AnimatePresence mode="wait">
            <motion.div
              key={isSaving ? 'saving' : 'saved'}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              {isSaving ? (
                <>
                  <Save className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Saved</span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </footer>
    </div>
  );
}
function EmptyState() {
  const createNote = useNoteStore((state) => state.actions.createNote);
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8">
      <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
      <h2 className="text-2xl font-semibold">No note selected</h2>
      <p className="text-muted-foreground mt-2 max-w-xs">
        Select a note from the list on the left, or create a new one to get started.
      </p>
      <Button onClick={createNote} className="mt-6">
        Create a new note
      </Button>
    </div>
  );
}