import api from './api';

/**
 * Incident Service
 * All incident-related API operations.
 */

/**
 * Get all incidents with optional filters/pagination/search
 * @param {Object} params - { page, limit, search, status, priority, category }
 */
export const getIncidents = async (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val) query.append(key, val);
  });
  const queryString = query.toString() ? `?${query.toString()}` : '';
  return api.get(`/incidents${queryString}`);
};

/**
 * Get a single incident by ID
 * @param {String} id - MongoDB ObjectId
 */
export const getIncidentById = async (id) => {
  return api.get(`/incidents/${id}`);
};

/**
 * Create a new incident (supports image upload via FormData)
 * @param {FormData|Object} incidentData
 */
export const createIncident = async (incidentData) => {
  return api.post('/incidents', incidentData);
};

/**
 * Update an incident
 * @param {String} id - MongoDB ObjectId
 * @param {Object} updateData
 */
export const updateIncident = async (id, updateData) => {
  return api.put(`/incidents/${id}`, updateData);
};

/**
 * Delete an incident
 * @param {String} id - MongoDB ObjectId
 */
export const deleteIncident = async (id) => {
  return api.delete(`/incidents/${id}`);
};

/**
 * Get nearby incidents (geospatial query)
 * @param {Number} lat - Latitude
 * @param {Number} lng - Longitude
 * @param {Number} distance - Distance in km (default: 5)
 */
export const getNearbyIncidents = async (lat, lng, distance = 5) => {
  return api.get(`/incidents/nearby?lat=${lat}&lng=${lng}&distance=${distance}`);
};

/**
 * Get admin dashboard statistics
 */
export const getStats = async () => {
  return api.get('/incidents/stats/overview');
};

/**
 * Verify an incident (Like)
 * @param {String} id - Incident ID
 */
export const verifyIncident = async (id) => {
  return api.post(`/incidents/${id}/verify`);
};

/**
 * Add a comment to an incident
 * @param {String} id - Incident ID
 * @param {Object} commentData - { text }
 */
export const addComment = async (id, commentData) => {
  return api.post(`/incidents/${id}/comments`, commentData);
};
