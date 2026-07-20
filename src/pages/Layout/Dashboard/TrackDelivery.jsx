import React, { useState } from 'react';
import './CustomerDashboard.css';

// Step Icon Component
const StepIcon = ({ status }) => {
  if (status === 'completed') {
    return (
      <div style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        backgroundColor: '#fffbeb',
        border: '2px solid #FFCC00',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
    );
  }
  if (status === 'active') {
    return (
      <div style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        backgroundColor: '#f8fafc',
        border: '2px solid #0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
    );
  }
  // pending
  return (
    <div style={{
      width: 32,
      height: 32,
      borderRadius: '50%',
      backgroundColor: '#ffffff',
      border: '2px solid #cbd5e1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>
  );
};

const TrackDelivery = () => {
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportSubject, setSupportSubject] = useState('');
  const [supportDescription, setSupportDescription] = useState('');

  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    showToast('Support ticket submitted successfully.');
    setShowSupportModal(false);
    setSupportSubject('');
    setSupportDescription('');
  };

  const handleCallDriver = () => {
    showToast('Dialing Driver David Miller (+1-555-0199) - Simulated call.');
  };

  const handleMessageDriver = () => {
    showToast('Direct Message sent to driver mobile app.');
  };

  const timelineSteps = [
    { label: 'Booked', time: '06/27 10:00 AM', status: 'completed' },
    { label: 'Dispatched', time: '06/27 11:30 AM', status: 'completed' },
    { label: 'In Transit', time: '06/27 14:00 PM', status: 'active' },
    { label: 'Delivered', time: 'Estimated 17:45 PM', status: 'pending' }
  ];

  return (
    <div className="customer-dashboard">
      {/* Header Container */}
      <div className="customer-header-container">
        <div>
          <h1 className="customer-title">Customer Shipper Portal &bull; Tracking</h1>
          <p className="customer-subtitle">Request load deliveries, audit invoices, download BOL papers, and track active route paths.</p>
        </div>
        <button onClick={() => setShowSupportModal(true)} className="contact-support-btn">Contact Support</button>
      </div>

      {/* Grid Layout */}
      <div className="track-delivery-grid">
        {/* Left Side Details Panel */}
        <div style={S.leftCard}>
          <div>
            <span style={S.smallLabel}>ACTIVE TRACKING ID</span>
            <h2 style={S.trackingId}>LD-4657</h2>
            <span style={S.cargoText}>rtyu</span>
            <span style={S.routeText}>dfgh</span>
          </div>

          <div style={S.divider} />

          {/* Timeline Section */}
          <div>
            <span style={{ ...S.smallLabel, marginBottom: 16, display: 'block' }}>SHIPMENT TIMELINE</span>
            <div style={S.timelineContainer}>
              <div style={S.timelineLine} />
              {timelineSteps.map((step, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <StepIcon status={step.status} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{
                      fontSize: 13.5,
                      fontWeight: '800',
                      color: step.status === 'pending' ? '#94a3b8' : '#0f172a'
                    }}>
                      {step.label}
                    </span>
                    <span style={{
                      fontSize: 12,
                      color: step.status === 'pending' ? '#94a3b8' : '#64748b',
                      marginTop: 4
                    }}>
                      {step.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={S.divider} />

          {/* Carrier Details Section */}
          <div>
            <span style={{ ...S.smallLabel, marginBottom: 12, display: 'block' }}>ASSIGNED CARRIER DETAILS</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={S.avatar}>DM</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={S.carrierName}>David Miller</span>
                <span style={S.carrierPlate}>Plate: TR-9410 | Volvo FH16</span>
              </div>
            </div>
          </div>

          {/* ETA & SPEED status box */}
          <div style={S.etaSpeedBox}>
            <div>
              <span style={S.infoLabel}>ETA</span>
              <div style={S.etaValue}>17:45 PM</div>
            </div>
            <div>
              <span style={S.infoLabel}>SPEED</span>
              <div style={S.speedValue}>55 mph</div>
            </div>
          </div>

          {/* Actions Container */}
          <div style={S.actionsRow}>
            <button className="track-call-btn" onClick={handleCallDriver}>Call Driver</button>
            <button className="track-msg-btn" onClick={handleMessageDriver}>Message</button>
          </div>
        </div>

        {/* Right Side Map Panel */}
        <div style={S.rightCard}>
          <div>
            <h2 style={S.cardTitle}>Live Shipment Route GPS</h2>
            <p style={S.cardSubtitle}>Live coordinates matched.</p>
          </div>

          <div style={S.mapPlaceholder}>
            <div style={S.mapDot} />
          </div>
        </div>
      </div>

      {/* Support Ticket Modal (Drawer) */}
      {showSupportModal && (
        <div style={S.modalOverlay} onClick={() => setShowSupportModal(false)}>
          <div style={S.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={S.modalHeader}>
              <h2 style={S.modalTitle}>Shipper Help Desk &amp; Ticket Center</h2>
              <button onClick={() => setShowSupportModal(false)} style={S.closeBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSupportSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={S.modalBody}>
                <div style={S.fieldGroup}>
                  <label style={S.fieldLabel}>SUBJECT HEADING</label>
                  <input
                    type="text"
                    value={supportSubject}
                    onChange={(e) => setSupportSubject(e.target.value)}
                    placeholder="e.g. Shipment update delay"
                    style={S.textInput}
                    required
                  />
                </div>

                <div style={S.fieldGroup}>
                  <label style={S.fieldLabel}>PROBLEM DESCRIPTION</label>
                  <textarea
                    value={supportDescription}
                    onChange={(e) => setSupportDescription(e.target.value)}
                    placeholder="Please provide specific details..."
                    style={S.textareaInput}
                    required
                  />
                </div>
              </div>

              <div style={S.modalFooter}>
                <button type="button" onClick={() => setShowSupportModal(false)} style={S.btnCancel}>Cancel</button>
                <button type="submit" style={S.btnSubmit}>Submit Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="settings-toast" style={S.toastContainer}>
          <div style={S.toastIcon}>✓</div>
          <span style={S.toastText}>{toast}</span>
          <button onClick={() => setToast(null)} style={S.toastCloseBtn}>✕</button>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(245, 158, 11, 0); }
          100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
        }
      `}</style>
    </div>
  );
};

/* ─── Styles Object ─── */
const S = {
  leftCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: '24px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    display: 'flex',
    flexDirection: 'column'
  },
  smallLabel: {
    display: 'block',
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: '0.5px'
  },
  trackingId: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    margin: '6px 0 4px 0'
  },
  cargoText: {
    fontSize: 13,
    color: '#475569',
    display: 'block'
  },
  routeText: {
    fontSize: 13,
    color: '#64748b',
    display: 'block',
    marginTop: 2
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    margin: '20px 0'
  },
  timelineContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    paddingLeft: 8
  },
  timelineLine: {
    position: 'absolute',
    left: 23.5,
    top: 16,
    bottom: 16,
    width: 2,
    backgroundColor: '#e2e8f0',
    zIndex: 1
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    backgroundColor: '#f1f5f9',
    border: '1px solid #cbd5e1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a'
  },
  carrierName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0f172a'
  },
  carrierPlate: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2
  },
  etaSpeedBox: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    border: '1.5px solid #f1f5f9',
    borderRadius: 12,
    padding: '14px 20px',
    backgroundColor: '#ffffff',
    marginTop: 24
  },
  infoLabel: {
    display: 'block',
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: '0.5px'
  },
  etaValue: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#b45309',
    marginTop: 4
  },
  speedValue: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#10b981',
    marginTop: 4
  },
  actionsRow: {
    display: 'flex',
    gap: 12,
    marginTop: 20
  },
  rightCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: '24px 32px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    margin: 0
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748b',
    margin: '4px 0 0 0'
  },
  mapPlaceholder: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    height: '100%',
    minHeight: 480,
    marginTop: 16,
    position: 'relative',
    backgroundImage: `
      radial-gradient(#cbd5e1 1.5px, transparent 1.5px),
      radial-gradient(#cbd5e1 1.5px, transparent 1.5px)
    `,
    backgroundSize: '24px 24px',
    backgroundPosition: '0 0, 12px 12px'
  },
  mapDot: {
    width: 14,
    height: 14,
    backgroundColor: '#f59e0b',
    borderRadius: '50%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: '0 0 0 8px rgba(245, 158, 11, 0.25)',
    animation: 'pulse 2s infinite'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    backdropFilter: 'blur(3px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 1000,
    fontFamily: "'Outfit', 'Inter', sans-serif"
  },
  modalContent: {
    backgroundColor: '#ffffff',
    height: '100%',
    width: '100%',
    maxWidth: 450,
    boxShadow: '-10px 0 25px -5px rgba(0, 0, 0, 0.1), -5px 0 10px -5px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
    borderLeft: '1px solid #e2e8f0',
    borderRadius: '16px 0 0 16px',
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
  },
  modalHeader: {
    padding: '24px 28px',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    margin: 0
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'background-color 0.15s ease'
  },
  modalBody: {
    padding: '28px',
    flex: 1
  },
  fieldGroup: {
    marginBottom: 20
  },
  fieldLabel: {
    display: 'block',
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    marginBottom: 8,
    letterSpacing: '0.5px'
  },
  textInput: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 8,
    border: '1px solid #cbd5e1',
    fontSize: 14,
    color: '#334155',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s ease'
  },
  textareaInput: {
    width: '100%',
    height: 120,
    padding: '12px 16px',
    borderRadius: 8,
    border: '1px solid #cbd5e1',
    fontSize: 14,
    color: '#334155',
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'none',
    transition: 'border-color 0.15s ease'
  },
  modalFooter: {
    padding: '20px 28px 28px 28px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
    borderTop: '1px solid #f1f5f9'
  },
  btnCancel: {
    backgroundColor: '#ffffff',
    color: '#0f172a',
    border: '1px solid #cbd5e1',
    borderRadius: 30,
    padding: '10px 24px',
    fontSize: 13,
    fontWeight: '800',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  btnSubmit: {
    backgroundColor: '#FFCC00',
    color: '#000000',
    border: 'none',
    borderRadius: 30,
    padding: '10px 28px',
    fontSize: 13,
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(255, 204, 0, 0.35)',
    transition: 'all 0.15s ease'
  },
  toastContainer: {
    position: 'fixed',
    bottom: 40,
    right: 32,
    backgroundColor: '#ecfdf5',
    border: '1px solid #a7f3d0',
    borderRadius: 12,
    padding: '14px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    zIndex: 1100,
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
    maxWidth: 420,
    animation: 'slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
  },
  toastIcon: {
    color: '#10b981',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 1
  },
  toastText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#065f46',
    flex: 1
  },
  toastCloseBtn: {
    background: 'none',
    border: 'none',
    fontSize: 16,
    color: '#64748b',
    cursor: 'pointer',
    padding: 0,
    lineHeight: 1
  }
};

export default TrackDelivery;
