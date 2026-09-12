import { crmStore } from './crmStore';
import api, { updateLeadStage, assignLeadRep, getSalesReps } from './api';

const STORAGE_KEY = 'hero_crm_leads';
const DEMOS_KEY = 'hero_crm_demos';
const PROPOSALS_KEY = 'hero_crm_proposals';
const FOLLOWUPS_KEY = 'hero_crm_followups';
const REPS_KEY = 'hero_crm_reps';
const HANDOVERS_KEY = 'hero_crm_handovers';
const STAGES_KEY = 'hero_crm_stages';
const SOURCES_KEY = 'hero_crm_sources';

// Mappings
export function mapLeadToFrontend(l) {
  const createdDate = l.createdAt ? new Date(l.createdAt) : new Date();
  const diffTime = Math.max(0, new Date() - createdDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return {
    id: l.id,
    company: l.companyName,
    name: l.contactName,
    email: l.email,
    phone: l.phone || '',
    fleetSize: parseInt(l.fleetSize) || 0,
    niche: l.transportNiche || 'General Freight',
    revenue: l.estimatedValue !== undefined && l.estimatedValue !== null ? l.estimatedValue : 0,
    stage: mapStageToFrontend(l.stage),
    score: l.score !== undefined && l.score !== null ? l.score : 0,
    repId: l.repId || null,
    rep: l.rep?.name || 'Unassigned',
    notes: l.painPoints || '',
    currentSoftware: l.currentSoftware || '',
    painPoints: l.painPoints || '',
    source: l.source || '',
    tags: l.source || '',
    priority: l.score >= 80 ? 'High' : l.score >= 50 ? 'Medium' : 'Low',
    stageDays: diffDays,
    createdAt: l.createdAt,
    demos: l.demos || [],
    proposals: l.proposals || [],
    tasks: l.tasks || [],
    activities: l.activities || []
  };
}

export function mapStageToFrontend(stg) {
  const map = {
    'NEW_LEAD': 'New Lead',
    'CONTACTED': 'Contacted',
    'DEMO_BOOKED': 'Demo Booked',
    'DEMO_COMPLETED': 'Demo Completed',
    'TRIAL_STARTED': 'Trial Started',
    'PROPOSAL_SENT': 'Proposal Sent',
    'NEGOTIATING': 'Negotiation',
    'WON': 'Won',
    'LOST': 'Lost'
  };
  return map[stg] || 'New Lead';
}

export function mapStageToBackend(stg) {
  const map = {
    'New Lead': 'NEW_LEAD',
    'Contacted': 'CONTACTED',
    'Demo Booked': 'DEMO_BOOKED',
    'Demo Completed': 'DEMO_COMPLETED',
    'Trial Started': 'TRIAL_STARTED',
    'Proposal Sent': 'PROPOSAL_SENT',
    'Negotiation': 'NEGOTIATING',
    'Won': 'WON',
    'Lost': 'LOST'
  };
  return map[stg] || 'NEW_LEAD';
}

class CRMRepository {
  constructor() {
    this._inFlight = {};
    this._lastSync = {};
  }

  _isAuthOrDriverSkip() {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/driver')) {
      return true;
    }
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
      return true;
    }
    return false;
  }

  _ignoreAuthErr(err) {
    if (err?.response?.status === 401 || err?.response?.status === 403) return null;
    throw err;
  }

  async syncPipeline(force = false) {
    if (this._isAuthOrDriverSkip()) return;
    if (this._inFlight['pipeline']) return this._inFlight['pipeline'];
    if (!force && this._lastSync['pipeline'] && Date.now() - this._lastSync['pipeline'] < 5000) return;

    this._inFlight['pipeline'] = (async () => {
      try {
        let pipelineRes = await api.get('/leads/pipeline').catch(this._ignoreAuthErr);
        
        if (pipelineRes?.data && Array.isArray(pipelineRes.data.data?.leads)) {
          const mapped = pipelineRes.data.data.leads.map(mapLeadToFrontend);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
          if (Array.isArray(pipelineRes.data.data.salesReps)) {
            localStorage.setItem(REPS_KEY, JSON.stringify(pipelineRes.data.data.salesReps));
          }
          this._lastSync['pipeline'] = Date.now();
        } else {
          // Fallback to standard leads endpoint if /leads/pipeline endpoint returns empty or is not deployed on production server yet
          const leadsRes = await api.get('/leads').catch(this._ignoreAuthErr);
          if (leadsRes?.data && Array.isArray(leadsRes.data.data)) {
            const mapped = leadsRes.data.data.map(mapLeadToFrontend);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
            this._lastSync['pipeline'] = Date.now();
          }
        }
        crmStore.notify();
      } catch (e) {
        console.error('Error syncing pipeline board:', e);
      } finally {
        delete this._inFlight['pipeline'];
      }
    })();

    return this._inFlight['pipeline'];
  }

  async syncTrials(force = false) {
    if (this._isAuthOrDriverSkip()) return;
    if (this._inFlight['trials']) return this._inFlight['trials'];
    if (!force && this._lastSync['trials'] && Date.now() - this._lastSync['trials'] < 5000) return;

    this._inFlight['trials'] = (async () => {
      try {
        let trialsRes = await api.get('/leads/trials').catch(err => {
          if (err?.response?.status === 404 || err?.response?.status === 401) return null;
          throw err;
        });

        if (trialsRes?.data && Array.isArray(trialsRes.data.data?.trials)) {
          localStorage.setItem(DEMOS_KEY, JSON.stringify(trialsRes.data.data.trials)); // cache trials
          if (Array.isArray(trialsRes.data.data.salesReps)) {
            localStorage.setItem(REPS_KEY, JSON.stringify(trialsRes.data.data.salesReps));
          }
          this._lastSync['trials'] = Date.now();
        } else {
          // Fallback to standard leads sync
          await this.syncLeads(true);
        }
        crmStore.notify();
      } catch (e) {
        console.error('Error syncing trials:', e);
      } finally {
        delete this._inFlight['trials'];
      }
    })();

    return this._inFlight['trials'];
  }

  async extendTrial(leadId, days = 7) {
    try {
      const response = await api.put(`/leads/${leadId}/extend-trial`, { days });
      if (response.data?.success) {
        this._lastSync['trials'] = 0;
        this._lastSync['leads'] = 0;
        await this.syncTrials(true);
        await this.syncLeads(true);
      }
    } catch (e) {
      console.error('Error extending trial in DB:', e);
    }
  }

  async syncHandovers(force = false) {
    if (this._isAuthOrDriverSkip()) return;
    if (this._inFlight['handovers']) return this._inFlight['handovers'];
    if (!force && this._lastSync['handovers'] && Date.now() - this._lastSync['handovers'] < 5000) return;

    this._inFlight['handovers'] = (async () => {
      try {
        let handoversRes = await api.get('/leads/handovers').catch(err => {
          if (err?.response?.status === 404 || err?.response?.status === 401) return null;
          throw err;
        });

        if (handoversRes?.data && Array.isArray(handoversRes.data.data?.handovers)) {
          localStorage.setItem(HANDOVERS_KEY, JSON.stringify(handoversRes.data.data.handovers));
          if (Array.isArray(handoversRes.data.data.salesReps)) {
            localStorage.setItem(REPS_KEY, JSON.stringify(handoversRes.data.data.salesReps));
          }
          this._lastSync['handovers'] = Date.now();
        } else {
          await this.syncLeads(true);
        }
        crmStore.notify();
      } catch (e) {
        console.error('Error syncing handovers:', e);
      } finally {
        delete this._inFlight['handovers'];
      }
    })();

    return this._inFlight['handovers'];
  }

  async syncReports(force = false) {
    if (this._isAuthOrDriverSkip()) return;
    if (this._inFlight['reports']) return this._inFlight['reports'];
    if (!force && this._lastSync['reports'] && Date.now() - this._lastSync['reports'] < 5000) return;

    this._inFlight['reports'] = (async () => {
      try {
        let reportsRes = await api.get('/leads/reports').catch(err => {
          if (err?.response?.status === 404 || err?.response?.status === 401) return null;
          throw err;
        });

        if (reportsRes?.data?.success && reportsRes.data.data) {
          const { leads, demos, trials, proposals, salesReps } = reportsRes.data.data;
          if (Array.isArray(leads)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
          }
          if (Array.isArray(demos)) {
            localStorage.setItem(DEMOS_KEY, JSON.stringify(demos));
          }
          if (Array.isArray(proposals)) {
            const mappedProposals = proposals.map(p => ({
              ...p,
              features: ['Real-Time GPS Telematics', 'AI Route Optimizer', 'Driver Mobile App', 'Dispatch Board Pro', 'Factoring & Billing API', 'Live Customer Portal']
            }));
            localStorage.setItem(PROPOSALS_KEY, JSON.stringify(mappedProposals));
          }
          if (Array.isArray(salesReps)) {
            localStorage.setItem(REPS_KEY, JSON.stringify(salesReps));
          }
          this._lastSync['reports'] = Date.now();
        } else {
          await this.syncLeads(true);
        }
        crmStore.notify();
      } catch (e) {
        console.error('Error syncing reports:', e);
      } finally {
        delete this._inFlight['reports'];
      }
    })();

    return this._inFlight['reports'];
  }

  async syncLeads(force = false) {
    if (this._isAuthOrDriverSkip()) return;
    if (this._inFlight['leads']) return this._inFlight['leads'];
    if (!force && this._lastSync['leads'] && Date.now() - this._lastSync['leads'] < 5000) return;

    this._inFlight['leads'] = (async () => {
      try {
        const leadsRes = await api.get('/leads').catch(this._ignoreAuthErr);
        if (leadsRes?.data && Array.isArray(leadsRes.data.data)) {
          const mapped = leadsRes.data.data.map(mapLeadToFrontend);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
          this._lastSync['leads'] = Date.now();
        }
        crmStore.notify();
      } catch (e) {
        console.error('Error syncing leads:', e);
      } finally {
        delete this._inFlight['leads'];
      }
    })();

    return this._inFlight['leads'];
  }

  async syncDemos(force = false) {
    if (this._isAuthOrDriverSkip()) return;
    if (this._inFlight['demos']) return this._inFlight['demos'];
    if (!force && this._lastSync['demos'] && Date.now() - this._lastSync['demos'] < 5000) return;

    this._inFlight['demos'] = (async () => {
      try {
        const demosRes = await api.get('/demo-bookings').catch(this._ignoreAuthErr);
        if (demosRes?.data && Array.isArray(demosRes.data.data)) {
          const mappedDemos = demosRes.data.data.map(d => ({
            id: d.id,
            leadId: d.leadId,
            company: d.lead?.companyName || 'Lead Ref',
            contact: d.lead?.contactName || 'Contact',
            date: d.scheduledAt ? d.scheduledAt.split('T')[0] : '',
            time: '12:00 PM',
            presenter: d.presenter?.name || 'Sales Rep',
            presenterId: d.presenterId,
            status: d.status === 'COMPLETED' ? 'Completed' : 'Upcoming',
            notes: d.feedback || ''
          }));
          localStorage.setItem(DEMOS_KEY, JSON.stringify(mappedDemos));
          this._lastSync['demos'] = Date.now();
        }
        crmStore.notify();
      } catch (e) {
        console.error('Error syncing demos:', e);
      } finally {
        delete this._inFlight['demos'];
      }
    })();

    return this._inFlight['demos'];
  }

  async syncProposals(force = false) {
    if (this._isAuthOrDriverSkip()) return;
    if (this._inFlight['proposals']) return this._inFlight['proposals'];
    if (!force && this._lastSync['proposals'] && Date.now() - this._lastSync['proposals'] < 5000) return;

    this._inFlight['proposals'] = (async () => {
      try {
        const proposalsRes = await api.get('/proposals').catch(this._ignoreAuthErr);
        if (proposalsRes?.data?.success) {
          const resData = proposalsRes.data.data;
          let rawList = [];
          let leadsList = null;
          let repsList = null;
          let plansList = null;
          let termList = null;

          if (Array.isArray(resData)) {
            rawList = resData;
          } else if (resData && typeof resData === 'object') {
            rawList = resData.proposals || [];
            leadsList = resData.leads;
            repsList = resData.salesReps;
            plansList = resData.subscriptionPlans;
            termList = resData.terminals;
          }

          if (Array.isArray(leadsList) && leadsList.length > 0) {
            const mappedLeads = leadsList.map(mapLeadToFrontend);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedLeads));
          }

          if (Array.isArray(repsList) && repsList.length > 0) {
            localStorage.setItem(REPS_KEY, JSON.stringify(repsList));
          }

          if (Array.isArray(plansList) && plansList.length > 0) {
            localStorage.setItem('SUBSCRIPTION_PLANS_KEY', JSON.stringify(plansList));
          }

          if (Array.isArray(termList) && termList.length > 0) {
            localStorage.setItem('TERMINALS_KEY', JSON.stringify(termList));
          }

          const mappedProposals = rawList.map(p => {
            let features = [];
            let notes = p.notes || '';
            if (p.includedModules) {
              try {
                const parsed = typeof p.includedModules === 'string' ? JSON.parse(p.includedModules) : p.includedModules;
                if (Array.isArray(parsed)) {
                  features = parsed;
                } else if (parsed && typeof parsed === 'object') {
                  if (Array.isArray(parsed.modules)) features = parsed.modules;
                  if (parsed.notes) notes = parsed.notes;
                }
              } catch (e) {
                features = ['Real-Time GPS Telematics', 'AI Route Optimizer', 'Driver Mobile App', 'Dispatch Board Pro', 'Factoring & Billing API', 'Live Customer Portal'];
              }
            }
            if (!Array.isArray(features) || features.length === 0) {
              features = ['Real-Time GPS Telematics', 'AI Route Optimizer', 'Driver Mobile App', 'Dispatch Board Pro', 'Factoring & Billing API', 'Live Customer Portal'];
            }

            return {
              id: p.id,
              leadId: p.leadId,
              proposalRef: p.proposalRef,
              title: `Proposal - ${p.lead?.companyName || 'Client'}`,
              company: p.lead?.companyName || 'Client',
              contactName: p.lead?.contactName || '',
              email: p.lead?.email || '',
              value: p.baseValue,
              discount: p.discountAmount,
              tax: 10,
              total: p.finalValue,
              validity: p.validityDays ? (String(p.validityDays).includes('Days') ? String(p.validityDays) : `${p.validityDays} Days`) : '30 Days',
              validityDays: parseInt(p.validityDays) || 30,
              notes: notes,
              features: features,
              status: p.status === 'SENT' ? 'Sent' : p.status === 'ACCEPTED' ? 'Accepted' : p.status === 'REJECTED' ? 'Rejected' : 'Draft',
              version: p.version || 'V1',
              createdDate: p.createdAt ? p.createdAt.split('T')[0] : ''
            };
          });
          localStorage.setItem(PROPOSALS_KEY, JSON.stringify(mappedProposals));
          this._lastSync['proposals'] = Date.now();
        }
        crmStore.notify();
      } catch (e) {
        console.error('Error syncing proposals:', e);
      } finally {
        delete this._inFlight['proposals'];
      }
    })();

    return this._inFlight['proposals'];
  }

  async syncFollowups(force = false) {
    if (this._isAuthOrDriverSkip()) return;
    if (this._inFlight['followups']) return this._inFlight['followups'];
    if (!force && this._lastSync['followups'] && Date.now() - this._lastSync['followups'] < 5000) return;

    this._inFlight['followups'] = (async () => {
      try {
        const tasksRes = await api.get('/follow-up-tasks').catch(this._ignoreAuthErr);
        if (tasksRes?.data && Array.isArray(tasksRes.data.data)) {
          const mappedTasks = tasksRes.data.data.map(t => ({
            id: t.id,
            leadId: t.leadId,
            company: t.lead?.companyName || 'Client',
            contact: t.lead?.contactName || 'Contact',
            dueDate: t.dueDate ? t.dueDate.split('T')[0] : '',
            dueTime: '12:00 PM',
            status: t.status === 'COMPLETED' ? 'Completed' : 'Pending',
            type: t.type || 'Call',
            notes: t.description || ''
          }));
          localStorage.setItem(FOLLOWUPS_KEY, JSON.stringify(mappedTasks));
          this._lastSync['followups'] = Date.now();
        }
        crmStore.notify();
      } catch (e) {
        console.error('Error syncing followups:', e);
      } finally {
        delete this._inFlight['followups'];
      }
    })();

    return this._inFlight['followups'];
  }

  async syncSalesReps(force = false) {
    if (this._isAuthOrDriverSkip()) return;
    if (this._inFlight['reps']) return this._inFlight['reps'];
    if (!force && this._lastSync['reps'] && Date.now() - this._lastSync['reps'] < 5000) return;

    this._inFlight['reps'] = (async () => {
      try {
        const repsRes = await getSalesReps().catch(this._ignoreAuthErr);
        if (repsRes?.data && Array.isArray(repsRes.data.data)) {
          localStorage.setItem(REPS_KEY, JSON.stringify(repsRes.data.data));
          this._lastSync['reps'] = Date.now();
        }
        crmStore.notify();
      } catch (e) {
        console.error('Error syncing sales reps:', e);
      } finally {
        delete this._inFlight['reps'];
      }
    })();

    return this._inFlight['reps'];
  }

  async syncWithBackend(targetModule) {
    if (targetModule === 'leads') return this.syncLeads();
    if (targetModule === 'demos') return this.syncDemos();
    if (targetModule === 'proposals') return this.syncProposals();
    if (targetModule === 'followups') return this.syncFollowups();
    if (targetModule === 'reps') return this.syncSalesReps();

    // Auto-detect current active menu route
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('demo') || path.includes('booking')) return this.syncDemos();
      if (path.includes('proposal')) return this.syncProposals();
      if (path.includes('follow')) return this.syncFollowups();
      if (path.includes('lead') || path.includes('pipeline')) return this.syncLeads();
    }

    return this.syncLeads();
  }

  getLeads() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  }

  getDemos() {
    return JSON.parse(localStorage.getItem(DEMOS_KEY)) || [];
  }

  getProposals() {
    return JSON.parse(localStorage.getItem(PROPOSALS_KEY)) || [];
  }

  getFollowups() {
    return JSON.parse(localStorage.getItem(FOLLOWUPS_KEY)) || [];
  }

  getSalesReps() {
    return JSON.parse(localStorage.getItem(REPS_KEY)) || [];
  }

  getTrials() {
    const leads = this.getLeads();
    return leads.filter(l => l.stage === 'Trial Started' || l.stage === 'TRIAL_STARTED' || l.stage === 'Trial').map(l => {
      const createdDate = l.createdAt ? new Date(l.createdAt) : new Date();
      const expiryDateObj = new Date(createdDate.getTime() + 14 * 24 * 60 * 60 * 1000);
      const daysLeft = Math.max(0, Math.ceil((expiryDateObj - new Date()) / (1000 * 60 * 60 * 24)));

      return {
        id: `T-${l.id}`,
        leadId: l.id,
        company: l.company || 'Trial Sandbox Tenant',
        admin: l.name || 'Admin User',
        status: daysLeft <= 0 ? 'Expired' : 'Active',
        daysRemaining: daysLeft > 0 ? daysLeft : 0,
        startDate: createdDate.toISOString().split('T')[0],
        expiryDate: expiryDateObj.toISOString().split('T')[0],
        mostUsedModule: l.niche ? `${l.niche} Tracking` : 'Live GPS Tracking',
        activeUsers: Math.min(15, Math.max(2, Math.floor((l.fleetSize || 6) / 2))),
        storage: `${((l.fleetSize || 5) * 0.15).toFixed(1)} GB`,
        currentPlan: 'Enterprise Sandbox'
      };
    });
  }

  getHandovers() {
    const cached = localStorage.getItem(HANDOVERS_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    const leads = this.getLeads();
    return leads.filter(l => l.stage === 'Won' || l.stage === 'WON').map(l => ({
      id: `H-${l.id}`,
      leadId: l.id,
      company: l.company || l.companyName || 'Carrier Tenant',
      owner: l.rep || 'Sales Officer',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      targetDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      progress: 50,
      status: 'In Progress',
      checklist: [
        { name: 'Company Workspace Provisioned', completed: true },
        { name: 'SaaS Subscription Plan Activated', completed: true },
        { name: 'Company Admin User Registered', completed: true },
        { name: 'Role Permission Policies Assigned', completed: false },
        { name: 'Mock Customer Inbound Data Importer', completed: false },
        { name: 'Roster & ELD System Training Complete', completed: false },
        { name: 'Sandbox Production Go-Live Scheduled', completed: false }
      ],
      legalDocs: {
        slaSigned: false,
        w9TaxFiled: false
      }
    }));
  }

  getStages() {
    return JSON.parse(localStorage.getItem(STAGES_KEY)) || [
      'New Lead', 'Contacted', 'Demo Booked', 'Demo Completed', 
      'Trial Started', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'
    ];
  }

  saveStages(stages) {
    localStorage.setItem(STAGES_KEY, JSON.stringify(stages));
    crmStore.notify();
  }

  getSources() {
    return JSON.parse(localStorage.getItem(SOURCES_KEY)) || ['Google Search', 'LinkedIn', 'Partner Referral', 'Cold Call'];
  }

  saveSources(sources) {
    localStorage.setItem(SOURCES_KEY, JSON.stringify(sources));
    crmStore.notify();
  }

  getCrmDatabase() {
    return {
      crmLeads: this.getLeads(),
      crmDemos: this.getDemos(),
      crmProposals: this.getProposals(),
      crmFollowups: this.getFollowups(),
      crmTrials: this.getTrials(),
      crmHandovers: this.getHandovers(),
      crmReps: this.getSalesReps(),
      crmPipelineStages: this.getStages(),
      crmAcquisitionSources: this.getSources()
    };
  }

  async createLead(data) {
    try {
      const response = await api.post('/leads', {
        companyName: data.company,
        contactName: data.name,
        email: data.email,
        phone: data.phone || '',
        fleetSize: data.fleetSize ? `${data.fleetSize} Trucks` : '15 Trucks',
        transportNiche: data.niche || 'General Freight',
        estimatedValue: Number(data.revenue) || 2500,
        score: Number(data.score) || 60,
        stage: mapStageToBackend(data.stage),
        painPoints: data.painPoints || data.notes || '',
        currentSoftware: data.currentSoftware || '',
        source: data.tags || data.source || 'Direct',
        repId: data.repId || undefined
      });
      if (response.data?.success) {
        this._lastSync['pipeline'] = 0;
        this._lastSync['leads'] = 0;
        await Promise.all([
          this.syncPipeline(true),
          this.syncLeads(true)
        ]);
        return mapLeadToFrontend(response.data.data);
      }
    } catch (e) {
      console.error('Error creating lead in db:', e);
    }
  }

  async updateLead(id, data) {
    try {
      const payload = {};
      if (data.company) payload.companyName = data.company;
      if (data.name) payload.contactName = data.name;
      if (data.email) payload.email = data.email;
      if (data.phone) payload.phone = data.phone;
      if (data.fleetSize !== undefined) payload.fleetSize = String(data.fleetSize);
      if (data.niche) payload.transportNiche = data.niche;
      if (data.revenue !== undefined) payload.estimatedValue = Number(data.revenue);
      if (data.score !== undefined) payload.score = Number(data.score);
      if (data.stage) payload.stage = mapStageToBackend(data.stage);
      if (data.painPoints !== undefined || data.notes !== undefined) {
        payload.painPoints = data.painPoints || data.notes || '';
      }
      if (data.currentSoftware !== undefined) payload.currentSoftware = data.currentSoftware;
      if (data.tags || data.source) payload.source = data.tags || data.source;
      if (data.repId !== undefined) payload.repId = data.repId;

      const response = await api.put(`/leads/${id}`, payload);
      if (response.data?.success) {
        this._lastSync['pipeline'] = 0;
        this._lastSync['leads'] = 0;
        await Promise.all([
          this.syncPipeline(true),
          this.syncLeads(true)
        ]);
      }
    } catch (e) {
      console.error('Error updating lead in db:', e);
    }
  }

  async updateStage(id, newStage, reason, notes) {
    try {
      const response = await updateLeadStage(id, {
        stage: mapStageToBackend(newStage),
        reason,
        notes
      });
      if (response.data?.success) {
        this._lastSync['pipeline'] = 0;
        this._lastSync['leads'] = 0;
        await Promise.all([
          this.syncPipeline(true),
          this.syncLeads(true)
        ]);
      }
    } catch (e) {
      console.error('Error updating lead stage in db:', e);
    }
  }

  async assignLead(id, repId) {
    try {
      const response = await assignLeadRep(id, { repId });
      if (response.data?.success) {
        this._lastSync['pipeline'] = 0;
        this._lastSync['leads'] = 0;
        await Promise.all([
          this.syncPipeline(true),
          this.syncLeads(true)
        ]);
      }
    } catch (e) {
      console.error('Error assigning lead rep in db:', e);
    }
  }

  async deleteLead(id) {
    try {
      // 1. Immediately remove from local cache and notify subscribers for instant UI removal
      const currentLeads = this.getLeads();
      const filteredLeads = currentLeads.filter(l => l.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredLeads));
      crmStore.notify();

      // 2. Execute database API deletion
      await api.delete(`/leads/${id}`).catch(err => {
        if (err?.response?.status === 404) return null;
        throw err;
      });

      // 3. Clear sync cache and trigger fresh background sync
      this._lastSync['pipeline'] = 0;
      this._lastSync['leads'] = 0;
      await Promise.all([
        this.syncPipeline(true),
        this.syncLeads(true)
      ]);
    } catch (e) {
      console.error('Error deleting lead in db:', e);
    }
  }

  async scheduleDemo(leadId, demoData) {
    try {
      const response = await api.post('/demo-bookings', {
        leadId,
        presenterId: demoData.presenterId || undefined,
        scheduledAt: new Date(demoData.date + 'T' + (demoData.time || '12:00:00')),
        status: 'UPCOMING',
        meetingLink: demoData.meetingLink || 'https://zoom.us/j/hero-demo',
        feedback: demoData.notes
      });
      if (response.data?.success) {
        await this.syncDemos();
      }
    } catch (e) {
      console.error('Error scheduling demo:', e);
    }
  }

  async updateDemo(id, data) {
    try {
      const response = await api.put(`/demo-bookings/${id}`, {
        status: data.status === 'Completed' ? 'COMPLETED' : 'UPCOMING',
        feedback: data.feedbackNotes || data.notes
      });
      if (response.data?.success) {
        await this.syncDemos();
      }
    } catch (e) {
      console.error('Error updating demo:', e);
    }
  }

  async logDemoFeedback(id, feedback, rating) {
    try {
      const response = await api.put(`/demo-bookings/${id}`, {
        feedback: `Rating: ${rating}/5 - ${feedback}`
      });
      if (response.data?.success) {
        await this.syncDemos();
      }
    } catch (e) {
      console.error('Error logging demo feedback:', e);
    }
  }

  async createProposal(data) {
    try {
      const baseVal = Number(data.value) || 0;
      const discountPercent = Number(data.discount) || 0;
      const finalVal = Math.round(baseVal * (1 - discountPercent / 100));
      const valDays = parseInt(data.validityDays || data.validity) || 30;

      const modulesList = data.modules || ['Real-Time GPS Telematics', 'AI Route Optimizer', 'Driver Mobile App', 'Dispatch Board Pro', 'Factoring & Billing API', 'Live Customer Portal'];

      const modulesPayload = JSON.stringify({
        modules: modulesList,
        notes: data.notes || ''
      });

      const payload = {
        proposalRef: `PROP-${Math.floor(100 + Math.random() * 900)}`,
        leadId: data.leadId,
        baseValue: baseVal,
        discountAmount: discountPercent,
        finalValue: finalVal,
        validityDays: valDays,
        status: data.status ? data.status.toUpperCase() : 'DRAFT',
        includedModules: modulesPayload
      };

      const response = await api.post('/proposals', payload);
      if (response.data?.success) {
        await this.syncProposals();
        return response.data.data;
      }
    } catch (e) {
      console.error('Error creating proposal in db:', e);
      throw e;
    }
  }

  async updateProposal(id, data) {
    try {
      const payload = {};
      if (data.status) payload.status = data.status.toUpperCase();
      if (data.value !== undefined) payload.baseValue = Number(data.value);
      if (data.discount !== undefined) payload.discountAmount = Number(data.discount);
      if (data.total !== undefined) payload.finalValue = Number(data.total);
      if (data.version !== undefined) payload.version = String(data.version);

      if (data.notes !== undefined || data.modules !== undefined) {
        const modulesList = data.modules || ['Real-Time GPS Telematics', 'AI Route Optimizer', 'Driver Mobile App', 'Dispatch Board Pro', 'Factoring & Billing API', 'Live Customer Portal'];
        payload.includedModules = JSON.stringify({
          modules: modulesList,
          notes: data.notes || ''
        });
      }

      const response = await api.put(`/proposals/${id}`, payload);
      if (response.data?.success) {
        await this.syncProposals();
        return response.data.data;
      }
    } catch (e) {
      console.error('Error updating proposal in db:', e);
      throw e;
    }
  }

  async createFollowUpTask(data) {
    try {
      const response = await api.post('/follow-up-tasks', {
        leadId: data.leadId,
        type: data.type ? data.type.toUpperCase() : 'CALL',
        description: data.notes || data.description,
        dueDate: data.dueDate ? new Date(data.dueDate) : new Date(),
        status: 'PENDING',
        repId: data.repId || undefined
      });
      if (response.data?.success) {
        await this.syncFollowups();
      }
    } catch (e) {
      console.error('Error creating follow-up task:', e);
    }
  }

  async updateFollowUpTask(id, data) {
    try {
      const payload = {};
      if (data.status) payload.status = data.status.toUpperCase();
      if (data.notes) payload.description = data.notes;
      if (data.dueDate) payload.dueDate = new Date(data.dueDate);

      const response = await api.put(`/follow-up-tasks/${id}`, payload);
      if (response.data?.success) {
        await this.syncFollowups();
      }
    } catch (e) {
      console.error('Error updating follow-up task:', e);
    }
  }
}

export const crmRepository = new CRMRepository();
