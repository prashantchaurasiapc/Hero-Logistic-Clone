import React, { useState, useEffect } from 'react';
import {
  Plus, Bell, ChevronDown, Check, Save, Trash2, FileText, Sparkles, Loader2, X
} from 'lucide-react';
import { crmRepository } from '../../services/crmRepository';
import { crmStore } from '../../services/crmStore';
import { useAuth } from '../../context/AuthContext';
import { 
  getSalesSettings, saveSalesTemplate, deleteSalesTemplate, 
  addSalesStage, deleteSalesStage, addSalesSource, deleteSalesSource 
} from '../../services/api';

const FIXED_STAGES = [
  'New Lead', 'Contacted', 'Demo Booked', 'Demo Completed',
  'Trial Started', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'
];

export default function Settings() {
  const { user } = useAuth();

  // Template State
  const [templates, setTemplates] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templateSubject, setTemplateSubject] = useState('');
  const [templateBody, setTemplateBody] = useState('');

  // Modal State for New Template
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);
  const [newTemplateTitle, setNewTemplateTitle] = useState('');

  // Pipeline Stages State
  const [stages, setStages] = useState(FIXED_STAGES);
  const [newStageInput, setNewStageInput] = useState('');

  // Acquisition Sources State
  const [sources, setSources] = useState([]);
  const [newSourceInput, setNewSourceInput] = useState('');

  // Loading & UI States
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [toast, setToast] = useState(null);

  // Fetch real-time settings from Backend REST API
  const fetchBackendSettings = async () => {
    setIsLoading(true);
    try {
      const res = await getSalesSettings();
      if (res.data?.success && res.data.data) {
        const data = res.data.data;
        if (data.templates && Object.keys(data.templates).length > 0) {
          setTemplates(data.templates);
          const firstKey = Object.keys(data.templates)[0];
          setSelectedTemplate(firstKey);
          setTemplateSubject(data.templates[firstKey]?.subject || '');
          setTemplateBody(data.templates[firstKey]?.body || '');
        }
        if (Array.isArray(data.stages)) {
          setStages(data.stages);
          crmRepository.saveStages(data.stages);
        }
        if (Array.isArray(data.sources)) {
          setSources(data.sources);
          crmRepository.saveSources(data.sources);
        }
      }
    } catch (err) {
      console.error('Error fetching sales settings from backend API:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBackendSettings();
  }, []);

  // Update form inputs when selected template changes
  useEffect(() => {
    if (!selectedTemplate || !templates[selectedTemplate]) return;
    const tpl = templates[selectedTemplate];
    setTemplateSubject(tpl.subject || '');
    setTemplateBody(tpl.body || '');
  }, [selectedTemplate]);

  // Toast auto-clear
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Save template via Backend REST API
  const handleSaveTemplate = async () => {
    if (!selectedTemplate) return;
    setIsSavingTemplate(true);
    try {
      const res = await saveSalesTemplate({
        name: selectedTemplate,
        subject: templateSubject,
        body: templateBody
      });

      if (res.data?.success && res.data.data?.templates) {
        setTemplates(res.data.data.templates);
        setToast({ text: `Template "${selectedTemplate}" saved to database!` });
      } else {
        const updated = {
          ...templates,
          [selectedTemplate]: { subject: templateSubject, body: templateBody }
        };
        setTemplates(updated);
        setToast({ text: `Template "${selectedTemplate}" saved!` });
      }
    } catch (err) {
      console.error('Error saving template:', err);
      setToast({ text: 'Failed to save template.' });
    } finally {
      setIsSavingTemplate(false);
    }
  };

  // Create New Template
  const handleCreateNewTemplate = async () => {
    const title = newTemplateTitle.trim();
    if (!title) return;

    try {
      const res = await saveSalesTemplate({
        name: title,
        subject: `${title} - Hero Logistics`,
        body: `Hi {{contact_name}},\n\nThank you for reaching out to Hero Logistics.\n\nBest,\n{{rep_name}}`
      });

      if (res.data?.success && res.data.data?.templates) {
        setTemplates(res.data.data.templates);
      } else {
        setTemplates(prev => ({
          ...prev,
          [title]: { subject: `${title} - Hero Logistics`, body: 'Hi {{contact_name}},\n\nBest,\n{{rep_name}}' }
        }));
      }

      setSelectedTemplate(title);
      setTemplateSubject(`${title} - Hero Logistics`);
      setTemplateBody(`Hi {{contact_name}},\n\nThank you for reaching out to Hero Logistics.\n\nBest,\n{{rep_name}}`);
      setShowNewTemplateModal(false);
      setNewTemplateTitle('');
      setToast({ text: `New template "${title}" created in database!` });
    } catch (err) {
      console.error('Error creating template:', err);
    }
  };

  // Delete Template from DB
  const handleDeleteTemplate = async () => {
    if (!selectedTemplate) return;
    const nameToDelete = selectedTemplate;
    try {
      const res = await deleteSalesTemplate(nameToDelete);
      if (res.data?.success && res.data.data?.templates) {
        const updated = res.data.data.templates;
        setTemplates(updated);
        const keys = Object.keys(updated);
        if (keys.length > 0) {
          setSelectedTemplate(keys[0]);
        } else {
          setSelectedTemplate('');
          setTemplateSubject('');
          setTemplateBody('');
        }
      }
      setToast({ text: `Template "${nameToDelete}" deleted.` });
    } catch (err) {
      console.error('Error deleting template:', err);
    }
  };

  // Add Pipeline stage via Backend REST API
  const handleAddStage = async () => {
    const val = newStageInput.trim();
    if (!val) return;
    if (stages.includes(val)) {
      setToast({ text: `Stage "${val}" already exists.` });
      return;
    }

    try {
      const res = await addSalesStage(val);
      if (res.data?.success && res.data.data?.stages) {
        setStages(res.data.data.stages);
        crmRepository.saveStages(res.data.data.stages);
      } else {
        const next = [...stages, val];
        setStages(next);
        crmRepository.saveStages(next);
      }
      setToast({ text: `Pipeline stage "${val}" created!` });
    } catch (err) {
      console.error('Error adding stage:', err);
    }
    setNewStageInput('');
  };

  // Delete Pipeline stage via Backend REST API
  const handleDeleteStage = async (stage) => {
    if (FIXED_STAGES.includes(stage)) {
      setToast({ text: `Core pipeline stage "${stage}" cannot be deleted.` });
      return;
    }

    try {
      const res = await deleteSalesStage(stage);
      if (res.data?.success && res.data.data?.stages) {
        setStages(res.data.data.stages);
        crmRepository.saveStages(res.data.data.stages);
      } else {
        const updated = stages.filter(s => s !== stage);
        setStages(updated);
        crmRepository.saveStages(updated);
      }
      setToast({ text: `Stage "${stage}" removed.` });
    } catch (err) {
      console.error('Error deleting stage:', err);
    }
  };

  // Add Acquisition Source via Backend REST API
  const handleAddSource = async () => {
    const val = newSourceInput.trim();
    if (!val) return;
    if (sources.includes(val)) {
      setToast({ text: `Source "${val}" already exists.` });
      return;
    }

    try {
      const res = await addSalesSource(val);
      if (res.data?.success && res.data.data?.sources) {
        setSources(res.data.data.sources);
        crmRepository.saveSources(res.data.data.sources);
      } else {
        const next = [...sources, val];
        setSources(next);
        crmRepository.saveSources(next);
      }
      setToast({ text: `Acquisition source "${val}" created!` });
    } catch (err) {
      console.error('Error adding source:', err);
    }
    setNewSourceInput('');
  };

  // Delete Acquisition Source via Backend REST API
  const handleDeleteSource = async (source) => {
    try {
      const res = await deleteSalesSource(source);
      if (res.data?.success && res.data.data?.sources) {
        setSources(res.data.data.sources);
        crmRepository.saveSources(res.data.data.sources);
      } else {
        const updated = sources.filter(s => s !== source);
        setSources(updated);
        crmRepository.saveSources(updated);
      }
      setToast({ text: `Source "${source}" removed.` });
    } catch (err) {
      console.error('Error deleting source:', err);
    }
  };

  return (
    <div className="flex-grow bg-[#F8FAFC] p-4 sm:p-6 space-y-6 overflow-y-auto w-full text-left font-sans flex flex-col h-full min-h-0">

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[999999] flex items-center justify-between gap-4 px-5 py-3 bg-slate-900 text-white rounded-2xl shadow-2xl text-[13px] font-bold border border-slate-700 animate-slide-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{toast.text}</span>
          </div>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1">
            <Check className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
              Sales Settings & Presets
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
          <p className="text-xs font-medium text-slate-500 mt-2">
            Configure CRM communication templates, pipeline lifecycle stages, and acquisition sources.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Authenticated Identity Indicator */}
          <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-xl text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <div>
              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider leading-none">Logged In</span>
              <strong className="text-slate-900 font-extrabold text-[11px] leading-tight block">{user?.name || 'Sales Officer'}</strong>
            </div>
            <span className="ml-1.5 px-2 py-0.5 bg-amber-100 text-amber-900 font-black text-[9px] rounded-md uppercase">
              {user?.role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : user?.accessProfile || 'SALES_FULL_ACCESS'}
            </span>
          </div>
        </div>
      </div>

      {/* Two-Column Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* LEFT: Email & Touchpoint Templates */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col overflow-hidden">
          {/* Panel Header */}
          <div className="px-5 py-4 border-b border-slate-100 shrink-0 flex items-center justify-between">
            <div>
              <h2 className="text-[13px] font-black text-slate-900">Email &amp; Touchpoint Templates</h2>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                Configure pre-formatted messages for demo slots and trial invites.
              </p>
            </div>
            <button
              onClick={() => { setShowNewTemplateModal(true); setNewTemplateTitle(''); }}
              className="text-[10px] font-black text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-xl uppercase tracking-wider cursor-pointer transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Template</span>
            </button>
          </div>

          <div className="p-5 space-y-4 flex flex-col">
            {/* Select Template */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Select Target Template
                </label>
                {selectedTemplate && (
                  <button
                    onClick={handleDeleteTemplate}
                    className="text-[10px] text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
                    title="Delete Selected Template"
                  >
                    <Trash2 className="w-3 h-3" /> Delete Template
                  </button>
                )}
              </div>
              <div className="relative">
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-[#ffcc00] rounded-xl focus:outline-none text-slate-800 text-xs font-semibold appearance-none cursor-pointer pr-8"
                >
                  {Object.keys(templates).map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                  {Object.keys(templates).length === 0 && (
                    <option value="">No Templates Found (Click New Template to add)</option>
                  )}
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
                placeholder="Subject line..."
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
                placeholder="Enter email template body here..."
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 focus:border-[#ffcc00] rounded-xl focus:outline-none text-slate-700 text-[11px] font-mono resize-none leading-relaxed"
              />
              <p className="text-[9px] text-slate-400 font-semibold mt-1.5">
                Available merge tags: {'{{contact_name}}'}, {'{{company_name}}'}, {'{{rep_name}}'}
              </p>
            </div>

            {/* Save Button */}
            <button
              disabled={isSavingTemplate || !selectedTemplate}
              onClick={handleSaveTemplate}
              className="w-full bg-[#ffcc00] hover:bg-[#e6b800] text-black font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
            >
              {isSavingTemplate ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>Save Template Configuration</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT Column — Pipeline Stages + Acquisition Sources */}
        <div className="space-y-6 flex flex-col">

          {/* Pipeline Stages Panel */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col overflow-hidden h-[340px]">
            <div className="px-6 py-5 shrink-0 flex items-center justify-between border-b border-slate-100">
              <div>
                <h2 className="text-[14px] font-black text-slate-800">Pipeline Stages</h2>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  Add or manage stages defining your sales pipeline columns.
                </p>
              </div>
              <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded uppercase">
                {stages.length} Stages
              </span>
            </div>

            <div className="flex-grow overflow-y-auto px-6 py-3 space-y-2.5">
              {stages.map((stage, idx) => (
                <div key={idx} className="flex items-center justify-between px-4 py-2.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-[11px] font-bold text-slate-700">{stage}</span>
                  {!FIXED_STAGES.includes(stage) && (
                    <button
                      onClick={() => handleDeleteStage(stage)}
                      className="text-slate-400 hover:text-rose-500 cursor-pointer transition-colors p-1"
                      title="Delete Stage"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Stage */}
            <div className="flex items-center gap-2.5 px-6 pb-5 pt-2 border-t border-slate-100 shrink-0 bg-slate-50/50">
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
                className="px-5 py-2.5 bg-[#ffcc00] hover:bg-[#e6b800] text-black font-extrabold text-[11px] rounded-xl cursor-pointer transition-colors whitespace-nowrap shadow-2xs"
              >
                Add Stage
              </button>
            </div>
          </div>

          {/* Lead Acquisition Sources Panel */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col overflow-hidden h-[340px]">
            <div className="px-6 py-5 shrink-0 flex items-center justify-between border-b border-slate-100">
              <div>
                <h2 className="text-[14px] font-black text-slate-800">Lead Acquisition Sources</h2>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  Track and filter where inbound carrier queries originate.
                </p>
              </div>
              <span className="text-[10px] font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded uppercase">
                {sources.length} Sources
              </span>
            </div>

            <div className="flex-grow overflow-y-auto px-6 py-3 space-y-2.5">
              {sources.map((src, idx) => (
                <div key={idx} className="flex items-center justify-between px-4 py-2.5 bg-white border border-slate-200 rounded-xl">
                  <span className="text-[11px] font-bold text-slate-700">{src}</span>
                  <button
                    onClick={() => handleDeleteSource(src)}
                    className="text-slate-400 hover:text-rose-500 cursor-pointer transition-colors p-1"
                    title="Delete Source"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Source */}
            <div className="flex items-center gap-2.5 px-6 pb-5 pt-2 border-t border-slate-100 shrink-0 bg-slate-50/50">
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
                className="px-5 py-2.5 bg-[#ffcc00] hover:bg-[#e6b800] text-black font-extrabold text-[11px] rounded-xl cursor-pointer transition-colors whitespace-nowrap shadow-2xs"
              >
                Add Source
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* NEW TEMPLATE MODAL */}
      {showNewTemplateModal && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999999] flex items-center justify-center p-4 pt-16 sm:pt-20 animate-fade-in text-left"
          onClick={() => setShowNewTemplateModal(false)}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-5 space-y-4 shadow-2xl font-sans max-h-[calc(100vh-6rem)] my-auto flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-sm font-black text-slate-900">Create New Email Template</h2>
              <button onClick={() => setShowNewTemplateModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-bold text-slate-700">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">TEMPLATE TITLE *</label>
                <input
                  type="text"
                  value={newTemplateTitle}
                  onChange={(e) => setNewTemplateTitle(e.target.value)}
                  placeholder="e.g. VIP Carrier Discount Offer"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
                <button 
                  type="button" 
                  onClick={() => setShowNewTemplateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateNewTemplate}
                  className="px-5 py-2 bg-[#ffcc00] hover:bg-[#e6b800] text-black font-extrabold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Create &amp; Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
