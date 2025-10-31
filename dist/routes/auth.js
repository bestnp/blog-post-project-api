"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../utils/db");
const db_2 = require("../utils/db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/**
 * POST /auth/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
    try {
        const { email, password, username, name } = req.body;
        // Validation
        if (!email || !password) {
            res.status(400).json({
                error: 'Email and password are required'
            });
            return;
        }
        if (!username) {
            res.status(400).json({
                error: 'Username is required'
            });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({
                error: 'Password must be at least 6 characters'
            });
            return;
        }
        // ตรวจสอบว่า username มีในฐานข้อมูลหรือไม่
        const usernameCheckQuery = `
      SELECT * FROM users 
      WHERE username = $1
    `;
        const usernameCheckValues = [username];
        const { rows: existingUser } = await db_2.authPool.query(usernameCheckQuery, usernameCheckValues);
        if (existingUser.length > 0) {
            res.status(400).json({
                error: 'This username is already taken'
            });
            return;
        }
        // สร้างผู้ใช้ใหม่ผ่าน Supabase Auth
        const { data, error: supabaseError } = await db_1.supabase.auth.signUp({
            email,
            password,
        });
        // ตรวจสอบ error จาก Supabase
        if (supabaseError) {
            if (supabaseError.code === 'user_already_exists') {
                res.status(400).json({
                    error: 'User with this email already exists'
                });
                return;
            }
            // จัดการกับ error อื่นๆ จาก Supabase
            res.status(400).json({
                error: 'Failed to create user. Please try again.'
            });
            return;
        }
        if (!data.user) {
            res.status(400).json({
                error: 'Failed to create user'
            });
            return;
        }
        const supabaseUserId = data.user.id;
        // เพิ่มข้อมูลผู้ใช้ในฐานข้อมูล PostgreSQL
        const query = `
      INSERT INTO users (id, username, name, role, email)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
        const values = [supabaseUserId, username, name || username, 'user', email];
        const { rows } = await db_2.authPool.query(query, values);
        res.status(201).json({
            message: 'User created successfully',
            user: rows[0]
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            error: 'An error occurred during registration'
        });
    }
});
/**
 * POST /auth/login
 * Login user
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data, error } = await db_1.supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            // ตรวจสอบว่า error เกิดจากข้อมูลเข้าสู่ระบบไม่ถูกต้องหรือไม่
            if (error.code === 'invalid_credentials' ||
                error.message.includes('Invalid login credentials')) {
                return res.status(400).json({
                    error: "Your password is incorrect or this email doesn't exist",
                });
            }
            return res.status(400).json({ error: error.message });
        }
        return res.status(200).json({
            message: 'Signed in successfully',
            access_token: data.session.access_token,
        });
    }
    catch (error) {
        return res.status(500).json({ error: 'An error occurred during login' });
    }
});
/**
 * POST /auth/logout
 * Logout user
 */
router.post('/logout', auth_1.authenticateToken, async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            await db_1.supabase.auth.signOut();
        }
        res.status(200).json({
            message: 'Logout successful'
        });
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            message: 'Logout failed'
        });
    }
});
/**
 * GET /auth/me
 * Get current user profile
 */
router.get('/me', auth_1.authenticateToken, async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({
                message: 'Not authenticated'
            });
            return;
        }
        res.status(200).json({
            user: req.user
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            message: 'Failed to get user profile'
        });
    }
});
/**
 * POST /auth/refresh
 * Refresh access token
 */
router.post('/refresh', async (req, res) => {
    try {
        const { refresh_token } = req.body;
        if (!refresh_token) {
            res.status(400).json({
                message: 'Refresh token is required'
            });
            return;
        }
        const { data, error } = await db_1.supabase.auth.refreshSession({
            refresh_token
        });
        if (error) {
            res.status(401).json({
                message: 'Invalid refresh token'
            });
            return;
        }
        res.status(200).json({
            message: 'Token refreshed successfully',
            session: {
                access_token: data.session?.access_token,
                refresh_token: data.session?.refresh_token,
                expires_at: data.session?.expires_at
            }
        });
    }
    catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({
            message: 'Token refresh failed'
        });
    }
});
/**
 * POST /auth/forgot-password
 * Request password reset
 */
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({
                message: 'Email is required'
            });
            return;
        }
        const { error } = await db_1.supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.FRONTEND_URL}/reset-password`
        });
        if (error) {
            res.status(400).json({
                message: error.message
            });
            return;
        }
        res.status(200).json({
            message: 'Password reset email sent'
        });
    }
    catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            message: 'Failed to send password reset email'
        });
    }
});
/**
 * POST /auth/reset-password
 * Reset password with reset token (from email)
 */
router.post('/reset-password', async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) {
            res.status(400).json({
                message: 'New password is required'
            });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({
                message: 'Password must be at least 6 characters'
            });
            return;
        }
        const { error } = await db_1.supabase.auth.updateUser({
            password
        });
        if (error) {
            res.status(400).json({
                message: error.message
            });
            return;
        }
        res.status(200).json({
            message: 'Password reset successful'
        });
    }
    catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            message: 'Password reset failed'
        });
    }
});
/**
 * PUT /auth/reset-password
 * Change password when logged in (requires old password verification)
 */
router.put('/reset-password', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // ดึง token จาก Authorization header
    const { oldPassword, newPassword } = req.body;
    if (!token) {
        res.status(401).json({ error: 'Unauthorized: Token missing' });
        return;
    }
    if (!newPassword) {
        res.status(400).json({ error: 'New password is required' });
        return;
    }
    try {
        // ตั้งค่า session ด้วย token ที่ส่งมา
        const { data: userData, error: userError } = await db_1.supabase.auth.getUser(token);
        if (userError) {
            res.status(401).json({ error: 'Unauthorized: Invalid token' });
            return;
        }
        // ตรวจสอบรหัสผ่านเดิมโดยลองล็อกอิน
        const { data: loginData, error: loginError } = await db_1.supabase.auth.signInWithPassword({
            email: userData.user.email || '',
            password: oldPassword,
        });
        if (loginError) {
            res.status(400).json({ error: 'Invalid old password' });
            return;
        }
        // อัปเดตรหัสผ่านของผู้ใช้
        const { data, error } = await db_1.supabase.auth.updateUser({
            password: newPassword,
        });
        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }
        res.status(200).json({
            message: 'Password updated successfully',
            user: data.user,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
