import React, { useState, useMemo } from 'react';
import { Plus, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import FilterBar from '../components/FilterBar';
import TransactionList from '../components/TransactionList';
import { formatDate } from '../utils/formatters';

const Transactions = ({
  transactions = [],
  selectedMonth,
  onOpenAddModal,
  onEditTransaction,
  onDeleteTransaction,
  loading
}) => {
  const [filters, setFilters] = useState({
    search: '',
    type: 'All',
    category: 'All',
    paymentMethod: 'All',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      type: 'All',
      category: 'All',
      paymentMethod: 'All',
      sortBy: 'date',
      sortOrder: 'desc'
    });
    toast('Filters cleared ✨', { icon: '🧹' });
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.type !== 'All' ||
    filters.category !== 'All' ||
    filters.paymentMethod !== 'All' ||
    filters.sortBy !== 'date' ||
    filters.sortOrder !== 'desc';

  // Client-side filtering & sorting of currently loaded month's data
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Search filter
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      result = result.filter(
        (tx) =>
          (tx.note && tx.note.toLowerCase().includes(q)) ||
          (tx.category && tx.category.toLowerCase().includes(q))
      );
    }

    // Type filter
    if (filters.type !== 'All') {
      result = result.filter((tx) => tx.type === filters.type);
    }

    // Category filter
    if (filters.category !== 'All') {
      result = result.filter((tx) => tx.category === filters.category);
    }

    // Payment method filter
    if (filters.paymentMethod !== 'All') {
      result = result.filter((tx) => tx.paymentMethod === filters.paymentMethod);
    }

    // Sorting
    result.sort((a, b) => {
      if (filters.sortBy === 'amount') {
        return filters.sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      // Date sort
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return filters.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [transactions, filters]);

  // Export to CSV Functionality
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      toast.error('No transactions to export!');
      return;
    }

    const headers = ['Date', 'Type', 'Category', 'Amount (INR)', 'Payment Method', 'Note'];
    const rows = filteredTransactions.map((tx) => [
      formatDate(tx.date),
      tx.type,
      `"${tx.category.replace(/"/g, '""')}"`,
      tx.amount,
      tx.paymentMethod,
      `"${(tx.note || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SpendSmart_Transactions_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('📥 Transactions exported as CSV!');
  };

  return (
    <div className="transactions-container">
      {/* Page Header */}
      <div className="transactions-header">
        <div className="header-text">
          <h2>All Transactions</h2>
          <p>
            Viewing transactions for <strong>{selectedMonth}</strong> ({filteredTransactions.length} records)
          </p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={() => onOpenAddModal('expense')}
            id="transactions-add-record-btn"
          >
            <Plus size={16} />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        onExportCSV={handleExportCSV}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Transaction Records (Table on Desktop, Cards on Mobile) */}
      <TransactionList
        transactions={filteredTransactions}
        onEdit={onEditTransaction}
        onDelete={onDeleteTransaction}
        onAddNew={() => onOpenAddModal('expense')}
        hasFiltersApplied={hasActiveFilters}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};

export default Transactions;
