import React, { useState } from 'react';
import { ChevronRight, MapPin, Truck, User, SlidersHorizontal, AlertCircle, Check, RefreshCw, RotateCcw, Package } from 'lucide-react';

export default function DeliveryIssues() {
  const [openDropdown, setOpenDropdown] = useState(null);

  const issues = [
    {
      time: '14 mins ago',
      id: 'SHP-9039',
      iconType: 'location',
      priority: 'HIGH',
      priorityBg: 'bg-slate-100',
      priorityText: 'text-slate-700',
      tag: 'GPS',
      title: 'Location Problem',
      desc: 'The driver is in the wrong place for this drop-off.',
      driver: 'Liam Smith',
    },
    {
      time: '41 mins ago',
      id: 'SHP-9011',
      iconType: 'truck',
      priority: 'CRITICAL',
      priorityBg: 'bg-[#EF4444]',
      priorityText: 'text-white',
      tag: 'Sensor',
      title: 'Temperature Alert',
      desc: 'The truck storage is too warm for the items.',
      driver: 'Oliver Brown',
    },
    {
      time: '2 hrs ago',
      id: 'SHP-8992',
      iconType: 'user',
      priority: 'MEDIUM',
      priorityBg: 'bg-slate-100',
      priorityText: 'text-slate-700',
      tag: 'Customer',
      title: 'Customer Refusal',
      desc: 'The client did not want to take the items today.',
      driver: 'Noah Williams',
    }
  ];

  return (
    <div className="flex-grow bg-[#FAFAFA] p-6 w-full text-left font-sans custom-scrollbar overflow-y-auto">
      <div className="flex flex-col gap-4 w-full">
        {issues.map((issue, index) => (
          <div key={index} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
            {/* Left section */}
            <div className="flex items-center w-[220px] shrink-0">
              <div className="flex flex-col grow">
                <span className="text-slate-400 text-[11px] font-semibold mb-0.5">{issue.time}</span>
                <div className="flex items-center text-slate-800 font-bold text-[13px] gap-1">
                  {issue.id}
                  <ChevronRight size={14} className="text-slate-300" strokeWidth={2.5} />
                </div>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mr-4 ${
                issue.iconType === 'location' ? 'bg-red-50 text-red-500' :
                issue.iconType === 'truck' ? 'bg-amber-50 text-amber-500' :
                'bg-blue-50 text-blue-500'
              }`}>
                {issue.iconType === 'location' && <MapPin size={18} strokeWidth={2.5} />}
                {issue.iconType === 'truck' && <Truck size={18} strokeWidth={2.5} />}
                {issue.iconType === 'user' && <User size={18} strokeWidth={2.5} />}
              </div>
            </div>

            {/* Middle section */}
            <div className="flex flex-col gap-0.5 grow px-2">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${issue.priorityBg} ${issue.priorityText}`}>
                  {issue.priority}
                </span>
                <span className="text-slate-400 text-[11px] italic font-semibold">
                  {issue.tag}
                </span>
              </div>
              <h3 className="text-slate-900 font-bold text-[15px] leading-tight mb-0.5">
                {issue.title}
              </h3>
              <div className="flex items-center gap-2 text-[12px] text-slate-500 font-medium">
                <span>{issue.desc}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span>
                  Driver: <span className="font-bold text-slate-700">{issue.driver}</span>
                </span>
              </div>
            </div>

            {/* Right section */}
            <div className="shrink-0 pl-4 relative">
              <button 
                onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                className="bg-[#FFCC00] hover:bg-yellow-400 text-black font-extrabold text-[11px] px-4 py-2 rounded-full flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                UPDATE STATUS
                <SlidersHorizontal size={14} strokeWidth={2.5} />
              </button>
              
              {/* Dropdown Menu */}
              {openDropdown === index && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-[260px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 p-2 z-50 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-200">
                  <button className="w-full flex items-center gap-3.5 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                      <Check size={16} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-800 font-extrabold text-[12px]">MARK RESOLVED</span>
                      <span className="text-slate-400 font-semibold text-[11px] mt-0.5">Issue is fully fixed</span>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-3.5 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                      <RefreshCw size={16} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-800 font-extrabold text-[12px]">DELIVER AGAIN</span>
                      <span className="text-slate-400 font-semibold text-[11px] mt-0.5">Retry delivery attempt</span>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-3.5 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                      <RotateCcw size={16} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-800 font-extrabold text-[12px]">RETURN TO DEPOT</span>
                      <span className="text-slate-400 font-semibold text-[11px] mt-0.5">Bring back to branch</span>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-3.5 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                      <Package size={16} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-800 font-extrabold text-[12px]">MARK DAMAGED</span>
                      <span className="text-slate-400 font-semibold text-[11px] mt-0.5">Report items broken</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Notice box */}
        <div className="bg-[#0F172A] rounded-xl px-5 py-3.5 flex items-center gap-3 mt-1">
          <AlertCircle size={18} className="text-yellow-400 shrink-0" strokeWidth={2} />
          <p className="text-slate-300 text-[12px] font-medium">
            Issues now display their status in the middle column next to the priority. Track and clear resolved issues using the status logs.
          </p>
        </div>
      </div>
    </div>
  );
}
