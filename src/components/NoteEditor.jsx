import React, { useState, useEffect, useRef } from 'react';

const NoteEditor = () => {
  const [text, setText] = useState('');
  const editorRef = useRef(null);
  const note = { text: 'some text' };

  useEffect(() => {
    editorRef.current?.focus();
  }, []);

  if (note?.text) {
    setText(note.text);
  }

  return (
    <div>
      <textarea
        ref={editorRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
};

export default NoteEditor;