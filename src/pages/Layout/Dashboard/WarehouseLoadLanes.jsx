import React, { useState } from 'react';
import { Settings, Plus, X, ArrowRight, Check, Download } from 'lucide-react';
import './WarehouseDashboard.css';

const WarehouseLoadLanes = () => {
  // Density states ('compact' | 'default' | 'relaxed')
  const [leftDensity, setLeftDensity] = useState('default');
  const [rightDensity, setRightDensity] = useState('default');

  // Column visibility states
  const [leftVisibleColumns, setLeftVisibleColumns] = useState({
    loadLane: true,
    assignedAssets: true,
    laneStatus: true
  });
  const [rightVisibleColumns, setRightVisibleColumns] = useState({
    assetCode: true,
    assignedLane: false,
    status: false,
    actions: true
  });

  // Dropdown menu states
  const [leftColumnsOpen, setLeftColumnsOpen] = useState(false);
  const [rightColumnsOpen, setRightColumnsOpen] = useState(false);

  // Selection states
  const [leftSelectedRows, setLeftSelectedRows] = useState([]);
  const [rightSelectedRows, setRightSelectedRows] = useState([]);

  // Modals state
  const [addLaneModalOpen, setAddLaneModalOpen] = useState(false);
  const [assignAssetModalOpen, setAssignAssetModalOpen] = useState(false);
  const [newLaneName, setNewLaneName] = useState('');
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [targetLane, setTargetLane] = useState('Lane A1');

  // Toast notification state
  const [toast, setToast] = useState({ open: false, message: '' });

  // Data states
  const [loadLanes, setLoadLanes] = useState([
    { id: 'LL-1', name: 'Lane A1', status: 'LOADING' },
    { id: 'LL-2', name: 'Lane A2', status: 'LOADING' },
    { id: 'LL-3', name: 'Lane C3', status: 'LOADING' }
  ]);

  const [queueingAssets, setQueueingAssets] = useState([
    { id: 'QA-1', code: 'VIN-7YV1HP82A81920', lane: 'Lane A1', status: 'QUEUEING' },
    { id: 'QA-2', code: 'VIN-3YV1HP52X81254', lane: 'Lane A2', status: 'QUEUEING' },
    { id: 'QA-3', code: 'VIN-8ZV9HK21W92110', lane: 'Lane C3', status: 'QUEUEING' }
  ]);

  // Helpers to get density padding
  const getCellPadding = (density) => {
    if (density === 'compact') return '10px 16px';
    if (density === 'default') return '14px 20px';
    return '20px 24px'; // relaxed
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
    if (leftSelectedRows.length === loadLanes.length) {
      setLeftSelectedRows([]);
    } else {
      setLeftSelectedRows(loadLanes.map(l => l.name));
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
    if (rightSelectedRows.length === queueingAssets.length) {
      setRightSelectedRows([]);
    } else {
      setRightSelectedRows(queueingAssets.map(a => a.id));
    }
  };

  // Action: Add Load Lane Spot
  const handleCreateLoadLane = (e) => {
    e.preventDefault();
    if (!newLaneName.trim()) return;

    const nameExists = loadLanes.some(
      l => l.name.toLowerCase() === newLaneName.trim().toLowerCase()
    );

    if (nameExists) {
      alert('A load lane with this name already exists.');
      return;
    }

    const newLane = {
      id: `LL-${Date.now()}`,
      name: newLaneName.trim(),
      status: 'LOADING'
    };

    setLoadLanes([...loadLanes, newLane]);
    setNewLaneName('');
    setAddLaneModalOpen(false);
    showToast(`Load lane "${newLane.name}" created successfully.`);
  };

  // Action: Assign Asset to Lane
  const handleAssignClick = (assetId) => {
    setSelectedAssetId(assetId);
    const currentAsset = queueingAssets.find(a => a.id === assetId);
    if (currentAsset && currentAsset.lane) {
      setTargetLane(currentAsset.lane);
    } else {
      setTargetLane(loadLanes[0]?.name || '');
    }
    setAssignAssetModalOpen(true);
  };

  const handleConfirmAssign = (e) => {
    e.preventDefault();
    const asset = queueingAssets.find(a => a.id === selectedAssetId);
    setQueueingAssets(queueingAssets.map(a => {
      if (a.id === selectedAssetId) {
        return { ...a, lane: targetLane };
      }
      return a;
    }));
    setAssignAssetModalOpen(false);
    showToast(`Asset ${asset?.code} assigned to ${targetLane}.`);
  };

  // Action: Remove Asset from Lane
  const handleRemoveFromLane = (assetId) => {
    const asset = queueingAssets.find(a => a.id === assetId);
    setQueueingAssets(queueingAssets.map(a => {
      if (a.id === assetId) {
        return { ...a, lane: '' };
      }
      return a;
    }));
    showToast(`Asset ${asset?.code} removed from load lane.`);
  };

  // Calculate dynamic asset unit count per lane
  const getAssignedAssetCount = (laneName) => {
    return queueingAssets.filter(a => a.lane === laneName).length;
  };

  // CSV Export Left selected lanes
  const handleExportSelectedLanes = () => {
    const selected = loadLanes.filter(l => leftSelectedRows.includes(l.name));
    const headers = ['Load Lane', 'Assigned Assets', 'Lane Status'];
    const rows = selected.map(l => [
      l.name,
      `${getAssignedAssetCount(l.name)} Units`,
      l.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "selected_load_lanes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="warehouse-dashboard" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header section matches WarehouseMap perfectly */}
      <div className="warehouse-header" style={{ marginBottom: '16px' }}>
        <div className="warehouse-header-titles" style={{ textAlign: 'left' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Load Lanes</h1>
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
          <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>Load Lane Management</h2>
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Manage outbound dispatch loading queues and lane spotting.</p>
        </div>
        <button
          onClick={() => setAddLaneModalOpen(true)}
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
          <span>Add Load Lane</span>
        </button>
      </div>

      {/* 2-Panel Layout Grid */}
      <div className="responsive-two-panel-grid">
        
        {/* Left Panel: ACTIVE LOAD LANES */}
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', minHeight: '38px' }}>
            {leftSelectedRows.length > 0 ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: '#fef3c7',
                border: '1px solid #fde68a',
                borderRadius: '12px',
                padding: '6px 14px'
              }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {leftSelectedRows.length} SELECTED
                </span>
                <button 
                  onClick={handleExportSelectedLanes}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #fde68a',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#b45309',
                    cursor: 'pointer'
                  }}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV Export</span>
                </button>
              </div>
            ) : (
              <h2 style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                Active Load Lanes
              </h2>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginLeft: 'auto' }}>
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
                        border: isActive ? '1px solid #000' : '1px solid transparent'
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
                    cursor: 'pointer'
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
                        checked={leftVisibleColumns.loadLane}
                        onChange={() => setLeftVisibleColumns(prev => ({ ...prev, loadLane: !prev.loadLane }))}
                        style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', accentColor: '#3b82f6', cursor: 'pointer' }}
                      />
                      <span>Load Lane</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                      <input
                        type="checkbox"
                        checked={leftVisibleColumns.assignedAssets}
                        onChange={() => setLeftVisibleColumns(prev => ({ ...prev, assignedAssets: !prev.assignedAssets }))}
                        style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', accentColor: '#3b82f6', cursor: 'pointer' }}
                      />
                      <span>Assigned Assets</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                      <input
                        type="checkbox"
                        checked={leftVisibleColumns.laneStatus}
                        onChange={() => setLeftVisibleColumns(prev => ({ ...prev, laneStatus: !prev.laneStatus }))}
                        style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', accentColor: '#3b82f6', cursor: 'pointer' }}
                      />
                      <span>Lane Status</span>
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
                      checked={leftSelectedRows.length === loadLanes.length && loadLanes.length > 0}
                      onChange={handleLeftSelectAll}
                      style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                    />
                  </th>
                  {leftVisibleColumns.loadLane && (
                    <th style={{ padding: '14px 20px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Load Lane
                    </th>
                  )}
                  {leftVisibleColumns.assignedAssets && (
                    <th style={{ padding: '14px 20px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Assigned Assets
                    </th>
                  )}
                  {leftVisibleColumns.laneStatus && (
                    <th style={{ padding: '14px 20px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Lane Status
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {loadLanes.map(row => {
                  const isChecked = leftSelectedRows.includes(row.name);
                  const assignedCount = getAssignedAssetCount(row.name);
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
                        {isChecked ? (
                          <div
                            onClick={() => handleLeftRowSelect(row.name)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '20px',
                              height: '20px',
                              borderRadius: '6px',
                              backgroundColor: '#ffd400',
                              border: '1.5px solid #000',
                              cursor: 'pointer'
                            }}
                          >
                            <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />
                          </div>
                        ) : (
                          <input
                            type="checkbox"
                            checked={false}
                            onChange={() => handleLeftRowSelect(row.name)}
                            style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                          />
                        )}
                      </td>
                      {leftVisibleColumns.loadLane && (
                        <td style={{ padding: getCellPadding(leftDensity), fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                          {row.name}
                        </td>
                      )}
                      {leftVisibleColumns.assignedAssets && (
                        <td style={{ padding: getCellPadding(leftDensity), fontSize: '14px', fontWeight: '700', color: '#b45309' }}>
                          {assignedCount} Units
                        </td>
                      )}
                      {leftVisibleColumns.laneStatus && (
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

        {/* Right Panel: QUEUEING ASSETS */}
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', minHeight: '38px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              Queueing Assets
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
                        border: isActive ? '1px solid #000' : '1px solid transparent'
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
                    cursor: 'pointer'
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
                        checked={rightVisibleColumns.assignedLane}
                        onChange={() => setRightVisibleColumns(prev => ({ ...prev, assignedLane: !prev.assignedLane }))}
                        style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', accentColor: '#3b82f6', cursor: 'pointer' }}
                      />
                      <span>Assigned Lane</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                      <input
                        type="checkbox"
                        checked={rightVisibleColumns.status}
                        onChange={() => setRightVisibleColumns(prev => ({ ...prev, status: !prev.status }))}
                        style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', accentColor: '#3b82f6', cursor: 'pointer' }}
                      />
                      <span>Status</span>
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
            {queueingAssets.length === 0 ? (
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
                        checked={rightSelectedRows.length === queueingAssets.length && queueingAssets.length > 0}
                        onChange={handleRightSelectAll}
                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                      />
                    </th>
                    {rightVisibleColumns.assetCode && (
                      <th style={{ padding: '14px 20px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Asset Code
                      </th>
                    )}
                    {rightVisibleColumns.assignedLane && (
                      <th style={{ padding: '14px 20px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Assigned Lane
                      </th>
                    )}
                    {rightVisibleColumns.status && (
                      <th style={{ padding: '14px 20px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Status
                      </th>
                    )}
                    {rightVisibleColumns.actions && (
                      <th style={{ padding: '14px 20px', fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {queueingAssets.map(row => {
                    const isChecked = rightSelectedRows.includes(row.id);
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
                          <td style={{ padding: getCellPadding(rightDensity), fontSize: '13px', fontWeight: '800', color: '#0f172a', fontFamily: 'monospace' }}>
                            {row.code}
                          </td>
                        )}
                        {rightVisibleColumns.assignedLane && (
                          <td style={{ padding: getCellPadding(rightDensity), fontSize: '13px', fontWeight: '700', color: '#475569' }}>
                            {row.lane || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Unassigned</span>}
                          </td>
                        )}
                        {rightVisibleColumns.status && (
                          <td style={{ padding: getCellPadding(rightDensity), whiteSpace: 'nowrap' }}>
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
                        {rightVisibleColumns.actions && (
                          <td style={{ padding: getCellPadding(rightDensity) }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => handleAssignClick(row.id)}
                                style={{
                                  backgroundColor: '#ffffff',
                                  border: '1px solid #cbd5e1',
                                  borderRadius: '10px',
                                  padding: '6px 14px',
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  color: '#0f172a',
                                  cursor: 'pointer',
                                  boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                                }}
                              >
                                Assign to Load Lane
                              </button>
                              <button
                                onClick={() => handleRemoveFromLane(row.id)}
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
                                Remove from Load Lane
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

      {/* Modal: Add Load Lane Spot */}
      {addLaneModalOpen && (
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
        }} onClick={() => setAddLaneModalOpen(false)}>
          <form
            onSubmit={handleCreateLoadLane}
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
                onClick={() => setAddLaneModalOpen(false)}
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

      {/* Modal: Relocate Asset Lane (Assign Asset to Load Lane) */}
      {assignAssetModalOpen && (
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
        }} onClick={() => setAssignAssetModalOpen(false)}>
          <form
            onSubmit={handleConfirmAssign}
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
                onClick={() => setAssignAssetModalOpen(false)}
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
                  value={targetLane}
                  onChange={e => setTargetLane(e.target.value)}
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
                  {loadLanes.map(l => (
                    <option key={l.id} value={l.name}>{l.name}</option>
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

export default WarehouseLoadLanes;
