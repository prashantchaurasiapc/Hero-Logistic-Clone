import React from 'react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function SystemAnalytics() {
  // KPI Metrics data
  const metrics = [
    { name: 'PLATFORM REVENUE', value: '$5,14,920', desc: 'Annual recurring revenue', change: '+12%', isPositive: true },
    { name: 'MRR GROWTH', value: '+8.2%', desc: 'Month-over-month', change: 'Growing', isPositive: true },
    { name: 'COMPANY GROWTH', value: '+5', desc: 'Total registered tenants', change: '+2 MTD', isPositive: true },
    { name: 'ACTIVE USERS', value: '118', desc: 'Platform users online', change: '+3 active', isPositive: true },
    { name: 'API REQUESTS/MIN', value: '1,250 RPM', desc: 'Current throughput rate', change: 'Stable', isPositive: false },
    { name: 'STORAGE USED', value: '4.78 TB', desc: 'Total of 10 TB capacity', change: 'Normal', isPositive: false },
    { name: 'LOGIN EVENTS', value: '70', desc: 'User sessions (30 days)', change: '+5%', isPositive: true },
    { name: 'SLA SCORE', value: '99.98%', desc: 'Monthly uptime performance', change: 'Target Met', isPositive: true }
  ];

  // Platform Revenue Line Chart Data
  const revenueData = [
    { name: 'Jan', value: 0 },
    { name: 'Feb', value: 28000 },
    { name: 'Mar', value: 28000 },
    { name: 'Apr', value: 30000 },
    { name: 'May', value: 30000 },
    { name: 'Jun', value: 43000 }
  ];

  // Company Growth Bar Chart Data
  const growthData = [
    { name: 'Jan', value: 1 },
    { name: 'Feb', value: 2 },
    { name: 'Mar', value: 1 },
    { name: 'Apr', value: 3 },
    { name: 'May', value: 2 },
    { name: 'Jun', value: 5 }
  ];

  // API Usage Timeline Line Chart Data
  const apiUsageData = [
    { name: 'Mon', value: 850 },
    { name: 'Tue', value: 950 },
    { name: 'Wed', value: 890 },
    { name: 'Thu', value: 1150 },
    { name: 'Fri', value: 1100 },
    { name: 'Today', value: 1150 }
  ];

  // Storage usage table data
  const storageData = [
    { company: 'Falcon Logistics LLC', storage: 'NaN TB', percentage: 'NaN%', limit: 100, color: 'bg-amber-400' },
    { company: 'Swift Cargo Express', storage: '0.10 TB', percentage: '10%', limit: 10, color: 'bg-amber-400' },
    { company: 'Global Shipping Solutions', storage: '3.31 TB', percentage: '100%', limit: 100, color: 'bg-rose-500' },
    { company: 'Texas Hotshot Carriers', storage: '0.11 TB', percentage: '11%', limit: 11, color: 'bg-amber-400' },
    { company: 'Apex Logistics LLC', storage: '0.44 TB', percentage: '44%', limit: 44, color: 'bg-amber-400' }
  ];

  // Login analytics table data
  const loginAnalytics = [
    { company: 'Falcon Logistics LLC', monthlyLogins: 168, activeUsers: 12, lastLogin: 'Today, 02:15 PM', score: 70 },
    { company: 'Swift Cargo Express', monthlyLogins: 30, activeUsers: 2, lastLogin: 'Yesterday, 04:30 PM', score: 75 },
    { company: 'Global Shipping Solutions', monthlyLogins: 1180, activeUsers: 84, lastLogin: 'Today, 03:24 PM', score: 80 },
    { company: 'Texas Hotshot Carriers', monthlyLogins: 62, activeUsers: 4, lastLogin: 'Yesterday, 10:15 AM', score: 85 },
    { company: 'Apex Logistics LLC', monthlyLogins: 232, activeUsers: 16, lastLogin: 'Today, 01:10 PM', score: 90 }
  ];

  return (
    <div className="flex-grow bg-[#F8FAFC] p-6 w-full font-sans text-left space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">
            Super Admin • Analytics
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Configure global licensing rules, audit tenant margins, and resolve support tickets.
          </p>
        </div>
        <button className="border border-slate-200 bg-white hover:bg-slate-50 text-yellow-500 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors">
          Export Report
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
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
                        {row.percentage !== 'NaN%' ? (
                          <div className={`${row.color} h-full rounded-full`} style={{ width: `${row.limit}%` }}></div>
                        ) : (
                          <div className="bg-[#FFD400] h-full rounded-full" style={{ width: '100%' }}></div>
                        )}
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
              <tr className="border-b border-slate-150 text-[10px] font-black text-slate-400 uppercase tracking-wider">
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
                  <td className="py-4 text-center text-yellow-500 font-extrabold">{row.activeUsers}</td>
                  <td className="py-4 text-center text-slate-400 font-semibold">{row.lastLogin}</td>
                  <td className="py-4 text-right pr-0 flex items-center justify-end gap-3">
                    <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#10B981] h-full rounded-full" style={{ width: `${row.score}%` }}></div>
                    </div>
                    <span className="w-10 text-right text-xs font-extrabold text-slate-800">{row.score}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
