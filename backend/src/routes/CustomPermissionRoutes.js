const express = require('express');
const router = express.Router();
const CustomPermissionController = require('../controllers/CustomPermissionController');

router.route('/')
  .get(CustomPermissionController.getAll)
  .post(CustomPermissionController.create);

router.route('/:id')
  .get(CustomPermissionController.getById)
  .put(CustomPermissionController.update)
  .delete(CustomPermissionController.delete);

module.exports = router;
