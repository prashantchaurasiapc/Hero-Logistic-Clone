import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Mail, Phone, ChevronRight, X, Sparkles,
  Edit3, Trash2, Bell, ShieldCheck, ChevronDown, Check,
  DollarSign, Building, Truck, RefreshCw, CreditCard, Calendar, ShieldAlert,
  ExternalLink, Copy, Key
} from 'lucide-react';
import { crmRepository } from '../../services/crmRepository';
import { crmStore } from '../../services/crmStore';
import { useAuth } from '../../context/AuthContext';
import { getSalesReps } from '../../services/api';

export default function TrialCompanies() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Database States loaded from crmStore
  const [trials, setTrials] = useState([]);
  const [salesReps, setSalesReps] = useState([]);
  const [selectedRepFilter, setSelectedRepFilter] = useState('ALL');
  const [leads, setLeads] = useState([]);

  // UI & Metrics states
  const [metrics, setMetrics] = useState({ trialsActive: 0, conversion: 10, expiredPortals: 0 });

  // Modal states
  const [showExtendModal, setShowExtendModal] = useState(null); // trial object or null
  const [showLoginModal, setShowLoginModal] = useState(null); // trial object or null for Login As Company modal
  const [extensionDays, setExtensionDays] = useState(7);
  const [showProvisionModal, setShowProvisionModal] = useState(false);

  // Provision Form State
  const [provisionForm, setProvisionForm] = useState({
    selectedLeadId: '',
    company: '',
    admin: '',
    email: '',
    fleetSize: 15,
    niche: 'Car Carrier'
  });

  // Toast feedback state
  const [toast, setToast] = useState(null);

  // Subscribe to crmStore changes to ensure reactive binding
  useEffect(() => {
    crmRepository.syncTrials();

    const syncDb = () => {
      const safeTrials = crmRepository.getTrials();
      const safeLeads = crmRepository.getLeads();
      const safeReps = crmRepository.getSalesReps();
      if (safeReps?.length) setSalesReps(safeReps);

      setTrials(safeTrials);
      setLeads(safeLeads);

      const wonLeads = safeLeads.filter(l => l.stage === 'Won').length;
      const totalLeads = safeLeads.length;
      const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 10;
      const expiredCount = safeTrials.filter(t => t.status === 'Expired').length;

      setMetrics({
        trialsActive: safeTrials.filter(t => t.status === 'Active').length,
        conversion: conversionRate,
        expiredPortals: expiredCount
      });
    };

    syncDb();
    const unsubscribe = crmStore.subscribe(syncDb);
    return () => unsubscribe();
  }, []);

  // Toast auto-clear
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Open Login As Company Modal (No auto redirection, stays on page!)
  const handleOpenLoginModal = (trial) => {
    const mockSession = {
      token: `HERO-JWT-${trial.id.toUpperCase()}-${Date.now().toString().slice(-6)}`,
      email: `${trial.admin.toLowerCase().replace(/\s/g, '')}@${trial.company.toLowerCase().replace(/[^a-z0-9]/gi, '')}.com`,
      role: 'Company Admin',
      name: trial.admin,
      company: trial.company,
      plan: trial.currentPlan || 'Enterprise Sandbox',
      joinedAt: trial.startDate
    };

    localStorage.setItem('hero_session', JSON.stringify(mockSession));
    window.dispatchEvent(new Event('storage'));
    setShowLoginModal(trial);
  };

  // Copy Session Access Link to Clipboard
  const handleCopySessionToken = (trial) => {
    const adminEmail = `${trial.admin.toLowerCase().replace(/\s/g, '')}@${trial.company.toLowerCase().replace(/[^a-z0-9]/gi, '')}.com`;
    const shareableUrl = `${window.location.origin}/login?impersonate=${encodeURIComponent(adminEmail)}&tenant=${encodeURIComponent(trial.company)}`;
    navigator.clipboard.writeText(shareableUrl);
    setToast({ text: `Session access link for ${trial.company} copied to clipboard!` });
  };

  // Launch Portal in New Tab
  const handleLaunchNewTab = () => {
    window.open('/company-admin/command-centre', '_blank');
    setToast({ text: `Launched ${showLoginModal.company} Admin Portal in a new tab!` });
  };

  // Handle Extend Trial submit
  const handleExtendSubmit = async (e) => {
    e.preventDefault();
    if (!showExtendModal) return;

    const targetId = showExtendModal.leadId || showExtendModal.id;
    await crmRepository.extendTrial(targetId, extensionDays);
    setToast({ text: `Trial for ${showExtendModal.company} extended by ${extensionDays} days in database!` });
    setShowExtendModal(null);
  };

  // Provision Trial Submit Handler
  const handleProvisionSubmit = async (e) => {
    e.preventDefault();
    if (provisionForm.selectedLeadId) {
      await crmRepository.updateStage(provisionForm.selectedLeadId, 'Trial Started', 'Provisioned Sandbox Environment', '14-Day Evaluation Active');
      setToast({ text: `Provisioned 14-Day Sandbox for lead!` });
    } else if (provisionForm.company.trim()) {
      await crmRepository.createLead({
        company: provisionForm.company,
        name: provisionForm.admin,
        email: provisionForm.email,
        fleetSize: provisionForm.fleetSize,
        niche: provisionForm.niche,
        revenue: 2500,
        score: 85,
        stage: 'Trial Started',
        notes: 'Newly provisioned trial sandbox evaluation.'
      });
      setToast({ text: `Created and provisioned new trial sandbox for ${provisionForm.company}!` });
    }
    setShowProvisionModal(false);
    setProvisionForm({ selectedLeadId: '', company: '', admin: '', email: '', fleetSize: 15, niche: 'Car Carrier' });
  };

  // Provision Demo Sandbox shortcut
  const handleProvisionDemoSandbox = async () => {
    await crmRepository.createLead({
      company: 'Apex Logistics Global',
      name: 'David Miller',
      email: 'dmiller@apexlogistics.com.au',
      phone: '0412 987 654',
      fleetSize: 18,
      niche: 'Car Carrier',
      revenue: 3500,
      score: 90,
      stage: 'Trial Started',
      notes: 'Sample evaluation sandbox workspace'
    });
    setToast({ text: 'Provisioned demo trial sandbox for Apex Logistics Global!' });
  };

  // Rep filtering based on Role and selectedRepFilter
  const filteredTrials = trials.filter(trial => {
    const safeLeads = crmRepository.getLeads();
    const lead = safeLeads.find(l => l.id === trial.leadId);
    if (user?.accessProfile === 'SALES_REP') {
      if (lead && lead.repId !== user?.id && lead.rep !== user?.name) return false;
    }
    if (selectedRepFilter !== 'ALL' && lead) {
      if (lead.repId !== selectedRepFilter && lead.rep !== selectedRepFilter) return false;
    }
    return true;
  });

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
              Trial Companies
            </h1>

            {/* Enterprise Logistics Badge */}
            <div className="bg-[#FEF3C7] text-[#92400E] px-2.5 py-1 text-[9px] rounded-lg border border-[#FDE68A] uppercase font-black leading-none flex flex-col items-center justify-center shrink-0">
              <span className="text-[7px] text-[#B45309] font-bold tracking-wider mb-0.5">Enterprise</span>
              <span>Logistics</span>
            </div>

            {/* Shift Sales Active Badge */}
            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-250 text-[10px] px-2.5 py-1 rounded-full font-extrabold shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Shift: Sales Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Active evaluation environments and sandbox tenant governance.
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

          {/* Provision Trial Sandbox Button */}
          <button
            onClick={() => setShowProvisionModal(true)}
            className="bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Provision Sandbox</span>
          </button>
        </div>
      </div>

      {/* Main Content Section (Quotas + Grid) */}
      <div className="shrink-0 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col overflow-hidden">

        {/* SaaS Quotas Banner & Stats */}
        <div className="p-5 border-b border-slate-100 shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              SaaS Trial Workspace Quotas
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Track Sandbox active evaluations and limits.
            </p>
          </div>

          {/* Stats Row right-aligned */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto mt-4 md:mt-0 select-none">
            {/* Box 1: ACTIVE TRIALS */}
            <div className="border border-slate-200 bg-slate-50/50 p-2.5 rounded-xl text-center min-w-[110px] shrink-0">
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Active Trials</div>
              <div className="text-sm font-black text-slate-800 mt-1.5">{metrics.trialsActive}</div>
            </div>

            {/* Box 2: CONVERSION RATE */}
            <div className="border border-slate-200 bg-slate-50/50 p-2.5 rounded-xl text-center min-w-[110px] shrink-0">
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Conversion Rate</div>
              <div className="text-sm font-black text-[#D97706] mt-1.5">{metrics.conversion}%</div>
            </div>

            {/* Box 3: EXPIRED PORTALS */}
            <div className="border border-slate-200 bg-slate-50/50 p-2.5 rounded-xl text-center min-w-[110px] shrink-0">
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Expired Portals</div>
              <div className="text-sm font-black text-rose-600 mt-1.5">{metrics.expiredPortals}</div>
            </div>
          </div>
        </div>

        {/* Grid of Trial Cards */}
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrials.map((trial) => {
              const progressPercent = Math.min(100, Math.max(0, (trial.daysRemaining / 14) * 100));

              return (
                <div
                  key={trial.id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs hover:border-slate-400 hover:shadow-xs transition-all duration-250 flex flex-col justify-between space-y-4 text-left"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <h3 className="text-slate-900 font-black text-[13px] leading-none tracking-tight">
                        {trial.company}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-semibold block mt-1.5">
                        Admin: {trial.admin}
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shrink-0 leading-none ${trial.daysRemaining <= 2
                        ? 'bg-rose-50 border border-rose-200 text-rose-700'
                        : 'bg-emerald-50 border border-emerald-250 text-emerald-700'
                      }`}>
                      {trial.status === 'Active' && trial.daysRemaining <= 2 ? 'Expiring' : trial.status}
                    </span>
                  </div>

                  {/* Progress bar info */}
                  <div className="space-y-1.5 select-none">
                    <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className="text-slate-400">Days Remaining</span>
                      <span className="text-slate-900 font-mono font-black">
                        {trial.daysRemaining} / 14 Days
                      </span>
                    </div>
                    {/* Yellow progress bar line */}
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className="bg-[#ffcc00] h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Details List */}
                  <div className="space-y-3.5 text-[11px] font-bold text-slate-700 leading-none">
                    {/* Term Period */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <span className="text-slate-400 font-semibold">Term Period:</span>
                      <span className="text-slate-800 font-extrabold font-mono">{trial.startDate} to {trial.expiryDate}</span>
                    </div>

                    {/* Most Used Module */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <span className="text-slate-400 font-semibold">Most Used Module:</span>
                      <span className="text-slate-800 font-extrabold">{trial.mostUsedModule || 'Live GPS tracking'}</span>
                    </div>

                    {/* Quota limits */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <span className="text-slate-400 font-semibold">Quota limits:</span>
                      <span className="text-slate-800 font-extrabold">{trial.activeUsers || 3} Users • {trial.storage || '0.5 GB'}</span>
                    </div>
                  </div>

                  {/* Actions Bottom (Staying on Page!) */}
                  <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3 shrink-0 pt-2">
                    <button
                      onClick={() => handleOpenLoginModal(trial)}
                      className="w-full sm:w-auto bg-[#ffcc00] hover:bg-[#e6b800] text-black font-extrabold text-[11px] px-4 py-2.5 rounded-xl cursor-pointer transition-colors shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Login As Company</span>
                    </button>
                    <button
                      onClick={() => {
                        setExtensionDays(7);
                        setShowExtendModal(trial);
                      }}
                      className="w-full sm:w-auto text-slate-500 hover:text-slate-800 font-extrabold text-[11.5px] cursor-pointer transition-colors hover:underline text-center"
                    >
                      Extend Trial
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredTrials.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-400 font-bold text-xs space-y-4 select-none">
                <Building className="w-10 h-10 mx-auto text-slate-300 stroke-[1.5]" />
                <div>
                  <p className="text-slate-700 font-black text-sm uppercase tracking-wider">No Active Trial Sandboxes Provisioned</p>
                  <p className="text-slate-400 font-medium mt-1">Start a 14-day evaluation sandbox for a prospect or test with a sample sandbox.</p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setShowProvisionModal(true)}
                    className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer"
                  >
                    + Provision Sandbox
                  </button>
                  <button
                    onClick={handleProvisionDemoSandbox}
                    className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl shadow-xs cursor-pointer"
                  >
                    Load Sample Sandbox
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LOGIN AS COMPANY IMPERSONATION MODAL (NO REDIRECT!) */}
      {showLoginModal && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999999] flex items-center justify-center p-4 pt-16 sm:pt-20 animate-fade-in"
          onClick={() => setShowLoginModal(null)}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-5 space-y-4 text-left font-sans shadow-2xl max-h-[calc(100vh-6rem)] my-auto flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-bold">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Company Admin Access Context</h3>
                  <p className="text-[10.5px] text-slate-500 font-medium">Session token active for evaluation tenant</p>
                </div>
              </div>
              <button 
                onClick={() => setShowLoginModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body - Data Inspection */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-2 text-amber-900 font-semibold">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500 font-bold">Company Tenant:</span>
                  <strong className="text-slate-900 font-black text-xs">{showLoginModal.company}</strong>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500 font-bold">Super Admin Name:</span>
                  <strong className="text-slate-800 font-extrabold">{showLoginModal.admin}</strong>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500 font-bold">Admin Email:</span>
                  <span className="font-mono text-slate-700 text-[10.5px] font-bold">
                    {showLoginModal.admin.toLowerCase().replace(/\s/g, '')}@{showLoginModal.company.toLowerCase().replace(/[^a-z0-9]/gi, '')}.com
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500 font-bold">Evaluation Plan:</span>
                  <span className="px-2 py-0.5 bg-amber-200 text-amber-900 font-black rounded text-[9.5px] uppercase">
                    {showLoginModal.currentPlan || 'Enterprise Sandbox'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500 font-bold">Days Remaining:</span>
                  <span className="font-extrabold text-slate-900">{showLoginModal.daysRemaining} / 14 Days</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[10px] text-slate-600 space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[9px]">Active Session JWT Token:</span>
                <span className="block truncate text-slate-800 font-bold">
                  HERO-JWT-{showLoginModal.id.toUpperCase()}-{Date.now().toString().slice(-6)}
                </span>
              </div>

              <p className="text-[11px] text-slate-500 font-medium">
                You are currently staying on the Trial Companies page. You can launch the admin portal in a new browser tab or copy the session link.
              </p>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => handleCopySessionToken(showLoginModal)}
                  className="w-full sm:w-auto px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Copy size={13} />
                  <span>Copy Link</span>
                </button>
                <button 
                  type="button" 
                  onClick={handleLaunchNewTab}
                  className="w-full sm:w-auto px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ExternalLink size={13} />
                  <span>Launch in New Tab</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROVISION TRIAL SANDBOX MODAL */}
      {showProvisionModal && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999999] flex items-center justify-center p-4 pt-16 sm:pt-20 animate-fade-in"
          onClick={() => setShowProvisionModal(false)}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-5 space-y-4 text-left font-sans shadow-2xl max-h-[calc(100vh-6rem)] my-auto flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
                  <Building size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Provision Trial Sandbox</h3>
                  <p className="text-[10.5px] text-slate-500 font-medium">Create a 14-day evaluation tenant environment</p>
                </div>
              </div>
              <button 
                onClick={() => setShowProvisionModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleProvisionSubmit} className="space-y-3.5 text-xs font-bold text-slate-700 overflow-y-auto flex-grow">
              
              {/* Option 1: Select Existing Lead */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Select Existing Prospect Lead
                </label>
                <select
                  value={provisionForm.selectedLeadId}
                  onChange={e => setProvisionForm({ ...provisionForm, selectedLeadId: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-blue-400 cursor-pointer"
                >
                  <option value="">-- Or Intake New Trial Tenant Below --</option>
                  {leads.map(l => (
                    <option key={l.id} value={l.id}>{l.company} ({l.name} - Stage: {l.stage})</option>
                  ))}
                </select>
              </div>

              {!provisionForm.selectedLeadId && (
                <>
                  <div className="my-2 border-t border-slate-100 pt-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">NEW TENANT DETAILS</span>
                  </div>

                  <div>
                    <label className="block font-extrabold text-slate-700 mb-1">Company Legal Name *</label>
                    <input 
                      type="text"
                      required={!provisionForm.selectedLeadId}
                      placeholder="e.g. Apex Logistics Pty Ltd"
                      value={provisionForm.company}
                      onChange={e => setProvisionForm({ ...provisionForm, company: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-blue-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Admin Person Name *</label>
                      <input 
                        type="text"
                        required={!provisionForm.selectedLeadId}
                        placeholder="David Miller"
                        value={provisionForm.admin}
                        onChange={e => setProvisionForm({ ...provisionForm, admin: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Admin Email *</label>
                      <input 
                        type="email"
                        required={!provisionForm.selectedLeadId}
                        placeholder="admin@apex.com"
                        value={provisionForm.email}
                        onChange={e => setProvisionForm({ ...provisionForm, email: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Fleet Size (Trucks)</label>
                      <input 
                        type="number"
                        min="1"
                        value={provisionForm.fleetSize}
                        onChange={e => setProvisionForm({ ...provisionForm, fleetSize: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Transport Niche</label>
                      <select
                        value={provisionForm.niche}
                        onChange={e => setProvisionForm({ ...provisionForm, niche: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-800 bg-white focus:outline-none focus:border-blue-400 cursor-pointer"
                      >
                        <option value="Car Carrier">Car Carrier</option>
                        <option value="General Freight">General Freight</option>
                        <option value="Cold Chain">Cold Chain</option>
                        <option value="Heavy Haulage">Heavy Haulage</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
                <button 
                  type="button" 
                  onClick={() => setShowProvisionModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check size={14} />
                  <span>Provision 14-Day Sandbox</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXTEND TRIAL MODAL */}
      {showExtendModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999999] flex items-center justify-center p-4 pt-16 sm:pt-20 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-[500px] shadow-2xl overflow-hidden animate-slide-in text-left">
            {/* Header */}
            <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100">
              <h2 className="text-[17px] font-bold text-slate-900">Extend Trial Workspace Term</h2>
              <button onClick={() => setShowExtendModal(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              <p className="text-[14px] font-medium text-slate-600 mb-6">
                Extend evaluation sandbox period for <span className="font-bold text-slate-900">{showExtendModal.company}</span>.
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setToast({ type: 'success', text: `Trial for ${showExtendModal.company} extended by 7 days.` });
                    setShowExtendModal(null);
                  }}
                  className="flex-1 bg-[#FFD500] hover:bg-amber-400 text-slate-900 font-extrabold text-[13px] py-3.5 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Extend +7 Days
                </button>
                <button
                  onClick={() => {
                    setToast({ type: 'success', text: `Trial for ${showExtendModal.company} extended by 30 days.` });
                    setShowExtendModal(null);
                  }}
                  className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-[13px] py-3.5 rounded-xl border border-slate-200 transition-all shadow-sm cursor-pointer"
                >
                  Extend +30 Days
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
