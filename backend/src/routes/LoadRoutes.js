const express = require('express');
const router = express.Router();
const LoadController = require('../controllers/LoadController');

router.route('/')
  .get(LoadController.getAll)
  .post(LoadController.create);

router.route('/:id')
  .get(LoadController.getById)
  .put(LoadController.update)
  .delete(LoadController.delete);

module.exports = router;
