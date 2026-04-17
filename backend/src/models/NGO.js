const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    area_served: {
        type: String,
        required: true
    },
    contact_email: {
        type: String,
        required: true
    },
    contact_phone: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('NGO', ngoSchema);