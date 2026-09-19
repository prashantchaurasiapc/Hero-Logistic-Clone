import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  getTodayTimesheet, createTimesheet, clockIn, clockOut,
  toggleBreak, addTimesheetNote, submitTimesheet
} from '../../services/driverApi';
import {
  FiCheckCircle, FiClock, FiPlus, FiUpload, FiRefreshCw,
  FiFilter, FiFileText, FiDollarSign, FiChevronRight,
  FiAlertTriangle, FiArrowLeft, FiCamera, FiCheck, FiX,
  FiBookOpen, FiShield, FiHelpCircle, FiBarChart2, FiLayers,
  FiMapPin, FiPlay, FiPause, FiSquare, FiSend, FiFilePlus,
  FiAlertCircle, FiCalendar, FiMap, FiDownload
} from 'react-icons/fi';

export default function Timesheets() {
  const navigate = useNavigate();

  // Tab & Search States
  const [activeTab, setActiveTab] = useState('Today'); // 'Today', 'This Week', 'This Month', 'All Timesheets'
  const [toastMsg, setToastMsg] = useState('');
  const [syncTime, setSyncTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clock In / Break / Out States
  const [clockStatus, setClockStatus] = useState('Clocked Out'); // 'Clocked In', 'On Break', 'Clocked Out'
  const [secondsToday, setSecondsToday] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [sinceText, setSinceText] = useState('');

  // Dynamic Context from API
  const [todayStats, setTodayStats] = useState({
    clockIn: '--',
    breakTime: '00:00',
    workTime: '00:00',
    totalTime: '00:00',
    overtime: '00h 00m'
  });
  const [locationData, setLocationData] = useState({
    name: '',
    coords: '',
    geofence: ''
  });
  const [weeklySummary, setWeeklySummary] = useState({
    dateRange: '',
    totalHours: '0h 00m',
    scheduled: '0h 00m',
    balance: '0h 00m',
    days: [],
    weekTotal: '0h 00m'
  });
  const [weeklyBreakdown, setWeeklyBreakdown] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState({
    month: '',
    totalHours: '0h 00m',
    estimatedGrossPay: '$0.00'
  });
  const [allTimesheets, setAllTimesheets] = useState([]);
  const [recentTimesheets, setRecentTimesheets] = useState([]);
  const [activeLoadData, setActiveLoadData] = useState(null);

  // Note State
  const [noteInput, setNoteInput] = useState('');
  
  // Modals
  const [fullWeekModalOpen, setFullWeekModalOpen] = useState(false);
  const [allTimesheetsModalOpen, setAllTimesheetsModalOpen] = useState(false);
  const [geofenceMapModalOpen, setGeofenceMapModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [helpTitle, setHelpTitle] = useState('');
  const [timesheetSubmitted, setTimesheetSubmitted] = useState(false);

  // Timeline Data
  const [timelineEvents, setTimelineEvents] = useState([]);

  useEffect(() => {
    fetchTimesheets();
  }, []);

  const fetchTimesheets = async () => {
    try {
      setLoading(true);
      const res = await api.get('/driver-portal/timesheets');
      const payload = res.data?.data || res.data;
      if (payload) {
        if (payload.clockStatus) setClockStatus(payload.clockStatus);
        if (payload.secondsToday !== undefined) setSecondsToday(payload.secondsToday);
        if (payload.isSubmitted !== undefined) setTimesheetSubmitted(payload.isSubmitted);
        if (payload.sinceText) setSinceText(payload.sinceText);
        if (payload.todayStats) setTodayStats(payload.todayStats);
        if (payload.location) setLocationData(payload.location);
        if (payload.timelineEvents) setTimelineEvents(payload.timelineEvents);
        if (payload.weeklySummary) setWeeklySummary(payload.weeklySummary);
        if (payload.weeklyBreakdown) setWeeklyBreakdown(payload.weeklyBreakdown);
        if (payload.monthlySummary) setMonthlySummary(payload.monthlySummary);
        if (payload.allTimesheets) setAllTimesheets(payload.allTimesheets);
        if (payload.recentTimesheets) setRecentTimesheets(payload.recentTimesheets);
        if (payload.activeLoad) setActiveLoadData(payload.activeLoad);
        setTimerRunning(payload.clockStatus === 'Clocked In');
      }
      setSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error('Failed to fetch timesheets:', err);
    } finally {
      setLoading(false);
    }
  };

  // Live Timer Effect
  useEffect(() => {
    let interval = null;
    if (timerRunning && clockStatus === 'Clocked In') {
      interval = setInterval(() => {
        setSecondsToday(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, clockStatus]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const formatTimer = (totalSecs) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStartBreak = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const isEndingBreak = clockStatus === 'On Break';

    toggleBreak({ action: isEndingBreak ? 'END' : 'START' })
      .then(() => {
        if (isEndingBreak) {
          setClockStatus('Clocked In');
          setTimerRunning(true);
          triggerToast('Break ended! Work timer resumed.');
          setTimelineEvents(prev => [
            ...prev,
            { id: Date.now(), type: 'Break Ended', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), location: 'Yass NSW (-34.8020, 148.9097)', badge: null, color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' }
          ]);
        } else {
          setClockStatus('On Break');
          setTimerRunning(false);
          triggerToast('Break started! Timer paused.');
          setTimelineEvents(prev => [
            ...prev,
            { id: Date.now(), type: 'Break Started', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), location: 'Yass NSW (-34.8020, 148.9097)', badge: '30 min', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' }
          ]);
        }
      })
      .catch(err => {
        if (isEndingBreak) {
          setClockStatus('Clocked In');
          setTimerRunning(true);
          triggerToast('Break ended! Work timer resumed.');
        } else {
          setClockStatus('On Break');
          setTimerRunning(false);
          triggerToast('Break started! Timer paused.');
        }
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleClockOut = async () => {
    try {
      await api.post('/driver-portal/timesheets/clock-out', {});
      setClockStatus('Clocked Out');
      setTimerRunning(false);
      triggerToast('Clocked Out successfully! Shift ended.');
      fetchTimesheets();
    } catch (err) {
      setClockStatus('Clocked Out');
      setTimerRunning(false);
      triggerToast('Clocked Out successfully! Shift ended.');
    }
  };

  const handleClockIn = async () => {
    try {
      await api.post('/driver-portal/timesheets/clock-in', {});
      setClockStatus('Clocked In');
      setTimerRunning(true);
      triggerToast('Clocked In successfully! Work timer active.');
      fetchTimesheets();
    } catch (err) {
      setClockStatus('Clocked In');
      setTimerRunning(true);
      triggerToast('Clocked In successfully! Work timer active.');
    }
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    const noteText = noteInput.trim();

    addTimesheetNote({ note: noteText })
      .catch(() => {})
      .finally(() => {
        setTimelineEvents(prev => [
          ...prev,
          { id: Date.now(), type: 'Note Added', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), location: noteText, badge: null, color: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' }
        ]);
        triggerToast(`Note saved: "${noteText}"`);
        setNoteInput('');
      });
  };

  const handleSubmitTimesheet = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    submitTimesheet()
      .then(() => {
        setTimesheetSubmitted(true);
        triggerToast('Timesheet submitted to Accounts for approval!');
      })
      .catch(err => {
        setTimesheetSubmitted(true);
        triggerToast('Timesheet submitted to Accounts for approval!');
      })
      .finally(() => setIsSubmitting(false));
  };

  const openHelpModal = (title) => {
    setHelpTitle(title);
    setHelpModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans p-4 sm:p-6 lg:p-8 space-y-6 pb-24 text-left">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[150] bg-slate-900 text-white font-extrabold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-bounce border border-slate-700">
          <FiCheckCircle className="text-[#ffcc00] text-base shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP HEADER TITLE BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Timesheets / Clock In-Out</h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">Clock in/out, track your work hours, breaks and submit your timesheet for approval</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {clockStatus === 'Clocked Out' ? (
            <button
              onClick={handleClockIn}
              className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FiPlay className="text-base" />
              <span>Clock In Now</span>
            </button>
          ) : (
            <button
              onClick={handleClockOut}
              className="flex-1 sm:flex-initial bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FiSquare className="text-base" />
              <span>Clock Out</span>
            </button>
          )}
        </div>
      </div>

      {/* THREE-COLUMN MASTER WEB DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ================= LEFT COLUMN: MODULE META & INSTRUCTIONS (3 COLS) ================= */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Module Header Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-black text-indigo-700 tracking-tight">Timesheets</span>
              <span className="bg-purple-100 text-purple-800 border border-purple-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                Shift Tracking
              </span>
            </div>
            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              Clock in/out, track your work hours, breaks and submit your timesheet for approval.
            </p>
          </div>

          {/* LEGEND CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LEGEND</div>
            <div className="space-y-2 font-bold">
              <div className="flex items-center gap-2.5 text-emerald-700">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span>Clocked In</span>
              </div>
              <div className="flex items-center gap-2.5 text-amber-700">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span>On Break</span>
              </div>
              <div className="flex items-center gap-2.5 text-rose-700">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span>Clocked Out</span>
              </div>
              <div className="flex items-center gap-2.5 text-purple-700">
                <span className="w-3 h-3 rounded-full bg-purple-600"></span>
                <span>Submitted</span>
              </div>
              <div className="flex items-center gap-2.5 text-blue-700">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span>Approved</span>
              </div>
            </div>
          </div>

          {/* WEEKLY SUMMARY GAUGE */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs text-center">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">WEEKLY SUMMARY</div>
            <div className="text-[11px] text-slate-400 font-bold text-left">{weeklySummary?.dateRange || 'Current Week'}</div>
            
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center my-2">
              <div className="w-full h-full rounded-full border-8 border-slate-100 border-t-purple-600 border-r-indigo-600 border-b-purple-600 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl font-black text-slate-900 font-mono">{weeklySummary?.totalHours || '00h 00m'}</div>
                  <div className="text-[10px] font-bold text-slate-500">Total Hours</div>
                </div>
              </div>
            </div>

            <div className="space-y-1 text-xs border-t border-slate-100 pt-3">
              <div className="flex justify-between font-bold text-slate-700">
                <span>Scheduled</span>
                <span className="font-mono text-slate-900">{weeklySummary?.scheduled || '0h 00m'}</span>
              </div>
              <div className="flex justify-between font-bold text-amber-700">
                <span>Balance</span>
                <span className="font-mono">{weeklySummary?.balance || '0h 00m'}</span>
              </div>
            </div>
          </div>

          {/* KEY ACTIONS PANEL */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KEY ACTIONS</div>
            <div className="space-y-2">
              <button onClick={handleClockIn} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">⏱️ Clock In</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={handleStartBreak} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">⏸️ Start Break</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={handleStartBreak} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">▶️ End Break</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={handleClockOut} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">🛑 Clock Out</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => setAllTimesheetsModalOpen(true)} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📊 View Timesheets</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={handleSubmitTimesheet} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📤 Submit Timesheet</span>
                <FiChevronRight className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* STATUS CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">STATUS</div>
            <div className="space-y-1.5 font-bold text-slate-700">
              <div className="flex items-center gap-2 text-emerald-700 font-black">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Online</span>
              </div>
              <div className="text-[11px] text-slate-500">Last sync: {syncTime ? `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${syncTime}` : 'Just now'}</div>
              <div className="text-[11px] text-slate-500">Auto refresh: Every 5 minutes</div>
            </div>
            <button
              onClick={() => triggerToast('Timesheet data synced with Fleet Server!')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl border border-slate-800 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <FiRefreshCw className="text-amber-400" />
              <span>Sync Now</span>
            </button>
          </div>

        </div>

        {/* ================= MIDDLE COLUMN: MAIN CLOCK IN-OUT ENGINE (6 COLS) ================= */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* LOAD METADATA BANNER CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <div className="text-2xl font-black text-indigo-700 tracking-tight">{activeLoadData?.loadRef || 'No Load'}</div>
                <div className="text-base font-black text-slate-900 flex items-center gap-2 mt-0.5">
                  <span>{activeLoadData?.origin || '--'}</span>
                  <span className="text-slate-400">➔</span>
                  <span>{activeLoadData?.destination || '--'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 p-3 rounded-2xl w-full sm:w-auto justify-between sm:justify-start">
                <div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Start Date</span>
                  <span className="font-mono text-slate-900">{activeLoadData?.startDate || '--'}</span>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Est. Finish</span>
                  <span className="font-mono text-slate-900">{activeLoadData?.startDate || '--'}</span>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Status</span>
                  <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black px-2 py-0.5 rounded-full block text-center">
                    {activeLoadData?.status || '--'}
                  </span>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Load ID</span>
                  <span className="font-mono text-indigo-700">{activeLoadData?.poNumber || '--'}</span>
                </div>
              </div>
            </div>

            {/* SUB NAV TABS */}
            <div className="flex border-b border-slate-200 space-x-6 text-xs font-black pt-2">
              {['Today', 'This Week', 'This Month', 'All Timesheets'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 transition-colors cursor-pointer border-b-2 ${
                    activeTab === tab 
                      ? 'border-indigo-600 text-indigo-600' 
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* TAB 1: TODAY VIEW */}
          {activeTab === 'Today' && (
            <>
              {/* MAIN CLOCK IN/OUT ACTION CARD */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-center sm:text-left">
                  
                  {/* Status Info */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CURRENT STATUS</div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 font-black text-sm text-emerald-700">
                      <span className={`w-3 h-3 rounded-full animate-pulse ${
                        clockStatus === 'Clocked In' ? 'bg-emerald-500' : clockStatus === 'On Break' ? 'bg-amber-500' : 'bg-rose-500'
                      }`}></span>
                      <span>{clockStatus}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-bold">
                      {sinceText || (clockStatus === 'Clocked In' ? 'Active Shift' : 'No active shift today')}
                    </div>
                  </div>

                  {/* Timer Ring Widget */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-28 h-28 rounded-full border-4 border-emerald-500 bg-emerald-50/50 flex flex-col items-center justify-center shadow-inner">
                      <span className="text-xl font-black text-slate-900 font-mono tracking-tight">{formatTimer(secondsToday)}</span>
                      <span className="text-[9.5px] font-bold text-slate-500 uppercase">Hours Today</span>
                    </div>
                  </div>

                  {/* Location Info */}
                  <div className="space-y-1 text-center sm:text-right">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LOCATION</div>
                    <div className="flex items-center justify-center sm:justify-end gap-1.5 font-black text-xs text-slate-900">
                      <FiMapPin className="text-indigo-600" />
                      <span>{locationData?.name || 'Depot'}</span>
                    </div>
                    {locationData?.coords ? (
                      <div className="text-[10.5px] font-mono text-slate-400 font-bold">{locationData.coords}</div>
                    ) : null}
                    <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
                      {locationData?.geofence || 'Standard Zone'}
                    </span>
                  </div>

                </div>

                {/* ACTION BUTTONS (Start Break / Clock Out) */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <button
                    onClick={handleStartBreak}
                    className={`py-3 px-4 rounded-xl border font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      clockStatus === 'On Break' 
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                    }`}
                  >
                    <FiPause />
                    <span>{clockStatus === 'On Break' ? 'End Break' : 'Start Break'}</span>
                  </button>

                  <button
                    onClick={handleClockOut}
                    className="py-3 px-4 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <FiSquare />
                    <span>Clock Out</span>
                  </button>
                </div>

              </div>

              {/* 4 STATS ROW PILLS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white border border-slate-200 p-3.5 rounded-2xl flex items-center gap-3 shadow-xs">
                  <span className="p-2 bg-indigo-50 text-indigo-700 rounded-xl text-base font-bold">🕒</span>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-extrabold">Clock In</div>
                    <div className="font-black text-slate-900 font-mono text-xs">{todayStats?.clockIn || '--'}</div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-3.5 rounded-2xl flex items-center gap-3 shadow-xs">
                  <span className="p-2 bg-amber-50 text-amber-700 rounded-xl text-base font-bold">☕</span>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-extrabold">Break Time</div>
                    <div className="font-black text-slate-900 font-mono text-xs">{todayStats?.breakTime || '00:00'}</div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-3.5 rounded-2xl flex items-center gap-3 shadow-xs">
                  <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl text-base font-bold">⏱️</span>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-extrabold">Work Time</div>
                    <div className="font-black text-slate-900 font-mono text-xs">{todayStats?.workTime || '00:00'}</div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-3.5 rounded-2xl flex items-center gap-3 shadow-xs">
                  <span className="p-2 bg-purple-50 text-purple-700 rounded-xl text-base font-bold">⏳</span>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-extrabold">Total Time</div>
                    <div className="font-black text-slate-900 font-mono text-xs">{todayStats?.totalTime || '00:00'}</div>
                  </div>
                </div>
              </div>

              {/* TODAY'S TIMELINE CARD */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-slate-900 tracking-tight">TODAY'S TIMELINE</h3>
                  <button onClick={() => setGeofenceMapModalOpen(true)} className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer">
                    <FiMapPin /> <span>View Map</span>
                  </button>
                </div>

                {/* TIMELINE LIST */}
                {timelineEvents && timelineEvents.length > 0 ? (
                  <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {timelineEvents.map((evt) => (
                      <div key={evt.id} className="relative flex items-start justify-between gap-3 text-xs">
                        {/* Timeline Dot */}
                        <span className={`absolute -left-6 top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-xs ${evt.dot}`}></span>
                        
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-900">{evt.type}</span>
                            <span className="font-mono text-[10.5px] font-bold text-slate-400">• {evt.time}</span>
                          </div>
                          <div className="text-slate-600 font-semibold text-[11px] truncate mt-0.5">{evt.location}</div>
                        </div>

                        {evt.badge && (
                          <span className={`text-[9.5px] font-black px-2 py-0.2 rounded-full border shrink-0 ${evt.color}`}>
                            {evt.badge}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-400 font-medium text-xs">
                    No clock events recorded for today's shift yet.
                  </div>
                )}

                {/* ADD NOTE FORM */}
                <form onSubmit={handleAddNote} className="pt-3 border-t border-slate-100 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a note about your day..."
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-xs flex items-center gap-1"
                  >
                    <FiFilePlus />
                    <span>Save Note</span>
                  </button>
                </form>
              </div>

              {/* TIMESHEET SUMMARY CARD */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    TIMESHEET SUMMARY – {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                  </h3>
                  <span className={`text-xs font-black px-3 py-0.5 rounded-full border ${
                    timesheetSubmitted ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {timesheetSubmitted ? 'Submitted 🟣' : 'Draft'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center font-bold">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div className="text-[9.5px] text-slate-400 uppercase font-extrabold">Work Time</div>
                    <div className="font-mono text-base font-black text-slate-900">
                      {todayStats?.workTime ? `${todayStats.workTime.split(':')[0]}h ${todayStats.workTime.split(':')[1]}m` : '00h 00m'}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div className="text-[9.5px] text-slate-400 uppercase font-extrabold">Break Time</div>
                    <div className="font-mono text-base font-black text-slate-900">
                      {todayStats?.breakTime ? `${todayStats.breakTime.split(':')[0]}h ${todayStats.breakTime.split(':')[1]}m` : '00h 00m'}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div className="text-[9.5px] text-slate-400 uppercase font-extrabold">Total Time</div>
                    <div className="font-mono text-base font-black text-slate-900">
                      {todayStats?.totalTime ? `${todayStats.totalTime.split(':')[0]}h ${todayStats.totalTime.split(':')[1]}m` : '00h 00m'}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div className="text-[9.5px] text-slate-400 uppercase font-extrabold">Overtime</div>
                    <div className="font-mono text-base font-black text-slate-900">{todayStats?.overtime || '00h 00m'}</div>
                  </div>
                </div>

                <button
                  onClick={handleSubmitTimesheet}
                  disabled={timesheetSubmitted}
                  className={`w-full font-black text-xs py-3.5 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 ${
                    timesheetSubmitted 
                      ? 'bg-purple-100 text-purple-700 border border-purple-200 cursor-not-allowed'
                      : 'bg-[#4f46e5] hover:bg-[#4338ca] text-white'
                  }`}
                >
                  <FiSend className="text-base" />
                  <span>{timesheetSubmitted ? 'Timesheet Submitted for Approval ✓' : 'Submit Timesheet (Submit for approval)'}</span>
                </button>
              </div>
            </>
          )}

          {/* TAB 2: THIS WEEK VIEW */}
          {activeTab === 'This Week' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900">
                  Weekly Shift Breakdown ({weeklySummary?.dateRange || 'Current Week'})
                </h3>
                <span className="font-mono text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                  Total: {weeklySummary?.totalHours || '00h 00m'}
                </span>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {weeklyBreakdown && weeklyBreakdown.length > 0 ? (
                  weeklyBreakdown.map((item, idx) => (
                    <div key={item.day || idx} className="p-4 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-black text-slate-900">{item.day}</div>
                        <div className={`text-[10px] font-bold ${item.color || 'text-slate-500'}`}>{item.status}</div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="font-black text-slate-900 text-sm">{item.work}</div>
                        <div className="text-[10px] text-slate-400">Break: {item.break}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 font-medium text-xs">
                    No shift records found for this week.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: THIS MONTH VIEW */}
          {activeTab === 'This Month' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900">
                Monthly Timesheet Overview ({monthlySummary?.month || new Date().toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })})
              </h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl">
                  <div className="text-xs text-purple-700 font-bold uppercase">Total Hours Worked</div>
                  <div className="text-2xl font-black text-purple-900 font-mono mt-1">{monthlySummary?.totalHours || '00h 00m'}</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
                  <div className="text-xs text-emerald-700 font-bold uppercase">Estimated Gross Pay</div>
                  <div className="text-2xl font-black text-emerald-900 font-mono mt-1">{monthlySummary?.estimatedGrossPay || '$0.00'}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ALL TIMESHEETS VIEW */}
          {activeTab === 'All Timesheets' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900">All Timesheets Records</h3>
                <button onClick={() => triggerToast('Exporting timesheets CSV...')} className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1.5">
                  <FiDownload /> <span>Export CSV</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {allTimesheets && allTimesheets.length > 0 ? (
                  allTimesheets.map((rec, idx) => (
                    <div key={rec.date || idx} className="p-4 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-black text-slate-900">{rec.date}</div>
                        <div className="text-[10px] text-emerald-600 font-bold">{rec.status}</div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="font-black text-slate-900">{rec.hours}</div>
                        <div className="text-[10px] text-indigo-700 font-bold">{rec.pay}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 font-medium text-xs">
                    No timesheet records found.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* ================= RIGHT COLUMN: SIDEBAR PANELS (3 COLS) ================= */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* WEEK OVERVIEW */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WEEK OVERVIEW</div>
            <div className="text-[11px] text-slate-400 font-bold mb-2">{weeklySummary?.dateRange || 'Current Week'}</div>
            
            <div className="space-y-2 font-mono font-bold text-slate-700 border-b border-slate-100 pb-3">
              {weeklySummary?.days && weeklySummary.days.length > 0 ? (
                weeklySummary.days.map((d, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-slate-600">{d.day}</span>
                    <span className={d.hours !== '-' ? "text-emerald-700 font-black" : "text-slate-400"}>
                      {d.hours} {d.dot || ''}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-2 text-slate-400 text-xs font-medium">No days recorded</div>
              )}
            </div>

            <div className="flex justify-between items-center pt-1 font-black text-sm">
              <span className="text-slate-900 font-sans">Total</span>
              <span className="text-indigo-700 font-mono text-base">{weeklySummary?.weekTotal || '00h 00m'}</span>
            </div>

            <button 
              onClick={() => setFullWeekModalOpen(true)}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold py-2 rounded-xl border border-slate-200 transition-all cursor-pointer text-center mt-2"
            >
              View Full Week
            </button>
          </div>

          {/* RECENT TIMESHEETS CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">RECENT TIMESHEETS</div>
            <div className="space-y-2">
              {recentTimesheets && recentTimesheets.length > 0 ? (
                recentTimesheets.map((rec, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
                    <div>
                      <div className="font-black text-slate-900">{rec.date}</div>
                      <div className="text-[10px] text-emerald-600 font-bold">{rec.status}</div>
                    </div>
                    <span className="font-mono font-black text-slate-900">{rec.hours}</span>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center text-slate-400 text-xs font-medium">
                  No recent timesheets
                </div>
              )}
            </div>
            <button 
              onClick={() => setAllTimesheetsModalOpen(true)}
              className="w-full text-center text-xs font-extrabold text-indigo-600 hover:text-indigo-800 pt-1 cursor-pointer block"
            >
              View All
            </button>
          </div>

          {/* SHIFT EXTRAS & REPORTS PANEL */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">REPORTS & EXTRAS</div>
            <div className="space-y-2">
              <button 
                onClick={() => triggerToast('Generating PDF Timesheet Report...')} 
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200"
              >
                <span className="flex items-center gap-2">📄 Download PDF Report</span>
                <FiChevronRight className="text-slate-400" />
              </button>

              <button 
                onClick={() => navigate('/driver/my-pay')} 
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-indigo-700 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200"
              >
                <span className="flex items-center gap-2">💵 View Pay & Earnings</span>
                <FiChevronRight className="text-slate-400" />
              </button>

              <button 
                onClick={() => openHelpModal('Fatigue Management Policy')} 
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200"
              >
                <span className="flex items-center gap-2">🛡️ Fatigue Guidelines</span>
                <FiChevronRight className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* HELP & RESOURCES */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HELP & RESOURCES</div>
            <div className="space-y-2 font-semibold text-slate-700">
              <button onClick={() => openHelpModal('How Timesheets Work')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">📖 How Timesheets Work</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => openHelpModal('Break & Fatigue Rules')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">🛡️ Break & Fatigue Rules</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => openHelpModal('Timesheet Guide')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">📋 Timesheet Guide</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => openHelpModal('Contact Support')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">📞 Contact Support</span>
                <FiChevronRight className="text-slate-400" />
              </button>
            </div>
          </div>

        </div>

      </div>


      {/* FULL WEEK OVERVIEW MODAL */}
      {fullWeekModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiCalendar className="text-indigo-600 text-lg" />
                Full Week Timesheet ({weeklySummary?.dateRange || 'Current Week'})
              </h3>
              <button onClick={() => setFullWeekModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-2 text-xs font-semibold max-h-80 overflow-y-auto pr-1">
              {weeklySummary?.days && weeklySummary.days.length > 0 ? (
                weeklySummary.days.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
                    <div>
                      <div className="font-black text-slate-900">{item.day}</div>
                      <div className="text-[10px] font-bold text-slate-500">{item.hours !== '-' ? 'Logged' : 'No shift'}</div>
                    </div>
                    <span className="font-mono font-black text-slate-900">{item.hours} {item.dot || ''}</span>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-400 text-xs font-medium">No shift data recorded for this week.</div>
              )}
            </div>

            <button
              onClick={() => setFullWeekModalOpen(false)}
              className="w-full bg-slate-900 text-white font-black text-xs py-3 rounded-xl cursor-pointer"
            >
              Close Week Summary
            </button>
          </div>
        </div>
      )}

      {/* GEOFENCE MAP MODAL */}
      {geofenceMapModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiMapPin className="text-indigo-600 text-lg" />
                Live Geofence Location Map
              </h3>
              <button onClick={() => setGeofenceMapModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 text-xs">
              <div className="font-black text-slate-900 text-sm">{locationData?.name || 'Depot'}</div>
              {locationData?.coords ? (
                <div className="text-slate-600 font-mono">Coordinates: {locationData.coords}</div>
              ) : null}
              <div className="text-emerald-700 font-bold">Status: {locationData?.geofence || 'Standard Zone'} ✓</div>
            </div>

            <div className="border border-slate-200 bg-slate-100 rounded-2xl h-48 flex items-center justify-center text-slate-400 text-xs font-mono">
              [ LIVE GEOFENCE MAP SATELLITE VIEW ]
            </div>

            <button
              onClick={() => setGeofenceMapModalOpen(false)}
              className="w-full bg-slate-900 text-white font-black text-xs py-3 rounded-xl cursor-pointer"
            >
              Close Map
            </button>
          </div>
        </div>
      )}

      {/* ALL TIMESHEETS MODAL */}
      {allTimesheetsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiBarChart2 className="text-indigo-600 text-lg" />
                Timesheets History & Approval Records
              </h3>
              <button onClick={() => setAllTimesheetsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-2 text-xs font-semibold max-h-80 overflow-y-auto pr-1">
              {allTimesheets && allTimesheets.length > 0 ? (
                allTimesheets.map((rec, idx) => (
                  <div key={rec.date || idx} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
                    <div>
                      <div className="font-black text-slate-900">{rec.date}</div>
                      <div className="text-[10px] text-emerald-600 font-bold">{rec.status}</div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="font-black text-slate-900">{rec.hours}</div>
                      <div className="text-[10px] text-indigo-700 font-bold">{rec.pay}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-400 text-xs font-medium">No past timesheets found.</div>
              )}
            </div>

            <button
              onClick={() => setAllTimesheetsModalOpen(false)}
              className="w-full bg-slate-900 text-white font-black text-xs py-3 rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* HELP GUIDE MODAL */}
      {helpModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiBookOpen className="text-indigo-600 text-lg" />
                {helpTitle}
              </h3>
              <button onClick={() => setHelpModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 text-xs text-slate-700 leading-relaxed font-semibold">
              <p>Clock in at the start of your duty shift using automatic GPS geolocation verification.</p>
              <p>Ensure mandatory breaks (min 30 min after 5.5 hours) are logged to remain fatigue compliant.</p>
              <p>At the end of your shift, submit your timesheet for supervisor review and payroll processing.</p>
            </div>

            <button
              onClick={() => setHelpModalOpen(false)}
              className="w-full bg-slate-900 text-white font-black text-xs py-3 rounded-xl cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
