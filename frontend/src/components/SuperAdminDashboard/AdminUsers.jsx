import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, Mail, Phone, Shield,
  Check, X, UserPlus, Edit3, Trash2, Eye, EyeOff,
  LogIn, AlertTriangle, Filter, ChevronDown, Loader2, Key
} from 'lucide-react';
import api from '../../services/api';

/* ─── Role badge colors ─── */
const ROLE_COLORS = {
  'Super Admin': 'bg-purple-100 text-purple-700 border-purple-200',
  'Sales':       'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Platform Admin': 'bg-blue-100 text-blue-700 border-blue-200',
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
  'Sales',
  'Super Admin'
];

const formatRole = (roleStr) => {
  if (roleStr === 'SALES') return 'Sales';
  if (roleStr === 'SUPER_ADMIN') return 'Super Admin';
  if (roleStr === 'PLATFORM_ADMIN') return 'Super Admin';
  return roleStr.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
};

const mapRoleToApi = (roleLabel) => {
  if (roleLabel === 'Sales' || roleLabel === 'Sales Rep') return 'SALES';
  if (roleLabel === 'Super Admin' || roleLabel === 'Platform Admin') return 'SUPER_ADMIN';
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
  const [form, setForm]       = useState({ name:'', email:'', password:'HeroPass@123', phone:'', role:'Sales', status:'ACTIVE' });

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/users');
      if (res.data?.success) {
        const platformStaffRoles = ['Super Admin', 'Sales', 'Platform Admin'];
        const allUsers = res.data.data.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone || 'N/A',
          role: formatRole(u.role),
          company: 'Platform Level',
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
    setForm({ name:'', email:'', password:'HeroPass@123', phone:'', role:'Sales', status:'ACTIVE' });
    setShowAddModal(true);
  };

  const openEdit = (user, e) => {
    e.stopPropagation();
    setForm({ name: user.name, email: user.email, password:'', phone: user.phone === 'N/A' ? '' : user.phone, role: user.role, status: user.status });
    setShowEditModal(user);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await api.post('/users', {
        name: form.name,
        email: form.email,
        password: form.password || 'HeroPass@123',
        phone: form.phone || null,
        role: mapRoleToApi(form.role),
        status: form.status
      });
      if (res.data?.success) {
        setShowAddModal(false);
        notify(`Platform user "${form.name}" created as ${form.role}!`);
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
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        role: mapRoleToApi(form.role),
        status: form.status
      };
      if (form.password) {
        payload.password = form.password;
      }
      const res = await api.put(`/users/${showEditModal.id}`, payload);
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
      'Sales': '/sales/dashboard',
    };
    localStorage.setItem('hero_session', JSON.stringify({ name: user.name, email: user.email, role: mapRoleToApi(user.role), company: 'Hero Logistics Platform' }));
    notify(`Logging in as ${user.name} (${user.role})...`);
    setTimeout(() => {
      window.location.href = routes[user.role] || '/sales/dashboard';
    }, 600);
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchR = roleFilter === 'All Roles' || u.role === roleFilter;
    return matchQ && matchR;
  });

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
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" /> Platform Users
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">
            Manage central Hero Platform staff (Super Admin & Sales team). Sales users bring leads to the Super Admin.
          </p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-brand-500 hover:bg-[#f5c800] text-black font-black text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Add Platform Staff (Sales)
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search platform users by name, email..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:border-amber-400 transition-all shadow-xs"
          />
        </div>
        <select
          value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          className="border border-slate-200 rounded-xl px-4 py-2.5 bg-white text-sm font-bold text-slate-700 focus:outline-none focus:border-amber-400 cursor-pointer shadow-xs"
        >
          <option value="All Roles">All Roles</option>
          <option value="Sales">Sales</option>
          <option value="Super Admin">Super Admin</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? (
          <div className="col-span-full py-16 text-center text-slate-400 font-bold flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading platform users...
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 font-bold">
            No platform users found.
          </div>
        ) : (
          filtered.map((user, idx) => (
            <div
              key={user.id}
              onClick={() => setShowDetailModal(user)}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Top: Avatar & Status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm"
                    style={{ background: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className={`inline-flex items-center text-[10px] font-black px-2.5 py-1 rounded-full border uppercase tracking-wider ${STATUS_COLORS[user.status] || ''}`}>
                    {user.status}
                  </span>
                </div>

                {/* User Info */}
                <div className="font-black text-slate-900 text-sm group-hover:text-amber-600 transition-colors">
                  {user.name}
                </div>
                <div className="text-[11px] font-mono text-slate-400 mb-2 truncate">
                  {user.email}
                </div>

                {/* Role Badge */}
                <div className="mb-4">
                  <span className={`inline-flex items-center text-[10px] font-black px-2.5 py-1 rounded-lg border ${ROLE_COLORS[user.role] || 'bg-slate-100 text-slate-700'}`}>
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={(e) => handleLoginAs(user, e)}
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5" /> Login As
                </button>
                <button
                  onClick={(e) => openEdit(user, e)}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-600 flex items-center justify-center transition-all cursor-pointer"
                  title="Edit User"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowDeleteModal(user); }}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 flex items-center justify-center transition-all cursor-pointer"
                  title="Delete User"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}

        {/* Add Card */}
        <div
          onClick={openAdd}
          className="border-2 border-dashed border-slate-200 hover:border-amber-400 hover:bg-amber-50/20 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer min-h-[220px] group"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-amber-100 text-slate-400 group-hover:text-amber-600 flex items-center justify-center transition-all">
            <Plus className="w-6 h-6" />
          </div>
          <div className="text-center px-4">
            <div className="font-black text-slate-600 group-hover:text-amber-600 text-sm transition-all">Add Platform Staff</div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">Create a new Sales or Admin user</div>
          </div>
        </div>

      </div>

      {/* ══ USER DETAIL MODAL ══ */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4 overflow-y-auto" onClick={() => setShowDetailModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl my-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="font-black text-slate-900 text-base">User Profile</h2>
              <button onClick={() => setShowDetailModal(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-5">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-sm"
                  style={{ background: AVATAR_COLORS[users.findIndex(u => u.id === showDetailModal.id) % AVATAR_COLORS.length] }}>
                  {showDetailModal.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-black text-slate-900 text-base">{showDetailModal.name}</div>
                  <div className="text-xs font-mono text-slate-400 font-semibold">{showDetailModal.email}</div>
                  <span className={`inline-flex items-center text-[10px] font-black px-2.5 py-1 rounded-full border uppercase tracking-wider mt-1.5 ${ROLE_COLORS[showDetailModal.role] || ''}`}>
                    {showDetailModal.role}
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                {[
                  { label: 'Email', value: showDetailModal.email, icon: <Mail className="w-3.5 h-3.5" /> },
                  { label: 'Phone', value: showDetailModal.phone, icon: <Phone className="w-3.5 h-3.5" /> },
                  { label: 'Scope', value: 'Platform Level (SaaS Central Team)', icon: <Shield className="w-3.5 h-3.5" /> },
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
      {showAddModal && <FormModal title="Add Platform Staff (Sales)" onSubmit={handleAddSubmit} onClose={() => setShowAddModal(false)} form={form} setForm={setForm} isNew />}

      {/* ══ EDIT MODAL ══ */}
      {showEditModal && <FormModal title="Edit Platform User" onSubmit={handleEditSubmit} onClose={() => setShowEditModal(null)} form={form} setForm={setForm} />}

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
              <div className="text-xs text-slate-400 mt-0.5">{showDeleteModal.role} · {showDeleteModal.email}</div>
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

const FormModal = ({ title, onSubmit, onClose, form, setForm, isNew }) => {
  const inputCls = "w-full border border-slate-200 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 bg-slate-50 focus:outline-none transition-all";
  const labelCls = "block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl my-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="font-black text-slate-900 text-lg flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-indigo-600" /> {title}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={onSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className={labelCls}>Full Name *</label>
              <input required className={inputCls} placeholder="e.g. Sales Manager" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div>
              <label className={labelCls}>Email (Login Username) *</label>
              <input required type="email" className={inputCls} placeholder="sales@hero.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div>
              <label className={labelCls}>Password {isNew ? '*' : '(Leave blank to keep unchanged)'}</label>
              <input required={isNew} type="password" className={inputCls} placeholder="e.g. HeroPass@123" value={form.password || ''} onChange={e => setForm({...form, password: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Phone</label>
                <input className={inputCls} placeholder="+1 555-0000" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
              <div>
                <label className={labelCls}>Status</label>
                <select className={`${inputCls} cursor-pointer`} value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  <option value="ACTIVE">Active</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>Platform Role *</label>
              <select required className={`${inputCls} cursor-pointer font-bold text-indigo-700`} value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                <option value="Sales">Sales (Platform CRM & Leads)</option>
                <option value="Super Admin">Super Admin (Platform Owner)</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-brand-500 hover:bg-[#f5c800] rounded-xl text-sm font-black text-black cursor-pointer shadow-sm transition-all">{isNew ? 'Create Sales User' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
