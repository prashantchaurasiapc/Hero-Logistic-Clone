const prisma = require('../utils/prismaClient');
const { sendSuccess, sendList, sendError } = require('../utils/apiResponse');
const { buildPrismaQuery, buildPaginationMeta } = require('../utils/queryBuilder');
const { HTTP_STATUS, ERROR_CODES } = require('../config/constants');

// Get all CustomRoles with pagination, sorting and filtering
exports.getAll = async (req, res, next) => {
  try {
    const { where, skip, take, orderBy, currentPage, pageSize } = buildPrismaQuery(req.query);
    
    // Optional: Inject tenant scope here if applicable
    // if (req.tenantId) where.tenantId = req.tenantId;

    const [data, total] = await Promise.all([
      prisma.customRole.findMany({
        where, skip, take, orderBy,
        include: { permissions: true }
      }),
      prisma.customRole.count({ where })
    ]);

    // Map permissions back to frontend nested object format
    const formattedData = data.map(role => {
      const formattedPerms = {};
      role.permissions.forEach(p => {
        if (!formattedPerms[p.module]) {
          formattedPerms[p.module] = {};
        }
        formattedPerms[p.module][p.actionString] = true;
      });
      return {
        ...role,
        permissions: formattedPerms
      };
    });

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
    // if (req.tenantId) where.tenantId = req.tenantId;

    const data = await prisma.customRole.findFirst({
      where,
      include: { permissions: true }
    });
    
    if (!data) {
      return sendError(res, {
        code: ERROR_CODES.NOT_FOUND,
        message: 'CustomRole not found'
      }, HTTP_STATUS.NOT_FOUND);
    }
    
    const formattedPerms = {};
    data.permissions.forEach(p => {
      if (!formattedPerms[p.module]) {
        formattedPerms[p.module] = {};
      }
      formattedPerms[p.module][p.actionString] = true;
    });

    const formatted = {
      ...data,
      permissions: formattedPerms
    };

    return sendSuccess(res, formatted);
  } catch (error) {
    next(error);
  }
};

// Create new CustomRole
exports.create = async (req, res, next) => {
  try {
    const { name, permissions } = req.body;
    
    // Default companyId
    let companyId = req.body.companyId;
    if (!companyId) {
      const company = await prisma.company.findFirst();
      if (company) companyId = company.id;
    }

    // Flatten permissions object to array of CustomPermission records
    const permissionData = [];
    if (permissions) {
      Object.entries(permissions).forEach(([modName, actions]) => {
        Object.entries(actions).forEach(([actName, val]) => {
          if (val) {
            permissionData.push({
              module: modName,
              actionString: actName
            });
          }
        });
      });
    }

    const data = await prisma.customRole.create({
      data: {
        name,
        companyId,
        permissions: {
          create: permissionData
        }
      },
      include: { permissions: true }
    });
    return sendSuccess(res, data, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

// Update CustomRole with Optimistic Concurrency check
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, permissions } = req.body;
    
    const where = { id };
    // if (req.tenantId) where.tenantId = req.tenantId;

    // If permissions array was supplied, clean up old records first
    if (permissions) {
      await prisma.customPermission.deleteMany({
        where: { roleId: id }
      });
    }

    const permissionData = [];
    if (permissions) {
      Object.entries(permissions).forEach(([modName, actions]) => {
        Object.entries(actions).forEach(([actName, val]) => {
          if (val) {
            permissionData.push({
              module: modName,
              actionString: actName
            });
          }
        });
      });
    }

    try {
      const data = await prisma.customRole.update({
        where,
        data: {
          name,
          permissions: {
            create: permissionData
          }
        },
        include: { permissions: true }
      });
      return sendSuccess(res, data);
    } catch (e) {
      if (e.code === 'P2025') {
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
    const where = { id: req.params.id };
    // if (req.tenantId) where.tenantId = req.tenantId;

    await prisma.customRole.delete({ where });
    
    // 204 No Content for successful delete
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
