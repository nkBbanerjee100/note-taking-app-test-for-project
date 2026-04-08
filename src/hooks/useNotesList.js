import React from 'react';
import { noteManager } from '../modules/noteManager.js';
import { eventSystem, AppEvents } from '../modules/eventSystem.js';
import { matchesSearchQuery } from '../modules/noteUtils.js';

const NOTE_EVENTS = [
  AppEvents.NOTE_CREATED,
  AppEvents.NOTE_UPDATED,
  AppEvents.NOTE_DELETED,
  AppEvents.NOTES_LOADED,
];

export const useNotesList = () => {
  const [notes, setNotes] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  const loadNotes = React.useCallback(() => {
    try {
      setLoading(true);
      setNotes(noteManager.getAllNotes());
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadNotes();

    const unsubscribers = NOTE_EVENTS.map((eventName) =>
      eventSystem.on(eventName, loadNotes)
    );

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [loadNotes]);

  const filteredNotes = React.useMemo(
    () => notes.filter((note) => matchesSearchQuery(note, searchQuery)),
    [notes, searchQuery]
  );

  return {
    notes,
    filteredNotes,
    loading,
    searchQuery,
    setSearchQuery,
  };
};
