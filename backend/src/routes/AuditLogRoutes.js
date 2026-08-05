const express = require('express');
const router = express.Router();
const AuditLogController = require('../controllers/AuditLogController');

router.route('/')
  .get(AuditLogController.getAll)
  .post(AuditLogController.create);

router.route('/:id')
  .get(AuditLogController.getById)
  .put(AuditLogController.update)
  .delete(AuditLogController.delete);

module.exports = router;
