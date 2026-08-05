const express = require('express');
const router = express.Router();
const ApiIntegrationController = require('../controllers/ApiIntegrationController');

router.route('/')
  .get(ApiIntegrationController.getAll)
  .post(ApiIntegrationController.create);

router.route('/:id')
  .get(ApiIntegrationController.getById)
  .put(ApiIntegrationController.update)
  .delete(ApiIntegrationController.delete);

module.exports = router;
