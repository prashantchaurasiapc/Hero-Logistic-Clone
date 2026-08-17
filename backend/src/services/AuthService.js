const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prismaClient');

const SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';
const REFRESH_EXPIRES_IN = '7d';

class AuthService {
  async login(email, password, ipAddress, userAgent) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        customRole: true,
        driverProfile: {
          include: {
            currentVehicle: true
          }
        }
      }
    });

    if (!user) {
      throw { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password', statusCode: 401 };
    }

    if (user.status === 'SUSPENDED') {
      throw { code: 'ACCOUNT_SUSPENDED', message: 'Account is suspended', statusCode: 403 };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password', statusCode: 401 };
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role, tenantId: user.companyId },
      SECRET,
      { expiresIn: EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, version: 1 }, // version could be tracked in DB for global sign-out
      REFRESH_SECRET,
      { expiresIn: REFRESH_EXPIRES_IN }
    );

    // Track Session
    await prisma.userSession.create({
      data: {
        userId: user.id,
        tokenHash: refreshToken, // Normally hash this
        ipAddress,
        userAgent,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    // Resolve permissions with parent-child hierarchy
    const roleSlug = user.customRole?.slug || user.role;
    let masterPerms = {};
    if (roleSlug) {
      const masterRole = await prisma.customRole.findFirst({
        where: { slug: roleSlug, companyId: null, isSystem: true },
        include: { permissions: true }
      });
      if (masterRole?.permissions) {
        masterRole.permissions.forEach(p => {
          try { masterPerms[p.module] = JSON.parse(p.actionString); }
          catch (e) { masterPerms[p.module] = p.actionString; }
        });
      }
    }

    if (!user.companyId || user.role === 'SUPER_ADMIN') {
      user.permissions = masterPerms;
    } else {
      let companyPerms = {};
      const companyRole = await prisma.customRole.findFirst({
        where: { slug: roleSlug, companyId: user.companyId },
        include: { permissions: true }
      });
      if (companyRole?.permissions) {
        companyRole.permissions.forEach(p => {
          try { companyPerms[p.module] = JSON.parse(p.actionString); }
          catch (e) { companyPerms[p.module] = p.actionString; }
        });
      }

      const effectivePerms = {};
      Object.entries(masterPerms).forEach(([mod, mActions]) => {
        effectivePerms[mod] = {};
        if (typeof mActions === 'object' && mActions !== null) {
          Object.entries(mActions).forEach(([action, mVal]) => {
            if (mVal === false) {
              effectivePerms[mod][action] = false;
            } else {
              effectivePerms[mod][action] = companyPerms[mod]?.[action] !== undefined
                ? Boolean(companyPerms[mod][action])
                : Boolean(mVal);
            }
          });
        }
      });
      user.permissions = effectivePerms;
    }

    return { user, accessToken, refreshToken };

  }


  async logout(refreshToken) {
    if (!refreshToken) return;
    await prisma.userSession.deleteMany({
      where: { tokenHash: refreshToken }
    });
  }
}

module.exports = new AuthService();
