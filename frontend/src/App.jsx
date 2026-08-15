import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './pages/Layout/DashboardLayout/DashboardLayout';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeProvider';

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
import WarehouseMyShift from './components/WareHouseDashboard/WarehouseMyShift';
import YardDashboard from './pages/Layout/Dashboard/YardDashboard';
import YardWorkStatus from './pages/Layout/Dashboard/YardWorkStatus';
import YardScan from './pages/Layout/Dashboard/YardScan';
import YardMoveItem from './pages/Layout/Dashboard/YardMoveItem';
import YardScanIn from './pages/Layout/Dashboard/YardScanIn';
import YardScanOut from './pages/Layout/Dashboard/YardScanOut';
import YardLoadLane from './pages/Layout/Dashboard/YardLoadLane';
import YardReportIssue from './pages/Layout/Dashboard/YardReportIssue';
import YardLocations from './pages/Layout/Dashboard/YardLocations';
import AccountsDashboard from './pages/Layout/Dashboard/AccountsDashboard';
import InvoiceReview from './pages/Layout/Dashboard/InvoiceReview';
import SentInvoices from './pages/Layout/Dashboard/SentInvoices';
import Payments from './pages/Layout/Dashboard/Payments';
import Payroll from './pages/Layout/Dashboard/Payroll';
import ContractorPay from './pages/Layout/Dashboard/ContractorPay';
import EmployeePay from './pages/Layout/Dashboard/EmployeePay';
import Expenses from './pages/Layout/Dashboard/Expenses';
import GstPayg from './pages/Layout/Dashboard/GstPayg';
import Pnl from './pages/Layout/Dashboard/Pnl';
import VehicleCosts from './pages/Layout/Dashboard/VehicleCosts';
import AccountsReports from './pages/Layout/Dashboard/AccountsReports';
import CustomerPricing from './pages/Layout/Dashboard/CustomerPricing';
import CustomerDashboard from './pages/Layout/Dashboard/CustomerDashboard';
import SalesDashboard from './components/SalesDashboard/SalesDashboard';
import CompanyAdminDashboard from './pages/Layout/Dashboard/CompanyAdminDashboard';
import DispatcherDashboard from './pages/Layout/Dashboard/DispatcherDashboard';
import DriverDashboard from './components/DriverDashboard/DriverDashboard';
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
import JobDetails from './components/DriverDashboard/JobDetails';
import ActiveRun from './components/DriverDashboard/ActiveRun';
import PickupLoading from './components/DriverDashboard/PickupLoading';
import DeliveryPOD from './components/DriverDashboard/DeliveryPOD';
import DriverMessages from './components/DriverDashboard/Messages';
import Timesheets from './components/DriverDashboard/Timesheets';
import TrailerSwap from './components/DriverDashboard/TrailerSwap';
import OfflineSyncQueue from './components/DriverDashboard/OfflineSyncQueue';
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
import UserManagement from './components/SuperAdminDashboard/UserManagement';
import AdminUsers from './components/SuperAdminDashboard/AdminUsers';
import RolesPermissions from './components/SuperAdminDashboard/RolesPermissions';
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
import AssetDetails from './components/CompanyAdmin/AssetDetails';
import CreateAsset from './components/CompanyAdmin/CreateAsset';
import Warehouse from './components/CompanyAdmin/Warehouse';
import StandalonePricing from './components/CompanyAdmin/Pricing';
import StandalonePayroll from './components/CompanyAdmin/CompanyAdminPayroll';
import Finance from './components/CompanyAdmin/Finance';
import StandaloneDocuments from './components/CompanyAdmin/CompanyAdminDocuments';
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
import DispatcherProfile from './components/Dispatcher/Profile';

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

// Yard Attendant pages are imported at the top of the file

// Accounts placeholders
// InvoiceReview is imported at the top of the file
// SentInvoices is imported at the top of the file
// Payments is imported at the top of the file
// Payroll is imported at the top of the file
// ContractorPay is imported at the top of the file
// EmployeePay is imported at the top of the file
// Expenses is imported at the top of the file
// GstPayg is imported at the top of the file
// Pnl is imported at the top of the file
// VehicleCosts is imported at the top of the file
// AccountsReports is imported at the top of the file
import AccountsProfile from './components/Accounts/Profile';
import MyLoads from './pages/Layout/Dashboard/MyLoads';
import TrackDelivery from './pages/Layout/Dashboard/TrackDelivery';
import CustomerDocuments from './pages/Layout/Dashboard/CustomerDocuments';
import CustomerInvoices from './pages/Layout/Dashboard/CustomerInvoices';
import CustomerPayments from './pages/Layout/Dashboard/CustomerPayments';
import LoadRequests from './pages/Layout/Dashboard/LoadRequests';
import CustomerNotifications from './pages/Layout/Dashboard/CustomerNotifications';
import CustomerDispatcherChat from './pages/Layout/Dashboard/CustomerDispatcherChat';
import CustomerSupport from './pages/Layout/Dashboard/CustomerSupport';
import CustomerSettings from './pages/Layout/Dashboard/CustomerSettings';

import Tools from './components/WareHouseDashboard/Tools';
import WarehouseProfile from './components/WareHouseDashboard/Profile';

/* ============================================================
   APP ROUTES
   ============================================================ */
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<OnboardingWizard />} />
          <Route path="/customer-portal" element={<Navigate to="/customer/dashboard" replace />} />

          {/* ===== SUPER ADMIN ===== */}
          <Route path="/admin" element={<ProtectedRoute><DashboardLayout role="super-admin" /></ProtectedRoute>}>
            <Route path="dashboard" element={<PlatformDashboard role="super-admin" />} />
            <Route path="companies" element={<Companies />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="roles-permissions" element={<RolesPermissions />} />
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
          <Route path="/sales" element={<ProtectedRoute><DashboardLayout role="sales" /></ProtectedRoute>}>
            <Route path="dashboard" element={<SalesDashboard />} />
            <Route path="leads" element={<Leads />} />
            <Route path="pipeline-board" element={<PipelineBoard />} />
            <Route path="demo-bookings" element={<DemoBookings />} />
            <Route path="trial-companies" element={<TrialCompanies />} />
            <Route path="proposals" element={<Proposals />} />
            <Route path="follow-ups" element={<FollowUps />} />
            <Route path="onboarding-handover" element={<OnboardingHandover />} />
            <Route path="sales-reports" element={<SalesReports />} />
            <Route path="messages" element={<Messages />} />
            <Route path="settings" element={<SalesSettings />} />
          </Route>

          {/* ===== COMPANY ADMIN ===== */}
          <Route path="/company-admin" element={<ProtectedRoute><DashboardLayout role="company-admin" /></ProtectedRoute>}>
            <Route path="command-centre" element={<CommandCentre />} />
            <Route path="loads" element={<Loads />} />
            <Route path="load-inbox" element={<LoadInbox />} />
            <Route path="live-tracking" element={<LiveTracking />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="customers" element={<Customers />} />
            <Route path="branches" element={<Branches />} />
            <Route path="locations" element={<Branches />} />
            <Route path="assets" element={<Assets />} />
            <Route path="assets/new" element={<CreateAsset />} />
            <Route path="assets/:id" element={<AssetDetails />} />
            <Route path="warehouse" element={<Warehouse />} />
            <Route path="pricing" element={<StandalonePricing />} />
            <Route path="payroll" element={<StandalonePayroll />} />
            <Route path="finance" element={<Finance />} />
            <Route path="documents" element={<StandaloneDocuments />} />
            <Route path="reports" element={<Reports />} />
            <Route path="messages" element={<Messages />} />
            <Route path="my-tickets" element={<MyTickets />} />
            <Route path="open-tickets" element={<OpenTickets />} />
            <Route path="knowledge-base" element={<KnowledgeBase />} />
            <Route path="company-settings" element={<CompanySettings />} />
            <Route path="settings" element={<CompanySettings />} />
            <Route path="users" element={<CompanySettings />} />
            <Route path="subscription-billing" element={<SubscriptionBilling />} />
            <Route path="my-profile" element={<MyProfile />} />
            <Route path="safety-checklists" element={<SafetyChecklists />} />
            <Route path="delivery-issues" element={<DeliveryIssues />} />
            <Route path="customer-pricing" element={<CustomerPricing />} />
            <Route path="roles-permissions" element={<RolesPermissions />} />
          </Route>

          {/* ===== DISPATCHER PORTAL ===== */}
          <Route path="/dispatcher" element={<ProtectedRoute><DashboardLayout role="dispatcher" /></ProtectedRoute>}>
            <Route index element={<CommandCenter />} />
            <Route path="dashboard" element={<CommandCenter />} />
            <Route path="dispatch-dashboard" element={<CommandCenter />} />
            <Route path="command-center" element={<CommandCenter />} />
            <Route path="create-load" element={<Loads />} />
            <Route path="load-inbox" element={<LoadInbox />} />
            <Route path="active-loads" element={<DispatcherLoads />} />
            <Route path="loads" element={<Loads />} />
            <Route path="planning-board" element={<TerminalWorkspace />} />
            <Route path="terminal-workspace" element={<TerminalWorkspace />} />
            <Route path="live-gps-map" element={<FleetMonitor />} />
            <Route path="fleet-monitor" element={<FleetMonitor />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="customers" element={<Customers />} />
            <Route path="warehouse" element={<Warehouse />} />
            <Route path="workforce-availability" element={<RosterControl />} />
            <Route path="roster-control" element={<RosterControl />} />
            <Route path="messages" element={<CommunicationDepot />} />
            <Route path="communication-depot" element={<CommunicationDepot />} />
            <Route path="reports" element={<Reports />} />
            <Route path="profile" element={<DispatcherProfile />} />
            <Route path="fleet-assets" element={<FleetAssets />} />
            <Route path="asset-inventory" element={<AssetInventory />} />
            <Route path="system-settings" element={<SystemSettings />} />
            {/* Backwards compatibility aliases */}
            <Route path="live-tracking" element={<FleetMonitor />} />
            <Route path="locations" element={<Branches />} />
            <Route path="branches" element={<Branches />} />
            <Route path="*" element={<CommandCenter />} />
          </Route>

          {/* ===== DRIVER ===== */}
          <Route path="/driver" element={<ProtectedRoute><DashboardLayout role="driver" /></ProtectedRoute>}>
            <Route index element={<DriverDashboard />} />
            <Route path="dashboard" element={<DriverDashboard />} />
            <Route path="active-run" element={<ActiveRun />} />
            <Route path="start-trip" element={<ActiveRun />} />
            <Route path="pickup-loading" element={<PickupLoading />} />
            <Route path="delivery-pod" element={<DeliveryPOD />} />
            <Route path="delivery" element={<DeliveryPOD />} />
            <Route path="safety-checklist" element={<StartWorkFinish />} />
            <Route path="work-status" element={<StartWorkFinish />} />
            <Route path="assigned-jobs" element={<Jobs />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="nearby-services" element={<NearbyServices />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="documents" element={<Documents />} />
            <Route path="create-draft-load" element={<CreateDraftLoad />} />
            <Route path="add-expense" element={<AddExpense />} />
            <Route path="fuel-expenses" element={<AddExpense />} />
            <Route path="messages" element={<DriverMessages />} />
            <Route path="timesheets" element={<Timesheets />} />
            <Route path="trailer-swap" element={<TrailerSwap />} />
            <Route path="equipment-change" element={<TrailerSwap />} />
            <Route path="offline-sync" element={<OfflineSyncQueue />} />
            <Route path="offline-queue" element={<OfflineSyncQueue />} />
            <Route path="my-pay" element={<MyPay />} />
            <Route path="contact-dispatch" element={<ContactDispatch />} />
            <Route path="leave-management" element={<LeaveManagement />} />
            <Route path="incident-reporting" element={<IncidentReporting />} />
            <Route path="maintenance-request" element={<MaintenanceRequest />} />
            <Route path="settings" element={<StartWorkFinish />} />
            <Route path="job/:id" element={<JobDetails />} />
          </Route>

          {/* ===== WAREHOUSE PORTAL ===== */}
          <Route path="/warehouse" element={<ProtectedRoute><DashboardLayout role="warehouse" /></ProtectedRoute>}>
            <Route index element={<WarehouseDashboard />} />
            <Route path="dashboard" element={<WarehouseDashboard />} />
            <Route path="find-stock" element={<WarehouseCurrentStock />} />
            <Route path="current-stock" element={<WarehouseCurrentStock />} />
            <Route path="find" element={<WarehouseCurrentStock />} />
            <Route path="receive-inbound" element={<WarehouseInbound />} />
            <Route path="inbound" element={<WarehouseInbound />} />
            <Route path="receive" element={<WarehouseInbound />} />
            <Route path="move-transfer" element={<WarehouseMovements />} />
            <Route path="movement-history" element={<WarehouseMovements />} />
            <Route path="movements" element={<WarehouseMovements />} />
            <Route path="move" element={<WarehouseMovements />} />
            <Route path="load-lanes" element={<WarehouseLoadLanes />} />
            <Route path="dispatch-ready" element={<WarehouseOutbound />} />
            <Route path="outbound" element={<WarehouseOutbound />} />
            <Route path="messages" element={<Messages />} />
            <Route path="my-shift" element={<WarehouseMyShift />} />
            <Route path="warehouse-yard-map" element={<WarehouseMap />} />
            <Route path="map" element={<WarehouseMap />} />
            <Route path="holding-areas" element={<WarehouseHoldingAreas />} />
            <Route path="stage" element={<WarehouseHoldingAreas />} />
            <Route path="scanning" element={<WarehouseScanning />} />
            <Route path="labels" element={<WarehouseLabels />} />
            <Route path="reports" element={<WarehouseReports />} />
            <Route path="tools" element={<Tools />} />
            <Route path="tools/:tab" element={<Tools />} />
            <Route path="profile" element={<WarehouseProfile />} />
            <Route path="settings" element={<CompanySettings />} />
            <Route path="*" element={<WarehouseDashboard />} />
          </Route>

          {/* ===== YARD ATTENDANT PORTAL ===== */}
          <Route path="/yard" element={<ProtectedRoute><DashboardLayout role="yard" /></ProtectedRoute>}>
            <Route index element={<YardDashboard />} />
            <Route path="work-status" element={<YardWorkStatus />} />
            <Route path="dashboard" element={<YardDashboard />} />
            <Route path="attendant-overview" element={<YardDashboard />} />
            <Route path="inbound" element={<WarehouseInbound />} />
            <Route path="receive" element={<WarehouseInbound />} />
            <Route path="outbound" element={<WarehouseOutbound />} />
            <Route path="current-stock" element={<WarehouseCurrentStock />} />
            <Route path="find" element={<WarehouseCurrentStock />} />
            <Route path="map" element={<WarehouseMap />} />
            <Route path="holding-areas" element={<WarehouseHoldingAreas />} />
            <Route path="stage" element={<WarehouseHoldingAreas />} />
            <Route path="load-lanes" element={<WarehouseLoadLanes />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="locations" element={<YardLocations />} />
            <Route path="loads" element={<Loads />} />
            <Route path="activities" element={<WarehouseReports />} />
            <Route path="scanning" element={<WarehouseScanning />} />
            <Route path="qr-scan" element={<WarehouseScanning />} />
            <Route path="labels" element={<WarehouseLabels />} />
            <Route path="movements" element={<YardMoveItem />} />
            <Route path="move" element={<YardMoveItem />} />
            <Route path="reports" element={<WarehouseReports />} />
            <Route path="report-issue" element={<YardReportIssue />} />
            {/* Backwards compatibility aliases */}
            <Route path="scan" element={<WarehouseScanning />} />
            <Route path="move-item" element={<YardMoveItem />} />
            <Route path="scan-in" element={<WarehouseInbound />} />
            <Route path="scan-out" element={<WarehouseOutbound />} />
            <Route path="load-lane" element={<WarehouseLoadLanes />} />
            <Route path="*" element={<YardDashboard />} />
          </Route>

          {/* ===== ACCOUNTS ===== */}
          <Route path="/accounts" element={<ProtectedRoute><DashboardLayout role="accounts" /></ProtectedRoute>}>
            <Route path="dashboard" element={<AccountsDashboard />} />
            <Route path="customer-pricing" element={<CustomerPricing />} />
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
            <Route path="profile" element={<AccountsProfile />} />
            <Route path="settings" element={<AccountsDashboard />} />
          </Route>

          {/* ===== CUSTOMER ===== */}
          <Route path="/customer" element={<ProtectedRoute><DashboardLayout role="customer" /></ProtectedRoute>}>
            <Route path="dashboard" element={<CustomerDashboard />} />
            <Route path="my-loads" element={<MyLoads />} />
            <Route path="create-booking" element={<LoadRequests />} />
            <Route path="invoices-payments" element={<CustomerInvoices />} />
            <Route path="documents-pods" element={<CustomerDocuments />} />
            <Route path="messages-support" element={<CustomerSupport />} />
            <Route path="account-users" element={<CustomerSettings />} />
            <Route path="track-delivery" element={<TrackDelivery />} />
            <Route path="documents" element={<CustomerDocuments />} />
            <Route path="invoices" element={<CustomerInvoices />} />
            <Route path="payments" element={<CustomerPayments />} />
            <Route path="load-requests" element={<LoadRequests />} />
            <Route path="notifications" element={<CustomerNotifications />} />
            <Route path="dispatcher-chat" element={<CustomerDispatcherChat />} />
            <Route path="support" element={<CustomerSupport />} />
            <Route path="settings" element={<Navigate to="/customer/account-users" replace />} />
          </Route>

        </Routes>
      </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
