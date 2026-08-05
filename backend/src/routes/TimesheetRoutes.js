const express = require('express');
const router = express.Router();
const TimesheetController = require('../controllers/TimesheetController');

router.route('/')
  .get(TimesheetController.getAll)
  .post(TimesheetController.create);

router.route('/:id')
  .get(TimesheetController.getById)
  .put(TimesheetController.update)
  .delete(TimesheetController.delete);

module.exports = router;
