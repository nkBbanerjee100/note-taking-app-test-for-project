/**
 * Note Manager Module - Handles note CRUD operations
 * Connects to: Logger, EventSystem, Storage
 */

import { appLogger } from './logger.js';
import { eventSystem, AppEvents } from './eventSystem.js';
import { storage } from './storage.js';

class NoteManager {
  constructor() {
    this.logger = appLogger;
    this.logger.info('NoteManager initialized');
    this.loadNotes();
    this.setupEventListeners();
  }

  /**
   * Setup listeners for external events
   */
  setupEventListeners() {
    eventSystem.on(AppEvents.STORAGE_CHANGED, (data) => {
      this.logger.debug('Storage changed event received', data);
      if (data.action === 'write' || data.action === 'init') {
        this.loadNotes();
      }
    });

    this.logger.info('NoteManager event listeners setup complete');
  }

  /**
   * Load notes from storage
   */
  loadNotes() {
    try {
      const notes = storage.getNotes();
      this.notes = notes;
      this.logger.info(`Loaded ${notes.length} notes into manager`);
      eventSystem.emit(AppEvents.NOTES_LOADED, { count: notes.length });
      return notes;
    } catch (error) {
      this.logger.error('Failed to load notes', error);
      eventSystem.emit(AppEvents.ERROR_OCCURRED, { module: 'NoteManager', error: error.message });
      this.notes = [];
      return [];
    }
  }

  /**
   * Get all notes
   */
  getAllNotes() {
    this.logger.debug(`Retrieving all notes (${this.notes.length} total)`);
    return [...this.notes];
  }

  /**
   * Get a note by ID
   */
  getNoteById(id) {
    const note = this.notes.find(n => n.id === id);
    if (!note) {
      this.logger.warn(`Note not found: ${id}`);
    }
    return note || null;
  }

  /**
   * Create a new note
   */
  createNote(title = 'Untitled', content = '') {
    try {
      const id = this.generateId();
      const now = new Date().toISOString();

      const note = {
        id,
        title: title || 'Untitled',
        content,
        createdAt: now,
        updatedAt: now,
        tags: []
      };

      storage.addNote(note);
      this.notes.push(note);

      this.logger.info(`Note created: ${id}`, { title, contentLength: content.length });
      eventSystem.emit(AppEvents.NOTE_CREATED, { id, title });
      
      return note;
    } catch (error) {
      this.logger.error('Failed to create note', error);
      eventSystem.emit(AppEvents.ERROR_OCCURRED, { module: 'NoteManager', error: error.message });
      return null;
    }
  }

  /**
   * Update an existing note
   */
  updateNote(id, updates) {
    try {
      const noteIndex = this.notes.findIndex(n => n.id === id);
      
      if (noteIndex === -1) {
        this.logger.warn(`Cannot update: Note not found (${id})`);
        return null;
      }

      const updatedNote = {
        ...this.notes[noteIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      storage.updateNote(id, updatedNote);
      this.notes[noteIndex] = updatedNote;

      this.logger.info(`Note updated: ${id}`, { title: updatedNote.title, contentLength: updatedNote.content.length });
      eventSystem.emit(AppEvents.NOTE_UPDATED, { id, title: updatedNote.title });
      
      return updatedNote;
    } catch (error) {
      this.logger.error('Failed to update note', error);
      eventSystem.emit(AppEvents.ERROR_OCCURRED, { module: 'NoteManager', error: error.message });
      return null;
    }
  }

  generateId() {
    // implement id generation logic here
  }
}