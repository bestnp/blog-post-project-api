# 📋 Vercel Environment Variables - Complete List

> Copy-paste ready สำหรับ Vercel

---

## 🎯 **Location**

**Vercel Dashboard** → **Settings** → **Environment Variables**

---

## ✅ **Complete List (7 Variables)**

### **1. PORT**
```
Name: PORT
Value: 3001
Environment: Production, Preview, Development (เลือกทั้งหมด)
```

### **2. NODE_ENV**
```
Name: NODE_ENV
Value: production
Environment: Production, Preview, Development (เลือกทั้งหมด)
```

### **3. DATABASE_URL** ⚠️ IMPORTANT!
```
Name: DATABASE_URL
Value: postgresql://postgres.ywzvkyrmlggwhnzrfpdt:_BlogPost01@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
Environment: Production, Preview, Development (เลือกทั้งหมด)
```
⚠️ **ต้อง:** Connection Pooling (pooler.supabase.com:6543)  
📝 **Username:** postgres.ywzvkyrmlggwhnzrfpdt  
📝 **Password:** _BlogPost01

### **4. AUTH_DATABASE_URL** ⚠️ IMPORTANT!
```
Name: AUTH_DATABASE_URL
Value: postgresql://postgres.lyexkvqojyggrhfoqqqo:BlogPostAuth@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
Environment: Production, Preview, Development (เลือกทั้งหมด)
```
⚠️ **ต้อง:** Connection Pooling (pooler.supabase.com:6543)  
📝 **Username:** postgres.lyexkvqojyggrhfoqqqo  
📝 **Password:** BlogPostAuth

### **5. SUPABASE_URL**
```
Name: SUPABASE_URL
Value: https://lyexkvqojyggrhfoqqqo.supabase.co
Environment: Production, Preview, Development (เลือกทั้งหมด)
```

### **6. SUPABASE_ANON_KEY**
```
Name: SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5ZXhrdnFvanlnZ3JoZm9xcXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTUxNzcsImV4cCI6MjA3NzQ5MTE3N30.u1ClcJ-53iwRQSn3GM8kjadk299j3wLOkrcJQVVcO2Q
Environment: Production, Preview, Development (เลือกทั้งหมด)
```

### **7. FRONTEND_URL**
```
Name: FRONTEND_URL
Value: https://your-frontend.vercel.app
Environment: Production, Preview, Development (เลือกทั้งหมด)
```
⚠️ **เปลี่ยน** `your-frontend.vercel.app` เป็น URL จริงของ frontend

---

## 🔧 **Step-by-Step**

1. **ไปที่:** Vercel Dashboard → Settings → Environment Variables
2. **สำหรับแต่ละ variable:**
   - คลิก **"Add New"**
   - ใส่ Name และ Value
   - เลือก Environment: ✅ Production, ✅ Preview, ✅ Development
   - คลิก **Save**
3. **Redeploy:** Deployments → ... → Redeploy

---

## ⚠️ **CRITICAL NOTES**

### **DATABASE_URL & AUTH_DATABASE_URL**
- **ต้องใช้:** Connection Pooling format (pooler.supabase.com:6543)
- **ไม่ใช้:** Direct connection (db.*.supabase.co:5432) - ไม่ทำงานบน Vercel
- **Username:** postgres.PROJECT_REF (ไม่ใช่ postgres)

### **ถ้า Integration ทำงาน**
- Vercel อาจ set `POSTGRES_URL` ให้อัตโนมัติ
- Code รองรับทั้ง POSTGRES_URL และ DATABASE_URL
- ถ้ามี POSTGRES_URL ก็ไม่ต้องใส่ DATABASE_URL

---

## ✅ **Verification**

หลังจาก set ทั้งหมด:

1. **Redeploy** บน Vercel
2. **Test:**
   ```bash
   curl https://blog-post-project-api-five.vercel.app/health
   # Expected: {"status":"OK","message":"Server is running"}
   
   curl https://blog-post-project-api-five.vercel.app/assignments
   # Expected: {"data":[...]}
   ```

---

## 📞 **Troubleshooting**

### **Error XX000: Tenant or user not found**
→ Connection string ผิด  
→ ตรวจสอบ username, password, host

### **Error ENOTFOUND**
→ Host ไม่ถูกต้อง  
→ ใช้ pooler.supabase.com (ไม่ใช่ db.*.supabase.co)

### **Connection refused**
→ Port ผิด  
→ ใช้ 6543 สำหรับ Pooling (ไม่ใช่ 5432)

---

**Copy each value above → Paste into Vercel!** ✅

