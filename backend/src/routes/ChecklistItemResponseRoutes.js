const express = require('express');
const router = express.Router();
const ChecklistItemResponseController = require('../controllers/ChecklistItemResponseController');

router.route('/')
  .get(ChecklistItemResponseController.getAll)
  .post(ChecklistItemResponseController.create);

router.route('/:id')
  .get(ChecklistItemResponseController.getById)
  .put(ChecklistItemResponseController.update)
  .delete(ChecklistItemResponseController.delete);

module.exports = router;
