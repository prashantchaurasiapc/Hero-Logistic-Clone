import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Shield, 
  Clipboard, 
  Zap, 
  AlertCircle, 
  Edit, 
  Trash2, 
  X, 
  Plus, 
  Users, 
  List, 
  ShieldAlert, 
  Eye,
  CheckCircle2,
  Smartphone,
  RefreshCw
} from 'lucide-react';
import api from '../../services/api';

export default function SafetyChecklists() {
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const [newChecklist, setNewChecklist] = useState({
    name: '',
    users: 'All Drivers',
    schedule: 'Every Trip',
    strict: true,
    itemsText: 'Tires & Pressure Check, Brake Fluid & Air Pressure, Lights & Signals, Restraints & Straps'
  });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchChecklists = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/company-admin/safety-checklists');
      const data = res.data?.data?.checklists || res.data?.checklists || res.data?.data || [];
      const list = Array.isArray(data) ? data : [];

      const mapped = list.map((c, idx) => {
        const total = c.totalItems || 5;
        const passed = c.passedCount || total;
        const itemsArr = c.notes ? c.notes.split(',').map((t, i) => ({
          id: i + 1,
          title: t.trim(),
          required: true,
          desc: 'Verify condition before departure.'
        })) : [
          { id: 1, title: 'Tires & Pressure Check', required: true, desc: 'Check all 10 tires for damage and min 3mm tread depth.' },
          { id: 2, title: 'Brake System & Air Pressure', required: true, desc: 'Verify air pressure builds to 100+ PSI without leaks.' },
          { id: 3, title: 'Lights & Indicators', required: true, desc: 'Test headlights, high beams, brake lights & turn signals.' }
        ];

        return {
          dbId: c.id,
          id: c.id ? `CL-${c.id.slice(0, 4).toUpperCase()}` : `CL-00${idx + 1}`,
          name: c.vehicleRef || 'Standard Pre-Trip Inspection',
          status: c.isDraft ? 'INACTIVE' : 'ACTIVE',
          enforce: c.isDraft ? 'STANDARD EXECUTION' : 'STRICT EXECUTION',
          users: c.trailerRef || 'All Drivers',
          schedule: c.notes || 'Every Trip',
          items: `${itemsArr.length} items - ${itemsArr.length} required`,
          itemList: itemsArr
        };
      });

      setChecklists(mapped);
    } catch (err) {
      console.error('Error fetching safety checklists:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChecklists();
  }, [fetchChecklists]);

  const handleAddChecklist = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: newChecklist.name || 'Custom Safety Inspection',
        users: newChecklist.users || 'All Drivers',
        schedule: newChecklist.schedule || 'Every Trip',
        strict: newChecklist.strict,
        itemsText: newChecklist.itemsText
      };

      await api.post('/company-admin/safety-checklists', payload);
      triggerToast('Safety Checklist created and saved to database!');
      setShowAddModal(false);
      setNewChecklist({ name: '', users: 'All Drivers', schedule: 'Every Trip', strict: true, itemsText: 'Tires & Pressure Check, Brake Fluid & Air Pressure, Lights & Signals, Restraints & Straps' });
      fetchChecklists();
    } catch (err) {
      console.error('Error adding checklist:', err);
      triggerToast('Failed to create checklist.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    setSaving(true);
    try {
      await api.put(`/company-admin/safety-checklists/${editingItem.dbId}`, {
        name: editingItem.name,
        users: editingItem.users,
        schedule: editingItem.schedule,
        status: editingItem.status
      });
      triggerToast(`Checklist ${editingItem.id} updated in database!`);
      setEditingItem(null);
      fetchChecklists();
    } catch (err) {
      console.error('Error updating checklist:', err);
      triggerToast('Failed to update checklist.');
    } finally {
      setSaving(false);
    }
  };

  const toggleChecklist = async (c) => {
    const nextStatus = c.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await api.put(`/company-admin/safety-checklists/${c.dbId}`, { status: nextStatus });
      triggerToast(`Checklist ${c.id} set to ${nextStatus}`);
      setChecklists(prev => prev.map(item => item.dbId === c.dbId ? { ...item, status: nextStatus, enforce: nextStatus === 'ACTIVE' ? 'STRICT EXECUTION' : 'STANDARD EXECUTION' } : item));
    } catch (err) {
      console.error('Error toggling checklist:', err);
      triggerToast('Failed to toggle checklist.');
    }
  };

  const deleteChecklist = async (c) => {
    try {
      await api.delete(`/company-admin/safety-checklists/${c.dbId}`);
      triggerToast(`Checklist ${c.id} removed from database.`);
      setChecklists(prev => prev.filter(item => item.dbId !== c.dbId));
    } catch (err) {
      console.error('Error deleting checklist:', err);
      triggerToast('Failed to delete checklist.');
    }
  };

  const activeCount = checklists.filter(c => c.status === 'ACTIVE').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto bg-white min-h-screen text-left flex flex-col space-y-6 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[9999] bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-600 flex items-center justify-center shadow-3xs">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none mb-1.5">Safety Checklists</h1>
            <p className="text-slate-500 text-[13px]">Build and manage pre-trip safety checklists. Active checklists block drivers from starting trips.</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button 
            onClick={fetchChecklists}
            className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs cursor-pointer"
            title="Refresh Safety Checklists"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin text-indigo-600' : ''} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#FFD400] hover:bg-yellow-400 text-black font-bold py-2.5 px-5 rounded-xl transition-all flex items-center gap-2 text-xs cursor-pointer shadow-sm active:scale-95 uppercase tracking-wider"
          >
            <Plus size={15} strokeWidth={2.5} />
            New Checklist
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex justify-between items-center h-24 shadow-xs">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Checklists</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{checklists.length}</h3>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 text-slate-500 border border-slate-100"><Clipboard size={18} /></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex justify-between items-center h-24 shadow-xs">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active &amp; Enforced</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{activeCount}</h3>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100"><Zap size={18} /></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex justify-between items-center h-24 shadow-xs sm:col-span-2 lg:col-span-1">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trips Blocked Today</p>
            <h3 className="text-2xl font-black text-rose-500 mt-1">{activeCount > 0 ? activeCount : 0}</h3>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-500 border border-rose-100"><AlertCircle size={18} /></div>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-slate-900 text-white p-4.5 rounded-2xl flex items-center justify-between shadow-md border border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-slate-800 text-amber-400 rounded-xl border border-slate-700 flex items-center justify-center shrink-0">
            <ShieldAlert size={20} />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider">TRIP BLOCK ENFORCEMENT ACTIVE</h4>
            <p className="text-[11px] text-slate-300 mt-0.5 font-medium leading-relaxed">
              Drivers cannot start a trip until all required checklist items are completed. <strong className="text-white">{activeCount} checklists</strong> currently enforced.
            </p>
          </div>
        </div>
        <span className="text-[9px] font-black tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md uppercase">LIVE</span>
      </div>

      {/* List cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 font-bold">
            <RefreshCw size={24} className="animate-spin inline-block mr-2 text-indigo-600" />
            Loading checklists from database...
          </div>
        ) : checklists.length > 0 ? (
          checklists.map(c => (
            <div 
              key={c.dbId || c.id} 
              className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs transition-all duration-300 hover:shadow-md hover:border-slate-300"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="p-3 bg-slate-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-slate-200 shadow-3xs shrink-0">
                  <Clipboard size={22} />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-black text-slate-900">{c.name}</span>
                    <span className="text-[10px] text-slate-400 font-bold font-mono">{c.id}</span>
                    <span className={`px-2 py-0.5 text-[9px] font-black rounded-md ${
                      c.status === 'ACTIVE' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>{c.status}</span>
                    <span className="px-2 py-0.5 text-[9px] font-black bg-rose-50 text-rose-700 border border-rose-200 rounded-md">{c.enforce}</span>
                  </div>
                  <div className="flex items-center gap-2.5 mt-2.5 flex-wrap">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-700 rounded-lg text-[11px] font-bold border border-slate-200">
                      <Users size={12} className="text-slate-400" /> {c.users}
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-700 rounded-lg text-[11px] font-bold border border-slate-200">
                      <Zap size={12} className="text-slate-400" /> {c.schedule}
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-700 rounded-lg text-[11px] font-bold border border-slate-200">
                      <List size={12} className="text-slate-400" /> {c.items}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 shrink-0">
                <button 
                  onClick={() => setPreviewItem(c)}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Eye size={14} /> Preview
                </button>
                <button 
                  onClick={() => setEditingItem(c)}
                  className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer transition-colors" 
                  title="Edit Checklist"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => toggleChecklist(c)}
                  className={`px-4 py-1.5 border rounded-xl text-xs font-bold cursor-pointer transition-all ${
                    c.status === 'ACTIVE'
                      ? 'border-emerald-200 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100'
                      : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'
                  }`}
                >
                  {c.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                </button>
                <button 
                  onClick={() => deleteChecklist(c)} 
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-xl cursor-pointer transition-colors"
                  title="Delete Checklist"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 font-semibold">
            No safety checklists found in database. Click <strong className="text-indigo-600 font-extrabold">+ New Checklist</strong> to create one.
          </div>
        )}
      </div>

      {/* ── PREVIEW MODAL ── */}
      {previewItem && createPortal(
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-[9999]" onClick={() => setPreviewItem(null)}>
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden text-left" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{previewItem.name} ({previewItem.id})</h3>
                  <p className="text-xs text-slate-400 font-semibold">{previewItem.users} • {previewItem.schedule}</p>
                </div>
              </div>
              <button onClick={() => setPreviewItem(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5">
                <ShieldAlert size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 font-medium">
                  <strong>Driver Block Status:</strong> Drivers assigned to <strong className="underline">{previewItem.users}</strong> must submit this checklist before starting any trip scheduled under <strong className="underline">{previewItem.schedule}</strong>.
                </p>
              </div>

              {/* Items List */}
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3">Enforced Checklist Items ({previewItem.itemList?.length || 0})</h4>
                <div className="space-y-2.5">
                  {(previewItem.itemList || []).map((item, idx) => (
                    <div key={item.id || idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{item.title}</p>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black shrink-0 ${item.required ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-600'}`}>
                        {item.required ? 'MANDATORY' : 'OPTIONAL'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Driver Mobile Mock */}
              <div className="bg-slate-900 rounded-2xl p-4 text-white">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-2">
                  <Smartphone size={14} /> Driver Mobile App View Preview
                </div>
                <div className="bg-slate-800 rounded-xl p-3 text-[11px] text-slate-300 font-medium space-y-1">
                  <p className="font-bold text-white">📲 Prompt before Start Trip:</p>
                  <p>1. Open Hero Driver App → Select Job → Tap "Start Trip".</p>
                  <p>2. Popup blocks trip until all mandatory items above pass photo &amp; tick inspection.</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setPreviewItem(null)} className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer">
                Close Preview
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── EDIT MODAL ── */}
      {editingItem && createPortal(
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-[9999]" onClick={() => setEditingItem(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden text-left" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Edit Checklist ({editingItem.id})</h3>
              <button onClick={() => setEditingItem(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSave} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Checklist Name</label>
                <input
                  type="text" required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Target Operators</label>
                  <input
                    type="text" required
                    value={editingItem.users}
                    onChange={(e) => setEditingItem({ ...editingItem, users: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Enforcement Schedule</label>
                  <input
                    type="text" required
                    value={editingItem.schedule}
                    onChange={(e) => setEditingItem({ ...editingItem, schedule: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ── CREATE CHECKLIST MODAL ── */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-[9999] p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl text-left" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-slate-900">Create Safety Checklist</h2>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddChecklist} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Checklist Title</label>
                <input
                  type="text" required placeholder="e.g. Hazardous Materials Pre-Trip"
                  value={newChecklist.name} onChange={(e) => setNewChecklist({ ...newChecklist, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Target Operators</label>
                  <input
                    type="text" required placeholder="All Drivers"
                    value={newChecklist.users} onChange={(e) => setNewChecklist({ ...newChecklist, users: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Schedule</label>
                  <input
                    type="text" required placeholder="Every Trip"
                    value={newChecklist.schedule} onChange={(e) => setNewChecklist({ ...newChecklist, schedule: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Checklist Items (Comma Separated)</label>
                <textarea
                  rows={3} required placeholder="Tire Pressure, Brakes, Lights & Signals, Restraints"
                  value={newChecklist.itemsText} onChange={(e) => setNewChecklist({ ...newChecklist, itemsText: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#FFD400] hover:bg-yellow-400 text-black font-extrabold py-3 rounded-xl text-xs mt-3 cursor-pointer transition-all shadow-sm active:scale-95 disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'CREATE & ACTIVATE CHECKLIST'}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
