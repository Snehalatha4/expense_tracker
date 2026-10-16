import React from 'react';
import { X, Sparkles, Lightbulb, Compass, Award, CheckCircle2, TrendingUp } from 'lucide-react';
import { formatINR } from '../utils/formatters';

const ALL_ARCHETYPES = [
  { emoji: '🍱', title: 'The Foodie', desc: 'Prioritizes dining, coffee, and delicious culinary experiences.' },
  { emoji: '🛡️', title: 'The Careful Saver', desc: 'Maintains a high savings rate (>60%) and guards future security.' },
  { emoji: '🦋', title: 'The Social Butterfly', desc: 'Invests heavily in travel, entertainment, and social memories.' },
  { emoji: '🛍️', title: 'The Trendsetter', desc: 'Appreciates aesthetic lifestyle upgrades, fashion, and shopping.' },
  { emoji: '📚', title: 'The Self-Improver', desc: 'Invests in personal wellness, learning, and future skills.' },
  { emoji: '⚖️', title: 'The Balanced Zen', desc: 'Spends harmoniously across all categories with steady composure.' }
];

const PersonalityModal = ({ isOpen, onClose, personality, summary }) => {
  if (!isOpen || !personality) return null;

  return (
    <div className="modal-overlay modal-backdrop" onClick={onClose} style={{ zIndex: 2500 }}>
      <div
        className="modal-content modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '580px', padding: '2.25rem 2rem', position: 'relative' }}
      >
        <button className="btn-icon-only modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '70px',
              height: '70px',
              margin: '0 auto 0.75rem',
              borderRadius: 'var(--radius-xl)',
              background: personality.badgeBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
            }}
          >
            {personality.emoji}
          </div>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              color: personality.badgeColor,
              background: personality.badgeBg,
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              letterSpacing: '0.5px'
            }}
          >
            YOUR FINANCIAL ARCHETYPE
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '0.4rem 0 0.2rem' }}>
            {personality.title}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            "{personality.tagline}"
          </p>
        </div>

        {/* Profile Details Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.5rem' }}>
          {/* Key Trait */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <Compass size={22} style={{ color: personality.badgeColor, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>SIGNATURE TRAIT</div>
              <div style={{ fontSize: '0.92rem', fontWeight: '800' }}>{personality.keyTrait}</div>
            </div>
          </div>

          {/* Fun Fact */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, rgba(255, 213, 79, 0.15), rgba(255, 182, 193, 0.15))',
              border: '1px dashed var(--accent-peach)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}
          >
            <Sparkles size={20} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: '800' }}>MONEY PSYCHOLOGY INSIGHT</div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.45, marginTop: '2px' }}>
                {personality.funFact}
              </div>
            </div>
          </div>

          {/* Tailored Tip */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(142, 124, 195, 0.12)',
              border: '1px solid rgba(142, 124, 195, 0.3)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}
          >
            <Lightbulb size={20} style={{ color: 'var(--accent-lavender-dark)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-lavender-dark)', fontWeight: '800' }}>TAILORED POWER TIP</div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.45, marginTop: '2px' }}>
                {personality.tip}
              </div>
            </div>
          </div>
        </div>

        {/* All Archetypes Quick Reference */}
        <div style={{ marginTop: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            EXPLORE THE 6 SPENDING ARCHETYPES
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.6rem',
              maxHeight: '160px',
              overflowY: 'auto'
            }}
          >
            {ALL_ARCHETYPES.map((arch) => (
              <div
                key={arch.title}
                style={{
                  padding: '0.65rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: arch.title === personality.title ? personality.badgeBg : 'var(--bg-secondary)',
                  border: arch.title === personality.title ? `1.5px solid ${personality.badgeColor}` : '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.82rem'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{arch.emoji}</span>
                <span style={{ fontWeight: '700' }}>{arch.title}</span>
                {arch.title === personality.title && (
                  <CheckCircle2 size={14} style={{ color: personality.badgeColor, marginLeft: 'auto' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={onClose}
          style={{ width: '100%', marginTop: '1.5rem', padding: '0.8rem', fontWeight: '700' }}
        >
          Got It, That's Me! ✨
        </button>
      </div>
    </div>
  );
};

export default PersonalityModal;
