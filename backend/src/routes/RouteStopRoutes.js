const express = require('express');
const router = express.Router();
const RouteStopController = require('../controllers/RouteStopController');

router.route('/')
  .get(RouteStopController.getAll)
  .post(RouteStopController.create);

router.route('/:id')
  .get(RouteStopController.getById)
  .put(RouteStopController.update)
  .delete(RouteStopController.delete);

module.exports = router;
