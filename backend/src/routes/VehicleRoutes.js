const express = require('express');
const router = express.Router();
const VehicleController = require('../controllers/VehicleController');

router.route('/')
  .get(VehicleController.getAll)
  .post(VehicleController.create);

router.route('/:id')
  .get(VehicleController.getById)
  .put(VehicleController.update)
  .delete(VehicleController.delete);

module.exports = router;
