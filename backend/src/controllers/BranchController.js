const prisma = require('../utils/prismaClient');
const { sendSuccess, sendList, sendError } = require('../utils/apiResponse');
const { buildPrismaQuery, buildPaginationMeta } = require('../utils/queryBuilder');
const { HTTP_STATUS, ERROR_CODES } = require('../config/constants');

// Get all Branchs with pagination, sorting and filtering
exports.getAll = async (req, res, next) => {
  try {
    const { where, skip, take, orderBy, currentPage, pageSize } = buildPrismaQuery(req.query);
    
    if (req.tenantId) where.companyId = req.tenantId;

    const [data, total] = await Promise.all([
      prisma.branch.findMany({
        where, skip, take, orderBy,
        include: {
          _count: {
            select: { drivers: true, warehouses: true, assets: true }
          }
        }
      }),
      prisma.branch.count({ where })
    ]);

    const meta = buildPaginationMeta(total, currentPage, pageSize, req.query.sort);
    return sendList(res, data, meta);
  } catch (error) {
    next(error);
  }
};

// Get single Branch by ID
exports.getById = async (req, res, next) => {
  try {
    const where = { id: req.params.id };
    if (req.tenantId) where.companyId = req.tenantId;

    const data = await prisma.branch.findFirst({
      where,
      include: {
        drivers: true,
        warehouses: true,
        assets: true
      }
    });
    
    if (!data) {
      return sendError(res, {
        code: ERROR_CODES.NOT_FOUND,
        message: 'Branch not found'
      }, HTTP_STATUS.NOT_FOUND);
    }
    
    return sendSuccess(res, data);
  } catch (error) {
    next(error);
  }
};

// Create new Branch
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

    const data = await prisma.branch.create({
      data: {
        name: payload.name || payload.branchName || 'Branch',
        location: payload.location || payload.address || 'NSW',
        companyId: payload.companyId
      }
    });
    return sendSuccess(res, data, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

// Update Branch with Optimistic Concurrency check
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, location, branchName, address, state } = req.body;
    
    const where = { id };

    try {
      const data = await prisma.branch.update({
        where,
        data: {
          name: name || branchName || undefined,
          location: location || address || state || undefined
        }
      });
      return sendSuccess(res, data);
    } catch (e) {
      if (e.code === 'P2025') {
        return sendError(res, {
          code: ERROR_CODES.NOT_FOUND,
          message: 'Branch not found'
        }, HTTP_STATUS.NOT_FOUND);
      }
      throw e;
    }
  } catch (error) {
    next(error);
  }
};

// Delete Branch
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Disabling foreign key checks temporarily allows clean deletion of branch row in MySQL
    await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS=0`);
    await prisma.$executeRawUnsafe(`DELETE FROM \`branch\` WHERE \`id\` = '${id}'`);
    await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS=1`);
    
    // 204 No Content for successful delete
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (error) {
    try {
      await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS=1`);
    } catch (e) {}

    if (error.code === 'P2025') {
      return res.status(HTTP_STATUS.NO_CONTENT).send();
    }
    next(error);
  }
};
