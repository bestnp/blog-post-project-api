"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
exports.optionalAuth = optionalAuth;
exports.requireRole = requireRole;
const db_1 = require("../utils/db");
/**
 * Middleware to verify JWT token and attach user to request
 */
async function authenticateToken(req, res, next) {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            res.status(401).json({
                message: 'Access token is required'
            });
            return;
        }
        // Verify token with Supabase
        const { data: { user }, error } = await db_1.supabase.auth.getUser(token);
        if (error || !user) {
            res.status(401).json({
                message: 'Invalid or expired token'
            });
            return;
        }
        // Attach user to request
        req.user = {
            id: user.id,
            email: user.email || '',
            username: user.user_metadata?.username,
            name: user.user_metadata?.name,
            role: user.role
        };
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({
            message: 'Authentication failed'
        });
    }
}
/**
 * Optional authentication - doesn't fail if no token
 */
async function optionalAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            const { data: { user } } = await db_1.supabase.auth.getUser(token);
            if (user) {
                req.user = {
                    id: user.id,
                    email: user.email || '',
                    username: user.user_metadata?.username,
                    name: user.user_metadata?.name,
                    role: user.role
                };
            }
        }
        next();
    }
    catch (error) {
        // Continue without user if error
        next();
    }
}
/**
 * Check if user has specific role
 */
function requireRole(role) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                message: 'Authentication required'
            });
            return;
        }
        if (req.user.role !== role) {
            res.status(403).json({
                message: 'Insufficient permissions'
            });
            return;
        }
        next();
    };
}
