class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true; // Identifies known errors vs programming errors

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = CustomError;
