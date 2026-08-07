const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/CompanyAdminPortalController');
const { verifyToken } = require('../middlewares/auth');
const { resolveTenant } = require('../middlewares/tenantResolver');

// Apply auth & tenant resolver middleware across all Company Admin routes
router.use(verifyToken, resolveTenant);

// 1. Command Centre / Dashboard
router.get('/command-centre', ctrl.getCommandCentre);
router.get('/dashboard', ctrl.getCommandCentre);

// 2. Loads
router.get('/loads', ctrl.getLoads);
router.post('/loads', ctrl.createLoad);

// 3. Live Tracking
router.get('/live-tracking', ctrl.getLiveTracking);
router.put('/live-tracking/vehicles/:vehicleId/status', ctrl.updateVehicleStatus);
router.post('/live-tracking/vehicles/:vehicleId/telemetry', ctrl.pushTelemetry);

// 4. Drivers
router.get('/drivers', ctrl.getDrivers);
router.post('/drivers', ctrl.createDriver);

// 5. Vehicles
router.get('/vehicles', ctrl.getVehicles);
router.post('/vehicles', ctrl.createVehicle);

// 6. Branches
router.get('/branches', ctrl.getBranches);
router.post('/branches', ctrl.createBranch);

// 7. Assets
router.get('/assets', ctrl.getAssets);
router.post('/assets', ctrl.createAsset);

// 8. Warehouse
router.get('/warehouse', ctrl.getWarehouses);
router.post('/warehouse', ctrl.createWarehouse);

// 9. Pricing & Rate Matrix
router.get('/pricing', ctrl.getPricing);                                              // subscription plans (legacy)
router.get('/pricing/stats', ctrl.getPricingStats);                                   // KPI stats
router.get('/pricing/lanes', ctrl.getLanePricing);                                    // list lane rules
router.post('/pricing/lanes', ctrl.createLanePricing);                                // add lane rule
router.put('/pricing/lanes/:id', ctrl.updateLanePricing);                             // edit lane rule
router.delete('/pricing/lanes/:id', ctrl.deleteLanePricing);                          // remove lane rule
router.post('/pricing/lanes/:id/duplicate', ctrl.duplicateLanePricing);              // clone lane rule
router.get('/pricing/vehicle-rates', ctrl.getVehicleRates);                           // list vehicle rates
router.post('/pricing/vehicle-rates', ctrl.createVehicleRate);                        // add vehicle rate
router.put('/pricing/vehicle-rates/:id', ctrl.updateVehicleRate);                     // edit vehicle rate
router.get('/pricing/fuel-surcharge', ctrl.getFuelSurcharge);                         // fuel surcharge data
router.post('/pricing/fuel-surcharge', ctrl.updateFuelSurcharge);                     // update fuel surcharge
router.get('/pricing/customer-rates', ctrl.getCustomerRates);                         // customer rate cards

// 10. Payroll — Full CRUD
router.get('/payroll', ctrl.getPayroll);                                               // stats + payroll runs + timesheets
router.post('/payroll/runs', ctrl.createPayrollRun);                                   // create new payroll run
router.put('/payroll/runs/:id/status', ctrl.updatePayrollRunStatus);                   // update run status
router.get('/payroll/driver-pay', ctrl.getDriverPayBreakdown);                         // per-driver pay breakdown
router.get('/payroll/timesheets', ctrl.getTimesheetsSummary);                          // timesheet summary
router.get('/payroll/export', ctrl.exportPayroll);                                     // CSV export data

// 11. Finance — Full CRUD
router.get('/finance', ctrl.getFinance);
router.post('/finance/invoices', ctrl.createInvoice);
router.put('/finance/invoices/:id/status', ctrl.updateInvoiceStatus);
router.delete('/finance/invoices/:id', ctrl.deleteInvoice);
router.get('/finance/export', ctrl.exportFinance);

// 12. Documents — Full Vault CRUD
router.get('/documents', ctrl.getDocuments);                                           // list all documents
router.get('/documents/stats', ctrl.getDocumentStats);                                 // category KPI counts
router.post('/documents', ctrl.createDocument);                                        // upload / create document
router.delete('/documents/:id', ctrl.deleteDocument);                                  // delete from vault

// 13. Reports & Analytics
router.get('/reports', ctrl.getReports);

// 14. Messages
router.get('/messages', ctrl.getMessages);
router.post('/messages/send', ctrl.sendMessage);
router.post('/messages/broadcasts', ctrl.createBroadcast);
router.post('/messages/communications', ctrl.createCustomerCommunication);

// 15. Support & Knowledge Base
router.get('/support-tickets', ctrl.getSupportAndKb);
router.get('/knowledge-base', ctrl.getSupportAndKb);

// 16. Roles & Permissions
router.get('/roles-permissions', ctrl.getRolesAndPermissions);

// 17. Settings
router.get('/settings', ctrl.getSettings);
router.put('/settings', ctrl.updateSettings);
router.put('/security-settings', ctrl.updateSecuritySettings);
router.get('/audit-logs', ctrl.getAuditLogs);
router.delete('/audit-logs/:id', ctrl.deleteAuditLog);

// 18. Safety Checklists
router.get('/safety-checklists', ctrl.getSafetyChecklists);
router.post('/safety-checklists', ctrl.createSafetyChecklist);
router.put('/safety-checklists/:id', ctrl.updateSafetyChecklist);
router.delete('/safety-checklists/:id', ctrl.deleteSafetyChecklist);

// 19. Delivery Issues
router.get('/delivery-issues', ctrl.getDeliveryIssues);
router.put('/delivery-issues/:id/status', ctrl.updateDeliveryIssueStatus);

// 20. Customers
router.get('/customers', ctrl.getCustomers);

// 21. Subscription & Billing
router.get('/subscription-billing', ctrl.getSubscriptionBilling);
router.get('/subscription-billing/plans', ctrl.getAvailableSubscriptionPlans);
router.get('/subscription-billing/invoices', ctrl.getSubscriptionInvoices);
router.put('/subscription-billing/plan', ctrl.updateSubscriptionPlan);

module.exports = router;
