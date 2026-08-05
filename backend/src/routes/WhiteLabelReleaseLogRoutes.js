const express = require('express');
const router = express.Router();
const WhiteLabelReleaseLogController = require('../controllers/WhiteLabelReleaseLogController');

router.route('/')
  .get(WhiteLabelReleaseLogController.getAll)
  .post(WhiteLabelReleaseLogController.create);

router.route('/:id')
  .get(WhiteLabelReleaseLogController.getById)
  .put(WhiteLabelReleaseLogController.update)
  .delete(WhiteLabelReleaseLogController.delete);

module.exports = router;
