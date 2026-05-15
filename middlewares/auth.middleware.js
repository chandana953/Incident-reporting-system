const jwt = require('jsonwebtoken');
const CustomError = require('../utils/customError');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        let token;

        // 1) Check if token exists in headers
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new CustomError('You are not logged in! Please log in to get access.', 401));
        }

        // 2) Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next(new CustomError('The user belonging to this token no longer exists.', 401));
        }

        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser;
        next();
    } catch (error) {
        next(error); // This will pass JsonWebTokenError or TokenExpiredError to global handler
    }
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new CustomError('You do not have permission to perform this action', 403));
        }
        next();
    };
};

module.exports = { protect, restrictTo };
