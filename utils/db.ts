import { Pool } from 'pg';
import { createClient } from '@supabase/supabase-js';

// PostgreSQL Connection Pool for Blog Posts Database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to Blog Posts database');
});

pool.on('error', (err: Error) => {
  console.error('❌ Blog Posts database connection error:', err);
});

// PostgreSQL Connection Pool for Authentication Database
const authPool = new Pool({
  connectionString: process.env.AUTH_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection
authPool.on('connect', () => {
  console.log('✅ Connected to Authentication database');
});

authPool.on('error', (err: Error) => {
  console.error('❌ Authentication database connection error:', err);
});

// Supabase Client for Authentication
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

// Log Supabase connection
if (supabaseUrl && supabaseAnonKey) {
  console.log('✅ Supabase client initialized');
} else {
  console.warn('⚠️  Supabase credentials not found in environment variables');
}

// Export both pools
export { authPool };
export default pool;

