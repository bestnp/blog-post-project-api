"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const db_1 = __importDefault(require("../utils/db"));
const db_2 = require("../utils/db");
const postValidator_1 = require("../validators/postValidator");
const protectUser_1 = __importDefault(require("../middleware/protectUser"));
const router = (0, express_1.Router)();
// Configure Multer for file upload
const multerUpload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
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
router.get('/', async (req, res) => {
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
        const result = await db_1.default.query(query);
        res.status(200).json({
            data: result.rows
        });
    }
    catch (error) {
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
router.get('/:id', async (req, res) => {
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
        const result = await db_1.default.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Server could not find a requested post'
            });
        }
        res.status(200).json({
            data: result.rows[0]
        });
    }
    catch (error) {
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
router.post('/', protectUser_1.default, postValidator_1.validatePost, async (req, res) => {
    try {
        const { title, image, category_id, description, content, status_id } = req.body;
        const query = `
      INSERT INTO posts (title, image, category_id, description, content, status_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
        const values = [title, image, category_id, description, content, status_id];
        await db_1.default.query(query, values);
        res.status(201).json({
            message: 'Created post successfully'
        });
    }
    catch (error) {
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
router.put('/:id', protectUser_1.default, postValidator_1.validatePost, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, image, category_id, description, content, status_id } = req.body;
        // Check if post exists
        const checkQuery = 'SELECT id FROM posts WHERE id = $1';
        const checkResult = await db_1.default.query(checkQuery, [id]);
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
        await db_1.default.query(query, values);
        res.status(200).json({
            message: 'Updated post successfully'
        });
    }
    catch (error) {
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
router.post('/upload', imageFileUpload, protectUser_1.default, async (req, res) => {
    try {
        // 1) รับข้อมูลจาก request body และไฟล์ที่อัปโหลด
        const newPost = req.body;
        // Check if file exists
        if (!req.files || !('imageFile' in req.files) || !req.files.imageFile || req.files.imageFile.length === 0) {
            return res.status(400).json({
                error: 'Image file is required'
            });
        }
        const file = req.files.imageFile[0];
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
        const { data: uploadData, error: uploadError } = await db_2.supabase.storage
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
        const { data: { publicUrl } } = db_2.supabase.storage.from(bucketName).getPublicUrl(uploadData.path);
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
        await db_1.default.query(query, values);
        // 6) ส่งผลลัพธ์กลับไปยัง client
        res.status(201).json({
            message: 'Created post successfully',
            imageUrl: publicUrl
        });
    }
    catch (error) {
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
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Check if post exists
        const checkQuery = 'SELECT id FROM posts WHERE id = $1';
        const checkResult = await db_1.default.query(checkQuery, [id]);
        if (checkResult.rows.length === 0) {
            return res.status(404).json({
                message: 'Server could not find a requested post to delete'
            });
        }
        // Delete post
        const query = 'DELETE FROM posts WHERE id = $1';
        await db_1.default.query(query, [id]);
        res.status(200).json({
            message: 'Deleted post successfully'
        });
    }
    catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            message: 'Server could not delete post because database connection'
        });
    }
});
exports.default = router;
