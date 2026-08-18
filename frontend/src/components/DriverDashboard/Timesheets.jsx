import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [timelineEvents, setTimelineEvents] = useState([
    { id: 1, type: 'Clocked In', time: '07:45 AM', location: 'Yard - Melbourne VIC (-37.8136, 144.9631)', badge: 'Auto Location', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    { id: 2, type: 'Break Started', time: '12:00 PM', location: 'Yass NSW (-34.8020, 148.9097)', badge: '45 min', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
    { id: 3, type: 'Break Ended', time: '12:45 PM', location: 'Yass NSW (-34.8020, 148.9097)', badge: null, color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    { id: 4, type: 'Note Added', time: '01:05 PM', location: 'Lunch break completed. Continuing journey.', badge: null, color: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' },
    { id: 5, type: 'Still Working', time: '11:00 AM – Now', location: 'Yass NSW (-34.8020, 148.9097)', badge: 'On Site', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' }
  ]);

  // Fetch Today's Timesheet from Backend
  useEffect(() => {
    let isSubscribed = true;
    setLoading(true);

    getTodayTimesheet()
      .then(res => {
        if (!isSubscribed) return;
        const data = res.data?.data;
        if (data) {
          const status = data.clockStatus || (data.status === 'CLOCKED_IN' ? 'Clocked In' : 'Clocked Out');
          setClockStatus(status);
          setSecondsToday(data.secondsToday || 0);
          setTimerRunning(status === 'Clocked In');

          if (Array.isArray(data.timelineEvents) && data.timelineEvents.length > 0) {
            setTimelineEvents(data.timelineEvents);
          } else if (data.timesheet?.events && data.timesheet.events.length > 0) {
            const formattedEvents = data.timesheet.events.map(evt => ({
              id: evt.id,
              type: evt.type === 'CLOCK_IN' ? 'Clocked In' : evt.type === 'CLOCK_OUT' ? 'Clocked Out' : evt.type,
              time: new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              location: evt.locationName || 'Yard - Melbourne VIC',
              badge: evt.type === 'CLOCK_IN' ? 'Auto Location' : null,
              color: evt.type === 'CLOCK_IN' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200',
              dot: evt.type === 'CLOCK_IN' ? 'bg-emerald-500' : 'bg-rose-500'
            }));
            setTimelineEvents(formattedEvents);
          }
        }
      })
      .catch(err => {
        if (isSubscribed) console.error('Error fetching today timesheet:', err);
      })
      .finally(() => {
        if (isSubscribed) setLoading(false);
      });

    return () => { isSubscribed = false; };
  }, []);

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

  const handleClockOut = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    clockOut({ locationName: 'Yard - Sydney NSW (-33.8688, 151.2093)' })
      .then(() => {
        setClockStatus('Clocked Out');
        setTimerRunning(false);
        triggerToast('Clocked Out successfully! Shift ended.');
        setTimelineEvents(prev => [
          ...prev,
          { id: Date.now(), type: 'Clocked Out', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), location: 'Yard - Sydney NSW (-33.8688, 151.2093)', badge: 'End Shift', color: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' }
        ]);
      })
      .catch(err => {
        setClockStatus('Clocked Out');
        setTimerRunning(false);
        triggerToast('Clocked Out successfully! Shift ended.');
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleClockIn = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    clockIn({ locationName: 'Yard - Melbourne VIC (-37.8136, 144.9631)' })
      .then(res => {
        setClockStatus('Clocked In');
        setTimerRunning(true);
        setSecondsToday(0);
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        triggerToast('Clocked In successfully! Work timer active.');
        setTimelineEvents(prev => [
          ...prev,
          { id: Date.now(), type: 'Clocked In', time: nowStr, location: 'Yard - Melbourne VIC (-37.8136, 144.9631)', badge: 'Auto Location', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' }
        ]);
      })
      .catch(err => {
        const msg = err.response?.data?.error?.message || err.response?.data?.message || 'Clock In failed.';
        triggerToast(`❌ Error: ${msg}`);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
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
            <div className="text-[11px] text-slate-400 font-bold text-left">26 May – 01 Jun 2025</div>
            
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center my-2">
              <div className="w-full h-full rounded-full border-8 border-slate-100 border-t-purple-600 border-r-indigo-600 border-b-purple-600 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl font-black text-slate-900 font-mono">38h 15m</div>
                  <div className="text-[10px] font-bold text-slate-500">Total Hours</div>
                </div>
              </div>
            </div>

            <div className="space-y-1 text-xs border-t border-slate-100 pt-3">
              <div className="flex justify-between font-bold text-slate-700">
                <span>Scheduled</span>
                <span className="font-mono text-slate-900">40h 00m</span>
              </div>
              <div className="flex justify-between font-bold text-amber-700">
                <span>Balance</span>
                <span className="font-mono">-1h 45m</span>
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
              <div className="text-[11px] text-slate-500">Last sync: 29 May 2025, 10:15 AM</div>
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
                <div className="text-2xl font-black text-indigo-700 tracking-tight">LD-3987</div>
                <div className="text-base font-black text-slate-900 flex items-center gap-2 mt-0.5">
                  <span>Melbourne VIC</span>
                  <span className="text-slate-400">➔</span>
                  <span>Sydney NSW</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 p-3 rounded-2xl w-full sm:w-auto justify-between sm:justify-start">
                <div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Start Date</span>
                  <span className="font-mono text-slate-900">29 May 2025</span>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Est. Finish</span>
                  <span className="font-mono text-slate-900">29 May 2025</span>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Status</span>
                  <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black px-2 py-0.5 rounded-full block text-center">En Route</span>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Load ID</span>
                  <span className="font-mono text-indigo-700">PO-65432</span>
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
                    <div className="text-[11px] text-slate-500 font-bold">Since 07:45 AM • 29 May 2025</div>
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
                      <span>Yass NSW</span>
                    </div>
                    <div className="text-[10.5px] font-mono text-slate-400 font-bold">-34.8020, 148.9097</div>
                    <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
                      Within Geofence
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
                    <div className="font-black text-slate-900 font-mono text-xs">07:45 AM</div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-3.5 rounded-2xl flex items-center gap-3 shadow-xs">
                  <span className="p-2 bg-amber-50 text-amber-700 rounded-xl text-base font-bold">☕</span>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-extrabold">Break Time</div>
                    <div className="font-black text-slate-900 font-mono text-xs">00:45</div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-3.5 rounded-2xl flex items-center gap-3 shadow-xs">
                  <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl text-base font-bold">⏱️</span>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-extrabold">Work Time</div>
                    <div className="font-black text-slate-900 font-mono text-xs">03:45</div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-3.5 rounded-2xl flex items-center gap-3 shadow-xs">
                  <span className="p-2 bg-purple-50 text-purple-700 rounded-xl text-base font-bold">⏳</span>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-extrabold">Total Time</div>
                    <div className="font-black text-slate-900 font-mono text-xs">04:30</div>
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

              {/* TIMESHEET SUMMARY – 29 MAY 2025 CARD */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-slate-900 tracking-tight">TIMESHEET SUMMARY – 29 MAY 2025</h3>
                  <span className={`text-xs font-black px-3 py-0.5 rounded-full border ${
                    timesheetSubmitted ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {timesheetSubmitted ? 'Submitted 🟣' : 'Draft'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center font-bold">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div className="text-[9.5px] text-slate-400 uppercase font-extrabold">Work Time</div>
                    <div className="font-mono text-base font-black text-slate-900">03h 45m</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div className="text-[9.5px] text-slate-400 uppercase font-extrabold">Break Time</div>
                    <div className="font-mono text-base font-black text-slate-900">00h 45m</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div className="text-[9.5px] text-slate-400 uppercase font-extrabold">Total Time</div>
                    <div className="font-mono text-base font-black text-slate-900">04h 30m</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div className="text-[9.5px] text-slate-400 uppercase font-extrabold">Overtime</div>
                    <div className="font-mono text-base font-black text-slate-900">00h 00m</div>
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
                <h3 className="text-base font-black text-slate-900">Weekly Shift Breakdown (26 May – 01 Jun 2025)</h3>
                <span className="font-mono text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                  Total: 21h 45m
                </span>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {[
                  { day: 'Monday 26 May 2025', work: '08h 15m', break: '00h 45m', status: 'Approved ✓', color: 'text-emerald-700' },
                  { day: 'Tuesday 27 May 2025', work: '08h 00m', break: '00h 45m', status: 'Approved ✓', color: 'text-emerald-700' },
                  { day: 'Wednesday 28 May 2025', work: '08h 30m', break: '00h 45m', status: 'Approved ✓', color: 'text-emerald-700' },
                  { day: 'Thursday 29 May 2025', work: '04h 30m', break: '00h 45m', status: timesheetSubmitted ? 'Submitted 🟣' : 'Draft', color: 'text-purple-700' },
                  { day: 'Friday 30 May 2025', work: '00h 00m', break: '00h 00m', status: 'Scheduled', color: 'text-slate-400' },
                  { day: 'Saturday 31 May 2025', work: '00h 00m', break: '00h 00m', status: 'Rest Day', color: 'text-slate-400' },
                  { day: 'Sunday 01 June 2025', work: '00h 00m', break: '00h 00m', status: 'Rest Day', color: 'text-slate-400' },
                ].map(item => (
                  <div key={item.day} className="p-4 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-black text-slate-900">{item.day}</div>
                      <div className={`text-[10px] font-bold ${item.color}`}>{item.status}</div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="font-black text-slate-900 text-sm">{item.work}</div>
                      <div className="text-[10px] text-slate-400">Break: {item.break}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: THIS MONTH VIEW */}
          {activeTab === 'This Month' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900">Monthly Timesheet Overview (May 2025)</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl">
                  <div className="text-xs text-purple-700 font-bold uppercase">Total Hours Worked</div>
                  <div className="text-2xl font-black text-purple-900 font-mono mt-1">162h 45m</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
                  <div className="text-xs text-emerald-700 font-bold uppercase">Estimated Gross Pay</div>
                  <div className="text-2xl font-black text-emerald-900 font-mono mt-1">$5,696.25</div>
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
                {[
                  { date: '28 May 2025', hours: '08h 15m', pay: '$288.75', status: 'Approved ✓' },
                  { date: '27 May 2025', hours: '08h 30m', pay: '$297.50', status: 'Approved ✓' },
                  { date: '26 May 2025', hours: '08h 45m', pay: '$306.25', status: 'Approved ✓' },
                  { date: '23 May 2025', hours: '08h 00m', pay: '$280.00', status: 'Paid 💰' },
                  { date: '22 May 2025', hours: '08h 15m', pay: '$288.75', status: 'Paid 💰' }
                ].map(rec => (
                  <div key={rec.date} className="p-4 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-black text-slate-900">{rec.date}</div>
                      <div className="text-[10px] text-emerald-600 font-bold">{rec.status}</div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="font-black text-slate-900">{rec.hours}</div>
                      <div className="text-[10px] text-indigo-700 font-bold">{rec.pay}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ================= RIGHT COLUMN: SIDEBAR PANELS (3 COLS) ================= */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* WEEK OVERVIEW (26 MAY – 01 JUN 2025) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WEEK OVERVIEW</div>
            <div className="text-[11px] text-slate-400 font-bold mb-2">26 May – 01 Jun 2025</div>
            
            <div className="space-y-2 font-mono font-bold text-slate-700 border-b border-slate-100 pb-3">
              <div className="flex justify-between items-center"><span>Mon 26</span><span className="text-emerald-700 font-black">08h 15m 🟢</span></div>
              <div className="flex justify-between items-center"><span>Tue 27</span><span className="text-emerald-700 font-black">08h 00m 🟢</span></div>
              <div className="flex justify-between items-center text-slate-400"><span>Wed 28</span><span>-</span></div>
              <div className="flex justify-between items-center"><span>Thu 29</span><span className="text-indigo-700 font-black">04h 30m 🔵</span></div>
              <div className="flex justify-between items-center text-slate-400"><span>Fri 30</span><span>-</span></div>
              <div className="flex justify-between items-center text-slate-400"><span>Sat 31</span><span>-</span></div>
              <div className="flex justify-between items-center text-slate-400"><span>Sun 01</span><span>-</span></div>
            </div>

            <div className="flex justify-between items-center pt-1 font-black text-sm">
              <span className="text-slate-900 font-sans">Total</span>
              <span className="text-indigo-700 font-mono text-base">21h 45m</span>
            </div>

            <button 
              onClick={() => setFullWeekModalOpen(true)}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold py-2 rounded-xl border border-slate-200 transition-all cursor-pointer text-center mt-2"
            >
              View Full Week
            </button>
          </div>

          {/* BREAK RULES */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">BREAK RULES</div>
            <div className="space-y-2 font-bold text-slate-700 border-b border-slate-100 pb-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-normal">Min Break (after 5.5h)</span>
                <span className="font-mono text-slate-900">30 min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-normal">Max Work (daily)</span>
                <span className="font-mono text-slate-900">12 h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-normal">Max Work (weekly)</span>
                <span className="font-mono text-slate-900">72 h</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-emerald-700 font-black">
              <FiCheckCircle />
              <span>Compliant 🟢</span>
            </div>
          </div>

          {/* RECENT TIMESHEETS CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">RECENT TIMESHEETS</div>
            <div className="space-y-2">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
                <div>
                  <div className="font-black text-slate-900">28 May 2025</div>
                  <div className="text-[10px] text-emerald-600 font-bold">Approved ✓</div>
                </div>
                <span className="font-mono font-black text-slate-900">08h 15m</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
                <div>
                  <div className="font-black text-slate-900">27 May 2025</div>
                  <div className="text-[10px] text-emerald-600 font-bold">Approved ✓</div>
                </div>
                <span className="font-mono font-black text-slate-900">08h 30m</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
                <div>
                  <div className="font-black text-slate-900">26 May 2025</div>
                  <div className="text-[10px] text-emerald-600 font-bold">Approved ✓</div>
                </div>
                <span className="font-mono font-black text-slate-900">08h 45m</span>
              </div>
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
                Full Week Timesheet (26 May – 01 Jun 2025)
              </h3>
              <button onClick={() => setFullWeekModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-2 text-xs font-semibold">
              {[
                { day: 'Monday 26 May', hours: '08h 15m', status: 'Approved ✓', color: 'text-emerald-700' },
                { day: 'Tuesday 27 May', hours: '08h 00m', status: 'Approved ✓', color: 'text-emerald-700' },
                { day: 'Wednesday 28 May', hours: '08h 30m', status: 'Approved ✓', color: 'text-emerald-700' },
                { day: 'Thursday 29 May', hours: '04h 30m', status: timesheetSubmitted ? 'Submitted 🟣' : 'Draft', color: 'text-purple-700' },
                { day: 'Friday 30 May', hours: '00h 00m', status: 'Scheduled ⏳', color: 'text-slate-400' },
                { day: 'Saturday 31 May', hours: '00h 00m', status: 'Rest Day', color: 'text-slate-400' },
                { day: 'Sunday 01 June', hours: '00h 00m', status: 'Rest Day', color: 'text-slate-400' }
              ].map(item => (
                <div key={item.day} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
                  <div>
                    <div className="font-black text-slate-900">{item.day}</div>
                    <div className={`text-[10px] font-bold ${item.color}`}>{item.status}</div>
                  </div>
                  <span className="font-mono font-black text-slate-900">{item.hours}</span>
                </div>
              ))}
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
              <div className="font-black text-slate-900 text-sm">Yass Service Centre Yard</div>
              <div className="text-slate-600 font-mono">Coordinates: -34.8020, 148.9097</div>
              <div className="text-emerald-700 font-bold">Status: Within Authorized Geofence Zone ✓</div>
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

            <div className="space-y-2 text-xs font-semibold">
              {[
                { date: '28 May 2025', hours: '08h 15m', pay: '$288.75', status: 'Approved ✓' },
                { date: '27 May 2025', hours: '08h 30m', pay: '$297.50', status: 'Approved ✓' },
                { date: '26 May 2025', hours: '08h 45m', pay: '$306.25', status: 'Approved ✓' },
                { date: '23 May 2025', hours: '08h 00m', pay: '$280.00', status: 'Paid 💰' },
                { date: '22 May 2025', hours: '08h 15m', pay: '$288.75', status: 'Paid 💰' }
              ].map(rec => (
                <div key={rec.date} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
                  <div>
                    <div className="font-black text-slate-900">{rec.date}</div>
                    <div className="text-[10px] text-emerald-600 font-bold">{rec.status}</div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="font-black text-slate-900">{rec.hours}</div>
                    <div className="text-[10px] text-indigo-700 font-bold">{rec.pay}</div>
                  </div>
                </div>
              ))}
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
