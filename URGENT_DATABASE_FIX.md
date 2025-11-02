# 🚨 URGENT: Database Connection Fix

> แก้ปัญหา "Tenant or user not found" บน Vercel

---

## 🔴 **Current Status**

**Local:** ✅ Working (Direct connection)  
**Vercel:** ❌ Failing (Connection pooling not working)

---

## ✅ **Solution: Use Connection Pooling**

**Problem:** Direct Connection URL (`db.*.supabase.co`) ไม่ทำงานบน Vercel  
**Solution:** ใช้ Connection Pooling (`pooler.supabase.com`) แทน

---

## 🔧 **Quick Fix for Vercel**

### **DATABASE_URL:**
```
postgresql://postgres.ywzvkyrmlggwhnzrfpdt:_BlogPost01@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### **AUTH_DATABASE_URL:**
```
postgresql://postgres.lyexkvqojyggrhfoqqqo:BlogPostAuth@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

---

## 📋 **Steps**

1. ไปที่ **Vercel Dashboard** → **Settings** → **Environment Variables**
2. แก้ไข `DATABASE_URL` เป็น:
   ```
   postgresql://postgres.ywzvkyrmlggwhnzrfpdt:_BlogPost01@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```
3. แก้ไข `AUTH_DATABASE_URL` เป็น:
   ```
   postgresql://postgres.lyexkvqojyggrhfoqqqo:BlogPostAuth@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```
4. **Redeploy**

---

## ⚠️ **Important**

- ✅ Connection Pooling (`pooler.supabase.com:6543`) ทำงานได้บน Vercel
- ❌ Direct Connection (`db.*.supabase.co:5432`) **ไม่ทำงาน** บน Vercel Serverless
- Username format: `postgres.PROJECT_REF` (ไม่ใช่ `postgres`)
- Port: `6543` (ไม่ใช่ `5432`)

---

**This will fix Vercel deployment immediately!** ✅

