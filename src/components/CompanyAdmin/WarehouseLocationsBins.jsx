import React from 'react';

// === ICONS ===
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>
  </svg>
);
const MoreHorizontalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle>
  </svg>
);
const CodeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);
const CalendarIcon2 = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);
const BoxCheckIcon2 = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>
    <path d="M9 13l2 2 4-4"></path>
  </svg>
);
const LayersIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
    <polyline points="2 12 12 17 22 12"></polyline>
    <polyline points="2 17 12 22 22 17"></polyline>
  </svg>
);
const LockIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);
const CheckCircleIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);
const AlertTriangleIcon = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);
const SmallCircleIcon = ({ color }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
  </svg>
);
const SmallCircleIconBordered = ({ color, border }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill={color} stroke={border} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
  </svg>
);

const mockLocations = [
  { code: 'A1', name: 'Main Storage A1', area: 'Main Storage', type: 'Floor', bins: '24', cap: '1,200', used: '780', util: '65%' },
  { code: 'A2', name: 'Main Storage A2', area: 'Main Storage', type: 'Floor', bins: '20', cap: '1,000', used: '520', util: '52%' },
  { code: 'B1', name: 'Bulk Storage B1', area: 'Bulk Storage', type: 'Floor', bins: '30', cap: '1,500', used: '1,050', util: '70%' },
  { code: 'B2', name: 'Bulk Storage B2', area: 'Bulk Storage', type: 'Floor', bins: '24', cap: '1,200', used: '890', util: '74%' },
  { code: 'R1', name: 'Rack Storage R1', area: 'Racking', type: 'Racking', bins: '60', cap: '1,800', used: '1,020', util: '57%' },
  { code: 'R2', name: 'Rack Storage R2', area: 'Racking', type: 'Racking', bins: '60', cap: '1,800', used: '1,420', util: '79%' },
  { code: 'D1', name: 'Dispatch Area D1', area: 'Dispatch', type: 'Floor', bins: '12', cap: '600', used: '210', util: '35%' },
  { code: 'D2', name: 'Dispatch Area D2', area: 'Dispatch', type: 'Floor', bins: '12', cap: '600', used: '180', util: '30%' },
  { code: 'Q1', name: 'Quarantine Area Q1', area: 'Quarantine', type: 'Floor', bins: '10', cap: '350', used: '120', util: '34%' },
  { code: 'R3', name: 'Returns Area R3', area: 'Returns', type: 'Floor', bins: '8', cap: '300', used: '75', util: '25%' },
];

export default function WarehouseLocationsBins({ wh, onBack }) {
  const [showAddLocationModal, setShowAddLocationModal] = React.useState(false);
  return (
    <div className="wh-bins-container" style={{ background: '#F8FAFC', minHeight: '100vh', padding: '24px 32px', fontFamily: "'Inter','Outfit',sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @media (max-width: 900px) {
          .wh-bins-container { padding: 16px !important; }
          .wh-devnotes-cols { grid-template-columns: 1fr !important; gap: 20px !important; }
        }
      `}</style>
      {/* BREADCRUMBS & HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span>Home</span> <span style={{ color: '#CBD5E1' }}>›</span> <span>Warehouse</span> <span style={{ color: '#CBD5E1' }}>›</span> <span style={{ color: '#0F172A' }}>Warehouse Locations & Bins</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>9.6 Warehouse Locations & Bins – {wh?.name || 'Sydney Head Office Warehouse'}</h1>
            <div style={{ width: 18, height: 18, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
          </div>
          <p style={{ fontSize: 13, color: '#64748B', margin: '6px 0 0 0', fontWeight: 500 }}>Manage warehouse areas, locations, shelving and bins. Organise storage and track capacity.</p>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
          <button onClick={onBack} style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
            &lt; Back to Warehouse
          </button>
          <button onClick={() => setShowAddLocationModal(true)} style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid #C7D2FE', background: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 14, fontWeight: 400, marginTop: -2 }}>+</span> Add Location / Bin
          </button>
          <button style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
            More Actions <span style={{ fontSize: 9 }}>▼</span>
          </button>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { title: 'TOTAL LOCATIONS', value: '28', subtitle: 'Active locations', color: '#8B5CF6', bg: '#F5F3FF', icon: <CalendarIcon2 color="#8B5CF6" />, link: 'locations' },
          { title: 'TOTAL BINS', value: '356', subtitle: 'All bins', color: '#22C55E', bg: '#F0FDF4', icon: <BoxCheckIcon2 color="#22C55E" />, link: 'bins' },
          { title: 'BIN CAPACITY', value: '8,750 m³', subtitle: 'Total capacity', color: '#3B82F6', bg: '#EFF6FF', icon: <LayersIcon color="#3B82F6" />, link: 'capacity' },
          { title: 'USED CAPACITY', value: '5,245 m³', subtitle: '59.9% utilised', color: '#F59E0B', bg: '#FFFBEB', icon: <LockIcon color="#F59E0B" />, link: 'utilisation' },
          { title: 'AVAILABLE CAPACITY', value: '3,505 m³', subtitle: '40.1% available', color: '#22C55E', bg: '#F0FDF4', icon: <CheckCircleIcon color="#22C55E" />, link: 'details' },
          { title: 'OVERFULL BINS', value: '8', subtitle: 'Exceeds capacity', color: '#EF4444', bg: '#FEF2F2', icon: <AlertTriangleIcon color="#EF4444" />, link: 'alerts' }
        ].map((stat, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '16px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#64748B', letterSpacing: '0.5px', marginBottom: 12 }}>{stat.title}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {stat.icon}
              </div>
              <div style={{ flex: '1 1 100px', minWidth: 0 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', lineHeight: 1.1, wordBreak: 'break-word', overflowWrap: 'break-word' }}>{stat.value}</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#64748B', marginTop: 2 }}>{stat.subtitle}</div>
              </div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#4F46E5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              View {stat.link} <span>→</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {/* LEFT MAIN */}
        <div style={{ flex: '1 1 500px', minWidth: 0 }}>

          {/* FILTERS */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 10, flex: 1, flexWrap: 'wrap', minWidth: 280 }}>
              <div style={{ position: 'relative', minWidth: 220, flexShrink: 0 }}>
                <div style={{ position: 'absolute', left: 10, top: 7 }}><SearchIcon /></div>
                <input type="text" placeholder="Search by location, code or area..." style={{ boxSizing: 'border-box', width: '100%', padding: '6px 10px 6px 34px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, outline: 'none' }} />
              </div>
              {['All Location Types', 'All Areas', 'All Status'].map((filter, idx) => (
                <div key={idx} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, fontWeight: 500, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6, background: '#fff', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {filter} <span style={{ fontSize: 9, color: '#94A3B8' }}>▼</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, fontWeight: 600, color: '#1E293B', background: '#fff', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <ExportIcon /> Export
              </button>
              <button style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <RefreshIcon />
              </button>
            </div>
          </div>

          {/* LOCATIONS TABLE */}
          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px' }}>WAREHOUSE LOCATIONS (28)</div>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Location Code</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Location Name</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Area / Zone</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Location Type</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Total Bins</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Capacity (m³)</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Used (m³)</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap', width: 140 }}>Utilisation</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>Status</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLocations.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap' }}>{row.code}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 500, color: '#0F172A', whiteSpace: 'nowrap' }}>{row.name}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 500, color: '#0F172A', whiteSpace: 'nowrap' }}>{row.area}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 500, color: '#0F172A', whiteSpace: 'nowrap' }}>{row.type}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{row.bins}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{row.cap}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{row.used}</td>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: '#0F172A', width: 28 }}>{row.util}</span>
                          <div style={{ flex: 1, height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ width: row.util, height: '100%', background: '#4F46E5', borderRadius: 3 }}></div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ display: 'inline-flex', padding: '4px 8px', borderRadius: 12, background: '#F0FDF4', color: '#22C55E', fontSize: 11, fontWeight: 600 }}>Active</span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#64748B' }}><EyeIcon /></button>
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#64748B' }}><MoreHorizontalIcon /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#64748B' }}>Showing 1 to 10 of 28 locations</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', color: '#64748B', fontSize: 12 }}>&lt;</button>
                <button style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: '1px solid #4F46E5', background: '#EEF2FF', cursor: 'pointer', color: '#4F46E5', fontSize: 12, fontWeight: 600 }}>1</button>
                <button style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', color: '#1E293B', fontSize: 12, fontWeight: 600 }}>2</button>
                <button style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', color: '#1E293B', fontSize: 12, fontWeight: 600 }}>3</button>
                <button style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', color: '#1E293B', fontSize: 12, fontWeight: 600 }}>...</button>
                <button style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', color: '#64748B', fontSize: 12 }}>&gt;</button>
              </div>
              <div style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: 12, fontWeight: 500, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6, background: '#fff', cursor: 'pointer' }}>
                10 / page <span style={{ fontSize: 9, color: '#94A3B8' }}>▼</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* WAREHOUSE LAYOUT */}
          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px' }}>WAREHOUSE LAYOUT</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#4F46E5', cursor: 'pointer' }}>View Full Layout →</div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 90px', gap: 8 }}>
              {/* Row 1 */}
              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 6, height: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A' }}>A1</div>
                <div style={{ fontSize: 8, color: '#15803D', fontWeight: 600 }}>Main Storage A1</div>
              </div>
              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 6, height: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A' }}>A2</div>
                <div style={{ fontSize: 8, color: '#15803D', fontWeight: 600 }}>Main Storage A2</div>
              </div>
              <div style={{ gridRow: '1 / span 2', background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A' }}>R1</div>
                <div style={{ fontSize: 8, color: '#6D28D9', fontWeight: 600 }}>Rack Storage R1</div>
              </div>

              {/* Row 2 */}
              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 6, height: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A' }}>B1</div>
                <div style={{ fontSize: 8, color: '#1D4ED8', fontWeight: 600 }}>Bulk Storage B1</div>
              </div>
              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 6, height: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A' }}>B2</div>
                <div style={{ fontSize: 8, color: '#1D4ED8', fontWeight: 600 }}>Bulk Storage B2</div>
              </div>

              {/* Row 3 */}
              <div style={{ background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 6, height: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A' }}>R2</div>
                <div style={{ fontSize: 8, color: '#6D28D9', fontWeight: 600 }}>Rack Storage R2</div>
              </div>
              <div style={{ background: '#FFF7ED', border: '1px solid #FFEDD5', borderRadius: 6, height: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A' }}>D1</div>
                <div style={{ fontSize: 8, color: '#C2410C', fontWeight: 600 }}>Dispatch Area D1</div>
              </div>
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 6, height: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A' }}>Q1</div>
                <div style={{ fontSize: 8, color: '#B91C1C', fontWeight: 600, textAlign: 'center', lineHeight: 1.1 }}>Quarantine<br/>Area Q1</div>
              </div>

              {/* Row 4 */}
              <div style={{ gridColumn: '1 / span 2', background: '#FFF7ED', border: '1px solid #FFEDD5', borderRadius: 6, height: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A' }}>D2</div>
                <div style={{ fontSize: 8, color: '#C2410C', fontWeight: 600 }}>Dispatch Area D2</div>
              </div>
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 6, height: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A' }}>R3</div>
                <div style={{ fontSize: 8, color: '#B91C1C', fontWeight: 600 }}>Returns Area R3</div>
              </div>
            </div>
          </div>

          {/* STORAGE UTILISATION */}
          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px' }}>STORAGE UTILISATION</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#4F46E5', cursor: 'pointer' }}>View Report →</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              {/* Donut Chart Mockup */}
              <div style={{ position: 'relative', width: 90, height: 90, borderRadius: '50%', background: 'conic-gradient(#22C55E 0% 59.9%, #E2E8F0 59.9% 100%)' }}>
                <div style={{ position: 'absolute', top: 14, left: 14, right: 14, bottom: 14, background: '#fff', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>5,245<br/>m³</div>
                  <div style={{ fontSize: 8, fontWeight: 700, color: '#64748B', marginTop: 2 }}>Used</div>
                </div>
              </div>
              {/* Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: '#1E293B' }}><SmallCircleIcon color="#4F46E5" /> Used</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#0F172A', display: 'flex', gap: 8 }}>
                    <span>5,245 m³</span> <span style={{ color: '#64748B' }}>(59.9%)</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: '#1E293B' }}><SmallCircleIcon color="#22C55E" /> Available</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#0F172A', display: 'flex', gap: 8 }}>
                    <span>3,505 m³</span> <span style={{ color: '#64748B' }}>(40.1%)</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, paddingTop: 10, borderTop: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#1E293B' }}><SmallCircleIconBordered color="#fff" border="#CBD5E1" /> Total Capacity</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>8,750 m³</div>
                </div>
              </div>
            </div>
          </div>

          {/* LOCATION TYPE BREAKDOWN */}
          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px' }}>LOCATION TYPE BREAKDOWN</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#4F46E5', cursor: 'pointer' }}>View Report →</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { name: 'Floor Storage', locs: '12', pct: '42.9%', color: '#3B82F6', bg: '#EFF6FF', w: '42.9%' },
                { name: 'Racking', locs: '6', pct: '21.4%', color: '#22C55E', bg: '#F0FDF4', w: '21.4%' },
                { name: 'Dispatch Area', locs: '4', pct: '14.3%', color: '#F59E0B', bg: '#FFFBEB', w: '14.3%' },
                { name: 'Quarantine Area', locs: '3', pct: '10.7%', color: '#EF4444', bg: '#FEF2F2', w: '10.7%' },
                { name: 'Returns Area', locs: '3', pct: '10.7%', color: '#8B5CF6', bg: '#F5F3FF', w: '10.7%' }
              ].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 120 }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <SmallCircleIconBordered color={t.color} border={t.bg} />
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#1E293B' }}>{t.name}</div>
                  </div>
                  <div style={{ fontSize: 10, color: '#64748B', width: 60 }}>{t.locs} locations</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 40, height: 4, background: '#E2E8F0', borderRadius: 2 }}>
                      <div style={{ width: t.w, height: '100%', background: t.color, borderRadius: 2 }}></div>
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: '#0F172A', width: 32, textAlign: 'right' }}>{t.pct}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DEVELOPER NOTES */}
      <div style={{ marginTop: 24, background: '#fff', borderRadius: 8, border: '1px solid #E2E8F0', padding: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: '#8B5CF6' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CodeIcon />
          </div>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#4F46E5', margin: 0, letterSpacing: '0.5px' }}>DEVELOPER NOTES - WAREHOUSE LOCATIONS & BINS</h2>
        </div>

        <div className="wh-devnotes-cols" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24 }}>
          {/* 1 */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#4F46E5' }}>1</div>
              PURPOSE
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#1E293B', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Organise physical warehouse structure.</li>
              <li>Define areas, locations and bin hierarchy.</li>
              <li>Track capacity and utilisation in real time.</li>
              <li>Support efficient picking and storage.</li>
            </ul>
          </div>
          {/* 2 */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#4F46E5' }}>2</div>
              KEY FEATURES
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#1E293B', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Manage locations, types and zones.</li>
              <li>Configure bins, shelves and levels.</li>
              <li>Capacity monitoring and visual layout.</li>
              <li>Bin status and overcapacity alerts.</li>
            </ul>
          </div>
          {/* 3 */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#4F46E5' }}>3</div>
              AUTOMATION & ALERTS
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#1E293B', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Alert when bins exceed capacity.</li>
              <li>Notify on inactive or blocked locations.</li>
              <li>Suggest optimal locations for storage.</li>
              <li>AI insights for layout optimisation.</li>
            </ul>
          </div>
          {/* 4 */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#4F46E5' }}>4</div>
              PERMISSIONS
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#1E293B', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Super Admin: Full access.</li>
              <li>Admin/Manager: Full access.</li>
              <li>Warehouse Staff: View and manage assigned areas.</li>
              <li>Dispatcher: View locations for planning.</li>
            </ul>
          </div>
          {/* 5 */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#4F46E5' }}>5</div>
              DATA SOURCES
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#1E293B', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Warehouse module.</li>
              <li>Inventory & Stock module.</li>
              <li>Pick, Pack & Dispatch module.</li>
              <li>Stock Movements module.</li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16, gap: 24, fontSize: 11, color: '#64748B', fontWeight: 500 }}>
        <div>All times shown in your local time (AEST)</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>• Data auto-refreshes every 5 minutes <RefreshIcon /></div>
      </div>

      {/* ADD LOCATION MODAL */}
      {showAddLocationModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)' }} onClick={() => setShowAddLocationModal(false)}></div>
          <div style={{ background: '#fff', width: '500px', borderRadius: 16, padding: '32px', position: 'relative', zIndex: 1, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: 20, fontWeight: 800, color: '#0F172A' }}>Add New Location / Bin</h2>
            
            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Bin Name / Identifier</label>
                <input type="text" placeholder="e.g. A-12-04" style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Zone</label>
                  <select style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none', background: '#fff' }}>
                    <option>Standard Storage</option>
                    <option>Cold Storage</option>
                    <option>Hazardous</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Max Capacity (m³)</label>
                  <input type="number" placeholder="0.0" style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Barcode Generation</label>
                <div style={{ padding: '12px', background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: 8, fontSize: 12, color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span>+</span> Auto-generate QR/Barcode on Save
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>
              <button onClick={() => setShowAddLocationModal(false)} style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#475569', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => setShowAddLocationModal(false)} style={{ padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', background: '#4F46E5', color: '#fff', cursor: 'pointer' }}>Save Location</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
