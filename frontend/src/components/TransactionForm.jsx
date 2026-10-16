import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Loader2, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';
import { createTransaction, updateTransaction } from '../services/api';
import { getTodayDateString } from '../utils/formatters';

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Scholarship',
  'Gift',
  'Other Income'
];

const EXPENSE_CATEGORIES = [
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

const PAYMENT_METHODS = ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Other'];

const TransactionForm = ({
  isOpen,
  onClose,
  onSuccess,
  editData = null,
  defaultType = 'expense'
}) => {
  const isEditing = Boolean(editData && editData._id);

  const [formData, setFormData] = useState({
    amount: '',
    type: defaultType,
    category: defaultType === 'income' ? 'Salary' : 'Food',
    date: getTodayDateString(),
    paymentMethod: 'UPI',
    note: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && editData) {
      // Format date for date input (YYYY-MM-DD)
      let formattedDate = getTodayDateString();
      if (editData.date) {
        const d = new Date(editData.date);
        if (!isNaN(d.getTime())) {
          formattedDate = d.toISOString().split('T')[0];
        }
      }

      setFormData({
        amount: editData.amount || '',
        type: editData.type || 'expense',
        category: editData.category || (editData.type === 'income' ? 'Salary' : 'Food'),
        date: formattedDate,
        paymentMethod: editData.paymentMethod || 'UPI',
        note: editData.note || ''
      });
      setErrors({});
    } else {
      setFormData({
        amount: '',
        type: defaultType,
        category: defaultType === 'income' ? 'Salary' : 'Food',
        date: getTodayDateString(),
        paymentMethod: 'UPI',
        note: ''
      });
      setErrors({});
    }
  }, [isEditing, editData, defaultType, isOpen]);

  if (!isOpen) return null;

  const currentCategories = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleTypeChange = (newType) => {
    setFormData((prev) => ({
      ...prev,
      type: newType,
      category: newType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]
    }));
    if (errors.type) {
      setErrors((prev) => ({ ...prev, type: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    const numAmount = Number(formData.amount);
    if (!formData.amount || isNaN(numAmount)) {
      newErrors.amount = 'Amount is required and must be a number';
    } else if (numAmount <= 0) {
      newErrors.amount = 'Amount must be greater than zero';
    }

    if (!formData.category || !formData.category.trim()) {
      newErrors.category = 'Please choose a category';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }

    if (formData.note && formData.note.length > 200) {
      newErrors.note = 'Note cannot exceed 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please check the form for errors.');
      return;
    }

    setLoading(true);

    const payload = {
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category.trim(),
      date: new Date(formData.date).toISOString(),
      paymentMethod: formData.paymentMethod,
      note: formData.note.trim()
    };

    try {
      if (isEditing) {
        await updateTransaction(editData._id, payload);
        toast.success('🌸 Transaction updated successfully!');
      } else {
        await createTransaction(payload);
        toast.success(
          formData.type === 'income'
            ? '✨ Sweet! Income added to your tracker.'
            : '🌸 Expense logged successfully!'
        );
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h3 className="modal-title">
            {isEditing ? (
              <>
                <Edit2 size={20} style={{ color: 'var(--accent-lavender)' }} />
                <span>Edit Transaction</span>
              </>
            ) : (
              <>
                <Plus size={20} style={{ color: 'var(--accent-lavender)' }} />
                <span>Add Transaction</span>
              </>
            )}
          </h3>
          <button className="btn-close" onClick={onClose} id="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Income / Expense Toggle */}
            <div className="form-group">
              <label className="form-label">Transaction Type</label>
              <div className="type-toggle-container">
                <button
                  type="button"
                  className={`type-toggle-btn ${formData.type === 'income' ? 'active income' : ''}`}
                  onClick={() => handleTypeChange('income')}
                  id="form-toggle-income"
                >
                  <span>✨ Income</span>
                </button>
                <button
                  type="button"
                  className={`type-toggle-btn ${formData.type === 'expense' ? 'active expense' : ''}`}
                  onClick={() => handleTypeChange('expense')}
                  id="form-toggle-expense"
                >
                  <span>🌸 Expense</span>
                </button>
              </div>
            </div>

            {/* Amount */}
            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  step="any"
                  className="form-control"
                  placeholder="e.g. 450"
                  value={formData.amount}
                  onChange={(e) => {
                    setFormData({ ...formData, amount: e.target.value });
                    if (errors.amount) setErrors({ ...errors, amount: null });
                  }}
                  id="form-amount-input"
                  disabled={loading}
                />
              </div>
              {errors.amount && <span className="form-error">{errors.amount}</span>}
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={formData.category}
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value });
                  if (errors.category) setErrors({ ...errors, category: null });
                }}
                id="form-category-select"
                disabled={loading}
              >
                {currentCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && <span className="form-error">{errors.category}</span>}
            </div>

            {/* Date */}
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.date}
                onChange={(e) => {
                  setFormData({ ...formData, date: e.target.value });
                  if (errors.date) setErrors({ ...errors, date: null });
                }}
                id="form-date-input"
                disabled={loading}
              />
              {errors.date && <span className="form-error">{errors.date}</span>}
            </div>

            {/* Payment Method */}
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                className="form-control"
                value={formData.paymentMethod}
                onChange={(e) => {
                  setFormData({ ...formData, paymentMethod: e.target.value });
                  if (errors.paymentMethod) setErrors({ ...errors, paymentMethod: null });
                }}
                id="form-payment-method-select"
                disabled={loading}
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
              {errors.paymentMethod && <span className="form-error">{errors.paymentMethod}</span>}
            </div>

            {/* Optional Note */}
            <div className="form-group">
              <label className="form-label">Note / Description (Optional)</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Lunch with friends or Team stipend"
                maxLength={200}
                value={formData.note}
                onChange={(e) => {
                  setFormData({ ...formData, note: e.target.value });
                  if (errors.note) setErrors({ ...errors, note: null });
                }}
                id="form-note-input"
                disabled={loading}
              />
              {errors.note && <span className="form-error">{errors.note}</span>}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              id="form-submit-btn"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? 'Save Changes' : 'Add Record'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
