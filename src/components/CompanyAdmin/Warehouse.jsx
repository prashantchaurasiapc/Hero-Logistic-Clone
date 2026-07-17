import React, { useState } from 'react';

// === ICONS ===
const BoxIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);
const CheckCircleIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);
const ClockIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);
const TruckIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle>
  </svg>
);
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
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
const AlertTriangleIcon = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);
const InfoIcon = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);
const ArrowUpRight = ({ color }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline>
  </svg>
);
const StarIcon = ({ color, fill }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);
const CodeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);
const BuildingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path>
  </svg>
);
const MapPinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
  </svg>
);
const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);
const CubeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);
const ClipboardCheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><polyline points="9 14 11 16 15 11"></polyline>
  </svg>
);
const CircleInfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);


// === DUMMY DATA ===
const warehouses = [
  { name: 'Sydney Head Office Warehouse', addr: '12 Logistics Ave, Wetherill Park NSW 2164', code: 'WH-001', branch: 'Sydney Head Office', type: 'General', status: 'Active', stock: '1,250', value: '$485,250.00', util: 78, isStar: true },
  { name: 'Melbourne Distribution Centre', addr: '45 Freight Rd, Truganina VIC 3029', code: 'WH-002', branch: 'Melbourne Branch', type: 'General', status: 'Active', stock: '980', value: '$326,750.00', util: 65, isStar: false },
  { name: 'Brisbane Warehouse', addr: '78 Export St, Lytton QLD 4178', code: 'WH-003', branch: 'Brisbane Branch', type: 'General', status: 'Active', stock: '650', value: '$218,300.00', util: 62, isStar: false },
  { name: 'Perth Logistics Hub', addr: '3 Freight Loop, Welshpool WA 6106', code: 'WH-004', branch: 'Perth Branch', type: 'General', status: 'Active', stock: '420', value: '$142,600.00', util: 58, isStar: false },
  { name: 'Adelaide Storage Facility', addr: '21 Transport Rd, Wingfield SA 5013', code: 'WH-005', branch: 'Adelaide Branch', type: 'General', status: 'Inactive', stock: '210', value: '$63,250.00', util: 25, isStar: false },
  { name: 'Auckland Warehouse', addr: '33 Logistics Dr, East Tamaki, Auckland', code: 'WH-006', branch: 'Auckland Branch', type: 'General', status: 'Active', stock: '615', value: '$20,700.00', util: 45, isStar: false },
];

export default function Warehouse() {
  const [view, setView] = useState('list');
  const [selectedWh, setSelectedWh] = useState(null);

  const handleWhClick = (w) => {
    setSelectedWh(w);
    setView('details');
  };

  if (view === 'details') {
    const wh = selectedWh || warehouses[0];
    return (
      <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '24px 32px', fontFamily: "'Inter','Outfit',sans-serif", overflowX: 'hidden' }}>

        {/* BREADCRUMBS & HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 8, display: 'flex', gap: 6 }}>
              <span>Home</span> <span style={{ color: '#CBD5E1' }}>›</span> <span>Warehouse</span> <span style={{ color: '#CBD5E1' }}>›</span> <span>Warehouse List</span> <span style={{ color: '#CBD5E1' }}>›</span> <span style={{ color: '#0F172A' }}>Warehouse Details</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>9.2 Warehouse Details - {wh.name}</h1>
              <div style={{ width: 18, height: 18, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#64748B', margin: '6px 0 0 0', fontWeight: 500 }}>View and manage warehouse information, settings, locations and operational details.</p>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button onClick={() => setView('list')} style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', letterSpacing: '-0.2px' }}>
              &lt; Back to Warehouse List
            </button>
            <button style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid #C7D2FE', background: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', letterSpacing: '-0.2px' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              Edit Warehouse
            </button>
            <button style={{ padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', letterSpacing: '-0.2px' }}>
              More Actions <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
          </div>
        </div>

        {/* TOP CARD (Profile) */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '24px 24px 0 24px', marginBottom: 24, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: 32, paddingBottom: 24 }}>
            {/* Image */}
            <div style={{ width: 280, height: 180, borderRadius: 12, flexShrink: 0, overflow: 'hidden' }}>
              <img src="/image copy.png" alt="Warehouse" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>{wh.name}</h2>
                <span style={{ fontSize: 11, fontWeight: 800, color: wh.status === 'Active' ? '#10B981' : '#64748B', background: wh.status === 'Active' ? '#D1FAE5' : '#F1F5F9', padding: '4px 10px', borderRadius: 6 }}>{wh.status}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 32 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginBottom: 4 }}>Warehouse Code</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>{wh.code}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginBottom: 4 }}>Type</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>{wh.type}</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginBottom: 4 }}>Branch / Location</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>{wh.branch}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginBottom: 4 }}>Warehouse Manager</div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 6 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F1F5F9', color: '#475569', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>JP</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>James Patel</div>
                        <div style={{ fontSize: 11, color: '#64748B' }}>+61 412 345 678</div>
                        <div style={{ fontSize: 11, color: '#4F46E5', fontWeight: 500 }}>james.patel@hero.com.au</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginBottom: 4 }}>Address</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', lineHeight: 1.4 }}>{wh.addr.split(',').map((line, i) => <span key={i}>{line}{i === 0 ? <br /> : ''}</span>)}</div>
                    <div style={{ fontSize: 11, color: '#4F46E5', fontWeight: 600, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>View on map ↗</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginTop: 'auto' }}>
                    <div>
                      <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginBottom: 4 }}>Phone</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>+61 2 9756 4321</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginBottom: 4 }}>Email</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#4F46E5' }}>warehouse.sydney@hero.com.au</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginBottom: 4 }}>Operating Hours</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', lineHeight: 1.5 }}>
                      Mon - Fri: 7:00 AM - 5:00 PM<br />
                      Sat: 8:00 AM - 12:00 PM<br />
                      Sun: Closed
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginBottom: 4 }}>Time Zone</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>Australia/Sydney (AEST)</div>
                  </div>
                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginBottom: 4 }}>Created</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', lineHeight: 1.4 }}>15 Mar 2024 10:22 AM<br />By Sarah Mitchell</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 24, borderTop: '1px solid #E2E8F0', padding: '0 8px', overflowX: 'auto' }}>
            {['Overview', 'Locations', 'Inventory Summary', 'Tasks', 'Shipments', 'Activity Log', 'Documents', 'Settings'].map((tab, idx) => (
              <div key={idx} style={{ padding: '16px 0', fontSize: 13, fontWeight: idx === 0 ? 800 : 600, color: idx === 0 ? '#4F46E5' : '#64748B', borderBottom: idx === 0 ? '2px solid #4F46E5' : '2px solid transparent', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {tab}
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM LAYOUT */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24, marginBottom: 24 }}>

          {/* LEFT COLUMN */}
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '24px', display: 'flex', flexDirection: 'column', gap: 32 }}>

            {/* WAREHOUSE INFORMATION & CONTACT SETTINGS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                <h3 style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: '0 0 16px 0' }}>WAREHOUSE INFORMATION</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 12px' }}>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, marginBottom: 2 }}>Warehouse Code</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>{wh.code}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, marginBottom: 2 }}>Total Area</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>4,500 m²</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, marginBottom: 2 }}>Warehouse Type</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>{wh.type}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, marginBottom: 2 }}>Usable Area</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>3,520 m²</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, marginBottom: 2 }}>Branch / Location</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>{wh.branch}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, marginBottom: 2 }}>Pallet Capacity</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>2,000</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, marginBottom: 2 }}>Parent Company</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>Hero Logistics Pty Ltd</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, marginBottom: 2 }}>Current Utilisation</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 12 }}>
                      {wh.util}%
                      <div style={{ width: 60, height: 6, background: '#EEF2FF', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${wh.util}%`, height: '100%', background: '#4F46E5', borderRadius: 4 }}></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, marginBottom: 2 }}>Status</div>
                    <span style={{ fontSize: 10, fontWeight: 800, color: wh.status === 'Active' ? '#10B981' : '#64748B', background: wh.status === 'Active' ? '#D1FAE5' : '#F1F5F9', padding: '4px 10px', borderRadius: 6 }}>{wh.status}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, marginBottom: 2 }}>Default Currency</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>AUD - Australian Dollar</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, marginBottom: 2 }}>Temperature Controlled</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>No</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, marginBottom: 2 }}>Tax Rate</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>10% (GST)</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: '0 0 16px 0' }}>CONTACT & SETTINGS</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 12px' }}>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, marginBottom: 2 }}>Warehouse Manager</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>James Patel</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, marginBottom: 2 }}>Notification Email</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#4F46E5', wordBreak: 'break-all' }}>warehouse.sydney@hero.com.au</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, marginBottom: 2 }}>Phone</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>+61 2 9756 4321</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, marginBottom: 2 }}>Receiving Email</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#4F46E5', wordBreak: 'break-all' }}>receiving.sydney@hero.com.au</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, marginBottom: 2 }}>Mobile</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>+61 412 345 678</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, marginBottom: 2 }}>Timezone</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>Australia/Sydney (AEST)</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, marginBottom: 2 }}>Email</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#4F46E5' }}>james.patel@hero.com.au</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, marginBottom: 2 }}>Auto Task Assignment</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>Enabled</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, marginBottom: 2 }}>Secondary Contact</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', lineHeight: 1.4 }}>Lisa Chen<br />+61 400 987 654<br /><span style={{ color: '#4F46E5', fontWeight: 500 }}>lisa.chen@hero.com.au</span></div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, marginBottom: 2 }}>Stock Counting Frequency</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>Monthly</div>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, marginTop: 8, marginBottom: 2 }}>Cycle Count Day</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>First Monday of each month</div>
                  </div>
                </div>
              </div>
            </div>

            {/* SERVICES & CAPABILITIES */}
            <div>
              <h3 style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: '0 0 16px 0' }}>SERVICES & CAPABILITIES</h3>
              <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
                {[
                  { name: 'Receiving', icon: <CubeIcon />, color: '#4F46E5', on: true },
                  { name: 'Storage', icon: <BoxIcon color="#4F46E5" />, color: '#4F46E5', on: true },
                  { name: 'Picking', icon: <ClipboardCheckIcon />, color: '#4F46E5', on: true },
                  { name: 'Packing', icon: <CubeIcon />, color: '#4F46E5', on: true },
                  { name: 'Dispatch', icon: <TruckIcon color="#4F46E5" />, color: '#4F46E5', on: true },
                  { name: 'Returns', icon: <RefreshIcon />, color: '#4F46E5', on: true },
                  { name: 'Cross Docking', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"></path><path d="M4 20L21 3"></path><path d="M21 16v5h-5"></path><path d="M15 15l6 6"></path><path d="M4 4l5 5"></path></svg>, color: '#4F46E5', on: true },
                  { name: 'Value Added Services', icon: <StarIcon color="#F59E0B" fill="none" />, color: '#F59E0B', on: false },
                  { name: 'Dangerous Goods', icon: <AlertTriangleIcon color="#EF4444" />, color: '#EF4444', on: false },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 56 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: item.on ? '#EEF2FF' : (item.color === '#F59E0B' ? '#FFFBEB' : '#FEF2F2'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.icon}
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#334155', textAlign: 'center', lineHeight: 1.2 }}>{item.name}</div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: item.on ? '#10B981' : '#EF4444' }}>{item.on ? 'Yes' : 'No'}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* WAREHOUSE OVERVIEW */}
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0 }}>WAREHOUSE OVERVIEW</h3>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#4F46E5', cursor: 'pointer' }}>View Report →</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>

                <div style={{ position: 'relative', overflow: 'hidden', border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%) scale(2.5)', opacity: 0.04, color: '#4F46E5', pointerEvents: 'none' }}><UsersIcon /></div>
                  <div style={{ width: 26, height: 26, borderRadius: 6, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5', flexShrink: 0, zIndex: 1 }}><UsersIcon /></div>
                  <div style={{ zIndex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 900, color: '#0F172A', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{wh.stock}</div>
                    <div style={{ fontSize: 9, color: '#64748B', fontWeight: 600, whiteSpace: 'nowrap' }}>Stock Items</div>
                  </div>
                </div>

                <div style={{ position: 'relative', overflow: 'hidden', border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%) scale(2.5)', opacity: 0.04, color: '#10B981', pointerEvents: 'none' }}><CheckCircleIcon color="#10B981" /></div>
                  <div style={{ width: 26, height: 26, borderRadius: 6, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', flexShrink: 0, zIndex: 1 }}><CheckCircleIcon color="#10B981" /></div>
                  <div style={{ zIndex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 900, color: '#0F172A', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{wh.value}</div>
                    <div style={{ fontSize: 9, color: '#64748B', fontWeight: 600, whiteSpace: 'nowrap' }}>Inventory Value</div>
                  </div>
                </div>

                <div style={{ position: 'relative', overflow: 'hidden', border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%) scale(2.5)', opacity: 0.04, color: '#3B82F6', pointerEvents: 'none' }}><ClockIcon color="#3B82F6" /></div>
                  <div style={{ width: 26, height: 26, borderRadius: 6, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6', flexShrink: 0, zIndex: 1 }}><ClockIcon color="#3B82F6" /></div>
                  <div style={{ zIndex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 900, color: '#0F172A', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{wh.util}%</div>
                    <div style={{ fontSize: 9, color: '#64748B', fontWeight: 600, whiteSpace: 'nowrap' }}>Utilisation</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                <div style={{ position: 'relative', overflow: 'hidden', border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%) scale(2.5)', opacity: 0.04, color: '#4F46E5', pointerEvents: 'none' }}><ClipboardCheckIcon /></div>
                  <div style={{ width: 26, height: 26, borderRadius: 6, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5', flexShrink: 0, zIndex: 1 }}><ClipboardCheckIcon /></div>
                  <div style={{ zIndex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 900, color: '#0F172A', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>28</div>
                    <div style={{ fontSize: 9, color: '#64748B', fontWeight: 600, whiteSpace: 'nowrap' }}>Pending Tasks</div>
                  </div>
                </div>

                <div style={{ position: 'relative', overflow: 'hidden', border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%) scale(2.5)', opacity: 0.04, color: '#EF4444', pointerEvents: 'none' }}><TruckIcon color="#EF4444" /></div>
                  <div style={{ width: 26, height: 26, borderRadius: 6, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', flexShrink: 0, zIndex: 1 }}><TruckIcon color="#EF4444" /></div>
                  <div style={{ zIndex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 900, color: '#0F172A', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>14</div>
                    <div style={{ fontSize: 9, color: '#64748B', fontWeight: 600, whiteSpace: 'nowrap' }}>Inc. Shipments</div>
                  </div>
                </div>

                <div style={{ position: 'relative', overflow: 'hidden', border: '1px solid #E2E8F0', borderRadius: 8, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%) scale(2.5)', opacity: 0.04, color: '#F97316', pointerEvents: 'none' }}><TruckIcon color="#F97316" /></div>
                  <div style={{ width: 26, height: 26, borderRadius: 6, background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F97316', flexShrink: 0, zIndex: 1 }}><TruckIcon color="#F97316" /></div>
                  <div style={{ zIndex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 900, color: '#0F172A', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>19</div>
                    <div style={{ fontSize: 9, color: '#64748B', fontWeight: 600, whiteSpace: 'nowrap' }}>Out. Shipments</div>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '24px' }}>
              <h3 style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 16 }}>QUICK ACTIONS</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>
                  <span style={{ color: '#4F46E5', fontSize: 14 }}>📦</span> Manage Stock
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>
                  <span style={{ color: '#4F46E5', fontSize: 14 }}>+</span> Add Stock
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>
                  <span style={{ color: '#4F46E5', fontSize: 14 }}>✓</span> Create Pick Task
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>
                  <span style={{ color: '#4F46E5', fontSize: 14 }}>↓</span> Receive Shipment
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>
                  <span style={{ color: '#4F46E5', fontSize: 14 }}>⇄</span> Create Stock Transfer
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>
                  <span style={{ color: '#4F46E5', fontSize: 14 }}>📍</span> View Warehouse Locations
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>
                  <span style={{ color: '#4F46E5', fontSize: 14 }}>☰</span> View All Tasks
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>
                  <span style={{ color: '#4F46E5', fontSize: 14 }}>🖨️</span> Print Warehouse Label
                </div>
              </div>
            </div>

            {/* WAREHOUSE LOCATIONS (5) */}
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0 }}>WAREHOUSE LOCATIONS (5)</h3>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#4F46E5', cursor: 'pointer' }}>View All →</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { name: 'Main Storage Area', code: 'A1 - A20', pct: 78, color: '#4F46E5', icon: 'M' },
                  { name: 'Bulk Storage', code: 'B1 - B15', pct: 66, color: '#10B981', icon: 'B' },
                  { name: 'Dispatch Area', code: 'D1 - D10', pct: 85, color: '#3B82F6', icon: 'D' },
                  { name: 'Returns Area', code: 'R1 - R5', pct: 42, color: '#F59E0B', icon: 'R' },
                  { name: 'Quarantine Area', code: 'Q1 - Q5', pct: 25, color: '#EF4444', icon: 'Q' },
                ].map((loc, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 4, background: `${loc.color}15`, color: loc.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800 }}>{loc.icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', flex: 1 }}>{loc.name}</div>
                    <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600, width: 50 }}>{loc.code}</div>
                    <div style={{ width: 60, height: 6, background: '#EEF2FF', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${loc.pct}%`, height: '100%', background: '#4F46E5', borderRadius: 4 }}></div>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', width: 26, textAlign: 'right' }}>{loc.pct}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* DOCUMENTS */}
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0 }}>DOCUMENTS</h3>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#4F46E5', cursor: 'pointer' }}>View All →</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { name: 'Warehouse Lic...', full: 'LIC-WH-001.pdf', date: '15 Mar 2024' },
                  { name: 'Insurance Cert...', full: 'INS-WH-001.pdf', date: '01 Jan 2025' },
                  { name: 'Fire Safety Ce...', full: 'FSC-WH-001.pdf', date: '20 Feb 2025' },
                  { name: 'OH&S Complia...', full: 'OHS-WH-001.pdf', date: '10 Apr 2025' },
                  { name: 'Site Plan', full: 'SITE-WH-001.pdf', date: '15 Mar 2024' },
                ].map((doc, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ color: '#64748B', fontSize: 12 }}>📄</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 4 }}>
                        {doc.name} <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500 }}>{doc.full}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 10, color: '#0F172A', fontWeight: 700 }}>{doc.date}</div>
                    <div style={{ color: '#64748B', cursor: 'pointer', fontSize: 12 }}>↓</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* DEVELOPER NOTES */}
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 26, height: 26, borderRadius: 6, background: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CodeIcon />
            </div>
            <h3 style={{ fontSize: 12, fontWeight: 900, color: '#312E81', letterSpacing: '0.5px', margin: 0 }}>DEVELOPER NOTES - WAREHOUSE DETAILS</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#EEF2FF', color: '#4F46E5', fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
                <h4 style={{ fontSize: 9, fontWeight: 800, color: '#312E81', letterSpacing: '0.5px', margin: 0 }}>PURPOSE</h4>
              </div>
              <ul style={{ margin: 0, paddingLeft: 14, fontSize: 10, color: '#64748B', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <li>Central record for all warehouse information.</li>
                <li>Manage settings, contacts and capabilities.</li>
                <li>Access related data and operational actions.</li>
              </ul>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#EEF2FF', color: '#4F46E5', fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
                <h4 style={{ fontSize: 9, fontWeight: 800, color: '#312E81', letterSpacing: '0.5px', margin: 0 }}>KEY FEATURES</h4>
              </div>
              <ul style={{ margin: 0, paddingLeft: 14, fontSize: 10, color: '#64748B', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <li>Warehouse overview and key metrics.</li>
                <li>Contact details and operating settings.</li>
                <li>Quick actions for daily operations.</li>
                <li>Access to locations, inventory and tasks.</li>
              </ul>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#EEF2FF', color: '#4F46E5', fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
                <h4 style={{ fontSize: 9, fontWeight: 800, color: '#312E81', letterSpacing: '0.5px', margin: 0 }}>AUTOMATION & ALERTS</h4>
              </div>
              <ul style={{ margin: 0, paddingLeft: 14, fontSize: 10, color: '#64748B', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <li>Alert on low utilisation or capacity issues.</li>
                <li>Notify when documents are expiring.</li>
                <li>Auto-create tasks based on settings.</li>
                <li>Dashboard updates in real-time.</li>
              </ul>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#EEF2FF', color: '#4F46E5', fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>4</span>
                <h4 style={{ fontSize: 9, fontWeight: 800, color: '#312E81', letterSpacing: '0.5px', margin: 0 }}>PERMISSIONS</h4>
              </div>
              <ul style={{ margin: 0, paddingLeft: 14, fontSize: 10, color: '#64748B', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <li>Super Admin: Full access.</li>
                <li>Admin/Manager: Full access.</li>
                <li>Warehouse Staff: View assigned warehouse only.</li>
                <li>Dispatcher: View warehouse info (read-only).</li>
              </ul>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#EEF2FF', color: '#4F46E5', fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>5</span>
                <h4 style={{ fontSize: 9, fontWeight: 800, color: '#312E81', letterSpacing: '0.5px', margin: 0 }}>DATA SOURCES</h4>
              </div>
              <ul style={{ margin: 0, paddingLeft: 14, fontSize: 10, color: '#64748B', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <li>Warehouses module.</li>
                <li>Inventory & Stock module.</li>
                <li>Tasks module.</li>
                <li>Shipments & Orders module.</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    );
  }

  if (view === 'add') {
    return (
      <div style={{ background: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter','Outfit',sans-serif", overflowX: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '32px 40px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <button onClick={() => setView('list')} style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B', fontWeight: 600 }}>&lt;</button>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>Add New Warehouse</h1>
                <span style={{ fontSize: 10, fontWeight: 800, color: '#10B981', background: '#D1FAE5', padding: '4px 8px', borderRadius: 4 }}>NEW</span>
              </div>
              <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Register a new warehouse facility with full profile and operational setup.</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setView('list')} style={{ padding: '10px 20px', borderRadius: 10, background: '#fff', border: '1px solid #E2E8F0', color: '#475569', fontSize: 13.5, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
            <button onClick={() => setView('list')} style={{ padding: '10px 24px', borderRadius: 10, background: '#F59E0B', border: 'none', color: '#1E1B4B', fontSize: 13.5, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircleIcon color="#1E1B4B" /> Save Warehouse
            </button>
          </div>
        </div>

        <div style={{ maxWidth: 1300, margin: '32px auto', padding: '0 40px', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* 1. BASIC INFORMATION */}
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, padding: '32px' }}>
            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <BuildingIcon />
              </div>
              <div>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: '#1E293B', margin: '0 0 4px 0' }}>1. BASIC INFORMATION</h2>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Facility Identity and Status</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Warehouse Name *</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: 16 }}>🏢</span>
                  <input placeholder="e.g. Sydney Main Depot" style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 14, color: '#334155', boxSizing: 'border-box', outline: 'none' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Warehouse Code *</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: 16 }}>📦</span>
                  <input placeholder="e.g. SYD-01" style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 14, color: '#334155', boxSizing: 'border-box', outline: 'none' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Branch / Region</label>
                <input placeholder="Sydney Main" style={{ width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 14, color: '#334155', boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</label>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button style={{ flex: 1, padding: '12px', borderRadius: 10, border: 'none', background: '#F97316', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Active</button>
                  <button style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#fff', color: '#475569', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Maintenance</button>
                  <button style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#fff', color: '#475569', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Out of Service</button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. CAPACITY & SIZING */}
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, padding: '32px' }}>
            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CubeIcon />
              </div>
              <div>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: '#1E293B', margin: '0 0 4px 0' }}>2. CAPACITY & SIZING</h2>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Physical Dimensions and Limits</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Area (SQM)</label>
                <input placeholder="e.g. 5000" style={{ width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 14, color: '#334155', boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pallet Capacity</label>
                <input placeholder="e.g. 15000" style={{ width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 14, color: '#334155', boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Loading Docks</label>
                <input placeholder="e.g. 12" style={{ width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 14, color: '#334155', boxSizing: 'border-box', outline: 'none' }} />
              </div>
            </div>
          </div>

          {/* 3. LOCATION DETAILS */}
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, padding: '32px' }}>
            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPinIcon />
              </div>
              <div>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: '#1E293B', margin: '0 0 4px 0' }}>3. LOCATION DETAILS</h2>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Geographic Address</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Street Address</label>
                <input placeholder="e.g. 123 Logistics Way" style={{ width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 14, color: '#334155', boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Suburb / City</label>
                  <input placeholder="e.g. Wetherill Park" style={{ width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 14, color: '#334155', boxSizing: 'border-box', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>State</label>
                  <input placeholder="e.g. NSW" style={{ width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 14, color: '#334155', boxSizing: 'border-box', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Postal Code</label>
                  <input placeholder="e.g. 2164" style={{ width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 14, color: '#334155', boxSizing: 'border-box', outline: 'none' }} />
                </div>
              </div>
            </div>
          </div>

          {/* 4. KEY CONTACTS */}
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, padding: '32px' }}>
            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <UsersIcon />
              </div>
              <div>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: '#1E293B', margin: '0 0 4px 0' }}>4. KEY CONTACTS</h2>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Warehouse Management</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Manager Name</label>
                <input placeholder="e.g. Sarah Mitchell" style={{ width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 14, color: '#334155', boxSizing: 'border-box', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Manager Phone</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: 16 }}>📞</span>
                  <input placeholder="0400 000 000" style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 14, color: '#334155', boxSizing: 'border-box', outline: 'none' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Manager Email</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: 16 }}>🌐</span>
                  <input placeholder="manager@company.com" style={{ width: '100%', padding: '12px 16px 12px 42px', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 14, color: '#334155', boxSizing: 'border-box', outline: 'none' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#94A3B8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Emergency After-hours</label>
                <input placeholder="Security/Fire contact" style={{ width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 14, color: '#334155', boxSizing: 'border-box', outline: 'none' }} />
              </div>
            </div>
          </div>

          {/* 5. OPERATING CAPABILITIES */}
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, padding: '32px' }}>
            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#ECFEFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ClipboardCheckIcon />
              </div>
              <div>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: '#1E293B', margin: '0 0 4px 0' }}>5. OPERATING CAPABILITIES</h2>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Facility Features</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {['Cold Storage', 'Dangerous Goods', 'Cross-Docking', '24/7 Operations'].map((lbl, idx) => (
                <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #E2E8F0', borderRadius: 10, padding: '16px 20px', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#4F46E5' }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{lbl}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 6. NOTES & COMMENTS */}
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, padding: '32px' }}>
            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CircleInfoIcon />
              </div>
              <div>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: '#1E293B', margin: '0 0 4px 0' }}>6. NOTES & COMMENTS</h2>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Additional Information</div>
              </div>
            </div>

            <textarea placeholder="Any specific instructions, hours, or operational notes..." style={{ width: '100%', height: 120, padding: '16px', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 14, color: '#334155', boxSizing: 'border-box', outline: 'none', resize: 'none', fontFamily: 'inherit' }}></textarea>
          </div>

        </div>

        {/* Fixed Bottom Bar */}
        <div style={{ position: 'sticky', bottom: 0, background: '#fff', borderTop: '1px solid #E2E8F0', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', zIndex: 50, marginTop: 10 }}>
          <button onClick={() => setView('list')} style={{ padding: '12px 24px', borderRadius: 10, background: '#fff', border: '1px solid #E2E8F0', color: '#475569', fontSize: 13.5, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => setView('list')} style={{ padding: '12px 24px', borderRadius: 10, background: '#F97316', border: 'none', color: '#fff', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            Save Warehouse <span style={{ fontSize: 16 }}>→</span>
          </button>
        </div>

      </div>
    );
  }

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '24px 32px', fontFamily: "'Inter','Outfit',sans-serif", overflowX: 'hidden' }}>

      {/* ── BREADCRUMBS & HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 8, display: 'flex', gap: 6 }}>
            <span>Home</span> <span style={{ color: '#CBD5E1' }}>›</span> <span>Warehouse</span> <span style={{ color: '#CBD5E1' }}>›</span> <span style={{ color: '#0F172A' }}>Warehouse Dashboard</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>9.1 Warehouse Dashboard / List</h1>
            <div style={{ width: 14, height: 14, borderRadius: 4, border: '2px solid #8B5CF6' }}></div>
          </div>
          <p style={{ fontSize: 13, color: '#64748B', margin: '6px 0 0 0', fontWeight: 500 }}>View all warehouses, stock overview and real-time operational summary.</p>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
          <button onClick={() => setView('add')} style={{ padding: '5px 12px', borderRadius: 4, fontSize: 11, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#4F46E5', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>+</span> Add Warehouse
          </button>
          <button style={{ padding: '5px 12px', borderRadius: 4, fontSize: 11, fontWeight: 600, border: '1px solid #E2E8F0', background: '#fff', color: '#334155', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            More Actions
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── METRICS CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 24 }}>
        {/* Card 1 */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BoxIcon color="#8B5CF6" />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 9.5, fontWeight: 800, color: '#64748B', letterSpacing: '0.2px', textTransform: 'uppercase', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>TOTAL WAREHOUSES</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>6</div>
              <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Active Warehouses</div>
            </div>
          </div>
          <div style={{ marginTop: 'auto', fontSize: 11, fontWeight: 700, color: '#4F46E5', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
            View all warehouses <span style={{ fontSize: 14 }}>→</span>
          </div>
        </div>

        {/* Card 2 */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CheckCircleIcon color="#10B981" />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 9.5, fontWeight: 800, color: '#64748B', letterSpacing: '0.2px', textTransform: 'uppercase', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>TOTAL INVENTORY VALUE</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>$1,256,850.00</div>
              <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Across all warehouses</div>
            </div>
          </div>
          <div style={{ marginTop: 'auto', fontSize: 11, fontWeight: 700, color: '#4F46E5', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
            View inventory <span style={{ fontSize: 14 }}>→</span>
          </div>
        </div>

        {/* Card 3 */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BoxIcon color="#F59E0B" />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 9.5, fontWeight: 800, color: '#64748B', letterSpacing: '0.2px', textTransform: 'uppercase', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>TOTAL STOCK ITEMS</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>4,125</div>
              <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>All warehouses</div>
            </div>
          </div>
          <div style={{ marginTop: 'auto', fontSize: 11, fontWeight: 700, color: '#4F46E5', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
            View stock <span style={{ fontSize: 14 }}>→</span>
          </div>
        </div>

        {/* Card 4 */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ClockIcon color="#3B82F6" />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 9.5, fontWeight: 800, color: '#64748B', letterSpacing: '0.2px', textTransform: 'uppercase', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>PENDING PICK TASKS</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>28</div>
              <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Requires attention</div>
            </div>
          </div>
          <div style={{ marginTop: 'auto', fontSize: 11, fontWeight: 700, color: '#4F46E5', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
            View tasks <span style={{ fontSize: 14 }}>→</span>
          </div>
        </div>

        {/* Card 5 */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <TruckIcon color="#8B5CF6" />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 9.5, fontWeight: 800, color: '#64748B', letterSpacing: '0.2px', textTransform: 'uppercase', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>INCOMING SHIPMENTS</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>14</div>
              <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>In transit / Expected</div>
            </div>
          </div>
          <div style={{ marginTop: 'auto', fontSize: 11, fontWeight: 700, color: '#4F46E5', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
            View shipments <span style={{ fontSize: 14 }}>→</span>
          </div>
        </div>

        {/* Card 6 */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <TruckIcon color="#EF4444" />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 9.5, fontWeight: 800, color: '#64748B', letterSpacing: '0.2px', textTransform: 'uppercase', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>OUTGOING SHIPMENTS</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>19</div>
              <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Scheduled / In progress</div>
            </div>
          </div>
          <div style={{ marginTop: 'auto', fontSize: 11, fontWeight: 700, color: '#4F46E5', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
            View shipments <span style={{ fontSize: 14 }}>→</span>
          </div>
        </div>
      </div>

      {/* ── MIDDLE SECTION ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, marginBottom: 24 }}>

        {/* WAREHOUSE LIST */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9' }}>
            <h2 style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0 }}>WAREHOUSE LIST (6)</h2>
          </div>

          <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #F1F5F9' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}><SearchIcon /></span>
              <input placeholder="Search warehouses..." style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, outline: 'none', color: '#0F172A', boxSizing: 'border-box' }} />
            </div>

            {/* Filter Dropdowns */}
            {['All Status', 'All Branches', 'All Types'].map(label => (
              <select key={label} style={{ padding: '9px 32px 9px 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#334155', appearance: 'none', background: '#fff url("data:image/svg+xml;utf8,<svg fill=\'%2364748B\' height=\'16\' viewBox=\'0 0 24 24\' width=\'16\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>") no-repeat right 8px center', outline: 'none' }}>
                <option>{label}</option>
              </select>
            ))}

            <button style={{ padding: '9px', border: '1px solid #E2E8F0', borderRadius: 8, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FilterIcon /></button>
            <button style={{ padding: '9px 14px', border: '1px solid #E2E8F0', borderRadius: 8, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#334155' }}>
              <ExportIcon /> Export
            </button>
            <button style={{ padding: '9px', border: '1px solid #E2E8F0', borderRadius: 8, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RefreshIcon /></button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#fff', borderBottom: '1px solid #F1F5F9' }}>
                  {['Warehouse Name', 'Code', 'Branch / Location', 'Type', 'Status', 'Stock Items', 'Inventory Value (AUD)', 'Utilization', 'Action'].map(h => (
                    <th key={h} style={{ padding: '16px 24px', fontSize: 11, fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', textTransform: 'capitalize' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {warehouses.map((w, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <td style={{ padding: '16px 24px', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ marginTop: 2 }}><StarIcon fill={w.isStar ? '#4F46E5' : 'none'} color={w.isStar ? '#4F46E5' : '#CBD5E1'} /></div>
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0F172A', marginBottom: 4, width: 140 }}>{w.name}</div>
                          <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.4, width: 120 }}>{w.addr}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', verticalAlign: 'top' }}>
                      <span onClick={() => handleWhClick(w)} style={{ fontSize: 13, fontWeight: 700, color: '#4F46E5', cursor: 'pointer' }}>{w.code}</span>
                    </td>
                    <td style={{ padding: '16px 24px', verticalAlign: 'top' }}>
                      <div style={{ fontSize: 13, color: '#475569', fontWeight: 500, width: 80 }}>{w.branch}</div>
                    </td>
                    <td style={{ padding: '16px 24px', verticalAlign: 'top' }}>
                      <div style={{ fontSize: 13, color: '#475569' }}>{w.type}</div>
                    </td>
                    <td style={{ padding: '16px 24px', verticalAlign: 'top' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, background: w.status === 'Active' ? '#F0FDF4' : '#F1F5F9', color: w.status === 'Active' ? '#16A34A' : '#64748B' }}>
                        {w.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', verticalAlign: 'top' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{w.stock}</div>
                    </td>
                    <td style={{ padding: '16px 24px', verticalAlign: 'top' }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>{w.value}</div>
                    </td>
                    <td style={{ padding: '16px 24px', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ fontSize: 13, color: '#0F172A', fontWeight: 600 }}>{w.util}%</div>
                        <div style={{ width: 60, height: 6, background: '#EEF2FF', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ width: `${w.util}%`, height: '100%', background: '#4F46E5', borderRadius: 4 }}></div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', verticalAlign: 'top' }}>
                      <div style={{ color: '#94A3B8', fontWeight: 800, fontSize: 18, letterSpacing: '1px', cursor: 'pointer' }}>...</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9' }}>
            <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Showing 1 to 6 of 6 warehouses</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', gap: 4 }}>
                <button style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid #E2E8F0', borderRadius: 6, cursor: 'pointer', color: '#64748B' }}>&lt;</button>
                <button style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EEF2FF', border: '1px solid #EEF2FF', borderRadius: 6, cursor: 'pointer', color: '#4F46E5', fontWeight: 700 }}>1</button>
                <button style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid #E2E8F0', borderRadius: 6, cursor: 'pointer', color: '#64748B' }}>&gt;</button>
              </div>
              <select style={{ padding: '7px 24px 7px 12px', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 13, fontWeight: 600, color: '#334155', appearance: 'none', background: '#fff url("data:image/svg+xml;utf8,<svg fill=\'%2364748B\' height=\'16\' viewBox=\'0 0 24 24\' width=\'16\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>") no-repeat right 6px center', outline: 'none' }}>
                <option>10 / page</option>
              </select>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE PANELS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Warehouse Alerts */}
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0 }}>WAREHOUSE ALERTS</h3>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#4F46E5', display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }}>View All →</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flexShrink: 0, marginTop: 2 }}><AlertTriangleIcon color="#F97316" /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#EA580C', marginBottom: 2 }}>Low Stock Alert</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>12 min ago</div>
                  </div>
                  <div style={{ fontSize: 11.5, color: '#64748B' }}>15 items below minimum stock level</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flexShrink: 0, marginTop: 2 }}><AlertTriangleIcon color="#F97316" /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#EA580C', marginBottom: 2 }}>Stock Expiry Alert</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>1 hr ago</div>
                  </div>
                  <div style={{ fontSize: 11.5, color: '#64748B' }}>8 items expiring within 30 days</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flexShrink: 0, marginTop: 2 }}><InfoIcon color="#4F46E5" /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#4F46E5', marginBottom: 2 }}>Pick Tasks Overdue</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>2 hrs ago</div>
                  </div>
                  <div style={{ fontSize: 11.5, color: '#64748B' }}>5 pick tasks are overdue</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flexShrink: 0, marginTop: 2 }}><TruckIcon color="#4F46E5" /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#4F46E5', marginBottom: 2 }}>Incoming Shipment</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>3 hrs ago</div>
                  </div>
                  <div style={{ fontSize: 11.5, color: '#64748B' }}>PO-55412 arriving today at WH-001</div>
                </div>
              </div>
            </div>
          </div>

          {/* Warehouse Locations */}
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0 }}>WAREHOUSE LOCATIONS</h3>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#4F46E5', display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }}>View All →</div>
            </div>

            <div style={{ display: 'flex', gap: 16 }}>
              {/* Fake Map */}
              <div style={{ width: 140, height: 110, background: '#BFDBFE', borderRadius: 8, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: 4, left: 6, fontSize: 9, fontWeight: 800, color: '#1E3A8A' }}>Google</div>
                <div style={{ position: 'absolute', bottom: 4, right: 6, fontSize: 7, color: '#1E3A8A' }}>Map data ©2025 Google Terms</div>
                {/* Pins */}
                <div style={{ position: 'absolute', top: '40%', left: '20%', width: 16, height: 16, background: '#4F46E5', borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 8, color: '#fff', transform: 'rotate(45deg)', fontWeight: 800 }}>1</span>
                </div>
                <div style={{ position: 'absolute', top: '60%', left: '50%', width: 16, height: 16, background: '#4F46E5', borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 8, color: '#fff', transform: 'rotate(45deg)', fontWeight: 800 }}>2</span>
                </div>
                <div style={{ position: 'absolute', top: '25%', left: '70%', width: 16, height: 16, background: '#4F46E5', borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 8, color: '#fff', transform: 'rotate(45deg)', fontWeight: 800 }}>3</span>
                </div>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center' }}>
                {['Sydney Head Office', 'Melbourne DC', 'Brisbane Warehouse', 'Perth Hub', 'Adelaide Facility', 'Auckland Warehouse'].map((name, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 800, color: '#fff' }}>{i + 1}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: '#0F172A' }}>{name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── BOTTOM PANELS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>

        {/* INVENTORY SUMMARY */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 10.5, fontWeight: 800, color: '#0F172A', letterSpacing: '0.2px', textTransform: 'uppercase', margin: 0 }}>INVENTORY SUMMARY</h3>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: '#4F46E5', cursor: 'pointer' }}>View Report →</div>
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'conic-gradient(#10B981 0% 59.4%, #F59E0B 59.4% 74.4%, #8B5CF6 74.4% 84.8%, #3B82F6 84.8% 95.1%, #94A3B8 95.1% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>4,125</span>
                <span style={{ fontSize: 7.5, color: '#64748B', textAlign: 'center', lineHeight: 1.1, marginTop: 1 }}>Total<br />Items</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
              {[{ c: '#10B981', t: 'Available', v: '2,450', p: '59.4%' }, { c: '#F59E0B', t: 'Reserved', v: '620', p: '15.0%' }, { c: '#8B5CF6', t: 'In Transit', v: '430', p: '10.4%' }, { c: '#3B82F6', t: 'On Order', v: '425', p: '10.3%' }, { c: '#94A3B8', t: 'Others', v: '200', p: '4.9%' }].map(x => (
                <div key={x.t} style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: x.c }}></div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: '#0F172A' }}>{x.t}</div>
                  </div>
                  <div style={{ fontSize: 10.5, fontWeight: 800, color: '#0F172A', paddingLeft: 12 }}>{x.v} <span style={{ color: '#64748B', fontWeight: 500 }}>({x.p})</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* STOCK MOVEMENTS */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <h3 style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0, lineHeight: 1.4 }}>STOCK MOVEMENTS<br />(THIS WEEK)</h3>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#4F46E5', cursor: 'pointer' }}>View Report →</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: '#334155' }}>
                <span style={{ width: 20, height: 20, borderRadius: 6, background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↓</span> Stock In
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A' }}>1,250 Items</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: '#334155' }}>
                <span style={{ width: 20, height: 20, borderRadius: 6, background: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↑</span> Stock Out
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A' }}>980 Items</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: '#334155' }}>
                <span style={{ width: 20, height: 20, borderRadius: 6, background: '#EFF6FF', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⇄</span> Transfers
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A' }}>320 Items</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: '#334155' }}>
                <span style={{ width: 20, height: 20, borderRadius: 6, background: '#F5F3FF', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>⚙</span> Adjustments
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#0F172A' }}>45 Items</div>
            </div>
          </div>
        </div>

        {/* PENDING TASKS */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0 }}>PENDING TASKS</h3>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#4F46E5', cursor: 'pointer' }}>View All →</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, color: '#0F172A' }}>
                <span style={{ color: '#8B5CF6' }}>📋</span> Pick Tasks
              </div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>28</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, color: '#0F172A' }}>
                <span style={{ color: '#8B5CF6' }}>⬇</span> Put Away Tasks
              </div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>16</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, color: '#0F172A' }}>
                <span style={{ color: '#F97316' }}>⇄</span> Stock Transfers
              </div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>8</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, color: '#0F172A' }}>
                <span style={{ color: '#3B82F6' }}>↻</span> Cycle Counts
              </div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>5</div>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px' }}>
          <h3 style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 16, margin: 0 }}>QUICK ACTIONS</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
            <div onClick={() => setView('add')} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>
              <span style={{ color: '#4F46E5', fontSize: 14 }}>+</span> Add Warehouse
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>
              <span style={{ color: '#4F46E5', fontSize: 12 }}>📦</span> Manage Stock
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>
              <span style={{ color: '#4F46E5', fontSize: 12 }}>✓</span> Create Pick Task
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, color: '#0F172A', cursor: 'pointer' }}>
              <span style={{ color: '#4F46E5', fontSize: 12 }}>⇄</span> Stock Transfer
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '0.5px', textTransform: 'uppercase', margin: 0 }}>RECENT ACTIVITY</h3>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#4F46E5', cursor: 'pointer' }}>View All →</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', marginTop: 4, flexShrink: 0 }}></div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', lineHeight: 1.3, marginBottom: 2 }}>Stock received at<br />WH-001</div>
                <div style={{ fontSize: 9.5, color: '#64748B' }}>By James Patel</div>
              </div>
              <div style={{ fontSize: 9, color: '#94A3B8', marginLeft: 'auto', whiteSpace: 'nowrap' }}>10 May 2025</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', marginTop: 4, flexShrink: 0 }}></div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', lineHeight: 1.3, marginBottom: 2 }}>Pick task completed<br />at WH-002</div>
                <div style={{ fontSize: 9.5, color: '#64748B' }}>By Robert Taylor</div>
              </div>
              <div style={{ fontSize: 9, color: '#94A3B8', marginLeft: 'auto', whiteSpace: 'nowrap' }}>10 May 2025</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B', marginTop: 4, flexShrink: 0 }}></div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', lineHeight: 1.3, marginBottom: 2 }}>Stock transfer WH-<br />003 → WH-001</div>
                <div style={{ fontSize: 9.5, color: '#64748B' }}>By Sarah Mitchell</div>
              </div>
              <div style={{ fontSize: 9, color: '#94A3B8', marginLeft: 'auto', whiteSpace: 'nowrap' }}>09 May 2025</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F97316', marginTop: 4, flexShrink: 0 }}></div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', lineHeight: 1.3, marginBottom: 2 }}>Inventory adjusted<br />at WH-004</div>
                <div style={{ fontSize: 9.5, color: '#64748B' }}>By James Patel</div>
              </div>
              <div style={{ fontSize: 9, color: '#94A3B8', marginLeft: 'auto', whiteSpace: 'nowrap' }}>09 May 2025</div>
            </div>
          </div>
        </div>
      </div>
      {/* ── DEVELOPER NOTES ── */}
      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CodeIcon />
          </div>
          <h3 style={{ fontSize: 12, fontWeight: 900, color: '#312E81', letterSpacing: '0.5px', margin: 0 }}>DEVELOPER NOTES - WAREHOUSE DASHBOARD / LIST</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#EEF2FF', color: '#4F46E5', fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
              <h4 style={{ fontSize: 9, fontWeight: 800, color: '#312E81', letterSpacing: '0.5px', margin: 0 }}>PURPOSE</h4>
            </div>
            <ul style={{ margin: 0, paddingLeft: 14, fontSize: 10, color: '#64748B', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li>Central overview of all warehouses.</li>
              <li>Real-time stock, tasks, alerts and activity.</li>
              <li>Quick access to key warehouse functions.</li>
            </ul>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#EEF2FF', color: '#4F46E5', fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
              <h4 style={{ fontSize: 9, fontWeight: 800, color: '#312E81', letterSpacing: '0.5px', margin: 0 }}>KEY FEATURES</h4>
            </div>
            <ul style={{ margin: 0, paddingLeft: 14, fontSize: 10, color: '#64748B', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li>Search, filter and view warehouses.</li>
              <li>Stock and inventory summary widgets.</li>
              <li>Map view of all warehouse locations.</li>
              <li>Quick actions and recent activity feed.</li>
            </ul>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#EEF2FF', color: '#4F46E5', fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
              <h4 style={{ fontSize: 9, fontWeight: 800, color: '#312E81', letterSpacing: '0.5px', margin: 0 }}>AUTOMATION & ALERTS</h4>
            </div>
            <ul style={{ margin: 0, paddingLeft: 14, fontSize: 10, color: '#64748B', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li>Auto alerts for low stock, expiry and overdue tasks.</li>
              <li>Incoming shipment and task notifications.</li>
              <li>Dashboard updates in real-time.</li>
              <li>AI insights for stock anomalies and trends.</li>
            </ul>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#EEF2FF', color: '#4F46E5', fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>4</span>
              <h4 style={{ fontSize: 9, fontWeight: 800, color: '#312E81', letterSpacing: '0.5px', margin: 0 }}>PERMISSIONS</h4>
            </div>
            <ul style={{ margin: 0, paddingLeft: 14, fontSize: 10, color: '#64748B', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li>Super Admin: Full access.</li>
              <li>Admin/Manager: Full access.</li>
              <li>Warehouse Staff: View assigned warehouse only.</li>
              <li>Dispatcher: View stock and tasks (read-only).</li>
            </ul>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#EEF2FF', color: '#4F46E5', fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>5</span>
              <h4 style={{ fontSize: 9, fontWeight: 800, color: '#312E81', letterSpacing: '0.5px', margin: 0 }}>DATA SOURCES</h4>
            </div>
            <ul style={{ margin: 0, paddingLeft: 14, fontSize: 10, color: '#64748B', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li>Warehouses module.</li>
              <li>Inventory & Stock module.</li>
              <li>Tasks & Pick/Pack module.</li>
              <li>Shipments & Purchase Orders.</li>
            </ul>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, paddingTop: 14, borderTop: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: 10, color: '#64748B' }}>All times shown in your local time (AEST)</div>
          <div style={{ fontSize: 10, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshIcon /> Data auto-refreshes every 5 minutes
          </div>
        </div>
      </div>

    </div>
  );
}
