import React, { useState } from 'react';
import './CustomerDashboard.css';

// SVG Magnifying Glass Icon for Search
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

// SVG Trash Icon for Delete Button
const TrashIcon = ({ color }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const CustomerNotifications = () => {
  // Mock Notifications Data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'Shipment',
      title: 'Load REQ-9912 Dispatched',
      time: '2 min ago',
      description: 'Your booking REQ-9912 has been matched with driver David Miller. ETA is 17:45 PM today.',
      unread: true
    },
    {
      id: 2,
      type: 'Invoice',
      title: 'New Invoice Issued',
      time: '15 min ago',
      description: 'Invoice INV-3981 for $950.00 is ready for review.',
      unread: true
    },
    {
      id: 3,
      type: 'Payment',
      title: 'Payment Settled',
      time: '2 hours ago',
      description: 'Tax Invoice INV-3980 payment was processed and approved.',
      unread: false
    },
    {
      id: 4,
      type: 'Shipment',
      title: 'Shipment Delivered',
      time: 'Yesterday',
      description: 'Load LD-9411 was delivered to Springfield Depot. Signed POD uploaded.',
      unread: false
    }
  ]);

  // UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All Alerts'); // All Alerts, Unread, Shipment Updates, Invoice Alerts, Payments
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportSubject, setSupportSubject] = useState('');
  const [supportDescription, setSupportDescription] = useState('');
  const [toast, setToast] = useState(null);

  // Helper to trigger Toast alerts
  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // Mark all unread notifications as read
  const handleMarkAllRead = () => {
    const hasUnread = notifications.some(n => n.unread);
    if (hasUnread) {
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
      triggerToast('All notifications marked as read.');
    } else {
      triggerToast('No unread notifications.');
    }
  };

  // Mark single notification as read
  const handleMarkRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    triggerToast('Notification marked as read.');
  };

  // Delete notification
  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    triggerToast('Notification deleted successfully.');
  };

  // Support Ticket Form Submit
  const handleSupportSubmit = (e) => {
    e.preventDefault();
    triggerToast('Support ticket submitted successfully.');
    setShowSupportModal(false);
    setSupportSubject('');
    setSupportDescription('');
  };

  // Filters logic
  const filteredNotifications = notifications.filter(n => {
    // 1. Filter by Search Query
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = n.title.toLowerCase().includes(searchLower) || 
                          n.description.toLowerCase().includes(searchLower);

    if (!matchesSearch) return false;

    // 2. Filter by Alert Category Type Dropdown
    if (filterType === 'Unread') return n.unread;
    if (filterType === 'Shipment Updates') return n.type === 'Shipment';
    if (filterType === 'Invoice Alerts') return n.type === 'Invoice';
    if (filterType === 'Payments') return n.type === 'Payment';
    
    return true; // 'All Alerts'
  });

  // Get Badge Style depending on type
  const getBadgeStyle = (type) => {
    switch (type) {
      case 'Shipment':
        return {
          backgroundColor: '#e0f2fe',
          color: '#0284c7'
        };
      case 'Invoice':
        return {
          backgroundColor: '#fef3c7',
          color: '#d97706'
        };
      case 'Payment':
        return {
          backgroundColor: '#dcfce7',
          color: '#16a34a'
        };
      default:
        return {
          backgroundColor: '#f1f5f9',
          color: '#475569'
        };
    }
  };

  return (
    <div className="customer-dashboard documents-wrapper" style={{ padding: '16px 20px', width: '100%', maxWidth: 'none' }}>
      {/* Header Panel */}
      <div className="customer-header-container" style={{ flexShrink: 0 }}>
        <div>
          <h1 className="customer-title" style={{ fontSize: '20px', fontWeight: '800' }}>Customer Shipper Portal &bull; Notifications</h1>
          <p className="customer-subtitle" style={{ fontSize: '12.5px', marginTop: '2px' }}>Request load deliveries, audit invoices, download BOL papers, and track active route paths.</p>
        </div>
        <button onClick={() => setShowSupportModal(true)} className="contact-support-btn" style={{ fontSize: '12px', padding: '6px 14px' }}>Contact Support</button>
      </div>

      {/* Main Single Card Panel */}
      <div style={S.mainCard}>
        {/* Card Header & Controls */}
        <div style={S.cardHeader}>
          <div style={S.headerLeft}>
            <h2 style={S.cardTitle}>Customer Notifications Log</h2>
            <p style={S.cardSubtitle}>Live operational and billing status updates.</p>
          </div>

          <div style={S.headerRight}>
            {/* Search Input field */}
            <div style={S.searchWrapper}>
              <span style={S.searchIconContainer}><SearchIcon /></span>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={S.searchInput}
              />
            </div>

            {/* Filter Dropdown */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={S.filterDropdown}
            >
              <option value="All Alerts">All Alerts</option>
              <option value="Unread">Unread</option>
              <option value="Shipment Updates">Shipment Updates</option>
              <option value="Invoice Alerts">Invoice Alerts</option>
              <option value="Payments">Payments</option>
            </select>

            {/* Mark All Read Button */}
            <button onClick={handleMarkAllRead} style={S.markAllReadBtn}>
              Mark All Read
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div style={S.listWrapper}>
          {filteredNotifications.length === 0 ? (
            <div style={S.emptyState}>
              <span style={{ fontSize: 24, marginBottom: 8, display: 'block' }}>🔔</span>
              <p style={{ margin: 0, fontWeight: '600', color: '#94a3b8' }}>No notifications found</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                style={{
                  ...S.notifCard,
                  backgroundColor: notif.unread ? '#fffbeb' : '#ffffff',
                  borderColor: notif.unread ? '#fde047' : '#e2e8f0',
                  boxShadow: notif.unread ? '0 2px 8px rgba(253, 224, 71, 0.15)' : 'none'
                }}
              >
                {/* Left Side: Badge and Info */}
                <div style={S.notifLeft}>
                  <div style={S.badgeContainer}>
                    <span style={{ ...S.badge, ...getBadgeStyle(notif.type) }}>
                      {notif.type}
                    </span>
                  </div>
                  <div style={S.textContainer}>
                    <div style={S.notifTitleRow}>
                      <span style={S.notifTitle}>{notif.title}</span>
                      <span style={S.notifTime}>({notif.time})</span>
                    </div>
                    <p style={S.notifDesc}>{notif.description}</p>
                  </div>
                </div>

                {/* Right Side: Action Buttons */}
                <div style={S.notifRight}>
                  {notif.unread && (
                    <button
                      onClick={() => handleMarkRead(notif.id)}
                      style={S.markReadBtn}
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notif.id)}
                    style={{
                      ...S.deleteBtn,
                      borderColor: notif.unread ? '#fde047' : '#cbd5e1'
                    }}
                    title="Delete Notification"
                  >
                    <TrashIcon color="#d97706" />
                  </button>
                </div>
              </div>
            ))
          )}
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
        <div style={S.toastContainer}>
          <div style={S.toastIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <span style={S.toastText}>{toast}</span>
          <button onClick={() => setToast(null)} style={S.toastCloseBtn}>✕</button>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

/* Styles Object */
const S = {
  mainCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: '16px 20px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    boxSizing: 'border-box',
    overflowY: 'hidden',
    marginTop: 16,
    flex: 1,
    width: '100%',
    maxWidth: 'none'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 16
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  },
  cardTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0f172a',
    margin: 0
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748b',
    margin: 0,
    fontWeight: '500'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap'
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  searchIconContainer: {
    position: 'absolute',
    left: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none'
  },
  searchInput: {
    width: 160,
    padding: '5px 12px 5px 32px',
    borderRadius: 20,
    border: '1px solid #cbd5e1',
    fontSize: 12,
    color: '#334155',
    outline: 'none',
    transition: 'all 0.15s ease',
    boxSizing: 'border-box'
  },
  filterDropdown: {
    padding: '5px 12px',
    borderRadius: 8,
    border: '1px solid #cbd5e1',
    fontSize: 12,
    color: '#334155',
    outline: 'none',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    fontWeight: '600'
  },
  markAllReadBtn: {
    backgroundColor: '#ffffff',
    border: '1px solid #fde047',
    borderRadius: 20,
    padding: '5px 14px',
    color: '#b45309',
    fontSize: 12,
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    outline: 'none',
    boxSizing: 'border-box',
    whiteSpace: 'nowrap'
  },
  listWrapper: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    paddingRight: 6
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 0',
    textAlign: 'center'
  },
  notifCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    padding: '10px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.2s ease',
    gap: 16,
    flexWrap: 'wrap'
  },
  notifLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
    minWidth: 250
  },
  badgeContainer: {
    marginTop: 2,
    flexShrink: 0
  },
  badge: {
    display: 'inline-block',
    fontSize: 9.5,
    fontWeight: '700',
    padding: '3px 8px',
    borderRadius: 20,
    textTransform: 'capitalize',
    letterSpacing: '0.2px',
    whiteSpace: 'nowrap'
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4
  },
  notifTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap'
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a'
  },
  notifTime: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500'
  },
  notifDesc: {
    fontSize: 12.5,
    color: '#475569',
    margin: 0,
    lineHeight: '1.4'
  },
  notifRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },
  markReadBtn: {
    backgroundColor: '#ffffff',
    border: '1px solid #cbd5e1',
    borderRadius: 20,
    padding: '4px 10px',
    color: '#475569',
    fontSize: 11,
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    outline: 'none',
    boxSizing: 'border-box',
    whiteSpace: 'nowrap'
  },
  deleteBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: '50%',
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    outline: 'none'
  },
  // Modal styles
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
  // Toast styles
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
    backgroundColor: '#10b981',
    color: '#ffffff',
    width: 22,
    height: 22,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
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

export default CustomerNotifications;
