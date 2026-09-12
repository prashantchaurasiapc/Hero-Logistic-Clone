import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, X, Bell, ChevronDown, Check, Briefcase,
  CheckCircle2, AlertCircle, RefreshCw, FileText, User, Send, AlertTriangle,
  ExternalLink, Sparkles, ShieldCheck
} from 'lucide-react';
import { crmRepository } from '../../services/crmRepository';
import { crmStore } from '../../services/crmStore';
import { useAuth } from '../../context/AuthContext';
import { getSalesReps } from '../../services/api';

export default function OnboardingHandover() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Database States
  const [onboarding, setOnboarding] = useState([]);
  const [leads, setLeads] = useState([]);
  const [salesReps, setSalesReps] = useState([]);
  const [selectedRepFilter, setSelectedRepFilter] = useState('ALL');

  // UI States
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
    // Single dedicated menu API for Onboarding Handovers
    crmRepository.syncHandovers();

    const syncDb = () => {
      const db = crmRepository.getCrmDatabase();
      const newOnboarding = [...(db.crmHandovers || [])];
      setOnboarding(newOnboarding);
      setLeads([...crmRepository.getLeads()]);
      const reps = crmRepository.getSalesReps();
      if (reps?.length) setSalesReps(reps);

      setSelectedHandover(prev => {
        if (!newOnboarding.length) return null;
        if (!prev) return newOnboarding[0];
        const updated = newOnboarding.find(o => o.id === prev.id);
        if (updated) return { ...updated };
        return newOnboarding[0];
      });
    };
    syncDb();
    const unsubscribe = crmStore.subscribe(syncDb);
    return () => unsubscribe();
  }, []);

  // Toast auto-clear
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Compute checklist completion percent
  const getCompletion = (handover) => {
    if (!handover || !handover.checklist || handover.checklist.length === 0) {
      return handover?.status === 'Completed' ? 100 : 43;
    }
    const done = handover.checklist.filter(c => c.completed).length;
    return Math.round((done / handover.checklist.length) * 100);
  };

  const getCompletionStyle = (pct) => {
    if (pct === 100) return 'bg-emerald-50 border border-emerald-200 text-emerald-700';
    if (pct >= 70) return 'bg-[#FFFBEB] border border-[#FDE68A] text-[#D97706]';
    return 'bg-slate-50 border border-slate-200 text-slate-600';
  };

  // Toggle checklist item interactively
  const handleToggleChecklistItem = (handoverId, itemName) => {
    const defaultChecklist = [
      { name: 'Company Workspace Provisioned', completed: true },
      { name: 'SaaS Subscription Plan Activated', completed: true },
      { name: 'Company Admin User Registered', completed: true },
      { name: 'Role Permission Policies Assigned', completed: false },
      { name: 'Mock Customer Inbound Data Importer', completed: false },
      { name: 'Roster & ELD System Training Complete', completed: false },
      { name: 'Sandbox Production Go-Live Scheduled', completed: false }
    ];

    const updatedList = onboarding.map(h => {
      if (h.id === handoverId) {
        const currentChecklist = h.checklist && h.checklist.length > 0 ? [...h.checklist] : [...defaultChecklist];
        const itemIndex = currentChecklist.findIndex(c => c.name === itemName);
        if (itemIndex !== -1) {
          currentChecklist[itemIndex] = {
            ...currentChecklist[itemIndex],
            completed: !currentChecklist[itemIndex].completed
          };
        } else {
          currentChecklist.push({ name: itemName, completed: true });
        }

        const allDone = currentChecklist.every(c => c.completed);
        const updatedH = {
          ...h,
          checklist: currentChecklist,
          status: allDone ? 'Completed' : 'In Progress'
        };

        if (selectedHandover?.id === handoverId) {
          setSelectedHandover(updatedH);
        }
        return updatedH;
      }
      return h;
    });

    setOnboarding(updatedList);
    setToast({ text: `Updated onboarding checklist for ${itemName}.` });
  };

  // Toggle Legal Document Status
  const handleToggleLegalDoc = (docType) => {
    if (!selectedHandover) return;
    const currentDocs = selectedHandover.legalDocs || { slaSigned: false, w9TaxFiled: false };
    const updatedDocs = {
      ...currentDocs,
      [docType]: !currentDocs[docType]
    };

    const updatedHandover = {
      ...selectedHandover,
      legalDocs: updatedDocs
    };

    setSelectedHandover(updatedHandover);
    const updatedList = onboarding.map(h => h.id === selectedHandover.id ? updatedHandover : h);
    setOnboarding(updatedList);

    const docName = docType === 'slaSigned' ? 'Signed SLA Contract' : 'Company W-9 Tax File';
    const statusText = updatedDocs[docType] ? 'verified & signed!' : 'marked as pending.';
    setToast({ text: `${docName} ${statusText}` });
  };

  // Create Sample Won Carrier Handover if none exist
  const handleLoadSampleHandover = async () => {
    await crmRepository.createLead({
      company: 'Apex Freight Logistics',
      name: 'Michael Scott',
      email: 'mscott@apexfreight.com',
      phone: '0412 888 999',
      fleetSize: 24,
      niche: 'Heavy Haulage',
      revenue: 4500,
      score: 95,
      stage: 'Won',
      notes: 'Carrier contract signed and ready for onboarding setup.'
    });
    await crmRepository.syncHandovers(true);
    setToast({ text: 'Created Won Carrier Handover for Apex Freight Logistics!' });
  };

  // Role filter & rep filter
  const filteredHandovers = onboarding.filter(h => {
    const lead = leads.find(l => l.id === h.leadId);
    if (user?.accessProfile === 'SALES_REP') {
      if (lead && lead.repId !== user?.id && lead.rep !== user?.name && h.owner !== user?.name) return false;
    }
    if (selectedRepFilter !== 'ALL') {
      if (lead && lead.repId !== selectedRepFilter && lead.rep !== selectedRepFilter && h.owner !== selectedRepFilter) return false;
    }
    return true;
  });

  const activeChecklist = selectedHandover?.checklist || [
    { name: 'Company Workspace Provisioned', completed: true },
    { name: 'SaaS Subscription Plan Activated', completed: true },
    { name: 'Company Admin User Registered', completed: true },
    { name: 'Role Permission Policies Assigned', completed: false },
    { name: 'Mock Customer Inbound Data Importer', completed: false },
    { name: 'Roster & ELD System Training Complete', completed: false },
    { name: 'Sandbox Production Go-Live Scheduled', completed: false }
  ];

  const pct = selectedHandover ? getCompletion(selectedHandover) : 0;
  const legalDocs = selectedHandover?.legalDocs || { slaSigned: false, w9TaxFiled: false };
  const isHighRisk = !(legalDocs.slaSigned && legalDocs.w9TaxFiled);

  return (
    <div className="flex-grow bg-[#F8FAFC] p-4 sm:p-6 space-y-6 overflow-y-auto w-full text-left font-sans flex flex-col h-full min-h-0">

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[999999] flex items-center justify-between gap-4 px-5 py-3 bg-slate-900 text-white rounded-2xl shadow-2xl text-[13px] font-bold border border-slate-700 animate-slide-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{toast.text}</span>
          </div>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1">
            <X className="w-4 h-4" />
          </button>
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
            Seamless transition from Sales Won contract to Super Admin Tenant Provisioning.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {/* Authenticated Identity Indicator */}
          <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-xl text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <div>
              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider leading-none">Logged In</span>
              <strong className="text-slate-900 font-extrabold text-[11px] leading-tight block">{user?.name || 'Sales Officer'}</strong>
            </div>
            <span className="ml-1.5 px-2 py-0.5 bg-amber-100 text-amber-900 font-black text-[9px] rounded-md uppercase">
              {user?.role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : user?.accessProfile || 'SALES_FULL_ACCESS'}
            </span>
          </div>

          {/* Filter by Sales Rep (Full Access only) */}
          {(user?.role === 'SUPER_ADMIN' || user?.accessProfile !== 'SALES_REP') && (
            <div className="relative">
              <select
                value={selectedRepFilter}
                onChange={(e) => setSelectedRepFilter(e.target.value)}
                className="bg-white border border-slate-300 text-slate-700 text-xs font-bold px-3 py-2.5 rounded-xl focus:outline-none cursor-pointer shadow-xs hover:border-amber-400 transition-colors"
              >
                <option value="ALL">All Sales Reps</option>
                {salesReps.map(rep => (
                  <option key={rep.id} value={rep.id}>{rep.name || rep.email}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Dual Panel Workspace */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* LEFT: Onboarding Handovers List */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col overflow-hidden">
          {/* Panel Header */}
          <div className="px-5 py-4 border-b border-slate-100 shrink-0 flex items-center justify-between">
            <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">
              Won Carrier Workspace Handovers
            </h2>
            <span className="text-[10px] font-bold text-slate-400">
              {filteredHandovers.length} Carriers
            </span>
          </div>

          {/* List */}
          <div className="flex-grow p-5 space-y-4 bg-slate-50/50 max-h-[620px] overflow-y-auto">
            {filteredHandovers.map((h) => {
              const itemPct = getCompletion(h);

              return (
                <button
                  key={h.id}
                  onClick={() => setSelectedHandover(h)}
                  className={`w-full text-left p-4 bg-white border rounded-2xl shadow-2xs transition-all duration-150 cursor-pointer ${
                    selectedHandover?.id === h.id ? 'border-amber-400 shadow-sm bg-amber-50/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Row 1: Company + Completion badge */}
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <strong className="text-slate-900 font-black text-[13px] leading-none truncate">
                      {h.company}
                    </strong>
                    <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shrink-0 leading-none ${getCompletionStyle(itemPct)}`}>
                      {itemPct}% Complete
                    </span>
                  </div>

                  {/* Row 2: Owner + Target */}
                  <div className="text-[11px] text-slate-600 font-semibold mb-3">
                    Owner: <span className="text-slate-900 font-bold">{h.owner}</span> <span className="text-slate-400 mx-1">•</span> Target: <span className="text-slate-900 font-bold">{h.targetDate || h.dueDate}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className={`${itemPct === 100 ? 'bg-emerald-500' : 'bg-[#ffcc00]'} h-1.5 rounded-full transition-all duration-300`}
                      style={{ width: `${itemPct}%` }}
                    ></div>
                  </div>
                </button>
              );
            })}

            {filteredHandovers.length === 0 && (
              <div className="py-12 text-center text-slate-400 font-bold text-xs space-y-4 select-none">
                <Briefcase className="w-10 h-10 mx-auto text-slate-300 stroke-[1.5]" />
                <div>
                  <p className="text-slate-700 font-black text-sm uppercase tracking-wider">No Won Carrier Handovers</p>
                  <p className="text-slate-400 font-medium mt-1">When a deal is marked as Won in Sales Pipeline, it appears here for onboarding setup.</p>
                </div>
                <button
                  onClick={handleLoadSampleHandover}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Load Sample Carrier Handover
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Handover Detail Panel */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col overflow-hidden">
          {!selectedHandover ? (
            <div className="flex-grow flex items-center justify-center text-slate-400 font-semibold text-xs py-16 select-none">
              Select onboarding company from the left panel.
            </div>
          ) : (
            <div className="flex flex-col h-full bg-white">
              {/* Detail Header */}
              <div className="px-7 py-6 border-b border-slate-100 flex flex-col shrink-0 relative bg-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest border border-slate-200 rounded px-2.5 py-1 leading-none bg-slate-50">
                    SETUP HANDOVER STEPPER
                  </span>
                  <span className={`text-[9px] font-black rounded-full px-3.5 py-1 uppercase tracking-wider leading-none ${
                    isHighRisk ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {isHighRisk ? 'RISK: HIGH (PENDING LEGAL)' : 'RISK: LOW (VERIFIED)'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-black text-slate-900 leading-tight">
                    {selectedHandover.company} Setup Checklist
                  </h2>
                  <button 
                    onClick={() => { setShowAddTaskModal(true); setNewTaskName(''); }} 
                    className="text-[11px] font-black text-[#B45309] bg-[#FEF3C7] hover:bg-[#FDE68A] border border-[#FDE68A] px-3 py-1.5 rounded-xl uppercase tracking-wider cursor-pointer leading-none transition-colors"
                  >
                    + ADD TASK
                  </button>
                </div>
                <div className="text-xs font-semibold text-slate-500 mt-2">
                  Responsible Owner: <span className="font-extrabold text-slate-900">{selectedHandover.owner}</span> <span className="mx-1.5">•</span> Target Completion Date: <span className="font-extrabold text-slate-900">{selectedHandover.dueDate || selectedHandover.targetDate}</span>
                </div>
              </div>

              {/* Detail Body */}
              <div className="flex-grow p-7 space-y-6 overflow-y-auto">

                {/* Interactive Setup Checklist Items */}
                <div className="space-y-3">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Click checkboxes below to mark items completed ({pct}% Done):
                  </div>

                  {activeChecklist.map((item, idx) => {
                    const isFocusItem = item.name === 'Role Permission Policies Assigned';
                    const isCompleted = item.completed;
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => handleToggleChecklistItem(selectedHandover.id, item.name)}
                        className={`w-full text-left flex items-center gap-3.5 px-5 py-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isCompleted 
                            ? 'bg-emerald-50/40 border-emerald-200/80 text-emerald-900' 
                            : isFocusItem 
                              ? 'bg-amber-50/30 border-amber-300 text-slate-800 shadow-2xs' 
                              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" strokeWidth={2} />
                        ) : (
                          <div className="w-4 h-4 rounded-md border-2 border-slate-400 bg-white shrink-0 ml-[1px]" />
                        )}
                        <span className={`text-[12.5px] font-bold ${isCompleted ? 'line-through text-slate-500 font-semibold' : 'text-slate-800'}`}>
                          {item.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* 100% Completed Box */}
                {pct === 100 && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-sm">
                      <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="text-slate-900 font-black text-base">Onboarding Checklist 100% Completed!</h3>
                      <p className="text-slate-600 text-xs font-medium mt-1">
                        All onboarding steps validated. Click below to provision the production workspace tenant environment.
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        window.open('/company-admin/command-centre', '_blank');
                        setToast({ text: `Opening ${selectedHandover.company} tenant admin portal...` });
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                    >
                      <ExternalLink className="w-4 h-4 shrink-0" />
                      <span>Convert to Active Company Workspace</span>
                    </button>
                  </div>
                )}

                {/* Actions & Legal Documents Checklist (When incomplete or checking) */}
                {pct < 100 && (
                  <div className="space-y-6 pt-2 border-t border-slate-100">
                    
                    {/* Send Handover Package Button */}
                    <div>
                      <button 
                        onClick={() => { setShowDispatchModal(true); setTargetRep('Michael Scott (Regional Coordinator)'); setHandoverNotes(''); }} 
                        className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                      >
                        <Send className="w-4 h-4 shrink-0" />
                        <span>Send Handover Package</span>
                      </button>
                    </div>

                    {/* Interactive Pending Legal Documents Checklist */}
                    <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                        PENDING LEGAL DOCUMENTS CHECKLIST (CLICK TO VERIFY)
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        <button 
                          onClick={() => handleToggleLegalDoc('slaSigned')}
                          className={`flex items-center gap-2 text-xs font-extrabold px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
                            legalDocs.slaSigned 
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                              : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                          }`}
                        >
                          {legalDocs.slaSigned ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-500" />}
                          <span>{legalDocs.slaSigned ? 'Signed SLA Contract Verified' : 'Signed SLA Contract (Click to verify)'}</span>
                        </button>

                        <button 
                          onClick={() => handleToggleLegalDoc('w9TaxFiled')}
                          className={`flex items-center gap-2 text-xs font-extrabold px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
                            legalDocs.w9TaxFiled 
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                              : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                          }`}
                        >
                          {legalDocs.w9TaxFiled ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-500" />}
                          <span>{legalDocs.w9TaxFiled ? 'Company W-9 Tax File Verified' : 'Company W-9 Tax File (Click to verify)'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CREATE ONBOARDING TASK MODAL */}
      {showAddTaskModal && selectedHandover && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999999] flex items-center justify-center p-4 pt-16 sm:pt-20 animate-fade-in text-left"
          onClick={() => setShowAddTaskModal(false)}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-5 space-y-4 shadow-2xl font-sans max-h-[calc(100vh-6rem)] my-auto flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-black text-slate-900">Create Onboarding Task</h2>
              <button onClick={() => setShowAddTaskModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4 text-xs font-bold text-slate-700">
              <p className="text-slate-500 font-medium leading-relaxed">
                Add a custom task to the onboarding checklist for <span className="font-extrabold text-slate-900">{selectedHandover.company}</span>.
              </p>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">TASK NAME *</label>
                <input
                  type="text"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="e.g. Set up custom factoring integration"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
                <button 
                  type="button" 
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (newTaskName.trim()) {
                      const updatedChecklist = [...activeChecklist, { name: newTaskName.trim(), completed: false }];
                      const updatedHandover = { ...selectedHandover, checklist: updatedChecklist };
                      setSelectedHandover(updatedHandover);
                      const updatedList = onboarding.map(h => h.id === selectedHandover.id ? updatedHandover : h);
                      setOnboarding(updatedList);

                      setToast({ type: 'success', text: `Task added to ${selectedHandover.company}.` });
                      setShowAddTaskModal(false);
                    }
                  }}
                  className="px-5 py-2 bg-[#ffcc00] hover:bg-[#e6b800] text-black font-extrabold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Add Onboarding Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DISPATCH HANDOVER MODAL */}
      {showDispatchModal && selectedHandover && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999999] flex items-center justify-center p-4 pt-16 sm:pt-20 animate-fade-in text-left"
          onClick={() => setShowDispatchModal(false)}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-5 space-y-4 shadow-2xl font-sans max-h-[calc(100vh-6rem)] my-auto flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-black text-slate-900">Onboarding Handover Package Dispatch</h2>
              <button onClick={() => setShowDispatchModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4 text-xs font-bold text-slate-700">
              <p className="text-slate-500 font-medium leading-relaxed">
                Dispatch legal details and setup parameters to the logistics operations desk for <span className="font-extrabold text-slate-900">{selectedHandover.company}</span>.
              </p>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">TARGET REPRESENTATIVE</label>
                <select
                  value={targetRep}
                  onChange={(e) => setTargetRep(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-400 bg-white cursor-pointer"
                >
                  <option value="Michael Scott (Regional Coordinator)">Michael Scott (Regional Coordinator)</option>
                  <option value="Alex Wright (Inside Sales)">Alex Wright (Inside Sales)</option>
                  <option value="Sarah K. (Account Management)">Sarah K. (Account Management)</option>
                  <option value="Jan Levinson (Operations Lead)">Jan Levinson (Operations Lead)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">HANDOVER NOTES / INSTRUCTIONS</label>
                <textarea
                  value={handoverNotes}
                  onChange={(e) => setHandoverNotes(e.target.value)}
                  placeholder="Provide billing integration info, special customer SLA rules..."
                  rows="3"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
                <button 
                  type="button" 
                  onClick={() => setShowDispatchModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setToast({ type: 'success', text: `Handover package dispatched to ${targetRep.split(' ')[0]}!` });
                    setShowDispatchModal(false);
                  }}
                  className="px-5 py-2 bg-[#ffcc00] hover:bg-[#e6b800] text-black font-extrabold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Confirm & Dispatch Handover Package
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
