import React from 'react';
import { noteManager } from '../modules/noteManager';
import { eventSystem, AppEvents } from '../modules/eventSystem';
import NoteItem from './NoteItem';
import './NoteList.css';

function NoteList({ onSelectNote, selectedNoteId }) {
  const [notes, setNotes] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  // Load notes when component mounts
  React.useEffect(() => {
    const loadNotes = () => {
      try {
        setLoading(true);
        const loadedNotes = noteManager.getAllNotes();
        setNotes(loadedNotes);
      } catch (error) {
        console.error('Failed to load notes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotes();

    // Setup event listeners for note changes
    const unsubscribeCreated = eventSystem.on(AppEvents.NOTE_CREATED, loadNotes);
    const unsubscribeUpdated = eventSystem.on(AppEvents.NOTE_UPDATED, loadNotes);
    const unsubscribeDeleted = eventSystem.on(AppEvents.NOTE_DELETED, loadNotes);
    const unsubscribeLoaded = eventSystem.on(AppEvents.NOTES_LOADED, loadNotes);

    return () => {
      unsubscribeCreated();
      unsubscribeUpdated();
      unsubscribeDeleted();
      unsubscribeLoaded();
    };
  }, []);

  // Memoize filtered notes to prevent unnecessary recalculations
  const filteredNotes = React.useMemo(() => {
    if (searchQuery) {
      return notes.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return notes;
  }, [searchQuery, notes]);

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
