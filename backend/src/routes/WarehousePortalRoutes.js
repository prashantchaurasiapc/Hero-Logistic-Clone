const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/WarehousePortalController');
const { verifyToken } = require('../middlewares/auth');
const { resolveTenant } = require('../middlewares/tenantResolver');

// Apply auth & tenant resolver middleware across all Warehouse Portal routes
router.use(verifyToken, resolveTenant);

// 1. Warehouse Overview & Dashboard
router.get('/overview', ctrl.getDashboard);
router.get('/dashboard', ctrl.getDashboard);
router.get('/notifications', ctrl.getNotifications);

// 2. Find Stock / Stock Inventory
router.get('/stock', ctrl.getStock);
router.get('/stock/:id', ctrl.getStockById);
router.post('/stock/move', ctrl.moveStock);

// 3. Receive (Inbound)
router.get('/inbound/receipts', ctrl.getInboundReceipts);
router.post('/inbound/receive', ctrl.createInboundReceipt);
router.post('/inbound', ctrl.createInboundReceipt);

// 4. Load Lanes (Staging 1-8)
router.get('/load-lanes', ctrl.getLoadLanes);
router.post('/load-lanes/:laneId/stage-items', ctrl.stageItemsToLane);

// 5. Dispatch Ready & Outbound
router.get('/dispatch-ready', ctrl.getDispatchReady);
router.post('/dispatch-ready/:loadId/dispatch', ctrl.dispatchLoad);

// 6. Holding Areas (SA-01 to SA-12)
router.get('/holding-areas', ctrl.getHoldingAreas);
router.get('/staging', ctrl.getHoldingAreas);

// 7. Movement History & Audit Logs
router.get('/movements', ctrl.getMovements);
router.get('/movement-history', ctrl.getMovements);

// 8. Warehouse & Yard Interactive Map
router.get('/map', ctrl.getYardMap);
router.get('/yard-map', ctrl.getYardMap);

// 9. Reports & Analytics
router.get('/reports/overview', ctrl.getReportsOverview);
router.get('/reports', ctrl.getReportsOverview);

// 10. Labels, Tools & Spooler
router.get('/labels', ctrl.getLabels);
router.post('/labels/print', ctrl.printLabel);
router.post('/tools/barcode-scan', ctrl.scanBarcode);
router.get('/tools/spooler-queue', ctrl.getSpoolerQueue);

// 11. Safety Checklist & Pre-Start
router.get('/safety-checklists', ctrl.getSafetyChecklists);
router.post('/safety-checklists', ctrl.submitSafetyChecklist);

// 12. Staff Profile
router.get('/profile', ctrl.getStaffProfile);

// 13. Shift / Time Clock (Phase C) — Yard Attendant Clock In / Out
router.get('/shift/current', ctrl.getCurrentShift);
router.post('/shift/clock-in', ctrl.clockInShift);
router.post('/shift/clock-out', ctrl.clockOutShift);
router.get('/shift/history', ctrl.getShiftHistory);

// 14. Task Management (Phase D) — Yard Attendant Task Queue & Status
router.get('/tasks', ctrl.getTasks);
router.get('/tasks/:taskId', ctrl.getTaskById);
router.patch('/tasks/:taskId/status', ctrl.updateTaskStatus);
router.put('/tasks/:taskId/status', ctrl.updateTaskStatus);
router.post('/tasks/:taskId/complete', ctrl.completeTask);

// 15. Issue Reporting
router.get('/issues', ctrl.getReportedIssues);
router.post('/issues', ctrl.reportIssue);
router.post('/report-issue', ctrl.reportIssue);
router.delete('/issues/:id', ctrl.resolveReportedIssue);

module.exports = router;
