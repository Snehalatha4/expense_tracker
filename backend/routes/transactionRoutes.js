const express = require('express');
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getMonthlySummary
} = require('../controllers/transactionController');
const { optionalAuth } = require('../middleware/auth');

router.use(optionalAuth);

// Summary route must be mounted before :id parameter route
router.get('/summary', getMonthlySummary);

router.route('/')
  .get(getTransactions)
  .post(createTransaction);

router.route('/:id')
  .put(updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
