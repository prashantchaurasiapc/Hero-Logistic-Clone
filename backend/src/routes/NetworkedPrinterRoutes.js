const express = require('express');
const router = express.Router();
const NetworkedPrinterController = require('../controllers/NetworkedPrinterController');

router.route('/')
  .get(NetworkedPrinterController.getAll)
  .post(NetworkedPrinterController.create);

router.route('/:id')
  .get(NetworkedPrinterController.getById)
  .put(NetworkedPrinterController.update)
  .delete(NetworkedPrinterController.delete);

module.exports = router;
