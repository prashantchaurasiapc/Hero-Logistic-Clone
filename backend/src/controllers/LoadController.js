const prisma = require('../utils/prismaClient');
const { sendSuccess, sendList, sendError } = require('../utils/apiResponse');
const { buildPrismaQuery, buildPaginationMeta } = require('../utils/queryBuilder');
const { HTTP_STATUS, ERROR_CODES } = require('../config/constants');
const LoadService = require('../services/LoadService');

// Get all Loads with pagination, sorting and filtering
exports.getAll = async (req, res, next) => {
  try {
    const { where, skip, take, orderBy, currentPage, pageSize } = buildPrismaQuery(req.query);
    
    if (req.tenantId) where.companyId = req.tenantId;

    const [data, total] = await Promise.all([
      prisma.load.findMany({
        where, skip, take, orderBy,
        include: {
          driver: true,
          truck: true,
          trailer: true,
          customer: true,
          stops: true,
          items: true
        }
      }),
      prisma.load.count({ where })
    ]);

    const meta = buildPaginationMeta(total, currentPage, pageSize, req.query.sort);
    return sendList(res, data, meta);
  } catch (error) {
    next(error);
  }
};

// Get single Load by ID
exports.getById = async (req, res, next) => {
  try {
    const where = { id: req.params.id };
    if (req.tenantId) where.companyId = req.tenantId;

    const data = await prisma.load.findFirst({
      where,
      include: {
        driver: true,
        truck: true,
        trailer: true,
        customer: true,
        stops: true,
        items: true,
        proofPhotos: true,
        expenses: true
      }
    });
    
    if (!data) {
      return sendError(res, {
        code: ERROR_CODES.NOT_FOUND,
        message: 'Load not found'
      }, HTTP_STATUS.NOT_FOUND);
    }
    
    return sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
};

// Create new Load
exports.create = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (req.tenantId && !payload.companyId) payload.companyId = req.tenantId;

    if (!payload.companyId) {
      const firstCompany = await prisma.company.findFirst();
      if (firstCompany) {
        payload.companyId = firstCompany.id;
      }
    }

    const data = await prisma.load.create({
      data: payload,
      include: {
        driver: true,
        truck: true,
        customer: true
      }
    });
    return sendSuccess(res, data, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

// Update Load with Optimistic Concurrency check
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    const where = { id };
    // if (req.tenantId) where.tenantId = req.tenantId;

    // Check version if optimistic concurrency is required
    const ifMatch = req.headers['if-match'];
    if (ifMatch) {
      where.version = parseInt(ifMatch.replace(/"/g, ''), 10);
    }

    try {
      const data = await prisma.load.update({
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
          message: 'Load not found'
        }, HTTP_STATUS.NOT_FOUND);
      }
      throw e;
    }
  } catch (error) {
    next(error);
  }
};

// Delete Load
exports.delete = async (req, res, next) => {
  try {
    const where = { id: req.params.id };
    // if (req.tenantId) where.tenantId = req.tenantId;

    await prisma.load.delete({ where });
    
    // 204 No Content for successful delete
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return sendError(res, {
        code: ERROR_CODES.NOT_FOUND,
        message: 'Load not found'
      }, HTTP_STATUS.NOT_FOUND);
    }
    next(error);
  }
};

// Custom: Activate Load
exports.activate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { assignment } = req.body;
    
    // We would pass req.tenantId if tenantResolver was providing it
    const data = await LoadService.activateLoad(id, assignment, req.tenantId);
    
    return sendSuccess(res, data, HTTP_STATUS.OK);
  } catch (error) {
    if (error.code === 'LOAD_ACTIVATION_FAILED') {
      return sendError(res, error, HTTP_STATUS.UNPROCESSABLE_ENTITY);
    }
    next(error);
  }
};

// Custom: Assign resources to Load
exports.assign = async (req, res, next) => {
  try {
    const { id } = req.params;
    const assignment = req.body;
    
    const data = await LoadService.assignResources(id, assignment, req.tenantId);
    return sendSuccess(res, data, HTTP_STATUS.OK);
  } catch (error) {
    next(error);
  }
};

// Custom: Status Transition
exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    
    if (!status) {
      return sendError(res, { code: ERROR_CODES.VALIDATION_ERROR, message: 'Status is required' }, HTTP_STATUS.BAD_REQUEST);
    }

    const data = await LoadService.updateStatus(id, status, reason, req.tenantId);
    return sendSuccess(res, data, HTTP_STATUS.OK);
  } catch (error) {
    next(error);
  }
};
