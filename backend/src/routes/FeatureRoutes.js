const express = require('express');
const router = express.Router();
const FeatureController = require('../controllers/FeatureController');

router.route('/')
  .get(FeatureController.getAll)
  .post(FeatureController.create);

router.route('/:id')
  .get(FeatureController.getById)
  .put(FeatureController.update)
  .delete(FeatureController.delete);

module.exports = router;
