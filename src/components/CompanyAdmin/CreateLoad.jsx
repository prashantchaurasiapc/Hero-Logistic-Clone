import React, { useState } from 'react';
import {
  ArrowLeft, Save, Zap, Plus, Trash2, GripVertical,
  MapPin, User, Calendar, Clock, Package, Truck,
  Upload, ChevronDown, AlertCircle, CheckCircle, Info,
  Camera, X, Search
} from 'lucide-react';

const STOP_TYPES = ['Pickup', 'Drop-off'];
const PRIORITIES  = ['Normal', 'Urgent', 'High'];
const LOAD_TYPES  = ['Car Carrying', 'General Freight', 'Dangerous Goods', 'Refrigerated'];
const DRIVERS     = ['Mike Thompson (DRVK)', 'John Smith (DRVJ)', 'Sarah Mitchell (DRVS)', 'David Wilson (DRVD)'];
const TRUCKS      = ['TRK-101 · Volvo FH 540', 'TRK-117 · Scania T500', 'TRK-104 · Kenworth T680'];
const TRAILERS    = ['TRL-201 · B Car Carrier', 'TRL-202 · Flatbed', 'TRL-203 · Refrigerated'];

function SectionHeader({ number, title, subtitle, action, colorCls = "bg-indigo-600" }) {
  return (
    <div className="flex justify-between items-center mb-5">
      <div className="flex items-center gap-3">
        <div className={`w-7 h-7 rounded-full text-white text-xs font-black flex items-center justify-center shrink-0 ${colorCls}`}>
          {number}
        </div>
        <div>
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">{title}</h2>
          {subtitle && <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

function FieldLabel({ children, required }) {
  return (
    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
      {children}{required && <span className="text-rose-500 ml-0.5">*</span>}
    </label>
  );
}

const inputCls = "w-full px-3 py-2.5 bg-white border border-slate-200 focus:border-indigo-400 rounded-xl focus:outline-none text-xs font-semibold text-slate-800 placeholder-slate-400 transition-colors";
const selectCls = "w-full px-3 py-2.5 bg-white border border-slate-200 focus:border-indigo-400 rounded-xl focus:outline-none text-xs font-semibold text-slate-800 cursor-pointer transition-colors appearance-none";

export default function CreateLoad({ onBack }) {
  const [stops, setStops] = useState([
    { id: 1, type: 'Pickup',   address: '123 Smith St, Melbourn', contact: 'John Smith\n+31412345670',  date: '07/15/2025', time: '08:00 AM' },
    { id: 2, type: 'Pickup',   address: '45 Industrial Rd, Gee',  contact: 'Mark Davis\n+61400123456',  date: '07/15/2025', time: '10:30 AM' },
    { id: 3, type: 'Drop-off', address: '456 James Rd, Sydney',   contact: 'Jane Doe\n+61421987654',   date: '07/17/2025', time: '04:00 PM' },
    { id: 4, type: 'Drop-off', address: '789 Depot Rd, Brisbane', contact: 'Peter Brown\n+61430227199', date: '07/18/2025', time: '09:00 AM' },
  ]);

  const [items, setItems] = useState([
    {
      id: 1, customer: 'ABC Motors Pty Ltd', pickupStop: 'Stop#1 - Pickup (123 Smit...',
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
    setStops(prev => [...prev, {
      id: Date.now(), type: 'Pickup', address: '', contact: '', date: '', time: ''
    }]);
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
    <div className="flex-grow bg-[#F8FAFC] w-full font-sans overflow-y-auto min-h-0 flex flex-col">

      {/* ── Sticky Top Bar ───────────────────────── */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">Create Load</h1>
              <span className="text-lg font-black text-amber-500 uppercase tracking-tight">Console</span>
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              Operational Principle: Load → Stops → Items
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-xs">
            <Save className="w-3.5 h-3.5" /> Save Draft
          </button>
          <button
            onClick={handleActivate}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Activate Load
          </button>
        </div>
      </div>

      {/* ── Form Body ────────────────────────────── */}
      <form onSubmit={handleActivate} className="p-8 md:p-12 space-y-8 max-w-[1400px] w-full mx-auto">

        {/* ═══════ Section 1: Load Information ═══════ */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <SectionHeader number="1" title="Load Information" colorCls="bg-indigo-600" />

          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-1">
              <FieldLabel>Booking Customer (Optional)</FieldLabel>
              <div className="relative">
                <input
                  type="text"
                  value={formData.customer}
                  onChange={e => setFormData({ ...formData, customer: e.target.value })}
                  className={inputCls}
                  placeholder="Search customer..."
                />
              </div>
              <p className="text-[9px] font-medium text-indigo-500 mt-1.5 leading-snug">
                Fields below will change location footsteps
              </p>
            </div>

            <div className="col-span-1">
              <FieldLabel required>Load Type / Service</FieldLabel>
              <div className="relative">
                <select
                  value={formData.loadType}
                  onChange={e => setFormData({ ...formData, loadType: e.target.value })}
                  className={selectCls}
                >
                  {LOAD_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
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
                <select
                  value={formData.priority}
                  onChange={e => setFormData({ ...formData, priority: e.target.value })}
                  className={selectCls}
                >
                  {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="col-span-1">
              <FieldLabel>Load Date</FieldLabel>
              <input
                type="date"
                className={inputCls}
                defaultValue="2025-07-08"
              />
            </div>
          </div>
        </div>

        {/* ═══════ Section 2: Route Stops ═══════════ */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <SectionHeader
            number="2"
            title="Route Stops"
            colorCls="bg-blue-600"
            subtitle="Add all pickup and drop-off locations"
            action={
              <button
                type="button"
                onClick={addStop}
                className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold transition-colors"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3px]" /> Add Stop
              </button>
            }
          />

          {/* Stop table header */}
          <div className="grid grid-cols-12 gap-3 mb-2 px-2">
            {['#', 'Type', 'Address / Suburb', 'Contact', 'Date', 'Time', 'Actions'].map((h, i) => (
              <div
                key={i}
                className={`text-[8.5px] font-black text-slate-400 uppercase tracking-widest ${
                  i === 0 ? 'col-span-1' :
                  i === 1 ? 'col-span-2' :
                  i === 2 ? 'col-span-3' :
                  i === 3 ? 'col-span-2' :
                  i === 4 ? 'col-span-2' :
                  i === 5 ? 'col-span-1' : 'col-span-1'
                }`}
              >
                {h}
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {stops.map((stop, idx) => (
              <div key={stop.id} className="grid grid-cols-12 gap-3 items-center bg-slate-50/60 rounded-xl p-3 border border-slate-100 hover:border-slate-200 transition-colors group">
                {/* # */}
                <div className="col-span-1 flex items-center gap-1.5">
                  <GripVertical className="w-3.5 h-3.5 text-slate-300 cursor-grab" />
                  <span className="text-xs font-black text-slate-500">{idx + 1}</span>
                </div>

                {/* Type */}
                <div className="col-span-2">
                  <div className="relative">
                    <select
                      value={stop.type}
                      onChange={e => updateStop(stop.id, 'type', e.target.value)}
                      className={`${selectCls} text-[11px] py-2 ${
                        stop.type === 'Pickup'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : 'bg-amber-50 border-amber-200 text-amber-700'
                      }`}
                    >
                      {STOP_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 opacity-50 pointer-events-none" />
                  </div>
                </div>

                {/* Address */}
                <div className="col-span-3">
                  <input
                    type="text"
                    value={stop.address}
                    onChange={e => updateStop(stop.id, 'address', e.target.value)}
                    className={`${inputCls} text-[11px] py-2`}
                    placeholder="Address or suburb..."
                  />
                </div>

                {/* Contact */}
                <div className="col-span-2">
                  <textarea
                    value={stop.contact}
                    onChange={e => updateStop(stop.id, 'contact', e.target.value)}
                    rows={2}
                    className={`${inputCls} text-[10px] py-1.5 resize-none leading-snug`}
                    placeholder="Name&#10;Phone"
                  />
                </div>

                {/* Date */}
                <div className="col-span-2">
                  <input
                    type="date"
                    value={stop.date ? stop.date.split('/').reverse().join('-') : ''}
                    onChange={e => updateStop(stop.id, 'date', e.target.value)}
                    className={`${inputCls} text-[11px] py-2`}
                  />
                </div>

                {/* Time */}
                <div className="col-span-1">
                  <input
                    type="time"
                    className={`${inputCls} text-[11px] py-2`}
                  />
                </div>

                {/* Actions */}
                <div className="col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeStop(stop.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10px] font-medium text-slate-400 mt-3 italic">
            Drag to reorder stops. Pickup stops first, then drop-off stops.
          </p>
        </div>

        {/* ═══════ Section 3: Items ══════════════════ */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <SectionHeader
            number="3"
            title="Items"
            colorCls="bg-emerald-500"
            subtitle="ABC Cars / Vehicles to be transported"
            action={
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" /> Bulk Import
                </button>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3px]" /> Add Item
                </button>
              </div>
            }
          />

          <div className="space-y-6">
            {items.map((item, idx) => (
              <div key={item.id} className="border border-slate-200 rounded-2xl overflow-hidden">
                {/* Item Header */}
                <div className="bg-white border-b border-slate-100 px-4 py-2.5 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-3.5 h-3.5 text-slate-300 cursor-grab" />
                    <Package className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-black text-slate-800">Item {idx + 1}</span>
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

                <div className="flex gap-4 p-4">
                  {/* Left: Item Fields */}
                  <div className="flex-1 space-y-4">
                    {/* Row 1 */}
                    <div className="grid grid-cols-3 gap-3">
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
                    <div className="grid grid-cols-3 gap-3">
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
                    <div className="grid grid-cols-4 gap-3">
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
                    <div className="grid grid-cols-5 gap-3">
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
                      <div>
                        <FieldLabel>Vehicle Type</FieldLabel>
                        <input type="text" value={item.vehicleType} onChange={e => updateItem(item.id, 'vehicleType', e.target.value)}
                          className={`${inputCls} text-center font-bold`} placeholder="Ute / Utility" />
                      </div>
                    </div>

                    {/* Row 5: Keys / Damage / Notes */}
                    <div className="grid grid-cols-3 gap-3">
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
                          className={inputCls} placeholder="Any special notes about this vehic" />
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
                  <div className="w-64 shrink-0 bg-white border border-orange-200 rounded-xl p-4 self-start">
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
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <SectionHeader number="4" title="Assign Truck & Driver" colorCls="bg-orange-500" />

          <div className="grid grid-cols-4 gap-4">
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
