const Notification = require('../models/notification.model');
const { getIO } = require('../config/socket');

/**
 * Create a notification for a user and emit it via Socket.io
 * @param {string} userId - ID of the user to notify
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} complaintId - ID of the related complaint
 */
const createNotification = async (userId, title, message, complaintId) => {
    try {
        // 1. Save to Database for persistence
        const notification = await Notification.create({
            user: userId,
            title,
            message,
            complaint: complaintId
        });
        // 2. Emit via Socket.io for real-time update
        try {
            const io = getIO();
            io.to(userId.toString()).emit('notification', {
                _id: notification._id,
                title,
                message,
                complaintId,
                createdAt: notification.createdAt,
                read: false
            });
        } catch (socketError) {
            console.error('Socket.io notification emission failed:', socketError.message);
        }

        return notification;
    } catch (error) {
        console.error('Error creating notification:', error.message);
    }
};

module.exports = {
    createNotification
};
