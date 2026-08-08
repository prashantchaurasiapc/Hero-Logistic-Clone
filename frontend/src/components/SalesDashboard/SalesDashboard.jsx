import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, ChevronDown, Plus, Mail, Phone, Calendar, 
  Activity, ArrowRight, Check, X, User, Star, Clock,
  Play, Send, UserPlus
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell 
} from 'recharts';
import { 
  getSalesDashboardSummary, 
  updateLead, 
  createDemoBooking, 
  createProposal, 
  createFollowUpTask, 
  updateFollowUpTask, 
  createSalesActivity, 
  convertLeadToCompany 
} from '../../services/api';

export default function SalesDashboard() {
  const navigate = useNavigate();
  const [salesRep, setSalesRep] = useState('Alex Wright');
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [leads, setLeads] = useState([]);
  const [kpis, setKpis] = useState({
    newLeads: 0,
    demosBooked: 0,
    trialsActive: 0,
    proposalsSent: 0,
    dealsWon: 0,
    dealsLost: 0,
    pipelineValue: 0
  });
  const [stages, setStages] = useState([]);
  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [conversionData, setConversionData] = useState([]);
  
  // Modals state
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [showRecommendModal, setShowRecommendModal] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [showMailModal, setShowMailModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showConvertButton, setShowConvertButton] = useState(false);
  const [showConversionWizard, setShowConversionWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Professional');
  const [toastMessage, setToastMessage] = useState('');
  const [quickNote, setQuickNote] = useState('');

  // Modals form data
  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    type: 'Phone Call',
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM',
    priority: 'High'
  });

  const [newDemoForm, setNewDemoForm] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM EST',
    agenda: 'Walkthrough showcasing fleet telematics and factoring automation.'
  });

  const [newProposalForm, setNewProposalForm] = useState({
    title: 'Hero Logistics SaaS License - Proposal',
    value: 2004,
    discount: 0,
    validity: 30
  });

  const [newMailForm, setNewMailForm] = useState({
    subject: 'Welcome Sandbox Invite',
    body: 'Hi Robert,\n\nWe would love to invite you to test our Hero Logistics OS sandbox.'
  });

  const [newCallForm, setNewCallForm] = useState({
    duration: '2m 15s',
    outcome: 'Connected',
    notes: 'Prospect interested in scheduling a live software walk-through.'
  });

  const [newScheduleForm, setNewScheduleForm] = useState({
    type: '📞 Phone Call',
    priority: '🟡 Medium',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    notes: 'Urgent follow-up touchpoint.'
  });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchDashboardData = async () => {
    try {
      const response = await getSalesDashboardSummary();
      if (response.data?.success) {
        const { kpis, stages, monthlyData, conversionData, recentActivities, tasks, leadsList } = response.data.data;
        setKpis(kpis);
        setStages(stages);
        setMonthlyData(monthlyData);
        setConversionData(conversionData);
        setActivities(recentActivities);
        setTasks(tasks);
        setLeads(leadsList);
        
        if (leadsList && leadsList.length > 0 && !selectedLeadId) {
          setSelectedLeadId(leadsList[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const selectedLeadObj = leads.find(l => l.id === selectedLeadId) || null;

  useEffect(() => {
    if (selectedLeadObj) {
      setShowConvertButton(selectedLeadObj.stage === 'WON');
    }
  }, [selectedLeadId, leads]);

  const handleUpdateLeadStage = async (newStage) => {
    if (!selectedLeadObj) return;
    try {
      const res = await updateLead(selectedLeadObj.id, { stage: newStage });
      if (res.data?.success) {
        triggerToast(`Lead stage updated to ${newStage}!`);
        await createSalesActivity({
          leadId: selectedLeadObj.id,
          title: `Stage Changed to ${newStage}`,
          description: `Rep updated stage in details workspace.`
        });
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error updating stage:', error);
      triggerToast('Failed to update stage.');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!selectedLeadObj) return;
    try {
      const res = await createFollowUpTask({
        leadId: selectedLeadObj.id,
        repId: selectedLeadObj.repId || 'system',
        type: newTaskForm.type,
        description: `${newTaskForm.title} (${newTaskForm.priority} Priority)`,
        dueDate: new Date(newTaskForm.date + 'T' + '12:00:00')
      });
      if (res.data?.success) {
        triggerToast('New task added successfully!');
        setShowAddTaskModal(false);
        setNewTaskForm({
          title: '',
          type: 'Phone Call',
          date: new Date().toISOString().split('T')[0],
          time: '11:00 AM',
          priority: 'High'
        });
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const toggleTaskCompleted = async (taskId, currentCompleted) => {
    try {
      const res = await updateFollowUpTask(taskId, {
        status: currentCompleted ? 'PENDING' : 'COMPLETED'
      });
      if (res.data?.success) {
        triggerToast(currentCompleted ? 'Task marked incomplete' : 'Task marked completed');
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleBookDemo = async () => {
    if (!selectedLeadObj) return;
    try {
      const res = await createDemoBooking({
        leadId: selectedLeadObj.id,
        presenterId: selectedLeadObj.repId || 'system',
        scheduledAt: new Date(newDemoForm.date + 'T12:00:00'),
        status: 'UPCOMING',
        meetingLink: 'https://zoom.us/j/987654321',
        feedback: newDemoForm.agenda
      });
      if (res.data?.success) {
        await handleUpdateLeadStage('DEMO_BOOKED');
        setShowDemoModal(false);
        triggerToast('Demo booked successfully!');
      }
    } catch (error) {
      console.error('Error booking demo:', error);
    }
  };

  const handleSendProposal = async () => {
    if (!selectedLeadObj) return;
    try {
      const res = await createProposal({
        proposalRef: `PROP-${Math.floor(100 + Math.random() * 900)}`,
        leadId: selectedLeadObj.id,
        baseValue: Number(newProposalForm.value),
        discountAmount: Number(newProposalForm.discount),
        finalValue: Number(newProposalForm.value) - Number(newProposalForm.discount),
        validityDays: Number(newProposalForm.validity),
        status: 'SENT',
        includedModules: JSON.stringify(['Real-Time GPS', 'Driver Portal'])
      });
      if (res.data?.success) {
        await handleUpdateLeadStage('PROPOSAL_SENT');
        setShowProposalModal(false);
        triggerToast('Proposal dispatched successfully!');
      }
    } catch (error) {
      console.error('Error sending proposal:', error);
    }
  };

  const handleQuickNote = async () => {
    if (!selectedLeadObj || !quickNote.trim()) return;
    try {
      const res = await createSalesActivity({
        leadId: selectedLeadObj.id,
        title: 'Note Logged',
        description: quickNote
      });
      if (res.data?.success) {
        setQuickNote('');
        triggerToast('Note logged successfully!');
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error logging note:', error);
    }
  };

  const handleProvisionWorkspace = async () => {
    if (!selectedLeadObj) return;
    setIsProvisioning(true);
    try {
      const res = await convertLeadToCompany(selectedLeadObj.id, {
        selectedPlan
      });
      if (res.data?.success) {
        setIsProvisioning(false);
        setWizardStep(6);
      }
    } catch (error) {
      console.error('Error provisioning company:', error);
      setIsProvisioning(false);
      triggerToast('Workspace provisioning failed.');
    }
  };

  return (
    <div className="flex-grow bg-[#F8FAFC] p-6 space-y-6 w-full text-left font-sans custom-scrollbar overflow-y-auto relative">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[9999] bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <Check className="text-emerald-400 w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">
            Sales Dashboard
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Manage leads, pipeline, and sales reports.
          </p>
        </div>
      </div>

      {/* KPI Row Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-3 pb-1">
        {[
          { label: 'NEW LEADS', value: kpis.newLeads, sub: 'New Leads', subColor: 'text-amber-600 bg-amber-50' },
          { label: 'DEMOS BOOKED', value: kpis.demosBooked, sub: 'Slots Active', subColor: 'text-indigo-600 bg-indigo-50' },
          { label: 'TRIALS ACTIVE', value: kpis.trialsActive, sub: 'Active Trials', subColor: 'text-emerald-600 bg-emerald-50' },
          { label: 'PROPOSALS SENT', value: kpis.proposalsSent, sub: 'Awaiting Sign', subColor: 'text-slate-600 bg-slate-100' },
          { label: 'DEALS WON', value: kpis.dealsWon, sub: 'Closed Won', subColor: 'text-emerald-600 bg-emerald-50' },
          { label: 'DEALS LOST', value: kpis.dealsLost, sub: 'Closed Lost', subColor: 'text-rose-600 bg-rose-50' },
          { label: 'PIPELINE VALUE', value: `$${kpis.pipelineValue.toLocaleString()}`, sub: 'Potential Value', subColor: 'text-emerald-600 bg-emerald-50' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-3xs hover:shadow-2xs transition-all flex flex-col justify-between h-[96px]">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate" title={kpi.label}>
                {kpi.label}
              </p>
              <h3 className="text-xl font-extrabold text-slate-900 mt-0.5 tracking-tight">{kpi.value}</h3>
            </div>
            <div className="flex items-center justify-between gap-1 mt-1">
              <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold truncate ${kpi.subColor}`}>
                {kpi.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Workspaces */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stage Distribution Matrix */}
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[11px] font-black text-amber-500 uppercase tracking-widest">PIPELINE STAGE DISTRIBUTION MATRIX</h3>
              <span className="text-[10px] font-extrabold text-slate-500">{leads.length} Leads Active</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {stages.map((stg, i) => (
                <div key={i} className="flex-shrink-0 w-[100px] bg-white border border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center relative">
                  <span className="text-[9px] font-black text-slate-400 uppercase text-center mb-1">{stg.name}</span>
                  <span className="text-base font-black text-slate-800">{stg.count}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute bottom-2 left-2"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Details Workspace */}
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm relative">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-[11px] font-black text-amber-500 uppercase tracking-widest">SELECTED LEAD DETAILS WORKSPACE</h3>
                <div className="relative">
                  <select 
                    value={selectedLeadId}
                    onChange={(e) => setSelectedLeadId(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 text-slate-800 font-bold text-xs py-1.5 pl-3 pr-8 rounded-lg outline-none cursor-pointer"
                  >
                    {leads.map(lead => (
                      <option key={lead.id} value={lead.id}>
                        {lead.companyName} ({lead.contactName})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2 pointer-events-none" />
                </div>
              </div>
              {selectedLeadObj && (
                <span className={`text-[10px] font-black px-3.5 py-1.5 rounded-lg border uppercase transition-all shadow-3xs text-amber-600 bg-amber-50 border-amber-200`}>
                  {selectedLeadObj.stage}
                </span>
              )}
            </div>

            {selectedLeadObj ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">FLEET SIZE</p>
                    <p className="text-xs font-extrabold text-slate-900">{selectedLeadObj.fleetSize || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">TRANSPORT NICHE</p>
                    <p className="text-xs font-extrabold text-slate-900">{selectedLeadObj.transportNiche || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">CURRENT SOFTWARE</p>
                    <p className="text-xs font-extrabold text-slate-900">{selectedLeadObj.currentSoftware || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">ESTIMATED VALUE</p>
                    <p className="text-xs font-extrabold text-amber-500">${(selectedLeadObj.estimatedValue || 0).toLocaleString()}/mo</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">CORE PAIN POINTS</p>
                    <p className="text-xs font-semibold text-slate-700 italic">"{selectedLeadObj.painPoints || 'No pain points logged.'}"</p>
                  </div>
                  <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 flex justify-between items-center">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">PROSPECT EMAIL / CONTACT</p>
                      <p className="text-xs font-extrabold text-slate-900">{selectedLeadObj.email}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-3">CRM DIRECT DISPATCH ACTIONS</p>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-xl">
                      <User className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-[11px] font-bold text-slate-500">Rep:</span>
                      <select 
                        value={salesRep}
                        onChange={(e) => setSalesRep(e.target.value)}
                        className="text-[11px] font-extrabold text-slate-900 outline-none bg-transparent cursor-pointer pl-1 pr-4 appearance-none relative"
                      >
                        <option>Alex Wright</option>
                        <option>Sarah Connor</option>
                      </select>
                    </div>
                    <button onClick={() => setShowRecommendModal(true)} className="bg-[#4B0082] text-white text-[10px] font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 hover:bg-purple-900 transition-all cursor-pointer active:scale-95">
                      <Star className="w-3.5 h-3.5" /> Recommend Plan
                    </button>
                    <button onClick={() => setShowDemoModal(true)} className="bg-[#ffcc00] text-black text-[10px] font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 hover:bg-[#e6b800] transition-all cursor-pointer active:scale-95">
                      <Calendar className="w-3.5 h-3.5" /> Book Demo
                    </button>
                    <button onClick={() => setShowTrialModal(true)} className="bg-slate-800 text-white text-[10px] font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 hover:bg-slate-900 transition-all cursor-pointer active:scale-95">
                      <Play className="w-3.5 h-3.5" fill="currentColor" /> Start Trial
                    </button>
                    <button onClick={() => setShowProposalModal(true)} className="bg-white border border-slate-200 text-slate-700 text-[10px] font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 hover:bg-slate-50 transition-all cursor-pointer active:scale-95">
                      <Send className="w-3.5 h-3.5" /> Send Proposal
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <button 
                      onClick={() => handleUpdateLeadStage('WON')}
                      className="bg-[#0F9D58] text-white text-[10px] font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-[#0b8043] shadow-sm transition-all cursor-pointer active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" /> Mark Won
                    </button>
                    <button 
                      onClick={() => handleUpdateLeadStage('LOST')}
                      className="bg-[#990000] text-white text-[10px] font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-[#800000] shadow-sm transition-all cursor-pointer active:scale-95"
                    >
                      <X className="w-3.5 h-3.5" /> Mark Lost
                    </button>
                    {showConvertButton && (
                      <button 
                        onClick={() => {
                          setWizardStep(1);
                          setShowConversionWizard(true);
                        }}
                        className="bg-[#E68A00] text-white text-[10px] font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 hover:bg-[#cc7a00] shadow-sm transition-all cursor-pointer active:scale-95"
                      >
                        <UserPlus className="w-3.5 h-3.5" /> Convert to Company
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setShowMailModal(true)}
                      title="Send Email"
                      className="p-2.5 border border-slate-200 rounded-xl text-blue-500 hover:bg-blue-50 hover:border-blue-300 transition-all"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setShowCallModal(true)}
                      title="Log Phone Call"
                      className="p-2.5 border border-slate-200 rounded-xl text-green-500 hover:bg-green-50 hover:border-green-300 transition-all"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setShowScheduleModal(true)}
                      title="Schedule Follow-up"
                      className="p-2.5 border border-slate-200 rounded-xl text-amber-500 hover:bg-amber-50 hover:border-amber-300 transition-all"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                    <input 
                      type="text" 
                      placeholder="Quick write note and press Enter..." 
                      value={quickNote}
                      onChange={e => setQuickNote(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleQuickNote();
                      }}
                      className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm font-semibold text-slate-400 text-center py-12">No active leads found.</p>
            )}
          </div>
        </div>

        {/* Right Column - Tasks & Timeline */}
        <div className="space-y-6">
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">UPCOMING FOLLOW-UP TASKS ({tasks.length})</h3>
              <button 
                onClick={() => setShowAddTaskModal(true)} 
                className="text-[9px] font-black border border-amber-500 bg-amber-50 rounded-lg px-2.5 py-1 text-amber-600 uppercase hover:bg-amber-100 transition-all cursor-pointer shadow-3xs active:scale-95"
              >
                + ADD TASK
              </button>
            </div>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {tasks.length === 0 ? (
                <p className="text-xs text-slate-400 font-medium py-4 text-center">No upcoming tasks.</p>
              ) : (
                tasks.map((t) => (
                  <div 
                    key={t.id} 
                    className={`border rounded-2xl p-4 relative group transition-all bg-white hover:border-amber-300 shadow-3xs ${
                      t.completed ? 'border-emerald-200 bg-emerald-50/20 opacity-70' : 'border-slate-200'
                    }`}
                  >
                    <div className="absolute right-4 top-4">
                      <button 
                        onClick={() => toggleTaskCompleted(t.id, t.completed)}
                        className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                          t.completed 
                            ? 'bg-emerald-500 border-emerald-500 text-white' 
                            : 'border-slate-300 text-slate-300 hover:border-emerald-400 hover:text-emerald-500'
                        }`}
                        title={t.completed ? "Mark Incomplete" : "Mark Completed"}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`text-xs font-black text-slate-900 ${t.completed ? 'line-through text-slate-400' : ''}`}>{t.company}</h4>
                      {t.status === 'OVERDUE' && !t.completed && (
                        <span className="text-[9px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded uppercase">Overdue</span>
                      )}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 mb-1.5">Due: {new Date(t.due).toLocaleDateString()}</p>
                    <p className={`text-[11px] font-semibold text-amber-700 leading-snug ${t.completed ? 'line-through text-slate-400' : ''}`}>{t.task}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Activity Timeline Card */}
          <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">RECENT ACTIVITY TIMELINE</h3>
              <Activity className="w-4 h-4 text-amber-500" />
            </div>

            <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="relative border-l-2 border-slate-200 ml-2 space-y-5 py-1">
                {activities.map((act, idx) => (
                  <div key={idx} className="relative pl-5 group text-left">
                    <div className={`absolute w-2.5 h-2.5 bg-indigo-500 rounded-full -left-[6px] top-1 border-2 border-white group-hover:scale-125 transition-transform`}></div>
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <h4 className="text-[11px] font-black text-slate-900">{act.title}</h4>
                      <span className="text-[9px] font-bold text-slate-400 shrink-0">{new Date(act.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[10px] font-semibold text-slate-600 mb-1 leading-snug">{act.desc}</p>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">
                      USER: {act.user}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-xs font-black text-slate-900">Monthly Sales Analytics</h3>
            <p className="text-[10px] font-medium text-slate-500">Pipeline growth performance forecast.</p>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ r: 0 }}
                  activeDot={{ r: 6, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-xs font-black text-slate-900">Conversion Rate Chart</h3>
            <p className="text-[10px] font-medium text-slate-500">Funnel efficiency progression across stages.</p>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: '#F8FAFC'}} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {conversionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Create New Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-[550px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Create New Task</h2>
              <button 
                onClick={() => setShowAddTaskModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateTask} className="p-6 space-y-5">
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
                  Task Title / Description
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Schedule onboarding follow-up"
                  value={newTaskForm.title}
                  onChange={e => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-400 transition-colors placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
                    Task Type
                  </label>
                  <select 
                    value={newTaskForm.type}
                    onChange={e => setNewTaskForm({ ...newTaskForm, type: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-400 transition-colors bg-white cursor-pointer"
                  >
                    <option>Phone Call</option>
                    <option>Email Touchpoint</option>
                    <option>Product Demo</option>
                    <option>Meeting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
                    Due Date
                  </label>
                  <input 
                    type="date" 
                    required
                    value={newTaskForm.date}
                    onChange={e => setNewTaskForm({ ...newTaskForm, date: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
                    Priority
                  </label>
                  <select 
                    value={newTaskForm.priority}
                    onChange={e => setNewTaskForm({ ...newTaskForm, priority: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-400 transition-colors bg-white cursor-pointer"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#ffcc00] hover:bg-[#e6b800] text-black font-extrabold text-xs py-3.5 rounded-xl shadow-[0_4px_15px_rgba(255,204,0,0.4)] transition-all mt-2 cursor-pointer active:scale-95"
              >
                CREATE & ADD TO TASKS LIST
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Schedule ZOOM Product Walkthrough Modal */}
      {showDemoModal && selectedLeadObj && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-visible animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100">
              <h2 className="text-[17px] font-black text-slate-900">Schedule ZOOM Product Walkthrough</h2>
              <button onClick={() => setShowDemoModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-[13px] font-semibold text-slate-500">Locking a demo schedule for {selectedLeadObj.companyName}.</p>
              
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">SELECT DATE</label>
                <input 
                  type="date" 
                  value={newDemoForm.date} 
                  onChange={e => setNewDemoForm({ ...newDemoForm, date: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-brand-500" 
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">SELECT TIME BLOCK</label>
                <select 
                  value={newDemoForm.time}
                  onChange={e => setNewDemoForm({ ...newDemoForm, time: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-brand-500 bg-white"
                >
                  <option>11:00 AM EST</option>
                  <option>1:00 PM EST</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">MEETING AGENDA / HOST NOTES</label>
                <textarea 
                  rows="2" 
                  value={newDemoForm.agenda}
                  onChange={e => setNewDemoForm({ ...newDemoForm, agenda: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-brand-500 resize-none"
                ></textarea>
              </div>

              <div className="pt-2">
                <button 
                  onClick={handleBookDemo} 
                  className="w-full bg-[#FFB020] hover:bg-brand-600 text-slate-900 font-extrabold text-[13px] py-3.5 rounded-xl shadow-[0_4px_15px_rgba(255,176,32,0.4)] transition-all cursor-pointer active:scale-95"
                >
                  Confirm Zoom Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Start Trial Modal */}
      {showTrialModal && selectedLeadObj && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                  <Play size={16} fill="currentColor" />
                </div>
                <h2 className="text-base font-black text-slate-900">Start Platform Trial</h2>
              </div>
              <button onClick={() => setShowTrialModal(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <p className="text-xs font-semibold text-slate-500">
                Activating free trial access for <strong className="text-slate-900">{selectedLeadObj.companyName}</strong>.
              </p>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">TRIAL DURATION</label>
                <select className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-400 bg-white cursor-pointer">
                  <option>14 Days Free Trial</option>
                  <option>30 Days Extended Trial</option>
                </select>
              </div>

              <button 
                onClick={() => {
                  handleUpdateLeadStage('TRIAL_STARTED');
                  setShowTrialModal(false);
                }} 
                className="w-full bg-slate-900 hover:bg-black text-white font-extrabold text-xs py-3.5 rounded-xl shadow-sm transition-all cursor-pointer active:scale-95"
              >
                ACTIVATE FREE TRIAL NOW
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Issue Proposal Modal */}
      {showProposalModal && selectedLeadObj && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-visible animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100">
              <h2 className="text-[17px] font-black text-slate-900">Issue Licensing Agreement Proposal</h2>
              <button onClick={() => setShowProposalModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">PROPOSAL TITLE DOCUMENT</label>
                <input 
                  type="text" 
                  value={newProposalForm.title} 
                  onChange={e => setNewProposalForm({ ...newProposalForm, title: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-brand-500" 
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">BASE VALUE ($)</label>
                  <input 
                    type="number" 
                    value={newProposalForm.value} 
                    onChange={e => setNewProposalForm({ ...newProposalForm, value: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-brand-500" 
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">DISCOUNT AMOUNT ($)</label>
                  <input 
                    type="number" 
                    value={newProposalForm.discount} 
                    onChange={e => setNewProposalForm({ ...newProposalForm, discount: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-brand-500" 
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={handleSendProposal} 
                  className="w-full bg-[#FFB020] hover:bg-brand-600 text-slate-900 font-extrabold text-[13px] py-3.5 rounded-xl shadow-[0_4px_15px_rgba(255,176,32,0.4)] transition-all"
                >
                  Dispatched Proposal Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Plan Modal */}
      {showRecommendModal && selectedLeadObj && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100 shrink-0">
              <h2 className="text-[16px] font-black text-slate-900">Interactive License Tier Recommendation</h2>
              <button onClick={() => setShowRecommendModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="mb-6 text-left">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">LEAD DIAGNOSIS</p>
                <h3 className="text-[17px] font-black text-slate-800 mb-1">{selectedLeadObj.companyName}</h3>
                <p className="text-[13px] font-medium text-slate-500">Fleet Size: <span className="text-slate-700 font-bold">{selectedLeadObj.fleetSize}</span> &bull; Current Software: <span className="text-slate-700 font-bold">{selectedLeadObj.currentSoftware}</span></p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { name: 'Starter', price: 199, details: 'For small operators < 35 trucks' },
                  { name: 'Professional', price: 499, details: 'For growing fleets 35 - 100 trucks' },
                  { name: 'Enterprise', price: 1299, details: 'For logistics giants > 100 trucks' }
                ].map(p => (
                  <div key={p.name} className="border border-slate-200 rounded-2xl p-5 flex flex-col justify-between text-left">
                    <div>
                      <h4 className="text-[15px] font-black text-slate-750 mb-1.5">{p.name}</h4>
                      <p className="text-[11px] font-medium text-slate-400 leading-tight mb-4">{p.details}</p>
                      <span className="text-2xl font-black text-slate-900">${p.price}/mo</span>
                    </div>
                    <button 
                      onClick={async () => {
                        await updateLead(selectedLeadObj.id, { estimatedValue: p.price });
                        setShowRecommendModal(false);
                        triggerToast(`Recommended ${p.name} tier!`);
                        fetchDashboardData();
                      }}
                      className="w-full bg-brand-500 hover:bg-[#FACC15] text-slate-900 font-black text-[11px] py-3 mt-4 rounded-xl uppercase transition-all"
                    >
                      Apply {p.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Email Modal */}
      {showMailModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[500px] shadow-2xl overflow-hidden">
            <div className="px-6 py-5 flex justify-between items-center">
              <h2 className="text-[18px] font-bold text-slate-900">Compose Email Touchpoint</h2>
              <button onClick={() => setShowMailModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 pb-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">EMAIL SUBJECT</label>
                <input
                  type="text"
                  value={newMailForm.subject}
                  onChange={e => setNewMailForm({ ...newMailForm, subject: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[13px] font-semibold text-slate-700">Message Body</label>
                <textarea
                  rows={6}
                  value={newMailForm.body}
                  onChange={e => setNewMailForm({ ...newMailForm, body: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-medium text-slate-700 focus:outline-none"
                />
              </div>

              <button
                onClick={async () => {
                  if (selectedLeadObj) {
                    await createSalesActivity({
                      leadId: selectedLeadObj.id,
                      title: 'Email Sent',
                      description: `Subject: ${newMailForm.subject}`
                    });
                    setShowMailModal(false);
                    triggerToast('Email logged successfully!');
                    fetchDashboardData();
                  }
                }}
                className="bg-[#FFB020] hover:bg-brand-600 text-slate-900 font-extrabold text-[14px] w-full py-3 rounded-xl shadow-sm transition-all"
              >
                Send Email Touchpoint
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Phone Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[500px] shadow-2xl overflow-hidden">
            <div className="px-6 py-5 flex justify-between items-center">
              <h2 className="text-[18px] font-bold text-slate-900">Log Phone Call</h2>
              <button onClick={() => setShowCallModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 pb-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">CALL DURATION</label>
                  <input
                    type="text"
                    value={newCallForm.duration}
                    onChange={e => setNewCallForm({ ...newCallForm, duration: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">OUTCOME</label>
                  <select 
                    value={newCallForm.outcome}
                    onChange={e => setNewCallForm({ ...newCallForm, outcome: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 bg-white"
                  >
                    <option>Connected</option>
                    <option>No Answer</option>
                    <option>Voicemail</option>
                    <option>Busy</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">CALL NOTES</label>
                <input
                  type="text"
                  value={newCallForm.notes}
                  onChange={e => setNewCallForm({ ...newCallForm, notes: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none"
                />
              </div>

              <button
                onClick={async () => {
                  if (selectedLeadObj) {
                    await createSalesActivity({
                      leadId: selectedLeadObj.id,
                      title: 'Phone Call Logged',
                      description: `Duration: ${newCallForm.duration}. Outcome: ${newCallForm.outcome}. Notes: ${newCallForm.notes}`
                    });
                    setShowCallModal(false);
                    triggerToast('Phone call logged successfully!');
                    fetchDashboardData();
                  }
                }}
                className="w-full bg-[#FFB020] hover:bg-brand-600 text-slate-900 font-extrabold text-[14px] py-3.5 rounded-xl shadow-sm transition-all"
              >
                Save Call Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Follow-up / Calendar Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[500px] shadow-2xl overflow-hidden">
            <div className="px-6 py-5 flex justify-between items-center">
              <h2 className="text-[18px] font-bold text-slate-900">Schedule Follow-Up Touchpoint</h2>
              <button onClick={() => setShowScheduleModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 pb-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">TYPE</label>
                  <select 
                    value={newScheduleForm.type}
                    onChange={e => setNewScheduleForm({ ...newScheduleForm, type: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 bg-white"
                  >
                    <option>📞 Phone Call</option>
                    <option>✉️ Email</option>
                    <option>📅 Meeting</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">PRIORITY</label>
                  <select 
                    value={newScheduleForm.priority}
                    onChange={e => setNewScheduleForm({ ...newScheduleForm, priority: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 bg-white"
                  >
                    <option>🔴 High</option>
                    <option>🟡 Medium</option>
                    <option>🟢 Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">TARGET DATE</label>
                  <input
                    type="date"
                    value={newScheduleForm.date}
                    onChange={e => setNewScheduleForm({ ...newScheduleForm, date: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">TIME SLOT</label>
                  <input
                    type="text"
                    value={newScheduleForm.time}
                    onChange={e => setNewScheduleForm({ ...newScheduleForm, time: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">FOLLOW-UP MEMO</label>
                <input
                  type="text"
                  value={newScheduleForm.notes}
                  onChange={e => setNewScheduleForm({ ...newScheduleForm, notes: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none"
                />
              </div>

              <button
                onClick={async () => {
                  if (selectedLeadObj) {
                    await createFollowUpTask({
                      leadId: selectedLeadObj.id,
                      repId: selectedLeadObj.repId || 'system',
                      type: newScheduleForm.type,
                      description: `${newScheduleForm.notes} (Priority: ${newScheduleForm.priority})`,
                      dueDate: new Date(newScheduleForm.date + 'T' + '12:00:00')
                    });
                    setShowScheduleModal(false);
                    triggerToast('Follow-up scheduled successfully!');
                    fetchDashboardData();
                  }
                }}
                className="w-full bg-[#FFB020] hover:bg-brand-600 text-slate-900 font-extrabold text-[14px] py-3.5 rounded-xl shadow-sm transition-all"
              >
                Schedule Follow-Up Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Company Conversion Wizard */}
      {showConversionWizard && selectedLeadObj && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[600px] shadow-2xl overflow-hidden">
            <div className="px-6 py-5 flex justify-between items-center border-b border-slate-100">
              <h2 className="text-[18px] font-bold text-slate-900">Company Conversion Wizard</h2>
              <button onClick={() => setShowConversionWizard(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 text-[11px] font-bold">
              {[
                { num: 1, label: 'TIER' },
                { num: 2, label: 'COMPANY' },
                { num: 3, label: 'ADMIN' },
                { num: 4, label: 'DEPOT' },
                { num: 5, label: 'REVIEW' },
                { num: 6, label: 'SYNC' }
              ].map(step => (
                <div key={step.num} className={`uppercase ${wizardStep === step.num ? 'text-[#FFB020]' : 'text-slate-600'}`}>
                  {step.num}. {step.label}
                </div>
              ))}
            </div>

            <div className="px-6 py-6 text-left">
              {wizardStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">CHOOSE SUBSCRIPTION LICENSE</label>
                    <div className="grid grid-cols-3 gap-4">
                      {['Starter', 'Professional', 'Enterprise'].map(plan => (
                        <div 
                          key={plan}
                          onClick={() => setSelectedPlan(plan)}
                          className={`rounded-xl p-4 text-center cursor-pointer transition-colors ${selectedPlan === plan ? 'border-2 border-[#FFB020] bg-yellow-50/50' : 'border border-slate-200 hover:border-[#FFB020]'}`}
                        >
                          <div className="font-bold text-slate-900 text-[14px]">{plan}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setWizardStep(2)}
                    className="w-full bg-[#FFB020] hover:bg-brand-600 text-slate-900 font-extrabold text-[14px] py-3.5 rounded-xl shadow-[0_4px_15px_rgba(255,176,32,0.4)] transition-all"
                  >
                    Continue
                  </button>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">COMPANY LEGAL INFORMATION</label>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">LEGAL COMPANY NAME</label>
                        <input
                          type="text"
                          value={selectedLeadObj.companyName}
                          readOnly
                          className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setWizardStep(3)}
                      className="flex-1 bg-[#FFB020] hover:bg-brand-600 text-slate-900 font-extrabold text-[14px] py-3.5 rounded-xl shadow-sm"
                    >
                      Continue
                    </button>
                    <button
                      onClick={() => setWizardStep(1)}
                      className="px-6 py-3.5 text-slate-600 font-bold text-[14px] hover:bg-slate-50 rounded-xl transition-all"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">SYSTEM ADMINISTRATOR WORKSPACE PROFILE</label>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">ADMIN FULL NAME</label>
                        <input
                          type="text"
                          value={selectedLeadObj.contactName}
                          readOnly
                          className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">ADMIN LOGIN EMAIL</label>
                        <input
                          type="email"
                          value={selectedLeadObj.email}
                          readOnly
                          className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setWizardStep(4)}
                      className="flex-1 bg-[#FFB020] hover:bg-brand-600 text-slate-900 font-extrabold text-[14px] py-3.5 rounded-xl shadow-sm"
                    >
                      Continue
                    </button>
                    <button
                      onClick={() => setWizardStep(2)}
                      className="px-6 py-3.5 text-slate-600 font-bold text-[14px] hover:bg-slate-50 rounded-xl transition-all"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}

              {wizardStep === 4 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">ASSIGN REGIONAL BRANCH TERMINAL</label>
                    
                    <div className="space-y-2">
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">DEPOT LOCATION</label>
                      <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 focus:outline-none focus:border-[#FFB020] transition-colors bg-white appearance-auto">
                        <option>Chicago HQ Terminal</option>
                        <option>New York Terminal</option>
                        <option>Dallas Hub</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setWizardStep(5)}
                      className="flex-1 bg-[#FFB020] hover:bg-brand-600 text-slate-900 font-extrabold text-[14px] py-3.5 rounded-xl shadow-sm"
                    >
                      Continue
                    </button>
                    <button
                      onClick={() => setWizardStep(3)}
                      className="px-6 py-3.5 text-slate-600 font-bold text-[14px] hover:bg-slate-50 rounded-xl transition-all"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}

              {wizardStep === 5 && (
                <div className="space-y-6">
                  {isProvisioning ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <div className="w-12 h-12 border-4 border-slate-100 border-t-[#FFB020] rounded-full animate-spin"></div>
                      <p className="text-slate-600 font-bold text-[14px]">Provisioning Workspace...</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">REVIEW WORKSPACE SPECIFICATIONS</label>
                        
                        <div className="border border-slate-200 rounded-xl p-5 space-y-3">
                          <div className="flex justify-between items-center text-[13px]">
                            <span className="text-slate-500 font-medium">Subscription:</span>
                            <span className="text-slate-700 font-bold">{selectedPlan} Plan (Monthly)</span>
                          </div>
                          <div className="flex justify-between items-center text-[13px]">
                            <span className="text-slate-500 font-medium">Company:</span>
                            <span className="text-slate-700 font-bold">{selectedLeadObj.companyName}</span>
                          </div>
                          <div className="flex justify-between items-center text-[13px]">
                            <span className="text-slate-500 font-medium">Admin User:</span>
                            <span className="text-slate-700 font-bold">{selectedLeadObj.contactName} ({selectedLeadObj.email})</span>
                          </div>
                          <div className="flex justify-between items-center text-[13px]">
                            <span className="text-slate-500 font-medium">Depot Allocation:</span>
                            <span className="text-slate-700 font-bold">Chicago HQ Terminal</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleProvisionWorkspace}
                          className="flex-1 bg-[#FFB020] hover:bg-brand-600 text-slate-900 font-extrabold text-[14px] py-3.5 rounded-xl shadow-sm"
                        >
                          Provision Workspace
                        </button>
                        <button
                          onClick={() => setWizardStep(4)}
                          className="px-6 py-3.5 text-slate-600 font-bold text-[14px] hover:bg-slate-50 rounded-xl transition-all"
                        >
                          Back
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {wizardStep === 6 && (
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-8 text-center space-y-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <div className="w-12 h-12 border-[4px] border-emerald-400 rounded-full flex items-center justify-center">
                      <Check className="w-6 h-6 text-emerald-500" strokeWidth={3} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-[18px] font-bold text-slate-900">Company Workspace Provision Complete!</h3>
                    <p className="text-[13px] font-medium text-slate-500">Tenant profile successfully registered inside global administrative databases.</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowConversionWizard(false);
                      navigate('/admin/companies'); // Direct to the companies list
                    }}
                    className="bg-[#FFB020] hover:bg-brand-600 text-slate-900 font-extrabold text-[14px] px-8 py-3.5 rounded-xl shadow-[0_4px_15px_rgba(255,176,32,0.4)] transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
                  >
                    Go to Companies Workspace
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
