const authService = require('../services/auth.service');
const sendResponse = require('../utils/responseHandler');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 */
exports.register = async (req, res, next) => {
    try {
        const result = await authService.registerUser(req.body);
        return sendResponse(res, 201, 'User registered successfully', result);
    } catch (error) {
        return next(error);
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 */
exports.login = async (req, res, next) => {
    try {
        const result = await authService.loginUser(req.body);
        return sendResponse(res, 200, 'User logged in successfully', result);
    } catch (error) {
        return next(error);
    }
};
