const bcrypt = require('bcryptjs');
const supabase = require('./src/config/supabase');
require('dotenv').config();

const seedAdmin = async () => {
  const username = process.argv[2] || 'admin';
  const password = process.argv[3] || 'admin123';

  if (!username || !password) {
    console.error('Usage: node seed-admin.js <username> <password>');
    process.exit(1);
  }

  try {
    const password_hash = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from('users')
      .insert({
        username,
        password_hash,
        role: 'admin',
        is_active: true
      })
      .select('id, username, role')
      .single();

    if (error) {
       if (error.code === '23505') {
           console.log('Admin user already exists.');
       } else {
           throw error;
       }
    } else {
       console.log('Admin user created successfully:', data);
    }
  } catch (error) {
    console.error('Error seeding admin:', error.message);
  } finally {
    process.exit(0);
  }
};

seedAdmin();
