import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import './auth.css';

function AuthModal({ mode, onClose, onSwitch }) {
  const { login, signup } = useAuth();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (mode) {
      setFormData({ username: '', email: '', password: '' });
      setErrorMsg('');
    }
  }, [mode]);

  if (!mode) return null;
  const isLogin = mode === 'login';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    const result = isLogin
      ? await login(formData.username, formData.password)
      : await signup(formData.username, formData.email, formData.password);
    setSubmitting(false);
    if (result.success) onClose();
    else setErrorMsg(result.error);
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose} aria-label="Close">×</button>

        <div className="auth-modal-header">
          <div className="auth-modal-icon">{isLogin ? '🔐' : '✨'}</div>
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="auth-modal-subtitle">
            {isLogin ? 'Sign in to continue to your notes' : 'Join us and start taking notes'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Username</label>
            <input type="text" name="username" placeholder="johndoe"
              value={formData.username} onChange={handleChange} required autoFocus />
          </div>

          {!isLogin && (
            <div className="auth-field">
              <label>Email</label>
              <input type="email" name="email" placeholder="john@example.com"
                value={formData.email} onChange={handleChange} required />
            </div>
          )}

          <div className="auth-field">
            <label>Password</label>
            <input type="password" name="password" placeholder="••••••••"
              value={formData.password} onChange={handleChange} required />
          </div>

          {errorMsg && (
            <div style={{
              padding: '10px 14px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              color: '#fca5a5',
              fontSize: '13px'
            }}>
              {errorMsg}
            </div>
          )}

          <div className="auth-actions">
            <button type="button" className="auth-btn auth-btn-ghost" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="auth-btn auth-btn-primary" disabled={submitting}>
              {submitting ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="auth-switch">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button onClick={() => onSwitch(isLogin ? 'signup' : 'login')}>
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;