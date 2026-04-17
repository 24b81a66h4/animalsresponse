const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    complaint_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Complaint'
    },
    file_url: {
        type: String,
        required: true
    },
    file_type: {
        type: String,
        enum: ['image', 'video']
    }
}, { timestamps: true });

module.exports = mongoose.model('Media', mediaSchema);
