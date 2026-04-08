import React, { useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import AuthModal from './AuthModal.jsx';
import './auth.css';

function AuthBar() {
  const { currentUser, logout } = useAuth();
  const [authMode, setAuthMode] = useState(null);

  return (
    <>
      <div className="auth-bar">
        {currentUser ? (
          <>
            <span className="auth-greeting">Welcome, {currentUser.username}</span>
            <button className="auth-btn auth-btn-logout" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="auth-btn auth-btn-ghost" onClick={() => setAuthMode('login')}>
              Login
            </button>
            <button className="auth-btn auth-btn-primary" onClick={() => setAuthMode('signup')}>
              Sign Up
            </button>
          </>
        )}
      </div>
      <AuthModal mode={authMode} onClose={() => setAuthMode(null)} onSwitch={setAuthMode} />
    </>
  );
}

export default AuthBar;