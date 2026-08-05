const express = require('express');
const router = express.Router();
const WarehouseLabelPrintController = require('../controllers/WarehouseLabelPrintController');

router.route('/')
  .get(WarehouseLabelPrintController.getAll)
  .post(WarehouseLabelPrintController.create);

router.route('/:id')
  .get(WarehouseLabelPrintController.getById)
  .put(WarehouseLabelPrintController.update)
  .delete(WarehouseLabelPrintController.delete);

module.exports = router;
