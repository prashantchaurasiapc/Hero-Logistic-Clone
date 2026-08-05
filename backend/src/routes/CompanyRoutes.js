const express = require('express');
const router = express.Router();
const CompanyController = require('../controllers/CompanyController');

router.route('/')
  .get(CompanyController.getAll)
  .post(CompanyController.create);

router.route('/:id')
  .get(CompanyController.getById)
  .put(CompanyController.update)
  .delete(CompanyController.delete);

module.exports = router;
