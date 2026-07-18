import React, { useState } from 'react';
import { 
  User, Lock, Sliders, LifeBuoy, Camera, Mail, Building2, Save, 
  Key, Bell, AlertTriangle, MessageSquare, Table, FileText, Send, 
  CheckCircle, ShieldCheck
} from 'lucide-react';

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState('account');
  const [toastMessage, setToastMessage] = useState('');
  
  // My Account form state
  const [profile, setProfile] = useState({
    loginHandle: 'Sarah Mitchell',
    primaryEmail: 'sarah.m@herologistics.com'
  });

  // Security form state
  const [passwords, setPasswords] = useState({
    current: '••••••••',
    newPass: '',
    confirmPass: ''
  });

  // Preferences checkboxes state
  const [preferences, setPreferences] = useState({
    gpsSound: true,
    smsAlerts: true,
    desktopNotifications: true,
    compactLayout: true,
    dailySummary: false
  });

  // Help & Support form state
  const [supportTicket, setSupportTicket] = useState({
    subject: '',
    description: ''
  });

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    showToast('Profile changes saved successfully');
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!passwords.newPass || !passwords.confirmPass) {
      showToast('Please enter a new password');
      return;
    }
    if (passwords.newPass !== passwords.confirmPass) {
      showToast('New passwords do not match');
      return;
    }
    showToast('Password changed successfully');
    setPasswords({ current: '••••••••', newPass: '', confirmPass: '' });
  };

  const handlePreferenceToggle = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    showToast('Preferences updated');
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportTicket.subject || !supportTicket.description) {
      showToast('Please complete all support fields');
      return;
    }
    showToast('Support ticket submitted successfully!');
    setSupportTicket({ subject: '', description: '' });
  };

  const handleEnable2FA = () => {
    showToast('Two-Factor Authentication setup wizard initialized');
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

      {/* Header Block */}
      <div className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-xs mb-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-700 shadow-2xs shrink-0">
          <Sliders className="w-5 h-5 text-[#FFA000]" />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1.5">System Settings</h1>
          <p className="text-slate-400 text-xs font-semibold">Configure your operator profile and terminal preferences</p>
        </div>
      </div>

      {/* Main Grid: Left Tabs / Right Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side Navigation Panel */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-[24px] shadow-sm p-4 flex flex-row overflow-x-auto lg:flex-col gap-3 scrollbar-none flex-nowrap w-full">
          
          {/* Tab 1: My Account */}
          <button
            onClick={() => setActiveTab('account')}
            className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex-shrink-0 whitespace-nowrap ${
              activeTab === 'account'
                ? 'bg-white border-slate-200 shadow-md ring-1 ring-slate-100 border-b-[4px] border-b-[#FFA000] border-l-0 lg:border-l-[5px] lg:border-l-[#FFA000] lg:border-b-0'
                : 'bg-white border-slate-50 hover:bg-slate-55 hover:border-slate-200'
            }`}
          >
            <div className={`p-2.5 rounded-xl shrink-0 ${activeTab === 'account' ? 'bg-[#FFA000]/10 text-[#FFA000]' : 'bg-slate-50 text-slate-400'}`}>
              <User size={18} className="stroke-[2.5px]" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-slate-800">My Account</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">Personal details and Depot info</p>
            </div>
          </button>

          {/* Tab 2: Security */}
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex-shrink-0 whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-white border-slate-200 shadow-md ring-1 ring-slate-100 border-b-[4px] border-b-[#FFA000] border-l-0 lg:border-l-[5px] lg:border-l-[#FFA000] lg:border-b-0'
                : 'bg-white border-slate-50 hover:bg-slate-55 hover:border-slate-200'
            }`}
          >
            <div className={`p-2.5 rounded-xl shrink-0 ${activeTab === 'security' ? 'bg-[#FFA000]/10 text-[#FFA000]' : 'bg-slate-50 text-slate-400'}`}>
              <Lock size={18} className="stroke-[2.5px]" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-slate-800">Security</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">Passwords and 2FA</p>
            </div>
          </button>

          {/* Tab 3: Preferences */}
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex-shrink-0 whitespace-nowrap ${
              activeTab === 'preferences'
                ? 'bg-white border-slate-200 shadow-md ring-1 ring-slate-100 border-b-[4px] border-b-[#FFA000] border-l-0 lg:border-l-[5px] lg:border-l-[#FFA000] lg:border-b-0'
                : 'bg-white border-slate-50 hover:bg-slate-55 hover:border-slate-200'
            }`}
          >
            <div className={`p-2.5 rounded-xl shrink-0 ${activeTab === 'preferences' ? 'bg-[#FFA000]/10 text-[#FFA000]' : 'bg-slate-50 text-slate-400'}`}>
              <Sliders size={18} className="stroke-[2.5px]" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-slate-800">Preferences</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">Theme and terminal alerts</p>
            </div>
          </button>

          {/* Tab 4: Help & Support */}
          <button
            onClick={() => setActiveTab('support')}
            className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex-shrink-0 whitespace-nowrap ${
              activeTab === 'support'
                ? 'bg-white border-slate-200 shadow-md ring-1 ring-slate-100 border-b-[4px] border-b-[#FFA000] border-l-0 lg:border-l-[5px] lg:border-l-[#FFA000] lg:border-b-0'
                : 'bg-white border-slate-50 hover:bg-slate-55 hover:border-slate-200'
            }`}
          >
            <div className={`p-2.5 rounded-xl shrink-0 ${activeTab === 'support' ? 'bg-[#FFA000]/10 text-[#FFA000]' : 'bg-slate-50 text-slate-400'}`}>
              <LifeBuoy size={18} className="stroke-[2.5px]" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-slate-800">Help & Support</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">Contact Admin Support</p>
            </div>
          </button>

        </div>

        {/* Right Side Content Panel */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* ===================================================
              TAB: MY ACCOUNT
              =================================================== */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              
              {/* Operator Identity Card */}
              <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
                
                {/* Photo initials badge */}
                <div className="relative shrink-0">
                  <div className="w-20 h-20 bg-slate-900 rounded-[20px] flex items-center justify-center shadow-md border-2 border-slate-100">
                    <span className="text-xl font-black text-[#FFA000] tracking-wider select-none">SM</span>
                  </div>
                  <button 
                    onClick={() => showToast('Profile photo update simulation initialized')}
                    className="absolute -bottom-1.5 -right-1.5 bg-white hover:bg-slate-50 p-1.5 rounded-lg border border-slate-200 text-slate-500 shadow-xs cursor-pointer transition-colors"
                  >
                    <Camera size={12} className="stroke-[2.5px]" />
                  </button>
                </div>

                {/* Identity info */}
                <div className="text-center sm:text-left">
                  <h3 className="text-base font-black text-slate-900">{profile.loginHandle}</h3>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-2">
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 text-[9px] font-black rounded-md tracking-wider uppercase">
                      Dispatcher
                    </span>
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black rounded-md tracking-wider uppercase flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                      Live Status
                    </span>
                  </div>
                </div>

              </div>

              {/* Credentials & Access Form */}
              <form onSubmit={handleSaveProfile} className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm space-y-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">
                  Credential & Access
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Login Handle */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Login Handle</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-violet-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={profile.loginHandle}
                        onChange={e => setProfile(prev => ({ ...prev, loginHandle: e.target.value }))}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white transition-all shadow-3xs"
                      />
                    </div>
                  </div>

                  {/* Primary Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Primary Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-violet-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={profile.primaryEmail}
                        onChange={e => setProfile(prev => ({ ...prev, primaryEmail: e.target.value }))}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white transition-all shadow-3xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  {/* Assigned Operational Depot Card */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Assigned Operational Depot</label>
                    <div className="flex items-center gap-3.5 p-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <Building2 size={16} />
                      </div>
                      <div>
                        <span className="text-[11px] font-extrabold text-slate-800 block">Sydney Central Depot</span>
                        <span className="text-[9px] text-slate-400 font-bold block mt-0.5 uppercase tracking-wider">
                          SYD-CENTRAL • MAIN DEPOT
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Warning Info */}
                  <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 text-[10px] text-slate-500 font-bold leading-relaxed">
                    Branch location is locked to your dispatcher license. For inter-Depot duty, please submit a transfer request.
                  </div>
                </div>

                {/* Save Changes button */}
                <div className="flex justify-end pt-4 border-t border-slate-50">
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[10px] py-3 px-6 rounded-xl transition-all duration-150 shadow-sm cursor-pointer whitespace-nowrap tracking-wider flex items-center gap-2 transform active:scale-95"
                  >
                    <Save className="w-4 h-4 text-[#FFA000]" /> SAVE PROFILE CHANGES
                  </button>
                </div>
              </form>

            </div>
          )}

          {/* ===================================================
              TAB: SECURITY
              =================================================== */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              
              {/* Change Password Card */}
              <form onSubmit={handleSavePassword} className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm space-y-5">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">
                  Change Password
                </h4>

                {/* Current password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwords.current}
                    onChange={e => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white transition-all shadow-3xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* New password */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Min. 8 chars"
                      value={passwords.newPass}
                      onChange={e => setPasswords(prev => ({ ...prev, newPass: e.target.value }))}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white transition-all shadow-3xs"
                    />
                  </div>

                  {/* Confirm password */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Confirm Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Confirm"
                      value={passwords.confirmPass}
                      onChange={e => setPasswords(prev => ({ ...prev, confirmPass: e.target.value }))}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white transition-all shadow-3xs"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[10px] py-3.5 px-6 rounded-xl transition-all duration-150 shadow-sm cursor-pointer whitespace-nowrap tracking-wider flex items-center gap-2 transform active:scale-95"
                  >
                    <Lock className="w-4 h-4 text-[#FFA000]" /> SAVE NEW PASSWORD
                  </button>
                </div>
              </form>

              {/* Two-Factor Authentication Banner */}
              <div className="bg-[#1E293B] border border-slate-800 rounded-[24px] p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-900 shrink-0">
                    <Key className="w-5 h-5 text-[#FFA000]" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-black tracking-tight">Two-Factor Authentication</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">Add an extra layer of security to your account.</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleEnable2FA}
                    className="bg-[#FFA000] hover:bg-[#E58F00] text-slate-955 font-black text-[10px] py-2.5 px-5 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                  >
                    ENABLE 2FA
                  </button>
                  <button
                    onClick={() => showToast('Documentation is loading...')}
                    className="bg-transparent hover:bg-white/5 border border-white/20 text-white font-black text-[10px] py-2.5 px-5 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                  >
                    LEARN MORE
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ===================================================
              TAB: PREFERENCES
              =================================================== */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              
              {/* Notification Preferences Container */}
              <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">
                  Notifications
                </h4>

                <div className="space-y-3">
                  {/* Preference Item 1 */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-50/30 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center shrink-0 border border-amber-100">
                        <Bell size={14} className="stroke-[2.5px]" />
                      </div>
                      <span className="text-[11px] font-extrabold text-slate-800">GPS location sound alerts</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.gpsSound}
                      onChange={() => handlePreferenceToggle('gpsSound')}
                      className="w-4 h-4 rounded text-[#FFA000] border-slate-300 focus:ring-[#FFA000] accent-[#FFA000] cursor-pointer"
                    />
                  </div>

                  {/* Preference Item 2 */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-50/30 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0 border border-amber-100">
                        <AlertTriangle size={14} className="stroke-[2.5px]" />
                      </div>
                      <span className="text-[11px] font-extrabold text-slate-800">Delay & issue SMS alerts</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.smsAlerts}
                      onChange={() => handlePreferenceToggle('smsAlerts')}
                      className="w-4 h-4 rounded text-[#FFA000] border-slate-300 focus:ring-[#FFA000] accent-[#FFA000] cursor-pointer"
                    />
                  </div>

                  {/* Preference Item 3 */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-50/30 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center shrink-0 border border-slate-150">
                        <MessageSquare size={14} className="stroke-[2.5px]" />
                      </div>
                      <span className="text-[11px] font-extrabold text-slate-800">New message desktop notifications</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.desktopNotifications}
                      onChange={() => handlePreferenceToggle('desktopNotifications')}
                      className="w-4 h-4 rounded text-[#FFA000] border-slate-300 focus:ring-[#FFA000] accent-[#FFA000] cursor-pointer"
                    />
                  </div>

                  {/* Preference Item 4 */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-50/30 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center shrink-0 border border-slate-150">
                        <Table size={14} className="stroke-[2.5px]" />
                      </div>
                      <span className="text-[11px] font-extrabold text-slate-800">Compact table layout</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.compactLayout}
                      onChange={() => handlePreferenceToggle('compactLayout')}
                      className="w-4 h-4 rounded text-[#FFA000] border-slate-300 focus:ring-[#FFA000] accent-[#FFA000] cursor-pointer"
                    />
                  </div>

                  {/* Preference Item 5 */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-50/30 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center shrink-0 border border-slate-150">
                        <FileText size={14} className="stroke-[2.5px]" />
                      </div>
                      <span className="text-[11px] font-extrabold text-slate-800">Daily summary PDF to email</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.dailySummary}
                      onChange={() => handlePreferenceToggle('dailySummary')}
                      className="w-4 h-4 rounded text-[#FFA000] border-slate-300 focus:ring-[#FFA000] accent-[#FFA000] cursor-pointer"
                    />
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ===================================================
              TAB: HELP & SUPPORT
              =================================================== */}
          {activeTab === 'support' && (
            <div className="space-y-6">
              
              {/* Contact Admin Header Card */}
              <div className="bg-[#111827] border border-slate-800 rounded-[24px] p-6 shadow-sm flex items-center gap-4 text-white">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-slate-200 shrink-0">
                  <LifeBuoy className="w-5 h-5 text-[#FFA000] animate-pulse" />
                </div>
                <div className="text-left">
                  <h3 className="text-xs font-black tracking-tight">Contact Super Admin</h3>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mt-0.5">
                    INTERNAL TEAM SUPPORT TICKET
                  </span>
                </div>
              </div>

              {/* Submit Ticket Form */}
              <form onSubmit={handleSupportSubmit} className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm space-y-4">
                
                {/* Subject */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rate Config Error, New Branch Req..."
                    value={supportTicket.subject}
                    onChange={e => setSupportTicket(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white transition-all shadow-3xs"
                  />
                </div>

                {/* Describe issue */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Describe Issue</label>
                  <textarea
                    required
                    placeholder="Provide detailed operational issue..."
                    value={supportTicket.description}
                    onChange={e => setSupportTicket(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#FFA000] focus:border-[#FFA000] focus:bg-white transition-all shadow-3xs h-24 resize-none"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-[#FFA000] hover:bg-[#E58F00] text-slate-955 font-extrabold text-[10px] py-3 px-6 rounded-xl transition-all duration-150 shadow-sm cursor-pointer whitespace-nowrap tracking-wider flex items-center gap-2 transform active:scale-95"
                  >
                    <Send size={11} className="stroke-[2.5px]" /> SUBMIT TICKET
                  </button>
                </div>
              </form>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
