const express = require('express');
const router = express.Router();
const ShiftController = require('../controllers/ShiftController');

router.route('/')
  .get(ShiftController.getAll)
  .post(ShiftController.create);

router.route('/:id')
  .get(ShiftController.getById)
  .put(ShiftController.update)
  .delete(ShiftController.delete);

module.exports = router;
