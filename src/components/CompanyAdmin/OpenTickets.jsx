import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Check, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const StatusBadge = ({ status }) => {
  const normStatus = status === 'IN_PROGRESS' ? 'IN PROGRESS' : status;
  const map = {
    'OPEN':        { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: '⏱' },
    'IN PROGRESS': { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: '⏱' },
    'RESOLVED':    { bg: 'bg-green-50 text-green-700 border-green-200', icon: '✓' },
    'CLOSED':      { bg: 'bg-slate-50 text-slate-700 border-slate-200', icon: '✓' },
  };
  const s = map[normStatus] || map['OPEN'];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap ${s.bg}`}>
      <span>{s.icon}</span> {normStatus}
    </span>
  );
};

const PriorityLabel = ({ priority }) => {
  const normP = priority ? (priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()) : 'Medium';
  const colors = { High: 'text-rose-600 font-extrabold', Urgent: 'text-rose-700 font-black', Medium: 'text-amber-600 font-bold', Low: 'text-slate-500 font-medium' };
  return <span className={`text-[13px] whitespace-nowrap ${colors[normP] || 'text-slate-500'}`}>{normP}</span>;
};

export default function OpenTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [resolvingId, setResolvingId] = useState(null);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/support-tickets');
      const data = res.data?.data || res.data || [];
      const list = Array.isArray(data) ? data : (data.items || []);

      const mapped = list.map(t => {
        const pNorm = t.priority ? (t.priority.charAt(0).toUpperCase() + t.priority.slice(1).toLowerCase()) : 'Medium';
        const userName = t.company?.name || t.assignedAgent?.name || 'Company Admin';
        return {
          id: t.ticketNumber ? `TKT-${t.ticketNumber}` : `TKT-${t.id.slice(0, 4)}`,
          dbId: t.id,
          date: t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today',
          subject: t.subject || 'Support Issue',
          user: userName,
          userInitial: userName.charAt(0).toUpperCase(),
          status: t.status === 'IN_PROGRESS' ? 'IN PROGRESS' : (t.status || 'OPEN'),
          priority: pNorm,
          description: t.message || t.subject,
          chat: (t.replies || []).map(r => ({
            from: r.author ? (r.author.role === 'COMPANY_ADMIN' ? 'user' : 'support') : 'user',
            initial: (r.author?.name || 'U').charAt(0).toUpperCase(),
            text: r.message,
            time: r.createdAt ? new Date(r.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'Just now'
          }))
        };
      });

      setTickets(mapped);
    } catch (err) {
      console.error('Error fetching open tickets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const filtered = tickets.filter(t => {
    const matchSearch = t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.user.toLowerCase().includes(search.toLowerCase());
    const matchPriority = filterPriority === 'All' || t.priority.toLowerCase() === filterPriority.toLowerCase();
    return matchSearch && matchPriority;
  });

  const activeCount = tickets.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED').length;

  const handleMarkResolved = async (dbId) => {
    setResolvingId(dbId);
    try {
      await api.put(`/support-tickets/${dbId}`, { status: 'RESOLVED' });
      triggerToast('Ticket marked as Resolved in database!');
      setTickets(prev => prev.map(t => t.dbId === dbId ? { ...t, status: 'RESOLVED' } : t));
      if (selectedTicket && selectedTicket.dbId === dbId) {
        setSelectedTicket(prev => ({ ...prev, status: 'RESOLVED' }));
      }
    } catch (err) {
      console.error('Error marking ticket resolved:', err);
      triggerToast('Failed to update ticket status.');
    } finally {
      setResolvingId(null);
    }
  };

  const priorityBadge = (p) => {
    const map = { 
      High: 'bg-rose-50 text-rose-700 border border-rose-200', 
      Urgent: 'bg-rose-100 text-rose-800 border border-rose-300',
      Medium: 'bg-amber-50 text-amber-700 border border-amber-200', 
      Low: 'bg-slate-50 text-slate-700 border border-slate-200' 
    };
    const style = map[p] || map['Low'];
    return (
      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${style}`}>
        {(p || 'LOW').toUpperCase()} PRIORITY
      </span>
    );
  };

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 font-sans text-left relative"
      onClick={() => filterOpen && setFilterOpen(false)}
    >
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-[99999] bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <Check className="text-emerald-400 w-4 h-4 stroke-[3]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Open Tickets</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Company-wide active support requests in real time</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchTickets}
            className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs cursor-pointer"
            title="Refresh Open Tickets"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin text-indigo-600' : ''} />
          </button>
          <div className="text-left sm:text-right text-sm font-extrabold text-gray-900">
            Total Active: <span className="text-indigo-600">{activeCount}</span>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-visible shadow-xs">
        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 border-b border-gray-100">
          <div className="relative w-full sm:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search across all open tickets..."
              className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-[13px] font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-yellow-500 transition-colors shadow-2xs" 
            />
          </div>

          <div className="relative self-end sm:self-auto" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 border border-gray-200 bg-white rounded-xl px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
            >
              Filter By Priority ▾
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-1 overflow-hidden">
                {['All', 'High', 'Medium', 'Low'].map(p => (
                  <div key={p} onClick={() => { setFilterPriority(p); setFilterOpen(false); }}
                    className={`px-4 py-2.5 text-[13px] font-bold cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between ${p === 'High' ? 'text-red-500' : p === 'Medium' ? 'text-orange-500' : p === 'Low' ? 'text-slate-500' : 'text-gray-900'}`}
                  >
                    {p === 'All' ? 'All Priorities' : p}
                    {filterPriority === p && <span className="text-yellow-500 font-bold">✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto custom-scrollbar w-full">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[750px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {['TICKET ID', 'SUBJECT & USER', 'STATUS', 'PRIORITY', 'ACTION'].map(h => (
                  <th key={h} className="py-3.5 px-6 text-[10.5px] font-black text-gray-400 tracking-wider uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-bold">
                    <RefreshCw size={20} className="animate-spin inline-block mr-2 text-indigo-600" />
                    Loading tickets from database...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((t) => (
                  <tr key={t.dbId || t.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4.5 px-6 whitespace-nowrap font-mono">
                      <div className="font-black text-gray-900">{t.id}</div>
                      <div className="text-[11px] text-gray-400 font-semibold mt-1">{t.date}</div>
                    </td>
                    <td className="py-4.5 px-6 max-w-[320px] whitespace-normal">
                      <div className="font-bold text-gray-900 leading-tight">{t.subject}</div>
                      <div className="text-[11.5px] text-gray-400 font-bold mt-1.5 flex items-center gap-1.5">
                        <span>👤</span> {t.user}
                      </div>
                    </td>
                    <td className="py-4.5 px-6"><StatusBadge status={t.status} /></td>
                    <td className="py-4.5 px-6"><PriorityLabel priority={t.priority} /></td>
                    <td className="py-4.5 px-6">
                      <button
                        onClick={() => setSelectedTicket(t)}
                        className="text-indigo-600 hover:text-indigo-800 text-[12.5px] font-extrabold tracking-wide hover:underline bg-none border-none cursor-pointer"
                      >
                        REVIEW TICKET
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 font-semibold">
                    No active open tickets found in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Review Ticket Modal ── */}
      {selectedTicket && (() => {
        const ticket = tickets.find(t => t.dbId === selectedTicket.dbId) || selectedTicket;
        const isResolved = ticket.status === 'RESOLVED' || ticket.status === 'CLOSED';
        return (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-[550px] max-h-[88vh] flex flex-col shadow-2xl overflow-hidden my-8 text-left">
              {/* Modal header */}
              <div className="px-6 py-5 border-b border-gray-100 bg-white shrink-0 text-left">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-slate-500 font-mono">{ticket.id}</span>
                    <StatusBadge status={ticket.status} />
                    {priorityBadge(ticket.priority)}
                  </div>
                  <button 
                    onClick={() => setSelectedTicket(null)} 
                    className="text-gray-400 hover:text-gray-900 hover:bg-gray-50 p-1 rounded-full transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <div className="text-base font-extrabold text-gray-900 leading-tight">{ticket.subject}</div>
              </div>

              {/* Scrollable body */}
              <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-6 text-left">
                {/* Reporter */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-[13px] font-black text-indigo-600 shrink-0">
                    {ticket.userInitial}
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-gray-900 leading-tight">{ticket.user}</div>
                    <div className="text-[11px] text-gray-400 font-semibold mt-1">Reported on {ticket.date}</div>
                  </div>
                </div>

                <hr className="border-t border-gray-100 my-0" />

                {/* Problem Description */}
                <div>
                  <div className="text-sm font-black text-gray-900 uppercase tracking-wider mb-2.5">Problem Description</div>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-[13px] text-gray-600 leading-relaxed font-semibold">
                    {ticket.description}
                  </div>
                </div>

                {/* Chat History */}
                <div>
                  <div className="text-sm font-black text-gray-900 uppercase tracking-wider mb-3">Chat History</div>
                  <div className="flex flex-col gap-4">
                    {(ticket.chat || []).map((msg, i) => {
                      const isUser = msg.from === 'user';
                      return (
                        <div key={i} className={`flex items-end gap-3 ${isUser ? 'flex-row' : 'flex-row-reverse'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${isUser ? 'bg-slate-200 text-slate-700' : 'bg-[#FFCC00] text-black'}`}>
                            {msg.initial}
                          </div>
                          <div className="max-w-[75%]">
                            <div className={`rounded-2xl px-4 py-3 text-[13px] text-gray-700 leading-relaxed font-semibold shadow-2xs border ${
                              isUser 
                                ? 'bg-slate-50 border-slate-200 rounded-bl-xs' 
                                : 'bg-amber-50/50 border-amber-200 rounded-br-xs'
                            }`}>
                              {msg.text}
                            </div>
                            <div className={`text-[10px] text-gray-400 font-bold mt-1.5 ${isUser ? 'text-left' : 'text-right'}`}>
                              {msg.time}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {(ticket.chat || []).length === 0 && (
                      <p className="text-center text-xs text-slate-400 font-bold py-2">No reply history yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer actions */}
              <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-slate-50/20 shrink-0">
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="bg-transparent border-none text-[13px] font-bold text-gray-500 hover:text-gray-900 hover:underline cursor-pointer"
                >
                  Close
                </button>

                {isResolved ? (
                  <button
                    disabled
                    className="flex items-center gap-2 px-5 py-2.5 border border-green-200 bg-green-50 text-green-700 rounded-xl text-xs font-extrabold cursor-default"
                  >
                    ✓ Ticket Resolved
                  </button>
                ) : (
                  <button
                    onClick={() => handleMarkResolved(ticket.dbId)}
                    disabled={resolvingId === ticket.dbId}
                    className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                  >
                    ⊙ {resolvingId === ticket.dbId ? 'Updating...' : 'Mark as Resolved'}
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
