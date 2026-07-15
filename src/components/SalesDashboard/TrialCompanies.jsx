import React, { useState, useEffect } from 'react';
import { 
  Plus, Mail, Phone, ChevronRight, X, Sparkles, 
  Edit3, Trash2, Bell, ShieldCheck, ChevronDown, Check, 
  DollarSign, Building, Truck, RefreshCw, CreditCard, Calendar, ShieldAlert 
} from 'lucide-react';
import { crmRepository } from '../../services/crmRepository';
import { crmStore } from '../../services/crmStore';
import { crmWorkflowEngine } from '../../services/crmEngines';

export default function TrialCompanies() {
  // Database States loaded from localStorage crmStore
  const [trials, setTrials] = useState([]);
  
  // UI states
  const [activeRole, setActiveRole] = useState('Sales Director');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [metrics, setMetrics] = useState({ trialsActive: 0, conversion: 10, expiredPortals: 0 });
  
  // Modal states
  const [showExtendModal, setShowExtendModal] = useState(null); // trial object or null
  const [extensionDays, setExtensionDays] = useState(7);
  
  // Toast feedback state
  const [toast, setToast] = useState(null);

  // Subscribe to crmStore changes to ensure reactive localStorage binding
  useEffect(() => {
    const syncDb = () => {
      const db = crmRepository.getCrmDatabase();
      const safeTrials = db.trials || [];
      const safeLeads = db.leads || [];
      
      setTrials(safeTrials);
      
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
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // List of available reps
  const repsList = ['Alex Wright', 'Sarah K.', 'Michael Scott', 'Jan Levinson', 'Ryan Howard'];

  // Handle Login As Company session simulation
  const handleLoginAsCompany = (trial) => {
    // Write mock session to localStorage
    const mockSession = {
      token: `mock-jwt-token-${Date.now()}`,
      email: `${trial.admin.toLowerCase().replace(/\s/g, '')}@${trial.company.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      role: 'Company Admin',
      name: trial.admin,
      company: trial.company,
      plan: trial.currentPlan || 'Professional',
      joinedAt: trial.startDate
    };
    
    localStorage.setItem('hero_session', JSON.stringify(mockSession));
    
    // Dispatch session-changed event
    window.dispatchEvent(new Event('storage'));
    
    setToast({ text: `Impersonating admin session takeover context for ${trial.company}...` });
  };

  // Handle Extend Trial submit
  const handleExtendSubmit = (e) => {
    e.preventDefault();
    if (!showExtendModal) return;

    crmRepository.extendTrial(showExtendModal.id, Number(extensionDays));
    setToast({ type: 'success', text: `Trial for ${showExtendModal.company} extended by ${extensionDays} days.` });
    setShowExtendModal(null);
  };

  // Rep filtering based on Role selected
  const filteredTrials = trials.filter(trial => {
    if (activeRole === 'Sales Director') return true;
    // Map trial to lead rep
    const db = crmStore.getDb();
    const lead = db.leads.find(l => l.id === trial.leadId);
    return lead ? lead.rep === activeRole : false;
  });

  return (
    <div className="flex-grow bg-[#F8FAFC] p-6 space-y-6 overflow-y-auto w-full text-left font-sans flex flex-col h-full min-h-0">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center justify-between gap-4 px-5 py-3 bg-white border border-slate-300 text-slate-800 rounded-2xl shadow-2xl text-[13px] font-semibold animate-slide-in">
          <span>{toast.text}</span>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1">
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
            Complete end-to-end client conversion console backed by secure localStorage registry tables.
          </p>
        </div>


      </div>

      {/* Main Content Section (Quotas + Grid) */}
      <div className="flex-grow bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col overflow-hidden min-h-0">
        
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
          <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none select-none">
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
        <div className="flex-grow overflow-y-auto p-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrials.map((trial) => {
            const progressPercent = Math.min(100, Math.max(0, (trial.daysRemaining / 14) * 100));
            
            return (
              <div 
                key={trial.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs hover:border-slate-350 hover:shadow-xs transition-all duration-250 flex flex-col justify-between space-y-4"
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
                  <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shrink-0 leading-none ${
                    trial.daysRemaining <= 2 
                      ? 'bg-rose-50 border border-rose-200 text-rose-700' 
                      : 'bg-emerald-50 border border-emerald-250 text-emerald-700'
                  }`}>
                    {trial.status === 'Active' && trial.daysRemaining <= 2 ? 'Expiring' : trial.status}
                  </span>
                </div>

                {/* Progress bar info */}
                <div className="space-y-1.5 select-none">
                  <div className="flex justify-between items-center text-[11px] font-bold">
                    <span className="text-slate-450">Days Remaining</span>
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
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-semibold">Term Period:</span>
                    <span className="text-slate-800 font-extrabold font-mono">{trial.startDate} to {trial.expiryDate}</span>
                  </div>
                  
                  {/* Most Used Module */}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-semibold">Most Used Module:</span>
                    <span className="text-slate-850 font-extrabold">{trial.mostUsedModule || 'Live GPS tracking'}</span>
                  </div>

                  {/* Quota limits */}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-semibold">Quota limits:</span>
                    <span className="text-slate-850 font-extrabold">{trial.activeUsers || 3} Users • {trial.storage || '0.5 GB'}</span>
                  </div>
                </div>

                {/* Actions Bottom */}
                <div className="flex items-center justify-between shrink-0 pt-2">
                  <button 
                    onClick={() => handleLoginAsCompany(trial)}
                    className="bg-[#ffcc00] hover:bg-[#e6b800] text-black font-extrabold text-[11px] px-5 py-2.5 rounded-xl cursor-pointer transition-colors shadow-xs"
                  >
                    Login As Company
                  </button>
                  <button 
                    onClick={() => {
                      setExtensionDays(7);
                      setShowExtendModal(trial);
                    }}
                    className="text-slate-500 hover:text-slate-805 font-extrabold text-[11.5px] cursor-pointer transition-colors hover:underline"
                  >
                    Extend Trial
                  </button>
                </div>
              </div>
            );
          })}

          {filteredTrials.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-400 font-bold text-xs uppercase tracking-wider select-none">
              No active trial sandboxes provisioned.
            </div>
          )}
        </div>
      </div>
      </div> {/* <-- Closes Main Content Section */}

      {/* Extend Trial Modal */}
      {showExtendModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-[500px] shadow-2xl overflow-hidden animate-slide-in">
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
                    crmRepository.extendTrial(showExtendModal.id, 7);
                    setToast({ type: 'success', text: `Trial for ${showExtendModal.company} extended by 7 days.` });
                    setShowExtendModal(null);
                  }}
                  className="flex-1 bg-[#FFD500] hover:bg-[#FFC800] text-slate-900 font-extrabold text-[13px] py-3.5 rounded-xl transition-all shadow-sm"
                >
                  Extend +7 Days
                </button>
                <button
                  onClick={() => {
                    crmRepository.extendTrial(showExtendModal.id, 30);
                    setToast({ type: 'success', text: `Trial for ${showExtendModal.company} extended by 30 days.` });
                    setShowExtendModal(null);
                  }}
                  className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-[13px] py-3.5 rounded-xl border border-slate-200 transition-all shadow-sm"
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
