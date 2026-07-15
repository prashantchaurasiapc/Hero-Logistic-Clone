import React, { useState, useEffect, useRef } from 'react';
import { 
  CreditCard, Calendar, RefreshCw, ShieldAlert, ArrowUpRight, Search, 
  Check, Edit2, Download, Filter, ChevronDown, DollarSign, Users, AlertCircle, FileText
} from 'lucide-react';

export default function Subscriptions() {
  const [searchCompany, setSearchCompany] = useState('');
  const [searchSubId, setSearchSubId] = useState('');
  const [selectedPlanFilter, setSelectedPlanFilter] = useState('All Plans');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All Statuses');
  const [toast, setToast] = useState('');

  // Dropdown states
  const [activeActionsMenu, setActiveActionsMenu] = useState(null); // ID of subscription whose menu is open
  const actionsMenuRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
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

  // Subscriptions data list based on screenshots
  const [subscriptions, setSubscriptions] = useState([
    { 
      id: 'SUB-1005', 
      company: 'Apex Logistics LLC', 
      plan: 'Professional', 
      status: 'ACTIVE', 
      billingPeriod: 'Monthly', 
      startDate: '06/19/2026', 
      nextRenewal: '07/19/2026', 
      amount: 4910, 
      autoRenewal: 'Yes',
      limitOverflow: 'Users (16/15)' 
    },
    { 
      id: 'SUB-1001', 
      company: 'Falcon Logistics LLC', 
      plan: 'Professional', 
      status: 'ACTIVE', 
      billingPeriod: 'Monthly', 
      startDate: '03/12/2026', 
      nextRenewal: '07/24/2026', 
      amount: 8500, 
      autoRenewal: 'Yes',
      limitOverflow: null
    },
    { 
      id: 'SUB-1003', 
      company: 'Global Shipping Solutions', 
      plan: 'Enterprise', 
      status: 'ACTIVE', 
      billingPeriod: 'Monthly', 
      startDate: '02/01/2026', 
      nextRenewal: '07/01/2026', 
      amount: 28000, 
      autoRenewal: 'Yes',
      limitOverflow: null
    },
    { 
      id: 'SUB-1002', 
      company: 'Swift Cargo Express', 
      plan: 'Professional', 
      status: 'ACTIVE', 
      billingPeriod: 'Monthly', 
      startDate: '04/19/2026', 
      nextRenewal: '07/19/2026', 
      amount: 499, 
      autoRenewal: 'Yes',
      limitOverflow: null
    },
    { 
      id: 'SUB-1004', 
      company: 'Texas Hotshot Carriers', 
      plan: 'Professional', 
      status: 'HOLD', 
      billingPeriod: 'Monthly', 
      startDate: '05/20/2026', 
      nextRenewal: '06/20/2026', 
      amount: 499, 
      autoRenewal: 'No',
      limitOverflow: null
    }
  ]);

  const handleActionClick = (actionName, subId) => {
    showNotification(`Triggered "${actionName}" for subscription ${subId}`);
    setActiveActionsMenu(null);
  };

  // Filter subscriptions
  const filteredSubs = subscriptions.filter(sub => {
    const matchesCompany = sub.company.toLowerCase().includes(searchCompany.toLowerCase());
    const matchesSubId = sub.id.toLowerCase().includes(searchSubId.toLowerCase());
    
    const matchesPlan = selectedPlanFilter === 'All Plans' || sub.plan.toLowerCase() === selectedPlanFilter.toLowerCase();
    const matchesStatus = selectedStatusFilter === 'All Statuses' || sub.status.toLowerCase() === selectedStatusFilter.toLowerCase();

    return matchesCompany && matchesSubId && matchesPlan && matchesStatus;
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
            Super Admin <span className="text-slate-350 font-black">•</span> Subscriptions
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Configure global licensing rules, audit tenant margins, and resolve support tickets.
          </p>
        </div>
        <button 
          onClick={() => {
            alert(`SaaS Subscriptions Status Summary:\nActive subscriptions: 4\nSuspended subscriptions: 1\nMRR: $41,909`);
            showNotification('Report compiled.');
          }}
          className="border border-[#e2e8f0] hover:bg-slate-50 text-amber-500 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto bg-white"
        >
          Export Report
        </button>
      </div>

      {/* Horizontal KPI Metrics Cards Row */}
      <div className="flex overflow-x-auto gap-4 pb-2.5 custom-scrollbar">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-w-[170px] flex-1">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">ACTIVE SUBS</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">4</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 mt-2 block whitespace-nowrap">Active workspac... Stable</span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-w-[170px] flex-1">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">TRIAL SUBS</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">0</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">Starter trials act...</span>
            <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md shrink-0">+1 new</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-w-[170px] flex-1">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">EXPIRING TRIALS</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">0</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 mt-2 block whitespace-nowrap">Trials requiring r... Stable</span>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-w-[170px] flex-1">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">SUSPENDED SUBS</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">1</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">On-Hold worksp...</span>
            <span className="text-[9px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md shrink-0">0 alerts</span>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-w-[170px] flex-1">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">MRR (USD)</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">$41,909</span>
          </div>
          <span className="text-[10px] font-semibold text-[#10B981] mt-2 block whitespace-nowrap">Monthly Recurring ... +8%</span>
        </div>

        {/* Metric 6 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-w-[170px] flex-1">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">ARR (USD)</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">$5,02,908</span>
          </div>
          <span className="text-[10px] font-semibold text-[#10B981] mt-2 block whitespace-nowrap">Annual projection ... +12%</span>
        </div>

        {/* Metric 7 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-w-[170px] flex-1">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">FAILED PAYMENTS</span>
            <span className="text-2xl font-black text-slate-800 block mt-1.5">1</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">Gateway balan...</span>
            <span className="text-[9px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md shrink-0">0 issues</span>
          </div>
        </div>
      </div>

      {/* Analytics & Churn Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Section: MRR & ARR Performance Analytics */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-black text-slate-800">MRR & ARR Performance Analytics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart 1: Monthly Revenue Trend (USD) */}
            <div className="space-y-2">
              <span className="text-[11px] font-black text-slate-500 block">Monthly Revenue Trend (USD)</span>
              
              {/* Custom SVG Line Chart */}
              <div className="relative border border-slate-50 rounded-xl p-3 h-52 flex items-end">
                <svg className="w-full h-36 overflow-visible text-slate-400" viewBox="0 0 260 120">
                  {/* Grid Lines */}
                  <line x1="0" y1="90" x2="260" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="60" x2="260" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="30" x2="260" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                  
                  {/* Line Path */}
                  <path 
                    d="M 20 110 Q 50 60 70 60 Q 90 60 110 60 Q 150 60 170 60 Q 190 60 210 60 Q 230 40 250 30" 
                    fill="none" 
                    stroke="#0EA5E9" 
                    strokeWidth="3.5" 
                  />
                  
                  {/* Circles */}
                  <circle cx="20" cy="110" r="3.5" fill="#FFFFFF" stroke="#0EA5E9" strokeWidth="2.5" />
                  <circle cx="70" cy="60" r="3.5" fill="#FFFFFF" stroke="#0EA5E9" strokeWidth="2.5" />
                  <circle cx="110" cy="60" r="3.5" fill="#FFFFFF" stroke="#0EA5E9" strokeWidth="2.5" />
                  <circle cx="210" cy="60" r="3.5" fill="#FFFFFF" stroke="#0EA5E9" strokeWidth="2.5" />
                  <circle cx="250" cy="30" r="3.5" fill="#FFFFFF" stroke="#0EA5E9" strokeWidth="2.5" />
                  
                  {/* Tooltip on March */}
                  <g transform="translate(85, 20)">
                    <rect x="0" y="0" width="70" height="35" rx="8" fill="#FFFFFF" stroke="#e2e8f0" strokeWidth="1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.04))" />
                    <text x="35" y="14" textAnchor="middle" className="text-[9px] font-black fill-slate-800">Mar</text>
                    <text x="35" y="26" textAnchor="middle" className="text-[8px] font-bold fill-[#0EA5E9]">value : 28000</text>
                  </g>
                  <line x1="110" y1="57" x2="110" y2="120" stroke="#cbd5e1" strokeDasharray="2 2" strokeWidth="1" />

                  {/* Y Axis labels */}
                  <text x="-5" y="93" className="text-[8px] font-bold fill-slate-400">15000</text>
                  <text x="-5" y="63" className="text-[8px] font-bold fill-slate-400">30000</text>
                  <text x="-5" y="33" className="text-[8px] font-bold fill-slate-400">45000</text>
                  <text x="-5" y="8" className="text-[8px] font-bold fill-slate-400">60000</text>

                  {/* X Axis labels */}
                  <text x="18" y="130" className="text-[8px] font-bold fill-slate-450">Jan</text>
                  <text x="68" y="130" className="text-[8px] font-bold fill-slate-450">Feb</text>
                  <text x="108" y="130" className="text-[8px] font-bold fill-slate-450">Mar</text>
                  <text x="158" y="130" className="text-[8px] font-bold fill-slate-450">Apr</text>
                  <text x="208" y="130" className="text-[8px] font-bold fill-slate-450">May</text>
                  <text x="246" y="130" className="text-[8px] font-bold fill-slate-450">Jun</text>
                </svg>
              </div>
            </div>

            {/* Chart 2: Annual Projection (USD) */}
            <div className="space-y-2">
              <span className="text-[11px] font-black text-slate-500 block">Annual Projection (USD)</span>
              
              {/* Custom SVG Bar Chart */}
              <div className="relative border border-slate-50 rounded-xl p-3 h-52 flex items-end">
                <svg className="w-full h-36 overflow-visible" viewBox="0 0 260 120">
                  {/* Grid Lines */}
                  <line x1="0" y1="90" x2="260" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="60" x2="260" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="30" x2="260" y2="30" stroke="#f1f5f9" strokeWidth="1" />

                  {/* Bars representing value */}
                  {/* Feb */}
                  <rect x="62" y="55" width="22" height="65" rx="3" fill="#0EA5E9" />
                  {/* Mar */}
                  <rect x="102" y="54" width="22" height="66" rx="3" fill="#0EA5E9" />
                  {/* Apr */}
                  <rect x="142" y="50" width="22" height="70" rx="3" fill="#0EA5E9" />
                  {/* May */}
                  <rect x="182" y="51" width="22" height="69" rx="3" fill="#0EA5E9" />
                  {/* Jun */}
                  <rect x="222" y="20" width="22" height="100" rx="3" fill="#0EA5E9" />

                  {/* Y Axis labels */}
                  <text x="-5" y="93" className="text-[8px] font-bold fill-slate-400">150000</text>
                  <text x="-5" y="63" className="text-[8px] font-bold fill-slate-400">300000</text>
                  <text x="-5" y="33" className="text-[8px] font-bold fill-slate-400">450000</text>

                  {/* X Axis labels */}
                  <text x="20" y="130" className="text-[8px] font-bold fill-slate-450">Jan</text>
                  <text x="65" y="130" className="text-[8px] font-bold fill-slate-450">Feb</text>
                  <text x="105" y="130" className="text-[8px] font-bold fill-slate-450">Mar</text>
                  <text x="145" y="130" className="text-[8px] font-bold fill-slate-450">Apr</text>
                  <text x="185" y="130" className="text-[8px] font-bold fill-slate-450">May</text>
                  <text x="225" y="130" className="text-[8px] font-bold fill-slate-450">Jun</text>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Churn & Plan Shifts */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-black text-slate-800">Churn & Plan Shifts</h2>
          
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* Box 1 */}
            <div className="border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-1 bg-white">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">UPGRADES</span>
              <span className="text-2xl font-black text-[#10B981]">2</span>
            </div>

            {/* Box 2 */}
            <div className="border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-1 bg-white">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">DOWNGRADES</span>
              <span className="text-2xl font-black text-amber-500">1</span>
            </div>

            {/* Box 3 */}
            <div className="border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-1 bg-white">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">CHURN RATE</span>
              <span className="text-2xl font-black text-rose-500">0.0%</span>
            </div>

            {/* Box 4 */}
            <div className="border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-1 bg-white">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">SUB GROWTH</span>
              <span className="text-2xl font-black text-amber-500">80.0%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Search, Filter dropdown row */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-grow max-w-xs text-left">
          <input
            type="text"
            placeholder="Search Company Name"
            value={searchCompany}
            onChange={(e) => setSearchCompany(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none placeholder:text-slate-400 text-slate-800 font-bold"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        </div>

        <div className="relative flex-grow max-w-xs text-left">
          <input
            type="text"
            placeholder="Search Sub ID"
            value={searchSubId}
            onChange={(e) => setSearchSubId(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none placeholder:text-slate-400 text-slate-800 font-bold"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <select
            value={selectedPlanFilter}
            onChange={(e) => setSelectedPlanFilter(e.target.value)}
            className="border border-slate-200 bg-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#FFD400] text-slate-800 font-black cursor-pointer min-w-[120px]"
          >
            <option value="All Plans">All Plans</option>
            <option value="Starter">Starter</option>
            <option value="Professional">Professional</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="border border-slate-200 bg-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#FFD400] text-slate-800 font-black cursor-pointer min-w-[120px]"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="HOLD">HOLD</option>
          </select>
        </div>
      </div>

      {/* Subscription licensing table */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs font-bold text-slate-700 min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="py-4 px-5 text-center w-12">
                  <input type="checkbox" className="w-4 h-4 rounded cursor-pointer" />
                </th>
                <th className="py-4 px-4">Subscription ID</th>
                <th className="py-4 px-4">Company ▲</th>
                <th className="py-4 px-4">Plan</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Billing Period</th>
                <th className="py-4 px-4">Start Date</th>
                <th className="py-4 px-4">Next Renewal</th>
                <th className="py-4 px-4">Amount</th>
                <th className="py-4 px-4">Auto Renewal</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700 bg-white">
              {filteredSubs.length === 0 ? (
                <tr>
                  <td colSpan="11" className="py-8 text-center text-slate-400 font-semibold bg-white w-full">
                    No active licenses found matching filters.
                  </td>
                </tr>
              ) : (
                filteredSubs.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-5 text-center w-12">
                      <input type="checkbox" className="w-4 h-4 rounded cursor-pointer" />
                    </td>
                    <td className="py-4 px-4 font-mono font-medium text-slate-450">
                      {sub.id}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col space-y-1">
                        <span className="text-slate-900 font-black">{sub.company}</span>
                        {sub.limitOverflow && (
                          <span className="bg-rose-50 text-rose-600 text-[9px] font-black px-2 py-0.5 rounded-full inline-flex items-center gap-1 w-max border border-rose-100">
                            <AlertCircle className="w-2.5 h-2.5" /> Limit Overflow: {sub.limitOverflow}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-800">
                      {sub.plan}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        sub.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-semibold">
                      {sub.billingPeriod}
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-mono font-medium">
                      {sub.startDate}
                    </td>
                    <td className="py-4 px-4 text-slate-900 font-mono font-black">
                      {sub.nextRenewal}
                    </td>
                    <td className="py-4 px-4 text-emerald-600 font-black">
                      ${sub.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-semibold">
                      {sub.autoRenewal}
                    </td>
                    <td className="py-4 px-6 text-center relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveActionsMenu(activeActionsMenu === sub.id ? null : sub.id);
                        }}
                        className="bg-white border border-black hover:bg-slate-50 text-slate-800 font-extrabold text-[11px] px-3.5 py-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs"
                      >
                        Actions <ChevronDown className="w-3 h-3 text-slate-700" />
                      </button>

                      {/* Dropdown Card (Screenshot 4 & 5!) */}
                      {activeActionsMenu === sub.id && (
                        <div 
                          ref={actionsMenuRef}
                          className="absolute right-6 mt-1 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl p-2.5 z-40 space-y-1 text-left text-xs text-slate-700 font-bold"
                        >
                          <button onClick={() => handleActionClick('View Subscription', sub.id)} className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-slate-700 cursor-pointer">
                            View Subscription
                          </button>
                          <button onClick={() => handleActionClick('Edit Subscription', sub.id)} className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-slate-700 cursor-pointer">
                            Edit Subscription
                          </button>
                          
                          {/* Up/Down grades */}
                          <button onClick={() => handleActionClick('Upgrade Subscription', sub.id)} className="w-full text-left px-3 py-2 hover:bg-emerald-50 rounded-lg text-emerald-600 cursor-pointer">
                            Upgrade Subscription
                          </button>
                          <button onClick={() => handleActionClick('Downgrade Subscription', sub.id)} className="w-full text-left px-3 py-2 hover:bg-amber-50 rounded-lg text-yellow-600 cursor-pointer">
                            Downgrade Subscription
                          </button>

                          {/* Pause / Resume */}
                          <button onClick={() => handleActionClick('Pause Subscription', sub.id)} className="w-full text-left px-3 py-2 hover:bg-rose-50 rounded-lg text-rose-500 cursor-pointer">
                            Pause Subscription
                          </button>
                          <button onClick={() => handleActionClick('Resume Subscription', sub.id)} className="w-full text-left px-3 py-2 hover:bg-emerald-50 rounded-lg text-emerald-600 cursor-pointer">
                            Resume Subscription
                          </button>
                          <button onClick={() => handleActionClick('Cancel Auto-Renewal', sub.id)} className="w-full text-left px-3 py-2 hover:bg-rose-50 rounded-lg text-rose-500 cursor-pointer">
                            Cancel Auto-Renewal
                          </button>

                          {/* Divider */}
                          <div className="border-t border-slate-100 my-1" />

                          <button onClick={() => handleActionClick('Renew Manually', sub.id)} className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-slate-700 cursor-pointer">
                            Renew Manually
                          </button>
                          <button onClick={() => handleActionClick('Assign Plan', sub.id)} className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-slate-700 cursor-pointer">
                            Assign Plan
                          </button>
                          <button onClick={() => handleActionClick('Billing History', sub.id)} className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-slate-700 cursor-pointer">
                            Billing History
                          </button>
                          <button onClick={() => handleActionClick('Generate Invoice', sub.id)} className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-slate-700 cursor-pointer">
                            Generate Invoice
                          </button>
                          <button onClick={() => handleActionClick('Send Reminder', sub.id)} className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-slate-700 cursor-pointer">
                            Send Reminder
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
