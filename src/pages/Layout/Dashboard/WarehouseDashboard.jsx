import React from 'react';
import { FiPlus, FiDownload } from 'react-icons/fi';
import { BsQrCodeScan } from 'react-icons/bs';
import './WarehouseDashboard.css';

const WarehouseDashboard = () => (
  <div className="warehouse-dashboard">
    <div className="warehouse-header">
      <div className="warehouse-header-titles">
        <h1>Warehouse & Yard Workspace</h1>
        <p>Manage stock allocations, print asset tags, and spot load lanes.</p>
      </div>
      <div className="warehouse-header-actions">
        <button className="btn btn-yellow-wh">Car Carrying Yard</button>
        <button className="btn btn-white-wh">General Freight</button>
        <button className="btn btn-white-wh with-icon"><BsQrCodeScan /> Barcode Simulator</button>
        <button className="btn btn-white-yellow-wh with-icon"><FiPlus /> Manual Entry</button>
        <button className="btn btn-yellow-wh with-icon"><FiDownload /> Export Stock List</button>
      </div>
    </div>

    <div className="stats-grid stats-4">
      <div className="stat-card">
        <div className="stat-card-title">TOTAL STORED ASSETS</div>
        <div className="stat-card-value">4</div>
        <div className="stat-card-footer">
          <span className="footer-left">In active yard segregation</span>
          <span className="footer-right text-green">+3 new</span>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-card-title">OCCUPANCY LEVEL</div>
        <div className="stat-card-value">78%</div>
        <div className="progress-container">
          <div className="progress-bar"><div className="progress-fill" style={{ width: '78%' }}></div></div>
          <div className="progress-text">78%</div>
        </div>
        <div className="stat-card-footer">
          <span className="footer-left">Segregation capacity</span>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-card-title">LANES SPOTTED</div>
        <div className="stat-card-value">5 active</div>
        <div className="stat-card-footer">
          <span className="footer-left">Loading bay limits</span>
          <span className="footer-right">Normal</span>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-card-title">PENDING DISPATCHES</div>
        <div className="stat-card-value">3 Trucks</div>
        <div className="stat-card-footer">
          <span className="footer-left">Trailer staging queue</span>
          <span className="footer-right">3 ready</span>
        </div>
      </div>
    </div>

    <div className="warehouse-bottom-section">
      <h3 className="section-title">Zone Allocations & Limits</h3>
      <div className="zone-content">
        <div className="zone-cards">
          <div className="zone-card green-zone"><div className="zone-card-title">LANE A (PICKUP)</div><div className="zone-card-value">92%</div></div>
          <div className="zone-card green-zone"><div className="zone-card-title">LANE B (STAGING)</div><div className="zone-card-value">84%</div></div>
          <div className="zone-card yellow-zone"><div className="zone-card-title">HOLDING AREAS</div><div className="zone-card-value">45%</div></div>
          <div className="zone-card orange-zone"><div className="zone-card-title">BUNKER STORAGE</div><div className="zone-card-value">15%</div></div>
        </div>
        <div className="zone-chart-container">
          <div className="zone-chart-title">CAPACITY ALLOCATION</div>
          <div className="doughnut-chart"></div>
          <div className="chart-legend">
            <span className="legend-item"><span className="dot dot-red"></span>Bunker</span>
            <span className="legend-item"><span className="dot dot-yellow"></span>Holding</span>
            <span className="legend-item"><span className="dot dot-blue"></span>Lane A</span>
            <span className="legend-item"><span className="dot dot-green"></span>Lane B</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default WarehouseDashboard;
