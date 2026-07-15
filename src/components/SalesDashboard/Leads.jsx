import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Mail, Phone, ChevronRight, X, Sparkles, 
  Edit3, Trash2, Bell, ShieldCheck, ChevronDown, Check, 
  DollarSign, Building, Truck, RefreshCw, Layers 
} from 'lucide-react';
import { crmRepository } from '../../services/crmRepository';
import { crmStore } from '../../services/crmStore';
import { crmWorkflowEngine } from '../../services/crmEngines';

export default function Leads() {
  // Database States loaded from localStorage crmStore
  const [leads, setLeads] = useState([]);
  
  // UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('ALL');
  const [nicheFilter, setNicheFilter] = useState('All Transport Niches');
  const [fleetFilter, setFleetFilter] = useState('All Fleet Sizes');
  const [activeRole, setActiveRole] = useState('Sales Director');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState(null);
  
  // Modal states
  const [showModal, setShowModal] = useState(null); // 'add' | 'edit' | null
  const [modalForm, setModalForm] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    fleetSize: 20,
    niche: 'General Freight',
    revenue: 2500,
    stage: 'New Lead',
    score: 60,
    rep: 'Alex Wright',
    notes: ''
  });
  
  // Toast feedback state
  const [toast, setToast] = useState(null);

  // Subscribe to crmStore changes to ensure reactive localStorage binding
  useEffect(() => {
    // Initial fetch
    setLeads(crmRepository.getLeads());
    
    // Subscribe to store mutations
    const unsubscribe = crmStore.subscribe(() => {
      const freshLeads = crmRepository.getLeads();
      setLeads(freshLeads);
    });
    
    return () => unsubscribe();
  }, []);

  // Sync selectedLead on updates
  useEffect(() => {
    if (selectedLead) {
      const updated = leads.find(l => l.id === selectedLead.id);
      if (updated) {
        setSelectedLead(updated);
      } else {
        setSelectedLead(null);
      }
    }
  }, [leads, selectedLead]);

  // Toast auto-clear
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // List of available niches
  const niches = [
    'Car Carrying',
    'General Freight',
    'Dangerous Goods',
    'Refrigerated',
    'Flatbed',
    'Container'
  ];

  // List of available reps
  const repsList = ['Alex Wright', 'Sarah K.', 'Michael Scott', 'Jan Levinson', 'Ryan Howard'];

  // Handle stage update via sidebar dropdown
  const handleUpdateStage = (id, newStage) => {
    crmWorkflowEngine.handleStageChange(id, newStage, 'Manual lifecycle update via Inspector');
    setToast({ type: 'success', text: `Stage transitioned to ${newStage} successfully.` });
  };

  // Delete lead handler
  const handleDeleteLead = (id, companyName) => {
    if (window.confirm(`Are you sure you want to delete lead for ${companyName}?`)) {
      crmRepository.deleteLead(id);
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead(null);
      }
      setToast({ type: 'error', text: `${companyName} lead deleted.` });
    }
  };

  // Open Edit Modal prefilled
  const openEditModal = (lead) => {
    setModalForm({
      company: lead.company,
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '555-0100',
      fleetSize: lead.fleetSize || 10,
      niche: lead.niche || 'General Freight',
      revenue: lead.revenue || 1500,
      stage: lead.stage || 'New Lead',
      score: lead.score || 60,
      rep: lead.rep || 'Alex Wright',
      notes: lead.notes || ''
    });
    setShowModal('edit');
  };

  // Open Add Modal empty
  const openAddModal = () => {
    setModalForm({
      company: '',
      name: '',
      email: '',
      phone: '',
      fleetSize: 15,
      niche: 'General Freight',
      revenue: 1999,
      stage: 'New Lead',
      score: 60,
      rep: repsList[Math.floor(Math.random() * repsList.length)],
      notes: ''
    });
    setShowModal('add');
  };

  // Form submit handler
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!modalForm.company || !modalForm.name || !modalForm.email) {
      alert('Please fill out all required fields.');
      return;
    }

    if (showModal === 'add') {
      const newLead = crmRepository.createLead(modalForm);
      setToast({ type: 'success', text: `Intake success for ${modalForm.company}.` });
      // If stage wasn't default, trigger workflow engine stage update
      if (modalForm.stage !== 'New Lead') {
        crmWorkflowEngine.handleStageChange(newLead.id, modalForm.stage, 'Initial custom intake stage');
      }
    } else if (showModal === 'edit') {
      if (selectedLead) {
        crmRepository.updateLead(selectedLead.id, modalForm);
        // Stage trigger workflow if edited stage is different
        if (selectedLead.stage !== modalForm.stage) {
          crmWorkflowEngine.handleStageChange(selectedLead.id, modalForm.stage, 'Lifecycle stage updated via lead editor form');
        }
        setToast({ type: 'success', text: `Lead profile for ${modalForm.company} updated.` });
      }
    }

    setShowModal(null);
  };

  // Provision Trial Sandbox handler
  const handleProvisionTrial = (lead) => {
    crmWorkflowEngine.handleStageChange(lead.id, 'Trial Started', 'Sandbox demo workspace provisioned');
    setToast({ type: 'success', text: `SaaS Trial workspace provisioned for ${lead.company}.` });
  };

  // Filters logic
  const filteredLeads = leads.filter(lead => {
    // 1. Search filter
    const searchString = `${lead.company} ${lead.name} ${lead.email}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());
    
    // 2. Tab Filter
    let matchesTab = true;
    if (selectedTab === 'MY LEADS') {
      if (activeRole === 'Sales Director') {
        // Sales director owns Alex Wright leads by default in mock
        matchesTab = lead.rep === 'Alex Wright';
      } else {
        matchesTab = lead.rep === activeRole;
      }
    } else if (selectedTab === 'HIGH VALUE') {
      matchesTab = lead.revenue >= 5000;
    } else if (selectedTab === 'HOT LEADS') {
      matchesTab = lead.score >= 80;
    } else if (selectedTab === 'DEMO PENDING') {
      matchesTab = lead.stage === 'Demo Booked' || lead.stage === 'Demo Completed';
    } else if (selectedTab === 'PROPOSAL PENDING') {
      matchesTab = lead.stage === 'Proposal Sent' || lead.stage === 'Negotiation';
    } else if (selectedTab === 'WON') {
      matchesTab = lead.stage === 'Won';
    } else if (selectedTab === 'LOST') {
      matchesTab = lead.stage === 'Lost';
    }

    // 3. Niche dropdown filter
    let matchesNiche = true;
    if (nicheFilter !== 'All Transport Niches') {
      matchesNiche = lead.niche === nicheFilter;
    }

    // 4. Fleet dropdown filter
    let matchesFleet = true;
    if (fleetFilter !== 'All Fleet Sizes') {
      if (fleetFilter === 'Small (< 50 Trucks)') {
        matchesFleet = lead.fleetSize < 50;
      } else if (fleetFilter === 'Medium (50-150 Trucks)') {
        matchesFleet = lead.fleetSize >= 50 && lead.fleetSize <= 150;
      } else if (fleetFilter === 'Large (150+ Trucks)') {
        matchesFleet = lead.fleetSize > 150;
      }
    }

    return matchesSearch && matchesTab && matchesNiche && matchesFleet;
  });

  // Pagination constants
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / ITEMS_PER_PAGE));
  
  // Adjust current page if filters shrink list size
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredLeads.length, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Return lifecycle badge color styles matching original console UI
  const getStageBadgeStyle = (stage) => {
    if (stage === 'Won') {
      return 'bg-emerald-50 border border-emerald-250 text-emerald-750';
    } else if (stage === 'Lost') {
      return 'bg-rose-50 border border-rose-250 text-rose-750';
    } else {
      // Vance Refrigeration has yellow/orange-ish colors for "New Lead", "Contacted", "Demo Booked", etc.
      return 'bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E]';
    }
  };

  // Return health score dot style
  const getHealthDotClass = (score) => {
    if (score >= 80) return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
    if (score >= 50) return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]';
    return 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
  };

  return (
    <div className="flex-grow bg-[#F8FAFC] p-6 space-y-6 overflow-y-auto w-full text-left font-sans flex flex-col h-full min-h-0">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-xl text-xs font-semibold animate-slide-in">
          {toast.type === 'success' ? (
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          ) : (
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
          )}
          {toast.text}
        </div>
      )}

      {/* Header Container */}
      <div className="flex justify-between items-center mb-2 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">
            Leads
          </h1>
          <p className="text-xs font-medium text-slate-500">
            Manage your leads and convert prospects.
          </p>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap sm:flex-nowrap">
          {/* Role selector dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] px-3.5 py-2 rounded-xl font-black transition-all hover:bg-amber-100 cursor-pointer shadow-xs whitespace-nowrap"
            >
              Role: {activeRole === 'Sales Director' ? 'Sales Director (Full Access)' : `${activeRole} (Sales Rep)`}
              <ChevronDown className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            </button>
            
            {showRoleDropdown && (
              <div className="absolute right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 text-xs text-slate-700">
                <div className="px-3 py-1 text-[9px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">Select Session Identity</div>
                <button 
                  onClick={() => { setActiveRole('Sales Director'); setShowRoleDropdown(false); }}
                  className={`w-full px-3 py-2 text-left font-bold hover:bg-slate-50 flex items-center justify-between ${activeRole === 'Sales Director' ? 'text-amber-700 bg-amber-50/50' : ''}`}
                >
                  Sales Director (Full Access)
                  {activeRole === 'Sales Director' && <Check className="w-3.5 h-3.5" />}
                </button>
                {repsList.map(rep => (
                  <button 
                    key={rep}
                    onClick={() => { setActiveRole(rep); setShowRoleDropdown(false); }}
                    className={`w-full px-3 py-2 text-left font-bold hover:bg-slate-50 flex items-center justify-between ${activeRole === rep ? 'text-amber-700 bg-amber-50/50' : ''}`}
                  >
                    {rep} (Sales Rep)
                    {activeRole === rep && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Indicator Bell */}
          <button className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-500 hover:text-slate-800 cursor-pointer relative shadow-xs shrink-0">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white"></span>
          </button>

          {/* Add New Lead button */}
          <button 
            onClick={openAddModal}
            className="flex-grow sm:flex-grow-0 bg-[#F59E0B] hover:bg-[#D97706] text-black font-extrabold text-xs px-4.5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0 stroke-[3px]" /> Add New Lead
          </button>
        </div>
      </div>

      {/* Tabs list row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        {[
          { key: 'ALL', label: 'ALL' },
          { key: 'MY LEADS', label: 'MY LEADS' },
          { key: 'HIGH VALUE', label: 'HIGH VALUE' },
          { key: 'HOT LEADS', label: 'HOT LEADS' },
          { key: 'DEMO PENDING', label: 'DEMO PENDING' },
          { key: 'PROPOSAL PENDING', label: 'PROPOSAL PENDING' },
          { key: 'WON', label: 'WON' },
          { key: 'LOST', label: 'LOST' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => { setSelectedTab(tab.key); setCurrentPage(1); }}
            className={`font-black text-[10px] tracking-wider uppercase px-4 py-2 rounded-xl transition-all shadow-xs shrink-0 border cursor-pointer ${
              selectedTab === tab.key 
                ? 'bg-[#F59E0B] text-black border-[#D97706]' 
                : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Primary Filters bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 border border-slate-200/80 rounded-2xl shadow-xs shrink-0">
        {/* Text search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search contact details."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-[#F59E0B] text-xs font-semibold rounded-xl focus:outline-none placeholder:text-slate-400 text-slate-800 transition-colors"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        </div>
        
        {/* Niche select */}
        <div>
          <select
            value={nicheFilter}
            onChange={(e) => { setNicheFilter(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-[#F59E0B] text-xs font-bold rounded-xl focus:outline-none cursor-pointer text-slate-700 transition-colors"
          >
            <option value="All Transport Niches">All Transport Niches</option>
            {niches.map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {/* Fleet size select */}
        <div>
          <select
            value={fleetFilter}
            onChange={(e) => { setFleetFilter(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-[#F59E0B] text-xs font-bold rounded-xl focus:outline-none cursor-pointer text-slate-700 transition-colors"
          >
            <option value="All Fleet Sizes">All Fleet Sizes</option>
            <option value="Small (< 50 Trucks)">Small (&lt; 50 Trucks)</option>
            <option value="Medium (50-150 Trucks)">Medium (50-150 Trucks)</option>
            <option value="Large (150+ Trucks)">Large (150+ Trucks)</option>
          </select>
        </div>
      </div>

      {/* Main Table + Drawer Grid Layout */}
      <div className="flex-grow flex flex-col lg:flex-row gap-6 min-h-0 items-stretch">
        
        {/* Table wrapper */}
        <div className="flex-1 bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between min-h-0">
          <div className="flex-grow overflow-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 select-none">
                  <th className="py-4 px-4 w-12 text-center">
                    <input type="checkbox" className="rounded text-amber-500 focus:ring-amber-400 cursor-pointer" />
                  </th>
                  <th className="py-4 px-4">Company</th>
                  <th className="py-4 px-4">Primary Contact</th>
                  <th className="py-4 px-4">Niche / Fleet</th>
                  <th className="py-4 px-4">Estimated Revenue</th>
                  <th className="py-4 px-4">Health / Score</th>
                  <th className="py-4 px-4">Aging (Days)</th>
                  <th className="py-4 px-4">Lifecycle Stage</th>
                  <th className="py-4 px-6 text-center w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
                {paginatedLeads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    onClick={() => setSelectedLead(lead)}
                    className={`cursor-pointer transition-colors border-l-2 ${
                      selectedLead && selectedLead.id === lead.id 
                        ? 'bg-amber-50/40 hover:bg-amber-50/60 border-l-[#F59E0B]' 
                        : 'hover:bg-slate-50/50 border-l-transparent'
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="rounded text-amber-500 focus:ring-amber-400 cursor-pointer" />
                    </td>
                    
                    {/* Company */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-900 font-extrabold">{lead.company}</span>
                        {/* High score sparkle star */}
                        {lead.score >= 80 && (
                          <Sparkles className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B] shrink-0" title="High Priority Lead" />
                        )}
                      </div>
                    </td>
                    
                    {/* Contact details */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="text-slate-800 font-bold leading-none mb-1">{lead.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium font-mono">{lead.email}</span>
                      </div>
                    </td>
                    
                    {/* Niche / Fleet */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="text-slate-700 font-bold leading-none mb-1">{lead.niche}</span>
                        <span className="text-[10px] text-slate-400 font-medium font-mono">{lead.fleetSize} Trucks</span>
                      </div>
                    </td>
                    
                    {/* Revenue */}
                    <td className="py-4 px-4 text-slate-900 font-mono font-extrabold text-sm">
                      ${Number(lead.revenue).toLocaleString()}/mo
                    </td>
                    
                    {/* Health score */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full inline-block ${getHealthDotClass(lead.score)}`}></span>
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-mono font-extrabold leading-none">{lead.score}</span>
                          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">score</span>
                        </div>
                      </div>
                    </td>
                    
                    {/* Aging */}
                    <td className={`py-4 px-4 font-mono font-bold ${lead.stageDays >= 15 ? 'text-rose-500 font-extrabold' : 'text-slate-400'}`}>
                      {lead.stageDays || 0} Days
                    </td>
                    
                    {/* Stage badge */}
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider inline-block text-center ${getStageBadgeStyle(lead.stage)}`}>
                        {lead.stage}
                      </span>
                    </td>
                    
                    {/* Actions */}
                    <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openEditModal(lead)}
                          className="p-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer transition-colors shadow-xs"
                          title="Edit Lead"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteLead(lead.id, lead.company)}
                          className="p-1.5 border border-slate-200 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg cursor-pointer transition-colors shadow-xs"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan="9" className="py-12 text-center text-slate-400 font-bold text-xs uppercase tracking-wider select-none">
                      No matching leads found in CRM database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table pagination footer */}
          <div className="shrink-0 flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3">
            <span className="text-[10px] font-black text-slate-450 uppercase tracking-widest">
              PAGE {currentPage} OF {totalPages}
            </span>
            <div className="flex items-center gap-1">
              {/* Prev page */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-2 border border-slate-250 bg-white hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                &lt;
              </button>
              
              {/* Numbers */}
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg border text-xs font-black transition-all cursor-pointer ${
                    currentPage === i + 1
                      ? 'bg-[#F59E0B] text-black border-[#D97706] shadow-sm'
                      : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-250'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              {/* Next page */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-2 border border-slate-250 bg-white hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>

        {/* Selected Lead Drawer (inspector side panel) */}
        {selectedLead && (
          <div className="w-full lg:w-96 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between shrink-0 text-slate-600 animate-slide-in">
            <div className="space-y-5">
              {/* Drawer Header */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase tracking-wider border border-amber-250">
                      CRM INSPECTOR
                    </span>
                    {selectedLead.score >= 80 && (
                      <span className="text-[9px] font-extrabold text-amber-700 bg-amber-100/50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5 fill-amber-600 stroke-[3px]" /> HOT
                      </span>
                    )}
                  </div>
                  <h3 className="font-black text-slate-900 text-base mt-2 leading-tight">
                    {selectedLead.company}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-bold block mt-1 font-mono">ID: {selectedLead.id}</span>
                </div>
                <button 
                  onClick={() => setSelectedLead(null)} 
                  className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Lead Details Body */}
              <div className="space-y-4 text-xs font-bold">
                {/* Rep Assigned */}
                <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 font-extrabold uppercase text-[9px] tracking-wider">Account Executive</span>
                  <span className="text-slate-800 font-extrabold">{selectedLead.rep}</span>
                </div>

                {/* Primary Contact */}
                <div className="space-y-2">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Primary Point of Contact</label>
                  <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center uppercase shrink-0 border border-amber-200">
                      {selectedLead.name.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-slate-800 font-bold truncate leading-none mb-1">{selectedLead.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium font-mono truncate">{selectedLead.email}</div>
                    </div>
                  </div>
                </div>

                {/* Logistics Profile */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Fleet Profile</label>
                    <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] font-extrabold text-slate-700">
                      <Truck className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                      {selectedLead.fleetSize} Trucks
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Revenue Value</label>
                    <div className="flex items-center gap-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] font-extrabold text-slate-700 font-mono">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      {Number(selectedLead.revenue).toLocaleString()}/mo
                    </div>
                  </div>
                </div>

                {/* Lifecycle Transition Dropdown */}
                <div className="border-t border-slate-100 pt-4">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    Shift Lifecycle Stage
                  </label>
                  <div className="relative">
                    <select
                      value={selectedLead.stage}
                      onChange={(e) => handleUpdateStage(selectedLead.id, e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 hover:border-slate-350 focus:border-[#F59E0B] rounded-xl text-slate-850 cursor-pointer text-xs font-bold focus:outline-none transition-colors"
                    >
                      <option value="New Lead">New Lead</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Demo Booked">Demo Booked</option>
                      <option value="Demo Completed">Demo Completed</option>
                      <option value="Trial Started">Trial Started</option>
                      <option value="Proposal Sent">Proposal Sent</option>
                      <option value="Negotiation">Negotiation</option>
                      <option value="Won">Won</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </div>
                </div>
                
                {/* Notes/Pain Points */}
                {(selectedLead.painPoints || selectedLead.currentSoftware) && (
                  <div className="bg-amber-50/30 border border-amber-100 rounded-xl p-3 space-y-2 text-[11px]">
                    {selectedLead.currentSoftware && (
                      <div>
                        <span className="text-amber-800 font-bold">Current Software: </span>
                        <span className="text-slate-650 font-semibold">{selectedLead.currentSoftware}</span>
                      </div>
                    )}
                    {selectedLead.painPoints && (
                      <div>
                        <span className="text-amber-800 font-bold">Pain Points: </span>
                        <span className="text-slate-650 font-semibold">{selectedLead.painPoints}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Trial provisioning CTAs */}
            <div className="pt-4 border-t border-slate-100 space-y-2 shrink-0">
              {selectedLead.stage !== 'Trial Started' && selectedLead.stage !== 'Won' && selectedLead.stage !== 'Lost' ? (
                <button 
                  onClick={() => handleProvisionTrial(selectedLead)}
                  className="w-full bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] border border-[#FDE68A] font-extrabold text-xs py-3 rounded-xl transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                >
                  <Layers className="w-4 h-4" /> Provision Trial Sandbox
                </button>
              ) : (
                <div className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-center text-[10px] text-slate-400 font-black uppercase tracking-wider">
                  Sandbox Active / Stage Frozen
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fade-in">
          <div className="bg-white rounded-[16px] w-full max-w-[560px] overflow-hidden shadow-2xl text-left flex flex-col max-h-[95vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white shrink-0">
              <h3 className="text-[17px] font-bold text-slate-900 tracking-tight">
                Register Inbound Carrier Lead
              </h3>
              <button 
                onClick={() => setShowModal(null)} 
                className="text-slate-500 hover:text-slate-700 cursor-pointer p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 stroke-[2]" />
              </button>
            </div>

            {/* Modal Form Scrollable body (hidden scrollbar) */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-3 text-xs font-semibold text-slate-700 overflow-y-auto flex-grow bg-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {/* Column 1 */}
                {/* Company Legal Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    COMPANY LEGAL NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={modalForm.company || ''}
                    onChange={(e) => setModalForm({ ...modalForm, company: e.target.value })}
                    placeholder="e.g. Vance Refrigeration"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-slate-400 rounded-[10px] focus:outline-none text-slate-800 placeholder:text-slate-400 font-medium text-[13px]"
                  />
                </div>
                
                {/* Contact Person Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    CONTACT PERSON NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={modalForm.name || ''}
                    onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                    placeholder="e.g. Robert Vance"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-slate-400 rounded-[10px] focus:outline-none text-slate-800 placeholder:text-slate-400 font-medium text-[13px]"
                  />
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    CONTACT EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={modalForm.email || ''}
                    onChange={(e) => setModalForm({ ...modalForm, email: e.target.value })}
                    placeholder="e.g. rvance@vance.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-slate-400 rounded-[10px] focus:outline-none text-slate-800 placeholder:text-slate-400 font-medium text-[13px]"
                  />
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    CONTACT PHONE
                  </label>
                  <input
                    type="text"
                    value={modalForm.phone || ''}
                    onChange={(e) => setModalForm({ ...modalForm, phone: e.target.value })}
                    placeholder="e.g. 555-9021"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-slate-400 rounded-[10px] focus:outline-none text-slate-800 placeholder:text-slate-400 font-medium text-[13px]"
                  />
                </div>

                {/* Fleet Size */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    FLEET SIZE (TRUCKS)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={modalForm.fleetSize || ''}
                    onChange={(e) => setModalForm({ ...modalForm, fleetSize: parseInt(e.target.value) || 0 })}
                    placeholder="25"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-slate-400 rounded-[10px] focus:outline-none text-slate-800 font-medium text-[13px]"
                  />
                </div>
                
                {/* Transport Niche */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    TRANSPORT NICHE
                  </label>
                  <select
                    value={modalForm.niche || 'General Freight'}
                    onChange={(e) => setModalForm({ ...modalForm, niche: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-slate-400 rounded-[10px] focus:outline-none text-slate-800 cursor-pointer font-medium text-[13px] appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23000\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                  >
                    <option value="General Freight">📦 General Freight</option>
                    <option value="Car Carrying">🚗 Car Carrying</option>
                    <option value="Dangerous Goods">⚠️ Dangerous Goods</option>
                    <option value="Refrigerated">❄️ Refrigerated</option>
                    <option value="Flatbed">🚛 Flatbed</option>
                    <option value="Container">🚢 Container</option>
                  </select>
                </div>

                {/* Revenue Estimate */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    REVENUE ESTIMATE ($/MO)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={modalForm.revenue || ''}
                    onChange={(e) => setModalForm({ ...modalForm, revenue: parseInt(e.target.value) || 0 })}
                    placeholder="2500"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-slate-400 rounded-[10px] focus:outline-none text-slate-800 font-medium text-[13px]"
                  />
                </div>

                {/* Assigned Agent Rep */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    ASSIGNED AGENT REP
                  </label>
                  <select
                    value={modalForm.rep || 'Alex Wright'}
                    onChange={(e) => setModalForm({ ...modalForm, rep: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-slate-400 rounded-[10px] focus:outline-none text-slate-800 cursor-pointer font-medium text-[13px] appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23000\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                  >
                    {repsList.map(rep => (
                      <option key={rep} value={rep}>{rep}</option>
                    ))}
                  </select>
                </div>

                {/* Current Software */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    CURRENT SOFTWARE
                  </label>
                  <input
                    type="text"
                    value={modalForm.currentSoftware || ''}
                    onChange={(e) => setModalForm({ ...modalForm, currentSoftware: e.target.value })}
                    placeholder="Spreadsheets (Excel)"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-slate-400 rounded-[10px] focus:outline-none text-slate-800 placeholder:text-slate-400 font-medium text-[13px]"
                  />
                </div>

                {/* Pain Points */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    PAIN POINTS
                  </label>
                  <input
                    type="text"
                    value={modalForm.painPoints || ''}
                    onChange={(e) => setModalForm({ ...modalForm, painPoints: e.target.value })}
                    placeholder="Manual routing takes hours"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-slate-400 rounded-[10px] focus:outline-none text-slate-800 placeholder:text-slate-400 font-medium text-[13px]"
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    PRIORITY
                  </label>
                  <select
                    value={modalForm.priority || 'Medium'}
                    onChange={(e) => setModalForm({ ...modalForm, priority: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-slate-400 rounded-[10px] focus:outline-none text-slate-800 cursor-pointer font-medium text-[13px] appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23000\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                  >
                    <option value="High">🔴 High</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="Low">🟢 Low</option>
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    TAGS
                  </label>
                  <input
                    type="text"
                    value={modalForm.tags || ''}
                    onChange={(e) => setModalForm({ ...modalForm, tags: e.target.value })}
                    placeholder="SaaS Inbound"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-slate-400 rounded-[10px] focus:outline-none text-slate-800 placeholder:text-slate-400 font-medium text-[13px]"
                  />
                </div>

                {/* Next Follow-Up Date */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    NEXT FOLLOW-UP DATE
                  </label>
                  <input
                    type="date"
                    value={modalForm.followUpDate || ''}
                    onChange={(e) => setModalForm({ ...modalForm, followUpDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-slate-400 rounded-[10px] focus:outline-none text-slate-800 font-medium text-[13px] cursor-pointer"
                  />
                </div>

                {/* Message Details / Notes */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    MESSAGE DETAILS / NOTES
                  </label>
                  <input
                    type="text"
                    value={modalForm.notes || ''}
                    onChange={(e) => setModalForm({ ...modalForm, notes: e.target.value })}
                    placeholder="e.g. Needs net-15 factoring option"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 focus:border-slate-400 rounded-[10px] focus:outline-none text-slate-800 placeholder:text-slate-400 font-medium text-[13px]"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="grid grid-cols-2 gap-4 pt-4 mt-2 shrink-0">
                <button
                  type="submit"
                  className="w-full bg-[#FFB000] hover:bg-[#F59E0B] text-slate-900 font-bold text-[14px] py-3 rounded-[10px] transition-colors cursor-pointer text-center"
                >
                  Save Lead Card
                </button>
                <button
                  type="button"
                  className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-[14px] py-3 rounded-[10px] transition-colors cursor-pointer text-center"
                >
                  Save & Book Demo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
