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
  console.log(`   GET  /profiles     - Get John's profile`);
  console.log(`   POST /assignments  - Create new blog post`);
  console.log(`   GET  /health       - Health check`);
});

export default app;
