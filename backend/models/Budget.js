const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    month: {
      type: String,
      required: [true, 'Month is required in YYYY-MM format'],
      match: [/^\d{4}-(0[1-9]|1[0-2])$/, 'Month must be in YYYY-MM format']
    },
    amount: {
      type: Number,
      required: [true, 'Budget amount is required'],
      min: [1, 'Budget amount must be at least 1']
    }
  },
  {
    timestamps: true
  }
);

budgetSchema.index({ month: 1, userId: 1 });

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
