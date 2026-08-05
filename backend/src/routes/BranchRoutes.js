const express = require('express');
const router = express.Router();
const BranchController = require('../controllers/BranchController');

router.route('/')
  .get(BranchController.getAll)
  .post(BranchController.create);

router.route('/:id')
  .get(BranchController.getById)
  .put(BranchController.update)
  .delete(BranchController.delete);

module.exports = router;
