const express = require('express');
const router = express.Router();
const UserSessionController = require('../controllers/UserSessionController');

router.route('/')
  .get(UserSessionController.getAll)
  .post(UserSessionController.create);

router.route('/:id')
  .get(UserSessionController.getById)
  .put(UserSessionController.update)
  .delete(UserSessionController.delete);

module.exports = router;
