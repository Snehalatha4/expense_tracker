import React from 'react';
import { Search, RotateCcw, Download, Filter } from 'lucide-react';

const CATEGORY_OPTIONS = [
  'All',
  'Salary',
  'Freelance',
  'Scholarship',
  'Gift',
  'Other Income',
  'Food',
  'Travel',
  'Education',
  'Shopping',
  'Bills',
  'Health',
  'Entertainment',
  'Groceries',
  'Other Expense'
];

const PAYMENT_OPTIONS = ['All', 'Cash', 'UPI', 'Card', 'Bank Transfer', 'Other'];

const FilterBar = ({
  filters,
  onFilterChange,
  onResetFilters,
  onExportCSV,
  hasActiveFilters
}) => {
  return (
    <div className="filter-card" id="filter-bar-card">
      {/* Top Row: Search & Type Pills */}
      <div className="filter-row-top">
        {/* Search Input */}
        <div className="search-box">
          <Search size={18} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="search-input"
            placeholder="Search transactions by note or category..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            id="transaction-search-input"
          />
        </div>

        {/* Type Filter Pills */}
        <div className="type-pills">
          <button
            className={`type-pill ${filters.type === 'All' ? 'active' : ''}`}
            onClick={() => onFilterChange('type', 'All')}
            id="filter-type-all"
          >
            All
          </button>
          <button
            className={`type-pill ${filters.type === 'income' ? 'active income' : ''}`}
            onClick={() => onFilterChange('type', 'income')}
            id="filter-type-income"
          >
            Income
          </button>
          <button
            className={`type-pill ${filters.type === 'expense' ? 'active expense' : ''}`}
            onClick={() => onFilterChange('type', 'expense')}
            id="filter-type-expense"
          >
            Expenses
          </button>
        </div>
      </div>

      {/* Bottom Row: Dropdowns & Action Buttons */}
      <div className="filter-row-bottom">
        <div className="filter-groups">
          {/* Category Dropdown */}
          <select
            className="filter-select"
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            id="filter-category-select"
            title="Filter by Category"
          >
            <option value="All">All Categories</option>
            {CATEGORY_OPTIONS.slice(1).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Payment Method Dropdown */}
          <select
            className="filter-select"
            value={filters.paymentMethod}
            onChange={(e) => onFilterChange('paymentMethod', e.target.value)}
            id="filter-payment-select"
            title="Filter by Payment Method"
          >
            <option value="All">All Payments</option>
            {PAYMENT_OPTIONS.slice(1).map((pm) => (
              <option key={pm} value={pm}>
                {pm}
              </option>
            ))}
          </select>

          {/* Sort By Dropdown */}
          <select
            className="filter-select"
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              onFilterChange('sortBy', sortBy);
              onFilterChange('sortOrder', sortOrder);
            }}
            id="sort-select"
            title="Sort records"
          >
            <option value="date-desc">Date (Newest first)</option>
            <option value="date-asc">Date (Oldest first)</option>
            <option value="amount-desc">Amount (Highest first)</option>
            <option value="amount-asc">Amount (Lowest first)</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              className="btn btn-outline btn-sm"
              onClick={onResetFilters}
              id="clear-filters-btn"
              title="Reset all filters"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}

          {/* CSV Export Button */}
          <button
            className="btn btn-outline btn-sm"
            onClick={onExportCSV}
            id="export-csv-btn"
            title="Export filtered records to CSV file"
          >
            <Download size={14} style={{ color: 'var(--accent-lavender)' }} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
