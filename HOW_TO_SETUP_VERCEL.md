# 🚀 วิธี Setup Vercel - ขั้นตอนง่ายๆ

> คู่มือตั้งค่า Vercel สำหรับคนที่เพิ่งเริ่มต้น

---

## 📋 **ขั้นตอนที่ 1: เปิด Vercel Dashboard**

1. ไปที่ https://vercel.com
2. Login เข้า account ของคุณ
3. เลือกโปรเจ็กต์ API ที่จะ deploy

---

## 🔧 **ขั้นตอนที่ 2: ตั้งค่า Environment Variables**

### **วิธีเข้าไปตั้งค่า:**

1. ในหน้าโปรเจ็กต์ Vercel ของคุณ
2. คลิกแท็บ **"Settings"** (ด้านบน)
3. คลิก **"Environment Variables"** (เมนูซ้าย)

### **เพิ่มตัวแปรทั้งหมด 7 ตัว:**

#### **1. PORT**
```
Name: PORT
Value: 3001
Environment: Production, Preview, Development (เลือกทั้งหมด 3 อัน)
```
คลิก **Save**

#### **2. NODE_ENV**
```
Name: NODE_ENV
Value: production
Environment: Production, Preview, Development (เลือกทั้งหมด 3 อัน)
```
คลิก **Save**

#### **3. DATABASE_URL**
```
Name: DATABASE_URL
Value: postgresql://postgres.ywzvkyrmlggwhnzrfpdt:_BlogPost01@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
Environment: Production, Preview, Development (เลือกทั้งหมด 3 อัน)
```
⚠️ **สำคัญ:** ใช้ Connection Pooling (`pooler.supabase.com:6543`) สำหรับ Vercel Serverless  
📝 **Username:** `postgres.ywzvkyrmlggwhnzrfpdt` (ไม่ใช่ `postgres`)  
📝 **Password:** `_BlogPost01`  
📝 **Host:** `aws-1-ap-southeast-1.pooler.supabase.com:6543`  
คลิก **Save**

#### **4. AUTH_DATABASE_URL**
```
Name: AUTH_DATABASE_URL
Value: postgresql://postgres.lyexkvqojyggrhfoqqqo:BlogPostAuth@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
Environment: Production, Preview, Development (เลือกทั้งหมด 3 อัน)
```
⚠️ **สำคัญ:** ใช้ Connection Pooling (`pooler.supabase.com:6543`) สำหรับ Vercel Serverless  
📝 **Username:** `postgres.lyexkvqojyggrhfoqqqo` (ไม่ใช่ `postgres`)  
คลิก **Save**

#### **5. SUPABASE_URL**
```
Name: SUPABASE_URL
Value: https://lyexkvqojyggrhfoqqqo.supabase.co
Environment: Production, Preview, Development (เลือกทั้งหมด 3 อัน)
```
คลิก **Save**

#### **6. SUPABASE_ANON_KEY**
```
Name: SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5ZXhrdnFvanlnZ3JoZm9xcXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTUxNzcsImV4cCI6MjA3NzQ5MTE3N30.u1ClcJ-53iwRQSn3GM8kjadk299j3wLOkrcJQVVcO2Q
Environment: Production, Preview, Development (เลือกทั้งหมด 3 อัน)
```
คลิก **Save**

#### **7. FRONTEND_URL**
```
Name: FRONTEND_URL
Value: https://your-frontend.vercel.app
Environment: Production, Preview, Development (เลือกทั้งหมด 3 อัน)
```
⚠️ **เปลี่ยน** `your-frontend.vercel.app` เป็น URL ของ frontend app ของคุณ  
📌 **วิธีหา URL:**
   - เปิด Vercel Dashboard
   - ไปที่โปรเจ็กต์ **frontend** ของคุณ
   - ดูที่แท็บ **"Deployments"** หรือ **"Domains"**
   - คัดลอก URL มาใส่ตรงนี้ (เช่น `https://my-blog-frontend.vercel.app`)

คลิก **Save**

---

## 🎉 **ขั้นตอนที่ 3: Redeploy**

1. ไปที่แท็บ **"Deployments"** (ด้านบน)
2. หา deployment ล่าสุด
3. คลิก **"⋯"** (3 จุด) ที่มุมขวาบน
4. เลือก **"Redeploy"**
5. รอสักครู่ Vercel จะ deploy ใหม่อัตโนมัติ

---

## ✅ **ขั้นตอนที่ 4: ทดสอบ**

หลังจาก redeploy เสร็จ:

1. คลิก URL ของ deployment (เช่น `https://your-app.vercel.app`)
2. เพิ่ม `/health` ที่ท้าย URL
3. ควรเห็น: `{"status":"OK","message":"Server is running"}`

---

## 🎯 **สรุป**

✅ เพิ่ม Environment Variables ทั้ง 7 ตัว  
✅ เลือก Environment: Production, Preview, Development ทุกตัว  
✅ Redeploy หลังจากตั้งค่าเสร็จ  
✅ ทดสอบด้วย `/health` endpoint  

**เสร็จแล้ว!** 🎉

---

## 📞 **ถ้ายังมีปัญหา**

ดูไฟล์:
- `VERCEL_ENV_SETUP.md` - รายละเอียดครบถ้วน
- `VERCEL_SETUP.md` - การตั้งค่าทั่วไป

---

## 💡 **คำถามที่พบบ่อย**

### **Q: ใช้ URL จาก Deployments หรือ Domains?**
**A: ใช้ได้ทั้ง 2 แบบ!**
- **Deployments**: URL ที่ Vercel สร้างให้อัตโนมัติ เช่น `https://blog-api-abc123.vercel.app`
- **Domains**: โดเมนที่คุณตั้งค่าเอง (ถ้ามี)
- **แนะนำ**: ใช้ URL จาก Deployments ก่อน (ง่ายกว่า)

### **Q: ถ้ายังไม่มี frontend จะใส่ URL อะไร?**
**A: ใส่ URL ของ API backend เอง**
- เช่น `https://your-backend-api.vercel.app`
- หรือ `http://localhost:3000` (ถ้ายัง development อยู่)

### **Q: FRONTEND_URL ใช้ตอนไหน?**
**A: ใช้สำหรับ CORS**
- เพื่อให้ frontend สามารถเรียก API ได้
- ถ้าไม่ใส่ อาจโดน block โดย CORS policy

