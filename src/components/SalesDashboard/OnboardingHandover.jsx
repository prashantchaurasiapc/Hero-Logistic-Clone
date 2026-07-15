import React, { useState, useEffect } from 'react';
import {
  Plus, X, Bell, ChevronDown, Check, Briefcase,
  CheckCircle2, AlertCircle, RefreshCw, FileText, User
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

  // Toast
  const [toast, setToast] = useState(null);

  // Subscribe to crmStore
  useEffect(() => {
    const syncDb = () => {
      const db = crmRepository.getCrmDatabase();
      setOnboarding(db.crmHandovers || []);
      setLeads(crmRepository.getLeads());
    };
    syncDb();
    const unsubscribe = crmStore.subscribe(syncDb);
    return () => unsubscribe();
  }, []);

  // Sync selectedHandover on store updates
  useEffect(() => {
    if (selectedHandover) {
      const updated = onboarding.find(o => o.id === selectedHandover.id);
      if (updated) setSelectedHandover(updated);
      else setSelectedHandover(null);
    }
  }, [onboarding]);

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
      const h = (db.crmOnboarding || []).find(x => x.id === handoverId);
      if (h && h.checklist) {
        const item = h.checklist.find(c => c.name === itemName);
        if (item) item.completed = !item.completed;

        // Update status
        const allDone = h.checklist.every(c => c.completed);
        if (allDone) h.status = 'Completed';
        else h.status = 'In Progress';
      }
    });
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
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">

        {/* LEFT: Onboarding Handovers List */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col overflow-hidden">
          {/* Panel Header */}
          <div className="px-5 py-4 border-b border-slate-100 shrink-0">
            <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">
              Won Carrier Workspace Handovers
            </h2>
          </div>

          {/* List */}
          <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-slate-50/50 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                      className={`${pct === 100 ? 'bg-emerald-400' : 'bg-[#F59E0B]'} h-1.5 rounded-full transition-all duration-500`}
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
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col overflow-hidden">
          {!selectedHandover ? (
            <div className="flex-grow flex items-center justify-center text-slate-400 font-semibold text-xs select-none">
              Select onboarding company.
            </div>
          ) : (
            <div className="flex flex-col h-full overflow-y-auto">
              {/* Detail Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex flex-col shrink-0 relative">
                <button
                  onClick={() => setSelectedHandover(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest border border-slate-200 rounded px-2 py-1 leading-none">
                    Setup Handover Stepper
                  </span>
                  <span className="text-[9px] font-black text-[#D97706] bg-[#FFFBEB] border border-[#FDE68A] rounded-full px-3 py-1 uppercase tracking-wider leading-none">
                    Risk: {selectedHandover.risk || 'Medium'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <h2 className="text-[17px] font-black text-slate-900 leading-none">{selectedHandover.company} setup Checklist</h2>
                  <button className="text-[10px] font-black text-[#D97706] hover:text-[#B45309] uppercase tracking-wider cursor-pointer leading-none">+ Add Task</button>
                </div>
                <div className="text-[10px] font-bold text-slate-900 mt-2">
                  Responsible Owner: {selectedHandover.owner} <span className="mx-1">•</span> Due Target Date: {selectedHandover.dueDate || selectedHandover.targetDate}
                </div>
              </div>

              {/* Detail Body */}
              <div className="flex-grow px-6 py-5 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {/* Setup Checklist */}
                <div className="space-y-3">
                  {(selectedHandover.checklist || [
                    { name: 'Company Workspace Provisioned', completed: getCompletion(selectedHandover) === 100 },
                    { name: 'SaaS Subscription Plan Activated', completed: getCompletion(selectedHandover) === 100 },
                    { name: 'Company Admin User Registered', completed: getCompletion(selectedHandover) === 100 },
                    { name: 'Role Permission Policies Assigned', completed: getCompletion(selectedHandover) === 100 },
                    { name: 'Mock Customer Inbound Data Importer', completed: getCompletion(selectedHandover) === 100 },
                    { name: 'Roster & ELD System Training Complete', completed: getCompletion(selectedHandover) === 100 },
                    { name: 'Sandbox Production Go-Live Scheduled', completed: getCompletion(selectedHandover) === 100 }
                  ]).map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleToggleChecklistItem(selectedHandover.id, item.name)}
                      className={`w-full text-left flex items-center gap-3 p-3.5 rounded-2xl border transition-colors cursor-pointer ${
                        item.completed ? 'border-slate-100 bg-white' : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white shrink-0" />
                      )}
                      <span className={`text-[13px] font-semibold ${
                        item.completed ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-700'
                      }`}>
                        {item.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* 100% Completed Footer */}
                {getCompletion(selectedHandover) === 100 && (
                  <div className="mt-8 bg-[#ECFDF5] border border-[#D1FAE5] rounded-2xl p-6 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-white border-2 border-emerald-400 rounded-full flex items-center justify-center mb-4 shadow-sm">
                      <Check className="w-6 h-6 text-emerald-500 stroke-[3px]" />
                    </div>
                    <h3 className="text-slate-900 font-black text-[15px]">Onboarding checklist 100% Completed!</h3>
                    <p className="text-slate-500 text-[11px] font-bold mt-1 mb-5">
                      Tenant setup criteria validated. Click below to provision the production workspace.
                    </p>
                    <button className="bg-[#10B981] hover:bg-[#059669] text-white font-black text-xs px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs">
                      <User className="w-4 h-4 shrink-0" /> Convert to Active Company Workspace
                    </button>
                  </div>
                )}
              </div>

              {/* Actions Footer (For Incomplete) */}
              {getCompletion(selectedHandover) < 100 && (
                <div className="px-6 py-4 border-t border-slate-100 flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => {
                      crmStore.updateDb((db) => {
                        const h = (db.crmOnboarding || []).find(x => x.id === selectedHandover.id);
                        if (h) {
                          h.status = 'Completed';
                          if (h.checklist) h.checklist.forEach(c => c.completed = true);
                        }
                      });
                      setToast({ text: `${selectedHandover.company} workspace setup marked complete.` });
                    }}
                    className="flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-black font-extrabold text-[11px] px-4 py-2.5 rounded-xl cursor-pointer transition-colors shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    Mark Full Setup Complete
                  </button>
                  <button
                    onClick={() => setToast({ text: `Reminder dispatched to CS team for ${selectedHandover.company}.` })}
                    className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-extrabold text-[11px] px-4 py-2.5 rounded-xl cursor-pointer transition-colors shadow-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                    Send CS Reminder
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
