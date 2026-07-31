import React, { useState } from 'react';
import { 
  FileText, Search, Filter, Upload, Download, Eye, 
  ShieldCheck, Clock, Folder, ChevronRight,
  FileCheck, Building, Truck, Users, UserCheck, X, CheckCircle2, Trash2
} from 'lucide-react';

const initialMasterDocumentsData = [
  // Company Documents
  { id: 1, name: 'Company Safety SOP & Fatigue Guidelines v2.pdf', category: 'Company Documents', entity: 'Hero Logistics Pty Ltd', size: '3.1 MB', uploadedBy: 'Sophie Taylor', date: '01 May 2025', status: 'Active' },
  { id: 2, name: 'National Heavy Vehicle Accreditation (NHVA).pdf', category: 'Company Documents', entity: 'Compliance Dept', size: '1.8 MB', uploadedBy: 'Sarah Mitchell', date: '12 Jan 2025', status: 'Verified' },

  // Driver Documents
  { id: 3, name: 'Driver License HC Class - Liam Smith.pdf', category: 'Driver Documents', entity: 'Driver: Liam Smith', size: '2.4 MB', uploadedBy: 'Liam Smith', date: '15 Jan 2025', status: 'Active' },
  { id: 4, name: 'Medical Fitness Certificate - Noah Williams.pdf', category: 'Driver Documents', entity: 'Driver: Noah Williams', size: '1.1 MB', uploadedBy: 'Noah Williams', date: '10 Mar 2025', status: 'Verified' },

  // Vehicle Documents
  { id: 5, name: 'Vehicle Registration Certificate - B-DOUBLE 101.pdf', category: 'Vehicle Documents', entity: 'Vehicle: NSW-BD101', size: '850 KB', uploadedBy: 'Michael Brown', date: '01 Mar 2025', status: 'Active' },
  { id: 6, name: 'Fleet Comprehensive Insurance Policy 2025.pdf', category: 'Vehicle Documents', entity: 'Fleet Wide (50 Vehicles)', size: '5.2 MB', uploadedBy: 'Michael Brown', date: '01 Feb 2025', status: 'Active' },

  // Customer Documents
  { id: 7, name: 'Proof of Delivery (POD) - LD-2041.pdf', category: 'Customer Documents', entity: 'Customer: Acme Logistics', size: '1.2 MB', uploadedBy: 'Noah Williams (Driver)', date: '29 Jul 2025', status: 'Verified' },
  { id: 8, name: 'Master Transport Service Agreement 2025.pdf', category: 'Customer Documents', entity: 'Customer: Global Freight', size: '4.5 MB', uploadedBy: 'Sarah Mitchell', date: '10 Feb 2025', status: 'Verified' },
  { id: 9, name: 'Pricing Matrix 2025 Rate Sheet.xlsx', category: 'Customer Documents', entity: 'Strategic Accounts', size: '952 KB', uploadedBy: 'Sarah Mitchell', date: '20 May 2025', status: 'Active' },
];

export default function StandaloneDocuments() {
  const [activeCategory, setActiveCategory] = useState('All Documents');
  const [search, setSearch] = useState('');
  const [documents, setDocuments] = useState(initialMasterDocumentsData);
  
  // Modals & Notifications
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Form State
  const [newDoc, setNewDoc] = useState({
    name: '',
    category: 'Company Documents',
    entity: 'General'
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const categories = [
    { id: 'All Documents', label: 'All Documents', icon: Folder },
    { id: 'Company Documents', label: 'Company Documents', icon: Building },
    { id: 'Driver Documents', label: 'Driver Documents', icon: UserCheck },
    { id: 'Vehicle Documents', label: 'Vehicle Documents', icon: Truck },
    { id: 'Customer Documents', label: 'Customer Documents', icon: Users },
  ];

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!newDoc.name) {
      alert('Please enter a Document Title.');
      return;
    }
    const item = {
      id: Date.now(),
      name: newDoc.name.endsWith('.pdf') || newDoc.name.endsWith('.xlsx') ? newDoc.name : `${newDoc.name}.pdf`,
      category: newDoc.category,
      entity: newDoc.entity || 'Company Wide',
      size: '1.5 MB',
      uploadedBy: 'Admin',
      date: 'Today',
      status: 'Active'
    };
    setDocuments([item, ...documents]);
    setNewDoc({ name: '', category: 'Company Documents', entity: 'General' });
    setShowUploadModal(false);
    showToast(`Uploaded "${item.name}" to ${item.category}`);
  };

  const handleDownload = (doc) => {
    const element = document.createElement("a");
    const file = new Blob([`Document Content for ${doc.name}\nCategory: ${doc.category}\nEntity: ${doc.entity}\nUploaded by: ${doc.uploadedBy}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = doc.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast(`Downloaded "${doc.name}"`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this document from the vault?')) {
      setDocuments(documents.filter(d => d.id !== id));
      showToast('Document deleted');
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesCat = activeCategory === 'All Documents' || doc.category === activeCategory;
    const matchesSearch = search === '' || 
      doc.name.toLowerCase().includes(search.toLowerCase()) || 
      doc.entity.toLowerCase().includes(search.toLowerCase()) ||
      doc.uploadedBy.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-3 sm:p-6 lg:p-8 font-sans pb-24 text-slate-900 overflow-x-hidden">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[99999] bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
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
            <span>Master Document Vault & Compliance</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1 max-w-2xl leading-relaxed">
            Centralized document repository organized into <strong>Company Documents</strong>, <strong>Driver Documents</strong>, <strong>Vehicle Documents</strong>, and <strong>Customer Documents</strong>.
          </p>
        </div>

        {/* Action Button - Single Line Layout */}
        <div className="flex items-center gap-2.5 shrink-0 flex-nowrap">
          <button 
            onClick={() => setShowUploadModal(true)} 
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Upload size={16} className="shrink-0" /> 
            <span>Upload New Document</span>
          </button>
        </div>
      </div>

      {/* KPI Stats / 4 Core Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div 
          onClick={() => setActiveCategory('Company Documents')}
          className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-xs cursor-pointer transition-all ${activeCategory === 'Company Documents' ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-200/80 hover:border-blue-300'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Company Documents</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0"><Building size={16} /></div>
          </div>
          <p className="text-2xl font-black text-slate-900">SOPs & Policies</p>
          <span className="text-[10px] font-bold text-blue-600 mt-1">NHVA & Safety Certs</span>
        </div>

        <div 
          onClick={() => setActiveCategory('Driver Documents')}
          className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-xs cursor-pointer transition-all ${activeCategory === 'Driver Documents' ? 'border-purple-500 ring-2 ring-purple-500/10' : 'border-slate-200/80 hover:border-purple-300'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Driver Documents</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs shrink-0"><UserCheck size={16} /></div>
          </div>
          <p className="text-2xl font-black text-slate-900">Licenses & Meds</p>
          <span className="text-[10px] font-bold text-emerald-600 mt-1">100% Compliant</span>
        </div>

        <div 
          onClick={() => setActiveCategory('Vehicle Documents')}
          className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-xs cursor-pointer transition-all ${activeCategory === 'Vehicle Documents' ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-slate-200/80 hover:border-emerald-300'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Vehicle Documents</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0"><Truck size={16} /></div>
          </div>
          <p className="text-2xl font-black text-slate-900">Rego & Insurance</p>
          <span className="text-[10px] font-bold text-slate-500 mt-1">50 Fleet Vehicles</span>
        </div>

        <div 
          onClick={() => setActiveCategory('Customer Documents')}
          className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-xs cursor-pointer transition-all ${activeCategory === 'Customer Documents' ? 'border-amber-500 ring-2 ring-amber-500/10' : 'border-slate-200/80 hover:border-amber-300'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Customer Documents</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs shrink-0"><Users size={16} /></div>
          </div>
          <p className="text-2xl font-black text-slate-900">Contracts & PODs</p>
          <span className="text-[10px] font-bold text-amber-600 mt-1">Signed Agreements & PODs</span>
        </div>
      </div>

      {/* Main Vault Panel */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden mb-6">
        
        {/* Category Navigation Tabs */}
        <div className="flex border-b border-slate-100 px-4 sm:px-6 gap-4 sm:gap-8 overflow-x-auto whitespace-nowrap no-scrollbar">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
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
          <span className="text-xs font-bold text-slate-400">{filteredDocs.length} Documents Found</span>
        </div>

        {/* Mobile Responsive Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[720px] text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Document Title</th>
                <th className="py-3.5 px-4 sm:px-6">Folder Category</th>
                <th className="py-3.5 px-4 sm:px-6">Associated Entity</th>
                <th className="py-3.5 px-4 sm:px-6">File Size</th>
                <th className="py-3.5 px-4 sm:px-6">Uploaded By</th>
                <th className="py-3.5 px-4 sm:px-6">Upload Date</th>
                <th className="py-3.5 px-4 sm:px-6">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {filteredDocs.map(row => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4 sm:px-6 font-black text-slate-900 flex items-center gap-2">
                    <FileText size={16} className="text-blue-600 shrink-0" /> 
                    <span>{row.name}</span>
                  </td>
                  <td className="py-4 px-4 sm:px-6 font-bold text-slate-600">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                      row.category === 'Company Documents' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      row.category === 'Driver Documents' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                      row.category === 'Vehicle Documents' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {row.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 sm:px-6 font-semibold text-slate-800">{row.entity}</td>
                  <td className="py-4 px-4 sm:px-6 font-mono text-slate-500">{row.size}</td>
                  <td className="py-4 px-4 sm:px-6 text-slate-600">{row.uploadedBy}</td>
                  <td className="py-4 px-4 sm:px-6 text-slate-500">{row.date}</td>
                  <td className="py-4 px-4 sm:px-6">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">{row.status}</span>
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        onClick={() => setPreviewDoc(row)} 
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer" 
                        title="Preview Document"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        onClick={() => handleDownload(row)} 
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer" 
                        title="Download Document"
                      >
                        <Download size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(row.id)} 
                        className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer" 
                        title="Delete Document"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs z-[99999] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <div className="flex items-center gap-2">
                <FileText className="text-blue-600" size={20} />
                <h3 className="text-base font-black text-slate-900">{previewDoc.name}</h3>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-4 text-xs space-y-2 mb-4 border border-slate-200/60 font-medium">
              <div className="flex justify-between"><span className="text-slate-500">Folder Category:</span><span className="font-bold">{previewDoc.category}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Associated Entity:</span><span className="font-bold">{previewDoc.entity}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Uploaded By:</span><span>{previewDoc.uploadedBy}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">File Size:</span><span className="font-mono">{previewDoc.size}</span></div>
            </div>

            <div className="h-40 bg-slate-100 rounded-xl flex flex-col items-center justify-center text-slate-400 text-xs font-bold border border-slate-200 border-dashed mb-4">
              <FileText size={32} className="mb-2 text-slate-300" />
              <span>Document Preview Canvas</span>
              <span className="text-[10px] font-normal text-slate-400">{previewDoc.name}</span>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setPreviewDoc(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs">Close</button>
              <button onClick={() => { handleDownload(previewDoc); setPreviewDoc(null); }} className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center gap-2">
                <Download size={14} /> Download File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs z-[99999] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
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
                  value={newDoc.name}
                  onChange={e => setNewDoc({ ...newDoc, name: e.target.value })}
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
                  placeholder="e.g. Vehicle: NSW-BD101 or Driver Name" 
                  value={newDoc.entity}
                  onChange={e => setNewDoc({ ...newDoc, entity: e.target.value })}
                  className="w-full p-2.5 border rounded-xl mt-1 text-xs font-semibold outline-none focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="font-bold text-slate-600">Select File</label>
                <input 
                  type="file" 
                  className="w-full p-2 border rounded-xl mt-1 bg-slate-50 text-xs text-slate-600 cursor-pointer" 
                />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setShowUploadModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-xs hover:bg-blue-700 cursor-pointer">
                  Upload Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
