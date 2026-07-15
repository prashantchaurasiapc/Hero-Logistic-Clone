import React, { useState, useEffect } from 'react';
import { 
  Plus, Bell, ChevronDown, Check, Download, FileText,
  TrendingUp, Users, DollarSign, Target
} from 'lucide-react';
import { crmRepository } from '../../services/crmRepository';
import { crmStore } from '../../services/crmStore';

export default function SalesReports() {
  // Database States
  const [leads, setLeads] = useState([]);
  const [demos, setDemos] = useState([]);
  const [trials, setTrials] = useState([]);
  const [proposals, setProposals] = useState([]);

  // UI States
  const [activeRole, setActiveRole] = useState('Sales Director');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('LEADS');

  // Subscribe to crmStore
  useEffect(() => {
    const syncDb = () => {
      const freshLeads = crmRepository.getLeads();
      setLeads(freshLeads);
      const db = crmRepository.getCrmDatabase();
      setDemos(db.crmDemos || []);
      setTrials(db.crmTrials || []);
      setProposals(db.crmProposals || []);
    };
    syncDb();
    const unsubscribe = crmStore.subscribe(syncDb);
    return () => unsubscribe();
  }, []);

  const repsList = ['Alex Wright', 'Sarah K.', 'Michael Scott', 'Jan Levinson', 'Ryan Howard'];

  const tabs = ['LEADS', 'CONVERSIONS', 'REVENUE', 'DEMOS', 'TRIALS', 'PROPOSALS', 'REP PERFORMANCE', 'ACTIVITIES'];

  // --- Computed Metrics for LEADS tab ---
  const newLeadsCount    = leads.filter(l => l.stage === 'New Lead').length;
  const activePipeline   = leads.filter(l => !['Won','Lost'].includes(l.stage)).length;
  const wonCount         = leads.filter(l => l.stage === 'Won').length;
  const lostCount        = leads.filter(l => l.stage === 'Lost').length;
  const totalRevenue     = leads.reduce((s, l) => s + (l.revenue || 0), 0);

  // --- Stage badge styles ---
  const getStageStyle = (stage) => {
    if (stage === 'Won') return 'bg-emerald-50 border border-emerald-200 text-emerald-700';
    if (stage === 'Lost') return 'bg-rose-50 border border-rose-200 text-rose-700';
    return 'bg-amber-50 border border-amber-200 text-amber-700';
  };

  // --- Rep Performance computed ---
  const repStats = repsList.map(rep => {
    const repLeads = leads.filter(l => l.rep === rep);
    const won = repLeads.filter(l => l.stage === 'Won').length;
    const pipeline = repLeads.filter(l => !['Won','Lost'].includes(l.stage)).length;
    const rev = repLeads.reduce((s, l) => s + (l.revenue || 0), 0);
    return { rep, total: repLeads.length, won, pipeline, revenue: rev };
  });

  // --- Conversions computed ---
  const conversionRate = leads.length > 0 ? Math.round((wonCount / leads.length) * 100) : 0;
  const stageBreakdown = [
    'New Lead', 'Contacted', 'Demo Booked', 'Demo Completed',
    'Trial Started', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'
  ].map(stage => ({
    stage,
    count: leads.filter(l => l.stage === stage).length
  }));

  // --- Export simulation ---
  const handleExport = (type) => {
    alert(`Exporting ${activeTab} report as ${type}...`);
  };

  return (
    <div className="flex-grow bg-[#F8FAFC] p-6 space-y-6 overflow-y-auto w-full text-left font-sans flex flex-col h-full min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

      {/* Header Container */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
              Sales Report
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

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap sm:flex-nowrap">
          {/* Role Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] px-3.5 py-2 rounded-xl font-black hover:bg-amber-100 cursor-pointer shadow-xs whitespace-nowrap"
            >
              Role: {activeRole === 'Sales Director' ? 'Sales Director (Full Access)' : `${activeRole} (Sales Rep)`}
              <ChevronDown className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            </button>
            {showRoleDropdown && (
              <div className="absolute right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 text-xs text-slate-700">
                <div className="px-3 py-1 text-[9px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">Select Session Identity</div>
                <button
                  onClick={() => { setActiveRole('Sales Director'); setShowRoleDropdown(false); }}
                  className={`w-full px-3 py-2 text-left font-bold hover:bg-slate-50 flex items-center justify-between ${activeRole === 'Sales Director' ? 'text-amber-700 bg-amber-50/50' : ''}`}
                >
                  Sales Director (Full Access)
                  {activeRole === 'Sales Director' && <Check className="w-3.5 h-3.5" />}
                </button>
                {repsList.map(rep => (
                  <button
                    key={rep}
                    onClick={() => { setActiveRole(rep); setShowRoleDropdown(false); }}
                    className={`w-full px-3 py-2 text-left font-bold hover:bg-slate-50 flex items-center justify-between ${activeRole === rep ? 'text-amber-700 bg-amber-50/50' : ''}`}
                  >
                    {rep} (Sales Rep)
                    {activeRole === rep && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bell */}
          <button className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-500 hover:text-slate-800 cursor-pointer relative shadow-xs shrink-0">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white"></span>
          </button>

          {/* Add New Lead */}
          <button
            onClick={() => alert("Intake new lead from Leads Console Database")}
            className="flex-grow sm:flex-grow-0 bg-[#F59E0B] hover:bg-[#D97706] text-black font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0 stroke-[3px]" /> Add New Lead
          </button>
        </div>
      </div>

      {/* Main Report Panel */}
      <div className="flex-grow bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col overflow-hidden min-h-0">

        {/* Tab Bar */}
        <div className="flex items-center gap-2 px-6 pt-5 pb-4 border-b border-slate-100 overflow-x-auto scrollbar-none shrink-0">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-[8px] text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border ${
                activeTab === tab
                  ? 'bg-[#FFC107] text-slate-900 border-[#FFC107]'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-grow overflow-y-auto flex flex-col min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

          {/* ============ LEADS TAB ============ */}
          {activeTab === 'LEADS' && (
            <div className="flex-grow flex flex-col px-6 py-5 space-y-5">
              {/* Sub Header */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Leads Report — All Pipeline Records
                </span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">
                  {leads.length} Total Leads
                </span>
              </div>

              {/* Stat Boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 shrink-0">
                <div className="border border-slate-200 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-[#F59E0B]">{newLeadsCount}</div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">New Leads</div>
                </div>
                <div className="border border-slate-200 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-slate-700">{activePipeline}</div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Active Pipeline</div>
                </div>
                <div className="border border-slate-200 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-emerald-500">{wonCount}</div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Won</div>
                </div>
                <div className="border border-slate-200 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-rose-500">{lostCount}</div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Lost</div>
                </div>
              </div>

              {/* Leads Table */}
              <div className="flex-grow overflow-auto border border-slate-200 rounded-xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                      <th className="py-3 px-4">Company</th>
                      <th className="py-3 px-4">Rep</th>
                      <th className="py-3 px-4">Niche</th>
                      <th className="py-3 px-4 text-right">Revenue</th>
                      <th className="py-3 px-4">Stage</th>
                      <th className="py-3 px-4 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-extrabold text-slate-900">{lead.company}</td>
                        <td className="py-3 px-4 text-slate-500">{lead.rep}</td>
                        <td className="py-3 px-4 text-slate-500">{lead.niche}</td>
                        <td className="py-3 px-4 text-right font-black text-[#D97706] font-mono">
                          ${Number(lead.revenue).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider leading-none ${getStageStyle(lead.stage)}`}>
                            {lead.stage}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-black text-slate-700 font-mono">{lead.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============ CONVERSIONS TAB ============ */}
          {activeTab === 'CONVERSIONS' && (
            <div className="flex-grow px-6 py-5 space-y-6 flex flex-col">
              <span className="text-[12px] font-black text-slate-700 uppercase tracking-widest">
                CONVERSIONS FUNNEL REPORT
              </span>

              {/* Chart Area */}
              <div className="relative h-64 border border-slate-200 rounded-xl bg-white p-6 pb-10 flex items-end justify-between gap-4">
                {/* Y-Axis labels and gridlines */}
                <div className="absolute inset-0 p-6 pb-10 pointer-events-none flex flex-col justify-between">
                  {[24, 18, 12, 6, 0].map(val => (
                    <div key={val} className="w-full flex items-center justify-between border-b border-dashed border-slate-200 relative h-0">
                      <span className="absolute -left-5 text-[10px] text-slate-400 font-mono translate-y-1/2">{val}</span>
                    </div>
                  ))}
                </div>
                
                {/* Bars */}
                {(() => {
                  const data = [
                    { label: 'New Lead', value: 6, color: 'bg-indigo-500' },
                    { label: 'Demo', value: 20, color: 'bg-blue-500' },
                    { label: 'Trial', value: 21, color: 'bg-emerald-500' },
                    { label: 'Proposal', value: 15, color: 'bg-amber-500' },
                    { label: 'Won', value: 5, color: 'bg-teal-500' },
                  ];
                  const maxVal = 24;
                  return data.map(item => (
                    <div key={item.label} className="relative z-10 w-full flex flex-col items-center justify-end h-full">
                      <div className={`w-full rounded-t-md ${item.color} transition-all`} style={{ height: `${(item.value / maxVal) * 100}%` }}></div>
                      <span className="absolute -bottom-6 text-[10px] text-slate-400 font-semibold">{item.label}</span>
                    </div>
                  ));
                })()}
              </div>

              {/* Stat Boxes below chart */}
              <div className="grid grid-cols-3 gap-4 shrink-0">
                <div className="border border-slate-200 rounded-2xl p-6 text-center shadow-xs">
                  <div className="text-3xl font-black text-[#F59E0B]">10%</div>
                  <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1">CONVERSION RATE</div>
                </div>
                <div className="border border-slate-200 rounded-2xl p-6 text-center shadow-xs">
                  <div className="text-3xl font-black text-emerald-500">35%</div>
                  <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1">DEMO → TRIAL RATE</div>
                </div>
                <div className="border border-slate-200 rounded-2xl p-6 text-center shadow-xs">
                  <div className="text-3xl font-black text-[#F59E0B]">33%</div>
                  <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1">PROPOSAL ACCEPT RATE</div>
                </div>
              </div>
            </div>
          )}

          {/* ============ REVENUE TAB ============ */}
          {activeTab === 'REVENUE' && (
            <div className="flex-grow px-6 py-5 space-y-6 flex flex-col">
              <span className="text-[12px] font-black text-slate-700 uppercase tracking-widest">
                REVENUE ANALYTICS REPORT
              </span>

              <div className="grid grid-cols-3 gap-4 shrink-0">
                <div className="border border-slate-200 rounded-2xl p-6 text-center shadow-xs">
                  <div className="text-3xl font-black text-[#F59E0B]">$124,071</div>
                  <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1">MONTHLY MRR</div>
                </div>
                <div className="border border-slate-200 rounded-2xl p-6 text-center shadow-xs">
                  <div className="text-3xl font-black text-emerald-500">$1,488,852</div>
                  <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1">ANNUAL ARR</div>
                </div>
                <div className="border border-slate-200 rounded-2xl p-6 text-center shadow-xs">
                  <div className="text-3xl font-black text-[#F59E0B]">$306,960</div>
                  <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1">PIPELINE VALUE</div>
                </div>
              </div>

              {/* Chart Area */}
              <div className="relative h-64 border border-slate-200 rounded-xl bg-white p-6 pb-10 flex items-end justify-between gap-4 mt-4">
                {/* Y-Axis labels and gridlines */}
                <div className="absolute inset-0 p-6 pb-10 pointer-events-none flex flex-col justify-between">
                  {[60000, 45000, 30000, 15000, 0].map(val => (
                    <div key={val} className="w-full flex items-center justify-between border-b border-dashed border-slate-200 relative h-0">
                      <span className="absolute -left-6 text-[10px] text-slate-400 font-mono translate-y-1/2">{val}</span>
                    </div>
                  ))}
                </div>
                
                {/* Bars */}
                {(() => {
                  const data = [
                    { label: 'New Lead', value: 48000 },
                    { label: 'Contacted', value: 51000 },
                    { label: 'Demo Booked', value: 41000 },
                    { label: 'Demo Completed', value: 44000 },
                    { label: 'Trial Started', value: 47000 },
                    { label: 'Proposal Sent', value: 37000 },
                    { label: 'Negotiation', value: 39000 },
                  ];
                  const maxVal = 60000;
                  return data.map(item => (
                    <div key={item.label} className="relative z-10 w-full flex flex-col items-center justify-end h-full group cursor-pointer">
                      <div className="w-[90%] rounded-t-sm bg-[#FFD54F] hover:bg-[#FFC107] transition-all border border-[#FFC107]" style={{ height: `${(item.value / maxVal) * 100}%` }}></div>
                      <span className="absolute -bottom-6 text-[9px] text-slate-400 font-semibold">{item.label}</span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}

          {/* ============ DEMOS TAB ============ */}
          {activeTab === 'DEMOS' && (
            <div className="flex-grow px-6 py-5 space-y-6 flex flex-col">
              <span className="text-[12px] font-black text-slate-700 uppercase tracking-widest">
                DEMO BOOKINGS REPORT
              </span>
              <div className="grid grid-cols-3 gap-4 shrink-0">
                <div className="border border-slate-200 rounded-2xl p-6 text-center shadow-xs">
                  <div className="text-3xl font-black text-slate-800">{demos.length}</div>
                  <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1">TOTAL DEMOS</div>
                </div>
                <div className="border border-slate-200 rounded-2xl p-6 text-center shadow-xs">
                  <div className="text-3xl font-black text-[#F59E0B]">{demos.filter(d => d.status === 'Upcoming').length}</div>
                  <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1">UPCOMING</div>
                </div>
                <div className="border border-slate-200 rounded-2xl p-6 text-center shadow-xs">
                  <div className="text-3xl font-black text-emerald-500">{demos.filter(d => d.status === 'Completed').length}</div>
                  <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1">COMPLETED</div>
                </div>
              </div>
              <div className="border border-slate-200 rounded-xl overflow-hidden mt-2">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                      <th className="py-4 px-5">Company</th>
                      <th className="py-4 px-5">Presenter</th>
                      <th className="py-4 px-5">Date</th>
                      <th className="py-4 px-5">Time</th>
                      <th className="py-4 px-5">Status</th>
                      <th className="py-4 px-5">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                    {demos.map(d => (
                      <tr key={d.id} className="hover:bg-slate-50/50">
                        <td className="py-4 px-5 text-slate-900">{d.company}</td>
                        <td className="py-4 px-5 text-slate-500">{d.presenter}</td>
                        <td className="py-4 px-5 font-mono text-slate-500">{d.date}</td>
                        <td className="py-4 px-5 font-mono text-slate-500">{d.time}</td>
                        <td className="py-4 px-5">
                          <span className={`px-2.5 py-1 rounded-[6px] text-[9px] font-black uppercase tracking-wider leading-none ${
                            d.status === 'Completed' ? 'text-emerald-600 bg-emerald-50' :
                            d.status === 'Cancelled' ? 'text-rose-600 bg-rose-50' :
                            'text-[#D97706] bg-amber-50'
                          }`}>{d.status}</span>
                        </td>
                        <td className="py-4 px-5 text-slate-400">—</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============ TRIALS TAB ============ */}
          {activeTab === 'TRIALS' && (
            <div className="flex-grow px-6 py-5 space-y-6 flex flex-col">
              <span className="text-[12px] font-black text-slate-700 uppercase tracking-widest">
                TRIAL WORKSPACES REPORT
              </span>
              <div className="grid grid-cols-3 gap-4 shrink-0">
                <div className="border border-slate-200 rounded-2xl p-6 text-center shadow-xs">
                  <div className="text-3xl font-black text-emerald-500">{trials.filter(t => t.status === 'Active').length}</div>
                  <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1">ACTIVE TRIALS</div>
                </div>
                <div className="border border-slate-200 rounded-2xl p-6 text-center shadow-xs">
                  <div className="text-3xl font-black text-rose-500">{trials.filter(t => t.status === 'Expired').length}</div>
                  <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1">EXPIRED</div>
                </div>
                <div className="border border-slate-200 rounded-2xl p-6 text-center shadow-xs">
                  <div className="text-3xl font-black text-[#F59E0B]">{trials.filter(t => t.daysRemaining <= 3 && t.status === 'Active').length}</div>
                  <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1">EXPIRING SOON</div>
                </div>
              </div>
              <div className="border border-slate-200 rounded-xl overflow-hidden mt-2">
                <div className="divide-y divide-slate-100 flex flex-col">
                  {trials.map(t => (
                    <div key={t.id} className="p-5 flex items-center justify-between hover:bg-slate-50/50">
                      <div>
                        <div className="font-bold text-[13px] text-slate-900">{t.company}</div>
                        <div className="text-[10px] text-slate-500 mt-1">Admin: {t.admin} • Plan: Professional</div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-slate-400 uppercase">Days Left</span>
                            <span className="text-[11px] font-black font-mono text-slate-800">{t.daysRemaining}</span>
                          </div>
                          <div className="w-16 h-1 bg-slate-200 rounded-full flex justify-end">
                            <div className="h-1 bg-[#FFC107] rounded-full" style={{ width: `${(t.daysRemaining / 14) * 100}%` }}></div>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-[6px] text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50">
                          {t.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============ PROPOSALS TAB ============ */}
          {activeTab === 'PROPOSALS' && (
            <div className="flex-grow px-6 py-5 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Licensing Proposals Registry
                </span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">
                  {proposals.length} Total Proposals
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="border border-slate-200 rounded-xl p-4 text-center">
                  <div className="text-xl font-black text-[#F59E0B]">{proposals.filter(p => p.status === 'Sent').length}</div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Sent</div>
                </div>
                <div className="border border-slate-200 rounded-xl p-4 text-center">
                  <div className="text-xl font-black text-emerald-500">{proposals.filter(p => p.status === 'Accepted').length}</div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Accepted</div>
                </div>
                <div className="border border-slate-200 rounded-xl p-4 text-center">
                  <div className="text-xl font-black text-slate-600">${proposals.reduce((s,p) => s+(p.total||0), 0).toLocaleString()}</div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Value</div>
                </div>
              </div>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                      <th className="py-3 px-4">Company</th>
                      <th className="py-3 px-4 text-right">Value</th>
                      <th className="py-3 px-4 text-right">Total</th>
                      <th className="py-3 px-4">Validity</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {proposals.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-extrabold text-slate-900">{p.company}</td>
                        <td className="py-3 px-4 text-right font-black text-[#D97706] font-mono">${Number(p.value).toLocaleString()}/mo</td>
                        <td className="py-3 px-4 text-right font-black text-slate-700 font-mono">${Number(p.total||0).toLocaleString()}</td>
                        <td className="py-3 px-4 text-slate-500 font-semibold">{p.validity}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider leading-none ${
                            p.status === 'Accepted' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' :
                            p.status === 'Sent' ? 'bg-amber-50 border border-amber-200 text-amber-700' :
                            'bg-slate-100 border border-slate-200 text-slate-600'
                          }`}>{p.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============ REP PERFORMANCE TAB ============ */}
          {activeTab === 'REP PERFORMANCE' && (
            <div className="flex-grow px-6 py-5 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Account Executive Performance Scorecard
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {repsList.length} Active Reps
                </span>
              </div>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                      <th className="py-3 px-4">Account Executive</th>
                      <th className="py-3 px-4 text-right">Total Leads</th>
                      <th className="py-3 px-4 text-right">Pipeline</th>
                      <th className="py-3 px-4 text-right">Won</th>
                      <th className="py-3 px-4 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {repStats.map(r => (
                      <tr key={r.rep} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-extrabold text-slate-900">{r.rep}</td>
                        <td className="py-3 px-4 text-right font-black text-slate-700 font-mono">{r.total}</td>
                        <td className="py-3 px-4 text-right font-black text-[#F59E0B] font-mono">{r.pipeline}</td>
                        <td className="py-3 px-4 text-right font-black text-emerald-600 font-mono">{r.won}</td>
                        <td className="py-3 px-4 text-right font-black text-[#D97706] font-mono">${r.revenue.toLocaleString()}/mo</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============ ACTIVITIES TAB ============ */}
          {activeTab === 'ACTIVITIES' && (
            <div className="flex-grow px-6 py-5 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Sales Activity Summary
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="border border-slate-200 rounded-xl p-4 text-center">
                  <div className="text-xl font-black text-slate-700">{leads.length}</div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Leads</div>
                </div>
                <div className="border border-slate-200 rounded-xl p-4 text-center">
                  <div className="text-xl font-black text-[#F59E0B]">{demos.length}</div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Demos Logged</div>
                </div>
                <div className="border border-slate-200 rounded-xl p-4 text-center">
                  <div className="text-xl font-black text-emerald-500">{trials.length}</div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Trials Provisioned</div>
                </div>
                <div className="border border-slate-200 rounded-xl p-4 text-center">
                  <div className="text-xl font-black text-violet-500">{proposals.length}</div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Proposals Issued</div>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-[11px] text-slate-500 font-semibold text-center">
                Detailed activity timeline available in Lead Inspector → 360 Profile.
              </div>
            </div>
          )}
        </div>

        {/* Footer Export Bar */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <span className="text-[10px] text-slate-400 font-semibold">Export complete report decks:</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleExport('PDF')}
              className="text-[10px] font-black text-slate-600 hover:text-slate-900 uppercase tracking-widest cursor-pointer transition-colors"
            >
              Export PDF
            </button>
            <button
              onClick={() => handleExport('CSV/EXCEL')}
              className="text-[10px] font-black text-slate-600 hover:text-slate-900 uppercase tracking-widest cursor-pointer transition-colors"
            >
              Export CSV / Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
