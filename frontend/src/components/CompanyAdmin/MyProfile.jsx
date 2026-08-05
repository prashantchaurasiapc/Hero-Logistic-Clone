import React, { useState } from 'react';
import { 
  User, Phone, Mail, MapPin, Settings, Globe, Clock, Calendar as CalendarIcon,
  Shield, Check, Monitor, Smartphone, Tablet, Link2, ChevronRight, 
  Lock, Edit3, Grid, CalendarDays, Truck, Map, MessageSquare, History, Bell, Building
} from 'lucide-react';

export default function MyProfile() {
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Editable Profile State Variables
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [fullName, setFullName] = useState('Alex Morgan');
  const [mobileNumber, setMobileNumber] = useState('+61 488 999 000');
  const [emailAddress, setEmailAddress] = useState('alex.morgan@herologistics.com.au');
  const [dob, setDob] = useState('12 Aug 1985');
  const [address, setAddress] = useState('100 Barangaroo Avenue, Sydney NSW 2000, Australia');
  const [emergencyContact, setEmergencyContact] = useState('Sarah Morgan (Spouse) +61 411 333 444');
  const [companyName, setCompanyName] = useState('Hero Logistics Solutions Pty Ltd');
  const [abn, setAbn] = useState('98 123 456 789');

  // Temporary Edit Form State Variables
  const [tempFullName, setTempFullName] = useState('');
  const [tempMobile, setTempMobile] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [tempDob, setTempDob] = useState('');
  const [tempAddress, setTempAddress] = useState('');
  const [tempEmergency, setTempEmergency] = useState('');
  const [tempCompany, setTempCompany] = useState('');
  const [tempAbn, setTempAbn] = useState('');

  const openEditModal = () => {
    setTempFullName(fullName);
    setTempMobile(mobileNumber);
    setTempEmail(emailAddress);
    setTempDob(dob);
    setTempAddress(address);
    setTempEmergency(emergencyContact);
    setTempCompany(companyName);
    setTempAbn(abn);
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
    setCompanyName(tempCompany);
    setAbn(tempAbn);
    setEditModalOpen(false);
    showToast('✓ Admin Profile updated successfully!');
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
          background: #FFFFFF; border-radius: 12px; max-width: 520px;
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
          <h1 className="text-2xl font-bold text-slate-900">Company Admin Profile</h1>
          <div className="flex items-center text-[11px] text-slate-500 mt-1 gap-1.5 font-medium">
            <span>Company Admin</span>
            <ChevronRight size={10} />
            <span className="text-slate-800">My Profile</span>
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-slate-900 rounded-lg text-xs font-bold hover:bg-amber-400 shadow-sm" onClick={openEditModal}>
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
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256" 
                alt={fullName} 
                className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md"
              />
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            
            <h2 className="text-xl font-bold text-slate-900">{fullName}</h2>
            <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-0.5 rounded-full mt-1.5 border border-amber-200">Company Owner / Admin</span>
            
            <div className="text-center mt-4">
              <p className="text-[13px] font-semibold text-slate-800">{companyName}</p>
              <p className="text-[10px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md mt-1.5 border border-slate-100 font-mono">ABN: {abn}</p>
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

          {/* Company Summary */}
          <div className="bg-white rounded-[20px] border border-slate-200 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Building size={14} className="text-amber-500" /> Company Details
              </h3>
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Verified</span>
            </div>
            <div className="space-y-3 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Plan</span>
                <span className="font-extrabold text-amber-600">Enterprise Logistics</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Active Fleet</span>
                <span className="font-semibold text-slate-800">42 Vehicles</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Active Drivers</span>
                <span className="font-semibold text-slate-800">38 Drivers</span>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-[20px] border border-slate-200 p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Settings size={14} className="text-slate-400" /> System Preferences
            </h3>
            <div className="space-y-4 text-[11px]">
              <div className="flex justify-between items-center cursor-pointer group" onClick={() => showToast('Opening Notifications Settings...')}>
                <div className="flex items-center gap-2 text-slate-600 group-hover:text-slate-900">
                  <Bell size={13} className="text-slate-400" />
                  <span className="font-medium">Admin Alerts</span>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600" />
              </div>
              <div className="flex justify-between items-center cursor-pointer group">
                <div className="flex items-center gap-2 text-slate-600 group-hover:text-slate-900">
                  <Globe size={13} className="text-slate-400" />
                  <span className="font-medium">Language</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-800">English (AU)</span>
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
              <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600"><User size={16} /></div>
              Administrator Personal Details
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
              <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600"><Shield size={16} /></div>
              Administrator Access & Authority
            </h3>
            
            <div className="grid grid-cols-3 gap-4 text-[11px] mb-5">
              <div>
                <p className="text-slate-500 font-medium mb-1">Role</p>
                <p className="font-bold text-slate-900">Company Admin</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium mb-1">Access Level</p>
                <p className="font-bold text-emerald-600">Full System</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium mb-1">Headquarters</p>
                <p className="font-bold text-slate-900">Sydney HQ</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-slate-500 font-medium text-[11px] mb-2.5">Global Admin Authorities</p>
              <div className="flex flex-wrap gap-2">
                {['User Management', 'Billing & Payroll', 'Fleet & Depot Access', 'Compliance & Audits', 'Branch Management', 'API & Integrations', 'System Analytics'].map((perm, i) => (
                  <span key={i} className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-[10px] font-bold">
                    ✓ {perm}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Audit Log */}
          <div className="bg-white rounded-[20px] border border-slate-200 p-6 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-900 flex items-center gap-2 mb-5">
              <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600"><History size={16} /></div>
              Recent System Audit Log
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[10px]">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-100 font-medium">
                    <th className="pb-2 font-medium">Action</th>
                    <th className="pb-2 font-medium">Description</th>
                    <th className="pb-2 font-medium">IP Address</th>
                    <th className="pb-2 font-medium">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="text-slate-800">
                  <tr className="border-b border-slate-50">
                    <td className="py-2.5 font-bold text-emerald-700">Admin Login</td>
                    <td className="py-2.5">Logged in to Company Admin Portal</td>
                    <td className="py-2.5 text-slate-500 font-mono">203.26.45.12</td>
                    <td className="py-2.5 text-slate-500">31 Jul 2026, 05:45 PM</td>
                  </tr>
                  <tr className="border-b border-slate-50">
                    <td className="py-2.5 font-bold text-amber-700">Settings Update</td>
                    <td className="py-2.5">Updated Depot Rate Card</td>
                    <td className="py-2.5 text-slate-500 font-mono">203.26.45.12</td>
                    <td className="py-2.5 text-slate-500">31 Jul 2026, 02:15 PM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Security */}
          <div className="bg-white rounded-[20px] border border-slate-200 p-6 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-900 flex items-center gap-2 mb-5">
              <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600"><Lock size={16} /></div>
              Account Security
            </h3>
            
            <div className="space-y-4 text-[11px]">
              <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Username</span>
                <span className="font-bold text-slate-900">alex.morgan.admin</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Password</span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-[14px]">••••••••</span>
                  <button className="text-amber-600 font-bold hover:underline" onClick={() => showToast('Opening Security Settings...')}>Change</button>
                </div>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                <span className="text-slate-500 font-medium">2-Factor Auth</span>
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-extrabold text-[9px]">Active</span>
              </div>
            </div>
          </div>

          {/* Active Devices */}
          <div className="bg-white rounded-[20px] border border-slate-200 p-6 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-900 flex items-center gap-2 mb-5">
              <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600"><Monitor size={16} /></div>
              Active Sessions
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <Monitor size={18} className="text-slate-400" />
                  <div>
                    <p className="text-[11px] font-bold text-slate-900 flex items-center gap-2">
                      Windows PC • Chrome <span className="text-[9px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded font-bold">Active Now</span>
                    </p>
                    <p className="text-[10px] text-slate-500">Sydney, Australia</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between group cursor-pointer pt-3 border-t border-slate-50">
                <div className="flex items-center gap-3">
                  <Smartphone size={18} className="text-slate-400" />
                  <div>
                    <p className="text-[11px] font-bold text-slate-900">MacBook Pro • Safari</p>
                    <p className="text-[10px] text-slate-500">Sydney, Australia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Admin Actions */}
          <div className="bg-white rounded-[20px] border border-slate-200 p-6 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-900 flex items-center gap-2 mb-5">
              <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600"><Link2 size={16} /></div>
              Quick Management Shortcuts
            </h3>
            
            <div className="space-y-2">
              {[
                { icon: Building, label: 'Company Settings' },
                { icon: Shield, label: 'Driver Compliance' },
                { icon: Truck, label: 'Fleet Overview' },
                { icon: MessageSquare, label: 'Support & Tickets' }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg cursor-pointer group transition-colors">
                  <div className="flex items-center gap-3 text-slate-600 group-hover:text-amber-600">
                    <item.icon size={14} />
                    <span className="text-[11px] font-bold">{item.label}</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-400 group-hover:text-amber-600" />
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
              <span className="wh-modal-title">Edit Company Admin Profile</span>
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
                  <label className="wh-light-form-lbl">Company Name</label>
                  <input
                    type="text"
                    required
                    value={tempCompany}
                    onChange={e => setTempCompany(e.target.value)}
                    className="wh-light-form-input"
                  />
                </div>
                <div>
                  <label className="wh-light-form-lbl">ABN</label>
                  <input
                    type="text"
                    required
                    value={tempAbn}
                    onChange={e => setTempAbn(e.target.value)}
                    className="wh-light-form-input font-mono"
                  />
                </div>
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
                  className="px-4 py-1.5 bg-amber-500 rounded text-xs font-extrabold text-slate-900 hover:bg-amber-400 shadow-sm"
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
          padding: '12px 18px', display: 'flex', items: 'center', gap: 10,
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
