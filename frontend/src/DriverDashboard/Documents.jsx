import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  FiCheckCircle, FiClock, FiPlus, FiUpload, FiRefreshCw,
  FiFilter, FiFileText, FiDollarSign, FiChevronRight,
  FiAlertTriangle, FiArrowLeft, FiCamera, FiCheck, FiX,
  FiBookOpen, FiShield, FiHelpCircle, FiBarChart2, FiLayers,
  FiEye, FiDownload, FiSearch, FiPaperclip, FiShare2, FiShare,
  FiAward, FiCalendar, FiAlertCircle
} from 'react-icons/fi';

export default function Documents() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Tab & Search States
  const [activeTab, setActiveTab] = useState('My Documents'); // 'My Documents', 'Vehicle Documents', 'Compliance History'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [toastMsg, setToastMsg] = useState('');
  const [tipDismissed, setTipDismissed] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Modals
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewDocModalOpen, setViewDocModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [complianceReportModalOpen, setComplianceReportModalOpen] = useState(false);
  const [shareAdminModalOpen, setShareAdminModalOpen] = useState(false);

  // Form State for Upload
  const [uploadDocName, setUploadDocName] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Personal');
  const [uploadExpiry, setUploadExpiry] = useState('');

  // Documents Data (11 Items from screenshot 15.10)
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Driver Licence (HC)', type: 'Personal', expiry: '12 Aug 2026', status: 'Valid', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '🆔' },
    { id: 2, name: 'Medical Certificate', type: 'Personal', expiry: '15 Oct 2025', status: 'Valid', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '🏥' },
    { id: 3, name: 'FAT / Heavy Vehicle Card', type: 'Personal', expiry: '30 Jun 2025', status: 'Expiring Soon', statusColor: 'bg-amber-50 text-amber-700 border-amber-200', icon: '💳' },
    { id: 4, name: 'Police Check', type: 'Personal', expiry: '20 Nov 2025', status: 'Valid', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '🛡️' },
    { id: 5, name: 'Chain of Responsibility', type: 'Compliance', expiry: '05 Jul 2025', status: 'Expiring Soon', statusColor: 'bg-amber-50 text-amber-700 border-amber-200', icon: '🦺' },
    { id: 6, name: 'First Aid Certificate', type: 'Personal', expiry: '10 Sep 2026', status: 'Valid', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '🚑' },
    { id: 7, name: 'Dangerous Goods Licence', type: 'Compliance', expiry: '15 May 2025', status: 'Expired', statusColor: 'bg-rose-50 text-rose-700 border-rose-200', icon: '📕' },
    { id: 8, name: 'Heavy Vehicle Licence Endorsement', type: 'Personal', expiry: 'No Expiry', status: 'Uploaded', statusColor: 'bg-blue-50 text-blue-700 border-blue-200', icon: '🚛' },
    { id: 9, name: 'Right To Work', type: 'Personal', expiry: 'No Expiry', status: 'Uploaded', statusColor: 'bg-blue-50 text-blue-700 border-blue-200', icon: '📄' },
    { id: 10, name: 'Vaccination Certificate', type: 'Personal', expiry: 'Not Required', status: 'Not Required', statusColor: 'bg-slate-100 text-slate-600 border-slate-200', icon: '📋' },
    { id: 11, name: 'Induction Training', type: 'Compliance', expiry: 'Not Required', status: 'Not Required', statusColor: 'bg-slate-100 text-slate-600 border-slate-200', icon: '🎓' },
  ]);

  // Vehicle Documents Data
  const vehicleDocs = [
    { id: 101, name: 'Vehicle Registration (TRK-101)', expiry: '15 Dec 2025', status: 'Valid', icon: '🚛' },
    { id: 102, name: 'Trailer Inspection (TRL-305)', expiry: '20 Oct 2025', status: 'Valid', icon: '🚚' },
    { id: 103, name: 'Comprehensive Insurance Policy', expiry: '31 Aug 2025', status: 'Valid', icon: '🛡️' },
    { id: 104, name: 'Permit: Overdimensional Load', expiry: '01 Jul 2025', status: 'Expiring Soon', icon: '📄' }
  ];

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleFilePicked = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      triggerToast(`Selected document file: ${e.target.files[0].name}`);
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    const docTitle = uploadDocName || (selectedFile ? selectedFile.name : 'New Document');
    const newDoc = {
      id: Date.now(),
      name: docTitle,
      type: uploadCategory,
      expiry: uploadExpiry || '12 Dec 2026',
      status: 'Valid',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: '📄'
    };

    setDocuments([newDoc, ...documents]);
    setSelectedFile(null);
    setUploadDocName('');
    setUploadExpiry('');
    setUploadModalOpen(false);
    triggerToast(`Document "${docTitle}" uploaded successfully!`);
  };

  // Calculations
  const validCount = documents.filter(d => d.status === 'Valid').length;
  const expiringCount = documents.filter(d => d.status === 'Expiring Soon').length;
  const expiredCount = documents.filter(d => d.status === 'Expired').length;
  const uploadedCount = documents.filter(d => d.status === 'Uploaded').length;
  const notRequiredCount = documents.filter(d => d.status === 'Not Required').length;
  const totalDocs = documents.length;

  const compliancePercentage = Math.round((validCount / (totalDocs - notRequiredCount)) * 100);

  // Filtering
  const filteredDocs = documents.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterCategory === 'ALL') return true;
    return d.status.toUpperCase().replace(/\s+/g, '_') === filterCategory.toUpperCase().replace(/\s+/g, '_');
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans p-4 sm:p-6 lg:p-8 space-y-6 pb-24 text-left">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-[150] bg-slate-900 text-white font-extrabold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-bounce border border-slate-700">
          <FiCheckCircle className="text-[#ffcc00] text-base shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*,.pdf" 
        onChange={handleFilePicked} 
        className="hidden" 
      />

      {/* TOP HEADER TITLE BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Documents & Compliance</h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">Manage your documents, licenses and ensure you stay compliant on the road</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setUploadModalOpen(true)}
            className="flex-1 sm:flex-initial bg-[#ffcc00] hover:bg-[#e6b800] text-black font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FiPlus className="text-base" />
            <span>Upload Document</span>
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
              <span className="text-lg font-black text-indigo-700 tracking-tight">15.10 Documents</span>
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                Compliant
              </span>
            </div>
            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              Manage your documents, licenses and ensure you stay compliant on the road.
            </p>
          </div>

          {/* LEGEND CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LEGEND</div>
            <div className="space-y-2 font-bold">
              <div className="flex items-center gap-2.5 text-emerald-700">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span>Valid</span>
              </div>
              <div className="flex items-center gap-2.5 text-amber-700">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span>Expiring Soon</span>
              </div>
              <div className="flex items-center gap-2.5 text-rose-700">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span>Expired</span>
              </div>
              <div className="flex items-center gap-2.5 text-blue-700">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span>Uploaded</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                <span>Not Required</span>
              </div>
            </div>
          </div>

          {/* COMPLIANCE OVERVIEW GAUGE */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs text-center">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">COMPLIANCE OVERVIEW</div>
            
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              {/* Circular Gauge Simulation */}
              <div className="w-full h-full rounded-full border-8 border-slate-100 border-t-emerald-500 border-r-emerald-500 border-b-emerald-500 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-base font-black text-slate-900">{validCount} / {totalDocs}</div>
                  <div className="text-sm font-black text-emerald-600">{compliancePercentage}%</div>
                </div>
              </div>
            </div>

            <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full border border-emerald-200">
              Compliant 🟢
            </span>
          </div>

          {/* VEHICLE & LOAD CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">VEHICLE & LOAD</div>
            <div className="space-y-2.5 font-semibold text-slate-700">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-extrabold">Truck</div>
                <div className="font-black text-slate-900 text-xs">TRK-101</div>
                <div className="text-[11px] text-slate-500">MAN TGX 26.580</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-extrabold">Trailer</div>
                <div className="font-black text-slate-900 text-xs">TRL-305</div>
                <div className="text-[11px] text-slate-500">Car Carrier (4 Level)</div>
              </div>
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-1">
                <div className="text-[10px] text-indigo-500 uppercase font-extrabold">Active Load</div>
                <div className="font-black text-indigo-900 text-xs">LD-3987</div>
                <div className="text-[11px] text-indigo-700">Car Carrier (4 Level)</div>
              </div>
            </div>
          </div>

          {/* KEY ACTIONS PANEL */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">KEY ACTIONS</div>
            <div className="space-y-2">
              <button onClick={() => setUploadModalOpen(true)} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📤 Upload Document</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => setFilterCategory('EXPIRING_SOON')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📅 Check Expiry</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => setFilterCategory('EXPIRED')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">⚠️ View Expired</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => triggerToast('All documents zip archive downloaded!')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📥 Download All</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => setShareAdminModalOpen(true)} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📤 Share with Admin</span>
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
              <div className="text-[11px] text-slate-500">Last sync: 29 May 2025, 10:15 AM</div>
              <div className="text-[11px] text-slate-500">Auto refresh: Every 5 minutes</div>
            </div>
            <button
              onClick={() => triggerToast('Documents synced with Compliance Server!')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl border border-slate-800 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <FiRefreshCw className="text-amber-400" />
              <span>Sync Now</span>
            </button>
          </div>

        </div>

        {/* ================= MIDDLE COLUMN: MAIN DOCUMENTS ENGINE (6 COLS) ================= */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* LOAD METADATA BANNER CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <div className="text-2xl font-black text-indigo-700 tracking-tight">LD-3987</div>
                <div className="text-base font-black text-slate-900 flex items-center gap-2 mt-0.5">
                  <span>Melbourne VIC</span>
                  <span className="text-slate-400">➔</span>
                  <span>Sydney NSW</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 p-3 rounded-2xl w-full sm:w-auto justify-between sm:justify-start">
                <div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Start Date</span>
                  <span className="font-mono text-slate-900">29 May 2025</span>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Est. Finish</span>
                  <span className="font-mono text-slate-900">29 May 2025</span>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Status</span>
                  <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black px-2 py-0.5 rounded-full block text-center">En Route</span>
                </div>
                <div className="h-6 w-px bg-slate-200"></div>
                <div>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Load ID</span>
                  <span className="font-mono text-indigo-700">PO-65432</span>
                </div>
              </div>
            </div>

            {/* SUB NAV TABS */}
            <div className="flex border-b border-slate-200 space-x-6 text-xs font-black pt-2">
              {['My Documents', 'Vehicle Documents', 'Compliance History'].map(tab => (
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

          {/* 4 STATUS STAT SUMMARY TILES */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div 
              onClick={() => setFilterCategory('VALID')}
              className={`p-3.5 rounded-3xl border flex items-center justify-between shadow-2xs cursor-pointer transition-all ${
                filterCategory === 'VALID' ? 'bg-emerald-100 border-emerald-400 ring-2 ring-emerald-400/20' : 'bg-emerald-50/80 hover:bg-emerald-100/60 border-emerald-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-emerald-200 text-emerald-800 font-black text-xs flex items-center justify-center">✓</span>
                <span className="text-xs font-black text-emerald-950">Valid</span>
              </div>
              <span className="text-xl font-black text-emerald-800 font-mono">{validCount}</span>
            </div>

            <div 
              onClick={() => setFilterCategory('EXPIRING_SOON')}
              className={`p-3.5 rounded-3xl border flex items-center justify-between shadow-2xs cursor-pointer transition-all ${
                filterCategory === 'EXPIRING_SOON' ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-400/20' : 'bg-amber-50/80 hover:bg-amber-100/60 border-amber-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-amber-200 text-amber-800 font-black text-xs flex items-center justify-center">⏳</span>
                <span className="text-xs font-black text-amber-950">Expiring Soon</span>
              </div>
              <span className="text-xl font-black text-amber-800 font-mono">{expiringCount}</span>
            </div>

            <div 
              onClick={() => setFilterCategory('EXPIRED')}
              className={`p-3.5 rounded-3xl border flex items-center justify-between shadow-2xs cursor-pointer transition-all ${
                filterCategory === 'EXPIRED' ? 'bg-rose-100 border-rose-400 ring-2 ring-rose-400/20' : 'bg-rose-50/80 hover:bg-rose-100/60 border-rose-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-rose-200 text-rose-800 font-black text-xs flex items-center justify-center">✕</span>
                <span className="text-xs font-black text-rose-950">Expired</span>
              </div>
              <span className="text-xl font-black text-rose-800 font-mono">{expiredCount}</span>
            </div>

            <div 
              onClick={() => setFilterCategory('UPLOADED')}
              className={`p-3.5 rounded-3xl border flex items-center justify-between shadow-2xs cursor-pointer transition-all ${
                filterCategory === 'UPLOADED' ? 'bg-blue-100 border-blue-400 ring-2 ring-blue-400/20' : 'bg-blue-50/80 hover:bg-blue-100/60 border-blue-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-blue-200 text-blue-800 font-black text-xs flex items-center justify-center">📥</span>
                <span className="text-xs font-black text-blue-950">Uploaded</span>
              </div>
              <span className="text-xl font-black text-blue-800 font-mono">{uploadedCount}</span>
            </div>
          </div>

          {/* MY DOCUMENTS LIST VIEW */}
          {activeTab === 'My Documents' && (
            <>
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-black text-slate-900 tracking-tight">MY DOCUMENTS</h3>
                    <span className="bg-slate-100 text-slate-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-slate-200">
                      {filteredDocs.length} Items
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl focus:outline-none cursor-pointer"
                    >
                      <option value="ALL">Filter: All Statuses</option>
                      <option value="VALID">Valid</option>
                      <option value="EXPIRING_SOON">Expiring Soon</option>
                      <option value="EXPIRED">Expired</option>
                      <option value="UPLOADED">Uploaded</option>
                      <option value="NOT_REQUIRED">Not Required</option>
                    </select>
                  </div>
                </div>

                {/* DOCUMENTS TABLE / CARDS LIST */}
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  {filteredDocs.map((doc) => (
                    <div key={doc.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="p-2.5 bg-slate-100 text-slate-800 rounded-2xl text-base shrink-0">
                          {doc.icon}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-slate-900">{doc.name}</span>
                            <span className={`text-[9.5px] font-black px-2 py-0.2 rounded-full border ${doc.statusColor}`}>
                              {doc.status}
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 font-bold mt-0.5">
                            Expiry: {doc.expiry}
                          </div>
                        </div>
                      </div>

                      {/* Action Icons */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => { setSelectedDoc(doc); setViewDocModalOpen(true); }}
                          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                          title="View Document"
                        >
                          <FiEye className="text-base" />
                        </button>
                        <button
                          onClick={() => triggerToast(`Downloading ${doc.name}...`)}
                          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                          title="Download Document"
                        >
                          <FiDownload className="text-base" />
                        </button>
                        <button
                          onClick={() => { setSelectedDoc(doc); setViewDocModalOpen(true); }}
                          className="p-2 text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          <FiChevronRight className="text-base" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DRAG & DROP UPLOAD BOX */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-indigo-200 bg-indigo-50/30 hover:bg-indigo-100/40 rounded-3xl p-8 text-center space-y-2 cursor-pointer transition-all shadow-xs"
              >
                <FiCloudUpload className="text-4xl text-indigo-600 mx-auto" />
                {selectedFile ? (
                  <div className="text-xs font-black text-emerald-700 flex items-center justify-center gap-1.5">
                    <FiPaperclip /> {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </div>
                ) : (
                  <>
                    <div className="text-xs font-black text-slate-900">Drag and drop files here or tap to upload</div>
                    <div className="text-[10px] font-semibold text-slate-500">PDF, JPG, PNG up to 10MB each</div>
                  </>
                )}
              </div>

              {/* TIP BANNER */}
              {!tipDismissed && (
                <div className="bg-purple-50 border border-purple-200 rounded-3xl p-4 flex items-center justify-between gap-3 text-purple-950 text-xs font-bold shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="p-1.5 bg-purple-100 text-purple-700 rounded-xl">💡</span>
                    <div>
                      <span className="font-black text-purple-900">TIP: </span>
                      <span className="text-purple-700 font-medium text-[11px]">
                        Keep your documents up to date to remain compliant and avoid delays or penalties.
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

          {/* VEHICLE DOCUMENTS TAB */}
          {activeTab === 'Vehicle Documents' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900">Vehicle Documents & Permits (TRK-101 / TRL-305)</h3>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {vehicleDocs.map((doc) => (
                  <div key={doc.id} className="p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{doc.icon}</span>
                      <div>
                        <div className="font-black text-xs text-slate-900">{doc.name}</div>
                        <div className="text-[10.5px] font-mono text-slate-500 font-bold">Expires: {doc.expiry}</div>
                      </div>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COMPLIANCE HISTORY TAB */}
          {activeTab === 'Compliance History' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
              <h3 className="text-base font-black text-slate-900">Compliance Audit Log & History</h3>
              <div className="space-y-2 text-xs font-semibold">
                {[
                  { title: 'Driver Licence Renewed & Approved', date: '12 Aug 2024', status: 'Approved' },
                  { title: 'Medical Check Certificate Uploaded', date: '15 Oct 2024', status: 'Approved' },
                  { title: 'Chain of Responsibility Course Completed', date: '05 Jul 2024', status: 'Approved' },
                  { title: 'Dangerous Goods Licence Renewal Alert Sent', date: '15 May 2025', status: 'Action Needed' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
                    <div>
                      <div className="font-black text-slate-900">{item.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.date}</div>
                    </div>
                    <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ================= RIGHT COLUMN: SIDEBAR PANELS (3 COLS) ================= */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* COMPLIANCE SUMMARY */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">COMPLIANCE SUMMARY</div>
            <div className="space-y-2 font-bold text-slate-700 border-b border-slate-100 pb-3">
              <div className="flex justify-between items-center">
                <span>Total Documents</span>
                <span className="font-mono text-slate-900 font-black">{totalDocs}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-700">
                <span>Valid</span>
                <span className="font-mono text-slate-900">{validCount}</span>
              </div>
              <div className="flex justify-between items-center text-amber-700">
                <span>Expiring Soon (30 Days)</span>
                <span className="font-mono text-slate-900">{expiringCount}</span>
              </div>
              <div className="flex justify-between items-center text-rose-700">
                <span>Expired</span>
                <span className="font-mono text-slate-900">{expiredCount}</span>
              </div>
              <div className="flex justify-between items-center text-blue-700">
                <span>Uploaded</span>
                <span className="font-mono text-slate-900">{uploadedCount}</span>
              </div>
            </div>

            <button 
              onClick={() => setComplianceReportModalOpen(true)}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold py-2 rounded-xl border border-slate-200 transition-all cursor-pointer text-center"
            >
              View Compliance Report
            </button>
          </div>

          {/* EXPIRING SOON CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">EXPIRING SOON</div>
            <div className="space-y-2">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
                <div className="font-black text-amber-900 text-xs">FAT / Heavy Vehicle Card</div>
                <div className="text-[11px] text-amber-700 font-medium">Expires: 30 Jun 2025 (31 days left)</div>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
                <div className="font-black text-amber-900 text-xs">Chain of Responsibility</div>
                <div className="text-[11px] text-amber-700 font-medium">Expires: 05 Jul 2025 (36 days left)</div>
              </div>
            </div>
            <button 
              onClick={() => setFilterCategory('EXPIRING_SOON')}
              className="w-full text-center text-xs font-extrabold text-indigo-600 hover:text-indigo-800 pt-1 cursor-pointer block"
            >
              View All
            </button>
          </div>

          {/* EXPIRED DOCUMENTS ALERT BOX */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">EXPIRED DOCUMENTS</div>
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl space-y-1 text-rose-900">
              <div className="font-black text-xs">Dangerous Goods Licence</div>
              <div className="text-[11px] text-rose-700 font-medium">Expired: 15 May 2025 (14 days overdue) 🔴</div>
            </div>
            <button 
              onClick={() => setFilterCategory('EXPIRED')}
              className="w-full text-center text-xs font-extrabold text-rose-600 hover:text-rose-800 pt-1 cursor-pointer block"
            >
              View All
            </button>
          </div>

          {/* QUICK ACTIONS PANEL */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">QUICK ACTIONS</div>
            <div className="space-y-2">
              <button onClick={() => setUploadModalOpen(true)} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📤 Upload Document</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => setFilterCategory('EXPIRING_SOON')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📅 Check Expiry Dates</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => setFilterCategory('EXPIRED')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">⚠️ View Expired Docs</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => triggerToast('All docs downloaded!')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📥 Download All Docs</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => setShareAdminModalOpen(true)} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors border border-slate-200">
                <span className="flex items-center gap-2">📤 Share with Admin</span>
                <FiChevronRight className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* HELP & RESOURCES */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 text-xs">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HELP & RESOURCES</div>
            <div className="space-y-2 font-semibold text-slate-700">
              <button onClick={() => triggerToast('Opening Document Requirements Guide...')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">📖 Document Requirements</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => triggerToast('Opening Compliance Guide...')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">🛡️ Compliance Guide</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => triggerToast('Opening Upload Guide...')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">📤 Upload Guide</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => triggerToast('Opening Regulatory Links...')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">🔗 Regulatory Links</span>
                <FiChevronRight className="text-slate-400" />
              </button>
              <button onClick={() => triggerToast('Connecting to Support...')} className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between cursor-pointer border border-slate-200">
                <span className="flex items-center gap-2">📞 Contact Support</span>
                <FiChevronRight className="text-slate-400" />
              </button>
            </div>
          </div>

        </div>

      </div>


      {/* UPLOAD DOCUMENT MODAL */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <form onSubmit={handleUploadSubmit} className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiUpload className="text-indigo-600 text-lg" />
                Upload New Document
              </h3>
              <button type="button" onClick={() => setUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Medical Certificate 2025"
                  value={uploadDocName}
                  onChange={(e) => setUploadDocName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                >
                  <option value="Personal">Personal Credentials</option>
                  <option value="Compliance">Compliance & OH&S</option>
                  <option value="Vehicle">Vehicle Permits</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Expiration Date (Optional)</label>
                <input
                  type="date"
                  value={uploadExpiry}
                  onChange={(e) => setUploadExpiry(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Select File (PDF, JPG, PNG)</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-4 rounded-xl text-center cursor-pointer hover:bg-indigo-100/50 transition-colors"
                >
                  {selectedFile ? (
                    <span className="text-emerald-700 font-black">{selectedFile.name}</span>
                  ) : (
                    <span className="text-slate-600">Click to choose file from device</span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#ffcc00] hover:bg-[#e6b800] text-black font-black text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md mt-2"
            >
              Upload & Save Document
            </button>
          </form>
        </div>
      )}

      {/* VIEW DOCUMENT DETAILS MODAL */}
      {viewDocModalOpen && selectedDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiFileText className="text-indigo-600 text-lg" />
                Document Details
              </h3>
              <button onClick={() => setViewDocModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-black text-slate-900 text-sm">{selectedDoc.name}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${selectedDoc.statusColor}`}>
                  {selectedDoc.status}
                </span>
              </div>
              <div className="text-slate-600 font-semibold">Expiration: {selectedDoc.expiry}</div>
              <div className="text-slate-400 font-mono text-[10px]">Type: {selectedDoc.type} • Verified</div>
            </div>

            <div className="border border-slate-200 bg-slate-100 rounded-2xl h-48 flex items-center justify-center text-slate-400 text-xs font-mono">
              [ OFFICIAL DOCUMENT SCAN PREVIEW ]
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setViewDocModalOpen(false);
                  triggerToast(`Downloading ${selectedDoc.name}...`);
                }}
                className="flex-1 bg-indigo-600 text-white font-black text-xs py-3 rounded-xl cursor-pointer"
              >
                Download PDF
              </button>
              <button
                onClick={() => setViewDocModalOpen(false)}
                className="flex-1 bg-slate-200 text-slate-800 font-black text-xs py-3 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPLIANCE REPORT MODAL */}
      {complianceReportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiAward className="text-emerald-600 text-lg" />
                Driver Compliance Status Report
              </h3>
              <button onClick={() => setComplianceReportModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-emerald-900 space-y-1">
                <div className="font-black text-sm">Overall Status: Compliant 🟢 ({compliancePercentage}%)</div>
                <div className="text-emerald-700 text-[11px]">8 of 11 required documents are valid and up to date.</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                <div className="font-black text-slate-900">Summary Breakdown:</div>
                <div className="space-y-1 text-[11px] font-bold text-slate-700">
                  <div className="flex justify-between"><span>Valid Documents:</span><span className="text-emerald-600 font-black">{validCount}</span></div>
                  <div className="flex justify-between"><span>Expiring Soon (&lt; 30 days):</span><span className="text-amber-600 font-black">{expiringCount}</span></div>
                  <div className="flex justify-between"><span>Expired Documents:</span><span className="text-rose-600 font-black">{expiredCount}</span></div>
                  <div className="flex justify-between"><span>Uploaded:</span><span className="text-blue-600 font-black">{uploadedCount}</span></div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setComplianceReportModalOpen(false);
                triggerToast('Compliance PDF Report generated & downloaded!');
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md"
            >
              Download PDF Report
            </button>
          </div>
        </div>
      )}

      {/* SHARE WITH ADMIN MODAL */}
      {shareAdminModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[150] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <FiShare2 className="text-indigo-600 text-lg" />
                Share Compliance Dossier
              </h3>
              <button onClick={() => setShareAdminModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs font-semibold">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Admin Email / Manager</label>
                <input
                  type="email"
                  defaultValue="compliance@herologistics.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900 text-[11px]">
                A secure link with read-only access to all your 11 credentials will be sent to the safety manager.
              </div>
            </div>

            <button
              onClick={() => {
                setShareAdminModalOpen(false);
                triggerToast('Compliance dossier link sent to Fleet Admin!');
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md"
            >
              Send Secure Share Link
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// Icon helper for Cloud Upload
function FiCloudUpload(props) {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M16 16l-4-4-4 4"></path>
      <path d="M12 12v9"></path>
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
      <path d="M16 16l-4-4-4 4"></path>
    </svg>
  );
}
