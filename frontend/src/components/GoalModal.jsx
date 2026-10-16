import React, { useState, useEffect } from 'react';
import { X, Target, Calendar, Tag, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { createGoal, updateGoal } from '../services/api';

const EMOJI_OPTIONS = ['🎯', '📱', '💻', '✈️', '🛡️', '🚗', '🎁', '🎓', '🏡', '💎', '👟', '🏖️'];
const CATEGORY_OPTIONS = ['Gadgets', 'Emergency', 'Travel', 'Education', 'Vehicle', 'Shopping', 'Celebration', 'General'];

const GoalModal = ({ isOpen, onClose, onSuccess, editGoal = null }) => {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [category, setCategory] = useState('Gadgets');
  const [emoji, setEmoji] = useState('🎯');
  const [targetDate, setTargetDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editGoal) {
      setTitle(editGoal.title || '');
      setTargetAmount(editGoal.targetAmount || '');
      setCurrentAmount(editGoal.currentAmount || 0);
      setCategory(editGoal.category || 'General');
      setEmoji(editGoal.emoji || '🎯');
      setTargetDate(editGoal.targetDate ? editGoal.targetDate.split('T')[0] : '');
    } else {
      setTitle('');
      setTargetAmount('');
      setCurrentAmount('');
      setCategory('Gadgets');
      setEmoji('🎯');
      setTargetDate('');
    }
  }, [editGoal, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter a target title');
      return;
    }
    const numTarget = Number(targetAmount);
    if (!numTarget || numTarget <= 0) {
      toast.error('Target amount must be greater than zero');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: title.trim(),
        targetAmount: numTarget,
        currentAmount: Number(currentAmount) || 0,
        category,
        emoji,
        targetDate: targetDate || undefined
      };

      if (editGoal) {
        await updateGoal(editGoal._id, payload);
        toast.success('Savings target updated! ✨');
      } else {
        await createGoal(payload);
        toast.success('New target created! Let\'s reach it! 🎯');
      }

      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to save target');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay modal-backdrop" onClick={onClose} style={{ zIndex: 2500 }}>
      <div
        className="modal-content modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px', padding: '2rem', position: 'relative' }}
      >
        <button className="btn-icon-only modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              margin: '0 auto 0.75rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--accent-lavender-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem'
            }}
          >
            {emoji}
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '0.25rem' }}>
            {editGoal ? 'Edit Savings Target' : 'Create New Savings Target 🎯'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Define a dream milestone to stay motivated and celebrate when you win!
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Target Name / Dream Goal</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. New Laptop, Trip to Goa, Rainy Day Fund"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="form-label">Target Amount (₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 50000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                min="1"
                required
              />
            </div>
            <div>
              <label className="form-label">Already Saved (₹)</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 5000"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                min="0"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Target Date (Optional)</label>
              <input
                type="date"
                className="form-input"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>
          </div>

          {/* Emoji Picker */}
          <div>
            <label className="form-label">Choose Target Icon</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {EMOJI_OPTIONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setEmoji(icon)}
                  style={{
                    width: '38px',
                    height: '38px',
                    fontSize: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: emoji === icon ? '2px solid var(--accent-lavender)' : '1px solid var(--border-color)',
                    background: emoji === icon ? 'var(--accent-lavender-light)' : 'var(--bg-secondary)',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem', fontWeight: '700' }}
            disabled={loading}
          >
            {loading ? 'Saving...' : editGoal ? 'Update Target ✨' : 'Launch Target 🎯'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;
