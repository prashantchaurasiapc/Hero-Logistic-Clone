const express = require('express');
const router = express.Router();
const PreStartChecklistController = require('../controllers/PreStartChecklistController');
// const auth = require('../middlewares/auth');

// Default open for testing, uncomment auth to protect routes
// router.use(auth.verifyToken);

router.route('/')
  .get(PreStartChecklistController.getAll)
  .post(PreStartChecklistController.create);

router.route('/:id')
  .get(PreStartChecklistController.getById)
  .put(PreStartChecklistController.update)
  .delete(PreStartChecklistController.delete);

module.exports = router;
