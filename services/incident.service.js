const Incident = require('../models/Incident');
const CustomError = require('../utils/customError');
const { getIO } = require('../config/socket');
const { getSmartRouting } = require('./routingService');

// In-memory fallback storage
let memoryIncidents = [];

/**
 * Create a new incident
 */
const createIncident = async (incidentData, userId, file) => {
    let imageUrl = null;
    if (file && file.path) {
        imageUrl = file.path;
    }

    const { title, description, category, priority, longitude, latitude, address } = incidentData;
    const coords = [parseFloat(longitude), parseFloat(latitude)];

    // Get smart routing departments
    const assignedDepartments = await getSmartRouting(category, coords);

    let incident;
    if (process.env.DB_CONNECTED === 'true') {
        incident = await Incident.create({
            title,
            description,
            category,
            priority: priority || 'medium',
            location: {
                type: 'Point',
                coordinates: coords,
                address: address || ''
            },
            imageUrl,
            reportedBy: userId,
            assignedDepartments
        });
        await incident.populate('reportedBy', 'name email');
    } else {
        // RESILIENT MODE: In-Memory Implementation
        incident = {
            _id: 'mem_' + Date.now() + Math.random().toString(36).substr(2, 5),
            title,
            description,
            category,
            priority: priority || 'medium',
            location: {
                type: 'Point',
                coordinates: coords,
                address: address || ''
            },
            imageUrl,
            status: 'open',
            reportedBy: { _id: userId, name: 'Active Node', email: 'node@resilient.net' },
            assignedDepartments,
            verifications: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        memoryIncidents.unshift(incident);
    }

    // Emit socket event for real-time update
    try {
        const io = getIO();
        io.emit('newIncident', incident);
    } catch (err) {
        console.error('Socket error on create:', err.message);
    }

    return incident;
};

/**
 * Get all incidents with pagination, filtering, and search
 */
const getAllIncidents = async (query) => {
    if (process.env.DB_CONNECTED === 'true') {
        const filter = {};
        if (query.status) filter.status = query.status;
        if (query.priority) filter.priority = query.priority;
        if (query.category) filter.category = query.category;

        if (query.search) {
            filter.$or = [
                { title: { $regex: query.search, $options: 'i' } },
                { description: { $regex: query.search, $options: 'i' } }
            ];
        }

        const page = parseInt(query.page, 10) || 1;
        const limit = parseInt(query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const incidents = await Incident.find(filter)
            .populate('reportedBy', 'name email')
            .populate('assignedTo', 'name email')
            .sort('-createdAt')
            .skip(skip)
            .limit(limit);

        const total = await Incident.countDocuments(filter);

        return {
            incidents,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        };
    } else {
        // RESILIENT MODE: Return from memory
        return {
            incidents: memoryIncidents,
            pagination: {
                total: memoryIncidents.length,
                page: 1,
                pages: 1,
                limit: 100
            }
        };
    }
};

/**
 * Get a single incident by its ID
 */
const getIncidentById = async (id) => {
    let incident;
    if (process.env.DB_CONNECTED === 'true') {
        incident = await Incident.findById(id)
            .populate('reportedBy', 'name email')
            .populate('assignedTo', 'name email');
    } else {
        incident = memoryIncidents.find(inc => inc._id === id);
    }

    if (!incident) {
        throw new CustomError(`No incident found with id: ${id}`, 404);
    }

    return incident;
};

/**
 * Update an incident
 * Only the reporter or an admin can update an incident.
 * Admins can also assign incidents and change status.
 */
const updateIncident = async (id, updateData, userId, userRole) => {
    const incident = await Incident.findById(id);

    if (!incident) {
        throw new CustomError(`No incident found with id: ${id}`, 404);
    }

    // Check ownership or admin role
    if (incident.reportedBy.toString() !== userId.toString() && userRole !== 'admin') {
        throw new CustomError('Not authorized to update this incident', 403);
    }

    // Fields that any authorized user can update
    const allowedUpdates = ['title', 'description', 'category', 'priority', 'imageUrl'];

    // Admin-only fields
    const adminOnlyUpdates = ['status', 'assignedTo'];

    // Apply allowed updates
    allowedUpdates.forEach(field => {
        if (updateData[field] !== undefined) {
            incident[field] = updateData[field];
        }
    });

    // Apply admin-only updates if user is admin
    if (userRole === 'admin') {
        adminOnlyUpdates.forEach(field => {
            if (updateData[field] !== undefined) {
                incident[field] = updateData[field];
            }
        });
    }

    // Handle location update
    if (updateData.longitude && updateData.latitude) {
        incident.location = {
            type: 'Point',
            coordinates: [parseFloat(updateData.longitude), parseFloat(updateData.latitude)],
            address: updateData.address || incident.location.address
        };
    }

    await incident.save();

    // Populate references before returning
    await incident.populate('reportedBy', 'name email');
    await incident.populate('assignedTo', 'name email');

    // Emit socket event for real-time update
    try {
        const io = getIO();
        io.emit('updateIncident', incident);
    } catch (err) {
        console.error('Socket error on update:', err.message);
    }

    return incident;
};

/**
 * Delete an incident
 * Only the reporter or an admin can delete an incident.
 */
const deleteIncident = async (id, userId, userRole) => {
    const incident = await Incident.findById(id);

    if (!incident) {
        throw new CustomError(`No incident found with id: ${id}`, 404);
    }

    // Check ownership or admin role
    if (incident.reportedBy.toString() !== userId.toString() && userRole !== 'admin') {
        throw new CustomError('Not authorized to delete this incident', 403);
    }

    await incident.deleteOne();

    // Emit socket event
    try {
        const io = getIO();
        io.emit('deleteIncident', id);
    } catch (err) {
        console.error('Socket error on delete:', err.message);
    }

    return true;
};

/**
 * Get incidents near a geographic point
 */
const getNearbyIncidents = async (lng, lat, distanceInKm) => {
    if (!lng || !lat || !distanceInKm) {
        throw new CustomError('Please provide latitude, longitude and distance', 400);
    }

    const radius = parseFloat(distanceInKm) / 6378.1; // Convert km to radians

    const incidents = await Incident.find({
        location: {
            $geoWithin: {
                $centerSphere: [[parseFloat(lng), parseFloat(lat)], radius]
            }
        }
    }).populate('reportedBy', 'name email');

    return incidents;
};

/**
 * Get dashboard statistics (for admin)
 */
const getStats = async () => {
    const total = await Incident.countDocuments();
    const open = await Incident.countDocuments({ status: 'open' });
    const inProgress = await Incident.countDocuments({ status: 'in-progress' });
    const resolved = await Incident.countDocuments({ status: 'resolved' });
    const closed = await Incident.countDocuments({ status: 'closed' });
    const critical = await Incident.countDocuments({ priority: 'critical' });
    const high = await Incident.countDocuments({ priority: 'high' });

    // Get category breakdown
    const categoryBreakdown = await Incident.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);

    // Recent incidents (last 5)
    const recent = await Incident.find()
        .populate('reportedBy', 'name email')
        .sort('-createdAt')
        .limit(5);

    return {
        total,
        byStatus: { open, inProgress, resolved, closed },
        byPriority: { critical, high },
        categoryBreakdown,
        recent
    };
};

module.exports = {
    createIncident,
    getAllIncidents,
    getIncidentById,
    updateIncident,
    deleteIncident,
    getNearbyIncidents,
    getStats
};
