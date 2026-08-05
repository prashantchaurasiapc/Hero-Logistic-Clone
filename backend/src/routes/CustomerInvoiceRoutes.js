const express = require('express');
const router = express.Router();
const CustomerInvoiceController = require('../controllers/CustomerInvoiceController');

router.route('/')
  .get(CustomerInvoiceController.getAll)
  .post(CustomerInvoiceController.create);

router.route('/:id')
  .get(CustomerInvoiceController.getById)
  .put(CustomerInvoiceController.update)
  .delete(CustomerInvoiceController.delete);

module.exports = router;
