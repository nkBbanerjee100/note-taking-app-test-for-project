// src/components/CRUDDemo.jsx
import React, { useEffect, useState } from "react";

export default function CRUDDemo() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Simulate fetching or initializing items without triggering a synchronous state update
    const timer = setTimeout(() => {
      setItems([]); // replace with real data as needed
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <h2>CRUD Demo</h2>
      {items.length === 0 && <p>No items available.</p>}
      <ul>{items.map(item => (<li key={item.id}>{item.name}</li>))}</ul>
    </div>
  );
}
