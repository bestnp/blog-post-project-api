# 🔧 แก้ไข Database Connection บน Vercel

> วิธีแก้ปัญหา "Tenant or user not found" error

---

## ✅ **สถานะ Local Development**

**Local APIs:** ✅ **ทำงานได้ทั้งหมด** (5/5 tests passed)
- ✅ GET /health
- ✅ GET /assignments
- ✅ GET /assignments/:id
- ✅ GET /profiles
- ✅ POST /auth/login
- ✅ GET /auth/me (protected)

---

## 🔴 **ปัญหาบน Vercel**

**Error:** `"Tenant or user not found"` (code: XX000)

**สาเหตุ:** Connection string ใน Vercel Environment Variables ยังไม่ถูกต้อง

---

## ✅ **วิธีแก้ไข**

### **ขั้นตอนที่ 1: ไปที่ Supabase Dashboard**

1. เปิด https://app.supabase.com
2. Login
3. เลือกโปรเจ็กต์ **ywzvkyrmlggwhnzrfpdt** (Blog Posts DB)

### **ขั้นตอนที่ 2: ดึง Connection String**

1. คลิก **Settings** (⚙️) → **Database**
2. Scroll ลงไปหา **"Connection Pooling"**
3. **Copy** Connection string จาก **"Session mode"**

**ตัวอย่างที่ได้:**
```
postgresql://postgres.ywzvkyrmlggwhnzrfpdt:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### **ขั้นตอนที่ 3: แทนที่ Password**

Replace `[PASSWORD]` ด้วย:

**สำหรับ Blog Posts DB:**
- ใช้: `_BlogPost01` (password จริงจาก .env)

**Connection string สุดท้าย:**
```
postgresql://postgres.ywzvkyrmlggwhnzrfpdt:_BlogPost01@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### **ขั้นตอนที่ 4: ทำเหมือนกันกับ Auth DB**

1. เลือกโปรเจ็กต์ **lyexkvqojyggrhfoqqqo** (Auth DB)
2. ดึง Connection Pooling string
3. Replace password: `BlogPostAuth`

### **ขั้นตอนที่ 5: อัพเดท Vercel**

1. ไปที่ Vercel Dashboard → **Settings** → **Environment Variables**
2. แก้ไข `DATABASE_URL` และ `AUTH_DATABASE_URL`
3. คลิก **Save**
4. ไปที่ **Deployments** → คลิก **"..."** → **Redeploy**

---

## ⚠️ **Checklist**

ต้องมีทุกอย่างนี้:

✅ **Hostname:** `pooler.supabase.com` (ไม่ใช่ `db.*.supabase.co`)  
✅ **Username:** `postgres.PROJECT_REF` (ไม่ใช่ `postgres:`)  
✅ **Port:** `6543` (ไม่ใช่ `5432`)  
✅ **Password:** `_BlogPost01` (ใช้ password จริง ไม่ต้อง encode)  
✅ **Redeployed:** ✅ หลังแก้ไข  

---

## 🧪 **ทดสอบ**

```bash
curl https://blog-post-project-api-five.vercel.app/health
# Expected: {"status":"OK","message":"Server is running"}

curl https://blog-post-project-api-five.vercel.app/assignments
# Expected: {"data":[...]}
```

---

**Local ทำงานได้แล้ว! แก้ตามนี้ Vercel ก็จะทำงานเหมือนกัน!** ✅🚀

