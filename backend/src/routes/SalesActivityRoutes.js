const express = require('express');
const router = express.Router();
const SalesActivityController = require('../controllers/SalesActivityController');

router.route('/')
  .get(SalesActivityController.getAll)
  .post(SalesActivityController.create);

router.route('/:id')
  .get(SalesActivityController.getById)
  .put(SalesActivityController.update)
  .delete(SalesActivityController.delete);

module.exports = router;
