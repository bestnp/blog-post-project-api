import { Router, Request, Response } from 'express';
import pool from '../utils/db';
import { CreatePostInput, UpdatePostInput } from '../types';
import { validatePost } from '../validators/postValidator';

const router = Router();

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
 * Create a new blog post
 */
router.post('/', validatePost, async (req: Request<{}, {}, CreatePostInput>, res: Response) => {
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
 * Update a blog post by ID
 */
router.put('/:id', validatePost, async (req: Request<{ id: string }, {}, UpdatePostInput>, res: Response) => {
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

