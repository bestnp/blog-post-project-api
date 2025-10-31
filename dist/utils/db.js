"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authPool = exports.supabase = void 0;
const pg_1 = require("pg");
const supabase_js_1 = require("@supabase/supabase-js");
// PostgreSQL Connection Pool for Blog Posts Database
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
// Test connection
pool.on('connect', () => {
    console.log('✅ Connected to Blog Posts database');
});
pool.on('error', (err) => {
    console.error('❌ Blog Posts database connection error:', err);
});
// PostgreSQL Connection Pool for Authentication Database
const authPool = new pg_1.Pool({
    connectionString: process.env.AUTH_DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
exports.authPool = authPool;
// Test connection
authPool.on('connect', () => {
    console.log('✅ Connected to Authentication database');
});
authPool.on('error', (err) => {
    console.error('❌ Authentication database connection error:', err);
});
// Supabase Client for Authentication
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
    }
});
// Log Supabase connection
if (supabaseUrl && supabaseAnonKey) {
    console.log('✅ Supabase client initialized');
}
else {
    console.warn('⚠️  Supabase credentials not found in environment variables');
}
exports.default = pool;
