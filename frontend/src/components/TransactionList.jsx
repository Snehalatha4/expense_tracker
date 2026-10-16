import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { formatINR, formatDate, getCategoryIcon } from '../utils/formatters';
import EmptyState from './EmptyState';

const TransactionList = ({
  transactions = [],
  onEdit,
  onDelete,
  onAddNew,
  hasFiltersApplied = false,
  onResetFilters
}) => {
  if (transactions.length === 0) {
    if (hasFiltersApplied) {
      return (
        <EmptyState
          icon="🔍"
          title="No matching transactions found"
          description="Try adjusting your search keywords or clearing active filters to see your records."
          actionText="Clear All Filters"
          onAction={onResetFilters}
        />
      );
    }
    return (
      <EmptyState
        icon="🌸"
        title="No transactions for this month yet"
        description="Your financial journey starts with a single step! Add an income or expense to begin."
        actionText="Add Transaction"
        onAction={onAddNew}
      />
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="table-card" id="transactions-desktop-table">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Note</th>
              <th>Type</th>
              <th>Payment</th>
              <th>Amount</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => {
              const isIncome = tx.type === 'income';
              return (
                <tr key={tx._id} id={`transaction-row-${tx._id}`}>
                  {/* Date */}
                  <td style={{ whiteSpace: 'nowrap', fontWeight: '500' }}>
                    {formatDate(tx.date)}
                  </td>

                  {/* Category */}
                  <td>
                    <div className="category-cell">
                      <div className="cell-icon">
                        <span>{getCategoryIcon(tx.category)}</span>
                      </div>
                      <span className="cell-category-name">{tx.category}</span>
                    </div>
                  </td>

                  {/* Note */}
                  <td style={{ color: tx.note ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {tx.note || '—'}
                  </td>

                  {/* Type */}
                  <td>
                    <span className={`type-tag ${isIncome ? 'income' : 'expense'}`}>
                      {tx.type}
                    </span>
                  </td>

                  {/* Payment Method */}
                  <td>
                    <span className="method-tag">
                      {tx.paymentMethod}
                    </span>
                  </td>

                  {/* Amount */}
                  <td>
                    <span className={`amount-text ${isIncome ? 'income' : 'expense'}`}>
                      {isIncome ? `+${formatINR(tx.amount)}` : `-${formatINR(tx.amount)}`}
                    </span>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                      <button
                        className="btn-action edit"
                        onClick={() => onEdit(tx)}
                        title="Edit Transaction"
                        id={`edit-btn-${tx._id}`}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        className="btn-action delete"
                        onClick={() => onDelete(tx)}
                        title="Delete Transaction"
                        id={`delete-btn-${tx._id}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Responsive Cards View */}
      <div className="mobile-cards-view" id="transactions-mobile-cards">
        {transactions.map((tx) => {
          const isIncome = tx.type === 'income';
          return (
            <div key={tx._id} className="mobile-transaction-card">
              <div className="mobile-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div className="cell-icon">
                    <span>{getCategoryIcon(tx.category)}</span>
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>
                      {tx.category}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {formatDate(tx.date)}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div className={`amount-text ${isIncome ? 'income' : 'expense'}`}>
                    {isIncome ? `+${formatINR(tx.amount)}` : `-${formatINR(tx.amount)}`}
                  </div>
                  <span className={`type-tag ${isIncome ? 'income' : 'expense'}`} style={{ marginTop: '0.2rem' }}>
                    {tx.type}
                  </span>
                </div>
              </div>

              {tx.note && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  "{tx.note}"
                </div>
              )}

              <div className="mobile-card-footer">
                <span className="method-tag">{tx.paymentMethod}</span>
                <div className="action-buttons">
                  <button
                    className="btn-action edit"
                    onClick={() => onEdit(tx)}
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    className="btn-action delete"
                    onClick={() => onDelete(tx)}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TransactionList;
