# Complete API Endpoints Documentation

> All available endpoints in the Blog Post API

---

## 📋 Overview

**Base URL:** `http://localhost:3001`  
**Total Endpoints:** 14  
**Authentication:** JWT Bearer Token (where required)

---

## 🔐 Authentication Endpoints

### 1. POST /auth/register
Register a new user account.

**Auth Required:** ❌ No

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "johndoe",
  "name": "John Doe"
}
```

**Success Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "username": "johndoe",
    "name": "John Doe",
    "role": "user",
    "email": "user@example.com"
  }
}
```

**Error Response (400):**
```json
{
  "error": "This username is already taken"
}
```

---

### 2. POST /auth/login
Login with email and password.

**Auth Required:** ❌ No

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Signed in successfully",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (400):**
```json
{
  "error": "Your password is incorrect or this email doesn't exist"
}
```

---

### 3. POST /auth/logout
Logout current user.

**Auth Required:** ✅ Yes

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

### 4. GET /auth/me
Get current authenticated user profile.

**Auth Required:** ✅ Yes

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "name": "John Doe",
    "role": "authenticated"
  }
}
```

**Error Response (401):**
```json
{
  "error": "Unauthorized: Token missing"
}
```

---

### 5. POST /auth/refresh
Refresh access token using refresh token.

**Auth Required:** ❌ No

**Request Body:**
```json
{
  "refresh_token": "v1.Mw..."
}
```

**Success Response (200):**
```json
{
  "message": "Token refreshed successfully",
  "session": {
    "access_token": "eyJhbGc...",
    "refresh_token": "v1.Mw...",
    "expires_at": 1730380800
  }
}
```

---

### 6. POST /auth/forgot-password
Request password reset email.

**Auth Required:** ❌ No

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "Password reset email sent"
}
```

---

### 7. POST /auth/reset-password
Reset password with token from email (forgot password flow).

**Auth Required:** ❌ No

**Request Body:**
```json
{
  "password": "newpassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Password reset successful"
}
```

---

### 8. PUT /auth/reset-password
Change password when logged in (requires old password verification).

**Auth Required:** ✅ Yes

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "oldPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Success Response (200):**
```json
{
  "message": "Password updated successfully",
  "user": { ... }
}
```

**Error Response (400):**
```json
{
  "error": "Invalid old password"
}
```

---

## 📝 Blog Posts Endpoints

### 9. GET /assignments
Get all blog posts.

**Auth Required:** ❌ No

**Success Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Post Title",
      "image": "https://...",
      "category_id": 1,
      "category_name": "Technology",
      "description": "Description",
      "content": "Content...",
      "date": "2025-10-31T00:00:00.000Z",
      "status_id": 1,
      "status_name": "Published",
      "likes_count": 0
    }
  ]
}
```

---

### 10. GET /assignments/:id
Get a single blog post by ID.

**Auth Required:** ❌ No

**Success Response (200):**
```json
{
  "data": {
    "id": 1,
    "title": "Post Title",
    "image": "https://...",
    "category_id": 1,
    "category_name": "Technology",
    "description": "Description",
    "content": "Content...",
    "date": "2025-10-31T00:00:00.000Z",
    "status_id": 1,
    "status_name": "Published",
    "likes_count": 0
  }
}
```

**Error Response (404):**
```json
{
  "message": "Server could not find a requested post"
}
```

---

### 11. POST /assignments
Create a new blog post with image URL.

**Auth Required:** ✅ Yes

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "My Blog Post",
  "image": "https://example.com/image.jpg",
  "category_id": 1,
  "description": "Post description",
  "content": "Full content here...",
  "status_id": 1
}
```

**Success Response (201):**
```json
{
  "message": "Created post successfully"
}
```

**Error Response (400):**
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

### 12. POST /assignments/upload
Create a new blog post with file upload.

**Auth Required:** ✅ Yes

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Form Data:**
```
imageFile: [FILE]
title: "My Post"
category_id: 1
description: "Description"
content: "Content"
status_id: 1
```

**Success Response (201):**
```json
{
  "message": "Created post successfully",
  "imageUrl": "https://...supabase.../storage/.../image.jpg"
}
```

**Error Response (400):**
```json
{
  "error": "Image file is required"
}
```

---

### 13. PUT /assignments/:id
Update an existing blog post.

**Auth Required:** ✅ Yes

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Post",
  "image": "https://example.com/new-image.jpg",
  "category_id": 1,
  "description": "Updated description",
  "content": "Updated content",
  "status_id": 1
}
```

**Success Response (200):**
```json
{
  "message": "Updated post successfully"
}
```

**Error Response (404):**
```json
{
  "message": "Server could not find a requested post to update"
}
```

---

### 14. DELETE /assignments/:id
Delete a blog post.

**Auth Required:** ✅ Yes

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "message": "Deleted post successfully"
}
```

**Error Response (404):**
```json
{
  "message": "Server could not find a requested post to delete"
}
```

---

## 👤 Other Endpoints

### 15. GET /profiles
Get user profile.

**Auth Required:** ❌ No

**Success Response (200):**
```json
{
  "data": {
    "name": "john",
    "age": 20
  }
}
```

---

### 16. GET /health
Health check endpoint.

**Auth Required:** ❌ No

**Success Response (200):**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

### 17. ANY /[other]
404 handler for unknown endpoints.

**Success Response (404):**
```json
{
  "error": "Endpoint not found"
}
```

---

## 📊 Endpoints Summary Table

| # | Method | Endpoint | Auth | Description |
|---|--------|----------|------|-------------|
| 1 | POST | `/auth/register` | ❌ | Register user |
| 2 | POST | `/auth/login` | ❌ | Login user |
| 3 | POST | `/auth/logout` | ✅ | Logout user |
| 4 | GET | `/auth/me` | ✅ | Get current user |
| 5 | POST | `/auth/refresh` | ❌ | Refresh token |
| 6 | POST | `/auth/forgot-password` | ❌ | Request reset email |
| 7 | POST | `/auth/reset-password` | ❌ | Reset from email |
| 8 | PUT | `/auth/reset-password` | ✅ | Change password |
| 9 | GET | `/assignments` | ❌ | Get all posts |
| 10 | GET | `/assignments/:id` | ❌ | Get single post |
| 11 | POST | `/assignments` | ✅ | Create post (URL) |
| 12 | POST | `/assignments/upload` | ✅ | Create post (upload) |
| 13 | PUT | `/assignments/:id` | ✅ | Update post |
| 14 | DELETE | `/assignments/:id` | ✅ | Delete post |
| 15 | GET | `/profiles` | ❌ | Get profile |
| 16 | GET | `/health` | ❌ | Health check |
| - | ANY | `/*` | - | 404 handler |

---

## 🔑 Authentication Header

For protected endpoints, include:

```
Authorization: Bearer <your_access_token>
```

---

## 📝 Common Request/Response Examples

### Using cURL

#### Register:
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123","username":"user","name":"User"}'
```

#### Login:
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'
```

#### Create Post (with token):
```bash
curl -X POST http://localhost:3001/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Post","image":"https://...","category_id":1,"description":"Desc","content":"Content","status_id":1}'
```

#### Upload Post (with file):
```bash
curl -X POST http://localhost:3001/assignments/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "imageFile=@image.jpg" \
  -F "title=Post" \
  -F "category_id=1" \
  -F "description=Desc" \
  -F "content=Content" \
  -F "status_id=1"
```

---

## ✅ All Endpoints Tested and Working!

**Total:** 16 endpoints  
**Auth Required:** 9 endpoints  
**Public:** 7 endpoints  

**Status:** ✅ Production Ready

