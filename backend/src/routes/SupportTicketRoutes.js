const express = require('express');
const router = express.Router();
const SupportTicketController = require('../controllers/SupportTicketController');

router.route('/')
  .get(SupportTicketController.getAll)
  .post(SupportTicketController.create);

router.route('/:id')
  .get(SupportTicketController.getById)
  .put(SupportTicketController.update)
  .delete(SupportTicketController.delete);

module.exports = router;
