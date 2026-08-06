const jwt = require('jsonwebtoken');
const { HTTP_STATUS, ERROR_CODES } = require('../config/constants');
const { sendError } = require('../utils/apiResponse');

/**
 * Verifies JWT from HttpOnly cookie or Authorization Bearer header
 */
exports.verifyToken = (req, res, next) => {
  let token = req.cookies?.accessToken;
  
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendError(res, {
      code: ERROR_CODES.UNAUTHORIZED_ACCESS,
      message: 'Access token is required.'
    }, HTTP_STATUS.UNAUTHORIZED);
  }

  try {
    const secret = process.env.JWT_SECRET || 'fallback-secret-for-dev-only';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, {
      code: ERROR_CODES.UNAUTHORIZED_ACCESS,
      message: 'Invalid or expired access token.'
    }, HTTP_STATUS.UNAUTHORIZED);
  }
};

/**
 * Checks if user has required roles/permissions
 * Usage: router.get('/something', verifyToken, requirePermission('platform.dashboard.view'), controller.method)
 */
exports.requirePermission = (requiredPermission) => {
  return (req, res, next) => {
    // Basic implementation: assuming req.user.permissions is an array of strings
    if (req.user && req.user.permissions && req.user.permissions.includes(requiredPermission)) {
      return next();
    }
    
    // Also allow SUPER_ADMIN to bypass
    if (req.user && req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    return sendError(res, {
      code: ERROR_CODES.UNAUTHORIZED_ACCESS,
      message: 'You do not have permission to perform this action.',
      details: { requiredPermission }
    }, HTTP_STATUS.FORBIDDEN);
  };
};
