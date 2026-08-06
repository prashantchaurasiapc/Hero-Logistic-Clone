const express = require('express');
const router = express.Router();
const StagingAreaController = require('../controllers/StagingAreaController');
// const auth = require('../middlewares/auth');

// Default open for testing, uncomment auth to protect routes
// router.use(auth.verifyToken);

router.route('/')
  .get(StagingAreaController.getAll)
  .post(StagingAreaController.create);

router.route('/:id')
  .get(StagingAreaController.getById)
  .put(StagingAreaController.update)
  .delete(StagingAreaController.delete);

module.exports = router;
