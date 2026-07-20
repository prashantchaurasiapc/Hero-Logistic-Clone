const fs = require('fs');
let file = fs.readFileSync('src/components/CompanyAdmin/AssetDetails.jsx', 'utf8');

// 1. Update imports
file = file.replace(/} from 'lucide-react';/, ", File as FileIcon, ChevronLeft, MoreVertical, Zap, Settings, ShieldAlert, Upload } from 'lucide-react';");

// 2. Add assetDocuments
const mockDocsCode = `
const assetDocuments = [
  { id: 1, name: 'Registration Certificate', file: 'AST-0001_REG.pdf', category: 'Registration', type: 'Registration', issueDate: '15 Mar 2022', expiryDate: '15 Mar 2027', status: 'Active', expiryStatus: 'Compliant', uploader: 'Sarah Mitchell', uploadDate: '15 Mar 2022' },
  { id: 2, name: 'Service & Maintenance Record', file: 'AST-0001_SRV.pdf', category: 'Maintenance', type: 'Service Record', issueDate: '24 May 2025', expiryDate: '24 Jun 2025', status: 'Active', expiryStatus: 'Expiring Soon', uploader: 'James Patel', uploadDate: '24 May 2025' },
  { id: 3, name: 'Annual Inspection Report', file: 'AST-0001_INSP.pdf', category: 'Inspection', type: 'Inspection Report', issueDate: '24 Aug 2024', expiryDate: '24 Aug 2025', status: 'Active', expiryStatus: 'Expiring Soon', uploader: 'Robert Taylor', uploadDate: '24 Aug 2024' },
  { id: 4, name: 'Operating Licence', file: 'AST-0001_LIC.pdf', category: 'Licence', type: 'Operating Licence', issueDate: '10 Jan 2022', expiryDate: '10 Jan 2026', status: 'Active', expiryStatus: 'Compliant', uploader: 'Sarah Mitchell', uploadDate: '10 Jan 2022' },
  { id: 5, name: 'Insurance Certificate', file: 'AST-0001_INS.pdf', category: 'Insurance', type: 'Insurance', issueDate: '01 Jan 2025', expiryDate: '01 Jan 2026', status: 'Active', expiryStatus: 'Compliant', uploader: 'Sarah Mitchell', uploadDate: '01 Jan 2025' },
  { id: 6, name: 'Load Test Certificate', file: 'AST-0001_LOAD.pdf', category: 'Compliance', type: 'Compliance Certificate', issueDate: '14 Feb 2024', expiryDate: '14 Feb 2025', status: 'Expired', expiryStatus: 'Expired', uploader: 'James Patel', uploadDate: '14 Feb 2024' },
  { id: 7, name: 'Manufacturer Manual', file: 'AST-0001_MAN.pdf', category: 'Other', type: 'Manual', issueDate: '10 Mar 2022', expiryDate: '-', status: 'Active', expiryStatus: 'Not Required', uploader: 'Sarah Mitchell', uploadDate: '10 Mar 2022' },
  { id: 8, name: 'Safety Compliance Checklist', file: 'AST-0001_CHK.pdf', category: 'Compliance', type: 'Checklist', issueDate: '20 May 2025', expiryDate: '-', status: 'Active', expiryStatus: 'Not Required', uploader: 'Robert Taylor', uploadDate: '20 May 2025' },
  { id: 9, name: 'Warranty Certificate', file: 'AST-0001_WTY.pdf', category: 'Warranty', type: 'Warranty', issueDate: '15 Mar 2022', expiryDate: '15 Mar 2023', status: 'Expired', expiryStatus: 'Expired', uploader: 'Sarah Mitchell', uploadDate: '15 Mar 2022' },
];

export default function AssetDetails`;
file = file.replace('export default function AssetDetails', mockDocsCode);

// 3. Add activeDocTab state
file = file.replace("const [activeTab, setActiveTab] = useState('Overview');", "const [activeTab, setActiveTab] = useState('Overview');\n  const [activeDocTab, setActiveDocTab] = useState('All Documents');");

// 4. Inject the Compliance & Documents tab code right before Specifications
const complianceCode = `
      {activeTab === 'Compliance & Documents' && (
        <div className="space-y-6">
          {/* Inner Navigation Tabs */}
          <div className="flex items-center gap-6 border-b border-slate-200 overflow-x-auto custom-scrollbar">
            {['All Documents', 'Compliance', 'Certificates & Licences', 'Insurance', 'Maintenance Records', 'Inspection Reports', 'Other Documents'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveDocTab(tab)}
                className={\`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap \${activeDocTab === tab ? 'text-purple-700 border-purple-700' : 'text-slate-500 border-transparent hover:text-slate-800'}\`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            
            {/* LEFT COLUMN: TABLE */}
            <div className="flex flex-col space-y-4">
              
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">ALL DOCUMENTS ({assetDocuments.length})</h3>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                {/* Table Header Controls */}
                <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3 items-center justify-between">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input type="text" placeholder="Search documents..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 outline-none focus:border-purple-500 w-48" />
                    </div>
                    
                    <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors bg-white">
                      All Categories <ChevronDown size={14} className="text-slate-400" />
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors bg-white">
                      All Status <ChevronDown size={14} className="text-slate-400" />
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors bg-white">
                      All Expiry Status <ChevronDown size={14} className="text-slate-400" />
                    </button>
                    
                    <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors bg-white">
                      <Filter size={14} /> Filters
                    </button>
                  </div>
                  
                  <button className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-[11px] font-bold hover:bg-purple-100 transition-colors">
                    <Upload size={14} /> Upload Document
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        <th className="px-5 py-4 text-[10px] font-black text-slate-800 uppercase tracking-wider">Document Name</th>
                        <th className="px-5 py-4 text-[10px] font-black text-slate-800 uppercase tracking-wider">Category</th>
                        <th className="px-5 py-4 text-[10px] font-black text-slate-800 uppercase tracking-wider">Document Type</th>
                        <th className="px-5 py-4 text-[10px] font-black text-slate-800 uppercase tracking-wider">Issue Date</th>
                        <th className="px-5 py-4 text-[10px] font-black text-slate-800 uppercase tracking-wider">Expiry Date</th>
                        <th className="px-5 py-4 text-[10px] font-black text-slate-800 uppercase tracking-wider">Status</th>
                        <th className="px-5 py-4 text-[10px] font-black text-slate-800 uppercase tracking-wider">Expiry Status</th>
                        <th className="px-5 py-4 text-[10px] font-black text-slate-800 uppercase tracking-wider">Uploaded By</th>
                        <th className="px-5 py-4 text-[10px] font-black text-slate-800 uppercase tracking-wider text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assetDocuments.map((doc, idx) => (
                        <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 text-purple-600 bg-purple-50 p-1.5 rounded"><FileIcon size={14} /></div>
                              <div>
                                <h4 className="text-[11px] font-bold text-slate-800">{doc.name}</h4>
                                <p className="text-[10px] font-medium text-slate-500 mt-0.5">{doc.file}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={\`text-[11px] font-bold \${doc.category === 'Registration' ? 'text-blue-600' : doc.category === 'Maintenance' ? 'text-indigo-600' : doc.category === 'Inspection' ? 'text-teal-600' : doc.category === 'Licence' ? 'text-emerald-600' : doc.category === 'Insurance' ? 'text-cyan-600' : doc.category === 'Compliance' ? 'text-purple-600' : doc.category === 'Warranty' ? 'text-rose-600' : 'text-slate-600'}\`}>
                              {doc.category}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-[11px] font-semibold text-slate-700">{doc.type}</td>
                          <td className="px-5 py-3.5 text-[11px] font-semibold text-slate-700">{doc.issueDate}</td>
                          <td className="px-5 py-3.5 text-[11px] font-semibold text-slate-700">{doc.expiryDate}</td>
                          <td className="px-5 py-3.5">
                            <span className={\`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase border \${doc.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}\`}>
                              {doc.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={\`text-[10px] font-bold \${doc.expiryStatus === 'Compliant' ? 'text-emerald-500' : doc.expiryStatus === 'Expiring Soon' ? 'text-amber-500' : doc.expiryStatus === 'Expired' ? 'text-rose-500' : 'text-slate-400'}\`}>
                              {doc.expiryStatus}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <h4 className="text-[11px] font-bold text-slate-800">{doc.uploader}</h4>
                            <p className="text-[10px] font-medium text-slate-500 mt-0.5">{doc.uploadDate}</p>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center justify-center gap-2">
                              <button className="text-slate-400 hover:text-slate-600 transition-colors p-1"><Eye size={14} /></button>
                              <button className="text-slate-400 hover:text-slate-600 transition-colors p-1"><Download size={14} /></button>
                              <button className="text-slate-400 hover:text-slate-600 transition-colors p-1"><MoreHorizontal size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination Footer */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium bg-slate-50/30">
                  <span>Showing 1 to {assetDocuments.length} of {assetDocuments.length} documents</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <button className="w-6 h-6 flex items-center justify-center rounded text-slate-400"><ChevronLeft size={14} /></button>
                      <button className="w-6 h-6 flex items-center justify-center rounded bg-purple-700 text-white font-bold">1</button>
                      <button className="w-6 h-6 flex items-center justify-center rounded text-slate-400"><ChevronRight size={14} /></button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700 text-[10px]">10 / page</span>
                      <ChevronDown size={14} className="text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: INSIGHTS & ALERTS */}
            <div className="space-y-6">
              
              {/* Compliance Overview */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Compliance Overview</h3>
                  <button className="text-[10px] font-bold text-purple-600 hover:text-purple-700 transition-colors">View Report &rarr;</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white border border-emerald-100 rounded-xl p-3 flex flex-col shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100"><CheckCircle2 size={12} /></div>
                      <span className="text-lg font-black text-slate-800">6</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Compliant</span>
                  </div>
                  <div className="bg-white border border-amber-100 rounded-xl p-3 flex flex-col shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100"><ShieldAlert size={12} /></div>
                      <span className="text-lg font-black text-slate-800">1</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Expiring Soon</span>
                  </div>
                  <div className="bg-white border border-rose-100 rounded-xl p-3 flex flex-col shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100"><AlertTriangle size={12} /></div>
                      <span className="text-lg font-black text-slate-800">1</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Expired</span>
                  </div>
                  <div className="bg-white border border-blue-100 rounded-xl p-3 flex flex-col shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100"><RefreshCw size={12} /></div>
                      <span className="text-lg font-black text-slate-800">2</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Not Required</span>
                  </div>
                </div>
              </div>

              {/* Next Expiry */}
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3">Next Expiry</h3>
                <div className="bg-white border border-amber-200 rounded-xl p-4 flex items-center justify-between shadow-sm shadow-amber-100/50">
                  <div className="flex items-center gap-3">
                    <div className="text-amber-500"><Calendar size={20} /></div>
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-800">Service & Maintenance</h4>
                      <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Due: 24 Jun 2025</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-black text-amber-600">in 18 days</span>
                </div>
                <div className="mt-2 text-right">
                  <button className="text-[10px] font-bold text-purple-600 hover:text-purple-700 transition-colors">View All Alerts &rarr;</button>
                </div>
              </div>

              {/* Compliance Alerts */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Compliance Alerts</h3>
                  <button className="text-[10px] font-bold text-purple-600 hover:text-purple-700 transition-colors">View All &rarr;</button>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-amber-50/50">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-amber-500"><AlertTriangle size={14} /></div>
                      <div>
                        <h4 className="text-[11px] font-bold text-slate-800">Service & Maintenance</h4>
                        <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Due in 18 days</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-700">24 Jun 2025</span>
                  </div>
                  <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-amber-50/30">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-amber-500"><AlertTriangle size={14} /></div>
                      <div>
                        <h4 className="text-[11px] font-bold text-slate-800">Annual Inspection Report</h4>
                        <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Due in 61 days</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-700">24 Aug 2025</span>
                  </div>
                  <div className="p-4 flex items-center justify-between bg-rose-50/50">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-rose-500"><ShieldAlert size={14} /></div>
                      <div>
                        <h4 className="text-[11px] font-bold text-rose-700">Load Test Certificate</h4>
                        <p className="text-[10px] font-semibold text-rose-500 mt-0.5">Expired 131 days</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-rose-700">14 Feb 2025</span>
                  </div>
                </div>
              </div>

              {/* Document Categories */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Document Categories</h3>
                  <button className="text-[10px] font-bold text-purple-600 hover:text-purple-700 transition-colors">View All &rarr;</button>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-2">
                  <div className="flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <FileIcon size={14} className="text-blue-500" />
                      <span className="text-[11px] font-bold text-slate-700">Registration</span>
                    </div>
                    <span className="text-[11px] font-black text-slate-800">1</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <FileIcon size={14} className="text-indigo-500" />
                      <span className="text-[11px] font-bold text-slate-700">Maintenance</span>
                    </div>
                    <span className="text-[11px] font-black text-slate-800">1</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <FileIcon size={14} className="text-teal-500" />
                      <span className="text-[11px] font-bold text-slate-700">Inspection</span>
                    </div>
                    <span className="text-[11px] font-black text-slate-800">1</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <FileIcon size={14} className="text-emerald-500" />
                      <span className="text-[11px] font-bold text-slate-700">Licence</span>
                    </div>
                    <span className="text-[11px] font-black text-slate-800">1</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <FileIcon size={14} className="text-cyan-500" />
                      <span className="text-[11px] font-bold text-slate-700">Insurance</span>
                    </div>
                    <span className="text-[11px] font-black text-slate-800">1</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <FileIcon size={14} className="text-purple-500" />
                      <span className="text-[11px] font-bold text-slate-700">Compliance</span>
                    </div>
                    <span className="text-[11px] font-black text-slate-800">2</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <FileIcon size={14} className="text-rose-500" />
                      <span className="text-[11px] font-bold text-slate-700">Warranty</span>
                    </div>
                    <span className="text-[11px] font-black text-slate-800">1</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border-t border-slate-100 mt-1">
                    <div className="flex items-center gap-3">
                      <FileIcon size={14} className="text-slate-400" />
                      <span className="text-[11px] font-bold text-slate-700">Other</span>
                    </div>
                    <span className="text-[11px] font-black text-slate-800">1</span>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      )}
`;
file = file.replace("{activeTab === 'Specifications' && (", complianceCode + "\n      {activeTab === 'Specifications' && (");

fs.writeFileSync('src/components/CompanyAdmin/AssetDetails.jsx', file, 'utf8');
