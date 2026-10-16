import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Trophy,
  Target,
  ReceiptText,
  Sun,
  Moon,
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { loginUser, registerUser, demoLogin } from '../services/api';

const AVATAR_OPTIONS = ['🌸', '🐱', '🦊', '🐼', '🦄', '🌟', '👑', '🚀', '🐶'];

const AuthPage = ({ onAuthSuccess, theme, onToggleTheme }) => {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('🌸');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#8E7CC3', '#FFB6C1', '#81C784', '#FFD54F']
        });

        onAuthSuccess(res.data.user);
      }
    } catch (err) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-Click Instant Demo Login (Guaranteed rich sample values)
  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const res = await demoLogin();

      if (res && res.data) {
        localStorage.setItem('spendsmart_token', res.data.token);
        localStorage.setItem('spendsmart_user', JSON.stringify(res.data.user));
        toast.success(`Welcome to SpendSmart Demo, ${res.data.user.name}! ✨`);

        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });

        onAuthSuccess(res.data.user);
      }
    } catch (err) {
      toast.error(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      {/* Theme Toggle Top Right */}
      <button
        className="btn-icon-only auth-theme-toggle"
        onClick={onToggleTheme}
        title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Cozy Dark Theme'}
      >
        {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
      </button>

      <div className="auth-page-inner">
        {/* Left Column: Brand & Features Overview */}
        <div className="auth-hero-column">
          <div className="sidebar-brand" style={{ marginBottom: '1.75rem' }}>
            <div className="brand-icon">
              <span>🌸</span>
            </div>
            <div className="brand-text">
              <h1>SpendSmart</h1>
              <span className="brand-tagline">Little steps, smarter spending.</span>
            </div>
          </div>

          <h2 className="auth-hero-title">
            Take control of your money & celebrate every target you win! ✨
          </h2>

          <p className="auth-hero-desc">
            Sign in to access your personal finance dashboard, track income & expenses, set monthly spending limits, and reach dream savings milestones.
          </p>

          <div className="auth-features-list">
            <div className="auth-feature-item">
              <div className="auth-feature-icon" style={{ background: 'rgba(142, 124, 195, 0.2)', color: 'var(--accent-lavender-dark)' }}>
                <ReceiptText size={20} />
              </div>
              <div>
                <h4>Smart Money Tracking</h4>
                <p>Categorized spending, payment breakdowns, and interactive monthly analytics.</p>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-icon" style={{ background: 'rgba(255, 182, 193, 0.3)', color: '#D81B60' }}>
                <Target size={20} />
              </div>
              <div>
                <h4>Dream Savings Targets</h4>
                <p>Set targets for tech gadgets, emergency funds, or trips and watch your progress grow.</p>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-icon" style={{ background: 'rgba(255, 213, 79, 0.3)', color: '#D97706' }}>
                <Trophy size={20} />
              </div>
              <div>
                <h4>Winning Celebrations & Trophies</h4>
                <p>Hit 100% on any target to unlock fanfare chimes, confetti showers, and achievement badges!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Auth Card */}
        <div className="auth-card-column">
          <div className="auth-card">
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  margin: '0 auto 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'linear-gradient(135deg, rgba(142, 124, 195, 0.25), rgba(255, 182, 193, 0.35))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  boxShadow: '0 8px 20px rgba(142, 124, 195, 0.25)'
                }}
              >
                {avatar}
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>
                {mode === 'login' ? 'Welcome Back!' : 'Create Your Account 🌸'}
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                {mode === 'login'
                  ? 'Please sign in to access your financial dashboard'
                  : 'Start your journey towards smart spending & winning targets'}
              </p>
            </div>

            {/* Mode Switch Tabs */}
            <div className="auth-tabs">
              <button
                type="button"
                className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
                onClick={() => setMode('login')}
              >
                Log In
              </button>
              <button
                type="button"
                className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
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
                            fontSize: '1.25rem',
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
                    placeholder="Enter password"
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
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  fontSize: '0.98rem',
                  fontWeight: '700',
                  marginTop: '0.5rem',
                  boxShadow: '0 6px 20px rgba(142, 124, 195, 0.4)'
                }}
                disabled={loading}
              >
                {loading
                  ? 'Please wait...'
                  : mode === 'login'
                  ? 'Log In to SpendSmart ✨'
                  : 'Create My Account 🌸'}
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

            {/* 1-Click Instant Demo Login */}
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleDemoLogin}
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: 'linear-gradient(135deg, rgba(255, 182, 193, 0.2), rgba(142, 124, 195, 0.2))',
                borderColor: 'var(--accent-lavender)',
                fontWeight: '700',
                color: 'var(--accent-lavender-dark)'
              }}
            >
              <Sparkles size={17} style={{ color: 'var(--accent-lavender)' }} />
              <span>One-Click Instant Demo Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
