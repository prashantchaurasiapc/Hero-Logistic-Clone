const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/CustomerController');

router.route('/')
  .get(CustomerController.getAll)
  .post(CustomerController.create);

router.route('/:id')
  .get(CustomerController.getById)
  .put(CustomerController.update)
  .delete(CustomerController.delete);

module.exports = router;
