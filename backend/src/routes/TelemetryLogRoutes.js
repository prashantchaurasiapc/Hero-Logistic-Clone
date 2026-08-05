const express = require('express');
const router = express.Router();
const TelemetryLogController = require('../controllers/TelemetryLogController');

router.route('/')
  .get(TelemetryLogController.getAll)
  .post(TelemetryLogController.create);

router.route('/:id')
  .get(TelemetryLogController.getById)
  .put(TelemetryLogController.update)
  .delete(TelemetryLogController.delete);

module.exports = router;
