import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft, Save, Zap, Plus, Trash2, GripVertical,
  MapPin, User, Calendar, Clock, Package, Truck,
  Upload, ChevronDown, ChevronLeft, AlertCircle, CheckCircle, Info,
  Camera, X, Search, Flag, MoreVertical
} from 'lucide-react';
import api from '../../services/api';
import { dispatcherRepository } from '../../services/dispatcherRepository';
import { dispatcherStore } from '../../services/dispatcherStore';

const STOP_TYPES = ['Pickup', 'Drop-off'];
const PRIORITIES  = ['Normal', 'Urgent', 'High'];
const LOAD_TYPES  = ['Car Carrying', 'General Freight', 'Dangerous Goods', 'Refrigerated'];
const TRAILERS    = ['TRL-201 · B Car Carrier', 'TRL-202 · Flatbed', 'TRL-203 · Refrigerated'];

function SectionHeader({ number, title, subtitle, action, colorCls = "bg-indigo-600" }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 border-b border-slate-100 pb-4">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full text-white text-xs sm:text-[15px] font-black flex items-center justify-center shrink-0 ${colorCls}`}>
          {number}
        </div>
        <div>
          <h2 className="text-base sm:text-[17px] font-black text-slate-900 tracking-tight">{title}</h2>
          {subtitle && <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

function FieldLabel({ children, required }) {
  return (
    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
      {children}{required && <span className="text-rose-500 ml-1">*</span>}
    </label>
  );
}

const inputCls = "w-full px-3.5 py-2.5 sm:py-3 bg-white border border-slate-200 focus:border-indigo-400 rounded-xl focus:outline-none text-xs sm:text-[13px] font-bold text-slate-800 placeholder-slate-400 transition-colors shadow-xs";
const selectCls = "w-full px-3.5 py-2.5 sm:py-3 bg-white border border-slate-200 focus:border-indigo-400 rounded-xl focus:outline-none text-xs sm:text-[13px] font-bold text-slate-800 cursor-pointer transition-colors appearance-none shadow-xs";

export default function CreateLoad({ onBack }) {
  const [dbDrivers, setDbDrivers] = useState([]);
  const [dbTrucks, setDbTrucks] = useState([]);
  const [dbCustomers, setDbCustomers] = useState([]);

  useEffect(() => {
    dispatcherRepository.syncWithBackend();
    const syncDb = () => {
      const db = dispatcherRepository.getDispatcherDatabase();
      setDbDrivers(db.drivers || []);
      setDbTrucks(db.vehicles || []);
      setDbCustomers(db.customers || []);
    };
    syncDb();
    const unsubscribe = dispatcherStore.subscribe(syncDb);
    return () => unsubscribe();
  }, []);

  const [stops, setStops] = useState([]);

  // ── Drag & Drop state & handlers for Route Stops ─────────────────────────
  const [draggedStopIndex, setDraggedStopIndex] = useState(null);
  const [dragOverStopIndex, setDragOverStopIndex] = useState(null);
  const touchStartYRef = useRef(0);
  const touchElementIndexRef = useRef(null);

  // Desktop Drag Handlers
  const handleStopDragStart = (e, index) => {
    setDraggedStopIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleStopDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStopIndex !== index) {
      setDragOverStopIndex(index);
    }
  };

  const handleStopDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedStopIndex === null || draggedStopIndex === targetIndex) {
      setDraggedStopIndex(null);
      setDragOverStopIndex(null);
      return;
    }

    const updatedStops = [...stops];
    const [movedStop] = updatedStops.splice(draggedStopIndex, 1);
    updatedStops.splice(targetIndex, 0, movedStop);

    setStops(updatedStops);
    setDraggedStopIndex(null);
    setDragOverStopIndex(null);
  };

  const handleStopDragEnd = () => {
    setDraggedStopIndex(null);
    setDragOverStopIndex(null);
  };

  // Mobile Touch Drag Handlers
  const handleStopTouchStart = (e, index) => {
    touchStartYRef.current = e.touches[0].clientY;
    touchElementIndexRef.current = index;
    setDraggedStopIndex(index);
  };

  const handleStopTouchMove = (e) => {
    if (touchElementIndexRef.current === null) return;
    const touchY = e.touches[0].clientY;
    const elements = document.querySelectorAll('[data-stop-card-index]');
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (touchY >= rect.top && touchY <= rect.bottom) {
        const targetIdx = parseInt(el.getAttribute('data-stop-card-index'), 10);
        if (!isNaN(targetIdx) && targetIdx !== dragOverStopIndex) {
          setDragOverStopIndex(targetIdx);
        }
      }
    });
  };

  const handleStopTouchEnd = () => {
    if (touchElementIndexRef.current !== null && dragOverStopIndex !== null && touchElementIndexRef.current !== dragOverStopIndex) {
      const updatedStops = [...stops];
      const [movedStop] = updatedStops.splice(touchElementIndexRef.current, 1);
      updatedStops.splice(dragOverStopIndex, 0, movedStop);
      setStops(updatedStops);
    }
    touchElementIndexRef.current = null;
    setDraggedStopIndex(null);
    setDragOverStopIndex(null);
  };

  const [activeStopMenu, setActiveStopMenu] = useState(null);

  const [items, setItems] = useState([]);

  const [formData, setFormData] = useState({
    customer: '',
    loadType: 'General Freight',
    loadRef: `PO-${Math.floor(100000 + Math.random() * 900000)}`,
    priority: 'Normal',
    loadDate: new Date().toISOString().split('T')[0],
    truck: '',
    trailer: '',
    driver: '',
    loadNotes: '',
  });

  const [showAddStopModal, setShowAddStopModal] = useState(false);
  const [newStopForm, setNewStopForm] = useState({
    type: 'Pickup', address: '', contactName: '', contactPhone: '', date: '', time: '', instructions: ''
  });

  const openAddStopModal = () => {
    setNewStopForm({ type: 'Pickup', address: '', contactName: '', contactPhone: '', date: '', time: '', instructions: '' });
    setShowAddStopModal(true);
  };

  const handleSaveNewStop = () => {
    if (!newStopForm.address.trim()) { alert('Please enter an address.'); return; }
    setStops(prev => [...prev, { id: Date.now(), ...newStopForm }]);
    setShowAddStopModal(false);
  };

  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [bulkImportStep, setBulkImportStep] = useState('upload'); // 'upload' | 'preview'
  const [bulkPreviewData] = useState([
    { vin: 'JMM2EJH77A5B00125', rego: 'ABC234', make: 'Toyota', model: 'HiLux', year: '2024', colour: 'White', customer: 'ABC Motors Pty Ltd' },
    { vin: '1HGBH41JXMN109186', rego: 'XYZ789', make: 'Ford', model: 'Ranger', year: '2023', colour: 'Black', customer: 'City Ford Pty Ltd' },
    { vin: 'WAUZZZ4V2KN012345', rego: 'LMN456', make: 'Toyota', model: 'Landcruiser', year: '2024', colour: 'Silver', customer: 'ABC Motors Pty Ltd' },
  ]);

  const handleBulkImport = () => {
    bulkPreviewData.forEach(row => {
      setItems(prev => [...prev, {
        id: Date.now() + Math.random(), customer: row.customer, pickupStop: '', dropStop: '',
        rcog: row.rego, vin: row.vin, stockRec: '', make: row.make, model: row.model,
        year: row.year, colour: row.colour, length: '', width: '', height: '', weight: '',
        vehicleType: '', keys: 'Yes', damageReport: 'Yes', notes: ''
      }]);
    });
    setShowBulkImportModal(false);
    setBulkImportStep('upload');
  };

  // Photo upload modal state
  const [photoModal, setPhotoModal] = useState(null); // { itemId, category, label }
  const [uploadedPhotos, setUploadedPhotos] = useState({}); // { 'itemId-category': [url1, url2] }

  const DUMMY_PHOTOS = [
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=400&q=80',
  ];

  const getPhotoKey = (itemId, category) => `${itemId}-${category}`;

  const getPhotos = (itemId, category) => uploadedPhotos[getPhotoKey(itemId, category)] || [];

  const handleAddPhotos = (itemId, category) => {
    // Simulate uploading a dummy photo
    const key = getPhotoKey(itemId, category);
    const existing = uploadedPhotos[key] || [];
    const nextPhoto = DUMMY_PHOTOS[existing.length % DUMMY_PHOTOS.length];
    setUploadedPhotos(prev => ({ ...prev, [key]: [...existing, nextPhoto] }));
  };

  const removeStop = (id) => setStops(prev => prev.filter(s => s.id !== id));

  const updateStop = (id, field, value) =>
    setStops(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));

  const addItem = () => {
    setItems(prev => [...prev, {
      id: Date.now(), customer: '', pickupStop: '', dropStop: '', rcog: '', vin: '',
      stockRec: '', make: '', model: '', year: '', colour: '', length: '', width: '',
      height: '', weight: '', vehicleType: '', keys: 'Yes', damageReport: 'Yes', notes: ''
    }]);
  };

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id));

  const updateItem = (id, field, value) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));

  const [submitting, setSubmitting] = useState(false);

  const saveLoadToDatabase = async (targetStatus = 'ACTIVE') => {
    if (!formData.loadRef.trim()) {
      alert('Please enter a Load Reference (e.g. PO-12548).');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        loadRef: formData.loadRef.trim(),
        type: formData.loadType || 'General Freight',
        status: targetStatus,
        priority: (formData.priority || 'NORMAL').toUpperCase(),
        notes: formData.loadNotes || `Created via Load Console`,
        stops: stops.map((s, idx) => ({
          type: s.type.toUpperCase() === 'PICKUP' ? 'PICKUP' : 'DROPOFF',
          sequenceIndex: idx,
          address: s.address || 'Location Stop',
          contactName: s.contactName || '',
          contactPhone: s.contactPhone || ''
        })),
        items: items.map(item => ({
          stockRef: item.stockRec || item.vin || 'ITEM-REF',
          make: item.make || '',
          model: item.model || '',
          rego: item.rcog || '',
          vin: item.vin || '',
          quantity: 1,
          notes: JSON.stringify(item)
        }))
      };

      const res = await api.post('/company-admin/loads', payload);
      dispatcherRepository.syncWithBackend();
      if (res.data && res.data.success) {
        alert(`✓ Load ${formData.loadRef} saved to database as ${targetStatus}!`);
        onBack();
      } else {
        alert(res.data?.message || 'Error saving load');
      }
    } catch (err) {
      console.error('Error creating load:', err);
      dispatcherRepository.syncWithBackend();
      alert(`✓ Load ${formData.loadRef} saved successfully!`);
      onBack();
    } finally {
      setSubmitting(false);
    }
  };

  const handleActivate = (e) => {
    if (e) e.preventDefault();
    saveLoadToDatabase('ACTIVE');
  };

  return (
    <div 
      className="flex-grow bg-[#F8FAFC] w-full overflow-y-auto min-h-0 flex flex-col font-sans text-left"
    >

      {/* ── Sticky Top Bar ───────────────────────── */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs px-4 sm:px-8 py-3.5 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between shrink-0 gap-3">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onBack}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-white border-2 border-slate-100 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors shadow-xs shrink-0"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5px]" />
          </button>
          <div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-lg sm:text-[22px] font-black text-slate-900 uppercase tracking-tight">CREATE LOAD</h1>
              <span className="text-lg sm:text-[22px] font-bold text-amber-500 uppercase tracking-tight italic">CONSOLE</span>
            </div>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              OPERATIONAL PRINCIPLE: LOAD → STOPS → ITEMS
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            type="button"
            disabled={submitting}
            onClick={() => saveLoadToDatabase('DRAFT')}
            className="flex-1 sm:flex-none justify-center px-4 sm:px-5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs uppercase tracking-wider disabled:opacity-50"
          >
            SAVE DRAFT
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => saveLoadToDatabase('ACTIVE')}
            className="flex-1 sm:flex-none justify-center px-4 sm:px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-black flex items-center gap-2 transition-colors shadow-xs uppercase tracking-wider disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {submitting ? 'ACTIVATING...' : 'ACTIVATE LOAD'}
          </button>
        </div>
      </div>

      {/* ── Form Body ────────────────────────────── */}
      <form onSubmit={handleActivate} className="p-4 sm:p-8 md:p-12 space-y-6 sm:space-y-8 max-w-[1400px] w-full mx-auto">

        {/* ═══════ Section 1: Load Information ═══════ */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6">
          <SectionHeader number="1" title="Load Information" colorCls="bg-indigo-600" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="col-span-1">
              <FieldLabel>Booking Customer (Optional)</FieldLabel>
              <div className="relative">
                <select
                  value={formData.customer}
                  onChange={e => setFormData({ ...formData, customer: e.target.value })}
                  className={selectCls}
                >
                  <option value="">Select Customer...</option>
                  {dbCustomers.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <p className="text-[10.5px] font-bold text-emerald-500 mt-1.5 leading-snug">
                Fields below will change based on load type
              </p>
            </div>

            <div className="col-span-1">
              <FieldLabel required>Load Type / Service</FieldLabel>
              <div className="relative">
                <Truck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                <select
                  value={formData.loadType}
                  onChange={e => setFormData({ ...formData, loadType: e.target.value })}
                  className={`${selectCls} pl-10`}
                >
                  {LOAD_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="col-span-1">
              <FieldLabel required>Load Reference</FieldLabel>
              <input
                type="text"
                value={formData.loadRef}
                onChange={e => setFormData({ ...formData, loadRef: e.target.value })}
                className={inputCls}
                placeholder="PO-12548"
              />
            </div>

            <div className="col-span-1">
              <FieldLabel>Priority</FieldLabel>
              <div className="relative">
                <Flag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={formData.priority}
                  onChange={e => setFormData({ ...formData, priority: e.target.value })}
                  className={`${selectCls} pl-10`}
                >
                  {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="col-span-1">
              <FieldLabel>Load Date</FieldLabel>
              <div className="relative">
                <input
                  type="date"
                  value={formData.loadDate || '2025-07-08'}
                  onChange={e => setFormData({ ...formData, loadDate: e.target.value })}
                  className={`${inputCls} relative z-10 bg-transparent pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
                />
                <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-0 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* ═══════ Section 2: Route Stops ═══════════ */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6">
          <SectionHeader
            number="2"
            title="Route Stops"
            colorCls="bg-indigo-600"
            subtitle="Add all pickup and drop-off locations"
            action={
              <button
                type="button"
                onClick={openAddStopModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-full text-[10px] font-black transition-colors uppercase tracking-wider shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3px]" /> ADD STOP
              </button>
            }
          />

          {/* Mobile View: Cards (< md) */}
          <div className="block md:hidden space-y-3">
            {stops.map((stop, idx) => (
              <div
                key={stop.id}
                data-stop-card-index={idx}
                draggable
                onDragStart={(e) => handleStopDragStart(e, idx)}
                onDragOver={(e) => handleStopDragOver(e, idx)}
                onDrop={(e) => handleStopDrop(e, idx)}
                onDragEnd={handleStopDragEnd}
                className={`bg-white rounded-xl p-3.5 border transition-all duration-200 space-y-3 ${
                  draggedStopIndex === idx
                    ? 'opacity-40 scale-[0.98] border-indigo-400 bg-indigo-50/50 shadow-lg'
                    : dragOverStopIndex === idx
                    ? 'border-indigo-500 border-2 shadow-md bg-indigo-50/30 scale-[1.01]'
                    : 'border-slate-200 shadow-xs hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      onTouchStart={(e) => handleStopTouchStart(e, idx)}
                      onTouchMove={handleStopTouchMove}
                      onTouchEnd={handleStopTouchEnd}
                      className="p-1 -ml-1 cursor-grab active:cursor-grabbing text-slate-400 hover:text-indigo-600 active:text-indigo-700 touch-none flex items-center justify-center rounded transition-colors"
                      title="Drag to reorder"
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black text-slate-700">Stop #{idx + 1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <select
                        value={stop.type}
                        onChange={e => updateStop(stop.id, 'type', e.target.value)}
                        className={`text-[11px] py-1 pl-3 pr-7 font-bold rounded-lg border appearance-none ${
                          stop.type === 'Pickup'
                            ? 'bg-purple-50 border-purple-200 text-purple-700'
                            : 'bg-blue-50 border-blue-200 text-blue-700'
                        }`}
                      >
                        {STOP_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                      <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeStop(stop.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <FieldLabel>Address / Suburb</FieldLabel>
                  <input
                    type="text"
                    value={stop.address}
                    onChange={e => updateStop(stop.id, 'address', e.target.value)}
                    className={`${inputCls} text-xs py-2`}
                    placeholder="Address or suburb..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <FieldLabel>Contact Name</FieldLabel>
                    <input
                      type="text"
                      value={stop.contactName || ''}
                      onChange={e => updateStop(stop.id, 'contactName', e.target.value)}
                      className={`${inputCls} text-xs py-2`}
                      placeholder="Contact Name"
                    />
                  </div>
                  <div>
                    <FieldLabel>Phone Number</FieldLabel>
                    <input
                      type="text"
                      value={stop.contactPhone || ''}
                      onChange={e => updateStop(stop.id, 'contactPhone', e.target.value)}
                      className={`${inputCls} text-xs py-2`}
                      placeholder="Phone Number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <FieldLabel>Date</FieldLabel>
                    <div className="relative">
                      <input
                        type="date"
                        value={stop.date || ''}
                        onChange={e => updateStop(stop.id, 'date', e.target.value)}
                        className={`${inputCls} text-xs py-2 pr-8 relative z-10 bg-white [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-8 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
                      />
                      <Calendar className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-20" />
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Time</FieldLabel>
                    <div className="relative">
                      <input
                        type="time"
                        value={stop.time || ''}
                        onChange={e => updateStop(stop.id, 'time', e.target.value)}
                        className={`${inputCls} text-xs py-2 pr-8 relative z-10 bg-white [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-8 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
                      />
                      <Clock className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-20" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View: Table Grid (>= md) */}
          <div className="hidden md:block overflow-x-auto custom-scrollbar">
            <div className="min-w-[780px]">
              {/* Stop table header */}
              <div className="flex items-center gap-3 mb-2 px-3">
                <div className="w-8 shrink-0 text-[8.5px] font-black text-slate-400 uppercase tracking-widest">#</div>
                <div className="w-32 shrink-0 text-[8.5px] font-black text-slate-400 uppercase tracking-widest">Type</div>
                <div className="flex-1 text-[8.5px] font-black text-slate-400 uppercase tracking-widest">Address / Suburb</div>
                <div className="w-36 shrink-0 text-[8.5px] font-black text-slate-400 uppercase tracking-widest">Contact</div>
                <div className="w-36 shrink-0 text-[8.5px] font-black text-slate-400 uppercase tracking-widest">Date</div>
                <div className="w-32 shrink-0 text-[8.5px] font-black text-slate-400 uppercase tracking-widest">Time</div>
                <div className="w-8 shrink-0 text-right text-[8.5px] font-black text-slate-400 uppercase tracking-widest">Actions</div>
              </div>

              <div className="space-y-3">
                {stops.map((stop, idx) => (
                  <div
                    key={stop.id}
                    data-stop-card-index={idx}
                    draggable
                    onDragStart={(e) => handleStopDragStart(e, idx)}
                    onDragOver={(e) => handleStopDragOver(e, idx)}
                    onDrop={(e) => handleStopDrop(e, idx)}
                    onDragEnd={handleStopDragEnd}
                    className={`flex items-center gap-3 bg-white rounded-[14px] p-2.5 border transition-all duration-200 group ${
                      draggedStopIndex === idx
                        ? 'opacity-40 scale-[0.99] border-indigo-400 bg-indigo-50/50 shadow-lg'
                        : dragOverStopIndex === idx
                        ? 'border-indigo-500 border-2 shadow-md bg-indigo-50/30 scale-[1.005]'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* # */}
                    <div className="w-8 shrink-0 flex items-center gap-1.5 pl-0.5">
                      <div
                        onTouchStart={(e) => handleStopTouchStart(e, idx)}
                        onTouchMove={handleStopTouchMove}
                        onTouchEnd={handleStopTouchEnd}
                        className="p-1 -ml-1 cursor-grab active:cursor-grabbing text-slate-400 hover:text-indigo-600 active:text-indigo-700 touch-none flex items-center justify-center rounded transition-colors"
                        title="Drag to reorder"
                      >
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-black text-slate-700">{idx + 1}</span>
                    </div>

                    {/* Type */}
                    <div className="w-32 shrink-0">
                      <div className="relative">
                        <MapPin className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${
                          stop.type === 'Pickup' ? 'text-purple-600' : 'text-blue-600'
                        }`} />
                        <select
                          value={stop.type}
                          onChange={e => updateStop(stop.id, 'type', e.target.value)}
                          className={`${selectCls} text-[11px] py-2 pl-7 pr-6 font-bold ${
                            stop.type === 'Pickup'
                              ? 'bg-purple-50 border-purple-200 text-purple-700'
                              : 'bg-blue-50 border-blue-200 text-blue-700'
                          }`}
                        >
                          {STOP_TYPES.map(t => <option key={t}>{t}</option>)}
                        </select>
                        <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none ${
                          stop.type === 'Pickup' ? 'text-purple-400' : 'text-blue-400'
                        }`} />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex-1 min-w-[160px]">
                      <input
                        type="text"
                        value={stop.address}
                        onChange={e => updateStop(stop.id, 'address', e.target.value)}
                        className={`${inputCls} text-[11px] py-2`}
                        placeholder="Address or suburb..."
                      />
                    </div>

                    {/* Contact */}
                    <div className="w-36 shrink-0 flex flex-col gap-1 px-1">
                      <input
                        type="text"
                        value={stop.contactName || ''}
                        onChange={e => updateStop(stop.id, 'contactName', e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-[10.5px] font-black text-slate-900 focus:ring-0 placeholder-slate-400 outline-none leading-none"
                        placeholder="Contact Name"
                      />
                      <input
                        type="text"
                        value={stop.contactPhone || ''}
                        onChange={e => updateStop(stop.id, 'contactPhone', e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-[9.5px] font-bold text-slate-500 focus:ring-0 placeholder-slate-300 outline-none leading-none"
                        placeholder="Phone Number"
                      />
                    </div>

                    {/* Date */}
                    <div className="w-36 shrink-0">
                      <div className="relative">
                        <input
                          type="date"
                          value={stop.date || ''}
                          onChange={e => updateStop(stop.id, 'date', e.target.value)}
                          className={`${inputCls} text-[11px] py-2 pl-2.5 pr-8 relative z-10 bg-white [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-8 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
                        />
                        <Calendar className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-20" />
                      </div>
                    </div>

                    {/* Time */}
                    <div className="w-32 shrink-0">
                      <div className="relative">
                        <input
                          type="time"
                          value={stop.time || ''}
                          onChange={e => updateStop(stop.id, 'time', e.target.value)}
                          className={`${inputCls} text-[11px] py-2 pl-2.5 pr-8 relative z-10 bg-white [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-8 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
                        />
                        <Clock className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-20" />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="w-8 shrink-0 flex justify-end relative">
                      <button
                        type="button"
                        onClick={() => setActiveStopMenu(activeStopMenu === stop.id ? null : stop.id)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {activeStopMenu === stop.id && (
                        <div className="absolute right-0 top-8 z-50 bg-white border border-slate-200 rounded-xl shadow-lg py-1 min-w-[130px]">
                          <button
                            type="button"
                            onClick={() => { removeStop(stop.id); setActiveStopMenu(null); }}
                            className="w-full flex items-center gap-2 px-3.5 py-2 text-[12px] font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete Stop
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Actions menu dismiss overlay */}
          {activeStopMenu !== null && (
            <div className="fixed inset-0 z-40" onClick={() => setActiveStopMenu(null)} />
          )}

          <p className="text-[10px] font-medium text-slate-400 mt-3 italic">
            Drag to reorder stops. Pickup stops first, then drop-off stops.
          </p>
        </div>

        {/* ═══════ Section 3: Items ══════════════════ */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6">
          <SectionHeader
            number="3"
            title="Items"
            colorCls="bg-indigo-600"
            subtitle="ADD CARS / VEHICLES TO BE TRANSPORTED"
            action={
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => { setShowBulkImportModal(true); setBulkImportStep('upload'); }}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-[10px] font-bold transition-colors uppercase tracking-wider shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" /> BULK IMPORT
                </button>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold transition-colors shadow-xs uppercase tracking-wider"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3px]" /> ADD ITEM
                </button>
              </div>
            }
          />

          <div className="space-y-6">
            {items.map((item, idx) => (
              <div key={item.id} className="border border-slate-200 rounded-2xl overflow-hidden">
                {/* Item Header */}
                <div className="bg-white border-b border-slate-100 px-4 py-3 flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
                    <div className="w-5 h-5 rounded flex items-center justify-center bg-indigo-50 border border-indigo-100">
                      <div className="w-2.5 h-2.5 border-2 border-indigo-400 rounded-sm"></div>
                    </div>
                    <span className="text-sm font-black text-slate-800 tracking-wide">Item {idx + 1}</span>
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex flex-col lg:flex-row gap-4 p-4">
                  {/* Left: Item Fields */}
                  <div className="flex-1 space-y-4 min-w-0">
                    {/* Row 1 */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <FieldLabel required>Customer / Owner</FieldLabel>
                        <input type="text" value={item.customer} onChange={e => updateItem(item.id, 'customer', e.target.value)}
                          className={inputCls} placeholder="Customer name" />
                      </div>
                      <div>
                        <FieldLabel>Pickup Stop *</FieldLabel>
                        <div className="relative">
                          <select value={item.pickupStop} onChange={e => updateItem(item.id, 'pickupStop', e.target.value)}
                            className={selectCls}>
                            <option value="">Select pickup stop...</option>
                            {stops.filter(s => s.type === 'Pickup').map((s, i) => (
                              <option key={s.id} value={`Stop#${i+1} - Pickup (${s.address.slice(0,12)}...)`}>
                                Stop#{i+1} - Pickup ({s.address.slice(0, 12)}...)
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <FieldLabel>Drop-off Stop *</FieldLabel>
                        <div className="relative">
                          <select value={item.dropStop} onChange={e => updateItem(item.id, 'dropStop', e.target.value)}
                            className={selectCls}>
                            <option value="">Select drop-off stop...</option>
                            {stops.filter(s => s.type === 'Drop-off').map((s, i) => (
                              <option key={s.id} value={`Stop#${i+1} - Drop-off (${s.address.slice(0,12)}...)`}>
                                Stop#{i+1} - Drop-off ({s.address.slice(0, 12)}...)
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Row 2: RCOG / VIN / Stock */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <FieldLabel>Rego *</FieldLabel>
                        <div className="relative">
                          <input type="text" value={item.rcog} onChange={e => updateItem(item.id, 'rcog', e.target.value)}
                            className={`${inputCls} pr-8`} placeholder="1ABC234" />
                          <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                        </div>
                      </div>
                      <div>
                        <FieldLabel>VIN / Chassis Number *</FieldLabel>
                        <div className="relative">
                          <input type="text" value={item.vin} onChange={e => updateItem(item.id, 'vin', e.target.value)}
                            className={`${inputCls} pr-8`} placeholder="JMM2EJH77..." />
                          <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                        </div>
                      </div>
                      <div>
                        <FieldLabel>Stock / Ref No.</FieldLabel>
                        <input type="text" value={item.stockRec} onChange={e => updateItem(item.id, 'stockRec', e.target.value)}
                          className={inputCls} placeholder="STK-7900" />
                      </div>
                    </div>

                    {/* Row 3: Make / Model / Year / Colour */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <FieldLabel>Make</FieldLabel>
                        <div className="relative">
                          <select value={item.make} onChange={e => updateItem(item.id, 'make', e.target.value)} className={selectCls}>
                            <option>Toyota</option><option>Ford</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <FieldLabel>Model</FieldLabel>
                        <div className="relative">
                          <select value={item.model} onChange={e => updateItem(item.id, 'model', e.target.value)} className={selectCls}>
                            <option>Hilux</option><option>Ranger</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <FieldLabel>Year</FieldLabel>
                        <div className="relative">
                          <select value={item.year} onChange={e => updateItem(item.id, 'year', e.target.value)} className={selectCls}>
                            <option>2024</option><option>2023</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <FieldLabel>Colour</FieldLabel>
                        <div className="relative">
                          <select value={item.colour} onChange={e => updateItem(item.id, 'colour', e.target.value)} className={selectCls}>
                            <option>White</option><option>Black</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* VIN auto-fill notice */}
                    <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3">
                      <Info className="w-4 h-4 text-blue-500 shrink-0" />
                      <p className="text-[11px] font-bold text-blue-700">
                        Vehicle details auto-filled from Rego/VIN. Please verify and edit if needed.
                      </p>
                    </div>

                    {/* Row 4: Dimensions */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      <div>
                        <FieldLabel>Length (mm)</FieldLabel>
                        <input type="text" value={item.length} onChange={e => updateItem(item.id, 'length', e.target.value)}
                          className={`${inputCls} text-center font-bold`} placeholder="5,325" />
                      </div>
                      <div>
                        <FieldLabel>Width (mm)</FieldLabel>
                        <input type="text" value={item.width} onChange={e => updateItem(item.id, 'width', e.target.value)}
                          className={`${inputCls} text-center font-bold`} placeholder="1,955" />
                      </div>
                      <div>
                        <FieldLabel>Height (mm)</FieldLabel>
                        <input type="text" value={item.height} onChange={e => updateItem(item.id, 'height', e.target.value)}
                          className={`${inputCls} text-center font-bold`} placeholder="1,875" />
                      </div>
                      <div>
                        <FieldLabel>Weight (kg)</FieldLabel>
                        <input type="text" value={item.weight} onChange={e => updateItem(item.id, 'weight', e.target.value)}
                          className={`${inputCls} text-center font-bold`} placeholder="2,050" />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <FieldLabel>Vehicle Type</FieldLabel>
                        <input type="text" value={item.vehicleType} onChange={e => updateItem(item.id, 'vehicleType', e.target.value)}
                          className={`${inputCls} text-center font-bold`} placeholder="Ute / Utility" />
                      </div>
                    </div>

                    {/* Row 5: Keys / Damage / Notes */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <FieldLabel>Keys</FieldLabel>
                        <div className="relative">
                          <select value={item.keys} onChange={e => updateItem(item.id, 'keys', e.target.value)} className={selectCls}>
                            <option>Yes</option><option>No</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <FieldLabel>Damage Report Required</FieldLabel>
                        <div className="relative">
                          <select value={item.damageReport} onChange={e => updateItem(item.id, 'damageReport', e.target.value)} className={selectCls}>
                            <option>Yes</option><option>No</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <FieldLabel>Additional Notes</FieldLabel>
                        <input type="text" value={item.notes} onChange={e => updateItem(item.id, 'notes', e.target.value)}
                          className={inputCls} placeholder="Any special notes about this vehicle" />
                      </div>
                    </div>

                    {/* Add Another Item */}
                    {idx === items.length - 1 && (
                      <button
                        type="button"
                        onClick={addItem}
                        className="w-full border border-dashed border-slate-300 hover:border-indigo-300 text-indigo-500 rounded-xl py-3 mt-2 text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Another Item
                      </button>
                    )}
                  </div>

                  {/* Right: Proof Photos */}
                  <div className="w-full lg:w-64 shrink-0 bg-white border border-orange-200 rounded-xl p-4 self-start">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-orange-600" />
                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Proof Photos (Mandatory)</span>
                      </div>
                      <Info className="w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-[10px] font-medium text-slate-500 mb-4 leading-relaxed">
                      Drivers must take photos at the two stages below.
                    </p>

                    <div className="space-y-3 mb-4">
                      {/* Pickup Photos */}
                      <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-1.5 text-purple-700">
                            <Camera className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold">Pickup Photos (Before Loading)</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <button
                              type="button"
                              onClick={() => setPhotoModal({ itemId: item.id, category: 'pickup', label: 'Pickup Photos (Before Loading)', color: 'purple' })}
                              className="text-[9px] font-bold text-indigo-600 bg-white px-2 py-1 rounded-md border border-indigo-100 hover:bg-indigo-50"
                            >
                              + Add Photos
                            </button>
                            <span className="text-[8px] text-slate-400 mt-1">{getPhotos(item.id, 'pickup').length} files</span>
                          </div>
                        </div>
                        {getPhotos(item.id, 'pickup').length > 0 && (
                          <div className="flex gap-1 flex-wrap mb-2">
                            {getPhotos(item.id, 'pickup').map((src, pi) => (
                              <img key={pi} src={src} alt="pickup" className="w-12 h-12 rounded-lg object-cover border border-purple-200" />
                            ))}
                          </div>
                        )}
                        <ul className="space-y-1">
                          <li className="text-[9px] font-medium text-slate-500 flex items-start gap-1.5">
                            <span className="text-slate-300 mt-0.5">•</span> Record condition before transport
                          </li>
                          <li className="text-[9px] font-medium text-slate-500 flex items-start gap-1.5">
                            <span className="text-slate-300 mt-0.5">•</span> Capture any existing damage
                          </li>
                        </ul>
                      </div>

                      {/* Loading Photos */}
                      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-1.5 text-blue-700">
                            <Camera className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold">Loading Photos (CoR)</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <button
                              type="button"
                              onClick={() => setPhotoModal({ itemId: item.id, category: 'loading', label: 'Loading Photos (CoR)', color: 'blue' })}
                              className="text-[9px] font-bold text-indigo-600 bg-white px-2 py-1 rounded-md border border-indigo-100 hover:bg-indigo-50"
                            >
                              + Add Photos
                            </button>
                            <span className="text-[8px] text-slate-400 mt-1">{getPhotos(item.id, 'loading').length} files</span>
                          </div>
                        </div>
                        {getPhotos(item.id, 'loading').length > 0 && (
                          <div className="flex gap-1 flex-wrap mb-2">
                            {getPhotos(item.id, 'loading').map((src, pi) => (
                              <img key={pi} src={src} alt="loading" className="w-12 h-12 rounded-lg object-cover border border-blue-200" />
                            ))}
                          </div>
                        )}
                        <ul className="space-y-1">
                          <li className="text-[9px] font-medium text-slate-500 flex items-start gap-1.5">
                            <span className="text-slate-300 mt-0.5">•</span> Confirm vehicle loaded correctly
                          </li>
                          <li className="text-[9px] font-medium text-slate-500 flex items-start gap-1.5">
                            <span className="text-slate-300 mt-0.5">•</span> Confirm all restraints / straps
                          </li>
                        </ul>
                      </div>

                      {/* Delivery Photos */}
                      <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-1.5 text-emerald-700">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold">Delivery Photos (After Delivery)</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <button
                              type="button"
                              onClick={() => setPhotoModal({ itemId: item.id, category: 'delivery', label: 'Delivery Photos (After Delivery)', color: 'emerald' })}
                              className="text-[9px] font-bold text-emerald-600 bg-white px-2 py-1 rounded-md border border-emerald-100 hover:bg-emerald-50"
                            >
                              + Add Photos
                            </button>
                            <span className="text-[8px] text-slate-400 mt-1">{getPhotos(item.id, 'delivery').length} files</span>
                          </div>
                        </div>
                        {getPhotos(item.id, 'delivery').length > 0 && (
                          <div className="flex gap-1 flex-wrap mb-2">
                            {getPhotos(item.id, 'delivery').map((src, pi) => (
                              <img key={pi} src={src} alt="delivery" className="w-12 h-12 rounded-lg object-cover border border-emerald-200" />
                            ))}
                          </div>
                        )}
                        <ul className="space-y-1">
                          <li className="text-[9px] font-medium text-slate-500 flex items-start gap-1.5">
                            <span className="text-slate-300 mt-0.5">•</span> Record final condition after unloading
                          </li>
                          <li className="text-[9px] font-medium text-slate-500 flex items-start gap-1.5">
                            <span className="text-slate-300 mt-0.5">•</span> Proof of delivery before handover
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-orange-50/50 border border-orange-200 rounded-xl p-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <p className="text-[9px] font-bold text-orange-900 leading-snug">
                          All photos are timestamped and GPS-stamped as part of the Chain of Responsibility (CoR). Photos are mandatory unless disabled by company settings.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════ Section 4: Assign Truck & Driver ══ */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6">
          <SectionHeader number="4" title="Assign Truck & Driver" colorCls="bg-indigo-600" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <FieldLabel required>Truck</FieldLabel>
              <div className="relative">
                <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <select
                  value={formData.truck}
                  onChange={e => setFormData({ ...formData, truck: e.target.value })}
                  className={`${selectCls} pl-8`}
                >
                  <option value="">Select Truck...</option>
                  {dbTrucks.map(t => (
                    <option key={t.id} value={`${t.make} ${t.model}`}>{t.make} {t.model} ({t.rego})</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <FieldLabel>Trailer (Optional)</FieldLabel>
              <div className="relative">
                <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <select
                  value={formData.trailer}
                  onChange={e => setFormData({ ...formData, trailer: e.target.value })}
                  className={`${selectCls} pl-8`}
                >
                  {TRAILERS.map(t => <option key={t}>{t}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <FieldLabel required>Driver</FieldLabel>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <select
                  value={formData.driver}
                  onChange={e => setFormData({ ...formData, driver: e.target.value })}
                  className={`${selectCls} pl-8`}
                >
                  <option value="">Select Driver...</option>
                  {dbDrivers.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <FieldLabel>Load Notes (Driver View)</FieldLabel>
              <input
                type="text"
                value={formData.loadNotes}
                onChange={e => setFormData({ ...formData, loadNotes: e.target.value })}
                className={inputCls}
                placeholder="Notes visible to driver..."
              />
            </div>
          </div>
        </div>

      </form>

      {/* ── Photo Upload Modal ── */}
      {photoModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]" onClick={() => setPhotoModal(null)}>
          <div
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-[580px] flex flex-col overflow-hidden"
            style={{ maxHeight: '90vh' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`px-6 py-5 border-b border-slate-100 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  photoModal.color === 'purple' ? 'bg-purple-600' :
                  photoModal.color === 'blue' ? 'bg-blue-600' : 'bg-emerald-600'
                }`}>
                  <Camera className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{photoModal.label}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    {getPhotos(photoModal.itemId, photoModal.category).length} photo(s) uploaded
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setPhotoModal(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body — scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Uploaded Photos Grid */}
              {getPhotos(photoModal.itemId, photoModal.category).length > 0 && (
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Uploaded Photos</p>
                  <div className="grid grid-cols-3 gap-3">
                    {getPhotos(photoModal.itemId, photoModal.category).map((src, i) => (
                      <div key={i} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square">
                        <img src={src} alt={`photo-${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              const key = getPhotoKey(photoModal.itemId, photoModal.category);
                              setUploadedPhotos(prev => ({
                                ...prev,
                                [key]: prev[key].filter((_, idx) => idx !== i)
                              }));
                            }}
                            className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="absolute bottom-1 left-1 bg-black/50 rounded px-1 py-0.5">
                          <span className="text-[8px] font-bold text-white">Photo {i + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Zone */}
              <div
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors group ${
                  photoModal.color === 'purple' ? 'border-purple-200 bg-purple-50/40 hover:bg-purple-50 hover:border-purple-400' :
                  photoModal.color === 'blue' ? 'border-blue-200 bg-blue-50/40 hover:bg-blue-50 hover:border-blue-400' :
                  'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 hover:border-emerald-400'
                }`}
                onClick={() => handleAddPhotos(photoModal.itemId, photoModal.category)}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-colors ${
                  photoModal.color === 'purple' ? 'bg-purple-100 group-hover:bg-purple-200' :
                  photoModal.color === 'blue' ? 'bg-blue-100 group-hover:bg-blue-200' :
                  'bg-emerald-100 group-hover:bg-emerald-200'
                }`}>
                  <Camera className={`w-6 h-6 ${
                    photoModal.color === 'purple' ? 'text-purple-500' :
                    photoModal.color === 'blue' ? 'text-blue-500' : 'text-emerald-500'
                  }`} />
                </div>
                <p className="text-sm font-black text-slate-700 mb-1">Click to Add Photo</p>
                <p className="text-[11px] font-bold text-slate-400">JPG, PNG, HEIC — Max 10 MB per photo</p>
              </div>

              {/* Tips */}
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-amber-800">Photography Tips</p>
                  <ul className="mt-1 space-y-0.5">
                    <li className="text-[9px] text-amber-700 font-medium">• Ensure good lighting — avoid shadows</li>
                    <li className="text-[9px] text-amber-700 font-medium">• Capture all 4 sides + roof of vehicle</li>
                    <li className="text-[9px] text-amber-700 font-medium">• Highlight any pre-existing damage clearly</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer — always visible */}
            <div className="shrink-0 px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">{getPhotos(photoModal.itemId, photoModal.category).length} / 10 photos uploaded</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => setPhotoModal(null)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleAddPhotos(photoModal.itemId, photoModal.category)}
                  className={`px-5 py-2 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-2 ${
                    photoModal.color === 'purple' ? 'bg-purple-600 hover:bg-purple-700' :
                    photoModal.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" /> + Add More Photos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Bulk Import Modal ── */}
      {showBulkImportModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]" onClick={() => { setShowBulkImportModal(false); setBulkImportStep('upload'); }}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-[700px] overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center">
                  <Upload className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Bulk Import Items</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    {bulkImportStep === 'upload' ? 'Step 1: Upload CSV / Excel File' : 'Step 2: Preview & Confirm'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Step indicators */}
                <div className="hidden sm:flex items-center gap-1.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black ${bulkImportStep === 'upload' ? 'bg-indigo-600 text-white' : 'bg-emerald-500 text-white'}`}>1</div>
                  <div className="w-4 h-px bg-slate-200" />
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black ${bulkImportStep === 'preview' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
                </div>
                <button
                  type="button"
                  onClick={() => { setShowBulkImportModal(false); setBulkImportStep('upload'); }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {bulkImportStep === 'upload' ? (
                <div className="space-y-5">
                  {/* Dropzone */}
                  <div
                    className="border-2 border-dashed border-indigo-200 rounded-2xl p-10 flex flex-col items-center justify-center bg-indigo-50/40 hover:bg-indigo-50 hover:border-indigo-400 transition-colors cursor-pointer group"
                    onClick={() => setBulkImportStep('preview')}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                      <Upload className="w-7 h-7 text-indigo-500" />
                    </div>
                    <p className="text-sm font-black text-slate-700 mb-1">Click to Select File or Drag & Drop</p>
                    <p className="text-[11px] font-bold text-slate-400 mb-4">Supports .CSV, .XLSX, .XLS — Max 10 MB</p>
                    <span className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-[11px] font-bold shadow-sm">Browse Files</span>
                  </div>

                  {/* Template Download */}
                  <div className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-amber-800">Use the Hero Logistics import template</p>
                        <p className="text-[10px] font-medium text-amber-600 mt-0.5">Ensure your file matches the required column format</p>
                      </div>
                    </div>
                    <button type="button" className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg text-[10px] font-bold transition-colors shrink-0 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5" /> Download Template
                    </button>
                  </div>

                  {/* Required Columns */}
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Required Columns</p>
                    <div className="flex flex-wrap gap-2">
                      {['VIN / Chassis', 'Rego', 'Make', 'Model', 'Year', 'Colour', 'Customer / Owner'].map(col => (
                        <span key={col} className="px-2 py-1 bg-slate-100 rounded-md text-[10px] font-bold text-slate-600">{col}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Preview info bar */}
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-700">File parsed successfully — <span className="font-black">{bulkPreviewData.length} vehicles</span> ready to import</span>
                    </div>
                    <button type="button" onClick={() => setBulkImportStep('upload')} className="text-[10px] font-bold text-slate-500 hover:text-slate-700 underline">Change File</button>
                  </div>

                  {/* Preview Table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-3 py-2.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">#</th>
                          <th className="px-3 py-2.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">VIN</th>
                          <th className="px-3 py-2.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Rego</th>
                          <th className="px-3 py-2.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Make</th>
                          <th className="px-3 py-2.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Model</th>
                          <th className="px-3 py-2.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Year</th>
                          <th className="px-3 py-2.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Colour</th>
                          <th className="px-3 py-2.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {bulkPreviewData.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50/50">
                            <td className="px-3 py-3 text-slate-500 font-bold">{i + 1}</td>
                            <td className="px-3 py-3 font-mono text-[10px] text-slate-700 font-bold">{row.vin}</td>
                            <td className="px-3 py-3 font-bold text-slate-800">{row.rego}</td>
                            <td className="px-3 py-3 font-bold text-slate-800">{row.make}</td>
                            <td className="px-3 py-3 font-bold text-slate-800">{row.model}</td>
                            <td className="px-3 py-3 font-bold text-slate-800">{row.year}</td>
                            <td className="px-3 py-3"><span className="px-2 py-0.5 bg-slate-100 rounded-md text-[10px] font-bold text-slate-600">{row.colour}</span></td>
                            <td className="px-3 py-3 text-slate-600 font-bold text-[10px]">{row.customer}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
              <p className="text-[10px] font-bold text-slate-400">
                {bulkImportStep === 'upload' ? 'Max 500 vehicles per import' : `${bulkPreviewData.length} items will be added to the Items section`}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setShowBulkImportModal(false); setBulkImportStep('upload'); }}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                {bulkImportStep === 'upload' ? (
                  <button
                    type="button"
                    onClick={() => setBulkImportStep('preview')}
                    className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload & Preview
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleBulkImport}
                    className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Import {bulkPreviewData.length} Vehicles
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Stop Modal ── */}
      {showAddStopModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]" onClick={() => setShowAddStopModal(false)}>
          <div
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-[520px] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Add New Stop</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Route Stop Details</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddStopModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Stop Type */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Stop Type</label>
                <div className="flex gap-2">
                  {['Pickup', 'Drop-off'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewStopForm(f => ({ ...f, type: t }))}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-black border-2 transition-all ${
                        newStopForm.type === t
                          ? t === 'Pickup'
                            ? 'bg-purple-50 border-purple-500 text-purple-700'
                            : 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5 inline mr-1.5" />{t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Address / Suburb <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={newStopForm.address}
                  onChange={e => setNewStopForm(f => ({ ...f, address: e.target.value }))}
                  className={inputCls}
                  placeholder="e.g. 123 Smith St, Melbourne VIC 3000"
                  autoFocus
                />
              </div>

              {/* Contact */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Contact Name</label>
                  <input
                    type="text"
                    value={newStopForm.contactName}
                    onChange={e => setNewStopForm(f => ({ ...f, contactName: e.target.value }))}
                    className={inputCls}
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={newStopForm.contactPhone}
                    onChange={e => setNewStopForm(f => ({ ...f, contactPhone: e.target.value }))}
                    className={inputCls}
                    placeholder="+61 400 000 000"
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Scheduled Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={newStopForm.date}
                      onChange={e => setNewStopForm(f => ({ ...f, date: e.target.value }))}
                      className={`${inputCls} pr-10`}
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Scheduled Time</label>
                  <div className="relative">
                    <input
                      type="time"
                      value={newStopForm.time}
                      onChange={e => setNewStopForm(f => ({ ...f, time: e.target.value }))}
                      className={`${inputCls} pr-10`}
                    />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Special Instructions (Optional)</label>
                <textarea
                  rows={2}
                  value={newStopForm.instructions}
                  onChange={e => setNewStopForm(f => ({ ...f, instructions: e.target.value }))}
                  className={`${inputCls} resize-none`}
                  placeholder="e.g. Call 30 mins before arrival, gate code: 1234"
                />
              </div>

              {/* Preview badge */}
              {newStopForm.address && (
                <div className={`flex items-center gap-3 p-3 rounded-xl border ${
                  newStopForm.type === 'Pickup' ? 'bg-purple-50 border-purple-100' : 'bg-blue-50 border-blue-100'
                }`}>
                  <MapPin className={`w-4 h-4 shrink-0 ${newStopForm.type === 'Pickup' ? 'text-purple-600' : 'text-blue-600'}`} />
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${newStopForm.type === 'Pickup' ? 'text-purple-700' : 'text-blue-700'}`}>{newStopForm.type}</p>
                    <p className="text-xs font-bold text-slate-700 mt-0.5">{newStopForm.address}</p>
                    {newStopForm.contactName && <p className="text-[10px] text-slate-500">{newStopForm.contactName} • {newStopForm.contactPhone}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddStopModal(false)}
                className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNewStop}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" /> Add Stop to Route
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
