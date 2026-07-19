import React, { useState } from 'react';
import { 
  User, Shield, Sliders, LifeBuoy, Camera, Mail, Building2, Save, 
  Key, Bell, AlertTriangle, MessageSquare, Table, FileText, Send, 
  CheckCircle, ShieldCheck, MapPin, Truck, Calendar, Phone, Edit,
  Star, Clock, ChevronRight, Check, X, ShieldAlert, Award, FileSpreadsheet
} from 'lucide-react';

export default function RosterControl() {
  // Roster Drivers Database
  const [drivers, setDrivers] = useState([
    {
      id: '1',
      name: 'Lucas Jones',
      initials: 'LJ',
      status: 'ON DUTY',
      tags: 'SOLO GPS • NSW HC CLASS • SYDNEY CENTRAL DEPOT',
      rating: 4.8,
      deliveredCount: 284,
      onTimeRate: '96.2%',
      delaysCount: 11,
      contact: {
        name: 'Lucas Jones',
        phone: '+61 491 570 156',
        email: 'lucas.jones@hero.com',
        address: '14 Parramatta Rd, Stanmore NSW 2048'
      },
      assignment: {
        depot: 'Sydney Central Depot',
        shift: 'Day Shift',
        truck: 'TRK-102',
        plate: 'XQC-984'
      },
      compliance: {
        license: {
          class: 'NSW HC Class',
          number: 'LIC-44012-SYD',
          expires: '12 Aug 2026'
        },
        medical: {
          class: 'Fitness for Duty',
          doctor: 'Dr. T. McLeod',
          expires: '11 Oct 2026'
        },
        certs: [
          { name: 'MSIC Access', status: 'ACTIVE' },
          { name: 'Dangerous Goods (DG)', status: 'ACTIVE' },
          { name: 'Construction White Card', status: 'ACTIVE' }
        ]
      },
      permission: {
        loads: 'RESTRICTED',
        desc: 'Allows driver to modify load status and details.'
      },
      liveAssignment: {
        active: true,
        ref: 'SHP-90451',
        eta: '2:15 PM',
        route: 'Sydney Port → Blacktown DC',
        task: 'PICKUP ASSIGNMENT: SC-05',
        progress: 60
      },
      history: [
        { ref: 'SHP-90450', route: 'Sydney Port → Blacktown DC', status: 'DELIVERED', date: 'Today' },
        { ref: 'SHP-90412', route: 'Brisbane DC → Sydney Depot', status: 'DELIVERED', date: 'Yesterday' },
        { ref: 'SHP-90399', route: 'Sydney Depot → Port Botany', status: 'DELIVERED', date: '2 days ago' },
        { ref: 'SHP-90354', route: 'Blacktown DC → Newcastle Depot', status: 'DELIVERED', date: '5 days ago' }
      ]
    },
    {
      id: '2',
      name: 'Jack Taylor',
      initials: 'JT',
      status: 'ON DUTY',
      tags: 'SOLO GPS • NSW MC CLASS • MELBOURNE SOUTH DEPOT',
      rating: 4.9,
      deliveredCount: 312,
      onTimeRate: '98.5%',
      delaysCount: 3,
      contact: {
        name: 'Jack Taylor',
        phone: '+61 491 555 782',
        email: 'jack.taylor@hero.com',
        address: '88 St Kilda Rd, Melbourne VIC 3004'
      },
      assignment: {
        depot: 'Melbourne Depot',
        shift: 'Night Shift',
        truck: 'TRK-12',
        plate: 'XYZ 987'
      },
      compliance: {
        license: {
          class: 'VIC MC Class',
          number: 'LIC-77402-MEL',
          expires: '20 Jan 2027'
        },
        medical: {
          class: 'Fitness for Duty',
          doctor: 'Dr. A. Vance',
          expires: '18 Nov 2026'
        },
        certs: [
          { name: 'MSIC Access', status: 'ACTIVE' },
          { name: 'Dangerous Goods (DG)', status: 'ACTIVE' },
          { name: 'High Risk Work License', status: 'ACTIVE' }
        ]
      },
      permission: {
        loads: 'UNRESTRICTED',
        desc: 'Allows driver to modify load status, dispatch tasks and route.'
      },
      liveAssignment: {
        active: true,
        ref: 'SHP-90399',
        eta: '3:45 PM',
        route: 'Melbourne Port → Altona North DC',
        task: 'TRANSIT: LINEHAUL-09',
        progress: 45
      },
      history: [
        { ref: 'SHP-90398', route: 'Altona North → Melbourne Port', status: 'DELIVERED', date: 'Today' },
        { ref: 'SHP-90350', route: 'Sydney Port → Melbourne Depot', status: 'DELIVERED', date: '2 days ago' },
        { ref: 'SHP-90310', route: 'Melbourne Depot → Geelong Depot', status: 'DELIVERED', date: '4 days ago' }
      ]
    },
    {
      id: '3',
      name: 'Noah Williams',
      initials: 'NW',
      status: 'OFF DUTY',
      tags: 'SOLO GPS • NSW HC CLASS • SYDNEY CENTRAL DEPOT',
      rating: 4.6,
      deliveredCount: 198,
      onTimeRate: '92.4%',
      delaysCount: 22,
      contact: {
        name: 'Noah Williams',
        phone: '+61 491 888 123',
        email: 'noah.w@hero.com',
        address: '54 Crown St, Wollongong NSW 2500'
      },
      assignment: {
        depot: 'Sydney Central Depot',
        shift: 'Day Shift',
        truck: 'TRK-05',
        plate: 'ABC 123'
      },
      compliance: {
        license: {
          class: 'NSW HC Class',
          number: 'LIC-10928-SYD',
          expires: '05 Mar 2026'
        },
        medical: {
          class: 'Fitness for Duty',
          doctor: 'Dr. T. McLeod',
          expires: '14 May 2026'
        },
        certs: [
          { name: 'MSIC Access', status: 'INACTIVE' },
          { name: 'Dangerous Goods (DG)', status: 'ACTIVE' },
          { name: 'Construction White Card', status: 'ACTIVE' }
        ]
      },
      permission: {
        loads: 'RESTRICTED',
        desc: 'Allows driver to modify load status and details.'
      },
      liveAssignment: {
        active: false,
        ref: 'None',
        eta: '--',
        route: 'Rest Period',
        task: 'Waiting for assignment',
        progress: 0
      },
      history: [
        { ref: 'SHP-90212', route: 'Sydney Port → Blacktown DC', status: 'DELIVERED', date: '3 days ago' },
        { ref: 'SHP-90188', route: 'Newcastle Depot → Sydney Central Depot', status: 'DELIVERED', date: 'Yesterday' }
      ]
    }
  ]);

  // Selected driver
  const [selectedDriverId, setSelectedDriverId] = useState('1');
  const [showEditModal, setShowEditModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const activeDriver = drivers.find(d => d.id === selectedDriverId) || drivers[0];

  // Forms edit state
  const [editForm, setEditForm] = useState({
    phone: '',
    email: '',
    address: '',
    shift: '',
    truck: '',
    plate: ''
  });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleEditClick = () => {
    setEditForm({
      phone: activeDriver.contact.phone,
      email: activeDriver.contact.email,
      address: activeDriver.contact.address,
      shift: activeDriver.assignment.shift,
      truck: activeDriver.assignment.truck,
      plate: activeDriver.assignment.plate
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setDrivers(prev => prev.map(d => {
      if (d.id === selectedDriverId) {
        return {
          ...d,
          contact: {
            ...d.contact,
            phone: editForm.phone,
            email: editForm.email,
            address: editForm.address
          },
          assignment: {
            ...d.assignment,
            shift: editForm.shift,
            truck: editForm.truck,
            plate: editForm.plate
          }
        };
      }
      return d;
    }));
    setShowEditModal(false);
    triggerToast(`Successfully updated details for ${activeDriver.name}`);
  };

  return (
    <div className="flex-grow bg-[#F8FAFC] min-h-screen p-6 w-full text-left font-sans custom-scrollbar overflow-y-auto relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 border border-slate-750 transition-all duration-300">
          <ShieldCheck className="w-4 h-4 text-[#FFA000] animate-pulse" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* TOP FILTER / DRIVER SWITCHER BAR */}
      <div className="bg-white border border-slate-100 rounded-[24px] p-4 mb-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl text-slate-900 leading-8 capitalize font-black flex items-center gap-2">
            Dispatcher Portal <span className="text-slate-400 text-xl mx-1">•</span> Roster Control
          </h1>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">
            Operational Roster
          </p>
        </div>

        {/* Switch Driver buttons */}
        <div className="flex items-center gap-2.5 bg-slate-100/80 p-1 border border-slate-200/50 rounded-2xl overflow-x-auto max-w-full scrollbar-none flex-nowrap">
          {drivers.map(d => (
            <button
              key={d.id}
              onClick={() => setSelectedDriverId(d.id)}
              className={`px-4 py-2 rounded-xl text-[10px] font-extrabold cursor-pointer transition-all uppercase whitespace-nowrap tracking-wider flex items-center gap-2 flex-shrink-0 ${
                selectedDriverId === d.id
                  ? 'bg-white text-slate-900 border border-slate-200/80 shadow-xs font-black'
                  : 'text-slate-400 hover:text-slate-800'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${d.status === 'ON DUTY' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
              {d.name}
            </button>
          ))}
        </div>
      </div>

      {/* DRIVER ACTIVE PROFILE CARD HEADER */}
      <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          
          {/* Avatar Icon */}
          <div className="w-16 h-16 bg-slate-200 border-2 border-slate-50 shadow-2xs rounded-[20px] flex items-center justify-center font-black text-slate-600 text-lg tracking-wider shrink-0 select-none">
            {activeDriver.initials}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2.5 justify-center sm:justify-start">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">{activeDriver.name}</h2>
              <span className={`px-2.5 py-0.5 text-[9px] font-black rounded-md tracking-wider border uppercase ${
                activeDriver.status === 'ON DUTY' 
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                  : 'bg-slate-105 text-slate-500 border-slate-200'
              }`}>
                {activeDriver.status}
              </span>
            </div>

            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-1.5">
              {activeDriver.tags}
            </p>

            <div className="flex items-center gap-1 mt-2.5 justify-center sm:justify-start">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} className={i < Math.floor(activeDriver.rating) ? "text-[#FFA000] fill-[#FFA000]" : "text-slate-200"} />
              ))}
              <span className="text-[10px] font-extrabold text-slate-500 ml-1">{activeDriver.rating} Rating</span>
            </div>
          </div>
        </div>

        {/* Edit profile Action */}
        <button
          onClick={handleEditClick}
          className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-extrabold text-[10px] py-2.5 px-4.5 rounded-xl border border-slate-200 transition-all cursor-pointer whitespace-nowrap tracking-wider flex items-center gap-2 uppercase active:scale-95"
        >
          <Edit className="w-3.5 h-3.5" /> Edit Profile
        </button>
      </div>

      {/* METRICS CARD ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        
        {/* Delivered Card */}
        <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-3xs text-center flex flex-col justify-center h-24">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Delivered</span>
          <span className="text-2xl font-black text-slate-900 mt-1 leading-none">{activeDriver.deliveredCount}</span>
        </div>

        {/* On-Time Card */}
        <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-3xs text-center flex flex-col justify-center h-24">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">On-Time</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 leading-none">{activeDriver.onTimeRate}</span>
        </div>

        {/* Rating Card */}
        <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-3xs text-center flex flex-col justify-center h-24">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Rating</span>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <span className="text-2xl font-black text-slate-900 leading-none">{activeDriver.rating}</span>
            <Star size={16} className="text-[#FFA000] fill-[#FFA000]" />
          </div>
        </div>

        {/* Delays Card */}
        <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-3xs text-center flex flex-col justify-center h-24">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Delays</span>
          <span className="text-2xl font-black text-rose-600 mt-1 leading-none">{activeDriver.delaysCount}</span>
        </div>

      </div>

      {/* CORE INFO AND SCHEDULE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Compliance & Operational assignments */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Contact details */}
          <div className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-sm space-y-3.5">
            <h3 className="text-[10px] font-black text-slate-450 uppercase tracking-widest border-b border-slate-50 pb-2 flex items-center gap-1.5">
              <User size={13} className="text-[#FFA000]" /> CONTACT DETAILS
            </h3>
            
            <div className="space-y-2.5 text-[11px] font-semibold text-slate-700">
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Full Name</span>
                <span className="text-slate-800 font-extrabold block mt-0.5">{activeDriver.contact.name}</span>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Phone</span>
                <span className="text-slate-800 font-extrabold block mt-0.5">{activeDriver.contact.phone}</span>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Email</span>
                <span className="text-slate-800 font-extrabold block mt-0.5">{activeDriver.contact.email}</span>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Address</span>
                <span className="text-slate-800 font-extrabold block mt-0.5">{activeDriver.contact.address}</span>
              </div>
            </div>
          </div>

          {/* Operational Assignment (Dark card matching Lucas screen) */}
          <div className="bg-[#141414] border border-slate-900 rounded-[24px] p-5 shadow-md text-white space-y-3.5">
            <h3 className="text-[10px] font-black text-[#FFA000] uppercase tracking-widest border-b border-white/5 pb-2 flex items-center gap-1.5">
              <Truck size={13} /> OPERATIONAL ASSIGNMENT
            </h3>

            <div className="space-y-3 text-[11px]">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400 font-bold">Assigned Depot</span>
                <span className="font-extrabold text-white">{activeDriver.assignment.depot}</span>
              </div>
              
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400 font-bold">Shift Type</span>
                <span className="font-extrabold text-white">{activeDriver.assignment.shift}</span>
              </div>

              {/* Asset pairing block */}
              <div className="flex justify-between items-center pt-1.5">
                <div>
                  <span className="text-slate-450 text-[9px] font-black block uppercase tracking-wider">Asset pairing</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono font-black text-[11px] text-white">
                      {activeDriver.assignment.truck} <span className="text-white/40 mx-0.5">•</span> {activeDriver.assignment.plate}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => triggerToast(`Viewing pairing details for vehicle ${activeDriver.assignment.truck}`)}
                  className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-[9px] font-black text-white cursor-pointer uppercase transition-colors"
                >
                  View
                </button>
              </div>
            </div>
          </div>

          {/* Legal & Compliance (License & Medical with light green border card) */}
          <div className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-sm space-y-4">
            <h3 className="text-[10px] font-black text-slate-450 uppercase tracking-widest border-b border-slate-50 pb-2 flex items-center gap-1.5">
              <Award size={13} className="text-[#FFA000]" /> LEGAL & COMPLIANCE
            </h3>

            {/* Drivers License Card (light green border) */}
            <div className="border border-emerald-250 bg-emerald-50/20 p-3.5 rounded-2xl flex justify-between items-center gap-4">
              <div className="text-left font-semibold">
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider block">Driver's License</span>
                <span className="text-xs font-black text-slate-800 block mt-1 leading-tight">{activeDriver.compliance.license.class}</span>
                <span className="text-[10px] text-slate-400 font-bold block mt-0.5 leading-tight">LIC: {activeDriver.compliance.license.number}</span>
              </div>

              <div className="text-right">
                <span className="text-[8px] font-black text-slate-400 block uppercase tracking-wider">Expires On</span>
                <span className="text-[10px] font-black text-slate-800 mt-0.5 block">{activeDriver.compliance.license.expires}</span>
              </div>
            </div>

            {/* Medical Certificate Card (light green border) */}
            <div className="border border-emerald-250 bg-emerald-50/20 p-3.5 rounded-2xl flex justify-between items-center gap-4">
              <div className="text-left font-semibold">
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider block">Medical Certificate</span>
                <span className="text-xs font-black text-slate-800 block mt-1 leading-tight">{activeDriver.compliance.medical.class}</span>
                <span className="text-[10px] text-slate-400 font-bold block mt-0.5 leading-tight">Dept. Terminal: {activeDriver.compliance.medical.doctor}</span>
              </div>

              <div className="text-right">
                <span className="text-[8px] font-black text-slate-400 block uppercase tracking-wider">Expires On</span>
                <span className="text-[10px] font-black text-slate-800 mt-0.5 block">{activeDriver.compliance.medical.expires}</span>
              </div>
            </div>

            {/* Certifications Checklist */}
            <div className="space-y-2.5 pt-2">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Special Certifications</span>
              
              {activeDriver.compliance.certs.map((c, idx) => (
                <div key={idx} className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[10px] font-extrabold text-slate-700">{c.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black border tracking-wider uppercase ${
                    c.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      : 'bg-rose-50 text-rose-600 border-rose-100'
                  }`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Permission settings */}
          <div className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-sm space-y-3.5">
            <h3 className="text-[10px] font-black text-slate-450 uppercase tracking-widest border-b border-slate-50 pb-2 flex items-center gap-1.5">
              <Sliders size={13} className="text-[#FFA000]" /> PERMISSION SETTINGS
            </h3>

            <div className="p-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl flex justify-between items-start gap-4">
              <div>
                <span className="text-[11px] font-black text-slate-800 block">Can Edit Loads</span>
                <p className="text-[10px] text-slate-400 font-bold mt-1 leading-normal">
                  {activeDriver.permission.desc}
                </p>
              </div>

              <span className="px-2 py-0.5 bg-violet-50 text-violet-600 border border-violet-100 rounded text-[9px] font-black tracking-wider uppercase shrink-0">
                {activeDriver.permission.loads}
              </span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Live Assignments & Job History */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Live Assignment Card */}
          <div className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-sm space-y-5">
            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
              <h3 className="text-[10px] font-black text-slate-450 uppercase tracking-widest flex items-center gap-1.5">
                <MapPin size={13} className="text-[#FFA000]" /> LIVE ASSIGNMENT
              </h3>
              
              <span className="px-2.5 py-0.5 bg-emerald-55 text-emerald-700 rounded text-[9px] font-black tracking-wider uppercase">
                Active
              </span>
            </div>

            {activeDriver.liveAssignment.active ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 text-[9px] font-black block uppercase tracking-wider">LOAD REFERENCE</span>
                    <span className="text-xs font-black text-slate-900 mt-1 block tracking-tight">
                      {activeDriver.liveAssignment.ref}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[9px] font-black block uppercase tracking-wider">CURRENT ETA</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock size={13} className="text-[#FFA000]" />
                      <span className="text-xs font-black text-slate-900 leading-none">
                        {activeDriver.liveAssignment.eta}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-3">
                  <div>
                    <span className="text-slate-400 text-[9px] font-black block uppercase tracking-wider">ROUTE DETAILS</span>
                    <span className="text-[11px] font-extrabold text-slate-700 mt-1 block">
                      {activeDriver.liveAssignment.route}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[9px] font-black block uppercase tracking-wider">PICKUP/TASK ASSIGNMENT</span>
                    <span className="text-[11px] font-extrabold text-slate-700 mt-1 block font-mono">
                      {activeDriver.liveAssignment.task}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="border-t border-slate-50 pt-4 space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
                    <span className="text-slate-400">Route Progress</span>
                    <span className="text-emerald-600">{activeDriver.liveAssignment.progress}% Complete</span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${activeDriver.liveAssignment.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs font-semibold">
                No active assignment. Driver is currently off-duty or resting.
              </div>
            )}
          </div>

          {/* Job History Card */}
          <div className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
              <h3 className="text-[10px] font-black text-slate-450 uppercase tracking-widest flex items-center gap-1.5">
                <FileSpreadsheet size={13} className="text-[#FFA000]" /> JOB HISTORY
              </h3>
              
              <button 
                onClick={() => triggerToast('Historical dispatch logs loaded')}
                className="text-[9px] font-black text-[#1D4ED8] hover:underline uppercase tracking-wider"
              >
                View All
              </button>
            </div>

            {/* History List */}
            <div className="space-y-3">
              {activeDriver.history.map((h, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-slate-50/50 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="text-left font-semibold">
                    <span className="text-[9px] font-black text-slate-400 block uppercase tracking-wider">Load ID</span>
                    <span className="text-xs font-black text-slate-900 block mt-0.5 leading-none">{h.ref}</span>
                    <span className="text-[10px] text-slate-500 font-bold block mt-1.5 leading-tight">{h.route}</span>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1.5">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded text-[8px] font-black uppercase tracking-wider">
                      {h.status}
                    </span>
                    <span className="text-[9px] font-extrabold text-slate-400 block mt-0.5">{h.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ===========================================
          EDIT DRIVER PROFILE MODAL (Interactive)
          =========================================== */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-100 text-left relative transform transition-all duration-300 scale-100">
            <div className="flex justify-between items-center pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#FFA000]" />
                <h3 className="text-sm font-black text-slate-900">Edit Profile: {activeDriver.name}</h3>
              </div>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-450 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={editForm.phone}
                    onChange={e => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={e => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Address</label>
                <input
                  type="text"
                  required
                  value={editForm.address}
                  onChange={e => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Shift Type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Shift Type</label>
                  <select
                    value={editForm.shift}
                    onChange={e => setEditForm(prev => ({ ...prev, shift: e.target.value }))}
                    className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white cursor-pointer"
                  >
                    <option value="Day Shift">Day Shift</option>
                    <option value="Night Shift">Night Shift</option>
                    <option value="Roster Rotation">Roster Rotation</option>
                  </select>
                </div>

                {/* Truck Code */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Assigned Truck</label>
                  <input
                    type="text"
                    required
                    value={editForm.truck}
                    onChange={e => setEditForm(prev => ({ ...prev, truck: e.target.value }))}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white"
                  />
                </div>
              </div>

              {/* Truck Plate */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Truck License Plate</label>
                <input
                  type="text"
                  required
                  value={editForm.plate}
                  onChange={e => setEditForm(prev => ({ ...prev, plate: e.target.value.toUpperCase() }))}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FFA000] hover:bg-[#E58F00] text-slate-955 rounded-xl text-xs font-black transition-colors cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
