const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.error('CRITICAL: Missing Supabase credentials in environment variables.');
  console.log('Available Env keys:', Object.keys(process.env).filter(k => !k.includes('KEY') && !k.includes('SECRET')));
}

const supabase = (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) 
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
  : null;

if (!supabase) {
  console.error('Supabase client failed to initialize due to missing config.');
}

module.exports = supabase;
