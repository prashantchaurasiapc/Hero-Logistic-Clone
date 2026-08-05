const express = require('express');
const router = express.Router();
const DriverController = require('../controllers/DriverController');
// const auth = require('../middlewares/auth');

// Default open for testing, uncomment auth to protect routes
// router.use(auth.verifyToken);

router.route('/')
  .get(DriverController.getAll)
  .post(DriverController.create);

router.route('/:id')
  .get(DriverController.getById)
  .put(DriverController.update)
  .delete(DriverController.delete);

module.exports = router;
