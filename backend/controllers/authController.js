const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Goal = require('../models/Goal');
const { sampleTransactions, seedUserData } = require('../scripts/seedHelper');

/**
 * Register a new user
 * POST /api/auth/register
 * NOTE: Regular user accounts start with 0 amounts, 0 transactions, 0 goals, and unset budget!
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.'
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists. Please log in.'
      });
    }

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      avatar: avatar || '🌸',
      badges: [
        {
          id: 'welcome_starter',
          title: 'Smart Spender',
          icon: '🌱',
          description: 'Started your financial journey on SpendSmart!',
          unlockedAt: new Date()
        }
      ]
    });

    const token = generateToken(newUser._id);

    // New accounts start completely clean with 0 transactions, 0 goals, and no budget!
    return res.status(201).json({
      success: true,
      message: `Welcome aboard, ${newUser.name}! 🌸`,
      data: {
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          avatar: newUser.avatar,
          monthlySavingsGoal: newUser.monthlySavingsGoal,
          badges: newUser.badges
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Log in existing user
 * POST /api/auth/login
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Only seed sample values if this is the demo account logging in
    if (user.email === 'sneha@spendsmart.app') {
      const demoTxCount = await Transaction.countDocuments({ userId: user._id });
      if (demoTxCount === 0) {
        const userSample = sampleTransactions.map((tx) => ({
          ...tx,
          userId: user._id
        }));
        await Transaction.insertMany(userSample);
        await Budget.findOneAndUpdate(
          { month: '2026-10', userId: user._id },
          { month: '2026-10', amount: 20000, userId: user._id },
          { upsert: true, new: true }
        );
      }
      const demoGoalCount = await Goal.countDocuments({ userId: user._id });
      if (demoGoalCount === 0) {
        await Goal.create([
          {
            userId: user._id,
            title: 'Emergency Rainy Day Fund',
            targetAmount: 15000,
            currentAmount: 7500,
            category: 'Emergency',
            emoji: '🛡️',
            color: '#81C784'
          },
          {
            userId: user._id,
            title: 'Dream Tech Gadget / Laptop',
            targetAmount: 50000,
            currentAmount: 48000,
            category: 'Gadgets',
            emoji: '💻',
            color: '#8E7CC3'
          }
        ]);
      }
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}! ✨`,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          monthlySavingsGoal: user.monthlySavingsGoal,
          badges: user.badges
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * One-Click Instant Demo Login
 * POST /api/auth/demo
 * Always ensures the demo user (Sneha) has full sample transactions, budget, and goals!
 */
const loginDemoUser = async (req, res, next) => {
  try {
    const demoEmail = 'sneha@spendsmart.app';
    let demoUser = await User.findOne({ email: demoEmail });

    if (!demoUser) {
      demoUser = await User.create({
        name: 'Sneha',
        email: demoEmail,
        password: 'password123',
        avatar: '🌸',
        badges: [
          {
            id: 'welcome_starter',
            title: 'Smart Spender',
            icon: '🌱',
            description: 'Started your financial journey on SpendSmart!',
            unlockedAt: new Date()
          }
        ]
      });
    }

    // Always ensure the demo user has the rich sample transactions & budget
    const demoTxCount = await Transaction.countDocuments({ userId: demoUser._id });
    if (demoTxCount === 0) {
      const userSample = sampleTransactions.map((tx) => ({
        ...tx,
        userId: demoUser._id
      }));
      await Transaction.insertMany(userSample);
      await Budget.findOneAndUpdate(
        { month: '2026-10', userId: demoUser._id },
        { month: '2026-10', amount: 20000, userId: demoUser._id },
        { upsert: true, new: true }
      );
    }

    // Always ensure the demo user has the 2 sample goals
    const demoGoalCount = await Goal.countDocuments({ userId: demoUser._id });
    if (demoGoalCount === 0) {
      await Goal.create([
        {
          userId: demoUser._id,
          title: 'Emergency Rainy Day Fund',
          targetAmount: 15000,
          currentAmount: 7500,
          category: 'Emergency',
          emoji: '🛡️',
          color: '#81C784'
        },
        {
          userId: demoUser._id,
          title: 'Dream Tech Gadget / Laptop',
          targetAmount: 50000,
          currentAmount: 48000,
          category: 'Gadgets',
          emoji: '💻',
          color: '#8E7CC3'
        }
      ]);
    }

    const token = generateToken(demoUser._id);

    return res.status(200).json({
      success: true,
      message: 'Logged in to Instant Demo Account! ✨',
      data: {
        token,
        user: {
          id: demoUser._id,
          name: demoUser.name,
          email: demoUser.email,
          avatar: demoUser.avatar,
          monthlySavingsGoal: demoUser.monthlySavingsGoal,
          badges: demoUser.badges
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get current authenticated user details
 * GET /api/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        monthlySavingsGoal: user.monthlySavingsGoal,
        badges: user.badges
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update user profile or avatar
 * PUT /api/auth/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar, monthlySavingsGoal } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    if (name) user.name = name.trim();
    if (avatar) user.avatar = avatar;
    if (monthlySavingsGoal !== undefined) user.monthlySavingsGoal = Number(monthlySavingsGoal);

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully ✨',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        monthlySavingsGoal: user.monthlySavingsGoal,
        badges: user.badges
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerUser,
  loginUser,
  loginDemoUser,
  getMe,
  updateProfile
};
