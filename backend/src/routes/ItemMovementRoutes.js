const express = require('express');
const router = express.Router();
const ItemMovementController = require('../controllers/ItemMovementController');
// const auth = require('../middlewares/auth');

// Default open for testing, uncomment auth to protect routes
// router.use(auth.verifyToken);

router.route('/')
  .get(ItemMovementController.getAll)
  .post(ItemMovementController.create);

router.route('/:id')
  .get(ItemMovementController.getById)
  .put(ItemMovementController.update)
  .delete(ItemMovementController.delete);

module.exports = router;
