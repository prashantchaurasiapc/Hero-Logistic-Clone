const prisma = require('../utils/prismaClient');
const { sendSuccess, sendList, sendError } = require('../utils/apiResponse');
const { buildPrismaQuery, buildPaginationMeta } = require('../utils/queryBuilder');
const { HTTP_STATUS, ERROR_CODES } = require('../config/constants');

// Get all FollowUpTasks with pagination, sorting and filtering
exports.getAll = async (req, res, next) => {
  try {
    const { where, skip, take, orderBy, currentPage, pageSize } = buildPrismaQuery(req.query);
    
    // Optional: Inject tenant scope here if applicable
    // if (req.tenantId) where.tenantId = req.tenantId;

    const [data, total] = await Promise.all([
      prisma.followUpTask.findMany({
        where, skip, take, orderBy,
        include: {
          lead: { select: { companyName: true, contactName: true } }
        }
      }),
      prisma.followUpTask.count({ where })
    ]);

    const meta = buildPaginationMeta(total, currentPage, pageSize, req.query.sort);
    return sendList(res, data, meta);
  } catch (error) {
    next(error);
  }
};

// Get single FollowUpTask by ID
exports.getById = async (req, res, next) => {
  try {
    const where = { id: req.params.id };
    // if (req.tenantId) where.tenantId = req.tenantId;

    const data = await prisma.followUpTask.findFirst({ where });
    
    if (!data) {
      return sendError(res, {
        code: ERROR_CODES.NOT_FOUND,
        message: 'FollowUpTask not found'
      }, HTTP_STATUS.NOT_FOUND);
    }
    
    return sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
};

// Create new FollowUpTask
exports.create = async (req, res, next) => {
  try {
    const payload = { ...req.body };

    // Fallback: If repId is not a valid UUID, find a sales user
    let validRep = false;
    if (payload.repId && payload.repId.length === 36) {
      const userExists = await prisma.user.findUnique({
        where: { id: payload.repId }
      });
      if (userExists) validRep = true;
    }

    if (!validRep) {
      const defaultRep = await prisma.user.findFirst({
        where: { role: 'SALES' }
      }) || await prisma.user.findFirst();
      
      if (defaultRep) {
        payload.repId = defaultRep.id;
      }
    }

    // Ensure dueDate is a valid Date
    if (!payload.dueDate) {
      payload.dueDate = new Date();
    } else {
      payload.dueDate = new Date(payload.dueDate);
      if (isNaN(payload.dueDate.getTime())) {
        payload.dueDate = new Date();
      }
    }

    const data = await prisma.followUpTask.create({
      data: payload
    });
    return sendSuccess(res, data, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

// Update FollowUpTask with Optimistic Concurrency check
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
      const data = await prisma.followUpTask.update({
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
          message: 'FollowUpTask not found'
        }, HTTP_STATUS.NOT_FOUND);
      }
      throw e;
    }
  } catch (error) {
    next(error);
  }
};

// Delete FollowUpTask
exports.delete = async (req, res, next) => {
  try {
    const where = { id: req.params.id };
    // if (req.tenantId) where.tenantId = req.tenantId;

    await prisma.followUpTask.delete({ where });
    
    // 204 No Content for successful delete
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return sendError(res, {
        code: ERROR_CODES.NOT_FOUND,
        message: 'FollowUpTask not found'
      }, HTTP_STATUS.NOT_FOUND);
    }
    next(error);
  }
};
