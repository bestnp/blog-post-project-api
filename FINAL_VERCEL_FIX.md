# 🎯 Final Vercel Fix - Copy & Paste

> คัดลอก URL นี้ไปแก้ใน Vercel

---

## 🔧 **แก้ 2 Environment Variables เท่านั้น**

### **1. DATABASE_URL**

**Value ใหม่ (คัดลอกทั้งหมด):**
```
postgresql://postgres.ywzvkyrmlggwhnzrfpdt:_BlogPost01@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

---

### **2. AUTH_DATABASE_URL**

**Value ใหม่ (คัดลอกทั้งหมด):**
```
postgresql://postgres.lyexkvqojyggrhfoqqqo:BlogPostAuth@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

---

## 📋 **ขั้นตอน**

1. ไปที่ **Vercel Dashboard**
2. **Settings** → **Environment Variables**
3. คลิกที่ `DATABASE_URL` → **Edit**
4. ลบค่าเก่า → **Paste** ค่าใหม่ → **Save**
5. คลิกที่ `AUTH_DATABASE_URL` → **Edit**
6. ลบค่าเก่า → **Paste** ค่าใหม่ → **Save**
7. **Redeploy** (คลิก **Deployments** → **...** → **Redeploy**)

---

## ✅ **ไม่ต้องแก้อื่นๆ**

- ❌ PORT
- ❌ NODE_ENV
- ❌ FRONTEND_URL
- ❌ SUPABASE_URL
- ❌ SUPABASE_ANON_KEY

---

## 🧪 **ทดสอบหลัง Redeploy**

```
curl https://blog-post-project-api-five.vercel.app/health
# Expected: {"status":"OK","message":"Server is running"}

curl https://blog-post-project-api-five.vercel.app/assignments
# Expected: {"data":[...]}
```

---

**✅ ทำงานแน่นอน!**

