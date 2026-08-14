import React, { useState, useEffect } from 'react';
import {
  Plus, Bell, ChevronDown, Check, Download, FileText,
  TrendingUp, Users, DollarSign, Target
} from 'lucide-react';
import { crmRepository } from '../../services/crmRepository';
import { crmStore } from '../../services/crmStore';
import { useAuth } from '../../context/AuthContext';
import { getSalesReps } from '../../services/api';

export default function SalesReports() {
  const { user } = useAuth();
  // Database States
  const [leads, setLeads] = useState([]);
  const [demos, setDemos] = useState([]);
  const [trials, setTrials] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [salesReps, setSalesReps] = useState([]);
  const [selectedRepFilter, setSelectedRepFilter] = useState('ALL');

  // UI States
  const [activeTab, setActiveTab] = useState('LEADS');

  // Subscribe to crmStore
  useEffect(() => {
    // Sync with database
    crmRepository.syncWithBackend();

    getSalesReps().then(res => {
      if (res.data?.success && Array.isArray(res.data.data)) {
        setSalesReps(res.data.data);
      }
    }).catch(err => console.error('Error fetching reps in reports:', err));

    const syncDb = () => {
      const freshLeads = crmRepository.getLeads();
      setLeads(freshLeads);
      const db = crmRepository.getCrmDatabase();
      setDemos(db.crmDemos || []);
      setTrials(db.crmTrials || []);
      setProposals(db.crmProposals || []);
      const reps = crmRepository.getSalesReps();
      if (reps?.length) setSalesReps(reps);
    };
    syncDb();
    const unsubscribe = crmStore.subscribe(syncDb);
    return () => unsubscribe();
  }, []);

  // --- Dynamically extract reps from leads ---
  const repsList = Array.from(new Set(leads.map(l => l.rep?.name).filter(Boolean)));
  const tabs = ['LEADS', 'CONVERSIONS', 'REVENUE', 'DEMOS', 'TRIALS', 'PROPOSALS', 'REP PERFORMANCE', 'ACTIVITIES'];

  // --- Computed Metrics for LEADS tab ---
  const newLeadsCount = leads.filter(l => l.stage === 'New Lead').length;
  const activePipeline = leads.filter(l => !['Won', 'Lost'].includes(l.stage)).length;
  const wonCount = leads.filter(l => l.stage === 'Won').length;
  const lostCount = leads.filter(l => l.stage === 'Lost').length;
  const totalRevenue = leads.reduce((s, l) => s + (l.revenue || 0), 0);

  // --- Stage badge styles ---
  const getStageStyle = (stage) => {
    if (stage === 'Won') return 'bg-emerald-50 border border-emerald-200 text-emerald-700';
    if (stage === 'Lost') return 'bg-rose-50 border border-rose-200 text-rose-700';
    return 'bg-amber-50 border border-amber-200 text-amber-700';
  };

  // --- Rep Performance computed ---
  const repStats = repsList.map(rep => {
    const repLeads = leads.filter(l => l.rep?.name === rep);
    const won = repLeads.filter(l => l.stage === 'Won').length;
    const pipeline = repLeads.filter(l => !['Won', 'Lost'].includes(l.stage)).length;
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

  // --- Export actual logic ---
  const handleExport = (type) => {
    if (type === 'PDF') {
      window.print();
      return;
    }

    if (type === 'CSV/EXCEL') {
      let dataToExport = [];
      let headers = [];

      if (activeTab === 'LEADS') {
        headers = ['Company', 'Rep', 'Niche', 'Revenue', 'Stage', 'Score'];
        dataToExport = leads.map(l => [l.company, l.rep, l.niche, l.revenue, l.stage, l.score]);
      } else if (activeTab === 'DEMOS') {
        headers = ['Company', 'Presenter', 'Date', 'Time', 'Status'];
        dataToExport = demos.map(d => [d.company, d.presenter, d.date, d.time, d.status]);
      } else if (activeTab === 'TRIALS') {
        headers = ['Company', 'Admin', 'Days Remaining', 'Status'];
        dataToExport = trials.map(t => [t.company, t.admin, t.daysRemaining, t.status]);
      } else if (activeTab === 'PROPOSALS') {
        headers = ['Company', 'Value', 'Total', 'Validity', 'Status'];
        dataToExport = proposals.map(p => [p.company, p.value, p.total, p.validity, p.status]);
      } else if (activeTab === 'REP PERFORMANCE') {
        headers = ['Account Executive', 'Total Leads', 'Pipeline', 'Won', 'Revenue'];
        dataToExport = repStats.map(r => [r.rep, r.total, r.pipeline, r.won, r.revenue]);
      } else {
        alert(`Exporting ${activeTab} data directly is not applicable. Please select a table tab like LEADS or DEMOS.`);
        return;
      }

      const csvContent = [
        headers.join(','),
        ...dataToExport.map(row => row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${activeTab.toLowerCase()}_report.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex-grow bg-[#F8FAFC] p-6 space-y-6 overflow-y-auto w-full text-left font-sans flex flex-col h-full min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] print:overflow-visible print:h-auto print:block">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">
            Sales Reports & Performance Analytics
          </h1>
          <p className="text-xs font-medium text-slate-500">
            Pipeline conversion metrics, revenue distribution, and sales team efficiency analytics.
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

          {/* Export Dropdown / Action */}
          <button
            onClick={() => handleExport('CSV/EXCEL')}
            className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs px-3.5 py-2.5 rounded-xl font-bold transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Main Report Panel */}
      <div className="shrink-0 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col overflow-hidden print:overflow-visible print:border-none print:shadow-none">

        {/* Tab Bar */}
        <div className="flex items-center gap-2 px-6 pt-5 pb-4 border-b border-slate-100 overflow-x-auto scrollbar-none shrink-0">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-[8px] text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border ${activeTab === tab
                  ? 'bg-[#ffcc00] text-slate-900 border-[#ffcc00]'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex flex-col">

          {/* ============ LEADS TAB ============ */}
          {activeTab === 'LEADS' && (
            <div className="flex flex-col px-6 py-5 space-y-5">
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
                  <div className="text-2xl font-black text-[#e6b800]">{newLeadsCount}</div>
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
              <div className="overflow-x-auto border border-slate-200 rounded-xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <table className="w-full text-left border-collapse whitespace-nowrap">
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
            <div className="px-6 py-5 space-y-6 flex flex-col">
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
                  const newLeadCount = leads.filter(l => l.stage === 'New Lead').length;
                  const demoCount = leads.filter(l => l.stage === 'Demo Booked' || l.stage === 'Demo Completed').length;
                  const trialCount = leads.filter(l => l.stage === 'Trial Started').length;
                  const proposalCount = leads.filter(l => l.stage === 'Proposal Sent' || l.stage === 'Negotiation').length;
                  const wonCountStg = leads.filter(l => l.stage === 'Won').length;

                  const data = [
                    { label: 'New Lead', value: newLeadCount, color: 'bg-indigo-500' },
                    { label: 'Demo', value: demoCount, color: 'bg-blue-500' },
                    { label: 'Trial', value: trialCount, color: 'bg-emerald-500' },
                    { label: 'Proposal', value: proposalCount, color: 'bg-amber-500' },
                    { label: 'Won', value: wonCountStg, color: 'bg-teal-500' },
                  ];
                  
                  const maxVal = Math.max(...data.map(d => d.value), 5); // Fallback to 5 to avoid div by 0

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
                  <div className="text-3xl font-black text-[#e6b800]">{leads.length > 0 ? Math.round((wonCount / leads.length) * 100) : 0}%</div>
                  <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1">CONVERSION RATE</div>
                </div>
                <div className="border border-slate-200 rounded-2xl p-6 text-center shadow-xs">
                  {(() => {
                     const demoGrp = leads.filter(l => ['Demo Booked', 'Demo Completed', 'Trial Started', 'Proposal Sent', 'Negotiation', 'Won'].includes(l.stage)).length;
                     const trialGrp = leads.filter(l => ['Trial Started', 'Proposal Sent', 'Negotiation', 'Won'].includes(l.stage)).length;
                     const rate = demoGrp > 0 ? Math.round((trialGrp / demoGrp) * 100) : 0;
                     return <div className="text-3xl font-black text-emerald-500">{rate}%</div>
                  })()}
                  <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1">DEMO → TRIAL RATE</div>
                </div>
                <div className="border border-slate-200 rounded-2xl p-6 text-center shadow-xs">
                  {(() => {
                     const propGrp = leads.filter(l => ['Proposal Sent', 'Negotiation', 'Won'].includes(l.stage)).length;
                     const wonGrp = leads.filter(l => l.stage === 'Won').length;
                     const rate = propGrp > 0 ? Math.round((wonGrp / propGrp) * 100) : 0;
                     return <div className="text-3xl font-black text-[#e6b800]">{rate}%</div>
                  })()}
                  <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1">PROPOSAL ACCEPT RATE</div>
                </div>
              </div>
            </div>
          )}

          {/* ============ REVENUE TAB ============ */}
          {activeTab === 'REVENUE' && (
            <div className="px-6 py-5 space-y-6 flex flex-col">
              <span className="text-[12px] font-black text-slate-700 uppercase tracking-widest">
                REVENUE ANALYTICS REPORT
              </span>

              <div className="grid grid-cols-3 gap-4 shrink-0">
                <div className="border border-slate-200 rounded-2xl p-6 text-center shadow-xs">
                  {(() => {
                     const mrr = leads.filter(l => l.stage === 'Won').reduce((s, l) => s + (l.revenue || 0), 0);
                     return (
                       <>
                         <div className="text-3xl font-black text-[#e6b800]">${mrr.toLocaleString()}</div>
                         <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1">MONTHLY MRR (WON)</div>
                       </>
                     );
                  })()}
                </div>
                <div className="border border-slate-200 rounded-2xl p-6 text-center shadow-xs">
                  {(() => {
                     const mrr = leads.filter(l => l.stage === 'Won').reduce((s, l) => s + (l.revenue || 0), 0);
                     const arr = mrr * 12;
                     return (
                       <>
                         <div className="text-3xl font-black text-emerald-500">${arr.toLocaleString()}</div>
                         <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1">ANNUAL ARR (WON)</div>
                       </>
                     );
                  })()}
                </div>
                <div className="border border-slate-200 rounded-2xl p-6 text-center shadow-xs">
                  {(() => {
                     const pipelineValue = leads.filter(l => !['Won', 'Lost'].includes(l.stage)).reduce((s, l) => s + (l.revenue || 0), 0);
                     return (
                       <>
                         <div className="text-3xl font-black text-[#e6b800]">${pipelineValue.toLocaleString()}</div>
                         <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1">PIPELINE VALUE</div>
                       </>
                     );
                  })()}
                </div>
              </div>

              {/* Chart Area */}
              <div className="relative h-64 border border-slate-200 rounded-xl bg-white p-6 pb-10 flex items-end justify-between gap-4 mt-4">
                {/* Y-Axis labels and gridlines */}
                <div className="absolute inset-0 p-6 pb-10 pointer-events-none flex flex-col justify-between">
                  {(() => {
                    const stages = ['New Lead', 'Contacted', 'Demo Booked', 'Demo Completed', 'Trial Started', 'Proposal Sent', 'Negotiation'];
                    const maxRev = Math.max(...stages.map(stage => leads.filter(l => l.stage === stage).reduce((s, l) => s + (l.revenue || 0), 0)), 1000);
                    const step = Math.ceil(maxRev / 4);
                    return [step * 4, step * 3, step * 2, step * 1, 0].map(val => (
                      <div key={val} className="w-full flex items-center justify-between border-b border-dashed border-slate-200 relative h-0">
                        <span className="absolute -left-6 text-[10px] text-slate-400 font-mono translate-y-1/2">{val >= 1000 ? (val/1000).toFixed(1) + 'k' : val}</span>
                      </div>
                    ));
                  })()}
                </div>

                {/* Bars */}
                {(() => {
                  const stages = ['New Lead', 'Contacted', 'Demo Booked', 'Demo Completed', 'Trial Started', 'Proposal Sent', 'Negotiation'];
                  const data = stages.map(stage => ({
                    label: stage,
                    value: leads.filter(l => l.stage === stage).reduce((s, l) => s + (l.revenue || 0), 0)
                  }));
                  const maxVal = Math.max(...data.map(d => d.value), 1000); // Fallback to avoid div by 0

                  return data.map(item => (
                    <div key={item.label} className="relative z-10 w-full flex flex-col items-center justify-end h-full group cursor-pointer">
                      <div className="w-[90%] rounded-t-sm bg-[#FFD54F] hover:bg-[#ffcc00] transition-all border border-[#ffcc00]" style={{ height: `${(item.value / maxVal) * 100}%` }}></div>
                      <span className="absolute -bottom-6 text-[9px] text-slate-400 font-semibold text-center leading-tight">{item.label}</span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}

          {/* ============ DEMOS TAB ============ */}
          {activeTab === 'DEMOS' && (
            <div className="px-6 py-5 space-y-6 flex flex-col">
              <span className="text-[12px] font-black text-slate-700 uppercase tracking-widest">
                DEMO BOOKINGS REPORT
              </span>
              <div className="grid grid-cols-3 gap-4 shrink-0">
                <div className="border border-slate-200 rounded-2xl p-6 text-center shadow-xs">
                  <div className="text-3xl font-black text-slate-800">{demos.length}</div>
                  <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1">TOTAL DEMOS</div>
                </div>
                <div className="border border-slate-200 rounded-2xl p-6 text-center shadow-xs">
                  <div className="text-3xl font-black text-[#e6b800]">{demos.filter(d => d.status === 'Upcoming').length}</div>
                  <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1">UPCOMING</div>
                </div>
                <div className="border border-slate-200 rounded-2xl p-6 text-center shadow-xs">
                  <div className="text-3xl font-black text-emerald-500">{demos.filter(d => d.status === 'Completed').length}</div>
                  <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-1">COMPLETED</div>
                </div>
              </div>
              <div className="border border-slate-200 rounded-xl overflow-x-auto mt-2">
                <table className="w-full text-left border-collapse whitespace-nowrap">
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
                          <span className={`px-2.5 py-1 rounded-[6px] text-[9px] font-black uppercase tracking-wider leading-none ${d.status === 'Completed' ? 'text-emerald-600 bg-emerald-50' :
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
            <div className="px-6 py-5 space-y-6 flex flex-col">
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
                  <div className="text-3xl font-black text-[#e6b800]">{trials.filter(t => t.daysRemaining <= 3 && t.status === 'Active').length}</div>
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
                            <div className="h-1 bg-[#ffcc00] rounded-full" style={{ width: `${(t.daysRemaining / 14) * 100}%` }}></div>
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
            <div className="px-6 py-5 space-y-5">
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
                  <div className="text-xl font-black text-[#e6b800]">{proposals.filter(p => p.status === 'Sent').length}</div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Sent</div>
                </div>
                <div className="border border-slate-200 rounded-xl p-4 text-center">
                  <div className="text-xl font-black text-emerald-500">{proposals.filter(p => p.status === 'Accepted').length}</div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Accepted</div>
                </div>
                <div className="border border-slate-200 rounded-xl p-4 text-center">
                  <div className="text-xl font-black text-slate-600">${proposals.reduce((s, p) => s + (p.total || 0), 0).toLocaleString()}</div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Value</div>
                </div>
              </div>
              <div className="border border-slate-200 rounded-xl overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
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
                        <td className="py-3 px-4 text-right font-black text-slate-700 font-mono">${Number(p.total || 0).toLocaleString()}</td>
                        <td className="py-3 px-4 text-slate-500 font-semibold">{p.validity}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider leading-none ${p.status === 'Accepted' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' :
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
            <div className="px-6 py-5 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Account Executive Performance Scorecard
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {repsList.length} Active Reps
                </span>
              </div>
              <div className="border border-slate-200 rounded-xl overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
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
                        <td className="py-3 px-4 text-right font-black text-[#e6b800] font-mono">{r.pipeline}</td>
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
            <div className="px-6 py-5 space-y-5">
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
                  <div className="text-xl font-black text-[#e6b800]">{demos.length}</div>
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
