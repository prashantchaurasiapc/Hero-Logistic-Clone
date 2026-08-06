const express = require('express');
const router = express.Router();
const LoadController = require('../controllers/LoadController');
// const auth = require('../middlewares/auth');

// Default open for testing, uncomment auth to protect routes
// router.use(auth.verifyToken);

router.route('/')
  .get(LoadController.getAll)
  .post(LoadController.create);

router.route('/:id')
  .get(LoadController.getById)
  .put(LoadController.update)
  .delete(LoadController.delete);

module.exports = router;
