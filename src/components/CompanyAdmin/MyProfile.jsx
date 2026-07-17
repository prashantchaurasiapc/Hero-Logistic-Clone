import React from 'react';
import { User, Save, Grid, Lock } from 'lucide-react';

export default function MyProfile() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto bg-[#FAFAFA] min-h-screen text-left flex flex-col space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 pb-1">
          <div className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-700 shadow-sm flex-shrink-0">
            <User size={20} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none mb-1">My Profile</h1>
            <p className="text-gray-500 text-xs">Manage your personal information and security credentials</p>
          </div>
        </div>
        <button className="bg-[#FFD400] hover:bg-[#F0C800] text-black text-[13px] font-bold py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm">
          <Save size={16} strokeWidth={2.5} />
          Save Profile
        </button>
      </div>

      {/* Personal Details Card */}
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-wider mb-1">Personal Details</h2>
          <p className="text-xs text-gray-500 font-medium">Your identity on the platform</p>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Photo Upload Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-[120px] h-[120px] bg-[#F8FAFC] rounded-2xl flex items-center justify-center border border-gray-100">
              <Grid size={32} className="text-gray-900" strokeWidth={2} />
            </div>
            <button className="text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 py-1.5 px-4 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-gray-200">
              Upload Photo
            </button>
          </div>

          {/* Form Fields */}
          <div className="flex-1 flex flex-col gap-6">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
              <input 
                type="text" 
                defaultValue="Rajiv Mehta"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-transparent transition-all"
              />
            </div>
            
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Contact Number</label>
              <input 
                type="text" 
                defaultValue="+61 412 345 678"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Login Email</label>
              <input 
                type="email" 
                defaultValue="rajiv.m@herologistics.com"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-transparent transition-all"
              />
              <p className="mt-2 text-[11px] text-gray-400 font-medium">Account ownership transfers must go through support.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Safety & Security Card */}
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-6 sm:p-8">
        <div className="mb-6">
           <div className="flex items-center gap-2 mb-1">
             <Lock size={14} className="text-gray-900" strokeWidth={2} />
             <h2 className="text-[13px] font-bold text-gray-900 uppercase tracking-wider">Safety & Security</h2>
           </div>
          <p className="text-xs text-gray-500 font-medium">Update your password and 2FA settings</p>
        </div>

        <div className="flex flex-col gap-6 max-w-xl">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Current Password</label>
            <input 
              type="password" 
              defaultValue="********"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">New Password</label>
            <input 
              type="password" 
              placeholder="New Password"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Confirm New Password</label>
            <input 
              type="password" 
              placeholder="Confirm Password"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[13px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FFD400] focus:border-transparent transition-all"
            />
          </div>
          
          <div className="mt-2">
             <button className="bg-[#0B0F19] hover:bg-black text-white text-[13px] font-bold py-2.5 px-5 rounded-lg transition-colors cursor-pointer">
              Update Password
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
