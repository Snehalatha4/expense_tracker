const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

const sampleTransactions = [
  // October 2026 - Main demo month
  {
    amount: 55000,
    type: 'income',
    category: 'Salary',
    date: new Date('2026-10-01T09:00:00.000Z'),
    paymentMethod: 'Bank Transfer',
    note: 'October Tech Stipend & Salary'
  },
  {
    amount: 7500,
    type: 'income',
    category: 'Freelance',
    date: new Date('2026-10-08T14:30:00.000Z'),
    paymentMethod: 'UPI',
    note: 'UI design consulting gig'
  },
  {
    amount: 2500,
    type: 'income',
    category: 'Gift',
    date: new Date('2026-10-12T18:00:00.000Z'),
    paymentMethod: 'Cash',
    note: 'Birthday gift from aunt'
  },
  {
    amount: 1450,
    type: 'expense',
    category: 'Food',
    date: new Date('2026-10-02T13:15:00.000Z'),
    paymentMethod: 'UPI',
    note: 'Lunch at cozy cafe with team'
  },
  {
    amount: 3200,
    type: 'expense',
    category: 'Groceries',
    date: new Date('2026-10-05T17:45:00.000Z'),
    paymentMethod: 'Card',
    note: 'Monthly pantry & fresh produce'
  },
  {
    amount: 1200,
    type: 'expense',
    category: 'Travel',
    date: new Date('2026-10-06T10:00:00.000Z'),
    paymentMethod: 'UPI',
    note: 'Metro card recharge & cab'
  },
  {
    amount: 2400,
    type: 'expense',
    category: 'Bills',
    date: new Date('2026-10-07T11:20:00.000Z'),
    paymentMethod: 'UPI',
    note: 'Electricity and fiber broadband'
  },
  {
    amount: 1800,
    type: 'expense',
    category: 'Shopping',
    date: new Date('2026-10-10T16:00:00.000Z'),
    paymentMethod: 'Card',
    note: 'Pastel stationery & books'
  },
  {
    amount: 850,
    type: 'expense',
    category: 'Entertainment',
    date: new Date('2026-10-11T20:30:00.000Z'),
    paymentMethod: 'UPI',
    note: 'Weekend movie tickets'
  },
  {
    amount: 1100,
    type: 'expense',
    category: 'Health',
    date: new Date('2026-10-13T15:00:00.000Z'),
    paymentMethod: 'UPI',
    note: 'Multivitamins & skincare'
  },
  {
    amount: 650,
    type: 'expense',
    category: 'Food',
    date: new Date('2026-10-14T19:00:00.000Z'),
    paymentMethod: 'Cash',
    note: 'Boba tea and sweet snacks'
  },

  // September 2026 - Previous month for month-switching demo
  {
    amount: 52000,
    type: 'income',
    category: 'Salary',
    date: new Date('2026-09-01T09:00:00.000Z'),
    paymentMethod: 'Bank Transfer',
    note: 'September Salary'
  },
  {
    amount: 4500,
    type: 'expense',
    category: 'Education',
    date: new Date('2026-09-10T10:30:00.000Z'),
    paymentMethod: 'Card',
    note: 'Online coding courses & cloud credits'
  },
  {
    amount: 2800,
    type: 'expense',
    category: 'Food',
    date: new Date('2026-09-15T13:00:00.000Z'),
    paymentMethod: 'UPI',
    note: 'Dining out with classmates'
  }
];

const seedData = async (force = false) => {
  const count = await Transaction.countDocuments();
  if (count > 0 && !force) {
    return { count, seeded: false };
  }

  if (force) {
    await Transaction.deleteMany({});
  }

  const created = await Transaction.insertMany(sampleTransactions);
  await Budget.findOneAndUpdate(
    { month: '2026-10' },
    { month: '2026-10', amount: 20000 },
    { upsert: true, new: true }
  );

  return { count: created.length, seeded: true };
};

const seedUserData = async (userId) => {
  if (!userId) return;
  const userTxCount = await Transaction.countDocuments({ userId });
  if (userTxCount === 0) {
    const userSample = sampleTransactions.map((tx) => ({
      ...tx,
      userId
    }));
    await Transaction.insertMany(userSample);
    await Budget.findOneAndUpdate(
      { month: '2026-10', userId },
      { month: '2026-10', amount: 20000, userId },
      { upsert: true, new: true }
    );
  }
};

module.exports = { sampleTransactions, seedData, seedUserData };
