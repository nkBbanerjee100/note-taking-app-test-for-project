import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { debounce } from 'lodash';

export default function NoteEditor({ note, onChange, onSave, onDelete, editorRef }) {
  const updateContent = (content) => {
    if (note._id) {
      fetch(`http://localhost:4000/api/notes/${note._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
    }
  };

  const debouncedUpdate = debounce(updateContent, 500);

  const editor = useEditor({
    extensions: [StarterKit],
    content: note.content || '<p>Start writing…</p>',
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      onChange(content);
      debouncedUpdate(content);
    },
  });

  const resetEditor = (content) => {
    editor.commands.setContent(content || '<p>Start writing…</p>');
  };

  useEffect(() => {
    editorRef.current = { editor, resetEditor };
  }, [editor, resetEditor]);

  return (
    <div className="note-editor">
      <div className="editor-toolbar">
        <button onClick={onSave}>💾 Save</button>
        <button onClick={() => onDelete(note)}>🗑️ Delete</button>
      </div>
      <div className="editor-content">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
