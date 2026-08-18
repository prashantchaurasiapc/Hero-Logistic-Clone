import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, CheckCircle2, Box, MapPin, Activity, 
  Wrench, FileText, DollarSign, Info, Calendar, UploadCloud, File, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function CreateAsset() {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [assetId, setAssetId] = useState('');
  const [category, setCategory] = useState('Workshop Equipment');
  const [type, setType] = useState('Equipment');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [branchId, setBranchId] = useState('');
  const [location, setLocation] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [activeStatus, setActiveStatus] = useState('Active');
  const [condition, setCondition] = useState('Good');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [supplier, setSupplier] = useState('');
  const [warrantyExpiry, setWarrantyExpiry] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const res = await api.get('/company-admin/branches');
        const list = res.data?.data?.items || (Array.isArray(res.data?.data) ? res.data.data : []);
        setBranches(list);
        if (list.length > 0) setBranchId(list[0].id);
      } catch (err) {
        console.warn('Failed to fetch branches:', err);
      }
    };
    loadBranches();
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      alert('Asset Name is required!');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        assetId: assetId.trim() || undefined,
        category,
        type: type || 'Equipment',
        model: model.trim() || undefined,
        year: year ? parseInt(year, 10) : undefined,
        branchId: branchId || undefined,
        status: activeStatus,
        condition,
        purchasePrice: purchasePrice ? parseFloat(purchasePrice) : undefined,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
        supplier: supplier.trim() || undefined,
        warrantyExpiry: warrantyExpiry ? new Date(warrantyExpiry) : undefined
      };

      const res = await api.post('/company-admin/assets', payload);
      if (res.data?.success) {
        showToast('✓ Asset created successfully!');
        setTimeout(() => navigate('/company-admin/assets'), 800);
      } else {
        alert(res.data?.error?.message || 'Failed to create asset');
      }
    } catch (err) {
      alert('Error creating asset: ' + (err.response?.data?.error?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-grow bg-[#F8FAFC] p-4 sm:p-6 w-full text-left font-sans custom-scrollbar overflow-y-auto min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 99999, background: '#10B981', color: '#fff', padding: '12px 20px', borderRadius: 10, fontWeight: 800, fontSize: 13, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
          {toast.msg}
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-start gap-4">
          <button 
            onClick={() => navigate('/company-admin/assets')}
            className="mt-1 w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors shrink-0"
          >
            <ArrowLeft size={16} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Create New Asset
              <span className="bg-indigo-50 text-indigo-600 border border-indigo-200 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">New</span>
            </h1>
            <p className="text-slate-500 text-xs font-semibold mt-1">Register a new non-vehicle asset to the company inventory.</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => navigate('/company-admin/assets')}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={submitting}
            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
            {submitting ? 'Saving Asset...' : 'Save Asset'}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* 1. BASIC INFORMATION */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Box size={16} />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">1. Basic Information</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Asset Identity</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Asset Name *</label>
              <input 
                type="text" 
                placeholder="e.g. Air Compressor 100L" 
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Asset ID / Serial Number</label>
              <input 
                type="text" 
                placeholder="e.g. AST-1001" 
                value={assetId}
                onChange={e => setAssetId(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</label>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100"
              >
                <option value="Workshop Equipment">Workshop Equipment</option>
                <option value="Forklifts">Forklifts</option>
                <option value="Containers">Containers</option>
                <option value="Material Handling">Material Handling</option>
                <option value="Power Equipment">Power Equipment</option>
                <option value="IT & Devices">IT & Devices</option>
                <option value="Equipment">General Equipment</option>
                <option value="PPE">PPE</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Make / Model</label>
              <input 
                type="text" 
                placeholder="e.g. Makita XFD131" 
                value={model}
                onChange={e => setModel(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Year of Manufacture</label>
              <input 
                type="number" 
                placeholder="e.g. 2024" 
                value={year}
                onChange={e => setYear(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300" 
              />
            </div>
          </div>
        </div>

        {/* 2. ASSIGNMENT & LOCATION */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MapPin size={16} />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">2. Assignment & Location</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Where is this asset located?</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Home Branch</label>
              <select 
                value={branchId}
                onChange={e => setBranchId(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100"
              >
                {branches.length === 0 ? (
                  <option value="">Sydney Head Office (Default)</option>
                ) : (
                  branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name || b.location}</option>
                  ))
                )}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Specific Location</label>
              <input 
                type="text" 
                placeholder="e.g. Workshop Bay 3" 
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Assigned To</label>
              <input 
                type="text" 
                placeholder="e.g. Maintenance Team" 
                value={assignedTo}
                onChange={e => setAssignedTo(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300" 
              />
            </div>
          </div>
        </div>

        {/* 3. STATUS & CONDITION */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Activity size={16} />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">3. Status & Condition</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Current Operational State</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Operational Status</label>
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  onClick={() => setActiveStatus('Active')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors ${activeStatus === 'Active' ? 'bg-orange-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  Active
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveStatus('Maintenance')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors ${activeStatus === 'Maintenance' ? 'bg-orange-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  Maintenance
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveStatus('Out of Service')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors ${activeStatus === 'Out of Service' ? 'bg-orange-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  Out of Service
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Physical Condition</label>
              <select 
                value={condition}
                onChange={e => setCondition(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100"
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. MAINTENANCE & SERVICING */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Wrench size={16} />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">4. Maintenance & Servicing</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Service Schedules</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Supplier</label>
              <input 
                type="text" 
                placeholder="e.g. Sydney Tools Repairs" 
                value={supplier}
                onChange={e => setSupplier(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Warranty Expiry</label>
              <input 
                type="date" 
                value={warrantyExpiry}
                onChange={e => setWarrantyExpiry(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100" 
              />
            </div>
          </div>
        </div>

        {/* 6. FINANCIAL DETAILS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign size={16} />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">6. Financial Details</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Purchase and Value</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Purchase Date</label>
              <input 
                type="date" 
                value={purchaseDate}
                onChange={e => setPurchaseDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Purchase Price ($)</label>
              <input 
                type="number" 
                placeholder="0.00" 
                value={purchasePrice}
                onChange={e => setPurchasePrice(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300" 
              />
            </div>
          </div>
        </div>

        {/* 7. NOTES & COMMENTS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <Info size={16} />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">7. Notes & Comments</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Additional Information</p>
            </div>
          </div>
          
          <textarea 
            placeholder="Any specific instructions, history, or observations..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full h-32 p-4 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300 resize-none custom-scrollbar"
          ></textarea>
        </div>

      </div>

      {/* STICKY FOOTER */}
      <div className="max-w-5xl mx-auto mt-8 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex justify-between items-center sticky bottom-6">
        <button 
          onClick={() => navigate('/company-admin/assets')}
          className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm"
        >
          Cancel
        </button>
        <button 
          onClick={handleSave} 
          disabled={submitting}
          className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
        >
          {submitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
          {submitting ? 'Saving Asset...' : 'Save Asset'}
        </button>
      </div>

      {/* Bottom spacer */}
      <div className="h-12"></div>
      
    </div>
  );
}
