/**
 * App Component - Main application container
 * Orchestrates all modules and components
 * Uses: NoteManager, EventSystem, Logger, Auth
 */
import React, { useState, useCallback } from 'react';
import { appLogger } from './modules/logger.js';
import AppHeader from './components/AppHeader.jsx';
import NoteList from './components/NoteList.jsx';
import NoteEditor from './components/NoteEditor.jsx';
import CRUDDemo from './components/CRUDDemo.jsx';
import ViewSwitcher from './components/ViewSwitcher.jsx';
import { AuthProvider } from './auth/AuthContext.jsx';
import AuthBar from './auth/AuthBar.jsx';
import './App.css';

function App() {
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [viewMode, setViewMode] = useState('notes');

  const handleSelectNote = useCallback((noteId) => {
    setSelectedNoteId(noteId);
    appLogger.debug(`App: Selected note ${noteId}`);
  }, []);

  const handleNoteCreated = useCallback((noteId) => {
    setSelectedNoteId(noteId);
    appLogger.debug(`App: New note created ${noteId}`);
  }, []);

  const switchView = useCallback((mode) => {
    setViewMode(mode);
    appLogger.info(`App view switched to ${mode}`);
  }, []);

  return (
    <AuthProvider>
      <div className="app-container">
        <AuthBar />
        <AppHeader />
        <ViewSwitcher viewMode={viewMode} onSwitch={switchView} />
        {viewMode === 'notes' ? (
          <div className="app-content">
            <div className="sidebar">
              <NoteList onSelectNote={handleSelectNote} selectedNoteId={selectedNoteId} />
            </div>
            <div className="main-content">
              <NoteEditor selectedNoteId={selectedNoteId} onNoteCreated={handleNoteCreated} />
            </div>
          </div>
        ) : (
          <div className="crud-container">
            <CRUDDemo />
          </div>
        )}
      </div>
    </AuthProvider>
  );
}

export default App;