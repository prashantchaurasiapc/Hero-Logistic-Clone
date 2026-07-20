import React, { useState, useEffect } from 'react';
import { 
  Plus, Mail, Phone, ChevronRight, X, Sparkles, 
  Edit3, Trash2, Bell, ShieldCheck, ChevronDown, Check, 
  DollarSign, Building, Truck, RefreshCw, Layers, User, Grab,
  Calendar, Play, FileText
} from 'lucide-react';
import { crmRepository } from '../../services/crmRepository';
import { crmStore } from '../../services/crmStore';
import { crmWorkflowEngine } from '../../services/crmEngines';

export default function PipelineBoard() {
  // Database States loaded from localStorage crmStore
  const [leads, setLeads] = useState([]);
  
  // UI states
  const [activeRole, setActiveRole] = useState('Sales Director');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState(null); // column stage name
  const [inspectorTab, setInspectorTab] = useState('Overview');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showRecommendModal, setShowRecommendModal] = useState(false);
  const [isMarkedWon, setIsMarkedWon] = useState(false);
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
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // List of all 9 lifecycle stages
  const columnsList = [
    'New Lead',
    'Contacted',
    'Demo Booked',
    'Demo Completed',
    'Trial Started',
    'Proposal Sent',
    'Negotiation',
    'Won',
    'Lost'
  ];

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

  // Priority classification based on lead score
  const getPriorityInfo = (score) => {
    if (score > 75) {
      return { label: 'High', style: 'bg-rose-50 text-rose-700 border border-rose-200' };
    }
    if (score > 55) {
      return { label: 'Medium', style: 'bg-amber-50 text-amber-700 border border-amber-200' };
    }
    return { label: 'Low', style: 'bg-slate-100 text-slate-600 border border-slate-200' };
  };

  // Drag & Drop handlers
  const handleDragStart = (e, leadId) => {
    e.dataTransfer.setData('text/plain', leadId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, columnStage) => {
    e.preventDefault();
    if (draggedOverColumn !== columnStage) {
      setDraggedOverColumn(columnStage);
    }
  };

  const handleDragLeave = () => {
    setDraggedOverColumn(null);
  };

  const handleCardDrop = (e, targetStage) => {
    e.preventDefault();
    setDraggedOverColumn(null);
    const leadId = e.dataTransfer.getData('text/plain');
    if (!leadId) return;

    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    if (lead.stage === targetStage) return;

    // Mutate database state
    crmWorkflowEngine.handleStageChange(leadId, targetStage, 'Repositioned via Pipeline Kanban Board');
    
    setToast({ 
      type: 'success', 
      text: `${lead.company}`, 
      actionText: `moved to ${targetStage} successfully!` 
    });
  };

  // Handle stage update via inspector drawer dropdown
  const handleUpdateStage = (id, newStage) => {
    crmWorkflowEngine.handleStageChange(id, newStage, 'Manual lifecycle update via Inspector');
    setToast({ 
      type: 'success', 
      text: `${leads.find(l => l.id === id)?.company || 'Lead'}`, 
      actionText: `moved to ${newStage} successfully!` 
    });
  };

  // Open Add Lead modal
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
    setShowAddModal(true);
  };

  // Add Lead form submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!modalForm.company || !modalForm.name || !modalForm.email) {
      alert('Please fill out all required fields.');
      return;
    }

    const newLead = crmRepository.createLead(modalForm);
    setToast({ 
      type: 'success', 
      text: `${modalForm.company}`, 
      actionText: 'created successfully!' 
    });
    
    // Workflow trigger stage update if not New Lead
    if (modalForm.stage !== 'New Lead') {
      crmWorkflowEngine.handleStageChange(newLead.id, modalForm.stage, 'Initial custom intake stage');
    }

    setShowAddModal(false);
  };

  // Provision Trial Sandbox
  const handleProvisionTrial = (lead) => {
    crmWorkflowEngine.handleStageChange(lead.id, 'Trial Started', 'Sandbox demo workspace provisioned');
    setToast({ 
      type: 'success', 
      text: `${lead.company}`, 
      actionText: 'trial sandbox workspace provisioned!' 
    });
  };

  // Rep filtering based on Role selected
  const filteredLeads = leads.filter(lead => {
    if (activeRole === 'Sales Director') return true;
    return lead.rep === activeRole;
  });

  return (
    <div className="flex-grow bg-[#F8FAFC] p-6 space-y-6 overflow-y-auto w-full text-left font-sans flex flex-col h-full min-h-0">
      
      {/* Toast Notification (Bottom Center aligned to match screenshot) */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-3 px-5 py-3.5 bg-white border border-slate-200 text-slate-800 rounded-xl shadow-xl text-xs font-bold animate-slide-in min-w-[340px]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            <span>
              Lead for <strong className="text-slate-900 font-extrabold">{toast.text}</strong> {toast.actionText}
            </span>
          </div>
          <button 
            onClick={() => setToast(null)} 
            className="text-slate-400 hover:text-slate-700 p-0.5 rounded-md hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4 shrink-0" />
          </button>
        </div>
      )}

      {/* Header Container */}
      <div className="flex justify-between items-center mb-2 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">
            Pipeline Board
          </h1>
          <p className="text-xs font-medium text-slate-500">
            Complete end-to-end client conversion console backed by secure localStorage registry tables.
          </p>
        </div>


      </div>

      {/* Subheader Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs shrink-0 text-left">
        <span className="text-[#D97706] font-extrabold uppercase text-[10px] tracking-wider block">
          Carrier Lifecycle Pipeline
        </span>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Drag and drop prospect cards to transition lifecycle workflows. Shifting lanes will trigger intermediate confirmation dialogs.
        </p>
      </div>

      {/* Kanban Grid Workspace */}
      <div className="flex-grow flex gap-4 overflow-x-auto pb-4 items-stretch min-h-0 scrollbar-thin select-none">
        {columnsList.map((colStage) => {
          const stageLeads = filteredLeads.filter(l => l.stage === colStage);
          const isDraggingOver = draggedOverColumn === colStage;

          return (
            <div 
              key={colStage} 
              onDragOver={(e) => handleDragOver(e, colStage)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleCardDrop(e, colStage)}
              className={`w-72 rounded-2xl p-4 flex flex-col shrink-0 min-h-[400px] border transition-all ${
                isDraggingOver 
                  ? 'bg-amber-50/50 border-[#ffcc00] border-dashed shadow-inner scale-[1.01]' 
                  : 'bg-slate-50 border-slate-200/60'
              }`}
            >
              {/* Column Header */}
              <div className="flex justify-between items-center border-b border-slate-200 pb-2.5 mb-4 shrink-0 select-none">
                <span className="font-extrabold text-[11px] text-slate-800 uppercase tracking-widest">
                  {colStage}
                </span>
                <span className="bg-slate-200/70 border border-slate-200 text-slate-700 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full shrink-0">
                  {stageLeads.length}
                </span>
              </div>

              {/* Deal Cards Container */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1 scrollbar-none">
                {stageLeads.map((lead) => {
                  const prio = getPriorityInfo(lead.score);
                  
                  return (
                    <div 
                      key={lead.id}
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onClick={() => setSelectedLead(lead)}
                      className={`bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3 cursor-grab active:cursor-grabbing hover:border-slate-400 hover:shadow-xs transition-all duration-200 text-left relative ${
                        selectedLead && selectedLead.id === lead.id ? 'ring-2 ring-[#F59E0B] border-transparent' : ''
                      }`}
                    >
                      {/* Card Header (Company + Priority Badge) */}
                      <div className="flex justify-between items-start gap-2">
                        <strong className="text-slate-900 text-[12px] font-black tracking-tight leading-tight block truncate max-w-[170px]">
                          {lead.company}
                        </strong>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase shrink-0 leading-none ${prio.style}`}>
                          {prio.label}
                        </span>
                      </div>

                      {/* Contact & Value */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 block font-semibold">
                          {lead.name}
                        </span>
                        <span className="font-mono text-slate-900 text-[11px] font-black block">
                          ${Number(lead.revenue).toLocaleString()}/mo
                        </span>
                      </div>

                      {/* Card Footer (AE name + Fleet Trucks count) */}
                      <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 text-[9px] font-bold text-slate-400 shrink-0">
                        {/* Rep first name */}
                        <div className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{lead.rep.split(' ')[0]}</span>
                        </div>
                        {/* Fleet Trucks */}
                        <div className="flex items-center gap-1 font-mono">
                          <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{lead.fleetSize} Trk</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {stageLeads.length === 0 && (
                  <div className="h-32 border border-dashed border-slate-200/80 rounded-xl flex flex-col items-center justify-center text-slate-400 font-bold text-[9px] text-center select-none uppercase tracking-widest bg-slate-100/30">
                    <Grab className="w-5 h-5 text-slate-300 mb-1 shrink-0" />
                    Drop Cards Here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Lead Profile Inspector (slide-out side drawer) */}
      {selectedLead && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] bg-white border-l border-slate-200 shadow-2xl z-40 p-0 flex flex-col font-sans animate-slide-in">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-5 border-b border-slate-200 shrink-0">
            <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">Lead 360° Profile Inspector</h2>
            <button 
              onClick={() => setSelectedLead(null)}
              className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 p-1.5 rounded-full transition-all cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[2px]" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Company Info & Actions */}
            <div className="px-6 py-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-black text-slate-900 leading-none truncate pr-4">{selectedLead.company}</h3>
                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={() => setShowZoomModal(true)}
                    className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors shadow-xs"
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                  <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors shadow-xs">
                    <Play className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setShowProposalModal(true)}
                    className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors shadow-xs"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] rounded-md">
                  {selectedLead.stage === 'New Lead' ? 'NEW LEAD' : selectedLead.stage.toUpperCase()}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-rose-50 text-rose-500 border border-rose-200 rounded-md">
                  Risk: {selectedLead.score < 50 ? 'High' : selectedLead.score < 80 ? 'Medium' : 'Low'}
                </span>
              </div>
            </div>

            {/* Scrollable Tabs */}
            <div className="px-6 border-b border-slate-100 mb-6 shrink-0">
              <div className="flex items-center gap-5 overflow-x-auto scrollbar-none pb-3">
                {['Overview', 'Timeline', 'Contacts', 'Meetings', 'Calls', 'Emails', 'Tasks', 'Notes', 'Documents', 'Demo', 'Trial', 'Proposals'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setInspectorTab(tab)}
                    className={`whitespace-nowrap text-[11px] font-black transition-all cursor-pointer ${
                      inspectorTab === tab 
                        ? 'bg-[#FACC15] text-black px-4 py-2 rounded-xl shadow-xs' 
                        : 'text-slate-500 hover:text-slate-900 py-2'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="px-6 space-y-6 pb-6">
              {inspectorTab === 'Overview' && (
                <>
                  {/* Overview Card */}
                  <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 grid grid-cols-2 gap-6 shadow-sm">
                    <div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Primary Evaluator</div>
                      <div className="font-extrabold text-slate-900 text-sm">{selectedLead.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-1.5 mb-1.5 truncate">{selectedLead.email}</div>
                      <div className="text-[11px] text-slate-600 mb-5 font-semibold">{selectedLead.phone || 'No phone provided'}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-amber-600" /> Rep:
                        </span>
                        <select 
                          value={selectedLead.rep}
                          onChange={(e) => {}} // mock logic
                          className="bg-white border border-slate-200 text-xs font-bold px-2.5 py-1.5 rounded-lg focus:outline-none cursor-pointer hover:border-amber-300 transition-colors"
                        >
                          <option value="Alex Wright">Alex Wright</option>
                          <option value="Sarah K.">Sarah K.</option>
                          <option value="Michael Scott">Michael Scott</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Estimated Contract Value</div>
                      <div className="font-black text-xl text-[#D97706] mb-4">${Number(selectedLead.revenue).toLocaleString()} <span className="text-xs text-slate-500 font-bold">/ mo</span></div>
                      <div className="text-[11px] text-slate-800 font-semibold mb-2">Niche: <span className="font-medium text-slate-600">{selectedLead.niche}</span></div>
                      <div className="text-[11px] text-slate-800 font-semibold">Fleet Size: <span className="font-medium text-slate-600">{selectedLead.fleetSize} Trucks</span></div>
                    </div>
                  </div>

                  {/* Sales Aging Parameters */}
                  <div className="bg-slate-600 rounded-2xl p-5 text-white shadow-sm">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Sales Aging Parameters</div>
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <div className="text-slate-400 mb-1.5 font-bold">Days in Current Stage:</div>
                        <div className="font-black text-sm">18 Days</div>
                      </div>
                      <div>
                        <div className="text-slate-400 mb-1.5 font-bold">Last Contact:</div>
                        <div className="font-black text-sm">2026-07-11</div>
                      </div>
                    </div>
                  </div>

                  {/* Client Pain Point Details */}
                  {selectedLead.painPoints && (
                    <div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Client Pain Point Details</div>
                      <div className="bg-slate-600 text-slate-300 rounded-xl p-4 text-[11px] font-medium leading-relaxed italic shadow-sm">
                        "{selectedLead.painPoints}"
                      </div>
                    </div>
                  )}

                  {/* Lead Direct Actions */}
                  <div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Lead Direct Actions</div>
                    <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                      <button 
                        onClick={() => setShowRecommendModal(true)}
                        className="whitespace-nowrap bg-[#311B92] text-white text-[11px] font-bold px-4 py-2.5 rounded-full cursor-pointer hover:bg-[#281577] transition-colors shadow-xs"
                      >Recommend Plan</button>
                      <button 
                        onClick={() => { setIsMarkedWon(true); }}
                        className="whitespace-nowrap bg-[#004D40] text-white text-[11px] font-bold px-4 py-2.5 rounded-full cursor-pointer hover:bg-[#003B31] transition-colors shadow-xs"
                      >
                        Mark Won
                      </button>
                      <button 
                        onClick={() => { setIsMarkedWon(false); }}
                        className="whitespace-nowrap bg-[#4A0000] text-white text-[11px] font-bold px-4 py-2.5 rounded-full cursor-pointer hover:bg-[#330000] transition-colors shadow-xs"
                      >
                        Mark Lost
                      </button>
                      <button 
                        onClick={() => setShowScheduleModal(true)}
                        className="whitespace-nowrap bg-white border border-slate-300 text-slate-800 text-[11px] font-bold px-4 py-2.5 rounded-full cursor-pointer hover:bg-slate-50 transition-colors shadow-xs"
                      >
                        Schedule Follow-Up
                      </button>
                    </div>
                  </div>
                </>
              )}
              {inspectorTab !== 'Overview' && (
                <div className="text-center py-16 text-slate-400 text-xs font-bold uppercase tracking-wider border-2 border-dashed border-slate-100 rounded-2xl">
                  {inspectorTab} Details Available Soon
                </div>
              )}

              {/* Log Activity */}
              <div className="pt-6 border-t border-slate-100 mt-6">
                <input 
                  type="text" 
                  placeholder="Log activity details inside timeline..." 
                  className="w-full border border-slate-200 rounded-2xl px-5 py-4 text-xs font-medium focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all shadow-xs placeholder:text-slate-400 text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-5 bg-white border-t border-slate-200 shrink-0 flex gap-3">
            {isMarkedWon && (
              <button 
                className="flex-1 bg-[#10b981] text-white text-[13px] font-bold rounded-xl py-3.5 hover:bg-[#059669] transition-colors shadow-sm cursor-pointer"
              >
                Convert to Company Account
              </button>
            )}
            <button 
              onClick={() => { setSelectedLead(null); setIsMarkedWon(false); }}
              className="px-6 py-3.5 bg-white border border-slate-200 text-slate-800 text-[13px] font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-lg overflow-hidden shadow-2xl text-left flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4.5 border-b border-slate-100 bg-slate-50 shrink-0">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Building className="w-4.5 h-4.5 text-amber-600" />
                Intake New CRM Lead
              </h3>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="text-slate-400 hover:text-slate-655 cursor-pointer p-1 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Scrollable body */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs font-bold text-slate-700 overflow-y-auto flex-grow">
              
              <div className="grid grid-cols-2 gap-4">
                {/* Company Legal Name */}
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Company Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalForm.company}
                    onChange={(e) => setModalForm({ ...modalForm, company: e.target.value })}
                    placeholder="e.g. Vance Refrigeration"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#ffcc00] rounded-xl focus:outline-none text-slate-800"
                  />
                </div>
                
                {/* Contact Name */}
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalForm.name}
                    onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                    placeholder="e.g. Robert Vance"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#ffcc00] rounded-xl focus:outline-none text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Contact Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={modalForm.email}
                    onChange={(e) => setModalForm({ ...modalForm, email: e.target.value })}
                    placeholder="e.g. robertvance@vance.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#ffcc00] rounded-xl focus:outline-none text-slate-800"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    value={modalForm.phone}
                    onChange={(e) => setModalForm({ ...modalForm, phone: e.target.value })}
                    placeholder="e.g. 555-0101"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#ffcc00] rounded-xl focus:outline-none text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Fleet Size */}
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Fleet Size (Trucks)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={modalForm.fleetSize}
                    onChange={(e) => setModalForm({ ...modalForm, fleetSize: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#ffcc00] rounded-xl focus:outline-none text-slate-800"
                  />
                </div>
                
                {/* Niche */}
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Niche Niche
                  </label>
                  <select
                    value={modalForm.niche}
                    onChange={(e) => setModalForm({ ...modalForm, niche: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#ffcc00] rounded-xl focus:outline-none text-slate-800 cursor-pointer"
                  >
                    {niches.map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                {/* Revenue */}
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Est. Value ($/mo)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={modalForm.revenue}
                    onChange={(e) => setModalForm({ ...modalForm, revenue: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#ffcc00] rounded-xl focus:outline-none text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Lifecycle Stage */}
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Deal stage
                  </label>
                  <select
                    value={modalForm.stage}
                    onChange={(e) => setModalForm({ ...modalForm, stage: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#ffcc00] rounded-xl focus:outline-none text-slate-800 cursor-pointer"
                  >
                    {columnsList.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Lead Score */}
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Lead Score (0-100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={modalForm.score}
                    onChange={(e) => setModalForm({ ...modalForm, score: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#ffcc00] rounded-xl focus:outline-none text-slate-800"
                  />
                </div>

                {/* rep assigned */}
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Owner Rep
                  </label>
                  <select
                    value={modalForm.rep}
                    onChange={(e) => setModalForm({ ...modalForm, rep: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#ffcc00] text-slate-800 cursor-pointer rounded-xl focus:outline-none"
                  >
                    {repsList.map(rep => (
                      <option key={rep} value={rep}>{rep}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  Pain Points / Client Notes
                </label>
                <textarea
                  value={modalForm.notes}
                  onChange={(e) => setModalForm({ ...modalForm, notes: e.target.value })}
                  placeholder="Describe main requirements or software pain points..."
                  rows="3"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-[#ffcc00] rounded-xl focus:outline-none text-slate-800 text-xs font-semibold resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs py-3 rounded-xl border border-slate-200 transition-colors cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#ffcc00] hover:bg-[#e6b800] text-black font-extrabold text-xs py-3 rounded-xl transition-colors cursor-pointer text-center shadow-xs"
                >
                  Intake Lead Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ZOOM Modal */}
      {showZoomModal && selectedLead && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[500px] shadow-2xl overflow-hidden animate-slide-in">
            {/* Header */}
            <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100">
              <h2 className="text-[18px] font-bold text-slate-900">Schedule ZOOM Product Walkthrough</h2>
              <button onClick={() => setShowZoomModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-5">
              <p className="text-[13px] font-medium text-slate-500 -mt-2">Locking a demo schedule for {selectedLead.company}.</p>

              <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">SELECT DATE</label>
                <input
                  type="date"
                  defaultValue="2026-07-17"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">SELECT TIME BLOCK</label>
                <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 transition-colors bg-white appearance-auto">
                  <option>11:00 AM EST</option>
                  <option>01:00 PM EST</option>
                  <option>03:00 PM EST</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">MEETING AGENDA / HOST NOTES</label>
                <input
                  type="text"
                  defaultValue="Walkthrough showcasing fleet telematics and factoring automation."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-colors"
                />
              </div>

              <button
                onClick={() => {
                  setShowZoomModal(false);
                  setToast({ type: 'success', text: selectedLead.company, actionText: 'Zoom scheduled!' });
                }}
                className="w-full bg-[#FFB020] hover:bg-[#FFC800] text-slate-900 font-extrabold text-[14px] py-3.5 rounded-xl shadow-[0_4px_15px_rgba(255,176,32,0.4)] transition-all mt-2"
              >
                Confirm Zoom Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proposal Modal */}
      {showProposalModal && selectedLead && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[500px] shadow-2xl overflow-hidden animate-slide-in">
            {/* Header */}
            <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100">
              <h2 className="text-[18px] font-bold text-slate-900">Issue Licensing Agreement Proposal</h2>
              <button onClick={() => setShowProposalModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-5">
              <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">PROPOSAL TITLE DOCUMENT</label>
                <input
                  type="text"
                  defaultValue={`Hero Logistics SaaS License - ${selectedLead.company}`}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-colors"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">LINE ITEMS</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    defaultValue="Enterprise License Tier base"
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-colors"
                  />
                  <input
                    type="number"
                    defaultValue="6162"
                    className="w-32 border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-colors"
                  />
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    defaultValue="GPS Fleet Tracking Modules API"
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-colors"
                  />
                  <input
                    type="number"
                    defaultValue="924"
                    className="w-32 border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-colors"
                  />
                </div>
                <button className="text-[#FFB020] text-[11px] font-black hover:text-[#E68A00] transition-colors mt-1">
                  + Add Custom Add-on item
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">CORPORATE DISCOUNT (%)</label>
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">PROPOSAL VALIDITY TERM</label>
                  <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 transition-colors bg-white appearance-auto">
                    <option>30 Days validity</option>
                    <option>60 Days validity</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowProposalModal(false);
                  setToast({ type: 'success', text: selectedLead.company, actionText: 'Proposal dispatched!' });
                }}
                className="w-full bg-[#FFB020] hover:bg-[#FFC800] text-slate-900 font-extrabold text-[14px] py-3.5 rounded-xl shadow-[0_4px_15px_rgba(255,176,32,0.4)] transition-all mt-2"
              >
                Dispatched Proposal Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Follow-Up Modal */}
      {showScheduleModal && selectedLead && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[500px] shadow-2xl overflow-hidden animate-slide-in">
            {/* Header */}
            <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100">
              <h2 className="text-[18px] font-bold text-slate-900">Schedule Follow-Up Touchpoint</h2>
              <button onClick={() => setShowScheduleModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-5">
              <p className="text-[13px] font-medium text-slate-500 -mt-2">Scheduling a follow-up action for prospect <span className="font-bold">{selectedLead.company}</span>.</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">FOLLOW-UP ACTION TYPE</label>
                  <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 transition-colors bg-white appearance-auto">
                    <option>📞 Phone Call</option>
                    <option>✉️ Email</option>
                    <option>📅 Meeting</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">PRIORITY TIER</label>
                  <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 transition-colors bg-white appearance-auto">
                    <option selected>🟡 Medium</option>
                    <option>🔴 High</option>
                    <option>🟢 Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">TARGET DATE</label>
                  <input
                    type="date"
                    defaultValue="2026-07-17"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">TIME SLOT</label>
                  <input
                    type="text"
                    defaultValue="10:00 AM"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">FOLLOW-UP MEMO / ACTION NOTES</label>
                <input
                  type="text"
                  defaultValue="Follow-up touchpoint check-in."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-colors"
                />
              </div>

              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setToast({ type: 'success', text: selectedLead.company, actionText: 'follow-up scheduled!' });
                }}
                className="w-full bg-[#FFB020] hover:bg-[#FFC800] text-slate-900 font-extrabold text-[14px] py-3.5 rounded-xl shadow-[0_4px_15px_rgba(255,176,32,0.4)] transition-all mt-2"
              >
                Schedule Follow-Up Task
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Recommend Plan Modal */}
      {showRecommendModal && selectedLead && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[560px] shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100">
              <h2 className="text-[18px] font-bold text-slate-900">Interactive License Tier Recommendation</h2>
              <button onClick={() => setShowRecommendModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-6">
              {/* Lead Diagnosis */}
              <div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">LEAD DIAGNOSIS</div>
                <div className="font-bold text-slate-900 text-[16px] mb-1">{selectedLead.company}</div>
                <div className="text-[13px] text-slate-500 font-medium">
                  Fleet Size: <span className="font-bold text-slate-700">{selectedLead.fleetSize} Trucks</span>
                  {' • '}
                  Current Software: <span className="font-bold text-slate-700">Salesforce (Too Costly)</span>
                </div>
              </div>

              {/* Plans */}
              <div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-4">AVAILABLE LICENSE PLAN TIERS</div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                  {/* Starter */}
                  <div className="border border-slate-200 rounded-2xl p-4 flex flex-col gap-3">
                    <div>
                      <div className="font-bold text-slate-900 text-[15px] mb-1">Starter</div>
                      <div className="text-[12px] text-slate-500">For small operators &lt; 35 trucks</div>
                    </div>
                    <div className="font-black text-slate-900 text-[20px]">$199<span className="text-[13px] text-slate-500 font-semibold">/mo</span></div>
                    <ul className="space-y-1.5 flex-1">
                      {['Core Dispatching', 'Basic Driver App', 'GPS Tracking (hourly)', 'Email Support'].map(f => (
                        <li key={f} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                          <Check className="w-3 h-3 text-slate-400 shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => { setShowRecommendModal(false); setToast({ type: 'success', text: selectedLead.company, actionText: 'Starter plan applied!' }); }}
                      className="w-full border border-slate-200 text-slate-700 text-[10px] font-black py-2.5 rounded-xl hover:bg-slate-50 transition-colors tracking-wider uppercase"
                    >
                      Apply Starter Plan
                    </button>
                  </div>

                  {/* Professional */}
                  <div className="border border-slate-200 rounded-2xl p-4 flex flex-col gap-3">
                    <div>
                      <div className="font-bold text-slate-900 text-[15px] mb-1">Professional</div>
                      <div className="text-[12px] text-slate-500">For growing fleets 35 - 100 trucks</div>
                    </div>
                    <div className="font-black text-slate-900 text-[20px]">$499<span className="text-[13px] text-slate-500 font-semibold">/mo</span></div>
                    <ul className="space-y-1.5 flex-1">
                      {['Dynamic Dispatching', 'Factor Integration A...', 'GPS Tracking (live H...', 'Priority Support'].map(f => (
                        <li key={f} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                          <Check className="w-3 h-3 text-slate-400 shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => { setShowRecommendModal(false); setToast({ type: 'success', text: selectedLead.company, actionText: 'Professional plan applied!' }); }}
                      className="w-full border border-slate-200 text-slate-700 text-[10px] font-black py-2.5 rounded-xl hover:bg-slate-50 transition-colors tracking-wider uppercase"
                    >
                      Apply Professional Plan
                    </button>
                  </div>

                  {/* Enterprise - RECOMMENDED */}
                  <div className="border-2 border-[#FFB020] rounded-2xl p-4 flex flex-col gap-3 relative">
                    <div className="absolute -top-3 right-3 bg-[#FFB020] text-slate-900 text-[9px] font-black px-2 py-0.5 rounded-full tracking-widest uppercase">RECOMMENDED</div>
                    <div>
                      <div className="font-bold text-slate-900 text-[15px] mb-1">Enterprise</div>
                      <div className="text-[12px] text-slate-500">For logistics giants &gt; 100 trucks</div>
                    </div>
                    <div className="font-black text-slate-900 text-[20px]">$1299<span className="text-[13px] text-slate-500 font-semibold">/mo</span></div>
                    <ul className="space-y-1.5 flex-1">
                      {['AI CommandCenter ...', 'Custom Billing Rules', 'Unlimited Drivers/H...', 'Dedicated SLA Custo...'].map(f => (
                        <li key={f} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                          <Check className="w-3 h-3 text-[#FFB020] shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => { setShowRecommendModal(false); setToast({ type: 'success', text: selectedLead.company, actionText: 'Enterprise plan applied!' }); }}
                      className="w-full bg-[#FFB020] hover:bg-[#FFC800] text-slate-900 text-[10px] font-black py-2.5 rounded-xl shadow-[0_4px_12px_rgba(255,176,32,0.4)] transition-all tracking-wider uppercase"
                    >
                      Apply Enterprise Plan
                    </button>
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
