const express = require('express');
const router = express.Router();
const AssetController = require('../controllers/AssetController');
// const auth = require('../middlewares/auth');

// Default open for testing, uncomment auth to protect routes
// router.use(auth.verifyToken);

router.route('/')
  .get(AssetController.getAll)
  .post(AssetController.create);

router.route('/:id')
  .get(AssetController.getById)
  .put(AssetController.update)
  .delete(AssetController.delete);

module.exports = router;
