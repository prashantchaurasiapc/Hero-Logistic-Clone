import React, { useState, useEffect } from 'react';
import { 
  Plus, X, Bell, ChevronDown, Check, FileText, Send,
  FileDown, DollarSign, Building, Sparkles, RefreshCw, Clock, Eye, Download
} from 'lucide-react';
import { crmRepository } from '../../services/crmRepository';
import { crmStore } from '../../services/crmStore';

export default function Proposals() {
  // Database States
  const [proposals, setProposals] = useState([]);
  const [leads, setLeads] = useState([]);

  // UI States
  const [activeRole, setActiveRole] = useState('Sales Director');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalForm, setModalForm] = useState({
    leadId: '',
    value: 1999,
    discount: 5,
    validity: '30 Days',
    notes: ''
  });

  // Toast
  const [toast, setToast] = useState(null);

  // Subscribe to crmStore
  useEffect(() => {
    const syncDb = () => {
      const db = crmRepository.getCrmDatabase();
      setProposals(db.crmProposals || []);
      setLeads(crmRepository.getLeads());
    };
    syncDb();
    const unsubscribe = crmStore.subscribe(syncDb);
    return () => unsubscribe();
  }, []);

  // Sync selectedProposal on store updates
  useEffect(() => {
    if (selectedProposal) {
      const updated = proposals.find(p => p.id === selectedProposal.id);
      if (updated) setSelectedProposal(updated);
      else setSelectedProposal(null);
    }
  }, [proposals]);

  // Toast auto-clear
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const repsList = ['Alex Wright', 'Sarah K.', 'Michael Scott', 'Jan Levinson', 'Ryan Howard'];

  const getStatusStyle = (status) => {
    if (status === 'Accepted') return 'bg-emerald-50 border border-emerald-200 text-emerald-700';
    if (status === 'Sent') return 'bg-amber-50 border border-amber-200 text-amber-700';
    if (status === 'Draft') return 'bg-slate-100 border border-slate-200 text-slate-600';
    if (status === 'Rejected') return 'bg-rose-50 border border-rose-200 text-rose-700';
    return 'bg-slate-100 text-slate-600';
  };

  const handleSendProposal = (propId) => {
    crmStore.updateDb((db) => {
      const p = (db.crmProposals || []).find(x => x.id === propId);
      if (p) p.status = 'Sent';
    });
    setToast({ text: 'Proposal dispatched to client inbox successfully.' });
  };

  const handleAddProposalSubmit = (e) => {
    e.preventDefault();
    if (!modalForm.leadId) return;

    const lead = leads.find(l => l.id === modalForm.leadId);
    if (!lead) return;

    const total = Math.round((modalForm.value * (1 - modalForm.discount / 100)) * 1.1);
    const now = new Date().toISOString().split('T')[0];

    crmStore.updateDb((db) => {
      if (!db.crmProposals) db.crmProposals = [];
      db.crmProposals.unshift({
        id: `prop_draft_${Date.now()}`,
        leadId: modalForm.leadId,
        title: `SaaS License Core Agreement - ${lead.company}`,
        company: lead.company,
        value: Number(modalForm.value),
        discount: Number(modalForm.discount),
        tax: 10,
        total,
        validity: modalForm.validity,
        status: 'Draft',
        version: 'V1',
        createdDate: now,
        notes: modalForm.notes,
        features: [
          'Real-Time GPS Telematics',
          'AI Route Optimizer',
          'Factoring & Billing API',
          'Driver Mobile App',
          'ELD Compliance Module',
          'Live Customer Portal',
          'Dispatch Board Pro',
          'Maintenance Scheduler'
        ]
      });
    });

    setToast({ text: `Proposal drafted for ${lead.company}.` });
    setShowAddModal(false);
    setModalForm({ leadId: '', value: 1999, discount: 5, validity: '30 Days', notes: '' });
  };

  const filteredProposals = proposals.filter(p => {
    if (activeRole !== 'Sales Director') {
      const lead = leads.find(l => l.id === p.leadId);
      return lead ? lead.rep === activeRole : false;
    }
    return true;
  });

  return (
    <div className="flex-grow bg-[#F8FAFC] p-6 space-y-6 overflow-y-auto w-full text-left font-sans flex flex-col h-full min-h-0">

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-xl text-xs font-semibold animate-slide-in">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
          {toast.text}
        </div>
      )}

      {/* Header Container */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
              Proposals
            </h1>
            <div className="bg-[#FEF3C7] text-[#92400E] px-2.5 py-1 text-[9px] rounded-lg border border-[#FDE68A] uppercase font-black leading-none flex flex-col items-center justify-center shrink-0">
              <span className="text-[7px] text-[#B45309] font-bold tracking-wider mb-0.5">Enterprise</span>
              <span>Logistics</span>
            </div>
            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2.5 py-1 rounded-full font-extrabold shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Shift: Sales Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Complete end-to-end client conversion console backed by secure localStorage registry tables.
          </p>
        </div>


      </div>

      {/* Dual Panel Workspace */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* LEFT: Proposals List */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col overflow-hidden">
          {/* Panel Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
            <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-wider">
              Issued Licensing Agreements
            </h2>
          </div>

          {/* List */}
          <div className="p-5 space-y-4 bg-slate-50">
            {filteredProposals.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProposal(p)}
                className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-150 flex items-center justify-between gap-3 border ${
                  selectedProposal?.id === p.id 
                    ? 'bg-[#FFFBEB] border-[#FDE68A] shadow-[0_4px_12px_rgba(253,230,138,0.3)]' 
                    : 'bg-white border-slate-200 hover:border-amber-200 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="text-[13px] font-black text-slate-900 leading-tight mb-1.5">
                    {p.company}
                  </div>
                  <div className={`text-[10px] font-bold ${selectedProposal?.id === p.id ? 'text-slate-600' : 'text-slate-500'}`}>
                    Value: ${Number(p.total).toLocaleString()}/mo • Validity: {p.validity}
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-md text-[9px] font-extrabold tracking-widest uppercase leading-none shrink-0 ${
                  p.status === 'Accepted'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-[#FEF3C7] text-[#D97706]'
                }`}>
                  {p.status}
                </span>
              </button>
            ))}

            {filteredProposals.length === 0 && (
              <div className="py-16 text-center text-slate-400 font-bold text-xs uppercase tracking-wider select-none">
                No licensing proposals issued.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Proposal Detail Panel */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col overflow-hidden">
          {!selectedProposal ? (
            <div className="flex-grow flex items-center justify-center text-slate-400 font-semibold text-xs select-none">
              Select a proposal from the list.
            </div>
          ) : (
            <div className="flex flex-col bg-white rounded-2xl">
              {/* Detail Header */}
              <div className="px-7 py-6 border-b border-slate-100 flex flex-col gap-4 shrink-0">
                <div className="flex items-center justify-between w-full">
                  <span className="border border-slate-200 text-slate-500 bg-white px-2.5 py-1 rounded font-black text-[9px] uppercase tracking-widest">
                    SAAS LICENSE PROPOSAL
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <h3 className="text-slate-900 font-black text-[17px] leading-tight">
                    {selectedProposal.title || `SaaS License Core Agreement - ${selectedProposal.company}`}
                  </h3>
                  <div className="text-[11px] text-slate-800 font-bold mt-1.5">
                    Proposal ID: {selectedProposal.id} • Issued: {selectedProposal.createdDate} • Version: {selectedProposal.version || 'V1'}
                  </div>
                </div>
              </div>

              {/* Detail Body */}
              <div className="flex-grow px-7 py-6 space-y-7">
                
                {/* Contract Pricing Details */}
                <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3.5">Contract Pricing Details</div>
                  <div className="border border-slate-200 rounded-xl bg-white p-5">
                    <div className="flex justify-between items-center text-[12px] font-semibold text-slate-600 mb-3">
                      <span>Base platform license core</span>
                      <span className="text-slate-900 font-black">${Number(selectedProposal.value).toLocaleString()} / mo</span>
                    </div>
                    <div className="flex justify-between items-center text-[12px] font-semibold text-emerald-500">
                      <span>Negotiated Discount ({selectedProposal.discount}%)</span>
                      <span className="font-black">-${(selectedProposal.value * (selectedProposal.discount/100)).toLocaleString()} / mo</span>
                    </div>
                    <div className="border-t border-slate-100 my-4"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-[14px] text-slate-900 font-black">Total Proposed MRR</span>
                      <span className="text-[17px] text-[#D97706] font-black">${Number(selectedProposal.total).toLocaleString()} / mo</span>
                    </div>
                  </div>
                </div>

                {/* Included Service Modules */}
                <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3.5">Included Service Modules</div>
                  <div className="grid grid-cols-2 gap-y-3.5 gap-x-4">
                    {(selectedProposal.features || []).map((f, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-[11px] font-semibold text-slate-700">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Proposal Revision History */}
                <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3.5">Proposal Revision History</div>
                  <div className="border border-slate-200 rounded-xl bg-white p-4.5 flex justify-between items-center text-[11px] font-bold">
                    <span className="text-slate-900">Version {selectedProposal.version || 'V1'} <span className="text-slate-500 ml-1.5">[{selectedProposal.createdDate}]</span></span>
                    <div className="flex items-center gap-4">
                      <span className="text-[#D97706] font-black">${Number(selectedProposal.total).toLocaleString()} / mo</span>
                      <span className="bg-slate-50 border border-slate-100 text-slate-600 px-2.5 py-0.5 rounded text-[8px] uppercase tracking-widest shrink-0">{selectedProposal.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="px-7 py-5 flex items-center gap-2 shrink-0 border-t border-slate-100">
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[11px] px-4 py-2.5 rounded-lg cursor-pointer transition-colors shadow-xs whitespace-nowrap">
                  Accept Contract & Convert
                </button>
                <button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-extrabold text-[11px] px-4 py-2.5 rounded-lg cursor-pointer transition-colors whitespace-nowrap">
                  Reject Contract
                </button>
                <button className="bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#B45309] border border-[#FDE68A] font-extrabold text-[11px] px-4 py-2.5 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 ml-auto shadow-xs whitespace-nowrap">
                  <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                  Revise Proposal [Draft V2]
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Draft Proposal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md overflow-hidden shadow-2xl text-left flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" /> Draft Licensing Agreement
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleAddProposalSubmit} className="p-6 space-y-4 text-xs font-bold text-slate-700">
              {/* Lead Select */}
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Select CRM Lead *</label>
                <select
                  required
                  value={modalForm.leadId}
                  onChange={(e) => setModalForm({ ...modalForm, leadId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#F59E0B] rounded-xl focus:outline-none text-slate-800 cursor-pointer"
                >
                  {leads.map(l => (
                    <option key={l.id} value={l.id}>{l.company} ({l.name})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Value */}
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Value ($/mo)</label>
                  <input
                    type="number"
                    min="0"
                    value={modalForm.value}
                    onChange={(e) => setModalForm({ ...modalForm, value: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#F59E0B] rounded-xl focus:outline-none text-slate-800"
                  />
                </div>

                {/* Discount */}
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={modalForm.discount}
                    onChange={(e) => setModalForm({ ...modalForm, discount: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#F59E0B] rounded-xl focus:outline-none text-slate-800"
                  />
                </div>

                {/* Validity */}
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Validity</label>
                  <select
                    value={modalForm.validity}
                    onChange={(e) => setModalForm({ ...modalForm, validity: e.target.value })}
                    className="w-full px-2.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#F59E0B] rounded-xl focus:outline-none text-slate-800 cursor-pointer"
                  >
                    <option value="14 Days">14 Days</option>
                    <option value="30 Days">30 Days</option>
                    <option value="60 Days">60 Days</option>
                    <option value="90 Days">90 Days</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Proposal Notes</label>
                <textarea
                  value={modalForm.notes}
                  onChange={(e) => setModalForm({ ...modalForm, notes: e.target.value })}
                  placeholder="Additional terms, negotiation context..."
                  rows="3"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-[#F59E0B] rounded-xl focus:outline-none text-slate-800 resize-none font-semibold"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs py-3 rounded-xl border border-slate-200 transition-colors cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#F59E0B] hover:bg-[#D97706] text-black font-extrabold text-xs py-3 rounded-xl transition-colors cursor-pointer text-center shadow-xs"
                >
                  Save Draft Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
