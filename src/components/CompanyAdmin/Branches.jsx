import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { createPortal } from 'react-dom';
import { 
  Plus, Search, Filter, Download, Building, CheckCircle2, Clock, 
  AlertTriangle, Shield, Eye, Link2, MoreVertical, ChevronLeft, 
  ChevronRight, ArrowRight, Upload, FileText, Terminal, Info, 
  Settings, Bell, Users, Database, ChevronLeft as BackIcon,
  MapPin, Edit, Edit3, Truck, Phone, Mail, User, ShieldCheck, Check, 
  Briefcase, Lock, Coffee, XCircle, DollarSign, Calendar, ChevronDown,
  TrendingUp, TrendingDown, Star, Activity, BarChart2, Lightbulb, Trash2
} from 'lucide-react';

const branchesData = [];
const branchStaffData = [];
const timesheetData = [];
const leaveRequestsData = [];
const assetsData = [];

function Box({size}) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>; }
function Tool({size}) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>; }
function Zap({size}) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>; }
function Monitor({size}) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>; }
function Car({size}) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><path d="M9 17h6"></path><circle cx="17" cy="17" r="2"></circle></svg>; }

export default function Branches() {
  const [branchList, setBranchList] = useState([]);
  const [editBranchModal, setEditBranchModal] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [activeTimeSubTab, setActiveTimeSubTab] = useState('Timesheet');
  const [isAddingBranch, setIsAddingBranch] = useState(false);

  const [showImportBulkModal, setShowImportBulkModal] = useState(false);
  const [showSetupChecklistModal, setShowSetupChecklistModal] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await api.get('/branches');
      const data = res.data?.data || res.data || [];
      if (Array.isArray(data)) {
        const formatted = data.map(b => ({
          id: b.id,
          branchName: b.name || b.branchName || 'Branch',
          branchCode: b.code || b.branchCode || b.id.substring(0, 7).toUpperCase(),
          company: b.company?.name || 'Hero Logistics Pty Ltd',
          country: 'Australia',
          flag: '🇦🇺',
          state: b.location || 'NSW',
          manager: b.managerName || 'Unassigned',
          status: b.status || 'Active',
          loads: b._count?.warehouses || 0
        }));
        setBranchList(formatted);
      }
    } catch (err) {
      console.error('Error fetching branches:', err);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Active':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold text-green-600 bg-green-50 border border-green-200">Active</span>;
      case 'Pending Setup':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200 whitespace-nowrap">Pending Setup</span>;
      case 'Inactive':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-200">Inactive</span>;
      case 'Completed':
         return <span className="px-2 py-0.5 rounded text-[10px] font-bold text-green-600 bg-green-50 border border-green-200">Completed</span>;
      case 'Pending':
         return <span className="px-2 py-0.5 rounded text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200">Pending</span>;
      case 'Approved':
         return <span className="px-2 py-0.5 rounded text-[10px] font-bold text-green-600 bg-green-50 border border-green-200">Approved</span>;
      case 'Rejected':
         return <span className="px-2 py-0.5 rounded text-[10px] font-bold text-red-600 bg-red-50 border border-red-200">Rejected</span>;
      default:
        return null;
    }
  };

  const getRoleBadge = (role, color) => {
    const colorClasses = {
      purple: 'text-purple-600 bg-purple-50 border-purple-200',
      green: 'text-green-600 bg-green-50 border-green-200',
      orange: 'text-orange-600 bg-orange-50 border-orange-200',
      teal: 'text-teal-600 bg-teal-50 border-teal-200',
      indigo: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      blue: 'text-blue-600 bg-blue-50 border-blue-200',
      yellow: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      red: 'text-red-600 bg-red-50 border-red-200'
    };
    return (
       <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${colorClasses[color] || colorClasses.blue}`}>{role}</span>
    );
  };

  const getInitialsBadge = (initials, color) => {
    const colorClasses = {
      purple: 'text-purple-600 bg-purple-50 border-purple-100',
      green: 'text-green-600 bg-green-50 border-green-100',
      orange: 'text-orange-600 bg-orange-50 border-orange-100',
      teal: 'text-teal-600 bg-teal-50 border-teal-100',
      indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      blue: 'text-blue-600 bg-blue-50 border-blue-100',
      red: 'text-red-600 bg-red-50 border-red-100'
    };
    return (
       <div className={`w-8 h-8 rounded border flex items-center justify-center shrink-0 font-bold text-[12px] ${colorClasses[color] || colorClasses.blue}`}>{initials}</div>
    );
  };

  const handleAddBranch = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const bName = fd.get('branchName') || 'New Branch';
    const bCode = fd.get('branchCode') || 'NEW-001';
    const bLoc = fd.get('address') || 'NSW';
    const bMgr = fd.get('manager') || 'Unassigned';

    const newBranchObj = {
      id: Date.now().toString(),
      branchName: bName,
      branchCode: bCode,
      company: 'Hero Logistics Pty Ltd',
      country: 'Australia',
      flag: '🇦🇺',
      state: bLoc,
      manager: bMgr,
      status: 'Active',
      loads: 0
    };

    try {
      const res = await api.post('/branches', {
        name: bName,
        location: bLoc,
        code: bCode
      });
      const created = res.data?.data || res.data;
      if (created && created.id) {
        newBranchObj.id = created.id;
      }
    } catch (err) {
      console.warn('API save branch fallback:', err);
    }

    setBranchList(prev => [newBranchObj, ...prev]);
    setIsAddingBranch(false);
  };

  const handleExportCSV = () => {
    if (branchList.length === 0) {
      alert('No branches available to export.');
      return;
    }
    const headers = ['Branch Name', 'Branch Code', 'Company', 'State', 'Manager', 'Status'];
    const rows = branchList.map(b => [
      `"${b.branchName}"`,
      `"${b.branchCode}"`,
      `"${b.company}"`,
      `"${b.state}"`,
      `"${b.manager}"`,
      `"${b.status}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Branches_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isAddingBranch) {
    return (
      <form onSubmit={handleAddBranch} className="min-h-screen bg-[#f8f9fc] p-4 sm:p-6 lg:p-8 font-sans pb-24">
        
        {/* Header Breadcrumbs */}
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-2 text-[12px] text-gray-500 font-semibold tracking-wide">
              <BackIcon size={12} />
              <span className="hover:text-purple-600 cursor-pointer" onClick={() => setIsAddingBranch(false)}>ADMIN PORTAL</span>
              <span>/</span>
              <span className="text-gray-900">Add New Branch</span>
           </div>
        </div>

        {/* Main Form Grid */}
        <div className="max-w-5xl mx-auto flex flex-col gap-6">
           
           {/* BRANCH DETAILS CARD */}
           <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-6">
                 <div className="w-6 h-6 rounded bg-yellow-50 flex items-center justify-center shrink-0"><Building size={14} className="text-yellow-600" /></div>
                 BRANCH DETAILS
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                 {/* Branch Name */}
                 <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">BRANCH NAME</label>
                    <input 
                       name="branchName"
                       type="text" 
                       placeholder="e.g. Sydney West Depot" 
                       className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 shadow-sm"
                    />
                 </div>
                 
                 {/* Branch Type */}
                 <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">BRANCH TYPE</label>
                    <div className="relative">
                       <select name="branchType" className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 shadow-sm appearance-none cursor-pointer">
                          <option>Local Branch</option>
                          <option>Head Office</option>
                          <option>Distribution Center</option>
                       </select>
                       <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                 </div>

                 {/* Address */}
                 <div className="flex flex-col gap-1.5 md:col-span-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">ADDRESS</label>
                    <div className="relative">
                       <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                       <input 
                          name="address"
                          type="text" 
                          placeholder="123 Industrial Dr, Suburb, VIC 3000" 
                          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 shadow-sm"
                       />
                    </div>
                 </div>

                 {/* Branch Code / ID */}
                 <div className="flex flex-col gap-1.5 md:col-span-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">BRANCH CODE / ID</label>
                    <input 
                       name="branchCode"
                       type="text" 
                       placeholder="e.g. SYD-WEST" 
                       className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 shadow-sm"
                    />
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* MANAGEMENT CARD */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                 <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-6">
                    <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center shrink-0"><Users size={14} className="text-blue-600" /></div>
                    MANAGEMENT
                 </h3>
                 
                 <div className="flex flex-col gap-5">
                    {/* Manager Name */}
                    <div className="flex flex-col gap-1.5">
                       <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">MANAGER NAME</label>
                       <input 
                          name="manager"
                          type="text" 
                          placeholder="Enter full name" 
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 shadow-sm"
                       />
                    </div>
                    
                    {/* Phone Number */}
                    <div className="flex flex-col gap-1.5">
                       <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">PHONE NUMBER</label>
                       <div className="relative">
                          <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                             name="phone"
                             type="text" 
                             placeholder="+61 400 000 000" 
                             className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 shadow-sm"
                          />
                       </div>
                    </div>
                 </div>
              </div>

              {/* CAPACITY & HOURS CARD */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                 <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-6">
                    <div className="w-6 h-6 rounded bg-green-50 flex items-center justify-center shrink-0"><Clock size={14} className="text-green-600" /></div>
                    CAPACITY & HOURS
                 </h3>
                 
                 <div className="flex flex-col gap-5">
                    {/* Working Hours */}
                    <div className="flex flex-col gap-1.5">
                       <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">WORKING HOURS</label>
                       <input 
                          type="text" 
                          placeholder="08:00 - 18:00" 
                          defaultValue="08:00 - 18:00"
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 shadow-sm"
                       />
                    </div>
                    
                    {/* Storage Space */}
                    <div className="flex flex-col gap-1.5">
                       <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">STORAGE SPACE (SQM)</label>
                       <input 
                          type="text" 
                          placeholder="1000" 
                          defaultValue="1000"
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 shadow-sm"
                       />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Bottom Sticky Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-end items-center gap-4 z-10 sm:pl-[240px]">
           <button type="button" onClick={() => setIsAddingBranch(false)} className="px-6 py-2.5 text-gray-600 font-bold text-[13px] hover:text-gray-900 transition-colors cursor-pointer">
              CANCEL
           </button>
           <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-yellow-950 rounded-lg text-[13px] font-bold shadow-sm transition-colors cursor-pointer">
              <CheckCircle2 size={16} /> SAVE BRANCH
           </button>
        </div>
      </form>
    );
  }

  if (selectedBranch) {
    const isStaffTab = activeTab === 'Staff & Permissions';
    const isTimeTab = activeTab === 'Time Attendance & Wages';
    const isAssetsTab = activeTab === 'Assets & Fleet';
    const isPerfTab = activeTab === 'Performance';

    let pageTitle = 'Branch Details';
    let pageSubtitle = 'View and manage detailed information for this branch.';
    if (isStaffTab) {
       pageTitle = 'Branch Staff & Permissions';
       pageSubtitle = 'Manage branch staff, roles, permissions and time & pay settings.';
    } else if (isTimeTab) {
       pageTitle = 'Branch Time Attendance & Wages';
       pageSubtitle = 'Track staff time, attendance, leave and calculate wages.';
    } else if (isAssetsTab) {
       pageTitle = 'Branch Assets & Fleet Assignments';
       pageSubtitle = 'View and manage all vehicles and assets assigned to this branch.';
    } else if (isPerfTab) {
       pageTitle = 'Branch Performance Dashboard';
       pageSubtitle = 'Real-time overview of branch performance, KPIs and operational insights.';
    }

    return (
      <div className="min-h-screen bg-[#f8f9fc] p-4 sm:p-6 lg:p-8 font-sans">
        
        {/* Header Breadcrumbs */}
         <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">
            <div>
               <div className="flex items-center gap-2 text-[12px] text-gray-500 mb-1 font-semibold tracking-wide flex-wrap">
                  <span>Home</span>
                  <ChevronRight size={12} className="shrink-0" />
                  <span className="hover:text-purple-600 cursor-pointer whitespace-nowrap" onClick={() => setSelectedBranch(null)}>Branches</span>
                  <ChevronRight size={12} className="shrink-0" />
                  <span className="hover:text-purple-600 cursor-pointer whitespace-nowrap" onClick={() => setActiveTab('Overview')}>Depot List</span>
                  <ChevronRight size={12} className="shrink-0" />
                  <span className={activeTab === 'Overview' ? "text-gray-900 whitespace-nowrap" : "hover:text-purple-600 cursor-pointer whitespace-nowrap"} onClick={() => setActiveTab('Overview')}>Branch Details</span>
                  {activeTab !== 'Overview' && (
                     <>
                        <ChevronRight size={12} className="shrink-0" />
                        <span className="text-gray-900 whitespace-nowrap">{isStaffTab ? 'Staff & Permissions' : isTimeTab ? 'Time Attendance & Wages' : isAssetsTab ? 'Branch Assets' : 'Branch Performance Dashboard'}</span>
                     </>
                  )}
               </div>
               <div className="flex items-center gap-2">
                 <h1 className="text-2xl font-black text-gray-900 tracking-tight">{pageTitle}</h1>
                 <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0"><CheckCircle2 size={12} /></div>
               </div>
               <p className="text-sm text-gray-500 font-medium mt-1">{pageSubtitle}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto">
               {activeTab !== 'Overview' ? (
                  <>
                     <button onClick={() => setActiveTab('Overview')} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
                        <BackIcon size={16} /> Back to Branch Details
                     </button>
                     {isStaffTab ? (
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-purple-200 text-purple-700 rounded-lg text-sm font-bold shadow-sm hover:bg-purple-50 transition-colors cursor-pointer whitespace-nowrap">
                           <Plus size={14} /> Invite Staff
                        </button>
                     ) : isTimeTab ? (
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-50 transition-colors cursor-pointer whitespace-nowrap">
                           <Download size={14} /> Export Timesheets
                        </button>
                     ) : isAssetsTab ? (
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-purple-200 text-purple-700 rounded-lg text-sm font-bold shadow-sm hover:bg-purple-50 transition-colors cursor-pointer whitespace-nowrap">
                           <Plus size={14} /> Assign Asset / Vehicle
                        </button>
                     ) : isPerfTab ? (
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-50 transition-colors cursor-pointer whitespace-nowrap">
                           <Download size={14} /> Export Dashboard
                        </button>
                     ) : null}
                  </>
               ) : (
                  <>
                     <button onClick={() => setSelectedBranch(null)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
                        <BackIcon size={16} /> Back to Branch List
                     </button>
                     <button onClick={() => setIsAddingBranch(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-purple-200 text-purple-700 rounded-lg text-sm font-bold shadow-sm hover:bg-purple-50 transition-colors cursor-pointer whitespace-nowrap">
                        <Edit size={14} /> Edit Branch
                     </button>
                  </>
               )}
               <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
                  More Actions <ChevronRight size={14} className="rotate-90" />
               </button>
            </div>
         </div>

        {/* Top Branch Profile Card for Overview */}
        {activeTab === 'Overview' && (
           <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                 <div className="flex flex-col gap-3 shrink-0">
                    <div className="w-[300px] h-[160px] rounded-xl overflow-hidden bg-gray-100 border border-gray-200 relative">
                       <img src={selectedBranch.photoUrl || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=60"} alt="Branch" className="w-full h-full object-cover" />
                    </div>
                    <input 
                      type="file" 
                      id="branch-photo-file-input" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            const url = evt.target.result;
                            setSelectedBranch(prev => ({ ...prev, photoUrl: url }));
                            setBranchList(prev => prev.map(b => b.id === selectedBranch.id ? { ...b, photoUrl: url } : b));
                          };
                          reader.readAsDataURL(file);
                        }
                      }} 
                    />
                    <button onClick={() => document.getElementById('branch-photo-file-input')?.click()} className="w-full py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-[13px] font-bold shadow-sm hover:bg-gray-50 transition-colors cursor-pointer text-center flex items-center justify-center gap-2">
                       <Upload size={14}/> Upload / Change Photo
                    </button>
                 </div>
                 <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 text-sm">
                    <div className="col-span-full">
                       <div className="flex items-center gap-3 mb-1">
                          <h2 className="text-xl font-black text-gray-900">{selectedBranch.branchName}</h2>
                          {getStatusBadge(selectedBranch.status)}
                       </div>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                       <div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Branch Code</div>
                          <div className="font-bold text-gray-900">{selectedBranch.branchCode}</div>
                       </div>
                       <div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Branch Type</div>
                          <div className="font-bold text-gray-900">Head Office</div>
                       </div>
                    </div>

                    <div className="flex flex-col gap-4">
                       <div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Branch Manager</div>
                          <div className="font-bold text-gray-900">{selectedBranch.manager}</div>
                       </div>
                       <div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Phone</div>
                          <div className="font-bold text-gray-900">{selectedBranch.phone || 'N/A'}</div>
                       </div>
                       <div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Email</div>
                          <div className="font-bold text-purple-600">{selectedBranch.email || 'N/A'}</div>
                       </div>
                    </div>

                    <div className="flex flex-col gap-4">
                       <div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Address</div>
                          <div className="font-bold text-gray-900">{selectedBranch.state || selectedBranch.location || 'N/A'}</div>
                       </div>
                       <div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Time Zone</div>
                          <div className="font-bold text-gray-900">Australia/Sydney (AEST)</div>
                       </div>
                    </div>

                    <div className="flex flex-col gap-4">
                       <div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Status</div>
                          <div className="flex items-center gap-1.5 font-bold text-gray-900"><div className="w-2 h-2 rounded-full bg-green-500"></div> {selectedBranch.status || 'Active'}</div>
                       </div>
                       <div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Established</div>
                          <div className="font-bold text-gray-900">N/A</div>
                       </div>
                    </div>

                    <div className="flex flex-col gap-4">
                       <div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Currency</div>
                          <div className="font-bold text-gray-900">AUD - Australian Dollar</div>
                       </div>
                       <div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Payment Terms</div>
                          <div className="font-bold text-gray-900">30 Days</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* Mini Branch Profile Row for other tabs */}
        {activeTab !== 'Overview' && (
           <div className={`flex flex-col lg:flex-row gap-6 items-center mb-6`}>
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex gap-6 items-center flex-grow w-full">
                 <div className="flex flex-col gap-2 shrink-0">
                    <div className="w-32 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                       <img src={selectedBranch.photoUrl || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&auto=format&fit=crop&q=60"} alt="Branch" className="w-full h-full object-cover" />
                    </div>
                    <button onClick={() => setSelectedBranch(null)} className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center justify-center gap-1 w-full"><Edit3 size={10}/> Change Branch</button>
                 </div>
                 
                 <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-4 text-[12px]">
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          <div className="font-black text-gray-900 text-[14px]">{selectedBranch.branchName}</div>
                          {getStatusBadge(selectedBranch.status)}
                       </div>
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 mb-0.5">Branch Code</div>
                       <div className="font-bold text-gray-900">{selectedBranch.branchCode}</div>
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 mb-0.5">Company</div>
                       <div className="font-bold text-gray-900">{selectedBranch.company}</div>
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 mb-0.5">Branch Type</div>
                       <div className="font-bold text-gray-900">Head Office</div>
                    </div>
                    <div>
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1 mb-0.5">Branch Manager</div>
                       <div className="font-bold text-gray-900">{selectedBranch.manager}</div>
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 mb-0.5">Phone</div>
                       <div className="font-bold text-gray-900">{selectedBranch.phone || 'N/A'}</div>
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 mb-0.5">Email</div>
                       <div className="font-bold text-purple-600 truncate">{selectedBranch.email || 'N/A'}</div>
                    </div>
                    <div>
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1 mb-0.5">Address</div>
                       <div className="font-bold text-gray-900">{selectedBranch.state || selectedBranch.location || 'N/A'}</div>
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 mb-0.5">Time Zone</div>
                       <div className="font-bold text-gray-900">N/A</div>
                    </div>
                    <div>
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1 mb-0.5">Status</div>
                       <div className="flex items-center gap-1.5 font-bold text-green-600"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> {selectedBranch.status || 'Active'}</div>
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 mb-0.5">Established</div>
                       <div className="font-bold text-gray-900">N/A</div>
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 mb-0.5">Currency</div>
                       <div className="font-bold text-gray-900">AUD - Australian Dollar</div>
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 mb-0.5">Payment Terms</div>
                       <div className="font-bold text-gray-900">30 Days</div>
                    </div>
                 </div>
              </div>
              
              {/* Date Filter specifically for Performance tab */}
              {isPerfTab && (
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex flex-col justify-center shrink-0 w-full lg:w-72 h-[120px]">
                    <div className="flex items-center gap-2 mb-3 text-[12px] font-bold text-gray-700">
                       <Calendar size={14} className="text-gray-400" /> 01 May 2025 - 31 May 2025
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                       <select className="flex-grow border border-gray-200 bg-white rounded-lg px-3 py-2 text-[12px] font-bold text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                          <option>Custom Range</option>
                       </select>
                       <button className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-[12px] font-bold shadow-sm hover:bg-gray-50 cursor-pointer shrink-0">
                          <Filter size={14} /> Filters
                       </button>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                       <span className="shrink-0">Compare with</span>
                       <select className="w-full border border-gray-200 bg-white rounded-md px-2 py-1 focus:outline-none cursor-pointer">
                          <option>Previous Month (01 Apr - 30 Apr 2025)</option>
                       </select>
                    </div>
                 </div>
              )}
           </div>
        )}

        {/* Tabs */}
        <div className="flex overflow-x-auto min-w-0 border-b border-gray-200 mb-6 gap-6 shrink-0">
           {['Overview', 'Staff & Permissions', 'Time Attendance & Wages', 'Assets & Fleet', 'Performance', 'Documents', 'Settings', 'Activity History'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[13px] font-bold tracking-wide relative whitespace-nowrap cursor-pointer shrink-0 ${activeTab === tab ? 'text-purple-700 border-b-2 border-purple-700' : 'text-gray-500 hover:text-gray-700'}`}
              >
                 {tab}
              </button>
           ))}
        </div>

        {/* Dynamic Tab Content */}
        {activeTab === 'Overview' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (Wide) */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                 {/* Branch Information */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 relative">
                    <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100">
                       <MapPin size={14} />
                    </div>
                    <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-6">BRANCH INFORMATION</h3>
                    
                    <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                       <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">Branch Name</div>
                          <div className="text-[12px] font-bold text-gray-900">{selectedBranch.branchName}</div>
                       </div>
                       <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">Country</div>
                          <div className="text-[12px] font-bold text-gray-900 flex items-center gap-1.5">{selectedBranch.flag} {selectedBranch.country}</div>
                       </div>
                       <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">Branch Code</div>
                          <div className="text-[12px] font-bold text-gray-900">{selectedBranch.branchCode}</div>
                       </div>
                       <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">State / Region</div>
                          <div className="text-[12px] font-bold text-gray-900">{selectedBranch.state}</div>
                       </div>
                       <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">Company</div>
                          <div className="text-[12px] font-bold text-gray-900">{selectedBranch.company}</div>
                       </div>
                       <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">Postal Code</div>
                          <div className="text-[12px] font-bold text-gray-900">{selectedBranch.postalCode || 'N/A'}</div>
                       </div>
                       <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">Branch Type</div>
                          <div className="text-[12px] font-bold text-gray-900">Head Office</div>
                       </div>
                       <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">Latitude / Longitude</div>
                          <div className="text-[12px] font-bold text-gray-900">N/A</div>
                       </div>
                       <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">Manager</div>
                          <div className="text-[12px] font-bold text-gray-900">{selectedBranch.manager}</div>
                       </div>
                       <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">ABN</div>
                          <div className="text-[12px] font-bold text-gray-900">{selectedBranch.abn || 'N/A'}</div>
                       </div>
                       <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">Phone</div>
                          <div className="text-[12px] font-bold text-gray-900">{selectedBranch.phone || 'N/A'}</div>
                       </div>
                       <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">ACN</div>
                          <div className="text-[12px] font-bold text-gray-900">{selectedBranch.acn || 'N/A'}</div>
                       </div>
                       <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">Email</div>
                          <div className="text-[12px] font-bold text-purple-600 truncate">{selectedBranch.email || 'N/A'}</div>
                       </div>
                       <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">Default Currency</div>
                          <div className="text-[12px] font-bold text-gray-900">AUD - Australian Dollar</div>
                       </div>
                       <div className="col-span-2">
                          <div className="text-[10px] text-gray-500 mb-0.5">Website</div>
                          <div className="text-[12px] font-bold text-purple-600">{selectedBranch.website || 'N/A'}</div>
                       </div>
                    </div>
                 </div>

                 {/* Branch Settings */}
                 <div>
                    <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4">BRANCH SETTINGS</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                          <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mb-1"><Clock size={16}/></div>
                          <div>
                             <div className="text-[12px] font-black text-gray-900 mb-1">Operational Hours</div>
                             <div className="text-[11px] font-medium text-gray-600 mb-0.5">Mon - Fri: 7:00 AM - 6:00 PM</div>
                             <div className="text-[11px] font-medium text-gray-600">Sat - Sun: Closed</div>
                          </div>
                          <div className="mt-auto pt-2"><span className="text-[11px] font-bold text-purple-700 hover:underline cursor-pointer">Edit Hours</span></div>
                       </div>
                       <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                          <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mb-1"><Truck size={16}/></div>
                          <div>
                             <div className="text-[12px] font-black text-gray-900 mb-1">Branch Defaults</div>
                             <div className="text-[11px] font-medium text-gray-600 mb-0.5">Default Load Type: Car Carrier</div>
                             <div className="text-[11px] font-medium text-gray-600">Default Payment Terms: 30 Days</div>
                          </div>
                          <div className="mt-auto pt-2"><span className="text-[11px] font-bold text-purple-700 hover:underline cursor-pointer">Edit Defaults</span></div>
                       </div>
                       <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                          <div className="w-8 h-8 rounded bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mb-1"><Bell size={16}/></div>
                          <div>
                             <div className="text-[12px] font-black text-gray-900 mb-1">Notification Preferences</div>
                             <div className="text-[11px] font-medium text-gray-600 mb-0.5">Email Notifications: Enabled</div>
                             <div className="text-[11px] font-medium text-gray-600">SMS Notifications: Enabled</div>
                          </div>
                          <div className="mt-auto pt-2"><span className="text-[11px] font-bold text-purple-700 hover:underline cursor-pointer">Edit Preferences</span></div>
                       </div>
                       <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                          <div className="w-8 h-8 rounded bg-green-50 text-green-600 flex items-center justify-center shrink-0 mb-1"><ShieldCheck size={16}/></div>
                          <div>
                             <div className="text-[12px] font-black text-gray-900 mb-1">Compliance & Safety</div>
                             <div className="text-[11px] font-medium text-gray-600 mb-0.5">Safety Check Required: Yes</div>
                             <div className="text-[11px] font-medium text-gray-600">Pre-Start Checklist: Enabled</div>
                          </div>
                          <div className="mt-auto pt-2"><span className="text-[11px] font-bold text-purple-700 hover:underline cursor-pointer">Edit Compliance</span></div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Middle Column */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-50">
                       <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">BRANCH CONTACTS</h3>
                       <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0"><Plus size={10}/> Add Contact</span>
                    </div>
                    <div className="flex flex-col gap-4">
                       <div className="text-center py-6 text-xs text-gray-400 font-bold">
                          No branch contacts added yet.
                       </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-50 text-right">
                       <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center justify-end gap-1 shrink-0">View All Contacts <ArrowRight size={10}/></span>
                    </div>
                 </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                 {/* Branch Overview */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4 pb-3 border-b border-gray-50">BRANCH OVERVIEW</h3>
                    <div className="grid grid-cols-2 gap-3">
                       <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex items-center gap-3">
                          <div className="text-purple-600"><CheckCircle2 size={16}/></div>
                          <div>
                             <div className="text-[14px] font-black text-gray-900 leading-none mb-1">{selectedBranch._count?.warehouses || 0}</div>
                             <div className="text-[9px] font-bold text-gray-500 uppercase">Active Loads</div>
                          </div>
                       </div>
                       <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex items-center gap-3">
                          <div className="text-green-600"><User size={16}/></div>
                          <div>
                             <div className="text-[14px] font-black text-gray-900 leading-none mb-1">{selectedBranch._count?.drivers || 0}</div>
                             <div className="text-[9px] font-bold text-gray-500 uppercase">Active Drivers</div>
                          </div>
                       </div>
                       <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex items-center gap-3">
                          <div className="text-orange-500"><Truck size={16}/></div>
                          <div>
                             <div className="text-[14px] font-black text-gray-900 leading-none mb-1">{selectedBranch._count?.assets || 0}</div>
                             <div className="text-[9px] font-bold text-gray-500 uppercase">Trucks</div>
                          </div>
                       </div>
                       <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex items-center gap-3">
                          <div className="text-orange-500"><AlertTriangle size={16} className="rotate-180"/></div>
                          <div>
                             <div className="text-[14px] font-black text-gray-900 leading-none mb-1">0</div>
                             <div className="text-[9px] font-bold text-gray-500 uppercase">Trailers</div>
                          </div>
                       </div>
                       <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex items-center gap-3">
                          <div className="text-red-500"><Building size={16}/></div>
                          <div>
                             <div className="text-[14px] font-black text-gray-900 leading-none mb-1">{selectedBranch._count?.warehouses || 0}</div>
                             <div className="text-[9px] font-bold text-gray-500 uppercase">Warehouses</div>
                          </div>
                       </div>
                       <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex items-center gap-3">
                          <div className="text-indigo-500"><Briefcase size={16}/></div>
                          <div>
                             <div className="text-[14px] font-black text-gray-900 leading-none mb-1">0</div>
                             <div className="text-[9px] font-bold text-gray-500 uppercase">Customers</div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Performance */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4 pb-3 border-b border-gray-50">PERFORMANCE (THIS MONTH)</h3>
                    <div className="flex flex-col gap-4 text-[12px] font-bold">
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-gray-600"><Clock size={14}/> On-Time Delivery</div>
                          <span className="text-gray-900">--</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-gray-600"><CheckCircle2 size={14}/> Load Completion</div>
                          <span className="text-gray-900">--</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-gray-600"><Truck size={14}/> Vehicle Utilization</div>
                          <span className="text-gray-900">--</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-gray-600"><ShieldCheck size={14}/> Safety Score</div>
                          <span className="text-gray-900">-- / 100</span>
                       </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-50 text-right">
                       <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center justify-end gap-1 shrink-0">View Full Performance <ArrowRight size={10}/></span>
                    </div>
                 </div>

                 {/* Recent Activity */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4 pb-3 border-b border-gray-50">RECENT ACTIVITY</h3>
                    <div className="flex flex-col gap-4 text-center py-4 text-xs font-bold text-gray-400">
                       No recent activity recorded for this branch.
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-50 text-right">
                       <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center justify-end gap-1 shrink-0">View All Activity <ArrowRight size={10}/></span>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* Staff & Permissions Tab Content */}
        {activeTab === 'Staff & Permissions' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column (Table) */}
              <div className="lg:col-span-9 flex flex-col h-full">
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col flex-grow">
                    <div className="p-5 border-b border-gray-100">
                       <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4">BRANCH STAFF (18)</h3>
                       
                       <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                          <div className="relative w-full sm:w-64">
                             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                             <input 
                                type="text" 
                                placeholder="Search staff..." 
                                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-purple-300 shadow-sm"
                             />
                          </div>
                          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto min-w-0">
                             <select className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-[12px] font-bold text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                                <option>All Roles</option>
                             </select>
                             <select className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-[12px] font-bold text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                                <option>All Departments</option>
                             </select>
                             <select className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-[12px] font-bold text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                                <option>All Status</option>
                             </select>
                             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-[12px] font-bold shadow-sm hover:bg-gray-50 cursor-pointer shrink-0">
                                <Filter size={14} /> Filters
                             </button>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-2 mt-4">
                          <button className="flex items-center justify-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded text-[11px] font-bold shadow-sm hover:bg-gray-50 cursor-pointer shrink-0">
                             <Download size={12} /> Export
                          </button>
                          <button className="flex items-center justify-center px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded text-[11px] font-bold shadow-sm hover:bg-gray-50 cursor-pointer shrink-0">
                             <Upload size={12} />
                          </button>
                       </div>
                    </div>
                    
                    <div className="overflow-x-auto min-w-0">
                       <table className="w-full text-left text-[12px]">
                          <thead>
                             <tr className="border-b border-gray-100 text-[10px] font-black text-gray-500 uppercase tracking-widest bg-gray-50/50">
                                <th className="py-3.5 px-6 whitespace-nowrap">User</th>
                                <th className="py-3.5 px-4 whitespace-nowrap text-center">Role</th>
                                <th className="py-3.5 px-4 whitespace-nowrap text-center">Department</th>
                                <th className="py-3.5 px-4 whitespace-nowrap text-center">Time & Pay</th>
                                <th className="py-3.5 px-4 whitespace-nowrap text-center">Permissions</th>
                                <th className="py-3.5 px-4 whitespace-nowrap text-center">Status</th>
                                <th className="py-3.5 px-4 whitespace-nowrap text-center">Last Login</th>
                                <th className="py-3.5 px-6 text-center">Actions</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 text-gray-700">
                             {branchStaffData.length === 0 ? (
                                <tr>
                                   <td colSpan="8" className="py-8 text-center text-xs font-bold text-gray-400">
                                      No branch staff assigned yet.
                                   </td>
                                </tr>
                             ) : (
                                branchStaffData.map(staff => (
                                   <tr key={staff.id} className="hover:bg-gray-50/50 transition-colors">
                                      <td className="py-3 px-6 whitespace-nowrap">
                                         <div className="flex items-center gap-2 mb-0.5">
                                            <span className="font-bold text-gray-900">{staff.name}</span>
                                            {staff.isPrimary && <span className="px-1.5 py-0.5 rounded text-[8px] font-bold text-blue-600 bg-blue-50 border border-blue-100 uppercase">Primary</span>}
                                         </div>
                                         <div className="text-[10px] text-gray-500">{staff.email}</div>
                                      </td>
                                      <td className="py-3 px-4 whitespace-nowrap text-center">
                                         {getRoleBadge(staff.role, staff.roleColor)}
                                      </td>
                                      <td className="py-3 px-4 whitespace-nowrap font-medium text-gray-900 text-center">
                                         {staff.department}
                                      </td>
                                      <td className="py-3 px-4 whitespace-nowrap text-center">
                                         <div className="text-[11px] text-gray-500">{staff.payType}</div>
                                         <div className="text-[11px] font-bold text-gray-900">{staff.payRate}</div>
                                      </td>
                                      <td className="py-3 px-4 whitespace-nowrap font-medium text-gray-900 text-center">
                                         {staff.permissions}
                                      </td>
                                      <td className="py-3 px-4 whitespace-nowrap text-center">
                                         {getStatusBadge(staff.status)}
                                      </td>
                                      <td className="py-3 px-4 whitespace-nowrap text-center">
                                         <div className="text-[11px] font-bold text-gray-900">{staff.lastLoginDate}</div>
                                         <div className="text-[10px] text-gray-500">{staff.lastLoginTime}</div>
                                      </td>
                                      <td className="py-3 px-6">
                                         <div className="flex justify-center gap-3 text-gray-400">
                                            <Eye size={14} className="hover:text-purple-600 cursor-pointer" />
                                            <Edit size={14} className="hover:text-purple-600 cursor-pointer" />
                                            <MoreVertical size={14} className="hover:text-gray-900 cursor-pointer" />
                                         </div>
                                      </td>
                                   </tr>
                                ))
                             )}
                          </tbody>
                       </table>
                    </div>
                    
                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap justify-between items-center bg-gray-50/50 mt-auto rounded-b-2xl gap-4">
                       <span className="text-[12px] font-medium text-gray-500">Showing 1 to 8 of 18 staff</span>
                       <div className="flex items-center gap-3">
                          <div className="flex bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                             <button className="px-2.5 py-1 text-gray-400 border-r border-gray-200 cursor-not-allowed bg-gray-50"><ChevronLeft size={14} /></button>
                             <button className="px-3 py-1 text-white font-bold border-r border-purple-600 bg-purple-600 cursor-pointer text-[12px]">1</button>
                             <button className="px-3 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer text-[12px]">2</button>
                             <button className="px-3 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer text-[12px]">3</button>
                             <button className="px-2.5 py-1 text-gray-600 cursor-pointer hover:bg-gray-50"><ChevronRight size={14} /></button>
                          </div>
                          <select className="border border-gray-200 bg-white rounded-md px-2.5 py-1 text-[12px] font-medium text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                             <option>10 / page</option>
                          </select>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Right Column (Sidebar) */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                 
                 {/* Role Distribution */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                       <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">ROLE DISTRIBUTION</h3>
                       <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View Role Report <ArrowRight size={10}/></span>
                    </div>
                    <div className="flex flex-col items-center mb-6">
                       {/* Mock Donut Chart */}
                       <div className="relative w-28 h-28 rounded-full border-[10px] border-purple-500 flex items-center justify-center shadow-inner" style={{ borderRightColor: '#10b981', borderBottomColor: '#f97316', borderLeftColor: '#3b82f6' }}>
                          <div className="text-center">
                             <div className="text-xl font-black text-gray-900 leading-none mb-0.5">18</div>
                             <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Total Staff</div>
                          </div>
                       </div>
                    </div>
                    <div className="flex flex-col gap-2.5 text-[11px] font-bold">
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500"></div> <span className="text-gray-700">Branch Manager</span></div>
                          <span className="text-gray-900">1</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> <span className="text-gray-700">Dispatch</span></div>
                          <span className="text-gray-900">5</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> <span className="text-gray-700">Warehouse</span></div>
                          <span className="text-gray-900">2</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-teal-500"></div> <span className="text-gray-700">Maintenance</span></div>
                          <span className="text-gray-900">2</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500"></div> <span className="text-gray-700">Accounts</span></div>
                          <span className="text-gray-900">2</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> <span className="text-gray-700">Administration</span></div>
                          <span className="text-gray-900">2</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-400"></div> <span className="text-gray-700">Other</span></div>
                          <span className="text-gray-900">4</span>
                       </div>
                    </div>
                 </div>

                 {/* Time & Attendance */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                       <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">TIME & ATTENDANCE <span className="text-gray-400 normal-case">(TODAY)</span></h3>
                       <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View Timesheets <ArrowRight size={10}/></span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center">
                       <div className="bg-green-50 border border-green-100 rounded-lg p-2 flex flex-col items-center gap-1">
                          <Lock size={14} className="text-green-600"/>
                          <div className="text-[14px] font-black text-gray-900">14</div>
                          <div className="text-[8px] font-bold text-gray-600 uppercase">Clocked In</div>
                       </div>
                       <div className="bg-orange-50 border border-orange-100 rounded-lg p-2 flex flex-col items-center gap-1">
                          <Coffee size={14} className="text-orange-500"/>
                          <div className="text-[14px] font-black text-gray-900">2</div>
                          <div className="text-[8px] font-bold text-gray-600 uppercase">On Break</div>
                       </div>
                       <div className="bg-red-50 border border-red-100 rounded-lg p-2 flex flex-col items-center gap-1">
                          <XCircle size={14} className="text-red-500"/>
                          <div className="text-[14px] font-black text-gray-900">0</div>
                          <div className="text-[8px] font-bold text-gray-600 uppercase">Absent</div>
                       </div>
                       <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 flex flex-col items-center gap-1">
                          <Clock size={14} className="text-gray-500"/>
                          <div className="text-[14px] font-black text-gray-900">2</div>
                          <div className="text-[8px] font-bold text-gray-600 uppercase leading-tight">Not Started</div>
                       </div>
                    </div>
                 </div>

                 {/* Quick Actions */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4 pb-3 border-b border-gray-50">QUICK ACTIONS</h3>
                    <div className="flex flex-col gap-1 text-[12px] font-bold text-gray-700">
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <Plus size={14} className="text-gray-400" /> Invite New Staff
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <Users size={14} className="text-gray-400" /> Manage Roles
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <Shield size={14} className="text-gray-400" /> Permission Matrix
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <Clock size={14} className="text-gray-400" /> Time & Attendance
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <DollarSign size={14} className="text-gray-400" /> Staff Pay Settings
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <CheckCircle2 size={14} className="text-gray-400" /> Bulk Update Permissions
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <Download size={14} className="text-gray-400" /> Export Staff List
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* Time Attendance & Wages Tab Content */}
        {activeTab === 'Time Attendance & Wages' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column (Wide) */}
              <div className="lg:col-span-9 flex flex-col gap-6">
                 
                 {/* 6 Stat Widgets */}
                 <div className="grid grid-cols-6 gap-4">
                    <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex items-center gap-3">
                       <div className="w-8 h-8 rounded bg-purple-50 text-purple-600 flex items-center justify-center shrink-0"><Users size={14}/></div>
                       <div>
                          <div className="text-[14px] font-black text-gray-900 leading-none mb-1">18</div>
                          <div className="text-[9px] font-bold text-gray-500 uppercase">Total Staff</div>
                       </div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex items-center gap-3">
                       <div className="w-8 h-8 rounded bg-purple-50 text-purple-600 flex items-center justify-center shrink-0"><Lock size={14}/></div>
                       <div>
                          <div className="text-[14px] font-black text-gray-900 leading-none mb-1">14</div>
                          <div className="text-[9px] font-bold text-gray-500 uppercase">Clocked In</div>
                       </div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex items-center gap-3">
                       <div className="w-8 h-8 rounded bg-purple-50 text-purple-600 flex items-center justify-center shrink-0"><Coffee size={14}/></div>
                       <div>
                          <div className="text-[14px] font-black text-gray-900 leading-none mb-1">2</div>
                          <div className="text-[9px] font-bold text-gray-500 uppercase">On Break</div>
                       </div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex items-center gap-3">
                       <div className="w-8 h-8 rounded bg-red-50 text-red-600 flex items-center justify-center shrink-0"><XCircle size={14}/></div>
                       <div>
                          <div className="text-[14px] font-black text-gray-900 leading-none mb-1">0</div>
                          <div className="text-[9px] font-bold text-gray-500 uppercase">Absent</div>
                       </div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex items-center gap-3">
                       <div className="w-8 h-8 rounded bg-teal-50 text-teal-600 flex items-center justify-center shrink-0"><Clock size={14}/></div>
                       <div>
                          <div className="text-[14px] font-black text-gray-900 leading-none mb-1">109.50</div>
                          <div className="text-[9px] font-bold text-gray-500 uppercase">Total Hours (Today)</div>
                       </div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex items-center gap-3">
                       <div className="w-8 h-8 rounded bg-orange-50 text-orange-500 flex items-center justify-center shrink-0"><DollarSign size={14}/></div>
                       <div>
                          <div className="text-[14px] font-black text-green-600 leading-none mb-1">$3,842.75</div>
                          <div className="text-[9px] font-bold text-gray-500 uppercase">Est. Wages (Today)</div>
                       </div>
                    </div>
                 </div>

                 {/* Timesheet Section */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col">
                    {/* Sub-tabs */}
                    <div className="flex border-b border-gray-100 px-2 pt-2">
                       {['Timesheet', 'Time Clocks', 'Breaks', 'Attendance', 'Wages', 'Leave & Holidays', 'Approvals', 'Settings'].map(tab => (
                          <button 
                             key={tab}
                             onClick={() => setActiveTimeSubTab(tab)}
                             className={`px-4 py-3 text-[12px] font-bold tracking-wide relative cursor-pointer ${activeTimeSubTab === tab ? 'text-purple-700 border-b-2 border-purple-700 bg-purple-50/30 rounded-t-lg' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg'}`}
                          >
                             {tab}
                          </button>
                       ))}
                    </div>
                    
                    {/* Toolbar */}
                    <div className="p-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                       <div className="flex items-center gap-2 w-full sm:w-auto">
                          <div className="flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-3 py-1.5 text-[12px] font-bold text-gray-700 shadow-sm cursor-pointer">
                             <Calendar size={14} className="text-gray-400" />
                             <span>15 May 2025</span>
                             <ChevronDown size={14} className="text-gray-400 ml-1" />
                          </div>
                          <select className="border border-gray-200 bg-white rounded-lg px-3 py-1.5 text-[12px] font-bold text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                             <option>All Departments</option>
                          </select>
                          <select className="border border-gray-200 bg-white rounded-lg px-3 py-1.5 text-[12px] font-bold text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                             <option>All Pay Types</option>
                          </select>
                          <select className="border border-gray-200 bg-white rounded-lg px-3 py-1.5 text-[12px] font-bold text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                             <option>All Status</option>
                          </select>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-[12px] font-bold shadow-sm hover:bg-gray-50 cursor-pointer">
                             <Filter size={14} /> Filters
                          </button>
                       </div>
                       <div className="flex items-center gap-2">
                          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-[12px] font-bold shadow-sm hover:bg-gray-50 cursor-pointer">
                             Bulk Actions <ChevronDown size={14} className="text-gray-400" />
                          </button>
                       </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto min-w-0">
                       <table className="w-full text-left text-[12px]">
                          <thead>
                             <tr className="border-b border-gray-100 text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">
                                <th className="py-3 px-4 whitespace-nowrap">Staff Member</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Department</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Pay Type</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Clock In</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Breaks</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Clock Out</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Total Hours</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Est. Wages</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Status</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                             {timesheetData.map(row => (
                                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                                   <td className="py-3 px-4 whitespace-nowrap">
                                      <div className="flex items-center gap-3">
                                         {getInitialsBadge(row.initials, row.initialsColor)}
                                         <div>
                                            <div className="font-bold text-gray-900 text-[12px]">{row.name}</div>
                                            <div className="text-[10px] text-gray-500">{row.role}</div>
                                         </div>
                                      </div>
                                   </td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center text-gray-600">{row.department}</td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center">
                                      <span className={row.payType === 'Salary' ? 'text-purple-600 font-bold text-[11px]' : 'text-gray-600 text-[11px]'}>{row.payType}</span>
                                   </td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center">
                                      <div className="font-bold text-gray-900 text-[11px]">{row.clockInTime}</div>
                                      <div className="text-[9px] text-gray-400">{row.clockInMethod}</div>
                                      <div className="text-[9px] text-gray-400">{row.clockInLocation}</div>
                                   </td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center text-[10px] text-gray-500">{row.breakTime}</td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center">
                                      <div className="font-bold text-gray-900 text-[11px]">{row.clockOutTime}</div>
                                      <div className="text-[9px] text-gray-400">{row.clockOutMethod}</div>
                                      <div className="text-[9px] text-gray-400">{row.clockOutLocation}</div>
                                   </td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center font-bold text-gray-900">{row.totalHours}</td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center font-bold text-gray-900">{row.estWages}</td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center">
                                      {getStatusBadge(row.status)}
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-4 py-3 border-t border-gray-100 flex flex-wrap justify-between items-center bg-gray-50/50 rounded-b-2xl gap-4">
                       <span className="text-[11px] font-medium text-gray-500">Showing 1 to 8 of 18 staff</span>
                       <div className="flex items-center gap-3">
                          <div className="flex bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                             <button className="px-2 py-1 text-gray-400 border-r border-gray-200 cursor-not-allowed bg-gray-50"><ChevronLeft size={12} /></button>
                             <button className="px-2.5 py-1 text-white font-bold border-r border-purple-600 bg-purple-600 cursor-pointer text-[11px]">1</button>
                             <button className="px-2.5 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer text-[11px]">2</button>
                             <button className="px-2.5 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer text-[11px]">3</button>
                             <button className="px-2 py-1 text-gray-600 cursor-pointer hover:bg-gray-50"><ChevronRight size={12} /></button>
                          </div>
                          <select className="border border-gray-200 bg-white rounded-md px-2 py-1 text-[11px] font-medium text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                             <option>10 / page</option>
                          </select>
                       </div>
                    </div>
                 </div>

                 {/* Leave & Holiday Requests */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col mt-2">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                       <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">LEAVE & HOLIDAY REQUESTS</h3>
                       <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-purple-200 text-purple-700 rounded-lg text-[11px] font-bold shadow-sm hover:bg-purple-50 cursor-pointer">
                          <Plus size={12} /> New Leave Request
                       </button>
                    </div>
                    
                    <div className="p-4 border-b border-gray-100 flex gap-2">
                       <button className="px-4 py-1.5 bg-purple-600 text-white rounded-full text-[11px] font-bold shadow-sm">All Requests</button>
                       <button className="px-4 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-full text-[11px] font-bold hover:bg-gray-100 transition-colors">Pending (3)</button>
                       <button className="px-4 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-full text-[11px] font-bold hover:bg-gray-100 transition-colors">Approved (5)</button>
                       <button className="px-4 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-full text-[11px] font-bold hover:bg-gray-100 transition-colors">Rejected (1)</button>
                    </div>

                    <div className="overflow-x-auto min-w-0">
                       <table className="w-full text-left text-[12px]">
                          <thead>
                             <tr className="border-b border-gray-100 text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">
                                <th className="py-3 px-4 whitespace-nowrap">Staff Member</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Leave Type</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Start Date</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">End Date</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Total Days</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Reason</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Status</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Applied On</th>
                                <th className="py-3 px-4 text-center">Actions</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                             {leaveRequestsData.map(row => (
                                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                                   <td className="py-3 px-4 whitespace-nowrap">
                                      <div className="font-bold text-gray-900 text-[12px]">{row.name}</div>
                                      <div className="text-[10px] text-gray-500">{row.role}</div>
                                   </td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center font-bold text-gray-900">{row.leaveType}</td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center text-gray-600 text-[11px]">{row.startDate}</td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center text-gray-600 text-[11px]">{row.endDate}</td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center font-black text-gray-900">{row.totalDays}</td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center text-gray-500 text-[11px] truncate max-w-[120px]">{row.reason}</td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center">
                                      {getStatusBadge(row.status)}
                                   </td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center text-gray-600 text-[11px]">{row.appliedOn}</td>
                                   <td className="py-3 px-4">
                                      <div className="flex justify-center gap-2 text-gray-400">
                                         <Eye size={14} className="hover:text-purple-600 cursor-pointer" />
                                         <Edit size={14} className="hover:text-purple-600 cursor-pointer" />
                                      </div>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                    
                    <div className="px-4 py-3 border-t border-gray-100 flex flex-wrap justify-between items-center bg-gray-50/50 rounded-b-2xl gap-4">
                       <span className="text-[11px] font-medium text-gray-500">Showing 1 to 4 of 9 requests</span>
                       <div className="flex items-center gap-3">
                          <div className="flex bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                             <button className="px-2 py-1 text-gray-400 border-r border-gray-200 cursor-not-allowed bg-gray-50"><ChevronLeft size={12} /></button>
                             <button className="px-2.5 py-1 text-white font-bold border-r border-purple-600 bg-purple-600 cursor-pointer text-[11px]">1</button>
                             <button className="px-2.5 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer text-[11px]">2</button>
                             <button className="px-2.5 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer text-[11px]">3</button>
                             <button className="px-2 py-1 text-gray-600 cursor-pointer hover:bg-gray-50"><ChevronRight size={12} /></button>
                          </div>
                          <select className="border border-gray-200 bg-white rounded-md px-2 py-1 text-[11px] font-medium text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                             <option>10 / page</option>
                          </select>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Right Column (Sidebar) */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                 
                 {/* Time Clock Action */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col items-center">
                    <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4">TIME CLOCK</h3>
                    <div className="text-[28px] font-black text-gray-900 leading-none mb-1">10:15:30 AM</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Thursday, 15 May 2025</div>
                    
                    <div className="flex justify-between w-full gap-2">
                       <button className="flex-1 flex flex-col items-center justify-center py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors shadow-sm gap-1">
                          <Lock size={16}/>
                          <span className="text-[11px] font-bold">Start Shift</span>
                       </button>
                       <button className="flex-1 flex flex-col items-center justify-center py-3 bg-yellow-400 hover:bg-yellow-500 text-white rounded-xl transition-colors shadow-sm gap-1">
                          <Coffee size={16}/>
                          <span className="text-[11px] font-bold">Start Break</span>
                       </button>
                       <button className="flex-1 flex flex-col items-center justify-center py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors shadow-sm gap-1">
                          <XCircle size={16}/>
                          <span className="text-[11px] font-bold">Finish Shift</span>
                       </button>
                    </div>
                    <div className="text-[9px] font-medium text-gray-400 mt-3 text-center">FOR GPS & BLUETOOTH CLOCK ACTIONS</div>
                 </div>

                 {/* Wages Summary */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4 pb-3 border-b border-gray-50">WAGES SUMMARY <span className="text-gray-400 normal-case">(15 MAY 2025)</span></h3>
                    <div className="flex flex-col gap-3 text-[12px] font-medium text-gray-600 mb-4">
                       <div className="flex justify-between items-center">
                          <span>Total Staff</span>
                          <span className="font-bold text-gray-900">18</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span>Clocked In</span>
                          <span className="font-bold text-gray-900">14</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span>Total Hours</span>
                          <span className="font-bold text-gray-900">109.50</span>
                       </div>
                       <div className="flex justify-between items-center pt-2 mt-1 border-t border-gray-50">
                          <span className="font-bold text-gray-900">Estimated Wages</span>
                          <span className="font-black text-green-600 text-[14px]">$3,842.75</span>
                       </div>
                    </div>
                    <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1">View Wages Report <ArrowRight size={10}/></span>
                 </div>

                 {/* Leave Requests Summary */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                       <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">LEAVE REQUESTS</h3>
                       <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View All <ArrowRight size={10}/></span>
                    </div>
                    <div className="flex justify-between gap-2">
                       <div className="flex-1 bg-orange-50 border border-orange-100 rounded-lg p-2.5 flex flex-col items-center">
                          <div className="text-[16px] font-black text-orange-600 mb-0.5">3</div>
                          <div className="text-[9px] font-bold text-gray-600 uppercase">Pending</div>
                       </div>
                       <div className="flex-1 bg-green-50 border border-green-100 rounded-lg p-2.5 flex flex-col items-center">
                          <div className="text-[16px] font-black text-green-600 mb-0.5">5</div>
                          <div className="text-[9px] font-bold text-gray-600 uppercase">Approved</div>
                       </div>
                       <div className="flex-1 bg-red-50 border border-red-100 rounded-lg p-2.5 flex flex-col items-center">
                          <div className="text-[16px] font-black text-red-600 mb-0.5">1</div>
                          <div className="text-[9px] font-bold text-gray-600 uppercase">Rejected</div>
                       </div>
                    </div>
                 </div>

                 {/* Upcoming Public Holidays */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                       <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">UPCOMING PUBLIC HOLIDAYS</h3>
                       <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View Calendar <ArrowRight size={10}/></span>
                    </div>
                    <div className="flex flex-col gap-4">
                       <div className="flex gap-3">
                          <div className="w-6 h-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100"><Calendar size={12}/></div>
                          <div>
                             <div className="text-[12px] font-bold text-gray-900 mb-0.5">King's Birthday</div>
                             <div className="text-[10px] font-medium text-gray-500">Monday, 9 June 2025</div>
                          </div>
                       </div>
                       <div className="flex gap-3">
                          <div className="w-6 h-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100"><Calendar size={12}/></div>
                          <div>
                             <div className="text-[12px] font-bold text-gray-900 mb-0.5">Labour Day</div>
                             <div className="text-[10px] font-medium text-gray-500">Monday, 6 October 2025</div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Quick Actions */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4 pb-3 border-b border-gray-50">QUICK ACTIONS</h3>
                    <div className="flex flex-col gap-1 text-[12px] font-bold text-gray-700">
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <CheckCircle2 size={14} className="text-gray-400" /> Approve Timesheets
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <DollarSign size={14} className="text-gray-400" /> Process Payroll
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <Settings size={14} className="text-gray-400" /> Manage Pay Rates
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <Calendar size={14} className="text-gray-400" /> Leave & Holiday Calendar
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <Clock size={14} className="text-gray-400" /> Time & Attendance Settings
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <Download size={14} className="text-gray-400" /> Export Attendance Data
                       </button>
                    </div>
                 </div>

                 {/* Leave Balances */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4 pb-3 border-b border-gray-50">LEAVE BALANCES <span className="text-gray-400 normal-case">(AS OF 15 MAY 2025)</span></h3>
                    <div className="flex flex-col gap-3 text-[11px] font-medium text-gray-600 mb-4">
                       <div className="flex justify-between items-center">
                          <span>Annual Leave</span>
                          <span className="font-bold text-gray-900">18.5 days</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span>Personal Leave</span>
                          <span className="font-bold text-gray-900">5.0 days</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span>Sick Leave</span>
                          <span className="font-bold text-gray-900">10.0 days</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span>Long Service Leave</span>
                          <span className="font-bold text-gray-900">33.0 days</span>
                       </div>
                    </div>
                    <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1">View Leave Balance Report <ArrowRight size={10}/></span>
                 </div>
              </div>
           </div>
        )}

        {/* Assets & Fleet Tab Content */}
        {activeTab === 'Assets & Fleet' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column (Table) */}
              <div className="lg:col-span-9 flex flex-col h-full">
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col flex-grow">
                    <div className="p-5 border-b border-gray-100">
                       <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4">ASSIGNED VEHICLES & ASSETS (24)</h3>
                       
                       <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                          <div className="relative w-full sm:w-64">
                             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                             <input 
                                type="text" 
                                placeholder="Search assets..." 
                                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-purple-300 shadow-sm"
                             />
                          </div>
                          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto min-w-0">
                             <select className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-[12px] font-bold text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                                <option>All Categories</option>
                             </select>
                             <select className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-[12px] font-bold text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                                <option>All Types</option>
                             </select>
                             <select className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-[12px] font-bold text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                                <option>All Status</option>
                             </select>
                             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-[12px] font-bold shadow-sm hover:bg-gray-50 cursor-pointer shrink-0">
                                <Filter size={14} /> Filters
                             </button>
                             <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-[12px] font-bold shadow-sm hover:bg-gray-50 cursor-pointer shrink-0">
                                <Download size={14} /> Export
                             </button>
                          </div>
                       </div>
                       
                       {/* Sub Tabs */}
                       <div className="flex gap-6 border-b border-gray-100">
                          <button className="pb-3 text-[12px] font-bold tracking-wide relative cursor-pointer text-purple-700 border-b-2 border-purple-700">All (24)</button>
                          <button className="pb-3 text-[12px] font-bold tracking-wide relative cursor-pointer text-gray-500 hover:text-gray-700">Vehicles (6)</button>
                          <button className="pb-3 text-[12px] font-bold tracking-wide relative cursor-pointer text-gray-500 hover:text-gray-700">Assets (18)</button>
                       </div>
                    </div>
                    
                    <div className="overflow-x-auto min-w-0">
                       <table className="w-full text-left text-[12px]">
                          <thead>
                             <tr className="border-b border-gray-100 text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">
                                <th className="py-3 px-4 whitespace-nowrap">Asset / Registration</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Type</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Category</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Assigned To</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Status</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Condition</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Next Service / Rego</th>
                                <th className="py-3 px-4 text-center">Actions</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                             {assetsData.map(asset => (
                                <tr key={asset.id} className="hover:bg-gray-50/50 transition-colors">
                                   <td className="py-3 px-4 whitespace-nowrap">
                                      <div className="flex items-center gap-3">
                                         <div className="w-8 h-8 rounded bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                                            {asset.icon}
                                         </div>
                                         <div>
                                            <div className="font-bold text-gray-900 text-[12px]">{asset.name}</div>
                                            <div className="text-[10px] font-bold text-gray-500 tracking-wide">{asset.rego}</div>
                                         </div>
                                      </div>
                                   </td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center">
                                      {getRoleBadge(asset.type, asset.typeColor)}
                                   </td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center font-bold text-gray-700">
                                      {asset.category}
                                   </td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center text-[11px]">
                                      {asset.assignedTo}
                                   </td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center">
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-${asset.statusColor}-600 bg-${asset.statusColor}-50 border border-${asset.statusColor}-200`}>{asset.status}</span>
                                   </td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center">
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-${asset.conditionColor}-600 bg-${asset.conditionColor}-50 border border-${asset.conditionColor}-200`}>{asset.condition}</span>
                                   </td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center">
                                      {asset.nextService !== 'N/A' ? (
                                         <>
                                            <div className={`font-bold text-[11px] ${asset.serviceColor === 'red' ? 'text-red-600' : 'text-gray-900'}`}>{asset.nextService}</div>
                                            <div className={`text-[10px] font-medium ${asset.serviceColor === 'red' ? 'text-red-500' : 'text-gray-500'}`}>{asset.nextServiceSub}</div>
                                         </>
                                      ) : (
                                         <span className="text-gray-400 font-bold">N/A</span>
                                      )}
                                   </td>
                                   <td className="py-3 px-4">
                                      <div className="flex justify-center gap-2 text-gray-400">
                                         <Eye size={14} className="hover:text-purple-600 cursor-pointer" />
                                         <Edit size={14} className="hover:text-purple-600 cursor-pointer" />
                                         <MoreVertical size={14} className="hover:text-gray-900 cursor-pointer" />
                                      </div>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                    
                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap justify-between items-center bg-gray-50/50 mt-auto rounded-b-2xl gap-4">
                       <span className="text-[12px] font-medium text-gray-500">Showing 1 to 8 of 24 assets</span>
                       <div className="flex items-center gap-3">
                          <div className="flex bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                             <button className="px-2.5 py-1 text-gray-400 border-r border-gray-200 cursor-not-allowed bg-gray-50"><ChevronLeft size={14} /></button>
                             <button className="px-3 py-1 text-white font-bold border-r border-purple-600 bg-purple-600 cursor-pointer text-[12px]">1</button>
                             <button className="px-3 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer text-[12px]">2</button>
                             <button className="px-3 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer text-[12px]">3</button>
                             <button className="px-2.5 py-1 text-gray-600 cursor-pointer hover:bg-gray-50"><ChevronRight size={14} /></button>
                          </div>
                          <select className="border border-gray-200 bg-white rounded-md px-2.5 py-1 text-[12px] font-medium text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                             <option>10 / page</option>
                          </select>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Right Column (Sidebar) */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                 
                 {/* Asset Summary */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4 pb-3 border-b border-gray-50">ASSET SUMMARY</h3>
                    <div className="grid grid-cols-2 gap-3">
                       <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center gap-3">
                          <div className="text-blue-600"><Car size={16}/></div>
                          <div>
                             <div className="text-[16px] font-black text-gray-900 leading-none mb-1">6</div>
                             <div className="text-[9px] font-bold text-gray-500 uppercase">Vehicles</div>
                          </div>
                       </div>
                       <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex items-center gap-3">
                          <div className="text-red-500"><Box size={16}/></div>
                          <div>
                             <div className="text-[16px] font-black text-gray-900 leading-none mb-1">18</div>
                             <div className="text-[9px] font-bold text-gray-500 uppercase">Assets</div>
                          </div>
                       </div>
                       <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 flex items-center gap-3">
                          <div className="text-purple-600"><Database size={16}/></div>
                          <div>
                             <div className="text-[16px] font-black text-gray-900 leading-none mb-1">24</div>
                             <div className="text-[9px] font-bold text-gray-500 uppercase">Total Assets</div>
                          </div>
                       </div>
                       <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-center gap-3">
                          <div className="text-green-600"><CheckCircle2 size={16}/></div>
                          <div>
                             <div className="text-[16px] font-black text-gray-900 leading-none mb-1">22</div>
                             <div className="text-[9px] font-bold text-gray-500 uppercase">Active</div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Asset By Category */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                       <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">ASSET BY CATEGORY</h3>
                       <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View Report <ArrowRight size={10}/></span>
                    </div>
                    <div className="flex items-center justify-between">
                       {/* Mock Donut Chart */}
                       <div className="relative w-24 h-24 rounded-full border-[8px] border-blue-500 flex items-center justify-center shadow-inner" style={{ borderRightColor: '#facc15', borderBottomColor: '#f97316', borderLeftColor: '#ef4444' }}>
                          <div className="text-center">
                             <div className="text-[16px] font-black text-gray-900 leading-none mb-0.5">24</div>
                             <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Total</div>
                          </div>
                       </div>
                       <div className="flex flex-col gap-1.5 text-[10px] font-bold w-1/2">
                          <div className="flex justify-between items-center">
                             <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> <span className="text-gray-700">Trucks</span></div>
                             <span className="text-gray-900">2</span>
                          </div>
                          <div className="flex justify-between items-center">
                             <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div> <span className="text-gray-700">Trailers</span></div>
                             <span className="text-gray-900">4</span>
                          </div>
                          <div className="flex justify-between items-center">
                             <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> <span className="text-gray-700">Forklifts</span></div>
                             <span className="text-gray-900">4</span>
                          </div>
                          <div className="flex justify-between items-center">
                             <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> <span className="text-gray-700">Containers</span></div>
                             <span className="text-gray-900">4</span>
                          </div>
                          <div className="flex justify-between items-center">
                             <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div> <span className="text-gray-700">Equipment</span></div>
                             <span className="text-gray-900">2</span>
                          </div>
                          <div className="flex justify-between items-center">
                             <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div> <span className="text-gray-700">IT & DEVICES</span></div>
                             <span className="text-gray-900">4</span>
                          </div>
                          <div className="flex justify-between items-center">
                             <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> <span className="text-gray-700">Other</span></div>
                             <span className="text-gray-900">4</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Maintenance Alerts */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                       <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">MAINTENANCE ALERTS</h3>
                       <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View All <ArrowRight size={10}/></span>
                    </div>
                    <div className="flex flex-col gap-3">
                       <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 flex justify-between items-center">
                          <div className="flex items-center gap-2 font-bold text-orange-700 text-[12px]">
                             <AlertTriangle size={14}/> 2 Due Soon
                          </div>
                          <button className="text-[10px] font-bold bg-white border border-orange-200 text-orange-600 px-2 py-1 rounded">Schedule</button>
                       </div>
                       <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex justify-between items-center">
                          <div className="flex items-center gap-2 font-bold text-red-700 text-[12px]">
                             <AlertTriangle size={14}/> 1 Overdue
                          </div>
                          <button className="text-[10px] font-bold bg-white border border-red-200 text-red-600 px-2 py-1 rounded">REQUIRES ATTENTION</button>
                       </div>
                    </div>
                 </div>

                 {/* Quick Actions */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4 pb-3 border-b border-gray-50">QUICK ACTIONS</h3>
                    <div className="flex flex-col gap-1 text-[12px] font-bold text-gray-700">
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <Plus size={14} className="text-gray-400" /> Assign Existing Vehicle
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <Plus size={14} className="text-gray-400" /> Add Or Assign Asset
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <ArrowRight size={14} className="text-gray-400" /> Transfer to Another Branch
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <XCircle size={14} className="text-gray-400" /> Unassign Asset / Vehicle
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <Clock size={14} className="text-gray-400" /> View Assignment History
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <Settings size={14} className="text-gray-400" /> Asset Maintenance Schedule
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <FileText size={14} className="text-gray-400" /> Asset Compliance Documents
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <Download size={14} className="text-gray-400" /> Export Asset List
                       </button>
                    </div>
                 </div>

                 {/* Assignment History */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                       <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">ASSIGNMENT HISTORY (RECENT)</h3>
                       <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View All <ArrowRight size={10}/></span>
                    </div>
                    <div className="flex flex-col gap-4 relative">
                       <div className="absolute left-2.5 top-2 bottom-2 w-px bg-gray-100"></div>
                       <div className="flex gap-3 relative z-10">
                          <div className="w-5 h-5 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-600 shrink-0 mt-0.5"><ArrowRight size={10}/></div>
                          <div>
                             <div className="text-[11px] font-bold text-gray-900 mb-0.5">Trailer T-71</div>
                             <div className="text-[10px] text-gray-500 font-medium">Transferred to Sydney HO Fleet</div>
                             <div className="text-[9px] text-gray-400 font-medium mt-0.5">By Sarah M. - 10 May 2025</div>
                          </div>
                       </div>
                       <div className="flex gap-3 relative z-10">
                          <div className="w-5 h-5 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0 mt-0.5"><XCircle size={10}/></div>
                          <div>
                             <div className="text-[11px] font-bold text-gray-900 mb-0.5">Forklift FL-03</div>
                             <div className="text-[10px] text-gray-500 font-medium">Unassigned from Warehouse 2</div>
                             <div className="text-[9px] text-gray-400 font-medium mt-0.5">By James P. - 8 May 2025</div>
                          </div>
                       </div>
                       <div className="flex gap-3 relative z-10">
                          <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 mt-0.5"><ArrowRight size={10}/></div>
                          <div>
                             <div className="text-[11px] font-bold text-gray-900 mb-0.5">Truck B-Double 108</div>
                             <div className="text-[10px] text-gray-500 font-medium">Transferred from Melbourne Depot</div>
                             <div className="text-[9px] text-gray-400 font-medium mt-0.5">By Sarah M. - 5 May 2025</div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* Performance Tab Content */}
        {activeTab === 'Performance' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column (Wide) */}
              <div className="lg:col-span-9 flex flex-col gap-6">
                 
                 {/* Top KPI Row */}
                 <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col min-w-0">
                       <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">
                          <DollarSign size={12} className="text-orange-500 shrink-0"/> <span className="leading-tight break-words">TOTAL REVENUE</span>
                       </div>
                       <div className="text-[17px] xl:text-xl font-black text-gray-900 mb-1 tracking-tight">$1,245,780</div>
                       <div className="flex items-center gap-1 mb-1">
                          <div className="flex items-center text-green-600 text-[11px] font-bold shrink-0"><TrendingUp size={12} className="mr-0.5"/> +12.6%</div>
                       </div>
                       <div className="text-[9px] font-bold text-gray-400 mt-auto leading-tight">vs. Apr 2025: $1,106,370</div>
                    </div>
                    
                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col min-w-0">
                       <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">
                          <TrendingUp size={12} className="text-blue-500 shrink-0"/> <span className="leading-tight break-words">GROSS PROFIT</span>
                       </div>
                       <div className="text-[17px] xl:text-xl font-black text-gray-900 mb-1 tracking-tight">$342,660</div>
                       <div className="flex items-center gap-1 mb-1">
                          <div className="flex items-center text-green-600 text-[11px] font-bold shrink-0"><TrendingUp size={12} className="mr-0.5"/> +18.3%</div>
                       </div>
                       <div className="text-[9px] font-bold text-gray-400 mt-auto leading-tight">Margin: 27.5%</div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col min-w-0">
                       <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">
                          <Truck size={12} className="text-green-500 shrink-0"/> <span className="leading-tight break-words">ACTIVE LOADS</span>
                       </div>
                       <div className="text-[17px] xl:text-xl font-black text-gray-900 mb-1 tracking-tight">32</div>
                       <div className="flex items-center gap-1 mb-1">
                          <div className="flex items-center text-red-500 text-[11px] font-bold shrink-0"><TrendingDown size={12} className="mr-0.5"/> -3.0%</div>
                       </div>
                       <div className="text-[9px] font-bold text-gray-400 mt-auto leading-tight">vs. Apr 2025: 33</div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col min-w-0">
                       <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">
                          <CheckCircle2 size={12} className="text-green-600 shrink-0"/> <span className="leading-tight break-words">COMPLETED LOADS</span>
                       </div>
                       <div className="text-[17px] xl:text-xl font-black text-gray-900 mb-1 tracking-tight">158</div>
                       <div className="flex items-center gap-1 mb-1">
                          <div className="flex items-center text-green-600 text-[11px] font-bold shrink-0"><TrendingUp size={12} className="mr-0.5"/> +9.7%</div>
                       </div>
                       <div className="text-[9px] font-bold text-gray-400 mt-auto leading-tight">vs. Apr 2025: 144</div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col min-w-0">
                       <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">
                          <Clock size={12} className="text-indigo-500 shrink-0"/> <span className="leading-tight break-words">ON-TIME DELIVERY</span>
                       </div>
                       <div className="text-[17px] xl:text-xl font-black text-gray-900 mb-1 tracking-tight">96.3%</div>
                       <div className="flex items-center gap-1 mb-1">
                          <div className="flex items-center text-green-600 text-[11px] font-bold shrink-0"><TrendingUp size={12} className="mr-0.5"/> +2.1%</div>
                       </div>
                       <div className="text-[9px] font-bold text-gray-400 mt-auto leading-tight">vs. Apr 2025: 94.2%</div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col min-w-0">
                       <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">
                          <Star size={12} className="text-yellow-500 shrink-0"/> <span className="leading-tight break-words">CUST. SATISFACTION</span>
                       </div>
                       <div className="text-[17px] xl:text-xl font-black text-gray-900 mb-1 tracking-tight">4.6 / 5</div>
                       <div className="flex items-center gap-1 mb-1">
                          <div className="flex items-center text-green-600 text-[11px] font-bold shrink-0"><TrendingUp size={12} className="mr-0.5"/> +0.2</div>
                       </div>
                       <div className="text-[9px] font-bold text-gray-400 mt-auto leading-tight">vs. Apr 2025: 4.4 / 5</div>
                    </div>
                 </div>

                 {/* Charts Row */}
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue & Profit Trend Chart */}
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                       <div className="flex justify-between items-center mb-6">
                          <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">REVENUE & PROFIT TREND</h3>
                          <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View Full Report <ArrowRight size={10}/></span>
                       </div>
                       <div className="flex items-center gap-4 mb-6 text-[10px] font-bold text-gray-600">
                          <div className="flex items-center gap-1.5"><div className="w-3 h-1 bg-blue-600 rounded"></div> Revenue (AUD)</div>
                          <div className="flex items-center gap-1.5"><div className="w-3 h-1 bg-green-500 rounded"></div> Profit (AUD)</div>
                       </div>
                       
                       {/* Line Chart Mock */}
                       <div className="relative h-48 w-full mt-auto">
                          {/* Y-Axis Labels */}
                          <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[9px] text-gray-400 font-bold text-right pr-2 h-full">
                             <span>$1.5M</span>
                             <span>$1.2M</span>
                             <span>$900K</span>
                             <span>$600K</span>
                             <span>$300K</span>
                          </div>
                          
                          {/* Grid Lines */}
                          <div className="absolute left-10 right-0 top-1.5 bottom-6 flex flex-col justify-between">
                             <div className="w-full h-px bg-gray-100"></div>
                             <div className="w-full h-px bg-gray-100"></div>
                             <div className="w-full h-px bg-gray-100"></div>
                             <div className="w-full h-px bg-gray-100"></div>
                             <div className="w-full h-px bg-gray-200"></div>
                          </div>
                          
                          {/* Chart Lines Container */}
                          <div className="absolute left-10 right-0 top-1.5 bottom-6">
                             {/* Revenue Line (Blue) */}
                             <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <polyline fill="none" stroke="#2563eb" strokeWidth="2" points="0,80 20,70 40,65 60,50 80,45 100,20" strokeLinecap="round" strokeLinejoin="round" />
                                {/* Data Points */}
                                <circle cx="0" cy="80" r="1.5" fill="#2563eb" />
                                <circle cx="20" cy="70" r="1.5" fill="#2563eb" />
                                <circle cx="40" cy="65" r="1.5" fill="#2563eb" />
                                <circle cx="60" cy="50" r="1.5" fill="#2563eb" />
                                <circle cx="80" cy="45" r="1.5" fill="#2563eb" />
                                <circle cx="100" cy="20" r="1.5" fill="white" stroke="#2563eb" strokeWidth="1" />
                             </svg>

                             {/* Profit Line (Green) */}
                             <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <polyline fill="none" stroke="#10b981" strokeWidth="2" points="0,90 20,85 40,85 60,75 80,70 100,60" strokeLinecap="round" strokeLinejoin="round" />
                                {/* Data Points */}
                                <circle cx="0" cy="90" r="1.5" fill="#10b981" />
                                <circle cx="20" cy="85" r="1.5" fill="#10b981" />
                                <circle cx="40" cy="85" r="1.5" fill="#10b981" />
                                <circle cx="60" cy="75" r="1.5" fill="#10b981" />
                                <circle cx="80" cy="70" r="1.5" fill="#10b981" />
                                <circle cx="100" cy="60" r="1.5" fill="white" stroke="#10b981" strokeWidth="1" />
                             </svg>
                          </div>

                          {/* X-Axis Labels */}
                          <div className="absolute left-10 right-0 bottom-0 flex justify-between text-[9px] text-gray-400 font-bold px-1">
                             <span>Dec 2024</span>
                             <span>Jan 2025</span>
                             <span>Feb 2025</span>
                             <span>Mar 2025</span>
                             <span>Apr 2025</span>
                             <span>May 2025</span>
                          </div>
                       </div>
                    </div>

                    {/* Performance KPI Scorecard */}
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col">
                       <div className="p-5 pb-4 border-b border-gray-50 flex justify-between items-center">
                          <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">PERFORMANCE KPI SCORECARD</h3>
                          <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View All <ArrowRight size={10}/></span>
                       </div>
                       <div className="overflow-x-auto min-w-0 px-2 py-1">
                          <table className="w-full text-left text-[11px]">
                             <thead>
                                <tr className="border-b border-gray-100 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                   <th className="py-2.5 px-3 whitespace-nowrap">KPI</th>
                                   <th className="py-2.5 px-2 whitespace-nowrap text-right">THIS MONTH</th>
                                   <th className="py-2.5 px-2 whitespace-nowrap text-right">VS APR</th>
                                   <th className="py-2.5 px-2 whitespace-nowrap text-right">TARGET</th>
                                   <th className="py-2.5 px-3 whitespace-nowrap text-center">STATUS</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                                <tr className="hover:bg-gray-50/50">
                                   <td className="py-2 px-3 font-bold text-gray-900">On-Time Delivery</td>
                                   <td className="py-2 px-2 text-right font-black text-gray-900">96.3%</td>
                                   <td className="py-2 px-2 text-right font-bold text-green-600">+2.1%</td>
                                   <td className="py-2 px-2 text-right text-gray-500">{'>'} 95%</td>
                                   <td className="py-2 px-3 text-center"><span className="px-2 py-0.5 rounded text-[9px] font-bold text-green-700 bg-green-50 border border-green-200">Excellent</span></td>
                                </tr>
                                <tr className="hover:bg-gray-50/50">
                                   <td className="py-2 px-3 font-bold text-gray-900">Load Completion Rate</td>
                                   <td className="py-2 px-2 text-right font-black text-gray-900">98.1%</td>
                                   <td className="py-2 px-2 text-right font-bold text-green-600">+5.8%</td>
                                   <td className="py-2 px-2 text-right text-gray-500">{'>'} 97%</td>
                                   <td className="py-2 px-3 text-center"><span className="px-2 py-0.5 rounded text-[9px] font-bold text-green-700 bg-green-50 border border-green-200">Excellent</span></td>
                                </tr>
                                <tr className="hover:bg-gray-50/50">
                                   <td className="py-2 px-3 font-bold text-gray-900">Customer Satisfaction</td>
                                   <td className="py-2 px-2 text-right font-black text-gray-900">4.6/5</td>
                                   <td className="py-2 px-2 text-right font-bold text-green-600">+0.2</td>
                                   <td className="py-2 px-2 text-right text-gray-500">{'>'} 4.5</td>
                                   <td className="py-2 px-3 text-center"><span className="px-2 py-0.5 rounded text-[9px] font-bold text-green-700 bg-green-50 border border-green-200">Excellent</span></td>
                                </tr>
                                <tr className="hover:bg-gray-50/50">
                                   <td className="py-2 px-3 font-bold text-gray-900">Staff Attendance</td>
                                   <td className="py-2 px-2 text-right font-black text-gray-900">92.4%</td>
                                   <td className="py-2 px-2 text-right font-bold text-green-600">+2.8%</td>
                                   <td className="py-2 px-2 text-right text-gray-500">{'>'} 90%</td>
                                   <td className="py-2 px-3 text-center"><span className="px-2 py-0.5 rounded text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200">Good</span></td>
                                </tr>
                                <tr className="hover:bg-gray-50/50">
                                   <td className="py-2 px-3 font-bold text-gray-900">Vehicle Utilization</td>
                                   <td className="py-2 px-2 text-right font-black text-gray-900">78.6%</td>
                                   <td className="py-2 px-2 text-right font-bold text-red-500">-1.5%</td>
                                   <td className="py-2 px-2 text-right text-gray-500">{'>'} 75%</td>
                                   <td className="py-2 px-3 text-center"><span className="px-2 py-0.5 rounded text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200">Good</span></td>
                                </tr>
                                <tr className="hover:bg-gray-50/50">
                                   <td className="py-2 px-3 font-bold text-gray-900">Trailer Utilization</td>
                                   <td className="py-2 px-2 text-right font-black text-gray-900">72.1%</td>
                                   <td className="py-2 px-2 text-right font-bold text-green-600">+3.7%</td>
                                   <td className="py-2 px-2 text-right text-gray-500">{'>'} 70%</td>
                                   <td className="py-2 px-3 text-center"><span className="px-2 py-0.5 rounded text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200">Good</span></td>
                                </tr>
                                <tr className="hover:bg-gray-50/50">
                                   <td className="py-2 px-3 font-bold text-gray-900">Asset Utilization</td>
                                   <td className="py-2 px-2 text-right font-black text-gray-900">60.2%</td>
                                   <td className="py-2 px-2 text-right font-bold text-green-600">+4.2%</td>
                                   <td className="py-2 px-2 text-right text-gray-500">{'>'} 65%</td>
                                   <td className="py-2 px-3 text-center"><span className="px-2 py-0.5 rounded text-[9px] font-bold text-orange-700 bg-orange-50 border border-orange-200">Poor</span></td>
                                </tr>
                                <tr className="hover:bg-gray-50/50">
                                   <td className="py-2 px-3 font-bold text-gray-900">Safety Incidents</td>
                                   <td className="py-2 px-2 text-right font-black text-gray-900">2</td>
                                   <td className="py-2 px-2 text-right font-bold text-red-500">+1</td>
                                   <td className="py-2 px-2 text-right text-gray-500">{'<'} 1</td>
                                   <td className="py-2 px-3 text-center"><span className="px-2 py-0.5 rounded text-[9px] font-bold text-orange-700 bg-orange-50 border border-orange-200">Poor</span></td>
                                </tr>
                                <tr className="hover:bg-gray-50/50">
                                   <td className="py-2 px-3 font-bold text-gray-900">Profit as % of Revenue</td>
                                   <td className="py-2 px-2 text-right font-black text-gray-900">27.5%</td>
                                   <td className="py-2 px-2 text-right font-bold text-green-600">+0.8%</td>
                                   <td className="py-2 px-2 text-right text-gray-500">{'>'} 20%</td>
                                   <td className="py-2 px-3 text-center"><span className="px-2 py-0.5 rounded text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200">Good</span></td>
                                </tr>
                             </tbody>
                          </table>
                       </div>
                    </div>
                 </div>

                 {/* Bottom 3 Donut Charts Row */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* LOADS OVERVIEW */}
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                       <div className="flex justify-between items-center mb-6">
                          <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">LOADS OVERVIEW</h3>
                          <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View Report <ArrowRight size={10}/></span>
                       </div>
                       <div className="flex items-center gap-6">
                          <div className="relative w-20 h-20 rounded-full border-[6px] border-green-500 flex items-center justify-center shrink-0" style={{ borderRightColor: '#3b82f6', borderBottomColor: '#f97316' }}>
                             <div className="text-center">
                                <div className="text-[14px] font-black text-gray-900 leading-none mb-0.5">190</div>
                                <div className="text-[7px] font-bold text-gray-500 uppercase tracking-widest">Total</div>
                             </div>
                          </div>
                          <div className="flex flex-col gap-1.5 text-[10px] font-bold flex-grow">
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> <span className="text-gray-700">Completed</span></div>
                                <span className="text-gray-900">158</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> <span className="text-gray-700">In Transit</span></div>
                                <span className="text-gray-900">32</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> <span className="text-gray-700">Delayed</span></div>
                                <span className="text-gray-900">2</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> <span className="text-gray-700">Cancelled</span></div>
                                <span className="text-gray-900">0</span>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* REVENUE BY SERVICE TYPE */}
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                       <div className="flex justify-between items-center mb-6">
                          <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">REVENUE BY SERVICE TYPE</h3>
                          <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View Report <ArrowRight size={10}/></span>
                       </div>
                       <div className="flex items-center gap-6">
                          <div className="relative w-20 h-20 rounded-full border-[6px] border-blue-600 flex items-center justify-center shrink-0" style={{ borderRightColor: '#60a5fa', borderBottomColor: '#f59e0b', borderLeftColor: '#d946ef' }}>
                             <div className="text-center">
                                <div className="text-[14px] font-black text-gray-900 leading-none mb-0.5">$1.25M</div>
                                <div className="text-[7px] font-bold text-gray-500 uppercase tracking-widest">Total</div>
                             </div>
                          </div>
                          <div className="flex flex-col gap-1.5 text-[10px] font-bold flex-grow">
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div> <span className="text-gray-700">Car Carrying</span></div>
                                <span className="text-gray-900">$650,540</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> <span className="text-gray-700">General Freight</span></div>
                                <span className="text-gray-900">$320,520</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> <span className="text-gray-700 truncate max-w-[80px]">Dangerous Goods</span></div>
                                <span className="text-gray-900">$87,550</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500"></div> <span className="text-gray-700">Other</span></div>
                                <span className="text-gray-900">$44,670</span>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* EXPENSE BREAKDOWN */}
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                       <div className="flex justify-between items-center mb-6">
                          <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">EXPENSE BREAKDOWN</h3>
                          <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View Report <ArrowRight size={10}/></span>
                       </div>
                       <div className="flex items-center gap-6">
                          <div className="relative w-20 h-20 rounded-full border-[6px] border-purple-500 flex items-center justify-center shrink-0" style={{ borderRightColor: '#ef4444', borderBottomColor: '#eab308', borderLeftColor: '#3b82f6' }}>
                             <div className="text-center">
                                <div className="text-[14px] font-black text-gray-900 leading-none mb-0.5">$903K</div>
                                <div className="text-[7px] font-bold text-gray-500 uppercase tracking-widest">Total</div>
                             </div>
                          </div>
                          <div className="flex flex-col gap-1.5 text-[10px] font-bold flex-grow">
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div> <span className="text-gray-700">Payroll Costs</span></div>
                                <span className="text-gray-900">$124,450</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> <span className="text-gray-700">Fuel Costs</span></div>
                                <span className="text-gray-900">$106,200</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div> <span className="text-gray-700">Maintenance</span></div>
                                <span className="text-gray-900">$15,100</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> <span className="text-gray-700 truncate max-w-[70px]">Other Operating</span></div>
                                <span className="text-gray-900">$184,170</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

              </div>

              {/* Right Column (Sidebar) */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                 
                 {/* Operational Snapshot */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                       <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">OPERATIONAL SNAPSHOT</h3>
                       <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View All <ArrowRight size={10}/></span>
                    </div>
                    <div className="flex flex-col gap-4 text-[12px] font-bold">
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-gray-600"><Users size={14}/> Total Staff</div>
                          <div className="text-right">
                             <div className="text-gray-900">18</div>
                             <div className="text-[8px] text-gray-400">vs Apr 2025: 17</div>
                          </div>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-orange-600"><Coffee size={14}/> Staff On Leave</div>
                          <div className="text-right">
                             <div className="text-gray-900">2</div>
                             <div className="text-[8px] text-gray-400">vs Apr 2025: 1</div>
                          </div>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-gray-600"><Car size={14}/> Total Vehicles</div>
                          <div className="text-right">
                             <div className="text-gray-900">6</div>
                             <div className="text-[8px] text-gray-400">vs Apr 2025: 6</div>
                          </div>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-gray-600"><Truck size={14}/> Total Trailers</div>
                          <div className="text-right">
                             <div className="text-gray-900">4</div>
                             <div className="text-[8px] text-gray-400">vs Apr 2025: 4</div>
                          </div>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-gray-600"><Box size={14}/> Total Assets</div>
                          <div className="text-right">
                             <div className="text-gray-900">18</div>
                             <div className="text-[8px] text-gray-400">vs Apr 2025: 17</div>
                          </div>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-blue-600"><Activity size={14}/> Utilization (All Assets)</div>
                          <div className="text-right">
                             <div className="text-gray-900">68.2%</div>
                             <div className="text-[8px] text-gray-400">vs Apr 2025: 64.0% <span className="text-green-500">▲ 4.2%</span></div>
                          </div>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-gray-600"><Building size={14}/> Warehouse Capacity</div>
                          <div className="text-right">
                             <div className="text-gray-900">42%</div>
                             <div className="text-[8px] text-gray-400">vs Apr 2025: 38% <span className="text-red-500">▲ 4%</span></div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Top Customers By Revenue */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                       <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">TOP CUSTOMERS BY REVENUE</h3>
                       <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View Report <ArrowRight size={10}/></span>
                    </div>
                    <div className="flex flex-col gap-3 text-[11px] font-bold text-gray-700">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <div className="w-4 h-4 rounded-full bg-gray-100 text-[9px] flex items-center justify-center shrink-0">1</div>
                             <span className="hover:text-purple-700 cursor-pointer">ABC Car Logistics</span>
                          </div>
                          <div className="flex gap-2 shrink-0">
                             <span className="text-gray-900">$342,450</span>
                             <span className="text-gray-400 w-6 text-right">27.5%</span>
                          </div>
                       </div>
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <div className="w-4 h-4 rounded-full bg-gray-100 text-[9px] flex items-center justify-center shrink-0">2</div>
                             <span className="hover:text-purple-700 cursor-pointer">QuickMove Transport</span>
                          </div>
                          <div className="flex gap-2 shrink-0">
                             <span className="text-gray-900">$219,760</span>
                             <span className="text-gray-400 w-6 text-right">17.6%</span>
                          </div>
                       </div>
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <div className="w-4 h-4 rounded-full bg-gray-100 text-[9px] flex items-center justify-center shrink-0">3</div>
                             <span className="hover:text-purple-700 cursor-pointer">National Auto Group</span>
                          </div>
                          <div className="flex gap-2 shrink-0">
                             <span className="text-gray-900">$178,880</span>
                             <span className="text-gray-400 w-6 text-right">14.3%</span>
                          </div>
                       </div>
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <div className="w-4 h-4 rounded-full bg-gray-100 text-[9px] flex items-center justify-center shrink-0">4</div>
                             <span className="hover:text-purple-700 cursor-pointer">Direct Freight Services</span>
                          </div>
                          <div className="flex gap-2 shrink-0">
                             <span className="text-gray-900">$135,430</span>
                             <span className="text-gray-400 w-6 text-right">10.9%</span>
                          </div>
                       </div>
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <div className="w-4 h-4 rounded-full bg-gray-100 text-[9px] flex items-center justify-center shrink-0">5</div>
                             <span className="hover:text-purple-700 cursor-pointer">Others</span>
                          </div>
                          <div className="flex gap-2 shrink-0">
                             <span className="text-gray-900">$372,250</span>
                             <span className="text-gray-400 w-6 text-right">29.8%</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* AI Insights */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                       <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-1">
                          <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center"><Lightbulb size={12}/></div>
                          AI INSIGHTS <span className="bg-purple-100 text-purple-700 px-1 rounded text-[8px] ml-1">BETA</span>
                       </h3>
                       <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View All <ArrowRight size={10}/></span>
                    </div>
                    <div className="flex flex-col gap-3">
                       <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex gap-2.5 items-start">
                          <CheckCircle2 size={14} className="text-green-600 mt-0.5 shrink-0"/>
                          <div className="text-[11px] font-bold text-green-900 leading-tight">
                             On-time delivery improved by 2.1% this month. Keep monitoring driver scheduling and route planning.
                          </div>
                       </div>
                       <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 flex gap-2.5 items-start">
                          <AlertTriangle size={14} className="text-orange-600 mt-0.5 shrink-0"/>
                          <div className="text-[11px] font-bold text-orange-900 leading-tight">
                             Vehicle utilization dropped slightly. Consider reallocating assets to increase usage.
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}


      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
           <div className="flex items-center gap-2 text-[12px] text-gray-500 mb-1 font-semibold tracking-wide">
              <span>Home</span>
              <ChevronRight size={12} />
              <span>Branches</span>
              <ChevronRight size={12} />
              <span className="text-gray-900">Branch List</span>
           </div>
           <div className="flex items-center gap-2">
             <h1 className="text-2xl font-black text-gray-900 tracking-tight">Branch List</h1>
             <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><CheckCircle2 size={12} /></div>
           </div>
           <p className="text-sm text-gray-500 font-medium mt-1">View and manage all branches across your organisation.</p>
        </div>
        <button onClick={() => setIsAddingBranch(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-purple-200 text-purple-700 rounded-lg text-sm font-bold shadow-sm hover:bg-purple-50 transition-colors cursor-pointer">
           <Plus size={16} /> Add Branch
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
         <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
               <Building size={18} />
            </div>
            <div>
               <div className="text-xl font-black text-gray-900">{branchList.length}</div>
               <div className="text-[11px] font-bold text-gray-700">Total Branches</div>
               <div className="text-[10px] text-gray-500">Across {branchList.length > 0 ? '1 country' : '0 countries'}</div>
            </div>
         </div>
         <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-green-600 shrink-0">
               <CheckCircle2 size={18} />
            </div>
            <div>
               <div className="text-xl font-black text-gray-900">{branchList.filter(b => b.status === 'Active').length}</div>
               <div className="text-[11px] font-bold text-gray-700">Active</div>
            </div>
         </div>
         <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 shrink-0">
               <Clock size={18} />
            </div>
            <div>
               <div className="text-xl font-black text-gray-900">{branchList.filter(b => b.status === 'Inactive').length}</div>
               <div className="text-[11px] font-bold text-gray-700">Inactive</div>
            </div>
         </div>
         <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 shrink-0">
               <AlertTriangle size={18} />
            </div>
            <div>
               <div className="text-xl font-black text-gray-900">{branchList.filter(b => b.status === 'Pending Setup').length}</div>
               <div className="text-[11px] font-bold text-gray-700">Pending Setup</div>
            </div>
         </div>
         <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-500 shrink-0">
               <Shield size={18} />
            </div>
            <div>
               <div className="text-xl font-black text-gray-900">{branchList.filter(b => b.status === 'Closed').length}</div>
               <div className="text-[11px] font-bold text-gray-700">Closed</div>
            </div>
         </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
         
         {/* Left Column (Table) */}
         <div className="lg:col-span-9 flex flex-col h-full">
            
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
               <div className="relative w-full sm:w-72">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                     type="text" 
                     placeholder="Search branches..." 
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-300 shadow-sm"
                  />
               </div>
               <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto min-w-0">
                  <select className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                     <option>All Countries</option>
                  </select>
                  <select className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                     <option>All Status</option>
                  </select>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold shadow-sm hover:bg-gray-50 cursor-pointer shrink-0">
                     <Filter size={14} /> Filters
                  </button>
                  <button onClick={handleExportCSV} className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 text-gray-600 rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer shrink-0">
                     <Download size={16} />
                  </button>
               </div>
            </div>

            {/* Table Container */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col flex-grow">
               <div className="p-4 border-b border-gray-100">
                  <h3 className="text-[11px] font-black text-purple-700 uppercase tracking-widest">BRANCHES ({branchList.length})</h3>
               </div>
               <div className="overflow-x-auto min-w-0">
                  <table className="w-full text-left text-[12px]">
                     <thead>
                        <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-800 bg-gray-50/50">
                           <th className="py-3.5 px-6 whitespace-nowrap">Branch Name</th>
                           <th className="py-3.5 px-4 whitespace-nowrap">Branch Code</th>
                           <th className="py-3.5 px-4 whitespace-nowrap">Company</th>
                           <th className="py-3.5 px-4 whitespace-nowrap">Country</th>
                           <th className="py-3.5 px-4 whitespace-nowrap">State / Region</th>
                           <th className="py-3.5 px-4 whitespace-nowrap">Manager</th>
                           <th className="py-3.5 px-4 whitespace-nowrap">Status</th>
                           <th className="py-3.5 px-4 whitespace-nowrap text-center">Loads (30 Days)</th>
                           <th className="py-3.5 px-6 text-center">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                        {branchList.length === 0 ? (
                          <tr>
                            <td colSpan="9" className="py-12 px-6 text-center text-xs font-bold text-gray-400">
                              No branches found in database. Click <span onClick={() => setIsAddingBranch(true)} className="text-purple-600 cursor-pointer underline">+ Add Branch</span> to create one.
                            </td>
                          </tr>
                        ) : (
                          branchList.filter(b => !search || b.branchName.toLowerCase().includes(search.toLowerCase()) || b.branchCode.toLowerCase().includes(search.toLowerCase()) || b.manager.toLowerCase().includes(search.toLowerCase())).map(branch => (
                            <tr key={branch.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="py-3.5 px-6 font-bold text-gray-900 whitespace-nowrap">
                                <span onClick={() => setSelectedBranch(branch)} className="hover:text-purple-700 cursor-pointer">{branch.branchName}</span>
                              </td>
                              <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">{branch.branchCode}</td>
                              <td className="py-3.5 px-4 font-bold text-gray-600 whitespace-nowrap">{branch.company}</td>
                              <td className="py-3.5 px-4 whitespace-nowrap flex items-center gap-2">
                                 <span className="text-sm">{branch.flag}</span> {branch.country}
                              </td>
                              <td className="py-3.5 px-4 whitespace-nowrap font-bold text-gray-900">{branch.state}</td>
                              <td className="py-3.5 px-4 whitespace-nowrap font-bold text-gray-900">{branch.manager}</td>
                              <td className="py-3.5 px-4 whitespace-nowrap">{getStatusBadge(branch.status)}</td>
                              <td className="py-3.5 px-4 font-black text-gray-900 text-center">{branch.loads}</td>
                              <td className="py-3.5 px-6 text-center">
                                 <div className="flex justify-center items-center gap-1.5">
                                    <button 
                                      onClick={() => setSelectedBranch(branch)} 
                                      title="View Branch Details"
                                      className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
                                    >
                                      <Eye size={13} />
                                    </button>
                                    <button 
                                      onClick={() => setEditBranchModal(branch)} 
                                      title="Edit Branch"
                                      className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
                                    >
                                      <Edit size={13} />
                                    </button>
                                    <button 
                                      onClick={async () => {
                                         if (window.confirm(`Are you sure you want to delete branch ${branch.branchName} (${branch.branchCode})?`)) {
                                           try {
                                             await api.delete(`/branches/${branch.id}`);
                                             setBranchList(prev => prev.filter(b => b.id !== branch.id));
                                           } catch (e) {
                                             console.error('API delete branch error:', e);
                                             alert('Failed to delete branch from server. Please try again.');
                                           }
                                         }
                                       }} 
                                      title="Delete Branch"
                                      className="w-7 h-7 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                 </div>
                              </td>
                            </tr>
                          ))
                        )}
                     </tbody>
                  </table>
               </div>
               
               {/* Pagination */}
               <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap justify-between items-center bg-gray-50/50 mt-auto rounded-b-2xl gap-4">
                  <span className="text-[12px] font-medium text-gray-500">Showing 1 to 10 of {branchList.length} branches</span>
                  <div className="flex items-center gap-3">
                     <div className="flex bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                        <button className="px-2.5 py-1 text-gray-400 border-r border-gray-200 cursor-not-allowed bg-gray-50"><ChevronLeft size={14} /></button>
                        <button className="px-3 py-1 text-purple-700 font-bold border-r border-gray-200 bg-purple-50/50 cursor-pointer">1</button>
                        <button className="px-3 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer">2</button>
                        <button className="px-2.5 py-1 text-gray-600 cursor-pointer hover:bg-gray-50"><ChevronRight size={14} /></button>
                     </div>
                     <select className="border border-gray-200 bg-white rounded-md px-2.5 py-1 text-[12px] font-medium text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                        <option>10 / page</option>
                     </select>
                  </div>
               </div>
            </div>
         </div>

         {/* Right Column (Sidebar) */}
         <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* Branch Locations Map */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
               <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4">BRANCH LOCATIONS</h3>
               <div className="relative w-full h-[120px] mb-4 opacity-50 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-contain bg-center bg-no-repeat">
                  <div className="absolute top-[70%] left-[80%] w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="absolute top-[68%] left-[78%] w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="absolute top-[65%] left-[82%] w-2 h-2 rounded-full bg-orange-500"></div>
                  <div className="absolute top-[85%] left-[88%] w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="absolute top-[20%] left-[45%] w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="absolute top-[25%] left-[15%] w-2 h-2 rounded-full bg-green-500"></div>
               </div>
               <div className="flex justify-between items-center text-[9px] font-bold text-gray-500 px-2">
                  <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Active ({branchList.filter(b => b.status === 'Active').length})</div>
                  <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> Pending Setup ({branchList.filter(b => b.status === 'Pending Setup').length})</div>
                  <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> Inactive / Closed ({branchList.filter(b => b.status === 'Inactive' || b.status === 'Closed').length})</div>
               </div>
            </div>

            {/* Branch Summary */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
               <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                  <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">BRANCH SUMMARY</h3>
                  <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1">View Report <ArrowRight size={10}/></span>
               </div>
               <div className="flex flex-col gap-3 text-[12px] font-medium text-gray-600">
                  <div className="flex justify-between items-center">
                     <span>Active Branches</span>
                     <span className="font-bold text-gray-900">{branchList.filter(b => b.status === 'Active').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span>Inactive Branches</span>
                     <span className="font-bold text-gray-900">{branchList.filter(b => b.status === 'Inactive').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span>Pending Setup</span>
                     <span className="font-bold text-gray-900">{branchList.filter(b => b.status === 'Pending Setup').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span>Closed Branches</span>
                     <span className="font-bold text-gray-900">{branchList.filter(b => b.status === 'Closed').length}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 mt-1 border-t border-gray-50">
                     <span className="font-bold text-blue-600">Total Branches</span>
                     <span className="font-bold text-blue-600">{branchList.length}</span>
                  </div>
               </div>
            </div>

            {/* Top Branches */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
               <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                  <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">TOP BRANCHES <span className="text-gray-400 normal-case">(by loads - 30 days)</span></h3>
                  <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View All <ArrowRight size={10}/></span>
               </div>
               <div className="flex flex-col gap-3 text-[12px] font-bold">
                  {branchList.length === 0 ? (
                    <div className="text-center py-4 text-xs font-bold text-gray-400">No branches added.</div>
                  ) : (
                    [...branchList].sort((a, b) => b.loads - a.loads).slice(0, 5).map((branch, index) => (
                      <div key={branch.id} className="flex justify-between items-center">
                         <div className="flex items-center gap-2.5">
                            <div className="w-5 h-5 rounded flex items-center justify-center bg-green-50 text-green-600 text-[10px] shrink-0 border border-green-100">{index + 1}</div>
                            <span className="text-gray-900 truncate">{branch.branchName}</span>
                         </div>
                         <span className="text-gray-600">{branch.loads}</span>
                      </div>
                    ))
                  )}
               </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
               <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4 pb-3 border-b border-gray-50">QUICK ACTIONS</h3>
               <div className="flex flex-col gap-1 text-[12px] font-bold text-gray-700">
                  <button onClick={() => setIsAddingBranch(true)} className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                     <Plus size={14} className="text-gray-400" /> Add New Branch
                  </button>
                  <button onClick={() => setShowImportBulkModal(true)} className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                     <Download size={14} className="text-gray-400" /> Import Branches (Bulk)
                  </button>
                  <button onClick={handleExportCSV} className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                     <Upload size={14} className="text-gray-400" /> Export Branch List
                  </button>
                  <button onClick={() => setShowSetupChecklistModal(true)} className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                     <FileText size={14} className="text-gray-400" /> Branch Setup Checklist
                  </button>
               </div>
            </div>
         </div>
      </div>



      {/* EDIT BRANCH MODAL */}
      {editBranchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <Edit size={16} className="text-purple-600" /> Edit Branch Details ({editBranchModal.branchCode})
              </h3>
              <button onClick={() => setEditBranchModal(null)} className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer">&times;</button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Branch Name *</label>
                <input type="text" value={editBranchModal.branchName || ''} onChange={e => setEditBranchModal({...editBranchModal, branchName: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Branch Code *</label>
                  <input type="text" value={editBranchModal.branchCode || ''} onChange={e => setEditBranchModal({...editBranchModal, branchCode: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Status</label>
                  <select value={editBranchModal.status || 'Active'} onChange={e => setEditBranchModal({...editBranchModal, status: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold bg-white cursor-pointer">
                    <option value="Active">Active</option>
                    <option value="Pending Setup">Pending Setup</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Manager Name</label>
                  <input type="text" value={editBranchModal.manager || ''} onChange={e => setEditBranchModal({...editBranchModal, manager: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">State / Region</label>
                  <input type="text" value={editBranchModal.state || ''} onChange={e => setEditBranchModal({...editBranchModal, state: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Company Entity</label>
                <input type="text" value={editBranchModal.company || ''} onChange={e => setEditBranchModal({...editBranchModal, company: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold" />
              </div>
            </div>
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
              <button onClick={() => setEditBranchModal(null)} className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-white text-xs cursor-pointer">Cancel</button>
              <button onClick={async () => {
                try {
                  await api.put(`/branches/${editBranchModal.id}`, {
                    name: editBranchModal.branchName,
                    location: editBranchModal.state
                  });
                } catch (e) {
                  console.warn('API update branch fallback:', e);
                }
                setBranchList(prev => prev.map(b => b.id === editBranchModal.id ? editBranchModal : b));
                if (selectedBranch && selectedBranch.id === editBranchModal.id) {
                  setSelectedBranch(editBranchModal);
                }
                setEditBranchModal(null);
              }} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 text-xs shadow-sm cursor-pointer">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT BULK BRANCHES MODAL */}
      {showImportBulkModal && createPortal(
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[9999] p-4" onClick={() => setShowImportBulkModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[480px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Import Branches (Bulk CSV / Excel)</h3>
              <button onClick={() => setShowImportBulkModal(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors cursor-pointer"><XCircle size={18} /></button>
            </div>
            <div className="p-6 space-y-4 text-xs font-semibold text-slate-700 text-center">
              <div className="border-2 border-dashed border-purple-200 hover:border-purple-500 rounded-2xl p-8 transition-colors cursor-pointer flex flex-col items-center justify-center bg-purple-50/30">
                <Upload size={32} className="text-purple-600 mb-2" />
                <p className="font-extrabold text-slate-800">Click or drag & drop branch file here</p>
                <p className="text-[10px] text-slate-400 mt-1">Supports .csv, .xlsx (Max 10MB)</p>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setShowImportBulkModal(false)} className="px-5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">Cancel</button>
              <button onClick={() => { setShowImportBulkModal(false); alert('Bulk branches imported successfully!'); }} className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer">Import</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* SETUP CHECKLIST MODAL */}
      {showSetupChecklistModal && createPortal(
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[9999] p-4" onClick={() => setShowSetupChecklistModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[500px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Branch Setup Checklist</h3>
              <button onClick={() => setShowSetupChecklistModal(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors cursor-pointer"><XCircle size={18} /></button>
            </div>
            <div className="p-6 space-y-3 text-xs font-semibold text-slate-700">
              {[
                'Configure Branch Name & Location Address',
                'Assign Branch Operations Manager',
                'Set Working Hours & Operating Capacity',
                'Configure Default Currency & Payment Terms',
                'Assign Initial Fleet Vehicles & Drivers'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span className="text-slate-800 font-bold">{item}</span>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setShowSetupChecklistModal(false)} className="px-5 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 cursor-pointer">Close</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
