process.env.NODE_ENV = 'test';
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const Transaction = require('../models/Transaction');

let mongoServer;

const runTests = async () => {
  console.log('\n======================================================');
  console.log('🧪 Starting SpendSmart Backend API & Aggregation Test Suite');
  console.log('======================================================\n');

  try {
    // Ensure any prior connection is disconnected
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    // 1. Setup in-memory MongoDB Community Server instance
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB Community Server instance for testing');

    let passed = 0;
    let failed = 0;

    const assert = (condition, testName) => {
      if (condition) {
        console.log(`  ✓ PASS: ${testName}`);
        passed++;
      } else {
        console.error(`  ✗ FAIL: ${testName}`);
        failed++;
      }
    };

    // Test 1: Health check
    const healthRes = await request(app).get('/api/health');
    assert(healthRes.status === 200 && healthRes.body.success === true, 'GET /api/health returns 200 OK');

    // Test 2: Validation - Reject negative amount
    const negAmountRes = await request(app)
      .post('/api/transactions')
      .send({
        amount: -500,
        type: 'expense',
        category: 'Food',
        date: '2026-10-15',
        paymentMethod: 'UPI'
      });
    assert(negAmountRes.status === 400 && negAmountRes.body.success === false, 'POST /api/transactions rejects negative amount');

    // Test 3: Validation - Reject missing category
    const missingCatRes = await request(app)
      .post('/api/transactions')
      .send({
        amount: 250,
        type: 'expense',
        date: '2026-10-15',
        paymentMethod: 'Cash'
      });
    assert(missingCatRes.status === 400 && missingCatRes.body.success === false, 'POST /api/transactions rejects missing category');

    // Test 4: Validation - Reject invalid transaction type
    const invalidTypeRes = await request(app)
      .post('/api/transactions')
      .send({
        amount: 300,
        type: 'crypto_investment',
        category: 'Other',
        date: '2026-10-15',
        paymentMethod: 'UPI'
      });
    assert(invalidTypeRes.status === 400 && invalidTypeRes.body.success === false, 'POST /api/transactions rejects invalid transaction type');

    // Test 5: POST a valid income transaction (Faculty scenario: Salary ₹25,000)
    const incomeRes = await request(app)
      .post('/api/transactions')
      .send({
        amount: 25000,
        type: 'income',
        category: 'Salary',
        date: '2026-10-01T10:00:00.000Z',
        paymentMethod: 'Bank Transfer',
        note: 'Monthly stipend'
      });
    assert(
      incomeRes.status === 201 &&
      incomeRes.body.success === true &&
      incomeRes.body.data.amount === 25000,
      'POST /api/transactions creates valid income (₹25,000 Salary)'
    );

    // Test 6: POST a valid expense transaction (Faculty scenario: Food ₹450)
    const expenseRes = await request(app)
      .post('/api/transactions')
      .send({
        amount: 450,
        type: 'expense',
        category: 'Food',
        date: '2026-10-15T12:00:00.000Z',
        paymentMethod: 'UPI',
        note: 'Team lunch'
      });
    const expenseId = expenseRes.body.data._id;
    assert(
      expenseRes.status === 201 &&
      expenseRes.body.success === true &&
      expenseRes.body.data.amount === 450,
      'POST /api/transactions creates valid expense (₹450 Food, UPI)'
    );

    // Test 7: GET transactions filtered by month
    const getMonthRes = await request(app).get('/api/transactions?month=2026-10');
    assert(
      getMonthRes.status === 200 &&
      getMonthRes.body.count === 2 &&
      Array.isArray(getMonthRes.body.data),
      'GET /api/transactions?month=2026-10 returns transactions for October 2026'
    );

    // Test 8: GET monthly summary with MongoDB Aggregation Pipeline
    const summaryRes = await request(app).get('/api/transactions/summary?month=2026-10');
    const summaryData = summaryRes.body.data;
    assert(
      summaryRes.status === 200 &&
      summaryData.totalIncome === 25000 &&
      summaryData.totalExpenses === 450 &&
      summaryData.balance === 24550 &&
      summaryData.transactionCount === 2 &&
      summaryData.categoryBreakdown.length === 1 &&
      summaryData.categoryBreakdown[0].category === 'Food' &&
      summaryData.categoryBreakdown[0].total === 450,
      'GET /api/transactions/summary correctly aggregates income, expenses, balance, and categories via MongoDB pipeline'
    );

    // Test 9: PUT an existing transaction (Faculty scenario: change Food from 450 to 500)
    const updateRes = await request(app)
      .put(`/api/transactions/${expenseId}`)
      .send({
        amount: 500,
        note: 'Updated team lunch with dessert'
      });
    assert(
      updateRes.status === 200 &&
      updateRes.body.success === true &&
      updateRes.body.data.amount === 500,
      'PUT /api/transactions/:id updates transaction amount from ₹450 to ₹500'
    );

    // Test 10: Verify aggregation changes after PUT
    const summaryAfterPut = await request(app).get('/api/transactions/summary?month=2026-10');
    assert(
      summaryAfterPut.body.data.totalExpenses === 500 &&
      summaryAfterPut.body.data.balance === 24500,
      'MongoDB summary aggregation reflects updated expense (₹500) and balance (₹24,500)'
    );

    // Test 11: Handle invalid MongoDB ID
    const invalidPutRes = await request(app).put('/api/transactions/not-an-id').send({ amount: 100 });
    assert(invalidPutRes.status === 400, 'PUT /api/transactions/invalid-id returns 400 Bad Request');

    // Test 12: Return 404 for nonexistent valid ObjectId
    const fakeId = new mongoose.Types.ObjectId();
    const notFoundRes = await request(app).put(`/api/transactions/${fakeId}`).send({ amount: 100 });
    assert(notFoundRes.status === 404, 'PUT /api/transactions/nonexistent-id returns 404 Not Found');

    // Test 13: DELETE an existing transaction (Faculty scenario: delete expense)
    const deleteRes = await request(app).delete(`/api/transactions/${expenseId}`);
    assert(
      deleteRes.status === 200 &&
      deleteRes.body.success === true,
      'DELETE /api/transactions/:id deletes the expense transaction'
    );

    // Test 14: Verify aggregation changes after DELETE
    const summaryAfterDelete = await request(app).get('/api/transactions/summary?month=2026-10');
    assert(
      summaryAfterDelete.body.data.totalExpenses === 0 &&
      summaryAfterDelete.body.data.balance === 25000 &&
      summaryAfterDelete.body.data.transactionCount === 1,
      'MongoDB summary aggregation reflects deleted transaction (expenses = 0, balance = ₹25,000)'
    );

    // Test 15: Return zero totals for an empty month
    const emptyMonthRes = await request(app).get('/api/transactions/summary?month=2029-01');
    const emptyData = emptyMonthRes.body.data;
    assert(
      emptyMonthRes.status === 200 &&
      emptyData.totalIncome === 0 &&
      emptyData.totalExpenses === 0 &&
      emptyData.balance === 0 &&
      emptyData.transactionCount === 0 &&
      Array.isArray(emptyData.categoryBreakdown) &&
      emptyData.categoryBreakdown.length === 0,
      'GET /api/transactions/summary returns exact zeros and empty category breakdown for empty month'
    );

    // Test 16: Auth - Register new user
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Sneha Test',
        email: 'sneha_test@example.com',
        password: 'password123',
        avatar: '🌸'
      });
    assert(
      regRes.status === 201 &&
      regRes.body.success === true &&
      regRes.body.data.token &&
      regRes.body.data.user.name === 'Sneha Test',
      'POST /api/auth/register successfully registers new user and issues JWT'
    );
    const authToken = regRes.body.data.token;

    // Test 17: Auth - Login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'sneha_test@example.com',
        password: 'password123'
      });
    assert(
      loginRes.status === 200 &&
      loginRes.body.success === true &&
      loginRes.body.data.token,
      'POST /api/auth/login logs in user and returns JWT token'
    );

    // Test 18: Auth - GET /api/auth/me with token
    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);
    assert(
      meRes.status === 200 &&
      meRes.body.data.email === 'sneha_test@example.com',
      'GET /api/auth/me verifies Bearer token and returns profile'
    );

    // Test 19: Goals - Create a dream savings target
    const createGoalRes = await request(app)
      .post('/api/goals')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'New Laptop',
        targetAmount: 10000,
        currentAmount: 8000,
        category: 'Gadgets',
        emoji: '💻'
      });
    assert(
      createGoalRes.status === 201 &&
      createGoalRes.body.success === true &&
      createGoalRes.body.data.targetAmount === 10000,
      'POST /api/goals creates savings target'
    );
    const testGoalId = createGoalRes.body.data._id;

    // Test 20: Goals - Deposit funds to reach target and trigger WINNING celebration!
    const depositRes = await request(app)
      .post(`/api/goals/${testGoalId}/deposit`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ amount: 2000 });
    assert(
      depositRes.status === 200 &&
      depositRes.body.success === true &&
      depositRes.body.targetReached === true &&
      depositRes.body.data.isCompleted === true,
      'POST /api/goals/:id/deposit triggers targetReached: true when 100% milestone hit! 🏆'
    );

    console.log('\n======================================================');
    console.log(`📊 Test Summary: ${passed} passed, ${failed} failed`);
    console.log('======================================================\n');

    await mongoose.connection.close();
    await mongoServer.stop();

    if (failed > 0) {
      process.exit(1);
    } else {
      console.log('🎉 All backend and MongoDB aggregation tests passed successfully!\n');
      process.exit(0);
    }
  } catch (error) {
    console.error('Fatal test error:', error);
    if (mongoServer) await mongoServer.stop();
    process.exit(1);
  }
};

runTests();
