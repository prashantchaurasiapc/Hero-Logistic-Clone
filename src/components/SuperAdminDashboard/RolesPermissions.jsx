import React, { useState } from 'react';
import {
  Shield, Plus, Edit3, Trash2, Check, X, Search,
  AlertTriangle, Building, Users, UserCheck, Key, LogIn
} from 'lucide-react';

/* ─── Hero Logistics Platform Modules & Available Permissions ─── */
const MODULES = [
  { name: 'Dashboard & Analytics',     perms: ['Show', 'View', 'Export'] },
  { name: 'User Management',           perms: ['Manage', 'Create', 'Edit', 'Delete', 'View'] },
  { name: 'Roles & Permissions',       perms: ['Manage', 'Create', 'Edit', 'Delete', 'View'] },
  { name: 'Companies & Tenants',       perms: ['Manage', 'Create', 'Edit', 'Delete', 'View'] },
  { name: 'Loads & Dispatch',          perms: ['Manage', 'Create', 'Edit', 'Delete', 'View'] },
  { name: 'Fleet & Vehicles',          perms: ['Manage', 'Create', 'Edit', 'Delete', 'View'] },
  { name: 'Drivers & Roster',          perms: ['Manage', 'Create', 'Edit', 'Delete', 'View'] },
  { name: 'Warehouse & Stock',         perms: ['Manage', 'Create', 'Edit', 'Delete', 'View'] },
  { name: 'Yard Management',           perms: ['Manage', 'Create', 'Edit', 'Delete', 'View'] },
  { name: 'Billing & Invoices',        perms: ['Manage', 'Create', 'Edit', 'Delete', 'View'] },
  { name: 'Inter-Company Transfers',   perms: ['Manage', 'Create', 'Edit', 'Delete', 'View'] },
  { name: 'AI Controls & Optimizer',   perms: ['Manage', 'Edit', 'View'] },
  { name: 'Support Tickets',           perms: ['Manage', 'Create', 'Edit', 'View'] },
  { name: 'White Label & Branding',    perms: ['Manage', 'Edit', 'View'] },
  { name: 'System Settings',           perms: ['Manage', 'Edit', 'View'] },
];

/* Build empty permission map for a role */
const emptyPerms = () =>
  Object.fromEntries(MODULES.map(m => [m.name, Object.fromEntries(m.perms.map(p => [p, false]))]));

/* Build full permission map */
const fullPerms = () =>
  Object.fromEntries(MODULES.map(m => [m.name, Object.fromEntries(m.perms.map(p => [p, true]))]));

/* ─── Hero Logistics Initial Roles ─── */
const INITIAL_ROLES = [
  {
    id: 'R001', name: 'SUPER ADMIN',
    permissions: fullPerms(),
  },
  {
    id: 'R002', name: 'COMPANY ADMIN',
    permissions: {
      'Dashboard & Analytics':     { Show: true, View: true, Export: true },
      'User Management':           { Manage: true, Create: true, Edit: true, Delete: true, View: true },
      'Roles & Permissions':       { Manage: true, Create: true, Edit: true, Delete: false, View: true },
      'Companies & Tenants':       { Manage: false, Create: false, Edit: true, Delete: false, View: true },
      'Loads & Dispatch':          { Manage: true, Create: true, Edit: true, Delete: true, View: true },
      'Fleet & Vehicles':          { Manage: true, Create: true, Edit: true, Delete: true, View: true },
      'Drivers & Roster':          { Manage: true, Create: true, Edit: true, Delete: true, View: true },
      'Warehouse & Stock':         { Manage: true, Create: true, Edit: true, Delete: false, View: true },
      'Yard Management':           { Manage: true, Create: true, Edit: true, Delete: false, View: true },
      'Billing & Invoices':        { Manage: true, Create: true, Edit: true, Delete: false, View: true },
      'Inter-Company Transfers':   { Manage: true, Create: true, Edit: true, Delete: false, View: true },
      'AI Controls & Optimizer':   { Manage: false, Edit: true, View: true },
      'Support Tickets':           { Manage: true, Create: true, Edit: true, View: true },
      'White Label & Branding':    { Manage: false, Edit: true, View: true },
      'System Settings':           { Manage: true, Edit: true, View: true },
    },
  },
  {
    id: 'R003', name: 'DISPATCHER',
    permissions: {
      'Dashboard & Analytics':     { Show: true, View: true, Export: false },
      'User Management':           { Manage: false, Create: false, Edit: false, Delete: false, View: true },
      'Roles & Permissions':       { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Companies & Tenants':       { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Loads & Dispatch':          { Manage: true, Create: true, Edit: true, Delete: false, View: true },
      'Fleet & Vehicles':          { Manage: true, Create: false, Edit: true, Delete: false, View: true },
      'Drivers & Roster':          { Manage: true, Create: false, Edit: true, Delete: false, View: true },
      'Warehouse & Stock':         { Manage: false, Create: false, Edit: false, Delete: false, View: true },
      'Yard Management':           { Manage: true, Create: false, Edit: true, Delete: false, View: true },
      'Billing & Invoices':        { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Inter-Company Transfers':   { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'AI Controls & Optimizer':   { Manage: false, Edit: false, View: true },
      'Support Tickets':           { Manage: false, Create: true, Edit: false, View: true },
      'White Label & Branding':    { Manage: false, Edit: false, View: false },
      'System Settings':           { Manage: false, Edit: false, View: false },
    },
  },
  {
    id: 'R004', name: 'DRIVER',
    permissions: {
      'Dashboard & Analytics':     { Show: true, View: true, Export: false },
      'User Management':           { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Roles & Permissions':       { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Companies & Tenants':       { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Loads & Dispatch':          { Manage: false, Create: false, Edit: false, Delete: false, View: true },
      'Fleet & Vehicles':          { Manage: false, Create: false, Edit: false, Delete: false, View: true },
      'Drivers & Roster':          { Manage: false, Create: false, Edit: false, Delete: false, View: true },
      'Warehouse & Stock':         { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Yard Management':           { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Billing & Invoices':        { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Inter-Company Transfers':   { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'AI Controls & Optimizer':   { Manage: false, Edit: false, View: false },
      'Support Tickets':           { Manage: false, Create: true, Edit: false, View: true },
      'White Label & Branding':    { Manage: false, Edit: false, View: false },
      'System Settings':           { Manage: false, Edit: false, View: false },
    },
  },
  {
    id: 'R005', name: 'WAREHOUSE MANAGER',
    permissions: {
      'Dashboard & Analytics':     { Show: true, View: true, Export: true },
      'User Management':           { Manage: false, Create: false, Edit: false, Delete: false, View: true },
      'Roles & Permissions':       { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Companies & Tenants':       { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Loads & Dispatch':          { Manage: false, Create: false, Edit: true, Delete: false, View: true },
      'Fleet & Vehicles':          { Manage: false, Create: false, Edit: false, Delete: false, View: true },
      'Drivers & Roster':          { Manage: false, Create: false, Edit: false, Delete: false, View: true },
      'Warehouse & Stock':         { Manage: true, Create: true, Edit: true, Delete: true, View: true },
      'Yard Management':           { Manage: true, Create: true, Edit: true, Delete: false, View: true },
      'Billing & Invoices':        { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Inter-Company Transfers':   { Manage: true, Create: true, Edit: true, Delete: false, View: true },
      'AI Controls & Optimizer':   { Manage: false, Edit: false, View: false },
      'Support Tickets':           { Manage: false, Create: true, Edit: false, View: true },
      'White Label & Branding':    { Manage: false, Edit: false, View: false },
      'System Settings':           { Manage: false, Edit: false, View: false },
    },
  },
  {
    id: 'R006', name: 'ACCOUNTS MANAGER',
    permissions: {
      'Dashboard & Analytics':     { Show: true, View: true, Export: true },
      'User Management':           { Manage: false, Create: false, Edit: false, Delete: false, View: true },
      'Roles & Permissions':       { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Companies & Tenants':       { Manage: false, Create: false, Edit: false, Delete: false, View: true },
      'Loads & Dispatch':          { Manage: false, Create: false, Edit: false, Delete: false, View: true },
      'Fleet & Vehicles':          { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Drivers & Roster':          { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Warehouse & Stock':         { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Yard Management':           { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Billing & Invoices':        { Manage: true, Create: true, Edit: true, Delete: true, View: true },
      'Inter-Company Transfers':   { Manage: true, Create: true, Edit: true, Delete: false, View: true },
      'AI Controls & Optimizer':   { Manage: false, Edit: false, View: false },
      'Support Tickets':           { Manage: false, Create: true, Edit: false, View: true },
      'White Label & Branding':    { Manage: false, Edit: false, View: false },
      'System Settings':           { Manage: false, Edit: false, View: false },
    },
  },
  {
    id: 'R007', name: 'YARD ATTENDANT',
    permissions: {
      'Dashboard & Analytics':     { Show: true, View: true, Export: false },
      'User Management':           { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Roles & Permissions':       { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Companies & Tenants':       { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Loads & Dispatch':          { Manage: false, Create: false, Edit: false, Delete: false, View: true },
      'Fleet & Vehicles':          { Manage: false, Create: false, Edit: true, Delete: false, View: true },
      'Drivers & Roster':          { Manage: false, Create: false, Edit: false, Delete: false, View: true },
      'Warehouse & Stock':         { Manage: false, Create: false, Edit: true, Delete: false, View: true },
      'Yard Management':           { Manage: true, Create: true, Edit: true, Delete: false, View: true },
      'Billing & Invoices':        { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Inter-Company Transfers':   { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'AI Controls & Optimizer':   { Manage: false, Edit: false, View: false },
      'Support Tickets':           { Manage: false, Create: true, Edit: false, View: true },
      'White Label & Branding':    { Manage: false, Edit: false, View: false },
      'System Settings':           { Manage: false, Edit: false, View: false },
    },
  },
  {
    id: 'R008', name: 'SALES REP',
    permissions: {
      'Dashboard & Analytics':     { Show: true, View: true, Export: true },
      'User Management':           { Manage: false, Create: false, Edit: false, Delete: false, View: true },
      'Roles & Permissions':       { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Companies & Tenants':       { Manage: true, Create: true, Edit: true, Delete: false, View: true },
      'Loads & Dispatch':          { Manage: false, Create: false, Edit: false, Delete: false, View: true },
      'Fleet & Vehicles':          { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Drivers & Roster':          { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Warehouse & Stock':         { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Yard Management':           { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Billing & Invoices':        { Manage: false, Create: false, Edit: false, Delete: false, View: true },
      'Inter-Company Transfers':   { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'AI Controls & Optimizer':   { Manage: false, Edit: false, View: false },
      'Support Tickets':           { Manage: true, Create: true, Edit: true, View: true },
      'White Label & Branding':    { Manage: false, Edit: false, View: false },
      'System Settings':           { Manage: false, Edit: false, View: false },
    },
  },
  {
    id: 'R009', name: 'CUSTOMER',
    permissions: {
      'Dashboard & Analytics':     { Show: true, View: true, Export: false },
      'User Management':           { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Roles & Permissions':       { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Companies & Tenants':       { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Loads & Dispatch':          { Manage: false, Create: true, Edit: false, Delete: false, View: true },
      'Fleet & Vehicles':          { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Drivers & Roster':          { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Warehouse & Stock':         { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Yard Management':           { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'Billing & Invoices':        { Manage: false, Create: false, Edit: false, Delete: false, View: true },
      'Inter-Company Transfers':   { Manage: false, Create: false, Edit: false, Delete: false, View: false },
      'AI Controls & Optimizer':   { Manage: false, Edit: false, View: false },
      'Support Tickets':           { Manage: false, Create: true, Edit: false, View: true },
      'White Label & Branding':    { Manage: false, Edit: false, View: false },
      'System Settings':           { Manage: false, Edit: false, View: false },
    },
  },
];

/* Get all granted permission labels for a role (for badge display) */
const getGrantedBadges = (permissions) => {
  const badges = [];
  Object.entries(permissions || {}).forEach(([mod, perms]) => {
    Object.entries(perms || {}).forEach(([perm, val]) => {
      if (val) badges.push(`${mod.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}-${perm.toLowerCase()}`);
    });
  });
  return badges;
};

/* Friendly short badge labels */
const getBadgeLabel = (key) => {
  const parts = key.split('-');
  const perm = parts[parts.length - 1];
  const mod  = parts.slice(0, -1).join(' ');
  return `${mod} ${perm}`;
};

const BADGE_COLORS = [
  'bg-emerald-100 text-emerald-700 border-emerald-200',
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-amber-100 text-amber-700 border-amber-200',
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-rose-100 text-rose-700 border-rose-200',
  'bg-teal-100 text-teal-700 border-teal-200',
];

export default function RolesPermissions() {
  const [roles, setRoles]             = useState(INITIAL_ROLES);
  const [search, setSearch]           = useState('');
  const [perPage, setPerPage]         = useState(10);
  const [toast, setToast]             = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editRole, setEditRole]       = useState(null);   // role being edited
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  /* Form state for add/edit modal */
  const [formName, setFormName]       = useState('');
  const [formPerms, setFormPerms]     = useState(emptyPerms());

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  /* Open Add modal */
  const openAdd = () => {
    setEditRole(null);
    setFormName('');
    setFormPerms(emptyPerms());
    setShowAddModal(true);
  };

  /* Open Edit modal */
  const openEdit = (role) => {
    setEditRole(role);
    setFormName(role.name);
    // Merge existing perms with empty template
    const merged = emptyPerms();
    Object.entries(role.permissions || {}).forEach(([mod, perms]) => {
      if (merged[mod]) {
        Object.entries(perms || {}).forEach(([p, v]) => {
          if (merged[mod][p] !== undefined) merged[mod][p] = v;
        });
      }
    });
    setFormPerms(merged);
    setShowAddModal(true);
  };

  /* Toggle checkbox */
  const togglePerm = (mod, perm) => {
    setFormPerms(prev => ({
      ...prev,
      [mod]: { ...prev[mod], [perm]: !prev[mod][perm] },
    }));
  };

  /* Save */
  const handleSave = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;
    if (editRole) {
      setRoles(prev => prev.map(r => r.id === editRole.id ? { ...r, name: formName.trim().toUpperCase(), permissions: formPerms } : r));
      notify(`Role "${formName}" updated!`);
    } else {
      setRoles(prev => [...prev, { id: `R00${prev.length + 1}`, name: formName.trim().toUpperCase(), permissions: { ...formPerms } }]);
      notify(`Role "${formName}" created!`);
    }
    setShowAddModal(false);
  };

  /* Delete */
  const handleDelete = () => {
    notify(`Role "${showDeleteModal.name}" deleted.`);
    setRoles(prev => prev.filter(r => r.id !== showDeleteModal.id));
    setShowDeleteModal(null);
  };

  const filtered = roles.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-grow bg-[#F8FAFC] p-4 sm:p-6 overflow-y-auto w-full text-left font-sans min-h-screen relative">

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl z-[999999] flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" /> {toast}
        </div>
      )}

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600 flex-shrink-0" /> Role & Permission
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">
            Manage platform roles and module-level access permissions for Hero Logistics.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 bg-[#FFD400] hover:bg-[#f5c800] text-black font-black text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> + Create Role
        </button>
      </div>

      {/* ── TOOLBAR ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
          <select
            value={perPage}
            onChange={e => setPerPage(+e.target.value)}
            className="border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 font-bold focus:outline-none cursor-pointer"
          >
            {[5, 10, 25, 50].map(n => <option key={n}>{n}</option>)}
          </select>
          entries per page
        </div>
        <div className="relative w-full sm:w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search roles..."
            className="pl-8 pr-4 py-2 border border-slate-200 rounded-xl bg-white text-xs font-bold text-slate-700 focus:outline-none focus:border-amber-400 w-full transition-all"
          />
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full min-w-[650px] text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-5 py-3.5 text-left text-[11px] font-black text-slate-400 uppercase tracking-wider w-48 whitespace-nowrap">Role</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-black text-slate-400 uppercase tracking-wider">Permissions</th>
                <th className="px-5 py-3.5 text-right text-[11px] font-black text-slate-400 uppercase tracking-wider w-24 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.slice(0, perPage).length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-12 text-center text-slate-400 font-semibold text-sm">
                    No roles found.
                  </td>
                </tr>
              ) : filtered.slice(0, perPage).map((role) => {
                const badges = getGrantedBadges(role.permissions);
                return (
                  <tr key={role.id} className="hover:bg-slate-50/50 transition-all border-b border-slate-50">
                    {/* Role name */}
                    <td className="px-5 py-3.5 align-middle whitespace-nowrap">
                      <span className="inline-flex items-center gap-2 font-black text-slate-800 text-sm whitespace-nowrap">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0" />
                        {role.name}
                      </span>
                    </td>

                    {/* Permission badges: Single horizontal line on Mobile, Wrapped pills on Desktop */}
                    <td className="px-5 py-3.5 align-middle">
                      <div className="flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible scrollbar-hide gap-1.5 py-0.5 items-center">
                        {badges.slice(0, 18).map((b, bi) => (
                          <span
                            key={b}
                            className={`inline-flex items-center text-[10px] font-black px-2.5 py-1 rounded-full border capitalize whitespace-nowrap flex-shrink-0 ${BADGE_COLORS[bi % BADGE_COLORS.length]}`}
                          >
                            {getBadgeLabel(b)}
                          </span>
                        ))}
                        {badges.length > 18 && (
                          <span className="inline-flex items-center text-[10px] font-black px-2.5 py-1 rounded-full border bg-slate-100 text-slate-600 border-slate-200 whitespace-nowrap flex-shrink-0">
                            +{badges.length - 18} more
                          </span>
                        )}
                        {badges.length === 0 && (
                          <span className="text-xs text-slate-400 font-medium italic whitespace-nowrap">No permissions assigned</span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 align-middle text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                        <button
                          onClick={() => openEdit(role)}
                          className="w-8 h-8 rounded-lg bg-sky-500 hover:bg-sky-600 flex items-center justify-center transition-all cursor-pointer shadow-sm flex-shrink-0"
                          title="Edit Role Permissions"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-white" />
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(role)}
                          className="w-8 h-8 rounded-lg bg-rose-500 hover:bg-rose-600 flex items-center justify-center transition-all cursor-pointer shadow-sm flex-shrink-0"
                          title="Delete Role"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="px-5 py-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span>Showing 1 – {Math.min(perPage, filtered.length)} of {filtered.length} entries</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 cursor-pointer transition-all">Previous</button>
            <button className="px-3 py-1.5 rounded-lg bg-[#FFD400] text-black font-black cursor-pointer">1</button>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 cursor-pointer transition-all">Next</button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          CREATE / EDIT ROLE MODAL (z-[99999])
      ══════════════════════════════════════════ */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[85vh] my-auto">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <span className="text-purple-600 font-extrabold text-xl">+</span>
                {editRole ? 'Edit Role' : 'Create Role'}
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 text-xl cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

                {/* Name field */}
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">
                    Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text" required value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="Enter Role Name"
                    className="w-full border border-slate-200 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 bg-slate-50 focus:outline-none transition-all"
                  />
                </div>

                {/* Assign Permissions Table */}
                <div>
                  <div className="text-xs font-black text-slate-700 mb-3">Assign Permission to Roles</div>

                  <div className="border border-slate-200 rounded-xl overflow-x-auto custom-scrollbar">
                    <table className="w-full min-w-[440px] text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-4 py-3 text-left font-black text-slate-500 uppercase tracking-wider text-[10px] w-48">MODULE</th>
                          <th className="px-4 py-3 text-left font-black text-slate-500 uppercase tracking-wider text-[10px]">PERMISSIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {MODULES.map((mod) => (
                          <tr key={mod.name} className="hover:bg-slate-50/50 transition-all">
                            {/* Module name */}
                            <td className="px-4 py-3 font-bold text-slate-700 align-middle text-xs">
                              {mod.name}
                            </td>

                            {/* Checkboxes */}
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap items-center gap-4">
                                {mod.perms.map(perm => (
                                  <label key={perm} className="flex items-center gap-1.5 cursor-pointer select-none group">
                                    <input
                                      type="checkbox"
                                      checked={!!formPerms[mod.name]?.[perm]}
                                      onChange={() => togglePerm(mod.name, perm)}
                                      className="w-4 h-4 text-amber-400 rounded border-slate-300 focus:ring-amber-400 cursor-pointer"
                                    />
                                    <span className={`text-xs font-semibold ${formPerms[mod.name]?.[perm] ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                                      {perm}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50 rounded-b-2xl">
                <button type="button" onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-white cursor-pointer transition-all">
                  Cancel
                </button>
                <button type="submit"
                  className="px-6 py-2.5 bg-[#FFD400] hover:bg-[#f5c800] rounded-xl text-sm font-black text-black cursor-pointer transition-all shadow-sm">
                  {editRole ? 'Save Changes' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center my-auto">
            <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="font-black text-slate-900 text-lg mb-1">Delete Role?</h3>
            <p className="text-sm text-slate-500 font-semibold mb-3">You are about to delete:</p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-4">
              <div className="font-black text-slate-900">{showDeleteModal.name}</div>
            </div>
            <p className="text-xs text-rose-600 font-bold bg-rose-50 border border-rose-100 rounded-lg px-3 py-2 mb-5 flex items-center justify-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5" /> This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(null)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
                Cancel
              </button>
              <button onClick={handleDelete}
                className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 rounded-xl text-sm font-black text-white cursor-pointer transition-all">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
