// NoteEditor.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { noteManager, eventSystem, AppEvents, appLogger } from '../utils/noteManager';

const NoteEditor = ({ selectedNoteId }) => {
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [isSaved, setIsSaved] = useState(true);

  const loadNote = useCallback((noteId) => {
    const loadedNote = noteManager.getNoteById(noteId);
    if (loadedNote) {
      setNote(loadedNote);
      setTitle(loadedNote.title || '');
      setContent(loadedNote.content || '');
      setTags(loadedNote.tags || []);
      setIsSaved(true);
      appLogger.debug(`NoteEditor: Loaded note ${noteId}`);
    }
  }, []);

  const resetEditor = useCallback(() => {
    setNote(null);
    setTitle('');
    setContent('');
    setTags([]);
    setIsSaved(true);
    appLogger.debug('NoteEditor: Reset to empty state');
  }, []);

  useEffect(() => {
    if (selectedNoteId) {
      loadNote(selectedNoteId);
    } else {
      resetEditor();
    }

    // Listen for note updates from other sources
    const unsubscribeUpdated = eventSystem.on(AppEvents.NOTE_UPDATED, (updatedNote) => {
      if (selectedNoteId === updatedNote.id) {
        loadNote(selectedNoteId);
      }
    });

    const unsubscribeDeleted = eventSystem.on(AppEvents.NOTE_DELETED, (deletedNoteId) => {
      if (selectedNoteId === deletedNoteId) {
        resetEditor();
      }
    });

    return () => {
      unsubscribeUpdated();
      unsubscribeDeleted();
    };
  }, [selectedNoteId, loadNote, resetEditor]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setIsSaved(false);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setIsSaved(false);
  };

  const handleTagsChange = (newTags) => {
    setTags(newTags);
    setIsSaved(false);
  };

  const handleSave = () => {
    if (!title.trim()) {
      appLogger.warn('NoteEditor: Cannot save note without title');
      return;
    }

    const noteData = {
      id: note ? note.id : undefined,
      title: title.trim(),
      content: content.trim(),
      tags,
      updatedAt: new Date().toISOString(),
    };

    if (note) {
      noteManager.updateNote(noteData);
      eventSystem.emit(AppEvents.NOTE_UPDATED, noteData);
    } else {
      const newNote = noteManager.createNote(noteData);
      eventSystem.emit(AppEvents.NOTE_CREATED, newNote);
    }

    setIsSaved(true);
    appLogger.info(`NoteEditor: Saved note ${noteData.id || 'new'}`);
  };

  const handleDelete = () => {
    if (!note) return;

    if (window.confirm('Are you sure you want to delete this note?')) {
      noteManager.deleteNote(note.id);
      eventSystem.emit(AppEvents.NOTE_DELETED, note.id);
      resetEditor();
      appLogger.info(`NoteEditor: Deleted note ${note.id}`);
    }
  };

  return (
    <div className="note-editor">
      <div className="editor-header">
        <input
          type="text"
          className="title-input"
          placeholder="Note Title"
          value={title}
          onChange={handleTitleChange}
        />
        <div className="editor-actions">
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={isSaved}
          >
            {isSaved ? 'Saved' : 'Save'}
          </button>
          {note && (
            <button
              className="delete-btn"
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="tags-section">
        <input
          type="text"
          className="tags-input"
          placeholder="Add tags (comma separated)"
          value={tags.join(', ')}
          onChange={(e) => handleTagsChange(e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
        />
      </div>

      <textarea
        className="content-textarea"
        placeholder="Start writing your note here..."
        value={content}
        onChange={handleContentChange}
        rows={20}
      />

      <div className="editor-footer">
        <span className="status-indicator">
          Status: {isSaved ? 'Saved' : 'Unsaved'}
        </span>
        {note && (
          <span className="note-id">
            ID: {note.id}
          </span>
        )}
      </div>
    </div>
  );
};

export default NoteEditor;