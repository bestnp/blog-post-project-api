import { Router, Request, Response } from 'express';
import multer from 'multer';
import { supabase } from '../utils/db';
import { authPool } from '../utils/db';
import protectUser from '../middleware/protectUser';

const router = Router();

/**
 * Configure Multer for file upload
 */
const multerUpload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit for avatars
  }
});

const avatarFileUpload = multerUpload.fields([
  { name: 'avatarFile', maxCount: 1 }
]);

/**
 * GET /profiles
 * Get current user profile (Protected - requires authentication)
 */
router.get('/', protectUser, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized'
      });
    }

    // Get user info from database
    const query = 'SELECT id, username, name, email, role, avatar_url FROM users WHERE id = $1';
    const result = await authPool.query(query, [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.status(200).json({
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

/**
 * PUT /profiles
 * Update user profile (name, username) (Protected - requires authentication)
 */
router.put('/', protectUser, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { username, name } = req.body;
    
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized'
      });
    }

    // Validate input
    if (!username && !name) {
      return res.status(400).json({
        error: 'At least one field (username or name) is required'
      });
    }

    // Check if username is already taken (by another user)
    if (username) {
      const checkQuery = 'SELECT id FROM users WHERE username = $1 AND id != $2';
      const checkResult = await authPool.query(checkQuery, [username, userId]);
      
      if (checkResult.rows.length > 0) {
        return res.status(400).json({
          error: 'Username is already taken'
        });
      }
    }

    // Build update query dynamically based on provided fields
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (username) {
      updates.push(`username = $${paramCount++}`);
      values.push(username);
    }

    if (name) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }

    values.push(userId); // Add user ID as last parameter

    const updateQuery = `
      UPDATE users 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING id, username, name, email, role, avatar_url
    `;

    const result = await authPool.query(updateQuery, values);

    res.status(200).json({
      message: 'Profile updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

/**
 * PUT /profiles/avatar
 * Upload and update user avatar (Protected - requires authentication)
 */
router.put('/avatar', avatarFileUpload, protectUser, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized'
      });
    }

    // Check if file exists
    if (!req.files || !('avatarFile' in req.files) || !req.files.avatarFile || (req.files.avatarFile as Express.Multer.File[]).length === 0) {
      return res.status(400).json({
        error: 'Avatar file is required'
      });
    }

    const file = (req.files as { [fieldname: string]: Express.Multer.File[] }).avatarFile[0];

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed'
      });
    }

    // 1) Define bucket and path for avatar in Supabase Storage
    const bucketName = 'my-personal-blog';
    const filePath = `avatars/${userId}/${Date.now()}_${file.originalname}`;

    // 2) Check if Supabase is configured
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      console.error('❌ Supabase credentials not configured');
      return res.status(500).json({
        error: 'Storage not configured',
        message: 'Supabase credentials are missing. Please configure SUPABASE_URL and SUPABASE_ANON_KEY environment variables.'
      });
    }

    // 3) Upload file to Supabase Storage
    console.log(`📤 Uploading avatar to bucket: ${bucketName}, path: ${filePath}`);
    console.log(`📦 File info: size=${file.buffer.length}, type=${file.mimetype}`);
    console.log(`🔑 Supabase URL: ${process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing'}`);
    console.log(`🔑 Service Role Key: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '⚠️  Using ANON_KEY'}`);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true // Allow overwriting existing files
      });

    if (uploadError) {
      console.error('❌ Storage upload error:', {
        message: uploadError.message,
        error: uploadError,
        bucketName,
        filePath,
        fileSize: file.buffer.length,
        fileMimetype: file.mimetype,
        hasSupabaseUrl: !!process.env.SUPABASE_URL,
        hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      });
      
      // Provide more helpful error messages
      let errorMessage = uploadError.message || 'Unknown storage error';
      let userFriendlyMessage = errorMessage;
      
      if (uploadError.message?.includes('Bucket not found') || uploadError.message?.includes('does not exist')) {
        userFriendlyMessage = `Bucket "${bucketName}" does not exist. Please create it in Supabase Storage > Storage section.`;
      } else if (uploadError.message?.includes('The resource already exists')) {
        userFriendlyMessage = 'File with this name already exists. Please try again.';
      } else if (uploadError.message?.includes('new row violates row-level security') || uploadError.message?.includes('RLS')) {
        userFriendlyMessage = 'Storage bucket permissions issue. Please check: 1) Bucket exists, 2) RLS policies allow uploads, 3) SUPABASE_SERVICE_ROLE_KEY is set in Vercel.';
      } else if (uploadError.message?.includes('permission') || uploadError.message?.includes('Forbidden') || uploadError.message?.includes('403')) {
        userFriendlyMessage = 'Permission denied. Please check: 1) SUPABASE_SERVICE_ROLE_KEY is set in Vercel environment variables, 2) Bucket RLS policies allow uploads.';
      } else if (uploadError.message?.includes('JWT')) {
        userFriendlyMessage = 'Authentication error. Please check SUPABASE_SERVICE_ROLE_KEY is correctly set in Vercel.';
      }
      
      return res.status(500).json({
        error: 'Failed to upload avatar to storage',
        message: userFriendlyMessage,
        details: process.env.NODE_ENV === 'development' ? {
          originalError: errorMessage,
          bucketName,
          filePath,
          hasSupabaseUrl: !!process.env.SUPABASE_URL,
          hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        } : undefined
      });
    }
    
    console.log('✅ Avatar uploaded successfully:', uploadData);

    // 3) Get public URL of uploaded file
    const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(uploadData.path);

    // 4) Update avatar URL in database
    const query = `
      UPDATE users 
      SET avatar_url = $1 
      WHERE id = $2 
      RETURNING id, username, name, email, role, avatar_url
    `;
    const result = await authPool.query(query, [publicUrl, userId]);

    // 5) Return success response
    res.status(200).json({
      message: 'Avatar updated successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({
      error: 'Server could not update avatar',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;

