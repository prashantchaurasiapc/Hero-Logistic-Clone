const fs = require('fs');
const path = require('path');
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

// Save Base64 Photo to public/uploads directory
const saveBase64Photo = (photoData) => {
  if (!photoData || typeof photoData !== 'string') return null;
  if (!photoData.startsWith('data:image')) {
    return photoData;
  }
  try {
    const matches = photoData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return null;
    }
    const type = matches[1];
    const data = Buffer.from(matches[2], 'base64');
    
    const publicDir = path.join(__dirname, '../../public');
    const uploadsDir = path.join(publicDir, 'uploads');
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const ext = type.split('/')[1] || 'png';
    const uniqueFilename = `vehicle-${Date.now()}-${Math.round(Math.random() * 1E6)}.${ext}`;
    const filePath = path.join(uploadsDir, uniqueFilename);
    fs.writeFileSync(filePath, data);
    return `/uploads/${uniqueFilename}`;
  } catch (err) {
    console.error('Failed to save base64 vehicle image:', err);
    return null;
  }
};

const ALLOWED_VEHICLE_FIELDS = new Set([
  'rego', 'plate', 'make', 'model', 'category', 'color', 'vin', 
  'engineNumber', 'odometerKm', 'maintenanceDueKm', 'fuelType', 'regType', 
  'regState', 'regIssueDate', 'regExpiryDate', 'maxDistPerTripKm', 
  'primaryMechanic', 'preferredRoutes', 'preferredRegions', 'dgCertified', 
  'hvCertified', 'status', 'companyId', 'currentLocation', 
  'currentSpeed', 'fuelLevel', 'engineTemp', 'lastPing', 'currentDriverId', 'branchId', 'photoUrl'
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

  if (rawPayload.maintenanceDueKm !== undefined && rawPayload.maintenanceDueKm !== null) {
    const num = parseInt(String(rawPayload.maintenanceDueKm).replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num)) clean.maintenanceDueKm = num;
  }

  if (rawPayload.maxDistPerTripKm !== undefined && rawPayload.maxDistPerTripKm !== null) {
    const num = parseInt(String(rawPayload.maxDistPerTripKm).replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num)) clean.maxDistPerTripKm = num;
  }

  const rawPhoto = rawPayload.photoUrl ?? rawPayload.avatarUrl ?? rawPayload.img ?? rawPayload.photoPreview;
  if (rawPhoto !== undefined) {
    clean.photoUrl = saveBase64Photo(rawPhoto);
  }

  [
    'regType', 'regState', 'fuelType', 'color', 'engineNumber',
    'primaryMechanic', 'preferredRoutes', 'preferredRegions', 'currentLocation',
    'currentDriverId', 'branchId'
  ].forEach(field => {
    if (rawPayload[field] !== undefined) {
      clean[field] = rawPayload[field] ? String(rawPayload[field]).trim() : null;
    }
  });

  if (rawPayload.dgCertified !== undefined) clean.dgCertified = Boolean(rawPayload.dgCertified);
  if (rawPayload.hvCertified !== undefined) clean.hvCertified = Boolean(rawPayload.hvCertified);

  // Filter only allowed vehicle fields
  const filteredClean = {};
  for (const [key, val] of Object.entries(clean)) {
    if (ALLOWED_VEHICLE_FIELDS.has(key)) {
      filteredClean[key] = val;
    }
  }

  return filteredClean;
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

    let validCategory = 'TRUCK';
    if (rawPayload.category) {
      const c = String(rawPayload.category).toUpperCase();
      if (['TRUCK', 'TRAILER'].includes(c)) validCategory = c;
    }

    let validStatus = 'IDLE';
    if (rawPayload.status) {
      const s = String(rawPayload.status).toUpperCase().replace(/\s+/g, '_');
      if (['IN_TRANSIT', 'IDLE', 'MAINTENANCE', 'ALERT'].includes(s)) validStatus = s;
      else if (s === 'ACTIVE' || s === 'AVAILABLE') validStatus = 'IDLE';
    }

    const regoVal = rawPayload.rego && String(rawPayload.rego).trim() ? String(rawPayload.rego).trim() : `REG-${Math.floor(10000 + Math.random() * 90000)}`;
    const vinVal = rawPayload.vin && String(rawPayload.vin).trim() ? String(rawPayload.vin).trim() : `VIN-${Math.floor(100000 + Math.random() * 900000)}`;
    const photoUrlVal = saveBase64Photo(rawPayload.photoUrl || rawPayload.avatarUrl || rawPayload.img || rawPayload.photoPreview || null);

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
      photoUrl: photoUrlVal,
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
