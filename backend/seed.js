// Run this once to re-create admin/ngo/user accounts in Atlas:
//   MONGO_URI=<your_atlas_uri> node backend/seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/user.model');

const seed = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI env var is missing');

    console.log('Connecting to Atlas…');
    await mongoose.connect(uri);
    console.log('Connected!');

    const salt = await bcrypt.genSalt(10);

    const users = [
      {
        name: 'Admin User',
        email: 'admin@admin.com',
        password: await bcrypt.hash('admin123', salt),
        phone: '9999999999',
        role: 'admin',
      },
      {
        name: 'NGO Helper',
        email: 'ngo@ngo.com',
        password: await bcrypt.hash('ngo123', salt),
        phone: '8888888888',
        role: 'ngo',
      },
      {
        name: 'Test User',
        email: 'user@user.com',
        password: await bcrypt.hash('user123', salt),
        phone: '7777777777',
        role: 'user',
      },
    ];

    for (const u of users) {
      // Replace existing user so we always know the password
      await User.findOneAndDelete({ email: u.email });
      await User.create(u);
      console.log(`✅ (Re)created: ${u.email} (${u.role})`);
    }

    console.log('\nDone! Credentials:');
    console.log('  Admin : admin@admin.com  / admin123');
    console.log('  NGO   : ngo@ngo.com      / ngo123');
    console.log('  User  : user@user.com    / user123');
  } catch (err) {
    console.error('Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
};

seed();