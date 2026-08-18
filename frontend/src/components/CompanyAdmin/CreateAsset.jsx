import React, { useState } from 'react';
import { 
  ArrowLeft, CheckCircle2, Box, MapPin, Activity, 
  Wrench, FileText, DollarSign, Info, Calendar, UploadCloud, File, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function CreateAsset() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    category: 'Workshop Equipment',
    make: '',
    model: '',
    year: '2024',
    branchName: 'Sydney Head Office',
    location: '',
    assignedTo: '',
    status: 'Active',
    condition: 'Good',
    lastServiceDate: '',
    nextServiceDate: '',
    serviceProvider: '',
    purchaseDate: '',
    purchasePrice: '',
    lifespan: '5',
    depreciation: 'Straight Line',
    notes: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveAsset = async () => {
    if (!formData.name.trim()) {
      setErrorMessage('Asset Name is required');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    try {
      const payload = {
        name: formData.name.trim(),
        serialNumber: formData.serialNumber.trim() || null,
        assetId: formData.serialNumber.trim() || `AST-${Math.floor(10000 + Math.random() * 90000)}`,
        category: formData.category,
        make: formData.make.trim() || null,
        model: formData.model.trim() || null,
        type: formData.model.trim() ? `${formData.make} ${formData.model}` : formData.category,
        year: formData.year ? parseInt(formData.year) : 2024,
        status: formData.status,
        condition: formData.condition,
        purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : null,
        purchaseDate: formData.purchaseDate || null,
        notes: formData.notes
      };

      await api.post('/company-admin/assets', payload);
      alert('Asset created successfully!');
      navigate('/company-admin/assets');
    } catch (err) {
      console.error('Failed to create asset:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to save asset. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-grow bg-[#F8FAFC] p-4 sm:p-6 w-full text-left font-sans custom-scrollbar overflow-y-auto min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* HEADER SECTION */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-start gap-4">
          <button 
            onClick={() => navigate('/company-admin/assets')}
            className="mt-1 w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors shrink-0 cursor-pointer"
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
            disabled={isSaving}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveAsset} 
            disabled={isSaving}
            className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} 
            {isSaving ? 'Saving...' : 'Save Asset'}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="max-w-5xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-700">
          {errorMessage}
        </div>
      )}

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
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="e.g. Air Compressor 100L" 
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Asset ID / Serial Number</label>
              <input 
                type="text" 
                value={formData.serialNumber}
                onChange={e => handleChange('serialNumber', e.target.value)}
                placeholder="e.g. SN-998822" 
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</label>
              <select 
                value={formData.category}
                onChange={e => handleChange('category', e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 cursor-pointer"
              >
                <option value="Workshop Equipment">Workshop Equipment</option>
                <option value="Forklifts">Forklifts</option>
                <option value="Containers">Containers</option>
                <option value="Material Handling">Material Handling</option>
                <option value="Power Equipment">Power Equipment</option>
                <option value="Equipment">Equipment</option>
                <option value="IT & Devices">IT & Devices</option>
                <option value="PPE">PPE</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Make / Model</label>
              <input 
                type="text" 
                value={formData.model}
                onChange={e => handleChange('model', e.target.value)}
                placeholder="e.g. Makita XFD131" 
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Year of Manufacture</label>
              <input 
                type="text" 
                value={formData.year}
                onChange={e => handleChange('year', e.target.value)}
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
                value={formData.branchName}
                onChange={e => handleChange('branchName', e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 cursor-pointer"
              >
                <option value="Sydney Head Office">Sydney Head Office</option>
                <option value="Melbourne Depot">Melbourne Depot</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Specific Location</label>
              <input 
                type="text" 
                value={formData.location}
                onChange={e => handleChange('location', e.target.value)}
                placeholder="e.g. Workshop Bay 3" 
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Assigned To</label>
              <input 
                type="text" 
                value={formData.assignedTo}
                onChange={e => handleChange('assignedTo', e.target.value)}
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
                  onClick={() => handleChange('status', 'Active')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer ${formData.status === 'Active' ? 'bg-orange-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  Active
                </button>
                <button 
                  type="button"
                  onClick={() => handleChange('status', 'Maintenance')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer ${formData.status === 'Maintenance' ? 'bg-orange-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  Maintenance
                </button>
                <button 
                  type="button"
                  onClick={() => handleChange('status', 'Out of Service')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer ${formData.status === 'Out of Service' ? 'bg-orange-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  Out of Service
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Physical Condition</label>
              <select 
                value={formData.condition}
                onChange={e => handleChange('condition', e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 cursor-pointer"
              >
                <option value="New">New</option>
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
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Last Service Date</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={formData.lastServiceDate}
                  onChange={e => handleChange('lastServiceDate', e.target.value)}
                  className="w-full pl-4 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400" 
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Next Service Due</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={formData.nextServiceDate}
                  onChange={e => handleChange('nextServiceDate', e.target.value)}
                  className="w-full pl-4 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400" 
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Service Provider</label>
              <input 
                type="text" 
                value={formData.serviceProvider}
                onChange={e => handleChange('serviceProvider', e.target.value)}
                placeholder="e.g. Sydney Tools Repairs" 
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300" 
              />
            </div>
          </div>
        </div>

        {/* 5. FINANCIAL DETAILS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign size={16} />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">5. Financial Details</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Purchase and Value</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Purchase Date</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={formData.purchaseDate}
                  onChange={e => handleChange('purchaseDate', e.target.value)}
                  className="w-full pl-4 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400" 
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Purchase Price ($)</label>
              <input 
                type="number" 
                value={formData.purchasePrice}
                onChange={e => handleChange('purchasePrice', e.target.value)}
                placeholder="0.00" 
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Lifespan (YRS)</label>
              <input 
                type="text" 
                value={formData.lifespan}
                onChange={e => handleChange('lifespan', e.target.value)}
                placeholder="5" 
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Depreciation</label>
              <select 
                value={formData.depreciation}
                onChange={e => handleChange('depreciation', e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 cursor-pointer"
              >
                <option value="Straight Line">Straight Line</option>
                <option value="Declining Balance">Declining Balance</option>
              </select>
            </div>
          </div>
        </div>

        {/* 6. NOTES & COMMENTS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <Info size={16} />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">6. Notes & Comments</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Additional Information</p>
            </div>
          </div>
          
          <textarea 
            value={formData.notes}
            onChange={e => handleChange('notes', e.target.value)}
            placeholder="Any specific instructions, history, or observations..."
            className="w-full h-32 p-4 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300 resize-none custom-scrollbar"
          ></textarea>
        </div>

      </div>

      {/* STICKY FOOTER */}
      <div className="max-w-5xl mx-auto mt-8 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex justify-between items-center sticky bottom-6">
        <button 
          onClick={() => navigate('/company-admin/assets')}
          disabled={isSaving}
          className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm cursor-pointer disabled:opacity-50"
        >
          Cancel
        </button>
        <button 
          onClick={handleSaveAsset} 
          disabled={isSaving}
          className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Asset'} <ArrowLeft size={16} className="rotate-180" />
        </button>
      </div>

      {/* Bottom spacer */}
      <div className="h-12"></div>
      
    </div>
  );
}

