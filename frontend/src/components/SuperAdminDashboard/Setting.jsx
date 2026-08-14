import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, ShieldCheck, Database, CheckCircle2, Save, Sparkles, Lock, Key, Globe, HelpCircle 
} from 'lucide-react';
import api from '../../services/api';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('System Defaults');
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // --- States ---
  // System Defaults
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [defaultLanguage, setDefaultLanguage] = useState('en');
  const [defaultTrialDays, setDefaultTrialDays] = useState(14);
  const [basePricePerCompany, setBasePricePerCompany] = useState(299.00);

  // Security Configurations
  const [forceMfaAdmins, setForceMfaAdmins] = useState(true);
  const [forceMfaTenants, setForceMfaTenants] = useState(false);
  const [passwordComplexity, setPasswordComplexity] = useState('MEDIUM');
  const [minPasswordLength, setMinPasswordLength] = useState(8);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);
  const [lockoutDurationMinutes, setLockoutDurationMinutes] = useState(15);

  // Integrations Marketplace
  const [stripePublishableKey, setStripePublishableKey] = useState('pk_live_************************');
  const [stripeWebhookSecret, setStripeWebhookSecret] = useState('whsec_************************');
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState('AIzaSy************************');
  const [emailService, setEmailService] = useState('sendgrid');
  const [emailApiKey, setEmailApiKey] = useState('SG.************************');

  const handleSaveSettings = (sectionName) => {
    // Simulates saving settings to the database
    triggerToast(`SaaS configurations for "${sectionName}" updated successfully.`);
  };

  const tabs = [
    { name: 'System Defaults', icon: SettingsIcon },
    { name: 'Security Configurations', icon: ShieldCheck },
    { name: 'Integrations Marketplace', icon: Database }
  ];

  return (
    <div className="flex-grow bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 w-full font-sans text-left space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-[9999] bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl text-slate-900 leading-8 capitalize font-black flex items-center gap-2">
          <SettingsIcon className="w-7 h-7 text-brand-500" /> Platform Settings
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Configure platform defaults, global security levels, and SaaS integrations marketplace.
        </p>
      </div>

      {/* Nav Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/60 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 text-xs transition-all px-4 py-2.5 rounded-xl cursor-pointer outline-none select-none border ${
                isActive
                  ? 'bg-slate-900 text-brand-500 font-black border-slate-900 shadow-sm'
                  : 'bg-white text-slate-600 font-bold hover:bg-slate-50 border-slate-200/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="w-full">
        {activeTab === 'System Defaults' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-100 w-full max-w-4xl space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2"><Globe className="w-5 h-5 text-indigo-500" /> System Defaults Configuration</h2>
              <p className="text-xs text-slate-400 font-semibold mt-1">Set base parameters applied to new tenants during provisioning.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Default Platform Currency</label>
                <select 
                  value={defaultCurrency}
                  onChange={e => setDefaultCurrency(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 text-xs font-bold rounded-xl focus:outline-none focus:border-brand-500 cursor-pointer"
                >
                  <option value="USD">USD - United States Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Default Language Locale</label>
                <select 
                  value={defaultLanguage}
                  onChange={e => setDefaultLanguage(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 text-xs font-bold rounded-xl focus:outline-none focus:border-brand-500 cursor-pointer"
                >
                  <option value="en">English (US/UK)</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Default SaaS Trial Period (Days)</label>
                <input 
                  type="number" 
                  value={defaultTrialDays}
                  onChange={e => setDefaultTrialDays(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 text-xs font-bold rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Base MRR Price per Instance ($)</label>
                <input 
                  type="number" step="0.01"
                  value={basePricePerCompany}
                  onChange={e => setBasePricePerCompany(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 text-xs font-bold rounded-xl focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => handleSaveSettings('System Defaults')}
                className="bg-brand-500 hover:bg-brand-600 text-black font-extrabold text-xs px-6 py-3 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save Defaults
              </button>
            </div>
          </div>
        )}

        {activeTab === 'Security Configurations' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-100 w-full max-w-4xl space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2"><Lock className="w-5 h-5 text-amber-500" /> Global Security & Access Policy</h2>
              <p className="text-xs text-slate-400 font-semibold mt-1">Configure global platform-wide auth rules and credentials strength constraints.</p>
            </div>

            <div className="space-y-5 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl bg-slate-50/50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={forceMfaAdmins}
                    onChange={e => setForceMfaAdmins(e.target.checked)}
                    className="w-4.5 h-4.5 text-brand-500 focus:ring-0 rounded cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-black text-slate-800 block">Enforce MFA for HERO Staff</span>
                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Force all platform owners, sales, and support reps to use MFA.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl bg-slate-50/50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={forceMfaTenants}
                    onChange={e => setForceMfaTenants(e.target.checked)}
                    className="w-4.5 h-4.5 text-brand-500 focus:ring-0 rounded cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-black text-slate-800 block">Enforce MFA for Tenant Admins</span>
                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Enforce MFA login challenges for individual company workspace admins.</span>
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Password Complexity Enforcement</label>
                  <select 
                    value={passwordComplexity}
                    onChange={e => setPasswordComplexity(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 text-xs font-bold rounded-xl focus:outline-none focus:border-brand-500 cursor-pointer"
                  >
                    <option value="LOW">Low (Numeric/Alphabetic)</option>
                    <option value="MEDIUM">Medium (Alpha, Numbers, Min 8 chars)</option>
                    <option value="HIGH">High (Uppercase, Special Characters, Numbers, Min 12 chars)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Minimum Credentials Length</label>
                  <input 
                    type="number" 
                    value={minPasswordLength}
                    onChange={e => setMinPasswordLength(parseInt(e.target.value) || 8)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 text-xs font-bold rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Max Login Failure Attempts</label>
                  <input 
                    type="number" 
                    value={maxLoginAttempts}
                    onChange={e => setMaxLoginAttempts(parseInt(e.target.value) || 5)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 text-xs font-bold rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Brute-Force Lockout Duration (Minutes)</label>
                  <input 
                    type="number" 
                    value={lockoutDurationMinutes}
                    onChange={e => setLockoutDurationMinutes(parseInt(e.target.value) || 15)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 text-xs font-bold rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => handleSaveSettings('Security Configurations')}
                className="bg-brand-500 hover:bg-brand-600 text-black font-extrabold text-xs px-6 py-3 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save Security Policies
              </button>
            </div>
          </div>
        )}

        {activeTab === 'Integrations Marketplace' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-100 w-full max-w-4xl space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2"><Key className="w-5 h-5 text-emerald-500" /> Platform API Keys & Integrations</h2>
              <p className="text-xs text-slate-400 font-semibold mt-1">Connect billing gateways, routing map APIs, and mail providers globally.</p>
            </div>

            <div className="space-y-5 pt-4">
              <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/30 space-y-4">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">Stripe Billing Platform</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Live Publishable Key</label>
                    <input 
                      type="text" 
                      value={stripePublishableKey}
                      onChange={e => setStripePublishableKey(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 text-xs font-mono rounded-xl focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Webhook Signing Secret</label>
                    <input 
                      type="text" 
                      value={stripeWebhookSecret}
                      onChange={e => setStripeWebhookSecret(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 text-xs font-mono rounded-xl focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/30 space-y-4">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">Google Maps Routing Service</h3>
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Maps JavaScript & Geocoding API Key</label>
                  <input 
                    type="text" 
                    value={googleMapsApiKey}
                    onChange={e => setGoogleMapsApiKey(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 text-xs font-mono rounded-xl focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/30 space-y-4">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">System Email Service Carrier</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Preferred Carrier</label>
                    <select 
                      value={emailService}
                      onChange={e => setEmailService(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 text-xs font-bold rounded-xl focus:outline-none focus:border-brand-500 cursor-pointer"
                    >
                      <option value="sendgrid">Sendgrid Mail API</option>
                      <option value="aws_ses">Amazon AWS SES</option>
                      <option value="mailgun">Mailgun Gateway</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Access Token Key</label>
                    <input 
                      type="text" 
                      value={emailApiKey}
                      onChange={e => setEmailApiKey(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 text-xs font-mono rounded-xl focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => handleSaveSettings('Integrations Marketplace')}
                className="bg-brand-500 hover:bg-brand-600 text-black font-extrabold text-xs px-6 py-3 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save Integration Keys
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
