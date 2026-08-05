const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/MessageController');

router.route('/')
  .get(MessageController.getAll)
  .post(MessageController.create);

router.route('/:id')
  .get(MessageController.getById)
  .put(MessageController.update)
  .delete(MessageController.delete);

module.exports = router;
