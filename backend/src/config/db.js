const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/animalsresponse';
        const conn = await mongoose.connect(mongoURI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Auto-seed Admin if not exists
        const User = require('../models/user.model');
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            console.log('No admin found, creating default admin...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            await User.create({
                name: 'System Admin',
                email: 'admin@admin.com',
                password: hashedPassword,
                role: 'admin',
                phone: '9999999999'
            });
            console.log('Default admin created: admin@admin.com / admin123');
        }
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
