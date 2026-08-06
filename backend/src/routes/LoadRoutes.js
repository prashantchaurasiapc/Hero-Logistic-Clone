const express = require('express');
const router = express.Router();
const LoadController = require('../controllers/LoadController');
const { requireIdempotency } = require('../middlewares/idempotency');
// const auth = require('../middlewares/auth');

// Default open for testing, uncomment auth to protect routes
// router.use(auth.verifyToken);

router.route('/')
  .get(LoadController.getAll)
  .post(LoadController.create);

router.route('/:id')
  .get(LoadController.getById)
  .put(LoadController.update)
  .delete(LoadController.delete);

// Custom routes
router.post('/:id/activate', requireIdempotency, LoadController.activate);
router.post('/:id/assignments', LoadController.assign);
router.post('/:id/status-transitions', LoadController.updateStatus);

module.exports = router;
