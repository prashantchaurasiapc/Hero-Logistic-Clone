import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Plus, ChevronDown, Package, Truck, DollarSign, Building2, MapPin,
  UserPlus, FileText, MoreVertical, ArrowUpRight,
  Download, Mail, Users, XCircle, Loader2, AlertCircle, RefreshCw
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../../services/api';

export default function CommandCentre() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDispatcher = location.pathname.startsWith('/dispatcher');
  
  // Dashboard API state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  // Modal display states
  const [showAssignDriver, setShowAssignDriver] = useState(false);
  const [showTrackLoad, setShowTrackLoad] = useState(false);
  const [showCreateCustomer, setShowCreateCustomer] = useState(false);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [showAddNewTruck, setShowAddNewTruck] = useState(false);
  const [showExportReport, setShowExportReport] = useState(false);
  const [showSendBroadcast, setShowSendBroadcast] = useState(false);
  const [showSupportTicket, setShowSupportTicket] = useState(false);

  // Form states for modals
  const [assignForm, setAssignForm] = useState({ loadId: '', driverId: '', truckId: '', trailerId: '' });
  const [trackSearch, setTrackSearch] = useState('');
  const [customerForm, setCustomerForm] = useState({ name: '', contactPerson: '', email: '', phone: '' });
  const [invoiceForm, setInvoiceForm] = useState({ selectedLoads: [] });
  const [truckForm, setTruckForm] = useState({ make: '', rego: '', vin: '', category: 'TRUCK' });
  const [ticketForm, setTicketForm] = useState({ subject: '', category: 'OPERATIONS', description: '', priority: 'MEDIUM' });
  const [broadcastForm, setBroadcastForm] = useState({ targetGroup: 'ALL_DRIVERS', message: '' });

  // Modal data fetched dynamically
  const [modalLoads, setModalLoads] = useState([]);
  const [modalDrivers, setModalDrivers] = useState([]);
  const [modalVehicles, setModalVehicles] = useState([]);
  const [submittingAction, setSubmittingAction] = useState(false);

  // Load real-time dashboard data from backend API
  const fetchDashboardMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/company-admin/command-centre');
      if (res.data && res.data.success) {
        setDashboardData(res.data.data);
      } else {
        setError('Failed to fetch dashboard metrics');
      }
    } catch (err) {
      console.error('Error fetching command centre metrics:', err);
      setError(err.response?.data?.error?.message || 'Server connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  // Fetch dropdown data when Assign Driver modal opens
  const handleOpenAssignDriverModal = async () => {
    setShowAssignDriver(true);
    try {
      const [loadsRes, driversRes, vehiclesRes] = await Promise.all([
        api.get('/loads?pageSize=20'),
        api.get('/drivers?pageSize=20'),
        api.get('/vehicles?pageSize=20')
      ]);
      setModalLoads(loadsRes.data?.data || []);
      setModalDrivers(driversRes.data?.data || []);
      setModalVehicles(vehiclesRes.data?.data || []);
    } catch (err) {
      console.error('Error fetching assign modal data:', err);
    }
  };

  // Submit Driver Assignment
  const handleConfirmAssignment = async (e) => {
    e.preventDefault();
    if (!assignForm.loadId) return alert('Please select a Target Load.');
    try {
      setSubmittingAction(true);
      await api.put(`/loads/${assignForm.loadId}`, {
        driverId: assignForm.driverId || undefined,
        truckId: assignForm.truckId || undefined,
        status: 'ASSIGNED'
      });
      alert('Driver and Fleet Vehicle assigned to load successfully!');
      setShowAssignDriver(false);
      fetchDashboardMetrics();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to assign driver to load');
    } finally {
      setSubmittingAction(false);
    }
  };

  // Submit Create Customer
  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    if (!customerForm.name) return alert('Company Name is required.');
    try {
      setSubmittingAction(true);
      await api.post('/customers', customerForm);
      alert('Customer created successfully!');
      setShowCreateCustomer(false);
      setCustomerForm({ name: '', contactPerson: '', email: '', phone: '' });
      fetchDashboardMetrics();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to create customer');
    } finally {
      setSubmittingAction(false);
    }
  };

  // Submit Save Truck
  const handleSaveTruck = async (e) => {
    e.preventDefault();
    if (!truckForm.rego) return alert('Registration plate is required.');
    try {
      setSubmittingAction(true);
      await api.post('/vehicles', truckForm);
      alert('New Vehicle added to fleet successfully!');
      setShowAddNewTruck(false);
      setTruckForm({ make: '', rego: '', vin: '', category: 'TRUCK' });
      fetchDashboardMetrics();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to create vehicle');
    } finally {
      setSubmittingAction(false);
    }
  };

  // Submit Support Ticket
  const handleSaveTicket = async (e) => {
    e.preventDefault();
    if (!ticketForm.subject) return alert('Subject is required.');
    try {
      setSubmittingAction(true);
      await api.post('/support-tickets', ticketForm);
      alert('Support ticket created successfully!');
      setShowSupportTicket(false);
      setTicketForm({ subject: '', category: 'OPERATIONS', description: '', priority: 'MEDIUM' });
      fetchDashboardMetrics();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to create support ticket');
    } finally {
      setSubmittingAction(false);
    }
  };

  // Extract metrics or fallbacks safely from real API response
  const kpis = dashboardData?.kpis || {
    totalLoads: 0,
    activeLoads: 0,
    totalDrivers: 0,
    activeFleet: 0,
    totalBranches: 0,
    totalWarehouses: 0,
    totalCustomers: 0,
    openTicketsCount: 0,
    totalRevenue: 0
  };

  const loadStatusData = dashboardData?.loadStatusData || [
    { name: 'Draft', value: 0, color: '#94A3B8' },
    { name: 'Assigned', value: 0, color: '#3B82F6' },
    { name: 'In Transit', value: 0, color: '#0EA5E9' },
    { name: 'Delivered', value: 0, color: '#10B981' },
    { name: 'Cancelled', value: 0, color: '#EF4444' }
  ];

  const recentLoads = dashboardData?.recentLoads || [];
  const driverAlerts = dashboardData?.driverAlerts || [];
  const unreadMessages = dashboardData?.unreadMessages || [];
  const pendingInvoices = dashboardData?.pendingInvoices || [];
  const truckMaintenance = dashboardData?.truckMaintenance || [];
  const recentTickets = dashboardData?.recentTickets || [];

  const totalLoadCount = loadStatusData.reduce((acc, curr) => acc + (curr.value || 0), 0) || kpis.totalLoads || 0;

  return (
    <div className="flex-grow bg-[#F8FAFC] p-6 lg:p-8 w-full text-left font-sans overflow-y-auto min-h-0">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">Command Centre</h1>
            {loading && <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />}
          </div>
          <p className="text-sm font-medium text-slate-500">Live operational oversight & fleet analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchDashboardMetrics}
            disabled={loading}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl shadow-xs transition-colors flex items-center gap-1 text-xs font-bold"
            title="Refresh Real-time Metrics">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => navigate(isDispatcher ? '/dispatcher/loads' : '/company-admin/loads', { state: { openNewLoadModal: true } })}
            className="bg-[#FFCC00] hover:bg-[#FACC15] text-black font-bold text-sm px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4 stroke-[3px]" /> New Load <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
          </button>
        </div>
      </div>

      {/* ERROR BANNER IF API FAILED */}
      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={fetchDashboardMetrics} className="underline font-black hover:text-rose-900">Retry API</button>
        </div>
      )}

      {/* KPI SUMMARY CARDS (POWERED BY REAL DB DATA) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-6">
        {/* Loads MTD */}
        <div className="bg-white rounded-2xl p-4 border border-blue-200 shadow-xs relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 uppercase tracking-wider">
              <Package className="w-3.5 h-3.5 text-blue-500" /> Loads (MTD)
            </div>
            <div className="text-[10px] font-black text-emerald-500 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> Real-time
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none mb-1">{kpis.totalLoads.toLocaleString()}</div>
          <div className="text-[9px] font-medium text-slate-400">{kpis.activeLoads} active in transit</div>
        </div>

        {/* Active Fleet */}
        <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-xs relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 uppercase tracking-wider">
              <Truck className="w-3.5 h-3.5 text-emerald-500" /> Active Fleet
            </div>
            <div className="text-[10px] font-black text-emerald-500 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> Live
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none mb-1">{kpis.activeFleet.toLocaleString()}</div>
          <div className="text-[9px] font-medium text-slate-400">Total operational vehicles</div>
        </div>

        {/* Monthly Revenue or Active Drivers */}
        {!isDispatcher ? (
          <div className="bg-white rounded-2xl p-4 border border-purple-200 shadow-xs relative overflow-hidden group">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 uppercase tracking-wider">
                <DollarSign className="w-3.5 h-3.5 text-purple-500" /> Pending Rev.
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 leading-none mb-1">
              ${(kpis.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[9px] font-medium text-slate-400">Total customer invoices</div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-4 border border-purple-200 shadow-xs relative overflow-hidden group">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 text-purple-500" /> Active Drivers
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 leading-none mb-1">{kpis.totalDrivers} Drivers</div>
            <div className="text-[9px] font-medium text-slate-400">Registered company drivers</div>
          </div>
        )}

        {/* Branches */}
        <div className="bg-white rounded-2xl p-4 border border-orange-200 shadow-xs relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-orange-500" /> Branches
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none mb-1">{kpis.totalBranches}</div>
          <div className="text-[9px] font-medium text-slate-400">Operational depots</div>
        </div>

        {/* Warehouses */}
        <div className="bg-white rounded-2xl p-4 border border-teal-200 shadow-xs relative overflow-hidden group">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-teal-500" /> Warehouses
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none mb-1">{kpis.totalWarehouses}</div>
          <div className="text-[9px] font-medium text-slate-400">Storage & staging facilities</div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white border border-emerald-300 rounded-2xl p-4 sm:p-5 shadow-xs mb-6">
        <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:divide-x divide-slate-100">
          
          <button 
            onClick={() => navigate(isDispatcher ? '/dispatcher/loads' : '/company-admin/loads', { state: { openNewLoadModal: true } })}
            className="flex items-start gap-3 pl-0 pr-2 group text-left cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
              <Plus className="w-4 h-4 stroke-[3px]" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-900 leading-none mb-1">New Load</div>
              <div className="text-[10px] font-medium text-slate-400">Create a new load</div>
            </div>
          </button>

          <button 
            onClick={handleOpenAssignDriverModal}
            className="flex items-start gap-3 pl-4 pr-2 group text-left cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-100 transition-colors">
              <UserPlus className="w-4 h-4 stroke-[2.5px]" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-900 leading-none mb-1">Assign Driver</div>
              <div className="text-[10px] font-medium text-slate-400">Assign to load</div>
            </div>
          </button>

          <button 
            onClick={() => setShowTrackLoad(true)}
            className="flex items-start gap-3 pl-4 pr-2 group text-left cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
              <MapPin className="w-4 h-4 stroke-[2.5px]" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-900 leading-none mb-1">Track Load</div>
              <div className="text-[10px] font-medium text-slate-400">Live tracking</div>
            </div>
          </button>

          <button 
            onClick={() => setShowCreateCustomer(true)}
            className="flex items-start gap-3 pl-4 pr-2 group text-left cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:bg-orange-100 transition-colors">
              <Building2 className="w-4 h-4 stroke-[2.5px]" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-900 leading-none mb-1">Create Customer</div>
              <div className="text-[10px] font-medium text-slate-400">Add new customer</div>
            </div>
          </button>

          {!isDispatcher ? (
            <button 
              onClick={() => setShowCreateInvoice(true)}
              className="flex items-start gap-3 pl-4 pr-2 group text-left cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                <FileText className="w-4 h-4 stroke-[2.5px]" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-slate-900 leading-none mb-1">Create Invoice</div>
                <div className="text-[10px] font-medium text-slate-400">Generate invoice</div>
              </div>
            </button>
          ) : (
            <button 
              onClick={() => navigate('/dispatcher/drivers')}
              className="flex items-start gap-3 pl-4 pr-2 group text-left cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                <Users className="w-4 h-4 stroke-[2.5px]" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-slate-900 leading-none mb-1">Driver Roster</div>
                <div className="text-[10px] font-medium text-slate-400">Manage drivers</div>
              </div>
            </button>
          )}

          <div className="relative pl-4 pr-0">
            <button 
              onClick={() => setShowMoreActions(!showMoreActions)}
              className="flex items-start gap-3 group text-left w-full cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 group-hover:bg-slate-100 transition-colors">
                <MoreVertical className="w-4 h-4 stroke-[2.5px]" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-slate-900 leading-none mb-1">More Actions</div>
                <div className="text-[10px] font-medium text-slate-400">View all actions</div>
              </div>
            </button>

            {showMoreActions && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMoreActions(false)} />
                <div className="absolute left-4 top-full mt-2 w-[180px] bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50 py-1.5">
                  <button 
                    onClick={() => { setShowMoreActions(false); setShowAddNewTruck(true); }} 
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors text-left cursor-pointer">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-600">Add New Truck</span>
                  </button>
                  <button 
                    onClick={() => { setShowMoreActions(false); setShowExportReport(true); }} 
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors text-left cursor-pointer">
                    <Download className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-600">Export Report</span>
                  </button>
                  <button 
                    onClick={() => { setShowMoreActions(false); setShowSendBroadcast(true); }} 
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors text-left cursor-pointer">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-600">Send Broadcast</span>
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </div>

      {/* MAIN REAL-TIME DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMN 1 */}
        <div className="space-y-6">
          
          {/* Load Status (MTD) Chart */}
          <div className="bg-white border border-blue-300 rounded-2xl p-5 shadow-xs">
            <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-4">Load Status (MTD)</h3>
            <div className="flex items-center">
              <div className="w-32 h-32 shrink-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={loadStatusData}
                      innerRadius={45}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {loadStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || '#3B82F6'} />
                      ))}
                    </Pie>
                    <Tooltip cursor={false} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm font-black text-slate-900">{totalLoadCount.toLocaleString()}</span>
                  <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider">Total Loads</span>
                </div>
              </div>
              <div className="flex-grow pl-4 space-y-2">
                {loadStatusData.map((status, i) => {
                  const percentage = totalLoadCount > 0 ? Math.round((status.value / totalLoadCount) * 100) : 0;
                  return (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color || '#3B82F6' }}></span>
                        <span className="font-semibold text-slate-600">{status.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{(status.value || 0).toLocaleString()}</span>
                        <span className="font-medium text-slate-400 text-[10px]">({percentage}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Unread Messages */}
          <div className="bg-white border border-purple-300 rounded-2xl p-5 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Unread Messages & Driver Alerts</h3>
              <button onClick={() => navigate('/company-admin/messages')} className="text-[10px] font-bold text-blue-600 hover:underline">View all</button>
            </div>
            <div className="space-y-4">
              {unreadMessages.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs font-medium">No unread messages</div>
              ) : (
                unreadMessages.map((msg, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="relative shrink-0">
                      {msg.avatar ? (
                        <img src={msg.avatar} alt={msg.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
                          <Truck className="w-5 h-5 text-white" />
                        </div>
                      )}
                      {msg.count > 0 && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-rose-500 border-2 border-white text-[8px] font-bold text-white flex items-center justify-center">
                          {msg.count}
                        </span>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className="text-xs font-bold text-slate-900 truncate pr-2">{msg.name}</span>
                        <span className="text-[9px] font-medium text-slate-400 shrink-0">{msg.time}</span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-500 truncate leading-snug">{msg.msg}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Support Tickets Overview */}
          <div className="bg-white border border-amber-300 rounded-2xl p-5 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Support Tickets Overview</h3>
              <button onClick={() => navigate('/company-admin/knowledge-base')} className="text-[10px] font-bold text-blue-600 hover:underline">View all</button>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="border border-blue-200 bg-blue-50/50 rounded-xl py-3 px-1">
                <div className="text-xl font-black text-blue-600 mb-0.5">{dashboardData?.ticketStats?.open || 0}</div>
                <div className="text-[9px] font-bold text-slate-600 uppercase">Open</div>
              </div>
              <div className="border border-amber-200 bg-amber-50/50 rounded-xl py-3 px-1">
                <div className="text-xl font-black text-amber-500 mb-0.5">{dashboardData?.ticketStats?.inProgress || 0}</div>
                <div className="text-[9px] font-bold text-slate-600 uppercase">In Progress</div>
              </div>
              <div className="border border-purple-200 bg-purple-50/50 rounded-xl py-3 px-1">
                <div className="text-xl font-black text-purple-600 mb-0.5">{dashboardData?.ticketStats?.waiting || 0}</div>
                <div className="text-[9px] font-bold text-slate-600 uppercase">Waiting</div>
              </div>
              <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl py-3 px-1">
                <div className="text-xl font-black text-emerald-500 mb-0.5">{dashboardData?.ticketStats?.resolved || 0}</div>
                <div className="text-[9px] font-bold text-slate-600 uppercase">Resolved</div>
              </div>
            </div>
          </div>

        </div>

        {/* COLUMN 2 */}
        <div className="space-y-6">
          
          {/* Recent Loads Table */}
          <div className="bg-white border border-blue-300 rounded-2xl p-5 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Recent Freight Loads</h3>
              <button onClick={() => navigate('/company-admin/loads')} className="text-[10px] font-bold text-blue-600 hover:underline">View all</button>
            </div>
            
            <table className="w-full text-left">
              <thead>
                <tr className="text-[8px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="pb-3 font-medium">Load ID</th>
                  <th className="pb-3 font-medium">Route</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Driver</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentLoads.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400 text-xs font-medium">No recent loads in database</td>
                  </tr>
                ) : (
                  recentLoads.map((load, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 text-[10px] font-bold text-slate-500">{load.id}</td>
                      <td className="py-3 text-[11px] font-extrabold text-slate-800">{load.route}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${load.statusColor}`}>
                          {load.status}
                        </span>
                      </td>
                      <td className="py-3 text-[10px] font-bold text-slate-700 text-right">{load.driver}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pending Invoices */}
          {!isDispatcher ? (
            <div className="bg-white border border-emerald-300 rounded-2xl p-5 shadow-xs">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-1">Pending Customer Invoices</h3>
                  <div className="text-2xl font-black text-slate-900 leading-none">
                    ${(kpis.totalRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Total Outstanding</div>
                </div>
                <button onClick={() => navigate('/company-admin/finance')} className="text-[10px] font-bold text-blue-600 hover:underline">View all</button>
              </div>
              
              <div className="space-y-0 divide-y divide-slate-100">
                {pendingInvoices.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-xs font-medium">No pending invoices</div>
                ) : (
                  pendingInvoices.map((inv, i) => (
                    <div key={i} className="py-3 flex justify-between items-center group cursor-pointer hover:bg-slate-50 px-2 -mx-2 rounded-lg transition-colors">
                      <div className="flex gap-4 items-center">
                        <span className="text-[10px] font-bold text-slate-400">{inv.id}</span>
                        <span className="text-xs font-extrabold text-slate-800">{inv.client}</span>
                      </div>
                      <div className="flex gap-4 items-center">
                        <span className="text-xs font-black text-slate-900">{inv.amount}</span>
                        <span className={`text-[9px] font-bold uppercase ${inv.due.includes('Overdue') ? 'text-rose-500' : 'text-slate-400'}`}>
                          {inv.due}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-emerald-300 rounded-2xl p-5 shadow-xs">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-1">Active Driver Duty & Roster</h3>
                  <div className="text-2xl font-black text-slate-900 leading-none">{kpis.totalDrivers} Active Drivers</div>
                </div>
                <button onClick={() => navigate('/dispatcher/drivers')} className="text-[10px] font-bold text-blue-600 hover:underline">View Roster</button>
              </div>
            </div>
          )}

          {/* Recent Tickets Table */}
          <div className="bg-white border border-indigo-300 rounded-2xl p-5 shadow-xs">
            <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-4">Recent Support Tickets</h3>
            
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-50">
                {recentTickets.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400 text-xs font-medium">No open tickets</td>
                  </tr>
                ) : (
                  recentTickets.map((ticket, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 text-[10px] font-bold text-slate-400">{ticket.id}</td>
                      <td className="py-3 text-[11px] font-extrabold text-slate-800">{ticket.title}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${ticket.statusColor}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="py-3 text-[10px] font-medium text-slate-400 text-right">{ticket.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* COLUMN 3 */}
        <div className="space-y-6">
          
          {/* Driver Compliance & License Alerts */}
          <div className="bg-white border border-orange-300 rounded-2xl p-5 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Driver Compliance & Alerts</h3>
              <button onClick={() => navigate('/company-admin/drivers')} className="text-[10px] font-bold text-blue-600 hover:underline">View all</button>
            </div>
            
            <div className="space-y-4">
              {driverAlerts.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs font-medium">No compliance warnings</div>
              ) : (
                driverAlerts.map((alert, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img src={alert.avatar || 'https://i.pravatar.cc/150'} alt={alert.name} className="w-8 h-8 rounded-full border border-slate-200" />
                      <div>
                        <div className="text-[11px] font-extrabold text-slate-900 leading-tight mb-0.5">{alert.name}</div>
                        <div className="text-[10px] font-medium text-slate-500">{alert.issue}</div>
                      </div>
                    </div>
                    <span className="text-[9px] font-medium text-slate-400">{alert.date}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Truck Maintenance Due */}
          <div className="bg-white border border-rose-300 rounded-2xl p-5 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Truck Maintenance Due</h3>
              <button onClick={() => navigate('/company-admin/vehicles')} className="text-[10px] font-bold text-blue-600 hover:underline">View all</button>
            </div>
            
            <div className="space-y-4">
              {truckMaintenance.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs font-medium">All trucks serviced & compliant</div>
              ) : (
                truckMaintenance.map((truck, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                        <Truck className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <div className="text-[11px] font-extrabold text-slate-900 leading-tight mb-0.5">{truck.name}</div>
                        <div className="text-[9px] font-bold text-slate-400">{truck.reg}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] font-black text-slate-700 leading-tight mb-0.5">{truck.metric}</div>
                      <div className={`text-[9px] font-bold uppercase tracking-wider ${truck.isOverdue ? 'text-rose-500' : 'text-slate-400'}`}>
                        {truck.due}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Need Help? Support & Knowledge Base */}
          <div className="bg-white border border-emerald-300 rounded-2xl p-5 shadow-xs">
            <h3 className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-2">Need Operations Help?</h3>
            <p className="text-xs font-medium text-slate-500 mb-4">Search logistics knowledge base or submit a new support ticket.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => navigate('/company-admin/knowledge-base')}
                className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-bold py-2.5 rounded-xl transition-colors cursor-pointer">
                Knowledge Base
              </button>
              <button 
                onClick={() => setShowSupportTicket(true)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer">
                New Support Ticket
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Assign Driver & Fleet Asset Modal */}
      {showAssignDriver && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[100] p-4">
          <form onSubmit={handleConfirmAssignment} className="bg-white rounded-2xl shadow-2xl w-full max-w-[580px] overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-black tracking-tight">Assign Driver & Fleet Assets</h2>
                  <p className="text-[10px] text-slate-400 font-medium">Allocate driver, truck, and trailer to dispatch run</p>
                </div>
              </div>
              <button type="button" onClick={() => setShowAssignDriver(false)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-sans">
              {/* Select Target Load */}
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                  Target Freight Load <span className="text-rose-500">*</span>
                </label>
                <select 
                  value={assignForm.loadId}
                  onChange={(e) => setAssignForm({ ...assignForm, loadId: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-purple-500 cursor-pointer">
                  <option value="">Select a load from database...</option>
                  {modalLoads.map((load) => (
                    <option key={load.id} value={load.id}>
                      {load.loadRef || load.id} · {load.originCity || 'Depot'} → {load.destCity || 'Destination'} ({load.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Available Driver */}
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                  Select Driver <span className="text-rose-500">*</span>
                </label>
                <select
                  value={assignForm.driverId}
                  onChange={(e) => setAssignForm({ ...assignForm, driverId: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-purple-500 cursor-pointer">
                  <option value="">Select a driver from database...</option>
                  {modalDrivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.firstName} {driver.lastName} ({driver.driverCode || driver.id.slice(0, 8)}) - {driver.licenceCategory || 'Linehaul'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assign Vehicle */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                  Assign Truck / Vehicle
                </label>
                <select 
                  value={assignForm.truckId}
                  onChange={(e) => setAssignForm({ ...assignForm, truckId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-purple-500 cursor-pointer">
                  <option value="">Select a vehicle from fleet database...</option>
                  {modalVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.rego || v.id} · {v.make} {v.model} ({v.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setShowAssignDriver(false)} 
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition-colors cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={submittingAction}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md shadow-purple-600/20 transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              >
                {submittingAction && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirm Assignment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Track Load Modal */}
      {showTrackLoad && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-[540px] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Track Load</h2>
              <button onClick={() => setShowTrackLoad(false)} className="text-slate-400 hover:text-slate-600"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="py-6 px-8 flex flex-col items-center text-center">
              <div className="w-14 h-14 text-[#10B981] flex items-center justify-center mb-3">
                <MapPin className="w-10 h-10" />
              </div>
              <p className="text-sm text-slate-600 mb-5">Enter a Load Ref or VIN to open live telemetry map.</p>
              <input 
                type="text" 
                value={trackSearch}
                onChange={(e) => setTrackSearch(e.target.value)}
                placeholder="e.g. PO-123456" 
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-center text-slate-700 focus:outline-none focus:border-emerald-500 mb-5" 
              />
              <button 
                onClick={() => {
                  setShowTrackLoad(false);
                  navigate('/company-admin/live-tracking', { state: { search: trackSearch } });
                }} 
                className="w-full py-2.5 bg-[#10B981] hover:bg-emerald-600 text-white text-sm font-bold rounded-lg shadow-xs cursor-pointer">
                Find on Live Map
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Customer Modal */}
      {showCreateCustomer && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[100] p-4">
          <form onSubmit={handleSaveCustomer} className="bg-white rounded-xl shadow-xl w-full max-w-[540px] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Add New Customer</h2>
              <button type="button" onClick={() => setShowCreateCustomer(false)} className="text-slate-400 hover:text-slate-600"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Company Name *</label>
                <input 
                  type="text" 
                  required
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                  placeholder="e.g. Apex Logistics Pty Ltd"
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">Contact Name</label>
                  <input 
                    type="text" 
                    value={customerForm.contactPerson}
                    onChange={(e) => setCustomerForm({ ...customerForm, contactPerson: e.target.value })}
                    placeholder="e.g. John Smith"
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">Email</label>
                  <input 
                    type="email" 
                    value={customerForm.email}
                    onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                    placeholder="john@apex.com"
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500" 
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 flex justify-end gap-3 bg-white mt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowCreateCustomer(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800">Cancel</button>
              <button type="submit" disabled={submittingAction} className="px-5 py-2 bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer">
                {submittingAction && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Save Customer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add New Truck Modal */}
      {showAddNewTruck && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[100] p-4">
          <form onSubmit={handleSaveTruck} className="bg-white rounded-xl shadow-xl w-full max-w-[540px] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Add New Truck / Fleet Vehicle</h2>
              <button type="button" onClick={() => setShowAddNewTruck(false)} className="text-slate-400 hover:text-slate-600"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">Make / Model</label>
                  <input 
                    type="text" 
                    value={truckForm.make}
                    onChange={(e) => setTruckForm({ ...truckForm, make: e.target.value })}
                    placeholder="e.g. Volvo FH540" 
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-1.5">Rego Plate *</label>
                  <input 
                    type="text" 
                    required
                    value={truckForm.rego}
                    onChange={(e) => setTruckForm({ ...truckForm, rego: e.target.value })}
                    placeholder="e.g. ABC123" 
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500" 
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 flex justify-end gap-3 bg-white mt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowAddNewTruck(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800">Cancel</button>
              <button type="submit" disabled={submittingAction} className="px-5 py-2 bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer">
                {submittingAction && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Save Vehicle
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Support Ticket Modal */}
      {showSupportTicket && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[100] p-4">
          <form onSubmit={handleSaveTicket} className="bg-white rounded-xl shadow-xl w-full max-w-[540px] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">New Support Ticket</h2>
              <button type="button" onClick={() => setShowSupportTicket(false)} className="text-slate-400 hover:text-slate-600"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Subject *</label>
                <input 
                  type="text" 
                  required
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  placeholder="e.g. Issue generating customer invoice" 
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5">Description</label>
                <textarea 
                  rows="4" 
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  placeholder="Describe your request..." 
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500 resize-none"></textarea>
              </div>
            </div>
            <div className="px-6 py-4 flex justify-end gap-3 bg-white mt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowSupportTicket(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800">Cancel</button>
              <button type="submit" disabled={submittingAction} className="px-5 py-2 bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer">
                {submittingAction && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Submit Ticket
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
