const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Load .env file with explicit path
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Temporary hardcoded values to bypass dotenv issue
const supabaseUrl = process.env.SUPABASE_URL || 'https://wdtlnavloyeysgmarnni.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkdGxuYXZsb3lleXNnbWFybm5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5MzY1NTEsImV4cCI6MjA3MTUxMjU1MX0.Ub9wFISFWHQro1JwzdKpcF_n2M_Ch5QO6xNUDbP9zgU';

console.log('🔍 Environment check:');
console.log('Current directory:', __dirname);
console.log('SUPABASE_URL:', supabaseUrl ? '✅ Found' : '❌ Missing');
console.log('SUPABASE_ANON_KEY:', supabaseKey ? '✅ Found' : '❌ Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
