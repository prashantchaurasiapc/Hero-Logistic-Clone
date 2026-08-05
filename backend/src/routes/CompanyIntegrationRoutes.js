const express = require('express');
const router = express.Router();
const CompanyIntegrationController = require('../controllers/CompanyIntegrationController');

router.route('/')
  .get(CompanyIntegrationController.getAll)
  .post(CompanyIntegrationController.create);

router.route('/:id')
  .get(CompanyIntegrationController.getById)
  .put(CompanyIntegrationController.update)
  .delete(CompanyIntegrationController.delete);

module.exports = router;
