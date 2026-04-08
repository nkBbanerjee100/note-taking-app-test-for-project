import React from 'react';

function ViewSwitcher({ viewMode, onSwitch }) {
  const options = [
    { id: 'notes', label: '📝 Notes' },
    { id: 'crud', label: '🔄 CRUD Demo' },
  ];

  return (
    <div className="view-switcher">
      {options.map((option) => (
        <button
          key={option.id}
          className={`switcher-btn ${viewMode === option.id ? 'active' : ''}`}
          onClick={() => onSwitch(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default React.memo(ViewSwitcher);
