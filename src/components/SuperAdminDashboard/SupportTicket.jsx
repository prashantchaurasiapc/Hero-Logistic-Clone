import React, { useState, useEffect } from 'react';
import { Search, Plus, X, CheckCircle } from 'lucide-react';

export default function SupportTickets() {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals state
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [showResponderModal, setShowResponderModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Form states
  const [newTicketForm, setNewTicketForm] = useState({
    company: 'Falcon Logistics LLC',
    category: 'General / Platform',
    priority: 'Medium',
    subject: '',
    message: ''
  });
  const [replyPayload, setReplyPayload] = useState('');

  // Toast notification state
  const [toast, setToast] = useState('');

  const showNotification = (msg) => {
    setToast(msg);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Support Tickets database
  const [tickets, setTickets] = useState([
    {
      id: 1,
      company: 'Falcon Logistics LLC',
      subject: 'Invoice Factoring Delay',
      priority: 'High',
      status: 'OPEN',
      assignee: 'Unassigned',
      created: '2026-06-20',
      message: 'Cannot sync payroll with factoring payment rules.'
    },
    {
      id: 2,
      company: 'Swift Cargo Express',
      subject: 'GPS Geofencing Issues',
      priority: 'Medium',
      status: 'OPEN',
      assignee: 'Unassigned',
      created: '2026-06-20',
      message: 'Geofencing triggers are delayed by 5-10 minutes on mobile nodes.'
    }
  ]);

  // Recent Response History
  const [responseHistory, setResponseHistory] = useState([
    { ticketId: 1, subject: 'Invoice Factoring Delay', response: 'Checking billing logs.' }
  ]);

  const handleOpenNewTicket = (e) => {
    e.preventDefault();
    if (!newTicketForm.subject || !newTicketForm.message) {
      alert('Please fill out all fields.');
      return;
    }

    const nextId = tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 1;
    const newTicket = {
      id: nextId,
      company: newTicketForm.company,
      subject: newTicketForm.subject,
      priority: newTicketForm.priority,
      status: 'OPEN',
      assignee: 'Unassigned',
      created: new Date().toISOString().split('T')[0],
      message: newTicketForm.message
    };

    setTickets([newTicket, ...tickets]);
    setShowNewTicketModal(false);
    // Reset form
    setNewTicketForm({
      company: 'Falcon Logistics LLC',
      category: 'General / Platform',
      priority: 'Medium',
      subject: '',
      message: ''
    });
    showNotification(`Ticket #${nextId} opened successfully!`);
  };

  const handleAssignTicket = (id) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, assignee: 'Super Admin' } : t));
    showNotification(`Ticket #${id} assigned to Super Admin.`);
  };

  const handleOpenResponder = (ticket) => {
    setSelectedTicket(ticket);
    setReplyPayload('');
    setShowResponderModal(true);
  };

  const handleSubmitResolution = (e) => {
    e.preventDefault();
    if (!replyPayload) {
      alert('Please provide resolution details.');
      return;
    }

    // Update ticket status
    setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, status: 'RESOLVED', assignee: 'Super Admin' } : t));
    
    // Add to history
    setResponseHistory([
      { ticketId: selectedTicket.id, subject: selectedTicket.subject, response: replyPayload },
      ...responseHistory
    ]);

    setShowResponderModal(false);
    showNotification(`Ticket #${selectedTicket.id} has been marked as RESOLVED.`);
  };

  const handleDirectResolve = (id) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'RESOLVED', assignee: 'Super Admin' } : t));
    const target = tickets.find(t => t.id === id);
    setResponseHistory([
      { ticketId: id, subject: target.subject, response: 'Resolved directly by Super Admin.' },
      ...responseHistory
    ]);
    showNotification(`Ticket #${id} resolved.`);
  };

  const handleExportCSV = () => {
    const headers = ['Ticket ID', 'Company', 'Subject', 'Priority', 'Status', 'Assignee', 'Created Date'];
    const rows = tickets.map(t => [`#${t.id}`, t.company, t.subject, t.priority, t.status, t.assignee, t.created]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'support_tickets_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Support tickets exported successfully as CSV!');
  };

  // KPI Calculations
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'OPEN').length;
  const resolvedTickets = tickets.filter(t => t.status === 'RESOLVED').length;
  const highPriority = tickets.filter(t => t.priority === 'High' && t.status === 'OPEN').length;

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.id.toString().includes(searchQuery);
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <div className="flex-grow bg-[#F8FAFC] p-6 w-full font-sans text-left space-y-6 relative">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3.5 rounded-xl shadow-lg border border-slate-700/50 flex items-center gap-2.5 animate-slide-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">
            Super Admin • Support
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Configure global licensing rules, audit tenant margins, and resolve support tickets.
          </p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="border border-slate-200 bg-white hover:bg-slate-50 text-yellow-500 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          Export Report
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">TOTAL TICKETS</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">{totalTickets}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-2">
            <span>All-time support tickets</span>
            <span>Synced</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">OPEN TICKETS</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">{openTickets}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold mt-2">
            <span className="text-slate-400">Requiring response</span>
            <span className={openTickets > 0 ? 'text-rose-500 font-extrabold' : 'text-slate-400'}>
              {openTickets > 0 ? 'Alert' : 'Stable'}
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">RESOLVED</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">{resolvedTickets}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-2">
            <span>Closed successfully</span>
            <span>Stable</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">HIGH PRIORITY</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">{highPriority}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold mt-2">
            <span className="text-slate-400">Urgent escalations</span>
            <span className={highPriority > 0 ? 'text-rose-500 font-extrabold' : 'text-slate-400'}>
              {highPriority > 0 ? 'Alert' : 'Stable'}
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">AVG RESPONSE</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">2.4 hrs</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-2">
            <span>Average first reply time</span>
            <span>Stable</span>
          </div>
        </div>
      </div>

      {/* Main Support Registry Grid */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs w-full">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-lg font-black text-slate-800 mb-1">Support Ticket Queue</h2>
            <p className="text-xs font-semibold text-slate-400">Manage Inbound platform support requests.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="relative w-48">
              <input 
                type="text" 
                placeholder="Search tickets..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none placeholder:text-slate-400 font-sans text-slate-800"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>

            <select 
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 text-xs font-bold rounded-xl focus:outline-none text-slate-700 cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 text-xs font-bold rounded-xl focus:outline-none text-slate-700 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="OPEN">OPEN</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>

            <button 
              onClick={() => setShowNewTicketModal(true)}
              className="bg-[#FFAB00] hover:bg-[#FFA000] text-black font-black text-xs px-4 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> New Ticket
            </button>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-150 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="pb-4 font-black">TICKET ID</th>
                <th className="pb-4 font-black">COMPANY</th>
                <th className="pb-4 font-black">SUBJECT</th>
                <th className="pb-4 font-black">PRIORITY</th>
                <th className="pb-4 font-black">STATUS</th>
                <th className="pb-4 font-black">ASSIGNED AGENT</th>
                <th className="pb-4 font-black">CREATED</th>
                <th className="pb-4 text-right pr-0 font-black">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
              {filteredTickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/10">
                  <td className="py-4 text-slate-500">#{t.id}</td>
                  <td className="py-4 font-extrabold text-slate-800">{t.company}</td>
                  <td className="py-4 text-slate-800">{t.subject}</td>
                  <td className="py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      t.priority === 'High' ? 'bg-[#FCE8E6] text-[#C5221F]' :
                      t.priority === 'Medium' ? 'bg-[#FEF7E0] text-[#B06000]' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                      {t.status}
                    </span>
                  </td>
                  <td className="py-4 text-slate-500 font-semibold">{t.assignee}</td>
                  <td className="py-4 text-slate-400 font-semibold">{t.created}</td>
                  <td className="py-4 text-right pr-0 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenResponder(t)}
                      className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-[10px] px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      View
                    </button>
                    {t.status === 'OPEN' && (
                      <>
                        <button
                          onClick={() => handleAssignTicket(t.id)}
                          className="border border-[#FFD400] bg-white hover:bg-slate-50 text-[#CC7B00] font-extrabold text-[10px] px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
                        >
                          Assign
                        </button>
                        <button
                          onClick={() => handleDirectResolve(t.id)}
                          className="bg-[#0F9D58] hover:bg-[#0b8043] text-white font-extrabold text-[10px] px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
                        >
                          Resolve
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Response History section */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs w-full">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">RECENT RESPONSE HISTORY</h2>
        <div className="space-y-4">
          {responseHistory.map((h, idx) => (
            <div key={idx} className="border-l-4 border-[#FFD400] pl-4 py-1">
              <h4 className="text-xs font-extrabold text-slate-800">Ticket #{h.ticketId} — {h.subject}</h4>
              <p className="text-xs font-semibold text-slate-500 mt-1">{h.response}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal 1: Open Support Ticket */}
      {showNewTicketModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-900">Open Support Ticket</h3>
              <button 
                onClick={() => setShowNewTicketModal(false)} 
                className="text-slate-400 hover:text-slate-650 cursor-pointer transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOpenNewTicket} className="p-6 space-y-4 font-sans">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">TENANT COMPANY</label>
                <select
                  value={newTicketForm.company}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, company: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 text-xs font-bold rounded-xl focus:border-[#FFD400] focus:outline-none text-slate-800 cursor-pointer"
                >
                  <option value="Falcon Logistics LLC">Falcon Logistics LLC</option>
                  <option value="Swift Cargo Express">Swift Cargo Express</option>
                  <option value="Global Shipping Solutions">Global Shipping Solutions</option>
                  <option value="Texas Hotshot Carriers">Texas Hotshot Carriers</option>
                  <option value="Apex Logistics LLC">Apex Logistics LLC</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">CATEGORY</label>
                  <select
                    value={newTicketForm.category}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 text-xs font-bold rounded-xl focus:border-[#FFD400] focus:outline-none text-slate-800 cursor-pointer"
                  >
                    <option value="General / Platform">General / Platform</option>
                    <option value="Billing">Billing</option>
                    <option value="GPS / API Tracking">GPS / API Tracking</option>
                    <option value="Driver App">Driver App</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">PRIORITY</label>
                  <select
                    value={newTicketForm.priority}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, priority: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 text-xs font-bold rounded-xl focus:border-[#FFD400] focus:outline-none text-slate-800 cursor-pointer"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">SUBJECT HEADING</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GPS Geofencing synchronization error"
                  value={newTicketForm.subject}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">DETAILED MESSAGE PAYLOAD</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Describe the issue or request in detail..."
                  value={newTicketForm.message}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none text-slate-800 placeholder:text-slate-400 font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#FFA000] hover:bg-[#FF8F00] text-black font-extrabold py-3.5 rounded-xl text-center text-xs transition-colors cursor-pointer mt-4 flex justify-center items-center gap-1.5"
              >
                Open Ticket
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Support Ticket Responder */}
      {showResponderModal && selectedTicket && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-md overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-900">Support Ticket Responder</h3>
              <button 
                onClick={() => setShowResponderModal(false)} 
                className="text-slate-400 hover:text-slate-650 cursor-pointer transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitResolution} className="p-6 space-y-4 font-sans">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-450">Ticket #{selectedTicket.id}</span>
                <span className="bg-slate-100 text-slate-650 text-[10px] font-black px-2 py-0.5 rounded">
                  {selectedTicket.status}
                </span>
              </div>

              <div>
                <h4 className="text-base font-extrabold text-slate-800 mb-4">{selectedTicket.subject}</h4>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">QUERY DETAILS</label>
                <div className="w-full px-3.5 py-3 bg-slate-50 border border-slate-150 text-xs rounded-xl text-slate-600 font-semibold">
                  "{selectedTicket.message}"
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">REPLY MESSAGE PAYLOAD</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Provide developer / administrative instructions..."
                  value={replyPayload}
                  onChange={(e) => setReplyPayload(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none text-slate-800 placeholder:text-slate-400 font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#FFA000] hover:bg-[#FF8F00] text-black font-extrabold py-3.5 rounded-xl text-center text-xs transition-colors cursor-pointer mt-4"
              >
                Submit Resolution
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
