const express = require('express');
const router = express.Router();
const ReportScheduleController = require('../controllers/ReportScheduleController');

router.route('/')
  .get(ReportScheduleController.getAll)
  .post(ReportScheduleController.create);

router.route('/:id')
  .get(ReportScheduleController.getById)
  .put(ReportScheduleController.update)
  .delete(ReportScheduleController.delete);

module.exports = router;
