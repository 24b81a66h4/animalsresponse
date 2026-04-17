const Complaint = require('../models/complaint.model');

// Auto-update priority based on time
const autoEscalatePriority = async (req, res, next) => {
    try {
        const now = new Date();

        // Fetch pending complaints
        const complaints = await Complaint.find({ status: { $ne: 'Resolved' } });

        for (let complaint of complaints) {
            const createdAt = new Date(complaint.createdAt);
            const hoursDiff = (now - createdAt) / (1000 * 60 * 60);

            if (hoursDiff >= 72 && complaint.priority !== 'critical') {
                complaint.priority = 'critical';
            } else if (hoursDiff >= 48 && complaint.priority !== 'high') {
                complaint.priority = 'high';
            }

            await complaint.save();
        }

        next();
    } catch (error) {
        console.error("Priority Middleware Error:", error.message);
        next();
    }
};

module.exports = { autoEscalatePriority };