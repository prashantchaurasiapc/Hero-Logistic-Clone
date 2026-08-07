const prisma = require('../utils/prismaClient');
const { sendSuccess, sendList, sendError } = require('../utils/apiResponse');
const { buildPrismaQuery, buildPaginationMeta } = require('../utils/queryBuilder');
const { HTTP_STATUS, ERROR_CODES } = require('../config/constants');

// Helper to format role permissions for frontend
const formatRolePermissions = (role) => {
  if (!role) return role;
  const permObj = {};
  if (Array.isArray(role.permissions)) {
    role.permissions.forEach(p => {
      try {
        permObj[p.module] = JSON.parse(p.actionString);
      } catch (e) {
        permObj[p.module] = p.actionString;
      }
    });
  }
  return {
    ...role,
    permissions: permObj
  };
};

// Get all CustomRoles with pagination, sorting and filtering
exports.getAll = async (req, res, next) => {
  try {
    const { where, skip, take, orderBy, currentPage, pageSize } = buildPrismaQuery(req.query);
    
    if (req.tenantId) where.companyId = req.tenantId;

    const [data, total] = await Promise.all([
      prisma.customRole.findMany({
        where, skip, take, orderBy
      }),
      prisma.customRole.count({ where })
    ]);

    const formattedData = data.map(formatRolePermissions);
    const meta = buildPaginationMeta(total, currentPage, pageSize, req.query.sort);
    return sendList(res, formattedData, meta);
  } catch (error) {
    next(error);
  }
};

// Get single CustomRole by ID
exports.getById = async (req, res, next) => {
  try {
    const where = { id: req.params.id };
    if (req.tenantId) where.companyId = req.tenantId;

    const data = await prisma.customRole.findFirst({ where });
    
    if (!data) {
      return sendError(res, {
        code: ERROR_CODES.NOT_FOUND,
        message: 'CustomRole not found'
      }, HTTP_STATUS.NOT_FOUND);
    }
    
    return sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
};

// Create new CustomRole
exports.create = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    // if (req.tenantId) payload.tenantId = req.tenantId;

    const data = await prisma.customRole.create({
      data: payload
    });

    return sendSuccess(res, formatRolePermissions(data), HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

// Update CustomRole
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
      const data = await prisma.customRole.update({
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
          message: 'CustomRole not found'
        }, HTTP_STATUS.NOT_FOUND);
      }
      throw e;
    }
  } catch (error) {
    next(error);
  }
};

// Delete CustomRole
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Delete permissions first
    await prisma.customPermission.deleteMany({ where: { roleId: id } });
    await prisma.customRole.delete({ where: { id } });
    
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return sendError(res, {
        code: ERROR_CODES.NOT_FOUND,
        message: 'CustomRole not found'
      }, HTTP_STATUS.NOT_FOUND);
    }
    next(error);
  }
};
