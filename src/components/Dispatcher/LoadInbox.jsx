import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Inbox, Search, Plus, Clock, X, Check,
  Sparkles, Mail, Globe, FileText, AlertTriangle, Truck, MapPin,
  CheckCircle2, XCircle, RefreshCw, Eye, ArrowRight, Package,
  Calendar, Phone, MessageSquare, Zap
} from 'lucide-react';

/* ─── DATA ──────────────────────────────────────────────────── */
const DRAFTS = [
  {
    id: 'DRAFT-1092', ref: 'PO-48821',
    source: 'email', sourceLabel: 'Email Booking', sourceIcon: Mail,
    sourceColor: { color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe' },
    time: '10 mins ago', urgent: true,
    confidence: 'High',
    driver: 'Michael Chen', avatar: 'MC', avatarColor: '#2563eb',
    driverPhone: '+61 422 111 222', driverLicence: 'MC Class',
    vehicle: 'TRK-101 · Volvo FH540', trailer: 'TRL-201 · Car Carrier 4-Level',
    volume: '2 Vehicles', from: 'Melbourne VIC', to: 'Brisbane QLD',
    pickupDate: '30 Jul 2025, 07:00 AM', deliveryDate: '31 Jul 2025, 05:00 PM',
    accentColor: '#ef4444',
    notes: 'Call 30 mins before arrival. Gate code: 1234.',
    manifests: [
      { rego: 'ABC234', vin: '1FA6P8CF0H5XXXXXX', model: '2023 Ford Mustang GT', colour: 'Red', conf: 'High' },
      { rego: 'XYZ987', vin: 'SALWA2BV4DAXXXXXX', model: '2022 Range Rover Sport', colour: 'White', conf: 'High' },
    ],
  },
  {
    id: 'DRAFT-1091', ref: 'PO-48817',
    source: 'portal', sourceLabel: 'Customer Portal', sourceIcon: Globe,
    sourceColor: { color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
    time: '45 mins ago', urgent: false,
    confidence: 'High',
    driver: 'Sarah Connor', avatar: 'SC', avatarColor: '#059669',
    driverPhone: '+61 433 222 333', driverLicence: 'HC Class',
    vehicle: 'TRK-117 · Scania T500', trailer: 'TRL-202 · Flatbed 45ft',
    volume: '1 Vehicle', from: 'Sydney NSW', to: 'Perth WA',
    pickupDate: '30 Jul 2025, 09:00 AM', deliveryDate: '02 Aug 2025, 03:00 PM',
    accentColor: '#f59e0b',
    notes: 'Fragile — handle with care.',
    manifests: [
      { rego: 'TSL001', vin: 'JTMAB3FV7NDXXXXXX', model: '2023 Tesla Model Y', colour: 'Pearl White', conf: 'High' },
    ],
  },
  {
    id: 'DRAFT-1088', ref: 'PO-48810',
    source: 'file', sourceLabel: 'PDF Upload', sourceIcon: FileText,
    sourceColor: { color: '#db2777', bg: '#fdf2f8', border: '#fbcfe8' },
    time: '2 hrs ago', urgent: false,
    confidence: 'Medium',
    driver: 'James Park', avatar: 'JP', avatarColor: '#ea580c',
    driverPhone: '+61 411 333 444', driverLicence: 'MC Class',
    vehicle: 'TRK-104 · Kenworth T680', trailer: 'TRL-203 · B-Double Car Carrier',
    volume: '4 Vehicles', from: 'Brisbane QLD', to: 'Adelaide SA',
    pickupDate: '30 Jul 2025, 11:00 AM', deliveryDate: '01 Aug 2025, 02:00 PM',
    accentColor: '#f59e0b',
    notes: 'Please ensure all straps are checked. Customer contact: Lisa (0422-999-888).',
    manifests: [
      { rego: 'BMW001', vin: 'WBA5A3C03NFXXXXXX', model: '2023 BMW 330i', colour: 'Alpine White', conf: 'High' },
      { rego: 'BMW002', vin: 'WBA5A3C08NFXXXXXX', model: '2023 BMW 330i', colour: 'Black Sapphire', conf: 'Medium' },
      { rego: 'HIL001', vin: 'JA3AZ3FV8NDXXXXXX', model: '2021 Toyota HiLux SR5', colour: 'Grey', conf: 'High' },
      { rego: 'DEF001', vin: 'SALWA2BV7DAXXXXXX', model: '2022 Land Rover Defender', colour: 'Fuji White', conf: 'Medium' },
    ],
  },
  {
    id: 'DRAFT-1085', ref: 'PO-48805',
    source: 'email', sourceLabel: 'Email Booking', sourceIcon: Mail,
    sourceColor: { color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe' },
    time: '3 hrs ago', urgent: false,
    confidence: 'Low',
    driver: 'David Wilson', avatar: 'DW', avatarColor: '#475569',
    driverPhone: '+61 499 444 555', driverLicence: 'HC Class',
    vehicle: 'TRK-108 · Freightliner', trailer: 'TRL-205 · Flatbed Standard',
    volume: '3 Vehicles', from: 'Perth WA', to: 'Melbourne VIC',
    pickupDate: '31 Jul 2025, 06:00 AM', deliveryDate: '03 Aug 2025, 12:00 PM',
    accentColor: '#cbd5e1',
    notes: 'Low confidence — some VINs need manual verification before approval.',
    manifests: [
      { rego: 'TYT001', vin: 'JTMAB3FV7ND000111', model: '2022 Toyota RAV4', colour: 'Celestite', conf: 'Low' },
      { rego: 'MAZ001', vin: 'JM3KFBDL0N0000222', model: '2023 Mazda CX-5', colour: 'Soul Red', conf: 'Medium' },
      { rego: 'HON001', vin: 'JHMCR2F50PC000333', model: '2021 Honda CR-V', colour: 'Platinum White', conf: 'Low' },
    ],
  },
];

const CONF_STYLE = {
  High:   { bg: '#d1fae5', color: '#065f46', border: '#a7f3d0' },
  Medium: { bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
  Low:    { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5' },
};

const SOURCE_TABS = [
  { id: 'ALL',    label: 'All Inbox' },
  { id: 'email',  label: 'Email' },
  { id: 'portal', label: 'Portal' },
  { id: 'file',   label: 'File Upload' },
  { id: 'urgent', label: '🔴 Urgent' },
];

/* ─── MODAL ─────────────────────────────────────────────────── */
function DraftModal({ draft, onClose, onApprove, onReject }) {
  const SourceIcon = draft.sourceIcon;
  const conf = CONF_STYLE[draft.confidence];

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'rgba(15,23,42,0.65)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
          width: '100%', maxWidth: '680px',
          maxHeight: '90vh', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          border: '1px solid #e2e8f0',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {/* ── Header ── */}
        <div style={{ background: '#0f172a', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Inbox size={20} color="#818cf8" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ color: '#fff', fontWeight: 900, fontSize: 16 }}>{draft.id}</span>
                <span style={{ color: '#94a3b8', fontWeight: 600, fontSize: 11, fontFamily: 'monospace' }}>({draft.ref})</span>
                {draft.urgent && (
                  <span style={{ padding: '2px 8px', borderRadius: 6, background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    ⚡ URGENT
                  </span>
                )}
              </div>
              <p style={{ color: '#64748b', fontSize: 11, margin: '2px 0 0 0' }}>{draft.time} · via {draft.sourceLabel}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8', borderRadius: 10, padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.16)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#94a3b8'; }}
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* AI Confidence */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12, background: conf.bg, border: `1px solid ${conf.border}`, color: conf.color, fontWeight: 700, fontSize: 13 }}>
            <Sparkles size={16} style={{ flexShrink: 0 }} />
            <span>AI Confidence: <strong>{draft.confidence}</strong> — {draft.confidence === 'High' ? 'All fields extracted with high accuracy.' : draft.confidence === 'Medium' ? 'Some fields may need manual review.' : 'Manual verification required before approving.'}</span>
          </div>

          {/* Route */}
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <p style={{ fontSize: 9, fontWeight: 900, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px 0' }}>ORIGIN</p>
              <p style={{ fontSize: 15, fontWeight: 900, color: '#0f172a', margin: 0 }}>{draft.from}</p>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#3b82f6', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Calendar size={11} /> {draft.pickupDate}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <ArrowRight size={22} color="#93c5fd" />
              <span style={{ fontSize: 9, fontWeight: 900, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{draft.volume}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 9, fontWeight: 900, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px 0' }}>DESTINATION</p>
              <p style={{ fontSize: 15, fontWeight: 900, color: '#0f172a', margin: 0 }}>{draft.to}</p>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#3b82f6', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                <Calendar size={11} /> {draft.deliveryDate}
              </p>
            </div>
          </div>

          {/* Driver + Fleet */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: 16 }}>
              <p style={{ fontSize: 9, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px 0' }}>ASSIGNED DRIVER</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: draft.avatarColor, color: '#fff', fontWeight: 900, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {draft.avatar}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 900, color: '#0f172a', margin: 0 }}>{draft.driver}</p>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#64748b', margin: '2px 0 0 0' }}>{draft.driverLicence}</p>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#4f46e5', margin: '3px 0 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Phone size={10} /> {draft.driverPhone}
                  </p>
                </div>
              </div>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: 16 }}>
              <p style={{ fontSize: 9, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px 0' }}>FLEET ASSIGNMENT</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 12, fontWeight: 700, color: '#1e293b' }}>
                <Truck size={14} color="#3b82f6" /> {draft.vehicle}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: '#1e293b' }}>
                <Package size={14} color="#7c3aed" /> {draft.trailer}
              </div>
            </div>
          </div>

          {/* VIN Table */}
          <div>
            <p style={{ fontSize: 9, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={12} color="#6366f1" /> AI EXTRACTED CARGO MANIFEST
            </p>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    {['#', 'Rego', 'VIN / Chassis', 'Model', 'Colour', 'Conf.'].map(h => (
                      <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 9, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {draft.manifests.map((m, idx) => {
                    const cs = CONF_STYLE[m.conf];
                    return (
                      <tr key={idx} style={{ borderBottom: idx < draft.manifests.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                        <td style={{ padding: '10px 12px', color: '#94a3b8', fontWeight: 700 }}>{idx + 1}</td>
                        <td style={{ padding: '10px 12px', fontWeight: 900, color: '#0f172a' }}>{m.rego}</td>
                        <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 700, color: '#4f46e5', fontSize: 11 }}>{m.vin}</td>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: '#1e293b' }}>{m.model}</td>
                        <td style={{ padding: '10px 12px', fontWeight: 600, color: '#64748b' }}>{m.colour}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ padding: '2px 8px', borderRadius: 6, background: cs.bg, color: cs.color, border: `1px solid ${cs.border}`, fontSize: 9, fontWeight: 900, textTransform: 'uppercase' }}>{m.conf}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          {draft.notes && (
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '12px 16px' }}>
              <p style={{ fontSize: 9, fontWeight: 900, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                <MessageSquare size={12} /> SPECIAL INSTRUCTIONS
              </p>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: 0 }}>{draft.notes}</p>
            </div>
          )}
        </div>

        {/* ── Footer Buttons ── */}
        <div style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexShrink: 0 }}>
          <button
            onClick={() => { onReject(draft.id); onClose(); }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: '#fff', border: '1.5px solid #fca5a5', color: '#dc2626', fontWeight: 700, borderRadius: 12, cursor: 'pointer', fontSize: 13, transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
          >
            <XCircle size={16} /> Reject Load
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={onClose}
              style={{ padding: '10px 18px', background: '#fff', border: '1.5px solid #e2e8f0', color: '#475569', fontWeight: 700, borderRadius: 12, cursor: 'pointer', fontSize: 13, transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
            >
              Close
            </button>
            <button
              onClick={() => { onApprove(draft.id); onClose(); }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 22px', background: '#16a34a', color: '#fff', fontWeight: 900, borderRadius: 12, cursor: 'pointer', fontSize: 13, border: 'none', boxShadow: '0 4px 12px rgba(22,163,74,0.35)', transition: 'all 0.15s', textTransform: 'uppercase', letterSpacing: '0.05em' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#15803d'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#16a34a'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <Zap size={15} fill="#fbbf24" color="#fbbf24" /> Approve &amp; Dispatch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN ──────────────────────────────────────────────────── */
export default function LoadInbox() {
  const navigate = useNavigate();
  const [search, setSearch]             = useState('');
  const [tab, setTab]                   = useState('ALL');
  const [data, setData]                 = useState(DRAFTS);
  const [selected, setSelected]         = useState(null);
  const [toast, setToast]               = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = (id) => {
    setData(prev => prev.filter(d => d.id !== id));
    showToast(`Load ${id} approved & dispatched!`, 'success');
  };
  const handleReject = (id) => {
    setData(prev => prev.filter(d => d.id !== id));
    showToast(`Load ${id} rejected.`, 'error');
  };

  const filtered = data.filter(d => {
    const q = search.toLowerCase();
    const match = !q || [d.id, d.driver, d.from, d.to, d.ref].some(v => v.toLowerCase().includes(q));
    if (tab === 'urgent') return match && d.urgent;
    if (tab === 'ALL') return match;
    return match && d.source === tab;
  });

  const stats = [
    { label: 'Total Pending', value: data.length, color: '#0f172a', bg: '#f8fafc', border: '#e2e8f0' },
    { label: 'Urgent', value: data.filter(d => d.urgent).length, color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
    { label: 'High Conf.', value: data.filter(d => d.confidence === 'High').length, color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
    { label: 'Needs Review', value: data.filter(d => d.confidence !== 'High').length, color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  ];

  const S = { fontFamily: 'Inter, system-ui, sans-serif' };

  return (
    <div style={{ ...S, flexGrow: 1, background: '#F8FAFC', padding: '28px 32px', overflowY: 'auto', minHeight: 0, width: '100%' }}>

      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000, padding: '12px 20px', borderRadius: 14, background: toast.type === 'success' ? '#16a34a' : '#dc2626', color: '#fff', fontWeight: 700, fontSize: 13, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* MODAL */}
      {selected && (
        <DraftModal
          draft={selected}
          onClose={() => setSelected(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 16, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(99,102,241,0.35)', flexShrink: 0 }}>
            <Inbox size={22} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#0f172a' }}>Load Inbox</h1>
              <span style={{ padding: '2px 8px', background: '#4f46e5', color: '#fff', fontSize: 9, fontWeight: 900, borderRadius: 6, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Sparkles size={10} color="#fbbf24" /> AI
              </span>
              {data.some(d => d.urgent) && (
                <span style={{ padding: '2px 8px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontSize: 9, fontWeight: 900, borderRadius: 6, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AlertTriangle size={10} /> URGENT
                </span>
              )}
            </div>
            <p style={{ margin: '3px 0 0 0', fontSize: 12, color: '#64748b', fontWeight: 500 }}>
              Field-submitted draft loads — Click a card to review &amp; dispatch
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => showToast('🔄 Inbox refreshed!', 'success')}
            style={{ width: 40, height: 40, background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#64748b'; }}
            title="Refresh Inbox"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={() => navigate('/dispatcher/loads')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: '#facc15', color: '#0f172a', fontWeight: 800, fontSize: 13, borderRadius: 12, cursor: 'pointer', border: 'none', boxShadow: '0 2px 8px rgba(250,204,21,0.4)', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#eab308'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#facc15'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <Plus size={15} strokeWidth={3} /> New Manual Load
          </button>
        </div>
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 16, padding: '14px 18px' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* SEARCH + TABS */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Draft ID, Driver, Route or PO Ref..."
            style={{ width: '100%', paddingLeft: 38, paddingRight: 14, paddingTop: 10, paddingBottom: 10, background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 13, fontWeight: 600, color: '#0f172a', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
            onFocus={e => { e.target.style.borderColor = '#6366f1'; }}
            onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }}
          />
        </div>
        <div style={{ display: 'flex', gap: 4, background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: 4 }}>
          {SOURCE_TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{ padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all 0.15s', background: tab === t.id ? '#4f46e5' : 'transparent', color: tab === t.id ? '#fff' : '#94a3b8', whiteSpace: 'nowrap' }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* CARDS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: '64px 24px', textAlign: 'center' }}>
            <Inbox size={48} color="#e2e8f0" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: '#94a3b8', fontWeight: 700, fontSize: 14, margin: 0 }}>No draft loads in inbox</p>
            <p style={{ color: '#cbd5e1', fontWeight: 500, fontSize: 12, marginTop: 4 }}>All loads reviewed or try another filter</p>
          </div>
        ) : filtered.map(draft => {
          const SourceIcon = draft.sourceIcon;
          return (
            <div
              key={draft.id}
              onClick={() => setSelected(draft)}
              style={{
                background: '#fff', border: '1px solid #e2e8f0',
                borderLeft: `4px solid ${draft.accentColor}`,
                borderRadius: 16, overflow: 'hidden',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                cursor: 'pointer', transition: 'all 0.18s',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ padding: '18px 20px' }}>
                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1, minWidth: 0 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: '#fffbeb', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Clock size={18} color="#f59e0b" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 900, color: '#0f172a' }}>{draft.id}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', fontFamily: 'monospace' }}>({draft.ref})</span>
                        {draft.urgent && (
                          <span style={{ padding: '2px 7px', borderRadius: 5, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontSize: 9, fontWeight: 900, textTransform: 'uppercase' }}>⚡ URGENT</span>
                        )}
                        {/* Confidence badge */}
                        {(() => { const cs = CONF_STYLE[draft.confidence]; return (
                          <span style={{ padding: '2px 7px', borderRadius: 5, background: cs.bg, color: cs.color, border: `1px solid ${cs.border}`, fontSize: 9, fontWeight: 900, textTransform: 'uppercase' }}>{draft.confidence} Conf.</span>
                        ); })()}
                        {/* Source badge */}
                        <span style={{ padding: '2px 7px', borderRadius: 5, background: draft.sourceColor.bg, color: draft.sourceColor.color, border: `1px solid ${draft.sourceColor.border}`, fontSize: 9, fontWeight: 900, textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <SourceIcon size={9} /> {draft.sourceLabel}
                        </span>
                      </div>
                      <p style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={11} /> {draft.time}
                      </p>
                    </div>
                  </div>
                  {/* Open arrow hint */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Eye size={12} /> Click to review
                    </span>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ArrowRight size={15} color="#94a3b8" />
                    </div>
                  </div>
                </div>

                {/* Details mini-grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginTop: 14 }}>
                  {/* Driver */}
                  <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 12, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 9 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: draft.avatarColor, color: '#fff', fontWeight: 900, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{draft.avatar}</div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 8, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px 0' }}>Driver</p>
                      <p style={{ fontSize: 11, fontWeight: 900, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{draft.driver}</p>
                    </div>
                  </div>
                  {/* Vehicle */}
                  <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 12, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 9 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Truck size={13} color="#3b82f6" /></div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 8, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px 0' }}>Vehicle</p>
                      <p style={{ fontSize: 11, fontWeight: 900, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{draft.vehicle.split(' · ')[0]}</p>
                    </div>
                  </div>
                  {/* Cargo */}
                  <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 12, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 9 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Package size={13} color="#7c3aed" /></div>
                    <div>
                      <p style={{ fontSize: 8, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px 0' }}>Cargo</p>
                      <p style={{ fontSize: 11, fontWeight: 900, color: '#0f172a', margin: 0 }}>{draft.volume}</p>
                    </div>
                  </div>
                  {/* Route */}
                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 9 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><MapPin size={13} color="#3b82f6" /></div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize: 8, fontWeight: 900, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px 0' }}>Route</p>
                      <p style={{ fontSize: 11, fontWeight: 900, color: '#1d4ed8', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{draft.from} → {draft.to}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
