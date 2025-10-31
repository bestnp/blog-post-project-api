# File Upload Documentation

> Complete guide for uploading images to Supabase Storage

---

## 📋 Overview

The upload endpoint allows authenticated users to upload image files when creating blog posts. Images are stored in **Supabase Storage** and the public URL is saved to the database.

---

## 🎯 Endpoint

**POST** `/assignments/upload`

**Authentication:** ✅ Required (protected route)

**Content-Type:** `multipart/form-data`

---

## 📝 Request Format

### Form Data Fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `imageFile` | File | ✅ Yes | Image file to upload |
| `title` | String | ✅ Yes | Post title |
| `category_id` | Number | ✅ Yes | Category ID |
| `description` | String | ✅ Yes | Post description |
| `content` | String | ✅ Yes | Post content |
| `status_id` | Number | ✅ Yes | Status ID |

---

## ✅ Success Response (201)

```json
{
  "message": "Created post successfully",
  "imageUrl": "https://lyexkvqojyggrhfoqqqo.supabase.co/storage/v1/object/public/my-personal-blog/posts/1234567890_image.jpg"
}
```

---

## ❌ Error Responses

### 400 - Missing File
```json
{
  "error": "Image file is required"
}
```

### 400 - Missing Fields
```json
{
  "error": "All fields are required: title, category_id, description, content, status_id"
}
```

### 400 - File Too Large
```json
{
  "error": "File too large. Maximum size: 10MB"
}
```

### 401 - Unauthorized
```json
{
  "error": "Unauthorized: Token missing"
}
```

### 500 - Storage Upload Failed
```json
{
  "error": "Failed to upload image to storage",
  "message": "Error details from Supabase"
}
```

---

## 💻 Usage Examples

### Example 1: Using cURL

```bash
curl -X POST http://localhost:3001/assignments/upload \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "imageFile=@/path/to/image.jpg" \
  -F "title=My Post with Image" \
  -F "category_id=1" \
  -F "description=Description here" \
  -F "content=Content here..." \
  -F "status_id=1"
```

---

### Example 2: Using JavaScript Fetch

```javascript
const uploadPostWithImage = async (imageFile, postData, token) => {
  const formData = new FormData();
  
  formData.append('imageFile', imageFile);
  formData.append('title', postData.title);
  formData.append('category_id', postData.category_id.toString());
  formData.append('description', postData.description);
  formData.append('content', postData.content);
  formData.append('status_id', postData.status_id.toString());

  const response = await fetch('http://localhost:3001/assignments/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
      // Don't set Content-Type! Browser will set it with boundary
    },
    body: formData
  });

  return await response.json();
};

// Usage
const fileInput = document.querySelector('input[type="file"]');
const imageFile = fileInput.files[0];

const result = await uploadPostWithImage(imageFile, {
  title: 'My Post',
  category_id: 1,
  description: 'Description',
  content: 'Content',
  status_id: 1
}, accessToken);

console.log(result);
```

---

### Example 3: Using Axios

```javascript
import axios from 'axios';

const uploadPost = async (imageFile, postData, token) => {
  const formData = new FormData();
  
  formData.append('imageFile', imageFile);
  formData.append('title', postData.title);
  formData.append('category_id', postData.category_id);
  formData.append('description', postData.description);
  formData.append('content', postData.content);
  formData.append('status_id', postData.status_id);

  const response = await axios.post(
    'http://localhost:3001/assignments/upload',
    formData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    }
  );

  return response.data;
};
```

---

### Example 4: React Component

```javascript
import React, { useState } from 'react';

function CreatePostForm() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category_id: 1,
    description: '',
    content: '',
    status_id: 1
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      alert('Please select an image');
      return;
    }

    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('imageFile', file);
      
      // Append all fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      const token = localStorage.getItem('access_token');
      
      const response = await fetch('http://localhost:3001/assignments/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('Post created successfully!');
        console.log('Image URL:', result.imageUrl);
        // Redirect or clear form
      } else {
        alert(result.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0])}
        required
      />
      
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
        required
      />
      
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        required
      />
      
      <textarea
        placeholder="Content"
        value={formData.content}
        onChange={(e) => setFormData({...formData, content: e.target.value})}
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Uploading...' : 'Create Post'}
      </button>
    </form>
  );
}
```

---

## 🔧 Implementation Details

### Supabase Storage Configuration

**Bucket Name:** `my-personal-blog`

**File Path Format:**
```
posts/{timestamp}_{original_filename}
```

**Example:**
```
posts/1761918201969_my-photo.jpg
```

---

### Upload Flow

```
1. Client sends FormData with image file
   ↓
2. Multer parses multipart/form-data
   ↓
3. protectUser middleware verifies JWT token
   ↓
4. Validate all required fields
   ↓
5. Upload file to Supabase Storage
   ↓
6. Get public URL from Supabase
   ↓
7. Save post data + image URL to database
   ↓
8. Return success with image URL
```

---

### Storage Settings

**File Size Limit:** 10MB

**Supported Formats:** All image formats (jpg, png, gif, webp, etc.)

**Storage:** Supabase Storage (public bucket)

---

## ⚙️ Configuration

### Environment Variables Required:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### Supabase Storage Setup:

1. Go to Supabase Dashboard
2. Navigate to **Storage**
3. Create bucket: `my-personal-blog`
4. Set bucket to **Public**
5. Configure CORS if needed

---

## 🔒 Security Features

- ✅ Authentication required
- ✅ File size limit (10MB)
- ✅ Unique file paths (timestamp-based)
- ✅ Public URL generation
- ✅ Error handling
- ✅ Type validation

---

## 🧪 Testing

### Test with cURL:

```bash
# First, login to get token
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Copy the access_token from response

# Then upload post with image
curl -X POST http://localhost:3001/assignments/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "imageFile=@/path/to/test.jpg" \
  -F "title=Test Post" \
  -F "category_id=1" \
  -F "description=Test description" \
  -F "content=Test content" \
  -F "status_id=1"
```

---

## 📊 File Upload Endpoints Comparison

| Endpoint | Method | File Upload | Image Field | Auth Required |
|----------|--------|-------------|-------------|---------------|
| `/assignments` | POST | ❌ No | URL string | ✅ Yes |
| `/assignments/upload` | POST | ✅ Yes | File upload | ✅ Yes |

**Use Cases:**
- `/assignments` - When you already have an image URL
- `/assignments/upload` - When you need to upload from device

---

## 🎯 Best Practices

### Frontend:

1. **Preview before upload**
   ```javascript
   const reader = new FileReader();
   reader.onload = (e) => {
     setPreview(e.target.result);
   };
   reader.readAsDataURL(file);
   ```

2. **Show upload progress**
   ```javascript
   const xhr = new XMLHttpRequest();
   xhr.upload.addEventListener('progress', (e) => {
     const percent = (e.loaded / e.total) * 100;
     setProgress(percent);
   });
   ```

3. **Validate file type**
   ```javascript
   const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
   if (!allowedTypes.includes(file.type)) {
     alert('Only images allowed');
     return;
   }
   ```

4. **Compress large images**
   - Use libraries like `browser-image-compression`
   - Reduce file size before upload

---

## ⚠️ Troubleshooting

### Problem: "Image file is required"
**Solution:** Make sure field name is exactly `imageFile`

### Problem: "Failed to upload image to storage"
**Causes:**
- Supabase bucket doesn't exist
- Bucket not public
- Network issue
- Invalid credentials

**Solution:**
1. Check bucket exists in Supabase
2. Verify bucket is public
3. Check SUPABASE_URL and SUPABASE_ANON_KEY

### Problem: "File too large"
**Solution:** Reduce file size or increase limit in code

---

## 📝 Summary

✅ **File upload working** - Multer + Supabase Storage  
✅ **Authentication required** - protectUser middleware  
✅ **Public URLs** - Generated automatically  
✅ **Error handling** - Comprehensive  
✅ **Type safety** - TypeScript support  

**Upload system is production-ready!** 🚀

