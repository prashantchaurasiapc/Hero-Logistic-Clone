import React, { useState, useEffect, useRef } from 'react';
import { 
  Layers, Plus, Trash2, Edit2, Check, X, ShieldAlert, 
  Download, Filter, Calendar, Settings, FileText, ChevronDown, 
  TrendingUp, RefreshCw, BarChart2, Users, DollarSign, Search, CheckCircle, ArrowRight,
  Percent, AlertCircle, CreditCard, ArrowLeftRight
} from 'lucide-react';

export default function MembershipPlans() {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'annual'
  const [activeSubTab, setActiveSubTab] = useState('Plan Registry');
  const [searchQuery, setSearchQuery] = useState('');
  const [promoSearchQuery, setPromoSearchQuery] = useState('');
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('All Invoices');
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [toast, setToast] = useState('');

  // Modals state
  const [showWizard, setShowWizard] = useState(false);
  const [wizardMode, setWizardMode] = useState('create'); // 'create' or 'configure'
  const [wizardStep, setWizardStep] = useState(1);
  const [showDeprecateModal, setShowDeprecateModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Versioning Drawer state
  const [showVersioningDrawer, setShowVersioningDrawer] = useState(false);
  const [versioningPlan, setVersioningPlan] = useState(null);
  const [versionCompareA, setVersionCompareA] = useState('-- Select A --');
  const [versionCompareB, setVersionCompareB] = useState('-- Select B --');

  // Inspect Receipt Modal state
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  // Promo Coupon Modal state
  const [showPromoModal, setShowPromoModal] = useState(false);

  // Filters State
  const [showFilters, setShowFilters] = useState(false);
  const [filterState, setFilterState] = useState('All States');
  const [filterMinPrice, setFilterMinPrice] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({
    state: 'All States',
    minPrice: '',
    maxPrice: ''
  });

  // Columns dropdown state
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    name: true,
    version: true,
    status: true,
    pricing: true,
    trialDays: true,
    subscribers: true,
    revenue: true,
    createdBy: true,
    lastUpdated: true,
    actions: true
  });

  const columnsDropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (columnsDropdownRef.current && !columnsDropdownRef.current.contains(event.target)) {
        setShowColumnsDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Wizard form state
  const [formName, setFormName] = useState('');
  const [formVersion, setFormVersion] = useState('1.0.0');
  const [formStatus, setFormStatus] = useState('Draft');
  const [formDesc, setFormDesc] = useState('');

  // Promo Coupon Form State
  const [promoCode, setPromoCode] = useState('');
  const [promoType, setPromoType] = useState('Percentage Off (%)');
  const [promoValue, setPromoValue] = useState('');
  const [promoCampaignName, setPromoCampaignName] = useState('');
  const [promoExpiryDate, setPromoExpiryDate] = useState('');
  const [promoLimit, setPromoLimit] = useState('100');

  // Bulk Migration Select values
  const [migrationSource, setMigrationSource] = useState('-- Select Plan --');
  const [migrationTarget, setMigrationTarget] = useState('-- Select Plan --');
  
  const [plans, setPlans] = useState([
    {
      id: 'plan-starter',
      name: 'Starter',
      version: 'v1.0.0',
      status: 'Published',
      monthlyPrice: 199,
      annualPrice: 1990,
      trialDays: 14,
      subscribers: 1,
      mrr: 1500,
      users: 3,
      drivers: 5,
      vehicles: 5,
      storage: '10 GB',
      modules: ['Dispatch', 'Fleet', 'GPS', 'Driver App'],
      createdBy: 'System Root',
      createdDate: '06/20/2026, 09:00:00 AM'
    },
    {
      id: 'plan-professional',
      name: 'Professional',
      version: 'v1.1.0',
      status: 'Published',
      monthlyPrice: 499,
      annualPrice: 4990,
      trialDays: 14,
      subscribers: 2,
      mrr: 13410,
      users: 15,
      drivers: 30,
      vehicles: 30,
      storage: '100 GB',
      modules: ['Dispatch', 'Fleet', 'GPS', 'Driver App'],
      createdBy: 'System Root',
      createdDate: '06/20/2026, 09:05:00 AM'
    },
    {
      id: 'plan-enterprise',
      name: 'Enterprise',
      version: 'v2.0.0',
      status: 'Published',
      monthlyPrice: 1299,
      annualPrice: 12990,
      trialDays: 30,
      subscribers: 1,
      mrr: 28000,
      users: 999,
      drivers: 999,
      vehicles: 999,
      storage: '1000 GB',
      modules: ['Dispatch', 'Fleet', 'GPS', 'Driver App', 'AI dispatch'],
      createdBy: 'System Root',
      createdDate: '06/20/2026, 09:10:00 AM'
    },
    {
      id: 'plan-custom-enterprise',
      name: 'Custom Enterprise',
      version: 'v1.0.0',
      status: 'Published',
      monthlyPrice: 2999,
      annualPrice: 29990,
      trialDays: 30,
      subscribers: 0,
      mrr: 0,
      users: 9999,
      drivers: 9999,
      vehicles: 9999,
      storage: '10000 GB',
      modules: ['Dispatch', 'Fleet', 'GPS', 'Driver App', 'AI dispatch'],
      createdBy: 'System Root',
      createdDate: '06/20/2026, 09:15:00 AM'
    }
  ]);

  const [promos, setPromos] = useState([
    {
      code: 'WELCOME10',
      campaignName: 'Q2 Welcome Offer',
      type: 'Percentage Discount',
      valueText: '10% off',
      redemptions: 42,
      limit: 100,
      expiryDate: '2026-12-31',
      status: 'Active'
    },
    {
      code: 'PROMO50',
      campaignName: 'Summer Carrier Drive',
      type: 'Fixed Discount',
      valueText: '$50 off',
      redemptions: 12,
      limit: 50,
      expiryDate: '2026-08-31',
      status: 'Active'
    },
    {
      code: 'EXTEND30',
      campaignName: 'Partner Trial Extensions',
      type: 'Trial Extension',
      valueText: '30 extra days',
      redemptions: 78,
      limit: 200,
      expiryDate: '2026-09-30',
      status: 'Active'
    }
  ]);

  // Trial Subscribers data list
  const [trials, setTrials] = useState([
    {
      company: 'Swift Cargo Express',
      admin: 'Alex W.',
      expiryDate: '07/15/2026',
      daysRemaining: '2 Days',
      limitsViolations: 'Users: 2/3 • Drivers: 3/5',
      status: 'Active trial'
    },
    {
      company: 'Texas Hotshot Carriers',
      admin: 'Alex W.',
      expiryDate: '06/15/2026',
      daysRemaining: 'Expired',
      limitsViolations: 'Users: 4/3 • Drivers: 6/5',
      status: 'Hold / Inactive'
    }
  ]);

  // Invoices list (Screenshot 2)
  const [invoices, setInvoices] = useState([
    { invoiceNo: 'INV-1001A', company: 'Falcon Logistics LLC', plan: 'Professional', period: '06/12/2026 - 07/12/2026', date: '06/12/2026', status: 'Paid', method: 'Stripe Gateway Gateway API', amount: '$8,500' },
    { invoiceNo: 'INV-1002A', company: 'Falcon Logistics LLC', plan: 'Professional', period: '06/15/2026 - 06/29/2026', date: '06/15/2026', status: 'Sent', method: 'Stripe Gateway Gateway API', amount: '$4,200' },
    { invoiceNo: 'INV-1003A', company: 'Falcon Logistics LLC', plan: 'Professional', period: '06/20/2026 - 07/04/2026', date: '06/20/2026', status: 'Draft', method: 'Stripe Gateway Gateway API', amount: '$3,100' },
    { invoiceNo: 'INV-1004A', company: 'Falcon Logistics LLC', plan: 'Professional', period: '05/10/2026 - 05/24/2026', date: '05/10/2026', status: 'Overdue', method: 'Stripe Gateway Gateway API', amount: '$5,000' },
    { invoiceNo: 'INV-1002A', company: 'Swift Cargo Express', plan: 'Professional', period: '06/19/2026 - 07/19/2026', date: '06/19/2026', status: 'Paid', method: 'MasterCard ending 8192', amount: '$1,500' },
    { invoiceNo: 'INV-1002B', company: 'Swift Cargo Express', plan: 'Professional', period: '05/19/2026 - 06/19/2026', date: '05/19/2026', status: 'Paid', method: 'MasterCard ending 8192', amount: '$1,500' },
    { invoiceNo: 'INV-1002C', company: 'Swift Cargo Express', plan: 'Professional', period: '04/19/2026 - 05/19/2026', date: '04/19/2026', status: 'Paid', method: 'MasterCard ending 8192', amount: '$1,500' },
    { invoiceNo: 'INV-1003A', company: 'Global Shipping Solutions', plan: 'Enterprise', period: '06/01/2026 - 07/01/2026', date: '06/01/2026', status: 'Paid', method: 'ACH Transfer', amount: '$28,000' },
    { invoiceNo: 'INV-1003B', company: 'Global Shipping Solutions', plan: 'Enterprise', period: '05/01/2026 - 06/01/2026', date: '05/01/2026', status: 'Paid', method: 'ACH Transfer', amount: '$28,000' },
    { invoiceNo: 'INV-1003C', company: 'Global Shipping Solutions', plan: 'Enterprise', period: '04/01/2026 - 05/01/2026', date: '04/01/2026', status: 'Paid', method: 'ACH Transfer', amount: '$28,000' },
    { invoiceNo: 'INV-1003D', company: 'Global Shipping Solutions', plan: 'Enterprise', period: '03/01/2026 - 04/01/2026', date: '03/01/2026', status: 'Paid', method: 'ACH Transfer', amount: '$28,000' }
  ]);

  // Audits list (Screenshot 4 & 5)
  const [audits, setAudits] = useState([
    { title: 'Trial Converted', date: '13/7/2026, 5:28:37 pm', detail: 'Successfully converted trial account for Texas Hotshot Carriers to paying Professional subscription.', operator: 'Super Admin', ip: '192.168.1.1' },
    { title: 'Trial Converted', date: '13/7/2026, 5:28:30 pm', detail: 'Successfully converted trial account for Swift Cargo Express to paying Professional subscription.', operator: 'Super Admin', ip: '192.168.1.1' },
    { title: 'Plan Created', date: '06/20/2026, 09:00:00 AM', detail: 'Starter plan initialized.', operator: 'System Root', ip: '192.168.1.1' },
    { title: 'Plan Created', date: '06/20/2026, 09:05:00 AM', detail: 'Professional plan initialized.', operator: 'System Root', ip: '192.168.1.1' },
    { title: 'Plan Created', date: '06/20/2026, 09:10:00 AM', detail: 'Enterprise plan initialized.', operator: 'System Root', ip: '192.168.1.1' },
    { title: 'Plan Created', date: '06/20/2026, 09:15:00 AM', detail: 'Custom Enterprise plan initialized.', operator: 'System Root', ip: '192.168.1.1' }
  ]);

  const showNotification = (msg) => {
    setToast(msg);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleOpenWizard = (mode, plan = null) => {
    setWizardMode(mode);
    setWizardStep(1);
    if (mode === 'configure' && plan) {
      setSelectedPlan(plan);
      setFormName(plan.name);
      setFormVersion(plan.version.replace('v', ''));
      setFormStatus(plan.status);
      setFormDesc(`Description outline of licensing rules for ${plan.name}.`);
    } else {
      setSelectedPlan(null);
      setFormName('');
      setFormVersion('1.0.0');
      setFormStatus('Draft');
      setFormDesc('');
    }
    setShowWizard(true);
  };

  const handleWizardSubmit = (e) => {
    e.preventDefault();
    if (wizardMode === 'create') {
      const newPlanId = `plan-${formName.toLowerCase().replace(/\s+/g, '-')}`;
      const newPlan = {
        id: newPlanId,
        name: formName,
        version: `v${formVersion}`,
        status: formStatus,
        monthlyPrice: formName.toLowerCase().includes('starter') ? 199 : 599,
        annualPrice: formName.toLowerCase().includes('starter') ? 1990 : 5990,
        trialDays: 14,
        subscribers: 0,
        mrr: 0,
        users: 10,
        drivers: 20,
        vehicles: 20,
        storage: '50 GB',
        modules: ['Dispatch', 'Fleet', 'GPS'],
        createdBy: 'System Root',
        createdDate: new Date().toLocaleString()
      };
      setPlans([...plans, newPlan]);
      showNotification(`Membership plan "${formName}" provisioned.`);
    } else if (wizardMode === 'configure' && selectedPlan) {
      setPlans(prev => prev.map(p => p.id === selectedPlan.id ? {
        ...p,
        name: formName,
        version: `v${formVersion}`,
        status: formStatus
      } : p));
      showNotification(`Plan "${formName}" configuration updated.`);
    }
    setShowWizard(false);
  };

  const handleDeprecateClick = (plan) => {
    setSelectedPlan(plan);
    setShowDeprecateModal(true);
  };

  const confirmDeprecate = () => {
    if (selectedPlan) {
      setPlans(prev => prev.map(p => p.id === selectedPlan.id ? { ...p, status: 'Deprecated' } : p));
      showNotification(`Plan "${selectedPlan.name}" set to Deprecated.`);
    }
    setShowDeprecateModal(false);
  };

  const handleDeletePlan = (planId, planName) => {
    if (window.confirm(`Are you sure you want to permanently delete plan "${planName}"?`)) {
      setPlans(prev => prev.filter(p => p.id !== planId));
      showNotification(`Plan "${planName}" removed.`);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Plan ID', 'Plan Name', 'Version', 'Status', 'Monthly Price', 'Annual Price', 'Trial Days', 'Subscribers', 'MRR'];
    const rows = plans.map(p => [p.id, p.name, p.version, p.status, `$${p.monthlyPrice}`, `$${p.annualPrice}`, `${p.trialDays} days`, p.subscribers, `$${p.mrr}`]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'membership_plans_registry.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('CSV Registry exported.');
  };

  const handleApplyFilters = () => {
    setAppliedFilters({
      state: filterState,
      minPrice: filterMinPrice,
      maxPrice: filterMaxPrice
    });
    showNotification('Filters applied.');
  };

  const handleResetFilters = () => {
    setFilterState('All States');
    setFilterMinPrice('');
    setFilterMaxPrice('');
    setAppliedFilters({
      state: 'All States',
      minPrice: '',
      maxPrice: ''
    });
    showNotification('Filters reset.');
  };

  const toggleColumn = (colName) => {
    setVisibleColumns(prev => ({
      ...prev,
      [colName]: !prev[colName]
    }));
  };

  // Promo operations
  const handleLaunchPromo = (e) => {
    e.preventDefault();
    let valText = '';
    let mappedType = '';
    if (promoType === 'Percentage Off (%)') {
      valText = `${promoValue}% off`;
      mappedType = 'Percentage Discount';
    } else if (promoType === 'Fixed Value Off ($)') {
      valText = `$${promoValue} off`;
      mappedType = 'Fixed Discount';
    } else {
      valText = `${promoValue} extra days`;
      mappedType = 'Trial Extension';
    }

    const newPromo = {
      code: promoCode.toUpperCase(),
      campaignName: promoCampaignName,
      type: mappedType,
      valueText: valText,
      redemptions: 0,
      limit: parseInt(promoLimit) || 100,
      expiryDate: promoExpiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Active'
    };

    setPromos([...promos, newPromo]);
    setShowPromoModal(false);
    showNotification(`Promo code "${promoCode}" launched!`);
    setPromoCode('');
    setPromoValue('');
    setPromoCampaignName('');
    setPromoExpiryDate('');
  };

  const handleDeletePromo = (code) => {
    if (window.confirm(`Are you sure you want to remove promo code "${code}"?`)) {
      setPromos(prev => prev.filter(p => p.code !== code));
      showNotification(`Promo "${code}" removed.`);
    }
  };

  // Filter plans list
  const filteredPlans = plans.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = appliedFilters.state === 'All States' || p.status.toLowerCase() === appliedFilters.state.toLowerCase();
    const planPrice = billingCycle === 'monthly' ? p.monthlyPrice : Math.round(p.monthlyPrice * 0.85);
    const matchesMinPrice = !appliedFilters.minPrice || planPrice >= parseFloat(appliedFilters.minPrice);
    const matchesMaxPrice = !appliedFilters.maxPrice || planPrice <= parseFloat(appliedFilters.maxPrice);

    return matchesSearch && matchesState && matchesMinPrice && matchesMaxPrice;
  });

  // Filter promos list
  const filteredPromos = promos.filter(p => 
    p.code.toLowerCase().includes(promoSearchQuery.toLowerCase()) ||
    p.campaignName.toLowerCase().includes(promoSearchQuery.toLowerCase())
  );

  // Filter invoices list
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.company.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) || 
                          inv.invoiceNo.toLowerCase().includes(invoiceSearchQuery.toLowerCase());
    
    // Status filters
    let matchesStatus = true;
    if (invoiceStatusFilter !== 'All Invoices') {
      if (invoiceStatusFilter === 'Paid') {
        matchesStatus = inv.status === 'Paid';
      } else if (invoiceStatusFilter === 'Unpaid') {
        matchesStatus = inv.status === 'Sent' || inv.status === 'Draft';
      } else if (invoiceStatusFilter === 'Overdue') {
        matchesStatus = inv.status === 'Overdue';
      }
    }
    return matchesSearch && matchesStatus;
  });

  // Filter audit logs list
  const filteredAudits = audits.filter(aud => 
    aud.title.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
    aud.detail.toLowerCase().includes(auditSearchQuery.toLowerCase())
  );

  return (
    <div className="flex-grow bg-[#F8FAFC] p-6 space-y-6 overflow-y-auto w-full text-left font-sans relative custom-scrollbar">
      
      {/* Custom scrollbar layout */}
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
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          {toast}
        </div>
      )}

      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-5 bg-white -mx-6 px-6 -mt-6 pt-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Super Admin <span className="text-slate-300">•</span> Plans
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Configure global licensing rules, audit tenant margins, and resolve support tickets.
          </p>
        </div>
        <button 
          onClick={() => {
            alert(`SaaS Plans Registry summary:\nTotal Tiers: ${plans.length}\nActive MRR: $42,910`);
            showNotification('Report compiled.');
          }}
          className="border border-slate-200 hover:bg-slate-50 text-slate-700 bg-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          Export Report
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">TOTAL LICENSING PLANS</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">{plans.length}</span>
          </div>
          <span className="text-[10px] font-bold text-[#10B981] mt-2 block">+1 added version v1.2</span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">ACTIVE SUBSCRIBERS</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">4</span>
          </div>
          <span className="text-[10px] font-bold text-amber-500 mt-2 block">1 suspended instances held</span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">TRIAL SUBSCRIBERS</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">1</span>
          </div>
          <span className="text-[10px] font-bold text-amber-500 mt-2 block">3 trial expiries soon</span>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">MONTHLY REVENUE (MRR)</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">$42,910</span>
          </div>
          <span className="text-[10px] font-bold text-[#10B981] mt-2 block">ARR projected: $5,14,920</span>
        </div>

        {/* Metric 5 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">UPGRADE RATE</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">12.5%</span>
          </div>
          <span className="text-[10px] font-bold text-[#10B981] mt-2 block">+2.1% upgrade speed</span>
        </div>

        {/* Metric 6 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">DOWNGRADE RATE</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">1.8%</span>
          </div>
          <span className="text-[10px] font-bold text-[#10B981] mt-2 block">Stable vs Q1 limits</span>
        </div>

        {/* Metric 7 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">CHURN RATE</span>
            <span className="text-2xl font-black text-rose-500 block mt-1.5">2.4%</span>
          </div>
          <span className="text-[10px] font-bold text-[#10B981] mt-2 block">Historical low</span>
        </div>

        {/* Metric 8 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">GROWTH INDEX</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">94.8%</span>
          </div>
          <span className="text-[10px] font-bold text-amber-500 mt-2 block">SaaS scale health: Excellent</span>
        </div>
      </div>

      {/* Active Plans Card Grid Section */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h2 className="text-sm font-black text-slate-800">Active Licensing Plans Overview</h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">Toggle billing terms and manage configurations of operational plan tires.</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Monthly / Annual billing switcher */}
            <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-[#FFD400] text-black shadow-xs'
                    : 'text-slate-655 hover:bg-slate-200'
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                  billingCycle === 'annual'
                    ? 'bg-[#FFD400] text-black shadow-xs'
                    : 'text-slate-655 hover:bg-slate-200'
                }`}
              >
                Annual Billing (Save 15%)
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleOpenWizard('create')}
              className="bg-[#FFD400] hover:bg-[#FFC800] text-black font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create Plan
            </button>
          </div>
        </div>

        {/* 4 Plans Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p) => {
            const price = billingCycle === 'monthly' ? p.monthlyPrice : Math.round(p.monthlyPrice * 0.85);
            return (
              <div 
                key={p.id} 
                className="border border-slate-150 rounded-2xl p-5 bg-white space-y-4 hover:shadow-md transition-shadow relative flex flex-col justify-between"
              >
                {/* Plan Header */}
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="font-black text-slate-800 uppercase text-xs tracking-wider">{p.name}</span>
                    <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                      {p.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold block font-mono">
                    version {p.version} <span className="text-slate-300">•</span> Published
                  </span>
                </div>

                {/* Plan Details list */}
                <div className="space-y-2 text-xs font-semibold text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span>Active Users:</span>
                    <span className="font-black text-slate-800">{p.users}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Drivers capacity:</span>
                    <span className="font-black text-slate-800">{p.drivers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fleet Vehicles:</span>
                    <span className="font-black text-slate-800">{p.vehicles}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cloud Storage:</span>
                    <span className="font-black text-slate-800">{p.storage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trial Days:</span>
                    <span className="font-black text-slate-800">{p.trialDays} Days</span>
                  </div>
                </div>

                {/* Key modules */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Key Modules</span>
                  <div className="flex flex-wrap gap-1.5">
                    {p.modules.map((m, idx) => (
                      <span 
                        key={idx} 
                        className={`text-[9px] font-black px-2 py-0.5 rounded-md ${
                          m === 'AI dispatch'
                            ? 'bg-amber-100 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Pricing & Actions */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-800">${price}</span>
                      <span className="text-[10px] text-slate-400 font-bold">/mo</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold mt-1">
                      <span className="text-slate-400">{p.subscribers} paying • ${p.mrr.toLocaleString()}/mo</span>
                      <span className="text-emerald-500">+5.4% growth</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenWizard('configure', p)}
                      className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-extrabold text-xs py-2 rounded-xl transition-colors cursor-pointer text-center"
                    >
                      Configure
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newPlan = { ...p, id: `${p.id}-copy-${Math.floor(Math.random() * 1000)}`, name: `${p.name} Copy` };
                        setPlans([...plans, newPlan]);
                        showNotification(`Cloned "${p.name}".`);
                      }}
                      className="flex-1 bg-amber-50 hover:bg-amber-100/60 text-yellow-600 font-extrabold text-xs py-2 rounded-xl transition-colors cursor-pointer text-center border border-amber-100"
                    >
                      Clone Plan
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Registry Table & SubTabs Section */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6">
        
        {/* Horizontal Navigation Pills - SCROLLABLE with all required tags */}
        <div className="flex overflow-x-auto whitespace-nowrap pb-2.5 gap-2.5 custom-scrollbar border-b border-slate-100">
          {[
            { id: 'Plan Registry', label: 'Plan Registry', icon: Layers },
            { id: 'Feature Matrix', label: 'Feature Matrix', icon: ShieldAlert },
            { id: 'Promos & Coupons', label: 'Promos & Coupons', icon: Percent },
            { id: 'Trial Management', label: 'Trial Management', icon: Calendar },
            { id: 'Revenue Intelligence', label: 'Revenue Intelligence', icon: TrendingUp },
            { id: 'Overage Billing', label: 'Overage Billing', icon: AlertCircle },
            { id: 'Payment Gateways', label: 'Payment Gateways', icon: CreditCard },
            { id: 'Bulk Migration', label: 'Bulk Migration', icon: ArrowLeftRight },
            { id: 'Billing Ledger', label: 'Billing Ledger', icon: DollarSign },
            { id: 'Audit Center', label: 'Audit Center', icon: FileText }
          ].map((subTab) => {
            const Icon = subTab.icon;
            const isActive = activeSubTab === subTab.id;
            return (
              <button
                key={subTab.id}
                onClick={() => setActiveSubTab(subTab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 font-extrabold text-xs rounded-xl transition-all cursor-pointer border inline-flex shrink-0 ${
                  isActive
                    ? 'bg-[#FFD400] text-black border-black border-2 shadow-xs font-black'
                    : 'bg-slate-600 hover:bg-slate-700 text-slate-100 border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {subTab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content 1: Plan Registry */}
        {activeSubTab === 'Plan Registry' && (
          <div className="space-y-4">
            
            {/* Toolbar Action row */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 relative">
              <div className="flex flex-wrap items-center gap-3 flex-grow max-w-xl">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search plans name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#F8FAFC] border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none placeholder:text-slate-400 text-slate-800"
                  />
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                </div>

                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-1.5 border font-extrabold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer ${
                    showFilters 
                      ? 'border-black border-2 bg-slate-50 text-slate-900' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-655'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" /> Filters
                </button>

                {/* Columns Visibility Selector */}
                <div className="relative" ref={columnsDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowColumnsDropdown(!showColumnsDropdown)}
                    className="flex items-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-655 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Columns <ChevronDown className="w-3 h-3" />
                  </button>

                  {/* Columns drop card */}
                  {showColumnsDropdown && (
                    <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-40 space-y-2.5 text-xs text-slate-700 font-bold">
                      {Object.keys(visibleColumns).map((colKey) => (
                        <label key={colKey} className="flex items-center gap-2.5 cursor-pointer select-none hover:text-slate-900">
                          <input
                            type="checkbox"
                            checked={visibleColumns[colKey]}
                            onChange={() => toggleColumn(colKey)}
                            className="w-4 h-4 rounded text-blue-650 cursor-pointer"
                          />
                          <span className="capitalize">{colKey.replace(/([A-Z])/g, ' $1')}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="border border-amber-255 bg-white hover:bg-amber-50/10 text-yellow-600 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" /> CSV Export
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenWizard('create')}
                  className="bg-[#FFD400] hover:bg-[#FFC800] text-black font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Create Plan
                </button>
              </div>
            </div>

            {/* Collapsible Filter panel from Screenshot 3 */}
            {showFilters && (
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-wrap items-end gap-5 text-xs font-extrabold">
                <div className="space-y-1.5 text-left">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">STATE LIFECYCLE</span>
                  <select
                    value={filterState}
                    onChange={(e) => setFilterState(e.target.value)}
                    className="border border-slate-250 bg-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#FFD400] text-slate-700 min-w-[180px] font-bold cursor-pointer"
                  >
                    <option value="All States">All States</option>
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Deprecated">Deprecated</option>
                  </select>
                </div>

                <div className="space-y-1.5 text-left">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">MIN PRICE ($)</span>
                  <input
                    type="number"
                    placeholder="e.g. 100"
                    value={filterMinPrice}
                    onChange={(e) => setFilterMinPrice(e.target.value)}
                    className="border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:border-[#FFD400] text-slate-700 w-36 font-bold"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">MAX PRICE ($)</span>
                  <input
                    type="number"
                    placeholder="e.g. 2000"
                    value={filterMaxPrice}
                    onChange={(e) => setFilterMaxPrice(e.target.value)}
                    className="border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:border-[#FFD400] text-slate-700 w-36 font-bold"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyFilters}
                    className="px-6 py-2.5 bg-[#FFD400] hover:bg-[#FFC800] text-black font-extrabold rounded-xl shadow-xs transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}

            {/* Registry table aligned perfectly using table-fixed and custom scrollbars */}
            <div className="border border-slate-150 rounded-2xl overflow-hidden bg-white">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="text-left border-collapse table-fixed min-w-[1500px] w-[1500px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/50">
                      <th className="py-4 px-5 text-center w-[50px] min-w-[50px] max-w-[50px]">
                        <input type="checkbox" className="w-4 h-4 rounded cursor-pointer" />
                      </th>
                      {visibleColumns.id && <th className="py-4 px-4 font-black w-[200px] min-w-[200px] max-w-[200px]">Plan ID</th>}
                      {visibleColumns.name && <th className="py-4 px-4 font-black w-[180px] min-w-[180px] max-w-[180px]">Plan Name ▲</th>}
                      {visibleColumns.version && <th className="py-4 px-4 font-black w-[90px] min-w-[90px] max-w-[90px]">Version</th>}
                      {visibleColumns.status && <th className="py-4 px-4 font-black w-[110px] min-w-[110px] max-w-[110px]">Status</th>}
                      {visibleColumns.pricing && <th className="py-4 px-4 font-black w-[110px] min-w-[110px] max-w-[110px]">Pricing</th>}
                      {visibleColumns.trialDays && <th className="py-4 px-4 font-black w-[90px] min-w-[90px] max-w-[90px]">Trial Days</th>}
                      {visibleColumns.subscribers && <th className="py-4 px-4 text-center font-black w-[100px] min-w-[100px] max-w-[100px]">Subscribers</th>}
                      {visibleColumns.revenue && <th className="py-4 px-4 text-right font-black w-[110px] min-w-[110px] max-w-[110px]">Revenue (MRR)</th>}
                      {visibleColumns.createdBy && <th className="py-4 px-4 font-black w-[120px] min-w-[120px] max-w-[120px]">Created By</th>}
                      {visibleColumns.lastUpdated && <th className="py-4 px-4 font-black w-[180px] min-w-[180px] max-w-[180px]">Last Updated</th>}
                      {visibleColumns.actions && <th className="py-4 px-5 text-center font-black w-[260px] min-w-[260px] max-w-[260px]">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700 bg-white">
                    {filteredPlans.length === 0 ? (
                      <tr>
                        <td colSpan="12" className="py-8 text-center text-slate-400 font-semibold bg-white w-full">
                          No membership plans registered matching filters.
                        </td>
                      </tr>
                    ) : (
                      filteredPlans.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-5 text-center w-[50px] min-w-[50px] max-w-[50px]">
                            <input type="checkbox" className="w-4 h-4 rounded cursor-pointer" />
                          </td>
                          {visibleColumns.id && (
                            <td className="py-4 px-4 w-[200px] min-w-[200px] max-w-[200px] font-mono text-slate-450 truncate">
                              {p.id}
                            </td>
                          )}
                          {visibleColumns.name && (
                            <td className="py-4 px-4 w-[180px] min-w-[180px] max-w-[180px] text-slate-900 font-extrabold truncate">
                              {p.name}
                            </td>
                          )}
                          {visibleColumns.version && (
                            <td className="py-4 px-4 w-[90px] min-w-[90px] max-w-[90px] font-mono font-medium whitespace-nowrap">
                              {p.version}
                            </td>
                          )}
                          {visibleColumns.status && (
                            <td className="py-4 px-4 w-[110px] min-w-[110px] max-w-[110px] whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                p.status === 'Published' 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : p.status === 'Deprecated' 
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                {p.status}
                              </span>
                            </td>
                          )}
                          {visibleColumns.pricing && (
                            <td className="py-4 px-4 w-[110px] min-w-[110px] max-w-[110px] whitespace-nowrap text-slate-800">
                              ${billingCycle === 'monthly' ? p.monthlyPrice : Math.round(p.monthlyPrice * 0.85)}/mo
                            </td>
                          )}
                          {visibleColumns.trialDays && (
                            <td className="py-4 px-4 w-[90px] min-w-[90px] max-w-[90px] text-slate-500 font-medium whitespace-nowrap">
                              {p.trialDays} days
                            </td>
                          )}
                          {visibleColumns.subscribers && (
                            <td className="py-4 px-4 w-[100px] min-w-[100px] max-w-[100px] text-center text-slate-800 font-black whitespace-nowrap">
                              {p.subscribers}
                            </td>
                          )}
                          {visibleColumns.revenue && (
                            <td className="py-4 px-4 w-[110px] min-w-[110px] max-w-[110px] text-right text-emerald-600 font-black whitespace-nowrap">
                              ${p.mrr.toLocaleString()}
                            </td>
                          )}
                          {visibleColumns.createdBy && (
                            <td className="py-4 px-4 w-[120px] min-w-[120px] max-w-[120px] text-slate-655 truncate">
                              {p.createdBy}
                            </td>
                          )}
                          {visibleColumns.lastUpdated && (
                            <td className="py-4 px-4 w-[180px] min-w-[180px] max-w-[180px] text-slate-400 font-medium truncate">
                              {p.createdDate}
                            </td>
                          )}
                          {visibleColumns.actions && (
                            <td className="py-4 px-5 w-[260px] min-w-[260px] max-w-[260px] whitespace-nowrap text-center">
                              <div className="flex items-center gap-1.5 justify-center flex-wrap">
                                {/* Configure */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenWizard('configure', p)}
                                  className="inline-flex items-center border border-slate-800 bg-white hover:bg-slate-50 text-slate-900 font-black text-[11px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-sm"
                                >
                                  Configure
                                </button>

                                {/* Versioning */}
                                <button
                                  type="button"
                                  onClick={() => { setVersioningPlan(p); setVersionCompareA('-- Select A --'); setVersionCompareB('-- Select B --'); setShowVersioningDrawer(true); }}
                                  className="inline-flex items-center border border-slate-800 bg-white hover:bg-slate-50 text-slate-900 font-black text-[11px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-sm"
                                >
                                  Versioning
                                </button>

                                {/* Deprecate */}
                                <button
                                  type="button"
                                  disabled={p.status === 'Deprecated'}
                                  onClick={() => handleDeprecateClick(p)}
                                  className={`inline-flex items-center font-black text-[11px] px-3 py-1.5 rounded-lg transition-colors shadow-sm ${
                                    p.status === 'Deprecated'
                                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                      : 'border border-slate-800 bg-white hover:bg-slate-50 text-slate-900 cursor-pointer'
                                  }`}
                                >
                                  Deprecate
                                </button>

                                {/* Delete */}
                                <button
                                  type="button"
                                  onClick={() => handleDeletePlan(p.id, p.name)}
                                  className="inline-flex items-center justify-center bg-rose-500 hover:bg-rose-600 text-white font-extrabold p-2 rounded-lg transition-colors cursor-pointer shadow-sm"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab content 2: Feature Matrix (Screenshot 5 comparison grid!) */}
        {activeSubTab === 'Feature Matrix' && (
          <div className="space-y-4">
            <div className="border border-slate-150 rounded-2xl overflow-hidden bg-white">
              <table className="w-full text-left border-collapse text-xs font-bold text-slate-700">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-4 px-6">SERVICE MODULE FEATURE</th>
                    <th className="py-4 px-4 text-center">STARTER</th>
                    <th className="py-4 px-4 text-center">PROFESSIONAL</th>
                    <th className="py-4 px-4 text-center">ENTERPRISE</th>
                    <th className="py-4 px-4 text-center">CUSTOM ENTERPRISE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Service modules */}
                  {[
                    { label: 'Route Dispatch & Booking Console', starter: true, pro: true, enterprise: true, custom: true },
                    { label: 'Fleet Asset Maintenance Logs', starter: true, pro: true, enterprise: true, custom: true },
                    { label: 'Live GPS Coordinates Geofences', starter: true, pro: true, enterprise: true, custom: true },
                    { label: 'Digital ELD Driver Mobile App', starter: true, pro: true, enterprise: true, custom: true },
                    { label: 'Carrier Expense Factoring Rules', starter: false, pro: true, enterprise: true, custom: true },
                    { label: 'AI Optimization Autopiloting Dispatch', starter: false, pro: false, enterprise: true, custom: true },
                    { label: 'Global Business Intelligence Reports', starter: false, pro: true, enterprise: true, custom: true },
                    { label: 'Granular Developers API Integration Sandbox', starter: false, pro: false, enterprise: true, custom: true },
                    { label: 'White-Label Shipper Portal Gateway', starter: false, pro: true, enterprise: true, custom: true },
                    { label: 'Third-Party Brokers TMS Integration Connectors', starter: false, pro: true, enterprise: true, custom: true }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-6 font-extrabold text-slate-800">{row.label}</td>
                      <td className="py-3.5 px-4 text-center">
                        {row.starter ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <span className="text-slate-350 font-bold font-mono">-</span>}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {row.pro ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <span className="text-slate-350 font-bold font-mono">-</span>}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {row.enterprise ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <span className="text-slate-350 font-bold font-mono">-</span>}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {row.custom ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <span className="text-slate-350 font-bold font-mono">-</span>}
                      </td>
                    </tr>
                  ))}

                  {/* Threshold category header */}
                  <tr className="bg-slate-50/70 border-y border-slate-150">
                    <td colSpan="5" className="py-3 px-6 text-[10px] font-black text-amber-600 uppercase tracking-widest">
                      CAPACITY ALLOCATION THRESHOLDS
                    </td>
                  </tr>

                  {/* Threshold rows */}
                  {[
                    { label: 'Users Limit', starter: '3', pro: '15', enterprise: '999', custom: '9999' },
                    { label: 'Drivers Limit', starter: '5', pro: '30', enterprise: '999', custom: '9999' },
                    { label: 'Vehicles Limit', starter: '5', pro: '30', enterprise: '999', custom: '9999' },
                    { label: 'Branches Limit', starter: '1', pro: '5', enterprise: '999', custom: '9999' },
                    { label: 'Storage Limit', starter: '10 GB', pro: '100 GB', enterprise: '1000 GB', custom: '10000 GB' },
                    { label: 'Api Calls Limit', starter: '10000', pro: '100000', enterprise: '1000000', custom: '10000000' }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-6 font-extrabold text-slate-800">{row.label}</td>
                      <td className="py-3.5 px-4 text-center text-slate-800 font-extrabold">{row.starter}</td>
                      <td className="py-3.5 px-4 text-center text-slate-800 font-extrabold">{row.pro}</td>
                      <td className="py-3.5 px-4 text-center text-slate-800 font-extrabold">{row.enterprise}</td>
                      <td className="py-3.5 px-4 text-center text-slate-800 font-extrabold">{row.custom}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab content 3: Promos & Coupons (Screenshot 4 & 5!) */}
        {activeSubTab === 'Promos & Coupons' && (
          <div className="space-y-4">
            
            {/* Promo Toolbar */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="relative flex-grow max-w-xs text-left">
                <input
                  type="text"
                  placeholder="Search codes or campaign"
                  value={promoSearchQuery}
                  onChange={(e) => setPromoSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#F8FAFC] border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none placeholder:text-slate-400 text-slate-800 font-bold"
                />
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              </div>

              <button
                type="button"
                onClick={() => setShowPromoModal(true)}
                className="bg-[#FFD400] hover:bg-[#FFC800] text-black font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Coupon Code
              </button>
            </div>

            {/* Promos Table */}
            <div className="border border-slate-150 rounded-2xl overflow-hidden bg-white">
              <table className="w-full text-left border-collapse text-xs font-bold text-slate-700">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-4 px-6">PROMO CODE</th>
                    <th className="py-4 px-4">CAMPAIGN NAME</th>
                    <th className="py-4 px-4">TYPE</th>
                    <th className="py-4 px-4">DISCOUNT VALUE</th>
                    <th className="py-4 px-4" colSpan="2">REDEMPTIONS</th>
                    <th className="py-4 px-4">EXPIRY DATE</th>
                    <th className="py-4 px-4">STATUS</th>
                    <th className="py-4 px-6 text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPromos.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="py-8 text-center text-slate-400 font-semibold bg-white w-full">
                        No promotional campaign codes found.
                      </td>
                    </tr>
                  ) : (
                    filteredPromos.map((p) => {
                      const percent = Math.min(100, Math.round((p.redemptions / p.limit) * 100));
                      return (
                        <tr key={p.code} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6 text-yellow-600 font-black tracking-wide font-mono">
                            {p.code}
                          </td>
                          <td className="py-4 px-4 text-slate-900 font-extrabold">
                            {p.campaignName}
                          </td>
                          <td className="py-4 px-4 text-slate-450 font-medium">
                            {p.type}
                          </td>
                          <td className="py-4 px-4 text-slate-800 font-black">
                            {p.valueText}
                          </td>
                          <td className="py-4 px-4 w-28 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-800 font-bold">{p.redemptions}</span>
                              <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden shrink-0">
                                <div className="bg-[#FFD400] h-full" style={{ width: `${percent}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-2 text-slate-400 text-[10px] font-bold whitespace-nowrap">
                            {p.limit} max
                          </td>
                          <td className="py-4 px-4 text-slate-500 font-medium">
                            {p.expiryDate}
                          </td>
                          <td className="py-4 px-4">
                            <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
                              {p.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button
                              type="button"
                              onClick={() => handleDeletePromo(p.code)}
                              className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs p-2 rounded-xl transition-colors cursor-pointer inline-flex items-center justify-center shadow-xs"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Tab content 4: Trial Management (Screenshot 1!) */}
        {activeSubTab === 'Trial Management' && (
          <div className="space-y-4">
            <div className="border border-slate-150 rounded-2xl overflow-hidden bg-white">
              <table className="w-full text-left border-collapse text-xs font-bold text-slate-700">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-4 px-6">TENANT COMPANY</th>
                    <th className="py-4 px-4">WORKSPACE ADMIN</th>
                    <th className="py-4 px-4">TRIAL EXPIRY DATE</th>
                    <th className="py-4 px-4">DAYS REMAINING</th>
                    <th className="py-4 px-4">LIMITS VIOLATIONS</th>
                    <th className="py-4 px-4">REDEMPTION STATUS</th>
                    <th className="py-4 px-6 text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-bold">
                  {trials.map((t, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-5 px-6 font-extrabold text-slate-900">{t.company}</td>
                      <td className="py-5 px-4 text-slate-500 font-medium">{t.admin}</td>
                      <td className="py-5 px-4 text-slate-800 font-black">{t.expiryDate}</td>
                      <td className="py-5 px-4 text-rose-500 font-black">{t.daysRemaining}</td>
                      <td className="py-5 px-4 text-slate-400 font-semibold">{t.limitsViolations}</td>
                      <td className="py-5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          t.status === 'Active trial' 
                            ? 'bg-emerald-50 text-emerald-600' 
                            : 'bg-rose-50 text-rose-600'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-center">
                        <div className="flex items-center gap-1.5 justify-center">
                          <button
                            type="button"
                            onClick={() => showNotification(`Converting ${t.company} to active billing.`)}
                            className="bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-[11px] px-3 py-2 rounded-xl transition-colors cursor-pointer"
                          >
                            Convert to Paid
                          </button>
                          <button
                            type="button"
                            onClick={() => showNotification(`Extended trial period for ${t.company} by 14 days.`)}
                            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-extrabold text-[11px] px-3 py-2 rounded-xl transition-colors cursor-pointer"
                          >
                            Extend (+14d)
                          </button>
                          <button
                            type="button"
                            onClick={() => showNotification(`Notification sent to admin of ${t.company}.`)}
                            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-extrabold text-[11px] px-3 py-2 rounded-xl transition-colors cursor-pointer"
                          >
                            Notify
                          </button>
                          <button
                            type="button"
                            onClick={() => showNotification(`Trial cancellation triggered for ${t.company}.`)}
                            className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-[11px] px-3 py-2 rounded-xl transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab content 5: Revenue Intelligence (Screenshot 2!) */}
        {activeSubTab === 'Revenue Intelligence' && (
          <div className="space-y-6">
            
            {/* Grid for timeline and subscriber mix */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* MRR timeline graph */}
              <div className="lg:col-span-2 border border-slate-150 rounded-2xl p-5 bg-white space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black text-slate-800">Dynamic MRR Expansion Timeline (USD)</h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Q1-Q2 Audited cash flow</span>
                </div>
                
                {/* SVG Graph representation */}
                <div className="relative pt-6 h-56 flex items-end">
                  <svg className="w-full h-40 overflow-visible" viewBox="0 0 600 150">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    <line x1="0" y1="120" x2="600" y2="120" stroke="#cbd5e1" strokeDasharray="4 4" strokeWidth="1" />
                    <line x1="0" y1="70" x2="600" y2="70" stroke="#cbd5e1" strokeDasharray="4 4" strokeWidth="1" />
                    <line x1="0" y1="20" x2="600" y2="20" stroke="#cbd5e1" strokeDasharray="4 4" strokeWidth="1" />

                    {/* Area path under line */}
                    <path d="M 50 120 L 50 120 Q 200 80 250 80 Q 400 40 450 40 Q 520 30 550 30 L 550 150 L 50 150 Z" fill="url(#chartGrad)" />

                    {/* Blue line path */}
                    <path d="M 50 120 Q 200 80 250 80 Q 400 40 450 40 Q 520 30 550 30" fill="none" stroke="#0EA5E9" strokeWidth="3" />

                    {/* Circular points */}
                    <circle cx="50" cy="120" r="5" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
                    <circle cx="250" cy="80" r="5" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
                    <circle cx="450" cy="40" r="5" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
                    <circle cx="550" cy="30" r="5" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />

                    {/* Labels */}
                    <text x="45" y="145" className="text-[10px] font-bold fill-slate-400">Jan</text>
                    <text x="245" y="145" className="text-[10px] font-bold fill-slate-400">Mar</text>
                    <text x="445" y="145" className="text-[10px] font-bold fill-slate-400">May</text>
                    <text x="542" y="145" className="text-[10px] font-bold fill-slate-400">Jun</text>

                    {/* Y Axis text label markers */}
                    <text x="5" y="24" className="text-[10px] font-bold fill-slate-400">$42k</text>
                    <text x="5" y="74" className="text-[10px] font-bold fill-slate-400">$25k</text>
                    <text x="5" y="124" className="text-[10px] font-bold fill-slate-400">$10k</text>
                  </svg>
                </div>
              </div>

              {/* Subscriber Mix Pie Donut Chart */}
              <div className="border border-slate-150 rounded-2xl p-5 bg-white space-y-4">
                <div>
                  <h3 className="text-sm font-black text-slate-800">Subscriber Mix Analytics</h3>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">Distribution index of operational licensing accounts.</p>
                </div>

                {/* Donut SVG Chart representation */}
                <div className="flex flex-col items-center justify-center pt-2 space-y-5">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="35" stroke="#334155" strokeWidth="12" fill="transparent" strokeDasharray="219.9" strokeDashoffset="44" />
                      <circle cx="50" cy="50" r="35" stroke="#10B981" strokeWidth="12" fill="transparent" strokeDasharray="219.9" strokeDashoffset="132" />
                      <circle cx="50" cy="50" r="35" stroke="#0EA5E9" strokeWidth="12" fill="transparent" strokeDasharray="219.9" strokeDashoffset="132" />
                    </svg>
                    
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-xl font-black text-slate-800">5</span>
                      <span className="text-[9px] font-black text-slate-400 tracking-wider">TENANTS</span>
                    </div>
                  </div>

                  <div className="w-full space-y-2 text-[10px] font-bold text-slate-500 px-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-[#0EA5E9] rounded-full" />
                        <span>Professional Plan</span>
                      </div>
                      <span className="text-slate-850 font-black">40% mix</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-[#10B981] rounded-full" />
                        <span>Starter Plan</span>
                      </div>
                      <span className="text-slate-850 font-black">40% mix</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-[#334155] rounded-full" />
                        <span>Enterprise Plan</span>
                      </div>
                      <span className="text-slate-850 font-black">20% mix</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom 3 metrics grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="border border-slate-150 rounded-2xl p-5 bg-white text-left">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">CUSTOMER LIFETIME VALUE (LTV)</span>
                <span className="text-xl font-black text-slate-800 block mt-2">$18,450.00</span>
                <span className="text-[10px] font-bold text-emerald-500 mt-2 block">LTV to CAC ratio: 4.8x (Excellent)</span>
              </div>
              
              <div className="border border-slate-150 rounded-2xl p-5 bg-white text-left">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">CUSTOMER ACQUISITION COST (CAC)</span>
                <span className="text-xl font-black text-slate-800 block mt-2">$3,840.00</span>
                <span className="text-[10px] font-bold text-amber-500 mt-2 block">Payback period: 7.8 months</span>
              </div>

              <div className="border border-slate-150 rounded-2xl p-5 bg-white text-left">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">REVENUE CHURN RATE (MRR CHURN)</span>
                <span className="text-xl font-black text-rose-500 block mt-2">1.4% / mo</span>
                <span className="text-[10px] font-bold text-slate-400 mt-2 block">Net Revenue Retention (NRR): 108.5%</span>
              </div>
            </div>

          </div>
        )}

        {/* Tab content 6: Overage Billing (Placeholder for layout flow) */}
        {activeSubTab === 'Overage Billing' && (
          <div className="space-y-4 py-8 text-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <ShieldAlert className="w-10 h-10 mx-auto text-slate-400" />
            <h3 className="text-sm font-black text-slate-700">Overage Billing Panel</h3>
            <p className="text-xs text-slate-455 max-w-sm mx-auto">
              Automated triggers configured dynamically for storage bandwidth and API usage limits validation thresholds.
            </p>
          </div>
        )}

        {/* Tab content 7: Payment Gateways (Screenshot 3!) */}
        {activeSubTab === 'Payment Gateways' && (
          <div className="space-y-5 text-left">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">GLOBAL PAYMENT GATEWAYS CREDENTIALS</h3>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); showNotification('Gateway Configurations Saved!'); }} className="space-y-5">
              
              {/* Row 1: Stripe */}
              <div className="border border-slate-150 rounded-2xl p-5 bg-white space-y-4">
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2.5 cursor-pointer font-black text-slate-800 text-xs">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-650 cursor-pointer" />
                    <span>Stripe Credit Card Gateway Integration</span>
                  </label>
                  <span className="bg-amber-100 text-amber-700 border border-amber-200 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                    CORE PAYMENT NODE
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-700">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Stripe Publishable API Key</label>
                    <input type="password" defaultValue="pk_live_*******************" className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] rounded-xl focus:outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Stripe Secret Signature Key</label>
                    <input type="password" defaultValue="whsec_*******************" className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] rounded-xl focus:outline-none font-mono" />
                  </div>
                </div>
              </div>

              {/* Row 2: PayPal */}
              <div className="border border-slate-150 rounded-2xl p-4 bg-white">
                <label className="flex items-center gap-2.5 cursor-pointer font-black text-slate-800 text-xs">
                  <input type="checkbox" className="w-4 h-4 rounded text-blue-650 cursor-pointer" />
                  <span>PayPal Checkout Express</span>
                </label>
              </div>

              {/* Row 3: ACH direct bank */}
              <div className="border border-slate-150 rounded-2xl p-5 bg-white space-y-4">
                <label className="flex items-center gap-2.5 cursor-pointer font-black text-slate-800 text-xs">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-650 cursor-pointer" />
                  <span>ACH Electronic Direct Bank Deposit (Plaid Secure Node)</span>
                </label>
                <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-700">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">ACH Clearing Routing Transit Number</label>
                    <input type="text" defaultValue="123456789" className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] rounded-xl focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">ACH Corporate Depositors Account Number</label>
                    <input type="password" defaultValue="****************" className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] rounded-xl focus:outline-none font-mono" />
                  </div>
                </div>
              </div>

              {/* Row 4: Corporate wire transfer */}
              <div className="border border-slate-150 rounded-2xl p-5 bg-white space-y-4">
                <label className="flex items-center gap-2.5 cursor-pointer font-black text-slate-800 text-xs">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-650 cursor-pointer" />
                  <span>Corporate Wire Bank Transfer</span>
                </label>
                <div className="grid grid-cols-3 gap-4 text-xs font-bold text-slate-700">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Wire Bank Name</label>
                    <input type="text" defaultValue="Chase Bank" className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] rounded-xl focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Swift/BIC Routing Code</label>
                    <input type="text" defaultValue="CHASUS33XXX" className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] rounded-xl focus:outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Wire Account Number</label>
                    <input type="password" defaultValue="****************" className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] rounded-xl focus:outline-none font-mono" />
                  </div>
                </div>
              </div>

              {/* Row 5: Manual Invoicing */}
              <div className="border border-slate-150 rounded-2xl p-5 bg-white space-y-4">
                <label className="flex items-center gap-2.5 cursor-pointer font-black text-slate-800 text-xs">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-650 cursor-pointer" />
                  <span>Manual Invoicing & Purchase Order Terms</span>
                </label>
                <div className="text-xs font-bold text-slate-700">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Default Net Payment Terms Instructions</label>
                  <textarea rows="3" defaultValue="Net 30 manual invoice billing terms apply." className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] rounded-xl focus:outline-none font-semibold text-slate-800" />
                </div>
              </div>

              <button
                type="submit"
                className="w-[#250px] bg-[#FFD400] hover:bg-[#FFC800] text-black font-extrabold text-xs py-3 rounded-xl shadow-xs transition-colors cursor-pointer text-center"
              >
                Save Gateway configurations
              </button>
            </form>
          </div>
        )}

        {/* Tab content 8: Bulk Migration (Screenshot 4 & 5!) */}
        {activeSubTab === 'Bulk Migration' && (
          <div className="space-y-5 text-left">
            <div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">BULK SUBSCRIBER PLAN MIGRATOR</h3>
              <p className="text-[10px] text-slate-400 font-bold mt-1">
                Move cohorts of active subscribers between plan tiers. Reallocation triggers automated validations, overage reviews, and ledger updates.
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); showNotification(`Cohort migration executed successfully from ${migrationSource} to ${migrationTarget}!`); }} className="space-y-6">
              
              <div className="border border-slate-150 rounded-2xl p-5 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-bold text-slate-700">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Select Source Plan Level</label>
                    <select
                      value={migrationSource}
                      onChange={(e) => setMigrationSource(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs font-bold rounded-xl focus:outline-none text-slate-800 cursor-pointer"
                    >
                      <option value="-- Select Plan --">-- Select Plan --</option>
                      <option value="Starter Tier">Starter Tier</option>
                      <option value="Professional Tier">Professional Tier</option>
                      <option value="Enterprise Tier">Enterprise Tier</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Select Target Destination Plan Level</label>
                    <select
                      value={migrationTarget}
                      onChange={(e) => setMigrationTarget(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs font-bold rounded-xl focus:outline-none text-slate-800 cursor-pointer"
                    >
                      <option value="-- Select Plan --">-- Select Plan --</option>
                      <option value="Starter Tier">Starter Tier</option>
                      <option value="Professional Tier">Professional Tier</option>
                      <option value="Enterprise Tier">Enterprise Tier</option>
                    </select>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Tab content 9: Billing Ledger (Screenshot 2!) */}
        {activeSubTab === 'Billing Ledger' && (
          <div className="space-y-4">
            
            {/* Toolbar Row */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="relative flex-grow max-w-xs text-left">
                <input
                  type="text"
                  placeholder="Search invoices by compa"
                  value={invoiceSearchQuery}
                  onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#F8FAFC] border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none placeholder:text-slate-400 text-slate-800 font-bold"
                />
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              </div>

              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700">
                <span>Status Filter:</span>
                <select
                  value={invoiceStatusFilter}
                  onChange={(e) => setInvoiceStatusFilter(e.target.value)}
                  className="border border-slate-200 bg-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#FFD400] text-slate-700 font-bold cursor-pointer min-w-[130px]"
                >
                  <option value="All Invoices">All Invoices</option>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="border border-slate-150 rounded-2xl overflow-hidden bg-white">
              <table className="w-full text-left border-collapse text-xs font-bold text-slate-700">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-4 px-6">INVOICE NUMBER</th>
                    <th className="py-4 px-4">COMPANY WORKSPACE</th>
                    <th className="py-4 px-4">PLAN LEVEL</th>
                    <th className="py-4 px-4">BILLING PERIOD</th>
                    <th className="py-4 px-4">ISSUED DATE</th>
                    <th className="py-4 px-4">STATUS</th>
                    <th className="py-4 px-4">METHOD</th>
                    <th className="py-4 px-4">TOTAL AMOUNT</th>
                    <th className="py-4 px-6 text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="py-8 text-center text-slate-400 font-semibold bg-white w-full">
                        No invoices logged matching the filters.
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((inv, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 text-slate-400 font-mono font-medium whitespace-nowrap">
                          {inv.invoiceNo}
                        </td>
                        <td className="py-4 px-4 text-slate-900 font-extrabold">
                          {inv.company}
                        </td>
                        <td className="py-4 px-4 text-slate-500 font-medium">
                          {inv.plan}
                        </td>
                        <td className="py-4 px-4 text-slate-450 font-mono font-medium">
                          {inv.period}
                        </td>
                        <td className="py-4 px-4 text-slate-500 font-mono font-medium">
                          {inv.date}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            inv.status === 'Paid'
                              ? 'bg-emerald-50 text-emerald-600'
                              : inv.status === 'Sent'
                              ? 'bg-amber-50 text-amber-600'
                              : inv.status === 'Draft'
                              ? 'bg-slate-100 text-slate-550'
                              : 'bg-rose-50 text-rose-600'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-500 font-medium">
                          {inv.method}
                        </td>
                        <td className="py-4 px-4 text-slate-900 font-black">
                          {inv.amount}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            type="button"
                            onClick={() => { setSelectedInvoice(inv); setShowReceiptModal(true); }}
                            className="border border-slate-800 bg-white hover:bg-slate-50 text-slate-900 font-black text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer shadow-sm leading-tight"
                          >
                            Inspect<br />Receipt
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Tab content 10: Audit Center (Screenshot 4 & 5!) */}
        {activeSubTab === 'Audit Center' && (
          <div className="space-y-4">
            
            {/* Toolbar Row */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="relative flex-grow max-w-xs text-left">
                <input
                  type="text"
                  placeholder="Search audit actions or descriptio"
                  value={auditSearchQuery}
                  onChange={(e) => setAuditSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#F8FAFC] border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none placeholder:text-slate-400 text-slate-800 font-bold"
                />
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              </div>

              <div className="text-[11px] font-mono text-slate-400">
                {filteredAudits.length} ledger operations logged
              </div>
            </div>

            {/* Audit log list card layout */}
            <div className="border border-slate-150 rounded-2xl bg-white divide-y divide-slate-100 overflow-hidden">
              {filteredAudits.length === 0 ? (
                <div className="py-8 text-center text-slate-400 font-semibold w-full">
                  No system logs match search query.
                </div>
              ) : (
                filteredAudits.map((aud, idx) => (
                  <div key={idx} className="p-5 text-left space-y-2 hover:bg-slate-50/50 transition-colors">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="font-extrabold text-slate-850 text-[13px]">{aud.title}</h4>
                      <span className="text-[10px] font-mono text-slate-400 font-medium whitespace-nowrap">{aud.date}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      {aud.detail}
                    </p>
                    <div className="flex gap-4 text-[10px] font-mono text-slate-400 pt-1">
                      <span>Operator: <span className="font-bold text-slate-600">{aud.operator}</span></span>
                      <span>IP Address: <span className="font-bold text-slate-600">{aud.ip}</span></span>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

      </div>

      {/* SaaS License Provisioning Wizard Modal (Configuring or Creating) */}
      {showWizard && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in text-left">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-800">
                {wizardMode === 'create' ? 'SaaS License Provisioning Wizard' : 'Configure Plan Licensing Rules'}
              </h3>
              <button 
                type="button" 
                onClick={() => setShowWizard(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps bar */}
            <div className="px-6 py-3 bg-[#F8FAFC] border-b border-slate-100 flex items-center justify-between gap-2 overflow-x-auto custom-scrollbar">
              {[
                { step: 1, label: 'Info' },
                { step: 2, label: 'Limits' },
                { step: 3, label: 'Features' },
                { step: 4, label: 'Billing' },
                { step: 5, label: 'Review' }
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-1.5 shrink-0">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    wizardStep === s.step
                      ? 'bg-[#FFD400] text-black'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {s.step}
                  </span>
                  <span className={`text-[10px] font-black uppercase tracking-wider ${
                    wizardStep === s.step ? 'text-slate-800' : 'text-slate-400'
                  }`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Form steps */}
            <form onSubmit={handleWizardSubmit} className="p-6 space-y-5 text-xs font-semibold text-slate-700">
              {wizardStep === 1 ? (
                <>
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Plan Tier Name</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Premium Plus"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] rounded-xl focus:outline-none text-slate-800 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Version</label>
                      <input
                        type="text"
                        required
                        value={formVersion}
                        onChange={(e) => setFormVersion(e.target.value)}
                        placeholder="1.0.0"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] rounded-xl focus:outline-none text-slate-800 text-xs font-bold font-mono"
                      />
                    </div>
                  </div>

                  <div className="text-left">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Initial Lifecycle Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs font-bold rounded-xl focus:outline-none text-slate-800 cursor-pointer"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                    </select>
                  </div>

                  <div className="text-left">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Description</label>
                    <textarea
                      rows="3"
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      placeholder="Provide description outline of licensing rules..."
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] rounded-xl focus:outline-none text-slate-800 text-xs font-semibold placeholder:text-slate-400"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowWizard(false)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      className="bg-[#FFD400] hover:bg-[#FFC800] text-black font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      Next Step <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              ) : wizardStep === 2 ? (
                <>
                  <div className="space-y-4 text-left">
                    <h4 className="font-extrabold text-slate-800">Resource and Client Limits</h4>
                    <p className="text-slate-455 font-semibold text-[11px] leading-normal">
                      Set maximum thresholds for active tenants. Enter 0 or "Unlimited" for no limits.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Max User Logins</label>
                        <input
                          type="text"
                          defaultValue="50"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] rounded-xl focus:outline-none text-slate-800 text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Max Drivers</label>
                        <input
                          type="text"
                          defaultValue="100"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] rounded-xl focus:outline-none text-slate-800 text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Max Fleet Vehicles</label>
                        <input
                          type="text"
                          defaultValue="100"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] rounded-xl focus:outline-none text-slate-800 text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Cloud Storage (GB)</label>
                        <input
                          type="text"
                          defaultValue="100"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] rounded-xl focus:outline-none text-slate-800 text-xs font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-100 mt-4">
                    <button
                      type="button"
                      onClick={() => setWizardStep(1)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardStep(3)}
                      className="bg-[#FFD400] hover:bg-[#FFC800] text-black font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      Next Step <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              ) : wizardStep === 3 ? (
                <>
                  <div className="space-y-4 text-left">
                    <h4 className="font-extrabold text-slate-800">Assign Platform Modules</h4>
                    <p className="text-slate-455 font-semibold text-[11px] leading-normal">
                      Select which key modules should be entitled automatically to this subscription level.
                    </p>

                    <div className="grid grid-cols-2 gap-3 bg-[#F8FAFC] border border-slate-150 rounded-2xl p-4">
                      {['Dispatch Board', 'Fleet Maintenance', 'Real-time GPS', 'Driver Mobile App', 'AI Route Dispatcher', 'Billing ledger API'].map((m) => (
                        <label key={m} className="flex items-center gap-2.5 cursor-pointer">
                          <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-650 cursor-pointer" />
                          <span className="text-xs font-bold text-slate-700">{m}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-100 mt-4">
                    <button
                      type="button"
                      onClick={() => setWizardStep(2)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardStep(4)}
                      className="bg-[#FFD400] hover:bg-[#FFC800] text-black font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      Next Step <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              ) : wizardStep === 4 ? (
                <>
                  <div className="space-y-4 text-left">
                    <h4 className="font-extrabold text-slate-800">Billing and Pricing Setup</h4>
                    <p className="text-slate-455 font-semibold text-[11px] leading-normal">
                      Set base recurring prices. Ensure correct currency config.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Monthly Price ($)</label>
                        <input
                          type="number"
                          defaultValue="499"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] rounded-xl focus:outline-none text-slate-800 text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Annual Price ($)</label>
                        <input
                          type="number"
                          defaultValue="4990"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] rounded-xl focus:outline-none text-slate-800 text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Trial Period Days</label>
                        <input
                          type="number"
                          defaultValue="14"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] rounded-xl focus:outline-none text-slate-800 text-xs font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-100 mt-4">
                    <button
                      type="button"
                      onClick={() => setWizardStep(3)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardStep(5)}
                      className="bg-[#FFD400] hover:bg-[#FFC800] text-black font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      Next Step <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4 text-center py-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 text-center">
                      <h4 className="font-black text-slate-800 text-sm">Provisioning Summary</h4>
                      <p className="text-slate-455 font-semibold text-[11px] leading-normal max-w-sm mx-auto">
                        This action will immediately deploy licensing rules changes across the global database.
                      </p>
                    </div>

                    <div className="bg-[#F8FAFC] border border-slate-150 rounded-2xl p-4 text-left space-y-2 text-[11px] font-bold">
                      <div className="flex justify-between"><span className="text-slate-400">Tier Name:</span><span className="text-slate-800">{formName}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Version:</span><span className="font-mono text-slate-800">v{formVersion}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Lifecycle Status:</span><span className="text-slate-800">{formStatus}</span></div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-100 mt-4">
                    <button
                      type="button"
                      onClick={() => setWizardStep(4)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Confirm & Save Plan
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Validate State Lifecycle Transition (Deprecate Modal) */}
      {showDeprecateModal && selectedPlan && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in text-left">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-800">Validate State Lifecycle Transition</h3>
              <button 
                type="button" 
                onClick={() => setShowDeprecateModal(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 text-xs font-semibold text-slate-600">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                <h4 className="font-black text-slate-800 text-xs">Lifecycle State Transition Validation Rule Check</h4>
                <p className="text-slate-655 font-semibold text-[11px] leading-normal mt-1.5">
                  You are transitioning licensing plan level <span className="font-extrabold text-slate-900">"{selectedPlan.name}"</span> to state <span className="font-extrabold text-slate-900">"Deprecated"</span>.
                </p>
              </div>

              <p className="text-slate-500 font-semibold text-[11px] leading-normal">
                This transition will update the plan state across all registry nodes and is tracked under audit log history. Are you sure you wish to continue?
              </p>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDeprecateModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeprecate}
                  className="bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Confirm Transition
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Launch Coupon Promotional Campaign Modal (Screenshot 5!) */}
      {showPromoModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-md overflow-hidden shadow-2xl animate-fade-in text-left">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-800">Launch Coupon Promotional Campaign</h3>
              <button 
                type="button" 
                onClick={() => setShowPromoModal(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Form */}
            <form onSubmit={handleLaunchPromo} className="p-6 space-y-4 text-xs font-semibold text-slate-700">
              
              <div className="text-left">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Coupon Promo Code</label>
                <input
                  type="text"
                  required
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="e.g. OFF50PCT"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] rounded-xl focus:outline-none text-slate-800 text-xs font-bold font-mono placeholder:text-slate-350"
                />
              </div>

              <div className="text-left">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Promotion Coupon Type</label>
                <select
                  value={promoType}
                  onChange={(e) => setPromoType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs font-bold rounded-xl focus:outline-none text-slate-800 cursor-pointer"
                >
                  <option value="Percentage Off (%)">Percentage Off (%)</option>
                  <option value="Fixed Value Off ($)">Fixed Value Off ($)</option>
                  <option value="Trial Days Extension">Trial Days Extension</option>
                </select>
              </div>

              <div className="text-left">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Discount Value / Extension Days</label>
                <input
                  type="text"
                  required
                  value={promoValue}
                  onChange={(e) => setPromoValue(e.target.value)}
                  placeholder="e.g. 10 or 30"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] rounded-xl focus:outline-none text-slate-800 text-xs font-bold placeholder:text-slate-350"
                />
              </div>

              <div className="text-left">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Promo Campaign Name</label>
                <input
                  type="text"
                  required
                  value={promoCampaignName}
                  onChange={(e) => setPromoCampaignName(e.target.value)}
                  placeholder="e.g. Winter Sales Kickoff"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] rounded-xl focus:outline-none text-slate-800 text-xs font-bold placeholder:text-slate-350"
                />
              </div>

              <div className="text-left">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Campaign Expiration Date</label>
                <input
                  type="date"
                  required
                  value={promoExpiryDate}
                  onChange={(e) => setPromoExpiryDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] rounded-xl focus:outline-none text-slate-800 text-xs font-bold cursor-pointer"
                />
              </div>

              <div className="text-left">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Redemption Limits Usage</label>
                <input
                  type="number"
                  required
                  value={promoLimit}
                  onChange={(e) => setPromoLimit(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] rounded-xl focus:outline-none text-slate-800 text-xs font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#FFD400] hover:bg-[#FFC800] text-black font-extrabold text-xs py-3 rounded-xl shadow-xs transition-colors cursor-pointer mt-2 text-center"
              >
                Launch Promotional Code
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Version Control Center Right-Side Drawer */}
      {showVersioningDrawer && versioningPlan && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
            onClick={() => setShowVersioningDrawer(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col z-10 text-left">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-white">
              <h3 className="text-lg font-extrabold text-slate-900">Version Control Center</h3>
              <button
                onClick={() => setShowVersioningDrawer(false)}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar bg-white">

              {/* Plan name & status */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-black text-slate-900">{versioningPlan.name}</h2>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Current version {versioningPlan.version}</p>
                </div>
                <span className="bg-amber-100 text-amber-700 text-[11px] font-black px-3 py-1 rounded-full border border-amber-200">
                  {versioningPlan.status}
                </span>
              </div>

              {/* VERSION UPDATES LOG */}
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">VERSION UPDATES LOG</p>

                {/* v1.0.0 */}
                <div className="border border-slate-200 rounded-2xl p-4 flex justify-between items-start gap-3">
                  <div>
                    <p className="text-sm font-black text-slate-800">Version v1.0.0</p>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">Initial release of {versioningPlan.name} plan tier.</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1.5">06/20/2026, 09:00:00 AM &bull; System Root</p>
                  </div>
                  <button
                    onClick={() => showNotification(`Rolled back ${versioningPlan.name} to v1.0.0`)}
                    className="shrink-0 border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs px-4 py-1.5 rounded-xl cursor-pointer transition-colors"
                  >
                    Rollback
                  </button>
                </div>

                {/* v1.1.0 */}
                <div className="border border-slate-200 rounded-2xl p-4">
                  <p className="text-sm font-black text-slate-800">Version v1.1.0</p>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">Upgraded limits and added Integrations &amp; Customer Portal.</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-1.5">06/20/2026, 09:05:00 AM &bull; System Root</p>
                </div>
              </div>

              {/* COMPARE VERSIONS SIDE-BY-SIDE */}
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">COMPARE VERSIONS SIDE-BY-SIDE</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">VERSION A</p>
                    <div className="relative">
                      <select
                        value={versionCompareA}
                        onChange={(e) => setVersionCompareA(e.target.value)}
                        className={`w-full px-3 py-2.5 border rounded-2xl focus:outline-none focus:border-[#FFD400] text-xs font-bold appearance-none cursor-pointer pr-8 ${
                          versionCompareA !== '-- Select A --' ? 'border-[#FFD400] border-2' : 'border-slate-200'
                        } text-slate-700 bg-white`}
                      >
                        <option>-- Select A --</option>
                        <option>v1.0.0</option>
                        <option>v1.1.0</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">VERSION B</p>
                    <div className="relative">
                      <select
                        value={versionCompareB}
                        onChange={(e) => setVersionCompareB(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-2xl focus:outline-none focus:border-[#FFD400] text-xs font-bold appearance-none cursor-pointer pr-8 text-slate-700 bg-white"
                      >
                        <option>-- Select B --</option>
                        <option>v1.0.0</option>
                        <option>v1.1.0</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (versionCompareA === '-- Select A --' || versionCompareB === '-- Select B --') {
                      showNotification('Please select both versions to compare.');
                    } else {
                      showNotification(`Comparing ${versioningPlan.name}: ${versionCompareA} vs ${versionCompareB}`);
                    }
                  }}
                  className="w-full bg-[#FFB020] hover:bg-[#FFC800] text-slate-900 font-extrabold text-sm py-3 rounded-2xl shadow-sm transition-all cursor-pointer"
                >
                  Compare Selected Versions
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
      {/* Inspect Receipt Modal */}
      {showReceiptModal && selectedInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[1001] p-4">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-[560px] overflow-hidden shadow-2xl animate-fade-in text-left">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block font-mono">INVOICE RECEIPT // {selectedInvoice.invoiceNo}</span>
                <h3 className="text-base font-extrabold text-slate-900 mt-0.5">{selectedInvoice.company}</h3>
              </div>
              <button onClick={() => setShowReceiptModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-lg hover:bg-slate-50">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Body */}
            <div className="p-6 space-y-5">

              {/* Status Banner */}
              <div className={`flex items-center justify-between px-4 py-3 rounded-2xl border ${
                selectedInvoice.status === 'Paid' ? 'bg-emerald-50 border-emerald-200' :
                selectedInvoice.status === 'Overdue' ? 'bg-rose-50 border-rose-200' :
                selectedInvoice.status === 'Sent' ? 'bg-amber-50 border-amber-200' :
                'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-xs font-bold text-slate-500">Payment Status</span>
                <span className={`text-sm font-black uppercase tracking-wider ${
                  selectedInvoice.status === 'Paid' ? 'text-emerald-600' :
                  selectedInvoice.status === 'Overdue' ? 'text-rose-600' :
                  selectedInvoice.status === 'Sent' ? 'text-amber-600' :
                  'text-slate-600'
                }`}>{selectedInvoice.status}</span>
              </div>

              {/* Line Items */}
              <div className="space-y-2.5">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Invoice Number</span>
                  <span className="text-xs font-black text-slate-800 font-mono">{selectedInvoice.invoiceNo}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Company</span>
                  <span className="text-xs font-black text-slate-800">{selectedInvoice.company}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Plan Level</span>
                  <span className="text-xs font-black text-slate-800">{selectedInvoice.plan}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Billing Period</span>
                  <span className="text-xs font-black text-slate-800 font-mono">{selectedInvoice.period}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Issued Date</span>
                  <span className="text-xs font-black text-slate-800 font-mono">{selectedInvoice.date}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Payment Method</span>
                  <span className="text-xs font-bold text-slate-700">{selectedInvoice.method}</span>
                </div>

                {/* Total */}
                <div className="flex justify-between py-3 bg-slate-50 rounded-2xl px-4 mt-2">
                  <span className="text-sm font-black text-slate-700">TOTAL AMOUNT</span>
                  <span className="text-lg font-black text-emerald-600 font-mono">{selectedInvoice.amount}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => {
                    showNotification(`Invoice ${selectedInvoice.invoiceNo} downloaded as PDF.`);
                    setShowReceiptModal(false);
                  }}
                  className="flex-1 bg-[#FFB020] hover:bg-[#FFC800] text-slate-900 font-extrabold text-xs py-3 rounded-2xl shadow-sm transition-all cursor-pointer text-center"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => {
                    showNotification(`Receipt email sent to ${selectedInvoice.company}.`);
                    setShowReceiptModal(false);
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs py-3 rounded-2xl transition-all cursor-pointer text-center"
                >
                  Send via Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
