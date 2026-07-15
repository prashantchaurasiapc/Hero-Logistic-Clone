import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, Filter, AlertCircle, Clock, CheckCircle2, User as UserIcon, X, ChevronDown, Check } from 'lucide-react';

export default function OpenTickets() {
  const [tickets, setTickets] = useState([
    { id: 'TKT-8902', subject: 'Issue with assigning driver to load', status: 'Open', priority: 'High', date: 'Oct 24, 2026', user: 'Sarah Mitchell (Dispatch)', description: 'I am unable to assign John Doe to load L-1245. The system keeps throwing a "Driver Unavailable" error even though he has no active loads.' },
    { id: 'TKT-8875', subject: 'Billing cycle clarification', status: 'In Progress', priority: 'Medium', date: 'Oct 22, 2026', user: 'John Doe (Finance)', description: 'Can you please explain how the pro-rated billing works when adding a new user in the middle of a billing cycle?' },
    { id: 'TKT-8812', subject: 'App crashing on document upload', status: 'Open', priority: 'High', date: 'Oct 20, 2026', user: 'Mike T. (Driver)', description: 'Whenever I try to upload the proof of delivery (POD) photo, the mobile app crashes immediately. I am using an iPhone 13.' },
    { id: 'TKT-8750', subject: 'New branch setup assistance', status: 'In Progress', priority: 'Low', date: 'Oct 05, 2026', user: 'Admin User', description: 'We are opening a new warehouse in Melbourne next month. Need assistance with setting up the zones and bays in the system.' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'All' || ticket.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const handleResolveTicket = () => {
    if (selectedTicket) {
      setTickets(tickets.map(t => 
        t.id === selectedTicket.id ? { ...t, status: 'Resolved' } : t
      ));
      setSelectedTicket({ ...selectedTicket, status: 'Resolved' });
    }
  };

  const modalContent = selectedTicket && (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{selectedTicket.id}</span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                selectedTicket.status === 'Open' ? 'bg-amber-100 text-amber-700' :
                selectedTicket.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                'bg-emerald-100 text-emerald-700'
              }`}>
                {selectedTicket.status}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                selectedTicket.priority === 'High' ? 'bg-red-100 text-red-700' :
                selectedTicket.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {selectedTicket.priority} Priority
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">{selectedTicket.subject}</h2>
          </div>
          <button 
            onClick={() => setSelectedTicket(null)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 bg-gray-50/30 flex-1 text-left">
          <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {selectedTicket.user.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{selectedTicket.user}</p>
              <p className="text-xs text-gray-500">Reported on {selectedTicket.date}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">Problem Description</h3>
            <div className="bg-white border border-gray-200 p-4 rounded-xl text-sm text-gray-700 leading-relaxed shadow-sm">
              {selectedTicket.description}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Chat History</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-600">{selectedTicket.user.charAt(0)}</div>
                <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none text-sm text-gray-700">
                  {selectedTicket.description}
                  <div className="text-[10px] text-gray-400 mt-1">{selectedTicket.date}, 10:30 AM</div>
                </div>
              </div>
              <div className="flex gap-3 flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-yellow-400 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-900">S</div>
                <div className="bg-yellow-100 p-3 rounded-2xl rounded-tr-none text-sm text-gray-800">
                  Hi, we are looking into this right now. We will update you shortly.
                  <div className="text-[10px] text-gray-500 mt-1">{selectedTicket.date}, 11:15 AM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-between items-center rounded-b-3xl">
          <button 
            onClick={() => setSelectedTicket(null)}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-150 transition-colors cursor-pointer"
          >
            Close
          </button>
          
          {selectedTicket.status !== 'Resolved' ? (
            <button 
              onClick={handleResolveTicket}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-all shadow-md cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" /> Mark as Resolved
            </button>
          ) : (
            <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Ticket Resolved
            </div>
          )}
        </div>

      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto bg-white min-h-screen text-left flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-none mb-1.5 animate-fade-in">Open Tickets</h1>
          <p className="text-gray-500 text-[13px]">Company-wide active support requests</p>
        </div>
        <div className="text-sm font-semibold text-gray-500">
          Total Active: <span className="text-gray-900 font-bold">{tickets.filter(t => t.status !== 'Resolved').length}</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Controls Bar */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search across all open tickets..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-755 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
            />
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-55 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 transition-colors cursor-pointer"
            >
              <Filter className="h-4 w-4 text-gray-500" /> {priorityFilter === 'All' ? 'Filter By Priority' : `Priority: ${priorityFilter}`}
              <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
            </button>
            
            {isFilterDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-fade-in text-left">
                {['All', 'High', 'Medium', 'Low'].map(p => (
                  <button
                    key={p}
                    onClick={() => {
                      setPriorityFilter(p);
                      setIsFilterDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-gray-50 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <span className={p === 'High' ? 'text-red-600' : p === 'Medium' ? 'text-orange-500' : p === 'Low' ? 'text-gray-500' : 'text-gray-900'}>
                      {p === 'All' ? 'All Priorities' : p}
                    </span>
                    {priorityFilter === p && <Check className="w-4 h-4 text-yellow-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tickets Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/40 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left">Ticket ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left">Subject & User</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Priority</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTickets.length > 0 ? filteredTickets.map((ticket, i) => (
                <tr key={ticket.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    <span className="text-xs font-bold text-gray-955">{ticket.id}</span>
                    <span className="block text-[10px] text-gray-400 mt-1 font-semibold">{ticket.date}</span>
                  </td>
                  <td className="px-6 py-4 text-left">
                    <span className="text-xs font-bold text-gray-955">{ticket.subject}</span>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400 font-semibold">
                      <UserIcon className="w-3 h-3 text-gray-400" /> {ticket.user}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider shadow-3xs border ${
                        ticket.status === 'Open' ? 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]' :
                        ticket.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                        {ticket.status === 'Open' && <AlertCircle className="w-3 h-3 text-[#D97706]" />}
                        {ticket.status === 'In Progress' && <Clock className="w-3 h-3 text-blue-500" />}
                        {ticket.status === 'Resolved' && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                        {ticket.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`text-xs font-bold ${
                      ticket.priority === 'High' ? 'text-red-500' :
                      ticket.priority === 'Medium' ? 'text-orange-500' :
                      'text-gray-500'
                    }`}>{ticket.priority}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button 
                      onClick={() => setSelectedTicket(ticket)}
                      className="text-blue-650 hover:text-blue-800 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Review Ticket
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-550 font-bold text-xs">
                    No tickets found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Render Modal via Portal */}
      {selectedTicket && createPortal(modalContent, document.body)}
    </div>
  );
}
