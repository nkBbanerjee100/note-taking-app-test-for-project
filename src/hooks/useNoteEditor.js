import { useCallback, useEffect, useRef, useState } from 'react';
import { noteManager } from '../modules/noteManager.js';
import { DEFAULT_NOTE_TITLE } from '../modules/noteUtils.js';

export const useNoteEditor = ({ selectedNoteId, onNoteCreated }) => {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const editorRef = useRef(null);

  useEffect(() => {
    if (!selectedNoteId) {
      setText('');
      setTitle('');
      return;
    }

    const note = noteManager.getNoteById(selectedNoteId);
    if (note) {
      setText(note.content);
      setTitle(note.title);
    }
  }, [selectedNoteId]);

  useEffect(() => {
    editorRef.current?.focus();
  }, []);

  const handleSave = useCallback(() => {
    if (!selectedNoteId) {
      return null;
    }

    return noteManager.updateNote(selectedNoteId, { title, content: text });
  }, [selectedNoteId, text, title]);

  const handleCreateNew = useCallback(() => {
    const newNote = noteManager.createNote(title || DEFAULT_NOTE_TITLE, text);
    if (newNote && onNoteCreated) {
      onNoteCreated(newNote.id);
    }
    return newNote;
  }, [onNoteCreated, text, title]);

  return {
    editorRef,
    text,
    title,
    setText,
    setTitle,
    handleSave,
    handleCreateNew,
  };
};
