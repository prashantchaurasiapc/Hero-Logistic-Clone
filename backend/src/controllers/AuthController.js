const AuthService = require('../services/AuthService');
const { sendSuccess } = require('../utils/apiResponse');
const { HTTP_STATUS } = require('../config/constants');

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
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 mins
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
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
    // Assuming req.user is populated by auth middleware
    return sendSuccess(res, { user: req.user }, HTTP_STATUS.OK);
  } catch (error) {
    next(error);
  }
};
