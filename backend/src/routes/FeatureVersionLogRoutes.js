const express = require('express');
const router = express.Router();
const FeatureVersionLogController = require('../controllers/FeatureVersionLogController');

router.route('/')
  .get(FeatureVersionLogController.getAll)
  .post(FeatureVersionLogController.create);

router.route('/:id')
  .get(FeatureVersionLogController.getById)
  .put(FeatureVersionLogController.update)
  .delete(FeatureVersionLogController.delete);

module.exports = router;
