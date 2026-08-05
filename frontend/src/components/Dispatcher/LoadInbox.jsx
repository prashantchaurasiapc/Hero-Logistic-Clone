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
        position: 'fixed', inset: 0, zIndex: 999999,
        background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#ffffff', borderRadius: '18px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
          width: '100%', maxWidth: '540px',
          maxHeight: '88vh', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          border: '1px solid #e2e8f0',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {/* ── Header (Clean White) ── */}
        <div style={{ background: '#ffffff', padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Inbox size={18} color="#475569" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ color: '#0f172a', fontWeight: 900, fontSize: 15 }}>{draft.id}</span>
                <span style={{ color: '#94a3b8', fontWeight: 600, fontSize: 11, fontFamily: 'monospace' }}>({draft.ref})</span>
                {draft.urgent && (
                  <span style={{ padding: '2px 7px', borderRadius: 5, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontSize: 9, fontWeight: 800, textTransform: 'uppercase' }}>
                    URGENT
                  </span>
                )}
              </div>
              <p style={{ color: '#64748b', fontSize: 11, margin: '2px 0 0 0', fontWeight: 500 }}>{draft.time} · via {draft.sourceLabel}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#64748b'; }}
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* AI Confidence */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155', fontWeight: 600, fontSize: 12 }}>
            <Sparkles size={15} style={{ flexShrink: 0, color: '#6366f1' }} />
            <span>AI Confidence: <strong style={{ color: '#0f172a' }}>{draft.confidence}</strong> — {draft.confidence === 'High' ? 'All fields extracted with high accuracy.' : draft.confidence === 'Medium' ? 'Some fields may need manual review.' : 'Manual verification required.'}</span>
          </div>

          {/* Route Card */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <p style={{ fontSize: 9, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 3px 0' }}>ORIGIN</p>
              <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>{draft.from}</p>
              <p style={{ fontSize: 10, fontWeight: 600, color: '#64748b', margin: '3px 0 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Calendar size={11} color="#94a3b8" /> {draft.pickupDate}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <ArrowRight size={18} color="#94a3b8" />
              <span style={{ fontSize: 9, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{draft.volume}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 9, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 3px 0' }}>DESTINATION</p>
              <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>{draft.to}</p>
              <p style={{ fontSize: 10, fontWeight: 600, color: '#64748b', margin: '3px 0 0 0', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                <Calendar size={11} color="#94a3b8" /> {draft.deliveryDate}
              </p>
            </div>
          </div>

          {/* Driver + Fleet */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
              <p style={{ fontSize: 9, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px 0' }}>ASSIGNED DRIVER</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: '#f1f5f9', color: '#334155', fontWeight: 800, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #e2e8f0' }}>
                  {draft.avatar}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{draft.driver}</p>
                  <p style={{ fontSize: 10, fontWeight: 500, color: '#64748b', margin: '1px 0 0 0' }}>{draft.driverLicence}</p>
                  <p style={{ fontSize: 10, fontWeight: 600, color: '#4f46e5', margin: '2px 0 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Phone size={10} /> {draft.driverPhone}
                  </p>
                </div>
              </div>
            </div>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
              <p style={{ fontSize: 9, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px 0' }}>FLEET ASSIGNMENT</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: 11, fontWeight: 700, color: '#334155' }}>
                <Truck size={13} color="#64748b" /> {draft.vehicle}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#334155' }}>
                <Package size={13} color="#64748b" /> {draft.trailer}
              </div>
            </div>
          </div>

          {/* VIN Table */}
          <div>
            <p style={{ fontSize: 9, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Sparkles size={11} color="#6366f1" /> AI EXTRACTED CARGO MANIFEST
            </p>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    {['#', 'Rego', 'VIN / Chassis', 'Model', 'Colour', 'Conf.'].map(h => (
                      <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontSize: 9, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {draft.manifests.map((m, idx) => {
                    return (
                      <tr key={idx} style={{ borderBottom: idx < draft.manifests.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                        <td style={{ padding: '8px 10px', color: '#94a3b8', fontWeight: 600 }}>{idx + 1}</td>
                        <td style={{ padding: '8px 10px', fontWeight: 800, color: '#0f172a' }}>{m.rego}</td>
                        <td style={{ padding: '8px 10px', fontFamily: 'monospace', fontWeight: 600, color: '#4f46e5', fontSize: 10 }}>{m.vin}</td>
                        <td style={{ padding: '8px 10px', fontWeight: 600, color: '#334155' }}>{m.model}</td>
                        <td style={{ padding: '8px 10px', fontWeight: 500, color: '#64748b' }}>{m.colour}</td>
                        <td style={{ padding: '8px 10px' }}>
                          <span style={{ padding: '2px 6px', borderRadius: 4, background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', fontSize: 9, fontWeight: 800, textTransform: 'uppercase' }}>{m.conf}</span>
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
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 14px' }}>
              <p style={{ fontSize: 9, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: 5 }}>
                <MessageSquare size={11} color="#64748b" /> SPECIAL INSTRUCTIONS
              </p>
              <p style={{ fontSize: 12, fontWeight: 500, color: '#334155', margin: 0 }}>{draft.notes}</p>
            </div>
          )}
        </div>

        {/* ── Footer Buttons ── */}
        <div style={{ padding: '14px 20px', background: '#ffffff', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexShrink: 0 }}>
          <button
            onClick={() => { onReject(draft.id); onClose(); }}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', background: '#fff', border: '1px solid #fca5a5', color: '#dc2626', fontWeight: 700, borderRadius: 10, cursor: 'pointer', fontSize: 12, transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
          >
            <XCircle size={14} /> Reject Load
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={onClose}
              style={{ padding: '8px 14px', background: '#fff', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 700, borderRadius: 10, cursor: 'pointer', fontSize: 12, transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
            >
              Close
            </button>
            <button
              onClick={() => { onApprove(draft.id); onClose(); }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: '#4f46e5', color: '#fff', fontWeight: 800, borderRadius: 10, cursor: 'pointer', fontSize: 12, border: 'none', boxShadow: '0 2px 8px rgba(79,70,229,0.25)', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#4338ca'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#4f46e5'; }}
            >
              <Check size={14} /> Approve &amp; Dispatch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── CREATE MANUAL LOAD MODAL ─────────────────────────────── */
function CreateManualLoadModal({ onClose, onCreate }) {
  const [ref, setRef] = useState(`PO-${Math.floor(10000 + Math.random() * 90000)}`);
  const [customer, setCustomer] = useState('FreightCo');
  const [urgent, setUrgent] = useState(false);
  const [driver, setDriver] = useState('Michael Chen');
  const [from, setFrom] = useState('Melbourne VIC');
  const [to, setTo] = useState('Brisbane QLD');
  const [pickupDate, setPickupDate] = useState('30 Jul 2025, 08:00 AM');
  const [deliveryDate, setDeliveryDate] = useState('31 Jul 2025, 05:00 PM');
  const [vehicle, setVehicle] = useState('TRK-101 · Volvo FH540');
  const [trailer, setTrailer] = useState('TRL-201 · Car Carrier 4-Level');
  const [rego, setRego] = useState('ABC999');
  const [vin, setVin] = useState('1FA6P8CF0H599999');
  const [model, setModel] = useState('2024 Ford Mustang GT');
  const [colour, setColour] = useState('Red');
  const [notes, setNotes] = useState('Call driver 30 mins before arrival. Gate code #1234.');

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = `DRAFT-${Math.floor(1093 + Math.random() * 90)}`;
    const driverInitials = driver.split(' ').map(n => n[0]).join('').slice(0, 2);

    const newLoad = {
      id: newId,
      ref,
      source: 'portal',
      sourceLabel: customer,
      sourceIcon: Globe,
      sourceColor: { color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe' },
      time: 'Just now',
      urgent,
      confidence: 'High',
      driver,
      avatar: driverInitials,
      avatarColor: '#2563eb',
      driverPhone: '+61 422 111 222',
      driverLicence: 'MC Class',
      vehicle,
      trailer,
      volume: '1 Vehicle',
      from,
      to,
      pickupDate,
      deliveryDate,
      accentColor: urgent ? '#ef4444' : '#6366f1',
      notes,
      manifests: [
        { rego, vin, model, colour, conf: 'High' }
      ]
    };

    onCreate(newLoad);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 999999,
        background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#ffffff', borderRadius: '18px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
          width: '100%', maxWidth: '540px',
          maxHeight: '88vh', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          border: '1px solid #e2e8f0',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {/* Header (Clean White) */}
        <div style={{ background: '#ffffff', padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
              <Plus size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h2 style={{ color: '#0f172a', fontWeight: 800, fontSize: 16, margin: 0 }}>Create New Manual Load</h2>
              <p style={{ color: '#64748b', fontSize: 11, margin: '2px 0 0 0', fontWeight: 500 }}>Manually register &amp; dispatch a new load</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#64748b'; }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          
          {/* Row 1: Ref & Customer & Urgency */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: 9, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>PO / Ref No. *</label>
              <input
                required
                value={ref}
                onChange={e => setRef(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 700, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 9, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Shipper / Customer *</label>
              <select
                value={customer}
                onChange={e => setCustomer(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 700, outline: 'none', boxSizing: 'border-box', background: '#fff' }}
              >
                <option>FreightCo</option>
                <option>Speedy Logistics</option>
                <option>ABC Motors Pty Ltd</option>
                <option>Apex Transport</option>
                <option>BlueWave Lines</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 9, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Priority</label>
              <button
                type="button"
                onClick={() => setUrgent(!urgent)}
                style={{
                  width: '100%', padding: '7px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 800,
                  background: urgent ? '#fef2f2' : '#f8fafc',
                  color: urgent ? '#dc2626' : '#64748b',
                  border: `1px solid ${urgent ? '#fecaca' : '#e2e8f0'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, boxSizing: 'border-box'
                }}
              >
                <AlertTriangle size={13} color={urgent ? '#dc2626' : '#94a3b8'} />
                {urgent ? 'URGENT' : 'Normal'}
              </button>
            </div>
          </div>

          {/* Row 2: Origin & Destination */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 9, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Origin (Pickup) *</label>
              <input
                required
                value={from}
                onChange={e => setFrom(e.target.value)}
                placeholder="City, State"
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 700, outline: 'none', boxSizing: 'border-box', marginBottom: 6, background: '#fff' }}
              />
              <input
                value={pickupDate}
                onChange={e => setPickupDate(e.target.value)}
                placeholder="Pickup Date & Time"
                style={{ width: '100%', padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 11, fontWeight: 500, color: '#64748b', boxSizing: 'border-box', background: '#fff' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 9, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Destination (Delivery) *</label>
              <input
                required
                value={to}
                onChange={e => setTo(e.target.value)}
                placeholder="City, State"
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 700, outline: 'none', boxSizing: 'border-box', marginBottom: 6, background: '#fff' }}
              />
              <input
                value={deliveryDate}
                onChange={e => setDeliveryDate(e.target.value)}
                placeholder="Delivery Date & Time"
                style={{ width: '100%', padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 11, fontWeight: 500, color: '#64748b', boxSizing: 'border-box', background: '#fff' }}
              />
            </div>
          </div>

          {/* Row 3: Driver & Fleet */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: 9, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Assigned Driver *</label>
              <select
                value={driver}
                onChange={e => setDriver(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 700, outline: 'none', boxSizing: 'border-box', background: '#fff' }}
              >
                <option>Michael Chen</option>
                <option>Sarah Connor</option>
                <option>James Park</option>
                <option>David Wilson</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 9, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Vehicle / Truck *</label>
              <select
                value={vehicle}
                onChange={e => setVehicle(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 700, outline: 'none', boxSizing: 'border-box', background: '#fff' }}
              >
                <option>TRK-101 · Volvo FH540</option>
                <option>TRK-117 · Scania T500</option>
                <option>TRK-104 · Kenworth T680</option>
                <option>TRK-108 · Freightliner</option>
              </select>
            </div>
          </div>

          {/* Row 4: Cargo Manifest */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
            <p style={{ fontSize: 9, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Package size={13} color="#64748b" /> Cargo Item / Vehicle Manifest
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1.4fr 1fr', gap: 6 }}>
              <div>
                <label style={{ fontSize: 8, fontWeight: 800, color: '#64748b' }}>REGO</label>
                <input value={rego} onChange={e => setRego(e.target.value)} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 11, fontWeight: 700, boxSizing: 'border-box', background: '#fff' }} />
              </div>
              <div>
                <label style={{ fontSize: 8, fontWeight: 800, color: '#64748b' }}>VIN / CHASSIS</label>
                <input value={vin} onChange={e => setVin(e.target.value)} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 10, fontFamily: 'monospace', fontWeight: 600, boxSizing: 'border-box', background: '#fff' }} />
              </div>
              <div>
                <label style={{ fontSize: 8, fontWeight: 800, color: '#64748b' }}>MODEL</label>
                <input value={model} onChange={e => setModel(e.target.value)} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 11, fontWeight: 700, boxSizing: 'border-box', background: '#fff' }} />
              </div>
              <div>
                <label style={{ fontSize: 8, fontWeight: 800, color: '#64748b' }}>COLOUR</label>
                <input value={colour} onChange={e => setColour(e.target.value)} style={{ width: '100%', padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 11, fontWeight: 700, boxSizing: 'border-box', background: '#fff' }} />
              </div>
            </div>
          </div>

          {/* Row 5: Notes */}
          <div>
            <label style={{ display: 'block', fontSize: 9, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Special Delivery Instructions</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Call driver 30 mins before arrival..."
              style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 11, fontWeight: 500, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '8px 14px', background: '#fff', border: '1px solid #e2e8f0', color: '#475569', fontWeight: 700, borderRadius: 10, cursor: 'pointer', fontSize: 12 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: '#4f46e5', color: '#fff', fontWeight: 800, borderRadius: 10, cursor: 'pointer', fontSize: 12, border: 'none', boxShadow: '0 2px 8px rgba(79,70,229,0.25)' }}
            >
              <Check size={14} /> Create &amp; Dispatch Load
            </button>
          </div>
        </form>
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
  const [showCreateModal, setShowCreateModal] = useState(false);
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

  const handleCreateManualLoad = (newLoad) => {
    setData(prev => [newLoad, ...prev]);
    setShowCreateModal(false);
    showToast(`Manual Load ${newLoad.id} created & dispatched!`, 'success');
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
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 10000, padding: '12px 20px', borderRadius: 14, background: toast.type === 'success' ? '#16a34a' : '#dc2626', color: '#fff', fontWeight: 700, fontSize: 13, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* DRAFT REVIEW MODAL */}
      {selected && (
        <DraftModal
          draft={selected}
          onClose={() => setSelected(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {/* CREATE MANUAL LOAD MODAL */}
      {showCreateModal && (
        <CreateManualLoadModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateManualLoad}
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
            onClick={() => setShowCreateModal(true)}
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
