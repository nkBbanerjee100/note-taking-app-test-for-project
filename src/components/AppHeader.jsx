// src/components/AppHeader.jsx
import { useEffect } from "react";

export default function AppHeader() {
  useEffect(() => {
    // Side‑effects that do not synchronously call setState
    const timer = setTimeout(() => {
      // Any optional setup could go here
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return <header>App Header</header>;
}
