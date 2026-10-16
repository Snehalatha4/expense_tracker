const express = require('express');
const router = express.Router();
const { getBudget, setBudget } = require('../controllers/budgetController');
const { optionalAuth } = require('../middleware/auth');

router.use(optionalAuth);

router.route('/')
  .get(getBudget)
  .post(setBudget);

module.exports = router;
