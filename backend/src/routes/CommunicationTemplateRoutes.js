const express = require('express');
const router = express.Router();
const CommunicationTemplateController = require('../controllers/CommunicationTemplateController');

router.route('/')
  .get(CommunicationTemplateController.getAll)
  .post(CommunicationTemplateController.create);

router.route('/:id')
  .get(CommunicationTemplateController.getById)
  .put(CommunicationTemplateController.update)
  .delete(CommunicationTemplateController.delete);

module.exports = router;
