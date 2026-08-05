const express = require('express');
const router = express.Router();
const OfflineSyncItemController = require('../controllers/OfflineSyncItemController');

router.route('/')
  .get(OfflineSyncItemController.getAll)
  .post(OfflineSyncItemController.create);

router.route('/:id')
  .get(OfflineSyncItemController.getById)
  .put(OfflineSyncItemController.update)
  .delete(OfflineSyncItemController.delete);

module.exports = router;
