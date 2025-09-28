import { IndexedEntity } from "./core-utils";
import type { Note } from "@shared/types";
import { MOCK_NOTES } from "@shared/mock-data";
// NOTE ENTITY: one DO instance per note
export class NoteEntity extends IndexedEntity<Note> {
  static readonly entityName = "note";
  static readonly indexName = "notes";
  static readonly initialState: Note = {
    id: "",
    title: "Untitled Note",
    content: "",
    createdAt: 0,
    updatedAt: 0,
  };
  static seedData = MOCK_NOTES;
}