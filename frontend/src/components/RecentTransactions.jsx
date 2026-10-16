import React from 'react';
import { ArrowRight, ReceiptText } from 'lucide-react';
import { formatINR, formatDate, getCategoryIcon } from '../utils/formatters';

const RecentTransactions = ({ transactions = [], onViewAll }) => {
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="recent-card" id="recent-transactions-card">
      <div className="recent-header">
        <div>
          <h3 className="chart-title">Recent Activity</h3>
          <span className="chart-subtitle">Latest 5 transactions for this month</span>
        </div>
        <button
          className="btn btn-outline btn-sm"
          onClick={onViewAll}
          id="view-all-transactions-btn"
          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <span>View all</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {recentTransactions.length === 0 ? (
        <div className="empty-state-box" style={{ padding: '2rem 1rem' }}>
          <span style={{ fontSize: '2.5rem' }}>🌱</span>
          <div className="empty-state-title" style={{ fontSize: '1rem' }}>
            No recent activity
          </div>
          <p className="empty-state-desc" style={{ fontSize: '0.8rem' }}>
            Your recent transactions will appear here as soon as you record them!
          </p>
        </div>
      ) : (
        <div className="recent-list">
          {recentTransactions.map((tx) => {
            const isIncome = tx.type === 'income';
            return (
              <div key={tx._id} className="transaction-item-row">
                <div className="item-left">
                  <div className="item-icon">
                    <span>{getCategoryIcon(tx.category)}</span>
                  </div>
                  <div className="item-meta">
                    <span className="item-title">{tx.note || tx.category}</span>
                    <div className="item-subtitle">
                      <span>{formatDate(tx.date)}</span>
                      <span>•</span>
                      <span className="item-badge">{tx.paymentMethod}</span>
                      {tx.note && (
                        <>
                          <span>•</span>
                          <span style={{ color: 'var(--text-secondary)' }}>{tx.category}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="item-right">
                  <span className={`item-amount ${isIncome ? 'income' : 'expense'}`}>
                    {isIncome ? `+${formatINR(tx.amount)}` : `-${formatINR(tx.amount)}`}
                  </span>
                  <span className={`type-tag ${isIncome ? 'income' : 'expense'}`}>
                    {tx.type}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
