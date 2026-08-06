const express = require('express');
const router = express.Router();
const CustomerInvoiceController = require('../controllers/CustomerInvoiceController');
// const auth = require('../middlewares/auth');

// Default open for testing, uncomment auth to protect routes
// router.use(auth.verifyToken);

router.route('/')
  .get(CustomerInvoiceController.getAll)
  .post(CustomerInvoiceController.create);

router.route('/:id')
  .get(CustomerInvoiceController.getById)
  .put(CustomerInvoiceController.update)
  .delete(CustomerInvoiceController.delete);

module.exports = router;
