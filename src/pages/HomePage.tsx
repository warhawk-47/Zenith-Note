import React, { useEffect } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { NoteList } from '@/components/NoteList';
import { NoteEditor } from '@/components/NoteEditor';
import { useNoteStore } from '@/store/note-store';
import { Toaster } from '@/components/ui/sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
export function HomePage() {
  const fetchNotes = useNoteStore((state) => state.actions.fetchNotes);
  const selectNote = useNoteStore((state) => state.actions.selectNote);
  const selectedNoteId = useNoteStore((state) => state.selectedNoteId);
  const isMobile = useIsMobile();
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);
  if (isMobile) {
    return (
      <div className="h-screen w-screen overflow-hidden relative bg-background">
        <ThemeToggle className="absolute top-2 right-2" />
        <AnimatePresence mode="wait">
          {!selectedNoteId ? (
            <motion.div
              key="list"
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="h-full w-full absolute inset-0"
            >
              <NoteList />
            </motion.div>
          ) : (
            <motion.div
              key="editor"
              initial={{ x: '100%' }}
              animate={{ x: '0%' }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="h-full w-full absolute inset-0 flex flex-col"
            >
              <div className="p-2 border-b">
                <button
                  onClick={() => selectNote(null)}
                  className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-accent"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to notes
                </button>
              </div>
              <div className="flex-1">
                <NoteEditor />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <Toaster richColors />
      </div>
    );
  }
  return (
    <main className="h-screen bg-background text-foreground">
      <div className="h-full max-w-screen-2xl mx-auto border-x">
        <ResizablePanelGroup direction="horizontal" className="h-full items-stretch">
          <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
            <NoteList />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={75}>
            <NoteEditor />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <Toaster richColors closeButton />
      <ThemeToggle />
    </main>
  );
}