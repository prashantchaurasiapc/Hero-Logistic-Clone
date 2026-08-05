const express = require('express');
const router = express.Router();
const ProofPhotoController = require('../controllers/ProofPhotoController');

router.route('/')
  .get(ProofPhotoController.getAll)
  .post(ProofPhotoController.create);

router.route('/:id')
  .get(ProofPhotoController.getById)
  .put(ProofPhotoController.update)
  .delete(ProofPhotoController.delete);

module.exports = router;
