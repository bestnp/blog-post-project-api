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

- ✅ **TypeScript** - Full type safety
- ✅ **Express Router** - Modular route architecture
- ✅ **Validation** - Comprehensive input validation
- ✅ **Database** - PostgreSQL with Supabase
- ✅ **CORS** - Cross-origin resource sharing enabled
- ✅ **Error Handling** - Proper error responses
- ✅ **RESTful API** - Standard REST conventions

---

## 🛠️ Tech Stack

- **Runtime:** Node.js 20+
- **Framework:** Express.js 5.1
- **Language:** TypeScript 5.9
- **Database:** PostgreSQL (Supabase)
- **Validation:** Custom middleware
- **Development:** ts-node-dev

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
DATABASE_URL=postgresql://user:password@host:port/database
```

**Environment Variables:**
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `DATABASE_URL` - PostgreSQL connection string

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
   GET    /profiles        - Get John's profile
   GET    /assignments     - Get all blog posts
   GET    /assignments/:id - Get single blog post
   POST   /assignments     - Create new blog post
   PUT    /assignments/:id - Update blog post
   DELETE /assignments/:id - Delete blog post
   GET    /health          - Health check
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
│   ├── assignments.ts          # Blog posts routes
│   ├── profiles.ts             # Profiles routes
│   └── health.ts               # Health check route
├── validators/                 # Validation middleware
│   └── postValidator.ts        # Post validation
├── types/                      # TypeScript types
│   └── index.ts                # Type definitions
├── utils/                      # Utility functions
│   └── db.ts                   # Database connection
├── dist/                       # Compiled JavaScript
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies
```

---

## 📖 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture overview and design patterns
- **[VALIDATION.md](./VALIDATION.md)** - Validation rules and error handling

---

## 🧪 Testing

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

### Build for Production

```bash
npm run build
```

Compiled files will be in `dist/` directory.

### Start Production Server

```bash
npm start
```

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
