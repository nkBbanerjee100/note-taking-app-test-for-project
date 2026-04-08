import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from './App.jsx';

describe('App integration', () => {
  it('creates, selects, searches, updates, and deletes a note through the UI', async () => {
    vi.stubGlobal('confirm', vi.fn(() => true));

    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('Note title...'), {
      target: { value: 'Meeting Notes' },
    });
    fireEvent.change(screen.getByPlaceholderText('Start typing...'), {
      target: { value: 'Capture action items for the release.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /create note/i }));

    await screen.findByText('Meeting Notes');
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();

    fireEvent.change(screen.getAllByPlaceholderText('Note title...')[0], {
      target: { value: 'Release Plan' },
    });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await screen.findByText('Release Plan');

    fireEvent.change(screen.getByPlaceholderText('Search notes...'), {
      target: { value: 'release' },
    });
    expect(screen.getByText('Release Plan')).toBeInTheDocument();

    fireEvent.click(screen.getByTitle('Delete note'));

    await waitFor(() => {
      expect(screen.getByText('No notes found')).toBeInTheDocument();
    });
  });
});
