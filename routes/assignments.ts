import { Router, Request, Response } from 'express';
import multer from 'multer';
import pool from '../utils/db';
import { supabase } from '../utils/db';
import { CreatePostInput, UpdatePostInput } from '../types';
import { validatePost } from '../validators/postValidator';
import protectUser from '../middleware/protectUser';
import protectAdmin from '../middleware/protectAdmin';

const router = Router();

// Configure Multer for file upload
const multerUpload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Define file upload fields
const imageFileUpload = multerUpload.fields([
  { name: 'imageFile', maxCount: 1 }
]);

/**
 * GET /assignments
 * Get all blog posts
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT 
        p.id,
        p.title,
        p.image,
        p.category_id,
        c.name as category_name,
        p.description,
        p.content,
        p.date,
        p.status_id,
        s.status as status_name,
        p.likes_count
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN statuses s ON p.status_id = s.id
      ORDER BY p.date DESC
    `;
    
    const result = await pool.query(query);

    res.status(200).json({
      data: result.rows
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      message: 'Server could not read post because database connection'
    });
  }
});

/**
 * GET /assignments/:id
 * Get a single blog post by ID
 */
router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        p.id,
        p.title,
        p.image,
        p.category_id,
        c.name as category_name,
        p.description,
        p.content,
        p.date,
        p.status_id,
        s.status as status_name,
        p.likes_count
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN statuses s ON p.status_id = s.id
      WHERE p.id = $1
    `;
    
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Server could not find a requested post'
      });
    }

    res.status(200).json({
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      message: 'Server could not read post because database connection'
    });
  }
});

/**
 * POST /assignments
 * Create a new blog post (Protected - requires authentication)
 */
router.post('/', protectUser, validatePost, async (req: Request<{}, {}, CreatePostInput>, res: Response) => {
  try {
    const { title, image, category_id, description, content, status_id } = req.body;

    const query = `
      INSERT INTO posts (title, image, category_id, description, content, status_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [title, image, category_id, description, content, status_id];
    await pool.query(query, values);

    res.status(201).json({
      message: 'Created post successfully'
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      message: 'Server could not create post because database connection'
    });
  }
});

/**
 * PUT /assignments/:id
 * Update a blog post by ID (Protected - requires authentication)
 */
router.put('/:id', protectUser, validatePost, async (req: Request<{ id: string }, {}, UpdatePostInput>, res: Response) => {
  try {
    const { id } = req.params;
    const { title, image, category_id, description, content, status_id } = req.body;

    // Check if post exists
    const checkQuery = 'SELECT id FROM posts WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        message: 'Server could not find a requested post to update'
      });
    }

    // Update post
    const query = `
      UPDATE posts 
      SET title = $1, 
          image = $2, 
          category_id = $3, 
          description = $4, 
          content = $5, 
          status_id = $6
      WHERE id = $7
      RETURNING *
    `;
    
    const values = [title, image, category_id, description, content, status_id, id];
    await pool.query(query, values);

    res.status(200).json({
      message: 'Updated post successfully'
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      message: 'Server could not update post because database connection'
    });
  }
});

/**
 * POST /assignments/upload
 * Create a new blog post with file upload (Protected - requires authentication)
 */
router.post('/upload', imageFileUpload, protectUser, async (req: Request, res: Response) => {
  try {
    // 1) รับข้อมูลจาก request body และไฟล์ที่อัปโหลด
    const newPost = req.body;
    
    // Check if file exists
    if (!req.files || !('imageFile' in req.files) || !req.files.imageFile || req.files.imageFile.length === 0) {
      return res.status(400).json({
        error: 'Image file is required'
      });
    }

    const file = (req.files as { [fieldname: string]: Express.Multer.File[] }).imageFile[0];

    // Validate required fields
    if (!newPost.title || !newPost.category_id || !newPost.description || !newPost.content || !newPost.status_id) {
      return res.status(400).json({
        error: 'All fields are required: title, category_id, description, content, status_id'
      });
    }

    // 2) กำหนด bucket และ path ที่จะเก็บไฟล์ใน Supabase
    const bucketName = 'my-personal-blog';
    const filePath = `posts/${Date.now()}_${file.originalname}`;

    // 3) อัปโหลดไฟล์ไปยัง Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false // ป้องกันการเขียนทับไฟล์เดิม
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return res.status(500).json({
        error: 'Failed to upload image to storage',
        message: uploadError.message
      });
    }

    // 4) ดึง URL สาธารณะของไฟล์ที่อัปโหลด
    const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(uploadData.path);

    // 5) บันทึกข้อมูลโพสต์ลงในฐานข้อมูล
    const query = `
      INSERT INTO posts (title, image, category_id, description, content, status_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      newPost.title,
      publicUrl, // เก็บ URL ของรูปภาพ
      parseInt(newPost.category_id),
      newPost.description,
      newPost.content,
      parseInt(newPost.status_id)
    ];
    
    await pool.query(query, values);

    // 6) ส่งผลลัพธ์กลับไปยัง client
    res.status(201).json({
      message: 'Created post successfully',
      imageUrl: publicUrl
    });

  } catch (error) {
    console.error('Upload post error:', error);
    res.status(500).json({
      error: 'Server could not create post',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * DELETE /assignments/:id
 * Delete a blog post by ID
 */
router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    // Check if post exists
    const checkQuery = 'SELECT id FROM posts WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        message: 'Server could not find a requested post to delete'
      });
    }

    // Delete post
    const query = 'DELETE FROM posts WHERE id = $1';
    await pool.query(query, [id]);

    res.status(200).json({
      message: 'Deleted post successfully'
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      message: 'Server could not delete post because database connection'
    });
  }
});

export default router;

