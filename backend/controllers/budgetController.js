const Budget = require('../models/Budget');

// @desc    Get budget for a specific month
// @route   GET /api/budget?month=YYYY-MM
// @access  Public / Authenticated
const getBudget = async (req, res, next) => {
  try {
    const { month } = req.query;
    if (!month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      return res.status(400).json({
        success: false,
        message: 'Valid month query parameter is required in YYYY-MM format'
      });
    }

    const query = { month };
    if (req.user) {
      query.userId = req.user._id;
    } else {
      query.$or = [{ userId: null }, { userId: { $exists: false } }];
    }

    let budget = await Budget.findOne(query);

    return res.status(200).json({
      success: true,
      data: budget || null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set or update budget for a month
// @route   POST /api/budget
// @access  Public / Authenticated
const setBudget = async (req, res, next) => {
  try {
    const { month, amount } = req.body;

    if (!month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      return res.status(400).json({
        success: false,
        message: 'Valid month is required in YYYY-MM format'
      });
    }

    const numAmount = Number(amount);
    if (!Number.isFinite(numAmount) || numAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Budget amount must be a positive number'
      });
    }

    const filter = { month };
    if (req.user) {
      filter.userId = req.user._id;
    } else {
      filter.$or = [{ userId: null }, { userId: { $exists: false } }];
    }

    const budget = await Budget.findOneAndUpdate(
      filter,
      {
        month,
        amount: Math.round(numAmount * 100) / 100,
        userId: req.user?._id || null
      },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Budget saved successfully! 🎯',
      data: budget
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBudget,
  setBudget
};
