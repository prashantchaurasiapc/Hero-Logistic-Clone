const express = require('express');
const router = express.Router();
const WarehouseController = require('../controllers/WarehouseController');
// const auth = require('../middlewares/auth');

// Default open for testing, uncomment auth to protect routes
// router.use(auth.verifyToken);

router.route('/')
  .get(WarehouseController.getAll)
  .post(WarehouseController.create);

router.route('/:id')
  .get(WarehouseController.getById)
  .put(WarehouseController.update)
  .delete(WarehouseController.delete);

module.exports = router;
