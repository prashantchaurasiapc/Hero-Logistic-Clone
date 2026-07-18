import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, AlertCircle, RefreshCw, UserCheck, Pen, Hexagon, Check, XSquare, Settings, Square, FileText, X
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function PlatformDashboard() {
  const navigate = useNavigate();

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
    { id: 2, name: 'Swift Cargo Express', plan: 'Starter', status: 'ACTIVE', users: '2', mrr: '$1,500', trialExpiry: '07/15/2026', lastActive: 'Yesterday, 04:30 PM' },
    { id: 3, name: 'Global Shipping Solutions', plan: 'Enterprise', status: 'ACTIVE', users: '84', mrr: '$28,000', trialExpiry: 'N/A', lastActive: 'Today, 03:24 PM' },
    { id: 4, name: 'Texas Hotshot Carriers', plan: 'Starter', status: 'HOLD', users: '4', mrr: '$0', trialExpiry: '06/15/2026', lastActive: 'Yesterday, 10:15 AM' },
    { id: 5, name: 'Apex Logistics LLC', plan: 'Professional', status: 'ACTIVE', users: '16', mrr: '$4,910', trialExpiry: 'N/A', lastActive: 'Today, 01:10 PM' },
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

  const [showInspector, setShowInspector] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [activeInspectorTab, setActiveInspectorTab] = useState('Overview');

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

  const handleExportReport = () => {
    const headers = ['Company Name', 'Subscription Plan', 'Status', 'Active Users', 'Monthly Revenue', 'Trial Expiry', 'Last Login'];
    const csvContent = [
      headers.join(','),
      ...recentTenants.map(t => `"${t.name}","${t.plan}","${t.status}","${t.users}","${t.mrr}","${t.trialExpiry}","${t.lastActive}"`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `platform_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const alertDiv = document.createElement('div');
    alertDiv.className = 'fixed bottom-4 right-4 bg-[#10B981] text-white font-bold px-6 py-3 rounded-xl shadow-lg z-[999]';
    alertDiv.innerText = 'Report downloaded successfully!';
    document.body.appendChild(alertDiv);
    setTimeout(() => {
      alertDiv.style.opacity = '0';
      alertDiv.style.transition = 'opacity 0.5s ease';
      setTimeout(() => alertDiv.remove(), 500);
    }, 3000);
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
        <button onClick={handleExportReport} className="mt-4 sm:mt-0 text-[13px] font-bold text-[#D97706] border border-amber-200 hover:bg-amber-50 px-6 py-2.5 rounded-xl transition-colors cursor-pointer">
          Export Report
        </button>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex flex-col justify-between min-h-[100px] hover:shadow-md transition-shadow">
            <div>
              <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wide block">{kpi.title}</span>
              <span className="text-[26px] font-black text-slate-900 block mt-2 leading-none">{kpi.value}</span>
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className="text-[11px] font-medium text-slate-400 leading-tight">{kpi.desc}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ml-2 ${kpi.statusColor}`}>{kpi.status}</span>
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
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-45 space-y-1.5 text-left text-xs text-slate-700 font-bold max-h-60 overflow-y-auto">
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
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="py-3.5 px-6 w-10">
                      <input type="checkbox" className="w-4 h-4 text-[#FFD400] rounded focus:ring-0 cursor-pointer" />
                    </th>
                    {visibleColumns.companyName && <th className="py-3.5 px-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">COMPANY</th>}
                    {visibleColumns.subscriptionPlan && <th className="py-3.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">SUBSCRIPTION PLAN</th>}
                    {visibleColumns.status && <th className="py-3.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">STATUS</th>}
                    {visibleColumns.activeUsers && <th className="py-3.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">ACTIVE USERS</th>}
                    {visibleColumns.monthlyRevenue && <th className="py-3.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">MONTHLY REV.</th>}
                    {visibleColumns.trialExpiry && <th className="py-3.5 px-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">TRIAL EXPIRY</th>}
                    {visibleColumns.lastLogin && <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">LAST LOGIN</th>}
                    <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentTenants.map((tenant) => (
                    <tr key={tenant.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className={`${getDensityPadding()} px-6`}>
                        <input type="checkbox" className="w-4 h-4 text-[#FFD400] rounded focus:ring-0 cursor-pointer" />
                      </td>
                      {visibleColumns.companyName && (
                        <td className={`${getDensityPadding()} px-2`}>
                          <span className="font-bold text-slate-900 text-[13px]">{tenant.name}</span>
                        </td>
                      )}
                      {visibleColumns.subscriptionPlan && (
                        <td className={`${getDensityPadding()} px-4`}>
                          <span className="text-[13px] font-semibold text-slate-600">{tenant.plan}</span>
                        </td>
                      )}
                      {visibleColumns.status && (
                        <td className={`${getDensityPadding()} px-4`}>
                          <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${tenant.status === 'ACTIVE'
                            ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                            : tenant.status === 'HOLD'
                              ? 'text-amber-700 bg-amber-50 border border-amber-200'
                              : 'text-rose-700 bg-rose-50 border border-rose-200'
                            }`}>
                            {tenant.status}
                          </span>
                        </td>
                      )}
                      {visibleColumns.activeUsers && (
                        <td className={`${getDensityPadding()} px-4`}>
                          <span className="text-[13px] font-bold text-slate-700">{tenant.users}</span>
                        </td>
                      )}
                      {visibleColumns.monthlyRevenue && (
                        <td className={`${getDensityPadding()} px-4`}>
                          <span className="text-[13px] font-bold text-[#10B981]">{tenant.mrr}</span>
                        </td>
                      )}
                      {visibleColumns.trialExpiry && (
                        <td className={`${getDensityPadding()} px-4`}>
                          <span className="text-[13px] font-medium text-slate-500">{tenant.trialExpiry}</span>
                        </td>
                      )}
                      {visibleColumns.lastLogin && (
                        <td className={`${getDensityPadding()} px-6`}>
                          <span className="text-[12px] font-medium text-slate-500">{tenant.lastActive}</span>
                        </td>
                      )}
                      <td className={`${getDensityPadding()} px-6 align-middle`}>
                        <div className="flex flex-col gap-1.5 items-center w-[90px] mx-auto py-1">
                          <button
                            onClick={() => { setSelectedTenant(tenant); setShowInspector(true); }}
                            className="w-full py-1.5 px-2 border border-slate-200 text-slate-700 font-bold text-[10px] rounded-full hover:bg-slate-50 transition-colors bg-white cursor-pointer"
                          >
                            View
                          </button>
                          {tenant.status === 'HOLD' ? (
                            <button onClick={() => setShowReactivateCompanyModal(true)} className="w-full py-1.5 px-2 bg-[#10B981] text-white font-bold text-[10px] rounded-full hover:bg-[#059669] transition-colors shadow-sm shadow-[#10B981]/20">
                              Reactivate
                            </button>
                          ) : (
                            <button onClick={() => setShowSuspendCompanyModal(true)} className="w-full py-1.5 px-2 bg-[#E11D48] text-white font-bold text-[10px] rounded-full hover:bg-[#BE123C] transition-colors shadow-sm shadow-[#E11D48]/20">
                              Suspend
                            </button>
                          )}
                          <button onClick={() => setShowLoginAsModal(true)} className="w-full py-1.5 px-2 border border-[#FFD400] text-[#D97706] font-bold text-[10px] rounded-full hover:bg-amber-50 transition-colors bg-white">
                            Login As
                          </button>
                          <button onClick={() => navigate('/admin/billing')} className="w-full py-1.5 px-2 border border-slate-200 text-slate-700 font-bold text-[10px] rounded-full hover:bg-slate-50 transition-colors bg-white cursor-pointer">
                            Billing
                          </button>
                        </div>
                      </td>
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
              <button
                onClick={() => setShowAddCompanyModal(true)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 shadow-md shadow-orange-500/30 text-slate-900 hover:scale-[1.02] font-bold text-[10px] py-2.5 px-3 rounded-2xl transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Company
              </button>
              <button
                onClick={() => setShowSuspendCompanyModal(true)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-rose-600 shadow-md shadow-rose-500/30 text-slate-900 hover:scale-[1.02] font-bold text-[10px] py-2.5 px-3 rounded-2xl transition-all cursor-pointer"
              >
                <AlertCircle className="w-3 h-3" /> Suspend Company
              </button>
              <button
                onClick={() => setShowReactivateCompanyModal(true)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/30 text-slate-900 hover:scale-[1.02] font-bold text-[10px] py-2.5 px-3 rounded-2xl transition-all cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Reactivate Company
              </button>
              <button
                onClick={() => setShowLoginAsModal(true)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-400 to-blue-600 shadow-md shadow-blue-500/30 text-slate-900 hover:scale-[1.02] font-bold text-[10px] py-2.5 px-3 rounded-2xl transition-all cursor-pointer"
              >
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
                onClick={handleExportReport}
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-[500px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Provision New SaaS Tenant</h3>
              <button
                onClick={() => setShowAddCompanyModal(false)}
                className="text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleProvisionTenant} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">TENANT COMPANY NAME</label>
                <input
                  type="text"
                  required
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  placeholder="e.g. Titan Freightlines LLC"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-[#FFA000] text-[13px] font-medium rounded-xl focus:outline-none text-slate-800 placeholder-slate-400"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">WORKSPACE MANAGER EMAIL</label>
                <input
                  type="email"
                  required
                  value={managerEmail}
                  onChange={(e) => setManagerEmail(e.target.value)}
                  placeholder="e.g. admin@titan.com"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-[#FFA000] text-[13px] font-medium rounded-xl focus:outline-none text-slate-800 placeholder-slate-400"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">WORKSPACE MANAGER PASSWORD</label>
                <input
                  type="password"
                  required
                  value={managerPassword}
                  onChange={(e) => setManagerPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-[#FFA000] text-[13px] font-medium rounded-xl focus:outline-none text-slate-800 placeholder-slate-400"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">LICENSE PLAN TIER</label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-[#FFA000] text-[13px] font-medium rounded-xl focus:outline-none text-slate-800 cursor-pointer"
                >
                  <option value="Professional Tier">Professional Tier</option>
                  <option value="Starter Tier">Starter Tier</option>
                  <option value="Enterprise Tier">Enterprise Tier</option>
                </select>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#FFA000] hover:bg-[#FF8F00] text-slate-900 font-bold text-[13px] py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer flex flex-col items-center justify-center gap-1"
                >
                  <Check className="w-4 h-4 text-slate-900" />
                  <span>Finalize Setup</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Suspend Company Modal */}
      {showSuspendCompanyModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-[500px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Suspend Company License</h3>
              <button onClick={() => setShowSuspendCompanyModal(false)} className="text-slate-500 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">SELECT COMPANY TO SUSPEND</label>
                <select className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-[13px] font-medium rounded-xl focus:outline-none text-slate-800 cursor-pointer">
                  <option>-- Select Active Company --</option>
                  <option>Falcon Logistics LLC</option>
                  <option>Swift Cargo Express</option>
                  <option>Global Shipping Solutions</option>
                  <option>Apex Logistics LLC</option>
                </select>
              </div>
              <button
                onClick={() => setShowSuspendCompanyModal(false)}
                className="w-full py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-[13px] rounded-xl shadow-sm transition-colors cursor-pointer text-center mt-2"
              >
                Suspend License
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reactivate Company Modal */}
      {showReactivateCompanyModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-[500px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Reactivate Suspended Company</h3>
              <button onClick={() => setShowReactivateCompanyModal(false)} className="text-slate-500 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">SELECT COMPANY TO REACTIVATE</label>
                <select className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-[#10B981] text-[13px] font-medium rounded-xl focus:outline-none text-slate-800 cursor-pointer">
                  <option>-- Select Suspended Company --</option>
                  <option>Texas Hotshot Carriers</option>
                  <option>Blue Sky Shipping</option>
                </select>
              </div>
              <button
                onClick={() => setShowReactivateCompanyModal(false)}
                className="w-full py-2.5 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-[13px] rounded-xl shadow-sm transition-colors cursor-pointer text-center mt-2"
              >
                Reactivate License
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulate Login Session Modal */}
      {showLoginAsModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-[500px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Simulate Login Session</h3>
              <button onClick={() => setShowLoginAsModal(false)} className="text-slate-500 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">SELECT COMPANY WORKSPACE</label>
                <select className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-[13px] font-medium rounded-xl focus:outline-none text-slate-800 cursor-pointer">
                  <option>-- Select Company --</option>
                  <option>Falcon Logistics LLC</option>
                  <option>Swift Cargo Express</option>
                  <option>Global Shipping Solutions</option>
                  <option>Texas Hotshot Carriers</option>
                  <option>Apex Logistics LLC</option>
                </select>
              </div>
              <button
                onClick={() => setShowLoginAsModal(false)}
                className="w-full py-2.5 bg-[#FFB300] hover:bg-[#FFA000] text-slate-900 font-bold text-[13px] rounded-xl shadow-sm transition-colors cursor-pointer text-center mt-2"
              >
                Simulate Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Plan Modal */}
      {showCreatePlanModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-[500px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Create New Subscription Plan</h3>
              <button onClick={() => setShowCreatePlanModal(false)} className="text-slate-500 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">PLAN NAME</label>
                <input type="text" placeholder="e.g. Starter, Premium, Ultimate" className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-[#FFA000] text-[13px] font-medium rounded-xl focus:outline-none text-slate-800 placeholder-slate-400" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">MONTHLY PRICE (USD)</label>
                <input type="text" placeholder="e.g. 199" className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-[#FFA000] text-[13px] font-medium rounded-xl focus:outline-none text-slate-800 placeholder-slate-400" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">DRIVERS LIMIT</label>
                <input type="text" placeholder="e.g. 10" className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-[#FFA000] text-[13px] font-medium rounded-xl focus:outline-none text-slate-800 placeholder-slate-400" />
              </div>
              <button
                onClick={() => setShowCreatePlanModal(false)}
                className="w-full py-2.5 bg-[#FFA000] hover:bg-[#FF8F00] text-slate-900 font-bold text-[13px] rounded-xl shadow-sm transition-colors cursor-pointer text-center mt-2"
              >
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {showEditPlanModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-[500px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Edit Subscription Plan Tier</h3>
              <button onClick={() => setShowEditPlanModal(false)} className="text-slate-500 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">SELECT PLAN TIER TO EDIT</label>
                <select className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-[#FFA000] text-[13px] font-medium rounded-xl focus:outline-none text-slate-800 cursor-pointer">
                  <option>Starter Tier</option>
                  <option>Professional Tier</option>
                  <option>Enterprise Tier</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">MONTHLY PRICE (USD)</label>
                <input type="text" placeholder="199" className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-[#FFA000] text-[13px] font-medium rounded-xl focus:outline-none text-slate-800 placeholder-slate-400" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">DRIVERS LIMIT</label>
                <input type="text" placeholder="5" className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-[#FFA000] text-[13px] font-medium rounded-xl focus:outline-none text-slate-800 placeholder-slate-400" />
              </div>
              <button
                onClick={() => setShowEditPlanModal(false)}
                className="w-full py-2.5 bg-[#FFA000] hover:bg-[#FF8F00] text-slate-900 font-bold text-[13px] rounded-xl shadow-sm transition-colors cursor-pointer text-center mt-2"
              >
                Save Plan Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Subscription Modal */}
      {showChangeSubModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-[500px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Change Subscription Plan</h3>
              <button onClick={() => setShowChangeSubModal(false)} className="text-slate-500 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">SELECT COMPANY WORKSPACE</label>
                <select className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-[#FFA000] text-[13px] font-medium rounded-xl focus:outline-none text-slate-800 cursor-pointer">
                  <option>-- Select Company --</option>
                  <option>Falcon Logistics LLC</option>
                  <option>Swift Cargo Express</option>
                  <option>Global Shipping Solutions</option>
                  <option>Texas Hotshot Carriers</option>
                  <option>Apex Logistics LLC</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">SELECT NEW SUBSCRIPTION PLAN TIER</label>
                <select className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-[#FFA000] text-[13px] font-medium rounded-xl focus:outline-none text-slate-800 cursor-pointer">
                  <option>Professional Tier - $499/mo</option>
                  <option>Enterprise Tier - $999/mo</option>
                </select>
              </div>
              <button
                onClick={() => setShowChangeSubModal(false)}
                className="w-full py-2.5 bg-[#FFA000] hover:bg-[#FF8F00] text-slate-900 font-bold text-[13px] rounded-xl shadow-sm transition-colors cursor-pointer text-center mt-2"
              >
                Update Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enable Feature Modal */}
      {showEnableFeatureModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-[500px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Enable Feature Globally or by Tier</h3>
              <button onClick={() => setShowEnableFeatureModal(false)} className="text-slate-500 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">SELECT FEATURE TO ENABLE</label>
                <select className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-[#FFA000] text-[13px] font-medium rounded-xl focus:outline-none text-slate-800 cursor-pointer">
                  <option>Platform Dashboard</option>
                  <option>Companies</option>
                  <option>Subscriptions</option>
                  <option>Membership Plans</option>
                  <option>Feature Access</option>
                  <option>White Label</option>
                  <option>Support Tickets</option>
                  <option>Billing</option>
                  <option>System Analytics</option>
                  <option>Inter-Company Transfers</option>
                  <option>AI Controls</option>
                  <option>Settings</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">SELECT PLAN TIER</label>
                <select className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-[#10B981] text-[13px] font-medium rounded-xl focus:outline-none text-slate-800 cursor-pointer">
                  <option>Starter Tier</option>
                  <option>Professional Tier</option>
                  <option>Enterprise Tier</option>
                </select>
              </div>
              <button
                onClick={() => setShowEnableFeatureModal(false)}
                className="w-full py-2.5 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-[13px] rounded-xl shadow-sm transition-colors cursor-pointer text-center mt-2"
              >
                Enable Feature
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disable Feature Modal */}
      {showDisableFeatureModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-[500px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Disable Feature Globally or by Tier</h3>
              <button onClick={() => setShowDisableFeatureModal(false)} className="text-slate-500 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">SELECT FEATURE TO DISABLE</label>
                <select className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-[#FFA000] text-[13px] font-medium rounded-xl focus:outline-none text-slate-800 cursor-pointer">
                  <option>Platform Dashboard</option>
                  <option>Companies</option>
                  <option>Subscriptions</option>
                  <option>Membership Plans</option>
                  <option>Feature Access</option>
                  <option>White Label</option>
                  <option>Support Tickets</option>
                  <option>Billing</option>
                  <option>System Analytics</option>
                  <option>Inter-Company Transfers</option>
                  <option>AI Controls</option>
                  <option>Settings</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">SELECT PLAN TIER</label>
                <select className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-[#E11D48] text-[13px] font-medium rounded-xl focus:outline-none text-slate-800 cursor-pointer">
                  <option>Starter Tier</option>
                  <option>Professional Tier</option>
                  <option>Enterprise Tier</option>
                </select>
              </div>
              <button
                onClick={() => setShowDisableFeatureModal(false)}
                className="w-full py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-[13px] rounded-xl shadow-sm transition-colors cursor-pointer text-center mt-2"
              >
                Disable Feature
              </button>
            </div>
          </div>
        </div>
      )}

      {/* White Label Modal */}
      {showWhiteLabelModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-[500px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">White Label Branding Options</h3>
              <button onClick={() => setShowWhiteLabelModal(false)} className="text-slate-500 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">BRANDED PLATFORM NAME</label>
                <input type="text" placeholder="HERO LOGISTICS" className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-[#FFA000] text-[13px] font-medium rounded-xl focus:outline-none text-slate-800 placeholder-slate-400" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">ACCENT THEME COLOR</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 w-7 h-7 bg-[#0ea5e9] border border-slate-300"></div>
                  <input type="text" placeholder="#0ea5e9" className="w-full pl-13 pr-4 py-2.5 bg-white border border-slate-200 focus:border-[#FFA000] text-[13px] font-medium rounded-xl focus:outline-none text-slate-800 placeholder-slate-400" />
                </div>
              </div>
              <button
                onClick={() => setShowWhiteLabelModal(false)}
                className="w-full py-2.5 bg-[#FFA000] hover:bg-[#FF8F00] text-slate-900 font-bold text-[13px] rounded-xl shadow-sm transition-colors cursor-pointer text-center mt-2"
              >
                Save Branding Options
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tenant Workspace Inspector Drawer */}
      {showInspector && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity cursor-pointer"
            onClick={() => setShowInspector(false)}
          ></div>

          {/* Drawer Panel */}
          <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col animate-slide-left">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-white">
              <h3 className="text-lg font-extrabold text-slate-900">Tenant Workspace Inspector</h3>
              <button
                onClick={() => setShowInspector(false)}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 overflow-y-auto custom-scrollbar flex-grow space-y-8 bg-[#F8FAFC]">

              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-[22px] font-black text-slate-900">{selectedTenant?.name || 'Falcon Logistics LLC'}</h2>
                  <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-wider">Workspace ID: #TEN-{selectedTenant?.id || '1'}</p>
                </div>
                <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${(selectedTenant?.status || 'ACTIVE') === 'ACTIVE'
                  ? 'text-emerald-600 bg-emerald-50 border border-emerald-200'
                  : 'text-amber-600 bg-amber-50 border border-amber-200'
                  }`}>
                  {selectedTenant?.status || 'ACTIVE'}
                </span>
              </div>

              {/* Tabs */}
              <div className="flex overflow-x-auto custom-scrollbar pb-3 gap-2 border-b border-slate-200/60 items-center">
                {['Overview', 'Subscriptions', 'Users', 'Branches', 'Fleet', 'Loads', 'Billing', 'Support Tickets', 'Feature Access', 'Audit Log'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveInspectorTab(tab)}
                    className={`shrink-0 px-4 py-1.5 text-[11px] rounded-xl whitespace-nowrap cursor-pointer transition-colors ${activeInspectorTab === tab
                      ? 'bg-[#FFD400] text-slate-900 font-black shadow-sm border-2 border-slate-900'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-bold border-2 border-transparent'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeInspectorTab === 'Overview' && (
                <div className="space-y-4">
                  {/* General Information Card */}
                  <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm shadow-slate-200/40">
                    <h4 className="text-[12px] font-extrabold text-slate-800 mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      General Information
                    </h4>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                      <div>
                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-0.5">Account Manager</p>
                        <p className="text-slate-800 font-bold text-[12px]">Alex W.</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-0.5">Region/Country</p>
                        <p className="text-slate-800 font-bold text-[12px]">USA</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-0.5">Joined Date</p>
                        <p className="text-slate-800 font-bold text-[12px]">03/12/2026</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-0.5">Last Login</p>
                        <p className="text-slate-800 font-bold text-[12px]">{selectedTenant?.lastActive || 'Today, 02:15 PM'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Resource Metrics Card */}
                  <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm shadow-slate-200/40">
                    <h4 className="text-[12px] font-extrabold text-slate-800 mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Resource Metrics
                    </h4>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                      <div>
                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-0.5">Active Users</p>
                        <p className="text-slate-800 font-black text-sm">{selectedTenant?.users || '12'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-0.5">Total Drivers</p>
                        <p className="text-slate-800 font-black text-sm">3</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-0.5">Fleet Vehicles</p>
                        <p className="text-slate-800 font-black text-sm">15</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-0.5">Branches count</p>
                        <p className="text-slate-800 font-black text-sm">4</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeInspectorTab === 'Subscriptions' && (
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm shadow-slate-200/40">
                  <h4 className="text-[13px] font-extrabold text-slate-800 mb-5">Subscription Licensing Contract</h4>
                  <div className="space-y-3.5">
                    <div className="flex gap-2 items-center">
                      <span className="text-slate-400 text-[12px] font-bold">Current Tier Plan:</span>
                      <span className="text-[#D97706] font-extrabold text-[12px]">Professional Plan</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-slate-400 text-[12px] font-bold">Contract Billing Rate:</span>
                      <span className="text-slate-800 font-extrabold text-[12px]">$8,500 / month</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-slate-400 text-[12px] font-bold">Billing Cycle Period:</span>
                      <span className="text-slate-800 font-extrabold text-[12px]">Monthly Auto-Renewal recurring</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-slate-400 text-[12px] font-bold">Next Renewal Invoice Date:</span>
                      <span className="text-slate-800 font-extrabold text-[12px]">07/24/2026</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-slate-400 text-[12px] font-bold">Trial Expiry:</span>
                      <span className="text-slate-800 font-extrabold text-[12px]">N/A</span>
                    </div>
                  </div>
                </div>
              )}

              {activeInspectorTab === 'Users' && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">REGISTERED ACCOUNT STAFF MEMBERS</h4>
                  <div className="bg-white border border-slate-100 rounded-2xl shadow-sm shadow-slate-200/40 overflow-hidden divide-y divide-slate-100">
                    {[
                      { name: 'Alexander Wright', email: 'Alex W.', role: 'Company Admin', status: 'Active' },
                      { name: 'Operator B', email: 'operator2@falconlogisticsllc.com', role: 'Dispatcher', status: 'Active' },
                      { name: 'Operator C', email: 'operator3@falconlogisticsllc.com', role: 'Dispatcher', status: 'Active' },
                      { name: 'Operator D', email: 'operator4@falconlogisticsllc.com', role: 'Dispatcher', status: 'Active' },
                      { name: 'Operator E', email: 'operator5@falconlogisticsllc.com', role: 'Dispatcher', status: 'Active' },
                      { name: 'Operator F', email: 'operator6@falconlogisticsllc.com', role: 'Dispatcher', status: 'Active' },
                      { name: 'Operator G', email: 'operator7@falconlogisticsllc.com', role: 'Dispatcher', status: 'Active' },
                      { name: 'Operator H', email: 'operator8@falconlogisticsllc.com', role: 'Dispatcher', status: 'Active' },
                    ].map(user => (
                      <div key={user.name} className="flex justify-between items-center p-4">
                        <div>
                          <p className="text-[13px] font-bold text-slate-800">{user.name}</p>
                          <p className="text-[11px] font-mono text-slate-400 mt-0.5">{user.email}</p>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <p className="text-[11px] font-bold text-slate-600 mb-1">{user.role}</p>
                          <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full tracking-wider">{user.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeInspectorTab === 'Branches' && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">ACTIVE BRANCH TERMINALS</h4>
                  <div className="bg-white border border-slate-100 rounded-2xl shadow-sm shadow-slate-200/40 overflow-hidden divide-y divide-slate-100">
                    {[
                      { name: 'Chicago HQ Terminal', loc: 'Chicago, IL', staff: '4 Staff' },
                      { name: 'Branch Depot 2', loc: 'Los Angeles, CA', staff: '6 Staff' },
                      { name: 'Branch Depot 3', loc: 'Los Angeles, CA', staff: '8 Staff' },
                      { name: 'Branch Depot 4', loc: 'Los Angeles, CA', staff: '10 Staff' },
                    ].map(branch => (
                      <div key={branch.name} className="flex justify-between items-center p-4">
                        <div>
                          <p className="text-[13px] font-bold text-slate-800">{branch.name}</p>
                          <p className="text-[11px] font-medium text-slate-400 mt-0.5">{branch.loc}</p>
                        </div>
                        <div>
                          <p className="text-[12px] font-bold text-slate-600">{branch.staff}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeInspectorTab === 'Fleet' && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">REGISTERED FLEET ASSET VEHICLES</h4>
                  <div className="bg-white border border-slate-100 rounded-2xl shadow-sm shadow-slate-200/40 overflow-hidden divide-y divide-slate-100">
                    {[
                      { id: 'TX-ROAD88', type: 'Semi-Truck' },
                      { id: 'IL-HAUL42', type: 'Flatbed Trailer' },
                      { id: 'CA-CARRI7', type: 'Semi-Truck' },
                      { id: 'TX-1003', type: 'Flatbed Trailer' },
                      { id: 'TX-1004', type: 'Semi-Truck' },
                      { id: 'TX-1005', type: 'Flatbed Trailer' },
                      { id: 'TX-1006', type: 'Semi-Truck' },
                      { id: 'TX-1007', type: 'Flatbed Trailer' },
                    ].map(vehicle => (
                      <div key={vehicle.id} className="flex justify-between items-center p-4">
                        <div>
                          <p className="text-[13px] font-bold text-slate-800">{vehicle.id}</p>
                          <p className="text-[11px] font-medium text-slate-400 mt-0.5">{vehicle.type}</p>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-blue-500 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full tracking-wide">Active</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeInspectorTab === 'Loads' && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">LOADS MANIFEST SUMMARY</h4>
                  <div className="bg-white border border-slate-100 rounded-2xl shadow-sm shadow-slate-200/40 overflow-hidden divide-y divide-slate-100">
                    {[
                      { id: 'Load LD-9400', route: 'Chicago ➔ Dallas', cargo: 'Automotive Components' },
                      { id: 'Load LD-9401', route: 'Houston ➔ Atlanta', cargo: 'Dry Grocery Pallets' },
                      { id: 'Load LD-9402', route: 'Chicago ➔ Dallas', cargo: 'Automotive Components' },
                      { id: 'Load LD-9403', route: 'Houston ➔ Atlanta', cargo: 'Dry Grocery Pallets' },
                      { id: 'Load LD-9404', route: 'Chicago ➔ Dallas', cargo: 'Automotive Components' },
                      { id: 'Load LD-9405', route: 'Houston ➔ Atlanta', cargo: 'Dry Grocery Pallets' },
                      { id: 'Load LD-9406', route: 'Chicago ➔ Dallas', cargo: 'Automotive Components' },
                      { id: 'Load LD-9407', route: 'Houston ➔ Atlanta', cargo: 'Dry Grocery Pallets' },
                    ].map(load => (
                      <div key={load.id} className="flex justify-between items-center p-4">
                        <div>
                          <p className="text-[13px] font-bold text-slate-800">{load.id}</p>
                          <p className="text-[11px] font-medium text-slate-500 mt-0.5">{load.route} ({load.cargo})</p>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full tracking-wide">In Transit</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeInspectorTab === 'Billing' && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">BILLING SUMMARY & LEDGER</h4>

                  <div className="bg-white border border-slate-100 rounded-2xl p-5 mb-4 shadow-sm shadow-slate-200/40">
                    <div className="space-y-3.5">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-[12px] font-bold">Subscription Revenue:</span>
                        <span className="text-emerald-500 font-extrabold text-[12px]">$8500/mo</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-[12px] font-bold">Annual Projected:</span>
                        <span className="text-slate-800 font-extrabold text-[12px]">$102000/yr</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-[12px] font-bold">Billing Cycle:</span>
                        <span className="text-slate-800 font-extrabold text-[12px]">Monthly Recurring</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-[12px] font-bold">Auto Renewal:</span>
                        <span className="text-emerald-500 font-extrabold text-[12px]">Enabled</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-100 rounded-2xl shadow-sm shadow-slate-200/40 overflow-hidden divide-y divide-slate-100">
                    {[
                      { id: '#INV-1001A', date: '06/12/2026 - 07/12/2026', amount: '$8500', status: 'Paid', statusClass: 'text-emerald-500 bg-emerald-50' },
                      { id: '#INV-1002A', date: '06/15/2026 - 06/29/2026', amount: '$4200', status: 'Sent', statusClass: 'text-amber-500 bg-amber-50' },
                      { id: '#INV-1003A', date: '06/20/2026 - 07/04/2026', amount: '$3100', status: 'Draft', statusClass: 'text-amber-500 bg-amber-50' },
                      { id: '#INV-1004A', date: '05/10/2026 - 05/24/2026', amount: '$5000', status: 'Overdue', statusClass: 'text-amber-500 bg-amber-50' },
                    ].map(invoice => (
                      <div key={invoice.id} className="flex justify-between items-center p-4">
                        <div>
                          <p className="text-[13px] font-bold text-slate-800">Invoice {invoice.id}</p>
                          <p className="text-[11px] font-medium text-slate-400 mt-0.5">Period: {invoice.date}</p>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <p className="text-[13px] font-bold text-slate-800 mb-1">{invoice.amount}</p>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider ${invoice.statusClass}`}>{invoice.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeInspectorTab === 'Support Tickets' && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">INBOUND TICKET QUERIES RAISED</h4>
                  <div className="bg-white border border-slate-100 rounded-2xl shadow-sm shadow-slate-200/40 p-4 flex justify-between items-center">
                    <div>
                      <p className="text-[13px] font-bold text-slate-800">#1 • Invoice Factoring Delay</p>
                      <p className="text-[11px] font-medium text-slate-400 mt-0.5">Priority: High</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-amber-500 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full tracking-wide">Open</span>
                    </div>
                  </div>
                </div>
              )}

              {activeInspectorTab === 'Feature Access' && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">VISUAL FEATURE PERMISSIONS</h4>
                  <div className="bg-white border border-slate-100 rounded-2xl shadow-sm shadow-slate-200/40 overflow-hidden divide-y divide-slate-50 py-1">
                    {[
                      { name: 'Platform Dashboard', status: 'Enabled', active: true },
                      { name: 'Companies Workspace', status: 'Enabled', active: true },
                      { name: 'Subscriptions Panel', status: 'Enabled', active: true },
                      { name: 'Membership Plans', status: 'Disabled', active: false },
                      { name: 'AI Controls Center', status: 'Disabled', active: false },
                      { name: 'Inter-Company Transfers', status: 'Disabled', active: false },
                      { name: 'White Label Customization', status: 'Disabled', active: false },
                    ].map(feature => (
                      <div key={feature.name} className="flex justify-between items-center px-5 py-3">
                        <p className="text-[13px] font-medium text-slate-500">{feature.name}</p>
                        <span className={`text-[12px] font-bold ${feature.active ? 'text-emerald-500' : 'text-slate-600'}`}>{feature.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeInspectorTab === 'Audit Log' && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">SUBSCRIPTION AUDIT FEED</h4>
                  <div className="bg-white border border-slate-100 rounded-2xl shadow-sm shadow-slate-200/40 p-5 divide-y divide-slate-100">
                    <div className="pb-4">
                      <p className="text-[12px] font-bold text-slate-800">Company Created</p>
                      <p className="text-[11px] text-slate-500 mt-1">Falcon Logistics LLC provisioned successfully.</p>
                      <p className="text-[9px] font-mono text-slate-400 mt-2">03/12/2026</p>
                    </div>
                    <div className="pt-4">
                      <p className="text-[12px] font-bold text-slate-800">Database Index Sync</p>
                      <p className="text-[11px] text-slate-500 mt-1">ElasticSearch keys auto-indexing rebuilt.</p>
                      <p className="text-[9px] font-mono text-slate-400 mt-2">03/12/2026</p>
                    </div>
                  </div>
                </div>
              )}

              {!['Overview', 'Subscriptions', 'Users', 'Branches', 'Fleet', 'Billing', 'Support Tickets', 'Feature Access', 'Audit Log'].includes(activeInspectorTab) && (
                <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center shadow-sm shadow-slate-200/40">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-slate-400 font-bold text-xl">ℹ️</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-800 mb-1">{activeInspectorTab} Data</h4>
                  <p className="text-[11px] text-slate-500">Detailed information for {activeInspectorTab.toLowerCase()} will be displayed here.</p>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="p-6 border-t border-slate-100 bg-white">
              <div className="flex gap-3 mb-3">
                <button className="flex-1 bg-[#E11D48] text-white px-4 py-3 rounded-xl text-[11px] font-bold hover:bg-[#BE123C] shadow-md shadow-rose-500/20 transition-all text-center cursor-pointer">
                  Suspend Workspace License
                </button>
                <button className="flex-1 bg-[#E11D48] text-white px-4 py-3 rounded-xl text-[11px] font-bold hover:bg-[#BE123C] shadow-md shadow-rose-500/20 transition-all text-center cursor-pointer">
                  Permanently Delete Company
                </button>
              </div>
              <button
                onClick={() => setShowInspector(false)}
                className="w-[150px] bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-[11px] font-bold hover:bg-slate-50 transition-colors text-center cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
