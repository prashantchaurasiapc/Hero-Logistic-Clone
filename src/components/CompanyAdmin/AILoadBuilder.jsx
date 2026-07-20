import React, { useState } from 'react';
import {
  ChevronRight, ChevronLeft, Search, Filter, Upload,
  Mail, Globe, Package, FileText, Repeat, Link2,
  CheckCircle2, AlertCircle, RefreshCw, Info, Lock,
  Sparkles, Check, Zap, Shield, Clock, Star
} from 'lucide-react';

/* ─── Shared helpers ──────────────────────────────────────────── */
const CONF_COLORS = {
  High:   { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Medium: { bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
  Low:    { bg: 'bg-rose-100',    text: 'text-rose-700',     dot: 'bg-rose-500'    },
};

/* ─── Static Data ─────────────────────────────────────────────── */
const STEPS = [
  { num: 1, label: 'Choose Source',  desc: 'Select where to extract data from', active: true  },
  { num: 2, label: 'AI Extraction',  desc: 'AI is reading and extracting data',   active: false },
  { num: 3, label: 'Review & Edit',  desc: 'Review extracted information',        active: false },
  { num: 4, label: 'Create Draft',   desc: 'Save as draft load',                   active: false },
];

const SOURCES = [
  { id: 'email',    Icon: Mail,    color: '#6366f1', bg: '#eef2ff', label: 'Email',              desc: 'Extract from email bookings' },
  { id: 'portal',   Icon: Globe,   color: '#8b5cf6', bg: '#f3f0ff', label: 'Customer Portal',    desc: 'Extract from online portal' },
  { id: 'stock',    Icon: Package, color: '#f59e0b', bg: '#fffbeb', label: 'Warehouse Stock',     desc: 'Extract from stock inventory' },
  { id: 'file',     Icon: FileText,color: '#ec4899', bg: '#fdf2f8', label: 'Upload File',         desc: 'PDF, Excel, CSV, Images' },
  { id: 'template', Icon: Repeat,  color: '#3b82f6', bg: '#eff6ff', label: 'Recurring Template',  desc: 'Use a saved load template' },
  { id: 'api',      Icon: Link2,   color: '#10b981', bg: '#ecfdf5', label: 'API Integration',     desc: 'Connect external TMS / ERP' },
];

const EMAILS = [
  { id: 1, title: 'Car Transport Booking – Sydney to Melbourne', sender: 'bookings@abcmotors.com.au',    conf: 'High',   isNew: true,  time: 'Today, 9:15 AM'    },
  { id: 2, title: 'Vehicle Transport Request – 3 Cars',          sender: 'transport@fastcars.com.au',    conf: 'Medium', isNew: false, time: 'Yesterday, 4:32 PM' },
  { id: 3, title: 'Urgent Pickup – Toyota RAV4',                 sender: 'sales@toyota.com.au',          conf: 'High',   isNew: false, time: 'Yesterday, 11:08 AM'},
  { id: 4, title: 'Freight Request – Machinery',                  sender: 'logistics@industrial.com.au',  conf: 'Medium', isNew: false, time: '2 days ago'         },
  { id: 5, title: 'Enquiry – Car Transport Quote',              sender: 'info@customer.com.au',         conf: 'Low',    isNew: false, time: '3 days ago'         },
];

const EXTRACTION_FIELDS = [
  { label: 'Customer Details',          value: 'ABC Motors\nPty Ltd', checked: true  },
  { label: 'Pickup & Drop-off Stops',   value: '2 Stops',             checked: true  },
  { label: 'Cars / Items',              value: '3 Cars',              checked: false },
  { label: 'Rego, VIN, Make, Model',    value: 'Yes',                 checked: true  },
  { label: 'Dates & Times',             value: 'Yes',                 checked: true  },
  { label: 'Special Instructions',      value: 'Yes',                 checked: true  },
  { label: 'Pricing & Billing Info',    value: 'Yes',                 checked: true  },
  { label: 'Documents & Photos',        value: 'Yes',                 checked: true  },
];

const SUPPORTED_SOURCES = [
  'Outlook / Gmail Emails',
  'PDF, Excel, CSV, Images',
  'Customer Portal Bookings',
  'Warehouse Stock',
  'Recurring Templates',
  'API Integrations',
];

const TIPS = [
  'Use clear booking emails for best results.',
  'Ensure emails contain pickup, drop-off and item details.',
  'You can edit everything before creating the load.',
];

const HOW_IT_WORKS = [
  { Icon: Mail,          text: 'AI reads your source'     },
  { Icon: Zap,           text: 'Extracts key information' },
  { Icon: CheckCircle2,  text: 'You review and edit'      },
  { Icon: Package,       text: 'Create draft load'        },
];

export default function AILoadBuilder({ onBack }) {
  const [selectedSource, setSelectedSource] = useState('email');
  const [selectedEmail, setSelectedEmail]   = useState(1);
  const [searchQuery, setSearchQuery]        = useState('');
  const [isExtracting, setIsExtracting]     = useState(false);

  const handleExtract = () => {
    setIsExtracting(true);
    setTimeout(() => setIsExtracting(false), 2000);
  };

  const filteredEmails = EMAILS.filter(e =>
    !searchQuery ||
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.sender.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col font-sans text-left overflow-y-auto">

      {/* ── TOP HEADER ─────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 shrink-0">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-5">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold text-slate-500 flex-wrap">
            <span className="cursor-pointer hover:text-slate-800 transition-colors" onClick={onBack}>Home</span>
            <ChevronRight size={12} className="text-slate-400" />
            <span className="cursor-pointer hover:text-slate-800 transition-colors" onClick={onBack}>Loads</span>
            <ChevronRight size={12} className="text-slate-400" />
            <span className="text-slate-900 font-bold">AI Load Builder</span>
          </div>

          {/* Title row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-200 shrink-0">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                    AI Load Builder <span className="text-indigo-600 text-sm sm:text-lg font-bold">(2.2A)</span>
                  </h1>
                  <span className="px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest rounded-md">
                    BETA
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
                  Extract load details from emails, portals, files or stock using AI.
                </p>
              </div>
            </div>

            <button 
              onClick={onBack}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors shrink-0 shadow-xs"
            >
              <ChevronLeft size={16} />
              Back to Create Load
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ──────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-8 max-w-[1200px] mx-auto w-full items-start">

        {/* ── LEFT SIDEBAR ─────────────────────────────────── */}
        <div className="w-full lg:w-52 shrink-0 flex flex-col gap-4">

          {/* Step progress */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex flex-row lg:flex-col justify-between lg:justify-start gap-4 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              {STEPS.map((step, i) => (
                <div key={i} className="flex flex-col lg:flex-col gap-1 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all ${
                      step.active 
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-200' 
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}>
                      {step.active ? <Sparkles size={14} /> : step.num}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold leading-tight ${step.active ? 'text-indigo-600' : 'text-slate-400'}`}>
                        {step.label}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium leading-tight hidden lg:block mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="w-0.5 h-6 bg-slate-200 ml-4 hidden lg:block my-0.5" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs">
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
            <p className="text-[10px] text-slate-400 font-semibold italic mt-4">
              You're always in control.
            </p>
          </div>

          {/* AI Confidence Guide */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">AI Confidence Guide</h3>
            <div className="space-y-2.5">
              {[
                { range: 'High (80–100%)',   sub: 'Very confident',      dot: 'bg-emerald-500' },
                { range: 'Medium (50–79%)',  sub: 'Review recommended',  dot: 'bg-amber-500' },
                { range: 'Low (0–49%)',      sub: 'Needs attention',     dot: 'bg-rose-500' },
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

        {/* ── MAIN CONTENT ─────────────────────────────────── */}
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-4 sm:p-7 shadow-xs min-w-0 w-full">

          {/* Step header */}
          <div className="flex items-center gap-3 mb-1">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-black flex items-center justify-center shadow-md shadow-indigo-200">
              1
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">Choose Source</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mb-6">Select where you want AI to extract the load details from.</p>

          {/* Source grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
            {SOURCES.map(({ id, Icon, color, bg, label, desc }) => {
              const active = selectedSource === id;
              return (
                <button
                  key={id}
                  onClick={() => setSelectedSource(id)}
                  className={`relative flex items-center gap-3.5 p-4 rounded-xl transition-all text-left cursor-pointer border ${
                    active 
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-xs' 
                      : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50/50'
                  }`}
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{ backgroundColor: bg, borderColor: `${color}33` }}
                  >
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
              <div className="relative flex-1">
                <select className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 appearance-none">
                  <option>Outlook – dispatch@abcmotors.com.au</option>
                  <option>Gmail – info@abcmotors.com.au</option>
                </select>
              </div>
              <button className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors">
                Disconnect
              </button>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-3">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span className="text-xs font-bold text-emerald-600">
                  Connected successfully.
                  <span className="text-slate-400 font-semibold ml-1.5">Last synced: Today, 9:15 AM</span>
                </span>
              </div>
              <button className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                <RefreshCw size={12} />
                Refresh
              </button>
            </div>
          </div>

          {/* Search Emails */}
          <div className="mb-6">
            <h4 className="text-xs font-black text-slate-900 mb-0.5">Search Emails</h4>
            <p className="text-xs text-slate-400 font-medium">Find the booking email you want to extract.</p>
            <div className="flex flex-col sm:flex-row gap-2.5 mt-3">
              <div className="relative flex-1">
                <Search size={14} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by subject, customer, reference..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5">
                <Filter size={14} />
                Filter
              </button>
            </div>
          </div>

          {/* Recent Booking Emails */}
          <div className="mb-6">
            <h4 className="text-xs font-black text-slate-900 mb-3">Recent Booking Emails</h4>
            <div className="space-y-2.5">
              {filteredEmails.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs font-medium">
                  No emails match your search.
                </div>
              ) : filteredEmails.map(email => {
                const conf = CONF_COLORS[email.conf];
                const isActive = selectedEmail === email.id;
                return (
                  <div
                    key={email.id}
                    onClick={() => setSelectedEmail(email.id)}
                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all border gap-3 ${
                      isActive 
                        ? 'border-indigo-600 bg-indigo-50/30 shadow-xs' 
                        : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50/40'
                    }`}
                  >
                    {/* Left: icon + info */}
                    <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <Mail size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-xs font-bold text-slate-900 truncate max-w-[220px]">
                            {email.title}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${conf.bg} ${conf.text}`}>
                            {email.conf}
                          </span>
                          {email.isNew && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-blue-100 text-blue-700">
                              New
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400 block truncate">
                          {email.sender}
                        </span>
                      </div>
                    </div>

                    {/* Right: time + radio */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <span className="text-[11px] text-slate-400 font-semibold">{email.time}</span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all border ${
                        isActive ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'
                      }`}>
                        {isActive && <Check size={11} className="text-white" strokeWidth={3} />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upload footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-500">Can't find the email? Upload the file instead</span>
            <button className="w-full sm:w-auto px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5">
              <Upload size={14} />
              Upload File
            </button>
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ────────────────────────────────── */}
        <div className="w-full lg:w-60 shrink-0 flex flex-col gap-4">

          {/* Extraction Preview */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-1">Extraction Preview</h3>
            <p className="text-[11px] font-medium text-slate-400 mb-4">
              AI will extract the following information:
            </p>
            <div className="space-y-2.5">
              {EXTRACTION_FIELDS.map((field, i) => (
                <div key={i} className="flex items-start justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2 size={13} className="text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-600 truncate">{field.label}</span>
                  </div>
                  <span className="font-bold text-slate-900 text-right whitespace-pre-line leading-tight">
                    {field.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-semibold italic text-center">
              AI confidence will be shown in next step.
            </div>
          </div>

          {/* Supported Sources */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">Supported Sources</h3>
            <ul className="space-y-2">
              {SUPPORTED_SOURCES.map((src, i) => (
                <li key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                  {src}
                </li>
              ))}
            </ul>
            <button className="text-xs font-bold text-indigo-600 hover:underline mt-4 flex items-center gap-1">
              View all integrations <ChevronRight size={13} />
            </button>
          </div>

          {/* Tips */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4.5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                <Info size={14} className="text-emerald-700" />
              </div>
              <span className="text-xs font-bold text-emerald-900">Tips</span>
            </div>
            <ul className="space-y-2">
              {TIPS.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-emerald-800 font-medium leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Button */}
          <div>
            <button
              onClick={handleExtract}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-indigo-200"
            >
              {isExtracting ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  Extracting...
                </>
              ) : (
                <>
                  Next: Extract Data
                  <ChevronRight size={16} />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-slate-400 font-semibold text-center">
              <Lock size={11} className="shrink-0" />
              <span>Your data is secure and will not be stored without permission.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
