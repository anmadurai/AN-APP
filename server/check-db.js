const supabase = require('./src/config/supabase');
require('dotenv').config();

const checkStatus = async () => {
    try {
        const { data, count, error } = await supabase
            .from('users')
            .select('*', { count: 'exact' });

        if (error) {
            console.error('Database connection error:', error.message);
        } else {
            console.log(`Connection successful! Found ${count} users.`);
            data.forEach(u => console.log(`- ${u.username} (${u.role})`));
        }
    } catch (err) {
        console.error('Fatal error:', err.message);
    } finally {
        process.exit(0);
    }
}

checkStatus();
