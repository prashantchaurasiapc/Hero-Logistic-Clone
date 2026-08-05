const express = require('express');
const router = express.Router();
const ItemMovementController = require('../controllers/ItemMovementController');

router.route('/')
  .get(ItemMovementController.getAll)
  .post(ItemMovementController.create);

router.route('/:id')
  .get(ItemMovementController.getById)
  .put(ItemMovementController.update)
  .delete(ItemMovementController.delete);

module.exports = router;
