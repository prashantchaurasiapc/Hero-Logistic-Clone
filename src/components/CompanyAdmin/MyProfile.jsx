import React from 'react';
import { 
  User, Phone, Mail, MapPin, Settings, Globe, Clock, Calendar as CalendarIcon,
  Shield, Check, Monitor, Smartphone, Tablet, Link2, ChevronRight, 
  Lock, Edit3, Grid, CalendarDays, Truck, Map, MessageSquare, History, Bell
} from 'lucide-react';

export default function MyProfile() {
  return (
    <div className="flex-grow bg-[#F8FAFC] min-h-screen p-6 w-full text-left font-sans custom-scrollbar overflow-y-auto relative">
      
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <div className="flex items-center text-[11px] text-slate-500 mt-1 gap-1.5 font-medium">
            <span>Home</span>
            <ChevronRight size={10} />
            <span className="text-slate-800">Profile</span>
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 shadow-sm shadow-blue-200">
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
                src="https://ui-avatars.com/api/?name=John+Smith&background=f1f5f9&color=0f172a&size=120" 
                alt="John Smith" 
                className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md"
              />
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            
            <h2 className="text-xl font-bold text-slate-900">John Smith</h2>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1.5">Online</span>
            
            <div className="text-center mt-4">
              <p className="text-[13px] font-semibold text-slate-800">Dispatcher</p>
              <p className="text-[10px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md mt-1.5 border border-slate-100">Employee ID: DSP-0007</p>
            </div>

            <div className="w-full mt-6 space-y-3 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3 text-[11px] text-slate-600">
                <Phone size={14} className="text-slate-400" />
                <span className="font-medium">+61 412 345 678</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-600">
                <Mail size={14} className="text-slate-400" />
                <span className="font-medium">john.smith@herols.com.au</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-600">
                <MapPin size={14} className="text-slate-400" />
                <span className="font-medium">Sydney, Australia</span>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-white rounded-[20px] border border-slate-200 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
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
              <div className="flex justify-between items-center cursor-pointer group">
                <div className="flex items-center gap-2 text-slate-600 group-hover:text-slate-900">
                  <Bell size={13} className="text-slate-400" />
                  <span className="font-medium">Notification Preferences</span>
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
                  <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600" />
                </div>
              </div>
              <div className="flex justify-between items-center cursor-pointer group">
                <div className="flex items-center gap-2 text-slate-600 group-hover:text-slate-900">
                  <Clock size={13} className="text-slate-400" />
                  <span className="font-medium">Time Zone</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-800">(GMT+10:00) Sydney</span>
                  <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600" />
                </div>
              </div>
              <div className="flex justify-between items-center cursor-pointer group">
                <div className="flex items-center gap-2 text-slate-600 group-hover:text-slate-900">
                  <CalendarIcon size={13} className="text-slate-400" />
                  <span className="font-medium">Date Format</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-800">DD MMM YYYY</span>
                  <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600" />
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
                <p className="font-semibold text-slate-900">John Smith</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium mb-1">Mobile Number</p>
                <p className="font-semibold text-slate-900">+61 412 345 678</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium mb-1">Date of Birth</p>
                <p className="font-semibold text-slate-900">15 Mar 1988</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium mb-1">Email Address</p>
                <p className="font-semibold text-slate-900">john.smith@herols.com.au</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium mb-1">Address</p>
                <p className="font-semibold text-slate-900">12 George Street,<br/>Sydney NSW 2000, Australia</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium mb-1">Emergency Contact</p>
                <p className="font-semibold text-slate-900">Emma Smith (Wife)<br/>+61 433 222 111</p>
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
              <p className="text-slate-500 font-medium text-[11px] mb-2.5">Permissions</p>
              <div className="flex flex-wrap gap-2">
                {['Create Load', 'Assign Loads', 'View All Loads', 'Driver Management', 'Vehicle / Trailer Management', 'Yard / Warehouse', 'Reports', 'Messages'].map((perm, i) => (
                  <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-md text-[10px] font-semibold">
                    {perm}
                  </span>
                ))}
              </div>
            </div>

            <button className="text-blue-600 text-[11px] font-semibold flex items-center gap-1 hover:underline mt-2">
              View All Permissions <ChevronRight size={14} />
            </button>
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
                  <tr className="border-b border-slate-50">
                    <td className="py-2.5 font-medium">Assign Load</td>
                    <td className="py-2.5">Assigned Load LD-10562 to Driver Chris Lee</td>
                    <td className="py-2.5 text-slate-500">203.26.45.12</td>
                    <td className="py-2.5 text-slate-500">22 May 2026, 07:56 AM</td>
                  </tr>
                  <tr className="border-b border-slate-50">
                    <td className="py-2.5 font-medium">Update Load</td>
                    <td className="py-2.5">Updated Load LD-10561</td>
                    <td className="py-2.5 text-slate-500">203.26.45.12</td>
                    <td className="py-2.5 text-slate-500">22 May 2026, 07:40 AM</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium">Logout</td>
                    <td className="py-2.5">Logged out from Dispatch Portal</td>
                    <td className="py-2.5 text-slate-500">203.26.45.12</td>
                    <td className="py-2.5 text-slate-500">21 May 2026, 05:30 PM</td>
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
                  <button className="text-blue-600 font-semibold hover:underline">Change</button>
                </div>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Two-Factor Authentication</span>
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-bold text-[9px]">Enabled</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Last Login</span>
                <span className="text-slate-800 font-semibold text-right">22 May 2026, 08:32 AM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Password Last Changed</span>
                <span className="text-slate-800 font-semibold text-right">17 Jan 2026, 11:10 AM</span>
              </div>
            </div>

            <button className="text-blue-600 text-[11px] font-semibold flex items-center justify-between w-full hover:underline mt-5 pt-3 border-t border-slate-100">
              Manage Account Security <ChevronRight size={14} />
            </button>
          </div>

          {/* Devices */}
          <div className="bg-white rounded-[20px] border border-slate-200 p-6 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-900 flex items-center gap-2 mb-5">
              <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><Monitor size={16} /></div>
              Devices
            </h3>
            
            <div className="space-y-4">
              {/* Windows */}
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
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">22 May 2026, 08:32 AM</span>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500" />
                </div>
              </div>
              
              {/* iPhone */}
              <div className="flex items-center justify-between group cursor-pointer pt-3 border-t border-slate-50">
                <div className="flex items-center gap-3">
                  <Smartphone size={18} className="text-slate-400" />
                  <div>
                    <p className="text-[11px] font-bold text-slate-900">iPhone 14 • iOS</p>
                    <p className="text-[10px] text-slate-500">Sydney, Australia</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">20 May 2026, 07:15 PM</span>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500" />
                </div>
              </div>
              
              {/* iPad */}
              <div className="flex items-center justify-between group cursor-pointer pt-3 border-t border-slate-50">
                <div className="flex items-center gap-3">
                  <Tablet size={18} className="text-slate-400" />
                  <div>
                    <p className="text-[11px] font-bold text-slate-900">iPad • iOS</p>
                    <p className="text-[10px] text-slate-500">Sydney, Australia</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">18 May 2026, 09:42 AM</span>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500" />
                </div>
              </div>
            </div>

            <button className="text-blue-600 text-[11px] font-semibold flex items-center justify-between w-full hover:underline mt-5 pt-3 border-t border-slate-100">
              Manage Devices <ChevronRight size={14} />
            </button>
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
    </div>
  );
}
