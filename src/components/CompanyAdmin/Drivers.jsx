import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Truck, Coffee, Clock, AlertTriangle, Calendar, 
  Search, Filter, RefreshCcw, MoreVertical, ChevronDown, 
  ChevronLeft, ChevronRight, Download, Upload, CalendarDays,
  UserPlus, HelpCircle, AlertCircle, FileText, CheckCircle2,
  Settings, User, MapPin, Briefcase, ChevronUp, Target, CheckSquare, Shield, UploadCloud,
  Edit2, MessageSquare, ShieldCheck, Activity, XCircle, Plus, ArrowRight,
  TrendingUp, Award, Zap, FileText as FileIcon, FileCheck, Star, ThumbsUp, CheckCircle, BarChart2,
  Eye, Trash2, Printer, Search as SearchIcon
} from 'lucide-react';

const mockDrivers = [
  { id: 'DRV001', name: 'Mike Thompson', age: 34, phone: '0412 345 678', licence: 'HR (Heavy Rigid)', licenceNo: 'NSW 12345678', status: 'On Duty', branch: 'Sydney', assignmentId: 'PO-12546', assignmentType: 'Car Carrying', complianceStatus: 'Compliant', complianceScore: '100%', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 'DRV002', name: 'Rajesh Patel', age: 41, phone: '0433 765 432', licence: 'HC (Heavy Combination)', licenceNo: 'NSW 87654321', status: 'On Duty', branch: 'Melbourne', assignmentId: 'PO-12548', assignmentType: 'General Freight', complianceStatus: 'Compliant', complianceScore: '92%', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 'DRV003', name: 'Daniel White', age: 28, phone: '0401 112 233', licence: 'MR (Medium Rigid)', licenceNo: 'VIC 11223344', status: 'Off Duty', branch: 'Brisbane', assignmentId: '—', assignmentType: 'Not assigned', complianceStatus: 'Compliant', complianceScore: '85%', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: 'DRV004', name: 'Sandeep Singh', age: 38, phone: '0422 334 455', licence: 'HC (Heavy Combination)', licenceNo: 'QLD 44556677', status: 'On Leave', branch: 'Brisbane', assignmentId: '—', assignmentType: 'On Annual Leave', complianceStatus: '1 Expiring', complianceScore: '78%', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: 'DRV005', name: 'Lisa Brown', age: 31, phone: '0411 556 789', licence: 'LR (Light Rigid)', licenceNo: 'NSW 99887766', status: 'Off Duty', branch: 'Sydney', assignmentId: '—', assignmentType: 'Not assigned', complianceStatus: 'Compliant', complianceScore: '90%', avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: 'DRV006', name: 'Ahmed Khan', age: 36, phone: '0430 687 788', licence: 'HC (Heavy Combination)', licenceNo: 'NSW 22334455', status: 'Unavailable', branch: 'Melbourne', assignmentId: '—', assignmentType: 'Medical Leave', complianceStatus: '2 Expiring', complianceScore: '60%', avatar: 'https://i.pravatar.cc/150?u=6' },
  { id: 'DRV007', name: 'Jake Martin', age: 29, phone: '0408 889 900', licence: 'MR (Medium Rigid)', licenceNo: 'VIC 33445566', status: 'On Duty', branch: 'Adelaide', assignmentId: 'PO-12550', assignmentType: 'Dangerous Goods', complianceStatus: 'Compliant', complianceScore: '85%', avatar: 'https://i.pravatar.cc/150?u=7' },
  { id: 'DRV008', name: 'Priya Sharma', age: 27, phone: '0423 123 987', licence: 'MR (Medium Rigid)', licenceNo: 'QLD 55667788', status: 'Off Duty', branch: 'Perth', assignmentId: '—', assignmentType: 'Not assigned', complianceStatus: 'Compliant', complianceScore: '88%', avatar: 'https://i.pravatar.cc/150?u=8' },
];

const mockDocuments = [
  { id: 1, type: 'Driver Licence (HR)', number: 'LPI1234567', issue: '12/03/2018', expiry: '12/03/2028', status: 'Valid', daysLeft: '884 days' },
  { id: 2, type: 'Driver Licence (MR)', number: 'MR1122334', issue: '10/04/2016', expiry: '10/04/2026', status: 'Valid', daysLeft: '235 days' },
  { id: 3, type: 'Medical Certificate', number: 'MED-567890', issue: '10/08/2024', expiry: '10/08/2025', status: 'Expiring Soon', daysLeft: '28 days' },
  { id: 4, type: 'First Aid Certificate', number: 'FA-334455', issue: '05/12/2024', expiry: '05/12/2025', status: 'Valid', daysLeft: '113 days' },
  { id: 5, type: 'Dangerous Goods (DG)', number: 'DG-778899', issue: '02/02/2024', expiry: '02/02/2026', status: 'Valid', daysLeft: '145 days' },
  { id: 6, type: 'Fatigue Management Cert.', number: 'FM-445566', issue: '15/02/2024', expiry: '15/02/2026', status: 'Valid', daysLeft: '158 days' },
  { id: 7, type: 'Working With Children', number: 'WWC-889900', issue: '01/07/2023', expiry: '01/07/2026', status: 'Valid', daysLeft: '311 days' },
  { id: 8, type: 'Forklift Licence', number: 'FL-125678', issue: '20/01/2024', expiry: '20/01/2026', status: 'Valid', daysLeft: '133 days' },
  { id: 9, type: 'Heavy Vehicle Accreditation', number: 'HVA-223344', issue: '18/03/2024', expiry: '18/03/2026', status: 'Valid', daysLeft: '169 days' },
  { id: 10, type: 'Chain of Responsibility', number: 'COR-556677', issue: '01/06/2024', expiry: '01/06/2026', status: 'Valid', daysLeft: '244 days' },
  { id: 11, type: 'Road Ranger Accreditation', number: 'RR-998877', issue: '01/09/2023', expiry: '01/09/2025', status: 'Expired', daysLeft: 'Expired' },
  { id: 12, type: 'Blue Card (QLD)', number: 'BC-667788', issue: '30/11/2023', expiry: '10/11/2026', status: 'Valid', daysLeft: '308 days' }
];

export default function Drivers() {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [activeDocTab, setActiveDocTab] = useState('All Documents');
  const [activePayTab, setActivePayTab] = useState('Pay Overview');
  const [activeActivityTab, setActiveActivityTab] = useState('All Activities');
  
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

  const filteredDrivers = mockDrivers.filter(driver => {
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

  const InputField = ({ label, type = "text", placeholder, defaultValue, optional = false, className = "" }) => (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
        {label} {!optional && <span className="text-rose-500">*</span>}
      </label>
      {type === "select" ? (
        <select className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 cursor-pointer">
          {defaultValue && <option>{defaultValue}</option>}
        </select>
      ) : (
        <input 
          type={type} 
          placeholder={placeholder}
          defaultValue={defaultValue}
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        />
      )}
    </div>
  );

  const DocumentUploadBox = ({ title }) => (
    <div className="border border-dashed border-slate-300 rounded-xl p-3 flex flex-col items-center justify-center text-center hover:border-purple-500 hover:bg-purple-50 transition-colors cursor-pointer group">
      <p className="text-[10px] font-bold text-slate-700 mb-2">{title}</p>
      <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 group-hover:text-purple-600">
        <UploadCloud size={12} />
        <span>Upload</span>
      </div>
    </div>
  );

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

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{formTitle}</h1>
              <p className="text-[11px] text-slate-500 font-medium mt-1">{formDesc}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => { setShowAddDriver(false); setIsEditingDriver(false); }} className="px-5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm">Cancel</button>
              <button className="px-5 py-2 bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm">Save as Draft</button>
              <button onClick={() => { setShowAddDriver(false); setIsEditingDriver(false); }} className="flex items-center gap-1.5 px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer"><Settings size={14}/> Save Driver</button>
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
                  <InputField label="Gender" type="select" defaultValue={defaultData.gender} />
                  <InputField label="Nationality" defaultValue={defaultData.nationality} />
                  <InputField label="Phone Number" defaultValue={defaultData.phone} />
                  <InputField label="Email Address" defaultValue={defaultData.email} />
                  <InputField label="Emergency Contact Name" />
                  <InputField label="Emergency Contact Number" />
                  <InputField label="Residential Address" className="sm:col-span-2" />
                  <div className="hidden sm:block"></div>
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
                <InputField label="Driver Role" type="select" defaultValue="Driver" />
                <InputField label="Employment Type" type="select" defaultValue="Full Time" />
                <InputField label="Branch" type="select" defaultValue={defaultData.branch || "Brisbane"} />
                <InputField label="Reports To" type="select" defaultValue="Sarah Mitchell" />
                <InputField label="Joining Date" type="date" defaultValue="2026-07-18" />
                <InputField label="Driver Status" type="select" defaultValue="Available" />
                <InputField label="Shift" type="select" defaultValue="Morning" />
                <InputField label="Driver Category" type="select" defaultValue="Heavy Rig" />
              </div>
            </div>

            {/* 3. Licence Information */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-8">
              <h2 className="text-sm font-black text-slate-900 mb-6">3. Licence Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 mb-6">
                <InputField label="Licence Type" type="select" defaultValue={defaultData.licenceType || "MR (Medium Rigid)"} />
                <InputField label="Licence Number" defaultValue={defaultData.licenceNo || "VIC 11223344"} />
                <InputField label="Licence State" type="select" defaultValue="NSW" />
                <InputField label="Issue Date" type="date" />
                <InputField label="Expiry Date" type="date" />
                <InputField label="Licence Class" type="select" defaultValue="Class HR" />
              </div>
              
              <div className="w-full">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Licence Document Upload *</label>
                 <div className="border border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-purple-500 hover:bg-purple-50/50 transition-colors cursor-pointer group w-full bg-slate-50/50">
                    <UploadCloud size={24} className="text-slate-400 group-hover:text-purple-500 mb-3" />
                    <p className="text-[11px] font-bold text-slate-700 mb-1">Drag and drop file here, or click to browse</p>
                    <p className="text-[9px] font-medium text-slate-400 mb-4">Supports PDF, PNG, JPG up to 10MB.</p>
                    <button className="px-4 py-1.5 bg-white border border-slate-200 rounded shadow-sm text-[10px] font-bold text-slate-600 hover:text-purple-600">Browse file</button>
                 </div>
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
        </div>
      </div>
    );
  }

  if (selectedDriver) {
    const currentDriverIndex = mockDrivers.findIndex(d => d.id === selectedDriver.id);
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
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-[28px] leading-none font-black text-slate-900 tracking-tight">4.2 Driver Details</h1>
              <p className="text-xs text-slate-500 font-medium mt-1.5">View and manage driver information, documents, assignments and performance.</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setIsEditingDriver(true)} className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-900 text-slate-900 hover:bg-slate-50 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm">
                <Edit2 size={14} /> <span>Edit Driver</span>
              </button>
              <button onClick={() => alert(`Opening message interface for ${selectedDriver.name}`)} className="flex items-center gap-1.5 px-4 py-2 bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm">
                <MessageSquare size={14} /> <span>Message Driver</span>
              </button>
              <div className="relative">
                <button onClick={() => setIsDetailsMoreOpen(!isDetailsMoreOpen)} className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-900 text-slate-900 hover:bg-slate-50 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm">
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
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
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

          {/* Top Info Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5 mb-6">
            
            {/* Merged Card: Profile & Compliance */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row">
              
              {/* Left Side: Profile */}
              <div className="p-6 flex-1 border-b md:border-b-0 md:border-r border-slate-100">
                <div className="flex items-start gap-5 mb-6">
                  <div className="relative shrink-0">
                    <img src={selectedDriver.avatar} alt={selectedDriver.name} className="w-16 h-16 rounded-full border border-slate-200 object-cover" />
                    <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-3">
                      <h2 className="text-[22px] font-black text-slate-900">{selectedDriver.name}</h2>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getStatusStyle(selectedDriver.status)}`}>{selectedDriver.status}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-[10px] font-semibold text-slate-500 mb-0.5">Employee</p>
                        <p className="text-xs font-bold text-slate-900">{selectedDriver.id}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-slate-500 mb-0.5">Age</p>
                        <p className="text-xs font-bold text-slate-900">{selectedDriver.age}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-slate-500 mb-0.5">Date of Birth</p>
                        <p className="text-xs font-bold text-slate-900">1998-11-22</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-y-5 gap-x-4">
                  <div className="col-span-3">
                     <p className="text-[10px] font-semibold text-slate-500 mb-0.5">DR</p>
                     <p className="text-xs font-bold text-slate-900">NSW / 990</p>
                  </div>
                  
                  <div className="col-span-1">
                     <p className="text-[10px] font-semibold text-slate-500 mb-0.5">Licence Type</p>
                     <p className="text-xs font-bold text-slate-900 leading-tight">{selectedDriver.licence}</p>
                  </div>
                  <div className="col-span-2">
                     <p className="text-[10px] font-semibold text-slate-500 mb-0.5">Address</p>
                     <p className="text-xs font-bold text-slate-900 leading-tight">88 Boundary St, West End QLD 4101</p>
                  </div>

                  <div className="col-span-1">
                     <p className="text-[10px] font-semibold text-slate-500 mb-0.5">Licence No.</p>
                     <p className="text-xs font-bold text-slate-900">{selectedDriver.licenceNo}</p>
                  </div>
                  <div className="col-span-2">
                     <p className="text-[10px] font-semibold text-slate-500 mb-0.5">Issue Date</p>
                     <p className="text-xs font-bold text-slate-900">12/03/2023</p>
                  </div>

                  <div className="col-span-1">
                     <p className="text-[10px] font-semibold text-slate-500 mb-0.5">Phone</p>
                     <p className="text-xs font-bold text-slate-900">{selectedDriver.phone}</p>
                  </div>
                  <div className="col-span-1">
                     <p className="text-[10px] font-semibold text-slate-500 mb-0.5">Email</p>
                     <p className="text-xs font-bold text-slate-900 truncate">daniel.white@h...</p>
                  </div>
                  <div className="col-span-1">
                     <p className="text-[10px] font-semibold text-slate-500 mb-0.5">Branch</p>
                     <p className="text-xs font-bold text-slate-900">{selectedDriver.branch}</p>
                  </div>

                  <div className="col-span-1 col-start-2">
                     <p className="text-[10px] font-semibold text-slate-500 mb-0.5">Employment Type</p>
                     <p className="text-xs font-bold text-slate-900">Full Time</p>
                  </div>
                </div>
              </div>

              {/* Right Side: Compliance */}
              <div className="p-6 w-full md:w-64 shrink-0 flex flex-col items-start text-left">
                <div className="w-full mb-8 relative">
                  <span className="text-[11px] font-bold text-slate-500 block mb-2">Driver Status</span>
                  <div onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)} className="flex items-center justify-between border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 bg-white cursor-pointer hover:border-purple-300 transition-colors w-full">
                    <span>{selectedDriver.status}</span> <ChevronDown size={14} className="text-emerald-500" />
                  </div>
                  {isStatusDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50">
                      {['On Duty', 'Off Duty', 'On Leave', 'Unavailable'].map((status) => (
                        <button 
                          key={status}
                          onClick={() => {
                             setSelectedDriver({...selectedDriver, status});
                             setIsStatusDropdownOpen(false);
                          }}
                          className={`w-full text-left text-xs font-bold p-2 hover:bg-slate-50 rounded-lg transition-colors ${selectedDriver.status === status ? 'text-purple-700 bg-purple-50' : 'text-slate-700'}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="w-full">
                  <p className="text-[11px] font-bold text-slate-500 mb-3">Overall Compliance</p>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                      <ShieldCheck size={20} />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-[22px] leading-none font-black text-slate-900">100%</h3>
                      <p className="text-[11px] font-bold text-emerald-600 mt-1">Compliant</p>
                    </div>
                  </div>
                  <p className="text-[9px] font-bold text-slate-500">Last Updated: Today, 8:30 AM</p>
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
                             <div className="w-5 h-5 bg-slate-100 rounded flex items-center justify-center"><Target size={10} className="text-slate-500"/></div>
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
                        <div className="w-6 h-6 rounded bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100"><AlertTriangle size={12}/></div>
                        <span className="text-[11px] font-bold text-slate-800">Licence Expiry (HR)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-500">20/09/2026</span>
                        <span className="text-[9px] text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded font-black w-14 text-center">In 63 days</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100"><Target size={12}/></div>
                        <span className="text-[11px] font-bold text-slate-800">Medical Expiry</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-500">10/08/2025</span>
                        <span className="text-[9px] text-orange-600 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded font-black w-14 text-center">In 28 days</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100"><FileText size={12}/></div>
                        <span className="text-[11px] font-bold text-slate-800">Driver Card Expiry</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-500">12/10/2025</span>
                        <span className="text-[9px] text-orange-600 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded font-black w-14 text-center">In 91 days</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100"><CheckCircle2 size={12}/></div>
                        <span className="text-[11px] font-bold text-slate-800">First Aid Expiry</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-500">05/12/2025</span>
                        <span className="text-[9px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-black w-14 text-center">In 135 days</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100"><CheckCircle2 size={12}/></div>
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
                    <button className="text-[10px] font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors"><Plus size={10}/> Add Note</button>
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

          {activeTab === 'Documents & Compliance' && (
            <div className="space-y-6">
              {/* Inner Tab Navigation */}
              <div className="flex items-center gap-6 border-b border-slate-200">
                {['All Documents', 'Licences', 'Medical', 'Certifications', 'Training', 'Insurances', 'Other'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveDocTab(tab)}
                    className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${activeDocTab === tab ? 'text-purple-700 border-purple-700' : 'text-slate-500 border-transparent hover:text-slate-800'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Panel - Documents Table */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="px-4 py-4 text-[10px] font-black text-slate-800 uppercase tracking-wider">Document Type</th>
                          <th className="px-4 py-4 text-[10px] font-black text-slate-800 uppercase tracking-wider">Document Number</th>
                          <th className="px-4 py-4 text-[10px] font-black text-slate-800 uppercase tracking-wider">Issue Date</th>
                          <th className="px-4 py-4 text-[10px] font-black text-slate-800 uppercase tracking-wider">Expiry Date</th>
                          <th className="px-4 py-4 text-[10px] font-black text-slate-800 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-4 text-[10px] font-black text-slate-800 uppercase tracking-wider">Days Left</th>
                          <th className="px-4 py-4 text-[10px] font-black text-slate-800 uppercase tracking-wider text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockDocuments.map((doc, idx) => (
                          <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <FileIcon size={14} className={doc.status === 'Expired' ? 'text-rose-400' : (doc.status === 'Expiring Soon' ? 'text-amber-400' : 'text-blue-400')} />
                                <span className="text-[11px] font-bold text-slate-800">{doc.type}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-[11px] font-semibold text-slate-600">{doc.number}</td>
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
                            <td className="px-4 py-3.5 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button className="text-purple-600 hover:text-purple-800 transition-colors p-1 rounded hover:bg-purple-50 cursor-pointer">
                                  <Download size={14} />
                                </button>
                                <button className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded hover:bg-slate-50 cursor-pointer">
                                  <MoreVertical size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Showing 1 to {mockDocuments.length} of {mockDocuments.length} documents</span>
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
                          <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f43f5e" strokeWidth="4" strokeDasharray="10 90" strokeDashoffset="0"></circle>
                          {/* Expiring Soon Slice (Yellow) */}
                          <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="4" strokeDasharray="15 85" strokeDashoffset="-10"></circle>
                          {/* Valid Slice (Green) */}
                          <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4" strokeDasharray="75 25" strokeDashoffset="-25"></circle>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-black text-slate-900 leading-none">12</span>
                          <span className="text-[10px] font-semibold text-slate-500">Total</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                          <span className="text-[11px] font-bold text-slate-900">9 <span className="font-semibold text-slate-500">Valid</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                          <span className="text-[11px] font-bold text-slate-900">2 <span className="font-semibold text-slate-500">Expiring Soon</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                          <span className="text-[11px] font-bold text-slate-900">1 <span className="font-semibold text-slate-500">Expired</span></span>
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
          )}

          {activeTab === 'Performance' && (
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">Performance Analytics</h3>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                     <TrendingUp size={12} /> Export Performance
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                     <Download size={12} /> Download Report
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                     <FileIcon size={12} /> Print Report
                  </button>
                </div>
              </div>

              {/* Top 6 Scorecards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* Scorecard 1 */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">Overall<br/>Performance</h4>
                    <div className="w-6 h-6 rounded bg-purple-50 flex items-center justify-center text-purple-600"><Award size={12} /></div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mb-1">96<span className="text-sm text-slate-400">/100</span></div>
                  <div className="text-[9px] font-bold text-emerald-500">+2.4% vs last month</div>
                </div>
                {/* Scorecard 2 */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">On-Time<br/>Delivery</h4>
                    <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center text-blue-600"><Clock size={12} /></div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mb-1">97.2%</div>
                  <div className="text-[9px] font-bold text-emerald-500">+0.8% vs last month</div>
                </div>
                {/* Scorecard 3 */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">Loads<br/>Completed</h4>
                    <div className="w-6 h-6 rounded bg-emerald-50 flex items-center justify-center text-emerald-600"><CheckCircle size={12} /></div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mb-1">124</div>
                  <div className="text-[9px] font-bold text-slate-400">On track (target 130)</div>
                </div>
                {/* Scorecard 4 */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">Safety<br/>Score</h4>
                    <div className="w-6 h-6 rounded bg-indigo-50 flex items-center justify-center text-indigo-600"><Shield size={12} /></div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mb-1">98<span className="text-sm text-slate-400">/100</span></div>
                  <div className="text-[9px] font-bold text-emerald-500">Zero critical events</div>
                </div>
                {/* Scorecard 5 */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">Customer<br/>Rating</h4>
                    <div className="w-6 h-6 rounded bg-amber-50 flex items-center justify-center text-amber-600"><Star size={12} /></div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mb-1">4.92<span className="text-sm text-slate-400">/5.0</span></div>
                  <div className="text-[9px] font-bold text-slate-400">48 ratings received</div>
                </div>
                {/* Scorecard 6 */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">Compliance<br/>Score</h4>
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
                  <span className="text-[10px] font-bold text-slate-400">Showing last 5 completed routes</span>
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
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4 text-[11px] font-bold text-slate-700">08/07/2026</td>
                        <td className="px-5 py-4 text-[11px] font-bold text-purple-600 cursor-pointer hover:underline">LD-34412 (HR Heavy Rigid)</td>
                        <td className="px-5 py-4 text-[11px] font-semibold text-slate-600">Sydney NSW &rarr; Canberra ACT</td>
                        <td className="px-5 py-4 text-[11px] font-black text-slate-900">95/100</td>
                        <td className="px-5 py-4">
                          <span className="inline-flex px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-bold tracking-widest uppercase">Completed</span>
                        </td>
                        <td className="px-5 py-4 text-[10px] font-medium text-slate-500">Smooth vehicle handling recorded.</td>
                      </tr>
                      <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4 text-[11px] font-bold text-slate-700">05/07/2026</td>
                        <td className="px-5 py-4 text-[11px] font-bold text-purple-600 cursor-pointer hover:underline">LD-34301 (HR Heavy Rigid)</td>
                        <td className="px-5 py-4 text-[11px] font-semibold text-slate-600">Goulburn NSW &rarr; Sydney NSW</td>
                        <td className="px-5 py-4 text-[11px] font-black text-slate-900">97/100</td>
                        <td className="px-5 py-4">
                          <span className="inline-flex px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-bold tracking-widest uppercase">Completed</span>
                        </td>
                        <td className="px-5 py-4 text-[10px] font-medium text-slate-500">Zero driving incidents, customer gave 5 stars.</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4 text-[11px] font-bold text-slate-700">02/07/2026</td>
                        <td className="px-5 py-4 text-[11px] font-bold text-purple-600 cursor-pointer hover:underline">LD-34288 (HR Heavy Rigid)</td>
                        <td className="px-5 py-4 text-[11px] font-semibold text-slate-600">Sydney NSW Local Route</td>
                        <td className="px-5 py-4 text-[11px] font-black text-slate-900">84/100</td>
                        <td className="px-5 py-4">
                          <span className="inline-flex px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-bold tracking-widest uppercase">Completed</span>
                        </td>
                        <td className="px-5 py-4 text-[10px] font-medium text-slate-500">Delayed by 15 mins due to road construction.</td>
                      </tr>
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
                        <tr className="border-b border-slate-50 hover:bg-slate-50/50">
                          <td className="px-4 py-3 text-[11px] font-bold text-purple-600 cursor-pointer hover:underline">LD-12546</td>
                          <td className="px-4 py-3 text-[11px] font-semibold text-slate-600">Car Carrier</td>
                          <td className="px-4 py-3">
                            <div className="text-[11px] font-bold text-slate-800">Sydney NSW &rarr; Brisbane QLD</div>
                            <div className="text-[9px] text-slate-400 font-medium">2 Stops</div>
                          </td>
                          <td className="px-4 py-3 text-[11px] font-semibold text-slate-600">Volvo FH 540 | TRK-101</td>
                          <td className="px-4 py-3 text-[11px] font-semibold text-slate-600">15/07/2025 06:00 AM</td>
                          <td className="px-4 py-3 text-[11px] font-semibold text-slate-600">18/07/2025 09:00 AM</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-bold tracking-widest uppercase">In Progress</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button className="text-slate-400 hover:text-slate-700 p-1"><Eye size={12} /></button>
                              <button className="text-slate-400 hover:text-purple-600 p-1"><Edit2 size={12} /></button>
                              <button className="text-slate-400 hover:text-rose-600 p-1"><XCircle size={12} /></button>
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 text-[11px] font-bold text-purple-600 cursor-pointer hover:underline">LD-12557</td>
                          <td className="px-4 py-3 text-[11px] font-semibold text-slate-600">General Freight</td>
                          <td className="px-4 py-3">
                            <div className="text-[11px] font-bold text-slate-800">Melbourne VIC &rarr; Sydney NSW</div>
                            <div className="text-[9px] text-slate-400 font-medium">3 Stops</div>
                          </td>
                          <td className="px-4 py-3 text-[11px] font-semibold text-slate-600">Volvo FH 540 | TRK-101</td>
                          <td className="px-4 py-3 text-[11px] font-semibold text-slate-600">19/07/2025 07:00 AM</td>
                          <td className="px-4 py-3 text-[11px] font-semibold text-slate-600">20/07/2025 06:00 PM</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded text-[9px] font-bold tracking-widest uppercase">Assigned</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button className="text-slate-400 hover:text-slate-700 p-1"><Eye size={12} /></button>
                              <button className="text-slate-400 hover:text-purple-600 p-1"><Edit2 size={12} /></button>
                              <button className="text-slate-400 hover:text-rose-600 p-1"><XCircle size={12} /></button>
                            </div>
                          </td>
                        </tr>
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
                        <tr className="border-b border-slate-50 hover:bg-slate-50/50">
                          <td className="px-4 py-3 text-[11px] font-bold text-purple-600 cursor-pointer hover:underline">LD-12568</td>
                          <td className="px-4 py-3 text-[11px] font-semibold text-slate-600">Car Carrier</td>
                          <td className="px-4 py-3">
                            <div className="text-[11px] font-bold text-slate-800">Brisbane QLD &rarr; Adelaide SA</div>
                            <div className="text-[9px] text-slate-400 font-medium">2 Stops</div>
                          </td>
                          <td className="px-4 py-3 text-[11px] font-semibold text-slate-600">Volvo FH 540 | TRK-101</td>
                          <td className="px-4 py-3 text-[11px] font-semibold text-slate-600">21/07/2025 08:00 AM</td>
                          <td className="px-4 py-3 text-[11px] font-semibold text-slate-600">22/07/2025 05:00 PM</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex px-1.5 py-0.5 bg-purple-50 text-purple-600 border border-purple-200 rounded text-[9px] font-bold tracking-widest uppercase">Scheduled</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button className="text-slate-400 hover:text-slate-700 p-1"><Eye size={12} /></button>
                              <button className="text-slate-400 hover:text-purple-600 p-1"><Edit2 size={12} /></button>
                              <button className="text-slate-400 hover:text-rose-600 p-1"><Trash2 size={12} /></button>
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 text-[11px] font-bold text-purple-600 cursor-pointer hover:underline">LD-12572</td>
                          <td className="px-4 py-3 text-[11px] font-semibold text-slate-600">Car Carrier</td>
                          <td className="px-4 py-3">
                            <div className="text-[11px] font-bold text-slate-800">Adelaide SA &rarr; Melbourne VIC</div>
                            <div className="text-[9px] text-slate-400 font-medium">2 Stops</div>
                          </td>
                          <td className="px-4 py-3 text-[11px] font-semibold text-slate-600">Volvo FH 540 | TRK-101</td>
                          <td className="px-4 py-3 text-[11px] font-semibold text-slate-600">24/07/2025 09:00 AM</td>
                          <td className="px-4 py-3 text-[11px] font-semibold text-slate-600">25/07/2025 06:00 PM</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex px-1.5 py-0.5 bg-purple-50 text-purple-600 border border-purple-200 rounded text-[9px] font-bold tracking-widest uppercase">Scheduled</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button className="text-slate-400 hover:text-slate-700 p-1"><Eye size={12} /></button>
                              <button className="text-slate-400 hover:text-purple-600 p-1"><Edit2 size={12} /></button>
                              <button className="text-slate-400 hover:text-rose-600 p-1"><Trash2 size={12} /></button>
                            </div>
                          </td>
                        </tr>
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
              <div className="flex space-x-6 border-b border-slate-200">
                {['Pay Overview', 'Pay History', 'Pay Rates & Rules', 'Allowances', 'Deductions', 'Leave', 'Superannuation'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActivePayTab(tab)}
                    className={`py-3 text-[11px] font-black uppercase tracking-widest relative ${
                      activePayTab === tab
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

              {/* Layout Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Panel */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Top 6 Stat Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                    {/* Card 1 */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 overflow-hidden">
                      <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-tight mb-2">Total<br/>Earnings<br/>(This Month)</div>
                      <div className="text-base xl:text-lg font-black text-slate-900 mb-1 truncate" title="$3,265.00">$3,265.00</div>
                      <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 truncate">
                        <TrendingUp size={10} className="shrink-0" /> 12% <span className="text-slate-400 font-medium truncate">vs last month</span>
                      </div>
                    </div>
                    {/* Card 2 */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 overflow-hidden">
                      <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-tight mb-2">Net Pay<br/>(This Month)</div>
                      <div className="text-base xl:text-lg font-black text-slate-900 mb-1 truncate" title="$2,940.50">$2,940.50</div>
                      <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 truncate">
                        <TrendingUp size={10} className="shrink-0" /> 10% <span className="text-slate-400 font-medium truncate">vs last month</span>
                      </div>
                    </div>
                    {/* Card 3 */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 overflow-hidden">
                      <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-tight mb-2">Loads<br/>Completed</div>
                      <div className="text-base xl:text-lg font-black text-slate-900 mb-1 truncate" title="18">18</div>
                      <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 truncate">
                        <TrendingUp size={10} className="shrink-0" /> 0 <span className="text-slate-400 font-medium truncate">vs last month</span>
                      </div>
                    </div>
                    {/* Card 4 */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 overflow-hidden">
                      <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-tight mb-2">Total<br/>Kilometres</div>
                      <div className="text-base xl:text-lg font-black text-slate-900 mb-1 truncate" title="7,842 km">7,842 km</div>
                      <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 truncate">
                        <TrendingUp size={10} className="shrink-0" /> 654 km <span className="text-slate-400 font-medium truncate">vs last month</span>
                      </div>
                    </div>
                    {/* Card 5 */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 overflow-hidden">
                      <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-tight mb-2">Avg. Daily<br/>Earnings</div>
                      <div className="text-base xl:text-lg font-black text-slate-900 mb-1 truncate" title="$163.25">$163.25</div>
                      <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 truncate">
                        <TrendingUp size={10} className="shrink-0" /> $12.40 <span className="text-slate-400 font-medium truncate">vs last month</span>
                      </div>
                    </div>
                    {/* Card 6 */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between overflow-hidden">
                      <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-tight mb-2">Pay Rate</div>
                      <div>
                        <div className="text-base xl:text-lg font-black text-slate-900 truncate" title="$550.00 / day">$550.00 / day</div>
                        <div className="text-[9px] text-slate-400 font-medium mt-1 truncate">Daily Rate</div>
                      </div>
                    </div>
                  </div>

                  {/* Earnings Summary Table */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="text-sm font-black text-slate-800">Earnings Summary (This Month)</h3>
                      <div className="relative">
                        <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Search by Load ID or description..." 
                          className="pl-8 pr-4 py-1.5 border border-slate-200 rounded-lg text-[11px] font-medium w-64 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-shadow"
                        />
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider">Load ID</th>
                            <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider">Route / Description</th>
                            <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider">Type</th>
                            <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider">Hours / Days / Km</th>
                            <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider">Rate</th>
                            <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider">Amount</th>
                            <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-wider text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-50 hover:bg-slate-50/50">
                            <td className="px-4 py-3 text-[11px] font-medium text-slate-700">18/07/2025</td>
                            <td className="px-4 py-3 text-[11px] font-bold text-purple-600 cursor-pointer hover:underline">LD-12557</td>
                            <td className="px-4 py-3 text-[11px] font-semibold text-slate-800">Melbourne VIC &rarr; Sydney NSW</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded text-[9px] font-bold tracking-widest uppercase">Daily Rate</span>
                            </td>
                            <td className="px-4 py-3 text-[11px] font-medium text-slate-600">1 day</td>
                            <td className="px-4 py-3 text-[11px] font-medium text-slate-600">$550.00 / day</td>
                            <td className="px-4 py-3 text-[11px] font-black text-slate-900">$550.00</td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-bold tracking-widest uppercase">Pending</span>
                            </td>
                          </tr>
                          <tr className="border-b border-slate-50 hover:bg-slate-50/50">
                            <td className="px-4 py-3 text-[11px] font-medium text-slate-700">18/07/2025</td>
                            <td className="px-4 py-3 text-[11px] font-bold text-purple-600 cursor-pointer hover:underline">LD-12546</td>
                            <td className="px-4 py-3 text-[11px] font-semibold text-slate-800">Sydney NSW &rarr; Brisbane QLD</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded text-[9px] font-bold tracking-widest uppercase">Daily Rate</span>
                            </td>
                            <td className="px-4 py-3 text-[11px] font-medium text-slate-600">1 day</td>
                            <td className="px-4 py-3 text-[11px] font-medium text-slate-600">$550.00 / day</td>
                            <td className="px-4 py-3 text-[11px] font-black text-slate-900">$550.00</td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-bold tracking-widest uppercase">Pending</span>
                            </td>
                          </tr>
                          <tr className="border-b border-slate-50 hover:bg-slate-50/50">
                            <td className="px-4 py-3 text-[11px] font-medium text-slate-700">17/07/2025</td>
                            <td className="px-4 py-3 text-[11px] font-bold text-purple-600 cursor-pointer hover:underline">LD-12532</td>
                            <td className="px-4 py-3 text-[11px] font-semibold text-slate-800">Brisbane QLD &rarr; Adelaide SA</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded text-[9px] font-bold tracking-widest uppercase">Daily Rate</span>
                            </td>
                            <td className="px-4 py-3 text-[11px] font-medium text-slate-600">1 day</td>
                            <td className="px-4 py-3 text-[11px] font-medium text-slate-600">$550.00 / day</td>
                            <td className="px-4 py-3 text-[11px] font-black text-slate-900">$550.00</td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-bold tracking-widest uppercase">Approved</span>
                            </td>
                          </tr>
                          <tr className="border-b border-slate-50 hover:bg-slate-50/50">
                            <td className="px-4 py-3 text-[11px] font-medium text-slate-700">16/07/2025</td>
                            <td className="px-4 py-3 text-[11px] font-bold text-emerald-600 cursor-pointer hover:underline">EXP-2045</td>
                            <td className="px-4 py-3 text-[11px] font-semibold text-slate-800">Fuel Reimbursement</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-bold tracking-widest uppercase">Allowance</span>
                            </td>
                            <td className="px-4 py-3 text-[11px] font-medium text-slate-600">—</td>
                            <td className="px-4 py-3 text-[11px] font-medium text-slate-600">$120.00</td>
                            <td className="px-4 py-3 text-[11px] font-black text-emerald-600">$120.00</td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-bold tracking-widest uppercase">Approved</span>
                            </td>
                          </tr>
                          <tr className="border-b border-slate-50 hover:bg-slate-50/50">
                            <td className="px-4 py-3 text-[11px] font-medium text-slate-700">15/07/2025</td>
                            <td className="px-4 py-3 text-[11px] font-bold text-blue-600 cursor-pointer hover:underline">TA-1123</td>
                            <td className="px-4 py-3 text-[11px] font-semibold text-slate-800">Truck Wash</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-bold tracking-widest uppercase">Allowance</span>
                            </td>
                            <td className="px-4 py-3 text-[11px] font-medium text-slate-600">—</td>
                            <td className="px-4 py-3 text-[11px] font-medium text-slate-600">$50.00</td>
                            <td className="px-4 py-3 text-[11px] font-black text-emerald-600">$50.00</td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-bold tracking-widest uppercase">Approved</span>
                            </td>
                          </tr>
                          <tr className="border-b border-slate-50 hover:bg-slate-50/50">
                            <td className="px-4 py-3 text-[11px] font-medium text-slate-700">14/07/2025</td>
                            <td className="px-4 py-3 text-[11px] font-bold text-rose-600 cursor-pointer hover:underline">ADV-3342</td>
                            <td className="px-4 py-3 text-[11px] font-semibold text-slate-800">Advance Deduction</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex px-1.5 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 rounded text-[9px] font-bold tracking-widest uppercase">Deduction</span>
                            </td>
                            <td className="px-4 py-3 text-[11px] font-medium text-slate-600">—</td>
                            <td className="px-4 py-3 text-[11px] font-medium text-slate-600">-$300.00</td>
                            <td className="px-4 py-3 text-[11px] font-black text-rose-600">-$300.00</td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-bold tracking-widest uppercase">Approved</span>
                            </td>
                          </tr>
                          <tr className="border-b border-slate-50 hover:bg-slate-50/50">
                            <td className="px-4 py-3 text-[11px] font-medium text-slate-700">11/07/2025</td>
                            <td className="px-4 py-3 text-[11px] font-bold text-purple-600 cursor-pointer hover:underline">LD-12488</td>
                            <td className="px-4 py-3 text-[11px] font-semibold text-slate-800">Newcastle NSW &rarr; Sydney NSW</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded text-[9px] font-bold tracking-widest uppercase">Daily Rate</span>
                            </td>
                            <td className="px-4 py-3 text-[11px] font-medium text-slate-600">1 day</td>
                            <td className="px-4 py-3 text-[11px] font-medium text-slate-600">$550.00 / day</td>
                            <td className="px-4 py-3 text-[11px] font-black text-slate-900">$550.00</td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex px-1.5 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[9px] font-bold tracking-widest uppercase">Paid</span>
                            </td>
                          </tr>
                          <tr className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 text-[11px] font-medium text-slate-700">10/07/2025</td>
                            <td className="px-4 py-3 text-[11px] font-bold text-emerald-600 cursor-pointer hover:underline">EXP-1999</td>
                            <td className="px-4 py-3 text-[11px] font-semibold text-slate-800">Tolls Reimbursement</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-bold tracking-widest uppercase">Allowance</span>
                            </td>
                            <td className="px-4 py-3 text-[11px] font-medium text-slate-600">—</td>
                            <td className="px-4 py-3 text-[11px] font-medium text-slate-600">$45.00</td>
                            <td className="px-4 py-3 text-[11px] font-black text-emerald-600">$45.00</td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex px-1.5 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[9px] font-bold tracking-widest uppercase">Paid</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="p-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-500 font-medium">
                      <span>Showing 1 to 8 of 10 entries</span>
                      <div className="flex items-center gap-1">
                        <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400"><ChevronLeft size={14} /></button>
                        <button className="w-6 h-6 flex items-center justify-center rounded bg-purple-50 text-purple-700 font-bold">1</button>
                        <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 text-slate-700 font-bold">2</button>
                        <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 text-slate-600"><ChevronRight size={14} /></button>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Panel */}
                <div className="space-y-6">
                  
                  {/* Earnings Breakdown */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <h3 className="text-[11px] font-black text-slate-800 mb-6">Earnings Breakdown (This Month)</h3>
                    
                    {/* Donut Chart Mockup */}
                    <div className="relative w-40 h-40 mx-auto mb-6">
                      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                        {/* Daily Rate (94.8%) */}
                        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4" strokeDasharray="94.8 5.2" />
                        {/* Allowances (6.2%) - Starts after Daily Rate */}
                        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4" strokeDasharray="6.2 93.8" strokeDashoffset="-94.8" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[11px] font-bold text-slate-500 tracking-widest uppercase mt-2">Total</span>
                        <span className="text-xl font-black text-slate-900">$3,480</span>
                      </div>
                    </div>

                    {/* Chart Legend */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[10px]">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-blue-100"></div>
                          <span className="font-bold text-slate-600">Daily Rate</span>
                        </div>
                        <span className="font-black text-slate-900">$3,300 (94.8%)</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-emerald-100"></div>
                          <span className="font-bold text-slate-600">Allowances</span>
                        </div>
                        <span className="font-black text-slate-900">$215 (6.2%)</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-rose-100"></div>
                          <span className="font-bold text-slate-600">Deductions</span>
                        </div>
                        <span className="font-black text-slate-900">-$324.50</span>
                      </div>
                    </div>
                  </div>

                  {/* Upcoming Payments */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-[11px] font-black text-slate-800">Upcoming Payments</h3>
                      <button className="text-[10px] font-bold text-purple-600 flex items-center hover:text-purple-700">View All &rarr;</button>
                    </div>
                    
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-black text-[10px]">MT</div>
                        <div>
                          <div className="text-[11px] font-bold text-slate-900">Mike Thompson</div>
                          <div className="text-[9px] font-medium text-slate-500">Payment Date: 01/08/2025</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] font-black text-slate-900">$2,940.50</div>
                        <div className="text-[9px] font-medium text-slate-500">Bank Transfer</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="inline-flex px-1.5 py-0.5 bg-purple-50 text-purple-600 border border-purple-200 rounded text-[9px] font-bold tracking-widest uppercase">Scheduled</span>
                      <span className="text-[9px] font-bold text-slate-500">Next Pay Run: 01/08/2025</span>
                    </div>
                  </div>

                  {/* AI Payroll Assistant */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                      <Zap size={14} className="text-purple-600" />
                      <h3 className="text-sm font-black text-slate-800">AI Payroll Assistant <span className="bg-purple-100 text-purple-700 text-[9px] px-1.5 py-0.5 rounded ml-1 tracking-widest uppercase">AI</span></h3>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                        <span className="text-[10px] font-bold text-slate-700">All timesheets are approved.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                        <span className="text-[10px] font-bold text-slate-700">No anomalies detected in this pay run.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                        <span className="text-[10px] font-bold text-slate-700">Superannuation guarantee will be calculated automatically.</span>
                      </div>
                      
                      <button className="w-full mt-4 py-2 border border-purple-200 text-purple-700 rounded-lg text-[11px] font-bold hover:bg-purple-50 transition-colors flex items-center justify-center gap-1.5">
                        <Zap size={12} /> View AI Insights
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {activeTab === 'Activity Timeline' && (
            <div className="space-y-6 mt-6">
              
              {/* Header & Filters */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                      <Activity size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-800">Driver Audit Trail & History</h3>
                      <p className="text-[10px] font-medium text-slate-500">Comprehensive activity logs for DRV005</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                      <Download size={12} /> Export Timeline
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
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
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-shadow"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">To Date</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-shadow"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Inner Tab Navigation */}
              <div className="flex space-x-2 border-b border-slate-200 pb-2">
                {['All Activities', 'Assignments', 'Safety', 'Documents', 'Payroll', 'Compliance', 'Leave', 'Status Changes'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveActivityTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase transition-colors ${
                      activeActivityTab === tab
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-500 hover:bg-slate-100'
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
                  
                  {/* Timeline Item 1 */}
                  <div className="flex gap-4 group">
                    <div className="w-12 flex flex-col items-center shrink-0 hidden md:flex">
                      <div className="w-8 h-8 rounded-full border-[3px] border-white bg-emerald-50 text-emerald-600 flex items-center justify-center z-10 shadow-sm ring-1 ring-slate-100 group-hover:scale-110 transition-transform">
                        <ShieldCheck size={12} />
                      </div>
                    </div>
                    <div className="flex-1 bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group-hover:border-slate-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[12px] font-black text-slate-800">Compliance Updated</h4>
                          <span className="inline-flex px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-bold tracking-widest uppercase">Verified</span>
                          <span className="inline-flex px-1.5 py-0.5 bg-slate-50 text-slate-500 border border-slate-200 rounded text-[9px] font-bold tracking-widest uppercase">Compliance</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                          <Clock size={10} /> Today at 09:00 AM
                        </div>
                      </div>
                      <p className="text-[11px] font-medium text-slate-600 mb-3">Medical Certificate verification completed successfully.</p>
                      <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-1.5"><User size={10} /> Performed by: <span className="text-slate-600">Compliance Automated Auditor</span></div>
                        <div>ID: #1001</div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Item 2 */}
                  <div className="flex gap-4 group">
                    <div className="w-12 flex flex-col items-center shrink-0 hidden md:flex">
                      <div className="w-8 h-8 rounded-full border-[3px] border-white bg-blue-50 text-blue-600 flex items-center justify-center z-10 shadow-sm ring-1 ring-slate-100 group-hover:scale-110 transition-transform">
                        <Truck size={12} />
                      </div>
                    </div>
                    <div className="flex-1 bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group-hover:border-slate-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[12px] font-black text-slate-800">Vehicle Returned</h4>
                          <span className="inline-flex px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded text-[9px] font-bold tracking-widest uppercase">Success</span>
                          <span className="inline-flex px-1.5 py-0.5 bg-slate-50 text-slate-500 border border-slate-200 rounded text-[9px] font-bold tracking-widest uppercase">Assignments</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                          <Clock size={10} /> Today at 05:15 PM
                        </div>
                      </div>
                      <p className="text-[11px] font-medium text-slate-600 mb-3">Returned vehicle Volvo FH16 (VH-9930) after shift completion. Post-trip inspection checks passed.</p>
                      <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-1.5"><User size={10} /> Performed by: <span className="text-slate-600">Mike Thompson (Driver)</span></div>
                        <div>ID: #1002</div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Item 3 */}
                  <div className="flex gap-4 group">
                    <div className="w-12 flex flex-col items-center shrink-0 hidden md:flex">
                      <div className="w-8 h-8 rounded-full border-[3px] border-white bg-blue-50 text-blue-600 flex items-center justify-center z-10 shadow-sm ring-1 ring-slate-100 group-hover:scale-110 transition-transform">
                        <Truck size={12} />
                      </div>
                    </div>
                    <div className="flex-1 bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group-hover:border-slate-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[12px] font-black text-slate-800">Vehicle Assigned</h4>
                          <span className="inline-flex px-1.5 py-0.5 bg-purple-50 text-purple-600 border border-purple-200 rounded text-[9px] font-bold tracking-widest uppercase">Active</span>
                          <span className="inline-flex px-1.5 py-0.5 bg-slate-50 text-slate-500 border border-slate-200 rounded text-[9px] font-bold tracking-widest uppercase">Assignments</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                          <Clock size={10} /> Today at 08:30 AM
                        </div>
                      </div>
                      <p className="text-[11px] font-medium text-slate-600 mb-3">Assigned vehicle Volvo FH16 (VH-9930) for current route.</p>
                      <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-1.5"><User size={10} /> Performed by: <span className="text-slate-600">Fleet Manager</span></div>
                        <div>ID: #1003</div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Item 4 */}
                  <div className="flex gap-4 group">
                    <div className="w-12 flex flex-col items-center shrink-0 hidden md:flex">
                      <div className="w-8 h-8 rounded-full border-[3px] border-white bg-purple-50 text-purple-600 flex items-center justify-center z-10 shadow-sm ring-1 ring-slate-100 group-hover:scale-110 transition-transform">
                        <Clock size={12} />
                      </div>
                    </div>
                    <div className="flex-1 bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group-hover:border-slate-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[12px] font-black text-slate-800">Status Changed</h4>
                          <span className="inline-flex px-1.5 py-0.5 bg-purple-50 text-purple-600 border border-purple-200 rounded text-[9px] font-bold tracking-widest uppercase">Updated</span>
                          <span className="inline-flex px-1.5 py-0.5 bg-slate-50 text-slate-500 border border-slate-200 rounded text-[9px] font-bold tracking-widest uppercase">Status Changes</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                          <Clock size={10} /> Today at 08:30 AM
                        </div>
                      </div>
                      <p className="text-[11px] font-medium text-slate-600 mb-3">Duty status updated to "On Duty". Location: Sydney Branch.</p>
                      <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-1.5"><User size={10} /> Performed by: <span className="text-slate-600">Sarah Mitchell (HR)</span></div>
                        <div>ID: #1004</div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Item 5 */}
                  <div className="flex gap-4 group">
                    <div className="w-12 flex flex-col items-center shrink-0 hidden md:flex">
                      <div className="w-8 h-8 rounded-full border-[3px] border-white bg-amber-50 text-amber-600 flex items-center justify-center z-10 shadow-sm ring-1 ring-slate-100 group-hover:scale-110 transition-transform">
                        <Calendar size={12} />
                      </div>
                    </div>
                    <div className="flex-1 bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group-hover:border-slate-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[12px] font-black text-slate-800">Leave Requested</h4>
                          <span className="inline-flex px-1.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded text-[9px] font-bold tracking-widest uppercase">Pending</span>
                          <span className="inline-flex px-1.5 py-0.5 bg-slate-50 text-slate-500 border border-slate-200 rounded text-[9px] font-bold tracking-widest uppercase">Leave</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                          <Clock size={10} /> 10/07/2026 at 10:30 AM
                        </div>
                      </div>
                      <p className="text-[11px] font-medium text-slate-600 mb-3">Requested annual leave for 10-15 August 2026. Pending operational approval.</p>
                      <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-1.5"><User size={10} /> Performed by: <span className="text-slate-600">Mike Thompson (Driver)</span></div>
                        <div>ID: #1005</div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Item 6 */}
                  <div className="flex gap-4 group">
                    <div className="w-12 flex flex-col items-center shrink-0 hidden md:flex">
                      <div className="w-8 h-8 rounded-full border-[3px] border-white bg-emerald-50 text-emerald-600 flex items-center justify-center z-10 shadow-sm ring-1 ring-slate-100 group-hover:scale-110 transition-transform">
                        <FileIcon size={12} />
                      </div>
                    </div>
                    <div className="flex-1 bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group-hover:border-slate-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[12px] font-black text-slate-800">Payroll Generated</h4>
                          <span className="inline-flex px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-bold tracking-widest uppercase">Processed</span>
                          <span className="inline-flex px-1.5 py-0.5 bg-slate-50 text-slate-500 border border-slate-200 rounded text-[9px] font-bold tracking-widest uppercase">Payroll</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                          <Clock size={10} /> 08/07/2026 at 09:00 AM
                        </div>
                      </div>
                      <p className="text-[11px] font-medium text-slate-600 mb-3">Pay slip generated for pay period 01 Jul - 15 Jul 2026.</p>
                      <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-1.5"><User size={10} /> Performed by: <span className="text-slate-600">Automated Payroll System</span></div>
                        <div>ID: #1006</div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Item 7 */}
                  <div className="flex gap-4 group">
                    <div className="w-12 flex flex-col items-center shrink-0 hidden md:flex">
                      <div className="w-8 h-8 rounded-full border-[3px] border-white bg-emerald-50 text-emerald-600 flex items-center justify-center z-10 shadow-sm ring-1 ring-slate-100 group-hover:scale-110 transition-transform">
                        <CheckCircle size={12} />
                      </div>
                    </div>
                    <div className="flex-1 bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group-hover:border-slate-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[12px] font-black text-slate-800">Assignment Completed</h4>
                          <span className="inline-flex px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-bold tracking-widest uppercase">Delivered</span>
                          <span className="inline-flex px-1.5 py-0.5 bg-slate-50 text-slate-500 border border-slate-200 rounded text-[9px] font-bold tracking-widest uppercase">Assignments</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                          <Clock size={10} /> 02/07/2026 at 04:00 PM
                        </div>
                      </div>
                      <p className="text-[11px] font-medium text-slate-600 mb-3">Delivered load assignment LD-34288 to Sydney NSW Local Route.</p>
                      <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-1.5"><User size={10} /> Performed by: <span className="text-slate-600">Mike Thompson (Driver)</span></div>
                        <div>ID: #1007</div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Item 8 */}
                  <div className="flex gap-4 group">
                    <div className="w-12 flex flex-col items-center shrink-0 hidden md:flex">
                      <div className="w-8 h-8 rounded-full border-[3px] border-white bg-blue-50 text-blue-600 flex items-center justify-center z-10 shadow-sm ring-1 ring-slate-100 group-hover:scale-110 transition-transform">
                        <Truck size={12} />
                      </div>
                    </div>
                    <div className="flex-1 bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group-hover:border-slate-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[12px] font-black text-slate-800">Assignment Started</h4>
                          <span className="inline-flex px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded text-[9px] font-bold tracking-widest uppercase">In Transit</span>
                          <span className="inline-flex px-1.5 py-0.5 bg-slate-50 text-slate-500 border border-slate-200 rounded text-[9px] font-bold tracking-widest uppercase">Assignments</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                          <Clock size={10} /> 02/07/2026 at 08:00 AM
                        </div>
                      </div>
                      <p className="text-[11px] font-medium text-slate-600 mb-3">Began transit for load assignment LD-34288.</p>
                      <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-1.5"><User size={10} /> Performed by: <span className="text-slate-600">Mike Thompson (Driver)</span></div>
                        <div>ID: #1008</div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Item 9 */}
                  <div className="flex gap-4 group">
                    <div className="w-12 flex flex-col items-center shrink-0 hidden md:flex">
                      <div className="w-8 h-8 rounded-full border-[3px] border-white bg-emerald-50 text-emerald-600 flex items-center justify-center z-10 shadow-sm ring-1 ring-slate-100 group-hover:scale-110 transition-transform">
                        <CheckCircle size={12} />
                      </div>
                    </div>
                    <div className="flex-1 bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group-hover:border-slate-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[12px] font-black text-slate-800">Assignment Accepted</h4>
                          <span className="inline-flex px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-bold tracking-widest uppercase">Accepted</span>
                          <span className="inline-flex px-1.5 py-0.5 bg-slate-50 text-slate-500 border border-slate-200 rounded text-[9px] font-bold tracking-widest uppercase">Assignments</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                          <Clock size={10} /> 01/07/2026 at 09:15 AM
                        </div>
                      </div>
                      <p className="text-[11px] font-medium text-slate-600 mb-3">Accepted load assignment LD-34288.</p>
                      <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-1.5"><User size={10} /> Performed by: <span className="text-slate-600">Mike Thompson (Driver)</span></div>
                        <div>ID: #1009</div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Item 10 */}
                  <div className="flex gap-4 group">
                    <div className="w-12 flex flex-col items-center shrink-0 hidden md:flex">
                      <div className="w-8 h-8 rounded-full border-[3px] border-white bg-emerald-50 text-emerald-600 flex items-center justify-center z-10 shadow-sm ring-1 ring-slate-100 group-hover:scale-110 transition-transform">
                        <ShieldCheck size={12} />
                      </div>
                    </div>
                    <div className="flex-1 bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group-hover:border-slate-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[12px] font-black text-slate-800">Licence Verified</h4>
                          <span className="inline-flex px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[9px] font-bold tracking-widest uppercase">Verified</span>
                          <span className="inline-flex px-1.5 py-0.5 bg-slate-50 text-slate-500 border border-slate-200 rounded text-[9px] font-bold tracking-widest uppercase">Compliance</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                          <Clock size={10} /> 25/06/2026 at 02:30 PM
                        </div>
                      </div>
                      <p className="text-[11px] font-medium text-slate-600 mb-3">Licence state NSW checked and verified with transport authority.</p>
                      <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-1.5"><User size={10} /> Performed by: <span className="text-slate-600">John Doe (Compliance Officer)</span></div>
                        <div>ID: #1010</div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Item 11 */}
                  <div className="flex gap-4 group">
                    <div className="w-12 flex flex-col items-center shrink-0 hidden md:flex">
                      <div className="w-8 h-8 rounded-full border-[3px] border-white bg-blue-50 text-blue-600 flex items-center justify-center z-10 shadow-sm ring-1 ring-slate-100 group-hover:scale-110 transition-transform">
                        <User size={12} />
                      </div>
                    </div>
                    <div className="flex-1 bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group-hover:border-slate-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[12px] font-black text-slate-800">Driver Status Changed</h4>
                          <span className="inline-flex px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded text-[9px] font-bold tracking-widest uppercase">Updated</span>
                          <span className="inline-flex px-1.5 py-0.5 bg-slate-50 text-slate-500 border border-slate-200 rounded text-[9px] font-bold tracking-widest uppercase">Status Changes</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                          <Clock size={10} /> 25/06/2026 at 07:30 AM
                        </div>
                      </div>
                      <p className="text-[11px] font-medium text-slate-600 mb-3">Updated active duty status from "Off Duty" to "On Duty" upon return from scheduled rest break.</p>
                      <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-1.5"><User size={10} /> Performed by: <span className="text-slate-600">Jane Doe (Dispatcher)</span></div>
                        <div>ID: #1011</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}
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
          </div>
          
          <div className="flex justify-between items-center mt-4 text-[10px] font-semibold text-slate-400">
             <span>All times shown in your local time (AEST)</span>
             <span>Data auto-refreshes every 5 minutes &orarr;</span>
          </div>

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
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-[28px] leading-none font-black text-slate-900 tracking-tight">4.1 Drivers List</h1>
            <p className="text-xs text-slate-500 font-medium mt-1.5">Manage all drivers, their details, compliance, assignments and performance.</p>
          </div>
          <button onClick={() => setShowAddDriver(true)} className="flex items-center gap-2 px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-sm font-bold transition-colors shadow-sm cursor-pointer">
            <UserPlus size={16} /> <span>Add Driver</span> <ChevronDown size={16} className="ml-1" />
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Users size={16} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 tracking-wide">Total Drivers</span>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">8</span>
                <span className="text-xs text-slate-500 font-medium">Active</span>
              </div>
              <p className="text-[10px] text-emerald-600 font-bold mt-1">↑ 2 this month</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Truck size={16} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 tracking-wide">On Duty</span>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">3</span>
                <span className="text-xs text-slate-500 font-medium">38%</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Currently assigned</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <Coffee size={16} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 tracking-wide">Off Duty</span>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">3</span>
                <span className="text-xs text-slate-500 font-medium">38%</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Not assigned</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                <Clock size={16} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 tracking-wide">On Leave</span>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">1</span>
                <span className="text-xs text-slate-500 font-medium">13%</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Approved leave</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                <AlertTriangle size={16} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 tracking-wide">Unavailable</span>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">1</span>
                <span className="text-xs text-slate-500 font-medium">13%</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Not available</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                <Calendar size={16} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 tracking-wide">Expiring Soon</span>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">2</span>
                <span className="text-xs text-slate-500 font-medium">Documents</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Next 30 days</p>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6 items-start">
          
          {/* Left Column - List */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
            
            {/* Filter Bar */}
            <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3 items-center justify-between">
              <div className="relative flex-grow max-w-sm">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, phone, licence..." 
                  className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex flex-col gap-0.5">
                   <label className="text-[9px] font-bold text-slate-400">Status</label>
                   <select 
                     value={statusFilter}
                     onChange={(e) => setStatusFilter(e.target.value)}
                     className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 outline-none w-24 cursor-pointer focus:border-purple-500"
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
                     className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 outline-none w-28 cursor-pointer focus:border-purple-500"
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
                     className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 outline-none w-28 cursor-pointer focus:border-purple-500"
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
                     className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 outline-none w-24 cursor-pointer focus:border-purple-500"
                   >
                     <option value="All">All</option>
                     <option value="Sydney">Sydney</option>
                     <option value="Melbourne">Melbourne</option>
                     <option value="Brisbane">Brisbane</option>
                     <option value="Adelaide">Adelaide</option>
                     <option value="Perth">Perth</option>
                   </select>
                </div>
                <div className="flex items-end h-full mt-[18px]">
                  <button className="flex items-center gap-1.5 bg-white border border-purple-200 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-purple-50 transition-colors cursor-pointer">
                    <Filter size={14} /> More Filters
                  </button>
                  <button onClick={handleResetFilters} className="bg-slate-50 text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors ml-2 cursor-pointer">
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left whitespace-nowrap min-w-max">
                <thead>
                  <tr className="bg-white border-b border-slate-100">
                    <th className="px-4 py-3 w-10"><input type="checkbox" className="rounded border-slate-300" /></th>
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-800">Driver</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-800">Employee ID</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-800">Phone</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-800">Licence Type / No.</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-800 text-center">Status</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-800">Branch</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-800">Current Assignment</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-800">Compliance</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-800 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDrivers.length > 0 ? filteredDrivers.map((driver) => (
                    <tr key={driver.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedDriver(driver)}>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded border-slate-300 cursor-pointer" /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={driver.avatar} alt={driver.name} className="w-8 h-8 rounded-full border border-slate-200" />
                          <div>
                            <p className="text-xs font-black text-slate-800">{driver.name}</p>
                            <p className="text-[10px] text-slate-500 font-medium">Age {driver.age}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-slate-700">{driver.id}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-slate-700">{driver.phone}</td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-bold text-slate-800">{driver.licence}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{driver.licenceNo}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(driver.status)}`}>
                          {driver.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-slate-700">{driver.branch}</td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-bold text-slate-800">{driver.assignmentId}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{driver.assignmentType}</p>
                      </td>
                      <td className="px-4 py-3">
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
                      <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button className="text-slate-400 hover:text-purple-600 transition-colors p-1 rounded-md hover:bg-purple-50 cursor-pointer">
                          <MoreVertical size={14} />
                        </button>
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
              <span>Showing 1 to {filteredDrivers.length} of {mockDrivers.length} drivers</span>
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
           <span>Data auto-refreshes every 5 minutes &orarr;</span>
        </div>

      </div>
    </div>
  );
}
