import React from 'react';
import './CustomerDashboard.css';

const CustomerDashboard = () => (
  <div className="customer-dashboard">
    <div className="customer-header-container">
      <div>
        <h1 className="customer-title">Customer Shipper Portal &bull; Overview</h1>
        <p className="customer-subtitle">Request load deliveries, audit invoices, download BOL papers, and track active route paths.</p>
      </div>
      <button className="contact-support-btn">Contact Support</button>
    </div>
    <div className="stats-grid stats-5">
      <div className="stat-card"><div className="stat-title">ACTIVE TRANSITS</div><div className="stat-value">0</div><div className="stat-footer"><span className="footer-left">Live GPS tracking coordi...</span><span className="footer-right dark">1 in<br/>transit</span></div></div>
      <div className="stat-card"><div className="stat-title">COMPLETED RUNS</div><div className="stat-value">1</div><div className="stat-footer"><span className="footer-left">Signed POD manifests</span><span className="footer-right green">No issues</span></div></div>
      <div className="stat-card"><div className="stat-title">AWAITING MATCH</div><div className="stat-value">0</div><div className="stat-footer"><span className="footer-left">Dispatcher queue pe...</span><span className="footer-right grey">Awaiting<br/>carrier</span></div></div>
      <div className="stat-card"><div className="stat-title">LEDGER BALANCE DUE</div><div className="stat-value">$0</div><div className="stat-footer"><span className="footer-left">Invoices outstanding bills Net 30 terms</span></div></div>
      <div className="stat-card"><div className="stat-title">TOTAL LOADS SHIPPED</div><div className="stat-value">4</div><div className="stat-footer"><span className="footer-left">All-time lifetime booki...</span><span className="footer-right green">Lifetime<br/>total</span></div></div>
    </div>
    <div className="map-section">
      <h2 className="map-title">Live Shipment Path Progress</h2>
      <p className="map-subtitle">Google map tracking dashboard.</p>
      <div className="map-placeholder"><div className="map-dot"></div></div>
    </div>
  </div>
);

export default CustomerDashboard;
