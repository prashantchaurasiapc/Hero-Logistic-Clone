/**
 * Driver Portal API Service — Phase 1
 *
 * Reuses the existing axios instance from api.js (base URL, interceptors, auth headers).
 * Only implements what is needed for Phase 1: getMyProfile().
 * Future phases will add more functions here.
 */
import api from './api';

/**
 * GET /driver-portal/me
 * Returns the authenticated driver's profile, assigned vehicle(s), and active loads.
 * The backend identifies the driver from the JWT — no driverId is sent.
 */
export const getMyProfile = () => api.get('/driver-portal/me');

/**
 * GET /driver-portal/me/loads
 * Returns all loads assigned to the authenticated driver.
 */
export const getMyLoads = () => api.get('/driver-portal/me/loads');

/**
 * GET /driver-portal/loads/:id
 * Returns details for a single load assigned to the authenticated driver.
 */
export const getLoadDetails = (id) => api.get(`/driver-portal/loads/${id}`);

export const updateLoadStatus = (id, status, note) => api.post(`/driver-portal/loads/${id}/status-transition`, { status, note });

/**
 * GET /driver-portal/loads/:id/pickup-items
 * Returns pickup items and progress for a single load assigned to the authenticated driver.
 */
export const getPickupItems = (id) => api.get(`/driver-portal/loads/${id}/pickup-items`);

/**
 * POST /driver-portal/loads/:id/pickup-item
 * Marks an assigned load item as picked up by VIN or Item ID.
 */
export const pickupItem = (id, payload) => api.post(`/driver-portal/loads/${id}/pickup-item`, typeof payload === 'string' ? { vin: payload } : payload);

/**
 * GET /driver-portal/loads/:id/delivery-items
 * Returns delivery items, stops and POD summary for a single load assigned to the authenticated driver.
 */
export const getDeliveryItems = (id) => api.get(`/driver-portal/loads/${id}/delivery-items`);

/**
 * POST /driver-portal/loads/:id/delivery-pod
 * Submits Proof of Delivery (POD) signature, photos, and marks items as delivered.
 */
export const submitDeliveryPOD = (id, payload) => api.post(`/driver-portal/loads/${id}/delivery-pod`, payload);

/**
 * GET /driver-portal/timesheet/today
 * Returns current clock-in/out status and active timesheet for the authenticated driver.
 */
export const getTodayTimesheet = () => api.get('/driver-portal/timesheet/today');

/**
 * POST /driver-portal/timesheet/clock-in
 * Clocks in the authenticated driver.
 */
export const clockIn = (payload = {}) => api.post('/driver-portal/timesheet/clock-in', payload);

/**
 * POST /driver-portal/timesheet/clock-out
 * Clocks out the authenticated driver.
 */
export const clockOut = (payload = {}) => api.post('/driver-portal/timesheet/clock-out', payload);

/**
 * POST /driver-portal/timesheet/clock-in (Alias: createTimesheet)
 */
export const createTimesheet = (payload = {}) => api.post('/driver-portal/timesheet/clock-in', payload);

/**
 * POST /driver-portal/timesheet/break
 */
export const toggleBreak = (payload = {}) => api.post('/driver-portal/timesheet/break', payload);

/**
 * POST /driver-portal/timesheet/note
 */
export const addTimesheetNote = (payload = {}) => api.post('/driver-portal/timesheet/note', payload);

/**
 * POST /driver-portal/timesheet/submit
 */
export const submitTimesheet = (payload = {}) => api.post('/driver-portal/timesheet/submit', payload);

/**
 * GET /driver-portal/expenses
 * Returns all expenses for loads assigned to the authenticated driver.
 */
export const getMyExpenses = () => api.get('/driver-portal/expenses');

/**
 * POST /driver-portal/expenses
 * Submits a new expense (Fuel, Toll, etc.) for a load assigned to the authenticated driver.
 */
export const createExpense = (payload) => api.post('/driver-portal/expenses', payload);

/**
 * GET /driver-portal/expenses/:id
 * Returns details for a single expense belonging to the authenticated driver.
 */
export const getExpenseDetails = (id) => api.get(`/driver-portal/expenses/${id}`);

/**
 * GET /driver-portal/trailer-swap
 * GET /driver-portal/trailer-swap/:loadId
 * Returns current assigned trailer, available company trailers, and recent swap history.
 */
export const getTrailerSwapContext = (loadId) => loadId ? api.get(`/driver-portal/trailer-swap/${loadId}`) : api.get('/driver-portal/trailer-swap');

/**
 * POST /driver-portal/trailer-swap
 * POST /driver-portal/trailer-swap/:loadId
 * Executes a trailer swap for the authenticated driver.
 */
export const swapTrailer = (loadId, payload) => {
  if (typeof loadId === 'object' && !payload) {
    payload = loadId;
    loadId = null;
  }
  return loadId ? api.post(`/driver-portal/trailer-swap/${loadId}`, payload) : api.post('/driver-portal/trailer-swap', payload);
};

/**
 * GET /driver-portal/messages
 * Returns all messages/conversations for the authenticated driver.
 */
export const getMessages = () => api.get('/driver-portal/messages');

/**
 * GET /driver-portal/messages/:id
 * Returns details for a single message/thread.
 */
export const getMessageDetails = (id) => api.get(`/driver-portal/messages/${id}`);

/**
 * POST /driver-portal/messages
 * Sends a message from the authenticated driver.
 */
export const sendMessage = (payload) => api.post('/driver-portal/messages', payload);

/**
 * POST /driver-portal/messages/:id/read
 * Marks a message as read.
 */
export const markMessageAsRead = (id) => api.post(`/driver-portal/messages/${id}/read`);

/**
 * POST /driver-portal/messages/read-all
 * Marks all unread messages as read.
 */
export const markAllMessagesAsRead = () => api.post('/driver-portal/messages/read-all');

/**
 * GET /driver-portal/messages/unread-count
 * Returns total unread messages count.
 */
export const getUnreadMessageCount = () => api.get('/driver-portal/messages/unread-count');

/**
 * GET /driver-portal/incidents
 * Returns all incident and SOS reports for the authenticated driver.
 */
export const getMyIncidents = () => api.get('/driver-portal/incidents');

/**
 * GET /driver-portal/incidents/:id
 * Returns details for a single incident report.
 */
export const getIncidentDetails = (id) => api.get(`/driver-portal/incidents/${id}`);

/**
 * POST /driver-portal/incidents
 * Submits a new incident report.
 */
export const createIncidentReport = (payload) => api.post('/driver-portal/incidents', payload);

/**
 * POST /driver-portal/incidents/sos
 * Sends an emergency SOS panic alert with GPS location.
 */
export const sendEmergencySOS = (payload = {}) => api.post('/driver-portal/incidents/sos', payload);

/**
 * GET /driver-portal/checklist/today
 * Returns today's pre-start safety checklist for the authenticated driver.
 */
export const getTodayChecklist = () => api.get('/driver-portal/checklist/today');

/**
 * GET /driver-portal/checklist/:id
 * Returns details for a specific pre-start safety checklist.
 */
export const getChecklistDetails = (id) => api.get(`/driver-portal/checklist/${id}`);

/**
 * POST /driver-portal/checklist
 * Submits or saves today's pre-start safety checklist.
 */
export const submitChecklist = (payload) => api.post('/driver-portal/checklist', payload);

/**
 * GET /driver-portal/payroll
 * Returns current/latest payroll summary for the authenticated driver.
 */
export const getPayrollSummary = () => api.get('/driver-portal/payroll');

/**
 * GET /driver-portal/payroll/history
 * Returns historical pay periods for the authenticated driver, newest first.
 */
export const getPayrollHistory = () => api.get('/driver-portal/payroll/history');

/**
 * GET /driver-portal/payroll/:id
 * Returns details for a specific pay period.
 */
export const getPayrollDetails = (id) => api.get(`/driver-portal/payroll/${id}`);

/**
 * GET /driver-portal/payroll/:id/payslip
 * Retrieves or downloads the payslip PDF for a specific pay period.
 */
export const downloadPayslip = (id) => api.get(`/driver-portal/payroll/${id}/payslip`, { responseType: 'blob' });









