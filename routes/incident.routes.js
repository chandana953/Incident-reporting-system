const express = require('express');
const { body } = require('express-validator');
const validate = require('../middlewares/validation.middleware');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const { upload } = require('../config/cloudinary');
const incidentController = require('../controllers/incident.controller');

const router = express.Router();

// ─── Public Routes ───────────────────────────────────────────────
router.get('/nearby', incidentController.getNearbyIncidents);
router.get('/', incidentController.getIncidents);
router.get('/:id', incidentController.getIncident);

// ─── Protected Routes ────────────────────────────────────────────
router.use(protect); // All routes below require authentication

// Stats route (admin only)
router.get('/stats/overview', restrictTo('admin'), incidentController.getStats);

// Create incident
router.post(
    '/',
    upload.single('image'), // Handle image upload (form-data key: 'image')
    [
        body('title', 'Title is required').not().isEmpty(),
        body('description', 'Description is required').not().isEmpty(),
        body('category', 'Category is required').not().isEmpty(),
        body('priority', 'Priority must be low, medium, high, or critical')
            .optional()
            .isIn(['low', 'medium', 'high', 'critical']),
        body('longitude', 'Longitude is required and must be numeric').isNumeric(),
        body('latitude', 'Latitude is required and must be numeric').isNumeric()
    ],
    validate,
    incidentController.createIncident
);

// Update incident
router.put(
    '/:id',
    [
        body('title', 'Title cannot be empty').optional().not().isEmpty(),
        body('description', 'Description cannot be empty').optional().not().isEmpty(),
        body('category', 'Invalid category')
            .optional()
            .isIn(['accident', 'theft', 'fire', 'medical', 'flood', 'violence', 'infrastructure', 'other']),
        body('priority', 'Invalid priority')
            .optional()
            .isIn(['low', 'medium', 'high', 'critical']),
        body('status', 'Invalid status')
            .optional()
            .isIn(['open', 'in-progress', 'resolved', 'closed'])
    ],
    validate,
    incidentController.updateIncident
);

// Delete incident
router.delete('/:id', incidentController.deleteIncident);

// Verification & Flagging
router.post('/:id/verify', incidentController.verifyIncident);
router.post('/:id/flag', incidentController.flagIncident);

module.exports = router;
