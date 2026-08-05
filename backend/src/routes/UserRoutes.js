const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.route('/')
  .get(UserController.getAll)
  .post(UserController.create);

router.route('/:id')
  .get(UserController.getById)
  .put(UserController.update)
  .delete(UserController.delete);

module.exports = router;
