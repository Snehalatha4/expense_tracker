import React from 'react';
import { LayoutDashboard, ReceiptText, Target, Trophy, Sparkles, Calculator } from 'lucide-react';

const Sidebar = ({
  activeTab,
  setActiveTab,
  completedGoalsCount = 0,
  onOpenBadgesModal,
  onOpenSimulatorModal
}) => {
  return (
    <aside className="sidebar">
      {/* Brand Logo */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          <span>🌸</span>
        </div>
        <div className="brand-text">
          <h1>SpendSmart</h1>
          <span className="brand-tagline">Little steps, smarter spending.</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        <button
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
          id="nav-dashboard-btn"
        >
          <div className="nav-icon">
            <LayoutDashboard size={19} />
          </div>
          <span>Dashboard</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
          id="nav-transactions-btn"
        >
          <div className="nav-icon">
            <ReceiptText size={19} />
          </div>
          <span>Transactions</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'goals' ? 'active' : ''}`}
          onClick={() => setActiveTab('goals')}
          id="nav-goals-btn"
        >
          <div className="nav-icon">
            <Target size={19} />
          </div>
          <span>Targets & Wins</span>
          {completedGoalsCount > 0 && (
            <span
              style={{
                marginLeft: 'auto',
                background: 'rgba(129, 199, 132, 0.25)',
                color: '#2E7D32',
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.72rem',
                fontWeight: '800'
              }}
            >
              {completedGoalsCount} 🏆
            </span>
          )}
        </button>

        <button
          className="nav-item"
          onClick={onOpenSimulatorModal}
          id="nav-simulator-btn"
          title="Explore hypothetical spending decisions"
        >
          <div className="nav-icon">
            <Calculator size={19} style={{ color: 'var(--accent-lavender-dark)' }} />
          </div>
          <span>What-If Lab 🔮</span>
        </button>
      </nav>

      {/* Trophy & Winning Quest Card */}
      <div
        className="sidebar-card"
        style={{
          cursor: 'pointer',
          background: 'linear-gradient(135deg, rgba(255, 213, 79, 0.2), rgba(142, 124, 195, 0.15))',
          border: '1px solid rgba(255, 213, 79, 0.4)'
        }}
        onClick={onOpenBadgesModal}
        title="Click to view Trophy Room"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span
            className="sidebar-card-badge"
            style={{ background: 'var(--accent-lavender)', color: 'white' }}
          >
            WIN QUEST 🏆
          </span>
          <Sparkles size={14} color="#D97706" />
        </div>
        <p className="sidebar-card-text" style={{ fontWeight: '600' }}>
          Reach your targets & stay under budget to earn glowing winner badges!
        </p>
        <div style={{ fontSize: '0.78rem', color: 'var(--accent-lavender-dark)', fontWeight: '800' }}>
          View Trophies →
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
