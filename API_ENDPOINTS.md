# Complete API Endpoints Documentation

> All available endpoints in the Blog Post API

---

## 📋 Overview

**Base URL:** `http://localhost:3001`  
**Total Endpoints:** 23  
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

## 👤 Profile Endpoints

### 15. GET /profiles
Get current user profile.

**Auth Required:** ✅ Yes

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "username": "johndoe",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "user",
    "avatar_url": "https://...supabase.../storage/.../avatar.jpg"
  }
}
```

**Error Response (401):**
```json
{
  "error": "Unauthorized"
}
```

---

### 16. PUT /profiles
Update user profile (name, username).

**Auth Required:** ✅ Yes

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "newusername",
  "name": "New Name"
}
```
*Note: Both fields are optional, at least one must be provided*

**Success Response (200):**
```json
{
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid",
    "username": "newusername",
    "name": "New Name",
    "email": "user@example.com",
    "role": "user",
    "avatar_url": "https://..."
  }
}
```

**Error Response (400):**
```json
{
  "error": "Username is already taken"
}
```

---

### 17. PUT /profiles/avatar
Upload and update user avatar.

**Auth Required:** ✅ Yes

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Form Data:**
```
avatarFile: [IMAGE FILE]
```

**Success Response (200):**
```json
{
  "message": "Avatar updated successfully",
  "data": {
    "id": "uuid",
    "username": "johndoe",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "user",
    "avatar_url": "https://...supabase.../storage/.../avatar.jpg"
  }
}
```

**Error Response (400):**
```json
{
  "error": "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed"
}
```

---

## 📂 Category Endpoints

### 18. GET /categories
Get all categories.

**Auth Required:** ❌ No

**Success Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Technology"
    },
    {
      "id": 2,
      "name": "Lifestyle"
    }
  ]
}
```

---

### 19. GET /categories/:id
Get single category by ID.

**Auth Required:** ❌ No

**Success Response (200):**
```json
{
  "data": {
    "id": 1,
    "name": "Technology"
  }
}
```

**Error Response (404):**
```json
{
  "message": "Server could not find a requested category"
}
```

---

### 20. POST /categories
Create a new category.

**Auth Required:** ✅ Yes (Admin only)

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "New Category"
}
```

**Success Response (201):**
```json
{
  "message": "Created category successfully",
  "data": {
    "id": 3,
    "name": "New Category"
  }
}
```

**Error Response (400):**
```json
{
  "message": "Category with this name already exists"
}
```

---

### 21. PUT /categories/:id
Update a category.

**Auth Required:** ✅ Yes (Admin only)

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Category"
}
```

**Success Response (200):**
```json
{
  "message": "Updated category successfully"
}
```

**Error Response (404):**
```json
{
  "message": "Server could not find a requested category to update"
}
```

---

### 22. DELETE /categories/:id
Delete a category.

**Auth Required:** ✅ Yes (Admin only)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "message": "Deleted category successfully"
}
```

**Error Response (400):**
```json
{
  "message": "Cannot delete category because it is used in existing posts"
}
```

---

## 💚 Health Endpoint

### 23. GET /health
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

### 24. ANY /[other]
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
| 15 | GET | `/profiles` | ✅ | Get current profile |
| 16 | PUT | `/profiles` | ✅ | Update profile |
| 17 | PUT | `/profiles/avatar` | ✅ | Update avatar |
| 18 | GET | `/categories` | ❌ | Get all categories |
| 19 | GET | `/categories/:id` | ❌ | Get single category |
| 20 | POST | `/categories` | ✅ | Create category |
| 21 | PUT | `/categories/:id` | ✅ | Update category |
| 22 | DELETE | `/categories/:id` | ✅ | Delete category |
| 23 | GET | `/health` | ❌ | Health check |
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

**Total:** 23 endpoints  
**Auth Required:** 13 endpoints  
**Public:** 10 endpoints  

**Status:** ✅ Production Ready

