const express = require('express');
const router = express.Router();
const InboundReceiptController = require('../controllers/InboundReceiptController');
// const auth = require('../middlewares/auth');

// Default open for testing, uncomment auth to protect routes
// router.use(auth.verifyToken);

router.route('/')
  .get(InboundReceiptController.getAll)
  .post(InboundReceiptController.create);

router.route('/:id')
  .get(InboundReceiptController.getById)
  .put(InboundReceiptController.update)
  .delete(InboundReceiptController.delete);

module.exports = router;
