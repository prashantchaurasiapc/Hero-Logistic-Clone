import React, { useState } from 'react';
import {
  Building, Users, Shield, Lock, Clock, Plus, Search, Edit, MoreHorizontal,
  Check, X, Key, ShieldCheck, Laptop, FileText, ChevronRight, Star, ArrowRight,
  RefreshCw, Mail, Phone, MapPin, AlertCircle, Trash2, UserPlus, UserCheck, UserX,
  CheckCircle2, XCircle, ChevronLeft, ChevronsLeft, ChevronsRight, HelpCircle, Eye
} from 'lucide-react';

export default function CustomerSettings() {
  // Toast state
  const [toastMsg, setToastMsg] = useState('');
  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Search & Filter State for Users
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Interactive Users Data State
  const [usersList, setUsersList] = useState([
    { id: 1, name: 'John Smith', isYou: true, role: 'Customer Admin', roleBg: 'bg-purple-100 text-purple-700 border-purple-200', email: 'john.smith@abctransport.com.au', phone: '0400 123 456', status: 'Active', lastLogin: '29 May 2025 10:15 AM', bg: 'bg-purple-600', avatar: 'JS' },
    { id: 2, name: 'Mary Williams', isYou: false, role: 'Booking User', roleBg: 'bg-blue-100 text-blue-700 border-blue-200', email: 'mary.williams@abctransport.com.au', phone: '0411 234 567', status: 'Active', lastLogin: '29 May 2025 09:42 AM', bg: 'bg-teal-600', avatar: 'MW' },
    { id: 3, name: 'Alex Rogers', isYou: false, role: 'Accounts User', roleBg: 'bg-emerald-100 text-emerald-700 border-emerald-200', email: 'alex.rogers@abctransport.com.au', phone: '0412 345 678', status: 'Active', lastLogin: '28 May 2025 04:12 PM', bg: 'bg-amber-600', avatar: 'AR' },
    { id: 4, name: 'Mark Miller', isYou: false, role: 'Viewer', roleBg: 'bg-slate-100 text-slate-700 border-slate-200', email: 'mark.miller@abctransport.com.au', phone: '0413 456 789', status: 'Active', lastLogin: '28 May 2025 11:30 AM', bg: 'bg-indigo-600', avatar: 'MM' },
    { id: 5, name: 'Lisa Patel', isYou: false, role: 'Booking User', roleBg: 'bg-blue-100 text-blue-700 border-blue-200', email: 'lisa.patel@abctransport.com.au', phone: '0414 567 890', status: 'Active', lastLogin: '26 May 2025 02:10 PM', bg: 'bg-rose-600', avatar: 'LP' },
    { id: 6, name: 'Tom Harris', isYou: false, role: 'Viewer', roleBg: 'bg-slate-100 text-slate-700 border-slate-200', email: 'tom.harris@abctransport.com.au', phone: '0415 678 901', status: 'Inactive', lastLogin: '-', bg: 'bg-slate-500', avatar: 'TH' }
  ]);

  // Dropdown & Modal States
  const [openUserDropdownId, setOpenUserDropdownId] = useState(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  // Form State for Add/Edit User
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Booking User',
    status: 'Active'
  });

  // Modal Handlers
  const handleOpenAddUserModal = () => {
    setUserForm({ name: '', email: '', phone: '', role: 'Booking User', status: 'Active' });
    setIsAddUserModalOpen(true);
  };

  const handleSaveAddUser = (e) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email) return;

    let roleBg = 'bg-blue-100 text-blue-700 border-blue-200';
    if (userForm.role === 'Customer Admin') roleBg = 'bg-purple-100 text-purple-700 border-purple-200';
    if (userForm.role === 'Accounts User') roleBg = 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (userForm.role === 'Viewer') roleBg = 'bg-slate-100 text-slate-700 border-slate-200';

    const initials = userForm.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'US';
    const bgColors = ['bg-blue-600', 'bg-purple-600', 'bg-teal-600', 'bg-amber-600', 'bg-rose-600'];
    const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];

    const newUser = {
      id: Date.now(),
      name: userForm.name,
      isYou: false,
      role: userForm.role,
      roleBg: roleBg,
      email: userForm.email,
      phone: userForm.phone || '0400 000 000',
      status: userForm.status,
      lastLogin: 'Just now',
      bg: randomBg,
      avatar: initials
    };

    setUsersList(prev => [newUser, ...prev]);
    setIsAddUserModalOpen(false);
    triggerToast(`User ${userForm.name} added successfully!`);
  };

  const handleOpenEditUserModal = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status
    });
  };

  const handleSaveEditUser = (e) => {
    e.preventDefault();
    if (!editingUser) return;

    let roleBg = 'bg-blue-100 text-blue-700 border-blue-200';
    if (userForm.role === 'Customer Admin') roleBg = 'bg-purple-100 text-purple-700 border-purple-200';
    if (userForm.role === 'Accounts User') roleBg = 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (userForm.role === 'Viewer') roleBg = 'bg-slate-100 text-slate-700 border-slate-200';

    setUsersList(prev => prev.map(u => u.id === editingUser.id ? {
      ...u,
      name: userForm.name,
      email: userForm.email,
      phone: userForm.phone,
      role: userForm.role,
      roleBg: roleBg,
      status: userForm.status
    } : u));

    setEditingUser(null);
    triggerToast(`User ${userForm.name} updated successfully!`);
  };

  const handleToggleUserStatus = (userId) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === 'Active' ? 'Inactive' : 'Active';
        triggerToast(`User status changed to ${newStatus}`);
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const handleDeleteUser = (userId, userName) => {
    if (window.confirm(`Are you sure you want to remove user "${userName}"?`)) {
      setUsersList(prev => prev.filter(u => u.id !== userId));
      triggerToast(`User ${userName} removed.`);
    }
  };

  // Filtered Users List
  const filteredUsers = usersList.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Company Account State & Edit Modal
  const [companyAccount, setCompanyAccount] = useState({
    name: 'ABC Transport Solutions',
    abn: '12 345 678 901',
    address: '123 Logistics Way, Melbourne VIC 3000 Australia',
    primaryContactName: 'John Smith',
    primaryContactEmail: 'john.smith@abctransport.com.au',
    primaryContactPhone: '0400 123 456',
    billingEmail: 'accounts@abctransport.com.au',
    phone: '1300 437 676'
  });
  const [isEditCompanyModalOpen, setIsEditCompanyModalOpen] = useState(false);

  // Notification Preferences State & Edit Modal
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    booking: true,
    delivery: true,
    marketing: false
  });
  const [isEditNotificationsModalOpen, setIsEditNotificationsModalOpen] = useState(false);

  // Security & Access State
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-800 text-left font-sans p-4 sm:p-6 space-y-6">
      
      {/* Click Outside Backdrop for Dropdowns */}
      {openUserDropdownId && (
        <div className="fixed inset-0 z-40" onClick={() => setOpenUserDropdownId(null)} />
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[999999] bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-2xl animate-fade-in border border-slate-700 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* =========================================================================
         BREADCRUMB & HEADER
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mb-1">
            <span>Home</span>
            <ChevronRight size={10} />
            <span>Customer Portal</span>
            <ChevronRight size={10} />
            <span className="text-slate-700 font-extrabold">Account & Users</span>
          </div>

          {/* Title & Bookmark */}
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Account & Users
            </h1>
            <button 
              onClick={() => triggerToast("Page bookmarked!")}
              className="p-1 text-slate-400 hover:text-amber-500 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <Star size={16} />
            </button>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage your company account, users, permissions and preferences.
          </p>
        </div>

        {/* Top Right Action Button */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => triggerToast("More actions menu opened.")}
            className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-700 rounded-xl shadow-2xs cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <span>More Actions</span>
            <span className="text-[10px]">▼</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
         TOP METRICS CARDS (5 Cards Grid)
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* Card 1: Company Account */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold shrink-0">
              <Building size={16} />
            </div>
            <div className="overflow-hidden">
              <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider block">COMPANY ACCOUNT</span>
              <h3 className="text-xs font-black text-slate-900 truncate leading-tight mt-0.5">{companyAccount.name}</h3>
            </div>
          </div>
          <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <button onClick={() => setIsEditCompanyModalOpen(true)} className="font-extrabold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer">
              View account details <ArrowRight size={10} />
            </button>
          </div>
        </div>

        {/* Card 2: Users */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center font-bold shrink-0">
              <Users size={16} />
            </div>
            <div>
              <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider block">USERS</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-lg font-black text-slate-900 leading-none">{usersList.length}</span>
                <span className="text-[10px] font-bold text-slate-500">
                  {usersList.filter(u => u.status === 'Active').length} Active • {usersList.filter(u => u.status === 'Inactive').length} Inactive
                </span>
              </div>
            </div>
          </div>
          <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <button onClick={handleOpenAddUserModal} className="font-extrabold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer">
              Manage users <ArrowRight size={10} />
            </button>
          </div>
        </div>

        {/* Card 3: Roles */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold shrink-0">
              <Shield size={16} />
            </div>
            <div>
              <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider block">ROLES</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-lg font-black text-slate-900 leading-none">4</span>
                <span className="text-[9.5px] font-bold text-slate-500 truncate">Admin, Booking, Accounts, Viewer</span>
              </div>
            </div>
          </div>
          <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <button onClick={() => triggerToast("Roles & permissions panel active")} className="font-extrabold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 cursor-pointer">
              View roles & permissions <ArrowRight size={10} />
            </button>
          </div>
        </div>

        {/* Card 4: Security */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center font-bold shrink-0">
              <Lock size={16} />
            </div>
            <div>
              <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider block">SECURITY</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xs font-black text-emerald-600 leading-none">2FA Enabled</span>
              </div>
              <span className="text-[9.5px] text-slate-400 block font-medium mt-0.5">Last login: 29 May 2025, 10:15 AM</span>
            </div>
          </div>
          <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <button onClick={() => triggerToast("Security settings opened")} className="font-extrabold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer">
              Security settings <ArrowRight size={10} />
            </button>
          </div>
        </div>

        {/* Card 5: Activity Log */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center font-bold shrink-0">
              <Clock size={16} />
            </div>
            <div>
              <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider block">ACTIVITY LOG</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-lg font-black text-slate-900 leading-none">128</span>
                <span className="text-[10px] font-bold text-slate-500">Logins & actions (30 days)</span>
              </div>
            </div>
          </div>
          <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <button onClick={() => triggerToast("Activity log view active")} className="font-extrabold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer">
              View activity <ArrowRight size={10} />
            </button>
          </div>
        </div>

      </div>

      {/* =========================================================================
         MAIN WORKSPACE ROW 1 (Portal Users Table + User Permissions Matrix)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN (7 Cols): PORTAL USERS Table */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-4 space-y-3.5">
          
          {/* Header & Add User Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">PORTAL USERS</h2>
              <span className="px-2 py-0.5 bg-blue-600 text-white font-extrabold text-[10px] rounded-full">
                {filteredUsers.length}
              </span>
            </div>
            <button 
              onClick={handleOpenAddUserModal}
              className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus size={14} />
              <span>Add User</span>
            </button>
          </div>

          {/* Search Bar & Status Filter */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-blue-400 cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-2">Role</th>
                  <th className="py-2.5 px-2">Email</th>
                  <th className="py-2.5 px-2">Phone</th>
                  <th className="py-2.5 px-2">Status</th>
                  <th className="py-2.5 px-2">Last Login</th>
                  <th className="py-2.5 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-400 text-xs font-semibold">
                      No matching users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Avatar & Name */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full ${user.bg} text-white font-extrabold text-[9px] flex items-center justify-center shrink-0`}>
                            {user.avatar}
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 text-[11.5px]">{user.name}</span>
                            {user.isYou && (
                              <span className="ml-1 text-[9.5px] font-bold text-slate-400">(You)</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-2.5 px-2 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded border text-[9.5px] font-extrabold ${user.roleBg}`}>
                          {user.role}
                        </span>
                      </td>

                      {/* Email */}
                      <td className="py-2.5 px-2 whitespace-nowrap">
                        <span className="text-[10.5px] font-medium text-slate-600">{user.email}</span>
                      </td>

                      {/* Phone */}
                      <td className="py-2.5 px-2 whitespace-nowrap">
                        <span className="text-[10.5px] font-mono text-slate-600">{user.phone}</span>
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-2 whitespace-nowrap">
                        <span className={`text-[10.5px] font-extrabold ${user.status === 'Active' ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {user.status}
                        </span>
                      </td>

                      {/* Last Login */}
                      <td className="py-2.5 px-2 whitespace-nowrap">
                        <span className="text-[10px] text-slate-500 font-semibold">{user.lastLogin}</span>
                      </td>

                      {/* Actions (Eye View & 3-dots Dropdown) */}
                      <td className="py-2.5 px-2 text-right whitespace-nowrap relative">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => setViewingUser(user)}
                            title="View User Details"
                            className="p-1 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                          >
                            <Eye size={13} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenUserDropdownId(openUserDropdownId === user.id ? null : user.id);
                            }}
                            title="More Options"
                            className="p-1 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer"
                          >
                            <MoreHorizontal size={13} />
                          </button>
                        </div>

                        {/* User Dropdown Menu */}
                        {openUserDropdownId === user.id && (
                          <div 
                            className="absolute right-0 top-8 z-50 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1 text-xs text-left animate-fade-in"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button 
                              onClick={() => { setOpenUserDropdownId(null); handleOpenEditUserModal(user); }}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-2 cursor-pointer"
                            >
                              <Edit size={13} className="text-blue-600" /> Edit Details
                            </button>
                            <button 
                              onClick={() => { setOpenUserDropdownId(null); handleToggleUserStatus(user.id); }}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-2 cursor-pointer"
                            >
                              {user.status === 'Active' ? <UserX size={13} className="text-amber-600" /> : <UserCheck size={13} className="text-emerald-600" />} 
                              {user.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                            </button>
                            <div className="my-1 border-t border-slate-100"></div>
                            <button 
                              onClick={() => { setOpenUserDropdownId(null); setDeletingUser(user); }}
                              className="w-full text-left px-3 py-1.5 hover:bg-rose-50 font-bold text-rose-600 flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 size={13} className="text-rose-500" /> Delete User
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold pt-1">
            <span>Showing 1 to {filteredUsers.length} of {usersList.length} users</span>
            <div className="flex items-center gap-1">
              <button className="px-2 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer">
                |&lt;
              </button>
              <button className="px-2 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer">
                &lt;
              </button>
              <button className="px-2.5 py-1 bg-[#2563EB] text-white font-bold rounded-lg shadow-2xs cursor-pointer">
                1
              </button>
              <button className="px-2 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer">
                &gt;
              </button>
              <button className="px-2 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 cursor-pointer">
                &gt;|
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (5 Cols): USER PERMISSIONS Matrix */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-4 space-y-3.5">
          
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">USER PERMISSIONS</h2>
            <button 
              onClick={() => triggerToast("Permission Matrix Edit Mode enabled.")}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              Edit
            </button>
          </div>

          {/* Permissions Matrix Table */}
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[9.5px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Permission</th>
                  <th className="py-2.5 px-1.5 text-center">Customer Admin</th>
                  <th className="py-2.5 px-1.5 text-center">Booking User</th>
                  <th className="py-2.5 px-1.5 text-center">Accounts User</th>
                  <th className="py-2.5 px-1.5 text-center">Viewer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px] font-semibold text-slate-700">
                {[
                  { perm: 'Create Bookings', admin: true, booking: true, accounts: false, viewer: false },
                  { perm: 'View & Track Loads', admin: true, booking: true, accounts: true, viewer: true },
                  { perm: 'View Documents & PODs', admin: true, booking: true, accounts: true, viewer: true },
                  { perm: 'View Invoices & Payments', admin: true, booking: false, accounts: true, viewer: false },
                  { perm: 'Make Payments', admin: true, booking: false, accounts: true, viewer: false },
                  { perm: 'Manage Company Users', admin: true, booking: false, accounts: false, viewer: false },
                  { perm: 'Manage Account Settings', admin: true, booking: false, accounts: false, viewer: false },
                  { perm: 'View Reports', admin: true, booking: true, accounts: true, viewer: true },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2 px-3 font-bold text-slate-900">{row.perm}</td>
                    <td className="py-2 px-1.5 text-center">
                      {row.admin ? <CheckCircle2 size={15} className="text-emerald-500 mx-auto" /> : <XCircle size={15} className="text-rose-400 mx-auto" />}
                    </td>
                    <td className="py-2 px-1.5 text-center">
                      {row.booking ? <CheckCircle2 size={15} className="text-emerald-500 mx-auto" /> : <XCircle size={15} className="text-rose-400 mx-auto" />}
                    </td>
                    <td className="py-2 px-1.5 text-center">
                      {row.accounts ? <CheckCircle2 size={15} className="text-emerald-500 mx-auto" /> : <XCircle size={15} className="text-rose-400 mx-auto" />}
                    </td>
                    <td className="py-2 px-1.5 text-center">
                      {row.viewer ? <CheckCircle2 size={15} className="text-emerald-500 mx-auto" /> : <XCircle size={15} className="text-rose-400 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* =========================================================================
         MAIN WORKSPACE ROW 2 (3 Cards Grid: Company Account, Preferences, Security)
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* CARD 1: COMPANY ACCOUNT */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-4 space-y-3.5">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">COMPANY ACCOUNT</h2>
            <button 
              onClick={() => setIsEditCompanyModalOpen(true)} 
              className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              Edit
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Company Name</span>
              <span className="font-extrabold text-slate-900 text-sm block mt-0.5">{companyAccount.name}</span>
            </div>

            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block">ABN</span>
              <span className="font-mono font-bold text-slate-800 block mt-0.5">{companyAccount.abn}</span>
            </div>

            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Address</span>
              <span className="font-semibold text-slate-700 block mt-0.5 leading-snug">{companyAccount.address}</span>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Primary Contact</span>
              <span className="font-extrabold text-slate-900 block mt-0.5">{companyAccount.primaryContactName}</span>
              <span className="text-[11px] text-slate-500 font-medium block">{companyAccount.primaryContactEmail}</span>
              <span className="text-[11px] font-mono text-slate-600 block">{companyAccount.primaryContactPhone}</span>
            </div>

            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Billing Email</span>
                <span className="text-[10.5px] font-bold text-slate-800 truncate block mt-0.5">{companyAccount.billingEmail}</span>
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Phone</span>
                <span className="text-[10.5px] font-mono font-bold text-slate-800 block mt-0.5">{companyAccount.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: NOTIFICATION PREFERENCES */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-4 space-y-3.5">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">NOTIFICATION PREFERENCES</h2>
            <button 
              onClick={() => setIsEditNotificationsModalOpen(true)} 
              className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              Edit
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {/* Preference 1: Email */}
            <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
              <div className="flex items-start gap-2">
                <Mail size={15} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-extrabold text-slate-900 block">Email Notifications</span>
                  <span className="text-[10px] text-slate-500 font-medium block leading-tight">Receive updates for bookings, loads, invoices and documents.</span>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9.5px] font-extrabold shrink-0 ${notifications.email ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-500 border border-rose-100'}`}>
                {notifications.email ? 'Enabled' : 'Disabled'}
              </span>
            </div>

            {/* Preference 2: SMS */}
            <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
              <div className="flex items-start gap-2">
                <Phone size={15} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-extrabold text-slate-900 block">SMS Notifications</span>
                  <span className="text-[10px] text-slate-500 font-medium block leading-tight">Receive SMS for important updates and alerts.</span>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9.5px] font-extrabold shrink-0 ${notifications.sms ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-500 border border-rose-100'}`}>
                {notifications.sms ? 'Enabled' : 'Disabled'}
              </span>
            </div>

            {/* Preference 3: Booking Updates */}
            <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-extrabold text-slate-900 block">Booking Updates</span>
                  <span className="text-[10px] text-slate-500 font-medium block leading-tight">Get notified when bookings are confirmed.</span>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9.5px] font-extrabold shrink-0 ${notifications.booking ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-500 border border-rose-100'}`}>
                {notifications.booking ? 'Enabled' : 'Disabled'}
              </span>
            </div>

            {/* Preference 4: Delivery Updates */}
            <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
              <div className="flex items-start gap-2">
                <FileText size={15} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-extrabold text-slate-900 block">Delivery Updates</span>
                  <span className="text-[10px] text-slate-500 font-medium block leading-tight">Get notified on load status and delivery.</span>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9.5px] font-extrabold shrink-0 ${notifications.delivery ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-500 border border-rose-100'}`}>
                {notifications.delivery ? 'Enabled' : 'Disabled'}
              </span>
            </div>

            {/* Preference 5: Marketing & Offers */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <Star size={15} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-extrabold text-slate-900 block">Marketing & Offers</span>
                  <span className="text-[10px] text-slate-500 font-medium block leading-tight">Receive news, tips and special offers.</span>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9.5px] font-extrabold shrink-0 ${notifications.marketing ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-500 border border-rose-100'}`}>
                {notifications.marketing ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>

        {/* CARD 3: SECURITY & ACCESS */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-4 space-y-3.5">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">SECURITY & ACCESS</h2>
            <button 
              onClick={() => triggerToast("Security settings opened")} 
              className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              Edit
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {/* Item 1: Change Password */}
            <div 
              onClick={() => setIsChangePasswordModalOpen(true)}
              className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Key size={16} className="text-blue-600" />
                <div>
                  <span className="font-extrabold text-slate-900 block leading-tight">Change Password</span>
                  <span className="text-[10px] text-slate-500 font-medium">Update your password regularly.</span>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-400" />
            </div>

            {/* Item 2: 2FA */}
            <div 
              onClick={() => {
                setIs2FAEnabled(!is2FAEnabled);
                triggerToast(is2FAEnabled ? "Two-Factor Authentication disabled" : "Two-Factor Authentication enabled");
              }}
              className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-emerald-600" />
                <div>
                  <span className="font-extrabold text-slate-900 block leading-tight">Two-Factor Authentication</span>
                  <span className="text-[10px] text-slate-500 font-medium">Protect your account with 2FA.</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded text-[9.5px] font-extrabold ${is2FAEnabled ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500'}`}>
                  {is2FAEnabled ? 'Enabled' : 'Disabled'}
                </span>
                <ChevronRight size={14} className="text-slate-400" />
              </div>
            </div>

            {/* Item 3: Active Sessions */}
            <div 
              onClick={() => triggerToast("Viewing 3 active sessions...")}
              className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Laptop size={16} className="text-purple-600" />
                <div>
                  <span className="font-extrabold text-slate-900 block leading-tight">Active Sessions</span>
                  <span className="text-[10px] text-slate-500 font-medium">Manage your active sessions.</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-700 text-xs">3 Active</span>
                <ChevronRight size={14} className="text-slate-400" />
              </div>
            </div>

            {/* Item 4: Login History */}
            <div 
              onClick={() => triggerToast("Opening login history log...")}
              className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Clock size={16} className="text-sky-600" />
                <div>
                  <span className="font-extrabold text-slate-900 block leading-tight">Login History</span>
                  <span className="text-[10px] text-slate-500 font-medium">View recent logins and activity.</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-blue-600 text-xs">View</span>
                <ChevronRight size={14} className="text-slate-400" />
              </div>
            </div>
          </div>
        </div>

      </div>



      {/* =========================================================================
         ADD / EDIT USER MODAL
         ========================================================================= */}
      {(isAddUserModalOpen || editingUser) && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => { setIsAddUserModalOpen(false); setEditingUser(null); }}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 text-left font-sans"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
                  {editingUser ? <Edit size={16} /> : <UserPlus size={16} />}
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {editingUser ? 'Edit User Record' : 'Add New Portal User'}
                  </h3>
                  <p className="text-[10.5px] text-slate-500 font-medium">
                    {editingUser ? `Updating information for ${editingUser.name}` : 'Invite a team member to Customer Portal'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => { setIsAddUserModalOpen(false); setEditingUser(null); }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={editingUser ? handleSaveEditUser : handleSaveAddUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={userForm.name}
                  onChange={e => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                <input 
                  type="email" 
                  required
                  placeholder="sarah.jenkins@abctransport.com.au"
                  value={userForm.email}
                  onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    placeholder="0400 123 456"
                    value={userForm.phone}
                    onChange={e => setUserForm({ ...userForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Portal Role</label>
                  <select 
                    value={userForm.role}
                    onChange={e => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-800 bg-white focus:outline-none focus:border-blue-400 cursor-pointer"
                  >
                    <option value="Customer Admin">Customer Admin</option>
                    <option value="Booking User">Booking User</option>
                    <option value="Accounts User">Accounts User</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Account Status</label>
                <select 
                  value={userForm.status}
                  onChange={e => setUserForm({ ...userForm, status: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-800 bg-white focus:outline-none focus:border-blue-400 cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => { setIsAddUserModalOpen(false); setEditingUser(null); }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  {editingUser ? 'Save Changes' : 'Invite User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         VIEW USER DETAILS MODAL
         ========================================================================= */}
      {viewingUser && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setViewingUser(null)}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-5 space-y-4 text-left font-sans"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-full ${viewingUser.bg} text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs`}>
                  {viewingUser.avatar}
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 leading-tight">{viewingUser.name}</h3>
                  <span className={`px-2 py-0.5 rounded border text-[9px] font-extrabold inline-block mt-0.5 ${viewingUser.roleBg}`}>
                    {viewingUser.role}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setViewingUser(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2">
                <div>
                  <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Email Address</span>
                  <span className="font-bold text-slate-800 text-xs block mt-0.5">{viewingUser.email}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                  <div>
                    <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Phone</span>
                    <span className="font-mono font-bold text-slate-800 block mt-0.5">{viewingUser.phone}</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Status</span>
                    <span className={`font-extrabold block mt-0.5 ${viewingUser.status === 'Active' ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {viewingUser.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between text-xs">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Last Login</span>
                <span className="font-bold text-slate-700">{viewingUser.lastLogin}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button 
                onClick={() => {
                  const userToEdit = viewingUser;
                  setViewingUser(null);
                  handleOpenEditUserModal(userToEdit);
                }}
                className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
              >
                <Edit size={13} /> Edit User
              </button>
              <button 
                onClick={() => setViewingUser(null)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
         DELETE USER CONFIRMATION MODAL
         ========================================================================= */}
      {deletingUser && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setDeletingUser(null)}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-5 space-y-4 text-left font-sans"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto text-xl">
                <Trash2 size={22} />
              </div>
              <h3 className="text-base font-black text-slate-900">Delete User Account?</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Are you sure you want to delete user <strong className="text-slate-800">{deletingUser.name}</strong> ({deletingUser.email})? This action cannot be undone.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={() => {
                  const name = deletingUser.name;
                  setUsersList(prev => prev.filter(u => u.id !== deletingUser.id));
                  setDeletingUser(null);
                  triggerToast(`User ${name} deleted successfully.`);
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
         EDIT COMPANY ACCOUNT MODAL
         ========================================================================= */}
      {isEditCompanyModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsEditCompanyModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 text-left font-sans"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
                  <Building size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Edit Company Account</h3>
                  <p className="text-[10.5px] text-slate-500 font-medium">Update primary corporate information</p>
                </div>
              </div>
              <button 
                onClick={() => setIsEditCompanyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setIsEditCompanyModalOpen(false); triggerToast("Company Account updated!"); }} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Company Name</label>
                <input 
                  type="text"
                  required
                  value={companyAccount.name}
                  onChange={e => setCompanyAccount({ ...companyAccount, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ABN / Registration Number</label>
                <input 
                  type="text"
                  required
                  value={companyAccount.abn}
                  onChange={e => setCompanyAccount({ ...companyAccount, abn: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Address</label>
                <input 
                  type="text"
                  required
                  value={companyAccount.address}
                  onChange={e => setCompanyAccount({ ...companyAccount, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Billing Email</label>
                  <input 
                    type="email"
                    required
                    value={companyAccount.billingEmail}
                    onChange={e => setCompanyAccount({ ...companyAccount, billingEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone</label>
                  <input 
                    type="text"
                    required
                    value={companyAccount.phone}
                    onChange={e => setCompanyAccount({ ...companyAccount, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsEditCompanyModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         EDIT NOTIFICATION PREFERENCES MODAL
         ========================================================================= */}
      {isEditNotificationsModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsEditNotificationsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 text-left font-sans"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
                  <Mail size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Notification Preferences</h3>
                  <p className="text-[10.5px] text-slate-500 font-medium">Toggle notification channels & alerts</p>
                </div>
              </div>
              <button 
                onClick={() => setIsEditNotificationsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { key: 'email', label: 'Email Notifications', desc: 'Updates for bookings, loads, invoices & PODs' },
                { key: 'sms', label: 'SMS Notifications', desc: 'Urgent delivery alerts and status SMS' },
                { key: 'booking', label: 'Booking Updates', desc: 'Instant confirmations on new load requests' },
                { key: 'delivery', label: 'Delivery Updates', desc: 'Live transit and milestone updates' },
                { key: 'marketing', label: 'Marketing & Offers', desc: 'News, platform tips and special offers' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="font-extrabold text-slate-900 block">{item.label}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{item.desc}</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={notifications[item.key]}
                    onChange={e => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>
              ))}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsEditNotificationsModalOpen(false)}
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
         CHANGE PASSWORD MODAL
         ========================================================================= */}
      {isChangePasswordModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsChangePasswordModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-5 space-y-4 text-left font-sans"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
                  <Key size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Change Password</h3>
                  <p className="text-[10.5px] text-slate-500 font-medium">Set a new secure password</p>
                </div>
              </div>
              <button 
                onClick={() => setIsChangePasswordModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setIsChangePasswordModalOpen(false); triggerToast("Password updated successfully!"); }} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Current Password *</label>
                <input 
                  type="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">New Password *</label>
                <input 
                  type="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Confirm New Password *</label>
                <input 
                  type="password"
                  required
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsChangePasswordModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
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
