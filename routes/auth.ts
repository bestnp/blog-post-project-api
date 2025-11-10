import { Router, Request, Response } from 'express';
import { supabase } from '../utils/db';
import { authPool } from '../utils/db';
import { RegisterInput, LoginInput } from '../types';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * POST /auth/register
 * Register a new user
 */
router.post('/register', async (req: Request<{}, {}, RegisterInput>, res: Response) => {
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
    const { rows: existingUser } = await authPool.query(
      usernameCheckQuery,
      usernameCheckValues
    );

    if (existingUser.length > 0) {
      res.status(400).json({ 
        error: 'This username is already taken' 
      });
      return;
    }

    // สร้างผู้ใช้ใหม่ผ่าน Supabase Auth
    const { data, error: supabaseError } = await supabase.auth.signUp({
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
    const { rows } = await authPool.query(query, values);

    res.status(201).json({
      message: 'User created successfully',
      user: rows[0]
    });

  } catch (error) {
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
router.post('/login', async (req: Request<{}, {}, LoginInput>, res: Response) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    const authUrl = process.env.SUPABASE_AUTH_URL || process.env.SUPABASE_URL;
    const authAnonKey = process.env.SUPABASE_AUTH_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    // Check if Supabase is configured
    if (!authUrl || !authAnonKey) {
      console.error('❌ Supabase credentials not configured');
      return res.status(500).json({
        error: 'Authentication service not configured',
        message: 'Supabase credentials are missing. Please configure SUPABASE_AUTH_URL and SUPABASE_AUTH_ANON_KEY (or legacy SUPABASE_URL/SUPABASE_ANON_KEY) environment variables.'
      });
    }

    console.log('🔐 Login attempt:', { 
      email, 
      hasSupabaseUrl: !!authUrl, 
      hasAnonKey: !!authAnonKey,
      supabaseUrl: authUrl?.substring(0, 30) + '...' || 'missing',
      anonKeyLength: authAnonKey?.length || 0,
      anonKeyPrefix: authAnonKey?.substring(0, 20) || 'missing'
    });

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(), // Normalize email
      password,
    });

    if (error) {
      console.error('❌ Login error:', {
        code: error.code,
        message: error.message,
        status: error.status
      });

      // ตรวจสอบว่า error เกิดจากข้อมูลเข้าสู่ระบบไม่ถูกต้องหรือไม่
      if (
        error.code === 'invalid_credentials' ||
        error.code === 'email_not_confirmed' ||
        error.message?.includes('Invalid login credentials') ||
        error.message?.includes('Email not confirmed')
      ) {
        return res.status(400).json({
          error: "Your password is incorrect or this email doesn't exist",
          message: error.message
        });
      }

      // Handle other Supabase auth errors
      if (error.code === 'signup_disabled') {
        return res.status(400).json({
          error: 'Signup is disabled',
          message: error.message
        });
      }

      return res.status(400).json({ 
        error: error.message || 'Login failed',
        code: error.code
      });
    }

    if (!data.session) {
      console.error('❌ No session returned from Supabase');
      return res.status(500).json({
        error: 'Login failed',
        message: 'No session was created. Please try again.'
      });
    }

    console.log('✅ Login successful:', { email, userId: data.user?.id });

    return res.status(200).json({
      message: 'Signed in successfully',
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
      user: {
        id: data.user.id,
        email: data.user.email
      }
    });
  } catch (error) {
    console.error('❌ Login exception:', error);
    return res.status(500).json({ 
      error: 'An error occurred during login',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /auth/logout
 * Logout user
 */
router.post('/logout', authenticateToken, async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      await supabase.auth.signOut();
    }

    res.status(200).json({
      message: 'Logout successful'
    });

  } catch (error) {
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
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: 'Not authenticated'
      });
      return;
    }

    // Query role from database (users table) to get actual role (admin/user)
    // instead of Supabase role (authenticated)
    console.log('🔍 /auth/me - Querying role from database for user ID:', req.user.id);
    const roleQuery = 'SELECT role, username, name, email, avatar_url FROM users WHERE id = $1';
    const roleResult = await authPool.query(roleQuery, [req.user.id]);
    
    console.log('📊 Database query result:', {
      rowsCount: roleResult.rows.length,
      row: roleResult.rows[0],
      role: roleResult.rows[0]?.role
    });
    
    const dbRole = roleResult.rows[0]?.role || req.user.role;
    
    // Also get other user info from database if available
    const dbUser = roleResult.rows[0];
    
    const responseUser = {
      id: req.user.id,
      email: dbUser?.email || req.user.email || '',
      username: dbUser?.username || req.user.username,
      name: dbUser?.name || req.user.name,
      role: dbRole, // Use role from database
      avatar_url: dbUser?.avatar_url || (req.user as any)?.avatar_url || null,
      avatar: dbUser?.avatar_url || (req.user as any)?.avatar || null,
    };
    
    console.log('✅ /auth/me - Returning user data:', {
      id: responseUser.id,
      email: responseUser.email,
      username: responseUser.username,
      name: responseUser.name,
      role: responseUser.role,
      avatar_url: responseUser.avatar_url,
      isAdmin: responseUser.role === 'admin'
    });

    res.status(200).json({
      user: responseUser
    });

  } catch (error) {
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
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      res.status(400).json({
        message: 'Refresh token is required'
      });
      return;
    }

    const { data, error } = await supabase.auth.refreshSession({
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

  } catch (error) {
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
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        message: 'Email is required'
      });
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
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

  } catch (error) {
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
router.post('/reset-password', async (req: Request, res: Response) => {
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

    const { error } = await supabase.auth.updateUser({
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

  } catch (error) {
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
router.put('/reset-password', async (req: Request, res: Response) => {
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
    const { data: userData, error: userError } = await supabase.auth.getUser(
      token
    );

    if (userError) {
      res.status(401).json({ error: 'Unauthorized: Invalid token' });
      return;
    }

    // ตรวจสอบรหัสผ่านเดิมโดยลองล็อกอิน
    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: userData.user.email || '',
        password: oldPassword,
      });

    if (loginError) {
      res.status(400).json({ error: 'Invalid old password' });
      return;
    }

    // อัปเดตรหัสผ่านของผู้ใช้
    const { data, error } = await supabase.auth.updateUser({
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
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

