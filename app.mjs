import express from 'express';
import cors from 'cors';

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
  console.log(`   GET  /profiles - Get John's profile`);
  console.log(`   GET  /health   - Health check`);
});

export default app;
