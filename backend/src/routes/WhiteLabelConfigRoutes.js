const express = require('express');
const router = express.Router();
const WhiteLabelConfigController = require('../controllers/WhiteLabelConfigController');

router.route('/')
  .get(WhiteLabelConfigController.getAll)
  .post(WhiteLabelConfigController.create);

router.route('/:id')
  .get(WhiteLabelConfigController.getById)
  .put(WhiteLabelConfigController.update)
  .delete(WhiteLabelConfigController.delete);

module.exports = router;
