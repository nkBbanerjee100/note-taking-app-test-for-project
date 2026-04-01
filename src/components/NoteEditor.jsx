import React, { useEffect, useState } from 'react';

const NoteEditor = ({ noteManager, selectedNoteId }) => {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    const note = noteManager.getNoteById(selectedNoteId);
    if (note) {
      setText(note.content);
      setTitle(note.title);
    }
  }, [selectedNoteId]);

  return (
    <div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
    </div>
  );
};

export default NoteEditor;