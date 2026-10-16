import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatINR, CATEGORY_COLORS, getCategoryIcon } from '../utils/formatters';

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="custom-chart-tooltip">
        <div className="tooltip-title" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span>{getCategoryIcon(data.name)}</span>
          <span>{data.name}</span>
        </div>
        <div className="tooltip-row">
          <span>Total:</span>
          <strong>{formatINR(data.value)}</strong>
        </div>
        <div className="tooltip-row" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>Share:</span>
          <span>{data.payload.percentage}%</span>
        </div>
      </div>
    );
  }
  return null;
};

const CategoryChart = ({ categoryBreakdown = [], totalExpenses = 0 }) => {
  const hasExpenses = categoryBreakdown.length > 0 && totalExpenses > 0;

  // Calculate percentages
  const chartData = categoryBreakdown.map((item, index) => {
    const percentage = totalExpenses > 0 ? Math.round((item.total / totalExpenses) * 100) : 0;
    return {
      name: item.category,
      value: item.total,
      percentage,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
    };
  });

  return (
    <div className="chart-card" id="category-chart-card">
      <div className="chart-card-header">
        <div>
          <h3 className="chart-title">Expense Categories</h3>
          <span className="chart-subtitle">Distribution of your spending</span>
        </div>
      </div>

      <div className="chart-wrapper">
        {!hasExpenses ? (
          <div className="empty-state-box" style={{ height: '100%', border: 'none' }}>
            <span style={{ fontSize: '2rem' }}>🍩</span>
            <div className="empty-state-title" style={{ fontSize: '0.95rem' }}>
              No expenses recorded
            </div>
            <p className="empty-state-desc" style={{ fontSize: '0.78rem' }}>
              When you record an expense, category breakdown will appear here!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
            <div style={{ flex: 1, height: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="var(--bg-card)"
                    strokeWidth={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`slice-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom readable legend */}
            <div
              style={{
                width: '160px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
                maxHeight: '260px',
                overflowY: 'auto',
                paddingRight: '0.5rem'
              }}
            >
              {chartData.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.76rem',
                    gap: '0.35rem'
                  }}
                  title={`${item.name}: ${formatINR(item.value)} (${item.percentage}%)`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0 }}>
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '3px',
                        backgroundColor: item.color,
                        flexShrink: 0
                      }}
                    />
                    <span
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontWeight: '600',
                        color: 'var(--text-primary)'
                      }}
                    >
                      {item.name}
                    </span>
                  </div>
                  <span style={{ fontWeight: '700', color: 'var(--text-secondary)', flexShrink: 0 }}>
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryChart;
