const prisma = require('../utils/prismaClient');
const { sendSuccess, sendList, sendError } = require('../utils/apiResponse');
const { buildPrismaQuery, buildPaginationMeta } = require('../utils/queryBuilder');
const { HTTP_STATUS, ERROR_CODES } = require('../config/constants');

// Get all Vehicles with pagination, sorting and filtering
exports.getAll = async (req, res, next) => {
  try {
    const { where, skip, take, orderBy, currentPage, pageSize } = buildPrismaQuery(req.query);
    
    if (req.tenantId) where.companyId = req.tenantId;
    if (req.user && req.user.role === 'DISPATCHER' && req.user.branchId && !req.user.permissions?.includes('dispatch.cross_branch.view')) {
      where.branchId = req.user.branchId;
    }

    const [data, total] = await Promise.all([
      prisma.vehicle.findMany({
        where, skip, take, orderBy,
        include: {
          currentDriver: true,
          company: true,
          truckLoads: { take: 5, orderBy: { createdAt: 'desc' } }
        }
      }),
      prisma.vehicle.count({ where })
    ]);

    const meta = buildPaginationMeta(total, currentPage, pageSize, req.query.sort);
    return sendList(res, data, meta);
  } catch (error) {
    next(error);
  }
};

// Get single Vehicle by ID
exports.getById = async (req, res, next) => {
  try {
    const where = { id: req.params.id };
    if (req.tenantId) where.companyId = req.tenantId;
    if (req.user && req.user.role === 'DISPATCHER' && req.user.branchId && !req.user.permissions?.includes('dispatch.cross_branch.view')) {
      where.branchId = req.user.branchId;
    }

    const data = await prisma.vehicle.findFirst({
      where,
      include: {
        currentDriver: true,
        company: true,
        truckLoads: true,
        telemetryHistory: { take: 10, orderBy: { timestamp: 'desc' } }
      }
    });
    
    if (!data) {
      return sendError(res, {
        code: ERROR_CODES.NOT_FOUND,
        message: 'Vehicle not found'
      }, HTTP_STATUS.NOT_FOUND);
    }
    
    return sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
};

const ALLOWED_VEHICLE_FIELDS = new Set([
  'id', 'rego', 'plate', 'make', 'model', 'category', 'color', 'vin', 
  'engineNumber', 'odometerKm', 'maintenanceDueKm', 'fuelType', 'regType', 
  'regState', 'regIssueDate', 'regExpiryDate', 'maxDistPerTripKm', 
  'primaryMechanic', 'preferredRoutes', 'preferredRegions', 'dgCertified', 
  'hvCertified', 'notes', 'status', 'companyId', 'currentLocation', 
  'currentSpeed', 'fuelLevel', 'engineTemp', 'lastPing', 'currentDriverId', 'branchId'
]);

const sanitizePayload = (rawPayload) => {
  const clean = {};

  if (rawPayload.rego) clean.rego = String(rawPayload.rego).trim();
  if (rawPayload.plate) clean.plate = String(rawPayload.plate).trim();
  if (rawPayload.vin) clean.vin = String(rawPayload.vin).trim();

  if (rawPayload.make !== undefined) {
    const makeStr = String(rawPayload.make || '').trim();
    if (makeStr.includes(' ') && !rawPayload.model) {
      const parts = makeStr.split(' ');
      clean.make = parts[0];
      clean.model = parts.slice(1).join(' ');
    } else {
      clean.make = makeStr;
    }
  }

  if (rawPayload.model !== undefined && !clean.model) {
    clean.model = String(rawPayload.model || '').trim();
  }

  if (rawPayload.status) {
    const s = String(rawPayload.status).toUpperCase().replace(/\s+/g, '_');
    if (['IN_TRANSIT', 'IDLE', 'MAINTENANCE', 'ALERT'].includes(s)) {
      clean.status = s;
    } else if (s === 'ACTIVE' || s === 'AVAILABLE') {
      clean.status = 'IDLE';
    } else if (s === 'OUT_OF_SERVICE') {
      clean.status = 'ALERT';
    }
  }

  if (rawPayload.category) {
    const c = String(rawPayload.category).toUpperCase();
    if (['TRUCK', 'TRAILER'].includes(c)) {
      clean.category = c;
    } else {
      clean.category = 'TRUCK';
    }
  }

  if (rawPayload.odometerKm !== undefined && rawPayload.odometerKm !== null) {
    const num = parseInt(String(rawPayload.odometerKm).replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num)) clean.odometerKm = num;
  }

  if (rawPayload.notes !== undefined) {
    clean.notes = rawPayload.notes;
  }
  if (rawPayload.branchId !== undefined) {
    clean.branchId = rawPayload.branchId;
  }
  if (rawPayload.year) {
    clean.notes = clean.notes ? `${clean.notes} | Year: ${rawPayload.year}` : `Year: ${rawPayload.year}`;
  }

  return clean;
};

// Create new Vehicle
exports.create = async (req, res, next) => {
  try {
    const rawPayload = { ...req.body };
    if (req.tenantId) {
      rawPayload.companyId = req.tenantId;
    }

    const effectiveCompanyId = rawPayload.companyId || (await prisma.company.findFirst())?.id;
    let branchIdVal = rawPayload.branchId || null;
    if (req.user && req.user.role === 'DISPATCHER' && req.user.branchId && !req.user.permissions?.includes('dispatch.cross_branch.view')) {
      branchIdVal = req.user.branchId;
    }

    const vehicleData = {
      rego: regoVal,
      vin: vinVal,
      make: rawPayload.make || 'Freightliner',
      model: rawPayload.model || 'Cascadia',
      plate: rawPayload.plate || regoVal,
      category: validCategory,
      status: validStatus,
      color: rawPayload.color || null,
      fuelType: rawPayload.fuelType || 'Diesel',
      odometerKm: rawPayload.odometerKm && !isNaN(rawPayload.odometerKm) ? parseInt(rawPayload.odometerKm) : 0,
      maintenanceDueKm: rawPayload.maintenanceDueKm && !isNaN(rawPayload.maintenanceDueKm) ? parseInt(rawPayload.maintenanceDueKm) : null,
      companyId: effectiveCompanyId,
      branchId: branchIdVal
    };

    const data = await prisma.vehicle.create({
      data: vehicleData,
      include: {
        currentDriver: true,
        company: true
      }
    });
    return sendSuccess(res, data, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

// Update Vehicle with Optimistic Concurrency check
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = sanitizePayload(req.body);

    if (req.tenantId) {
      const findWhere = { id, companyId: req.tenantId };
      if (req.user && req.user.role === 'DISPATCHER' && req.user.branchId && !req.user.permissions?.includes('dispatch.cross_branch.view')) {
        findWhere.branchId = req.user.branchId;
      }
      const existing = await prisma.vehicle.findFirst({
        where: findWhere
      });
      if (!existing) {
        return sendError(res, {
          code: ERROR_CODES.NOT_FOUND,
          message: 'Vehicle not found in this company context'
        }, HTTP_STATUS.NOT_FOUND);
      }
    }
    
    const where = { id };

    // Check version if optimistic concurrency is required
    const ifMatch = req.headers ? req.headers['if-match'] : undefined;
    if (ifMatch) {
      where.version = parseInt(ifMatch.replace(/"/g, ''), 10);
    }

    try {
      const data = await prisma.vehicle.update({
        where,
        data: updateData
      });
      return sendSuccess(res, data);
    } catch (e) {
      if (e.code === 'P2025') {
        if (ifMatch) {
          return sendError(res, {
            code: ERROR_CODES.RESOURCE_CONFLICT,
            message: 'Resource was updated by another user or does not exist.'
          }, HTTP_STATUS.CONFLICT);
        }
        return sendError(res, {
          code: ERROR_CODES.NOT_FOUND,
          message: 'Vehicle not found'
        }, HTTP_STATUS.NOT_FOUND);
      }
      throw e;
    }
  } catch (error) {
    next(error);
  }
};

// Delete Vehicle
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.tenantId) {
      const findWhere = { id, companyId: req.tenantId };
      if (req.user && req.user.role === 'DISPATCHER' && req.user.branchId && !req.user.permissions?.includes('dispatch.cross_branch.view')) {
        findWhere.branchId = req.user.branchId;
      }
      const existing = await prisma.vehicle.findFirst({
        where: findWhere
      });
      if (!existing) {
        return sendError(res, {
          code: ERROR_CODES.NOT_FOUND,
          message: 'Vehicle not found in this company context'
        }, HTTP_STATUS.NOT_FOUND);
      }
    }

    const where = { id };

    await prisma.vehicle.delete({ where });
    
    // 204 No Content for successful delete
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return sendError(res, {
        code: ERROR_CODES.NOT_FOUND,
        message: 'Vehicle not found'
      }, HTTP_STATUS.NOT_FOUND);
    }
    next(error);
  }
};
