# 🔌 Vercel + Supabase Integration (Auto Setup)

> ทำไมถึงต้องหา connection string เอง? มีวิธีอัตโนมัติ!

---

## 🎯 **Solution: Vercel Supabase Integration**

ตามเอกสาร: https://supabase.com/partners/integrations/vercel

**Vercel มี Supabase Integration ที่:**
- ✅ Auto-set environment variables
- ✅ ใช้ Supavisor URL (เหมาะกับ Vercel Serverless)
- ✅ ไม่ต้องหา connection string เอง!

---

## 🔧 **Setup Steps**

### **1. ไปที่ Vercel Dashboard**

1. เปิด https://vercel.com/dashboard
2. เลือก project **blog-post-project-api-five**

### **2. ไปที่ Integrations**

1. คลิก **Settings** → **Integrations**
2. หรือดูว่ามี **Integrations** ในเมนูซ้าย

### **3. ติดตั้ง Supabase Integration**

1. ถ้าเห็น **"Browse Marketplace"** → คลิก
2. ค้นหา **"Supabase"**
3. คลิก **"Add Integration"**
4. เลือก **Vercel scope** → CONTINUE
5. เลือก **"Specific Projects"** → เลือก project → Add Integration
6. เลือก **Supabase project** → Submit

### **4. Environment Variables ถูก Set อัตโนมัติ!**

Vercel จะ set environment variables เหล่านี้:
- `POSTGRES_URL` - Supavisor Transaction Mode (port 6543)
- `POSTGRES_PRISMA_URL` - Supavisor Transaction Mode
- `POSTGRES_URL_NON_POOLING` - Supavisor Session Mode
- Plus: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, etc.

---

## ⚠️ **IMPORTANT: Update Your Code!**

### **Current Code (uses DATABASE_URL):**

```typescript
// utils/db.ts
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // ❌ Wrong!
  ...
});
```

### **After Integration (should use POSTGRES_URL):**

```typescript
// utils/db.ts
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL, // ✅ Use POSTGRES_URL first!
  ...
});
```

---

## 🚀 **Quick Fix**

1. **Install Integration** (if not installed)
2. **Update code** to use `POSTGRES_URL`
3. **Redeploy**

---

## 🔄 **Alternative: Keep Using Manual Setup**

ถ้าไม่อยากใช้ Integration ก็ได้ แต่ต้อง:
1. หา connection string จาก Supabase Dashboard
2. Copy Transaction Mode
3. Replace password
4. Paste in Vercel manually

**Integration = อัตโนมัติ!** ✅

