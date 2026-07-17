import React, { useState } from 'react';

const initialTickets = [
  {
    id: 'TKT-8902', date: 'Oct 24, 2026',
    subject: 'Issue with assigning driver to load',
    user: 'Sarah Mitchell (Dispatch)',
    userInitial: 'S',
    status: 'OPEN', priority: 'High',
    description: 'I am unable to assign John Doe to load L-1245. The system keeps throwing a "Driver Unavailable" error even though he has no active loads.',
    chat: [
      { from: 'user', initial: 'S', text: 'I am unable to assign John Doe to load L-1245. The system keeps throwing a "Driver Unavailable" error even though he has no active loads.', time: 'Oct 24, 2026, 10:30 AM' },
      { from: 'support', initial: 'S', text: 'Hi, we are looking into this right now. We will update you shortly.', time: 'Oct 24, 2026, 11:15 AM' },
    ],
  },
  {
    id: 'TKT-8875', date: 'Oct 22, 2026',
    subject: 'Billing cycle clarification',
    user: 'John Doe (Finance)',
    userInitial: 'J',
    status: 'IN PROGRESS', priority: 'Medium',
    description: 'Could someone clarify when our billing cycle resets? We need this for our monthly reconciliation.',
    chat: [
      { from: 'user', initial: 'J', text: 'Could someone clarify when our billing cycle resets? We need this for our monthly reconciliation.', time: 'Oct 22, 2026, 09:00 AM' },
      { from: 'support', initial: 'S', text: 'Our billing cycle runs from the 1st to the last day of each month. Let me know if you need more detail.', time: 'Oct 22, 2026, 09:45 AM' },
    ],
  },
  {
    id: 'TKT-8812', date: 'Oct 20, 2026',
    subject: 'App crashing on document upload',
    user: 'Mike T. (Driver)',
    userInitial: 'M',
    status: 'OPEN', priority: 'High',
    description: 'The app crashes every time I try to upload a POD document. This is blocking me from completing deliveries.',
    chat: [
      { from: 'user', initial: 'M', text: 'The app crashes every time I try to upload a POD document. This is blocking me from completing deliveries.', time: 'Oct 20, 2026, 02:00 PM' },
      { from: 'support', initial: 'S', text: 'We are investigating this. Could you share the device model and OS version?', time: 'Oct 20, 2026, 02:30 PM' },
    ],
  },
  {
    id: 'TKT-8750', date: 'Oct 05, 2026',
    subject: 'New branch setup assistance',
    user: 'Admin User',
    userInitial: 'A',
    status: 'IN PROGRESS', priority: 'Low',
    description: 'We are opening a new branch in Brisbane and need help configuring the system with the new location details.',
    chat: [
      { from: 'user', initial: 'A', text: 'We need help setting up the new Brisbane branch in the system.', time: 'Oct 05, 2026, 10:00 AM' },
      { from: 'support', initial: 'S', text: 'Sure! Please provide the branch address and contact details and we will set it up for you.', time: 'Oct 05, 2026, 10:30 AM' },
    ],
  },
];

const StatusBadge = ({ status }) => {
  const map = {
    'OPEN':        { bg: '#FFF7E6', color: '#D97706', border: '#FDE68A', icon: '⏱' },
    'IN PROGRESS': { bg: '#EEF2FF', color: '#4F46E5', border: '#C7D2FE', icon: '⏱' },
    'RESOLVED':    { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0', icon: '✓' },
  };
  const s = map[status] || map['OPEN'];
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

export default function OpenTickets() {
  const [tickets, setTickets] = useState(initialTickets);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const filtered = tickets.filter(t => {
    const matchSearch = t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.user.toLowerCase().includes(search.toLowerCase());
    const matchPriority = filterPriority === 'All' || t.priority === filterPriority;
    return matchSearch && matchPriority;
  });

  const activeCount = tickets.filter(t => t.status !== 'RESOLVED').length;

  const handleMarkResolved = (ticketId) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'RESOLVED' } : t));
    setSelectedTicket(prev => prev && prev.id === ticketId ? { ...prev, status: 'RESOLVED' } : prev);
  };

  const priorityBadge = (p) => {
    const map = { High: { bg: '#FEE2E2', color: '#DC2626' }, Medium: { bg: '#FEF3C7', color: '#D97706' }, Low: { bg: '#F1F5F9', color: '#475569' } };
    const s = map[p] || map['Low'];
    return (
      <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 6, backgroundColor: s.bg, color: s.color, letterSpacing: '0.3px' }}>
        {p.toUpperCase()} PRIORITY
      </span>
    );
  };

  return (
    <div
      style={{ background: '#F8FAFC', minHeight: '100vh', padding: '32px 36px', fontFamily: "'Inter','Outfit',sans-serif", position: 'relative' }}
      onClick={() => filterOpen && setFilterOpen(false)}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', margin: 0 }}>Open Tickets</h1>
          <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0 0' }}>Company-wide active support requests</p>
        </div>
        <div style={{ textAlign: 'right', fontSize: 14, fontWeight: 800, color: '#0F172A' }}>
          Total Active: <span style={{ color: '#4F46E5' }}>{activeCount}</span>
        </div>
      </div>

      {/* Table Card */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', overflow: 'visible' }}>

        {/* Search + Filter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ position: 'relative', width: 300 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: 14 }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search across all open tickets..."
              style={{ width: '100%', padding: '10px 14px 10px 36px', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', outline: 'none', color: '#0F172A', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1.5px solid #E2E8F0', borderRadius: 10, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', background: '#fff', color: '#334155' }}
            >
              ▿ Filter By Priority ▾
            </button>
            {filterOpen && (
              <div style={{ position: 'absolute', right: 0, top: '110%', background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '8px 0', minWidth: 180, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 200 }}>
                {['All', 'High', 'Medium', 'Low'].map(p => (
                  <div key={p} onClick={() => { setFilterPriority(p); setFilterOpen(false); }}
                    style={{ padding: '10px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      color: p === 'High' ? '#EF4444' : p === 'Medium' ? '#F97316' : p === 'Low' ? '#64748B' : '#0F172A' }}>
                    {p === 'All' ? 'All Priorities' : p}
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
                {['TICKET ID', 'SUBJECT & USER', 'STATUS', 'PRIORITY', 'ACTION'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 10.5, fontWeight: 800, color: '#94A3B8', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={t.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F8FAFC' : 'none' }}>
                  <td style={{ padding: '18px 20px', whiteSpace: 'nowrap' }}>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A' }}>{t.id}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{t.date}</div>
                  </td>
                  <td style={{ padding: '18px 20px' }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>{t.subject}</div>
                    <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span>👤</span> {t.user}
                    </div>
                  </td>
                  <td style={{ padding: '18px 20px' }}><StatusBadge status={t.status} /></td>
                  <td style={{ padding: '18px 20px' }}><PriorityLabel priority={t.priority} /></td>
                  <td style={{ padding: '18px 20px' }}>
                    <button
                      onClick={() => setSelectedTicket(t)}
                      style={{ fontSize: 12.5, fontWeight: 800, color: '#4F46E5', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.3px' }}
                    >
                      REVIEW TICKET
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>No tickets found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Review Ticket Modal ── */}
      {selectedTicket && (() => {
        const ticket = tickets.find(t => t.id === selectedTicket.id) || selectedTicket;
        const isResolved = ticket.status === 'RESOLVED';
        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 560, maxHeight: '88vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', overflow: 'hidden' }}>

              {/* Modal header */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#475569' }}>{ticket.id}</span>
                    <StatusBadge status={ticket.status} />
                    {priorityBadge(ticket.priority)}
                  </div>
                  <button onClick={() => setSelectedTicket(null)} style={{ background: 'none', border: 'none', fontSize: 20, color: '#94A3B8', cursor: 'pointer', lineHeight: 1 }}>×</button>
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#0F172A' }}>{ticket.subject}</div>
              </div>

              {/* Scrollable body */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* Reporter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#4F46E5', flexShrink: 0 }}>
                    {ticket.userInitial}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>{ticket.user}</div>
                    <div style={{ fontSize: 11.5, color: '#94A3B8', marginTop: 2 }}>Reported on {ticket.date}</div>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9', margin: 0 }} />

                {/* Problem Description */}
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginBottom: 10 }}>Problem Description</div>
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px', fontSize: 13, color: '#334155', lineHeight: 1.65 }}>
                    {ticket.description}
                  </div>
                </div>

                {/* Chat History */}
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginBottom: 12 }}>Chat History</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {ticket.chat.map((msg, i) => {
                      const isUser = msg.from === 'user';
                      return (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-end', gap: 10, flexDirection: isUser ? 'row' : 'row-reverse' }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: isUser ? '#E2E8F0' : '#FFCC00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: isUser ? '#475569' : '#000' }}>
                            {msg.initial}
                          </div>
                          <div style={{ maxWidth: '76%' }}>
                            <div style={{ background: isUser ? '#F1F5F9' : '#FFFBEB', border: isUser ? '1px solid #E2E8F0' : '1px solid #FDE68A', borderRadius: isUser ? '16px 16px 16px 4px' : '16px 16px 4px 16px', padding: '10px 14px', fontSize: 13, color: '#334155', lineHeight: 1.55 }}>
                              {msg.text}
                            </div>
                            <div style={{ fontSize: 10.5, color: '#94A3B8', marginTop: 4, textAlign: isUser ? 'left' : 'right' }}>{msg.time}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Footer actions */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <button
                  onClick={() => setSelectedTicket(null)}
                  style={{ background: 'none', border: 'none', fontSize: 14, fontWeight: 700, color: '#475569', cursor: 'pointer', padding: '8px 0' }}
                >
                  Close
                </button>

                {isResolved ? (
                  <button
                    disabled
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 12, fontSize: 13.5, fontWeight: 800, border: '1.5px solid #BBF7D0', background: '#F0FDF4', color: '#16A34A', cursor: 'default' }}
                  >
                    ✓ Ticket Resolved
                  </button>
                ) : (
                  <button
                    onClick={() => handleMarkResolved(ticket.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 12, fontSize: 13.5, fontWeight: 800, border: 'none', background: '#16A34A', color: '#fff', cursor: 'pointer' }}
                  >
                    ⊙ Mark as Resolved
                  </button>
                )}
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}
