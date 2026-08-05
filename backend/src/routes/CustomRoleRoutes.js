const express = require('express');
const router = express.Router();
const CustomRoleController = require('../controllers/CustomRoleController');

router.route('/')
  .get(CustomRoleController.getAll)
  .post(CustomRoleController.create);

router.route('/:id')
  .get(CustomRoleController.getById)
  .put(CustomRoleController.update)
  .delete(CustomRoleController.delete);

module.exports = router;
