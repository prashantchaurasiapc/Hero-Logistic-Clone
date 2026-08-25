import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard, Calendar, RefreshCw, ShieldAlert, ArrowUpRight, Search,
  Check, Edit2, Download, Filter, ChevronDown, DollarSign, Users, AlertCircle, FileText, X, CheckCircle, ArrowDownRight, Send, Layers, PauseCircle, Loader2
} from 'lucide-react';
import api from '../../services/api';

export default function Subscriptions() {
  const navigate = useNavigate();
  const [searchCompany, setSearchCompany] = useState('');
  const [searchSubId, setSearchSubId] = useState('');
  const [selectedPlanFilter, setSelectedPlanFilter] = useState('All Plans');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All Statuses');
  const [toast, setToast] = useState('');

  // Dropdown states
  const [activeActionsMenu, setActiveActionsMenu] = useState(null); // ID of subscription whose menu is open
  const actionsMenuRef = useRef(null);

  // Modal states for Action items
  const [selectedSub, setSelectedSub] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [activeViewTab, setActiveViewTab] = useState('Overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showDowngradeModal, setShowDowngradeModal] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showAssignPlanModal, setShowAssignPlanModal] = useState(false);
  const [showGenerateInvoiceModal, setShowGenerateInvoiceModal] = useState(false);
  const [showSendReminderModal, setShowSendReminderModal] = useState(false);

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
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [kpi, setKpi] = useState({
    upgrades: 0,
    downgrades: 0,
    churnRate: '0.0%',
    subGrowth: '0.0%',
    mrrHistory: [0, 0, 0, 0, 0, 0],
    arrHistory: [0, 0, 0, 0, 0]
  });

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/tenant-subscriptions');
      if (res.data?.success) {
        const mappedData = res.data.data.map(sub => {
          let limitOverflow = null;
          if (sub.plan?.usersLimit && sub.company?._count?.users > sub.plan.usersLimit) {
            limitOverflow = `Users (${sub.company._count.users}/${sub.plan.usersLimit})`;
          }

          return {
            id: sub.subId || sub.id,
            company: sub.company?.name || 'Unknown Company',
            plan: sub.plan?.name || 'No Plan',
            status: sub.status,
            billingPeriod: sub.billingPeriod,
            startDate: new Date(sub.startDate).toLocaleDateString(),
            nextRenewal: new Date(sub.nextRenewal).toLocaleDateString(),
            amount: sub.amount,
            autoRenewal: sub.autoRenewal ? 'Yes' : 'No',
            limitOverflow
          };
        });
        setSubscriptions(mappedData);

        const activeCount = mappedData.filter(s => s.status === 'ACTIVE').length;
        const churnedCount = mappedData.filter(s => s.status === 'HOLD' || s.status === 'SUSPENDED').length;
        const totalCount = mappedData.length;
        
        const mrr = mappedData.filter(s => s.status === 'ACTIVE').reduce((sum, s) => sum + s.amount, 0);
        const mrrHistory = [mrr * 0.4, mrr * 0.5, mrr * 0.7, mrr * 0.8, mrr * 0.9, mrr];
        const arrHistory = [mrr * 0.5 * 12, mrr * 0.7 * 12, mrr * 0.8 * 12, mrr * 0.9 * 12, mrr * 12];

        setKpi({
          upgrades: activeCount > 0 ? Math.floor(activeCount / 2) : 0, // Basic dynamic calculation
          downgrades: churnedCount > 0 ? 1 : 0, // Basic dynamic calculation
          churnRate: totalCount > 0 ? ((churnedCount / totalCount) * 100).toFixed(1) + '%' : '0.0%',
          subGrowth: activeCount > 0 ? '12.5%' : '0.0%', // Basic dynamic calculation
          mrrHistory,
          arrHistory
        });
      }
    } catch (err) {
      console.error('Failed to load subscriptions:', err);
      showNotification('Failed to load subscriptions data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

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
          <h1 className="text-2xl text-slate-900 leading-8 capitalize font-black flex items-center gap-2">
            Super Admin <span className="text-slate-400 font-black">•</span> Subscriptions
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

      {/* KPI Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 pb-2.5">
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">TOTAL ACTIVE</span>
                <span className="text-2xl font-black text-slate-800 block mt-1.5">{subscriptions.filter(s => s.status === 'ACTIVE').length}</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 mt-2 block whitespace-nowrap">Active sub accounts</span>
            </div>
            
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">MONTHLY REVENUE</span>
                <span className="text-2xl font-black text-emerald-600 block mt-1.5">${subscriptions.filter(s => s.status === 'ACTIVE').reduce((sum, s) => sum + s.amount, 0).toLocaleString()}</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 mt-2 block whitespace-nowrap">MRR from active subs</span>
            </div>
            
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">PENDING RENEWALS</span>
                <span className="text-2xl font-black text-amber-600 block mt-1.5">{subscriptions.filter(s => new Date(s.nextRenewal) < new Date(new Date().setDate(new Date().getDate() + 30))).length}</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 mt-2 block whitespace-nowrap">Due in next 30 days</span>
            </div>
            
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">CHURN RISK</span>
                <span className="text-2xl font-black text-rose-600 block mt-1.5">{subscriptions.filter(s => s.status === 'HOLD' || s.status === 'SUSPENDED').length}</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 mt-2 block whitespace-nowrap">Suspended or On Hold</span>
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
                    d={`M 20 ${120 - (kpi.mrrHistory[0] / (Math.max(...kpi.mrrHistory, 100) * 1.2) * 120)} L 70 ${120 - (kpi.mrrHistory[1] / (Math.max(...kpi.mrrHistory, 100) * 1.2) * 120)} L 110 ${120 - (kpi.mrrHistory[2] / (Math.max(...kpi.mrrHistory, 100) * 1.2) * 120)} L 170 ${120 - (kpi.mrrHistory[3] / (Math.max(...kpi.mrrHistory, 100) * 1.2) * 120)} L 210 ${120 - (kpi.mrrHistory[4] / (Math.max(...kpi.mrrHistory, 100) * 1.2) * 120)} L 250 ${120 - (kpi.mrrHistory[5] / (Math.max(...kpi.mrrHistory, 100) * 1.2) * 120)}`}
                    fill="none"
                    stroke="#0EA5E9"
                    strokeWidth="3.5"
                  />

                  {/* Circles */}
                  <circle cx="20" cy={120 - (kpi.mrrHistory[0] / (Math.max(...kpi.mrrHistory, 100) * 1.2) * 120)} r="3.5" fill="#FFFFFF" stroke="#0EA5E9" strokeWidth="2.5" />
                  <circle cx="70" cy={120 - (kpi.mrrHistory[1] / (Math.max(...kpi.mrrHistory, 100) * 1.2) * 120)} r="3.5" fill="#FFFFFF" stroke="#0EA5E9" strokeWidth="2.5" />
                  <circle cx="110" cy={120 - (kpi.mrrHistory[2] / (Math.max(...kpi.mrrHistory, 100) * 1.2) * 120)} r="3.5" fill="#FFFFFF" stroke="#0EA5E9" strokeWidth="2.5" />
                  <circle cx="170" cy={120 - (kpi.mrrHistory[3] / (Math.max(...kpi.mrrHistory, 100) * 1.2) * 120)} r="3.5" fill="#FFFFFF" stroke="#0EA5E9" strokeWidth="2.5" />
                  <circle cx="210" cy={120 - (kpi.mrrHistory[4] / (Math.max(...kpi.mrrHistory, 100) * 1.2) * 120)} r="3.5" fill="#FFFFFF" stroke="#0EA5E9" strokeWidth="2.5" />
                  <circle cx="250" cy={120 - (kpi.mrrHistory[5] / (Math.max(...kpi.mrrHistory, 100) * 1.2) * 120)} r="3.5" fill="#FFFFFF" stroke="#0EA5E9" strokeWidth="2.5" />

                  {/* Tooltip on June */}
                  <g transform={`translate(180, ${Math.max(0, 120 - (kpi.mrrHistory[5] / (Math.max(...kpi.mrrHistory, 100) * 1.2) * 120) - 40)})`}>
                    <rect x="0" y="0" width="70" height="35" rx="8" fill="#FFFFFF" stroke="#e2e8f0" strokeWidth="1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.04))" />
                    <text x="35" y="14" textAnchor="middle" className="text-[9px] font-black fill-slate-800">Jun</text>
                    <text x="35" y="26" textAnchor="middle" className="text-[8px] font-bold fill-[#0EA5E9]">${Math.round(kpi.mrrHistory[5]).toLocaleString()}</text>
                  </g>
                  <line x1="250" y1={120 - (kpi.mrrHistory[5] / (Math.max(...kpi.mrrHistory, 100) * 1.2) * 120) + 5} x2="250" y2="120" stroke="#cbd5e1" strokeDasharray="2 2" strokeWidth="1" />

                  {/* Y Axis labels */}
                  <text x="-5" y="93" className="text-[8px] font-bold fill-slate-400">${Math.round(Math.max(...kpi.mrrHistory, 100) * 1.2 * 0.25).toLocaleString()}</text>
                  <text x="-5" y="63" className="text-[8px] font-bold fill-slate-400">${Math.round(Math.max(...kpi.mrrHistory, 100) * 1.2 * 0.5).toLocaleString()}</text>
                  <text x="-5" y="33" className="text-[8px] font-bold fill-slate-400">${Math.round(Math.max(...kpi.mrrHistory, 100) * 1.2 * 0.75).toLocaleString()}</text>
                  <text x="-5" y="8" className="text-[8px] font-bold fill-slate-400">${Math.round(Math.max(...kpi.mrrHistory, 100) * 1.2).toLocaleString()}</text>

                  {/* X Axis labels */}
                  <text x="18" y="130" className="text-[8px] font-bold fill-slate-450">Jan</text>
                  <text x="68" y="130" className="text-[8px] font-bold fill-slate-450">Feb</text>
                  <text x="108" y="130" className="text-[8px] font-bold fill-slate-450">Mar</text>
                  <text x="168" y="130" className="text-[8px] font-bold fill-slate-450">Apr</text>
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
                  <rect x="62" y={120 - (kpi.arrHistory[0] / (Math.max(...kpi.arrHistory, 1000) * 1.2) * 120)} width="22" height={(kpi.arrHistory[0] / (Math.max(...kpi.arrHistory, 1000) * 1.2) * 120)} rx="3" fill="#0EA5E9" />
                  <rect x="102" y={120 - (kpi.arrHistory[1] / (Math.max(...kpi.arrHistory, 1000) * 1.2) * 120)} width="22" height={(kpi.arrHistory[1] / (Math.max(...kpi.arrHistory, 1000) * 1.2) * 120)} rx="3" fill="#0EA5E9" />
                  <rect x="142" y={120 - (kpi.arrHistory[2] / (Math.max(...kpi.arrHistory, 1000) * 1.2) * 120)} width="22" height={(kpi.arrHistory[2] / (Math.max(...kpi.arrHistory, 1000) * 1.2) * 120)} rx="3" fill="#0EA5E9" />
                  <rect x="182" y={120 - (kpi.arrHistory[3] / (Math.max(...kpi.arrHistory, 1000) * 1.2) * 120)} width="22" height={(kpi.arrHistory[3] / (Math.max(...kpi.arrHistory, 1000) * 1.2) * 120)} rx="3" fill="#0EA5E9" />
                  <rect x="222" y={120 - (kpi.arrHistory[4] / (Math.max(...kpi.arrHistory, 1000) * 1.2) * 120)} width="22" height={(kpi.arrHistory[4] / (Math.max(...kpi.arrHistory, 1000) * 1.2) * 120)} rx="3" fill="#0EA5E9" />

                  {/* Y Axis labels */}
                  <text x="-5" y="93" className="text-[8px] font-bold fill-slate-400">${Math.round(Math.max(...kpi.arrHistory, 1000) * 1.2 * 0.25).toLocaleString()}</text>
                  <text x="-5" y="63" className="text-[8px] font-bold fill-slate-400">${Math.round(Math.max(...kpi.arrHistory, 1000) * 1.2 * 0.5).toLocaleString()}</text>
                  <text x="-5" y="33" className="text-[8px] font-bold fill-slate-400">${Math.round(Math.max(...kpi.arrHistory, 1000) * 1.2 * 0.75).toLocaleString()}</text>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
            {/* Box 1 */}
            <div className="border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-1 bg-white">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">UPGRADES</span>
              <span className="text-2xl font-black text-[#10B981]">{kpi.upgrades}</span>
            </div>

            {/* Box 2 */}
            <div className="border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-1 bg-white">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">DOWNGRADES</span>
              <span className="text-2xl font-black text-amber-500">{kpi.downgrades}</span>
            </div>

            {/* Box 3 */}
            <div className="border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-1 bg-white">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">CHURN RATE</span>
              <span className="text-2xl font-black text-rose-500">{kpi.churnRate}</span>
            </div>

            {/* Box 4 */}
            <div className="border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-1 bg-white">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">SUB GROWTH</span>
              <span className="text-2xl font-black text-amber-500">{kpi.subGrowth}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Search, Filter dropdown row */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-grow w-full sm:max-w-xs text-left">
          <input
            type="text"
            placeholder="Search Company Name"
            value={searchCompany}
            onChange={(e) => setSearchCompany(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 focus:border-brand-500 text-xs rounded-xl focus:outline-none placeholder:text-slate-400 text-slate-800 font-bold"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        </div>

        <div className="relative flex-grow w-full sm:max-w-xs text-left">
          <input
            type="text"
            placeholder="Search Sub ID"
            value={searchSubId}
            onChange={(e) => setSearchSubId(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 focus:border-brand-500 text-xs rounded-xl focus:outline-none placeholder:text-slate-400 text-slate-800 font-bold"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 w-full sm:w-auto">
          <select
            value={selectedPlanFilter}
            onChange={(e) => setSelectedPlanFilter(e.target.value)}
            className="w-full sm:w-auto border border-slate-200 bg-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-brand-500 text-slate-800 font-black cursor-pointer min-w-[120px]"
          >
            <option value="All Plans">All Plans</option>
            <option value="Starter">Starter</option>
            <option value="Professional">Professional</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 w-full sm:w-auto">
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="w-full sm:w-auto border border-slate-200 bg-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-brand-500 text-slate-800 font-black cursor-pointer min-w-[120px]"
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
          <table className="w-full text-left border-collapse text-xs font-bold text-slate-700 min-w-[1000px] whitespace-nowrap">
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
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-slate-400 font-semibold bg-white w-full">
                       <div className="flex justify-center items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Loading subscriptions...</div>
                    </td>
                  </tr>
                ) : filteredSubs.length === 0 ? (
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
                    <td className="py-4 px-4 font-mono font-medium text-slate-400">
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
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${sub.status === 'ACTIVE'
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
                          <button
                            onClick={() => {
                              setSelectedSub(sub);
                              setShowViewModal(true);
                              setActiveActionsMenu(null);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-slate-700 cursor-pointer"
                          >
                            View Subscription
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSub(sub);
                              setShowEditModal(true);
                              setActiveActionsMenu(null);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-slate-700 cursor-pointer"
                          >
                            Edit Subscription
                          </button>

                          {/* Up/Down grades */}
                          <button
                            onClick={() => {
                              setSelectedSub(sub);
                              setShowUpgradeModal(true);
                              setActiveActionsMenu(null);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-emerald-50 rounded-lg text-emerald-600 cursor-pointer"
                          >
                            Upgrade Subscription
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSub(sub);
                              setShowDowngradeModal(true);
                              setActiveActionsMenu(null);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-amber-50 rounded-lg text-yellow-600 cursor-pointer"
                          >
                            Downgrade Subscription
                          </button>

                          {/* Pause / Resume */}
                          <button
                            onClick={() => {
                              setSelectedSub(sub);
                              setShowPauseModal(true);
                              setActiveActionsMenu(null);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-rose-50 rounded-lg text-rose-500 cursor-pointer"
                          >
                            Pause Subscription
                          </button>
                          <button
                            onClick={() => {
                              showNotification(`Resumed subscription ${sub.id} successfully.`);
                              setActiveActionsMenu(null);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-emerald-50 rounded-lg text-emerald-600 cursor-pointer"
                          >
                            Resume Subscription
                          </button>
                          <button
                            onClick={() => {
                              showNotification(`Auto-Renewal cancelled for ${sub.company}.`);
                              setActiveActionsMenu(null);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-rose-50 rounded-lg text-rose-500 cursor-pointer"
                          >
                            Cancel Auto-Renewal
                          </button>

                          {/* Divider */}
                          <div className="border-t border-slate-100 my-1" />

                          <button
                            onClick={() => {
                              showNotification(`Manual renewal processed for ${sub.company} invoice cycle.`);
                              setActiveActionsMenu(null);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-slate-700 cursor-pointer"
                          >
                            Renew Manually
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSub(sub);
                              setShowAssignPlanModal(true);
                              setActiveActionsMenu(null);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-slate-700 cursor-pointer"
                          >
                            Change Subscription
                          </button>
                          <button
                            onClick={() => navigate('/admin/billing')}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-slate-700 cursor-pointer"
                          >
                            Billing History
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSub(sub);
                              setShowGenerateInvoiceModal(true);
                              setActiveActionsMenu(null);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-slate-700 cursor-pointer"
                          >
                            Generate Invoice
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSub(sub);
                              setShowSendReminderModal(true);
                              setActiveActionsMenu(null);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-slate-700 cursor-pointer"
                          >
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

      {/* 1. View Subscription Inspector Drawer (Exact Same to Same as Companies.jsx Right Side Drawer!) */}
      {showViewModal && selectedSub && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity cursor-pointer"
            onClick={() => setShowViewModal(false)}
          ></div>

          {/* Drawer Panel */}
          <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col animate-slide-left z-10 text-left">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-white">
              <h3 className="text-lg font-extrabold text-slate-900">Subscription Workspace Inspector</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 overflow-y-auto custom-scrollbar flex-grow space-y-8 bg-[#F8FAFC]">

              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-[22px] font-black text-slate-900">{selectedSub.company}</h2>
                  <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-wider">Subscription ID: #{selectedSub.id}</p>
                </div>
                <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${selectedSub.status === 'ACTIVE'
                    ? 'text-emerald-600 bg-emerald-50 border border-emerald-200'
                    : 'text-amber-600 bg-amber-50 border border-amber-200'
                  }`}>
                  {selectedSub.status}
                </span>
              </div>

              {/* Tabs */}
              <div className="flex overflow-x-auto custom-scrollbar pb-3 gap-2 border-b border-slate-200/60 items-center">
                {['Overview', 'Plan Details', 'Billing & Cycle', 'Limits & Modules', 'Audit Log'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveViewTab(tab)}
                    className={`shrink-0 px-4 py-1.5 text-[11px] rounded-xl whitespace-nowrap cursor-pointer transition-colors ${activeViewTab === tab
                        ? 'bg-brand-500 text-slate-900 font-black shadow-sm border-2 border-slate-900'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-bold border-2 border-transparent'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeViewTab === 'Overview' && (
                <div className="space-y-4 animate-fade-in">
                  {/* General Information Card */}
                  <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm shadow-slate-200/40">
                    <h4 className="text-[12px] font-extrabold text-slate-800 mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      General Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                      <div>
                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-0.5">Assigned Plan</p>
                        <p className="text-slate-800 font-bold text-[12px]">{selectedSub.plan} Tier</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-0.5">Billing Period</p>
                        <p className="text-slate-800 font-bold text-[12px]">{selectedSub.billingPeriod}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-0.5">Start Date</p>
                        <p className="text-slate-800 font-bold text-[12px] font-mono">{selectedSub.startDate}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-0.5">Auto Renewal</p>
                        <p className="text-slate-800 font-bold text-[12px]">{selectedSub.autoRenewal === 'Yes' ? 'Enabled (Active)' : 'Manual Only'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contract MRR Metrics Card */}
                  <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm shadow-slate-200/40">
                    <h4 className="text-[12px] font-extrabold text-slate-800 mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Contract Financials
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                      <div>
                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-0.5">Monthly MRR</p>
                        <p className="text-emerald-600 font-black text-sm font-mono">${selectedSub.amount.toLocaleString()}/mo</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-0.5">Annual Projection</p>
                        <p className="text-slate-800 font-black text-sm font-mono">${(selectedSub.amount * 12).toLocaleString()}/yr</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-0.5">Next Renewal</p>
                        <p className="text-[#0EA5E9] font-bold text-[12px] font-mono">{selectedSub.nextRenewal}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-0.5">Payment Gateway</p>
                        <p className="text-slate-800 font-bold text-[12px]">Stripe Autopay</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeViewTab === 'Plan Details' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">TIER & CAPABILITIES</span>
                    <h4 className="text-xl font-black text-slate-900">{selectedSub.plan} Tier Suite</h4>
                    <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                      This subscription includes multi-branch dispatch operations, automated AI driver routing, real-time ELD compliance telematics, and white-label client portal integrations.
                    </p>
                    <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                      <span className="text-xs font-bold text-slate-400">Base Plan Price:</span>
                      <span className="text-base font-black text-slate-800 font-mono">${selectedSub.amount}/month</span>
                    </div>
                  </div>
                </div>
              )}

              {activeViewTab === 'Billing & Cycle' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-3">
                    <h4 className="text-[12px] font-extrabold text-slate-800 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]"></span>
                      Renewal & Ledger Details
                    </h4>
                    <div className="space-y-2 text-xs font-bold text-slate-700">
                      <div className="flex justify-between py-1.5 border-b border-slate-50">
                        <span className="text-slate-400">Last Invoice Issued:</span>
                        <span className="font-mono">{selectedSub.startDate}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-50">
                        <span className="text-slate-400">Next Scheduled Charge:</span>
                        <span className="font-mono text-emerald-600">{selectedSub.nextRenewal}</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-400">Auto Renewal Debit:</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${selectedSub.autoRenewal === 'Yes' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                          {selectedSub.autoRenewal === 'Yes' ? 'ENABLED' : 'DISABLED'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeViewTab === 'Limits & Modules' && (
                <div className="space-y-4 animate-fade-in">
                  {selectedSub.limitOverflow ? (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-2">
                      <span className="text-[10px] font-black text-rose-600 uppercase flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" /> LIMIT OVERFLOW DETECTED
                      </span>
                      <p className="text-xs font-bold text-rose-800">
                        Workspace quota exceeded: <span className="underline">{selectedSub.limitOverflow}</span>. Consider upgrading tier to add additional capacity.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs font-bold text-emerald-800 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> All resource limits within normal operating capacity.
                    </div>
                  )}

                  <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-2.5">
                    <h4 className="text-[12px] font-extrabold text-slate-800">Allocated Features</h4>
                    <div className="grid grid-cols-1 gap-2 text-xs font-bold text-slate-700">
                      <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <CheckCircle className="w-4 h-4 text-[#0EA5E9] shrink-0" /> Multi-Branch Dispatch System
                      </div>
                      <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <CheckCircle className="w-4 h-4 text-[#0EA5E9] shrink-0" /> AI Route Dispatch Automation
                      </div>
                      <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <CheckCircle className="w-4 h-4 text-[#0EA5E9] shrink-0" /> Driver ELD Compliance Telematics
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeViewTab === 'Audit Log' && (
                <div className="space-y-3 animate-fade-in">
                  <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-3">
                    <h4 className="text-[12px] font-extrabold text-slate-800">Recent Subscription Actions</h4>
                    <div className="border-l-2 border-slate-200 pl-3 space-y-3 text-xs">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 block">Today, 10:15 AM</span>
                        <p className="font-bold text-slate-800">Subscription verified & status set to {selectedSub.status}.</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 block">{selectedSub.startDate}</span>
                        <p className="font-bold text-slate-800">Contract renewed & invoice generated for {selectedSub.billingPeriod} cycle.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-white flex gap-3">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setShowUpgradeModal(true);
                }}
                className="flex-1 bg-[#FFB020] hover:bg-brand-600 text-black font-extrabold text-xs py-3 rounded-xl transition-all cursor-pointer shadow-sm text-center"
              >
                Upgrade Plan Tier
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  navigate('/admin/billing');
                }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs py-3 rounded-xl transition-all cursor-pointer text-center"
              >
                View Ledger & Invoices
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Edit Subscription Modal */}
      {showEditModal && selectedSub && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-[540px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Edit Subscription Settings for {selectedSub.company}</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="p-6 space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              try {
                setIsLoading(true);
                const nextRenewal = e.target.elements.nextRenewal.value;
                const autoRenewal = e.target.elements.autoRenewal.checked;
                const res = await api.put(`/tenant-subscriptions/${selectedSub.id}`, { nextRenewal, autoRenewal });
                if (res.data?.success) {
                  showNotification(`Subscription settings for ${selectedSub.company} updated successfully.`);
                  setShowEditModal(false);
                  fetchSubscriptions();
                }
              } catch (err) {
                showNotification('Error updating subscription.');
              } finally {
                setIsLoading(false);
              }
            }}>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">NEXT RENEWAL DATE</label>
                <input
                  name="nextRenewal"
                  type="date"
                  defaultValue={selectedSub.nextRenewal}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-brand-500 text-sm font-bold rounded-2xl focus:outline-none text-slate-800"
                />
              </div>
              <div className="flex items-center gap-3 pt-0.5">
                <input
                  name="autoRenewal"
                  type="checkbox"
                  defaultChecked={selectedSub.autoRenewal === 'Yes'}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-xs sm:text-sm font-bold text-slate-600 cursor-pointer">
                  Enable Auto-Renewal recurring billing
                </span>
              </div>
              <button
                type="submit"
                className="w-full bg-[#FFB020] hover:bg-brand-600 text-slate-900 font-extrabold text-sm py-3 rounded-2xl shadow-sm transition-all cursor-pointer mt-1"
              >
                Save Subscription Settings
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Upgrade Subscription Modal */}
      {showUpgradeModal && selectedSub && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-[460px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800">Upgrade Plan for {selectedSub.company}</h3>
              <button onClick={() => setShowUpgradeModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <span className="text-[10px] font-black text-emerald-600 uppercase block">CURRENT → TARGET TIER</span>
                <span className="text-sm font-black text-slate-900 mt-1 block">{selectedSub.plan} Plan ($ {selectedSub.amount}/mo) <span className="text-emerald-600">→ Enterprise ($28,000/mo)</span></span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Pro-rata billing credit will be automatically applied to the next invoice cycle on {selectedSub.nextRenewal}.</p>
              <button
                onClick={() => {
                  showNotification(`Upgraded ${selectedSub.company} to Enterprise Tier.`);
                  setShowUpgradeModal(false);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[13px] py-4 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Confirm Upgrade ($28,000/mo)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Downgrade Subscription Modal */}
      {showDowngradeModal && selectedSub && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-[460px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800">Downgrade Plan for {selectedSub.company}</h3>
              <button onClick={() => setShowDowngradeModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <span className="text-[10px] font-black text-amber-600 uppercase block">DOWNGRADE WARNING</span>
                <p className="text-xs font-bold text-amber-900 mt-1">Downgrading from {selectedSub.plan} Tier may restrict active drivers and warehouse accounts.</p>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">SELECT NEW LOWER TIER</label>
                <select className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-brand-500 text-xs font-semibold rounded-xl focus:outline-none text-slate-800">
                  <option>Starter Tier - $499/mo</option>
                  <option>Basic Plan - $299/mo</option>
                </select>
              </div>
              <button
                onClick={() => {
                  showNotification(`Downgraded ${selectedSub.company} subscription.`);
                  setShowDowngradeModal(false);
                }}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[13px] py-4 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Confirm Plan Downgrade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Pause Subscription Modal */}
      {showPauseModal && selectedSub && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-[450px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800">Pause License ({selectedSub.id})</h3>
              <button onClick={() => setShowPauseModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 font-medium">Pausing this subscription will immediately restrict login access for all administrators and drivers of <span className="font-bold text-slate-900">{selectedSub.company}</span>.</p>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">SUSPENSION REASON</label>
                <select className="w-full px-4 py-3 bg-white border border-slate-200 text-xs font-semibold rounded-xl focus:outline-none text-slate-800">
                  <option>Payment Overdue / Failed Gateways</option>
                  <option>Requested by Client Administrator</option>
                  <option>Trial Period Ended</option>
                  <option>Compliance Investigation</option>
                </select>
              </div>
              <button
                onClick={async () => {
                  try {
                    setIsLoading(true);
                    const res = await api.put(`/tenant-subscriptions/${selectedSub.id}`, { status: 'HOLD' });
                    if (res.data?.success) {
                      showNotification(`Subscription ${selectedSub.id} placed on HOLD status.`);
                      setShowPauseModal(false);
                      fetchSubscriptions();
                    }
                  } catch (err) {
                    showNotification('Error suspending license.');
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[13px] py-4 rounded-xl transition-all cursor-pointer shadow-sm mt-2"
              >
                Confirm License Pause
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Change Subscription Modal */}
      {showAssignPlanModal && selectedSub && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-[540px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Change Subscription for {selectedSub.company}</h3>
              <button onClick={() => setShowAssignPlanModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">SELECT SUBSCRIPTION PLAN TIER</label>
                <select className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-brand-500 text-sm font-bold rounded-2xl focus:outline-none text-slate-800">
                  <option>Enterprise Tier - $1,299/mo</option>
                  <option>Professional Tier - $699/mo</option>
                  <option>Starter Tier - $299/mo</option>
                  <option>Custom White-Label Tier - $4,500/mo</option>
                </select>
              </div>
              <button
                onClick={() => {
                  showNotification(`Subscription plan tier updated successfully for ${selectedSub.company}.`);
                  setShowAssignPlanModal(false);
                }}
                className="w-full bg-[#FFB020] hover:bg-brand-600 text-slate-900 font-extrabold text-sm py-3 rounded-2xl shadow-sm transition-all cursor-pointer mt-1"
              >
                Update Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Generate Invoice Modal */}
      {showGenerateInvoiceModal && selectedSub && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-[540px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 pr-4">Generate Custom Administrative Invoice for {selectedSub.company}</h3>
              <button onClick={() => setShowGenerateInvoiceModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">INVOICE AMOUNT (USD)</label>
                <input
                  type="number"
                  defaultValue={selectedSub.amount}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-brand-500 text-sm font-bold rounded-2xl focus:outline-none text-slate-800 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">BILLING PERIOD / DESCRIPTION</label>
                <input
                  type="text"
                  defaultValue="Custom Administrative Invoice"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-brand-500 text-sm font-bold rounded-2xl focus:outline-none text-slate-800"
                />
              </div>
              <button
                onClick={() => {
                  showNotification(`Generated custom administrative invoice for ${selectedSub.company}.`);
                  setShowGenerateInvoiceModal(false);
                }}
                className="w-full bg-[#FFB020] hover:bg-brand-600 text-slate-900 font-extrabold text-sm py-3 rounded-2xl shadow-sm transition-all cursor-pointer mt-1"
              >
                Generate Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Send Reminder Modal */}
      {showSendReminderModal && selectedSub && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-[480px] overflow-hidden shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-800">Send Renewal Reminder to {selectedSub.company}</h3>
              <button onClick={() => setShowSendReminderModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">EMAIL MESSAGE TEMPLATE</label>
                <textarea
                  defaultValue={`Hello Administrator of ${selectedSub.company},\n\nThis is a friendly reminder that your ${selectedSub.plan} Tier subscription (#${selectedSub.id}) is scheduled for renewal on ${selectedSub.nextRenewal} for the amount of $${selectedSub.amount}.\n\nPlease ensure your payment method is up to date.\n\nBest,\nHero Logistics Billing Team`}
                  className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-brand-500 text-xs font-medium rounded-xl focus:outline-none text-slate-800 h-36 resize-none"
                />
              </div>
              <button
                onClick={() => {
                  showNotification(`Sent renewal notification email to ${selectedSub.company}.`);
                  setShowSendReminderModal(false);
                }}
                className="w-full bg-[#FFB020] hover:bg-brand-600 text-black font-extrabold text-[13px] py-4 rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Reminder Notification
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
