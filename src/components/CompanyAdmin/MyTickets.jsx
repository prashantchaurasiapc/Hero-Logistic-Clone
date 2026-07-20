import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

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
    'OPEN': { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: '⏱' },
    'IN PROGRESS': { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: '⏱' },
    'RESOLVED': { bg: 'bg-green-50 text-green-700 border-green-200', icon: '✓' },
  };
  const s = styles[status] || styles['OPEN'];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap ${s.bg}`}>
      <span>{s.icon}</span> {status}
    </span>
  );
};

const PriorityLabel = ({ priority }) => {
  const colors = { High: 'text-red-500', Medium: 'text-orange-500', Low: 'text-slate-500' };
  return <span className={`text-[13px] font-bold whitespace-nowrap ${colors[priority] || 'text-slate-500'}`}>{priority}</span>;
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

  return (
    <div 
      className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 font-sans text-left relative"
      onClick={() => filterOpen && setFilterOpen(false)}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Tickets</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Track and manage your support requests</p>
        </div>
        <button 
          onClick={() => setShowRaiseModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#FFCC00] hover:bg-[#E6B800] text-black rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer shrink-0"
        >
          + Raise New Ticket
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-visible shadow-xs">
        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 border-b border-gray-100">
          <div className="relative w-full sm:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by ticket ID or subject..."
              className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-[13px] font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-yellow-500 transition-colors shadow-2xs" 
            />
          </div>

          <div className="relative self-end sm:self-auto" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 border border-gray-200 bg-white rounded-xl px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
            >
              Filter ▾
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-1 overflow-hidden">
                {['All Priorities', 'High', 'Medium', 'Low'].map(p => (
                  <div 
                    key={p} 
                    onClick={() => { setFilterPriority(p); setFilterOpen(false); }}
                    className={`px-4 py-2.5 text-[13px] font-bold cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between ${p === 'High' ? 'text-red-500' : p === 'Medium' ? 'text-orange-500' : p === 'Low' ? 'text-slate-500' : 'text-gray-900'}`}
                  >
                    {p}
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
                {['TICKET ID', 'SUBJECT', 'STATUS', 'PRIORITY', 'CREATED', 'ACTION'].map(h => (
                  <th key={h} className="py-3.5 px-6 text-[10.5px] font-black text-gray-400 tracking-wider uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {filtered.map((t, i) => (
                <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4.5 px-6 font-black text-gray-900">{t.id}</td>
                  <td className="py-4.5 px-6 max-w-[320px] whitespace-normal">
                    <div className="font-bold text-gray-900 leading-tight">{t.subject}</div>
                    <div className="text-[11px] text-gray-400 font-semibold mt-1">{t.updated}</div>
                  </td>
                  <td className="py-4.5 px-6"><StatusBadge status={t.status} /></td>
                  <td className="py-4.5 px-6"><PriorityLabel priority={t.priority} /></td>
                  <td className="py-4.5 px-6 text-gray-500 font-medium">{t.created}</td>
                  <td className="py-4.5 px-6">
                    <button 
                      onClick={() => setSelectedTicket(t)}
                      className="text-indigo-600 hover:text-indigo-800 text-[12.5px] font-extrabold tracking-wide hover:underline bg-none border-none cursor-pointer"
                    >
                      VIEW DETAILS
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400 font-semibold">No tickets found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Raise New Ticket Modal ── */}
      {showRaiseModal && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-[520px] shadow-2xl my-8 overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center gap-4.5 px-6 py-5 border-b border-gray-100 bg-white">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-base shrink-0">🎫</div>
              <div className="flex-grow text-left">
                <div className="text-base font-extrabold text-gray-900 leading-tight">Raise New Ticket</div>
                <div className="text-xs text-gray-400 font-medium mt-0.5">Please provide details about your issue</div>
              </div>
              <button 
                onClick={() => { setShowRaiseModal(false); setFormError(''); setAttachedFile(null); }}
                className="text-gray-400 hover:text-gray-900 hover:bg-gray-50 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSubmitTicket} className="p-6 flex flex-col gap-4.5 text-left">
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600 font-semibold">
                  ⚠ {formError}
                </div>
              )}

              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
                  SUBJECT / TITLE <span className="text-red-500">*</span>
                </label>
                <input 
                  value={form.subject} 
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  placeholder="E.g. Unable to view latest invoice" 
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors" 
                />
              </div>

              {/* Category + Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">CATEGORY <span className="text-red-500">*</span></label>
                  <select 
                    value={form.category} 
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3 text-[13px] font-semibold text-gray-900 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    <option>Billing</option>
                    <option>Technical Issue</option>
                    <option>Feature Request</option>
                    <option>Driver / Load Issue</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">PRIORITY LEVEL <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    {['Low', 'Medium', 'High'].map(p => (
                      <button 
                        key={p} 
                        type="button" 
                        onClick={() => setForm({ ...form, priority: p })}
                        className={`flex-1 py-3.5 rounded-xl text-[12.5px] font-bold transition-all cursor-pointer ${
                          form.priority === p 
                            ? (p === 'High' ? 'bg-red-500 text-white shadow-sm' : p === 'Medium' ? 'bg-orange-500 text-white shadow-sm' : 'bg-slate-500 text-white shadow-sm') 
                            : 'bg-white border border-gray-200 text-slate-500 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">DESCRIPTION <span className="text-red-500">*</span></label>
                <textarea 
                  value={form.description} 
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Please describe your issue in detail..." 
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors resize-none leading-relaxed" 
                />
              </div>

              {/* File Upload */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">ATTACHMENTS (OPTIONAL)</label>
                <input 
                  ref={fileInputRef} 
                  type="file" 
                  accept=".png,.jpg,.jpeg,.pdf" 
                  onChange={handleFileChange}
                  className="hidden" 
                />
                <div
                  onClick={handleDropZoneClick}
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-amber-200 bg-amber-50/20 hover:bg-amber-50/40 rounded-2xl py-6 px-4 text-center cursor-pointer transition-all"
                >
                  <div className="text-2xl mb-1 text-orange-500">⬆</div>
                  <div className="text-[13px] text-gray-700 font-medium">
                    <span className="text-orange-500 font-bold">Upload a file</span> or drag and drop
                  </div>
                  <div className="text-[11px] text-gray-400 font-semibold mt-1">PNG, JPG, PDF up to 10MB</div>
                  {attachedFile && (
                    <div className="mt-3.5 inline-block text-xs font-bold text-green-700 bg-green-50 border border-green-200 rounded-lg py-1.5 px-3">
                      ✓ {attachedFile.name}
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-50">
                <button 
                  type="button" 
                  onClick={() => { setShowRaiseModal(false); setFormError(''); setAttachedFile(null); }}
                  className="px-5 py-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-2"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ── Ticket Details Modal ── */}
      {selectedTicket && createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-[550px] max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center gap-4.5 px-6 py-5 border-b border-gray-100 bg-white shrink-0">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-base">💬</div>
              <div className="flex-grow text-left">
                <div className="text-base font-extrabold text-gray-900 leading-tight">{selectedTicket.id} Details</div>
                <div className="text-xs text-gray-400 font-medium mt-0.5">{selectedTicket.subject}</div>
              </div>
              <button 
                onClick={() => setSelectedTicket(null)} 
                className="text-gray-400 hover:text-gray-900 hover:bg-gray-50 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-6 text-left">
              {/* Problem Description */}
              <div>
                <div className="text-sm font-black text-gray-900 uppercase tracking-wider mb-2.5">Problem Description</div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 text-[13px] text-gray-600 leading-relaxed font-semibold">
                  The user reported an issue related to: <strong className="text-gray-900">{selectedTicket.subject}</strong>. The priority is currently set to <strong className="text-gray-900">{selectedTicket.priority}</strong> and the status is <strong className="text-gray-900">{selectedTicket.status}</strong>. Please investigate the root cause and provide a resolution as soon as possible.
                </div>
              </div>

              {/* Chat History */}
              <div>
                <div className="text-sm font-black text-gray-900 uppercase tracking-wider mb-3">Chat History</div>
                <div className="flex flex-col gap-4">
                  {(chats[selectedTicket.id] || []).map((msg, i) => {
                    const isUser = msg.from === 'user';
                    return (
                      <div key={i} className={`flex items-end gap-3 ${isUser ? 'flex-row' : 'flex-row-reverse'}`}>
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${isUser ? 'bg-slate-200 text-slate-700' : 'bg-[#FFCC00] text-black'}`}>
                          {isUser ? 'U' : 'S'}
                        </div>
                        {/* Bubble */}
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
                  {(chats[selectedTicket.id] || []).length === 0 && (
                    <p className="text-center text-xs text-gray-400 font-bold py-4">No messages yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Chat input */}
            <div className="px-6 py-4.5 border-t border-gray-100 flex gap-3 bg-slate-50/30 shrink-0">
              <input 
                value={chatMsg} 
                onChange={e => setChatMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMsg()}
                placeholder="Type a message..."
                className="flex-grow bg-white border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-gray-900 focus:outline-none focus:border-yellow-500 transition-colors shadow-2xs" 
              />
              <button 
                onClick={handleSendMsg}
                className="w-11 h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center justify-center text-sm shadow-sm transition-all cursor-pointer shrink-0"
              >
                ➤
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
