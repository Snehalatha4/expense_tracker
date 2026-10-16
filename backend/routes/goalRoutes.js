const express = require('express');
const router = express.Router();
const {
  getGoals,
  createGoal,
  addFundsToGoal,
  updateGoal,
  deleteGoal
} = require('../controllers/goalController');
const { optionalAuth } = require('../middleware/auth');

router.use(optionalAuth);

router.route('/')
  .get(getGoals)
  .post(createGoal);

router.route('/:id')
  .put(updateGoal)
  .delete(deleteGoal);

router.post('/:id/deposit', addFundsToGoal);

module.exports = router;
