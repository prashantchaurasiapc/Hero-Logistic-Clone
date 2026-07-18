import React, { useState } from 'react';
import {
  Search, Plus, Download, Upload, ChevronDown, Filter,
  ArrowLeft, Phone, MoreHorizontal, Edit3, UserCheck,
  MapPin, Clock, CheckCircle, Circle, Truck, Package,
  MessageSquare, DollarSign, FileText, Camera, Receipt,
  Activity, ChevronRight, AlertCircle, Eye, X, Bell,
  Navigation, Thermometer, Star, User, Calendar, Map,
  BarChart2, TrendingUp, Layers, Radio
} from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const LOADS = [
  {
    id: 'PO-12543', status: 'ACTIVE', statusLabel: 'En Route',
    loadType: 'Car Carrying', customer: 'ABC Motors Pty Ltd',
    route: { from: 'Melbourne', to: 'Adelaide', stops: 3 },
    driver: { name: 'Mike Thompson', avatar: 'MT', status: 'On The Way', stops: '2 stops' },
    truck: 'TRK-101', pickupDate: '16/07/2025', pickupTime: '05:00 AM',
    priority: 'Normal', ref: 'PO-12543'
  },
  {
    id: 'PO-13546', status: 'PLANNED', statusLabel: 'Ready',
    loadType: 'General Freight', customer: 'Global Retail Group',
    route: { from: 'Sydney', to: 'Newcastle', stops: 2 },
    driver: { name: 'John Smith', avatar: 'JS', status: 'Ready', stops: '4 leads' },
    truck: 'TRK-204', pickupDate: '18/07/2025', pickupTime: '04:00 AM',
    priority: 'Normal', ref: 'PO-13546'
  },
  {
    id: 'PO-12544', status: 'DRAFT', statusLabel: 'Not Ready',
    loadType: 'Car Carrying', customer: 'Luxury Auto Imports',
    route: { from: 'Perth', to: 'Melbourne', stops: 2 },
    driver: null, truck: null,
    pickupDate: '16/07/2025', pickupTime: '05:00 AM',
    priority: 'Normal', ref: 'PO-12544'
  },
  {
    id: 'PO-12543', status: 'ACTIVE', statusLabel: 'At Stop 2',
    loadType: 'Car Carrying', customer: 'Cars R Us',
    route: { from: 'Melbourne', to: 'Sydney', stops: 4 },
    driver: { name: 'David Wilson', avatar: 'DW', status: 'On The Way', stops: '1 stop' },
    truck: 'TRK-089', pickupDate: '16/07/2025', pickupTime: '08:00 AM',
    priority: 'Normal', ref: 'PO-12543'
  },
  {
    id: 'PO-11942', status: 'COMPLETED', statusLabel: 'Completed',
    loadType: 'General Freight', customer: 'BuildCo Supplies',
    route: { from: 'Brisbane', to: 'Gold Coast', stops: 2 },
    driver: { name: 'Mark Davis', avatar: 'MD', status: 'Completed', stops: '2 stops' },
    truck: 'TRK-156', pickupDate: '16/07/2025', pickupTime: '06:00 AM',
    priority: 'Normal', ref: 'PO-11942'
  },
  {
    id: 'PO-12549', status: 'CANCELLED', statusLabel: 'Cancelled',
    loadType: 'Dangerous Goods', customer: 'Chemikals Solutions',
    route: { from: 'Sydney', to: 'Newcastle', stops: 1 },
    driver: null, truck: null,
    pickupDate: '16/07/2025', pickupTime: '05:00 AM',
    priority: 'Normal', ref: 'PO-12549'
  },
  {
    id: 'PO-13510', status: 'PLANNED', statusLabel: 'Ready',
    loadType: 'Car Carrying', customer: 'Premium Motors',
    route: { from: 'Adelaide', to: 'Melbourne', stops: 3 },
    driver: { name: 'Sarah Mitchell', avatar: 'SM', status: 'Ready', stops: '3 stops' },
    truck: 'TRK-311', pickupDate: '17/07/2025', pickupTime: '05:00 AM',
    priority: 'Normal', ref: 'PO-13510'
  },
  {
    id: 'PO-13509', status: 'ACTIVE', statusLabel: 'En Route',
    loadType: 'General Freight', customer: 'National Foods',
    route: { from: 'Sydney', to: 'Canberra', stops: 2 },
    driver: { name: 'Chris Lee', avatar: 'CL', status: 'On The Way', stops: '2 stops' },
    truck: 'TRK-044', pickupDate: '17/07/2025', pickupTime: '02:00 AM',
    priority: 'Normal', ref: 'PO-13509'
  },
  {
    id: 'PO-13538', status: 'DRAFT', statusLabel: 'Not Ready',
    loadType: 'Car Carrying', customer: 'ABC Motors Pty Ltd',
    route: { from: 'Melbourne', to: 'Brisbane', stops: 3 },
    driver: null, truck: null,
    pickupDate: '17/07/2025', pickupTime: '12:00 AM',
    priority: 'Normal', ref: 'PO-13538'
  },
  {
    id: 'PO-13539', status: 'DRAFT', statusLabel: 'Not Ready',
    loadType: 'General Freight', customer: 'Global Retail Group',
    route: { from: 'Sydney', to: 'Wollongong', stops: 2 },
    driver: null, truck: null,
    pickupDate: '18/07/2025', pickupTime: '05:00 AM',
    priority: 'Normal', ref: 'PO-13539'
  },
  {
    id: 'PO-13536', status: 'DRAFT', statusLabel: 'Not Ready',
    loadType: 'Dangerous Goods', customer: 'Luxury Auto Imports',
    route: { from: 'Perth', to: 'Adelaide', stops: 2 },
    driver: null, truck: null,
    pickupDate: '18/07/2025', pickupTime: '05:00 AM',
    priority: 'Normal', ref: 'PO-13536'
  },
  {
    id: 'PO-13538', status: 'DRAFT', statusLabel: 'Not Ready',
    loadType: 'Car Carrying', customer: 'Cars R Us',
    route: { from: 'Melbourne', to: 'Sydney', stops: 3 },
    driver: null, truck: null,
    pickupDate: '18/07/2025', pickupTime: '04:00 AM',
    priority: 'Normal', ref: 'PO-13538'
  },
  {
    id: 'PO-13532', status: 'DRAFT', statusLabel: 'Not Ready',
    loadType: 'General Freight', customer: 'BuildCo Supplies',
    route: { from: 'Brisbane', to: 'Gold Coast', stops: 2 },
    driver: null, truck: null,
    pickupDate: '19/07/2025', pickupTime: '05:00 AM',
    priority: 'Normal', ref: 'PO-13532'
  },
  {
    id: 'PO-13533', status: 'DRAFT', statusLabel: 'Not Ready',
    loadType: 'Dangerous Goods', customer: 'Chemikals Solutions',
    route: { from: 'Sydney', to: 'Newcastle', stops: 1 },
    driver: null, truck: null,
    pickupDate: '19/07/2025', pickupTime: '05:00 AM',
    priority: 'Normal', ref: 'PO-13533'
  },
  {
    id: 'PO-13522', status: 'DRAFT', statusLabel: 'Not Ready',
    loadType: 'Car Carrying', customer: 'Premium Motors',
    route: { from: 'Adelaide', to: 'Melbourne', stops: 3 },
    driver: null, truck: null,
    pickupDate: '19/07/2025', pickupTime: '05:00 AM',
    priority: 'Normal', ref: 'PO-13522'
  },
  {
    id: 'PO-13524', status: 'DRAFT', statusLabel: 'Not Ready',
    loadType: 'General Freight', customer: 'National Foods',
    route: { from: 'Melbourne', to: 'Sydney', stops: 4 },
    driver: null, truck: null,
    pickupDate: '30/07/2025', pickupTime: '05:00 AM',
    priority: 'Normal', ref: 'PO-13524'
  },
  {
    id: 'PO-13526', status: 'DRAFT', statusLabel: 'Not Ready',
    loadType: 'Dangerous Goods', customer: 'Premier Logistics',
    route: { from: 'Sydney', to: 'Newcastle', stops: 2 },
    driver: null, truck: null,
    pickupDate: '30/07/2025', pickupTime: '05:00 AM',
    priority: 'Normal', ref: 'PO-13526'
  },
  {
    id: 'PO-13527', status: 'DRAFT', statusLabel: 'Not Ready',
    loadType: 'Car Carrying', customer: 'Apex Warehousing',
    route: { from: 'Perth', to: 'Melbourne', stops: 3 },
    driver: null, truck: null,
    pickupDate: '30/07/2025', pickupTime: '04:00 AM',
    priority: 'Normal', ref: 'PO-13527'
  },
  {
    id: 'PO-13528', status: 'DRAFT', statusLabel: 'Not Ready',
    loadType: 'General Freight', customer: 'ABC Motors Pty Ltd',
    route: { from: 'Melbourne', to: 'Sydney', stops: 2 },
    driver: null, truck: null,
    pickupDate: '21/07/2025', pickupTime: '05:00 AM',
    priority: 'Normal', ref: 'PO-13528'
  },
  {
    id: 'PO-13512', status: 'PLANNED', statusLabel: 'Ready',
    loadType: 'Car Carrying', customer: 'ABC Motors Pty Ltd',
    route: { from: 'Melbourne', to: 'Brisbane', stops: 4 },
    driver: { name: 'Mike Thompson', avatar: 'MT', status: 'Ready', stops: '4 stops' },
    truck: 'TRK-101', pickupDate: '21/07/2025', pickupTime: '05:00 AM',
    priority: 'Normal', ref: 'PO-13512'
  },
];

// Status color mapping
const statusConfig = {
  ACTIVE:     { bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-500',    label: 'Active' },
  PLANNED:    { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500',   label: 'Planned' },
  DRAFT:      { bg: 'bg-orange-100', text: 'text-orange-600', dot: 'bg-orange-400',  label: 'Draft' },
  COMPLETED:  { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500',  label: 'Completed' },
  CANCELLED:  { bg: 'bg-red-100',    text: 'text-red-600',    dot: 'bg-red-500',     label: 'Cancelled' },
};

const avatarColors = ['bg-blue-500','bg-emerald-500','bg-violet-500','bg-amber-500','bg-rose-500','bg-cyan-500'];
const getAvatarColor = (str) => avatarColors[str?.charCodeAt(0) % avatarColors.length] || 'bg-slate-500';

// ─── Donut Chart ──────────────────────────────────────────────────────────────
function DonutChart({ total, active, planned, draft, completed, cancelled }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const segments = [
    { count: active,    color: '#3b82f6' },
    { count: planned,   color: '#22c55e' },
    { count: draft,     color: '#f97316' },
    { count: completed, color: '#a855f7' },
    { count: cancelled, color: '#ef4444' },
  ];
  let offset = 0;
  const paths = segments.map((seg, i) => {
    const pct = total > 0 ? seg.count / total : 0;
    const dash = pct * circ;
    const gap = circ - dash;
    const el = (
      <circle
        key={i}
        cx="64" cy="64" r={r}
        fill="none"
        stroke={seg.color}
        strokeWidth="14"
        strokeDasharray={`${dash} ${gap}`}
        strokeDashoffset={-offset}
        strokeLinecap="butt"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '64px 64px' }}
      />
    );
    offset += dash;
    return el;
  });

  return (
    <div className="relative flex items-center justify-center" style={{ width: 128, height: 128 }}>
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={r} fill="none" stroke="#f1f5f9" strokeWidth="14" />
        {paths}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black text-slate-900">{total}</span>
        <span className="text-[10px] font-semibold text-slate-400">Total</span>
      </div>
    </div>
  );
}

// ─── Load Detail View ─────────────────────────────────────────────────────────
function LoadDetail({ load, onBack }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Stops (4)', 'Items (1)', 'Driver & Vehicle', 'Expenses', 'Documents', 'Proof Photos', 'POD', 'Invoices', 'Activity'];

  const routeSteps = [
    { label: 'Dispatched', date: '15/07 07:30 AM', done: true },
    { label: 'En Route', date: '15/07 10:30 AM', active: true },
    { label: '3', date: '15/07 07:33 PM', done: false },
    { label: '4', date: '17/07 04:00 PM', done: false },
    { label: 'Delivered', date: '16/07 09:00 AM', done: false },
  ];

  const stops = [
    { type: 'PICKUP', label: 'Pickup Yard', location: 'Melbourne', date: '15/07/2025 08:00 AM', status: 'COMPLETED', color: 'bg-green-500' },
    { type: 'DELIVERY', label: 'Geelong Depot', location: 'Geelong', date: '15/07/2025 10:30 AM', status: 'UPCOMING', color: 'bg-blue-400' },
    { type: 'DROP-OFF', label: 'Drop-off Depot', location: 'Sydney', date: '17/07/2025 04:00 PM', status: 'UPCOMING', color: 'bg-blue-400' },
    { type: 'DROP-OFF', label: 'Drop-off Yard', location: 'Brisbane', date: '18/07/2025 09:00 AM', status: 'UPCOMING', color: 'bg-blue-400' },
  ];

  const proofPickup = ['#d97706','#b45309','#92400e','#d97706'];
  const proofLoading = ['#1d4ed8','#1e40af','#1d4ed8','#1e40af','#1d4ed8'];
  const proofDelivery = ['#064e3b','#065f46','#047857','#064e3b','#065f46','#047857'];

  return (
    <div className="flex flex-col h-full" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 bg-white border-b border-slate-100 gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-black text-slate-900">Load {load.id}</h1>
              <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200">
                ● IN PROGRESS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              ☁ {load.loadType} • Created by Sarah Mitchell • {load.pickupDate} {load.pickupTime}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            <Edit3 className="w-3.5 h-3.5" /> Edit Load
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            <UserCheck className="w-3.5 h-3.5" /> Reassign
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-bold transition-colors">
            More Actions <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 px-6 bg-white border-b border-slate-100 overflow-x-auto scrollbar-none flex-nowrap w-full">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-12 gap-5 p-5">

          {/* ── Left Column ── */}
          <div className="col-span-12 lg:col-span-8 space-y-5">

            {/* Load Summary */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-4">Load Summary</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {[
                  { icon: <FileText className="w-3.5 h-3.5 text-slate-400" />, label: 'Load Reference', value: load.id },
                  { icon: <Layers className="w-3.5 h-3.5 text-slate-400" />, label: 'Load Type', value: load.loadType },
                  { icon: <AlertCircle className="w-3.5 h-3.5 text-slate-400" />, label: 'Priority', value: '🔴 Normal' },
                  { icon: <User className="w-3.5 h-3.5 text-slate-400" />, label: 'Booking Customer', value: 'Premium Motors' },
                  { icon: <MapPin className="w-3.5 h-3.5 text-slate-400" />, label: 'Total Stops', value: '4 (2 Pickup, 2 Drop-off)' },
                  { icon: <Package className="w-3.5 h-3.5 text-slate-400" />, label: 'Items / Vehicles', value: '1 Vehicle' },
                  { icon: <Navigation className="w-3.5 h-3.5 text-slate-400" />, label: 'Total Distance (EST.)', value: '1,260 km' },
                  { icon: <Thermometer className="w-3.5 h-3.5 text-slate-400" />, label: 'Total Weight (EST.)', value: '2,050 kg' },
                  { icon: <BarChart2 className="w-3.5 h-3.5 text-slate-400" />, label: 'Total Volume (EST.)', value: '10.2 m³' },
                  { icon: <Calendar className="w-3.5 h-3.5 text-slate-400" />, label: 'Created', value: '08/07/2025 09:15 AM' },
                  { icon: <Clock className="w-3.5 h-3.5 text-slate-400" />, label: 'Last Updated', value: '15/07/2025 07:42 AM' },
                ].map((row, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0">{row.icon}</span>
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">{row.label}</p>
                      <p className="text-xs font-bold text-slate-800">{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Route Progress */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-5">Route Progress</h3>
              <div className="flex items-center gap-0 mb-5 overflow-x-auto pb-2">
                {routeSteps.map((step, i) => (
                  <React.Fragment key={i}>
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black border-2 ${
                        step.done && !step.active ? 'bg-green-500 border-green-500 text-white' :
                        step.active ? 'bg-blue-500 border-blue-500 text-white' :
                        'bg-white border-slate-200 text-slate-400'
                      }`}>
                        {step.done && !step.active ? <CheckCircle className="w-4 h-4" /> : i + 1}
                      </div>
                      <span className="text-[9px] font-bold text-slate-600 text-center w-16 leading-tight">{step.label}</span>
                      {step.active && <span className="text-[8px] font-bold text-blue-500">In Progress</span>}
                      <span className="text-[8px] text-slate-400">{step.date}</span>
                    </div>
                    {i < routeSteps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 ${step.done ? 'bg-green-400' : 'bg-slate-200'}`} style={{ minWidth: 20 }} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="rounded-xl overflow-hidden border border-slate-100" style={{ height: 220, background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 40%, #7dd3fc 80%, #38bdf8 100%)' }}>
                <div className="w-full h-full flex items-center justify-center relative" style={{
                  backgroundImage: `
                    repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(99,102,241,0.07) 30px, rgba(99,102,241,0.07) 31px),
                    repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(99,102,241,0.07) 30px, rgba(99,102,241,0.07) 31px)
                  `,
                  background: '#dbeafe'
                }}>
                  {/* Road lines */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 220" preserveAspectRatio="none">
                    <path d="M 30 180 Q 100 80 200 100 Q 300 120 370 40" stroke="#60a5fa" strokeWidth="4" fill="none" strokeDasharray="8,4" opacity="0.7"/>
                    <circle cx="30" cy="180" r="8" fill="#3b82f6" />
                    <circle cx="30" cy="180" r="14" fill="#3b82f6" opacity="0.2" />
                    <circle cx="200" cy="100" r="8" fill="#f97316" />
                    <circle cx="200" cy="100" r="14" fill="#f97316" opacity="0.2" />
                    <circle cx="370" cy="40" r="8" fill="#10b981" />
                    <circle cx="370" cy="40" r="14" fill="#10b981" opacity="0.2" />
                    <text x="30" y="210" fill="#1e40af" fontSize="10" fontWeight="bold" textAnchor="middle">Melbourne</text>
                    <text x="200" y="90" fill="#c2410c" fontSize="10" fontWeight="bold" textAnchor="middle">Geelong</text>
                    <text x="370" y="30" fill="#065f46" fontSize="10" fontWeight="bold" textAnchor="middle">Sydney</text>
                  </svg>
                  <div className="absolute bottom-2 right-2 text-[9px] text-slate-500 bg-white/80 px-2 py-1 rounded">
                    Leaflet | © OpenStreetMap contributors
                  </div>
                </div>
              </div>
            </div>

            {/* Items / Vehicles */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">Items / Vehicles (1)</h3>
                <button className="text-xs font-bold text-blue-600 hover:underline">VIEW ALL</button>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-24 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center shrink-0">
                  <Truck className="w-8 h-8 text-amber-700" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black text-slate-900">1ABC234 - Toyota Hilux (2024)</p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-2">
                    <div><p className="text-[10px] text-slate-400">CUSTOMER</p><p className="text-xs font-bold text-slate-700">Premium Motors</p></div>
                    <div><p className="text-[10px] text-slate-400">PICKUP</p><p className="text-xs font-bold text-slate-700">Step 1 - Melbourne</p></div>
                    <div><p className="text-[10px] text-slate-400">DROP-OFF</p><p className="text-xs font-bold text-slate-700">Step 2 - Sydney</p></div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold rounded-full">DRIVABLE</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold rounded-full">IN TRANSIT</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[9px] font-bold text-slate-400">PTE</span>
                  <p className="text-xs font-black text-slate-800">CAR</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">Messages</h3>
                <button className="text-xs font-bold text-blue-600 hover:underline">VIEW ALL</button>
              </div>
              <div className="space-y-3">
                {[
                  { initials: 'MT', name: 'Mike Thompson (Driver)', color: 'bg-blue-500', time: '15/07/2025 08:12 AM', msg: 'En route to Stop 2. Traffic is light, ETA on time.' },
                  { initials: 'SM', name: 'Sarah Mitchell (Dispatch)', color: 'bg-violet-500', time: '15/07/2025 08:15 AM', msg: 'Thanks Mike. Please send photos after loading.' },
                ].map((m, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-8 h-8 ${m.color} rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0`}>{m.initials}</div>
                    <div className="flex-1 bg-slate-50 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-slate-700">{m.name}</span>
                        <span className="text-[9px] text-slate-400">{m.time}</span>
                      </div>
                      <p className="text-xs text-slate-600">{m.msg}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stops Timeline */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">Stops Timeline</h3>
                <button className="text-xs font-bold text-blue-600 hover:underline">VIEW ALL</button>
              </div>
              <div className="space-y-3">
                {stops.map((stop, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-3 h-3 ${stop.color} rounded-full shrink-0`} />
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{stop.label}</p>
                        <p className="text-[10px] text-slate-400">{stop.location} • {stop.date}</p>
                      </div>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                        stop.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-600'
                      }`}>{stop.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Load Notes */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">Load Notes</h3>
                <button className="text-xs font-bold text-blue-600 hover:underline">EDIT</button>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Customer prefers delivery between 9am - 12pm. Please call customer 30 mins before arrival. Vehicle must be kept clean and free of debris..
              </p>
            </div>

          </div>

          {/* ── Right Column ── */}
          <div className="col-span-12 lg:col-span-4 space-y-5">

            {/* Load Status */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">Load Status</h3>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold rounded-full border border-blue-200">IN PROGRESS</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Current Status', value: 'En Route to Stop 2', icon: <Radio className="w-3.5 h-3.5 text-blue-500" /> },
                  { label: 'Current Location', value: 'Hume Hwy, Seymour VIC 3660', icon: <MapPin className="w-3.5 h-3.5 text-rose-500" /> },
                  { label: 'Last Update', value: '15/07/2025 08:12 AM', icon: <Clock className="w-3.5 h-3.5 text-slate-400" /> },
                  { label: 'Updated By', value: 'Mike Thompson (Driver)', icon: <User className="w-3.5 h-3.5 text-slate-400" /> },
                  { label: 'Next Stop', value: 'Stop 2 - Geelong\nETA: 10:30 AM (16/07/2025)', icon: <Navigation className="w-3.5 h-3.5 text-green-500" /> },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="mt-0.5 shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">{item.label}</p>
                      <p className="text-xs font-bold text-slate-800 whitespace-pre-line">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Driver & Vehicle (Live) */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">Driver & Vehicle (Live)</h3>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold rounded-full">+ LIVE</span>
              </div>
              {/* Driver */}
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-black">MT</div>
                <div className="flex-1">
                  <p className="text-xs font-black text-slate-900">Mike Thompson (DRV001)</p>
                  <p className="text-[10px] text-slate-400">PHONE: +61 412 345 • LICENSE: MC (VIC) 076</p>
                  <p className="text-[10px] text-slate-400">WORK DIARY: 07:15 / 14:00</p>
                </div>
                <button className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center">
                  <Phone className="w-3 h-3 text-green-600" />
                </button>
              </div>
              {/* Truck */}
              <div className="flex items-center gap-3 pt-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-slate-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-800">Truck: TRK-101 | Volvo FH 540</p>
                  <p className="text-[10px] text-slate-400">ODOMETER: 523,410 KM • STATUS: ON THE ROAD</p>
                </div>
              </div>
              {/* Trailer */}
              <div className="flex items-center gap-3 pt-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-slate-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-800">Trailer: TRL-201 | 8 Car Carrier</p>
                  <p className="text-[10px] text-slate-400">REG NO.: YQ-12-A8 • STATUS: ATTACHED</p>
                </div>
              </div>
            </div>

            {/* Recent Proof Photos */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">Recent Proof Photos</h3>
                <button className="text-xs font-bold text-blue-600 hover:underline">VIEW ALL</button>
              </div>

              {[
                { label: 'PICKUP (BEFORE LOADING)', count: '4 FILES', colors: ['#d97706','#b45309','#92400e','#ca8a04'], extra: '+1' },
                { label: 'LOADING (COC)', count: '5 FILES', colors: ['#1d4ed8','#1e40af','#1d4ed8'], extra: '+2' },
                { label: 'DELIVERY (AFTER DELIVERY)', count: '6 FILES', colors: ['#064e3b','#065f46','#047857','#065f46'], extra: '+2' },
              ].map((section, si) => (
                <div key={si} className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-bold text-slate-400">{section.label}</span>
                    <span className="text-[9px] text-slate-400">{section.count}</span>
                  </div>
                  <div className="flex gap-1.5 items-center">
                    {section.colors.map((color, ci) => (
                      <div key={ci} className="w-14 h-10 rounded-lg flex items-center justify-center" style={{ background: color }}>
                        <Camera className="w-4 h-4 text-white opacity-60" />
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-slate-500">{section.extra}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Overview */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-4">Financial Overview</h3>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Invoices</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold rounded-full">SEE GENERATED</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Driver Pay</span>
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[9px] font-bold rounded-full">PENDING</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Expenses</span>
                  <span className="text-xs font-bold text-slate-800">$150.00</span>
                </div>
              </div>
              <button className="w-full mt-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                View Financials
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex gap-6">
            {[
              { icon: <MessageSquare className="w-4 h-4" />, label: 'Message' },
              { icon: <DollarSign className="w-4 h-4" />, label: 'Expense' },
              { icon: <FileText className="w-4 h-4" />, label: 'Document' },
              { icon: <Activity className="w-4 h-4" />, label: 'Report' },
            ].map((item, i) => (
              <button key={i} className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-blue-600 transition-colors">
                {item.icon}
                <span className="text-[9px] font-bold">{item.label}</span>
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-black rounded-full transition-colors">
            <CheckCircle className="w-4 h-4" /> MARK LOAD AS COMPLETED
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Loads Component ─────────────────────────────────────────────────────
export default function Loads() {
  const [activeTab, setActiveTab] = useState('All Loads');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLoad, setSelectedLoad] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const tabs = [
    { label: 'All Loads', count: LOADS.length },
    { label: 'Draft',     count: LOADS.filter(l => l.status === 'DRAFT').length },
    { label: 'Planned',   count: LOADS.filter(l => l.status === 'PLANNED').length },
    { label: 'Active',    count: LOADS.filter(l => l.status === 'ACTIVE').length },
    { label: 'Completed', count: LOADS.filter(l => l.status === 'COMPLETED').length },
    { label: 'Cancelled', count: LOADS.filter(l => l.status === 'CANCELLED').length },
  ];

  const statusMap = { 'All Loads': null, Draft: 'DRAFT', Planned: 'PLANNED', Active: 'ACTIVE', Completed: 'COMPLETED', Cancelled: 'CANCELLED' };

  const filtered = LOADS.filter(l => {
    const matchTab = !statusMap[activeTab] || l.status === statusMap[activeTab];
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || l.id.toLowerCase().includes(q) || l.customer.toLowerCase().includes(q) ||
      l.route.from.toLowerCase().includes(q) || l.route.to.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Sidebar stats
  const totalLoads = LOADS.length;
  const activeCount = LOADS.filter(l => l.status === 'ACTIVE').length;
  const inTransitCount = LOADS.filter(l => l.status === 'PLANNED').length;
  const atStopCount = LOADS.filter(l => l.status === 'DRAFT').length;
  const completedTodayCount = LOADS.filter(l => l.status === 'COMPLETED').length;
  const cancelledCount = LOADS.filter(l => l.status === 'CANCELLED').length;

  if (selectedLoad) {
    return <LoadDetail load={selectedLoad} onBack={() => setSelectedLoad(null)} />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-5 p-5" style={{ background: '#f8fafc' }}>

      {/* ── Main Content ── */}
      <div className="w-full lg:flex-1 flex flex-col gap-4">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Loads</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage and track all loads in your operation</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-55 transition-colors shadow-sm">
              <Upload className="w-3.5 h-3.5" /> Import
            </button>
            <button className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-55 transition-colors shadow-sm">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 border-2 border-blue-600 rounded-lg text-xs font-black text-blue-600 bg-white hover:bg-blue-50 transition-colors">
              <Plus className="w-3.5 h-3.5" /> A LOAD
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-[#FFA000] hover:bg-amber-500 rounded-lg text-xs font-black text-black transition-colors shadow-sm">
              <Plus className="w-3.5 h-3.5" /> New Load
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-0 border-b border-slate-200 bg-white rounded-t-xl px-1 overflow-x-auto scrollbar-none flex-nowrap w-full">
          {tabs.map(tab => (
            <button
              key={tab.label}
              onClick={() => { setActiveTab(tab.label); setCurrentPage(1); }}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${
                activeTab === tab.label
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${
                activeTab === tab.label ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Filters Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-wrap items-center gap-2 shadow-sm">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search loads..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-400 w-36"
            />
          </div>

          {/* Date pickers placeholder */}
          {['mm/dd/yyyy', 'mm/dd/yyyy'].map((ph, i) => (
            <button key={i} className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-500 hover:bg-slate-50 bg-white">
              <Calendar className="w-3.5 h-3.5" /> {ph}
            </button>
          ))}

          {/* Dropdowns */}
          {['All Status', 'All Types', 'All Customer'].map((label, i) => (
            <button key={i} className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 bg-white font-medium">
              {label} <ChevronDown className="w-3 h-3" />
            </button>
          ))}

          <div className="flex-1" />

          <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 bg-white font-medium">
            <Filter className="w-3.5 h-3.5" /> More Filters
          </button>
        </div>

        {/* Sub-filter row */}
        <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 flex items-center gap-2 flex-wrap shadow-sm">
          {['All Drivers', 'All Vehicles', 'All Locations'].map((label, i) => (
            <button key={i} className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 bg-white font-medium flex items-center gap-1">
              {label} <ChevronDown className="w-3 h-3" />
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Table header count */}
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">{filtered.length} loads found</span>
            <div className="flex items-center gap-2">
              <button className="text-xs text-slate-500 hover:text-slate-700 font-medium flex items-center gap-1">
                Columns <ChevronDown className="w-3 h-3" />
              </button>
              <button className="text-xs text-slate-500 hover:text-slate-700 font-medium flex items-center gap-1">
                Group By <ChevronDown className="w-3 h-3" />
              </button>
              <button className="text-xs text-slate-500 hover:text-slate-700 font-medium flex items-center gap-1">
                Sort By: Created Date (Newest) <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-3 py-3 w-8">
                    <input type="checkbox" className="rounded" />
                  </th>
                  {['LOAD REF', 'STATUS', 'LOAD TYPE', 'CUSTOMER', 'ROUTE', 'DRIVER / TRUCK', 'PICKUP DATE', 'ET'].map(col => (
                    <th key={col} className="px-3 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginated.map((load, i) => {
                  const cfg = statusConfig[load.status] || statusConfig.DRAFT;
                  return (
                    <tr
                      key={i}
                      className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                      onClick={() => setSelectedLoad(load)}
                    >
                      <td className="px-3 py-3">
                        <input type="checkbox" className="rounded" onClick={e => e.stopPropagation()} />
                      </td>

                      {/* Load Ref */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="text-xs font-black text-blue-600 group-hover:underline">{load.id}</span>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${cfg.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          <span className={`text-[10px] font-black ${cfg.text}`}>{cfg.label}</span>
                        </div>
                        <p className={`text-[9px] font-semibold ${cfg.text} mt-0.5 pl-1`}>{load.statusLabel}</p>
                      </td>

                      {/* Load Type */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="text-xs font-semibold text-slate-700">{load.loadType}</span>
                      </td>

                      {/* Customer */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="text-xs font-semibold text-slate-800">{load.customer}</span>
                      </td>

                      {/* Route */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                          <span>{load.route.from}</span>
                          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{load.route.to}</span>
                        </div>
                        <p className="text-[9px] text-slate-400 mt-0.5">{load.route.stops} stops</p>
                      </td>

                      {/* Driver / Truck */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        {load.driver ? (
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 ${getAvatarColor(load.driver.initials || load.driver.name)} rounded-full flex items-center justify-center text-white text-[9px] font-black shrink-0`}>
                              {load.driver.avatar}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800">{load.driver.name}</p>
                              <p className="text-[9px] text-slate-400">{load.driver.status} • {load.driver.stops}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Not Assigned</span>
                        )}
                      </td>

                      {/* Pickup Date */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <p className="text-xs font-bold text-slate-800">{load.pickupDate}</p>
                        <p className="text-[9px] text-slate-400">{load.pickupTime}</p>
                      </td>

                      {/* ET */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="text-[9px] text-slate-400">—</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Showing 1 to {Math.min(ITEMS_PER_PAGE, filtered.length)} of {filtered.length} loads
            </span>
            <div className="flex items-center gap-1">
              {[...Array(Math.min(totalPages, 3))].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              {totalPages > 3 && <span className="text-xs text-slate-400 px-1">...</span>}
              <select
                value={ITEMS_PER_PAGE}
                className="ml-2 px-2 py-1 border border-slate-200 rounded-lg text-xs text-slate-600 cursor-pointer"
                readOnly
              >
                <option>20 per page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bottom bulk bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium">0 selected</span>
          <div className="flex items-center gap-2">
            <select className="px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 bg-white">
              <option>Bulk Actions</option>
            </select>
            <button className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-900 transition-colors">
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* ── Right Sidebar ── */}
      <div className="w-full lg:w-72 flex flex-col gap-4">

        {/* Load Overview */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-black text-slate-700">Load Overview</h3>
            <span className="text-[9px] text-slate-400">TODAY · 16 JULY 2025</span>
          </div>

          <div className="space-y-2 mt-3">
            {[
              { label: 'Total Loads',      value: totalLoads,       color: 'text-slate-800', icon: <Layers className="w-4 h-4 text-slate-400" /> },
              { label: 'Active Loads',     value: activeCount,      color: 'text-blue-600',  icon: <Radio className="w-4 h-4 text-blue-500" /> },
              { label: 'In Transit',       value: inTransitCount,   color: 'text-green-600', icon: <Truck className="w-4 h-4 text-green-500" /> },
              { label: 'At Stop',          value: atStopCount,      color: 'text-orange-500',icon: <MapPin className="w-4 h-4 text-orange-400" /> },
              { label: 'Completed Today',  value: completedTodayCount, color: 'text-purple-600',icon: <CheckCircle className="w-4 h-4 text-purple-400" /> },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="text-xs text-slate-600 font-medium">{item.label}</span>
                </div>
                <span className={`text-sm font-black ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Breakdown Donut */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <h3 className="text-xs font-black text-slate-700 mb-4">Status Breakdown</h3>
          <div className="flex flex-col items-center gap-4">
            <DonutChart
              total={totalLoads}
              active={activeCount}
              planned={inTransitCount}
              draft={atStopCount}
              completed={completedTodayCount}
              cancelled={cancelledCount}
            />
            <div className="w-full space-y-1.5">
              {[
                { label: 'Active',    count: activeCount,         color: 'bg-blue-500',   pct: Math.round(activeCount/totalLoads*100) },
                { label: 'Planned',   count: inTransitCount,      color: 'bg-green-500',  pct: Math.round(inTransitCount/totalLoads*100) },
                { label: 'Draft',     count: atStopCount,         color: 'bg-orange-400', pct: Math.round(atStopCount/totalLoads*100) },
                { label: 'Completed', count: completedTodayCount, color: 'bg-purple-500', pct: Math.round(completedTodayCount/totalLoads*100) },
                { label: 'Cancelled', count: cancelledCount,      color: 'bg-red-500',    pct: Math.round(cancelledCount/totalLoads*100) },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 ${item.color} rounded-full shrink-0`} />
                    <span className="text-xs text-slate-600">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-800">{item.count}</span>
                    <span className="text-[10px] text-slate-400">({item.pct}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-black text-slate-700">Recent Alerts</h3>
            <button className="text-[10px] font-bold text-blue-600 hover:underline">VIEW ALL</button>
          </div>
          <div className="space-y-3">
            {[
              { id: 'PO-12543', color: 'bg-rose-500', time: '20m ago', msg: 'Delay alert: Traffic congestion on M4 may be affected' },
              { id: 'PO-12644', color: 'bg-orange-400', time: '45m ago', msg: 'Missing documents: POD required before dispatched' },
              { id: 'PO-12546', color: 'bg-rose-500', time: '1h ago',  msg: 'Driver heads in 30 mins' },
            ].map((alert, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className={`w-6 h-6 ${alert.color} rounded-lg flex items-center justify-center shrink-0 mt-0.5`}>
                  <AlertCircle className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-800">{alert.id}</span>
                    <span className="text-[9px] text-slate-400">{alert.time}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{alert.msg}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            View All Alerts
          </button>
        </div>

      </div>
    </div>
  );
}
