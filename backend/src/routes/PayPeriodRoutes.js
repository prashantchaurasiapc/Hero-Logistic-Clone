const express = require('express');
const router = express.Router();
const PayPeriodController = require('../controllers/PayPeriodController');

router.route('/')
  .get(PayPeriodController.getAll)
  .post(PayPeriodController.create);

router.route('/:id')
  .get(PayPeriodController.getById)
  .put(PayPeriodController.update)
  .delete(PayPeriodController.delete);

module.exports = router;
