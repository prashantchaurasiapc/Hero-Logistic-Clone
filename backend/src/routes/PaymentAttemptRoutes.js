const express = require('express');
const router = express.Router();
const PaymentAttemptController = require('../controllers/PaymentAttemptController');

router.route('/')
  .get(PaymentAttemptController.getAll)
  .post(PaymentAttemptController.create);

router.route('/:id')
  .get(PaymentAttemptController.getById)
  .put(PaymentAttemptController.update)
  .delete(PaymentAttemptController.delete);

module.exports = router;
