const Complaint = require('../models/complaint.model');

const getDashboardStats = async () => {
    const total = await Complaint.countDocuments();

    const statusStats = await Complaint.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const categoryStats = await Complaint.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    return {
        total,
        statusStats,
        categoryStats
    };
};

module.exports = {
    getDashboardStats
};