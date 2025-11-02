# 🔧 แก้ไข Error ENOTFOUND - Database Host Not Found

## ❌ ปัญหา
```
"error": "getaddrinfo ENOTFOUND db.ywzvkyrmlggwhnzrfpdt.supabase.co"
"code": "ENOTFOUND"
```

**ความหมาย:** หา database hostname ไม่เจอ

## ✅ วิธีแก้ไข

### ขั้นตอนที่ 1: ตรวจสอบ Supabase Project

1. ไปที่ https://app.supabase.com
2. ตรวจสอบว่า project `ywzvkyrmlggwhnzrfpdt` ยังมีอยู่และ active หรือไม่
3. ถ้า project ถูก pause ให้ resume
4. ถ้า project ถูกลบแล้ว ต้องสร้างใหม่หรือใช้ project อื่น

### ขั้นตอนที่ 2: ตรวจสอบ Connection String ใน Supabase

1. ไปที่ Supabase Dashboard → **Project Settings** → **Database**
2. คลิก **Connection Pooling** หรือ **Connection string**
3. เลือก **Connection Pooling** (recommended) หรือ **Direct connection**

#### Option A: ใช้ Connection Pooling (แนะนำ)
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

#### Option B: ใช้ Direct Connection
```
postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
```

### ขั้นตอนที่ 3: อัพเดท DATABASE_URL ใน Vercel

1. ไปที่ Vercel Dashboard → **Settings** → **Environment Variables**
2. คลิกที่ `DATABASE_URL`
3. ตรวจสอบว่า connection string ถูกต้อง:
   - Hostname ถูกต้อง (ตรวจสอบจาก Supabase Dashboard)
   - Password ใช้ `%40` แทน `@`
   - Port ถูกต้อง (5432 สำหรับ direct, 6543 สำหรับ pooler)

### ขั้นตอนที่ 4: ใช้ Connection Pooling (แนะนำสำหรับ Serverless)

สำหรับ Vercel Serverless Functions แนะนำให้ใช้ **Connection Pooling**:

```
postgresql://postgres.ywzvkyrmlggwhnzrfpdt:[PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
```

**วิธีหา Connection Pooling URL:**
1. ไปที่ Supabase Dashboard → **Project Settings** → **Database**
2. ดูที่ส่วน **Connection Pooling**
3. Copy connection string ที่มี `pooler.supabase.com`
4. Replace password ด้วย password ของคุณ (ใช้ `%40` แทน `@`)

### ขั้นตอนที่ 5: Redeploy

1. หลังจากแก้ไข Environment Variables แล้ว
2. ไปที่ **Deployments** → คลิก **"..."** → **Redeploy**
3. รอให้ deployment เสร็จ

---

## 🔍 ตรวจสอบว่าแก้ไขสำเร็จ

```bash
# ทดสอบ API
curl https://blog-post-project-api-five.vercel.app/assignments

# ถ้าสำเร็จ จะได้:
# {"data":[...]}
# 
# ถ้ายังมีปัญหา จะได้ error message ที่ละเอียดกว่า
```

---

## 💡 สาเหตุที่เป็นไปได้

1. **Supabase Project ถูก Pause**
   - ไปที่ Supabase Dashboard → Resume project

2. **Hostname ผิด**
   - ตรวจสอบ project reference ID จาก Supabase Dashboard
   - ตรวจสอบว่าใช้ connection string ที่ถูกต้อง

3. **ใช้ Direct Connection แทน Pooling**
   - Direct connection อาจไม่ทำงานกับ Serverless
   - แนะนำให้ใช้ Connection Pooling

4. **Connection String Format ผิด**
   - Password ต้องใช้ `%40` แทน `@`
   - ไม่มี space หรือ quote

---

## 📝 Checklist

- [ ] ตรวจสอบ Supabase project ว่ายัง active อยู่
- [ ] คัดลอก Connection Pooling URL จาก Supabase Dashboard
- [ ] อัพเดท `DATABASE_URL` ใน Vercel
- [ ] ใช้ `%40` แทน `@` ใน password
- [ ] Redeploy backend
- [ ] ทดสอบ API อีกครั้ง

