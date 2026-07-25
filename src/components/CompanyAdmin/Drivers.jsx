import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Truck, Coffee, Clock, AlertTriangle, Calendar,
  Search, Filter, RefreshCcw, MoreVertical, ChevronDown,
  ChevronLeft, ChevronRight, Download, Upload, CalendarDays,
  UserPlus, HelpCircle, AlertCircle, FileText, CheckCircle2,
  Settings, User, MapPin, Briefcase, ChevronUp, Target, CheckSquare, Shield, UploadCloud,
  Edit2, MessageSquare, ShieldCheck, Activity, XCircle, Plus, ArrowRight,
  TrendingUp, Award, Zap, FileText as FileIcon, FileCheck, Star, ThumbsUp, CheckCircle, BarChart2,
  Eye, Trash2, Printer, Search as SearchIcon, Edit, MoreHorizontal
} from 'lucide-react';

const mockDrivers = [
  { id: 'DRV001', name: 'Mike Thompson', age: 34, dob: '1990-06-15', dr: 'NSW /990', phone: '0412 345 678', email: 'mike.thompson@herologistics.com.au', address: '12 Greenfield Rd, Campbelltown NSW 2560', licence: 'HR (Heavy Rigid)', licenceNo: 'NSW 12345678', issueDate: '12/03/2023', employmentType: 'Full Time', status: 'On Duty', branch: 'Sydney', assignmentId: 'PO-12546', assignmentType: 'Car Carrying', complianceStatus: 'Compliant', complianceScore: '100%', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
  { id: 'DRV002', name: 'Rajesh Patel', age: 41, dob: '1983-04-12', dr: 'VIC /442', phone: '0433 765 432', email: 'rajesh.patel@herologistics.com.au', address: '45 Station St, Dandenong VIC 3175', licence: 'HC (Heavy Combination)', licenceNo: 'NSW 87654321', issueDate: '18/08/2022', employmentType: 'Full Time', status: 'On Duty', branch: 'Melbourne', assignmentId: 'PO-12548', assignmentType: 'General Freight', complianceStatus: 'Compliant', complianceScore: '92%', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 'DRV003', name: 'Daniel White', age: 28, dob: '1998-11-22', dr: 'QLD /110', phone: '0401 112 233', email: 'daniel.white@herologistics.com.au', address: '88 Boundary St, West End QLD 4101', licence: 'MR (Medium Rigid)', licenceNo: 'VIC 11223344', issueDate: '05/01/2024', employmentType: 'Full Time', status: 'Off Duty', branch: 'Brisbane', assignmentId: '—', assignmentType: 'Not assigned', complianceStatus: 'Compliant', complianceScore: '85%', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: 'DRV004', name: 'Sandeep Singh', age: 38, dob: '1986-09-03', dr: 'QLD /889', phone: '0422 334 455', email: 'sandeep.singh@herologistics.com.au', address: '14 Logan Rd, Woolloongabba QLD 4102', licence: 'HC (Heavy Combination)', licenceNo: 'QLD 44556677', issueDate: '21/11/2021', employmentType: 'Full Time', status: 'On Leave', branch: 'Brisbane', assignmentId: '—', assignmentType: 'On Annual Leave', complianceStatus: '1 Expiring', complianceScore: '78%', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: 'DRV005', name: 'Lisa Brown', age: 31, dob: '1993-02-17', dr: 'NSW /331', phone: '0411 556 789', email: 'lisa.brown@herologistics.com.au', address: '72 Parramatta Rd, Strathfield NSW 2135', licence: 'LR (Light Rigid)', licenceNo: 'NSW 99887766', issueDate: '10/06/2023', employmentType: 'Part Time', status: 'Off Duty', branch: 'Sydney', assignmentId: '—', assignmentType: 'Not assigned', complianceStatus: 'Compliant', complianceScore: '90%', avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: 'DRV006', name: 'Ahmed Khan', age: 36, dob: '1988-07-29', dr: 'VIC /778', phone: '0430 687 788', email: 'ahmed.khan@herologistics.com.au', address: '29 Sydney Rd, Brunswick VIC 3056', licence: 'HC (Heavy Combination)', licenceNo: 'NSW 22334455', issueDate: '01/09/2020', employmentType: 'Full Time', status: 'Unavailable', branch: 'Melbourne', assignmentId: '—', assignmentType: 'Medical Leave', complianceStatus: '2 Expiring', complianceScore: '60%', avatar: 'https://i.pravatar.cc/150?u=6' },
  { id: 'DRV007', name: 'Jake Martin', age: 29, dob: '1995-12-08', dr: 'SA /551', phone: '0408 889 900', email: 'jake.martin@herologistics.com.au', address: '10 King William St, Adelaide SA 5000', licence: 'MR (Medium Rigid)', licenceNo: 'VIC 33445566', issueDate: '14/04/2023', employmentType: 'Casual', status: 'On Duty', branch: 'Adelaide', assignmentId: 'PO-12550', assignmentType: 'Dangerous Goods', complianceStatus: 'Compliant', complianceScore: '85%', avatar: 'https://i.pravatar.cc/150?u=7' },
  { id: 'DRV008', name: 'Priya Sharma', age: 27, dob: '1997-03-30', dr: 'WA /902', phone: '0423 123 987', email: 'priya.sharma@herologistics.com.au', address: '5 St Georges Tce, Perth WA 6000', licence: 'MR (Medium Rigid)', licenceNo: 'QLD 55667788', issueDate: '09/10/2023', employmentType: 'Full Time', status: 'Off Duty', branch: 'Perth', assignmentId: '—', assignmentType: 'Not assigned', complianceStatus: 'Compliant', complianceScore: '88%', avatar: 'https://i.pravatar.cc/150?u=8' },
];

const mockDocuments = [
  { id: 1, category: 'Licences', type: 'Driver Licence (HR)', number: 'LPI1234567', issue: '12/03/2018', expiry: '12/03/2028', status: 'Valid', daysLeft: '884 days', notes: 'Heavy Rigid primary driving licence. Verified by HR dept.', fileName: 'hr_licence_scan.pdf', fileSize: '1.8 MB' },
  { id: 2, category: 'Licences', type: 'Driver Licence (MR)', number: 'MR1122334', issue: '10/04/2016', expiry: '10/04/2026', status: 'Valid', daysLeft: '235 days', notes: 'Medium Rigid secondary licence endorsement.', fileName: 'mr_licence_scan.pdf', fileSize: '1.2 MB' },
  { id: 3, category: 'Medical', type: 'Medical Certificate', number: 'MED-567890', issue: '10/08/2024', expiry: '10/08/2025', status: 'Expiring Soon', daysLeft: '28 days', notes: 'Annual Commercial Driver Health Check by Dr. A. Smith.', fileName: 'medical_cert_2024.pdf', fileSize: '2.4 MB' },
  { id: 4, category: 'Certifications', type: 'First Aid Certificate', number: 'FA-334455', issue: '05/12/2024', expiry: '05/12/2025', status: 'Valid', daysLeft: '113 days', notes: 'HLTAID011 Provide First Aid course completed.', fileName: 'first_aid_cert.pdf', fileSize: '950 KB' },
  { id: 5, category: 'Certifications', type: 'Dangerous Goods (DG)', number: 'DG-778899', issue: '02/02/2024', expiry: '02/02/2026', status: 'Valid', daysLeft: '145 days', notes: 'Class 3 Flammable Liquids & Class 8 Corrosives endorsement.', fileName: 'dg_licence.pdf', fileSize: '1.5 MB' },
  { id: 6, category: 'Training', type: 'Fatigue Management Cert.', number: 'FM-445566', issue: '15/02/2024', expiry: '15/02/2026', status: 'Valid', daysLeft: '158 days', notes: 'BFM (Basic Fatigue Management) scheme accreditation.', fileName: 'fatigue_mgmt.pdf', fileSize: '1.1 MB' },
  { id: 7, category: 'Other', type: 'Working With Children', number: 'WWC-889900', issue: '01/07/2023', expiry: '01/07/2026', status: 'Valid', daysLeft: '311 days', notes: 'Required for school district deliveries.', fileName: 'wwc_clearance.pdf', fileSize: '800 KB' },
  { id: 8, category: 'Licences', type: 'Forklift Licence', number: 'FL-125678', issue: '20/01/2024', expiry: '20/01/2026', status: 'Valid', daysLeft: '133 days', notes: 'High Risk Work Licence (LF category).', fileName: 'forklift_licence.pdf', fileSize: '1.3 MB' },
  { id: 9, category: 'Certifications', type: 'Heavy Vehicle Accreditation', number: 'HVA-223344', issue: '18/03/2024', expiry: '18/03/2026', status: 'Valid', daysLeft: '169 days', notes: 'NHVAS Maintenance & Mass Management accredited.', fileName: 'nhvas_cert.pdf', fileSize: '2.0 MB' },
  { id: 10, category: 'Training', type: 'Chain of Responsibility', number: 'COR-556677', issue: '01/06/2024', expiry: '01/06/2026', status: 'Valid', daysLeft: '244 days', notes: 'CoR Level 2 Supervisor Training completed.', fileName: 'cor_training.pdf', fileSize: '1.4 MB' },
  { id: 11, category: 'Certifications', type: 'Road Ranger Accreditation', number: 'RR-998877', issue: '01/09/2023', expiry: '01/09/2025', status: 'Expired', daysLeft: 'Expired', notes: 'Non-synchronized gearbox operational cert. Renewal pending.', fileName: 'road_ranger.pdf', fileSize: '900 KB' },
  { id: 12, category: 'Other', type: 'Blue Card (QLD)', number: 'BC-667788', issue: '30/11/2023', expiry: '10/11/2026', status: 'Valid', daysLeft: '308 days', notes: 'Queensland safety clearance card.', fileName: 'blue_card_qld.pdf', fileSize: '1.0 MB' }
];

export default function Drivers() {
  const [driverList, setDriverList] = useState(mockDrivers);
  const [editDriverModal, setEditDriverModal] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [activeDocTab, setActiveDocTab] = useState('All Documents');
  const [activePayTab, setActivePayTab] = useState('Pay Overview');
  const [activeActivityTab, setActiveActivityTab] = useState('All Activities');
  const [activitySearchKeyword, setActivitySearchKeyword] = useState('');
  const [activityFromDate, setActivityFromDate] = useState('');
  const [activityToDate, setActivityToDate] = useState('');
  const [selectedTimelineModal, setSelectedTimelineModal] = useState(null);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);

  const [timelineEventsList, setTimelineEventsList] = useState([
    {
      id: '#1001',
      title: 'Medical Certificate Verified',
      category: 'Compliance',
      status: 'Verified',
      time: 'Today at 09:00 AM',
      date: '2026-07-24',
      description: 'National Medical Fitness Certificate verification completed successfully with zero restrictions.',
      performedBy: 'Compliance Automated Auditor',
      location: 'Sydney HQ Portal',
      ip: '192.168.1.104',
      hash: 'SHA256: 8f9a2b71c4d5e901'
    },
    {
      id: '#1002',
      title: 'Vehicle Post-Trip Inspection Completed',
      category: 'Assignments',
      status: 'Success',
      time: 'Today at 05:15 PM',
      date: '2026-07-24',
      description: 'Returned vehicle Volvo FH16 (VH-9930) after shift completion. All safety checks and tire pressure logs passed.',
      performedBy: 'Rajesh Patel (Driver)',
      location: 'Depot 4 - Sydney',
      ip: '10.0.4.82',
      hash: 'SHA256: 3c7e1a90f2b4e881'
    },
    {
      id: '#1003',
      title: 'Pre-Trip Safety Checklist Passed',
      category: 'Safety',
      status: 'Passed',
      time: 'Today at 07:15 AM',
      date: '2026-07-24',
      description: 'Pre-start fatigue checklist, breathalyzer 0.00 BAC test, and vehicle brake check submitted.',
      performedBy: 'Rajesh Patel (Driver)',
      location: 'Mobile Driver App',
      ip: '172.16.42.19',
      hash: 'SHA256: 7d1e8c92a4b0f113'
    },
    {
      id: '#1004',
      title: 'Load LD-34412 Started',
      category: 'Assignments',
      status: 'Active',
      time: 'Yesterday at 07:30 AM',
      date: '2026-07-23',
      description: 'Dispatched Heavy Combination freight from Sydney NSW to Canberra ACT with 24.5 tonnes cargo.',
      performedBy: 'Dispatch Operations Control',
      location: 'Central Operations Unit',
      ip: '192.168.1.55',
      hash: 'SHA256: 9b4a1c80e3d2f701'
    },
    {
      id: '#1005',
      title: 'Fatigue Management Break Recorded',
      category: 'Safety',
      status: 'Compliant',
      time: 'Yesterday at 01:30 PM',
      date: '2026-07-23',
      description: 'Mandatory 30-minute rest break taken at Goulburn Rest Stop under Heavy Vehicle National Law (HVNL) rules.',
      performedBy: 'Telematics Auto Logger',
      location: 'Goulburn Rest Stop NSW',
      ip: '10.40.12.9',
      hash: 'SHA256: 1a5e7c89f0b2d441'
    },
    {
      id: '#1006',
      title: 'Heavy Rigid (HR) Licence Renewed',
      category: 'Documents',
      status: 'Approved',
      time: '21/07/2026 at 11:20 AM',
      date: '2026-07-21',
      description: 'New NSW Heavy Rigid Licence document (Licence #990123) uploaded and verified by HR department.',
      performedBy: 'HR Operations Lead',
      location: 'HR Admin Portal',
      ip: '192.168.1.12',
      hash: 'SHA256: 5f2d9a10b8c4e772'
    },
    {
      id: '#1007',
      title: 'Bi-Weekly Pay Advice Generated',
      category: 'Payroll',
      status: 'Processed',
      time: '16/07/2025 at 04:00 PM',
      date: '2025-07-16',
      description: 'Gross pay $3,480.00 disbursed to Commonwealth Bank account ending in 4829.',
      performedBy: 'Automated Payroll Engine',
      location: 'Payroll Server #2',
      ip: '10.0.99.14',
      hash: 'SHA256: 2b8e4a91c0f7d332'
    },
    {
      id: '#1008',
      title: 'Annual Leave Request Approved',
      category: 'Leave',
      status: 'Approved',
      time: '12/07/2025 at 02:45 PM',
      date: '2025-07-12',
      description: '5 Days Annual Leave request approved for period 12/08/2025 to 18/08/2025.',
      performedBy: 'Operations Manager',
      location: 'Manager Portal',
      ip: '192.168.1.88',
      hash: 'SHA256: 4c0e2f91a8d7b661'
    },
    {
      id: '#1009',
      title: 'Driver Duty Status Changed to Available',
      category: 'Status Changes',
      status: 'Updated',
      time: '10/07/2025 at 06:00 PM',
      date: '2025-07-10',
      description: 'Driver status updated from On Duty to Available upon completion of weekly route schedule.',
      performedBy: 'Rajesh Patel (Driver)',
      location: 'Mobile Driver App',
      ip: '172.16.42.19',
      hash: 'SHA256: 6a1b8c90d2e4f553'
    }
  ]);

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isEditingDriver, setIsEditingDriver] = useState(false);
  const [isDetailsMoreOpen, setIsDetailsMoreOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [licenceFilter, setLicenceFilter] = useState('All');
  const [complianceFilter, setComplianceFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('All');

  // Table action dropdown & modal states
  const [documentList, setDocumentList] = useState(mockDocuments);
  const [docMenuIndex, setDocMenuIndex] = useState(null);
  const [docMenuPos, setDocMenuPos] = useState(null);
  const [viewDocModal, setViewDocModal] = useState(null);
  const [editDocModal, setEditDocModal] = useState(null);
  const [deleteDocModal, setDeleteDocModal] = useState(null);
  const [addDocModal, setAddDocModal] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const [currentAssignmentsList, setCurrentAssignmentsList] = useState([
    { id: 'LD-12546', type: 'Car Carrier', route: 'Sydney NSW → Brisbane QLD', stops: '2 Stops', vehicle: 'Volvo FH 540 | TRK-101', start: '15/07/2025 06:00 AM', end: '18/07/2025 09:00 AM', status: 'In Progress' },
    { id: 'LD-12557', type: 'General Freight', route: 'Melbourne VIC → Sydney NSW', stops: '3 Stops', vehicle: 'Volvo FH 540 | TRK-101', start: '19/07/2025 07:00 AM', end: '20/07/2025 06:00 PM', status: 'Assigned' }
  ]);
  const [currAssignMenuIndex, setCurrAssignMenuIndex] = useState(null);
  const [currAssignMenuPos, setCurrAssignMenuPos] = useState(null);
  const [viewCurrAssignModal, setViewCurrAssignModal] = useState(null);
  const [editCurrAssignModal, setEditCurrAssignModal] = useState(null);

  const [upcomingAssignmentsList, setUpcomingAssignmentsList] = useState([
    { id: 'LD-12568', type: 'Car Carrier', route: 'Brisbane QLD → Adelaide SA', stops: '2 Stops', vehicle: 'Volvo FH 540 | TRK-101', start: '21/07/2025 08:00 AM', end: '22/07/2025 05:00 PM', status: 'Scheduled' },
    { id: 'LD-12572', type: 'Car Carrier', route: 'Adelaide SA → Melbourne VIC', stops: '2 Stops', vehicle: 'Volvo FH 540 | TRK-101', start: '24/07/2025 09:00 AM', end: '25/07/2025 06:00 PM', status: 'Scheduled' }
  ]);
  const [upAssignMenuIndex, setUpAssignMenuIndex] = useState(null);
  const [upAssignMenuPos, setUpAssignMenuPos] = useState(null);
  const [viewUpAssignModal, setViewUpAssignModal] = useState(null);
  const [editUpAssignModal, setEditUpAssignModal] = useState(null);

  const [evalLogList, setEvalLogList] = useState([
    { id: 1, date: '08/07/2026', assignment: 'LD-34412 (HR Heavy Rigid)', route: 'Sydney NSW → Canberra ACT', score: '95/100', status: 'Completed', remarks: 'Smooth vehicle handling recorded.', evaluator: 'Chief Fleet Inspector' },
    { id: 2, date: '05/07/2026', assignment: 'LD-34301 (HR Heavy Rigid)', route: 'Goulburn NSW → Sydney NSW', score: '97/100', status: 'Completed', remarks: 'Zero driving incidents, customer gave 5 stars.', evaluator: 'Customer Success Team' },
    { id: 3, date: '02/07/2026', assignment: 'LD-34288 (HR Heavy Rigid)', route: 'Sydney NSW Local Route', score: '84/100', status: 'Completed', remarks: 'Delayed by 15 mins due to road construction.', evaluator: 'Operations Controller' },
    { id: 4, date: '28/06/2026', assignment: 'LD-34150 (Car Carrier)', route: 'Brisbane QLD → Sydney NSW', score: '98/100', status: 'Completed', remarks: 'Perfect loading accuracy and zero vehicle damage.', evaluator: 'Senior Auditor' }
  ]);
  const [evalMenuIndex, setEvalMenuIndex] = useState(null);
  const [evalMenuPos, setEvalMenuPos] = useState(null);
  const [viewEvalModal, setViewEvalModal] = useState(null);
  const [editEvalModal, setEditEvalModal] = useState(null);

  const [showPrintReportModal, setShowPrintReportModal] = useState(false);

  const [payrollModal, setPayrollModal] = useState(null); // 'edit_rates' | 'add_allowance' | 'add_deduction' | 'request_leave' | 'update_super' | 'ai_insights'
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [showGroupCertModal, setShowGroupCertModal] = useState(false);

  const [payRatesList, setPayRatesList] = useState([
    { id: 1, category: 'Daily Base Rate', type: 'Per Day', rate: '$550.00', status: 'Active', rule: 'Standard 10-hr shift' },
    { id: 2, category: 'Overtime Hourly Rate', type: 'Per Hour (1.5x)', rate: '$75.00', status: 'Active', rule: 'After 10 hrs per day' },
    { id: 3, category: 'Night Shift Differential', type: 'Per Hour', rate: '$68.00', status: 'Active', rule: 'Work between 10pm - 6am' },
    { id: 4, category: 'Weekend Premium Rate', type: 'Per Day (1.8x)', rate: '$850.00', status: 'Active', rule: 'Saturday & Sunday Trips' },
    { id: 5, category: 'Public Holiday Rate', type: 'Per Day (2.5x)', rate: '$1,150.00', status: 'Active', rule: 'Gazetted National Holidays' }
  ]);

  const [allowancesList, setAllowancesList] = useState([
    { id: 1, name: 'Fuel Reimbursement', category: 'Travel & Vehicle', type: 'Expense Claim', amount: '$120.00', date: '16/07/2025', status: 'Approved' },
    { id: 2, name: 'Overnight Living Allowance', category: 'Meals & Board', type: 'Per Night', amount: '$85.00', date: '12/07/2025', status: 'Approved' },
    { id: 3, name: 'Truck Wash Allowance', category: 'Maintenance', type: 'Per Wash', amount: '$50.00', date: '15/07/2025', status: 'Approved' },
    { id: 4, name: 'Dangerous Goods Handling', category: 'Hazardous Load', type: 'Per Trip', amount: '$150.00', date: '08/07/2025', status: 'Approved' }
  ]);

  const [deductionsList, setDeductionsList] = useState([
    { id: 1, name: 'Salary Sacrifice Super', type: 'Pre-Tax Voluntary', amount: '$200.00', frequency: 'Per Pay Run', status: 'Active' },
    { id: 2, name: 'Advance Pay Repayment', type: 'Post-Tax Recovery', amount: '$300.00', frequency: 'Installment 2/4', status: 'Active' },
    { id: 3, name: 'Uniform & Safety Boots Fee', type: 'Post-Tax One-off', amount: '$75.00', frequency: 'One-time', status: 'Completed' }
  ]);

  const [leaveRequestsList, setLeaveRequestsList] = useState([
    { id: 1, type: 'Annual Leave', dates: '12/08/2025 - 18/08/2025', days: '5 Days', status: 'Approved', approver: 'HR Manager' },
    { id: 2, type: 'Personal / Sick Leave', dates: '04/06/2025 - 05/06/2025', days: '2 Days', status: 'Taken', approver: 'Ops Director' },
    { id: 3, type: 'Annual Leave', dates: '24/12/2025 - 02/01/2026', days: '7 Days', status: 'Pending Approval', approver: 'Pending' }
  ]);

  const [superInfo, setSuperInfo] = useState({
    fundName: 'AustralianSuper',
    memberNumber: 'AUS-9827361',
    usi: 'STA0100AU',
    rate: '11.5%',
    ytdContribution: '$8,450.00',
    status: 'Compliant & Active'
  });

  // Dedicated Document Printing Helper (Clean Popup Printing - 0 Blank Pages, 0 Page Clutter)
  const printDocumentHtml = (title, bodyHtml) => {
    const printWin = window.open('', '_blank', 'width=850,height=950');
    if (!printWin) {
      window.print();
      return;
    }
    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: 'Inter', system-ui, -apple-system, sans-serif;
              background: #ffffff;
              color: #0f172a;
              padding: 36px 40px;
              font-size: 11px;
              line-height: 1.5;
            }
            .header-bar { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 20px; }
            .header-bar h1 { font-size: 18px; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: -0.5px; }
            .header-bar p { font-size: 11px; color: #64748b; font-weight: 600; }
            .badge { display: inline-block; padding: 4px 10px; background: #f3e8ff; color: #6b21a8; font-size: 10px; font-weight: 800; border-radius: 6px; text-transform: uppercase; letter-spacing: 1px; }
            .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; background: #f8fafc; padding: 18px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 20px; }
            .info-box p.lbl { font-size: 9px; font-weight: 800; text-transform: uppercase; color: #94a3b8; letter-spacing: 1px; margin-bottom: 3px; }
            .info-box p.val { font-size: 13px; font-weight: 800; color: #0f172a; }
            .info-box p.sub { font-size: 11px; color: #64748b; font-weight: 500; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
            th { background: #f1f5f9; padding: 9px 12px; font-size: 9px; font-weight: 800; text-transform: uppercase; color: #475569; border-bottom: 1px solid #e2e8f0; text-align: left; }
            td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 11px; font-weight: 600; color: #1e293b; }
            tr:last-child td { border-bottom: none; }
            .txt-right { text-align: right; }
            .txt-emerald { color: #059669; font-weight: 800; }
            .txt-rose { color: #dc2626; font-weight: 800; }
            .txt-purple { color: #7c3aed; font-weight: 800; }
            .txt-bold { font-weight: 800; }
            .summary-card { background: #ecfdf5; border: 1px solid #a7f3d0; padding: 16px 20px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
            .summary-card p.lbl { font-size: 10px; font-weight: 900; text-transform: uppercase; color: #065f46; letter-spacing: 1px; }
            .summary-card p.val { font-size: 22px; font-weight: 900; color: #064e3b; }
            .declaration-box { border-top: 1px solid #e2e8f0; padding-top: 14px; margin-top: 20px; font-size: 10px; color: #64748b; font-style: italic; }
            .sig-row { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 30px; }
            .sig-box { text-align: right; }
            .sig-line { width: 180px; border-bottom: 2px solid #0f172a; margin-left: auto; margin-bottom: 4px; }
          </style>
        </head>
        <body>
          ${bodyHtml}
        </body>
      </html>
    `);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => {
      printWin.print();
      printWin.close();
    }, 350);
  };

  const handlePrintGroupCertificate = () => {
    const driverName = selectedDriver ? selectedDriver.name : 'Rajesh Patel';
    const driverId = selectedDriver ? selectedDriver.id : 'DRV002';
    const html = `
      <div class="header-bar">
        <div>
          <h1>Australian Taxation Office</h1>
          <p style="font-weight: 800; color: #0f172a; font-size: 12px; margin-top: 2px;">PAYG PAYMENT SUMMARY - INDIVIDUAL NON-BUSINESS</p>
          <p>Financial Tax Year: 01 July 2025 – 30 June 2026</p>
        </div>
        <div style="text-align: right;">
          <span class="badge">ATO Compliant</span>
          <p style="font-family: monospace; font-size: 10px; color: #94a3b8; margin-top: 4px;">Ref: PAYG-2026-${driverId}</p>
        </div>
      </div>

      <div class="grid-2">
        <div class="info-box">
          <p class="lbl">Payer / Employer Details</p>
          <p class="val">HERO LOGISTICS PTY LTD</p>
          <p class="sub">ABN: <b>98 123 456 789</b></p>
          <p class="sub">Level 12, 450 St Kilda Road, Melbourne VIC 3004</p>
        </div>
        <div class="info-box">
          <p class="lbl">Payee / Employee Details</p>
          <p class="val">${driverName}</p>
          <p class="sub">TFN: <b>492 881 902</b> | ID: <b style="color: #7c3aed;">${driverId}</b></p>
          <p class="sub">Period of Payment: <b>01/07/2025 to 30/06/2026</b></p>
        </div>
      </div>

      <p style="font-size: 10px; font-weight: 900; text-transform: uppercase; color: #0f172a; letter-spacing: 1px; margin-bottom: 8px;">Summary of Income & Tax Withheld</p>
      <table>
        <thead>
          <tr>
            <th>Payment Category</th>
            <th>Description</th>
            <th class="txt-right">Amount ($ AUD)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="txt-bold">Gross Payments</td>
            <td style="color: #64748b;">Total salary, wages, and daily base rate earnings</td>
            <td class="txt-right txt-bold" style="font-size: 13px;">$84,500.00</td>
          </tr>
          <tr>
            <td class="txt-bold txt-rose">Total Tax Withheld (PAYG)</td>
            <td style="color: #64748b;">Statutory income tax remitted to ATO</td>
            <td class="txt-right txt-rose" style="font-size: 13px;">$13,420.00</td>
          </tr>
          <tr>
            <td class="txt-bold txt-purple">Reportable Superannuation</td>
            <td style="color: #64748b;">11.5% Super guarantee contribution paid to AustralianSuper</td>
            <td class="txt-right txt-purple" style="font-size: 13px;">$9,717.50</td>
          </tr>
          <tr>
            <td class="txt-bold txt-emerald">Taxable Allowances</td>
            <td style="color: #64748b;">Living away from home, travel & fuel reimbursements</td>
            <td class="txt-right txt-emerald" style="font-size: 13px;">$3,420.00</td>
          </tr>
        </tbody>
      </table>

      <div class="declaration-box">
        <p>Declaration: I declare that the information shown on this payment summary is true and correct and has been generated in full accordance with Australian Taxation Office requirements under Single Touch Payroll (STP Phase 2).</p>
      </div>

      <div class="sig-row">
        <div>
          <p style="font-size: 9px; font-weight: 900; text-transform: uppercase; color: #94a3b8; letter-spacing: 1px;">Authorized Officer</p>
          <p style="font-weight: 800; color: #0f172a; margin-top: 2px;">Payroll Officer — Hero Logistics Fleet Operations</p>
          <p style="font-size: 10px; color: #64748b;">Issued on: 15 July 2026</p>
        </div>
        <div class="sig-box">
          <div class="sig-line"></div>
          <p style="font-size: 10px; font-weight: 700; color: #64748b;">Authorized Signature</p>
        </div>
      </div>
    `;
    printDocumentHtml(`PAYG Certificate - ${driverName}`, html);
  };

  const handlePrintPayslip = (slip) => {
    if (!slip) return;
    const driverName = selectedDriver ? selectedDriver.name : 'Rajesh Patel';
    const driverId = selectedDriver ? selectedDriver.id : 'DRV002';
    const licence = selectedDriver?.licence || 'Heavy Rigid (HR)';
    const html = `
      <div class="header-bar">
        <div>
          <h1 style="color: #7c3aed;">Hero Logistics Pty Ltd</h1>
          <p>ABN: 98 123 456 789 | Pay Advice Confidential</p>
        </div>
        <div style="text-align: right;">
          <h1 style="font-size: 15px;">PAY ADVICE</h1>
          <p style="font-weight: 700;">Pay Date: ${slip.payDate}</p>
        </div>
      </div>

      <div class="grid-2">
        <div class="info-box">
          <p class="lbl">Employee</p>
          <p class="val">${driverName}</p>
          <p class="sub">ID: <b>${driverId}</b> | TFN: ***-***-982</p>
        </div>
        <div class="info-box" style="text-align: right;">
          <p class="lbl">Pay Period</p>
          <p class="val">${slip.period}</p>
          <p class="sub">Employment: Full Time (${licence})</p>
        </div>
      </div>

      <p style="font-size: 10px; font-weight: 900; text-transform: uppercase; color: #0f172a; letter-spacing: 1px; margin-bottom: 8px;">Earnings & Allowances</p>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th class="txt-right">Rate</th>
            <th class="txt-right">Units / Days</th>
            <th class="txt-right">Total Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="txt-bold">Daily Base Rate (${licence})</td>
            <td class="txt-right">$550.00 / day</td>
            <td class="txt-right">${slip.units || '6 days'}</td>
            <td class="txt-right txt-bold">${slip.baseAmount || slip.gross}</td>
          </tr>
          ${slip.allowanceAmount && slip.allowanceAmount !== '$0.00' ? `
            <tr>
              <td class="txt-bold">Living & Fuel Allowances</td>
              <td class="txt-right">—</td>
              <td class="txt-right">—</td>
              <td class="txt-right txt-emerald">${slip.allowanceAmount}</td>
            </tr>
          ` : ''}
        </tbody>
      </table>

      <p style="font-size: 10px; font-weight: 900; text-transform: uppercase; color: #0f172a; letter-spacing: 1px; margin-bottom: 8px;">Deductions & Superannuation</p>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th class="txt-right">Type</th>
            <th class="txt-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="txt-bold">PAYG Income Tax Withheld</td>
            <td class="txt-right" style="color: #64748b;">Statutory Tax</td>
            <td class="txt-right txt-rose">${slip.tax}</td>
          </tr>
          <tr>
            <td class="txt-bold">Superannuation Guarantee (11.5%)</td>
            <td class="txt-right txt-purple">AustralianSuper</td>
            <td class="txt-right txt-purple">${slip.super}</td>
          </tr>
        </tbody>
      </table>

      <div class="summary-card">
        <div>
          <p class="lbl">Net Payment Disbursed</p>
          <p style="font-size: 10px; color: #047857; font-weight: 500;">Transferred to Commonwealth Bank (BSB 063-000 Acc ****4829)</p>
        </div>
        <p class="val">${slip.net}</p>
      </div>
    `;
    printDocumentHtml(`Payslip - ${slip.period}`, html);
  };

  const handlePrintPerformanceReport = () => {
    const driverName = selectedDriver ? selectedDriver.name : 'Rajesh Patel';
    const driverId = selectedDriver ? selectedDriver.id : 'DRV002';
    const branch = selectedDriver ? selectedDriver.branch : 'Melbourne';
    const html = `
      <div class="header-bar">
        <div>
          <h1 style="color: #7c3aed;">HERO LOGISTICS</h1>
          <p>Fleet & Driver Performance Operations Audit</p>
          <p>Level 4, Logistics House, Melbourne VIC 3000</p>
        </div>
        <div style="text-align: right;">
          <span class="badge">Official Report</span>
          <p style="font-weight: 800; font-size: 11px; margin-top: 4px;">REF: REP-2026-0724-${driverId}</p>
          <p style="color: #64748b; font-size: 10px;">Date: ${new Date().toLocaleDateString('en-GB')}</p>
        </div>
      </div>

      <div class="grid-2">
        <div class="info-box">
          <p class="lbl">Driver Name</p>
          <p class="val">${driverName}</p>
          <p class="sub">Branch: <b>${branch}</b></p>
        </div>
        <div class="info-box" style="text-align: right;">
          <p class="lbl">Driver ID / Licence</p>
          <p class="val" style="color: #7c3aed;">${driverId}</p>
          <p class="sub">Employment: <b>Full Time</b></p>
        </div>
      </div>

      <p style="font-size: 10px; font-weight: 900; text-transform: uppercase; color: #0f172a; letter-spacing: 1px; margin-bottom: 8px;">Key Performance Metrics Summary</p>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 20px;">
        <div style="background: #f3e8ff; border: 1px solid #d8b4fe; padding: 12px; border-radius: 10px; text-align: center;">
          <p style="font-size: 9px; font-weight: 800; text-transform: uppercase; color: #6b21a8;">Overall Score</p>
          <p style="font-size: 20px; font-weight: 900; color: #581c87;">96 / 100</p>
        </div>
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 12px; border-radius: 10px; text-align: center;">
          <p style="font-size: 9px; font-weight: 800; text-transform: uppercase; color: #1e40af;">On-Time Delivery</p>
          <p style="font-size: 20px; font-weight: 900; color: #1e3a8a;">97.2%</p>
        </div>
        <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 12px; border-radius: 10px; text-align: center;">
          <p style="font-size: 9px; font-weight: 800; text-transform: uppercase; color: #065f46;">Safety Rating</p>
          <p style="font-size: 20px; font-weight: 900; color: #064e3b;">98 / 100</p>
        </div>
      </div>

      <p style="font-size: 10px; font-weight: 900; text-transform: uppercase; color: #0f172a; letter-spacing: 1px; margin-bottom: 8px;">Completed Route Evaluations Log</p>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Assignment ID</th>
            <th>Route</th>
            <th>Score</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          ${evalLogList.map(item => `
            <tr>
              <td><b>${item.date}</b></td>
              <td style="color: #7c3aed; font-weight: 800;">${item.assignment}</td>
              <td>${item.route}</td>
              <td><b>${item.score}</b></td>
              <td style="color: #64748b;">${item.remarks}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="sig-row">
        <div>
          <p style="font-size: 9px; font-weight: 900; text-transform: uppercase; color: #94a3b8;">Evaluated & Verified By</p>
          <p style="font-weight: 800; color: #0f172a; margin-top: 2px;">Chief Operations Inspector</p>
          <p style="font-size: 10px; color: #64748b;">Hero Logistics Fleet Operations</p>
          <div class="sig-line"></div>
        </div>
        <div class="sig-box">
          <p style="font-size: 9px; font-weight: 900; text-transform: uppercase; color: #94a3b8;">System Audit Status</p>
          <p style="font-weight: 800; color: #059669;">APPROVED & VERIFIED</p>
          <p style="font-size: 10px; color: #64748b;">Audit Ref: AUD-883921</p>
          <div class="sig-line"></div>
        </div>
      </div>
    `;
    printDocumentHtml(`Performance Report - ${driverName}`, html);
  };

  const [driverMenuIndex, setDriverMenuIndex] = useState(null);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'On Duty': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Off Duty': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'On Leave': return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'Unavailable': return 'text-rose-700 bg-rose-50 border-rose-200';
      default: return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getComplianceIcon = (status) => {
    if (status === 'Compliant') {
      return <CheckCircle2 size={14} className="text-emerald-500" />;
    } else {
      return <AlertTriangle size={14} className="text-orange-500" />;
    }
  };

  const getComplianceTextColor = (status) => {
    if (status === 'Compliant') {
      return 'text-emerald-600';
    } else {
      return 'text-orange-600';
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setLicenceFilter('All');
    setComplianceFilter('All');
    setBranchFilter('All');
  };

  const filteredDrivers = driverList.filter(driver => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!driver.name.toLowerCase().includes(query) &&
        !driver.phone.includes(query) &&
        !driver.licence.toLowerCase().includes(query) &&
        !driver.licenceNo.toLowerCase().includes(query)) {
        return false;
      }
    }
    if (statusFilter !== 'All' && driver.status !== statusFilter) return false;
    if (licenceFilter !== 'All' && !driver.licence.startsWith(licenceFilter)) return false;
    if (complianceFilter !== 'All') {
      if (complianceFilter === 'Compliant' && driver.complianceStatus !== 'Compliant') return false;
      if (complianceFilter === 'Expiring' && driver.complianceStatus === 'Compliant') return false;
    }
    if (branchFilter !== 'All' && driver.branch !== branchFilter) return false;
    return true;
  });

  const InputField = ({ label, name, type = "text", placeholder, defaultValue, optional = false, className = "", options = [] }) => {
    const fieldName = name || label.replace(/[^a-zA-Z0-9]/g, '');
    return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
        {label} {!optional && <span className="text-rose-500">*</span>}
      </label>
      {type === "select" ? (
        <select name={fieldName} defaultValue={defaultValue} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 cursor-pointer">
          {options.length > 0 ? options.map((opt, i) => (
            <option key={i} value={opt}>{opt}</option>
          )) : (
            defaultValue && <option value={defaultValue}>{defaultValue}</option>
          )}
        </select>
      ) : (
        <input
          name={fieldName}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        />
      )}
    </div>
    );
  };

  const DocumentUploadBox = ({ title }) => {
    const [docFile, setDocFile] = useState(null);
    const docInputRef = useRef(null);

    const handleFileChange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        setDocFile({
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
        });
      }
    };

    return (
      <div className="w-full">
        <input
          type="file"
          ref={docInputRef}
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileChange}
        />
        {!docFile ? (
          <div
            onClick={() => docInputRef.current?.click()}
            className="border border-dashed border-slate-300 rounded-xl p-3 flex flex-col items-center justify-center text-center hover:border-purple-500 hover:bg-purple-50 transition-colors cursor-pointer group bg-slate-50/40"
          >
            <p className="text-[10px] font-bold text-slate-700 mb-2 truncate max-w-full">{title}</p>
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 group-hover:text-purple-600">
              <UploadCloud size={13} />
              <span>Upload</span>
            </div>
          </div>
        ) : (
          <div className="border border-purple-200 bg-purple-50/60 rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <CheckCircle size={14} className="text-emerald-600 shrink-0" />
              <div className="overflow-hidden">
                <p className="text-[10px] font-bold text-slate-800 truncate">{docFile.name}</p>
                <p className="text-[8px] font-medium text-slate-500">{docFile.size}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDocFile(null)}
              className="text-slate-400 hover:text-rose-600 transition-colors shrink-0"
              title="Remove File"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>
    );
  };

  const LicenceFileUploadBox = () => {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleFile = (selectedFile) => {
      if (selectedFile) {
        setFile({
          name: selectedFile.name,
          size: (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB',
          url: URL.createObjectURL(selectedFile)
        });
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    };

    return (
      <div className="w-full">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group w-full ${isDragging
                ? 'border-purple-600 bg-purple-100/50 scale-[0.99]'
                : 'border-slate-300 bg-slate-50/50 hover:border-purple-500 hover:bg-purple-50/50'
              }`}
          >
            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-2xs">
              <UploadCloud size={24} />
            </div>
            <p className="text-xs font-bold text-slate-800 mb-1">Drag and drop file here, or click to browse</p>
            <p className="text-[10px] font-medium text-slate-400 mb-4">Supports PDF, PNG, JPG up to 10MB.</p>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-2xs text-xs font-bold text-slate-700 hover:text-purple-600 hover:border-purple-300 transition-all cursor-pointer"
            >
              Browse file
            </button>
          </div>
        ) : (
          <div className="border border-purple-200 bg-purple-50/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <FileText size={20} />
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-black text-slate-800 truncate max-w-[240px]">{file.name}</p>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-bold">Uploaded</span>
                </div>
                <p className="text-[10px] text-slate-500 font-semibold">{file.size} • Ready for processing</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <a
                href={file.url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-white border border-purple-200 text-purple-700 rounded-lg text-xs font-bold hover:bg-purple-100 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Eye size={13} /> View File
              </a>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="p-1.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-100 transition-all cursor-pointer"
                title="Remove File"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const HeaderIcons = () => (
    <div className="flex items-center gap-4">
      <button onClick={() => alert('Help Center is currently being built. Stay tuned!')} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer">
        <HelpCircle size={14} /> <span>Need help?</span>
      </button>
      <div className="flex items-center gap-2">
        <div className="relative cursor-pointer">
          <div onClick={() => setIsAlertOpen(!isAlertOpen)}>
            <AlertCircle size={16} className="text-slate-400 hover:text-purple-600 transition-colors" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full text-[7px] text-white flex items-center justify-center font-bold">3</span>
          </div>
          {isAlertOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-3 z-50">
              <h4 className="text-xs font-black text-slate-800 mb-2">Notifications (3)</h4>
              <div className="text-[10px] text-slate-500 p-2 hover:bg-slate-50 rounded-lg border-b border-slate-50">Ahmed Khan is unavailable.</div>
              <div className="text-[10px] text-slate-500 p-2 hover:bg-slate-50 rounded-lg border-b border-slate-50">2 Drivers have documents expiring soon.</div>
              <div className="text-[10px] text-slate-500 p-2 hover:bg-slate-50 rounded-lg">New load assigned.</div>
            </div>
          )}
        </div>
        <div className="relative cursor-pointer">
          <div onClick={() => setIsMoreOpen(!isMoreOpen)}>
            <MoreVertical size={16} className="text-slate-400 hover:text-purple-600 transition-colors" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full text-[7px] text-white flex items-center justify-center font-bold">12</span>
          </div>
          {isMoreOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50">
              <button className="w-full text-left text-xs font-semibold text-slate-700 p-2 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors">Action Items (12)</button>
              <button className="w-full text-left text-xs font-semibold text-slate-700 p-2 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors">Manage Columns</button>
              <button className="w-full text-left text-xs font-semibold text-slate-700 p-2 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors">Import/Export Data</button>
            </div>
          )}
        </div>
        <div className="relative cursor-pointer ml-2">
          <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-[10px] font-black border border-slate-300 hover:border-purple-500 hover:text-purple-700 transition-all">
            SM
          </div>
          {isProfileOpen && (
            <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50">
              <Link to="/company-admin/my-profile" className="block text-xs font-semibold text-slate-700 p-2 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors">My Profile</Link>
              <Link to="/company-admin/company-settings" className="block text-xs font-semibold text-slate-700 p-2 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors">Settings</Link>
              <div className="border-t border-slate-100 my-1"></div>
              <button onClick={() => alert('Logged out successfully.')} className="w-full text-left text-xs font-semibold text-rose-600 p-2 hover:bg-rose-50 rounded-lg transition-colors">Log Out</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const SectionHeading = ({ title }) => (
    <h3 className="text-[13px] font-black text-slate-900 mb-4">{title}</h3>
  );

  const DataRow = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
      <span className="text-[11px] font-medium text-slate-500">{label}</span>
      <span className="text-[11px] font-bold text-slate-800 text-right">{value}</span>
    </div>
  );

  const renderAllModals = () => (
    <>
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[1000] flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toast}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-white text-xs cursor-pointer">&times;</button>
        </div>
      )}

      {/* EDIT DRIVER MODAL */}
      {editDriverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4" onClick={() => setEditDriverModal(null)}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <Edit size={16} className="text-purple-600" /> Edit Driver Profile ({editDriverModal.id})
              </h3>
              <button onClick={() => setEditDriverModal(null)} className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer">&times;</button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Name *</label>
                  <input type="text" value={editDriverModal.name || ''} onChange={e => setEditDriverModal({ ...editDriverModal, name: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Phone Number *</label>
                  <input type="text" value={editDriverModal.phone || ''} onChange={e => setEditDriverModal({ ...editDriverModal, phone: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Licence Type</label>
                  <input type="text" value={editDriverModal.licence || ''} onChange={e => setEditDriverModal({ ...editDriverModal, licence: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Licence Number</label>
                  <input type="text" value={editDriverModal.licenceNo || ''} onChange={e => setEditDriverModal({ ...editDriverModal, licenceNo: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Status</label>
                  <select value={editDriverModal.status || 'On Duty'} onChange={e => setEditDriverModal({ ...editDriverModal, status: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold bg-white cursor-pointer">
                    <option value="On Duty">On Duty</option>
                    <option value="Off Duty">Off Duty</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Branch</label>
                  <input type="text" value={editDriverModal.branch || ''} onChange={e => setEditDriverModal({ ...editDriverModal, branch: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Assignment ID</label>
                  <input type="text" value={editDriverModal.assignmentId || ''} onChange={e => setEditDriverModal({ ...editDriverModal, assignmentId: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Assignment Type</label>
                  <input type="text" value={editDriverModal.assignmentType || ''} onChange={e => setEditDriverModal({ ...editDriverModal, assignmentType: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-500 font-semibold" />
                </div>
              </div>
            </div>
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
              <button onClick={() => setEditDriverModal(null)} className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-white text-xs cursor-pointer">Cancel</button>
              <button onClick={() => {
                setDriverList(prev => prev.map(d => d.id === editDriverModal.id ? editDriverModal : d));
                if (selectedDriver && selectedDriver.id === editDriverModal.id) {
                  setSelectedDriver(editDriverModal);
                }
                setEditDriverModal(null);
                showToast(`Driver profile ${editDriverModal.id} updated`);
              }} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 text-xs shadow-sm cursor-pointer">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW DOCUMENT MODAL */}
      {viewDocModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[999] flex items-center justify-center p-4" onClick={() => setViewDocModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-white">
              <div>
                <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-0.5">{viewDocModal.category || 'Compliance Document'}</p>
                <h2 className="text-base font-black text-slate-900">{viewDocModal.type}</h2>
              </div>
              <button onClick={() => setViewDocModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 text-lg cursor-pointer">✕</button>
            </div>
            <div className="px-6 py-5 text-xs space-y-4">
              <div className="grid grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                <div><p className="text-slate-400 font-bold text-[10px] uppercase mb-0.5">Document Number</p><p className="font-extrabold text-slate-900 font-mono text-sm">{viewDocModal.number}</p></div>
                <div><p className="text-slate-400 font-bold text-[10px] uppercase mb-0.5">Status</p>
                  <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase ${viewDocModal.status === 'Valid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : viewDocModal.status === 'Expiring Soon' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>{viewDocModal.status}</span>
                </div>
                <div><p className="text-slate-400 font-bold text-[10px] uppercase mb-0.5">Issue Date</p><p className="font-extrabold text-slate-800">{viewDocModal.issue}</p></div>
                <div><p className="text-slate-400 font-bold text-[10px] uppercase mb-0.5">Expiry Date</p><p className="font-extrabold text-slate-800">{viewDocModal.expiry}</p></div>
                <div><p className="text-slate-400 font-bold text-[10px] uppercase mb-0.5">Days Remaining</p><p className="font-extrabold text-purple-700">{viewDocModal.daysLeft}</p></div>
                <div><p className="text-slate-400 font-bold text-[10px] uppercase mb-0.5">Verification</p><p className="font-extrabold text-emerald-600 flex items-center gap-1"><CheckCircle2 size={12} /> Verified</p></div>
              </div>

              {viewDocModal.notes && (
                <div className="bg-purple-50/40 border border-purple-100 rounded-xl p-3">
                  <p className="text-[10px] font-black text-purple-700 uppercase tracking-widest mb-1">Remarks & Notes</p>
                  <p className="text-xs text-slate-700 font-medium">{viewDocModal.notes}</p>
                </div>
              )}

              {/* File Preview Attachment Box */}
              <div className="border border-slate-200 rounded-xl p-3 flex items-center justify-between bg-white shadow-2xs">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                    <FileIcon size={20} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-800 truncate">{viewDocModal.fileName || `${viewDocModal.type.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{viewDocModal.fileSize || '1.8 MB'} • PDF Document</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => showToast(`Downloading ${viewDocModal.type} file...`)}
                    className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Download size={13} /> <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={() => {
                  setDeleteDocModal(viewDocModal);
                  setViewDocModal(null);
                }}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"
              >
                <Trash2 size={14} /> <span>Delete</span>
              </button>
              <div className="flex items-center gap-2">
                <button onClick={() => setViewDocModal(null)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer">Close</button>
                <button onClick={() => { setEditDocModal({ ...viewDocModal }); setViewDocModal(null); }} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md shadow-purple-600/20 flex items-center gap-1.5">
                  <Edit size={14} /> <span>Edit Record</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT DOCUMENT MODAL */}
      {editDocModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[999] flex items-center justify-center p-4" onClick={() => setEditDocModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-white">
              <div>
                <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-0.5">Edit Document</p>
                <h2 className="text-base font-black text-slate-900">{editDocModal.type}</h2>
              </div>
              <button onClick={() => setEditDocModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 text-lg cursor-pointer">✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              setDocumentList(prev => prev.map(item => item.id === editDocModal.id ? { ...editDocModal } : item));
              setEditDocModal(null);
              showToast(`Updated ${editDocModal.type} successfully`);
            }} className="px-6 py-5 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-slate-500 font-bold mb-1">Document Type *</label>
                  <input type="text" value={editDocModal.type || ''} onChange={(e) => setEditDocModal({ ...editDocModal, type: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-slate-500 font-bold mb-1">Category</label>
                  <select value={editDocModal.category || 'Other'} onChange={(e) => setEditDocModal({ ...editDocModal, category: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900 bg-white cursor-pointer">
                    <option value="Licences">Licences</option>
                    <option value="Medical">Medical</option>
                    <option value="Certifications">Certifications</option>
                    <option value="Training">Training</option>
                    <option value="Insurances">Insurances</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Document Number *</label>
                  <input type="text" value={editDocModal.number || ''} onChange={(e) => setEditDocModal({ ...editDocModal, number: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Status</label>
                  <select value={editDocModal.status || 'Valid'} onChange={(e) => setEditDocModal({ ...editDocModal, status: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900 bg-white cursor-pointer">
                    <option value="Valid">Valid</option>
                    <option value="Expiring Soon">Expiring Soon</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Issue Date</label>
                  <input type="text" value={editDocModal.issue || ''} onChange={(e) => setEditDocModal({ ...editDocModal, issue: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Expiry Date</label>
                  <input type="text" value={editDocModal.expiry || ''} onChange={(e) => setEditDocModal({ ...editDocModal, expiry: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900" />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-500 font-bold mb-1">Days Remaining Display</label>
                  <input type="text" value={editDocModal.daysLeft || ''} onChange={(e) => setEditDocModal({ ...editDocModal, daysLeft: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900" />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-500 font-bold mb-1">Notes / Remarks</label>
                  <textarea value={editDocModal.notes || ''} onChange={(e) => setEditDocModal({ ...editDocModal, notes: e.target.value })} className="w-full h-20 px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900 resize-none"></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setEditDocModal(null)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-purple-600/20">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE DOCUMENT CONFIRMATION MODAL */}
      {deleteDocModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[999] flex items-center justify-center p-4" onClick={() => setDeleteDocModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-1">Delete Document Record</h3>
              <p className="text-xs text-slate-500 font-medium mb-4">
                Are you sure you want to delete <span className="font-bold text-slate-800">{deleteDocModal.type}</span> ({deleteDocModal.number})? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={() => setDeleteDocModal(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setDocumentList(prev => prev.filter(d => d.id !== deleteDocModal.id));
                    setDeleteDocModal(null);
                    showToast(`Deleted ${deleteDocModal.type} successfully`);
                  }}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-rose-600/20"
                >
                  Delete Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD DOCUMENT MODAL */}
      {addDocModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[999] flex items-center justify-center p-4" onClick={() => setAddDocModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-white">
              <div>
                <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-0.5">New Document</p>
                <h2 className="text-base font-black text-slate-900">Add Compliance Document</h2>
              </div>
              <button onClick={() => setAddDocModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 text-lg cursor-pointer">✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const newDoc = {
                id: Date.now(),
                type: formData.get('type') || 'Custom Document',
                category: formData.get('category') || 'Other',
                number: formData.get('number') || 'DOC-' + Math.floor(100000 + Math.random() * 900000),
                issue: formData.get('issue') || new Date().toISOString().split('T')[0],
                expiry: formData.get('expiry') || '2026-12-31',
                status: formData.get('status') || 'Valid',
                daysLeft: formData.get('daysLeft') || '365 days',
                notes: formData.get('notes') || '',
                fileName: formData.get('fileName') || 'uploaded_document.pdf',
                fileSize: '1.5 MB'
              };
              setDocumentList(prev => [newDoc, ...prev]);
              setAddDocModal(false);
              showToast(`Added ${newDoc.type} successfully`);
            }} className="px-6 py-5 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-slate-500 font-bold mb-1">Document Type *</label>
                  <input name="type" required type="text" placeholder="e.g. Forklift Ticket" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-semibold text-slate-900" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-slate-500 font-bold mb-1">Category</label>
                  <select name="category" defaultValue="Licences" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-semibold text-slate-900 bg-white cursor-pointer">
                    <option value="Licences">Licences</option>
                    <option value="Medical">Medical</option>
                    <option value="Certifications">Certifications</option>
                    <option value="Training">Training</option>
                    <option value="Insurances">Insurances</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Document Number *</label>
                  <input name="number" required type="text" placeholder="e.g. LIC-998822" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-semibold text-slate-900" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Status</label>
                  <select name="status" defaultValue="Valid" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-semibold text-slate-900 bg-white cursor-pointer">
                    <option value="Valid">Valid</option>
                    <option value="Expiring Soon">Expiring Soon</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Issue Date</label>
                  <input name="issue" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-semibold text-slate-900" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Expiry Date</label>
                  <input name="expiry" type="date" defaultValue="2026-12-31" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-semibold text-slate-900" />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-500 font-bold mb-1">Days Left (Display)</label>
                  <input name="daysLeft" type="text" placeholder="e.g. 365 days" defaultValue="365 days" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-semibold text-slate-900" />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-500 font-bold mb-1">Notes / Remarks</label>
                  <textarea name="notes" placeholder="Add optional remarks..." className="w-full h-20 px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-semibold text-slate-900 resize-none"></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setAddDocModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-purple-600/20">Add Document</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW ASSIGNMENT MODAL */}
      {(viewCurrAssignModal || viewUpAssignModal) && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[999] flex items-center justify-center p-4" onClick={() => { setViewCurrAssignModal(null); setViewUpAssignModal(null); }}>
          {(() => {
            const item = viewCurrAssignModal || viewUpAssignModal;
            const closeModal = () => { setViewCurrAssignModal(null); setViewUpAssignModal(null); };
            return (
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-white">
                  <div>
                    <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-0.5">Assignment Details</p>
                    <h2 className="text-base font-black text-slate-900">{item.id} - {item.type}</h2>
                  </div>
                  <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 text-lg cursor-pointer">✕</button>
                </div>
                <div className="px-6 py-5 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-slate-400 font-bold mb-0.5">Load ID</p><p className="font-extrabold text-slate-900 font-mono">{item.id}</p></div>
                    <div><p className="text-slate-400 font-bold mb-0.5">Load Type</p><p className="font-extrabold text-slate-900">{item.type}</p></div>
                    <div className="col-span-2"><p className="text-slate-400 font-bold mb-0.5">Route / Stops</p><p className="font-extrabold text-slate-900">{item.route} ({item.stops})</p></div>
                    <div className="col-span-2"><p className="text-slate-400 font-bold mb-0.5">Vehicle</p><p className="font-extrabold text-slate-900">{item.vehicle}</p></div>
                    <div><p className="text-slate-400 font-bold mb-0.5">Start Date & Time</p><p className="font-extrabold text-slate-900">{item.start}</p></div>
                    <div><p className="text-slate-400 font-bold mb-0.5">Est. End Date & Time</p><p className="font-extrabold text-slate-900">{item.end}</p></div>
                    <div><p className="text-slate-400 font-bold mb-0.5">Status</p>
                      <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-purple-50 text-purple-600 border border-purple-200">{item.status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                  <button onClick={closeModal} className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer">Close</button>
                  <button onClick={() => {
                    if (viewCurrAssignModal) {
                      const idx = currentAssignmentsList.findIndex(a => a.id === viewCurrAssignModal.id);
                      setEditCurrAssignModal({ ...viewCurrAssignModal, index: idx >= 0 ? idx : 0 });
                      setViewCurrAssignModal(null);
                    } else if (viewUpAssignModal) {
                      const idx = upcomingAssignmentsList.findIndex(a => a.id === viewUpAssignModal.id);
                      setEditUpAssignModal({ ...viewUpAssignModal, index: idx >= 0 ? idx : 0 });
                      setViewUpAssignModal(null);
                    }
                  }} className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md shadow-purple-600/20 flex items-center gap-1.5">
                    <Edit size={14} /> <span>Edit Record</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* EDIT ASSIGNMENT MODAL */}
      {(editCurrAssignModal || editUpAssignModal) && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[999] flex items-center justify-center p-4" onClick={() => { setEditCurrAssignModal(null); setEditUpAssignModal(null); }}>
          {(() => {
            const isCurr = !!editCurrAssignModal;
            const targetData = isCurr ? editCurrAssignModal : editUpAssignModal;
            const setTargetModal = isCurr ? setEditCurrAssignModal : setEditUpAssignModal;
            const closeModal = () => { setEditCurrAssignModal(null); setEditUpAssignModal(null); };

            return (
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-white">
                  <div>
                    <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-0.5">
                      {isCurr ? 'Current Assignment' : 'Upcoming Assignment'}
                    </p>
                    <h2 className="text-base font-black text-slate-900">Edit Assignment Details ({targetData.id})</h2>
                  </div>
                  <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 text-lg cursor-pointer">✕</button>
                </div>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (isCurr) {
                    setCurrentAssignmentsList(prev => prev.map((item, i) => i === editCurrAssignModal.index ? { ...editCurrAssignModal } : item));
                    setEditCurrAssignModal(null);
                  } else {
                    setUpcomingAssignmentsList(prev => prev.map((item, i) => i === editUpAssignModal.index ? { ...editUpAssignModal } : item));
                    setEditUpAssignModal(null);
                  }
                  showToast(`Updated assignment ${targetData.id} successfully`);
                }} className="px-6 py-5 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Load ID *</label>
                      <input type="text" value={targetData.id || ''} onChange={(e) => setTargetModal({ ...targetData, id: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900 font-mono" />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Load Type</label>
                      <select value={targetData.type || 'General Freight'} onChange={(e) => setTargetModal({ ...targetData, type: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900 bg-white cursor-pointer">
                        <option value="Car Carrier">Car Carrier</option>
                        <option value="General Freight">General Freight</option>
                        <option value="Dangerous Goods">Dangerous Goods</option>
                        <option value="Refrigerated">Refrigerated</option>
                        <option value="Bulk Transport">Bulk Transport</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-slate-500 font-bold mb-1">Route / Origin → Destination *</label>
                      <input type="text" value={targetData.route || ''} onChange={(e) => setTargetModal({ ...targetData, route: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900" />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Stops</label>
                      <input type="text" value={targetData.stops || ''} onChange={(e) => setTargetModal({ ...targetData, stops: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900" />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Vehicle Details</label>
                      <input type="text" value={targetData.vehicle || ''} onChange={(e) => setTargetModal({ ...targetData, vehicle: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900" />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Start Date & Time</label>
                      <input type="text" value={targetData.start || ''} onChange={(e) => setTargetModal({ ...targetData, start: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900" />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">Est. End Date & Time</label>
                      <input type="text" value={targetData.end || ''} onChange={(e) => setTargetModal({ ...targetData, end: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-slate-500 font-bold mb-1">Status</label>
                      <select value={targetData.status || 'Assigned'} onChange={(e) => setTargetModal({ ...targetData, status: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900 bg-white cursor-pointer">
                        <option value="In Progress">In Progress</option>
                        <option value="Assigned">Assigned</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                    <button type="button" onClick={closeModal} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer">Cancel</button>
                    <button type="submit" className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-purple-600/20">Save Changes</button>
                  </div>
                </form>
              </div>
            );
          })()}
        </div>
      )}
      {/* VIEW EVALUATION MODAL */}
      {viewEvalModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[999] flex items-center justify-center p-4" onClick={() => setViewEvalModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-white">
              <div>
                <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-0.5">Performance Evaluation Log</p>
                <h2 className="text-base font-black text-slate-900">{viewEvalModal.assignment}</h2>
              </div>
              <button onClick={() => setViewEvalModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 text-lg cursor-pointer">✕</button>
            </div>
            <div className="px-6 py-5 text-xs space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-slate-400 font-bold mb-0.5">Evaluation Date</p><p className="font-extrabold text-slate-900">{viewEvalModal.date}</p></div>
                <div><p className="text-slate-400 font-bold mb-0.5">Evaluation Score</p><p className="font-extrabold text-purple-700 text-sm">{viewEvalModal.score}</p></div>
                <div className="col-span-2"><p className="text-slate-400 font-bold mb-0.5">Route</p><p className="font-extrabold text-slate-900">{viewEvalModal.route}</p></div>
                <div><p className="text-slate-400 font-bold mb-0.5">Evaluator</p><p className="font-extrabold text-slate-900">{viewEvalModal.evaluator || 'Chief Fleet Inspector'}</p></div>
                <div><p className="text-slate-400 font-bold mb-0.5">Status</p>
                  <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-50 text-emerald-600 border border-emerald-200">{viewEvalModal.status}</span>
                </div>
                <div className="col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-slate-400 font-bold mb-1">Remarks & Auditor Feedback</p>
                  <p className="font-semibold text-slate-700 leading-relaxed">{viewEvalModal.remarks}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <button onClick={() => setViewEvalModal(null)} className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer">Close</button>
              <button onClick={() => {
                const target = viewEvalModal;
                setViewEvalModal(null);
                setEditEvalModal({ ...target });
              }} className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md shadow-purple-600/20 flex items-center gap-1.5">
                <Edit size={14} /> <span>Edit Log</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT EVALUATION MODAL */}
      {editEvalModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[999] flex items-center justify-center p-4" onClick={() => setEditEvalModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-white">
              <div>
                <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-0.5">Edit Performance Log</p>
                <h2 className="text-base font-black text-slate-900">{editEvalModal.assignment}</h2>
              </div>
              <button onClick={() => setEditEvalModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 text-lg cursor-pointer">✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              setEvalLogList(prev => prev.map(item => item.id === editEvalModal.id ? { ...editEvalModal } : item));
              setEditEvalModal(null);
              showToast("Updated evaluation log entry successfully!");
            }} className="px-6 py-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Evaluation Date *</label>
                  <input type="text" value={editEvalModal.date || ''} onChange={e => setEditEvalModal({ ...editEvalModal, date: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Evaluation Score *</label>
                  <input type="text" value={editEvalModal.score || ''} onChange={e => setEditEvalModal({ ...editEvalModal, score: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900" />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-500 font-bold mb-1">Assignment / Load *</label>
                  <input type="text" value={editEvalModal.assignment || ''} onChange={e => setEditEvalModal({ ...editEvalModal, assignment: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900" />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-500 font-bold mb-1">Route Details *</label>
                  <input type="text" value={editEvalModal.route || ''} onChange={e => setEditEvalModal({ ...editEvalModal, route: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Evaluator / Authority</label>
                  <input type="text" value={editEvalModal.evaluator || ''} onChange={e => setEditEvalModal({ ...editEvalModal, evaluator: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Status</label>
                  <select value={editEvalModal.status || 'Completed'} onChange={e => setEditEvalModal({ ...editEvalModal, status: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900 bg-white cursor-pointer">
                    <option value="Completed">Completed</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Pending Auditor">Pending Auditor</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-500 font-bold mb-1">Remarks & Auditor Feedback</label>
                  <textarea rows={3} value={editEvalModal.remarks || ''} onChange={e => setEditEvalModal({ ...editEvalModal, remarks: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-semibold text-slate-900" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setEditEvalModal(null)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-purple-600/20">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* PRINT REPORT PREVIEW MODAL */}
      {showPrintReportModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[9999] flex items-center justify-center p-4 print:p-0 print:bg-white print:static" onClick={() => setShowPrintReportModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col print:shadow-none print:border-none print:max-w-none print:max-h-none print:w-full printable-document" onClick={e => e.stopPropagation()}>
            {/* Modal Control Header (Hidden when printing) */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white print:hidden">
              <div className="flex items-center gap-2">
                <FileIcon size={18} className="text-purple-400" />
                <h2 className="text-sm font-extrabold tracking-wide">Driver Performance Report Preview</h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    handlePrintPerformanceReport();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-purple-600/30"
                >
                  <FileIcon size={14} /> <span>Print Report Now</span>
                </button>
                <button onClick={() => setShowPrintReportModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-400 hover:text-white text-lg cursor-pointer">✕</button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div className="p-8 overflow-y-auto space-y-6 text-slate-800 font-sans print:p-0 print:overflow-visible">
              {/* Document Letterhead */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6">
                <div>
                  <div className="flex items-center gap-2 text-purple-700 font-black text-xl tracking-tight mb-1">
                    <div className="w-8 h-8 bg-purple-700 text-white rounded-lg flex items-center justify-center font-black">H</div>
                    HERO LOGISTICS
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Fleet & Driver Performance Operations</p>
                  <p className="text-xs text-slate-600 mt-1 font-medium">Level 4, Logistics House, Melbourne VIC 3000</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-xs font-extrabold tracking-wide mb-2 uppercase">Official Report</span>
                  <p className="text-xs font-extrabold text-slate-900">REF: REP-2026-0724-DW</p>
                  <p className="text-xs text-slate-500 font-bold">Date: {new Date().toLocaleDateString('en-GB')}</p>
                </div>
              </div>

              {/* Driver & Report Header */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Driver Name</p>
                  <p className="font-extrabold text-slate-900 text-sm">{selectedDriver ? selectedDriver.name : 'Daniel White'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Driver ID / Code</p>
                  <p className="font-extrabold text-purple-700 font-mono">{selectedDriver ? selectedDriver.id : 'DRV-101'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Assigned Branch</p>
                  <p className="font-extrabold text-slate-900">{selectedDriver ? selectedDriver.branch : 'Melbourne'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Employment Type</p>
                  <p className="font-extrabold text-slate-900">{selectedDriver ? selectedDriver.type : 'Full Time'}</p>
                </div>
              </div>

              {/* Performance Scorecards Summary */}
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Award size={14} className="text-purple-600" /> Performance Metrics Summary
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <p className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Overall Score</p>
                    <p className="text-2xl font-black text-purple-900 my-0.5">96 / 100</p>
                    <p className="text-[9px] font-bold text-emerald-600">+2.4% vs last month</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">On-Time Delivery</p>
                    <p className="text-2xl font-black text-blue-900 my-0.5">97.2%</p>
                    <p className="text-[9px] font-bold text-emerald-600">+0.8% vs last month</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Safety Rating</p>
                    <p className="text-2xl font-black text-emerald-900 my-0.5">98 / 100</p>
                    <p className="text-[9px] font-bold text-emerald-600">Zero critical alerts</p>
                  </div>
                </div>
              </div>

              {/* Operational Stats Grid */}
              <div className="grid grid-cols-4 gap-3 text-xs border border-slate-200 rounded-xl p-4 bg-white">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Total Loads</p>
                  <p className="text-base font-extrabold text-slate-900">124</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Distance (YTD)</p>
                  <p className="text-base font-extrabold text-slate-900">78,420 km</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Customer Rating</p>
                  <p className="text-base font-extrabold text-slate-900">4.92 / 5.0</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Compliance</p>
                  <p className="text-base font-extrabold text-emerald-600">100% Valid</p>
                </div>
              </div>

              {/* Evaluation Log Table */}
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3">Completed Route Evaluations Log</h3>
                <table className="w-full text-left border-collapse border border-slate-200 text-xs">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-black uppercase text-slate-600">
                      <th className="p-2.5 border-r border-slate-200">Date</th>
                      <th className="p-2.5 border-r border-slate-200">Assignment ID</th>
                      <th className="p-2.5 border-r border-slate-200">Route</th>
                      <th className="p-2.5 border-r border-slate-200">Score</th>
                      <th className="p-2.5">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {evalLogList.map((item, idx) => (
                      <tr key={idx} className="text-[11px]">
                        <td className="p-2.5 border-r border-slate-200 font-bold text-slate-700">{item.date}</td>
                        <td className="p-2.5 border-r border-slate-200 font-extrabold text-purple-700">{item.assignment}</td>
                        <td className="p-2.5 border-r border-slate-200 font-semibold text-slate-700">{item.route}</td>
                        <td className="p-2.5 border-r border-slate-200 font-black text-slate-900">{item.score}</td>
                        <td className="p-2.5 text-slate-600 font-medium">{item.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signature & Auditor Sign-off */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Evaluated & Verified By</p>
                  <p className="font-extrabold text-slate-900">Chief Operations Inspector</p>
                  <p className="text-[10px] text-slate-500 font-medium">Hero Logistics Fleet Operations</p>
                  <div className="mt-6 border-b border-slate-400 w-48" />
                  <p className="text-[9px] text-slate-400 mt-1">Authorized Signature & Seal</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">System Verification</p>
                  <p className="font-bold text-emerald-600">STATUS: APPROVED & VERIFIED</p>
                  <p className="text-[10px] text-slate-500">Automated Audit ID: AUD-883921</p>
                  <div className="mt-6 border-b border-slate-400 w-48 ml-auto" />
                  <p className="text-[9px] text-slate-400 mt-1">Verification Stamp</p>
                </div>
              </div>
            </div>

            {/* Modal Footer Controls (Hidden when printing) */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 print:hidden">
              <button onClick={() => setShowPrintReportModal(false)} className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold cursor-pointer">Close</button>
              <button
                onClick={() => {
                  handlePrintPerformanceReport();
                }}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md shadow-purple-600/30 flex items-center gap-2"
              >
                <FileIcon size={14} /> <span>Print Official Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* PAYROLL DYNAMIC MODALS */}
      {payrollModal === 'add_allowance' && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[999] flex items-center justify-center p-4" onClick={() => setPayrollModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-white">
              <h2 className="text-base font-black text-slate-900">Add New Allowance</h2>
              <button onClick={() => setPayrollModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 text-lg cursor-pointer">✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const name = fd.get('name');
              const category = fd.get('category');
              const type = fd.get('type');
              const amount = fd.get('amount');
              setAllowancesList(prev => [...prev, { id: Date.now(), name, category, type, amount: `$${amount}`, date: new Date().toLocaleDateString('en-GB'), status: 'Approved' }]);
              setPayrollModal(null);
              showToast(`Added allowance ${name} ($${amount}) successfully!`);
            }} className="px-6 py-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Allowance Name *</label>
                <input required name="name" type="text" placeholder="e.g. Dangerous Goods Bonus" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Category</label>
                  <select name="category" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900 bg-white">
                    <option value="Travel & Vehicle">Travel & Vehicle</option>
                    <option value="Meals & Board">Meals & Board</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Hazardous Load">Hazardous Load</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Type</label>
                  <select name="type" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900 bg-white">
                    <option value="Expense Claim">Expense Claim</option>
                    <option value="Per Night">Per Night</option>
                    <option value="Per Wash">Per Wash</option>
                    <option value="Per Trip">Per Trip</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Amount ($) *</label>
                <input required name="amount" type="number" step="0.01" placeholder="85.00" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900" />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setPayrollModal(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20">Add Allowance</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {payrollModal === 'add_deduction' && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[999] flex items-center justify-center p-4" onClick={() => setPayrollModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-white">
              <h2 className="text-base font-black text-slate-900">Add Voluntary / Statutory Deduction</h2>
              <button onClick={() => setPayrollModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 text-lg cursor-pointer">✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const name = fd.get('name');
              const type = fd.get('type');
              const amount = fd.get('amount');
              const frequency = fd.get('frequency');
              setDeductionsList(prev => [...prev, { id: Date.now(), name, type, amount: `$${amount}`, frequency, status: 'Active' }]);
              setPayrollModal(null);
              showToast(`Added deduction ${name} ($${amount}) successfully!`);
            }} className="px-6 py-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Deduction Name *</label>
                <input required name="name" type="text" placeholder="e.g. Salary Sacrifice Super" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Tax Type</label>
                  <select name="type" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900 bg-white">
                    <option value="Pre-Tax Voluntary">Pre-Tax Voluntary</option>
                    <option value="Post-Tax Recovery">Post-Tax Recovery</option>
                    <option value="Post-Tax One-off">Post-Tax One-off</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Frequency</label>
                  <select name="frequency" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900 bg-white">
                    <option value="Per Pay Run">Per Pay Run</option>
                    <option value="Monthly">Monthly</option>
                    <option value="One-time">One-time</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Deduction Amount ($) *</label>
                <input required name="amount" type="number" step="0.01" placeholder="150.00" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900" />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setPayrollModal(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20">Add Deduction</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {payrollModal === 'request_leave' && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[999] flex items-center justify-center p-4" onClick={() => setPayrollModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-white">
              <h2 className="text-base font-black text-slate-900">Submit Driver Leave Request</h2>
              <button onClick={() => setPayrollModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 text-lg cursor-pointer">✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const type = fd.get('type');
              const startDate = fd.get('startDate');
              const endDate = fd.get('endDate');
              const days = fd.get('days');
              setLeaveRequestsList(prev => [{ id: Date.now(), type, dates: `${startDate} - ${endDate}`, days: `${days} Days`, status: 'Pending Approval', approver: 'HR Director' }, ...prev]);
              setPayrollModal(null);
              showToast(`Submitted leave request for ${days} days (${type})`);
            }} className="px-6 py-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Leave Type *</label>
                <select name="type" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900 bg-white">
                  <option value="Annual Leave">Annual Leave (Balance: 18.5 Days)</option>
                  <option value="Personal / Sick Leave">Personal / Sick Leave (Balance: 9.2 Days)</option>
                  <option value="Long Service Leave">Long Service Leave (Balance: 34.0 Days)</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Start Date *</label>
                  <input required name="startDate" type="date" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">End Date *</label>
                  <input required name="endDate" type="date" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900" />
                </div>
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Total Days *</label>
                <input required name="days" type="number" min="1" max="30" defaultValue="3" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900" />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setPayrollModal(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {payrollModal === 'update_super' && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[999] flex items-center justify-center p-4" onClick={() => setPayrollModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-white">
              <h2 className="text-base font-black text-slate-900">Update Superannuation Fund Details</h2>
              <button onClick={() => setPayrollModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 text-lg cursor-pointer">✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const fundName = fd.get('fundName');
              const memberNumber = fd.get('memberNumber');
              const usi = fd.get('usi');
              setSuperInfo(prev => ({ ...prev, fundName, memberNumber, usi }));
              setPayrollModal(null);
              showToast(`Updated Super Fund details for ${fundName}`);
            }} className="px-6 py-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Super Fund Name *</label>
                <input required name="fundName" type="text" defaultValue={superInfo.fundName} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Member Number *</label>
                  <input required name="memberNumber" type="text" defaultValue={superInfo.memberNumber} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Fund USI *</label>
                  <input required name="usi" type="text" defaultValue={superInfo.usi} className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-bold text-slate-900" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setPayrollModal(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20">Save Super Details</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {payrollModal === 'ai_insights' && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[999] flex items-center justify-center p-4" onClick={() => setPayrollModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-purple-400" />
                <h2 className="text-sm font-black tracking-wide">AI Payroll Audit & Audit Recommendations</h2>
              </div>
              <button onClick={() => setPayrollModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-400 text-lg cursor-pointer">✕</button>
            </div>
            <div className="px-6 py-5 text-xs space-y-4">
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                <p className="font-extrabold text-xs mb-1">✅ 100% Tax & Super Guarantee Compliant</p>
                <p className="text-[11px] text-emerald-800 leading-relaxed">Statutory superannuation contribution of 11.5% has been verified across all 18 completed loads this month.</p>
              </div>
              <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-200 text-purple-900">
                <p className="font-extrabold text-xs mb-1">⚡ Allowance Optimization Tip</p>
                <p className="text-[11px] text-purple-800 leading-relaxed">Driver completed 2 overnight trips between Melbourne and Sydney. Living allowance claims of $170.00 match GPS logs exactly.</p>
              </div>
              <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 text-blue-900">
                <p className="font-extrabold text-xs mb-1">📈 Projected Net Pay for Next Month</p>
                <p className="text-[11px] text-blue-800 leading-relaxed">Based on scheduled load assignments LD-12568 & LD-12572, projected net pay for August 2025 is $3,450.00.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50">
              <button onClick={() => setPayrollModal(null)} className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer">Close Insights</button>
            </div>
          </div>
        </div>
      )}
      {/* PAYSLIP PREVIEW MODAL */}
      {selectedPayslip && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[9999] flex items-center justify-center p-4 print:p-0 print:bg-white print:static" onClick={() => setSelectedPayslip(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col print:shadow-none print:border-none print:max-w-none print:w-full printable-document" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white print:hidden">
              <div className="flex items-center gap-2">
                <FileIcon size={18} className="text-purple-400" />
                <h2 className="text-sm font-extrabold tracking-wide">Official Pay Advice / Payslip ({selectedPayslip.period})</h2>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => handlePrintPayslip(selectedPayslip)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-purple-600/30">
                  <FileIcon size={14} /> <span>Print Payslip</span>
                </button>
                <button onClick={() => setSelectedPayslip(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-400 text-lg cursor-pointer">✕</button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto space-y-6 text-slate-800 font-sans print:p-0 print:overflow-visible text-xs">
              {/* Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                <div>
                  <h1 className="text-lg font-black text-purple-700 tracking-tight">HERO LOGISTICS PTY LTD</h1>
                  <p className="text-[10px] text-slate-500 font-bold">ABN: 98 123 456 789 | Pay Advice Confidential</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">PAY ADVICE</p>
                  <p className="text-slate-500 font-bold">Pay Date: {selectedPayslip.payDate}</p>
                </div>
              </div>

              {/* Employee & Pay Period Details */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Employee</p>
                  <p className="font-extrabold text-slate-900 text-sm">{selectedDriver ? selectedDriver.name : 'Rajesh Patel'}</p>
                  <p className="text-slate-500">ID: {selectedDriver ? selectedDriver.id : 'DRV002'} | TFN: ***-***-982</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Pay Period</p>
                  <p className="font-extrabold text-slate-900">{selectedPayslip.period}</p>
                  <p className="text-slate-500">Employment: Full Time ({selectedDriver?.licence || 'HR Grade 5'})</p>
                </div>
              </div>

              {/* Earnings Table */}
              <div>
                <p className="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-2">Earnings & Allowances</p>
                <table className="w-full text-left border-collapse border border-slate-200">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-[9px] font-black uppercase text-slate-600">
                      <th className="p-2 border-r border-slate-200">Description</th>
                      <th className="p-2 border-r border-slate-200 text-right">Rate</th>
                      <th className="p-2 border-r border-slate-200 text-right">Units / Days</th>
                      <th className="p-2 text-right">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-2 border-r border-slate-200 font-bold">Daily Base Rate ({selectedDriver?.licence || 'Heavy Rigid'})</td>
                      <td className="p-2 border-r border-slate-200 text-right">$550.00 / day</td>
                      <td className="p-2 border-r border-slate-200 text-right">{selectedPayslip.units || '6 days'}</td>
                      <td className="p-2 text-right font-bold text-slate-900">{selectedPayslip.baseAmount || selectedPayslip.gross}</td>
                    </tr>
                    {selectedPayslip.allowanceAmount && selectedPayslip.allowanceAmount !== '$0.00' && (
                      <tr>
                        <td className="p-2 border-r border-slate-200 font-bold">Living & Fuel Allowances</td>
                        <td className="p-2 border-r border-slate-200 text-right">—</td>
                        <td className="p-2 border-r border-slate-200 text-right">—</td>
                        <td className="p-2 text-right font-bold text-emerald-600">{selectedPayslip.allowanceAmount}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Deductions & Super Table */}
              <div>
                <p className="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-2">Deductions & Superannuation</p>
                <table className="w-full text-left border-collapse border border-slate-200">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-[9px] font-black uppercase text-slate-600">
                      <th className="p-2 border-r border-slate-200">Description</th>
                      <th className="p-2 border-r border-slate-200 text-right">Type</th>
                      <th className="p-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-2 border-r border-slate-200 font-bold">PAYG Income Tax Withheld</td>
                      <td className="p-2 border-r border-slate-200 text-right text-slate-500">Statutory Tax</td>
                      <td className="p-2 text-right font-bold text-rose-600">{selectedPayslip.tax}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-slate-200 font-bold">Superannuation Guarantee (11.5%)</td>
                      <td className="p-2 border-r border-slate-200 text-right text-purple-700">AustralianSuper</td>
                      <td className="p-2 text-right font-bold text-purple-700">{selectedPayslip.super}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Net Pay Summary Box */}
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Net Payment Disbursed</p>
                  <p className="text-[10px] text-emerald-700">Transferred to Commonwealth Bank (BSB 063-000 Acc ****4829)</p>
                </div>
                <p className="text-2xl font-black text-emerald-900">{selectedPayslip.net}</p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 print:hidden">
              <button onClick={() => setSelectedPayslip(null)} className="px-5 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold">Close</button>
              <button onClick={() => handlePrintPayslip(selectedPayslip)} className="px-6 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/30 flex items-center gap-2 cursor-pointer">
                <FileIcon size={14} /> <span>Print Official Payslip</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GROUP CERTIFICATE MODAL */}
      {showGroupCertModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[9999] flex items-center justify-center p-4 print:p-0 print:bg-white print:static" onClick={() => setShowGroupCertModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col print:shadow-none print:border-none print:max-w-none print:w-full printable-document" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white print:hidden">
              <div className="flex items-center gap-2">
                <FileIcon size={18} className="text-purple-400" />
                <h2 className="text-sm font-extrabold tracking-wide">PAYG Payment Summary (Group Certificate 2025-26)</h2>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => handlePrintGroupCertificate()} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-purple-600/30">
                  <FileIcon size={14} /> <span>Print Certificate</span>
                </button>
                <button onClick={() => setShowGroupCertModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-400 text-lg cursor-pointer">✕</button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto space-y-6 text-slate-800 font-sans print:p-0 print:overflow-visible text-xs">
              {/* Official ATO Letterhead Header */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-3 h-3 bg-purple-600 rounded-full inline-block"></span>
                    <h1 className="text-base font-black text-slate-900 tracking-tight">AUSTRALIAN TAXATION OFFICE</h1>
                  </div>
                  <p className="text-xs font-extrabold text-slate-800">PAYG PAYMENT SUMMARY - INDIVIDUAL NON-BUSINESS</p>
                  <p className="text-[10px] text-slate-500 font-medium">Financial Tax Year: 01 July 2025 – 30 June 2026</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-xs font-black uppercase tracking-wider inline-block">ATO Compliant</span>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">Ref: PAYG-2026-{selectedDriver ? selectedDriver.id : 'DRV002'}</p>
                </div>
              </div>

              {/* Payer & Payee Details Grid */}
              <div className="grid grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payer / Employer Details</p>
                  <p className="font-extrabold text-slate-900 text-sm">HERO LOGISTICS PTY LTD</p>
                  <p className="text-slate-600 font-medium">ABN: <span className="font-mono font-bold text-slate-800">98 123 456 789</span></p>
                  <p className="text-slate-500 text-[11px]">Level 12, 450 St Kilda Road, Melbourne VIC 3004</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payee / Employee Details</p>
                  <p className="font-extrabold text-slate-900 text-sm">{selectedDriver ? selectedDriver.name : 'Rajesh Patel'}</p>
                  <p className="text-slate-600 font-medium">TFN: <span className="font-mono font-bold text-slate-800">492 881 902</span> | ID: <span className="font-mono font-bold text-purple-700">{selectedDriver ? selectedDriver.id : 'DRV002'}</span></p>
                  <p className="text-slate-500 text-[11px]">Period of Payment: <span className="font-bold text-slate-700">01/07/2025 to 30/06/2026</span></p>
                </div>
              </div>

              {/* Payment Summary Financial Breakdown */}
              <div>
                <p className="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-2">Summary of Income & Tax Withheld</p>
                <table className="w-full text-left border-collapse border border-slate-200">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-[9px] font-black uppercase text-slate-600">
                      <th className="p-2.5 border-r border-slate-200">Payment Category</th>
                      <th className="p-2.5 border-r border-slate-200">Description</th>
                      <th className="p-2.5 text-right">Amount ($ AUD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    <tr>
                      <td className="p-2.5 border-r border-slate-200 font-extrabold text-slate-900">Gross Payments</td>
                      <td className="p-2.5 border-r border-slate-200 text-slate-600">Total salary, wages, and daily base rate earnings</td>
                      <td className="p-2.5 text-right font-black text-slate-900 text-sm">$84,500.00</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border-r border-slate-200 font-extrabold text-rose-700">Total Tax Withheld (PAYG)</td>
                      <td className="p-2.5 border-r border-slate-200 text-slate-600">Statutory income tax remitted to ATO</td>
                      <td className="p-2.5 text-right font-black text-rose-600 text-sm">$13,420.00</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border-r border-slate-200 font-extrabold text-purple-700">Reportable Superannuation</td>
                      <td className="p-2.5 border-r border-slate-200 text-slate-600">11.5% Super guarantee contribution paid to AustralianSuper</td>
                      <td className="p-2.5 text-right font-black text-purple-700 text-sm">$9,717.50</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border-r border-slate-200 font-extrabold text-emerald-700">Taxable Allowances</td>
                      <td className="p-2.5 border-r border-slate-200 text-slate-600">Living away from home, travel & fuel reimbursements</td>
                      <td className="p-2.5 text-right font-black text-emerald-600 text-sm">$3,420.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Declaration & Sign-off Box */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <p className="text-[10px] text-slate-500 font-medium italic">
                  Declaration: I declare that the information shown on this payment summary is true and correct and has been generated in full accordance with Australian Taxation Office requirements under Single Touch Payroll (STP Phase 2).
                </p>
                <div className="flex justify-between items-end pt-2">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Authorized Officer</p>
                    <p className="font-extrabold text-slate-900">Payroll Officer — Hero Logistics Fleet Operations</p>
                    <p className="text-[10px] text-slate-500 font-medium">Issued on: 15 July 2026</p>
                  </div>
                  <div className="text-right">
                    <div className="border-b-2 border-slate-900 w-48 mb-1"></div>
                    <p className="text-[10px] font-bold text-slate-500">Authorized Signature</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 print:hidden">
              <button onClick={() => setShowGroupCertModal(false)} className="px-5 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer">Close</button>
              <button onClick={() => handlePrintGroupCertificate()} className="px-6 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/30 flex items-center gap-2 cursor-pointer">
                <FileIcon size={14} /> <span>Print Group Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVITY LOG DETAILS MODAL */}
      {selectedTimelineModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[9999] flex items-center justify-center p-4" onClick={() => setSelectedTimelineModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-purple-400" />
                <h2 className="text-sm font-extrabold tracking-wide">Audit Trail Details ({selectedTimelineModal.id})</h2>
              </div>
              <button onClick={() => setSelectedTimelineModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-400 text-lg cursor-pointer">✕</button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-black uppercase">{selectedTimelineModal.category}</span>
                  <span className="text-[10px] font-bold text-slate-400">{selectedTimelineModal.time}</span>
                </div>
                <h3 className="text-base font-black text-slate-900">{selectedTimelineModal.title}</h3>
                <p className="text-slate-600 font-medium leading-relaxed">{selectedTimelineModal.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-slate-200 text-[11px]">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">Performed By</p>
                  <p className="font-extrabold text-slate-800">{selectedTimelineModal.performedBy}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">Location / Terminal</p>
                  <p className="font-bold text-slate-700">{selectedTimelineModal.location || 'Mobile App'}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">IP Address</p>
                  <p className="font-mono font-bold text-slate-600">{selectedTimelineModal.ip || '192.168.1.104'}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">Verification Status</p>
                  <p className="font-black text-emerald-600">✓ {selectedTimelineModal.status || 'Verified'}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-900 text-slate-300 rounded-xl font-mono text-[10px] space-y-1">
                <p className="text-slate-400 uppercase text-[9px] font-bold">Cryptographic Audit Hash</p>
                <p className="text-purple-300 break-all">{selectedTimelineModal.hash || 'SHA256: 8f9a2b71c4d5e901a2b3c4d5e6f7'}</p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-2">
              <button onClick={() => setSelectedTimelineModal(null)} className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MANUAL AUDIT LOG MODAL */}
      {showAddActivityModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[9999] flex items-center justify-center p-4" onClick={() => setShowAddActivityModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-purple-400" />
                <h2 className="text-sm font-extrabold tracking-wide">Log Manual Audit Entry</h2>
              </div>
              <button onClick={() => setShowAddActivityModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-400 text-lg cursor-pointer">✕</button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const newEntry = {
                id: `#${1010 + timelineEventsList.length}`,
                title: formData.get('title'),
                category: formData.get('category'),
                status: 'Verified',
                time: 'Just Now',
                date: new Date().toISOString().split('T')[0],
                description: formData.get('description'),
                performedBy: 'Fleet Admin User',
                location: 'Company Admin Dashboard',
                ip: '192.168.1.1',
                hash: `SHA256: ${Math.random().toString(36).substring(2, 12)}`
              };
              setTimelineEventsList([newEntry, ...timelineEventsList]);
              setShowAddActivityModal(false);
              showToast("Manual audit entry added to Activity Timeline!");
            }} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Activity Title *</label>
                <input required name="title" placeholder="e.g. Toolbox Meeting Attended, Phone Check-in..." className="w-full px-3.5 py-2 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-purple-600" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Category *</label>
                  <select name="category" className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-purple-600">
                    <option value="Assignments">Assignments</option>
                    <option value="Safety">Safety</option>
                    <option value="Documents">Documents</option>
                    <option value="Payroll">Payroll</option>
                    <option value="Compliance">Compliance</option>
                    <option value="Leave">Leave</option>
                    <option value="Status Changes">Status Changes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Audit Status</label>
                  <input readOnly value="Verified Audit" className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl font-bold text-emerald-600" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Audit Description & Notes *</label>
                <textarea required name="description" rows={3} placeholder="Enter full details of the manual audit entry or note..." className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-purple-600" />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddActivityModal(false)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md shadow-purple-600/30 cursor-pointer">Save Audit Log</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

  if (showAddDriver || isEditingDriver) {
    const isEditMode = isEditingDriver;
    const formTitle = isEditMode ? "Edit Driver Profile" : "Add New Driver";
    const formDesc = isEditMode ? "Update driver profile by modifying the fields below." : "Create a new driver profile by entering all required information.";

    // Default values if editing Daniel White
    const defaultData = isEditMode && selectedDriver ? {
      firstName: selectedDriver.name.split(' ')[0],
      lastName: selectedDriver.name.split(' ')[1] || '',
      empId: selectedDriver.id,
      dob: "1998-11-22",
      gender: "Male",
      nationality: "Australian",
      phone: selectedDriver.phone,
      email: "daniel.white@herologistics.com.au",
      licenceType: selectedDriver.licence,
      licenceNo: selectedDriver.licenceNo,
      branch: selectedDriver.branch
    } : {};

    return (
      <div className="flex-grow bg-[#F8FAFC] w-full text-left font-sans custom-scrollbar overflow-y-auto">
        <div className="p-4 sm:p-6 max-w-[1400px] mx-auto pb-20">
          <div className="flex items-center justify-between mb-4 text-[11px] font-semibold">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Link to="/company-admin/command-centre" className="hover:text-purple-600 transition-colors">Home</Link> <ChevronRight size={12} />
              <Link to="/company-admin/drivers" onClick={() => { setShowAddDriver(false); setIsEditingDriver(false); }} className="hover:text-purple-600 transition-colors">Drivers</Link> <ChevronRight size={12} />
              <button onClick={() => { setShowAddDriver(false); setIsEditingDriver(false); }} className="hover:text-purple-600 transition-colors">Drivers List</button> <ChevronRight size={12} />
              <span className="text-slate-800 font-bold">{isEditMode ? "Edit Driver" : "Add Driver"}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => alert('Guide & Compliance docs coming soon!')} className="flex items-center gap-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 px-2 py-1 rounded transition-colors cursor-pointer">
                <FileText size={14} /> <span>Guide & Compliance</span>
              </button>
            </div>
          </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.target);
          const newDriver = {
            id: fd.get('EmployeeIDManualEditOption') || ('DRV00' + Math.floor(Math.random() * 100)),
            name: `${fd.get('FirstName') || ''} ${fd.get('LastName') || ''}`.trim() || 'New Driver',
            age: fd.get('DateofBirth') ? Math.floor((new Date() - new Date(fd.get('DateofBirth'))) / 31557600000) : 30,
            dob: fd.get('DateofBirth') || '1990-01-01',
            dr: 'NSW /990',
            phone: fd.get('PhoneNumber') || '',
            email: fd.get('EmailAddress') || '',
            address: fd.get('ResidentialAddress') || '',
            licence: fd.get('LicenceType') || 'HR (Heavy Rigid)',
            licenceNo: fd.get('LicenceNumber') || '',
            issueDate: fd.get('IssueDate') || '',
            employmentType: fd.get('EmploymentType') || 'Full Time',
            status: fd.get('DriverStatus') || 'Available',
            branch: fd.get('Branch') || 'Sydney',
            assignmentId: '—',
            assignmentType: 'Not assigned',
            complianceStatus: 'Compliant',
            complianceScore: '100%',
            avatar: isEditMode && selectedDriver ? selectedDriver.avatar : 'https://i.pravatar.cc/150?u=' + Math.floor(Math.random() * 1000)
          };
          if (isEditMode && selectedDriver) {
             setDriverList(prev => prev.map(d => d.id === selectedDriver.id ? {...d, ...newDriver, id: d.id} : d));
          } else {
             setDriverList(prev => [newDriver, ...prev]);
          }
          setShowAddDriver(false);
          setIsEditingDriver(false);
          showToast(isEditMode ? "Driver Profile Updated successfully!" : "New Driver Added successfully!");
        }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{formTitle}</h1>
              <p className="text-[11px] text-slate-500 font-medium mt-1">{formDesc}</p>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => { setShowAddDriver(false); setIsEditingDriver(false); }} className="px-5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm">Cancel</button>
              <button type="button" className="px-5 py-2 bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm">Save as Draft</button>
              <button type="submit" className="flex items-center gap-1.5 px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer"><Settings size={14} /> Save Driver</button>
            </div>
          </div>

          <div className="space-y-6">

            {/* 1. Personal Information */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
              <h2 className="text-sm font-black text-slate-900 mb-6">1. Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                <div className="col-span-1 flex flex-col items-center gap-3">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest self-start">Profile Photo</label>
                  <img src={isEditMode ? selectedDriver?.avatar : "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"} alt="Avatar Preview" className="w-24 h-24 rounded-full object-cover border-4 border-slate-100" />
                  <input type="text" defaultValue="https://pravatar.cc/150?u..." className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[10px] text-slate-500 text-center focus:outline-none" />
                </div>
                <div className="col-span-1 md:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                  <InputField label="First Name" defaultValue={defaultData.firstName} />
                  <InputField label="Last Name" defaultValue={defaultData.lastName} />
                  <InputField label="Employee ID * (Manual Edit Option)" defaultValue={defaultData.empId || "DRV009"} />
                  <InputField label="Date of Birth" type="date" defaultValue={defaultData.dob} />
                  <InputField label="Gender" type="select" options={['Male', 'Female', 'Other', 'Prefer not to say']} defaultValue={defaultData.gender || 'Male'} />
                  <InputField label="Nationality" defaultValue={defaultData.nationality} />
                  <InputField label="Phone Number" defaultValue={defaultData.phone} />
                  <InputField label="Email Address" defaultValue={defaultData.email} />
                  <InputField label="Emergency Contact Name" />
                  <InputField label="Emergency Contact Number" />
                  <InputField label="Residential Address" className="sm:col-span-2" />
                  <InputField label="City" />
                  <InputField label="State" />
                  <InputField label="Postal Code" />
                </div>
              </div>
            </div>

            {/* 2. Employment Information */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
              <h2 className="text-sm font-black text-slate-900 mb-6">2. Employment Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
                <InputField label="Driver Role" type="select" options={['Driver', 'Senior Driver', 'Team Lead']} defaultValue="Driver" />
                <InputField label="Employment Type" type="select" options={['Full Time', 'Part Time', 'Casual']} defaultValue="Full Time" />
                <InputField label="Branch" type="select" options={['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide']} defaultValue={defaultData.branch || "Brisbane"} />
                <InputField label="Reports To" type="select" options={['Sarah Mitchell', 'John Doe', 'Emily Chen']} defaultValue="Sarah Mitchell" />
                <InputField label="Joining Date" type="date" defaultValue="2026-07-18" />
                <InputField label="Driver Status" type="select" options={['Available', 'On Duty', 'Off Duty', 'On Leave', 'Unavailable']} defaultValue="Available" />
                <InputField label="Shift" type="select" options={['Morning', 'Afternoon', 'Night', 'Rotating']} defaultValue="Morning" />
                <InputField label="Driver Category" type="select" options={['Heavy Rig', 'Medium Rig', 'Light Rig', 'Multi Combination']} defaultValue="Heavy Rig" />
              </div>
            </div>

            {/* 3. Licence Information */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
              <h2 className="text-sm font-black text-slate-900 mb-6">3. Licence Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 mb-6">
                <InputField label="Licence Type" type="select" options={['HR (Heavy Rigid)', 'MR (Medium Rigid)', 'LR (Light Rigid)', 'HC (Heavy Combination)', 'MC (Multi Combination)']} defaultValue={defaultData.licenceType || "MR (Medium Rigid)"} />
                <InputField label="Licence Number" defaultValue={defaultData.licenceNo || "VIC 11223344"} />
                <InputField label="Licence State" type="select" options={['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT']} defaultValue="NSW" />
                <InputField label="Issue Date" type="date" />
                <InputField label="Expiry Date" type="date" />
                <InputField label="Licence Class" type="select" options={['Class HR', 'Class MR', 'Class LR', 'Class HC', 'Class MC']} defaultValue="Class HR" />
              </div>

              <div className="w-full">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Licence Document Upload *</label>
                <LicenceFileUploadBox />
              </div>
            </div>

            {/* 4. Compliance Documents */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
              <h2 className="text-sm font-black text-slate-900 mb-6">4. Compliance Documents</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <DocumentUploadBox title="Medical Certificate" />
                <DocumentUploadBox title="Police Verification" />
                <DocumentUploadBox title="Background Check" />
                <DocumentUploadBox title="Drug & Alcohol Certificate" />
                <DocumentUploadBox title="First Aid Certificate" />
                <DocumentUploadBox title="Training Certificate" />
                <DocumentUploadBox title="Other Documents" />
              </div>
            </div>

            {/* 5. Payroll Information */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
              <h2 className="text-sm font-black text-slate-900 mb-6">5. Payroll Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
                <InputField label="Pay Type" type="select" defaultValue="Daily" />
                <InputField label="Pay Rate ($)" defaultValue="350.00" />
                <InputField label="Bank Name" defaultValue="Commonwealth Bank" />
                <InputField label="Account Number" />
                <InputField label="BSB/Routing" />
                <InputField label="Tax Number" />
                <InputField label="Superannuation Fund" className="sm:col-span-2" defaultValue="AustralianSuper" />
              </div>
            </div>

            {/* 6. Vehicle Preferences */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
              <h2 className="text-sm font-black text-slate-900 mb-6">6. Vehicle Preferences</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                <InputField label="Preferred Vehicle" defaultValue="Volvo FH16" />
                <InputField label="Preferred Routes" defaultValue="Sydney - Melbourne" />
                <InputField label="Preferred Regions" defaultValue="East Coast" />
                <InputField label="Maximum Distance Per Trip (KM)" defaultValue="1000" />
                <InputField label="Dangerous Goods Certified" type="select" defaultValue="No" />
                <InputField label="Heavy Vehicle Certified" type="select" defaultValue="Yes" />
              </div>
            </div>

            {/* 7. Availability */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
              <h2 className="text-sm font-black text-slate-900 mb-6">7. Availability</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 mb-6">
                <InputField label="Available From" type="date" />
                <InputField label="Preferred Shift" type="select" defaultValue="Morning" />
                <InputField label="Weekly Hours Limit" defaultValue="50" />
                <InputField label="Max Working Hours/Day" defaultValue="10" />
                <InputField label="Rest Days / Week" defaultValue="2" />
              </div>

              <div className="w-full">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-3">Working Days</label>
                <div className="flex flex-wrap items-center gap-4">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <label key={day} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" defaultChecked={day !== 'Sat' && day !== 'Sun'} className="w-3.5 h-3.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500" />
                      <span className="text-[11px] font-bold text-slate-700">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* 8. Account Information */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
              <h2 className="text-sm font-black text-slate-900 mb-6">8. Account Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-5 mb-4">
                <InputField label="Username" placeholder="e.g. mthompson" />
                <InputField label="Password" type="password" />
                <InputField label="Confirm Password" type="password" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500" />
                <span className="text-[10px] font-semibold text-slate-600">Send login credentials to driver's email address</span>
              </label>
            </div>

            {/* 9. Notes & Comments */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
              <h2 className="text-sm font-black text-slate-900 mb-6">9. Notes & Comments</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Driver Notes</label>
                  <textarea className="w-full h-24 bg-white border border-slate-200 rounded-lg p-3 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"></textarea>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Internal Comments</label>
                  <textarea className="w-full h-24 bg-white border border-slate-200 rounded-lg p-3 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"></textarea>
                </div>
              </div>
            </div>

          </div>
        </form>
        {renderAllModals()}
        </div>
      </div>
    );
  }

  if (selectedDriver) {
    const currentDriverIndex = driverList.findIndex(d => d.id === selectedDriver.id);
    return (
      <div className="flex-grow bg-[#F8FAFC] w-full text-left font-sans custom-scrollbar overflow-y-auto">
        <div className="p-4 sm:p-6 max-w-[1400px] mx-auto pb-20">

          {/* Header & Breadcrumb */}
          <div className="flex items-center justify-between mb-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Link to="/company-admin/command-centre" className="hover:text-purple-600 transition-colors">Home</Link> <ChevronRight size={12} />
              <Link to="/company-admin/drivers" onClick={() => setSelectedDriver(null)} className="hover:text-purple-600 transition-colors">Drivers</Link> <ChevronRight size={12} />
              <button onClick={() => setSelectedDriver(null)} className="hover:text-purple-600 transition-colors">Drivers List</button> <ChevronRight size={12} />
              <span className="text-slate-800 font-bold">Driver Details</span>
            </div>
            <HeaderIcons />
          </div>

          {/* Title & Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-[28px] leading-none font-black text-slate-900 tracking-tight">4.2 Driver Details</h1>
              <p className="text-xs text-slate-500 font-medium mt-1.5">View and manage driver information, documents, assignments and performance.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <button onClick={() => setIsEditingDriver(true)} className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-slate-900 text-slate-900 hover:bg-slate-50 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm">
                <Edit2 size={14} /> <span>Edit Driver</span>
              </button>
              <button onClick={() => alert(`Opening message interface for ${selectedDriver.name}`)} className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm">
                <MessageSquare size={14} /> <span>Message Driver</span>
              </button>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:flex-none">
                  <button onClick={() => setIsDetailsMoreOpen(!isDetailsMoreOpen)} className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-slate-900 text-slate-900 hover:bg-slate-50 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm">
                    <span>More Actions</span> <ChevronDown size={14} />
                  </button>
                  {isDetailsMoreOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50">
                      <button onClick={() => { alert('View Activity Log clicked'); setIsDetailsMoreOpen(false); }} className="w-full text-left text-xs font-semibold text-slate-700 p-2 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors">View Activity Log</button>
                      <button onClick={() => { alert('Print Profile clicked'); setIsDetailsMoreOpen(false); }} className="w-full text-left text-xs font-semibold text-slate-700 p-2 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors">Print Profile</button>
                      <div className="border-t border-slate-100 my-1"></div>
                      <button onClick={() => { alert('Deactivate Driver clicked'); setIsDetailsMoreOpen(false); }} className="w-full text-left text-xs font-semibold text-rose-600 p-2 hover:bg-rose-50 rounded-lg transition-colors">Deactivate Driver</button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-sm shrink-0">
                  <button
                    onClick={() => currentDriverIndex > 0 && setSelectedDriver(mockDrivers[currentDriverIndex - 1])}
                    disabled={currentDriverIndex <= 0}
                    className={`p-1.5 rounded transition-colors ${currentDriverIndex > 0 ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-50 cursor-pointer' : 'text-slate-200 cursor-not-allowed'}`}
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={() => currentDriverIndex < mockDrivers.length - 1 && setSelectedDriver(mockDrivers[currentDriverIndex + 1])}
                    disabled={currentDriverIndex >= mockDrivers.length - 1}
                    className={`p-1.5 rounded transition-colors ${currentDriverIndex < mockDrivers.length - 1 ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-50 cursor-pointer' : 'text-slate-200 cursor-not-allowed'}`}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Top Info Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5 mb-6">

            {/* Merged Card: Profile & Compliance */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 flex flex-col md:flex-row gap-6 items-start">

              {/* Left Side: Profile Details */}
              <div className="flex-1 min-w-0 pr-0 md:pr-6 border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0">
                <div className="flex items-start gap-4 mb-5">
                  <div className="relative shrink-0">
                    <img src={selectedDriver.avatar} alt={selectedDriver.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-slate-200 object-cover shadow-2xs" />
                    <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900">{selectedDriver.name}</h2>
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${getStatusStyle(selectedDriver.status)}`}>{selectedDriver.status}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 sm:gap-6 text-xs max-w-sm">
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 mb-0.5">Employee</p>
                        <p className="font-extrabold text-slate-900">{selectedDriver.id}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 mb-0.5">Age</p>
                        <p className="font-extrabold text-slate-900">{selectedDriver.age}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 mb-0.5">Date of Birth</p>
                        <p className="font-extrabold text-slate-900">{selectedDriver.dob || (selectedDriver.id === 'DRV001' ? '1990-06-15' : '1998-11-22')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-[10px] font-semibold text-slate-400 mb-0.5">DR</p>
                  <p className="text-xs font-extrabold text-slate-900">{selectedDriver.dr || 'NSW /990'}</p>
                </div>

                <div className="grid grid-cols-2 gap-y-3.5 gap-x-6 text-xs">
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 mb-0.5">Licence Type</p>
                    <p className="font-extrabold text-slate-900 leading-snug">{selectedDriver.licence}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 mb-0.5">Address</p>
                    <p className="font-extrabold text-slate-900 leading-snug">{selectedDriver.address || (selectedDriver.id === 'DRV001' ? '12 Greenfield Rd, Campbelltown NSW 2560' : '88 Boundary St, West End QLD 4101')}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 mb-0.5">Licence No.</p>
                    <p className="font-extrabold text-slate-900">{selectedDriver.licenceNo}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 mb-0.5">Issue Date</p>
                    <p className="font-extrabold text-slate-900">{selectedDriver.issueDate || '12/03/2023'}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 mb-0.5">Phone</p>
                    <p className="font-extrabold text-slate-900">{selectedDriver.phone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 mb-0.5">Email</p>
                    <p className="font-extrabold text-slate-900 truncate max-w-[170px]" title={selectedDriver.email || `${selectedDriver.name.toLowerCase().replace(/\s+/g, '.')}@herologistics.com.au`}>
                      {selectedDriver.email || `${selectedDriver.name.toLowerCase().replace(/\s+/g, '.')}@herologistics.com.au`}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 mb-0.5">Branch</p>
                    <p className="font-extrabold text-slate-900">{selectedDriver.branch}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 mb-0.5">Employment Type</p>
                    <p className="font-extrabold text-slate-900">{selectedDriver.employmentType || 'Full Time'}</p>
                  </div>
                </div>
              </div>

              {/* Right Side: Driver Status & Overall Compliance */}
              <div className="w-full md:w-[220px] shrink-0 flex flex-col justify-start pt-1">
                {/* Driver Status Dropdown */}
                <div className="mb-6 relative">
                  <label className="text-[11px] font-bold text-slate-500 block mb-1.5">Driver Status</label>
                  <div
                    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    className="flex items-center justify-between border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 bg-white cursor-pointer hover:border-purple-300 transition-colors shadow-2xs w-full"
                  >
                    <span>{selectedDriver.status}</span>
                    <ChevronDown size={14} className="text-emerald-500" />
                  </div>
                  {isStatusDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50">
                      {['On Duty', 'Off Duty', 'On Leave', 'Unavailable'].map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            const updated = { ...selectedDriver, status };
                            setSelectedDriver(updated);
                            setDriverList(prev => prev.map(d => d.id === updated.id ? updated : d));
                            setIsStatusDropdownOpen(false);
                            showToast(`Driver status updated to ${status}`);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-between ${selectedDriver.status === status ? 'text-purple-700 bg-purple-50' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                          <span>{status}</span>
                          {selectedDriver.status === status && <CheckCircle2 size={12} className="text-purple-600" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Overall Compliance Block */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-2.5">Overall Compliance</label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100 shrink-0">
                      <ShieldCheck size={22} />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-xl font-black text-slate-900 leading-none">100%</h3>
                      <p className="text-xs font-bold text-emerald-600 mt-1">Compliant</p>
                    </div>
                  </div>
                  <p className="text-[10px] font-semibold text-slate-400 mt-3">Last Updated: Today, 8:30 AM</p>
                </div>
              </div>

            </div>

            {/* Card 3: Driver Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-[13px] font-black text-slate-900 mb-6">Driver Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 text-slate-500">
                      <Truck size={14} /> <span className="text-xs font-semibold">Total Loads Completed</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">124</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 text-slate-500">
                      <Clock size={14} /> <span className="text-xs font-semibold">On Time Delivery</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">97%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 text-slate-500">
                      <MapPin size={14} /> <span className="text-xs font-semibold">Total Distance (YTD)</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">78,420 km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 text-slate-500">
                      <AlertTriangle size={14} /> <span className="text-xs font-semibold">Incidents</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 text-slate-500">
                      <Activity size={14} /> <span className="text-xs font-semibold">Accidents</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">0</span>
                  </div>
                </div>
              </div>
              <button className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1 transition-colors mt-6 self-start">
                View Performance &rarr;
              </button>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex items-center gap-8 border-b border-slate-200 mb-6">
            {['Overview', 'Documents & Compliance', 'Assignments & Availability', 'Performance', 'Payroll', 'Activity Timeline'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${activeTab === tab ? 'text-purple-700 border-purple-700' : 'text-slate-500 border-transparent hover:text-slate-800'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content - Overview (3 Columns Grid) */}
          {activeTab === 'Overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* Column 1 */}
              <div className="space-y-6">

                {/* Personal Information */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <div className="flex justify-between items-center mb-4">
                    <SectionHeading title="Personal Information" />
                    <button className="flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[9px] font-bold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"><Plus size={10} /> Edit</button>
                  </div>
                  <div className="space-y-1">
                    <DataRow label="Emergency Contact" value="Jane Thompson (Wife)" />
                    <DataRow label="Emergency Phone" value="0411 987 654" />
                    <DataRow label="Nationality" value="Australian" />
                    <DataRow label="Language" value="English" />
                    <DataRow label="Driver Reference No." value="NSW11234567" />
                    <div className="py-2 flex flex-col gap-1">
                      <span className="text-[11px] font-medium text-slate-500">Note:</span>
                      <span className="text-[11px] font-bold text-slate-800">Excellent driver. Very reliable and takes great care of the vehicles.</span>
                    </div>
                  </div>
                </div>

                {/* Skills & Endorsements */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <div className="flex justify-between items-center mb-4">
                    <SectionHeading title="Skills & Endorsements" />
                    <button className="flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[9px] font-bold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"><Plus size={10} /> Add / Edit</button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        <span className="text-[11px] font-bold text-slate-700">Load Restraint</span>
                      </div>
                      <span className="text-[11px] font-black text-slate-800">Yes</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        <span className="text-[11px] font-bold text-slate-700">Forklift Licence</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black text-slate-800">LF123456</span>
                        <span className="text-[9px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-black">Valid</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <XCircle size={14} className="text-slate-300" />
                        <span className="text-[11px] font-bold text-slate-500">Dangerous Goods (DG)</span>
                      </div>
                      <span className="text-[11px] font-black text-slate-800">No</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        <span className="text-[11px] font-bold text-slate-700">First Aid</span>
                      </div>
                      <span className="text-[11px] font-black text-slate-800">Yes</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        <span className="text-[11px] font-bold text-slate-700">Advanced Fatigue Management</span>
                      </div>
                      <span className="text-[11px] font-black text-slate-800">Yes</span>
                    </div>
                  </div>
                </div>

                {/* Current Assignment */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <div className="flex justify-between items-center mb-4">
                    <SectionHeading title="Current Assignment" />
                    <button className="text-[10px] font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors">View Assignments &rarr;</button>
                  </div>

                  <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100 mb-3">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2 text-indigo-700">
                        <Truck size={14} /> <span className="text-xs font-black">TRK-101 | Volvo FH 540</span>
                      </div>
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[9px] font-black uppercase tracking-widest">Assigned</span>
                    </div>

                    <div className="bg-white rounded-lg p-3 border border-indigo-50 mb-3">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Load</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-slate-100 rounded flex items-center justify-center"><Target size={10} className="text-slate-500" /></div>
                          <span className="text-[11px] font-bold text-slate-800">PO-12546 | ABC Motors - Car Transport</span>
                        </div>
                        <button className="text-[9px] font-bold text-purple-600 hover:text-purple-700 transition-colors">View Load &rarr;</button>
                      </div>
                    </div>

                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">From</p>
                        <p className="text-xs font-bold text-slate-800 mb-0.5">Sydney NSW</p>
                        <p className="text-[9px] font-medium text-slate-500">15/07/2025 08:00 AM</p>
                      </div>
                      <div className="flex-grow px-4 flex flex-col items-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">To</p>
                        <div className="w-full h-px bg-indigo-200 relative my-1.5">
                          <ArrowRight size={10} className="absolute -top-1 right-0 text-indigo-300" />
                        </div>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Status</p>
                        <p className="text-xs font-bold text-slate-800 mb-0.5">Brisbane QLD</p>
                        <p className="text-[9px] font-medium text-slate-500">16/07/2025 09:00 AM</p>
                      </div>
                      <div className="ml-2">
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[9px] font-black border border-emerald-200">In Progress</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Column 2 */}
              <div className="space-y-6">

                {/* Employment Information */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <div className="flex justify-between items-center mb-4">
                    <SectionHeading title="Employment Information" />
                    <button className="flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[9px] font-bold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"><Plus size={10} /> Edit</button>
                  </div>
                  <div className="space-y-1">
                    <DataRow label="Role" value="Driver" />
                    <DataRow label="Reports To" value="Sarah Mitchell" />
                    <DataRow label="Pay Rate" value="$350.00 / daily" />
                    <DataRow label="Pay Type" value="Daily" />
                    <DataRow label="Super Fund" value="AustralianSuper" />
                    <DataRow label="TFN" value="123 456 789" />
                    <DataRow label="Bank Account" value="BSB 082-900 A/C **** 4567" />
                    <DataRow label="Days Worked (YTD)" value="86 days" />
                  </div>
                </div>

                {/* Medical Information */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <div className="flex justify-between items-center mb-4">
                    <SectionHeading title="Medical Information" />
                    <button className="flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[9px] font-bold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"><Plus size={10} /> Edit</button>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-[11px] font-medium text-slate-500">Medical Expiry Date</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-800">10/08/2025</span>
                        <span className="text-[9px] text-orange-600 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded font-black">In 28 days</span>
                      </div>
                    </div>
                    <DataRow label="Last Medical Result" value="Fit to Drive" />
                    <DataRow label="Restrictions" value="Corrective lenses when driving" />
                  </div>
                </div>

                {/* Availability */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <div className="flex justify-between items-center mb-4">
                    <SectionHeading title="- Availability" />
                    <button className="flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[9px] font-bold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"><Plus size={10} /> Edit</button>
                  </div>
                  <div className="space-y-1">
                    <DataRow label="Next Available From" value="21/07/2025 08:00 AM" />
                    <DataRow label="Available For (Days)" value="3 days" />
                    <DataRow label="Preferred Regions" value="NSW, QLD, VIC" />
                    <DataRow label="Unavailability" value="—" />
                  </div>
                </div>

              </div>

              {/* Column 3 */}
              <div className="space-y-6">

                {/* Upcoming Expiry & Alerts */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <div className="flex justify-between items-center mb-4">
                    <SectionHeading title="Upcoming Expiry & Alerts" />
                    <button className="text-[10px] font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors">View All &rarr;</button>
                  </div>
                  <div className="space-y-3">

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100"><AlertTriangle size={12} /></div>
                        <span className="text-[11px] font-bold text-slate-800">Licence Expiry (HR)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-500">20/09/2026</span>
                        <span className="text-[9px] text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded font-black w-14 text-center">In 63 days</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100"><Target size={12} /></div>
                        <span className="text-[11px] font-bold text-slate-800">Medical Expiry</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-500">10/08/2025</span>
                        <span className="text-[9px] text-orange-600 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded font-black w-14 text-center">In 28 days</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100"><FileText size={12} /></div>
                        <span className="text-[11px] font-bold text-slate-800">Driver Card Expiry</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-500">12/10/2025</span>
                        <span className="text-[9px] text-orange-600 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded font-black w-14 text-center">In 91 days</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100"><CheckCircle2 size={12} /></div>
                        <span className="text-[11px] font-bold text-slate-800">First Aid Expiry</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-500">05/12/2025</span>
                        <span className="text-[9px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-black w-14 text-center">In 135 days</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100"><CheckCircle2 size={12} /></div>
                        <span className="text-[11px] font-bold text-slate-800">Fatigue Certificate</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-500">15/02/2026</span>
                        <span className="text-[9px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-black w-14 text-center">In 207 days</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* AI Insights Widget */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Settings size={16} className="text-purple-600" />
                    <SectionHeading title="AI Insights" />
                    <span className="bg-purple-100 text-purple-700 text-[9px] px-1.5 py-0.5 rounded mb-4 tracking-widest uppercase font-black">BETA</span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                        <Target size={14} />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-bold text-slate-800">Performance Insight</h4>
                        <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Mike has 97% on-time delivery. Keep up the excellent work!</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <Truck size={14} />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-bold text-slate-800">Suggested Next Loads</h4>
                        <p className="text-[10px] text-slate-500 leading-tight mt-0.5 mb-1.5">AI suggests 2 loads suitable for Mike based on location and availability.</p>
                        <button className="text-[9px] font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors cursor-pointer">View Suggestions &rarr;</button>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                        <ShieldCheck size={14} />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-bold text-slate-800">Risk Check</h4>
                        <p className="text-[10px] text-slate-500 leading-tight mt-0.5">No risks detected. Driver is compliant and ready for assignments.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes Widget */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <div className="flex justify-between items-center mb-4">
                    <SectionHeading title="Notes" />
                    <button className="text-[10px] font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors"><Plus size={10} /> Add Note</button>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-[8px] font-black border border-slate-300">
                          SM
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-800">Sarah Mitchell</span>
                          <span className="ml-2 px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded text-[7px] font-black uppercase tracking-widest">Internal</span>
                        </div>
                      </div>
                      <span className="text-[9px] text-slate-400 font-medium">10/07/2026 09:15 AM</span>
                    </div>
                    <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
                      Excellent driver. Very reliable and takes great care of the vehicles.
                    </p>
                  </div>

                  <button className="text-[10px] font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors">View All Notes &rarr;</button>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'Documents & Compliance' && (() => {
            const filteredDocList = documentList.filter(doc => {
              if (activeDocTab === 'All Documents') return true;
              return doc.category === activeDocTab;
            });

            const totalDocsCount = documentList.length;
            const validCount = documentList.filter(d => d.status === 'Valid').length;
            const expiringCount = documentList.filter(d => d.status === 'Expiring Soon').length;
            const expiredCount = documentList.filter(d => d.status === 'Expired').length;
            const validPct = totalDocsCount > 0 ? Math.round((validCount / totalDocsCount) * 100) : 0;
            const expiringPct = totalDocsCount > 0 ? Math.round((expiringCount / totalDocsCount) * 100) : 0;
            const expiredPct = totalDocsCount > 0 ? Math.round((expiredCount / totalDocsCount) * 100) : 0;

            return (
              <div className="space-y-6">
                {/* Inner Tab Navigation & Add Document Button */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-1">
                  <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto max-w-full custom-scrollbar">
                    {['All Documents', 'Licences', 'Medical', 'Certifications', 'Training', 'Insurances', 'Other'].map(tab => {
                      const count = tab === 'All Documents' ? documentList.length : documentList.filter(d => d.category === tab).length;
                      return (
                        <button
                          key={tab}
                          onClick={() => setActiveDocTab(tab)}
                          className={`pb-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${activeDocTab === tab ? 'text-purple-700 border-purple-700' : 'text-slate-500 border-transparent hover:text-slate-800'}`}
                        >
                          <span>{tab}</span>
                          <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${activeDocTab === tab ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-500'}`}>{count}</span>
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setAddDocModal(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer mb-2 sm:mb-0"
                  >
                    <Plus size={14} /> <span>Add Document</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* Left Panel - Documents Table */}
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="overflow-x-auto flex-1">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="px-4 py-3.5 text-[10px] font-black text-slate-800 uppercase tracking-wider">Document Type</th>
                            <th className="px-4 py-3.5 text-[10px] font-black text-slate-800 uppercase tracking-wider">Document Number</th>
                            <th className="px-4 py-3.5 text-[10px] font-black text-slate-800 uppercase tracking-wider">Issue Date</th>
                            <th className="px-4 py-3.5 text-[10px] font-black text-slate-800 uppercase tracking-wider">Expiry Date</th>
                            <th className="px-4 py-3.5 text-[10px] font-black text-slate-800 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3.5 text-[10px] font-black text-slate-800 uppercase tracking-wider">Days Left</th>
                            <th className="px-4 py-3.5 text-[10px] font-black text-slate-800 uppercase tracking-wider text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredDocList.length > 0 ? filteredDocList.map((doc, idx) => (
                            <tr key={doc.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                              <td className="px-4 py-3.5">
                                <div className="flex items-center gap-2.5">
                                  <FileIcon size={14} className={doc.status === 'Expired' ? 'text-rose-500' : (doc.status === 'Expiring Soon' ? 'text-amber-500' : 'text-blue-500')} />
                                  <div>
                                    <span className="text-[11px] font-bold text-slate-800 block">{doc.type}</span>
                                    <span className="text-[9px] font-medium text-slate-400">{doc.category || 'General'}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3.5 text-[11px] font-semibold text-slate-600 font-mono">{doc.number}</td>
                              <td className="px-4 py-3.5 text-[11px] font-semibold text-slate-600">{doc.issue}</td>
                              <td className="px-4 py-3.5 text-[11px] font-semibold text-slate-600">{doc.expiry}</td>
                              <td className="px-4 py-3.5">
                                {doc.status === 'Valid' && <span className="inline-flex px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-bold tracking-widest uppercase">Valid</span>}
                                {doc.status === 'Expiring Soon' && <span className="inline-flex px-1.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded text-[9px] font-bold tracking-widest uppercase">Expiring Soon</span>}
                                {doc.status === 'Expired' && <span className="inline-flex px-1.5 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 rounded text-[9px] font-bold tracking-widest uppercase">Expired</span>}
                              </td>
                              <td className="px-4 py-3.5">
                                <span className={`text-[11px] font-bold ${doc.status === 'Expired' ? 'text-rose-500' : (doc.status === 'Expiring Soon' ? 'text-amber-500' : 'text-emerald-500')}`}>
                                  {doc.daysLeft}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (docMenuIndex === doc.id) {
                                        setDocMenuIndex(null);
                                      } else {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        setDocMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
                                        setDocMenuIndex(doc.id);
                                      }
                                    }}
                                    title="More Actions"
                                    className={`w-8 h-8 rounded-xl transition-all cursor-pointer shadow-2xs border flex items-center justify-center ${docMenuIndex === doc.id ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-slate-100/80 hover:bg-slate-200 text-slate-600 border-slate-200/50'}`}
                                  >
                                    <MoreHorizontal size={15} />
                                  </button>

                                  {docMenuIndex === doc.id && docMenuPos && (
                                    <>
                                      <div className="fixed inset-0 z-[9980]" onClick={(e) => { e.stopPropagation(); setDocMenuIndex(null); }} />
                                      <div
                                        style={{ top: `${docMenuPos.top}px`, right: `${docMenuPos.right}px` }}
                                        className="fixed w-48 bg-white rounded-2xl shadow-2xl border border-slate-200 p-1.5 z-[9990] flex flex-col gap-0.5 text-xs font-semibold text-slate-700 text-left animate-in fade-in zoom-in-95 duration-100 ring-1 ring-slate-900/10"
                                      >
                                        <button
                                          onClick={(e) => { e.stopPropagation(); setViewDocModal(doc); setDocMenuIndex(null); }}
                                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition-all text-left w-full cursor-pointer font-bold"
                                        >
                                          <Eye size={14} className="text-purple-600" />
                                          <span>View Details</span>
                                        </button>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); setEditDocModal({ ...doc }); setDocMenuIndex(null); }}
                                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition-all text-left w-full cursor-pointer font-bold"
                                        >
                                          <Edit size={14} className="text-amber-600" />
                                          <span>Edit Record</span>
                                        </button>
                                        <div className="h-px bg-slate-100 my-0.5" />
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setDeleteDocModal(doc);
                                            setDocMenuIndex(null);
                                          }}
                                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 transition-all text-left w-full cursor-pointer font-bold"
                                        >
                                          <Trash2 size={14} className="text-rose-600" />
                                          <span>Delete Record</span>
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan="7" className="px-4 py-10 text-center text-xs font-semibold text-slate-400">
                                No documents found in category "{activeDocTab}".
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span>Showing {filteredDocList.length} of {totalDocsCount} documents</span>
                      <div className="flex items-center gap-1">
                        <button className="w-6 h-6 flex items-center justify-center rounded text-slate-400 cursor-not-allowed"><ChevronLeft size={14} /></button>
                        <button className="w-6 h-6 flex items-center justify-center rounded bg-purple-700 text-white font-bold cursor-pointer">1</button>
                        <button className="w-6 h-6 flex items-center justify-center rounded text-slate-400 cursor-not-allowed"><ChevronRight size={14} /></button>
                      </div>
                    </div>
                  </div>

                  {/* Right Panel - Compliance & Insights */}
                  <div className="space-y-6">

                    {/* Compliance Summary Donut Chart */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                      <h2 className="text-sm font-black text-slate-900 mb-6">Compliance Summary</h2>
                      <div className="flex items-center justify-between px-2">
                        <div className="relative w-28 h-28">
                          <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                            {/* Expired Slice (Red) */}
                            <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f43f5e" strokeWidth="4" strokeDasharray={`${expiredPct} ${100 - expiredPct}`} strokeDashoffset="0"></circle>
                            {/* Expiring Soon Slice (Yellow) */}
                            <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="4" strokeDasharray={`${expiringPct} ${100 - expiringPct}`} strokeDashoffset={`-${expiredPct}`}></circle>
                            {/* Valid Slice (Green) */}
                            <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4" strokeDasharray={`${validPct} ${100 - validPct}`} strokeDashoffset={`-${expiredPct + expiringPct}`}></circle>
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-slate-900 leading-none">{totalDocsCount}</span>
                            <span className="text-[10px] font-semibold text-slate-500">Total</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                            <span className="text-[11px] font-bold text-slate-900">{validCount} <span className="font-semibold text-slate-500">Valid</span></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                            <span className="text-[11px] font-bold text-slate-900">{expiringCount} <span className="font-semibold text-slate-500">Expiring Soon</span></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                            <span className="text-[11px] font-bold text-slate-900">{expiredCount} <span className="font-semibold text-slate-500">Expired</span></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                            <span className="text-[11px] font-bold text-slate-900">0 <span className="font-semibold text-slate-500">Not Uploaded</span></span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Upcoming Expiry & Alerts */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                      <div className="flex justify-between items-center mb-5">
                        <h2 className="text-sm font-black text-slate-900">Upcoming Expiry & Alerts</h2>
                        <button className="text-[10px] font-bold text-purple-600 hover:text-purple-700 transition-colors flex items-center">View All &rarr;</button>
                      </div>
                      <div className="space-y-4">
                        {/* Alert 1 */}
                        <div className="flex justify-between items-center">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 text-amber-500"><FileIcon size={14} /></div>
                            <div>
                              <h4 className="text-[11px] font-bold text-slate-800">Medical Certificate</h4>
                              <p className="text-[10px] font-medium text-slate-500">Expires on 10/08/2025</p>
                            </div>
                          </div>
                          <span className="inline-flex px-1.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded text-[9px] font-bold">In 28 days</span>
                        </div>
                        <div className="border-t border-slate-100"></div>
                        {/* Alert 2 */}
                        <div className="flex justify-between items-center">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 text-amber-500"><FileIcon size={14} /></div>
                            <div>
                              <h4 className="text-[11px] font-bold text-slate-800">MR Licence</h4>
                              <p className="text-[10px] font-medium text-slate-500">Expires on 10/04/2026</p>
                            </div>
                          </div>
                          <span className="inline-flex px-1.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded text-[9px] font-bold">In 235 days</span>
                        </div>
                        <div className="border-t border-slate-100"></div>
                        {/* Alert 3 */}
                        <div className="flex justify-between items-center">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 text-emerald-500"><FileIcon size={14} /></div>
                            <div>
                              <h4 className="text-[11px] font-bold text-slate-800">HR Licence</h4>
                              <p className="text-[10px] font-medium text-slate-500">Expires on 12/03/2028</p>
                            </div>
                          </div>
                          <span className="inline-flex px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-bold">In 884 days</span>
                        </div>
                        <div className="border-t border-slate-100"></div>
                        {/* Alert 4 */}
                        <div className="flex justify-between items-center">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 text-rose-500"><Shield size={14} /></div>
                            <div>
                              <h4 className="text-[11px] font-bold text-slate-800">Road Ranger Accreditation</h4>
                              <p className="text-[10px] font-medium text-slate-500">Expired on 01/09/2025</p>
                            </div>
                          </div>
                          <span className="inline-flex px-1.5 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 rounded text-[9px] font-bold">Expired</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Insights */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                        <Settings size={16} className="text-purple-600" />
                        <h3 className="text-sm font-black text-slate-800">AI Insights <span className="bg-purple-100 text-purple-700 text-[9px] px-1.5 py-0.5 rounded ml-1 tracking-widest uppercase">BETA</span></h3>
                      </div>
                      <div className="p-4 space-y-5">
                        <div className="flex gap-3">
                          <div className="mt-0.5 text-purple-600"><AlertTriangle size={14} /></div>
                          <div>
                            <h4 className="text-[11px] font-bold text-slate-800">Road Ranger Accreditation has expired.</h4>
                            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Recommend renewal.</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="mt-0.5 text-purple-600"><FileIcon size={14} /></div>
                          <div>
                            <h4 className="text-[11px] font-bold text-slate-800">Medical Certificate will expire in 28 days.</h4>
                            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Recommend booking.</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="mt-0.5 text-purple-600"><CheckCircle size={14} /></div>
                          <div>
                            <h4 className="text-[11px] font-bold text-slate-800">All critical licences are valid.</h4>
                            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Great job!</p>
                          </div>
                        </div>
                        <button className="w-full flex items-center justify-center gap-2 py-2 mt-2 bg-purple-50 text-purple-700 rounded-lg text-[11px] font-bold hover:bg-purple-100 transition-colors cursor-pointer">
                          <Zap size={14} /> View AI Insights
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })()}

          {activeTab === 'Performance' && (
            <div className="space-y-6">

              {/* Header */}
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">Performance Analytics</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const csvContent = "data:text/csv;charset=utf-8,"
                        + "Date,Assignment,Route,Evaluation Score,Status,Remarks\n"
                        + evalLogList.map(e => `"${e.date}","${e.assignment}","${e.route}","${e.score}","${e.status}","${e.remarks}"`).join("\n");
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", `driver_performance_report_${selectedDriver?.id || 'DRV-101'}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      showToast(`Performance analytics exported as CSV successfully!`);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-colors shadow-xs cursor-pointer"
                  >
                    <TrendingUp size={12} className="text-purple-600" /> Export Performance
                  </button>
                  <button
                    onClick={() => {
                      showToast(`Downloading performance PDF report...`);
                      setTimeout(() => {
                        showToast(`Performance report PDF downloaded!`);
                      }, 1000);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-colors shadow-xs cursor-pointer"
                  >
                    <Download size={12} className="text-blue-600" /> Download Report
                  </button>
                  <button
                    onClick={() => {
                      setShowPrintReportModal(true);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-900 bg-slate-900 text-white rounded-lg text-[10px] font-bold hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
                  >
                    <FileIcon size={12} className="text-purple-400" /> Print Report
                  </button>
                </div>
              </div>

              {/* Top 6 Scorecards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* Scorecard 1 */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">Overall<br />Performance</h4>
                    <div className="w-6 h-6 rounded bg-purple-50 flex items-center justify-center text-purple-600"><Award size={12} /></div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mb-1">96<span className="text-sm text-slate-400">/100</span></div>
                  <div className="text-[9px] font-bold text-emerald-500">+2.4% vs last month</div>
                </div>
                {/* Scorecard 2 */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">On-Time<br />Delivery</h4>
                    <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center text-blue-600"><Clock size={12} /></div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mb-1">97.2%</div>
                  <div className="text-[9px] font-bold text-emerald-500">+0.8% vs last month</div>
                </div>
                {/* Scorecard 3 */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">Loads<br />Completed</h4>
                    <div className="w-6 h-6 rounded bg-emerald-50 flex items-center justify-center text-emerald-600"><CheckCircle size={12} /></div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mb-1">124</div>
                  <div className="text-[9px] font-bold text-slate-400">On track (target 130)</div>
                </div>
                {/* Scorecard 4 */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">Safety<br />Score</h4>
                    <div className="w-6 h-6 rounded bg-indigo-50 flex items-center justify-center text-indigo-600"><Shield size={12} /></div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mb-1">98<span className="text-sm text-slate-400">/100</span></div>
                  <div className="text-[9px] font-bold text-emerald-500">Zero critical events</div>
                </div>
                {/* Scorecard 5 */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">Customer<br />Rating</h4>
                    <div className="w-6 h-6 rounded bg-amber-50 flex items-center justify-center text-amber-600"><Star size={12} /></div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mb-1">4.92<span className="text-sm text-slate-400">/5.0</span></div>
                  <div className="text-[9px] font-bold text-slate-400">48 ratings received</div>
                </div>
                {/* Scorecard 6 */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">Compliance<br />Score</h4>
                    <div className="w-6 h-6 rounded bg-teal-50 flex items-center justify-center text-teal-600"><FileCheck size={12} /></div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mb-1">100%</div>
                  <div className="text-[9px] font-bold text-emerald-500">Fully Compliant</div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">

                {/* Left: Line Chart */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 relative overflow-hidden">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-[11px] font-black text-slate-900">Monthly Performance Trend</h4>
                    <span className="text-[10px] font-bold px-2 py-1 bg-purple-50 text-purple-700 rounded border border-purple-100 uppercase">YTD - 2026</span>
                  </div>
                  <div className="relative h-48 w-full mt-4">
                    {/* Mock Line Chart with Gradient */}
                    <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#9333ea" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#9333ea" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Grid Lines */}
                      <line x1="0" y1="0" x2="600" y2="0" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="50" x2="600" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="100" x2="600" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="150" x2="600" y2="150" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="200" x2="600" y2="200" stroke="#f1f5f9" strokeWidth="1" />

                      {/* Area Fill */}
                      <path d="M 50 140 L 150 130 L 250 145 L 350 120 L 450 135 L 550 90 L 550 200 L 50 200 Z" fill="url(#chartGradient)" />

                      {/* Line */}
                      <path d="M 50 140 L 150 130 L 250 145 L 350 120 L 450 135 L 550 90" fill="none" stroke="#9333ea" strokeWidth="3" />

                      {/* Points */}
                      <circle cx="50" cy="140" r="4" fill="white" stroke="#9333ea" strokeWidth="2" />
                      <circle cx="150" cy="130" r="4" fill="white" stroke="#9333ea" strokeWidth="2" />
                      <circle cx="250" cy="145" r="4" fill="white" stroke="#9333ea" strokeWidth="2" />
                      <circle cx="350" cy="120" r="4" fill="white" stroke="#9333ea" strokeWidth="2" />
                      <circle cx="450" cy="135" r="4" fill="white" stroke="#9333ea" strokeWidth="2" />
                      <circle cx="550" cy="90" r="4" fill="white" stroke="#9333ea" strokeWidth="2" />

                      {/* X-axis labels */}
                      <text x="50" y="220" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="bold">Jan (88%)</text>
                      <text x="150" y="220" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="bold">Feb (92%)</text>
                      <text x="250" y="220" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="bold">Mar (90%)</text>
                      <text x="350" y="220" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="bold">Apr (95%)</text>
                      <text x="450" y="220" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="bold">May (94%)</text>
                      <text x="550" y="220" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="bold">Jun (97%)</text>
                    </svg>
                  </div>
                </div>

                {/* Right: Breakdown Bars */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <h4 className="text-[11px] font-black text-slate-900 mb-6">Performance Breakdown</h4>
                  <div className="space-y-4">

                    {/* Bar 1 */}
                    <div>
                      <div className="flex justify-between items-end mb-1.5">
                        <span className="text-[10px] font-bold text-slate-600">Delivery Performance (On-time & routing)</span>
                        <span className="text-[10px] font-black text-slate-900">97.2%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '97.2%' }}></div>
                      </div>
                    </div>
                    {/* Bar 2 */}
                    <div>
                      <div className="flex justify-between items-end mb-1.5">
                        <span className="text-[10px] font-bold text-slate-600">Safety Performance (Speeding & hard braking)</span>
                        <span className="text-[10px] font-black text-slate-900">98%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '98%' }}></div>
                      </div>
                    </div>
                    {/* Bar 3 */}
                    <div>
                      <div className="flex justify-between items-end mb-1.5">
                        <span className="text-[10px] font-bold text-slate-600">Attendance & Schedule Adherence</span>
                        <span className="text-[10px] font-black text-slate-900">95%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                    {/* Bar 4 */}
                    <div>
                      <div className="flex justify-between items-end mb-1.5">
                        <span className="text-[10px] font-bold text-slate-600">Regulatory & Document Compliance</span>
                        <span className="text-[10px] font-black text-slate-900">100%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    {/* Bar 5 */}
                    <div>
                      <div className="flex justify-between items-end mb-1.5">
                        <span className="text-[10px] font-bold text-slate-600">Vehicle Handling & Idle Time</span>
                        <span className="text-[10px] font-black text-slate-900">92.5%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '92.5%' }}></div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Small Metrics Row */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity size={14} className="text-slate-400" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Total Trips</span>
                  </div>
                  <div className="text-lg font-black text-slate-900">156</div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={14} className="text-slate-400" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Total Distance</span>
                  </div>
                  <div className="text-lg font-black text-slate-900">78,420 <span className="text-[10px] font-bold text-slate-500">km</span></div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={14} className="text-slate-400" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Fuel Efficiency</span>
                  </div>
                  <div className="text-lg font-black text-slate-900">2.4 <span className="text-[10px] font-bold text-slate-500">km/L</span></div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={14} className="text-slate-400" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Avg Delivery Time</span>
                  </div>
                  <div className="text-lg font-black text-slate-900">4.2 <span className="text-[10px] font-bold text-slate-500">hrs</span></div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={14} className="text-emerald-500" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Incidents Reported</span>
                  </div>
                  <div className="text-lg font-black text-emerald-500">0</div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckSquare size={14} className="text-purple-500" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Successful Deliveries</span>
                  </div>
                  <div className="text-lg font-black text-purple-600">154</div>
                </div>
              </div>

              {/* Stats & Achievements Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Driver Activity Statistics */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <h4 className="text-[11px] font-black text-slate-900 mb-6">Driver Activity Statistics</h4>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                    <div>
                      <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Completed Loads</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-slate-900">124</span>
                        <span className="text-[10px] font-bold text-slate-400">99.2%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Cancelled Loads</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-slate-900">1</span>
                        <span className="text-[10px] font-bold text-slate-400">0.8%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Delayed Loads</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-slate-900">3</span>
                        <span className="text-[10px] font-bold text-slate-400">2.4%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Average Hours Worked</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-slate-900">38h/week</span>
                        <span className="text-[10px] font-bold text-slate-400">95%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Working Days</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-slate-900">22 <span className="text-[12px]">days</span></span>
                        <span className="text-[10px] font-bold text-slate-400">73.3%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Rest Days</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-slate-900">8 <span className="text-[12px]">days</span></span>
                        <span className="text-[10px] font-bold text-slate-400">26.7%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Driver Accomplishments */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <h4 className="text-[11px] font-black text-slate-900 mb-6">Driver Accomplishments & Achievements</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                      <div className="w-8 h-8 rounded-full border-2 border-emerald-400 flex items-center justify-center text-emerald-600 shrink-0 bg-white">
                        <Shield size={14} />
                      </div>
                      <div>
                        <h5 className="text-[10px] font-bold text-emerald-800">Safe Driver Badge</h5>
                        <p className="text-[9px] text-emerald-600/80 leading-tight mt-0.5">Zero safety alerts or speeding events in the last 90 days.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="w-8 h-8 rounded-full border-2 border-blue-400 flex items-center justify-center text-blue-600 shrink-0 bg-white">
                        <Clock size={14} />
                      </div>
                      <div>
                        <h5 className="text-[10px] font-bold text-blue-800">On-Time Champion</h5>
                        <p className="text-[9px] text-blue-600/80 leading-tight mt-0.5">Maintained an on-time delivery rate above 95% for 3 consecutive months.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
                      <div className="w-8 h-8 rounded-full border-2 border-purple-400 flex items-center justify-center text-purple-600 shrink-0 bg-white">
                        <Award size={14} />
                      </div>
                      <div>
                        <h5 className="text-[10px] font-bold text-purple-800">High Performer</h5>
                        <p className="text-[9px] text-purple-600/80 leading-tight mt-0.5">Completed more than 100 successful loads in a single calendar year.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <div className="w-8 h-8 rounded-full border-2 border-amber-400 flex items-center justify-center text-amber-600 shrink-0 bg-white">
                        <Calendar size={14} />
                      </div>
                      <div>
                        <h5 className="text-[10px] font-bold text-amber-800">Excellent Attendance</h5>
                        <p className="text-[9px] text-amber-600/80 leading-tight mt-0.5">Zero unscheduled leaves or absences in the last 6 months.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Evaluation Log Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                  <h4 className="text-[11px] font-black text-slate-900">Performance Evaluation Log</h4>
                  <span className="text-[10px] font-bold text-slate-400">Showing {evalLogList.length} evaluation logs</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        <th className="px-5 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Date</th>
                        <th className="px-5 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Assignment</th>
                        <th className="px-5 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Route</th>
                        <th className="px-5 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Evaluation</th>
                        <th className="px-5 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                        <th className="px-5 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Remarks</th>
                        <th className="px-5 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {evalLogList.map((item, idx) => (
                        <tr key={item.id || idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-4 text-[11px] font-bold text-slate-700">{item.date}</td>
                          <td className="px-5 py-4 text-[11px] font-bold text-purple-600 cursor-pointer hover:underline" onClick={() => setViewEvalModal(item)}>{item.assignment}</td>
                          <td className="px-5 py-4 text-[11px] font-semibold text-slate-600">{item.route}</td>
                          <td className="px-5 py-4 text-[11px] font-black text-slate-900">{item.score}</td>
                          <td className="px-5 py-4">
                            <span className="inline-flex px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-bold tracking-widest uppercase">{item.status}</span>
                          </td>
                          <td className="px-5 py-4 text-[10px] font-medium text-slate-500 max-w-xs truncate">{item.remarks}</td>
                          <td className="px-5 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (evalMenuIndex === item.id) {
                                    setEvalMenuIndex(null);
                                  } else {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setEvalMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
                                    setEvalMenuIndex(item.id);
                                  }
                                }}
                                title="More Actions"
                                className={`w-8 h-8 rounded-xl transition-all cursor-pointer shadow-2xs border flex items-center justify-center ${evalMenuIndex === item.id ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-slate-100/80 hover:bg-slate-200 text-slate-600 border-slate-200/50'}`}
                              >
                                <MoreHorizontal size={15} />
                              </button>

                              {evalMenuIndex === item.id && evalMenuPos && (
                                <>
                                  <div className="fixed inset-0 z-[9980]" onClick={(e) => { e.stopPropagation(); setEvalMenuIndex(null); }} />
                                  <div
                                    style={{ top: `${evalMenuPos.top}px`, right: `${evalMenuPos.right}px` }}
                                    className="fixed w-48 bg-white rounded-2xl shadow-2xl border border-slate-200 p-1.5 z-[9990] flex flex-col gap-0.5 text-xs font-semibold text-slate-700 text-left animate-in fade-in zoom-in-95 duration-100 ring-1 ring-slate-900/10"
                                  >
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setViewEvalModal(item); setEvalMenuIndex(null); }}
                                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition-all text-left w-full cursor-pointer font-bold"
                                    >
                                      <Eye size={14} className="text-purple-600" />
                                      <span>View Details</span>
                                    </button>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setEditEvalModal({ ...item }); setEvalMenuIndex(null); }}
                                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition-all text-left w-full cursor-pointer font-bold"
                                    >
                                      <Edit size={14} className="text-amber-600" />
                                      <span>Edit Record</span>
                                    </button>
                                    <div className="h-px bg-slate-100 my-0.5" />
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEvalLogList(prev => prev.filter(eItem => eItem.id !== item.id));
                                        setEvalMenuIndex(null);
                                        showToast(`Deleted evaluation entry ${item.assignment} successfully!`);
                                      }}
                                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 transition-all text-left w-full cursor-pointer font-bold"
                                    >
                                      <Trash2 size={14} className="text-rose-600" />
                                      <span>Delete Record</span>
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Assignments & Availability' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

              {/* Left Panel - Assignments */}
              <div className="lg:col-span-2 space-y-6">

                {/* Current Assignments */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-sm font-black text-slate-800">Current Assignments (2)</h3>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Active tasks on the road</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider">Load ID</th>
                          <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider">Load Type</th>
                          <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider">Route / Stops</th>
                          <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider">Vehicle</th>
                          <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider">Start Date & Time</th>
                          <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider">Est. End Date & Time</th>
                          <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentAssignmentsList.map((item, idx) => (
                          <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50">
                            <td className="px-4 py-3 text-[11px] font-bold text-purple-600 cursor-pointer hover:underline">{item.id}</td>
                            <td className="px-4 py-3 text-[11px] font-semibold text-slate-600">{item.type}</td>
                            <td className="px-4 py-3">
                              <div className="text-[11px] font-bold text-slate-800">{item.route}</div>
                              <div className="text-[9px] text-slate-400 font-medium">{item.stops}</div>
                            </td>
                            <td className="px-4 py-3 text-[11px] font-semibold text-slate-600">{item.vehicle}</td>
                            <td className="px-4 py-3 text-[11px] font-semibold text-slate-600">{item.start}</td>
                            <td className="px-4 py-3 text-[11px] font-semibold text-slate-600">{item.end}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase ${item.status === 'In Progress' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-blue-50 text-blue-600 border border-blue-200'}`}>{item.status}</span>
                            </td>
                            <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (currAssignMenuIndex === idx) {
                                      setCurrAssignMenuIndex(null);
                                    } else {
                                      const rect = e.currentTarget.getBoundingClientRect();
                                      setCurrAssignMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
                                      setCurrAssignMenuIndex(idx);
                                    }
                                  }}
                                  title="More Actions"
                                  className={`w-8 h-8 rounded-xl transition-all cursor-pointer shadow-2xs border flex items-center justify-center ${currAssignMenuIndex === idx ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-slate-100/80 hover:bg-slate-200 text-slate-600 border-slate-200/50'}`}
                                >
                                  <MoreHorizontal size={15} />
                                </button>

                                {currAssignMenuIndex === idx && currAssignMenuPos && (
                                  <>
                                    <div className="fixed inset-0 z-[9980]" onClick={(e) => { e.stopPropagation(); setCurrAssignMenuIndex(null); }} />
                                    <div
                                      style={{ top: `${currAssignMenuPos.top}px`, right: `${currAssignMenuPos.right}px` }}
                                      className="fixed w-48 bg-white rounded-2xl shadow-2xl border border-slate-200 p-1.5 z-[9990] flex flex-col gap-0.5 text-xs font-semibold text-slate-700 text-left animate-in fade-in zoom-in-95 duration-100 ring-1 ring-slate-900/10"
                                    >
                                      <button
                                        onClick={(e) => { e.stopPropagation(); setViewCurrAssignModal(item); setCurrAssignMenuIndex(null); }}
                                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition-all text-left w-full cursor-pointer font-bold"
                                      >
                                        <Eye size={14} className="text-purple-600" />
                                        <span>View Details</span>
                                      </button>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); setEditCurrAssignModal({ ...item, index: idx }); setCurrAssignMenuIndex(null); }}
                                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition-all text-left w-full cursor-pointer font-bold"
                                      >
                                        <Edit size={14} className="text-amber-600" />
                                        <span>Edit Record</span>
                                      </button>
                                      <div className="h-px bg-slate-100 my-0.5" />
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setCurrentAssignmentsList(prev => prev.filter((_, i) => i !== idx));
                                          setCurrAssignMenuIndex(null);
                                          showToast(`Deleted assignment ${item.id} successfully`);
                                        }}
                                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 transition-all text-left w-full cursor-pointer font-bold"
                                      >
                                        <Trash2 size={14} className="text-rose-600" />
                                        <span>Delete Record</span>
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-3 border-t border-slate-100 text-[10px] text-slate-500 font-medium">
                    Showing 1 to 2 of 2 assignments
                  </div>
                </div>

                {/* Upcoming Assignments */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-sm font-black text-slate-800">Upcoming Assignments (2)</h3>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Planned trips & dispatch queue</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider">Load ID</th>
                          <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider">Load Type</th>
                          <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider">Route / Stops</th>
                          <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider">Vehicle</th>
                          <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider">Start Date & Time</th>
                          <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider">Est. End Date & Time</th>
                          <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {upcomingAssignmentsList.map((item, idx) => (
                          <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50">
                            <td className="px-4 py-3 text-[11px] font-bold text-purple-600 cursor-pointer hover:underline">{item.id}</td>
                            <td className="px-4 py-3 text-[11px] font-semibold text-slate-600">{item.type}</td>
                            <td className="px-4 py-3">
                              <div className="text-[11px] font-bold text-slate-800">{item.route}</div>
                              <div className="text-[9px] text-slate-400 font-medium">{item.stops}</div>
                            </td>
                            <td className="px-4 py-3 text-[11px] font-semibold text-slate-600">{item.vehicle}</td>
                            <td className="px-4 py-3 text-[11px] font-semibold text-slate-600">{item.start}</td>
                            <td className="px-4 py-3 text-[11px] font-semibold text-slate-600">{item.end}</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex px-1.5 py-0.5 bg-purple-50 text-purple-600 border border-purple-200 rounded text-[9px] font-bold tracking-widest uppercase">{item.status}</span>
                            </td>
                            <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (upAssignMenuIndex === idx) {
                                      setUpAssignMenuIndex(null);
                                    } else {
                                      const rect = e.currentTarget.getBoundingClientRect();
                                      setUpAssignMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
                                      setUpAssignMenuIndex(idx);
                                    }
                                  }}
                                  title="More Actions"
                                  className={`w-8 h-8 rounded-xl transition-all cursor-pointer shadow-2xs border flex items-center justify-center ${upAssignMenuIndex === idx ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-slate-100/80 hover:bg-slate-200 text-slate-600 border-slate-200/50'}`}
                                >
                                  <MoreHorizontal size={15} />
                                </button>

                                {upAssignMenuIndex === idx && upAssignMenuPos && (
                                  <>
                                    <div className="fixed inset-0 z-[9980]" onClick={(e) => { e.stopPropagation(); setUpAssignMenuIndex(null); }} />
                                    <div
                                      style={{ top: `${upAssignMenuPos.top}px`, right: `${upAssignMenuPos.right}px` }}
                                      className="fixed w-48 bg-white rounded-2xl shadow-2xl border border-slate-200 p-1.5 z-[9990] flex flex-col gap-0.5 text-xs font-semibold text-slate-700 text-left animate-in fade-in zoom-in-95 duration-100 ring-1 ring-slate-900/10"
                                    >
                                      <button
                                        onClick={(e) => { e.stopPropagation(); setViewUpAssignModal(item); setUpAssignMenuIndex(null); }}
                                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition-all text-left w-full cursor-pointer font-bold"
                                      >
                                        <Eye size={14} className="text-purple-600" />
                                        <span>View Details</span>
                                      </button>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); setEditUpAssignModal({ ...item, index: idx }); setUpAssignMenuIndex(null); }}
                                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition-all text-left w-full cursor-pointer font-bold"
                                      >
                                        <Edit size={14} className="text-amber-600" />
                                        <span>Edit Record</span>
                                      </button>
                                      <div className="h-px bg-slate-100 my-0.5" />
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setUpcomingAssignmentsList(prev => prev.filter((_, i) => i !== idx));
                                          setUpAssignMenuIndex(null);
                                          showToast(`Deleted assignment ${item.id} successfully`);
                                        }}
                                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 transition-all text-left w-full cursor-pointer font-bold"
                                      >
                                        <Trash2 size={14} className="text-rose-600" />
                                        <span>Delete Record</span>
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-3 border-t border-slate-100 text-[10px] text-slate-500 font-medium">
                    Showing 1 to 2 of 2 upcoming assignments
                  </div>
                </div>

                {/* Availability Snapshot */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <h3 className="text-sm font-black text-slate-800 mb-5">Availability Snapshot</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1 border border-slate-100 rounded-xl p-3 bg-slate-50/50">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><CheckCircle2 size={10} /></div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Available Now</span>
                      </div>
                      <span className="text-sm font-black text-slate-900">No</span>
                      <span className="text-[10px] text-slate-500 font-semibold">Unavailable</span>
                    </div>
                    <div className="flex flex-col gap-1 border border-slate-100 rounded-xl p-3 bg-slate-50/50">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Calendar size={10} /></div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Next Available From</span>
                      </div>
                      <span className="text-sm font-black text-slate-900">—</span>
                      <span className="text-[10px] text-slate-500 font-semibold">On Leave/Duty</span>
                    </div>
                    <div className="flex flex-col gap-1 border border-slate-100 rounded-xl p-3 bg-slate-50/50">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><Clock size={10} /></div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Available For (Days)</span>
                      </div>
                      <span className="text-sm font-black text-slate-900">0 days</span>
                      <span className="text-[10px] text-slate-500 font-semibold">—</span>
                    </div>
                    <div className="flex flex-col gap-1 border border-slate-100 rounded-xl p-3 bg-slate-50/50">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"><MapPin size={10} /></div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Preferred Regions</span>
                      </div>
                      <span className="text-xs font-black text-slate-900">NSW, QLD, VIC</span>
                      <span className="text-[10px] text-slate-500 font-semibold">Primary Preference</span>
                    </div>
                    <div className="flex flex-col gap-1 border border-slate-100 rounded-xl p-3 bg-slate-50/50">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><Truck size={10} /></div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Max Distance</span>
                      </div>
                      <span className="text-sm font-black text-slate-900">1,200 km</span>
                      <span className="text-[10px] text-slate-500 font-semibold">Per trip preference</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel - Calendar & AI */}
              <div className="space-y-6">

                {/* Calendar */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-[11px] font-black text-slate-800">Availability This Month</h3>
                    <button className="text-[10px] font-bold text-purple-600 flex items-center hover:text-purple-700">View Calendar &rarr;</button>
                  </div>
                  <div className="p-4">
                    <div className="text-center text-[10px] font-black text-slate-500 tracking-widest uppercase mb-3">July 2025</div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {/* Day Headers */}
                      {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                        <div key={day} className="text-[8px] font-black text-slate-400 mb-1">{day}</div>
                      ))}

                      {/* Dates (Mocking July 2025 layout) */}
                      <div className="py-2 text-[10px] font-bold text-slate-300">30</div>

                      {/* 1st to 13th: Available (Green) */}
                      {[1, 2, 3, 4].map(d => <div key={d} className="py-2 text-[10px] font-bold bg-emerald-50 text-emerald-700 rounded cursor-pointer">{d}</div>)}
                      {/* 5th, 6th Weekend */}
                      <div className="py-2 text-[10px] font-bold bg-rose-50 text-rose-700 rounded cursor-pointer">5</div>
                      <div className="py-2 text-[10px] font-bold bg-emerald-50 text-emerald-700 rounded cursor-pointer">6</div>

                      {[7, 8, 9, 10, 11, 12, 13].map(d => <div key={d} className="py-2 text-[10px] font-bold bg-emerald-50 text-emerald-700 rounded cursor-pointer">{d}</div>)}

                      {/* 14th to 27th: Assigned (Purple) */}
                      {[14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27].map(d => <div key={d} className="py-2 text-[10px] font-bold bg-purple-50 text-purple-700 rounded cursor-pointer">{d}</div>)}

                      {/* 28th to 31st: Leave/Unavailable (Grey/Amber) */}
                      {[28, 29, 30, 31].map(d => <div key={d} className="py-2 text-[10px] font-bold bg-slate-100 text-slate-600 rounded cursor-pointer">{d}</div>)}

                      <div className="py-2 text-[10px] font-bold text-slate-300">1</div>
                      <div className="py-2 text-[10px] font-bold text-slate-300">2</div>
                      <div className="py-2 text-[10px] font-bold text-slate-300">3</div>
                    </div>

                    {/* Legend */}
                    <div className="mt-5 grid grid-cols-2 gap-y-2 px-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full border-2 border-emerald-400 bg-emerald-50"></div>
                        <span className="text-[9px] font-bold text-slate-600">Available</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full border-2 border-purple-400 bg-purple-50"></div>
                        <span className="text-[9px] font-bold text-slate-600">Assigned</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full border-2 border-rose-400 bg-rose-50"></div>
                        <span className="text-[9px] font-bold text-slate-600">Unavailable</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-300 bg-slate-100"></div>
                        <span className="text-[9px] font-bold text-slate-600">Leave</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Unavailability & Leave */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[11px] font-black text-slate-800">Unavailability & Leave</h3>
                    <button className="text-[10px] font-bold text-purple-600 flex items-center hover:text-purple-700">View All &rarr;</button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-700">Annual Leave</h4>
                        <p className="text-[9px] font-medium text-slate-500">28/07/2025 - 01/08/2025</p>
                      </div>
                      <span className="px-2 py-0.5 border border-amber-200 text-amber-600 rounded text-[9px] font-bold bg-amber-50">5 days</span>
                    </div>
                    <div className="border-t border-slate-100"></div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-700">Medical Appointment</h4>
                        <p className="text-[9px] font-medium text-slate-500">05/08/2025</p>
                      </div>
                      <span className="px-2 py-0.5 border border-amber-200 text-amber-600 rounded text-[9px] font-bold bg-amber-50">1 day</span>
                    </div>
                    <div className="border-t border-slate-100"></div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-700">Personal Leave</h4>
                        <p className="text-[9px] font-medium text-slate-500">12/08/2025 - 13/08/2025</p>
                      </div>
                      <span className="px-2 py-0.5 border border-amber-200 text-amber-600 rounded text-[9px] font-bold bg-amber-50">2 days</span>
                    </div>
                  </div>
                </div>

                {/* AI Assignment Assistant */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                    <Zap size={14} className="text-purple-600" />
                    <h3 className="text-sm font-black text-slate-800">AI Assignment Assistant <span className="bg-purple-100 text-purple-700 text-[9px] px-1.5 py-0.5 rounded ml-1 tracking-widest uppercase">BETA</span></h3>
                  </div>
                  <div className="p-4">
                    <p className="text-[11px] font-medium text-slate-600 mb-4 leading-relaxed">AI suggests best matching loads based on driver availability, location and preferences.</p>
                    <button className="w-full py-2 border border-purple-200 text-purple-700 rounded-lg text-[11px] font-bold hover:bg-purple-50 transition-colors flex items-center justify-center gap-1.5">
                      <Zap size={12} /> View AI Suggestions
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'Payroll' && (
            <div className="space-y-6 mt-6">

              {/* Inner Tab Navigation */}
              <div className="flex space-x-6 border-b border-slate-200 overflow-x-auto">
                {['Pay Overview', 'Pay History', 'Pay Rates & Rules', 'Allowances', 'Deductions', 'Leave', 'Superannuation'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActivePayTab(tab)}
                    className={`py-3 text-[11px] font-black uppercase tracking-widest relative shrink-0 cursor-pointer ${activePayTab === tab
                        ? 'text-purple-700'
                        : 'text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    {tab}
                    {activePayTab === tab && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* 1. PAY OVERVIEW SUB-TAB */}
              {activePayTab === 'Pay Overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Top 6 Stat Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 overflow-hidden">
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-tight mb-2">Total<br />Earnings<br />(This Month)</div>
                        <div className="text-base xl:text-lg font-black text-slate-900 mb-1 truncate" title="$3,265.00">$3,265.00</div>
                        <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 truncate">
                          <TrendingUp size={10} className="shrink-0" /> 12% <span className="text-slate-400 font-medium truncate">vs last month</span>
                        </div>
                      </div>
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 overflow-hidden">
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-tight mb-2">Net Pay<br />(This Month)</div>
                        <div className="text-base xl:text-lg font-black text-slate-900 mb-1 truncate" title="$2,940.50">$2,940.50</div>
                        <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 truncate">
                          <TrendingUp size={10} className="shrink-0" /> 10% <span className="text-slate-400 font-medium truncate">vs last month</span>
                        </div>
                      </div>
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 overflow-hidden">
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-tight mb-2">Loads<br />Completed</div>
                        <div className="text-base xl:text-lg font-black text-slate-900 mb-1 truncate" title="18">18</div>
                        <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 truncate">
                          <TrendingUp size={10} className="shrink-0" /> 0 <span className="text-slate-400 font-medium truncate">vs last month</span>
                        </div>
                      </div>
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 overflow-hidden">
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-tight mb-2">Total<br />Kilometres</div>
                        <div className="text-base xl:text-lg font-black text-slate-900 mb-1 truncate" title="7,842 km">7,842 km</div>
                        <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 truncate">
                          <TrendingUp size={10} className="shrink-0" /> 654 km <span className="text-slate-400 font-medium truncate">vs last month</span>
                        </div>
                      </div>
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 overflow-hidden">
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-tight mb-2">Avg. Daily<br />Earnings</div>
                        <div className="text-base xl:text-lg font-black text-slate-900 mb-1 truncate" title="$163.25">$163.25</div>
                        <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 truncate">
                          <TrendingUp size={10} className="shrink-0" /> $12.40 <span className="text-slate-400 font-medium truncate">vs last month</span>
                        </div>
                      </div>
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between overflow-hidden">
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-tight mb-2">Pay Rate</div>
                        <div>
                          <div className="text-base xl:text-lg font-black text-slate-900 truncate" title="$550.00 / day">$550.00 / day</div>
                          <div className="text-[9px] text-slate-400 font-medium mt-1 truncate">Daily Base Rate</div>
                        </div>
                      </div>
                    </div>

                    {/* Earnings Summary Table */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-sm font-black text-slate-800">Earnings Summary (This Month)</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                              <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider">Date</th>
                              <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider">Load ID</th>
                              <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider">Route / Description</th>
                              <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider">Type</th>
                              <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider">Rate</th>
                              <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider">Amount</th>
                              <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-slate-50 hover:bg-slate-50/50">
                              <td className="px-4 py-3 text-[11px] font-medium text-slate-700">18/07/2025</td>
                              <td className="px-4 py-3 text-[11px] font-bold text-purple-600 cursor-pointer hover:underline">LD-12557</td>
                              <td className="px-4 py-3 text-[11px] font-semibold text-slate-800">Melbourne VIC → Sydney NSW</td>
                              <td className="px-4 py-3"><span className="inline-flex px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded text-[9px] font-bold tracking-widest uppercase">Daily Rate</span></td>
                              <td className="px-4 py-3 text-[11px] font-medium text-slate-600">$550.00 / day</td>
                              <td className="px-4 py-3 text-[11px] font-black text-slate-900">$550.00</td>
                              <td className="px-4 py-3 text-center"><span className="inline-flex px-1.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded text-[9px] font-bold tracking-widest uppercase">Pending</span></td>
                            </tr>
                            <tr className="border-b border-slate-50 hover:bg-slate-50/50">
                              <td className="px-4 py-3 text-[11px] font-medium text-slate-700">16/07/2025</td>
                              <td className="px-4 py-3 text-[11px] font-bold text-emerald-600 cursor-pointer hover:underline">EXP-2045</td>
                              <td className="px-4 py-3 text-[11px] font-semibold text-slate-800">Fuel Reimbursement</td>
                              <td className="px-4 py-3"><span className="inline-flex px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-bold tracking-widest uppercase">Allowance</span></td>
                              <td className="px-4 py-3 text-[11px] font-medium text-slate-600">$120.00</td>
                              <td className="px-4 py-3 text-[11px] font-black text-emerald-600">$120.00</td>
                              <td className="px-4 py-3 text-center"><span className="inline-flex px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-bold tracking-widest uppercase">Approved</span></td>
                            </tr>
                            <tr className="hover:bg-slate-50/50">
                              <td className="px-4 py-3 text-[11px] font-medium text-slate-700">14/07/2025</td>
                              <td className="px-4 py-3 text-[11px] font-bold text-rose-600 cursor-pointer hover:underline">ADV-3342</td>
                              <td className="px-4 py-3 text-[11px] font-semibold text-slate-800">Advance Deduction</td>
                              <td className="px-4 py-3"><span className="inline-flex px-1.5 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 rounded text-[9px] font-bold tracking-widest uppercase">Deduction</span></td>
                              <td className="px-4 py-3 text-[11px] font-medium text-slate-600">-$300.00</td>
                              <td className="px-4 py-3 text-[11px] font-black text-rose-600">-$300.00</td>
                              <td className="px-4 py-3 text-center"><span className="inline-flex px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-bold tracking-widest uppercase">Approved</span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Right Panel */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                      <h3 className="text-[11px] font-black text-slate-800 mb-4">Earnings Breakdown</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-600">Base Daily Rate</span>
                          <span className="font-extrabold text-slate-900">$3,300.00</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-600">Allowances Total</span>
                          <span className="font-extrabold text-emerald-600">+$285.00</span>
                        </div>
                        <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100">
                          <span className="font-semibold text-slate-600">Deductions Total</span>
                          <span className="font-extrabold text-rose-600">-$300.00</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap size={14} className="text-purple-600" />
                        <h3 className="text-sm font-black text-slate-800">AI Payroll Assistant</h3>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed mb-4">All driver timesheets and allowances match GPS logs 100%.</p>
                      <button onClick={() => setPayrollModal('ai_insights')} className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5">
                        <Zap size={12} /> View AI Insights
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. PAY HISTORY SUB-TAB */}
              {activePayTab === 'Pay History' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Historical Payslips & Payment Runs</h3>
                      <p className="text-[10px] text-slate-500 font-medium">Download past payslips or export historical payment registers</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const csvContent = "data:text/csv;charset=utf-8,"
                            + "Pay Period,Payment Date,Gross Pay,Tax (PAYG),Superannuation (11.5%),Net Amount,Status\n"
                            + "01/07/2025 - 15/07/2025,16/07/2025,$3480.00,-$539.50,$400.20,$2940.50,Paid\n"
                            + "16/06/2025 - 30/06/2025,01/07/2025,$3300.00,-$510.00,$379.50,$2790.00,Paid\n"
                            + "01/06/2025 - 15/06/2025,16/06/2025,$3150.00,-$485.00,$362.25,$2665.00,Paid\n";
                          const encodedUri = encodeURI(csvContent);
                          const link = document.createElement("a");
                          link.setAttribute("href", encodedUri);
                          link.setAttribute("download", `pay_history_${selectedDriver?.id || 'DRV-101'}.csv`);
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          showToast("Exported Pay History CSV file!");
                        }}
                        className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-1.5"
                      >
                        <Download size={14} /> Export Pay History
                      </button>
                      <button
                        onClick={() => setShowGroupCertModal(true)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 cursor-pointer flex items-center gap-1.5"
                      >
                        <FileIcon size={14} /> Generate Group Certificate
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Pay Period</th>
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Payment Date</th>
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Gross Pay</th>
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Tax (PAYG)</th>
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Super (11.5%)</th>
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Net Amount</th>
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Payslip</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs font-medium">
                        {[
                          { period: '01/07/2025 - 15/07/2025', payDate: '16/07/2025', gross: '$3,480.00', baseAmount: '$3,300.00', allowanceAmount: '+$180.00', units: '6 days', tax: '-$539.50', super: '$400.20', net: '$2,940.50', status: 'Paid' },
                          { period: '16/06/2025 - 30/06/2025', payDate: '01/07/2025', gross: '$3,300.00', baseAmount: '$3,300.00', allowanceAmount: '$0.00', units: '6 days', tax: '-$510.00', super: '$379.50', net: '$2,790.00', status: 'Paid' },
                          { period: '01/06/2025 - 15/06/2025', payDate: '16/06/2025', gross: '$3,150.00', baseAmount: '$2,750.00', allowanceAmount: '+$400.00', units: '5 days', tax: '-$485.00', super: '$362.25', net: '$2,665.00', status: 'Paid' }
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="px-5 py-4 font-bold text-slate-900">{row.period}</td>
                            <td className="px-5 py-4 text-slate-600">{row.payDate}</td>
                            <td className="px-5 py-4 font-extrabold text-slate-900">{row.gross}</td>
                            <td className="px-5 py-4 text-rose-600">{row.tax}</td>
                            <td className="px-5 py-4 text-purple-700 font-bold">{row.super}</td>
                            <td className="px-5 py-4 font-black text-emerald-600 text-sm">{row.net}</td>
                            <td className="px-5 py-4"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-bold uppercase">{row.status}</span></td>
                            <td className="px-5 py-4 text-center">
                              <button
                                onClick={() => setSelectedPayslip(row)}
                                className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg cursor-pointer transition-all shadow-xs"
                                title="View & Download Payslip"
                              >
                                <Download size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 3. PAY RATES & RULES SUB-TAB */}
              {activePayTab === 'Pay Rates & Rules' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-extrabold rounded uppercase">Award Grade 5 (HR)</span>
                        <h3 className="text-sm font-black text-slate-900">Active Pay Structure & Overtime Rules</h3>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium">Road Transport Enterprise Agreement 2026</p>
                    </div>
                    <button onClick={() => showToast("Pay rates updated successfully!")} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 cursor-pointer">Edit Pay Rates</button>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Rate Category</th>
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Type / Basis</th>
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Standard Rate</th>
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Rule / Condition</th>
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {payRatesList.map(item => (
                          <tr key={item.id} className="hover:bg-slate-50/50">
                            <td className="px-5 py-4 font-extrabold text-slate-900">{item.category}</td>
                            <td className="px-5 py-4 font-semibold text-slate-600">{item.type}</td>
                            <td className="px-5 py-4 font-black text-purple-700 text-sm">{item.rate}</td>
                            <td className="px-5 py-4 font-medium text-slate-500">{item.rule}</td>
                            <td className="px-5 py-4 text-center"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-bold uppercase">{item.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 4. ALLOWANCES SUB-TAB */}
              {activePayTab === 'Allowances' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Driver Allowances & Expenses</h3>
                      <p className="text-[10px] text-slate-500 font-medium">Manage fuel, meal, and travel reimbursement claims</p>
                    </div>
                    <button onClick={() => setPayrollModal('add_allowance')} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 cursor-pointer flex items-center gap-1.5">+ Add New Allowance</button>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Allowance Name</th>
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Category</th>
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Claim Type</th>
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Date</th>
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Amount</th>
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {allowancesList.map(item => (
                          <tr key={item.id} className="hover:bg-slate-50/50">
                            <td className="px-5 py-4 font-extrabold text-slate-900">{item.name}</td>
                            <td className="px-5 py-4 font-semibold text-slate-600">{item.category}</td>
                            <td className="px-5 py-4 font-medium text-slate-600">{item.type}</td>
                            <td className="px-5 py-4 text-slate-500">{item.date}</td>
                            <td className="px-5 py-4 font-black text-emerald-600 text-sm">{item.amount}</td>
                            <td className="px-5 py-4 text-center"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-bold uppercase">{item.status}</span></td>
                            <td className="px-5 py-4 text-center">
                              <button onClick={() => { setAllowancesList(prev => prev.filter(a => a.id !== item.id)); showToast(`Removed allowance ${item.name}`); }} className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg cursor-pointer"><Trash2 size={14} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 5. DEDUCTIONS SUB-TAB */}
              {activePayTab === 'Deductions' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Voluntary & Statutory Deductions</h3>
                      <p className="text-[10px] text-slate-500 font-medium">Pre-tax salary sacrifice and post-tax debt recoveries</p>
                    </div>
                    <button onClick={() => setPayrollModal('add_deduction')} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 cursor-pointer flex items-center gap-1.5">+ Add Deduction</button>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Deduction Name</th>
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Tax Type</th>
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Frequency</th>
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Amount</th>
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {deductionsList.map(item => (
                          <tr key={item.id} className="hover:bg-slate-50/50">
                            <td className="px-5 py-4 font-extrabold text-slate-900">{item.name}</td>
                            <td className="px-5 py-4 font-semibold text-slate-600">{item.type}</td>
                            <td className="px-5 py-4 font-medium text-slate-600">{item.frequency}</td>
                            <td className="px-5 py-4 font-black text-rose-600 text-sm">-{item.amount}</td>
                            <td className="px-5 py-4 text-center"><span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${item.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>{item.status}</span></td>
                            <td className="px-5 py-4 text-center">
                              <button onClick={() => { setDeductionsList(prev => prev.filter(d => d.id !== item.id)); showToast(`Removed deduction ${item.name}`); }} className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg cursor-pointer"><Trash2 size={14} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 6. LEAVE SUB-TAB */}
              {activePayTab === 'Leave' && (
                <div className="space-y-6">
                  {/* Leave Balances */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Annual Leave</p>
                      <p className="text-2xl font-black text-purple-700 my-1">18.5 <span className="text-xs text-slate-400 font-bold">Days</span></p>
                      <p className="text-[9px] text-emerald-600 font-bold">Accruing 1.67 days/mo</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Personal / Sick Leave</p>
                      <p className="text-2xl font-black text-blue-700 my-1">9.2 <span className="text-xs text-slate-400 font-bold">Days</span></p>
                      <p className="text-[9px] text-emerald-600 font-bold">Accruing 0.83 days/mo</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Long Service Leave</p>
                      <p className="text-2xl font-black text-slate-900 my-1">34.0 <span className="text-xs text-slate-400 font-bold">Days</span></p>
                      <p className="text-[9px] text-purple-600 font-bold">Vested & Eligible</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unpaid Leave</p>
                      <p className="text-2xl font-black text-slate-500 my-1">0.0 <span className="text-xs text-slate-400 font-bold">Days</span></p>
                      <p className="text-[9px] text-slate-400 font-bold">No unpaid absences</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Leave Requests & History Log</h3>
                      <p className="text-[10px] text-slate-500 font-medium">Track submitted leave applications and approval statuses</p>
                    </div>
                    <button onClick={() => setPayrollModal('request_leave')} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 cursor-pointer flex items-center gap-1.5">+ Request Leave</button>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Leave Type</th>
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Date Range</th>
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Duration</th>
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Approver</th>
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {leaveRequestsList.map(item => (
                          <tr key={item.id} className="hover:bg-slate-50/50">
                            <td className="px-5 py-4 font-extrabold text-slate-900">{item.type}</td>
                            <td className="px-5 py-4 font-semibold text-slate-600">{item.dates}</td>
                            <td className="px-5 py-4 font-bold text-purple-700">{item.days}</td>
                            <td className="px-5 py-4 font-medium text-slate-500">{item.approver}</td>
                            <td className="px-5 py-4 text-center">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${item.status === 'Approved' || item.status === 'Taken' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>{item.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 7. SUPERANNUATION SUB-TAB */}
              {activePayTab === 'Superannuation' && (
                <div className="space-y-6">
                  {/* Super Fund Information Card */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold rounded uppercase">{superInfo.status}</span>
                        <h3 className="text-base font-black text-slate-900">{superInfo.fundName}</h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs pt-2">
                        <div><p className="text-slate-400 font-bold text-[10px] uppercase">Member Number</p><p className="font-extrabold text-slate-900 font-mono">{superInfo.memberNumber}</p></div>
                        <div><p className="text-slate-400 font-bold text-[10px] uppercase">Fund USI</p><p className="font-extrabold text-slate-900 font-mono">{superInfo.usi}</p></div>
                        <div><p className="text-slate-400 font-bold text-[10px] uppercase">Guarantee Rate</p><p className="font-extrabold text-purple-700">{superInfo.rate}</p></div>
                        <div><p className="text-slate-400 font-bold text-[10px] uppercase">Total Super YTD</p><p className="font-black text-emerald-600">{superInfo.ytdContribution}</p></div>
                      </div>
                    </div>
                    <button onClick={() => setPayrollModal('update_super')} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 cursor-pointer shrink-0">Update Super Details</button>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100">
                      <h3 className="text-sm font-black text-slate-900">Quarterly Super Contribution Clearing Log</h3>
                    </div>
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Quarter / Period</th>
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Gross Earnings</th>
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Super Amount (11.5%)</th>
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Payment Date</th>
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Clearing Ref</th>
                          <th className="px-5 py-3.5 text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-5 py-4 font-extrabold text-slate-900">Q4 (Apr - Jun 2026)</td>
                          <td className="px-5 py-4 font-bold text-slate-700">$20,880.00</td>
                          <td className="px-5 py-4 font-black text-purple-700 text-sm">$2,401.20</td>
                          <td className="px-5 py-4 text-slate-600">14/07/2026</td>
                          <td className="px-5 py-4 font-mono text-slate-500">SCH-8839201</td>
                          <td className="px-5 py-4 text-center"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-bold uppercase">Paid to Fund</span></td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-5 py-4 font-extrabold text-slate-900">Q3 (Jan - Mar 2026)</td>
                          <td className="px-5 py-4 font-bold text-slate-700">$19,500.00</td>
                          <td className="px-5 py-4 font-black text-purple-700 text-sm">$2,242.50</td>
                          <td className="px-5 py-4 text-slate-600">15/04/2026</td>
                          <td className="px-5 py-4 font-mono text-slate-500">SCH-7728104</td>
                          <td className="px-5 py-4 text-center"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-bold uppercase">Paid to Fund</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

          {activeTab === 'Activity Timeline' && (() => {
            const filteredActivityList = timelineEventsList.filter(item => {
              const matchesTab = activeActivityTab === 'All Activities' || item.category === activeActivityTab;
              const matchesSearch = !activitySearchKeyword ||
                item.title.toLowerCase().includes(activitySearchKeyword.toLowerCase()) ||
                item.description.toLowerCase().includes(activitySearchKeyword.toLowerCase()) ||
                item.performedBy.toLowerCase().includes(activitySearchKeyword.toLowerCase()) ||
                item.id.toLowerCase().includes(activitySearchKeyword.toLowerCase());
              const matchesFrom = !activityFromDate || item.date >= activityFromDate;
              const matchesTo = !activityToDate || item.date <= activityToDate;
              return matchesTab && matchesSearch && matchesFrom && matchesTo;
            });

            return (
              <div className="space-y-6 mt-6">

                {/* Header & Filters */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                        <Activity size={20} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-800">Driver Audit Trail & History</h3>
                        <p className="text-[10px] font-medium text-slate-500">Comprehensive activity logs for {selectedDriver ? selectedDriver.name : 'Rajesh Patel'} ({selectedDriver ? selectedDriver.id : 'DRV002'})</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowAddActivityModal(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold shadow-sm cursor-pointer transition-all hover:scale-105"
                      >
                        <Activity size={12} /> + Log Manual Note
                      </button>
                      <button
                        onClick={() => {
                          let csvContent = "data:text/csv;charset=utf-8,ID,Title,Category,Status,Timestamp,Performed By,Description\n";
                          filteredActivityList.forEach(item => {
                            csvContent += `"${item.id}","${item.title}","${item.category}","${item.status}","${item.time}","${item.performedBy}","${item.description.replace(/"/g, '""')}"\n`;
                          });
                          const encodedUri = encodeURI(csvContent);
                          const link = document.createElement("a");
                          link.setAttribute("href", encodedUri);
                          link.setAttribute("download", `activity_timeline_${selectedDriver?.id || 'DRV002'}.csv`);
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          showToast(`Exported ${filteredActivityList.length} activity timeline records to CSV!`);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
                      >
                        <Download size={12} /> Export Timeline ({filteredActivityList.length})
                      </button>
                      <button
                        onClick={() => {
                          const driverName = selectedDriver ? selectedDriver.name : 'Rajesh Patel';
                          const driverId = selectedDriver ? selectedDriver.id : 'DRV002';
                          const html = `
                            <div class="header-bar">
                              <div>
                                <h1 style="color: #7c3aed;">HERO LOGISTICS</h1>
                                <p>Driver Activity & Compliance Audit Log</p>
                              </div>
                              <div style="text-align: right;">
                                <span class="badge">${activeActivityTab}</span>
                                <p style="font-weight: 800; font-size: 11px; margin-top: 4px;">Driver: ${driverName} (${driverId})</p>
                              </div>
                            </div>
                            <table>
                              <thead>
                                <tr>
                                  <th>ID</th>
                                  <th>Title & Category</th>
                                  <th>Timestamp</th>
                                  <th>Performed By</th>
                                  <th>Description</th>
                                </tr>
                              </thead>
                              <tbody>
                                ${filteredActivityList.map(item => `
                                  <tr>
                                    <td><b>${item.id}</b></td>
                                    <td><b>${item.title}</b><br/><span style="color: #7c3aed; font-size: 9px;">${item.category}</span></td>
                                    <td>${item.time}</td>
                                    <td>${item.performedBy}</td>
                                    <td style="color: #64748b;">${item.description}</td>
                                  </tr>
                                `).join('')}
                              </tbody>
                            </table>
                          `;
                          printDocumentHtml(`Activity Timeline - ${driverName}`, html);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
                      >
                        <Printer size={12} /> Print Timeline
                      </button>
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Search Activity</label>
                      <div className="relative">
                        <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={activitySearchKeyword}
                          onChange={e => setActivitySearchKeyword(e.target.value)}
                          placeholder="Search by keyword (e.g. Licence, Volvo, Started...)"
                          className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-lg text-[11px] font-medium focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-shadow"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">From Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={activityFromDate}
                          onChange={e => setActivityFromDate(e.target.value)}
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-shadow"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">To Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={activityToDate}
                          onChange={e => setActivityToDate(e.target.value)}
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-shadow"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inner Tab Navigation */}
                <div className="flex space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
                  {['All Activities', 'Assignments', 'Safety', 'Documents', 'Payroll', 'Compliance', 'Leave', 'Status Changes'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveActivityTab(tab)}
                      className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all cursor-pointer whitespace-nowrap ${activeActivityTab === tab
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Vertical Timeline */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative">
                  {/* Vertical Line */}
                  <div className="absolute top-6 bottom-6 left-12 w-0.5 bg-slate-100 hidden md:block"></div>

                  <div className="space-y-6 relative">
                    {filteredActivityList.length === 0 ? (
                      <div className="text-center py-12 text-slate-400">
                        <Activity size={36} className="mx-auto mb-2 opacity-50" />
                        <p className="font-bold text-sm text-slate-600">No activity logs found</p>
                        <p className="text-xs text-slate-400 mt-1">Try clearing your search query or selecting a different category tab.</p>
                      </div>
                    ) : (
                      filteredActivityList.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedTimelineModal(item)}
                          className="flex gap-4 group cursor-pointer"
                        >
                          <div className="w-12 flex flex-col items-center shrink-0 hidden md:flex">
                            <div className={`w-8 h-8 rounded-full border-[3px] border-white flex items-center justify-center z-10 shadow-sm ring-1 ring-slate-100 group-hover:scale-110 transition-transform ${item.category === 'Compliance' || item.category === 'Safety' ? 'bg-emerald-50 text-emerald-600' :
                                item.category === 'Assignments' ? 'bg-blue-50 text-blue-600' :
                                  item.category === 'Payroll' ? 'bg-purple-50 text-purple-600' :
                                    item.category === 'Documents' ? 'bg-amber-50 text-amber-600' :
                                      'bg-indigo-50 text-indigo-600'
                              }`}>
                              {item.category === 'Assignments' ? <Truck size={13} /> :
                                item.category === 'Compliance' || item.category === 'Safety' ? <ShieldCheck size={13} /> :
                                  item.category === 'Leave' ? <Calendar size={13} /> :
                                    <Activity size={13} />}
                            </div>
                          </div>
                          <div className="flex-1 bg-white border border-slate-100 rounded-xl p-4 shadow-xs hover:shadow-md transition-all group-hover:border-purple-200">
                            <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-[12px] font-black text-slate-800 group-hover:text-purple-700 transition-colors">{item.title}</h4>
                                <span className={`inline-flex px-1.5 py-0.5 border rounded text-[9px] font-bold tracking-widest uppercase ${item.status === 'Verified' || item.status === 'Success' || item.status === 'Passed' || item.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-purple-50 text-purple-600 border-purple-200'
                                  }`}>{item.status}</span>
                                <span className="inline-flex px-1.5 py-0.5 bg-slate-50 text-slate-500 border border-slate-200 rounded text-[9px] font-bold tracking-widest uppercase">{item.category}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                                <Clock size={10} /> {item.time}
                              </div>
                            </div>
                            <p className="text-[11px] font-medium text-slate-600 mb-3 leading-relaxed">{item.description}</p>
                            <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 pt-3 border-t border-slate-50">
                              <div className="flex items-center gap-1.5"><User size={10} /> Performed by: <span className="text-slate-700 font-extrabold">{item.performedBy}</span></div>
                              <div className="text-purple-600 font-extrabold group-hover:underline">View Audit Log {item.id} →</div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
          <div className="mt-8 bg-purple-50/50 rounded-2xl border border-purple-100 p-6">
            <h4 className="text-xs font-black text-purple-900 mb-4">Developer Notes - Driver Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <div className="flex items-center gap-1.5 mb-2 text-purple-700">
                  <User size={14} />
                  <h5 className="text-[11px] font-bold">Purpose</h5>
                </div>
                <p className="text-[10px] text-purple-800/80 leading-relaxed font-medium">This page displays the complete driver profile including personal details, compliance, assignments, performance and activity.</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-2 text-purple-700">
                  <CheckSquare size={14} />
                  <h5 className="text-[11px] font-bold">Key Features</h5>
                </div>
                <ul className="text-[10px] text-purple-800/80 space-y-1.5 font-medium list-disc pl-3">
                  <li>Driver profile and status</li>
                  <li>Compliance and expiry tracking</li>
                  <li>Current assignment and availability</li>
                  <li>Documents, performance and payroll access</li>
                  <li>AI insights (if enabled)</li>
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-2 text-purple-700">
                  <Settings size={14} />
                  <h5 className="text-[11px] font-bold">Business Rules</h5>
                </div>
                <ul className="text-[10px] text-purple-800/80 space-y-1.5 font-medium list-disc pl-3">
                  <li>Drivers belong to a specific company and branch.</li>
                  <li>Compliance score is calculated from all required documents.</li>
                  <li>Expiring Soon = within next 30 days.</li>
                  <li>Overall Compliance is shown as a percentage.</li>
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-2 text-purple-700">
                  <Shield size={14} />
                  <h5 className="text-[11px] font-bold">Permissions</h5>
                </div>
                <ul className="text-[10px] text-purple-800/80 space-y-1.5 font-medium list-disc pl-3">
                  <li>View Driver Details: Dispatch, Admin, Accounts</li>
                  <li>Edit Driver: Admin, Super Admin</li>
                  <li>Delete Driver: Super Admin only</li>
                  <li>Sensitive info (licence, DOB, medical) restricted</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4 text-[10px] font-semibold text-slate-400">
              <span>All times shown in your local time (AEST)</span>
              <span>Data auto-refreshes every 5 minutes ↺</span>
            </div>
          </div>

          {renderAllModals()}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-[#F8FAFC] w-full text-left font-sans custom-scrollbar overflow-y-auto">
      <div className="p-4 sm:p-6 pb-20">

        {/* Breadcrumb & Help */}
        <div className="flex items-center justify-between mb-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Link to="/company-admin/command-centre" className="hover:text-purple-600 transition-colors">Home</Link> <ChevronRight size={12} />
            <Link to="/company-admin/drivers" className="hover:text-purple-600 transition-colors">Drivers</Link> <ChevronRight size={12} />
            <span className="text-slate-800 font-bold">Drivers List</span>
          </div>
          <HeaderIcons />
        </div>

        {/* Page Title & Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-6">
          <div>
            <h1 className="text-xl sm:text-[28px] leading-none font-black text-slate-900 tracking-tight">4.1 Drivers List</h1>
            <p className="text-xs text-slate-500 font-medium mt-1.5">Manage all drivers, their details, compliance, assignments and performance.</p>
          </div>
          <button onClick={() => setShowAddDriver(true)} className="flex items-center gap-2 px-4 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-sm font-bold transition-colors shadow-sm cursor-pointer w-full sm:w-auto justify-center sm:justify-start">
            <UserPlus size={16} /> <span>Add Driver</span> <ChevronDown size={16} className="ml-1" />
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex items-start gap-2.5 hover:shadow-md transition-shadow">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
              <Users size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block truncate">TOTAL DRIVERS</span>
              <div className="text-xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">8 <span className="text-xs font-semibold text-slate-500">Active</span></div>
              <div className="text-[9.5px] font-bold text-emerald-600 mt-1 whitespace-nowrap">↑ 2 this month</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex items-start gap-2.5 hover:shadow-md transition-shadow">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
              <Truck size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block truncate">ON DUTY</span>
              <div className="text-xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">3 <span className="text-xs font-semibold text-slate-500">38%</span></div>
              <div className="text-[9.5px] font-bold text-slate-500 mt-1 whitespace-nowrap">Currently assigned</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex items-start gap-2.5 hover:shadow-md transition-shadow">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
              <Coffee size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block truncate">OFF DUTY</span>
              <div className="text-xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">3 <span className="text-xs font-semibold text-slate-500">38%</span></div>
              <div className="text-[9.5px] font-bold text-slate-500 mt-1 whitespace-nowrap">Not assigned</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex items-start gap-2.5 hover:shadow-md transition-shadow">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0 mt-0.5">
              <Clock size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block truncate">ON LEAVE</span>
              <div className="text-xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">1 <span className="text-xs font-semibold text-slate-500">13%</span></div>
              <div className="text-[9.5px] font-bold text-slate-500 mt-1 whitespace-nowrap">Approved leave</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex items-start gap-2.5 hover:shadow-md transition-shadow">
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
              <AlertTriangle size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block truncate">UNAVAILABLE</span>
              <div className="text-xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">1 <span className="text-xs font-semibold text-slate-500">13%</span></div>
              <div className="text-[9.5px] font-bold text-slate-500 mt-1 whitespace-nowrap">Not available</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex items-start gap-2.5 hover:shadow-md transition-shadow">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shrink-0 mt-0.5">
              <Calendar size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block truncate">EXPIRING SOON</span>
              <div className="text-xl font-black text-slate-900 leading-tight mt-1 whitespace-nowrap">2 <span className="text-xs font-semibold text-slate-500">Docs</span></div>
              <div className="text-[9.5px] font-bold text-slate-500 mt-1 whitespace-nowrap">Next 30 days</div>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6 items-start">

          {/* Left Column - List */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">

            {/* Filter Bar */}
            <div className="p-3 sm:p-4 border-b border-slate-100">
              {/* Search */}
              <div className="relative mb-3">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, phone, licence..."
                  className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>
              {/* Filters Grid */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 items-end">
                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] font-bold text-slate-400">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 outline-none w-full sm:w-24 cursor-pointer focus:border-purple-500"
                  >
                    <option value="All">All</option>
                    <option value="On Duty">On Duty</option>
                    <option value="Off Duty">Off Duty</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>
                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] font-bold text-slate-400">Licence Type</label>
                  <select
                    value={licenceFilter}
                    onChange={(e) => setLicenceFilter(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 outline-none w-full sm:w-28 cursor-pointer focus:border-purple-500"
                  >
                    <option value="All">All</option>
                    <option value="HR">HR</option>
                    <option value="HC">HC</option>
                    <option value="MR">MR</option>
                    <option value="LR">LR</option>
                  </select>
                </div>
                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] font-bold text-slate-400">Compliance</label>
                  <select
                    value={complianceFilter}
                    onChange={(e) => setComplianceFilter(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 outline-none w-full sm:w-28 cursor-pointer focus:border-purple-500"
                  >
                    <option value="All">All</option>
                    <option value="Compliant">Compliant</option>
                    <option value="Expiring">Expiring Soon</option>
                  </select>
                </div>
                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] font-bold text-slate-400">Branch</label>
                  <select
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 outline-none w-full sm:w-24 cursor-pointer focus:border-purple-500"
                  >
                    <option value="All">All</option>
                    <option value="Sydney">Sydney</option>
                    <option value="Melbourne">Melbourne</option>
                    <option value="Brisbane">Brisbane</option>
                    <option value="Adelaide">Adelaide</option>
                    <option value="Perth">Perth</option>
                  </select>
                </div>
                <div className="flex items-end gap-2 col-span-2 sm:col-span-1">
                  <button className="flex items-center gap-1.5 bg-white border border-purple-200 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-purple-50 transition-colors cursor-pointer">
                    <Filter size={14} /> More Filters
                  </button>
                  <button onClick={handleResetFilters} className="bg-slate-50 text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer">
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Table - Scrollable on all screen sizes */}
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left whitespace-nowrap min-w-[700px]">
                <thead>
                  <tr className="bg-white border-b border-slate-100">
                    <th className="px-3 py-3 w-8"><input type="checkbox" className="rounded border-slate-300" /></th>
                    <th className="px-3 py-3 text-[11px] font-bold text-slate-800">Driver</th>
                    <th className="px-3 py-3 text-[11px] font-bold text-slate-800">ID</th>
                    <th className="px-3 py-3 text-[11px] font-bold text-slate-800">Phone</th>
                    <th className="px-3 py-3 text-[11px] font-bold text-slate-800">Licence</th>
                    <th className="px-3 py-3 text-[11px] font-bold text-slate-800 text-center">Status</th>
                    <th className="px-3 py-3 text-[11px] font-bold text-slate-800">Branch</th>
                    <th className="px-3 py-3 text-[11px] font-bold text-slate-800">Assignment</th>
                    <th className="px-3 py-3 text-[11px] font-bold text-slate-800">Compliance</th>
                    <th className="px-3 py-3 text-[11px] font-bold text-slate-800 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDrivers.length > 0 ? filteredDrivers.map((driver, idx) => (
                    <tr key={driver.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedDriver(driver)}>
                      <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded border-slate-300 cursor-pointer" /></td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2.5">
                          <img src={driver.avatar} alt={driver.name} className="w-8 h-8 rounded-full border border-slate-200 shrink-0" />
                          <div>
                            <p className="text-xs font-black text-slate-800">{driver.name}</p>
                            <p className="text-[10px] text-slate-500 font-medium">Age {driver.age}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs font-bold text-slate-700">{driver.id}</td>
                      <td className="px-3 py-3 text-xs font-semibold text-slate-700">{driver.phone}</td>
                      <td className="px-3 py-3">
                        <p className="text-xs font-bold text-slate-800">{driver.licence}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{driver.licenceNo}</p>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(driver.status)}`}>
                          {driver.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-xs font-semibold text-slate-700">{driver.branch}</td>
                      <td className="px-3 py-3">
                        <p className="text-xs font-bold text-slate-800">{driver.assignmentId}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{driver.assignmentType}</p>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 flex justify-center">
                            {getComplianceIcon(driver.complianceStatus)}
                          </div>
                          <div>
                            <p className={`text-[11px] font-bold ${getComplianceTextColor(driver.complianceStatus)}`}>{driver.complianceStatus}</p>
                            <p className="text-[10px] text-slate-500 font-semibold">{driver.complianceScore}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center relative" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={(e) => { e.stopPropagation(); setDriverMenuIndex(driverMenuIndex === driver.id ? null : driver.id); }}
                            title="More Actions"
                            className={`w-8 h-8 rounded-xl transition-all cursor-pointer shadow-2xs border flex items-center justify-center ${driverMenuIndex === driver.id ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-slate-100/80 hover:bg-slate-200 text-slate-600 border-slate-200/50'}`}
                          >
                            <MoreHorizontal size={15} />
                          </button>

                          {driverMenuIndex === driver.id && (
                            <>
                              <div className="fixed inset-0 z-[80]" onClick={(e) => { e.stopPropagation(); setDriverMenuIndex(null); }} />
                              <div className={`absolute right-2 ${idx >= filteredDrivers.length - 3 ? 'bottom-full mb-1' : 'top-full mt-1'} w-48 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-1.5 z-[90] flex flex-col gap-0.5 text-xs font-semibold text-slate-700 text-left animate-in fade-in zoom-in-95 duration-100 ring-1 ring-slate-900/5`}>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setSelectedDriver(driver); setDriverMenuIndex(null); }}
                                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition-all text-left w-full cursor-pointer font-bold"
                                >
                                  <Eye size={14} className="text-purple-600" />
                                  <span>View Details</span>
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setEditDriverModal(driver); setDriverMenuIndex(null); }}
                                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition-all text-left w-full cursor-pointer font-bold"
                                >
                                  <Edit size={14} className="text-amber-600" />
                                  <span>Edit Record</span>
                                </button>
                                <div className="h-px bg-slate-100 my-0.5" />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDriverList(prev => prev.filter(d => d.id !== driver.id));
                                    setDriverMenuIndex(null);
                                  }}
                                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 transition-all text-left w-full cursor-pointer font-bold"
                                >
                                  <Trash2 size={14} className="text-rose-600" />
                                  <span>Delete Record</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="10" className="px-4 py-8 text-center text-sm font-semibold text-slate-500">
                        No drivers found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Showing 1 to {filteredDrivers.length} of {driverList.length} drivers</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <button className="w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 cursor-pointer"><ChevronLeft size={14} /></button>
                  <button className="w-6 h-6 flex items-center justify-center rounded bg-purple-700 text-white font-bold cursor-pointer">1</button>
                  <button className="w-6 h-6 flex items-center justify-center rounded text-slate-600 hover:bg-slate-100 cursor-pointer">2</button>
                  <button className="w-6 h-6 flex items-center justify-center rounded text-slate-600 hover:bg-slate-100 cursor-pointer">3</button>
                  <button className="w-6 h-6 flex items-center justify-center rounded text-slate-600 hover:bg-slate-100 cursor-pointer">4</button>
                  <button className="w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 cursor-pointer"><ChevronRight size={14} /></button>
                </div>
                <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                  <span>Rows per page</span>
                  <select className="bg-white border border-slate-200 rounded-md px-2 py-1 outline-none text-slate-700 font-semibold cursor-pointer focus:border-purple-500">
                    <option>10</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebars */}
          <div className="flex flex-col gap-6">

            {/* AI Insights Widget */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                <Settings size={16} className="text-purple-600" />
                <h3 className="text-sm font-black text-slate-800">AI Driver Insights <span className="bg-purple-100 text-purple-700 text-[9px] px-1.5 py-0.5 rounded ml-1 tracking-widest uppercase">BETA</span></h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                    <CalendarDays size={14} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-800">5 Documents Expiring Soon</h4>
                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5 mb-1.5">Driver licences, medicals, and other documents expiring within 30 days.</p>
                    <button className="text-[10px] font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors cursor-pointer">View Alerts &rarr;</button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <Users size={14} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-800">Suggested Drivers for Loads</h4>
                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5 mb-1.5">AI suggests the best available drivers for upcoming unassigned loads.</p>
                    <button className="text-[10px] font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors cursor-pointer">View Suggestions &rarr;</button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                    <AlertTriangle size={14} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-800">Performance Watch</h4>
                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5 mb-1.5">2 drivers have low compliance score. Review performance insights.</p>
                    <button className="text-[10px] font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors cursor-pointer">View Insights &rarr;</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Widget */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-800">Quick Actions</h3>
              </div>
              <div className="p-2 flex flex-col">
                <button onClick={() => setShowAddDriver(true)} className="flex items-center gap-3 w-full p-3 hover:bg-slate-50 rounded-xl transition-colors text-left group cursor-pointer">
                  <UserPlus size={16} className="text-slate-400 group-hover:text-purple-600 transition-colors" />
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">Add New Driver</span>
                </button>
                <button className="flex items-center gap-3 w-full p-3 hover:bg-slate-50 rounded-xl transition-colors text-left group cursor-pointer">
                  <Upload size={16} className="text-slate-400 group-hover:text-purple-600 transition-colors" />
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">Bulk Upload Drivers</span>
                </button>
                <button className="flex items-center gap-3 w-full p-3 hover:bg-slate-50 rounded-xl transition-colors text-left group cursor-pointer">
                  <FileText size={16} className="text-slate-400 group-hover:text-purple-600 transition-colors" />
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">Driver Document Upload</span>
                </button>
                <button className="flex items-center gap-3 w-full p-3 hover:bg-slate-50 rounded-xl transition-colors text-left group cursor-pointer">
                  <Calendar size={16} className="text-slate-400 group-hover:text-purple-600 transition-colors" />
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">Driver Availability Calendar</span>
                </button>
                <button className="flex items-center gap-3 w-full p-3 hover:bg-slate-50 rounded-xl transition-colors text-left group cursor-pointer">
                  <Download size={16} className="text-slate-400 group-hover:text-purple-600 transition-colors" />
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">Export Drivers List</span>
                </button>
              </div>
            </div>

            {/* Notes Widget */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-800">Notes</h3>
              </div>
              <div className="p-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-[11px] text-slate-600 font-medium">
                    <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
                    <span>Compliance score is based on active and upcoming documents.</span>
                  </li>
                  <li className="flex items-start gap-2 text-[11px] text-slate-600 font-medium">
                    <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
                    <span>Expiring Soon includes items expiring in the next 30 days.</span>
                  </li>
                  <li className="flex items-start gap-2 text-[11px] text-slate-600 font-medium">
                    <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
                    <span>Use filters to quickly find specific drivers.</span>
                  </li>
                  <li className="flex items-start gap-2 text-[11px] text-slate-600 font-medium">
                    <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
                    <span>Click on a driver name to view full details.</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* Developer Notes Footer */}
        <div className="mt-8 bg-purple-50/50 rounded-2xl border border-purple-100 p-6">
          <h4 className="text-xs font-black text-purple-900 mb-4">Developer Notes - Drivers List</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center gap-1.5 mb-2 text-purple-700">
                <Target size={14} />
                <h5 className="text-[11px] font-bold">Purpose</h5>
              </div>
              <p className="text-[10px] text-purple-800/80 leading-relaxed font-medium">This page provides an overview of all drivers across the organisation with key status, compliance and assignment information.</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-2 text-purple-700">
                <CheckSquare size={14} />
                <h5 className="text-[11px] font-bold">Key Features</h5>
              </div>
              <ul className="text-[10px] text-purple-800/80 space-y-1.5 font-medium list-disc pl-3">
                <li>Search, filters and sorting</li>
                <li>Compliance status with indicators</li>
                <li>Expiry alerts</li>
                <li>Quick actions</li>
                <li>AI insights (if enabled)</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-2 text-purple-700">
                <Settings size={14} />
                <h5 className="text-[11px] font-bold">Business Rules</h5>
              </div>
              <ul className="text-[10px] text-purple-800/80 space-y-1.5 font-medium list-disc pl-3">
                <li>Only drivers belonging to the selected company and branch (based on user permissions) are visible.</li>
                <li>Compliance score is calculated from all required documents.</li>
                <li>Expiring Soon = within next 30 days.</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-2 text-purple-700">
                <Shield size={14} />
                <h5 className="text-[11px] font-bold">Permissions</h5>
              </div>
              <ul className="text-[10px] text-purple-800/80 space-y-1.5 font-medium list-disc pl-3">
                <li>View Drivers: All Dispatch, Admin, Accounts</li>
                <li>Add/Edit Drivers: Admin, Super Admin</li>
                <li>Delete Drivers: Super Admin only</li>
                <li>Sensitive info (licence no., DOB, medical) role based</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 text-[10px] font-semibold text-slate-400">
          <span>All times shown in your local time (AEST)</span>
          <span>Data auto-refreshes every 5 minutes ↺</span>
        </div>

        {renderAllModals()}
      </div>
    </div>
  );
}
