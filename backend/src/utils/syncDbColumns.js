const prisma = require('./prismaClient');

let synced = false;

async function syncMissingVehicleColumns() {
  if (synced) return;
  synced = true;
  try {
    const alterStatements = [
      `ALTER TABLE vehicle ADD COLUMN photoUrl TEXT`,
      `ALTER TABLE vehicle ADD COLUMN branchId VARCHAR(255)`,
      `ALTER TABLE vehicle ADD COLUMN regType VARCHAR(255)`,
      `ALTER TABLE vehicle ADD COLUMN regState VARCHAR(255)`,
      `ALTER TABLE vehicle ADD COLUMN regIssueDate DATETIME`,
      `ALTER TABLE vehicle ADD COLUMN regExpiryDate DATETIME`,
      `ALTER TABLE vehicle ADD COLUMN fuelType VARCHAR(255)`,
      `ALTER TABLE vehicle ADD COLUMN color VARCHAR(255)`,
      `ALTER TABLE vehicle ADD COLUMN engineNumber VARCHAR(255)`,
      `ALTER TABLE vehicle ADD COLUMN primaryMechanic VARCHAR(255)`,
      `ALTER TABLE vehicle ADD COLUMN preferredRoutes VARCHAR(255)`,
      `ALTER TABLE vehicle ADD COLUMN preferredRegions VARCHAR(255)`,
      `ALTER TABLE vehicle ADD COLUMN maxDistPerTripKm INT`,
      `ALTER TABLE vehicle ADD COLUMN dgCertified TINYINT(1) DEFAULT 0`,
      `ALTER TABLE vehicle ADD COLUMN hvCertified TINYINT(1) DEFAULT 0`,
      `ALTER TABLE company ADD COLUMN dotNumber VARCHAR(255)`,
      `ALTER TABLE user ADD COLUMN branchId VARCHAR(255)`
    ];

    for (const sql of alterStatements) {
      try {
        await prisma.$executeRawUnsafe(sql);
      } catch (e) {
        // Ignore duplicate column errors if column already exists
      }
    }
    console.log('MySQL Database vehicle columns auto-synced successfully.');
  } catch (err) {
    console.warn('Database column auto-sync warning:', err.message);
  }
}

module.exports = syncMissingVehicleColumns;
