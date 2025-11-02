# 🔍 หาปุ่ม "Connect" ใน Supabase

> ตามเอกสาร: https://supabase.com/docs/guides/database/connecting-to-postgres

---

## 🎯 **วิธีหา Connection String**

### **1. ไปที่หน้า Database**
1. เปิด Supabase Dashboard
2. เลือกโปรเจ็กต์ **blog-post-db**
3. คลิก **"Database"** ใน sidebar ซ้าย

### **2. หาปุ่ม "Connect"**
**ตำแหน่ง:** ปุ่ม **"Connect"** จะอยู่ด้านบนของหน้า Database

**อาจแสดงเป็น:**
- ✅ "Connect" (ปกติ)
- ✅ "Connect to database"
- ✅ "Connection string"
- ✅ "Connect button"
- ✅ ไอคอน connection หรือ plug

### **3. คลิกปุ่ม "Connect"**
**เมื่อคลิกแล้วจะเห็น:**
- Direct connection
- **Supavisor Session Mode** (port 5432)
- **Supavisor Transaction Mode** (port 6543) ← **ใช้อันนี้สำหรับ Vercel!**

---

## ✅ **สำหรับ Vercel (Serverless)**

**ใช้:** **Supavisor Transaction Mode**

**Port:** `6543`

**Format:**
```
postgres://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres
```

**ตัวอย่างสำหรับ project ywzvkyrmlggwhnzrfpdt:**
```
postgres://postgres.ywzvkyrmlggwhnzrfpdt:_BlogPost01@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

---

## 📍 **ถ้ายังหาไม่เจอ**

ลองดูที่:
1. **Project Settings** → **Database** → Connection string
2. **Settings** → **API** → Database URL
3. **ท็อปของหน้า Database** มองหาปุ่ม Connect

หรือ **กด Ctrl/Cmd + F** แล้วค้นหา: `Connect`

---

**หลังจาก click "Connect" แล้ว → copy Transaction Mode → Paste ใน Vercel!** ✅

