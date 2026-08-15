import { crmStore } from './crmStore';
import api, { updateLeadStage, assignLeadRep, getSalesReps } from './api';

const STORAGE_KEY = 'hero_crm_leads';
const DEMOS_KEY = 'hero_crm_demos';
const PROPOSALS_KEY = 'hero_crm_proposals';
const FOLLOWUPS_KEY = 'hero_crm_followups';
const REPS_KEY = 'hero_crm_reps';
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
    this.syncWithBackend();
  }

  async syncWithBackend() {
    try {
      // 1. Fetch leads
      const leadsRes = await api.get('/leads');
      if (leadsRes.data && Array.isArray(leadsRes.data.data)) {
        const mapped = leadsRes.data.data.map(mapLeadToFrontend);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
      }

      // 2. Fetch demos
      const demosRes = await api.get('/demo-bookings');
      if (demosRes.data && Array.isArray(demosRes.data.data)) {
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
      }

      // 3. Fetch proposals
      const proposalsRes = await api.get('/proposals');
      if (proposalsRes.data && Array.isArray(proposalsRes.data.data)) {
        const mappedProposals = proposalsRes.data.data.map(p => ({
          id: p.id,
          leadId: p.leadId,
          proposalRef: p.proposalRef,
          title: `Proposal - ${p.lead?.companyName || 'Client'}`,
          company: p.lead?.companyName || 'Client',
          value: p.baseValue,
          discount: p.discountAmount,
          tax: 10,
          total: p.finalValue,
          validity: `${p.validityDays} Days`,
          status: p.status === 'SENT' ? 'Sent' : p.status === 'ACCEPTED' ? 'Accepted' : p.status === 'REJECTED' ? 'Rejected' : 'Draft',
          version: p.version,
          createdDate: p.createdAt ? p.createdAt.split('T')[0] : ''
        }));
        localStorage.setItem(PROPOSALS_KEY, JSON.stringify(mappedProposals));
      }

      // 4. Fetch followups
      const tasksRes = await api.get('/follow-up-tasks');
      if (tasksRes.data && Array.isArray(tasksRes.data.data)) {
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
      }

      // 5. Fetch sales reps
      const repsRes = await getSalesReps().catch(() => null);
      if (repsRes?.data && Array.isArray(repsRes.data.data)) {
        localStorage.setItem(REPS_KEY, JSON.stringify(repsRes.data.data));
      }

      // Notify UI
      crmStore.notify();
    } catch (error) {
      console.error('Error synchronizing CRM with backend database:', error);
    }
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
    return leads.filter(l => l.stage === 'Trial Started').map(l => ({
      id: `T-${l.id}`,
      leadId: l.id,
      company: l.company,
      admin: l.name,
      status: 'Active',
      daysRemaining: 14,
      startDate: new Date().toISOString().split('T')[0],
      mostUsedModule: 'Live GPS Tracking',
      activeUsers: 3,
      storage: '0.2 GB'
    }));
  }

  getHandovers() {
    const leads = this.getLeads();
    return leads.filter(l => l.stage === 'Won').map(l => ({
      id: `HO-${l.id}`,
      leadId: l.id,
      company: l.company,
      owner: l.rep,
      targetDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      progress: 50,
      status: 'In Progress'
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
        phone: data.phone,
        fleetSize: String(data.fleetSize),
        transportNiche: data.niche,
        estimatedValue: Number(data.revenue) || 0,
        score: Number(data.score) || 60,
        stage: mapStageToBackend(data.stage),
        painPoints: data.painPoints || data.notes || '',
        currentSoftware: data.currentSoftware || '',
        source: data.tags || data.source || 'Direct',
        repId: data.repId || undefined
      });
      if (response.data?.success) {
        await this.syncWithBackend();
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
        await this.syncWithBackend();
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
        await this.syncWithBackend();
      }
    } catch (e) {
      console.error('Error updating lead stage in db:', e);
    }
  }

  async assignLead(id, repId) {
    try {
      const response = await assignLeadRep(id, { repId });
      if (response.data?.success) {
        await this.syncWithBackend();
      }
    } catch (e) {
      console.error('Error assigning lead rep in db:', e);
    }
  }

  async deleteLead(id) {
    try {
      await api.delete(`/leads/${id}`);
      await this.syncWithBackend();
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
        await this.syncWithBackend();
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
        await this.syncWithBackend();
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
        await this.syncWithBackend();
      }
    } catch (e) {
      console.error('Error logging demo feedback:', e);
    }
  }

  async createProposal(data) {
    try {
      const response = await api.post('/proposals', {
        proposalRef: `PROP-${Math.floor(100 + Math.random() * 900)}`,
        leadId: data.leadId,
        baseValue: Number(data.value) || 0,
        discountAmount: Number(data.discount) || 0,
        finalValue: (Number(data.value) || 0) - (Number(data.discount) || 0),
        validityDays: Number(data.validityDays) || 30,
        status: data.status ? data.status.toUpperCase() : 'DRAFT',
        includedModules: JSON.stringify(data.modules || ['Real-Time GPS', 'Driver Portal'])
      });
      if (response.data?.success) {
        await this.syncWithBackend();
        return response.data.data;
      }
    } catch (e) {
      console.error('Error creating proposal in db:', e);
    }
  }

  async updateProposal(id, data) {
    try {
      const payload = {};
      if (data.status) payload.status = data.status.toUpperCase();
      if (data.value !== undefined) payload.baseValue = Number(data.value);
      if (data.discount !== undefined) payload.discountAmount = Number(data.discount);
      if (data.total !== undefined) payload.finalValue = Number(data.total);

      const response = await api.put(`/proposals/${id}`, payload);
      if (response.data?.success) {
        await this.syncWithBackend();
      }
    } catch (e) {
      console.error('Error updating proposal in db:', e);
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
        await this.syncWithBackend();
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
        await this.syncWithBackend();
      }
    } catch (e) {
      console.error('Error updating follow-up task:', e);
    }
  }
}

export const crmRepository = new CRMRepository();
