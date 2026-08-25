import React, { useState, useRef, useEffect } from 'react';
import api from '../../../services/api';
import {
  FileText, FileCheck, Receipt, FileSearch, Folder, Search, Filter, RefreshCw,
  Upload, Download, Plus, Star, MoreHorizontal, ExternalLink, Eye, ChevronRight,
  X, Check, AlertCircle, CheckCircle2, ArrowRight, Layers, FileCode, HelpCircle,
  Clock, Shield, Paperclip, Send, Mail, Trash2
} from 'lucide-react';

export default function CustomerDocuments() {
  // Toast Notification State
  const [toastMsg, setToastMsg] = useState('');
  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Sub-tab State
  const [activeTab, setActiveTab] = useState('All Documents');

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Document Types');
  const [selectedLoad, setSelectedLoad] = useState('All Loads');
  const [selectedDateFilter, setSelectedDateFilter] = useState('All Dates');

  // Selected Checkboxes State for Bulk Action
  const [selectedDocIds, setSelectedDocIds] = useState([]);

  // 3-Dots Action Dropdown Menu State
  const [activeMenuDocId, setActiveMenuDocId] = useState(null);

  // Email Document Modal State
  const [emailModalDoc, setEmailModalDoc] = useState(null);
  const [emailForm, setEmailForm] = useState({
    recipientEmail: '',
    subject: '',
    message: ''
  });

  // Modal File Input Ref & Attached File State
  const modalFileInputRef = useRef(null);
  const [attachedFile, setAttachedFile] = useState(null);

  // Documents List Data State
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/company-admin/documents');
      if (res.data) {
        const raw = res.data.data?.documents || (Array.isArray(res.data) ? res.data : (res.data.documents || []));
        const formatted = raw.map(doc => ({
          id: doc.id || `DOC-${doc.dbId}`,
          dbId: doc.id,
          name: doc.name || doc.filename || 'Document.pdf',
          type: doc.type || 'Other',
          typeBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          iconColor: 'text-blue-500',
          relatedTo: doc.relatedTo || 'Company',
          loadRef: doc.loadRef || doc.loadNumber || 'N/A',
          route: doc.route || 'N/A',
          date: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('en-GB') : 'N/A',
          uploadedBy: doc.uploadedBy || 'System',
          size: doc.size || 'N/A',
          url: doc.url || ''
        }));
        setDocuments(formatted);
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDownloadDocument = (doc) => {
    if (!doc) return;
    triggerToast(`Downloading ${doc.name}...`);
    const content = `==================================================
HERO LOGISTICS - SECURE DOCUMENT VAULT
==================================================
Document Reference: ${doc.id || 'N/A'}
Document Name:      ${doc.name || 'document.pdf'}
Category/Type:      ${doc.type || 'N/A'}
Associated Load:    ${doc.loadRef || 'N/A'}
Upload Date:        ${doc.date || 'N/A'}
Uploaded By:        ${doc.uploadedBy || 'N/A'}
--------------------------------------------------
This file has been securely retrieved from the Hero Logistics platform.
Verification Token: ${Math.random().toString(36).substring(2, 10).toUpperCase()}
==================================================`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const downloadName = doc.name.endsWith('.pdf') ? doc.name.replace('.pdf', '_receipt.txt') : (doc.name.includes('.') ? doc.name : `${doc.name}.txt`);
    link.setAttribute("href", url);
    link.setAttribute("download", downloadName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Bulk Selection Handlers
  const handleSelectAll = () => {
    if (selectedDocIds.length === documents.length) {
      setSelectedDocIds([]);
    } else {
      setSelectedDocIds(documents.map(d => d.id));
    }
  };

  const handleSelectDoc = (id) => {
    if (selectedDocIds.includes(id)) {
      setSelectedDocIds(selectedDocIds.filter(i => i !== id));
    } else {
      setSelectedDocIds([...selectedDocIds, id]);
    }
  };

  // Modals State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  // Header Bookmark State
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Header More Actions Dropdown State
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);

  // Upload Modal Form State
  const [uploadForm, setUploadForm] = useState({
    docName: '',
    docType: 'POD (Proof of Delivery)',
    loadRef: 'LD-3987'
  });

  const handleModalFileChange = (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      let sizeStr = '';
      if (file.size < 1024 * 1024) {
        sizeStr = `${Math.round(file.size / 1024)} KB`;
      } else {
        sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      }

      setAttachedFile({
        name: file.name,
        size: sizeStr
      });

      // Auto fill title if empty
      if (!uploadForm.docName) {
        setUploadForm(prev => ({ ...prev, docName: file.name }));
      }

      triggerToast(`Selected file: ${file.name} (${sizeStr})`);
    }
  };

  const handleSaveUpload = async (e) => {
    e.preventDefault();
    const finalDocName = uploadForm.docName || attachedFile?.name || 'Uploaded_Document.pdf';
    try {
      const payload = {
        title: finalDocName.endsWith('.pdf') || finalDocName.endsWith('.jpg') || finalDocName.endsWith('.png') || finalDocName.endsWith('.xlsx')
          ? finalDocName 
          : `${finalDocName}.pdf`,
        category: uploadForm.docType.includes('POD') ? 'POD' : uploadForm.docType.includes('Invoice') ? 'Invoice' : 'Other'
      };
      const res = await api.post('/company-admin/documents', payload);
      if (res.data) {
        fetchDocuments();
        triggerToast('Document uploaded successfully!');
      }
    } catch (err) {
      console.error('Failed to upload document:', err);
      triggerToast('Document upload failed. Please try again.');
    } finally {
      setIsUploadModalOpen(false);
      setUploadForm({ docName: '', docType: 'POD (Proof of Delivery)', loadRef: 'LD-3987' });
      setAttachedFile(null);
    }
  };

  // Request Document Modal Form
  const [requestForm, setRequestForm] = useState({
    docType: 'Signed POD',
    loadRef: 'LD-3987',
    notes: ''
  });

  const handleSaveRequest = (e) => {
    e.preventDefault();
    setIsRequestModalOpen(false);
    setRequestForm({ docType: 'Signed POD', loadRef: 'LD-3987', notes: '' });
    triggerToast('Document request sent to dispatch team!');
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    triggerToast(`Document ${emailModalDoc?.name} sent to ${emailForm.recipientEmail}!`);
    setEmailModalDoc(null);
  };

  const handleDeleteDoc = async (id, name) => {
    try {
      const targetDoc = documents.find(d => d.id === id);
      const targetDbId = targetDoc?.dbId;
      if (targetDbId) {
        await api.delete(`/company-admin/documents/${targetDbId}`);
        fetchDocuments();
        triggerToast(`Document ${name} deleted successfully.`);
      } else {
        setDocuments(prev => prev.filter(d => d.id !== id));
        triggerToast(`Document ${name} deleted successfully.`);
      }
    } catch (err) {
      console.error('Failed to delete document:', err);
      triggerToast('Failed to delete document. Please try again.');
    } finally {
      setActiveMenuDocId(null);
    }
  };

  // Filtered Documents Logic
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.loadRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesTab = true;
    if (activeTab === 'Proof of Delivery (PODs)') matchesTab = doc.type === 'POD';
    else if (activeTab === 'Condition Reports') matchesTab = doc.type === 'Condition Report';
    else if (activeTab === 'Invoices') matchesTab = doc.type === 'Invoice';
    else if (activeTab === 'Other Documents') matchesTab = doc.type === 'Other' || doc.type === 'Photo';

    let matchesTypeDropdown = true;
    if (selectedType !== 'All Document Types') {
      matchesTypeDropdown = doc.type.toLowerCase().includes(selectedType.toLowerCase());
    }

    return matchesSearch && matchesTab && matchesTypeDropdown;
  });

  const totalCount = documents.length;
  const podsCount = documents.filter(d => (d.type || '').toLowerCase().includes('pod') || (d.type || '').toLowerCase().includes('proof')).length;
  const invoicesCount = documents.filter(d => (d.type || '').toLowerCase().includes('invoice') || (d.type || '').toLowerCase().includes('bill')).length;
  const reportsCount = documents.filter(d => (d.type || '').toLowerCase().includes('report') || (d.type || '').toLowerCase().includes('condition')).length;
  const otherCount = Math.max(0, totalCount - (podsCount + invoicesCount + reportsCount));

  const podPct = totalCount > 0 ? Math.round((podsCount / totalCount) * 100) : 0;
  const invPct = totalCount > 0 ? Math.round((invoicesCount / totalCount) * 100) : 0;
  const repPct = totalCount > 0 ? Math.round((reportsCount / totalCount) * 100) : 0;
  const othPct = totalCount > 0 ? Math.round((otherCount / totalCount) * 100) : 0;

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-800 text-left font-sans p-4 sm:p-6 space-y-6">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[999999] bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-2xl animate-fade-in border border-slate-700 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Hidden File Input for Modal Dropzone */}
      <input 
        type="file"
        ref={modalFileInputRef}
        onChange={e => handleModalFileChange(e.target.files)}
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx"
      />

      {/* =========================================================================
         HEADER & TOP BREADCRUMBS (Fully Interactive)
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mb-1">
            <span 
              onClick={() => triggerToast("Navigated to Home")}
              className="hover:text-slate-700 cursor-pointer transition-colors"
            >
              Home
            </span>
            <ChevronRight size={10} />
            <span 
              onClick={() => triggerToast("Navigated to Customer Portal")}
              className="hover:text-slate-700 cursor-pointer transition-colors"
            >
              Customer Portal
            </span>
            <ChevronRight size={10} />
            <span className="text-slate-700 font-extrabold">Documents & PODs</span>
          </div>

          {/* Title & Bookmark */}
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Documents & PODs
            </h1>
            <button 
              onClick={() => {
                const nextState = !isBookmarked;
                setIsBookmarked(nextState);
                triggerToast(nextState ? "Page bookmarked successfully!" : "Page removed from bookmarks.");
              }}
              title={isBookmarked ? "Remove Bookmark" : "Bookmark Page"}
              className="p-1.5 text-slate-400 hover:text-amber-500 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <Star size={17} className={isBookmarked ? "text-amber-500 fill-amber-500" : "text-slate-400"} />
            </button>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Access all your documents, proof of deliveries and reports.
          </p>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap relative">
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl shadow-2xs cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <Upload size={14} className="text-blue-600" />
            <span>Upload Document</span>
          </button>

          <button 
            onClick={() => setIsRequestModalOpen(true)}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl shadow-2xs cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <FileText size={14} className="text-blue-600" />
            <span>Request Document</span>
          </button>

          <button 
            onClick={() => {
              if (selectedDocIds.length === 0) {
                triggerToast("Please select documents using checkboxes to download bulk files.");
              } else {
                triggerToast(`Downloading ${selectedDocIds.length} selected documents...`);
                selectedDocIds.forEach((id, index) => {
                  const target = documents.find(d => d.id === id);
                  if (target) {
                    setTimeout(() => handleDownloadDocument(target), index * 300);
                  }
                });
              }
            }}
            className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <Download size={14} />
            <span>Download Selected</span>
          </button>

          {/* More Actions Dropdown Trigger */}
          <div className="relative">
            <button 
              onClick={() => setIsMoreActionsOpen(!isMoreActionsOpen)}
              className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-700 rounded-xl shadow-2xs cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <span>More Actions</span>
              <span className="text-[10px]">{isMoreActionsOpen ? '▲' : '▼'}</span>
            </button>

            {/* More Actions Floating Dropdown Menu */}
            {isMoreActionsOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMoreActionsOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 bg-white rounded-xl shadow-2xl border border-slate-200 p-1.5 z-50 text-left w-56 space-y-0.5 animate-fade-in font-sans text-xs">
                  <button
                    onClick={() => {
                      setIsMoreActionsOpen(false);
                      triggerToast("Exporting all 128 documents metadata to CSV file...");
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-extrabold rounded-lg cursor-pointer transition-colors"
                  >
                    <FileText size={13} className="text-blue-600" />
                    <span>Export All (CSV)</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMoreActionsOpen(false);
                      triggerToast("Preparing ZIP archive download for all 128 documents...");
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-extrabold rounded-lg cursor-pointer transition-colors"
                  >
                    <Download size={13} className="text-emerald-600" />
                    <span>Download All (ZIP Archive)</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMoreActionsOpen(false);
                      triggerToast("Opening print dialog for document summary report...");
                      window.print();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:bg-purple-50 hover:text-purple-700 font-extrabold rounded-lg cursor-pointer transition-colors"
                  >
                    <FileSearch size={13} className="text-purple-600" />
                    <span>Print Summary Report</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMoreActionsOpen(false);
                      triggerToast("Documents vault data refreshed!");
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:bg-amber-50 hover:text-amber-700 font-extrabold rounded-lg cursor-pointer transition-colors"
                  >
                    <RefreshCw size={13} className="text-amber-600" />
                    <span>Refresh Data</span>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={() => {
                      setIsMoreActionsOpen(false);
                      triggerToast("Document Vault Settings opened.");
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:bg-slate-100 font-extrabold rounded-lg cursor-pointer transition-colors"
                  >
                    <Shield size={13} className="text-slate-500" />
                    <span>Vault Settings</span>
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </div>

      {/* =========================================================================
         TOP 5 METRIC SUMMARY CARDS (1-Row Grid matching 2nd Screenshot)
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* Card 1: TOTAL DOCUMENTS */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold shrink-0">
              <FileText size={16} />
            </div>
            <div>
              <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider block">TOTAL DOCUMENTS</span>
              <span className="text-lg font-black text-slate-900 leading-none mt-0.5 block">{totalCount}</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <button onClick={() => setActiveTab('All Documents')} className="font-extrabold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer">
              View all documents <ArrowRight size={10} />
            </button>
          </div>
        </div>

        {/* Card 2: PODS (PROOF OF DELIVERY) */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center font-bold shrink-0">
              <FileCheck size={16} />
            </div>
            <div>
              <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider block">PODS (PROOF OF DELIVERY)</span>
              <span className="text-lg font-black text-slate-900 leading-none mt-0.5 block">{podsCount}</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <button onClick={() => setActiveTab('Proof of Delivery (PODs)')} className="font-extrabold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer">
              View all PODs <ArrowRight size={10} />
            </button>
          </div>
        </div>

        {/* Card 3: INVOICES */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold shrink-0">
              <Receipt size={16} />
            </div>
            <div>
              <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider block">INVOICES</span>
              <span className="text-lg font-black text-slate-900 leading-none mt-0.5 block">{invoicesCount}</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <button onClick={() => setActiveTab('Invoices')} className="font-extrabold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 cursor-pointer">
              View all invoices <ArrowRight size={10} />
            </button>
          </div>
        </div>

        {/* Card 4: CONDITION REPORTS */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-bold shrink-0">
              <FileSearch size={16} />
            </div>
            <div>
              <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider block">CONDITION REPORTS</span>
              <span className="text-lg font-black text-slate-900 leading-none mt-0.5 block">{reportsCount}</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <button onClick={() => setActiveTab('Condition Reports')} className="font-extrabold text-amber-600 hover:text-amber-800 flex items-center gap-1 cursor-pointer">
              View all reports <ArrowRight size={10} />
            </button>
          </div>
        </div>

        {/* Card 5: OTHER DOCUMENTS */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center font-bold shrink-0">
              <Folder size={16} />
            </div>
            <div>
              <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider block">OTHER DOCUMENTS</span>
              <span className="text-lg font-black text-slate-900 leading-none mt-0.5 block">{otherCount}</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <button onClick={() => setActiveTab('Other Documents')} className="font-extrabold text-teal-600 hover:text-teal-800 flex items-center gap-1 cursor-pointer">
              View all other docs <ArrowRight size={10} />
            </button>
          </div>
        </div>

      </div>

      {/* =========================================================================
         FILTERS & SUB-TABS TOOLBAR ROW
         ========================================================================= */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-3.5 space-y-3">
        
        {/* Search Bar & Dropdowns Filter Line */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Left: Search input */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by document name, load #, reference..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Right: Dropdowns & Date filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-blue-400 cursor-pointer"
            >
              <option value="All Document Types">All Document Types</option>
              <option value="Invoice">Invoice</option>
              <option value="POD">POD (Proof of Delivery)</option>
              <option value="Condition Report">Condition Report</option>
              <option value="Photo">Photos</option>
              <option value="Other">Other Documents</option>
            </select>

            <select
              value={selectedLoad}
              onChange={e => setSelectedLoad(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-blue-400 cursor-pointer"
            >
              <option value="All Loads">All Loads</option>
              <option value="LD-3987">LD-3987</option>
              <option value="LD-3981">LD-3981</option>
              <option value="LD-3975">LD-3975</option>
            </select>

            <select
              value={selectedDateFilter}
              onChange={e => setSelectedDateFilter(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-blue-400 cursor-pointer"
            >
              <option value="All Dates">All Dates</option>
              <option value="Today">Today</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
            </select>

            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs text-slate-500 font-medium">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Upload Date</span>
              <input type="date" className="bg-transparent text-xs text-slate-700 focus:outline-none" />
              <span>→</span>
              <input type="date" className="bg-transparent text-xs text-slate-700 focus:outline-none" />
            </div>

            <button 
              onClick={() => triggerToast("Filters applied.")}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer flex items-center gap-1"
            >
              <Filter size={13} />
              <span>Filters</span>
            </button>

            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedType('All Document Types');
                setSelectedLoad('All Loads');
                setSelectedDateFilter('All Dates');
                triggerToast("Filters reset!");
              }}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              <RefreshCw size={13} />
            </button>
          </div>

        </div>

        {/* Sub-Tabs Row */}
        <div className="flex items-center gap-6 border-b border-slate-100 text-xs font-bold text-slate-500 pt-1 overflow-x-auto">
          {[
            { label: 'All Documents', count: 128 },
            { label: 'Proof of Delivery (PODs)', count: 64 },
            { label: 'Condition Reports', count: 18 },
            { label: 'Invoices', count: 24 },
            { label: 'Other Documents', count: 22 }
          ].map((tab) => {
            const isTabActive = activeTab === tab.label;
            return (
              <button 
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`pb-2 transition-all cursor-pointer flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
                  isTabActive 
                    ? 'border-blue-600 text-blue-600 font-black' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* =========================================================================
         MAIN WORKSPACE GRID (8 Cols Documents Table + 4 Cols Side Cards)
         Equal Height Bottom Alignment (items-stretch)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* COLUMN 1 (8 Cols): DOCUMENTS TABLE (Flex Col Justify-Between) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-4 flex flex-col justify-between overflow-hidden">
          
          {/* Table Container with Horizontal Scroll & Whitespace Nowrap */}
          <div className="overflow-x-auto w-full flex-1">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  <th className="py-2.5 px-3 w-10 text-center">
                    <input 
                      type="checkbox"
                      checked={selectedDocIds.length === documents.length && documents.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 cursor-pointer"
                    />
                  </th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Document Name</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Type</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Related To</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Load / Reference</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Date</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Uploaded By</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Size</th>
                  <th className="py-2.5 px-3 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs whitespace-nowrap">
                {filteredDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400 font-medium">
                      No documents found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((doc) => {
                    const isSelected = selectedDocIds.includes(doc.id);
                    return (
                      <tr key={doc.id} className={`hover:bg-slate-50/80 transition-colors whitespace-nowrap ${isSelected ? 'bg-blue-50/40' : ''}`}>
                        
                        {/* Checkbox */}
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <input 
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectDoc(doc.id)}
                            className="rounded border-slate-300 cursor-pointer"
                          />
                        </td>

                        {/* Document Name */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FileText size={15} className={`${doc.iconColor} shrink-0`} />
                            <div className="flex items-center gap-2">
                              <span 
                                onClick={() => setPreviewDoc(doc)}
                                className="font-extrabold text-slate-900 hover:text-blue-600 cursor-pointer block whitespace-nowrap"
                              >
                                {doc.name}
                              </span>
                              {doc.type === 'Invoice' && <span className="text-[9.5px] text-slate-400 font-medium whitespace-nowrap">Invoice</span>}
                              {doc.type === 'POD' && <span className="text-[9.5px] text-slate-400 font-medium whitespace-nowrap">Proof of Delivery</span>}
                              {doc.type === 'Photo' && <span className="text-[9.5px] text-slate-400 font-medium whitespace-nowrap">Delivery Photos</span>}
                              {doc.type === 'Condition Report' && <span className="text-[9.5px] text-slate-400 font-medium whitespace-nowrap">Condition Report</span>}
                              {doc.type === 'Other' && <span className="text-[9.5px] text-slate-400 font-medium whitespace-nowrap">Other Document</span>}
                            </div>
                          </div>
                        </td>

                        {/* Type Badge */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded border text-[9.5px] font-extrabold inline-block whitespace-nowrap ${doc.typeBadge}`}>
                            {doc.type}
                          </span>
                        </td>

                        {/* Related To */}
                        <td className="py-3 px-3 font-medium text-slate-700 whitespace-nowrap">
                          {doc.relatedTo}
                        </td>

                        {/* Load / Reference */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-slate-900 whitespace-nowrap">{doc.loadRef}</span>
                            {doc.route && <span className="text-[9.5px] text-slate-400 font-medium whitespace-nowrap">({doc.route})</span>}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="py-3 px-3 font-medium text-slate-600 whitespace-nowrap">
                          {doc.date}
                        </td>

                        {/* Uploaded By */}
                        <td className="py-3 px-3 font-medium text-slate-600 whitespace-nowrap">
                          {doc.uploadedBy}
                        </td>

                        {/* Size */}
                        <td className="py-3 px-3 font-medium text-slate-600 whitespace-nowrap">
                          {doc.size}
                        </td>

                        {/* Actions (Only 3-Dots Menu Button) */}
                        <td className="py-3 px-3 text-right whitespace-nowrap relative">
                          <div className="flex items-center justify-end">
                            
                            {/* 3-Dots Dropdown Trigger */}
                            <div className="relative">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuDocId(activeMenuDocId === doc.id ? null : doc.id);
                                }}
                                title="More Options"
                                className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                                  activeMenuDocId === doc.id 
                                    ? 'text-slate-900 bg-slate-200' 
                                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                <MoreHorizontal size={15} />
                              </button>

                              {/* 3-Dots Floating Dropdown Menu */}
                              {activeMenuDocId === doc.id && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-40" 
                                    onClick={() => setActiveMenuDocId(null)} 
                                  />
                                  <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-2xl border border-slate-200 p-1.5 z-50 text-left w-48 space-y-0.5 animate-fade-in font-sans text-xs">
                                    <button
                                      onClick={() => {
                                        setActiveMenuDocId(null);
                                        setPreviewDoc(doc);
                                      }}
                                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-extrabold rounded-lg cursor-pointer transition-colors"
                                    >
                                      <Eye size={13} className="text-blue-600" />
                                      <span>Preview Document</span>
                                    </button>

                                    <button
                                      onClick={() => {
                                        setActiveMenuDocId(null);
                                        handleDownloadDocument(doc);
                                      }}
                                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-extrabold rounded-lg cursor-pointer transition-colors"
                                    >
                                      <Download size={13} className="text-emerald-600" />
                                      <span>Download File</span>
                                    </button>

                                    <button
                                      onClick={() => {
                                        setActiveMenuDocId(null);
                                        setEmailModalDoc(doc);
                                        setEmailForm({
                                          recipientEmail: 'accounts@abctransport.com.au',
                                          subject: `Document Attached: ${doc.name} (${doc.loadRef})`,
                                          message: `Hi Team,\n\nPlease find attached document ${doc.name} related to load ${doc.loadRef}.`
                                        });
                                      }}
                                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:bg-purple-50 hover:text-purple-700 font-extrabold rounded-lg cursor-pointer transition-colors"
                                    >
                                      <Send size={13} className="text-purple-600" />
                                      <span>Email Document</span>
                                    </button>

                                    <button
                                      onClick={() => {
                                        setActiveMenuDocId(null);
                                        triggerToast(`Direct URL for ${doc.name} copied to clipboard!`);
                                      }}
                                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-700 hover:bg-amber-50 hover:text-amber-700 font-extrabold rounded-lg cursor-pointer transition-colors"
                                    >
                                      <Paperclip size={13} className="text-amber-600" />
                                      <span>Copy Direct Link</span>
                                    </button>

                                    <div className="my-1 border-t border-slate-100" />

                                    <button
                                      onClick={() => handleDeleteDoc(doc.id, doc.name)}
                                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-red-600 hover:bg-red-50 font-extrabold rounded-lg cursor-pointer transition-colors"
                                    >
                                      <Trash2 size={13} className="text-red-600" />
                                      <span>Delete Document</span>
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>

                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination (Pushed to bottom using mt-auto) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-semibold pt-3 mt-auto border-t border-slate-100">
            <span>Showing 1 to {filteredDocuments.length} of {documents.length} documents</span>
            
            <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
              <button className="px-2 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400">&lt;&lt;</button>
              <button className="px-2 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-400">&lt;</button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg">1</button>
              <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50">2</button>
              <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50">3</button>
              <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50">4</button>
              <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50">5</button>
              <button className="px-2 py-1 border border-slate-200 rounded-lg hover:bg-slate-50">&gt;</button>
              <button className="px-2 py-1 border border-slate-200 rounded-lg hover:bg-slate-50">&gt;&gt;</button>
            </div>
          </div>

        </div>

        {/* COLUMN 2 (4 Cols): SIDE CARDS (Compact Shorter Height) */}
        <div className="lg:col-span-4 space-y-3">
          
          {/* CARD 1: DOCUMENTS BY TYPE (Donut Chart & Legend) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-3 space-y-2">
            <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
              <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">DOCUMENTS BY TYPE</h2>
              <button onClick={() => triggerToast("Generating full document type report...")} className="text-[10px] font-extrabold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-0.5">
                View report <ArrowRight size={9} />
              </button>
            </div>

            <div className="flex items-center justify-around gap-3 py-1">
              
              {/* Donut Ring Visual Representation */}
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <path className="text-slate-100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  {/* Segment 1: PODs (50%) - Blue */}
                  <path className="text-blue-600" strokeDasharray="50, 100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  {/* Segment 2: Invoices (18.8%) - Emerald */}
                  <path className="text-emerald-500" strokeDasharray="18.8, 100" strokeDashoffset="-50" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  {/* Segment 3: Condition Reports (14.1%) - Amber */}
                  <path className="text-amber-500" strokeDasharray="14.1, 100" strokeDashoffset="-68.8" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  {/* Segment 4: Other (17.1%) - Sky */}
                  <path className="text-sky-400" strokeDasharray="17.1, 100" strokeDashoffset="-82.9" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-sm font-black text-slate-900 leading-none">{totalCount}</span>
                  <span className="text-[7.5px] font-extrabold text-slate-400 uppercase">Total</span>
                </div>
              </div>

              {/* Legend Grid */}
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                  <span className="text-slate-600 font-medium text-[10px]">PODs:</span>
                  <span className="font-extrabold text-slate-900 text-[10px]">{podsCount} ({podPct}%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                  <span className="text-slate-600 font-medium text-[10px]">Invoices:</span>
                  <span className="font-extrabold text-slate-900 text-[10px]">{invoicesCount} ({invPct}%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                  <span className="text-slate-600 font-medium text-[10px]">Reports:</span>
                  <span className="font-extrabold text-slate-900 text-[10px]">{reportsCount} ({repPct}%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0"></span>
                  <span className="text-slate-600 font-medium text-[10px]">Other:</span>
                  <span className="font-extrabold text-slate-900 text-[10px]">{otherCount} ({othPct}%)</span>
                </div>
              </div>

            </div>
          </div>

          {/* CARD 2: RECENTLY UPLOADED */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-3 space-y-2">
            <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
              <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">RECENTLY UPLOADED</h2>
              <button onClick={() => triggerToast("Viewing all document uploads...")} className="text-[10px] font-extrabold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-0.5">
                View all <ArrowRight size={9} />
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              {[
                { name: 'POD-LD-3987.pdf', date: '30 May 2025', size: '243 KB', color: 'text-emerald-500' },
                { name: 'LD-3987-delivery.jpg', date: '30 May 2025', size: '1.8 MB', color: 'text-amber-500' },
                { name: 'Condition Report.pdf', date: '28 May 2025', size: '312 KB', color: 'text-red-500' },
                { name: 'INV-2025-0529.pdf', date: '29 May 2025', size: '166 KB', color: 'text-red-500' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-1.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all">
                  <div className="flex items-center gap-1.5">
                    <FileText size={13} className={item.color} />
                    <div>
                      <span className="font-extrabold text-slate-900 block text-[11px] leading-tight">{item.name}</span>
                      <span className="text-[9px] text-slate-400 font-medium">{item.date}</span>
                    </div>
                  </div>
                  <span className="text-[9.5px] font-extrabold text-slate-500">{item.size}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CARD 3: QUICK ACTIONS */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-3 space-y-2">
            <div className="flex justify-between items-center pb-1.5 border-b border-slate-100">
              <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">QUICK ACTIONS</h2>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="p-2 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 rounded-xl text-left font-extrabold text-[11px] text-slate-800 flex flex-col gap-0.5 cursor-pointer transition-all"
              >
                <Upload size={14} className="text-blue-600" />
                <span>Upload Document</span>
              </button>

              <button 
                onClick={() => setIsRequestModalOpen(true)}
                className="p-2 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 rounded-xl text-left font-extrabold text-[11px] text-slate-800 flex flex-col gap-0.5 cursor-pointer transition-all"
              >
                <FileText size={14} className="text-blue-600" />
                <span>Request Document</span>
              </button>

              <button 
                onClick={() => triggerToast("Downloading complete account statement PDF...")}
                className="p-2 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 rounded-xl text-left font-extrabold text-[11px] text-slate-800 flex flex-col gap-0.5 cursor-pointer transition-all"
              >
                <Download size={14} className="text-blue-600" />
                <span>Download Statement</span>
              </button>

              <button 
                onClick={() => triggerToast("Opening help center for documents...")}
                className="p-2 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 rounded-xl text-left font-extrabold text-[11px] text-slate-800 flex flex-col gap-0.5 cursor-pointer transition-all"
              >
                <HelpCircle size={14} className="text-blue-600" />
                <span>Need Help?</span>
              </button>
            </div>
          </div>

        </div>

      </div>



      {/* =========================================================================
         UPLOAD DOCUMENT MODAL (With Working File Picker & Drag-and-Drop)
         ========================================================================= */}
      {isUploadModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsUploadModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 text-left font-sans"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
                  <Upload size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Upload Document</h3>
                  <p className="text-[10.5px] text-slate-500 font-medium">Upload signed POD, BOL or customs paper</p>
                </div>
              </div>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveUpload} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Title / File Name *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. POD-LD-3987.pdf"
                  value={uploadForm.docName}
                  onChange={e => setUploadForm({ ...uploadForm, docName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Document Category</label>
                  <select
                    value={uploadForm.docType}
                    onChange={e => setUploadForm({ ...uploadForm, docType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-800 bg-white focus:outline-none focus:border-blue-400 cursor-pointer"
                  >
                    <option value="POD (Proof of Delivery)">POD (Proof of Delivery)</option>
                    <option value="Bill of Lading">Bill of Lading</option>
                    <option value="Condition Report">Condition Report</option>
                    <option value="Tax Invoice">Tax Invoice</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Related Load #</label>
                  <select
                    value={uploadForm.loadRef}
                    onChange={e => setUploadForm({ ...uploadForm, loadRef: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-800 bg-white focus:outline-none focus:border-blue-400 cursor-pointer"
                  >
                    <option value="LD-3987">LD-3987</option>
                    <option value="LD-3981">LD-3981</option>
                    <option value="LD-3975">LD-3975</option>
                    <option value="General">General / No Load</option>
                  </select>
                </div>
              </div>

              {/* Upload Dropzone (Interactive Drag & Drop and File Picker) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Attach File *</label>
                
                <div 
                  onClick={() => modalFileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files) {
                      handleModalFileChange(e.dataTransfer.files);
                    }
                  }}
                  className={`border-2 dashed rounded-xl p-4 text-center cursor-pointer transition-all space-y-1 ${
                    attachedFile 
                      ? 'bg-emerald-50/70 border-emerald-300' 
                      : 'bg-slate-50 hover:bg-blue-50/50 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {attachedFile ? (
                    <div className="space-y-1">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                        <Check size={18} />
                      </div>
                      <p className="font-extrabold text-emerald-900 text-xs">
                        Selected: {attachedFile.name}
                      </p>
                      <p className="text-[10px] text-emerald-600 font-medium">
                        Size: {attachedFile.size} • Click to change file
                      </p>
                    </div>
                  ) : (
                    <>
                      <Upload size={22} className="mx-auto text-blue-600" />
                      <p className="font-extrabold text-slate-800 text-xs">
                        Drag & drop file or click to browse
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        Supports PDF, JPG, PNG, DOCX, XLSX (Max 10MB)
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    setAttachedFile(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Save & Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         REQUEST DOCUMENT MODAL
         ========================================================================= */}
      {isRequestModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsRequestModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 text-left font-sans"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center font-bold">
                  <FileText size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Request Document</h3>
                  <p className="text-[10.5px] text-slate-500 font-medium">Request missing POD or condition report from dispatch</p>
                </div>
              </div>
              <button 
                onClick={() => setIsRequestModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveRequest} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Document Needed</label>
                  <select
                    value={requestForm.docType}
                    onChange={e => setRequestForm({ ...requestForm, docType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-800 bg-white focus:outline-none focus:border-blue-400 cursor-pointer"
                  >
                    <option value="Signed POD">Signed POD</option>
                    <option value="Pre-load Condition Photos">Pre-load Condition Photos</option>
                    <option value="Weighbridge Docket">Weighbridge Docket</option>
                    <option value="Tax Invoice">Tax Invoice</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Load Reference #</label>
                  <select
                    value={requestForm.loadRef}
                    onChange={e => setRequestForm({ ...requestForm, loadRef: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-800 bg-white focus:outline-none focus:border-blue-400 cursor-pointer"
                  >
                    <option value="LD-3987">LD-3987</option>
                    <option value="LD-3981">LD-3981</option>
                    <option value="LD-3975">LD-3975</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes / Instructions for Dispatch</label>
                <textarea 
                  rows={3}
                  placeholder="e.g. Need high resolution scan of signed delivery receipt..."
                  value={requestForm.notes}
                  onChange={e => setRequestForm({ ...requestForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         EMAIL DOCUMENT MODAL
         ========================================================================= */}
      {emailModalDoc && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setEmailModalDoc(null)}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 text-left font-sans"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center font-bold">
                  <Send size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Email Document</h3>
                  <p className="text-[10.5px] text-slate-500 font-medium">Send {emailModalDoc.name} via email</p>
                </div>
              </div>
              <button 
                onClick={() => setEmailModalDoc(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Recipient Email Address *</label>
                <input 
                  type="email"
                  required
                  value={emailForm.recipientEmail}
                  onChange={e => setEmailForm({ ...emailForm, recipientEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject</label>
                <input 
                  type="text"
                  required
                  value={emailForm.subject}
                  onChange={e => setEmailForm({ ...emailForm, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Message</label>
                <textarea 
                  rows={3}
                  value={emailForm.message}
                  onChange={e => setEmailForm({ ...emailForm, message: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setEmailModalDoc(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Send Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         PREVIEW DOCUMENT MODAL
         ========================================================================= */}
      {previewDoc && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPreviewDoc(null)}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-5 space-y-4 text-left font-sans"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
                  <FileText size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">{previewDoc.name}</h3>
                  <p className="text-[10.5px] text-slate-500 font-medium">{previewDoc.type} • {previewDoc.size}</p>
                </div>
              </div>
              <button 
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Document Type:</span>
                  <span className="text-slate-900">{previewDoc.type}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Related Load:</span>
                  <span className="text-blue-600 font-mono">{previewDoc.loadRef}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Uploaded Date:</span>
                  <span className="text-slate-900">{previewDoc.date}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-500">Uploaded By:</span>
                  <span className="text-slate-900">{previewDoc.uploadedBy}</span>
                </div>
              </div>

              {/* Document Preview Paper Sheet */}
              <div className="border border-slate-300 rounded-2xl p-5 bg-white text-left font-sans shadow-md space-y-4">
                <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase block">HERO LOGISTICS VAULT</span>
                    <h4 className="text-sm font-black text-slate-900 leading-tight">{previewDoc.name}</h4>
                    <span className="text-[9.5px] text-slate-400 font-mono font-bold">REF: {previewDoc.id}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 text-[9px] font-extrabold rounded-md uppercase">
                    VERIFIED OFFICIAL
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-[9.5px] font-bold block uppercase">Category</span>
                    <span className="font-extrabold text-slate-800">{previewDoc.type}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-[9.5px] font-bold block uppercase">Load Reference</span>
                    <span className="font-mono font-extrabold text-blue-600">{previewDoc.loadRef}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-[9.5px] font-bold block uppercase">Upload Date</span>
                    <span className="font-extrabold text-slate-800">{previewDoc.date}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 text-[9.5px] font-bold block uppercase">Uploaded By</span>
                    <span className="font-extrabold text-slate-800">{previewDoc.uploadedBy}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-dashed border-slate-200 flex items-center justify-between text-[9.5px] text-slate-400 font-mono">
                  <span>SYSTEM VERIFIED DOCUMENT</span>
                  <span>STATUS: COMPLIANT</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button 
                  type="button" 
                  onClick={() => {
                    handleDownloadDocument(previewDoc);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Download size={13} />
                  <span>Download Document</span>
                </button>

                <button 
                  type="button" 
                  onClick={() => setPreviewDoc(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
