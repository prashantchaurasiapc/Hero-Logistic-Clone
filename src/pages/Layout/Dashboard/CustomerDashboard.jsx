import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const navigate = useNavigate();

  // Modals & Popups state
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [toast, setToast] = useState(null);

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    if (!subject.trim()) {
      showToastMsg('Please enter a subject heading.');
      return;
    }
    showToastMsg('Support ticket submitted successfully.');
    setShowSupportModal(false);
    setSubject('');
    setDescription('');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleExport = () => {
    const csvHeader = "Section,Metric/Item,Details,Status/Value\n";
    const csvRows = [
      "Summary,Active Loads,8,14.3% vs Last Month",
      "Summary,Upcoming Deliveries,12,8.1% vs Last Month",
      "Summary,Outstanding Invoices,6,$42870.50 AUD",
      "Summary,Outstanding Balance,$42870.50 AUD,Due in 6 invoices",
      "Summary,Payments This Month,$18540.00 AUD,21.7% vs Last Month",
      "Summary,Documents,35,Recently added",
      "Active Load,LD-3987,Melbourne VIC to Sydney NSW,In Transit",
      "Active Load,LD-3981,Brisbane QLD to Perth WA,In Transit",
      "Active Load,LD-3975,Adelaide SA to Melbourne VIC,Arrived",
      "Invoice,INV-2025-0629,29 May 2025,$8649.70 - Outstanding",
      "Invoice,INV-2025-0429,29 Apr 2025,$6250.00 - Paid"
    ];
    
    const blob = new Blob([csvHeader + csvRows.join("\n")], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Customer_Dashboard_Report_2025.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToastMsg("Dashboard report downloaded successfully (Customer_Dashboard_Report_2025.csv).");
  };

  return (
    <div className="cp-dashboard">
      {/* Top Header & Breadcrumb */}
      <div className="cp-header-wrapper">
        <div className="cp-breadcrumb">
          <span>Home</span> &rsaquo; <span>Customer Portal</span> &rsaquo; <span className="active">Dashboard</span>
        </div>
        
        <div className="cp-header-row">
          <div className="cp-header-left">
            <div className="cp-title-group">
              <span className="cp-section-code">14.1</span>
              <h1 className="cp-page-title">Customer Portal Dashboard</h1>
              <button className="cp-star-btn" title="Bookmark page">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </button>
            </div>
            <p className="cp-page-subtitle">Overview of your loads, deliveries, invoices and important updates.</p>
          </div>

          <div className="cp-header-right">
            <button className="cp-help-link" onClick={() => navigate('/customer/messages-support')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              Need help?
            </button>

            <div className="cp-avatar-badge" title="ABC Transport Solutions Customer">AC</div>

            <button className="cp-btn cp-btn-white" onClick={handleRefresh}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
              Refresh
            </button>

            <button className="cp-btn cp-btn-white" onClick={handleExport}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              Export Dashboard
            </button>

            <div className="cp-dropdown-container">
              <button 
                className="cp-btn cp-btn-white" 
                onClick={() => setShowMoreActions(!showMoreActions)}
              >
                More Actions
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 4 }}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {showMoreActions && (
                <div className="cp-more-dropdown">
                  <div className="cp-dropdown-item" onClick={() => { setShowMoreActions(false); handleExport(); }}>Download PDF Summary</div>
                  <div className="cp-dropdown-item" onClick={() => { setShowMoreActions(false); navigate('/customer/create-booking'); }}>New Booking Request</div>
                  <div className="cp-dropdown-item" onClick={() => { setShowMoreActions(false); navigate('/customer/account-users'); }}>Account Settings</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Top 6 Metric Cards Row */}
      <div className="cp-metrics-grid">
        {/* Metric 1 */}
        <div className="cp-metric-card" onClick={() => navigate('/customer/my-loads')}>
          <div className="cp-metric-header">
            <span className="cp-metric-title">ACTIVE LOADS</span>
            <div className="cp-metric-icon icon-blue">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
          </div>
          <div className="cp-metric-body">
            <span className="cp-metric-value">8</span>
            <span className="cp-pill cp-pill-green">&uarr; 14.3% vs Last Month</span>
          </div>
          <div className="cp-metric-footer">
            <span>View active loads &rarr;</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="cp-metric-card" onClick={() => navigate('/customer/my-loads')}>
          <div className="cp-metric-header">
            <span className="cp-metric-title">UPCOMING DELIVERIES</span>
            <div className="cp-metric-icon icon-green">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
          </div>
          <div className="cp-metric-body">
            <span className="cp-metric-value">12</span>
            <span className="cp-pill cp-pill-green">&uarr; 8.1% vs Last Month</span>
          </div>
          <div className="cp-metric-footer">
            <span>View upcoming &rarr;</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="cp-metric-card" onClick={() => navigate('/customer/invoices-payments')}>
          <div className="cp-metric-header">
            <span className="cp-metric-title">OUTSTANDING INVOICES</span>
            <div className="cp-metric-icon icon-amber">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
            </div>
          </div>
          <div className="cp-metric-body">
            <span className="cp-metric-value">6</span>
            <span className="cp-metric-subtext">$42,870.50 AUD</span>
          </div>
          <div className="cp-metric-footer">
            <span>View invoices &rarr;</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="cp-metric-card" onClick={() => navigate('/customer/invoices-payments')}>
          <div className="cp-metric-header">
            <span className="cp-metric-title">OUTSTANDING BALANCE</span>
            <div className="cp-metric-icon icon-blue">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
            </div>
          </div>
          <div className="cp-metric-body">
            <span className="cp-metric-value-sm">$42,870.50 AUD</span>
            <span className="cp-metric-subtext">Due in 6 invoices</span>
          </div>
          <div className="cp-metric-footer">
            <span>Make a payment &rarr;</span>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="cp-metric-card" onClick={() => navigate('/customer/invoices-payments')}>
          <div className="cp-metric-header">
            <span className="cp-metric-title">PAYMENTS THIS MONTH</span>
            <div className="cp-metric-icon icon-green">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
          </div>
          <div className="cp-metric-body">
            <span className="cp-metric-value-sm">$18,540.00 AUD</span>
            <span className="cp-pill cp-pill-green">&uarr; 21.7% vs Last Month</span>
          </div>
          <div className="cp-metric-footer">
            <span>View payments &rarr;</span>
          </div>
        </div>

        {/* Metric 6 */}
        <div className="cp-metric-card" onClick={() => navigate('/customer/documents-pods')}>
          <div className="cp-metric-header">
            <span className="cp-metric-title">DOCUMENTS</span>
            <div className="cp-metric-icon icon-purple">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
          </div>
          <div className="cp-metric-body">
            <span className="cp-metric-value">35</span>
            <span className="cp-metric-subtext">Recently added</span>
          </div>
          <div className="cp-metric-footer">
            <span>View documents &rarr;</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout: 3 Columns Grid */}
      <div className="cp-main-grid">
        
        {/* ================= COLUMN 1 (LEFT) ================= */}
        <div className="cp-column">
          {/* Active Loads Card */}
          <div className="cp-card">
            <div className="cp-card-header">
              <h2 className="cp-card-title">ACTIVE LOADS</h2>
              <button className="cp-link-btn" onClick={() => navigate('/customer/my-loads')}>View all loads &rarr;</button>
            </div>
            
            <div className="cp-table-responsive">
              <table className="cp-table">
                <thead>
                  <tr>
                    <th>Load #</th>
                    <th>Route</th>
                    <th>Status</th>
                    <th>Driver</th>
                    <th>ETA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="cp-bold-link" onClick={() => navigate('/customer/my-loads')}>LD-3987</td>
                    <td>Melbourne VIC &rarr; Sydney NSW</td>
                    <td><span className="cp-status-pill status-blue">In Transit</span></td>
                    <td>John Davis</td>
                    <td>
                      <div style={{ fontSize: '11px', fontWeight: 600 }}>30 May 2025</div>
                      <div style={{ fontSize: '9.5px', color: '#64748b' }}>02:30 PM</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="cp-bold-link" onClick={() => navigate('/customer/my-loads')}>LD-3981</td>
                    <td>Brisbane QLD &rarr; Perth WA</td>
                    <td><span className="cp-status-pill status-blue">In Transit</span></td>
                    <td>Michael Tan</td>
                    <td>
                      <div style={{ fontSize: '11px', fontWeight: 600 }}>31 May 2025</div>
                      <div style={{ fontSize: '9.5px', color: '#64748b' }}>11:00 AM</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="cp-bold-link" onClick={() => navigate('/customer/my-loads')}>LD-3975</td>
                    <td>Adelaide SA &rarr; Melbourne VIC</td>
                    <td><span className="cp-status-pill status-green">Arrived</span></td>
                    <td>Ravi Wilson</td>
                    <td>
                      <div style={{ fontSize: '11px', fontWeight: 600 }}>30 May 2025</div>
                      <div style={{ fontSize: '9.5px', color: '#64748b' }}>08:30 AM</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="cp-bold-link" onClick={() => navigate('/customer/my-loads')}>LD-3962</td>
                    <td>Sydney NSW &rarr; Newcastle NSW</td>
                    <td><span className="cp-status-pill status-orange">On Pickup</span></td>
                    <td>Sarah Mitchell</td>
                    <td>
                      <div style={{ fontSize: '11px', fontWeight: 600 }}>30 May 2025</div>
                      <div style={{ fontSize: '9.5px', color: '#64748b' }}>09:15 AM</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="cp-bold-link" onClick={() => navigate('/customer/my-loads')}>LD-3958</td>
                    <td>Melbourne VIC &rarr; Brisbane QLD</td>
                    <td><span className="cp-status-pill status-purple">Dispatched</span></td>
                    <td>Amir Ramia</td>
                    <td>
                      <div style={{ fontSize: '11px', fontWeight: 600 }}>30 May 2025</div>
                      <div style={{ fontSize: '9.5px', color: '#64748b' }}>01:45 PM</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="cp-card-footer">
              <span>Showing 1 to 5 of 8 active loads</span>
            </div>
          </div>

          {/* Recent Documents Card */}
          <div className="cp-card mt-16">
            <div className="cp-card-header">
              <h2 className="cp-card-title">RECENT DOCUMENTS</h2>
              <button className="cp-link-btn" onClick={() => navigate('/customer/documents-pods')}>View all documents &rarr;</button>
            </div>

            <div className="cp-doc-list">
              <div className="cp-doc-item">
                <div className="cp-doc-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
                <div className="cp-doc-info">
                  <div className="cp-doc-name">POD_LD-3975.pdf</div>
                  <div className="cp-doc-sub">Proof of Delivery</div>
                </div>
                <div className="cp-doc-date">29 May 2025</div>
                <button className="cp-doc-dl" title="Download" onClick={() => showToastMsg('Downloading POD_LD-3975.pdf')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </button>
              </div>

              <div className="cp-doc-item">
                <div className="cp-doc-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
                <div className="cp-doc-info">
                  <div className="cp-doc-name">Invoice_INV-2025-0628.pdf</div>
                  <div className="cp-doc-sub">Invoice</div>
                </div>
                <div className="cp-doc-date">29 May 2025</div>
                <button className="cp-doc-dl" title="Download" onClick={() => showToastMsg('Downloading Invoice_INV-2025-0628.pdf')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </button>
              </div>

              <div className="cp-doc-item">
                <div className="cp-doc-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
                <div className="cp-doc-info">
                  <div className="cp-doc-name">Condition_Report_LD-3967.pdf</div>
                  <div className="cp-doc-sub">Condition Report</div>
                </div>
                <div className="cp-doc-date">29 May 2025</div>
                <button className="cp-doc-dl" title="Download" onClick={() => showToastMsg('Downloading Condition_Report_LD-3967.pdf')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </button>
              </div>

              <div className="cp-doc-item">
                <div className="cp-doc-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
                <div className="cp-doc-info">
                  <div className="cp-doc-name">Contract_ABC-2025.pdf</div>
                  <div className="cp-doc-sub">Contract</div>
                </div>
                <div className="cp-doc-date">28 May 2025</div>
                <button className="cp-doc-dl" title="Download" onClick={() => showToastMsg('Downloading Contract_ABC-2025.pdf')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </button>
              </div>

              <div className="cp-doc-item">
                <div className="cp-doc-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
                <div className="cp-doc-info">
                  <div className="cp-doc-name">POD_LD-3951.pdf</div>
                  <div className="cp-doc-sub">Proof of Delivery</div>
                </div>
                <div className="cp-doc-date">28 May 2025</div>
                <button className="cp-doc-dl" title="Download" onClick={() => showToastMsg('Downloading POD_LD-3951.pdf')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </button>
              </div>
            </div>

            <div className="cp-card-footer">
              <span>Showing 1 to 5 of 35 documents</span>
            </div>
          </div>
        </div>

        {/* ================= COLUMN 2 (MIDDLE) ================= */}
        <div className="cp-column">
          {/* Upcoming Deliveries Card */}
          <div className="cp-card">
            <div className="cp-card-header">
              <h2 className="cp-card-title">UPCOMING DELIVERIES</h2>
              <button className="cp-link-btn" onClick={() => navigate('/customer/my-loads')}>View all upcoming &rarr;</button>
            </div>

            <div className="cp-upcoming-list">
              <div className="cp-upcoming-item">
                <div className="cp-date-box">
                  <span className="cp-date-day">30</span>
                  <span className="cp-date-month">MAY</span>
                </div>
                <div className="cp-upcoming-info">
                  <div className="cp-upcoming-title">
                    <span className="cp-bold-id">LD-3987</span>
                  </div>
                  <div className="cp-upcoming-route">Melbourne VIC &rarr; Sydney NSW</div>
                  <div className="cp-upcoming-eta">ETA: 02:30 PM</div>
                </div>
                <span className="cp-status-pill status-blue">In Transit</span>
              </div>

              <div className="cp-upcoming-item">
                <div className="cp-date-box">
                  <span className="cp-date-day">31</span>
                  <span className="cp-date-month">MAY</span>
                </div>
                <div className="cp-upcoming-info">
                  <div className="cp-upcoming-title">
                    <span className="cp-bold-id">LD-3981</span>
                  </div>
                  <div className="cp-upcoming-route">Brisbane QLD &rarr; Perth WA</div>
                  <div className="cp-upcoming-eta">ETA: 11:00 AM</div>
                </div>
                <span className="cp-status-pill status-blue">In Transit</span>
              </div>

              <div className="cp-upcoming-item">
                <div className="cp-date-box">
                  <span className="cp-date-day">01</span>
                  <span className="cp-date-month">JUN</span>
                </div>
                <div className="cp-upcoming-info">
                  <div className="cp-upcoming-title">
                    <span className="cp-bold-id">LD-3990</span>
                  </div>
                  <div className="cp-upcoming-route">Adelaide SA &rarr; Melbourne VIC</div>
                  <div className="cp-upcoming-eta">ETA: 09:30 AM</div>
                </div>
                <span className="cp-status-pill status-purple">Dispatched</span>
              </div>

              <div className="cp-upcoming-item">
                <div className="cp-date-box">
                  <span className="cp-date-day">02</span>
                  <span className="cp-date-month">JUN</span>
                </div>
                <div className="cp-upcoming-info">
                  <div className="cp-upcoming-title">
                    <span className="cp-bold-id">LD-3992</span>
                  </div>
                  <div className="cp-upcoming-route">Sydney NSW &rarr; Brisbane QLD</div>
                  <div className="cp-upcoming-eta">ETA: 01:15 PM</div>
                </div>
                <span className="cp-status-pill status-slate">Scheduled</span>
              </div>

              <div className="cp-upcoming-item">
                <div className="cp-date-box">
                  <span className="cp-date-day">03</span>
                  <span className="cp-date-month">JUN</span>
                </div>
                <div className="cp-upcoming-info">
                  <div className="cp-upcoming-title">
                    <span className="cp-bold-id">LD-3994</span>
                  </div>
                  <div className="cp-upcoming-route">Melbourne VIC &rarr; Adelaide SA</div>
                  <div className="cp-upcoming-eta">ETA: 08:45 AM</div>
                </div>
                <span className="cp-status-pill status-slate">Scheduled</span>
              </div>
            </div>

            <div className="cp-card-footer">
              <span>Showing next 5 deliveries</span>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="cp-card mt-16">
            <div className="cp-card-header">
              <h2 className="cp-card-title">RECENT ACTIVITY</h2>
              <button className="cp-link-btn" onClick={() => navigate('/customer/notifications')}>View all activity &rarr;</button>
            </div>

            <div className="cp-activity-list">
              <div className="cp-activity-item">
                <div className="cp-act-icon act-blue">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  </svg>
                </div>
                <div className="cp-act-content">
                  <div className="cp-act-text">
                    Load <strong>LD-3987</strong> status updated to <span className="cp-highlight-blue">In Transit</span>
                  </div>
                  <div className="cp-act-sub">by John Davis</div>
                </div>
                <span className="cp-act-time">25 mins ago</span>
              </div>

              <div className="cp-activity-item">
                <div className="cp-act-icon act-green">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
                <div className="cp-act-content">
                  <div className="cp-act-text">
                    New POD uploaded for Load <strong>LD-3975</strong>
                  </div>
                  <div className="cp-act-sub">by Ravi Wilson</div>
                </div>
                <span className="cp-act-time">1 hour ago</span>
              </div>

              <div className="cp-activity-item">
                <div className="cp-act-icon act-purple">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
                <div className="cp-act-content">
                  <div className="cp-act-text">
                    Invoice <strong>INV-2025-0629</strong> created for Account ABC-1025
                  </div>
                </div>
                <span className="cp-act-time">3 hours ago</span>
              </div>

              <div className="cp-activity-item">
                <div className="cp-act-icon act-amber">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <div className="cp-act-content">
                  <div className="cp-act-text">
                    New Message from Dispatch for Load <strong>LD-3987</strong>
                  </div>
                  <div className="cp-act-sub">by Sarah Mitchell</div>
                </div>
                <span className="cp-act-time">4 hours ago</span>
              </div>

              <div className="cp-activity-item">
                <div className="cp-act-icon act-teal">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div className="cp-act-content">
                  <div className="cp-act-text">
                    Payment received for Invoice <strong>INV-2025-0429</strong>
                  </div>
                  <div className="cp-act-sub">by System</div>
                </div>
                <span className="cp-act-time">1 day ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= COLUMN 3 (RIGHT) ================= */}
        <div className="cp-column">
          {/* Invoice Summary Card */}
          <div className="cp-card">
            <div className="cp-card-header">
              <h2 className="cp-card-title">INVOICE SUMMARY</h2>
              <button className="cp-link-btn" onClick={() => navigate('/customer/invoices-payments')}>View all invoices &rarr;</button>
            </div>

            {/* Donut Chart & Legend Container */}
            <div className="cp-chart-container">
              <div className="cp-donut-wrapper">
                <svg className="cp-donut-svg" viewBox="0 0 100 100">
                  {/* Circle background */}
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#e2e8f0" strokeWidth="14" />
                  
                  {/* Paid 50% (green) */}
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" strokeWidth="14"
                          strokeDasharray="119.38 119.38" strokeDashoffset="0" />
                  
                  {/* Partially Paid 25% (sky blue) */}
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#38bdf8" strokeWidth="14"
                          strokeDasharray="59.69 179.07" strokeDashoffset="-119.38" />

                  {/* Outstanding 12.5% (amber) */}
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f59e0b" strokeWidth="14"
                          strokeDasharray="29.85 208.91" strokeDashoffset="-179.07" />

                  {/* Overdue 12.5% (red) */}
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#ef4444" strokeWidth="14"
                          strokeDasharray="29.85 208.91" strokeDashoffset="-208.92" />
                </svg>
                <div className="cp-donut-center">
                  <span className="cp-donut-count">24</span>
                  <span className="cp-donut-label">Total Invoices</span>
                </div>
              </div>

              <div className="cp-chart-legend">
                <div className="cp-legend-item">
                  <span className="cp-dot dot-green"></span>
                  <span className="cp-legend-name">Paid</span>
                  <span className="cp-legend-val">12 (50.0%)</span>
                </div>
                <div className="cp-legend-item">
                  <span className="cp-dot dot-cyan"></span>
                  <span className="cp-legend-name">Partially Paid</span>
                  <span className="cp-legend-val">6 (25.0%)</span>
                </div>
                <div className="cp-legend-item">
                  <span className="cp-dot dot-amber"></span>
                  <span className="cp-legend-name">Outstanding</span>
                  <span className="cp-legend-val">3 (12.5%)</span>
                </div>
                <div className="cp-legend-item">
                  <span className="cp-dot dot-red"></span>
                  <span className="cp-legend-name">Overdue</span>
                  <span className="cp-legend-val">3 (12.5%)</span>
                </div>
              </div>
            </div>

            {/* Overdue & Paid Highlight Cards */}
            <div className="cp-amount-highlights">
              <div className="cp-amt-box amt-red">
                <span className="cp-amt-title">Overdue Amount</span>
                <span className="cp-amt-val red-text">$12,450.00 AUD</span>
              </div>
              <div className="cp-amt-box amt-green">
                <span className="cp-amt-title">Paid This Month</span>
                <span className="cp-amt-val green-text">$18,540.00 AUD</span>
              </div>
            </div>
          </div>

          {/* Recent Invoices Card */}
          <div className="cp-card mt-16">
            <div className="cp-card-header">
              <h2 className="cp-card-title">RECENT INVOICES</h2>
              <button className="cp-link-btn" onClick={() => navigate('/customer/invoices-payments')}>View all invoices &rarr;</button>
            </div>

            <div className="cp-inv-list">
              <div className="cp-inv-item">
                <div className="cp-inv-meta">
                  <div className="cp-inv-num">INV-2025-0629</div>
                  <div className="cp-inv-date">29 May 2025</div>
                </div>
                <div className="cp-inv-right">
                  <div className="cp-inv-amount">$8,649.70</div>
                  <span className="cp-status-pill status-amber">Outstanding</span>
                </div>
              </div>

              <div className="cp-inv-item">
                <div className="cp-inv-meta">
                  <div className="cp-inv-num">INV-2025-0429</div>
                  <div className="cp-inv-date">29 Apr 2025</div>
                </div>
                <div className="cp-inv-right">
                  <div className="cp-inv-amount">$6,250.00</div>
                  <span className="cp-status-pill status-green">Paid</span>
                </div>
              </div>

              <div className="cp-inv-item">
                <div className="cp-inv-meta">
                  <div className="cp-inv-num">INV-2025-0628</div>
                  <div className="cp-inv-date">29 May 2025</div>
                </div>
                <div className="cp-inv-right">
                  <div className="cp-inv-amount">$4,750.00</div>
                  <span className="cp-status-pill status-green">Paid</span>
                </div>
              </div>

              <div className="cp-inv-item">
                <div className="cp-inv-meta">
                  <div className="cp-inv-num">INV-2025-0620</div>
                  <div className="cp-inv-date">20 May 2025</div>
                </div>
                <div className="cp-inv-right">
                  <div className="cp-inv-amount">$7,660.00</div>
                  <span className="cp-status-pill status-amber">Outstanding</span>
                </div>
              </div>

              <div className="cp-inv-item">
                <div className="cp-inv-meta">
                  <div className="cp-inv-num">INV-2025-0418</div>
                  <div className="cp-inv-date">18 Apr 2025</div>
                </div>
                <div className="cp-inv-right">
                  <div className="cp-inv-amount">$3,980.00</div>
                  <span className="cp-status-pill status-green">Paid</span>
                </div>
              </div>
            </div>

            <div className="cp-card-footer">
              <span>Showing 1 to 5 of 24 invoices</span>
            </div>
          </div>
        </div>

        {/* ================= COLUMN 4 (RIGHT-MOST - QUICK ACTIONS) ================= */}
        <div className="cp-column">
          {/* Quick Actions Card */}
          <div className="cp-card">
            <div className="cp-card-header">
              <h2 className="cp-card-title">QUICK ACTIONS</h2>
            </div>

            <div className="cp-quick-actions">
              <button className="cp-action-btn" onClick={() => navigate('/customer/create-booking')}>
                <div className="cp-action-icon action-blue">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
                <div className="cp-action-text">
                  <div className="cp-action-title">Create New Booking</div>
                  <div className="cp-action-sub">Request a new load or transport</div>
                </div>
              </button>

              <button className="cp-action-btn" onClick={() => navigate('/customer/track-delivery')}>
                <div className="cp-action-icon action-green">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <div className="cp-action-text">
                  <div className="cp-action-title">Track a Load</div>
                  <div className="cp-action-sub">Track your active loads in real-time</div>
                </div>
              </button>

              <button className="cp-action-btn" onClick={() => navigate('/customer/invoices-payments')}>
                <div className="cp-action-icon action-amber">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                </div>
                <div className="cp-action-text">
                  <div className="cp-action-title">Make a Payment</div>
                  <div className="cp-action-sub">Pay outstanding invoices securely</div>
                </div>
              </button>

              <button className="cp-action-btn" onClick={() => showToastMsg('Generating and downloading account statement...')}>
                <div className="cp-action-icon action-purple">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </div>
                <div className="cp-action-text">
                  <div className="cp-action-title">Download Statement</div>
                  <div className="cp-action-sub">Download your account statement</div>
                </div>
              </button>

              <button className="cp-action-btn" onClick={() => setShowSupportModal(true)}>
                <div className="cp-action-icon action-cyan">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <div className="cp-action-text">
                  <div className="cp-action-title">Contact Support</div>
                  <div className="cp-action-sub">Get help from our team</div>
                </div>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Developer Notes Banner Block */}
      <div className="cp-dev-notes-card">
        <div className="cp-dev-header">
          <span className="cp-dev-code-icon">&lt;/&gt;</span>
          <span className="cp-dev-title">DEVELOPER NOTES - CUSTOMER PORTAL DASHBOARD</span>
        </div>
        <div className="cp-dev-grid">
          <div className="cp-dev-col">
            <h4 className="cp-dev-col-title">1. PURPOSE</h4>
            <ul className="cp-dev-list">
              <li>Provide customers with a real-time overview.</li>
              <li>Show key metrics, loads, invoices and updates.</li>
              <li>Improve visibility and customer experience.</li>
            </ul>
          </div>
          <div className="cp-dev-col">
            <h4 className="cp-dev-col-title">2. KEY FEATURES</h4>
            <ul className="cp-dev-list">
              <li>Summary cards with real-time data.</li>
              <li>Quick access to loads, invoices and documents.</li>
              <li>Recent activity and upcoming deliveries.</li>
              <li>Quick actions for common tasks.</li>
            </ul>
          </div>
          <div className="cp-dev-col">
            <h4 className="cp-dev-col-title">3. DATA SOURCES</h4>
            <ul className="cp-dev-list">
              <li>Loads, Invoices, Payments, Documents.</li>
              <li>Real-time data from operational modules.</li>
              <li>Customer-specific data only.</li>
            </ul>
          </div>
          <div className="cp-dev-col">
            <h4 className="cp-dev-col-title">4. SECURITY &amp; ACCESS</h4>
            <ul className="cp-dev-list">
              <li>Customers see only their own data.</li>
              <li>Role-based access for portal users.</li>
              <li>Secure API endpoints and data filters.</li>
            </ul>
          </div>
          <div className="cp-dev-col">
            <h4 className="cp-dev-col-title">5. PERFORMANCE</h4>
            <ul className="cp-dev-list">
              <li>Dashboard loads under 2 seconds.</li>
              <li>Use caching for summary cards.</li>
              <li>Auto-refresh summary data every 5 minutes.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer Info */}
      <div className="cp-footer-bar">
        <span>All times shown in your local time (AEST) &bull; Data auto-refreshes every 5 minutes</span>
        <button className="cp-refresh-icon-btn" onClick={handleRefresh} title="Auto refresh">↻</button>
      </div>

      {/* Support Ticket Modal */}
      {showSupportModal && (
        <div className="cp-modal-overlay" onClick={() => setShowSupportModal(false)}>
          <div className="cp-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="cp-modal-header">
              <h2 className="cp-modal-title">Shipper Help Desk &amp; Ticket Center</h2>
              <button onClick={() => setShowSupportModal(false)} className="cp-modal-close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmitTicket} className="cp-modal-form">
              <div className="cp-modal-body">
                <div className="cp-form-group">
                  <label className="cp-form-label">SUBJECT HEADING</label>
                  <input 
                    type="text" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Shipment update delay" 
                    className="cp-input"
                    required
                  />
                </div>

                <div className="cp-form-group">
                  <label className="cp-form-label">PROBLEM DESCRIPTION</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please provide specific details..." 
                    className="cp-textarea"
                    required
                  />
                </div>
              </div>

              <div className="cp-modal-footer">
                <button type="button" onClick={() => setShowSupportModal(false)} className="cp-btn-cancel">Cancel</button>
                <button type="submit" className="cp-btn-submit">Submit Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="cp-toast">
          <div className="cp-toast-icon">&check;</div>
          <span className="cp-toast-text">{toast}</span>
          <button onClick={() => setToast(null)} className="cp-toast-close">&times;</button>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
