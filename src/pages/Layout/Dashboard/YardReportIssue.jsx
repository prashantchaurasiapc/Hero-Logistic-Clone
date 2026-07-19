import React, { useState } from 'react';
import './WarehouseDashboard.css';
import './YardDashboard.css';

// SVG Icons
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const UploadIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const AlertCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

export default function YardReportIssue() {
  const [issueCategory, setIssueCategory] = useState('Container Damage Report');
  const [trailerId, setTrailerId] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('Medium (Requires repair)');

  // Checklist State
  const [checklist, setChecklist] = useState({
    doors: false,
    tyres: false,
    lights: false,
    seals: false,
    brakes: false
  });

  // Active Safety Issues State
  const [issues, setIssues] = useState([
    {
      id: 1,
      category: 'Damage',
      trailerId: 'TR-7712',
      description: 'Rear container door seal torn. Water leak risk.',
      loggedDate: '06/19/2026',
      severity: 'High'
    },
    {
      id: 2,
      category: 'Missing Item',
      trailerId: 'TR-1102',
      description: 'Load securing chains missing from rear locker box.',
      loggedDate: '06/18/2026',
      severity: 'Low'
    }
  ]);

  // UI State
  const [validationAlert, setValidationAlert] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null); // For details modal
  const [hoverBtn, setHoverBtn] = useState(null);

  const handleChecklistChange = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFormSubmit = (e) => {
    if (e) e.preventDefault();

    if (!trailerId.trim() || !description.trim()) {
      setValidationAlert(true);
      setTimeout(() => setValidationAlert(false), 6000);
      return;
    }

    const shortCategory = issueCategory.includes('Damage') ? 'Damage' : 'Missing Item';
    const shortSeverity = severity.split(' ')[0]; // High, Medium, Low

    const newIssue = {
      id: Date.now(),
      category: shortCategory,
      trailerId: trailerId.trim(),
      description: description.trim(),
      loggedDate: new Date().toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      }),
      severity: shortSeverity
    };

    setIssues([newIssue, ...issues]);
    setTrailerId('');
    setDescription('');
    setIssueCategory('Container Damage Report');
    setSeverity('Medium (Requires repair)');
    setChecklist({
      doors: false,
      tyres: false,
      lights: false,
      seals: false,
      brakes: false
    });

    setToastMessage('Inspection report logged successfully.');
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleReportMissingItem = () => {
    setIssueCategory('Missing Security tools / chains');
    setToastMessage('Category switched to Missing Security tools.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleResolveReport = (issueId) => {
    setIssues(prev => prev.filter(item => item.id !== issueId));
    setSelectedIssue(null);
    setToastMessage('Safety issue resolved and archived.');
    setTimeout(() => setToastMessage(''), 4000);
  };

  return (
    <div className="customer-dashboard yard-scan-in-wrapper">

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8" style={{ flexShrink: 0, padding: '16px 20px', gap: 16 }}>
        <div>
          <h1 className="text-2xl text-slate-900 leading-8 capitalize font-black flex items-center gap-2">
            Yard Attendant <span className="text-slate-400 text-xl mx-1">•</span> Report Issue
          </h1>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">
            Perform safety checks, log damages, and track active yard issue reports.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="yard-main-content">

        {/* Full width container box */}
        <div className="yard-container-box">

          <div className="yard-grid" style={{ alignItems: 'start' }}>

            {/* Left Card: Form */}
            <div className="yard-card">
              <h2 style={{ fontSize: 14.5, fontWeight: '800', color: '#0f172a', margin: '0 0 20px 0' }}>Log Safety Inspection Report</h2>

              <form onSubmit={handleFormSubmit}>

                {/* Issue Category */}
                <div className="yard-form-group">
                  <label className="yard-form-label">
                    REPORT ISSUE CATEGORY
                  </label>
                  <select
                    value={issueCategory}
                    onChange={(e) => setIssueCategory(e.target.value)}
                    className="yard-form-input"
                    style={{ border: '1.5px solid #ffcc00', fontWeight: '600' }}
                  >
                    <option value="Container Damage Report">Container Damage Report</option>
                    <option value="Missing Security tools / chains">Missing Security tools / chains</option>
                  </select>
                </div>

                {/* Trailer / Container ID */}
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

                {/* Report Details Description */}
                <div className="yard-form-group">
                  <label className="yard-form-label">
                    REPORT DETAILS DESCRIPTION
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Door latch seal ripped"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="yard-form-input"
                  />
                </div>

                {/* Issue Severity */}
                <div className="yard-form-group">
                  <label className="yard-form-label">
                    ISSUE SEVERITY
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="yard-form-input"
                    style={{ fontWeight: '600' }}
                  >
                    <option value="High (Immediate Ground)">High (Immediate Ground)</option>
                    <option value="Medium (Requires repair)">Medium (Requires repair)</option>
                    <option value="Low (Warning log)">Low (Warning log)</option>
                  </select>
                </div>

                {/* Inspection Checklist */}
                <div className="yard-form-group" style={{ marginBottom: 20 }}>
                  <label className="yard-form-label" style={{ marginBottom: 8 }}>
                    INSPECTION CHECKLIST
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {Object.keys(checklist).map((key) => (
                      <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, fontWeight: '600', color: '#334155', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={checklist[key]}
                          onChange={() => handleChecklistChange(key)}
                          style={{ width: 15, height: 15, cursor: 'pointer' }}
                        />
                        {key.charAt(0).toUpperCase() + key.slice(1)} Checked
                      </label>
                    ))}
                  </div>
                </div>

                {/* File Upload zone */}
                <div className="yard-form-group" style={{ marginBottom: 24 }}>
                  <label className="yard-form-label">
                    UPLOAD INSPECTIONS PHOTO EVIDENCE
                  </label>
                  <div style={{
                    border: '1.5px dashed #ffcc00',
                    borderRadius: 14,
                    padding: '24px 16px',
                    backgroundColor: '#fffdf5',
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8
                  }}>
                    <UploadIcon />
                    <span style={{ fontSize: 13, fontWeight: '700', color: '#0f172a' }}>Drag &amp; drop file or click to select</span>
                    <span style={{ fontSize: 10.5, color: '#64748b' }}>Supports .PDF, .JPG, .JPEG, .PNG (Max 10MB)</span>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="yard-buttons-row">
                  <button
                    type="button"
                    onClick={handleReportMissingItem}
                    className="yard-btn-secondary"
                    style={{ border: '2px solid #0f172a', color: '#0f172a' }}
                  >
                    Report Missing Item
                  </button>

                  <button
                    type="submit"
                    className="yard-btn-primary"
                  >
                    Submit Inspection
                  </button>
                </div>

              </form>
            </div>

            {/* Right Card: Active Issues */}
            <div className="yard-card">
              <h2 style={{ fontSize: 14.5, fontWeight: '800', color: '#0f172a', margin: '0 0 20px 0' }}>Active Safety Issues Index</h2>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {issues.length === 0 ? (
                  <p style={{ fontSize: 13, color: '#64748b', textAlign: 'center', padding: '24px 0' }}>No active safety issues logged.</p>
                ) : (
                  issues.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`yard-issue-item ${idx === issues.length - 1 ? 'last' : ''}`}
                    >
                      <div className="yard-issue-details">
                        <div className="yard-issue-meta">
                          <span className={`yard-issue-badge ${item.category === 'Damage' ? 'badge-damage' : 'badge-missing'}`}>
                            {item.category}
                          </span>
                          <span className="yard-issue-trailer">
                            Trailer: {item.trailerId}
                          </span>
                        </div>
                        <p className="yard-issue-desc">
                          {item.description}
                        </p>
                        <span className="yard-issue-date">
                          Logged date: {item.loggedDate}
                        </span>
                      </div>

                      <div className="yard-issue-actions">
                        <span className={`yard-severity-badge severity-${item.severity.toLowerCase()}`}>
                          {item.severity} Severity
                        </span>

                        <button
                          onClick={() => setSelectedIssue(item)}
                          className="yard-details-btn"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Floating Validation Warning Alert */}
      {validationAlert && (
        <div className="yard-toast-popup" style={{
          top: 30,
          bottom: 'auto',
          backgroundColor: '#fef2f2',
          border: '1px solid #fee2e2'
        }}>
          <AlertCircleIcon />
          <span style={{ fontSize: 13, fontWeight: '700', color: '#991b1b', flex: 1 }}>
            Please complete Trailer ID and Description first.
          </span>
          <button
            onClick={() => setValidationAlert(false)}
            style={{ background: 'none', border: 'none', fontSize: 18, color: '#991b1b', cursor: 'pointer', marginLeft: 8 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="yard-toast-popup">
          <div style={{ backgroundColor: '#3b82f6', color: '#ffffff', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>✓</div>
          <span style={{ fontSize: 13, fontWeight: '600', color: '#1e40af', flex: 1 }}>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} style={{ background: 'none', border: 'none', fontSize: 16, color: '#64748b', cursor: 'pointer', marginLeft: 8 }}>✕</button>
        </div>
      )}

      {/* Details Modal */}
      {selectedIssue && (
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
            maxWidth: 480,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'left'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 16.5, fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Inspection Report &mdash; {selectedIssue.trailerId}
              </h2>
              <button
                onClick={() => setSelectedIssue(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', color: '#64748b' }}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
                {/* Report Type */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 16px' }}>
                  <span style={{ fontSize: 9.5, fontWeight: '800', color: '#64748b', display: 'block', marginBottom: 4, letterSpacing: '0.5px' }}>
                    REPORT TYPE
                  </span>
                  <span style={{ fontSize: 13, fontWeight: '700', color: '#0f172a' }}>
                    {selectedIssue.category}
                  </span>
                </div>

                {/* Severity */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 16px' }}>
                  <span style={{ fontSize: 9.5, fontWeight: '800', color: '#64748b', display: 'block', marginBottom: 4, letterSpacing: '0.5px' }}>
                    SEVERITY
                  </span>
                  <span style={{ fontSize: 13, fontWeight: '700', color: '#0f172a' }}>
                    {selectedIssue.severity}
                  </span>
                </div>

                {/* Date Logged */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 16px' }}>
                  <span style={{ fontSize: 9.5, fontWeight: '800', color: '#64748b', display: 'block', marginBottom: 4, letterSpacing: '0.5px' }}>
                    DATE LOGGED
                  </span>
                  <span style={{ fontSize: 13, fontWeight: '700', color: '#0f172a' }}>
                    {selectedIssue.loggedDate}
                  </span>
                </div>

                {/* Trailer ID */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 16px' }}>
                  <span style={{ fontSize: 9.5, fontWeight: '800', color: '#64748b', display: 'block', marginBottom: 4, letterSpacing: '0.5px' }}>
                    TRAILER ID
                  </span>
                  <span style={{ fontSize: 13, fontWeight: '700', color: '#0f172a' }}>
                    {selectedIssue.trailerId}
                  </span>
                </div>
              </div>

              {/* Details text area */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 16px' }}>
                <span style={{ fontSize: 9.5, fontWeight: '800', color: '#64748b', display: 'block', marginBottom: 4, letterSpacing: '0.5px' }}>
                  DETAILS
                </span>
                <p style={{ fontSize: 13, color: '#334155', margin: 0, lineHeight: '1.4' }}>
                  {selectedIssue.description}
                </p>
              </div>

              {/* Upload additional photos zone */}
              <div>
                <label style={{ fontSize: 10.5, fontWeight: '800', color: '#64748b', letterSpacing: '0.5px', display: 'block', marginBottom: 6 }}>
                  UPLOAD ADDITIONAL PHOTOS
                </label>
                <div style={{
                  border: '1.5px dashed #ffcc00',
                  borderRadius: 14,
                  padding: '20px 16px',
                  backgroundColor: '#fffdf5',
                  textAlign: 'center',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}>
                  <UploadIcon />
                  <span style={{ fontSize: 12.5, fontWeight: '700', color: '#0f172a' }}>Drag &amp; drop file or click to select</span>
                  <span style={{ fontSize: 10, color: '#64748b' }}>Supports .PDF, .JPG, .JPEG, .PNG (Max 10MB)</span>
                </div>
              </div>

              {/* Footer Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setSelectedIssue(null)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 10,
                    padding: '10px 24px',
                    fontSize: 12.5,
                    fontWeight: '700',
                    color: '#334155',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => handleResolveReport(selectedIssue.id)}
                  style={{
                    backgroundColor: '#ffcc00',
                    border: 'none',
                    borderRadius: 10,
                    padding: '10px 24px',
                    fontSize: 12.5,
                    fontWeight: '800',
                    color: '#000000',
                    cursor: 'pointer',
                    outline: 'none',
                    boxShadow: '0 2px 4px rgba(255, 204, 0, 0.15)'
                  }}
                >
                  Resolve Report
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
