import React from 'react';

const NoteEditor = ({ noteManager, selectedNoteId }) => {
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');

  React.useEffect(() => {
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
