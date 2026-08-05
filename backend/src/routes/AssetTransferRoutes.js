const express = require('express');
const router = express.Router();
const AssetTransferController = require('../controllers/AssetTransferController');

router.route('/')
  .get(AssetTransferController.getAll)
  .post(AssetTransferController.create);

router.route('/:id')
  .get(AssetTransferController.getById)
  .put(AssetTransferController.update)
  .delete(AssetTransferController.delete);

module.exports = router;
