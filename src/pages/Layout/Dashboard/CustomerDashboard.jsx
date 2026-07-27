import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const navigate = useNavigate();

  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [toast, setToast] = useState(null);

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    if (!subject.trim()) { showToastMsg('Please enter a subject heading.'); return; }
    showToastMsg('Support ticket submitted successfully.');
    setShowSupportModal(false);
    setSubject(''); setDescription('');
  };

  const handleRefresh = () => {
    showToastMsg('Dashboard refreshed with latest data!');
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
    showToastMsg("Dashboard exported as CSV successfully!");
  };

  return (
    <div className="cp-dashboard">

      {/* =========== TOP HEADER =========== */}
      <div className="cp-header-wrapper">
        <div className="cp-breadcrumb">
          <span>Home</span> &rsaquo; <span>Customer Portal</span> &rsaquo; <span className="active">Dashboard</span>
        </div>

        <div className="cp-header-row">
          <div className="cp-header-left">
            <div className="cp-title-group">
              <span className="cp-section-code">14.1</span>
              <h1 className="cp-page-title">Customer Portal Dashboard</h1>
              <button
                className="cp-star-btn"
                title={isBookmarked ? "Remove Bookmark" : "Bookmark page"}
                onClick={() => { setIsBookmarked(!isBookmarked); showToastMsg(isBookmarked ? "Removed from bookmarks" : "Page bookmarked!"); }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24"
                  fill={isBookmarked ? "#f59e0b" : "none"}
                  stroke={isBookmarked ? "#f59e0b" : "#64748b"}
                  strokeWidth="2"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </button>
            </div>
            <p className="cp-page-subtitle">Overview of your loads, deliveries, invoices and important updates.</p>
          </div>

          <div className="cp-header-right">
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
              <button className="cp-btn cp-btn-white" onClick={() => setShowMoreActions(!showMoreActions)}>
                More Actions
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 2 }}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              {showMoreActions && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setShowMoreActions(false)} />
                  <div className="cp-more-dropdown">
                    <div className="cp-dropdown-item" onClick={() => { setShowMoreActions(false); handleExport(); }}>Download PDF Summary</div>
                    <div className="cp-dropdown-item" onClick={() => { setShowMoreActions(false); navigate('/customer/create-booking'); }}>New Booking Request</div>
                    <div className="cp-dropdown-item" onClick={() => { setShowMoreActions(false); navigate('/customer/account-users'); }}>Account Settings</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========== TOP 6 METRIC CARDS ROW =========== */}
      <div className="cp-metrics-grid">

        {/* 1: ACTIVE LOADS */}
        <div className="cp-metric-card" onClick={() => navigate('/customer/my-loads')}>
          <div className="cp-metric-main">
            <div className="cp-metric-icon icon-blue">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <div className="cp-metric-details">
              <span className="cp-metric-title">ACTIVE LOADS</span>
              <span className="cp-metric-value">8</span>
              <span className="cp-metric-subtext">
                <span className="cp-text-green">&uarr; 14.3%</span> vs Last Month
              </span>
            </div>
          </div>
          <div className="cp-metric-footer">
            <span>View active loads &rarr;</span>
          </div>
        </div>

        {/* 2: UPCOMING DELIVERIES */}
        <div className="cp-metric-card" onClick={() => navigate('/customer/my-loads')}>
          <div className="cp-metric-main">
            <div className="cp-metric-icon icon-green">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div className="cp-metric-details">
              <span className="cp-metric-title">UPCOMING DELIVERIES</span>
              <span className="cp-metric-value">12</span>
              <span className="cp-metric-subtext">
                <span className="cp-text-green">&uarr; 9.1%</span> vs Last Month
              </span>
            </div>
          </div>
          <div className="cp-metric-footer">
            <span>View upcoming &rarr;</span>
          </div>
        </div>

        {/* 3: OUTSTANDING INVOICES */}
        <div className="cp-metric-card" onClick={() => navigate('/customer/invoices-payments')}>
          <div className="cp-metric-main">
            <div className="cp-metric-icon icon-amber">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
            </div>
            <div className="cp-metric-details">
              <span className="cp-metric-title">OUTSTANDING INVOICES</span>
              <span className="cp-metric-value">6</span>
              <span className="cp-metric-subtext">$42,870.50 AUD</span>
            </div>
          </div>
          <div className="cp-metric-footer">
            <span>View invoices &rarr;</span>
          </div>
        </div>

        {/* 4: OUTSTANDING BALANCE */}
        <div className="cp-metric-card" onClick={() => navigate('/customer/invoices-payments')}>
          <div className="cp-metric-main">
            <div className="cp-metric-icon icon-indigo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
            </div>
            <div className="cp-metric-details">
              <span className="cp-metric-title">OUTSTANDING BALANCE</span>
              <span className="cp-metric-value-sm">$42,870.50 <span className="cp-unit">AUD</span></span>
              <span className="cp-metric-subtext cp-text-amber">Due in 6 invoices</span>
            </div>
          </div>
          <div className="cp-metric-footer">
            <span>Make a payment &rarr;</span>
          </div>
        </div>

        {/* 5: PAYMENTS (THIS MONTH) */}
        <div className="cp-metric-card" onClick={() => navigate('/customer/invoices-payments')}>
          <div className="cp-metric-main">
            <div className="cp-metric-icon icon-blue-check">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="9 12 11.5 14.5 15 9.5"></polyline>
              </svg>
            </div>
            <div className="cp-metric-details">
              <span className="cp-metric-title">PAYMENTS (THIS MONTH)</span>
              <span className="cp-metric-value-sm">$18,540.00 <span className="cp-unit">AUD</span></span>
              <span className="cp-metric-subtext">
                <span className="cp-text-green">&uarr; 21.7%</span> vs Last Month
              </span>
            </div>
          </div>
          <div className="cp-metric-footer">
            <span>View payments &rarr;</span>
          </div>
        </div>

        {/* 6: DOCUMENTS */}
        <div className="cp-metric-card" onClick={() => navigate('/customer/documents-pods')}>
          <div className="cp-metric-main">
            <div className="cp-metric-icon icon-green">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div className="cp-metric-details">
              <span className="cp-metric-title">DOCUMENTS</span>
              <span className="cp-metric-value">35</span>
              <span className="cp-metric-subtext">Recently added</span>
            </div>
          </div>
          <div className="cp-metric-footer">
            <span>View documents &rarr;</span>
          </div>
        </div>

      </div>

      {/* =========== MAIN 4-COL CONTENT GRID =========== */}
      <div className="cp-main-grid">

        {/* ===== COLUMN 1: ACTIVE LOADS + RECENT DOCUMENTS ===== */}
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
                  {[
                    { id: 'LD-3987', route: 'Melbourne VIC → Sydney NSW', status: 'In Transit', statusClass: 'status-blue', driver: 'John Davis', eta: '30 May, 02:30 PM' },
                    { id: 'LD-3981', route: 'Brisbane QLD → Perth WA',    status: 'In Transit', statusClass: 'status-blue', driver: 'Michael Tan', eta: '31 May, 11:00 AM' },
                    { id: 'LD-3975', route: 'Adelaide SA → Melbourne VIC', status: 'Arrived',   statusClass: 'status-green',  driver: 'Ravi Wilson', eta: '30 May, 08:30 AM' },
                    { id: 'LD-3962', route: 'Sydney NSW → Newcastle NSW',  status: 'On Pickup', statusClass: 'status-orange', driver: 'Sarah M.',    eta: '30 May, 09:15 AM' },
                    { id: 'LD-3958', route: 'Melbourne VIC → Brisbane QLD',status: 'Dispatched',statusClass: 'status-purple', driver: 'Amir Ramia',  eta: '30 May, 01:45 PM' },
                  ].map(row => (
                    <tr key={row.id}>
                      <td className="cp-bold-link" onClick={() => navigate('/customer/my-loads')}>{row.id}</td>
                      <td style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.route}</td>
                      <td><span className={`cp-status-pill ${row.statusClass}`}>{row.status}</span></td>
                      <td style={{ whiteSpace: 'nowrap' }}>{row.driver}</td>
                      <td style={{ whiteSpace: 'nowrap', fontSize: '10px', color: '#64748b' }}>{row.eta}</td>
                    </tr>
                  ))}
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
              {[
                { name: 'POD_LD-3975.pdf', type: 'Proof of Delivery', date: '29 May 2025' },
                { name: 'Invoice_INV-2025-0628.pdf', type: 'Invoice', date: '29 May 2025' },
                { name: 'Condition_Report_LD-3967.pdf', type: 'Condition Report', date: '29 May 2025' },
                { name: 'Contract_ABC-2025.pdf', type: 'Contract', date: '28 May 2025' },
                { name: 'POD_LD-3951.pdf', type: 'Proof of Delivery', date: '28 May 2025' },
              ].map(doc => (
                <div key={doc.name} className="cp-doc-item">
                  <div className="cp-doc-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  </div>
                  <div className="cp-doc-info">
                    <div className="cp-doc-name">{doc.name}</div>
                    <div className="cp-doc-sub">{doc.type}</div>
                  </div>
                  <div className="cp-doc-date">{doc.date}</div>
                  <button className="cp-doc-dl" title="Download" onClick={() => showToastMsg(`Downloading ${doc.name}`)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="cp-card-footer">
              <span>Showing 1 to 5 of 35 documents</span>
            </div>
          </div>

        </div>

        {/* ===== COLUMN 2: UPCOMING DELIVERIES + RECENT ACTIVITY ===== */}
        <div className="cp-column">

          {/* Upcoming Deliveries Card */}
          <div className="cp-card">
            <div className="cp-card-header">
              <h2 className="cp-card-title">UPCOMING DELIVERIES</h2>
              <button className="cp-link-btn" onClick={() => navigate('/customer/my-loads')}>View all upcoming &rarr;</button>
            </div>

            <div className="cp-upcoming-list">
              {[
                { day: '30', month: 'MAY', id: 'LD-3987', route: 'Melbourne VIC → Sydney NSW', eta: 'ETA: 02:30 PM', status: 'In Transit', statusClass: 'status-blue' },
                { day: '31', month: 'MAY', id: 'LD-3981', route: 'Brisbane QLD → Perth WA', eta: 'ETA: 11:00 AM', status: 'In Transit', statusClass: 'status-blue' },
                { day: '01', month: 'JUN', id: 'LD-3990', route: 'Adelaide SA → Melbourne VIC', eta: 'ETA: 09:30 AM', status: 'Dispatched', statusClass: 'status-purple' },
                { day: '02', month: 'JUN', id: 'LD-3992', route: 'Sydney NSW → Brisbane QLD', eta: 'ETA: 01:15 PM', status: 'Scheduled', statusClass: 'status-slate' },
                { day: '03', month: 'JUN', id: 'LD-3994', route: 'Melbourne VIC → Adelaide SA', eta: 'ETA: 08:45 AM', status: 'Scheduled', statusClass: 'status-slate' },
              ].map(del => (
                <div key={del.id} className="cp-upcoming-item">
                  <div className="cp-date-box">
                    <span className="cp-date-day">{del.day}</span>
                    <span className="cp-date-month">{del.month}</span>
                  </div>
                  <div className="cp-upcoming-info">
                    <div className="cp-upcoming-title">
                      <span className="cp-bold-id">{del.id}</span>
                    </div>
                    <div className="cp-upcoming-route">{del.route}</div>
                    <div className="cp-upcoming-eta">{del.eta}</div>
                  </div>
                  <span className={`cp-status-pill ${del.statusClass}`}>{del.status}</span>
                </div>
              ))}
            </div>

            <div className="cp-card-footer">
              <span>Showing next 5 deliveries</span>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="cp-card mt-16">
            <div className="cp-card-header">
              <h2 className="cp-card-title">RECENT ACTIVITY</h2>
              <button className="cp-link-btn" onClick={() => showToastMsg('Viewing all activity log...')}>View all activity &rarr;</button>
            </div>

            <div className="cp-activity-list">
              {[
                { iconClass: 'act-blue', time: '20 min ago', text: <>Load <strong>LD-3987</strong> status updated to <span className="cp-highlight-blue">In Transit</span></>, sub: 'by John Davis', icon: 'truck' },
                { iconClass: 'act-green', time: '1 hour ago', text: <>New POD uploaded for load <strong>LD-3975</strong></>, sub: 'by Ravi Wilson', icon: 'file' },
                { iconClass: 'act-purple', time: '3 hours ago', text: <>Invoice <strong>INV-2025-0629</strong> created for Account ABC-1025</>, sub: 'by Accounts Team', icon: 'file' },
                { iconClass: 'act-amber', time: '4 hours ago', text: <>New message from Dispatch for Load <strong>LD-3987</strong></>, sub: 'by Sarah Mitchell', icon: 'message' },
                { iconClass: 'act-teal', time: '1 day ago', text: <>Payment received for Invoice <strong>INV-2025-0429</strong></>, sub: 'by System', icon: 'check' },
              ].map((act, i) => (
                <div key={i} className="cp-activity-item">
                  <div className={`cp-act-icon ${act.iconClass}`}>
                    {act.icon === 'truck' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="3" width="15" height="13"></rect>
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                      </svg>
                    )}
                    {act.icon === 'file' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                    )}
                    {act.icon === 'message' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    )}
                    {act.icon === 'check' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  <div className="cp-act-content">
                    <div className="cp-act-text">{act.text}</div>
                    {act.sub && <div className="cp-act-sub">{act.sub}</div>}
                  </div>
                  <span className="cp-act-time">{act.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ===== COLUMN 3: INVOICE SUMMARY + RECENT INVOICES ===== */}
        <div className="cp-column">

          {/* Invoice Summary Card */}
          <div className="cp-card">
            <div className="cp-card-header">
              <h2 className="cp-card-title">INVOICE SUMMARY</h2>
              <button className="cp-link-btn" onClick={() => navigate('/customer/invoices-payments')}>View all invoices &rarr;</button>
            </div>

            <div className="cp-chart-container">
              <div className="cp-donut-wrapper">
                <svg className="cp-donut-svg" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#e2e8f0" strokeWidth="14" />
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" strokeWidth="14"
                    strokeDasharray="119.38 119.38" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#38bdf8" strokeWidth="14"
                    strokeDasharray="59.69 179.07" strokeDashoffset="-119.38" />
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f59e0b" strokeWidth="14"
                    strokeDasharray="29.85 208.91" strokeDashoffset="-179.07" />
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#ef4444" strokeWidth="14"
                    strokeDasharray="29.85 208.91" strokeDashoffset="-208.92" />
                </svg>
                <div className="cp-donut-center">
                  <span className="cp-donut-count">24</span>
                  <span className="cp-donut-label">Total Invoices</span>
                </div>
              </div>

              <div className="cp-chart-legend">
                {[
                  { dot: 'dot-green', name: 'Paid', val: '12 (50.0%)' },
                  { dot: 'dot-cyan', name: 'Partially Paid', val: '6 (25.0%)' },
                  { dot: 'dot-amber', name: 'Outstanding', val: '3 (12.5%)' },
                  { dot: 'dot-red', name: 'Overdue', val: '3 (12.5%)' },
                ].map(l => (
                  <div key={l.name} className="cp-legend-item">
                    <span className={`cp-dot ${l.dot}`}></span>
                    <span className="cp-legend-name">{l.name}</span>
                    <span className="cp-legend-val">{l.val}</span>
                  </div>
                ))}
              </div>
            </div>

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
              {[
                { num: 'INV-2025-0629', date: '29 May 2025', amount: '$8,649.70', status: 'Outstanding', statusClass: 'status-amber' },
                { num: 'INV-2025-0429', date: '28 Apr 2025', amount: '$6,250.00', status: 'Paid', statusClass: 'status-green' },
                { num: 'INV-2025-0628', date: '29 May 2025', amount: '$4,750.00', status: 'Paid', statusClass: 'status-green' },
                { num: 'INV-2025-0620', date: '20 May 2025', amount: '$7,660.00', status: 'Outstanding', statusClass: 'status-amber' },
                { num: 'INV-2025-0418', date: '15 Apr 2025', amount: '$3,980.00', status: 'Paid', statusClass: 'status-green' },
              ].map(inv => (
                <div key={inv.num} className="cp-inv-item" onClick={() => navigate('/customer/invoices-payments')}>
                  <div className="cp-inv-meta">
                    <div className="cp-inv-num">{inv.num}</div>
                    <div className="cp-inv-date">{inv.date}</div>
                  </div>
                  <div className="cp-inv-right">
                    <div className="cp-inv-amount">{inv.amount}</div>
                    <span className={`cp-status-pill ${inv.statusClass}`}>{inv.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="cp-card-footer">
              <span>Showing 1 to 5 of 24 invoices</span>
            </div>
          </div>

        </div>

        {/* ===== COLUMN 4: QUICK ACTIONS ===== */}
        <div className="cp-column">
          <div className="cp-card">
            <div className="cp-card-header">
              <h2 className="cp-card-title">QUICK ACTIONS</h2>
            </div>

            <div className="cp-quick-actions">
              {[
                {
                  iconClass: 'action-blue',
                  title: 'Create New Booking',
                  sub: 'Request a new load or transport',
                  onClick: () => navigate('/customer/create-booking'),
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                },
                {
                  iconClass: 'action-green',
                  title: 'Track a Load',
                  sub: 'Track your active loads in real-time',
                  onClick: () => showToastMsg('Opening load tracker...'),
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                },
                {
                  iconClass: 'action-amber',
                  title: 'Make a Payment',
                  sub: 'Pay outstanding invoices securely',
                  onClick: () => navigate('/customer/invoices-payments'),
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                },
                {
                  iconClass: 'action-purple',
                  title: 'Download Statement',
                  sub: 'Download your account statement',
                  onClick: () => showToastMsg('Generating and downloading account statement...'),
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                },
                {
                  iconClass: 'action-cyan',
                  title: 'Contact Support',
                  sub: 'Get help from our team',
                  onClick: () => setShowSupportModal(true),
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                },
              ].map(action => (
                <button key={action.title} className="cp-action-btn" onClick={action.onClick}>
                  <div className={`cp-action-icon ${action.iconClass}`}>
                    {action.icon}
                  </div>
                  <div className="cp-action-text">
                    <div className="cp-action-title">{action.title}</div>
                    <div className="cp-action-sub">{action.sub}</div>
                  </div>
                  <div className="cp-action-arrow">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* =========== DEVELOPER NOTES BANNER =========== */}
      <div className="cp-dev-notes-card">
        <div className="cp-dev-header">
          <span className="cp-dev-code-icon">&lt;/&gt;</span>
          <span className="cp-dev-title">DEVELOPER NOTES – CUSTOMER PORTAL DASHBOARD</span>
        </div>
        <div className="cp-dev-grid">
          {[
            { title: '1. PURPOSE', items: ['Provide customers with a real-time overview.', 'Show key metrics, loads, invoices and updates.', 'Improve visibility and customer experience.'] },
            { title: '2. KEY FEATURES', items: ['Summary cards with real-time data.', 'Quick access to loads, invoices and documents.', 'Recent activity and upcoming deliveries.', 'Quick actions for common tasks.'] },
            { title: '3. DATA SOURCES', items: ['Loads, Invoices, Payments, Documents.', 'Real-time data from operational modules.', 'Customer-specific data only.'] },
            { title: '4. SECURITY & ACCESS', items: ['Customers see only their own data.', 'Role-based access for portal users.', 'Secure API endpoints and data filters.'] },
            { title: '5. PERFORMANCE', items: ['Dashboard loads under 2 seconds.', 'Use caching for summary cards.', 'Auto-refresh summary data every 5 minutes.'] },
          ].map(col => (
            <div key={col.title} className="cp-dev-col">
              <h4 className="cp-dev-col-title">{col.title}</h4>
              <ul className="cp-dev-list">
                {col.items.map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>



      {/* =========== SUPPORT TICKET MODAL =========== */}
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
                  <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Shipment update delay" className="cp-input" required />
                </div>
                <div className="cp-form-group">
                  <label className="cp-form-label">PROBLEM DESCRIPTION</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Please provide specific details..." className="cp-textarea" required />
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

      {/* =========== TOAST NOTIFICATION =========== */}
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
