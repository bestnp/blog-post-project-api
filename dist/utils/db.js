"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
// Create a connection pool to Supabase
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
// Test connection
pool.on('connect', () => {
    console.log('✅ Connected to Supabase database');
});
pool.on('error', (err) => {
    console.error('❌ Database connection error:', err);
});
exports.default = pool;
