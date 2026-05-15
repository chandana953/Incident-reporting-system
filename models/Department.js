const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a department name'],
        unique: true,
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Please specify the department type'],
        enum: ['police', 'hospital', 'fire', 'ambulance', 'rescue', 'utility']
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    address: String,
    contactInfo: {
        phone: String,
        email: String
    },
    activeUnits: {
        type: Number,
        default: 5
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'busy'],
        default: 'active'
    }
}, {
    timestamps: true
});

// Index for geo-spatial queries
DepartmentSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Department', DepartmentSchema);
