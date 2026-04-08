import React from 'react';
import { useNoteEditor } from '../hooks/useNoteEditor.js';
import './NoteEditor.css';

const NoteEditor = ({ selectedNoteId, onNoteCreated }) => {
  const {
    editorRef,
    text,
    title,
    setText,
    setTitle,
    handleSave,
    handleCreateNew,
  } = useNoteEditor({ selectedNoteId, onNoteCreated });

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
