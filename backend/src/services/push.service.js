const { sendPushNotification } = require('../config/firebase');

// Send notification to a user
const sendNotification = async (token, title, message) => {
    try {
        await sendPushNotification(token, title, message);
    } catch (error) {
        console.error("❌ Push Error:", error.message);
    }
};

module.exports = {
    sendNotification
};