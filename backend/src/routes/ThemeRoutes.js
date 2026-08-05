const express = require('express');
const router = express.Router();
const ThemeController = require('../controllers/ThemeController');

router.route('/')
  .get(ThemeController.getAll)
  .post(ThemeController.create);

router.route('/:id')
  .get(ThemeController.getById)
  .put(ThemeController.update)
  .delete(ThemeController.delete);

module.exports = router;
