import React, { useState } from 'react';
import { Lock, ArrowRight, AlertCircle, Sun, Moon } from 'lucide-react';
import { api } from '../api';

export const LoginScreen = ({ onLogin, theme = 'light', onToggleTheme }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await api.login(password);
      if (data?.token) {
        onLogin(data.token);
      } else {
        setError('Authentication failed');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--login-bg)',
      padding: '20px',
      position: 'relative'
    }}>
      {/* Theme Switcher in top right */}
      {onToggleTheme && (
        <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
          <button
            onClick={onToggleTheme}
            className="btn btn-secondary"
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title={theme === 'dark' ? 'Включить дневную тему' : 'Включить ночную тему'}
          >
            {theme === 'dark' ? (
              <>
                <Sun size={15} color="#0eb0ee" />
                <span>Дневная</span>
              </>
            ) : (
              <>
                <Moon size={15} color="#42672e" />
                <span>Ночная</span>
              </>
            )}
          </button>
        </div>
      )}

      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '420px',
        padding: '40px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img
            src="/images/logo.png"
            alt="Jera Plus"
            style={{ height: '42px', margin: '0 auto 16px', display: 'block', filter: 'brightness(1.05)' }}
          />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)' }}>Operations Control CMS</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginTop: '4px' }}>
            Commodity Trading & Content Management
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ color: 'var(--text-main)' }}>Master Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                style={{ paddingLeft: '40px' }}
                autoComplete="current-password"
              />
              <Lock size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '13px', marginTop: '10px' }}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Jera Plus Management Console &bull; Protected Zone
        </div>
      </div>
    </div>
  );
};
