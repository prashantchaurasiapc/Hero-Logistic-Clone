import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Plus, Check, X, ShieldAlert, CheckCircle, ExternalLink,
  Settings, Download, FileText, Filter, ChevronDown, RefreshCw, AlertCircle, Loader2
} from 'lucide-react';
import api from '../../services/api';

export default function Companies() {
  const navigate = useNavigate();
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
  const [selectedPlan, setSelectedPlan] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [accountManager, setAccountManager] = useState('');
  const [trialExpiry, setTrialExpiry] = useState('');

  // Action Menu dropdown state
  const [activeActionsMenu, setActiveActionsMenu] = useState(null); // ID of company whose menu is open

  // Modals state
  const [showEditCompanyModal, setShowEditCompanyModal] = useState(false);
  const [showSuspendCompanyModal, setShowSuspendCompanyModal] = useState(false);
  const [showLoginAsModal, setShowLoginAsModal] = useState(false);
  const [showChangeSubscriptionModal, setShowChangeSubscriptionModal] = useState(false);
  const [showManageFeaturesModal, setShowManageFeaturesModal] = useState(false);
  const [showSendNotificationModal, setShowSendNotificationModal] = useState(false);
  const [selectedActionCompany, setSelectedActionCompany] = useState(null);

  // Inspector state
  const [showInspector, setShowInspector] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [activeInspectorTab, setActiveInspectorTab] = useState('Overview');

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

  const [companies, setCompanies] = useState([]);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCompaniesAndPlans = async () => {
    setIsLoading(true);
    try {
      const [companiesRes, plansRes] = await Promise.all([
        api.get('/companys'),
        api.get('/subscription-plans')
      ]);

      if (companiesRes.data.success) {
        const mappedData = companiesRes.data.data.map(company => {
          const activeSub = company.tenantSubscription;
          return {
            id: company.tenantId || company.id, // Or tenantId if populated
            name: company.name,
            plan: activeSub?.plan?.name || 'No Plan',
            status: company.status,
            branches: company._count?.branches || 0,
            users: company._count?.users || 0,
            drivers: company._count?.drivers || 0,
            vehicles: company._count?.vehicles || 0,
            loads: company._count?.loads || 0,
            mrr: activeSub?.plan?.monthlyPrice || 0,
            lastLogin: company.lastLogin ? new Date(company.lastLogin).toLocaleString() : 'N/A',
            expiry: company.trialExpiry ? new Date(company.trialExpiry).toLocaleDateString() : 'N/A',
            created: new Date(company.createdAt).toLocaleDateString(),
            manager: company.accountManager || 'N/A'
          };
        });
        setCompanies(mappedData);
      }

      if (plansRes.data.success) {
        setAvailablePlans(plansRes.data.data);
        if (plansRes.data.data.length > 0) {
          setSelectedPlan(plansRes.data.data[0].name);
        }
      }

    } catch (err) {
      console.error('Failed to load data:', err);
      showNotification('Failed to load tenants or plans data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompaniesAndPlans();
  }, []);

  useEffect(() => {
    if (selectedPlan && availablePlans.length > 0) {
      const plan = availablePlans.find(p => p.name === selectedPlan);
      if (plan && plan.trialDays) {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + plan.trialDays);
        setTrialExpiry(expiry.toISOString().split('T')[0]);
      } else {
        setTrialExpiry('');
      }
    }
  }, [selectedPlan, availablePlans]);

  const handleProvisionTenant = async (e) => {
    e.preventDefault();
    if (!tenantName || !managerEmail) return;

    try {
      setIsLoading(true);
      const res = await api.post('/companys', {
        name: tenantName,
        adminEmail: managerEmail,
        adminPassword: managerPassword,
        planTier: selectedPlan,
        tenantId: tenantId,
        status: status,
        accountManager: accountManager,
        trialExpiry: trialExpiry || null
      });
      
      if (res.data?.success) {
        showNotification(`Tenant "${tenantName}" successfully provisioned!`);
        setShowProvisionModal(false);
        setTenantName('');
        setManagerEmail('');
        setManagerPassword('');
        if (availablePlans.length > 0) setSelectedPlan(availablePlans[0].name);
        setTenantId('');
        setStatus('ACTIVE');
        setAccountManager('');
        setTrialExpiry('');
        fetchCompaniesAndPlans();
      }
    } catch (err) {
      console.error('Failed to create company:', err);
      showNotification(err.response?.data?.error?.message || 'Error provisioning tenant.');
    } finally {
      setIsLoading(false);
    }
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

  const exportCSV = () => {
    const headers = ['COMPANY NAME', 'COMPANY ID', 'SUBSCRIPTION PLAN', 'STATUS', 'BRANCHES', 'USERS', 'DRIVERS', 'FLEET VEHICLES', 'ACTIVE LOADS', 'MONTHLY REVENUE', 'LAST LOGIN', 'TRIAL EXPIRY', 'CREATED DATE', 'ACCOUNT MANAGER'];
    const csvRows = [headers.join(',')];

    filteredCompanies.forEach(c => {
      csvRows.push([
        `"${c.name}"`,
        `"${c.id}"`,
        `"${c.plan}"`,
        `"${c.status}"`,
        c.branches,
        c.users,
        c.drivers,
        c.vehicles,
        c.loads,
        `"$${c.mrr.toLocaleString()}"`,
        `"${c.lastLogin}"`,
        `"${c.expiry}"`,
        `"${c.created}"`,
        `"${c.manager}"`
      ].join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'companies_export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showNotification('CSV Export generated successfully.');
  };

  return (
    <div className="flex-grow bg-[#F1F5F9] p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto w-full text-left font-sans relative custom-scrollbar">

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
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
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
          <h1 className="text-xl sm:text-2xl text-slate-900 leading-8 capitalize font-black flex items-center gap-2">
            Super Admin <span className="text-slate-400 font-black">•</span> Companies
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400 font-semibold mt-1">
            Configure global licensing rules, audit tenant margins, and resolve support tickets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto w-full sm:w-auto">
          <button
            onClick={() => {
              alert(`SaaS Tenant Registry summary:\nTotal registered companies: ${companies.length}`);
              showNotification('Report compiled.');
            }}
            className="border border-[#e2e8f0] hover:bg-slate-50 text-amber-500 font-extrabold text-xs px-4 sm:px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer bg-white whitespace-nowrap flex-1 sm:flex-none"
          >
            Export Report
          </button>

          <button
            onClick={() => setShowProvisionModal(true)}
            className="bg-brand-500 hover:bg-brand-600 text-black font-extrabold text-xs px-4 sm:px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap flex-1 sm:flex-none"
          >
            <Plus className="w-4 h-4" /> Provision Tenant
          </button>
        </div>
      </div>

      {/* Grid of 11 Metrics / KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">TOTAL COMPANIES</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">{companies.length}</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">ACTIVE COMPANIES</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">{companies.filter(c => c.status === 'ACTIVE').length}</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">TRIAL COMPANIES</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">{companies.filter(c => c.status === 'TRIAL').length}</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">SUSPENDED COMPANIES</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">{companies.filter(c => c.status === 'HOLD').length}</span>
          </div>
        </div>

        {/* Card 5 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">EXPIRING THIS MONTH</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">
              {companies.filter(c => c.expiry && new Date(c.expiry) > new Date() && new Date(c.expiry) <= new Date(new Date().setMonth(new Date().getMonth() + 1))).length}
            </span>
          </div>
        </div>

        {/* Card 6 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">MONTHLY REVENUE</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">${companies.reduce((sum, c) => sum + (c.mrr || 0), 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Card 7 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">ANNUAL REVENUE</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">${(companies.reduce((sum, c) => sum + (c.mrr || 0), 0) * 12).toLocaleString()}</span>
          </div>
        </div>

        {/* Card 8 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">ACTIVE USERS</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">{companies.reduce((sum, c) => sum + (c.users || 0), 0)}</span>
          </div>
        </div>

        {/* Card 9 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">TOTAL DRIVERS</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">{companies.reduce((sum, c) => sum + (c.drivers || 0), 0)}</span>
          </div>
        </div>

        {/* Card 10 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">TOTAL LOADS</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">{companies.reduce((sum, c) => sum + (c.loads || 0), 0)}</span>
          </div>
        </div>

        {/* Card 11 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">STORAGE USAGE</span>
            <span className="text-xl font-black text-slate-800 block mt-1.5">N/A</span>
          </div>
        </div>

        {/* 12th grid space (empty/blank in mockup) */}
        <div className="hidden lg:block bg-transparent" />
      </div>

      {/* Advanced Filters Panel & Main Filters Toolbar */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs space-y-4 relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 flex-wrap">
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-64 text-left">
              <input
                type="text"
                placeholder="Search workspaces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 focus:border-brand-500 text-xs rounded-xl focus:outline-none placeholder:text-slate-400 text-slate-800 font-bold"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            </div>

            <button
              onClick={() => setAdvancedSearchOpen(!advancedSearchOpen)}
              className={`flex items-center justify-center gap-1.5 border font-extrabold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer w-full sm:w-auto ${advancedSearchOpen
                  ? 'border-black border bg-slate-50 text-slate-900'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
            >
              <Filter className="w-3.5 h-3.5" /> Advanced Filters
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto lg:justify-end">
            {/* Export buttons */}
            <div className="flex items-center gap-2 overflow-x-auto sm:w-auto pb-1 sm:pb-0 scrollbar-hide shrink-0">
              <button
                onClick={exportCSV}
                className="border border-amber-500 hover:bg-amber-50/10 text-yellow-600 font-extrabold text-[11px] px-3.5 py-2 rounded-xl transition-colors cursor-pointer bg-white whitespace-nowrap"
              >
                CSV Export
              </button>
              <button
                onClick={() => showNotification('Export generate successfully')}
                className="border border-amber-500 hover:bg-amber-50/10 text-yellow-600 font-extrabold text-[11px] px-3.5 py-2 rounded-xl transition-colors cursor-pointer bg-white whitespace-nowrap"
              >
                Excel Export
              </button>
              <button
                onClick={() => showNotification('Export generate successfully')}
                className="border border-amber-500 hover:bg-amber-50/10 text-yellow-600 font-extrabold text-[11px] px-3.5 py-2 rounded-xl transition-colors cursor-pointer bg-white whitespace-nowrap"
              >
                PDF Export
              </button>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
              {/* Density Selector */}
              <div className="bg-slate-100 p-0.5 rounded-xl flex gap-0.5 border border-slate-200 shrink-0">
                {['COMPACT', 'DEFAULT', 'RELAXED'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setDensity(mode)}
                    className={`px-3 py-1.5 text-[9px] font-black rounded-lg transition-all cursor-pointer ${density === mode
                        ? 'bg-brand-500 text-black shadow-xs font-black'
                        : 'text-black hover:bg-slate-200/50'
                      }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {/* Columns Visibility Checklist Button */}
              <div className="relative text-left shrink-0" ref={columnsMenuRef}>
                <button
                  onClick={() => setShowColumnsMenu(!showColumnsMenu)}
                  className="bg-white border border-black hover:bg-slate-50 text-slate-700 font-extrabold text-[11px] px-3.5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs whitespace-nowrap"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-500" />
                  <span>COLUMNS</span>
                </button>

                {showColumnsMenu && (
                  <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 space-y-1.5 text-left text-xs text-slate-700 font-black max-h-60 overflow-y-auto custom-scrollbar">
                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100 mb-1.5">COLUMN VISIBILITY</span>

                    {/* Master checklist checkboxes */}
                    <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={visibleColumns.checkboxes}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, checkboxes: !prev.checkboxes }))}
                        className="w-3.5 h-3.5 text-brand-500 rounded focus:ring-0 cursor-pointer"
                      />
                      <div className="w-3.5 h-3.5 border border-slate-300 rounded" />
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={visibleColumns.companyName}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, companyName: !prev.companyName }))}
                        className="w-3.5 h-3.5 text-brand-500 rounded focus:ring-0 cursor-pointer"
                      />
                      <span>Company Name</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={visibleColumns.companyId}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, companyId: !prev.companyId }))}
                        className="w-3.5 h-3.5 text-brand-500 rounded focus:ring-0 cursor-pointer"
                      />
                      <span>Company ID</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={visibleColumns.subscriptionPlan}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, subscriptionPlan: !prev.subscriptionPlan }))}
                        className="w-3.5 h-3.5 text-brand-500 rounded focus:ring-0 cursor-pointer"
                      />
                      <span>Subscription Plan</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={visibleColumns.status}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, status: !prev.status }))}
                        className="w-3.5 h-3.5 text-brand-500 rounded focus:ring-0 cursor-pointer"
                      />
                      <span>Status</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={visibleColumns.branches}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, branches: !prev.branches }))}
                        className="w-3.5 h-3.5 text-brand-500 rounded focus:ring-0 cursor-pointer"
                      />
                      <span>Branches</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={visibleColumns.users}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, users: !prev.users }))}
                        className="w-3.5 h-3.5 text-brand-500 rounded focus:ring-0 cursor-pointer"
                      />
                      <span>Users</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={visibleColumns.drivers}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, drivers: !prev.drivers }))}
                        className="w-3.5 h-3.5 text-brand-500 rounded focus:ring-0 cursor-pointer"
                      />
                      <span>Drivers</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={visibleColumns.fleetVehicles}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, fleetVehicles: !prev.fleetVehicles }))}
                        className="w-3.5 h-3.5 text-brand-500 rounded focus:ring-0 cursor-pointer"
                      />
                      <span>Fleet Vehicles</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={visibleColumns.activeLoads}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, activeLoads: !prev.activeLoads }))}
                        className="w-3.5 h-3.5 text-brand-500 rounded focus:ring-0 cursor-pointer"
                      />
                      <span>Active Loads</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={visibleColumns.monthlyRevenue}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, monthlyRevenue: !prev.monthlyRevenue }))}
                        className="w-3.5 h-3.5 text-brand-500 rounded focus:ring-0 cursor-pointer"
                      />
                      <span>Monthly Revenue</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={visibleColumns.lastLogin}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, lastLogin: !prev.lastLogin }))}
                        className="w-3.5 h-3.5 text-brand-500 rounded focus:ring-0 cursor-pointer"
                      />
                      <span>Last Login</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={visibleColumns.trialExpiry}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, trialExpiry: !prev.trialExpiry }))}
                        className="w-3.5 h-3.5 text-brand-500 rounded focus:ring-0 cursor-pointer"
                      />
                      <span>Trial Expiry</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={visibleColumns.createdDate}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, createdDate: !prev.createdDate }))}
                        className="w-3.5 h-3.5 text-brand-500 rounded focus:ring-0 cursor-pointer"
                      />
                      <span>Created Date</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-slate-900">
                      <input
                        type="checkbox"
                        checked={visibleColumns.accountManager}
                        onChange={() => setVisibleColumns(prev => ({ ...prev, accountManager: !prev.accountManager }))}
                        className="w-3.5 h-3.5 text-brand-500 rounded focus:ring-0 cursor-pointer"
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
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold text-slate-700">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Plan Level Filter</label>
              <select
                value={selectedPlanFilter}
                onChange={(e) => setSelectedPlanFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-brand-500 text-xs font-bold rounded-xl focus:outline-none text-slate-800 cursor-pointer"
              >
                <option value="All Plans">All Plans</option>
                {availablePlans.map(plan => (
                  <option key={plan.id} value={plan.name}>{plan.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Status Filter</label>
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-brand-500 text-xs font-bold rounded-xl focus:outline-none text-slate-800 cursor-pointer"
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
                className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-brand-500 text-xs rounded-xl focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Corporate Tenants Table Card */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs font-bold text-slate-700 min-w-[1300px] whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 text-[9px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
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
            <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700 bg-white">
              {isLoading ? (
                 <tr>
                  <td colSpan="17" className="py-12 text-center text-slate-400 font-semibold bg-white w-full flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Loading tenant registry...
                  </td>
                </tr>
              ) : filteredCompanies.length === 0 ? (
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
                          <span className="text-slate-900 font-black block whitespace-nowrap">{c.name}</span>
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
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${c.status === 'ACTIVE'
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
                            <button
                              onClick={() => {
                                setSelectedTenant(c);
                                setActiveInspectorTab('Overview');
                                setShowInspector(true);
                                setActiveActionsMenu(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-50 rounded-lg text-slate-700 cursor-pointer"
                            >
                              View Company
                            </button>
                            <button
                              onClick={() => {
                                setSelectedActionCompany(c);
                                setShowEditCompanyModal(true);
                                setActiveActionsMenu(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-50 rounded-lg text-slate-700 cursor-pointer"
                            >
                              Edit Company
                            </button>
                            <button
                              onClick={() => {
                                setSelectedActionCompany(c);
                                setShowSuspendCompanyModal(true);
                                setActiveActionsMenu(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-rose-50 rounded-lg text-rose-500 cursor-pointer"
                            >
                              {c.status === 'ACTIVE' ? 'Suspend Company' : 'Activate Company'}
                            </button>
                            <button
                              onClick={() => {
                                setSelectedActionCompany(c);
                                setShowLoginAsModal(true);
                                setActiveActionsMenu(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-50 rounded-lg text-slate-700 cursor-pointer mt-1"
                            >
                              Login as Company Admin
                            </button>
                            <button
                              onClick={() => {
                                setSelectedActionCompany(c);
                                setShowChangeSubscriptionModal(true);
                                setActiveActionsMenu(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-50 rounded-lg text-slate-700 cursor-pointer"
                            >
                              Change Subscription
                            </button>
                            <button
                              onClick={() => {
                                setSelectedActionCompany(c);
                                setShowManageFeaturesModal(true);
                                setActiveActionsMenu(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-50 rounded-lg text-slate-700 cursor-pointer"
                            >
                              Manage Features
                            </button>
                            <button onClick={() => navigate('/admin/billing')} className="w-full text-left px-3 py-1.5 hover:bg-slate-50 rounded-lg text-slate-700 cursor-pointer">
                              View Billing
                            </button>
                            <button
                              onClick={() => {
                                showNotification(`Sent password reset instruction email to administrator of ${c.name}.`);
                                setActiveActionsMenu(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-50 rounded-lg text-slate-700 cursor-pointer"
                            >
                              Reset Password
                            </button>
                            <button
                              onClick={() => {
                                setSelectedActionCompany(c);
                                setShowSendNotificationModal(true);
                                setActiveActionsMenu(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-50 rounded-lg text-slate-700 cursor-pointer mb-1 border-b border-slate-100"
                            >
                              Send Notification
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to permanently delete tenant: ${c.name}?`)) {
                                  setCompanies(prev => prev.filter(item => item.id !== c.id));
                                  showNotification(`Deleted tenant ${c.name}`);
                                }
                                setActiveActionsMenu(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-rose-50 rounded-lg text-rose-500 cursor-pointer"
                            >
                              Delete Company
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
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-[420px] max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl animate-fade-in text-left">

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
                  className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-brand-500 text-xs font-semibold rounded-xl focus:outline-none text-slate-800"
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
                  className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-brand-500 text-xs font-semibold rounded-xl focus:outline-none text-slate-800"
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
                  className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-brand-500 text-xs font-semibold rounded-xl focus:outline-none text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">LICENSE PLAN TIER</label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-brand-500 text-xs font-bold rounded-xl focus:outline-none text-slate-800 cursor-pointer"
                >
                  {availablePlans.map(plan => (
                    <option key={plan.id} value={plan.name}>{plan.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">COMPANY ID (Optional)</label>
                <input
                  type="text"
                  value={tenantId}
                  onChange={(e) => setTenantId(e.target.value)}
                  placeholder="e.g. #TEN-001"
                  className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-brand-500 text-xs font-semibold rounded-xl focus:outline-none text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">STATUS</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-brand-500 text-xs font-bold rounded-xl focus:outline-none text-slate-800 cursor-pointer"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="PROVISIONING">PROVISIONING</option>
                  <option value="TRIAL">TRIAL</option>
                  <option value="HOLD">HOLD</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              {status === 'TRIAL' && (
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">TRIAL EXPIRY DATE</label>
                  <input
                    type="date"
                    value={trialExpiry}
                    onChange={(e) => setTrialExpiry(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-brand-500 text-xs font-semibold rounded-xl focus:outline-none text-slate-800"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">ACCOUNT MANAGER (Optional)</label>
                <input
                  type="text"
                  value={accountManager}
                  onChange={(e) => setAccountManager(e.target.value)}
                  placeholder="e.g. John Smith"
                  className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-brand-500 text-xs font-semibold rounded-xl focus:outline-none text-slate-800"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-brand-500 hover:bg-brand-600 text-black font-extrabold text-xs py-3 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-md transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4 text-black" />
                  <span>Finalize Setup</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Configure Tenant Workspace Settings Modal */}
      {showEditCompanyModal && selectedActionCompany && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-[420px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800">Configure Tenant Workspace Settings</h3>
              <button onClick={() => setShowEditCompanyModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="p-6 space-y-5" onSubmit={async (e) => {
              e.preventDefault();
              try {
                setIsLoading(true);
                const name = e.target.elements.name.value;
                const adminEmail = e.target.elements.manager.value;
                const res = await api.put(`/companys/${selectedActionCompany.id}`, { name, adminEmail });
                if (res.data?.success) {
                  showNotification(`Configurations saved for ${name}`);
                  setShowEditCompanyModal(false);
                  fetchCompaniesAndPlans();
                }
              } catch (err) {
                showNotification('Error updating company.');
              } finally {
                setIsLoading(false);
              }
            }}>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">COMPANY NAME</label>
                <input name="name" type="text" defaultValue={selectedActionCompany.name} className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-brand-500 text-xs font-semibold rounded-xl focus:outline-none text-slate-800" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">ADMINISTRATOR EMAIL</label>
                <input name="manager" type="text" defaultValue={selectedActionCompany.manager} className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-brand-500 text-xs font-semibold rounded-xl focus:outline-none text-slate-800" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">SUBSCRIPTION TIER LEVEL</label>
                <select name="plan" defaultValue={selectedActionCompany.plan + ' Tier'} className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-brand-500 text-xs font-semibold rounded-xl focus:outline-none text-slate-800 cursor-pointer">
                  <option>Starter Tier</option>
                  <option>Professional Tier</option>
                  <option>Enterprise Tier</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full mt-2 bg-[#FFB020] hover:bg-brand-600 text-black font-extrabold text-[13px] py-4 rounded-xl transition-all cursor-pointer shadow-sm flex flex-col items-center justify-center"
              >
                <Check className="w-4 h-4 mb-1" />
                Save Configurations
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Suspend Company License Modal */}
      {showSuspendCompanyModal && selectedActionCompany && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-[420px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800">Suspend Company License</h3>
              <button onClick={() => setShowSuspendCompanyModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">SELECT COMPANY TO SUSPEND</label>
                <select defaultValue={selectedActionCompany.name} className="w-full px-4 py-3 bg-white border border-brand-500 text-xs font-semibold rounded-xl focus:outline-none text-slate-800 cursor-pointer">
                  <option>{selectedActionCompany.name}</option>
                  {companies.filter(c => c.name !== selectedActionCompany.name).map(c => <option key={c.id}>{c.name}</option>)}
                </select>
              </div>
              <button
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    const res = await api.put(`/companys/${selectedActionCompany.id}`, { status: 'HOLD' });
                    if (res.data?.success) {
                      showNotification(`Suspended license for ${selectedActionCompany.name}`);
                      setShowSuspendCompanyModal(false);
                      fetchCompaniesAndPlans();
                    }
                  } catch (err) {
                    showNotification('Error suspending company.');
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className="w-full bg-[#E11D48] hover:bg-[#BE123C] text-white font-extrabold text-[13px] py-4 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Suspend License
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulate Login Session Modal */}
      {showLoginAsModal && selectedActionCompany && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-[420px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800">Simulate Login Session</h3>
              <button onClick={() => setShowLoginAsModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">SELECT COMPANY WORKSPACE</label>
                <select
                  defaultValue={selectedActionCompany.name}
                  className="w-full px-4 py-3 bg-white border border-brand-500 text-xs font-semibold rounded-xl focus:outline-none text-slate-800 cursor-pointer"
                  onChange={(e) => {
                    const comp = companies.find(c => c.name === e.target.value);
                    if (comp) setSelectedActionCompany(comp);
                  }}
                >
                  <option disabled>-- Select Company --</option>
                  {companies.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <button
                onClick={() => {
                  showNotification(`Logged in as admin of ${selectedActionCompany.name}`);
                  setShowLoginAsModal(false);
                }}
                className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-extrabold text-[13px] py-4 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Login as Administrator
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Subscription Modal */}
      {showChangeSubscriptionModal && selectedActionCompany && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-[420px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800">Change Subscription for {selectedActionCompany.name}</h3>
              <button onClick={() => setShowChangeSubscriptionModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">SELECT SUBSCRIPTION PLAN TIER</label>
                <select
                  defaultValue={`${selectedActionCompany.plan} Tier - $${selectedActionCompany.mrr}/mo`}
                  className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-brand-500 text-xs font-semibold rounded-xl focus:outline-none text-slate-800 cursor-pointer"
                >
                  <option>Starter Tier - $499/mo</option>
                  <option>Professional Tier - $4,910/mo</option>
                  <option>Professional Tier - $8,500/mo</option>
                  <option>Enterprise Tier - $28,000/mo</option>
                </select>
              </div>
              <button
                onClick={() => {
                  showNotification(`Subscription updated for ${selectedActionCompany.name}`);
                  setShowChangeSubscriptionModal(false);
                }}
                className="w-full bg-[#FFB020] hover:bg-brand-600 text-black font-extrabold text-[13px] py-4 rounded-xl transition-all cursor-pointer shadow-sm mt-2"
              >
                Update Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Feature Access Modal */}
      {showManageFeaturesModal && selectedActionCompany && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-[420px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800">Manage Feature Access for {selectedActionCompany.name}</h3>
              <button onClick={() => setShowManageFeaturesModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs font-medium text-slate-500 mb-2">Configure custom granular policies for the company workspace instance.</p>

              <label className="flex items-center gap-3 cursor-pointer py-1">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-[#3B82F6] rounded border-slate-300 focus:ring-0 cursor-pointer" />
                <span className="text-xs font-bold text-slate-600">GPS Geofencing Mapping</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer py-1">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-[#3B82F6] rounded border-slate-300 focus:ring-0 cursor-pointer" />
                <span className="text-xs font-bold text-slate-600">AI Route Dispatch Automation</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer py-1">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-[#3B82F6] rounded border-slate-300 focus:ring-0 cursor-pointer" />
                <span className="text-xs font-bold text-slate-600">ELD Compliance Forms</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer py-1">
                <input type="checkbox" className="w-4 h-4 text-[#3B82F6] rounded border-slate-300 focus:ring-0 cursor-pointer" />
                <span className="text-xs font-bold text-slate-600">SMS Carrier Alerts</span>
              </label>

              <button
                onClick={() => {
                  showNotification(`Features updated for ${selectedActionCompany.name}`);
                  setShowManageFeaturesModal(false);
                }}
                className="w-full bg-[#FFB020] hover:bg-brand-600 text-black font-extrabold text-[13px] py-4 rounded-xl transition-all cursor-pointer shadow-sm mt-4"
              >
                Save Granular Features
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Notification Modal */}
      {showSendNotificationModal && selectedActionCompany && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-[500px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800">Broadcast Notification to {selectedActionCompany.name}</h3>
              <button onClick={() => setShowSendNotificationModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">NOTIFICATION PAYLOAD MESSAGE</label>
                <textarea
                  placeholder="Type announcement message..."
                  className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-brand-500 text-xs font-medium rounded-xl focus:outline-none text-slate-800 h-24 resize-none"
                ></textarea>
              </div>
              <button
                onClick={() => {
                  showNotification(`Broadcast message sent to ${selectedActionCompany.name}`);
                  setShowSendNotificationModal(false);
                }}
                className="w-full bg-[#FFB020] hover:bg-brand-600 text-black font-extrabold text-[13px] py-4 rounded-xl transition-all cursor-pointer shadow-sm mt-2"
              >
                Broadcast Message
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
                  <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-wider">Workspace ID: #{selectedTenant?.id || '1'}</p>
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
                        ? 'bg-brand-500 text-slate-900 font-black shadow-sm border-2 border-slate-900'
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
                        <p className="text-slate-800 font-bold text-[12px]">{selectedTenant?.created}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-0.5">Last Login</p>
                        <p className="text-slate-800 font-bold text-[12px]">{selectedTenant?.lastLogin || 'N/A'}</p>
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
                        <p className="text-slate-800 font-black text-sm">{selectedTenant?.users || 0}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-0.5">Total Drivers</p>
                        <p className="text-slate-800 font-black text-sm">{selectedTenant?.drivers || 0}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-0.5">Fleet Vehicles</p>
                        <p className="text-slate-800 font-black text-sm">{selectedTenant?.vehicles || 0}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-0.5">Branches count</p>
                        <p className="text-slate-800 font-black text-sm">{selectedTenant?.branches || 0}</p>
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
                      <span className="text-[#D97706] font-extrabold text-[12px]">{selectedTenant?.plan || 'N/A'}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-slate-400 text-[12px] font-bold">Contract Billing Rate:</span>
                      <span className="text-slate-800 font-extrabold text-[12px]">${(selectedTenant?.mrr || 0).toLocaleString()} / month</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-slate-400 text-[12px] font-bold">Billing Cycle Period:</span>
                      <span className="text-slate-800 font-extrabold text-[12px]">Monthly Auto-Renewal recurring</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="text-slate-400 text-[12px] font-bold">Trial Expiry:</span>
                      <span className="text-slate-800 font-extrabold text-[12px]">{selectedTenant?.expiry || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeInspectorTab === 'Users' && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">REGISTERED ACCOUNT STAFF MEMBERS</h4>
                  <div className="bg-white border border-slate-100 rounded-2xl shadow-sm shadow-slate-200/40 overflow-hidden divide-y divide-slate-100">
                    <div className="p-4 text-center text-slate-500 text-xs">No specific user details available in this view.</div>
                  </div>
                </div>
              )}

              {activeInspectorTab === 'Branches' && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">ACTIVE BRANCH TERMINALS</h4>
                  <div className="bg-white border border-slate-100 rounded-2xl shadow-sm shadow-slate-200/40 overflow-hidden divide-y divide-slate-100">
                    <div className="p-4 text-center text-slate-500 text-xs">No specific branch details available in this view.</div>
                  </div>
                </div>
              )}

              {activeInspectorTab === 'Fleet' && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">REGISTERED FLEET ASSET VEHICLES</h4>
                  <div className="bg-white border border-slate-100 rounded-2xl shadow-sm shadow-slate-200/40 overflow-hidden divide-y divide-slate-100">
                    <div className="p-4 text-center text-slate-500 text-xs">No specific fleet details available in this view.</div>
                  </div>
                </div>
              )}

              {activeInspectorTab === 'Loads' && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">LOADS MANIFEST SUMMARY</h4>
                  <div className="bg-white border border-slate-100 rounded-2xl shadow-sm shadow-slate-200/40 overflow-hidden divide-y divide-slate-100">
                    <div className="p-4 text-center text-slate-500 text-xs">No specific load details available in this view.</div>
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
                        <span className="text-emerald-500 font-extrabold text-[12px]">${(selectedTenant?.mrr || 0).toLocaleString()}/mo</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeInspectorTab === 'Support Tickets' && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">INBOUND TICKET QUERIES RAISED</h4>
                  <div className="bg-white border border-slate-100 rounded-2xl shadow-sm shadow-slate-200/40 p-4 text-center text-slate-500 text-xs">No open tickets found.</div>
                </div>
              )}

              {activeInspectorTab === 'Feature Access' && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">VISUAL FEATURE PERMISSIONS</h4>
                  <div className="bg-white border border-slate-100 rounded-2xl shadow-sm shadow-slate-200/40 p-4 text-center text-slate-500 text-xs">No granular permissions configured.</div>
                </div>
              )}

              {activeInspectorTab === 'Audit Log' && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">SUBSCRIPTION AUDIT FEED</h4>
                  <div className="bg-white border border-slate-100 rounded-2xl shadow-sm shadow-slate-200/40 p-4 text-center text-slate-500 text-xs">No activity logs recorded.</div>
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
              
              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <button
                  onClick={fetchCompaniesAndPlans}
                  className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-[11px] py-2 px-4 rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
                </button>
                <button
                  onClick={() => setShowInspector(false)}
                  className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-[11px] font-bold hover:bg-slate-50 transition-colors text-center cursor-pointer"
                >
                  Close Inspector
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
