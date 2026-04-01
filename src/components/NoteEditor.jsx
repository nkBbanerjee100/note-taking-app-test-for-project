import React, { useState, useEffect, useRef } from 'react';
import { noteManager } from '../modules/noteManager';
import './NoteEditor.css';

const NoteEditor = ({ selectedNoteId, onNoteCreated }) => {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const editorRef = useRef(null);

  // Load note content when selectedNoteId changes
  useEffect(() => {
    if (selectedNoteId) {
      const note = noteManager.getNoteById(selectedNoteId);
      if (note) {
        setText(note.content);
        setTitle(note.title);
      }
    } else {
      setText('');
      setTitle('');
    }
  }, [selectedNoteId]);

  // Focus editor when it mounts
  useEffect(() => {
    editorRef.current?.focus();
  }, []);

  const handleSave = () => {
    if (selectedNoteId) {
      noteManager.updateNote(selectedNoteId, { title, content: text });
    }
  };

  const handleCreateNew = () => {
    const newNote = noteManager.createNote(title || 'Untitled', text);
    if (onNoteCreated) {
      onNoteCreated(newNote.id);
    }
  };

  return (
    <div className="note-editor">
      {selectedNoteId ? (
        <>
          <div className="editor-header">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="editor-title-input"
              placeholder="Note title..."
            />
            <button onClick={handleSave} className="save-status">💾 Save</button>
          </div>
          <textarea
            ref={editorRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="editor-content-textarea"
            placeholder="Start typing..."
          />
        </>
      ) : (
        <>
          <h2>No note selected. Create a new one:</h2>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="editor-title-input"
            placeholder="Note title..."
          />
          <textarea
            ref={editorRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="editor-content-textarea"
            placeholder="Start typing..."
          />
          <button onClick={handleCreateNew} style={{
            padding: '10px 16px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.2s ease'
          }}>➕ Create Note</button>
        </>
      )}
    </div>
  );
};

export default NoteEditor;
