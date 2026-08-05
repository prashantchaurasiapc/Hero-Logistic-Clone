import React, { useState, useEffect } from 'react';
import {
  Plus, X, Bell, ChevronDown, Check, Briefcase,
  CheckCircle2, AlertCircle, RefreshCw, FileText, User, Send, AlertTriangle
} from 'lucide-react';
import { crmRepository } from '../../services/crmRepository';
import { crmStore } from '../../services/crmStore';

export default function OnboardingHandover() {
  // Database States
  const [onboarding, setOnboarding] = useState([]);
  const [leads, setLeads] = useState([]);

  // UI States
  const [activeRole, setActiveRole] = useState('Sales Director');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [selectedHandover, setSelectedHandover] = useState(null);

  // Modal States
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [targetRep, setTargetRep] = useState('Michael Scott (Regional Coordinator)');
  const [handoverNotes, setHandoverNotes] = useState('');

  // Toast
  const [toast, setToast] = useState(null);

  // Subscribe to crmStore
  useEffect(() => {
    const syncDb = () => {
      const db = crmRepository.getCrmDatabase();
      const newOnboarding = [...(db.crmHandovers || [])];
      setOnboarding(newOnboarding);
      setLeads([...crmRepository.getLeads()]);

      setSelectedHandover(prev => {
        if (!prev) return null;
        const updated = newOnboarding.find(o => o.id === prev.id);
        if (updated) return { ...updated }; // force re-render by returning new reference
        return null;
      });
    };
    syncDb();
    const unsubscribe = crmStore.subscribe(syncDb);
    return () => unsubscribe();
  }, []);

  // Toast auto-clear
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const repsList = ['Alex Wright', 'Sarah K.', 'Michael Scott', 'Jan Levinson', 'Ryan Howard'];

  // Compute checklist completion percent
  const getCompletion = (handover) => {
    if (!handover.checklist || handover.checklist.length === 0) {
      return handover.status === 'Completed' ? 100 : 50;
    }
    const done = handover.checklist.filter(c => c.completed).length;
    return Math.round((done / handover.checklist.length) * 100);
  };

  const getCompletionStyle = (pct) => {
    if (pct === 100) return 'bg-emerald-50 border border-emerald-100 text-emerald-500';
    if (pct >= 70) return 'bg-[#FFFBEB] border border-[#FDE68A] text-[#D97706]';
    return 'bg-slate-50 border border-slate-200 text-slate-500';
  };

  // Toggle checklist item
  const handleToggleChecklistItem = (handoverId, itemName) => {
    crmStore.updateDb((db) => {
      const h = (db.crmHandovers || []).find(x => x.id === handoverId);
      if (h) {
        if (!h.checklist) {
          const isDone = h.status === 'Completed';
          h.checklist = [
            { name: 'Company Workspace Provisioned', completed: isDone },
            { name: 'SaaS Subscription Plan Activated', completed: isDone },
            { name: 'Company Admin User Registered', completed: isDone },
            { name: 'Role Permission Policies Assigned', completed: isDone },
            { name: 'Mock Customer Inbound Data Importer', completed: isDone },
            { name: 'Roster & ELD System Training Complete', completed: isDone },
            { name: 'Sandbox Production Go-Live Scheduled', completed: isDone }
          ];
        }
        const item = h.checklist.find(c => c.name === itemName);
        if (item) item.completed = !item.completed;

        // Update status
        const allDone = h.checklist.every(c => c.completed);
        if (allDone) h.status = 'Completed';
        else h.status = 'In Progress';
      }
    });
    setToast({ text: 'Onboarding checklist updated.' });
  };

  // Role filter
  const filteredHandovers = onboarding.filter(h => {
    if (activeRole !== 'Sales Director') {
      return h.owner === activeRole;
    }
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
              Onboarding Handover
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

      {/* Dual Panel Workspace */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT: Onboarding Handovers List */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col">
          {/* Panel Header */}
          <div className="px-5 py-4 border-b border-slate-100 shrink-0">
            <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">
              Won Carrier Workspace Handovers
            </h2>
          </div>

          {/* List */}
          <div className="flex-grow p-6 space-y-4 bg-slate-50/50">
            {filteredHandovers.map((h) => {
              const pct = getCompletion(h);

              return (
                <button
                  key={h.id}
                  onClick={() => setSelectedHandover(h)}
                  className={`w-full text-left p-4 bg-white border border-slate-200/80 rounded-[1rem] shadow-sm transition-all duration-150 ${
                    selectedHandover?.id === h.id ? 'border-amber-300 shadow-md bg-amber-50/10' : 'hover:border-amber-200'
                  }`}
                >
                  {/* Row 1: Company + Completion badge */}
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <strong className="text-slate-900 font-black text-[13px] leading-none truncate">
                      {h.company}
                    </strong>
                    <span className={`px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-widest shrink-0 leading-none ${getCompletionStyle(pct)}`}>
                      {pct}% Complete
                    </span>
                  </div>

                  {/* Row 2: Owner + Target */}
                  <div className="text-[11px] text-slate-700 font-semibold mb-3">
                    Owner: <span className="text-slate-900 font-bold">{h.owner}</span> <span className="text-slate-400 mx-1">•</span> Target: <span className="text-slate-900 font-bold">{h.targetDate || h.dueDate}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className={`${pct === 100 ? 'bg-emerald-400' : 'bg-[#ffcc00]'} h-1.5 rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </button>
              );
            })}

            {filteredHandovers.length === 0 && (
              <div className="py-16 text-center text-slate-400 font-bold text-xs uppercase tracking-wider select-none">
                No onboarding handovers available.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Handover Detail Panel */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col">
          {!selectedHandover ? (
            <div className="flex-grow flex items-center justify-center text-slate-400 font-semibold text-xs py-16 select-none">
              Select onboarding company.
            </div>
          ) : (
            <div className="flex flex-col h-full bg-slate-50/20">
              {/* Detail Header */}
              <div className="px-8 py-7 border-b border-slate-100 flex flex-col shrink-0 relative bg-white">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200 rounded px-3 py-1.5 leading-none">
                    SETUP HANDOVER STEPPER
                  </span>
                  <span className="text-[9px] font-black text-rose-400 bg-rose-50/50 border border-rose-200/60 rounded-full px-4 py-1.5 uppercase tracking-widest leading-none">
                    RISK: HIGH
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <h2 className="text-[20px] font-black text-slate-800 leading-none">{selectedHandover.company} setup Checklist</h2>
                  <button 
                    onClick={() => { setShowAddTaskModal(true); setNewTaskName(''); }} 
                    className="text-[10px] font-black text-[#D97706] hover:text-[#B45309] uppercase tracking-wider cursor-pointer leading-none"
                  >
                    + ADD TASK
                  </button>
                </div>
                <div className="text-[11px] font-medium text-slate-500 mt-3">
                  Responsible Owner: <span className="font-bold text-slate-700">{selectedHandover.owner}</span> <span className="mx-1.5">•</span> Due Target Date: <span className="font-bold text-slate-700">{selectedHandover.dueDate || selectedHandover.targetDate}</span>
                </div>
              </div>

              {/* Detail Body */}
              <div className="flex-grow px-8 py-7">
                {/* Setup Checklist */}
                <div className="space-y-3.5">
                  {(selectedHandover.checklist || [
                    { name: 'Company Workspace Provisioned', completed: getCompletion(selectedHandover) === 100 },
                    { name: 'SaaS Subscription Plan Activated', completed: getCompletion(selectedHandover) === 100 },
                    { name: 'Company Admin User Registered', completed: getCompletion(selectedHandover) === 100 },
                    { name: 'Role Permission Policies Assigned', completed: getCompletion(selectedHandover) === 100 },
                    { name: 'Mock Customer Inbound Data Importer', completed: getCompletion(selectedHandover) === 100 },
                    { name: 'Roster & ELD System Training Complete', completed: getCompletion(selectedHandover) === 100 },
                    { name: 'Sandbox Production Go-Live Scheduled', completed: getCompletion(selectedHandover) === 100 }
                  ]).map((item, idx) => {
                    const isFocusItem = item.name === 'Role Permission Policies Assigned';
                    const isCompleted = item.completed || (getCompletion(selectedHandover) === 100);
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => handleToggleChecklistItem(selectedHandover.id, item.name)}
                        className={`w-full text-left flex items-center gap-4 px-6 py-4 rounded-full border transition-all cursor-pointer bg-white ${
                          isFocusItem ? 'border-amber-200 shadow-[0_0_10px_rgba(251,191,36,0.15)]' : 'border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-[22px] h-[22px] text-emerald-500 shrink-0" strokeWidth={1.5} />
                        ) : (
                          <div className="w-[18px] h-[18px] rounded-[4px] border-2 border-slate-900 bg-white shrink-0 ml-[2px]" />
                        )}
                        <span className={`text-[13px] font-bold ${
                          isCompleted ? 'text-slate-500' : 'text-slate-700'
                        }`}>
                          {item.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* 100% Completed Footer */}
                {getCompletion(selectedHandover) === 100 && (
                  <div className="mt-8 bg-[#F4FBFA] border border-[#E0F2F1] rounded-2xl p-8 flex flex-col items-center text-center">
                    <div className="mb-4 text-emerald-500">
                      <CheckCircle2 className="w-10 h-10" strokeWidth={2} />
                    </div>
                    <h3 className="text-slate-900 font-black text-[16px]">Onboarding checklist 100% Completed!</h3>
                    <p className="text-slate-500 text-[11px] font-medium mt-1 mb-5">
                      Tenant setup criteria validated. Click below to provision the production workspace.
                    </p>
                    <button className="bg-[#10B981] hover:bg-[#059669] text-slate-900 font-bold text-[13px] px-6 py-3 rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm">
                      <User className="w-4 h-4 shrink-0" strokeWidth={2.5} /> Convert to Active Company Workspace
                    </button>
                  </div>
                )}

                {/* Actions Footer (For Incomplete) */}
                {getCompletion(selectedHandover) < 100 && (
                  <>
                    {/* Send Handover Package Button */}
                    <div className="mt-8 mb-10">
                      <button 
                        onClick={() => { setShowDispatchModal(true); setTargetRep('Michael Scott (Regional Coordinator)'); setHandoverNotes(''); }} 
                        className="bg-[#211E48] hover:bg-[#151336] text-white font-bold text-[13px] px-6 py-3 rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                      >
                        <Send className="w-4 h-4 shrink-0" /> Send Handover Package
                      </button>
                    </div>

                    {/* Pending Legal Documents Checklist */}
                    <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                        PENDING LEGAL DOCUMENTS CHECKLIST
                      </h3>
                      <div className="flex flex-wrap gap-4">
                        <button className="flex items-center gap-2 bg-[#EFE8E8] border border-[#E5D9D9] text-[#E06767] font-bold text-[12px] px-6 py-3 rounded-xl transition-colors hover:bg-[#EAE0E0]">
                          <AlertTriangle className="w-4 h-4" strokeWidth={2.5} /> Signed SLA Contract
                        </button>
                        <button className="flex items-center gap-2 bg-[#EFE8E8] border border-[#E5D9D9] text-[#E06767] font-bold text-[12px] px-6 py-3 rounded-xl transition-colors hover:bg-[#EAE0E0]">
                          <AlertTriangle className="w-4 h-4" strokeWidth={2.5} /> Company W-9 Tax File
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Onboarding Task Modal */}
      {showAddTaskModal && selectedHandover && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-[500px] shadow-2xl overflow-hidden animate-slide-in">
            {/* Header */}
            <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100">
              <h2 className="text-[17px] font-bold text-slate-900">Create Onboarding Task</h2>
              <button onClick={() => setShowAddTaskModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              <p className="text-[13px] font-medium text-slate-500 mb-6 leading-relaxed">
                Add a custom task to the onboarding checklist for <span className="font-bold text-slate-700">{selectedHandover.company}</span>.
              </p>

              <div className="space-y-2 mb-6">
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">TASK NAME</label>
                <input
                  type="text"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="e.g. Set up custom factoring rules"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-colors"
                />
              </div>

              <button
                onClick={() => {
                  if (newTaskName.trim()) {
                    crmStore.updateDb((db) => {
                      const h = (db.crmHandovers || []).find(x => x.id === selectedHandover.id);
                      if (h) {
                        if (!h.checklist) h.checklist = [];
                        h.checklist.push({ name: newTaskName, completed: false });
                        h.status = 'In Progress';
                      }
                    });
                    setToast({ type: 'success', text: `Task added to ${selectedHandover.company}.` });
                    setShowAddTaskModal(false);
                  }
                }}
                className="w-full bg-[#FFB020] hover:bg-[#FFC800] text-slate-900 font-extrabold text-[14px] py-3.5 rounded-xl shadow-[0_4px_15px_rgba(255,176,32,0.4)] transition-all cursor-pointer"
              >
                Add Onboarding Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispatch Handover Modal */}
      {showDispatchModal && selectedHandover && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-[500px] shadow-2xl overflow-hidden animate-slide-in">
            {/* Header */}
            <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100">
              <h2 className="text-[17px] font-bold text-slate-900">Onboarding Handover package dispatch</h2>
              <button onClick={() => setShowDispatchModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              <p className="text-[13px] font-medium text-slate-500 mb-6 leading-relaxed">
                Dispatch legal details and setup parameters to the logistics operations desk for <span className="font-bold text-slate-700">{selectedHandover.company}</span>.
              </p>

              <div className="space-y-5 mb-6">
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">TARGET REPRESENTATIVE</label>
                  <select
                    value={targetRep}
                    onChange={(e) => setTargetRep(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 transition-colors bg-white appearance-auto cursor-pointer"
                  >
                    <option value="Michael Scott (Regional Coordinator)">Michael Scott (Regional Coordinator)</option>
                    <option value="Alex Wright (Inside Sales)">Alex Wright (Inside Sales)</option>
                    <option value="Sarah K. (Account Management)">Sarah K. (Account Management)</option>
                    <option value="Jan Levinson (Operations Lead)">Jan Levinson (Operations Lead)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-500 tracking-wider mb-2">Handover Notes / Instructions</label>
                  <textarea
                    value={handoverNotes}
                    onChange={(e) => setHandoverNotes(e.target.value)}
                    placeholder="Provide billing integration info, special customer SLA rules..."
                    rows="3"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-colors resize-none"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  setToast({ type: 'success', text: `Handover package dispatched to ${targetRep.split(' ')[0]}!` });
                  setShowDispatchModal(false);
                }}
                className="w-full bg-[#FFB020] hover:bg-[#FFC800] text-slate-900 font-extrabold text-[14px] py-3.5 rounded-xl shadow-[0_4px_15px_rgba(255,176,32,0.4)] transition-all cursor-pointer"
              >
                Confirm & Dispatch Handover Package
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
