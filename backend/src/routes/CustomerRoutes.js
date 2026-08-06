const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/CustomerController');
// const auth = require('../middlewares/auth');

// Default open for testing, uncomment auth to protect routes
// router.use(auth.verifyToken);

router.route('/')
  .get(CustomerController.getAll)
  .post(CustomerController.create);

router.route('/:id')
  .get(CustomerController.getById)
  .put(CustomerController.update)
  .delete(CustomerController.delete);

module.exports = router;
