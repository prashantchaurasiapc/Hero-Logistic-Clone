import React, { useState, useRef } from 'react';

const initialTickets = [
  { id: 'TKT-8902', subject: 'Issue with assigning driver to load', updated: 'Updated 2 hours ago', status: 'OPEN', priority: 'High', created: 'Oct 24, 2026' },
  { id: 'TKT-8875', subject: 'Billing cycle clarification', updated: 'Updated 1 day ago', status: 'IN PROGRESS', priority: 'Medium', created: 'Oct 22, 2026' },
  { id: 'TKT-8810', subject: 'Cannot access yard map', updated: 'Updated Oct 16, 2026', status: 'RESOLVED', priority: 'High', created: 'Oct 15, 2026' },
  { id: 'TKT-8799', subject: 'Feature request: Custom export fields', updated: 'Updated Oct 14, 2026', status: 'RESOLVED', priority: 'Low', created: 'Oct 10, 2026' },
];

const chatHistory = {
  'TKT-8902': [
    { from: 'user', text: 'I am experiencing this issue since yesterday. Can someone help?', time: 'Oct 23, 2026, 10:30 AM' },
    { from: 'support', text: 'Hi, we are looking into this right now. We will update you shortly.', time: 'Oct 23, 2026, 11:15 AM' },
  ],
  'TKT-8875': [
    { from: 'user', text: 'Can you clarify the billing cycle dates?', time: 'Oct 22, 2026, 09:00 AM' },
    { from: 'support', text: 'Our billing cycle runs from the 1st to the 30th of each month.', time: 'Oct 22, 2026, 09:45 AM' },
  ],
  'TKT-8810': [
    { from: 'user', text: 'I cannot access the yard map after the last update.', time: 'Oct 15, 2026, 03:00 PM' },
    { from: 'support', text: 'This has been resolved. Please clear your browser cache and try again.', time: 'Oct 16, 2026, 10:00 AM' },
  ],
  'TKT-8799': [
    { from: 'user', text: 'It would be great to have custom export fields for the CSV.', time: 'Oct 10, 2026, 11:00 AM' },
    { from: 'support', text: 'Thank you for the feedback! This has been added to our roadmap.', time: 'Oct 14, 2026, 02:00 PM' },
  ],
};

const StatusBadge = ({ status }) => {
  const styles = {
    'OPEN': { bg: '#FFF7E6', color: '#D97706', border: '#FDE68A', icon: '⏱' },
    'IN PROGRESS': { bg: '#EEF2FF', color: '#4F46E5', border: '#C7D2FE', icon: '⏱' },
    'RESOLVED': { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0', icon: '✓' },
  };
  const s = styles[status] || styles['OPEN'];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      <span>{s.icon}</span> {status}
    </span>
  );
};

const PriorityLabel = ({ priority }) => {
  const colors = { High: '#EF4444', Medium: '#F97316', Low: '#64748B' };
  return <span style={{ fontSize: 13, fontWeight: 700, color: colors[priority] || '#64748B' }}>{priority}</span>;
};

export default function MyTickets() {
  const [tickets, setTickets] = useState(initialTickets);
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState('All Priorities');
  const [showRaiseModal, setShowRaiseModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [chatMsg, setChatMsg] = useState('');
  const [chats, setChats] = useState(chatHistory);
  const [formError, setFormError] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);

  const fileInputRef = useRef(null);

  const [form, setForm] = useState({ subject: '', category: '', priority: 'Medium', description: '' });

  const filtered = tickets.filter(t => {
    const matchSearch = t.id.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase());
    const matchPriority = filterPriority === 'All Priorities' || t.priority === filterPriority;
    return matchSearch && matchPriority;
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setAttachedFile(file);
  };

  const handleDropZoneClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) setAttachedFile(file);
  };

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    if (!form.subject.trim()) { setFormError('Please enter a subject.'); return; }
    if (!form.description.trim()) { setFormError('Please enter a description.'); return; }
    setFormError('');

    const newId = `TKT-${8700 + Math.floor(Math.random() * 99)}`;
    const newTicket = {
      id: newId,
      subject: form.subject,
      updated: 'Just now',
      status: 'OPEN',
      priority: form.priority,
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setTickets(prev => [newTicket, ...prev]);
    setChats(prev => ({ ...prev, [newId]: [] }));
    setForm({ subject: '', category: '', priority: 'Medium', description: '' });
    setAttachedFile(null);
    setShowRaiseModal(false);
  };

  const handleSendMsg = () => {
    if (!chatMsg.trim() || !selectedTicket) return;
    const now = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
    setChats(prev => ({
      ...prev,
      [selectedTicket.id]: [...(prev[selectedTicket.id] || []), { from: 'user', text: chatMsg, time: now }],
    }));
    setChatMsg('');
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px', border: '1px solid #E2E8F0', borderRadius: 10,
    fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', color: '#0F172A',
  };

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '32px 36px', fontFamily: "'Inter','Outfit',sans-serif", position: 'relative' }}
      onClick={() => filterOpen && setFilterOpen(false)}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', margin: 0 }}>My Tickets</h1>
          <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0 0' }}>Track and manage your support requests</p>
        </div>
        <button onClick={() => setShowRaiseModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: '#FFCC00', color: '#000', border: 'none', borderRadius: 12, padding: '12px 22px', fontSize: 13.5, fontWeight: 800, cursor: 'pointer' }}>
          + Raise New Ticket
        </button>
      </div>

      {/* Table Card */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'visible', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>

        {/* Search + Filter bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ position: 'relative', width: 300 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: 14 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by ticket ID or subject..."
              style={{ ...inputStyle, paddingLeft: 36 }} />
          </div>

          <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setFilterOpen(!filterOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1.5px solid #E2E8F0', borderRadius: 10, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', background: '#fff', color: '#334155' }}>
              ▿ Filter ▾
            </button>
            {filterOpen && (
              <div style={{ position: 'absolute', right: 0, top: '110%', background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '8px 0', minWidth: 170, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', zIndex: 200 }}>
                {['All Priorities', 'High', 'Medium', 'Low'].map(p => (
                  <div key={p} onClick={() => { setFilterPriority(p); setFilterOpen(false); }}
                    style={{ padding: '10px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      color: p === 'High' ? '#EF4444' : p === 'Medium' ? '#F97316' : p === 'Low' ? '#64748B' : '#0F172A' }}>
                    {p}
                    {filterPriority === p && <span style={{ color: '#FFCC00', fontWeight: 900 }}>✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                {['TICKET ID', 'SUBJECT', 'STATUS', 'PRIORITY', 'CREATED', 'ACTION'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 10.5, fontWeight: 800, color: '#94A3B8', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={t.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F8FAFC' : 'none' }}>
                  <td style={{ padding: '18px 20px', fontSize: 13.5, fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap' }}>{t.id}</td>
                  <td style={{ padding: '18px 20px' }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>{t.subject}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{t.updated}</div>
                  </td>
                  <td style={{ padding: '18px 20px' }}><StatusBadge status={t.status} /></td>
                  <td style={{ padding: '18px 20px' }}><PriorityLabel priority={t.priority} /></td>
                  <td style={{ padding: '18px 20px', fontSize: 13, color: '#475569', fontWeight: 500, whiteSpace: 'nowrap' }}>{t.created}</td>
                  <td style={{ padding: '18px 20px' }}>
                    <button onClick={() => setSelectedTicket(t)}
                      style={{ fontSize: 12.5, fontWeight: 800, color: '#4F46E5', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.3px' }}>
                      VIEW DETAILS
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>No tickets found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Raise New Ticket Modal ── */}
      {showRaiseModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 530, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.14)' }}>

            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '20px 24px', borderBottom: '1px solid #F1F5F9', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: '#FFF7E6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, border: '1px solid #FDE68A' }}>➕</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>Raise New Ticket</div>
                <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>Please provide details about your issue</div>
              </div>
              <button onClick={() => { setShowRaiseModal(false); setFormError(''); setAttachedFile(null); }}
                style={{ background: 'none', border: 'none', fontSize: 18, color: '#94A3B8', cursor: 'pointer' }}>✕</button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSubmitTicket} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Error */}
              {formError && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', fontSize: 12.5, color: '#DC2626', fontWeight: 600 }}>
                  ⚠ {formError}
                </div>
              )}

              {/* Subject */}
              <div>
                <label style={{ fontSize: 10.5, fontWeight: 800, color: '#64748B', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>
                  SUBJECT / TITLE <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                  placeholder="E.g. Unable to view latest invoice" style={inputStyle} />
              </div>

              {/* Category + Priority */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 10.5, fontWeight: 800, color: '#64748B', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>CATEGORY <span style={{ color: '#EF4444' }}>*</span></label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="">Select Category</option>
                    <option>Billing</option>
                    <option>Technical Issue</option>
                    <option>Feature Request</option>
                    <option>Driver / Load Issue</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 10.5, fontWeight: 800, color: '#64748B', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>PRIORITY LEVEL <span style={{ color: '#EF4444' }}>*</span></label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['Low', 'Medium', 'High'].map(p => (
                      <button key={p} type="button" onClick={() => setForm({ ...form, priority: p })}
                        style={{ flex: 1, padding: '9px 0', borderRadius: 10, fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
                          border: form.priority === p ? 'none' : '1.5px solid #E2E8F0',
                          background: form.priority === p ? (p === 'High' ? '#EF4444' : p === 'Medium' ? '#F97316' : '#64748B') : '#fff',
                          color: form.priority === p ? '#fff' : '#64748B' }}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: 10.5, fontWeight: 800, color: '#64748B', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>DESCRIPTION <span style={{ color: '#EF4444' }}>*</span></label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Please describe your issue in detail..." rows={4}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
              </div>

              {/* File Upload */}
              <div>
                <label style={{ fontSize: 10.5, fontWeight: 800, color: '#64748B', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>ATTACHMENTS (OPTIONAL)</label>

                {/* Hidden real file input */}
                <input ref={fileInputRef} type="file" accept=".png,.jpg,.jpeg,.pdf" onChange={handleFileChange}
                  style={{ display: 'none' }} />

                {/* Clickable upload zone */}
                <div
                  onClick={handleDropZoneClick}
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleDrop}
                  style={{ border: '1.5px dashed #FFCC00', borderRadius: 12, padding: '24px 16px', backgroundColor: '#FFFDF5', textAlign: 'center', cursor: 'pointer', transition: 'background 0.15s' }}>
                  <div style={{ fontSize: 28, marginBottom: 6, color: '#F97316' }}>⬆</div>
                  <div style={{ fontSize: 13, color: '#334155' }}>
                    <span style={{ color: '#F97316', fontWeight: 700 }}>Upload a file</span> or drag and drop
                  </div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>PNG, JPG, PDF up to 10MB</div>
                  {attachedFile && (
                    <div style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: '#16A34A', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, padding: '6px 12px', display: 'inline-block' }}>
                      ✓ {attachedFile.name}
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 4 }}>
                <button type="button" onClick={() => { setShowRaiseModal(false); setFormError(''); setAttachedFile(null); }}
                  style={{ padding: '11px 24px', borderRadius: 10, fontSize: 13, fontWeight: 700, border: '1px solid #E2E8F0', background: '#fff', color: '#334155', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit"
                  style={{ padding: '11px 24px', borderRadius: 10, fontSize: 13, fontWeight: 800, border: 'none', background: '#0F172A', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  Submit Ticket ➤
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Ticket Details Modal ── */}
      {selectedTicket && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 560, maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.14)', overflow: 'hidden' }}>

            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '20px 24px', borderBottom: '1px solid #F1F5F9', flexShrink: 0 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💬</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>{selectedTicket.id} Details</div>
                <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{selectedTicket.subject}</div>
              </div>
              <button onClick={() => setSelectedTicket(null)} style={{ background: 'none', border: 'none', fontSize: 18, color: '#94A3B8', cursor: 'pointer' }}>✕</button>
            </div>

            {/* Scrollable body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Problem Description */}
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A', marginBottom: 10 }}>Problem Description</div>
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px', fontSize: 13, color: '#334155', lineHeight: 1.6 }}>
                  The user reported an issue related to: <strong>{selectedTicket.subject}</strong>. The priority is currently set to <strong>{selectedTicket.priority}</strong> and the status is <strong>{selectedTicket.status}</strong>. Please investigate the root cause and provide a resolution as soon as possible.
                </div>
              </div>

              {/* Chat History */}
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A', marginBottom: 12 }}>Chat History</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {(chats[selectedTicket.id] || []).map((msg, i) => {
                    const isUser = msg.from === 'user';
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-end', gap: 10, flexDirection: isUser ? 'row' : 'row-reverse' }}>
                        {/* Avatar */}
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                          background: isUser ? '#E2E8F0' : '#FFCC00',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 800, color: isUser ? '#475569' : '#000'
                        }}>
                          {isUser ? 'U' : 'S'}
                        </div>
                        {/* Bubble */}
                        <div style={{ maxWidth: '72%' }}>
                          <div style={{
                            background: isUser ? '#F1F5F9' : '#FFFBEB',
                            border: isUser ? '1px solid #E2E8F0' : '1px solid #FDE68A',
                            borderRadius: isUser ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                            padding: '10px 14px', fontSize: 13, color: '#334155', lineHeight: 1.5
                          }}>
                            {msg.text}
                          </div>
                          <div style={{ fontSize: 10.5, color: '#94A3B8', marginTop: 4, textAlign: isUser ? 'left' : 'right' }}>{msg.time}</div>
                        </div>
                      </div>
                    );
                  })}
                  {(chats[selectedTicket.id] || []).length === 0 && (
                    <p style={{ fontSize: 12.5, color: '#94A3B8', textAlign: 'center' }}>No messages yet.</p>
                  )}
                </div>
              </div>

            </div>

            {/* Chat input */}
            <div style={{ padding: '14px 24px', borderTop: '1px solid #F1F5F9', display: 'flex', gap: 10, flexShrink: 0 }}>
              <input value={chatMsg} onChange={e => setChatMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMsg()}
                placeholder="Type a message..."
                style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #E2E8F0', borderRadius: 12, fontSize: 13, fontFamily: 'inherit', outline: 'none', color: '#0F172A' }} />
              <button onClick={handleSendMsg}
                style={{ width: 44, height: 44, borderRadius: 12, background: '#0F172A', border: 'none', color: '#fff', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
