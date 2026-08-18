const express = require('express');
const router = express.Router();
const DriverPortalController = require('../controllers/DriverPortalController');
const { verifyToken } = require('../middlewares/auth');
const { resolveTenant } = require('../middlewares/tenantResolver');

router.use(verifyToken, resolveTenant);

router.get('/dashboard', DriverPortalController.getDashboard);
router.post('/status', DriverPortalController.updateStatus);

router.get('/notifications', DriverPortalController.getNotifications);
router.patch('/notifications/read-all', DriverPortalController.markAllNotificationsRead);
router.patch('/notifications/:id/read', DriverPortalController.markNotificationRead);

router.get('/messages', DriverPortalController.getDriverMessages);
router.post('/messages', DriverPortalController.sendDriverMessage);
router.post('/messages/mark-all-read', DriverPortalController.markAllMessagesRead);
router.post('/quick-message', DriverPortalController.sendQuickMessage);

router.get('/checklist-context', DriverPortalController.getChecklistContext);
router.post('/checklists', DriverPortalController.submitChecklist);

router.get('/jobs', DriverPortalController.getJobs);
router.post('/jobs', DriverPortalController.createJobRequest);

router.get('/pickup-load', DriverPortalController.getPickupLoad);
router.post('/pickup-load/item-status', DriverPortalController.updatePickupItemStatus);
router.post('/pickup-load/add-item', DriverPortalController.addPickupItem);

router.get('/active-run', DriverPortalController.getActiveRun);

router.get('/delivery-pod', DriverPortalController.getDeliveryPOD);
router.post('/delivery-pod/item-status', DriverPortalController.updateDeliveryItemStatus);

router.get('/expenses', DriverPortalController.getExpenses);
router.post('/expenses', DriverPortalController.addExpense);

router.get('/documents', DriverPortalController.getDriverDocuments);
router.post('/documents', DriverPortalController.uploadDriverDocument);

router.get('/timesheets', DriverPortalController.getTimesheets);
router.post('/timesheets/clock-in', DriverPortalController.clockIn);
router.post('/timesheets/break', DriverPortalController.toggleBreak);
router.post('/timesheets/clock-out', DriverPortalController.clockOut);
router.post('/timesheets/note', DriverPortalController.addTimesheetNote);
router.post('/timesheets/submit', DriverPortalController.submitTimesheet);

router.get('/payroll', DriverPortalController.getPayrollData);
router.post('/payroll/bank-details', DriverPortalController.updateBankDetails);
router.post('/payroll/settings', DriverPortalController.updatePaymentSettings);

router.get('/trailer-swap', DriverPortalController.getTrailerSwapData);
router.post('/trailer-swap', DriverPortalController.confirmTrailerSwap);

router.get('/offline-sync', DriverPortalController.getOfflineSyncData);
router.post('/offline-sync/sync-all', DriverPortalController.syncAllQueue);
router.post('/offline-sync/retry-failed', DriverPortalController.retryFailedSync);
router.post('/offline-sync/settings', DriverPortalController.updateSyncSettings);
router.post('/offline-sync/clear-cache', DriverPortalController.clearStorageCache);

module.exports = router;
