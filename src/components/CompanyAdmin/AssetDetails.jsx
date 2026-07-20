import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ChevronRight, CheckCircle2, ChevronDown, Edit, ArrowLeft,
  FileText, Calendar, Clock, MapPin, Building, Shield, AlertTriangle,
  Wrench, CheckCircle, Package, User, Plus, Download, Tag, DollarSign,
  QrCode, MoreHorizontal, Activity, ArrowRight, Copy, Check, Eye,
  BarChart2, FileCheck, Info, Layers, RefreshCw, X, Filter, Search,
  Users, AlertCircle, TrendingUp, RotateCcw, FileSpreadsheet, PlusCircle
} from 'lucide-react';

export default function AssetDetails({ assetData, onBack }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');
  const [activeSubTab, setActiveSubTab] = useState('Current Assignment');
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [copiedTag, setCopiedTag] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: 'Asset Updated', desc: 'Changes saved live.' });

  // Filter state for assignment history table
  const [assignmentSearch, setAssignmentSearch] = useState('');

  // Costs & Depreciation specific state
  const [activeCostTab, setActiveCostTab] = useState('Cost Overview');
  const [costSearch, setCostSearch] = useState('');

  // Costs Mock Data
  const costsData = [
    { date: '24 May 2025', category: 'Maintenance', type: 'Service', desc: 'Service & Maintenance', ref: 'INV-2025-056', loc: 'Sydney Head Office', amount: '$450.00', tax: '$45.00', total: '$495.00', color: 'purple' },
    { date: '24 May 2025', category: 'Maintenance', type: 'Parts', desc: 'Oil Filter & Lubricants', ref: 'INV-2025-057', loc: 'Sydney Head Office', amount: '$120.00', tax: '$12.00', total: '$132.00', color: 'purple' },
    { date: '10 May 2025', category: 'Operating', type: 'Fuel', desc: 'Diesel Fuel', ref: 'FUEL-2025-1021', loc: 'Sydney Head Office', amount: '$200.00', tax: '$20.00', total: '$220.00', color: 'emerald' },
    { date: '25 Apr 2025', category: 'Maintenance', type: 'Repair', desc: 'Hydraulic Pump Repair', ref: 'INV-2025-041', loc: 'Sydney Head Office', amount: '$780.00', tax: '$78.00', total: '$858.00', color: 'purple' },
    { date: '15 Apr 2025', category: 'Operating', type: 'Fuel', desc: 'Diesel Fuel', ref: 'FUEL-2025-0985', loc: 'Sydney Head Office', amount: '$190.00', tax: '$19.00', total: '$209.00', color: 'emerald' },
    { date: '01 Apr 2025', category: 'Insurance', type: 'Insurance', desc: 'Asset Insurance', ref: 'INS-2025-088', loc: 'Sydney Head Office', amount: '$250.00', tax: '$0.00', total: '$250.00', color: 'blue' },
    { date: '31 Mar 2025', category: 'Registration', type: 'Registration', desc: 'Registration Fee', ref: 'REG-2025-033', loc: 'Sydney Head Office', amount: '$91.00', tax: '$9.10', total: '$100.10', color: 'orange' },
    { date: '20 Mar 2025', category: 'Operating', type: 'Fuel', desc: 'Diesel Fuel', ref: 'FUEL-2025-0820', loc: 'Sydney Head Office', amount: '$180.00', tax: '$18.00', total: '$198.00', color: 'emerald' },
    { date: '05 Mar 2025', category: 'Maintenance', type: 'Service', desc: 'Routine Service', ref: 'INV-2025-020', loc: 'Sydney Head Office', amount: '$320.00', tax: '$32.00', total: '$352.00', color: 'purple' },
    { date: '15 Feb 2025', category: 'Operating', type: 'Fuel', desc: 'Diesel Fuel', ref: 'FUEL-2025-0615', loc: 'Sydney Head Office', amount: '$170.00', tax: '$17.00', total: '$187.00', color: 'emerald' },
    { date: '11 Nov 2024', category: 'Other', type: 'Other', desc: 'Safety Equipment', ref: 'INV-2024-211', loc: 'Sydney Head Office', amount: '$50.00', tax: '$5.00', total: '$55.00', color: 'slate' },
  ];

  // States for More Actions dropdown modals
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isPrintQRModalOpen, setIsPrintQRModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);

  // Asset defaults matching screenshots
  const defaultAsset = {
    id: id || 'AST-0001',
    titleNumber: '8.2',
    name: 'Toyota 8FD25',
    fullName: 'Toyota 8FD25 Forklift',
    category: 'Forklifts',
    categoryBadge: 'Material Handling',
    type: 'Diesel Forklift',
    makeModel: 'Toyota 8FD25',
    year: '2022',
    serialNo: '8FD25-12345',
    serialNumberFull: 'XHD25-12345',
    assetTag: 'AST-0001',
    branch: 'Sydney Head Office',
    location: 'Warehouse 1',
    currentLocation: 'Warehouse 1 - Bay A3',
    assignedTo: 'Warehouse 1',
    status: 'Active',
    condition: 'Good',
    purchaseDate: '15 Mar 2022',
    purchasePrice: '$38,500.00 AUD',
    bookValue: '$26,950.00 AUD',
    supplier: 'Toyota Material Handling',
    warrantyExpiry: '15 Mar 2026',
    warrantyDaysLeft: '(in 243 days)',
    usageType: 'Operational',
    operatingHours: '1,256.5 Hrs',
    odometer: '1,256.5 Hrs',
    nextService: '24 Jun 2025',
    nextServiceDays: '(in 18 days)',
    description: 'General purpose forklift used for warehouse operations including loading, unloading and pallet movement. Fitted with side shift and solid pneumatic tyres.',
    notes: 'Keep forks properly lubricated. Daily pre-start inspection required.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60'
  };

  const initialAsset = { ...defaultAsset, ...(assetData || {}) };
  if (!initialAsset.fullName) initialAsset.fullName = `${initialAsset.name || 'Toyota 8FD25'} Forklift`;
  if (!initialAsset.bookValue) initialAsset.bookValue = '$26,950.00 AUD';
  if (!initialAsset.purchasePrice) initialAsset.purchasePrice = '$38,500.00 AUD';
  if (!initialAsset.purchaseDate) initialAsset.purchaseDate = '15 Mar 2022';
  if (!initialAsset.supplier) initialAsset.supplier = 'Toyota Material Handling';
  if (!initialAsset.operatingHours) initialAsset.operatingHours = '1,256.5 Hrs';
  if (!initialAsset.odometer) initialAsset.odometer = '1,256.5 Hrs';
  if (!initialAsset.serialNumberFull) initialAsset.serialNumberFull = 'XHD25-12345';
  if (!initialAsset.serialNo) initialAsset.serialNo = '8FD25-12345';
  if (!initialAsset.assetTag) initialAsset.assetTag = initialAsset.id || 'AST-0001';
  if (!initialAsset.currentLocation) initialAsset.currentLocation = 'Warehouse 1 - Bay A3';
  if (!initialAsset.warrantyExpiry) initialAsset.warrantyExpiry = '15 Mar 2026';
  if (!initialAsset.warrantyDaysLeft) initialAsset.warrantyDaysLeft = '(in 243 days)';
  if (!initialAsset.usageType) initialAsset.usageType = 'Operational';
  if (!initialAsset.description) initialAsset.description = 'General purpose forklift used for warehouse operations including loading, unloading and pallet movement. Fitted with side shift and solid pneumatic tyres.';
  if (!initialAsset.notes) initialAsset.notes = 'Keep forks properly lubricated. Daily pre-start inspection required.';

  // Main Live State for Asset
  const [asset, setAsset] = useState(initialAsset);

  // Form State for Editing Modal
  const [editFormData, setEditFormData] = useState(initialAsset);

  // Form states for dropdown modals
  const [transferForm, setTransferForm] = useState({
    branch: initialAsset.branch,
    currentLocation: initialAsset.currentLocation,
    assignedTo: initialAsset.assignedTo,
    notes: ''
  });

  const [maintForm, setMaintForm] = useState({
    serviceType: 'Oil & Filter Change',
    date: '24 Jun 2025',
    provider: 'Toyota Material Handling',
    instructions: 'Perform standard 500hr servicing and oil/filter replacements.'
  });

  const [deactivateReason, setDeactivateReason] = useState('Scheduled Retirement / End of Life');

  // Mock Assignment History Table Data matching Screenshot 2 & 3
  const assignmentHistoryData = [
    { id: 'ASG-0006', assignedTo: 'Warehouse 1', branchLocation: 'Sydney Head Office\nWarehouse 1', purpose: 'Daily Operations\nGeneral Use', assignedBy: 'Sarah Mitchell', assignedByAvatar: 'SM', fromDate: '24 May 2025\n09:15 AM', toDate: '-\nOngoing', duration: '-', status: 'Current' },
    { id: 'ASG-0005', assignedTo: 'Dispatch Team', branchLocation: 'Sydney Head Office\nDispatch Yard', purpose: 'Loading / Dispatch\nSupport', assignedBy: 'Sarah Mitchell', assignedByAvatar: 'SM', fromDate: '10 May 2025\n07:30 AM', toDate: '23 May 2025\n04:45 PM', duration: '13 days\n9.2 Hrs/Day', status: 'Completed' },
    { id: 'ASG-0004', assignedTo: 'Warehouse 2', branchLocation: 'Sydney Head Office\nWarehouse 2', purpose: 'Stock Movement\nInternal Transfer', assignedBy: 'James Patel', assignedByAvatar: 'JP', fromDate: '25 Apr 2025\n08:00 AM', toDate: '09 May 2025\n05:00 PM', duration: '15 days\n8.1 Hrs/Day', status: 'Completed' },
    { id: 'ASG-0003', assignedTo: 'Maintenance Team', branchLocation: 'Sydney Head Office\nWorkshop', purpose: 'Maintenance Use\nTesting', assignedBy: 'James Patel', assignedByAvatar: 'JP', fromDate: '20 Apr 2025\n02:00 PM', toDate: '24 Apr 2025\n11:00 AM', duration: '4 days\n2.2 Hrs/Day', status: 'Completed' },
    { id: 'ASG-0002', assignedTo: 'Warehouse 1', branchLocation: 'Sydney Head Office\nWarehouse 1', purpose: 'Daily Operations\nGeneral Use', assignedBy: 'Sarah Mitchell', assignedByAvatar: 'SM', fromDate: '05 Apr 2025\n07:45 AM', toDate: '19 Apr 2025\n04:30 PM', duration: '15 days\n8.3 Hrs/Day', status: 'Completed' },
    { id: 'ASG-0001', assignedTo: 'Dispatch Team', branchLocation: 'Sydney Head Office\nDispatch Yard', purpose: 'Loading / Dispatch\nSupport', assignedBy: 'Sarah Mitchell', assignedByAvatar: 'SM', fromDate: '15 Mar 2025\n08:10 AM', toDate: '04 Apr 2025\n05:15 PM', duration: '21 days\n7.6 Hrs/Day', status: 'Completed' },
  ];

  const filteredAssignments = assignmentHistoryData.filter(item =>
    item.id.toLowerCase().includes(assignmentSearch.toLowerCase()) ||
    item.assignedTo.toLowerCase().includes(assignmentSearch.toLowerCase()) ||
    item.purpose.toLowerCase().includes(assignmentSearch.toLowerCase()) ||
    item.assignedBy.toLowerCase().includes(assignmentSearch.toLowerCase())
  );

  const triggerToast = (title, desc) => {
    setToastMessage({ title, desc });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleOpenEditModal = () => {
    setEditFormData({ ...asset });
    setIsEditing(true);
  };

  const handleSaveEditAsset = (e) => {
    e.preventDefault();
    setAsset({ ...editFormData });
    setIsEditing(false);
    triggerToast('Asset Updated Successfully', `Asset ${asset.id} details have been saved live.`);
  };

  const handleConfirmTransfer = (e) => {
    e.preventDefault();
    setAsset(prev => ({
      ...prev,
      branch: transferForm.branch,
      currentLocation: transferForm.currentLocation,
      assignedTo: transferForm.assignedTo
    }));
    setIsAssignModalOpen(false);
    triggerToast('Asset Transferred Successfully', `Asset ${asset.id} reassigned to ${transferForm.branch}.`);
  };

  const handleConfirmMaintenance = (e) => {
    e.preventDefault();
    setAsset(prev => ({
      ...prev,
      nextService: maintForm.date
    }));
    setIsMaintenanceModalOpen(false);
    triggerToast('Maintenance Scheduled', `${maintForm.serviceType} booked for ${maintForm.date}.`);
  };

  const handlePrintAction = () => {
    setIsPrintQRModalOpen(false);
    triggerToast('Label Sent to Printer', `Asset Tag QR Code for ${asset.id} generated.`);
    setTimeout(() => window.print(), 500);
  };

  const handleConfirmDeactivate = () => {
    setAsset(prev => ({
      ...prev,
      status: 'Out of Service'
    }));
    setIsDeactivateModalOpen(false);
    triggerToast('Asset Deactivated', `Asset ${asset.id} status changed to Out of Service.`);
  };

  const handleCopyTag = () => {
    navigator.clipboard.writeText(asset.assetTag);
    setCopiedTag(true);
    setTimeout(() => setCopiedTag(false), 2000);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/company-admin/assets');
    }
  };

  return (
    <div className="flex-grow bg-[#F8FAFC] p-4 sm:p-6 w-full text-left font-sans custom-scrollbar overflow-y-auto min-h-screen relative" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* TOAST NOTIFICATION */}
      {showToast && (
        <div className="fixed top-6 right-6 z-[999999] bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 border border-slate-700">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <div>
            <div className="text-xs font-black text-white">{toastMessage.title}</div>
            <div className="text-[10px] text-slate-300 font-medium">{toastMessage.desc}</div>
          </div>
          <button onClick={() => setShowToast(false)} className="ml-3 text-slate-400 hover:text-white cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {/* BREADCRUMB */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-4 overflow-x-auto pb-1 scrollbar-none">
        <Link to="/company-admin/command-centre" className="hover:text-purple-600 transition-colors whitespace-nowrap">Home</Link>
        <ChevronRight size={12} className="shrink-0" />
        <Link to="/company-admin/assets" onClick={handleBack} className="hover:text-purple-600 transition-colors whitespace-nowrap">Assets</Link>
        <ChevronRight size={12} className="shrink-0" />
        <button onClick={handleBack} className="hover:text-purple-600 transition-colors cursor-pointer whitespace-nowrap">Assets List</button>
        <ChevronRight size={12} className="shrink-0" />
        {activeTab === 'Assignments & History' ? (
          <>
            <button onClick={() => setActiveTab('Overview')} className="hover:text-purple-600 transition-colors cursor-pointer whitespace-nowrap">Asset Details</button>
            <ChevronRight size={12} className="shrink-0" />
            <span className="text-slate-800 font-bold whitespace-nowrap">Assignments & History</span>
          </>
        ) : activeTab === 'Costs & Depreciation' ? (
          <>
            <button onClick={() => setActiveTab('Overview')} className="hover:text-purple-600 transition-colors cursor-pointer whitespace-nowrap">Asset Details</button>
            <ChevronRight size={12} className="shrink-0" />
            <span className="text-slate-800 font-bold whitespace-nowrap">Costs & Depreciation</span>
          </>
        ) : (
          <span className="text-slate-800 font-bold whitespace-nowrap">Asset Details</span>
        )}
      </div>

      {/* PAGE HEADER ROW (DYNAMIC BASED ON TAB) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight flex flex-wrap items-center gap-2">
            {activeTab === 'Assignments & History' ? (
              <>8.5 Asset Assignments & History – Forklift {asset.id}</>
            ) : activeTab === 'Costs & Depreciation' ? (
              <>8.6 Asset Costs & Depreciation – Forklift {asset.id}</>
            ) : (
              <>8.2 Asset Details – Forklift {asset.id}</>
            )}
            <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-black shrink-0">
              <CheckCircle2 size={12} />
            </span>
          </h1>
          <p className="text-slate-500 text-xs font-semibold mt-1">
            {activeTab === 'Assignments & History'
              ? 'Track current assignment, past usage history and transfer records for this asset.'
              : activeTab === 'Costs & Depreciation'
              ? 'Track all costs, expenses and depreciation values for this asset.'
              : 'View, manage and track all details and activities for this asset.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {activeTab === 'Assignments & History' ? (
            <>
              <button
                onClick={() => setActiveTab('Overview')}
                className="flex-1 sm:flex-none bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold py-2 px-3 sm:px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
              >
                <ArrowLeft size={14} strokeWidth={2.5} /> Back to Asset Details
              </button>

              <button
                onClick={() => setIsAssignModalOpen(true)}
                className="flex-1 sm:flex-none bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 text-[11px] font-bold py-2 px-3 sm:px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
              >
                <User size={14} strokeWidth={2.5} className="text-purple-700" /> Assign / Transfer Asset
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleBack}
                className="flex-1 sm:flex-none bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold py-2 px-3 sm:px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
              >
                <ArrowLeft size={14} strokeWidth={2.5} /> Back to Assets List
              </button>
              
              <button
                onClick={handleOpenEditModal}
                className="flex-1 sm:flex-none bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 text-[11px] font-bold py-2 px-3 sm:px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
              >
                <Edit size={14} strokeWidth={2.5} className="text-purple-700" /> Edit Asset
              </button>
            </>
          )}

          <div className="relative flex-1 sm:flex-none">
            <button
              onClick={() => setIsMoreActionsOpen(!isMoreActionsOpen)}
              className="w-full sm:w-auto justify-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap"
            >
              More Actions <ChevronDown size={14} />
            </button>

            {isMoreActionsOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => { setIsAssignModalOpen(true); setIsMoreActionsOpen(false); }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <User size={14} className="text-purple-600" /> Assign / Transfer Asset
                </button>
                <button
                  onClick={() => { setIsMaintenanceModalOpen(true); setIsMoreActionsOpen(false); }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Wrench size={14} className="text-amber-600" /> Schedule Maintenance
                </button>
                <button
                  onClick={() => { setIsPrintQRModalOpen(true); setIsMoreActionsOpen(false); }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <QrCode size={14} className="text-purple-600" /> Print Label / QR
                </button>
                <div className="border-t border-slate-100 my-1"></div>
                <button
                  onClick={() => { setIsDeactivateModalOpen(true); setIsMoreActionsOpen(false); }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <AlertTriangle size={14} className="text-rose-500" /> Deactivate Asset
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TOP SECTION: HERO CARD + TOP RIGHT CARD (EXACT DYNAMIC RENDERING) */}
      <div className="flex flex-col xl:flex-row gap-6 items-stretch mb-6">
        
        {/* TOP HERO CARD (Left) */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row gap-6 items-start">
          {/* Left Side: Asset Image */}
          <div className="w-full md:w-[220px] shrink-0">
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-44 md:h-48">
              <img
                src={asset.image}
                alt={asset.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shadow-sm">
                {asset.status}
              </span>
            </div>
          </div>

          {/* Right Side: Data Grid */}
          <div className="flex-1 w-full">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">{asset.id}</h2>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-black uppercase tracking-wider">
                {asset.status}
              </span>
            </div>

            {activeTab === 'Assignments & History' ? (
              /* Screenshot 2 & 3 Hero Card Grid format */
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Asset Name</span>
                  <span className="text-xs font-bold text-slate-900 block">{asset.name}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Branch / Location</span>
                  <span className="text-xs font-bold text-slate-900 block">{asset.branch}</span>
                  <span className="text-[10px] text-slate-500 font-semibold block">{asset.location}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Serial / Number</span>
                  <span className="text-xs font-semibold text-slate-700 block">{asset.serialNo}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Status</span>
                  <span className="text-xs font-bold text-emerald-600 block">{asset.status}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Category</span>
                  <span className="inline-block px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-bold">
                    {asset.categoryBadge || 'Material Handling'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Current Location</span>
                  <span className="text-xs font-bold text-slate-800 block">{asset.currentLocation}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Year of Manufacture</span>
                  <span className="text-xs font-semibold text-slate-700 block">{asset.year}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Condition</span>
                  <span className="text-xs font-bold text-emerald-600 block">{asset.condition}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Type</span>
                  <span className="text-xs font-bold text-slate-800 block">{asset.type}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Assigned To</span>
                  <span className="text-xs font-bold text-slate-800 block">{asset.assignedTo}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Asset Tag / QR</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800">{asset.assetTag}</span>
                    <button onClick={handleCopyTag} className="text-slate-400 hover:text-purple-600 transition-colors cursor-pointer">
                      {copiedTag ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Screenshot 1 Hero Card Grid format */
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-4 text-xs">
                {/* Column 1 */}
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Asset Name</span>
                    <span className="text-xs font-bold text-slate-900">{asset.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Category</span>
                    <span className="text-xs font-bold text-purple-600">{asset.category}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Type</span>
                    <span className="text-xs font-bold text-slate-800">{asset.type}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Make / Model</span>
                    <span className="text-xs font-bold text-slate-800">{asset.makeModel}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Year of Manufacture</span>
                    <span className="text-xs font-semibold text-slate-700">{asset.year}</span>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Serial / Number</span>
                    <span className="text-xs font-semibold text-slate-700">{asset.serialNumberFull}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Asset Tag / QR</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800">{asset.assetTag}</span>
                      <button onClick={handleCopyTag} className="text-slate-400 hover:text-purple-600 transition-colors cursor-pointer">
                        {copiedTag ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Branch / Location</span>
                    <span className="text-xs font-bold text-slate-800">{asset.branch}</span>
                    <span className="text-[10px] text-slate-500 font-semibold block">{asset.location}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Current Location</span>
                    <span className="text-xs font-bold text-slate-800">{asset.currentLocation}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Assigned To</span>
                    <span className="text-xs font-bold text-slate-800">{asset.assignedTo}</span>
                  </div>
                </div>

                {/* Column 3 */}
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Purchase Date</span>
                    <span className="text-xs font-bold text-slate-800">{asset.purchaseDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Purchase Price</span>
                    <span className="text-xs font-bold text-slate-800">{asset.purchasePrice}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Current Value (Book)</span>
                    <span className="text-xs font-bold text-slate-800">{asset.bookValue}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Supplier</span>
                    <span className="text-xs font-semibold text-slate-700">{asset.supplier}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Warranty Expiry</span>
                    <span className="text-xs font-semibold text-slate-700">{asset.warrantyExpiry}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab !== 'Assignments & History' && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-4 text-xs font-bold">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status:</span>
                <span className="text-emerald-600">{asset.status}</span>
                <span className="text-slate-300">•</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Condition:</span>
                <span className="text-emerald-600">{asset.condition}</span>
              </div>
            )}
          </div>
        </div>

        {/* TOP RIGHT SIDEBAR CARD (DYNAMIC: ASSIGNMENT OVERVIEW FOR ASSIGNMENTS TAB, ASSET STATUS FOR OTHER TABS) */}
        {activeTab === 'Assignments & History' ? (
          /* ASSIGNMENT OVERVIEW CARD AT TOP RIGHT (SCREENSHOT 2 & 3) */
          <div className="w-full xl:w-[250px] shrink-0 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                ASSIGNMENT OVERVIEW
              </h3>
              <button onClick={() => alert('View Report')} className="text-[9px] font-bold text-purple-600 uppercase tracking-widest hover:underline cursor-pointer">
                View Report &rarr;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 flex-1">
              <div className="border border-slate-100 rounded-xl p-2.5 bg-blue-50/40 flex flex-col items-center justify-center text-center">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1">
                  <CheckCircle size={12} />
                </div>
                <span className="text-xs font-black text-slate-900">6</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Total Assignments</span>
              </div>

              <div className="border border-slate-100 rounded-xl p-2.5 bg-emerald-50/40 flex flex-col items-center justify-center text-center">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
                  <CheckCircle2 size={12} />
                </div>
                <span className="text-xs font-black text-emerald-600">1</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Current</span>
              </div>

              <div className="border border-slate-100 rounded-xl p-2.5 bg-emerald-50/40 flex flex-col items-center justify-center text-center">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
                  <CheckCircle size={12} />
                </div>
                <span className="text-xs font-black text-slate-900">5</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Completed</span>
              </div>

              <div className="border border-slate-100 rounded-xl p-2.5 bg-slate-50 flex flex-col items-center justify-center text-center">
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mb-1">
                  <X size={12} />
                </div>
                <span className="text-xs font-black text-slate-900">0</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Cancelled</span>
              </div>

              <div className="border border-slate-100 rounded-xl p-2.5 bg-teal-50/40 flex flex-col items-center justify-center text-center">
                <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mb-1">
                  <Activity size={12} />
                </div>
                <span className="text-xs font-black text-slate-900">176.5 Hrs</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Total Usage</span>
              </div>

              <div className="border border-slate-100 rounded-xl p-2.5 bg-purple-50/40 flex flex-col items-center justify-center text-center">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-1">
                  <User size={12} />
                </div>
                <span className="text-xs font-black text-slate-900">29.4 Hrs</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Avg per Assignment</span>
              </div>

              <div className="border border-slate-100 rounded-xl p-2.5 bg-pink-50/40 flex flex-col items-center justify-center text-center">
                <div className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mb-1">
                  <Calendar size={12} />
                </div>
                <span className="text-xs font-black text-slate-900">21 days</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Longest Assignment</span>
              </div>

              <div className="border border-slate-100 rounded-xl p-2.5 bg-amber-50/40 flex flex-col items-center justify-center text-center">
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-1">
                  <Clock size={12} />
                </div>
                <span className="text-xs font-black text-slate-900">8.1 Hrs/Day</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Avg Daily Usage</span>
              </div>
            </div>
          </div>
        ) : (
          /* ASSET STATUS CARD AT TOP RIGHT (SCREENSHOT 1) */
          <div className="w-full xl:w-[250px] shrink-0 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">
              ASSET STATUS
            </h3>

            <div className="grid grid-cols-2 gap-3 flex-1">
              <div className="border border-slate-100 rounded-xl p-3 bg-emerald-50/40 flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1.5">
                  <CheckCircle size={16} />
                </div>
                <span className="text-xs font-black text-emerald-600">{asset.status}</span>
                <span className="text-[9px] font-semibold text-slate-400 mt-0.5">In Use</span>
              </div>

              <div className="border border-slate-100 rounded-xl p-3 bg-amber-50/40 flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-1.5">
                  <Wrench size={16} />
                </div>
                <span className="text-xs font-black text-amber-600">{asset.condition}</span>
                <span className="text-[9px] font-semibold text-slate-400 mt-0.5">Condition</span>
              </div>

              <div className="border border-slate-100 rounded-xl p-3 bg-blue-50/40 flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1.5">
                  <Clock size={16} />
                </div>
                <span className="text-xs font-black text-slate-900">{asset.operatingHours}</span>
                <span className="text-[9px] font-semibold text-slate-400 mt-0.5">Operating Hours</span>
              </div>

              <div className="border border-slate-100 rounded-xl p-3 bg-slate-50 border-slate-100 flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mb-1.5">
                  <DollarSign size={16} />
                </div>
                <span className="text-xs font-black text-slate-900">$26,950.00</span>
                <span className="text-[9px] font-semibold text-slate-400 mt-0.5">Book Value</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* HORIZONTAL NAVIGATION TABS (MIDDLE SECTION) */}
      <div className="flex items-center gap-8 border-b border-slate-200 mb-6 overflow-x-auto pb-0">
        {[
          'Overview',
          'Specifications',
          'Assignments & History',
          'Maintenance & Service',
          'Compliance & Documents',
          'Costs & Depreciation',
          'Activity Log'
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === tab
                ? 'text-purple-700 border-purple-700'
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* MAIN SECTION BELOW TABS: TAB 1 - OVERVIEW */}
      {activeTab === 'Overview' && (
        <div className="flex flex-col xl:flex-row gap-6">
          
          {/* LEFT MAIN COLUMN */}
          <div className="flex-1 space-y-6">
            
            {/* 1. ASSET OVERVIEW CARD */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                  ASSET OVERVIEW
                </h3>
                <button onClick={handleOpenEditModal} className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-1 cursor-pointer transition-colors">
                  <Edit size={12} /> Edit Details
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-6">
                
                {/* Column 1 */}
                <div className="flex items-start gap-3">
                  <FileText size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Asset ID</span>
                    <span className="text-xs font-bold text-slate-900">{asset.id}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Package size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Asset Name</span>
                    <span className="text-xs font-bold text-slate-900">{asset.fullName}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Tag size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Category</span>
                    <span className="text-xs font-bold text-slate-900">{asset.category}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Layers size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Type</span>
                    <span className="text-xs font-bold text-slate-900">{asset.type}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Wrench size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Make / Model</span>
                    <span className="text-xs font-bold text-slate-900">{asset.makeModel}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <QrCode size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Serial Number</span>
                    <span className="text-xs font-bold text-slate-900">{asset.serialNo}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Year of Manufacture</span>
                    <span className="text-xs font-bold text-slate-900">{asset.year}</span>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="flex items-start gap-3">
                  <Calendar size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Purchase Date</span>
                    <span className="text-xs font-bold text-slate-900">{asset.purchaseDate}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Purchase Price</span>
                    <span className="text-xs font-bold text-slate-900">{asset.purchasePrice}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Current Value (Book)</span>
                    <span className="text-xs font-bold text-slate-900">{asset.bookValue}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Supplier</span>
                    <span className="text-xs font-bold text-slate-900">{asset.supplier}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Warranty Expiry</span>
                    <span className="text-xs font-bold text-slate-900">{asset.warrantyExpiry}</span>
                    <span className="text-[10px] text-amber-600 font-bold block">{asset.warrantyDaysLeft}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Status</span>
                    <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-black uppercase tracking-wider">
                      {asset.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Condition</span>
                    <span className="text-xs font-bold text-emerald-600">{asset.condition}</span>
                  </div>
                </div>

                {/* Column 3 */}
                <div className="flex items-start gap-3">
                  <Building size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Branch / Location</span>
                    <span className="text-xs font-bold text-slate-900">{asset.branch}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ArrowRight size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Current Location</span>
                    <span className="text-xs font-bold text-slate-900">{asset.currentLocation}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Assigned To</span>
                    <span className="text-xs font-bold text-slate-900">{asset.assignedTo}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Activity size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Usage Type</span>
                    <span className="text-xs font-bold text-slate-900">{asset.usageType}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Operating Hours</span>
                    <span className="text-xs font-bold text-slate-900">{asset.operatingHours}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <BarChart2 size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Last Odometer / Meter</span>
                    <span className="text-xs font-bold text-slate-900">{asset.odometer}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Next Service Due</span>
                    <span className="text-xs font-bold text-slate-900">{asset.nextService}</span>
                    <span className="text-[10px] text-amber-600 font-bold block">{asset.nextServiceDays}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* 2. ASSET DESCRIPTION & NOTES CARD */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                  ASSET DESCRIPTION & NOTES
                </h3>
                <button onClick={handleOpenEditModal} className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-1 cursor-pointer transition-colors">
                  <Edit size={12} /> Edit
                </button>
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed mb-3">
                {asset.description}
              </p>

              <div className="text-xs text-slate-700 font-semibold bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-900">Notes: </span>
                {asset.notes}
              </div>
            </div>

            {/* 3. BOTTOM 3 CARDS ROW (LAST MAINTENANCE, COST SUMMARY, OPERATING SUMMARY) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* LAST MAINTENANCE */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">
                    LAST MAINTENANCE
                  </h3>

                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-900">Oil & Filter Change</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-black uppercase tracking-wider">
                      Completed
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 font-medium mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Date</span>
                      <span className="font-bold text-slate-800">25 Apr 2025 <span className="text-slate-400 font-normal">in 18 days</span></span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">By</span>
                      <span className="font-bold text-slate-800">James Patel</span>
                    </div>
                  </div>
                </div>

                <button onClick={() => setActiveTab('Maintenance & Service')} className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors self-start cursor-pointer">
                  View Maintenance History &rarr;
                </button>
              </div>

              {/* COST SUMMARY (FY 2024-2025) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                      COST SUMMARY (FY 2024-2025)
                    </h3>
                    <button onClick={() => setActiveTab('Costs & Depreciation')} className="text-[9px] font-bold text-purple-600 uppercase tracking-widest hover:underline cursor-pointer">
                      View All &rarr;
                    </button>
                  </div>

                  <div className="space-y-2 text-xs font-medium text-slate-600">
                    <div className="flex justify-between">
                      <span>Total Maintenance Cost</span>
                      <span className="font-bold text-slate-900">$1,250.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Repair Cost</span>
                      <span className="font-bold text-slate-900">$450.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Fuel / Operating Cost</span>
                      <span className="font-bold text-slate-900">$2,150.00</span>
                    </div>
                    <div className="border-t border-slate-100 pt-2 flex justify-between font-bold text-slate-900">
                      <span>Total Cost (YTD)</span>
                      <span>$3,850.00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* OPERATING SUMMARY */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                      OPERATING SUMMARY
                    </h3>
                    <button onClick={() => setActiveTab('Specifications')} className="text-[9px] font-bold text-purple-600 uppercase tracking-widest hover:underline cursor-pointer">
                      View All &rarr;
                    </button>
                  </div>

                  <div className="space-y-3 text-xs font-medium text-slate-600">
                    <div className="flex justify-between">
                      <span>Operating Hours (This Month)</span>
                      <span className="font-bold text-slate-900">120.5 Hrs</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Operating Hours (YTD)</span>
                      <span className="font-bold text-slate-900">1,256.5 Hrs</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span>Utilisation (This Month)</span>
                        <span className="font-bold text-slate-900">66%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-600 rounded-full" style={{ width: '66%' }}></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span>Utilisation (YTD)</span>
                        <span className="font-bold text-slate-900">84%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-600 rounded-full" style={{ width: '84%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* DEVELOPER NOTES - ASSET DETAILS */}
            <div className="bg-purple-50/50 rounded-2xl border border-purple-100 p-6">
              <h4 className="text-xs font-black text-purple-900 flex items-center gap-2 mb-4 uppercase tracking-widest">
                <Info size={14} className="text-purple-600" /> DEVELOPER NOTES - ASSET DETAILS
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <div>
                  <div className="flex items-center gap-1.5 mb-2 text-[10px] font-black text-purple-800 uppercase tracking-widest">
                    1. PURPOSE
                  </div>
                  <ul className="text-[10px] font-medium text-slate-600 space-y-1.5 list-disc pl-3">
                    <li>Detailed view of a single asset.</li>
                    <li>Manage all asset related data.</li>
                    <li>Track status, usage, compliance and costs.</li>
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-2 text-[10px] font-black text-purple-800 uppercase tracking-widest">
                    2. KEY FEATURES
                  </div>
                  <ul className="text-[10px] font-medium text-slate-600 space-y-1.5 list-disc pl-3">
                    <li>Overview with key details.</li>
                    <li>Tabs for complete asset lifecycle management.</li>
                    <li>Quick access to maintenance and compliance.</li>
                    <li>Activity log for audit trail.</li>
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-2 text-[10px] font-black text-purple-800 uppercase tracking-widest">
                    3. AUTOMATION & ALERTS
                  </div>
                  <ul className="text-[10px] font-medium text-slate-600 space-y-1.5 list-disc pl-3">
                    <li>Auto-calculate next service due.</li>
                    <li>AI alerts for expiry, maintenance and cost anomalies.</li>
                    <li>Predict downtime based on usage patterns.</li>
                    <li>AI scanning of uploaded documents.</li>
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-2 text-[10px] font-black text-purple-800 uppercase tracking-widest">
                    4. PERMISSIONS
                  </div>
                  <ul className="text-[10px] font-medium text-slate-600 space-y-1.5 list-disc pl-3">
                    <li>Super Admin: Full access.</li>
                    <li>Admin/Manager: Full access.</li>
                    <li>Staff/Warehouse: View relevant assets only.</li>
                    <li>Driver: View assets assigned (if allowed).</li>
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-2 text-[10px] font-black text-purple-800 uppercase tracking-widest">
                    5. DATA SOURCES
                  </div>
                  <ul className="text-[10px] font-medium text-slate-600 space-y-1.5 list-disc pl-3">
                    <li>Assets module.</li>
                    <li>Maintenance module.</li>
                    <li>Compliance module.</li>
                    <li>Usage from device / manual entry.</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-purple-100 flex justify-between items-center text-[9px] font-semibold text-slate-500">
                <span>All times shown in your local time (AEST)</span>
                <span className="flex items-center gap-1"><RefreshCw size={10} /> Data auto-refreshes every 5 minutes</span>
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR COLUMN (BELOW TABS) */}
          <div className="w-full xl:w-[250px] shrink-0 space-y-6">
            
            {/* 1. COMPLIANCE STATUS CARD */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                  COMPLIANCE STATUS
                </h3>
                <button onClick={() => setActiveTab('Compliance & Documents')} className="text-[9px] font-bold text-purple-600 uppercase tracking-widest hover:underline cursor-pointer">
                  View All &rarr;
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">Registration / Compliance</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-black uppercase">Compliant</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">Insurance</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-black uppercase">Compliant</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">Inspection / Check</span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-black uppercase">Up to Date</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">Licence / Permit</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-black uppercase">Compliant</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">Certification</span>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded text-[9px] font-black uppercase">Expires Soon (30 days)</span>
                </div>
              </div>
            </div>

            {/* 2. UPCOMING MAINTENANCE CARD */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                  UPCOMING MAINTENANCE
                </h3>
                <button onClick={() => setActiveTab('Maintenance & Service')} className="text-[9px] font-bold text-purple-600 uppercase tracking-widest hover:underline cursor-pointer">
                  View All &rarr;
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs p-2 bg-amber-50/50 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={14} className="text-amber-500" />
                    <div>
                      <div className="font-bold text-slate-900">Service Due</div>
                      <div className="text-[10px] text-slate-500 font-semibold">24 Jun 2025</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-amber-600">in 18 days</span>
                </div>

                <div className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Wrench size={14} className="text-slate-500" />
                    <div>
                      <div className="font-bold text-slate-900">Oil & Filter Change</div>
                      <div className="text-[10px] text-slate-500 font-semibold">24 Jun 2025</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-slate-500">in 18 days</span>
                </div>

                <div className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-slate-500" />
                    <div>
                      <div className="font-bold text-slate-900">Full Inspection</div>
                      <div className="text-[10px] text-slate-500 font-semibold">24 Aug 2025</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-slate-500">in 79 days</span>
                </div>
              </div>
            </div>

            {/* 3. QUICK ACTIONS CARD */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">
                QUICK ACTIONS
              </h3>

              <div className="space-y-1">
                {[
                  { icon: <Edit size={14} />, label: 'Edit Asset', action: handleOpenEditModal },
                  { icon: <User size={14} />, label: 'Assign / Transfer Asset', action: () => setIsAssignModalOpen(true) },
                  { icon: <Calendar size={14} />, label: 'Schedule Maintenance', action: () => setIsMaintenanceModalOpen(true) },
                  { icon: <FileText size={14} />, label: 'Add Compliance Document', action: () => setActiveTab('Compliance & Documents') },
                  { icon: <Plus size={14} />, label: 'Add Note', action: handleOpenEditModal },
                  { icon: <QrCode size={14} />, label: 'Print Asset Label / QR', action: () => setIsPrintQRModalOpen(true) }
                ].map((act, i) => (
                  <button
                    key={i}
                    onClick={act.action}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-purple-700 transition-colors text-left group cursor-pointer"
                  >
                    <span className="text-slate-400 group-hover:text-purple-600 transition-colors">{act.icon}</span>
                    <span className="text-xs font-bold">{act.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. RECENT ACTIVITY CARD */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                  RECENT ACTIVITY
                </h3>
                <button onClick={() => setActiveTab('Activity Log')} className="text-[9px] font-bold text-purple-600 uppercase tracking-widest hover:underline cursor-pointer">
                  View All &rarr;
                </button>
              </div>

              <div className="relative pl-4 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                <div className="relative">
                  <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-purple-600 border-2 border-white"></div>
                  <div className="text-xs font-bold text-slate-900">Asset assigned to Warehouse 1</div>
                  <div className="text-[10px] text-slate-400 font-semibold mt-0.5">By Sarah M. • 10 May 2025</div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-purple-600 border-2 border-white"></div>
                  <div className="text-xs font-bold text-slate-900">Maintenance completed - Oil & Filter Change</div>
                  <div className="text-[10px] text-slate-400 font-semibold mt-0.5">By James P. • 25 Apr 2025</div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-purple-600 border-2 border-white"></div>
                  <div className="text-xs font-bold text-slate-900">Inspection completed - Daily Check</div>
                  <div className="text-[10px] text-slate-400 font-semibold mt-0.5">By Robert T. • 10 Apr 2025</div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-purple-600 border-2 border-white"></div>
                  <div className="text-xs font-bold text-slate-900">Asset created</div>
                  <div className="text-[10px] text-slate-400 font-semibold mt-0.5">By Sarah M. • 15 Mar 2022</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* MAIN SECTION BELOW TABS: TAB 2 - ASSIGNMENTS & HISTORY (SCREENSHOT 2 & 3 MATCH) */}
      {activeTab === 'Assignments & History' && (
        <div className="flex flex-col xl:flex-row gap-6">
          
          {/* LEFT MAIN COLUMN */}
          <div className="flex-1 space-y-6">
            
            {/* INNER SUB-TABS HEADER */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-6 border-b border-slate-200 pb-0 mb-5 overflow-x-auto">
                {[
                  'Current Assignment',
                  'Assignment History',
                  'Transfer History',
                  'Utilisation History',
                  'Usage Summary'
                ].map((subTab) => (
                  <button
                    key={subTab}
                    onClick={() => setActiveSubTab(subTab)}
                    className={`pb-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                      activeSubTab === subTab
                        ? 'text-purple-700 border-purple-700'
                        : 'text-slate-500 border-transparent hover:text-slate-800'
                    }`}
                  >
                    {subTab}
                  </button>
                ))}
              </div>

              {/* CURRENT ASSIGNMENT CARD */}
              <div className="mb-6">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">
                  CURRENT ASSIGNMENT
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 bg-slate-50/60 p-4 rounded-xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Assigned To</span>
                    <span className="font-bold text-slate-900 block">{asset.assignedTo}</span>
                    <span className="text-[10px] text-slate-500 font-semibold block">[Internal Location]</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Branch</span>
                    <span className="font-bold text-slate-900 block">{asset.branch}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Assigned By</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-4 h-4 rounded-full bg-slate-200 text-[9px] font-black text-slate-700 flex items-center justify-center">SM</span>
                      <div>
                        <span className="font-bold text-slate-900 block leading-tight">Sarah Mitchell</span>
                        <span className="text-[9px] text-slate-500 font-semibold block">Super Admin</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Assigned Date</span>
                    <span className="font-bold text-slate-900 block">24 May 2025</span>
                    <span className="text-[10px] text-slate-500 font-semibold block">09:15 AM</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Purpose</span>
                    <span className="font-bold text-slate-900 block">Daily Operations</span>
                    <span className="text-[10px] text-slate-500 font-semibold block">(General Use)</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Expected Return</span>
                    <span className="font-bold text-emerald-600 block">- Ongoing</span>
                  </div>
                </div>
              </div>

              {/* ASSIGNMENT HISTORY (6) TABLE */}
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                    ASSIGNMENT HISTORY ({filteredAssignments.length})
                  </h3>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-60">
                      <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        value={assignmentSearch}
                        onChange={(e) => setAssignmentSearch(e.target.value)}
                        placeholder="Search assignments..."
                        className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500"
                      />
                    </div>
                    <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer">
                      <Filter size={12} /> Filters
                    </button>
                    <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer">
                      <Download size={12} /> Export
                    </button>
                  </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                        <th className="p-3">Assignment ID</th>
                        <th className="p-3">Assigned To</th>
                        <th className="p-3">Branch / Location</th>
                        <th className="p-3">Purpose</th>
                        <th className="p-3">Assigned By</th>
                        <th className="p-3">From Date / Time</th>
                        <th className="p-3">To Date / Time</th>
                        <th className="p-3">Duration</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAssignments.map((asg) => (
                        <tr key={asg.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 font-bold text-purple-700">{asg.id}</td>
                          <td className="p-3 font-bold text-slate-900">{asg.assignedTo}</td>
                          <td className="p-3 font-semibold text-slate-700 whitespace-pre-line leading-tight">{asg.branchLocation}</td>
                          <td className="p-3 font-semibold text-slate-700 whitespace-pre-line leading-tight">{asg.purpose}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-slate-200 text-[9px] font-black text-slate-700 flex items-center justify-center shrink-0">{asg.assignedByAvatar}</span>
                              <span className="font-bold text-slate-900">{asg.assignedBy}</span>
                            </div>
                          </td>
                          <td className="p-3 font-medium text-slate-700 whitespace-pre-line leading-tight">{asg.fromDate}</td>
                          <td className="p-3 font-medium text-slate-700 whitespace-pre-line leading-tight">{asg.toDate}</td>
                          <td className="p-3 font-medium text-slate-700 whitespace-pre-line leading-tight">{asg.duration}</td>
                          <td className="p-3">
                            {asg.status === 'Current' ? (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-black uppercase tracking-wider">Current</span>
                            ) : (
                              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase tracking-wider">Completed</span>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center justify-center gap-1.5">
                              <button className="text-slate-400 hover:text-purple-600 p-1 cursor-pointer"><Eye size={14} /></button>
                              <button className="text-slate-400 hover:text-purple-600 p-1 cursor-pointer"><MoreHorizontal size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* TABLE PAGINATION */}
                <div className="flex justify-between items-center text-xs text-slate-500 font-semibold mt-4">
                  <span>Showing 1 to {filteredAssignments.length} of {filteredAssignments.length} assignments</span>
                  <div className="flex items-center gap-2">
                    <button className="px-2.5 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 disabled:opacity-50" disabled>&lt;</button>
                    <span className="px-3 py-1 bg-purple-50 border border-purple-200 rounded-lg font-bold text-purple-700">1</span>
                    <button className="px-2.5 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 disabled:opacity-50" disabled>&gt;</button>
                    <select className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 outline-none">
                      <option>10 / page</option>
                      <option>25 / page</option>
                      <option>50 / page</option>
                    </select>
                  </div>
                </div>

              </div>
            </div>

            {/* DEVELOPER NOTES - ASSET ASSIGNMENTS & HISTORY CARD */}
            <div className="bg-purple-50/50 rounded-2xl border border-purple-100 p-6">
              <h4 className="text-xs font-black text-purple-900 flex items-center gap-2 mb-4 uppercase tracking-widest">
                <Info size={14} className="text-purple-600" /> DEVELOPER NOTES - ASSET ASSIGNMENTS & HISTORY
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <div>
                  <div className="flex items-center gap-1.5 mb-2 text-[10px] font-black text-purple-800 uppercase tracking-widest">
                    1. PURPOSE
                  </div>
                  <ul className="text-[10px] font-medium text-slate-600 space-y-1.5 list-disc pl-3">
                    <li>Track current and past assignments.</li>
                    <li>Monitor usage, transfer and return history.</li>
                    <li>Ensure full asset accountability.</li>
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-2 text-[10px] font-black text-purple-800 uppercase tracking-widest">
                    2. KEY FEATURES
                  </div>
                  <ul className="text-[10px] font-medium text-slate-600 space-y-1.5 list-disc pl-3">
                    <li>Current assignment with expected return.</li>
                    <li>Complete assignment and transfer history.</li>
                    <li>Utilisation and usage summary.</li>
                    <li>Upcoming assignments and calendar view.</li>
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-2 text-[10px] font-black text-purple-800 uppercase tracking-widest">
                    3. AUTOMATION & ALERTS
                  </div>
                  <ul className="text-[10px] font-medium text-slate-600 space-y-1.5 list-disc pl-3">
                    <li>Notify on overdue returns.</li>
                    <li>Reminder before scheduled assignments.</li>
                    <li>Auto-update usage hours from telematics.</li>
                    <li>AI insights for idle or underutilised assets.</li>
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-2 text-[10px] font-black text-purple-800 uppercase tracking-widest">
                    4. PERMISSIONS
                  </div>
                  <ul className="text-[10px] font-medium text-slate-600 space-y-1.5 list-disc pl-3">
                    <li>Super Admin: Full access.</li>
                    <li>Admin/Manager: Create, edit, assign.</li>
                    <li>Dispatch: Assign & view assignments.</li>
                    <li>Staff: View assigned assets only.</li>
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-2 text-[10px] font-black text-purple-800 uppercase tracking-widest">
                    5. DATA SOURCES
                  </div>
                  <ul className="text-[10px] font-medium text-slate-600 space-y-1.5 list-disc pl-3">
                    <li>Assets module.</li>
                    <li>Assignments & Transfers.</li>
                    <li>Live Tracking / Telematics.</li>
                    <li>Maintenance module.</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-purple-100 flex justify-between items-center text-[9px] font-semibold text-slate-500">
                <span>All times shown in your local time (AEST)</span>
                <span className="flex items-center gap-1"><RefreshCw size={10} /> Data auto-refreshes every 5 minutes</span>
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR COLUMN FOR ASSIGNMENTS & HISTORY (UPCOMING ASSIGNMENTS & QUICK ACTIONS) */}
          <div className="w-full xl:w-[250px] shrink-0 space-y-6">
            
            {/* 1. UPCOMING ASSIGNMENTS CARD */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                  UPCOMING ASSIGNMENTS
                </h3>
                <button onClick={() => alert('View All Assignments')} className="text-[9px] font-bold text-purple-600 uppercase tracking-widest hover:underline cursor-pointer">
                  View All &rarr;
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs p-2.5 bg-amber-50/50 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-amber-500 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Service & Maintenance</div>
                      <div className="text-[10px] text-slate-500 font-semibold">Scheduled Use</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-900">24 Jun 2025</div>
                    <div className="text-[9px] font-bold text-amber-600">in 18 days</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs p-2.5 bg-purple-50/50 rounded-xl border border-purple-100">
                  <div className="flex items-center gap-2">
                    <Package size={14} className="text-purple-600 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Warehouse 1</div>
                      <div className="text-[10px] text-slate-500 font-semibold">Daily Operations</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-900">24 Jun 2025</div>
                    <div className="text-[9px] font-bold text-amber-600">in 18 days</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs p-2.5 bg-blue-50/50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-blue-600 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Dispatch Team</div>
                      <div className="text-[10px] text-slate-500 font-semibold">Loading / Dispatch</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-900">25 Jun 2025</div>
                    <div className="text-[9px] font-bold text-amber-600">in 19 days</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. QUICK ACTIONS CARD */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">
                QUICK ACTIONS
              </h3>

              <div className="space-y-1">
                {[
                  { icon: <User size={14} />, label: 'Assign / Transfer Asset', action: () => setIsAssignModalOpen(true) },
                  { icon: <RotateCcw size={14} />, label: 'Return Asset', action: () => triggerToast('Asset Returned', 'Asset returned to main repository.') },
                  { icon: <Calendar size={14} />, label: 'View Assignment Calendar', action: () => alert('Opening Assignment Calendar...') },
                  { icon: <TrendingUp size={14} />, label: 'View Utilisation Report', action: () => alert('Opening Utilisation Report...') },
                  { icon: <FileText size={14} />, label: 'Print Assignment History', action: handlePrintAction },
                  { icon: <Download size={14} />, label: 'Export Assignment Data', action: () => triggerToast('Export Complete', 'Assignment history exported as CSV.') }
                ].map((act, i) => (
                  <button
                    key={i}
                    onClick={act.action}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-purple-700 transition-colors text-left group cursor-pointer"
                  >
                    <span className="text-slate-400 group-hover:text-purple-600 transition-colors">{act.icon}</span>
                    <span className="text-xs font-bold">{act.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* MAIN SECTION BELOW TABS: SPECIFICATIONS TAB */}
      {activeTab === 'Specifications' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-wider">Technical Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div className="border border-slate-100 p-4 rounded-xl">
              <h4 className="font-bold text-purple-700 mb-2">Engine & Power</h4>
              <div className="space-y-1.5 text-slate-600">
                <div className="flex justify-between"><span>Engine Type:</span><span className="font-semibold text-slate-900">Toyota 1DZ-II Diesel</span></div>
                <div className="flex justify-between"><span>Displacement:</span><span className="font-semibold text-slate-900">2,486 cc</span></div>
                <div className="flex justify-between"><span>Rated Output:</span><span className="font-semibold text-slate-900">40 kW / 2400 rpm</span></div>
                <div className="flex justify-between"><span>Fuel Capacity:</span><span className="font-semibold text-slate-900">60 Litres</span></div>
              </div>
            </div>
            <div className="border border-slate-100 p-4 rounded-xl">
              <h4 className="font-bold text-purple-700 mb-2">Dimensions & Capacity</h4>
              <div className="space-y-1.5 text-slate-600">
                <div className="flex justify-between"><span>Load Capacity:</span><span className="font-semibold text-slate-900">2,500 kg</span></div>
                <div className="flex justify-between"><span>Lift Height:</span><span className="font-semibold text-slate-900">4,500 mm</span></div>
                <div className="flex justify-between"><span>Overall Weight:</span><span className="font-semibold text-slate-900">3,780 kg</span></div>
                <div className="flex justify-between"><span>Fork Length:</span><span className="font-semibold text-slate-900">1,070 mm</span></div>
              </div>
            </div>
            <div className="border border-slate-100 p-4 rounded-xl">
              <h4 className="font-bold text-purple-700 mb-2">Tires & Hydraulics</h4>
              <div className="space-y-1.5 text-slate-600">
                <div className="flex justify-between"><span>Tire Type:</span><span className="font-semibold text-slate-900">Solid Pneumatic</span></div>
                <div className="flex justify-between"><span>Front Tires:</span><span className="font-semibold text-slate-900">7.00-12-12PR</span></div>
                <div className="flex justify-between"><span>Rear Tires:</span><span className="font-semibold text-slate-900">6.00-9-10PR</span></div>
                <div className="flex justify-between"><span>Attachment:</span><span className="font-semibold text-slate-900">Integrated Side Shift</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN SECTION BELOW TABS: COSTS & DEPRECIATION TAB */}
      {activeTab === 'Costs & Depreciation' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col mb-8 overflow-hidden">
          


          {/* Tab Content Area */}
          <div className="flex flex-col xl:flex-row border-t border-slate-100">
            
            {/* Left Column (Table) */}
            <div className="flex-1 border-r border-slate-200 p-0 flex flex-col min-w-0">
              
              {/* Filter Bar */}
              <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search costs..." 
                      className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold w-[200px] outline-none focus:border-purple-500"
                      value={costSearch}
                      onChange={(e) => setCostSearch(e.target.value)}
                    />
                  </div>
                  <select className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none bg-white min-w-[150px]">
                    <option>All Cost Categories</option>
                    <option>Maintenance</option>
                    <option>Operating</option>
                  </select>
                  <select className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none bg-white min-w-[140px]">
                    <option>All Cost Types</option>
                    <option>Fuel</option>
                    <option>Service</option>
                  </select>
                  <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 bg-white">
                    01 Jul 2024 - 30 Jun 2025 <Calendar size={12} />
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 bg-white">
                    <Filter size={14} /> Filters
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 bg-white">
                    <Download size={14} /> Export
                  </button>
                  <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 bg-white">
                    <RefreshCw size={14} />
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">COST & EXPENSES (11)</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-white border-b border-slate-200">
                      <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Date</th>
                      <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Category</th>
                      <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Cost Type</th>
                      <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest min-w-[160px]">Description</th>
                      <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Reference / Invoice</th>
                      <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Branch / Location</th>
                      <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Amount (AUD)</th>
                      <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Tax (AUD)</th>
                      <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Total (AUD)</th>
                      <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costsData.map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                        <td className="px-4 py-3 text-[11px] font-semibold text-slate-700 whitespace-nowrap">{row.date}</td>
                        <td className="px-4 py-3 text-[11px]">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.color === 'purple' ? 'bg-purple-50 text-purple-600' : row.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : row.color === 'blue' ? 'bg-blue-50 text-blue-600' : row.color === 'orange' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-600'}`}>
                            {row.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[11px] font-semibold text-slate-700 whitespace-nowrap">{row.type}</td>
                        <td className="px-4 py-3 text-[11px] font-semibold text-slate-800">{row.desc}</td>
                        <td className="px-4 py-3 text-[11px] font-semibold text-slate-700 whitespace-nowrap">{row.ref}</td>
                        <td className="px-4 py-3 text-[11px] font-semibold text-slate-600 whitespace-nowrap">{row.loc}</td>
                        <td className="px-4 py-3 text-[11px] font-semibold text-slate-900 whitespace-nowrap">{row.amount}</td>
                        <td className="px-4 py-3 text-[11px] font-semibold text-slate-500 whitespace-nowrap">{row.tax}</td>
                        <td className="px-4 py-3 text-[11px] font-black text-slate-900 whitespace-nowrap">{row.total}</td>
                        <td className="px-4 py-3 text-center">
                          <button className="p-1 rounded text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors">
                            <MoreHorizontal size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500 mt-auto bg-white">
                <div>Showing 1 to 11 of 11 costs</div>
                <div className="flex items-center gap-1">
                  <button className="w-6 h-6 rounded flex items-center justify-center border border-slate-200 hover:bg-slate-50">&lt;</button>
                  <button className="w-6 h-6 rounded flex items-center justify-center border border-purple-200 bg-purple-50 text-purple-700 font-bold">1</button>
                  <button className="w-6 h-6 rounded flex items-center justify-center border border-slate-200 hover:bg-slate-50">&gt;</button>
                </div>
                <select className="border border-slate-200 rounded px-2 py-1 outline-none text-slate-700 font-bold bg-white">
                  <option>10 / page</option>
                  <option>25 / page</option>
                </select>
              </div>
            </div>

            {/* Right Column (Sidebar Summaries) */}
            <div className="w-full xl:w-[320px] bg-white p-5 flex flex-col gap-6 shrink-0">
              
              {/* Cost Summary Section */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">COST SUMMARY (FY 2024-2025)</h4>
                  <span className="text-[9px] font-bold text-purple-600 cursor-pointer hover:underline">View Report →</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-slate-100 rounded-xl p-3 bg-emerald-50/40 flex flex-col items-center justify-center text-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1.5">
                      <CheckCircle2 size={16} />
                    </div>
                    <span className="text-xs font-black text-slate-900">$3,850.00</span>
                    <span className="text-[9px] font-semibold text-slate-400 mt-0.5 uppercase">Total Cost (YTD)</span>
                  </div>

                  <div className="border border-slate-100 rounded-xl p-3 bg-blue-50/40 flex flex-col items-center justify-center text-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1.5">
                      <Activity size={16} />
                    </div>
                    <span className="text-xs font-black text-slate-900">$2,150.00</span>
                    <span className="text-[9px] font-semibold text-slate-400 mt-0.5 uppercase">Operating Cost</span>
                  </div>

                  <div className="border border-slate-100 rounded-xl p-3 bg-amber-50/40 flex flex-col items-center justify-center text-center">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-1.5">
                      <Wrench size={16} />
                    </div>
                    <span className="text-xs font-black text-slate-900">$1,250.00</span>
                    <span className="text-[9px] font-semibold text-slate-400 mt-0.5 uppercase">Maintenance Cost</span>
                  </div>

                  <div className="border border-slate-100 rounded-xl p-3 bg-slate-50 flex flex-col items-center justify-center text-center">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mb-1.5">
                      <Layers size={16} />
                    </div>
                    <span className="text-xs font-black text-slate-900">$450.00</span>
                    <span className="text-[9px] font-semibold text-slate-400 mt-0.5 uppercase">Other Cost</span>
                  </div>
                </div>
              </div>

              {/* Depreciation Summary */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">DEPRECIATION SUMMARY</h4>
                  <span className="text-[9px] font-bold text-purple-600 cursor-pointer hover:underline">View Report →</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {/* Card 1 */}
                  <div className="bg-slate-50 rounded-xl border border-slate-100 p-3 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 flex items-center justify-center bg-purple-100 text-purple-600 rounded">
                        <DollarSign size={12} strokeWidth={3} />
                      </div>
                      <span className="text-xs font-black text-slate-900 leading-none tracking-tight">$38,500</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-1">Purchase Price</span>
                  </div>
                  {/* Card 2 */}
                  <div className="bg-slate-50 rounded-xl border border-slate-100 p-3 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded">
                        <Calendar size={12} strokeWidth={3} />
                      </div>
                      <span className="text-xs font-black text-slate-900 leading-none tracking-tight">15 Mar 2022</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-1">Start Date</span>
                  </div>
                  {/* Card 3 */}
                  <div className="bg-slate-50 rounded-xl border border-slate-100 p-3 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 flex items-center justify-center bg-amber-100 text-amber-600 rounded">
                        <Activity size={12} strokeWidth={3} />
                      </div>
                      <span className="text-xs font-black text-slate-900 leading-none tracking-tight">$5,000</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-1">Residual Value</span>
                  </div>
                  {/* Card 4 */}
                  <div className="bg-slate-50 rounded-xl border border-slate-100 p-3 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 flex items-center justify-center bg-rose-100 text-rose-600 rounded">
                        <TrendingUp size={12} strokeWidth={3} className="transform rotate-180" />
                      </div>
                      <span className="text-xs font-black text-slate-900 leading-none tracking-tight">$18,460</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-1">Accum. Deprec.</span>
                  </div>
                  {/* Card 5 */}
                  <div className="bg-slate-50 rounded-xl border border-slate-100 p-3 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded">
                        <Clock size={12} strokeWidth={3} />
                      </div>
                      <span className="text-xs font-black text-slate-900 leading-none tracking-tight">5 Years</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-1">Useful Life</span>
                  </div>
                  {/* Card 6 */}
                  <div className="bg-slate-50 rounded-xl border border-slate-100 p-3 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded">
                        <DollarSign size={12} strokeWidth={3} />
                      </div>
                      <span className="text-xs font-black text-slate-900 leading-none tracking-tight">$20,040</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-1">Book Value</span>
                  </div>
                  {/* Card 7 */}
                  <div className="bg-slate-50 rounded-xl border border-slate-100 p-3 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 flex items-center justify-center bg-slate-200 text-slate-600 rounded">
                        <Layers size={12} strokeWidth={3} />
                      </div>
                      <span className="text-xs font-black text-slate-900 leading-none tracking-tight">Straight Line</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-1">Method</span>
                  </div>
                  {/* Card 8 */}
                  <div className="bg-slate-50 rounded-xl border border-slate-100 p-3 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded">
                        <Activity size={12} strokeWidth={3} />
                      </div>
                      <span className="text-xs font-black text-slate-900 leading-none tracking-tight">$7,700</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-1">Deprec. (YTD)</span>
                  </div>
                </div>
              </div>

              {/* Chart: Cost By Category */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">COST BY CATEGORY (FY 2024-2025)</h4>
                  <span className="text-[9px] font-bold text-purple-600 cursor-pointer hover:underline">View Chart →</span>
                </div>
                <div className="flex items-center gap-4">
                  {/* Custom Donut Chart matching screenshot */}
                  <div className="relative flex items-center justify-center w-24 h-24 shrink-0">
                    <svg width="96" height="96" className="transform -rotate-90">
                      <circle cx="48" cy="48" r="38" fill="transparent" stroke="#E2E8F0" strokeWidth="12" />
                      <circle cx="48" cy="48" r="38" fill="transparent" stroke="#10B981" strokeWidth="12" strokeDasharray="133 238" strokeDashoffset="0" />
                      <circle cx="48" cy="48" r="38" fill="transparent" stroke="#F59E0B" strokeWidth="12" strokeDasharray="77 238" strokeDashoffset="-133" />
                      <circle cx="48" cy="48" r="38" fill="transparent" stroke="#EF4444" strokeWidth="12" strokeDasharray="18 238" strokeDashoffset="-210" />
                      <circle cx="48" cy="48" r="38" fill="transparent" stroke="#8B5CF6" strokeWidth="12" strokeDasharray="6 238" strokeDashoffset="-228" />
                      <circle cx="48" cy="48" r="38" fill="transparent" stroke="#64748B" strokeWidth="12" strokeDasharray="4 238" strokeDashoffset="-234" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-sm font-black text-slate-900 leading-tight">$3,850</span>
                      <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Total Cost<br/>(YTD)</span>
                    </div>
                  </div>
                  {/* Legend */}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between items-center text-[9px]">
                      <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span><span className="font-bold text-slate-600">Fuel / Operating</span></div>
                      <span className="font-black text-slate-900">$2,150.00 <span className="text-slate-400 font-semibold">(55.8%)</span></span>
                    </div>
                    <div className="flex justify-between items-center text-[9px]">
                      <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span><span className="font-bold text-slate-600">Maintenance & Repairs</span></div>
                      <span className="font-black text-slate-900">$1,250.00 <span className="text-slate-400 font-semibold">(32.5%)</span></span>
                    </div>
                    <div className="flex justify-between items-center text-[9px]">
                      <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span><span className="font-bold text-slate-600">Insurance</span></div>
                      <span className="font-black text-slate-900">$300.00 <span className="text-slate-400 font-semibold">(7.8%)</span></span>
                    </div>
                    <div className="flex justify-between items-center text-[9px]">
                      <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span><span className="font-bold text-slate-600">Registration</span></div>
                      <span className="font-black text-slate-900">$100.00 <span className="text-slate-400 font-semibold">(2.6%)</span></span>
                    </div>
                    <div className="flex justify-between items-center text-[9px]">
                      <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span><span className="font-bold text-slate-600">Other</span></div>
                      <span className="font-black text-slate-900">$50.00 <span className="text-slate-400 font-semibold">(1.3%)</span></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart: Monthly Cost Trend */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">MONTHLY COST TREND (FY 2024-2025)</h4>
                  <span className="text-[9px] font-bold text-purple-600 cursor-pointer hover:underline">View Chart →</span>
                </div>
                <div className="relative h-20 w-full mt-2">
                  <div className="absolute left-0 top-0 bottom-4 w-6 flex flex-col justify-between text-[8px] font-bold text-slate-400 text-right pr-1">
                    <span>$800</span>
                    <span>$600</span>
                    <span>$400</span>
                    <span>$200</span>
                    <span>$0</span>
                  </div>
                  <div className="absolute left-6 right-0 top-0 bottom-4 border-l border-b border-slate-200">
                    {/* SVG Line Chart representing the purple trend line */}
                    <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" className="overflow-visible">
                      <path d="M 0,80 L 10,70 L 20,85 L 30,50 L 40,65 L 50,45 L 60,60 L 70,55 L 80,48 L 90,52 L 100,55" fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="80" cy="48" r="3" fill="#fff" stroke="#8B5CF6" strokeWidth="2" />
                    </svg>
                    {/* Tooltip */}
                    <div className="absolute bg-slate-800 text-white text-[8px] font-bold px-1.5 py-0.5 rounded left-[72%] top-[-2px] shadow-lg pointer-events-none whitespace-nowrap">
                      Apr 2025<br/><span className="text-[9px]">$420.00</span>
                    </div>
                  </div>
                  <div className="absolute left-6 right-0 bottom-0 flex justify-between text-[8px] font-bold text-slate-400 pt-1">
                    <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent Cost Alerts Row */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-2">QUICK ACTIONS</h4>
                  <div className="space-y-2">
                    {[
                      { icon: <Plus size={12} />, label: 'Add Cost / Expense' },
                      { icon: <Download size={12} />, label: 'Upload Invoice / Receipt' },
                      { icon: <Calendar size={12} />, label: 'Schedule Maintenance' },
                      { icon: <FileText size={12} />, label: 'View Cost Report' },
                      { icon: <FileText size={12} />, label: 'View Depreciation Report' },
                      { icon: <FileSpreadsheet size={12} />, label: 'Export Cost Data' }
                    ].map((act, i) => (
                      <button key={i} className="w-full flex items-center gap-2 text-slate-600 hover:text-purple-600 transition-colors text-[10px] font-bold group cursor-pointer text-left">
                        <span className="text-slate-400 group-hover:text-purple-600">{act.icon}</span>
                        {act.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">RECENT COST ALERTS</h4>
                    <span className="text-[9px] font-bold text-purple-600 cursor-pointer hover:underline">View All →</span>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-orange-50 border border-orange-100 p-2 rounded-lg flex items-start gap-2">
                      <AlertTriangle size={12} className="text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] font-bold text-slate-800 leading-tight hover:text-purple-600 cursor-pointer hover:underline">Hydraulic Pump Repair</div>
                        <div className="text-[9px] text-slate-500 font-semibold flex justify-between w-full pr-1">
                          <span>$858.00</span><span>25 Apr 2025</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-orange-50 border border-orange-100 p-2 rounded-lg flex items-start gap-2">
                      <AlertTriangle size={12} className="text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] font-bold text-slate-800 leading-tight hover:text-purple-600 cursor-pointer hover:underline">Service Due Soon</div>
                        <div className="text-[9px] text-slate-500 font-semibold mt-0.5">24 Jun 2025</div>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 p-2 rounded-lg flex items-start gap-2">
                      <Info size={12} className="text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] font-bold text-slate-800 leading-tight hover:text-purple-600 cursor-pointer hover:underline">Insurance Renewal</div>
                        <div className="text-[9px] text-slate-500 font-semibold mt-0.5">01 Apr 2026</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* OTHER TABS PLACEHOLDERS */}
      {activeTab !== 'Overview' && activeTab !== 'Specifications' && activeTab !== 'Assignments & History' && activeTab !== 'Costs & Depreciation' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
            <Layers size={24} />
          </div>
          <h3 className="text-sm font-black text-slate-900 mb-1">{activeTab} Details</h3>
          <p className="text-xs text-slate-500 font-semibold max-w-md mx-auto mb-4">
            Viewing {activeTab.toLowerCase()} records and activity for {asset.fullName} ({asset.id}).
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
            <CheckCircle size={14} /> All data up to date
          </div>
        </div>
      )}

      {/* EDIT ASSET MODAL OVERLAY */}
      {isEditing && (
        <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-16 pb-6 px-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[82vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
                  <Edit size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Edit Asset Details – {asset.id}</h3>
                  <p className="text-xs text-slate-500 font-semibold">Update specifications, category, status, pricing, and notes.</p>
                </div>
              </div>
              <button onClick={() => setIsEditing(false)} className="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer">
                <X size={16} />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveEditAsset} className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
              
              {/* Section 1: Basic Information */}
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1.5 flex items-center gap-2">
                  <Package size={14} className="text-purple-600" /> Basic Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Asset ID</label>
                    <input type="text" value={editFormData.id} disabled className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Asset Name</label>
                    <input type="text" value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value, fullName: `${e.target.value} Forklift` })} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Full Name</label>
                    <input type="text" value={editFormData.fullName} onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Category</label>
                    <select value={editFormData.category} onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500 cursor-pointer">
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
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Type</label>
                    <input type="text" value={editFormData.type} onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Make / Model</label>
                    <input type="text" value={editFormData.makeModel} onChange={(e) => setEditFormData({ ...editFormData, makeModel: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Serial Number</label>
                    <input type="text" value={editFormData.serialNo} onChange={(e) => setEditFormData({ ...editFormData, serialNo: e.target.value, serialNumberFull: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Year of Manufacture</label>
                    <input type="text" value={editFormData.year} onChange={(e) => setEditFormData({ ...editFormData, year: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500" />
                  </div>
                </div>
              </div>

              {/* Section 2: Branch & Status */}
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1.5 flex items-center gap-2">
                  <Building size={14} className="text-purple-600" /> Branch, Location & Status
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Branch</label>
                    <select value={editFormData.branch} onChange={(e) => setEditFormData({ ...editFormData, branch: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500 cursor-pointer">
                      <option value="Sydney Head Office">Sydney Head Office</option>
                      <option value="Yard - Sydney HO">Yard - Sydney HO</option>
                      <option value="Melbourne Depot">Melbourne Depot</option>
                      <option value="Brisbane Branch">Brisbane Branch</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Current Location</label>
                    <input type="text" value={editFormData.currentLocation} onChange={(e) => setEditFormData({ ...editFormData, currentLocation: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Assigned To</label>
                    <input type="text" value={editFormData.assignedTo} onChange={(e) => setEditFormData({ ...editFormData, assignedTo: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Status</label>
                    <select value={editFormData.status} onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500 cursor-pointer">
                      <option value="Active">Active</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Out of Service">Out of Service</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Condition</label>
                    <select value={editFormData.condition} onChange={(e) => setEditFormData({ ...editFormData, condition: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500 cursor-pointer">
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Usage Type</label>
                    <input type="text" value={editFormData.usageType} onChange={(e) => setEditFormData({ ...editFormData, usageType: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500" />
                  </div>
                </div>
              </div>

              {/* Section 3: Pricing & Financials */}
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1.5 flex items-center gap-2">
                  <DollarSign size={14} className="text-purple-600" /> Pricing & Financials
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Purchase Date</label>
                    <input type="text" value={editFormData.purchaseDate} onChange={(e) => setEditFormData({ ...editFormData, purchaseDate: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Purchase Price</label>
                    <input type="text" value={editFormData.purchasePrice} onChange={(e) => setEditFormData({ ...editFormData, purchasePrice: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Current Book Value</label>
                    <input type="text" value={editFormData.bookValue} onChange={(e) => setEditFormData({ ...editFormData, bookValue: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Supplier</label>
                    <input type="text" value={editFormData.supplier} onChange={(e) => setEditFormData({ ...editFormData, supplier: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Operating Hours</label>
                    <input type="text" value={editFormData.operatingHours} onChange={(e) => setEditFormData({ ...editFormData, operatingHours: e.target.value, odometer: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Warranty Expiry</label>
                    <input type="text" value={editFormData.warrantyExpiry} onChange={(e) => setEditFormData({ ...editFormData, warrantyExpiry: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500" />
                  </div>
                </div>
              </div>

              {/* Section 4: Description & Notes */}
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1.5 flex items-center gap-2">
                  <FileText size={14} className="text-purple-600" /> Description & Notes
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Asset Description</label>
                    <textarea rows={3} value={editFormData.description} onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500 resize-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Operator / Internal Notes</label>
                    <textarea rows={2} value={editFormData.notes} onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500 resize-none" />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                  Cancel
                </button>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setEditFormData({ ...asset })} className="px-4 py-2 border border-purple-200 rounded-lg text-xs font-bold text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer">
                    Reset Fields
                  </button>
                  <button type="submit" className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
                    <Check size={14} /> Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1. ASSIGN / TRANSFER ASSET MODAL */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-16 pb-6 px-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
            <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
                  <User size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Assign / Transfer Asset – {asset.id}</h3>
                  <p className="text-xs text-slate-500 font-semibold">Reassign asset to a new branch, location or operator.</p>
                </div>
              </div>
              <button onClick={() => setIsAssignModalOpen(false)} className="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleConfirmTransfer} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Target Branch</label>
                <select value={transferForm.branch} onChange={(e) => setTransferForm({ ...transferForm, branch: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500 cursor-pointer">
                  <option value="Sydney Head Office">Sydney Head Office</option>
                  <option value="Yard - Sydney HO">Yard - Sydney HO</option>
                  <option value="Melbourne Depot">Melbourne Depot</option>
                  <option value="Brisbane Branch">Brisbane Branch</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Specific Location / Bay</label>
                <input type="text" value={transferForm.currentLocation} onChange={(e) => setTransferForm({ ...transferForm, currentLocation: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500" placeholder="e.g. Warehouse 2 - Bay C1" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Assigned Operator / Unit</label>
                <select value={transferForm.assignedTo} onChange={(e) => setTransferForm({ ...transferForm, assignedTo: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500 cursor-pointer">
                  <option value="Warehouse 1">Warehouse 1 (General)</option>
                  <option value="Mike Thompson">Mike Thompson (Driver)</option>
                  <option value="James Patel">James Patel (Fleet Tech)</option>
                  <option value="Robert Taylor">Robert Taylor (Supervisor)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Transfer Notes / Reason</label>
                <textarea rows={2} value={transferForm.notes} onChange={(e) => setTransferForm({ ...transferForm, notes: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500 resize-none" placeholder="Reason for transfer or assignment..." />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                <button type="button" onClick={() => setIsAssignModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
                  <Check size={14} /> Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. SCHEDULE MAINTENANCE MODAL */}
      {isMaintenanceModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-16 pb-6 px-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
            <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
                  <Wrench size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Schedule Maintenance – {asset.id}</h3>
                  <p className="text-xs text-slate-500 font-semibold">Book a preventative service or repair for this asset.</p>
                </div>
              </div>
              <button onClick={() => setIsMaintenanceModalOpen(false)} className="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleConfirmMaintenance} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Service Type</label>
                <select value={maintForm.serviceType} onChange={(e) => setMaintForm({ ...maintForm, serviceType: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500 cursor-pointer">
                  <option value="Oil & Filter Change">Oil & Filter Change</option>
                  <option value="Hydraulic System Check">Hydraulic System Check</option>
                  <option value="Annual Full Inspection">Annual Full Inspection</option>
                  <option value="Brake & Tire Service">Brake & Tire Service</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Scheduled Date</label>
                  <input type="text" value={maintForm.date} onChange={(e) => setMaintForm({ ...maintForm, date: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Technician / Provider</label>
                  <input type="text" value={maintForm.provider} onChange={(e) => setMaintForm({ ...maintForm, provider: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Service Instructions</label>
                <textarea rows={2} value={maintForm.instructions} onChange={(e) => setMaintForm({ ...maintForm, instructions: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500 resize-none" />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                <button type="button" onClick={() => setIsMaintenanceModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
                  <Check size={14} /> Schedule Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. PRINT LABEL / QR MODAL */}
      {isPrintQRModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-16 pb-6 px-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
            <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
                  <QrCode size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Print Asset QR Tag – {asset.id}</h3>
                  <p className="text-xs text-slate-500 font-semibold">Generate printable barcode label & QR tag.</p>
                </div>
              </div>
              <button onClick={() => setIsPrintQRModalOpen(false)} className="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 text-center space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 bg-slate-50 max-w-xs mx-auto space-y-3 shadow-inner">
                <div className="text-[10px] font-black text-purple-700 uppercase tracking-widest">HERO LOGISTICS • ASSET TAG</div>
                <div className="w-24 h-24 bg-white border border-slate-200 rounded-xl mx-auto flex items-center justify-center p-2 shadow-sm">
                  <QrCode size={72} className="text-slate-900" />
                </div>
                <div className="text-sm font-black text-slate-900 tracking-tight">{asset.id}</div>
                <div className="text-xs font-bold text-slate-700">{asset.fullName}</div>
                <div className="text-[10px] text-slate-500 font-semibold">{asset.branch}</div>
              </div>

              <div className="flex justify-between items-center text-xs font-semibold text-slate-600 pt-2">
                <span>Label Format: <b>4" x 2" Standard Heavy Duty</b></span>
                <span>Quantity: <b>1 Tag</b></span>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <button type="button" onClick={() => setIsPrintQRModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button type="button" onClick={handlePrintAction} className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
                  <Download size={14} /> Print Asset Tag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. DEACTIVATE ASSET MODAL */}
      {isDeactivateModalOpen && (
        <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-16 pb-6 px-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
            <div className="p-5 border-b border-rose-100 bg-rose-50/40 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-rose-900">Deactivate Asset – {asset.id}</h3>
                  <p className="text-xs text-rose-600 font-semibold">Mark asset as Out of Service or Retired.</p>
                </div>
              </div>
              <button onClick={() => setIsDeactivateModalOpen(false)} className="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Are you sure you want to deactivate <b>{asset.fullName} ({asset.id})</b>? This will change its status to <b>Out of Service</b> and unassign it from current operations.
              </p>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Reason for Deactivation</label>
                <select value={deactivateReason} onChange={(e) => setDeactivateReason(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-rose-500 cursor-pointer">
                  <option value="Scheduled Retirement / End of Life">Scheduled Retirement / End of Life</option>
                  <option value="Major Breakdown / Uneconomical to Repair">Major Breakdown / Uneconomical to Repair</option>
                  <option value="Sold to Third Party">Sold to Third Party</option>
                  <option value="Transferred Out of Network">Transferred Out of Network</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                <button type="button" onClick={() => setIsDeactivateModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button type="button" onClick={handleConfirmDeactivate} className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
                  Confirm Deactivation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DEVELOPER NOTES (For Costs & Depreciation) */}
      {activeTab === 'Costs & Depreciation' && (
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Info size={16} className="text-blue-600" />
            <h4 className="text-xs font-black text-blue-900 uppercase tracking-widest">Developer Notes: Costs & Depreciation Module</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                  <p className="text-[11px] text-blue-800 leading-relaxed font-medium"><strong>Purpose:</strong> This view provides a comprehensive breakdown of all costs associated with the asset (fuel, maintenance, insurance) alongside its current depreciation schedule and book value.</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                  <p className="text-[11px] text-blue-800 leading-relaxed font-medium"><strong>Key Features:</strong> Sub-tabs for granular cost analysis, filterable cost expense table, interactive donut chart (Cost by Category), line chart (Monthly Trend), and actionable alerts.</p>
                </li>
              </ul>
            </div>
            <div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                  <p className="text-[11px] text-blue-800 leading-relaxed font-medium"><strong>Automation & Alerts:</strong> "Recent Cost Alerts" pulls data from upcoming maintenance schedules and impending insurance/registration renewals.</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                  <p className="text-[11px] text-blue-800 leading-relaxed font-medium"><strong>Permissions:</strong> Financial data (Purchase Price, Depreciation, Total Costs) is restricted to Finance/Admin roles. Standard drivers only see basic info.</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                  <p className="text-[11px] text-blue-800 leading-relaxed font-medium"><strong>Data Sources:</strong> Costs pull from <code className="bg-blue-100 px-1 py-0.5 rounded text-[10px]">assets_costs</code> and <code className="bg-blue-100 px-1 py-0.5 rounded text-[10px]">asset_depreciation</code> tables.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
