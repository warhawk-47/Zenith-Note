import React, { useState, useMemo } from 'react';
import { useNoteStore } from '@/store/note-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { FilePlus2, Search, Trash2, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
export function NoteList() {
  const notes = useNoteStore((state) => state.notes);
  const selectedNoteId = useNoteStore((state) => state.selectedNoteId);
  const isLoading = useNoteStore((state) => state.isLoading);
  const { selectNote, createNote, deleteNote } = useNoteStore((state) => state.actions);
  const [searchTerm, setSearchTerm] = useState('');
  const filteredNotes = useMemo(() => {
    return notes.filter(note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [notes, searchTerm]);
  const handleDelete = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    deleteNote(noteId);
  };
  if (isLoading) {
    return <NoteListSkeleton />;
  }
  return (
    <div className="flex h-full flex-col bg-muted/50">
      <div className="p-4 space-y-4 border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Zenith Notes</h1>
          <Button size="icon" variant="ghost" onClick={createNote} className="group">
            <FilePlus2 className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <AnimatePresence>
          {filteredNotes.length > 0 ? (
            <div className="p-2">
              {filteredNotes.map((note) => (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <NoteListItem
                    note={note}
                    isSelected={selectedNoteId === note.id}
                    onSelect={() => selectNote(note.id)}
                    onDelete={handleDelete}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center text-sm text-muted-foreground"
            >
              No notes found.
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
}
interface NoteListItemProps {
  note: import('@shared/types').Note;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent, noteId: string) => void;
}
function NoteListItem({ note, isSelected, onSelect, onDelete }: NoteListItemProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
      className={cn(
        'w-full text-left p-3 rounded-lg transition-all duration-200 relative group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        isSelected ? 'bg-primary/10' : 'hover:bg-accent'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 overflow-hidden">
          <h3 className="font-semibold truncate text-foreground">{note.title || 'Untitled Note'}</h3>
          <p className="text-sm text-muted-foreground truncate mt-1">
            {note.content.split('\n')[0] || 'No content'}
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 className="h-4 w-4 text-destructive/70 hover:text-destructive" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the note titled "{note.title}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={(e) => onDelete(e, note.id)} className="bg-destructive hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <p className="text-xs text-muted-foreground/80 mt-2">
        {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
      </p>
      {isSelected && <div className="absolute left-0 top-2 bottom-2 w-1 bg-ring rounded-r-full" />}
    </div>
  );
}
function NoteListSkeleton() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="space-y-2 pt-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-3 border border-transparent rounded-lg">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-3 w-1/2 mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}