import React, { useState } from 'react';
import {
  ArrowLeft, Save, Zap, Plus, Trash2, GripVertical,
  MapPin, User, Calendar, Clock, Package, Truck,
  Upload, ChevronDown, ChevronLeft, AlertCircle, CheckCircle, Info,
  Camera, X, Search, Flag, MoreVertical
} from 'lucide-react';

const STOP_TYPES = ['Pickup', 'Drop-off'];
const PRIORITIES  = ['Normal', 'Urgent', 'High'];
const LOAD_TYPES  = ['Car Carrying', 'General Freight', 'Dangerous Goods', 'Refrigerated'];
const DRIVERS     = ['Mike Thompson (DRVK)', 'John Smith (DRVJ)', 'Sarah Mitchell (DRVS)', 'David Wilson (DRVD)'];
const TRUCKS      = ['TRK-101 · Volvo FH 540', 'TRK-117 · Scania T500', 'TRK-104 · Kenworth T680'];
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
  const [stops, setStops] = useState([
    { id: 1, type: 'Pickup', address: '123 Smith St, Melbou', contactName: 'John Smith', contactPhone: '+61 412 345 670', date: '2025-07-15', time: '08:00' },
    { id: 2, type: 'Pickup', address: '45 Industrial Rd, Geel', contactName: 'Mark Davis', contactPhone: '+61 400 123 456', date: '2025-07-15', time: '10:30' },
    { id: 3, type: 'Drop-off', address: '456 Jones Rd, Sydne', contactName: 'Jane Doe', contactPhone: '+61 421 987 654', date: '2025-07-17', time: '16:00' },
    { id: 4, type: 'Drop-off', address: '789 Depot Rd, Brisba', contactName: 'Peter Brown', contactPhone: '+61 433 221 122', date: '2025-07-18', time: '09:00' }
  ]);

  const [activeStopMenu, setActiveStopMenu] = useState(null);

  const [items, setItems] = useState([
    {
      id: 1, customer: 'ABC Motors Pty Ltd', pickupStop: 'Stop#1 - Pickup (123 Smit...)',
      dropStop: 'Stop#3 - Drop-off (456 Ja...)', rcog: 'ABC234', vin: 'JMM2EJH77A5B00125',
      stockRec: 'STK-7900', make: 'Toyota', model: 'HiLux', year: '2024', colour: 'White',
      length: '5,325', width: '1,955', height: '1,875', weight: '2,050',
      vehicleType: 'Ute / Utility', keys: 'Yes', damageReport: 'Yes', notes: ''
    }
  ]);

  const [formData, setFormData] = useState({
    customer: 'ABC Motors Pty Ltd',
    loadType: 'Car Carrying',
    loadRef: 'PO-12548',
    priority: 'Normal',
    loadDate: '07/08/2025',
    truck: 'TRK-101 · Volvo FH 540',
    trailer: 'TRL-201 · B Car Carrier',
    driver: 'Mike Thompson (DRVK)',
    loadNotes: '',
  });

  const addStop = () => {
    setStops([...stops, { id: Date.now(), type: 'Drop-off', address: '', contactName: '', contactPhone: '', date: '', time: '' }]);
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

  const handleActivate = (e) => {
    e.preventDefault();
    alert('Load activated successfully!');
    onBack();
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
          <button className="flex-1 sm:flex-none justify-center px-4 sm:px-5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs uppercase tracking-wider">
            SAVE DRAFT
          </button>
          <button
            onClick={handleActivate}
            className="flex-1 sm:flex-none justify-center px-4 sm:px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-black flex items-center gap-2 transition-colors shadow-xs uppercase tracking-wider"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> ACTIVATE LOAD
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
                <input
                  type="text"
                  value={formData.customer}
                  onChange={e => setFormData({ ...formData, customer: e.target.value })}
                  className={`${inputCls} pr-10`}
                  placeholder="Search customer..."
                />
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
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
                onClick={addStop}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-full text-[10px] font-black transition-colors uppercase tracking-wider shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3px]" /> ADD STOP
              </button>
            }
          />

          {/* Mobile View: Cards (< md) */}
          <div className="block md:hidden space-y-3">
            {stops.map((stop, idx) => (
              <div key={stop.id} className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
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
                  <div key={stop.id} className="flex items-center gap-3 bg-white rounded-[14px] p-2.5 border border-slate-200 hover:border-slate-300 transition-colors group">
                    {/* # */}
                    <div className="w-8 shrink-0 flex items-center gap-1.5 pl-0.5">
                      <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
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
                            <button type="button" className="text-[9px] font-bold text-indigo-600 bg-white px-2 py-1 rounded-md border border-indigo-100 hover:bg-indigo-50">
                              + Add Photos
                            </button>
                            <span className="text-[8px] text-slate-400 mt-1">1 files</span>
                          </div>
                        </div>
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
                            <button type="button" className="text-[9px] font-bold text-indigo-600 bg-white px-2 py-1 rounded-md border border-indigo-100 hover:bg-indigo-50">
                              + Add Photos
                            </button>
                            <span className="text-[8px] text-slate-400 mt-1">1 files</span>
                          </div>
                        </div>
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
                            <button type="button" className="text-[9px] font-bold text-emerald-600 bg-white px-2 py-1 rounded-md border border-emerald-100 hover:bg-emerald-50">
                              + Add Photos
                            </button>
                            <span className="text-[8px] text-slate-400 mt-1">3 files</span>
                          </div>
                        </div>
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
                  {TRUCKS.map(t => <option key={t}>{t}</option>)}
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
                  {DRIVERS.map(d => <option key={d}>{d}</option>)}
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
    </div>
  );
}
