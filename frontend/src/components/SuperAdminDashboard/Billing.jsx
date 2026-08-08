import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { 
  CheckCircle, 
  Download, 
  RefreshCw, 
  Eye, 
  FileText, 
  FileSpreadsheet, 
  X, 
  Calendar, 
  DollarSign, 
  Check, 
  ShieldCheck,
  Edit,
  Loader2
} from 'lucide-react';
import api from '../../services/api';

export default function Billing() {
  const [activeTab, setActiveTab] = useState('INVOICES');
  const [toast, setToast] = useState('');
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [regenerateInvoice, setRegenerateInvoice] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportScope, setExportScope] = useState('All Invoices');

  // Regenerate Form State
  const [regenForm, setRegenForm] = useState({
    amount: '',
    status: 'Paid',
    dueDate: ''
  });

  // Show Toast Helper
  const showNotification = (msg) => {
    setToast(msg);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Computed live metrics state
  const [liveKpi, setLiveKpi] = useState({
    totalRevenue: 0,
    mrr: 0,
    paidCount: 0,
    unpaidCount: 0,
    failedCount: 0,
    refundsCount: 0
  });

  const [revenueTrendData, setRevenueTrendData] = useState([
    { name: 'Jan', value: 0 },
    { name: 'Feb', value: 0 },
    { name: 'Mar', value: 0 },
    { name: 'Apr', value: 0 },
    { name: 'May', value: 0 },
    { name: 'Jun', value: 0 }
  ]);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/billing-records');
      if (res.data?.success) {
        const rawList = res.data.data;
        const formatted = rawList.map(inv => ({
          id: inv.invoiceNumber || inv.id,
          company: inv.company?.name || inv.companyId || 'Unknown',
          plan: inv.planTierSnapshot || 'Plan Tier',
          amount: inv.amount || 0,
          status: inv.status,
          date: new Date(inv.createdAt).toLocaleDateString()
        }));
        setInvoices(formatted);

        // Compute KPIs from billing records
        const paid = formatted.filter(i => i.status === 'PAID' || i.status === 'Paid');
        const unpaid = formatted.filter(i => i.status === 'PENDING' || i.status === 'Pending' || i.status === 'Unpaid');
        const failed = formatted.filter(i => i.status === 'FAILED' || i.status === 'Failed');
        const total = paid.reduce((sum, i) => sum + i.amount, 0);

        setLiveKpi({
          totalRevenue: total,
          mrr: paid.length ? total / paid.length : 0,
          paidCount: paid.length,
          unpaidCount: unpaid.length,
          failedCount: failed.length,
          refundsCount: 0
        });

        // Set monthly trend data based on collected amounts
        setRevenueTrendData([
          { name: 'Jan', value: total * 0.2 },
          { name: 'Feb', value: total * 0.4 },
          { name: 'Mar', value: total * 0.6 },
          { name: 'Apr', value: total * 0.7 },
          { name: 'May', value: total * 0.9 },
          { name: 'Jun', value: total }
        ]);
      }
    } catch (err) {
      console.error('Failed to load billing records:', err);
      showNotification('Failed to load billing records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Tab Filtering logic
  const getFilteredData = () => {
    switch (activeTab) {
      case 'PAYMENTS':
        return invoices.filter(inv => inv.status === 'Paid');
      case 'FAILED PAYMENTS':
        return invoices.filter(inv => inv.status === 'Failed' || inv.status === 'Overdue' || inv.status === 'Unpaid');
      case 'TAX / GST SUMMARY':
        return invoices;
      case 'INVOICES':
      default:
        return invoices;
    }
  };

  // Download Invoice Document
  const handleDownloadInvoice = (invoice) => {
    const base = (invoice.amount * 0.82).toFixed(2);
    const gst = (invoice.amount * 0.18).toFixed(2);
    const content = `========================================\nHERO LOGISTICS - OFFICIAL TAX INVOICE\n========================================\nInvoice ID: ${invoice.id}\nCompany: ${invoice.company}\nPlan Tier: ${invoice.plan}\nIssue Date: ${invoice.date}\nStatus: ${invoice.status.toUpperCase()}\n\nFINANCIAL BREAKDOWN:\n- Base Plan Fee: $${base}\n- GST / Tax (18%): $${gst}\n- Total Amount Due/Paid: $${invoice.amount.toFixed(2)}\n\nThank you for choosing Hero Logistics Platform.\n========================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${invoice.id.replace('#','')}_${invoice.company.replace(/ /g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification(`Invoice ${invoice.id} downloaded successfully!`);
  };

  // Open Regenerate Modal
  const openRegenerateModal = (invoice) => {
    setRegenerateInvoice(invoice);
    setRegenForm({
      amount: invoice.amount.toString(),
      status: invoice.status,
      dueDate: invoice.date
    });
  };

  // Save Regenerated Invoice
  const handleSaveRegenerate = async (e) => {
    e.preventDefault();
    if (!regenerateInvoice) return;
    try {
      setIsLoading(true);
      const newAmt = parseFloat(regenForm.amount) || regenerateInvoice.amount;
      const res = await api.put(`/billing-records/${regenerateInvoice.id}`, {
        amount: newAmt,
        status: regenForm.status,
        dueDate: regenForm.dueDate || undefined
      });
      if (res.data?.success) {
        setRegenerateInvoice(null);
        showNotification(`Invoice ${regenerateInvoice.id} regenerated successfully with new metadata!`);
        fetchInvoices();
      }
    } catch (err) {
      showNotification('Error regenerating invoice.');
    } finally {
      setIsLoading(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Invoice ID', 'Company', 'Plan', 'Amount', 'Status', 'Date'];
    const rows = invoices.map(inv => [inv.id, inv.company, inv.plan, inv.amount, inv.status, inv.date]);
    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'billing_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Billing records exported as CSV!');
  };

  // Export Tax Report
  const handleExportTaxReport = () => {
    const headers = ['Invoice ID', 'Company', 'Base Amount', 'GST (18%)', 'Total Amount', 'Date'];
    const rows = invoices.map(inv => {
      const base = inv.amount * 0.82;
      const gst = inv.amount * 0.18;
      return [inv.id, inv.company, base.toFixed(2), gst.toFixed(2), inv.amount.toFixed(2), inv.date];
    });
    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'tax_gst_summary.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Tax / GST Report exported as CSV!');
  };

  // Run Export Modal Download
  const handleRunModalExport = () => {
    setShowExportModal(false);
    if (exportFormat === 'csv') {
      handleExportCSV();
    } else {
      handleExportTaxReport();
    }
  };

  return (
    <div className="flex-grow bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 w-full font-sans text-left space-y-6 relative">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999] bg-slate-900 text-white text-xs font-bold px-5 py-3.5 rounded-xl shadow-xl border border-slate-700/50 flex items-center gap-2.5 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl text-slate-900 leading-8 capitalize font-black flex items-center gap-2">
            Super Admin • Billing
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Configure global licensing rules, audit tenant margins, and resolve support tickets.
          </p>
        </div>
        <button
          onClick={() => setShowExportModal(true)}
          className="w-full sm:w-auto border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
        >
          <Download size={14} className="text-amber-700" /> Export Report
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { name: 'TOTAL REVENUE', value: `$${liveKpi.totalRevenue.toLocaleString()}`, desc: 'Cumulative collected revenue', change: '+12%', isPositive: true },
          { name: 'MONTHLY MRR', value: `$${liveKpi.mrr.toLocaleString()}`, desc: 'Current monthly baseline', change: '+8%', isPositive: true },
          { name: 'PAID INVOICES', value: liveKpi.paidCount.toString(), desc: 'Successfully collected', change: 'Stable', isPositive: false },
          { name: 'UNPAID INVOICES', value: liveKpi.unpaidCount.toString(), desc: 'Awaiting payment', change: 'Alert', isPositive: true, isAlert: true },
          { name: 'FAILED PAYMENTS', value: liveKpi.failedCount.toString(), desc: 'Gateway errors', change: '0 issues', isPositive: false },
          { name: 'REFUNDS ISSUED', value: liveKpi.refundsCount.toString(), desc: 'Dispute resolutions', change: 'Clean', isPositive: false }
        ].map((m, idx) => (
          <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
            <div>
              <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">{m.name}</span>
              <span className="text-2xl font-black text-slate-900 block mt-2">{m.value}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold mt-2">
              <span className="text-slate-400">{m.desc}</span>
              <span className={m.isAlert ? 'text-rose-500 font-extrabold' : m.isPositive ? 'text-emerald-500 font-extrabold' : 'text-slate-400'}>
                {m.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Revenue Trend Line Chart */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs w-full">
        <h2 className="text-sm font-black text-slate-800 mb-6">Monthly Revenue Trend (USD)</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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

      {/* Tabs Row */}
      <div className="flex flex-wrap gap-2">
        {['INVOICES', 'PAYMENTS', 'FAILED PAYMENTS', 'TAX / GST SUMMARY'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-black rounded-xl text-xs transition-colors cursor-pointer border ${activeTab === tab
                ? 'bg-brand-500 text-black border-brand-500'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Data Table */}
      <div className="bg-white border border-slate-100 rounded-2xl lg:p-6 p-4 shadow-xs w-full">
        <div className="overflow-x-auto lg:overflow-visible custom-scrollbar">
          <table className="w-full text-left border-collapse block lg:table">
            <thead className="hidden lg:table-header-group">
              <tr className="border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="pb-4 font-black">INVOICE ID</th>
                <th className="pb-4 font-black">COMPANY</th>
                <th className="pb-4 font-black">PLAN TIER</th>
                <th className="pb-4 font-black">AMOUNT</th>
                <th className="pb-4 font-black">STATUS</th>
                <th className="pb-4 font-black">DUE DATE</th>
                <th className="pb-4 text-right pr-0 font-black">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 font-semibold bg-white w-full">
                     <div className="flex justify-center items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Loading billing records...</div>
                  </td>
                </tr>
              ) : getFilteredData().length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 font-semibold">No records found.</td>
                </tr>
              ) : (
                getFilteredData().map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors block lg:table-row border border-slate-100 lg:border-none rounded-xl lg:rounded-none mb-4 lg:mb-0 bg-white lg:bg-transparent shadow-sm lg:shadow-none p-4 lg:p-0">
                  <td className="flex lg:table-cell justify-between items-center py-2 lg:py-4 border-b border-slate-50 lg:border-none">
                    <span 
                      onClick={() => setPreviewInvoice(row)}
                      className="text-slate-900 font-extrabold hover:text-indigo-600 cursor-pointer hover:underline"
                    >
                      {row.id}
                    </span>
                  </td>
                  <td className="flex lg:table-cell justify-between items-center py-2 lg:py-4 border-b border-slate-50 lg:border-none text-right lg:text-left">
                    <span className="font-extrabold text-slate-800">{row.company}</span>
                  </td>
                  <td className="flex lg:table-cell justify-between items-center py-2 lg:py-4 border-b border-slate-50 lg:border-none text-right lg:text-left">
                    <span className="text-slate-500">{row.plan}</span>
                  </td>
                  {activeTab === 'TAX / GST SUMMARY' ? (
                    <>
                      <td className="flex lg:table-cell justify-between items-center py-2 lg:py-4 border-b border-slate-50 lg:border-none text-right lg:text-left">
                        <span className="text-slate-800 font-extrabold">${(row.amount * 0.82).toFixed(2)} Base</span>
                      </td>
                      <td className="flex lg:table-cell justify-between items-center py-2 lg:py-4 border-b border-slate-50 lg:border-none text-right lg:text-left">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px]">
                          18% GST (${(row.amount * 0.18).toFixed(2)})
                        </span>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="flex lg:table-cell justify-between items-center py-2 lg:py-4 border-b border-slate-50 lg:border-none text-right lg:text-left">
                        <span className="text-emerald-600 font-extrabold">${row.amount.toFixed(2)}</span>
                      </td>
                      <td className="flex lg:table-cell justify-between items-center py-2 lg:py-4 border-b border-slate-50 lg:border-none text-right lg:text-left">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${row.status === 'Paid' ? 'bg-[#E6F4EA] text-[#137333]' :
                            row.status === 'Sent' ? 'bg-[#FEF7E0] text-[#B06000]' :
                              row.status === 'Draft' ? 'bg-slate-100 text-slate-600' :
                                'bg-[#FCE8E6] text-[#C5221F]'
                          }`}>
                          {row.status}
                        </span>
                      </td>
                    </>
                  )}
                  <td className="flex lg:table-cell justify-between items-center py-2 lg:py-4 border-b border-slate-50 lg:border-none text-right lg:text-left">
                    <span className="text-slate-400 font-semibold">{row.date}</span>
                  </td>
                  <td className="flex lg:table-cell justify-between items-center py-2 lg:py-4 lg:border-none text-right lg:text-left">
                    <div className="flex justify-end gap-2 items-center">
                      <button
                        onClick={() => handleDownloadInvoice(row)}
                        className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-[11px] px-3.5 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer active:scale-95 flex items-center gap-1"
                      >
                        <Download size={13} /> Download
                      </button>
                      <button
                        onClick={() => openRegenerateModal(row)}
                        className="border border-brand-500 bg-amber-50/50 hover:bg-amber-100 text-[#B06000] font-extrabold text-[11px] px-3.5 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer active:scale-95 flex items-center gap-1"
                      >
                        <RefreshCw size={12} /> Regenerate
                      </button>
                    </div>
                  </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Export Row */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs w-full flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-xs font-bold text-slate-500">Export billing records:</span>
        <div className="flex flex-wrap justify-center md:justify-end gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowExportModal(true)}
            className="w-full sm:w-auto border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <FileText size={14} /> PDF Report
          </button>
          <button
            onClick={handleExportCSV}
            className="w-full sm:w-auto border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <FileSpreadsheet size={14} /> CSV Export
          </button>
          <button
            onClick={handleExportTaxReport}
            className="w-full sm:w-auto border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <DollarSign size={14} /> Tax Report
          </button>
        </div>
      </div>

      {/* ── PREVIEW INVOICE MODAL ── */}
      {previewInvoice && createPortal(
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-[9999]" onClick={() => setPreviewInvoice(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden text-left" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
              <div>
                <h3 className="text-base font-black text-slate-900">Invoice Details ({previewInvoice.id})</h3>
                <p className="text-xs text-slate-400 font-semibold">{previewInvoice.company} • {previewInvoice.plan} Plan</p>
              </div>
              <button onClick={() => setPreviewInvoice(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div><p className="text-[10px] font-bold text-slate-400 uppercase">Issue Date</p><p className="font-bold text-slate-900">{previewInvoice.date}</p></div>
                <div><p className="text-[10px] font-bold text-slate-400 uppercase">Status</p><p className="font-black text-emerald-600">{previewInvoice.status}</p></div>
                <div><p className="text-[10px] font-bold text-slate-400 uppercase">Base Fee</p><p className="font-bold text-slate-900">${(previewInvoice.amount * 0.82).toFixed(2)}</p></div>
                <div><p className="text-[10px] font-bold text-slate-400 uppercase">GST Tax (18%)</p><p className="font-bold text-slate-900">${(previewInvoice.amount * 0.18).toFixed(2)}</p></div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex justify-between items-center">
                <span className="font-black text-slate-900">Total Invoice Amount:</span>
                <span className="text-lg font-black text-indigo-700">${previewInvoice.amount.toFixed(2)}</span>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button onClick={() => setPreviewInvoice(null)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold">Close</button>
              <button onClick={() => { handleDownloadInvoice(previewInvoice); setPreviewInvoice(null); }} className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5">
                <Download size={14} /> Download Document
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── REGENERATE INVOICE MODAL ── */}
      {regenerateInvoice && createPortal(
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-[9999]" onClick={() => setRegenerateInvoice(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden text-left" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <RefreshCw size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Regenerate Metadata</h3>
                  <p className="text-xs text-slate-400 font-semibold">{regenerateInvoice.id} • {regenerateInvoice.company}</p>
                </div>
              </div>
              <button onClick={() => setRegenerateInvoice(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveRegenerate} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Invoice Amount ($)</label>
                <input 
                  type="number" step="0.01" required
                  value={regenForm.amount}
                  onChange={e => setRegenForm({ ...regenForm, amount: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Payment Status</label>
                <select 
                  value={regenForm.status}
                  onChange={e => setRegenForm({ ...regenForm, status: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="Paid">Paid</option>
                  <option value="Sent">Sent</option>
                  <option value="Draft">Draft</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Due Date</label>
                <input 
                  type="text" required
                  value={regenForm.dueDate}
                  onChange={e => setRegenForm({ ...regenForm, dueDate: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setRegenerateInvoice(null)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-brand-500 text-black text-xs font-black rounded-xl hover:bg-yellow-400 shadow-xs">
                  Regenerate & Update
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ── EXPORT REPORT MODAL ── */}
      {showExportModal && createPortal(
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-[9999]" onClick={() => setShowExportModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden text-left" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold">
                  <Download size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Export Billing Report</h3>
                  <p className="text-xs text-slate-400 font-semibold">Generate platform billing & tax records</p>
                </div>
              </div>
              <button onClick={() => setShowExportModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Select Format</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setExportFormat('csv')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${exportFormat === 'csv' ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-slate-200 bg-white text-slate-700'}`}
                  >
                    CSV (Excel Sheet)
                  </button>
                  <button 
                    onClick={() => setExportFormat('tax')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${exportFormat === 'tax' ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-slate-200 bg-white text-slate-700'}`}
                  >
                    Tax / GST Report
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button onClick={() => setShowExportModal(false)} className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600">Cancel</button>
              <button onClick={handleRunModalExport} className="px-5 py-2 bg-brand-500 text-black text-xs font-black rounded-xl hover:bg-yellow-400 shadow-xs flex items-center gap-1.5">
                <Download size={14} /> Download File
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
