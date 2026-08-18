import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, Mail, Phone, Building2, Shield,
  Check, X, UserPlus, Edit3, Trash2, Eye, EyeOff,
  LogIn, AlertTriangle, Filter, ChevronDown, Loader2
} from 'lucide-react';
import api from '../../services/api';

/* ─── Role badge colors ─── */
const ROLE_COLORS = {
  'Super Admin':       'bg-purple-100 text-purple-700 border-purple-200',
  'Platform Owner':    'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
  'Platform Admin':    'bg-blue-100 text-blue-700 border-blue-200',
  'Sales Rep':         'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Onboarding':        'bg-orange-100 text-orange-700 border-orange-200',
  'Support Agent':     'bg-teal-100 text-teal-700 border-teal-200',
  'Platform Finance':  'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Technical Support': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  'Auditor':           'bg-slate-100 text-slate-700 border-slate-200',
};

const STATUS_COLORS = {
  ACTIVE:    'bg-emerald-50 text-emerald-600 border-emerald-200',
  SUSPENDED: 'bg-rose-50 text-rose-600 border-rose-200',
  PENDING:   'bg-amber-50 text-amber-600 border-amber-200',
};

const AVATAR_COLORS = [
  '#7c3aed','#1d4ed8','#d97706','#059669','#be185d',
  '#0891b2','#dc2626','#4f46e5','#0369a1','#15803d',
];

const ROLES = [
  'Super Admin',
  'Platform Owner',
  'Platform Admin',
  'Sales Rep',
  'Onboarding',
  'Support Agent',
  'Platform Finance',
  'Technical Support',
  'Auditor'
];

const formatRole = (roleStr) => {
  if (roleStr === 'SALES') return 'Sales Rep';
  return roleStr.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
};

const mapRoleToApi = (roleLabel) => {
  if (roleLabel === 'Sales Rep') return 'SALES';
  return roleLabel.toUpperCase().replace(/ /g, '_');
};

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers]     = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [showAddModal, setShowAddModal]   = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(null);
  const [toast, setToast]     = useState('');
  const [form, setForm]       = useState({ name:'', email:'', phone:'', role:'Platform Admin', company:'', status:'ACTIVE' });

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/users');
      if (res.data?.success) {
        const platformStaffRoles = [
          'Super Admin', 'Platform Owner', 'Platform Admin', 'Sales Rep',
          'Onboarding', 'Support Agent', 'Platform Finance', 'Technical Support', 'Auditor'
        ];
        const allUsers = res.data.data.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone || 'N/A',
          role: formatRole(u.role),
          company: u.company?.name || 'Platform Level',
          status: u.status || 'ACTIVE',
          lastLogin: u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Never',
          created: new Date(u.createdAt).toLocaleDateString()
        }));
        setUsers(allUsers.filter(u => platformStaffRoles.includes(u.role)));
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
      notify('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const openAdd = () => {
    setForm({ name: '', email: 'sales@hero.com', phone: '', role: 'Sales (Platform CRM & Leads)', company: '', status: 'ACTIVE', password: '' });
    setShowAddModal(true);
  };

  const openEdit = (user, e) => {
    e.stopPropagation();
    setForm({ name: user.name, email: user.email, phone: user.phone, role: user.role, company: user.company, status: user.status });
    setShowEditModal(user);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await api.post('/users', {
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        role: mapRoleToApi(form.role),
        status: form.status
      });
      if (res.data?.success) {
        setShowAddModal(false);
        notify(`User "${form.name}" added!`);
        fetchUsers();
      }
    } catch (err) {
      notify(err.response?.data?.error?.message || 'Error adding user.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await api.put(`/users/${showEditModal.id}`, {
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        role: mapRoleToApi(form.role),
        status: form.status
      });
      if (res.data?.success) {
        setShowEditModal(null);
        notify(`User "${form.name}" updated!`);
        fetchUsers();
      }
    } catch (err) {
      notify(err.response?.data?.error?.message || 'Error updating user.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const res = await api.delete(`/users/${showDeleteModal.id}`);
      if (res.status === 204 || res.data?.success) {
        notify(`User "${showDeleteModal.name}" deleted.`);
        setShowDeleteModal(null);
        setShowDetailModal(null);
        fetchUsers();
      }
    } catch (err) {
      notify(err.response?.data?.error?.message || 'Error deleting user.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginAs = (user, e) => {
    e.stopPropagation();
    const routes = {
      'Super Admin': '/admin/dashboard',
      'Company Admin': '/company-admin/command-centre',
      'Sales Rep': '/sales/dashboard',
      'Dispatcher': '/dispatcher/command-center',
      'Driver': '/driver/dashboard',
      'Warehouse Manager': '/warehouse/dashboard',
      'Yard Attendant': '/yard/dashboard',
      'Accounts Manager': '/accounts/dashboard',
      'Customer': '/customer/dashboard',
    };
    localStorage.setItem('hero_session', JSON.stringify({ name: user.name, email: user.email, role: user.role, company: user.company }));
    notify(`Logging in as ${user.name}...`);
    setTimeout(() => navigate(routes[user.role] || '/admin/dashboard'), 800);
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.company.toLowerCase().includes(q);
    const matchR = roleFilter === 'All Roles' || u.role === roleFilter;
    return matchQ && matchR;
  });

  const inputCls = "w-full border border-slate-200 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 bg-slate-50 focus:outline-none transition-all";
  const labelCls = "block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5";



  return (
    <div className="flex-grow bg-[#F8FAFC] p-4 sm:p-6 overflow-y-auto w-full text-left font-sans min-h-screen">

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl z-[9999] flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-black text-slate-900">Platform Users</h1>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">{users.length} Platform Staff Users</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-brand-500 hover:bg-[#f5c800] text-black font-black text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Add Platform Staff
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search users by name, email, company..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:border-amber-400 transition-all shadow-xs"
          />
        </div>
        <select
          value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          className="border border-slate-200 rounded-xl px-4 py-2.5 bg-white text-sm font-bold text-slate-700 focus:outline-none focus:border-amber-400 cursor-pointer shadow-xs"
        >
          <option value="All Roles">All Roles</option>
          <option value="Super Admin">Super Admin</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* ─── CARD GRID ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-400 font-semibold flex justify-center items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading users...
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 font-semibold">
            No users found.
          </div>
        ) : (
          filtered.map((user, idx) => {
            const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
            const initial = user.name.charAt(0).toUpperCase();
          const roleCls = ROLE_COLORS[user.role] || 'bg-slate-100 text-slate-600 border-slate-200';
          const statusCls = STATUS_COLORS[user.status] || STATUS_COLORS.PENDING;

          return (
            <div
              key={user.id}
              onClick={() => setShowDetailModal(user)}
              className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer overflow-hidden group"
            >
              {/* Top color strip */}
              <div className="h-1 w-full" style={{ background: avatarColor }} />

              <div className="p-5">
                {/* Avatar + Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-sm"
                    style={{ background: avatarColor }}>
                    {initial}
                  </div>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${statusCls}`}>
                    {user.status}
                  </span>
                </div>

                {/* Name + ID */}
                <div className="mb-1">
                  <div className="font-black text-slate-900 text-sm leading-tight truncate">{user.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono font-semibold mt-0.5">{user.id}</div>
                </div>

                {/* Role badge */}
                <span className={`inline-flex items-center text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider mb-3 ${roleCls}`}>
                  {user.role}
                </span>

                {/* Company */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold truncate mb-1">
                  <Building2 className="w-3 h-3 flex-shrink-0 text-slate-400" />
                  <span className="truncate">{user.company || '—'}</span>
                </div>

                {/* Email */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium truncate mb-4">
                  <Mail className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => handleLoginAs(user, e)}
                    className="flex-1 flex items-center justify-center gap-1 text-[10px] font-black py-2 rounded-xl text-white transition-all cursor-pointer"
                    style={{ background: avatarColor }}
                    title="Login as this user"
                  >
                    <LogIn className="w-3 h-3" /> Login As
                  </button>
                  <button
                    onClick={(e) => openEdit(user, e)}
                    className="w-8 h-8 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 flex items-center justify-center transition-all cursor-pointer"
                    title="Edit"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowDeleteModal(user); }}
                    className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center justify-center transition-all cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  </button>
                </div>
              </div>
            </div>
          );
        })
        )}

        {/* ── Add New User Card ── */}
        <div
          onClick={openAdd}
          className="bg-white rounded-2xl border-2 border-dashed border-slate-200 hover:border-amber-300 hover:bg-amber-50/20 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 min-h-[240px] group"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-50 group-hover:bg-amber-100 border-2 border-dashed border-amber-200 group-hover:border-amber-400 flex items-center justify-center transition-all">
            <Plus className="w-8 h-8 text-amber-400 group-hover:text-amber-600 transition-all" />
          </div>
          <div className="text-center px-4">
            <div className="font-black text-slate-500 group-hover:text-amber-600 text-sm transition-all">New User</div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">Click here to add New User</div>
          </div>
        </div>

      </div>

      {/* ══ USER DETAIL MODAL ══ */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4 overflow-y-auto" onClick={() => setShowDetailModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl my-auto" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="font-black text-slate-900 text-base">User Profile</h2>
              <button onClick={() => setShowDetailModal(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-5">
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-sm"
                  style={{ background: AVATAR_COLORS[users.findIndex(u => u.id === showDetailModal.id) % AVATAR_COLORS.length] }}>
                  {showDetailModal.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-black text-slate-900 text-base">{showDetailModal.name}</div>
                  <div className="text-xs font-mono text-slate-400 font-semibold">{showDetailModal.id}</div>
                  <span className={`inline-flex items-center text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider mt-1 ${ROLE_COLORS[showDetailModal.role] || ''}`}>
                    {showDetailModal.role}
                  </span>
                </div>
              </div>
              {/* Details grid */}
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Email', value: showDetailModal.email, icon: <Mail className="w-3.5 h-3.5" /> },
                  { label: 'Phone', value: showDetailModal.phone, icon: <Phone className="w-3.5 h-3.5" /> },
                  { label: 'Company', value: showDetailModal.company, icon: <Building2 className="w-3.5 h-3.5" /> },
                  { label: 'Status', value: showDetailModal.status, icon: <Shield className="w-3.5 h-3.5" /> },
                  { label: 'Last Login', value: showDetailModal.lastLogin, icon: <LogIn className="w-3.5 h-3.5" /> },
                  { label: 'Created', value: showDetailModal.created, icon: <Plus className="w-3.5 h-3.5" /> },
                ].map(row => (
                  <div key={row.label} className="flex items-center gap-3 py-2 border-b border-slate-50">
                    <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">{row.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{row.label}</div>
                      <div className="font-semibold text-slate-800 text-xs truncate">{row.value || '—'}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Actions */}
              <div className="flex gap-2 mt-5">
                <button onClick={(e) => handleLoginAs(showDetailModal, e)}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black cursor-pointer flex items-center justify-center gap-1.5 transition-all">
                  <LogIn className="w-3.5 h-3.5" /> Login As
                </button>
                <button onClick={(e) => { openEdit(showDetailModal, e); setShowDetailModal(null); }}
                  className="flex-1 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-black cursor-pointer flex items-center justify-center gap-1.5 transition-all">
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => setShowDeleteModal(showDetailModal)}
                  className="py-2.5 px-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-black cursor-pointer flex items-center justify-center gap-1.5 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ ADD MODAL ══ */}
      {showAddModal && <FormModal title="Add New User" onSubmit={handleAddSubmit} onClose={() => setShowAddModal(false)} form={form} setForm={setForm} />}

      {/* ══ EDIT MODAL ══ */}
      {showEditModal && <FormModal title="Edit User" onSubmit={handleEditSubmit} onClose={() => setShowEditModal(null)} form={form} setForm={setForm} />}

      {/* ══ DELETE CONFIRM ══ */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center my-auto">
            <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="font-black text-slate-900 text-lg mb-2">Delete User?</h3>
            <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 mb-4">
              <div className="font-black text-slate-900">{showDeleteModal.name}</div>
              <div className="text-xs text-slate-400 mt-0.5">{showDeleteModal.role} · {showDeleteModal.id}</div>
            </div>
            <p className="text-xs text-rose-600 font-bold bg-rose-50 border border-rose-100 rounded-lg px-3 py-2 mb-5 flex items-center justify-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5" /> This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 rounded-xl text-sm font-black text-white cursor-pointer transition-all">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const FormModal = ({ title, onSubmit, onClose, form, setForm }) => {
  const inputCls = "w-full border border-slate-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-100 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 bg-white focus:outline-none transition-all placeholder:text-slate-300";
  const labelCls = "block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5";

  const getRoleLabel = () => {
    if (form.role.includes('Sales')) return 'Sales';
    if (form.role.includes('Super')) return 'Super Admin';
    return form.role.split(' ')[0] || 'Staff';
  };

  const modalTitle = title.includes('Add') 
    ? `Add Platform Staff (${getRoleLabel()})` 
    : `Edit Platform Staff (${getRoleLabel()})`;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl my-auto text-left overflow-hidden animate-fade-in">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-black text-slate-900 text-base sm:text-lg flex items-center gap-2 tracking-tight">
            <UserPlus className="w-4 h-4 text-purple-600 shrink-0" />
            <span>{modalTitle}</span>
          </h2>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL FORM */}
        <form onSubmit={onSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            
            {/* FULL NAME */}
            <div>
              <label className={labelCls}>FULL NAME *</label>
              <input 
                required 
                className={inputCls} 
                placeholder="e.g. Sales Manager" 
                value={form.name} 
                onChange={e => setForm({ ...form, name: e.target.value })} 
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className={labelCls}>EMAIL (LOGIN USERNAME) *</label>
              <input 
                required 
                type="email" 
                className={inputCls} 
                placeholder="sales@hero.com" 
                value={form.email} 
                onChange={e => setForm({ ...form, email: e.target.value })} 
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className={labelCls}>PASSWORD *</label>
              <input 
                required={title.includes('Add')}
                type="password" 
                className={inputCls} 
                placeholder="••••••••••••" 
                value={form.password || ''} 
                onChange={e => setForm({ ...form, password: e.target.value })} 
              />
            </div>

            {/* PHONE & STATUS */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>PHONE</label>
                <input 
                  className={inputCls} 
                  placeholder="+1 555-0000" 
                  value={form.phone} 
                  onChange={e => setForm({ ...form, phone: e.target.value })} 
                />
              </div>
              <div>
                <label className={labelCls}>STATUS</label>
                <select 
                  className={`${inputCls} cursor-pointer`} 
                  value={form.status} 
                  onChange={e => setForm({ ...form, status: e.target.value })}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>
            </div>

            {/* PLATFORM ROLE */}
            <div>
              <label className={labelCls}>PLATFORM ROLE *</label>
              <select 
                required 
                className={`${inputCls} cursor-pointer border-amber-400 ring-1 ring-amber-200 font-bold`} 
                value={form.role} 
                onChange={e => setForm({ ...form, role: e.target.value })}
              >
                <option value="Sales (Platform CRM & Leads)">Sales (Platform CRM & Leads)</option>
                <option value="Super Admin (Platform Owner)">Super Admin (Platform Owner)</option>
              </select>
            </div>

          </div>

          {/* FOOTER BUTTONS */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] rounded-xl text-xs font-extrabold text-slate-900 cursor-pointer shadow-xs transition-all"
            >
              {title.includes('Add') ? 'Add Platform Staff' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

