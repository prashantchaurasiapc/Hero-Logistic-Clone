const express = require('express');
const router = express.Router();
const AssetAssignmentController = require('../controllers/AssetAssignmentController');

router.route('/')
  .get(AssetAssignmentController.getAll)
  .post(AssetAssignmentController.create);

router.route('/:id')
  .get(AssetAssignmentController.getById)
  .put(AssetAssignmentController.update)
  .delete(AssetAssignmentController.delete);

module.exports = router;
