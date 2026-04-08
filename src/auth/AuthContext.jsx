import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { appLogger } from '../modules/logger.js';

const AuthContext = createContext(null);
const API_URL = 'http://localhost:4000/api/auth';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore session on page load
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setCurrentUser(data.user))
      .catch(() => localStorage.removeItem('auth_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (username, password) => {
    setError(null);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('auth_token', data.token);
      setCurrentUser(data.user);
      appLogger.info(`Login success: ${data.user.username}`);
      return { success: true };
    } catch (err) {
      appLogger.error(`Login failed: ${err.message}`);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  const signup = useCallback(async (username, email, password) => {
    setError(null);
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      localStorage.setItem('auth_token', data.token);
      setCurrentUser(data.user);
      appLogger.info(`Signup success: ${data.user.username}`);
      return { success: true };
    } catch (err) {
      appLogger.error(`Signup failed: ${err.message}`);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  const logout = useCallback(() => {
    appLogger.info(`Logout: ${currentUser?.username}`);
    localStorage.removeItem('auth_token');
    setCurrentUser(null);
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx;
}
