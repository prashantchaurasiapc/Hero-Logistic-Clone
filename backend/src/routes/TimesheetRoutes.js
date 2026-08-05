const express = require('express');
const router = express.Router();
const TimesheetController = require('../controllers/TimesheetController');
// const auth = require('../middlewares/auth');

// Default open for testing, uncomment auth to protect routes
// router.use(auth.verifyToken);

router.route('/')
  .get(TimesheetController.getAll)
  .post(TimesheetController.create);

router.route('/:id')
  .get(TimesheetController.getById)
  .put(TimesheetController.update)
  .delete(TimesheetController.delete);

module.exports = router;
