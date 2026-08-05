const express = require('express');
const router = express.Router();
const ModuleUsageLogController = require('../controllers/ModuleUsageLogController');

router.route('/')
  .get(ModuleUsageLogController.getAll)
  .post(ModuleUsageLogController.create);

router.route('/:id')
  .get(ModuleUsageLogController.getById)
  .put(ModuleUsageLogController.update)
  .delete(ModuleUsageLogController.delete);

module.exports = router;
