import React, { useState } from 'react';
import { 
  Plus, Search, MapPin, Users, Truck, Globe, Activity, CheckCircle2, Clock, 
  ArrowLeft, ChevronDown, Check, X, Building, Home, Shield, Trash2, Edit,
  Settings, UserPlus, Eye, FileText, AlertCircle, Phone, ArrowRight, HelpCircle
} from 'lucide-react';

const initialBranches = [
  {
    id: '1',
    name: 'Sydney Central Depot',
    code: 'SYD-CENTRAL',
    type: 'Primary Depot',
    status: 'Online',
    score: 98,
    address: 'STRATHFIELD, NSW 2135',
    leadName: 'MICHAEL ADAMS',
    leadInitials: 'MA',
    staffCount: 42,
    vehicles: 18,
    storageUsage: 92,
    storageText: 'FULL 92%',
    storageColor: 'text-red-500 bg-red-500',
    phone: '+61 2 9111 2222',
    hours: '24/7',
    authority: [
      { name: 'Michael Adams', role: 'Branch Manager', initials: 'MA' },
      { name: 'Sarah Mitchell', role: 'Dispatcher', initials: 'SM' },
      { name: 'Emma Thompson', role: 'Dispatcher', initials: 'ET' },
      { name: 'Chris Lee', role: 'Accounts', initials: 'CL' }
    ]
  },
  {
    id: '2',
    name: 'Melbourne Depot',
    code: 'MEL-DEPOT',
    type: 'Primary Depot',
    status: 'Online',
    score: 84,
    address: 'TULLAMARINE, VIC 3043',
    leadName: 'SARAH MITCHELL',
    leadInitials: 'SM',
    staffCount: 14,
    vehicles: 6,
    storageUsage: 45,
    storageText: 'OK 45%',
    storageColor: 'text-amber-500 bg-amber-500',
    phone: '+61 3 9222 3333',
    hours: '06:00 - 22:00',
    authority: [
      { name: 'Sarah Mitchell', role: 'Branch Manager', initials: 'SM' },
      { name: 'Michael Adams', role: 'Dispatcher', initials: 'MA' }
    ]
  },
  {
    id: '3',
    name: 'Brisbane Port Branch',
    code: 'BNE-PORT',
    type: 'Local Branch',
    status: 'Maintenance',
    score: 72,
    address: 'LYTTON, QLD 4178',
    leadName: 'LIAM SMITH',
    leadInitials: 'LS',
    staffCount: 28,
    vehicles: 12,
    storageUsage: 78,
    storageText: 'OK 78%',
    storageColor: 'text-amber-500 bg-amber-500',
    phone: '+61 7 9333 4444',
    hours: '08:00 - 18:00',
    authority: [
      { name: 'Liam Smith', role: 'Branch Manager', initials: 'LS' },
      { name: 'Emma Thompson', role: 'Dispatcher', initials: 'ET' }
    ]
  }
];

export default function Branches() {
  const [branchesList, setBranchesList] = useState(initialBranches);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showAddView, setShowAddView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBranchTab, setActiveBranchTab] = useState('Overview');
  
  // Roster sub-form state
  const [showAddStaffForm, setShowAddStaffForm] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Dispatcher');

  // New/Configure Branch Form state
  const [newBranchForm, setNewBranchForm] = useState({
    name: '',
    type: 'Local Branch',
    address: '',
    code: '',
    managerName: '',
    phone: '',
    workingHours: '08:00 - 18:00',
    storageSpace: '1000'
  });

  const handleInputChange = (field, value) => {
    setNewBranchForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelectBranch = (branch) => {
    setSelectedBranch(branch);
    setActiveBranchTab('Overview');
    setShowAddStaffForm(false);
    setNewStaffName('');
    setNewStaffRole('Dispatcher');
  };

  const handleSaveBranch = (e) => {
    e.preventDefault();
    if (!newBranchForm.name || !newBranchForm.code) return;

    if (selectedBranch) {
      // Edit/Configure Mode
      const updatedBranch = {
        ...selectedBranch,
        name: newBranchForm.name,
        type: newBranchForm.type,
        address: newBranchForm.address.toUpperCase(),
        code: newBranchForm.code.toUpperCase(),
        leadName: newBranchForm.managerName.toUpperCase(),
        leadInitials: newBranchForm.managerName ? newBranchForm.managerName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'NA',
        phone: newBranchForm.phone || selectedBranch.phone,
        hours: newBranchForm.workingHours || selectedBranch.hours,
        storageSpace: newBranchForm.storageSpace
      };

      setSelectedBranch(updatedBranch);
      setBranchesList(prev => prev.map(b => b.id === selectedBranch.id ? updatedBranch : b));
      setShowAddView(false);
    } else {
      // Add Mode
      const storageVal = Math.floor(Math.random() * 60) + 30; // Random usage 30-90%
      const isRed = storageVal >= 90;
      
      const newBranch = {
        id: Date.now().toString(),
        name: newBranchForm.name,
        code: newBranchForm.code.toUpperCase(),
        type: newBranchForm.type,
        status: 'Online',
        score: Math.floor(Math.random() * 20) + 80, // Random score 80-100%
        address: newBranchForm.address.toUpperCase() || 'UNKNOWN ADDRESS',
        leadName: newBranchForm.managerName.toUpperCase() || 'NO MANAGER ASSIGNED',
        leadInitials: newBranchForm.managerName ? newBranchForm.managerName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'NA',
        staffCount: Math.floor(Math.random() * 40) + 10,
        vehicles: Math.floor(Math.random() * 15) + 3,
        storageUsage: storageVal,
        storageText: isRed ? `FULL ${storageVal}%` : `OK ${storageVal}%`,
        storageColor: isRed ? 'text-red-500 bg-red-500' : 'text-amber-500 bg-amber-500',
        phone: newBranchForm.phone || '+61 2 9111 2222',
        hours: newBranchForm.workingHours || '24/7',
        storageSpace: newBranchForm.storageSpace || '1000',
        authority: [
          { name: newBranchForm.managerName.toUpperCase() || 'NO MANAGER ASSIGNED', role: 'Branch Manager', initials: newBranchForm.managerName ? newBranchForm.managerName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'NA' }
        ]
      };

      setBranchesList(prev => [...prev, newBranch]);
      setShowAddView(false);
    }

    // Reset Form
    setNewBranchForm({
      name: '',
      type: 'Local Branch',
      address: '',
      code: '',
      managerName: '',
      phone: '',
      workingHours: '08:00 - 18:00',
      storageSpace: '1000'
    });
  };

  const handleAddStaffMember = (e) => {
    e.preventDefault();
    if (!newStaffName) return;

    const initials = newStaffName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const newStaff = {
      name: newStaffName,
      role: newStaffRole,
      initials
    };

    const updatedBranch = {
      ...selectedBranch,
      authority: [...(selectedBranch.authority || []), newStaff],
      staffCount: selectedBranch.staffCount + 1
    };

    setSelectedBranch(updatedBranch);
    setBranchesList(prev => prev.map(b => b.id === selectedBranch.id ? updatedBranch : b));
    
    // Reset states
    setNewStaffName('');
    setNewStaffRole('Dispatcher');
    setShowAddStaffForm(false);
  };

  const filteredBranches = branchesList.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If showing detailed view of a branch
  if (selectedBranch && !showAddView) {
    const isPrimary = selectedBranch.type === 'Primary Depot';
    const isFull = selectedBranch.storageUsage >= 90;

    return (
      <div className="flex-grow bg-[#F8FAFC] p-4 sm:p-6 w-full text-left font-sans custom-scrollbar overflow-y-auto" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        
        {/* Header Block */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            {/* Back button */}
            <button 
              onClick={() => setSelectedBranch(null)} 
              className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors shadow-sm cursor-pointer shrink-0"
            >
              <ArrowLeft size={16} strokeWidth={2.5} />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                  {selectedBranch.name}
                </h1>
                <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-black tracking-wider ${
                  isPrimary ? 'bg-amber-100 text-slate-900' : 'bg-slate-100 text-slate-700'
                }`}>
                  {selectedBranch.type}
                </span>
                <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-black tracking-wider ${
                  selectedBranch.status === 'Online' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {selectedBranch.status}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 flex-wrap">
                <span className="flex items-center gap-1"><MapPin size={11} className="text-slate-400" /> {selectedBranch.address}</span>
                <span className="text-slate-350">•</span>
                <span className="flex items-center gap-1"><Phone size={11} className="text-slate-400" /> {selectedBranch.phone}</span>
                <span className="text-slate-350">•</span>
                <span className="flex items-center gap-1"><Clock size={11} className="text-slate-400" /> {selectedBranch.hours}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => {
                setActiveBranchTab('Authority');
                setShowAddStaffForm(true);
              }}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} strokeWidth={2.5} /> Add Staff
            </button>
            <button 
              onClick={() => {
                setNewBranchForm({
                  name: selectedBranch.name,
                  type: selectedBranch.type,
                  address: selectedBranch.address,
                  code: selectedBranch.code,
                  managerName: selectedBranch.leadName,
                  phone: selectedBranch.phone,
                  workingHours: selectedBranch.hours,
                  storageSpace: selectedBranch.storageSpace || '1000'
                });
                setShowAddView(true);
              }}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Settings size={14} /> Configure
            </button>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {[
            { label: 'TOTAL STAFF', value: selectedBranch.staffCount, color: 'text-slate-800' },
            { label: 'DRIVERS', value: selectedBranch.vehicles, color: 'text-slate-800' },
            { label: 'FLEET ASSETS', value: selectedBranch.vehicles + 6, color: 'text-slate-800' },
            { label: 'ACTIVE JOBS', value: selectedBranch.vehicles, color: 'text-slate-800' },
            { label: 'DELIVERED TODAY', value: selectedBranch.staffCount * 10 - 8, color: 'text-slate-800' },
            { label: 'ISSUES', value: isPrimary ? '3' : '1', color: 'text-red-500' }
          ].map((metric, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{metric.label}</p>
              <h3 className={`text-xl font-black leading-none ${metric.color}`}>{metric.value}</h3>
            </div>
          ))}
        </div>

        {/* Dock Capacity full width progress bar */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs mb-6">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider mb-2.5">
            <span className="text-slate-500">Dock Capacity</span>
            <span className="text-slate-900">{selectedBranch.storageUsage}%</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-2.5">
            <div 
              className={`h-full rounded-full ${
                isFull ? 'bg-red-500' : 
                selectedBranch.storageUsage > 60 ? 'bg-[#EAB308]' : 'bg-emerald-500'
              }`} 
              style={{ width: `${selectedBranch.storageUsage}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
            <span>{isPrimary ? '18 Active Docks' : '8 Active Docks'}</span>
            {isFull ? (
              <span className="flex items-center gap-1 text-red-500 font-extrabold uppercase text-[9px] tracking-wider">
                <AlertCircle size={12} /> Near Capacity
              </span>
            ) : (
              <span className="text-emerald-500 font-extrabold uppercase text-[9px] tracking-wider">
                Optimal Capacity
              </span>
            )}
          </div>
        </div>

        {/* Two Column details section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Columns (Overview Tabs & Profile/Recent Loads) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Inner Sub-navigation tabs with outline box for active tab */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 flex-nowrap overflow-x-auto">
              {[
                { id: 'Overview', label: 'Overview' },
                { id: 'Authority', label: `Authority (${(selectedBranch.authority || []).length})` },
                { id: 'Drivers', label: `Drivers (4)` },
                { id: 'Fleet', label: `Fleet (5)` },
                { id: 'Recent Jobs', label: 'Recent Jobs' }
              ].map((tab) => {
                const isActive = activeBranchTab === tab.id;
                return (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveBranchTab(tab.id)}
                    className={`px-4 py-1.5 text-xs font-black whitespace-nowrap cursor-pointer transition-all rounded-lg border-2 ${
                      isActive 
                        ? 'border-slate-900 bg-white text-slate-900' 
                        : 'border-transparent text-slate-400 hover:text-slate-805'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Dynamic Tab Contents */}
            {activeBranchTab === 'Overview' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Branch Profile widget */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
                  <div className="flex items-center gap-2 border-b border-slate-50 pb-4 mb-4">
                    <Building size={16} className="text-blue-600" />
                    <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Branch Profile</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs font-bold text-slate-500">
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Branch Manager</span>
                      <span className="text-slate-800">{selectedBranch.leadName}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Contact Phone</span>
                      <span className="text-slate-800">{selectedBranch.phone}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Operating Hours</span>
                      <span className="text-slate-800">{selectedBranch.hours}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Facility Type</span>
                      <span className="text-slate-800">{selectedBranch.type}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Location</span>
                      <span className="text-slate-800">{selectedBranch.address}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Branch ID</span>
                      <span className="text-slate-800 font-extrabold">{selectedBranch.code}</span>
                    </div>
                  </div>
                </div>

                {/* Recent Loads Table */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Truck size={16} className="text-blue-600" />
                      <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Recent Loads</h3>
                    </div>
                    <button className="text-[9px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest flex items-center gap-0.5 cursor-pointer">
                      View All &rarr;
                    </button>
                  </div>
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-450 uppercase tracking-wider bg-slate-50/50">
                          <th className="py-3 px-5 text-slate-400">LOAD</th>
                          <th className="py-3 px-5 text-slate-400">STATUS</th>
                          <th className="py-3 px-5 text-slate-400">DRIVER</th>
                          <th className="py-3 px-5 text-slate-400">ETA</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold text-slate-655">
                        <tr className="hover:bg-slate-50/30 transition-colors">
                          <td className="py-3.5 px-5 font-black text-slate-850">SHP-9042<span className="text-[9px] text-slate-400 font-semibold block">Acme Corp</span></td>
                          <td className="py-3.5 px-5"><span className="text-[8px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded">In Transit</span></td>
                          <td className="py-3.5 px-5 text-slate-500 font-semibold">Jack Taylor</td>
                          <td className="py-3.5 px-5 text-slate-700 font-bold">14:30</td>
                        </tr>
                        <tr className="hover:bg-slate-50/30 transition-colors">
                          <td className="py-3.5 px-5 font-black text-slate-850">SHP-9055<span className="text-[9px] text-slate-400 font-semibold block">Acme Freight</span></td>
                          <td className="py-3.5 px-5"><span className="text-[8px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-1 rounded">Unassigned</span></td>
                          <td className="py-3.5 px-5 text-slate-400 font-normal">—</td>
                          <td className="py-3.5 px-5 text-slate-400 font-normal">—</td>
                        </tr>
                        <tr className="hover:bg-slate-50/30 transition-colors">
                          <td className="py-3.5 px-5 font-black text-slate-850">SHP-9039<span className="text-[9px] text-slate-400 font-semibold block">Global Traders</span></td>
                          <td className="py-3.5 px-5"><span className="text-[8px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Received</span></td>
                          <td className="py-3.5 px-5 text-slate-500 font-semibold">Liam Smith</td>
                          <td className="py-3.5 px-5 text-emerald-600 font-bold">Done</td>
                        </tr>
                        <tr className="hover:bg-slate-50/30 transition-colors">
                          <td className="py-3.5 px-5 font-black text-slate-850">SHP-9041<span className="text-[9px] text-slate-400 font-semibold block">Tech Solutions</span></td>
                          <td className="py-3.5 px-5"><span className="text-[8px] font-black uppercase tracking-wider text-red-600 bg-red-50 px-2 py-1 rounded">Issue</span></td>
                          <td className="py-3.5 px-5 text-slate-500 font-semibold">Lucas Jones</td>
                          <td className="py-3.5 px-5 text-red-500 font-bold">Delayed</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeBranchTab === 'Authority' && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6 animate-in fade-in duration-200">
                <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                  <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Complete Branch Authority</h3>
                  {showAddStaffForm ? (
                    <button 
                      onClick={() => setShowAddStaffForm(false)}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer bg-transparent border-0"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button 
                      onClick={() => setShowAddStaffForm(true)}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer bg-transparent border-0"
                    >
                      + Add New Staff Member
                    </button>
                  )}
                </div>

                {showAddStaffForm && (
                  <form onSubmit={handleAddStaffMember} className="bg-slate-50/50 rounded-2xl border border-slate-100 p-5 space-y-4 animate-in slide-in-from-top duration-250">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Staff Member Name</label>
                        <input 
                          type="text"
                          value={newStaffName}
                          onChange={e => setNewStaffName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all text-slate-705 placeholder-slate-400 bg-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Company Role</label>
                        <div className="relative">
                          <select 
                            value={newStaffRole}
                            onChange={e => setNewStaffRole(e.target.value)}
                            className="appearance-none w-full border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all text-slate-705 bg-white cursor-pointer"
                          >
                            <option value="Dispatcher">Dispatcher</option>
                            <option value="Branch Manager">Branch Manager</option>
                            <option value="Accounts">Accounts</option>
                            <option value="Driver">Driver</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-[#EAB308] hover:bg-[#CA8A04] text-slate-900 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center shadow-xs cursor-pointer border-0"
                    >
                      Add To Roster
                    </button>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(selectedBranch.authority || []).map((auth, idx) => (
                    <div key={idx} className="bg-white border border-slate-100 rounded-xl p-4 flex items-center justify-between shadow-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-black flex items-center justify-center text-[11px] shrink-0">
                          {auth.initials}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 leading-tight mb-0.5">{auth.name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold leading-none">{auth.role}</p>
                        </div>
                      </div>
                      <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black px-1.5 py-0.5 rounded tracking-wide uppercase border border-emerald-100">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeBranchTab === 'Drivers' && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-50 pb-4">
                  <h3 className="text-xs font-black uppercase text-slate-850 tracking-wider">Assigned Drivers</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: 'Jack Taylor', class: 'MC Heavy Double', phone: '+61 400 111 222', status: 'In Transit', color: 'text-blue-600 bg-blue-50 border-blue-105' },
                    { name: 'Liam Smith', class: 'HC Heavy Rigid', phone: '+61 400 222 333', status: 'At Depot', color: 'text-emerald-600 bg-emerald-50 border-emerald-105' },
                    { name: 'Lucas Jones', class: 'MC Heavy Double', phone: '+61 400 333 444', status: 'Rest Period', color: 'text-amber-600 bg-amber-50 border-amber-105' },
                    { name: 'Sarah Connor', class: 'HR Heavy Vehicle', phone: '+61 400 444 555', status: 'At Depot', color: 'text-emerald-600 bg-emerald-50 border-emerald-105' }
                  ].map((driver, idx) => (
                    <div key={idx} className="bg-white border border-slate-100 rounded-xl p-4 flex justify-between items-start shadow-xs">
                      <div>
                        <h4 className="text-xs font-bold text-slate-808 mb-1">{driver.name}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold mb-0.5">Class: {driver.class}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">Phone: {driver.phone}</p>
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded border ${driver.color}`}>
                        {driver.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeBranchTab === 'Fleet' && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-50 pb-4">
                  <h3 className="text-xs font-black uppercase text-slate-850 tracking-wider">Assigned Fleet Vehicles</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: '2022 Toyota Camry', plate: 'ABC 123', body: 'Sedan', status: 'IN DEPOT', color: 'text-slate-600 bg-slate-50 border-slate-200' },
                    { name: '2023 Honda CR-V', plate: 'XYZ 987', body: 'SUV', status: 'IN TRANSIT', color: 'text-blue-600 bg-blue-50 border-blue-105' },
                    { name: '2024 Tesla Model S', plate: 'EV 0001', body: 'Electric Sedan', status: 'DELIVERED', color: 'text-emerald-600 bg-emerald-50 border-emerald-105' },
                    { name: '2021 Ford Ranger', plate: 'TRK 444', body: 'Ute', status: 'AWAITING LOAD', color: 'text-amber-600 bg-amber-50 border-amber-105' },
                    { name: '2022 Nissan X-Trail', plate: 'NIS 202', body: 'SUV', status: 'IN DEPOT', color: 'text-slate-600 bg-slate-50 border-slate-200' }
                  ].map((vehicle, idx) => (
                    <div key={idx} className="bg-white border border-slate-100 rounded-xl p-4 flex justify-between items-start shadow-xs">
                      <div>
                        <h4 className="text-xs font-bold text-slate-808 mb-1">{vehicle.name}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold">Plate: {vehicle.plate}  •  Body: {vehicle.body}</p>
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded border ${vehicle.color}`}>
                        {vehicle.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeBranchTab === 'Recent Jobs' && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-50 pb-4">
                  <h3 className="text-xs font-black uppercase text-slate-850 tracking-wider">Cargo Log Book</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { id: 'SHP-9042', route: 'Sydney Central ➔ Brisbane Port', cargo: 'Automotive Parts (1.5 tons)', customer: 'Acme Corp' },
                    { id: 'SHP-9055', route: 'Melbourne Depot ➔ Sydney Central', cargo: 'Retail Stock (800 kg)', customer: 'Acme Freight' },
                    { id: 'SHP-9039', route: 'Brisbane Port ➔ Melbourne Depot', cargo: 'Electronics (2.1 tons)', customer: 'Global Traders' }
                  ].map((job, idx) => (
                    <div key={idx} className="bg-white border border-slate-100 rounded-xl p-4 flex justify-between items-center shadow-xs">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-black text-slate-805">{job.id}</h4>
                        <p className="text-[11px] font-semibold text-slate-500">{job.route}</p>
                        <p className="text-[10px] font-semibold text-slate-400">Cargo: {job.cargo}</p>
                      </div>
                      <span className="text-[10px] font-bold text-slate-455 text-right">{job.customer}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column (Operations Control & Authority list) */}
          <div className="space-y-6">
            {/* Operations Control Dark Widget */}
            <div className="bg-[#0f172a] text-white rounded-2xl border border-slate-900 p-5 shadow-md">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-4">
                <Settings size={16} className="text-amber-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">Operations Control</h3>
              </div>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 py-3 border border-red-500/30 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer">
                  <Activity size={14} /> Force Offline
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800/80 hover:bg-slate-800 text-slate-205 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer">
                  <Shield size={14} /> View Authority Roster
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#EAB308] hover:bg-[#CA8A04] text-slate-900 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-0">
                  <UserPlus size={14} /> Add Staff to Branch
                </button>
              </div>
            </div>

            {/* Authority List widget */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
              <div className="flex justify-between items-center border-b border-slate-50 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-blue-600" />
                  <h3 className="text-xs font-black uppercase text-slate-850 tracking-wider">Authority</h3>
                </div>
                <button className="text-[9px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest cursor-pointer bg-transparent border-0">
                  Details
                </button>
              </div>
              <div className="space-y-4">
                {selectedBranch.authority && selectedBranch.authority.slice(0, isPrimary ? 4 : 2).map((auth, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-black flex items-center justify-center text-[10px] shrink-0">
                      {auth.initials}
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-xs font-bold text-slate-808 truncate leading-none mb-0.5">{auth.name}</p>
                      <p className="text-[10px] text-slate-400 font-semibold leading-none">{auth.role}</p>
                    </div>
                    <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black px-1.5 py-0.5 rounded tracking-wide uppercase border border-emerald-100 shrink-0">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    );
  }

  if (showAddView) {
    return (
      <div className="flex-grow bg-[#F8FAFC] p-4 sm:p-6 w-full text-left font-sans custom-scrollbar overflow-y-auto" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        {/* Back navigation header */}
        <div className="flex items-center gap-2 mb-6">
          <button 
            onClick={() => setShowAddView(false)} 
            className="flex items-center gap-1.5 text-xs font-bold text-slate-505 hover:text-slate-900 transition-colors uppercase tracking-wider cursor-pointer bg-transparent border-0"
          >
            <ArrowLeft size={14} strokeWidth={2.5} /> {selectedBranch ? selectedBranch.name : 'Admin Portal'}
          </button>
          <span className="text-slate-350 text-xs">/</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{selectedBranch ? 'Configure Branch' : 'Add New Branch'}</span>
        </div>

        <form onSubmit={handleSaveBranch} className="space-y-6 max-w-5xl">
          {/* Section 1: Branch Details */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4 mb-5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100">
                <Home size={16} />
              </div>
              <h3 className="text-xs font-black uppercase text-slate-808 tracking-wider">Branch Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Branch Name</label>
                <input 
                  type="text"
                  value={newBranchForm.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  placeholder="e.g. Sydney West Depot"
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all text-slate-700 placeholder-slate-400"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Branch Type</label>
                <div className="relative">
                  <select 
                    value={newBranchForm.type}
                    onChange={e => handleInputChange('type', e.target.value)}
                    className="appearance-none w-full border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all text-slate-700 bg-white cursor-pointer"
                  >
                    <option value="Local Branch">Local Branch</option>
                    <option value="Primary Depot">Primary Depot</option>
                    <option value="Regional Depot">Regional Depot</option>
                    <option value="Satellite Facility">Satellite Facility</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Address</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><MapPin size={14} /></span>
                    <input 
                      type="text"
                      value={newBranchForm.address}
                      onChange={e => handleInputChange('address', e.target.value)}
                      placeholder="123 Industrial Dr, Suburb, VIC 3000"
                      className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all text-slate-700 placeholder-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Branch Code / ID</label>
                  <input 
                    type="text"
                    value={newBranchForm.code}
                    onChange={e => handleInputChange('code', e.target.value)}
                    placeholder="e.g. SYD-WEST"
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all text-slate-705 placeholder-slate-400"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section 2: Management */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-4 mb-5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-505 border border-blue-100">
                  <Users size={16} />
                </div>
                <h3 className="text-xs font-black uppercase text-slate-808 tracking-wider">Management</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Manager Name</label>
                  <input 
                    type="text"
                    value={newBranchForm.managerName}
                    onChange={e => handleInputChange('managerName', e.target.value)}
                    placeholder="Enter full name"
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all text-slate-705 placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><Clock size={14} /></span>
                    <input 
                      type="text"
                      value={newBranchForm.phone}
                      onChange={e => handleInputChange('phone', e.target.value)}
                      placeholder="+61 400 000 000"
                      className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all text-slate-705 placeholder-slate-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Capacity & Hours */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-4 mb-5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-505 border border-indigo-100">
                  <Clock size={16} />
                </div>
                <h3 className="text-xs font-black uppercase text-slate-808 tracking-wider">Capacity & Hours</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Working Hours</label>
                  <input 
                    type="text"
                    value={newBranchForm.workingHours}
                    onChange={e => handleInputChange('workingHours', e.target.value)}
                    placeholder="08:00 - 18:00"
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all text-slate-705 placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Storage Space (SQM)</label>
                  <input 
                    type="number"
                    value={newBranchForm.storageSpace}
                    onChange={e => handleInputChange('storageSpace', e.target.value)}
                    placeholder="1000"
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all text-slate-705 placeholder-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end items-center gap-4 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => setShowAddView(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-805 uppercase tracking-wider px-5 py-3 transition-colors cursor-pointer bg-transparent border-0"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="bg-[#EAB308] hover:bg-[#CA8A04] text-slate-900 px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer border-0"
            >
              <Check size={14} strokeWidth={2.5} /> Save Branch
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-[#F8FAFC] p-4 sm:p-6 w-full text-left font-sans custom-scrollbar overflow-y-auto" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-xs shrink-0">
            <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 border border-slate-150">
              <Home size={14} />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Branch List</h1>
            <p className="text-[11px] text-slate-505 font-semibold mt-0.5">Manage Depots and delivery centers across your area.</p>
          </div>
        </div>
        <button 
          onClick={() => {
            setSelectedBranch(null);
            setNewBranchForm({
              name: '',
              type: 'Local Branch',
              address: '',
              code: '',
              managerName: '',
              phone: '',
              workingHours: '08:00 - 18:00',
              storageSpace: '1000'
            });
            setShowAddView(true);
          }}
          className="px-4 py-2.5 bg-[#EAB308] hover:bg-[#CA8A04] text-slate-900 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 cursor-pointer border-0"
        >
          <Plus size={14} strokeWidth={2.5} /> Add New Branch
        </button>
      </div>

      {/* Filter / Search input */}
      <div className="mb-6 max-w-md">
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><Search size={15} /></span>
          <input 
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Filter branches by name or code..."
            className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all text-slate-750 placeholder-slate-400 bg-white"
          />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'SYSTEM STATUS', value: '98.4%', icon: Activity, iconColor: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-100' },
          { label: 'TOTAL STAFF', value: '1,240', icon: Users, iconColor: 'text-blue-500', bg: 'bg-blue-50 border-blue-100' },
          { label: 'TOTAL VEHICLES', value: '840', icon: Truck, iconColor: 'text-amber-500', bg: 'bg-amber-50 border-amber-100' },
          { label: 'SYSTEM ONLINE', value: '99.9%', icon: Globe, iconColor: 'text-indigo-500', bg: 'bg-indigo-50 border-indigo-100' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-xl font-black text-slate-900 leading-tight">{stat.value}</h3>
              </div>
              <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center ${stat.iconColor} border`}>
                <Icon size={16} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid of Branch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBranches.map((branch) => {
          const isPrimary = branch.type === 'Primary Depot';
          return (
            <div 
              key={branch.id} 
              className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                isPrimary ? 'border-[#EAB308]' : 'border-slate-100'
              }`}
            >
              <div>
                {/* Card Header Status Row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-black tracking-wider ${
                      isPrimary ? 'bg-amber-100 text-slate-900' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {branch.type}
                    </span>
                    <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        branch.status === 'Online' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}></span>
                      {branch.status}
                    </span>
                  </div>
                  <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded text-[9px] uppercase font-black tracking-wider border border-emerald-100">
                    {branch.score}% Score
                  </span>
                </div>

                {/* Branch Name & Address */}
                <h2 className="text-base font-black text-slate-900 tracking-tight mb-1">
                  {branch.name}
                </h2>
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 mb-4">
                  <MapPin size={10} className="shrink-0" />
                  <span>{branch.address}</span>
                </div>

                {/* Manager / Lead Details */}
                <div className="flex items-center gap-2.5 mb-5 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/50">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black flex items-center justify-center text-[10px] shrink-0">
                    {branch.leadInitials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Branch Lead</p>
                    <p className="text-[10px] font-black text-slate-800 leading-none truncate">LEAD: {branch.leadName}</p>
                  </div>
                </div>

                {/* Details grid (Staff Count, Vehicles) */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-[#F8FAFC] border border-slate-100 p-3 rounded-xl">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Staff Count</p>
                    <p className="text-sm font-black text-slate-800">{branch.staffCount}</p>
                  </div>
                  <div className="bg-[#F8FAFC] border border-slate-100 p-3 rounded-xl">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Vehicles</p>
                    <p className="text-sm font-black text-slate-800">{branch.vehicles}</p>
                  </div>
                </div>

                {/* Storage usage progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-wider mb-1.5">
                    <span className="text-slate-400">Storage Usage</span>
                    <span className={branch.storageText.includes('FULL') ? 'text-red-500' : 'text-emerald-500'}>
                      {branch.storageText}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        branch.storageText.includes('FULL') ? 'bg-red-500' : 
                        branch.storageUsage > 60 ? 'bg-[#EAB308]' : 'bg-emerald-500'
                      }`} 
                      style={{ width: `${branch.storageUsage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-[9px] font-black text-slate-400 tracking-wider">
                  {branch.code}
                </span>
                <button 
                  onClick={() => handleSelectBranch(branch)}
                  className="text-[9px] font-black text-slate-700 hover:text-slate-900 transition-colors flex items-center gap-0.5 uppercase tracking-wider cursor-pointer bg-transparent border-0"
                >
                  Manage Branch <span className="text-slate-400 font-normal ml-0.5">&rsaquo;</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
