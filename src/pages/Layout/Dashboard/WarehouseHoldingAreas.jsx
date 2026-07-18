import React, { useState } from 'react';
import { Settings, Plus, X, ArrowRight, Check } from 'lucide-react';
import './WarehouseDashboard.css';

const WarehouseHoldingAreas = () => {
  // Density states ('compact' | 'default' | 'relaxed')
  const [leftDensity, setLeftDensity] = useState('relaxed');
  const [rightDensity, setRightDensity] = useState('relaxed');

  // Column visibility states
  const [leftVisibleColumns, setLeftVisibleColumns] = useState({
    holdingArea: true,
    capacity: true,
    status: true
  });
  const [rightVisibleColumns, setRightVisibleColumns] = useState({
    assetCode: true,
    holdingArea: true,
    actions: true
  });

  // Dropdown menu states
  const [leftColumnsOpen, setLeftColumnsOpen] = useState(false);
  const [rightColumnsOpen, setRightColumnsOpen] = useState(false);

  // Selection states
  const [leftSelectedRows, setLeftSelectedRows] = useState([]);
  const [rightSelectedRows, setRightSelectedRows] = useState([]);

  // Modals state
  const [addAreaModalOpen, setAddAreaModalOpen] = useState(false);
  const [moveAssetModalOpen, setMoveAssetModalOpen] = useState(false);
  const [newAreaName, setNewAreaName] = useState('');
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [targetHoldingArea, setTargetHoldingArea] = useState('Holding Area A');

  // Toast notification state
  const [toast, setToast] = useState({ open: false, message: '' });

  // Data states
  const [holdingAreas, setHoldingAreas] = useState([
    { id: 'HA-1', name: 'Holding Area A', capacity: 50, status: 'AVAILABLE' },
    { id: 'HA-2', name: 'Holding Area B', capacity: 50, status: 'AVAILABLE' }
  ]);

  const [assets, setAssets] = useState([
    { id: 'CAR-1', code: 'CAR-1', holdingArea: 'Holding Area A' },
    { id: 'CAR-2', code: 'CAR-2', holdingArea: 'Holding Area B' }
  ]);

  // Helpers to get density padding
  const getCellPadding = (density) => {
    if (density === 'compact') return '10px 16px';
    if (density === 'default') return '14px 20px';
    return '20px 24px'; // relaxed is default
  };

  // Toast trigger
  const showToast = (message) => {
    setToast({ open: true, message });
    setTimeout(() => {
      setToast(prev => prev.message === message ? { open: false, message: '' } : prev);
    }, 4000);
  };

  // Selection Handlers - Left Table
  const handleLeftRowSelect = (name) => {
    if (leftSelectedRows.includes(name)) {
      setLeftSelectedRows(leftSelectedRows.filter(x => x !== name));
    } else {
      setLeftSelectedRows([...leftSelectedRows, name]);
    }
  };

  const handleLeftSelectAll = () => {
    if (leftSelectedRows.length === holdingAreas.length) {
      setLeftSelectedRows([]);
    } else {
      setLeftSelectedRows(holdingAreas.map(h => h.name));
    }
  };

  // Selection Handlers - Right Table
  const handleRightRowSelect = (id) => {
    if (rightSelectedRows.includes(id)) {
      setRightSelectedRows(rightSelectedRows.filter(x => x !== id));
    } else {
      setRightSelectedRows([...rightSelectedRows, id]);
    }
  };

  const handleRightSelectAll = () => {
    if (rightSelectedRows.length === assets.length) {
      setRightSelectedRows([]);
    } else {
      setRightSelectedRows(assets.map(a => a.id));
    }
  };

  // Action: Add Holding Area
  const handleCreateHoldingArea = (e) => {
    e.preventDefault();
    if (!newAreaName.trim()) return;

    const nameExists = holdingAreas.some(
      h => h.name.toLowerCase() === newAreaName.trim().toLowerCase()
    );

    if (nameExists) {
      alert('A holding area with this name already exists.');
      return;
    }

    const newArea = {
      id: `HA-${Date.now()}`,
      name: newAreaName.trim(),
      capacity: 50,
      status: 'AVAILABLE'
    };

    setHoldingAreas([...holdingAreas, newArea]);
    setNewAreaName('');
    setAddAreaModalOpen(false);
    showToast(`Holding area "${newArea.name}" created successfully.`);
  };

  // Action: Move Asset
  const handleMoveClick = (assetId) => {
    setSelectedAssetId(assetId);
    const currentAsset = assets.find(a => a.id === assetId);
    if (currentAsset) {
      setTargetHoldingArea(currentAsset.holdingArea);
    }
    setMoveAssetModalOpen(true);
  };

  const handleConfirmMove = (e) => {
    e.preventDefault();
    setAssets(assets.map(asset => {
      if (asset.id === selectedAssetId) {
        return { ...asset, holdingArea: targetHoldingArea };
      }
      return asset;
    }));
    setMoveAssetModalOpen(false);
    showToast(`Asset ${selectedAssetId} relocated to ${targetHoldingArea}.`);
  };

  // Action: Remove Asset
  const handleRemoveAsset = (assetId) => {
    setAssets(assets.filter(a => a.id !== assetId));
    showToast(`Asset ${assetId} flagged for removal from holding.`);
  };

  // Calculate capacities
  const getCapacityCount = (areaName) => {
    return assets.filter(a => a.holdingArea === areaName).length;
  };

  return (
    <div className="warehouse-dashboard" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header section matches WarehouseMap perfectly */}
      <div className="warehouse-header" style={{ marginBottom: '16px' }}>
        <div className="warehouse-header-titles" style={{ textAlign: 'left' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Holding Areas</h1>
        </div>
      </div>

      {/* Title & Description & Button header bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: '20px 24px',
        borderRadius: '16px',
        border: '1px solid #f1f5f9',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        marginBottom: '24px',
        textAlign: 'left'
      }}>
        <div>
          <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>Holding Area Management</h2>
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Manage intermediate holding zones and assigned staging assets.</p>
        </div>
        <button
          onClick={() => setAddAreaModalOpen(true)}
          className="btn btn-white-orange-wh"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 18px',
            fontSize: '12px',
            fontWeight: '700',
            borderRadius: '12px',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Holding Area</span>
        </button>
      </div>

      {/* 2-Panel Layout Grid */}
      <div className="responsive-two-panel-grid">
        
        {/* Left Panel: HOLDING ZONES STATUS */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #f1f5f9',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          textAlign: 'left'
        }}>
          {/* Header controls for Left Table */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              Holding Zones Status
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              {/* Density control */}
              <div className="wh-segmented-control">
                {['COMPACT', 'DEFAULT', 'RELAXED'].map((mode) => {
                  const isActive = leftDensity === mode.toLowerCase();
                  return (
                    <button
                      key={mode}
                      onClick={() => setLeftDensity(mode.toLowerCase())}
                      className="segmented-btn"
                      style={{
                        padding: '5px 12px',
                        fontSize: '9px',
                        borderRadius: '6px',
                        backgroundColor: isActive ? '#ffd400' : 'transparent',
                        color: isActive ? '#0f172a' : '#64748b',
                        border: isActive ? '1px solid #000' : '1px solid transparent',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {mode}
                    </button>
                  );
                })}
              </div>

              {/* Column Visibility Selector */}
              <div style={{ position: 'relative' }}>
                <button
                  className="btn btn-white-wh"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    fontSize: '10px',
                    borderRadius: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    border: leftColumnsOpen ? '1.5px solid #000000' : '1px solid #e2e8f0',
                    color: leftColumnsOpen ? '#0f172a' : '#64748b',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                  onClick={() => setLeftColumnsOpen(!leftColumnsOpen)}
                >
                  <Settings className="h-3.5 w-3.5 text-slate-400" />
                  <span>Columns</span>
                </button>

                {leftColumnsOpen && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    padding: '16px',
                    zIndex: 50,
                    minWidth: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                      Column Visibility
                    </div>
                    
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                      <input
                        type="checkbox"
                        checked={leftVisibleColumns.holdingArea}
                        onChange={() => setLeftVisibleColumns(prev => ({ ...prev, holdingArea: !prev.holdingArea }))}
                        style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', accentColor: '#3b82f6', cursor: 'pointer' }}
                      />
                      <span>Holding Area</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                      <input
                        type="checkbox"
                        checked={leftVisibleColumns.capacity}
                        onChange={() => setLeftVisibleColumns(prev => ({ ...prev, capacity: !prev.capacity }))}
                        style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', accentColor: '#3b82f6', cursor: 'pointer' }}
                      />
                      <span>Capacity</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                      <input
                        type="checkbox"
                        checked={leftVisibleColumns.status}
                        onChange={() => setLeftVisibleColumns(prev => ({ ...prev, status: !prev.status }))}
                        style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', accentColor: '#3b82f6', cursor: 'pointer' }}
                      />
                      <span>Status</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Left Table */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflowX: 'auto', backgroundColor: '#ffffff' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                  <th style={{ padding: '14px 20px', width: '40px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={leftSelectedRows.length === holdingAreas.length && holdingAreas.length > 0}
                      onChange={handleLeftSelectAll}
                      style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                    />
                  </th>
                  {leftVisibleColumns.holdingArea && (
                    <th style={{ padding: '14px 20px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                      Holding Area
                    </th>
                  )}
                  {leftVisibleColumns.capacity && (
                    <th style={{ padding: '14px 20px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                      Capacity
                    </th>
                  )}
                  {leftVisibleColumns.status && (
                    <th style={{ padding: '14px 20px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                      Status
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {holdingAreas.map(row => {
                  const isChecked = leftSelectedRows.includes(row.name);
                  const currentCap = getCapacityCount(row.name);
                  return (
                    <tr
                      key={row.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: isChecked ? '#fffbeb' : 'transparent',
                        transition: 'background-color 0.15s'
                      }}
                    >
                      <td style={{ padding: getCellPadding(leftDensity), textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleLeftRowSelect(row.name)}
                          style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                        />
                      </td>
                      {leftVisibleColumns.holdingArea && (
                        <td style={{ padding: getCellPadding(leftDensity), fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                          {row.name}
                        </td>
                      )}
                      {leftVisibleColumns.capacity && (
                        <td style={{ padding: getCellPadding(leftDensity), fontSize: '14px', fontWeight: '700', color: '#475569' }}>
                          {currentCap} / {row.capacity}
                        </td>
                      )}
                      {leftVisibleColumns.status && (
                        <td style={{ padding: getCellPadding(leftDensity), whiteSpace: 'nowrap' }}>
                          <span style={{
                            fontSize: '9px',
                            fontWeight: '800',
                            color: '#64748b',
                            backgroundColor: '#f1f5f9',
                            border: '1.5px solid #e2e8f0',
                            borderRadius: '9999px',
                            padding: '4px 10px',
                            letterSpacing: '0.05em',
                            display: 'inline-block',
                            whiteSpace: 'nowrap'
                          }}>
                            {row.status}
                          </span>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel: ASSETS IN HOLDING */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #f1f5f9',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          textAlign: 'left'
        }}>
          {/* Header controls for Right Table */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              Assets in Holding
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              {/* Density control */}
              <div className="wh-segmented-control">
                {['COMPACT', 'DEFAULT', 'RELAXED'].map((mode) => {
                  const isActive = rightDensity === mode.toLowerCase();
                  return (
                    <button
                      key={mode}
                      onClick={() => setRightDensity(mode.toLowerCase())}
                      className="segmented-btn"
                      style={{
                        padding: '5px 12px',
                        fontSize: '9px',
                        borderRadius: '6px',
                        backgroundColor: isActive ? '#ffd400' : 'transparent',
                        color: isActive ? '#0f172a' : '#64748b',
                        border: isActive ? '1px solid #000' : '1px solid transparent',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {mode}
                    </button>
                  );
                })}
              </div>

              {/* Column Visibility Selector */}
              <div style={{ position: 'relative' }}>
                <button
                  className="btn btn-white-wh"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    fontSize: '10px',
                    borderRadius: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    border: rightColumnsOpen ? '1.5px solid #000000' : '1px solid #e2e8f0',
                    color: rightColumnsOpen ? '#0f172a' : '#64748b',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                  onClick={() => setRightColumnsOpen(!rightColumnsOpen)}
                >
                  <Settings className="h-3.5 w-3.5 text-slate-400" />
                  <span>Columns</span>
                </button>

                {rightColumnsOpen && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    padding: '16px',
                    zIndex: 50,
                    minWidth: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                      Column Visibility
                    </div>
                    
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                      <input
                        type="checkbox"
                        checked={rightVisibleColumns.assetCode}
                        onChange={() => setRightVisibleColumns(prev => ({ ...prev, assetCode: !prev.assetCode }))}
                        style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', accentColor: '#3b82f6', cursor: 'pointer' }}
                      />
                      <span>Asset Code</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                      <input
                        type="checkbox"
                        checked={rightVisibleColumns.holdingArea}
                        onChange={() => setRightVisibleColumns(prev => ({ ...prev, holdingArea: !prev.holdingArea }))}
                        style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', accentColor: '#3b82f6', cursor: 'pointer' }}
                      />
                      <span>Holding Area</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                      <input
                        type="checkbox"
                        checked={rightVisibleColumns.actions}
                        onChange={() => setRightVisibleColumns(prev => ({ ...prev, actions: !prev.actions }))}
                        style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', accentColor: '#3b82f6', cursor: 'pointer' }}
                      />
                      <span>Actions</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Table */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflowX: 'auto', backgroundColor: '#ffffff', minHeight: '142px', display: 'flex', flexDirection: 'column' }}>
            {assets.length === 0 ? (
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                fontSize: '12px',
                fontWeight: '800',
                color: '#64748b',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}>
                NO RECORDS RESOLVED.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                    <th style={{ padding: '14px 20px', width: '40px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={rightSelectedRows.length === assets.length && assets.length > 0}
                        onChange={handleRightSelectAll}
                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                      />
                    </th>
                    {rightVisibleColumns.assetCode && (
                      <th style={{ padding: '14px 20px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                        Asset Code
                      </th>
                    )}
                    {rightVisibleColumns.holdingArea && (
                      <th style={{ padding: '14px 20px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                        Holding Area
                      </th>
                    )}
                    {rightVisibleColumns.actions && (
                      <th style={{ padding: '14px 20px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {assets.map(row => {
                    const isChecked = rightSelectedRows.includes(row.id);
                    // Split the holding area name for stacked display (e.g. "Holding Area\nB")
                    const nameParts = row.holdingArea.split(' Area ');
                    const stackedName = nameParts.length === 2 ? (
                      <div style={{ color: '#b45309', fontWeight: '700', lineHeight: '1.2' }}>
                        <div>Holding Area</div>
                        <div style={{ fontSize: '11px', marginTop: '2px' }}>{nameParts[1]}</div>
                      </div>
                    ) : (
                      <div style={{ color: '#b45309', fontWeight: '700' }}>{row.holdingArea}</div>
                    );

                    return (
                      <tr
                        key={row.id}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          backgroundColor: isChecked ? '#fffbeb' : 'transparent',
                          transition: 'background-color 0.15s'
                        }}
                      >
                        <td style={{ padding: getCellPadding(rightDensity), textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleRightRowSelect(row.id)}
                            style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                          />
                        </td>
                        {rightVisibleColumns.assetCode && (
                          <td style={{ padding: getCellPadding(rightDensity), fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>
                            {row.code}
                          </td>
                        )}
                        {rightVisibleColumns.holdingArea && (
                          <td style={{ padding: getCellPadding(rightDensity) }}>
                            {stackedName}
                          </td>
                        )}
                        {rightVisibleColumns.actions && (
                          <td style={{ padding: getCellPadding(rightDensity) }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => handleMoveClick(row.id)}
                                style={{
                                  backgroundColor: '#ffffff',
                                  border: '1px solid #cbd5e1',
                                  borderRadius: '10px',
                                  padding: '6px 14px',
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  color: '#3b82f6',
                                  cursor: 'pointer',
                                  boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                                }}
                              >
                                Move Item
                              </button>
                              <button
                                onClick={() => handleRemoveAsset(row.id)}
                                style={{
                                  backgroundColor: '#ffffff',
                                  border: '1px solid #fde68a',
                                  borderRadius: '10px',
                                  padding: '6px 14px',
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  color: '#b45309',
                                  cursor: 'pointer',
                                  boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                                  outline: 'none',
                                  transition: 'all 0.15s'
                                }}
                                onFocus={(e) => {
                                  e.target.style.outline = '2px solid #000';
                                }}
                                onBlur={(e) => {
                                  e.target.style.outline = 'none';
                                }}
                              >
                                Remove Item
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

      {/* Modal: Add Holding Area Zone */}
      {addAreaModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }} onClick={() => setAddAreaModalOpen(false)}>
          <form
            onSubmit={handleCreateHoldingArea}
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
                onClick={() => setAddAreaModalOpen(false)}
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
                value={newAreaName}
                onChange={e => setNewAreaName(e.target.value)}
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

      {/* Modal: Relocate Asset Location */}
      {moveAssetModalOpen && (
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
        }} onClick={() => setMoveAssetModalOpen(false)}>
          <form
            onSubmit={handleConfirmMove}
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
                onClick={() => setMoveAssetModalOpen(false)}
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
                  value={targetHoldingArea}
                  onChange={e => setTargetHoldingArea(e.target.value)}
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
                  {holdingAreas.map(h => (
                    <option key={h.id} value={h.name}>{h.name}</option>
                  ))}
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

      {/* Floating Toast Notification */}
      {toast.open && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#e6fbf2',
          border: '1.5px solid #a7f3d0',
          borderRadius: '16px',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          zIndex: 10000,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            <circle cx="10" cy="10" r="9" stroke="#10b981" strokeWidth="2" />
            <path d="M6 10L9 13L14 7" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>
            {toast.message}
          </span>
          <button
            onClick={() => setToast({ open: false, message: '' })}
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
      )}

    </div>
  );
};

export default WarehouseHoldingAreas;
