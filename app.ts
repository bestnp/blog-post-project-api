import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mount all routes
app.use('/', routes);

// 404 handler
app.use((req: Request, res: Response) => {
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
