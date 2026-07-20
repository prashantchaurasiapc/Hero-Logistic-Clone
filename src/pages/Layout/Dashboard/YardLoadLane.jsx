import React, { useState, useRef } from 'react';
import './WarehouseDashboard.css';
import './YardDashboard.css';

// SVG Icons
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const UploadIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

export default function YardLoadLane() {
  const [trailerId, setTrailerId] = useState('');
  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState('success'); // success or error
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Table & grid control state
  const [density, setDensity] = useState('RELAXED');
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const [columns, setColumns] = useState({
    desc: false,
    status: true
  });

  // Yard Map Modal State
  const [showYardMapModal, setShowYardMapModal] = useState(false);

  // Button Hover States
  const [hoverBtn, setHoverBtn] = useState(null);

  // Mock table data
  const [tasks, setTasks] = useState([
    { id: 1, desc: 'Assign TR-9410 to loading lane 3', status: 'PENDING', checked: false },
    { id: 2, desc: 'Spot container CTR-0029 at gate 12', status: 'IN PROGRESS', checked: false },
    { id: 3, desc: 'Verify release code for TR-1102', status: 'PENDING', checked: false }
  ]);

  const toggleTaskCheckbox = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
  };

  const selectedCount = tasks.filter(t => t.checked).length;

  const triggerToast = (msg, type = 'success') => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(null), 5000);
  };

  const handleMoveToLocation = () => {
    if (!trailerId.trim()) {
      triggerToast('Specify Trailer ID first.', 'error');
      return;
    }
    triggerToast(`Trailer ${trailerId} assigned to new location.`, 'success');
  };

  const handleMoveToLoadLane = () => {
    if (!trailerId.trim()) {
      triggerToast('Specify Trailer ID first.', 'error');
      return;
    }
    triggerToast(`Trailer ${trailerId} moved to load lane successfully.`, 'success');
  };

  const handleAddNote = () => {
    if (!trailerId.trim()) {
      triggerToast('Trailer ID is required to add note.', 'error');
      return;
    }
    const note = prompt('Enter note for Trailer ' + trailerId + ':');
    if (note) {
      triggerToast(`Note added to ${trailerId}: "${note}"`, 'success');
    }
  };

  const handleConfirmLoaded = (e) => {
    e.preventDefault();
    if (!trailerId.trim()) {
      triggerToast('Specify Trailer ID first.', 'error');
      return;
    }
    triggerToast(`Status confirmed: Trailer ${trailerId} LOADED.`, 'success');
    // Update task list if match found
    setTasks(prev => prev.map(t => t.desc.includes(trailerId) ? { ...t, status: 'Completed' } : t));
  };

  const handleConfirmUnloaded = (e) => {
    e.preventDefault();
    if (!trailerId.trim()) {
      triggerToast('Specify Trailer ID first.', 'error');
      return;
    }
    triggerToast(`Status confirmed: Trailer ${trailerId} UNLOADED.`, 'success');
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      triggerToast(`Photo proof uploaded: ${e.target.files[0].name}`, 'success');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      triggerToast(`Photo proof uploaded: ${e.dataTransfer.files[0].name}`, 'success');
    }
  };

  const handleCsvExport = () => {
    const selectedItems = tasks.filter(t => t.checked);
    if (selectedItems.length === 0) return;

    const headers = ['Task ID', 'Task Description', 'Status'];
    const rows = selectedItems.map(t => [t.id, t.desc, t.status]);
    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `yard_tasks_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast(`Exported tasks manifest CSV successfully.`, 'success');
  };

  // Row padding based on density
  const getRowPadding = () => {
    if (density === 'COMPACT') return '8px 12px';
    if (density === 'DEFAULT') return '12px 16px';
    return '20px 24px';
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
    { id: 'B4', type: 'Available', val: 'Free', bg: '#FFFFFF', border: '#E2E8F0', color: '#64748b' }
  ];

  return (
    <div className="customer-dashboard yard-scan-in-wrapper">

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8" style={{ flexShrink: 0, padding: '16px 20px', gap: 16 }}>
        <div>
          <h1 className="text-2xl text-slate-900 leading-8 capitalize font-black flex items-center gap-2">
            Yard Attendant <span className="text-slate-400 text-xl mx-1">•</span> Load Lane
          </h1>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">
            Perform gate checks, inspect trailers, and log spotted containers.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="yard-main-content">

        {/* Full width container box */}
        <div className="yard-container-box">

          {/* Load Lane & Spotting Assignment Card Header Section */}
          <div className="yard-manifest-header" style={{ marginBottom: 24 }}>
            <div style={{ textAlign: 'left' }}>
              <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Load Lane &amp; Spotting Assignment</h2>
              <p style={{ fontSize: '12px', marginTop: '4px', color: '#64748b', margin: '4px 0 0 0' }}>
                Spot container trailers to load lanes, upload photo proof, and confirm loading operations.
              </p>
            </div>

            {/* Top Right Header Buttons */}
            <div className="yard-controls-grid">
              <button onClick={handleMoveToLocation} className="yard-btn-secondary" style={{ padding: '10px 18px' }}>
                Move to Location
              </button>
              <button onClick={handleMoveToLoadLane} className="yard-btn-primary" style={{ flex: 'none', padding: '10px 18px' }}>
                Move to Load Lane
              </button>
              <button onClick={handleAddNote} className="yard-btn-secondary" style={{ padding: '10px 18px' }}>
                Add Note
              </button>
              <button onClick={() => setShowYardMapModal(true)} className="yard-btn-secondary" style={{ padding: '10px 18px' }}>
                🚧 View Yard Map
              </button>
            </div>
          </div>

          <div className="yard-grid">

            {/* Left Column: Form Verify Load Status */}
            <div className="yard-card">
              <h2 style={{ fontSize: 14.5, fontWeight: '800', color: '#0f172a', margin: '0 0 16px 0' }}>Verify Load Status</h2>

              <div className="yard-form-group">
                <label className="yard-form-label">
                  TRAILER CONTAINER ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. TR-9410"
                  value={trailerId}
                  onChange={(e) => setTrailerId(e.target.value)}
                  className="yard-form-input"
                />
              </div>

              <div className="yard-form-group" style={{ marginBottom: 20 }}>
                <label className="yard-form-label">
                  UPLOAD SPOT PHOTO PROOF
                </label>
                <div
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  style={{
                    border: '1.5px dashed #cbd5e1',
                    borderRadius: 12,
                    backgroundColor: '#f8fafc',
                    padding: '24px 16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10
                  }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    style={{ display: 'none' }}
                  />
                  <div style={{
                    width: 46,
                    height: 46,
                    borderRadius: '50%',
                    backgroundColor: '#fffbeb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <UploadIcon />
                  </div>
                  {selectedFile ? (
                    <div>
                      <p style={{ fontSize: 13, fontWeight: '700', color: '#16a34a', margin: 0 }}>File Selected!</p>
                      <p style={{ fontSize: 11, color: '#64748b', margin: '2px 0 0 0' }}>{selectedFile.name}</p>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize: 13, fontWeight: '700', color: '#0f172a', margin: 0 }}>Drag & drop file or click to select</p>
                      <p style={{ fontSize: 10.5, color: '#64748b', margin: '4px 0 0 0' }}>Supports .PDF, .JPG, .JPEG, .PNG (Max 10MB)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Confirm buttons */}
              <div className="yard-buttons-row">
                <button onClick={handleConfirmLoaded} className="yard-btn-primary" style={{ flex: 1.5 }}>
                  Confirm Loaded
                </button>
                <button onClick={handleConfirmUnloaded} className="yard-btn-secondary" style={{ flex: 1 }}>
                  Confirm Unloaded
                </button>
              </div>
            </div>
{/* Right Column: Yard Attendant Tasks List */}
            <div className="yard-card" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>

              <div className="yard-manifest-header">
                <h2 style={{ fontSize: 14.5, fontWeight: '800', color: '#0f172a', margin: 0 }}>Yard Attendant Tasks List</h2>

                {/* Grid Density & Columns Control */}
                <div className="yard-controls-row" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>

                  {/* Density tabs styled container */}
                  <div style={{
                    display: 'flex',
                    backgroundColor: '#f1f5f9',
                    borderRadius: 8,
                    padding: 3,
                    border: '1px solid #e2e8f0'
                  }}>
                    {['COMPACT', 'DEFAULT', 'RELAXED'].map((d) => (
                      <button
                        key={d}
                        onClick={() => setDensity(d)}
                        style={{
                          padding: '6px 12px',
                          fontSize: 10,
                          fontWeight: '800',
                          border: 'none',
                          borderRadius: 6,
                          cursor: 'pointer',
                          backgroundColor: density === d ? '#ffcc00' : 'transparent',
                          color: density === d ? '#000000' : '#64748b',
                          outline: 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {d}
                      </button>
                    ))}
                  </div>

                  {/* Selected CSV Action Box next to COLUMNS button */}
                  {selectedCount > 0 && (
                    <div
                      onClick={handleCsvExport}
                      style={{
                        backgroundColor: '#fffdf5',
                        border: '1.5px solid #fde047',
                        borderRadius: 10,
                        padding: '8px 12px',
                        fontSize: 11,
                        fontWeight: '800',
                        color: '#b45309',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        cursor: 'pointer',
                        outline: 'none',
                        whiteSpace: 'nowrap',
                        boxSizing: 'border-box'
                      }}
                    >
                      <span style={{ fontSize: 10, fontWeight: '800', color: '#b45309', letterSpacing: '0.5px' }}>
                        {selectedCount} SELECTED
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#b45309' }}>
                        <DownloadIcon /> CSV Export
                      </span>
                    </div>
                  )}

                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1.5px solid #0f172a',
                        borderRadius: 10,
                        padding: '8px 14px',
                        fontSize: 11,
                        fontWeight: '800',
                        color: '#334155',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                    >
                      <SettingsIcon /> COLUMNS
                    </button>

                    {showColumnDropdown && (
                      <div className="yard-dropdown-menu">
                        <span style={{ fontSize: 10.5, fontWeight: '800', color: '#64748b', display: 'block', marginBottom: 8, letterSpacing: '0.5px' }}>
                          COLUMN VISIBILITY
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: '600', color: '#334155', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={columns.desc}
                              onChange={() => setColumns(prev => ({ ...prev, desc: !prev.desc }))}
                              style={{ width: 14, height: 14, cursor: 'pointer' }}
                            />
                            Task Description
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: '600', color: '#334155', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={columns.status}
                              onChange={() => setColumns(prev => ({ ...prev, status: !prev.status }))}
                              style={{ width: 14, height: 14, cursor: 'pointer' }}
                            />
                            Status
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Table Container */}
              <div style={{
                border: '1px solid #e2e8f0',
                borderRadius: 14,
                overflowX: 'auto',
                backgroundColor: '#ffffff'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '12px 16px', width: 40 }}>
                        <input
                          type="checkbox"
                          checked={selectedCount === tasks.length}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setTasks(prev => prev.map(t => ({ ...t, checked: val })));
                          }}
                          style={{ width: 15, height: 15, cursor: 'pointer' }}
                        />
                      </th>
                      {columns.desc && <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: '800', color: '#64748b' }}>TASK DESCRIPTION</th>}
                      {columns.status && <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: '800', color: '#64748b' }}>STATUS</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr
                        key={task.id}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          backgroundColor: task.checked ? '#fffdf5' : '#ffffff',
                          transition: 'background-color 0.15s ease'
                        }}
                      >
                        <td style={{ padding: getRowPadding(), width: 40 }}>
                          <input
                            type="checkbox"
                            checked={task.checked}
                            onChange={() => toggleTaskCheckbox(task.id)}
                            style={{ width: 15, height: 15, cursor: 'pointer' }}
                          />
                        </td>
                        {columns.desc && (
                          <td style={{ padding: getRowPadding(), fontSize: 13, fontWeight: '600', color: '#334155' }}>
                            {task.desc}
                          </td>
                        )}
                        {columns.status && (
                          <td style={{ padding: getRowPadding() }}>
                            <span style={{
                              fontSize: 10.5,
                              fontWeight: '800',
                              padding: '4px 10px',
                              borderRadius: 20,
                              backgroundColor: task.status === 'PENDING' ? '#fffbeb' : task.status === 'IN PROGRESS' ? '#f1f5f9' : '#f0fdf4',
                              color: task.status === 'PENDING' ? '#d97706' : task.status === 'IN PROGRESS' ? '#475569' : '#166534'
                            }}>
                              {task.status}
                            </span>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
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
            width: 'calc(100% - 32px)',
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: 12 }}>
                {yardSlots.map((slot) => (
                  <div
                    key={slot.id}
                    onClick={() => {
                      setTrailerId(slot.val !== 'Free' ? slot.val : '');
                      setShowYardMapModal(false);
                      triggerToast(`Selected bay ${slot.id} (${slot.val})`, 'success');
                    }}
                    style={{
                      backgroundColor: slot.bg,
                      border: `1px solid ${slot.border}`,
                      borderRadius: 10,
                      padding: '14px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: 11.5, fontWeight: '800', color: slot.color }}>{slot.id}</span>
                    <span style={{ fontSize: 9.5, fontWeight: '600', color: slot.color, marginTop: 4 }}>{slot.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exclamation or Success Toast Alert */}
      {toast && (
        <div className="yard-toast-popup settings-toast" style={{
          backgroundColor: toastType === 'error' ? '#fef2f2' : '#eff6ff',
          border: toastType === 'error' ? '1px solid #fecaca' : '1px solid #bfdbfe'
        }}>
          {toastType === 'error' ? (
            <div style={{
              backgroundColor: '#ef4444',
              color: '#ffffff',
              width: 22,
              height: 22,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: '800'
            }}>!</div>
          ) : (
            <div style={{
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              width: 22,
              height: 22,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12
            }}>✓</div>
          )}
          <span style={{ fontSize: 13, fontWeight: '600', color: toastType === 'error' ? '#991b1b' : '#1e40af', flex: 1 }}>
            {toast}
          </span>
          <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', fontSize: 16, color: toastType === 'error' ? '#ef4444' : '#64748b', cursor: 'pointer', marginLeft: 8 }}>✕</button>
        </div>
      )}

    </div>
  );
}
