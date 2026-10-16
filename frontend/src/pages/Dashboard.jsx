import React from 'react';
import { Plus, Minus, ArrowRight, Target, Trophy, Sparkles, CheckCircle2, Calculator } from 'lucide-react';
import SummaryCards from '../components/SummaryCards';
import SpendingPersonalityCard from '../components/SpendingPersonalityCard';
import BudgetCard from '../components/BudgetCard';
import IncomeExpenseChart from '../components/IncomeExpenseChart';
import CategoryChart from '../components/CategoryChart';
import RecentTransactions from '../components/RecentTransactions';
import { formatINR } from '../utils/formatters';

const Dashboard = ({
  summary,
  transactions,
  budget,
  goals = [],
  onOpenAddModal,
  onOpenBudgetModal,
  onOpenAddGoal,
  onOpenDeposit,
  onViewAllGoals,
  onViewAllTransactions,
  onOpenSimulatorModal,
  loading
}) => {
  const completedGoals = goals.filter((g) => g.isCompleted);
  const activeGoals = goals.filter((g) => !g.isCompleted);

  return (
    <div className="dashboard-container">
      {/* 4 Summary Cards */}
      <SummaryCards summary={summary} />

      {/* Spending Personality Card (Identifies Archetype from actual transactions) */}
      <SpendingPersonalityCard
        summary={summary}
        transactions={transactions}
      />

      {/* What-If Money Simulator Interactive Banner */}
      <div
        className="what-if-banner"
        style={{
          background: 'linear-gradient(135deg, rgba(142, 124, 195, 0.16), rgba(255, 213, 79, 0.16))',
          borderRadius: 'var(--radius-xl)',
          padding: '1.25rem 1.5rem',
          border: '1px solid rgba(142, 124, 195, 0.35)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '280px', flex: 1 }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, var(--accent-lavender), #FFB6C1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 6px 16px rgba(142, 124, 195, 0.35)',
              flexShrink: 0
            }}
          >
            <Calculator size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: 'var(--accent-lavender-dark)',
                  background: 'rgba(142, 124, 195, 0.2)',
                  padding: '0.15rem 0.55rem',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                DECISION LAB 🔮
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Test before you spend
              </span>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: '0 0 0.25rem 0' }}>
              What-If Money Simulator
            </h3>
            <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Explore questions like <em>"What if I spend ₹500 less on food?"</em> or <em>"Can I afford a ₹5,000 purchase?"</em> to see instant projections!
            </p>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={onOpenSimulatorModal}
          id="dashboard-open-simulator-btn"
          style={{
            padding: '0.65rem 1.25rem',
            fontWeight: '700',
            whiteSpace: 'nowrap',
            gap: '0.5rem',
            background: 'linear-gradient(135deg, var(--accent-lavender-dark), var(--accent-lavender))',
            boxShadow: '0 4px 15px rgba(142, 124, 195, 0.35)'
          }}
        >
          <Sparkles size={16} />
          <span>Launch Simulator 🔮</span>
        </button>
      </div>

      {/* Monthly Budget Tracker */}
      <BudgetCard
        budget={budget}
        totalExpenses={summary?.totalExpenses || 0}
        onOpenBudgetModal={onOpenBudgetModal}
      />

      {/* Dream Targets & Quests Spotlight */}
      <div
        className="dashboard-goals-preview"
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.25rem 1.5rem',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, rgba(255, 213, 79, 0.4), rgba(142, 124, 195, 0.3))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#D97706'
              }}
            >
              <Trophy size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0 }}>
                Dream Targets & Winning Quests
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {completedGoals.length > 0
                  ? `🎉 ${completedGoals.length} target(s) reached! Keep crushing your goals!`
                  : 'Reach 100% on any target to unlock trophies and celebrations!'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button className="btn btn-outline btn-sm" onClick={onOpenAddGoal} id="dashboard-add-goal-btn">
              <Plus size={14} />
              <span>New Target</span>
            </button>
            <button className="btn btn-ghost btn-sm" onClick={onViewAllGoals} id="dashboard-view-goals-btn">
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Goals preview items */}
        {goals.length === 0 ? (
          <div
            style={{
              padding: '1.5rem',
              textAlign: 'center',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              No targets set yet. Set a savings goal to start winning financial badges! 🎯
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1rem'
            }}
          >
            {goals.slice(0, 3).map((g) => {
              const pct = Math.round((g.currentAmount / g.targetAmount) * 100);
              return (
                <div
                  key={g._id}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--bg-secondary)',
                    border: g.isCompleted ? '1.5px solid #81C784' : '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.4rem' }}>{g.emoji || '🎯'}</span>
                      <span style={{ fontWeight: '700', fontSize: '0.92rem' }}>{g.title}</span>
                    </div>
                    {g.isCompleted ? (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          color: '#2E7D32',
                          background: 'rgba(129, 199, 132, 0.2)',
                          padding: '0.15rem 0.45rem',
                          borderRadius: 'var(--radius-full)'
                        }}
                      >
                        ✓ WON 🏆
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--accent-lavender-dark)' }}>
                        {pct}%
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div
                    style={{
                      height: '7px',
                      background: 'var(--bg-card)',
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(pct, 100)}%`,
                        background: g.isCompleted
                          ? 'linear-gradient(90deg, #81C784, #4CAF50)'
                          : 'linear-gradient(90deg, var(--accent-lavender), #FFB6C1)',
                        borderRadius: 'var(--radius-full)'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {formatINR(g.currentAmount)} / {formatINR(g.targetAmount)}
                    </span>
                    {!g.isCompleted && (
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                        onClick={() => onOpenDeposit(g)}
                      >
                        + Deposit
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="charts-grid">
        <IncomeExpenseChart
          totalIncome={summary?.totalIncome || 0}
          totalExpenses={summary?.totalExpenses || 0}
        />
        <CategoryChart
          categoryBreakdown={summary?.categoryBreakdown || []}
          totalExpenses={summary?.totalExpenses || 0}
        />
      </div>

      {/* Recent Transactions List */}
      <RecentTransactions
        transactions={transactions}
        onViewAll={onViewAllTransactions}
      />

      {/* Quick Action Floating Bar for Easy Access */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '1.25rem',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-card)',
          flexWrap: 'wrap'
        }}
      >
        <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
          Quick Actions:
        </span>
        <button
          className="btn btn-income"
          onClick={() => onOpenAddModal('income')}
          id="dashboard-add-income-btn"
        >
          <Plus size={16} />
          <span>Add Income</span>
        </button>
        <button
          className="btn btn-expense"
          onClick={() => onOpenAddModal('expense')}
          id="dashboard-add-expense-btn"
        >
          <Minus size={16} />
          <span>Add Expense</span>
        </button>
        <button
          className="btn btn-primary"
          onClick={onViewAllTransactions}
          id="dashboard-view-transactions-btn"
        >
          <span>View All Transactions</span>
          <ArrowRight size={16} />
        </button>
        <button
          className="btn btn-outline"
          onClick={onOpenSimulatorModal}
          id="dashboard-quick-simulator-btn"
          style={{
            borderColor: 'var(--accent-lavender)',
            color: 'var(--accent-lavender-dark)',
            fontWeight: '700'
          }}
        >
          <Sparkles size={16} />
          <span>What-If Simulator 🔮</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
