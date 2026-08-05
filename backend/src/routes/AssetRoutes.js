const express = require('express');
const router = express.Router();
const AssetController = require('../controllers/AssetController');

router.route('/')
  .get(AssetController.getAll)
  .post(AssetController.create);

router.route('/:id')
  .get(AssetController.getById)
  .put(AssetController.update)
  .delete(AssetController.delete);

module.exports = router;
