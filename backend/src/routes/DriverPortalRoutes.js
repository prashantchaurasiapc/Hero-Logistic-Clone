const express = require('express');
const router = express.Router();
const DriverPortalController = require('../controllers/DriverPortalController');
const { verifyToken } = require('../middlewares/auth');
const { resolveTenant } = require('../middlewares/tenantResolver');

router.use(verifyToken, resolveTenant);

router.get('/dashboard', DriverPortalController.getDashboard);
router.post('/status', DriverPortalController.updateStatus);
router.post('/messages', DriverPortalController.sendQuickMessage);

// Added routes for Driver Dashboard Pickup & Loading API
router.get('/payroll', DriverPortalController.getPayroll);
router.get('/pickup-load', DriverPortalController.getPickupLoad);
router.post('/pickup-load/item-status', DriverPortalController.updatePickupItemStatus);
router.post('/pickup-load/add-item', DriverPortalController.addPickupItem);
router.put('/pickup-load/item/:id', DriverPortalController.updatePickupItem);
router.delete('/pickup-load/item/:id', DriverPortalController.deletePickupItem);
router.post('/pickup-load/scan-vin', DriverPortalController.scanVinCode);
router.post('/pickup-load/confirm-pickup', DriverPortalController.confirmPickupLoad);

// Added routes for Driver Dashboard Delivery & POD API
router.get('/delivery-pod', DriverPortalController.getDeliveryPOD);
router.post('/delivery-pod/item-status', DriverPortalController.updateDeliveryItemStatus);
router.post('/delivery-pod/scan-vin', DriverPortalController.scanDeliveryVinCode);
router.post('/delivery-pod/confirm-delivery', DriverPortalController.confirmDeliveryPOD);

router.get('/active-run', DriverPortalController.getActiveRun);
router.get('/jobs', DriverPortalController.getJobs);
router.get('/timesheets', DriverPortalController.getTimesheets);
router.post('/timesheets/clock', DriverPortalController.clockInOut);

module.exports = router;
