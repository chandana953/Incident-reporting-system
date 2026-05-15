const sendResponse = require('../utils/responseHandler');

const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Log error for debugging
    console.error('ERROR 💥', err);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Invalid ${err.path}: ${err.value}.`;
        err.statusCode = 400;
        err.message = message;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const value = err.errmsg ? err.errmsg.match(/(["'])(\\?.)*?\1/)[0] : 'field';
        const message = `Duplicate field value: ${value}. Please use another value!`;
        err.statusCode = 400;
        err.message = message;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(el => el.message);
        const message = `Invalid input data. ${errors.join('. ')}`;
        err.statusCode = 400;
        err.message = message;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        err.statusCode = 401;
        err.message = 'Invalid token. Please log in again!';
    }
    if (err.name === 'TokenExpiredError') {
        err.statusCode = 401;
        err.message = 'Your token has expired! Please log in again.';
    }

    sendResponse(res, err.statusCode, err.message);
};

module.exports = globalErrorHandler;
