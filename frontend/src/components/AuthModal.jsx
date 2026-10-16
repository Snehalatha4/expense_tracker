import React, { useState } from 'react';
import { X, Lock, Mail, User, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginUser, registerUser, demoLogin } from '../services/api';
import confetti from 'canvas-confetti';

const AVATAR_OPTIONS = ['🌸', '🐱', '🦊', '🐼', '🦄', '🌟', '👑', '🚀', '🐶'];

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('🌸');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      toast.error('Please enter your name.');
      return;
    }

    setLoading(true);
    try {
      let res;
      if (mode === 'login') {
        res = await loginUser({ email, password });
      } else {
        res = await registerUser({ name, email, password, avatar });
      }

      if (res && res.data) {
        localStorage.setItem('spendsmart_token', res.data.token);
        localStorage.setItem('spendsmart_user', JSON.stringify(res.data.user));
        toast.success(res.message || 'Logged in successfully! 🌸');

        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#8E7CC3', '#FFB6C1', '#81C784', '#FFD54F']
        });

        onAuthSuccess(res.data.user);
        onClose();
      }
    } catch (err) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-Click Demo Login
  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const res = await demoLogin();

      if (res && res.data) {
        localStorage.setItem('spendsmart_token', res.data.token);
        localStorage.setItem('spendsmart_user', JSON.stringify(res.data.user));
        toast.success(`Welcome to SpendSmart Demo, ${res.data.user.name}! ✨`);

        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });

        onAuthSuccess(res.data.user);
        onClose();
      }
    } catch (err) {
      toast.error(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay modal-backdrop" onClick={onClose} style={{ zIndex: 2500 }}>
      <div
        className="modal-content modal-container auth-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px', padding: '2rem', position: 'relative' }}
      >
        {/* Close Button */}
        <button
          className="btn-icon-only modal-close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              margin: '0 auto 0.75rem',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, rgba(142, 124, 195, 0.2), rgba(255, 182, 193, 0.3))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem'
            }}
          >
            {avatar}
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.25rem' }}>
            {mode === 'login' ? 'Welcome Back! ✨' : 'Join SpendSmart 🌸'}
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            {mode === 'login'
              ? 'Log in to track expenses, savings goals & achievements'
              : 'Create an account to start winning your financial targets'}
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-full)',
            padding: '4px',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-color)'
          }}
        >
          <button
            type="button"
            className="btn"
            style={{
              flex: 1,
              borderRadius: 'var(--radius-full)',
              background: mode === 'login' ? 'var(--bg-card)' : 'transparent',
              color: mode === 'login' ? 'var(--accent-lavender-dark)' : 'var(--text-muted)',
              fontWeight: '700',
              boxShadow: mode === 'login' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              padding: '0.5rem',
              fontSize: '0.88rem'
            }}
            onClick={() => setMode('login')}
          >
            Log In
          </button>
          <button
            type="button"
            className="btn"
            style={{
              flex: 1,
              borderRadius: 'var(--radius-full)',
              background: mode === 'register' ? 'var(--bg-card)' : 'transparent',
              color: mode === 'register' ? 'var(--accent-lavender-dark)' : 'var(--text-muted)',
              fontWeight: '700',
              boxShadow: mode === 'register' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              padding: '0.5rem',
              fontSize: '0.88rem'
            }}
            onClick={() => setMode('register')}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode === 'register' && (
            <>
              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={15} /> Your Name
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Sneha"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Avatar Picker */}
              <div>
                <label className="form-label">Pick Your Cute Avatar</label>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setAvatar(av)}
                      style={{
                        width: '38px',
                        height: '38px',
                        fontSize: '1.2rem',
                        borderRadius: 'var(--radius-md)',
                        border: avatar === av ? '2px solid var(--accent-lavender)' : '1px solid var(--border-color)',
                        background: avatar === av ? 'var(--accent-lavender-light)' : 'var(--bg-secondary)',
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)'
                      }}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Mail size={15} /> Email Address
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={15} /> Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '2.5rem' }}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', fontWeight: '700' }}
            disabled={loading}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Log In to SpendSmart ✨' : 'Create My Account 🌸'}
          </button>
        </form>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            margin: '1.25rem 0',
            color: 'var(--text-muted)',
            fontSize: '0.78rem'
          }}
        >
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          <span style={{ padding: '0 0.75rem' }}>OR TRY INSTANTLY</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
        </div>

        {/* 1-Click Demo Login */}
        <button
          type="button"
          className="btn btn-outline"
          onClick={handleDemoLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.65rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            background: 'linear-gradient(135deg, rgba(255, 182, 193, 0.15), rgba(142, 124, 195, 0.15))',
            borderColor: 'var(--accent-lavender)'
          }}
        >
          <Sparkles size={16} style={{ color: 'var(--accent-lavender)' }} />
          <span>One-Click Instant Demo Login</span>
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
