# 🔧 Supabase Connection String Guide

> วิธีดึง Connection String ที่ถูกต้องจาก Supabase

---

## 🔴 ปัญหา: "Tenant or user not found"

**สาเหตุ:** Connection Pooling username format ไม่ถูกต้อง

---

## ✅ วิธีแก้ไข

### **Step 1: เข้า Supabase Dashboard**

1. ไปที่ https://app.supabase.com
2. Login เข้าระบบ
3. เลือกโปรเจ็กต์ที่เกี่ยวข้อง

---

### **Step 2: ดึง Connection String**

#### **สำหรับ Blog Posts Database:**
1. Project: `ywzvkyrmlggwhnzrfpdt`
2. ไปที่ **Settings** (⚙️) → **Database**
3. Scroll ลงไปหา **"Connection Pooling"**
4. Copy **"Connection string"** จาก **"Session mode"**

**ตัวอย่าง:**
```
postgresql://postgres.ywzvkyrmlggwhnzrfpdt:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

#### **สำหรับ Authentication Database:**
1. Project: `lyexkvqojyggrhfoqqqo`
2. ทำตามขั้นตอนเดียวกัน

---

### **Step 3: แทนที่ Password**

**⚠️ สำคัญ:** ต้องแทนที่ `[PASSWORD]` ด้วย password จริง

**สำหรับ Blog Posts DB:**
- Password: `_Blog@post01`
- ใช้ `%40` แทน `@`: `_Blog%40post01`

**สำหรับ Auth DB:**
- Password: `BlogPostAuth`

---

### **Step 4: อัพเดทใน Vercel**

1. ไปที่ Vercel Dashboard → **Settings** → **Environment Variables**
2. แก้ไข `DATABASE_URL`:

**Format ที่ถูกต้อง:**
```
postgresql://postgres.ywzvkyrmlggwhnzrfpdt:_Blog%40post01@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

**ให้สังเกต:**
- `postgres.ywzvkyrmlggwhnzrfpdt` (มี project ref)
- `_Blog%40post01` (URL-encoded password)
- `pooler.supabase.com` (ไม่ใช่ `db.*.supabase.co`)
- Port `6543` (ไม่ใช่ `5432`)

3. แก้ไข `AUTH_DATABASE_URL` ในลักษณะเดียวกัน

4. **Redeploy**

---

## 🎯 **Checklist**

- [ ] เข้า Supabase Dashboard
- [ ] ไปที่ Settings → Database → Connection Pooling
- [ ] Copy **Session mode** connection string
- [ ] แทนที่ password (ใช้ `%40` แทน `@`)
- [ ] อัพเดทใน Vercel
- [ ] Redeploy

---

## 📝 **ตัวอย่าง Connection Strings ที่ถูกต้อง**

### **Blog Posts Database:**
```
postgresql://postgres.ywzvkyrmlggwhnzrfpdt:_Blog%40post01@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### **Auth Database:**
```
postgresql://postgres.lyexkvqojyggrhfoqqqo:BlogPostAuth@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

---

## ⚠️ **Common Mistakes**

1. ❌ ใช้ `postgres:` แทน `postgres.PROJECT_REF:`
2. ❌ ใช้ `@` แทน `%40` ใน password
3. ❌ ใช้ `db.*.supabase.co` แทน `pooler.supabase.com`
4. ❌ ใช้ port `5432` แทน `6543`
5. ❌ ไม่ redeploy หลังแก้ไข environment variables

---

**แก้ตามนี้แล้วจะใช้งานได้!** ✅

