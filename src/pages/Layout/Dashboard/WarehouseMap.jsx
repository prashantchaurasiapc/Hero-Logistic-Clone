import React, { useState } from 'react';
import { Search, Plus, MapPin, Printer, RefreshCw, FileText, AlertTriangle, ArrowRight, X } from 'lucide-react';
import './WarehouseDashboard.css';

const WarehouseMap = () => {
  // State for selected asset
  const [selectedAssetId, setSelectedAssetId] = useState('ITM-9011');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [holdingModalOpen, setHoldingModalOpen] = useState(false);
  const [loadLaneModalOpen, setLoadLaneModalOpen] = useState(false);
  const [relocateModalOpen, setRelocateModalOpen] = useState(false);

  // Success toast state
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' });
  const [movementModalOpen, setMovementModalOpen] = useState(false);
  const [movementPage, setMovementPage] = useState(1);
  const [rowDensity, setRowDensity] = useState('relaxed'); // 'compact' | 'default' | 'relaxed'
  const [selectedMovements, setSelectedMovements] = useState([]);

  // Form states
  const [newLocationName, setNewLocationName] = useState('');
  const [newLocationClassification, setNewLocationClassification] = useState('Storage Bay / Aisle');
  const [newHoldingName, setNewHoldingName] = useState('');
  const [newLaneName, setNewLaneName] = useState('');
  const [targetLocationSpot, setTargetLocationSpot] = useState('Bay 1 (Bay)');

  // Mock Asset Data
  const [assets, setAssets] = useState([
    {
      id: 'ITM-9011',
      status: 'MISSING',
      pallets: '15 Pallets',
      weight: '14,200 lbs',
      dimensions: '1.2m x 1.2m x 1.5m',
      location: 'Zone A (Dry)',
      zone: 'Zone A (Dry)',
      barcode: 'BAR-9011283',
      customer: 'Global Retail Corp',
      destination: 'Chicago HQ Terminal'
    },
    {
      id: 'ITM-4491',
      status: 'STAGED',
      pallets: '8 Pallets',
      weight: '4,500 lbs',
      dimensions: '1.0m x 1.2m x 1.4m',
      location: 'Aisle 2 - Bin A',
      zone: 'Zone B (Cold)',
      barcode: 'BAR-4491024',
      customer: 'Logistics Solutions Inc',
      destination: 'Detroit Depot'
    },
    {
      id: 'ITM-1022',
      status: 'INWARDED',
      pallets: '6 Pallets',
      weight: '9,800 lbs',
      dimensions: '1.2m x 1.0m x 1.6m',
      location: 'Aisle 1 - Bin B',
      zone: 'Zone A (Dry)',
      barcode: 'BAR-1022987',
      customer: 'FastGoods LLC',
      destination: 'New York Hub'
    }
  ]);

  // Allocation slots
  const [slots, setSlots] = useState([
    { type: 'HOLDING AREA', name: 'Holding Area A', occupiedBy: null },
    { type: 'HOLDING AREA', name: 'Holding Area B', occupiedBy: null },
    { type: 'LOAD LANE', name: 'Lane A1', occupiedBy: null },
    { type: 'LOAD LANE', name: 'Lane A2', occupiedBy: null },
    { type: 'LOAD LANE', name: 'Lane C3', occupiedBy: null },
    { type: 'AISLE/BIN', name: 'Aisle 1 - Bin B', occupiedBy: 'ITM-1022' },
    { type: 'AISLE/BIN', name: 'Aisle 2 - Bin A', occupiedBy: 'ITM-4491' },
    { type: 'AISLE/BIN', name: 'Aisle 4 - Bin C', occupiedBy: null },
  ]);

  const filteredAssets = assets.filter(asset => 
    asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.barcode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedAsset = assets.find(a => a.id === selectedAssetId) || assets[0];

  // Helper to show custom success toast matching screenshots
  const showToast = (message, type = 'success') => {
    setToast({ open: true, message, type });
    setTimeout(() => {
      setToast(prev => prev.message === message ? { open: false, message: '', type: 'success' } : prev);
    }, 4000);
  };

  // Actions
  const handleAssignToLoadLane = () => {
    // Show toast message exactly like screenshot 3:
    showToast('Asset assigned to load lane Lane C3 queue.');
  };

  const handlePrintLabel = () => {
    // Show toast message exactly like screenshot 4:
    showToast(`Printed Zebra barcode tag: ${selectedAsset.barcode}`);
  };

  const handleReprint = () => {
    // Show toast message exactly like screenshot 5:
    showToast(`Reprinted Zebra barcode tag: ${selectedAsset.barcode}`);
  };

  const handleViewAssetHistory = () => {
    setMovementModalOpen(true);
  };

  const handleReportMissing = () => {
    setAssets(assets.map(a => {
      if (a.id === selectedAssetId) {
        return { ...a, status: 'MISSING' };
      }
      return a;
    }));
    // Show error incident toast as in Screenshot 5
    showToast(`Asset ${selectedAsset?.id || 'undefined'} reported missing! Incident ticket dispatched to supervisor.`, 'error');
  };

  // Move Actions
  const handleMoveItemClick = () => {
    // Opens custom relocate modal as in Screenshot 1
    setRelocateModalOpen(true);
  };

  // Submits the relocation modal
  const handleConfirmLocationMove = (e) => {
    if (e) e.preventDefault();
    
    // Update Slots Occupancy
    setSlots(slots.map(s => {
      // If slot name matches target location spot name (strip out the classification suffix in parentheses)
      const cleanTargetName = targetLocationSpot.split(' (')[0];
      if (s.name === cleanTargetName) {
        return { ...s, occupiedBy: selectedAssetId };
      }
      if (s.occupiedBy === selectedAssetId) {
        return { ...s, occupiedBy: null };
      }
      return s;
    }));

    // Update Asset Location
    setAssets(assets.map(a => {
      if (a.id === selectedAssetId) {
        return { ...a, location: targetLocationSpot.split(' (')[0] };
      }
      return a;
    }));

    setRelocateModalOpen(false);
    showToast(`Asset relocated to spot: ${targetLocationSpot.split(' (')[0]}`);
  };

  const handleMoveToHolding = () => {
    const targetSpot = 'Zone A (Dry)';
    
    // Update asset location state
    setAssets(assets.map(a => {
      if (a.id === selectedAssetId) {
        return { ...a, location: targetSpot };
      }
      return a;
    }));

    // Show toast exactly like screenshot 2
    showToast(`Asset moved to holding area: ${targetSpot}.`);
  };

  const handleMoveToLoadLane = () => {
    const targetSpot = 'Lane C3';
    
    // Update asset location state
    setAssets(assets.map(a => {
      if (a.id === selectedAssetId) {
        return { ...a, location: targetSpot };
      }
      return a;
    }));

    // Show toast exactly like screenshot 3
    showToast(`Asset assigned to load lane ${targetSpot} queue.`);
  };

  // Add Location Submit
  const handleSaveLocation = (e) => {
    e.preventDefault();
    if (!newLocationName) return;
    setSlots([...slots, { type: 'AISLE/BIN', name: newLocationName, occupiedBy: null }]);
    setLocationModalOpen(false);
    setNewLocationName('');
    alert(`Successfully added new location: ${newLocationName}`);
  };

  // Add Holding Submit
  const handleSaveHolding = (e) => {
    e.preventDefault();
    if (!newHoldingName) return;
    setSlots([...slots, { type: 'HOLDING AREA', name: newHoldingName, occupiedBy: null }]);
    setHoldingModalOpen(false);
    setNewHoldingName('');
    alert(`Successfully added new holding area: ${newHoldingName}`);
  };

  // Add Lane Submit
  const handleSaveLane = (e) => {
    e.preventDefault();
    if (!newLaneName) return;
    setSlots([...slots, { type: 'LOAD LANE', name: newLaneName, occupiedBy: null }]);
    setLoadLaneModalOpen(false);
    setNewLaneName('');
    alert(`Successfully added new load lane: ${newLaneName}`);
  };

  return (
    <div className="warehouse-dashboard" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header section matches design perfectly */}
      <div className="warehouse-header">
        <div className="warehouse-header-titles">
          <h1>Warehouse/Map</h1>
        </div>
      </div>

      {/* 3-Panel Main Layout Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr 340px',
        gap: '24px',
        flex: 1,
        alignItems: 'stretch',
        marginTop: '12px'
      }}>
        
        {/* Left Panel: Independent Assets */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #f1f5f9',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          textAlign: 'left'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                Independent Assets
              </h2>
              <span style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#b45309',
                backgroundColor: '#fffbeb',
                padding: '3px 8px',
                borderRadius: '9999px',
                border: '1px solid #fef3c7'
              }}>
                {assets.length} Units
              </span>
            </div>

            {/* Search Box */}
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8', width: '16px', height: '16px' }} />
              <input
                type="text"
                placeholder="Search Item No, Barcode..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  padding: '8px 12px 8px 36px',
                  fontSize: '12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  width: '100%',
                  outline: 'none',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>

            {/* Assets List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredAssets.map(asset => {
                const isSelected = asset.id === selectedAssetId;
                const statusColor = asset.status === 'MISSING' ? '#64748b' : 
                                    asset.status === 'STAGED' ? '#3b82f6' : '#10b981';
                return (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAssetId(asset.id)}
                    style={{
                      border: isSelected ? '1.5px solid #ffd400' : '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '16px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#fffbeb' : '#ffffff',
                      transition: 'all 0.2s',
                      boxShadow: isSelected ? '0 4px 12px rgba(255, 212, 0, 0.08)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>{asset.id}</span>
                      <span style={{
                        fontSize: '9px',
                        fontWeight: '800',
                        color: statusColor,
                        backgroundColor: '#f8fafc',
                        border: `1.5px solid #e2e8f0`,
                        borderRadius: '6px',
                        padding: '2px 6px',
                        letterSpacing: '0.05em'
                      }}>
                        {asset.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', fontWeight: '500' }}>
                      <span>{asset.pallets} • {asset.weight}</span>
                      <span style={{ color: '#b45309', fontWeight: '700' }}>{asset.location}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
            * Assets exist independently of load bookings.
          </div>
        </div>

        {/* Middle Panel: Allocation Map Grid */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #f1f5f9',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          textAlign: 'left'
        }}>
          <div>
            {/* Header controls for map */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                Yard / Warehouse Allocation Map
              </h2>
              <div style={{ display: 'flex', gap: '14px', fontSize: '11px', fontWeight: '700' }}>
                <button 
                  onClick={() => setLocationModalOpen(true)} 
                  style={{ background: 'none', border: 'none', color: '#b45309', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                >
                  + Add Location
                </button>
                <button 
                  onClick={() => setHoldingModalOpen(true)} 
                  style={{ background: 'none', border: 'none', color: '#b45309', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                >
                  + Add Holding
                </button>
                <button 
                  onClick={() => setLoadLaneModalOpen(true)} 
                  style={{ background: 'none', border: 'none', color: '#b45309', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                >
                  + Add Load Lane
                </button>
              </div>
            </div>

            {/* Map Dotted Grid Background */}
            <div style={{
              backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)',
              backgroundSize: '16px 16px',
              backgroundColor: '#f8fafc',
              border: '1px dashed #cbd5e1',
              borderRadius: '20px',
              padding: '20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              minHeight: '380px'
            }}>
              {slots.map((slot, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}
                >
                  <div>
                    <span style={{
                      fontSize: '8px',
                      fontWeight: '800',
                      color: '#94a3b8',
                      letterSpacing: '0.05em'
                    }}>
                      {slot.type}
                    </span>
                    <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', margin: '4px 0 0 0' }}>
                      {slot.name}
                    </h4>
                  </div>

                  <div style={{ marginTop: '12px' }}>
                    {slot.occupiedBy ? (
                      <div style={{
                        backgroundColor: '#fffbeb',
                        border: '1px solid #fde68a',
                        borderRadius: '8px',
                        padding: '4px 8px',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#b45309',
                        display: 'inline-block'
                      }}>
                        {slot.occupiedBy}
                      </div>
                    ) : (
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>- Empty Spot</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Actions Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '24px',
            borderTop: '1px solid #f1f5f9',
            paddingTop: '16px'
          }}>
            <button
              onClick={handleMoveItemClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#ffffff',
                border: '1.5px solid #cbd5e1',
                borderRadius: '12px',
                padding: '10px 18px',
                fontSize: '11px',
                fontWeight: '700',
                color: '#0f172a',
                cursor: 'pointer'
              }}
            >
              <ArrowRight className="w-4 h-4" />
              <span>Move Item</span>
            </button>

            <button
              onClick={handleMoveToHolding}
              style={{
                backgroundColor: '#ffffff',
                border: '1.5px solid #fde68a',
                borderRadius: '12px',
                padding: '10px 18px',
                fontSize: '11px',
                fontWeight: '700',
                color: '#b45309',
                cursor: 'pointer'
              }}
            >
              Move to Holding Area
            </button>

            <button
              onClick={handleMoveToLoadLane}
              style={{
                backgroundColor: '#ffffff',
                border: '1.5px solid #fde68a',
                borderRadius: '12px',
                padding: '10px 18px',
                fontSize: '11px',
                fontWeight: '700',
                color: '#b45309',
                cursor: 'pointer'
              }}
            >
              Move to Load Lane
            </button>
          </div>
        </div>

        {/* Right Panel: Active Stock Detail */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #f1f5f9',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          textAlign: 'left'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Active Stock Detail
              </span>
              <span style={{
                fontSize: '9px',
                fontWeight: '800',
                color: selectedAsset.status === 'MISSING' ? '#ef4444' : '#10b981',
                backgroundColor: selectedAsset.status === 'MISSING' ? '#fef2f2' : '#ecfdf5',
                border: '1px solid transparent',
                borderRadius: '6px',
                padding: '2px 6px',
                letterSpacing: '0.05em'
              }}>
                {selectedAsset.status}
              </span>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 16px 0' }}>
              {selectedAsset.id}
            </h3>

            {/* Details Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px 12px',
              borderBottom: '1px solid #f1f5f9',
              paddingBottom: '16px',
              marginBottom: '16px'
            }}>
              <div>
                <span style={{ fontSize: '9px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Pallet Count
                </span>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginTop: '4px' }}>
                  {selectedAsset.pallets}
                </div>
              </div>

              <div style={{ display: 'none' }}></div> {/* spacer */}

              <div>
                <span style={{ fontSize: '9px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Weight
                </span>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginTop: '4px' }}>
                  {selectedAsset.weight}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '9px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Dimensions
                </span>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginTop: '4px' }}>
                  {selectedAsset.dimensions}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '9px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Aisle/Bin Location
                </span>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#b45309', marginTop: '4px' }}>
                  {selectedAsset.location}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '9px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Zone
                </span>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginTop: '4px' }}>
                  {selectedAsset.zone}
                </div>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ fontSize: '9px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Barcode / QR
                </span>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginTop: '4px', fontFamily: 'monospace' }}>
                  {selectedAsset.barcode}
                </div>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ fontSize: '9px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Customer Account
                </span>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginTop: '4px' }}>
                  {selectedAsset.customer}
                </div>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ fontSize: '9px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Destination Delivery
                </span>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginTop: '4px' }}>
                  {selectedAsset.destination}
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons inside right panel matching screenshot */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={handleAssignToLoadLane}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                backgroundColor: '#ffffff',
                border: '1.5px solid #cbd5e1',
                borderRadius: '12px',
                padding: '10px',
                fontSize: '12px',
                fontWeight: '700',
                color: '#0f172a',
                cursor: 'pointer'
              }}
            >
              <MapPin className="w-4 h-4" />
              <span>Assign to Load Lane</span>
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handlePrintLabel}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '10px',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#0f172a',
                  cursor: 'pointer'
                }}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Label</span>
              </button>

              <button
                onClick={handleReprint}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '10px',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#0f172a',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reprint</span>
              </button>
            </div>

            <button
              onClick={handleViewAssetHistory}
              style={{
                width: '100%',
                backgroundColor: '#ffffff',
                border: '1px solid transparent',
                fontSize: '11px',
                fontWeight: '700',
                color: '#64748b',
                cursor: 'pointer',
                padding: '6px'
              }}
            >
              View Asset History
            </button>

            <button
              onClick={handleReportMissing}
              style={{
                width: '100%',
                backgroundColor: '#fef2f2',
                border: 'none',
                borderRadius: '12px',
                padding: '10px',
                fontSize: '11px',
                fontWeight: '700',
                color: '#ef4444',
                cursor: 'pointer'
              }}
            >
              Report Missing Item
            </button>

            <button
              onClick={() => setMovementModalOpen(true)}
              style={{
                width: '100%',
                backgroundColor: '#ffd400',
                color: '#0f172a',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(255, 212, 0, 0.2)',
                marginTop: '4px'
              }}
            >
              View Movement History
            </button>
          </div>
        </div>

      </div>

      {/* Modal 1: Add New Bay */}
      {locationModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }} onClick={() => setLocationModalOpen(false)}>
          <form 
            onSubmit={handleSaveLocation}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '520px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              animation: 'scaleIn 0.2s ease-out'
            }} onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Add New Bay</h2>
              <button 
                type="button"
                onClick={() => setLocationModalOpen(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
              <label style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Location Name
              </label>
              <input
                type="text"
                placeholder="e.g. Bay 4"
                value={newLocationName}
                onChange={e => setNewLocationName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '14px',
                  color: '#0f172a',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '12px',
                  outline: 'none'
                }}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
              <label style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Location Classification
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={newLocationClassification}
                  onChange={e => setNewLocationClassification(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#0f172a',
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '12px',
                    outline: 'none',
                    appearance: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Storage Bay / Aisle">Storage Bay / Aisle</option>
                  <option value="Inbound Dock">Inbound Dock</option>
                  <option value="Outbound Dock">Outbound Dock</option>
                </select>
                <div style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: '#64748b',
                  fontSize: '12px'
                }}>▼</div>
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#ffd400',
                color: '#0f172a',
                border: 'none',
                borderRadius: '12px',
                padding: '14px',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(255, 212, 0, 0.3)'
              }}
            >
              Save Location
            </button>
          </form>
        </div>
      )}

      {/* Modal 2: Add Holding Area Zone */}
      {holdingModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }} onClick={() => setHoldingModalOpen(false)}>
          <form 
            onSubmit={handleSaveHolding}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '520px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              animation: 'scaleIn 0.2s ease-out'
            }} onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Add Holding Area Zone</h2>
              <button 
                type="button"
                onClick={() => setHoldingModalOpen(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
              <label style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Holding Zone Name
              </label>
              <input
                type="text"
                placeholder="e.g. Holding Area C"
                value={newHoldingName}
                onChange={e => setNewHoldingName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '14px',
                  color: '#0f172a',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '12px',
                  outline: 'none'
                }}
                required
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#ffd400',
                color: '#0f172a',
                border: 'none',
                borderRadius: '12px',
                padding: '14px',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(255, 212, 0, 0.3)'
              }}
            >
              Create Holding Area
            </button>
          </form>
        </div>
      )}

      {/* Modal 3: Add Load Lane Spot */}
      {loadLaneModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }} onClick={() => setLoadLaneModalOpen(false)}>
          <form 
            onSubmit={handleSaveLane}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '520px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              animation: 'scaleIn 0.2s ease-out'
            }} onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Add Load Lane Spot</h2>
              <button 
                type="button"
                onClick={() => setLoadLaneModalOpen(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
              <label style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Load Lane Name
              </label>
              <input
                type="text"
                placeholder="e.g. Lane B1"
                value={newLaneName}
                onChange={e => setNewLaneName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '14px',
                  color: '#0f172a',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '12px',
                  outline: 'none'
                }}
                required
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#ffd400',
                color: '#0f172a',
                border: 'none',
                borderRadius: '12px',
                padding: '14px',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(255, 212, 0, 0.3)'
              }}
            >
                          Create Load Lane
            </button>
          </form>
        </div>
      )}

      {/* Modal 4: Relocate Asset Location (Screenshot 1) */}
      {relocateModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }} onClick={() => setRelocateModalOpen(false)}>
          <form 
            onSubmit={handleConfirmLocationMove}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '480px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              animation: 'scaleIn 0.2s ease-out'
            }} onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Relocate Asset Location</h2>
              <button 
                type="button"
                onClick={() => setRelocateModalOpen(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
              <label style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Select Target Location Spot
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={targetLocationSpot}
                  onChange={e => setTargetLocationSpot(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#0f172a',
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '12px',
                    outline: 'none',
                    appearance: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Bay 1 (Bay)">Bay 1 (Bay)</option>
                  <option value="Bay 2 (Bay)">Bay 2 (Bay)</option>
                  <option value="Lane A1 (Lane)">Lane A1 (Lane)</option>
                  <option value="Lane C3 (Lane)">Lane C3 (Lane)</option>
                  <option value="Holding Area A (Holding Zone)">Holding Area A (Holding Zone)</option>
                  <option value="Holding Area B (Holding Zone)">Holding Area B (Holding Zone)</option>
                </select>
                <div style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: '#64748b',
                  fontSize: '12px'
                }}>▼</div>
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#ffd400',
                color: '#0f172a',
                border: 'none',
                borderRadius: '12px',
                padding: '14px',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(255, 212, 0, 0.3)'
              }}
            >
              Confirm Location Move
            </button>
          </form>
        </div>
      )}

      {/* Modal 5: Full Warehouse Movement Register (Screenshots 1, 2, 3, 4) */}
      {movementModalOpen && (() => {
        const movementsData = [
          // Page 1
          { id: 1, code: '', action: 'FLAGGED MISSING', timestamp: '15/7/2026, 6:31:19 pm' },
          { id: 2, code: '', action: 'Assigned load lane routing: Lane C3', timestamp: '15/7/2026, 6:31:16 pm' },
          { id: 3, code: '', action: 'Assigned load lane routing: Lane C3', timestamp: '15/7/2026, 6:18:56 pm' },
          { id: 4, code: '', action: 'Moved to holding area: Zone A (Dry)', timestamp: '15/7/2026, 6:18:30 pm' },
          { id: 5, code: '', action: 'Moved to load lane: Lane A1', timestamp: '15/7/2026, 6:18:26 pm' },
          // Page 2
          { id: 6, code: '', action: 'Moved to holding area: Zone A (Dry)', timestamp: '15/7/2026, 6:18:23 pm' },
          { id: 7, code: '', action: 'Moved to holding area: Zone A (Dry)', timestamp: '15/7/2026, 6:18:20 pm' },
          { id: 8, code: '', action: 'Assigned load lane routing: Lane C3', timestamp: '15/7/2026, 6:15:23 pm' },
          { id: 9, code: '', action: 'FLAGGED MISSING', timestamp: '15/7/2026, 6:15:13 pm' },
          { id: 10, code: 'FR-1', action: 'Moved to holding area: Zone A (Dry)', timestamp: '15/7/2026, 6:03:15 pm' },
          // Page 3
          { id: 11, code: 'FR-1', action: 'FLAGGED MISSING', timestamp: '15/7/2026, 5:53:46 pm' },
          { id: 12, code: 'FR-1', action: 'Moved to holding area: Zone A (Dry)', timestamp: '15/7/2026, 5:52:59 pm' },
          { id: 13, code: 'FR-1', action: 'Assigned load lane routing: Lane C3', timestamp: '15/7/2026, 5:52:52 pm' },
          { id: 14, code: 'FR-1', action: 'Moved to holding area: Zone A (Dry)', timestamp: '15/7/2026, 5:52:50 pm' },
          { id: 15, code: 'FR-1', action: 'Assigned load lane routing: Lane C3', timestamp: '15/7/2026, 5:52:48 pm' },
          // Page 4
          { id: 16, code: 'FR-1', action: 'Moved to holding area: Zone B (Cold)', timestamp: '15/7/2026, 5:50:10 pm' },
          { id: 17, code: 'ITM-9011', action: 'Printed Zebra barcode tag: BAR-9011283', timestamp: '15/7/2026, 5:48:15 pm' },
          { id: 18, code: 'ITM-4491', action: 'Reprinted Zebra barcode tag: BAR-4491024', timestamp: '15/7/2026, 5:45:00 pm' },
          { id: 19, code: 'ITM-1022', action: 'Inwarded to Aisle 1 - Bin B', timestamp: '15/7/2026, 5:30:22 pm' },
          { id: 20, code: 'ITM-1022', action: 'Received Shipment', timestamp: '15/7/2026, 5:00:00 pm' }
        ];

        const PAGE_SIZE = 5;
        const totalPages = Math.ceil(movementsData.length / PAGE_SIZE);
        const currentMovements = movementsData.slice((movementPage - 1) * PAGE_SIZE, movementPage * PAGE_SIZE);
        
        const isAllPageSelected = currentMovements.every(item => selectedMovements.includes(item.id));
        const toggleSelectAllPage = () => {
          const pageIds = currentMovements.map(item => item.id);
          if (isAllPageSelected) {
            setSelectedMovements(selectedMovements.filter(id => !pageIds.includes(id)));
          } else {
            const newSelection = [...selectedMovements];
            pageIds.forEach(id => {
              if (!newSelection.includes(id)) newSelection.push(id);
            });
            setSelectedMovements(newSelection);
          }
        };

        const toggleMovementSelection = (id) => {
          if (selectedMovements.includes(id)) {
            setSelectedMovements(selectedMovements.filter(x => x !== id));
          } else {
            setSelectedMovements([...selectedMovements, id]);
          }
        };

        // Row cell padding depending on rowDensity
        const getRowPadding = () => {
          if (rowDensity === 'compact') return '6px 12px';
          if (rowDensity === 'default') return '12px 18px';
          return '18px 24px';
        };

        return (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }} onClick={() => setMovementModalOpen(false)}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '640px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              animation: 'scaleIn 0.2s ease-out'
            }} onClick={e => e.stopPropagation()}>
              
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Full Warehouse Movement Register
                </h2>
                <button 
                  type="button"
                  onClick={() => setMovementModalOpen(false)}
                  style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Selection Bar & Control Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedMovements.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', animation: 'fadeIn 0.15s ease-out' }}>
                    <span style={{
                      backgroundColor: '#fffbeb',
                      color: '#d97706',
                      border: '1px solid #fde68a',
                      fontWeight: '800',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      letterSpacing: '0.02em'
                    }}>
                      {selectedMovements.length} SELECTED
                    </span>
                    <button
                      onClick={() => {
                        alert(`Exported ${selectedMovements.length} items to CSV format.`);
                        setSelectedMovements([]);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: '#fffbeb',
                        color: '#b45309',
                        border: '1.5px solid #fcd34d',
                        borderRadius: '12px',
                        padding: '6px 14px',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        marginLeft: '12px'
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      <span>CSV Export</span>
                    </button>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '9999px', display: 'flex', gap: '2px' }}>
                    {['COMPACT', 'DEFAULT', 'RELAXED'].map(density => {
                      const isActive = rowDensity === density.toLowerCase();
                      return (
                        <button
                          key={density}
                          type="button"
                          onClick={() => setRowDensity(density.toLowerCase())}
                          style={{
                            backgroundColor: isActive ? '#ffd400' : 'transparent',
                            color: isActive ? '#0f172a' : '#64748b',
                            border: 'none',
                            borderRadius: '9999px',
                            padding: '6px 14px',
                            fontSize: '11px',
                            fontWeight: isActive ? '800' : '700',
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                        >
                          {density}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1.5px solid #e2e8f0',
                      color: '#64748b',
                      padding: '8px 16px',
                      borderRadius: '12px',
                      fontWeight: '700',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                    <span>COLUMNS</span>
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div style={{
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                overflow: 'hidden',
                backgroundColor: '#ffffff'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1.5px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                      <th style={{ padding: '14px 20px', width: '40px' }}>
                        <div 
                          onClick={toggleSelectAllPage}
                          style={{
                            width: '18px',
                            height: '18px',
                            border: isAllPageSelected ? '2px solid #b45309' : '2px solid #94a3b8',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            backgroundColor: isAllPageSelected ? '#ffd400' : 'transparent'
                          }}
                        >
                          {isAllPageSelected && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1.5 4L4 6.5L8.5 1.5" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                      </th>
                      <th style={{ padding: '14px 20px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Asset Code
                      </th>
                      <th style={{ padding: '14px 20px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Action Logged
                      </th>
                      <th style={{ padding: '14px 20px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMovements.map(item => {
                      const isChecked = selectedMovements.includes(item.id);
                      
                      // Split timestamp for stacked styling
                      const parts = item.timestamp.split(' ');
                      const datePart = parts[0];
                      const timePart = parts[1];
                      const ampmPart = parts[2];

                      return (
                        <tr 
                          key={item.id} 
                          style={{ 
                            borderBottom: '1px solid #e2e8f0', 
                            backgroundColor: isChecked ? '#fffbeb' : '#ffffff',
                            transition: 'background-color 0.15s'
                          }}
                        >
                          <td style={{ padding: getRowPadding() }}>
                            <div 
                              onClick={() => toggleMovementSelection(item.id)}
                              style={{
                                width: '18px',
                                height: '18px',
                                border: isChecked ? '2px solid #b45309' : '2px solid #cbd5e1',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                backgroundColor: isChecked ? '#ffd400' : 'transparent',
                                transition: 'all 0.1s'
                              }}
                            >
                              {isChecked && (
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1.5 4L4 6.5L8.5 1.5" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: getRowPadding(), fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>
                            {item.code || ''}
                          </td>
                          <td style={{ padding: getRowPadding(), fontSize: '14px', fontWeight: '800', color: '#475569' }}>
                            {item.action}
                          </td>
                          <td style={{ padding: getRowPadding() }}>
                            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textAlign: 'right', lineHeight: '1.2' }}>
                              <div>{datePart} {timePart}</div>
                              <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '2px', textTransform: 'lowercase' }}>{ampmPart}</div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Modal Pagination Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>
                  Showing <span style={{ fontWeight: '800', color: '#0f172a' }}>{(movementPage - 1) * PAGE_SIZE + 1} to {Math.min(movementPage * PAGE_SIZE, movementsData.length)}</span> of <span style={{ fontWeight: '800', color: '#0f172a' }}>{movementsData.length}</span> items
                </span>

                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {/* Prev page */}
                  <button
                    onClick={() => setMovementPage(p => Math.max(1, p - 1))}
                    disabled={movementPage === 1}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      backgroundColor: '#ffffff',
                      color: movementPage === 1 ? '#cbd5e1' : '#64748b',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: movementPage === 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    ‹
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    const isPageActive = movementPage === page;
                    return (
                      <button
                        key={page}
                        onClick={() => setMovementPage(page)}
                        style={{
                          border: 'none',
                          borderRadius: '10px',
                          backgroundColor: isPageActive ? '#ffd400' : 'transparent',
                          color: isPageActive ? '#0f172a' : '#64748b',
                          fontWeight: isPageActive ? '800' : '700',
                          fontSize: '12px',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        {page}
                      </button>
                    );
                  })}

                  {/* Next page */}
                  <button
                    onClick={() => setMovementPage(p => Math.min(totalPages, p + 1))}
                    disabled={movementPage === totalPages}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      backgroundColor: '#ffffff',
                      color: movementPage === totalPages ? '#cbd5e1' : '#64748b',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: movementPage === totalPages ? 'not-allowed' : 'pointer'
                    }}
                  >
                    ›
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* Floating Toast (Success or Error) (Screenshots 2, 3, 4, 5) */}
      {toast.open && (() => {
        const isError = toast.type === 'error';
        return (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: isError ? '#fef2f2' : '#e6fbf2',
            border: isError ? '1.5px solid #fca5a5' : '1.5px solid #a7f3d0',
            borderRadius: '16px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            zIndex: 10000,
            animation: 'fadeIn 0.2s ease-out'
          }}>
            {isError ? (
              /* Circular Danger exclamation icon matching Screenshot 5 */
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                <circle cx="10" cy="10" r="9" stroke="#ef4444" strokeWidth="2" />
                <path d="M10 6V11" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                <circle cx="10" cy="14" r="1.25" fill="#ef4444" />
              </svg>
            ) : (
              /* Circular Checkmark icon matching Screenshots 2, 3, 4 */
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                <circle cx="10" cy="10" r="9" stroke="#10b981" strokeWidth="2" />
                <path d="M6 10L9 13L14 7" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>
              {toast.message}
            </span>
            <button
              onClick={() => setToast({ open: false, message: '', type: 'success' })}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
                marginLeft: '8px'
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })()}

    </div>
  );
};

export default WarehouseMap;
