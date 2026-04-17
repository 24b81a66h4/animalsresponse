const Complaint = require('../models/complaint.model');

// @desc    Get complaint analytics
// @route   GET /api/analytics
// @access  Private (Admin)
const getAnalytics = async (req, res) => {
    try {
        const total = await Complaint.countDocuments();

        const byStatus = await Complaint.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const byCategory = await Complaint.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }
        ]);

        const byPriority = await Complaint.aggregate([
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Complaints per day (last 7 days)
        const last7Days = await Complaint.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(new Date().setDate(new Date().getDate() - 7))
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            total,
            byStatus,
            byCategory,
            byPriority,
            last7Days
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getAnalytics
};