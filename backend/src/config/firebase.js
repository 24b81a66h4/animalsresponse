const admin = require("firebase-admin");

let serviceAccount;

try {
    serviceAccount = require("../../firebase-service-account.json");
} catch (err) {
    console.warn("⚠ Firebase service account not found, using dummy config");
}

if (!admin.apps.length) {
    admin.initializeApp({
        credential: serviceAccount
            ? admin.credential.cert(serviceAccount)
            : admin.credential.applicationDefault()
    });
}

const sendPushNotification = async (token, title, body) => {
    try {
        const message = {
            notification: { title, body },
            token
        };

        await admin.messaging().send(message);
        console.log("📲 Notification sent");
    } catch (err) {
        console.error("❌ Firebase Error:", err.message);
    }
};

module.exports = { admin, sendPushNotification };