const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Injury', 'Abuse', 'Stray', 'Dead Animal', 'Missing Pet', 'Other']
    },
    status: {
        type: String,
        enum: ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Rejected'],
        default: 'Pending'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    location: {
        lat: {
            type: Number
        },
        lng: {
            type: Number
        },
        address: {
            type: String
        }
    },
    assigned_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NGO',
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
