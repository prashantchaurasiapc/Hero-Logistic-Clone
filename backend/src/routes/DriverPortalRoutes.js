const express = require('express');
const router = express.Router();
const DriverPortalController = require('../controllers/DriverPortalController');
const { verifyToken } = require('../middlewares/auth');
const { resolveTenant } = require('../middlewares/tenantResolver');

router.use(verifyToken, resolveTenant);

router.get('/dashboard', DriverPortalController.getDashboard);
router.post('/status', DriverPortalController.updateStatus);
router.post('/messages', DriverPortalController.sendQuickMessage);

module.exports = router;
