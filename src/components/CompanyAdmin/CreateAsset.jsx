import React, { useState } from 'react';
import { 
  ArrowLeft, CheckCircle2, Box, MapPin, Activity, 
  Wrench, FileText, DollarSign, Info, Calendar, UploadCloud, File
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CreateAsset() {
  const navigate = useNavigate();
  const [activeStatus, setActiveStatus] = useState('Active');

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
          <button className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2 shadow-sm">
            <CheckCircle2 size={16} /> Save Asset
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
              <input type="text" placeholder="e.g. Air Compressor 100L" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Asset ID / Serial Number</label>
              <input type="text" placeholder="e.g. SN-998822" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</label>
              <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 appearance-none">
                <option>Workshop Equipment</option>
                <option>Forklifts</option>
                <option>IT & Devices</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Make / Model</label>
              <input type="text" placeholder="e.g. Makita XFD131" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Year of Manufacture</label>
              <input type="text" placeholder="e.g. 2022" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300" />
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
              <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 appearance-none">
                <option>Sydney Head Office</option>
                <option>Melbourne Depot</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Specific Location</label>
              <input type="text" placeholder="e.g. Workshop Bay 3" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Assigned To</label>
              <input type="text" placeholder="e.g. Maintenance Team" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300" />
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
                  onClick={() => setActiveStatus('Active')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors ${activeStatus === 'Active' ? 'bg-orange-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  Active
                </button>
                <button 
                  onClick={() => setActiveStatus('Maintenance')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors ${activeStatus === 'Maintenance' ? 'bg-orange-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  Maintenance
                </button>
                <button 
                  onClick={() => setActiveStatus('Out of Service')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors ${activeStatus === 'Out of Service' ? 'bg-orange-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  Out of Service
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Physical Condition</label>
              <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 appearance-none">
                <option>New</option>
                <option>Good</option>
                <option>Fair</option>
                <option>Poor</option>
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
                <input type="text" placeholder="mm/dd/yyyy" className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300" />
                <Calendar size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Next Service Due</label>
              <div className="relative">
                <input type="text" placeholder="mm/dd/yyyy" className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300" />
                <Calendar size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Service Provider</label>
              <input type="text" placeholder="e.g. Sydney Tools Repairs" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300" />
            </div>
          </div>
        </div>

        {/* 5. ASSET DOCUMENTATION */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileText size={16} />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">5. Asset Documentation</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Manuals and Certificates</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-purple-300 transition-colors cursor-pointer group">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:text-purple-600 group-hover:bg-purple-50 transition-colors">
                <File size={20} />
              </div>
              <span className="text-xs font-bold text-slate-700">User Manual</span>
              <span className="text-[9px] font-semibold text-slate-400">PDF up to 5MB</span>
            </div>
            
            <div className="border border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-purple-300 transition-colors cursor-pointer group">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:text-purple-600 group-hover:bg-purple-50 transition-colors">
                <CheckCircle2 size={20} />
              </div>
              <span className="text-xs font-bold text-slate-700">Warranty Doc</span>
              <span className="text-[9px] font-semibold text-slate-400">PDF up to 5MB</span>
            </div>
            
            <div className="border border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-purple-300 transition-colors cursor-pointer group">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:text-purple-600 group-hover:bg-purple-50 transition-colors">
                <CheckCircle2 size={20} />
              </div>
              <span className="text-xs font-bold text-slate-700">Compliance Cert</span>
              <span className="text-[9px] font-semibold text-slate-400">PDF up to 5MB</span>
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
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Purchase Date</label>
              <div className="relative">
                <input type="text" placeholder="mm/dd/yyyy" className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300" />
                <Calendar size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Purchase Price ($)</label>
              <input type="text" placeholder="0.00" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Lifespan (YRS)</label>
              <input type="text" placeholder="5" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 placeholder-slate-300" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Depreciation</label>
              <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 appearance-none">
                <option>Straight Line</option>
                <option>Declining Balance</option>
              </select>
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
        <button className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2 shadow-sm">
          Save Asset <ArrowLeft size={16} className="rotate-180" />
        </button>
      </div>

      {/* Bottom spacer */}
      <div className="h-12"></div>
      
    </div>
  );
}
