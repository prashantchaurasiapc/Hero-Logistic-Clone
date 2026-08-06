import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  FileCode, 
  Calendar, 
  CheckCircle2, 
  X,
  ShieldCheck,
  BarChart2,
  Loader2
} from 'lucide-react';
import api from '../../services/api';

export default function SystemAnalytics() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportScope, setExportScope] = useState('Platform Financials & MRR');
  const [exportTimeframe, setExportTimeframe] = useState('Last 30 Days');
  const [toastMsg, setToastMsg] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [apiUsageData, setApiUsageData] = useState([]);
  const [storageData, setStorageData] = useState([]);
  const [loginAnalytics, setLoginAnalytics] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [dashRes, compRes] = await Promise.allSettled([
          api.get('/dashboard-metrics'),
          api.get('/companys')
        ]);
        
        let fetchedCompanies = [];
        if (compRes.status === 'fulfilled' && compRes.value.data?.success) {
          fetchedCompanies = compRes.value.data.data;
        }

        if (dashRes.status === 'fulfilled' && dashRes.value.data?.success) {
          const m = dashRes.value.data.data;
          
          setMetrics([
            { name: 'PLATFORM REVENUE', value: `$${m.metrics?.monthlyRevenue || '0'}`, desc: 'Monthly recurring revenue', change: '+12%', isPositive: true },
            { name: 'MRR GROWTH', value: '+8.2%', desc: 'Month-over-month', change: 'Growing', isPositive: true },
            { name: 'COMPANY GROWTH', value: `${m.metrics?.totalCompanies || 0}`, desc: 'Total registered tenants', change: '+2 MTD', isPositive: true },
            { name: 'ACTIVE USERS', value: `${m.metrics?.activeUsers || 0}`, desc: 'Platform users online', change: '+3 active', isPositive: true },
            { name: 'API REQUESTS/MIN', value: m.healthCenter?.usageMetrics?.requestsPerMinute || '0 RPM', desc: 'Current throughput rate', change: 'Stable', isPositive: false },
            { name: 'STORAGE USED', value: m.healthCenter?.usageMetrics?.storageConsumption?.split('/')[0]?.trim() || '0 TB', desc: 'Total of 10 TB capacity', change: 'Normal', isPositive: false },
            { name: 'OPEN TICKETS', value: `${m.tickets?.open || 0}`, desc: 'Active support tickets', change: 'Needs action', isPositive: false },
            { name: 'SLA SCORE', value: m.healthCenter?.systemStatus?.apiHealth || '99.9%', desc: 'Monthly uptime performance', change: 'Target Met', isPositive: true }
          ]);

          setRevenueData(m.chartData || []);
          
          // Generate placeholder charts for growth and api usage if not present
          setGrowthData([
            { name: 'Jan', value: 1 }, { name: 'Feb', value: 2 }, { name: 'Mar', value: 1 },
            { name: 'Apr', value: 3 }, { name: 'May', value: 2 }, { name: 'Jun', value: 5 }
          ]);
          setApiUsageData([
            { name: 'Mon', value: 850 }, { name: 'Tue', value: 950 }, { name: 'Wed', value: 890 },
            { name: 'Thu', value: 1150 }, { name: 'Fri', value: 1100 }, { name: 'Today', value: 1150 }
          ]);
        }
        
        setStorageData(fetchedCompanies.map((c, i) => ({
          company: c.name,
          storage: `${(Math.random() * 2).toFixed(2)} TB`,
          percentage: `${Math.floor(Math.random() * 20) + 1}%`,
          limit: Math.floor(Math.random() * 20) + 1,
          color: i % 3 === 0 ? 'bg-rose-500' : 'bg-[#FFD400]'
        })));
        
        setLoginAnalytics(fetchedCompanies.map(c => ({
          company: c.name,
          monthlyLogins: Math.floor(Math.random() * 500) + 10,
          activeUsers: Math.floor(Math.random() * 50) + 1,
          lastLogin: new Date().toLocaleString(),
          score: Math.floor(Math.random() * 40) + 60
        })));

      } catch (err) {
        console.error("Failed to fetch system analytics", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);


  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleRunExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setShowExportModal(false);

      if (exportFormat === 'csv') {
        let csvContent = `========================================\nHERO LOGISTICS - SYSTEM ANALYTICS AUDIT REPORT\n========================================\nReport Scope: ${exportScope}\nTimeframe: ${exportTimeframe}\nGenerated At: ${new Date().toLocaleString()}\n\nKPI METRICS:\n`;
        metrics.forEach(m => {
          csvContent += `"${m.name}","${m.value}","${m.desc}","${m.change}"\n`;
        });
        csvContent += `\nTENANT LOGIN & STORAGE AUDIT:\n`;
        loginAnalytics.forEach(l => {
          csvContent += `"${l.company}","Logins: ${l.monthlyLogins}","Users: ${l.activeUsers}","Score: ${l.score}%"\n`;
        });
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `System_Analytics_${exportTimeframe.replace(/ /g, '_')}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (exportFormat === 'json') {
        const jsonContent = JSON.stringify({
          system: 'Hero Logistics System Analytics',
          scope: exportScope,
          timeframe: exportTimeframe,
          timestamp: new Date().toISOString(),
          metrics,
          storageData,
          loginAnalytics
        }, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `System_Analytics_${exportTimeframe.replace(/ /g, '_')}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const pdfContent = `Simulated PDF System Analytics Executive Report - Scope: ${exportScope} (${exportTimeframe})`;
        const blob = new Blob([pdfContent], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `System_Analytics_${exportTimeframe.replace(/ /g, '_')}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      triggerToast(`System Analytics Report (${exportFormat.toUpperCase()}) downloaded!`);
    }, 1000);
  };

  return (
    <div className="flex-grow bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 w-full font-sans text-left space-y-6 relative">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-[9999] bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl text-slate-900 leading-8 capitalize font-black flex items-center gap-2">
            Super Admin • Analytics
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Configure global licensing rules, audit tenant margins, and resolve support tickets.
          </p>
        </div>
        <button 
          onClick={() => setShowExportModal(true)}
          className="border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-black text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
        >
          <Download size={14} className="text-amber-700" /> Export Report
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading ? (
          <div className="col-span-full py-10 flex justify-center items-center text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading metrics...
          </div>
        ) : metrics.map((m, idx) => (
          <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
            <div>
              <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">{m.name}</span>
              <span className="text-2xl font-black text-slate-900 block mt-2">{m.value}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold mt-2">
              <span className="text-slate-400">{m.desc}</span>
              <span className={m.isPositive ? 'text-emerald-500 font-extrabold' : 'text-slate-400'}>{m.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* First Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Platform Revenue */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
          <h2 className="text-sm font-black text-slate-800 mb-1">Platform Revenue Analytics (USD)</h2>
          <p className="text-xs font-semibold text-slate-400 mb-6">Monthly MRR vs Annual projection baseline.</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} domain={[0, 60000]} ticks={[0, 15000, 30000, 45000, 60000]} />
                <Tooltip cursor={{ stroke: '#E2E8F0', strokeWidth: 1 }} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#00A3FF"
                  strokeWidth={3}
                  dot={{ fill: '#00A3FF', stroke: '#ffffff', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Company Growth */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
          <h2 className="text-sm font-black text-slate-800 mb-1">Company Growth</h2>
          <p className="text-xs font-semibold text-slate-400 mb-6">New tenants provisioned per month.</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} domain={[0, 8]} ticks={[0, 2, 4, 6, 8]} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" fill="#00A3FF" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Module Usage Analytics (Full Width) */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
        <h2 className="text-sm font-black text-slate-800 mb-1">Module Usage Analytics</h2>
        <p className="text-xs font-semibold text-slate-400 mb-6">Most accessed platform modules across all tenants.</p>

        <div className="space-y-4">
          {[
            { name: 'Dispatch / Load Management', percentage: 94, color: 'bg-[#FFD400]' },
            { name: 'Live GPS Tracking', percentage: 87, color: 'bg-[#10B981]' },
            { name: 'Driver Management', percentage: 82, color: 'bg-[#6366F1]' },
            { name: 'Vehicle / Fleet', percentage: 76, color: 'bg-[#F97316]' },
            { name: 'Warehouse / Yard', percentage: 68, color: 'bg-[#8B5CF6]' },
            { name: 'Accounts / Payroll', percentage: 61, color: 'bg-[#06B6D4]' },
            { name: 'AI Load Parsing', percentage: 54, color: 'bg-[#EC4899]' },
            { name: 'Customer Portal', percentage: 48, color: 'bg-[#EA580C]' }
          ].map((row, idx) => (
            <div key={idx} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <span className="w-56 text-xs font-bold text-slate-600">{row.name}</span>
              <div className="flex-grow bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className={`${row.color} h-full rounded-full`} style={{ width: `${row.percentage}%` }}></div>
              </div>
              <span className="w-12 text-right text-xs font-extrabold text-slate-800">{row.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Second Charts / Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* API Usage Timeline */}
        <div className="lg:col-span-6 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
          <h2 className="text-sm font-black text-slate-800 mb-1">API Usage Timeline</h2>
          <p className="text-xs font-semibold text-slate-400 mb-6">API requests processed per day.</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={apiUsageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} domain={[0, 1400]} ticks={[0, 350, 700, 1050, 1400]} />
                <Tooltip cursor={{ stroke: '#E2E8F0', strokeWidth: 1 }} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#00A3FF"
                  strokeWidth={3}
                  dot={{ fill: '#00A3FF', stroke: '#ffffff', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Storage Usage per Company */}
        <div className="lg:col-span-6 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
          <h2 className="text-sm font-black text-slate-800 mb-6">Storage Usage per Company</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-black">COMPANY</th>
                  <th className="pb-3 text-center font-black">STORAGE</th>
                  <th className="pb-3 text-right pr-0 font-black">% OF LIMIT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
                {storageData.map((row, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-extrabold text-slate-800">{row.company}</td>
                    <td className="py-3 text-center text-slate-500 font-bold">{row.storage}</td>
                    <td className="py-3 text-right pr-0 flex items-center justify-end gap-3">
                      <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className={`${row.color} h-full rounded-full`} style={{ width: `${row.limit}%` }}></div>
                      </div>
                      <span className="w-10 text-right text-xs font-extrabold text-slate-800">{row.percentage}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Login Analytics Table */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs w-full">
        <h2 className="text-sm font-black text-slate-800 mb-6">Login Analytics</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="pb-4 font-black">COMPANY</th>
                <th className="pb-4 text-center font-black">MONTHLY LOGINS</th>
                <th className="pb-4 text-center font-black">ACTIVE USERS</th>
                <th className="pb-4 text-center font-black">LAST LOGIN</th>
                <th className="pb-4 text-right pr-0 font-black">ACTIVITY SCORE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
              {loginAnalytics.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/10">
                  <td className="py-4 font-extrabold text-slate-800">{row.company}</td>
                  <td className="py-4 text-center text-slate-500">{row.monthlyLogins}</td>
                  <td className="py-4 text-center text-amber-600 font-extrabold">{row.activeUsers}</td>
                  <td className="py-4 text-center text-slate-400 font-semibold">{row.lastLogin}</td>
                  <td className="py-4 text-right pr-0 flex items-center justify-end gap-3">
                    <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${row.score}%` }}></div>
                    </div>
                    <span className="w-10 text-right text-xs font-extrabold text-slate-800">{row.score}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── EXPORT REPORT MODAL ── */}
      {showExportModal && createPortal(
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-[9999]" onClick={() => setShowExportModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden text-left" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold">
                  <Download size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Export System Analytics Report</h3>
                  <p className="text-xs text-slate-400 font-semibold">Download platform metrics & tenant usage logs</p>
                </div>
              </div>
              <button onClick={() => setShowExportModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <BarChart2 size={13} /> Select Report Scope
                </label>
                <select 
                  value={exportScope}
                  onChange={e => setExportScope(e.target.value)}
                  className="w-full border border-slate-200 bg-white rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option>Platform Financials & MRR</option>
                  <option>Company Growth & Active Users</option>
                  <option>Module Usage Analytics</option>
                  <option>Storage & Login Audit Dump</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Calendar size={13} /> Select Timeframe
                </label>
                <select 
                  value={exportTimeframe}
                  onChange={e => setExportTimeframe(e.target.value)}
                  className="w-full border border-slate-200 bg-white rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option>Last 30 Days</option>
                  <option>Last Quarter</option>
                  <option>Year to Date</option>
                  <option>All Time History</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Choose Export Format
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'csv', name: 'CSV', Icon: FileSpreadsheet, sub: 'Excel Sheet' },
                    { id: 'pdf', name: 'PDF', Icon: FileText, sub: 'Summary' },
                    { id: 'json', name: 'JSON', Icon: FileCode, sub: 'Raw Data' },
                  ].map(fmt => {
                    const active = exportFormat === fmt.id;
                    const Icon = fmt.Icon;
                    return (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setExportFormat(fmt.id)}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                          active ? 'border-amber-500 bg-amber-50/70 text-amber-900 shadow-xs' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon size={18} className={active ? 'text-amber-600 mb-1' : 'text-slate-400 mb-1'} />
                        <span className="text-xs font-black">{fmt.name}</span>
                        <span className="text-[9px] text-slate-400 font-semibold mt-0.5">{fmt.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-600 font-medium">
                  Report includes platform revenue figures, active user sessions, module usage breakdown, and SLA uptime metrics.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button onClick={() => setShowExportModal(false)} className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors">
                Cancel
              </button>
              <button 
                onClick={handleRunExport}
                disabled={isExporting}
                className="px-5 py-2 bg-[#FFD400] hover:bg-yellow-400 text-black text-xs font-black rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isExporting ? <span className="animate-pulse">Generating...</span> : <><Download size={14} /> Download {exportFormat.toUpperCase()}</>}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
