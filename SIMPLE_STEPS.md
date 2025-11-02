# 🎯 ทำอะไร? - ขั้นตอนง่ายๆ

> ไม่ต้องงง! ทำตามนี้

---

## ✅ **ทำ 3 อย่างเท่านั้น**

### **1. ไปที่ Vercel Dashboard**

1. เปิด https://vercel.com
2. Login
3. เลือก project **blog-post-project-api-five**
4. ไปที่ **Settings** → **Environment Variables**

---

### **2. เอา URL นี้ไปใส่**

**สำหรับ DATABASE_URL:**
```
postgresql://postgres.ywzvkyrmlggwhnzrfpdt:_BlogPost01@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
```

**สำหรับ AUTH_DATABASE_URL:**
```
postgresql://postgres.lyexkvqojyggrhfoqqqo:BlogPostAuth@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
```

---

### **3. Paste ใน Vercel และ Redeploy**

1. ใน Vercel → Environment Variables
2. ดับเบิลคลิกที่ `DATABASE_URL` (แก้ไข)
3. เปลี่ยนค่าเก่า → **Paste** ค่าใหม่
4. ทำแบบเดียวกันกับ `AUTH_DATABASE_URL`
5. คลิก **Save**
6. ไปที่ **Deployments** → คลิก "..." → **Redeploy**

---

## 🎯 **เสร็จแล้ว!**

รอ 1-2 นาที แล้วทดสอบ:
```
https://blog-post-project-api-five.vercel.app/assignments
```

---

## ❓ **ถ้างงว่า URL นี้มาจากไหน**

**มันคือ Connection Pooling URL ที่เรากำหนดให้**

ไม่ต้องหาเอง! ใช้ค่านี้เลย:
- `postgresql://postgres.ywzvkyrmlggwhnzrfpdt:_BlogPost01@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres`

**โครงสร้าง:**
- `postgres.ywzvkyrmlggwhnzrfpdt` = username + project ID
- `_BlogPost01` = password
- `aws-1-ap-southeast-1.pooler.supabase.com:6543` = pooling host
- `/postgres` = database name

---

**Copy → Paste → Redeploy → เรียบร้อย!** ✅

