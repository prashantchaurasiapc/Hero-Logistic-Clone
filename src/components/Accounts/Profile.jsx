import React, { useState } from 'react';
import {
    User,
    Mail,
    Phone,
    Building2,
    ShieldCheck,
    Key,
    Bell,
    CheckCircle2,
    DollarSign,
    CreditCard,
    Lock,
    Edit,
    Camera,
    Save,
    Clock,
    MapPin,
    Award,
    FileText,
    AlertCircle
} from 'lucide-react';

export default function AccountsProfile() {
    const [profileData, setProfileData] = useState({
        firstName: 'John',
        lastName: 'Smith',
        title: 'Chief Financial Officer & Accounts Manager',
        email: 'john.smith@herologistics.com.au',
        phone: '+61 412 345 678',
        extension: 'x402',
        employeeId: 'EMP-ACC-094',
        department: 'Accounts & Financial Operations',
        branch: 'Global Motors Pty Ltd (Sydney HQ)',
        location: 'Level 4, 100 Miller St, Sydney NSW 2000',
        approvalLimit: '250000',
        signoffLevel: 'Level 3 Executive',
        joinedDate: '15 March 2021',
        status: 'Active',
        twoFactorEnabled: true,
        emailNotifications: {
            payrollDisbursements: true,
            highValueInvoices: true,
            gstPaygReminders: true,
            contractorClaims: true
        }
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ ...profileData });
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        setProfileData({ ...editForm });
        setIsEditing(false);
        showToast('Profile information updated successfully!');
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            showToast('New passwords do not match!');
            return;
        }
        setShowPasswordModal(false);
        setPasswords({ current: '', new: '', confirm: '' });
        showToast('Security password changed successfully!');
    };

    const toggleNotification = (key) => {
        setProfileData((prev) => ({
            ...prev,
            emailNotifications: {
                ...prev.emailNotifications,
                [key]: !prev.emailNotifications[key]
            }
        }));
        showToast('Notification preference saved.');
    };

    return (
        <div className="p-4 sm:p-6 bg-[#f8fafc] min-h-screen font-sans text-left">
            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-[9999] bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in duration-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Header Banner */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden mb-6">
                <div className="h-28 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                </div>

                <div className="p-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-2xl bg-slate-900 border-4 border-white shadow-md text-amber-400 font-black text-2xl flex items-center justify-center">
                                JS
                            </div>
                            <button
                                onClick={() => showToast('Avatar upload dialog opened.')}
                                className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-lg shadow-xs cursor-pointer transition-colors"
                                title="Change Avatar"
                            >
                                <Camera className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                    {profileData.firstName} {profileData.lastName}
                                </h1>
                                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3" />
                                    <span>{profileData.status}</span>
                                </span>
                            </div>
                            <p className="text-xs font-bold text-slate-500 mt-0.5">{profileData.title}</p>
                            <div className="flex items-center gap-4 text-[11px] text-slate-400 font-semibold mt-1">
                                <span>ID: {profileData.employeeId}</span>
                                <span>•</span>
                                <span>Joined {profileData.joinedDate}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 self-stretch sm:self-auto">
                        <button
                            onClick={() => {
                                setEditForm({ ...profileData });
                                setIsEditing(true);
                            }}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-2xs transition-all"
                        >
                            <Edit className="w-3.5 h-3.5 text-slate-500" />
                            <span>Edit Profile</span>
                        </button>

                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-xs transition-all"
                        >
                            <Lock className="w-3.5 h-3.5 text-slate-400" />
                            <span>Change Password</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Grid Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column (8 Cols): Personal & Financial Details */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Account Details Card */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <User className="w-4 h-4 text-blue-600" />
                                <span>Personal &amp; Contact Details</span>
                            </h2>
                            <span className="text-[11px] font-semibold text-slate-400">Verified Employee Record</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/60">
                                <span className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Full Name</span>
                                <span className="font-extrabold text-slate-900 text-sm block">
                                    {profileData.firstName} {profileData.lastName}
                                </span>
                            </div>

                            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/60">
                                <span className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Email Address</span>
                                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{profileData.email}</span>
                                </span>
                            </div>

                            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/60">
                                <span className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Phone &amp; Extension</span>
                                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{profileData.phone} ({profileData.extension})</span>
                                </span>
                            </div>

                            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/60">
                                <span className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Department / Branch</span>
                                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{profileData.branch}</span>
                                </span>
                            </div>

                            <div className="md:col-span-2 p-3 bg-slate-50/70 rounded-xl border border-slate-200/60">
                                <span className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Primary Office Location</span>
                                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{profileData.location}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Financial Authorizations Card */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-emerald-600" />
                                <span>Financial &amp; Sign-off Limits</span>
                            </h2>
                            <span className="bg-blue-50 text-blue-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                                Executive Level
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mb-4">
                            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/60">
                                <span className="text-[10px] font-extrabold text-emerald-700 uppercase block">Single Payment Approval Limit</span>
                                <span className="text-lg font-black text-emerald-900 mt-1 block">
                                    ${parseInt(profileData.approvalLimit).toLocaleString('en-US')}.00
                                </span>
                            </div>

                            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/60">
                                <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Sign-off Clearance</span>
                                <span className="text-sm font-black text-slate-900 mt-1 block">
                                    {profileData.signoffLevel}
                                </span>
                            </div>

                            <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/60">
                                <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Disbursement Batch Authority</span>
                                <span className="text-sm font-black text-slate-900 mt-1 block">
                                    Unlimited ABA
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2 text-xs">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Authorized Modules</span>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    'Employee Payroll Batch Release',
                                    'Contractor Claim Approvals',
                                    'GST & PAYG Lodgement Authority',
                                    'High-Value Supplier Invoices',
                                    'Banking ABA Direct Credit',
                                    'Financial P&L Auditing'
                                ].map((mod, i) => (
                                    <span key={i} className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                        <span>{mod}</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (4 Cols): Security & Notifications */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Security & Access Card */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5">
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-purple-600" />
                            <span>Security &amp; Auth</span>
                        </h2>

                        <div className="space-y-3 text-xs">
                            <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Key className="w-4 h-4 text-purple-600" />
                                    <div>
                                        <span className="font-bold text-slate-900 block">Two-Factor Auth (2FA)</span>
                                        <span className="text-[10px] text-slate-500 font-semibold">Hardware Key + App</span>
                                    </div>
                                </div>
                                <span className="bg-emerald-100 text-emerald-700 font-black text-[10px] px-2 py-0.5 rounded-full">
                                    ENABLED
                                </span>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    <div>
                                        <span className="font-bold text-slate-900 block">Last Password Change</span>
                                        <span className="text-[10px] text-slate-500 font-semibold">30 days ago</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                                <span className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Active Session Info</span>
                                <div className="text-[11px] font-bold text-slate-800">110.142.45.12 (Sydney, AU)</div>
                                <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Chrome Browser • Windows OS</div>
                            </div>
                        </div>
                    </div>

                    {/* Email Notification Preferences Card */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5">
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Bell className="w-4 h-4 text-amber-500" />
                            <span>Email Alerts</span>
                        </h2>

                        <div className="space-y-3 text-xs">
                            {[
                                { key: 'payrollDisbursements', title: 'Payroll Disbursements', desc: 'Alert when employee pay run is ready' },
                                { key: 'highValueInvoices', title: 'High-Value Invoices', desc: 'Alert for invoices exceeding $50k' },
                                { key: 'gstPaygReminders', title: 'GST & PAYG Deadlines', desc: 'Tax lodging reminders' },
                                { key: 'contractorClaims', title: 'Contractor Pay Claims', desc: 'New claim submissions' }
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                                    <div>
                                        <span className="font-bold text-slate-900 block">{item.title}</span>
                                        <span className="text-[10px] text-slate-400 font-semibold block">{item.desc}</span>
                                    </div>

                                    <button
                                        onClick={() => toggleNotification(item.key)}
                                        className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${profileData.emailNotifications[item.key] ? 'bg-blue-600' : 'bg-slate-300'
                                            }`}
                                    >
                                        <span
                                            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${profileData.emailNotifications[item.key] ? 'left-4.5' : 'left-0.5'
                                                }`}
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* EDIT PROFILE MODAL */}
            {isEditing && (
                <div className="fixed inset-0 z-[999] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 text-left animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                            <h3 className="text-base font-black text-slate-900">Edit Profile Information</h3>
                            <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-700 text-lg cursor-pointer">✕</button>
                        </div>

                        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-semibold">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-slate-700 font-extrabold block mb-1">First Name</label>
                                    <input
                                        type="text"
                                        value={editForm.firstName}
                                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-slate-700 font-extrabold block mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        value={editForm.lastName}
                                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-slate-700 font-extrabold block mb-1">Title / Role</label>
                                <input
                                    type="text"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-slate-700 font-extrabold block mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-slate-700 font-extrabold block mb-1">Phone</label>
                                    <input
                                        type="text"
                                        value={editForm.phone}
                                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-slate-700 font-extrabold block mb-1">Office Location</label>
                                <input
                                    type="text"
                                    value={editForm.location}
                                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black shadow-xs cursor-pointer"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* CHANGE PASSWORD MODAL */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-[999] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 text-left animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                            <h3 className="text-base font-black text-slate-900">Change Password</h3>
                            <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-slate-700 text-lg cursor-pointer">✕</button>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs font-semibold">
                            <div>
                                <label className="text-slate-700 font-extrabold block mb-1">Current Password</label>
                                <input
                                    type="password"
                                    value={passwords.current}
                                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-slate-700 font-extrabold block mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={passwords.new}
                                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-slate-700 font-extrabold block mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwords.confirm}
                                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black shadow-xs cursor-pointer"
                                >
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
