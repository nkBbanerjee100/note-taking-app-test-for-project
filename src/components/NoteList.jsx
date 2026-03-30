import React, { useState, useEffect } from 'react';
import { noteManager } from '../modules/noteManager';

function NoteList({ onSelectNote }) {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Load notes when component mounts
  useEffect(() => {
    const loadNotes = () => {
      try {
        setLoading(true);
        const loadedNotes = noteManager.getAllNotes();
        setNotes(loadedNotes);
        setFilteredNotes(loadedNotes);
      } catch (error) {
        console.error('Failed to load notes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotes();

    // Setup event listener for changes
    const handleChange = () => loadNotes();
    noteManager.addChangeListener(handleChange);

    return () => noteManager.removeChangeListener(handleChange);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = notes.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(notes);
    }
  }, [searchQuery, notes]);

  const handleSearch = (e) => setSearchQuery(e.target.value);

  return (
    <div className="notes-list">
      <h2>Your Notes</h2>
      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search notes..."
        />
      </div>
      {loading ? (
        <div>Loading notes...</div>
      ) : (
        <div className="notes-container">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              className="note-item"
              onClick={() => onSelectNote(note.id)}
            >
              <h3>{note.title}</h3>
              <p>{note.content.substring(0, 50)}...</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NoteList;