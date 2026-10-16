const Goal = require('../models/Goal');
const User = require('../models/User');

/**
 * Get all targets/goals
 * GET /api/goals
 */
const getGoals = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user) {
      filter.userId = req.user._id;
    } else {
      filter.userId = null;
    }

    const goals = await Goal.find(filter).sort({ isCompleted: 1, createdAt: -1 });

    // Calculate aggregated stats
    const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
    const totalSaved = goals.reduce((acc, g) => acc + g.currentAmount, 0);
    const completedCount = goals.filter((g) => g.isCompleted).length;

    return res.status(200).json({
      success: true,
      count: goals.length,
      data: goals,
      meta: {
        totalTarget,
        totalSaved,
        completedCount,
        activeCount: goals.length - completedCount
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new target / savings goal
 * POST /api/goals
 */
const createGoal = async (req, res, next) => {
  try {
    const { title, targetAmount, currentAmount, category, targetDate, emoji, color } = req.body;

    if (!title || !targetAmount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both target title and target amount.'
      });
    }

    const newGoal = await Goal.create({
      userId: req.user?._id || null,
      title: title.trim(),
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount) || 0,
      category: category || 'General',
      targetDate: targetDate ? new Date(targetDate) : undefined,
      emoji: emoji || '🎯',
      color: color || '#8E7CC3',
      isCompleted: Number(currentAmount) >= Number(targetAmount),
      completedAt: Number(currentAmount) >= Number(targetAmount) ? new Date() : undefined
    });

    return res.status(201).json({
      success: true,
      message: 'New savings target created successfully! 🎯',
      data: newGoal
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Deposit / Add funds towards a target
 * POST /api/goals/:id/deposit
 */
const addFundsToGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const depositAmount = Number(amount);
    if (!depositAmount || depositAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid positive deposit amount.'
      });
    }

    const filter = { _id: id };
    if (req.user) {
      filter.userId = req.user._id;
    }

    const goal = await Goal.findOne(filter);
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Savings target not found.'
      });
    }

    const wasAlreadyCompleted = goal.isCompleted;
    goal.currentAmount += depositAmount;

    let targetReachedJustNow = false;
    let unlockedBadge = null;

    if (goal.currentAmount >= goal.targetAmount && !wasAlreadyCompleted) {
      goal.isCompleted = true;
      goal.completedAt = new Date();
      targetReachedJustNow = true;

      // Unlock a trophy badge if user is logged in
      if (req.user) {
        const user = await User.findById(req.user._id);
        if (user) {
          const hasBadge = user.badges.some((b) => b.id === 'target_winner');
          if (!hasBadge) {
            unlockedBadge = {
              id: 'target_winner',
              title: 'Target Crusher 🏆',
              icon: '👑',
              description: `Reached 100% of target "${goal.title}"!`,
              unlockedAt: new Date()
            };
            user.badges.push(unlockedBadge);
            await user.save();
          }
        }
      }
    }

    await goal.save();

    return res.status(200).json({
      success: true,
      message: targetReachedJustNow
        ? `🎉 BINGO! Target "${goal.title}" reached 100%! You won! 🏆`
        : `Added ₹${depositAmount} to "${goal.title}"! Keep going! ✨`,
      data: goal,
      targetReached: targetReachedJustNow,
      unlockedBadge
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update target goal
 * PUT /api/goals/:id
 */
const updateGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const filter = { _id: id };
    if (req.user) {
      filter.userId = req.user._id;
    }

    const goal = await Goal.findOne(filter);
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Savings target not found.'
      });
    }

    const { title, targetAmount, currentAmount, category, targetDate, emoji, color } = req.body;
    if (title) goal.title = title.trim();
    if (targetAmount) goal.targetAmount = Number(targetAmount);
    if (currentAmount !== undefined) goal.currentAmount = Number(currentAmount);
    if (category) goal.category = category;
    if (targetDate) goal.targetDate = new Date(targetDate);
    if (emoji) goal.emoji = emoji;
    if (color) goal.color = color;

    if (goal.currentAmount >= goal.targetAmount) {
      goal.isCompleted = true;
      if (!goal.completedAt) goal.completedAt = new Date();
    } else {
      goal.isCompleted = false;
      goal.completedAt = undefined;
    }

    await goal.save();

    return res.status(200).json({
      success: true,
      message: 'Target updated successfully! ✨',
      data: goal
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a target goal
 * DELETE /api/goals/:id
 */
const deleteGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const filter = { _id: id };
    if (req.user) {
      filter.userId = req.user._id;
    }

    const deleted = await Goal.findOneAndDelete(filter);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Savings target not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Target removed successfully.'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getGoals,
  createGoal,
  addFundsToGoal,
  updateGoal,
  deleteGoal
};
