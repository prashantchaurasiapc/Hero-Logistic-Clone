const express = require('express');
const router = express.Router();
const PromoCodeController = require('../controllers/PromoCodeController');

router.route('/')
  .get(PromoCodeController.getAll)
  .post(PromoCodeController.create);

router.route('/:id')
  .get(PromoCodeController.getById)
  .put(PromoCodeController.update)
  .delete(PromoCodeController.delete);

module.exports = router;
