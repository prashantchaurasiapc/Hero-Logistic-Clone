import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './pages/Layout/DashboardLayout/DashboardLayout';

import WarehouseDashboard from './pages/Layout/Dashboard/WarehouseDashboard';
import WarehouseInbound from './pages/Layout/Dashboard/WarehouseInbound';
import WarehouseOutbound from './pages/Layout/Dashboard/WarehouseOutbound';
import WarehouseCurrentStock from './pages/Layout/Dashboard/WarehouseCurrentStock';
import WarehouseMap from './pages/Layout/Dashboard/WarehouseMap';
import WarehouseHoldingAreas from './pages/Layout/Dashboard/WarehouseHoldingAreas';
import WarehouseLoadLanes from './pages/Layout/Dashboard/WarehouseLoadLanes';
import WarehouseReports from './pages/Layout/Dashboard/WarehouseReports';
import WarehouseScanning from './pages/Layout/Dashboard/WarehouseScanning';
import WarehouseLabels from './pages/Layout/Dashboard/WarehouseLabels';
import WarehouseMovements from './pages/Layout/Dashboard/WarehouseMovements';
import YardDashboard from './pages/Layout/Dashboard/YardDashboard';
import AccountsDashboard from './pages/Layout/Dashboard/AccountsDashboard';
import InvoiceReview from './pages/Layout/Dashboard/InvoiceReview';
import SentInvoices from './pages/Layout/Dashboard/SentInvoices';
import CustomerDashboard from './pages/Layout/Dashboard/CustomerDashboard';
import SalesDashboard from './components/SalesDashboard/SalesDashboard';
import CompanyAdminDashboard from './pages/Layout/Dashboard/CompanyAdminDashboard';
import DispatcherDashboard from './pages/Layout/Dashboard/DispatcherDashboard';
import DriverDashboard from './pages/Layout/Dashboard/DriverDashboard';
import StartWorkFinish from './components/DriverDashboard/StartWorkFinish';
import Jobs from './components/DriverDashboard/Jobs';
import NearbyServices from './components/DriverDashboard/NearbyServices';
import Notifications from './components/DriverDashboard/Notifications';
import Documents from './components/DriverDashboard/Documents';
import CreateDraftLoad from './components/DriverDashboard/CreateDraftLoad';
import AddExpense from './components/DriverDashboard/AddExpense';
import MyPay from './components/DriverDashboard/MyPay';
import ContactDispatch from './components/DriverDashboard/ContactDispatch';
import LeaveManagement from './components/DriverDashboard/LeaveManagement';
import IncidentReporting from './components/DriverDashboard/IncidentReporting';
import MaintenanceRequest from './components/DriverDashboard/MaintenanceRequest';
import Login from './pages/Website/Login';
import LandingPage from './pages/Website/Landingpage/LandingPage';
import OnboardingWizard from './pages/Website/Landingpage/OnboardingWizard';
import Register from './pages/Website/Register';
import './App.css';

/* ============================================================
   PLACEHOLDER PAGES - Replace these with real pages later
   ============================================================ */

// Admin components
import Companies from './components/SuperAdminDashboard/Companies';
import Subscriptions from './components/SuperAdminDashboard/Subcription';
import MembershipPlans from './components/SuperAdminDashboard/MembershipPlans';
import FeatureAccess from './components/SuperAdminDashboard/FeatureAccesss';
import WhiteLabel from './components/SuperAdminDashboard/WhiteLabel';
import SupportTickets from './components/SuperAdminDashboard/SupportTicket';
import Billing from './components/SuperAdminDashboard/Billing';
import SystemAnalytics from './components/SuperAdminDashboard/SystemAnalytics';
import InterCompanyTransfers from './components/SuperAdminDashboard/InterCompanyTransfer';
import AIControls from './components/SuperAdminDashboard/AIControl';
import Settings from './components/SuperAdminDashboard/Setting';
import PlatformDashboard from './components/SuperAdminDashboard/PlatformDashboard';

// Sales components
import Leads from './components/SalesDashboard/Leads';
import PipelineBoard from './components/SalesDashboard/PipelineBoard';
import DemoBookings from './components/SalesDashboard/DemoBookings';

import TrialCompanies from './components/SalesDashboard/TrialCompanies';
import Proposals from './components/SalesDashboard/Proposals';
import FollowUps from './components/SalesDashboard/FollowUps';
import OnboardingHandover from './components/SalesDashboard/OnboardingHandover';
import SalesReports from './components/SalesDashboard/SalesReports';
import SalesSettings from './components/SalesDashboard/Setting';
// Company Admin components
import CommandCentre from './components/CompanyAdmin/CommandCentre';
import Loads from './components/CompanyAdmin/Loads';
import LiveTracking from './components/CompanyAdmin/LiveTracking';
import Drivers from './components/CompanyAdmin/Drivers';
import Vehicles from './components/CompanyAdmin/Vehicles';
import Customers from './components/CompanyAdmin/Customers';
import Branches from './components/CompanyAdmin/Branches';
import Assets from './components/CompanyAdmin/Assets';
import Warehouse from './components/CompanyAdmin/Warehouse';
import Finance from './components/CompanyAdmin/Finance';
import Reports from './components/CompanyAdmin/Reports';
import Messages from './components/CompanyAdmin/Messages';
import MyTickets from './components/CompanyAdmin/MyTickets';
import OpenTickets from './components/CompanyAdmin/OpenTickets';
import KnowledgeBase from './components/CompanyAdmin/KnowledgeBase';
import CompanySettings from './components/CompanyAdmin/CompanySettings';
import SubscriptionBilling from './components/CompanyAdmin/SubscriptionBilling';
import MyProfile from './components/CompanyAdmin/MyProfile';
import SafetyChecklists from './components/CompanyAdmin/SafetyChecklists';
import DeliveryIssues from './components/CompanyAdmin/DeliveryIssues';

// Dispatcher components
import CommandCenter from './components/Dispatcher/CommandCentre';
import DispatcherLoads from './components/Dispatcher/Loads';
import LoadInbox from './components/Dispatcher/LoadInbox';
import TerminalWorkspace from './components/Dispatcher/TerminalWorkspace';
import FleetMonitor from './components/Dispatcher/FleetMonitor';
import FleetAssets from './components/Dispatcher/FleetAssest';
import AssetInventory from './components/Dispatcher/AssetInventory';
import RosterControl from './components/Dispatcher/RosterControl';
import CommunicationDepot from './components/Dispatcher/CommunicationDepot';
import SystemSettings from './components/Dispatcher/SystemSettings';

// Driver placeholders
// WorkStatus now uses the real StartWorkFinish component (imported above)
const DriverJobs = () => <div style={{ padding: '24px' }}><h2>Jobs</h2></div>;

// Warehouse placeholders
const HoldingAreas = WarehouseHoldingAreas;
const LoadLanes = WarehouseLoadLanes;
const Scanning = WarehouseScanning;
const Labels = WarehouseLabels;
const Movements = WarehouseMovements;
// WarehouseReports is imported at the top of the file

// Yard Attendant placeholders
const YardWorkStatus = () => <div style={{ padding: '24px' }}><h2>Start Work / Finish Work</h2></div>;
const YardScan = () => <div style={{ padding: '24px' }}><h2>Scan button</h2></div>;
const YardMoveItem = () => <div style={{ padding: '24px' }}><h2>Move item</h2></div>;
const YardScanIn = () => <div style={{ padding: '24px' }}><h2>Scan into location</h2></div>;
const YardScanOut = () => <div style={{ padding: '24px' }}><h2>Scan out of location</h2></div>;
const YardLoadLane = () => <div style={{ padding: '24px' }}><h2>Load lane assignment</h2></div>;
const YardReportIssue = () => <div style={{ padding: '24px' }}><h2>Report issue</h2></div>;

// Accounts placeholders
// InvoiceReview is imported at the top of the file
// SentInvoices is imported at the top of the file
const Payments = () => <div style={{ padding: '24px' }}><h2>Payments</h2></div>;
const Payroll = () => <div style={{ padding: '24px' }}><h2>Payroll</h2></div>;
const ContractorPay = () => <div style={{ padding: '24px' }}><h2>Contractor Pay</h2></div>;
const EmployeePay = () => <div style={{ padding: '24px' }}><h2>Employee Pay</h2></div>;
const Expenses = () => <div style={{ padding: '24px' }}><h2>Expenses</h2></div>;
const GstPayg = () => <div style={{ padding: '24px' }}><h2>GST / PAYG</h2></div>;
const Pnl = () => <div style={{ padding: '24px' }}><h2>P&L</h2></div>;
const VehicleCosts = () => <div style={{ padding: '24px' }}><h2>Vehicle Costs</h2></div>;
const AccountsReports = () => <div style={{ padding: '24px' }}><h2>Reports</h2></div>;

// Customer placeholders
const MyLoads = () => <div style={{ padding: '24px' }}><h2>My Loads</h2></div>;
const TrackDelivery = () => <div style={{ padding: '24px' }}><h2>Track Delivery</h2></div>;
const CustomerDocuments = () => <div style={{ padding: '24px' }}><h2>Documents</h2></div>;
const Invoices = () => <div style={{ padding: '24px' }}><h2>Invoices</h2></div>;
const CustomerPayments = () => <div style={{ padding: '24px' }}><h2>Payments</h2></div>;
const LoadRequests = () => <div style={{ padding: '24px' }}><h2>Load Requests</h2></div>;
const CustomerNotifications = () => <div style={{ padding: '24px' }}><h2>Notifications</h2></div>;
const DispatcherChat = () => <div style={{ padding: '24px' }}><h2>Dispatcher Chat</h2></div>;
const Support = () => <div style={{ padding: '24px' }}><h2>Support</h2></div>;
const CustomerSettings = () => <div style={{ padding: '24px' }}><h2>Settings</h2></div>;

/* ============================================================
   APP ROUTES
   ============================================================ */
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<OnboardingWizard />} />

        {/* ===== SUPER ADMIN ===== */}
        <Route path="/admin" element={<DashboardLayout role="super-admin" />}>
          <Route path="dashboard" element={<PlatformDashboard role="super-admin" />} />
          <Route path="companies" element={<Companies />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="membership-plans" element={<MembershipPlans />} />
          <Route path="feature-access" element={<FeatureAccess />} />
          <Route path="white-label" element={<WhiteLabel />} />
          <Route path="support-tickets" element={<SupportTickets />} />
          <Route path="billing" element={<Billing />} />
          <Route path="system-analytics" element={<SystemAnalytics />} />
          <Route path="inter-company-transfers" element={<InterCompanyTransfers />} />
          <Route path="ai-controls" element={<AIControls />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* ===== SALES ===== */}
        <Route path="/sales" element={<DashboardLayout role="sales" />}>
          <Route path="dashboard" element={<SalesDashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="pipeline-board" element={<PipelineBoard />} />
          <Route path="demo-bookings" element={<DemoBookings />} />
          <Route path="trial-companies" element={<TrialCompanies />} />
          <Route path="proposals" element={<Proposals />} />
          <Route path="follow-ups" element={<FollowUps />} />
          <Route path="onboarding-handover" element={<OnboardingHandover />} />
          <Route path="sales-reports" element={<SalesReports />} />
          <Route path="settings" element={<SalesSettings />} />
        </Route>

        {/* ===== COMPANY ADMIN ===== */}
        <Route path="/company-admin" element={<DashboardLayout role="company-admin" />}>
          <Route path="command-centre" element={<CommandCentre />} />
          <Route path="loads" element={<Loads />} />
          <Route path="live-tracking" element={<LiveTracking />} />
          <Route path="drivers" element={<Drivers />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="customers" element={<Customers />} />
          <Route path="branches" element={<Branches />} />
          <Route path="assets" element={<Assets />} />
          <Route path="warehouse" element={<Warehouse />} />
          <Route path="finance" element={<Finance />} />
          <Route path="reports" element={<Reports />} />
          <Route path="messages" element={<Messages />} />
          <Route path="my-tickets" element={<MyTickets />} />
          <Route path="open-tickets" element={<OpenTickets />} />
          <Route path="knowledge-base" element={<KnowledgeBase />} />
          <Route path="company-settings" element={<CompanySettings />} />
          <Route path="subscription-billing" element={<SubscriptionBilling />} />
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="safety-checklists" element={<SafetyChecklists />} />
          <Route path="delivery-issues" element={<DeliveryIssues />} />
        </Route>

        {/* ===== DISPATCHER ===== */}
        <Route path="/dispatcher" element={<DashboardLayout role="dispatcher" />}>
          <Route path="command-center" element={<CommandCenter />} />
          <Route path="loads" element={<DispatcherLoads />} />
          <Route path="load-inbox" element={<LoadInbox />} />
          <Route path="terminal-workspace" element={<TerminalWorkspace />} />
          <Route path="fleet-monitor" element={<FleetMonitor />} />
          <Route path="fleet-assets" element={<FleetAssets />} />
          <Route path="asset-inventory" element={<AssetInventory />} />
          <Route path="roster-control" element={<RosterControl />} />
          <Route path="communication-depot" element={<CommunicationDepot />} />
          <Route path="system-settings" element={<SystemSettings />} />
        </Route>

        {/* ===== DRIVER ===== */}
        <Route path="/driver" element={<DashboardLayout role="driver" />}>
          <Route path="work-status" element={<StartWorkFinish />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="nearby-services" element={<NearbyServices />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="documents" element={<Documents />} />
          <Route path="create-draft-load" element={<CreateDraftLoad />} />
          <Route path="add-expense" element={<AddExpense />} />
          <Route path="my-pay" element={<MyPay />} />
          <Route path="contact-dispatch" element={<ContactDispatch />} />
          <Route path="leave-management" element={<LeaveManagement />} />
          <Route path="incident-reporting" element={<IncidentReporting />} />
          <Route path="maintenance-request" element={<MaintenanceRequest />} />
        </Route>

        {/* ===== WAREHOUSE ===== */}
        <Route path="/warehouse" element={<DashboardLayout role="warehouse" />}>
          <Route path="dashboard" element={<WarehouseDashboard />} />
          <Route path="inbound" element={<WarehouseInbound />} />
          <Route path="outbound" element={<WarehouseOutbound />} />
          <Route path="current-stock" element={<WarehouseCurrentStock />} />
          <Route path="map" element={<WarehouseMap />} />
          <Route path="holding-areas" element={<HoldingAreas />} />
          <Route path="load-lanes" element={<LoadLanes />} />
          <Route path="scanning" element={<Scanning />} />
          <Route path="labels" element={<Labels />} />
          <Route path="movements" element={<Movements />} />
          <Route path="reports" element={<WarehouseReports />} />
        </Route>

        {/* ===== YARD ATTENDANT ===== */}
        <Route path="/yard" element={<DashboardLayout role="yard" />}>
          <Route path="dashboard" element={<YardDashboard />} />
          <Route path="work-status" element={<YardWorkStatus />} />
          <Route path="scan" element={<YardScan />} />
          <Route path="move-item" element={<YardMoveItem />} />
          <Route path="scan-in" element={<YardScanIn />} />
          <Route path="scan-out" element={<YardScanOut />} />
          <Route path="load-lane" element={<YardLoadLane />} />
          <Route path="report-issue" element={<YardReportIssue />} />
        </Route>

        {/* ===== ACCOUNTS ===== */}
        <Route path="/accounts" element={<DashboardLayout role="accounts" />}>
          <Route path="dashboard" element={<AccountsDashboard />} />
          <Route path="invoice-review" element={<InvoiceReview />} />
          <Route path="sent-invoices" element={<SentInvoices />} />
          <Route path="payments" element={<Payments />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="contractor-pay" element={<ContractorPay />} />
          <Route path="employee-pay" element={<EmployeePay />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="gst-payg" element={<GstPayg />} />
          <Route path="pnl" element={<Pnl />} />
          <Route path="vehicle-costs" element={<VehicleCosts />} />
          <Route path="reports" element={<AccountsReports />} />
        </Route>

        {/* ===== CUSTOMER ===== */}
        <Route path="/customer" element={<DashboardLayout role="customer" />}>
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="my-loads" element={<MyLoads />} />
          <Route path="track-delivery" element={<TrackDelivery />} />
          <Route path="documents" element={<CustomerDocuments />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="payments" element={<CustomerPayments />} />
          <Route path="load-requests" element={<LoadRequests />} />
          <Route path="notifications" element={<CustomerNotifications />} />
          <Route path="dispatcher-chat" element={<DispatcherChat />} />
          <Route path="support" element={<Support />} />
          <Route path="settings" element={<CustomerSettings />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
