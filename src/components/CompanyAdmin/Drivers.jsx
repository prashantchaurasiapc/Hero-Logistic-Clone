import React, { useState } from 'react';
import { 
  Plus, Search, User, UserCheck, Star, Shield, AlertCircle, 
  ArrowLeft, Upload, FileText, Calendar, Clock, Phone, Mail, 
  MapPin, CheckCircle, ChevronDown, Truck, Activity, Zap
} from 'lucide-react';

const INITIAL_DRIVERS = [
  {
    id: 'DRV-102',
    name: 'Jack Taylor',
    phone: '+61 412 888 456',
    licenseClass: 'NSW - HC Class',
    licenseCode: 'BGT-221',
    region: 'Melbourne SE',
    status: 'ON TRIP',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80',
    isEditor: false
  },
  {
    id: 'DRV-103',
    name: 'Liam Smith',
    phone: '+61 415 999 123',
    licenseClass: 'NSW - HC Class',
    licenseCode: 'KLP-998',
    region: 'Adelaide Depot',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80',
    isEditor: false
  },
  {
    id: 'DRV-104',
    name: 'Noah Williams',
    phone: '+61 412 888 000',
    licenseClass: 'NSW - MC Class',
    licenseCode: 'KLY-004',
    region: 'Adelaide Depot',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&h=100&q=80',
    isEditor: true
  },
  {
    id: 'DRV-105',
    name: 'Oliver Brown',
    phone: '+61 422 111 222',
    licenseClass: 'VIC - MC Class',
    licenseCode: 'XCF-441',
    region: 'Sydney Central',
    status: 'ON TRIP',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
    isEditor: false
  }
];

export default function Drivers() {
  const [view, setView] = useState('list'); // 'list' or 'add' or 'manage'
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [drivers, setDrivers] = useState(INITIAL_DRIVERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('name');

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    region: '',
    licenseClass: '',
    licenseCode: ''
  });

  const startEditing = () => {
    setEditForm({
      name: selectedDriver.name,
      phone: selectedDriver.phone,
      email: selectedDriver.email || `${selectedDriver.name.toLowerCase().replace(' ', '.')}@hero.com`,
      address: selectedDriver.address || '14 Parramatta Rd, Strathfield NSW 2135',
      region: selectedDriver.region,
      licenseClass: selectedDriver.licenseClass,
      licenseCode: selectedDriver.licenseCode
    });
    setIsEditingProfile(true);
  };

  const saveProfileEdits = () => {
    const updatedSelected = {
      ...selectedDriver,
      name: editForm.name,
      phone: editForm.phone,
      email: editForm.email,
      address: editForm.address,
      region: editForm.region,
      licenseClass: editForm.licenseClass,
      licenseCode: editForm.licenseCode
    };
    setSelectedDriver(updatedSelected);
    setDrivers(drivers.map(d => d.id === selectedDriver.id ? updatedSelected : d));
    setIsEditingProfile(false);
  };

  // Form states for new driver
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    nationalId: '',
    address: '',
    licenseClass: 'NSW - HC (Heavy Combination)',
    licenseNumber: '',
    licenseExpiry: '',
    medicalExpiry: '',
    experience: '',
    msicAccess: false,
    dangerousGoods: false,
    whiteCard: false,
    depot: 'Sydney Central Depot',
    employmentType: 'Full-time Permanent',
    shift: 'Morning (06:00 - 14:00)',
    startDate: '',
    canEditLoads: false,
    bankName: '',
    bsb: '',
    accountNumber: '',
    emergencyName: '',
    emergencyRelation: 'Spouse',
    emergencyPhone: '',
    emergencyEmail: '',
    confirmed: false
  });

  const handleSaveDriver = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      alert('Please fill out Name and Phone number.');
      return;
    }
    if (!form.confirmed) {
      alert('Please confirm that all details are correct.');
      return;
    }

    const newDriver = {
      id: `DRV-${100 + drivers.length + 2}`,
      name: form.name,
      phone: form.phone,
      licenseClass: form.licenseClass.split(' (')[0],
      licenseCode: 'REG-' + Math.floor(100 + Math.random() * 900),
      region: form.depot.replace(' Depot', ''),
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80',
      isEditor: form.canEditLoads
    };

    setDrivers([newDriver, ...drivers]);
    setView('list');
    
    // Reset Form
    setForm({
      name: '',
      email: '',
      phone: '',
      dob: '',
      nationalId: '',
      address: '',
      licenseClass: 'NSW - HC (Heavy Combination)',
      licenseNumber: '',
      licenseExpiry: '',
      medicalExpiry: '',
      experience: '',
      msicAccess: false,
      dangerousGoods: false,
      whiteCard: false,
      depot: 'Sydney Central Depot',
      employmentType: 'Full-time Permanent',
      shift: 'Morning (06:00 - 14:00)',
      startDate: '',
      canEditLoads: false,
      bankName: '',
      bsb: '',
      accountNumber: '',
      emergencyName: '',
      emergencyRelation: 'Spouse',
      emergencyPhone: '',
      emergencyEmail: '',
      confirmed: false
    });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-grow bg-[#F8FAFC] w-full text-left font-sans custom-scrollbar overflow-y-auto">
      
      {view === 'list' && (
        <div className="p-6">
          {/* ── Header Row ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-tight">Drivers</h1>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Manage fleet vehicle operators, credentials, and deployment zones.</p>
              </div>
            </div>
            <button 
              onClick={() => setView('add')}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#FACC15] hover:bg-yellow-500 rounded-xl text-xs font-bold text-slate-950 transition-colors shadow-xs uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              <span>New Driver</span>
            </button>
          </div>

          {/* ── Stats Row ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'ON DUTY NOW', val: '18', icon: <UserCheck className="w-4 h-4 text-emerald-500" />, iconBg: 'bg-emerald-50' },
              { label: 'ACTIVE TRIPS', val: '12', icon: <Truck className="w-4 h-4 text-blue-500" />, iconBg: 'bg-blue-50' },
              { label: 'AVG RATING', val: '4.85 ★', icon: <Star className="w-4 h-4 text-amber-500" fill="#f59e0b" />, iconBg: 'bg-amber-50' },
              { label: 'ALERTS', val: '02', icon: <Shield className="w-4 h-4 text-rose-500" />, iconBg: 'bg-rose-50' }
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 font-black tracking-wider uppercase">{stat.label}</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">{stat.val}</p>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${stat.iconBg}`}>
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          {/* ── Table Container ── */}
          <div className="bg-white rounded-[20px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            
            {/* Table Filters */}
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input 
                  type="text"
                  placeholder="Search drivers or regions..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-[11px] font-bold text-slate-400">Sort:</span>
                <select 
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="name">Driver Name</option>
                  <option value="id">Driver ID</option>
                  <option value="region">Region</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left" style={{ minWidth: 800 }}>
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">IDENTITY &amp; ID</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">CREDENTIALS</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">PRIMARY REGION</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">STATUS</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDrivers.map((driver) => (
                    <tr key={driver.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={driver.avatar} 
                            alt={driver.name} 
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-slate-900">{driver.name}</span>
                              {driver.isEditor && (
                                <span className="px-1.5 py-0.5 bg-purple-50 border border-purple-100 text-purple-700 text-[8px] font-black uppercase rounded">
                                  Editor
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{driver.id} • {driver.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs font-bold text-slate-800">{driver.licenseClass}</p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{driver.licenseCode}</p>
                      </td>
                      <td className="px-5 py-4 text-xs font-bold text-slate-800">
                        {driver.region}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                          driver.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}>
                          ● {driver.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button 
                          onClick={() => { setSelectedDriver(driver); setView('manage'); }}
                          className="px-4 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700 transition-colors uppercase tracking-wider"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {view === 'add' && (
        <form onSubmit={handleSaveDriver} className="p-6 max-w-[1200px] mx-auto flex flex-col gap-6">
          {/* ── Add New Driver Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => setView('list')} 
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
              >
                <ArrowLeft className="w-4 h-4 text-slate-600" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 leading-tight">Add New Driver</h1>
                  <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-md uppercase">NEW</span>
                </div>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Register a new fleet operator with full profile, documents, and work setup.</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <button 
                type="button"
                onClick={() => setView('list')}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#FACC15] hover:bg-yellow-500 rounded-xl text-xs font-bold text-slate-950 transition-colors shadow-xs"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Save Driver</span>
              </button>
            </div>
          </div>

          {/* ── Two Column Body Grid ── */}
          <div className="grid grid-cols-12 gap-5 items-start">
            
            {/* LEFT COLUMN: Personal Info, License, Emergency Contact */}
            <div className="col-span-12 lg:col-span-8 space-y-5">
              
              {/* Card 1: Personal Information */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-slate-500">
                  <User className="w-4 h-4" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1">Full Legal Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Jack Taylor"
                      required
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1">Email Address *</label>
                    <input 
                      type="email" 
                      placeholder="driver@company.com"
                      required
                      value={form.email}
                      onChange={(e) => setForm({...form, email: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1">Mobile Phone *</label>
                    <input 
                      type="text" 
                      placeholder="+61 412 000 000"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({...form, phone: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1">Date of Birth *</label>
                    <input 
                      type="date"
                      required
                      value={form.dob}
                      onChange={(e) => setForm({...form, dob: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1">National ID / Passport *</label>
                    <input 
                      type="text" 
                      placeholder="ID or passport number"
                      required
                      value={form.nationalId}
                      onChange={(e) => setForm({...form, nationalId: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1">Home Address *</label>
                    <input 
                      type="text" 
                      placeholder="Full residential address"
                      required
                      value={form.address}
                      onChange={(e) => setForm({...form, address: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: License & Certifications */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-slate-500">
                  <FileText className="w-4 h-4" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">License &amp; Certifications</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1">License Class *</label>
                    <select 
                      value={form.licenseClass}
                      onChange={(e) => setForm({...form, licenseClass: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 bg-white"
                    >
                      <option>NSW - HC (Heavy Combination)</option>
                      <option>NSW - MC (Multi Combination)</option>
                      <option>VIC - HC (Heavy Combination)</option>
                      <option>VIC - MC (Multi Combination)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1">License Number *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. HR-4412"
                      required
                      value={form.licenseNumber}
                      onChange={(e) => setForm({...form, licenseNumber: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1">License Expiry Date *</label>
                    <input 
                      type="date"
                      required
                      value={form.licenseExpiry}
                      onChange={(e) => setForm({...form, licenseExpiry: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1">Medical Certificate Expiry *</label>
                    <input 
                      type="date"
                      required
                      value={form.medicalExpiry}
                      onChange={(e) => setForm({...form, medicalExpiry: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1">Years of Experience *</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 5"
                      required
                      value={form.experience}
                      onChange={(e) => setForm({...form, experience: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  
                  {/* Access Checkboxes */}
                  <div className="sm:col-span-2 space-y-2 mt-2">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">SPECIAL CERTIFICATIONS &amp; ACCESS</p>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={form.msicAccess}
                        onChange={(e) => setForm({...form, msicAccess: e.target.checked})}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>MSIC Access (Maritime Security Identification Card)</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={form.dangerousGoods}
                        onChange={(e) => setForm({...form, dangerousGoods: e.target.checked})}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Dangerous Goods (DG) Certificate</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={form.whiteCard}
                        onChange={(e) => setForm({...form, whiteCard: e.target.checked})}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Construction White Card (General Construction Induction)</span>
                    </label>
                  </div>

                  {/* Document Scans */}
                  <div className="sm:col-span-2 grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider mb-1">ID / LICENSE — FRONT</p>
                      <div className="border border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors">
                        <Upload className="w-5 h-5 text-slate-400 mb-1" />
                        <span className="text-[10px] text-slate-500 font-bold">Upload front scan</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider mb-1">ID / LICENSE — BACK</p>
                      <div className="border border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors">
                        <Upload className="w-5 h-5 text-slate-400 mb-1" />
                        <span className="text-[10px] text-slate-500 font-bold">Upload back scan</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Card 3: Emergency Contact */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-slate-500">
                  <AlertCircle className="w-4 h-4" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">Emergency Contact</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1">Contact Name *</label>
                    <input 
                      type="text" 
                      placeholder="Full name"
                      required
                      value={form.emergencyName}
                      onChange={(e) => setForm({...form, emergencyName: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1">Relationship *</label>
                    <select 
                      value={form.emergencyRelation}
                      onChange={(e) => setForm({...form, emergencyRelation: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 bg-white"
                    >
                      <option>Spouse</option>
                      <option>Child</option>
                      <option>Sibling</option>
                      <option>Parent</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1">Contact Phone *</label>
                    <input 
                      type="text" 
                      placeholder="+61 400 000 000"
                      required
                      value={form.emergencyPhone}
                      onChange={(e) => setForm({...form, emergencyPhone: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1">Contact Email</label>
                    <input 
                      type="email" 
                      placeholder="email@example.com"
                      value={form.emergencyEmail}
                      onChange={(e) => setForm({...form, emergencyEmail: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Photo, Setup, Permissions, Payroll */}
            <div className="col-span-12 lg:col-span-4 space-y-5">
              
              {/* Card A: Profile Photo */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider mb-2">PROFILE PHOTO</p>
                <div className="border border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors">
                  <Upload className="w-6 h-6 text-slate-400 mb-2" />
                  <span className="text-xs font-black text-slate-800">Upload Driver Photo</span>
                  <span className="text-[9px] text-slate-400 font-bold mt-1">JPEG OR PNG — MAX 5MB</span>
                </div>
              </div>

              {/* Card B: Work Setup */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3.5">
                <p className="text-[9px] text-slate-400 font-black tracking-wider uppercase">WORK SETUP</p>
                <div>
                  <label className="text-[10px] text-slate-400 font-black uppercase block mb-1">ASSIGNED DEPOT *</label>
                  <select 
                    value={form.depot}
                    onChange={(e) => setForm({...form, depot: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 bg-white"
                  >
                    <option>Sydney Central Depot</option>
                    <option>Melbourne SE Yard</option>
                    <option>Adelaide Depot</option>
                    <option>Brisbane Yard</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-black uppercase block mb-1">EMPLOYMENT TYPE *</label>
                  <select 
                    value={form.employmentType}
                    onChange={(e) => setForm({...form, employmentType: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 bg-white"
                  >
                    <option>Full-time Permanent</option>
                    <option>Contractor / Owner Op</option>
                    <option>Casual / On-Call</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-black uppercase block mb-1">DEFAULT SHIFT *</label>
                  <select 
                    value={form.shift}
                    onChange={(e) => setForm({...form, shift: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 bg-white"
                  >
                    <option>Morning (06:00 - 14:00)</option>
                    <option>Afternoon (14:00 - 22:00)</option>
                    <option>Night Shift (22:00 - 06:00)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-black uppercase block mb-1">START DATE *</label>
                  <input 
                    type="date"
                    required
                    value={form.startDate}
                    onChange={(e) => setForm({...form, startDate: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 bg-white"
                  />
                </div>
              </div>

              {/* Card C: App & Permissions */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <p className="text-[9px] text-slate-400 font-black tracking-wider uppercase">APP &amp; PERMISSIONS</p>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800">Can Edit Loads</p>
                    <p className="text-[9.5px] text-slate-400 font-semibold leading-relaxed mt-0.5">
                      Granting this allows the driver to modify vehicle details, stock numbers, and cargo items in active loads.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer mt-0.5 shrink-0">
                    <input 
                      type="checkbox"
                      checked={form.canEditLoads}
                      onChange={(e) => setForm({...form, canEditLoads: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button 
                    type="button"
                    onClick={() => alert('SMS invitation sent to driver.')}
                    className="py-2 bg-[#FACC15] hover:bg-yellow-500 rounded-lg text-[10px] font-bold text-slate-900 text-center uppercase tracking-wider shadow-xs"
                  >
                    SMS Invite
                  </button>
                  <button 
                    type="button"
                    onClick={() => alert('Email invitation sent to driver.')}
                    className="py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-[10px] font-bold text-slate-700 text-center uppercase tracking-wider bg-white shadow-xs"
                  >
                    Email Invite
                  </button>
                </div>
              </div>

              {/* Card D: Bank & Payroll */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3.5">
                <p className="text-[9px] text-slate-400 font-black tracking-wider uppercase">BANK &amp; PAYROLL</p>
                <div>
                  <label className="text-[10px] text-slate-400 font-black uppercase block mb-1">BANK NAME *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Commonwealth Bank"
                    required
                    value={form.bankName}
                    onChange={(e) => setForm({...form, bankName: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 font-black uppercase block mb-1">BSB NUMBER *</label>
                    <input 
                      type="text" 
                      placeholder="062-000"
                      required
                      value={form.bsb}
                      onChange={(e) => setForm({...form, bsb: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-black uppercase block mb-1">ACCOUNT NUMBER *</label>
                    <input 
                      type="text" 
                      placeholder="1234 5678"
                      required
                      value={form.accountNumber}
                      onChange={(e) => setForm({...form, accountNumber: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Compliance Notice Warning Card */}
              <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px] font-semibold text-amber-800 leading-normal">
                  <p className="font-bold text-amber-900">Compliance Notice</p>
                  <p className="mt-0.5 text-[10px] text-amber-700">All driver profiles are subject to verification. Documents will be reviewed within 24-48 hours before activation.</p>
                </div>
              </div>

              {/* Confirmation Checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer mt-2 text-left">
                <input 
                  type="checkbox"
                  required
                  checked={form.confirmed}
                  onChange={(e) => setForm({...form, confirmed: e.target.checked})}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 shrink-0 mt-0.5"
                />
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide leading-snug select-none">
                  I CONFIRM ALL DETAILS ARE CORRECT AND VERIFIED
                </span>
              </label>

            </div>

          </div>
        </form>
      )}

      {view === 'manage' && selectedDriver && (
        <div className="p-6 max-w-[1280px] mx-auto flex flex-col gap-6 animate-fadeIn">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <button 
                type="button"
                onClick={() => { setView('list'); setSelectedDriver(null); setIsEditingProfile(false); }} 
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors border border-slate-200 bg-white shrink-0 shadow-xs cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-slate-600" />
              </button>
              
              <img 
                src={selectedDriver.avatar} 
                alt={selectedDriver.name} 
                className="w-14 h-14 rounded-[14px] object-cover border border-slate-200 shrink-0"
              />
              
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 leading-tight">{selectedDriver.name}</h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    selectedDriver.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {selectedDriver.status === 'ACTIVE' ? 'ACTIVE' : 'ON TRIP'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                  {selectedDriver.id} - HEAVY TRUCK - {selectedDriver.region.toUpperCase()}
                </p>
                <div className="flex items-center gap-1.5 mt-1 text-amber-500 text-xs">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} className="w-3 h-3 fill-amber-500 stroke-none" />
                    ))}
                  </div>
                  <span className="font-extrabold text-[10px] text-slate-500">4.8 Rating</span>
                </div>
              </div>
            </div>

            {isEditingProfile ? (
              <div className="flex items-center gap-2.5">
                <button 
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={saveProfileEdits}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#FACC15] hover:bg-yellow-500 rounded-xl text-xs font-bold text-slate-950 transition-colors shadow-xs cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  <span>Save Changes</span>
                </button>
              </div>
            ) : (
              <button 
                type="button"
                onClick={startEditing}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 bg-white transition-colors shadow-xs cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {/* Body Grid */}
          <div className="grid grid-cols-12 gap-5 items-start">
            
            {/* Left Side: Contact, Operational, Legal, Permissions */}
            <div className="col-span-12 lg:col-span-4 space-y-5">
              
              {/* Contact Details Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-slate-400 border-b border-slate-100 pb-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Contact Details</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">FULL NAME</p>
                    {isEditingProfile ? (
                      <input 
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs mt-1 text-slate-800 focus:outline-none focus:border-indigo-500"
                      />
                    ) : (
                      <p className="text-xs font-bold text-slate-800 mt-0.5">{selectedDriver.name}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">PHONE</p>
                    {isEditingProfile ? (
                      <input 
                        type="text"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs mt-1 text-slate-800 focus:outline-none focus:border-indigo-500"
                      />
                    ) : (
                      <p className="text-xs font-bold text-slate-800 mt-0.5">{selectedDriver.phone}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">EMAIL</p>
                    {isEditingProfile ? (
                      <input 
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs mt-1 text-slate-800 focus:outline-none focus:border-indigo-500"
                      />
                    ) : (
                      <p className="text-xs font-bold text-slate-800 mt-0.5">{selectedDriver.email || `${selectedDriver.name.toLowerCase().replace(' ', '.')}@hero.com`}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">ADDRESS</p>
                    {isEditingProfile ? (
                      <textarea 
                        rows={2}
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs mt-1 text-slate-800 focus:outline-none focus:border-indigo-500"
                      />
                    ) : (
                      <p className="text-xs font-bold text-slate-800 mt-0.5 leading-relaxed">
                        {selectedDriver.address || '14 Parramatta Rd, Strathfield NSW 2135'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Operational Assignment Card */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-sm space-y-4 text-white">
                <div className="flex items-center gap-2 text-slate-400 border-b border-slate-800 pb-2">
                  <Activity className="w-4 h-4 text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Operational Assignment</span>
                </div>
                <div className="space-y-3.5">
                  <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">ASSIGNED DEPOT</p>
                    {isEditingProfile ? (
                      <select 
                        value={editForm.region}
                        onChange={(e) => setEditForm({ ...editForm, region: e.target.value })}
                        className="w-full border border-slate-700 bg-slate-800 rounded-lg px-2 py-1.5 text-xs mt-1 text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option>Melbourne SE</option>
                        <option>Adelaide Depot</option>
                        <option>Sydney Central</option>
                        <option>Brisbane NW</option>
                      </select>
                    ) : (
                      <p className="text-xs font-bold text-slate-200 mt-0.5">{selectedDriver.region}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">SHIFT TYPE</p>
                    <p className="text-xs font-bold text-slate-200 mt-0.5">Full-time Permanent</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">ASSET PAIRING</p>
                    <div className="mt-1.5 p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-white">TRK-102</p>
                        <p className="text-[9px] font-bold text-slate-500 mt-0.5">XQG-984</p>
                      </div>
                      <button type="button" onClick={() => alert('Viewing asset TRK-102 details...')} className="text-[10px] font-black text-[#FACC15] hover:underline uppercase tracking-wider">
                        VIEW
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legal & Compliance Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-slate-400 border-b border-slate-100 pb-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Legal &amp; Compliance</span>
                </div>
                <div className="space-y-3.5">
                  {/* License */}
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start justify-between">
                    <div className="w-full">
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">DRIVER'S LICENSE</p>
                      {isEditingProfile ? (
                        <div className="space-y-1.5 mt-1">
                          <select 
                            value={editForm.licenseClass}
                            onChange={(e) => setEditForm({ ...editForm, licenseClass: e.target.value })}
                            className="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 focus:outline-none"
                          >
                            <option>NSW - HC Class</option>
                            <option>NSW - MC Class</option>
                            <option>VIC - HC Class</option>
                            <option>VIC - MC Class</option>
                          </select>
                          <input 
                            type="text" 
                            value={editForm.licenseCode} 
                            onChange={(e) => setEditForm({ ...editForm, licenseCode: e.target.value })} 
                            className="w-full border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 focus:outline-none"
                            placeholder="License Code"
                          />
                        </div>
                      ) : (
                        <>
                          <p className="text-xs font-black text-slate-800 mt-1">{selectedDriver.licenseClass}</p>
                          <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{selectedDriver.licenseCode}</p>
                        </>
                      )}
                      <div className="flex items-center justify-between w-full mt-3 gap-8">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">EXPIRATION</span>
                        <span className="text-[10px] font-bold text-slate-700">12 Sep 2028</span>
                      </div>
                    </div>
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                  </div>

                  {/* Medical */}
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start justify-between">
                    <div>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">MEDICAL CERTIFICATE</p>
                      <p className="text-xs font-black text-slate-800 mt-1">Fitness for Duty</p>
                      <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Dept. Transport</p>
                      <div className="flex items-center justify-between w-full mt-3 gap-8">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">EXPIRATION</span>
                        <span className="text-[10px] font-bold text-slate-700">15 Oct 2026</span>
                      </div>
                    </div>
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                  </div>

                  {/* Badges */}
                  <div className="space-y-2.5">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">SPECIAL CERTIFICATIONS</p>
                    {[
                      { label: 'MSIC Access', status: 'ACTIVE' },
                      { label: 'Dangerous Goods (DG)', status: 'ACTIVE' },
                      { label: 'Construction White Card', status: 'ACTIVE' }
                    ].map((cert, ci) => (
                      <div key={ci} className="flex justify-between items-center bg-slate-50/50 border border-slate-100 px-3 py-2 rounded-xl">
                        <span className="text-xs font-bold text-slate-700">{cert.label}</span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black rounded-full uppercase tracking-wider">
                          {cert.status}
                        </span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

              {/* Permission Settings Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-slate-400 border-b border-slate-100 pb-2">
                  <User className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Permission Settings</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black text-slate-900">Can Edit Loads</p>
                    <p className="text-[9px] text-slate-400 font-semibold leading-relaxed mt-0.5">
                      Allows driver to modify load items and details.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-[9px] font-black uppercase tracking-wider rounded-md shrink-0">
                    AUTHORIZED
                  </span>
                </div>
              </div>

            </div>

            {/* Right Side: stats, live assignment, history */}
            <div className="col-span-12 lg:col-span-8 space-y-5">
              
              {/* Stats Card Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'DELIVERED', val: '284', color: 'text-slate-900' },
                  { label: 'ON-TIME', val: '96.2%', color: 'text-emerald-600' },
                  { label: 'RATING', val: '4.8 ★', color: 'text-amber-500' },
                  { label: 'DELAYS', val: '11', color: 'text-rose-600' }
                ].map((st, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-center">
                    <p className="text-[9px] text-slate-400 font-black tracking-wider uppercase">{st.label}</p>
                    <p className={`text-xl font-black mt-1.5 ${st.color}`}>{st.val}</p>
                  </div>
                ))}
              </div>

              {/* Live Assignment Card */}
              <div className="bg-white rounded-2xl border border-slate-200 border-l-4 border-l-emerald-500 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4.5 h-4.5 text-emerald-500" />
                    <span className="text-[10.5px] font-black uppercase tracking-widest text-emerald-600">Live Assignment</span>
                  </div>
                  <span className="px-2 py-0.5 bg-white text-emerald-500 border border-emerald-200 text-[9px] font-black rounded-md uppercase tracking-wider">
                    ACTIVE
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">LOAD REFERENCE</p>
                    <p className="text-sm font-black text-slate-950 mt-1">SHP-20481</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">CURRENT ETA</p>
                    <p className="text-sm font-black text-slate-950 mt-1 flex items-center sm:justify-end gap-1.5">
                      <Clock className="w-4 h-4 text-amber-500" /> 3:45 PM
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  {/* Route Path */}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200/60 flex items-center justify-center text-slate-400 shrink-0 shadow-2xs">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-[8.5px] text-slate-400 font-black uppercase tracking-wider leading-none">ROUTE PATH</p>
                      <p className="text-xs font-bold text-slate-800 mt-1.5 leading-none">
                        Sydney Port <span className="text-slate-400 font-normal mx-0.5">›</span> Blacktown DC
                      </p>
                    </div>
                  </div>

                  {/* Payload Measurement */}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200/60 flex items-center justify-center text-amber-500 shrink-0 shadow-2xs">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[8.5px] text-slate-400 font-black uppercase tracking-wider leading-none">PAYLOAD MEASUREMENT</p>
                      <p className="text-xs font-bold text-slate-800 mt-1.5 leading-none">18.4t</p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-400 uppercase tracking-widest">ROUTE PROGRESS</span>
                    <span className="text-emerald-600">85% COMPLETE</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>

              {/* Job History Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4.5 h-4.5 text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Job History</span>
                  </div>
                  <button type="button" onClick={() => alert('Viewing all job history...')} className="text-[10.5px] font-black text-indigo-600 hover:underline uppercase tracking-wider">
                    VIEW ALL
                  </button>
                </div>
                
                <div className="divide-y divide-slate-100">
                  {[
                    { ref: 'SHP-20481', route: 'Sydney Port ➔ Blacktown DC', status: 'IN TRANSIT', statusColor: 'text-amber-500', date: 'TODAY' },
                    { ref: 'SHP-20477', route: 'Chullora DC ➔ Richmond Depot', status: 'DELIVERED', statusColor: 'text-emerald-500', date: 'YESTERDAY' },
                    { ref: 'SHP-20469', route: 'Port Botany ➔ Penrith Depot', status: 'DELIVERED', statusColor: 'text-emerald-500', date: '05 APR' },
                    { ref: 'SHP-20461', route: 'Blacktown DC ➔ Newcastle Depot', status: 'DELIVERED', statusColor: 'text-emerald-500', date: '04 APR' }
                  ].map((job, ji) => (
                    <div key={ji} className="py-3.5 flex justify-between items-center first:pt-1 last:pb-1">
                      <div>
                        <p className="text-xs font-black text-slate-900">{job.ref}</p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{job.route}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-black uppercase tracking-wider block ${job.statusColor}`}>{job.status}</span>
                        <span className="text-[9px] text-slate-400 font-bold block mt-0.5">{job.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Animation Styles */}
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(4px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fadeIn {
              animation: fadeIn 0.2s ease-out forwards;
            }
          `}</style>

        </div>
      )}

    </div>
  );
}
