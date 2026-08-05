import React, { useState, useEffect } from 'react';
import {
  Plus, Bell, ChevronDown, Check, Save, Trash2, FileText
} from 'lucide-react';
import { crmRepository } from '../../services/crmRepository';
import { crmStore } from '../../services/crmStore';

// ---- Default Templates ----
const DEFAULT_TEMPLATES = {
  'Welcome Sandbox Invite': {
    subject: 'Welcome to Hero Logistics System Trial',
    body: `Hi {{contact_name}},

Your 14-day evaluation sandbox for {{company_name}} is provisioned. Please download your platform access keys here: https://hero-telematics.com/keys.

Best,
{{rep_name}}`
  },
  'Follow-Up Pricing Quote': {
    subject: 'Hero Logistics SaaS Agreement — Pricing Follow-Up',
    body: `Hi {{contact_name}},

Following up on the proposal we sent for {{company_name}}. Happy to schedule a quick call to walk through the pricing tiers and answer any questions.

Best,
{{rep_name}}`
  },
  'Demo Confirmation': {
    subject: 'Your Hero Logistics Demo is Confirmed',
    body: `Hi {{contact_name}},

This is a confirmation that your live product walkthrough demo for {{company_name}} is scheduled. You'll receive calendar invites shortly.

Best,
{{rep_name}}`
  },
  'Trial Expiry Reminder': {
    subject: 'Your {{company_name}} Trial is Expiring Soon',
    body: `Hi {{contact_name}},

Your 14-day trial for {{company_name}} is about to expire. Let's connect to discuss converting your sandbox to a full SaaS license.

Best,
{{rep_name}}`
  }
};

export default function Settings() {
  // Template State
  const [selectedTemplate, setSelectedTemplate] = useState('Welcome Sandbox Invite');
  const [templateSubject, setTemplateSubject] = useState(DEFAULT_TEMPLATES['Welcome Sandbox Invite'].subject);
  const [templateBody, setTemplateBody] = useState(DEFAULT_TEMPLATES['Welcome Sandbox Invite'].body);

  // Pipeline Stages State
  const [stages, setStages] = useState([]);
  const [newStageInput, setNewStageInput] = useState('');

  // Acquisition Sources State
  const [sources, setSources] = useState([]);
  const [newSourceInput, setNewSourceInput] = useState('');

  // UI States
  const [activeRole, setActiveRole] = useState('Sales Director');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [toast, setToast] = useState(null);

  const repsList = ['Alex Wright', 'Sarah K.', 'Michael Scott', 'Jan Levinson', 'Ryan Howard'];

  // Load from crmStore
  useEffect(() => {
    const syncDb = () => {
      const db = crmRepository.getCrmDatabase();
      setStages(db.crmPipelineStages || [
        'New Lead', 'Contacted', 'Demo Booked', 'Demo Completed',
        'Trial Started', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'
      ]);
      setSources(db.crmAcquisitionSources || [
        'Google Search', 'LinkedIn', 'Partner Referral', 'Cold Call'
      ]);
    };
    syncDb();
    const unsubscribe = crmStore.subscribe(syncDb);
    return () => unsubscribe();
  }, []);

  // Toast auto-clear
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Handle template selection
  const handleSelectTemplate = (name) => {
    setSelectedTemplate(name);
    const tpl = DEFAULT_TEMPLATES[name];
    if (tpl) {
      setTemplateSubject(tpl.subject);
      setTemplateBody(tpl.body);
    }
  };

  // Save template
  const handleSaveTemplate = () => {
    setToast({ text: `Template "${selectedTemplate}" configuration saved.` });
  };

  // Pipeline stage handlers
  const handleAddStage = () => {
    const val = newStageInput.trim();
    if (!val) return;
    if (!stages.includes(val)) {
      crmRepository.saveStages([...stages, val]);
      setToast({ text: `Stage "${val}" added to pipeline.` });
    }
    setNewStageInput('');
  };

  const handleDeleteStage = (stage) => {
    const updated = stages.filter(s => s !== stage);
    crmRepository.saveStages(updated);
    setToast({ text: `Stage "${stage}" removed.` });
  };

  const handleAddSource = () => {
    const val = newSourceInput.trim();
    if (!val) return;
    if (!sources.includes(val)) {
      crmRepository.saveSources([...sources, val]);
      setToast({ text: `Source "${val}" added.` });
    }
    setNewSourceInput('');
  };

  const handleDeleteSource = (source) => {
    const updated = sources.filter(s => s !== source);
    crmRepository.saveSources(updated);
    setToast({ text: `Source "${source}" removed.` });
  };

  // Fixed stages that cannot be deleted
  const FIXED_STAGES = ['New Lead'];

  return (
    <div className="flex-grow bg-[#F8FAFC] p-6 space-y-6 overflow-y-auto w-full text-left font-sans flex flex-col h-full min-h-0">

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-xl text-xs font-semibold animate-slide-in">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
          {toast.text}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">
            Settings
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Complete end-to-end client conversion console backed by secure localStorage registry tables.
          </p>
        </div>
      </div>

      {/* Two-Column Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* LEFT: Email & Touchpoint Templates */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col overflow-hidden">
          {/* Panel Header */}
          <div className="px-5 py-4 border-b border-slate-100 shrink-0">
            <h2 className="text-[13px] font-black text-slate-900">Email &amp; Touchpoint Templates</h2>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              Configure pre-formatted messages for demo slots and trial invites.
            </p>
          </div>

          <div className="p-5 space-y-4 flex flex-col">
            {/* Select Template */}
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                Select Target Template
              </label>
              <div className="relative">
                <select
                  value={selectedTemplate}
                  onChange={(e) => handleSelectTemplate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#ffcc00] rounded-xl focus:outline-none text-slate-800 text-xs font-semibold appearance-none cursor-pointer pr-8"
                >
                  {Object.keys(DEFAULT_TEMPLATES).map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Subject Line */}
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                Subject Line Lineup
              </label>
              <input
                type="text"
                value={templateSubject}
                onChange={(e) => setTemplateSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#ffcc00] rounded-xl focus:outline-none text-slate-800 text-xs font-semibold"
              />
            </div>

            {/* Template Body Editor */}
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                Template Body Editor
              </label>
              <textarea
                rows="7"
                value={templateBody}
                onChange={(e) => setTemplateBody(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 focus:border-[#ffcc00] rounded-xl focus:outline-none text-slate-700 text-[11px] font-mono resize-none leading-relaxed"
              />
              <p className="text-[9px] text-slate-400 font-semibold mt-1.5">
                Available merge tags: {'{{contact_name}}'}, {'{{company_name}}'}, {'{{rep_name}}'}
              </p>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveTemplate}
              className="w-full bg-[#ffcc00] hover:bg-[#e6b800] text-black font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <FileText className="w-4 h-4 shrink-0" />
              Save Template Configuration
            </button>
          </div>
        </div>

        {/* RIGHT Column — Pipeline Stages + Acquisition Sources */}
        <div className="space-y-6 flex flex-col">

          {/* Pipeline Stages Panel */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col overflow-hidden h-[340px]">
            <div className="px-6 py-5 shrink-0">
              <h2 className="text-[14px] font-black text-slate-800">Pipeline Stages</h2>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                Add or manage stages defining your sales pipeline columns.
              </p>
            </div>

            <div className="flex-grow overflow-y-auto px-6 pb-2 space-y-2.5 pr-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] mr-2 mb-2">
              {stages.map((stage, idx) => (
                <div key={idx} className="flex items-center justify-between px-4 py-2.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-[11px] font-bold text-slate-700">{stage}</span>
                  {!FIXED_STAGES.includes(stage) && (
                    <button
                      onClick={() => handleDeleteStage(stage)}
                      className="text-slate-400 hover:text-rose-500 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Stage */}
            <div className="flex items-center gap-2.5 px-6 pb-5 pt-1 shrink-0">
              <input
                type="text"
                value={newStageInput}
                onChange={(e) => setNewStageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddStage()}
                placeholder="New stage title..."
                className="flex-grow px-4 py-2.5 bg-white border border-slate-200 focus:border-[#ffcc00] rounded-xl focus:outline-none text-slate-800 text-[11px] font-semibold"
              />
              <button
                onClick={handleAddStage}
                className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[#e6b800] font-extrabold text-[11px] cursor-pointer hover:border-[#ffcc00] transition-colors whitespace-nowrap"
              >
                Add
              </button>
            </div>
          </div>

          {/* Lead Acquisition Sources Panel */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col overflow-hidden h-[340px]">
            <div className="px-6 py-5 shrink-0">
              <h2 className="text-[14px] font-black text-slate-800">Lead Acquisition Sources</h2>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                Track and filter where inbound carrier queries originate.
              </p>
            </div>

            <div className="flex-grow overflow-y-auto px-6 pb-2 space-y-2.5 pr-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] mr-2 mb-2">
              {sources.map((src, idx) => (
                <div key={idx} className="flex items-center justify-between px-4 py-2.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-[11px] font-bold text-slate-700">{src}</span>
                  <button
                    onClick={() => handleDeleteSource(src)}
                    className="text-slate-400 hover:text-rose-500 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Source */}
            <div className="flex items-center gap-2.5 px-6 pb-5 pt-1 shrink-0">
              <input
                type="text"
                value={newSourceInput}
                onChange={(e) => setNewSourceInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSource()}
                placeholder="New acquisition source..."
                className="flex-grow px-4 py-2.5 bg-white border border-slate-200 focus:border-[#ffcc00] rounded-xl focus:outline-none text-slate-800 text-[11px] font-semibold"
              />
              <button
                onClick={handleAddSource}
                className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[#e6b800] font-extrabold text-[11px] cursor-pointer hover:border-[#ffcc00] transition-colors whitespace-nowrap"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
