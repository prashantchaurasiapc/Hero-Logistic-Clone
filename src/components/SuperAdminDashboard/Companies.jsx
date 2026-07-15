import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Plus, Check, X, ShieldAlert, CheckCircle, ExternalLink, 
  Settings, Download, FileText, Filter, ChevronDown, RefreshCw, AlertCircle
} from 'lucide-react';

export default function Companies() {
  const [searchQuery, setSearchQuery] = useState('');
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const [toast, setToast] = useState('');
  
  // Advanced filters
  const [minUsersFilter, setMinUsersFilter] = useState('');
  const [selectedPlanFilter, setSelectedPlanFilter] = useState('All Plans');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All Statuses');

  // Table padding density state: 'COMPACT' | 'DEFAULT' | 'RELAXED'
  const [density, setDensity] = useState('DEFAULT');

  // Column visibility states
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    checkboxes: true,
    companyName: true,
    companyId: true,
    subscriptionPlan: true,
    status: true,
    branches: true,
    users: true,
    drivers: true,
    fleetVehicles: true,
    activeLoads: true,
    monthlyRevenue: true,
    lastLogin: true,
    trialExpiry: true,
    createdDate: true,
    accountManager: true,
  });

  // Modal states
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [tenantName, setTenantName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [managerPassword, setManagerPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('Professional Tier');

  // Action Menu dropdown state
  const [activeActionsMenu, setActiveActionsMenu] = useState(null); // ID of company whose menu is open

  const columnsMenuRef = useRef(null);
  const actionsMenuRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (columnsMenuRef.current && !columnsMenuRef.current.contains(event.target)) {
        setShowColumnsMenu(false);
      }
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target)) {
        setActiveActionsMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const showNotification = (msg) => {
    setToast(msg);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Mock Database exactly matching the table screenshot data
  const [companies, setCompanies] = useState([
    { 
      id: '#TEN-1', 
      name: 'Falcon Logistics LLC', 
      plan: 'Professional', 
      status: 'ACTIVE', 
      branches: 4, 
      users: 12, 
      drivers: 3, 
      vehicles: 15, 
      loads: 8, 
      mrr: 8500, 
      lastLogin: 'Today, 02:15 PM', 
      expiry: 'N/A', 
      created: '03/12/2026',
      manager: 'Alex W.'
    },
    { 
      id: '#TEN-2', 
      name: 'Swift Cargo Express', 
      plan: 'Professional', 
      status: 'ACTIVE', 
      branches: 2, 
      users: 2, 
      drivers: 3, 
      vehicles: 4, 
      loads: 2, 
      mrr: 499, 
      lastLogin: 'Yesterday, 04:30 PM', 
      expiry: '07/15/2026', 
      created: '04/19/2026',
      manager: 'Alex W.'
    },
    { 
      id: '#TEN-3', 
      name: 'Global Shipping Solutions', 
      plan: 'Enterprise', 
      status: 'ACTIVE', 
      branches: 15, 
      users: 84, 
      drivers: 142, 
      vehicles: 98, 
      loads: 45, 
      mrr: 28000, 
      lastLogin: 'Today, 03:24 PM', 
      expiry: 'N/A', 
      created: '02/01/2026',
      manager: 'Sarah K.'
    },
    { 
      id: '#TEN-4', 
      name: 'Texas Hotshot Carriers', 
      plan: 'Professional', 
      status: 'HOLD', 
      branches: 1, 
      users: 4, 
      drivers: 6, 
      vehicles: 2, 
      loads: 0, 
      mrr: 499, 
      lastLogin: 'Yesterday, 10:15 AM', 
      expiry: '06/15/2026', 
      created: '05/20/2026',
      manager: 'Alex W.'
    },
    { 
      id: '#TEN-5', 
      name: 'Apex Logistics LLC', 
      plan: 'Professional', 
      status: 'ACTIVE', 
      branches: 3, 
      users: 16, 
      drivers: 18, 
      vehicles: 12, 
      loads: 6, 
      mrr: 4910, 
      lastLogin: 'Today, 01:10 PM', 
      expiry: 'N/A', 
      created: '06/19/2026',
      manager: 'Sarah K.'
    }
  ]);

  const handleProvisionTenant = (e) => {
    e.preventDefault();
    if (!tenantName || !managerEmail) return;

    const newTenant = {
      id: `#TEN-${Math.floor(6 + Math.random() * 1000)}`,
      name: tenantName,
      plan: selectedPlan.replace(' Tier', ''),
      status: 'ACTIVE',
      branches: 1,
      users: 1,
      drivers: 0,
      vehicles: 0,
      loads: 0,
      mrr: selectedPlan === 'Enterprise Tier' ? 28000 : selectedPlan === 'Professional Tier' ? 4910 : 499,
      lastLogin: 'Today, ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      expiry: 'N/A',
      created: new Date().toLocaleDateString('en-US'),
      manager: 'Sarah K.'
    };

    setCompanies([newTenant, ...companies]);
    setShowProvisionModal(false);
    showNotification(`Tenant "${tenantName}" successfully provisioned!`);
    setTenantName('');
    setManagerEmail('');
    setManagerPassword('');
    setSelectedPlan('Professional Tier');
  };

  const handleActionClick = (actionName, companyName) => {
    showNotification(`Triggered "${actionName}" for ${companyName}`);
    setActiveActionsMenu(null);
  };

  // Filter logic
  const filteredCompanies = companies.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.manager.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMinUsers = !minUsersFilter || c.users >= parseInt(minUsersFilter);
    const matchesPlan = selectedPlanFilter === 'All Plans' || c.plan.toLowerCase() === selectedPlanFilter.toLowerCase();
    const matchesStatus = selectedStatusFilter === 'All Statuses' || c.status.toLowerCase() === selectedStatusFilter.toLowerCase();

    return matchesSearch && matchesMinUsers && matchesPlan && matchesStatus;
  });

  return (
    <div className="flex-grow bg-[#F1F5F9] p-6 space-y-6 overflow-y-auto w-full text-left font-sans relative custom-scrollbar">
      
      {/* Custom scrollbar layout style */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
      `}</style>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg border border-slate-700/50 z-50 flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          {toast}
        </div>
      )}

      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Super Admin <span className="text-slate-350 font-black">•</span> Companies
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Configure global licensing rules, audit tenant margins, and resolve support tickets.
          </p>
        </div>
        
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button 
            onClick={() => {
              alert(`SaaS Tenant Registry summary:\nTotal registered companies: ${companies.length}`);
              showNotification('Report compiled.');
            }}
            className="border border-[#e2e8f0] hover:bg-slate-50 text-amber-500 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer bg-white"
          >
            Export Report
          </button>

          <button 
            onClick={() => setShowProvisionModal(true)}
            className="bg-[#FFD400] hover:bg-[#FFC800] text-black font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Provision Tenant
          </button>
        </div>
      </div>

      {/* Grid of 11 Metrics / KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">TOTAL COMPANIES</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">5</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 mt-2 block whitespace-nowrap">Registered tenants size Synced</span>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">ACTIVE COMPANIES</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">4</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 mt-2 block whitespace-nowrap">Active subscription sy... Stable</span>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">TRIAL COMPANIES</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">0</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">SaaS trial instances</span>
            <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md shrink-0">+1 new</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">SUSPENDED COMPANIES</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">1</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">Suspended/On-Hold ...</span>
            <span className="text-[9px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md shrink-0">0 alerts</span>
          </div>
        </div>

        {/* Card 5 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">EXPIRING THIS MONTH</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">0</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">Trial instances expir...</span>
            <span className="text-[9px] font-black text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-md shrink-0">1 warning</span>
          </div>
        </div>

        {/* Card 6 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">MONTHLY REVENUE</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">$41,909</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">MRR platform baseline</span>
            <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md shrink-0">+8%</span>
          </div>
        </div>

        {/* Card 7 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">ANNUAL REVENUE</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">$5,02,908</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">ARR projection rate</span>
            <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md shrink-0">+12%</span>
          </div>
        </div>

        {/* Card 8 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">ACTIVE USERS</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">118</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">Managers & staff a...</span>
            <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md shrink-0">+3 active</span>
          </div>
        </div>

        {/* Card 9 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">TOTAL DRIVERS</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">172</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 mt-2 block whitespace-nowrap">SaaS fleet drivers pool Stable</span>
        </div>

        {/* Card 10 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">TOTAL LOADS</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">73</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">Loads managed all-...</span>
            <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md shrink-0">+4 today</span>
          </div>
        </div>

        {/* Card 11 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">STORAGE USAGE</span>
            <span className="text-xl font-black text-slate-800 block mt-1.5">4.78 TB / 10 TB</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 mt-2 block whitespace-nowrap">Total data usage pool Normal</span>
        </div>

        {/* 12th grid space (empty/blank in mockup) */}
        <div className="hidden lg:block bg-transparent" />
      </div>

      {/* Advanced Filters Panel & Main Filters Toolbar */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-64 text-left">
              <input
                type="text"
                placeholder="Search workspaces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none placeholder:text-slate-400 text-slate-800 font-bold"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            </div>

            <button
              onClick={() => setAdvancedSearchOpen(!advancedSearchOpen)}
              className={`flex items-center gap-1.5 border font-extrabold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer ${
                advancedSearchOpen 
                  ? 'border-black border bg-slate-50 text-slate-900' 
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <Filter className="w-3.5 h-3.5" /> Advanced Filters
            </button>
          </div>

          <div className="flex flex-col items-end gap-3">
            {/* Export buttons */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => showNotification('Export generate successfully')}
                className="border border-amber-500 hover:bg-amber-50/10 text-yellow-600 font-extrabold text-[11px] px-3.5 py-2 rounded-xl transition-colors cursor-pointer bg-white"
              >
                CSV Export
              </button>
              <button 
                onClick={() => showNotification('Export generate successfully')}
                className="border border-amber-500 hover:bg-amber-50/10 text-yellow-600 font-extrabold text-[11px] px-3.5 py-2 rounded-xl transition-colors cursor-pointer bg-white"
              >
                Excel Export
              </button>
              <button 
                onClick={() => showNotification('Export generate successfully')}
                className="border border-amber-500 hover:bg-amber-50/10 text-yellow-600 font-extrabold text-[11px] px-3.5 py-2 rounded-xl transition-colors cursor-pointer bg-white"
              >
                PDF Export
              </button>
            </div>

            <div className="flex items-center gap-4">
              {/* Density Selector */}
              <div className="bg-slate-100 p-0.5 rounded-xl flex gap-0.5 border border-slate-200">
                {['COMPACT', 'DEFAULT', 'RELAXED'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setDensity(mode)}
                    className={`px-3 py-1.5 text-[9px] font-black rounded-lg transition-all cursor-pointer ${
                      density === mode
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
                  className="bg-white border border-black hover:bg-slate-50 text-slate-700 font-extrabold text-[11px] px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-500" />
                  <span>COLUMNS</span>
                </button>

              {showColumnsMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-250 rounded-2xl shadow-xl p-3 z-45 space-y-1.5 text-left text-xs text-slate-750 font-black max-h-60 overflow-y-auto custom-scrollbar">
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100 mb-1.5">COLUMN VISIBILITY</span>
                  
                  {/* Master checklist checkboxes */}
                  <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={visibleColumns.checkboxes}
                      onChange={() => setVisibleColumns(prev => ({ ...prev, checkboxes: !prev.checkboxes }))}
                      className="w-3.5 h-3.5 text-[#FFD400] rounded focus:ring-0 cursor-pointer"
                    />
                    <div className="w-3.5 h-3.5 border border-slate-300 rounded" />
                  </label>

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
                      checked={visibleColumns.companyId}
                      onChange={() => setVisibleColumns(prev => ({ ...prev, companyId: !prev.companyId }))}
                      className="w-3.5 h-3.5 text-[#FFD400] rounded focus:ring-0 cursor-pointer"
                    />
                    <span>Company ID</span>
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
                      checked={visibleColumns.branches}
                      onChange={() => setVisibleColumns(prev => ({ ...prev, branches: !prev.branches }))}
                      className="w-3.5 h-3.5 text-[#FFD400] rounded focus:ring-0 cursor-pointer"
                    />
                    <span>Branches</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={visibleColumns.users}
                      onChange={() => setVisibleColumns(prev => ({ ...prev, users: !prev.users }))}
                      className="w-3.5 h-3.5 text-[#FFD400] rounded focus:ring-0 cursor-pointer"
                    />
                    <span>Users</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={visibleColumns.drivers}
                      onChange={() => setVisibleColumns(prev => ({ ...prev, drivers: !prev.drivers }))}
                      className="w-3.5 h-3.5 text-[#FFD400] rounded focus:ring-0 cursor-pointer"
                    />
                    <span>Drivers</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={visibleColumns.fleetVehicles}
                      onChange={() => setVisibleColumns(prev => ({ ...prev, fleetVehicles: !prev.fleetVehicles }))}
                      className="w-3.5 h-3.5 text-[#FFD400] rounded focus:ring-0 cursor-pointer"
                    />
                    <span>Fleet Vehicles</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={visibleColumns.activeLoads}
                      onChange={() => setVisibleColumns(prev => ({ ...prev, activeLoads: !prev.activeLoads }))}
                      className="w-3.5 h-3.5 text-[#FFD400] rounded focus:ring-0 cursor-pointer"
                    />
                    <span>Active Loads</span>
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
                      checked={visibleColumns.lastLogin}
                      onChange={() => setVisibleColumns(prev => ({ ...prev, lastLogin: !prev.lastLogin }))}
                      className="w-3.5 h-3.5 text-[#FFD400] rounded focus:ring-0 cursor-pointer"
                    />
                    <span>Last Login</span>
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
                      checked={visibleColumns.createdDate}
                      onChange={() => setVisibleColumns(prev => ({ ...prev, createdDate: !prev.createdDate }))}
                      className="w-3.5 h-3.5 text-[#FFD400] rounded focus:ring-0 cursor-pointer"
                    />
                    <span>Created Date</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={visibleColumns.accountManager}
                      onChange={() => setVisibleColumns(prev => ({ ...prev, accountManager: !prev.accountManager }))}
                      className="w-3.5 h-3.5 text-[#FFD400] rounded focus:ring-0 cursor-pointer"
                    />
                    <span>Account Manager</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

        {/* Advanced Filters Expandable Content */}
        {advancedSearchOpen && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 text-left grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold text-slate-700">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Plan Level Filter</label>
              <select
                value={selectedPlanFilter}
                onChange={(e) => setSelectedPlanFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-[#FFD400] text-xs font-bold rounded-xl focus:outline-none text-slate-800 cursor-pointer"
              >
                <option value="All Plans">All Plans</option>
                <option value="Starter">Starter</option>
                <option value="Professional">Professional</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Status Filter</label>
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-[#FFD400] text-xs font-bold rounded-xl focus:outline-none text-slate-800 cursor-pointer"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="HOLD">HOLD</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Min Active Users</label>
              <input
                type="number"
                placeholder="e.g. 10"
                value={minUsersFilter}
                onChange={(e) => setMinUsersFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Corporate Tenants Table Card */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs font-bold text-slate-700 min-w-[1300px]">
            <thead>
              <tr className="bg-slate-50/50 text-[9px] font-black text-slate-450 uppercase tracking-wider border-b border-slate-100">
                {visibleColumns.checkboxes && (
                  <>
                    <th className="py-4 px-3 text-center w-10">
                      <input type="checkbox" className="w-3.5 h-3.5 rounded cursor-pointer" />
                    </th>
                    <th className="py-4 px-3 text-center w-10">
                      <input type="checkbox" className="w-3.5 h-3.5 rounded cursor-pointer" />
                    </th>
                  </>
                )}
                {visibleColumns.companyName && <th className="py-4 px-4">COMPANY NAME</th>}
                {visibleColumns.companyId && <th className="py-4 px-4">COMPANY ID</th>}
                {visibleColumns.subscriptionPlan && <th className="py-4 px-4">SUBSCRIPTION PLAN</th>}
                {visibleColumns.status && <th className="py-4 px-4">STATUS</th>}
                {visibleColumns.branches && <th className="py-4 px-4">BRANCHES</th>}
                {visibleColumns.users && <th className="py-4 px-4">USERS</th>}
                {visibleColumns.drivers && <th className="py-4 px-4">DRIVERS</th>}
                {visibleColumns.fleetVehicles && <th className="py-4 px-4">FLEET VEHICLES</th>}
                {visibleColumns.activeLoads && <th className="py-4 px-4">ACTIVE LOADS</th>}
                {visibleColumns.monthlyRevenue && <th className="py-4 px-4">MONTHLY REVENUE</th>}
                {visibleColumns.lastLogin && <th className="py-4 px-4">LAST LOGIN</th>}
                {visibleColumns.trialExpiry && <th className="py-4 px-4">TRIAL EXPIRY</th>}
                {visibleColumns.createdDate && <th className="py-4 px-4">CREATED DATE</th>}
                {visibleColumns.accountManager && <th className="py-4 px-4">ACCOUNT MANAGER</th>}
                <th className="py-4 px-6 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-750 bg-white">
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan="17" className="py-12 text-center text-slate-400 font-semibold bg-white w-full">
                    No active corporate tenants found matching filters.
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((c) => {
                  // Density padding configurations based on COMPACT, DEFAULT, RELAXED screenshots!
                  const pyPadding = density === 'COMPACT' ? 'py-1.5' : density === 'RELAXED' ? 'py-4.5' : 'py-3';

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                      {visibleColumns.checkboxes && (
                        <>
                          <td className={`${pyPadding} px-3 text-center w-10`}>
                            <input type="checkbox" className="w-3.5 h-3.5 rounded cursor-pointer" />
                          </td>
                          <td className={`${pyPadding} px-3 text-center w-10`}>
                            <input type="checkbox" className="w-3.5 h-3.5 rounded cursor-pointer" />
                          </td>
                        </>
                      )}
                      
                      {visibleColumns.companyName && (
                        <td className={`${pyPadding} px-4`}>
                          <span className="text-slate-900 font-black block whitespace-pre-line">{c.name}</span>
                        </td>
                      )}
                      
                      {visibleColumns.companyId && (
                        <td className={`${pyPadding} px-4 font-mono font-medium text-slate-400`}>
                          {c.id}
                        </td>
                      )}

                      {visibleColumns.subscriptionPlan && (
                        <td className={`${pyPadding} px-4 text-slate-800`}>
                          {c.plan}
                        </td>
                      )}

                      {visibleColumns.status && (
                        <td className={`${pyPadding} px-4`}>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            c.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-amber-50 text-amber-600'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                      )}

                      {visibleColumns.branches && (
                        <td className={`${pyPadding} px-4 text-slate-800`}>
                          {c.branches}
                        </td>
                      )}

                      {visibleColumns.users && (
                        <td className={`${pyPadding} px-4 text-slate-800`}>
                          {c.users}
                        </td>
                      )}

                      {visibleColumns.drivers && (
                        <td className={`${pyPadding} px-4 text-slate-800`}>
                          {c.drivers}
                        </td>
                      )}

                      {visibleColumns.fleetVehicles && (
                        <td className={`${pyPadding} px-4 text-slate-800`}>
                          {c.vehicles}
                        </td>
                      )}

                      {visibleColumns.activeLoads && (
                        <td className={`${pyPadding} px-4 text-slate-800`}>
                          {c.loads}
                        </td>
                      )}

                      {visibleColumns.monthlyRevenue && (
                        <td className={`${pyPadding} px-4 text-[#10B981] font-black`}>
                          ${c.mrr.toLocaleString()}
                        </td>
                      )}

                      {visibleColumns.lastLogin && (
                        <td className={`${pyPadding} px-4 text-slate-600 font-medium`}>
                          {c.lastLogin}
                        </td>
                      )}

                      {visibleColumns.trialExpiry && (
                        <td className={`${pyPadding} px-4 text-slate-600 font-medium font-mono`}>
                          {c.expiry}
                        </td>
                      )}

                      {visibleColumns.createdDate && (
                        <td className={`${pyPadding} px-4 text-slate-600 font-medium font-mono`}>
                          {c.created}
                        </td>
                      )}

                      {visibleColumns.accountManager && (
                        <td className={`${pyPadding} px-4 text-slate-800 font-black`}>
                          {c.manager}
                        </td>
                      )}

                      <td className={`${pyPadding} px-6 text-center relative`}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveActionsMenu(activeActionsMenu === c.id ? null : c.id);
                          }}
                          className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-[10px] px-3.5 py-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs"
                        >
                          Actions Menu
                        </button>

                        {/* Action dropdown card */}
                        {activeActionsMenu === c.id && (
                          <div 
                            ref={actionsMenuRef}
                            className="absolute right-6 mt-1 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-2.5 z-40 space-y-1 text-left text-xs text-slate-700 font-bold"
                          >
                            <button onClick={() => handleActionClick('Edit Tenant Details', c.name)} className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-slate-700 cursor-pointer">
                              Edit Tenant Details
                            </button>
                            <button onClick={() => handleActionClick('Adjust Margins Cap', c.name)} className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-slate-700 cursor-pointer">
                              Adjust Margins Cap
                            </button>
                            <button 
                              onClick={() => {
                                const activeState = c.status === 'ACTIVE' ? 'HOLD' : 'ACTIVE';
                                setCompanies(prev => prev.map(item => item.id === c.id ? { ...item, status: activeState } : item));
                                showNotification(`Toggled status of ${c.name} to ${activeState}`);
                                setActiveActionsMenu(null);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg cursor-pointer ${
                                c.status === 'ACTIVE' ? 'hover:bg-amber-50 text-amber-600' : 'hover:bg-emerald-50 text-emerald-600'
                              }`}
                            >
                              {c.status === 'ACTIVE' ? 'Suspend Tenant' : 'Activate Tenant'}
                            </button>
                            <button 
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to permanently delete tenant: ${c.name}?`)) {
                                  setCompanies(prev => prev.filter(item => item.id !== c.id));
                                  showNotification(`Deleted tenant ${c.name}`);
                                }
                                setActiveActionsMenu(null);
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-rose-50 rounded-lg text-rose-500 cursor-pointer"
                            >
                              Delete Tenant
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision New SaaS Tenant Modal */}
      {showProvisionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-[420px] overflow-hidden shadow-2xl animate-fade-in text-left">
            
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800">Provision New SaaS Tenant</h3>
              <button 
                onClick={() => setShowProvisionModal(false)} 
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
                  className="w-full bg-[#FFD400] hover:bg-[#FFC800] text-black font-extrabold text-xs py-3 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-md transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4 text-black" />
                  <span>Finalize Setup</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
