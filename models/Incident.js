const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide an incident title'],
            trim: true,
            maxlength: [150, 'Title cannot be more than 150 characters']
        },
        description: {
            type: String,
            required: [true, 'Please provide a description'],
            trim: true
        },
        category: {
            type: String,
            required: [true, 'Please provide an incident category'],
            enum: {
                values: ['accident', 'theft', 'fire', 'medical', 'flood', 'violence', 'infrastructure', 'other'],
                message: '{VALUE} is not a valid category'
            }
        },
        priority: {
            type: String,
            required: [true, 'Please provide a priority level'],
            enum: {
                values: ['low', 'medium', 'high', 'critical'],
                message: '{VALUE} is not a valid priority level'
            },
            default: 'medium'
        },
        status: {
            type: String,
            enum: {
                values: ['open', 'in-progress', 'resolved', 'closed'],
                message: '{VALUE} is not a valid status'
            },
            default: 'open'
        },
        location: {
            // GeoJSON Point
            type: {
                type: String,
                enum: ['Point'],
                required: true
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true
            },
            address: {
                type: String,
                trim: true
            }
        },
        imageUrl: {
            type: String,
            default: null
        },
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Incident must have a reporter']
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        verificationStatus: {
            type: String,
            enum: ['unverified', 'community-verified', 'officially-verified'],
            default: 'unverified'
        },
        assignedDepartments: [
            {
                deptType: {
                    type: String,
                    enum: ['police', 'hospital', 'fire', 'ambulance', 'rescue', 'utility', 'none'],
                },
                name: String,
                status: {
                    type: String,
                    enum: ['notified', 'assigned', 'accepted', 'dispatched', 'on-site', 'in-progress', 'resolved'],
                    default: 'notified'
                },
                distance: Number, // in km
                eta: Number, // in minutes
                dispatchedAt: Date
            }
        ],
        verifications: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        flags: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        timestamps: true // Adds createdAt and updatedAt automatically
    }
);

// Create geospatial index for location-based queries
incidentSchema.index({ location: '2dsphere' });

// Index for search and filtering performance
incidentSchema.index({ title: 'text', description: 'text' });
incidentSchema.index({ status: 1, priority: 1, category: 1 });
incidentSchema.index({ reportedBy: 1 });
incidentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Incident', incidentSchema);
