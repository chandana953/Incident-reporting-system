const incidentService = require('../services/incident.service');
const sendResponse = require('../utils/responseHandler');

/**
 * @desc    Create a new incident
 * @route   POST /api/incidents
 */
exports.createIncident = async (req, res, next) => {
    try {
        const incident = await incidentService.createIncident(req.body, req.user.id, req.file);
        return sendResponse(res, 201, 'Incident created successfully', incident);
    } catch (error) {
        return next(error);
    }
};

/**
 * @desc    Get all incidents
 * @route   GET /api/incidents
 */
exports.getIncidents = async (req, res, next) => {
    try {
        const data = await incidentService.getAllIncidents(req.query);
        return sendResponse(res, 200, 'Incidents retrieved successfully', data);
    } catch (error) {
        return next(error);
    }
};

/**
 * @desc    Get a single incident
 */
exports.getIncident = async (req, res, next) => {
    try {
        const incident = await incidentService.getIncidentById(req.params.id);
        return sendResponse(res, 200, 'Incident retrieved successfully', incident);
    } catch (error) {
        return next(error);
    }
};

/**
 * @desc    Update an incident
 */
exports.updateIncident = async (req, res, next) => {
    try {
        const incident = await incidentService.updateIncident(
            req.params.id,
            req.body,
            req.user.id,
            req.user.role
        );
        return sendResponse(res, 200, 'Incident updated successfully', incident);
    } catch (error) {
        return next(error);
    }
};

/**
 * @desc    Delete an incident
 */
exports.deleteIncident = async (req, res, next) => {
    try {
        await incidentService.deleteIncident(req.params.id, req.user.id, req.user.role);
        return sendResponse(res, 200, 'Incident deleted successfully');
    } catch (error) {
        return next(error);
    }
};

/**
 * @desc    Get nearby incidents
 */
exports.getNearbyIncidents = async (req, res, next) => {
    try {
        const { lat, lng, distance } = req.query;
        const distanceInKm = distance || 5;
        const incidents = await incidentService.getNearbyIncidents(lng, lat, distanceInKm);
        return sendResponse(res, 200, `Nearby incidents within ${distanceInKm}km retrieved`, incidents);
    } catch (error) {
        return next(error);
    }
};

/**
 * @desc    Get statistics
 */
exports.getStats = async (req, res, next) => {
    try {
        const stats = await incidentService.getStats();
        return sendResponse(res, 200, 'Statistics retrieved successfully', stats);
    } catch (error) {
        return next(error);
    }
};
