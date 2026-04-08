import React from 'react';
import NoteItem from './NoteItem';
import { useNotesList } from '../hooks/useNotesList.js';
import './NoteList.css';

function NoteList({ onSelectNote, selectedNoteId }) {
  const { notes, filteredNotes, loading, searchQuery, setSearchQuery } = useNotesList();

  // Memoize handleSearch to prevent prop changes
  const handleSearch = React.useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  // Memoize onSelectNote wrapper to prevent recreation on parent updates
  const handleSelectNote = React.useCallback((noteId) => {
    onSelectNote(noteId);
  }, [onSelectNote]);

  return (
    <div className="notes-list">
      <h2 style={{ padding: '16px', margin: 0, borderBottom: '1px solid #e0e0e0' }}>Your Notes</h2>
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
          placeholder="Search notes..."
        />
        {notes.length > 0 && <span className="note-count">{filteredNotes.length}</span>}
      </div>
      {loading ? (
        <div style={{ padding: '24px', textAlign: 'center', color: '#999' }}>Loading notes...</div>
      ) : (
        <div className="notes-container">
          {filteredNotes.length === 0 ? (
            <div className="empty-state">No notes found</div>
          ) : (
            filteredNotes.map(note => (
              <NoteItem
                key={note.id}
                note={note}
                isSelected={selectedNoteId === note.id}
                onSelect={() => handleSelectNote(note.id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NoteList;
