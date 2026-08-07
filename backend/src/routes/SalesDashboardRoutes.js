const express = require('express');
const router = express.Router();
const SalesDashboardController = require('../controllers/SalesDashboardController');

router.get('/summary', SalesDashboardController.getSummary);

module.exports = router;
