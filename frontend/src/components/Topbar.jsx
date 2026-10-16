import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Minus,
  Calendar,
  Sun,
  Moon,
  Target,
  Trophy,
  LogIn,
  LogOut,
  User,
  Sparkles,
  ChevronDown
} from 'lucide-react';

const Topbar = ({
  selectedMonth,
  onMonthChange,
  onOpenAddModal,
  onOpenBudgetModal,
  onOpenAuthModal,
  onOpenBadgesModal,
  onOpenSimulatorModal,
  onOpenGoalsTab,
  user,
  onLogout,
  theme,
  onToggleTheme
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h2 className="topbar-title">
          {user ? `Hey, ${user.name}! Let's check your finances ✨` : `Good day! Let's check your finances ✨`}
        </h2>
        <span className="topbar-subtitle">
          {user
            ? `Track spending, hit your dream targets & win trophies!`
            : `Here's your money snapshot for the selected month.`}
        </span>
      </div>

      <div className="topbar-actions">
        {/* Month / Year Selector */}
        <div className="month-selector-wrapper" title="Filter entire dashboard by month">
          <Calendar size={17} style={{ color: 'var(--accent-lavender)' }} />
          <input
            type="month"
            className="month-input"
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            id="month-selector-input"
          />
        </div>

        {/* Quick Add Buttons */}
        <button
          className="btn btn-income"
          onClick={() => onOpenAddModal('income')}
          id="quick-add-income-btn"
          title="Add New Income"
        >
          <Plus size={16} />
          <span>Income</span>
        </button>

        <button
          className="btn btn-expense"
          onClick={() => onOpenAddModal('expense')}
          id="quick-add-expense-btn"
          title="Add New Expense"
        >
          <Minus size={16} />
          <span>Expense</span>
        </button>

        {/* Budget Setting Button */}
        <button
          className="btn btn-outline"
          onClick={onOpenBudgetModal}
          id="set-budget-btn"
          title="Set Monthly Spending Budget"
        >
          <Target size={16} style={{ color: 'var(--accent-lavender)' }} />
          <span>Budget</span>
        </button>

        {/* What-If Simulator Button */}
        <button
          className="btn btn-outline"
          onClick={onOpenSimulatorModal}
          id="topbar-simulator-btn"
          title="What-If Money Simulator (Decision Lab)"
          style={{
            borderColor: 'rgba(142, 124, 195, 0.5)',
            background: 'rgba(142, 124, 195, 0.1)',
            color: 'var(--accent-lavender-dark)',
            fontWeight: '700'
          }}
        >
          <Sparkles size={16} />
          <span>What-If 🔮</span>
        </button>

        {/* Trophy / Badges Button */}
        <button
          className="btn btn-outline"
          onClick={onOpenBadgesModal}
          id="open-badges-btn"
          title="View Your Trophies & Badges"
          style={{
            borderColor: 'rgba(255, 213, 79, 0.5)',
            background: 'rgba(255, 213, 79, 0.1)'
          }}
        >
          <Trophy size={16} color="#D97706" />
          <span>Trophies</span>
        </button>

        {/* Theme Toggle */}
        <button
          className="btn-icon-only"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Cozy Dark Theme'}
          id="theme-toggle-btn"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User Auth Pill or Login Button */}
        {user ? (
          <div className="profile-dropdown-container" ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              className="user-avatar-pill"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              id="user-profile-menu-btn"
              style={{
                cursor: 'pointer',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                transition: 'var(--transition-fast)'
              }}
            >
              <div className="avatar-circle">
                <span>{user.avatar || '🌸'}</span>
              </div>
              <span className="user-name">{user.name}</span>
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                className="profile-dropdown-menu"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  width: '210px',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  border: '1px solid var(--border-color)',
                  padding: '0.5rem',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  animation: 'fadeIn 0.2s ease'
                }}
              >
                <div
                  style={{
                    padding: '0.6rem 0.75rem',
                    borderBottom: '1px solid var(--border-color)',
                    marginBottom: '0.25rem'
                  }}
                >
                  <div style={{ fontWeight: '800', fontSize: '0.9rem' }}>{user.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                </div>

                <button
                  className="dropdown-item"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onOpenBadgesModal();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.55rem 0.75rem',
                    background: 'none',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  <Trophy size={16} color="#D97706" />
                  <span>Trophy Showcase</span>
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onOpenGoalsTab();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.55rem 0.75rem',
                    background: 'none',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  <Target size={16} color="var(--accent-lavender)" />
                  <span>Savings Targets</span>
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onOpenSimulatorModal();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.55rem 0.75rem',
                    background: 'none',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  <Sparkles size={16} color="var(--accent-lavender-dark)" />
                  <span>What-If Simulator 🔮</span>
                </button>

                <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.25rem 0' }} />

                <button
                  className="dropdown-item"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onLogout();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.55rem 0.75rem',
                    background: 'none',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-expense)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="btn btn-primary"
            onClick={onOpenAuthModal}
            id="login-register-btn"
            style={{
              padding: '0.5rem 1rem',
              fontWeight: '700',
              gap: '0.4rem',
              background: 'linear-gradient(135deg, var(--accent-lavender), #FFB6C1)',
              boxShadow: '0 4px 15px rgba(142, 124, 195, 0.35)'
            }}
          >
            <Sparkles size={16} />
            <span>Login / Join</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Topbar;
