const sendResponse = require('../utils/responseHandler');

const notFoundHandler = (req, res, next) => {
    sendResponse(res, 404, `Not Found - ${req.originalUrl}`);
};

module.exports = notFoundHandler;
