const Feedback = require('../models/Feedback');
const Complaint = require('../models/complaint.model');

const submitFeedback = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const { complaintId } = req.params;

        const complaint = await Complaint.findById(complaintId);
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

        if (complaint.status !== 'resolved') {
            return res.status(400).json({ message: 'Can only rate resolved complaints' });
        }

        if (complaint.user_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not your complaint' });
        }

        const existing = await Feedback.findOne({ complaint_id: complaintId });
        if (existing) return res.status(400).json({ message: 'Feedback already submitted' });

        const feedback = await Feedback.create({
            complaint_id: complaintId,
            user_id: req.user._id,
            ngo_id: complaint.assigned_to,
            rating,
            comment,
        });

        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getFeedbackForComplaint = async (req, res) => {
    try {
        const feedback = await Feedback.findOne({ complaint_id: req.params.complaintId });
        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getNgoAverageRating = async (req, res) => {
    try {
        const result = await Feedback.aggregate([
            { $match: { ngo_id: req.user._id } },
            { $group: { _id: null, average: { $avg: '$rating' }, total: { $sum: 1 } } },
        ]);
        res.status(200).json(result[0] || { average: 0, total: 0 });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { submitFeedback, getFeedbackForComplaint, getNgoAverageRating };