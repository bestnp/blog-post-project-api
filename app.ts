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

// Export app for Vercel serverless deployment
export default app;

// Start server for local development only
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`\n📋 API Endpoints:`);
    console.log(`\n🔐 Authentication:`);
    console.log(`   POST   /auth/register        - Register new user`);
    console.log(`   POST   /auth/login           - Login user`);
    console.log(`   POST   /auth/logout          - Logout user (protected)`);
    console.log(`   GET    /auth/me              - Get current user (protected)`);
    console.log(`   POST   /auth/refresh         - Refresh access token`);
    console.log(`   POST   /auth/forgot-password - Request password reset`);
    console.log(`   POST   /auth/reset-password  - Reset password`);
    console.log(`\n📝 Blog Posts:`);
    console.log(`   GET    /assignments          - Get all blog posts`);
    console.log(`   GET    /assignments/:id      - Get single blog post`);
    console.log(`   POST   /assignments          - Create new blog post (with image URL)`);
    console.log(`   POST   /assignments/upload   - Create post with file upload (protected)`);
    console.log(`   PUT    /assignments/:id      - Update blog post`);
    console.log(`   DELETE /assignments/:id      - Delete blog post`);
    console.log(`\n👤 Other:`);
    console.log(`   GET    /profiles             - Get John's profile`);
    console.log(`   GET    /health               - Health check`);
    console.log(``);
  });
}
