import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Users, UserCheck, UserPlus, UserMinus, Star, Search, Plus, Upload, Download, MoreVertical,
  ChevronDown, ArrowRight, ArrowLeft, Eye, Edit, UserCircle, Trash2, Check, MapPin, Phone, Mail, Globe, Clock, Package, CheckCircle2, FileText, ChevronLeft, Building2, Briefcase, Lock, List, Settings, DollarSign, Activity, AlertCircle, Wrench, Truck, Calendar, Filter, X, MessageSquare, ToggleLeft, ToggleRight, Info, Map, Car, Calculator, Shield, ExternalLink, ChevronRight
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
  const [customersList, setCustomersList] = useState(mockCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeActionMenu, setActiveActionMenu] = useState(null);
  const [activeDetailsTab, setActiveDetailsTab] = useState('Overview');

  const [showCreateLoadModal, setShowCreateLoadModal] = useState(false);
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [showSendMessageModal, setShowSendMessageModal] = useState(false);
  const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showAssignManagerModal, setShowAssignManagerModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBranchTab, setSelectedBranchTab] = useState(null);
  const [activeBranchTabTab, setActiveBranchTabTab] = useState('Overview');
  
  const [showAddStaffFormTab, setShowAddStaffFormTab] = useState(false);
  const [newStaffNameTab, setNewStaffNameTab] = useState('');
  const [newStaffRoleTab, setNewStaffRoleTab] = useState('Dispatcher');

  const [customerBranches, setCustomerBranches] = useState([
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
      authority: [
        { name: 'Liam Smith', role: 'Branch Manager', initials: 'LS' },
        { name: 'Emma Thompson', role: 'Dispatcher', initials: 'ET' }
      ]
    }
  ]);
  const [showAddBranchTab, setShowAddBranchTab] = useState(false);
  const [branchSearchQuery, setBranchSearchQuery] = useState('');
  const [newBranchTabForm, setNewBranchTabForm] = useState({
    name: '',
    type: 'Local Branch',
    address: '',
    code: '',
    managerName: '',
    phone: '',
    workingHours: '08:00 - 18:00',
    storageSpace: '1000'
  });

  const handleSaveBranchTab = (e) => {
    e.preventDefault();
    if (!newBranchTabForm.name || !newBranchTabForm.code) return;

    if (selectedBranchTab) {
      // Edit/Configure Mode
      const updatedBranch = {
        ...selectedBranchTab,
        name: newBranchTabForm.name,
        type: newBranchTabForm.type,
        address: newBranchTabForm.address.toUpperCase(),
        code: newBranchTabForm.code.toUpperCase(),
        leadName: newBranchTabForm.managerName.toUpperCase(),
        leadInitials: newBranchTabForm.managerName ? newBranchTabForm.managerName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'NA',
        phone: newBranchTabForm.phone || selectedBranchTab.phone,
        hours: newBranchTabForm.workingHours || selectedBranchTab.hours
      };

      setSelectedBranchTab(updatedBranch);
      setCustomerBranches(prev => prev.map(b => b.id === selectedBranchTab.id ? updatedBranch : b));
      setShowAddBranchTab(false);
    } else {
      // Add Mode
      const storageVal = Math.floor(Math.random() * 60) + 30;
      const isRed = storageVal >= 90;

      const newBranch = {
        id: Date.now().toString(),
        name: newBranchTabForm.name,
        code: newBranchTabForm.code.toUpperCase(),
        type: newBranchTabForm.type,
        status: 'Online',
        score: Math.floor(Math.random() * 20) + 80,
        address: newBranchTabForm.address.toUpperCase() || 'UNKNOWN ADDRESS',
        leadName: newBranchTabForm.managerName.toUpperCase() || 'NO MANAGER ASSIGNED',
        leadInitials: newBranchTabForm.managerName ? newBranchTabForm.managerName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'NA',
        staffCount: Math.floor(Math.random() * 40) + 10,
        vehicles: Math.floor(Math.random() * 15) + 3,
        storageUsage: storageVal,
        storageText: isRed ? `FULL ${storageVal}%` : `OK ${storageVal}%`,
        storageColor: isRed ? 'text-red-500 bg-red-500' : 'text-amber-500 bg-amber-500',
        phone: newBranchTabForm.phone || '+61 2 9111 2222',
        hours: newBranchTabForm.workingHours || '24/7',
        authority: [
          { name: newBranchTabForm.managerName.toUpperCase() || 'NO MANAGER ASSIGNED', role: 'Branch Manager', initials: newBranchTabForm.managerName ? newBranchTabForm.managerName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'NA' }
        ]
      };

      setCustomerBranches(prev => [...prev, newBranch]);
      setShowAddBranchTab(false);
    }

    setNewBranchTabForm({
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

  const handleAddStaffMemberTab = (e) => {
    e.preventDefault();
    if (!newStaffNameTab) return;

    const initials = newStaffNameTab.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const newStaff = {
      name: newStaffNameTab,
      role: newStaffRoleTab,
      initials
    };

    const updatedBranch = {
      ...selectedBranchTab,
      authority: [...(selectedBranchTab.authority || []), newStaff],
      staffCount: selectedBranchTab.staffCount + 1
    };

    setSelectedBranchTab(updatedBranch);
    setCustomerBranches(prev => prev.map(b => b.id === selectedBranchTab.id ? updatedBranch : b));
    
    // Reset states
    setNewStaffNameTab('');
    setNewStaffRoleTab('Dispatcher');
    setShowAddStaffFormTab(false);
  };

  const [editCustomerForm, setEditCustomerForm] = useState({
    id: '',
    name: '',
    abn: '',
    acn: '',
    type: 'Corporate',
    billingTerms: '30 Days EOM',
    creditLimit: '250000',
    category: 'Strategic Account',
    manager: '',
    status: 'Active'
  });

  const [assignManagerForm, setAssignManagerForm] = useState({
    id: '',
    name: '',
    manager: ''
  });

  const [deleteCustomerForm, setDeleteCustomerForm] = useState({
    id: '',
    name: ''
  });

  const openEditCustomer = (customer) => {
    setEditCustomerForm({
      id: customer.id,
      name: customer.name || '',
      abn: customer.abn || '',
      acn: customer.acn || '123 456 789',
      type: customer.type || 'Corporate',
      billingTerms: customer.billingTerms || '14 Days EOM',
      creditLimit: customer.creditLimit || '250000',
      category: customer.category || 'Strategic Account',
      manager: customer.manager || 'Sarah Mitchell',
      status: customer.status || 'Active'
    });
    setShowEditCustomerModal(true);
    setActiveActionMenu(null);
  };

  const openAssignManager = (customer) => {
    setAssignManagerForm({
      id: customer.id,
      name: customer.name,
      manager: customer.manager || 'Sarah Mitchell'
    });
    setShowAssignManagerModal(true);
    setActiveActionMenu(null);
  };

  const openDeleteCustomer = (customer) => {
    setDeleteCustomerForm({
      id: customer.id,
      name: customer.name
    });
    setShowDeleteModal(true);
    setActiveActionMenu(null);
  };

  const handleSaveEditCustomer = (e) => {
    e.preventDefault();
    const updatedList = customersList.map(c => {
      if (c.id === editCustomerForm.id) {
        return {
          ...c,
          name: editCustomerForm.name,
          abn: editCustomerForm.abn,
          type: editCustomerForm.type,
          billingTerms: editCustomerForm.billingTerms,
          manager: editCustomerForm.manager,
          status: editCustomerForm.status,
        };
      }
      return c;
    });
    setCustomersList(updatedList);

    if (selectedCustomer && selectedCustomer.id === editCustomerForm.id) {
      setSelectedCustomer({
        ...selectedCustomer,
        name: editCustomerForm.name,
        abn: editCustomerForm.abn,
        type: editCustomerForm.type,
        billingTerms: editCustomerForm.billingTerms,
        manager: editCustomerForm.manager,
        status: editCustomerForm.status
      });
      setCompanyInfo(prev => ({
        ...prev,
        tradingName: editCustomerForm.name,
        abn: editCustomerForm.abn,
        acn: editCustomerForm.acn,
        status: editCustomerForm.status
      }));
    }
    setShowEditCustomerModal(false);
  };

  const handleSaveAssignManager = (e) => {
    if (e) e.preventDefault();
    const updatedList = customersList.map(c => {
      if (c.id === assignManagerForm.id) {
        return { ...c, manager: assignManagerForm.manager };
      }
      return c;
    });
    setCustomersList(updatedList);

    if (selectedCustomer && selectedCustomer.id === assignManagerForm.id) {
      setSelectedCustomer({
        ...selectedCustomer,
        manager: assignManagerForm.manager
      });
    }
    setShowAssignManagerModal(false);
  };

  const handleConfirmDelete = (e) => {
    if (e) e.preventDefault();
    const updatedList = customersList.filter(c => c.id !== deleteCustomerForm.id);
    setCustomersList(updatedList);

    if (selectedCustomer && selectedCustomer.id === deleteCustomerForm.id) {
      setSelectedCustomer(null);
    }
    setShowDeleteModal(false);
  };

  // Contacts live state
  const [contacts, setContacts] = useState([
    { id: 1, firstName: 'John', lastName: 'Smith', role: 'Primary', phone: '0401 234 567', email: 'john.smith@abcmotors.com.au', isPrimary: true },
    { id: 2, firstName: 'Michael', lastName: 'King', role: 'Accounts', phone: '0412 345 678', email: 'michael.king@abcmotors.com.au', isPrimary: false },
    { id: 3, firstName: 'Sarah', lastName: 'Patel', role: 'Operations', phone: '0411 567 890', email: 'sarah.patel@abcmotors.com.au', isPrimary: false },
    { id: 4, firstName: 'After', lastName: 'Hours', role: 'After Hours', phone: '1300 123 456', email: 'afterhours@abcmotors.com.au', isPrimary: false },
  ]);
  const [draftContact, setDraftContact] = useState({ firstName: '', lastName: '', role: '', email: '', phone: '', isPrimary: false });
  const [showUploadDocumentModal, setShowUploadDocumentModal] = useState(false);
  const [showEditCompanyInfoModal, setShowEditCompanyInfoModal] = useState(false);
  const [showEditNotesTagsModal, setShowEditNotesTagsModal] = useState(false);
  const [showEditSpecialInstructionsModal, setShowEditSpecialInstructionsModal] = useState(false);
  const [showMainHeaderMenu, setShowMainHeaderMenu] = useState(false);

  // Special Instructions Live State
  const [specialInstructions, setSpecialInstructions] = useState(`Delivery Instructions
Report to receiving office before unloading. Photo POD required for all deliveries.

Site Requirements
High visibility vest must be worn on site. Speed limit 10km/h within yard.

Booking Requirements
All deliveries must be booked 24hrs in advance. Contact operations for scheduling.

Access Information
Main gate code: 2580#
Please sign in at security.`);
  const [draftSpecialInstructions, setDraftSpecialInstructions] = useState('');

  // Company Information live state
  const [companyInfo, setCompanyInfo] = useState({
    tradingName: selectedCustomer?.name || 'FreightCo',
    phone: '0415 166 693',
    abn: selectedCustomer?.abn || '68 961 770 797',
    email: 'casey.davis@example.com',
    acn: '123 456 789',
    website: 'www.abcmotors.com.au',
    industry: 'Automotive',
    customerSince: '12 Feb 2022',
    address: '25 Corporate Drive\nEpping NSW 2121\nAustralia',
  });
  const [draftCompanyInfo, setDraftCompanyInfo] = useState({});

  useEffect(() => {
    if (selectedCustomer) {
      setCompanyInfo({
        tradingName: selectedCustomer.name || '',
        phone: selectedCustomer.contactPhone || '0415 166 693',
        abn: selectedCustomer.abn || '',
        email: selectedCustomer.contactEmail || 'casey.davis@example.com',
        acn: selectedCustomer.acn || '123 456 789',
        website: selectedCustomer.website || 'www.abcmotors.com.au',
        industry: selectedCustomer.industry || 'Automotive',
        customerSince: selectedCustomer.customerSince || '12 Feb 2022',
        address: selectedCustomer.address || '25 Corporate Drive\nEpping NSW 2121\nAustralia',
      });
      if (selectedCustomer.contacts) {
        setContacts(selectedCustomer.contacts);
      } else {
        setContacts([
          { id: 1, firstName: selectedCustomer.contactName?.split(' ')[0] || 'Casey', lastName: selectedCustomer.contactName?.split(' ')[1] || 'Doe', role: 'Primary', phone: selectedCustomer.contactPhone || '0415 166 693', email: selectedCustomer.contactEmail || 'casey.davis@example.com', isPrimary: true },
          { id: 2, firstName: 'Michael', lastName: 'King', role: 'Accounts', phone: '0412 345 678', email: 'michael.king@abcmotors.com.au', isPrimary: false },
        ]);
      }
    }
  }, [selectedCustomer]);

  // Notes & Tags live state
  const [internalNotes, setInternalNotes] = useState(
    'Priority customer. Regular car carrier runs.\nWeekly exports to Brisbane port.\nRequires advance booking for all pickups.'
  );
  const [customerTags, setCustomerTags] = useState(['Car Carrying', 'VIP', 'Regular', 'Export']);
  // Draft state inside modal
  const [draftNotes, setDraftNotes] = useState('');
  const [draftTags, setDraftTags] = useState([]);
  const [newTagInput, setNewTagInput] = useState('');

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

  const filteredCustomers = customersList.filter(c => {
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
    if (!newCustomerForm.name) return;

    const baseId = newCustomerForm.name.slice(0, 2).toUpperCase();
    let uniqueId = baseId;
    let counter = 1;
    while (customersList.some(c => c.id === uniqueId)) {
      uniqueId = `${baseId}${counter}`;
      counter++;
    }

    const newCustomer = {
      id: uniqueId,
      name: newCustomerForm.name,
      abn: newCustomerForm.abn || 'N/A',
      type: newCustomerForm.type,
      contactName: 'New Contact',
      contactEmail: 'contact@example.com',
      contactPhone: 'N/A',
      transportModules: ['truck'],
      billingTerms: '14 Days',
      billingType: 'EOM',
      manager: 'Sarah Mitchell',
      status: 'Active'
    };

    setCustomersList([newCustomer, ...customersList]);
    setNewCustomerForm({ name: '', abn: '', type: 'Corporate' });
    setShowAddModal(false);
  };

  if (selectedCustomer) {
    return (
      <>
      <div className="flex-grow bg-[#F8FAFC] p-2 sm:p-6 w-full text-left font-sans custom-scrollbar overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-start gap-4">
            <button onClick={() => setSelectedCustomer(null)} className="w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer mt-1 shrink-0">
              <ChevronLeft size={16} />
            </button>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
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
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button onClick={() => setShowCreateLoadModal(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer flex-grow sm:flex-grow-0 justify-center">
              <Plus size={14} /> Create Load
            </button>
            <button onClick={() => setShowSendMessageModal(true)} className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer flex-grow sm:flex-grow-0 justify-center">
              <MessageSquare size={14} /> Message
            </button>
            <button onClick={() => openEditCustomer(selectedCustomer)} className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer flex-grow sm:flex-grow-0 justify-center">
              <Edit size={14} /> Edit Customer
            </button>
            <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer flex-grow sm:flex-grow-0 justify-center">
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
        <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-sm flex flex-row flex-nowrap items-center justify-start gap-8 mb-6 overflow-x-auto custom-scrollbar w-full pb-4">
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

          <div className="h-10 w-px bg-slate-100 shrink-0"></div>

          <div className="flex flex-row flex-nowrap items-center gap-8 shrink-0">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs border border-indigo-100 shrink-0">
                SM
              </div>
              <div className="shrink-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Account Manager</p>
                <p className="text-sm font-bold text-slate-900">{selectedCustomer.manager}</p>
                <p className="text-[10px] text-slate-550 font-semibold">{selectedCustomer.contactEmail || 'sarah.m@herologistics.com'}</p>
              </div>
            </div>

            <div className="h-10 w-px bg-slate-100 shrink-0"></div>

            <div className="shrink-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Billing Terms</p>
              <p className="text-sm font-black text-slate-900">14 Days EOM</p>
            </div>

            <div className="h-10 w-px bg-slate-100 shrink-0"></div>

            <div className="shrink-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Credit Limit</p>
              <p className="text-sm font-black text-slate-900">$250,000.00</p>
            </div>

            <div className="h-10 w-px bg-slate-100 shrink-0"></div>

            <div className="shrink-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 text-right">Outstanding</p>
              <p className="text-sm font-black text-red-600 text-right mb-0.5">$32,450.00</p>
              <div className="flex justify-between items-center text-[9px] font-bold">
                <span className="text-slate-400 uppercase tracking-widest">Credit Available</span>
                <span className="text-emerald-600 ml-3 font-black text-[10px]">$217,550.00</span>
              </div>
            </div>

            <div className="h-10 w-px bg-slate-100 shrink-0"></div>

            <div className="shrink-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total Revenue (YTD)</p>
              <p className="text-sm font-black text-slate-900">$2,480,650.00</p>
            </div>

            <div className="h-10 w-px bg-slate-100 shrink-0"></div>

            <div className="shrink-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total Loads</p>
              <p className="text-sm font-black text-slate-900">42</p>
            </div>

            <div className="h-10 w-px bg-slate-100 shrink-0"></div>

            <div className="shrink-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Last Load</p>
              <p className="text-sm font-black text-indigo-600 hover:underline cursor-pointer">PO-12546</p>
              <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">08/07/2025</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-slate-200 mb-6 overflow-x-auto pb-0" style={{ gap: '0' }}>
          {['Overview', 'Contacts', 'Billing Rules', 'Pricing', 'Transport Modules', 'Instructions', 'Documents', 'Activity', 'Financials'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveDetailsTab(tab)}
              className={`flex items-center gap-1.5 px-4 pb-3 pt-1 text-[13px] font-medium whitespace-nowrap transition-all relative cursor-pointer border-b-2 ${activeDetailsTab === tab
                ? 'text-indigo-600 border-indigo-600'
                : 'text-slate-400 border-transparent hover:text-slate-600 hover:border-slate-300'
                }`}
            >
              <span className={`text-[8px] ${activeDetailsTab === tab ? 'text-indigo-400' : 'text-slate-300'}`}>◆</span>
              {tab}
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
                  <button onClick={() => { setDraftCompanyInfo({...companyInfo}); setShowEditCompanyInfoModal(true); }} className="text-[10px] font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1 border border-slate-100 px-2 py-1 rounded bg-slate-50 cursor-pointer">
                    <Edit size={12} /> Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm font-semibold text-slate-600">
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5 tracking-widest">Trading Name</span>
                    <span className="text-xs text-slate-900 font-bold">{companyInfo.tradingName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5 tracking-widest">Phone</span>
                    <span className="text-xs text-slate-900 font-bold">{companyInfo.phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5 tracking-widest">ABN</span>
                    <span className="text-xs text-slate-900 font-bold">{companyInfo.abn}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5 tracking-widest">Email</span>
                    <span className="text-xs text-slate-900 font-bold">{companyInfo.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5 tracking-widest">ACN</span>
                    <span className="text-xs text-slate-900 font-bold">{companyInfo.acn}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5 tracking-widest">Website</span>
                    <span className="text-xs text-slate-900 font-bold">{companyInfo.website}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5 tracking-widest">Industry</span>
                    <span className="text-xs text-slate-900 font-bold">{companyInfo.industry}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5 tracking-widest">Customer Since</span>
                    <span className="text-xs text-slate-900 font-bold">{companyInfo.customerSince}</span>
                  </div>
                  <div className="col-span-1">
                    <span className="text-[10px] text-slate-400 font-black uppercase block mb-0.5 tracking-widest">Address</span>
                    <span className="text-xs text-slate-900 font-bold block leading-tight">{companyInfo.address.split('\n').map((line, i) => <span key={i}>{line}{i < companyInfo.address.split('\n').length - 1 && <br />}</span>)}</span>
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
                    { label: 'View Loads', icon: Eye, action: () => setActiveDetailsTab('Activity') },
                    { label: 'Create Invoice', icon: Plus, action: () => setShowCreateInvoiceModal(true) },
                    { label: 'Send Message', icon: MessageSquare, action: () => setShowSendMessageModal(true) },
                    { label: 'View Invoices', icon: FileText, action: () => setActiveDetailsTab('Financials') },
                    { label: 'Edit Customer', icon: Edit, action: () => setShowEditCustomerModal(true) },
                    { label: 'Add Contact', icon: UserPlus, action: () => setShowAddContactModal(true) },
                    { label: 'Upload Document', icon: Upload, action: () => setShowUploadDocumentModal(true) },
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
                  <button onClick={() => { setDraftNotes(internalNotes); setDraftTags([...customerTags]); setNewTagInput(''); setShowEditNotesTagsModal(true); }} className="text-[10px] font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1 border border-slate-100 px-2 py-1 rounded bg-slate-50 cursor-pointer">
                    <Edit size={12} /> Edit
                  </button>
                </div>

                <div className="mb-5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Internal Notes</p>
                  <div className="space-y-2">
                    {internalNotes.split('\n').filter(n => n.trim()).map((note, i) => (
                      <p key={i} className="text-xs font-semibold text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        {note}
                      </p>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {customerTags.map((tag, i) => {
                      const colors = [
                        'bg-indigo-50 text-indigo-700 border-indigo-100',
                        'bg-amber-50 text-amber-700 border-amber-100',
                        'bg-emerald-50 text-emerald-700 border-emerald-100',
                        'bg-slate-100 text-slate-700 border-slate-200',
                        'bg-rose-50 text-rose-700 border-rose-100',
                        'bg-purple-50 text-purple-700 border-purple-100',
                      ];
                      return (
                        <span key={i} className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border shadow-sm ${colors[i % colors.length]}`}>
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Contacts */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-slate-800">
                    <Users size={16} className="text-blue-600" />
                    <h3 className="text-sm font-black tracking-tight">Contacts</h3>
                  </div>
                  <button onClick={() => { setDraftContact({ firstName: '', lastName: '', role: '', email: '', phone: '', isPrimary: false }); setShowAddContactModal(true); }} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
                    <Plus size={12} /> Add Contact
                  </button>
                </div>
                <div className="space-y-4 mb-4">
                  {(() => {
                    const avatarColors = [
                      { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', badge: 'bg-indigo-50 text-indigo-600' },
                      { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', badge: 'bg-emerald-50 text-emerald-600' },
                      { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', badge: 'bg-amber-50 text-amber-600' },
                      { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', badge: 'bg-red-50 text-red-600' },
                      { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', badge: 'bg-purple-50 text-purple-600' },
                      { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', badge: 'bg-rose-50 text-rose-600' },
                    ];
                    return contacts.map((c, i) => {
                      const col = avatarColors[i % avatarColors.length];
                      const initials = `${c.firstName[0] || ''}${c.lastName[0] || ''}`.toUpperCase();
                      return (
                        <div key={c.id} className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${col.bg} ${col.text} font-black flex items-center justify-center text-xs border ${col.border} shrink-0`}>{initials}</div>
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-bold text-slate-900 truncate">{c.firstName} {c.lastName}</p>
                              {(c.isPrimary || c.role) && (
                                <span className={`${col.badge} px-1.5 py-0.5 rounded text-[8px] uppercase font-black tracking-wider ml-2 shrink-0`}>
                                  {c.isPrimary ? 'Primary' : c.role}
                                </span>
                              )}
                            </div>
                            {c.phone && <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold mt-0.5"><Phone size={10} /> {c.phone}</div>}
                            {c.email && <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold truncate mt-0.5"><Mail size={10} /> {c.email}</div>}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <button onClick={() => setActiveDetailsTab('Contacts')} className="text-[10px] font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
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
                  <button onClick={() => setActiveDetailsTab('Transport Modules')} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
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
                  <button onClick={() => setActiveDetailsTab('Activity')} className="text-[10px] font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
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
                  <button onClick={() => { setDraftSpecialInstructions(specialInstructions); setShowEditSpecialInstructionsModal(true); }} className="text-[10px] font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1 border border-slate-100 px-2 py-1 rounded bg-slate-50 cursor-pointer">
                    <Edit size={12} /> Edit
                  </button>
                </div>
                <div className="space-y-4">
                  {specialInstructions ? (
                    specialInstructions.split('\n\n').map((block, index) => {
                      const lines = block.split('\n');
                      const title = lines[0];
                      const content = lines.slice(1).join('\n');
                      return (
                        <div key={index}>
                          <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 mb-1">
                            <CheckCircle2 size={12} className="text-blue-600" /> {title}
                          </div>
                          {content && (
                            <p className="text-[10px] font-semibold text-slate-500 pl-4 leading-relaxed whitespace-pre-line">
                              {content}
                            </p>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-[10px] font-semibold text-slate-500 italic">No special instructions added.</p>
                  )}
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <button onClick={() => setActiveDetailsTab('Instructions')} className="text-[10px] font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
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
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left text-[10px] whitespace-nowrap min-w-[500px]">
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
                  <button onClick={() => setActiveDetailsTab('Activity')} className="text-[10px] font-black text-blue-600 hover:text-blue-700 cursor-pointer">
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

              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs whitespace-nowrap min-w-[900px]">
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

        {activeDetailsTab === 'Branches' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {selectedBranchTab ? (
              <div className="space-y-6">
                {/* Header Block */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                  <div className="flex items-center gap-4">
                    {/* Back button */}
                    <button 
                      onClick={() => setSelectedBranchTab(null)} 
                      className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors shadow-sm cursor-pointer shrink-0"
                    >
                      <ArrowLeft size={16} strokeWidth={2.5} />
                    </button>
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                          {selectedBranchTab.name}
                        </h1>
                        <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-black tracking-wider ${
                          selectedBranchTab.type === 'Primary Depot' ? 'bg-amber-100 text-slate-900' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {selectedBranchTab.type}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-black tracking-wider ${
                          selectedBranchTab.status === 'Online' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {selectedBranchTab.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1"><MapPin size={11} className="text-slate-400" /> {selectedBranchTab.address}</span>
                        <span className="text-slate-350">•</span>
                        <span className="flex items-center gap-1"><Phone size={11} className="text-slate-400" /> {selectedBranchTab.phone || '+61 2 9111 2222'}</span>
                        <span className="text-slate-350">•</span>
                        <span className="flex items-center gap-1"><Clock size={11} className="text-slate-400" /> {selectedBranchTab.hours || '24/7'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button 
                      onClick={() => {
                        setActiveBranchTabTab('Authority');
                        setShowAddStaffFormTab(true);
                      }}
                      className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} strokeWidth={2.5} /> Add Staff
                    </button>
                    <button 
                      onClick={() => {
                        setNewBranchTabForm({
                          name: selectedBranchTab.name,
                          type: selectedBranchTab.type,
                          address: selectedBranchTab.address,
                          code: selectedBranchTab.code,
                          managerName: selectedBranchTab.leadName,
                          phone: selectedBranchTab.phone || '+61 2 9111 2222',
                          workingHours: selectedBranchTab.hours || '24/7',
                          storageSpace: selectedBranchTab.storageSpace || '1000'
                        });
                        setShowAddBranchTab(true);
                      }}
                      className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Settings size={14} /> Configure
                    </button>
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { label: 'TOTAL STAFF', value: selectedBranchTab.staffCount, color: 'text-slate-800' },
                    { label: 'DRIVERS', value: selectedBranchTab.vehicles, color: 'text-slate-800' },
                    { label: 'FLEET ASSETS', value: selectedBranchTab.vehicles + 6, color: 'text-slate-800' },
                    { label: 'ACTIVE JOBS', value: selectedBranchTab.vehicles, color: 'text-slate-800' },
                    { label: 'DELIVERED TODAY', value: selectedBranchTab.staffCount * 10 - 8, color: 'text-slate-800' },
                    { label: 'ISSUES', value: selectedBranchTab.type === 'Primary Depot' ? '3' : '1', color: 'text-red-500' }
                  ].map((metric, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{metric.label}</p>
                      <h3 className={`text-xl font-black leading-none ${metric.color}`}>{metric.value}</h3>
                    </div>
                  ))}
                </div>

                {/* Dock Capacity progress bar */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider mb-2.5">
                    <span className="text-slate-500">Dock Capacity</span>
                    <span className="text-slate-900">{selectedBranchTab.storageUsage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-2.5">
                    <div 
                      className={`h-full rounded-full ${
                        selectedBranchTab.storageUsage >= 90 ? 'bg-red-500' : 
                        selectedBranchTab.storageUsage > 60 ? 'bg-[#EAB308]' : 'bg-emerald-500'
                      }`} 
                      style={{ width: `${selectedBranchTab.storageUsage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                    <span>{selectedBranchTab.type === 'Primary Depot' ? '18 Active Docks' : '8 Active Docks'}</span>
                    {selectedBranchTab.storageUsage >= 90 ? (
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

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  {/* Left columns */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* Inner Sub-navigation tabs with outline box for active tab */}
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3 flex-nowrap overflow-x-auto">
                      {[
                        { id: 'Overview', label: 'Overview' },
                        { id: 'Authority', label: `Authority (${(selectedBranchTab.authority || []).length})` },
                        { id: 'Drivers', label: `Drivers (4)` },
                        { id: 'Fleet', label: `Fleet (5)` },
                        { id: 'Recent Jobs', label: 'Recent Jobs' }
                      ].map((tab) => {
                        const isActive = activeBranchTabTab === tab.id;
                        return (
                          <button 
                            key={tab.id}
                            onClick={() => setActiveBranchTabTab(tab.id)}
                            className={`px-4 py-1.5 text-xs font-black whitespace-nowrap cursor-pointer transition-all rounded-lg border-2 ${
                              isActive 
                                ? 'border-slate-900 bg-white text-slate-900' 
                                : 'border-transparent text-slate-400 hover:text-slate-800'
                            }`}
                          >
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Dynamic Tab Panel Contents */}
                    {activeBranchTabTab === 'Overview' && (
                      <div className="space-y-6 animate-in fade-in duration-200">
                        {/* Profile */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
                          <div className="flex items-center gap-2 border-b border-slate-50 pb-4 mb-4">
                            <Building2 size={16} className="text-blue-600" />
                            <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Branch Profile</h3>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs font-bold text-slate-500">
                            <div>
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Branch Manager</span>
                              <span className="text-slate-800">{selectedBranchTab.leadName}</span>
                            </div>
                            <div>
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Contact Phone</span>
                              <span className="text-slate-800">{selectedBranchTab.phone || '+61 2 9111 2222'}</span>
                            </div>
                            <div>
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Operating Hours</span>
                              <span className="text-slate-800">{selectedBranchTab.hours || '24/7'}</span>
                            </div>
                            <div>
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Facility Type</span>
                              <span className="text-slate-800">{selectedBranchTab.type}</span>
                            </div>
                            <div>
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Location</span>
                              <span className="text-slate-800">{selectedBranchTab.address}</span>
                            </div>
                            <div>
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Branch ID</span>
                              <span className="text-slate-800 font-extrabold">{selectedBranchTab.code}</span>
                            </div>
                          </div>
                        </div>

                        {/* Table */}
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
                            <table className="w-full text-left text-xs whitespace-nowrap min-w-[450px]">
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
                                  <td className="py-3.5 px-5 text-slate-505 font-semibold">Jack Taylor</td>
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
                                  <td className="py-3.5 px-5 text-slate-505 font-semibold">Liam Smith</td>
                                  <td className="py-3.5 px-5 text-emerald-600 font-bold">Done</td>
                                </tr>
                                <tr className="hover:bg-slate-50/30 transition-colors">
                                  <td className="py-3.5 px-5 font-black text-slate-850">SHP-9041<span className="text-[9px] text-slate-400 font-semibold block">Tech Solutions</span></td>
                                  <td className="py-3.5 px-5"><span className="text-[8px] font-black uppercase tracking-wider text-red-600 bg-red-50 px-2 py-1 rounded">Issue</span></td>
                                  <td className="py-3.5 px-5 text-slate-505 font-semibold">Lucas Jones</td>
                                  <td className="py-3.5 px-5 text-red-500 font-bold">Delayed</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeBranchTabTab === 'Authority' && (
                      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6 animate-in fade-in duration-200">
                        <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                          <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Complete Branch Authority</h3>
                          {showAddStaffFormTab ? (
                            <button 
                              onClick={() => setShowAddStaffFormTab(false)}
                              className="text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer bg-transparent border-0"
                            >
                              Cancel
                            </button>
                          ) : (
                            <button 
                              onClick={() => setShowAddStaffFormTab(true)}
                              className="text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer bg-transparent border-0"
                            >
                              + Add New Staff Member
                            </button>
                          )}
                        </div>

                        {showAddStaffFormTab && (
                          <form onSubmit={handleAddStaffMemberTab} className="bg-slate-50/50 rounded-2xl border border-slate-100 p-5 space-y-4 animate-in slide-in-from-top duration-250">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Staff Member Name</label>
                                <input 
                                  type="text"
                                  value={newStaffNameTab}
                                  onChange={e => setNewStaffNameTab(e.target.value)}
                                  placeholder="e.g. John Doe"
                                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all text-slate-705 placeholder-slate-400 bg-white"
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Company Role</label>
                                <div className="relative">
                                  <select 
                                    value={newStaffRoleTab}
                                    onChange={e => setNewStaffRoleTab(e.target.value)}
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
                          {(selectedBranchTab.authority || []).map((auth, idx) => (
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

                    {activeBranchTabTab === 'Drivers' && (
                      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6 animate-in fade-in duration-200">
                        <div className="border-b border-slate-50 pb-4">
                          <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Assigned Drivers</h3>
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
                                <h4 className="text-xs font-bold text-slate-800 mb-1">{driver.name}</h4>
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

                    {activeBranchTabTab === 'Fleet' && (
                      <div className="bg-white rounded-2xl border border-slate-105 p-6 shadow-sm space-y-6 animate-in fade-in duration-200">
                        <div className="border-b border-slate-50 pb-4">
                          <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Assigned Fleet Vehicles</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {[
                            { name: '2022 Toyota Camry', plate: 'ABC 123', body: 'Sedan', status: 'IN DEPOT', color: 'text-slate-600 bg-slate-50 border-slate-200' },
                            { name: '2023 Honda CR-V', plate: 'XYZ 987', body: 'SUV', status: 'IN TRANSIT', color: 'text-blue-600 bg-blue-50 border-blue-105' },
                            { name: '2024 Tesla Model S', plate: 'EV 0001', body: 'Electric Sedan', status: 'DELIVERED', color: 'text-emerald-600 bg-emerald-50 border-emerald-105' },
                            { name: '2021 Ford Ranger', plate: 'TRK 444', body: 'Ute', status: 'AWAITING LOAD', color: 'text-amber-600 bg-amber-50 border-amber-105' },
                            { name: '2022 Nissan X-Trail', plate: 'NIS 202', body: 'SUV', status: 'IN DEPOT', color: 'text-slate-600 bg-slate-50 border-slate-200' }
                          ].map((vehicle, idx) => (
                            <div key={idx} className="bg-white border border-slate-105 rounded-xl p-4 flex justify-between items-start shadow-xs">
                              <div>
                                <h4 className="text-xs font-bold text-slate-805 mb-1">{vehicle.name}</h4>
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

                    {activeBranchTabTab === 'Recent Jobs' && (
                      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6 animate-in fade-in duration-200">
                        <div className="border-b border-slate-50 pb-4">
                          <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Cargo Log Book</h3>
                        </div>
                        <div className="space-y-3">
                          {[
                            { id: 'SHP-9042', route: 'Sydney Central ➔ Brisbane Port', cargo: 'Automotive Parts (1.5 tons)', customer: 'Acme Corp' },
                            { id: 'SHP-9055', route: 'Melbourne Depot ➔ Sydney Central', cargo: 'Retail Stock (800 kg)', customer: 'Acme Freight' },
                            { id: 'SHP-9039', route: 'Brisbane Port ➔ Melbourne Depot', cargo: 'Electronics (2.1 tons)', customer: 'Global Traders' }
                          ].map((job, idx) => (
                            <div key={idx} className="bg-white border border-slate-100 rounded-xl p-4 flex justify-between items-center shadow-xs">
                              <div className="space-y-0.5">
                                <h4 className="text-xs font-black text-slate-800">{job.id}</h4>
                                <p className="text-[11px] font-semibold text-slate-500">{job.route}</p>
                                <p className="text-[10px] font-semibold text-slate-400">Cargo: {job.cargo}</p>
                              </div>
                              <span className="text-[10px] font-bold text-slate-450 text-right">{job.customer}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Right columns */}
                  <div className="space-y-6">
                    {/* Control */}
                    <div className="bg-[#0f172a] text-white rounded-2xl border border-slate-900 p-5 shadow-md">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-4">
                        <Settings size={16} className="text-amber-400" />
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">Operations Control</h3>
                      </div>
                      <div className="space-y-3">
                        <button className="w-full flex items-center justify-center gap-2 py-3 border border-red-500/30 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer">
                          <Activity size={14} /> Force Offline
                        </button>
                        <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800/80 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer">
                          <Shield size={14} /> View Authority Roster
                        </button>
                        <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#EAB308] hover:bg-[#CA8A04] text-slate-900 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer">
                          <UserPlus size={14} /> Add Staff to Branch
                        </button>
                      </div>
                    </div>

                    {/* Authority */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
                      <div className="flex justify-between items-center border-b border-slate-50 pb-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Shield size={16} className="text-blue-600" />
                          <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Authority</h3>
                        </div>
                        <button className="text-[9px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest cursor-pointer">
                          Details
                        </button>
                      </div>
                      <div className="space-y-4">
                        {[
                          { name: 'Michael Adams', role: 'Branch Manager', initials: 'MA' },
                          { name: 'Sarah Mitchell', role: 'Dispatcher', initials: 'SM' },
                          { name: 'Emma Thompson', role: 'Dispatcher', initials: 'ET' },
                          { name: 'Chris Lee', role: 'Accounts', initials: 'CL' }
                        ].slice(0, selectedBranchTab.type === 'Primary Depot' ? 4 : 2).map((auth, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-black flex items-center justify-center text-[10px] shrink-0">
                              {auth.initials}
                            </div>
                            <div className="flex-grow min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate leading-none mb-0.5">{auth.name}</p>
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
            ) : showAddBranchTab ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                {/* Back navigation header */}
                <div className="flex items-center gap-2 mb-6">
                  <button 
                    type="button"
                    onClick={() => setShowAddBranchTab(false)} 
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-505 hover:text-slate-900 transition-colors uppercase tracking-wider cursor-pointer bg-transparent border-0"
                  >
                    <ArrowLeft size={14} strokeWidth={2.5} /> {selectedBranchTab ? selectedBranchTab.name : 'Customer Dashboard'}
                  </button>
                  <span className="text-slate-350 text-xs">/</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{selectedBranchTab ? 'Configure Branch' : 'Add Customer Branch'}</span>
                </div>

                <form onSubmit={handleSaveBranchTab} className="space-y-6">
                  <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-5">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-4">
                      <Building2 size={16} className="text-amber-500" />
                      <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Branch Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Branch Name</label>
                        <input 
                          type="text"
                          value={newBranchTabForm.name}
                          onChange={e => setNewBranchTabForm({ ...newBranchTabForm, name: e.target.value })}
                          placeholder="e.g. Sydney Central Depot"
                          className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all text-slate-700 placeholder-slate-400"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Branch Type</label>
                        <div className="relative">
                          <select 
                            value={newBranchTabForm.type}
                            onChange={e => setNewBranchTabForm({ ...newBranchTabForm, type: e.target.value })}
                            className="appearance-none w-full border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all text-slate-700 bg-white cursor-pointer"
                          >
                            <option value="Local Branch">Local Branch</option>
                            <option value="Primary Depot">Primary Depot</option>
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
                              value={newBranchTabForm.address}
                              onChange={e => setNewBranchTabForm({ ...newBranchTabForm, address: e.target.value })}
                              placeholder="123 Industrial Dr, Suburb, VIC 3000"
                              className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all text-slate-700 placeholder-slate-400"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Branch Code / ID</label>
                          <input 
                            type="text"
                            value={newBranchTabForm.code}
                            onChange={e => setNewBranchTabForm({ ...newBranchTabForm, code: e.target.value })}
                            placeholder="e.g. SYD-WEST"
                            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all text-slate-700 placeholder-slate-400"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-5">
                      <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-4">
                        <Users size={16} className="text-blue-500" />
                        <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Management</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Manager Name</label>
                          <input 
                            type="text"
                            value={newBranchTabForm.managerName}
                            onChange={e => setNewBranchTabForm({ ...newBranchTabForm, managerName: e.target.value })}
                            placeholder="Enter full name"
                            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all text-slate-700 placeholder-slate-400"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Phone Number</label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><Clock size={14} /></span>
                            <input 
                              type="text"
                              value={newBranchTabForm.phone}
                              onChange={e => setNewBranchTabForm({ ...newBranchTabForm, phone: e.target.value })}
                              placeholder="+61 400 000 000"
                              className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all text-slate-700 placeholder-slate-400"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-5">
                      <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-4">
                        <Clock size={16} className="text-indigo-500" />
                        <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Capacity & Hours</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Working Hours</label>
                          <input 
                            type="text"
                            value={newBranchTabForm.workingHours}
                            onChange={e => setNewBranchTabForm({ ...newBranchTabForm, workingHours: e.target.value })}
                            placeholder="08:00 - 18:00"
                            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all text-slate-700 placeholder-slate-400"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Storage Space (SQM)</label>
                          <input 
                            type="number"
                            value={newBranchTabForm.storageSpace}
                            onChange={e => setNewBranchTabForm({ ...newBranchTabForm, storageSpace: e.target.value })}
                            placeholder="1000"
                            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all text-slate-700 placeholder-slate-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button 
                      type="button" 
                      onClick={() => setShowAddBranchTab(false)} 
                      className="px-5 py-2.5 border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-6 py-2.5 bg-[#EAB308] hover:bg-[#CA8A04] text-slate-900 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check size={14} strokeWidth={2.5} /> Save Branch
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-xs shrink-0">
                      <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 border border-slate-150">
                        <Building2 size={14} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 tracking-tight">Branch List</h3>
                      <p className="text-[10px] text-slate-500 font-bold mt-0.5">Manage Depots and delivery centers configured for {selectedCustomer.name}.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedBranchTab(null);
                      setNewBranchTabForm({
                        name: '',
                        type: 'Local Branch',
                        address: '',
                        code: '',
                        managerName: '',
                        phone: '',
                        workingHours: '08:00 - 18:00',
                        storageSpace: '1000'
                      });
                      setShowAddBranchTab(true);
                    }}
                    className="px-4 py-2 bg-[#EAB308] hover:bg-[#CA8A04] text-slate-900 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 cursor-pointer border-0"
                  >
                    <Plus size={14} strokeWidth={2.5} /> Add Customer Branch
                  </button>
                </div>

                {/* Filter Input */}
                <div className="max-w-md">
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><Search size={15} /></span>
                    <input 
                      type="text"
                      value={branchSearchQuery}
                      onChange={e => setBranchSearchQuery(e.target.value)}
                      placeholder="Filter branches by name or code..."
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-all text-slate-700 placeholder-slate-400 bg-white shadow-xs"
                    />
                  </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {[
                    { label: 'SYSTEM STATUS', value: '98.4%', icon: Activity, iconColor: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-100' },
                    { label: 'TOTAL STAFF', value: '1,240', icon: Users, iconColor: 'text-blue-500', bg: 'bg-blue-50 border-blue-100' },
                    { label: 'TOTAL VEHICLES', value: '840', icon: Truck, iconColor: 'text-amber-500', bg: 'bg-amber-50 border-amber-100' },
                    { label: 'SYSTEM ONLINE', value: '99.9%', icon: Globe, iconColor: 'text-indigo-500', bg: 'bg-indigo-50 border-indigo-100' }
                  ].map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                          <h3 className="text-lg font-black text-slate-900 leading-tight">{stat.value}</h3>
                        </div>
                        <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center ${stat.iconColor} border`}>
                          <Icon size={16} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {customerBranches
                    .filter(b => 
                      b.name.toLowerCase().includes(branchSearchQuery.toLowerCase()) || 
                      b.code.toLowerCase().includes(branchSearchQuery.toLowerCase())
                    )
                    .map((branch) => {
                      const isPrimary = branch.type === 'Primary Depot';
                      return (
                        <div 
                          key={branch.id} 
                          className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                            isPrimary ? 'border-[#EAB308]' : 'border-slate-100'
                          }`}
                        >
                          <div>
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

                            <h2 className="text-base font-black text-slate-900 tracking-tight mb-1">
                              {branch.name}
                            </h2>
                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 mb-4">
                              <MapPin size={10} className="shrink-0" />
                              <span>{branch.address}</span>
                            </div>

                            <div className="flex items-center gap-2.5 mb-5 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/50">
                              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black flex items-center justify-center text-[10px] shrink-0">
                                {branch.leadInitials}
                              </div>
                              <div className="min-w-0">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Branch Lead</p>
                                <p className="text-[10px] font-black text-slate-800 leading-none truncate">LEAD: {branch.leadName}</p>
                              </div>
                            </div>

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

                          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 tracking-wider">
                              {branch.code}
                            </span>
                            <button 
                              onClick={() => {
                                setSelectedBranchTab(branch);
                                setActiveBranchTabTab('Overview');
                                setShowAddStaffFormTab(false);
                                setNewStaffNameTab('');
                                setNewStaffRoleTab('Dispatcher');
                              }}
                              className="text-[9px] font-black text-slate-700 hover:text-slate-900 transition-colors flex items-center gap-0.5 uppercase tracking-wider cursor-pointer"
                            >
                              Manage Branch <span className="text-slate-400 font-normal ml-0.5">&rsaquo;</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </>
            )}
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
                    <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full text-left text-xs mb-4 whitespace-nowrap min-w-[400px]">
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
                    </div>
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
                    <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full text-left text-xs mb-4 whitespace-nowrap min-w-[400px]">
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
                    </div>
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

                    <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full text-left text-xs mb-4 whitespace-nowrap min-w-[850px]">
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
                    <div className="overflow-x-auto custom-scrollbar flex-grow">
                      <table className="w-full text-left text-xs mb-4 whitespace-nowrap min-w-[400px]">
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
                    <div className="overflow-x-auto custom-scrollbar flex-grow">
                      <table className="w-full text-left text-xs mb-4 whitespace-nowrap min-w-[400px]">
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

      {/* Create New Load Modal */}
      {showCreateLoadModal && createPortal(
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[1.5px] flex items-center justify-center z-[9999] p-4" onClick={() => setShowCreateLoadModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[460px] max-h-[90vh] shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()} style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
            {/* Header */}
            <div className="px-7 pt-7 pb-5 flex justify-between items-start border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-[18px] font-extrabold text-slate-900 leading-tight">Create New Load</h3>
                <p className="text-[13px] font-normal text-slate-400 mt-2 leading-snug">New loads will be created in the Draft queue.</p>
              </div>
              <button onClick={() => setShowCreateLoadModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1"><X size={18} strokeWidth={2} /></button>
            </div>

            {/* Body */}
            <div className="px-7 py-6 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-[13px] font-semibold text-slate-800 block mb-2">Origin *</label>
                  <input type="text" placeholder="e.g. Sydney Depot" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all placeholder-slate-300 text-slate-700" />
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-slate-800 block mb-2">Destination *</label>
                  <input type="text" placeholder="e.g. Canberra Branch" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all placeholder-slate-300 text-slate-700" />
                </div>
              </div>

              <div>
                <label className="text-[13px] font-semibold text-slate-800 block mb-2">Cargo Type *</label>
                <input type="text" placeholder="e.g. Beverages, Electronics, Dry Goods" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all placeholder-slate-300 text-slate-700" />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-[13px] font-semibold text-slate-800 block mb-2">Weight</label>
                  <input type="text" placeholder="e.g. 6.2t" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all placeholder-slate-300 text-slate-700" />
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-slate-800 block mb-2">Priority</label>
                  <div className="relative">
                    <select className="appearance-none w-full border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all bg-white cursor-pointer">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Urgent</option>
                    </select>
                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[13px] font-semibold text-slate-800 block mb-2">Assign Driver</label>
                <input type="text" placeholder="Driver name (optional)" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all placeholder-slate-300 text-slate-700" />
              </div>

              <div>
                <label className="text-[13px] font-semibold text-slate-800 block mb-2">Notes</label>
                <textarea rows={3} placeholder="Additional notes..." className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all placeholder-slate-300 text-slate-700 resize-none"></textarea>
              </div>
            </div>

            {/* Footer */}
            <div className="px-7 py-5 flex justify-end gap-3 border-t border-slate-100 shrink-0">
              <button onClick={() => setShowCreateLoadModal(false)} className="px-5 py-2.5 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer bg-white">Cancel</button>
              <button onClick={() => setShowCreateLoadModal(false)} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[13px] font-semibold transition-colors cursor-pointer shadow-lg shadow-indigo-200">Save</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Create Invoice Modal */}
      {showCreateInvoiceModal && createPortal(
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[1.5px] flex items-center justify-center z-[9999] p-4" onClick={() => setShowCreateInvoiceModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[460px] max-h-[90vh] shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()} style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
            {/* Header */}
            <div className="px-7 pt-7 pb-5 flex justify-between items-start border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-[18px] font-extrabold text-slate-900 leading-tight">Create Invoice</h3>
                <p className="text-[13px] font-normal text-slate-400 mt-2 leading-snug">Generate a new invoice for outstanding loads.</p>
              </div>
              <button onClick={() => setShowCreateInvoiceModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1"><X size={18} strokeWidth={2} /></button>
            </div>

            {/* Body */}
            <div className="px-7 py-6 space-y-6 overflow-y-auto">
              <div>
                <label className="text-[13px] font-semibold text-slate-800 block mb-2">Invoice Date</label>
                <input type="date" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all text-slate-600" />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-slate-800 block mb-2">Due Date</label>
                <input type="date" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all text-slate-600" />
              </div>
            </div>

            {/* Footer */}
            <div className="px-7 py-5 flex justify-end gap-3 border-t border-slate-100 shrink-0">
              <button onClick={() => setShowCreateInvoiceModal(false)} className="px-5 py-2.5 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer bg-white">Cancel</button>
              <button onClick={() => setShowCreateInvoiceModal(false)} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[13px] font-semibold transition-colors cursor-pointer shadow-lg shadow-indigo-200">Save</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Send Message Modal */}
      {showSendMessageModal && createPortal(
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[1.5px] flex items-center justify-center z-[9999] p-4" onClick={() => setShowSendMessageModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[460px] max-h-[90vh] shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()} style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
            {/* Header */}
            <div className="px-7 pt-7 pb-5 flex justify-between items-start border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-[18px] font-extrabold text-slate-900 leading-tight">Send Message</h3>
              </div>
              <button onClick={() => setShowSendMessageModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1"><X size={18} strokeWidth={2} /></button>
            </div>

            {/* Body */}
            <div className="px-7 py-6 space-y-6 overflow-y-auto">
              <div>
                <label className="text-[13px] font-semibold text-slate-800 block mb-2">To</label>
                <div className="relative">
                  <select className="appearance-none w-full border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all bg-white cursor-pointer">
                    <option>Sarah Mitchell (Account Manager)</option>
                    <option>Mike Thompson (Admin)</option>
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-[13px] font-semibold text-slate-800 block mb-2">Message</label>
                <textarea rows={4} placeholder="Type your message here..." className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all placeholder-slate-300 text-slate-700 resize-none"></textarea>
              </div>
            </div>

            {/* Footer */}
            <div className="px-7 py-5 flex justify-end gap-3 border-t border-slate-100 shrink-0">
              <button onClick={() => setShowSendMessageModal(false)} className="px-5 py-2.5 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer bg-white">Cancel</button>
              <button onClick={() => setShowSendMessageModal(false)} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[13px] font-semibold transition-colors cursor-pointer shadow-lg shadow-indigo-200">Send</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Customer Details Modal */}
      {showEditCustomerModal && createPortal(
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[1.5px] flex items-center justify-center z-[9999] p-4" onClick={() => setShowEditCustomerModal(false)}>
          <form onSubmit={handleSaveEditCustomer} className="bg-white rounded-2xl w-full max-w-[460px] max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()} style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
            {/* Header */}
            <div className="px-7 pt-7 pb-5 flex justify-between items-start border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-[18px] font-extrabold text-slate-900 leading-tight">Edit Customer Details</h3>
              </div>
              <button type="button" onClick={() => setShowEditCustomerModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1"><X size={18} strokeWidth={2} /></button>
            </div>

            {/* Body */}
            <div className="px-7 py-6 space-y-6 overflow-y-auto">
              <div>
                <label className="text-[13px] font-semibold text-slate-800 block mb-2">Company Name</label>
                <input 
                  type="text" 
                  value={editCustomerForm.name} 
                  onChange={e => setEditCustomerForm({ ...editCustomerForm, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all text-slate-700" 
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-[13px] font-semibold text-slate-800 block mb-2">ABN</label>
                  <input 
                    type="text" 
                    value={editCustomerForm.abn} 
                    onChange={e => setEditCustomerForm({ ...editCustomerForm, abn: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all text-slate-700" 
                  />
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-slate-800 block mb-2">ACN</label>
                  <input 
                    type="text" 
                    value={editCustomerForm.acn} 
                    onChange={e => setEditCustomerForm({ ...editCustomerForm, acn: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all text-slate-700" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-[13px] font-semibold text-slate-800 block mb-2">Customer Type</label>
                  <div className="relative">
                    <select 
                      value={editCustomerForm.type} 
                      onChange={e => setEditCustomerForm({ ...editCustomerForm, type: e.target.value })}
                      className="appearance-none w-full border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all bg-white cursor-pointer"
                    >
                      <option value="Corporate">Corporate</option>
                      <option value="Business">Business</option>
                    </select>
                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-slate-800 block mb-2">Status</label>
                  <div className="relative">
                    <select 
                      value={editCustomerForm.status} 
                      onChange={e => setEditCustomerForm({ ...editCustomerForm, status: e.target.value })}
                      className="appearance-none w-full border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all bg-white cursor-pointer"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-[13px] font-semibold text-slate-800 block mb-2">Account Category</label>
                <div className="relative">
                  <select 
                    value={editCustomerForm.category} 
                    onChange={e => setEditCustomerForm({ ...editCustomerForm, category: e.target.value })}
                    className="appearance-none w-full border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all bg-white cursor-pointer"
                  >
                    <option value="Strategic Account">Strategic Account</option>
                    <option value="Standard Account">Standard Account</option>
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-[13px] font-semibold text-slate-800 block mb-2">Billing Terms</label>
                  <div className="relative">
                    <select 
                      value={editCustomerForm.billingTerms} 
                      onChange={e => setEditCustomerForm({ ...editCustomerForm, billingTerms: e.target.value })}
                      className="appearance-none w-full border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all bg-white cursor-pointer"
                    >
                      <option value="7 Days">7 Days</option>
                      <option value="14 Days">14 Days</option>
                      <option value="14 Days EOM">14 Days EOM</option>
                      <option value="30 Days EOM">30 Days EOM</option>
                    </select>
                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-slate-800 block mb-2">Credit Limit ($)</label>
                  <input 
                    type="number" 
                    value={editCustomerForm.creditLimit} 
                    onChange={e => setEditCustomerForm({ ...editCustomerForm, creditLimit: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all text-slate-700" 
                  />
                </div>
              </div>
              <div>
                <label className="text-[13px] font-semibold text-slate-800 block mb-2">Account Manager</label>
                <div className="relative">
                  <select 
                    value={editCustomerForm.manager} 
                    onChange={e => setEditCustomerForm({ ...editCustomerForm, manager: e.target.value })}
                    className="appearance-none w-full border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all bg-white cursor-pointer"
                  >
                    <option value="Sarah Mitchell">Sarah Mitchell</option>
                    <option value="Mike Thompson">Mike Thompson</option>
                    <option value="John Davis">John Davis</option>
                    <option value="Emily Rogers">Emily Rogers</option>
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-7 py-5 flex justify-end gap-3 border-t border-slate-100 shrink-0">
              <button type="button" onClick={() => setShowEditCustomerModal(false)} className="px-5 py-2.5 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer bg-white">Cancel</button>
              <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[13px] font-semibold transition-colors cursor-pointer shadow-lg shadow-indigo-200">Save</button>
            </div>
          </form>
        </div>,
        document.body
      )}

      {/* Assign Manager Modal */}
      {showAssignManagerModal && createPortal(
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[1.5px] flex items-center justify-center z-[9999] p-4" onClick={() => setShowAssignManagerModal(false)}>
          <form onSubmit={handleSaveAssignManager} className="bg-white rounded-2xl w-full max-w-[420px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()} style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
            {/* Header */}
            <div className="px-7 pt-7 pb-5 flex justify-between items-start border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-[18px] font-extrabold text-slate-900 leading-tight">Assign Account Manager</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">Select a manager for {assignManagerForm.name}</p>
              </div>
              <button type="button" onClick={() => setShowAssignManagerModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1"><X size={18} strokeWidth={2} /></button>
            </div>

            {/* Body */}
            <div className="px-7 py-6 space-y-4">
              <div>
                <label className="text-[13px] font-semibold text-slate-800 block mb-2">Account Manager</label>
                <div className="relative">
                  <select 
                    value={assignManagerForm.manager} 
                    onChange={e => setAssignManagerForm({ ...assignManagerForm, manager: e.target.value })}
                    className="appearance-none w-full border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all bg-white cursor-pointer"
                  >
                    <option value="Sarah Mitchell">Sarah Mitchell</option>
                    <option value="Mike Thompson">Mike Thompson</option>
                    <option value="John Davis">John Davis</option>
                    <option value="Emily Rogers">Emily Rogers</option>
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-7 py-5 flex justify-end gap-3 border-t border-slate-100 shrink-0">
              <button type="button" onClick={() => setShowAssignManagerModal(false)} className="px-5 py-2.5 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer bg-white">Cancel</button>
              <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[13px] font-semibold transition-colors cursor-pointer shadow-lg shadow-indigo-200">Assign</button>
            </div>
          </form>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && createPortal(
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[1.5px] flex items-center justify-center z-[9999] p-4" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[400px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()} style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
            {/* Header */}
            <div className="px-7 pt-7 pb-4 flex justify-between items-start shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 border border-red-100 shrink-0">
                  <Trash2 size={20} />
                </div>
                <div>
                  <h3 className="text-[16px] font-extrabold text-slate-900 leading-tight">Delete Customer</h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">This action cannot be undone.</p>
                </div>
              </div>
              <button onClick={() => setShowDeleteModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1"><X size={18} strokeWidth={2} /></button>
            </div>

            {/* Body */}
            <div className="px-7 py-4">
              <p className="text-[13px] font-medium text-slate-600 leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-slate-900">{deleteCustomerForm.name}</span>? All associated data, loads history, and settings will be permanently removed.
              </p>
            </div>

            {/* Footer */}
            <div className="px-7 py-5 flex justify-end gap-3 border-t border-slate-100 shrink-0 bg-slate-50/50 mt-4">
              <button onClick={() => setShowDeleteModal(false)} className="px-5 py-2.5 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer bg-white">Cancel</button>
              <button onClick={handleConfirmDelete} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[13px] font-semibold transition-colors cursor-pointer shadow-lg shadow-red-200">Delete Customer</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Add New Contact Modal */}
      {showAddContactModal && createPortal(
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[9999] p-4" onClick={() => setShowAddContactModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[460px] shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()} style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
            {/* Header */}
            <div className="px-7 pt-7 pb-5 flex justify-between items-center border-b border-slate-100 shrink-0">
              <h3 className="text-[20px] font-extrabold text-slate-900">Add New Contact</h3>
              <button onClick={() => setShowAddContactModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1"><X size={20} strokeWidth={2} /></button>
            </div>

            {/* Body */}
            <div className="px-7 py-6 space-y-5">
              {/* First + Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[13px] font-semibold text-slate-800 block mb-2">First Name</label>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={draftContact.firstName}
                    onChange={e => setDraftContact({...draftContact, firstName: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all placeholder-slate-300 text-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-slate-800 block mb-2">Last Name</label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={draftContact.lastName}
                    onChange={e => setDraftContact({...draftContact, lastName: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all placeholder-slate-300 text-slate-700"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="text-[13px] font-semibold text-slate-800 block mb-2">Role / Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Accounts Manager"
                  value={draftContact.role}
                  onChange={e => setDraftContact({...draftContact, role: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all placeholder-slate-300 text-slate-700"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-[13px] font-semibold text-slate-800 block mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="email@company.com"
                  value={draftContact.email}
                  onChange={e => setDraftContact({...draftContact, email: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all placeholder-slate-300 text-slate-700"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-[13px] font-semibold text-slate-800 block mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="0400 000 000"
                  value={draftContact.phone}
                  onChange={e => setDraftContact({...draftContact, phone: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all placeholder-slate-300 text-slate-700"
                />
              </div>

              {/* Primary checkbox */}
              <div className="flex items-center gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="primaryContactCheck"
                  checked={draftContact.isPrimary}
                  onChange={e => setDraftContact({...draftContact, isPrimary: e.target.checked})}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 cursor-pointer accent-indigo-600"
                />
                <label htmlFor="primaryContactCheck" className="text-[13px] font-medium text-slate-700 cursor-pointer select-none">Set as Primary Contact</label>
              </div>
            </div>

            {/* Footer */}
            <div className="px-7 py-5 flex justify-end gap-3 border-t border-slate-100 shrink-0">
              <button
                onClick={() => setShowAddContactModal(false)}
                className="px-6 py-2.5 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer bg-white"
              >Cancel</button>
              <button
                onClick={() => {
                  if (!draftContact.firstName.trim()) return;
                  const newContact = {
                    id: Date.now(),
                    firstName: draftContact.firstName.trim(),
                    lastName: draftContact.lastName.trim(),
                    role: draftContact.role.trim() || 'Contact',
                    email: draftContact.email.trim(),
                    phone: draftContact.phone.trim(),
                    isPrimary: draftContact.isPrimary,
                  };
                  const updatedContacts = draftContact.isPrimary
                    ? [newContact, ...contacts.map(c => ({...c, isPrimary: false}))]
                    : [...contacts, newContact];
                  setContacts(updatedContacts);
                  setShowAddContactModal(false);
                }}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[13px] font-semibold transition-colors cursor-pointer shadow-lg shadow-indigo-200"
              >Save</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Upload Document Modal */}
      {showUploadDocumentModal && createPortal(
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[1.5px] flex items-center justify-center z-[9999] p-4" onClick={() => setShowUploadDocumentModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[460px] max-h-[90vh] shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()} style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
            {/* Header */}
            <div className="px-7 pt-7 pb-5 flex justify-between items-start border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-[18px] font-extrabold text-slate-900 leading-tight">Upload Document</h3>
              </div>
              <button onClick={() => setShowUploadDocumentModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1"><X size={18} strokeWidth={2} /></button>
            </div>

            {/* Body */}
            <div className="px-7 py-6 space-y-5 overflow-y-auto">
              {/* Drop Zone */}
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/40 rounded-xl py-10 px-6 flex flex-col items-center justify-center gap-3 hover:bg-indigo-50 hover:border-indigo-300 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <Upload size={22} className="text-indigo-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-[14px] font-bold text-slate-800">Click to browse or drag file here</p>
                    <p className="text-[12px] font-normal text-slate-400 mt-1">Supports PDF, JPG, PNG up to 10MB</p>
                  </div>
                </div>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
              </label>

              {/* Document Type */}
              <div>
                <label className="text-[13px] font-semibold text-slate-800 block mb-2">Document Type</label>
                <div className="relative">
                  <select className="appearance-none w-full border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all bg-white cursor-pointer">
                    <option>Contract</option>
                    <option>Invoice</option>
                    <option>Insurance Certificate</option>
                    <option>Rate Card</option>
                    <option>Agreement</option>
                    <option>Other</option>
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-7 py-5 flex justify-end gap-3 border-t border-slate-100 shrink-0">
              <button onClick={() => setShowUploadDocumentModal(false)} className="px-5 py-2.5 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer bg-white">Cancel</button>
              <button onClick={() => setShowUploadDocumentModal(false)} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[13px] font-semibold transition-colors cursor-pointer shadow-lg shadow-indigo-200">Save</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Company Information Modal */}
      {showEditCompanyInfoModal && createPortal(
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[9999] p-4" onClick={() => setShowEditCompanyInfoModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[500px] max-h-[90vh] shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()} style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
            {/* Header */}
            <div className="px-7 pt-7 pb-5 flex justify-between items-center border-b border-slate-100 shrink-0">
              <h3 className="text-[18px] font-extrabold text-slate-900">Edit Section</h3>
              <button onClick={() => setShowEditCompanyInfoModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1"><X size={18} strokeWidth={2} /></button>
            </div>

            {/* Body */}
            <div className="px-7 py-6 overflow-y-auto">
              <p className="text-[13px] text-slate-500 font-normal mb-5">Make changes to the Section section.</p>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">Trading Name</label>
                  <input type="text" value={draftCompanyInfo.tradingName || ''} onChange={e => setDraftCompanyInfo({...draftCompanyInfo, tradingName: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all text-slate-800" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">Phone</label>
                  <input type="text" value={draftCompanyInfo.phone || ''} onChange={e => setDraftCompanyInfo({...draftCompanyInfo, phone: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all text-slate-800" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">ABN</label>
                  <input type="text" value={draftCompanyInfo.abn || ''} onChange={e => setDraftCompanyInfo({...draftCompanyInfo, abn: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all text-slate-800" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">Email</label>
                  <input type="email" value={draftCompanyInfo.email || ''} onChange={e => setDraftCompanyInfo({...draftCompanyInfo, email: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all text-slate-800" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">ACN</label>
                  <input type="text" value={draftCompanyInfo.acn || ''} onChange={e => setDraftCompanyInfo({...draftCompanyInfo, acn: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all text-slate-800" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">Website</label>
                  <input type="text" value={draftCompanyInfo.website || ''} onChange={e => setDraftCompanyInfo({...draftCompanyInfo, website: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all text-slate-800" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">Industry</label>
                  <input type="text" value={draftCompanyInfo.industry || ''} onChange={e => setDraftCompanyInfo({...draftCompanyInfo, industry: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all text-slate-800" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">Customer Since</label>
                  <input type="text" value={draftCompanyInfo.customerSince || ''} onChange={e => setDraftCompanyInfo({...draftCompanyInfo, customerSince: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all text-slate-800" />
                </div>
              </div>
              <div className="mb-2">
                <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">Address</label>
                <textarea rows={3} value={draftCompanyInfo.address || ''} onChange={e => setDraftCompanyInfo({...draftCompanyInfo, address: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all text-slate-800 resize-none" />
              </div>
            </div>

            {/* Footer */}
            <div className="px-7 py-5 flex justify-end gap-3 border-t border-slate-100 shrink-0">
              <button onClick={() => setShowEditCompanyInfoModal(false)} className="px-5 py-2.5 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer bg-white">Cancel</button>
              <button
                onClick={() => { setCompanyInfo({...draftCompanyInfo}); setShowEditCompanyInfoModal(false); }}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[13px] font-semibold transition-colors cursor-pointer shadow-lg shadow-indigo-200"
              >Save</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Notes & Tags Modal */}
      {showEditNotesTagsModal && createPortal(
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[9999] p-4" onClick={() => setShowEditNotesTagsModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[500px] max-h-[90vh] shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()} style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
            {/* Header */}
            <div className="px-7 pt-7 pb-5 flex justify-between items-center border-b border-slate-100 shrink-0">
              <h3 className="text-[18px] font-extrabold text-slate-900">Edit Section</h3>
              <button onClick={() => setShowEditNotesTagsModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1"><X size={18} strokeWidth={2} /></button>
            </div>

            {/* Body */}
            <div className="px-7 py-6 space-y-6 overflow-y-auto">
              <p className="text-[13px] text-slate-500 font-normal -mt-2">Make changes to the Section section.</p>

              {/* Internal Notes */}
              <div>
                <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block mb-2">Internal Notes</label>
                <textarea
                  rows={5}
                  value={draftNotes}
                  onChange={e => setDraftNotes(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all text-slate-700 resize-none placeholder-slate-300"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {draftTags.map((tag, i) => {
                    const colors = [
                      { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100', x: 'text-indigo-400 hover:text-indigo-700' },
                      { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', x: 'text-amber-400 hover:text-amber-700' },
                      { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', x: 'text-emerald-400 hover:text-emerald-700' },
                      { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', x: 'text-slate-400 hover:text-slate-700' },
                      { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100', x: 'text-rose-400 hover:text-rose-700' },
                      { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100', x: 'text-purple-400 hover:text-purple-700' },
                    ];
                    const c = colors[i % colors.length];
                    return (
                      <span key={i} className={`flex items-center gap-1.5 px-2.5 py-1 ${c.bg} ${c.text} rounded-md text-[11px] font-bold border ${c.border}`}>
                        {tag}
                        <button onClick={() => setDraftTags(draftTags.filter((_, idx) => idx !== i))} className={`${c.x} cursor-pointer leading-none ml-0.5`}>×</button>
                      </span>
                    );
                  })}
                </div>
                <input
                  type="text"
                  value={newTagInput}
                  onChange={e => setNewTagInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && newTagInput.trim()) {
                      setDraftTags([...draftTags, newTagInput.trim()]);
                      setNewTagInput('');
                    }
                  }}
                  placeholder="Add a new tag and press Enter..."
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all placeholder-slate-300 text-slate-700"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-7 py-5 flex justify-end gap-3 border-t border-slate-100 shrink-0">
              <button
                onClick={() => setShowEditNotesTagsModal(false)}
                className="px-5 py-2.5 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer bg-white"
              >Cancel</button>
              <button
                onClick={() => {
                  setInternalNotes(draftNotes);
                  setCustomerTags(draftTags);
                  setShowEditNotesTagsModal(false);
                }}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[13px] font-semibold transition-colors cursor-pointer shadow-lg shadow-indigo-200"
              >Save</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Special Instructions Modal */}
      {showEditSpecialInstructionsModal && createPortal(
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[9999] p-4" onClick={() => setShowEditSpecialInstructionsModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[500px] shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()} style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
            {/* Header */}
            <div className="px-7 pt-7 pb-5 flex justify-between items-center border-b border-slate-100 shrink-0">
              <h3 className="text-[18px] font-extrabold text-slate-900">Edit Section</h3>
              <button onClick={() => setShowEditSpecialInstructionsModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1"><X size={18} strokeWidth={2} /></button>
            </div>

            {/* Body */}
            <div className="px-7 py-6">
              <p className="text-[13px] text-slate-500 font-normal mb-5">Make changes to the Section section.</p>
              
              <textarea
                rows={6}
                value={draftSpecialInstructions}
                onChange={e => setDraftSpecialInstructions(e.target.value)}
                placeholder="Existing content..."
                className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all text-slate-700 resize-none placeholder-slate-400"
              />
            </div>

            {/* Footer */}
            <div className="px-7 py-5 flex justify-end gap-3 border-t border-slate-100 shrink-0">
              <button
                onClick={() => setShowEditSpecialInstructionsModal(false)}
                className="px-6 py-2.5 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer bg-white"
              >Cancel</button>
              <button
                onClick={() => {
                  setSpecialInstructions(draftSpecialInstructions);
                  setShowEditSpecialInstructionsModal(false);
                }}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[13px] font-semibold transition-colors cursor-pointer shadow-lg shadow-indigo-200"
              >Save</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      </>
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
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer flex-grow sm:flex-grow-0 justify-center">
            <Plus size={14} /> Add Customer
          </button>
          <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer flex-grow sm:flex-grow-0 justify-center">
            Import
          </button>
          <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer flex-grow sm:flex-grow-0 justify-center">
            Export
          </button>
          
          <div className="relative shrink-0">
            <button 
              onClick={() => setShowMainHeaderMenu(!showMainHeaderMenu)} 
              className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-all shadow-sm cursor-pointer"
            >
              <MoreVertical size={16} />
            </button>
            
            {showMainHeaderMenu && (
              <>
                <div className="fixed inset-0 z-[90]" onClick={() => setShowMainHeaderMenu(false)}></div>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-[100] py-2">
                  <button onClick={() => setShowMainHeaderMenu(false)} className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer">
                    Manage Billing Rules
                  </button>
                  <button onClick={() => setShowMainHeaderMenu(false)} className="w-full text-left px-4 py-2.5 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer">
                    View Permissions
                  </button>
                </div>
              </>
            )}
          </div>
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-slate-100 bg-slate-50/50 gap-3">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">38 customers found</span>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-xs hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer flex-grow sm:flex-grow-0 justify-center">
                  <Package size={12} /> Columns
                </button>
                <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-xs hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer flex-grow sm:flex-grow-0 justify-center">
                  <List size={12} /> Group By
                </button>
                <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-xs hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer flex-grow sm:flex-grow-0 justify-center">
                  <ChevronDown size={12} /> Sort By: Created Date
                </button>
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs whitespace-nowrap min-w-[1000px]">
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
                            <button onClick={() => openEditCustomer(c)} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer">
                              <Edit size={14} className="text-slate-400" /> Edit Customer
                            </button>
                            <button onClick={() => openAssignManager(c)} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer">
                              <UserCircle size={14} className="text-slate-400" /> Assign Manager
                            </button>
                            <div className="my-1 border-t border-slate-50"></div>
                            <button onClick={() => openDeleteCustomer(c)} className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer">
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

      {/* Edit Customer Details Modal (List View) */}
      {showEditCustomerModal && createPortal(
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[1.5px] flex items-center justify-center z-[9999] p-4" onClick={() => setShowEditCustomerModal(false)}>
          <form onSubmit={handleSaveEditCustomer} className="bg-white rounded-2xl w-full max-w-[460px] max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()} style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
            {/* Header */}
            <div className="px-7 pt-7 pb-5 flex justify-between items-start border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-[18px] font-extrabold text-slate-900 leading-tight">Edit Customer Details</h3>
              </div>
              <button type="button" onClick={() => setShowEditCustomerModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1"><X size={18} strokeWidth={2} /></button>
            </div>

            {/* Body */}
            <div className="px-7 py-6 space-y-6 overflow-y-auto">
              <div>
                <label className="text-[13px] font-semibold text-slate-800 block mb-2">Company Name</label>
                <input 
                  type="text" 
                  value={editCustomerForm.name} 
                  onChange={e => setEditCustomerForm({ ...editCustomerForm, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all text-slate-700" 
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-[13px] font-semibold text-slate-800 block mb-2">ABN</label>
                  <input 
                    type="text" 
                    value={editCustomerForm.abn} 
                    onChange={e => setEditCustomerForm({ ...editCustomerForm, abn: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all text-slate-700" 
                  />
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-slate-800 block mb-2">ACN</label>
                  <input 
                    type="text" 
                    value={editCustomerForm.acn} 
                    onChange={e => setEditCustomerForm({ ...editCustomerForm, acn: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all text-slate-700" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-[13px] font-semibold text-slate-800 block mb-2">Customer Type</label>
                  <div className="relative">
                    <select 
                      value={editCustomerForm.type} 
                      onChange={e => setEditCustomerForm({ ...editCustomerForm, type: e.target.value })}
                      className="appearance-none w-full border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all bg-white cursor-pointer"
                    >
                      <option value="Corporate">Corporate</option>
                      <option value="Business">Business</option>
                    </select>
                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-slate-800 block mb-2">Status</label>
                  <div className="relative">
                    <select 
                      value={editCustomerForm.status} 
                      onChange={e => setEditCustomerForm({ ...editCustomerForm, status: e.target.value })}
                      className="appearance-none w-full border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all bg-white cursor-pointer"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-[13px] font-semibold text-slate-800 block mb-2">Account Category</label>
                <div className="relative">
                  <select 
                    value={editCustomerForm.category} 
                    onChange={e => setEditCustomerForm({ ...editCustomerForm, category: e.target.value })}
                    className="appearance-none w-full border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all bg-white cursor-pointer"
                  >
                    <option value="Strategic Account">Strategic Account</option>
                    <option value="Standard Account">Standard Account</option>
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-[13px] font-semibold text-slate-800 block mb-2">Billing Terms</label>
                  <div className="relative">
                    <select 
                      value={editCustomerForm.billingTerms} 
                      onChange={e => setEditCustomerForm({ ...editCustomerForm, billingTerms: e.target.value })}
                      className="appearance-none w-full border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all bg-white cursor-pointer"
                    >
                      <option value="7 Days">7 Days</option>
                      <option value="14 Days">14 Days</option>
                      <option value="14 Days EOM">14 Days EOM</option>
                      <option value="30 Days EOM">30 Days EOM</option>
                    </select>
                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-slate-800 block mb-2">Credit Limit ($)</label>
                  <input 
                    type="number" 
                    value={editCustomerForm.creditLimit} 
                    onChange={e => setEditCustomerForm({ ...editCustomerForm, creditLimit: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all text-slate-700" 
                  />
                </div>
              </div>
              <div>
                <label className="text-[13px] font-semibold text-slate-800 block mb-2">Account Manager</label>
                <div className="relative">
                  <select 
                    value={editCustomerForm.manager} 
                    onChange={e => setEditCustomerForm({ ...editCustomerForm, manager: e.target.value })}
                    className="appearance-none w-full border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all bg-white cursor-pointer"
                  >
                    <option value="Sarah Mitchell">Sarah Mitchell</option>
                    <option value="Mike Thompson">Mike Thompson</option>
                    <option value="John Davis">John Davis</option>
                    <option value="Emily Rogers">Emily Rogers</option>
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-7 py-5 flex justify-end gap-3 border-t border-slate-100 shrink-0">
              <button type="button" onClick={() => setShowEditCustomerModal(false)} className="px-5 py-2.5 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer bg-white">Cancel</button>
              <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[13px] font-semibold transition-colors cursor-pointer shadow-lg shadow-indigo-200">Save</button>
            </div>
          </form>
        </div>,
        document.body
      )}

      {/* Assign Manager Modal (List View) */}
      {showAssignManagerModal && createPortal(
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[1.5px] flex items-center justify-center z-[9999] p-4" onClick={() => setShowAssignManagerModal(false)}>
          <form onSubmit={handleSaveAssignManager} className="bg-white rounded-2xl w-full max-w-[420px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()} style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
            {/* Header */}
            <div className="px-7 pt-7 pb-5 flex justify-between items-start border-b border-slate-100 shrink-0">
              <div>
                <h3 className="text-[18px] font-extrabold text-slate-900 leading-tight">Assign Account Manager</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">Select a manager for {assignManagerForm.name}</p>
              </div>
              <button type="button" onClick={() => setShowAssignManagerModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1"><X size={18} strokeWidth={2} /></button>
            </div>

            {/* Body */}
            <div className="px-7 py-6 space-y-4">
              <div>
                <label className="text-[13px] font-semibold text-slate-800 block mb-2">Account Manager</label>
                <div className="relative">
                  <select 
                    value={assignManagerForm.manager} 
                    onChange={e => setAssignManagerForm({ ...assignManagerForm, manager: e.target.value })}
                    className="appearance-none w-full border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all bg-white cursor-pointer"
                  >
                    <option value="Sarah Mitchell">Sarah Mitchell</option>
                    <option value="Mike Thompson">Mike Thompson</option>
                    <option value="John Davis">John Davis</option>
                    <option value="Emily Rogers">Emily Rogers</option>
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-7 py-5 flex justify-end gap-3 border-t border-slate-100 shrink-0">
              <button type="button" onClick={() => setShowAssignManagerModal(false)} className="px-5 py-2.5 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer bg-white">Cancel</button>
              <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[13px] font-semibold transition-colors cursor-pointer shadow-lg shadow-indigo-200">Assign</button>
            </div>
          </form>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal (List View) */}
      {showDeleteModal && createPortal(
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[1.5px] flex items-center justify-center z-[9999] p-4" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[400px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()} style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
            {/* Header */}
            <div className="px-7 pt-7 pb-4 flex justify-between items-start shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-650 border border-red-105 shrink-0">
                  <Trash2 size={20} />
                </div>
                <div>
                  <h3 className="text-[16px] font-extrabold text-slate-900 leading-tight">Delete Customer</h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">This action cannot be undone.</p>
                </div>
              </div>
              <button onClick={() => setShowDeleteModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1"><X size={18} strokeWidth={2} /></button>
            </div>

            {/* Body */}
            <div className="px-7 py-4">
              <p className="text-[13px] font-medium text-slate-600 leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-slate-900">{deleteCustomerForm.name}</span>? All associated data, loads history, and settings will be permanently removed.
              </p>
            </div>

            {/* Footer */}
            <div className="px-7 py-5 flex justify-end gap-3 border-t border-slate-100 shrink-0 bg-slate-50/50 mt-4">
              <button onClick={() => setShowDeleteModal(false)} className="px-5 py-2.5 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer bg-white">Cancel</button>
              <button onClick={handleConfirmDelete} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[13px] font-semibold transition-colors cursor-pointer shadow-lg shadow-red-200">Delete Customer</button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
