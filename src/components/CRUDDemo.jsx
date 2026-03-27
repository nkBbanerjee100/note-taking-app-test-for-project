import React, { useEffect, useState } from 'react';
import { crudService, eventSystem, appLogger } from '../services';

const CRUDDemo = () => {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ totalItems: 0 });

  // Define updateStats before it is used
  const updateStats = () => {
    const newStats = crudService.statistics();
    setStats(newStats);
    appLogger.debug('CRUDDemo: Statistics updated');
  };

  useEffect(() => {
    const allItems = crudService.read();
    setItems(allItems);
    updateStats();
    // Listen to CRUD events
    const unsubscribe = eventSystem.on('product:created', () => {
      const updatedItems = crudService.read();
      setItems(updatedItems);
      updateStats();
    });
    return () => {
      unsubscribe();
    };
  }, [crudService]);

  return (
    <div className="crud-demo">
      <h2>CRUD Demo</h2>
      <p>Total Items: {stats.totalItems}</p>
    </div>
  );
};

export default CRUDDemo;