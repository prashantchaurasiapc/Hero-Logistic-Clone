const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
// const auth = require('../middlewares/auth');

// Default open for testing, uncomment auth to protect routes
// router.use(auth.verifyToken);

router.route('/')
  .get(UserController.getAll)
  .post(UserController.create);

router.route('/:id')
  .get(UserController.getById)
  .put(UserController.update)
  .delete(UserController.delete);

module.exports = router;
