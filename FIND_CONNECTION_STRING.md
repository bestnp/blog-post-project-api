# 🔍 หา Connection String ใน Supabase

> วิธี copy connection string จาก Supabase Dashboard

---

## 📋 **ขั้นตอน (ถ้าไม่มี Connection Pooling)**

### **1. เปิด Supabase Dashboard**
1. ไปที่ https://app.supabase.com
2. Login เข้า account
3. เลือกโปรเจ็กต์ **blog-post-db** (หรือที่แสดงในหน้าจอ)

### **2. ไปที่ Settings → Database**
1. คลิก **Settings** (⚙️) มุมซ้ายบน
2. คลิก **Database** ในเมนูซ้าย

### **3. หา Connection String**
Scroll ลงไปและหา:
- ✅ **"Connection string"** หรือ
- ✅ **"Connection Pooling"** หรือ
- ✅ **"Database URL"**

**ตำแหน่งที่มักจะมี:**
- ในแท็บ "Connection info"
- ในแท็บ "Connection string"
- ในส่วน "Database settings"

### **4. Copy และ Replace Password**
เมื่อพบ connection string จะเห็นประมาณนี้:
```
postgresql://postgres:[YOUR-PASSWORD]@db.ywzvkyrmlggwhnzrfpdt.supabase.co:5432/postgres
```

**Replace:** `[YOUR-PASSWORD]` หรือ `[PASSWORD]` → `_BlogPost01`

**Result:**
```
postgresql://postgres:_BlogPost01@db.ywzvkyrmlggwhnzrfpdt.supabase.co:5432/postgres
```

---

## ⚠️ **Important**

**แต่ละโปรเจ็กต์จะมี connection string ไม่เหมือนกัน!**

**ต้อง:**
- ✅ Copy จาก Supabase Dashboard
- ✅ Replace password เท่านั้น

**ไม่ต้อง:**
- ❌ ตั้งเองจากตัวอย่าง
- ❌ เดา URL

---

## 🔗 **ถ้ายังหาไม่เจอ**

ลองดูที่:
1. **Project Settings** → **Database**
2. **API** → **Database URL**
3. **Settings** → **General** → **Database**

หรือ **Supabase ล่าสุดอาจเปลี่ยน UI** ลอง:
1. คลิกขวาที่ชื่อโปรเจ็กต์
2. เลือก **"Open in new tab"**
3. ดูที่ sidebar ซ้าย → **"Project Settings"**

---

**หลังจาก copy ได้แล้ว → Paste ใน Vercel Environment Variables!** ✅

