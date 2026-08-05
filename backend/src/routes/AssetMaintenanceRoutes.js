const express = require('express');
const router = express.Router();
const AssetMaintenanceController = require('../controllers/AssetMaintenanceController');

router.route('/')
  .get(AssetMaintenanceController.getAll)
  .post(AssetMaintenanceController.create);

router.route('/:id')
  .get(AssetMaintenanceController.getById)
  .put(AssetMaintenanceController.update)
  .delete(AssetMaintenanceController.delete);

module.exports = router;
