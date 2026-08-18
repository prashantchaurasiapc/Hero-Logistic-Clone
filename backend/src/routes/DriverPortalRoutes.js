const express = require('express');
const router = express.Router();
const DriverPortalController = require('../controllers/DriverPortalController');
const { verifyToken } = require('../middlewares/auth');
const { resolveTenant } = require('../middlewares/tenantResolver');

router.use(verifyToken, resolveTenant);

router.get('/dashboard', DriverPortalController.getDashboard);
router.post('/status', DriverPortalController.updateStatus);
router.post('/messages', DriverPortalController.sendQuickMessage);

// Added routes for Driver Dashboard Cleanup
router.get('/payroll', DriverPortalController.getPayroll);
router.get('/pickup-load', DriverPortalController.getPickupLoad);
router.get('/active-run', DriverPortalController.getActiveRun);
router.get('/jobs', DriverPortalController.getJobs);
router.get('/timesheets', DriverPortalController.getTimesheets);
router.post('/timesheets/clock', DriverPortalController.clockInOut);

module.exports = router;
