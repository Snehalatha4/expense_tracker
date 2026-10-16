const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

/**
 * Helper to parse and calculate UTC month start and end dates
 * Format: YYYY-MM
 */
const getMonthDateRange = (monthStr) => {
  if (!monthStr || !/^\d{4}-(0[1-9]|1[0-2])$/.test(monthStr)) {
    return null;
  }
  const [yearStr, monthNumStr] = monthStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthNumStr, 10); // 1-12

  // Month in JS Date.UTC is 0-indexed: month - 1
  const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
  // Exclusive upper bound: 1st of next month
  const endDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));

  return { startDate, endDate };
};

// @desc    Get all transactions (optionally filtered by month, type, category, etc.)
// @route   GET /api/transactions
// @access  Public / Authenticated
const getTransactions = async (req, res, next) => {
  try {
    const { month, type, category, paymentMethod, search, sortBy, sortOrder } = req.query;

    const query = {};

    // Filter by user if logged in
    if (req.user) {
      query.userId = req.user._id;
    } else {
      query.userId = null;
    }

    // Filter by month
    if (month) {
      const dateRange = getMonthDateRange(month);
      if (!dateRange) {
        return res.status(400).json({
          success: false,
          message: 'Invalid month format. Please use YYYY-MM (e.g., 2026-10).'
        });
      }
      query.date = { $gte: dateRange.startDate, $lt: dateRange.endDate };
    }

    // Filter by type
    if (type && ['income', 'expense'].includes(type.toLowerCase())) {
      query.type = type.toLowerCase();
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by payment method
    if (paymentMethod && paymentMethod !== 'All') {
      query.paymentMethod = paymentMethod;
    }

    // Search in note or category
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$and = [{ $or: [{ note: regex }, { category: regex }] }];
    }

    // Sorting
    const sortField = sortBy === 'amount' ? 'amount' : 'date';
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    const sortOptions = { [sortField]: sortDirection, _id: -1 };

    const transactions = await Transaction.find(query).sort(sortOptions);

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Public / Authenticated
const createTransaction = async (req, res, next) => {
  try {
    const { amount, type, category, date, paymentMethod, note } = req.body;

    // Validate required fields
    if (amount === undefined || amount === null || amount === '') {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    const numAmount = Number(amount);
    if (!Number.isFinite(numAmount) || numAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number greater than zero'
      });
    }

    if (!type || !['income', 'expense'].includes(String(type).toLowerCase().trim())) {
      return res.status(400).json({
        success: false,
        message: 'Transaction type must be either income or expense'
      });
    }

    if (!category || !String(category).trim()) {
      return res.status(400).json({ success: false, message: 'Category is required' });
    }

    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date provided' });
    }

    const validPaymentMethods = ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Other'];
    if (!paymentMethod || !validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: `Payment method must be one of: ${validPaymentMethods.join(', ')}`
      });
    }

    const transaction = await Transaction.create({
      amount: Math.round(numAmount * 100) / 100,
      type: String(type).toLowerCase().trim(),
      category: String(category).trim(),
      date: parsedDate,
      paymentMethod,
      note: note ? String(note).trim() : '',
      userId: req.user?._id || null
    });

    return res.status(201).json({
      success: true,
      message: 'Transaction created successfully ✨',
      data: transaction
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    next(error);
  }
};

// @desc    Update an existing transaction
// @route   PUT /api/transactions/:id
// @access  Public / Authenticated
const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID format'
      });
    }

    const filter = { _id: id };
    const existingTransaction = await Transaction.findOne(filter);
    if (!existingTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    const { amount, type, category, date, paymentMethod, note } = req.body;
    const updates = {};

    if (amount !== undefined) {
      const numAmount = Number(amount);
      if (!Number.isFinite(numAmount) || numAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be a positive number greater than zero'
        });
      }
      updates.amount = Math.round(numAmount * 100) / 100;
    }

    if (type !== undefined) {
      const trimmedType = String(type).toLowerCase().trim();
      if (!['income', 'expense'].includes(trimmedType)) {
        return res.status(400).json({
          success: false,
          message: 'Transaction type must be either income or expense'
        });
      }
      updates.type = trimmedType;
    }

    if (category !== undefined) {
      const trimmedCategory = String(category).trim();
      if (!trimmedCategory) {
        return res.status(400).json({ success: false, message: 'Category cannot be empty' });
      }
      updates.category = trimmedCategory;
    }

    if (date !== undefined) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ success: false, message: 'Invalid date provided' });
      }
      updates.date = parsedDate;
    }

    if (paymentMethod !== undefined) {
      const validPaymentMethods = ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Other'];
      if (!validPaymentMethods.includes(paymentMethod)) {
        return res.status(400).json({
          success: false,
          message: `Payment method must be one of: ${validPaymentMethods.join(', ')}`
        });
      }
      updates.paymentMethod = paymentMethod;
    }

    if (note !== undefined) {
      updates.note = String(note).trim();
    }

    const updated = await Transaction.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: updated
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    next(error);
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Public / Authenticated
const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID format'
      });
    }

    const deleted = await Transaction.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
      data: deleted
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly summary using MongoDB Aggregation Pipeline
// @route   GET /api/transactions/summary?month=YYYY-MM
// @access  Public / Authenticated
const getMonthlySummary = async (req, res, next) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({
        success: false,
        message: 'Month query parameter is required (format: YYYY-MM)'
      });
    }

    const dateRange = getMonthDateRange(month);
    if (!dateRange) {
      return res.status(400).json({
        success: false,
        message: 'Invalid month format. Please use YYYY-MM (e.g., 2026-10)'
      });
    }

    const { startDate, endDate } = dateRange;

    const matchStage = {
      date: {
        $gte: startDate,
        $lt: endDate
      }
    };

    if (req.user) {
      matchStage.userId = req.user._id;
    } else {
      matchStage.userId = null;
    }

    // MongoDB Aggregation Pipeline using $match, $facet, $group, $sum, $sort
    const aggregationResult = await Transaction.aggregate([
      {
        $match: matchStage
      },
      {
        $facet: {
          totalsByType: [
            {
              $group: {
                _id: '$type',
                total: { $sum: '$amount' },
                count: { $sum: 1 }
              }
            }
          ],
          categoryBreakdown: [
            {
              $match: {
                type: 'expense'
              }
            },
            {
              $group: {
                _id: '$category',
                total: { $sum: '$amount' },
                count: { $sum: 1 }
              }
            },
            {
              $sort: {
                total: -1
              }
            },
            {
              $project: {
                _id: 0,
                category: '$_id',
                total: { $round: ['$total', 2] },
                count: 1
              }
            }
          ]
        }
      }
    ]);

    const result = aggregationResult[0] || { totalsByType: [], categoryBreakdown: [] };

    let totalIncome = 0;
    let totalExpenses = 0;
    let transactionCount = 0;

    if (result.totalsByType && result.totalsByType.length > 0) {
      for (const item of result.totalsByType) {
        if (item._id === 'income') {
          totalIncome = Math.round(item.total * 100) / 100;
        } else if (item._id === 'expense') {
          totalExpenses = Math.round(item.total * 100) / 100;
        }
        transactionCount += item.count;
      }
    }

    const balance = Math.round((totalIncome - totalExpenses) * 100) / 100;
    const categoryBreakdown = result.categoryBreakdown || [];

    return res.status(200).json({
      success: true,
      data: {
        month,
        totalIncome,
        totalExpenses,
        balance,
        transactionCount,
        categoryBreakdown
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getMonthlySummary
};
