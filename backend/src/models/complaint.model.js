const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    url: { type: String, required: true },
    public_id: { type: String, required: true },
    resource_type: { type: String, enum: ['image', 'video'], default: 'image' },
});

const complaintSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        enum: ['injured_animal', 'stray_animal', 'abuse', 'trapped', 'sick_animal', 'other'],
        default: 'other',
    },
    status: {
        type: String,
        enum: ['pending', 'open', 'in-progress', 'resolved', 'closed'],
        default: 'pending',
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium',
    },
    location: {
        address: { type: String },
        lat: { type: Number },
        lng: { type: Number },
    },
    media: [mediaSchema],
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    assigned_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);