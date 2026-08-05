const express = require('express');
const router = express.Router();
const AiActivityLogController = require('../controllers/AiActivityLogController');

router.route('/')
  .get(AiActivityLogController.getAll)
  .post(AiActivityLogController.create);

router.route('/:id')
  .get(AiActivityLogController.getById)
  .put(AiActivityLogController.update)
  .delete(AiActivityLogController.delete);

module.exports = router;
