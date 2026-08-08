import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText, Search, Upload, Download, Eye,
  Folder, ChevronRight, Building, Truck, Users, UserCheck,
  X, CheckCircle2, Trash2, AlertCircle, Loader2, RefreshCw,
  ShieldCheck
} from 'lucide-react';
import api from '../../services/api';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (d) => d
  ? new Date(d).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' })
  : '—';

const getCategoryStyle = (cat) => {
  switch (cat) {
    case 'Company Documents':  return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'Driver Documents':   return 'bg-purple-50 text-purple-700 border border-purple-200';
    case 'Vehicle Documents':  return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    case 'Customer Documents': return 'bg-amber-50 text-amber-700 border border-amber-200';
    default:                   return 'bg-slate-100 text-slate-600 border border-slate-200';
  }
};

const CATEGORIES = [
  { id: 'All Documents',     label: 'All Documents',     icon: Folder    },
  { id: 'Company Documents', label: 'Company Documents', icon: Building  },
  { id: 'Driver Documents',  label: 'Driver Documents',  icon: UserCheck },
  { id: 'Vehicle Documents', label: 'Vehicle Documents', icon: Truck     },
  { id: 'Customer Documents',label: 'Customer Documents',icon: Users     },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function CompanyAdminDocuments() {
  const [activeCategory, setActiveCategory] = useState('All Documents');
  const [search, setSearch]                 = useState('');
  const [loading, setLoading]               = useState(true);
  const [statsLoading, setStatsLoading]     = useState(true);
  const [error, setError]                   = useState(null);

  // Data from API
  const [documents, setDocuments] = useState([]);
  const [total, setTotal]         = useState(0);
  const [stats, setStats]         = useState(null);

  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewDoc, setPreviewDoc]           = useState(null);
  const [toastMessage, setToastMessage]       = useState(null);
  const [submitting, setSubmitting]           = useState(false);
  const [deletingId, setDeletingId]           = useState(null);

  // Upload form
  const [newDoc, setNewDoc] = useState({
    title: '',
    category: 'Company Documents',
    entity: '',
    driverId: '',
    vehicleId: '',
    expiryDate: ''
  });

  // ── Toast ────────────────────────────────────────────────────────────────────
  const showToast = (msg, isError = false) => {
    setToastMessage({ text: msg, isError });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ── Fetch documents ──────────────────────────────────────────────────────────
  const fetchDocuments = useCallback(async (cat = activeCategory, q = search) => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (cat && cat !== 'All Documents') params.category = cat;
      if (q) params.search = q;
      const res = await api.get('/company-admin/documents', { params });
      const data = res.data?.data || res.data || {};
      setDocuments(Array.isArray(data.documents) ? data.documents : Array.isArray(data) ? data : []);
      setTotal(data.total ?? (Array.isArray(data.documents) ? data.documents.length : 0));
    } catch (err) {
      console.error('Documents fetch error:', err);
      setError(err?.response?.data?.message || 'Failed to load documents.');
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch stats ──────────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await api.get('/company-admin/documents/stats');
      setStats(res.data?.data || res.data || null);
    } catch {
      // Stats are non-critical; silently skip
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments(activeCategory, '');
    fetchStats();
  }, []);

  // Refetch when category changes
  useEffect(() => {
    fetchDocuments(activeCategory, search);
  }, [activeCategory]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => fetchDocuments(activeCategory, search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ── Upload document ──────────────────────────────────────────────────────────
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!newDoc.title) { showToast('Please enter a Document Title.', true); return; }
    setSubmitting(true);
    try {
      const payload = {
        title: newDoc.title,
        category: newDoc.category,
        entity: newDoc.entity || undefined,
        driverId: newDoc.driverId || undefined,
        vehicleId: newDoc.vehicleId || undefined,
        expiryDate: newDoc.expiryDate || undefined
      };
      const res = await api.post('/company-admin/documents', payload);
      const created = res.data?.data || res.data || {};
      showToast(`✅ Document "${created.displayName || newDoc.title}" uploaded to ${newDoc.category}`);
      setShowUploadModal(false);
      setNewDoc({ title: '', category: 'Company Documents', entity: '', driverId: '', vehicleId: '', expiryDate: '' });
      await Promise.all([fetchDocuments(activeCategory, search), fetchStats()]);
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to upload document.', true);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete document ──────────────────────────────────────────────────────────
  const handleDelete = async (doc) => {
    if (!window.confirm(`Delete "${doc.displayName || doc.fileUrl}"? This cannot be undone.`)) return;
    setDeletingId(doc.id);
    try {
      await api.delete(`/company-admin/documents/${doc.id}`);
      showToast(`Document deleted successfully`);
      await Promise.all([fetchDocuments(activeCategory, search), fetchStats()]);
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to delete document.', true);
    } finally {
      setDeletingId(null);
    }
  };

  // ── Download ─────────────────────────────────────────────────────────────────
  const handleDownload = (doc) => {
    const name = doc.displayName || doc.fileUrl?.split('/').pop() || `doc-${doc.id}`;
    if (doc.fileUrl && doc.fileUrl.startsWith('http')) {
      // Real file URL — open in new tab
      window.open(doc.fileUrl, '_blank');
    } else {
      // Virtual path — generate a placeholder text file
      const content = [
        `Document: ${name}`,
        `Category: ${doc.category || doc.type}`,
        `Associated Entity: ${doc.associatedEntity || '—'}`,
        `Status: ${doc.status}`,
        `Created: ${fmtDate(doc.createdAt)}`,
        '',
        'Note: This document is stored in the system. Configure cloud file storage to enable real file downloads.'
      ].join('\n');
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${name}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    showToast(`Downloaded "${name}"`);
  };

  // ── KPI Card data ─────────────────────────────────────────────────────────────
  const kpiCards = [
    {
      cat: 'Company Documents',
      label: 'Company Documents',
      sub: 'SOPs & Policies',
      sub2: 'NHVA & Safety Certs',
      icon: Building,
      color: 'blue',
      active: activeCategory === 'Company Documents',
      ring: 'border-blue-500 ring-2 ring-blue-500/10',
      hover: 'hover:border-blue-300'
    },
    {
      cat: 'Driver Documents',
      label: 'Driver Documents',
      sub: 'Licenses & Meds',
      sub2: stats?.byCategory?.['Driver Documents'] > 0 ? `${stats.byCategory['Driver Documents']} docs on file` : 'No docs yet',
      icon: UserCheck,
      color: 'purple',
      active: activeCategory === 'Driver Documents',
      ring: 'border-purple-500 ring-2 ring-purple-500/10',
      hover: 'hover:border-purple-300'
    },
    {
      cat: 'Vehicle Documents',
      label: 'Vehicle Documents',
      sub: 'Rego & Insurance',
      sub2: 'Fleet docs',
      icon: Truck,
      color: 'emerald',
      active: activeCategory === 'Vehicle Documents',
      ring: 'border-emerald-500 ring-2 ring-emerald-500/10',
      hover: 'hover:border-emerald-300'
    },
    {
      cat: 'Customer Documents',
      label: 'Customer Documents',
      sub: 'Contracts & PODs',
      sub2: 'Signed Agreements & PODs',
      icon: Users,
      color: 'amber',
      active: activeCategory === 'Customer Documents',
      ring: 'border-amber-500 ring-2 ring-amber-500/10',
      hover: 'hover:border-amber-300'
    }
  ];

  const colorMap = {
    blue:   { bg: 'bg-blue-50',    text: 'text-blue-600',    sub: 'text-blue-600'    },
    purple: { bg: 'bg-purple-50',  text: 'text-purple-600',  sub: 'text-emerald-600' },
    emerald:{ bg: 'bg-emerald-50', text: 'text-emerald-600', sub: 'text-slate-500'   },
    amber:  { bg: 'bg-amber-50',   text: 'text-amber-600',   sub: 'text-amber-600'   }
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8f9fc] p-3 sm:p-6 lg:p-8 font-sans pb-24 text-slate-900 overflow-x-hidden">

      {/* Toast */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-[99999] ${toastMessage.isError ? 'bg-red-600' : 'bg-slate-900'} text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2`}>
          {toastMessage.isError
            ? <AlertCircle size={16} className="text-red-200 shrink-0" />
            : <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          }
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1 flex-wrap">
            <span>ADMIN PORTAL</span>
            <ChevronRight size={12} className="shrink-0" />
            <span className="text-slate-900 font-bold">Documents Repository</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5 flex-wrap">
            <FileText className="text-blue-600 shrink-0" size={26} />
            <span>Master Document Vault &amp; Compliance</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1 max-w-2xl leading-relaxed">
            Centralized document repository organized into <strong>Company Documents</strong>, <strong>Driver Documents</strong>, <strong>Vehicle Documents</strong>, and <strong>Customer Documents</strong>.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0 flex-nowrap">
          <button
            onClick={() => { fetchDocuments(activeCategory, search); fetchStats(); }}
            className="p-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Upload size={16} className="shrink-0" />
            <span>Upload New Document</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-5 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-700 font-semibold">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
          <button onClick={() => fetchDocuments(activeCategory, search)} className="ml-auto underline cursor-pointer">Retry</button>
        </div>
      )}

      {/* KPI Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          const c = colorMap[card.color];
          const count = stats?.byCategory?.[card.cat] ?? '—';
          return (
            <div
              key={card.cat}
              onClick={() => setActiveCategory(card.cat)}
              className={`bg-white border rounded-xl p-3 sm:p-3.5 shadow-xs cursor-pointer transition-all ${
                card.active ? card.ring : `border-slate-200/80 ${card.hover}`
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{card.label}</span>
                <div className={`w-7 h-7 rounded-lg ${c.bg} ${c.text} flex items-center justify-center shrink-0`}>
                  <Icon size={14} />
                </div>
              </div>
              <p className="text-base sm:text-lg font-black text-slate-900 leading-tight">{card.sub}</p>
              <span className={`text-[10px] font-bold mt-0.5 block ${c.sub}`}>
                {statsLoading ? '...' : `${count} document${count !== 1 ? 's' : ''}`} · {card.sub2}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main Vault Panel */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden mb-6">

        {/* Category Navigation Tabs */}
        <div className="flex border-b border-slate-100 px-4 sm:px-6 gap-4 sm:gap-8 overflow-x-auto whitespace-nowrap no-scrollbar">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setSearch(''); }}
                className={`py-3.5 sm:py-4 text-xs font-bold transition-all relative cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  activeCategory === cat.id ? 'text-blue-600 border-b-2 border-blue-600 font-black' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon size={14} className="shrink-0" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filter & Search Bar */}
        <div className="p-3 sm:p-4 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${activeCategory}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 shadow-xs"
            />
          </div>
          <span className="text-xs font-bold text-slate-400">{total} Document{total !== 1 ? 's' : ''} Found</span>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm font-semibold">Loading documents...</span>
          </div>
        )}

        {/* Documents Table */}
        {!loading && (
          <div className="overflow-x-auto w-full">
            {documents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                <FileText size={32} className="text-slate-200" />
                <p className="text-sm font-bold">No documents found</p>
                <p className="text-xs">
                  {search ? `No results for "${search}"` : 'Click "Upload New Document" to add your first document'}
                </p>
              </div>
            ) : (
              <table className="w-full min-w-[720px] text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Document Title</th>
                    <th className="py-3.5 px-4 sm:px-6">Folder Category</th>
                    <th className="py-3.5 px-4 sm:px-6">Associated Entity</th>
                    <th className="py-3.5 px-4 sm:px-6">Expiry Date</th>
                    <th className="py-3.5 px-4 sm:px-6">Uploaded</th>
                    <th className="py-3.5 px-4 sm:px-6">Status</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                  {documents.map(row => (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 sm:px-6 font-black text-slate-900">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-blue-600 shrink-0" />
                          <span className="max-w-[240px] truncate" title={row.displayName || row.fileUrl}>
                            {row.displayName || row.fileUrl?.split('/').pop() || `doc-${row.id}`}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 sm:px-6">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${getCategoryStyle(row.category || row.type)}`}>
                          {row.category || row.type || '—'}
                        </span>
                      </td>
                      <td className="py-4 px-4 sm:px-6 font-semibold text-slate-700 max-w-[180px] truncate" title={row.associatedEntity}>
                        {row.associatedEntity || '—'}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-slate-500">
                        {row.expiryDate ? (
                          <span className={new Date(row.expiryDate) < new Date() ? 'text-red-600 font-bold' : ''}>
                            {fmtDate(row.expiryDate)}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-slate-500">{fmtDate(row.createdAt)}</td>
                      <td className="py-4 px-4 sm:px-6">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          row.status === 'Expired'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {row.status || 'Active'}
                        </span>
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setPreviewDoc(row)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer"
                            title="Preview"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleDownload(row)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer"
                            title="Download"
                          >
                            <Download size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(row)}
                            disabled={deletingId === row.id}
                            className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer disabled:opacity-40"
                            title="Delete"
                          >
                            {deletingId === row.id
                              ? <Loader2 size={14} className="animate-spin" />
                              : <Trash2 size={14} />
                            }
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* ── PREVIEW MODAL ───────────────────────────────────────────────────── */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs z-[99999] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <div className="flex items-center gap-2">
                <FileText className="text-blue-600" size={20} />
                <h3 className="text-base font-black text-slate-900 truncate max-w-xs">
                  {previewDoc.displayName || previewDoc.fileUrl?.split('/').pop()}
                </h3>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 text-xs space-y-2 mb-4 border border-slate-200/60 font-medium">
              {[
                ['Folder Category',    previewDoc.category || previewDoc.type || '—'],
                ['Associated Entity',  previewDoc.associatedEntity || '—'],
                ['Status',             previewDoc.status || 'Active'],
                ['Expiry Date',        fmtDate(previewDoc.expiryDate)],
                ['Created',            fmtDate(previewDoc.createdAt)],
                ['Document ID',        previewDoc.id],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-slate-500">{label}:</span>
                  <span className="font-bold text-right max-w-[200px] truncate">{val}</span>
                </div>
              ))}
            </div>
            <div className="h-36 bg-slate-100 rounded-xl flex flex-col items-center justify-center text-slate-400 text-xs font-bold border border-slate-200 border-dashed mb-4">
              <FileText size={32} className="mb-2 text-slate-300" />
              <span>Document Preview</span>
              <span className="text-[10px] font-normal text-slate-400 mt-1">
                Configure cloud storage for inline preview
              </span>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setPreviewDoc(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs cursor-pointer">Close</button>
              <button
                onClick={() => { handleDownload(previewDoc); setPreviewDoc(null); }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer hover:bg-blue-700"
              >
                <Download size={14} /> Download File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── UPLOAD MODAL ────────────────────────────────────────────────────── */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs z-[99999] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900">Upload Document to Vault</h3>
              <button onClick={() => setShowUploadModal(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-600">Document Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Driver License - Liam Smith"
                  value={newDoc.title}
                  onChange={e => setNewDoc({ ...newDoc, title: e.target.value })}
                  className="w-full p-2.5 border rounded-xl mt-1 text-xs font-semibold outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="font-bold text-slate-600">Folder Category *</label>
                <select
                  value={newDoc.category}
                  onChange={e => setNewDoc({ ...newDoc, category: e.target.value })}
                  className="w-full p-2.5 border rounded-xl mt-1 text-xs font-semibold outline-none focus:border-blue-500"
                >
                  <option value="Company Documents">Company Documents</option>
                  <option value="Driver Documents">Driver Documents</option>
                  <option value="Vehicle Documents">Vehicle Documents</option>
                  <option value="Customer Documents">Customer Documents</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-600">Associated Entity / Reference</label>
                <input
                  type="text"
                  placeholder="e.g. Vehicle: NSW-BD101 or Driver Name or General"
                  value={newDoc.entity}
                  onChange={e => setNewDoc({ ...newDoc, entity: e.target.value })}
                  className="w-full p-2.5 border rounded-xl mt-1 text-xs font-semibold outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600">Expiry Date (optional)</label>
                <input
                  type="date"
                  value={newDoc.expiryDate}
                  onChange={e => setNewDoc({ ...newDoc, expiryDate: e.target.value })}
                  className="w-full p-2.5 border rounded-xl mt-1 text-xs font-semibold outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600">Select File</label>
                <input
                  type="file"
                  className="w-full p-2 border rounded-xl mt-1 bg-slate-50 text-xs text-slate-600 cursor-pointer"
                />
                <p className="text-[10px] text-slate-400 mt-1">Note: File upload to cloud storage is not yet configured. Document metadata will be saved.</p>
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold cursor-pointer"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-xs hover:bg-blue-700 cursor-pointer flex items-center gap-2 disabled:opacity-60"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  {submitting ? 'Uploading...' : 'Upload Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
