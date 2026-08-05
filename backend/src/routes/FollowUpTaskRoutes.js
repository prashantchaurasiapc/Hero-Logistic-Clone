const express = require('express');
const router = express.Router();
const FollowUpTaskController = require('../controllers/FollowUpTaskController');

router.route('/')
  .get(FollowUpTaskController.getAll)
  .post(FollowUpTaskController.create);

router.route('/:id')
  .get(FollowUpTaskController.getById)
  .put(FollowUpTaskController.update)
  .delete(FollowUpTaskController.delete);

module.exports = router;
