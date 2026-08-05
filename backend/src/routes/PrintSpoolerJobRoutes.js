const express = require('express');
const router = express.Router();
const PrintSpoolerJobController = require('../controllers/PrintSpoolerJobController');

router.route('/')
  .get(PrintSpoolerJobController.getAll)
  .post(PrintSpoolerJobController.create);

router.route('/:id')
  .get(PrintSpoolerJobController.getById)
  .put(PrintSpoolerJobController.update)
  .delete(PrintSpoolerJobController.delete);

module.exports = router;
