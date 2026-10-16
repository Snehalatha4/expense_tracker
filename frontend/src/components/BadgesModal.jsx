import React from 'react';
import { X, Trophy, Award, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

const ALL_POSSIBLE_BADGES = [
  {
    id: 'welcome_starter',
    title: 'Smart Spender',
    icon: '🌱',
    description: 'Started your journey on SpendSmart by creating an account!',
    category: 'Getting Started'
  },
  {
    id: 'target_winner',
    title: 'Target Crusher',
    icon: '🏆',
    description: 'Reached 100% of a savings dream target! You won!',
    category: 'Target Champion'
  },
  {
    id: 'budget_champion',
    title: 'Budget Master',
    icon: '👑',
    description: 'Stayed safely under your monthly spending budget!',
    category: 'Discipline'
  },
  {
    id: 'bullseye_saver',
    title: 'Dream Architect',
    icon: '🎯',
    description: 'Configured a custom savings target milestone.',
    category: 'Planning'
  },
  {
    id: 'diamond_hands',
    title: 'Diamond Hands',
    icon: '💎',
    description: 'Maintained a positive net balance with income > expense.',
    category: 'Savings'
  },
  {
    id: 'streak_master',
    title: 'Super Saver',
    icon: '🔥',
    description: 'Added multiple deposits towards dream goals!',
    category: 'Consistency'
  }
];

const BadgesModal = ({ isOpen, onClose, user, goals = [], summary = null, budget = null }) => {
  if (!isOpen) return null;

  const userBadges = user?.badges || [];
  const completedGoalsCount = goals.filter((g) => g.isCompleted).length;
  const isUnderBudget = budget && summary && summary.totalExpenses <= budget.amount;

  // Determine unlocked statuses dynamically
  const isBadgeUnlocked = (b) => {
    if (userBadges.some((ub) => ub.id === b.id)) return true;
    if (b.id === 'welcome_starter' && user) return true;
    if (b.id === 'target_winner' && completedGoalsCount > 0) return true;
    if (b.id === 'bullseye_saver' && goals.length > 0) return true;
    if (b.id === 'diamond_hands' && summary && summary.balance > 0) return true;
    if (b.id === 'budget_champion' && isUnderBudget) return true;
    return false;
  };

  const unlockedCount = ALL_POSSIBLE_BADGES.filter(isBadgeUnlocked).length;

  return (
    <div className="modal-overlay modal-backdrop" onClick={onClose} style={{ zIndex: 2500 }}>
      <div
        className="modal-content modal-container badges-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '540px', padding: '2rem', position: 'relative' }}
      >
        <button className="btn-icon-only modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              margin: '0 auto 0.75rem',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, rgba(255, 213, 79, 0.3), rgba(255, 182, 193, 0.4))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(255, 213, 79, 0.3)'
            }}
          >
            <Trophy size={32} color="#D97706" />
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: '800', marginBottom: '0.25rem' }}>
            Trophy Room & Badges 🏆
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            You've unlocked <strong>{unlockedCount} of {ALL_POSSIBLE_BADGES.length}</strong> financial badges!
          </p>
        </div>

        {/* Progress Bar of Badges */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div
            style={{
              height: '10px',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              border: '1px solid var(--border-color)'
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${Math.round((unlockedCount / ALL_POSSIBLE_BADGES.length) * 100)}%`,
                background: 'linear-gradient(90deg, var(--accent-lavender), #FFB6C1, #FFD54F)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.5s ease'
              }}
            />
          </div>
        </div>

        {/* Badge Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.85rem',
            maxHeight: '380px',
            overflowY: 'auto',
            paddingRight: '4px'
          }}
        >
          {ALL_POSSIBLE_BADGES.map((b) => {
            const unlocked = isBadgeUnlocked(b);
            return (
              <div
                key={b.id}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-lg)',
                  background: unlocked ? 'var(--bg-card)' : 'var(--bg-secondary)',
                  border: unlocked ? '2px solid var(--accent-lavender)' : '1px dashed var(--border-color)',
                  opacity: unlocked ? 1 : 0.65,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  position: 'relative',
                  transition: 'var(--transition-normal)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1.8rem' }}>{b.icon}</span>
                  {unlocked ? (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: '800',
                        color: 'var(--color-income)',
                        background: 'rgba(129, 199, 132, 0.15)',
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-full)'
                      }}
                    >
                      ✓ WON
                    </span>
                  ) : (
                    <Lock size={15} color="var(--text-muted)" />
                  )}
                </div>
                <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>{b.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                  {b.description}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button className="btn btn-primary" onClick={onClose} style={{ minWidth: '160px' }}>
            Back to Finances ✨
          </button>
        </div>
      </div>
    </div>
  );
};

export default BadgesModal;
