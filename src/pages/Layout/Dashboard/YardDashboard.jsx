import React, { useState, useEffect, useRef } from 'react';
import './WarehouseDashboard.css';
import './YardDashboard.css';

// SVG Icons
const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const MapPinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const QrCodeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const AlertTriangleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const NavigationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
  </svg>
);

const TruckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"></rect>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
    <circle cx="5.5" cy="18.5" r="2.5"></circle>
    <circle cx="18.5" cy="18.5" r="2.5"></circle>
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const SyncIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"></polyline>
    <polyline points="1 20 1 14 7 14"></polyline>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

export default function YardDashboard() {
  const [shiftActive, setShiftActive] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timerString, setTimerString] = useState('00:00:00');

  // Hover states for top stats cards
  const [hoveredStatCard, setHoveredStatCard] = useState(null);

  // Hover states for bottom action cards
  const [hoveredActionCard, setHoveredActionCard] = useState(null);

  // Hover state for outline buttons
  const [hoveredButtonId, setHoveredButtonId] = useState(null);

  // Modals state
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showYardMapModal, setShowYardMapModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showNotePopup, setShowNotePopup] = useState(false);
  const [showSupervisorModal, setShowSupervisorModal] = useState(false);

  // Form states
  const [scanType, setScanType] = useState('Trailer');
  const [scannedId, setScannedId] = useState('');
  const [incidentType, setIncidentType] = useState('Accident');
  const [incidentLocation, setIncidentLocation] = useState('');
  const [incidentDescription, setIncidentDescription] = useState('');
  const [incidentSeverity, setIncidentSeverity] = useState('Medium');
  const [currentStatus, setCurrentStatus] = useState('Off Duty');
  const [statusNotes, setStatusNotes] = useState('');
  const [supervisorMessage, setSupervisorMessage] = useState('');

  // Task states
  const [selectedTask, setSelectedTask] = useState(null);
  const [noteTaskId, setNoteTaskId] = useState(null);
  const [noteText, setNoteText] = useState('');

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Spot Trailer TR-9410 to Gate 4',
      priority: 'High',
      status: 'PENDING',
      desc: 'Dock unloading request from warehouse team',
      time: '14:00',
      gate: 'Gate 4',
      unit: 'TR-9410',
      notes: ''
    },
    {
      id: 2,
      title: 'Audit Seal locks for TR-1102',
      priority: 'High',
      status: 'IN_PROGRESS',
      desc: 'Verify container security codes before departure',
      time: '15:30',
      gate: 'Gate 2',
      unit: 'TR-1102',
      notes: ''
    },
    {
      id: 3,
      title: 'Check damage report for TR-4809',
      priority: 'Medium',
      status: 'COMPLETED',
      desc: 'Verify reported rear bumper dent specs',
      time: '12:00',
      gate: 'Gate 1',
      unit: 'TR-4809',
      notes: 'Minor surface scratch noted.'
    }
  ]);

  // Notification states
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Task Assigned',
      desc: 'Spot Trailer TR-5540 to Gate 1 by 15:00',
      time: '2 min ago',
      unread: true,
      type: 'task'
    },
    {
      id: 2,
      title: 'Supervisor Message',
      desc: 'Keep Gate 3 clear — heavy inbound scheduled at 14:30.',
      time: '10 min ago',
      unread: true,
      type: 'message'
    },
    {
      id: 3,
      title: 'Emergency Alert',
      desc: 'Fuel spill near Dock B2. Avoid area. Safety team dispatched.',
      time: '22 min ago',
      unread: true,
      type: 'emergency'
    },
    {
      id: 4,
      title: 'Task Completed',
      desc: 'Audit for TR-1102 marked complete by supervisor.',
      time: '1 hr ago',
      unread: false,
      type: 'info'
    }
  ]);

  // Toast notifications state
  const [toast, setToast] = useState(null);

  const timerRef = useRef(null);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // Timer counter effect
  useEffect(() => {
    if (shiftActive) {
      timerRef.current = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [shiftActive]);

  // Convert elapsed seconds to HH:MM:SS
  useEffect(() => {
    const hrs = Math.floor(secondsElapsed / 3600).toString().padStart(2, '0');
    const mins = Math.floor((secondsElapsed % 3600) / 60).toString().padStart(2, '0');
    const secs = (secondsElapsed % 60).toString().padStart(2, '0');
    setTimerString(`${hrs}:${mins}:${secs}`);
  }, [secondsElapsed]);

  const handleStartWork = () => {
    const now = new Date();
    setStartTime(now);
    setSecondsElapsed(0);
    setShiftActive(true);
    setCurrentStatus('Available');
    triggerToast('Work shift started successfully. Logging GPS telemetry.');
  };

  const handleFinishWork = () => {
    const now = new Date();
    setEndTime(now);
    setShiftActive(false);
    setCurrentStatus('Off Duty');
    setShowSummaryModal(true);
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    triggerToast('All notifications marked as read.');
  };

  // Calculate unread count
  const unreadCount = notifications.filter(n => n.unread).length;

  // Format date
  const getFormattedDate = (date) => {
    if (!date) return '';
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Format time
  const getFormattedTime = (date) => {
    if (!date) return '';
    let hrs = date.getHours();
    const mins = date.getMinutes().toString().padStart(2, '0');
    const secs = date.getSeconds().toString().padStart(2, '0');
    const ampm = hrs >= 12 ? 'pm' : 'am';
    hrs = hrs % 12;
    hrs = hrs ? hrs : 12;
    return `${hrs}:${mins}:${secs} ${ampm}`;
  };

  // Estimated Pay calculation ($0.75 per minute base rate)
  const getEstimatedPay = () => {
    const mins = Math.max(1, Math.ceil(secondsElapsed / 60));
    return (mins * 0.75).toFixed(2);
  };

  // Yard Map slots
  const yardSlots = [
    { id: 'A1', type: 'Trailer', val: 'TR-9410', bg: '#FEF3C7', border: '#FDE68A', color: '#B45309' },
    { id: 'A2', type: 'Trailer (busy)', val: 'TR-1102', bg: '#DBEAFE', border: '#BFDBFE', color: '#1D4ED8' },
    { id: 'A3', type: 'Available', val: 'Free', bg: '#FFFFFF', border: '#E2E8F0', color: '#64748B' },
    { id: 'A4', type: 'Purple', val: 'TR-7712', bg: '#F3E8FF', border: '#E9D5FF', color: '#7E22CE' },
    { id: 'A5', type: 'Available', val: 'Free', bg: '#FFFFFF', border: '#E2E8F0', color: '#64748B' },
    { id: 'B1', type: 'Container', val: 'CTR-009', bg: '#D1FAE5', border: '#A7F3D0', color: '#047857' },
    { id: 'B2', type: 'Available', val: 'Free', bg: '#FFFFFF', border: '#E2E8F0', color: '#64748B' },
    { id: 'B3', type: 'Vehicle', val: 'VEH-4820', bg: '#FEF3C7', border: '#FDE68A', color: '#B45309' },
    { id: 'B4', type: 'Available', val: 'Free', bg: '#FFFFFF', border: '#E2E8F0', color: '#64748B' },
    { id: 'B5', type: 'Red', val: 'CTR-018', bg: '#FEE2E2', border: '#FCA5A5', color: '#B91C1C' },
    { id: 'C1', type: 'Available', val: 'Free', bg: '#FFFFFF', border: '#E2E8F0', color: '#64748B' },
    { id: 'C2', type: 'Trailer', val: 'TR-4809', bg: '#FEF3C7', border: '#FDE68A', color: '#B45309' },
    { id: 'C3', type: 'Available', val: 'Free', bg: '#FFFFFF', border: '#E2E8F0', color: '#64748B' },
    { id: 'C4', type: 'Vehicle', val: 'VEH-1144', bg: '#FFEDD5', border: '#FED7AA', color: '#C2410C' },
    { id: 'C5', type: 'Available', val: 'Free', bg: '#FFFFFF', border: '#E2E8F0', color: '#64748B' }
  ];

  const handleSlotClick = (slot) => {
    if (slot.val === 'Free') {
      triggerToast(`Bay ${slot.id} is empty`);
    } else {
      triggerToast(`Slot ${slot.id} Occupied - ${slot.val}`);
    }
  };

  const getButtonStyle = (buttonId, normalBorder, normalBg, normalColor) => {
    const isHovered = hoveredButtonId === buttonId;
    return {
      backgroundColor: normalBg,
      color: normalColor,
      border: isHovered ? '2px solid #000000' : normalBorder,
      borderRadius: 8,
      padding: '6px 14px',
      fontSize: 11.5,
      fontWeight: '700',
      cursor: 'pointer',
      outline: 'none',
      transition: 'all 0.15s ease',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      gap: 4
    };
  };

  // Helper to generate styles for the top 5 stats cards with hover-lift
  const getStatCardStyle = (cardId) => {
    const isHovered = hoveredStatCard === cardId;
    return {
      backgroundColor: '#ffffff',
      borderRadius: 16,
      padding: '18px 20px',
      border: '1px solid #e2e8f0',
      boxShadow: isHovered ? '0 12px 20px -5px rgba(0, 0, 0, 0.08), 0 8px 8px -5px rgba(0, 0, 0, 0.04)' : '0 1px 3px rgba(0,0,0,0.05)',
      transform: isHovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: 125,
      boxSizing: 'border-box'
    };
  };

  // Helper to generate styles for the bottom 5 action cards
  const getActionCardStyle = (cardId) => {
    const isHovered = hoveredActionCard === cardId;
    return {
      backgroundColor: '#ffffff',
      borderRadius: 16,
      padding: '20px 16px',
      border: isHovered ? '1.5px solid #ffcc00' : '1.5px solid #e2e8f0',
      boxShadow: isHovered ? '0 10px 15px -3px rgba(255, 204, 0, 0.1), 0 4px 6px -2px rgba(255, 204, 0, 0.05)' : '0 1px 3px rgba(0,0,0,0.03)',
      cursor: 'pointer',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 180,
      transition: 'all 0.25s ease',
      boxSizing: 'border-box'
    };
  };

  // Helper to generate style for the action card icon container
  const getActionIconContainerStyle = (cardId) => {
    const isHovered = hoveredActionCard === cardId;
    return {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: isHovered ? '#64748b' : '#fffbeb',
      border: isHovered ? 'none' : '1.5px solid #fde047',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: isHovered ? '#ffcc00' : '#d97706',
      transition: 'all 0.2s ease'
    };
  };

  return (
    <div style={{ height: 'calc(100vh - 85px)', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflowY: 'auto', padding: '16px 20px', width: '100%', maxWidth: 'none', fontFamily: 'Inter, Outfit, sans-serif', backgroundColor: '#f8fafc' }}>

      {/* Header Panel */}
      <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="text-2xl text-slate-900 leading-8 capitalize font-black flex items-center gap-2">
            Yard Attendant <span className="text-slate-400 text-xl mx-1">•</span> Overview
          </h1>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">
            Perform gate checks, inspect trailers, and log spotted containers.
          </p>
        </div>

        {/* Top Right Header Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Bell Icon */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotificationsModal(true)}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#334155',
                outline: 'none'
              }}
            >
              <BellIcon />
            </button>
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: -2,
                right: -2,
                backgroundColor: '#ef4444',
                color: '#ffffff',
                fontSize: 10,
                fontWeight: '800',
                width: 16,
                height: 16,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #ffffff'
              }}>
                {unreadCount}
              </span>
            )}
          </div>

          {/* Map Pin button */}
          <button
            onClick={() => setShowYardMapModal(true)}
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#334155',
              outline: 'none'
            }}
          >
            <MapPinIcon />
          </button>

          {/* QR Scan button */}
          <button
            onClick={() => {
              setScanType('Trailer');
              setScannedId('');
              setShowQrModal(true);
            }}
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#334155',
              outline: 'none'
            }}
          >
            <QrCodeIcon />
          </button>

          {/* Alert button */}
          <button
            onClick={() => {
              setIncidentType('Accident');
              setIncidentLocation('');
              setIncidentDescription('');
              setIncidentSeverity('Medium');
              setShowIncidentModal(true);
            }}
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              border: '1px solid #fca5a5',
              backgroundColor: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#ef4444',
              outline: 'none'
            }}
          >
            <AlertTriangleIcon />
          </button>

          {/* Schedule button */}
          <button
            onClick={() => setShowScheduleModal(true)}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #ffcc00',
              borderRadius: 8,
              padding: '8px 16px',
              color: '#b45309',
              fontSize: 12,
              fontWeight: '700',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            View Shift Schedule
          </button>

          {/* Status button */}
          <button
            onClick={() => {
              setStatusNotes('');
              setShowStatusModal(true);
            }}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              padding: '8px 16px',
              color: '#475569',
              fontSize: 12,
              fontWeight: '700',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            Update Status
          </button>

          {/* View My Tasks button */}
          <button
            onClick={() => setShowTasksModal(true)}
            style={{
              backgroundColor: '#ffcc00',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              color: '#000000',
              fontSize: 12,
              fontWeight: '800',
              cursor: 'pointer',
              outline: 'none',
              boxShadow: '0 2px 4px rgba(255, 204, 0, 0.2)'
            }}
          >
            View My Tasks
          </button>
        </div>
      </div>

      {/* Stats row (Top 5 boxes) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 20 }}>
        {/* Trailers Spotted */}
        <div
          onMouseEnter={() => setHoveredStatCard('trailers')}
          onMouseLeave={() => setHoveredStatCard(null)}
          style={getStatCardStyle('trailers')}
        >
          <div>
            <span style={{ fontSize: 10, fontWeight: '800', color: '#64748b', letterSpacing: '0.6px', display: 'block' }}>TRAILERS SPOTTED</span>
            <span style={{ fontSize: 28, fontWeight: '800', color: '#0f172a', display: 'block', marginTop: 4 }}>4</span>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, fontWeight: '800', color: '#64748b', marginBottom: 4 }}>
              <span>Progress</span>
              <span>56%</span>
            </div>
            <div style={{ width: '100%', height: 5, backgroundColor: '#f1f5f9', borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
              <div style={{ width: '56%', height: '100%', backgroundColor: '#ffcc00' }}></div>
            </div>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: '600' }}>Active parking spots</span>
          </div>
        </div>

        {/* Gate Events */}
        <div
          onMouseEnter={() => setHoveredStatCard('gate-events')}
          onMouseLeave={() => setHoveredStatCard(null)}
          style={getStatCardStyle('gate-events')}
        >
          <div>
            <span style={{ fontSize: 10, fontWeight: '800', color: '#64748b', letterSpacing: '0.6px', display: 'block' }}>GATE EVENTS</span>
            <span style={{ fontSize: 28, fontWeight: '800', color: '#0f172a', display: 'block', marginTop: 4 }}>4</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: '600' }}>Inward/Outward today</span>
            <span style={{ fontSize: 10, fontWeight: '800', color: '#047857', backgroundColor: '#d1fae5', padding: '2px 6px', borderRadius: 4 }}>+2 checks</span>
          </div>
        </div>

        {/* Yard Capacity */}
        <div
          onMouseEnter={() => setHoveredStatCard('capacity')}
          onMouseLeave={() => setHoveredStatCard(null)}
          style={getStatCardStyle('capacity')}
        >
          <div>
            <span style={{ fontSize: 10, fontWeight: '800', color: '#64748b', letterSpacing: '0.6px', display: 'block' }}>YARD CAPACITY</span>
            <span style={{ fontSize: 28, fontWeight: '800', color: '#0f172a', display: 'block', marginTop: 4 }}>53%</span>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, fontWeight: '800', color: '#64748b', marginBottom: 4 }}>
              <span>Progress</span>
              <span>56%</span>
            </div>
            <div style={{ width: '100%', height: 5, backgroundColor: '#f1f5f9', borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
              <div style={{ width: '53%', height: '100%', backgroundColor: '#ffcc00' }}></div>
            </div>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: '600' }}>Slots occupied</span>
          </div>
        </div>

        {/* Pending Tasks */}
        <div
          onMouseEnter={() => setHoveredStatCard('pending')}
          onMouseLeave={() => setHoveredStatCard(null)}
          style={getStatCardStyle('pending')}
        >
          <div>
            <span style={{ fontSize: 10, fontWeight: '800', color: '#64748b', letterSpacing: '0.6px', display: 'block' }}>PENDING TASKS</span>
            <span style={{ fontSize: 28, fontWeight: '800', color: '#0f172a', display: 'block', marginTop: 4 }}>
              {tasks.filter(t => t.status === 'PENDING').length}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: '600' }}>Awaiting action</span>
            <span style={{ fontSize: 10, fontWeight: '800', color: '#64748b', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>Action needed</span>
          </div>
        </div>

        {/* Current Shift */}
        <div
          onMouseEnter={() => setHoveredStatCard('shift')}
          onMouseLeave={() => setHoveredStatCard(null)}
          style={getStatCardStyle('shift')}
        >
          <div>
            <span style={{ fontSize: 10, fontWeight: '800', color: '#64748b', letterSpacing: '0.6px', display: 'block' }}>CURRENT SHIFT</span>
            <span style={{ fontSize: shiftActive ? 22 : 26, fontWeight: '800', color: '#0f172a', display: 'block', marginTop: 4, fontFamily: shiftActive ? 'monospace' : 'inherit' }}>
              {shiftActive ? timerString : 'Off Duty'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: '600' }}>Not clocked in</span>
            <span
              onClick={shiftActive ? handleFinishWork : handleStartWork}
              style={{ fontSize: 10, fontWeight: '800', color: '#334155', textDecoration: 'underline', cursor: 'pointer' }}
            >
              Clock in
            </span>
          </div>
        </div>
      </div>

      {/* Action Cards Row (Bottom 5 boxes with hover style matching Move Asset) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 20 }}>
        {/* Card 1: Move Asset */}
        <div
          onClick={() => triggerToast('Select Move Asset from sidebar to relocate assets.')}
          onMouseEnter={() => setHoveredActionCard('move-asset')}
          onMouseLeave={() => setHoveredActionCard(null)}
          style={getActionCardStyle('move-asset')}
        >
          <div style={getActionIconContainerStyle('move-asset')}>
            <NavigationIcon />
          </div>
          <div>
            <h3 style={{ fontSize: 13.5, fontWeight: '800', color: '#0f172a', margin: 0 }}>Move Asset</h3>
            <p style={{ fontSize: 10.5, color: '#64748b', margin: '4px 0 0 0', fontWeight: '500' }}>Relocate trailers & containers</p>
          </div>
          <span style={{ fontSize: 16, color: '#94a3b8', display: 'block' }}>&rarr;</span>
        </div>

        {/* Card 2: Scan In */}
        <div
          onClick={() => { setScanType('Container'); setScannedId(''); setShowQrModal(true); }}
          onMouseEnter={() => setHoveredActionCard('scan-in')}
          onMouseLeave={() => setHoveredActionCard(null)}
          style={getActionCardStyle('scan-in')}
        >
          <div style={getActionIconContainerStyle('scan-in')}>
            <QrCodeIcon />
          </div>
          <div>
            <h3 style={{ fontSize: 13.5, fontWeight: '800', color: '#0f172a', margin: 0 }}>Scan In</h3>
            <p style={{ fontSize: 10.5, color: '#64748b', margin: '4px 0 0 0', fontWeight: '500' }}>Check inbound assets into yard</p>
          </div>
          <span style={{ fontSize: 16, color: '#94a3b8', display: 'block' }}>&rarr;</span>
        </div>

        {/* Card 3: Scan Out */}
        <div
          onClick={() => { setScanType('Container'); setScannedId(''); setShowQrModal(true); }}
          onMouseEnter={() => setHoveredActionCard('scan-out')}
          onMouseLeave={() => setHoveredActionCard(null)}
          style={getActionCardStyle('scan-out')}
        >
          <div style={getActionIconContainerStyle('scan-out')}>
            <TruckIcon />
          </div>
          <div>
            <h3 style={{ fontSize: 13.5, fontWeight: '800', color: '#0f172a', margin: 0 }}>Scan Out</h3>
            <p style={{ fontSize: 10.5, color: '#64748b', margin: '4px 0 0 0', fontWeight: '500' }}>Release assets to gate</p>
          </div>
          <span style={{ fontSize: 16, color: '#94a3b8', display: 'block' }}>&rarr;</span>
        </div>

        {/* Card 4: Lane Assignment */}
        <div
          onClick={() => setShowYardMapModal(true)}
          onMouseEnter={() => setHoveredActionCard('lane-assignment')}
          onMouseLeave={() => setHoveredActionCard(null)}
          style={getActionCardStyle('lane-assignment')}
        >
          <div style={getActionIconContainerStyle('lane-assignment')}>
            <MapPinIcon />
          </div>
          <div>
            <h3 style={{ fontSize: 13.5, fontWeight: '800', color: '#0f172a', margin: 0 }}>Lane Assignment</h3>
            <p style={{ fontSize: 10.5, color: '#64748b', margin: '4px 0 0 0', fontWeight: '500' }}>Spot trailers to load lanes</p>
          </div>
          <span style={{ fontSize: 16, color: '#94a3b8', display: 'block' }}>&rarr;</span>
        </div>

        {/* Card 5: Report Issue */}
        <div
          onClick={() => {
            setIncidentType('Accident');
            setIncidentLocation('');
            setIncidentDescription('');
            setIncidentSeverity('Medium');
            setShowIncidentModal(true);
          }}
          onMouseEnter={() => setHoveredActionCard('report-issue')}
          onMouseLeave={() => setHoveredActionCard(null)}
          style={getActionCardStyle('report-issue')}
        >
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: hoveredActionCard === 'report-issue' ? '#64748b' : '#fef2f2',
            border: hoveredActionCard === 'report-issue' ? 'none' : '1.5px solid #fca5a5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: hoveredActionCard === 'report-issue' ? '#ffcc00' : '#ef4444',
            transition: 'all 0.2s ease'
          }}>
            <AlertTriangleIcon />
          </div>
          <div>
            <h3 style={{ fontSize: 13.5, fontWeight: '800', color: '#0f172a', margin: 0 }}>Report Issue</h3>
            <p style={{ fontSize: 10.5, color: '#64748b', margin: '4px 0 0 0', fontWeight: '500' }}>Log damage or missing items</p>
          </div>
          <span style={{ fontSize: 16, color: '#94a3b8', display: 'block' }}>&rarr;</span>
        </div>
      </div>

      {/* Shift Control Strip */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 14,
        padding: '12px 20px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        flexWrap: 'wrap',
        gap: 16
      }}>
        {/* Left Side Status dot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: shiftActive ? '#10b981' : '#64748b',
            display: 'inline-block'
          }}></span>
          <span style={{ fontSize: 13, fontWeight: '700', color: '#334155' }}>
            {shiftActive ? `Shift In Progress (Active) - ${timerString}` : 'Shift Off Duty (Available)'}
          </span>
        </div>

        {/* Right Side Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowScheduleModal(true)}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              padding: '6px 14px',
              color: '#475569',
              fontSize: 12,
              fontWeight: '700',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><CalendarIcon /> Shift Schedule</span>
          </button>

          <button
            onClick={() => triggerToast('Yard inventory database synchronized successfully.')}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              padding: '6px 14px',
              color: '#475569',
              fontSize: 12,
              fontWeight: '700',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><SyncIcon /> Sync Yard Status</span>
          </button>

          <button
            onClick={shiftActive ? handleFinishWork : handleStartWork}
            onMouseEnter={() => setHoveredButtonId('start-work-btn')}
            onMouseLeave={() => setHoveredButtonId(null)}
            style={{
              backgroundColor: shiftActive ? '#ef4444' : '#ffcc00',
              color: shiftActive ? '#ffffff' : '#000000',
              border: hoveredButtonId === 'start-work-btn' ? '2px solid #000000' : '1px solid transparent',
              borderRadius: 8,
              padding: '8px 16px',
              fontSize: 12,
              fontWeight: '800',
              cursor: 'pointer',
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: shiftActive ? '0 2px 4px rgba(239, 68, 68, 0.2)' : '0 2px 4px rgba(255, 204, 0, 0.2)',
              transition: 'all 0.15s ease'
            }}
          >
            <ClockIcon /> {shiftActive ? 'Finish Work' : 'Start Work'}
          </button>
        </div>
      </div>

      {/* Spotted Relocator Task Queue List */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 20, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: 12, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontSize: 15, fontWeight: '800', color: '#0f172a', margin: 0 }}>
            Spotted Relocator Task Queue &bull; <span style={{ color: '#64748b', fontSize: 13, fontWeight: '700' }}>3 Tasks</span>
          </h2>
          <button
            onClick={() => setShowTasksModal(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#b45309',
              fontSize: 12,
              fontWeight: '800',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            View All Tasks
          </button>
        </div>

        {/* Task Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 8 }}>
          {tasks.map((task) => (
            <div
              key={task.id}
              style={{
                border: '1px solid #f1f5f9',
                borderRadius: 12,
                padding: 14,
                backgroundColor: '#ffffff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 16,
                minWidth: 'max-content',
                whiteSpace: 'nowrap'
              }}
            >
              {/* Left Side: Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h3 style={{ fontSize: 13.5, fontWeight: '800', color: '#0f172a', margin: 0 }}>{task.title}</h3>
                  <span style={{
                    fontSize: 9,
                    fontWeight: '800',
                    padding: '2px 6px',
                    borderRadius: 4,
                    textTransform: 'uppercase',
                    backgroundColor: task.priority === 'High' ? '#fef2f2' : '#fffbeb',
                    color: task.priority === 'High' ? '#ef4444' : '#b45309',
                    border: `1.5px solid ${task.priority === 'High' ? '#fca5a5' : '#fde047'}`
                  }}>
                    {task.priority}
                  </span>

                  <span style={{
                    fontSize: 9,
                    fontWeight: '800',
                    padding: '2px 6px',
                    borderRadius: 4,
                    backgroundColor: task.status === 'COMPLETED' ? '#d1fae5' : task.status === 'IN_PROGRESS' ? '#dbeafe' : '#fef3c7',
                    color: task.status === 'COMPLETED' ? '#047857' : task.status === 'IN_PROGRESS' ? '#1d4ed8' : '#d97706',
                    border: `1.5px solid ${task.status === 'COMPLETED' ? '#a7f3d0' : task.status === 'IN_PROGRESS' ? '#bfdbfe' : '#fde68a'}`
                  }}>
                    {task.status === 'IN_PROGRESS' ? 'IN PROGRESS' : task.status}
                  </span>
                </div>

                <p style={{ fontSize: 11.5, color: '#64748b', margin: 0, fontWeight: '500' }}>
                  {task.desc}
                </p>

                {/* Metadata Row */}
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', fontSize: 11, color: '#475569', fontWeight: '600', marginTop: 4 }}>
                  <span>⏰ Due: {task.time}</span>
                  <span>&bull;</span>
                  <span>🚪 Gate: {task.gate}</span>
                  <span>&bull;</span>
                  <span>🚛 Unit: {task.unit}</span>
                  {task.notes && (
                    <>
                      <span>&bull;</span>
                      <span style={{ fontStyle: 'italic', color: '#10b981' }}>📝 Note: {task.notes}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Right Side: Actions */}
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                {task.status === 'PENDING' && (
                  <button
                    onClick={() => {
                      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'IN_PROGRESS' } : t));
                      triggerToast(`Task started: ${task.title}`);
                    }}
                    onMouseEnter={() => setHoveredButtonId(`start-${task.id}`)}
                    onMouseLeave={() => setHoveredButtonId(null)}
                    style={getButtonStyle(`start-${task.id}`, '1px solid #bfdbfe', '#eff6ff', '#1d4ed8')}
                  >
                    Start Task
                  </button>
                )}

                {task.status === 'IN_PROGRESS' && (
                  <>
                    <button
                      onClick={() => {
                        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'COMPLETED' } : t));
                        triggerToast(`Task completed: ${task.title}`);
                      }}
                      onMouseEnter={() => setHoveredButtonId(`complete-${task.id}`)}
                      onMouseLeave={() => setHoveredButtonId(null)}
                      style={getButtonStyle(`complete-${task.id}`, '1px solid transparent', '#ffcc00', '#000000')}
                    >
                      <CheckIcon /> Complete
                    </button>
                    <button
                      onClick={() => {
                        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, notes: 'Confirmed Loaded' } : t));
                        triggerToast(`Confirmed Loaded for ${task.unit}`);
                      }}
                      onMouseEnter={() => setHoveredButtonId(`load-${task.id}`)}
                      onMouseLeave={() => setHoveredButtonId(null)}
                      style={getButtonStyle(`load-${task.id}`, '1px solid #cbd5e1', '#ffffff', '#475569')}
                    >
                      Confirm Loaded
                    </button>
                    <button
                      onClick={() => {
                        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, notes: 'Confirmed Unloaded' } : t));
                        triggerToast(`Confirmed Unloaded for ${task.unit}`);
                      }}
                      onMouseEnter={() => setHoveredButtonId(`unload-${task.id}`)}
                      onMouseLeave={() => setHoveredButtonId(null)}
                      style={getButtonStyle(`unload-${task.id}`, '1px solid #cbd5e1', '#ffffff', '#475569')}
                    >
                      Confirm Unloaded
                    </button>
                  </>
                )}

                <button
                  onClick={() => {
                    setSelectedTask(task);
                    setShowDetailsModal(true);
                  }}
                  onMouseEnter={() => setHoveredButtonId(`details-${task.id}`)}
                  onMouseLeave={() => setHoveredButtonId(null)}
                  style={getButtonStyle(`details-${task.id}`, '1.5px solid #ffcc00', '#ffffff', '#b45309')}
                >
                  View Details
                </button>

                <button
                  onClick={() => {
                    setNoteTaskId(task.id);
                    setNoteText(task.notes || '');
                    setShowNotePopup(true);
                  }}
                  onMouseEnter={() => setHoveredButtonId(`note-${task.id}`)}
                  onMouseLeave={() => setHoveredButtonId(null)}
                  style={getButtonStyle(`note-${task.id}`, '1.5px solid #ffcc00', '#ffffff', '#b45309')}
                >
                  Add Notes
                </button>

                <button
                  onClick={() => setShowSupervisorModal(true)}
                  onMouseEnter={() => setHoveredButtonId(`super-${task.id}`)}
                  onMouseLeave={() => setHoveredButtonId(null)}
                  style={getButtonStyle(`super-${task.id}`, '1.5px solid #ffcc00', '#ffffff', '#b45309')}
                >
                  Contact Supervisor
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── MODALS ──────────────────────────────────────────────────────── */}

      {/* MODAL 1: Work Shift Summary */}
      {showSummaryModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            width: '100%',
            maxWidth: 480,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 16.5, fontWeight: '800', color: '#0f172a', margin: 0 }}>Work Shift Summary</h2>
              <button
                onClick={() => setShowSummaryModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: '#64748b' }}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              {/* Gold Card Box */}
              <div style={{
                backgroundColor: '#fffbeb',
                border: '1px solid #fde047',
                borderRadius: 16,
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: '800', color: '#b45309', letterSpacing: '0.5px' }}>YARD ATTENDANT</span>
                  <span style={{ fontSize: 11, fontWeight: '800', color: '#64748b' }}>{getFormattedDate(endTime)}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px', textAlign: 'left' }}>
                  <div>
                    <span style={{ fontSize: 9.5, fontWeight: '800', color: '#92400e', display: 'block', letterSpacing: '0.2px' }}>START TIME</span>
                    <span style={{ fontSize: 13, fontWeight: '800', color: '#0f172a', marginTop: 4, display: 'block' }}>{getFormattedTime(startTime)}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: 9.5, fontWeight: '800', color: '#92400e', display: 'block', letterSpacing: '0.2px' }}>END TIME</span>
                    <span style={{ fontSize: 13, fontWeight: '800', color: '#0f172a', marginTop: 4, display: 'block' }}>{getFormattedTime(endTime)}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: 9.5, fontWeight: '800', color: '#92400e', display: 'block', letterSpacing: '0.2px' }}>TOTAL DURATION</span>
                    <span style={{ fontSize: 13, fontWeight: '800', color: '#10b981', marginTop: 4, display: 'block' }}>
                      {Math.max(1, Math.ceil(secondsElapsed / 60))} minutes
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: 9.5, fontWeight: '800', color: '#92400e', display: 'block', letterSpacing: '0.2px' }}>ESTIMATED PAY</span>
                    <span style={{ fontSize: 13, fontWeight: '800', color: '#b45309', marginTop: 4, display: 'block' }}>${getEstimatedPay()}</span>
                  </div>
                </div>
              </div>

              {/* Done button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                <button
                  onClick={() => setShowSummaryModal(false)}
                  style={{
                    backgroundColor: '#ffcc00',
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 24px',
                    fontSize: 12.5,
                    fontWeight: '800',
                    color: '#000000',
                    cursor: 'pointer',
                    outline: 'none',
                    boxShadow: '0 2px 6px rgba(255, 204, 0, 0.2)'
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Notifications */}
      {showNotificationsModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            width: '100%',
            maxWidth: 480,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 16.5, fontWeight: '800', color: '#0f172a', margin: 0 }}>Notifications</h2>
              <button
                onClick={() => setShowNotificationsModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: '#64748b' }}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: '700', color: '#64748b' }}>{unreadCount} unread</span>
                <button
                  onClick={handleMarkAllRead}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#b45309',
                    fontSize: 12,
                    fontWeight: '700',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  Mark all read
                </button>
              </div>

              {/* Notification List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 320, overflowY: 'auto', paddingRight: 4 }}>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: 12,
                      padding: 14,
                      backgroundColor: n.type === 'emergency' ? '#fef2f2' : '#ffffff',
                      borderColor: n.type === 'emergency' ? '#fca5a5' : '#e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                      position: 'relative',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{
                        fontSize: 12.5,
                        fontWeight: '800',
                        color: n.type === 'emergency' ? '#ef4444' : '#0f172a'
                      }}>
                        {n.type === 'emergency' && '🚨 '}{n.title}
                      </span>
                      <span style={{ fontSize: 10, color: '#94a3b8' }}>{n.time}</span>
                    </div>
                    <p style={{ fontSize: 11.5, color: '#64748b', margin: 0, fontWeight: '500', lineHeight: 1.4 }}>
                      {n.desc}
                    </p>
                    {n.unread && (
                      <span style={{
                        position: 'absolute',
                        top: 14,
                        right: 14,
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6'
                      }}></span>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <button
                  onClick={() => setShowNotificationsModal(false)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 8,
                    padding: '8px 24px',
                    fontSize: 12,
                    fontWeight: '700',
                    color: '#334155',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Yard Map — Parking Grid */}
      {showYardMapModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 24,
            width: '100%',
            maxWidth: 580,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 16.5, fontWeight: '800', color: '#0f172a', margin: 0 }}>Yard Map &mdash; Parking Grid</h2>
              <button
                onClick={() => setShowYardMapModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: '#64748b' }}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Legend row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', justifyContent: 'flex-start', alignItems: 'center', fontSize: 11.5, fontWeight: '600', color: '#475569' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ffcc00' }}></span>
                  <span>Trailer</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#3b82f6' }}></span>
                  <span>Trailer (busy)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10b981' }}></span>
                  <span>Container</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#f59e0b' }}></span>
                  <span>Vehicle</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#334155' }}></span>
                  <span>Available</span>
                </div>
              </div>

              {/* Parking Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 12,
                marginTop: 8
              }}>
                {yardSlots.map((slot) => (
                  <div
                    key={slot.id}
                    onClick={() => handleSlotClick(slot)}
                    style={{
                      backgroundColor: slot.bg,
                      border: `1px solid ${slot.border}`,
                      borderRadius: 10,
                      padding: '14px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
                    }}
                  >
                    <span style={{ fontSize: 11.5, fontWeight: '800', color: slot.color }}>
                      {slot.id}
                    </span>
                    <span style={{ fontSize: 9.5, fontWeight: '600', color: slot.color, marginTop: 4 }}>
                      {slot.val}
                    </span>
                  </div>
                ))}
              </div>

              {/* Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 12 }}>
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: '800', color: '#0f172a' }}>8</span>
                  <span style={{ fontSize: 9.5, fontWeight: '700', color: '#64748b', marginTop: 2 }}>Occupied</span>
                </div>
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: '800', color: '#10b981' }}>7</span>
                  <span style={{ fontSize: 9.5, fontWeight: '700', color: '#64748b', marginTop: 2 }}>Available</span>
                </div>
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: '800', color: '#0f172a' }}>15</span>
                  <span style={{ fontSize: 9.5, fontWeight: '700', color: '#64748b', marginTop: 2 }}>Total Bays</span>
                </div>
              </div>

              {/* Close button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                <button
                  onClick={() => setShowYardMapModal(false)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 8,
                    padding: '8px 24px',
                    fontSize: 12,
                    fontWeight: '700',
                    color: '#334155',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: QR / Barcode Scanner */}
      {showQrModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 24,
            width: '100%',
            maxWidth: 500,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Inter, Outfit, sans-serif'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 18, fontWeight: '800', color: '#0f172a', margin: 0 }}>QR / Barcode Scanner</h2>
              <button
                onClick={() => setShowQrModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: '#64748b' }}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Scan Type */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left' }}>
                <label style={{ fontSize: 11, fontWeight: '800', color: '#64748b', letterSpacing: '0.5px' }}>SCAN TYPE</label>
                <select
                  value={scanType}
                  onChange={(e) => setScanType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '1.5px solid #ffcc00',
                    fontSize: 13,
                    color: '#334155',
                    fontWeight: '600',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                  }}
                >
                  <option value="Trailer">Trailer</option>
                  <option value="Container">Container</option>
                  <option value="Vehicle">Vehicle</option>
                </select>
              </div>

              {/* Viewfinder simulation */}
              <div style={{
                height: 180,
                borderRadius: 12,
                border: '1.5px dashed #fde047',
                backgroundColor: '#f8fafc',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"></path>
                  <rect x="7" y="7" width="3" height="3"></rect>
                  <rect x="14" y="7" width="3" height="3"></rect>
                  <rect x="14" y="14" width="3" height="3"></rect>
                  <rect x="7" y="14" width="3" height="3"></rect>
                </svg>
                <span style={{ fontSize: 12, color: '#64748b', fontWeight: '500' }}>Camera viewfinder (simulated)</span>
              </div>

              {/* Text Input & Scan Button */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder={`Enter ${scanType} ID (e.g. ${scanType === 'Trailer' ? 'TR-9410' : scanType === 'Container' ? 'CTR-009' : 'VEH-4820'})...`}
                  value={scannedId}
                  onChange={(e) => setScannedId(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '1px solid #cbd5e1',
                    fontSize: 13,
                    outline: 'none',
                    fontWeight: '500'
                  }}
                />
                <button
                  onClick={() => {
                    const id = scannedId.trim() || (scanType === 'Trailer' ? 'TR-9410' : scanType === 'Container' ? 'CTR-009' : 'VEH-4820');
                    triggerToast(`Scanned ${scanType} ID: ${id} successfully!`);
                    setShowQrModal(false);
                  }}
                  style={{
                    backgroundColor: '#ffcc00',
                    border: 'none',
                    borderRadius: 12,
                    padding: '12px 20px',
                    fontSize: 13,
                    fontWeight: '800',
                    color: '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(255,204,0,0.2)'
                  }}
                >
                  <QrCodeIcon />
                  Scan
                </button>
              </div>

              {/* Close Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <button
                  onClick={() => setShowQrModal(false)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 8,
                    padding: '8px 24px',
                    fontSize: 12,
                    fontWeight: '700',
                    color: '#334155',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Report Incident */}
      {showIncidentModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 24,
            width: '100%',
            maxWidth: 500,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh',
            fontFamily: 'Inter, Outfit, sans-serif'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 18, fontWeight: '800', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>🚨</span> Report Incident
              </h2>
              <button
                onClick={() => setShowIncidentModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: '#64748b' }}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto', textAlign: 'left' }}>
              {/* Incident Type */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: '800', color: '#475569', letterSpacing: '0.5px' }}>INCIDENT TYPE *</label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1.5px solid #ffcc00',
                    fontSize: 13,
                    color: '#0f172a',
                    fontWeight: '600',
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <option value="Accident">🚗 Accident</option>
                  <option value="Damage">💥 Damage</option>
                  <option value="Unsafe Condition">⚠️ Unsafe Condition</option>
                  <option value="Spill">🛢️ Spill</option>
                </select>
              </div>

              {/* Location */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: '800', color: '#475569', letterSpacing: '0.5px' }}>LOCATION / AREA *</label>
                <input
                  type="text"
                  placeholder="e.g. Dock B2, near Gate 3"
                  value={incidentLocation}
                  onChange={(e) => setIncidentLocation(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid #cbd5e1',
                    fontSize: 13,
                    outline: 'none',
                    fontWeight: '500'
                  }}
                />
              </div>

              {/* Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: '800', color: '#475569', letterSpacing: '0.5px' }}>DESCRIPTION *</label>
                <textarea
                  rows="3"
                  placeholder="Describe what happened..."
                  value={incidentDescription}
                  onChange={(e) => setIncidentDescription(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid #cbd5e1',
                    fontSize: 13,
                    outline: 'none',
                    fontWeight: '500',
                    resize: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Severity */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: '800', color: '#475569', letterSpacing: '0.5px' }}>SEVERITY</label>
                <select
                  value={incidentSeverity}
                  onChange={(e) => setIncidentSeverity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid #cbd5e1',
                    fontSize: 13,
                    color: '#0f172a',
                    fontWeight: '600',
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              {/* Upload area */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: '800', color: '#475569', letterSpacing: '0.5px' }}>UPLOAD PHOTOS (OPTIONAL)</label>
                <div style={{
                  border: '1.5px dashed #cbd5e1',
                  borderRadius: 16,
                  padding: '24px 16px',
                  backgroundColor: '#f8fafc',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  cursor: 'pointer'
                }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fde047',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: 12.5, fontWeight: '700', color: '#0f172a', display: 'block' }}>Drag & drop file or click to select</span>
                    <span style={{ fontSize: 10.5, color: '#64748b', display: 'block', marginTop: 4 }}>Supports .PDF, .JPG, .JPEG, .PNG (Max 10MB)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowIncidentModal(false)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 10,
                    padding: '10px 24px',
                    fontSize: 12.5,
                    fontWeight: '700',
                    color: '#334155',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerToast(`Incident report submitted successfully.`);
                    setShowIncidentModal(false);
                  }}
                  style={{
                    backgroundColor: '#dc2626',
                    border: 'none',
                    borderRadius: 10,
                    padding: '10px 24px',
                    fontSize: 12.5,
                    fontWeight: '800',
                    color: '#ffffff',
                    cursor: 'pointer',
                    outline: 'none',
                    boxShadow: '0 2px 8px rgba(220, 38, 38, 0.25)'
                  }}
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: Shift Schedule */}
      {showScheduleModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 24,
            width: '100%',
            maxWidth: 520,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh',
            fontFamily: 'Inter, Outfit, sans-serif'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 18, fontWeight: '800', color: '#0f172a', margin: 0 }}>Shift Schedule</h2>
              <button
                onClick={() => setShowScheduleModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: '#64748b' }}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto' }}>
              {/* Today's Shift Card */}
              <div style={{
                backgroundColor: '#fffbeb',
                border: '1.5px solid #fde047',
                borderRadius: 16,
                padding: '20px',
                textAlign: 'left'
              }}>
                <span style={{ fontSize: 11, fontWeight: '800', color: '#b45309', letterSpacing: '0.5px', display: 'block', marginBottom: 12 }}>
                  TODAY'S SHIFT &mdash; JUN 27, 2026
                </span>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
                  {/* Supervisor */}
                  <div style={{ backgroundColor: '#ffffff', border: '1px solid #fef3c7', borderRadius: 8, padding: '8px 12px' }}>
                    <span style={{ fontSize: 9, fontWeight: '800', color: '#64748b', display: 'block', letterSpacing: '0.2px' }}>SUPERVISOR</span>
                    <span style={{ fontSize: 12.5, fontWeight: '800', color: '#0f172a', marginTop: 2, display: 'block' }}>Michael Torres</span>
                  </div>

                  {/* Assigned Gate */}
                  <div style={{ backgroundColor: '#ffffff', border: '1px solid #fef3c7', borderRadius: 8, padding: '8px 12px' }}>
                    <span style={{ fontSize: 9, fontWeight: '800', color: '#64748b', display: 'block', letterSpacing: '0.2px' }}>ASSIGNED GATE</span>
                    <span style={{ fontSize: 12.5, fontWeight: '800', color: '#0f172a', marginTop: 2, display: 'block' }}>Gate 3 & Gate 4</span>
                  </div>

                  {/* Inspection Zone */}
                  <div style={{ backgroundColor: '#ffffff', border: '1px solid #fef3c7', borderRadius: 8, padding: '8px 12px' }}>
                    <span style={{ fontSize: 9, fontWeight: '800', color: '#64748b', display: 'block', letterSpacing: '0.2px' }}>INSPECTION ZONE</span>
                    <span style={{ fontSize: 12.5, fontWeight: '800', color: '#0f172a', marginTop: 2, display: 'block' }}>Zone B &mdash; Rear Yard</span>
                  </div>

                  {/* Break Time */}
                  <div style={{ backgroundColor: '#ffffff', border: '1px solid #fef3c7', borderRadius: 8, padding: '8px 12px' }}>
                    <span style={{ fontSize: 9, fontWeight: '800', color: '#64748b', display: 'block', letterSpacing: '0.2px' }}>BREAK TIME</span>
                    <span style={{ fontSize: 12.5, fontWeight: '800', color: '#0f172a', marginTop: 2, display: 'block' }}>13:30 &ndash; 14:00</span>
                  </div>

                  {/* Shift Start */}
                  <div style={{ backgroundColor: '#ffffff', border: '1px solid #fef3c7', borderRadius: 8, padding: '8px 12px' }}>
                    <span style={{ fontSize: 9, fontWeight: '800', color: '#64748b', display: 'block', letterSpacing: '0.2px' }}>SHIFT START</span>
                    <span style={{ fontSize: 12.5, fontWeight: '800', color: '#0f172a', marginTop: 2, display: 'block' }}>06:00 AM</span>
                  </div>

                  {/* Shift End */}
                  <div style={{ backgroundColor: '#ffffff', border: '1px solid #fef3c7', borderRadius: 8, padding: '8px 12px' }}>
                    <span style={{ fontSize: 9, fontWeight: '800', color: '#64748b', display: 'block', letterSpacing: '0.2px' }}>SHIFT END</span>
                    <span style={{ fontSize: 12.5, fontWeight: '800', color: '#0f172a', marginTop: 2, display: 'block' }}>02:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Upcoming Shifts Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
                <span style={{ fontSize: 11, fontWeight: '800', color: '#64748b', letterSpacing: '0.5px' }}>UPCOMING SHIFTS</span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff' }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: '800', color: '#0f172a', display: 'block' }}>Jun 28, 2026</span>
                      <span style={{ fontSize: 11, color: '#64748b', marginTop: 2, display: 'block' }}>06:00 AM &ndash; 02:00 PM</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 12, fontWeight: '800', color: '#475569', display: 'block' }}>Gate 1 & Gate 2</span>
                      <span style={{ fontSize: 11, color: '#64748b', marginTop: 2, display: 'block' }}>Zone A</span>
                    </div>
                  </div>

                  <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff' }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: '800', color: '#0f172a', display: 'block' }}>Jun 29, 2026</span>
                      <span style={{ fontSize: 11, color: '#64748b', marginTop: 2, display: 'block' }}>02:00 PM &ndash; 10:00 PM</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 12, fontWeight: '800', color: '#475569', display: 'block' }}>Gate 3</span>
                      <span style={{ fontSize: 11, color: '#64748b', marginTop: 2, display: 'block' }}>Zone C</span>
                    </div>
                  </div>

                  <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff' }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: '800', color: '#0f172a', display: 'block' }}>Jun 30, 2026</span>
                      <span style={{ fontSize: 11, color: '#64748b', marginTop: 2, display: 'block' }}>Rest Day</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 12, fontWeight: '800', color: '#cbd5e1', display: 'block' }}>&mdash;</span>
                      <span style={{ fontSize: 11, color: '#cbd5e1', marginTop: 2, display: 'block' }}>&mdash;</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 10,
                    padding: '10px 24px',
                    fontSize: 12.5,
                    fontWeight: '700',
                    color: '#334155',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: Update Status */}
      {showStatusModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 24,
            width: '100%',
            maxWidth: 500,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Inter, Outfit, sans-serif'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 18, fontWeight: '800', color: '#0f172a', margin: 0 }}>Update My Status</h2>
              <button
                onClick={() => setShowStatusModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: '#64748b' }}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: '800', color: '#64748b', letterSpacing: '0.5px' }}>STATUS</label>
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '1.5px solid #ffcc00',
                    fontSize: 13.5,
                    color: '#334155',
                    fontWeight: '600',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                  }}
                >
                  <option value="Available">🟢 Available</option>
                  <option value="Busy">🟡 Busy</option>
                  <option value="On Inspection">🔵 On Inspection</option>
                  <option value="On Break">🟠 On Break</option>
                  <option value="Off Duty">⚫ Off Duty</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: '800', color: '#64748b', letterSpacing: '0.5px' }}>NOTES (OPTIONAL)</label>
                <input
                  type="text"
                  placeholder="e.g. Inspecting trailer near Gate 4..."
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '1px solid #cbd5e1',
                    fontSize: 13,
                    outline: 'none',
                    fontWeight: '500'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                <button
                  onClick={() => setShowStatusModal(false)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 10,
                    padding: '10px 24px',
                    fontSize: 12.5,
                    fontWeight: '700',
                    color: '#334155',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    triggerToast(`Attendant status updated to: ${currentStatus}`);
                    setShowStatusModal(false);
                  }}
                  style={{
                    backgroundColor: '#ffcc00',
                    border: 'none',
                    borderRadius: 10,
                    padding: '10px 24px',
                    fontSize: 12.5,
                    fontWeight: '800',
                    color: '#000000',
                    cursor: 'pointer',
                    outline: 'none',
                    boxShadow: '0 2px 6px rgba(255, 204, 0, 0.2)'
                  }}
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 8: My Task List */}
      {showTasksModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 24,
            width: '100%',
            maxWidth: 580,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh',
            fontFamily: 'Inter, Outfit, sans-serif'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 18, fontWeight: '800', color: '#0f172a', margin: 0 }}>My Task List</h2>
              <button
                onClick={() => setShowTasksModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: '#64748b' }}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
              {/* Statistics Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: 18, fontWeight: '800', color: '#d97706' }}>
                    {tasks.filter(t => t.status === 'PENDING').length}
                  </span>
                  <span style={{ fontSize: 10.5, fontWeight: '700', color: '#64748b', marginTop: 4 }}>Pending</span>
                </div>
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: 18, fontWeight: '800', color: '#2563eb' }}>
                    {tasks.filter(t => t.status === 'IN_PROGRESS').length}
                  </span>
                  <span style={{ fontSize: 10.5, fontWeight: '700', color: '#64748b', marginTop: 4 }}>In Progress</span>
                </div>
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: 18, fontWeight: '800', color: '#10b981' }}>
                    {tasks.filter(t => t.status === 'COMPLETED').length}
                  </span>
                  <span style={{ fontSize: 10.5, fontWeight: '700', color: '#64748b', marginTop: 4 }}>Completed</span>
                </div>
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: 18, fontWeight: '800', color: '#ef4444' }}>
                    {tasks.filter(t => t.priority === 'High').length}
                  </span>
                  <span style={{ fontSize: 10.5, fontWeight: '700', color: '#64748b', marginTop: 4 }}>High Priority</span>
                </div>
              </div>

              {/* Tasks List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 4 }}>
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: 14,
                      padding: 16,
                      backgroundColor: '#ffffff',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: 14, fontWeight: '800', color: '#0f172a', margin: 0 }}>{task.title}</h3>
                        <span style={{
                          fontSize: 9,
                          fontWeight: '800',
                          padding: '2px 6px',
                          borderRadius: 6,
                          textTransform: 'uppercase',
                          backgroundColor: task.priority === 'High' ? '#fef2f2' : '#fffbeb',
                          color: task.priority === 'High' ? '#ef4444' : '#b45309',
                          border: `1px solid ${task.priority === 'High' ? '#fca5a5' : '#fde047'}`
                        }}>
                          {task.priority}
                        </span>
                      </div>

                      <span style={{
                        fontSize: 9,
                        fontWeight: '800',
                        padding: '3px 8px',
                        borderRadius: 6,
                        letterSpacing: '0.2px',
                        backgroundColor: task.status === 'COMPLETED' ? '#d1fae5' : task.status === 'IN_PROGRESS' ? '#dbeafe' : '#fef3c7',
                        color: task.status === 'COMPLETED' ? '#047857' : task.status === 'IN_PROGRESS' ? '#1d4ed8' : '#d97706',
                        border: `1px solid ${task.status === 'COMPLETED' ? '#a7f3d0' : task.status === 'IN_PROGRESS' ? '#bfdbfe' : '#fde68a'}`
                      }}>
                        {task.status === 'IN_PROGRESS' ? 'IN PROGRESS' : task.status}
                      </span>
                    </div>

                    <p style={{ fontSize: 11.5, color: '#64748b', margin: 0, fontWeight: '500' }}>
                      {task.desc}
                    </p>

                    <div style={{ display: 'flex', gap: 16, alignItems: 'center', fontSize: 11, color: '#475569', fontWeight: '600' }}>
                      <span>⏰ {task.time}</span>
                      <span>🚪 {task.gate}</span>
                      <span>🚛 {task.unit}</span>
                    </div>

                    {task.notes && (
                      <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: 8, marginTop: 4 }}>
                        <p style={{ fontSize: 11, color: '#475569', margin: 0, fontStyle: 'italic', fontWeight: '500' }}>
                          📝 {task.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Close Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <button
                  onClick={() => setShowTasksModal(false)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 10,
                    padding: '10px 24px',
                    fontSize: 12.5,
                    fontWeight: '700',
                    color: '#334155',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 9: Task Details Overlay */}
      {showDetailsModal && selectedTask && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            width: '100%',
            maxWidth: 460,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Inter, Outfit, sans-serif'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 16.5, fontWeight: '800', color: '#0f172a', margin: 0 }}>Task Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: '#64748b' }}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left' }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: '800', color: '#64748b', display: 'block', letterSpacing: '0.5px' }}>TASK NAME</span>
                <span style={{ fontSize: 14.5, fontWeight: '800', color: '#0f172a', marginTop: 4, display: 'block' }}>{selectedTask.title}</span>
              </div>

              <div>
                <span style={{ fontSize: 10, fontWeight: '800', color: '#64748b', display: 'block', letterSpacing: '0.5px' }}>DESCRIPTION</span>
                <span style={{ fontSize: 12.5, color: '#334155', marginTop: 4, display: 'block', lineHeight: 1.5 }}>{selectedTask.desc}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <span style={{ fontSize: 10, fontWeight: '800', color: '#64748b', display: 'block', letterSpacing: '0.5px' }}>PRIORITY</span>
                  <span style={{ fontSize: 13, fontWeight: '700', color: selectedTask.priority === 'High' ? '#ef4444' : '#b45309', marginTop: 4, display: 'block' }}>
                    {selectedTask.priority}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: 10, fontWeight: '800', color: '#64748b', display: 'block', letterSpacing: '0.5px' }}>STATUS</span>
                  <span style={{ fontSize: 13, fontWeight: '700', color: selectedTask.status === 'COMPLETED' ? '#10b981' : selectedTask.status === 'IN_PROGRESS' ? '#2563eb' : '#d97706', marginTop: 4, display: 'block' }}>
                    {selectedTask.status}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: 10, fontWeight: '800', color: '#64748b', display: 'block', letterSpacing: '0.5px' }}>ASSIGNED LOCATION</span>
                  <span style={{ fontSize: 13, fontWeight: '700', color: '#0f172a', marginTop: 4, display: 'block' }}>{selectedTask.gate}</span>
                </div>
                <div>
                  <span style={{ fontSize: 10, fontWeight: '800', color: '#64748b', display: 'block', letterSpacing: '0.5px' }}>EQUIPMENT UNIT</span>
                  <span style={{ fontSize: 13, fontWeight: '700', color: '#0f172a', marginTop: 4, display: 'block' }}>{selectedTask.unit}</span>
                </div>
              </div>

              {selectedTask.notes && (
                <div>
                  <span style={{ fontSize: 10, fontWeight: '800', color: '#64748b', display: 'block', letterSpacing: '0.5px' }}>TASK NOTES</span>
                  <span style={{ fontSize: 12.5, color: '#475569', marginTop: 4, display: 'block', fontStyle: 'italic' }}>
                    📝 {selectedTask.notes}
                  </span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  style={{
                    backgroundColor: '#ffcc00',
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 24px',
                    fontSize: 12.5,
                    fontWeight: '800',
                    color: '#000000',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 10: Add Notes Nested Popup */}
      {showNotePopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1200
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            width: '100%',
            maxWidth: 440,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Inter, Outfit, sans-serif'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 16.5, fontWeight: '800', color: '#0f172a', margin: 0 }}>Add Notes</h2>
              <button
                onClick={() => setShowNotePopup(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: '#64748b' }}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: '800', color: '#64748b', letterSpacing: '0.5px' }}>NOTES</label>
                <textarea
                  rows="4"
                  placeholder="Type task updates, checklist status or cargo seal numbers..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '1px solid #cbd5e1',
                    fontSize: 13,
                    outline: 'none',
                    fontWeight: '500',
                    resize: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 4 }}>
                <button
                  onClick={() => setShowNotePopup(false)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 8,
                    padding: '8px 20px',
                    fontSize: 12,
                    fontWeight: '700',
                    color: '#334155',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setTasks(prev => prev.map(t => t.id === noteTaskId ? { ...t, notes: noteText } : t));
                    triggerToast('Note saved successfully.');
                    setShowNotePopup(false);
                  }}
                  style={{
                    backgroundColor: '#ffcc00',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 20px',
                    fontSize: 12,
                    fontWeight: '800',
                    color: '#000000',
                    cursor: 'pointer',
                    outline: 'none',
                    boxShadow: '0 2px 6px rgba(255, 204, 0, 0.2)'
                  }}
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 11: Contact Shift Supervisor */}
      {showSupervisorModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 24,
            width: '100%',
            maxWidth: 480,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Inter, Outfit, sans-serif'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 17, fontWeight: '800', color: '#0f172a', margin: 0 }}>Contact Shift Supervisor</h2>
              <button
                onClick={() => setShowSupervisorModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: '#64748b' }}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 18, textAlign: 'left' }}>
              {/* Supervisor Info Card */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 14,
                padding: '12px 16px'
              }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: '#ffcc00',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: '800',
                  color: '#000000'
                }}>
                  MT
                </div>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: '800', color: '#0f172a', margin: 0 }}>Michael Torres</h3>
                  <p style={{ fontSize: 11, color: '#64748b', margin: '2px 0 0 0', fontWeight: '600' }}>Shift Yard Supervisor (Active)</p>
                </div>
              </div>

              {/* Message Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: '800', color: '#64748b', letterSpacing: '0.5px' }}>MESSAGE *</label>
                <textarea
                  rows="4"
                  placeholder="Type your message for the supervisor..."
                  value={supervisorMessage}
                  onChange={(e) => setSupervisorMessage(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: '1px solid #cbd5e1',
                    fontSize: 13,
                    outline: 'none',
                    fontWeight: '500',
                    resize: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 4 }}>
                <button
                  onClick={() => setShowSupervisorModal(false)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 10,
                    padding: '10px 24px',
                    fontSize: 12.5,
                    fontWeight: '700',
                    color: '#334155',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!supervisorMessage.trim()) {
                      triggerToast('Please type a message first.');
                      return;
                    }
                    triggerToast('Message sent to Supervisor Michael Torres.');
                    setSupervisorMessage('');
                    setShowSupervisorModal(false);
                  }}
                  style={{
                    backgroundColor: '#ffcc00',
                    border: 'none',
                    borderRadius: 10,
                    padding: '10px 24px',
                    fontSize: 12.5,
                    fontWeight: '800',
                    color: '#000000',
                    cursor: 'pointer',
                    outline: 'none',
                    boxShadow: '0 2px 6px rgba(255, 204, 0, 0.2)'
                  }}
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Toast Notification Popup */}
      {toast && (
        <div className="yard-toast-popup settings-toast" style={{
          position: 'fixed',
          bottom: 30,
          right: 32,
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 12,
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          zIndex: 2000,
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
          maxWidth: 420,
          animation: 'slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          textAlign: 'left'
        }}>
          <div style={{
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            width: 22,
            height: 22,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12
          }}>
            ✓
          </div>
          <span style={{
            fontSize: 13,
            fontWeight: '600',
            color: '#1e40af',
            flex: 1
          }}>{toast}</span>
          <button
            onClick={() => setToast(null)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 16,
              color: '#64748b',
              cursor: 'pointer',
              marginLeft: 8
            }}
          >
            ✕
          </button>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

    </div>
  );
}
