const express = require('express');
const router = express.Router();
const LoadLaneController = require('../controllers/LoadLaneController');
// const auth = require('../middlewares/auth');

// Default open for testing, uncomment auth to protect routes
// router.use(auth.verifyToken);

router.route('/')
  .get(LoadLaneController.getAll)
  .post(LoadLaneController.create);

router.route('/:id')
  .get(LoadLaneController.getById)
  .put(LoadLaneController.update)
  .delete(LoadLaneController.delete);

module.exports = router;
