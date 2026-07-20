import React, { useState } from 'react';
import {
  Plus, AlertCircle, RefreshCw, UserCheck, Pen, Hexagon, Check, XSquare, Settings, Square, FileText, X
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function SuperAdminDashboard() {
  // KPI Data
  const kpis = [
    { title: 'ACTIVE COMPANIES', value: '4', desc: 'SaaS instances online', status: 'Stable', statusColor: 'text-slate-400 bg-slate-100' },
    { title: 'TRIAL COMPANIES', value: '2', desc: 'SaaS trial instances', status: '+1 mo', statusColor: 'text-emerald-500 bg-emerald-50' },
    { title: 'PAID COMPANIES', value: '3', desc: 'Subscribed paying contracts', status: 'Stable', statusColor: 'text-slate-400 bg-slate-100' },
    { title: 'MONTHLY REVENUE', value: '$42,910', desc: 'Platform cash stream baseline', status: '+4%', statusColor: 'text-emerald-500 bg-emerald-50' },
    { title: 'FAILED PAYMENTS', value: '1', desc: 'Payment gateway errors', status: '0 alerts', statusColor: 'text-slate-400 bg-slate-100' },
    { title: 'SUPPORT TICKETS', value: '2', desc: 'Requires administrative response', status: 'Alert', statusColor: 'text-rose-500 bg-rose-50' },
    { title: 'ACTIVE USERS', value: '118', desc: 'Active platform users pool', status: '+3 active', statusColor: 'text-emerald-500 bg-emerald-50' },
    { title: 'PLATFORM USAGE', value: '14.2%', desc: 'AWS node limits', status: 'Stable', statusColor: 'text-slate-400 bg-slate-100' },
  ];

  // Chart Data
  const chartData = [
    { name: 'Jan', mrr: 0 },
    { name: 'Feb', mrr: 28000 },
    { name: 'Mar', mrr: 28000 },
    { name: 'Apr', mrr: 30000 },
    { name: 'May', mrr: 30000 },
    { name: 'Jun', mrr: 43000 },
  ];

  // Recent Tenants Data matching Image 2
  const recentTenants = [
    { id: 1, name: 'Falcon Logistics LLC', plan: 'Professional', status: 'ACTIVE', users: '12', mrr: '$8,500', trialExpiry: 'N/A', lastActive: 'Today, 02:15 PM' },
    { id: 2, name: 'Swift Cargo Express', plan: 'Professional', status: 'ACTIVE', users: '2', mrr: '$499', trialExpiry: '07/15/2026', lastActive: 'Yesterday, 04:30 PM' },
    { id: 3, name: 'Apex Logistics LLC', plan: 'Enterprise', status: 'ACTIVE', users: '45', mrr: '$12,500', trialExpiry: 'N/A', lastActive: 'Today, 10:23 AM' },
    { id: 4, name: 'Blue Sky Shipping', plan: 'Starter', status: 'SUSPENDED', users: '6', mrr: '$3,800', trialExpiry: '03 Feb 2025', lastActive: '03 Feb 2025' },
    { id: 5, name: 'Logistics LLC', plan: 'Professional', status: 'ACTIVE', users: '16', mrr: '$4,910', trialExpiry: 'N/A', lastActive: 'Today, 01:10 PM' },
  ];

  // Density and Columns states
  const [density, setDensity] = useState('DEFAULT');
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    companyName: true,
    subscriptionPlan: true,
    status: true,
    activeUsers: true,
    monthlyRevenue: true,
    trialExpiry: true,
    lastLogin: true,
  });

  const columnsMenuRef = React.useRef(null);
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (columnsMenuRef.current && !columnsMenuRef.current.contains(event.target)) {
        setShowColumnsMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [showChangeSubModal, setShowChangeSubModal] = useState(false);
  const [showOpenTicketModal, setShowOpenTicketModal] = useState(false);
  const [showAssignTicketModal, setShowAssignTicketModal] = useState(false);
  const [showResolveTicketModal, setShowResolveTicketModal] = useState(false);
  const [showRenewSubModal, setShowRenewSubModal] = useState(false);
  const [showUpgradeSubModal, setShowUpgradeSubModal] = useState(false);

  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [showSuspendCompanyModal, setShowSuspendCompanyModal] = useState(false);
  const [showReactivateCompanyModal, setShowReactivateCompanyModal] = useState(false);
  const [showLoginAsModal, setShowLoginAsModal] = useState(false);

  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [showEditPlanModal, setShowEditPlanModal] = useState(false);
  const [showEnableFeatureModal, setShowEnableFeatureModal] = useState(false);
  const [showDisableFeatureModal, setShowDisableFeatureModal] = useState(false);
  const [showWhiteLabelModal, setShowWhiteLabelModal] = useState(false);

  const [tenantName, setTenantName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [managerPassword, setManagerPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('Professional Tier');

  const handleProvisionTenant = (e) => {
    e.preventDefault();
    setShowAddCompanyModal(false);
  };

  const [selectedCompany, setSelectedCompany] = useState('Falcon Logistics LLC');
  const [selectedPlanTier, setSelectedPlanTier] = useState('Professional Tier - $499/mo');

  const getDensityPadding = () => {
    if (density === 'COMPACT') return 'py-2.5 px-4';
    if (density === 'RELAXED') return 'py-7 px-6';
    return 'py-5 px-4'; // DEFAULT
  };

  return (
    <div className="flex-grow bg-[#F1F5F9] p-6 space-y-6 overflow-y-auto w-full text-left font-sans relative custom-scrollbar">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl text-slate-900 leading-8 capitalize font-black flex items-center gap-2">
            Super Admin <span className="text-slate-400 text-xl mx-1">•</span> Overview
          </h1>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">
            Configure global licensing rules, audit tenant margins, and resolve support tickets.
          </p>
        </div>
        <button className="mt-4 sm:mt-0 text-[13px] font-bold text-[#D97706] border border-amber-200 hover:bg-amber-50 px-6 py-2.5 rounded-xl transition-colors">
          Export Report
        </button>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">{kpi.title}</span>
              <span className="text-2xl font-black text-slate-800 block mt-1.5">{kpi.value}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">{kpi.desc}</span>
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md shrink-0 ${kpi.statusColor}`}>{kpi.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">

        {/* Left Column (Chart & Table) */}
        <div className="lg:col-span-2 space-y-8 min-w-0">

          {/* MRR Revenue Timeline */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h3 className="text-[15px] font-extrabold text-slate-900 mb-8">MRR Revenue Timeline (USD)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                    dy={15}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                    ticks={[0, 15000, 30000, 45000, 60000]}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [`$${value.toLocaleString()}`, 'MRR']}
                  />
                  <Line
                    type="monotone"
                    dataKey="mrr"
                    stroke="#0EA5E9"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#0EA5E9' }}
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#0EA5E9' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Companies Table (Recent Tenants) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-left">
                <h3 className="text-[15px] font-extrabold text-slate-900">Tenant Overview</h3>
                <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Live summary of platform subscriber performance.</p>
              </div>

              <div className="flex items-center gap-4">
                {/* Density Selector */}
                <div className="bg-slate-100 p-0.5 rounded-xl flex gap-0.5 border border-slate-200">
                  {['COMPACT', 'DEFAULT', 'RELAXED'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setDensity(mode)}
                      className={`px-3 py-1.5 text-[9px] font-black rounded-lg transition-all cursor-pointer ${density === mode
                        ? 'bg-[#FFD400] text-black shadow-xs font-black'
                        : 'text-black hover:bg-slate-200/50'
                        }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                {/* Columns Visibility Checklist Button */}
                <div className="relative text-left" ref={columnsMenuRef}>
                  <button
                    onClick={() => setShowColumnsMenu(!showColumnsMenu)}
                    className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-[11px] px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                    <span>COLUMNS</span>
                  </button>

                  {showColumnsMenu && (
                    <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 space-y-1.5 text-left text-xs text-slate-700 font-bold max-h-60 overflow-y-auto">
                      <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100 mb-1.5">COLUMN VISIBILITY</span>

                      <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                        <input
                          type="checkbox"
                          checked={visibleColumns.companyName}
                          onChange={() => setVisibleColumns(prev => ({ ...prev, companyName: !prev.companyName }))}
                          className="w-3.5 h-3.5 text-[#FFD400] rounded focus:ring-0 cursor-pointer"
                        />
                        <span>Company Name</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                        <input
                          type="checkbox"
                          checked={visibleColumns.subscriptionPlan}
                          onChange={() => setVisibleColumns(prev => ({ ...prev, subscriptionPlan: !prev.subscriptionPlan }))}
                          className="w-3.5 h-3.5 text-[#FFD400] rounded focus:ring-0 cursor-pointer"
                        />
                        <span>Subscription Plan</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                        <input
                          type="checkbox"
                          checked={visibleColumns.status}
                          onChange={() => setVisibleColumns(prev => ({ ...prev, status: !prev.status }))}
                          className="w-3.5 h-3.5 text-[#FFD400] rounded focus:ring-0 cursor-pointer"
                        />
                        <span>Status</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                        <input
                          type="checkbox"
                          checked={visibleColumns.activeUsers}
                          onChange={() => setVisibleColumns(prev => ({ ...prev, activeUsers: !prev.activeUsers }))}
                          className="w-3.5 h-3.5 text-[#FFD400] rounded focus:ring-0 cursor-pointer"
                        />
                        <span>Active Users</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                        <input
                          type="checkbox"
                          checked={visibleColumns.monthlyRevenue}
                          onChange={() => setVisibleColumns(prev => ({ ...prev, monthlyRevenue: !prev.monthlyRevenue }))}
                          className="w-3.5 h-3.5 text-[#FFD400] rounded focus:ring-0 cursor-pointer"
                        />
                        <span>Monthly Revenue</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                        <input
                          type="checkbox"
                          checked={visibleColumns.trialExpiry}
                          onChange={() => setVisibleColumns(prev => ({ ...prev, trialExpiry: !prev.trialExpiry }))}
                          className="w-3.5 h-3.5 text-[#FFD400] rounded focus:ring-0 cursor-pointer"
                        />
                        <span>Trial Expiry</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                        <input
                          type="checkbox"
                          checked={visibleColumns.lastLogin}
                          onChange={() => setVisibleColumns(prev => ({ ...prev, lastLogin: !prev.lastLogin }))}
                          className="w-3.5 h-3.5 text-[#FFD400] rounded focus:ring-0 cursor-pointer"
                        />
                        <span>Last Login</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead className="hidden lg:table-header-group">
                  <tr className="border-b border-slate-100">
                    <th className="py-4 px-6 w-10">
                      <input type="checkbox" className="w-4 h-4 text-[#FFD400] rounded focus:ring-0 cursor-pointer" />
                    </th>
                    {visibleColumns.companyName && <th className="py-4 px-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">COMPANY</th>}
                    {visibleColumns.subscriptionPlan && <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">SUBSCRIPTION PLAN</th>}
                    {visibleColumns.status && <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">STATUS</th>}
                    {visibleColumns.activeUsers && <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">ACTIVE USERS</th>}
                    {visibleColumns.monthlyRevenue && <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">MONTHLY REVENUE</th>}
                    {visibleColumns.trialExpiry && <th className="py-4 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">TRIAL EXPIRY</th>}
                    {visibleColumns.lastLogin && <th className="py-4 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">LAST LOGIN</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 block lg:table-row-group">
                  {recentTenants.map((tenant) => (
                    <tr key={tenant.id} className="block lg:table-row hover:bg-slate-50/50 transition-colors border-b border-slate-100 lg:border-none p-4 lg:p-0 space-y-3 lg:space-y-0 relative">
                      <td className={`block lg:table-cell ${getDensityPadding()} lg:px-6`}>
                        <span className="lg:hidden text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">SELECT</span>
                        <input type="checkbox" className="w-4 h-4 text-[#FFD400] rounded focus:ring-0 cursor-pointer" />
                      </td>
                      {visibleColumns.companyName && (
                        <td className={`block lg:table-cell ${getDensityPadding()} lg:px-2`}>
                          <span className="lg:hidden text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">COMPANY</span>
                          <span className="font-bold text-slate-900 text-[13px]">{tenant.name}</span>
                        </td>
                      )}
                      {visibleColumns.subscriptionPlan && (
                        <td className={`block lg:table-cell ${getDensityPadding()} lg:px-4`}>
                          <span className="lg:hidden text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">SUBSCRIPTION PLAN</span>
                          <span className="text-[13px] font-semibold text-slate-600">{tenant.plan}</span>
                        </td>
                      )}
                      {visibleColumns.status && (
                        <td className={`block lg:table-cell ${getDensityPadding()} lg:px-4`}>
                          <span className="lg:hidden text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">STATUS</span>
                          <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${tenant.status === 'ACTIVE'
                            ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                            : 'text-rose-700 bg-rose-50 border border-rose-200'
                            }`}>
                            {tenant.status}
                          </span>
                        </td>
                      )}
                      {visibleColumns.activeUsers && (
                        <td className={`block lg:table-cell ${getDensityPadding()} lg:px-4`}>
                          <span className="lg:hidden text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">ACTIVE USERS</span>
                          <span className="text-[13px] font-bold text-slate-700">{tenant.users}</span>
                        </td>
                      )}
                      {visibleColumns.monthlyRevenue && (
                        <td className={`block lg:table-cell ${getDensityPadding()} lg:px-4`}>
                          <span className="lg:hidden text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">MONTHLY REVENUE</span>
                          <span className="text-[13px] font-bold text-[#10B981]">{tenant.mrr}</span>
                        </td>
                      )}
                      {visibleColumns.trialExpiry && (
                        <td className={`block lg:table-cell ${getDensityPadding()} lg:px-4`}>
                          <span className="lg:hidden text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">TRIAL EXPIRY</span>
                          <span className="text-[13px] font-medium text-slate-500">{tenant.trialExpiry}</span>
                        </td>
                      )}
                      {visibleColumns.lastLogin && (
                        <td className={`block lg:table-cell ${getDensityPadding()} lg:px-6`}>
                          <span className="lg:hidden text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">LAST LOGIN</span>
                          <span className="text-[12px] font-medium text-slate-500">{tenant.lastActive}</span>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (Widgets) */}
        <div className="space-y-8">

          {/* Platform Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h3 className="text-[15px] font-extrabold text-slate-900 mb-1">Platform Actions</h3>
            <p className="text-[11px] font-medium text-slate-400 mb-8">Quick administrative platform workflows.</p>

            <div className="grid grid-cols-2 gap-3.5">
              <button onClick={() => setShowAddCompanyModal(true)} className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 shadow-md shadow-orange-500/30 text-slate-900 hover:scale-[1.02] font-bold text-[10px] py-2.5 px-3 rounded-2xl transition-all cursor-pointer">
                <Plus className="w-3 h-3" /> Add Company
              </button>
              <button onClick={() => setShowSuspendCompanyModal(true)} className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-rose-600 shadow-md shadow-rose-500/30 text-slate-900 hover:scale-[1.02] font-bold text-[10px] py-2.5 px-3 rounded-2xl transition-all cursor-pointer">
                <AlertCircle className="w-3 h-3" /> Suspend Company
              </button>
              <button onClick={() => setShowReactivateCompanyModal(true)} className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/30 text-slate-900 hover:scale-[1.02] font-bold text-[10px] py-2.5 px-3 rounded-2xl transition-all cursor-pointer">
                <RefreshCw className="w-3 h-3" /> Reactivate Company
              </button>
              <button onClick={() => setShowLoginAsModal(true)} className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-400 to-blue-600 shadow-md shadow-blue-500/30 text-slate-900 hover:scale-[1.02] font-bold text-[10px] py-2.5 px-3 rounded-2xl transition-all cursor-pointer">
                <UserCheck className="w-3 h-3" /> Login As Company
              </button>
              <button onClick={() => setShowCreatePlanModal(true)} className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 shadow-md shadow-orange-500/30 text-slate-900 hover:scale-[1.02] font-bold text-[10px] py-2.5 px-3 rounded-2xl transition-all cursor-pointer">
                <Plus className="w-3 h-3" /> Create Plan
              </button>
              <button onClick={() => setShowEditPlanModal(true)} className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-400 to-blue-600 shadow-md shadow-blue-500/30 text-slate-900 hover:scale-[1.02] font-bold text-[10px] py-2.5 px-3 rounded-2xl transition-all cursor-pointer">
                <Pen className="w-3 h-3" /> Edit Plan
              </button>
              <button onClick={() => setShowChangeSubModal(true)} className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-100 shadow-md shadow-purple-500/30 text-slate-900 hover:scale-[1.02] font-bold text-[10px] py-2.5 px-3 rounded-2xl transition-all cursor-pointer">
                <Hexagon className="w-3 h-3" /> Change Sub
              </button>
              <button onClick={() => setShowEnableFeatureModal(true)} className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/30 text-slate-900 hover:scale-[1.02] font-bold text-[10px] py-2.5 px-3 rounded-2xl transition-all cursor-pointer">
                <Check className="w-3 h-3" /> Enable Feature
              </button>
              <button onClick={() => setShowDisableFeatureModal(true)} className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-rose-600 shadow-md shadow-rose-500/30 text-slate-900 hover:scale-[1.02] font-bold text-[10px] py-2.5 px-3 rounded-2xl transition-all cursor-pointer">
                <XSquare className="w-3 h-3" /> Disable Feature
              </button>
              <button onClick={() => setShowWhiteLabelModal(true)} className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-100 shadow-md shadow-purple-500/30 text-slate-900 hover:scale-[1.02] font-bold text-[10px] py-2.5 px-3 rounded-2xl transition-all cursor-pointer">
                <Settings className="w-3 h-3" /> White Label
              </button>

              <button
                onClick={() => {
                  const alertDiv = document.createElement('div');
                  alertDiv.className = 'fixed bottom-4 right-4 bg-emerald-550 text-white font-bold px-6 py-3 rounded-xl shadow-lg z-[999] animate-bounce';
                  alertDiv.innerText = 'Export generated successfully';
                  document.body.appendChild(alertDiv);
                  setTimeout(() => alertDiv.remove(), 3000);
                }}
                className="col-span-2 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 shadow-md shadow-orange-500/30 hover:scale-[1.01] text-slate-900 font-extrabold text-[11px] py-2.5 px-4 rounded-2xl transition-all cursor-pointer mt-2"
              >
                <FileText className="w-3 h-3" /> Export Report
              </button>
            </div>
          </div>

          {/* Platform Health Center */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h3 className="text-[15px] font-extrabold text-slate-900 mb-1">Platform Health Center</h3>
            <p className="text-[11px] font-medium text-slate-400 mb-6">Live platform status & system metrics.</p>

            <div className="space-y-4 mb-8">
              <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">SYSTEM STATUS</h4>
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-semibold text-slate-500">API Health</span>
                <span className="text-[12px] font-bold text-[#10B981] flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div> 99.98%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-semibold text-slate-500">Database Health</span>
                <span className="text-[12px] font-bold text-[#10B981] flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div> Synced</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-semibold text-slate-500">Storage Health</span>
                <span className="text-[12px] font-bold text-[#10B981] flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div> 52.3% Free</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-semibold text-slate-500">Queue Health</span>
                <span className="text-[12px] font-bold text-[#10B981] flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div> 0 pending</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-semibold text-slate-500">AI Processing Health</span>
                <span className="text-[12px] font-bold text-[#10B981] flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div> Active</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">USAGE METRICS</h4>
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-semibold text-slate-500">Active Sessions</span>
                <span className="text-[12px] font-black text-slate-900">42 active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-semibold text-slate-500">Requests Per Minute</span>
                <span className="text-[12px] font-black text-slate-900">1,250 RPM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-semibold text-slate-500">Storage Consumption</span>
                <span className="text-[12px] font-black text-slate-900">4.78 TB / 10 TB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-semibold text-slate-500">AI Jobs Processed</span>
                <span className="text-[12px] font-black text-slate-900">14,050 runs</span>
              </div>
            </div>
          </div>

          {/* Ticket Widget */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="border border-slate-100 rounded-xl p-4 text-center">
                <div className="text-[10px] font-bold text-slate-500 mb-1">Open Tickets</div>
                <div className="text-xl font-black text-amber-500">2</div>
              </div>
              <div className="border border-slate-100 rounded-xl p-4 text-center">
                <div className="text-[10px] font-bold text-slate-500 mb-1">High Priority</div>
                <div className="text-xl font-black text-rose-500">1</div>
              </div>
              <div className="border border-slate-100 rounded-xl p-4 text-center">
                <div className="text-[10px] font-bold text-slate-500 mb-1">Waiting Customer</div>
                <div className="text-xl font-black text-blue-500">1</div>
              </div>
              <div className="border border-slate-100 rounded-xl p-4 text-center">
                <div className="text-[10px] font-bold text-slate-500 mb-1">Waiting Internal</div>
                <div className="text-xl font-black text-purple-500">1</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => setShowOpenTicketModal(true)} className="bg-[#FFD400] text-slate-900 hover:bg-[#F0C800] font-bold text-[11px] py-3 rounded-xl transition-all shadow-sm cursor-pointer">
                Open Ticket
              </button>
              <button onClick={() => setShowAssignTicketModal(true)} className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 font-bold text-[11px] py-3 rounded-xl transition-all shadow-sm cursor-pointer">
                Assign Ticket
              </button>
              <button onClick={() => setShowResolveTicketModal(true)} className="bg-[#10B981] text-white hover:bg-[#059669] font-bold text-[11px] py-3 rounded-xl transition-all shadow-sm cursor-pointer">
                Resolve Ticket
              </button>
            </div>
          </div>

          {/* Subscription Monitoring */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h3 className="text-[15px] font-extrabold text-slate-900 mb-1">Subscription Monitoring</h3>
            <p className="text-[11px] font-medium text-slate-400 mb-6">Monitor plans lifecycle metrics.</p>

            <div className="space-y-4 mb-8 text-left">
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-semibold text-slate-500">Active Plans</span>
                <span className="text-[12px] font-black text-slate-900">4 active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-semibold text-slate-500">Expiring This Month</span>
                <span className="text-[12px] font-black text-amber-500">1 plan</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-semibold text-slate-500">Overdue Payments</span>
                <span className="text-[12px] font-black text-[#10B981]">0 overdue</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-semibold text-slate-500">Upgrade Opportunities</span>
                <span className="text-[12px] font-black text-amber-500">2 accounts</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => setShowChangeSubModal(true)} className="bg-[#FFD400] text-slate-900 hover:bg-[#F0C800] font-bold text-[11px] py-3 rounded-xl transition-all shadow-sm cursor-pointer">
                Change Sub
              </button>
              <button onClick={() => setShowRenewSubModal(true)} className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 font-bold text-[11px] py-3 rounded-xl transition-all shadow-sm cursor-pointer">
                Renew
              </button>
              <button onClick={() => setShowUpgradeSubModal(true)} className="bg-[#10B981] text-white hover:bg-[#059669] font-bold text-[11px] py-3 rounded-xl transition-all shadow-sm cursor-pointer">
                Upgrade
              </button>
            </div>
          </div>

          {/* Recent Platform Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-left">
            <h3 className="text-[15px] font-extrabold text-slate-900 mb-1">Recent Platform Activity</h3>
            <p className="text-[11px] font-medium text-slate-400 mb-6">Real-time SaaS system administrative actions audit feed.</p>

            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-5">
                <p className="text-[12px] font-bold text-slate-700 leading-relaxed mb-2">
                  Company Created: Falcon Logistics LLC provisioned on Professional Plan. (Falcon Logistics LLC)
                </p>
                <p className="text-[9px] font-bold text-slate-400 tracking-wider">06/24/2026, 02:12:15 PM</p>
              </div>
              <div>
                <p className="text-[12px] font-bold text-slate-700 leading-relaxed mb-2">
                  Plan Changed: Swift Cargo Express upgraded to Professional Tier. (Swift Cargo Express)
                </p>
                <p className="text-[9px] font-bold text-slate-400 tracking-wider">06/24/2026, 12:45:00 PM</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Change Subscription Plan Modal */}
      {showChangeSubModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-[24px] w-full max-w-[400px] shadow-2xl overflow-hidden border border-slate-100">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-base font-extrabold text-slate-900">Change Subscription Plan</h3>
              <button
                onClick={() => setShowChangeSubModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div className="space-y-2 text-left">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">SELECT COMPANY WORKSPACE</label>
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#FFD400] text-sm font-bold rounded-xl focus:outline-none text-slate-800 cursor-pointer"
                >
                  <option value="Falcon Logistics LLC">Falcon Logistics LLC</option>
                  <option value="Swift Cargo Express">Swift Cargo Express</option>
                  <option value="Apex Logistics LLC">Apex Logistics LLC</option>
                  <option value="Blue Sky Shipping">Blue Sky Shipping</option>
                </select>
              </div>

              <div className="space-y-2 text-left">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">SELECT NEW SUBSCRIPTION PLAN TIER</label>
                <select
                  value={selectedPlanTier}
                  onChange={(e) => setSelectedPlanTier(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#FFD400] text-sm font-bold rounded-xl focus:outline-none text-slate-800 cursor-pointer"
                >
                  <option value="Starter Tier - $99/mo">Starter Tier - $99/mo</option>
                  <option value="Professional Tier - $499/mo">Professional Tier - $499/mo</option>
                  <option value="Enterprise Tier - $999/mo">Enterprise Tier - $999/mo</option>
                </select>
              </div>

              <button
                onClick={() => setShowChangeSubModal(false)}
                className="w-full py-3.5 bg-gradient-to-r from-[#FFD400] to-[#FFB300] hover:from-[#F0C800] hover:to-[#FFA000] text-slate-900 font-extrabold text-xs rounded-xl transition-all shadow-sm mt-4 cursor-pointer"
              >
                Update Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Open Support Ticket Modal */}
      {showOpenTicketModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-[24px] w-full max-w-[480px] shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-base font-extrabold text-slate-900">Open Support Ticket</h3>
              <button onClick={() => setShowOpenTicketModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2 text-left">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">TENANT COMPANY</label>
                <select className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#FFD400] text-sm font-bold rounded-xl focus:outline-none text-slate-800 cursor-pointer">
                  <option>Falcon Logistics LLC</option>
                  <option>Swift Cargo Express</option>
                  <option>Apex Logistics LLC</option>
                  <option>Blue Sky Shipping</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">CATEGORY</label>
                  <select className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#FFD400] text-sm font-bold rounded-xl focus:outline-none text-slate-800 cursor-pointer">
                    <option>General / Platform</option>
                    <option>Billing / Payment</option>
                    <option>Technical / Bug</option>
                    <option>Feature Request</option>
                  </select>
                </div>
                <div className="space-y-2 text-left">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">PRIORITY</label>
                  <select className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#FFD400] text-sm font-bold rounded-xl focus:outline-none text-slate-800 cursor-pointer">
                    <option>Medium</option>
                    <option>Low</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 text-left">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">SUBJECT HEADING</label>
                <input type="text" placeholder="e.g. GPS Geofencing synchronization error" className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#FFD400] text-sm font-medium rounded-xl focus:outline-none text-slate-800 placeholder:text-slate-300" />
              </div>
              <div className="space-y-2 text-left">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">DETAILED MESSAGE PAYLOAD</label>
                <textarea rows={4} placeholder="Describe the issue or request in detail..." className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#FFD400] text-sm font-medium rounded-xl focus:outline-none text-slate-800 resize-y placeholder:text-slate-300" />
              </div>
              <button
                onClick={() => setShowOpenTicketModal(false)}
                className="w-full py-3.5 bg-gradient-to-r from-[#FFD400] to-[#FFB300] hover:from-[#F0C800] hover:to-[#FFA000] text-slate-900 font-extrabold text-xs rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Open Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Support Ticket Modal */}
      {showAssignTicketModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-[24px] w-full max-w-[480px] shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-base font-extrabold text-slate-900">Assign Support Ticket</h3>
              <button onClick={() => setShowAssignTicketModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2 text-left">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">SELECT OPEN TICKET</label>
                <select className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#FFD400] text-sm font-bold rounded-xl focus:outline-none text-slate-800 cursor-pointer">
                  <option>#1 - Invoice Factoring Delay (Falcon Logistics LLC)</option>
                  <option>#2 - GPS Sync Issue (Swift Cargo Express)</option>
                </select>
              </div>
              <div className="space-y-2 text-left">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">SUPPORT ASSIGNEE TIER</label>
                <select className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#FFD400] text-sm font-bold rounded-xl focus:outline-none text-slate-800 cursor-pointer">
                  <option>L2 Senior Specialist</option>
                  <option>L1 Support Agent</option>
                  <option>L3 Engineering</option>
                </select>
              </div>
              <button
                onClick={() => setShowAssignTicketModal(false)}
                className="w-full py-3.5 bg-gradient-to-r from-[#FFD400] to-[#FFB300] hover:from-[#F0C800] hover:to-[#FFA000] text-slate-900 font-extrabold text-xs rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Save Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Support Ticket Modal */}
      {showResolveTicketModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-[24px] w-full max-w-[480px] shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-base font-extrabold text-slate-900">Resolve Support Ticket</h3>
              <button onClick={() => setShowResolveTicketModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2 text-left">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">SELECT TICKET TO RESOLVE</label>
                <select className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#FFD400] text-sm font-bold rounded-xl focus:outline-none text-slate-800 cursor-pointer">
                  <option>#1 - Invoice Factoring Delay (Falcon Logistics LLC)</option>
                  <option>#2 - GPS Sync Issue (Swift Cargo Express)</option>
                </select>
              </div>
              <div className="space-y-2 text-left">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">RESOLUTION NOTE (OPTIONAL)</label>
                <textarea rows={4} placeholder="Provide summary of resolution or notes for the customer..." className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#FFD400] text-sm font-medium rounded-xl focus:outline-none text-slate-800 resize-y placeholder:text-slate-300" />
              </div>
              <button
                onClick={() => setShowResolveTicketModal(false)}
                className="w-full py-3.5 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-extrabold text-xs rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Mark Ticket Resolved
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Renew Subscription Plan Modal */}
      {showRenewSubModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-[24px] w-full max-w-[480px] shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-base font-extrabold text-slate-900">Renew Subscription Plan</h3>
              <button onClick={() => setShowRenewSubModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2 text-left">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">SELECT TENANT COMPANY</label>
                <select className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#FFD400] text-sm font-bold rounded-xl focus:outline-none text-slate-800 cursor-pointer">
                  <option>Falcon Logistics LLC</option>
                  <option>Swift Cargo Express</option>
                  <option>Apex Logistics LLC</option>
                  <option>Blue Sky Shipping</option>
                </select>
              </div>
              <button
                onClick={() => setShowRenewSubModal(false)}
                className="w-full py-3.5 bg-gradient-to-r from-[#FFD400] to-[#FFB300] hover:from-[#F0C800] hover:to-[#FFA000] text-slate-900 font-extrabold text-xs rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Renew License Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Subscription Plan Modal */}
      {showUpgradeSubModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-[24px] w-full max-w-[480px] shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-base font-extrabold text-slate-900">Upgrade Subscription Plan</h3>
              <button onClick={() => setShowUpgradeSubModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2 text-left">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">SELECT TENANT COMPANY</label>
                <select className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#FFD400] text-sm font-bold rounded-xl focus:outline-none text-slate-800 cursor-pointer">
                  <option>Falcon Logistics LLC (Current: Professional)</option>
                  <option>Swift Cargo Express (Current: Professional)</option>
                  <option>Apex Logistics LLC (Current: Enterprise)</option>
                  <option>Blue Sky Shipping (Current: Starter)</option>
                </select>
              </div>
              <div className="space-y-2 text-left">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">UPGRADE TARGET TIER PLAN</label>
                <select className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#FFD400] text-sm font-bold rounded-xl focus:outline-none text-slate-800 cursor-pointer">
                  <option>Enterprise Tier - $1,299/mo</option>
                  <option>Professional Tier - $499/mo</option>
                  <option>Premium Tier - $2,499/mo</option>
                </select>
              </div>
              <button
                onClick={() => setShowUpgradeSubModal(false)}
                className="w-full py-3.5 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-extrabold text-xs rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Perform Plan Upgrade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Provision New SaaS Tenant Modal */}
      {showAddCompanyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-[420px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800">Provision New SaaS Tenant</h3>
              <button
                onClick={() => setShowAddCompanyModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleProvisionTenant} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">TENANT COMPANY NAME</label>
                <input
                  type="text"
                  required
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  placeholder="e.g. Titan Freightlines LLC"
                  className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#FFD400] text-xs font-semibold rounded-xl focus:outline-none text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">WORKSPACE MANAGER EMAIL</label>
                <input
                  type="email"
                  required
                  value={managerEmail}
                  onChange={(e) => setManagerEmail(e.target.value)}
                  placeholder="e.g. admin@titan.com"
                  className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#FFD400] text-xs font-semibold rounded-xl focus:outline-none text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">WORKSPACE MANAGER PASSWORD</label>
                <input
                  type="password"
                  required
                  value={managerPassword}
                  onChange={(e) => setManagerPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#FFD400] text-xs font-semibold rounded-xl focus:outline-none text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">LICENSE PLAN TIER</label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#FFD400] text-xs font-bold rounded-xl focus:outline-none text-slate-800 cursor-pointer"
                >
                  <option value="Professional Tier">Professional Tier</option>
                  <option value="Starter Tier">Starter Tier</option>
                  <option value="Enterprise Tier">Enterprise Tier</option>
                </select>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#FFB300] hover:bg-[#FFA000] text-black font-extrabold text-xs py-3 rounded-xl shadow-md transition-colors cursor-pointer flex flex-col items-center justify-center gap-1"
                >
                  <Check className="w-4 h-4 text-black" />
                  <span>Finalize Setup</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Suspend Company Modal */}
      {showSuspendCompanyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-[420px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800">Suspend Company License</h3>
              <button onClick={() => setShowSuspendCompanyModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">SELECT COMPANY TO SUSPEND</label>
                <select className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#FFD400] text-xs font-semibold rounded-xl focus:outline-none text-slate-800 cursor-pointer">
                  <option>Falcon Logistics LLC</option>
                  <option>Swift Cargo Express</option>
                  <option>Apex Logistics LLC</option>
                </select>
              </div>
              <button
                onClick={() => setShowSuspendCompanyModal(false)}
                className="w-full py-3 bg-[#E11D48] hover:bg-[#BE123C] text-white font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer text-center"
              >
                Suspend License
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reactivate Company Modal */}
      {showReactivateCompanyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-[420px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800">Reactivate Suspended Company</h3>
              <button onClick={() => setShowReactivateCompanyModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">SELECT COMPANY TO REACTIVATE</label>
                <select className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#FFD400] text-xs font-semibold rounded-xl focus:outline-none text-slate-800 cursor-pointer">
                  <option>Texas Hotshot Carriers</option>
                  <option>Blue Sky Shipping</option>
                </select>
              </div>
              <button
                onClick={() => setShowReactivateCompanyModal(false)}
                className="w-full py-3 bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer text-center"
              >
                Reactivate License
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulate Login Session Modal */}
      {showLoginAsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-[420px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800">Simulate Login Session</h3>
              <button onClick={() => setShowLoginAsModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">SELECT COMPANY WORKSPACE</label>
                <select className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#FFD400] text-xs font-semibold rounded-xl focus:outline-none text-slate-800 cursor-pointer">
                  <option>Falcon Logistics LLC</option>
                  <option>Swift Cargo Express</option>
                  <option>Apex Logistics LLC</option>
                </select>
              </div>
              <button
                onClick={() => setShowLoginAsModal(false)}
                className="w-full py-3 bg-[#FFB300] hover:bg-[#FFA000] text-black font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer text-center"
              >
                Simulate Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Plan Modal */}
      {showCreatePlanModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-[420px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800">Create New Pricing Plan</h3>
              <button onClick={() => setShowCreatePlanModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">PLAN NAME</label>
                <input type="text" placeholder="e.g. Enterprise Tier" className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#FFD400] text-xs font-semibold rounded-xl focus:outline-none text-slate-800" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">MONTHLY PRICE ($)</label>
                <input type="number" placeholder="e.g. 1999" className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#FFD400] text-xs font-semibold rounded-xl focus:outline-none text-slate-800" />
              </div>
              <button
                onClick={() => setShowCreatePlanModal(false)}
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer text-center"
              >
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {showEditPlanModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-[420px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800">Edit Existing Plan</h3>
              <button onClick={() => setShowEditPlanModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">SELECT PLAN</label>
                <select className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#3B82F6] text-xs font-semibold rounded-xl focus:outline-none text-slate-800 cursor-pointer">
                  <option>Starter Tier</option>
                  <option>Professional Tier</option>
                  <option>Enterprise Tier</option>
                </select>
              </div>
              <button
                onClick={() => setShowEditPlanModal(false)}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer text-center"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Subscription Modal */}
      {showChangeSubModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-[420px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800">Change Company Subscription</h3>
              <button onClick={() => setShowChangeSubModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">SELECT COMPANY</label>
                <select className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#A855F7] text-xs font-semibold rounded-xl focus:outline-none text-slate-800 cursor-pointer">
                  <option>Falcon Logistics LLC</option>
                  <option>Swift Cargo Express</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">SELECT NEW PLAN</label>
                <select className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#A855F7] text-xs font-semibold rounded-xl focus:outline-none text-slate-800 cursor-pointer">
                  <option>Professional Tier</option>
                  <option>Enterprise Tier</option>
                </select>
              </div>
              <button
                onClick={() => setShowChangeSubModal(false)}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer text-center"
              >
                Change Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enable Feature Modal */}
      {showEnableFeatureModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-[420px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800">Enable Feature Flag</h3>
              <button onClick={() => setShowEnableFeatureModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">SELECT FEATURE</label>
                <select className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#10B981] text-xs font-semibold rounded-xl focus:outline-none text-slate-800 cursor-pointer">
                  <option>Advanced Analytics Module</option>
                  <option>AI Assistant Beta</option>
                </select>
              </div>
              <button
                onClick={() => setShowEnableFeatureModal(false)}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer text-center"
              >
                Enable Feature
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disable Feature Modal */}
      {showDisableFeatureModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-[420px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800">Disable Feature Flag</h3>
              <button onClick={() => setShowDisableFeatureModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">SELECT FEATURE</label>
                <select className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#F43F5E] text-xs font-semibold rounded-xl focus:outline-none text-slate-800 cursor-pointer">
                  <option>API Access</option>
                  <option>Bulk Imports</option>
                </select>
              </div>
              <button
                onClick={() => setShowDisableFeatureModal(false)}
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer text-center"
              >
                Disable Feature
              </button>
            </div>
          </div>
        </div>
      )}

      {/* White Label Modal */}
      {showWhiteLabelModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-[420px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800">Configure White Labeling</h3>
              <button onClick={() => setShowWhiteLabelModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">SELECT COMPANY</label>
                <select className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#A855F7] text-xs font-semibold rounded-xl focus:outline-none text-slate-800 cursor-pointer">
                  <option>Titan Freightlines LLC</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">CUSTOM DOMAIN</label>
                <input type="text" placeholder="e.g. portal.titan.com" className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#A855F7] text-xs font-semibold rounded-xl focus:outline-none text-slate-800" />
              </div>
              <button
                onClick={() => setShowWhiteLabelModal(false)}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer text-center"
              >
                Apply Custom Domain
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
