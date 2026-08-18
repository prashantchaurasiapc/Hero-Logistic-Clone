const express = require('express');
const router = express.Router();
const DriverPortalController = require('../controllers/DriverPortalController');
const auth = require('../middlewares/auth');

// All driver portal routes require authentication.
// The user identity comes from the JWT, never from query params.
router.use(auth.verifyToken);

/**
 * GET /driver-portal/me
 * Returns the authenticated driver's own profile, vehicle and active loads.
 */
router.get('/me', DriverPortalController.getMyProfile);

/**
 * GET /driver-portal/me/loads
 * Returns all loads assigned to the authenticated driver.
 */
router.get('/me/loads', DriverPortalController.getMyLoads);

/**
 * GET /driver-portal/loads/:id
 * Returns details for a single load assigned to the authenticated driver.
 */
router.get('/loads/:id', DriverPortalController.getLoadDetails);

/**
 * POST /driver-portal/loads/:id/status-transition
 * Executes a load status transition for a load assigned to the authenticated driver.
 */
router.post('/loads/:id/status-transition', DriverPortalController.updateLoadStatus);

/**
 * GET /driver-portal/loads/:id/pickup-items
 * Returns pickup items and progress for a load assigned to the authenticated driver.
 */
router.get('/loads/:id/pickup-items', DriverPortalController.getPickupItems);

/**
 * POST /driver-portal/loads/:id/pickup-item
 * Marks a load item as picked up after validating driver ownership and load item VIN matching.
 */
router.post('/loads/:id/pickup-item', DriverPortalController.pickupItem);
router.post('/loads/:id/pickup-items', DriverPortalController.pickupItem);

/**
 * GET /driver-portal/loads/:id/delivery-items
 * Returns delivery items, stops and POD status for a load assigned to the authenticated driver.
 */
router.get('/loads/:id/delivery-items', DriverPortalController.getDeliveryItems);

/**
 * POST /driver-portal/loads/:id/delivery-pod
 * Submits Proof of Delivery (POD) photos, signature, and marks load items as delivered.
 */
router.post('/loads/:id/delivery-pod', DriverPortalController.submitDeliveryPOD);
router.post('/loads/:id/pod', DriverPortalController.submitDeliveryPOD);

/**
 * GET /driver-portal/timesheet/today
 * Returns today's active or recent timesheet and clock status for the authenticated driver.
 */
router.get('/timesheet/today', DriverPortalController.getTodayTimesheet);

/**
 * POST /driver-portal/timesheet/clock-in
 * Clocks in the authenticated driver and opens a new timesheet work session.
 */
router.post('/timesheet/clock-in', DriverPortalController.clockIn);

/**
 * POST /driver-portal/timesheet/clock-out
 * Clocks out the authenticated driver and closes their active work session.
 */
router.post('/timesheet/clock-out', DriverPortalController.clockOut);

/**
 * GET /driver-portal/expenses
 * Returns all expenses for loads assigned to the authenticated driver.
 */
router.get('/expenses', DriverPortalController.getMyExpenses);

/**
 * POST /driver-portal/expenses
 * Submits a new fuel, toll, or other expense for an assigned load belonging to the authenticated driver.
 */
router.post('/expenses', DriverPortalController.createExpense);

/**
 * GET /driver-portal/expenses/:id
 * Returns details for a single expense belonging to the authenticated driver.
 */
router.get('/expenses/:id', DriverPortalController.getExpenseDetails);

/**
 * GET /driver-portal/trailer-swap
 * GET /driver-portal/trailer-swap/:loadId
 * Returns current assigned trailer, available company trailers, and recent swap history.
 */
router.get('/trailer-swap', DriverPortalController.getTrailerSwapContext);
router.get('/trailer-swap/:loadId', DriverPortalController.getTrailerSwapContext);

/**
 * POST /driver-portal/trailer-swap
 * POST /driver-portal/trailer-swap/:loadId
 * Executes a trailer swap for the authenticated driver and records equipment swap history.
 */
router.post('/trailer-swap', DriverPortalController.swapTrailer);
router.post('/trailer-swap/:loadId', DriverPortalController.swapTrailer);

/**
 * GET /driver-portal/messages/unread-count
 * Returns unread message count for the authenticated driver.
 * Registered BEFORE /messages/:id to avoid route collision.
 */
router.get('/messages/unread-count', DriverPortalController.getUnreadMessageCount);

/**
 * POST /driver-portal/messages/read-all
 * Marks all received unread messages for the authenticated driver as read.
 * Registered BEFORE /messages/:id to avoid route collision.
 */
router.post('/messages/read-all', DriverPortalController.markAllMessagesAsRead);

/**
 * GET /driver-portal/messages
 * Returns all messages/conversations for the authenticated driver.
 */
router.get('/messages', DriverPortalController.getMessages);

/**
 * GET /driver-portal/messages/:id
 * Returns details for a single message/thread belonging to the authenticated driver.
 */
router.get('/messages/:id', DriverPortalController.getMessageDetails);

/**
 * POST /driver-portal/messages
 * Sends a new message from the authenticated driver.
 */
router.post('/messages', DriverPortalController.sendMessage);

/**
 * POST /driver-portal/messages/:id/read
 * Marks a specific message/thread as read for the authenticated driver.
 */
router.post('/messages/:id/read', DriverPortalController.markMessageAsRead);

/**
 * POST /driver-portal/incidents/sos
 * Sends an emergency SOS panic alert with GPS location for the authenticated driver.
 * Registered BEFORE /incidents/:id to avoid route collision.
 */
router.post('/incidents/sos', DriverPortalController.sendEmergencySOS);

/**
 * GET /driver-portal/incidents
 * Returns all incident and emergency SOS reports for the authenticated driver.
 */
router.get('/incidents', DriverPortalController.getMyIncidents);

/**
 * GET /driver-portal/incidents/:id
 * Returns details for a single incident report belonging to the authenticated driver.
 */
router.get('/incidents/:id', DriverPortalController.getIncidentDetails);

/**
 * POST /driver-portal/incidents
 * Submits a new incident report for the authenticated driver.
 */
router.post('/incidents', DriverPortalController.createIncidentReport);

/**
 * GET /driver-portal/checklist/today
 * Returns today's pre-start safety checklist for the authenticated driver.
 * Registered BEFORE /checklist/:id to avoid route collision.
 */
router.get('/checklist/today', DriverPortalController.getTodayChecklist);

/**
 * POST /driver-portal/checklist
 * Submits or saves today's pre-start safety checklist for the authenticated driver.
 */
router.post('/checklist', DriverPortalController.submitChecklist);

/**
 * GET /driver-portal/checklist/:id
 * Returns details for a specific pre-start safety checklist belonging to the authenticated driver.
 */
router.get('/checklist/:id', DriverPortalController.getChecklistDetails);

/**
 * GET /driver-portal/payroll
 * Returns current/latest payroll summary for authenticated driver.
 */
router.get('/payroll', DriverPortalController.getPayrollSummary);

/**
 * GET /driver-portal/payroll/history
 * Returns historical pay periods for authenticated driver, newest first.
 * Registered BEFORE /payroll/:id to prevent route collisions.
 */
router.get('/payroll/history', DriverPortalController.getPayrollHistory);

/**
 * GET /driver-portal/payroll/:id
 * Returns details for a specific pay period record.
 */
router.get('/payroll/:id', DriverPortalController.getPayrollDetails);

/**
 * GET /driver-portal/payroll/:id/payslip
 * Retrieves or downloads the payslip PDF for a specific pay period.
 */
router.get('/payroll/:id/payslip', DriverPortalController.downloadPayslip);

// Dashboard & direct status/messages routes
router.get('/dashboard', DriverPortalController.getDashboard);
router.post('/status', DriverPortalController.updateStatus);

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
