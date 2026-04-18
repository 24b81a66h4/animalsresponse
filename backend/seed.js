require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/user.model');

const seed = async () => {
    try {
        console.log('Connecting to Atlas...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected!');

        const salt = await bcrypt.genSalt(10);

        const users = [
            {
                name: 'Admin User',
                email: 'admin@admin.com',
                password: await bcrypt.hash('admin123', salt),
                phone: '9999999999',
                role: 'admin'
            },
            {
                name: 'NGO Helper',
                email: 'ngo@ngo.com',
                password: await bcrypt.hash('ngo123', salt),
                phone: '8888888888',
                role: 'ngo'
            },
            {
                name: 'Test User',
                email: 'user@user.com',
                password: await bcrypt.hash('user123', salt),
                phone: '7777777777',
                role: 'user'
            }
        ];

        for (const u of users) {
            const exists = await User.findOne({ email: u.email });
            if (!exists) {
                await User.create(u);
                console.log(`✅ Created: ${u.email} (${u.role})`);
            } else {
                console.log(`⚠️  Already exists: ${u.email}`);
            }
        }

        console.log('\nAll done!');
        console.log('Admin: admin@admin.com / admin123');
        console.log('NGO:   ngo@ngo.com / ngo123');
        console.log('User:  user@user.com / user123');

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await mongoose.disconnect();
    }
};

seed();