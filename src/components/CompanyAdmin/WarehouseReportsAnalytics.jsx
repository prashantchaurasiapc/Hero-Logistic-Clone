import React from 'react';

// === ICONS ===
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const ExportIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);
const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
  </svg>
);
const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);
const CalendarIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);
const FileTextIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);
const BoxIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);
const CheckCircleIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);
const RefreshCwIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);
const UsersIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);
const CodeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);
const ShieldIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);
const TargetIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>
  </svg>
);
const AlertTriangleIcon = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);
const SmallCircleIcon = ({ color }) => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
  </svg>
);

const mockPerformance = [
  { loc: 'Main Storage A1', util: 65.3, val: '$512,650.00', acc: '99.3%', ful: '385', time: '00:05:12' },
  { loc: 'Main Storage A2', util: 52.1, val: '$389,200.00', acc: '98.7%', ful: '298', time: '00:05:48' },
  { loc: 'Bulk Storage B1', util: 70.4, val: '$168,350.00', acc: '99.1%', ful: '215', time: '00:05:02' },
  { loc: 'Bulk Storage B2', util: 61.6, val: '$112,400.00', acc: '98.9%', ful: '162', time: '00:05:21' },
  { loc: 'Dispatch Area D1', util: 85.2, val: '$48,600.00', acc: '99.6%', ful: '134', time: '00:04:31' },
  { loc: 'Staging Area S1', util: 48.7, val: '$25,650.00', acc: '98.8%', ful: '92', time: '00:05:02' },
];

export default function WarehouseReportsAnalytics({ wh, onBack }) {
  const [showCustomReportModal, setShowCustomReportModal] = React.useState(false);
  return (
    <div className="wh-reports-container" style={{ background: '#F8FAFC', minHeight: '100vh', padding: '24px 32px', fontFamily: "'Inter','Outfit',sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @media (max-width: 900px) {
          .wh-reports-container { padding: 16px !important; }
          .wh-devnotes-cols { grid-template-columns: 1fr !important; gap: 20px !important; }
        }
      `}</style>
      {/* BREADCRUMBS & HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span>Home</span> <span style={{ color: '#CBD5E1' }}>›</span> <span>Warehouse</span> <span style={{ color: '#CBD5E1' }}>›</span> <span style={{ color: '#0F172A' }}>Warehouse Reports & Analytics</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>9.8 Warehouse Reports & Analytics – {wh?.name || 'Sydney Head Office Warehouse'}</h1>
            <div style={{ width: 18, height: 18, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
              <ShieldIcon color="#8B5CF6" />
            </div>
          </div>
          <p style={{ fontSize: 13, color: '#64748B', margin: '6px 0 0 0', fontWeight: 500 }}>Gain insights into inventory, movements, productivity and warehouse performance.</p>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
          <button onClick={onBack} style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
            &lt; Back to Warehouse
          </button>
          <button onClick={() => setShowCustomReportModal(true)} style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid #C7D2FE', background: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 14, fontWeight: 400, marginTop: -2 }}>+</span> Create Custom Report
          </button>
          <button style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
            More Actions <span style={{ fontSize: 9 }}>▼</span>
          </button>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { title: 'TOTAL INVENTORY VALUE', value: '$1,256,850.00', subtitle: 'Across all locations', color: '#8B5CF6', bg: '#F5F3FF', icon: <CalendarIcon color="#8B5CF6" />, link: 'inventory value' },
          { title: 'TOTAL MOVEMENTS', value: '1,286', subtitle: 'This Month', color: '#22C55E', bg: '#F0FDF4', icon: <RefreshCwIcon color="#22C55E" />, link: 'movements' },
          { title: 'ORDER FULFILMENT RATE', value: '96.8%', subtitle: 'This Month', color: '#3B82F6', bg: '#EFF6FF', icon: <FileTextIcon color="#3B82F6" />, link: 'performance' },
          { title: 'INVENTORY TURNOVER', value: '8.42', subtitle: 'This Month', color: '#F59E0B', bg: '#FFFBEB', icon: <UsersIcon color="#F59E0B" />, link: 'analysis' },
          { title: 'STORAGE UTILISATION', value: '59.9%', subtitle: 'Overall utilisation', color: '#22C55E', bg: '#F0FDF4', icon: <BoxIcon color="#22C55E" />, link: 'utilisation' },
          { title: 'PICKING ACCURACY', value: '99.2%', subtitle: 'This Month', color: '#8B5CF6', bg: '#F5F3FF', icon: <TargetIcon color="#8B5CF6" />, link: 'accuracy' }
        ].map((stat, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '16px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#64748B', letterSpacing: '0.5px', marginBottom: 12 }}>{stat.title}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {stat.icon}
              </div>
              <div style={{ flex: '1 1 100px', minWidth: 0 }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', lineHeight: 1.1, overflowWrap: 'break-word', wordBreak: 'break-word' }}>{stat.value}</div>
                <div style={{ fontSize: 11, fontWeight: 500, color: '#64748B', marginTop: 4 }}>{stat.subtitle}</div>
              </div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#4F46E5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, marginTop: 'auto' }}>
              View {stat.link} <span>→</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {/* LEFT MAIN */}
        <div style={{ flex: '1 1 500px', minWidth: 0 }}>


          {/* FILTERS ROW */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 10, flex: 1, flexWrap: 'wrap', minWidth: 280 }}>
              <div style={{ position: 'relative', width: 220 }}>
                <div style={{ position: 'absolute', left: 10, top: 7 }}><SearchIcon /></div>
                <input type="text" value="01 Jul 2024 - 30 Jun 2025" readOnly style={{ width: '100%', padding: '6px 10px 6px 34px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, outline: 'none', color: '#1E293B', fontWeight: 500 }} />
              </div>
              {['All Warehouses', 'All Locations', 'All Categories', 'All Customers'].map((filter, idx) => (
                <div key={idx} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, fontWeight: 500, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6, background: '#fff', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {filter} <span style={{ fontSize: 9, color: '#94A3B8' }}>▼</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, fontWeight: 600, color: '#1E293B', background: '#fff', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <FilterIcon /> Filters
              </button>
              <button style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, fontWeight: 600, color: '#1E293B', background: '#fff', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <ExportIcon /> Export
              </button>
              <button style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <RefreshIcon />
              </button>
            </div>
          </div>

          {/* ROW 1: CHARTS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
            {/* INVENTORY VALUE OVER TIME */}
            <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px' }}>INVENTORY VALUE OVER TIME</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#4F46E5', cursor: 'pointer' }}>View Report →</div>
              </div>
              <div style={{ height: 160, position: 'relative' }}>
                {/* Mock Chart */}
                <div style={{ position: 'absolute', left: 0, bottom: 20, top: 0, width: 30, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: 9, color: '#94A3B8', textAlign: 'right', paddingRight: 4 }}>
                  <span>$1.5M</span><span>$1.2M</span><span>$900K</span><span>$600K</span><span>$300K</span><span>$0</span>
                </div>
                <div style={{ position: 'absolute', left: 35, right: 0, bottom: 20, top: 6, borderLeft: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
                  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polyline points="0,70 15,60 30,65 45,50 60,35 75,40 90,20 100,10" fill="none" stroke="#8B5CF6" strokeWidth="2" />
                    <circle cx="90" cy="20" r="3" fill="#8B5CF6" />
                  </svg>
                  {/* Tooltip mockup */}
                  <div style={{ position: 'absolute', right: '5%', top: '-5%', background: '#fff', border: '1px solid #E2E8F0', borderRadius: 4, padding: '4px 6px', fontSize: 9, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                    <div style={{ color: '#64748B', marginBottom: 2 }}>30 Jun 2025</div>
                    <div style={{ color: '#0F172A', fontWeight: 700 }}>$1,256,850</div>
                  </div>
                </div>
                <div style={{ position: 'absolute', left: 35, right: 0, bottom: 0, display: 'flex', justifyContent: 'space-between', fontSize: 8, color: '#94A3B8', paddingTop: 4 }}>
                  <span>Jul 2024</span><span>Sep 2024</span><span>Nov 2024</span><span>Jan 2025</span><span>Mar 2025</span><span>May 2025</span><span>Jun 2025</span>
                </div>
              </div>
            </div>

            {/* STOCK MOVEMENTS SUMMARY */}
            <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px' }}>STOCK MOVEMENTS SUMMARY</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#4F46E5', cursor: 'pointer' }}>View Report →</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0, borderRadius: '50%', background: 'conic-gradient(#22C55E 0% 49.9%, #EF4444 49.9% 80.9%, #3B82F6 80.9% 97.1%, #8B5CF6 97.1% 103.9%, #F59E0B 103.9% 100%)' }}>
                  <div style={{ position: 'absolute', top: 18, left: 18, right: 18, bottom: 18, background: '#fff', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>1,286</div>
                    <div style={{ fontSize: 8, fontWeight: 700, color: '#64748B', marginTop: 2 }}>Total</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: '1 1 120px', minWidth: 0 }}>
                  {[
                    { label: 'Stock In', val: '642', pct: '49.9%', color: '#22C55E' },
                    { label: 'Stock Out', val: '398', pct: '31.0%', color: '#EF4444' },
                    { label: 'Transfers', val: '208', pct: '16.2%', color: '#3B82F6' },
                    { label: 'Adjustments', val: '87', pct: '6.8%', color: '#8B5CF6' },
                    { label: 'Cancelled', val: '51', pct: '4.0%', color: '#F59E0B' }
                  ].map((l, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 10, fontWeight: 600, color: '#1E293B', lineHeight: 1.4 }}>
                        <div style={{ marginTop: 2, flexShrink: 0 }}><SmallCircleIcon color={l.color} /></div>
                        {l.label}
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: '#0F172A', display: 'flex', gap: 4, flexShrink: 0, lineHeight: 1.4, textAlign: 'right' }}>
                        <span>{l.val}</span> <span style={{ color: '#64748B' }}>({l.pct})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ORDERS & FULFILMENT OVER TIME */}
            <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px' }}>ORDERS & FULFILMENT OVER TIME</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#4F46E5', cursor: 'pointer' }}>View Report →</div>
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: '#64748B' }}><SmallCircleIcon color="#3B82F6" /> Orders</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: '#22C55E' }}><SmallCircleIcon color="#22C55E" /> Fulfilled</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: '#8B5CF6' }}><SmallCircleIcon color="#8B5CF6" /> Fulfilment Rate (%)</div>
              </div>
              <div style={{ height: 120, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, bottom: 20, top: 0, width: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: 8, color: '#94A3B8', textAlign: 'right', paddingRight: 4 }}>
                  <span>100</span><span>80</span><span>60</span><span>40</span><span>20</span><span>0</span>
                </div>
                <div style={{ position: 'absolute', right: 0, bottom: 20, top: 0, width: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: 8, color: '#94A3B8', textAlign: 'left', paddingLeft: 4 }}>
                  <span>100%</span><span>80%</span><span>60%</span><span>40%</span><span>20%</span><span>0%</span>
                </div>
                <div style={{ position: 'absolute', left: 25, right: 25, bottom: 20, top: 6, borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 4px' }}>
                  {[80, 85, 75, 90, 88, 95, 92].map((val, i) => (
                    <div key={i} style={{ display: 'flex', gap: 2, height: '100%', alignItems: 'flex-end' }}>
                      <div style={{ width: 6, height: `${val}%`, background: '#3B82F6', borderRadius: '2px 2px 0 0' }}></div>
                      <div style={{ width: 6, height: `${val - 5}%`, background: '#22C55E', borderRadius: '2px 2px 0 0' }}></div>
                    </div>
                  ))}
                  <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} preserveAspectRatio="none">
                    <polyline points="10,20 40,15 70,30 100,10 130,12 160,5 190,8" fill="none" stroke="#8B5CF6" strokeWidth="2" />
                  </svg>
                </div>
                <div style={{ position: 'absolute', left: 25, right: 25, bottom: 0, display: 'flex', justifyContent: 'space-between', fontSize: 7, color: '#94A3B8', paddingTop: 4 }}>
                  <span>Jul 2024</span><span>Sep 2024</span><span>Nov 2024</span><span>Jan 2025</span><span>Mar 2025</span><span>May 2025</span><span>Jun 2025</span>
                </div>
              </div>
            </div>
          </div>

          {/* ROW 2: TABLE & PIES */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {/* TABLE */}
            <div style={{ flex: '1.5 1 400px', background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', padding: 16, overflowX: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px' }}>WAREHOUSE PERFORMANCE BY LOCATION</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#4F46E5', cursor: 'pointer' }}>View Report →</div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ padding: '8px 4px', fontSize: 9, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Location</th>
                    <th style={{ padding: '8px 4px', fontSize: 9, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Storage Utilisation</th>
                    <th style={{ padding: '8px 4px', fontSize: 9, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Inventory Value</th>
                    <th style={{ padding: '8px 4px', fontSize: 9, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Pick Accuracy</th>
                    <th style={{ padding: '8px 4px', fontSize: 9, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Orders Fulfilled</th>
                    <th style={{ padding: '8px 4px', fontSize: 9, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Avg. Pick Time</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPerformance.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: idx === 5 ? 'none' : '1px solid #E2E8F0' }}>
                      <td style={{ padding: '10px 4px', fontSize: 10, fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap' }}>{row.loc}</td>
                      <td style={{ padding: '10px 4px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 10, fontWeight: 500, color: '#1E293B' }}>{row.util}%</span>
                          <div style={{ width: 40, height: 4, background: '#E2E8F0', borderRadius: 2 }}>
                            <div style={{ width: `${row.util}%`, height: '100%', background: '#4F46E5', borderRadius: 2 }}></div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '10px 4px', fontSize: 10, fontWeight: 500, color: '#0F172A', whiteSpace: 'nowrap' }}>{row.val}</td>
                      <td style={{ padding: '10px 4px', fontSize: 10, fontWeight: 500, color: '#0F172A', whiteSpace: 'nowrap' }}>{row.acc}</td>
                      <td style={{ padding: '10px 4px', fontSize: 10, fontWeight: 500, color: '#0F172A', whiteSpace: 'nowrap' }}>{row.ful}</td>
                      <td style={{ padding: '10px 4px', fontSize: 10, fontWeight: 500, color: '#0F172A', whiteSpace: 'nowrap' }}>{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* AGEING */}
            <div style={{ flex: '1 1 300px', background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px' }}>INVENTORY AGEING</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#4F46E5', cursor: 'pointer' }}>View Report →</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0, borderRadius: '50%', background: 'conic-gradient(#22C55E 0% 45%, #3B82F6 45% 69.8%, #8B5CF6 69.8% 86.2%, #EF4444 86.2% 95.9%, #F59E0B 95.9% 100%)' }}>
                  <div style={{ position: 'absolute', top: 18, left: 18, right: 18, bottom: 18, background: '#fff', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>4,125</div>
                    <div style={{ fontSize: 8, fontWeight: 700, color: '#64748B', marginTop: 2, textAlign: 'center' }}>Total Items</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: '1 1 120px', minWidth: 0 }}>
                  {[
                    { label: '0 - 30 Days', val: '1,856', pct: '45.0%', color: '#22C55E' },
                    { label: '31 - 60 Days', val: '1,024', pct: '24.8%', color: '#3B82F6' },
                    { label: '61 - 90 Days', val: '678', pct: '16.4%', color: '#8B5CF6' },
                    { label: '91 - 180 Days', val: '402', pct: '9.7%', color: '#EF4444' },
                    { label: '180+ Days', val: '165', pct: '4.0%', color: '#F59E0B' }
                  ].map((l, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 10, fontWeight: 600, color: '#1E293B', lineHeight: 1.4 }}>
                        <div style={{ marginTop: 2, flexShrink: 0 }}><SmallCircleIcon color={l.color} /></div>
                        {l.label}
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: '#0F172A', display: 'flex', gap: 4, flexShrink: 0, lineHeight: 1.4, textAlign: 'right' }}>
                        <span>{l.val}</span> <span style={{ color: '#64748B' }}>({l.pct})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* STATUS */}
            <div style={{ flex: '1 1 300px', background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px' }}>STOCK STATUS SUMMARY</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0, borderRadius: '50%', background: 'conic-gradient(#22C55E 0% 76.3%, #3B82F6 76.3% 93.8%, #F59E0B 93.8% 96.5%, #EF4444 96.5% 99.6%, #8B5CF6 99.6% 100%)' }}>
                  <div style={{ position: 'absolute', top: 18, left: 18, right: 18, bottom: 18, background: '#fff', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>4,125</div>
                    <div style={{ fontSize: 8, fontWeight: 700, color: '#64748B', marginTop: 2, textAlign: 'center' }}>Total Items</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: '1 1 120px', minWidth: 0 }}>
                  {[
                    { label: 'Available', val: '3,145', pct: '76.3%', color: '#22C55E' },
                    { label: 'Reserved', val: '720', pct: '17.5%', color: '#3B82F6' },
                    { label: 'On Order', val: '115', pct: '2.7%', color: '#F59E0B' },
                    { label: 'Low Stock', val: '128', pct: '3.1%', color: '#EF4444' },
                    { label: 'Out of Stock', val: '17', pct: '0.4%', color: '#8B5CF6' }
                  ].map((l, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 10, fontWeight: 600, color: '#1E293B', lineHeight: 1.4 }}>
                        <div style={{ marginTop: 2, flexShrink: 0 }}><SmallCircleIcon color={l.color} /></div>
                        {l.label}
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: '#0F172A', display: 'flex', gap: 4, flexShrink: 0, lineHeight: 1.4, textAlign: 'right' }}>
                        <span>{l.val}</span> <span style={{ color: '#64748B' }}>({l.pct})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
        {/* RIGHT SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: '1 1 300px', minWidth: 0 }}>
          {/* QUICK REPORTS */}
          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', padding: '16px' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', marginBottom: 16 }}>QUICK REPORTS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Inventory Valuation Report', 'Stock Movement Report', 'Pick & Pack Performance',
                'Warehouse Utilisation Report', 'Inventory Ageing Report', 'Slow Moving Items Report',
                'Stock Adjustment Report', 'Order Fulfilment Report', 'Storage Utilisation Report',
                'Top Customers Report'
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <div style={{ width: 18, height: 18, borderRadius: 4, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileTextIcon color="#4F46E5" />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#0F172A' }}>{r}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>
              View All Reports →
            </div>
          </div>

          {/* TOP MOVED ITEMS */}
          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px' }}>TOP MOVED ITEMS (THIS MONTH)</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#4F46E5', cursor: 'pointer' }}>View Report →</div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '4px', fontSize: 9, fontWeight: 700, color: '#64748B' }}>#</th>
                  <th style={{ padding: '4px', fontSize: 9, fontWeight: 700, color: '#64748B' }}>Item Name</th>
                  <th style={{ padding: '4px', fontSize: 9, fontWeight: 700, color: '#64748B', textAlign: 'right' }}>Movements</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 1, name: 'Engine Oil 10W-40 (5L)', val: '185' },
                  { id: 2, name: 'Brake Pad Set - Front', val: '152' },
                  { id: 3, name: 'Tyre 225/70R16', val: '118' },
                  { id: 4, name: 'Battery 105D31R', val: '96' },
                  { id: 5, name: 'Ratchet Strap 50mm', val: '90' },
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '8px 4px', fontSize: 10, color: '#64748B' }}>{row.id}</td>
                    <td style={{ padding: '8px 4px', fontSize: 10, fontWeight: 600, color: '#0F172A' }}>{row.name}</td>
                    <td style={{ padding: '8px 4px', fontSize: 10, fontWeight: 600, color: '#0F172A', textAlign: 'right' }}>{row.val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ALERTS & INSIGHTS */}
          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', padding: '16px' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', marginBottom: 16 }}>ALERTS & INSIGHTS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { text: 'Low stock items increased by 12% this month.', time: '15 min ago', color: '#F59E0B' },
                { text: '5 items are overdue for reordering.', time: '25 min ago', color: '#F59E0B' },
                { text: 'Storage utilisation is 59.9% (up 8.3%).', time: '1 hour ago', color: '#EF4444' },
                { text: '12 slow moving items detected.', time: '2 hours ago', color: '#F59E0B' },
                { text: '3 stock adjustments require review.', time: '3 hours ago', color: '#EF4444' },
              ].map((a, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ marginTop: 2 }}><AlertTriangleIcon color={a.color} /></div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: '#1E293B' }}>{a.text}</div>
                  </div>
                  <div style={{ fontSize: 9, color: '#64748B', whiteSpace: 'nowrap' }}>{a.time}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>
              View All Alerts →
            </div>
          </div>
        </div>
      </div>

      {/* DEVELOPER NOTES */}
      <div style={{ marginTop: 24, background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', padding: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: '#4F46E5' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CodeIcon />
          </div>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#4F46E5', margin: 0, letterSpacing: '0.5px' }}>DEVELOPER NOTES - WAREHOUSE REPORTS & ANALYTICS</h2>
        </div>

        <div className="wh-devnotes-cols" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#4F46E5' }}>1</div>
              PURPOSE
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#1E293B', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Provide actionable insights and KPIs.</li>
              <li>Support data-driven warehouse decisions.</li>
              <li>Monitor performance and identify issues.</li>
              <li>Track trends and improve efficiency.</li>
            </ul>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#4F46E5' }}>2</div>
              KEY FEATURES
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#1E293B', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Real-time KPI dashboard and charts.</li>
              <li>Pre-built and custom report generation.</li>
              <li>Filter by date, location, category, customer.</li>
              <li>Export to PDF, Excel or CSV.</li>
            </ul>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#4F46E5' }}>3</div>
              AUTOMATION & ALERTS
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#1E293B', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Auto-alert on KPI thresholds.</li>
              <li>Alert on low stock, slow movers, overstock.</li>
              <li>Scheduled reports via email.</li>
              <li>AI insights and recommendations.</li>
            </ul>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#4F46E5' }}>4</div>
              PERMISSIONS
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#1E293B', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Super Admin: Full access.</li>
              <li>Admin/Manager: Full access.</li>
              <li>Warehouse Staff: View assigned location.</li>
              <li>Dispatcher: View relevant reports.</li>
            </ul>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#4F46E5' }}>5</div>
              DATA SOURCES
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#1E293B', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Inventory & Stock module.</li>
              <li>Stock Movements module.</li>
              <li>Pick, Pack & Dispatch module.</li>
              <li>Sales Orders & Purchase Orders.</li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16, gap: 24, fontSize: 11, color: '#64748B', fontWeight: 500 }}>
        <div>All times shown in your local time (AEST)</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>• Data auto-refreshes every 5 minutes <RefreshCwIcon color="#64748B" /></div>
      </div>

      {/* CREATE CUSTOM REPORT MODAL */}
      {showCustomReportModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)' }} onClick={() => setShowCustomReportModal(false)}></div>
          <div style={{ background: '#fff', width: '550px', borderRadius: 16, padding: '32px', position: 'relative', zIndex: 1, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: 20, fontWeight: 800, color: '#0F172A' }}>Create Custom Report</h2>
            
            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Report Title</label>
                <input type="text" placeholder="e.g. Monthly KPI Summary" style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none' }} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Data Source module</label>
                  <select style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none', background: '#fff' }}>
                    <option>Inventory & Stock</option>
                    <option>Stock Movements</option>
                    <option>Pick, Pack & Dispatch</option>
                    <option>Warehouse Locations</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Date Range</label>
                  <select style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none', background: '#fff' }}>
                    <option>Last 7 Days</option>
                    <option>This Month</option>
                    <option>Last Month</option>
                    <option>Year to Date</option>
                    <option>Custom Range...</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Export Format</label>
                <div style={{ display: 'flex', gap: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}><input type="radio" name="exportFmt" defaultChecked /> PDF Report</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}><input type="radio" name="exportFmt" /> Excel (CSV)</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}><input type="radio" name="exportFmt" /> Dashboard View</label>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>
              <button onClick={() => setShowCustomReportModal(false)} style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#475569', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => setShowCustomReportModal(false)} style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', background: '#4F46E5', color: '#fff', cursor: 'pointer' }}>Generate Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
