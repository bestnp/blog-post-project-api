# 🚨 URGENT: Database Connection Fix

> แก้ปัญหา "Tenant or user not found" บน Vercel

---

## 🔴 **Current Status**

**Local:** ✅ Working (Direct connection)  
**Vercel:** ❌ Failing (Connection pooling not working)

---

## ✅ **Solution: Use Direct Connection (Temporary)**

**Problem:** Connection Pooling ไม่ work  
**Solution:** ใช้ Direct Connection แทน (ทำงานได้แล้ว)

---

## 🔧 **Quick Fix for Vercel**

### **DATABASE_URL:**
```
postgresql://postgres:_BlogPost01@db.ywzvkyrmlggwhnzrfpdt.supabase.co:5432/postgres
```

### **AUTH_DATABASE_URL:**
```
postgresql://postgres:BlogPostAuth@db.lyexkvqojyggrhfoqqqo.supabase.co:5432/postgres
```

---

## 📋 **Steps**

1. ไปที่ **Vercel Dashboard** → **Settings** → **Environment Variables**
2. แก้ไข `DATABASE_URL` เป็น:
   ```
   postgresql://postgres:_BlogPost01@db.ywzvkyrmlggwhnzrfpdt.supabase.co:5432/postgres
   ```
3. แก้ไข `AUTH_DATABASE_URL` เป็น:
   ```
   postgresql://postgres:BlogPostAuth@db.lyexkvqojyggrhfoqqqo.supabase.co:5432/postgres
   ```
4. **Redeploy**

---

## ⚠️ **Important**

- Connection Pooling อาจจะยังไม่ได้ enable ใน Supabase project ของคุณ
- Direct Connection (`db.*.supabase.co:5432`) **works for now**
- ถ้าต้องการใช้ Pooling ให้ enable ใน Supabase Dashboard ก่อน

---

**This will fix Vercel deployment immediately!** ✅

