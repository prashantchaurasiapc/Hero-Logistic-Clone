const express = require('express');
const router = express.Router();
const LoadActivityController = require('../controllers/LoadActivityController');

router.route('/')
  .get(LoadActivityController.getAll)
  .post(LoadActivityController.create);

router.route('/:id')
  .get(LoadActivityController.getById)
  .put(LoadActivityController.update)
  .delete(LoadActivityController.delete);

module.exports = router;
