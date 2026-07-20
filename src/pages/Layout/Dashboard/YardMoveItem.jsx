import React, { useState } from 'react';
import './WarehouseDashboard.css';
import './YardDashboard.css';

// SVG Icons
const MapPinIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default function YardMoveItem() {
  const [showYardMapModal, setShowYardMapModal] = useState(false);
  const [trailerId, setTrailerId] = useState('');
  const [originSpot, setOriginSpot] = useState('A2');
  const [destinationSpot, setDestinationSpot] = useState('A3');
  const [toast, setToast] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleRelocate = (e) => {
    e.preventDefault();
    if (!trailerId.trim()) {
      alert('Please enter a Trailer/Container ID');
      return;
    }
    setToast(`Trailer ${trailerId} relocated from spot ${originSpot} to ${destinationSpot}.`);
    // Clear toast after 5 seconds
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  // Yard Map slots
  const yardSlots = [
    { id: 'A1', type: 'Trailer', val: 'TR-9410', bg: '#FEF3C7', border: '#FDE68A', color: '#B45309' },
    { id: 'A2', type: 'Trailer (busy)', val: 'TR-1102', bg: '#DBEAFE', border: '#BFDBFE', color: '#1D4ED8' },
    { id: 'A3', type: 'Available', val: 'Free', bg: '#FFFFFF', border: '#E2E8F0', color: '#64748b' },
    { id: 'A4', type: 'Purple', val: 'TR-7712', bg: '#F3E8FF', border: '#E9D5FF', color: '#7E22CE' },
    { id: 'A5', type: 'Available', val: 'Free', bg: '#FFFFFF', border: '#E2E8F0', color: '#64748b' },
    { id: 'B1', type: 'Container', val: 'CTR-009', bg: '#D1FAE5', border: '#A7F3D0', color: '#047857' },
    { id: 'B2', type: 'Available', val: 'Free', bg: '#FFFFFF', border: '#E2E8F0', color: '#64748b' },
    { id: 'B3', type: 'Vehicle', val: 'VEH-4820', bg: '#FEF3C7', border: '#FDE68A', color: '#B45309' },
    { id: 'B4', type: 'Available', val: 'Free', bg: '#FFFFFF', border: '#E2E8F0', color: '#64748b' },
    { id: 'B5', type: 'Red', val: 'CTR-018', bg: '#FEE2E2', border: '#FCA5A5', color: '#B91C1C' },
    { id: 'C1', type: 'Available', val: 'Free', bg: '#FFFFFF', border: '#E2E8F0', color: '#64748b' },
    { id: 'C2', type: 'Trailer', val: 'TR-4809', bg: '#FEF3C7', border: '#FDE68A', color: '#B45309' },
    { id: 'C3', type: 'Available', val: 'Free', bg: '#FFFFFF', border: '#E2E8F0', color: '#64748b' },
    { id: 'C4', type: 'Vehicle', val: 'VEH-1144', bg: '#FFEDD5', border: '#FED7AA', color: '#C2410C' },
    { id: 'C5', type: 'Available', val: 'Free', bg: '#FFFFFF', border: '#E2E8F0', color: '#64748b' }
  ];

  const handleSlotClick = (slot) => {
    if (slot.val === 'Free') {
      alert(`Bay ${slot.id} is empty`);
    } else {
      alert(`Slot ${slot.id} Occupied - ${slot.val}`);
    }
  };

  return (
    <div className="customer-dashboard" style={{ height: 'calc(100vh - 125px)', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflowY: 'auto', padding: 0, width: '100%', maxWidth: 'none', fontFamily: 'Inter, Outfit, sans-serif' }}>

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8" style={{ flexShrink: 0, padding: '16px 20px', gap: 16 }}>
        <div>
          <h1 className="text-2xl text-slate-900 leading-8 capitalize font-black flex items-center gap-2">
            Yard Attendant <span className="text-slate-400 text-xl mx-1">•</span> Move Item
          </h1>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">
            Relocate spotted trailers, containers, and vehicles across yard lanes.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', minHeight: 0, width: '100%' }}>

        {/* Full width container box */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 0,
          padding: '24px 20px',
          width: '100%',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          borderTop: '1px solid #e2e8f0',
          borderBottom: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          textAlign: 'left'
        }}>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>

            {/* Left Card: Form */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 16,
              padding: '24px 20px',
              boxSizing: 'border-box'
            }}>
              <h2 style={{ fontSize: 14.5, fontWeight: '800', color: '#0f172a', margin: '0 0 18px 0' }}>Relocate spotted container</h2>

              <form onSubmit={handleRelocate}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 10.5, fontWeight: '800', color: '#64748b', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>
                    TRAILER CONTAINER PLATE ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TR-9410"
                    value={trailerId}
                    onChange={(e) => setTrailerId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 12,
                      border: '1px solid #cbd5e1',
                      fontSize: 13,
                      fontWeight: '500',
                      outline: 'none',
                      color: '#0f172a',
                      backgroundColor: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 10.5, fontWeight: '800', color: '#64748b', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>
                    ORIGIN SPOT LANE
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Origin lane"
                    value={originSpot}
                    onChange={(e) => setOriginSpot(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 12,
                      border: '1px solid #cbd5e1',
                      fontSize: 13,
                      fontWeight: '500',
                      outline: 'none',
                      color: '#0f172a',
                      backgroundColor: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 10.5, fontWeight: '800', color: '#64748b', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>
                    DESTINATION SPOT LANE
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Destination lane"
                    value={destinationSpot}
                    onChange={(e) => setDestinationSpot(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 12,
                      border: '1px solid #cbd5e1',
                      fontSize: 13,
                      fontWeight: '500',
                      outline: 'none',
                      color: '#0f172a',
                      backgroundColor: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  style={{
                    width: '100%',
                    backgroundColor: '#ffcc00',
                    color: '#000000',
                    border: isHovered ? '2px solid #000000' : '1px solid transparent',
                    borderRadius: 12,
                    padding: '14px 20px',
                    fontSize: 13,
                    fontWeight: '800',
                    cursor: 'pointer',
                    outline: 'none',
                    textAlign: 'center',
                    boxShadow: '0 2px 4px rgba(255, 204, 0, 0.15)',
                    transition: 'all 0.15s ease',
                    boxSizing: 'border-box'
                  }}
                >
                  Relocate spotted container
                </button>
              </form>
            </div>

            {/* Right Card: Visual Map Preview */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 16,
              padding: '24px 20px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h2 style={{ fontSize: 14.5, fontWeight: '800', color: '#0f172a', margin: 0 }}>Visual Spotting Map Preview</h2>
              <p style={{ fontSize: 11.5, color: '#64748b', margin: '4px 0 16px 0' }}>
                Live container parking grid zones.
              </p>

              <div
                onClick={() => setShowYardMapModal(true)}
                style={{
                  flex: 1,
                  minHeight: 220,
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)',
                  backgroundSize: '16px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  cursor: 'pointer',
                  padding: '20px',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
              >
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <MapPinIcon />
                </div>
                <span style={{ fontSize: 12.5, color: '#475569', fontWeight: '700' }}>
                  Click to open Interactive Yard Map
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Yard Map Modal */}
      {showYardMapModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 24,
            width: '100%',
            maxWidth: 580,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 16.5, fontWeight: '800', color: '#0f172a', margin: 0 }}>Yard Map &mdash; Parking Grid</h2>
              <button
                onClick={() => setShowYardMapModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: '#64748b' }}
              >
                <CloseIcon />
              </button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', justifyContent: 'flex-start', alignItems: 'center', fontSize: 11.5, fontWeight: '600', color: '#475569' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ffcc00' }}></span>
                  <span>Trailer</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#3b82f6' }}></span>
                  <span>Trailer (busy)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10b981' }}></span>
                  <span>Container</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#f59e0b' }}></span>
                  <span>Vehicle</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#334155' }}></span>
                  <span>Available</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: 12, marginTop: 8 }}>
                {yardSlots.map((slot) => (
                  <div
                    key={slot.id}
                    onClick={() => handleSlotClick(slot)}
                    style={{
                      backgroundColor: slot.bg,
                      border: `1px solid ${slot.border}`,
                      borderRadius: 10,
                      padding: '14px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                    }}
                  >
                    <span style={{ fontSize: 11.5, fontWeight: '800', color: slot.color }}>{slot.id}</span>
                    <span style={{ fontSize: 9.5, fontWeight: '600', color: slot.color, marginTop: 4 }}>{slot.val}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                <button
                  onClick={() => setShowYardMapModal(false)}
                  style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 8, padding: '8px 24px', fontSize: 12, fontWeight: '700', color: '#334155', cursor: 'pointer', outline: 'none' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Relocated Toast Notification */}
      {toast && (
        <div className="yard-toast-popup settings-toast" style={{
          position: 'fixed',
          bottom: 30,
          right: 32,
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 12,
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          zIndex: 2000,
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
          maxWidth: 420,
          textAlign: 'left'
        }}>
          <div style={{ backgroundColor: '#166534', color: '#ffffff', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>✓</div>
          <span style={{ fontSize: 13, fontWeight: '600', color: '#166534', flex: 1 }}>{toast}</span>
          <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', fontSize: 16, color: '#166534', cursor: 'pointer', marginLeft: 8 }}>✕</button>
        </div>
      )}

    </div>
  );
}
