import { crmRepository } from './crmRepository';

class CRMWorkflowEngine {
  handleStageChange(id, newStage, reason) {
    const leads = crmRepository.getLeads();
    const lead = leads.find(l => l.id === id);
    if (lead) {
      // Simulate stage change logic and audit trail
      console.log(`Workflow Engine: Lead ${id} moving to ${newStage}. Reason: ${reason}`);
      lead.stage = newStage;
      lead.stageDays = 0; // reset aging
      crmRepository.updateLead(id, lead);
    }
  }
}

export const crmWorkflowEngine = new CRMWorkflowEngine();
