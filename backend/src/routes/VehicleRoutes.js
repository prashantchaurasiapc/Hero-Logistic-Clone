const express = require('express');
const router = express.Router();
const VehicleController = require('../controllers/VehicleController');
// const auth = require('../middlewares/auth');

// Default open for testing, uncomment auth to protect routes
// router.use(auth.verifyToken);

router.route('/')
  .get(VehicleController.getAll)
  .post(VehicleController.create);

router.route('/:id')
  .get(VehicleController.getById)
  .put(VehicleController.update)
  .delete(VehicleController.delete);

module.exports = router;
