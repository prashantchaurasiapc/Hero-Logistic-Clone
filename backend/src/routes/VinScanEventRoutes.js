const express = require('express');
const router = express.Router();
const VinScanEventController = require('../controllers/VinScanEventController');

router.route('/')
  .get(VinScanEventController.getAll)
  .post(VinScanEventController.create);

router.route('/:id')
  .get(VinScanEventController.getById)
  .put(VinScanEventController.update)
  .delete(VinScanEventController.delete);

module.exports = router;
