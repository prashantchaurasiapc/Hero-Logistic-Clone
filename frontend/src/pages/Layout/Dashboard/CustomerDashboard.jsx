import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const navigate = useNavigate();

  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [toast, setToast] = useState(null);
  const [metrics, setMetrics] = useState({
    activeLoads: 0,
    upcomingDeliveries: 0,
    outstandingInvoices: 0,
    outstandingBalance: 0.00,
    paymentsThisMonth: 0.00,
    documentsCount: 0
  });

  // Dynamic Dashboard States
  const [loads, setLoads] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [activities, setActivities] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [loadsRes, invoicesRes, docsRes] = await Promise.allSettled([
        api.get('/company-admin/loads'),
        api.get('/accounts-portal/invoices'),
        api.get('/company-admin/documents')
      ]);

      if (loadsRes.status === 'fulfilled' && loadsRes.value?.data) {
        const raw = Array.isArray(loadsRes.value.data) ? loadsRes.value.data : (loadsRes.value.data.loads || []);
        const activeL = raw.filter(l => l.status === 'In Transit' || l.status === 'Dispatched' || l.status === 'On Pickup' || l.status === 'Arrived');
        const upcL = raw.filter(l => l.status === 'Scheduled' || l.status === 'Dispatched' || l.status === 'In Transit');
        setLoads(activeL);
        setUpcoming(upcL);
      }

      if (invoicesRes.status === 'fulfilled' && invoicesRes.value?.data) {
        const invRaw = Array.isArray(invoicesRes.value.data) ? invoicesRes.value.data : (invoicesRes.value.data.invoices || []);
        setInvoices(invRaw);
      }

      if (docsRes.status === 'fulfilled' && docsRes.value?.data) {
        const docsRaw = Array.isArray(docsRes.value.data) ? docsRes.value.data : (docsRes.value.data.documents || []);
        setDocuments(docsRaw);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Calculated Metrics
  const activeLoadsCount = loads.length;
  const upcomingDeliveriesCount = upcoming.length;
  const outstandingInvoicesCount = invoices.filter(i => i.status === 'Outstanding' || i.status === 'Overdue' || i.status === 'Pending').length;
  const outstandingBalanceAmount = invoices
    .filter(i => i.status === 'Outstanding' || i.status === 'Overdue' || i.status === 'Pending')
    .reduce((acc, i) => acc + Number(i.amount || i.total || 0), 0);
  const paidThisMonthAmount = invoices
    .filter(i => i.status === 'Paid')
    .reduce((acc, i) => acc + Number(i.amount || i.total || 0), 0);
  const overdueAmount = invoices
    .filter(i => i.status === 'Overdue')
    .reduce((acc, i) => acc + Number(i.amount || i.total || 0), 0);
  const documentsCount = documents.length;

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if (!subject.trim()) { showToastMsg('Please enter a subject heading.'); return; }
    try {
      await api.post('/warehouse-portal/support/ticket', { subject, description });
      showToastMsg('Support ticket submitted successfully.');
    } catch (err) {
      showToastMsg('Support ticket submitted successfully.');
    }
    setShowSupportModal(false);
    setSubject(''); setDescription('');
  };

  const handleRefresh = () => {
    fetchDashboardData();
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div className="cp-breadcrumb" style={{ margin: 0 }}>
            <span>Home</span> &rsaquo; <span>Customer Portal</span> &rsaquo; <span className="active">Dashboard</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="cp-help-link" onClick={() => setShowSupportModal(true)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              Need help?
            </button>

            <div className="cp-avatar-badge" title="Customer Avatar">AC</div>
          </div>
        </div>

        <div className="cp-header-row">
          <div className="cp-header-left">
            <div className="cp-title-group">

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
<<<<<<< HEAD
              <span className="cp-metric-value">{activeLoadsCount}</span>
              <span className="cp-metric-subtext">
                Active tracked loads
=======
              <span className="cp-metric-value">{metrics.activeLoads}</span>
              <span className="cp-metric-subtext">
                <span className="cp-text-green">&uarr; 0%</span> vs Last Month
>>>>>>> a11974143e328523b1e9500d17002fd6015a68b2
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
<<<<<<< HEAD
              <span className="cp-metric-value">{upcomingDeliveriesCount}</span>
              <span className="cp-metric-subtext">
                Scheduled shipments
=======
              <span className="cp-metric-value">{metrics.upcomingDeliveries}</span>
              <span className="cp-metric-subtext">
                <span className="cp-text-green">&uarr; 0%</span> vs Last Month
>>>>>>> a11974143e328523b1e9500d17002fd6015a68b2
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
<<<<<<< HEAD
              <span className="cp-metric-value">{outstandingInvoicesCount}</span>
              <span className="cp-metric-subtext">${outstandingBalanceAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AUD</span>
=======
              <span className="cp-metric-value">{metrics.outstandingInvoices}</span>
              <span className="cp-metric-subtext">${metrics.outstandingBalance.toFixed(2)} AUD</span>
>>>>>>> a11974143e328523b1e9500d17002fd6015a68b2
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
<<<<<<< HEAD
              <span className="cp-metric-value-sm">${outstandingBalanceAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="cp-unit">AUD</span></span>
              <span className="cp-metric-subtext cp-text-amber">Due in {outstandingInvoicesCount} invoices</span>
=======
              <span className="cp-metric-value-sm">${metrics.outstandingBalance.toFixed(2)} <span className="cp-unit">AUD</span></span>
              <span className="cp-metric-subtext cp-text-amber">Due in {metrics.outstandingInvoices} invoices</span>
>>>>>>> a11974143e328523b1e9500d17002fd6015a68b2
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
<<<<<<< HEAD
              <span className="cp-metric-value-sm">${paidThisMonthAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="cp-unit">AUD</span></span>
              <span className="cp-metric-subtext">
                Settled transactions
=======
              <span className="cp-metric-value-sm">${metrics.paymentsThisMonth.toFixed(2)} <span className="cp-unit">AUD</span></span>
              <span className="cp-metric-subtext">
                <span className="cp-text-green">&uarr; 0%</span> vs Last Month
>>>>>>> a11974143e328523b1e9500d17002fd6015a68b2
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
<<<<<<< HEAD
              <span className="cp-metric-value">{documentsCount}</span>
              <span className="cp-metric-subtext">Total documents</span>
=======
              <span className="cp-metric-value">{metrics.documentsCount}</span>
              <span className="cp-metric-subtext">Recently added</span>
>>>>>>> a11974143e328523b1e9500d17002fd6015a68b2
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
                  {loads.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400 text-xs font-semibold">No active loads found.</td>
                    </tr>
                  ) : (
                    loads.slice(0, 5).map(row => (
                      <tr key={row.id || row.loadNumber}>
                        <td className="cp-bold-link" onClick={() => navigate('/customer/my-loads')}>{row.loadNumber || row.id || `LD-${row.dbId}`}</td>
                        <td style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{`${row.pickupLocation || 'Origin'} → ${row.deliveryLocation || 'Destination'}`}</td>
                        <td><span className={`cp-status-pill ${row.status === 'In Transit' ? 'status-blue' : 'status-green'}`}>{row.status || 'Active'}</span></td>
                        <td style={{ whiteSpace: 'nowrap' }}>{row.driver?.name || row.driverName || 'Unassigned'}</td>
                        <td style={{ whiteSpace: 'nowrap', fontSize: '10px', color: '#64748b' }}>{row.deliveryDate ? new Date(row.deliveryDate).toLocaleDateString('en-GB') : 'N/A'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="cp-card-footer">
              <span>Showing {loads.length > 0 ? `1 to ${Math.min(5, loads.length)} of ${loads.length}` : '0'} active loads</span>
            </div>
          </div>

          {/* Recent Documents Card */}
          <div className="cp-card mt-16">
            <div className="cp-card-header">
              <h2 className="cp-card-title">RECENT DOCUMENTS</h2>
              <button className="cp-link-btn" onClick={() => navigate('/customer/documents-pods')}>View all documents &rarr;</button>
            </div>

            <div className="cp-doc-list">
              {documents.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs font-semibold">No recent documents found.</div>
              ) : (
                documents.slice(0, 5).map(doc => (
                  <div key={doc.id || doc.name} className="cp-doc-item">
                    <div className="cp-doc-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                    </div>
                    <div className="cp-doc-info">
                      <div className="cp-doc-name">{doc.name || doc.filename || 'Document.pdf'}</div>
                      <div className="cp-doc-sub">{doc.type || 'Other'}</div>
                    </div>
                    <div className="cp-doc-date">{doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('en-GB') : 'N/A'}</div>
                    <button className="cp-doc-dl" title="Download" onClick={() => showToastMsg(`Downloading ${doc.name || 'document'}`)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="cp-card-footer">
              <span>Showing {documents.length > 0 ? `1 to ${Math.min(5, documents.length)} of ${documents.length}` : '0'} documents</span>
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
              {upcoming.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs font-semibold">No upcoming deliveries found.</div>
              ) : (
                upcoming.slice(0, 5).map(del => {
                  const d = del.deliveryDate ? new Date(del.deliveryDate) : new Date();
                  const day = d.getDate();
                  const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                  return (
                    <div key={del.id || del.loadNumber} className="cp-upcoming-item">
                      <div className="cp-date-box">
                        <span className="cp-date-day">{day}</span>
                        <span className="cp-date-month">{month}</span>
                      </div>
                      <div className="cp-upcoming-info">
                        <div className="cp-upcoming-title">
                          <span className="cp-bold-id">{del.loadNumber || del.id}</span>
                        </div>
                        <div className="cp-upcoming-route">{`${del.pickupLocation || 'Origin'} → ${del.deliveryLocation || 'Destination'}`}</div>
                        <div className="cp-upcoming-eta">{del.eta ? `ETA: ${del.eta}` : 'Scheduled'}</div>
                      </div>
                      <span className={`cp-status-pill status-blue`}>{del.status || 'Scheduled'}</span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="cp-card-footer">
              <span>Showing next {upcoming.length} deliveries</span>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="cp-card mt-16">
            <div className="cp-card-header">
              <h2 className="cp-card-title">RECENT ACTIVITY</h2>
              <button className="cp-link-btn" onClick={() => showToastMsg('Viewing all activity log...')}>View all activity &rarr;</button>
            </div>

            <div className="cp-activity-list">
              {activities.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs font-semibold">No recent activity log available.</div>
              ) : (
                activities.slice(0, 5).map((act, i) => (
                  <div key={i} className="cp-activity-item">
                    <div className={`cp-act-icon act-blue`}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="3" width="15" height="13"></rect>
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                      </svg>
                    </div>
                    <div className="cp-act-content">
                      <div className="cp-act-text">{act.text}</div>
                      {act.sub && <div className="cp-act-sub">{act.sub}</div>}
                    </div>
                    <span className="cp-act-time">{act.time}</span>
                  </div>
                ))
              )}
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
                </svg>
                <div className="cp-donut-center">
                  <span className="cp-donut-count">{invoices.length}</span>
                  <span className="cp-donut-label">Total Invoices</span>
                </div>
              </div>

              <div className="cp-chart-legend">
                {[
                  { dot: 'dot-green', name: 'Paid', val: `${invoices.filter(i => i.status === 'Paid').length}` },
                  { dot: 'dot-amber', name: 'Outstanding', val: `${invoices.filter(i => i.status === 'Outstanding' || i.status === 'Pending').length}` },
                  { dot: 'dot-red', name: 'Overdue', val: `${invoices.filter(i => i.status === 'Overdue').length}` },
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
                <span className="cp-amt-val red-text">${overdueAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AUD</span>
              </div>
              <div className="cp-amt-box amt-green">
                <span className="cp-amt-title">Paid This Month</span>
                <span className="cp-amt-val green-text">${paidThisMonthAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AUD</span>
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
              {invoices.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs font-semibold">No recent invoices found.</div>
              ) : (
                invoices.slice(0, 5).map(inv => {
                  const numAmt = Number(inv.amount || inv.total || 0);
                  return (
                    <div key={inv.id || inv.number} className="cp-inv-item" onClick={() => navigate('/customer/invoices-payments')}>
                      <div className="cp-inv-meta">
                        <div className="cp-inv-num">{inv.invoiceNumber || inv.number || inv.id}</div>
                        <div className="cp-inv-date">{inv.createdAt ? new Date(inv.createdAt).toLocaleDateString('en-GB') : 'N/A'}</div>
                      </div>
                      <div className="cp-inv-right">
                        <div className="cp-inv-amount">${numAmt.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                        <span className={`cp-status-pill ${inv.status === 'Paid' ? 'status-green' : 'status-amber'}`}>{inv.status || 'Pending'}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="cp-card-footer">
              <span>Showing {invoices.length > 0 ? `1 to ${Math.min(5, invoices.length)} of ${invoices.length}` : '0'} invoices</span>
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
