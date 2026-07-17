import React, { useState, useEffect, useRef } from 'react';
import './CustomerDashboard.css';

// SVG Icons
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const SendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const EmojiIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}>
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
    <line x1="9" y1="9" x2="9.01" y2="9"></line>
    <line x1="15" y1="9" x2="15.01" y2="9"></line>
  </svg>
);

const AttachmentIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}>
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
  </svg>
);

const MicIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}>
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
    <line x1="8" y1="23" x2="16" y2="23"></line>
  </svg>
);

const DoubleCheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
    <path d="M17 6L8.5 14.5L5 11M22 6L13.5 14.5" />
  </svg>
);

const CustomerDispatcherChat = () => {
  // Dispatchers & Message Histories State
  const [dispatchers, setDispatchers] = useState([
    {
      id: 'alex',
      name: 'Alex Rivera',
      role: 'Lead Dispatch',
      initials: 'AR',
      status: 'Online',
      statusColor: '#10b981',
      chatChannelStatus: 'Active chat channel',
      messages: [
        {
          id: 1,
          sender: 'dispatcher',
          text: 'Hi! I am your dispatch support today. Let me know if you need assistance with bookings or tracking.',
          time: '10:00 AM'
        },
        {
          id: 2,
          sender: 'customer',
          text: 'Hello, is there an updated ETA for Springfield shipment REQ-9912?',
          time: '10:02 AM'
        },
        {
          id: 3,
          sender: 'dispatcher',
          text: 'Checking on that now. The driver is currently passing Bloomington IL. Still on track for 17:45 PM.',
          time: '10:03 AM'
        }
      ]
    },
    {
      id: 'sophia',
      name: 'Sophia Chen',
      role: 'Night Shift',
      initials: 'SC',
      status: 'Offline',
      statusColor: '#64748b',
      chatChannelStatus: 'Offline',
      messages: [
        {
          id: 1,
          sender: 'dispatcher',
          text: 'Hi! Sophia Chen here. I will be handling the night shift dispatcher queue.',
          time: '08:00 PM'
        },
        {
          id: 2,
          sender: 'customer',
          text: 'Hi Sophia, just checking if shipment REQ-9913 is departed.',
          time: '08:15 PM'
        },
        {
          id: 3,
          sender: 'dispatcher',
          text: 'Yes, it departed Springfield depot at 08:10 PM. On schedule.',
          time: '08:18 PM'
        }
      ]
    }
  ]);

  // Active UI States
  const [selectedId, setSelectedId] = useState('alex');
  const [searchQuery, setSearchQuery] = useState('');
  const [typedMessage, setTypedMessage] = useState('');
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportSubject, setSupportSubject] = useState('');
  const [supportDescription, setSupportDescription] = useState('');
  const [hotlineToast, setHotlineToast] = useState(false);
  const [toast, setToast] = useState(null);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedId, dispatchers]);

  // Active Dispatcher Object helper
  const activeDispatcher = dispatchers.find(d => d.id === selectedId) || dispatchers[0];

  // Send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const timeStr = `${hours}:${minutes} ${ampm}`;

    const newMsg = {
      id: Date.now(),
      sender: 'customer',
      text: typedMessage,
      time: timeStr
    };

    setDispatchers(prev => prev.map(d => {
      if (d.id === selectedId) {
        return {
          ...d,
          messages: [...d.messages, newMsg]
        };
      }
      return d;
    }));

    setTypedMessage('');
  };

  // Hotline Trigger
  const triggerHotline = () => {
    setHotlineToast(true);
  };

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // Support Drawer submission
  const handleSupportSubmit = (e) => {
    e.preventDefault();
    triggerToast('Support ticket submitted successfully.');
    setShowSupportModal(false);
    setSupportSubject('');
    setSupportDescription('');
  };

  // Filter dispatchers by search input
  const filteredDispatchers = dispatchers.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="customer-dashboard" style={{ height: 'calc(100vh - 125px)', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden', padding: '16px 20px', width: '100%', maxWidth: 'none' }}>
      {/* Header Panel */}
      <div className="customer-header-container" style={{ flexShrink: 0 }}>
        <div>
          <h1 className="customer-title" style={{ fontSize: '20px', fontWeight: '800' }}>Customer Shipper Portal &bull; Chat</h1>
          <p className="customer-subtitle" style={{ fontSize: '12.5px', marginTop: '2px' }}>Request load deliveries, audit invoices, download BOL papers, and track active route paths.</p>
        </div>
        <button onClick={() => setShowSupportModal(true)} className="contact-support-btn" style={{ fontSize: '12px', padding: '6px 14px' }}>Contact Support</button>
      </div>

      {/* Main Grid: Sidebar + Chat Room */}
      <div style={{ display: 'flex', gap: '16px', flex: 1, minHeight: 0, marginTop: 16 }}>
        
        {/* Left Sidebar Panel */}
        <div style={S.sidebarPanel}>
          {/* Search Bar */}
          <div style={S.searchWrapper}>
            <span style={S.searchIconContainer}><SearchIcon /></span>
            <input
              type="text"
              placeholder="Search dispatcher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={S.searchInput}
            />
          </div>

          {/* Dispatcher list */}
          <div style={S.listContainer}>
            {filteredDispatchers.length === 0 ? (
              <div style={S.emptyList}>No dispatchers found</div>
            ) : (
              filteredDispatchers.map((disp) => {
                const isActive = disp.id === selectedId;
                return (
                  <div
                    key={disp.id}
                    onClick={() => setSelectedId(disp.id)}
                    style={{
                      ...S.dispatcherCard,
                      backgroundColor: isActive ? '#fffbeb' : '#ffffff',
                      borderColor: isActive ? '#fde047' : '#e2e8f0',
                      boxShadow: isActive ? '0 2px 8px rgba(253, 224, 71, 0.15)' : 'none'
                    }}
                  >
                    <div style={S.cardLeft}>
                      <div style={S.initialsCircle}>{disp.initials}</div>
                      <div style={S.cardDetails}>
                        <div style={S.dispName}>{disp.name} ({disp.role})</div>
                        <div style={S.dispStatusSub}>{disp.status}</div>
                      </div>
                    </div>
                    <div
                      style={{
                        ...S.statusDot,
                        backgroundColor: disp.status === 'Online' ? '#10b981' : '#64748b'
                      }}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Chat panel */}
        <div style={S.chatPanel}>
          {/* Chat Panel Header */}
          <div style={S.chatHeader}>
            <div style={S.chatHeaderLeft}>
              <div style={S.initialsCircle}>{activeDispatcher.initials}</div>
              <div style={S.chatHeaderInfo}>
                <div style={S.chatHeaderName}>{activeDispatcher.name} ({activeDispatcher.role})</div>
                <div style={{ ...S.chatHeaderStatus, color: activeDispatcher.status === 'Online' ? '#10b981' : '#64748b' }}>
                  {activeDispatcher.chatChannelStatus}
                </div>
              </div>
            </div>
            
            {/* Call Dispatch Button */}
            <button onClick={triggerHotline} style={S.callBtn}>
              Call Dispatch
            </button>
          </div>

          {/* Chat Messages Feed Area */}
          <div style={S.chatFeed}>
            {activeDispatcher.messages.map((msg) => {
              const isCust = msg.sender === 'customer';
              return (
                <div
                  key={msg.id}
                  style={{
                    ...S.messageRow,
                    alignSelf: isCust ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div
                    style={{
                      ...S.messageBubble,
                      backgroundColor: isCust ? '#FFD400' : '#f8fafc',
                      borderColor: isCust ? '#FFE082' : '#e2e8f0',
                      color: isCust ? '#000000' : '#334155',
                      borderRadius: isCust ? '12px 12px 0 12px' : '12px 12px 12px 0'
                    }}
                  >
                    <div style={S.messageText}>{msg.text}</div>
                    <div
                      style={{
                        ...S.messageTime,
                        color: isCust ? '#854d0e' : '#94a3b8'
                      }}
                    >
                      {msg.time}
                      {isCust && (
                        <span style={{ marginLeft: 4, display: 'inline-flex', alignItems: 'center' }}>
                          <DoubleCheckIcon />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Footer Area */}
          <form onSubmit={handleSendMessage} style={S.chatFooter}>
            {/* Quick Actions Icons */}
            <div style={S.iconsGroup}>
              <EmojiIcon />
              <AttachmentIcon />
              <MicIcon />
            </div>

            {/* Input Bar */}
            <input
              type="text"
              placeholder="Type a message to Dispatcher..."
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              style={S.chatInput}
            />

            {/* Send Button */}
            <button type="submit" style={S.sendBtn} title="Send Message">
              <SendIcon />
            </button>
          </form>
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
                    placeholder="e.g. Dispatcher update delay" 
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

      {/* Dialing hotline toast notification (Bottom Left) */}
      {hotlineToast && (
        <div style={S.hotlineToast}>
          <span style={S.hotlineText}>
            Direct support hotline: Dialing 1-800-HERO-LOG...
          </span>
          <button onClick={() => setHotlineToast(false)} style={S.hotlineCloseBtn}>✕</button>
        </div>
      )}

      {/* Normal Success Toast */}
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
        @keyframes slideInLeft {
          from { transform: translateX(-100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
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
  sidebarPanel: {
    width: 280,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    border: '1px solid #e2e8f0',
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    height: '100%',
    boxSizing: 'border-box',
    flexShrink: 0
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
    width: '100%',
    padding: '6px 12px 6px 30px',
    borderRadius: 20,
    border: '1px solid #cbd5e1',
    fontSize: 12,
    color: '#334155',
    outline: 'none',
    boxSizing: 'border-box'
  },
  listContainer: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  emptyList: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    padding: '20px 0'
  },
  dispatcherCard: {
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'solid',
    padding: '10px 12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  cardLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },
  initialsCircle: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    backgroundColor: '#f1f5f9',
    color: '#334155',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: '800',
    border: '1px solid #cbd5e1',
    flexShrink: 0
  },
  cardDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2
  },
  dispName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a'
  },
  dispStatusSub: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600'
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0
  },
  chatPanel: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    boxSizing: 'border-box',
    minWidth: 0
  },
  chatHeader: {
    padding: '12px 18px',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0
  },
  chatHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12
  },
  chatHeaderInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2
  },
  chatHeaderName: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0f172a'
  },
  chatHeaderStatus: {
    fontSize: 10.5,
    fontWeight: '700'
  },
  callBtn: {
    backgroundColor: '#ffffff',
    border: '3px solid #ffcc00',
    color: '#b45309',
    borderRadius: 20,
    padding: '4px 16px',
    fontSize: 11.5,
    fontWeight: '800',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    outline: 'none',
    boxShadow: '0 2px 4px rgba(255, 204, 0, 0.1)'
  },
  chatFeed: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  messageRow: {
    display: 'flex',
    maxWidth: '75%',
    flexDirection: 'column'
  },
  messageBubble: {
    padding: '10px 14px',
    borderWidth: 1,
    borderStyle: 'solid',
    boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
  },
  messageText: {
    fontSize: 12,
    lineHeight: '1.45',
    margin: 0,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  },
  messageTime: {
    fontSize: 9.5,
    marginTop: 4,
    textAlign: 'right',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 2
  },
  chatFooter: {
    padding: '12px 18px',
    borderTop: '1px solid #f1f5f9',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexShrink: 0
  },
  iconsGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },
  chatInput: {
    flex: 1,
    padding: '6px 14px',
    borderRadius: 20,
    border: '1px solid #cbd5e1',
    fontSize: 12,
    color: '#334155',
    outline: 'none',
    boxSizing: 'border-box'
  },
  sendBtn: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    backgroundColor: '#FFCC00',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    flexShrink: 0
  },
  // Modal Drawer styles
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
  // Hotline toast styles (Bottom Left)
  hotlineToast: {
    position: 'fixed',
    bottom: 30,
    left: 20,
    backgroundColor: '#f8fafc',
    border: '2px solid #ffcc00',
    borderRadius: 12,
    padding: '14px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    zIndex: 1100,
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08), 0 0 12px rgba(255, 204, 0, 0.15)',
    maxWidth: 400,
    animation: 'slideInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
  },
  hotlineText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
    flex: 1
  },
  hotlineCloseBtn: {
    background: 'none',
    border: 'none',
    fontSize: 14,
    color: '#b45309',
    fontWeight: '800',
    cursor: 'pointer',
    padding: 0,
    lineHeight: 1
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

export default CustomerDispatcherChat;
