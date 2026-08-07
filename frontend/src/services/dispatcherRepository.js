import api from './api';
import { dispatcherStore } from './dispatcherStore';

const LOADS_KEY = 'hero_dispatch_loads';
const DRIVERS_KEY = 'hero_dispatch_drivers';
const VEHICLES_KEY = 'hero_dispatch_vehicles';
const CUSTOMERS_KEY = 'hero_dispatch_customers';

function mapLoadToFrontend(l) {
  // Map backend status to frontend display status
  let status = 'Planned';
  if (l.status === 'IN_TRANSIT') status = 'In Transit';
  if (l.status === 'ASSIGNED') status = 'Pending Dispatch';
  if (l.status === 'DRAFT') status = 'Pending Dispatch';
  if (l.status === 'DELIVERED') status = 'Completed';
  if (l.status === 'CANCELLED') status = 'On Hold';

  let tabCategory = 'Planned';
  if (status === 'In Transit' || status === 'Delayed') tabCategory = 'Active';
  if (status === 'Completed') tabCategory = 'Completed';

  // Extract route destinations from notes or defaults
  let routeFrom = 'Sydney';
  let routeTo = 'Melbourne';
  if (l.notes && l.notes.includes(' to ')) {
    const parts = l.notes.split(' to ');
    routeFrom = parts[0] || 'Sydney';
    routeTo = parts[1] || 'Melbourne';
  }

  return {
    id: l.loadRef || l.id,
    dbId: l.id,
    customer: l.customer?.name || 'Customer Ltd',
    routeFrom,
    routeTo,
    status,
    date: l.loadDate ? l.loadDate.split('T')[0] : '25 May 2026',
    vehicle: l.truck ? `${l.truck.make} ${l.truck.model}` : 'Volvo FH16 750',
    depot: 'Sydney Depot',
    driver: l.driver ? `${l.driver.firstName} ${l.driver.lastName}` : 'John Doe',
    itemsCount: 8,
    passengers: 1,
    tabCategory
  };
}

class DispatcherRepository {
  constructor() {
    this.syncWithBackend();
  }

  async syncWithBackend() {
    try {
      // 1. Fetch loads
      const loadsRes = await api.get('/loads');
      if (loadsRes.data && Array.isArray(loadsRes.data.data)) {
        const mapped = loadsRes.data.data.map(mapLoadToFrontend);
        localStorage.setItem(LOADS_KEY, JSON.stringify(mapped));
      }

      // 2. Fetch drivers
      const driversRes = await api.get('/drivers');
      if (driversRes.data && Array.isArray(driversRes.data.data)) {
        const mappedDrivers = driversRes.data.data.map(d => ({
          id: d.id,
          name: `${d.firstName} ${d.lastName}`,
          status: 'On Duty',
          vehicle: 'Scania R650',
          loadId: 'LD-10581',
          location: 'Near Brisbane',
          telemetry: '78 km/h'
        }));
        localStorage.setItem(DRIVERS_KEY, JSON.stringify(mappedDrivers));
      }

      // 3. Fetch vehicles
      const vehiclesRes = await api.get('/vehicles');
      if (vehiclesRes.data && Array.isArray(vehiclesRes.data.data)) {
        localStorage.setItem(VEHICLES_KEY, JSON.stringify(vehiclesRes.data.data));
      }

      // 4. Fetch customers
      const customersRes = await api.get('/customers');
      if (customersRes.data && Array.isArray(customersRes.data.data)) {
        localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customersRes.data.data));
      }

      dispatcherStore.notify();
    } catch (e) {
      console.error('Error syncing Dispatcher data with database:', e);
    }
  }

  getLoads() {
    return JSON.parse(localStorage.getItem(LOADS_KEY)) || [];
  }

  saveLoads(loads) {
    localStorage.setItem(LOADS_KEY, JSON.stringify(loads));
    dispatcherStore.notify();
  }

  getDrivers() {
    return JSON.parse(localStorage.getItem(DRIVERS_KEY)) || [];
  }

  saveDrivers(drivers) {
    localStorage.setItem(DRIVERS_KEY, JSON.stringify(drivers));
    dispatcherStore.notify();
  }

  getVehicles() {
    return JSON.parse(localStorage.getItem(VEHICLES_KEY)) || [];
  }

  saveVehicles(vehicles) {
    localStorage.setItem(VEHICLES_KEY, JSON.stringify(vehicles));
    dispatcherStore.notify();
  }

  getCustomers() {
    return JSON.parse(localStorage.getItem(CUSTOMERS_KEY)) || [];
  }

  saveCustomers(customers) {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
    dispatcherStore.notify();
  }

  getDispatcherDatabase() {
    return {
      loads: this.getLoads(),
      drivers: this.getDrivers(),
      vehicles: this.getVehicles(),
      customers: this.getCustomers()
    };
  }

  async createLoad(data) {
    try {
      // Find customer ID by name, or get first
      const custs = this.getCustomers();
      const customerId = custs.find(c => c.name === data.customer)?.id || custs[0]?.id;

      // Find driver ID
      const drvs = this.getDrivers();
      const driverId = drvs.find(d => d.name === data.driver)?.id || drvs[0]?.id;

      // Find truck ID
      const vhcs = this.getVehicles();
      const truckId = vhcs.find(v => `${v.make} ${v.model}` === data.vehicle)?.id || vhcs[0]?.id;

      const response = await api.post('/loads', {
        loadRef: `LD-${Math.floor(10000 + Math.random() * 90000)}`,
        type: 'General Freight',
        status: data.status === 'In Transit' ? 'IN_TRANSIT' : 'PLANNED',
        priority: 'NORMAL',
        loadDate: new Date(data.reqDate || Date.now()),
        notes: `${data.routeFrom} to ${data.routeTo}`,
        customerId,
        driverId,
        truckId
      });

      if (response.data?.success) {
        await this.syncWithBackend();
        return response.data.data;
      }
    } catch (e) {
      console.error('Error creating load in db:', e);
    }
  }

  async updateLoad(id, data) {
    try {
      // Find db ID if id is loadRef
      const allLoads = this.getLoads();
      const targetLoad = allLoads.find(l => l.id === id || l.dbId === id);
      if (!targetLoad) return;

      const dbId = targetLoad.dbId || targetLoad.id;

      const payload = {};
      if (data.status) {
        payload.status = data.status === 'In Transit' ? 'IN_TRANSIT' : data.status === 'Completed' ? 'DELIVERED' : 'PLANNED';
      }
      if (data.routeFrom && data.routeTo) {
        payload.notes = `${data.routeFrom} to ${data.routeTo}`;
      }

      const response = await api.put(`/loads/${dbId}`, payload);
      if (response.data?.success) {
        await this.syncWithBackend();
      }
    } catch (e) {
      console.error('Error updating load in db:', e);
    }
  }

  async deleteLoad(id) {
    try {
      const allLoads = this.getLoads();
      const targetLoad = allLoads.find(l => l.id === id || l.dbId === id);
      if (!targetLoad) return;

      const dbId = targetLoad.dbId || targetLoad.id;

      const response = await api.delete(`/loads/${dbId}`);
      if (response.data?.success) {
        await this.syncWithBackend();
      }
    } catch (e) {
      console.error('Error deleting load in db:', e);
    }
  }
}

export const dispatcherRepository = new DispatcherRepository();
