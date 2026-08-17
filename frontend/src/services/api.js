import axios from 'axios';

const api = axios.create({
  // In development, this points to the backend running on localhost:5000
  // In production, it would be the real API URL
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  withCredentials: true, // Crucial for sending HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getSuperAdminDashboard = () => {
  return api.get('/super-admin/dashboard');
};

// Sales / CRM APIs
export const getSalesDashboardSummary = (params) => api.get('/sales-dashboard/summary', { params });
export const getLeads = (params) => api.get('/leads', { params });
export const getLead = (id) => api.get(`/leads/${id}`);
export const createLead = (data) => api.post('/leads', data);
export const updateLead = (id, data) => api.put(`/leads/${id}`, data);
export const updateLeadStage = (id, data) => api.put(`/leads/${id}/stage`, data);
export const assignLeadRep = (id, data) => api.put(`/leads/${id}/assign-rep`, data);
export const deleteLead = (id) => api.delete(`/leads/${id}`);
export const getSalesReps = () => api.get('/users?role=SALES');
export const getDemoBookings = (params) => api.get('/demo-bookings', { params });
export const getDemos = (params) => api.get('/demo-bookings', { params });
export const createDemoBooking = (data) => api.post('/demo-bookings', data);
export const updateDemoBooking = (id, data) => api.put(`/demo-bookings/${id}`, data);
export const getProposals = (params) => api.get('/proposals', { params });
export const createProposal = (data) => api.post('/proposals', data);
export const updateProposal = (id, data) => api.put(`/proposals/${id}`, data);
export const getFollowUpTasks = (params) => api.get('/follow-up-tasks', { params });
export const createFollowUpTask = (data) => api.post('/follow-up-tasks', data);
export const updateFollowUpTask = (id, data) => api.put(`/follow-up-tasks/${id}`, data);
export const getOnboardingHandovers = (params) => api.get('/onboarding-handovers', { params });
export const createOnboardingHandover = (data) => api.post('/onboarding-handovers', data);
export const submitHandoverToProvisioning = (id) => api.post(`/onboarding-handovers/${id}/provision`);
export const createSalesActivity = (data) => api.post('/sales-activitys', data);
export const convertLeadToCompany = (id, data) => api.post(`/leads/${id}/convert-to-company`, data);

// Dispatcher APIs
export const getLoads = () => api.get('/loads');
export const createLoad = (data) => api.post('/loads', data);
export const updateLoad = (id, data) => api.put(`/loads/${id}`, data);
export const deleteLoad = (id) => api.delete(`/loads/${id}`);
export const getDrivers = () => api.get('/drivers');
export const getVehicles = () => api.get('/vehicles');
export const getCustomersList = () => api.get('/customers');
export const createCustomer = (data) => api.post('/customers', data);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);

// Warehouse Portal & Yard Attendant APIs
export const getWarehouseSafetyChecklists = () => api.get('/warehouse-portal/safety-checklists');
export const submitWarehouseSafetyChecklist = (payload) => api.post('/warehouse-portal/safety-checklists', payload);
export const getWarehouseStaffProfile = () => api.get('/warehouse-portal/profile');
export const getWarehouseStock = (params) => api.get('/warehouse-portal/stock', { params });

// Warehouse Portal — Shift / Time Clock (Phase C)
export const getCurrentWarehouseShift = () => api.get('/warehouse-portal/shift/current');
export const clockInWarehouseShift = (payload = {}) => api.post('/warehouse-portal/shift/clock-in', payload);
export const clockOutWarehouseShift = (payload = {}) => api.post('/warehouse-portal/shift/clock-out', payload);
export const getWarehouseShiftHistory = (params) => api.get('/warehouse-portal/shift/history', { params });

// Warehouse Portal — Task Management (Phase D)
export const getWarehouseTasks = (params) => api.get('/warehouse-portal/tasks', { params });
export const getWarehouseTaskById = (taskId) => api.get(`/warehouse-portal/tasks/${taskId}`);
export const updateWarehouseTaskStatus = (taskId, payload) => api.patch(`/warehouse-portal/tasks/${taskId}/status`, payload);
export const completeWarehouseTask = (taskId, payload = {}) => api.post(`/warehouse-portal/tasks/${taskId}/complete`, payload);


// Request Interceptor to add access token header dynamically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for handling 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const originalRequest = error.config;
      // Skip interceptor loop for auth check and logout endpoints
      if (originalRequest.url && (originalRequest.url.includes('/auth/me') || originalRequest.url.includes('/auth/logout') || originalRequest.url.includes('/auth/login'))) {
        return Promise.reject(error);
      }
      
      // If we get a 401 on a normal request, it means the token is invalid or expired
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
