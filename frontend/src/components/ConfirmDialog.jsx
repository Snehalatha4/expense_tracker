import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { formatINR, formatDate, getCategoryIcon } from '../utils/formatters';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, transaction, loading = false }) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content confirm-dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-dialog-icon">
          <Trash2 size={28} />
        </div>

        <h3 className="confirm-dialog-title">Delete Transaction?</h3>
        <p className="confirm-dialog-text">
          Are you sure you want to delete this record? This action cannot be undone and will update your monthly totals.
        </p>

        {/* Transaction Target Info */}
        <div className="confirm-target-badge">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
            <span>{getCategoryIcon(transaction.category)}</span>
            <strong>{transaction.category}</strong>
            <span>•</span>
            <span style={{ color: transaction.type === 'income' ? 'var(--color-income)' : 'var(--color-expense)' }}>
              {formatINR(transaction.amount)}
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {transaction.note ? `"${transaction.note}" • ` : ''}
            {formatDate(transaction.date)}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="confirm-dialog-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-expense"
            onClick={onConfirm}
            disabled={loading}
            id="confirm-delete-action-btn"
          >
            {loading ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
