const express = require('express');
const router = express.Router();
const ApiUsageLogController = require('../controllers/ApiUsageLogController');

router.route('/')
  .get(ApiUsageLogController.getAll)
  .post(ApiUsageLogController.create);

router.route('/:id')
  .get(ApiUsageLogController.getById)
  .put(ApiUsageLogController.update)
  .delete(ApiUsageLogController.delete);

module.exports = router;
