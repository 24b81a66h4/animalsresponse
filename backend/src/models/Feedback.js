const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    complaint_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint',
        required: true,
        unique: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    ngo_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 500,
    },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);