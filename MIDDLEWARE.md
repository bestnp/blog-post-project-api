# Middleware Documentation

> Express middleware for authentication and authorization

---

## 📋 Overview

We have **3 types of middleware** for different use cases:

1. **`protectUser`** - Protect routes (requires authentication)
2. **`protectAdmin`** - Protect admin routes (requires admin role)
3. **Original middleware** - `authenticateToken`, `optionalAuth`, `requireRole`

---

## 🔒 1. ProtectUser Middleware

**File:** `middleware/protectUser.ts`

**Purpose:** ตรวจสอบว่า user มี valid JWT token หรือไม่

### How it works:
1. ✅ ตรวจสอบ `Authorization` header
2. ✅ ดึง JWT token
3. ✅ ตรวจสอบ token กับ Supabase
4. ✅ แนบข้อมูล user เข้ากับ `req.user`
5. ✅ ถ้า valid → ไปต่อ
6. ❌ ถ้าไม่ valid → return 401

### Usage Example:

```typescript
import protectUser from '../middleware/protectUser';

// Protect a route
router.get('/profile', protectUser, async (req, res) => {
  // req.user is available here
  res.json({
    message: 'Access granted',
    user: req.user
  });
});

// Protect POST endpoint
router.post('/assignments', protectUser, validatePost, async (req, res) => {
  // req.user is available here
  const userId = req.user?.id;
  
  // Create post...
});
```

### Response (No Token - 401):
```json
{
  "error": "Unauthorized: Token missing"
}
```

### Response (Invalid Token - 401):
```json
{
  "error": "Unauthorized: Invalid token"
}
```

### Response (Success):
```json
{
  "message": "Access granted",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "name": "John Doe",
    "role": "authenticated"
  }
}
```

---

## 👑 2. ProtectAdmin Middleware

**File:** `middleware/protectAdmin.ts`

**Purpose:** ตรวจสอบว่า user มี role เป็น `admin` หรือไม่

### How it works:
1. ✅ ตรวจสอบ JWT token (เหมือน protectUser)
2. ✅ Query database เพื่อดึง `role` ของ user
3. ✅ ตรวจสอบว่า role === `'admin'`
4. ✅ แนบข้อมูล user + role เข้ากับ `req.user`
5. ✅ ถ้าเป็น admin → ไปต่อ
6. ❌ ถ้าไม่ใช่ admin → return 403

### Usage Example:

```typescript
import protectAdmin from '../middleware/protectAdmin';

// Admin-only endpoint
router.delete('/assignments/:id', protectAdmin, async (req, res) => {
  // Only admin can access this
  res.json({
    message: 'Admin access granted',
    user: req.user
  });
});

// Admin dashboard
router.get('/admin/dashboard', protectAdmin, async (req, res) => {
  // Fetch admin data...
});
```

### Response (No Token - 401):
```json
{
  "error": "Unauthorized: Token missing"
}
```

### Response (Invalid Token - 401):
```json
{
  "error": "Unauthorized: Invalid token"
}
```

### Response (Not Admin - 403):
```json
{
  "error": "Forbidden: You do not have admin access"
}
```

### Response (User Not Found - 404):
```json
{
  "error": "User role not found"
}
```

### Response (Success):
```json
{
  "message": "Admin access granted",
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "username": "admin",
    "name": "Admin User",
    "role": "admin"
  }
}
```

---

## 🔐 3. Original Middleware

These exist for backward compatibility and additional features:

### `authenticateToken`
- Similar to `protectUser`
- Returns custom messages

### `optionalAuth`
- Doesn't fail if no token
- Useful for public routes with optional user data

### `requireRole(role)`
- Check specific role dynamically
- Usage: `router.get('/admin', authenticateToken, requireRole('admin'), handler)`

---

## 📊 Comparison Table

| Feature | protectUser | protectAdmin | authenticateToken |
|---------|-------------|--------------|-------------------|
| Check Token | ✅ Yes | ✅ Yes | ✅ Yes |
| Check Role | ❌ No | ✅ Yes (admin only) | ❌ No |
| Query Database | ❌ No | ✅ Yes | ❌ No |
| Error Message | Specific | Specific | Generic |
| Use Case | General auth | Admin routes | Flexible auth |

---

## 💻 Usage Examples

### Example 1: Protect Blog Creation

```typescript
// routes/assignments.ts
import protectUser from '../middleware/protectUser';
import { validatePost } from '../validators/postValidator';

// Only authenticated users can create posts
router.post('/', protectUser, validatePost, async (req, res) => {
  const userId = req.user?.id;
  
  const query = `
    INSERT INTO posts (title, image, category_id, description, content, status_id, user_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  
  await pool.query(query, [title, image, category_id, description, content, status_id, userId]);
  
  res.status(201).json({ message: 'Post created' });
});
```

### Example 2: Admin Delete Route

```typescript
// routes/admin.ts
import protectAdmin from '../middleware/protectAdmin';

// Only admin can delete posts
router.delete('/posts/:id', protectAdmin, async (req, res) => {
  const { id } = req.params;
  
  await pool.query('DELETE FROM posts WHERE id = $1', [id]);
  
  res.json({ message: 'Post deleted by admin' });
});
```

### Example 3: User Profile Route

```typescript
// routes/profiles.ts
import protectUser from '../middleware/protectUser';

// Get current user profile
router.get('/me', protectUser, async (req, res) => {
  res.json({
    user: req.user
  });
});
```

### Example 4: Admin Dashboard

```typescript
// routes/admin.ts
import protectAdmin from '../middleware/protectAdmin';

// Admin dashboard with stats
router.get('/dashboard', protectAdmin, async (req, res) => {
  const usersCount = await pool.query('SELECT COUNT(*) FROM users');
  const postsCount = await pool.query('SELECT COUNT(*) FROM posts');
  
  res.json({
    admin: req.user,
    stats: {
      users: usersCount.rows[0].count,
      posts: postsCount.rows[0].count
    }
  });
});
```

---

## 🧪 Testing Middleware

### Test ProtectUser

```bash
# Without token (should fail)
curl http://localhost:3001/protected

# With invalid token (should fail)
curl http://localhost:3001/protected \
  -H "Authorization: Bearer invalid_token"

# With valid token (should succeed)
curl http://localhost:3001/protected \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Test ProtectAdmin

```bash
# With user token (should fail with 403)
curl http://localhost:3001/admin/dashboard \
  -H "Authorization: Bearer USER_TOKEN"

# With admin token (should succeed)
curl http://localhost:3001/admin/dashboard \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## ⚠️ Common Issues

### Issue 1: "Token missing"
**Cause:** Not sending Authorization header

**Solution:**
```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Issue 2: "Invalid token"
**Cause:** Token expired or malformed

**Solution:** Refresh token or login again

### Issue 3: "User role not found"
**Cause:** User not in PostgreSQL users table

**Solution:** Make sure user registered properly

### Issue 4: "Forbidden: You do not have admin access"
**Cause:** User role is not 'admin'

**Solution:** Update user role in database:
```sql
UPDATE users SET role = 'admin' WHERE id = 'user_uuid';
```

---

## 📝 Summary

### ✅ Use `protectUser` when:
- Route requires authentication
- Any logged-in user can access
- Need to know user ID

### ✅ Use `protectAdmin` when:
- Route requires admin privileges
- Need to query database for role
- Admin-only operations

### 🎯 Best Practices:

1. **Always protect sensitive routes**
   ```typescript
   router.post('/posts', protectUser, handler);
   ```

2. **Chain middleware in correct order**
   ```typescript
   router.post('/posts', protectUser, validatePost, handler);
   ```

3. **Use protectAdmin for admin routes**
   ```typescript
   router.delete('/posts/:id', protectAdmin, handler);
   ```

4. **Check user in handler when needed**
   ```typescript
   const userId = req.user?.id;
   ```

---

## 🚀 Quick Reference

### Import Middleware:
```typescript
import protectUser from '../middleware/protectUser';
import protectAdmin from '../middleware/protectAdmin';
```

### Apply to Route:
```typescript
router.get('/protected', protectUser, handler);
router.delete('/admin', protectAdmin, handler);
```

### Access User Data:
```typescript
const userId = req.user?.id;
const email = req.user?.email;
const role = req.user?.role;
```

---

**Middleware system is production-ready!** 🎉

