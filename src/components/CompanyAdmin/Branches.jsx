import React, { useState } from 'react';
import { 
  Plus, Search, Filter, Download, Building, CheckCircle2, Clock, 
  AlertTriangle, Shield, Eye, Link2, MoreVertical, ChevronLeft, 
  ChevronRight, ArrowRight, Upload, FileText, Terminal, Info, 
  Settings, Bell, Users, Database, ChevronLeft as BackIcon,
  MapPin, Edit, Edit3, Truck, Phone, Mail, User, ShieldCheck, Check, 
  Briefcase, Lock, Coffee, XCircle, DollarSign, Calendar, ChevronDown,
  TrendingUp, TrendingDown, Star, Activity, BarChart2, Lightbulb
} from 'lucide-react';

const branchesData = [
  { id: 1, branchName: 'Sydney Head Office', branchCode: 'SYD-HO', company: 'Hero Logistics Pty Ltd', country: 'Australia', flag: '🇦🇺', state: 'NSW', manager: 'Sarah Mitchell', status: 'Active', loads: 245 },
  { id: 2, branchName: 'Melbourne Branch', branchCode: 'MEL-001', company: 'Hero Logistics Pty Ltd', country: 'Australia', flag: '🇦🇺', state: 'VIC', manager: 'James Patel', status: 'Active', loads: 189 },
  { id: 3, branchName: 'Brisbane Branch', branchCode: 'BNE-001', company: 'Hero Logistics Pty Ltd', country: 'Australia', flag: '🇦🇺', state: 'QLD', manager: 'David Williams', status: 'Active', loads: 156 },
  { id: 4, branchName: 'Perth Branch', branchCode: 'PER-001', company: 'Hero Logistics Pty Ltd', country: 'Australia', flag: '🇦🇺', state: 'WA', manager: 'Michael Brown', status: 'Active', loads: 98 },
  { id: 5, branchName: 'Adelaide Branch', branchCode: 'ADL-001', company: 'Hero Logistics Pty Ltd', country: 'Australia', flag: '🇦🇺', state: 'SA', manager: 'Lisa Johnson', status: 'Active', loads: 76 },
  { id: 6, branchName: 'Auckland Branch', branchCode: 'AKL-001', company: 'Hero Logistics NZ Ltd', country: 'New Zealand', flag: '🇳🇿', state: 'Auckland', manager: 'Mark Thompson', status: 'Active', loads: 142 },
  { id: 7, branchName: 'Christchurch Branch', branchCode: 'CHC-001', company: 'Hero Logistics NZ Ltd', country: 'New Zealand', flag: '🇳🇿', state: 'Canterbury', manager: 'Emma Wilson', status: 'Active', loads: 67 },
  { id: 8, branchName: 'Darwin Branch', branchCode: 'DRW-001', company: 'Hero Logistics Pty Ltd', country: 'Australia', flag: '🇦🇺', state: 'NT', manager: 'Daniel Lee', status: 'Pending Setup', loads: 0 },
  { id: 9, branchName: 'Gold Coast Branch', branchCode: 'GCS-001', company: 'Hero Logistics Pty Ltd', country: 'Australia', flag: '🇦🇺', state: 'QLD', manager: 'Ryan Clarke', status: 'Inactive', loads: 12 },
  { id: 10, branchName: 'Newcastle Branch', branchCode: 'NWC-001', company: 'Hero Logistics Pty Ltd', country: 'Australia', flag: '🇦🇺', state: 'NSW', manager: 'Sophie Taylor', status: 'Inactive', loads: 8 },
];

const branchStaffData = [
  { id: 1, name: 'Mitchell', email: 's.mitchell@herologistics.com.au', isPrimary: true, role: 'Branch Manager', roleColor: 'purple', department: 'Operations', payType: 'Salary', payRate: '$100,000 / year', permissions: 'Full Access', status: 'Active', lastLoginDate: '15 May 2025', lastLoginTime: '10:15 AM' },
  { id: 2, name: 'Patel', email: 'j.patel@herologistics.com.au', isPrimary: false, role: 'Dispatch Supervisor', roleColor: 'green', department: 'Dispatch', payType: 'Hourly', payRate: '$35.00 / hr', permissions: '38 / 72', status: 'Active', lastLoginDate: '15 May 2025', lastLoginTime: '09:33 AM' },
  { id: 3, name: 'Johnson', email: 'l.johnson@herologistics.com.au', isPrimary: false, role: 'Accounts Coordinator', roleColor: 'orange', department: 'Accounts', payType: 'Hourly', payRate: '$30.00 / hr', permissions: '24 / 72', status: 'Active', lastLoginDate: '14 May 2025', lastLoginTime: '04:50 PM' },
  { id: 4, name: 'Brown', email: 'm.brown@herologistics.com.au', isPrimary: false, role: 'Workshop Manager', roleColor: 'teal', department: 'Maintenance', payType: 'Hourly', payRate: '$38.00 / hr', permissions: '42 / 72', status: 'Active', lastLoginDate: '15 May 2025', lastLoginTime: '08:10 AM' },
  { id: 5, name: 'Iliamo', email: 'd.iliamo@herologistics.com.au', isPrimary: false, role: 'Warehouse Supervisor', roleColor: 'indigo', department: 'Warehouse', payType: 'Hourly', payRate: '$32.00 / hr', permissions: '30 / 72', status: 'Active', lastLoginDate: '14 May 2025', lastLoginTime: '11:20 AM' },
  { id: 6, name: 'Wilson', email: 'e.wilson@herologistics.com.au', isPrimary: false, role: 'Administrator', roleColor: 'blue', department: 'Administration', payType: 'Hourly', payRate: '$22.00 / hr', permissions: '45 / 72', status: 'Active', lastLoginDate: '15 May 2025', lastLoginTime: '03:05 PM' },
  { id: 7, name: 'G', email: 'd.g@herologistics.com.au', isPrimary: false, role: 'Dispatcher', roleColor: 'green', department: 'Dispatch', payType: 'Hourly', payRate: '$30.00 / hr', permissions: '28 / 72', status: 'Active', lastLoginDate: '15 May 2025', lastLoginTime: '07:55 AM' },
  { id: 8, name: 'Taylor', email: 's.taylor@herologistics.com.au', isPrimary: false, role: 'Safety Officer', roleColor: 'red', department: 'Compliance', payType: 'Hourly', payRate: '$35.00 / hr', permissions: '30 / 72', status: 'Active', lastLoginDate: '14 May 2025', lastLoginTime: '01:15 PM' },
];

const timesheetData = [
  { id: 1, name: 'Sarah Mitchell', initials: 'SM', initialsColor: 'purple', role: 'Branch Manager', department: 'Operations', payType: 'Salary', payColor: 'purple', clockInTime: '8:00 AM', clockInMethod: 'QR Code', clockInLocation: 'Office Entrance', breakTime: '12:30 PM - 1:00 PM (30m)', clockOutTime: '5:00 PM', clockOutMethod: 'QR Code', clockOutLocation: 'Office Entrance', totalHours: '8.50', estWages: '--', status: 'Completed' },
  { id: 2, name: 'James Patel', initials: 'JP', initialsColor: 'green', role: 'Dispatch Supervisor', department: 'Dispatch', payType: 'Hourly', payColor: 'gray', clockInTime: '7:45 AM', clockInMethod: 'NFC Tag', clockInLocation: 'Office Entrance', breakTime: '12:15 PM - 12:45 PM (30m)', clockOutTime: '5:15 PM', clockOutMethod: 'NFC Tag', clockOutLocation: 'Office Entrance', totalHours: '9.00', estWages: '$315.00', status: 'Completed' },
  { id: 3, name: 'Lisa Johnson', initials: 'LJ', initialsColor: 'orange', role: 'Accounts Coordinator', department: 'Accounts', payType: 'Hourly', payColor: 'gray', clockInTime: '9:00 AM', clockInMethod: 'Web Portal', clockInLocation: 'Front Desk', breakTime: '1:00 PM - 1:30 PM (30m)', clockOutTime: '5:00 PM', clockOutMethod: 'Web Portal', clockOutLocation: 'Front Desk', totalHours: '7.50', estWages: '$225.00', status: 'Completed' },
  { id: 4, name: 'Michael Brown', initials: 'MB', initialsColor: 'teal', role: 'Workshop Manager', department: 'Maintenance', payType: 'Hourly', payColor: 'gray', clockInTime: '6:30 AM', clockInMethod: 'QR Code', clockInLocation: 'Workshop Gate', breakTime: '11:00 AM - 11:15 AM (15m)', clockOutTime: '3:45 PM', clockOutMethod: 'QR Code', clockOutLocation: 'Workshop Gate', totalHours: '9.00', estWages: '$342.00', status: 'Completed' },
  { id: 5, name: 'David Williams', initials: 'DW', initialsColor: 'blue', role: 'Warehouse Supervisor', department: 'Warehouse', payType: 'Hourly', payColor: 'gray', clockInTime: '7:00 AM', clockInMethod: 'NFC Tag', clockInLocation: 'Warehouse Door', breakTime: '12:00 PM - 12:30 PM (30m)', clockOutTime: '3:30 PM', clockOutMethod: 'NFC Tag', clockOutLocation: 'Warehouse Door', totalHours: '8.00', estWages: '$256.00', status: 'Completed' },
  { id: 6, name: 'Emma Wilson', initials: 'EW', initialsColor: 'indigo', role: 'Administrator', department: 'Administration', payType: 'Hourly', payColor: 'gray', clockInTime: '8:15 AM', clockInMethod: 'QR Code', clockInLocation: 'Office Entrance', breakTime: '1:15 PM - 1:45 PM (30m)', clockOutTime: '4:45 PM', clockOutMethod: 'QR Code', clockOutLocation: 'Office Entrance', totalHours: '8.00', estWages: '$176.00', status: 'Completed' },
  { id: 7, name: 'Daniel Lee', initials: 'DL', initialsColor: 'green', role: 'Dispatcher', department: 'Dispatch', payType: 'Hourly', payColor: 'gray', clockInTime: '8:00 AM', clockInMethod: 'QR Code', clockInLocation: 'Office Entrance', breakTime: '12:30 PM - 1:00 PM (30m)', clockOutTime: '5:00 PM', clockOutMethod: 'QR Code', clockOutLocation: 'Office Entrance', totalHours: '8.50', estWages: '$240.00', status: 'Completed' },
  { id: 8, name: 'Sophie Taylor', initials: 'ST', initialsColor: 'red', role: 'Safety Officer', department: 'Compliance', payType: 'Hourly', payColor: 'gray', clockInTime: '8:30 AM', clockInMethod: 'Mobile App', clockInLocation: 'Office Entrance', breakTime: '1:00 PM - 1:30 PM (30m)', clockOutTime: '5:00 PM', clockOutMethod: 'Mobile App', clockOutLocation: 'Office Entrance', totalHours: '8.00', estWages: '$280.00', status: 'Completed' },
];

const leaveRequestsData = [
  { id: 1, name: 'James Patel', role: 'Dispatch', leaveType: 'Annual Leave', startDate: '20 May 2025', endDate: '22 May 2025', totalDays: '3.0', reason: 'Family vacation', status: 'Pending', statusColor: 'orange', appliedOn: '14 May 2025' },
  { id: 2, name: 'Lisa Johnson', role: 'Accounts', leaveType: 'Sick Leave', startDate: '14 May 2025', endDate: '14 May 2025', totalDays: '1.0', reason: 'Medical appointment', status: 'Approved', statusColor: 'green', appliedOn: '13 May 2025' },
  { id: 3, name: 'David Williams', role: 'Warehouse', leaveType: 'Annual Leave', startDate: '2 Jun 2025', endDate: '6 Jun 2025', totalDays: '5.0', reason: 'Overseas trip', status: 'Approved', statusColor: 'green', appliedOn: '10 May 2025' },
  { id: 4, name: 'Emma Wilson', role: 'Administration', leaveType: 'Personal Leave', startDate: '21 May 2025', endDate: '21 May 2025', totalDays: '1.0', reason: 'Personal matters', status: 'Rejected', statusColor: 'red', appliedOn: '12 May 2025' },
];

const assetsData = [
  { id: 1, name: 'B-DOUBLE 101', rego: 'NSW-BD101', type: 'Truck', typeColor: 'blue', icon: <Truck size={14}/>, category: 'Rigid Truck', assignedTo: 'Sydney Head Office Fleet', status: 'Active', condition: 'Good', conditionColor: 'green', nextService: '15 Jun 2025', nextServiceSub: 'in 30 days', serviceColor: 'gray' },
  { id: 2, name: 'Trailer T-71', rego: 'NSW-TT23', type: 'Trailer', typeColor: 'yellow', icon: <Truck size={14}/>, category: 'Curtain Sider', assignedTo: 'Sydney Head Office Fleet', status: 'Active', condition: 'Good', conditionColor: 'green', nextService: '10 Jun 2025', nextServiceSub: 'in 25 days', serviceColor: 'gray' },
  { id: 3, name: 'Forklift FL-03', rego: 'HYSTER H2.5', type: 'Asset', typeColor: 'red', icon: <Building size={14}/>, category: 'Forklift', assignedTo: 'Warehouse 1 (SYD-HO)', status: 'Active', condition: 'Good', conditionColor: 'green', nextService: '12 May 2025', nextServiceSub: 'in 3 days', serviceColor: 'red' },
  { id: 4, name: 'Container C-001', rego: '20ft GP', type: 'Asset', typeColor: 'red', icon: <Box size={14}/>, category: 'Container 20ft', assignedTo: 'Yard - Sydney HO', status: 'Active', condition: 'Fair', conditionColor: 'orange', nextService: 'N/A', nextServiceSub: '', serviceColor: 'gray' },
  { id: 5, name: 'Pallet Jack PJ-02', rego: 'CROWN PTH50', type: 'Asset', typeColor: 'red', icon: <Tool size={14}/>, category: 'Material Handling', assignedTo: 'Warehouse 1 (SYD-HO)', status: 'Active', condition: 'Good', conditionColor: 'green', nextService: '01 Jun 2025', nextServiceSub: 'in 16 days', serviceColor: 'gray' },
  { id: 6, name: 'Generator G-01', rego: '50kVA CUMMINS', type: 'Asset', typeColor: 'red', icon: <Zap size={14}/>, category: 'Power Equipment', assignedTo: 'Yard - Sydney HO', status: 'Active', condition: 'Good', conditionColor: 'green', nextService: '05 Jun 2025', nextServiceSub: 'in 20 days', serviceColor: 'gray' },
  { id: 7, name: 'iPad Pro 12.9"', rego: 'IPAD-023', type: 'Asset', typeColor: 'red', icon: <Monitor size={14}/>, category: 'IT Equipment', assignedTo: 'Sydney Head Office', status: 'Active', condition: 'Good', conditionColor: 'green', nextService: 'N/A', nextServiceSub: '', serviceColor: 'gray' },
  { id: 8, name: 'Ute UTE-05', rego: 'NSW-UTE05', type: 'Vehicle', typeColor: 'teal', icon: <Car size={14}/>, category: 'Light Vehicle', assignedTo: 'Sydney Head Office Fleet', status: 'Active', condition: 'Good', conditionColor: 'green', nextService: '25 May 2025', nextServiceSub: 'in 10 days', serviceColor: 'gray' },
];

function Box({size}) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>; }
function Tool({size}) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>; }
function Zap({size}) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>; }
function Monitor({size}) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>; }
function Car({size}) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><path d="M9 17h6"></path><circle cx="17" cy="17" r="2"></circle></svg>; }

export default function Branches() {
  const [search, setSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [activeTimeSubTab, setActiveTimeSubTab] = useState('Timesheet');
  const [isAddingBranch, setIsAddingBranch] = useState(false);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Active':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold text-green-600 bg-green-50 border border-green-200">Active</span>;
      case 'Pending Setup':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200 whitespace-nowrap">Pending Setup</span>;
      case 'Inactive':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-200">Inactive</span>;
      case 'Completed':
         return <span className="px-2 py-0.5 rounded text-[10px] font-bold text-green-600 bg-green-50 border border-green-200">Completed</span>;
      case 'Pending':
         return <span className="px-2 py-0.5 rounded text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200">Pending</span>;
      case 'Approved':
         return <span className="px-2 py-0.5 rounded text-[10px] font-bold text-green-600 bg-green-50 border border-green-200">Approved</span>;
      case 'Rejected':
         return <span className="px-2 py-0.5 rounded text-[10px] font-bold text-red-600 bg-red-50 border border-red-200">Rejected</span>;
      default:
        return null;
    }
  };

  const getRoleBadge = (role, color) => {
    const colorClasses = {
      purple: 'text-purple-600 bg-purple-50 border-purple-200',
      green: 'text-green-600 bg-green-50 border-green-200',
      orange: 'text-orange-600 bg-orange-50 border-orange-200',
      teal: 'text-teal-600 bg-teal-50 border-teal-200',
      indigo: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      blue: 'text-blue-600 bg-blue-50 border-blue-200',
      yellow: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      red: 'text-red-600 bg-red-50 border-red-200'
    };
    return (
       <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${colorClasses[color] || colorClasses.blue}`}>{role}</span>
    );
  };

  const getInitialsBadge = (initials, color) => {
    const colorClasses = {
      purple: 'text-purple-600 bg-purple-50 border-purple-100',
      green: 'text-green-600 bg-green-50 border-green-100',
      orange: 'text-orange-600 bg-orange-50 border-orange-100',
      teal: 'text-teal-600 bg-teal-50 border-teal-100',
      indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      blue: 'text-blue-600 bg-blue-50 border-blue-100',
      red: 'text-red-600 bg-red-50 border-red-100'
    };
    return (
       <div className={`w-8 h-8 rounded border flex items-center justify-center shrink-0 font-bold text-[12px] ${colorClasses[color] || colorClasses.blue}`}>{initials}</div>
    );
  };

  if (isAddingBranch) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] p-4 sm:p-6 lg:p-8 font-sans pb-24">
        
        {/* Header Breadcrumbs */}
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-2 text-[12px] text-gray-500 font-semibold tracking-wide">
              <BackIcon size={12} />
              <span className="hover:text-purple-600 cursor-pointer" onClick={() => setIsAddingBranch(false)}>ADMIN PORTAL</span>
              <span>/</span>
              <span className="text-gray-900">Add New Branch</span>
           </div>
        </div>

        {/* Main Form Grid */}
        <div className="max-w-5xl mx-auto flex flex-col gap-6">
           
           {/* BRANCH DETAILS CARD */}
           <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-6">
                 <div className="w-6 h-6 rounded bg-yellow-50 flex items-center justify-center shrink-0"><Building size={14} className="text-yellow-600" /></div>
                 BRANCH DETAILS
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                 {/* Branch Name */}
                 <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">BRANCH NAME</label>
                    <input 
                       type="text" 
                       placeholder="e.g. Sydney West Depot" 
                       className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 shadow-sm"
                    />
                 </div>
                 
                 {/* Branch Type */}
                 <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">BRANCH TYPE</label>
                    <div className="relative">
                       <select className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 shadow-sm appearance-none cursor-pointer">
                          <option>Local Branch</option>
                          <option>Head Office</option>
                          <option>Distribution Center</option>
                       </select>
                       <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                 </div>

                 {/* Address */}
                 <div className="flex flex-col gap-1.5 md:col-span-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">ADDRESS</label>
                    <div className="relative">
                       <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                       <input 
                          type="text" 
                          placeholder="123 Industrial Dr, Suburb, VIC 3000" 
                          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 shadow-sm"
                       />
                    </div>
                 </div>

                 {/* Branch Code / ID */}
                 <div className="flex flex-col gap-1.5 md:col-span-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">BRANCH CODE / ID</label>
                    <input 
                       type="text" 
                       placeholder="e.g. SYD-WEST" 
                       className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 shadow-sm"
                    />
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* MANAGEMENT CARD */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                 <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-6">
                    <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center shrink-0"><Users size={14} className="text-blue-600" /></div>
                    MANAGEMENT
                 </h3>
                 
                 <div className="flex flex-col gap-5">
                    {/* Manager Name */}
                    <div className="flex flex-col gap-1.5">
                       <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">MANAGER NAME</label>
                       <input 
                          type="text" 
                          placeholder="Enter full name" 
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 shadow-sm"
                       />
                    </div>
                    
                    {/* Phone Number */}
                    <div className="flex flex-col gap-1.5">
                       <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">PHONE NUMBER</label>
                       <div className="relative">
                          <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                             type="text" 
                             placeholder="+61 400 000 000" 
                             className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 shadow-sm"
                          />
                       </div>
                    </div>
                 </div>
              </div>

              {/* CAPACITY & HOURS CARD */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                 <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-6">
                    <div className="w-6 h-6 rounded bg-green-50 flex items-center justify-center shrink-0"><Clock size={14} className="text-green-600" /></div>
                    CAPACITY & HOURS
                 </h3>
                 
                 <div className="flex flex-col gap-5">
                    {/* Working Hours */}
                    <div className="flex flex-col gap-1.5">
                       <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">WORKING HOURS</label>
                       <input 
                          type="text" 
                          placeholder="08:00 - 18:00" 
                          defaultValue="08:00 - 18:00"
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 shadow-sm"
                       />
                    </div>
                    
                    {/* Storage Space */}
                    <div className="flex flex-col gap-1.5">
                       <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">STORAGE SPACE (SQM)</label>
                       <input 
                          type="text" 
                          placeholder="1000" 
                          defaultValue="1000"
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 shadow-sm"
                       />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Bottom Sticky Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-end items-center gap-4 z-10 sm:pl-[240px]">
           <button onClick={() => setIsAddingBranch(false)} className="px-6 py-2.5 text-gray-600 font-bold text-[13px] hover:text-gray-900 transition-colors cursor-pointer">
              CANCEL
           </button>
           <button onClick={() => setIsAddingBranch(false)} className="flex items-center gap-2 px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-yellow-950 rounded-lg text-[13px] font-bold shadow-sm transition-colors cursor-pointer">
              <CheckCircle2 size={16} /> SAVE BRANCH
           </button>
        </div>
      </div>
    );
  }

  if (selectedBranch) {
    const isStaffTab = activeTab === 'Staff & Permissions';
    const isTimeTab = activeTab === 'Time Attendance & Wages';
    const isAssetsTab = activeTab === 'Assets & Fleet';
    const isPerfTab = activeTab === 'Performance';

    let pageTitle = '7.2 Branch Details';
    let pageSubtitle = 'View and manage detailed information for this branch.';
    if (isStaffTab) {
       pageTitle = '7.3 Branch Staff & Permissions';
       pageSubtitle = 'Manage branch staff, roles, permissions and time & pay settings.';
    } else if (isTimeTab) {
       pageTitle = '7.4 Branch Time Attendance & Wages';
       pageSubtitle = 'Track staff time, attendance, leave and calculate wages.';
    } else if (isAssetsTab) {
       pageTitle = '7.5 Branch Assets & Fleet Assignments';
       pageSubtitle = 'View and manage all vehicles and assets assigned to this branch.';
    } else if (isPerfTab) {
       pageTitle = '7.6 Branch Performance Dashboard';
       pageSubtitle = 'Real-time overview of branch performance, KPIs and operational insights.';
    }

    return (
      <div className="min-h-screen bg-[#f8f9fc] p-4 sm:p-6 lg:p-8 font-sans">
        
        {/* Header Breadcrumbs */}
         <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">
            <div>
               <div className="flex items-center gap-2 text-[12px] text-gray-500 mb-1 font-semibold tracking-wide flex-wrap">
                  <span>Home</span>
                  <ChevronRight size={12} className="shrink-0" />
                  <span className="hover:text-purple-600 cursor-pointer whitespace-nowrap" onClick={() => setSelectedBranch(null)}>Branches</span>
                  <ChevronRight size={12} className="shrink-0" />
                  <span className="hover:text-purple-600 cursor-pointer whitespace-nowrap" onClick={() => setActiveTab('Overview')}>Depot List</span>
                  <ChevronRight size={12} className="shrink-0" />
                  <span className={activeTab === 'Overview' ? "text-gray-900 whitespace-nowrap" : "hover:text-purple-600 cursor-pointer whitespace-nowrap"} onClick={() => setActiveTab('Overview')}>Branch Details</span>
                  {activeTab !== 'Overview' && (
                     <>
                        <ChevronRight size={12} className="shrink-0" />
                        <span className="text-gray-900 whitespace-nowrap">{isStaffTab ? 'Staff & Permissions' : isTimeTab ? 'Time Attendance & Wages' : isAssetsTab ? 'Branch Assets' : 'Branch Performance Dashboard'}</span>
                     </>
                  )}
               </div>
               <div className="flex items-center gap-2">
                 <h1 className="text-2xl font-black text-gray-900 tracking-tight">{pageTitle}</h1>
                 <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0"><CheckCircle2 size={12} /></div>
               </div>
               <p className="text-sm text-gray-500 font-medium mt-1">{pageSubtitle}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto">
               {activeTab !== 'Overview' ? (
                  <>
                     <button onClick={() => setActiveTab('Overview')} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
                        <BackIcon size={16} /> Back to Branch Details
                     </button>
                     {isStaffTab ? (
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-purple-200 text-purple-700 rounded-lg text-sm font-bold shadow-sm hover:bg-purple-50 transition-colors cursor-pointer whitespace-nowrap">
                           <Plus size={14} /> Invite Staff
                        </button>
                     ) : isTimeTab ? (
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-50 transition-colors cursor-pointer whitespace-nowrap">
                           <Download size={14} /> Export Timesheets
                        </button>
                     ) : isAssetsTab ? (
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-purple-200 text-purple-700 rounded-lg text-sm font-bold shadow-sm hover:bg-purple-50 transition-colors cursor-pointer whitespace-nowrap">
                           <Plus size={14} /> Assign Asset / Vehicle
                        </button>
                     ) : isPerfTab ? (
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-50 transition-colors cursor-pointer whitespace-nowrap">
                           <Download size={14} /> Export Dashboard
                        </button>
                     ) : null}
                  </>
               ) : (
                  <>
                     <button onClick={() => setSelectedBranch(null)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
                        <BackIcon size={16} /> Back to Branch List
                     </button>
                     <button onClick={() => setIsAddingBranch(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-purple-200 text-purple-700 rounded-lg text-sm font-bold shadow-sm hover:bg-purple-50 transition-colors cursor-pointer whitespace-nowrap">
                        <Edit size={14} /> Edit Branch
                     </button>
                  </>
               )}
               <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap">
                  More Actions <ChevronRight size={14} className="rotate-90" />
               </button>
            </div>
         </div>

        {/* Top Branch Profile Card for Overview */}
        {activeTab === 'Overview' && (
           <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                 <div className="flex flex-col gap-3 shrink-0">
                    <div className="w-[300px] h-[160px] rounded-xl overflow-hidden bg-gray-100 border border-gray-200 relative">
                       <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=60" alt="Branch" className="w-full h-full object-cover" />
                    </div>
                    <button className="w-full py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-[13px] font-bold shadow-sm hover:bg-gray-50 transition-colors cursor-pointer text-center flex items-center justify-center gap-2">
                       <Upload size={14}/> Upload / Change Photo
                    </button>
                 </div>
                 <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 text-sm">
                    <div className="col-span-full">
                       <div className="flex items-center gap-3 mb-1">
                          <h2 className="text-xl font-black text-gray-900">{selectedBranch.branchName}</h2>
                          {getStatusBadge(selectedBranch.status)}
                       </div>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                       <div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Branch Code</div>
                          <div className="font-bold text-gray-900">{selectedBranch.branchCode}</div>
                       </div>
                       <div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Branch Type</div>
                          <div className="font-bold text-gray-900">Head Office</div>
                       </div>
                    </div>

                    <div className="flex flex-col gap-4">
                       <div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Branch Manager</div>
                          <div className="font-bold text-gray-900">{selectedBranch.manager}</div>
                       </div>
                       <div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Phone</div>
                          <div className="font-bold text-gray-900">+61 2 9123 4567</div>
                       </div>
                       <div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Email</div>
                          <div className="font-bold text-purple-600">sarah.mitchell@herologistics.com.au</div>
                       </div>
                    </div>

                    <div className="flex flex-col gap-4">
                       <div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Address</div>
                          <div className="font-bold text-gray-900">25 Logistics Drive<br/>Eastern Creek, NSW 2766<br/>Australia</div>
                       </div>
                       <div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Time Zone</div>
                          <div className="font-bold text-gray-900">Australia/Sydney (AEST)</div>
                       </div>
                    </div>

                    <div className="flex flex-col gap-4">
                       <div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Status</div>
                          <div className="flex items-center gap-1.5 font-bold text-gray-900"><div className="w-2 h-2 rounded-full bg-green-500"></div> Active</div>
                       </div>
                       <div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Established</div>
                          <div className="font-bold text-gray-900">01 Jan 2020</div>
                       </div>
                    </div>

                    <div className="flex flex-col gap-4">
                       <div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Currency</div>
                          <div className="font-bold text-gray-900">AUD - Australian Dollar</div>
                       </div>
                       <div>
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Payment Terms</div>
                          <div className="font-bold text-gray-900">30 Days</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* Mini Branch Profile Row for other tabs */}
        {activeTab !== 'Overview' && (
           <div className={`flex flex-col lg:flex-row gap-6 items-center mb-6`}>
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex gap-6 items-center flex-grow w-full">
                 <div className="flex flex-col gap-2 shrink-0">
                    <div className="w-32 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                       <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&auto=format&fit=crop&q=60" alt="Branch" className="w-full h-full object-cover" />
                    </div>
                    <button className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center justify-center gap-1 w-full"><Edit3 size={10}/> Change Branch</button>
                 </div>
                 
                 <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-4 text-[12px]">
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          <div className="font-black text-gray-900 text-[14px]">{selectedBranch.branchName}</div>
                          {getStatusBadge(selectedBranch.status)}
                       </div>
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 mb-0.5">Branch Code</div>
                       <div className="font-bold text-gray-900">{selectedBranch.branchCode}</div>
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 mb-0.5">Company</div>
                       <div className="font-bold text-gray-900">{selectedBranch.company}</div>
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 mb-0.5">Branch Type</div>
                       <div className="font-bold text-gray-900">Head Office</div>
                    </div>
                    <div>
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1 mb-0.5">Branch Manager</div>
                       <div className="font-bold text-gray-900">{selectedBranch.manager}</div>
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 mb-0.5">Phone</div>
                       <div className="font-bold text-gray-900">+61 2 9123 4567</div>
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 mb-0.5">Email</div>
                       <div className="font-bold text-purple-600 truncate">sarah.mitchell@herologistics.com.au</div>
                    </div>
                    <div>
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1 mb-0.5">Address</div>
                       <div className="font-bold text-gray-900">25 Logistics Drive<br/>Eastern Creek, NSW 2766<br/>Australia</div>
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 mb-0.5">Time Zone</div>
                       <div className="font-bold text-gray-900">Australia/Sydney (AEST)</div>
                    </div>
                    <div>
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1 mb-0.5">Status</div>
                       <div className="flex items-center gap-1.5 font-bold text-green-600"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Active</div>
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 mb-0.5">Established</div>
                       <div className="font-bold text-gray-900">01 Jan 2020</div>
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 mb-0.5">Currency</div>
                       <div className="font-bold text-gray-900">AUD - Australian Dollar</div>
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 mb-0.5">Payment Terms</div>
                       <div className="font-bold text-gray-900">30 Days</div>
                    </div>
                 </div>
              </div>
              
              {/* Date Filter specifically for Performance tab */}
              {isPerfTab && (
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex flex-col justify-center shrink-0 w-full lg:w-72 h-[120px]">
                    <div className="flex items-center gap-2 mb-3 text-[12px] font-bold text-gray-700">
                       <Calendar size={14} className="text-gray-400" /> 01 May 2025 - 31 May 2025
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                       <select className="flex-grow border border-gray-200 bg-white rounded-lg px-3 py-2 text-[12px] font-bold text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                          <option>Custom Range</option>
                       </select>
                       <button className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-[12px] font-bold shadow-sm hover:bg-gray-50 cursor-pointer shrink-0">
                          <Filter size={14} /> Filters
                       </button>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                       <span className="shrink-0">Compare with</span>
                       <select className="w-full border border-gray-200 bg-white rounded-md px-2 py-1 focus:outline-none cursor-pointer">
                          <option>Previous Month (01 Apr - 30 Apr 2025)</option>
                       </select>
                    </div>
                 </div>
              )}
           </div>
        )}

        {/* Tabs */}
        <div className="flex overflow-x-auto min-w-0 border-b border-gray-200 mb-6 gap-6 shrink-0">
           {['Overview', 'Staff & Permissions', 'Time Attendance & Wages', 'Assets & Fleet', 'Performance', 'Documents', 'Settings', 'Activity History'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[13px] font-bold tracking-wide relative whitespace-nowrap cursor-pointer shrink-0 ${activeTab === tab ? 'text-purple-700 border-b-2 border-purple-700' : 'text-gray-500 hover:text-gray-700'}`}
              >
                 {tab}
              </button>
           ))}
        </div>

        {/* Dynamic Tab Content */}
        {activeTab === 'Overview' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (Wide) */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                 {/* Branch Information */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 relative">
                    <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100">
                       <MapPin size={14} />
                    </div>
                    <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-6">BRANCH INFORMATION</h3>
                    
                    <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                       <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">Branch Name</div>
                          <div className="text-[12px] font-bold text-gray-900">{selectedBranch.branchName}</div>
                       </div>
                       <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">Country</div>
                          <div className="text-[12px] font-bold text-gray-900 flex items-center gap-1.5">{selectedBranch.flag} {selectedBranch.country}</div>
                       </div>
                       <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">Branch Code</div>
                          <div className="text-[12px] font-bold text-gray-900">{selectedBranch.branchCode}</div>
                       </div>
                       <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">State / Region</div>
                          <div className="text-[12px] font-bold text-gray-900">{selectedBranch.state}</div>
                       </div>
                       <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">Company</div>
                          <div className="text-[12px] font-bold text-gray-900">{selectedBranch.company}</div>
                       </div>
                       <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">Postal Code</div>
                          <div className="text-[12px] font-bold text-gray-900">2766</div>
                       </div>
                       <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">Branch Type</div>
                          <div className="text-[12px] font-bold text-gray-900">Head Office</div>
                       </div>
                       <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">Latitude / Longitude</div>
                          <div className="text-[12px] font-bold text-gray-900">-33.8888, 150.0031</div>
                       </div>
                       <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">Manager</div>
                          <div className="text-[12px] font-bold text-gray-900">{selectedBranch.manager}</div>
                       </div>
                       <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">ABN</div>
                          <div className="text-[12px] font-bold text-gray-900">12 345 678 901</div>
                       </div>
                       <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">Phone</div>
                          <div className="text-[12px] font-bold text-gray-900">+61 2 9123 4567</div>
                       </div>
                       <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">ACN</div>
                          <div className="text-[12px] font-bold text-gray-900">123 456 789</div>
                       </div>
                       <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">Email</div>
                          <div className="text-[12px] font-bold text-purple-600 truncate">sarah.mitchell@herologistics.com.au</div>
                       </div>
                       <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">Default Currency</div>
                          <div className="text-[12px] font-bold text-gray-900">AUD - Australian Dollar</div>
                       </div>
                       <div className="col-span-2">
                          <div className="text-[10px] text-gray-500 mb-0.5">Website</div>
                          <div className="text-[12px] font-bold text-purple-600">www.herologistics.com.au</div>
                       </div>
                    </div>
                 </div>

                 {/* Branch Settings */}
                 <div>
                    <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4">BRANCH SETTINGS</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                          <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mb-1"><Clock size={16}/></div>
                          <div>
                             <div className="text-[12px] font-black text-gray-900 mb-1">Operational Hours</div>
                             <div className="text-[11px] font-medium text-gray-600 mb-0.5">Mon - Fri: 7:00 AM - 6:00 PM</div>
                             <div className="text-[11px] font-medium text-gray-600">Sat - Sun: Closed</div>
                          </div>
                          <div className="mt-auto pt-2"><span className="text-[11px] font-bold text-purple-700 hover:underline cursor-pointer">Edit Hours</span></div>
                       </div>
                       <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                          <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mb-1"><Truck size={16}/></div>
                          <div>
                             <div className="text-[12px] font-black text-gray-900 mb-1">Branch Defaults</div>
                             <div className="text-[11px] font-medium text-gray-600 mb-0.5">Default Load Type: Car Carrier</div>
                             <div className="text-[11px] font-medium text-gray-600">Default Payment Terms: 30 Days</div>
                          </div>
                          <div className="mt-auto pt-2"><span className="text-[11px] font-bold text-purple-700 hover:underline cursor-pointer">Edit Defaults</span></div>
                       </div>
                       <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                          <div className="w-8 h-8 rounded bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mb-1"><Bell size={16}/></div>
                          <div>
                             <div className="text-[12px] font-black text-gray-900 mb-1">Notification Preferences</div>
                             <div className="text-[11px] font-medium text-gray-600 mb-0.5">Email Notifications: Enabled</div>
                             <div className="text-[11px] font-medium text-gray-600">SMS Notifications: Enabled</div>
                          </div>
                          <div className="mt-auto pt-2"><span className="text-[11px] font-bold text-purple-700 hover:underline cursor-pointer">Edit Preferences</span></div>
                       </div>
                       <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                          <div className="w-8 h-8 rounded bg-green-50 text-green-600 flex items-center justify-center shrink-0 mb-1"><ShieldCheck size={16}/></div>
                          <div>
                             <div className="text-[12px] font-black text-gray-900 mb-1">Compliance & Safety</div>
                             <div className="text-[11px] font-medium text-gray-600 mb-0.5">Safety Check Required: Yes</div>
                             <div className="text-[11px] font-medium text-gray-600">Pre-Start Checklist: Enabled</div>
                          </div>
                          <div className="mt-auto pt-2"><span className="text-[11px] font-bold text-purple-700 hover:underline cursor-pointer">Edit Compliance</span></div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Middle Column */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-50">
                       <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">BRANCH CONTACTS</h3>
                       <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0"><Plus size={10}/> Add Contact</span>
                    </div>
                    <div className="flex flex-col gap-4">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 font-bold text-[12px]">SM</div>
                          <div className="flex-grow min-w-0">
                             <div className="flex items-center gap-2 mb-0.5">
                                <div className="text-[12px] font-bold text-gray-900 truncate">Sarah Mitchell</div>
                                <span className="text-[8px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-1 rounded uppercase">Primary</span>
                             </div>
                             <div className="text-[10px] text-gray-500">Branch Manager</div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400 shrink-0">
                             <Phone size={12} className="hover:text-purple-600 cursor-pointer" />
                             <Mail size={12} className="hover:text-purple-600 cursor-pointer" />
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-green-50 border border-green-100 flex items-center justify-center text-green-600 shrink-0 font-bold text-[12px]">JP</div>
                          <div className="flex-grow min-w-0">
                             <div className="text-[12px] font-bold text-gray-900 mb-0.5 truncate">James Patel</div>
                             <div className="text-[10px] text-gray-500">Dispatch Supervisor</div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400 shrink-0">
                             <Phone size={12} className="hover:text-purple-600 cursor-pointer" />
                             <Mail size={12} className="hover:text-purple-600 cursor-pointer" />
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0 font-bold text-[12px]">LJ</div>
                          <div className="flex-grow min-w-0">
                             <div className="text-[12px] font-bold text-gray-900 mb-0.5 truncate">Lisa Johnson</div>
                             <div className="text-[10px] text-gray-500">Accounts Coordinator</div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400 shrink-0">
                             <Phone size={12} className="hover:text-purple-600 cursor-pointer" />
                             <Mail size={12} className="hover:text-purple-600 cursor-pointer" />
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0 font-bold text-[12px]">MB</div>
                          <div className="flex-grow min-w-0">
                             <div className="text-[12px] font-bold text-gray-900 mb-0.5 truncate">Michael Brown</div>
                             <div className="text-[10px] text-gray-500">Workshop Manager</div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400 shrink-0">
                             <Phone size={12} className="hover:text-purple-600 cursor-pointer" />
                             <Mail size={12} className="hover:text-purple-600 cursor-pointer" />
                          </div>
                       </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-50 text-right">
                       <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center justify-end gap-1 shrink-0">View All Contacts <ArrowRight size={10}/></span>
                    </div>
                 </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                 {/* Branch Overview */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4 pb-3 border-b border-gray-50">BRANCH OVERVIEW</h3>
                    <div className="grid grid-cols-2 gap-3">
                       <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex items-center gap-3">
                          <div className="text-purple-600"><CheckCircle2 size={16}/></div>
                          <div>
                             <div className="text-[14px] font-black text-gray-900 leading-none mb-1">245</div>
                             <div className="text-[9px] font-bold text-gray-500 uppercase">Active Loads</div>
                          </div>
                       </div>
                       <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex items-center gap-3">
                          <div className="text-green-600"><User size={16}/></div>
                          <div>
                             <div className="text-[14px] font-black text-gray-900 leading-none mb-1">18</div>
                             <div className="text-[9px] font-bold text-gray-500 uppercase">Active Drivers</div>
                          </div>
                       </div>
                       <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex items-center gap-3">
                          <div className="text-orange-500"><Truck size={16}/></div>
                          <div>
                             <div className="text-[14px] font-black text-gray-900 leading-none mb-1">32</div>
                             <div className="text-[9px] font-bold text-gray-500 uppercase">Trucks</div>
                          </div>
                       </div>
                       <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex items-center gap-3">
                          <div className="text-orange-500"><AlertTriangle size={16} className="rotate-180"/></div>
                          <div>
                             <div className="text-[14px] font-black text-gray-900 leading-none mb-1">12</div>
                             <div className="text-[9px] font-bold text-gray-500 uppercase">Trailers</div>
                          </div>
                       </div>
                       <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex items-center gap-3">
                          <div className="text-red-500"><Building size={16}/></div>
                          <div>
                             <div className="text-[14px] font-black text-gray-900 leading-none mb-1">3</div>
                             <div className="text-[9px] font-bold text-gray-500 uppercase">Warehouses</div>
                          </div>
                       </div>
                       <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex items-center gap-3">
                          <div className="text-indigo-500"><Briefcase size={16}/></div>
                          <div>
                             <div className="text-[14px] font-black text-gray-900 leading-none mb-1">7</div>
                             <div className="text-[9px] font-bold text-gray-500 uppercase">Customers</div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Performance */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4 pb-3 border-b border-gray-50">PERFORMANCE (THIS MONTH)</h3>
                    <div className="flex flex-col gap-4 text-[12px] font-bold">
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-gray-600"><Clock size={14}/> On-Time Delivery</div>
                          <span className="text-gray-900">94.2%</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-gray-600"><CheckCircle2 size={14}/> Load Completion</div>
                          <span className="text-gray-900">98.1%</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-gray-600"><Truck size={14}/> Vehicle Utilization</div>
                          <span className="text-gray-900">78.6%</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-gray-600"><ShieldCheck size={14}/> Safety Score</div>
                          <span className="text-gray-900">91 / 100</span>
                       </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-50 text-right">
                       <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center justify-end gap-1 shrink-0">View Full Performance <ArrowRight size={10}/></span>
                    </div>
                 </div>

                 {/* Recent Activity */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4 pb-3 border-b border-gray-50">RECENT ACTIVITY</h3>
                    <div className="flex flex-col gap-4 relative">
                       <div className="absolute left-2.5 top-2 bottom-2 w-px bg-gray-100"></div>
                       <div className="flex gap-3 relative z-10">
                          <div className="w-5 h-5 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-600 shrink-0 mt-0.5"><Check size={10}/></div>
                          <div>
                             <div className="text-[11px] font-bold text-gray-900 mb-0.5">Load L-100256 completed</div>
                             <div className="text-[9px] text-gray-500 font-medium">15 May 2025 09:45 AM</div>
                          </div>
                       </div>
                       <div className="flex gap-3 relative z-10">
                          <div className="w-5 h-5 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0 mt-0.5"><Settings size={10}/></div>
                          <div>
                             <div className="text-[11px] font-bold text-gray-900 mb-0.5">Service completed for T101</div>
                             <div className="text-[9px] text-gray-500 font-medium">15 May 2025 08:30 AM</div>
                          </div>
                       </div>
                       <div className="flex gap-3 relative z-10">
                          <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 mt-0.5"><FileText size={10}/></div>
                          <div>
                             <div className="text-[11px] font-bold text-gray-900 mb-0.5">Document uploaded</div>
                             <div className="text-[9px] text-gray-500 font-medium">14 May 2025 04:15 PM</div>
                          </div>
                       </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-50 text-right">
                       <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center justify-end gap-1 shrink-0">View All Activity <ArrowRight size={10}/></span>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* Staff & Permissions Tab Content */}
        {activeTab === 'Staff & Permissions' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column (Table) */}
              <div className="lg:col-span-9 flex flex-col h-full">
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col flex-grow">
                    <div className="p-5 border-b border-gray-100">
                       <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4">BRANCH STAFF (18)</h3>
                       
                       <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                          <div className="relative w-full sm:w-64">
                             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                             <input 
                                type="text" 
                                placeholder="Search staff..." 
                                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-purple-300 shadow-sm"
                             />
                          </div>
                          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto min-w-0">
                             <select className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-[12px] font-bold text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                                <option>All Roles</option>
                             </select>
                             <select className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-[12px] font-bold text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                                <option>All Departments</option>
                             </select>
                             <select className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-[12px] font-bold text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                                <option>All Status</option>
                             </select>
                             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-[12px] font-bold shadow-sm hover:bg-gray-50 cursor-pointer shrink-0">
                                <Filter size={14} /> Filters
                             </button>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-2 mt-4">
                          <button className="flex items-center justify-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded text-[11px] font-bold shadow-sm hover:bg-gray-50 cursor-pointer shrink-0">
                             <Download size={12} /> Export
                          </button>
                          <button className="flex items-center justify-center px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded text-[11px] font-bold shadow-sm hover:bg-gray-50 cursor-pointer shrink-0">
                             <Upload size={12} />
                          </button>
                       </div>
                    </div>
                    
                    <div className="overflow-x-auto min-w-0">
                       <table className="w-full text-left text-[12px]">
                          <thead>
                             <tr className="border-b border-gray-100 text-[10px] font-black text-gray-500 uppercase tracking-widest bg-gray-50/50">
                                <th className="py-3.5 px-6 whitespace-nowrap">User</th>
                                <th className="py-3.5 px-4 whitespace-nowrap text-center">Role</th>
                                <th className="py-3.5 px-4 whitespace-nowrap text-center">Department</th>
                                <th className="py-3.5 px-4 whitespace-nowrap text-center">Time & Pay</th>
                                <th className="py-3.5 px-4 whitespace-nowrap text-center">Permissions</th>
                                <th className="py-3.5 px-4 whitespace-nowrap text-center">Status</th>
                                <th className="py-3.5 px-4 whitespace-nowrap text-center">Last Login</th>
                                <th className="py-3.5 px-6 text-center">Actions</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 text-gray-700">
                             {branchStaffData.map(staff => (
                                <tr key={staff.id} className="hover:bg-gray-50/50 transition-colors">
                                   <td className="py-3 px-6 whitespace-nowrap">
                                      <div className="flex items-center gap-2 mb-0.5">
                                         <span className="font-bold text-gray-900">{staff.name}</span>
                                         {staff.isPrimary && <span className="px-1.5 py-0.5 rounded text-[8px] font-bold text-blue-600 bg-blue-50 border border-blue-100 uppercase">Primary</span>}
                                      </div>
                                      <div className="text-[10px] text-gray-500">{staff.email}</div>
                                   </td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center">
                                      {getRoleBadge(staff.role, staff.roleColor)}
                                   </td>
                                   <td className="py-3 px-4 whitespace-nowrap font-medium text-gray-900 text-center">
                                      {staff.department}
                                   </td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center">
                                      <div className="text-[11px] text-gray-500">{staff.payType}</div>
                                      <div className="text-[11px] font-bold text-gray-900">{staff.payRate}</div>
                                   </td>
                                   <td className="py-3 px-4 whitespace-nowrap font-medium text-gray-900 text-center">
                                      {staff.permissions}
                                   </td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center">
                                      {getStatusBadge(staff.status)}
                                   </td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center">
                                      <div className="text-[11px] font-bold text-gray-900">{staff.lastLoginDate}</div>
                                      <div className="text-[10px] text-gray-500">{staff.lastLoginTime}</div>
                                   </td>
                                   <td className="py-3 px-6">
                                      <div className="flex justify-center gap-3 text-gray-400">
                                         <Eye size={14} className="hover:text-purple-600 cursor-pointer" />
                                         <Edit size={14} className="hover:text-purple-600 cursor-pointer" />
                                         <MoreVertical size={14} className="hover:text-gray-900 cursor-pointer" />
                                      </div>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                    
                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap justify-between items-center bg-gray-50/50 mt-auto rounded-b-2xl gap-4">
                       <span className="text-[12px] font-medium text-gray-500">Showing 1 to 8 of 18 staff</span>
                       <div className="flex items-center gap-3">
                          <div className="flex bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                             <button className="px-2.5 py-1 text-gray-400 border-r border-gray-200 cursor-not-allowed bg-gray-50"><ChevronLeft size={14} /></button>
                             <button className="px-3 py-1 text-white font-bold border-r border-purple-600 bg-purple-600 cursor-pointer text-[12px]">1</button>
                             <button className="px-3 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer text-[12px]">2</button>
                             <button className="px-3 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer text-[12px]">3</button>
                             <button className="px-2.5 py-1 text-gray-600 cursor-pointer hover:bg-gray-50"><ChevronRight size={14} /></button>
                          </div>
                          <select className="border border-gray-200 bg-white rounded-md px-2.5 py-1 text-[12px] font-medium text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                             <option>10 / page</option>
                          </select>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Right Column (Sidebar) */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                 
                 {/* Role Distribution */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                       <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">ROLE DISTRIBUTION</h3>
                       <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View Role Report <ArrowRight size={10}/></span>
                    </div>
                    <div className="flex flex-col items-center mb-6">
                       {/* Mock Donut Chart */}
                       <div className="relative w-28 h-28 rounded-full border-[10px] border-purple-500 flex items-center justify-center shadow-inner" style={{ borderRightColor: '#10b981', borderBottomColor: '#f97316', borderLeftColor: '#3b82f6' }}>
                          <div className="text-center">
                             <div className="text-xl font-black text-gray-900 leading-none mb-0.5">18</div>
                             <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Total Staff</div>
                          </div>
                       </div>
                    </div>
                    <div className="flex flex-col gap-2.5 text-[11px] font-bold">
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500"></div> <span className="text-gray-700">Branch Manager</span></div>
                          <span className="text-gray-900">1</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> <span className="text-gray-700">Dispatch</span></div>
                          <span className="text-gray-900">5</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> <span className="text-gray-700">Warehouse</span></div>
                          <span className="text-gray-900">2</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-teal-500"></div> <span className="text-gray-700">Maintenance</span></div>
                          <span className="text-gray-900">2</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500"></div> <span className="text-gray-700">Accounts</span></div>
                          <span className="text-gray-900">2</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> <span className="text-gray-700">Administration</span></div>
                          <span className="text-gray-900">2</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-400"></div> <span className="text-gray-700">Other</span></div>
                          <span className="text-gray-900">4</span>
                       </div>
                    </div>
                 </div>

                 {/* Time & Attendance */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                       <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">TIME & ATTENDANCE <span className="text-gray-400 normal-case">(TODAY)</span></h3>
                       <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View Timesheets <ArrowRight size={10}/></span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center">
                       <div className="bg-green-50 border border-green-100 rounded-lg p-2 flex flex-col items-center gap-1">
                          <Lock size={14} className="text-green-600"/>
                          <div className="text-[14px] font-black text-gray-900">14</div>
                          <div className="text-[8px] font-bold text-gray-600 uppercase">Clocked In</div>
                       </div>
                       <div className="bg-orange-50 border border-orange-100 rounded-lg p-2 flex flex-col items-center gap-1">
                          <Coffee size={14} className="text-orange-500"/>
                          <div className="text-[14px] font-black text-gray-900">2</div>
                          <div className="text-[8px] font-bold text-gray-600 uppercase">On Break</div>
                       </div>
                       <div className="bg-red-50 border border-red-100 rounded-lg p-2 flex flex-col items-center gap-1">
                          <XCircle size={14} className="text-red-500"/>
                          <div className="text-[14px] font-black text-gray-900">0</div>
                          <div className="text-[8px] font-bold text-gray-600 uppercase">Absent</div>
                       </div>
                       <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 flex flex-col items-center gap-1">
                          <Clock size={14} className="text-gray-500"/>
                          <div className="text-[14px] font-black text-gray-900">2</div>
                          <div className="text-[8px] font-bold text-gray-600 uppercase leading-tight">Not Started</div>
                       </div>
                    </div>
                 </div>

                 {/* Quick Actions */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4 pb-3 border-b border-gray-50">QUICK ACTIONS</h3>
                    <div className="flex flex-col gap-1 text-[12px] font-bold text-gray-700">
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <Plus size={14} className="text-gray-400" /> Invite New Staff
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <Users size={14} className="text-gray-400" /> Manage Roles
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <Shield size={14} className="text-gray-400" /> Permission Matrix
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <Clock size={14} className="text-gray-400" /> Time & Attendance
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <DollarSign size={14} className="text-gray-400" /> Staff Pay Settings
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <CheckCircle2 size={14} className="text-gray-400" /> Bulk Update Permissions
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <Download size={14} className="text-gray-400" /> Export Staff List
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* Time Attendance & Wages Tab Content */}
        {activeTab === 'Time Attendance & Wages' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column (Wide) */}
              <div className="lg:col-span-9 flex flex-col gap-6">
                 
                 {/* 6 Stat Widgets */}
                 <div className="grid grid-cols-6 gap-4">
                    <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex items-center gap-3">
                       <div className="w-8 h-8 rounded bg-purple-50 text-purple-600 flex items-center justify-center shrink-0"><Users size={14}/></div>
                       <div>
                          <div className="text-[14px] font-black text-gray-900 leading-none mb-1">18</div>
                          <div className="text-[9px] font-bold text-gray-500 uppercase">Total Staff</div>
                       </div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex items-center gap-3">
                       <div className="w-8 h-8 rounded bg-purple-50 text-purple-600 flex items-center justify-center shrink-0"><Lock size={14}/></div>
                       <div>
                          <div className="text-[14px] font-black text-gray-900 leading-none mb-1">14</div>
                          <div className="text-[9px] font-bold text-gray-500 uppercase">Clocked In</div>
                       </div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex items-center gap-3">
                       <div className="w-8 h-8 rounded bg-purple-50 text-purple-600 flex items-center justify-center shrink-0"><Coffee size={14}/></div>
                       <div>
                          <div className="text-[14px] font-black text-gray-900 leading-none mb-1">2</div>
                          <div className="text-[9px] font-bold text-gray-500 uppercase">On Break</div>
                       </div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex items-center gap-3">
                       <div className="w-8 h-8 rounded bg-red-50 text-red-600 flex items-center justify-center shrink-0"><XCircle size={14}/></div>
                       <div>
                          <div className="text-[14px] font-black text-gray-900 leading-none mb-1">0</div>
                          <div className="text-[9px] font-bold text-gray-500 uppercase">Absent</div>
                       </div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex items-center gap-3">
                       <div className="w-8 h-8 rounded bg-teal-50 text-teal-600 flex items-center justify-center shrink-0"><Clock size={14}/></div>
                       <div>
                          <div className="text-[14px] font-black text-gray-900 leading-none mb-1">109.50</div>
                          <div className="text-[9px] font-bold text-gray-500 uppercase">Total Hours (Today)</div>
                       </div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex items-center gap-3">
                       <div className="w-8 h-8 rounded bg-orange-50 text-orange-500 flex items-center justify-center shrink-0"><DollarSign size={14}/></div>
                       <div>
                          <div className="text-[14px] font-black text-green-600 leading-none mb-1">$3,842.75</div>
                          <div className="text-[9px] font-bold text-gray-500 uppercase">Est. Wages (Today)</div>
                       </div>
                    </div>
                 </div>

                 {/* Timesheet Section */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col">
                    {/* Sub-tabs */}
                    <div className="flex border-b border-gray-100 px-2 pt-2">
                       {['Timesheet', 'Time Clocks', 'Breaks', 'Attendance', 'Wages', 'Leave & Holidays', 'Approvals', 'Settings'].map(tab => (
                          <button 
                             key={tab}
                             onClick={() => setActiveTimeSubTab(tab)}
                             className={`px-4 py-3 text-[12px] font-bold tracking-wide relative cursor-pointer ${activeTimeSubTab === tab ? 'text-purple-700 border-b-2 border-purple-700 bg-purple-50/30 rounded-t-lg' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg'}`}
                          >
                             {tab}
                          </button>
                       ))}
                    </div>
                    
                    {/* Toolbar */}
                    <div className="p-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                       <div className="flex items-center gap-2 w-full sm:w-auto">
                          <div className="flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-3 py-1.5 text-[12px] font-bold text-gray-700 shadow-sm cursor-pointer">
                             <Calendar size={14} className="text-gray-400" />
                             <span>15 May 2025</span>
                             <ChevronDown size={14} className="text-gray-400 ml-1" />
                          </div>
                          <select className="border border-gray-200 bg-white rounded-lg px-3 py-1.5 text-[12px] font-bold text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                             <option>All Departments</option>
                          </select>
                          <select className="border border-gray-200 bg-white rounded-lg px-3 py-1.5 text-[12px] font-bold text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                             <option>All Pay Types</option>
                          </select>
                          <select className="border border-gray-200 bg-white rounded-lg px-3 py-1.5 text-[12px] font-bold text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                             <option>All Status</option>
                          </select>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-[12px] font-bold shadow-sm hover:bg-gray-50 cursor-pointer">
                             <Filter size={14} /> Filters
                          </button>
                       </div>
                       <div className="flex items-center gap-2">
                          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-[12px] font-bold shadow-sm hover:bg-gray-50 cursor-pointer">
                             Bulk Actions <ChevronDown size={14} className="text-gray-400" />
                          </button>
                       </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto min-w-0">
                       <table className="w-full text-left text-[12px]">
                          <thead>
                             <tr className="border-b border-gray-100 text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">
                                <th className="py-3 px-4 whitespace-nowrap">Staff Member</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Department</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Pay Type</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Clock In</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Breaks</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Clock Out</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Total Hours</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Est. Wages</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Status</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                             {timesheetData.map(row => (
                                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                                   <td className="py-3 px-4 whitespace-nowrap">
                                      <div className="flex items-center gap-3">
                                         {getInitialsBadge(row.initials, row.initialsColor)}
                                         <div>
                                            <div className="font-bold text-gray-900 text-[12px]">{row.name}</div>
                                            <div className="text-[10px] text-gray-500">{row.role}</div>
                                         </div>
                                      </div>
                                   </td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center text-gray-600">{row.department}</td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center">
                                      <span className={row.payType === 'Salary' ? 'text-purple-600 font-bold text-[11px]' : 'text-gray-600 text-[11px]'}>{row.payType}</span>
                                   </td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center">
                                      <div className="font-bold text-gray-900 text-[11px]">{row.clockInTime}</div>
                                      <div className="text-[9px] text-gray-400">{row.clockInMethod}</div>
                                      <div className="text-[9px] text-gray-400">{row.clockInLocation}</div>
                                   </td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center text-[10px] text-gray-500">{row.breakTime}</td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center">
                                      <div className="font-bold text-gray-900 text-[11px]">{row.clockOutTime}</div>
                                      <div className="text-[9px] text-gray-400">{row.clockOutMethod}</div>
                                      <div className="text-[9px] text-gray-400">{row.clockOutLocation}</div>
                                   </td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center font-bold text-gray-900">{row.totalHours}</td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center font-bold text-gray-900">{row.estWages}</td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center">
                                      {getStatusBadge(row.status)}
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-4 py-3 border-t border-gray-100 flex flex-wrap justify-between items-center bg-gray-50/50 rounded-b-2xl gap-4">
                       <span className="text-[11px] font-medium text-gray-500">Showing 1 to 8 of 18 staff</span>
                       <div className="flex items-center gap-3">
                          <div className="flex bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                             <button className="px-2 py-1 text-gray-400 border-r border-gray-200 cursor-not-allowed bg-gray-50"><ChevronLeft size={12} /></button>
                             <button className="px-2.5 py-1 text-white font-bold border-r border-purple-600 bg-purple-600 cursor-pointer text-[11px]">1</button>
                             <button className="px-2.5 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer text-[11px]">2</button>
                             <button className="px-2.5 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer text-[11px]">3</button>
                             <button className="px-2 py-1 text-gray-600 cursor-pointer hover:bg-gray-50"><ChevronRight size={12} /></button>
                          </div>
                          <select className="border border-gray-200 bg-white rounded-md px-2 py-1 text-[11px] font-medium text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                             <option>10 / page</option>
                          </select>
                       </div>
                    </div>
                 </div>

                 {/* Leave & Holiday Requests */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col mt-2">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                       <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">LEAVE & HOLIDAY REQUESTS</h3>
                       <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-purple-200 text-purple-700 rounded-lg text-[11px] font-bold shadow-sm hover:bg-purple-50 cursor-pointer">
                          <Plus size={12} /> New Leave Request
                       </button>
                    </div>
                    
                    <div className="p-4 border-b border-gray-100 flex gap-2">
                       <button className="px-4 py-1.5 bg-purple-600 text-white rounded-full text-[11px] font-bold shadow-sm">All Requests</button>
                       <button className="px-4 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-full text-[11px] font-bold hover:bg-gray-100 transition-colors">Pending (3)</button>
                       <button className="px-4 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-full text-[11px] font-bold hover:bg-gray-100 transition-colors">Approved (5)</button>
                       <button className="px-4 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-full text-[11px] font-bold hover:bg-gray-100 transition-colors">Rejected (1)</button>
                    </div>

                    <div className="overflow-x-auto min-w-0">
                       <table className="w-full text-left text-[12px]">
                          <thead>
                             <tr className="border-b border-gray-100 text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">
                                <th className="py-3 px-4 whitespace-nowrap">Staff Member</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Leave Type</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Start Date</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">End Date</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Total Days</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Reason</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Status</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Applied On</th>
                                <th className="py-3 px-4 text-center">Actions</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                             {leaveRequestsData.map(row => (
                                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                                   <td className="py-3 px-4 whitespace-nowrap">
                                      <div className="font-bold text-gray-900 text-[12px]">{row.name}</div>
                                      <div className="text-[10px] text-gray-500">{row.role}</div>
                                   </td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center font-bold text-gray-900">{row.leaveType}</td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center text-gray-600 text-[11px]">{row.startDate}</td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center text-gray-600 text-[11px]">{row.endDate}</td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center font-black text-gray-900">{row.totalDays}</td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center text-gray-500 text-[11px] truncate max-w-[120px]">{row.reason}</td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center">
                                      {getStatusBadge(row.status)}
                                   </td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center text-gray-600 text-[11px]">{row.appliedOn}</td>
                                   <td className="py-3 px-4">
                                      <div className="flex justify-center gap-2 text-gray-400">
                                         <Eye size={14} className="hover:text-purple-600 cursor-pointer" />
                                         <Edit size={14} className="hover:text-purple-600 cursor-pointer" />
                                      </div>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                    
                    <div className="px-4 py-3 border-t border-gray-100 flex flex-wrap justify-between items-center bg-gray-50/50 rounded-b-2xl gap-4">
                       <span className="text-[11px] font-medium text-gray-500">Showing 1 to 4 of 9 requests</span>
                       <div className="flex items-center gap-3">
                          <div className="flex bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                             <button className="px-2 py-1 text-gray-400 border-r border-gray-200 cursor-not-allowed bg-gray-50"><ChevronLeft size={12} /></button>
                             <button className="px-2.5 py-1 text-white font-bold border-r border-purple-600 bg-purple-600 cursor-pointer text-[11px]">1</button>
                             <button className="px-2.5 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer text-[11px]">2</button>
                             <button className="px-2.5 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer text-[11px]">3</button>
                             <button className="px-2 py-1 text-gray-600 cursor-pointer hover:bg-gray-50"><ChevronRight size={12} /></button>
                          </div>
                          <select className="border border-gray-200 bg-white rounded-md px-2 py-1 text-[11px] font-medium text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                             <option>10 / page</option>
                          </select>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Right Column (Sidebar) */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                 
                 {/* Time Clock Action */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col items-center">
                    <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4">TIME CLOCK</h3>
                    <div className="text-[28px] font-black text-gray-900 leading-none mb-1">10:15:30 AM</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Thursday, 15 May 2025</div>
                    
                    <div className="flex justify-between w-full gap-2">
                       <button className="flex-1 flex flex-col items-center justify-center py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors shadow-sm gap-1">
                          <Lock size={16}/>
                          <span className="text-[11px] font-bold">Start Shift</span>
                       </button>
                       <button className="flex-1 flex flex-col items-center justify-center py-3 bg-yellow-400 hover:bg-yellow-500 text-white rounded-xl transition-colors shadow-sm gap-1">
                          <Coffee size={16}/>
                          <span className="text-[11px] font-bold">Start Break</span>
                       </button>
                       <button className="flex-1 flex flex-col items-center justify-center py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors shadow-sm gap-1">
                          <XCircle size={16}/>
                          <span className="text-[11px] font-bold">Finish Shift</span>
                       </button>
                    </div>
                    <div className="text-[9px] font-medium text-gray-400 mt-3 text-center">FOR GPS & BLUETOOTH CLOCK ACTIONS</div>
                 </div>

                 {/* Wages Summary */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4 pb-3 border-b border-gray-50">WAGES SUMMARY <span className="text-gray-400 normal-case">(15 MAY 2025)</span></h3>
                    <div className="flex flex-col gap-3 text-[12px] font-medium text-gray-600 mb-4">
                       <div className="flex justify-between items-center">
                          <span>Total Staff</span>
                          <span className="font-bold text-gray-900">18</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span>Clocked In</span>
                          <span className="font-bold text-gray-900">14</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span>Total Hours</span>
                          <span className="font-bold text-gray-900">109.50</span>
                       </div>
                       <div className="flex justify-between items-center pt-2 mt-1 border-t border-gray-50">
                          <span className="font-bold text-gray-900">Estimated Wages</span>
                          <span className="font-black text-green-600 text-[14px]">$3,842.75</span>
                       </div>
                    </div>
                    <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1">View Wages Report <ArrowRight size={10}/></span>
                 </div>

                 {/* Leave Requests Summary */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                       <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">LEAVE REQUESTS</h3>
                       <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View All <ArrowRight size={10}/></span>
                    </div>
                    <div className="flex justify-between gap-2">
                       <div className="flex-1 bg-orange-50 border border-orange-100 rounded-lg p-2.5 flex flex-col items-center">
                          <div className="text-[16px] font-black text-orange-600 mb-0.5">3</div>
                          <div className="text-[9px] font-bold text-gray-600 uppercase">Pending</div>
                       </div>
                       <div className="flex-1 bg-green-50 border border-green-100 rounded-lg p-2.5 flex flex-col items-center">
                          <div className="text-[16px] font-black text-green-600 mb-0.5">5</div>
                          <div className="text-[9px] font-bold text-gray-600 uppercase">Approved</div>
                       </div>
                       <div className="flex-1 bg-red-50 border border-red-100 rounded-lg p-2.5 flex flex-col items-center">
                          <div className="text-[16px] font-black text-red-600 mb-0.5">1</div>
                          <div className="text-[9px] font-bold text-gray-600 uppercase">Rejected</div>
                       </div>
                    </div>
                 </div>

                 {/* Upcoming Public Holidays */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                       <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">UPCOMING PUBLIC HOLIDAYS</h3>
                       <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View Calendar <ArrowRight size={10}/></span>
                    </div>
                    <div className="flex flex-col gap-4">
                       <div className="flex gap-3">
                          <div className="w-6 h-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100"><Calendar size={12}/></div>
                          <div>
                             <div className="text-[12px] font-bold text-gray-900 mb-0.5">King's Birthday</div>
                             <div className="text-[10px] font-medium text-gray-500">Monday, 9 June 2025</div>
                          </div>
                       </div>
                       <div className="flex gap-3">
                          <div className="w-6 h-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100"><Calendar size={12}/></div>
                          <div>
                             <div className="text-[12px] font-bold text-gray-900 mb-0.5">Labour Day</div>
                             <div className="text-[10px] font-medium text-gray-500">Monday, 6 October 2025</div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Quick Actions */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4 pb-3 border-b border-gray-50">QUICK ACTIONS</h3>
                    <div className="flex flex-col gap-1 text-[12px] font-bold text-gray-700">
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <CheckCircle2 size={14} className="text-gray-400" /> Approve Timesheets
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <DollarSign size={14} className="text-gray-400" /> Process Payroll
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <Settings size={14} className="text-gray-400" /> Manage Pay Rates
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <Calendar size={14} className="text-gray-400" /> Leave & Holiday Calendar
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <Clock size={14} className="text-gray-400" /> Time & Attendance Settings
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <Download size={14} className="text-gray-400" /> Export Attendance Data
                       </button>
                    </div>
                 </div>

                 {/* Leave Balances */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4 pb-3 border-b border-gray-50">LEAVE BALANCES <span className="text-gray-400 normal-case">(AS OF 15 MAY 2025)</span></h3>
                    <div className="flex flex-col gap-3 text-[11px] font-medium text-gray-600 mb-4">
                       <div className="flex justify-between items-center">
                          <span>Annual Leave</span>
                          <span className="font-bold text-gray-900">18.5 days</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span>Personal Leave</span>
                          <span className="font-bold text-gray-900">5.0 days</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span>Sick Leave</span>
                          <span className="font-bold text-gray-900">10.0 days</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span>Long Service Leave</span>
                          <span className="font-bold text-gray-900">33.0 days</span>
                       </div>
                    </div>
                    <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1">View Leave Balance Report <ArrowRight size={10}/></span>
                 </div>
              </div>
           </div>
        )}

        {/* Assets & Fleet Tab Content */}
        {activeTab === 'Assets & Fleet' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column (Table) */}
              <div className="lg:col-span-9 flex flex-col h-full">
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col flex-grow">
                    <div className="p-5 border-b border-gray-100">
                       <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4">ASSIGNED VEHICLES & ASSETS (24)</h3>
                       
                       <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                          <div className="relative w-full sm:w-64">
                             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                             <input 
                                type="text" 
                                placeholder="Search assets..." 
                                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-purple-300 shadow-sm"
                             />
                          </div>
                          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto min-w-0">
                             <select className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-[12px] font-bold text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                                <option>All Categories</option>
                             </select>
                             <select className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-[12px] font-bold text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                                <option>All Types</option>
                             </select>
                             <select className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-[12px] font-bold text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                                <option>All Status</option>
                             </select>
                             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-[12px] font-bold shadow-sm hover:bg-gray-50 cursor-pointer shrink-0">
                                <Filter size={14} /> Filters
                             </button>
                             <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-[12px] font-bold shadow-sm hover:bg-gray-50 cursor-pointer shrink-0">
                                <Download size={14} /> Export
                             </button>
                          </div>
                       </div>
                       
                       {/* Sub Tabs */}
                       <div className="flex gap-6 border-b border-gray-100">
                          <button className="pb-3 text-[12px] font-bold tracking-wide relative cursor-pointer text-purple-700 border-b-2 border-purple-700">All (24)</button>
                          <button className="pb-3 text-[12px] font-bold tracking-wide relative cursor-pointer text-gray-500 hover:text-gray-700">Vehicles (6)</button>
                          <button className="pb-3 text-[12px] font-bold tracking-wide relative cursor-pointer text-gray-500 hover:text-gray-700">Assets (18)</button>
                       </div>
                    </div>
                    
                    <div className="overflow-x-auto min-w-0">
                       <table className="w-full text-left text-[12px]">
                          <thead>
                             <tr className="border-b border-gray-100 text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">
                                <th className="py-3 px-4 whitespace-nowrap">Asset / Registration</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Type</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Category</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Assigned To</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Status</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Condition</th>
                                <th className="py-3 px-4 whitespace-nowrap text-center">Next Service / Rego</th>
                                <th className="py-3 px-4 text-center">Actions</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                             {assetsData.map(asset => (
                                <tr key={asset.id} className="hover:bg-gray-50/50 transition-colors">
                                   <td className="py-3 px-4 whitespace-nowrap">
                                      <div className="flex items-center gap-3">
                                         <div className="w-8 h-8 rounded bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                                            {asset.icon}
                                         </div>
                                         <div>
                                            <div className="font-bold text-gray-900 text-[12px]">{asset.name}</div>
                                            <div className="text-[10px] font-bold text-gray-500 tracking-wide">{asset.rego}</div>
                                         </div>
                                      </div>
                                   </td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center">
                                      {getRoleBadge(asset.type, asset.typeColor)}
                                   </td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center font-bold text-gray-700">
                                      {asset.category}
                                   </td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center text-[11px]">
                                      {asset.assignedTo}
                                   </td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center">
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-${asset.statusColor}-600 bg-${asset.statusColor}-50 border border-${asset.statusColor}-200`}>{asset.status}</span>
                                   </td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center">
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-${asset.conditionColor}-600 bg-${asset.conditionColor}-50 border border-${asset.conditionColor}-200`}>{asset.condition}</span>
                                   </td>
                                   <td className="py-3 px-4 whitespace-nowrap text-center">
                                      {asset.nextService !== 'N/A' ? (
                                         <>
                                            <div className={`font-bold text-[11px] ${asset.serviceColor === 'red' ? 'text-red-600' : 'text-gray-900'}`}>{asset.nextService}</div>
                                            <div className={`text-[10px] font-medium ${asset.serviceColor === 'red' ? 'text-red-500' : 'text-gray-500'}`}>{asset.nextServiceSub}</div>
                                         </>
                                      ) : (
                                         <span className="text-gray-400 font-bold">N/A</span>
                                      )}
                                   </td>
                                   <td className="py-3 px-4">
                                      <div className="flex justify-center gap-2 text-gray-400">
                                         <Eye size={14} className="hover:text-purple-600 cursor-pointer" />
                                         <Edit size={14} className="hover:text-purple-600 cursor-pointer" />
                                         <MoreVertical size={14} className="hover:text-gray-900 cursor-pointer" />
                                      </div>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                    
                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap justify-between items-center bg-gray-50/50 mt-auto rounded-b-2xl gap-4">
                       <span className="text-[12px] font-medium text-gray-500">Showing 1 to 8 of 24 assets</span>
                       <div className="flex items-center gap-3">
                          <div className="flex bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                             <button className="px-2.5 py-1 text-gray-400 border-r border-gray-200 cursor-not-allowed bg-gray-50"><ChevronLeft size={14} /></button>
                             <button className="px-3 py-1 text-white font-bold border-r border-purple-600 bg-purple-600 cursor-pointer text-[12px]">1</button>
                             <button className="px-3 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer text-[12px]">2</button>
                             <button className="px-3 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer text-[12px]">3</button>
                             <button className="px-2.5 py-1 text-gray-600 cursor-pointer hover:bg-gray-50"><ChevronRight size={14} /></button>
                          </div>
                          <select className="border border-gray-200 bg-white rounded-md px-2.5 py-1 text-[12px] font-medium text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                             <option>10 / page</option>
                          </select>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Right Column (Sidebar) */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                 
                 {/* Asset Summary */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4 pb-3 border-b border-gray-50">ASSET SUMMARY</h3>
                    <div className="grid grid-cols-2 gap-3">
                       <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center gap-3">
                          <div className="text-blue-600"><Car size={16}/></div>
                          <div>
                             <div className="text-[16px] font-black text-gray-900 leading-none mb-1">6</div>
                             <div className="text-[9px] font-bold text-gray-500 uppercase">Vehicles</div>
                          </div>
                       </div>
                       <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex items-center gap-3">
                          <div className="text-red-500"><Box size={16}/></div>
                          <div>
                             <div className="text-[16px] font-black text-gray-900 leading-none mb-1">18</div>
                             <div className="text-[9px] font-bold text-gray-500 uppercase">Assets</div>
                          </div>
                       </div>
                       <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 flex items-center gap-3">
                          <div className="text-purple-600"><Database size={16}/></div>
                          <div>
                             <div className="text-[16px] font-black text-gray-900 leading-none mb-1">24</div>
                             <div className="text-[9px] font-bold text-gray-500 uppercase">Total Assets</div>
                          </div>
                       </div>
                       <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-center gap-3">
                          <div className="text-green-600"><CheckCircle2 size={16}/></div>
                          <div>
                             <div className="text-[16px] font-black text-gray-900 leading-none mb-1">22</div>
                             <div className="text-[9px] font-bold text-gray-500 uppercase">Active</div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Asset By Category */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                       <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">ASSET BY CATEGORY</h3>
                       <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View Report <ArrowRight size={10}/></span>
                    </div>
                    <div className="flex items-center justify-between">
                       {/* Mock Donut Chart */}
                       <div className="relative w-24 h-24 rounded-full border-[8px] border-blue-500 flex items-center justify-center shadow-inner" style={{ borderRightColor: '#facc15', borderBottomColor: '#f97316', borderLeftColor: '#ef4444' }}>
                          <div className="text-center">
                             <div className="text-[16px] font-black text-gray-900 leading-none mb-0.5">24</div>
                             <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Total</div>
                          </div>
                       </div>
                       <div className="flex flex-col gap-1.5 text-[10px] font-bold w-1/2">
                          <div className="flex justify-between items-center">
                             <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> <span className="text-gray-700">Trucks</span></div>
                             <span className="text-gray-900">2</span>
                          </div>
                          <div className="flex justify-between items-center">
                             <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div> <span className="text-gray-700">Trailers</span></div>
                             <span className="text-gray-900">4</span>
                          </div>
                          <div className="flex justify-between items-center">
                             <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> <span className="text-gray-700">Forklifts</span></div>
                             <span className="text-gray-900">4</span>
                          </div>
                          <div className="flex justify-between items-center">
                             <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> <span className="text-gray-700">Containers</span></div>
                             <span className="text-gray-900">4</span>
                          </div>
                          <div className="flex justify-between items-center">
                             <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div> <span className="text-gray-700">Equipment</span></div>
                             <span className="text-gray-900">2</span>
                          </div>
                          <div className="flex justify-between items-center">
                             <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div> <span className="text-gray-700">IT & DEVICES</span></div>
                             <span className="text-gray-900">4</span>
                          </div>
                          <div className="flex justify-between items-center">
                             <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> <span className="text-gray-700">Other</span></div>
                             <span className="text-gray-900">4</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Maintenance Alerts */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                       <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">MAINTENANCE ALERTS</h3>
                       <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View All <ArrowRight size={10}/></span>
                    </div>
                    <div className="flex flex-col gap-3">
                       <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 flex justify-between items-center">
                          <div className="flex items-center gap-2 font-bold text-orange-700 text-[12px]">
                             <AlertTriangle size={14}/> 2 Due Soon
                          </div>
                          <button className="text-[10px] font-bold bg-white border border-orange-200 text-orange-600 px-2 py-1 rounded">Schedule</button>
                       </div>
                       <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex justify-between items-center">
                          <div className="flex items-center gap-2 font-bold text-red-700 text-[12px]">
                             <AlertTriangle size={14}/> 1 Overdue
                          </div>
                          <button className="text-[10px] font-bold bg-white border border-red-200 text-red-600 px-2 py-1 rounded">REQUIRES ATTENTION</button>
                       </div>
                    </div>
                 </div>

                 {/* Quick Actions */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4 pb-3 border-b border-gray-50">QUICK ACTIONS</h3>
                    <div className="flex flex-col gap-1 text-[12px] font-bold text-gray-700">
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <Plus size={14} className="text-gray-400" /> Assign Existing Vehicle
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <Plus size={14} className="text-gray-400" /> Add Or Assign Asset
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <ArrowRight size={14} className="text-gray-400" /> Transfer to Another Branch
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <XCircle size={14} className="text-gray-400" /> Unassign Asset / Vehicle
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <Clock size={14} className="text-gray-400" /> View Assignment History
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <Settings size={14} className="text-gray-400" /> Asset Maintenance Schedule
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <FileText size={14} className="text-gray-400" /> Asset Compliance Documents
                       </button>
                       <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                          <Download size={14} className="text-gray-400" /> Export Asset List
                       </button>
                    </div>
                 </div>

                 {/* Assignment History */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                       <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">ASSIGNMENT HISTORY (RECENT)</h3>
                       <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View All <ArrowRight size={10}/></span>
                    </div>
                    <div className="flex flex-col gap-4 relative">
                       <div className="absolute left-2.5 top-2 bottom-2 w-px bg-gray-100"></div>
                       <div className="flex gap-3 relative z-10">
                          <div className="w-5 h-5 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-600 shrink-0 mt-0.5"><ArrowRight size={10}/></div>
                          <div>
                             <div className="text-[11px] font-bold text-gray-900 mb-0.5">Trailer T-71</div>
                             <div className="text-[10px] text-gray-500 font-medium">Transferred to Sydney HO Fleet</div>
                             <div className="text-[9px] text-gray-400 font-medium mt-0.5">By Sarah M. - 10 May 2025</div>
                          </div>
                       </div>
                       <div className="flex gap-3 relative z-10">
                          <div className="w-5 h-5 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0 mt-0.5"><XCircle size={10}/></div>
                          <div>
                             <div className="text-[11px] font-bold text-gray-900 mb-0.5">Forklift FL-03</div>
                             <div className="text-[10px] text-gray-500 font-medium">Unassigned from Warehouse 2</div>
                             <div className="text-[9px] text-gray-400 font-medium mt-0.5">By James P. - 8 May 2025</div>
                          </div>
                       </div>
                       <div className="flex gap-3 relative z-10">
                          <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 mt-0.5"><ArrowRight size={10}/></div>
                          <div>
                             <div className="text-[11px] font-bold text-gray-900 mb-0.5">Truck B-Double 108</div>
                             <div className="text-[10px] text-gray-500 font-medium">Transferred from Melbourne Depot</div>
                             <div className="text-[9px] text-gray-400 font-medium mt-0.5">By Sarah M. - 5 May 2025</div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* Performance Tab Content */}
        {activeTab === 'Performance' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column (Wide) */}
              <div className="lg:col-span-9 flex flex-col gap-6">
                 
                 {/* Top KPI Row */}
                 <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col min-w-0">
                       <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">
                          <DollarSign size={12} className="text-orange-500 shrink-0"/> <span className="leading-tight break-words">TOTAL REVENUE</span>
                       </div>
                       <div className="text-[17px] xl:text-xl font-black text-gray-900 mb-1 tracking-tight">$1,245,780</div>
                       <div className="flex items-center gap-1 mb-1">
                          <div className="flex items-center text-green-600 text-[11px] font-bold shrink-0"><TrendingUp size={12} className="mr-0.5"/> +12.6%</div>
                       </div>
                       <div className="text-[9px] font-bold text-gray-400 mt-auto leading-tight">vs. Apr 2025: $1,106,370</div>
                    </div>
                    
                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col min-w-0">
                       <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">
                          <TrendingUp size={12} className="text-blue-500 shrink-0"/> <span className="leading-tight break-words">GROSS PROFIT</span>
                       </div>
                       <div className="text-[17px] xl:text-xl font-black text-gray-900 mb-1 tracking-tight">$342,660</div>
                       <div className="flex items-center gap-1 mb-1">
                          <div className="flex items-center text-green-600 text-[11px] font-bold shrink-0"><TrendingUp size={12} className="mr-0.5"/> +18.3%</div>
                       </div>
                       <div className="text-[9px] font-bold text-gray-400 mt-auto leading-tight">Margin: 27.5%</div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col min-w-0">
                       <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">
                          <Truck size={12} className="text-green-500 shrink-0"/> <span className="leading-tight break-words">ACTIVE LOADS</span>
                       </div>
                       <div className="text-[17px] xl:text-xl font-black text-gray-900 mb-1 tracking-tight">32</div>
                       <div className="flex items-center gap-1 mb-1">
                          <div className="flex items-center text-red-500 text-[11px] font-bold shrink-0"><TrendingDown size={12} className="mr-0.5"/> -3.0%</div>
                       </div>
                       <div className="text-[9px] font-bold text-gray-400 mt-auto leading-tight">vs. Apr 2025: 33</div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col min-w-0">
                       <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">
                          <CheckCircle2 size={12} className="text-green-600 shrink-0"/> <span className="leading-tight break-words">COMPLETED LOADS</span>
                       </div>
                       <div className="text-[17px] xl:text-xl font-black text-gray-900 mb-1 tracking-tight">158</div>
                       <div className="flex items-center gap-1 mb-1">
                          <div className="flex items-center text-green-600 text-[11px] font-bold shrink-0"><TrendingUp size={12} className="mr-0.5"/> +9.7%</div>
                       </div>
                       <div className="text-[9px] font-bold text-gray-400 mt-auto leading-tight">vs. Apr 2025: 144</div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col min-w-0">
                       <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">
                          <Clock size={12} className="text-indigo-500 shrink-0"/> <span className="leading-tight break-words">ON-TIME DELIVERY</span>
                       </div>
                       <div className="text-[17px] xl:text-xl font-black text-gray-900 mb-1 tracking-tight">96.3%</div>
                       <div className="flex items-center gap-1 mb-1">
                          <div className="flex items-center text-green-600 text-[11px] font-bold shrink-0"><TrendingUp size={12} className="mr-0.5"/> +2.1%</div>
                       </div>
                       <div className="text-[9px] font-bold text-gray-400 mt-auto leading-tight">vs. Apr 2025: 94.2%</div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col min-w-0">
                       <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">
                          <Star size={12} className="text-yellow-500 shrink-0"/> <span className="leading-tight break-words">CUST. SATISFACTION</span>
                       </div>
                       <div className="text-[17px] xl:text-xl font-black text-gray-900 mb-1 tracking-tight">4.6 / 5</div>
                       <div className="flex items-center gap-1 mb-1">
                          <div className="flex items-center text-green-600 text-[11px] font-bold shrink-0"><TrendingUp size={12} className="mr-0.5"/> +0.2</div>
                       </div>
                       <div className="text-[9px] font-bold text-gray-400 mt-auto leading-tight">vs. Apr 2025: 4.4 / 5</div>
                    </div>
                 </div>

                 {/* Charts Row */}
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue & Profit Trend Chart */}
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                       <div className="flex justify-between items-center mb-6">
                          <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">REVENUE & PROFIT TREND</h3>
                          <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View Full Report <ArrowRight size={10}/></span>
                       </div>
                       <div className="flex items-center gap-4 mb-6 text-[10px] font-bold text-gray-600">
                          <div className="flex items-center gap-1.5"><div className="w-3 h-1 bg-blue-600 rounded"></div> Revenue (AUD)</div>
                          <div className="flex items-center gap-1.5"><div className="w-3 h-1 bg-green-500 rounded"></div> Profit (AUD)</div>
                       </div>
                       
                       {/* Line Chart Mock */}
                       <div className="relative h-48 w-full mt-auto">
                          {/* Y-Axis Labels */}
                          <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[9px] text-gray-400 font-bold text-right pr-2 h-full">
                             <span>$1.5M</span>
                             <span>$1.2M</span>
                             <span>$900K</span>
                             <span>$600K</span>
                             <span>$300K</span>
                          </div>
                          
                          {/* Grid Lines */}
                          <div className="absolute left-10 right-0 top-1.5 bottom-6 flex flex-col justify-between">
                             <div className="w-full h-px bg-gray-100"></div>
                             <div className="w-full h-px bg-gray-100"></div>
                             <div className="w-full h-px bg-gray-100"></div>
                             <div className="w-full h-px bg-gray-100"></div>
                             <div className="w-full h-px bg-gray-200"></div>
                          </div>
                          
                          {/* Chart Lines Container */}
                          <div className="absolute left-10 right-0 top-1.5 bottom-6">
                             {/* Revenue Line (Blue) */}
                             <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <polyline fill="none" stroke="#2563eb" strokeWidth="2" points="0,80 20,70 40,65 60,50 80,45 100,20" strokeLinecap="round" strokeLinejoin="round" />
                                {/* Data Points */}
                                <circle cx="0" cy="80" r="1.5" fill="#2563eb" />
                                <circle cx="20" cy="70" r="1.5" fill="#2563eb" />
                                <circle cx="40" cy="65" r="1.5" fill="#2563eb" />
                                <circle cx="60" cy="50" r="1.5" fill="#2563eb" />
                                <circle cx="80" cy="45" r="1.5" fill="#2563eb" />
                                <circle cx="100" cy="20" r="1.5" fill="white" stroke="#2563eb" strokeWidth="1" />
                             </svg>

                             {/* Profit Line (Green) */}
                             <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <polyline fill="none" stroke="#10b981" strokeWidth="2" points="0,90 20,85 40,85 60,75 80,70 100,60" strokeLinecap="round" strokeLinejoin="round" />
                                {/* Data Points */}
                                <circle cx="0" cy="90" r="1.5" fill="#10b981" />
                                <circle cx="20" cy="85" r="1.5" fill="#10b981" />
                                <circle cx="40" cy="85" r="1.5" fill="#10b981" />
                                <circle cx="60" cy="75" r="1.5" fill="#10b981" />
                                <circle cx="80" cy="70" r="1.5" fill="#10b981" />
                                <circle cx="100" cy="60" r="1.5" fill="white" stroke="#10b981" strokeWidth="1" />
                             </svg>
                          </div>

                          {/* X-Axis Labels */}
                          <div className="absolute left-10 right-0 bottom-0 flex justify-between text-[9px] text-gray-400 font-bold px-1">
                             <span>Dec 2024</span>
                             <span>Jan 2025</span>
                             <span>Feb 2025</span>
                             <span>Mar 2025</span>
                             <span>Apr 2025</span>
                             <span>May 2025</span>
                          </div>
                       </div>
                    </div>

                    {/* Performance KPI Scorecard */}
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col">
                       <div className="p-5 pb-4 border-b border-gray-50 flex justify-between items-center">
                          <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">PERFORMANCE KPI SCORECARD</h3>
                          <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View All <ArrowRight size={10}/></span>
                       </div>
                       <div className="overflow-x-auto min-w-0 px-2 py-1">
                          <table className="w-full text-left text-[11px]">
                             <thead>
                                <tr className="border-b border-gray-100 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                   <th className="py-2.5 px-3 whitespace-nowrap">KPI</th>
                                   <th className="py-2.5 px-2 whitespace-nowrap text-right">THIS MONTH</th>
                                   <th className="py-2.5 px-2 whitespace-nowrap text-right">VS APR</th>
                                   <th className="py-2.5 px-2 whitespace-nowrap text-right">TARGET</th>
                                   <th className="py-2.5 px-3 whitespace-nowrap text-center">STATUS</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                                <tr className="hover:bg-gray-50/50">
                                   <td className="py-2 px-3 font-bold text-gray-900">On-Time Delivery</td>
                                   <td className="py-2 px-2 text-right font-black text-gray-900">96.3%</td>
                                   <td className="py-2 px-2 text-right font-bold text-green-600">+2.1%</td>
                                   <td className="py-2 px-2 text-right text-gray-500">{'>'} 95%</td>
                                   <td className="py-2 px-3 text-center"><span className="px-2 py-0.5 rounded text-[9px] font-bold text-green-700 bg-green-50 border border-green-200">Excellent</span></td>
                                </tr>
                                <tr className="hover:bg-gray-50/50">
                                   <td className="py-2 px-3 font-bold text-gray-900">Load Completion Rate</td>
                                   <td className="py-2 px-2 text-right font-black text-gray-900">98.1%</td>
                                   <td className="py-2 px-2 text-right font-bold text-green-600">+5.8%</td>
                                   <td className="py-2 px-2 text-right text-gray-500">{'>'} 97%</td>
                                   <td className="py-2 px-3 text-center"><span className="px-2 py-0.5 rounded text-[9px] font-bold text-green-700 bg-green-50 border border-green-200">Excellent</span></td>
                                </tr>
                                <tr className="hover:bg-gray-50/50">
                                   <td className="py-2 px-3 font-bold text-gray-900">Customer Satisfaction</td>
                                   <td className="py-2 px-2 text-right font-black text-gray-900">4.6/5</td>
                                   <td className="py-2 px-2 text-right font-bold text-green-600">+0.2</td>
                                   <td className="py-2 px-2 text-right text-gray-500">{'>'} 4.5</td>
                                   <td className="py-2 px-3 text-center"><span className="px-2 py-0.5 rounded text-[9px] font-bold text-green-700 bg-green-50 border border-green-200">Excellent</span></td>
                                </tr>
                                <tr className="hover:bg-gray-50/50">
                                   <td className="py-2 px-3 font-bold text-gray-900">Staff Attendance</td>
                                   <td className="py-2 px-2 text-right font-black text-gray-900">92.4%</td>
                                   <td className="py-2 px-2 text-right font-bold text-green-600">+2.8%</td>
                                   <td className="py-2 px-2 text-right text-gray-500">{'>'} 90%</td>
                                   <td className="py-2 px-3 text-center"><span className="px-2 py-0.5 rounded text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200">Good</span></td>
                                </tr>
                                <tr className="hover:bg-gray-50/50">
                                   <td className="py-2 px-3 font-bold text-gray-900">Vehicle Utilization</td>
                                   <td className="py-2 px-2 text-right font-black text-gray-900">78.6%</td>
                                   <td className="py-2 px-2 text-right font-bold text-red-500">-1.5%</td>
                                   <td className="py-2 px-2 text-right text-gray-500">{'>'} 75%</td>
                                   <td className="py-2 px-3 text-center"><span className="px-2 py-0.5 rounded text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200">Good</span></td>
                                </tr>
                                <tr className="hover:bg-gray-50/50">
                                   <td className="py-2 px-3 font-bold text-gray-900">Trailer Utilization</td>
                                   <td className="py-2 px-2 text-right font-black text-gray-900">72.1%</td>
                                   <td className="py-2 px-2 text-right font-bold text-green-600">+3.7%</td>
                                   <td className="py-2 px-2 text-right text-gray-500">{'>'} 70%</td>
                                   <td className="py-2 px-3 text-center"><span className="px-2 py-0.5 rounded text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200">Good</span></td>
                                </tr>
                                <tr className="hover:bg-gray-50/50">
                                   <td className="py-2 px-3 font-bold text-gray-900">Asset Utilization</td>
                                   <td className="py-2 px-2 text-right font-black text-gray-900">60.2%</td>
                                   <td className="py-2 px-2 text-right font-bold text-green-600">+4.2%</td>
                                   <td className="py-2 px-2 text-right text-gray-500">{'>'} 65%</td>
                                   <td className="py-2 px-3 text-center"><span className="px-2 py-0.5 rounded text-[9px] font-bold text-orange-700 bg-orange-50 border border-orange-200">Poor</span></td>
                                </tr>
                                <tr className="hover:bg-gray-50/50">
                                   <td className="py-2 px-3 font-bold text-gray-900">Safety Incidents</td>
                                   <td className="py-2 px-2 text-right font-black text-gray-900">2</td>
                                   <td className="py-2 px-2 text-right font-bold text-red-500">+1</td>
                                   <td className="py-2 px-2 text-right text-gray-500">{'<'} 1</td>
                                   <td className="py-2 px-3 text-center"><span className="px-2 py-0.5 rounded text-[9px] font-bold text-orange-700 bg-orange-50 border border-orange-200">Poor</span></td>
                                </tr>
                                <tr className="hover:bg-gray-50/50">
                                   <td className="py-2 px-3 font-bold text-gray-900">Profit as % of Revenue</td>
                                   <td className="py-2 px-2 text-right font-black text-gray-900">27.5%</td>
                                   <td className="py-2 px-2 text-right font-bold text-green-600">+0.8%</td>
                                   <td className="py-2 px-2 text-right text-gray-500">{'>'} 20%</td>
                                   <td className="py-2 px-3 text-center"><span className="px-2 py-0.5 rounded text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200">Good</span></td>
                                </tr>
                             </tbody>
                          </table>
                       </div>
                    </div>
                 </div>

                 {/* Bottom 3 Donut Charts Row */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* LOADS OVERVIEW */}
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                       <div className="flex justify-between items-center mb-6">
                          <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">LOADS OVERVIEW</h3>
                          <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View Report <ArrowRight size={10}/></span>
                       </div>
                       <div className="flex items-center gap-6">
                          <div className="relative w-20 h-20 rounded-full border-[6px] border-green-500 flex items-center justify-center shrink-0" style={{ borderRightColor: '#3b82f6', borderBottomColor: '#f97316' }}>
                             <div className="text-center">
                                <div className="text-[14px] font-black text-gray-900 leading-none mb-0.5">190</div>
                                <div className="text-[7px] font-bold text-gray-500 uppercase tracking-widest">Total</div>
                             </div>
                          </div>
                          <div className="flex flex-col gap-1.5 text-[10px] font-bold flex-grow">
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> <span className="text-gray-700">Completed</span></div>
                                <span className="text-gray-900">158</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> <span className="text-gray-700">In Transit</span></div>
                                <span className="text-gray-900">32</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> <span className="text-gray-700">Delayed</span></div>
                                <span className="text-gray-900">2</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> <span className="text-gray-700">Cancelled</span></div>
                                <span className="text-gray-900">0</span>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* REVENUE BY SERVICE TYPE */}
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                       <div className="flex justify-between items-center mb-6">
                          <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">REVENUE BY SERVICE TYPE</h3>
                          <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View Report <ArrowRight size={10}/></span>
                       </div>
                       <div className="flex items-center gap-6">
                          <div className="relative w-20 h-20 rounded-full border-[6px] border-blue-600 flex items-center justify-center shrink-0" style={{ borderRightColor: '#60a5fa', borderBottomColor: '#f59e0b', borderLeftColor: '#d946ef' }}>
                             <div className="text-center">
                                <div className="text-[14px] font-black text-gray-900 leading-none mb-0.5">$1.25M</div>
                                <div className="text-[7px] font-bold text-gray-500 uppercase tracking-widest">Total</div>
                             </div>
                          </div>
                          <div className="flex flex-col gap-1.5 text-[10px] font-bold flex-grow">
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div> <span className="text-gray-700">Car Carrying</span></div>
                                <span className="text-gray-900">$650,540</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> <span className="text-gray-700">General Freight</span></div>
                                <span className="text-gray-900">$320,520</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> <span className="text-gray-700 truncate max-w-[80px]">Dangerous Goods</span></div>
                                <span className="text-gray-900">$87,550</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500"></div> <span className="text-gray-700">Other</span></div>
                                <span className="text-gray-900">$44,670</span>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* EXPENSE BREAKDOWN */}
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                       <div className="flex justify-between items-center mb-6">
                          <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">EXPENSE BREAKDOWN</h3>
                          <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View Report <ArrowRight size={10}/></span>
                       </div>
                       <div className="flex items-center gap-6">
                          <div className="relative w-20 h-20 rounded-full border-[6px] border-purple-500 flex items-center justify-center shrink-0" style={{ borderRightColor: '#ef4444', borderBottomColor: '#eab308', borderLeftColor: '#3b82f6' }}>
                             <div className="text-center">
                                <div className="text-[14px] font-black text-gray-900 leading-none mb-0.5">$903K</div>
                                <div className="text-[7px] font-bold text-gray-500 uppercase tracking-widest">Total</div>
                             </div>
                          </div>
                          <div className="flex flex-col gap-1.5 text-[10px] font-bold flex-grow">
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div> <span className="text-gray-700">Payroll Costs</span></div>
                                <span className="text-gray-900">$124,450</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> <span className="text-gray-700">Fuel Costs</span></div>
                                <span className="text-gray-900">$106,200</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div> <span className="text-gray-700">Maintenance</span></div>
                                <span className="text-gray-900">$15,100</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> <span className="text-gray-700 truncate max-w-[70px]">Other Operating</span></div>
                                <span className="text-gray-900">$184,170</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

              </div>

              {/* Right Column (Sidebar) */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                 
                 {/* Operational Snapshot */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                       <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">OPERATIONAL SNAPSHOT</h3>
                       <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View All <ArrowRight size={10}/></span>
                    </div>
                    <div className="flex flex-col gap-4 text-[12px] font-bold">
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-gray-600"><Users size={14}/> Total Staff</div>
                          <div className="text-right">
                             <div className="text-gray-900">18</div>
                             <div className="text-[8px] text-gray-400">vs Apr 2025: 17</div>
                          </div>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-orange-600"><Coffee size={14}/> Staff On Leave</div>
                          <div className="text-right">
                             <div className="text-gray-900">2</div>
                             <div className="text-[8px] text-gray-400">vs Apr 2025: 1</div>
                          </div>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-gray-600"><Car size={14}/> Total Vehicles</div>
                          <div className="text-right">
                             <div className="text-gray-900">6</div>
                             <div className="text-[8px] text-gray-400">vs Apr 2025: 6</div>
                          </div>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-gray-600"><Truck size={14}/> Total Trailers</div>
                          <div className="text-right">
                             <div className="text-gray-900">4</div>
                             <div className="text-[8px] text-gray-400">vs Apr 2025: 4</div>
                          </div>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-gray-600"><Box size={14}/> Total Assets</div>
                          <div className="text-right">
                             <div className="text-gray-900">18</div>
                             <div className="text-[8px] text-gray-400">vs Apr 2025: 17</div>
                          </div>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-blue-600"><Activity size={14}/> Utilization (All Assets)</div>
                          <div className="text-right">
                             <div className="text-gray-900">68.2%</div>
                             <div className="text-[8px] text-gray-400">vs Apr 2025: 64.0% <span className="text-green-500">▲ 4.2%</span></div>
                          </div>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-gray-600"><Building size={14}/> Warehouse Capacity</div>
                          <div className="text-right">
                             <div className="text-gray-900">42%</div>
                             <div className="text-[8px] text-gray-400">vs Apr 2025: 38% <span className="text-red-500">▲ 4%</span></div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Top Customers By Revenue */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                       <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">TOP CUSTOMERS BY REVENUE</h3>
                       <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View Report <ArrowRight size={10}/></span>
                    </div>
                    <div className="flex flex-col gap-3 text-[11px] font-bold text-gray-700">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <div className="w-4 h-4 rounded-full bg-gray-100 text-[9px] flex items-center justify-center shrink-0">1</div>
                             <span className="hover:text-purple-700 cursor-pointer">ABC Car Logistics</span>
                          </div>
                          <div className="flex gap-2 shrink-0">
                             <span className="text-gray-900">$342,450</span>
                             <span className="text-gray-400 w-6 text-right">27.5%</span>
                          </div>
                       </div>
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <div className="w-4 h-4 rounded-full bg-gray-100 text-[9px] flex items-center justify-center shrink-0">2</div>
                             <span className="hover:text-purple-700 cursor-pointer">QuickMove Transport</span>
                          </div>
                          <div className="flex gap-2 shrink-0">
                             <span className="text-gray-900">$219,760</span>
                             <span className="text-gray-400 w-6 text-right">17.6%</span>
                          </div>
                       </div>
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <div className="w-4 h-4 rounded-full bg-gray-100 text-[9px] flex items-center justify-center shrink-0">3</div>
                             <span className="hover:text-purple-700 cursor-pointer">National Auto Group</span>
                          </div>
                          <div className="flex gap-2 shrink-0">
                             <span className="text-gray-900">$178,880</span>
                             <span className="text-gray-400 w-6 text-right">14.3%</span>
                          </div>
                       </div>
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <div className="w-4 h-4 rounded-full bg-gray-100 text-[9px] flex items-center justify-center shrink-0">4</div>
                             <span className="hover:text-purple-700 cursor-pointer">Direct Freight Services</span>
                          </div>
                          <div className="flex gap-2 shrink-0">
                             <span className="text-gray-900">$135,430</span>
                             <span className="text-gray-400 w-6 text-right">10.9%</span>
                          </div>
                       </div>
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <div className="w-4 h-4 rounded-full bg-gray-100 text-[9px] flex items-center justify-center shrink-0">5</div>
                             <span className="hover:text-purple-700 cursor-pointer">Others</span>
                          </div>
                          <div className="flex gap-2 shrink-0">
                             <span className="text-gray-900">$372,250</span>
                             <span className="text-gray-400 w-6 text-right">29.8%</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* AI Insights */}
                 <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                       <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-1">
                          <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center"><Lightbulb size={12}/></div>
                          AI INSIGHTS <span className="bg-purple-100 text-purple-700 px-1 rounded text-[8px] ml-1">BETA</span>
                       </h3>
                       <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View All <ArrowRight size={10}/></span>
                    </div>
                    <div className="flex flex-col gap-3">
                       <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex gap-2.5 items-start">
                          <CheckCircle2 size={14} className="text-green-600 mt-0.5 shrink-0"/>
                          <div className="text-[11px] font-bold text-green-900 leading-tight">
                             On-time delivery improved by 2.1% this month. Keep monitoring driver scheduling and route planning.
                          </div>
                       </div>
                       <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 flex gap-2.5 items-start">
                          <AlertTriangle size={14} className="text-orange-600 mt-0.5 shrink-0"/>
                          <div className="text-[11px] font-bold text-orange-900 leading-tight">
                             Vehicle utilization dropped slightly. Consider reallocating assets to increase usage.
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* Developer Notes Dynamic Footer */}
        <div className="bg-[#f8f9fc] border border-purple-100 rounded-2xl p-6 mt-6 shadow-sm">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-[12px] font-black text-purple-900 uppercase tracking-widest flex items-center gap-2">
                 <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center shrink-0"><Terminal size={14} className="text-purple-700" /></div>
                 {isPerfTab ? 'DEVELOPER NOTES – BRANCH PERFORMANCE DASHBOARD' : isAssetsTab ? 'DEVELOPER NOTES – BRANCH ASSETS & FLEET ASSIGNMENTS' : isTimeTab ? 'DEVELOPER NOTES – BRANCH TIME ATTENDANCE & WAGES' : isStaffTab ? 'DEVELOPER NOTES – BRANCH STAFF & PERMISSIONS' : 'DEVELOPER NOTES – BRANCH DETAILS'}
              </h3>
           </div>
           
           {isPerfTab ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-[11px] text-gray-700">
                 <div>
                    <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Info size={12}/> 1. PURPOSE</div>
                    <ul className="list-disc pl-4 space-y-1">
                       <li>Provide real-time branch performance overview.</li>
                       <li>Help managers make data-driven decisions.</li>
                       <li>Track KPIs, trends and operational efficiency.</li>
                    </ul>
                 </div>
                 <div>
                    <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Settings size={12}/> 2. KEY FEATURES</div>
                    <ul className="list-disc pl-4 space-y-1">
                       <li>KPI scorecards with targets and status.</li>
                       <li>Interactive charts with drill-down reports.</li>
                       <li>Compare with previous period or branches.</li>
                       <li>Export data in PDF / Excel / CSV.</li>
                    </ul>
                 </div>
                 <div>
                    <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Bell size={12}/> 3. AUTOMATION & ALERTS</div>
                    <ul className="list-disc pl-4 space-y-1">
                       <li>AI alerts for KPI deviations and trends.</li>
                       <li>Auto-calculate KPIs from live operational data.</li>
                       <li>Notify managers for underperforming KPIs.</li>
                       <li>Suggest actions to improve performance.</li>
                    </ul>
                 </div>
                 <div>
                    <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Shield size={12}/> 4. PERMISSIONS</div>
                    <ul className="list-disc pl-4 space-y-1">
                       <li><strong>Super Admin:</strong> Full access to all data.</li>
                       <li><strong>Branch Manager:</strong> Own branch data.</li>
                       <li><strong>Other roles:</strong> View only as per permissions.</li>
                       <li>Export permission controlled.</li>
                    </ul>
                 </div>
                 <div>
                    <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Database size={12}/> 5. DATA SOURCES</div>
                    <ul className="list-disc pl-4 space-y-1">
                       <li>Loads, Finance, Payroll, Assets, Vehicles.</li>
                       <li>Attendance, Customer Feedback.</li>
                       <li>Warehouse & Maintenance modules.</li>
                       <li>Live tracking and telematics (If integrated).</li>
                    </ul>
                 </div>
              </div>
           ) : isAssetsTab ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-[11px] text-gray-700">
                 <div>
                    <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Info size={12}/> 1. PURPOSE</div>
                    <ul className="list-disc pl-4 space-y-1">
                       <li>View all vehicles and assets assigned to the branch.</li>
                       <li>Manage assignments, transfers and inventory.</li>
                       <li>Monitor maintenance, compliance and condition.</li>
                    </ul>
                 </div>
                 <div>
                    <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Settings size={12}/> 2. KEY FEATURES</div>
                    <ul className="list-disc pl-4 space-y-1">
                       <li>Assign existing vehicles or assets to branch.</li>
                       <li>Transfer between branches with reason.</li>
                       <li>Assignment history with audit trail.</li>
                       <li>Filter by category, type, status and condition.</li>
                    </ul>
                 </div>
                 <div>
                    <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Bell size={12}/> 3. AUTOMATION & ALERTS</div>
                    <ul className="list-disc pl-4 space-y-1">
                       <li>AI alerts for maintenance, compliance and expiry.</li>
                       <li>Predict upcoming service and renewals.</li>
                       <li>Suggest optimal asset allocation.</li>
                    </ul>
                 </div>
                 <div>
                    <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Shield size={12}/> 4. PERMISSIONS</div>
                    <ul className="list-disc pl-4 space-y-1">
                       <li><strong>Super Admin / Admin:</strong> Full access.</li>
                       <li><strong>Branch Admin, Manager:</strong> Manage assign/ xfer.</li>
                       <li><strong>Dispatch / Operations:</strong> View only.</li>
                       <li><strong>Staff:</strong> View assets assigned to them.</li>
                    </ul>
                 </div>
                 <div>
                    <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Database size={12}/> 5. DATA SOURCES</div>
                    <ul className="list-disc pl-4 space-y-1">
                       <li>Vehicles from Vehicles module.</li>
                       <li>Assets from Assets module.</li>
                       <li>Maintenance from Maintenance module.</li>
                       <li>Documents from Documents module.</li>
                    </ul>
                 </div>
              </div>
           ) : isTimeTab ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-[11px] text-gray-700">
                 <div>
                    <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Info size={12}/> 1. PURPOSE</div>
                    <ul className="list-disc pl-4 space-y-1">
                       <li>Track staff time, breaks, attendance and leave.</li>
                       <li>Calculate estimated wages automatically.</li>
                       <li>Generate timesheets for payroll.</li>
                    </ul>
                 </div>
                 <div>
                    <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Settings size={12}/> 2. KEY FEATURES</div>
                    <ul className="list-disc pl-4 space-y-1">
                       <li>Clock in/out via Web, Mobile, QR Code or NFC.</li>
                       <li>Breaks (Start/End) with duration tracking.</li>
                       <li>GPS location captured on clock actions.</li>
                       <li>Leave applications with approval workflow.</li>
                    </ul>
                 </div>
                 <div>
                    <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Bell size={12}/> 3. AUTOMATION & ALERTS</div>
                    <ul className="list-disc pl-4 space-y-1">
                       <li>Alert on missed clock in/out or late starts.</li>
                       <li>Auto-calculate overtime, weekend & PH rates.</li>
                       <li>Notify on leave conflicts or staff shortages.</li>
                       <li>Timesheet locked after approval.</li>
                    </ul>
                 </div>
                 <div>
                    <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><DollarSign size={12}/> 4. PAYROLL INTEGRATION</div>
                    <ul className="list-disc pl-4 space-y-1">
                       <li>Supports Hourly, Salary, Daily, Per Load, Per KM.</li>
                       <li>Include allowances, penalties & deductions.</li>
                       <li>Approved timesheets feed into payroll.</li>
                       <li>Export wages, super & tax data.</li>
                    </ul>
                 </div>
                 <div>
                    <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Database size={12}/> 5. DATA SOURCES</div>
                    <ul className="list-disc pl-4 space-y-1">
                       <li>Staff master data & pay settings.</li>
                       <li>Time clock logs (Web/Mobile/QR/NFC).</li>
                       <li>Leave & holiday calendar.</li>
                       <li>Approved timesheets & pay rates.</li>
                    </ul>
                 </div>
              </div>
           ) : isStaffTab ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-[11px] text-gray-700">
                 <div>
                    <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Info size={12}/> 1. PURPOSE</div>
                    <ul className="list-disc pl-4 space-y-1">
                       <li>Manage all branch staff, roles and permissions.</li>
                       <li>Configure pay types, rates and time tracking.</li>
                       <li>Control access to modules and actions.</li>
                       <li>Maintain staff information and status.</li>
                    </ul>
                 </div>
                 <div>
                    <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Settings size={12}/> 2. KEY FEATURES</div>
                    <ul className="list-disc pl-4 space-y-1">
                       <li>Staff list with role, department, and status.</li>
                       <li>Time & Pay: pay type, rate and current status.</li>
                       <li>Permissions count (assigned vs total).</li>
                       <li>Invite staff, manage roles and permissions.</li>
                    </ul>
                 </div>
                 <div>
                    <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Clock size={12}/> 3. TIME TRACKING INTEGRATION</div>
                    <ul className="list-disc pl-4 space-y-1">
                       <li>Staff can clock in/out via web, mobile, QR or NFC.</li>
                       <li>Breaks (Start/End) with duration tracking.</li>
                       <li>GPS location captured on clock actions.</li>
                       <li>Geofence validation for branch locations.</li>
                    </ul>
                 </div>
                 <div>
                    <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><DollarSign size={12}/> 4. PAYROLL & WAGES</div>
                    <ul className="list-disc pl-4 space-y-1">
                       <li>Supports Hourly, Salary, Daily, Per Load, Per KM.</li>
                       <li>Overtime, weekend and public holiday rates.</li>
                       <li>Timesheets feed into payroll for wage calc.</li>
                       <li>Export timesheets and payroll data.</li>
                    </ul>
                 </div>
                 <div>
                    <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Shield size={12}/> 5. PERMISSIONS</div>
                    <ul className="list-disc pl-4 space-y-1">
                       <li><strong>Super Admin / Admin:</strong> Full access.</li>
                       <li><strong>Branch Admin:</strong> Manage staff & roles.</li>
                       <li><strong>Managers:</strong> View team and timesheets.</li>
                       <li><strong>Users:</strong> View own profile and timesheets.</li>
                    </ul>
                 </div>
              </div>
           ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-[11px] text-gray-700">
                 <div>
                    <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Info size={12}/> 1. PURPOSE</div>
                    <ul className="list-disc pl-4 space-y-1">
                       <li>Display comprehensive details for the selected branch.</li>
                       <li>Allow admins to manage branch settings, contacts, and configurations.</li>
                    </ul>
                 </div>
                 <div>
                    <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Settings size={12}/> 2. KEY FEATURES</div>
                    <ul className="list-disc pl-4 space-y-1">
                       <li>Tab based navigation for organized data.</li>
                       <li>View and manage branch contacts.</li>
                       <li>Overview metrics and performance.</li>
                       <li>Manage operational settings and defaults.</li>
                    </ul>
                 </div>
                 <div>
                    <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Bell size={12}/> 3. AUTOMATION & ALERTS</div>
                    <ul className="list-disc pl-4 space-y-1">
                       <li>Alert if branch inactive for {'>'} 90 days.</li>
                       <li>Notify admin on key performance drops.</li>
                       <li>Auto-update metrics daily.</li>
                       <li>Highlight compliance or safety issues.</li>
                    </ul>
                 </div>
                 <div>
                    <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Users size={12}/> 4. PERMISSIONS</div>
                    <ul className="list-disc pl-4 space-y-1">
                       <li><strong>Super Admin / Admin:</strong> Full access.</li>
                       <li><strong>Branch Admin:</strong> Edit branch details, contacts, and settings.</li>
                       <li><strong>Dispatchers / Users:</strong> View only.</li>
                       <li><strong>Accounts:</strong> View financial and performance data.</li>
                    </ul>
                 </div>
                 <div>
                    <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Database size={12}/> 5. DATA SOURCES</div>
                    <ul className="list-disc pl-4 space-y-1">
                       <li>Branches master data.</li>
                       <li>Users and roles.</li>
                       <li>Assets, vehicles, trailers, warehouses.</li>
                       <li>Loads, performance and activity logs.</li>
                    </ul>
                 </div>
              </div>
           )}
           <div className="flex justify-between text-[9px] text-gray-400 mt-6 pt-4 border-t border-purple-50 font-medium">
              <span>All times shown in your local time (AEST)</span>
              <span className="flex items-center gap-1"><Clock size={10}/> Data auto-refreshes every 5 minutes</span>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
           <div className="flex items-center gap-2 text-[12px] text-gray-500 mb-1 font-semibold tracking-wide">
              <span>Home</span>
              <ChevronRight size={12} />
              <span>Branches</span>
              <ChevronRight size={12} />
              <span className="text-gray-900">Branch List</span>
           </div>
           <div className="flex items-center gap-2">
             <h1 className="text-2xl font-black text-gray-900 tracking-tight">7.1 Branch List</h1>
             <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><CheckCircle2 size={12} /></div>
           </div>
           <p className="text-sm text-gray-500 font-medium mt-1">View and manage all branches across your organisation.</p>
        </div>
        <button onClick={() => setIsAddingBranch(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-purple-200 text-purple-700 rounded-lg text-sm font-bold shadow-sm hover:bg-purple-50 transition-colors cursor-pointer">
           <Plus size={16} /> Add Branch
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
         <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
               <Building size={18} />
            </div>
            <div>
               <div className="text-xl font-black text-gray-900">18</div>
               <div className="text-[11px] font-bold text-gray-700">Total Branches</div>
               <div className="text-[10px] text-gray-500">Across 2 countries</div>
            </div>
         </div>
         <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-green-600 shrink-0">
               <CheckCircle2 size={18} />
            </div>
            <div>
               <div className="text-xl font-black text-gray-900">12</div>
               <div className="text-[11px] font-bold text-gray-700">Active</div>
            </div>
         </div>
         <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 shrink-0">
               <Clock size={18} />
            </div>
            <div>
               <div className="text-xl font-black text-gray-900">2</div>
               <div className="text-[11px] font-bold text-gray-700">Inactive</div>
            </div>
         </div>
         <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 shrink-0">
               <AlertTriangle size={18} />
            </div>
            <div>
               <div className="text-xl font-black text-gray-900">2</div>
               <div className="text-[11px] font-bold text-gray-700">Pending Setup</div>
            </div>
         </div>
         <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-500 shrink-0">
               <Shield size={18} />
            </div>
            <div>
               <div className="text-xl font-black text-gray-900">2</div>
               <div className="text-[11px] font-bold text-gray-700">Closed</div>
            </div>
         </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
         
         {/* Left Column (Table) */}
         <div className="lg:col-span-9 flex flex-col h-full">
            
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
               <div className="relative w-full sm:w-72">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                     type="text" 
                     placeholder="Search branches..." 
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-300 shadow-sm"
                  />
               </div>
               <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto min-w-0">
                  <select className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                     <option>All Countries</option>
                  </select>
                  <select className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                     <option>All Status</option>
                  </select>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold shadow-sm hover:bg-gray-50 cursor-pointer shrink-0">
                     <Filter size={14} /> Filters
                  </button>
                  <button className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 text-gray-600 rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer shrink-0">
                     <Download size={16} />
                  </button>
               </div>
            </div>

            {/* Table Container */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col flex-grow">
               <div className="p-4 border-b border-gray-100">
                  <h3 className="text-[11px] font-black text-purple-700 uppercase tracking-widest">BRANCHES (18)</h3>
               </div>
               <div className="overflow-x-auto min-w-0">
                  <table className="w-full text-left text-[12px]">
                     <thead>
                        <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-800 bg-gray-50/50">
                           <th className="py-3.5 px-6 whitespace-nowrap">Branch Name</th>
                           <th className="py-3.5 px-4 whitespace-nowrap">Branch Code</th>
                           <th className="py-3.5 px-4 whitespace-nowrap">Company</th>
                           <th className="py-3.5 px-4 whitespace-nowrap">Country</th>
                           <th className="py-3.5 px-4 whitespace-nowrap">State / Region</th>
                           <th className="py-3.5 px-4 whitespace-nowrap">Manager</th>
                           <th className="py-3.5 px-4 whitespace-nowrap">Status</th>
                           <th className="py-3.5 px-4 whitespace-nowrap text-center">Loads (30 Days)</th>
                           <th className="py-3.5 px-6 text-center">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                        {branchesData.map(branch => (
                           <tr key={branch.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="py-3.5 px-6 font-bold text-gray-900 whitespace-nowrap">
                                <span onClick={() => setSelectedBranch(branch)} className="hover:text-purple-700 cursor-pointer">{branch.branchName}</span>
                              </td>
                              <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">{branch.branchCode}</td>
                              <td className="py-3.5 px-4 font-bold text-gray-600 whitespace-nowrap">{branch.company}</td>
                              <td className="py-3.5 px-4 whitespace-nowrap flex items-center gap-2">
                                 <span className="text-sm">{branch.flag}</span> {branch.country}
                              </td>
                              <td className="py-3.5 px-4 whitespace-nowrap font-bold text-gray-900">{branch.state}</td>
                              <td className="py-3.5 px-4 whitespace-nowrap font-bold text-gray-900">{branch.manager}</td>
                              <td className="py-3.5 px-4 whitespace-nowrap">{getStatusBadge(branch.status)}</td>
                              <td className="py-3.5 px-4 font-black text-gray-900 text-center">{branch.loads}</td>
                              <td className="py-3.5 px-6">
                                 <div className="flex justify-center gap-3 text-gray-400">
                                    <Eye size={14} className="hover:text-purple-600 cursor-pointer" onClick={() => setSelectedBranch(branch)} />
                                    <Link2 size={14} className="hover:text-purple-600 cursor-pointer" />
                                    <MoreVertical size={14} className="hover:text-gray-900 cursor-pointer" />
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
               
               {/* Pagination */}
               <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap justify-between items-center bg-gray-50/50 mt-auto rounded-b-2xl gap-4">
                  <span className="text-[12px] font-medium text-gray-500">Showing 1 to 10 of 18 branches</span>
                  <div className="flex items-center gap-3">
                     <div className="flex bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm">
                        <button className="px-2.5 py-1 text-gray-400 border-r border-gray-200 cursor-not-allowed bg-gray-50"><ChevronLeft size={14} /></button>
                        <button className="px-3 py-1 text-purple-700 font-bold border-r border-gray-200 bg-purple-50/50 cursor-pointer">1</button>
                        <button className="px-3 py-1 text-gray-600 font-bold border-r border-gray-200 hover:bg-gray-50 cursor-pointer">2</button>
                        <button className="px-2.5 py-1 text-gray-600 cursor-pointer hover:bg-gray-50"><ChevronRight size={14} /></button>
                     </div>
                     <select className="border border-gray-200 bg-white rounded-md px-2.5 py-1 text-[12px] font-medium text-gray-700 focus:outline-none cursor-pointer shadow-sm">
                        <option>10 / page</option>
                     </select>
                  </div>
               </div>
            </div>
         </div>

         {/* Right Column (Sidebar) */}
         <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* Branch Locations Map */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
               <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4">BRANCH LOCATIONS</h3>
               <div className="relative w-full h-[120px] mb-4 opacity-50 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-contain bg-center bg-no-repeat">
                  <div className="absolute top-[70%] left-[80%] w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="absolute top-[68%] left-[78%] w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="absolute top-[65%] left-[82%] w-2 h-2 rounded-full bg-orange-500"></div>
                  <div className="absolute top-[85%] left-[88%] w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="absolute top-[20%] left-[45%] w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="absolute top-[25%] left-[15%] w-2 h-2 rounded-full bg-green-500"></div>
               </div>
               <div className="flex justify-between items-center text-[9px] font-bold text-gray-500 px-2">
                  <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Active (12)</div>
                  <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> Pending Setup (2)</div>
                  <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> Inactive / Closed (4)</div>
               </div>
            </div>

            {/* Branch Summary */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
               <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                  <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">BRANCH SUMMARY</h3>
                  <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1">View Report <ArrowRight size={10}/></span>
               </div>
               <div className="flex flex-col gap-3 text-[12px] font-medium text-gray-600">
                  <div className="flex justify-between items-center">
                     <span>Active Branches</span>
                     <span className="font-bold text-gray-900">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span>Inactive Branches</span>
                     <span className="font-bold text-gray-900">2</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span>Pending Setup</span>
                     <span className="font-bold text-gray-900">2</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span>Closed Branches</span>
                     <span className="font-bold text-gray-900">2</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 mt-1 border-t border-gray-50">
                     <span className="font-bold text-blue-600">Total Branches</span>
                     <span className="font-bold text-blue-600">18</span>
                  </div>
               </div>
            </div>

            {/* Top Branches */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
               <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                  <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">TOP BRANCHES <span className="text-gray-400 normal-case">(by loads - 30 days)</span></h3>
                  <span className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-1 shrink-0">View All <ArrowRight size={10}/></span>
               </div>
               <div className="flex flex-col gap-3 text-[12px] font-bold">
                  <div className="flex justify-between items-center">
                     <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded flex items-center justify-center bg-green-50 text-green-600 text-[10px] shrink-0 border border-green-100">1</div>
                        <span className="text-gray-900 truncate">Sydney Head Office</span>
                     </div>
                     <span className="text-gray-600">245</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded flex items-center justify-center bg-green-50 text-green-600 text-[10px] shrink-0 border border-green-100">2</div>
                        <span className="text-gray-900 truncate">Melbourne Branch</span>
                     </div>
                     <span className="text-gray-600">189</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded flex items-center justify-center bg-green-50 text-green-600 text-[10px] shrink-0 border border-green-100">3</div>
                        <span className="text-gray-900 truncate">Brisbane Branch</span>
                     </div>
                     <span className="text-gray-600">156</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded flex items-center justify-center bg-green-50 text-green-600 text-[10px] shrink-0 border border-green-100">4</div>
                        <span className="text-gray-900 truncate">Auckland Branch</span>
                     </div>
                     <span className="text-gray-600">142</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded flex items-center justify-center bg-green-50 text-green-600 text-[10px] shrink-0 border border-green-100">5</div>
                        <span className="text-gray-900 truncate">Perth Branch</span>
                     </div>
                     <span className="text-gray-600">98</span>
                  </div>
               </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col">
               <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4 pb-3 border-b border-gray-50">QUICK ACTIONS</h3>
               <div className="flex flex-col gap-1 text-[12px] font-bold text-gray-700">
                  <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                     <Plus size={14} className="text-gray-400" /> Add New Branch
                  </button>
                  <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                     <Download size={14} className="text-gray-400" /> Import Branches (Bulk)
                  </button>
                  <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                     <Upload size={14} className="text-gray-400" /> Export Branch List
                  </button>
                  <button className="flex items-center gap-3 w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer text-left">
                     <FileText size={14} className="text-gray-400" /> Branch Setup Checklist
                  </button>
               </div>
            </div>
         </div>
      </div>

      {/* Developer Notes - Branch List */}
      <div className="bg-[#f8f9fc] border border-purple-100 rounded-2xl p-6 mt-6 shadow-sm">
         <h3 className="text-[12px] font-black text-purple-900 uppercase tracking-widest flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center shrink-0"><Terminal size={14} className="text-purple-700" /></div>
            DEVELOPER NOTES – BRANCH LIST
         </h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-[11px] text-gray-700">
            <div>
               <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Info size={12}/> 1. PURPOSE</div>
               <ul className="list-disc pl-4 space-y-1">
                  <li>Display all branches under the company.</li>
                  <li>Provide overview of branch status, location, manager and activity.</li>
                  <li>Enable quick access to branch details and management actions.</li>
               </ul>
            </div>
            <div>
               <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Settings size={12}/> 2. KEY FEATURES</div>
               <ul className="list-disc pl-4 space-y-1">
                  <li>Search, filters (country, status).</li>
                  <li>Status badges with color coding.</li>
                  <li>Loads count for last 30 days.</li>
                  <li>Quick actions for view and more options.</li>
                  <li>Bulk import/export functionality.</li>
               </ul>
            </div>
            <div>
               <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Bell size={12}/> 3. AUTOMATION & ALERTS</div>
               <ul className="list-disc pl-4 space-y-1">
                  <li>Alert if a branch is inactive for {'>'} 90 days.</li>
                  <li>Notify admin when a new branch is added.</li>
                  <li>Highlight branches pending setup.</li>
               </ul>
            </div>
            <div>
               <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Users size={12}/> 4. PERMISSIONS</div>
               <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Super Admin / Admin:</strong> Full access.</li>
                  <li><strong>Branch Admin:</strong> View own branch only.</li>
                  <li><strong>Dispatcher:</strong> View branches & basic info.</li>
                  <li><strong>Accounts:</strong> View branches for reporting.</li>
               </ul>
            </div>
            <div>
               <div className="font-bold text-purple-800 mb-2 flex items-center gap-1.5"><Database size={12}/> 5. DATA SOURCES</div>
               <ul className="list-disc pl-4 space-y-1">
                  <li>Branches master data.</li>
                  <li>Branch managers and users.</li>
                  <li>Load data (last 30 days).</li>
                  <li>Company and country information.</li>
               </ul>
            </div>
         </div>
      </div>
    </div>
  );
}
