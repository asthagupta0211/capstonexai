import React, { useState } from 'react';
import { Sparkles, LogIn, UserPlus, Lock, Mail, User, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api.js';
import { AuthUser } from '../../types/index.js';

interface AuthPortalProps {
  onAuthenticated: (user: AuthUser) => void;
  onBackToLanding?: () => void;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({ onAuthenticated, onBackToLanding }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        if (!name.trim()) {
          throw new Error('Please enter your full name.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        const data = await api.register(email.trim(), password, name.trim());
        onAuthenticated(data.user);
      } else {
        const data = await api.login(email.trim(), password);
        onAuthenticated(data.user);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        background: 'radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.15), transparent 45%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.12), transparent 40%), var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Glow Grid */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      <div style={{ width: '100%', maxWidth: '460px', position: 'relative', zIndex: 1 }}>
        {onBackToLanding && (
          <div style={{ marginBottom: '1.25rem', textAlign: 'left' }}>
            <button
              onClick={onBackToLanding}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--cyan)',
                cursor: 'pointer',
                fontSize: '0.825rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.2rem 0',
              }}
            >
              <span>← Back to Project Overview</span>
            </button>
          </div>
        )}

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              margin: '0 auto 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px var(--primary-glow)',
            }}
          >
            <Sparkles size={28} color="#ffffff" />
          </div>
          <h1
            style={{
              fontSize: '1.875rem',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: '#ffffff',
              marginBottom: '0.4rem',
            }}
          >
            Capstonex<span style={{ color: 'var(--cyan)' }}>.AI</span>
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            AI-Powered Project Idea Generator & Capstone Mentor
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-card" style={{ padding: '2.25rem', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)' }}>
          {/* Tab Switcher */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(0, 0, 0, 0.35)',
              padding: '0.3rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.75rem',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              style={{
                flex: 1,
                padding: '0.6rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-xs)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: mode === 'login' ? 'var(--primary)' : 'transparent',
                color: mode === 'login' ? '#ffffff' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
              }}
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              style={{
                flex: 1,
                padding: '0.6rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-xs)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: mode === 'register' ? 'var(--primary)' : 'transparent',
                color: mode === 'register' ? '#ffffff' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
              }}
            >
              <UserPlus size={15} />
              <span>Create Account</span>
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.75rem 1rem',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: 'var(--radius-sm)',
                color: '#fca5a5',
                fontSize: '0.825rem',
                marginBottom: '1.25rem',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="form-group" style={{ marginBottom: '1.15rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={14} color="var(--primary)" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Sarah Connor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '1.15rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={14} color="var(--primary)" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Lock size={14} color="var(--primary)" />
                <span>Password</span>
              </label>
              <input
                type="password"
                className="form-input"
                placeholder={mode === 'register' ? 'At least 6 characters' : 'Enter your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 0 20px var(--primary-glow)',
              }}
            >
              {loading ? (
                <span>Authenticating with MongoDB Atlas...</span>
              ) : mode === 'login' ? (
                <>
                  <span>Sign In to Studio</span>
                  <ArrowRight size={16} />
                </>
              ) : (
                <>
                  <span>Create Capstone Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Quick Demo Credentials */}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setEmail('hackathon.judge@capstonex.ai');
                setPassword('Capstone2026!');
                if (mode === 'register') setName('Evaluation Judge');
              }}
              style={{
                width: '100%',
                marginTop: '0.65rem',
                fontSize: '0.775rem',
                color: 'var(--cyan)',
                border: '1px dashed rgba(6, 182, 212, 0.35)',
              }}
              title="Click to fill test credentials for immediate evaluation"
            >
              <Sparkles size={13} color="var(--warning)" />
              <span>Fill Quick Test Credentials</span>
            </button>
          </form>

          {/* Secure Guarantee */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
            }}
          >
            <ShieldCheck size={14} color="var(--emerald)" />
            <span>Encrypted BCrypt authentication stored in MongoDB Atlas</span>
          </div>
        </div>
      </div>
    </div>
  );
};
