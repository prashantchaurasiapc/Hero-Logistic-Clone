import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiCheckSquare, FiPackage, FiUpload, FiClock,
  FiAlertTriangle, FiFileText, FiTruck, FiCoffee, FiDollarSign,
  FiChevronRight, FiShield, FiCheckCircle, FiNavigation, FiSend,
  FiDroplet, FiMessageSquare, FiRefreshCw
} from 'react-icons/fi';
import {
  getMyProfile,
  getMyLoads,
  getTodayTimesheet,
  getPayrollSummary,
  getMessages,
  getUnreadMessageCount,
  getTodayChecklist,
  sendMessage
} from '../../services/driverApi';

const DriverDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ─── API States ────────────────────────────────────────────────────────
  const [driverProfile, setDriverProfile] = useState(null);
  const [assignedLoads, setAssignedLoads] = useState([]);
  const [timesheetData, setTimesheetData] = useState(null);
  const [payrollData, setPayrollData] = useState(null);
  const [messagesList, setMessagesList] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [todayChecklist, setTodayChecklist] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
<<<<<<< HEAD
  const [driverStatus, setDriverStatus] = useState(() => localStorage.getItem('hero_driver_duty_status') || 'On Duty');
=======
  const [apiError, setApiError] = useState(null);

  // Local UI State
  const [driverStatus, setDriverStatus] = useState('On Duty');

  useEffect(() => {
    if (user?.driverProfile?.status) {
      const statusMap = {
        'AVAILABLE': 'On Duty',
        'UNAVAILABLE': 'Off Duty',
        'ON_DUTY': 'On Duty',
        'OFF_DUTY': 'Off Duty',
        'ON_LEAVE': 'On Leave'
      };
      setDriverStatus(statusMap[user.driverProfile.status] || user.driverProfile.status);
    }
  }, [user]);
>>>>>>> 942db2529edabcead1dbf19472d97bf3d750d322
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [quickMsg, setQuickMsg] = useState('');
  const [isSendingMsg, setIsSendingMsg] = useState(false);
  const [scheduleFilter, setScheduleFilter] = useState('ALL');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // ─── Concurrent Backend Data Fetching ──────────────────────────────────
  const fetchDashboardData = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
<<<<<<< HEAD
      setIsLoading(true);
      const res = await api.get('/driver-portal/dashboard');
      if (res.data?.success && res.data?.data) {
        setDashboardData(res.data.data);
        if (res.data.data.driverInfo?.status) {
          setDriverStatus(res.data.data.driverInfo.status);
          localStorage.setItem('hero_driver_duty_status', res.data.data.driverInfo.status);
        }
=======
      const [
        profileRes,
        loadsRes,
        timesheetRes,
        payrollRes,
        messagesRes,
        unreadRes,
        checklistRes
      ] = await Promise.allSettled([
        getMyProfile(),
        getMyLoads(),
        getTodayTimesheet(),
        getPayrollSummary(),
        getMessages(),
        getUnreadMessageCount(),
        getTodayChecklist()
      ]);

      // Profile
      if (profileRes.status === 'fulfilled') {
        const d = profileRes.value.data?.data?.driver || profileRes.value.data?.driver || profileRes.value.data;
        setDriverProfile(d || null);
>>>>>>> 942db2529edabcead1dbf19472d97bf3d750d322
      }

      // Loads
      if (loadsRes.status === 'fulfilled') {
        const loads = loadsRes.value.data?.data?.loads || loadsRes.value.data?.loads || (Array.isArray(loadsRes.value.data) ? loadsRes.value.data : []);
        setAssignedLoads(loads);
      }

      // Timesheet
      if (timesheetRes.status === 'fulfilled') {
        const ts = timesheetRes.value.data?.data?.timesheet || timesheetRes.value.data?.timesheet || timesheetRes.value.data;
        setTimesheetData(ts || null);
      }

      // Payroll
      if (payrollRes.status === 'fulfilled') {
        const p = payrollRes.value.data?.data || payrollRes.value.data;
        setPayrollData(p || null);
      }

      // Messages
      if (messagesRes.status === 'fulfilled') {
        const msgs = messagesRes.value.data?.data?.messages || messagesRes.value.data?.messages || (Array.isArray(messagesRes.value.data) ? messagesRes.value.data : []);
        setMessagesList(msgs);
      }

      // Unread Count
      if (unreadRes.status === 'fulfilled') {
        const cnt = unreadRes.value.data?.data?.count ?? unreadRes.value.data?.count ?? 0;
        setUnreadCount(cnt);
      }

      // Checklist
      if (checklistRes.status === 'fulfilled') {
        const chk = checklistRes.value.data?.data?.checklist || checklistRes.value.data?.checklist;
        setTodayChecklist(chk || null);
      }

    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setApiError('Could not sync live dashboard data from server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

<<<<<<< HEAD
  const handleStatusChange = async (newStatus) => {
    try {
      setDriverStatus(newStatus);
      localStorage.setItem('hero_driver_duty_status', newStatus);
      setStatusModalOpen(false);
      const res = await api.post('/driver-portal/status', { status: newStatus });
      if (res.data?.success) {
        showToast(`Driver status updated to: ${newStatus}`);
        fetchDashboard();
      }
    } catch (err) {
      console.error('Error updating status:', err);
      showToast(`Status updated locally to: ${newStatus}`);
    }
=======
  // ─── Derived Header Values ─────────────────────────────────────────────
  const driverName = isLoading
    ? '...'
    : driverProfile
    ? `${driverProfile.firstName || ''} ${driverProfile.lastName || ''}`.trim() || driverProfile.email
    : 'Driver';

  const assignedVehicle = driverProfile?.currentVehicle?.[0] || driverProfile?.vehicle || null;
  const vehicleLabel = assignedVehicle
    ? `${assignedVehicle.rego || assignedVehicle.plate || 'TRK'} (${assignedVehicle.make || ''} ${assignedVehicle.model || ''})`.trim()
    : 'No vehicle assigned';
  const odometerLabel = assignedVehicle?.odometerKm
    ? `${assignedVehicle.odometerKm.toLocaleString()} km`
    : '—';

  const dbStatus = driverProfile?.status || null;
  const statusDisplayMap = {
    ON_DUTY: 'On Duty',
    OFF_DUTY: 'Off Duty',
    ON_LEAVE: 'On Leave',
    UNAVAILABLE: 'Unavailable',
    AVAILABLE: 'Available',
>>>>>>> 942db2529edabcead1dbf19472d97bf3d750d322
  };

  const handleStatusChange = (newStatus) => {
    setDriverStatus(newStatus);
    setStatusModalOpen(false);
    showToast(`Driver status updated to: ${newStatus}`);
  };

  // Quick Send Message Handler
  const handleSendQuickMsg = async (e) => {
    e.preventDefault();
    if (!quickMsg.trim() || isSendingMsg) return;

    try {
      setIsSendingMsg(true);
      await sendMessage({ body: quickMsg });
      showToast(`✅ Message sent to Dispatch!`);
      setQuickMsg('');
      // Refresh messages
      const msgsRes = await getMessages();
      const msgs = msgsRes.data?.data?.messages || msgsRes.data?.messages || [];
      setMessagesList(msgs);
    } catch (err) {
      console.error('Failed to send quick message:', err);
      showToast('❌ Failed to send message to Dispatch.');
    } finally {
      setIsSendingMsg(false);
    }
  };

  // ─── REAL DATA METRICS CALCULATION ──────────────────────────────────────
  // 1. Loads Today
  const activeLoads = assignedLoads.filter(l => ['IN_TRANSIT', 'ASSIGNED', 'DISPATCHED', 'ACCEPTED', 'LOADING'].includes(l.status));
  const loadsTodayCount = activeLoads.length;
  const upcomingLoadsCount = assignedLoads.filter(l => ['ASSIGNED', 'ACCEPTED', 'DISPATCHED'].includes(l.status)).length;

  // 2. Completed Loads
  const completedLoads = assignedLoads.filter(l => ['DELIVERED', 'COMPLETED'].includes(l.status));
  const completedCount = completedLoads.length;

  // 3. Active Load (First in-transit or assigned load)
  const currentActiveLoad = activeLoads[0] || assignedLoads[0] || null;

  // 4. Drive Time Today / Shift Elapsed (From Real Timesheet)
  const isClockedIn = !!(timesheetData?.clockInTime && !timesheetData?.clockOutTime);
  let driveTimeStr = '0h 0m';
  let remainingTimeStr = 'Not Clocked In';
  let shiftElapsedStr = '0h 0m';
  let shiftPct = 0;

  if (timesheetData?.clockInTime && !timesheetData?.clockOutTime) {
    const startMs = new Date(timesheetData.clockInTime).getTime();
    const nowMs = Date.now();
    const diffMins = Math.max(0, Math.floor((nowMs - startMs) / 60000));
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    driveTimeStr = `${hours}h ${mins}m`;
    const remainingHrs = Math.max(0, 12 - hours);
    remainingTimeStr = `Remaining: ${remainingHrs}h (HOS)`;
    shiftElapsedStr = `${hours}h ${mins}m / 14h max`;
    shiftPct = Math.min(100, Math.round((hours / 14) * 100));
  } else if (timesheetData?.totalHours) {
    const h = Math.floor(timesheetData.totalHours);
    const m = Math.round((timesheetData.totalHours - h) * 60);
    driveTimeStr = `${h}h ${m}m`;
    remainingTimeStr = 'Shift Shift Ended';
    shiftElapsedStr = `${h}h ${m}m completed`;
    shiftPct = Math.min(100, Math.round((h / 14) * 100));
  }

  // 5. Pay This Period (From Real Payroll API)
  const currentPeriod = payrollData?.latestPeriod || (Array.isArray(payrollData?.history) ? payrollData.history[0] : null);
  const currentNetPay = payrollData?.summary?.netPay || currentPeriod?.netPay || 0;
  const formattedNetPay = `$${Number(currentNetPay).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // 6. Checklist Completed Status
  const isChecklistDone = !!(todayChecklist && (todayChecklist.isCompleted || todayChecklist.items?.length > 0));

  // 7. Dynamic Schedule Filter
  const filteredLoads = assignedLoads.filter(load => {
    if (scheduleFilter === 'ALL') return true;
    if (scheduleFilter === 'ON_DUTY') return true;
    if (scheduleFilter === 'IN_TRANSIT') return load.status === 'IN_TRANSIT';
    if (scheduleFilter === 'UPCOMING') return ['ASSIGNED', 'ACCEPTED', 'DISPATCHED'].includes(load.status);
    if (scheduleFilter === 'COMPLETED') return ['DELIVERED', 'COMPLETED'].includes(load.status);
    return true;
  });

  // Helper formatting for currency
  const formatMoney = (amount) => `$${Number(amount || 0).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="flex-grow bg-[#f8fafc] p-4 lg:p-6 w-full text-left font-sans overflow-y-auto min-h-screen">

      {/* API Error Banner */}
      {apiError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FiAlertTriangle className="shrink-0 text-red-600" />
            <span>{apiError}</span>
          </div>
          <button onClick={fetchDashboardData} className="text-xs font-bold text-red-800 underline cursor-pointer">
            Retry Sync
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#ffcc00] text-black font-extrabold text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <FiCheckCircle className="text-black text-base" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5 sm:mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Driver Dashboard</h1>
<<<<<<< HEAD
            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
              driverStatus === 'In Transit'
                ? 'bg-blue-100 text-blue-800 border-blue-300'
                : (driverStatus === 'On Break'
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : (driverStatus === 'Off Duty'
                        ? 'bg-slate-100 text-slate-700 border-slate-300'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300'))
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                driverStatus === 'In Transit'
                  ? 'bg-blue-500'
                  : (driverStatus === 'On Break'
                      ? 'bg-amber-500'
                      : (driverStatus === 'Off Duty' ? 'bg-slate-500' : 'bg-emerald-500'))
              }`}></span>
              {driverStatus}
            </span>
            <span className="text-[10px] font-extrabold text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full bg-white whitespace-nowrap flex items-center gap-1">
              Last sync: {driverInfo.lastSync}
              <button onClick={fetchDashboard} title="Refresh live data" className="hover:text-slate-700 cursor-pointer ml-1">
                <FiRefreshCw className={`text-[10px] ${isLoading ? 'animate-spin' : ''}`} />
              </button>
=======
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {dbStatus ? (statusDisplayMap[dbStatus] || dbStatus) : driverStatus}
>>>>>>> 942db2529edabcead1dbf19472d97bf3d750d322
            </span>
            <button
              onClick={fetchDashboardData}
              title="Refresh Real Backend Data"
              className="text-[10px] font-extrabold text-slate-500 hover:text-indigo-600 border border-slate-200 hover:border-indigo-300 px-2.5 py-0.5 rounded-full bg-white flex items-center gap-1 cursor-pointer transition-all"
            >
              <FiRefreshCw className={`text-[10px] ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Syncing...' : `Synced: ${new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}`}</span>
            </button>
          </div>
          <p className="text-xs font-semibold text-slate-500 leading-snug">
            Welcome back,{' '}
            <strong className="text-slate-800">
              {isLoading ? '...' : (driverName || user?.name || 'Noah Williams')}
            </strong>
            {' '}• Vehicle:{' '}
            <strong className="text-slate-800">
              {isLoading ? '...' : (vehicleLabel || 'TX-ROAD88 (Freightliner Cascadia)')}
            </strong>
            {' '}• Odometer:{' '}
            <strong className="font-mono text-slate-900">
              {isLoading ? '...' : (odometerLabel || '245,678 km')}
            </strong>
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setStatusModalOpen(true)}
            className="flex-1 md:flex-initial bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <FiTruck className="text-emerald-600 text-sm" />
            <span>Change Status</span>
          </button>

          <button
            onClick={() => navigate('/driver/work-status')}
            className="flex-1 md:flex-initial bg-[#ffcc00] hover:bg-[#e6b800] text-black font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <FiCheckSquare className="text-black text-sm" />
            <span>Start Pre-Start Checklist</span>
          </button>
        </div>
      </div>

      {/* QUICK ACTIONS SHORTCUTS BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-xs mb-5 sm:mb-6">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-left">KEY ACTIONS SHORTCUTS:</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('/driver/work-status')}
            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center sm:justify-start gap-1.5 whitespace-nowrap"
          >
            <FiCheckSquare className="text-emerald-600 shrink-0" />
            <span>Pre-Start Checklist</span>
          </button>

          <button
            onClick={() => navigate('/driver/contact-dispatch')}
            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center sm:justify-start gap-1.5 whitespace-nowrap"
          >
            <FiMessageSquare className="text-blue-600 shrink-0" />
            <span>Message Dispatch</span>
          </button>

          <button
            onClick={() => navigate('/driver/jobs')}
            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center sm:justify-start gap-1.5 whitespace-nowrap"
          >
            <FiPackage className="text-purple-600 shrink-0" />
            <span>View My Loads ({assignedLoads.length})</span>
          </button>

          <button
            onClick={() => navigate('/driver/documents')}
            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center sm:justify-start gap-1.5 whitespace-nowrap"
          >
            <FiUpload className="text-amber-600 shrink-0" />
            <span>Upload Document</span>
          </button>

          <button
            onClick={() => navigate('/driver/timesheets')}
            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center sm:justify-start gap-1.5 col-span-2 sm:col-span-1 whitespace-nowrap"
          >
            <FiClock className="text-indigo-600 shrink-0" />
            <span>Clock In / Out ({isClockedIn ? 'Clocked In' : 'Clocked Out'})</span>
          </button>
        </div>
      </div>

      {/* 5 REAL KPI METRICS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        
        {/* Metric 1: Real Active Loads Today */}
        <div className="bg-white rounded-2xl p-4 border border-blue-200 shadow-xs relative overflow-hidden flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
              <FiPackage className="text-blue-500 text-sm" /> Active Loads
            </div>
            <div className="text-2xl font-black text-slate-900 leading-none">
              {isLoading ? '...' : loadsTodayCount}
            </div>
            <div className="text-[10.5px] font-bold text-indigo-600 mt-1">
              {upcomingLoadsCount > 0 ? `${upcomingLoadsCount} Upcoming Loads` : 'No pending loads'}
            </div>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <FiNavigation className="text-xl" />
          </div>
        </div>

        {/* Metric 2: Real Completed Loads */}
        <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-xs relative overflow-hidden flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
              <FiCheckCircle className="text-emerald-500 text-sm" /> Completed Loads
            </div>
            <div className="text-2xl font-black text-slate-900 leading-none">
              {isLoading ? '...' : completedCount}
            </div>
            <div className="text-[10.5px] font-bold text-emerald-600 mt-1">
              {completedCount > 0 ? `${completedCount} Deliveries Completed` : '0 Completed Deliveries'}
            </div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <FiShield className="text-xl" />
          </div>
        </div>

        {/* Metric 3: Real Shift / Drive Time Today */}
        <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-xs relative overflow-hidden flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
              <FiClock className="text-amber-500 text-sm" /> Drive Time Today
            </div>
            <div className="text-2xl font-black text-slate-900 leading-none">
              {isLoading ? '...' : driveTimeStr}
            </div>
            <div className="text-[10.5px] font-bold text-amber-600 mt-1">
              {remainingTimeStr}
            </div>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <FiCoffee className="text-xl" />
          </div>
        </div>

        {/* Metric 4: Real Vehicle Fuel Status */}
        <div className="bg-white rounded-2xl p-4 border border-purple-200 shadow-xs relative overflow-hidden flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
              <FiDroplet className="text-purple-500 text-sm" /> Vehicle Status
            </div>
            <div className="text-2xl font-black text-slate-900 leading-none truncate max-w-[110px]">
              {assignedVehicle ? (assignedVehicle.rego || 'Assigned') : 'Unassigned'}
            </div>
            <div className="text-[10.5px] font-bold text-purple-600 mt-1">
              {assignedVehicle ? 'Ready for service' : 'Assign vehicle in portal'}
            </div>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
            <FiDroplet className="text-xl" />
          </div>
        </div>

        {/* Metric 5: Real Pay This Period */}
        <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-xs relative overflow-hidden flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
              <FiDollarSign className="text-emerald-500 text-sm" /> Pay This Period
            </div>
            <div className="text-2xl font-black text-slate-900 leading-none">
              {isLoading ? '...' : formattedNetPay}
            </div>
            <div className="text-[10.5px] font-bold text-slate-500 mt-1">
              {currentPeriod?.status || 'Active Period'}
            </div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <FiDollarSign className="text-xl" />
          </div>
        </div>

      </div>

      {/* LEGEND STATUS FILTER BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs mb-5 sm:mb-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">LEGEND & STATUS FILTER:</span>
          <div className="flex items-center gap-2 text-xs font-bold w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 custom-scrollbar whitespace-nowrap">
            <button
              onClick={() => setScheduleFilter('ALL')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer transition-all ${scheduleFilter === 'ALL' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 bg-slate-50'}`}
            >
              <span>All Statuses ({assignedLoads.length})</span>
            </button>

            <button
              onClick={() => setScheduleFilter('ON_DUTY')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer transition-all ${scheduleFilter === 'ON_DUTY' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 bg-slate-50'}`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>On Duty</span>
            </button>

            <button
              onClick={() => setScheduleFilter('IN_TRANSIT')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer transition-all ${scheduleFilter === 'IN_TRANSIT' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 bg-slate-50'}`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>In Transit ({assignedLoads.filter(l => l.status === 'IN_TRANSIT').length})</span>
            </button>

            <button
              onClick={() => setScheduleFilter('UPCOMING')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer transition-all ${scheduleFilter === 'UPCOMING' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 bg-slate-50'}`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span>Upcoming ({upcomingLoadsCount})</span>
            </button>

            <button
              onClick={() => setScheduleFilter('COMPLETED')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer transition-all ${scheduleFilter === 'COMPLETED' ? 'bg-slate-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 bg-slate-50'}`}
            >
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              <span>Completed ({completedCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN 3-COLUMN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* ================= COLUMN 1: CURRENT LOAD & REAL SCHEDULE ================= */}
        <div className="space-y-6">
          
          {/* Real Current Assigned Load Card */}
          <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-xs relative">
            {currentActiveLoad ? (
              <>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FiPackage className="text-blue-600" /> CURRENT LOAD
                  </span>
                  <span className="bg-[#ffcc00] text-black font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                    {currentActiveLoad.status}
                  </span>
                </div>

                <div className="text-xl font-black text-slate-900">
                  {currentActiveLoad.loadNumber || currentActiveLoad.referenceNumber || `LD-${currentActiveLoad.id.slice(0, 6)}`}
                </div>
                <div className="text-sm font-black text-slate-800 mb-4 flex items-center gap-1.5">
                  <span>{currentActiveLoad.pickupCity || currentActiveLoad.originAddress || 'Origin'}</span>
                  <span className="text-slate-400">➔</span>
                  <span>{currentActiveLoad.deliveryCity || currentActiveLoad.destinationAddress || 'Destination'}</span>
                </div>

                {/* Real Route Stops */}
                <div className="space-y-3 border-t border-slate-100 pt-3">
                  <div className="flex items-start gap-3">
                    <span className="w-3 h-3 rounded-full bg-purple-500 mt-1 shrink-0"></span>
                    <div>
                      <div className="flex justify-between items-center text-[10.5px]">
                        <span className="font-extrabold text-slate-400 uppercase">Pickup Location</span>
                      </div>
                      <div className="font-bold text-slate-900 text-xs">{currentActiveLoad.pickupLocationName || currentActiveLoad.originAddress || 'Pickup Point'}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-3 h-3 rounded-full bg-blue-500 mt-1 shrink-0"></span>
                    <div>
                      <div className="flex justify-between items-center text-[10.5px]">
                        <span className="font-extrabold text-slate-400 uppercase">Delivery Location</span>
                      </div>
                      <div className="font-bold text-slate-900 text-xs">{currentActiveLoad.deliveryLocationName || currentActiveLoad.destinationAddress || 'Delivery Point'}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">Equipment / Type</span>
                    <span className="font-bold text-slate-800">{currentActiveLoad.equipmentType || currentActiveLoad.cargoType || 'Car Carrier'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">Reference</span>
                    <span className="font-mono font-bold text-slate-800">{currentActiveLoad.referenceNumber || currentActiveLoad.customerRef || '—'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/driver/active-run/${currentActiveLoad.id}`)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>View Active Run</span>
                    <FiChevronRight />
                  </button>
                  <button
                    onClick={() => navigate('/driver/documents')}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <FiUpload className="text-slate-600" />
                    <span>Upload Document</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
                  <FiPackage />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-sm">No Active Load Assigned</h4>
                  <p className="text-xs text-slate-500 font-medium">You currently have no load in transit.</p>
                </div>
                <button
                  onClick={() => navigate('/driver/jobs')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Browse Assigned Jobs</span>
                  <FiChevronRight />
                </button>
              </div>
            )}
          </div>

          {/* Real Today's Schedule Timeline */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TODAY'S SCHEDULE ({filteredLoads.length})</h3>
              <button onClick={() => navigate('/driver/jobs')} className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">
                View all
              </button>
            </div>

            <div className="space-y-2.5">
              {filteredLoads.length > 0 ? (
                filteredLoads.slice(0, 4).map((load, idx) => (
                  <div key={load.id || idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                    <div className="flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full ${load.status === 'IN_TRANSIT' ? 'bg-blue-500' : load.status === 'DELIVERED' ? 'bg-emerald-500' : 'bg-purple-500'}`}></span>
                      <div>
                        <span className="font-bold text-slate-900 block">{load.originAddress || 'Origin'} ➔ {load.destinationAddress || 'Destination'}</span>
                        <span className="text-slate-500 text-[11px] block font-medium">Status: {load.status}</span>
                      </div>
                    </div>
                    <span className="font-mono font-extrabold text-[10px] text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded">
                      {load.loadNumber || `LD-${load.id.slice(0, 5)}`}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400 font-bold bg-slate-50 rounded-xl border border-slate-100">
                  No loads scheduled for today.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ================= COLUMN 2: REAL HOS LOGS & MESSAGING ================= */}
        <div className="space-y-6">
          
          {/* Real HOS & Shift Logging */}
          <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">BREAK / REST & HOS LOGGING</h3>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${isClockedIn ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                {isClockedIn ? 'Work Session Active' : 'Not Clocked In'}
              </span>
            </div>

            <div className="space-y-4">
              {/* Drive Time Bar */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-600">Work / Drive Time Today</span>
                  <span className="text-slate-900 font-mono">{driveTimeStr}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${shiftPct}%` }}></div>
                </div>
              </div>

              {/* Shift Hours Bar */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-600">Total Shift Elapsed</span>
                  <span className="text-slate-900 font-mono">{shiftElapsedStr}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${shiftPct}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleStatusChange('On Break')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <FiCoffee className="text-amber-600" />
                  <span>Log Rest Break</span>
                </button>
                <button
                  onClick={() => navigate('/driver/timesheets')}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 rounded-xl transition-all cursor-pointer"
                >
                  View Timesheets & HOS
                </button>
              </div>
            </div>
          </div>

          {/* Real Dispatch Messages & Quick Chat */}
          <div className="bg-white border border-purple-200 rounded-2xl p-5 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MESSAGES & DISPATCH</h3>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">{unreadCount}</span>
                )}
              </div>
              <button onClick={() => navigate('/driver/contact-dispatch')} className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">
                View all
              </button>
            </div>

            <div className="space-y-3 mb-4 max-h-[220px] overflow-y-auto pr-1">
              {messagesList.length > 0 ? (
                messagesList.slice(0, 3).map((msg) => (
                  <div key={msg.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                      {msg.senderName ? msg.senderName.slice(0, 2).toUpperCase() : 'DP'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-slate-900 text-xs">{msg.senderName || msg.senderType || 'Dispatch'}</span>
                        <span className="text-[10px] font-medium text-slate-400">
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium truncate">{msg.body || msg.content || msg.text}</p>
                    </div>
                    {!msg.isRead && <span className="bg-blue-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">New</span>}
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400 font-bold bg-slate-50 rounded-xl border border-slate-100">
                  No recent messages.
                </div>
              )}
            </div>

            {/* Real Quick Reply Form */}
            <form onSubmit={handleSendQuickMsg} className="flex gap-2">
              <input
                type="text"
                value={quickMsg}
                onChange={(e) => setQuickMsg(e.target.value)}
                placeholder="Type quick message to Dispatch..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
              />
              <button
                type="submit"
                disabled={isSendingMsg}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
              >
                <FiSend />
                <span>{isSendingMsg ? '...' : 'Send'}</span>
              </button>
            </form>
          </div>

        </div>

        {/* ================= COLUMN 3: REAL SAFETY ALERTS & PAY SUMMARY ================= */}
        <div className="space-y-6">
          
          {/* Real Safety & Compliance Alerts */}
          <div className="bg-white border border-rose-200 rounded-2xl p-5 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ALERTS</h3>
              <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                {(!isChecklistDone ? 1 : 0) + (unreadCount > 0 ? 1 : 0) + (!isClockedIn ? 1 : 0)}
              </span>
            </div>

            <div className="space-y-3">
              {/* Dynamic Alert 1: Pre-start checklist status */}
              {!isChecklistDone ? (
                <div
                  onClick={() => navigate('/driver/work-status')}
                  className="p-3 bg-red-50/60 border border-red-100 rounded-xl flex items-start gap-3 cursor-pointer hover:border-red-300 transition-all"
                >
                  <FiAlertTriangle className="text-red-500 text-base mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 text-xs">Pre-start checklist pending</div>
                    <div className="text-xs text-slate-500 mt-0.5">Please complete your daily pre-start checklist before driving.</div>
                  </div>
                  <FiChevronRight className="text-slate-400" />
                </div>
              ) : (
                <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-start gap-3">
                  <FiCheckCircle className="text-emerald-600 text-base mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 text-xs">Pre-start checklist completed</div>
                    <div className="text-xs text-slate-500 mt-0.5">Your vehicle safety inspection is clear for today.</div>
                  </div>
                </div>
              )}

              {/* Dynamic Alert 2: Unread Messages */}
              {unreadCount > 0 && (
                <div
                  onClick={() => navigate('/driver/contact-dispatch')}
                  className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl flex items-start gap-3 cursor-pointer hover:border-blue-300 transition-all"
                >
                  <FiMessageSquare className="text-blue-600 text-base mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 text-xs">Unread Dispatch Messages</div>
                    <div className="text-xs text-slate-500 mt-0.5">You have {unreadCount} unread message(s) from Dispatch.</div>
                  </div>
                  <FiChevronRight className="text-slate-400" />
                </div>
              )}

              {/* Dynamic Alert 3: Clock in status */}
              {!isClockedIn && (
                <div
                  onClick={() => navigate('/driver/timesheets')}
                  className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl flex items-start gap-3 cursor-pointer hover:border-amber-300 transition-all"
                >
                  <FiClock className="text-amber-600 text-base mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 text-xs">Clock In Reminder</div>
                    <div className="text-xs text-slate-500 mt-0.5">Remember to clock in when starting your shift.</div>
                  </div>
                  <FiChevronRight className="text-slate-400" />
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button onClick={() => navigate('/driver/notifications')} className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1 cursor-pointer">
                <span>View All Notifications</span>
                <FiChevronRight />
              </button>
            </div>
          </div>

          {/* Real Pay This Period Card */}
          <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">PAY THIS PERIOD</div>
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xl border border-emerald-100">
                $
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 leading-tight">{isLoading ? '...' : formattedNetPay}</div>
                <div className="text-xs font-bold text-slate-400">{currentPeriod?.status || 'Active Period'}</div>
              </div>
            </div>

            <button
              onClick={() => navigate('/driver/my-pay')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
            >
              View Pay Summary
            </button>
          </div>

        </div>

      </div>

      {/* CHANGE STATUS MODAL */}
      {statusModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-5 space-y-4 text-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base">Change Driver Duty Status</h3>
              <button onClick={() => setStatusModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-2">
              {['On Duty', 'In Transit', 'On Break', 'Off Duty'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`w-full p-3 rounded-xl text-left font-bold text-xs flex items-center justify-between cursor-pointer border transition-all ${
                    driverStatus === status
                      ? 'bg-[#ffcc00] text-black border-[#ffcc00] shadow-xs'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{status}</span>
                  {driverStatus === status && <FiCheckCircle className="text-black text-base" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DriverDashboard;
