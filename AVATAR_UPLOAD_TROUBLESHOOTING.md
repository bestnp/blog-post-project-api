# 🔧 Avatar Upload Troubleshooting Guide

> คู่มือแก้ไขปัญหาการอัพโหลดรูปโปรไฟล์ (Avatar)

---

## 🎯 สรุปปัญหา

**Error Message:** `"Failed to upload avatar to storage"`

ปัญหานี้เกิดจากหลายสาเหตุได้ ต้องตรวจสอบทั้ง **Backend** และ **Frontend**

---

## ✅ สิ่งที่แก้ไขแล้ว (Backend)

### 1. ✅ แก้ไข Middleware Order
- **ก่อน:** `multer` → `protectUser` 
- **หลัง:** `protectUser` → `multer`
- **เหตุผล:** ตรวจสอบ authentication ก่อน parse file

### 2. ✅ เพิ่ม Error Logging
- เพิ่ม logging เมื่อไม่พบไฟล์
- แสดงข้อมูล `content-type` และ `req.files` เพื่อ debug

---

## 🔍 ตรวจสอบปัญหา (Backend)

### 1. Environment Variables (สำคัญที่สุด!)

**ตรวจสอบใน Vercel:**
1. ไปที่ Vercel Dashboard → Project → Settings → Environment Variables
2. ตรวจสอบว่ามีค่าต่อไปนี้:
   - ✅ `SUPABASE_URL`
   - ✅ `SUPABASE_ANON_KEY`
   - ✅ `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **สำคัญมาก!**

**ถ้าไม่มี `SUPABASE_SERVICE_ROLE_KEY`:**
- ดูวิธีแก้ไขใน `AVATAR_UPLOAD_FIX.md`
- หรือใช้ Vercel + Supabase Integration (แนะนำ)

### 2. Bucket Name

**Backend ใช้ bucket name:** `blog-post-project`

**ตรวจสอบใน Supabase:**
1. ไปที่ Supabase Dashboard → Storage
2. ตรวจสอบว่ามี bucket ชื่อ `blog-post-project`
3. ถ้าไม่มี → สร้าง bucket ใหม่:
   - Name: `blog-post-project`
   - **⚠️ สำคัญ:** ตั้งเป็น **Public bucket**
   - Enable: **Public bucket**

### 3. ตรวจสอบ Logs

**ดู logs ใน Vercel:**
1. Vercel Dashboard → Deployments → เลือก deployment ล่าสุด
2. ไปที่ Functions tab → คลิก function ที่เกี่ยวข้อง
3. ดู Logs

**ข้อความที่ควรเห็นเมื่อสำเร็จ:**
```
📤 Uploading avatar to bucket: blog-post-project
🔑 Supabase URL: ✅ Set
🔑 Service Role Key: ✅ Set
✅ Avatar uploaded successfully
```

**ข้อความที่แสดงปัญหา:**
```
❌ Storage upload error: ...
hasServiceRoleKey: false  ← ถ้าเป็น false แสดงว่า missing SERVICE_ROLE_KEY
```

---

## 🔍 ตรวจสอบปัญหา (Frontend)

### 1. Request Format

**ต้องส่ง request ในรูปแบบนี้:**

```javascript
const formData = new FormData();
formData.append('avatarFile', imageFile); // ⚠️ ชื่อ field ต้องเป็น "avatarFile"

const response = await fetch('https://your-api.vercel.app/profiles/avatar', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${accessToken}` // ⚠️ ต้องมี token
    // ⚠️ อย่า set Content-Type! Browser จะ set ให้อัตโนมัติ
  },
  body: formData
});
```

### 2. ข้อผิดพลาดที่พบบ่อย

#### ❌ Error: "Avatar file is required"
**สาเหตุ:**
- ชื่อ field ไม่ถูกต้อง (ต้องเป็น `avatarFile` แม่นยำ)
- ไม่ได้ส่งไฟล์จริง
- Content-Type ไม่ใช่ `multipart/form-data`

**แก้ไข:**
```javascript
// ✅ ถูกต้อง
formData.append('avatarFile', file);

// ❌ ผิด
formData.append('avatar', file);
formData.append('image', file);
formData.append('file', file);
```

#### ❌ Error: "Unauthorized"
**สาเหตุ:**
- ไม่มี Authorization header
- Token หมดอายุ
- Token ไม่ถูกต้อง

**แก้ไข:**
```javascript
// ตรวจสอบ token ก่อนส่ง request
const token = localStorage.getItem('access_token');
if (!token) {
  // Redirect to login
}
```

#### ❌ Error: "Invalid file type"
**สาเหตุ:**
- ไฟล์ไม่ใช่รูปภาพ
- รูปแบบไฟล์ไม่รองรับ

**รองรับ:** JPEG, PNG, GIF, WebP

**แก้ไข:**
```javascript
// ตรวจสอบ file type ก่อนส่ง
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
if (!allowedTypes.includes(file.type)) {
  alert('กรุณาเลือกรูปภาพเท่านั้น (JPEG, PNG, GIF, WebP)');
  return;
}
```

#### ❌ Error: "File too large"
**สาเหตุ:**
- ไฟล์ใหญ่เกิน 5MB

**แก้ไข:**
```javascript
// ตรวจสอบ file size
const maxSize = 5 * 1024 * 1024; // 5MB
if (file.size > maxSize) {
  alert('ไฟล์ใหญ่เกิน 5MB กรุณาเลือกรูปภาพที่เล็กกว่า');
  return;
}
```

---

## 📝 ตัวอย่าง Code Frontend (React)

```javascript
import React, { useState } from 'react';

function AvatarUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) return;
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('กรุณาเลือกรูปภาพเท่านั้น (JPEG, PNG, GIF, WebP)');
      return;
    }
    
    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError('ไฟล์ใหญ่เกิน 5MB');
      return;
    }
    
    setFile(selectedFile);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('กรุณาเลือกรูปภาพ');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('avatarFile', file); // ⚠️ ชื่อ field สำคัญ!

      const token = localStorage.getItem('access_token');
      
      const response = await fetch('https://your-api.vercel.app/profiles/avatar', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
          // ⚠️ อย่า set Content-Type!
        },
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Upload failed');
      }

      // Success!
      console.log('Avatar updated:', result.data.avatar_url);
      alert('อัพโหลดรูปโปรไฟล์สำเร็จ!');
      
      // Refresh profile data
      // ... reload user profile
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'เกิดข้อผิดพลาดในการอัพโหลด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={loading}
      />
      
      {file && (
        <div>
          <p>Selected: {file.name}</p>
          <img 
            src={URL.createObjectURL(file)} 
            alt="Preview" 
            style={{ maxWidth: '200px' }}
          />
        </div>
      )}
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <button onClick={handleUpload} disabled={loading || !file}>
        {loading ? 'Uploading...' : 'Upload Avatar'}
      </button>
    </div>
  );
}

export default AvatarUpload;
```

---

## 🔍 Debug Checklist

### Backend Issues:
- [ ] `SUPABASE_SERVICE_ROLE_KEY` ตั้งค่าใน Vercel แล้ว
- [ ] Bucket `blog-post-project` มีอยู่และเป็น Public
- [ ] Environment variables ทั้งหมดถูกตั้งค่าใน Vercel
- [ ] Redeploy หลังจากเปลี่ยน environment variables

### Frontend Issues:
- [ ] ส่ง field name เป็น `avatarFile` (แม่นยำ)
- [ ] มี Authorization header พร้อม token
- [ ] ไม่ได้ set Content-Type header (ให้ browser set)
- [ ] ไฟล์เป็นรูปภาพและขนาดไม่เกิน 5MB
- [ ] ใช้ FormData ในการส่ง request

---

## 📞 ยังแก้ไม่ได้?

**ส่งข้อมูลเหล่านี้:**
1. Error message จาก frontend console
2. Response จาก Network tab (DevTools)
3. Logs จาก Vercel Functions
4. ตรวจสอบว่า bucket name ตรงกันหรือไม่

---

## 📚 Related Documents

- `AVATAR_UPLOAD_FIX.md` - วิธีตั้งค่า Supabase + Vercel
- `API_ENDPOINTS.md` - เอกสาร API ทั้งหมด
- `UPLOAD.md` - คู่มือการอัพโหลดไฟล์

---

**Last Updated:** January 2025



