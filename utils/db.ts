import { Pool } from 'pg';
import { createClient } from '@supabase/supabase-js';

// Use POSTGRES_URL (from Vercel Supabase Integration) or fallback to DATABASE_URL
const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

// Validate connection string before creating pool
if (!databaseUrl) {
  console.error('❌ DATABASE_URL or POSTGRES_URL environment variable is not set!');
}

// PostgreSQL Connection Pool for Blog Posts Database
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false
  },
  // Add connection timeout
  connectionTimeoutMillis: 10000,
  // Add max pool size
  max: 20,
  idleTimeoutMillis: 30000,
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to Blog Posts database');
});

pool.on('error', (err: Error) => {
  console.error('❌ Blog Posts database connection error:', err);
  console.error('Error details:', {
    message: err.message,
    code: (err as any).code,
    DATABASE_URL_set: !!process.env.DATABASE_URL,
    DATABASE_URL_length: process.env.DATABASE_URL?.length || 0,
  });
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

// Supabase Client for Authentication and Storage
// For Storage operations, we need to use SERVICE_ROLE_KEY instead of ANON_KEY
// to bypass RLS (Row Level Security) policies
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

// Use SERVICE_ROLE_KEY for Storage operations (bypasses RLS)
// Fallback to ANON_KEY if SERVICE_ROLE_KEY is not available
const storageKey = supabaseServiceRoleKey || supabaseAnonKey;

export const supabase = createClient(supabaseUrl, storageKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

// Log Supabase connection
if (supabaseUrl && storageKey) {
  console.log('✅ Supabase client initialized');
  if (supabaseServiceRoleKey && supabaseServiceRoleKey !== supabaseAnonKey) {
    console.log('✅ Using SERVICE_ROLE_KEY for Storage operations');
  } else {
    console.warn('⚠️  Using ANON_KEY for Storage (may have permission issues). Consider setting SUPABASE_SERVICE_ROLE_KEY');
  }
} else {
  console.warn('⚠️  Supabase credentials not found in environment variables');
}

// Export both pools
export { authPool };
export default pool;

