import React, { useState, useEffect, useCallback } from 'react';
import { noteManager } from '../utils/noteManager';

function NoteEditor({ selectedNoteId, onSave, onDelete, onNavigate }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selectedNoteId) {
      const loadNote = async () => {
        setLoading(true);
        try {
          const note = noteManager.getNote(selectedNoteId);
          if (note) {
            setTitle(note.title);
            setContent(note.content);
          }
        } catch (error) {
          console.error('Failed to load note:', error);
        } finally {
          setLoading(false);
        }
      };

      loadNote();
    } else {
      resetEditor();
    }
  }, [selectedNoteId]);

  const resetEditor = useCallback(() => {
    setTitle('');
    setContent('');
  }, []);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleContentChange = (e) => setContent(e.target.value);

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title for your note');
      return;
    }

    try {
      setSaving(true);
      const noteData = { title: title.trim(), content };
      
      if (selectedNoteId) {
        noteManager.updateNote(selectedNoteId, noteData);
      } else {
        noteManager.addNote(noteData);
        onNavigate('notes');
      }
      
      if (onSave) onSave();
      resetEditor();
    } catch (error) {
      console.error('Failed to save note:', error);
      alert('Failed to save note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedNoteId || !window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      setSaving(true);
      noteManager.deleteNote(selectedNoteId);
      if (onDelete) onDelete();
      onNavigate('notes');
    } catch (error) {
      console.error('Failed to delete note:', error);
      alert('Failed to delete note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="note-editor">
      <div className="editor-header">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Note title..."
          disabled={loading || saving}
        />
      </div>
      <textarea
        value={content}
        onChange={handleContentChange}
        placeholder="Start typing your note here..."
        disabled={loading || saving}
      />
      <div className="editor-actions">
        <button
          onClick={handleSave}
          disabled={loading || saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        {selectedNoteId && (
          <button
            onClick={handleDelete}
            disabled={loading || saving}
            className="delete-button"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default NoteEditor;