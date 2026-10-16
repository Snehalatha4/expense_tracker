const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    title: {
      type: String,
      required: [true, 'Target title is required'],
      trim: true,
      maxlength: [80, 'Target title cannot exceed 80 characters']
    },
    targetAmount: {
      type: Number,
      required: [true, 'Target amount is required'],
      min: [1, 'Target amount must be at least ₹1'],
      validate: {
        validator: Number.isFinite,
        message: 'Target amount must be a valid number'
      }
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: [0, 'Current saved amount cannot be negative']
    },
    category: {
      type: String,
      default: 'General',
      trim: true
    },
    targetDate: {
      type: Date
    },
    emoji: {
      type: String,
      default: '🎯'
    },
    color: {
      type: String,
      default: '#8E7CC3'
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

goalSchema.index({ userId: 1, isCompleted: 1 });

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
