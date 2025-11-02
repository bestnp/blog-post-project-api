# 🔍 How to Get Connection Pooling URL

> ตามเอกสาร Supabase: https://supabase.com/docs/guides/database/connecting-to-postgres

---

## 🎯 **What is Connection Pooling?**

**Connection Pooling** = Supavisor (shared pooler) ที่ Supabase ให้ฟรี

**Why Vercel needs it:**
- Serverless functions = short-lived connections
- Direct connection = มัก timeout
- Pooling = รองรับ serverless architecture

---

## ✅ **HOW TO GET IT**

### **Option 1: Vercel Integration (Recommended)**

ถ้าติดตั้ง Supabase Integration แล้ว:
1. Vercel Dashboard → Settings → Environment Variables
2. หา `POSTGRES_URL` (ถูก set อัตโนมัติ)
3. ใช้ค่านั้น! (Pooling URL แล้ว)

**Format ที่ได้:**
```
postgres://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres
```

---

### **Option 2: Copy from Supabase Dashboard**

ถ้าไม่มี Integration:

1. **Go to:** https://app.supabase.com
2. **Select project:** blog-post-db
3. **Click:** "Database" (sidebar ซ้าย)
4. **Look for:** **"Connect" button** (ด้านบนของหน้า Database)
5. **Click:** "Connect"
6. **Copy:** "Transaction Mode" connection string

**Format ที่ได้:**
```
postgres://postgres.ywzvkyrmlggwhnzrfpdt:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

7. **Replace:** `[PASSWORD]` → `_BlogPost01`

**Result:**
```
postgres://postgres.ywzvkyrmlggwhnzrfpdt:_BlogPost01@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
```

---

## 🔑 **Key Differences**

| | Direct | Pooling |
|---|---|---|
| **URL** | `db.*.supabase.co:5432` | `pooler.supabase.com:6543` |
| **Username** | `postgres` | `postgres.PROJECT_REF` |
| **Port** | 5432 | 6543 |
| **Local** | ✅ Works | ✅ Works |
| **Vercel** | ❌ Fails | ✅ Works |

---

## 📋 **Common Formats**

### **Direct (ไม่ใช้สำหรับ Vercel):**
```
postgresql://postgres:PASSWORD@db.ywzvkyrmlggwhnzrfpdt.supabase.co:5432/postgres
```

### **Pooling (ใช้สำหรับ Vercel):**
```
postgres://postgres.ywzvkyrmlggwhnzrfpdt:PASSWORD@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
```

---

## ✅ **Verify It's Correct**

- ✅ Host: `pooler.supabase.com` (ไม่ใช่ `db.*.supabase.co`)
- ✅ Username: `postgres.PROJECT_REF` (ไม่ใช่ `postgres`)
- ✅ Port: `6543` (ไม่ใช่ `5432`)

---

## 🎯 **Summary**

**Connection Pooling** = URL format ที่ Supabase ตั้งไว้สำหรับ serverless

**How to get:** Copy จาก Supabase Dashboard → "Connect" button

**Don't guess:** URL แต่ละ project ไม่เหมือนกัน!

---

**ดูรายละเอียดเพิ่มเติม:**  
https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler

