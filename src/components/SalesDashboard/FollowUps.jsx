import React, { useState, useEffect } from 'react';
import {
  Plus, X, Bell, ChevronDown, Check,
  Phone, Mail, Calendar, CheckCircle, AlertCircle, Clock
} from 'lucide-react';
import { crmRepository } from '../../services/crmRepository';
import { crmStore } from '../../services/crmStore';

export default function FollowUps() {
  // Database States
  const [followups, setFollowups] = useState([]);
  const [leads, setLeads] = useState([]);

  // UI States
  const [activeRole, setActiveRole] = useState('Sales Director');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalForm, setModalForm] = useState({
    leadId: '',
    type: 'Call',
    priority: 'Medium',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '10:00 AM',
    notes: ''
  });

  // Toast
  const [toast, setToast] = useState(null);

  // Subscribe to crmStore
  useEffect(() => {
    const syncDb = () => {
      const db = crmRepository.getCrmDatabase();
      setFollowups(db.crmFollowups || []);
      setLeads(crmRepository.getLeads());
    };
    syncDb();
    const unsubscribe = crmStore.subscribe(syncDb);
    return () => unsubscribe();
  }, []);

  // Sync modal default lead
  useEffect(() => {
    if (leads.length > 0) {
      setModalForm(prev => ({ ...prev, leadId: prev.leadId || leads[0].id }));
    }
  }, [leads]);

  // Toast auto-clear
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const repsList = ['Alex Wright', 'Sarah K.', 'Michael Scott', 'Jan Levinson', 'Ryan Howard'];

  const filters = ['ALL', 'PENDING', 'COMPLETED', 'MISSED'];

  const getTypeIcon = (type) => {
    if (type === 'Call') return { icon: <Phone className="w-5 h-5" />, bg: 'bg-amber-50 text-amber-500 border border-amber-100' };
    if (type === 'Email') return { icon: <Mail className="w-5 h-5" />, bg: 'bg-indigo-50 text-indigo-400 border border-indigo-100' };
    if (type === 'Meeting') return { icon: <Calendar className="w-5 h-5" />, bg: 'bg-fuchsia-50 text-fuchsia-400 border border-fuchsia-100' };
    return { icon: <CheckCircle className="w-5 h-5" />, bg: 'bg-slate-50 text-slate-400 border border-slate-100' };
  };

  const getStatusStyle = (status) => {
    if (status === 'Completed') return 'bg-emerald-50 border border-emerald-200 text-emerald-700';
    if (status === 'Missed') return 'bg-rose-50 border border-rose-200 text-rose-700';
    return 'bg-amber-50 border border-amber-200 text-amber-700';
  };

  // Handle complete follow-up
  const handleMarkCompleted = (followupId) => {
    crmStore.updateDb((db) => {
      const f = (db.crmFollowups || []).find(x => x.id === followupId);
      if (f) f.status = 'Completed';
    });
    setToast({ text: 'Follow-up task marked as completed.' });
  };

  // Handle add task form submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!modalForm.leadId) return;

    const lead = leads.find(l => l.id === modalForm.leadId);
    if (!lead) return;

    crmStore.updateDb((db) => {
      if (!db.crmFollowups) db.crmFollowups = [];
      db.crmFollowups.unshift({
        id: `followup_manual_${Date.now()}`,
        leadId: modalForm.leadId,
        company: lead.company,
        contact: lead.name,
        type: modalForm.type,
        priority: modalForm.priority,
        dueDate: modalForm.dueDate,
        dueTime: modalForm.dueTime,
        status: 'Pending',
        notes: modalForm.notes || `Touchpoint checklist regarding pain points: ${lead.painPoints || 'N/A'}.`
      });
    });

    setToast({ text: `Follow-up task logged for ${lead.company}.` });
    setShowAddModal(false);
    setModalForm({
      leadId: leads[0]?.id || '',
      type: 'Call',
      priority: 'Medium',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '10:00 AM',
      notes: ''
    });
  };

  // Filter and role-filter followups
  const filteredFollowups = followups.filter(f => {
    // Role filter
    if (activeRole !== 'Sales Director') {
      const lead = leads.find(l => l.id === f.leadId);
      if (!lead || lead.rep !== activeRole) return false;
    }

    // Status tab filter
    if (activeFilter === 'PENDING') return f.status === 'Pending';
    if (activeFilter === 'COMPLETED') return f.status === 'Completed';
    if (activeFilter === 'MISSED') return f.status === 'Missed';
    return true;
  });

  return (
    <div className="flex-grow bg-[#F8FAFC] p-6 space-y-6 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full text-left font-sans flex flex-col h-full min-h-0">

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-xl text-xs font-semibold animate-slide-in">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
          {toast.text}
        </div>
      )}

      {/* Header Container */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
              Follow-Ups
            </h1>
            <div className="bg-[#FEF3C7] text-[#92400E] px-2.5 py-1 text-[9px] rounded-lg border border-[#FDE68A] uppercase font-black leading-none flex flex-col items-center justify-center shrink-0">
              <span className="text-[7px] text-[#B45309] font-bold tracking-wider mb-0.5">Enterprise</span>
              <span>Logistics</span>
            </div>
            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2.5 py-1 rounded-full font-extrabold shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Shift: Sales Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Complete end-to-end client conversion console backed by secure localStorage registry tables.
          </p>
        </div>
      </div>

      {/* Tasks Panel */}
      <div className="flex-grow bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col overflow-hidden min-h-0">
        {/* Panel Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0">
          <div>
            <h2 className="text-[13px] font-black text-slate-900">Sales Follow-Up Tasks Agenda</h2>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              Track pending calls, touchpoint emails, and administrative check-ins.
            </p>
          </div>
          <button
            onClick={() => {
              setModalForm({
                leadId: leads[0]?.id || '',
                type: 'Call',
                priority: 'Medium',
                dueDate: new Date().toISOString().split('T')[0],
                dueTime: '10:00 AM',
                notes: ''
              });
              setShowAddModal(true);
            }}
            className="flex items-center gap-1.5 text-[#D97706] hover:text-[#B45309] font-extrabold text-[10px] bg-white border border-[#FDE68A] hover:bg-[#FFFBEB] px-3.5 py-2 rounded-xl transition-colors shrink-0 whitespace-nowrap shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 shrink-0 stroke-[3px]" /> Log Touchpoint Task
          </button>
        </div>

        {/* Follow-Up Items List */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {filteredFollowups.map((f) => {
            const { icon, bg } = getTypeIcon(f.type);

            return (
              <div
                key={f.id}
                className="p-5 flex items-center justify-between gap-5 bg-white border border-slate-200/80 rounded-[1.25rem] shadow-sm hover:border-amber-200 transition-colors"
              >
                {/* Icon */}
                <div className={`w-[3.25rem] h-[3.25rem] rounded-2xl flex items-center justify-center shrink-0 ${bg}`}>
                  {icon}
                </div>

                {/* Content */}
                <div className="flex-grow min-w-0 flex flex-col justify-center">
                  <div className="flex items-center gap-3 flex-wrap mb-1.5">
                    <strong className="text-slate-900 font-black text-[13px] leading-none">
                      {f.company}
                    </strong>
                    <span className="text-[9px] text-slate-600 bg-slate-50 border border-slate-100 px-2.5 py-0.5 rounded font-mono font-bold tracking-wide">
                      {f.dueDate} • {f.dueTime}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-semibold leading-normal">
                    Contact: <span className="text-slate-700">{f.contact}</span> • Task: {f.notes}
                  </p>
                </div>

                {/* Status Badge + Action */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 border border-emerald-100/50 leading-none">
                    COMPLETED
                  </span>
                </div>
              </div>
            );
          })}

          {filteredFollowups.length === 0 && (
            <div className="py-16 text-center text-slate-400 font-bold text-xs uppercase tracking-wider select-none">
              No follow-up tasks in this view.
            </div>
          )}
        </div>
      </div>

      {/* Log Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md overflow-hidden shadow-2xl text-left flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" /> Log New Touchpoint Task
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs font-bold text-slate-700">
              {/* Lead Select */}
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Select CRM Lead *</label>
                <select
                  required
                  value={modalForm.leadId}
                  onChange={(e) => setModalForm({ ...modalForm, leadId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#ffcc00] rounded-xl focus:outline-none text-slate-800 cursor-pointer"
                >
                  {leads.map(l => (
                    <option key={l.id} value={l.id}>{l.company} ({l.name})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Type */}
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Channel Type</label>
                  <select
                    value={modalForm.type}
                    onChange={(e) => setModalForm({ ...modalForm, type: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#ffcc00] rounded-xl focus:outline-none text-slate-800 cursor-pointer"
                  >
                    <option value="Call">Phone Call</option>
                    <option value="Email">Email</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Task">Task</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Priority</label>
                  <select
                    value={modalForm.priority}
                    onChange={(e) => setModalForm({ ...modalForm, priority: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#ffcc00] rounded-xl focus:outline-none text-slate-800 cursor-pointer"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Due Date</label>
                  <input
                    type="date"
                    value={modalForm.dueDate}
                    onChange={(e) => setModalForm({ ...modalForm, dueDate: e.target.value })}
                    className="w-full px-2.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#ffcc00] rounded-xl focus:outline-none text-slate-800"
                  />
                </div>
              </div>

              {/* Due Time */}
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Due Time</label>
                <input
                  type="text"
                  value={modalForm.dueTime}
                  onChange={(e) => setModalForm({ ...modalForm, dueTime: e.target.value })}
                  placeholder="e.g. 10:30 AM"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#ffcc00] rounded-xl focus:outline-none text-slate-800"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Task Notes</label>
                <textarea
                  value={modalForm.notes}
                  onChange={(e) => setModalForm({ ...modalForm, notes: e.target.value })}
                  placeholder="Touchpoint context, agenda, follow-up objectives..."
                  rows="3"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-[#ffcc00] rounded-xl focus:outline-none text-slate-800 resize-none font-semibold"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs py-3 rounded-xl border border-slate-200 transition-colors cursor-pointer text-center">Cancel</button>
                <button type="submit" className="flex-1 bg-[#ffcc00] hover:bg-[#e6b800] text-black font-extrabold text-xs py-3 rounded-xl transition-colors cursor-pointer text-center shadow-xs">Log Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
