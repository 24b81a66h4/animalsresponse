const cron = require('node-cron');
const Complaint = require('../models/complaint.model');

const startEscalationJob = () => {
    // Runs every hour
    cron.schedule('0 * * * *', async () => {
        console.log('Running escalation check...');

        const now = new Date();

        try {
            // Complaints older than 48h still pending/open → HIGH
            const fortyEightHoursAgo = new Date(now - 48 * 60 * 60 * 1000);
            await Complaint.updateMany(
                {
                    status: { $in: ['pending', 'open'] },
                    priority: { $nin: ['high', 'critical'] },
                    createdAt: { $lte: fortyEightHoursAgo },
                },
                { $set: { priority: 'high' } }
            );

            // Complaints older than 72h still not resolved → CRITICAL
            const seventyTwoHoursAgo = new Date(now - 72 * 60 * 60 * 1000);
            await Complaint.updateMany(
                {
                    status: { $in: ['pending', 'open', 'in-progress'] },
                    priority: { $ne: 'critical' },
                    createdAt: { $lte: seventyTwoHoursAgo },
                },
                { $set: { priority: 'critical' } }
            );

            console.log('Escalation check complete');
        } catch (err) {
            console.error('Escalation job error:', err.message);
        }
    });

    console.log('Escalation cron job started');
};

module.exports = { startEscalationJob };