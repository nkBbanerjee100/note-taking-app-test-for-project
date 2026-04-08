import { describe, expect, it, vi } from 'vitest';
import { noteManager } from './noteManager.js';
import { eventSystem, AppEvents } from './eventSystem.js';

describe('noteManager', () => {
  it('creates a note, persists it, and emits NOTE_CREATED', () => {
    const listener = vi.fn();
    const unsubscribe = eventSystem.on(AppEvents.NOTE_CREATED, listener);

    const createdNote = noteManager.createNote('Project Plan', 'Write the testing checklist', ['work']);

    expect(createdNote).toMatchObject({
      title: 'Project Plan',
      content: 'Write the testing checklist',
      tags: ['work'],
    });
    expect(noteManager.getAllNotes()).toHaveLength(1);
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ id: createdNote.id }));

    unsubscribe();
  });

  it('searches notes by title, content, and tags', () => {
    noteManager.createNote('Groceries', 'Milk and bread', ['home']);
    noteManager.createNote('Sprint Notes', 'Discussed release blockers', ['work']);

    expect(noteManager.searchNotes('milk')).toHaveLength(1);
    expect(noteManager.searchNotes('release')).toHaveLength(1);
    expect(noteManager.searchNotes('work')).toHaveLength(1);
  });

  it('updates tag membership and reports aggregate statistics', () => {
    const createdNote = noteManager.createNote('Daily Log', 'two words', ['journal']);

    noteManager.addTag(createdNote.id, 'personal');
    noteManager.removeTag(createdNote.id, 'journal');

    expect(noteManager.getNotesByTag('personal')).toHaveLength(1);
    expect(noteManager.getNotesByTag('journal')).toHaveLength(0);
    expect(noteManager.getStatistics()).toMatchObject({
      totalNotes: 1,
      totalWords: 2,
      totalCharacters: 'two words'.length,
      totalTags: 1,
    });
  });
});
