import React, { useState, useEffect } from 'react';
import {
  ChevronRight, ChevronLeft, Search, Filter, Upload,
  Mail, Globe, Package, FileText, Repeat, Link2,
  CheckCircle2, AlertCircle, RefreshCw, Info, Lock,
  Sparkles, Check, Zap, Shield, Clock, Star, Edit3,
  MapPin, User, Truck, Calendar, X, Plus, ArrowRight
} from 'lucide-react';

/* ─── Shared helpers ──────────────────────────────────────────── */
const CONF_COLORS = {
  High:   { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', pct: '94%' },
  Medium: { bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500',   pct: '67%' },
  Low:    { bg: 'bg-rose-100',    text: 'text-rose-700',     dot: 'bg-rose-500',    pct: '38%' },
};

const SOURCES = [
  { id: 'email',    Icon: Mail,     color: '#6366f1', bg: '#eef2ff', label: 'Email',             desc: 'Extract from email bookings' },
  { id: 'portal',  Icon: Globe,    color: '#8b5cf6', bg: '#f3f0ff', label: 'Customer Portal',   desc: 'Extract from online portal' },
  { id: 'stock',   Icon: Package,  color: '#f59e0b', bg: '#fffbeb', label: 'Warehouse Stock',    desc: 'Extract from stock inventory' },
  { id: 'file',    Icon: FileText, color: '#ec4899', bg: '#fdf2f8', label: 'Upload File',        desc: 'PDF, Excel, CSV, Images' },
  { id: 'template',Icon: Repeat,   color: '#3b82f6', bg: '#eff6ff', label: 'Recurring Template', desc: 'Use a saved load template' },
  { id: 'api',     Icon: Link2,    color: '#10b981', bg: '#ecfdf5', label: 'API Integration',    desc: 'Connect external TMS / ERP' },
];

const EMAILS = [
  { id: 1, title: 'Car Transport Booking – Sydney to Melbourne', sender: 'bookings@abcmotors.com.au',   conf: 'High',   isNew: true,  time: 'Today, 9:15 AM'     },
  { id: 2, title: 'Vehicle Transport Request – 3 Cars',          sender: 'transport@fastcars.com.au',   conf: 'Medium', isNew: false, time: 'Yesterday, 4:32 PM'  },
  { id: 3, title: 'Urgent Pickup – Toyota RAV4',                 sender: 'sales@toyota.com.au',         conf: 'High',   isNew: false, time: 'Yesterday, 11:08 AM' },
  { id: 4, title: 'Freight Request – Machinery',                 sender: 'logistics@industrial.com.au', conf: 'Medium', isNew: false, time: '2 days ago'          },
  { id: 5, title: 'Enquiry – Car Transport Quote',               sender: 'info@customer.com.au',        conf: 'Low',    isNew: false, time: '3 days ago'          },
];

const HOW_IT_WORKS = [
  { Icon: Mail,         text: 'AI reads your source'     },
  { Icon: Zap,          text: 'Extracts key information' },
  { Icon: CheckCircle2, text: 'You review and edit'      },
  { Icon: Package,      text: 'Create draft load'        },
];

const SUPPORTED_SOURCES = [
  'Outlook / Gmail Emails','PDF, Excel, CSV, Images',
  'Customer Portal Bookings','Warehouse Stock',
  'Recurring Templates','API Integrations',
];

const TIPS = [
  'Use clear booking emails for best results.',
  'Ensure emails contain pickup, drop-off and item details.',
  'You can edit everything before creating the load.',
];

/* ─── Extracted draft data (editable in Step 3) ──────────────── */
const INITIAL_DRAFT = {
  customer: 'ABC Motors Pty Ltd',
  loadType: 'Car Carrying',
  loadRef: 'PO-12548',
  priority: 'High',
  pickupAddr: '123 Smith St, Melbourne VIC 3000',
  pickupContact: 'John Smith',
  pickupDate: '2025-07-15',
  pickupTime: '08:00',
  dropAddr: '456 Jones Rd, Sydney NSW 2000',
  dropContact: 'Jane Doe',
  dropDate: '2025-07-17',
  dropTime: '16:00',
  items: [
    { rego: 'ABC234', vin: 'JMM2EJH77A5B00125', make: 'Toyota', model: 'HiLux',    year: '2024', colour: 'White', conf: 'High'   },
    { rego: 'XYZ789', vin: '1HGBH41JXMN109186', make: 'Ford',   model: 'Ranger',   year: '2023', colour: 'Black', conf: 'High'   },
    { rego: 'LMN456', vin: 'WAUZZZ4V2KN012345', make: 'Toyota', model: 'Landcruiser',year:'2024', colour: 'Silver',conf: 'Medium' },
  ],
  specialInstructions: 'Call 30 mins before arrival. Gate code: 1234.',
  pricing: '$2,200.00',
};

const EXTRACTION_FIELDS = [
  { label: 'Customer Details',        value: 'ABC Motors\nPty Ltd' },
  { label: 'Pickup & Drop-off Stops', value: '2 Stops'             },
  { label: 'Cars / Items',            value: '3 Cars'              },
  { label: 'Rego, VIN, Make, Model',  value: 'Yes'                 },
  { label: 'Dates & Times',           value: 'Yes'                 },
  { label: 'Special Instructions',    value: 'Yes'                 },
  { label: 'Pricing & Billing Info',  value: 'Yes'                 },
  { label: 'Documents & Photos',      value: 'Yes'                 },
];

/* ─── Input style ─────────────────────────────────────────────── */
const inpCls = 'w-full px-3 py-2 bg-white border border-slate-200 focus:border-indigo-400 rounded-lg focus:outline-none text-xs font-bold text-slate-800 placeholder-slate-400 transition-colors';

export default function AILoadBuilder({ onBack }) {
  const [step,           setStep]           = useState(1);   // 1 | 2 | 3 | 4
  const [selectedSource, setSelectedSource] = useState('email');
  const [selectedEmail,  setSelectedEmail]  = useState(1);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [extractPct,     setExtractPct]     = useState(0);
  const [draft,          setDraft]          = useState(INITIAL_DRAFT);
  const [draftCreated,   setDraftCreated]   = useState(false);
  const [draftSaving,    setDraftSaving]    = useState(false);

  /* ── Step 2: simulate extraction progress ─────────────────── */
  useEffect(() => {
    if (step !== 2) return;
    setExtractPct(0);
    const interval = setInterval(() => {
      setExtractPct(p => {
        if (p >= 100) { clearInterval(interval); setTimeout(() => setStep(3), 600); return 100; }
        return p + 4;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [step]);

  const selectedEmailData = EMAILS.find(e => e.id === selectedEmail);
  const emailConf = selectedEmailData ? CONF_COLORS[selectedEmailData.conf] : CONF_COLORS.High;

  const filteredEmails = EMAILS.filter(e =>
    !searchQuery ||
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.sender.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateDraft = (field, value) => setDraft(d => ({ ...d, [field]: value }));
  const updateItem  = (idx, field, value) =>
    setDraft(d => ({ ...d, items: d.items.map((it, i) => i === idx ? { ...it, [field]: value } : it) }));

  const handleCreateDraft = () => {
    setDraftSaving(true);
    setTimeout(() => { setDraftSaving(false); setDraftCreated(true); setStep(4); }, 1800);
  };

  /* ── Step indicator ───────────────────────────────────────── */
  const STEPS = [
    { num: 1, label: 'Choose Source', desc: 'Select where to extract data from' },
    { num: 2, label: 'AI Extraction', desc: 'AI is reading and extracting data'  },
    { num: 3, label: 'Review & Edit', desc: 'Review extracted information'       },
    { num: 4, label: 'Create Draft',  desc: 'Save as draft load'                 },
  ];

  /* ────────────────────────────────────────────────────────── */
  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col font-sans text-left overflow-y-auto">

      {/* TOP HEADER */}
      <div className="bg-white border-b border-slate-200 shrink-0">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-5">
          <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold text-slate-500 flex-wrap">
            <span className="cursor-pointer hover:text-slate-800" onClick={onBack}>Home</span>
            <ChevronRight size={12} className="text-slate-400" />
            <span className="cursor-pointer hover:text-slate-800" onClick={onBack}>Loads</span>
            <ChevronRight size={12} className="text-slate-400" />
            <span className="text-slate-900 font-bold">AI Load Builder</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-200 shrink-0">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                    AI Load Builder <span className="text-indigo-600 text-sm sm:text-lg font-bold">(2.2A)</span>
                  </h1>
                  <span className="px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest rounded-md">BETA</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">Extract load details from emails, portals, files or stock using AI.</p>
              </div>
            </div>
            <button onClick={onBack} className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors shrink-0 shadow-xs">
              <ChevronLeft size={16} /> Back to Create Load
            </button>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-8 max-w-[1200px] mx-auto w-full items-start">

        {/* LEFT SIDEBAR */}
        <div className="w-full lg:w-52 shrink-0 flex flex-col gap-4">
          {/* Steps */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex flex-row lg:flex-col justify-between lg:justify-start gap-4 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              {STEPS.map((s, i) => {
                const done    = step > s.num;
                const current = step === s.num;
                return (
                  <div key={i} className="flex flex-col lg:flex-col gap-1 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all ${
                        done    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' :
                        current ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-200' :
                                  'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}>
                        {done ? <Check size={14} /> : current ? <Sparkles size={14} /> : s.num}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold leading-tight ${current ? 'text-indigo-600' : done ? 'text-emerald-600' : 'text-slate-400'}`}>{s.label}</p>
                        <p className="text-[10px] text-slate-400 font-medium leading-tight hidden lg:block mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                    {i < STEPS.length - 1 && <div className={`w-0.5 h-6 ml-4 hidden lg:block my-0.5 ${done ? 'bg-emerald-300' : 'bg-slate-200'}`} />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* How it works */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">How it works</h3>
            <div className="space-y-3">
              {HOW_IT_WORKS.map(({ Icon, text }, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                    <Icon size={12} className="text-indigo-600" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{text}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 font-semibold italic mt-4">You're always in control.</p>
          </div>

          {/* AI Confidence Guide */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">AI Confidence Guide</h3>
            <div className="space-y-2.5">
              {[
                { range: 'High (80–100%)',  sub: 'Very confident',     dot: 'bg-emerald-500' },
                { range: 'Medium (50–79%)', sub: 'Review recommended', dot: 'bg-amber-500'   },
                { range: 'Low (0–49%)',     sub: 'Needs attention',    dot: 'bg-rose-500'    },
              ].map((c, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className={`w-2 h-2 rounded-full ${c.dot} mt-1 shrink-0`} />
                  <div>
                    <p className="text-xs font-bold text-slate-800">{c.range}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{c.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT ───────────────────────────────────────── */}
        <div className="flex-1 min-w-0 w-full">

          {/* ══════════════ STEP 1: Choose Source ══════════════════ */}
          {step === 1 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-7 shadow-xs">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-black flex items-center justify-center shadow-md shadow-indigo-200">1</div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">Choose Source</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mb-6">Select where you want AI to extract the load details from.</p>

              {/* Source grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
                {SOURCES.map(({ id, Icon, color, bg, label, desc }) => {
                  const active = selectedSource === id;
                  return (
                    <button key={id} onClick={() => setSelectedSource(id)}
                      className={`relative flex items-center gap-3.5 p-4 rounded-xl transition-all text-left cursor-pointer border ${
                        active ? 'border-indigo-600 bg-indigo-50/40 shadow-xs' : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50/50'
                      }`}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border" style={{ backgroundColor: bg, borderColor: `${color}33` }}>
                        <Icon size={18} style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-slate-900 mb-0.5">{label}</p>
                        <p className="text-[11px] font-semibold text-slate-400 truncate">{desc}</p>
                      </div>
                      {active && (
                        <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center">
                          <Check size={10} className="text-white" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Select Email Source */}
              <div className="mb-6">
                <h4 className="text-xs font-black text-slate-900 mb-0.5">Select Email Source</h4>
                <p className="text-xs text-slate-400 font-medium">Connect your email account to scan for bookings.</p>
                <div className="flex flex-col sm:flex-row gap-2.5 mt-3">
                  <select className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 appearance-none">
                    <option>Outlook – dispatch@abcmotors.com.au</option>
                    <option>Gmail – info@abcmotors.com.au</option>
                  </select>
                  <button className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors">Disconnect</button>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-3">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span className="text-xs font-bold text-emerald-600">Connected successfully.<span className="text-slate-400 font-semibold ml-1.5">Last synced: Today, 9:15 AM</span></span>
                  </div>
                  <button className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"><RefreshCw size={12} /> Refresh</button>
                </div>
              </div>

              {/* Search Emails */}
              <div className="mb-6">
                <h4 className="text-xs font-black text-slate-900 mb-0.5">Search Emails</h4>
                <p className="text-xs text-slate-400 font-medium">Find the booking email you want to extract.</p>
                <div className="flex flex-col sm:flex-row gap-2.5 mt-3">
                  <div className="relative flex-1">
                    <Search size={14} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="Search by subject, customer, reference..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500" />
                  </div>
                  <button className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"><Filter size={14} /> Filter</button>
                </div>
              </div>

              {/* Email list */}
              <div className="mb-6">
                <h4 className="text-xs font-black text-slate-900 mb-3">Recent Booking Emails</h4>
                <div className="space-y-2.5">
                  {filteredEmails.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs font-medium">No emails match your search.</div>
                  ) : filteredEmails.map(email => {
                    const conf = CONF_COLORS[email.conf];
                    const isActive = selectedEmail === email.id;
                    return (
                      <div key={email.id} onClick={() => setSelectedEmail(email.id)}
                        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all border gap-3 ${
                          isActive ? 'border-indigo-600 bg-indigo-50/30 shadow-xs' : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50/40'
                        }`}>
                        <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                            <Mail size={16} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                              <span className="text-xs font-bold text-slate-900 truncate max-w-[220px]">{email.title}</span>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${conf.bg} ${conf.text}`}>{email.conf}</span>
                              {email.isNew && <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-blue-100 text-blue-700">New</span>}
                            </div>
                            <span className="text-[11px] font-semibold text-slate-400 block truncate">{email.sender}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          <span className="text-[11px] text-slate-400 font-semibold">{email.time}</span>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all border ${isActive ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                            {isActive && <Check size={11} className="text-white" strokeWidth={3} />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-500">Can't find the email? Upload the file instead</span>
                <button className="w-full sm:w-auto px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"><Upload size={14} /> Upload File</button>
              </div>
            </div>
          )}

          {/* ══════════════ STEP 2: AI Extraction ══════════════════ */}
          {step === 2 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-7 shadow-xs">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-black flex items-center justify-center shadow-md shadow-indigo-200 animate-pulse">2</div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">AI Extraction</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mb-8">AI is reading and extracting data from your email…</p>

              {/* Selected email preview */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-slate-900 truncate">{selectedEmailData?.title}</p>
                  <p className="text-[11px] text-slate-500 font-semibold">{selectedEmailData?.sender}</p>
                </div>
                <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${CONF_COLORS[selectedEmailData?.conf || 'High'].bg} ${CONF_COLORS[selectedEmailData?.conf || 'High'].text}`}>
                  {selectedEmailData?.conf}
                </span>
              </div>

              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-slate-700">Extracting data…</span>
                  <span className="text-xs font-black text-indigo-600">{extractPct}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-200" style={{ width: `${extractPct}%` }} />
                </div>
              </div>

              {/* What's being extracted */}
              <div className="space-y-3">
                {[
                  { label: 'Reading email header & body', done: extractPct > 15 },
                  { label: 'Identifying customer details',  done: extractPct > 30 },
                  { label: 'Extracting pickup & drop-off stops', done: extractPct > 50 },
                  { label: 'Parsing vehicle / item list',   done: extractPct > 65 },
                  { label: 'Extracting dates & times',      done: extractPct > 78 },
                  { label: 'Processing pricing info',       done: extractPct > 88 },
                  { label: 'Finalising draft load',         done: extractPct >= 100 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${item.done ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                      {item.done ? <Check size={11} className="text-white" strokeWidth={3} /> : <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />}
                    </div>
                    <span className={`text-xs font-semibold transition-colors ${item.done ? 'text-emerald-700' : 'text-slate-400'}`}>{item.label}</span>
                  </div>
                ))}
              </div>

              {extractPct >= 100 && (
                <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-sm font-black text-emerald-800">Extraction Complete!</p>
                    <p className="text-xs font-semibold text-emerald-600">Redirecting to review screen…</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══════════════ STEP 3: Review & Edit ══════════════════ */}
          {step === 3 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-7 shadow-xs space-y-7">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-black flex items-center justify-center shadow-md shadow-indigo-200">3</div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">Review & Edit</h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">Review and correct the AI-extracted data before creating the draft load.</p>
              </div>

              {/* AI Confidence Banner */}
              <div className={`flex items-center gap-3 p-4 rounded-xl border ${emailConf.bg.replace('bg-', 'bg-').replace('100', '50')} border-${emailConf.dot.replace('bg-','')} border-opacity-30`}
                   style={{ backgroundColor: selectedEmailData?.conf === 'High' ? '#f0fdf4' : selectedEmailData?.conf === 'Medium' ? '#fffbeb' : '#fff1f2' }}>
                <div className={`w-3 h-3 rounded-full ${emailConf.dot} shrink-0`} />
                <div className="flex-1">
                  <p className={`text-xs font-black ${emailConf.text}`}>AI Confidence: {emailConf.pct} — {selectedEmailData?.conf}</p>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Fields highlighted in amber may need manual review.</p>
                </div>
                <Edit3 size={14} className="text-slate-400" />
              </div>

              {/* Customer & Load */}
              <section>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><User size={13} /> Customer & Load Info</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { label: 'Customer / Owner', field: 'customer' },
                    { label: 'Load Type',        field: 'loadType' },
                    { label: 'Load Reference',   field: 'loadRef'  },
                    { label: 'Priority',         field: 'priority' },
                    { label: 'Estimated Pricing',field: 'pricing'  },
                  ].map(({ label, field }) => (
                    <div key={field}>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</label>
                      <input type="text" value={draft[field]} onChange={e => updateDraft(field, e.target.value)} className={inpCls} />
                    </div>
                  ))}
                </div>
              </section>

              {/* Stops */}
              <section>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><MapPin size={13} /> Route Stops</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Pickup */}
                  <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 space-y-2">
                    <p className="text-[10px] font-black text-purple-700 uppercase tracking-widest mb-2">📍 Pickup Stop</p>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Address</label>
                      <input type="text" value={draft.pickupAddr} onChange={e => updateDraft('pickupAddr', e.target.value)} className={inpCls} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</label>
                        <input type="date" value={draft.pickupDate} onChange={e => updateDraft('pickupDate', e.target.value)} className={inpCls} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time</label>
                        <input type="time" value={draft.pickupTime} onChange={e => updateDraft('pickupTime', e.target.value)} className={inpCls} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact</label>
                      <input type="text" value={draft.pickupContact} onChange={e => updateDraft('pickupContact', e.target.value)} className={inpCls} />
                    </div>
                  </div>
                  {/* Drop-off */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2">
                    <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-2">📦 Drop-off Stop</p>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Address</label>
                      <input type="text" value={draft.dropAddr} onChange={e => updateDraft('dropAddr', e.target.value)} className={inpCls} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</label>
                        <input type="date" value={draft.dropDate} onChange={e => updateDraft('dropDate', e.target.value)} className={inpCls} />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time</label>
                        <input type="time" value={draft.dropTime} onChange={e => updateDraft('dropTime', e.target.value)} className={inpCls} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact</label>
                      <input type="text" value={draft.dropContact} onChange={e => updateDraft('dropContact', e.target.value)} className={inpCls} />
                    </div>
                  </div>
                </div>
              </section>

              {/* Items */}
              <section>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Truck size={13} /> Items / Vehicles ({draft.items.length})</h3>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs min-w-[600px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        {['#','Rego','VIN / Chassis','Make','Model','Year','Colour','Confidence'].map(h => (
                          <th key={h} className="px-3 py-2.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {draft.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="px-3 py-2.5 text-slate-500 font-bold">{idx + 1}</td>
                          <td className="px-3 py-2.5"><input type="text" value={item.rego}   onChange={e => updateItem(idx,'rego',e.target.value)}   className="w-20 px-2 py-1 border border-slate-200 rounded text-[11px] font-bold focus:outline-none focus:border-indigo-400" /></td>
                          <td className="px-3 py-2.5"><input type="text" value={item.vin}    onChange={e => updateItem(idx,'vin',e.target.value)}    className="w-36 px-2 py-1 border border-slate-200 rounded text-[11px] font-mono font-bold focus:outline-none focus:border-indigo-400" /></td>
                          <td className="px-3 py-2.5"><input type="text" value={item.make}   onChange={e => updateItem(idx,'make',e.target.value)}   className="w-20 px-2 py-1 border border-slate-200 rounded text-[11px] font-bold focus:outline-none focus:border-indigo-400" /></td>
                          <td className="px-3 py-2.5"><input type="text" value={item.model}  onChange={e => updateItem(idx,'model',e.target.value)}  className="w-24 px-2 py-1 border border-slate-200 rounded text-[11px] font-bold focus:outline-none focus:border-indigo-400" /></td>
                          <td className="px-3 py-2.5"><input type="text" value={item.year}   onChange={e => updateItem(idx,'year',e.target.value)}   className="w-16 px-2 py-1 border border-slate-200 rounded text-[11px] font-bold focus:outline-none focus:border-indigo-400" /></td>
                          <td className="px-3 py-2.5"><input type="text" value={item.colour} onChange={e => updateItem(idx,'colour',e.target.value)} className="w-20 px-2 py-1 border border-slate-200 rounded text-[11px] font-bold focus:outline-none focus:border-indigo-400" /></td>
                          <td className="px-3 py-2.5">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black ${CONF_COLORS[item.conf].bg} ${CONF_COLORS[item.conf].text}`}>{item.conf}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Special Instructions */}
              <section>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Special Instructions</h3>
                <textarea rows={3} value={draft.specialInstructions} onChange={e => updateDraft('specialInstructions', e.target.value)}
                  className={`${inpCls} resize-none`} placeholder="Any special instructions..." />
              </section>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <button onClick={() => setStep(1)} className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors">
                  <ChevronLeft size={15} /> Back to Sources
                </button>
                <button onClick={handleCreateDraft}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-indigo-200">
                  {draftSaving ? <><RefreshCw size={14} className="animate-spin" /> Saving…</> : <><Check size={14} /> Create Draft Load <ArrowRight size={14} /></>}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════ STEP 4: Draft Created ══════════════════ */}
          {step === 4 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-7 shadow-xs">
              <div className="flex flex-col items-center text-center py-10">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-xl shadow-emerald-200 mb-6">
                  <CheckCircle2 size={40} className="text-white" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Draft Load Created!</h2>
                <p className="text-sm font-semibold text-slate-500 mb-2">Your load has been saved as a draft successfully.</p>
                <div className="flex items-center gap-2 mb-8">
                  <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 font-black text-xs rounded-lg">{draft.loadRef}</span>
                  <span className="px-3 py-1 bg-amber-50 border border-amber-100 text-amber-700 font-black text-xs rounded-lg">DRAFT</span>
                </div>

                {/* Summary card */}
                <div className="w-full max-w-lg bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left mb-8 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div><p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mb-1">Customer</p><p className="font-black text-slate-900">{draft.customer}</p></div>
                    <div><p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mb-1">Load Type</p><p className="font-black text-slate-900">{draft.loadType}</p></div>
                    <div><p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mb-1">Pickup</p><p className="font-black text-slate-900">{draft.pickupAddr}</p></div>
                    <div><p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mb-1">Drop-off</p><p className="font-black text-slate-900">{draft.dropAddr}</p></div>
                    <div><p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mb-1">Vehicles</p><p className="font-black text-slate-900">{draft.items.length} Cars</p></div>
                    <div><p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mb-1">Pricing</p><p className="font-black text-indigo-700">{draft.pricing}</p></div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
                  <button onClick={() => { setStep(1); setDraftCreated(false); }} className="flex-1 px-5 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                    <Plus size={14} /> Build Another Load
                  </button>
                  <button onClick={onBack} className="flex-1 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2">
                    <Zap size={14} className="fill-amber-400 text-amber-400" /> Activate Load
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT SIDEBAR ─────────────────────────────────────── */}
        <div className="w-full lg:w-60 shrink-0 flex flex-col gap-4">
          {/* Extraction Preview */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-1">Extraction Preview</h3>
            <p className="text-[11px] font-medium text-slate-400 mb-4">AI will extract the following information:</p>
            <div className="space-y-2.5">
              {EXTRACTION_FIELDS.map((field, i) => (
                <div key={i} className="flex items-start justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2 size={13} className={step >= 3 ? 'text-emerald-500 shrink-0' : 'text-slate-300 shrink-0'} />
                    <span className="font-semibold text-slate-600 truncate">{field.label}</span>
                  </div>
                  <span className="font-bold text-slate-900 text-right whitespace-pre-line leading-tight">{field.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-semibold italic text-center">
              {step >= 3 ? `AI confidence: ${emailConf.pct}` : 'AI confidence will be shown in next step.'}
            </div>
          </div>

          {/* Supported Sources */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">Supported Sources</h3>
            <ul className="space-y-2">
              {SUPPORTED_SOURCES.map((src, i) => (
                <li key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />{src}
                </li>
              ))}
            </ul>
            <button className="text-xs font-bold text-indigo-600 hover:underline mt-4 flex items-center gap-1">View all integrations <ChevronRight size={13} /></button>
          </div>

          {/* Tips */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0"><Info size={14} className="text-emerald-700" /></div>
              <span className="text-xs font-bold text-emerald-900">Tips</span>
            </div>
            <ul className="space-y-2">
              {TIPS.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-emerald-800 font-medium leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" /><span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Button */}
          {step === 1 && (
            <div>
              <button onClick={() => setStep(2)}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-indigo-200">
                Next: Extract Data <ChevronRight size={16} />
              </button>
              <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-slate-400 font-semibold text-center">
                <Lock size={11} className="shrink-0" /><span>Your data is secure and will not be stored without permission.</span>
              </div>
            </div>
          )}
          {step === 3 && (
            <button onClick={handleCreateDraft}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-200">
              {draftSaving ? <><RefreshCw size={14} className="animate-spin" /> Saving…</> : <><Check size={14} /> Create Draft</>}
            </button>
          )}
          {step === 4 && (
            <button onClick={onBack}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-indigo-200">
              <Zap size={14} className="fill-amber-400 text-amber-400" /> Activate Load
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
