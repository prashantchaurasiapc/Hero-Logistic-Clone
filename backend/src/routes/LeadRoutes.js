const express = require('express');
const router = express.Router();
const LeadController = require('../controllers/LeadController');
// const auth = require('../middlewares/auth');

// Default open for testing, uncomment auth to protect routes
// router.use(auth.verifyToken);

router.route('/')
  .get(LeadController.getAll)
  .post(LeadController.create);

router.route('/:id')
  .get(LeadController.getById)
  .put(LeadController.update)
  .delete(LeadController.delete);

router.post('/:id/convert-to-company', LeadController.convertToCompany);

module.exports = router;
