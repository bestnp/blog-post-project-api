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

// Supabase Client Configuration
// IMPORTANT: Authentication operations (login, signup) MUST use ANON_KEY
// Storage operations should use SERVICE_ROLE_KEY to bypass RLS
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Supabase Client for Authentication (MUST use ANON_KEY)
// This is used for login, signup, getUser, etc.
// Note: In serverless environments (Vercel), we disable persistSession and autoRefreshToken
// because sessions are handled per-request, not persisted across requests
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false, // Disabled for serverless - sessions are stateless
    persistSession: false, // Disabled for serverless - no localStorage/cookies needed
    detectSessionInUrl: false,
    storage: undefined // No storage adapter needed for serverless
  }
});

// Supabase Client for Storage operations (uses SERVICE_ROLE_KEY if available)
// This bypasses RLS policies for file uploads
const storageKey = supabaseServiceRoleKey || supabaseAnonKey;
export const supabaseStorage = createClient(supabaseUrl, storageKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
});

// Log Supabase connection
if (supabaseUrl && supabaseAnonKey) {
  console.log('✅ Supabase client initialized for Authentication');
  if (supabaseServiceRoleKey) {
    console.log('✅ Supabase Storage client initialized with SERVICE_ROLE_KEY');
  } else {
    console.warn('⚠️  Supabase Storage using ANON_KEY (may have permission issues). Consider setting SUPABASE_SERVICE_ROLE_KEY');
  }
} else {
  console.warn('⚠️  Supabase credentials not found in environment variables');
  console.warn('   Required: SUPABASE_URL, SUPABASE_ANON_KEY');
}

// Export both pools
export { authPool };
export default pool;

