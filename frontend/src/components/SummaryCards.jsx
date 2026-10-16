import React from 'react';
import { TrendingUp, TrendingDown, Wallet, ReceiptText, Sparkles } from 'lucide-react';
import { formatINR } from '../utils/formatters';

const SummaryCards = ({ summary }) => {
  const totalIncome = summary?.totalIncome || 0;
  const totalExpenses = summary?.totalExpenses || 0;
  const balance = summary?.balance || 0;
  const transactionCount = summary?.transactionCount || 0;

  // Calculate percentage of income spent (contextual information)
  const expensePercentage =
    totalIncome > 0
      ? Math.min(Math.round((totalExpenses / totalIncome) * 100), 100)
      : totalExpenses > 0
      ? 100
      : 0;

  return (
    <div className="summary-grid">
      {/* 1. Total Income Card */}
      <div className="summary-card summary-income" id="card-total-income">
        <div className="summary-card-top">
          <span className="summary-card-label">Total Income</span>
          <div className="summary-card-icon">
            <TrendingUp size={22} />
          </div>
        </div>
        <div className="summary-card-value">
          {formatINR(totalIncome)}
        </div>
        <div className="summary-card-subtext">
          <span>✨ Inflow for this month</span>
        </div>
      </div>

      {/* 2. Total Expenses Card */}
      <div className="summary-card summary-expense" id="card-total-expenses">
        <div className="summary-card-top">
          <span className="summary-card-label">Total Expenses</span>
          <div className="summary-card-icon">
            <TrendingDown size={22} />
          </div>
        </div>
        <div className="summary-card-value">
          {formatINR(totalExpenses)}
        </div>
        <div className="summary-card-subtext">
          <span>
            {totalIncome > 0 ? `${expensePercentage}% of income spent` : 'Outflow recorded'}
          </span>
        </div>
      </div>

      {/* 3. Available Balance Card */}
      <div className="summary-card summary-balance" id="card-available-balance">
        <div className="summary-card-top">
          <span className="summary-card-label">Available Balance</span>
          <div className="summary-card-icon">
            <Wallet size={22} />
          </div>
        </div>
        <div className="summary-card-value">
          {formatINR(balance)}
        </div>
        <div className="summary-card-subtext">
          <span>
            {balance >= 0 ? '🌸 Healthy positive savings' : '⚠️ Deficit this month'}
          </span>
        </div>
      </div>

      {/* 4. Number of Transactions Card */}
      <div className="summary-card summary-count" id="card-transaction-count">
        <div className="summary-card-top">
          <span className="summary-card-label">Transactions</span>
          <div className="summary-card-icon">
            <ReceiptText size={22} />
          </div>
        </div>
        <div className="summary-card-value">
          {transactionCount}
        </div>
        <div className="summary-card-subtext">
          <span>
            {transactionCount === 1 ? '1 record logged' : `${transactionCount} records logged`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
