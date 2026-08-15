const prisma = require('../utils/prismaClient');
const { sendSuccess, sendList, sendError } = require('../utils/apiResponse');
const { buildPrismaQuery, buildPaginationMeta } = require('../utils/queryBuilder');
const { HTTP_STATUS, ERROR_CODES } = require('../config/constants');

// Get all Drivers with pagination, sorting and filtering
exports.getAll = async (req, res, next) => {
  try {
    const { where, skip, take, orderBy, currentPage, pageSize } = buildPrismaQuery(req.query);
    
    if (req.tenantId) where.companyId = req.tenantId;

    const [data, total] = await Promise.all([
      prisma.driver.findMany({
        where, skip, take, orderBy,
        include: {
          branch: true,
          manager: true,
          currentVehicle: true,
          loads: { take: 5, orderBy: { createdAt: 'desc' } }
        }
      }),
      prisma.driver.count({ where })
    ]);

    const meta = buildPaginationMeta(total, currentPage, pageSize, req.query.sort);
    return sendList(res, data, meta);
  } catch (error) {
    next(error);
  }
};

// Get single Driver by ID
exports.getById = async (req, res, next) => {
  try {
    const where = { id: req.params.id };
    if (req.tenantId) where.companyId = req.tenantId;

    const data = await prisma.driver.findFirst({
      where,
      include: {
        branch: true,
        manager: true,
        currentVehicle: true,
        loads: true,
        preStartChecklists: { take: 5, orderBy: { createdAt: 'desc' } },
        timesheets: { take: 5, orderBy: { createdAt: 'desc' } }
      }
    });
    
    if (!data) {
      return sendError(res, {
        code: ERROR_CODES.NOT_FOUND,
        message: 'Driver not found'
      }, HTTP_STATUS.NOT_FOUND);
    }
    
    return sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
};

// Create new Driver
exports.create = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (req.tenantId) {
      payload.companyId = req.tenantId;
    }

    const effectiveCompanyId = payload.companyId || (await prisma.company.findFirst())?.id;

    let validStatus = 'AVAILABLE';
    if (payload.status) {
      const s = String(payload.status).toUpperCase().replace(/\s+/g, '_');
      if (['ON_DUTY', 'OFF_DUTY', 'ON_LEAVE', 'UNAVAILABLE', 'AVAILABLE'].includes(s)) {
        validStatus = s;
      }
    }

    const driverData = {
      firstName: payload.firstName || payload.FirstName || null,
      lastName: payload.lastName || payload.LastName || null,
      phone: payload.phone || payload.PhoneNumber || null,
      email: payload.email || payload.EmailAddress || null,
      avatarUrl: payload.avatarUrl || payload.photoPreview || payload.avatar || null,
      driverCode: payload.driverCode || payload.EmployeeIDManualEditOption || `DRV-${Math.floor(10000 + Math.random() * 90000)}`,
      licenseType: payload.licenceType || payload.licenseType || 'HR (Heavy Rigid)',
      licenseNumber: payload.licenceNumber || payload.licenseNumber || `LIC-${Math.floor(10000 + Math.random() * 90000)}`,
      status: validStatus,
      role: payload.role || payload.driverRole || 'Driver',
      category: payload.category || payload.driverCategory || 'Heavy Rig',
      shift: payload.shift || 'Morning',
      notes: payload.notes || null,
      companyId: effectiveCompanyId
    };

    if (payload.dob) {
      const d = new Date(payload.dob);
      if (!isNaN(d.getTime())) driverData.joiningDate = d;
    }

    const data = await prisma.driver.create({
      data: driverData,
      include: {
        branch: true,
        manager: true
      }
    });
    return sendSuccess(res, data, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

const sanitizeDriverPayload = (rawPayload) => {
  const data = {};

  if (rawPayload.firstName !== undefined || rawPayload.FirstName !== undefined) {
    data.firstName = rawPayload.firstName || rawPayload.FirstName || null;
  }
  if (rawPayload.lastName !== undefined || rawPayload.LastName !== undefined) {
    data.lastName = rawPayload.lastName || rawPayload.LastName || null;
  }
  if (rawPayload.driverCode !== undefined || rawPayload.EmployeeIDManualEditOption !== undefined) {
    data.driverCode = rawPayload.driverCode || rawPayload.EmployeeIDManualEditOption || null;
  }
  if (rawPayload.avatarUrl !== undefined || rawPayload.avatar !== undefined || rawPayload.photoPreview !== undefined) {
    data.avatarUrl = rawPayload.avatarUrl || rawPayload.avatar || rawPayload.photoPreview || null;
  }
  if (rawPayload.phone !== undefined || rawPayload.PhoneNumber !== undefined) {
    data.phone = rawPayload.phone || rawPayload.PhoneNumber || null;
  }
  if (rawPayload.email !== undefined || rawPayload.EmailAddress !== undefined) {
    const em = (rawPayload.email || rawPayload.EmailAddress || '').trim();
    data.email = em ? em : null;
  }

  const lType = rawPayload.licenseType || rawPayload.licenceType || rawPayload.LicenceType;
  if (lType !== undefined) data.licenseType = lType;

  const lNum = rawPayload.licenseNumber || rawPayload.licenceNumber || rawPayload.LicenceNumber;
  if (lNum !== undefined) data.licenseNumber = lNum;

  if (rawPayload.status) {
    const s = String(rawPayload.status).toUpperCase().replace(/\s+/g, '_');
    if (['ON_DUTY', 'OFF_DUTY', 'ON_LEAVE', 'UNAVAILABLE', 'AVAILABLE'].includes(s)) {
      data.status = s;
    }
  }

  if (rawPayload.employmentType) {
    const e = String(rawPayload.employmentType).toUpperCase().replace(/\s+/g, '_');
    if (['FULL_TIME', 'PART_TIME', 'CASUAL', 'CONTRACTOR'].includes(e)) {
      data.employmentType = e;
    }
  }

  if (rawPayload.role !== undefined) data.role = rawPayload.role;
  if (rawPayload.category !== undefined) data.category = rawPayload.category;
  if (rawPayload.shift !== undefined) data.shift = rawPayload.shift;
  if (rawPayload.notes !== undefined) data.notes = rawPayload.notes;

  if (rawPayload.dob) {
    const d = new Date(rawPayload.dob);
    if (!isNaN(d.getTime())) data.dob = d;
  }

  return data;
};

// Update Driver with Optimistic Concurrency check
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = sanitizeDriverPayload(req.body);

    if (req.tenantId) {
      const existing = await prisma.driver.findFirst({
        where: { id, companyId: req.tenantId }
      });
      if (!existing) {
        return sendError(res, {
          code: ERROR_CODES.NOT_FOUND,
          message: 'Driver not found in this company context'
        }, HTTP_STATUS.NOT_FOUND);
      }
    }
    
    const where = { id };

    // Check version if optimistic concurrency is required
    const ifMatch = req.headers['if-match'];
    if (ifMatch) {
      where.version = parseInt(ifMatch.replace(/"/g, ''), 10);
    }

    try {
      const data = await prisma.driver.update({
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
          message: 'Driver not found'
        }, HTTP_STATUS.NOT_FOUND);
      }
      throw e;
    }
  } catch (error) {
    next(error);
  }
};

// Delete Driver
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.tenantId) {
      const existing = await prisma.driver.findFirst({
        where: { id, companyId: req.tenantId }
      });
      if (!existing) {
        return sendError(res, {
          code: ERROR_CODES.NOT_FOUND,
          message: 'Driver not found in this company context'
        }, HTTP_STATUS.NOT_FOUND);
      }
    }

    const where = { id };

    // Clean up or detach related records if any before deleting
    await prisma.document.deleteMany({ where: { driverId: id } }).catch(() => {});
    await prisma.load.updateMany({ where: { driverId: id }, data: { driverId: null } }).catch(() => {});
    await prisma.vehicle.updateMany({ where: { assignedDriverId: id }, data: { assignedDriverId: null } }).catch(() => {});

    await prisma.driver.delete({ where: { id } });
    
    // 204 No Content for successful delete
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return sendError(res, {
        code: ERROR_CODES.NOT_FOUND,
        message: 'Driver not found'
      }, HTTP_STATUS.NOT_FOUND);
    }
    if (error.code === 'P2003') {
      return sendError(res, {
        code: ERROR_CODES.RESOURCE_CONFLICT,
        message: 'Cannot delete driver because active operational records exist.'
      }, HTTP_STATUS.CONFLICT);
    }
    next(error);
  }
};
