import { appLogger } from './logger.js';
import { eventSystem, AppEvents } from './eventSystem.js';
import { storage } from './storage.js';
import {
  countWords,
  matchesSearchQuery,
  normalizeNotePayload,
  sortNotesByUpdatedAt,
} from './noteUtils.js';

class NoteManager {
  constructor() {
    this.logger = appLogger;
    eventSystem.on(AppEvents.STORAGE_CHANGED, () => {
      eventSystem.emit(AppEvents.NOTES_LOADED, this.getAllNotes());
    });
  }

  generateId() {
    return `note-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  getAllNotes() {
    return sortNotesByUpdatedAt(storage.getNotes());
  }

  getNoteById(id) {
    return storage.getNoteById(id);
  }

  createNote(title = 'Untitled', content = '', tags = []) {
    const now = new Date().toISOString();
    const note = normalizeNotePayload({
      id: this.generateId(),
      title,
      content,
      tags,
      createdAt: now,
      updatedAt: now,
    });

    const saved = storage.addNote(note);
    if (!saved) {
      return null;
    }

    this.logger.info(`Note created: ${note.id}`);
    eventSystem.emit(AppEvents.NOTE_CREATED, note);
    return note;
  }

  updateNote(id, updates = {}) {
    const existingNote = storage.getNoteById(id);
    if (!existingNote) {
      this.logger.warn(`Cannot update missing note: ${id}`);
      return null;
    }

    const updatedNote = normalizeNotePayload({
      existingNote,
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    const saved = storage.updateNote(id, updatedNote);
    if (!saved) {
      return null;
    }

    this.logger.info(`Note updated: ${id}`);
    eventSystem.emit(AppEvents.NOTE_UPDATED, updatedNote);
    return updatedNote;
  }

  deleteNote(id) {
    const deleted = storage.deleteNote(id);
    if (deleted) {
      this.logger.info(`Note deleted: ${id}`);
      eventSystem.emit(AppEvents.NOTE_DELETED, { id });
    }
    return deleted;
  }

  searchNotes(query = '') {
    return this.getAllNotes().filter((note) => matchesSearchQuery(note, query));
  }

  getNotesByTag(tag) {
    const normalizedTag = String(tag).trim().toLowerCase();
    if (!normalizedTag) {
      return [];
    }

    return this.getAllNotes().filter((note) =>
      (note.tags || []).some((entry) => entry.toLowerCase() === normalizedTag)
    );
  }

  addTag(noteId, tag) {
    const note = this.getNoteById(noteId);
    if (!note) {
      return null;
    }

    return this.updateNote(noteId, {
      tags: [...(note.tags || []), tag],
    });
  }

  removeTag(noteId, tag) {
    const note = this.getNoteById(noteId);
    if (!note) {
      return null;
    }

    const normalizedTag = String(tag).trim().toLowerCase();
    return this.updateNote(noteId, {
      tags: (note.tags || []).filter((entry) => entry.toLowerCase() !== normalizedTag),
    });
  }

  getStatistics() {
    const notes = this.getAllNotes();
    const allTags = notes.flatMap((note) => note.tags || []);

    return {
      totalNotes: notes.length,
      totalWords: notes.reduce((sum, note) => sum + countWords(note.content), 0),
      totalCharacters: notes.reduce((sum, note) => sum + (note.content || '').length, 0),
      totalTags: new Set(allTags).size,
      lastUpdated: notes[0]?.updatedAt ?? null,
    };
  }

  clearAll() {
    const cleared = storage.clearAllNotes();
    if (cleared) {
      eventSystem.emit(AppEvents.NOTES_LOADED, []);
    }
    return cleared;
  }
}

const noteManager = new NoteManager();

export { NoteManager, noteManager };
