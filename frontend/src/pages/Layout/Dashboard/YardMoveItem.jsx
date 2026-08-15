import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import './WarehouseDashboard.css';
import './YardDashboard.css';
import {
  MapPin, Search, ArrowRight, CheckCircle2, AlertTriangle,
  Loader2, RefreshCw, X, Box, Layers, Truck
} from 'lucide-react';

export default function YardMoveItem() {
  const [showYardMapModal, setShowYardMapModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockList, setStockList] = useState([]);
  const [filteredStock, setFilteredStock] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loadLanes, setLoadLanes] = useState([]);
  const [holdingAreas, setHoldingAreas] = useState([]);

  // Form State
  const [destinationZone, setDestinationZone] = useState('Zone A');
  const [destinationRow, setDestinationRow] = useState('Row 1');
  const [destinationBay, setDestinationBay] = useState('Bay 01');
  const [destinationPosition, setDestinationPosition] = useState('P01');
  const [targetLaneId, setTargetLaneId] = useState('');
  const [targetStagingId, setTargetStagingId] = useState('');
  const [moveReason, setMoveReason] = useState('Internal Depot Move');
  const [moveType, setMoveType] = useState('RELOCATION'); // RELOCATION, STAGE, TRANSFER

  // UI State
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [slotSearch, setSlotSearch] = useState('');

  // Load stock and destinations on mount
  useEffect(() => {
    fetchStockAndDestinations();
  }, []);

  const fetchStockAndDestinations = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [stockRes, lanesRes, holdingRes] = await Promise.all([
        api.get('/warehouse-portal/stock').catch(() => ({ data: { success: false } })),
        api.get('/warehouse-portal/load-lanes').catch(() => ({ data: { success: false } })),
        api.get('/warehouse-portal/holding-areas').catch(() => ({ data: { success: false } }))
      ]);

      if (stockRes.data?.success) {
        const items = stockRes.data.data?.items || stockRes.data.data || [];
        setStockList(items);
        setFilteredStock(items);
      }
      if (lanesRes.data?.success) {
        setLoadLanes(lanesRes.data.data || []);
      }
      if (holdingRes.data?.success) {
        setHoldingAreas(holdingRes.data.data?.areas || holdingRes.data.data || []);
      }
    } catch (err) {
      setErrorMsg('Failed to load yard inventory.');
    } finally {
      setLoading(false);
    }
  };

  // Filter stock when search changes
  useEffect(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      setFilteredStock(stockList);
    } else {
      const filtered = stockList.filter(item => {
        const title = (item.title || item.make || '').toLowerCase();
        const vin = (item.vin || '').toLowerCase();
        const rego = (item.rego || item.plate || '').toLowerCase();
        const itemNo = (item.itemNo || item.id || '').toLowerCase();
        const loc = (item.locationDetail || item.zone || '').toLowerCase();
        return title.includes(q) || vin.includes(q) || rego.includes(q) || itemNo.includes(q) || loc.includes(q);
      });
      setFilteredStock(filtered);
    }
  }, [searchQuery, stockList]);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    // Parse current location if available
    if (item.zone) setDestinationZone(item.zone);
    if (item.row) setDestinationRow(item.row);
    if (item.bay) setDestinationBay(item.bay);
    if (item.position) setDestinationPosition(item.position);
  };

  const handleRelocate = async (e) => {
    e.preventDefault();
    if (!selectedItem) {
      alert('Please select an item or scan a VIN/Barcode to relocate.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        itemId: selectedItem.id,
        toZone: targetLaneId ? 'Load Lanes' : (targetStagingId ? 'Holding Staging' : destinationZone),
        toRow: destinationRow || 'Row 1',
        toBay: destinationBay || 'Bay 01',
        toPosition: destinationPosition || 'P01',
        toLaneId: targetLaneId || null,
        toStagingAreaId: targetStagingId || null,
        reason: moveReason,
        moveType
      };

      const res = await api.post('/warehouse-portal/stock/move', payload);
      if (res.data?.success) {
        const destDesc = targetLaneId 
          ? `Load Lane (${loadLanes.find(l => l.id === targetLaneId)?.name || 'Lane'})` 
          : (targetStagingId 
              ? `Staging (${holdingAreas.find(h => h.id === targetStagingId)?.name || 'Area'})` 
              : `${destinationZone} / ${destinationRow} / ${destinationBay} / ${destinationPosition}`);
        
        setToast(`Successfully relocated ${selectedItem.title || selectedItem.vin || selectedItem.rego} to ${destDesc}`);
        setSelectedItem(null);
        fetchStockAndDestinations();
        setTimeout(() => setToast(null), 5000);
      } else {
        setErrorMsg(res.data?.error?.message || 'Move failed.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error?.message || 'Relocation failed. Please check destination capacity.');
    } finally {
      setSubmitting(false);
    }
  };

  // Mock slot data for visual map preview
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

  return (
    <div className="customer-dashboard" style={{ minHeight: 'calc(100vh - 125px)', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflowY: 'auto', padding: '16px 20px', width: '100%', maxWidth: 1200, margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Header Panel */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <MapPin size={24} color="#F59E0B" />
            Yard Move & Relocate
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748B' }}>
            Select or scan an item in the yard, specify the destination spot or load lane, and confirm canonical relocation.
          </p>
        </div>
        <button
          onClick={fetchStockAndDestinations}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 12, fontWeight: 700, color: '#475569', cursor: 'pointer' }}
        >
          <RefreshCw size={14} />
          Refresh Stock
        </button>
      </div>

      {errorMsg && (
        <div style={{ background: '#FFF5F5', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
          <AlertTriangle size={16} color="#DC2626" />
          <span style={{ fontSize: 12.5, color: '#991B1B', fontWeight: 600 }}>{errorMsg}</span>
        </div>
      )}

      {/* Main Grid: 2 Columns (Left: Selection & Search, Right: Target & Relocate Form) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20, alignItems: 'start' }}>

        {/* Step 1: Select or Scan Item */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Search size={16} color="#3B82F6" />
              1. Search / Select Yard Item
            </h2>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', background: '#F1F5F9', padding: '2px 8px', borderRadius: 20 }}>
              {filteredStock.length} available
            </span>
          </div>

          <div style={{ position: 'relative', marginBottom: 14 }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: 12, top: 12 }} />
            <input
              type="text"
              placeholder="Search by VIN, Plate, SKU, or Location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 36px',
                borderRadius: 10,
                border: '1px solid #CBD5E1',
                fontSize: 12.5,
                outline: 'none',
                color: '#0F172A',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* List of items */}
          <div style={{ maxHeight: 340, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {loading ? (
              <div style={{ padding: 30, textAlign: 'center', color: '#64748B', fontSize: 12 }}>
                <Loader2 size={24} color="#F59E0B" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 8px' }} />
                Loading inventory...
              </div>
            ) : filteredStock.length === 0 ? (
              <div style={{ padding: 30, textAlign: 'center', color: '#94A3B8', fontSize: 12 }}>
                No matching yard items found.
              </div>
            ) : (
              filteredStock.map(item => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: `1.5px solid ${isSelected ? '#3B82F6' : '#E2E8F0'}`,
                      background: isSelected ? '#EFF6FF' : '#F8FAFC',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 12.5, color: '#0F172A' }}>
                        {item.title || `${item.make || ''} ${item.model || ''}` || item.vin || 'Asset'}
                      </div>
                      <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                        {item.vin ? `VIN: ${item.vin}` : ''} {item.rego ? `• Plate: ${item.rego}` : ''}
                      </div>
                      <div style={{ fontSize: 10.5, color: '#2563EB', fontWeight: 600, marginTop: 2 }}>
                        📍 {item.locationDetail || `${item.zone || 'Yard'} / ${item.row || 'R1'} / ${item.bay || 'B1'}`}
                      </div>
                    </div>
                    {isSelected ? (
                      <CheckCircle2 size={18} color="#2563EB" />
                    ) : (
                      <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700 }}>Select →</div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Step 2: Target Location & Confirm */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <ArrowRight size={16} color="#10B981" />
            2. Destination & Move Details
          </h2>

          {selectedItem ? (
            <div style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Selected Item</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>
                {selectedItem.title || selectedItem.vin || selectedItem.rego}
              </div>
              <div style={{ fontSize: 11.5, color: '#475569', marginTop: 2 }}>
                Current: <strong>{selectedItem.locationDetail || `${selectedItem.zone || 'Yard'} / ${selectedItem.row || ''} / ${selectedItem.bay || ''}`}</strong>
              </div>
            </div>
          ) : (
            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '12px 14px', marginBottom: 16, fontSize: 12, color: '#B45309', fontWeight: 600 }}>
              ← Please select an item from the left list first.
            </div>
          )}

          <form onSubmit={handleRelocate}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 6 }}>
                DESTINATION TYPE
              </label>
              <select
                value={moveType}
                onChange={(e) => {
                  setMoveType(e.target.value);
                  if (e.target.value === 'STAGE') {
                    setTargetLaneId(loadLanes[0]?.id || '');
                  } else {
                    setTargetLaneId('');
                    setTargetStagingId('');
                  }
                }}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12.5, outline: 'none', color: '#0F172A' }}
              >
                <option value="RELOCATION">Yard Spot / Zone Relocation</option>
                <option value="STAGE">Stage to Load Lane (Outbound Prep)</option>
                <option value="HOLDING">Move to Holding Area</option>
              </select>
            </div>

            {moveType === 'STAGE' ? (
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 6 }}>
                  SELECT TARGET LOAD LANE
                </label>
                <select
                  value={targetLaneId}
                  onChange={(e) => setTargetLaneId(e.target.value)}
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12.5, outline: 'none', color: '#0F172A' }}
                >
                  <option value="">Select Load Lane...</option>
                  {loadLanes.map(lane => (
                    <option key={lane.id} value={lane.id}>
                      {lane.laneName || lane.name} ({lane.area || 'Main Yard'}) — Cap: 10
                    </option>
                  ))}
                </select>
              </div>
            ) : moveType === 'HOLDING' ? (
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 6 }}>
                  SELECT TARGET HOLDING / STAGING AREA
                </label>
                <select
                  value={targetStagingId}
                  onChange={(e) => setTargetStagingId(e.target.value)}
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12.5, outline: 'none', color: '#0F172A' }}
                >
                  <option value="">Select Holding Area...</option>
                  {holdingAreas.map(area => (
                    <option key={area.id} value={area.id}>
                      {area.name || area.code} ({area.zone || 'Zone A'}) — Cap: {area.capacity || 20}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              /* Yard Zone / Row / Bay / Pos inputs */
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 10.5, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 4 }}>ZONE</label>
                  <select
                    value={destinationZone}
                    onChange={(e) => setDestinationZone(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12, outline: 'none' }}
                  >
                    <option value="Zone A">Zone A (Vehicles)</option>
                    <option value="Zone B">Zone B (Heavy)</option>
                    <option value="Zone C">Zone C (Containers)</option>
                    <option value="Zone D">Zone D (General)</option>
                    <option value="DG Store">DG Store (Hazmat)</option>
                    <option value="Container Yard">Container Yard</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 10.5, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 4 }}>ROW</label>
                  <select
                    value={destinationRow}
                    onChange={(e) => setDestinationRow(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12, outline: 'none' }}
                  >
                    <option value="Row 1">Row 1</option>
                    <option value="Row 2">Row 2</option>
                    <option value="Row 3">Row 3</option>
                    <option value="Row 4">Row 4</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 10.5, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 4 }}>BAY</label>
                  <input
                    type="text"
                    value={destinationBay}
                    onChange={(e) => setDestinationBay(e.target.value)}
                    placeholder="e.g. Bay 05"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 10.5, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 4 }}>POSITION</label>
                  <input
                    type="text"
                    value={destinationPosition}
                    onChange={(e) => setDestinationPosition(e.target.value)}
                    placeholder="e.g. P01"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 4 }}>
                REASON FOR MOVE
              </label>
              <select
                value={moveReason}
                onChange={(e) => setMoveReason(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 12.5, outline: 'none', color: '#0F172A' }}
              >
                <option value="Internal Depot Move">Internal Depot Move</option>
                <option value="Staging for Dispatch">Staging for Dispatch</option>
                <option value="Aisle Reorganization">Aisle Reorganization</option>
                <option value="Customer Request">Customer Request</option>
                <option value="Damage Assessment">Damage Assessment</option>
                <option value="Safety Clearance">Safety Clearance</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={!selectedItem || submitting}
              style={{
                width: '100%',
                padding: '12px 18px',
                borderRadius: 10,
                border: 'none',
                background: selectedItem && !submitting ? '#F59E0B' : '#E2E8F0',
                color: selectedItem && !submitting ? '#0F172A' : '#94A3B8',
                fontSize: 13,
                fontWeight: 800,
                cursor: selectedItem && !submitting ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'background 0.2s ease'
              }}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Persisting Move to Database...
                </>
              ) : (
                '✓ Confirm Yard Relocation'
              )}
            </button>
          </form>

          {/* Quick Yard Map Button */}
          <button
            type="button"
            onClick={() => setShowYardMapModal(true)}
            style={{
              width: '100%',
              marginTop: 10,
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px dashed #CBD5E1',
              background: '#F8FAFC',
              color: '#475569',
              fontSize: 11.5,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            🗺 View Visual Grid Map Preview
          </button>
        </div>

      </div>

      {/* Visual Yard Map Modal */}
      {showYardMapModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            width: '100%',
            maxWidth: 580,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0 }}>Yard Map — Parking Grid</h2>
              <button onClick={() => setShowYardMapModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '16px 20px' }}>
              <input
                type="text"
                placeholder="Search spots (e.g. A1, TR-9410)..."
                value={slotSearch}
                onChange={(e) => setSlotSearch(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', fontSize: 12, borderRadius: 8, border: '1px solid #cbd5e1', outline: 'none', marginBottom: 12, boxSizing: 'border-box' }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
                {yardSlots.filter(s => !slotSearch || s.id.toLowerCase().includes(slotSearch.toLowerCase()) || s.val.toLowerCase().includes(slotSearch.toLowerCase())).map(slot => (
                  <div
                    key={slot.id}
                    onClick={() => {
                      setDestinationBay(`Bay ${slot.id}`);
                      setShowYardMapModal(false);
                    }}
                    style={{
                      backgroundColor: slot.bg,
                      border: `1px solid ${slot.border}`,
                      borderRadius: 8,
                      padding: '10px 8px',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 800, color: slot.color }}>{slot.id}</div>
                    <div style={{ fontSize: 9.5, fontWeight: 600, color: slot.color, marginTop: 2 }}>{slot.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: 12,
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          zIndex: 2000,
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)',
          maxWidth: 460
        }}>
          <CheckCircle2 size={18} color="#166534" />
          <span style={{ fontSize: 12.5, fontWeight: 600, color: '#166534', flex: 1 }}>{toast}</span>
          <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', fontSize: 14, color: '#166534', cursor: 'pointer' }}>✕</button>
        </div>
      )}

    </div>
  );
}
