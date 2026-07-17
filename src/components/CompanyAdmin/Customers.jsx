import React, { useState } from 'react';
import {
  Users, UserCheck, UserPlus, UserMinus, Star, Search, Plus, Upload, Download, MoreVertical,
  ChevronDown, ArrowRight, Eye, Edit, UserCircle, Trash2, MapPin, Phone, Mail, Globe, Clock, Package, CheckCircle2, FileText, ChevronLeft, Building2, Briefcase, Lock, List, Settings, DollarSign, Activity, AlertCircle, Wrench, Truck, Calendar, Filter, X, MessageSquare, ToggleLeft, ToggleRight, Info, Map, Car, Calculator, Shield, ExternalLink, ChevronRight
} from 'lucide-react';

const mockCustomers = [
  {
    id: 'FR', name: 'FreightCo', abn: '68 961 770 797', type: 'Business',
    contactName: 'Casey Davis', contactEmail: 'casey.davis@example.com', contactPhone: '0415 166 693',
    transportModules: ['truck', 'box'], billingTerms: '14 Days', billingType: 'EOM',
    manager: 'Sarah Mitchell', status: 'Active'
  },
  {
    id: 'SP', name: 'Speedy Logistics', abn: '35 903 976 656', type: 'Corporate',
    contactName: 'Morgan Brown', contactEmail: 'morgan.brown@example.com', contactPhone: '0483 561 533',
    transportModules: ['truck', 'box'], billingTerms: '30 Days', billingType: 'EOM',
    manager: 'Mike Thompson', status: 'Active'
  },
  {
    id: 'AP', name: 'Apex Transport', abn: '15 285 448 181', type: 'Business',
    contactName: 'Casey Doe', contactEmail: 'casey.doe@example.com', contactPhone: '0478 711 869',
    transportModules: ['truck'], billingTerms: '7 Days', billingType: 'EOM',
    manager: 'Sarah Mitchell', status: 'Inactive'
  },
  {
    id: 'BL', name: 'BlueWave Lines', abn: '39 310 255 839', type: 'Business',
    contactName: 'Alex Brown', contactEmail: 'alex.brown@example.com', contactPhone: '0466 545 768',
    transportModules: ['alert'], billingTerms: '30 Days', billingType: 'EOM',
    manager: 'Mike Thompson', status: 'Suspended'
  },
  {
    id: 'CO', name: 'Continental Movers', abn: '18 460 423 451', type: 'Corporate',
    contactName: 'Casey Brown', contactEmail: 'casey.brown@example.com', contactPhone: '0452 192 690',
    transportModules: ['alert', 'box'], billingTerms: '14 Days', billingType: 'EOM',
    manager: 'Mike Thompson', status: 'Active'
  },
  {
    id: 'DY', name: 'Dynamic Hauling', abn: '56 177 771 113', type: 'Corporate',
    contactName: 'Chris Jackson', contactEmail: 'chris.jackson@example.com', contactPhone: '0493 502 999',
    transportModules: ['truck', 'alert'], billingTerms: '30 Days', billingType: 'EOM',
    manager: 'Mike Thompson', status: 'Active'
  },
];

const initialDocuments = [
  { name: 'Master Service Agreement.pdf', size: '2.4 MB', ver: 'Version 2.1', cat: 'Contracts', type: 'Agreement', userName: 'Sarah Mitchell', userInitials: 'SM', date: '01/07/2025', time: '10:24 AM', status: 'Active' },
  { name: 'Service Level Agreement.docx', size: '1.1 MB', ver: 'Version 1.0', cat: 'Contracts', type: 'SLA', userName: 'Sarah Mitchell', userInitials: 'SM', date: '15/06/2025', time: '02:15 PM', status: 'Active' },
  { name: 'Insurance Certificate 2025.pdf', size: '2.3 MB', ver: 'Version 1.0', cat: 'Insurance', type: 'Certificate', userName: 'John Davis', userInitials: 'JD', date: '15/06/2025', time: '08:30 AM', status: 'Active' },
  { name: 'Public Liability Insurance.pdf', size: '1.7 MB', ver: 'Version 1.0', cat: 'Insurance', type: 'Policy', userName: 'John Davis', userInitials: 'JD', date: '20/05/2025', time: '09:12 AM', status: 'Active' },
  { name: 'Pricing Matrix 2025.xlsx', size: '952 KB', ver: 'Version 1.0', cat: 'Pricing', type: 'Rate Sheet', userName: 'Sarah Mitchell', userInitials: 'SM', date: '20/05/2025', time: '11:05 AM', status: 'Active' },
  { name: 'Dox Invoice Template.pdf', size: '1.2 MB', ver: 'Version 1.0', cat: 'Financial', type: 'Template', userName: 'Sarah Mitchell', userInitials: 'SM', date: '03/05/2025', time: '03:45 PM', status: 'Active' },
  { name: 'Dangerous Goods Approval.pdf', size: '2.6 MB', ver: 'Version 1.0', cat: 'Compliance', type: 'Certificate', userName: 'Sarah Mitchell', userInitials: 'SM', date: '10/05/2025', time: '02:10 PM', status: 'Expiring Soon' },
  { name: 'DG Chain of Responsibility.pdf', size: '1.4 MB', ver: 'Version 1.0', cat: 'Compliance', type: 'Certificate', userName: 'John Davis', userInitials: 'JD', date: '10/05/2025', time: '09:30 AM', status: 'Active' }
];

export default function Customers() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeActionMenu, setActiveActionMenu] = useState(null);
  const [activeDetailsTab, setActiveDetailsTab] = useState('Overview');

  const [selectedDocCategory, setSelectedDocCategory] = useState('All Documents');
  const [activeDocument, setActiveDocument] = useState(initialDocuments[2]);
  const [showDocPreview, setShowDocPreview] = useState(true);
  const [docSearchQuery, setDocSearchQuery] = useState('');

  const [newCustomerForm, setNewCustomerForm] = useState({ name: '', abn: '', type: 'Corporate' });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All States');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [moduleFilter, setModuleFilter] = useState('All Mods');
  const [managerFilter, setManagerFilter] = useState('All Managers');

  const filteredCustomers = mockCustomers.filter(c => {
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase()) && !c.abn.includes(searchQuery)) return false;
    if (statusFilter !== 'All States' && c.status !== statusFilter) return false;
    if (typeFilter !== 'All Types' && c.type !== typeFilter) return false;
    if (managerFilter !== 'All Managers' && c.manager !== managerFilter) return false;
    if (moduleFilter !== 'All Mods') {
      const modMap = { 'Truck': 'truck', 'Box': 'box', 'Alert': 'alert' };
      const modKey = modMap[moduleFilter];
      if (modKey && !c.transportModules.includes(modKey)) return false;
    }
    return true;
  });

  const toggleActionMenu = (id) => {
    if (activeActionMenu === id) setActiveActionMenu(null);
    else setActiveActionMenu(id);
  };

  const handleSaveCustomer = (e) => {
    e.preventDefault();
    setShowAddModal(false);
  };

  if (selectedCustomer) {
    return (
      <div className="flex-grow bg-[#F8FAFC] p-2 sm:p-6 w-full text-left font-sans custom-scrollbar overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-start gap-4">
            <button onClick={() => setSelectedCustomer(null)} className="w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer mt-1 shrink-0">
              <ChevronLeft size={16} />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {activeDetailsTab === 'Contacts' ? '6.3 - Customer Contacts' :
                    activeDetailsTab === 'Billing Rules' ? '6.4 - Customer Billing Rules' :
                      activeDetailsTab === 'Pricing' ? '6.5 - Customer Pricing' :
                        activeDetailsTab === 'Documents' ? '6.6 - Customer Documents' :
                          '6.2 - Customer Details'
                  }
                </h2>
                <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[8px] uppercase font-black tracking-widest">Active Customer</span>
                <span className="text-[10px] text-slate-400 font-semibold">Customer since: 12 Feb 2022</span>
              </div>
              {activeDetailsTab === 'Documents' ? (
                <div className="flex flex-col gap-0.5">
                  <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    {selectedCustomer.name} <Star size={16} className="text-amber-400 fill-amber-400 animate-pulse" />
                  </h1>
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 mt-1">
                    <span>Customers</span>
                    <span className="text-slate-300">/</span>
                    <span>{selectedCustomer.name}</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-600">Customer Documents</span>
                  </div>
                </div>
              ) : (
                <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  {selectedCustomer.name} <Star size={20} className="text-amber-400 fill-amber-400" />
                </h1>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowCreateLoadModal(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
              <Plus size={14} /> Create Load
            </button>
            <button onClick={() => setShowSendMessageModal(true)} className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
              <MessageSquare size={14} /> Message
            </button>
            <button onClick={() => setShowEditCustomerModal(true)} className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
              <Edit size={14} /> Edit Customer
            </button>
            <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
              More Actions <MoreVertical size={14} />
            </button>
          </div>
        </div>

        {activeDetailsTab === 'Documents' && (
          <div className="flex justify-end mb-2 -mt-2">
            <button onClick={() => setSelectedCustomer(null)} className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer">
              &larr; Back to Customers
            </button>
          </div>
        )}

        {/* Stats / Title Bar */}
        <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-sm flex flex-row flex-nowrap items-center justify-start gap-8 mb-6 overflow-x-auto custom-scrollbar w-full">
          <div className="flex items-center gap-5 shrink-0">
            {activeDetailsTab === 'Documents' ? (
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-xs">
                <div className="w-8 h-8 rounded-full bg-indigo-50/50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                  <Info size={16} />
                </div>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-2xl border border-blue-100 shrink-0">
                {selectedCustomer.id}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-black text-slate-900">{selectedCustomer.name}</h2>
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ml-1">Active</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 mb-2">
                <span>ABN: {selectedCustomer.abn || '68 961 770 797'}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span>ACN: 123 456 789</span>
              </div>
              <div>
                <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-[8px] uppercase font-black tracking-widest">Strategic Account</span>
              </div>
            </div>
          </div>

          <div className="h-10 w-px bg-slate-100 hidden sm:block shrink-0"></div>

          <div className="flex flex-row flex-nowrap items-center gap-8 shrink-0">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs border border-indigo-100 shrink-0">
                SM
              </div>
              <div className="shrink-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Account Manager</p>
                <p className="text-sm font-bold text-slate-900">{selectedCustomer.manager}</p>
                <p className="text-[10px] text-slate-500 font-semibold">{selectedCustomer.contactEmail || 'sarah.m@herologistics.com'}</p>
              </div>
            </div>

            <div className="h-10 w-px bg-slate-100 hidden sm:block shrink-0"></div>

            <div className="shrink-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Billing Terms</p>
              <p className="text-sm font-black text-slate-900">14 Days EOM</p>
            </div>

            <div className="h-10 w-px bg-slate-100 hidden sm:block shrink-0"></div>

            <div className="shrink-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Credit Limit</p>
              <p className="text-sm font-black text-slate-900">$250,000.00</p>
            </div>

            <div className="h-10 w-px bg-slate-100 hidden sm:block shrink-0"></div>

            <div className="shrink-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 text-right">Outstanding</p>
              <p className="text-sm font-black text-red-600 text-right mb-0.5">$32,450.00</p>
              <div className="flex justify-between items-center text-[9px] font-bold">
                <span className="text-slate-400 uppercase tracking-widest">Credit Available</span>
                <span className="text-emerald-600 ml-3 font-black text-[10px]">$217,550.00</span>
              </div>
            </div>

            <div className="h-10 w-px bg-slate-100 hidden sm:block shrink-0"></div>

            <div className="shrink-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total Revenue (YTD)</p>
              <p className="text-sm font-black text-slate-900">$2,480,650.00</p>
            </div>

            <div className="h-10 w-px bg-slate-100 hidden sm:block shrink-0"></div>

            <div className="shrink-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total Loads</p>
              <p className="text-sm font-black text-slate-900">42</p>
            </div>

            <div className="h-10 w-px bg-slate-100 hidden sm:block shrink-0"></div>

            <div className="shrink-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Last Load</p>
              <p className="text-sm font-black text-indigo-600 hover:underline cursor-pointer">PO-12546</p>
              <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">08/07/2025</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-slate-200 mb-6 overflow-x-auto custom-scrollbar pb-1">
          {['Overview', 'Contacts', 'Billing Rules', 'Pricing', 'Transport Modules', 'Instructions', 'Documents', 'Activity', 'Financials'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveDetailsTab(tab)}
              className={`text-[10px] pb-3 uppercase tracking-widest font-black whitespace-nowrap transition-colors relative cursor-pointer ${activeDetailsTab === tab
                ? 'text-blue-600'
                : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              {tab}
              {activeDetailsTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>

        {activeDetailsTab === 'Overview' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Flat Grid Structure */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

              {/* Row 1 */}
              {/* Company Info */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-slate-800">
                    <FileText size={16} className="text-blue-600" />
                    <h3 className="text-sm font-black tracking-tight">Company Information</h3>
                  </div>
                  <button className="text-[10px] font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1 border border-slate-100 px-2 py-1 rounded bg-slate-50 cursor-pointer">
                    <Edit size={12} /> Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm font-semibold text-slate-600">
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5 tracking-widest">Trading Name</span>
                    <span className="text-xs text-slate-900 font-bold">{selectedCustomer.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5 tracking-widest">Phone</span>
                    <span className="text-xs text-slate-900 font-bold">0415 166 693</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5 tracking-widest">ABN</span>
                    <span className="text-xs text-slate-900 font-bold">{selectedCustomer.abn}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5 tracking-widest">Email</span>
                    <span className="text-xs text-slate-900 font-bold">casey.davis@example.com</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5 tracking-widest">ACN</span>
                    <span className="text-xs text-slate-900 font-bold">123 456 789</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5 tracking-widest">Website</span>
                    <span className="text-xs text-slate-900 font-bold">www.abcmotors.com.au</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5 tracking-widest">Industry</span>
                    <span className="text-xs text-slate-900 font-bold">Automotive</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5 tracking-widest">Customer Since</span>
                    <span className="text-xs text-slate-900 font-bold">12 Feb 2022</span>
                  </div>
                  <div className="col-span-1">
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5 tracking-widest">Address</span>
                    <span className="text-xs text-slate-900 font-bold block leading-tight">25 Corporate Drive<br />Epping NSW 2121<br />Australia</span>
                  </div>
                  <div className="col-span-1">
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5 tracking-widest">Status</span>
                    <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider inline-block mb-2">Active</span>
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5 tracking-widest">Customer Type</span>
                    <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider inline-block">Business</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-2 text-slate-850">
                    <Activity size={16} className="text-indigo-650" />
                    <h3 className="text-xs font-black text-slate-900 tracking-tight">Quick Actions</h3>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Create Load', icon: Plus, action: () => setShowCreateLoadModal(true) },
                    { label: 'View Loads', icon: Eye },
                    { label: 'Create Invoice', icon: Plus, action: () => setShowCreateInvoiceModal(true) },
                    { label: 'Send Message', icon: MessageSquare, action: () => setShowSendMessageModal(true) },
                    { label: 'View Invoices', icon: FileText },
                    { label: 'Edit Customer', icon: Edit, action: () => setShowEditCustomerModal(true) },
                    { label: 'Add Contact', icon: UserPlus },
                    { label: 'Upload Document', icon: Upload },
                    { label: 'More Actions', icon: MoreVertical }
                  ].map((act, idx) => {
                    const Icon = act.icon;
                    return (
                      <button
                        key={idx}
                        onClick={act.action}
                        className="flex flex-col items-center justify-center p-3 bg-white border border-slate-100 hover:border-slate-350 hover:shadow-xs rounded-2xl transition-all cursor-pointer aspect-square"
                      >
                        <Icon size={18} className="text-slate-600 mb-1.5" />
                        <span className="text-[10px] font-black text-slate-850 text-center leading-tight">
                          {act.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes & Tags */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-slate-800">
                    <Star size={16} className="text-blue-600" />
                    <h3 className="text-sm font-black tracking-tight">Notes & Tags</h3>
                  </div>
                  <button className="text-[10px] font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1 border border-slate-100 px-2 py-1 rounded bg-slate-50 cursor-pointer">
                    <Edit size={12} /> Edit
                  </button>
                </div>

                <div className="mb-5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Internal Notes</p>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      Priority customer. Regular car carrier runs.
                    </p>
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      Weekly exports to Brisbane port.
                    </p>
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      Requires advance booking for all pickups.
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md text-[10px] font-black uppercase tracking-wider border border-indigo-100 shadow-sm">Car Carrying</span>
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md text-[10px] font-black uppercase tracking-wider border border-amber-100 shadow-sm">VIP</span>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-black uppercase tracking-wider border border-emerald-100 shadow-sm">Regular</span>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[10px] font-black uppercase tracking-wider border border-slate-200 shadow-sm">Export</span>
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              {/* Contacts */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-slate-800">
                    <Users size={16} className="text-blue-600" />
                    <h3 className="text-sm font-black tracking-tight">Contacts</h3>
                  </div>
                  <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
                    <Plus size={12} /> Add Contact
                  </button>
                </div>
                <div className="space-y-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 font-black flex items-center justify-center text-xs border border-indigo-100 shrink-0">JS</div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-900 truncate">John Smith</p>
                        <span className="bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded text-[8px] uppercase font-black tracking-wider ml-2 shrink-0">Primary</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold mt-0.5">
                        <Phone size={10} /> 0401 234 567
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold truncate mt-0.5">
                        <Mail size={10} /> john.smith@abcmotors.com.au
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 font-black flex items-center justify-center text-xs border border-emerald-100 shrink-0">MK</div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-900 truncate">Michael King</p>
                        <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded text-[8px] uppercase font-black tracking-wider ml-2 shrink-0">Accounts</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold mt-0.5">
                        <Phone size={10} /> 0412 345 678
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold truncate mt-0.5">
                        <Mail size={10} /> michael.king@abcmotors.com.au
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 font-black flex items-center justify-center text-xs border border-amber-100 shrink-0">SP</div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-900 truncate">Sarah Patel</p>
                        <span className="bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded text-[8px] uppercase font-black tracking-wider ml-2 shrink-0">Operations</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold mt-0.5">
                        <Phone size={10} /> 0411 567 890
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold truncate mt-0.5">
                        <Mail size={10} /> sarah.patel@abcmotors.com.au
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 font-black flex items-center justify-center text-xs border border-red-100 shrink-0">AH</div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-900 truncate">After Hours</p>
                        <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded text-[8px] uppercase font-black tracking-wider ml-2 shrink-0">After Hours</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold mt-0.5">
                        <Phone size={10} /> 1300 123 456
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold truncate mt-0.5">
                        <Mail size={10} /> afterhours@abcmotors.com.au
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
                    View All Contacts <ArrowRight size={12} />
                  </button>
                </div>
              </div>

              {/* Transport Modules */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-slate-800">
                    <Truck size={16} className="text-blue-600" />
                    <h3 className="text-sm font-black tracking-tight">Transport Modules</h3>
                  </div>
                  <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
                    Manage Modules
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-6 h-6 rounded bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200">
                      <Car size={14} className="text-slate-600" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-black text-slate-900">Car Carrying</p>
                        <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded text-[8px] uppercase font-black tracking-wider">Enabled</span>
                      </div>
                      <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Special requirements and rules configured</p>
                    </div>
                    <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 shrink-0 cursor-pointer">View Details &rarr;</button>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-6 h-6 rounded bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200">
                      <Package size={14} className="text-slate-600" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-black text-slate-900">General Freight</p>
                        <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded text-[8px] uppercase font-black tracking-wider">Enabled</span>
                      </div>
                      <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Standard rates and rules applied</p>
                    </div>
                    <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 shrink-0 cursor-pointer">View Details &rarr;</button>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-6 h-6 rounded bg-red-50 flex items-center justify-center shrink-0 border border-red-200">
                      <AlertCircle size={14} className="text-red-500" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-black text-slate-400">Dangerous Goods</p>
                        <span className="text-slate-400 text-[8px] uppercase font-black tracking-wider">Disabled</span>
                      </div>
                      <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Module not enabled for this customer</p>
                    </div>
                    <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 shrink-0 cursor-pointer">Enable Module</button>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-6 h-6 rounded bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200">
                      <Building2 size={14} className="text-slate-600" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-black text-slate-900">Warehousing</p>
                        <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded text-[8px] uppercase font-black tracking-wider">Enabled</span>
                      </div>
                      <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Storage and handling configured</p>
                    </div>
                    <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 shrink-0 cursor-pointer">View Details &rarr;</button>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-2 text-slate-800">
                    <DollarSign size={16} className="text-blue-600" />
                    <h3 className="text-sm font-black tracking-tight">Financial Summary</h3>
                  </div>
                </div>
                <div className="space-y-4 flex-grow">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold">Outstanding (Overdue)</span>
                    <span className="font-black text-red-600">$12,450.00</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold">Outstanding (Current)</span>
                    <span className="font-black text-slate-900">$20,000.00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-3">
                    <span className="text-slate-900 font-black">Total Outstanding</span>
                    <span className="font-black text-slate-900">$32,450.00</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-2">
                    <span className="text-slate-500 font-bold">Credit Limit</span>
                    <span className="font-black text-slate-900">$250,000.00</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold">Credit Available</span>
                    <span className="font-black text-emerald-600">$217,550.00</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-4 border-t border-slate-100">
                    <span className="text-slate-500 font-bold">Revenue (This Month)</span>
                    <span className="font-black text-slate-900">$320,400.00</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold">Revenue (YTD)</span>
                    <span className="font-black text-slate-900">$2,480,650.00</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
                    View Financial Details <ArrowRight size={12} />
                  </button>
                </div>
              </div>

              {/* Row 3 */}
              {/* Recent Loads (spans 2) */}
              <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-slate-800">
                    <Truck size={16} className="text-blue-600" />
                    <h3 className="text-sm font-black tracking-tight">Recent Loads</h3>
                  </div>
                  <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
                    View All Loads <ArrowRight size={12} />
                  </button>
                </div>
                <div className="overflow-x-auto custom-scrollbar pb-2 px-1 w-full">
                  <table className="w-full text-left text-[13px] whitespace-nowrap min-w-[1100px]">
                    <thead>
                      <tr className="border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider bg-white">
                        <th className="py-4 px-5">LOAD REF</th>
                        <th className="py-4 px-5">STATUS</th>
                        <th className="py-4 px-5">TYPE</th>
                        <th className="py-4 px-5">PICKUP</th>
                        <th className="py-4 px-5">DELIVERY</th>
                        <th className="py-4 px-5">DRIVER</th>
                        <th className="py-4 px-5">PICKUP DATE</th>
                        <th className="py-4 px-5">DELIVERY DATE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-5 font-black text-indigo-600">PO-12546</td>
                        <td className="py-4 px-5"><span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Active</span></td>
                        <td className="py-4 px-5 text-slate-500">Car Carrying</td>
                        <td className="py-4 px-5 text-slate-700">Melbourne</td>
                        <td className="py-4 px-5 text-slate-700">Brisbane</td>
                        <td className="py-4 px-5 text-slate-500">Mike Thompson</td>
                        <td className="py-4 px-5 text-slate-500">08/07/2025</td>
                        <td className="py-4 px-5 text-slate-500">09/07/2025</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-5 font-black text-indigo-600">PO-12540</td>
                        <td className="py-4 px-5"><span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Completed</span></td>
                        <td className="py-4 px-5 text-slate-500">Car Carrying</td>
                        <td className="py-4 px-5 text-slate-700">Sydney</td>
                        <td className="py-4 px-5 text-slate-700">Adelaide</td>
                        <td className="py-4 px-5 text-slate-500">David Wilson</td>
                        <td className="py-4 px-5 text-slate-500">02/07/2025</td>
                        <td className="py-4 px-5 text-slate-500">03/07/2025</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-5 font-black text-indigo-600">PO-12530</td>
                        <td className="py-4 px-5"><span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Completed</span></td>
                        <td className="py-4 px-5 text-slate-500">General Freight</td>
                        <td className="py-4 px-5 text-slate-700">Brisbane</td>
                        <td className="py-4 px-5 text-slate-700">Melbourne</td>
                        <td className="py-4 px-5 text-slate-500">Chris Lee</td>
                        <td className="py-4 px-5 text-slate-500">24/06/2025</td>
                        <td className="py-4 px-5 text-slate-500">25/06/2025</td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-5 font-black text-indigo-600">PO-12515</td>
                        <td className="py-4 px-5"><span className="text-[10px] font-black uppercase tracking-wider text-red-600 bg-red-50 px-2 py-1 rounded">Cancelled</span></td>
                        <td className="py-4 px-5 text-slate-500">Car Carrying</td>
                        <td className="py-4 px-5 text-slate-700">Sydney</td>
                        <td className="py-4 px-5 text-slate-700">Perth</td>
                        <td className="py-4 px-5 italic text-slate-400">Not Assigned</td>
                        <td className="py-4 px-5 text-slate-500">12/06/2025</td>
                        <td className="py-4 px-5 text-slate-500">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-slate-800">
                    <FileText size={16} className="text-blue-600" />
                    <h3 className="text-sm font-black tracking-tight">Special Instructions</h3>
                  </div>
                  <button className="text-[10px] font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1 border border-slate-100 px-2 py-1 rounded bg-slate-50 cursor-pointer">
                    <Edit size={12} /> Edit
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 mb-1">
                      <CheckCircle2 size={12} className="text-blue-600" /> Delivery Instructions
                    </div>
                    <p className="text-[10px] font-semibold text-slate-500 pl-4 leading-relaxed">
                      Report to receiving office before unloading. Photo POD required for all deliveries.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 mb-1">
                      <CheckCircle2 size={12} className="text-blue-600" /> Site Requirements
                    </div>
                    <p className="text-[10px] font-semibold text-slate-500 pl-4 leading-relaxed">
                      High visibility vest must be worn on site. Speed limit 10km/h within yard.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 mb-1">
                      <CheckCircle2 size={12} className="text-blue-600" /> Booking Requirements
                    </div>
                    <p className="text-[10px] font-semibold text-slate-500 pl-4 leading-relaxed">
                      All deliveries must be booked 24hrs in advance. Contact operations for scheduling.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 mb-1">
                      <CheckCircle2 size={12} className="text-blue-600" /> Access Information
                    </div>
                    <p className="text-[10px] font-semibold text-slate-500 pl-4 leading-relaxed">
                      Main gate code: 2580#<br />Please sign in at security.
                    </p>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
                    View All Instructions <ArrowRight size={12} />
                  </button>
                </div>
              </div>

              {/* Row 4 */}
              {/* Recent Invoices */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-slate-800">
                    <FileText size={16} className="text-blue-600" />
                    <h3 className="text-sm font-black tracking-tight">Recent Invoices</h3>
                  </div>
                  <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
                    View All Invoices <ArrowRight size={12} />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[10px]">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100 font-black text-slate-400 uppercase tracking-widest">
                        <th className="py-3 px-4">INVOICE #</th>
                        <th className="py-3 px-4">DATE</th>
                        <th className="py-3 px-4 text-right">AMOUNT</th>
                        <th className="py-3 px-4 text-center">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4 font-black text-blue-600">INV-2487</td>
                        <td className="py-4 px-4">07/07/2025</td>
                        <td className="py-4 px-4 font-black text-slate-900 text-right">$18,500.00</td>
                        <td className="py-4 px-4 text-center"><span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">UNPAID</span></td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4 font-black text-blue-600">INV-2456</td>
                        <td className="py-4 px-4">23/06/2025</td>
                        <td className="py-4 px-4 font-black text-slate-900 text-right">$15,750.00</td>
                        <td className="py-4 px-4 text-center"><span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">PAID</span></td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4 font-black text-blue-600">INV-2419</td>
                        <td className="py-4 px-4">09/06/2025</td>
                        <td className="py-4 px-4 font-black text-slate-900 text-right">$14,200.00</td>
                        <td className="py-4 px-4 text-center"><span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">PAID</span></td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4 font-black text-blue-600">INV-2380</td>
                        <td className="py-4 px-4">26/05/2025</td>
                        <td className="py-4 px-4 font-black text-slate-900 text-right">$21,800.00</td>
                        <td className="py-4 px-4 text-center"><span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">PAID</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-2 text-slate-800">
                    <Activity size={16} className="text-blue-600" />
                    <h3 className="text-sm font-black tracking-tight">Recent Activity</h3>
                  </div>
                  <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 cursor-pointer">
                    View All
                  </button>
                </div>
                <div className="space-y-5 flex-grow relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  <div className="relative flex items-center justify-between  group is-active">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-emerald-50 text-emerald-500 shadow shrink-0 ">
                      <CheckCircle2 size={12} />
                    </div>
                    <div className="w-[calc(100%-4rem)] ml-3">
                      <p className="text-[10px] font-black text-slate-900">Load PO-12546 completed</p>
                      <p className="text-[9px] font-semibold text-slate-400 mt-0.5">08/07/2025 09:15 AM</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between  group is-active">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-blue-50 text-blue-500 shadow shrink-0 ">
                      <FileText size={12} />
                    </div>
                    <div className="w-[calc(100%-4rem)] ml-3">
                      <p className="text-[10px] font-black text-slate-900">Invoice INV-2487 created</p>
                      <p className="text-[9px] font-semibold text-slate-400 mt-0.5">07/07/2025 03:20 PM</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between  group is-active">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-emerald-50 text-emerald-500 shadow shrink-0 ">
                      <DollarSign size={12} />
                    </div>
                    <div className="w-[calc(100%-4rem)] ml-3">
                      <p className="text-[10px] font-black text-slate-900">Payment received $18,500.00</p>
                      <p className="text-[9px] font-semibold text-slate-400 mt-0.5">05/07/2025 11:44 AM</p>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between  group is-active">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-indigo-50 text-indigo-500 shadow shrink-0 ">
                      <UserPlus size={12} />
                    </div>
                    <div className="w-[calc(100%-4rem)] ml-3">
                      <p className="text-[10px] font-black text-slate-900">New contact Michael King added</p>
                      <p className="text-[9px] font-semibold text-slate-400 mt-0.5">02/07/2025 02:10 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-slate-800">
                    <FileText size={16} className="text-blue-600" />
                    <h3 className="text-sm font-black tracking-tight">Documents</h3>
                  </div>
                  <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 cursor-pointer">
                    View All
                  </button>
                </div>
                <div className="space-y-3 flex-grow">
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors group cursor-pointer shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="text-red-500"><FileText size={16} /></div>
                      <div>
                        <h4 className="text-[10px] font-black text-slate-900 group-hover:text-blue-600 transition-colors">Master Service Agreement</h4>
                        <p className="text-[9px] font-semibold text-slate-400 mt-0.5">PDF • 1.2 MB • 12/02/2022</p>
                      </div>
                    </div>
                    <Download size={14} className="text-slate-300 group-hover:text-blue-500" />
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors group cursor-pointer shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="text-red-500"><FileText size={16} /></div>
                      <div>
                        <h4 className="text-[10px] font-black text-slate-900 group-hover:text-blue-600 transition-colors">Rate Card 2025</h4>
                        <p className="text-[9px] font-semibold text-slate-400 mt-0.5">PDF • 420 KB • 01/01/2025</p>
                      </div>
                    </div>
                    <Download size={14} className="text-slate-300 group-hover:text-blue-500" />
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors group cursor-pointer shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="text-red-500"><FileText size={16} /></div>
                      <div>
                        <h4 className="text-[10px] font-black text-slate-900 group-hover:text-blue-600 transition-colors">Insurance Certificate</h4>
                        <p className="text-[9px] font-semibold text-slate-400 mt-0.5">PDF • 880 KB • 12/01/2025</p>
                      </div>
                    </div>
                    <Download size={14} className="text-slate-300 group-hover:text-blue-500" />
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors group cursor-pointer shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="text-red-500"><FileText size={16} /></div>
                      <div>
                        <h4 className="text-[10px] font-black text-slate-900 group-hover:text-blue-600 transition-colors">Safety Requirements</h4>
                        <p className="text-[9px] font-semibold text-slate-400 mt-0.5">PDF • 950 KB • 05/02/2025</p>
                      </div>
                    </div>
                    <Download size={14} className="text-slate-300 group-hover:text-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeDetailsTab === 'Contacts' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-blue-600" />
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">Customer Contacts</h3>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 font-bold">Manage all key contacts for {selectedCustomer.name}. Set primary contacts and control communication preferences.</p>
                </div>
                <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                  <Plus size={14} /> Add Contact
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="py-3 px-5">CONTACT</th>
                      <th className="py-3 px-5">ROLE</th>
                      <th className="py-3 px-5">DEPARTMENT</th>
                      <th className="py-3 px-5">EMAIL</th>
                      <th className="py-3 px-5">PHONE</th>
                      <th className="py-3 px-5">MOBILE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 font-black flex items-center justify-center border border-indigo-100 shrink-0">JS</div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">John Smith</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Operations Manager</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5"><span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider">Primary Contact</span></td>
                      <td className="py-4 px-5">Operations</td>
                      <td className="py-4 px-5">john.smith@abcmotors.com.au</td>
                      <td className="py-4 px-5"><div className="flex items-center gap-1.5"><Phone size={12} className="text-slate-400" /> 02 8765 4321</div></td>
                      <td className="py-4 px-5"><div className="flex items-center gap-1.5"><Phone size={12} className="text-slate-400" /> 0401 234 567</div></td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 font-black flex items-center justify-center border border-emerald-100 shrink-0">MK</div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">Michael King</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Accounts Manager</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5"><span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider">Accounts Contact</span></td>
                      <td className="py-4 px-5">Finance</td>
                      <td className="py-4 px-5">michael.king@abcmotors.com.au</td>
                      <td className="py-4 px-5"><div className="flex items-center gap-1.5"><Phone size={12} className="text-slate-400" /> 02 8765 4322</div></td>
                      <td className="py-4 px-5"><div className="flex items-center gap-1.5"><Phone size={12} className="text-slate-400" /> 0412 345 678</div></td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 font-black flex items-center justify-center border border-orange-100 shrink-0">SP</div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">Sarah Patel</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Logistics Coordinator</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5"><span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider">Operations Contact</span></td>
                      <td className="py-4 px-5">Logistics</td>
                      <td className="py-4 px-5">sarah.patel@abcmotors.com.au</td>
                      <td className="py-4 px-5"><div className="flex items-center gap-1.5"><Phone size={12} className="text-slate-400" /> 02 8765 4323</div></td>
                      <td className="py-4 px-5"><div className="flex items-center gap-1.5"><Phone size={12} className="text-slate-400" /> 0411 567 890</div></td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 font-black flex items-center justify-center border border-red-100 shrink-0">AH</div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">After Hours Contact</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">24/7 Contact Person</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5"><span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider border border-slate-200">After Hours</span></td>
                      <td className="py-4 px-5">Operations</td>
                      <td className="py-4 px-5">afterhours@abcmotors.com.au</td>
                      <td className="py-4 px-5"><div className="flex items-center gap-1.5"><Phone size={12} className="text-slate-400" /> 02 8765 4333</div></td>
                      <td className="py-4 px-5"><div className="flex items-center gap-1.5"><Phone size={12} className="text-slate-400" /> 1800 123 456</div></td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 font-black flex items-center justify-center border border-purple-100 shrink-0">NT</div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">Nathan Thomas</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Workshop Manager</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5"><span className="bg-orange-50 text-orange-600 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider">Technical Contact</span></td>
                      <td className="py-4 px-5">Workshop</td>
                      <td className="py-4 px-5">nathan.thomas@abcmotors.com.au</td>
                      <td className="py-4 px-5"><div className="flex items-center gap-1.5"><Phone size={12} className="text-slate-400" /> 02 8765 4324</div></td>
                      <td className="py-4 px-5"><div className="flex items-center gap-1.5"><Phone size={12} className="text-slate-400" /> 0433 222 111</div></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-slate-50/50 border-t border-slate-100 p-4 px-5 flex items-center justify-between">
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500">
                  <span className="uppercase tracking-widest text-slate-400">Legend:</span>
                  <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500" /> Yes</span>
                  <span className="flex items-center gap-1 text-slate-400"><X size={12} className="text-red-500" /> No</span>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold">
                  <span className="text-slate-400 uppercase tracking-widest">Preferred Channel:</span>
                  <span className="flex items-center gap-1 text-blue-600 cursor-pointer hover:underline"><Mail size={12} /> Email</span>
                  <span className="flex items-center gap-1 text-blue-400 cursor-pointer hover:underline"><Phone size={12} /> Phone</span>
                  <span className="flex items-center gap-1 text-indigo-500 cursor-pointer hover:underline"><MessageSquare size={12} /> SMS</span>
                  <span className="flex items-center gap-1 text-blue-600 cursor-pointer hover:underline"><span className="bg-blue-100 text-blue-700 px-1 py-0.5 rounded text-[8px] tracking-widest uppercase font-black">App</span> In-App Message</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

              {/* Contact Roles Explained */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm xl:col-span-1">
                <div className="flex items-center gap-2 text-slate-800 mb-5">
                  <Users size={16} className="text-blue-600" />
                  <h3 className="text-sm font-black tracking-tight">Contact Roles Explained</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start border-b border-slate-50 pb-3">
                    <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-[9px] uppercase font-bold tracking-wider w-32 text-center shrink-0">Primary Contact</span>
                    <p className="text-[10px] font-semibold text-slate-500 leading-relaxed">Main point of contact for all communication.</p>
                  </div>
                  <div className="flex gap-4 items-start border-b border-slate-50 pb-3">
                    <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-[9px] uppercase font-bold tracking-wider w-32 text-center shrink-0">Accounts Contact</span>
                    <p className="text-[10px] font-semibold text-slate-500 leading-relaxed">Handles invoicing, payments, and credit queries.</p>
                  </div>
                  <div className="flex gap-4 items-start border-b border-slate-50 pb-3">
                    <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-[9px] uppercase font-bold tracking-wider w-32 text-center shrink-0">Operations Contact</span>
                    <p className="text-[10px] font-semibold text-slate-500 leading-relaxed">Operational queries, bookings and delivery updates.</p>
                  </div>
                  <div className="flex gap-4 items-start border-b border-slate-50 pb-3">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[9px] uppercase font-bold tracking-wider w-32 text-center shrink-0 border border-slate-200">After Hours</span>
                    <p className="text-[10px] font-semibold text-slate-500 leading-relaxed">24/7 contact for urgent issues and breakdowns.</p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <span className="bg-orange-50 text-orange-600 px-2 py-1 rounded text-[9px] uppercase font-bold tracking-wider w-32 text-center shrink-0">Technical Contact</span>
                    <p className="text-[10px] font-semibold text-slate-500 leading-relaxed">Vehicle / technical and workshop related queries.</p>
                  </div>
                </div>
                <div className="mt-5 p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex gap-3">
                  <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] font-bold text-blue-700">Set at least one Primary Contact and one Accounts Contact.</p>
                </div>
              </div>

              {/* Communication Preferences */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm xl:col-span-1 flex flex-col">
                <div className="flex items-center gap-2 text-slate-800 mb-5">
                  <Mail size={16} className="text-blue-600" />
                  <h3 className="text-sm font-black tracking-tight">Communication Preferences</h3>
                </div>
                <div className="space-y-4 flex-grow">
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm"><CheckCircle2 size={12} /></div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1"><Mail size={14} className="text-slate-700" /><span className="text-xs font-bold text-slate-900">Email</span></div>
                      <p className="text-[10px] font-semibold text-slate-500 leading-relaxed">Use for documents, invoices and reports.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm"><CheckCircle2 size={12} /></div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1"><Phone size={14} className="text-slate-700" /><span className="text-xs font-bold text-slate-900">Phone</span></div>
                      <p className="text-[10px] font-semibold text-slate-500 leading-relaxed">Use for urgent updates and confirmations.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm"><CheckCircle2 size={12} /></div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1"><MessageSquare size={14} className="text-slate-700" /><span className="text-xs font-bold text-slate-900">SMS</span></div>
                      <p className="text-[10px] font-semibold text-slate-500 leading-relaxed">Use for short updates and notifications.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm"><CheckCircle2 size={12} /></div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1"><span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[8px] tracking-widest uppercase font-black">App</span><span className="text-xs font-bold text-slate-900">In-App Message</span></div>
                      <p className="text-[10px] font-semibold text-slate-500 leading-relaxed">Use for internal communication and updates.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 p-4 bg-slate-50 border border-slate-100 rounded-xl relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-1 relative z-10">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-indigo-600" />
                      <span className="text-xs font-black text-slate-900">Quiet Hours</span>
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-slate-600 relative z-10 mb-2">9:00 PM - 7:00 AM (Mon - Sun)</p>
                  <p className="text-[9px] font-semibold text-slate-400 relative z-10 mb-3 leading-relaxed">Non-urgent messages will be delivered outside quiet hours.</p>
                  <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 relative z-10 cursor-pointer">
                    <Edit size={12} /> Edit Quiet Hours
                  </button>
                  <div className="absolute right-0 bottom-0 opacity-5 -mb-4 -mr-4 transform rotate-12 transition-transform group-hover:rotate-0"><Clock size={80} /></div>
                </div>
              </div>

              {/* Contact Permissions */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm xl:col-span-1 flex flex-col">
                <div className="flex items-center gap-2 text-slate-800 mb-5">
                  <Lock size={16} className="text-blue-600" />
                  <h3 className="text-sm font-black tracking-tight">Contact Permissions</h3>
                </div>
                <div className="space-y-6 flex-grow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Can receive load notifications</span>
                    <ToggleRight size={28} className="text-blue-600 cursor-pointer" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Can view load documents</span>
                    <ToggleRight size={28} className="text-blue-600 cursor-pointer" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Can approve PODs</span>
                    <ToggleRight size={28} className="text-blue-600 cursor-pointer" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Can receive invoices</span>
                    <ToggleRight size={28} className="text-blue-600 cursor-pointer" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 pr-4">Can view financial information</span>
                    <ToggleLeft size={28} className="text-slate-200 cursor-pointer" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Can create loads</span>
                    <ToggleLeft size={28} className="text-slate-200 cursor-pointer" />
                  </div>
                </div>
                <div className="mt-5 p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex gap-3">
                  <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] font-bold text-blue-700 leading-relaxed">Permissions apply to all contacts. Individual overrides can be set per contact.</p>
                </div>
              </div>

              {/* Quick Actions Sidebar */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm xl:col-span-1 h-fit">
                <h3 className="text-sm font-black text-slate-900 tracking-tight mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-between group cursor-pointer shadow-sm">
                    <div className="flex items-center gap-3">
                      <Plus size={16} className="text-blue-600" />
                      <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700">Add Contact</span>
                    </div>
                    <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <button className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-between group cursor-pointer shadow-sm">
                    <div className="flex items-center gap-3">
                      <Edit size={16} className="text-blue-600" />
                      <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700">Edit Contact Roles</span>
                    </div>
                    <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <button className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-between group cursor-pointer shadow-sm">
                    <div className="flex items-center gap-3">
                      <MessageSquare size={16} className="text-blue-600" />
                      <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700">Set Communication Preferences</span>
                    </div>
                    <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <button className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-between group cursor-pointer shadow-sm">
                    <div className="flex items-center gap-3">
                      <Users size={16} className="text-blue-600" />
                      <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700">Manage Contact Permissions</span>
                    </div>
                    <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <button className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-between group cursor-pointer shadow-sm">
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-blue-600" />
                      <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700">Export Contacts</span>
                    </div>
                    <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeDetailsTab === 'Billing Rules' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
              <p className="text-xs text-slate-500 font-medium">Configure how this customer is billed. These rules are used automatically when creating invoices.</p>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2 cursor-pointer bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors border border-blue-100 shadow-sm">
                <Eye size={14} /> Preview Invoice Example
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              <div className="xl:col-span-3 flex flex-col gap-6">

                {/* Top Row: 2 columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 1. Pricing & Rate Structure */}
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-800 mb-5 pb-4 border-b border-slate-50">
                      <FileText size={18} className="text-blue-600" />
                      <h3 className="text-sm font-black tracking-tight">1. Pricing & Rate Structure</h3>
                    </div>
                    <table className="w-full text-left text-xs mb-4">
                      <thead>
                        <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                          <th className="py-2">DESCRIPTION</th>
                          <th className="py-2 text-right">RATE (EX. GST)</th>
                          <th className="py-2 pl-4">UNIT</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                        <tr>
                          <td className="py-3">Base Rate - Car Carrying</td>
                          <td className="py-3 text-right font-black">$2.20</td>
                          <td className="py-3 pl-4 text-slate-500">Per KM</td>
                        </tr>
                        <tr>
                          <td className="py-3">Per Car Rate</td>
                          <td className="py-3 text-right font-black">$105.00</td>
                          <td className="py-3 pl-4 text-slate-500">Per Car</td>
                        </tr>
                        <tr>
                          <td className="py-3">Loading / Unloading</td>
                          <td className="py-3 text-right font-black">$65.00</td>
                          <td className="py-3 pl-4 text-slate-500">Per Stop</td>
                        </tr>
                        <tr>
                          <td className="py-3">Wait Time</td>
                          <td className="py-3 text-right font-black">$95.00</td>
                          <td className="py-3 pl-4 text-slate-500">Per Hour</td>
                        </tr>
                      </tbody>
                    </table>
                    <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
                      <Plus size={14} /> Add Pricing Rule
                    </button>
                  </div>

                  {/* 2. Fuel Levy & Surcharges */}
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-800 mb-5 pb-4 border-b border-slate-50">
                      <FileText size={18} className="text-blue-600" />
                      <h3 className="text-sm font-black tracking-tight">2. Fuel Levy & Surcharges</h3>
                    </div>
                    <table className="w-full text-left text-xs mb-4">
                      <thead>
                        <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                          <th className="py-2">DESCRIPTION</th>
                          <th className="py-2 text-center">CALCULATION</th>
                          <th className="py-2 text-right">RATE / %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                        <tr>
                          <td className="py-3">Fuel Levy</td>
                          <td className="py-3 text-center text-slate-500">% of Base Rate</td>
                          <td className="py-3 text-right font-black">13.30%</td>
                        </tr>
                        <tr>
                          <td className="py-3">Security Surcharge</td>
                          <td className="py-3 text-center text-slate-500">Flat Rate</td>
                          <td className="py-3 text-right font-black">$45.00</td>
                        </tr>
                        <tr>
                          <td className="py-3">Weekend Surcharge</td>
                          <td className="py-3 text-center text-slate-500">% of Base Rate</td>
                          <td className="py-3 text-right font-black">15.00%</td>
                        </tr>
                        <tr>
                          <td className="py-3">After Hours Surcharge</td>
                          <td className="py-3 text-center text-slate-500">Flat Rate</td>
                          <td className="py-3 text-right font-black">$85.00</td>
                        </tr>
                      </tbody>
                    </table>
                    <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
                      <Plus size={14} /> Add Surcharge
                    </button>
                  </div>
                </div>

                {/* Bottom Row: 3 columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* 3. Payment Terms & Invoicing */}
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col">
                    <div className="flex items-center gap-2 text-slate-800 mb-5 pb-4 border-b border-slate-50">
                      <DollarSign size={18} className="text-blue-600" />
                      <h3 className="text-sm font-black tracking-tight">3. Payment Terms & Invoicing</h3>
                    </div>
                    <div className="space-y-4 flex-grow">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold"><Calendar size={14} /> Payment Terms</div>
                        <div className="text-xs font-black text-slate-900 text-right">30 Days End of<br />Month</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold"><Activity size={14} /> Invoice Frequency</div>
                        <div className="text-xs font-black text-slate-900">Fortnightly</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold"><ChevronRight size={14} /> Invoice Day</div>
                        <div className="text-xs font-black text-slate-900">Monday</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold"><Calculator size={14} /> Rounding</div>
                        <div className="text-xs font-black text-slate-900">Nearest $0.05</div>
                      </div>
                      <div className="flex justify-between items-start border-t border-slate-50 pt-4 mt-2">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold"><Lock size={14} /> Minimum Invoice<br />Amount</div>
                        <div className="text-xs font-black text-slate-900">$150.00</div>
                      </div>
                      <div className="flex justify-between items-center border-t border-slate-50 pt-4 mt-2">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold"><Lock size={14} /> Auto Invoice<br />Generation</div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">ENABLED</span>
                          <ToggleRight size={24} className="text-blue-600" />
                        </div>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer mt-5 border-t border-slate-50 pt-4">
                      <Edit size={12} /> Edit Payment Terms
                    </button>
                  </div>

                  {/* 4. Billing Rules & Conditions */}
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col">
                    <div className="flex items-center gap-2 text-slate-800 mb-5 pb-4 border-b border-slate-50">
                      <Shield size={18} className="text-blue-600" />
                      <h3 className="text-sm font-black tracking-tight">4. Billing Rules & Conditions</h3>
                    </div>
                    <div className="space-y-4 flex-grow">
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 rounded bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 size={12} /></div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Invoice per Load</p>
                          <p className="text-[9px] font-semibold text-slate-500 leading-relaxed mt-0.5">One invoice will be generated for each load.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 rounded border border-slate-300 flex items-center justify-center shrink-0 mt-0.5"></div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Combine Loads</p>
                          <p className="text-[9px] font-semibold text-slate-500 leading-relaxed mt-0.5">Loads within the same period will be combined per invoice.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 rounded bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 size={12} /></div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Include POD</p>
                          <p className="text-[9px] font-semibold text-slate-500 leading-relaxed mt-0.5">POD must be submitted before invoice is generated.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 rounded bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 size={12} /></div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Time Charges</p>
                          <p className="text-[9px] font-semibold text-slate-500 leading-relaxed mt-0.5">Wait time charges apply after 30 minutes.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 rounded bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 size={12} /></div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Tolls & Parking</p>
                          <p className="text-[9px] font-semibold text-slate-500 leading-relaxed mt-0.5">Billed at cost + 10% admin fee.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 rounded bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 size={12} /></div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Damage Recovery</p>
                          <p className="text-[9px] font-semibold text-slate-500 leading-relaxed mt-0.5">Billed at actual cost with supporting documents.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 rounded bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 size={12} /></div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Price Override</p>
                          <p className="text-[9px] font-semibold text-slate-500 leading-relaxed mt-0.5">Dispatch can override rates with approval.</p>
                        </div>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer mt-5 border-t border-slate-50 pt-4">
                      <Edit size={12} /> Edit Conditions
                    </button>
                  </div>

                  {/* 5. Invoicing Contacts */}
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col">
                    <div className="flex items-center gap-2 text-slate-800 mb-5 pb-4 border-b border-slate-50">
                      <Mail size={18} className="text-blue-600" />
                      <h3 className="text-sm font-black tracking-tight">5. Invoicing Contacts</h3>
                    </div>
                    <div className="space-y-6 flex-grow">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Primary Accounts Contact</p>
                        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 font-black flex items-center justify-center border border-emerald-100 shrink-0">MK</div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">Michael King</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">Accounts Manager</p>
                          </div>
                        </div>
                        <div className="mt-3 space-y-1.5 px-1">
                          <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-600"><Mail size={12} className="text-slate-400" /> michael.king@abcmotors.com.au</div>
                          <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-600"><Phone size={12} className="text-slate-400" /> 0412 345 678</div>
                        </div>
                      </div>

                      <div className="border-t border-slate-50 pt-5">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Invoice Delivery Preference</p>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm"><CheckCircle2 size={12} /></div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">Email</p>
                              <p className="text-[9px] font-semibold text-slate-500 leading-relaxed mt-0.5">Send invoices to accounts email</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded border border-slate-300 flex items-center justify-center shrink-0"></div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">Portal</p>
                              <p className="text-[9px] font-semibold text-slate-500 leading-relaxed mt-0.5">Available in customer portal</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded border border-slate-300 flex items-center justify-center shrink-0"></div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">Mail</p>
                              <p className="text-[9px] font-semibold text-slate-500 leading-relaxed mt-0.5">Post invoices to billing address</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 pt-2">
                            <div className="w-4 h-4 rounded bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm"><CheckCircle2 size={12} /></div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">PDF Attachment</p>
                              <p className="text-[9px] font-semibold text-slate-500 leading-relaxed mt-0.5">Attach PDF invoice to email</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer mt-5 border-t border-slate-50 pt-4">
                      <Edit size={12} /> Edit Contacts
                    </button>
                  </div>
                </div>

                {/* Important Notes */}
                <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl flex gap-3 shadow-sm">
                  <Info size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                  <div className="flex-grow">
                    <h4 className="text-xs font-black text-indigo-900 mb-2">Important Notes</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="list-disc list-inside text-[10px] font-semibold text-indigo-800 leading-relaxed space-y-1">
                        <li>These billing rules will be applied automatically when invoicing this customer.</li>
                        <li>Changes to billing rules will only affect new invoices, not existing ones.</li>
                      </ul>
                      <ul className="list-disc list-inside text-[10px] font-semibold text-indigo-800 leading-relaxed space-y-1">
                        <li>Dispatch can override rates at load level if permission is existing ones.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="xl:col-span-1 flex flex-col gap-6">

                {/* Billing Summary */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                  <h3 className="text-sm font-black text-slate-900 tracking-tight mb-5">Billing Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-bold">Pricing Rules</span>
                      <span className="font-black text-slate-900">4 Active</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-bold">Surcharges</span>
                      <span className="font-black text-slate-900">4 Active</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-bold">Payment Terms</span>
                      <span className="font-black text-slate-900">30 Days EOM</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-bold">Invoice Frequency</span>
                      <span className="font-black text-slate-900">Fortnightly</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-bold">Rounding</span>
                      <span className="font-black text-slate-900">Nearest $0.05</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-bold">Minimum Invoice</span>
                      <span className="font-black text-slate-900">$150.00</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-bold">Tax</span>
                      <span className="font-black text-slate-900">GST 10%</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-bold">Currency</span>
                      <span className="font-black text-slate-900">AUD</span>
                    </div>
                    <div className="flex justify-between items-start text-xs border-t border-slate-50 pt-3">
                      <span className="text-slate-500 font-bold">Price<br />Override</span>
                      <span className="font-black text-slate-900 text-right">Allowed (By<br />Dispatch)</span>
                    </div>
                    <div className="flex justify-between items-center text-xs border-t border-slate-50 pt-3">
                      <span className="text-slate-500 font-bold">Auto Invoice</span>
                      <span className="font-black text-slate-900">Enabled</span>
                    </div>
                  </div>
                  <button className="w-full mt-6 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                    <Eye size={14} /> View Invoice Example
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex-grow">
                  <h3 className="text-sm font-black text-slate-900 tracking-tight mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-between group cursor-pointer shadow-sm">
                      <div className="flex items-center gap-3">
                        <Plus size={16} className="text-blue-600" />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700">Add Pricing Rule</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <button className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-between group cursor-pointer shadow-sm">
                      <div className="flex items-center gap-3">
                        <Plus size={16} className="text-blue-600" />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700">Add Surcharge</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <button className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-between group cursor-pointer shadow-sm">
                      <div className="flex items-center gap-3">
                        <Edit size={16} className="text-blue-600" />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700">Edit Payment Terms</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <button className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-between group cursor-pointer shadow-sm">
                      <div className="flex items-center gap-3">
                        <Eye size={16} className="text-blue-600" />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700">Preview Invoice Example</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <button className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-between group cursor-pointer shadow-sm">
                      <div className="flex items-center gap-3">
                        <Download size={16} className="text-blue-600" />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700">Export Billing Rules</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <button className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-between group cursor-pointer shadow-sm">
                      <div className="flex items-center gap-3">
                        <FileText size={16} className="text-blue-600" />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700">Copy Rules to Another Customer</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <button className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-between group cursor-pointer shadow-sm">
                      <div className="flex items-center gap-3">
                        <Activity size={16} className="text-blue-600" />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700">Reset to Default Template</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeDetailsTab === 'Pricing' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
              <p className="text-xs text-slate-500 font-medium">Configure all rates, price lists and chargeable items for {selectedCustomer.name}. Prices are used when creating loads and generating invoices.</p>
              <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2 cursor-pointer bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors border border-blue-100 shadow-sm shrink-0">
                <Eye size={14} /> Preview Pricing Matrix
              </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex flex-wrap gap-5 items-end">
                <div className="flex-grow min-w-[200px]">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">NICHE / BUSINESS TYPE</label>
                  <div className="relative">
                    <select className="appearance-none pl-3 pr-8 py-2.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 bg-white focus:outline-none focus:border-blue-500 cursor-pointer w-full shadow-sm">
                      <option>Car Carrying</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="flex-grow min-w-[300px]">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">PRICING TEMPLATE</label>
                  <div className="relative flex items-center">
                    <select className="appearance-none pl-3 pr-24 py-2.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 bg-white focus:outline-none focus:border-blue-500 cursor-pointer w-full shadow-sm">
                      <option>Standard National Template</option>
                    </select>
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-black tracking-wider flex items-center gap-1">Applied <CheckCircle2 size={10} /></div>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="flex-grow min-w-[200px]">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">EFFECTIVE DATE RANGE</label>
                  <div className="relative">
                    <input type="text" value="01/07/2025 - 30/06/2026" readOnly className="pl-3 pr-8 py-2.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 bg-white focus:outline-none focus:border-blue-500 cursor-pointer w-full shadow-sm" />
                    <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-5">
                <button className="px-5 py-2.5 bg-blue-50 border border-blue-100 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer">
                  <Activity size={14} /> Apply Template
                </button>
                <button className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm">
                  <Upload size={14} /> Import Pricing
                </button>
                <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer">
                  <Plus size={14} /> Add Pricing Rule
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              <div className="xl:col-span-3 flex flex-col gap-6">

                {/* Inner Tabs & Lane Pricing Table */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="flex items-center border-b border-slate-200 overflow-x-auto custom-scrollbar">
                    <button className="px-5 py-4 text-xs font-black text-blue-600 border-b-2 border-blue-600 whitespace-nowrap bg-blue-50/30">Lane Pricing</button>
                    <button className="px-5 py-4 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 whitespace-nowrap transition-colors">Vehicle Type Pricing</button>
                    <button className="px-5 py-4 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 whitespace-nowrap transition-colors">Rate Cards & Charges</button>
                    <button className="px-5 py-4 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 whitespace-nowrap transition-colors">Surcharges</button>
                    <button className="px-5 py-4 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 whitespace-nowrap transition-colors">Accessorial Charges</button>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-center mb-5">
                      <div>
                        <h3 className="text-sm font-black text-slate-900 tracking-tight">Lane Pricing (4)</h3>
                        <p className="text-[10px] text-slate-500 font-bold mt-1">Set rates for common lanes and routes.</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs mb-4">
                        <thead>
                          <tr className="border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                            <th className="py-3 px-4">FROM</th>
                            <th className="py-3 px-4">TO</th>
                            <th className="py-3 px-4">ROUTE TYPE</th>
                            <th className="py-3 px-4 text-right">DISTANCE (KM)</th>
                            <th className="py-3 px-4 text-right">BASE RATE (EX GST)</th>
                            <th className="py-3 px-4 text-right">GST</th>
                            <th className="py-3 px-4 text-right">MIN CHARGE</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                          <tr className="hover:bg-blue-50/50 transition-colors cursor-pointer group bg-blue-50/20">
                            <td className="py-3 px-4 flex items-center gap-2"><MapPin size={12} className="text-purple-500" /> Sydney (NSW)</td>
                            <td className="py-3 px-4"><div className="flex items-center gap-2"><MapPin size={12} className="text-indigo-500" /> Melbourne (VIC)</div></td>
                            <td className="py-3 px-4">Interstate</td>
                            <td className="py-3 px-4 text-right font-medium">877 KM</td>
                            <td className="py-3 px-4 text-right font-black text-slate-900">$450.00</td>
                            <td className="py-3 px-4 text-right text-slate-500">10%</td>
                            <td className="py-3 px-4 text-right font-black text-slate-900">$450.00</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors cursor-pointer">
                            <td className="py-3 px-4 flex items-center gap-2"><MapPin size={12} className="text-purple-500" /> Sydney (NSW)</td>
                            <td className="py-3 px-4"><div className="flex items-center gap-2"><MapPin size={12} className="text-emerald-500" /> Brisbane (QLD)</div></td>
                            <td className="py-3 px-4">Interstate</td>
                            <td className="py-3 px-4 text-right font-medium">925 KM</td>
                            <td className="py-3 px-4 text-right font-black text-slate-900">$620.00</td>
                            <td className="py-3 px-4 text-right text-slate-500">10%</td>
                            <td className="py-3 px-4 text-right font-black text-slate-900">$620.00</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors cursor-pointer">
                            <td className="py-3 px-4 flex items-center gap-2"><MapPin size={12} className="text-indigo-500" /> Melbourne (VIC)</td>
                            <td className="py-3 px-4"><div className="flex items-center gap-2"><MapPin size={12} className="text-orange-500" /> Adelaide (SA)</div></td>
                            <td className="py-3 px-4">Interstate</td>
                            <td className="py-3 px-4 text-right font-medium">726 KM</td>
                            <td className="py-3 px-4 text-right font-black text-slate-900">$480.00</td>
                            <td className="py-3 px-4 text-right text-slate-500">10%</td>
                            <td className="py-3 px-4 text-right font-black text-slate-900">$480.00</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors cursor-pointer">
                            <td className="py-3 px-4 flex items-center gap-2"><MapPin size={12} className="text-purple-500" /> Sydney (NSW)</td>
                            <td className="py-3 px-4"><div className="flex items-center gap-2"><MapPin size={12} className="text-red-500" /> Perth (WA)</div></td>
                            <td className="py-3 px-4">Interstate</td>
                            <td className="py-3 px-4 text-right font-medium">3,931 KM</td>
                            <td className="py-3 px-4 text-right font-black text-slate-900">$1,850.00</td>
                            <td className="py-3 px-4 text-right text-slate-500">10%</td>
                            <td className="py-3 px-4 text-right font-black text-slate-900">$1,850.00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer mt-2">
                      <Plus size={14} /> Add Lane Price
                    </button>
                  </div>
                </div>

                {/* Sub Tables Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Vehicle Type Pricing */}
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col">
                    <div className="flex justify-between items-start mb-5">
                      <div>
                        <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-1.5">Vehicle Type Pricing - Sydney <ChevronRight size={14} className="text-slate-400" /> Melbourne</h3>
                        <p className="text-[10px] text-slate-500 font-bold mt-1">Vehicle type rates override base lane price when applied.</p>
                      </div>
                      <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer bg-blue-50 px-2 py-1.5 rounded shrink-0">
                        <Plus size={12} /> Add Vehicle Type
                      </button>
                    </div>
                    <div className="overflow-x-auto flex-grow">
                      <table className="w-full text-left text-xs mb-4">
                        <thead>
                          <tr className="border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                            <th className="py-2 px-3">VEHICLE TYPE</th>
                            <th className="py-2 px-3 text-right">BASE PRICE (EX GST)</th>
                            <th className="py-2 px-3 text-right">SURCHARGE</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="py-2.5 px-3 flex items-center gap-2"><Car size={14} className="text-slate-400" /> Sedan / Hatchback</td>
                            <td className="py-2.5 px-3 text-right font-black text-slate-900">$450.00</td>
                            <td className="py-2.5 px-3 text-right text-slate-400">-</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="py-2.5 px-3 flex items-center gap-2"><Car size={14} className="text-slate-400" /> SUV</td>
                            <td className="py-2.5 px-3 text-right font-black text-slate-900">$500.00</td>
                            <td className="py-2.5 px-3 text-right text-slate-400">-</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="py-2.5 px-3 flex items-center gap-2"><Car size={14} className="text-slate-400" /> 4WD / Ute</td>
                            <td className="py-2.5 px-3 text-right font-black text-slate-900">$580.00</td>
                            <td className="py-2.5 px-3 text-right text-red-600 font-bold">25%</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="py-2.5 px-3 flex items-center gap-2"><Car size={14} className="text-slate-400" /> Van / People Mover</td>
                            <td className="py-2.5 px-3 text-right font-black text-slate-900">$560.00</td>
                            <td className="py-2.5 px-3 text-right text-red-600 font-bold">20%</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="py-2.5 px-3 flex items-center gap-2"><Car size={14} className="text-slate-400" /> Luxury / Performance</td>
                            <td className="py-2.5 px-3 text-right font-black text-slate-900">$680.00</td>
                            <td className="py-2.5 px-3 text-right text-red-600 font-bold">50%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <button className="text-xs font-bold text-blue-600 hover:text-blue-700 mt-2 text-left cursor-pointer">
                      View All Vehicle Types (15)
                    </button>
                  </div>

                  {/* Rate Cards & Charges */}
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col">
                    <div className="flex justify-between items-start mb-5">
                      <div>
                        <h3 className="text-sm font-black text-slate-900 tracking-tight">Rate Cards & Charges (5)</h3>
                        <p className="text-[10px] text-slate-500 font-bold mt-1">Standard chargeable items and rates.</p>
                      </div>
                      <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer bg-blue-50 px-2 py-1.5 rounded shrink-0">
                        <Plus size={12} /> Add Charge
                      </button>
                    </div>
                    <div className="overflow-x-auto flex-grow">
                      <table className="w-full text-left text-xs mb-4">
                        <thead>
                          <tr className="border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                            <th className="py-2 px-3">CHARGE NAME</th>
                            <th className="py-2 px-3">UNIT</th>
                            <th className="py-2 px-3 text-right">RATE (EX GST)</th>
                            <th className="py-2 px-3 text-right">GST</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="py-2.5 px-3 font-bold text-slate-900">Waiting Time</td>
                            <td className="py-2.5 px-3 text-slate-500">Per 15 Min</td>
                            <td className="py-2.5 px-3 text-right font-black text-slate-900">$25.00</td>
                            <td className="py-2.5 px-3 text-right text-slate-500">10%</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="py-2.5 px-3 font-bold text-slate-900">Loading / Unloading</td>
                            <td className="py-2.5 px-3 text-slate-500">Per Stop</td>
                            <td className="py-2.5 px-3 text-right font-black text-slate-900">$65.00</td>
                            <td className="py-2.5 px-3 text-right text-slate-500">10%</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="py-2.5 px-3 font-bold text-slate-900">Wash / Clean</td>
                            <td className="py-2.5 px-3 text-slate-500">Per Vehicle</td>
                            <td className="py-2.5 px-3 text-right font-black text-slate-900">$80.00</td>
                            <td className="py-2.5 px-3 text-right text-slate-500">10%</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="py-2.5 px-3 font-bold text-slate-900">Re-delivery Fee</td>
                            <td className="py-2.5 px-3 text-slate-500">Per Delivery</td>
                            <td className="py-2.5 px-3 text-right font-black text-slate-900">$95.00</td>
                            <td className="py-2.5 px-3 text-right text-slate-500">10%</td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="py-2.5 px-3 font-bold text-slate-900">Inspection Fee</td>
                            <td className="py-2.5 px-3 text-slate-500">Per Vehicle</td>
                            <td className="py-2.5 px-3 text-right font-black text-slate-900">$35.00</td>
                            <td className="py-2.5 px-3 text-right text-slate-500">10%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <button className="text-xs font-bold text-blue-600 hover:text-blue-700 mt-2 text-left cursor-pointer">
                      View All Rate Cards & Charges (5)
                    </button>
                  </div>
                </div>

                {/* Important Notes */}
                <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-xl flex gap-3 shadow-sm">
                  <Info size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                  <div className="flex-grow">
                    <h4 className="text-xs font-black text-indigo-900 mb-3">Pricing Notes</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <ul className="list-disc list-inside text-[10px] font-semibold text-indigo-800 leading-relaxed space-y-1.5">
                        <li>Prices are exclusive of GST unless stated.</li>
                        <li>Vehicle type pricing overrides lane base price when applied.</li>
                      </ul>
                      <ul className="list-disc list-inside text-[10px] font-semibold text-indigo-800 leading-relaxed space-y-1.5">
                        <li>All prices are validated when creating loads.</li>
                        <li>Dispatch will be warned if no pricing rule exists for a load.</li>
                      </ul>
                      <ul className="list-disc list-inside text-[10px] font-semibold text-indigo-800 leading-relaxed space-y-1.5">
                        <li>Effective dates control which prices are used on the invoice date.</li>
                        <li>Overrides entered during load creation are tracked in Activity.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="xl:col-span-1 flex flex-col gap-6">

                {/* Pricing Summary */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                  <h3 className="text-sm font-black text-slate-900 tracking-tight mb-5">Pricing Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-bold">Lane Prices</span>
                      <span className="font-black text-slate-900">4 Active</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-bold">Vehicle Type Rules</span>
                      <span className="font-black text-slate-900">5 Active</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-bold">Rate Cards / Charges</span>
                      <span className="font-black text-slate-900">5 Active</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-bold">Surcharges</span>
                      <span className="font-black text-slate-900">4 Active</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-bold">Accessorial Charges</span>
                      <span className="font-black text-slate-900">6 Active</span>
                    </div>
                    <div className="flex justify-between items-center text-xs border-t border-slate-50 pt-3 mt-1">
                      <span className="text-slate-500 font-bold">Discounts / Rebates</span>
                      <span className="font-black text-slate-900">2 Active</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-bold">Minimum Charges</span>
                      <span className="font-black text-slate-900">3 Active</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-bold">Pricing Overrides</span>
                      <span className="font-black text-slate-900">1 Active</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] border-t border-slate-50 pt-4 mt-2">
                      <span className="text-slate-400 font-bold">Last Updated</span>
                      <span className="font-bold text-slate-700">08/07/2025 10:24 AM</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400 font-bold">Updated By</span>
                      <span className="font-bold text-slate-900">Sarah Mitchell</span>
                    </div>
                  </div>
                  <button className="w-full mt-6 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                    <Eye size={14} /> View Full Pricing Matrix
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex-grow">
                  <h3 className="text-sm font-black text-slate-900 tracking-tight mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Plus size={14} className="text-blue-600" />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700">Add Lane Price</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <button className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Plus size={14} className="text-blue-600" />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700">Add Vehicle Type Pricing</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <button className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Plus size={14} className="text-blue-600" />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700">Add Rate Card / Charge</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <button className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Plus size={14} className="text-blue-600" />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700">Add Surcharge</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <button className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Plus size={14} className="text-blue-600" />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700">Add Accessorial Charge</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <button className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Plus size={14} className="text-blue-600" />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700">Add Discount / Rebate</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <button className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <FileText size={14} className="text-blue-600" />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700">Copy Prices from Another Customer</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <button className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <FileText size={14} className="text-blue-600" />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700">Pricing History & Audit Log</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <button className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Download size={14} className="text-blue-600" />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700">Export Pricing to Excel</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeDetailsTab === 'Documents' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 text-left">
            {/* Top Row: Categories, Table, Preview */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">

              {/* Column 1: Document Categories */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm xl:col-span-1">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Document Categories</h3>
                <div className="space-y-1.5">
                  {[
                    { name: 'Contracts & Agreements', count: 8 },
                    { name: 'Insurance Documents', count: 4 },
                    { name: 'Compliance Certificates', count: 6 },
                    { name: 'Pricing & Rate Sheets', count: 5 },
                    { name: 'Tax & Financial', count: 3 },
                    { name: 'Licenses & Permits', count: 4 },
                    { name: 'Invoices & Statements', count: 12 },
                    { name: 'Other Documents', count: 3 }
                  ].map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedDocCategory(cat.name)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all ${selectedDocCategory === cat.name
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <FileText size={14} className={selectedDocCategory === cat.name ? 'text-blue-500' : 'text-slate-400'} />
                        <span className="truncate">{cat.name}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${selectedDocCategory === cat.name
                          ? 'bg-blue-200/50 text-blue-700'
                          : 'bg-slate-100 text-slate-500'
                        }`}>
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Storage Info */}
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                    <span>Storage Usage</span>
                  </div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm font-black text-slate-800">2.24 GB</span>
                    <span className="text-[10px] font-bold text-slate-400">of 10 GB used</span>
                    <span className="text-xs font-black text-blue-600">22%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '22%' }}></div>
                  </div>
                  <button
                    onClick={() => alert('Storage management is handled by Super Admin.')}
                    className="text-[10px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider cursor-pointer"
                  >
                    Manage Storage
                  </button>
                </div>
              </div>

              {/* Column 2 & 3: Documents Table */}
              {(() => {
                const currentCategoryKey =
                  selectedDocCategory === 'Contracts & Agreements' ? 'Contracts' :
                    selectedDocCategory === 'Insurance Documents' ? 'Insurance' :
                      selectedDocCategory === 'Compliance Certificates' ? 'Compliance' :
                        selectedDocCategory === 'Pricing & Rate Sheets' ? 'Pricing' :
                          selectedDocCategory === 'Tax & Financial' ? 'Financial' :
                            selectedDocCategory === 'Licenses & Permits' ? 'Licenses' :
                              selectedDocCategory === 'Invoices & Statements' ? 'Invoices' :
                                selectedDocCategory === 'Other Documents' ? 'Other' : null;

                const filteredDocs = initialDocuments.filter(doc => {
                  const matchesCategory = !currentCategoryKey || doc.cat === currentCategoryKey;
                  const matchesSearch = !docSearchQuery || doc.name.toLowerCase().includes(docSearchQuery.toLowerCase());
                  return matchesCategory && matchesSearch;
                });

                return (
                  <div className={`bg-white rounded-2xl border border-slate-100 p-5 shadow-sm transition-all duration-300 ${showDocPreview && activeDocument ? 'xl:col-span-2' : 'xl:col-span-3'
                    }`}>
                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-5 w-full">
                      <h3 className="text-base font-black text-slate-800 tracking-tight shrink-0">
                        Documents ({filteredDocs.length})
                      </h3>

                      {/* Filters Row (Horizontal scrollable flex-nowrap) */}
                      <div className="flex items-center gap-2.5 w-full xl:w-auto overflow-x-auto custom-scrollbar flex-nowrap pb-2 xl:pb-0 scroll-smooth">

                        {/* Search Input */}
                        <div className="relative shrink-0">
                          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search..."
                            value={docSearchQuery}
                            onChange={e => setDocSearchQuery(e.target.value)}
                            className="w-36 pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-500 transition-all bg-white text-slate-700"
                          />
                        </div>

                        {/* Categories select */}
                        <div className="relative shrink-0">
                          <select
                            value={selectedDocCategory}
                            onChange={e => setSelectedDocCategory(e.target.value)}
                            className="appearance-none border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-600 bg-white focus:outline-none cursor-pointer hover:border-slate-300 transition-colors"
                          >
                            <option value="All Documents">Categories</option>
                            <option value="Contracts & Agreements">Contracts</option>
                            <option value="Insurance Documents">Insurance</option>
                            <option value="Compliance Certificates">Compliance</option>
                            <option value="Pricing & Rate Sheets">Pricing</option>
                            <option value="Tax & Financial">Financial</option>
                            <option value="Licenses & Permits">Licenses</option>
                            <option value="Invoices & Statements">Invoices</option>
                            <option value="Other Documents">Other</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>

                        {/* Subcategory select */}
                        <div className="relative shrink-0">
                          <select className="appearance-none border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-600 bg-white focus:outline-none cursor-pointer hover:border-slate-300 transition-colors">
                            <option>Subcategory</option>
                            <option>Agreement</option>
                            <option>SLA</option>
                            <option>Certificate</option>
                            <option>Policy</option>
                            <option>Rate Sheet</option>
                            <option>Template</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>

                        {/* Types select */}
                        <div className="relative shrink-0">
                          <select className="appearance-none border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-600 bg-white focus:outline-none cursor-pointer hover:border-slate-300 transition-colors">
                            <option>Types</option>
                            <option>PDF</option>
                            <option>Word</option>
                            <option>Excel</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>

                        {/* Status select */}
                        <div className="relative shrink-0">
                          <select className="appearance-none border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-600 bg-white focus:outline-none cursor-pointer hover:border-slate-300 transition-colors">
                            <option>Status</option>
                            <option>Active</option>
                            <option>Pending</option>
                            <option>Expired</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>

                        {/* Newest First select */}
                        <div className="relative shrink-0">
                          <select className="appearance-none border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-600 bg-white focus:outline-none cursor-pointer hover:border-slate-300 transition-colors">
                            <option>Newest First</option>
                            <option>Oldest First</option>
                            <option>Name A-Z</option>
                            <option>Name Z-A</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>

                        {/* Upload Document Button */}
                        <button
                          onClick={() => alert('Opening Document Upload modal...')}
                          className="shrink-0 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ml-auto"
                        >
                          <Upload size={13} /> Upload Document
                        </button>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto custom-scrollbar pb-2 w-full">
                      <table className="w-full text-left text-xs whitespace-nowrap min-w-[750px]">
                        <thead>
                          <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white">
                            <th className="py-3.5 px-4">DOCUMENT NAME</th>
                            <th className="py-3.5 px-4">CATEGORY</th>
                            <th className="py-3.5 px-4">TYPE</th>
                            <th className="py-3.5 px-4">UPLOADED BY</th>
                            <th className="py-3.5 px-4">DATE</th>
                            <th className="py-3.5 px-4">STATUS</th>
                            <th className="py-3.5 px-4">ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                          {filteredDocs.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="py-8 text-center text-xs font-semibold text-slate-400">
                                No documents found in this category.
                              </td>
                            </tr>
                          ) : (
                            filteredDocs.map((doc, idx) => (
                              <tr
                                key={idx}
                                onClick={() => {
                                  setActiveDocument(doc);
                                  setShowDocPreview(true);
                                }}
                                className={`hover:bg-slate-50/70 transition-colors group cursor-pointer ${activeDocument?.name === doc.name ? 'bg-indigo-50/30' : ''
                                  }`}
                              >
                                <td className="py-3.5 px-4 flex items-center gap-3">
                                  <div className={`p-1.5 rounded-lg shrink-0 ${doc.name.endsWith('.pdf') ? 'bg-red-50 text-red-500' :
                                      doc.name.endsWith('.docx') ? 'bg-blue-50 text-blue-500' : 'bg-emerald-50 text-emerald-500'
                                    }`}>
                                    <FileText size={16} />
                                  </div>
                                  <div className="truncate max-w-[200px]">
                                    <h4 className={`font-bold transition-colors truncate ${activeDocument?.name === doc.name
                                        ? 'text-indigo-600 font-extrabold'
                                        : 'text-slate-800 group-hover:text-indigo-600'
                                      }`}>{doc.name}</h4>
                                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{doc.size} &bull; {doc.ver}</p>
                                  </div>
                                </td>
                                <td className="py-3.5 px-4 text-indigo-600 text-[11px] font-bold">{doc.cat}</td>
                                <td className="py-3.5 px-4 text-slate-500 text-[11px] font-bold">{doc.type}</td>
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[9px] border border-white shadow-xs shrink-0">
                                      {doc.userInitials}
                                    </div>
                                    <span className="text-xs font-semibold text-slate-700">{doc.userName}</span>
                                  </div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="text-xs text-slate-800 font-bold">{doc.date}</div>
                                  <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{doc.time}</div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${doc.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                    }`}>
                                    {doc.status}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveDocument(doc);
                                        setShowDocPreview(true);
                                      }}
                                      className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                                      title="Preview"
                                    >
                                      <Eye size={13} />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        alert(`Downloading ${doc.name}...`);
                                      }}
                                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                                      title="Download"
                                    >
                                      <Download size={13} />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        alert(`More actions for ${doc.name}`);
                                      }}
                                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                                    >
                                      <MoreVertical size={13} />
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
                    <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-50">
                      <span className="text-[10px] font-bold text-slate-400">Showing {filteredDocs.length} of {filteredDocs.length} documents</span>
                      <div className="flex items-center gap-1">
                        <button className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded text-slate-400 cursor-pointer shadow-xs"><ChevronLeft size={12} /></button>
                        <button className="w-6 h-6 flex items-center justify-center bg-blue-600 border border-blue-600 rounded text-white font-bold text-xs cursor-pointer shadow-xs">1</button>
                        <button className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded text-slate-400 cursor-pointer shadow-xs"><ChevronRight size={12} /></button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Column 4: Document Preview */}
              {showDocPreview && activeDocument && (
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm xl:col-span-1 flex flex-col relative transition-all duration-300">
                  <button
                    onClick={() => setShowDocPreview(false)}
                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Document Preview</h3>

                  {/* File Title Details */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2.5 rounded-xl shrink-0 ${activeDocument.name.endsWith('.pdf') ? 'bg-red-50 text-red-500' :
                        activeDocument.name.endsWith('.docx') ? 'bg-blue-50 text-blue-500' : 'bg-emerald-50 text-emerald-500'
                      }`}>
                      <FileText size={22} />
                    </div>
                    <div className="truncate">
                      <h4 className="text-xs font-black text-slate-800 truncate">{activeDocument.name}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">{activeDocument.size} &bull; {activeDocument.name.split('.').pop().toUpperCase()} Document</p>
                    </div>
                  </div>

                  {/* Info Selector */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Version</span>
                      <select className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-700 bg-slate-50/50 cursor-pointer focus:outline-none">
                        <option>{activeDocument.ver} (Current)</option>
                      </select>
                    </div>
                    <div>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Status</span>
                      <span className="inline-block bg-emerald-50 text-emerald-600 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">Active</span>
                    </div>
                  </div>

                  {/* PDF Page CSS Preview */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-between aspect-[3/4] shadow-inner mb-5 relative overflow-hidden select-none">
                    {/* Hero Logo watermark */}
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-600 rounded-sm flex items-center justify-center text-white text-[8px] font-black">H</div>
                        <span className="text-[8px] font-black text-slate-800 tracking-wider">Hero LS</span>
                      </div>
                      <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider">Page 1 of 12</span>
                    </div>

                    {/* Fake document contents */}
                    <div className="flex-grow flex flex-col justify-center items-center py-6 text-center">
                      <h5 className="text-[11px] font-black text-slate-800 tracking-wide uppercase leading-tight mb-2">
                        {activeDocument.name.split('.')[0].replace(/_/g, ' ')}
                      </h5>
                      <div className="w-10 h-0.5 bg-blue-600 mb-4"></div>
                      <p className="text-[8px] text-slate-400 font-bold mb-1">Between</p>
                      <p className="text-[9px] text-slate-900 font-black mb-1">{selectedCustomer.name}</p>
                      <p className="text-[8px] text-slate-400 font-bold mb-1">and</p>
                      <p className="text-[9px] text-slate-900 font-black mb-4">Hero Logistics Pty Ltd</p>
                      <p className="text-[8px] text-slate-500 font-semibold leading-relaxed max-w-[150px] mx-auto italic border-t border-b border-slate-200/60 py-2">
                        "This document outlines the standard delivery metrics, liabilities, and service level targets..."
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 flex justify-between items-center text-[7px] text-slate-400 font-bold uppercase tracking-wider">
                      <span>Effective: 01 Jul 2025</span>
                      <span>Ref: {activeDocument.name.split('.')[0].substring(0, 3).toUpperCase()}-2025-01</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 mt-auto">
                    <button
                      onClick={() => alert(`Downloading ${activeDocument.name}...`)}
                      className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      <Download size={14} /> Download
                    </button>
                    <button
                      onClick={() => alert(`Link copied to clipboard to share ${activeDocument.name}`)}
                      className="w-full flex items-center justify-center gap-2 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      <ExternalLink size={14} /> Share Document
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* AI Document Reminders (BETA) */}
            <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0 border border-blue-100/50 shadow-xs"><Info size={20} /></div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-xs font-black text-slate-800">AI Document Reminders</h4>
                    <span className="bg-blue-100 text-blue-700 text-[8px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase">BETA</span>
                  </div>
                  <p className="text-[10px] font-semibold text-slate-500 leading-normal">
                    AI automatically detects document expiration dates from PDF uploads and triggers alerts before they expire.
                  </p>
                </div>
              </div>

              {/* Status Pills */}
              <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 shrink-0 w-full lg:w-auto">
                <div className="flex items-center gap-2 bg-white border border-slate-100 px-2.5 py-1.5 rounded-xl shadow-xs shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                  <span className="text-[10px] font-bold text-slate-600">Expiring in 30 Days</span>
                  <span className="bg-red-50 text-red-600 text-[10px] font-black px-1.5 py-0.5 rounded-md">2</span>
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-100 px-2.5 py-1.5 rounded-xl shadow-xs shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                  <span className="text-[10px] font-bold text-slate-600">Expiring in 60 Days</span>
                  <span className="bg-amber-50 text-amber-600 text-[10px] font-black px-1.5 py-0.5 rounded-md">3</span>
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-100 px-2.5 py-1.5 rounded-xl shadow-xs shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                  <span className="text-[10px] font-bold text-slate-600">Expired</span>
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-1.5 py-0.5 rounded-md">0</span>
                </div>

                <button className="px-3 py-1.5 border border-blue-200 hover:border-blue-300 hover:bg-blue-50/50 text-blue-600 text-[9px] lg:text-[10px] font-black rounded-xl uppercase tracking-wider transition-all cursor-pointer shrink-0">
                  Manage Reminder Settings
                </button>
              </div>
            </div>

            {/* 3 Bottom Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Card 1: Upload New Document */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-black text-slate-900 tracking-tight mb-4">Upload New Document</h3>
                  <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/10 rounded-2xl p-6 text-center flex flex-col justify-center items-center transition-all cursor-pointer group min-h-[140px]">
                    <div className="p-3 bg-white border border-slate-100 rounded-full text-slate-400 group-hover:text-blue-500 group-hover:border-blue-100 transition-all shadow-xs mb-3">
                      <Upload size={20} />
                    </div>
                    <p className="text-xs font-black text-slate-800 mb-0.5 group-hover:text-blue-600 transition-colors">Drag and drop files here</p>
                    <p className="text-[10px] font-bold text-slate-400 mb-1">or <span className="text-blue-600">click to browse</span></p>
                    <p className="text-[8px] font-bold text-slate-400 max-w-[180px] leading-normal mt-1">
                      Max file size 25MB | PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
                    </p>
                  </div>
                </div>
                <button className="mt-4 text-[10px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider text-left flex items-center gap-1.5 cursor-pointer">
                  <Plus size={12} /> Upload Folder
                </button>
              </div>

              {/* Card 2: Document Expiry Alerts */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-black text-slate-900 tracking-tight">Document Expiry Alerts</h3>
                    <AlertCircle size={14} className="text-slate-400" />
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { name: 'Insurance Certificate 2025', desc: 'Expires in 14 days', date: '15/07/2026', type: 'danger' },
                      { name: 'Public Liability Insurance', desc: 'Expires in 32 days', date: '02/08/2026', type: 'warning' },
                      { name: 'Dangerous Goods Approval', desc: 'Expires in 45 days', date: '15/08/2026', type: 'warning' },
                      { name: 'Service Level Agreement', desc: 'Valid for 11 months', date: '15/06/2027', type: 'success' }
                    ].map((alert, idx) => (
                      <div key={idx} className="flex justify-between items-start p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl">
                        <div>
                          <h4 className="text-[10px] font-black text-slate-800 truncate max-w-[130px]">{alert.name}</h4>
                          <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">{alert.date}</span>
                        </div>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${alert.type === 'danger' ? 'bg-red-50 text-red-600' :
                            alert.type === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                          }`}>
                          {alert.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="mt-4 text-[10px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider text-left flex items-center gap-1.5 cursor-pointer">
                  View All Alerts (5) &rarr;
                </button>
              </div>

              {/* Card 3: Recent Activity */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-black text-slate-900 tracking-tight mb-4">Recent Activity</h3>

                  <div className="space-y-3.5">
                    {[
                      { user: 'Sarah Mitchell', initials: 'SM', action: 'uploaded', file: 'Master Service Agreement.pdf', time: '01/07/2026 10:24 AM' },
                      { user: 'John Davis', initials: 'JD', action: 'updated', file: 'Insurance Certificate 2025.pdf', time: '29/06/2026 09:12 AM' },
                      { user: 'Sarah Mitchell', initials: 'SM', action: 'uploaded', file: 'Pricing Matrix 2025.xlsx', time: '20/05/2026 11:30 AM' }
                    ].map((act, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-black text-[9px] border border-white shadow-xs shrink-0 mt-0.5">
                          {act.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold text-slate-600 leading-snug">
                            <span className="font-black text-slate-800">{act.user}</span> {act.action}{' '}
                            <span className="font-bold text-blue-600 hover:underline cursor-pointer break-all">{act.file}</span>
                          </p>
                          <span className="text-[8px] font-bold text-slate-400 block mt-0.5">{act.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="mt-4 text-[10px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider text-left flex items-center gap-1.5 cursor-pointer">
                  View Full Activity Log &rarr;
                </button>
              </div>

            </div>

            {/* Quick Actions Footer */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <h3 className="text-xs font-black text-slate-900 tracking-tight mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {[
                  { name: 'Request Document from Customer', action: 'Request' },
                  { name: 'Set Expiry Reminder', action: 'Reminder' },
                  { name: 'Create Document Template', action: 'Template' },
                  { name: 'Share Document Link', action: 'Link' }
                ].map((act, idx) => (
                  <button key={idx} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all group cursor-pointer text-left w-full">
                    <div className="flex items-center gap-3 truncate">
                      <div className="p-2 bg-slate-50 text-slate-500 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
                        {act.action === 'Request' && <Users size={14} />}
                        {act.action === 'Reminder' && <Clock size={14} />}
                        {act.action === 'Template' && <FileText size={14} />}
                        {act.action === 'Link' && <ExternalLink size={14} />}
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 truncate group-hover:text-slate-900">{act.name}</span>
                    </div>
                    <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors shrink-0 ml-1" />
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {activeDetailsTab === 'Activity' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 text-left">
            {/* Activity Filters Row */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                  {/* Date Picker Button */}
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors shrink-0">
                    <Calendar size={14} className="text-slate-400" />
                    <span>01/06/2025 &mdash; 05/07/2025</span>
                  </div>

                  {/* Dropdowns */}
                  <select className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 cursor-pointer focus:outline-none hover:bg-slate-100 transition-colors shrink-0">
                    <option>All Activity Types</option>
                    <option>Loads</option>
                    <option>Invoices</option>
                    <option>Payments</option>
                    <option>Messages</option>
                    <option>Documents</option>
                  </select>

                  <select className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 cursor-pointer focus:outline-none hover:bg-slate-100 transition-colors shrink-0">
                    <option>All Users</option>
                    <option>Sarah Mitchell</option>
                    <option>John Davis</option>
                    <option>Michael King</option>
                  </select>

                  <select className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 cursor-pointer focus:outline-none hover:bg-slate-100 transition-colors shrink-0">
                    <option>All Modules</option>
                    <option>Dispatch</option>
                    <option>Accounts</option>
                    <option>Support</option>
                  </select>
                </div>

                <div className="flex items-center gap-2.5 w-full lg:w-auto">
                  {/* Search input */}
                  <div className="relative flex-grow lg:flex-grow-0">
                    <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search activity..."
                      className="w-full lg:w-48 pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 placeholder-slate-400 bg-slate-50/50 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                    />
                  </div>

                  <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs shrink-0">
                    <Filter size={14} /> Filters
                  </button>

                  <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs shrink-0">
                    <Download size={14} /> Export
                  </button>
                </div>
              </div>

              {/* Sub-tabs Row */}
              <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar flex-nowrap mt-5 border-t border-slate-50 pt-4">
                {[
                  { name: 'All Activity', count: 234, active: true },
                  { name: 'Loads', count: 18 },
                  { name: 'Invoices & Payments', count: 26 },
                  { name: 'Messages', count: 12 },
                  { name: 'Documents', count: 38 },
                  { name: 'Pricing', count: 8 },
                  { name: 'Billing Rules', count: 6 },
                  { name: 'AI Reminders', count: 14 },
                  { name: 'Audit Log', count: 131 }
                ].map((subTab, idx) => (
                  <button
                    key={idx}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black transition-all shrink-0 cursor-pointer ${subTab.active
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-slate-500 hover:bg-slate-50'
                      }`}
                  >
                    <span>{subTab.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${subTab.active ? 'bg-blue-200/50 text-blue-700' : 'bg-slate-100 text-slate-500'
                      }`}>{subTab.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Left Column: Timeline */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-55 pb-4 border-b border-slate-50">
                  <h3 className="text-sm font-black text-slate-900 tracking-tight">Activity Timeline</h3>
                  <div className="flex items-center gap-3">
                    <select className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[10px] font-bold text-slate-600 cursor-pointer focus:outline-none">
                      <option>Show: 25 per page</option>
                      <option>Show: 50 per page</option>
                      <option>Show: 100 per page</option>
                    </select>

                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                      <button className="px-2 py-1 bg-blue-50 text-blue-600 border-r border-slate-200 text-[10px] font-black cursor-pointer">Timeline View</button>
                      <button className="px-2 py-1 bg-white text-slate-500 hover:bg-slate-50 text-[10px] font-black cursor-pointer">Table View</button>
                    </div>
                  </div>
                </div>

                {/* Timeline Items */}
                <div className="relative pl-6 border-l border-slate-100 ml-4 space-y-6">
                  {/* Timeline Node 1 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-red-500 border border-white ring-4 ring-red-50/50"></div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start bg-slate-50/40 hover:bg-slate-50/80 border border-slate-100/60 rounded-xl p-4 transition-colors">
                      <div className="space-y-1.5 min-w-0 flex-grow">
                        <div className="flex items-center flex-wrap gap-2">
                          <span className="text-[9px] text-slate-400 font-bold">08 Jul 2025, 10:24 AM</span>
                          <span className="bg-red-50 text-red-600 text-[8px] font-black px-1.5 py-0.5 rounded tracking-wide uppercase">AI ALERT</span>
                        </div>
                        <h4 className="text-xs font-black text-slate-800">Document Expired</h4>
                        <p className="text-xs font-semibold text-slate-500">Insurance Certificate 2025.pdf has expired.</p>
                        <div className="flex items-center gap-2 pt-1">
                          <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[8px] border border-white shadow-xs shrink-0">AI</div>
                          <span className="text-[10px] text-slate-500 font-bold">System (AI)</span>
                        </div>
                      </div>
                      <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider shrink-0 cursor-pointer self-end sm:self-center">View Alert</button>
                    </div>
                  </div>

                  {/* Timeline Node 2 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white ring-4 ring-emerald-50/50"></div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start bg-slate-50/40 hover:bg-slate-50/80 border border-slate-100/60 rounded-xl p-4 transition-colors">
                      <div className="space-y-1.5 min-w-0 flex-grow">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-slate-400 font-bold">08 Jul 2025, 08:15 AM</span>
                          <span className="text-xs font-black text-emerald-600">$15,750.00</span>
                        </div>
                        <h4 className="text-xs font-black text-slate-800">Payment Received</h4>
                        <p className="text-xs font-semibold text-slate-500">Payment of $15,750.00 received for INV-12496 via Direct Transfer.</p>
                        <div className="flex items-center gap-2 pt-1">
                          <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[8px] border border-white shadow-xs shrink-0">JD</div>
                          <span className="text-[10px] text-slate-500 font-bold">John Davis <span className="text-slate-400 font-medium">Accounts</span></span>
                        </div>
                      </div>
                      <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider shrink-0 cursor-pointer self-end sm:self-center">View Payment</button>
                    </div>
                  </div>

                  {/* Timeline Node 3 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 border border-white ring-4 ring-blue-50/50"></div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start bg-slate-50/40 hover:bg-slate-50/80 border border-slate-100/60 rounded-xl p-4 transition-colors">
                      <div className="space-y-1.5 min-w-0 flex-grow">
                        <span className="text-[9px] text-slate-400 font-bold block mb-1">07 Jul 2025, 04:32 PM</span>
                        <h4 className="text-xs font-black text-slate-800">Load Completed</h4>
                        <p className="text-xs font-semibold text-slate-500">Load LD-1087 completed by Driver #D-021 (Michael King).</p>
                        <div className="flex items-center gap-2 pt-1">
                          <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[8px] border border-white shadow-xs shrink-0">MK</div>
                          <span className="text-[10px] text-slate-500 font-bold">Michael King <span className="text-slate-400 font-medium">Driver</span></span>
                        </div>
                      </div>
                      <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider shrink-0 cursor-pointer self-end sm:self-center">View Load</button>
                    </div>
                  </div>

                  {/* Timeline Node 4 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-purple-500 border border-white ring-4 ring-purple-50/50"></div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start bg-slate-50/40 hover:bg-slate-50/80 border border-slate-100/60 rounded-xl p-4 transition-colors">
                      <div className="space-y-1.5 min-w-0 flex-grow">
                        <span className="text-[9px] text-slate-400 font-bold block mb-1">07 Jul 2025, 02:18 PM</span>
                        <h4 className="text-xs font-black text-slate-800">Message Sent</h4>
                        <p className="text-xs font-semibold text-slate-500">Re: Delivery delay for LD-1086 - Updated ETA shared.</p>
                        <div className="flex items-center gap-2 pt-1">
                          <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[8px] border border-white shadow-xs shrink-0">SM</div>
                          <span className="text-[10px] text-slate-500 font-bold">Sarah Mitchell <span className="text-slate-400 font-medium">Dispatch</span></span>
                        </div>
                      </div>
                      <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider shrink-0 cursor-pointer self-end sm:self-center">View Message</button>
                    </div>
                  </div>

                  {/* Timeline Node 5 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 border border-white ring-4 ring-amber-50/50"></div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start bg-slate-50/40 hover:bg-slate-50/80 border border-slate-100/60 rounded-xl p-4 transition-colors">
                      <div className="space-y-1.5 min-w-0 flex-grow">
                        <span className="text-[9px] text-slate-400 font-bold block mb-1">07 Jul 2025, 11:05 AM</span>
                        <h4 className="text-xs font-black text-slate-800">Pricing Rule Updated</h4>
                        <p className="text-xs font-semibold text-slate-500">Lane Price: Sydney (NSW) &rarr; Melbourne (VIC) updated.</p>
                        <div className="flex items-center gap-2 pt-1">
                          <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[8px] border border-white shadow-xs shrink-0">SM</div>
                          <span className="text-[10px] text-slate-500 font-bold">Sarah Mitchell <span className="text-slate-400 font-medium">Admin</span></span>
                        </div>
                      </div>
                      <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider shrink-0 cursor-pointer self-end sm:self-center">View Change</button>
                    </div>
                  </div>

                  {/* Timeline Node 6 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white ring-4 ring-emerald-50/50"></div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start bg-slate-50/40 hover:bg-slate-50/80 border border-slate-100/60 rounded-xl p-4 transition-colors">
                      <div className="space-y-1.5 min-w-0 flex-grow">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-slate-400 font-bold">06 Jul 2025, 03:45 PM</span>
                          <span className="text-xs font-black text-slate-800">$32,450.00</span>
                        </div>
                        <h4 className="text-xs font-black text-slate-800">Invoice Created</h4>
                        <p className="text-xs font-semibold text-slate-500">Invoice INV-12450 created for Load LD-1083.</p>
                        <div className="flex items-center gap-2 pt-1">
                          <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[8px] border border-white shadow-xs shrink-0">JD</div>
                          <span className="text-[10px] text-slate-500 font-bold">John Davis <span className="text-slate-400 font-medium">Accounts</span></span>
                        </div>
                      </div>
                      <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider shrink-0 cursor-pointer self-end sm:self-center">View Invoice</button>
                    </div>
                  </div>

                  {/* Timeline Node 7 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 border border-white ring-4 ring-indigo-50/50"></div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start bg-slate-50/40 hover:bg-slate-50/80 border border-slate-100/60 rounded-xl p-4 transition-colors">
                      <div className="space-y-1.5 min-w-0 flex-grow">
                        <span className="text-[9px] text-slate-400 font-bold block mb-1">05 Jul 2025, 01:22 PM</span>
                        <h4 className="text-xs font-black text-slate-800">Document Uploaded</h4>
                        <p className="text-xs font-semibold text-slate-500">Public Liability Insurance.pdf uploaded.</p>
                        <div className="flex items-center gap-2 pt-1">
                          <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[8px] border border-white shadow-xs shrink-0">SM</div>
                          <span className="text-[10px] text-slate-500 font-bold">Sarah Mitchell <span className="text-slate-400 font-medium">Admin</span></span>
                        </div>
                      </div>
                      <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider shrink-0 cursor-pointer self-end sm:self-center">View Document</button>
                    </div>
                  </div>

                  {/* Timeline Node 8 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-400 border border-white ring-4 ring-slate-100"></div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start bg-slate-50/40 hover:bg-slate-50/80 border border-slate-100/60 rounded-xl p-4 transition-colors">
                      <div className="space-y-1.5 min-w-0 flex-grow">
                        <span className="text-[9px] text-slate-400 font-bold block mb-1">03 Jul 2025, 09:00 AM</span>
                        <h4 className="text-xs font-black text-slate-800">Support Ticket Updated</h4>
                        <p className="text-xs font-semibold text-slate-500">Ticket #TKT-152 updated: Proof of Delivery not attached.</p>
                        <div className="flex items-center gap-2 pt-1">
                          <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[8px] border border-white shadow-xs shrink-0">PS</div>
                          <span className="text-[10px] text-slate-500 font-bold">Priya Sharma <span className="text-slate-400 font-medium">Support</span></span>
                        </div>
                      </div>
                      <button className="text-[10px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider shrink-0 cursor-pointer self-end sm:self-center">View Ticket</button>
                    </div>
                  </div>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-6 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-400">Showing 1 to 8 of 234 activities</span>
                  <div className="flex items-center gap-1.5">
                    <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 cursor-pointer shadow-xs"><ChevronLeft size={14} /></button>
                    <button className="w-8 h-8 flex items-center justify-center bg-blue-600 border border-blue-600 rounded-xl text-white font-black text-xs cursor-pointer shadow-md">1</button>
                    <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold text-xs cursor-pointer shadow-xs">2</button>
                    <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold text-xs cursor-pointer shadow-xs">3</button>
                    <span className="text-slate-400 text-xs font-bold px-1">...</span>
                    <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold text-xs cursor-pointer shadow-xs">10</button>
                    <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50 cursor-pointer shadow-xs"><ChevronRight size={14} /></button>
                  </div>
                </div>
              </div>

              {/* Right Column: Widgets */}
              <div className="space-y-6">
                {/* Widget 1: Activity Summary */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                  <h3 className="text-xs font-black text-slate-900 tracking-tight mb-4">Activity Summary (This Period)</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Summary Card 1 */}
                    <div className="p-3 bg-blue-50/30 border border-blue-50/50 rounded-2xl flex flex-col justify-between aspect-square">
                      <div className="p-2 bg-blue-50 border border-blue-100 text-blue-600 rounded-xl w-fit">
                        <Truck size={16} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Loads</span>
                        <span className="text-xl font-black text-slate-800 block mb-2">18</span>
                        <a href="#" className="text-[9px] font-black text-blue-600 hover:underline">View All</a>
                      </div>
                    </div>

                    {/* Summary Card 2 */}
                    <div className="p-3 bg-purple-50/30 border border-purple-50/50 rounded-2xl flex flex-col justify-between aspect-square">
                      <div className="p-2 bg-purple-50 border border-purple-100 text-purple-600 rounded-xl w-fit">
                        <FileText size={16} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Invoices</span>
                        <span className="text-xl font-black text-slate-800 block mb-2">26</span>
                        <a href="#" className="text-[9px] font-black text-purple-600 hover:underline">View All</a>
                      </div>
                    </div>

                    {/* Summary Card 3 */}
                    <div className="p-3 bg-emerald-50/30 border border-emerald-50/50 rounded-2xl flex flex-col justify-between aspect-square">
                      <div className="p-2 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl w-fit">
                        <DollarSign size={16} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Payments</span>
                        <span className="text-xl font-black text-slate-800 block mb-2">12</span>
                        <a href="#" className="text-[9px] font-black text-emerald-600 hover:underline">View All</a>
                      </div>
                    </div>

                    {/* Summary Card 4 */}
                    <div className="p-3 bg-indigo-50/30 border border-indigo-50/50 rounded-2xl flex flex-col justify-between aspect-square">
                      <div className="p-2 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl w-fit">
                        <FileText size={16} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Documents</span>
                        <span className="text-xl font-black text-slate-800 block mb-2">38</span>
                        <a href="#" className="text-[9px] font-black text-indigo-600 hover:underline">View All</a>
                      </div>
                    </div>

                    {/* Summary Card 5 */}
                    <div className="p-3 bg-purple-50/30 border border-purple-50/50 rounded-2xl flex flex-col justify-between aspect-square">
                      <div className="p-2 bg-purple-50 border border-purple-100 text-purple-600 rounded-xl w-fit">
                        <MessageSquare size={16} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Messages</span>
                        <span className="text-xl font-black text-slate-800 block mb-2">12</span>
                        <a href="#" className="text-[9px] font-black text-purple-600 hover:underline">View All</a>
                      </div>
                    </div>

                    {/* Summary Card 6 */}
                    <div className="p-3 bg-red-50/30 border border-red-50/50 rounded-2xl flex flex-col justify-between aspect-square">
                      <div className="p-2 bg-red-50 border border-red-100 text-red-600 rounded-xl w-fit">
                        <AlertCircle size={16} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">AI Alerts</span>
                        <span className="text-xl font-black text-red-600 block mb-2">14</span>
                        <a href="#" className="text-[9px] font-black text-red-600 hover:underline">View All</a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Widget 2: Top Active Users */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                  <h3 className="text-xs font-black text-slate-900 tracking-tight mb-4">Top Active Users</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs border border-white shadow-xs">SM</div>
                        <div>
                          <h4 className="text-xs font-black text-slate-800">Sarah Mitchell</h4>
                          <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider block">Admin / Dispatch</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-800">88 actions</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs border border-white shadow-xs">JD</div>
                        <div>
                          <h4 className="text-xs font-black text-slate-800">John Davis</h4>
                          <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider block">Accounts</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-800">54 actions</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs border border-white shadow-xs">MK</div>
                        <div>
                          <h4 className="text-xs font-black text-slate-800">Michael King</h4>
                          <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider block">Driver</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-800">32 actions</span>
                    </div>
                  </div>
                  <button className="mt-4 w-full text-center text-[10px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest block pt-3 border-t border-slate-50 cursor-pointer">View All Users &rarr;</button>
                </div>

                {/* Widget 3: Quick Actions */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                  <h3 className="text-xs font-black text-slate-900 tracking-tight mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'Request Document from Customer', icon: Users },
                      { label: 'Set Expiry Reminder', icon: Clock },
                      { label: 'Create Document Template', icon: FileText }
                    ].map((act, idx) => {
                      const Icon = act.icon;
                      return (
                        <button key={idx} className="w-full flex items-center justify-between p-3 border border-slate-100 hover:border-blue-300 hover:bg-blue-50/10 rounded-xl text-left transition-all cursor-pointer group shadow-xs">
                          <div className="flex items-center gap-2.5 truncate">
                            <div className="p-1.5 bg-slate-50 text-slate-500 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
                              <Icon size={12} />
                            </div>
                            <span className="text-[11px] font-bold text-slate-700 group-hover:text-slate-900 truncate">{act.label}</span>
                          </div>
                          <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Dashboard: AI AR & Payment Reminders */}
            <div className="bg-white rounded-[20px] border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-sm font-black text-slate-900 tracking-tight">AI Accounts Receivable &amp; Payment Reminders</h3>
                <span className="bg-blue-100 text-blue-700 text-[8px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase">BETA</span>
              </div>

              {/* Summary Cards Row */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Overdue Invoices</span>
                  <span className="text-sm font-black text-red-600 block mb-0.5">$32,450.00</span>
                  <span className="text-[9px] font-bold text-slate-400 block">5 Invoices</span>
                </div>
                <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Due This Week</span>
                  <span className="text-sm font-black text-amber-500 block mb-0.5">$7,850.00</span>
                  <span className="text-[9px] font-bold text-slate-400 block">2 Invoices</span>
                </div>
                <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Due Next 7 Days</span>
                  <span className="text-sm font-black text-blue-500 block mb-0.5">$14,600.00</span>
                  <span className="text-[9px] font-bold text-slate-400 block">3 Invoices</span>
                </div>
                <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl flex flex-col justify-between">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Average Days to Pay</span>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-indigo-600" />
                    <span className="text-sm font-black text-slate-800">28 Days</span>
                  </div>
                </div>
                <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl flex flex-col justify-between">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Predicted Late Payers</span>
                  <div className="flex items-center gap-1.5">
                    <Users size={14} className="text-emerald-600" />
                    <span className="text-sm font-black text-slate-800">3 Customers</span>
                  </div>
                </div>
              </div>

              {/* 4-Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Col 1: Next Reminder Schedule */}
                <div>
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Next Reminder Schedule</h4>
                  <div className="space-y-3">
                    {[
                      { name: '3 Days Before Due', desc: 'Email reminder will be sent', count: 2, active: true },
                      { name: 'Due Date', desc: 'Email + SMS reminder', count: 2, active: true },
                      { name: '7 Days Overdue', desc: 'Follow-up email + dashboard alert', count: 1, type: 'warning' },
                      { name: '14 Days Overdue', desc: 'Escalate + create follow-up task', count: 1, type: 'danger' },
                      { name: '30 Days Overdue', desc: 'Escalate to management', count: 0 }
                    ].map((sched, idx) => (
                      <div key={idx} className="flex gap-2 items-start text-xs font-semibold text-slate-700">
                        <div className="flex flex-col items-center shrink-0 mt-1">
                          <div className={`w-2 h-2 rounded-full border-2 bg-white ${sched.type === 'danger' ? 'border-red-500' :
                              sched.type === 'warning' ? 'border-amber-500' : 'border-indigo-500'
                            }`}></div>
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-baseline mb-0.5">
                            <span className="font-bold text-slate-800 truncate">{sched.name}</span>
                            {sched.count > 0 && (
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-black shrink-0 ${sched.type === 'danger' ? 'bg-red-50 text-red-600' :
                                  sched.type === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                                }`}>{sched.count}</span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 block leading-normal">{sched.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Col 2: Draft Reminder Preview */}
                <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="p-1 bg-indigo-50 text-indigo-600 rounded-md shrink-0"><Info size={11} /></div>
                      <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider">AI Draft Reminder Preview</h4>
                    </div>
                    <div className="space-y-1.5 text-[10px] font-semibold text-slate-600 leading-relaxed bg-white border border-slate-100 rounded-xl p-3 shadow-xs">
                      <div><span className="text-slate-400 font-bold uppercase tracking-wider">To:</span> accounts@abcmotors.com.au</div>
                      <div><span className="text-slate-400 font-bold uppercase tracking-wider">Cc:</span> sarah.m@herologistics.com</div>
                      <div className="border-b border-slate-50 pb-1.5"><span className="text-slate-400 font-bold uppercase tracking-wider">Subject:</span> Payment Reminder - Invoice INV-12450</div>
                      <div className="pt-1.5 text-slate-500 font-normal leading-relaxed">
                        Hi ABC Motors Pty Ltd,<br />
                        This is a friendly reminder that invoice **INV-12450** for **$32,450.00** is now due. Please find the invoice attached for your reference.<br />
                        <span className="block mt-2 font-bold text-slate-600">Payment due date: 05 Jul 2025</span>
                        Kind regards,<br />
                        **Hero Logistics Accounts Team**
                      </div>
                    </div>
                  </div>
                  <button className="mt-4 w-full text-center text-[10px] font-black text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-widest block pt-3 border-t border-slate-100 cursor-pointer">Preview All Reminders</button>
                </div>

                {/* Col 3: Debtor Ageing (Pie Chart SVG representation) */}
                <div className="flex flex-col justify-between">
                  <div>
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Debtor Ageing</h4>
                    <div className="flex items-center gap-4 mb-4">
                      {/* SVG Donut Chart */}
                      <div className="w-16 h-16 shrink-0 relative flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F1F5F9" strokeWidth="3" />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10B981" strokeWidth="3.2" strokeDasharray="56.2 43.8" strokeDashoffset="0" />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F59E0B" strokeWidth="3.2" strokeDasharray="25.3 74.7" strokeDashoffset="-56.2" />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#EF4444" strokeWidth="3.2" strokeDasharray="12.9 87.1" strokeDashoffset="-81.5" />
                        </svg>
                        <div className="absolute text-center">
                          <span className="text-[8px] font-black text-slate-400 block uppercase tracking-widest">Total</span>
                          <span className="text-[10px] font-black text-slate-800 block">$38,850</span>
                        </div>
                      </div>

                      {/* Legends */}
                      <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 text-[10px] font-bold text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                          <span>Current: 56.2%</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></div>
                          <span>31-60d: 25.3%</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></div>
                          <span>61-90d: 10.9%</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
                          <span>90+d: 2.0%</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 bg-slate-50/50 border border-slate-100 rounded-2xl p-3">
                      <div className="flex justify-between text-[10px] font-bold text-slate-600">
                        <span>Current (0-30 days)</span>
                        <span className="font-black text-slate-800">$32,450.00</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-600">
                        <span>31-60 days</span>
                        <span className="font-black text-slate-800">$3,204.50</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-600">
                        <span>61-90 days</span>
                        <span className="font-black text-slate-800">$5,958.00</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-600">
                        <span>90+ days</span>
                        <span className="font-black text-slate-800">$1,238.00</span>
                      </div>
                    </div>
                  </div>
                  <button className="mt-4 w-full text-center text-[10px] font-black text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-widest block pt-3 border-t border-slate-100 cursor-pointer">View Full Ageing Report</button>
                </div>

                {/* Col 4: AI Insights */}
                <div className="flex flex-col justify-between">
                  <div>
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">AI Insights</h4>
                    <div className="space-y-3">
                      {[
                        'ABC Motors usually pays 7 days after due date.',
                        '2 invoices are at risk of going 30+ days overdue.',
                        'Best time to call is between 9-11 AM (based on history).',
                        'Customer responded to email: 82% of the time.',
                        'Consider a phone call for overdue invoices over 14 days.'
                      ].map((insight, idx) => (
                        <div key={idx} className="flex gap-2 items-start text-[10px] font-semibold text-slate-600 leading-relaxed">
                          <div className="w-1 h-1 rounded-full bg-indigo-500 shrink-0 mt-1.5"></div>
                          <span>{insight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button className="mt-4 w-full text-center text-[10px] font-black text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-widest block pt-3 border-t border-slate-100 cursor-pointer">View All AI Insights</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="flex-grow bg-[#F8FAFC] p-2 sm:p-6 w-full text-left font-sans custom-scrollbar overflow-y-auto relative">
      {/* List View Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customers</h1>
          <p className="text-sm text-slate-500 mt-0.5 font-medium">Manage your customers, contacts, billing rules and history.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
            <Plus size={14} /> Add Customer
          </button>
          <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer">
            Import
          </button>
          <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer">
            Export
          </button>
          <button className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-all shadow-sm cursor-pointer">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* KPI Cards & Sidebar Container */}
      <div className="flex flex-col xl:flex-row gap-6 mb-6">
        {/* Left Side: KPI Cards */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Users size={16} /></div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">Total<br />Customers</p>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">156</h3>
              <p className="text-xs font-bold text-slate-400 mt-1">40 New</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><UserCheck size={16} /></div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">Active<br />Customers</p>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">128</h3>
              <p className="text-xs font-bold text-slate-400 mt-1">81.5% of total</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><UserPlus size={16} /></div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">Customers<br />(This Month)</p>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">12</h3>
              <p className="text-xs font-bold text-slate-400 mt-1">Newly added</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center"><UserMinus size={16} /></div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">Inactive<br />Customers</p>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">28</h3>
              <p className="text-xs font-bold text-slate-400 mt-1">17.5% of total</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><Star size={16} /></div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">Top<br />Customer (YTD)</p>
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 truncate">ABC Motors ...</h3>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">LTV: $2.4M (12 Mo)</p>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Stats (Hidden on smaller screens, shown inline here) */}
      </div>

      {/* Main Content Area (Filters + Table + Sidebar) */}
      <div className="flex flex-col xl:flex-row gap-6">

        {/* Main List Section */}
        <div className="flex-grow flex flex-col gap-4">

          {/* Filters Bar */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <div className="grid grid-cols-1 xl:grid-cols-6 gap-4 items-end">
              <div className="xl:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Search Customers</label>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by Name, ABN..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
              </div>
              <div className="xl:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Status</label>
                <div className="relative">
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer w-full">
                    <option value="All States">All States</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="xl:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Customer Type</label>
                <div className="relative">
                  <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer w-full">
                    <option value="All Types">All Types</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Business">Business</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="xl:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Transport Modules</label>
                <div className="relative">
                  <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value)} className="appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer w-full">
                    <option value="All Mods">All Mods</option>
                    <option value="Truck">Truck</option>
                    <option value="Box">Box</option>
                    <option value="Alert">Alert</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="xl:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Account Manager</label>
                <div className="relative">
                  <select value={managerFilter} onChange={e => setManagerFilter(e.target.value)} className="appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer w-full">
                    <option value="All Managers">All Managers</option>
                    <option value="Sarah Mitchell">Sarah Mitchell</option>
                    <option value="Mike Thompson">Mike Thompson</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 items-end mt-4 pt-4 border-t border-slate-100">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">State</label>
                <div className="relative">
                  <select className="appearance-none pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-blue-500 cursor-pointer w-[120px]">
                    <option>All States</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Created Date</label>
                <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-xs font-bold text-slate-500">
                  <span>Start Date</span>
                  <ArrowRight size={12} className="text-slate-300" />
                  <span>End Date</span>
                  <Calendar size={14} className="text-slate-400 ml-2" />
                </div>
              </div>
              <button className="px-4 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ml-auto">
                <Filter size={14} /> More Filters
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">38 customers found</span>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-xs hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer">
                  <Package size={12} /> Columns
                </button>
                <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-xs hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer">
                  <List size={12} /> Group By
                </button>
                <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-xs hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer">
                  <ChevronDown size={12} /> Sort By: Created Date
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-white border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="py-3 px-4 w-10"><input type="checkbox" className="rounded border-slate-300" /></th>
                    <th className="py-3 px-4">CUSTOMER</th>
                    <th className="py-3 px-4">TYPE</th>
                    <th className="py-3 px-4">CONTACT</th>
                    <th className="py-3 px-4">TRANSPORT MODULES</th>
                    <th className="py-3 px-4">BILLING TERMS</th>
                    <th className="py-3 px-4">ACCOUNT MANAGER</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                  {filteredCustomers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-3 px-4"><input type="checkbox" className="rounded border-slate-300" /></td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedCustomer(c)}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${c.type === 'Business' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                            }`}>
                            {c.id}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{c.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider">ABN: {c.abn}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.type === 'Corporate' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'
                          }`}>
                          {c.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{c.contactName}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{c.contactEmail}</p>
                          <p className="text-[10px] text-slate-400">{c.contactPhone}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {c.transportModules?.includes('truck') && (
                            <div className="w-7 h-7 rounded border border-slate-200 bg-slate-50 text-slate-600 flex items-center justify-center">
                              <Truck size={12} />
                            </div>
                          )}
                          {c.transportModules?.includes('box') && (
                            <div className="w-7 h-7 rounded border border-slate-200 bg-slate-50 text-slate-600 flex items-center justify-center">
                              <Package size={12} />
                            </div>
                          )}
                          {c.transportModules?.includes('alert') && (
                            <div className="w-7 h-7 rounded border border-slate-200 bg-slate-50 text-slate-600 flex items-center justify-center">
                              <AlertCircle size={12} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{c.billingTerms}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{c.billingType}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{c.manager}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md border ${c.status === 'Active' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                          c.status === 'Inactive' ? 'bg-red-50 border-red-100 text-red-600' :
                            'bg-amber-50 border-amber-100 text-amber-600'
                          }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right relative">
                        <button onClick={() => toggleActionMenu(c.id)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center">
                          <MoreVertical size={16} />
                        </button>
                        {activeActionMenu === c.id && (
                          <div className="absolute right-8 top-10 w-48 bg-white border border-slate-100 rounded-xl shadow-lg py-1 z-50 text-left">
                            <button onClick={() => setSelectedCustomer(c)} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer">
                              <Eye size={14} className="text-slate-400" /> View Details
                            </button>
                            <button className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer">
                              <Edit size={14} className="text-slate-400" /> Edit Customer
                            </button>
                            <button className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer">
                              <UserCircle size={14} className="text-slate-400" /> Assign Manager
                            </button>
                            <div className="my-1 border-t border-slate-50"></div>
                            <button className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer">
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Showing 1 to 20 of 38 customers</span>
              <div className="flex items-center gap-1">
                <button className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded text-slate-400 cursor-pointer shadow-xs">&laquo;</button>
                <button className="w-6 h-6 flex items-center justify-center bg-blue-600 border border-blue-600 rounded text-white font-bold text-xs cursor-pointer shadow-xs">1</button>
                <button className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer shadow-xs">2</button>
                <button className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer shadow-xs">3</button>
                <span className="text-slate-400 font-bold text-xs px-1">...</span>
                <button className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer shadow-xs">8</button>
                <button className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded text-slate-400 hover:bg-slate-50 cursor-pointer shadow-xs">&raquo;</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Analytics */}
        <div className="w-full xl:w-[280px] shrink-0 flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <h3 className="text-xs font-black text-slate-900 tracking-tight mb-1">Customer Overview</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Today, 15 July 2025</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-xl border border-blue-50">
                <div className="flex items-center gap-2">
                  <div className="text-blue-500"><Users size={14} /></div>
                  <span className="text-xs font-bold text-slate-700">New Customers</span>
                </div>
                <span className="text-sm font-black text-slate-900">3</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-xl border border-emerald-50">
                <div className="flex items-center gap-2">
                  <div className="text-emerald-500"><UserCheck size={14} /></div>
                  <span className="text-xs font-bold text-slate-700">Active Customers</span>
                </div>
                <span className="text-sm font-black text-slate-900">120</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl border border-red-50">
                <div className="flex items-center gap-2">
                  <div className="text-red-500"><UserMinus size={14} /></div>
                  <span className="text-xs font-bold text-slate-700">Inactive Customers</span>
                </div>
                <span className="text-sm font-black text-slate-900">20</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-indigo-50/50 rounded-xl border border-indigo-50">
                <div className="flex items-center gap-2">
                  <div className="text-indigo-500"><UserPlus size={14} /></div>
                  <span className="text-xs font-bold text-slate-700">Added (This Month)</span>
                </div>
                <span className="text-sm font-black text-slate-900">12</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <h3 className="text-xs font-black text-slate-900 tracking-tight mb-4">Transport Modules</h3>

            {/* Fake Donut Chart */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#E2E8F0" strokeWidth="15" />
                {/* Car Carrying 50% */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10B981" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset="125.6" className="transition-all duration-1000" />
                {/* General Freight 28% */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3B82F6" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset="180" strokeDasharrayoffset="125.6" className="transition-all duration-1000" style={{ strokeDashoffset: 180, transformOrigin: 'center', transform: 'rotate(180deg)' }} />
                {/* Dangerous Goods 12% & Warehousing 10% simulated... this is just CSS magic illusion */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F59E0B" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset="220" className="transition-all duration-1000" style={{ strokeDashoffset: 220, transformOrigin: 'center', transform: 'rotate(280deg)' }} />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#EF4444" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset="226" className="transition-all duration-1000" style={{ strokeDashoffset: 226, transformOrigin: 'center', transform: 'rotate(320deg)' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900">156</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
              </div>
            </div>

            <div className="space-y-3 text-[10px] font-bold">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div><span className="text-slate-600">Car Carrying</span></div>
                <div><span className="text-slate-900 font-black">80</span> <span className="text-slate-400">(51%)</span></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div><span className="text-slate-600">General Freight</span></div>
                <div><span className="text-slate-900 font-black">45</span> <span className="text-slate-400">(29%)</span></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div><span className="text-slate-600">Dangerous Goods</span></div>
                <div><span className="text-slate-900 font-black">18</span> <span className="text-slate-400">(12%)</span></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div><span className="text-slate-600">Warehousing</span></div>
                <div><span className="text-slate-900 font-black">9</span> <span className="text-slate-400">(6%)</span></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Add New Customer Modal Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-900">Add New Customer</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveCustomer} className="p-6 space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Company Name *</label>
                <input
                  type="text"
                  value={newCustomerForm.name}
                  onChange={e => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                  placeholder="Enter company name"
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">ABN / ACN</label>
                  <input
                    type="text"
                    value={newCustomerForm.abn}
                    onChange={e => setNewCustomerForm({ ...newCustomerForm, abn: e.target.value })}
                    placeholder="e.g. 12 345 678 901"
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">Customer Type</label>
                  <div className="relative">
                    <select
                      value={newCustomerForm.type}
                      onChange={e => setNewCustomerForm({ ...newCustomerForm, type: e.target.value })}
                      className="appearance-none w-full border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer bg-white"
                    >
                      <option value="Corporate">Corporate</option>
                      <option value="Business">Business</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-50">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-bold transition-colors cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors cursor-pointer shadow-md">
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
