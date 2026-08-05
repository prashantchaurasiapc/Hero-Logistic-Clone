const express = require('express');
const router = express.Router();
const AiModuleController = require('../controllers/AiModuleController');

router.route('/')
  .get(AiModuleController.getAll)
  .post(AiModuleController.create);

router.route('/:id')
  .get(AiModuleController.getById)
  .put(AiModuleController.update)
  .delete(AiModuleController.delete);

module.exports = router;
