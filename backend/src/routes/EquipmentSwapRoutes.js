const express = require('express');
const router = express.Router();
const EquipmentSwapController = require('../controllers/EquipmentSwapController');

router.route('/')
  .get(EquipmentSwapController.getAll)
  .post(EquipmentSwapController.create);

router.route('/:id')
  .get(EquipmentSwapController.getById)
  .put(EquipmentSwapController.update)
  .delete(EquipmentSwapController.delete);

module.exports = router;
