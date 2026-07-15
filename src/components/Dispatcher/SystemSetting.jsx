import React, { useState } from 'react';
import { User, Lock, Sliders, LifeBuoy, Mail, Building, Save, ShieldAlert, Key, Bell, HelpCircle, Eye, EyeOff } from 'lucide-react';

export default function SystemSetting() {
  const [activeMenuTab, setActiveMenuTab] = useState('account'); // 'account', 'security', 'preferences', 'help'
  const [toastMsg, setToastMsg] = useState('');
  
  // Account settings state
  const [profileData, setProfileData] = useState({
    name: 'Sarah Mitchell',
    email: 'sarah.m@herologistics.com',
    role: 'DISPATCHER',
    status: 'LIVE STATUS',
    depot: 'Sydney Central Depot',
    depotCode: 'SYD-CENTRAL • MAIN DEPOT'
  });

  // Form edit states
  const [editName, setEditName] = useState(profileData.name);
  const [editEmail, setEditEmail] = useState(profileData.email);

  // Security password states
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: ''
  });
  const [showPass, setShowPass] = useState(false);

  // Preferences toggles state
  const [preferences, setPreferences] = useState({
    soundAlerts: true,
    autoRefresh: true,
    darkMode: false,
    desktopNotifications: true
  });

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleSaveAccount = (e) => {
    e.preventDefault();
    setProfileData(prev => ({
      ...prev,
      name: editName,
      email: editEmail
    }));
    triggerToast('Profile account details updated successfully.');
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      triggerToast('Please fill out all password fields.');
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      triggerToast('New passwords do not match!');
      return;
    }
    triggerToast('Password credentials updated successfully.');
    setPasswords({ current: '', newPass: '', confirm: '' });
  };

  const handleSavePreferences = () => {
    triggerToast('System preferences saved.');
  };

  const getInitials = (fullName) => {
    return fullName.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto bg-white min-h-screen text-left flex flex-col space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xl animate-fade-in">{toastMsg}</div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        <div className="flex items-center gap-3.5 text-left">
          <div className="w-12 h-12 rounded-xl bg-gray-55 border border-gray-150 flex items-center justify-center text-gray-700 shadow-3xs shrink-0">
            <span className="text-xl">⚙️</span>
          </div>
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">DISPATCHER</span>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-none mb-1">System Settings</h1>
            <p className="text-gray-555 text-xs font-semibold">Configure your operator profile and terminal preferences</p>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Settings Sidebar Navigation Tabs */}
        <div className="lg:col-span-4 flex flex-col space-y-3">
          {/* Account Tab */}
          <button
            onClick={() => setActiveMenuTab('account')}
            className={`w-full p-4 rounded-2xl flex items-center gap-3.5 text-left transition-all ${
              activeMenuTab === 'account' 
                ? 'border-2 border-blue-500 bg-blue-50/10 shadow-xs' 
                : 'border border-gray-150 hover:bg-gray-50 bg-white shadow-3xs'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-[#D97706] shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-gray-955 block">My Account</span>
              <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">Personal details and Depot info</span>
            </div>
          </button>

          {/* Security Tab */}
          <button
            onClick={() => setActiveMenuTab('security')}
            className={`w-full p-4 rounded-2xl flex items-center gap-3.5 text-left transition-all ${
              activeMenuTab === 'security' 
                ? 'border-2 border-blue-500 bg-blue-50/10 shadow-xs' 
                : 'border border-gray-150 hover:bg-gray-50 bg-white shadow-3xs'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-[#D97706] shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-gray-955 block">Security</span>
              <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">Passwords and 2FA</span>
            </div>
          </button>

          {/* Preferences Tab */}
          <button
            onClick={() => setActiveMenuTab('preferences')}
            className={`w-full p-4 rounded-2xl flex items-center gap-3.5 text-left transition-all ${
              activeMenuTab === 'preferences' 
                ? 'border-2 border-blue-500 bg-blue-50/10 shadow-xs' 
                : 'border border-gray-150 hover:bg-gray-50 bg-white shadow-3xs'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-550 shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-gray-955 block">Preferences</span>
              <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">Theme and terminal alerts</span>
            </div>
          </button>

          {/* Help Tab */}
          <button
            onClick={() => setActiveMenuTab('help')}
            className={`w-full p-4 rounded-2xl flex items-center gap-3.5 text-left transition-all ${
              activeMenuTab === 'help' 
                ? 'border-2 border-blue-500 bg-blue-50/10 shadow-xs' 
                : 'border border-gray-150 hover:bg-gray-50 bg-white shadow-3xs'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500 shrink-0">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-gray-955 block">Help & Support</span>
              <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">Contact Admin Support</span>
            </div>
          </button>
        </div>

        {/* Right Column: Active Setting Panel */}
        <div className="lg:col-span-8 space-y-6">

          {/* ACCOUNT TAB VIEW */}
          {activeMenuTab === 'account' && (
            <>
              {/* Operator Identity Panel */}
              <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-3xs text-left">
                <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider mb-4">OPERATOR IDENTITY</span>
                <div className="flex items-center gap-4.5">
                  {/* Identity Avatar scope matching UI */}
                  <div className="relative shrink-0 select-none">
                    <div className="w-20 h-20 rounded-3xl bg-black text-[#FFD400] font-black text-xl flex items-center justify-center shadow-md">
                      {getInitials(profileData.name)}
                    </div>
                    <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-white rounded-full border border-gray-150 shadow-sm flex items-center justify-center text-xs">
                      🪪
                    </div>
                  </div>
                  <div className="text-left space-y-2">
                    <h3 className="text-lg font-bold text-gray-955 leading-none">{profileData.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="bg-gray-100 text-gray-500 text-[8px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">{profileData.role}</span>
                      <span className="bg-emerald-50 text-emerald-700 text-[8px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">{profileData.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Credential Details Panel */}
              <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-3xs text-left">
                <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider mb-5">CREDENTIAL & ACCESS</span>
                <form onSubmit={handleSaveAccount} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">LOGIN HANDLE</label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-650 shrink-0" />
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-250 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">PRIMARY EMAIL</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-650 shrink-0" />
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-250 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">ASSIGNED OPERATIONAL DEPOT</label>
                      <div className="p-3.5 border border-gray-150 rounded-xl bg-white flex items-center gap-3.5">
                        <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-550 shrink-0">
                          <Building className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-bold text-gray-955 block">{profileData.depot}</span>
                          <span className="text-[9px] text-gray-400 font-bold block mt-0.5 tracking-wider uppercase">{profileData.depotCode}</span>
                        </div>
                      </div>
                    </div>

                    {/* Depot block warning note */}
                    <div className="p-4 bg-gray-50 border border-gray-150 rounded-xl flex items-center text-left">
                      <p className="text-[10px] text-gray-450 leading-relaxed font-semibold">
                        Branch location is locked to your dispatcher license. For inter-Depot duty, please submit a transfer request.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-gray-50">
                    <button
                      type="submit"
                      className="bg-black hover:bg-slate-800 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer uppercase"
                    >
                      <Save className="w-4 h-4 text-purple-500" /> SAVE PROFILE CHANGES
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}

          {/* SECURITY TAB VIEW */}
          {activeMenuTab === 'security' && (
            <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-3xs text-left">
              <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider mb-5">UPDATE LOGIN PASSWORD</span>
              <form onSubmit={handleSaveSecurity} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Current Password</label>
                  <div className="relative">
                    <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="Enter current password"
                      value={passwords.current}
                      onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-250 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPass(!showPass)} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">New Password</label>
                    <input
                      type="password"
                      placeholder="Minimum 8 characters"
                      value={passwords.newPass}
                      onChange={e => setPasswords({ ...passwords, newPass: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-250 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Repeat password"
                      value={passwords.confirm}
                      onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-250 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-gray-50">
                  <button
                    type="submit"
                    className="bg-[#FFD400] hover:bg-yellow-400 text-black font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer uppercase"
                  >
                    UPDATE CREDENTIALS
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* PREFERENCES TAB VIEW */}
          {activeMenuTab === 'preferences' && (
            <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-3xs text-left space-y-6">
              <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider">TERMINAL PREFERENCES</span>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <div className="text-left">
                    <span className="text-xs font-bold text-gray-900 block">Sound Alerts</span>
                    <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">Play sounds for new incoming dispatcher alerts</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.soundAlerts}
                    onChange={(e) => setPreferences({ ...preferences, soundAlerts: e.target.checked })}
                    className="w-9 h-5 bg-gray-200 checked:bg-amber-500 rounded-full cursor-pointer appearance-none relative before:content-[''] before:absolute before:h-4 before:w-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:translate-x-4 before:transition-transform"
                  />
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <div className="text-left">
                    <span className="text-xs font-bold text-gray-900 block">Auto-Refresh Manifest Queue</span>
                    <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">Refreshes dispatches list every 30 seconds</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.autoRefresh}
                    onChange={(e) => setPreferences({ ...preferences, autoRefresh: e.target.checked })}
                    className="w-9 h-5 bg-gray-200 checked:bg-amber-500 rounded-full cursor-pointer appearance-none relative before:content-[''] before:absolute before:h-4 before:w-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:translate-x-4 before:transition-transform"
                  />
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <div className="text-left">
                    <span className="text-xs font-bold text-gray-900 block">Desktop Notification Banners</span>
                    <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">Show notifications when window is backgrounded</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.desktopNotifications}
                    onChange={(e) => setPreferences({ ...preferences, desktopNotifications: e.target.checked })}
                    className="w-9 h-5 bg-gray-200 checked:bg-amber-500 rounded-full cursor-pointer appearance-none relative before:content-[''] before:absolute before:h-4 before:w-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:translate-x-4 before:transition-transform"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-gray-50">
                <button
                  onClick={handleSavePreferences}
                  className="bg-black hover:bg-slate-800 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-sm cursor-pointer uppercase"
                >
                  SAVE PREFERENCES
                </button>
              </div>
            </div>
          )}

          {/* HELP TAB VIEW */}
          {activeMenuTab === 'help' && (
            <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-3xs text-left space-y-6">
              <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider">ADMIN SUPPORT HELPDESK</span>
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                If you encounter any licensing errors, network disconnects, or wish to report scanner integration bugs, please contact our internal logistics technical admin.
              </p>
              
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-blue-600 shrink-0" />
                <div className="text-left">
                  <span className="text-xs font-bold text-blue-900 block">Dispatcher Hotline</span>
                  <span className="text-[10px] text-blue-700 font-semibold block mt-0.5">Ext 901 or direct support@herologistics.com</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
