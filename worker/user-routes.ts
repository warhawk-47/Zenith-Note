import { Hono } from "hono";
import type { Env } from './core-utils';
import { NoteEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { Note } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // NOTES API
  app.get('/api/notes', async (c) => {
    await NoteEntity.ensureSeed(c.env);
    const { items } = await NoteEntity.list(c.env);
    // Sort by updatedAt descending
    items.sort((a, b) => b.updatedAt - a.updatedAt);
    return ok(c, items);
  });
  app.post('/api/notes', async (c) => {
    const now = Date.now();
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'Untitled Note',
      content: '',
      createdAt: now,
      updatedAt: now,
    };
    const created = await NoteEntity.create(c.env, newNote);
    return ok(c, created);
  });
  app.get('/api/notes/:id', async (c) => {
    const id = c.req.param('id');
    const noteEntity = new NoteEntity(c.env, id);
    if (!(await noteEntity.exists())) {
      return notFound(c, 'Note not found');
    }
    const note = await noteEntity.getState();
    return ok(c, note);
  });
  app.put('/api/notes/:id', async (c) => {
    const id = c.req.param('id');
    const noteEntity = new NoteEntity(c.env, id);
    if (!(await noteEntity.exists())) {
      return notFound(c, 'Note not found');
    }
    const { title, content } = (await c.req.json()) as Partial<Note>;
    const currentNote = await noteEntity.getState();
    const updatedNote: Note = {
      ...currentNote,
      title: title ?? currentNote.title,
      content: content ?? currentNote.content,
      updatedAt: Date.now(),
    };
    await noteEntity.save(updatedNote);
    return ok(c, updatedNote);
  });
  app.delete('/api/notes/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await NoteEntity.delete(c.env, id);
    if (!deleted) {
      return notFound(c, 'Note not found');
    }
    return ok(c, { id, deleted: true });
  });
}