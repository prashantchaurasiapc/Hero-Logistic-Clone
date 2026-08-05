const express = require('express');
const router = express.Router();
const TenantSubscriptionController = require('../controllers/TenantSubscriptionController');

router.route('/')
  .get(TenantSubscriptionController.getAll)
  .post(TenantSubscriptionController.create);

router.route('/:id')
  .get(TenantSubscriptionController.getById)
  .put(TenantSubscriptionController.update)
  .delete(TenantSubscriptionController.delete);

module.exports = router;
