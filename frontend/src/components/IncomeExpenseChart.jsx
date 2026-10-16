import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { formatINR } from '../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="custom-chart-tooltip">
        <div className="tooltip-title">{data.payload.name}</div>
        <div className="tooltip-row">
          <span>Amount:</span>
          <strong style={{ color: data.payload.color }}>
            {formatINR(data.value)}
          </strong>
        </div>
      </div>
    );
  }
  return null;
};

const IncomeExpenseChart = ({ totalIncome = 0, totalExpenses = 0 }) => {
  const hasData = totalIncome > 0 || totalExpenses > 0;

  const data = [
    {
      name: 'Income',
      amount: totalIncome,
      color: '#43A047' // pastel mint green
    },
    {
      name: 'Expenses',
      amount: totalExpenses,
      color: '#E53935' // pastel coral red
    }
  ];

  return (
    <div className="chart-card" id="income-expense-chart-card">
      <div className="chart-card-header">
        <div>
          <h3 className="chart-title">Income vs Expenses</h3>
          <span className="chart-subtitle">Monthly comparison of money in vs out</span>
        </div>
      </div>

      <div className="chart-wrapper">
        {!hasData ? (
          <div className="empty-state-box" style={{ height: '100%', border: 'none' }}>
            <span style={{ fontSize: '2rem' }}>📊</span>
            <div className="empty-state-title" style={{ fontSize: '0.95rem' }}>
              No transactions for this month
            </div>
            <p className="empty-state-desc" style={{ fontSize: '0.78rem' }}>
              Add an income or expense to see the visual comparison!
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color-light)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="var(--text-secondary)"
                tick={{ fontSize: 13, fontWeight: 600 }}
                tickLine={false}
                axisLine={{ stroke: 'var(--border-color)' }}
              />
              <YAxis
                stroke="var(--text-secondary)"
                tick={{ fontSize: 11 }}
                tickFormatter={(val) => `₹${val >= 1000 ? `${val / 1000}k` : val}`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" radius={[12, 12, 0, 0]} maxBarSize={60}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default IncomeExpenseChart;
