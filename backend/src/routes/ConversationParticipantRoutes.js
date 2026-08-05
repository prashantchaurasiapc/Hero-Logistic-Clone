const express = require('express');
const router = express.Router();
const ConversationParticipantController = require('../controllers/ConversationParticipantController');

router.route('/')
  .get(ConversationParticipantController.getAll)
  .post(ConversationParticipantController.create);

router.route('/:id')
  .get(ConversationParticipantController.getById)
  .put(ConversationParticipantController.update)
  .delete(ConversationParticipantController.delete);

module.exports = router;
