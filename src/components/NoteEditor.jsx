import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export default function NoteEditor({ note, onSave }) {
  const [text, setText] = useState(note?.text || '');
  const editorRef = useRef(null);

  useEffect(() => {
    setText(note?.text || '');
    editorRef.current?.focus();
  }, [note]);

  const handleSave = () => {
    onSave({ ...note, text });
  };

  return (
    <div>
      <textarea
        ref={editorRef}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Write your note here..."
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

NoteEditor.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.string,
    text: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
};