import React from 'react';
import {
  Building, Phone, MapPin, Globe, Save, ChevronDown
} from 'lucide-react';

export default function CompanySettings() {
  const [toastMsg, setToastMsg] = React.useState('');
  const triggerToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000); };

  const [entityName, setEntityName] = React.useState('HERO Logistics AU Pty Ltd');
  const [phone, setPhone] = React.useState('+61 1800 000 000');
  const [address, setAddress] = React.useState('Level 4, 200 George St, Sydney NSW 2000');
  const [currency, setCurrency] = React.useState('AUD');

  const [specializations, setSpecializations] = React.useState({
    general: true,
    car: true,
    dangerous: true,
    refrigerated: true
  });

  const [regions, setRegions] = React.useState({
    nsw: true,
    vic: true,
    wa: false
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto bg-white min-h-screen text-left flex flex-col space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-xl animate-fade-in">{toastMsg}</div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-none mb-1.5">Company Profile Setup</h1>
          <p className="text-gray-500 text-[13px]">Configure your core SaaS organization details, business niche, and operational regions.</p>
        </div>
        <button 
          onClick={() => triggerToast('Profile saved successfully!')} 
          className="flex items-center gap-1.5 px-5 py-2.5 bg-[#FFD400] hover:bg-yellow-400 rounded-xl text-xs font-bold text-black transition-all cursor-pointer shadow-sm"
        >
          <Save className="h-4 w-4" /> Save Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: Profile Settings */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">

          {/* Registered Entity Name Row */}
          <div className="flex gap-4 items-start">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-700 flex-shrink-0 shadow-3xs">
              <Building className="w-6 h-6" />
            </div>
            <div className="flex-1 space-y-1.5 text-left">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <Building className="w-3.5 h-3.5 text-gray-400" /> Registered Entity Name
              </div>
              <input
                type="text"
                value={entityName}
                onChange={e => setEntityName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
              />
              <p className="text-[10px] text-gray-400 font-medium">Official company name used for all legal invoicing and POD documents.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
            {/* Business Specializations */}
            <div className="space-y-3 text-left">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Business Specializations</h4>
              <div className="space-y-2.5">
                {[
                  { label: 'General Freight', key: 'general' },
                  { label: 'Car / Vehicle Transport', key: 'car' },
                  { label: 'Dangerous Goods (DG)', key: 'dangerous' },
                  { label: 'Refrigerated / Cold Chain', key: 'refrigerated' }
                ].map((spec) => (
                  <label key={spec.key} className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-gray-800">
                    <input
                      type="checkbox"
                      checked={specializations[spec.key]}
                      onChange={e => setSpecializations({ ...specializations, [spec.key]: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                    />
                    {spec.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Support Phone Number */}
            <div className="space-y-2 text-left">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Support Phone Number</h4>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-950 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
                />
              </div>
            </div>
          </div>

          {/* Headquarters Address */}
          <div className="space-y-2 pt-4 border-t border-gray-50 text-left">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Headquarters Address</h4>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-950 focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
              />
            </div>
          </div>

        </div>

        {/* Right Panel: Regions & Zones, System Currency */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6 text-left">
          {/* Regions & Zones */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-900 border-b border-gray-50 pb-2">
              <Globe className="w-4 h-4 text-gray-700" />
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Regions & Zones</h3>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">Specify where your fleet currently operates.</p>

            <div className="space-y-3 pt-2">
              {[
                { label: 'New South Wales', key: 'nsw' },
                { label: 'Victoria', key: 'vic' },
                { label: 'Western Australia', key: 'wa' }
              ].map((region) => (
                <div key={region.key} className="flex justify-between items-center py-2.5 px-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-800">{region.label}</span>
                  <button
                    onClick={() => setRegions({ ...regions, [region.key]: !regions[region.key] })}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      regions[region.key] ? 'bg-[#FFD400]' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                        regions[region.key] ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* System Currency */}
          <div className="space-y-3 pt-2 border-t border-gray-50">
            <div className="flex items-center gap-2 text-gray-900 pb-2">
              <Globe className="w-4 h-4 text-gray-700" />
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">System Currency</h3>
            </div>
            <div className="relative">
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#FFD400]"
              >
                <option value="AUD">AUD - Australian Dollar ($)</option>
                <option value="USD">USD - US Dollar ($)</option>
                <option value="GBP">GBP - British Pound (£)</option>
                <option value="EUR">EUR - Euro (€)</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
