const AuthService = require('../services/AuthService');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { HTTP_STATUS, ERROR_CODES } = require('../config/constants');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // In production, validate body via Joi/Zod here

    const ipAddress = req.ip || req.headers['x-forwarded-for'];
    const userAgent = req.headers['user-agent'];

    const { user, accessToken, refreshToken } = await AuthService.login(email, password, ipAddress, userAgent);

    // Set HttpOnly Cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000 // 15 mins
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Remove password from response
    delete user.password;

    return sendSuccess(res, { user, accessToken }, HTTP_STATUS.OK);
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    
    await AuthService.logout(refreshToken);

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

exports.me = async (req, res, next) => {
  try {
    const prisma = require('../utils/prismaClient');
    const targetId = req.user?.id || req.user?.userId;
    if (!targetId) {
      return sendError(res, { code: ERROR_CODES.UNAUTHORIZED_ACCESS, message: 'Invalid session context' }, HTTP_STATUS.UNAUTHORIZED);
    }
    const freshUser = await prisma.user.findUnique({
      where: { id: targetId },
      include: { customRole: true, company: true }
    });
    if (freshUser) {
      delete freshUser.password;
    }
    return sendSuccess(res, { user: freshUser || req.user }, HTTP_STATUS.OK);
  } catch (error) {
    next(error);
  }
};

exports.impersonate = async (req, res, next) => {
  try {
    const { targetUserId, reason } = req.body;
    const actorId = req.user?.id || req.user?.userId;
    const actorRole = req.user?.role;
    
    // 1. Enforce that the requester is a SUPER_ADMIN or PLATFORM_OWNER
    if (actorRole !== 'SUPER_ADMIN' && actorRole !== 'PLATFORM_OWNER') {
      return sendError(res, {
        code: 'UNAUTHORIZED_ACCESS',
        message: 'Only SUPER_ADMIN or PLATFORM_OWNER roles can initiate impersonation.'
      }, 403);
    }

    const prisma = require('../utils/prismaClient');
    const jwt = require('jsonwebtoken');

    // 2. Verify target user exists and belongs to a tenant company
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: { company: true }
    });

    if (!targetUser) {
      return sendError(res, {
        code: 'NOT_FOUND',
        message: 'Target user not found.'
      }, 404);
    }

    if (!targetUser.companyId) {
      return sendError(res, {
        code: 'INVALID_TARGET_USER',
        message: 'Cannot impersonate platform level users.'
      }, 400);
    }

    // 3. Log the impersonation session audit record
    await prisma.impersonationSession.create({
      data: {
        actorId,
        targetUserId: targetUser.id,
        targetCompanyId: targetUser.companyId,
        reason: reason || 'Platform Support Session',
        ipAddress: req.ip || req.headers['x-forwarded-for'] || null,
        userAgent: req.headers['user-agent'] || null
      }
    });

    // 4. Generate the impersonated accessToken
    const SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only';
    const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';

    const impersonatedToken = jwt.sign(
      {
        userId: targetUser.id,
        role: targetUser.role,
        tenantId: targetUser.companyId,
        impersonatedTenantId: targetUser.companyId,
        actorId,
        isImpersonating: true
      },
      SECRET,
      { expiresIn: EXPIRES_IN }
    );

    // Set cookie
    res.cookie('accessToken', impersonatedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000
    });

    // Remove password
    delete targetUser.password;

    return sendSuccess(res, { user: targetUser, accessToken: impersonatedToken }, HTTP_STATUS.OK);
  } catch (error) {
    next(error);
  }
};

exports.exitImpersonate = async (req, res, next) => {
  try {
    // Check if the current session is actually an impersonated session
    if (!req.user?.isImpersonating || !req.user?.actorId) {
      return sendError(res, {
        code: 'NOT_IMPERSONATING',
        message: 'No active impersonation session found.'
      }, 400);
    }

    const prisma = require('../utils/prismaClient');
    const jwt = require('jsonwebtoken');

    const actor = await prisma.user.findUnique({
      where: { id: req.user.actorId }
    });

    if (!actor || (actor.role !== 'SUPER_ADMIN' && actor.role !== 'PLATFORM_OWNER')) {
      return sendError(res, {
        code: 'UNAUTHORIZED_ACCESS',
        message: 'Unauthorized actor session.'
      }, 401);
    }

    // Terminate the active ImpersonationSession audit log
    const openSession = await prisma.impersonationSession.findFirst({
      where: {
        actorId: actor.id,
        targetUserId: req.user.userId || req.user.id,
        endedAt: null
      },
      orderBy: { startedAt: 'desc' }
    });

    if (openSession) {
      await prisma.impersonationSession.update({
        where: { id: openSession.id },
        data: { endedAt: new Date() }
      });
    }

    // Generate original Super Admin token
    const SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only';
    const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';

    const accessToken = jwt.sign(
      { userId: actor.id, role: actor.role, tenantId: actor.companyId },
      SECRET,
      { expiresIn: EXPIRES_IN }
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000
    });

    // Remove password
    delete actor.password;

    return sendSuccess(res, { user: actor, accessToken }, HTTP_STATUS.OK);
  } catch (error) {
    next(error);
  }
};

