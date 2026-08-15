import { crmRepository } from './crmRepository';

class CRMWorkflowEngine {
  async handleStageChange(id, newStage, reason, notes) {
    console.log(`Workflow Engine: Lead ${id} moving to ${newStage}. Reason: ${reason}`);
    await crmRepository.updateStage(id, newStage, reason, notes);
  }
}

export const crmWorkflowEngine = new CRMWorkflowEngine();
