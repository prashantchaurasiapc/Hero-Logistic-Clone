import React, { useState } from 'react';
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

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

export default function YardScan() {
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showYardMapModal, setShowYardMapModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // QR Modal form state
  const [scanType, setScanType] = useState('Trailer');
  const [scannedId, setScannedId] = useState('');
  const [validationError, setValidationError] = useState('');

  // Incident Modal form state
  const [incidentType, setIncidentType] = useState('Accident');
  const [incidentLocation, setIncidentLocation] = useState('');
  const [incidentDescription, setIncidentDescription] = useState('');
  const [incidentSeverity, setIncidentSeverity] = useState('Medium');

  // Hover states
  const [hoveredButtonId, setHoveredButtonId] = useState(null);

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
    }
  ]);

  // Toast notifications state
  const [toast, setToast] = useState(null);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    triggerToast('All notifications marked as read.');
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  // Yard Map parking slots
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

  const handleScanClick = (type) => {
    setScanType(type);
    setScannedId('');
    setValidationError('');
    setShowQrModal(true);
  };

  const submitScan = (e) => {
    e.preventDefault();
    if (!scannedId.trim()) {
      setValidationError('Please fill out this field.');
      return;
    }
    triggerToast(`Scanned ${scanType} ID: ${scannedId} successfully!`);
    setShowQrModal(false);
  };

  return (
    <div className="customer-dashboard" style={{ height: 'calc(100vh - 125px)', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden', padding: 0, width: '100%', maxWidth: 'none', fontFamily: "'Outfit', 'Inter', sans-serif" }}>


      {/* Header Panel */}
      <div className="customer-header-container" style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>🚧</span>
          <div style={{ textAlign: 'left' }}>
            <h1 className="customer-title" style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>Yard Attendant &bull; Scan Btn</h1>
            <p className="customer-subtitle" style={{ fontSize: '12.5px', marginTop: '2px', color: '#64748b' }}>Perform gate checks, inspect trailers, and log spotted containers.</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', minHeight: 0, width: '100%' }}>

        {/* Scanner Container Box */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 0,
          padding: '24px 20px',
          width: '100%',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          borderTop: '1px solid #e2e8f0',
          borderBottom: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          textAlign: 'left'
        }}>
          <h2 style={{ fontSize: 16, fontWeight: '800', color: '#0f172a', margin: 0 }}>Barcode & Asset Scanner</h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 24px 0' }}>
            Select code type and scan physical items in the yard.
          </p>

          {/* Three Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {/* Card 1: Scan Item */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 16,
              padding: '24px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: 180,
              boxSizing: 'border-box'
            }}>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>Scan Item</h3>
                <p style={{ fontSize: 11.5, color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                  Scan general freight pallets, boxes, or auxiliary assets.
                </p>
              </div>
              <button
                onClick={() => handleScanClick('Item')}
                onMouseEnter={() => setHoveredButtonId('scan-item-btn')}
                onMouseLeave={() => setHoveredButtonId(null)}
                style={{
                  backgroundColor: '#ffcc00',
                  color: '#000000',
                  border: hoveredButtonId === 'scan-item-btn' ? '2px solid #000000' : '1px solid transparent',
                  borderRadius: 12,
                  padding: '12px 20px',
                  fontSize: 13,
                  fontWeight: '800',
                  cursor: 'pointer',
                  outline: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 2px 4px rgba(255, 204, 0, 0.15)',
                  transition: 'all 0.15s ease'
                }}
              >
                <QrCodeIcon /> Scan Item
              </button>
            </div>

            {/* Card 2: Scan VIN */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 16,
              padding: '24px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: 180,
              boxSizing: 'border-box'
            }}>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>Scan VIN</h3>
                <p style={{ fontSize: 11.5, color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                  Scan vehicle windshield barcode tags to resolve VIN stock numbers.
                </p>
              </div>
              <button
                onClick={() => handleScanClick('VIN')}
                onMouseEnter={() => setHoveredButtonId('scan-vin-btn')}
                onMouseLeave={() => setHoveredButtonId(null)}
                style={{
                  backgroundColor: '#ffcc00',
                  color: '#000000',
                  border: hoveredButtonId === 'scan-vin-btn' ? '2px solid #000000' : '1px solid transparent',
                  borderRadius: 12,
                  padding: '12px 20px',
                  fontSize: 13,
                  fontWeight: '800',
                  cursor: 'pointer',
                  outline: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 2px 4px rgba(255, 204, 0, 0.15)',
                  transition: 'all 0.15s ease'
                }}
              >
                <QrCodeIcon /> Scan VIN
              </button>
            </div>

            {/* Card 3: Scan Barcode */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 16,
              padding: '24px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: 180,
              boxSizing: 'border-box'
            }}>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: '800', color: '#0f172a', margin: '0 0 8px 0' }}>Scan Barcode</h3>
                <p style={{ fontSize: 11.5, color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                  Scan standard cargo labels, supplier shipping tags, or BOLs.
                </p>
              </div>
              <button
                onClick={() => handleScanClick('Barcode')}
                onMouseEnter={() => setHoveredButtonId('scan-bc-btn')}
                onMouseLeave={() => setHoveredButtonId(null)}
                style={{
                  backgroundColor: '#ffcc00',
                  color: '#000000',
                  border: hoveredButtonId === 'scan-bc-btn' ? '2px solid #000000' : '1px solid transparent',
                  borderRadius: 12,
                  padding: '12px 20px',
                  fontSize: 13,
                  fontWeight: '800',
                  cursor: 'pointer',
                  outline: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 2px 4px rgba(255, 204, 0, 0.15)',
                  transition: 'all 0.15s ease'
                }}
              >
                <QrCodeIcon /> Scan Barcode
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MODALS ──────────────────────────────────────────────────────── */}

      {/* MODAL 1: Notifications */}
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
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 16.5, fontWeight: '800', color: '#0f172a', margin: 0 }}>Notifications</h2>
              <button
                onClick={() => setShowNotificationsModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: '#64748b' }}
              >
                <CloseIcon />
              </button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: '700', color: '#64748b' }}>{unreadCount} unread</span>
                <button
                  onClick={handleMarkAllRead}
                  style={{ background: 'none', border: 'none', color: '#b45309', fontSize: 12, fontWeight: '700', cursor: 'pointer', outline: 'none' }}
                >
                  Mark all read
                </button>
              </div>
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
                      <span style={{ fontSize: 12.5, fontWeight: '800', color: n.type === 'emergency' ? '#ef4444' : '#0f172a' }}>
                        {n.type === 'emergency' && '🚨 '}{n.title}
                      </span>
                      <span style={{ fontSize: 10, color: '#94a3b8' }}>{n.time}</span>
                    </div>
                    <p style={{ fontSize: 11.5, color: '#64748b', margin: 0, fontWeight: '500', lineHeight: 1.4 }}>
                      {n.desc}
                    </p>
                    {n.unread && (
                      <span style={{ position: 'absolute', top: 14, right: 14, width: 6, height: 6, borderRadius: '50%', backgroundColor: '#3b82f6' }}></span>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <button
                  onClick={() => setShowNotificationsModal(false)}
                  style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 8, padding: '8px 24px', fontSize: 12, fontWeight: '700', color: '#334155', cursor: 'pointer', outline: 'none' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Yard Map */}
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
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 16.5, fontWeight: '800', color: '#0f172a', margin: 0 }}>Yard Map &mdash; Parking Grid</h2>
              <button
                onClick={() => setShowYardMapModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: '#64748b' }}
              >
                <CloseIcon />
              </button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginTop: 8 }}>
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
                      boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                    }}
                  >
                    <span style={{ fontSize: 11.5, fontWeight: '800', color: slot.color }}>{slot.id}</span>
                    <span style={{ fontSize: 9.5, fontWeight: '600', color: slot.color, marginTop: 4 }}>{slot.val}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                <button
                  onClick={() => setShowYardMapModal(false)}
                  style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 8, padding: '8px 24px', fontSize: 12, fontWeight: '700', color: '#334155', cursor: 'pointer', outline: 'none' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: QR / Barcode Scanner */}
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
            maxWidth: 420,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 18, fontWeight: '800', color: '#0f172a', margin: 0 }}>QR / Barcode Scanner</h2>
              <button
                onClick={() => setShowQrModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: '#64748b' }}
              >
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={submitScan} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
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
                    backgroundColor: '#ffffff'
                  }}
                >
                  <option value="Trailer">Trailer</option>
                  <option value="Container">Container</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Item">Item</option>
                  <option value="VIN">VIN</option>
                  <option value="Barcode">Barcode</option>
                </select>
              </div>

              <div style={{
                height: 120,
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder={`Enter ${scanType} ID (e.g. TR-9410, CTR-009, VIN-882)...`}
                    value={scannedId}
                    onChange={(e) => {
                      setScannedId(e.target.value);
                      if (e.target.value.trim()) setValidationError('');
                    }}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: 12,
                      border: validationError ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                      fontSize: 13,
                      outline: 'none',
                      fontWeight: '500',
                      color: '#0f172a',
                      backgroundColor: '#ffffff'
                    }}
                  />
                  <button
                    type="submit"
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
                    <QrCodeIcon /> Scan
                  </button>
                </div>
                {validationError && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: 6,
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 6,
                    padding: '6px 12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    zIndex: 10,
                    fontSize: 11.5,
                    color: '#0f172a'
                  }}>
                    <span style={{ backgroundColor: '#ef4444', color: '#ffffff', width: 14, height: 14, borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: '800' }}>!</span>
                    <span>{validationError}</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowQrModal(false)}
                  style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 8, padding: '8px 24px', fontSize: 12, fontWeight: '700', color: '#334155', cursor: 'pointer', outline: 'none' }}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Report Incident */}
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
            maxHeight: '90vh'
          }}>
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
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto', textAlign: 'left' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: '800', color: '#475569', letterSpacing: '0.5px' }}>INCIDENT TYPE *</label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #ffcc00', fontSize: 13, color: '#0f172a', fontWeight: '600', outline: 'none', backgroundColor: '#ffffff' }}
                >
                  <option value="Accident">🚗 Accident</option>
                  <option value="Damage">💥 Damage</option>
                  <option value="Unsafe Condition">⚠️ Unsafe Condition</option>
                  <option value="Spill">🛢️ Spill</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: '800', color: '#475569', letterSpacing: '0.5px' }}>LOCATION / AREA *</label>
                <input
                  type="text"
                  placeholder="e.g. Dock B2, near Gate 3"
                  value={incidentLocation}
                  onChange={(e) => setIncidentLocation(e.target.value)}
                  style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 13, outline: 'none', fontWeight: '500' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: '800', color: '#475569', letterSpacing: '0.5px' }}>DESCRIPTION *</label>
                <textarea
                  rows="3"
                  placeholder="Describe what happened..."
                  value={incidentDescription}
                  onChange={(e) => setIncidentDescription(e.target.value)}
                  style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 13, outline: 'none', fontWeight: '500', resize: 'none', fontFamily: 'inherit' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: '800', color: '#475569', letterSpacing: '0.5px' }}>SEVERITY</label>
                <select
                  value={incidentSeverity}
                  onChange={(e) => setIncidentSeverity(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 13, color: '#0f172a', fontWeight: '600', outline: 'none', backgroundColor: '#ffffff' }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowIncidentModal(false)}
                  style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 10, padding: '10px 24px', fontSize: 12.5, fontWeight: '700', color: '#334155', cursor: 'pointer', outline: 'none' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerToast(`Incident report submitted successfully.`);
                    setShowIncidentModal(false);
                  }}
                  style={{ backgroundColor: '#dc2626', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 12.5, fontWeight: '800', color: '#ffffff', cursor: 'pointer', outline: 'none', boxShadow: '0 2px 8px rgba(220, 38, 38, 0.25)' }}
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Toast Notification Popup */}
      {toast && (
        <div style={{
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
          textAlign: 'left'
        }}>
          <div style={{ backgroundColor: '#3b82f6', color: '#ffffff', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>✓</div>
          <span style={{ fontSize: 13, fontWeight: '600', color: '#1e40af', flex: 1 }}>{toast}</span>
          <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', fontSize: 16, color: '#64748b', cursor: 'pointer', marginLeft: 8 }}>✕</button>
        </div>
      )}

    </div>
  );
}
