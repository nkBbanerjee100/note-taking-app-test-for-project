// NoteList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { noteManager, eventSystem, AppEvents } from '../utils/noteManager';

const NoteList = ({ onSelectNote }) => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const updateFilteredNotes = useCallback((notesArray, query) => {
    if (!query.trim()) {
      setFilteredNotes(notesArray);
      return;
    }

    const queryLower = query.toLowerCase();
    const filtered = notesArray.filter(note =>
      note.title.toLowerCase().includes(queryLower) ||
      note.content.toLowerCase().includes(queryLower) ||
      note.tags.some(tag => tag.toLowerCase().includes(queryLower))
    );
    setFilteredNotes(filtered);
  }, []);

  useEffect(() => {
    // Load initial notes
    const loadedNotes = noteManager.getAllNotes();
    setNotes(loadedNotes);
    updateFilteredNotes(loadedNotes, searchQuery);

    // Setup event listeners
    const unsubscribeCreated = eventSystem.on(AppEvents.NOTE_CREATED, () => {
      const updatedNotes = noteManager.getAllNotes();
      setNotes(updatedNotes);
      updateFilteredNotes(updatedNotes, searchQuery);
    });

    const unsubscribeUpdated = eventSystem.on(AppEvents.NOTE_UPDATED, () => {
      const updatedNotes = noteManager.getAllNotes();
      setNotes(updatedNotes);
      updateFilteredNotes(updatedNotes, searchQuery);
    });

    const unsubscribeDeleted = eventSystem.on(AppEvents.NOTE_DELETED, () => {
      const updatedNotes = noteManager.getAllNotes();
      setNotes(updatedNotes);
      updateFilteredNotes(updatedNotes, searchQuery);
    });

    return () => {
      unsubscribeCreated();
      unsubscribeUpdated();
      unsubscribeDeleted();
    };
  }, [searchQuery, updateFilteredNotes]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    updateFilteredNotes(notes, query);
  };

  const handleNoteClick = (note) => {
    onSelectNote(note.id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="note-list">
      <div className="list-header">
        <h2>All Notes ({filteredNotes.length})</h2>
        <input
          type="text"
          className="search-input"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="notes-container">
        {filteredNotes.length === 0 ? (
          <div className="empty-state">
            {searchQuery ? 'No notes match your search.' : 'No notes yet. Create one!'}
          </div>
        ) : (
          filteredNotes.map(note => (
            <div
              key={note.id}
              className="note-item"
              onClick={() => handleNoteClick(note)}
            >
              <div className="note-item-header">
                <h3 className="note-title">{note.title || 'Untitled'}</h3>
                <span className="note-date">
                  {formatDate(note.updatedAt || note.createdAt)}
                </span>
              </div>
              <p className="note-preview">
                {note.content.substring(0, 100)}
                {note.content.length > 100 ? '...' : ''}
              </p>
              <div className="note-tags">
                {note.tags.map(tag => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NoteList;