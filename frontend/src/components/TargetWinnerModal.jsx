import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, Sparkles, Check, ArrowRight } from 'lucide-react';
import { formatINR } from '../utils/formatters';
import { sound } from '../utils/sound';

const TargetWinnerModal = ({ isOpen, onClose, goal, badge }) => {
  useEffect(() => {
    if (isOpen) {
      // Trigger synthesized cute victory fanfare chord
      sound.playVictoryFanfare();

      // Confetti burst from multiple angles
      const duration = 2.5 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#8E7CC3', '#FFB6C1', '#81C784', '#FFD54F', '#4FC3F7']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#8E7CC3', '#FFB6C1', '#81C784', '#FFD54F', '#4FC3F7']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isOpen]);

  if (!isOpen || !goal) return null;

  return (
    <div className="modal-overlay modal-backdrop" onClick={onClose} style={{ zIndex: 2600 }}>
      <div
        className="modal-content modal-container target-winner-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '460px',
          textAlign: 'center',
          padding: '2.5rem 2rem',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '2px solid var(--accent-lavender)',
          boxShadow: '0 20px 60px rgba(142, 124, 195, 0.35)',
          animation: 'bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        {/* Animated Trophy Crown */}
        <div
          style={{
            position: 'relative',
            width: '90px',
            height: '90px',
            margin: '0 auto 1.25rem',
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, #FFD54F, #FF8A65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(255, 213, 79, 0.45)'
          }}
        >
          <Trophy size={48} color="#FFFFFF" />
          <div
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-6px',
              fontSize: '1.5rem',
              animation: 'spin 4s linear infinite'
            }}
          >
            ✨
          </div>
        </div>

        {/* Victory Title */}
        <span
          style={{
            display: 'inline-block',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(129, 199, 132, 0.2)',
            color: '#2E7D32',
            fontWeight: '800',
            fontSize: '0.78rem',
            letterSpacing: '1px',
            marginBottom: '0.75rem',
            textTransform: 'uppercase'
          }}
        >
          🏆 Target Conquered! You Won!
        </span>

        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          Woohoo! Goal Reached! 🎉
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          You hit 100% of your target for <strong>{goal.title}</strong>! That's a massive financial victory!
        </p>

        {/* Target Details Card */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left' }}>
            <span style={{ fontSize: '2rem' }}>{goal.emoji || '🎯'}</span>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1rem' }}>{goal.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{goal.category} Target</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--color-income)' }}>
              {formatINR(goal.targetAmount)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-income)', fontWeight: '700' }}>
              ✓ 100% Completed
            </div>
          </div>
        </div>

        {/* Unlocked Badge Notice */}
        {badge && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(142, 124, 195, 0.15), rgba(255, 182, 193, 0.15))',
              border: '1px dashed var(--accent-lavender)',
              marginBottom: '1.5rem',
              textAlign: 'left'
            }}
          >
            <Award size={28} style={{ color: 'var(--accent-lavender)', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.88rem' }}>
                New Badge Unlocked: {badge.title}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {badge.description}
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          className="btn btn-primary"
          onClick={onClose}
          style={{
            width: '100%',
            padding: '0.85rem',
            fontSize: '1rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: '0 8px 24px rgba(142, 124, 195, 0.4)'
          }}
        >
          <Sparkles size={18} />
          <span>Awesome! Keep Crushing Goals</span>
        </button>
      </div>
    </div>
  );
};

export default TargetWinnerModal;
