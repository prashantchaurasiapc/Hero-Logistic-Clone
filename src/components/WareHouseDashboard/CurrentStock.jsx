import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, Filter, QrCode, ArrowRightLeft, Eye, 
  ChevronDown, Maximize2, X, MapPin, Tag, FileText, User, 
  Calendar, Package, History, ExternalLink, CheckCircle2, Clock, Grid, List
} from 'lucide-react';

/* Mock stock data matching Screenshot 2 exactly */
const initialStockItems = [
  {
    id: '1',
    itemNo: 'ABC123',
    title: 'Toyota Camry',
    rego: 'ABC123',
    vin: 'JTDBE32K203456789',
    type: 'Vehicle',
    typeBadge: 'Car Carrying',
    typeColor: 'blue',
    location: 'Yard A',
    locationDetail: 'Yard A / R4 / B12 / P01',
    rowBayPos: 'Row 4 / Bay 12 / Position 01',
    status: 'In Storage',
    statusColor: 'green',
    loadJob: 'LD-3987',
    loadDetail: 'Load Lane 4',
    customer: 'ABC Motors',
    updated: '10:15 AM 21/07/2026',
    receivedDate: '19/07/2026 09:15 AM',
    condition: 'Good',
    notes: '-',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=400&q=80',
    iconType: 'car'
  },
  {
    id: '2',
    itemNo: 'DEF456',
    title: 'Mazda 3',
    rego: 'DEF456',
    vin: 'JM0BL10F200123456',
    type: 'Vehicle',
    typeBadge: 'Car Carrying',
    typeColor: 'blue',
    location: 'Yard A',
    locationDetail: 'Yard A / Load Lane 4',
    rowBayPos: 'Load Lane 4 / Position 02',
    status: 'Staged',
    statusColor: 'blue',
    loadJob: 'LD-3987',
    loadDetail: 'Load Lane 4',
    customer: 'ABC Motors',
    updated: '09:42 AM 21/07/2026',
    receivedDate: '18/07/2026 02:30 PM',
    condition: 'Good',
    notes: 'Prioritized for load LD-3987',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80',
    iconType: 'car'
  },
  {
    id: '3',
    itemNo: 'GHI789',
    title: 'Honda Accord',
    rego: 'GHI789',
    vin: '1HGCM82633A123456',
    type: 'Vehicle',
    typeBadge: 'Car Carrying',
    typeColor: 'blue',
    location: 'Yard B',
    locationDetail: 'Yard B / R1 / B03 / P02',
    rowBayPos: 'Row 1 / Bay 03 / Position 02',
    status: 'Ready',
    statusColor: 'green-outline',
    loadJob: 'LD-3986',
    loadDetail: 'Load Lane 3',
    customer: 'XYZ Imports',
    updated: '08:55 AM 21/07/2026',
    receivedDate: '17/07/2026 11:00 AM',
    condition: 'Good',
    notes: 'Inspection cleared',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=400&q=80',
    iconType: 'car'
  },
  {
    id: '4',
    itemNo: 'EL-1001',
    title: 'Pallet - Electrical Parts',
    sku: 'SKU: EL-1001',
    barcode: 'Barcode: 9345678901234',
    type: 'Pallet',
    typeBadge: 'General Freight',
    typeColor: 'green',
    location: 'Warehouse 1',
    locationDetail: 'Warehouse 1 / Aisle 12 / Bay 5',
    rowBayPos: 'Aisle 12 / Bay 5',
    status: 'In Storage',
    statusColor: 'green',
    loadJob: 'LD-3921',
    loadDetail: 'Warehouse Rack 4',
    customer: 'Tech Supplies',
    updated: '10:05 AM 21/07/2026',
    receivedDate: '20/07/2026 08:00 AM',
    condition: 'Intact',
    notes: 'Fragile electronics',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
    iconType: 'pallet'
  },
  {
    id: '5',
    itemNo: 'MG-2044',
    title: 'Carton - Mixed Goods',
    sku: 'SKU: MG-2044',
    barcode: 'Barcode: 9345578905678',
    type: 'Carton',
    typeBadge: 'General Freight',
    typeColor: 'green',
    location: 'Warehouse 1',
    locationDetail: 'Warehouse 1 / Aisle 05 / Bay 2',
    rowBayPos: 'Aisle 05 / Bay 2',
    status: 'To Move',
    statusColor: 'orange',
    loadJob: '-',
    loadDetail: 'Unassigned',
    customer: 'Retail Hub',
    updated: 'Yesterday 3:20 PM',
    receivedDate: '19/07/2026 04:45 PM',
    condition: 'Good',
    notes: 'Pending aisle reorganization',
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=400&q=80',
    iconType: 'carton'
  },
  {
    id: '6',
    itemNo: 'DG-200L',
    title: 'UN1203 - Petrol 200L Drum',
    sku: 'UN1203',
    barcode: 'Barcode: 9345678909999',
    type: 'DG Item',
    typeBadge: 'Dangerous Goods',
    typeColor: 'red',
    location: 'DG Store',
    locationDetail: 'DG Store / Zone A / Bay 03',
    rowBayPos: 'Zone A / Bay 03',
    status: 'In Storage',
    statusColor: 'green',
    loadJob: 'LD-3940',
    loadDetail: 'DG Transport Unit',
    customer: 'Fuel Co',
    updated: '10:10 AM 21/07/2026',
    receivedDate: '15/07/2026 10:30 AM',
    condition: 'Sealed & Compliant',
    notes: 'Flammable liquid class 3',
    image: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=400&q=80',
    iconType: 'dg'
  },
  {
    id: '7',
    itemNo: 'CONT-MSCU1234567',
    title: '20ft Container',
    sku: 'CONT-MSCU1234567',
    barcode: 'MSCU1234567',
    type: 'Container',
    typeBadge: 'Container',
    typeColor: 'purple',
    location: 'Yard C',
    locationDetail: 'Yard C / Stack 2 / Slot 4',
    rowBayPos: 'Stack 2 / Slot 4',
    status: 'Staged',
    statusColor: 'blue',
    loadJob: 'LD-3951',
    loadDetail: 'Port Run',
    customer: 'Oceanic Freight',
    updated: '08:30 AM 21/07/2026',
    receivedDate: '14/07/2026 01:15 PM',
    condition: 'Locked & Sealed',
    notes: 'Export container',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=400&q=80',
    iconType: 'container'
  }
];

export default function CurrentStock() {
  const navigate = useNavigate();
  const location = useLocation();
  const isYard = location.pathname ? location.pathname.startsWith('/yard') : false;

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedLoad, setSelectedLoad] = useState('All Loads');
  const [selectedCustomer, setSelectedCustomer] = useState('All Customers');
  const [dateRange, setDateRange] = useState('');
  const [selectedZone, setSelectedZone] = useState('All Zones');
  const [selectedRow, setSelectedRow] = useState('All Rows');
  const [selectedBay, setSelectedBay] = useState('All Bays');
  const [selectedStaging, setSelectedStaging] = useState('All Staging Areas');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(true);
  const [viewMode, setViewMode] = useState('list');

  // Selection & Details panel state
  const [selectedItem, setSelectedItem] = useState(initialStockItems[0]);
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);

  // Modals state
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [targetLocation, setTargetLocation] = useState('Yard A / Row 2 / Bay 05');
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [scannerModalOpen, setScannerModalOpen] = useState(false);

  // Reset all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedType('All Types');
    setSelectedLocation('All Locations');
    setSelectedStatus('All Statuses');
    setSelectedLoad('All Loads');
    setSelectedCustomer('All Customers');
    setDateRange('');
    setSelectedZone('All Zones');
    setSelectedRow('All Rows');
    setSelectedBay('All Bays');
    setSelectedStaging('All Staging Areas');
  };

  // Filter items matching search & dropdowns
  const filteredItems = initialStockItems.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      item.title.toLowerCase().includes(q) ||
      item.itemNo.toLowerCase().includes(q) ||
      (item.vin && item.vin.toLowerCase().includes(q)) ||
      (item.rego && item.rego.toLowerCase().includes(q)) ||
      (item.barcode && item.barcode.toLowerCase().includes(q)) ||
      (item.sku && item.sku.toLowerCase().includes(q)) ||
      item.customer.toLowerCase().includes(q) ||
      item.locationDetail.toLowerCase().includes(q) ||
      item.loadJob.toLowerCase().includes(q)
    );

    const matchesType = selectedType === 'All Types' || item.type === selectedType;
    const matchesLocation = selectedLocation === 'All Locations' || item.location === selectedLocation;
    const matchesStatus = selectedStatus === 'All Statuses' || item.status === selectedStatus;
    const matchesLoad = selectedLoad === 'All Loads' || item.loadJob === selectedLoad;
    const matchesCustomer = selectedCustomer === 'All Customers' || item.customer === selectedCustomer;

    return matchesSearch && matchesType && matchesLocation && matchesStatus && matchesLoad && matchesCustomer;
  });

  return (
    <div className="wh-panel-root wh-light">
      
      {/* ── EMBEDDED DIRECT CSS INSIDE JSX ── */}
      <style>{`
        .wh-panel-root {
          min-height: 100vh;
          font-family: 'Inter', 'Outfit', system-ui, -apple-system, sans-serif;
          padding: 0 0 32px 0;
          box-sizing: border-box;
        }

        .wh-light { background-color: #F8FAFC; color: #0F172A; }
        .wh-dark { background-color: #0B0F19; color: #F8FAFC; }

        .wh-stock-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px 14px 24px;
        }

        .wh-stock-main-title {
          font-size: 20px;
          font-weight: 900;
          color: #0F172A;
          text-transform: uppercase;
          letter-spacing: -0.3px;
          margin: 0;
        }

        .wh-stock-top-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .wh-btn-secondary {
          height: 38px;
          padding: 0 16px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
        }

        .wh-btn-secondary:hover {
          background: #F8FAFC;
          border-color: #CBD5E1;
          color: #0F172A;
        }

        .wh-btn-yellow {
          height: 38px;
          padding: 0 18px;
          background: #FFD400;
          border: none;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 800;
          color: #0F172A;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 2px 8px rgba(255, 212, 0, 0.25);
          transition: all 0.15s ease;
        }

        .wh-btn-yellow:hover {
          background: #E6BF00;
          transform: translateY(-1px);
        }

        .wh-stock-master-grid {
          display: flex;
          gap: 16px;
          padding: 0 24px 24px 24px;
          align-items: stretch;
        }

        .wh-stock-left-col {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .wh-stock-right-col {
          width: 265px;
          flex-shrink: 0;
        }

        .wh-stock-filter-card {
          margin: 0;
          padding: 16px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .wh-stock-search-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .wh-stock-search-input-wrap {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
        }

        .wh-stock-search-icon {
          position: absolute;
          left: 14px;
          color: #94A3B8;
          pointer-events: none;
        }

        .wh-stock-search-input {
          width: 100%;
          height: 40px;
          border-radius: 10px;
          border: 1px solid #E2E8F0;
          padding: 0 36px 0 42px;
          font-size: 12.5px;
          font-weight: 500;
          outline: none;
          background: #FFFFFF;
          color: #0F172A;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
          transition: all 0.15s ease;
          box-sizing: border-box;
        }

        .wh-stock-search-input:focus {
          border-color: #FFD400;
          box-shadow: 0 0 0 3px rgba(255, 212, 0, 0.2);
        }

        .wh-stock-clear-input-btn {
          position: absolute;
          right: 12px;
          background: transparent;
          border: none;
          color: #94A3B8;
          cursor: pointer;
        }

        .wh-stock-filter-toggle-btn {
          height: 40px;
          padding: 0 16px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .wh-stock-filter-toggle-btn.active,
        .wh-stock-filter-toggle-btn:hover {
          background: #FFFFFF;
          border-color: #FFD400;
          color: #0F172A;
        }

        .wh-stock-filter-toggle-btn .arrow { transition: transform 0.2s ease; }
        .wh-stock-filter-toggle-btn .arrow.rotate { transform: rotate(180deg); }

        .wh-stock-dropdowns-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-top: 10px;
          border-top: 1px solid #F1F5F9;
        }

        .wh-stock-dropdowns-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }

        .wh-filter-group { display: flex; flex-direction: column; gap: 4px; }
        .wh-filter-group label {
          font-size: 10px;
          font-weight: 800;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .wh-filter-group select {
          height: 38px;
          border-radius: 8px;
          border: 1px solid #E2E8F0;
          padding: 0 12px;
          font-size: 12px;
          font-weight: 700;
          color: #0F172A;
          width: 100%;
          background: #F8FAFC;
          outline: none;
          cursor: pointer;
          box-sizing: border-box;
        }

        .wh-date-input {
          height: 38px;
          border-radius: 8px;
          border: 1px solid #E2E8F0;
          padding: 0 12px;
          font-size: 12px;
          font-weight: 600;
          color: #0F172A;
          width: 100%;
          background: #F8FAFC;
          outline: none;
          box-sizing: border-box;
        }

        .wh-stock-results-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 4px;
        }

        .wh-results-count { font-size: 12px; color: #64748B; }
        .wh-results-count strong { color: #0F172A; }
        .wh-results-controls { display: flex; align-items: center; gap: 16px; }

        .wh-sort-wrap { display: flex; align-items: center; gap: 8px; font-size: 12px; }
        .sort-label { color: #64748B; font-weight: 600; }
        .wh-sort-select {
          padding: 5px 12px;
          border-radius: 8px;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          font-size: 12px;
          font-weight: 700;
          color: #0F172A;
          outline: none;
          cursor: pointer;
        }

        .wh-view-mode-toggle {
          display: flex;
          background: #F1F5F9;
          border-radius: 8px;
          padding: 2px;
          gap: 2px;
        }

        .wh-view-mode-toggle .view-btn {
          border: none;
          background: transparent;
          padding: 6px;
          border-radius: 6px;
          color: #64748B;
          cursor: pointer;
        }

        .wh-view-mode-toggle .view-btn.active {
          background: #FFFFFF;
          color: #0F172A;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .wh-stock-table-card {
          flex: 1;
          min-width: 0;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
        }

        .wh-stock-table-wrap { overflow-x: auto; }
        .wh-stock-data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 11.5px;
        }

        .wh-stock-data-table th {
          padding: 10px 14px;
          font-size: 9.5px;
          font-weight: 800;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          background-color: #F8FAFC;
          border-bottom: 1px solid #E2E8F0;
          white-space: nowrap;
        }

        .wh-stock-data-table td {
          padding: 10px 14px;
          vertical-align: middle;
          border-bottom: 1px solid #F1F5F9;
          color: #334155;
          white-space: nowrap;
        }

        .wh-stock-data-table tr { cursor: pointer; }
        .wh-stock-data-table tr:hover { background-color: #F8FAFC; }
        .wh-stock-data-table tr.selected-row {
          background-color: #FEFCE8;
          border-left: 3px solid #FFD400;
        }

        .wh-empty-stock-td { text-align: center; padding: 32px; color: #94A3B8; font-size: 12px; }

        .wh-item-cell { display: flex; align-items: center; gap: 12px; }
        .wh-item-thumb {
          width: 44px;
          height: 36px;
          border-radius: 8px;
          background: #F1F5F9;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid #E2E8F0;
        }

        .thumb-car-img { width: 100%; height: 100%; object-fit: cover; }
        .wh-item-text { display: flex; flex-direction: column; }
        .wh-item-title { font-weight: 800; color: #0F172A; font-size: 12px; }
        .wh-item-sub { display: flex; align-items: center; gap: 8px; font-size: 10px; color: #64748B; margin-top: 1px; }
        .bold-sub { font-weight: 800; color: #0F172A; }
        .vin-tag { color: #64748B; font-family: monospace; }

        .wh-type-cell { display: flex; flex-direction: column; gap: 3px; }
        .type-row { display: flex; align-items: center; gap: 6px; }
        .type-icon { font-size: 13px; }
        .wh-type-name { font-weight: 700; font-size: 11px; color: #0F172A; }

        .wh-type-badge {
          display: inline-block;
          padding: 1px 6px;
          border-radius: 4px;
          font-size: 9.5px;
          font-weight: 800;
          width: fit-content;
        }

        .badge-blue { background: #DBEAFE; color: #1D4ED8; }
        .badge-green { background: #DCFCE7; color: #15803D; }
        .badge-orange { background: #FFEDD5; color: #C2410C; }
        .badge-red { background: #FEE2E2; color: #B91C1C; }
        .badge-purple { background: #F3E8FF; color: #6B21A8; }

        .wh-location-cell { display: flex; flex-direction: column; gap: 2px; }
        .wh-loc-main { font-weight: 800; color: #0F172A; }
        .wh-loc-sub { font-size: 10px; color: #64748B; }

        .wh-status-badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 10.5px;
          font-weight: 800;
        }

        .badge-green-outline { border: 1.5px solid #10B981; color: #10B981; background: transparent; }

        .wh-load-cell { display: flex; flex-direction: column; gap: 2px; }
        .load-num { font-weight: 800; color: #0F172A; }
        .load-sub { font-size: 10px; color: #64748B; }

        .wh-customer-name { font-weight: 700; color: #334155; }
        .wh-updated-time { font-size: 10.5px; color: #64748B; }

        .wh-view-row-btn {
          padding: 4px 14px;
          border-radius: 6px;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
        }

        .wh-view-row-btn:hover { background: #FFD400; color: #0F172A; border-color: #FFD400; }

        .wh-stock-right-col .wh-item-details-drawer {
          width: 100%;
          height: 100%;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
        }

        .wh-drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px;
          border-bottom: 1px solid #F1F5F9;
          background: #FFFFFF;
        }

        .wh-drawer-title {
          font-size: 11.5px;
          font-weight: 900;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: #0F172A;
          margin: 0;
        }

        .wh-drawer-actions { display: flex; align-items: center; gap: 6px; }

        .wh-drawer-icon-btn {
          background: transparent;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .wh-drawer-hero {
          padding: 16px;
          background: #F8FAFC;
          border-bottom: 1px solid #E2E8F0;
        }

        .wh-drawer-img-box {
          width: 100%;
          height: 160px;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 12px;
          background: #E2E8F0;
          border: 1px solid #CBD5E1;
        }

        .wh-drawer-img-box img { width: 100%; height: 100%; object-fit: cover; }
        .wh-drawer-item-heading { display: flex; flex-direction: column; gap: 4px; }
        .wh-hero-title-row { display: flex; justify-content: space-between; align-items: center; }
        .wh-hero-title { font-size: 16px; font-weight: 900; color: #0F172A; margin: 0; }
        .wh-hero-sub-row { display: flex; align-items: center; gap: 10px; }
        .wh-hero-rego { font-size: 12px; font-weight: 800; color: #475569; }
        .wh-hero-vin { font-size: 10.5px; color: #64748B; font-family: monospace; }

        .wh-drawer-details-body { display: flex; flex-direction: column; padding: 8px 0; flex: 1; }
        .wh-detail-field { display: flex; align-items: flex-start; gap: 12px; padding: 10px 16px; border-bottom: 1px solid #F8FAFC; }
        .field-icon { color: #64748B; margin-top: 2px; }
        .field-content { display: flex; flex-direction: column; }
        .field-label { font-size: 10px; color: #94A3B8; font-weight: 600; }
        .field-value { font-size: 12px; color: #334155; font-weight: 600; }
        .field-value.bold { font-weight: 800; color: #0F172A; }

        .wh-drawer-footer-actions {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: #FFFFFF;
          border-top: 1px solid #E2E8F0;
        }

        .wh-drawer-btn-primary {
          height: 40px;
          width: 100%;
          background: #FFD400;
          border: none;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 800;
          color: #0F172A;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 2px 8px rgba(255, 212, 0, 0.25);
        }

        .wh-drawer-btn-secondary {
          height: 38px;
          width: 100%;
          background: #0F172A;
          border: none;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 700;
          color: #FFFFFF;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .wh-drawer-btn-outline {
          height: 36px;
          width: 100%;
          background: transparent;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          font-size: 11.5px;
          font-weight: 700;
          color: #64748B;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .wh-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(4px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .wh-modal-box {
          background: #FFFFFF;
          border-radius: 16px;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .wh-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #E2E8F0;
        }

        .wh-modal-header h3 { font-size: 15px; font-weight: 800; color: #0F172A; margin: 0; }
        .wh-modal-header button { background: transparent; border: none; color: #94A3B8; cursor: pointer; }

        .wh-modal-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
        .modal-item-summary { background: #F8FAFC; border-radius: 10px; padding: 12px 14px; font-size: 13px; color: #0F172A; border: 1px solid #E2E8F0; }
        .modal-item-summary .sub-txt { font-size: 11px; color: #64748B; }
        .modal-form-group { display: flex; flex-direction: column; gap: 6px; }
        .modal-form-group label { font-size: 11px; font-weight: 800; color: #64748B; text-transform: uppercase; }
        .modal-form-group select { height: 40px; padding: 0 14px; border-radius: 10px; border: 1px solid #CBD5E1; font-size: 13px; font-weight: 600; outline: none; }

        .wh-modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 16px 20px;
          background: #F8FAFC;
          border-top: 1px solid #E2E8F0;
        }

        .wh-modal-btn-cancel { padding: 8px 16px; border-radius: 8px; border: 1px solid #E2E8F0; background: #FFFFFF; font-size: 12px; font-weight: 700; color: #64748B; cursor: pointer; }
        .wh-modal-btn-submit { padding: 8px 18px; border-radius: 8px; border: none; background: #FFD400; font-size: 12px; font-weight: 800; color: #0F172A; cursor: pointer; }

        .wh-history-timeline { display: flex; flex-direction: column; gap: 16px; }
        .timeline-event { display: flex; align-items: flex-start; gap: 12px; }
        .timeline-event .dot { width: 10px; height: 10px; border-radius: 50%; margin-top: 4px; flex-shrink: 0; }
        .timeline-event .dot.green { background: #10B981; }
        .timeline-event .dot.blue { background: #3B82F6; }
        .timeline-event .dot.orange { background: #F97316; }

        .event-info { display: flex; flex-direction: column; }
        .event-title { font-size: 12.5px; font-weight: 700; color: #0F172A; }
        .event-time { font-size: 10.5px; color: #94A3B8; }

        .scanner-viewfinder {
          position: relative;
          width: 160px;
          height: 160px;
          border: 2px dashed #FFD400;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F8FAFC;
          overflow: hidden;
        }

        .scanner-laser {
          position: absolute;
          left: 0; right: 0; height: 2px; background: #EF4444; box-shadow: 0 0 8px #EF4444;
          animation: scanLaser 2s infinite ease-in-out;
        }

        @keyframes scanLaser { 0% { top: 0%; } 50% { top: 100%; } 100% { top: 0%; } }

        @media (max-width: 1280px) {
          .wh-stock-master-grid { flex-direction: column; }
          .wh-stock-right-col { width: 100%; }
        }

        @media (max-width: 1024px) {
          .wh-stock-dropdowns-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .wh-stock-search-row { flex-direction: column; align-items: stretch; }
          .wh-stock-dropdowns-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      
      {/* ── TOP HEADER / ACTION BAR ── */}
      <div className="wh-stock-top-bar">
        <div className="wh-stock-title-wrap">
          <h1 className="wh-stock-main-title">{isYard ? 'YARD FIND & SEARCH STOCK' : 'FIND STOCK'}</h1>
        </div>

        <div className="wh-stock-top-actions">
          <button className="wh-btn-secondary" onClick={handleClearFilters}>
            Clear Filters
          </button>
          <button className="wh-btn-yellow" onClick={() => setScannerModalOpen(true)}>
            <QrCode size={16} />
            <span>Scan Barcode / QR</span>
          </button>
        </div>
      </div>

      {/* ── MASTER 2-COLUMN LAYOUT (Matching Screenshot 2 layout) ── */}
      <div className="wh-stock-master-grid">
        
        {/* LEFT COLUMN: FILTERS + RESULTS BAR + TABLE */}
        <div className="wh-stock-left-col">
          
          {/* FILTER CARD */}
          <div className="wh-stock-filter-card">
            {/* Search Bar & Toggle */}
            <div className="wh-stock-search-row">
              <div className="wh-stock-search-input-wrap">
                <Search size={16} className="wh-stock-search-icon" />
                <input 
                  type="text" 
                  placeholder="Search by VIN, Rego, Barcode, SKU, Item No, Load No, Customer Ref..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="wh-stock-search-input"
                />
                {searchQuery && (
                  <button className="wh-stock-clear-input-btn" onClick={() => setSearchQuery('')}>
                    <X size={14} />
                  </button>
                )}
              </div>

              <button 
                className={`wh-stock-filter-toggle-btn ${showAdvancedFilters ? 'active' : ''}`}
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <Filter size={15} />
                <span>Filters</span>
                <ChevronDown size={14} className={`arrow ${showAdvancedFilters ? 'rotate' : ''}`} />
              </button>
            </div>

            {/* Filter Dropdowns Grid - 2 Rows matching Screenshot 2 */}
            {showAdvancedFilters && (
              <div className="wh-stock-dropdowns-container">
                {/* Row 1 */}
                <div className="wh-stock-dropdowns-grid">
                  <div className="wh-filter-group">
                    <label>Item Type</label>
                    <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                      <option value="All Types">All Types</option>
                      <option value="Vehicle">Vehicle</option>
                      <option value="Pallet">Pallet</option>
                      <option value="Carton">Carton</option>
                      <option value="DG Item">DG Item</option>
                      <option value="Container">Container</option>
                    </select>
                  </div>

                  <div className="wh-filter-group">
                    <label>Location</label>
                    <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                      <option value="All Locations">All Locations</option>
                      <option value="Yard A">Yard A</option>
                      <option value="Yard B">Yard B</option>
                      <option value="Yard C">Yard C</option>
                      <option value="Warehouse 1">Warehouse 1</option>
                      <option value="DG Store">DG Store</option>
                    </select>
                  </div>

                  <div className="wh-filter-group">
                    <label>Status</label>
                    <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                      <option value="All Statuses">All Statuses</option>
                      <option value="In Storage">In Storage</option>
                      <option value="Staged">Staged</option>
                      <option value="Ready">Ready</option>
                      <option value="To Move">To Move</option>
                    </select>
                  </div>

                  <div className="wh-filter-group">
                    <label>Load / Job</label>
                    <select value={selectedLoad} onChange={(e) => setSelectedLoad(e.target.value)}>
                      <option value="All Loads">All Loads</option>
                      <option value="LD-3987">LD-3987</option>
                      <option value="LD-3986">LD-3986</option>
                      <option value="LD-3921">LD-3921</option>
                      <option value="LD-3940">LD-3940</option>
                      <option value="LD-3951">LD-3951</option>
                    </select>
                  </div>

                  <div className="wh-filter-group">
                    <label>Customer</label>
                    <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}>
                      <option value="All Customers">All Customers</option>
                      <option value="ABC Motors">ABC Motors</option>
                      <option value="XYZ Imports">XYZ Imports</option>
                      <option value="Tech Supplies">Tech Supplies</option>
                      <option value="Retail Hub">Retail Hub</option>
                      <option value="Fuel Co">Fuel Co</option>
                      <option value="Oceanic Freight">Oceanic Freight</option>
                    </select>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="wh-stock-dropdowns-grid second-row">
                  <div className="wh-filter-group">
                    <label>Date Range</label>
                    <input 
                      type="text" 
                      placeholder="Select date range 📅" 
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="wh-date-input"
                    />
                  </div>

                  <div className="wh-filter-group">
                    <label>Zone</label>
                    <select value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)}>
                      <option value="All Zones">All Zones</option>
                      <option value="Zone A">Zone A</option>
                      <option value="Zone B">Zone B</option>
                    </select>
                  </div>

                  <div className="wh-filter-group">
                    <label>Row#</label>
                    <select value={selectedRow} onChange={(e) => setSelectedRow(e.target.value)}>
                      <option value="All Rows">All Rows</option>
                      <option value="Row 1">Row 1</option>
                      <option value="Row 4">Row 4</option>
                    </select>
                  </div>

                  <div className="wh-filter-group">
                    <label>Bay#</label>
                    <select value={selectedBay} onChange={(e) => setSelectedBay(e.target.value)}>
                      <option value="All Bays">All Bays</option>
                      <option value="Bay 03">Bay 03</option>
                      <option value="Bay 12">Bay 12</option>
                    </select>
                  </div>

                  <div className="wh-filter-group">
                    <label>Staging Area</label>
                    <select value={selectedStaging} onChange={(e) => setSelectedStaging(e.target.value)}>
                      <option value="All Staging Areas">All Staging Areas</option>
                      <option value="Load Lane 3">Load Lane 3</option>
                      <option value="Load Lane 4">Load Lane 4</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RESULTS BAR */}
          <div className="wh-stock-results-bar">
            <div className="wh-results-count">
              Total Results: <strong>27</strong>
            </div>

            <div className="wh-results-controls">
              <div className="wh-sort-wrap">
                <span className="sort-label">Sort by:</span>
                <select className="wh-sort-select">
                  <option value="newest">Last Updated (Newest)</option>
                  <option value="oldest">Last Updated (Oldest)</option>
                  <option value="title">Item Name (A-Z)</option>
                </select>
              </div>

              <div className="wh-view-mode-toggle">
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  <List size={16} />
                </button>
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <Grid size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* TABLE CARD */}
          <div className="wh-stock-table-card">
            <div className="wh-stock-table-wrap">
              <table className="wh-stock-data-table">
                <thead>
                  <tr>
                    <th>ITEM / DESCRIPTION</th>
                    <th>TYPE</th>
                    <th>LOCATION</th>
                    <th>STATUS</th>
                    <th>LOAD / JOB</th>
                    <th>CUSTOMER</th>
                    <th>UPDATED ∨</th>
                    <th style={{ textAlign: 'right' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="wh-empty-stock-td">
                        No stock items match your search filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map(item => {
                      const isSelected = selectedItem && selectedItem.id === item.id;
                      return (
                        <tr 
                          key={item.id} 
                          className={isSelected ? 'selected-row' : ''}
                          onClick={() => setSelectedItem(item)}
                        >
                          {/* Item / Description */}
                          <td>
                            <div className="wh-item-cell">
                              <div className="wh-item-thumb">
                                <img src={item.image} alt={item.title} className="thumb-car-img" />
                              </div>
                              <div className="wh-item-text">
                                <div className="wh-item-title">{item.title}</div>
                                <div className="wh-item-sub">
                                  <span className="bold-sub">{item.itemNo}</span>
                                  {item.vin && <span className="vin-tag">VIN: {item.vin}</span>}
                                  {item.barcode && <span className="vin-tag">{item.barcode}</span>}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Type */}
                          <td>
                            <div className="wh-type-cell">
                              <div className="type-row">
                                <span className="type-icon">🚘</span>
                                <span className="wh-type-name">{item.type}</span>
                              </div>
                              <span className={`wh-[#2563eb] wh-type-badge badge-${item.typeColor}`}>
                                {item.typeBadge}
                              </span>
                            </div>
                          </td>

                          {/* Location */}
                          <td>
                            <div className="wh-location-cell">
                              <span className="wh-loc-main">{item.location}</span>
                              <span className="wh-loc-sub">{item.locationDetail}</span>
                            </div>
                          </td>

                          {/* Status */}
                          <td>
                            {item.statusColor === 'green-outline' ? (
                              <span className="wh-status-badge badge-green-outline">Ready</span>
                            ) : (
                              <span className={`wh-status-badge badge-${item.statusColor}`}>
                                {item.status}
                              </span>
                            )}
                          </td>

                          {/* Load / Job */}
                          <td>
                            <div className="wh-load-cell">
                              <span className="load-num">{item.loadJob}</span>
                              {item.loadDetail && <span className="load-sub">{item.loadDetail}</span>}
                            </div>
                          </td>

                          {/* Customer */}
                          <td>
                            <span className="wh-customer-name">{item.customer}</span>
                          </td>

                          {/* Updated */}
                          <td>
                            <span className="wh-updated-time">{item.updated}</span>
                          </td>

                          {/* Action */}
                          <td style={{ textAlign: 'right' }}>
                            <button 
                              className="wh-view-row-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedItem(item);
                              }}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: FULL-HEIGHT ITEM DETAILS PANEL */}
        {selectedItem && (
          <div className="wh-stock-right-col">
            <div className={`wh-item-details-drawer ${isDetailExpanded ? 'expanded' : ''}`}>
              
              {/* Drawer Header */}
              <div className="wh-drawer-header">
                <h3 className="wh-drawer-title">ITEM DETAILS</h3>
                <div className="wh-drawer-actions">
                  <button 
                    className="wh-drawer-icon-btn" 
                    onClick={() => setIsDetailExpanded(!isDetailExpanded)}
                    title={isDetailExpanded ? "Collapse View" : "Expand View"}
                  >
                    <Maximize2 size={15} />
                  </button>
                  <button 
                    className="wh-drawer-icon-btn"
                    onClick={() => setSelectedItem(null)}
                    title="Close Details"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Item Hero Section */}
              <div className="wh-drawer-hero">
                <div className="wh-drawer-img-box">
                  <img src={selectedItem.image} alt={selectedItem.title} />
                </div>

                <div className="wh-drawer-item-heading">
                  <div className="wh-hero-title-row">
                    <h2 className="wh-hero-title">{selectedItem.title}</h2>
                    <span className={`wh-status-badge badge-${selectedItem.statusColor}`}>
                      {selectedItem.status}
                    </span>
                  </div>

                  <div className="wh-hero-sub-row">
                    <span className="wh-hero-rego">{selectedItem.rego || selectedItem.itemNo}</span>
                    <span className={`wh-type-badge badge-${selectedItem.typeColor}`}>
                      {selectedItem.typeBadge}
                    </span>
                  </div>

                  {selectedItem.vin && (
                    <div className="wh-hero-vin">VIN: {selectedItem.vin}</div>
                  )}
                </div>
              </div>

              {/* Field Details List */}
              <div className="wh-drawer-details-body">
                {/* Current Location */}
                <div className="wh-detail-field">
                  <div className="field-icon"><MapPin size={16} /></div>
                  <div className="field-content">
                    <span className="field-label">Current Location</span>
                    <span className="field-value bold">{selectedItem.locationDetail}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="wh-detail-field">
                  <div className="field-icon"><Tag size={16} /></div>
                  <div className="field-content">
                    <span className="field-label">Status</span>
                    <span className="field-value bold">{selectedItem.status}</span>
                  </div>
                </div>

                {/* Load / Job */}
                <div className="wh-detail-field">
                  <div className="field-icon"><FileText size={16} /></div>
                  <div className="field-content">
                    <span className="field-label">Load / Job</span>
                    <span className="field-value bold">{selectedItem.loadJob} {selectedItem.loadDetail ? `(${selectedItem.loadDetail})` : ''}</span>
                  </div>
                </div>

                {/* Customer */}
                <div className="wh-detail-field">
                  <div className="field-icon"><User size={16} /></div>
                  <div className="field-content">
                    <span className="field-label">Customer</span>
                    <span className="field-value bold">{selectedItem.customer}</span>
                  </div>
                </div>

                {/* Received Date */}
                <div className="wh-detail-field">
                  <div className="field-icon"><Calendar size={16} /></div>
                  <div className="field-content">
                    <span className="field-label">Received Date</span>
                    <span className="field-value">{selectedItem.receivedDate}</span>
                  </div>
                </div>

                {/* Item Type */}
                <div className="wh-detail-field">
                  <div className="field-icon"><Package size={16} /></div>
                  <div className="field-content">
                    <span className="field-label">Item Type</span>
                    <span className="field-value">{selectedItem.type}</span>
                  </div>
                </div>

                {/* Condition */}
                <div className="wh-detail-field">
                  <div className="field-icon"><CheckCircle2 size={16} /></div>
                  <div className="field-content">
                    <span className="field-label">Condition</span>
                    <span className="field-value">{selectedItem.condition}</span>
                  </div>
                </div>

                {/* Notes */}
                <div className="wh-detail-field">
                  <div className="field-icon"><Clock size={16} /></div>
                  <div className="field-content">
                    <span className="field-label">Notes</span>
                    <span className="field-value">{selectedItem.notes}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Primary Actions */}
              <div className="wh-drawer-footer-actions">
                <button 
                  className="wh-drawer-btn-primary"
                  onClick={() => setMoveModalOpen(true)}
                >
                  <ArrowRightLeft size={16} />
                  <span>Move / Transfer</span>
                </button>

                <button 
                  className="wh-drawer-btn-secondary"
                  onClick={() => navigate(isYard ? '/yard/load-lanes' : '/warehouse/load-lanes')}
                >
                  <ExternalLink size={15} />
                  <span>View Load</span>
                </button>

                <button 
                  className="wh-drawer-btn-outline"
                  onClick={() => setHistoryModalOpen(true)}
                >
                  <History size={15} />
                  <span>Item History</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* ── RELOCATE / MOVE MODAL ── */}
      {moveModalOpen && selectedItem && (
        <div className="wh-modal-overlay" onClick={() => setMoveModalOpen(false)}>
          <div className="wh-modal-box" onClick={e => e.stopPropagation()}>
            <div className="wh-modal-header">
              <h3>Relocate Asset / Transfer Location</h3>
              <button onClick={() => setMoveModalOpen(false)}><X size={18} /></button>
            </div>
            
            <div className="wh-modal-body">
              <div className="modal-item-summary">
                <strong>{selectedItem.title}</strong> ({selectedItem.itemNo})
                <br />
                <span className="sub-txt">Current Location: {selectedItem.locationDetail}</span>
              </div>

              <div className="modal-form-group">
                <label>Select Target Yard / Warehouse Location Spot</label>
                <select value={targetLocation} onChange={(e) => setTargetLocation(e.target.value)}>
                  <option value="Yard A / Row 2 / Bay 05">Yard A / Row 2 / Bay 05</option>
                  <option value="Yard B / Row 1 / Bay 03">Yard B / Row 1 / Bay 03</option>
                  <option value="Load Lane 3 (Staging)">Load Lane 3 (Staging)</option>
                  <option value="Load Lane 4 (Staging)">Load Lane 4 (Staging)</option>
                  <option value="Warehouse 1 / Aisle 12 / Bay 5">Warehouse 1 / Aisle 12 / Bay 5</option>
                  <option value="DG Store / Zone A / Bay 03">DG Store / Zone A / Bay 03</option>
                </select>
              </div>
            </div>

            <div className="wh-modal-footer">
              <button className="wh-modal-btn-cancel" onClick={() => setMoveModalOpen(false)}>Cancel</button>
              <button 
                className="wh-modal-btn-submit"
                onClick={() => {
                  alert(`Successfully relocated ${selectedItem.title} to ${targetLocation}!`);
                  setMoveModalOpen(false);
                }}
              >
                Confirm Relocation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ITEM HISTORY MODAL ── */}
      {historyModalOpen && selectedItem && (
        <div className="wh-modal-overlay" onClick={() => setHistoryModalOpen(false)}>
          <div className="wh-modal-box" onClick={e => e.stopPropagation()}>
            <div className="wh-modal-header">
              <h3>Audit Log & History: {selectedItem.title}</h3>
              <button onClick={() => setHistoryModalOpen(false)}><X size={18} /></button>
            </div>
            
            <div className="wh-modal-body">
              <div className="wh-history-timeline">
                <div className="timeline-event">
                  <span className="dot green"></span>
                  <div className="event-info">
                    <div className="event-title">Status Updated to {selectedItem.status}</div>
                    <div className="event-time">21/07/2026 {selectedItem.updated} • By W. Smith</div>
                  </div>
                </div>
                <div className="timeline-event">
                  <span className="dot blue"></span>
                  <div className="event-info">
                    <div className="event-title">Assigned to Load {selectedItem.loadJob}</div>
                    <div className="event-time">20/07/2026 04:15 PM • By Dispatch System</div>
                  </div>
                </div>
                <div className="timeline-event">
                  <span className="dot orange"></span>
                  <div className="event-info">
                    <div className="event-title">Received at Inbound Gate</div>
                    <div className="event-time">{selectedItem.receivedDate} • Gate Staff</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="wh-modal-footer">
              <button className="wh-modal-btn-cancel" onClick={() => setHistoryModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── BARCODE / QR SCANNER MODAL ── */}
      {scannerModalOpen && (
        <div className="wh-modal-overlay" onClick={() => setScannerModalOpen(false)}>
          <div className="wh-modal-box text-center" onClick={e => e.stopPropagation()}>
            <div className="wh-modal-header">
              <h3>Scan Barcode / QR Code</h3>
              <button onClick={() => setScannerModalOpen(false)}><X size={18} /></button>
            </div>

            <div className="wh-modal-body flex-center" style={{ padding: '32px 16px' }}>
              <div className="scanner-viewfinder">
                <QrCode size={64} className="scanner-icon-anim" />
                <div className="scanner-laser"></div>
              </div>
              <p style={{ marginTop: '16px', fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                Point camera at asset barcode or QR code tag
              </p>
            </div>

            <div className="wh-modal-footer">
              <button className="wh-modal-btn-cancel" onClick={() => setScannerModalOpen(false)}>Close Camera</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
