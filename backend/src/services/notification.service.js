const Notification = require('../models/notification.model');
const { getIO } = require('../config/socket');

const createNotification = async (userId, title, message, complaintId) => {
    try {
        const notification = await Notification.create({
            user: userId,
            title,
            message,
            complaint: complaintId || undefined
        });

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

module.exports = { createNotification };