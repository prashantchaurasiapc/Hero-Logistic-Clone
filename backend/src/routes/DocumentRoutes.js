const express = require('express');
const router = express.Router();
const DocumentController = require('../controllers/DocumentController');
// const auth = require('../middlewares/auth');

// Default open for testing, uncomment auth to protect routes
// router.use(auth.verifyToken);

router.route('/')
  .get(DocumentController.getAll)
  .post(DocumentController.create);

router.route('/:id')
  .get(DocumentController.getById)
  .put(DocumentController.update)
  .delete(DocumentController.delete);

module.exports = router;
