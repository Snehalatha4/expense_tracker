import React from 'react';
import { Target, AlertCircle, CheckCircle2, AlertTriangle, Plus, Trophy } from 'lucide-react';
import { formatINR } from '../utils/formatters';

const BudgetCard = ({ budget, totalExpenses, onOpenBudgetModal }) => {
  if (!budget || !budget.amount) {
    return (
      <div className="budget-banner" style={{ background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-lavender-light)',
              color: 'var(--accent-lavender-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Target size={22} />
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '0.98rem' }}>Set Monthly Spending Budget</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Set a monthly target to track expenses and win the Budget Master trophy!
            </div>
          </div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={onOpenBudgetModal} id="set-budget-empty-btn">
          <Plus size={15} />
          <span>Set Budget</span>
        </button>
      </div>
    );
  }

  const budgetAmount = budget.amount;
  const percentage = Math.round((totalExpenses / budgetAmount) * 100);
  const remaining = budgetAmount - totalExpenses;

  let progressClass = 'progress-normal';
  let statusIcon = <Trophy size={16} style={{ color: '#D97706' }} />;
  let statusText = `Winning pace! ${100 - percentage}% left 🏆`;

  if (percentage >= 100) {
    progressClass = 'progress-danger';
    statusIcon = <AlertCircle size={16} style={{ color: 'var(--color-expense)' }} />;
    statusText = `Budget exceeded by ${formatINR(Math.abs(remaining))}!`;
  } else if (percentage >= 80) {
    progressClass = 'progress-warning';
    statusIcon = <AlertTriangle size={16} style={{ color: 'var(--accent-peach)' }} />;
    statusText = `Caution: ${percentage}% of budget reached!`;
  }

  return (
    <div className="budget-banner" id="budget-banner-card">
      <div className="budget-info">
        <div className="budget-header">
          <div className="budget-title">
            <Target size={18} style={{ color: 'var(--accent-lavender)' }} />
            <span>Monthly Spending Budget</span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.78rem',
                fontWeight: '700',
                marginLeft: '0.5rem',
                padding: '0.15rem 0.55rem',
                borderRadius: 'var(--radius-full)',
                background: percentage < 80 ? 'rgba(255, 213, 79, 0.2)' : percentage >= 100 ? 'rgba(255, 107, 107, 0.15)' : 'rgba(255, 138, 101, 0.15)'
              }}
            >
              {statusIcon}
              <span>{statusText}</span>
            </span>
          </div>
          <div className="budget-amounts">
            <strong>{formatINR(totalExpenses)}</strong> of {formatINR(budgetAmount)} ({percentage}%)
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-track" title={`${percentage}% spent`}>
          <div
            className={`progress-fill ${progressClass}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      <button className="btn btn-outline btn-sm" onClick={onOpenBudgetModal} id="edit-budget-btn">
        Edit Target
      </button>
    </div>
  );
};

export default BudgetCard;
