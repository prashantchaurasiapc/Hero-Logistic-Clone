import React, { useState } from 'react';
import { 
  User, Phone, Mail, MapPin, Settings, Globe, Clock, Calendar as CalendarIcon,
  Shield, Check, Monitor, Smartphone, Tablet, Link2, ChevronRight, 
  Lock, Edit3, Grid, CalendarDays, Truck, Map, MessageSquare, History, Bell
} from 'lucide-react';

export default function Profile() {
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Editable Profile State Variables
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [fullName, setFullName] = useState('John Smith');
  const [mobileNumber, setMobileNumber] = useState('+61 412 345 678');
  const [emailAddress, setEmailAddress] = useState('john.smith@herols.com.au');
  const [dob, setDob] = useState('15 Mar 1988');
  const [address, setAddress] = useState('12 George Street, Sydney NSW 2000, Australia');
  const [emergencyContact, setEmergencyContact] = useState('Emma Smith (Wife) +61 433 222 111');

  // Temporary Edit Form State Variables
  const [tempFullName, setTempFullName] = useState('');
  const [tempMobile, setTempMobile] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [tempDob, setTempDob] = useState('');
  const [tempAddress, setTempAddress] = useState('');
  const [tempEmergency, setTempEmergency] = useState('');

  const openEditModal = () => {
    setTempFullName(fullName);
    setTempMobile(mobileNumber);
    setTempEmail(emailAddress);
    setTempDob(dob);
    setTempAddress(address);
    setTempEmergency(emergencyContact);
    setEditModalOpen(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setFullName(tempFullName);
    setMobileNumber(tempMobile);
    setEmailAddress(tempEmail);
    setDob(tempDob);
    setAddress(tempAddress);
    setEmergencyContact(tempEmergency);
    setEditModalOpen(false);
    showToast('✓ Profile updated successfully!');
  };

  return (
    <div className="flex-grow bg-[#F8FAFC] min-h-screen p-6 w-full text-left font-sans custom-scrollbar overflow-y-auto relative">
      <style>{`
        .wh-user-detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #F1F5F9;
          font-size: 11px;
        }
        .wh-user-detail-row:last-child {
          border-bottom: none;
        }
        .wh-ud-lbl { color: #64748B; font-weight: 600; flex-shrink: 0; width: 100px; }
        .wh-ud-val { color: #0F172A; font-weight: 700; text-align: right; word-break: break-word; flex: 1; }

        /* MODAL STYLING */
        .wh-modal-overlay {
          position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(4px); z-index: 99999; display: flex;
          align-items: center; justify-content: center; padding: 16px;
        }
        .wh-modal-box {
          background: #FFFFFF; border-radius: 12px; max-width: 500px;
          width: 100%; border: 1px solid #E2E8F0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
          overflow: hidden; display: flex; flex-direction: column;
        }
        .wh-modal-title { font-size: 14px; font-weight: 800; color: #0F172A; text-transform: uppercase; }
        .wh-light-form-lbl { font-size: 10px; font-weight: 700; color: #64748B; margin-bottom: 4px; display: block; }
        .wh-light-form-input {
          width: 100%; height: 34px; padding: 0 10px; background: #F8FAFC;
          border: 1px solid #CBD5E1; border-radius: 6px; color: #0F172A;
          font-size: 11.5px; outline: none; box-sizing: border-box;
        }
      `}</style>

      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dispatcher Profile</h1>
          <div className="flex items-center text-[11px] text-slate-500 mt-1 gap-1.5 font-medium">
            <span>Home</span>
            <ChevronRight size={10} />
            <span className="text-slate-800">Profile</span>
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 shadow-sm shadow-blue-200" onClick={openEditModal}>
          <Edit3 size={14} /> Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Profile Card */}
          <div className="bg-white rounded-[20px] border border-slate-200 p-6 shadow-sm flex flex-col items-center">
            <div className="relative mb-4">
              <img 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256&h=256" 
                alt={fullName} 
                className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md"
              />
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            
            <h2 className="text-xl font-bold text-slate-900">{fullName}</h2>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1.5">Online</span>
            
            <div className="text-center mt-4">
              <p className="text-[13px] font-semibold text-slate-800">Senior Dispatcher</p>
              <p className="text-[10px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md mt-1.5 border border-slate-100">Employee ID: DSP-0007</p>
            </div>

            <div className="w-full mt-6 space-y-3 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3 text-[11px] text-slate-600">
                <Phone size={14} className="text-slate-400" />
                <span className="font-medium">{mobileNumber}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-600">
                <Mail size={14} className="text-slate-400" />
                <span className="font-medium">{emailAddress}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-600">
                <MapPin size={14} className="text-slate-400" />
                <span className="font-medium">{address.split(',')[1] || address}</span>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-white rounded-[20px] border border-slate-200 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-slate-900">
                Working Hours
              </h3>
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">In Office</span>
            </div>
            <div className="space-y-3 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Start Time</span>
                <span className="font-semibold text-slate-800">07:00 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Finish Time</span>
                <span className="font-semibold text-slate-800">03:30 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Break Duration</span>
                <span className="font-semibold text-slate-800">30 mins</span>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-[20px] border border-slate-200 p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Settings size={14} className="text-slate-400" /> Preferences
            </h3>
            <div className="space-y-4 text-[11px]">
              <div className="flex justify-between items-center cursor-pointer group" onClick={() => showToast('Opening Notification Settings...')}>
                <div className="flex items-center gap-2 text-slate-600 group-hover:text-slate-900">
                  <Bell size={13} className="text-slate-400" />
                  <span className="font-medium">Notifications</span>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600" />
              </div>
              <div className="flex justify-between items-center cursor-pointer group">
                <div className="flex items-center gap-2 text-slate-600 group-hover:text-slate-900">
                  <Globe size={13} className="text-slate-400" />
                  <span className="font-medium">Language</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-800">English</span>
                  <ChevronRight size={14} className="text-slate-400" />
                </div>
              </div>
              <div className="flex justify-between items-center cursor-pointer group">
                <div className="flex items-center gap-2 text-slate-600 group-hover:text-slate-900">
                  <Clock size={13} className="text-slate-400" />
                  <span className="font-medium">Time Zone</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-800">AEST/Sydney</span>
                  <ChevronRight size={14} className="text-slate-400" />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* MIDDLE COLUMN */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Personal Information */}
          <div className="bg-white rounded-[20px] border border-slate-200 p-6 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-900 flex items-center gap-2 mb-5">
              <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><User size={16} /></div>
              Personal Information
            </h3>
            
            <div className="grid grid-cols-2 gap-y-5 gap-x-4 text-[11px]">
              <div>
                <p className="text-slate-500 font-medium mb-1">Full Name</p>
                <p className="font-semibold text-slate-900">{fullName}</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium mb-1">Mobile Number</p>
                <p className="font-semibold text-slate-900">{mobileNumber}</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium mb-1">Date of Birth</p>
                <p className="font-semibold text-slate-900">{dob}</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium mb-1">Email Address</p>
                <p className="font-semibold text-slate-900">{emailAddress}</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium mb-1">Address</p>
                <p className="font-semibold text-slate-900">{address}</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium mb-1">Emergency Contact</p>
                <p className="font-semibold text-slate-900">{emergencyContact}</p>
              </div>
            </div>
          </div>

          {/* Role & Permissions */}
          <div className="bg-white rounded-[20px] border border-slate-200 p-6 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-900 flex items-center gap-2 mb-5">
              <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><Shield size={16} /></div>
              Role & Permissions
            </h3>
            
            <div className="grid grid-cols-3 gap-4 text-[11px] mb-5">
              <div>
                <p className="text-slate-500 font-medium mb-1">Role</p>
                <p className="font-semibold text-slate-900">Dispatcher</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium mb-1">Access Level</p>
                <p className="font-semibold text-slate-900">Branch Level</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium mb-1">Branch</p>
                <p className="font-semibold text-slate-900">Sydney Branch</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-slate-500 font-medium text-[11px] mb-2.5">Permissions Granted</p>
              <div className="flex flex-wrap gap-2">
                {['Create Load', 'Assign Loads', 'View All Loads', 'Driver Management', 'Vehicle / Trailer Management', 'Yard / Warehouse', 'Reports', 'Messages'].map((perm, i) => (
                  <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-md text-[10px] font-semibold">
                    {perm}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-[20px] border border-slate-200 p-6 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-900 flex items-center gap-2 mb-5">
              <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><History size={16} /></div>
              Recent Activity
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[10px]">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-100 font-medium">
                    <th className="pb-2 font-medium">Activity</th>
                    <th className="pb-2 font-medium">Description</th>
                    <th className="pb-2 font-medium">IP Address</th>
                    <th className="pb-2 font-medium">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="text-slate-800">
                  <tr className="border-b border-slate-50">
                    <td className="py-2.5 font-medium">Login</td>
                    <td className="py-2.5">Logged in to Dispatch Portal</td>
                    <td className="py-2.5 text-slate-500">203.26.45.12</td>
                    <td className="py-2.5 text-slate-500">22 May 2026, 08:32 AM</td>
                  </tr>
                  <tr className="border-b border-slate-50">
                    <td className="py-2.5 font-medium">Create Load</td>
                    <td className="py-2.5">Created Load LD-10563</td>
                    <td className="py-2.5 text-slate-500">203.26.45.12</td>
                    <td className="py-2.5 text-slate-500">22 May 2026, 08:15 AM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Account & Security */}
          <div className="bg-white rounded-[20px] border border-slate-200 p-6 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-900 flex items-center gap-2 mb-5">
              <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><Lock size={16} /></div>
              Account & Security
            </h3>
            
            <div className="space-y-4 text-[11px]">
              <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Username</span>
                <span className="font-semibold text-slate-900">john.smith</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Password</span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-[14px]">••••••••</span>
                  <button className="text-blue-600 font-semibold hover:underline" onClick={() => showToast('Opening Security Panel...')}>Change</button>
                </div>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                <span className="text-slate-500 font-medium">2FA</span>
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-bold text-[9px]">Enabled</span>
              </div>
            </div>
          </div>

          {/* Devices */}
          <div className="bg-white rounded-[20px] border border-slate-200 p-6 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-900 flex items-center gap-2 mb-5">
              <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><Monitor size={16} /></div>
              Devices
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <Monitor size={18} className="text-slate-400" />
                  <div>
                    <p className="text-[11px] font-bold text-slate-900 flex items-center gap-2">
                      Windows • Chrome <span className="text-[9px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">Active</span>
                    </p>
                    <p className="text-[10px] text-slate-500">Sydney, Australia</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between group cursor-pointer pt-3 border-t border-slate-50">
                <div className="flex items-center gap-3">
                  <Smartphone size={18} className="text-slate-400" />
                  <div>
                    <p className="text-[11px] font-bold text-slate-900">iPhone 14 • iOS</p>
                    <p className="text-[10px] text-slate-500">Sydney, Australia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shortcuts */}
          <div className="bg-white rounded-[20px] border border-slate-200 p-6 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-900 flex items-center gap-2 mb-5">
              <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><Link2 size={16} /></div>
              Shortcuts
            </h3>
            
            <div className="space-y-2">
              {[
                { icon: Grid, label: 'Dispatch Dashboard' },
                { icon: CalendarDays, label: 'Planning Board' },
                { icon: Truck, label: 'Active Loads' },
                { icon: Map, label: 'Live GPS Map' },
                { icon: MessageSquare, label: 'Messages' }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg cursor-pointer group transition-colors">
                  <div className="flex items-center gap-3 text-slate-600 group-hover:text-blue-600">
                    <item.icon size={14} />
                    <span className="text-[11px] font-semibold">{item.label}</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {editModalOpen && (
        <div className="wh-modal-overlay" onClick={() => setEditModalOpen(false)}>
          <div className="wh-modal-box" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <span className="wh-modal-title">Edit Dispatcher Profile</span>
              <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            
            <form onSubmit={handleSaveProfile} className="p-5 space-y-4">
              <div>
                <label className="wh-light-form-lbl">Full Name</label>
                <input
                  type="text"
                  required
                  value={tempFullName}
                  onChange={e => setTempFullName(e.target.value)}
                  className="wh-light-form-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="wh-light-form-lbl">Mobile Number</label>
                  <input
                    type="text"
                    required
                    value={tempMobile}
                    onChange={e => setTempMobile(e.target.value)}
                    className="wh-light-form-input"
                  />
                </div>
                <div>
                  <label className="wh-light-form-lbl">Date of Birth</label>
                  <input
                    type="text"
                    required
                    value={tempDob}
                    onChange={e => setTempDob(e.target.value)}
                    className="wh-light-form-input"
                  />
                </div>
              </div>

              <div>
                <label className="wh-light-form-lbl">Email Address</label>
                <input
                  type="email"
                  required
                  value={tempEmail}
                  onChange={e => setTempEmail(e.target.value)}
                  className="wh-light-form-input"
                />
              </div>

              <div>
                <label className="wh-light-form-lbl">Address</label>
                <input
                  type="text"
                  required
                  value={tempAddress}
                  onChange={e => setTempAddress(e.target.value)}
                  className="wh-light-form-input"
                />
              </div>

              <div>
                <label className="wh-light-form-lbl">Emergency Contact</label>
                <input
                  type="text"
                  required
                  value={tempEmergency}
                  onChange={e => setTempEmergency(e.target.value)}
                  className="wh-light-form-input"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-1.5 border border-slate-300 rounded text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 rounded text-xs font-bold text-white hover:bg-blue-700 shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24,
          background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 8,
          padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10,
          zIndex: 99998, boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          fontSize: 12, fontWeight: 800, color: '#065F46'
        }}>
          <Check size={16} className="text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
