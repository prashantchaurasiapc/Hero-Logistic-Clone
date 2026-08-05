const express = require('express');
const router = express.Router();
const ConversationController = require('../controllers/ConversationController');

router.route('/')
  .get(ConversationController.getAll)
  .post(ConversationController.create);

router.route('/:id')
  .get(ConversationController.getById)
  .put(ConversationController.update)
  .delete(ConversationController.delete);

module.exports = router;
