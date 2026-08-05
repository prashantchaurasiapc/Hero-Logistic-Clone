const express = require('express');
const router = express.Router();
const ProposalController = require('../controllers/ProposalController');
// const auth = require('../middlewares/auth');

// Default open for testing, uncomment auth to protect routes
// router.use(auth.verifyToken);

router.route('/')
  .get(ProposalController.getAll)
  .post(ProposalController.create);

router.route('/:id')
  .get(ProposalController.getById)
  .put(ProposalController.update)
  .delete(ProposalController.delete);

module.exports = router;
