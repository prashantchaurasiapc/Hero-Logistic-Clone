const prisma = require('../utils/prismaClient');
const { sendSuccess, sendList, sendError } = require('../utils/apiResponse');
const { buildPrismaQuery, buildPaginationMeta } = require('../utils/queryBuilder');
const { HTTP_STATUS, ERROR_CODES } = require('../config/constants');

// Get all Users with pagination, sorting and filtering
exports.getAll = async (req, res, next) => {
  try {
    const { where, skip, take, orderBy, currentPage, pageSize } = buildPrismaQuery(req.query);
    
    // Optional: Inject tenant scope here if applicable
    // if (req.tenantId) where.tenantId = req.tenantId;

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where, skip, take, orderBy,
        include: {
          company: { select: { name: true } }
        }
      }),
      prisma.user.count({ where })
    ]);

    const meta = buildPaginationMeta(total, currentPage, pageSize, req.query.sort);
    return sendList(res, data, meta);
  } catch (error) {
    next(error);
  }
};

// Get single User by ID
exports.getById = async (req, res, next) => {
  try {
    const where = { id: req.params.id };
    // if (req.tenantId) where.tenantId = req.tenantId;

    const data = await prisma.user.findFirst({ where });
    
    if (!data) {
      return sendError(res, {
        code: ERROR_CODES.NOT_FOUND,
        message: 'User not found'
      }, HTTP_STATUS.NOT_FOUND);
    }
    
    return sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
};

// Create new User
exports.create = async (req, res, next) => {
  try {
    const bcrypt = require('bcryptjs');
    const payload = { ...req.body };

    // Format role casing (e.g. COMPANY_ADMIN)
    if (payload.role) {
      payload.role = payload.role.toUpperCase().replace(/ /g, '_');
    }

    // Set userCode if missing
    if (!payload.userCode) {
      payload.userCode = `US-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // Hash password (use default '123456' if frontend did not supply one)
    if (!payload.password) {
      const salt = await bcrypt.genSalt(10);
      payload.password = await bcrypt.hash('123456', salt);
    } else {
      const salt = await bcrypt.genSalt(10);
      payload.password = await bcrypt.hash(payload.password, salt);
    }

    // Handle frontend isActive boolean mapping to status enum
    if (payload.isActive !== undefined) {
      payload.status = payload.isActive ? 'ACTIVE' : 'SUSPENDED';
      delete payload.isActive;
    }

    // Resolve companyId if missing
    if (!payload.companyId) {
      const company = await prisma.company.findFirst();
      if (company) {
        payload.companyId = company.id;
      }
    }

    const data = await prisma.user.create({
      data: payload
    });

    // Strip password out of response
    if (data) {
      delete data.password;
    }

    return sendSuccess(res, data, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

// Update User with Optimistic Concurrency check
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
      const data = await prisma.user.update({
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
          message: 'User not found'
        }, HTTP_STATUS.NOT_FOUND);
      }
      throw e;
    }
  } catch (error) {
    next(error);
  }
};

// Delete User
exports.delete = async (req, res, next) => {
  try {
    const where = { id: req.params.id };
    // if (req.tenantId) where.tenantId = req.tenantId;

    await prisma.user.delete({ where });
    
    // 204 No Content for successful delete
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return sendError(res, {
        code: ERROR_CODES.NOT_FOUND,
        message: 'User not found'
      }, HTTP_STATUS.NOT_FOUND);
    }
    next(error);
  }
};
