const express = require('express');
const router = express.Router();
const SubscriptionPlanController = require('../controllers/SubscriptionPlanController');

router.route('/')
  .get(SubscriptionPlanController.getAll)
  .post(SubscriptionPlanController.create);

router.route('/:id')
  .get(SubscriptionPlanController.getById)
  .put(SubscriptionPlanController.update)
  .delete(SubscriptionPlanController.delete);

module.exports = router;
