const express = require('express');
const router = express.Router();
const ProposalController = require('../controllers/ProposalController');

router.route('/')
  .get(ProposalController.getAll)
  .post(ProposalController.create);

router.route('/:id')
  .get(ProposalController.getById)
  .put(ProposalController.update)
  .delete(ProposalController.delete);

module.exports = router;
