const express = require('express');
const router = express.Router();
const LoadItemController = require('../controllers/LoadItemController');

router.route('/')
  .get(LoadItemController.getAll)
  .post(LoadItemController.create);

router.route('/:id')
  .get(LoadItemController.getById)
  .put(LoadItemController.update)
  .delete(LoadItemController.delete);

module.exports = router;
