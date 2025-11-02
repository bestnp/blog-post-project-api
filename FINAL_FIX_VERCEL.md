# 🔧 สรุปวิธีแก้ Database Error บน Vercel

> Error: "Tenant or user not found" - แก้ยังไงให้ได้

---

## 🔴 **ปัญหา**

```
Error: Tenant or user not found
Code: XX000
Hostname: aws-0-ap-southeast-1.pooler.supabase.com:6543
```

**Local:** ✅ Working (ใช้ Direct Connection)  
**Vercel:** ❌ Not working (ต้องใช้ Connection Pooling)

---

## ✅ **วิธีแก้ (3 ขั้นตอน)**

### **Step 1: ไปที่ Supabase Dashboard**

1. เปิด https://app.supabase.com
2. Login
3. เลือกโปรเจ็กต์: **ywzvkyrmlggwhnzrfpdt** (Blog Posts DB)

### **Step 2: ดึง Connection String**

**ถ้าจะทดสอบใช้ Direct Connection ก่อน:**
1. ไปที่ **Settings** → **Database**
2. Copy **"Connection string"** (Direct)
3. จะได้ประมาณ:
```
postgresql://postgres:[PASSWORD]@db.ywzvkyrmlggwhnzrfpdt.supabase.co:5432/postgres
```

**Replace password:** `_BlogPost01`

**ผลลัพธ์:**
```
postgresql://postgres:_BlogPost01@db.ywzvkyrmlggwhnzrfpdt.supabase.co:5432/postgres
```

### **Step 3: อัพเดท Vercel**

1. Vercel Dashboard → **Settings** → **Environment Variables**
2. แก้ไข `DATABASE_URL`:
```
postgresql://postgres:_BlogPost01@db.ywzvkyrmlggwhnzrfpdt.supabase.co:5432/postgres
```
3. **Redeploy**

---

## 🧪 **ทดสอบ**

```bash
curl https://blog-post-project-api-five.vercel.app/assignments
```

**Expected:** `{"data":[...]}`

---

## 💡 **ถ้ายังไม่ได้**

ลองใช้ Connection Pooling:

1. Supabase → Settings → Database → **Connection Pooling**
2. Copy **Session mode**
3. Replace password: `_BlogPost01`
4. ใช้ format: `postgres.ywzvkyrmlggwhnzrfpdt:_BlogPost01@pooler.supabase.com:6543/postgres`

---

**Local ใช้ได้แล้ว! ลองใส่ตรงๆ ดู Vercel จะใช้ได้ไหม** ✅

