const express = require('express');
const router = express.Router();
const FeatureDependencyController = require('../controllers/FeatureDependencyController');

router.route('/')
  .get(FeatureDependencyController.getAll)
  .post(FeatureDependencyController.create);

router.route('/:id')
  .get(FeatureDependencyController.getById)
  .put(FeatureDependencyController.update)
  .delete(FeatureDependencyController.delete);

module.exports = router;
