const express = require('express');
const router = express.Router();
const DemoBookingController = require('../controllers/DemoBookingController');

router.route('/')
  .get(DemoBookingController.getAll)
  .post(DemoBookingController.create);

router.route('/:id')
  .get(DemoBookingController.getById)
  .put(DemoBookingController.update)
  .delete(DemoBookingController.delete);

module.exports = router;
