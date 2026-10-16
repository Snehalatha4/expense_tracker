import React, { useState } from 'react';
import { X, PiggyBank, Plus, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { addFundsToGoal } from '../services/api';
import { formatINR } from '../utils/formatters';
import { sound } from '../utils/sound';

const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

const AddFundsModal = ({ isOpen, onClose, goal, onSuccess, onTargetReached }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !goal) return null;

  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!num || num <= 0) {
      toast.error('Please enter a valid deposit amount.');
      return;
    }

    setLoading(true);
    try {
      sound.playCoin();
      const res = await addFundsToGoal(goal._id, num);

      if (res.targetReached) {
        onTargetReached(res.data, res.unlockedBadge);
      } else {
        toast.success(`🎉 Deposited ${formatINR(num)} into "${goal.title}"!`);
      }

      onSuccess();
      onClose();
      setAmount('');
    } catch (err) {
      toast.error(err.message || 'Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay modal-backdrop" onClick={onClose} style={{ zIndex: 2500 }}>
      <div
        className="modal-content modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '420px', padding: '2rem', position: 'relative' }}
      >
        <button className="btn-icon-only modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              margin: '0 auto 0.75rem',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, rgba(129, 199, 132, 0.25), rgba(79, 195, 247, 0.25))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem'
            }}
          >
            {goal.emoji || '💰'}
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.25rem' }}>
            Add Savings to Target
          </h2>
          <div style={{ fontWeight: '700', color: 'var(--accent-lavender-dark)' }}>
            {goal.title}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Remaining to win: <strong>{formatINR(remaining)}</strong>
          </div>
        </div>

        {/* Quick Amount Pills */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label className="form-label">Quick Select</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
            {QUICK_AMOUNTS.map((quick) => (
              <button
                key={quick}
                type="button"
                className="btn btn-outline"
                style={{
                  padding: '0.5rem 0.25rem',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  borderRadius: 'var(--radius-md)',
                  borderColor: Number(amount) === quick ? 'var(--accent-lavender)' : 'var(--border-color)',
                  background: Number(amount) === quick ? 'var(--accent-lavender-light)' : 'transparent'
                }}
                onClick={() => setAmount(quick.toString())}
              >
                +{formatINR(quick)}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Custom Deposit Amount (₹)</label>
            <input
              type="number"
              className="form-input"
              placeholder={`e.g. ${remaining > 0 ? remaining : 1000}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.8rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '0.25rem'
            }}
            disabled={loading}
          >
            <Plus size={16} />
            <span>{loading ? 'Adding...' : 'Deposit Towards Target 🌸'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFundsModal;
