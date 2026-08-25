import { crmRepository } from './crmRepository';

class CRMStore {
  constructor() {
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener());
  }

  getDb() {
    return crmRepository.getCrmDatabase();
  }

  updateDb(updaterFn) {
    const db = crmRepository.getCrmDatabase();
    updaterFn(db);
    if (db.leads) crmRepository.saveLeads(db.leads);
    if (db.demos) crmRepository.saveDemos(db.demos);
    if (db.trials) crmRepository.saveTrials(db.trials);
    if (db.crmProposals) crmRepository.saveProposals(db.crmProposals);
    if (db.crmFollowups) crmRepository.saveFollowups(db.crmFollowups);
    if (db.crmHandovers) crmRepository.saveHandovers(db.crmHandovers);
    if (db.crmPipelineStages) crmRepository.saveStages(db.crmPipelineStages);
    if (db.crmAcquisitionSources) crmRepository.saveSources(db.crmAcquisitionSources);
    this.notify();
  }
}

export const crmStore = new CRMStore();

