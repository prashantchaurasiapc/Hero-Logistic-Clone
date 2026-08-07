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
        where, skip, take, orderBy,
        include: { permissions: true, users: { select: { id: true, name: true, email: true } } }
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

    const data = await prisma.customRole.findFirst({
      where,
      include: { permissions: true, users: { select: { id: true, name: true, email: true } } }
    });
    
    if (!data) {
      return sendError(res, {
        code: ERROR_CODES.NOT_FOUND,
        message: 'CustomRole not found'
      }, HTTP_STATUS.NOT_FOUND);
    }
    
    return sendSuccess(res, formatRolePermissions(data));
  } catch (error) {
    next(error);
  }
};

// Create new CustomRole
exports.create = async (req, res, next) => {
  try {
    const { name, permissions, description, companyId } = req.body;

    let targetCompanyId = req.tenantId || companyId;
    if (!targetCompanyId) {
      const company = await prisma.company.findFirst();
      if (company) targetCompanyId = company.id;
    }

    const permCreates = [];
    if (permissions && typeof permissions === 'object') {
      for (const [moduleName, actionsObj] of Object.entries(permissions)) {
        const actionString = typeof actionsObj === 'string' ? actionsObj : JSON.stringify(actionsObj);
        permCreates.push({
          module: moduleName,
          actionString
        });
      }
    }

    const roleData = {
      name: name || 'Custom Role',
      companyId: targetCompanyId,
    };

    if (permCreates.length > 0) {
      roleData.permissions = { create: permCreates };
    }

    const data = await prisma.customRole.create({
      data: roleData,
      include: { permissions: true }
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
    const { name, permissions, companyId } = req.body;

    const role = await prisma.customRole.findUnique({ where: { id } });
    if (!role) {
      return sendError(res, { code: ERROR_CODES.NOT_FOUND, message: 'CustomRole not found' }, HTTP_STATUS.NOT_FOUND);
    }

    // Replace permissions if provided
    if (permissions && typeof permissions === 'object') {
      await prisma.customPermission.deleteMany({ where: { roleId: id } });

      const permCreates = [];
      for (const [moduleName, actionsObj] of Object.entries(permissions)) {
        const actionString = typeof actionsObj === 'string' ? actionsObj : JSON.stringify(actionsObj);
        permCreates.push({
          roleId: id,
          module: moduleName,
          actionString
        });
      }

      if (permCreates.length > 0) {
        await prisma.customPermission.createMany({ data: permCreates });
      }
    }

    const updatedRole = await prisma.customRole.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(companyId && { companyId })
      },
      include: { permissions: true }
    });

    return sendSuccess(res, formatRolePermissions(updatedRole));
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
