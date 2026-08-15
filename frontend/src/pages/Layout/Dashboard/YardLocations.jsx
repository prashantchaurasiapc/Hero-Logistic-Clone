import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import {
  MapPin, Package, Layers, AlertTriangle, CheckCircle2,
  RefreshCw, ChevronDown, ChevronRight, Box, Loader2,
  Navigation, Warehouse, Truck, Archive
} from 'lucide-react';

const ZONE_COLORS = {
  'Zone A': '#3B82F6',
  'Zone B': '#10B981',
  'Zone C': '#F59E0B',
  'Zone D': '#8B5CF6',
  'DG Store': '#EF4444',
  'Container Yard': '#06B6D4',
  'default': '#64748B'
};

function ZoneBadge({ name }) {
  const color = ZONE_COLORS[name] || ZONE_COLORS.default;
  return (
    <span style={{
      display: 'inline-block',
      background: color + '18',
      color: color,
      border: `1px solid ${color}40`,
      borderRadius: 6,
      fontSize: 10,
      fontWeight: 800,
      padding: '2px 8px',
      letterSpacing: '0.04em'
    }}>
      {name}
    </span>
  );
}

function StatCard({ icon, label, value, color = '#3B82F6', sub }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E2E8F0',
      borderRadius: 12,
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 14,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
    }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {React.cloneElement(icon, { size: 20, color })}
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>{value ?? '—'}</div>
        <div style={{ fontSize: 11.5, fontWeight: 600, color: '#64748B', marginTop: 3 }}>{label}</div>
        {sub && <div style={{ fontSize: 10.5, color: '#94A3B8', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

export default function YardLocations() {
  const [stock, setStock] = useState([]);
  const [loadLanes, setLoadLanes] = useState([]);
  const [holdingAreas, setHoldingAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedZones, setExpandedZones] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    zones: true, lanes: true, staging: true
  });
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [stockRes, lanesRes, holdingRes] = await Promise.all([
        api.get('/warehouse-portal/stock').catch(() => ({ data: { success: false } })),
        api.get('/warehouse-portal/load-lanes').catch(() => ({ data: { success: false } })),
        api.get('/warehouse-portal/holding-areas').catch(() => ({ data: { success: false } }))
      ]);

      if (stockRes.data?.success) {
        setStock(stockRes.data.data?.items || stockRes.data.data || []);
      }
      if (lanesRes.data?.success) {
        setLoadLanes(lanesRes.data.data || []);
      }
      if (holdingRes.data?.success) {
        setHoldingAreas(holdingRes.data.data?.areas || holdingRes.data.data || []);
      }
      setLastRefresh(new Date());
    } catch (err) {
      setError('Failed to load location data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // Group stock by zone
  const zoneGroups = stock.reduce((acc, item) => {
    const zone = item.zone || item.location || 'Unknown Zone';
    if (!acc[zone]) acc[zone] = [];
    acc[zone].push(item);
    return acc;
  }, {});

  // Summary stats
  const totalItems = stock.length;
  const totalLanes = loadLanes.length;
  const totalStaging = holdingAreas.length;
  const activeLanes = loadLanes.filter(l => l.status === 'Active' || l.itemCount > 0).length;

  const toggleZone = (zone) => setExpandedZones(prev => ({ ...prev, [zone]: !prev[zone] }));
  const toggleSection = (key) => setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, gap: 16, fontFamily: 'Inter, system-ui, sans-serif' }}>
        <Loader2 size={36} color="#F59E0B" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#64748B', fontWeight: 600, fontSize: 14 }}>Loading yard locations...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '20px 16px', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ─── HEADER ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <MapPin size={24} color="#F59E0B" />
            Yard Locations
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748B' }}>
            Live view of all zones, bays, staging areas and load lanes in your depot.
            {lastRefresh && (
              <span style={{ marginLeft: 10, color: '#94A3B8', fontSize: 11 }}>
                Updated {lastRefresh.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={fetchAll}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 12, fontWeight: 700, color: '#475569', cursor: 'pointer' }}
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {error && (
        <div style={{ background: '#FFF5F5', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
          <AlertTriangle size={15} color="#DC2626" />
          <span style={{ fontSize: 12, color: '#991B1B', fontWeight: 600 }}>{error}</span>
        </div>
      )}

      {/* ─── SUMMARY STATS ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        <StatCard icon={<Package />} label="Total Items in Yard" value={totalItems} color="#3B82F6" sub="Across all zones" />
        <StatCard icon={<Navigation />} label="Load Lanes" value={`${activeLanes} / ${totalLanes}`} color="#10B981" sub="Active / Total" />
        <StatCard icon={<Archive />} label="Staging Areas" value={totalStaging} color="#8B5CF6" sub="Holding areas" />
        <StatCard icon={<Layers />} label="Zone Count" value={Object.keys(zoneGroups).length} color="#F59E0B" sub="Active zones" />
      </div>

      {/* ─── ZONE BREAKDOWN ─── */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, marginBottom: 20, overflow: 'hidden' }}>
        <button
          onClick={() => toggleSection('zones')}
          style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: 'transparent', border: 'none', cursor: 'pointer', borderBottom: expandedSections.zones ? '1px solid #F1F5F9' : 'none' }}
        >
          <span style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Warehouse size={16} color="#3B82F6" />
            Yard Zones & Bays
            <span style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', background: '#F1F5F9', padding: '2px 8px', borderRadius: 20 }}>{Object.keys(zoneGroups).length} zones</span>
          </span>
          {expandedSections.zones ? <ChevronDown size={16} color="#94A3B8" /> : <ChevronRight size={16} color="#94A3B8" />}
        </button>

        {expandedSections.zones && (
          <div style={{ padding: '8px 0' }}>
            {Object.keys(zoneGroups).length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>No items in yard zones</div>
            ) : (
              Object.entries(zoneGroups).map(([zone, items]) => {
                const color = ZONE_COLORS[zone] || ZONE_COLORS.default;
                const expanded = expandedZones[zone];
                // Group by row
                const rowGroups = items.reduce((acc, item) => {
                  const row = item.row || 'Unknown Row';
                  if (!acc[row]) acc[row] = [];
                  acc[row].push(item);
                  return acc;
                }, {});

                return (
                  <div key={zone} style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <button
                      onClick={() => toggleZone(zone)}
                      style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', background: expanded ? color + '06' : 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                        <ZoneBadge name={zone} />
                        <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>
                          {items.length} item{items.length !== 1 ? 's' : ''} · {Object.keys(rowGroups).length} row{Object.keys(rowGroups).length !== 1 ? 's' : ''}
                        </span>
                      </span>
                      {expanded ? <ChevronDown size={14} color="#94A3B8" /> : <ChevronRight size={14} color="#94A3B8" />}
                    </button>

                    {expanded && (
                      <div style={{ padding: '0 18px 12px 36px' }}>
                        {Object.entries(rowGroups).map(([row, rowItems]) => (
                          <div key={row} style={{ marginBottom: 10 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{row}</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 6 }}>
                              {rowItems.map(item => (
                                <div key={item.id} style={{
                                  background: '#F8FAFC',
                                  border: '1px solid #E2E8F0',
                                  borderRadius: 8,
                                  padding: '8px 12px',
                                  fontSize: 11.5
                                }}>
                                  <div style={{ fontWeight: 800, color: '#0F172A', marginBottom: 2 }}>{item.title || item.vin || item.rego || 'Item'}</div>
                                  <div style={{ color: '#64748B' }}>
                                    Bay: <strong>{item.bay || '—'}</strong> · Pos: <strong>{item.position || '—'}</strong>
                                  </div>
                                  {item.status && (
                                    <div style={{ marginTop: 4 }}>
                                      <span style={{
                                        fontSize: 10,
                                        fontWeight: 700,
                                        padding: '2px 6px',
                                        borderRadius: 4,
                                        background: item.status === 'IN_STORAGE' ? '#DBEAFE' : item.status === 'STAGED' ? '#D1FAE5' : '#FEF3C7',
                                        color: item.status === 'IN_STORAGE' ? '#1E40AF' : item.status === 'STAGED' ? '#065F46' : '#92400E'
                                      }}>
                                        {item.status?.replace(/_/g, ' ')}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* ─── LOAD LANES ─── */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, marginBottom: 20, overflow: 'hidden' }}>
        <button
          onClick={() => toggleSection('lanes')}
          style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: 'transparent', border: 'none', cursor: 'pointer', borderBottom: expandedSections.lanes ? '1px solid #F1F5F9' : 'none' }}
        >
          <span style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Truck size={16} color="#10B981" />
            Load Lanes
            <span style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', background: '#F1F5F9', padding: '2px 8px', borderRadius: 20 }}>{loadLanes.length} lanes</span>
          </span>
          {expandedSections.lanes ? <ChevronDown size={16} color="#94A3B8" /> : <ChevronRight size={16} color="#94A3B8" />}
        </button>

        {expandedSections.lanes && (
          <div style={{ padding: '12px 18px' }}>
            {loadLanes.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>No load lanes configured</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
                {loadLanes.map((lane, idx) => {
                  const occupancy = lane.itemCount || lane.loadItems?.length || 0;
                  const capacity = lane.capacity || 10;
                  const pct = Math.min(100, Math.round((occupancy / capacity) * 100));
                  const isActive = lane.status === 'Active' || occupancy > 0;
                  return (
                    <div key={lane.id || idx} style={{
                      background: isActive ? '#F0FDF4' : '#F8FAFC',
                      border: `1px solid ${isActive ? '#86EFAC' : '#E2E8F0'}`,
                      borderRadius: 10,
                      padding: '12px 14px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontSize: 12.5, fontWeight: 800, color: '#0F172A' }}>{lane.laneName || lane.name || `Lane ${idx + 1}`}</span>
                        <span style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '2px 7px',
                          borderRadius: 4,
                          background: isActive ? '#D1FAE5' : '#F1F5F9',
                          color: isActive ? '#065F46' : '#64748B'
                        }}>
                          {isActive ? 'ACTIVE' : 'EMPTY'}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: '#64748B', marginBottom: 8 }}>
                        {lane.area || 'Main Yard'} · {occupancy}/{capacity} items
                      </div>
                      <div style={{ height: 5, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: pct >= 80 ? '#EF4444' : pct >= 50 ? '#F59E0B' : '#10B981', borderRadius: 3, transition: 'width 0.4s ease' }} />
                      </div>
                      {lane.currentLoadRef && lane.currentLoadRef !== '-' && (
                        <div style={{ fontSize: 10.5, color: '#475569', marginTop: 6 }}>Load: <strong>{lane.currentLoadRef}</strong></div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── STAGING / HOLDING AREAS ─── */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, overflow: 'hidden' }}>
        <button
          onClick={() => toggleSection('staging')}
          style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: 'transparent', border: 'none', cursor: 'pointer', borderBottom: expandedSections.staging ? '1px solid #F1F5F9' : 'none' }}
        >
          <span style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Box size={16} color="#8B5CF6" />
            Staging / Holding Areas
            <span style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', background: '#F1F5F9', padding: '2px 8px', borderRadius: 20 }}>{holdingAreas.length} areas</span>
          </span>
          {expandedSections.staging ? <ChevronDown size={16} color="#94A3B8" /> : <ChevronRight size={16} color="#94A3B8" />}
        </button>

        {expandedSections.staging && (
          <div style={{ padding: '12px 18px' }}>
            {holdingAreas.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>No staging areas found</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
                {holdingAreas.map((area, idx) => {
                  const occupancy = area.stagedItems || area.itemCount || 0;
                  const capacity = area.capacity || 20;
                  const pct = Math.min(100, Math.round((occupancy / capacity) * 100));
                  return (
                    <div key={area.id || idx} style={{
                      background: '#FAFAFA',
                      border: '1px solid #E2E8F0',
                      borderRadius: 10,
                      padding: '12px 14px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: 12.5, fontWeight: 800, color: '#0F172A' }}>{area.name || `Stage ${idx + 1}`}</span>
                        <span style={{ fontSize: 10, fontWeight: 600, color: '#64748B' }}>{area.code || `SA-0${idx + 1}`}</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#64748B', marginBottom: 8 }}>
                        {area.zone || 'Zone A'} · {area.location || 'Main Yard'} · {occupancy}/{capacity} items
                      </div>
                      <div style={{ height: 5, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: pct >= 90 ? '#EF4444' : pct >= 60 ? '#F59E0B' : '#8B5CF6', borderRadius: 3, transition: 'width 0.4s ease' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10.5 }}>
                        <span style={{ color: '#64748B' }}>{pct}% full</span>
                        {area.awaitingMove > 0 && (
                          <span style={{ color: '#EF4444', fontWeight: 700 }}>⚠ {area.awaitingMove} awaiting move</span>
                        )}
                        {area.nextLane && (
                          <span style={{ color: '#8B5CF6', fontWeight: 600 }}>→ {area.nextLane}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* READ-ONLY NOTICE */}
      <div style={{ marginTop: 16, padding: '10px 14px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
        <CheckCircle2 size={14} color="#10B981" />
        <span style={{ fontSize: 11.5, color: '#64748B', fontWeight: 500 }}>
          This is a read-only operational view. Zone and area configuration is managed by the Warehouse Manager.
        </span>
      </div>
    </div>
  );
}
