const assert = require('assert');
const prisma = require('../src/utils/prismaClient');

// Mock request / response objects
function mockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    send(body) {
      this.body = body;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    }
  };
  return res;
}

async function runTests() {
  console.log('--- STARTING COMPANY ADMIN COMPLIANCE TESTS ---');
  let failures = 0;

  // Setup test companies
  const companyA = await prisma.company.create({
    data: { name: `Company A ${Date.now()}`, tenantId: `T-CO-A-${Date.now()}` }
  });
  const companyB = await prisma.company.create({
    data: { name: `Company B ${Date.now()}`, tenantId: `T-CO-B-${Date.now()}` }
  });

  const Ctrl = require('../src/controllers/CompanyAdminPortalController');

  try {
    // Test 1: Tenant Isolation on Customers listing
    console.log('Test 1: Enforcing tenant isolation on Customer lists...');
    
    // Create a customer in Company A and another in Company B
    const custA = await prisma.customer.create({
      data: { name: 'Customer A1', companyId: companyA.id }
    });
    const custB = await prisma.customer.create({
      data: { name: 'Customer B1', companyId: companyB.id }
    });

    // Query customers under Company A tenant context
    const req = {
      tenantId: companyA.id,
      query: {}
    };
    const res = mockRes();
    await Ctrl.getCustomers(req, res, (err) => { if (err) throw err; });

    assert.strictEqual(res.statusCode, 200);
    const customers = res.body.data;
    assert.ok(customers.length > 0);
    assert.ok(customers.every(c => c.companyId === companyA.id));
    assert.ok(!customers.some(c => c.id === custB.id));
    console.log('  ✓ Customer queries strictly scoped to the request tenant.');
  } catch (err) {
    console.error('  ✗ Test 1 failed:', err.message);
    failures++;
  }

  try {
    // Test 2: Dynamic Lane Pricing Calculation on Invoice Drafts
    console.log('Test 2: Dynamic Lane Pricing Rate Calculations...');
    
    // Create a Load in Company A
    const load = await prisma.load.create({
      data: {
        loadRef: `PO-TEST-${Date.now().toString().slice(-4)}`,
        type: 'Car Carrying',
        status: 'DRAFT',
        companyId: companyA.id
      }
    });

    // Create Pickup and Dropoff stops for the Load
    await prisma.routeStop.createMany({
      data: [
        { loadId: load.id, type: 'PICKUP', sequenceIndex: 0, address: 'Sydney, NSW' },
        { loadId: load.id, type: 'DROPOFF', sequenceIndex: 1, address: 'Melbourne, VIC' }
      ]
    });

    // Create a LanePricingRule for Sydney to Melbourne
    await prisma.lanePricingRule.create({
      data: {
        companyId: companyA.id,
        origin: 'Sydney',
        destination: 'Melbourne',
        baseLinehaulRate: 1600.00,
        fuelSurcharge: 15.00 // 15% surcharge
      }
    });

    // Call createLoadInvoice with amount = 0 to trigger automatic pricing calculation
    const req = {
      tenantId: companyA.id,
      params: { id: load.id },
      body: { amount: 0, dueDateTerms: '14 Days' }
    };
    const res = mockRes();
    await Ctrl.createLoadInvoice(req, res, (err) => { if (err) throw err; });

    assert.strictEqual(res.statusCode, 201);
    // Calculated amount should be 1600 * (1 + 0.15) = 1840
    assert.strictEqual(res.body.data.amount, '$1,840.00');
    console.log('  ✓ Dynamic Lane rate calculated correctly: $1,840.00');
  } catch (err) {
    console.error('  ✗ Test 2 failed:', err.message);
    failures++;
  }

  try {
    // Test 3: Approved Timesheet hours mapped to Payroll Run Earnings
    console.log('Test 3: Timesheet parameters mapping to Payroll Run...');

    const driver = await prisma.driver.create({
      data: {
        firstName: 'Test',
        lastName: 'Driver',
        email: `test-driver-${Date.now()}@hero.internal`,
        payType: 'Hourly',
        payRate: 40.00, // $40 per hour
        companyId: companyA.id
      }
    });

    // Create approved timesheets (2 days, 8 hours worked each -> 960 minutes total)
    await prisma.timesheet.createMany({
      data: [
        { driverId: driver.id, date: new Date('2026-08-01'), status: 'APPROVED', workMinutes: 480, companyId: companyA.id },
        { driverId: driver.id, date: new Date('2026-08-02'), status: 'APPROVED', workMinutes: 480, companyId: companyA.id }
      ]
    });

    // Run payroll for driver
    const req = {
      tenantId: companyA.id,
      body: {
        periodStart: '2026-08-01',
        periodEnd: '2026-08-02',
        driverIds: [driver.id],
        basePay: 1000 // fallback base pay
      }
    };
    const res = mockRes();
    await Ctrl.createPayrollRun(req, res, (err) => { if (err) throw err; });

    assert.strictEqual(res.statusCode, 201);
    const payPeriod = res.body.data.payPeriods[0];
    // Earnings should be 16 hours * $40/hr = $640
    assert.strictEqual(payPeriod.grossEarnings, 640.00);
    console.log('  ✓ Driver gross earnings calculated directly from timesheet hours: $640.00');
  } catch (err) {
    console.error('  ✗ Test 3 failed:', err.message);
    failures++;
  }

  // Cleanup test data
  try {
    await prisma.timesheet.deleteMany({ where: { companyId: { in: [companyA.id, companyB.id] } } });
    await prisma.payPeriod.deleteMany({ where: { companyId: { in: [companyA.id, companyB.id] } } });
    await prisma.driver.deleteMany({ where: { companyId: { in: [companyA.id, companyB.id] } } });
    await prisma.lanePricingRule.deleteMany({ where: { companyId: { in: [companyA.id, companyB.id] } } });
    await prisma.customerInvoice.deleteMany({ where: { customer: { companyId: { in: [companyA.id, companyB.id] } } } });
    await prisma.routeStop.deleteMany({ where: { load: { companyId: { in: [companyA.id, companyB.id] } } } });
    await prisma.load.deleteMany({ where: { companyId: { in: [companyA.id, companyB.id] } } });
    await prisma.customer.deleteMany({ where: { companyId: { in: [companyA.id, companyB.id] } } });
    await prisma.company.deleteMany({ where: { id: { in: [companyA.id, companyB.id] } } });
    console.log('  ✓ Test cleanup completed.');
  } catch (err) {
    console.error('Cleanup error:', err.message);
  }

  console.log('----------------------------------------------------');
  if (failures > 0) {
    console.error(`✗ TEST SUITE FAILED with ${failures} assertion failures.`);
    process.exit(1);
  } else {
    console.log('✔ ALL COMPANY ADMIN SPECIFICATION COMPLIANCE TESTS PASSED.');
    process.exit(0);
  }
}

runTests();
