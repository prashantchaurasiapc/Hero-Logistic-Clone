import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCheckCircle, FiClock, FiPlus, FiUpload, FiRefreshCw,
  FiFilter, FiFileText, FiDollarSign, FiChevronRight,
  FiAlertTriangle, FiArrowLeft, FiCamera, FiCheck, FiX,
  FiBookOpen, FiShield, FiHelpCircle, FiBarChart2, FiLayers,
  FiDownload, FiEye, FiSearch, FiCreditCard, FiCalendar,
  FiPieChart, FiTrendingUp, FiCheckSquare, FiSettings
} from 'react-icons/fi';
import { getPayrollSummary, getPayrollHistory, downloadPayslip } from '../../services/driverApi';

export default function MyPay() {
  const navigate = useNavigate();

  // Tab & Search States
  const [activeTab, setActiveTab] = useState('Overview'); // 'Overview', 'Pay History', 'Earnings', 'Deductions', 'Tax'
  const [toastMsg, setToastMsg] = useState('');
  const [tipDismissed, setTipDismissed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  // Summary & Payroll Data
  const [summaryData, setSummaryData] = useState(null);
  const [latestPeriod, setLatestPeriod] = useState(null);
  const [upcomingPayment, setUpcomingPayment] = useState(null);

  // Modals
  const [bankModalOpen, setBankModalOpen] = useState(false);
  const [payslipModalOpen, setPayslipModalOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [taxModalOpen, setTaxModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [breakdownModalOpen, setBreakdownModalOpen] = useState(false);

  // Bank Form State
  const [bankName, setBankName] = useState('Westpac Banking Corporation');
  const [bsbNumber, setBsbNumber] = useState('032-000');
  const [accountNumber, setAccountNumber] = useState('1234 5678');
  const [accountName, setAccountName] = useState('Noah Davis');

  // Pay History Data
  const [payRecords, setPayRecords] = useState([]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const fetchPayrollData = async () => {
    setIsLoading(true);
    try {
      const [sumRes, histRes] = await Promise.all([
        getPayrollSummary().catch(() => null),
        getPayrollHistory().catch(() => null)
      ]);

      if (sumRes?.data?.data) {
        setSummaryData(sumRes.data.data.summary);
        setLatestPeriod(sumRes.data.data.latestPayPeriod);
        setUpcomingPayment(sumRes.data.data.upcomingPayment);
      }

      if (histRes?.data?.data && Array.isArray(histRes.data.data)) {
        setPayRecords(histRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load payroll data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrollData();
  }, []);

  const handleDownloadPayslipClick = async (rec) => {
    if (!rec?.id) return;
    setIsDownloading(true);
    try {
      const res = await downloadPayslip(rec.id);
      if (res.data instanceof Blob) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Payslip_${rec.id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        triggerToast(`Payslip downloaded for period!`);
      } else if (res.data?.data?.pdfUrl) {
        window.open(res.data.data.pdfUrl, '_blank');
        triggerToast(`Opening payslip PDF...`);
      } else {
        triggerToast('Payslip document is not available for this period.');
      }
    } catch (err) {
      triggerToast('Payslip not available or download failed.');
    } finally {
      setIsDownloading(false);
      setPayslipModalOpen(false);
    }
  };

  const handleBankSubmit = (e) => {
    e.preventDefault();
    setBankModalOpen(false);
    triggerToast(`Bank details updated: ${bankName} (${bsbNumber} • ${accountNumber})!`);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  const formatMoney = (amount) => {
    if (typeof amount !== 'number') return '$0.00';
    return `$${amount.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };


  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans p-4 sm:p-6 lg:p-8 space-y-6 pb-24 text-left">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[150] bg-slate-900 text-white font-extrabold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-bounce border border-slate-700">
          <FiCheckCircle className="text-[#ffcc00] text-base shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP HEADER TITLE BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Payroll & Pay History</h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">View your earnings, pay breakdown, deductions and download payslips</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setTaxModalOpen(true)}
            className="flex-1 sm:flex-initial bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FiFileText className="text-indigo-600 text-base" />
            <span>Tax Statements</span>
          </button>
          <button
            onClick={() => setBankModalOpen(true)}
            className="flex-1 sm:flex-initial bg-[#ffcc00] hover:bg-[#e6b800] text-black font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FiCreditCard className="text-base" />
            <span>Bank Details</span>
          </button>
        </div>
      </div>

      {/* THREE-COLUMN MASTER WEB DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ================= LEFT COLUMN: MODULE META & INSTRUCTIONS (3 COLS) ================= */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Module Header Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-black text-indigo-700 tracking-tight">Payroll</span>
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                Active Period
              </span>
            </div>
            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              View your earnings, pay breakdown, deductions and download payslips.
            </p>
          </div>

          {/* LEGEND CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LEGEND</div>
            <div className="space-y-2 font-bold">
              <div className="flex items-center gap-2.5 text-emerald-700">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span>Paid</span>
              </div>
              <div className="flex items-center gap-2.5 text-amber-700">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span>Pending</span>
              </div>
              <div className="flex items-center gap-2.5 text-blue-700">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span>Processing</span>
              </div>
              <div className="flex items-center gap-2.5 text-rose-700">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span>Cancelled</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                <span>Draft</span>
              </div>
            </div>
          </div>

          {/* PAY SUMMARY (YTD) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs text-center">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">PAY SUMMARY (YTD)</div>
            <div className="text-[11px] text-slate-400 font-bold text-left">Financial Year 2024/25</div>

            <div className="relative w-32 h-32 mx-auto flex items-center justify-center my-2">
              <div className="w-full h-full rounded-full border-8 border-slate-100 border-t-purple-600 border-r-indigo-600 border-b-purple-600 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-base font-black text-slate-900 font-mono">
                    {formatMoney(summaryData?.ytdGrossEarnings || 0)}
                  </div>
                  <div className="text-[9.5px] font-bold text-slate-500">Total Earnings</div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs font-bold border-t border-slate-100 pt-3">
              <div className="flex justify-between text-emerald-700">
                <span>Net Pay Received</span>
                <span className="font-mono text-slate-900">{formatMoney(summaryData?.ytdNetPay || 0)}</span>
              </div>
              <div className="flex justify-between text-amber-700">
                <span>Pending Payments</span>
                <span className="font-mono text-slate-900">{formatMoney(summaryData?.pendingPayments || 0)}</span>
              </div>
              <div className="flex justify-between text-rose-700">
                <span>Total Deductions</span>
                <span className="font-mono text-slate-900">{formatMoney(summaryData?.ytdDeductions || 0)}</span>
              </div>
            </div>
          </div>

          {/* KEY ACTIONS PANEL */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KEY ACTIONS</div>
            <div className="space-y-2">
              <button onClick={() => setActiveTab('Pay History')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📊 View Pay History</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => { if (payRecords.length > 0) handleDownloadPayslipClick(payRecords[0]); else triggerToast('No pay records found.'); }} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📥 Download Latest Payslip</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => setTaxModalOpen(true)} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📄 Tax Statements</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => setBankModalOpen(true)} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">🏦 Update Bank Details</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => setSettingsModalOpen(true)} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">⚙️ Payment Settings</span>
                <FiChevronRight className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* STATUS CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">STATUS</div>
            <div className="space-y-1.5 font-bold text-slate-700">
              <div className="flex items-center gap-2 text-emerald-700 font-black">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Online</span>
              </div>
              <div className="text-[11px] text-slate-500">Live Backend Connected</div>
              <div className="text-[11px] text-slate-500">Driver identity resolved from JWT</div>
            </div>
            <button
              onClick={() => { fetchPayrollData(); triggerToast('Payroll data refreshed!'); }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl border border-slate-800 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <FiRefreshCw className="text-amber-400" />
              <span>Sync Now</span>
            </button>
          </div>

        </div>

        {/* ================= MIDDLE COLUMN: MAIN PAYROLL ENGINE (6 COLS) ================= */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* LOAD METADATA BANNER CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <div className="text-2xl font-black text-indigo-700 tracking-tight">
                  {summaryData?.driverName ? `Payroll — ${summaryData.driverName}` : 'Driver Payroll'}
                </div>
                <div className="text-xs font-bold text-slate-500 mt-0.5">
                  {latestPeriod ? `Active Period: ${formatDate(latestPeriod.periodStart)} – ${formatDate(latestPeriod.periodEnd)}` : 'No active pay periods'}
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 p-3 rounded-2xl w-full sm:w-auto justify-between sm:justify-start">
                <div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Status</span>
                  <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black px-2 py-0.5 rounded-full block text-center">
                    {latestPeriod?.status || 'ACTIVE'}
                  </span>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Frequency</span>
                  <span className="font-mono text-indigo-700">{latestPeriod?.frequency || 'FORTNIGHTLY'}</span>
                </div>
              </div>
            </div>

            {/* SUB NAV TABS */}
            <div className="flex border-b border-slate-200 space-x-6 text-xs font-black pt-2">
              {['Overview', 'Pay History', 'Earnings', 'Deductions', 'Tax'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 transition-colors cursor-pointer border-b-2 ${
                    activeTab === tab 
                      ? 'border-indigo-600 text-indigo-600' 
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* TAB 1: OVERVIEW VIEW */}
          {activeTab === 'Overview' && (
            <>
              {/* 4 STAT SUMMARY TILES */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                  <div className="flex items-center gap-1.5 text-purple-700 font-black text-xs mb-1">
                    <span>👛 Net Pay (Latest)</span>
                  </div>
                  <div className="text-xl font-black text-slate-900 font-mono">
                    {formatMoney(latestPeriod?.netPay || 0)}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-black text-xs mb-1">
                    <span>🟢 Gross Earnings</span>
                  </div>
                  <div className="text-xl font-black text-emerald-700 font-mono">
                    {formatMoney(latestPeriod?.grossEarnings || 0)}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                  <div className="flex items-center gap-1.5 text-amber-700 font-black text-xs mb-1">
                    <span>🟠 Total Deductions</span>
                  </div>
                  <div className="text-xl font-black text-slate-900 font-mono">
                    {formatMoney(latestPeriod?.totalDeductions || 0)}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                  <div className="flex items-center gap-1.5 text-blue-700 font-black text-xs mb-1">
                    <span>🏦 Pay Frequency</span>
                  </div>
                  <div className="text-xl font-black text-slate-900">
                    {latestPeriod?.frequency || 'Fortnightly'}
                  </div>
                </div>
              </div>

              {/* NEXT PAY BANNER */}
              {upcomingPayment && (
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl shrink-0 font-bold">
                      📅
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-600">
                        Next payment scheduled for <span className="font-black text-slate-900">{formatDate(upcomingPayment.payDate || upcomingPayment.periodEnd)}</span>
                        <span className="ml-2 bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-200">
                          {upcomingPayment.status}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 font-bold mt-0.5">
                        Period: {formatDate(upcomingPayment.periodStart)} – {formatDate(upcomingPayment.periodEnd)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right w-full sm:w-auto">
                    <div className="text-xs font-semibold text-slate-400">Estimated Net Pay</div>
                    <div className="text-xl font-black text-indigo-700 font-mono">{formatMoney(upcomingPayment.netPay)}</div>
                    <span className="bg-blue-100 text-blue-800 text-[9.5px] font-black px-2 py-0.2 rounded-full border border-blue-200 inline-block mt-0.5">
                      Status: {upcomingPayment.status}
                    </span>
                  </div>
                </div>
              )}

              {/* PAY HISTORY LIST */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-slate-900 tracking-tight">PAY HISTORY</h3>
                  <button onClick={() => setActiveTab('Pay History')} className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 cursor-pointer">
                    View All ({payRecords.length})
                  </button>
                </div>

                {isLoading ? (
                  <div className="p-8 text-center text-xs font-bold text-slate-400">Loading payroll history...</div>
                ) : payRecords.length === 0 ? (
                  <div className="p-8 text-center text-xs font-bold text-slate-400">No pay period history found.</div>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                    {payRecords.map((rec) => (
                      <div key={rec.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`w-3 h-3 rounded-full shrink-0 ${
                            rec.status === 'PAID' || rec.status === 'Paid' ? 'bg-emerald-500' : rec.status === 'PROCESSING' || rec.status === 'Processing' ? 'bg-blue-500' : rec.status === 'PENDING' || rec.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'
                          }`}></span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-xs text-slate-900">
                                {formatDate(rec.periodStart)} – {formatDate(rec.periodEnd)}
                              </span>
                              <span className={`text-[9.5px] font-black px-2 py-0.2 rounded-full border ${
                                rec.status === 'PAID' || rec.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : rec.status === 'PROCESSING' || rec.status === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                                {rec.status}
                              </span>
                            </div>
                            <div className="text-[10.5px] text-slate-400 font-mono font-bold mt-0.5">
                              {rec.payDate ? `Pay Date: ${formatDate(rec.payDate)}` : 'Period Ended'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-mono font-black text-sm text-slate-900">{formatMoney(rec.netPay)}</span>
                          <button
                            onClick={() => handleDownloadPayslipClick(rec)}
                            disabled={isDownloading}
                            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl cursor-pointer disabled:opacity-50"
                            title="Download Payslip"
                          >
                            <FiDownload className="text-base" />
                          </button>
                          <button
                            onClick={() => { setSelectedPayslip(rec); setPayslipModalOpen(true); }}
                            className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                          >
                            <FiChevronRight className="text-base" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>


                {/* TOTAL SUMMARY PILL BAR */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-xs font-bold text-center">
                  <div>
                    <span className="text-[9.5px] text-slate-400 uppercase font-extrabold block">Total Gross Earnings</span>
                    <span className="font-mono text-slate-900 text-sm font-black">{formatMoney(summaryData?.ytdGrossEarnings || 0)}</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-slate-400 uppercase font-extrabold block">Total Deductions</span>
                    <span className="font-mono text-slate-900 text-sm font-black">{formatMoney(summaryData?.ytdDeductions || 0)}</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-slate-400 uppercase font-extrabold block">Total Net Paid</span>
                    <span className="font-mono text-emerald-700 text-sm font-black">{formatMoney(summaryData?.ytdNetPay || 0)}</span>
                  </div>
                </div>

              {/* CURRENT PAY BREAKDOWN (26 MAY – 08 JUN 2025) */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-base font-black text-slate-900 tracking-tight">CURRENT PAY BREAKDOWN (26 MAY – 08 JUN 2025)</h3>
                  <button onClick={() => setBreakdownModalOpen(true)} className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 cursor-pointer">
                    View Details
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                  {/* EARNINGS */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">EARNINGS</div>
                    <div className="space-y-1.5 font-bold text-slate-700 border-t border-slate-100 pt-2">
                      <div className="flex justify-between"><span>Base Pay (Salaried)</span><span className="font-mono text-slate-900">$2,400.00</span></div>
                      <div className="flex justify-between"><span>Load Allowance</span><span className="font-mono text-slate-900">$600.00</span></div>
                      <div className="flex justify-between"><span>Distance Allowance</span><span className="font-mono text-slate-900">$300.00</span></div>
                      <div className="flex justify-between"><span>Other Allowances</span><span className="font-mono text-slate-900">$200.00</span></div>
                    </div>
                    <div className="flex justify-between font-black text-sm border-t border-slate-200 pt-2 text-emerald-700">
                      <span>Total Earnings</span>
                      <span className="font-mono">$3,500.00</span>
                    </div>
                  </div>

                  {/* DEDUCTIONS */}
                  <div className="space-y-2">
                    <div className="text-[10px] font-black text-rose-700 uppercase tracking-widest">DEDUCTIONS</div>
                    <div className="space-y-1.5 font-bold text-slate-700 border-t border-slate-100 pt-2">
                      <div className="flex justify-between"><span>PAYG Tax</span><span className="font-mono text-slate-900">$525.00</span></div>
                      <div className="flex justify-between"><span>Superannuation (11%)</span><span className="font-mono text-slate-900">$385.00</span></div>
                      <div className="flex justify-between"><span>Union Fees</span><span className="font-mono text-slate-900">$25.00</span></div>
                      <div className="flex justify-between"><span>Other Deductions</span><span className="font-mono text-slate-900">$100.00</span></div>
                    </div>
                    <div className="flex justify-between font-black text-sm border-t border-slate-200 pt-2 text-rose-700">
                      <span>Total Deductions</span>
                      <span className="font-mono">$1,035.00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* PAYMENT METHOD CARD */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PAYMENT METHOD</div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-lg font-bold">
                      🏦
                    </div>
                    <div>
                      <div className="font-black text-slate-900 text-xs">Bank Transfer</div>
                      <div className="text-[11px] text-slate-600 font-semibold">{bankName}</div>
                      <div className="text-[10.5px] font-mono text-slate-400 font-bold">BSB: {bsbNumber} • Acc: {accountNumber}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => setBankModalOpen(true)}
                    className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-extrabold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-2xs"
                  >
                    Update Bank Details
                  </button>
                </div>
              </div>

              {/* TIP BANNER */}
              {!tipDismissed && (
                <div className="bg-purple-50 border border-purple-200 rounded-3xl p-4 flex items-center justify-between gap-3 text-purple-950 text-xs font-bold shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="p-1.5 bg-purple-100 text-purple-700 rounded-xl">💡</span>
                    <div>
                      <span className="font-black text-purple-900">TIP: </span>
                      <span className="text-purple-700 font-medium text-[11px]">
                        Keep your bank details and tax information up to date to avoid payment delays.
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setTipDismissed(true)} className="text-purple-400 hover:text-purple-700 cursor-pointer p-1">
                    <FiX className="text-base" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* TAB 2: PAY HISTORY VIEW */}
          {activeTab === 'Pay History' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900">Complete Pay History & Payslips Archive</h3>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {payRecords.map((rec) => (
                  <div key={rec.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="font-black text-slate-900 text-xs">{rec.period}</div>
                      <div className="text-[10.5px] text-slate-400 font-mono font-bold mt-0.5">{rec.payDate}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-sm text-slate-900">{rec.netPay}</span>
                      <button onClick={() => { setSelectedPayslip(rec); setPayslipModalOpen(true); }} className="bg-indigo-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl cursor-pointer">
                        Payslip PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: EARNINGS VIEW */}
          {activeTab === 'Earnings' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900">YTD Earnings Breakdown ($28,345.50 Total)</h3>
              <div className="space-y-3 text-xs font-semibold">
                {[
                  { label: 'Base Pay (Salaried)', amount: '$21,600.00', pct: '76%' },
                  { label: 'Load Allowances', amount: '$3,900.00', pct: '14%' },
                  { label: 'Distance Allowances', amount: '$2,400.00', pct: '8%' },
                  { label: 'Other Allowances', amount: '$390.00', pct: '1.5%' },
                  { label: 'Bonuses & Incentives', amount: '$55.50', pct: '0.5%' },
                ].map(item => (
                  <div key={item.label} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
                    <span className="font-black text-slate-900">{item.label}</span>
                    <span className="font-mono font-black text-indigo-700">{item.amount} ({item.pct})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: DEDUCTIONS VIEW */}
          {activeTab === 'Deductions' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900">Deductions & Superannuation Details</h3>
              <div className="space-y-3 text-xs font-semibold">
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex justify-between items-center text-rose-900">
                  <span>PAYG Income Tax</span>
                  <span className="font-mono font-black">$525.00 / fortnight</span>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex justify-between items-center text-blue-900">
                  <span>Superannuation Guarantee (11%)</span>
                  <span className="font-mono font-black">$385.00 / fortnight</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TAX VIEW */}
          {activeTab === 'Tax' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900">Single Touch Payroll (STP) & Tax Statements</h3>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
                <div className="font-black text-slate-900">Tax Year 2024/25 Statement Available</div>
                <div className="text-slate-600 font-medium">Reported to Australian Taxation Office (ATO) via STP.</div>
                <button onClick={() => setTaxModalOpen(true)} className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-xl cursor-pointer">
                  Download PAYG Tax Statement PDF
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ================= RIGHT COLUMN: SIDEBAR PANELS (3 COLS) ================= */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* PAY SUMMARY (THIS PERIOD) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PAY SUMMARY (THIS PERIOD)</div>
            <div className="text-[11px] text-slate-400 font-bold mb-2">26 May – 08 Jun 2025</div>
            
            <div className="space-y-2 font-mono font-bold text-slate-700 border-b border-slate-100 pb-3">
              <div className="flex justify-between items-center">
                <span className="font-sans text-slate-600">Gross Earnings</span>
                <span className="text-emerald-700 font-black">$3,500.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-sans text-slate-600">Total Deductions</span>
                <span className="text-rose-700 font-black">-$1,094.75</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-1 font-black text-sm">
              <span className="text-slate-900">Estimated Net Pay</span>
              <span className="text-indigo-700 font-mono text-base">$2,405.25</span>
            </div>
            <span className="bg-blue-100 text-blue-800 text-[9.5px] font-black px-2 py-0.5 rounded-full border border-blue-200 block text-center">
              Processing 🔵
            </span>

            <button 
              onClick={() => setBreakdownModalOpen(true)}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold py-2 rounded-xl border border-slate-200 transition-all cursor-pointer text-center mt-2"
            >
              View Pay Breakdown
            </button>
          </div>

          {/* EARNINGS BREAKDOWN (YTD) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">EARNINGS BREAKDOWN (YTD)</div>
            
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center my-1">
              <div className="w-full h-full rounded-full border-8 border-slate-100 border-t-amber-500 border-r-emerald-500 border-b-indigo-600 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xs font-black text-slate-900 font-mono">$28,345.50</div>
                  <div className="text-[9px] font-bold text-slate-500">Total</div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 font-bold text-[11px] text-slate-700 border-t border-slate-100 pt-2">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-amber-700">● Base Pay</span>
                <span className="font-mono text-slate-900">$21,600.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-emerald-700">● Load Allowances</span>
                <span className="font-mono text-slate-900">$3,900.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-blue-700">● Distance Allowances</span>
                <span className="font-mono text-slate-900">$2,400.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-purple-700">● Other Allowances</span>
                <span className="font-mono text-slate-900">$390.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-slate-500">● Bonuses</span>
                <span className="font-mono text-slate-900">$55.50</span>
              </div>
            </div>
          </div>

          {/* PAYSLIP EXPORTS & ATO COMPLIANCE PANEL */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">EXPORTS & TAX COMPLIANCE</div>
            <div className="space-y-2">
              <button 
                onClick={() => { setSelectedPayslip(payRecords[0]); setPayslipModalOpen(true); }} 
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-indigo-700 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200"
              >
                <span className="flex items-center gap-2">📥 Latest Payslip (PDF)</span>
                <FiChevronRight className="text-slate-400" />
              </button>

              <button 
                onClick={() => setTaxModalOpen(true)} 
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200"
              >
                <span className="flex items-center gap-2">📑 ATO Income Statement</span>
                <FiChevronRight className="text-slate-400" />
              </button>

              <button 
                onClick={() => setSettingsModalOpen(true)} 
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200"
              >
                <span className="flex items-center gap-2">⚙️ Super & Tax Preferences</span>
                <FiChevronRight className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* HELP & RESOURCES */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HELP & RESOURCES</div>
            <div className="space-y-2 font-semibold text-slate-700">
              <button onClick={() => triggerToast('Opening Payroll Guide...')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">📖 How Payroll Works</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => triggerToast('Opening Payslip Guide...')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">📋 Payslip Guide</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => triggerToast('Opening Tax Info...')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">📑 Tax Information</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => triggerToast('Opening Payment Cycles Info...')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">🔄 Payment Cycles</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => triggerToast('Connecting to Payroll Support...')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">📞 Contact Payroll Support</span>
                <FiChevronRight className="text-slate-400" />
              </button>
            </div>
          </div>

        </div>

      </div>


      {/* UPDATE BANK DETAILS MODAL */}
      {bankModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <form onSubmit={handleBankSubmit} className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiCreditCard className="text-indigo-600 text-lg" />
                Update Bank Details
              </h3>
              <button type="button" onClick={() => setBankModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Account Holder Name</label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Bank Name</label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">BSB Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 032-000"
                    value={bsbNumber}
                    onChange={(e) => setBsbNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-bold block mb-1">Account Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1234 5678"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#ffcc00] hover:bg-[#e6b800] text-black font-black text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md mt-2"
            >
              Save Bank Account
            </button>
          </form>
        </div>
      )}

      {/* VIEW PAYSLIP MODAL */}
      {payslipModalOpen && selectedPayslip && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiFileText className="text-indigo-600 text-lg" />
                Payslip Preview
              </h3>
              <button onClick={() => setPayslipModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-black text-slate-900">{selectedPayslip.period}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${selectedPayslip.statusColor}`}>
                  {selectedPayslip.status}
                </span>
              </div>
              <div className="text-slate-500 font-bold">{selectedPayslip.payDate}</div>
              <div className="text-indigo-700 font-mono text-xl font-black">{selectedPayslip.netPay}</div>
            </div>

            <div className="border border-slate-200 bg-slate-100 rounded-2xl h-44 flex items-center justify-center text-slate-400 text-xs font-mono">
              [ OFFICIAL PAYSLIP PDF DOCUMENT PREVIEW ]
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleDownloadPayslipClick(selectedPayslip)}
                disabled={isDownloading}
                className="flex-1 bg-indigo-600 text-white font-black text-xs py-3 rounded-xl cursor-pointer disabled:opacity-50"
              >
                {isDownloading ? 'Downloading...' : 'Download PDF'}
              </button>
              <button
                onClick={() => setPayslipModalOpen(false)}
                className="flex-1 bg-slate-200 text-slate-800 font-black text-xs py-3 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAX STATEMENTS MODAL */}
      {taxModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                📄 Annual PAYG Tax Statements
              </h3>
              <button onClick={() => setTaxModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-2 text-xs font-semibold">
              {[
                { year: 'Financial Year 2024/25 (YTD)', gross: '$28,345.50', tax: '$3,675.00' },
                { year: 'Financial Year 2023/24', gross: '$68,400.00', tax: '$9,210.00' },
                { year: 'Financial Year 2022/23', gross: '$64,150.00', tax: '$8,640.00' }
              ].map(t => (
                <div key={t.year} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
                  <div>
                    <div className="font-black text-slate-900">{t.year}</div>
                    <div className="text-[10px] text-slate-500">Gross: {t.gross} • Tax Withheld: {t.tax}</div>
                  </div>
                  <button onClick={() => triggerToast(`Downloaded ${t.year} Tax Summary!`)} className="bg-indigo-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl cursor-pointer">
                    PDF
                  </button>
                </div>
              ))}
            </div>

            <button onClick={() => setTaxModalOpen(false)} className="w-full bg-slate-900 text-white font-black text-xs py-3 rounded-xl cursor-pointer">
              Close
            </button>
          </div>
        </div>
      )}

      {/* PAYMENT SETTINGS MODAL */}
      {settingsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiSettings className="text-indigo-600 text-lg" />
                Payment Preferences & Settings
              </h3>
              <button onClick={() => setSettingsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span>Email Payslips Automatically</span>
                <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span>SMS Payment Alerts</span>
                <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
              </div>
            </div>

            <button onClick={() => { setSettingsModalOpen(false); triggerToast('Payment settings saved!'); }} className="w-full bg-indigo-600 text-white font-black text-xs py-3 rounded-xl cursor-pointer">
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* PAY BREAKDOWN DETAILS MODAL */}
      {breakdownModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiBarChart2 className="text-indigo-600 text-lg" />
                Detailed Pay Breakdown (26 May – 08 Jun 2025)
              </h3>
              <button onClick={() => setBreakdownModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 space-y-1">
                <div className="font-black text-sm">Gross Earnings: $3,500.00</div>
                <div className="text-[11px] text-emerald-700">Includes $2,400 base salary + $600 load allowance + $300 distance allowance + $200 extras.</div>
              </div>

              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 space-y-1">
                <div className="font-black text-sm">Deductions & Taxes: -$1,094.75</div>
                <div className="text-[11px] text-rose-700">Includes $525 PAYG tax withholding, $385 superannuation, $25 union fees, $100 other.</div>
              </div>

              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-indigo-900 space-y-1">
                <div className="font-black text-sm">Net Payable: $2,405.25</div>
                <div className="text-[11px] text-indigo-700">Scheduled for direct deposit into Westpac Acc ending 5678 on 13 Jun 2025.</div>
              </div>
            </div>

            <button onClick={() => setBreakdownModalOpen(false)} className="w-full bg-slate-900 text-white font-black text-xs py-3 rounded-xl cursor-pointer">
              Close Breakdown
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
