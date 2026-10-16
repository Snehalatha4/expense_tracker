import React, { useState } from 'react';
import {
  X,
  Calculator,
  ShoppingBag,
  TrendingUp,
  Scissors,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  PiggyBank
} from 'lucide-react';
import { formatINR } from '../utils/formatters';

const PRESET_CUTS = [
  { label: '₹500 / week on Food ☕', amount: 2000, category: 'Food' },
  { label: '₹1,000 / month on Shopping 🛍️', amount: 1000, category: 'Shopping' },
  { label: '₹1,500 / month on Entertainment 🎬', amount: 1500, category: 'Entertainment' },
  { label: '₹2,500 / month on Outings 🚗', amount: 2500, category: 'Travel' }
];

const PRESET_PURCHASES = [
  { label: 'Dinner / Weekend Outing', amount: 1500 },
  { label: 'New Sneakers / Shoes', amount: 3500 },
  { label: 'Smart Gadget / Headphones', amount: 5000 },
  { label: 'Weekend Getaway Trip', amount: 12000 }
];

const WhatIfSimulatorModal = ({ isOpen, onClose, summary, budget, goals = [] }) => {
  const [activeTab, setActiveTab] = useState('afford'); // 'afford' | 'cutback' | 'compound'

  // Tab 1: Affordability state
  const [purchaseName, setPurchaseName] = useState('New Smartwatch / Gadget');
  const [purchaseAmount, setPurchaseAmount] = useState(5000);

  // Tab 2: Cut back state
  const [cutCategory, setCutCategory] = useState('Food');
  const [cutAmountMonthly, setCutAmountMonthly] = useState(2000);

  // Tab 3: Monthly Savings Boost
  const [extraMonthlySave, setExtraMonthlySave] = useState(3000);

  if (!isOpen) return null;

  const currentBalance = summary?.balance || 0;
  const currentExpenses = summary?.totalExpenses || 0;
  const budgetAmount = budget?.amount || 0;

  // Affordability Calculations
  const projectedBalance = currentBalance - Number(purchaseAmount || 0);
  const projectedExpenses = currentExpenses + Number(purchaseAmount || 0);
  const projectedBudgetPct = budgetAmount > 0 ? Math.round((projectedExpenses / budgetAmount) * 100) : 0;

  let affordStatus = 'safe'; // 'safe' | 'warning' | 'danger'
  let affordVerdict = 'Affordable & Safe! 👍';
  let affordColor = 'var(--color-income)';
  let affordBg = 'rgba(129, 199, 132, 0.2)';
  let affordAdvice = `You can comfortably afford this! You will still have ${formatINR(projectedBalance)} remaining for the month.`;

  if (projectedBalance < 0 || (budgetAmount > 0 && projectedExpenses > budgetAmount)) {
    affordStatus = 'danger';
    affordVerdict = 'Over Budget / Negative Buffer 🛑';
    affordColor = 'var(--color-expense)';
    affordBg = 'rgba(255, 107, 107, 0.15)';
    const deficit = Math.abs(Math.min(projectedBalance, budgetAmount > 0 ? budgetAmount - projectedExpenses : 0));
    affordAdvice = `This purchase would exceed your monthly financial buffer by ${formatINR(deficit)}. Consider saving for it as a dream target first!`;
  } else if (projectedBalance < (summary?.totalIncome || 10000) * 0.15 || (budgetAmount > 0 && projectedBudgetPct > 85)) {
    affordStatus = 'warning';
    affordVerdict = 'Tight Budget! Proceed with Caution ⚠️';
    affordColor = '#F57C00';
    affordBg = 'rgba(255, 183, 77, 0.2)';
    affordAdvice = `You can buy this, but it will consume most of your remaining monthly cash cushion, leaving ${formatINR(projectedBalance)}.`;
  }

  // Cutback calculations
  const cut1Mo = Number(cutAmountMonthly || 0);
  const cut6Mo = cut1Mo * 6;
  const cut1Yr = cut1Mo * 12;
  const cut3Yr = cut1Mo * 36;

  // Compounding growth at 8% annual return (approx stock market / index / mutual fund)
  const calculateCompound = (monthly, months, annualRate = 0.08) => {
    const r = annualRate / 12;
    let total = 0;
    for (let i = 0; i < months; i++) {
      total = (total + monthly) * (1 + r);
    }
    return Math.round(total);
  };

  const wealth6Mo = calculateCompound(Number(extraMonthlySave || 0), 6);
  const wealth1Yr = calculateCompound(Number(extraMonthlySave || 0), 12);
  const wealth3Yr = calculateCompound(Number(extraMonthlySave || 0), 36);

  return (
    <div className="modal-overlay modal-backdrop" onClick={onClose} style={{ zIndex: 2500 }}>
      <div
        className="modal-content modal-container what-if-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', padding: '2.25rem 2rem', position: 'relative' }}
      >
        <button className="btn-icon-only modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 0.75rem',
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, rgba(142, 124, 195, 0.3), rgba(255, 213, 79, 0.35))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(142, 124, 195, 0.2)'
            }}
          >
            <Calculator size={32} style={{ color: 'var(--accent-lavender-dark)' }} />
          </div>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              color: 'var(--accent-lavender-dark)',
              background: 'var(--accent-lavender-light)',
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              letterSpacing: '0.5px'
            }}
          >
            WHAT-IF MONEY SIMULATOR 🔮
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0.35rem 0 0.2rem' }}>
            Interactive Decision Lab
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
            Explore hypothetical scenarios before spending to see the exact impact on your future balance!
          </p>
        </div>

        {/* Simulator Tabs */}
        <div className="auth-tabs" style={{ marginBottom: '1.5rem' }}>
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === 'afford' ? 'active' : ''}`}
            onClick={() => setActiveTab('afford')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
          >
            <ShoppingBag size={15} />
            <span>Can I Afford This?</span>
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === 'cutback' ? 'active' : ''}`}
            onClick={() => setActiveTab('cutback')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
          >
            <Scissors size={15} />
            <span>Spend Less</span>
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === 'compound' ? 'active' : ''}`}
            onClick={() => setActiveTab('compound')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
          >
            <TrendingUp size={15} />
            <span>Save More</span>
          </button>
        </div>

        {/* Tab 1: Can I Afford This Purchase? */}
        {activeTab === 'afford' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="form-label">Hypothetical Purchase</label>
              <input
                type="text"
                className="form-input"
                value={purchaseName}
                onChange={(e) => setPurchaseName(e.target.value)}
                placeholder="e.g. New Headphones, Flight Ticket, Dinner"
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Purchase Price</label>
                <span style={{ fontWeight: '800', color: 'var(--accent-lavender-dark)', fontSize: '1.05rem' }}>
                  {formatINR(purchaseAmount)}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-lavender)', cursor: 'pointer' }}
              />

              {/* Quick Presets */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.6rem' }}>
                {PRESET_PURCHASES.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setPurchaseName(p.label);
                      setPurchaseAmount(p.amount);
                    }}
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.55rem',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    {p.label} ({formatINR(p.amount)})
                  </button>
                ))}
              </div>
            </div>

            {/* Verdict Card */}
            <div
              style={{
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                background: affordBg,
                border: `1.5px solid ${affordColor}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '800', fontSize: '1rem', color: affordColor }}>
                  {affordVerdict}
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: '700', color: affordColor }}>
                  {projectedBalance >= 0 ? `+${formatINR(projectedBalance)} Buffer` : `${formatINR(projectedBalance)} Deficit`}
                </span>
              </div>

              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                {affordAdvice}
              </p>

              {/* Balance Comparison Bar */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid rgba(0,0,0,0.08)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Current Balance</div>
                  <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{formatINR(currentBalance)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Projected Balance</div>
                  <div style={{ fontWeight: '800', fontSize: '1.1rem', color: affordColor }}>
                    {formatINR(projectedBalance)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: What If I Cut Back Spending? */}
        {activeTab === 'cutback' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
              <div>
                <label className="form-label">Category to Trim</label>
                <select
                  className="form-select"
                  value={cutCategory}
                  onChange={(e) => setCutCategory(e.target.value)}
                >
                  <option value="Food">Food & Dining 🍱</option>
                  <option value="Shopping">Shopping & Fashion 🛍️</option>
                  <option value="Entertainment">Entertainment & Movies 🎬</option>
                  <option value="Travel">Cabs & Travel 🚗</option>
                  <option value="Groceries">Snacks & Groceries 🛒</option>
                </select>
              </div>

              <div>
                <label className="form-label">Monthly Savings (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  min="200"
                  step="200"
                  value={cutAmountMonthly}
                  onChange={(e) => setCutAmountMonthly(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                POPULAR SMART CUTS:
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {PRESET_CUTS.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setCutCategory(c.category);
                      setCutAmountMonthly(c.amount);
                    }}
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem', borderRadius: 'var(--radius-md)' }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Projection Grid */}
            <div
              style={{
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ fontSize: '0.85rem', fontWeight: '800', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={16} color="#D97706" />
                <span>Projected Wealth Gained by Cutting {formatINR(cut1Mo)}/mo on {cutCategory}:</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'center' }}>
                <div style={{ background: 'var(--bg-card)', padding: '0.85rem 0.5rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>IN 6 MONTHS</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-income)' }}>
                    +{formatINR(cut6Mo)}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-card)', padding: '0.85rem 0.5rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>IN 1 YEAR</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-income)' }}>
                    +{formatINR(cut1Yr)}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-card)', padding: '0.85rem 0.5rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>IN 3 YEARS</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-income)' }}>
                    +{formatINR(cut3Yr)}
                  </div>
                </div>
              </div>

              {goals.length > 0 && (
                <div style={{ marginTop: '1rem', fontSize: '0.82rem', color: 'var(--text-secondary)', background: 'var(--bg-card)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)' }}>
                  🎯 <strong>Target Impact:</strong> In 1 year, this saving alone would fund <strong>{Math.min(100, Math.round((cut1Yr / goals[0].targetAmount) * 100))}%</strong> of your "{goals[0].title}" target!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Future Wealth & Target Booster */}
        {activeTab === 'compound' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Extra Monthly Savings</label>
                <span style={{ fontWeight: '800', color: 'var(--accent-lavender-dark)', fontSize: '1.05rem' }}>
                  +{formatINR(extraMonthlySave)} / month
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="20000"
                step="500"
                value={extraMonthlySave}
                onChange={(e) => setExtraMonthlySave(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-lavender)', cursor: 'pointer' }}
              />
            </div>

            <div
              style={{
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                background: 'linear-gradient(135deg, rgba(142, 124, 195, 0.15), rgba(129, 199, 132, 0.15))',
                border: '1px solid var(--accent-lavender)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}
            >
              <div style={{ fontSize: '0.88rem', fontWeight: '800' }}>
                🚀 Wealth Projection (compounding at 8% p.a. in mutual funds/FDs):
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'center' }}>
                <div style={{ background: 'var(--bg-card)', padding: '0.85rem 0.5rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>6 MONTHS</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-lavender-dark)' }}>
                    {formatINR(wealth6Mo)}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-card)', padding: '0.85rem 0.5rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>1 YEAR</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-lavender-dark)' }}>
                    {formatINR(wealth1Yr)}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-card)', padding: '0.85rem 0.5rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700' }}>3 YEARS</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#2E7D32' }}>
                    {formatINR(wealth3Yr)}
                  </div>
                </div>
              </div>

              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                💡 <em>Small consistent habits compound into extraordinary dream funds!</em>
              </p>
            </div>
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={onClose}
          style={{ width: '100%', marginTop: '1.5rem', padding: '0.8rem', fontWeight: '700' }}
        >
          Close Simulator ✨
        </button>
      </div>
    </div>
  );
};

export default WhatIfSimulatorModal;
