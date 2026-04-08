/**
 * App Component - Main application container
 * Orchestrates all modules and components
 * Uses: NoteManager, EventSystem, Logger
 */

import React, { useState, useCallback } from 'react';
import { appLogger } from './modules/logger.js';
import AppHeader from './components/AppHeader.jsx';
import NoteList from './components/NoteList.jsx';
import NoteEditor from './components/NoteEditor.jsx';
import CRUDDemo from './components/CRUDDemo.jsx';
import ViewSwitcher from './components/ViewSwitcher.jsx';
import './App.css';

function App() {
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [viewMode, setViewMode] = useState('notes'); // 'notes' or 'crud'

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
    <div className="app-container">
      {viewMode === 'notes' ? (
        <>
          <AppHeader />
          
          <ViewSwitcher viewMode={viewMode} onSwitch={switchView} />

          <div className="app-content">
            <div className="sidebar">
              <NoteList
                onSelectNote={handleSelectNote}
                selectedNoteId={selectedNoteId}
              />
            </div>
            
            <div className="main-content">
              <NoteEditor
                selectedNoteId={selectedNoteId}
                onNoteCreated={handleNoteCreated}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <AppHeader />
          
          <ViewSwitcher viewMode={viewMode} onSwitch={switchView} />

          <div className="crud-container">
            <CRUDDemo />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
