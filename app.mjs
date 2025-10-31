import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pool from './utils/db.mjs';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock Data
const users = [
  {
    id: 1,
    name: "john",
    age: 20,
    email: "john@example.com"
  }
];

// API Endpoints

/**
 * GET /profiles
 * Response: 200 - { data: { name: "john", age: 20 } }
 */
app.get('/profiles', (req, res) => {
  try {
    const user = users.find(u => u.name === 'john');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.status(200).json({
      data: {
        name: user.name,
        age: user.age
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

/**
 * GET /assignments
 * Get all blog posts
 * Response: 
 *   200 - { data: [...posts] }
 *   500 - { message: "Server could not read post because database connection" }
 */
app.get('/assignments', async (req, res) => {
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
 * Response: 
 *   200 - { data: {...post} }
 *   404 - { message: "Server could not find a requested post" }
 *   500 - { message: "Server could not read post because database connection" }
 */
app.get('/assignments/:id', async (req, res) => {
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
 * Body: { title, image, category_id, description, content, status_id }
 * Response: 
 *   201 - { message: "Created post successfully" }
 *   400 - { message: "Server could not create post because there are missing data from client" }
 *   500 - { message: "Server could not create post because database connection" }
 */
app.post('/assignments', async (req, res) => {
  try {
    const { title, image, category_id, description, content, status_id } = req.body;

    // Validate required fields
    if (!title || !image || !category_id || !description || !content || !status_id) {
      return res.status(400).json({
        message: 'Server could not create post because there are missing data from client'
      });
    }

    // Insert into database
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
 * Body: { title, image, category_id, description, content, status_id }
 * Response: 
 *   200 - { message: "Updated post successfully" }
 *   400 - { message: "Server could not update post because there are missing data from client" }
 *   404 - { message: "Server could not find a requested post to update" }
 *   500 - { message: "Server could not update post because database connection" }
 */
app.put('/assignments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image, category_id, description, content, status_id } = req.body;

    // Validate required fields
    if (!title || !image || !category_id || !description || !content || !status_id) {
      return res.status(400).json({
        message: 'Server could not update post because there are missing data from client'
      });
    }

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
 * Response: 
 *   200 - { message: "Deleted post successfully" }
 *   404 - { message: "Server could not find a requested post to delete" }
 *   500 - { message: "Server could not delete post because database connection" }
 */
app.delete('/assignments/:id', async (req, res) => {
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

/**
 * GET /health
 * Health check endpoint
 * Response: 200 - { status: "OK", message: "Server is running" }
 */
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📋 API Endpoints:`);
  console.log(`   GET    /profiles        - Get John's profile`);
  console.log(`   GET    /assignments     - Get all blog posts`);
  console.log(`   GET    /assignments/:id - Get single blog post`);
  console.log(`   POST   /assignments     - Create new blog post`);
  console.log(`   PUT    /assignments/:id - Update blog post`);
  console.log(`   DELETE /assignments/:id - Delete blog post`);
  console.log(`   GET    /health          - Health check`);
});

export default app;
