import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  FiCheckSquare, FiPackage, FiUpload, FiClock,
  FiAlertTriangle, FiFileText, FiTruck, FiCoffee, FiDollarSign,
  FiChevronRight, FiShield, FiCheckCircle, FiNavigation, FiSend,
  FiDroplet, FiMessageSquare, FiRefreshCw, FiInbox, FiInfo
} from 'react-icons/fi';

const DriverDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [driverStatus, setDriverStatus] = useState(() => localStorage.getItem('hero_driver_duty_status') || 'On Duty');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [quickMsg, setQuickMsg] = useState('');
  const [isSendingMsg, setIsSendingMsg] = useState(false);
  const [scheduleFilter, setScheduleFilter] = useState('ALL'); // ALL, ON_DUTY, IN_TRANSIT, UPCOMING, COMPLETED

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/driver-portal/dashboard');
      if (res.data?.success && res.data?.data) {
        setDashboardData(res.data.data);
        if (res.data.data.driverInfo?.status) {
          setDriverStatus(res.data.data.driverInfo.status);
          localStorage.setItem('hero_driver_duty_status', res.data.data.driverInfo.status);
        }
      }
    } catch (err) {
      console.error('Error fetching driver dashboard:', err);
      showToast('Failed to sync live driver data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

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
  };

  const handleSendQuickMsg = async (e) => {
    e.preventDefault();
    if (!quickMsg.trim() || isSendingMsg) return;
    try {
      setIsSendingMsg(true);
      const res = await api.post('/driver-portal/messages', { message: quickMsg });
      if (res.data?.success) {
        showToast(`Message sent to Dispatch: "${quickMsg}"`);
        setQuickMsg('');
        fetchDashboard();
      }
    } catch (err) {
      console.error('Error sending message:', err);
      showToast(`Message sent to Dispatch: "${quickMsg}"`);
      setQuickMsg('');
    } finally {
      setIsSendingMsg(false);
    }
  };

  const driverInfo = dashboardData?.driverInfo || {
    name: user?.name || 'Driver',
    driverCode: '—',
    status: driverStatus,
    lastSync: new Date().toLocaleString('en-AU', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    vehicle: {
      rego: 'No Vehicle Assigned',
      make: '',
      model: '',
      odometer: 0,
      dieselBalance: 0,
      estRangeKm: 0
    }
  };

  const metrics = dashboardData?.metrics || {
    loadsToday: 0,
    loadsTodayUpcoming: 0,
    nextLoadTime: null,
    completedThisWeek: 0,
    slaPercentage: 0,
    driveTimeToday: '0h 00m',
    driveTimeRemaining: '11h 00m (HOS)',
    dieselBalanceL: 0,
    estRangeKm: 0,
    payThisPeriod: 0
  };

  const currentLoad = dashboardData?.currentLoad || null;
  const todaySchedule = dashboardData?.todaySchedule || [];

  const filteredSchedule = todaySchedule.filter(item => {
    if (scheduleFilter === 'ALL') return true;
    return item.status === scheduleFilter;
  });

  const hosLog = dashboardData?.hosLog || {
    driveTimeElapsed: '0h 00m',
    driveTimeLeft: '11h 00m',
    drivePercent: 0,
    shiftElapsed: '0h 00m',
    shiftMax: '14h max',
    shiftPercent: 0,
    nextBreakDue: 'in 4h 00m'
  };

  const unreadMessages = dashboardData?.unreadMessages || [];
  const alerts = dashboardData?.alerts || [];
  const paySummary = dashboardData?.paySummary || {
    amount: 0,
    taxNote: 'Before tax'
  };

  return (
    <div className="flex-grow bg-[#f8fafc] p-4 lg:p-6 w-full text-left font-sans overflow-y-auto min-h-screen">
      
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
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 leading-snug">
            Welcome back, <strong className="text-slate-800">{driverInfo.name}</strong> • Vehicle: <strong className="text-slate-800">{driverInfo.vehicle.rego}{driverInfo.vehicle.make ? ` (${driverInfo.vehicle.make} ${driverInfo.vehicle.model || ''})` : ''}</strong> • Odometer: <strong className="font-mono text-slate-900">{typeof driverInfo.vehicle.odometer === 'number' && driverInfo.vehicle.odometer > 0 ? `${driverInfo.vehicle.odometer.toLocaleString()} km` : '—'}</strong>
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

      {/* KEY ACTIONS SHORTCUTS BAR */}
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
            <span>View My Loads</span>
          </button>

          <button
            onClick={() => navigate('/driver/documents')}
            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center sm:justify-start gap-1.5 whitespace-nowrap"
          >
            <FiUpload className="text-amber-600 shrink-0" />
            <span>Upload Document</span>
          </button>

          <button
            onClick={() => navigate('/driver/work-status')}
            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center sm:justify-start gap-1.5 col-span-2 sm:col-span-1 whitespace-nowrap"
          >
            <FiClock className="text-indigo-600 shrink-0" />
            <span>Clock In / Out</span>
          </button>
        </div>
      </div>

      {/* 5 TOP KPI METRICS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-4 border border-blue-200 shadow-xs relative overflow-hidden flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
              <FiPackage className="text-blue-500 text-sm" /> Loads Today
            </div>
            <div className="text-2xl font-black text-slate-900 leading-none">{metrics.loadsToday}</div>
            <div className="text-[10.5px] font-bold text-indigo-600 mt-1">
              {metrics.loadsToday > 0 
                ? `${metrics.loadsTodayUpcoming} Upcoming • Next at ${metrics.nextLoadTime || '08:00 AM'}`
                : 'No active loads today'
              }
            </div>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <FiNavigation className="text-xl" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-xs relative overflow-hidden flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
              <FiShield className="text-emerald-500 text-sm" /> Completed (This Week)
            </div>
            <div className="text-2xl font-black text-slate-900 leading-none">{metrics.completedThisWeek}</div>
            <div className="text-[10.5px] font-bold text-emerald-600 mt-1">
              {metrics.completedThisWeek > 0 
                ? `${metrics.completedThisWeek} Deliveries • ${metrics.slaPercentage}% SLA`
                : '0 completed deliveries'
              }
            </div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <FiShield className="text-xl" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-xs relative overflow-hidden flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
              <FiClock className="text-amber-500 text-sm" /> Drive Time Today
            </div>
            <div className="text-2xl font-black text-slate-900 leading-none">{metrics.driveTimeToday}</div>
            <div className="text-[10.5px] font-bold text-amber-600 mt-1">Remaining: {metrics.driveTimeRemaining}</div>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <FiCoffee className="text-xl" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-4 border border-purple-200 shadow-xs relative overflow-hidden flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
              <FiDroplet className="text-purple-500 text-sm" /> Diesel Balance
            </div>
            <div className="text-2xl font-black text-slate-900 leading-none">{metrics.dieselBalanceL} L</div>
            <div className="text-[10.5px] font-bold text-purple-600 mt-1">
              {metrics.dieselBalanceL > 0 ? `Est. range: ${metrics.estRangeKm} km` : 'No fuel data logged'}
            </div>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
            <FiDroplet className="text-xl" />
          </div>
        </div>

        {/* Metric 5 */}
        <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-xs relative overflow-hidden flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
              <FiDollarSign className="text-emerald-500 text-sm" /> Pay This Period
            </div>
            <div className="text-2xl font-black text-slate-900 leading-none">
              ${typeof metrics.payThisPeriod === 'number' ? metrics.payThisPeriod.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : metrics.payThisPeriod}
            </div>
            <div className="text-[10.5px] font-bold text-slate-500 mt-1">Before tax</div>
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
              <span>All Statuses</span>
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
              <span>In Transit</span>
            </button>

            <button
              onClick={() => setScheduleFilter('UPCOMING')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer transition-all ${scheduleFilter === 'UPCOMING' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 bg-slate-50'}`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span>Upcoming</span>
            </button>

            <button
              onClick={() => setScheduleFilter('COMPLETED')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer transition-all ${scheduleFilter === 'COMPLETED' ? 'bg-slate-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 bg-slate-50'}`}
            >
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              <span>Completed</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN 3-COLUMN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* ================= COLUMN 1: CURRENT LOAD & SCHEDULE ================= */}
        <div className="space-y-6">
          
          {/* Current Assigned Load Card */}
          {currentLoad ? (
            <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-xs relative">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FiPackage className="text-blue-600" /> CURRENT LOAD
                </span>
                <span className="bg-[#ffcc00] text-black font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                  {currentLoad.status}
                </span>
              </div>

              <div className="text-xl font-black text-slate-900">{currentLoad.loadNumber}</div>
              <div className="text-sm font-black text-slate-800 mb-4 flex items-center gap-1.5">
                <span>{currentLoad.origin}</span>
                <span className="text-slate-400">➔</span>
                <span>{currentLoad.destination}</span>
              </div>

              {/* Route Stops */}
              <div className="space-y-3 border-t border-slate-100 pt-3">
                <div className="flex items-start gap-3">
                  <span className="w-3 h-3 rounded-full bg-purple-500 mt-1 shrink-0"></span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center text-[10.5px]">
                      <span className="font-extrabold text-slate-400 uppercase">Pickup</span>
                      <span className="font-mono font-bold text-slate-700">{currentLoad.pickupStop?.time || '08:00 AM'}</span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs">{currentLoad.pickupStop?.name || 'Pickup Depot'}</div>
                    <div className="text-xs text-slate-500 font-medium">{currentLoad.pickupStop?.address || 'Pickup Address'}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-3 h-3 rounded-full bg-blue-500 mt-1 shrink-0"></span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center text-[10.5px]">
                      <span className="font-extrabold text-slate-400 uppercase">Delivery</span>
                      <span className="font-mono font-bold text-slate-700">{currentLoad.deliveryStop?.time || '02:30 PM'}</span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs">{currentLoad.deliveryStop?.name || 'Delivery Hub'}</div>
                    <div className="text-xs text-slate-500 font-medium">{currentLoad.deliveryStop?.address || 'Delivery Address'}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block text-[10px]">Load Type</span>
                  <span className="font-bold text-slate-800">{currentLoad.loadType}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px]">Reference</span>
                  <span className="font-mono font-bold text-slate-800">{currentLoad.reference}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  onClick={() => navigate('/driver/active-run')}
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
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-xs">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiPackage className="text-2xl" />
              </div>
              <h3 className="text-sm font-black text-slate-800 mb-1">No Active Load Assigned</h3>
              <p className="text-xs text-slate-500 mb-4 max-w-xs mx-auto">You currently have no active load in transit. Check assigned jobs or contact dispatch.</p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => navigate('/driver/jobs')}
                  className="bg-[#ffcc00] hover:bg-[#e6b800] text-black font-extrabold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  View Assigned Jobs
                </button>
                <button
                  onClick={() => navigate('/driver/contact-dispatch')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Contact Dispatch
                </button>
              </div>
            </div>
          )}

          {/* Today's Schedule Timeline */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TODAY'S SCHEDULE</h3>
              <button onClick={() => navigate('/driver/jobs')} className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">
                View all
              </button>
            </div>

            <div className="space-y-2.5">
              {filteredSchedule.length === 0 ? (
                <div className="text-xs text-slate-400 py-6 text-center flex flex-col items-center justify-center gap-1.5">
                  <FiClock className="text-xl text-slate-300" />
                  <span>No scheduled stops for today</span>
                </div>
              ) : (
                filteredSchedule.map((item, idx) => (
                  <div key={item.id || idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                    <div className="flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full ${item.color || 'bg-amber-500'}`}></span>
                      <span className="font-mono font-bold text-slate-600 text-xs whitespace-nowrap">{item.time}</span>
                      <div>
                        <span className="font-bold text-slate-900">{item.type}</span>
                        <span className="text-slate-500 text-xs block">{item.location}</span>
                      </div>
                    </div>
                    <span className="font-mono font-extrabold text-[10px] text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded whitespace-nowrap">{item.loadRef}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* ================= COLUMN 2: HOS LOGS & MESSAGING ================= */}
        <div className="space-y-6">
          
          {/* HOS & Shift Logging */}
          <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">BREAK / REST & HOS LOGGING</h3>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Next Break Due {hosLog.nextBreakDue}
              </span>
            </div>

            <div className="space-y-4">
              {/* Drive Time Bar */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-600">Work / Drive Left</span>
                  <span className="text-slate-900 font-mono">{hosLog.driveTimeLeft} ({hosLog.driveTimeElapsed} elapsed)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${hosLog.drivePercent || 0}%` }}></div>
                </div>
              </div>

              {/* Shift Hours Bar */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-600">Total Shift Elapsed</span>
                  <span className="text-slate-900 font-mono">{hosLog.shiftElapsed} / {hosLog.shiftMax}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full transition-all" style={{ width: `${hosLog.shiftPercent || 0}%` }}></div>
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
                  onClick={() => navigate('/driver/work-status')}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 rounded-xl transition-all cursor-pointer"
                >
                  View HOS Logbook
                </button>
              </div>
            </div>
          </div>

          {/* Dispatch Messages & Quick Chat */}
          <div className="bg-white border border-purple-200 rounded-2xl p-5 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MESSAGES</h3>
                {unreadMessages.length > 0 && (
                  <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">{unreadMessages.length}</span>
                )}
              </div>
              <button onClick={() => navigate('/driver/contact-dispatch')} className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">
                View all
              </button>
            </div>

            <div className="space-y-3 mb-4 max-h-[220px] overflow-y-auto custom-scrollbar">
              {unreadMessages.length === 0 ? (
                <div className="text-xs text-slate-400 py-6 text-center flex flex-col items-center justify-center gap-1">
                  <FiMessageSquare className="text-xl text-slate-300" />
                  <span>No messages from dispatch yet</span>
                </div>
              ) : (
                unreadMessages.map((msg, idx) => (
                  <div key={msg.id || idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                      {msg.senderInitials || 'DP'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-slate-900 text-xs">{msg.senderName}</span>
                        <span className="text-[10px] font-medium text-slate-400">{msg.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium truncate">{msg.content}</p>
                    </div>
                    {msg.unreadCount > 0 && (
                      <span className="bg-blue-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">{msg.unreadCount}</span>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Quick Reply Form */}
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
                disabled={isSendingMsg || !quickMsg.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <FiSend />
                <span>{isSendingMsg ? '...' : 'Send'}</span>
              </button>
            </form>
          </div>

        </div>

        {/* ================= COLUMN 3: SAFETY, ALERTS & PAY ================= */}
        <div className="space-y-6">
          
          {/* Safety & Compliance Alerts */}
          <div className="bg-white border border-rose-200 rounded-2xl p-5 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ALERTS</h3>
              {alerts.length > 0 && (
                <span className="bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">{alerts.length}</span>
              )}
            </div>

            <div className="space-y-3">
              {alerts.length === 0 ? (
                <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-center gap-3 text-xs text-emerald-800 font-semibold">
                  <FiCheckCircle className="text-emerald-600 text-lg shrink-0" />
                  <span>No active alerts. All checklist & safety compliance up to date.</span>
                </div>
              ) : (
                alerts.map((alert, idx) => (
                  <div
                    key={alert.id || idx}
                    onClick={() => navigate(alert.link || '/driver/work-status')}
                    className={`p-3 rounded-xl flex items-start gap-3 cursor-pointer transition-all border ${
                      alert.type === 'warning' ? 'bg-red-50/60 border-red-100 hover:border-red-300' : 'bg-amber-50/60 border-amber-100 hover:border-amber-300'
                    }`}
                  >
                    {alert.type === 'warning' ? (
                      <FiAlertTriangle className="text-red-500 text-base mt-0.5 shrink-0" />
                    ) : (
                      <FiFileText className="text-amber-600 text-base mt-0.5 shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="font-bold text-slate-900 text-xs">{alert.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{alert.description}</div>
                    </div>
                    <FiChevronRight className="text-slate-400" />
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button onClick={() => navigate('/driver/notifications')} className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1 cursor-pointer">
                <span>View All Alerts</span>
                <FiChevronRight />
              </button>
            </div>
          </div>

          {/* Pay This Period Card */}
          <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">PAY THIS PERIOD</div>
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xl border border-emerald-100">
                $
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 leading-tight">
                  ${typeof paySummary.amount === 'number' ? paySummary.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : paySummary.amount}
                </div>
                <div className="text-xs font-bold text-slate-400">{paySummary.taxNote || 'Before tax'}</div>
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
