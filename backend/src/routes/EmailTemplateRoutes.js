const express = require('express');
const router = express.Router();
const EmailTemplateController = require('../controllers/EmailTemplateController');

router.route('/')
  .get(EmailTemplateController.getAll)
  .post(EmailTemplateController.create);

router.route('/:id')
  .get(EmailTemplateController.getById)
  .put(EmailTemplateController.update)
  .delete(EmailTemplateController.delete);

module.exports = router;
