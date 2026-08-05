const express = require('express');
const router = express.Router();
const DeliveryPODController = require('../controllers/DeliveryPODController');
// const auth = require('../middlewares/auth');

// Default open for testing, uncomment auth to protect routes
// router.use(auth.verifyToken);

router.route('/')
  .get(DeliveryPODController.getAll)
  .post(DeliveryPODController.create);

router.route('/:id')
  .get(DeliveryPODController.getById)
  .put(DeliveryPODController.update)
  .delete(DeliveryPODController.delete);

module.exports = router;
