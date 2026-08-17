import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  ClipboardCheck, CheckCircle2, XCircle, AlertTriangle,
  Clock, User, MapPin, Wrench, ShieldCheck, Package,
  ChevronRight, ChevronDown, Loader2
} from 'lucide-react';

const CHECKLIST_GROUPS = [
  {
    id: 'forklift',
    label: 'Forklift / Reach Truck',
    icon: '🔧',
    items: [
      { id: 'f1', label: 'Forks – condition, no cracks or bends' },
      { id: 'f2', label: 'Mast – smooth lift, no hydraulic leaks' },
      { id: 'f3', label: 'Tyres / wheels – inflation & condition' },
      { id: 'f4', label: 'Horn – functional' },
      { id: 'f5', label: 'Reverse alarm / blue safety light' },
      { id: 'f6', label: 'Seatbelt – operational' },
      { id: 'f7', label: 'Overhead guard – secure' },
      { id: 'f8', label: 'Lights (headlights, warning lights)' },
      { id: 'f9', label: 'Battery charge level (electric) / Fuel level (LPG)' },
      { id: 'f10', label: 'Fluid levels (hydraulic, coolant)' },
    ]
  },
  {
    id: 'pallet_jack',
    label: 'Pallet Jack / Hand Truck',
    icon: '🛒',
    items: [
      { id: 'p1', label: 'Forks – no damage or sharp edges' },
      { id: 'p2', label: 'Pump handle – smooth action' },
      { id: 'p3', label: 'Wheels – roll freely, no flat spots' },
      { id: 'p4', label: 'Release valve – functions correctly' },
      { id: 'p5', label: 'Load capacity label – visible & intact' },
    ]
  },
  {
    id: 'safety',
    label: 'Personal Safety & PPE',
    icon: '🦺',
    items: [
      { id: 's1', label: 'Hi-vis vest – worn' },
      { id: 's2', label: 'Safety boots – steel-capped' },
      { id: 's3', label: 'Hard hat – if applicable to zone' },
      { id: 's4', label: 'Gloves – appropriate for task' },
      { id: 's5', label: 'Eye protection – if applicable' },
    ]
  },
  {
    id: 'area',
    label: 'Warehouse Area & Dock',
    icon: '🏭',
    items: [
      { id: 'a1', label: 'Aisles clear of obstructions' },
      { id: 'a2', label: 'Dock levellers – operational' },
      { id: 'a3', label: 'Emergency exits – unobstructed' },
      { id: 'a4', label: 'Fire extinguishers – accessible' },
      { id: 'a5', label: 'Spill kit – in place' },
      { id: 'a6', label: 'No unsecured items at height' },
    ]
  },
];

const STATUS_OPTIONS = ['PASS', 'FAIL', 'NA', 'NOT_CHECKED'];

export default function WarehouseMyShift() {
  const [shiftStarted, setShiftStarted] = useState(false);
  const [shiftStartTime, setShiftStartTime] = useState(null);
  const [checklistState, setChecklistState] = useState(() => {
    const initial = {};
    CHECKLIST_GROUPS.forEach(g => g.items.forEach(i => {
      initial[i.id] = 'NOT_CHECKED';
    }));
    return initial;
  });
  const [expandedGroups, setExpandedGroups] = useState({ forklift: true, pallet_jack: true, safety: true, area: true });
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [profile, setProfile] = useState(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    api.get('/warehouse-portal/profile').then(res => {
      if (res.data?.success) setProfile(res.data.data.profile);
    }).catch(() => {});
  }, []);

  const totalItems = CHECKLIST_GROUPS.reduce((sum, g) => sum + g.items.length, 0);
  const passCount = Object.values(checklistState).filter(v => v === 'PASS').length;
  const failCount = Object.values(checklistState).filter(v => v === 'FAIL').length;
  const checkedCount = Object.values(checklistState).filter(v => v !== 'NOT_CHECKED').length;
  const progressPercent = Math.round((checkedCount / totalItems) * 100);
  const canSubmit = checkedCount === totalItems;

  const handleItemStatus = (itemId, status) => {
    setChecklistState(prev => ({ ...prev, [itemId]: status }));
  };

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const handleStartShift = () => {
    setShiftStarted(true);
    setShiftStartTime(new Date());
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await api.post('/warehouse-portal/safety-checklist', {
        items: Object.entries(checklistState).map(([id, status]) => ({ id, status })),
        notes,
        isDraft: false,
        type: 'WAREHOUSE_PRE_SHIFT'
      });
      setSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to submit checklist. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const statusColor = (s) => {
    if (s === 'PASS') return '#10B981';
    if (s === 'FAIL') return '#EF4444';
    if (s === 'NA') return '#94A3B8';
    return '#E2E8F0';
  };

  const statusLabel = (s) => {
    if (s === 'PASS') return 'PASS';
    if (s === 'FAIL') return 'FAIL';
    if (s === 'NA') return 'N/A';
    return '—';
  };

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '20px 16px', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ─── PAGE HEADER ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <ClipboardCheck size={24} color="#F59E0B" />
            My Shift — Pre-Start Checklist
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748B' }}>
            Complete your equipment and area checks before starting your shift.
          </p>
        </div>
        <div style={{ textAlign: 'right', fontSize: 12, color: '#64748B' }}>
          <div style={{ fontWeight: 700, color: '#0F172A' }}>{now.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginTop: 2 }}>
            <Clock size={13} color="#94A3B8" />
            <span>{now.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      {/* ─── SHIFT STATUS CARD ─── */}
      <div style={{ background: shiftStarted ? '#ECFDF5' : '#FFF7ED', border: `1px solid ${shiftStarted ? '#6EE7B7' : '#FED7AA'}`, borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: shiftStarted ? '#10B981' : '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20 }}>
            {shiftStarted ? <CheckCircle2 size={22} /> : <Clock size={22} />}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#0F172A' }}>
              {shiftStarted ? `Shift Started — ${shiftStartTime?.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}` : 'Shift Not Started'}
            </div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <User size={11} />
                {profile?.name || 'Warehouse Staff'}
              </span>
              {profile?.depot && (
                <span style={{ marginLeft: 10, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={11} />
                  {profile.depot}
                </span>
              )}
            </div>
          </div>
        </div>
        {!shiftStarted && (
          <button
            onClick={handleStartShift}
            style={{ padding: '10px 20px', background: '#F59E0B', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: 13, color: '#0F172A', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Start Shift
          </button>
        )}
        {shiftStarted && (
          <div style={{ fontSize: 12, color: '#10B981', fontWeight: 700 }}>✓ On Shift</div>
        )}
      </div>

      {submitted ? (
        /* ─── SUCCESS STATE ─── */
        <div style={{ background: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: 16, padding: '40px 24px', textAlign: 'center' }}>
          <CheckCircle2 size={52} color="#10B981" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#064E3B', margin: '0 0 8px' }}>Shift Checklist Submitted</h2>
          <p style={{ color: '#065F46', fontSize: 13, margin: 0 }}>
            {passCount} items passed · {failCount > 0 ? `${failCount} failures noted` : 'No failures'} · Submitted at {new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <button
            onClick={() => { setSubmitted(false); setChecklistState(prev => { const r = {}; Object.keys(prev).forEach(k => r[k] = 'NOT_CHECKED'); return r; }); setNotes(''); setShiftStarted(false); setShiftStartTime(null); }}
            style={{ marginTop: 20, padding: '10px 24px', background: '#10B981', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: 13, cursor: 'pointer' }}
          >
            New Checklist
          </button>
        </div>
      ) : (
        <>
          {/* ─── PROGRESS BAR ─── */}
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '12px 16px', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>Progress: {checkedCount} / {totalItems} items checked</span>
              <div style={{ display: 'flex', gap: 12, fontSize: 11.5, fontWeight: 600 }}>
                <span style={{ color: '#10B981' }}>✓ {passCount} Pass</span>
                {failCount > 0 && <span style={{ color: '#EF4444' }}>✗ {failCount} Fail</span>}
              </div>
            </div>
            <div style={{ height: 8, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progressPercent}%`, background: failCount > 0 ? '#EF4444' : '#10B981', borderRadius: 4, transition: 'width 0.3s ease' }} />
            </div>
          </div>

          {/* ─── CHECKLIST GROUPS ─── */}
          {CHECKLIST_GROUPS.map(group => (
            <div key={group.id} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, marginBottom: 16, overflow: 'hidden' }}>
              <button
                onClick={() => toggleGroup(group.id)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer', borderBottom: expandedGroups[group.id] ? '1px solid #F1F5F9' : 'none' }}
              >
                <span style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{group.icon}</span>
                  {group.label}
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', background: '#F1F5F9', padding: '2px 8px', borderRadius: 20 }}>
                    {group.items.filter(i => checklistState[i.id] !== 'NOT_CHECKED').length} / {group.items.length}
                  </span>
                </span>
                {expandedGroups[group.id] ? <ChevronDown size={16} color="#94A3B8" /> : <ChevronRight size={16} color="#94A3B8" />}
              </button>

              {expandedGroups[group.id] && (
                <div>
                  {group.items.map((item, idx) => {
                    const status = checklistState[item.id];
                    return (
                      <div
                        key={item.id}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: idx < group.items.length - 1 ? '1px solid #F8FAFC' : 'none', background: status === 'FAIL' ? '#FFF5F5' : 'transparent' }}
                      >
                        <div style={{ flex: 1, fontSize: 12.5, fontWeight: 600, color: status === 'FAIL' ? '#991B1B' : '#334155' }}>
                          {item.label}
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                          {STATUS_OPTIONS.map(s => (
                            <button
                              key={s}
                              onClick={() => handleItemStatus(item.id, s)}
                              title={s}
                              style={{
                                width: s === 'NOT_CHECKED' ? 28 : 44,
                                height: 28,
                                borderRadius: 6,
                                border: status === s ? `2px solid ${statusColor(s)}` : '1.5px solid #E2E8F0',
                                background: status === s ? statusColor(s) : '#F8FAFC',
                                color: status === s ? (s === 'NA' ? '#475569' : '#fff') : '#94A3B8',
                                fontSize: s === 'NOT_CHECKED' ? 14 : 10,
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              {s === 'PASS' ? '✓' : s === 'FAIL' ? '✗' : s === 'NA' ? 'N/A' : '—'}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {/* ─── NOTES ─── */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
              Additional Notes / Issues Observed
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Describe any issues, defects, or observations..."
              rows={3}
              style={{ width: '100%', border: '1px solid #CBD5E1', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#334155', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>

          {/* ─── SUBMIT BUTTON ─── */}
          {failCount > 0 && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', background: '#FFF5F5', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginBottom: 14 }}>
              <AlertTriangle size={16} color="#DC2626" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ margin: 0, fontSize: 12, color: '#991B1B', fontWeight: 600 }}>
                {failCount} item(s) marked as FAIL. Please report these to your supervisor before operating equipment.
              </p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting || !shiftStarted}
            style={{
              width: '100%',
              height: 48,
              borderRadius: 12,
              border: 'none',
              background: canSubmit && shiftStarted ? (failCount > 0 ? '#EF4444' : '#10B981') : '#E2E8F0',
              color: canSubmit && shiftStarted ? '#fff' : '#94A3B8',
              fontSize: 14,
              fontWeight: 800,
              cursor: canSubmit && shiftStarted && !submitting ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'background 0.2s ease'
            }}
          >
            {submitting
              ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Submitting...</>
              : !shiftStarted
              ? 'Start Shift First'
              : !canSubmit
              ? `Complete All Items (${totalItems - checkedCount} remaining)`
              : failCount > 0
              ? `⚠ Submit with ${failCount} Failures Noted`
              : '✓ Submit Pre-Start Checklist'
            }
          </button>

          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
        </>
      )}
    </div>
  );
}
