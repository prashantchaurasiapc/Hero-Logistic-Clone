import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, CheckCircle2, Box, MapPin, Activity, 
  Wrench, FileText, DollarSign, Info, Calendar, UploadCloud, File, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function CreateAsset() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [branches, setBranches] = useState([]);

  // Form fields state
  const [formData, setFormData] = useState({
    name: '',
    assetId: '',
    category: 'Workshop Equipment',
    type: 'Standard',
    make: '',
    model: '',
    year: '',
    serialNumber: '',
    branchId: '',
    location: '',
    assignedTo: '',
    status: 'ACTIVE',
    condition: 'GOOD'
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await api.get('/branches');
      const data = res.data?.data || res.data || [];
      if (Array.isArray(data) && data.length > 0) {
        setBranches(data);
        setFormData(prev => ({ ...prev, branchId: data[0].id }));
      }
    } catch (err) {
      console.error('Error fetching branches:', err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter asset name.');
      return;
    }

    setSubmitting(true);
    try {
      const generatedAssetId = formData.assetId.trim() || `AST-${Date.now().toString().slice(-6)}`;
      
      let selectedBranchId = formData.branchId;
      if (!selectedBranchId && branches.length > 0) {
        selectedBranchId = branches[0].id;
      }

      const payload = {
        name: formData.name,
        assetId: generatedAssetId,
        category: formData.category,
        type: formData.type || 'Standard',
        make: formData.make || null,
        model: formData.model || null,
        year: formData.year ? parseInt(formData.year, 10) : null,
        serialNumber: formData.serialNumber || null,
        status: formData.status,
        condition: formData.condition,
        ...(selectedBranchId ? { branchId: selectedBranchId } : {})
      };

      await api.post('/assets', payload);
      alert('Asset registered successfully!');
      navigate('/company-admin/assets');
    } catch (err) {
      console.error('Error creating asset:', err);
      alert(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to create asset. Please check required fields.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-grow bg-[#F8FAFC] p-4 sm:p-6 w-full text-left font-sans custom-scrollbar overflow-y-auto min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      
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
            onClick={handleSubmit} 
            disabled={submitting}
            className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} 
            {submitting ? 'Saving...' : 'Save Asset'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">
        
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
                required
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                placeholder="e.g. Air Compressor 100L" 
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Asset ID / Code (Auto-generated if empty)</label>
              <input 
                type="text" 
                value={formData.assetId}
                onChange={e => handleInputChange('assetId', e.target.value)}
                placeholder="e.g. AST-998822" 
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</label>
              <select 
                value={formData.category}
                onChange={e => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 cursor-pointer"
              >
                <option value="Forklifts">Forklifts</option>
                <option value="Containers">Containers</option>
                <option value="Material Handling">Material Handling</option>
                <option value="Power Equipment">Power Equipment</option>
                <option value="Equipment">Equipment</option>
                <option value="IT & Devices">IT & Devices</option>
                <option value="Workshop Equipment">Workshop Equipment</option>
                <option value="PPE">PPE</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Make / Model</label>
              <input 
                type="text" 
                value={formData.model}
                onChange={e => handleInputChange('model', e.target.value)}
                placeholder="e.g. Makita XFD131" 
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Year of Manufacture</label>
              <input 
                type="number" 
                value={formData.year}
                onChange={e => handleInputChange('year', e.target.value)}
                placeholder="e.g. 2024" 
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
                value={formData.branchId}
                onChange={e => handleInputChange('branchId', e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 cursor-pointer"
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name} ({b.code || 'Branch'})</option>
                ))}
                {branches.length === 0 && <option value="">Sydney Head Office</option>}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Specific Location</label>
              <input 
                type="text" 
                value={formData.location}
                onChange={e => handleInputChange('location', e.target.value)}
                placeholder="e.g. Workshop Bay 3" 
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Assigned To</label>
              <input 
                type="text" 
                value={formData.assignedTo}
                onChange={e => handleInputChange('assignedTo', e.target.value)}
                placeholder="e.g. Maintenance Team" 
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
                  onClick={() => handleInputChange('status', 'ACTIVE')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors ${formData.status === 'ACTIVE' ? 'bg-amber-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  Active
                </button>
                <button 
                  type="button"
                  onClick={() => handleInputChange('status', 'MAINTENANCE')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors ${formData.status === 'MAINTENANCE' ? 'bg-amber-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  Maintenance
                </button>
                <button 
                  type="button"
                  onClick={() => handleInputChange('status', 'OUT_OF_SERVICE')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors ${formData.status === 'OUT_OF_SERVICE' ? 'bg-amber-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  Out of Service
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Physical Condition</label>
              <select 
                value={formData.condition}
                onChange={e => handleInputChange('condition', e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 cursor-pointer"
              >
                <option value="NEW">New</option>
                <option value="GOOD">Good</option>
                <option value="FAIR">Fair</option>
                <option value="POOR">Poor</option>
              </select>
            </div>
          </div>
        </div>

      </form>

      {/* STICKY FOOTER */}
      <div className="max-w-5xl mx-auto mt-8 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex justify-between items-center sticky bottom-6">
        <button 
          onClick={() => navigate('/company-admin/assets')}
          className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm"
        >
          Cancel
        </button>
        <button 
          onClick={handleSubmit} 
          disabled={submitting}
          className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Save Asset'} <ArrowLeft size={16} className="rotate-180" />
        </button>
      </div>

      {/* Bottom spacer */}
      <div className="h-12"></div>
      
    </div>
  );
}
