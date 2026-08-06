import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import api from '../../services/api';
import { 
  Search, 
  ChevronDown, 
  Check, 
  X as CrossIcon, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  FileCode, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  X,
  ShieldCheck,
  Eye
} from 'lucide-react';

export default function InterCompanyTransfers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportScope, setExportScope] = useState('All');
  const [toastMsg, setToastMsg] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [selectedAuditTransfer, setSelectedAuditTransfer] = useState(null);

  const [transfers, setTransfers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransfers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/asset-transfers');
      if (res.data?.success) {
        setTransfers(res.data.data.map(t => ({
          id: t.id,
          status: t.status,
          title: t.asset?.name || t.assetId || 'Unknown Asset',
          details: `${t.fromCompany?.name || 'Source'} ➔ ${t.toCompany?.name || 'Destination'}`,
          date: new Date(t.createdAt).toLocaleDateString(),
          logs: t.logs || [`${new Date(t.createdAt).toLocaleString()} - Transfer created`]
        })));
      }
    } catch (err) {
      console.error('Failed to load transfers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleApprove = async (id) => {
    try {
      const res = await api.put(`/asset-transfers/${id}`, { status: 'COMPLETED' });
      if (res.data?.success) {
        triggerToast(`Transfer ${id} approved and marked as Completed.`);
        fetchTransfers();
      }
    } catch (err) {
      triggerToast('Error approving transfer.');
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await api.put(`/asset-transfers/${id}`, { status: 'REJECTED' });
      if (res.data?.success) {
        triggerToast(`Transfer ${id} rejected.`);
        fetchTransfers();
      }
    } catch (err) {
      triggerToast('Error rejecting transfer.');
    }
  };

  const filteredTransfers = transfers.filter(tr => {
    const matchesSearch = tr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tr.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tr.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || tr.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const matrixData = [
    { name: 'Falcon Logistics LLC', canSend: false, canReceive: true, autoApprove: 'Enabled' },
    { name: 'Swift Cargo Express', canSend: true, canReceive: true, autoApprove: 'Disabled' },
    { name: 'Global Shipping Solutions', canSend: true, canReceive: true, autoApprove: 'Enabled' },
    { name: 'Texas Hotshot Carriers', canSend: false, canReceive: true, autoApprove: 'Disabled' },
    { name: 'Apex Logistics LLC', canSend: true, canReceive: true, autoApprove: 'Enabled' }
  ];

  const handleRunExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setShowExportModal(false);

      const targetData = exportScope === 'All' 
        ? transfers 
        : transfers.filter(t => t.status.toLowerCase() === exportScope.toLowerCase());

      if (exportFormat === 'csv') {
        let csvContent = `========================================\nHERO LOGISTICS - INTER-COMPANY TRANSFERS AUDIT REPORT\n========================================\nExport Scope: ${exportScope}\nGenerated At: ${new Date().toLocaleString()}\n\nID,STATUS,TITLE,COMPANIES,DATE\n`;
        targetData.forEach(t => {
          csvContent += `"${t.id}","${t.status}","${t.title}","${t.details}","${t.date}"\n`;
        });
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `InterCompany_Transfers_Report_${exportScope}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (exportFormat === 'json') {
        const jsonContent = JSON.stringify({
          system: 'Hero Logistics Super Admin Transfers',
          scope: exportScope,
          timestamp: new Date().toISOString(),
          transfers: targetData
        }, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `InterCompany_Transfers_Dump_${exportScope}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const pdfContent = `Simulated PDF Inter-Company Transfer Audit Report - Scope: ${exportScope}`;
        const blob = new Blob([pdfContent], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `InterCompany_Transfers_Report_${exportScope}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      triggerToast(`Inter-Company Transfer Report (${exportFormat.toUpperCase()}) downloaded!`);
    }, 1000);
  };

  return (
    <div className="flex-grow bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 w-full font-sans text-left relative">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-[9999] bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl text-slate-900 leading-8 capitalize font-black flex items-center gap-2">
            Super Admin • Transfers
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">TOTAL TRANSFERS</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">{transfers.length}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-2">
            <span>All-time platform transfers</span>
            <span className="text-emerald-600">Synced</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">COMPLETED</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">
              {transfers.filter(t => t.status === 'Completed').length}
            </span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-2">
            <span>Successfully delivered</span>
            <span className="text-emerald-600">Stable</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">IN TRANSIT</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">
              {transfers.filter(t => t.status === 'Transit').length}
            </span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-2">
            <span>Currently in transit</span>
            <span className="text-indigo-600">Active</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">PENDING APPROVAL</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">
              {transfers.filter(t => t.status === 'Pending').length}
            </span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold mt-2">
            <span className="text-slate-400">Awaiting admin approval</span>
            <span className="text-rose-500 font-extrabold">Alert</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-32">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">REJECTED</span>
            <span className="text-2xl font-black text-slate-900 block mt-2">
              {transfers.filter(t => t.status === 'Rejected').length}
            </span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-2">
            <span>Denied transfers</span>
            <span>Stable</span>
          </div>
        </div>
      </div>

      {/* Registry Section */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-lg font-black text-slate-800 mb-1">Inter-Company Transfer Registry</h2>
            <p className="text-xs font-semibold text-slate-400">Full audit log of all platform asset and load transfers.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search transfers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 focus:border-[#FFD400] text-xs rounded-xl focus:outline-none placeholder:text-slate-400 font-sans text-slate-800 font-bold"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 bg-white border border-slate-200 text-xs font-extrabold rounded-xl focus:outline-none text-slate-700 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Transit">Transit</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Transfer Cards List */}
        <div className="space-y-4">
          {filteredTransfers.map((tr) => (
            <div key={tr.id} className="border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white hover:shadow-xs transition-shadow">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">{tr.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${tr.status === 'Completed' ? 'bg-[#E6F4EA] text-[#137333]' :
                      tr.status === 'Transit' ? 'bg-[#FEF7E0] text-[#B06000]' :
                        tr.status === 'Pending' ? 'bg-[#FEF7E0] text-[#B06000]' :
                          'bg-[#FCE8E6] text-[#C5221F]'
                    }`}>
                    {tr.status}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-800">{tr.title}</h3>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                  <span>{tr.details}</span>
                  <span>•</span>
                  <span>{tr.date}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                {tr.status === 'Pending' ? (
                  <>
                    <button
                      onClick={() => handleApprove(tr.id)}
                      className="w-full sm:w-auto bg-[#0F9D58] hover:bg-[#0b8043] text-white px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-sm transition-colors cursor-pointer flex justify-center items-center"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(tr.id)}
                      className="w-full sm:w-auto bg-[#DB4437] hover:bg-[#c53929] text-white px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-sm transition-colors cursor-pointer flex justify-center items-center"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setSelectedAuditTransfer(tr)}
                    className="w-full sm:w-auto border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors flex justify-center items-center gap-1.5 cursor-pointer"
                  >
                    <Eye size={13} /> Audit Trail
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs w-full">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">COMPANY TRANSFER PERMISSIONS MATRIX</h2>
        <div className="w-full">
          <div className="hidden md:block w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/20">
                  <th className="p-4 pl-0">COMPANY</th>
                  <th className="p-4 text-center">CAN SEND</th>
                  <th className="p-4 text-center">CAN RECEIVE</th>
                  <th className="p-4 text-right pr-0">AUTO-APPROVE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
                {matrixData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/20">
                    <td className="p-4 pl-0 font-extrabold text-slate-800">{row.name}</td>
                    <td className="p-4 text-center">
                      {row.canSend ? (
                        <span className="text-emerald-500 inline-flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Yes</span>
                      ) : (
                        <span className="text-rose-500 inline-flex items-center gap-1"><CrossIcon className="w-3.5 h-3.5" /> No</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {row.canReceive ? (
                        <span className="text-emerald-500 inline-flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Yes</span>
                      ) : (
                        <span className="text-rose-500 inline-flex items-center gap-1"><CrossIcon className="w-3.5 h-3.5" /> No</span>
                      )}
                    </td>
                    <td className="p-4 text-right pr-0">
                      <span className="text-xs font-bold text-slate-500 border border-slate-200 bg-slate-50/50 px-3 py-1 rounded-lg">
                        {row.autoApprove}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── EXPORT REPORT MODAL ── */}
      {showExportModal && createPortal(
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-[9999]" onClick={() => setShowExportModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden text-left" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold">
                  <Download size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Export Transfer Audit Report</h3>
                  <p className="text-xs text-slate-400 font-semibold">Download inter-company asset transfer history</p>
                </div>
              </div>
              <button onClick={() => setShowExportModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Calendar size={13} /> Filter Transfer Status
                </label>
                <select 
                  value={exportScope}
                  onChange={e => setExportScope(e.target.value)}
                  className="w-full border border-slate-200 bg-white rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="All">All Transfers ({transfers.length})</option>
                  <option value="Completed">Completed Only</option>
                  <option value="Transit">In Transit Only</option>
                  <option value="Pending">Pending Only</option>
                  <option value="Rejected">Rejected Only</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Choose Export Format
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'csv', name: 'CSV', Icon: FileSpreadsheet, sub: 'Excel Sheet' },
                    { id: 'pdf', name: 'PDF', Icon: FileText, sub: 'Summary' },
                    { id: 'json', name: 'JSON', Icon: FileCode, sub: 'Raw Data' },
                  ].map(fmt => {
                    const active = exportFormat === fmt.id;
                    const Icon = fmt.Icon;
                    return (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setExportFormat(fmt.id)}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                          active ? 'border-amber-500 bg-amber-50/70 text-amber-900 shadow-xs' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon size={18} className={active ? 'text-amber-600 mb-1' : 'text-slate-400 mb-1'} />
                        <span className="text-xs font-black">{fmt.name}</span>
                        <span className="text-[9px] text-slate-400 font-semibold mt-0.5">{fmt.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-600 font-medium">
                  Report includes transfer IDs, sending/receiving company names, timestamp logs, and approval status.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button onClick={() => setShowExportModal(false)} className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors">
                Cancel
              </button>
              <button 
                onClick={handleRunExport}
                disabled={isExporting}
                className="px-5 py-2 bg-[#FFD400] hover:bg-yellow-400 text-black text-xs font-black rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isExporting ? <span className="animate-pulse">Generating...</span> : <><Download size={14} /> Download {exportFormat.toUpperCase()}</>}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── AUDIT TRAIL MODAL ── */}
      {selectedAuditTransfer && createPortal(
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-[9999]" onClick={() => setSelectedAuditTransfer(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden text-left" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
              <div>
                <h3 className="text-base font-black text-slate-900">Transfer Audit Trail</h3>
                <p className="text-xs text-slate-400 font-semibold">{selectedAuditTransfer.id} • {selectedAuditTransfer.title}</p>
              </div>
              <button onClick={() => setSelectedAuditTransfer(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs">
                <p className="text-slate-400 font-bold uppercase text-[9px]">Route & Companies</p>
                <p className="font-bold text-slate-900 mt-0.5">{selectedAuditTransfer.details}</p>
              </div>

              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3">Timestamped Event Log</h4>
                <div className="space-y-2.5">
                  {(selectedAuditTransfer.logs || []).map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <Clock size={14} className="text-indigo-600 shrink-0 mt-0.5" />
                      <span className="font-semibold leading-relaxed">{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setSelectedAuditTransfer(null)} className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl">
                Close Log
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
