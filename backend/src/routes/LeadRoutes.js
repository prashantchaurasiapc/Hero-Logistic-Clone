const express = require('express');
const router = express.Router();
const LeadController = require('../controllers/LeadController');

router.route('/')
  .get(LeadController.getAll)
  .post(LeadController.create);

router.route('/:id')
  .get(LeadController.getById)
  .put(LeadController.update)
  .delete(LeadController.delete);

module.exports = router;
