const express = require('express');
const router = express.Router();
const CustomDomainController = require('../controllers/CustomDomainController');

router.route('/')
  .get(CustomDomainController.getAll)
  .post(CustomDomainController.create);

router.route('/:id')
  .get(CustomDomainController.getById)
  .put(CustomDomainController.update)
  .delete(CustomDomainController.delete);

module.exports = router;
