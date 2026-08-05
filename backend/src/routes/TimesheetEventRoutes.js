const express = require('express');
const router = express.Router();
const TimesheetEventController = require('../controllers/TimesheetEventController');
// const auth = require('../middlewares/auth');

// Default open for testing, uncomment auth to protect routes
// router.use(auth.verifyToken);

router.route('/')
  .get(TimesheetEventController.getAll)
  .post(TimesheetEventController.create);

router.route('/:id')
  .get(TimesheetEventController.getById)
  .put(TimesheetEventController.update)
  .delete(TimesheetEventController.delete);

module.exports = router;
