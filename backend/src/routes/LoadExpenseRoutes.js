const express = require('express');
const router = express.Router();
const LoadExpenseController = require('../controllers/LoadExpenseController');

router.route('/')
  .get(LoadExpenseController.getAll)
  .post(LoadExpenseController.create);

router.route('/:id')
  .get(LoadExpenseController.getById)
  .put(LoadExpenseController.update)
  .delete(LoadExpenseController.delete);

module.exports = router;
