import React, { useState, useEffect } from 'react';
import { X, Target, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { setBudget } from '../services/api';

const BudgetModal = ({ isOpen, onClose, selectedMonth, currentBudget, onBudgetSaved }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAmount(currentBudget?.amount ? String(currentBudget.amount) : '');
    }
  }, [isOpen, currentBudget]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid positive budget amount');
      return;
    }

    setLoading(true);
    try {
      const res = await setBudget({
        month: selectedMonth,
        amount: numAmount
      });
      toast.success(`🎯 Monthly budget of ₹${numAmount.toLocaleString('en-IN')} set for ${selectedMonth}!`);
      onBudgetSaved(res.data);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            <Target size={20} style={{ color: 'var(--accent-lavender)' }} />
            <span>Set Monthly Budget</span>
          </h3>
          <button className="btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Set your target spending limit for <strong>{selectedMonth}</strong>. SpendSmart will track your progress and provide friendly alerts!
            </p>

            <div className="form-group" style={{ marginTop: '0.5rem' }}>
              <label className="form-label">Budget Target Amount (₹)</label>
              <input
                type="number"
                step="any"
                className="form-control"
                placeholder="e.g. 20000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                disabled={loading}
                id="budget-amount-input"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading} id="save-budget-btn">
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Budget</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetModal;
