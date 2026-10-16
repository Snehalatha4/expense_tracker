import React, { useState } from 'react';
import { Sparkles, ArrowRight, Lightbulb, Compass, Award } from 'lucide-react';
import { getSpendingPersonality } from '../utils/spendingPersonality';
import PersonalityModal from './PersonalityModal';

const SpendingPersonalityCard = ({ summary, transactions = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const personality = getSpendingPersonality(summary, transactions);

  return (
    <>
      <div
        className="spending-personality-card"
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.25rem 1.5rem',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem',
          flexWrap: 'wrap',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle accent gradient stripe */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '6px',
            background: personality.badgeColor
          }}
        />

        {/* Left Side: Avatar & Persona Details */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: '4px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: 'var(--radius-lg)',
              background: personality.badgeBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              flexShrink: 0,
              boxShadow: '0 4px 14px rgba(0,0,0,0.06)'
            }}
          >
            {personality.emoji}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: personality.badgeColor,
                  background: personality.badgeBg,
                  padding: '0.15rem 0.55rem',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                SPENDING PERSONALITY ✨
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {personality.tagline}
              </span>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 0.25rem 0' }}>
              {personality.title}
            </h3>

            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '580px', lineHeight: 1.4 }}>
              {personality.description}
            </p>
          </div>
        </div>

        {/* Right Side: Quick Action Button */}
        <button
          className="btn btn-outline"
          onClick={() => setIsModalOpen(true)}
          id="view-personality-details-btn"
          style={{
            borderColor: personality.badgeColor,
            color: personality.badgeColor,
            fontWeight: '700',
            whiteSpace: 'nowrap',
            gap: '0.4rem',
            padding: '0.55rem 0.95rem'
          }}
        >
          <Sparkles size={15} />
          <span>Personality Report</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Deep-dive Personality Report Modal */}
      <PersonalityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        personality={personality}
        summary={summary}
      />
    </>
  );
};

export default SpendingPersonalityCard;
