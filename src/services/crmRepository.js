import { crmStore } from './crmStore';

const STORAGE_KEY = 'hero_crm_leads';
const DEMOS_KEY = 'hero_crm_demos';
const TRIALS_KEY = 'hero_crm_trials';
const PROPOSALS_KEY = 'hero_crm_proposals';
const FOLLOWUPS_KEY = 'hero_crm_followups';
const HANDOVERS_KEY = 'hero_crm_handovers';
const STAGES_KEY = 'hero_crm_stages';
const SOURCES_KEY = 'hero_crm_sources';
const DB_VERSION_KEY = 'hero_crm_db_version';
const CURRENT_DB_VERSION = '1.5'; // Bump this to force a reset of mock data

const defaultLeads = [
  { id: 'L-1001', company: 'Vance Refrigeration', name: 'Robert Vance', email: 'robert@vance.com', phone: '555-0123', fleetSize: 12, niche: 'Refrigerated', revenue: 3500, stage: 'New Lead', score: 65, rep: 'Alex Wright', notes: 'Looking for a new reefer transport solution.', stageDays: 2 },
  { id: 'L-1002', company: 'Dunder Mifflin', name: 'Michael Scott', email: 'mscott@dundermifflin.com', phone: '555-0199', fleetSize: 45, niche: 'General Freight', revenue: 12000, stage: 'Demo Booked', score: 85, rep: 'Sarah K.', notes: 'Paper delivery logistics needs overhaul.', stageDays: 14 },
  { id: 'L-1003', company: 'Sabre Logistics', name: 'Jo Bennett', email: 'jo@sabre.com', phone: '555-0211', fleetSize: 150, niche: 'General Freight', revenue: 45000, stage: 'Negotiation', score: 92, rep: 'Alex Wright', notes: 'Needs enterprise integration.', stageDays: 5 },
  { id: 'L-1004', company: 'Prestige Worldwide', name: 'Brennan Huff', email: 'brennan@prestige.com', phone: '555-9821', fleetSize: 5, niche: 'Dangerous Goods', revenue: 1200, stage: 'Contacted', score: 40, rep: 'Ryan Howard', notes: 'Startup. Might be risky.', stageDays: 1 },
  { id: 'L-1005', company: 'Initech', name: 'Bill Lumbergh', email: 'bill@initech.com', phone: '555-0099', fleetSize: 30, niche: 'Car Carrying', revenue: 8500, stage: 'Demo Completed', score: 78, rep: 'Michael Scott', notes: 'Very particular about TPS reports.', stageDays: 4 },
  { id: 'L-1006', company: 'Aperture Science', name: 'Cave Johnson', email: 'cave@aperture.com', phone: '555-1010', fleetSize: 200, niche: 'Dangerous Goods', revenue: 95000, stage: 'Trial Started', score: 99, rep: 'Jan Levinson', notes: 'Transporting portals. Need high security.', stageDays: 21 },
  { id: 'L-1007', company: 'Stark Industries', name: 'Tony Stark', email: 'tony@stark.com', phone: '555-9999', fleetSize: 85, niche: 'Container', revenue: 45000, stage: 'Proposal Sent', score: 88, rep: 'Sarah K.', notes: 'Looking for automated dispatch.', stageDays: 7 },
  { id: 'L-1008', company: 'Wayne Enterprises', name: 'Bruce Wayne', email: 'bruce@wayne.com', phone: '555-8888', fleetSize: 120, niche: 'Flatbed', revenue: 65000, stage: 'Won', score: 95, rep: 'Alex Wright', notes: 'Closed the deal last night.', stageDays: 2 },
  { id: 'L-1009', company: 'Globex Corp', name: 'Hank Scorpio', email: 'hank@globex.com', phone: '555-7777', fleetSize: 60, niche: 'General Freight', revenue: 18000, stage: 'Lost', score: 45, rep: 'Michael Scott', notes: 'Went with a competitor.', stageDays: 10 },
  { id: 'L-1010', company: 'Cyberdyne Systems', name: 'Miles Dyson', email: 'miles@cyberdyne.com', phone: '555-4444', fleetSize: 400, niche: 'Dangerous Goods', revenue: 150000, stage: 'New Lead', score: 91, rep: 'Jan Levinson', notes: 'Skynet logistics network.', stageDays: 0 },
  { id: 'L-1011', company: 'Acme Corp', name: 'Wile E. Coyote', email: 'wile@acme.com', phone: '555-3333', fleetSize: 15, niche: 'General Freight', revenue: 4200, stage: 'Contacted', score: 55, rep: 'Ryan Howard', notes: 'Lots of returns.', stageDays: 3 },
  { id: 'L-1012', company: 'Massive Dynamic', name: 'William Bell', email: 'bell@massive.com', phone: '555-2222', fleetSize: 250, niche: 'Refrigerated', revenue: 85000, stage: 'Negotiation', score: 82, rep: 'Alex Wright', notes: 'Complex temperature requirements.', stageDays: 9 },
];

const defaultDemos = [
  { id: 'D-2001', leadId: 'L-1002', company: 'Dunder Mifflin', contact: 'Michael Scott', date: '2026-07-15', time: '10:00 AM', presenter: 'Sarah K.', status: 'Upcoming', notes: 'Focus on paper routing', meetingLink: 'https://meet.hero.com/dm-1' },
  { id: 'D-2002', leadId: 'L-1005', company: 'Initech', contact: 'Bill Lumbergh', date: '2026-07-14', time: '02:30 PM', presenter: 'Michael Scott', status: 'Completed', notes: 'Showed dispatch board', meetingLink: 'https://meet.hero.com/ini-2' },
  { id: 'D-2003', leadId: 'L-1011', company: 'Acme Corp', contact: 'Wile E. Coyote', date: '2026-07-16', time: '11:00 AM', presenter: 'Ryan Howard', status: 'Upcoming', notes: 'Anvil transport logistics', meetingLink: 'https://meet.hero.com/acm-3' },
  { id: 'D-2004', leadId: 'L-1006', company: 'Aperture Science', contact: 'Cave Johnson', date: '2026-07-10', time: '09:00 AM', presenter: 'Jan Levinson', status: 'Completed', notes: 'Security features', meetingLink: 'https://meet.hero.com/apt-4' },
  { id: 'D-2005', leadId: 'L-1004', company: 'Prestige Worldwide', contact: 'Brennan Huff', date: '2026-07-22', time: '01:00 PM', presenter: 'Ryan Howard', status: 'Upcoming', notes: 'Basic overview', meetingLink: 'https://meet.hero.com/pw-5' },
];

const defaultTrials = [
  { id: 'T-3001', leadId: 'L-1001', company: 'Vance Refrigeration', admin: 'Robert Vance', status: 'Active', daysRemaining: 14, startDate: '2025-07-16', expiryDate: '2025-07-29', mostUsedModule: 'Live GPS Tracking', activeUsers: 1, storage: '0.1 GB' },
  { id: 'T-3002', leadId: 'L-1013', company: 'Blue Sky Cargo', admin: 'Jim Halpert', status: 'Active', daysRemaining: 12, startDate: '2025-07-10', expiryDate: '2025-07-24', mostUsedModule: 'Live GPS Tracking', activeUsers: 15, storage: '2.5 GB' },
  { id: 'T-3003', leadId: 'L-1014', company: 'Polar Express Cold Chain', admin: 'Dwight Schrute', status: 'Active', daysRemaining: 9, startDate: '2025-07-03', expiryDate: '2025-07-23', mostUsedModule: 'Factoring API', activeUsers: 10, storage: '3.0 GB' },
  { id: 'T-3004', leadId: 'L-1002', company: 'Dunder Mifflin Logistics', admin: 'Michael Scott', status: 'Active', daysRemaining: 14, startDate: '2025-07-01', expiryDate: '2025-07-28', mostUsedModule: 'Live GPS Tracking', activeUsers: 4, storage: '3.4 GB' },
  { id: 'T-3005', leadId: 'L-1015', company: 'Schrute Farms Delivery', admin: 'Angela Martin', status: 'Active', daysRemaining: 13, startDate: '2025-05-29', expiryDate: '2025-07-27', mostUsedModule: 'Factoring API', activeUsers: 5, storage: '3.9 GB' },
  { id: 'T-3006', leadId: 'L-1016', company: 'Green Last-Mile', admin: 'Oscar Martinez', status: 'Active', daysRemaining: 13, startDate: '2025-05-15', expiryDate: '2025-07-27', mostUsedModule: 'Factoring API', activeUsers: 7, storage: '5.2 GB' },
  { id: 'T-3007', leadId: 'L-1017', company: 'Buffay Intermodal', admin: 'Jan Levinson', status: 'Active', daysRemaining: 10, startDate: '2025-05-15', expiryDate: '2025-07-25', mostUsedModule: 'Live GPS Tracking', activeUsers: 9, storage: '5.5 GB' },
  { id: 'T-3008', leadId: 'L-1018', company: 'Tribbiani Flatbed', admin: 'Dwight Schrute', status: 'Active', daysRemaining: 11, startDate: '2025-05-10', expiryDate: '2025-07-25', mostUsedModule: 'Routing API', activeUsers: 11, storage: '7.0 GB' },
  { id: 'T-3009', leadId: 'L-1019', company: 'Nard Dog Logistics', admin: 'Michael Scott', status: 'Active', daysRemaining: 10, startDate: '2025-05-09', expiryDate: '2025-07-24', mostUsedModule: 'Live GPS Tracking', activeUsers: 13, storage: '7.4 GB' },
  { id: 'T-3010', leadId: 'L-1020', company: 'Aris Intermodal', admin: 'Phyllis Vance', status: 'Active', daysRemaining: 11, startDate: '2025-05-27', expiryDate: '2025-07-24', mostUsedModule: 'Live GPS Tracking', activeUsers: 3, storage: '8.9 GB' },
  { id: 'T-3011', leadId: 'L-1021', company: 'Freight A-Way', admin: 'Oscar Martinez', status: 'Active', daysRemaining: 11, startDate: '2025-05-24', expiryDate: '2025-07-23', mostUsedModule: 'Routing API', activeUsers: 5, storage: '10.2 GB' },
  { id: 'T-3012', leadId: 'L-1022', company: 'QuickLoad Logistics', admin: 'Jim Halpert', status: 'Active', daysRemaining: 14, startDate: '2025-05-22', expiryDate: '2025-07-29', mostUsedModule: 'Live GPS Tracking', activeUsers: 7, storage: '10.5 GB' },
  { id: 'T-3013', leadId: 'L-1023', company: 'RedLine Carriers', admin: 'Dwight Schrute', status: 'Active', daysRemaining: 10, startDate: '2025-05-20', expiryDate: '2025-07-27', mostUsedModule: 'Routing API', activeUsers: 9, storage: '11.0 GB' },
  { id: 'T-3014', leadId: 'L-1024', company: 'CrossCountry Freight', admin: 'Stanley Hudson', status: 'Active', daysRemaining: 13, startDate: '2025-05-01', expiryDate: '2025-07-27', mostUsedModule: 'Routing API', activeUsers: 12, storage: '13.4 GB' },
  { id: 'T-3015', leadId: 'L-1025', company: 'FreightTrain Inc', admin: 'Phyllis Vance', status: 'Active', daysRemaining: 11, startDate: '2025-05-09', expiryDate: '2025-07-25', mostUsedModule: 'Live GPS Tracking', activeUsers: 12, storage: '13.8 GB' },
  { id: 'T-3016', leadId: 'L-1026', company: 'CargoShift 3PL', admin: 'Oscar Martinez', status: 'Active', daysRemaining: 14, startDate: '2025-05-12', expiryDate: '2025-07-25', mostUsedModule: 'Factoring API', activeUsers: 3, storage: '14.2 GB' },
  { id: 'T-3017', leadId: 'L-1027', company: 'EcoFreight Solutions', admin: 'Jim Halpert', status: 'Active', daysRemaining: 12, startDate: '2025-04-30', expiryDate: '2025-07-24', mostUsedModule: 'Live GPS Tracking', activeUsers: 5, storage: '14.5 GB' },
  { id: 'T-3018', leadId: 'L-1028', company: 'ExpressWay Cargo', admin: 'Robert Vance', status: 'Active', daysRemaining: 14, startDate: '2025-04-17', expiryDate: '2025-07-24', mostUsedModule: 'Live GPS Tracking', activeUsers: 6, storage: '17.0 GB' },
  { id: 'T-3019', leadId: 'L-1029', company: 'Milestone 3PL', admin: 'Stanley Hudson', status: 'Active', daysRemaining: 9, startDate: '2025-04-14', expiryDate: '2025-07-20', mostUsedModule: 'Factoring API', activeUsers: 8, storage: '10.4 GB' },
  { id: 'T-3020', leadId: 'L-1030', company: 'Voyager Freight', admin: 'Phyllis Vance', status: 'Active', daysRemaining: 14, startDate: '2025-04-10', expiryDate: '2025-07-28', mostUsedModule: 'Live GPS Tracking', activeUsers: 10, storage: '17.8 GB' },
  { id: 'T-3021', leadId: 'L-1031', company: 'Silverback Trucking', admin: 'Oscar Martinez', status: 'Active', daysRemaining: 11, startDate: '2025-04-11', expiryDate: '2025-07-27', mostUsedModule: 'Factoring API', activeUsers: 12, storage: '18.2 GB' },
  { id: 'T-3022', leadId: 'L-1032', company: 'AirWay Express', admin: 'Darryl Philbin', status: 'Active', daysRemaining: 12, startDate: '2025-02-28', expiryDate: '2025-07-27', mostUsedModule: 'Factoring API', activeUsers: 18, storage: '20.8 GB' },
];

const defaultProposals = [
  { id: 'PROP-prop_405', leadId: 'L-1014', title: 'SaaS License Core Agreement - Polar Express Cold Chain', company: 'Polar Express Cold Chain', value: 4314, discount: 5, tax: 10, total: 4508, validity: '30 Days', status: 'Sent', version: 'V1', createdDate: '2026-07-03', features: ['Real-Time GPS Telematics', 'Factoring & Billing API', 'ELD Compliance Module', 'Dispatch Board Pro', 'AI Route Optimizer', 'Driver Mobile App', 'Live Customer Portal', 'Maintenance Scheduler'] },
  { id: 'PROP-prop_406', leadId: 'L-1002', title: 'SaaS License Core Agreement - Dunder Mifflin Logistics', company: 'Dunder Mifflin Logistics', value: 4776, discount: 5, tax: 10, total: 4991, validity: '30 Days', status: 'Sent', version: 'V1', createdDate: '2026-07-01', features: ['Real-Time GPS Telematics', 'Factoring & Billing API', 'ELD Compliance Module', 'Dispatch Board Pro', 'AI Route Optimizer', 'Driver Mobile App', 'Live Customer Portal', 'Maintenance Scheduler'] },
  { id: 'PROP-prop_407', leadId: 'L-1015', title: 'SaaS License Core Agreement - Schrute Farms Delivery', company: 'Schrute Farms Delivery', value: 5238, discount: 5, tax: 10, total: 5474, validity: '30 Days', status: 'Accepted', version: 'V1', createdDate: '2026-05-29', features: ['Real-Time GPS Telematics', 'Factoring & Billing API', 'ELD Compliance Module', 'Dispatch Board Pro', 'AI Route Optimizer', 'Driver Mobile App', 'Live Customer Portal', 'Maintenance Scheduler'] },
  { id: 'PROP-prop_408', leadId: 'L-1017', title: 'SaaS License Core Agreement - Buffay Intermodal', company: 'Buffay Intermodal', value: 8472, discount: 5, tax: 10, total: 8853, validity: '30 Days', status: 'Sent', version: 'V1', createdDate: '2026-05-15', features: ['Real-Time GPS Telematics', 'Factoring & Billing API', 'ELD Compliance Module', 'Dispatch Board Pro', 'AI Route Optimizer', 'Driver Mobile App', 'Live Customer Portal', 'Maintenance Scheduler'] },
  { id: 'PROP-prop_409', leadId: 'L-1018', title: 'SaaS License Core Agreement - Tribbiani Flatbed', company: 'Tribbiani Flatbed', value: 8934, discount: 5, tax: 10, total: 9336, validity: '30 Days', status: 'Sent', version: 'V1', createdDate: '2026-05-10', features: ['Real-Time GPS Telematics', 'Factoring & Billing API', 'ELD Compliance Module', 'Dispatch Board Pro', 'AI Route Optimizer', 'Driver Mobile App', 'Live Customer Portal', 'Maintenance Scheduler'] },
  { id: 'PROP-prop_410', leadId: 'L-1019', title: 'SaaS License Core Agreement - Heller Logistics', company: 'Heller Logistics', value: 9396, discount: 5, tax: 10, total: 9819, validity: '30 Days', status: 'Accepted', version: 'V1', createdDate: '2026-05-09', features: ['Real-Time GPS Telematics', 'Factoring & Billing API', 'ELD Compliance Module', 'Dispatch Board Pro', 'AI Route Optimizer', 'Driver Mobile App', 'Live Customer Portal', 'Maintenance Scheduler'] },
];

const defaultFollowUps = [
  { id: 'FU-101', leadId: 'L-1001', company: 'Vance Refrigeration', contact: 'Robert Vance', dueDate: '2026-07-13', dueTime: '10:00 AM', status: 'Completed', type: 'Call', notes: 'Touchpoint checklist regarding pain points: Manual route sheets take hours.' },
  { id: 'FU-102', leadId: 'L-1002', company: 'Hudson Logistics Corp', contact: 'Stanley Hudson', dueDate: '2026-07-14', dueTime: '03:30 PM', status: 'Completed', type: 'Email', notes: 'Touchpoint checklist regarding pain points: Frequent dispatch miscommunications.' },
  { id: 'FU-103', leadId: 'L-1003', company: 'Apex Freight Systems', contact: 'Phyllis Vance', dueDate: '2026-07-15', dueTime: '10:00 AM', status: 'Completed', type: 'Meeting', notes: 'Touchpoint checklist regarding pain points: Billing factoring delays cashflow.' },
  { id: 'FU-104', leadId: 'L-1004', company: 'Roadrunners 3PL', contact: 'Oscar Martinez', dueDate: '2026-07-16', dueTime: '03:30 PM', status: 'Completed', type: 'Meeting', notes: 'Touchpoint checklist regarding pain points: No live mapping for recipients.' },
  { id: 'FU-105', leadId: 'L-1005', company: 'Blue Sky Cargo', contact: 'Jim Halpert', dueDate: '2026-07-17', dueTime: '10:00 AM', status: 'Completed', type: 'Call', notes: 'Touchpoint checklist regarding pain points: ELD driver hours audit scares.' },
  { id: 'FU-106', leadId: 'L-1006', company: 'Polar Express Cold Chain', contact: 'Dwight Schrute', dueDate: '2026-07-13', dueTime: '03:30 PM', status: 'Completed', type: 'Email', notes: 'Touchpoint checklist regarding pain points: Fuel tax calculation mistakes.' },
];

const defaultHandovers = [
  { id: 'HO-201', leadId: 'L-1015', company: 'Schrute Farms Delivery', owner: 'Michael Scott', targetDate: '2026-07-16', progress: 80, status: 'In Progress' },
  { id: 'HO-202', leadId: 'L-1019', company: 'Heller Logistics', owner: 'Sarah K.', targetDate: '2026-07-17', progress: 100, status: 'Completed' },
  { id: 'HO-203', leadId: 'L-1020', company: 'RedLine Carriers', owner: 'Alex Wright', targetDate: '2026-07-18', progress: 100, status: 'Completed' },
  { id: 'HO-204', leadId: 'L-1021', company: 'EcoFreight Solutions', owner: 'Ryan Howard', targetDate: '2026-07-19', progress: 86, status: 'In Progress' },
  { id: 'HO-205', leadId: 'L-1022', company: 'Silverback Trucking', owner: 'Jan Levinson', targetDate: '2026-07-16', progress: 100, status: 'Completed' },
];

const defaultStages = [
  'New Lead', 'Contacted', 'Demo Booked', 'Demo Completed',
  'Trial Started', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'
];

const defaultSources = [
  'Google Search', 'LinkedIn', 'Partner Referral', 'Cold Call'
];

class CRMRepository {
  constructor() {
    const version = localStorage.getItem(DB_VERSION_KEY);
    if (version !== CURRENT_DB_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(DEMOS_KEY);
      localStorage.removeItem(TRIALS_KEY);
      localStorage.removeItem(PROPOSALS_KEY);
      localStorage.removeItem(FOLLOWUPS_KEY);
      localStorage.removeItem(HANDOVERS_KEY);
      localStorage.removeItem(STAGES_KEY);
      localStorage.removeItem(SOURCES_KEY);
      localStorage.setItem(DB_VERSION_KEY, CURRENT_DB_VERSION);
    }
  }

  getLeads() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultLeads));
      return defaultLeads;
    }
    return JSON.parse(data);
  }

  saveLeads(leads) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    crmStore.notify();
  }

  getDemos() {
    const data = localStorage.getItem(DEMOS_KEY);
    if (!data) {
      localStorage.setItem(DEMOS_KEY, JSON.stringify(defaultDemos));
      return defaultDemos;
    }
    return JSON.parse(data);
  }

  saveDemos(demos) {
    localStorage.setItem(DEMOS_KEY, JSON.stringify(demos));
    crmStore.notify();
  }

  getTrials() {
    const data = localStorage.getItem(TRIALS_KEY);
    if (!data) {
      localStorage.setItem(TRIALS_KEY, JSON.stringify(defaultTrials));
      return defaultTrials;
    }
    return JSON.parse(data);
  }

  saveTrials(trials) {
    localStorage.setItem(TRIALS_KEY, JSON.stringify(trials));
    crmStore.notify();
  }

  getProposals() {
    const data = localStorage.getItem(PROPOSALS_KEY);
    if (!data) {
      localStorage.setItem(PROPOSALS_KEY, JSON.stringify(defaultProposals));
      return defaultProposals;
    }
    return JSON.parse(data);
  }

  saveProposals(proposals) {
    localStorage.setItem(PROPOSALS_KEY, JSON.stringify(proposals));
    crmStore.notify();
  }

  getFollowups() {
    const data = localStorage.getItem(FOLLOWUPS_KEY);
    if (!data) {
      localStorage.setItem(FOLLOWUPS_KEY, JSON.stringify(defaultFollowUps));
      return defaultFollowUps;
    }
    return JSON.parse(data);
  }

  saveFollowups(followups) {
    localStorage.setItem(FOLLOWUPS_KEY, JSON.stringify(followups));
    crmStore.notify();
  }

  getHandovers() {
    const data = localStorage.getItem(HANDOVERS_KEY);
    if (!data) {
      localStorage.setItem(HANDOVERS_KEY, JSON.stringify(defaultHandovers));
      return defaultHandovers;
    }
    return JSON.parse(data);
  }

  saveHandovers(handovers) {
    localStorage.setItem(HANDOVERS_KEY, JSON.stringify(handovers));
    crmStore.notify();
  }

  getStages() {
    const data = localStorage.getItem(STAGES_KEY);
    if (!data) {
      localStorage.setItem(STAGES_KEY, JSON.stringify(defaultStages));
      return defaultStages;
    }
    return JSON.parse(data);
  }

  saveStages(stages) {
    localStorage.setItem(STAGES_KEY, JSON.stringify(stages));
    crmStore.notify();
  }

  getSources() {
    const data = localStorage.getItem(SOURCES_KEY);
    if (!data) {
      localStorage.setItem(SOURCES_KEY, JSON.stringify(defaultSources));
      return defaultSources;
    }
    return JSON.parse(data);
  }

  saveSources(sources) {
    localStorage.setItem(SOURCES_KEY, JSON.stringify(sources));
    crmStore.notify();
  }

  getCrmDatabase() {
    return {
      leads: this.getLeads(),
      demos: this.getDemos(),
      trials: this.getTrials(),
      crmProposals: this.getProposals(),
      crmFollowups: this.getFollowups(),
      crmHandovers: this.getHandovers(),
      crmPipelineStages: this.getStages(),
      crmAcquisitionSources: this.getSources()
    };
  }

  createLead(data) {
    const leads = this.getLeads();
    const newLead = {
      ...data,
      id: `L-${Math.floor(1000 + Math.random() * 9000)}`,
      stageDays: 0
    };
    this.saveLeads([newLead, ...leads]);
    return newLead;
  }

  updateLead(id, data) {
    const leads = this.getLeads();
    const index = leads.findIndex(l => l.id === id);
    if (index !== -1) {
      leads[index] = { ...leads[index], ...data };
      this.saveLeads(leads);
    }
  }

  deleteLead(id) {
    let leads = this.getLeads();
    leads = leads.filter(l => l.id !== id);
    this.saveLeads(leads);
  }

  scheduleDemo(leadId, demoData) {
    const leads = this.getLeads();
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return null;

    const demos = this.getDemos();
    const newDemo = {
      id: `D-${Math.floor(2000 + Math.random() * 8000)}`,
      leadId,
      company: lead.company,
      contact: lead.name,
      status: 'Upcoming',
      meetingLink: `https://meet.hero.com/${Math.random().toString(36).substring(7)}`,
      ...demoData
    };
    this.saveDemos([...demos, newDemo]);
    return newDemo;
  }

  updateDemo(id, data) {
    const demos = this.getDemos();
    const index = demos.findIndex(d => d.id === id);
    if (index !== -1) {
      demos[index] = { ...demos[index], ...data };
      this.saveDemos(demos);
    }
  }

  completeDemo(id) {
    this.updateDemo(id, { status: 'Completed' });
  }

  logDemoFeedback(id, notes, rating) {
    this.updateDemo(id, { feedbackNotes: notes, rating });
  }

  extendTrial(id, days) {
    const trials = this.getTrials();
    const index = trials.findIndex(t => t.id === id);
    if (index !== -1) {
      const trial = trials[index];
      // Basic mock extend logic
      const newDaysRemaining = Math.min(14, trial.daysRemaining + days);
      trials[index] = { 
        ...trial, 
        daysRemaining: newDaysRemaining 
      };
      this.saveTrials(trials);
    }
  }
}

export const crmRepository = new CRMRepository();
