import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Ticket, 
  X, 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare, 
  Send, 
  Paperclip,
  Plus,
  Search,
  Filter,
  Clock,
  Check
} from 'lucide-react';

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
    'RESOLVED': { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '✓' },
  };
  const s = styles[status] || styles['OPEN'];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap ${s.bg}`}>
      <span>{s.icon}</span> {status}
    </span>
  );
};

const PriorityLabel = ({ priority }) => {
  const colors = { High: 'text-rose-600 bg-rose-50 border-rose-200', Medium: 'text-amber-600 bg-amber-50 border-amber-200', Low: 'text-slate-600 bg-slate-50 border-slate-200' };
  return (
    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold border ${colors[priority] || 'text-slate-600'}`}>
      {priority}
    </span>
  );
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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Tickets</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Track and manage your support requests</p>
        </div>
        <button 
          onClick={() => setShowRaiseModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer shrink-0 uppercase tracking-wider"
        >
          <Plus size={16} strokeWidth={2.5} /> Raise New Ticket
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-visible shadow-xs">
        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 border-b border-slate-100">
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by ticket ID or subject..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-[13px] font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors shadow-2xs" 
            />
          </div>

          <div className="relative self-end sm:self-auto" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            >
              <Filter size={14} /> {filterPriority} ▾
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-1 overflow-hidden">
                {['All Priorities', 'High', 'Medium', 'Low'].map(p => (
                  <div 
                    key={p} 
                    onClick={() => { setFilterPriority(p); setFilterOpen(false); }}
                    className={`px-4 py-2.5 text-[13px] font-bold cursor-pointer hover:bg-slate-50 transition-colors flex items-center justify-between ${p === 'High' ? 'text-rose-600' : p === 'Medium' ? 'text-amber-600' : p === 'Low' ? 'text-slate-600' : 'text-slate-900'}`}
                  >
                    {p}
                    {filterPriority === p && <Check size={14} className="text-indigo-600" />}
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
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {['TICKET ID', 'SUBJECT', 'STATUS', 'PRIORITY', 'CREATED', 'ACTION'].map(h => (
                  <th key={h} className="py-3.5 px-6 text-[10px] font-black text-slate-400 tracking-wider uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[13px]">
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-black text-slate-900">{t.id}</td>
                  <td className="py-4 px-6 max-w-[320px] whitespace-normal">
                    <div className="font-bold text-slate-900 leading-tight">{t.subject}</div>
                    <div className="text-[11px] text-slate-400 font-semibold mt-0.5">{t.updated}</div>
                  </td>
                  <td className="py-4 px-6"><StatusBadge status={t.status} /></td>
                  <td className="py-4 px-6"><PriorityLabel priority={t.priority} /></td>
                  <td className="py-4 px-6 text-slate-500 font-medium">{t.created}</td>
                  <td className="py-4 px-6">
                    <button 
                      onClick={() => setSelectedTicket(t)}
                      className="text-indigo-600 hover:text-indigo-800 text-[12px] font-extrabold tracking-wide hover:underline bg-none border-none cursor-pointer"
                    >
                      VIEW DETAILS
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400 font-semibold">No tickets found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Raise New Ticket Modal ── */}
      {showRaiseModal && createPortal(
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] overflow-y-auto" onClick={() => setShowRaiseModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[540px] shadow-2xl overflow-hidden border border-slate-200 my-auto" onClick={e => e.stopPropagation()}>
            
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 shrink-0">
                  <Ticket size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">Raise New Support Ticket</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Please provide detailed information about your issue</p>
                </div>
              </div>
              <button 
                onClick={() => { setShowRaiseModal(false); setFormError(''); setAttachedFile(null); }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSubmitTicket} className="p-6 flex flex-col gap-5 text-left">
              {formError && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-center gap-2 text-xs text-rose-700 font-bold">
                  <AlertCircle size={16} className="shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  SUBJECT / TITLE <span className="text-rose-500">*</span>
                </label>
                <input 
                  value={form.subject} 
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  placeholder="E.g. Unable to view latest invoice or load details" 
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors" 
                />
              </div>

              {/* Category + Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    CATEGORY <span className="text-rose-500">*</span>
                  </label>
                  <select 
                    value={form.category} 
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-slate-200 bg-white rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    <option>Billing & Invoices</option>
                    <option>Technical Issue</option>
                    <option>Feature Request</option>
                    <option>Driver / Load Issue</option>
                    <option>Other / General</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    PRIORITY LEVEL <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    {['Low', 'Medium', 'High'].map(p => {
                      const isActive = form.priority === p;
                      return (
                        <button 
                          key={p} 
                          type="button" 
                          onClick={() => setForm({ ...form, priority: p })}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                            isActive 
                              ? (p === 'High' ? 'bg-rose-600 text-white shadow-xs' : p === 'Medium' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-700 text-white shadow-xs') 
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  DESCRIPTION <span className="text-rose-500">*</span>
                </label>
                <textarea 
                  value={form.description} 
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Please describe your issue in detail..." 
                  rows={4}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors resize-none leading-relaxed" 
                />
              </div>

              {/* File Upload */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">ATTACHMENTS (OPTIONAL)</label>
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
                  className="border-2 border-dashed border-indigo-200 bg-indigo-50/30 hover:bg-indigo-50 hover:border-indigo-400 rounded-2xl p-5 text-center cursor-pointer transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
                    <Upload size={18} />
                  </div>
                  <div className="text-xs text-slate-700 font-bold">
                    <span className="text-indigo-600">Click to upload</span> or drag and drop file
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold mt-0.5">PNG, JPG, PDF up to 10 MB</div>
                  {attachedFile && (
                    <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg py-1 px-3">
                      <CheckCircle2 size={13} /> {attachedFile.name}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer buttons */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => { setShowRaiseModal(false); setFormError(''); setAttachedFile(null); }}
                  className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer flex items-center gap-2"
                >
                  <Ticket size={14} /> Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ── Ticket Details Modal ── */}
      {selectedTicket && createPortal(
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] overflow-y-auto" onClick={() => setSelectedTicket(null)}>
          <div className="bg-white rounded-2xl w-full max-w-[550px] max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 my-auto" onClick={e => e.stopPropagation()}>
            
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-100">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">{selectedTicket.id} Details</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{selectedTicket.subject}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTicket(null)} 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
              {/* Problem Description */}
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Problem Description</h4>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 leading-relaxed font-medium">
                  The user reported an issue related to: <strong className="text-slate-900 font-bold">{selectedTicket.subject}</strong>. Priority is set to <strong className="text-slate-900 font-bold">{selectedTicket.priority}</strong> and status is <strong className="text-slate-900 font-bold">{selectedTicket.status}</strong>.
                </div>
              </div>

              {/* Chat History */}
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3">Chat History</h4>
                <div className="space-y-3">
                  {(chats[selectedTicket.id] || []).map((msg, i) => {
                    const isUser = msg.from === 'user';
                    return (
                      <div key={i} className={`flex items-end gap-2.5 ${isUser ? 'flex-row' : 'flex-row-reverse'}`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${isUser ? 'bg-indigo-600 text-white' : 'bg-amber-400 text-slate-950'}`}>
                          {isUser ? 'U' : 'S'}
                        </div>
                        <div className="max-w-[78%]">
                          <div className={`rounded-2xl px-4 py-2.5 text-xs text-slate-800 leading-relaxed font-semibold border ${
                            isUser 
                              ? 'bg-indigo-50/70 border-indigo-100 rounded-bl-none' 
                              : 'bg-amber-50/70 border-amber-100 rounded-br-none'
                          }`}>
                            {msg.text}
                          </div>
                          <div className={`text-[9px] text-slate-400 font-bold mt-1 ${isUser ? 'text-left' : 'text-right'}`}>
                            {msg.time}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {(chats[selectedTicket.id] || []).length === 0 && (
                    <p className="text-center text-xs text-slate-400 font-bold py-4">No messages yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Chat input */}
            <div className="p-4 border-t border-slate-100 flex gap-2 bg-slate-50/50 shrink-0">
              <input 
                value={chatMsg} 
                onChange={e => setChatMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMsg()}
                placeholder="Type a message..."
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-colors" 
              />
              <button 
                onClick={handleSendMsg}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <Send size={14} /> Send
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
