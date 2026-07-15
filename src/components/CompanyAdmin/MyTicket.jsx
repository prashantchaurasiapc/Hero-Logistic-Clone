import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, Plus, Filter, MessageSquare, Clock, AlertCircle, CheckCircle2, X, Upload, Send, ChevronDown, Check } from 'lucide-react';

export default function MyTickets() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [tickets] = useState([
    { id: 'TKT-8902', subject: 'Issue with assigning driver to load', status: 'Open', priority: 'High', date: 'Oct 24, 2026', lastUpdate: '2 hours ago' },
    { id: 'TKT-8875', subject: 'Billing cycle clarification', status: 'In Progress', priority: 'Medium', date: 'Oct 22, 2026', lastUpdate: '1 day ago' },
    { id: 'TKT-8810', subject: 'Cannot access yard map', status: 'Resolved', priority: 'High', date: 'Oct 15, 2026', lastUpdate: 'Oct 16, 2026' },
    { id: 'TKT-8799', subject: 'Feature request: Custom export fields', status: 'Resolved', priority: 'Low', date: 'Oct 10, 2026', lastUpdate: 'Oct 14, 2026' },
  ]);

  const filteredTickets = tickets.filter(ticket => {
    return priorityFilter === 'All' || ticket.priority === priorityFilter;
  });

  const ticketDetailsModal = selectedTicket && (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">{selectedTicket.id} Details</h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{selectedTicket.subject}</p>
            </div>
          </div>
          <button 
            onClick={() => setSelectedTicket(null)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="text-left">
            <h3 className="text-sm font-bold text-gray-900 mb-2">Problem Description</h3>
            <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
              The user reported an issue related to: <strong>{selectedTicket.subject}</strong>. 
              The priority is currently set to <strong>{selectedTicket.priority}</strong> and the status is <strong>{selectedTicket.status}</strong>.
              Please investigate the root cause and provide a resolution as soon as possible.
            </p>
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Chat History</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-600">U</div>
                <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none text-sm text-gray-700">
                  I am experiencing this issue since yesterday. Can someone help?
                  <div className="text-[10px] text-gray-400 mt-1">Oct 23, 2026, 10:30 AM</div>
                </div>
              </div>
              <div className="flex gap-3 flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-yellow-400 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-900">S</div>
                <div className="bg-yellow-100 p-3 rounded-2xl rounded-tr-none text-sm text-gray-800">
                  Hi, we are looking into this right now. We will update you shortly.
                  <div className="text-[10px] text-gray-500 mt-1">Oct 23, 2026, 11:15 AM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
          <input type="text" placeholder="Type a message..." className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#FFD400]" />
          <button className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors flex items-center justify-center cursor-pointer">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const modalContent = isModalOpen && (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-600">
              <Plus className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">Raise New Ticket</h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Please provide details about your issue</p>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <div className="p-6 overflow-y-auto space-y-5 text-left">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Subject / Title <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              placeholder="E.g. Unable to view latest invoice" 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#FFD400] focus:bg-white transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Category <span className="text-red-500">*</span></label>
              <div className="relative">
                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#FFD400] focus:bg-white transition-colors appearance-none cursor-pointer">
                  <option value="">Select Category</option>
                  <option value="billing">Billing & Subscriptions</option>
                  <option value="fleet">Fleet Management</option>
                  <option value="app_bug">App Bug / Glitch</option>
                  <option value="feature">Feature Request</option>
                  <option value="other">Other</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-505">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Priority Level <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                <label className="flex-1 cursor-pointer">
                  <input type="radio" name="priority" className="peer sr-only" value="low" />
                  <div className="px-3 py-2.5 text-center rounded-xl border border-gray-200 text-xs font-bold text-gray-500 peer-checked:border-gray-900 peer-checked:bg-gray-900 peer-checked:text-white transition-all">
                    Low
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input type="radio" name="priority" className="peer sr-only" value="medium" defaultChecked />
                  <div className="px-3 py-2.5 text-center rounded-xl border border-gray-200 text-xs font-bold text-gray-500 peer-checked:border-orange-500 peer-checked:bg-orange-500 peer-checked:text-white transition-all">
                    Medium
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input type="radio" name="priority" className="peer sr-only" value="high" />
                  <div className="px-3 py-2.5 text-center rounded-xl border border-gray-200 text-xs font-bold text-gray-500 peer-checked:border-red-500 peer-checked:bg-red-500 peer-checked:text-white transition-all">
                    High
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Description <span className="text-red-500">*</span></label>
            <textarea 
              rows="4"
              placeholder="Please describe your issue in detail..." 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#FFD400] focus:bg-white transition-colors resize-none"
            ></textarea>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Attachments (Optional)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-yellow-400 hover:bg-yellow-50/50 transition-colors cursor-pointer group">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400 group-hover:text-yellow-500 transition-colors" />
                <div className="flex text-sm text-gray-600 justify-center">
                  <span className="relative font-bold text-yellow-600 hover:text-yellow-500 focus-within:outline-none">
                    <span>Upload a file</span>
                  </span>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-3xl">
          <button 
            onClick={() => setIsModalOpen(false)}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            onClick={() => setIsModalOpen(false)}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-black !text-white rounded-xl text-sm font-bold transition-all shadow-md cursor-pointer"
          >
            Submit Ticket <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto bg-white min-h-screen text-left flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-none mb-1.5 animate-fade-in">My Tickets</h1>
          <p className="text-gray-500 text-[13px]">Track and manage your support requests</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-[#FFD400] hover:bg-yellow-400 rounded-xl text-xs font-bold text-black transition-all shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Raise New Ticket
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Controls Bar */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by ticket ID or subject..." 
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-750 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-55 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 transition-colors cursor-pointer"
            >
              <Filter className="h-4 w-4 text-gray-500" /> {priorityFilter === 'All' ? 'Filter' : `Priority: ${priorityFilter}`}
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
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left">Subject</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Priority</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Created</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTickets.map((ticket, i) => (
                <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    <span className="text-xs font-bold text-gray-950">{ticket.id}</span>
                  </td>
                  <td className="px-6 py-4 text-left">
                    <span className="text-xs font-bold text-gray-950 block">{ticket.subject}</span>
                    <span className="block text-[10px] text-gray-400 mt-1 font-semibold">Updated {ticket.lastUpdate}</span>
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
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-xs text-gray-500 font-semibold">{ticket.date}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button 
                      onClick={() => setSelectedTicket(ticket)} 
                      className="text-blue-650 hover:text-blue-800 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Render Modal via Portal */}
      {isModalOpen && createPortal(modalContent, document.body)}
      {selectedTicket && createPortal(ticketDetailsModal, document.body)}
    </div>
  );
}
