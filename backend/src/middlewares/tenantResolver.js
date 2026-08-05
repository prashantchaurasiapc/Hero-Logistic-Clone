const { HTTP_STATUS, ERROR_CODES } = require('../config/constants');
const { sendError } = require('../utils/apiResponse');
const prisma = require('../utils/prismaClient');

/**
 * Resolves the Tenant Context based on API Specification 3.3
 */
exports.resolveTenant = async (req, res, next) => {
  try {
    let tenantId = null;

    // 1. If impersonation session exists in user token
    if (req.user && req.user.impersonatedTenantId) {
      tenantId = req.user.impersonatedTenantId;
    } 
    // 2. Access token claim
    else if (req.user && req.user.tenantId) {
      tenantId = req.user.tenantId;
    }
    // 3. Subdomain or Custom Domain (Mock implementation)
    else if (req.headers.host) {
      const hostParts = req.headers.host.split('.');
      if (hostParts.length > 2) {
        const subdomain = hostParts[0];
        // In a real app, query database to find tenant by subdomain
        // const tenant = await prisma.tenant.findUnique({ where: { slug: subdomain } });
        // if (tenant) tenantId = tenant.id;
      }
    }

    if (!tenantId) {
      // For Super Admin routes, a tenant ID may not be required. 
      // But for tenant-isolated routes, it is. We attach it to the request.
      req.tenantId = null;
    } else {
      req.tenantId = tenantId;
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to enforce tenant isolation strictly
 */
exports.requireTenant = (req, res, next) => {
  if (!req.tenantId) {
    return sendError(res, {
      code: ERROR_CODES.UNAUTHORIZED_ACCESS,
      message: 'Tenant context is missing. You must operate within a tenant scope.'
    }, HTTP_STATUS.FORBIDDEN);
  }
  next();
};
