import { dispatcherRepository } from './dispatcherRepository';

class DispatcherStore {
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
    return dispatcherRepository.getDispatcherDatabase();
  }

  updateDb(updaterFn) {
    const db = dispatcherRepository.getDispatcherDatabase();
    updaterFn(db);
    if (db.loads) dispatcherRepository.saveLoads(db.loads);
    if (db.drivers) dispatcherRepository.saveDrivers(db.drivers);
    if (db.vehicles) dispatcherRepository.saveVehicles(db.vehicles);
    if (db.customers) dispatcherRepository.saveCustomers(db.customers);
    this.notify();
  }
}

export const dispatcherStore = new DispatcherStore();
