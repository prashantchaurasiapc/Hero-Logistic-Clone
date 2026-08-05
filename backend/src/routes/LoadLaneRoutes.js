const express = require('express');
const router = express.Router();
const LoadLaneController = require('../controllers/LoadLaneController');

router.route('/')
  .get(LoadLaneController.getAll)
  .post(LoadLaneController.create);

router.route('/:id')
  .get(LoadLaneController.getById)
  .put(LoadLaneController.update)
  .delete(LoadLaneController.delete);

module.exports = router;
