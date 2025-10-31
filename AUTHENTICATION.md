## Authentication System Documentation

> Complete authentication system using Supabase Auth with JWT tokens

---

## 📋 Table of Contents

- [Overview](#overview)
- [Setup](#setup)
- [API Endpoints](#api-endpoints)
- [Middleware](#middleware)
- [Usage Examples](#usage-examples)
- [Error Handling](#error-handling)

---

## 🎯 Overview

This authentication system provides:
- ✅ User registration
- ✅ User login
- ✅ JWT token-based authentication
- ✅ Token refresh
- ✅ Password reset
- ✅ Protected routes
- ✅ Role-based access control

**Technology Stack:**
- Supabase Auth
- JWT Tokens
- TypeScript
- Express Middleware

---

## ⚙️ Setup

### 1. Environment Variables

Add these to your `.env` file:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Frontend URL (for password reset)
FRONTEND_URL=http://localhost:3000

# Database (already configured)
DATABASE_URL=postgresql://...
```

### 2. Get Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`

---

## 📡 API Endpoints

### 1. Register User

**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "johndoe",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "name": "John Doe"
  },
  "session": {
    "access_token": "eyJhbGc...",
    "refresh_token": "v1.Mw...",
    "expires_at": 1730380800
  }
}
```

**Validation:**
- ✅ Email is required
- ✅ Password is required (min 6 characters)
- ⚠️ Username and name are optional

---

### 2. Login

**POST** `/auth/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "name": "John Doe",
    "role": "authenticated"
  },
  "session": {
    "access_token": "eyJhbGc...",
    "refresh_token": "v1.Mw...",
    "expires_at": 1730380800
  }
}
```

**Response (401):**
```json
{
  "message": "Invalid email or password"
}
```

---

### 3. Logout

**POST** `/auth/logout`

Logout current user (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

### 4. Get Current User

**GET** `/auth/me`

Get current authenticated user profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
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

**Response (401):**
```json
{
  "message": "Not authenticated"
}
```

---

### 5. Refresh Token

**POST** `/auth/refresh`

Refresh access token using refresh token.

**Request Body:**
```json
{
  "refresh_token": "v1.Mw..."
}
```

**Response (200):**
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

### 6. Forgot Password

**POST** `/auth/forgot-password`

Request password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "Password reset email sent"
}
```

---

### 7. Reset Password

**POST** `/auth/reset-password`

Reset password (requires reset token from email).

**Request Body:**
```json
{
  "password": "newpassword123"
}
```

**Response (200):**
```json
{
  "message": "Password reset successful"
}
```

---

## 🔒 Middleware

### 1. `authenticateToken`

Requires valid JWT token. Blocks request if not authenticated.

**Usage:**
```typescript
import { authenticateToken } from '../middleware/auth';

router.get('/protected', authenticateToken, (req, res) => {
  // req.user is available here
  res.json({ user: req.user });
});
```

### 2. `optionalAuth`

Checks for token but doesn't block if missing.

**Usage:**
```typescript
import { optionalAuth } from '../middleware/auth';

router.get('/posts', optionalAuth, (req, res) => {
  // req.user might be undefined
  const userId = req.user?.id;
  // ...
});
```

### 3. `requireRole`

Requires specific user role.

**Usage:**
```typescript
import { authenticateToken, requireRole } from '../middleware/auth';

router.delete('/admin', authenticateToken, requireRole('admin'), (req, res) => {
  // Only admin users can access
});
```

---

## 💻 Usage Examples

### Client-Side (React/JavaScript)

#### 1. Register User

```javascript
const register = async (email, password, username, name) => {
  const response = await fetch('http://localhost:3001/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password, username, name })
  });
  
  const data = await response.json();
  
  if (response.ok) {
    // Save tokens
    localStorage.setItem('access_token', data.session.access_token);
    localStorage.setItem('refresh_token', data.session.refresh_token);
  }
  
  return data;
};
```

#### 2. Login

```javascript
const login = async (email, password) => {
  const response = await fetch('http://localhost:3001/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (response.ok) {
    localStorage.setItem('access_token', data.session.access_token);
    localStorage.setItem('refresh_token', data.session.refresh_token);
  }
  
  return data;
};
```

#### 3. Make Authenticated Request

```javascript
const getProtectedData = async () => {
  const token = localStorage.getItem('access_token');
  
  const response = await fetch('http://localhost:3001/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
};
```

#### 4. Refresh Token

```javascript
const refreshToken = async () => {
  const refresh_token = localStorage.getItem('refresh_token');
  
  const response = await fetch('http://localhost:3001/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refresh_token })
  });
  
  const data = await response.json();
  
  if (response.ok) {
    localStorage.setItem('access_token', data.session.access_token);
    localStorage.setItem('refresh_token', data.session.refresh_token);
  }
  
  return data;
};
```

---

### cURL Examples

#### Register:
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "username": "johndoe",
    "name": "John Doe"
  }'
```

#### Login:
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### Get Current User:
```bash
curl http://localhost:3001/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🚨 Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "message": "Email and password are required"
}
```

#### 401 Unauthorized
```json
{
  "message": "Invalid or expired token"
}
```

#### 403 Forbidden
```json
{
  "message": "Insufficient permissions"
}
```

#### 500 Internal Server Error
```json
{
  "message": "Authentication failed"
}
```

---

## 🔐 Security Features

- ✅ **JWT Tokens** - Secure token-based authentication
- ✅ **Password Hashing** - Handled by Supabase
- ✅ **Token Expiration** - Access tokens expire automatically
- ✅ **Refresh Tokens** - Long-lived tokens for renewal
- ✅ **HTTPS** - Use in production
- ✅ **CORS** - Configured for security
- ✅ **Password Requirements** - Min 6 characters

---

## 📊 Token Lifecycle

```
1. User logs in
   ↓
2. Server returns access_token + refresh_token
   ↓
3. Client stores tokens
   ↓
4. Client uses access_token for requests
   ↓
5. When access_token expires:
   - Use refresh_token to get new tokens
   ↓
6. Repeat until refresh_token expires
   ↓
7. User must login again
```

---

## 🔧 Protecting Routes

### Example: Protected Blog Post Creation

```typescript
import { authenticateToken } from '../middleware/auth';

// Only authenticated users can create posts
router.post('/assignments', authenticateToken, validatePost, async (req, res) => {
  // req.user is available
  const userId = req.user?.id;
  
  // Create post with user info
  // ...
});
```

---

## 🎯 Best Practices

1. **Store tokens securely**
   - Use `httpOnly` cookies (recommended)
   - Or localStorage/sessionStorage
   - Never expose in URL

2. **Refresh tokens before expiration**
   - Check token expiry
   - Refresh proactively

3. **Clear tokens on logout**
   ```javascript
   localStorage.removeItem('access_token');
   localStorage.removeItem('refresh_token');
   ```

4. **Handle token expiration**
   - Catch 401 errors
   - Attempt refresh
   - Redirect to login if refresh fails

5. **Use HTTPS in production**
   - Never send tokens over HTTP

---

## 📝 Summary

✅ **Registration** - User sign up with email/password  
✅ **Login** - Authenticate and get tokens  
✅ **Protected Routes** - Middleware for authentication  
✅ **Token Refresh** - Automatic token renewal  
✅ **Password Reset** - Forgot password flow  
✅ **User Profile** - Get current user data  
✅ **Role-Based Access** - Admin/user permissions  

**Authentication system is production-ready!** 🚀

