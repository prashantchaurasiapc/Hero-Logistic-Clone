const express = require('express');
const router = express.Router();
const CompanyFeatureOverrideController = require('../controllers/CompanyFeatureOverrideController');

router.route('/')
  .get(CompanyFeatureOverrideController.getAll)
  .post(CompanyFeatureOverrideController.create);

router.route('/:id')
  .get(CompanyFeatureOverrideController.getById)
  .put(CompanyFeatureOverrideController.update)
  .delete(CompanyFeatureOverrideController.delete);

module.exports = router;
