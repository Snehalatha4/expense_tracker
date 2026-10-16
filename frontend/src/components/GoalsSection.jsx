import React, { useState } from 'react';
import {
  Target,
  Trophy,
  Plus,
  PiggyBank,
  Sparkles,
  Calendar,
  MoreVertical,
  CheckCircle2,
  Trash2,
  Edit2
} from 'lucide-react';
import { formatINR, formatDate } from '../utils/formatters';

const GoalsSection = ({
  goals = [],
  onOpenAddGoal,
  onOpenEditGoal,
  onOpenDeposit,
  onDeleteGoal,
  onReplayWinCelebration
}) => {
  const [activeMenuId, setActiveMenuId] = useState(null);

  const completedGoals = goals.filter((g) => g.isCompleted);
  const activeGoals = goals.filter((g) => !g.isCompleted);

  const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
  const totalSaved = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const overallPercentage = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <div className="goals-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner / Milestone Header */}
      <div
        className="budget-banner"
        style={{
          background: 'linear-gradient(135deg, rgba(142, 124, 195, 0.12), rgba(255, 182, 193, 0.18))',
          borderColor: 'var(--accent-lavender)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-lavender)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(142, 124, 195, 0.35)'
            }}
          >
            <Trophy size={24} />
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Dream Savings Targets & Milestones</span>
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--accent-lavender-light)',
                  color: 'var(--accent-lavender-dark)',
                  fontWeight: '800'
                }}
              >
                {completedGoals.length} Won 🏆
              </span>
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              Saved <strong>{formatINR(totalSaved)}</strong> of {formatINR(totalTarget)} ({overallPercentage}% of all targets)
            </div>
          </div>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={onOpenAddGoal}
          id="add-new-target-btn"
          style={{ whiteSpace: 'nowrap' }}
        >
          <Plus size={16} />
          <span>New Target</span>
        </button>
      </div>

      {/* Target Cards Grid */}
      {goals.length === 0 ? (
        <div
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
            border: '2px dashed var(--border-color)'
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎯</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.4rem' }}>
            No Savings Targets Yet
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '400px', margin: '0 auto 1.25rem' }}>
            Setting a target gives your savings a clear purpose. Reach 100% to win trophy badges and celebrations!
          </p>
          <button className="btn btn-primary" onClick={onOpenAddGoal}>
            <Plus size={16} />
            <span>Create Your First Target</span>
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {goals.map((g) => {
            const pct = Math.round((g.currentAmount / g.targetAmount) * 100);
            const remaining = Math.max(0, g.targetAmount - g.currentAmount);

            return (
              <div
                key={g._id}
                className="target-card"
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.5rem',
                  border: g.isCompleted ? '2px solid #81C784' : '1px solid var(--border-color)',
                  boxShadow: g.isCompleted
                    ? '0 10px 25px rgba(129, 199, 132, 0.2)'
                    : 'var(--shadow-sm)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  transition: 'var(--transition-normal)'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: 'var(--radius-lg)',
                        background: g.isCompleted
                          ? 'rgba(129, 199, 132, 0.2)'
                          : 'var(--accent-lavender-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.6rem',
                        flexShrink: 0
                      }}
                    >
                      {g.emoji || '🎯'}
                    </div>
                    <div>
                      <h4 style={{ fontWeight: '800', fontSize: '1.05rem', margin: 0 }}>
                        {g.title}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            padding: '0.15rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-secondary)',
                            fontWeight: '600'
                          }}
                        >
                          {g.category}
                        </span>
                        {g.targetDate && (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              color: 'var(--text-muted)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.2rem'
                            }}
                          >
                            <Calendar size={12} />
                            {formatDate(g.targetDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Dropdown Toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <button
                      className="btn-icon-only"
                      onClick={() => onOpenEditGoal(g)}
                      title="Edit Target"
                      style={{ width: '32px', height: '32px' }}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className="btn-icon-only"
                      onClick={() => onDeleteGoal(g)}
                      title="Delete Target"
                      style={{ width: '32px', height: '32px', color: 'var(--color-expense)' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Progress Bar & Amounts */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      marginBottom: '0.4rem'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '1.35rem', fontWeight: '800' }}>
                        {formatINR(g.currentAmount)}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '0.35rem' }}>
                        / {formatINR(g.targetAmount)}
                      </span>
                    </div>
                    <span
                      style={{
                        fontWeight: '800',
                        fontSize: '0.9rem',
                        color: g.isCompleted ? 'var(--color-income)' : 'var(--accent-lavender-dark)'
                      }}
                    >
                      {pct}%
                    </span>
                  </div>

                  {/* Progress track */}
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
                        width: `${Math.min(pct, 100)}%`,
                        background: g.isCompleted
                          ? 'linear-gradient(90deg, #81C784, #4CAF50)'
                          : 'linear-gradient(90deg, var(--accent-lavender), #FFB6C1)',
                        borderRadius: 'var(--radius-full)',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>
                </div>

                {/* Status & Deposit Action */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 'auto',
                    paddingTop: '0.5rem',
                    borderTop: '1px solid var(--border-color)'
                  }}
                >
                  {g.isCompleted ? (
                    <>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          color: '#2E7D32',
                          fontWeight: '800',
                          fontSize: '0.85rem'
                        }}
                      >
                        <CheckCircle2 size={16} />
                        <span>Target Conquered! 🏆</span>
                      </div>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => onReplayWinCelebration(g)}
                        style={{
                          borderColor: '#81C784',
                          color: '#2E7D32',
                          fontWeight: '700'
                        }}
                      >
                        <Sparkles size={14} />
                        <span>Replay Win 🎉</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <strong>{formatINR(remaining)}</strong> left to win!
                      </div>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onOpenDeposit(g)}
                        id={`deposit-btn-${g._id}`}
                        style={{
                          fontWeight: '700',
                          gap: '0.35rem'
                        }}
                      >
                        <Plus size={14} />
                        <span>Add Savings</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GoalsSection;
