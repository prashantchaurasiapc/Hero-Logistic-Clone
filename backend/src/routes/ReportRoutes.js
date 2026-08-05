const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/ReportController');

router.route('/')
  .get(ReportController.getAll)
  .post(ReportController.create);

router.route('/:id')
  .get(ReportController.getById)
  .put(ReportController.update)
  .delete(ReportController.delete);

module.exports = router;
