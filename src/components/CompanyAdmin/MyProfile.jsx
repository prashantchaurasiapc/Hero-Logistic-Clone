import React, { useState, useRef, useEffect } from 'react';
import { User, Save, Lock, Upload, Camera, Trash2, CheckCircle2 } from 'lucide-react';

export default function MyProfile() {
  const [profilePhoto, setProfilePhoto] = useState(
    localStorage.getItem('hero_profilePhoto') || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  );
  const [savedSuccess, setSavedSuccess] = useState('');
  const [fullName, setFullName] = useState(localStorage.getItem('hero_fullName') || 'Rajiv Mehta');
  const [contactNumber, setContactNumber] = useState(localStorage.getItem('hero_contactNumber') || '+61 412 345 678');
  const [email, setEmail] = useState(localStorage.getItem('hero_email') || 'rajiv.m@herologistics.com');

  const fileInputRef = useRef(null);

  const handlePhotoClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setProfilePhoto(uploadEvent.target.result);
        triggerToast('Profile photo updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    triggerToast('Profile photo removed.');
  };

  const triggerToast = (msg) => {
    setSavedSuccess(msg);
    setTimeout(() => setSavedSuccess(''), 3000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem('hero_fullName', fullName);
    localStorage.setItem('hero_contactNumber', contactNumber);
    localStorage.setItem('hero_email', email);
    if (profilePhoto) localStorage.setItem('hero_profilePhoto', profilePhoto);
    else localStorage.removeItem('hero_profilePhoto');
    triggerToast('Profile information saved successfully!');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto bg-[#FAFAFA] min-h-screen text-left flex flex-col space-y-6 font-sans">
      
      {/* Hidden File Input */}
      <input 
        ref={fileInputRef} 
        type="file" 
        accept="image/png, image/jpeg, image/jpg, image/webp" 
        onChange={handleFileChange}
        className="hidden" 
      />

      {/* Toast Banner */}
      {savedSuccess && (
        <div className="fixed top-6 right-6 z-[9999] bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle2 size={16} />
          <span>{savedSuccess}</span>
        </div>
      )}

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
        <button 
          onClick={handleSaveProfile}
          className="bg-[#FFD400] hover:bg-[#F0C800] text-black text-[13px] font-bold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
        >
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
          <div className="flex flex-col items-center gap-3.5 shrink-0">
            <div 
              onClick={handlePhotoClick}
              className="relative w-[130px] h-[130px] rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-50 flex items-center justify-center group cursor-pointer shadow-sm hover:border-indigo-500 transition-all"
            >
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile Avatar" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <User size={40} />
                  <span className="text-[10px] font-bold mt-1">No Photo</span>
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1">
                <Camera size={22} />
                <span className="text-[10px] font-bold">Change Photo</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={handlePhotoClick}
                className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 py-1.5 px-3.5 rounded-lg transition-colors cursor-pointer border border-indigo-100 flex items-center gap-1.5"
              >
                <Upload size={13} /> Upload Photo
              </button>
              {profilePhoto && (
                <button 
                  type="button"
                  onClick={handleRemovePhoto}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Remove Photo"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-semibold">JPG, PNG or WEBP (Max 5MB)</p>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSaveProfile} className="flex-1 flex flex-col gap-6">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
              <input 
                type="text" 
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Contact Number</label>
              <input 
                type="text" 
                value={contactNumber}
                onChange={e => setContactNumber(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Login Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
              />
              <p className="mt-2 text-[11px] text-gray-400 font-medium">Account ownership transfers must go through support.</p>
            </div>
          </form>
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

        <form onSubmit={(e) => { e.preventDefault(); triggerToast('Password updated successfully!'); }} className="flex flex-col gap-6 max-w-xl">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Current Password</label>
            <input 
              type="password" 
              defaultValue="********"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">New Password</label>
            <input 
              type="password" 
              placeholder="New Password"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Confirm New Password</label>
            <input 
              type="password" 
              placeholder="Confirm Password"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
            />
          </div>
          
          <div className="mt-2">
             <button type="submit" className="bg-[#0B0F19] hover:bg-black text-white text-[13px] font-bold py-2.5 px-5 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95">
              Update Password
            </button>
          </div>
        </form>
      </div>
      
    </div>
  );
}
