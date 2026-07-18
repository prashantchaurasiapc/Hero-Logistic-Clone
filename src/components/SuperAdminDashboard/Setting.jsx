import React, { useState } from 'react';
import {
  Settings as SettingsIcon, Palette, Clock, CreditCard, LayoutTemplate,
  Cpu, Compass, Database, Bell, FileText, Building2, CheckCircle2
} from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('Company Profile');
  const [showLogColsDropdown, setShowLogColsDropdown] = useState(false);
  const [visibleLogCols, setVisibleLogCols] = useState({
    timestamp: true,
    userNode: true,
    event: true,
    ipAddress: true,
    authStatus: true
  });

  const tabs = [
    { name: 'Company Profile', icon: SettingsIcon },
    { name: 'Branding & Theme', icon: Palette },
    { name: 'Business Hours', icon: Clock },
    { name: 'Billing & Plans', icon: CreditCard },
    { name: 'White Labeling', icon: LayoutTemplate },
    { name: 'Niche Configuration', icon: Cpu },
    { name: 'GPS Providers', icon: Compass },
    { name: 'Accounting Integration', icon: Database },
    { name: 'Notification Templates', icon: Bell },
    { name: 'System Audit Logs', icon: FileText }
  ];

  return (
    <div className="flex-grow bg-[#F8FAFC] p-6 w-full font-sans">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl text-slate-900 leading-8 capitalize font-black flex items-center gap-2">
          <SettingsIcon className="w-7 h-7 text-[#FFD400]" /> Settings
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Configure company defaults, connect ELD/accounting APIs, and view security audit registries.
        </p>
      </div>

      {/* Nav Tabs */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-b border-slate-200/60 pb-4 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 text-sm transition-colors ${isActive
                  ? 'text-yellow-500 font-extrabold'
                  : 'text-slate-500 font-bold hover:text-slate-700'
                }`}
            >
              <Icon className="w-4.5 h-4.5" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="w-full">
        {activeTab === 'Company Profile' && (
          <div className="bg-white rounded-2xl p-8 shadow-[0_1px_3px_rgb(0,0,0,0.02)] border border-slate-100 w-full max-w-4xl">
            <h2 className="text-lg font-black text-slate-800 mb-6">Company Profile Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Registered Company Name</label>
                <input type="text" defaultValue="Hero Logistics Ltd" className="w-full px-4 py-3 bg-white border border-slate-200 text-sm font-bold rounded-xl focus:outline-none focus:border-[#FFD400] text-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Corporate Registration Number</label>
                <input type="text" defaultValue="ABN 48 901 029 421" className="w-full px-4 py-3 bg-white border border-slate-200 text-sm font-bold rounded-xl focus:outline-none focus:border-[#FFD400] text-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Corporate Admin Email</label>
                <input type="text" defaultValue="admin@herologistics.com" className="w-full px-4 py-3 bg-white border border-slate-200 text-sm font-bold rounded-xl focus:outline-none focus:border-[#FFD400] text-slate-800" />
              </div>
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Platform Membership Subscription</label>
                <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/20">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-extrabold text-slate-800 text-sm">Enterprise Tier Plan</span>
                    <span className="text-xs font-black text-slate-900 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Active</span>
                  </div>
                  <p className="text-xs font-medium text-slate-400">Your next billing cycle date: 07/20/2026 (Monthly Invoice card: visa-8812)</p>
                </div>
              </div>
              <div className="pt-4">
                <button className="w-full bg-[#FFD400] text-black font-extrabold text-sm py-3.5 rounded-xl hover:bg-[#FFC800] transition-colors">
                  Save Company Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Branding & Theme' && (
          <div className="bg-white rounded-2xl p-8 shadow-[0_1px_3px_rgb(0,0,0,0.02)] border border-slate-100 w-full max-w-4xl">
            <h2 className="text-lg font-black text-slate-800 mb-1">Company Branding & Custom Theme</h2>
            <p className="text-xs font-medium text-slate-500 mb-6">Customize the workspace color palette, layout mode, and upload your official company logo.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Primary Workspace Theme Color</label>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center gap-1.5 cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-[#FFD400] border-2 border-slate-800"></div>
                    <span className="text-xs font-bold text-slate-600">Default</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 cursor-pointer opacity-80 hover:opacity-100">
                    <div className="w-10 h-10 rounded-full bg-[#8B5CF6] border border-transparent"></div>
                    <span className="text-xs font-bold text-slate-500">Purple</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 cursor-pointer opacity-80 hover:opacity-100">
                    <div className="w-10 h-10 rounded-full bg-[#10B981] border border-transparent"></div>
                    <span className="text-xs font-bold text-slate-500">Green</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 cursor-pointer opacity-80 hover:opacity-100">
                    <div className="w-10 h-10 rounded-full bg-[#F97316] border border-transparent"></div>
                    <span className="text-xs font-bold text-slate-500">Orange</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 cursor-pointer opacity-80 hover:opacity-100">
                    <div className="w-10 h-10 rounded-full bg-[#3B82F6] border border-transparent"></div>
                    <span className="text-xs font-bold text-slate-500">Blue</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Company Logo Upload</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors">
                  <Building2 className="w-8 h-8 text-slate-400 mb-3" />
                  <p className="text-sm font-extrabold text-slate-700">Click or drag logo file here</p>
                  <p className="text-xs font-medium text-slate-400">Supports SVG, PNG, JPG up to 5MB</p>
                </div>
              </div>

              <div className="pt-2">
                <button className="w-full bg-[#FFD400] text-black font-extrabold text-sm py-3.5 rounded-xl hover:bg-[#FFC800] transition-colors">
                  Apply Branding & Themes
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Business Hours' && (
          <div className="bg-white rounded-2xl p-8 shadow-[0_1px_3px_rgb(0,0,0,0.02)] border border-slate-100 w-full max-w-3xl">
            <h2 className="text-lg font-black text-slate-800 mb-2">Default Terminal Business Hours</h2>
            <p className="text-xs font-medium text-slate-500 mb-6 leading-relaxed">Establish base operating hours across company depots. Individual depots can override these in Branch Settings.</p>

            <div className="space-y-4 mb-6">
              <div className="bg-slate-600 rounded-xl p-5 flex justify-between items-center text-white">
                <div>
                  <h4 className="text-sm font-extrabold mb-1 text-slate-50">Monday - Friday</h4>
                  <p className="text-xs font-semibold text-slate-300">08:00 AM - 06:00 PM</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-extrabold text-slate-50">Open</span>
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center cursor-pointer"></div>
                </div>
              </div>

              <div className="bg-slate-600 rounded-xl p-5 flex justify-between items-center text-white">
                <div>
                  <h4 className="text-sm font-extrabold mb-1 text-slate-50">Saturday</h4>
                  <p className="text-xs font-semibold text-slate-300">09:00 AM - 02:00 PM</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-extrabold text-slate-50">Open</span>
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center cursor-pointer"></div>
                </div>
              </div>

              <div className="bg-slate-600 rounded-xl p-5 flex justify-between items-center text-white">
                <div>
                  <h4 className="text-sm font-extrabold mb-1 text-slate-50">Sunday</h4>
                  <p className="text-xs font-semibold text-slate-300">Closed</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-extrabold text-rose-400">Closed</span>
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center cursor-pointer"></div>
                </div>
              </div>
            </div>

            <button className="w-full bg-[#FFD400] text-black font-extrabold text-sm py-3.5 rounded-xl hover:bg-[#FFC800] transition-colors">
              Save Default Hours
            </button>
          </div>
        )}

        {activeTab === 'Billing & Plans' && (
          <div className="bg-white rounded-2xl p-8 shadow-[0_1px_3px_rgb(0,0,0,0.02)] border border-slate-100 w-full">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-black text-slate-800 mb-1">Billing & Subscription Management</h2>
                <p className="text-xs font-medium text-slate-500">Manage plan subscription levels, invoices, and active payment cards.</p>
              </div>
              <span className="bg-emerald-50 text-emerald-500 border border-emerald-100 px-4 py-1 rounded-full text-xs font-black">Enterprise Tier</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border border-slate-200 rounded-2xl p-6 shadow-sm bg-white">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">Active Payment Method</h3>
                <div className="flex items-start gap-4 mb-6">
                  <div className="border border-slate-200 rounded-lg px-3 py-1.5 font-bold text-slate-600 text-sm bg-slate-50">Visa</div>
                  <div>
                    <div className="text-sm font-black text-slate-800 mb-0.5">Visa ending in 8812</div>
                    <div className="text-xs font-semibold text-slate-500">Expires 09/2029</div>
                  </div>
                </div>
                <button className="text-xs font-black text-yellow-500 hover:text-yellow-600">Update Card Details &rarr;</button>
              </div>

              <div className="border border-slate-200 rounded-2xl p-6 shadow-sm bg-white">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">Subscription Usage</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-slate-500">depots count</span>
                    <span className="text-slate-800 font-extrabold">2 / Unlimited</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-slate-500">users count</span>
                    <span className="text-slate-800 font-extrabold">12 / Unlimited</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-semibold pt-1">
                    <span className="text-slate-500">monthly invoice value</span>
                    <span className="text-yellow-500 font-extrabold">$499.00 / mo</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">Billing Invoices Registry</h3>
              <div className="space-y-3">
                <div className="bg-slate-600 rounded-xl p-4 px-5 flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-50 mb-0.5">Invoice #INV-89112</h4>
                    <p className="text-xs font-medium text-slate-300">Jun 20, 2026</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-slate-50 mb-0.5">$499.00</div>
                      <div className="text-[10px] font-black text-slate-300 uppercase">Paid</div>
                    </div>
                    <button className="bg-white text-slate-700 font-black text-xs px-4 py-2 rounded-xl shadow-sm hover:bg-slate-50">PDF</button>
                  </div>
                </div>
                <div className="bg-slate-600 rounded-xl p-4 px-5 flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-50 mb-0.5">Invoice #INV-88029</h4>
                    <p className="text-xs font-medium text-slate-300">May 20, 2026</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-slate-50 mb-0.5">$499.00</div>
                      <div className="text-[10px] font-black text-slate-300 uppercase">Paid</div>
                    </div>
                    <button className="bg-white text-slate-700 font-black text-xs px-4 py-2 rounded-xl shadow-sm hover:bg-slate-50">PDF</button>
                  </div>
                </div>
                <div className="bg-slate-600 rounded-xl p-4 px-5 flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-50 mb-0.5">Invoice #INV-87002</h4>
                    <p className="text-xs font-medium text-slate-300">Apr 20, 2026</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-slate-50 mb-0.5">$499.00</div>
                      <div className="text-[10px] font-black text-slate-300 uppercase">Paid</div>
                    </div>
                    <button className="bg-white text-slate-700 font-black text-xs px-4 py-2 rounded-xl shadow-sm hover:bg-slate-50">PDF</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'White Labeling' && (
          <div className="bg-white rounded-2xl p-8 shadow-[0_1px_3px_rgb(0,0,0,0.02)] border border-slate-100 w-full max-w-4xl">
            <h2 className="text-lg font-black text-slate-800 mb-1">White Label & Domain Setup</h2>
            <p className="text-xs font-medium text-slate-500 mb-6">Customize the system workspace to match your own brand name and host it on your custom domain URL hostname.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Custom Domain Hostname</label>
                <input type="text" defaultValue="logistics.herologistics.com" className="w-full px-4 py-3 bg-white border border-slate-200 text-sm font-bold rounded-xl focus:outline-none focus:border-[#FFD400] text-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Login Screen Welcome Header Title</label>
                <input type="text" defaultValue="Hero Logistics Operate System" className="w-full px-4 py-3 bg-white border border-slate-200 text-sm font-bold rounded-xl focus:outline-none focus:border-[#FFD400] text-slate-800" />
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Brand Theme Options</label>
                <div className="bg-slate-600 rounded-xl p-5 flex justify-between items-center text-white">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-50 mb-0.5">Hide Hero Logistics branding labels</h4>
                    <p className="text-xs font-medium text-slate-400">Hide system links from help docs in dispatcher & driver dashboards</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-blue-500 focus:ring-blue-500 border-none bg-white cursor-pointer" />
                </div>
              </div>

              <div className="pt-4">
                <button className="w-full bg-[#FFD400] text-black font-extrabold text-sm py-3.5 rounded-xl hover:bg-[#FFC800] transition-colors">
                  Save White Labeling Setup
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Niche Configuration' && (
          <div className="bg-white rounded-2xl p-8 shadow-[0_1px_3px_rgb(0,0,0,0.02)] border border-slate-100 w-full max-w-4xl">
            <h2 className="text-lg font-black text-slate-800 mb-1">Logistics Niche Configurations</h2>
            <p className="text-xs font-medium text-slate-500 mb-6">Configure active niches. Toggling off a niche hides related fields and tables across all dispatch dashboards.</p>

            <div className="space-y-4 mb-6">
              <div className="bg-slate-600 rounded-xl p-5 flex justify-between items-center text-white">
                <div>
                  <h4 className="text-sm font-extrabold mb-0.5 text-slate-50">Car Carrying & Transport</h4>
                  <p className="text-xs font-medium text-slate-400">Enables VIN, condition reports, holding yard flows, and asset registers.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-blue-500 focus:ring-blue-500 border-none cursor-pointer bg-white" />
              </div>
              <div className="bg-slate-600 rounded-xl p-5 flex justify-between items-center text-white">
                <div>
                  <h4 className="text-sm font-extrabold mb-0.5 text-slate-50">General Freight</h4>
                  <p className="text-xs font-medium text-slate-400">Enables pallet count, dimensions, cargo weight, and dry silos.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-blue-500 focus:ring-blue-500 border-none cursor-pointer bg-white" />
              </div>
              <div className="bg-slate-600 rounded-xl p-5 flex justify-between items-center text-white">
                <div>
                  <h4 className="text-sm font-extrabold mb-0.5 text-slate-50">Dangerous Goods (HAZMAT)</h4>
                  <p className="text-xs font-medium text-slate-400">Enables UN Class, Hazchem chemical codes, and trailer placards.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-blue-500 focus:ring-blue-500 border-none cursor-pointer bg-white" />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Default Niche Selection</label>
              <select className="w-full px-4 py-3 bg-white border border-slate-200 text-sm font-bold rounded-xl focus:outline-none focus:border-[#FFD400] text-slate-800 cursor-pointer">
                <option>Car Carrying</option>
                <option>General Freight</option>
                <option>Dangerous Goods</option>
              </select>
            </div>

            <button className="w-full bg-[#FFD400] text-black font-extrabold text-sm py-3.5 rounded-xl hover:bg-[#FFC800] transition-colors">
              Save Niche Setup
            </button>
          </div>
        )}

        {activeTab === 'GPS Providers' && (
          <div className="bg-white rounded-2xl p-8 shadow-[0_1px_3px_rgb(0,0,0,0.02)] border border-slate-100 w-full">
            <h2 className="text-lg font-black text-slate-800 mb-6">GPS Providers & ELD Integrations</h2>

            <div className="space-y-4">
              <div className="border border-slate-200 rounded-2xl p-6 flex justify-between items-center bg-white shadow-sm">
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <h4 className="text-sm font-black text-slate-800">Trakka Telematics</h4>
                    <span className="bg-emerald-50 text-emerald-500 border border-emerald-100 px-2.5 py-0.5 rounded-full text-xs font-black">Connected</span>
                  </div>
                  <p className="text-xs font-bold font-mono text-slate-400">API Key: ****************39B1</p>
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-xs font-black text-slate-600 hover:text-slate-800">Edit API Key</button>
                  <button className="bg-[#FFD400] text-black font-black text-xs px-5 py-2.5 rounded-xl hover:bg-[#FFC800] transition-colors">Test Link</button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-6 flex justify-between items-center bg-white shadow-sm">
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <h4 className="text-sm font-black text-slate-800">Geotab ELD API</h4>
                    <span className="bg-emerald-50 text-emerald-500 border border-emerald-100 px-2.5 py-0.5 rounded-full text-xs font-black">Connected</span>
                  </div>
                  <p className="text-xs font-bold font-mono text-slate-400">API Key: ****************7742</p>
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-xs font-black text-slate-600 hover:text-slate-800">Edit API Key</button>
                  <button className="bg-[#FFD400] text-black font-black text-xs px-5 py-2.5 rounded-xl hover:bg-[#FFC800] transition-colors">Test Link</button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-6 flex justify-between items-center bg-white shadow-sm">
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <h4 className="text-sm font-black text-slate-800">Teletrac Navman</h4>
                    <span className="bg-rose-50 text-rose-500 border border-rose-100 px-2.5 py-0.5 rounded-full text-xs font-black">Disconnected</span>
                  </div>
                  <p className="text-xs font-bold font-mono text-slate-400">API Key: No API key configured</p>
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-xs font-black text-slate-600 hover:text-slate-800">Edit API Key</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Accounting Integration' && (
          <div className="bg-white rounded-2xl p-8 shadow-[0_1px_3px_rgb(0,0,0,0.02)] border border-slate-100 w-full">
            <h2 className="text-lg font-black text-slate-800 mb-6">Cloud Accounting Integrations</h2>

            <div className="space-y-4">
              <div className="border border-slate-200 rounded-2xl p-6 flex justify-between items-center bg-white shadow-sm">
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <h4 className="text-sm font-black text-slate-800">Xero Accounting</h4>
                    <span className="bg-emerald-50 text-emerald-500 border border-emerald-100 px-2.5 py-0.5 rounded-full text-xs font-black">Connected</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500">Last synced ledger logs: 10 min ago</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="bg-[#FFD400] text-black font-black text-xs px-5 py-2.5 rounded-xl hover:bg-[#FFC800] transition-colors">Sync Invoices Now</button>
                  <button className="bg-rose-50 text-rose-600 font-black text-xs px-5 py-2.5 rounded-xl border border-rose-100 hover:bg-rose-100 transition-colors">Disconnect</button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-6 flex justify-between items-center bg-white shadow-sm">
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <h4 className="text-sm font-black text-slate-800">QuickBooks Online</h4>
                    <span className="bg-rose-50 text-rose-500 border border-rose-100 px-2.5 py-0.5 rounded-full text-xs font-black">Disconnected</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500">Last synced ledger logs: Never</p>
                </div>
                <div className="flex items-center gap-4">
                  <button className="bg-[#FFD400] text-black font-black text-xs px-5 py-2.5 rounded-xl hover:bg-[#FFC800] transition-colors">Authenticate Link</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Notification Templates' && (
          <div className="bg-white rounded-2xl p-8 shadow-[0_1px_3px_rgb(0,0,0,0.02)] border border-slate-100 w-full">
            <h2 className="text-lg font-black text-slate-800 mb-6">System SMS & Email Notification Templates</h2>

            <div className="space-y-4">
              <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-black text-slate-800">Shipper Invoice Receipt Email</h4>
                  <span className="text-xs font-black text-slate-400">EMAIL</span>
                </div>
                <p className="text-xs font-bold text-slate-500 mb-4 font-mono">Subject: Hero Logistics Invoice [Invoice ID] for [Customer]</p>
                <div className="border-t border-slate-100 pt-4">
                  <button className="text-xs font-black text-slate-700 hover:text-slate-900">Edit Template</button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-black text-slate-800">Driver Job Dispatch SMS</h4>
                  <span className="text-xs font-black text-slate-400">SMS</span>
                </div>
                <p className="text-xs font-bold text-slate-500 mb-4 font-mono">Body: Hero Alert: New Job [Load ID] assigned to you. Report to [Pickup].</p>
                <div className="border-t border-slate-100 pt-4">
                  <button className="text-xs font-black text-slate-700 hover:text-slate-900">Edit Template</button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-black text-slate-800">POD Confirmation Email</h4>
                  <span className="text-xs font-black text-slate-400">EMAIL</span>
                </div>
                <p className="text-xs font-bold text-slate-500 mb-4 font-mono">Subject: Hero Proof-of-Delivery: Job [Load ID] complete.</p>
                <div className="border-t border-slate-100 pt-4">
                  <button className="text-xs font-black text-slate-700 hover:text-slate-900">Edit Template</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'System Audit Logs' && (
          <div className="bg-white rounded-2xl p-8 shadow-[0_1px_3px_rgb(0,0,0,0.02)] border border-slate-100 w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-slate-800">Company SaaS Security Audit Logs</h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-slate-100 p-0.5 rounded-xl">
                  {['COMPACT', 'DEFAULT', 'RELAXED'].map(view => (
                    <button
                      key={view}
                      className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide transition-colors ${view === 'DEFAULT' ? 'bg-[#FFD400] text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      {view}
                    </button>
                  ))}
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => setShowLogColsDropdown(prev => !prev)}
                    className={`flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-black tracking-wide hover:bg-slate-200 transition-colors border ${showLogColsDropdown ? 'border-[#FFD400]' : 'border-slate-200'}`}
                  >
                    <SettingsIcon className="w-4 h-4" /> COLUMNS
                  </button>

                  {showLogColsDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-2">
                      <div className="px-4 py-2 border-b border-slate-100 mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">COLUMN VISIBILITY</span>
                      </div>
                      <div className="max-h-64 overflow-y-auto px-2 space-y-1">
                        {[
                          { id: 'timestamp', label: 'Timestamp' },
                          { id: 'userNode', label: 'User Node' },
                          { id: 'event', label: 'Event Action Description' },
                          { id: 'ipAddress', label: 'IP Address' },
                          { id: 'authStatus', label: 'Auth Status' }
                        ].map((col) => (
                          <label key={col.id} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                            <input
                              type="checkbox"
                              checked={visibleLogCols[col.id]}
                              onChange={() => setVisibleLogCols(prev => ({ ...prev, [col.id]: !prev[col.id] }))}
                              className="w-4.5 h-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                            />
                            <span className="text-sm font-bold text-slate-700">{col.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    <th className="p-5 w-16 text-center">
                      <input type="checkbox" className="w-4.5 h-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer" />
                    </th>
                    {visibleLogCols.timestamp && <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider">TIMESTAMP</th>}
                    {visibleLogCols.userNode && <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider">USER NODE</th>}
                    {visibleLogCols.event && <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider">EVENT ACTION DESCRIPTION</th>}
                    {visibleLogCols.ipAddress && <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider">IP ADDRESS</th>}
                    {visibleLogCols.authStatus && <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider">AUTH STATUS</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { id: 1, ts: '13/7/2026, 5:28:37 pm', node: 'Super Admin', ev: 'Successfully converted trial account', ip: '192.168.1.1' },
                    { id: 2, ts: '13/7/2026, 5:28:30 pm', node: 'System Root', ev: 'Plan updated successfully', ip: '192.168.1.1' },
                    { id: 3, ts: '13/7/2026, 5:20:00 pm', node: 'Super Admin', ev: 'Login successful', ip: '192.168.1.1' },
                    { id: 4, ts: '13/7/2026, 5:10:00 pm', node: 'System Root', ev: 'Settings updated', ip: '192.168.1.1' }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-5 text-center w-16">
                        <input type="checkbox" className="w-4.5 h-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer" />
                      </td>
                      {visibleLogCols.timestamp && <td className="p-5 text-sm font-medium text-slate-500">{row.ts}</td>}
                      {visibleLogCols.userNode && <td className="p-5 text-sm font-bold text-slate-800">{row.node}</td>}
                      {visibleLogCols.event && <td className="p-5 text-sm font-medium text-slate-600">{row.ev}</td>}
                      {visibleLogCols.ipAddress && <td className="p-5 text-sm font-medium text-slate-500">{row.ip}</td>}
                      {visibleLogCols.authStatus && (
                        <td className="p-5 flex items-center gap-2 text-sm font-bold text-slate-700">
                          <CheckCircle2 className="w-4.5 h-4.5 text-slate-400" /> Success
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
