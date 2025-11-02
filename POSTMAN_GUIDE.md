# 🧪 Postman Testing Guide

> คู่มือทดสอบ API ทุก endpoint ด้วย Postman

---

## ⚙️ **Postman Settings**

### **1. สร้าง Environment**

1. คลิก **"Environments"** ที่มุมซ้ายบน
2. คลิก **"+"** เพื่อสร้าง Environment ใหม่
3. ตั้งชื่อ: `Blog API - Local` หรือ `Blog API - Production`

**Add Variables:**

**สำหรับ Local Environment:**
| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:3001` | `http://localhost:3001` |
| `access_token` | (empty) | (will be set automatically) |
| `post_id` | (empty) | (will be set automatically) |

**สำหรับ Production Environment:**
| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `https://blog-post-project-api-five.vercel.app` | `https://blog-post-project-api-five.vercel.app` |
| `access_token` | (empty) | (will be set automatically) |
| `post_id` | (empty) | (will be set automatically) |

### **2. ใช้ Environment Variables**

**ในทุก Request URL ใช้:**
```
{{base_url}}/health
{{base_url}}/auth/login
{{base_url}}/assignments
```

**สำหรับ Protected Routes ใช้:**
```
Headers:
Authorization: Bearer {{access_token}}
```

### **3. ตั้งค่า Collection**

**สร้аng Collection:**
1. คลิก **"New"** → **"Collection"**
2. ตั้งชื่อ: `Blog Post API`
3. ตั้ง **Pre-request Script:**
```javascript
// Auto-set base URL
if (!pm.environment.get("base_url")) {
    pm.environment.set("base_url", "http://localhost:3001");
}
```

**ตั้ง Collection Variables:**
- คลิก **"Variables"** tab ใน Collection
- Add: `base_url` = `http://localhost:3001`

### **4. จัดระเบียบ Requests**

**สร้าง Folders:**
- 📁 **Basic** (Health, Profiles)
- 📁 **Authentication** (Register, Login, Logout, etc.)
- 📁 **Blog Posts** (CRUD operations)
- 📁 **File Upload** (Upload endpoints)

### **5. Auto-Save Token**

**ใน `/auth/login` request:**
- ไปที่ **Tests** tab
- เพิ่ม code:
```javascript
// Auto-save access_token from login response
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.access_token) {
        pm.environment.set("access_token", response.access_token);
        console.log("✅ Access token saved!");
    }
}
```

### **6. Console Logging**

**เปิด Console:**
1. ไปที่ **View** → **Show Postman Console** (Ctrl+Alt+C / Cmd+Alt+C)
2. เห็น logs และ response details

### **7. Auto-Fill Post ID**

**ใน `/auth/login` Tests tab เพิ่ม:**
```javascript
// Auto-save post_id from create response
if (pm.response.code === 201) {
    const response = pm.response.json();
    if (response.post && response.post.id) {
        pm.environment.set("post_id", response.post.id);
        console.log("✅ Post ID saved:", response.post.id);
    }
}
```

### **8. Pretty JSON Response**

**ตั้งค่า Auto-format:**
1. ไปที่ **Settings** ⚙️ (มุมขวาบน)
2. เปิด **"Pretty responses"**
3. Response จะ format อัตโนมัติ

### **9. Response Time**

**เพิ่ม Time Check ใน Tests:**
```javascript
// Check response time
pm.test("Response time is less than 2000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});
```

---

## 🌐 **Base URL**

### **Local Development (ทวนสอบได่มากที่สุด):**
```
http://localhost:3001
```
- เหมาะสำหรับ: ทดสอบในเครื่อง
- ข้อดี: รวดเร็ว ไม่มีล่าช้า

### **Vercel Production (Deployment จริง):**
```
https://blog-post-project-api-five.vercel.app
```
- เหมาะสำหรับ: ทดสอบหลัง deploy แล้วแก้ database config
- URL จริง: `blog-post-project-api-five.vercel.app`

### **หรือใช้ Variable:**
```
{{base_url}}/health
{{base_url}}/assignments
```
ตั้งค่าใน Postman Environment

---

## 🔐 **Authentication Requirements**

### **🌐 Public Endpoints (No Auth):**
- `GET /health` - Health check
- `GET /profiles` - Get profile
- `GET /assignments` - Get all posts
- `GET /assignments/:id` - Get single post
- `DELETE /assignments/:id` - Delete post

### **🔒 Protected Endpoints (Require Auth):**
- `POST /auth/register` - Register (no token needed)
- `POST /auth/login` - Login (no token needed)
- `GET /auth/me` - Get current user (need token)
- `POST /auth/logout` - Logout (need token)
- `POST /auth/refresh` - Refresh token (need token)
- `POST /auth/forgot-password` - Request password reset (no token needed)
- `POST /auth/reset-password` - Reset from email (no token needed)
- `PUT /auth/reset-password` - Change password (need token)
- `POST /assignments` - Create post (need token)
- `POST /assignments/upload` - Create with upload (need token)
- `PUT /assignments/:id` - Update post (need token)

**To test protected endpoints:** Login first, copy `access_token`, then add to headers:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## 📋 **1. Health Check**

### **GET /health**

**Request:**
- Method: `GET`
- URL: `{{base_url}}/health`
  หรือ: `http://localhost:3001/health`

**Expected Response (200):**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## 👤 **2. Profiles**

### **GET /profiles**

**Request:**
- Method: `GET`
- URL: `http://localhost:3001/profiles`

**Expected Response (200):**
```json
{
  "data": {
    "name": "john",
    "age": 20
  }
}
```

---

## 🔐 **Authentication Endpoints**

### **3. Register User**

**POST /auth/register**

**Request:**
- Method: `POST`
- URL: `http://localhost:3001/auth/register`
- Headers:
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "email": "test@example.com",
  "password": "password123",
  "username": "testuser",
  "name": "Test User"
}
```

**Expected Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "username": "testuser",
    "name": "Test User",
    "role": "user",
    "email": "test@example.com"
  }
}
```

---

### **4. Login User**

**POST /auth/login**

**Request:**
- Method: `POST`
- URL: `http://localhost:3001/auth/login`
- Headers:
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "email": "admin@blog.com",
  "password": "admin123"
}
```

**Expected Response (200):**
```json
{
  "message": "Signed in successfully",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**📌 เก็บ `access_token` ไว้ใช้สำหรับ endpoints ที่ต้องการ authentication**

---

### **5. Get Current User (Protected)**

**GET /auth/me**

**Request:**
- Method: `GET`
- URL: `http://localhost:3001/auth/me`
- Headers:
  - `Authorization: Bearer YOUR_ACCESS_TOKEN`
  - `Content-Type: application/json`

**Expected Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "admin@blog.com",
    "username": "admin",
    "name": "Admin User",
    "role": "admin"
  }
}
```

---

### **6. Logout (Protected)**

**POST /auth/logout**

**Request:**
- Method: `POST`
- URL: `http://localhost:3001/auth/logout`
- Headers:
  - `Authorization: Bearer YOUR_ACCESS_TOKEN`
  - `Content-Type: application/json`

**Expected Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

### **7. Refresh Token**

**POST /auth/refresh**

**Request:**
- Method: `POST`
- URL: `http://localhost:3001/auth/refresh`
- Headers:
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "refresh_token": "YOUR_REFRESH_TOKEN"
}
```

**Expected Response (200):**
```json
{
  "access_token": "NEW_ACCESS_TOKEN",
  "refresh_token": "NEW_REFRESH_TOKEN"
}
```

---

### **8. Forgot Password**

**POST /auth/forgot-password**

**Request:**
- Method: `POST`
- URL: `http://localhost:3001/auth/forgot-password`
- Headers:
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "email": "user@example.com"
}
```

**Expected Response (200):**
```json
{
  "message": "Password reset email sent"
}
```

---

### **9. Reset Password (from email)**

**POST /auth/reset-password**

**Request:**
- Method: `POST`
- URL: `http://localhost:3001/auth/reset-password`
- Headers:
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "token": "RESET_TOKEN_FROM_EMAIL",
  "new_password": "newpassword123"
}
```

**Expected Response (200):**
```json
{
  "message": "Password reset successful"
}
```

---

### **10. Change Password (Protected)**

**PUT /auth/reset-password**

**Request:**
- Method: `PUT`
- URL: `http://localhost:3001/auth/reset-password`
- Headers:
  - `Authorization: Bearer YOUR_ACCESS_TOKEN`
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "oldPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Expected Response (200):**
```json
{
  "message": "Password updated successfully",
  "user": { ... }
}
```

---

## 📝 **Blog Posts Endpoints**

### **11. Get All Posts**

**GET /assignments** (🌐 Public - no authentication needed)

**Request:**
- Method: `GET`
- URL: `http://localhost:3001/assignments`
- **No headers needed!**

**Expected Response (200):**
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

### **12. Get Single Post**

**GET /assignments/:id** (🌐 Public - no authentication needed)

**Request:**
- Method: `GET`
- URL: `http://localhost:3001/assignments/1`
- Replace `1` with actual post ID
- **No headers needed!**

**Expected Response (200):**
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

---

### **13. Create Post (with Image URL)**

**POST /assignments** (🔒 Protected - requires authentication)

**Request:**
- Method: `POST`
- URL: `http://localhost:3001/assignments`
- Headers:
  - `Authorization: Bearer YOUR_ACCESS_TOKEN`
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "title": "New Blog Post",
  "image": "https://example.com/image.jpg",
  "category_id": 1,
  "description": "Post description",
  "content": "This is the content of the blog post...",
  "status_id": 1
}
```

**Expected Response (201):**
```json
{
  "message": "Created post successfully"
}
```

---

### **14. Create Post (with File Upload)**

**POST /assignments/upload** (🔒 Protected - requires authentication)

**Request:**
- Method: `POST`
- URL: `http://localhost:3001/assignments/upload`
- Headers:
  - `Authorization: Bearer YOUR_ACCESS_TOKEN`
- Body:
  - Type: `form-data`
  - Fields:
    - `title`: "New Post with Upload"
    - `category_id`: 1
    - `description`: "Post description"
    - `content`: "Content here..."
    - `status_id`: 1
    - `imageFile`: (file) Select image file

**Expected Response (201):**
```json
{
  "message": "Created post successfully",
  "imageUrl": "https://..."
}
```

---

### **15. Update Post**

**PUT /assignments/:id** (🔒 Protected - requires authentication)

**Request:**
- Method: `PUT`
- URL: `http://localhost:3001/assignments/1`
- Headers:
  - `Authorization: Bearer YOUR_ACCESS_TOKEN`
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "title": "Updated Blog Post",
  "image": "https://example.com/new-image.jpg",
  "category_id": 2,
  "description": "Updated description",
  "content": "Updated content...",
  "status_id": 2
}
```

**Expected Response (200):**
```json
{
  "message": "Updated post successfully"
}
```

---

### **16. Delete Post**

**DELETE /assignments/:id** (🌐 Public - no authentication needed)

**Request:**
- Method: `DELETE`
- URL: `http://localhost:3001/assignments/1`
- **No headers needed!**

**Expected Response (200):**
```json
{
  "message": "Deleted post successfully"
}
```

---

## 🔍 **404 Error Test**

### **GET /unknown-endpoint**

**Request:**
- Method: `GET`
- URL: `http://localhost:3001/unknown-endpoint`

**Expected Response (404):**
```json
{
  "error": "Endpoint not found"
}
```

---

## 📋 **Quick Testing Checklist**

### **Basic Endpoints:**
- [ ] GET /health
- [ ] GET /profiles
- [ ] GET /assignments

### **Authentication:**
- [ ] POST /auth/register
- [ ] POST /auth/login
- [ ] GET /auth/me (protected)
- [ ] POST /auth/logout (protected)
- [ ] POST /auth/refresh
- [ ] POST /auth/forgot-password
- [ ] POST /auth/reset-password
- [ ] PUT /auth/reset-password (protected)

### **Blog Posts:**
- [ ] GET /assignments
- [ ] GET /assignments/:id
- [ ] POST /assignments
- [ ] POST /assignments/upload (protected)
- [ ] PUT /assignments/:id
- [ ] DELETE /assignments/:id

### **Error Handling:**
- [ ] GET /unknown-endpoint (404)
- [ ] POST /auth/me without token (401)
- [ ] POST /assignments with missing fields (400)

---

## 🎯 **Authentication Flow Example**

### **Step 1: Login**
```
POST /auth/login
Body: { "email": "admin@blog.com", "password": "admin123" }
```
**Copy `access_token` from response**

### **Step 2: Use Token**
```
GET /auth/me
Headers: { "Authorization": "Bearer <access_token>" }
```

### **Step 3: Create Post**
```
POST /assignments/upload
Headers: { "Authorization": "Bearer <access_token>" }
Body: form-data with image file
```

---

## 💡 **Tips**

1. **เก็บ Token:** หลังจาก login สำเร็จ ให้ copy `access_token` มาใส่ใน Authorization header
2. **Environment Variables:** สร้าง Postman Environment สำหรับ local และ production
3. **Collection:** จัดกลุ่ม requests เป็น folders เพื่อให้ง่ายต่อการทดสอบ
4. **Tests:** เพิ่ม tests scripts ใน Postman สำหรับ automation
5. **Variables:** ใช้ Postman variables สำหรับ ID, token ที่เปลี่ยนบ่อย

---

## 🎓 **Advanced Settings**

### **1. Request History**
- ดู history: ไปที่ **History** tab (ซ้ายบน)
- ลบ history: Click ขวา → **Clear all**

### **2. Keyboard Shortcuts**
- **Send Request:** Ctrl+Enter / Cmd+Enter
- **Save:** Ctrl+S / Cmd+S
- **New Request:** Ctrl+N / Cmd+N
- **Search:** Ctrl+Shift+F / Cmd+Shift+F

### **3. Import/Export**
**Export Collection:**
1. Click ขวาที่ Collection → **Export**
2. เลือก format (JSON)
3. Save ไฟล์

**Import Collection:**
1. Click **Import**
2. เลือกไฟล์ JSON
3. Done!

### **4. Sharing Collections**
**Team Sharing:**
1. Click ขวาที่ Collection → **Share Collection**
2. เลือก team หรือ public
3. Generate share link

---

## 📸 **Screenshot Tips**

1. **Pretty Print:** เปิด Pretty responses ใน Settings
2. **Copy Response:** Click ขวาที่ response → **Copy** → **Copy body**
3. **Save Response:** Click ขวา → **Save Response** → **Save to a file**
4. **Generate Code:** Click **Code** (ขวามือบน) → เลือกภาษา → Copy

---

**Happy Testing!** 🎉


