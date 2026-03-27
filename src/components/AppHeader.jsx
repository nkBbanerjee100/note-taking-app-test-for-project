import React, { useEffect, useState } from 'react';
import { noteManager, appLogger, eventSystem, AppEvents } from '../services';

const AppHeader = () => {
  const [stats, setStats] = useState({ totalNotes: 0 });

  // Define updateStats before it is used
  const updateStats = () => {
    const newStats = noteManager.getStatistics();
    setStats(newStats);
    appLogger.debug('AppHeader: Stats updated');
  };

  useEffect(() => {
    appLogger.info('AppHeader component mounted');
    updateStats();
    // Update stats when notes change
    const unsubscribeCreated = eventSystem.on(AppEvents.NOTE_CREATED, updateStats);
    return () => {
      unsubscribeCreated();
    };
  }, []);

  return (
    <header className="app-header">
      <h1>Note Taking App</h1>
      <p>Total Notes: {stats.totalNotes}</p>
    </header>
  );
};

export default AppHeader;