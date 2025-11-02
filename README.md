# Blog Post Project API

> TypeScript Express API Server with modular architecture and comprehensive validation

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.1-green)](https://expressjs.com/)
[![Node](https://img.shields.io/badge/Node-20+-brightgreen)](https://nodejs.org/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Server](#-running-the-server)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)

---

## ✨ Features

- ✅ **TypeScript** - Full type safety, 100% TS deployment
- ✅ **Express Router** - Modular route architecture
- ✅ **Authentication** - JWT-based auth with Supabase
- ✅ **Authorization** - Role-based access control (Admin/User)
- ✅ **Validation** - Comprehensive input validation
- ✅ **Database** - Dual PostgreSQL with Supabase
- ✅ **File Upload** - Supabase Storage integration
- ✅ **CORS** - Cross-origin resource sharing enabled
- ✅ **Error Handling** - Proper error responses
- ✅ **RESTful API** - Standard REST conventions

---

## 🛠️ Tech Stack

- **Runtime:** Node.js 20+
- **Framework:** Express.js 5.1
- **Language:** TypeScript 5.9
- **Database:** PostgreSQL (Supabase) - Dual databases
- **Authentication:** Supabase Auth (JWT)
- **Storage:** Supabase Storage
- **File Upload:** Multer
- **Validation:** Custom middleware
- **Development:** ts-node-dev
- **Deployment:** Vercel (TypeScript-native)

---

## 📦 Installation

```bash
# Clone repository
git clone <repository-url>

# Navigate to project
cd blog-post-project-api

# Install dependencies
npm install
```

---

## ⚙️ Configuration

Create a `.env` file in the root directory:

```env
PORT=3001
NODE_ENV=development

# Blog Posts Database
DATABASE_URL=postgresql://user:password@host:port/database

# Authentication Database
AUTH_DATABASE_URL=postgresql://user:password@host:port/database

# Supabase Client
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

**Environment Variables:**
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `DATABASE_URL` - PostgreSQL connection for blog posts
- `AUTH_DATABASE_URL` - PostgreSQL connection for authentication
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `FRONTEND_URL` - Frontend URL for CORS

---

## 🚀 Running the Server

### Development Mode
```bash
npm run dev
```
- Hot reload enabled
- TypeScript compilation on-the-fly
- Console logging enabled

### Production Mode
```bash
# Build TypeScript
npm run build

# Start server
npm start
```

### Server Output
```
🚀 Server is running on http://localhost:3001
📋 API Endpoints:

🔐 Authentication:
   POST   /auth/register        - Register new user
   POST   /auth/login           - Login user
   POST   /auth/logout          - Logout user (protected)
   GET    /auth/me              - Get current user (protected)
   POST   /auth/refresh         - Refresh access token
   POST   /auth/forgot-password - Request password reset
   POST   /auth/reset-password  - Reset password with token
   PUT    /auth/reset-password  - Change password (protected)

📝 Blog Posts:
   GET    /assignments          - Get all blog posts
   GET    /assignments/:id      - Get single blog post
   POST   /assignments          - Create new blog post (with image URL)
   POST   /assignments/upload   - Create post with file upload (protected)
   PUT    /assignments/:id      - Update blog post
   DELETE /assignments/:id      - Delete blog post

👤 Other:
   GET    /profiles             - Get John's profile
   GET    /health               - Health check
```

---

## 📡 API Endpoints

### Health Check

**GET** `/health`

Check server status

**Response (200)**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

### Profiles

**GET** `/profiles`

Get user profile

**Response (200)**
```json
{
  "data": {
    "name": "john",
    "age": 20
  }
}
```

---

### Blog Posts

#### Get All Posts

**GET** `/assignments`

**Response (200)**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Blog Post Title",
      "image": "https://example.com/image.jpg",
      "category_id": 1,
      "category_name": "Technology",
      "description": "Post description",
      "content": "Post content...",
      "date": "2025-10-31T00:00:00.000Z",
      "status_id": 1,
      "status_name": "Published",
      "likes_count": 0
    }
  ]
}
```

---

#### Get Single Post

**GET** `/assignments/:id`

**Response (200)**
```json
{
  "data": {
    "id": 1,
    "title": "Blog Post Title",
    "image": "https://example.com/image.jpg",
    "category_id": 1,
    "category_name": "Technology",
    "description": "Post description",
    "content": "Post content...",
    "date": "2025-10-31T00:00:00.000Z",
    "status_id": 1,
    "status_name": "Published",
    "likes_count": 0
  }
}
```

**Response (404)**
```json
{
  "message": "Server could not find a requested post"
}
```

---

#### Create Post

**POST** `/assignments`

**Request Body**
```json
{
  "title": "New Blog Post",
  "image": "https://example.com/image.jpg",
  "category_id": 1,
  "description": "Post description",
  "content": "Post content...",
  "status_id": 1
}
```

**Response (201)**
```json
{
  "message": "Created post successfully"
}
```

**Response (400)** - Validation Error
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

---

#### Update Post

**PUT** `/assignments/:id`

**Request Body**
```json
{
  "title": "Updated Blog Post",
  "image": "https://example.com/image.jpg",
  "category_id": 1,
  "description": "Updated description",
  "content": "Updated content...",
  "status_id": 1
}
```

**Response (200)**
```json
{
  "message": "Updated post successfully"
}
```

**Response (404)**
```json
{
  "message": "Server could not find a requested post to update"
}
```

---

#### Delete Post

**DELETE** `/assignments/:id`

**Response (200)**
```json
{
  "message": "Deleted post successfully"
}
```

**Response (404)**
```json
{
  "message": "Server could not find a requested post to delete"
}
```

---

## 📁 Project Structure

```
blog-post-project-api/
├── app.ts                      # Main application
├── routes/                     # Route modules
│   ├── index.ts                # Main router
│   ├── auth.ts                 # Authentication routes
│   ├── assignments.ts          # Blog posts routes
│   ├── profiles.ts             # Profiles routes
│   └── health.ts               # Health check route
├── middleware/                 # Middleware
│   ├── auth.ts                 # Auth middleware
│   ├── protectUser.ts          # User protection
│   └── protectAdmin.ts         # Admin protection
├── validators/                 # Validation middleware
│   └── postValidator.ts        # Post validation
├── types/                      # TypeScript types
│   └── index.ts                # Type definitions
├── utils/                      # Utility functions
│   └── db.ts                   # Database connection
├── vercel.json                 # Vercel config
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies
```

---

## 📖 Documentation

- **[API_ENDPOINTS.md](./API_ENDPOINTS.md)** - Complete API documentation
- **[POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md)** - Postman testing guide (all endpoints)
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture overview and design patterns
- **[AUTHENTICATION.md](./AUTHENTICATION.md)** - Authentication & authorization guide
- **[MIDDLEWARE.md](./MIDDLEWARE.md)** - Middleware documentation
- **[VALIDATION.md](./VALIDATION.md)** - Validation rules and error handling
- **[UPLOAD.md](./UPLOAD.md)** - File upload guide
- **[VERCEL_SETUP.md](./VERCEL_SETUP.md)** - Vercel deployment guide

---

## 🧪 Testing

### Testing with Postman (Recommended)

📖 **See:** [POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md) for complete testing guide

**Quick Start:**
1. Import endpoints into Postman
2. Test `/auth/login` to get access token
3. Use token in Authorization header for protected routes
4. Test all 16 endpoints

### Manual Testing with curl

```bash
# Health check
curl http://localhost:3001/health

# Get all posts
curl http://localhost:3001/assignments

# Create post
curl -X POST http://localhost:3001/assignments \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post",
    "image": "https://example.com/image.jpg",
    "category_id": 1,
    "description": "Test description",
    "content": "Test content",
    "status_id": 1
  }'

# Update post
curl -X PUT http://localhost:3001/assignments/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Post",
    "image": "https://example.com/image.jpg",
    "category_id": 1,
    "description": "Updated description",
    "content": "Updated content",
    "status_id": 1
  }'

# Delete post
curl -X DELETE http://localhost:3001/assignments/1
```

---

## 🔒 Security Features

- ✅ Input validation
- ✅ Type checking
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS enabled
- ✅ Error handling

---

## 🚀 Deployment

### Vercel Deployment (Recommended)

This project is configured for **TypeScript-native** deployment on Vercel.

**Configuration:**
- ✅ `vercel.json` configured to use `app.ts`
- ✅ No build step required
- ✅ Automatic TypeScript compilation
- ✅ 100% TypeScript codebase

**Deploy Steps:**

1. **Push to GitHub:**
```bash
git add .
git commit -m "Ready for deployment"
git push origin api-server
```

2. **Configure Vercel:**
   - Connect repository to Vercel
   - Add environment variables (see Configuration section)
   - Deploy!

3. **Environment Variables:**
   Set all variables from `.env` in Vercel Dashboard

**See:** [VERCEL_SETUP.md](./VERCEL_SETUP.md) for detailed instructions

---

### Local Production Build

```bash
npm run build
npm start
```

Compiled files will be in `dist/` directory.

---

## 📝 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm test` | Run tests (not implemented yet) |

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📄 License

ISC

---

## 👨‍💻 Author

Built with ❤️ using TypeScript and Express

---

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Happy Coding! 🚀**
