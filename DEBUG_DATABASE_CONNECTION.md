# 🔍 วิธีตรวจสอบและแก้ไขปัญหา Database Connection

## 📋 ขั้นตอนการตรวจสอบปัญหา

### 1️⃣ ตรวจสอบ Error Message จาก API

หลังจากที่คุณ redeploy แล้ว ให้ทดสอบ API อีกครั้ง:
```bash
curl https://blog-post-project-api-five.vercel.app/assignments
```

ตอนนี้จะได้ error message ที่ละเอียดกว่า เช่น:
- `error`: ข้อความ error ที่ละเอียด
- `code`: Error code (เช่น `ECONNREFUSED`, `ENOTFOUND`, `28P01`)
- `hint`: คำแนะนำในการแก้ไข

### 2️⃣ ตรวจสอบ Logs ใน Vercel

1. ไปที่ Vercel Dashboard → **Deployments**
2. เลือก deployment ล่าสุด
3. คลิก **Logs**
4. ดูว่ามี error message อะไรแสดง

ควรจะเห็น logs แบบนี้:
```
🔍 Attempting database connection to: db.ywzvkyrmlggwhnzrfpdt.supabase.co:5432
❌ Database connection test failed
Error details: { message: "...", code: "..." }
```

### 3️⃣ ตรวจสอบ Environment Variables ใน Vercel

1. ไปที่ **Settings** → **Environment Variables**
2. ตรวจสอบว่ามี Variables เหล่านี้:
   - ✅ `DATABASE_URL`
   - ✅ `AUTH_DATABASE_URL`
   - ✅ `SUPABASE_URL`
   - ✅ `SUPABASE_ANON_KEY`

3. ตรวจสอบว่า Value ถูกต้อง:
   - `DATABASE_URL` ต้องใช้ `%40` แทน `@` ใน password
   - ไม่มี space หรือ newline อยู่หน้า/หลัง value
   - ไม่มี quote (`"` หรือ `'`) ครอบ value

---

## 🔧 วิธีแก้ไขปัญหาตาม Error Code

### Error Code: `ECONNREFUSED`
**ความหมาย:** Database server ปฏิเสธการเชื่อมต่อ

**วิธีแก้:**
1. ตรวจสอบว่า Supabase Database ทำงานอยู่
   - ไปที่ Supabase Dashboard
   - ตรวจสอบสถานะของ project
2. ตรวจสอบว่า Connection String ถูกต้อง
   - ตรวจสอบ host: `db.ywzvkyrmlggwhnzrfpdt.supabase.co`
   - ตรวจสอบ port: `5432`

### Error Code: `ENOTFOUND`
**ความหมาย:** หา database host ไม่เจอ

**วิธีแก้:**
1. ตรวจสอบ `DATABASE_URL` ใน Vercel ว่า hostname ถูกต้อง
2. ตรวจสอบว่าไม่มีการพิมพ์ผิด

### Error Code: `28P01`
**ความหมาย:** Authentication failed (username/password ผิด)

**วิธีแก้:**
1. ตรวจสอบว่า password ใน `DATABASE_URL` ใช้ `%40` แทน `@`
   ```
   ❌ ผิด: postgres:_Blog@post01@...
   ✅ ถูก: postgres:_Blog%40post01@...
   ```
2. ตรวจสอบว่า username และ password ถูกต้องจาก Supabase Dashboard

### Error Code: `3D000`
**ความหมาย:** Database ไม่存在

**วิธีแก้:**
1. ตรวจสอบว่า database name ใน `DATABASE_URL` ถูกต้อง
2. ปกติจะใช้ `postgres` สำหรับ Supabase

### Error Code: `ETIMEDOUT` หรือ `ECONNRESET`
**ความหมาย:** Connection timeout

**วิธีแก้:**
1. ตรวจสอบว่า Supabase project ไม่ได้ถูก pause หรือ suspend
2. ตรวจสอบ network connection
3. ลองรอสักครู่แล้วลองใหม่

---

## ⚠️ ปัญหาที่พบบ่อย

### ปัญหา 1: Environment Variables ไม่ถูก deploy
**อาการ:** Error message ยังเป็น generic message

**วิธีแก้:**
1. ตรวจสอบว่า Environment Variables ตั้งค่าใน Vercel แล้ว
2. **ต้อง Redeploy หลังจากเพิ่ม Environment Variables**
   - ไปที่ Deployments → คลิก "..." → Redeploy

### ปัญหา 2: Connection String Format ผิด
**ตัวอย่างที่ผิด:**
```
❌ DATABASE_URL=postgresql://postgres:_Blog@post01@...
❌ DATABASE_URL="postgresql://postgres:_Blog%40post01@..."
❌ DATABASE_URL= postgresql://postgres:_Blog%40post01@...
```

**ตัวอย่างที่ถูก:**
```
✅ DATABASE_URL=postgresql://postgres:_Blog%40post01@db.ywzvkyrmlggwhnzrfpdt.supabase.co:5432/postgres
```

**เคล็ดลับ:**
- ใช้ `%40` แทน `@` ใน password
- ไม่มี quote (`"` หรือ `'`) ครอบ
- ไม่มี space หน้า/หลัง

### ปัญหา 3: Database Tables ไม่มี
**อาการ:** Connection สำเร็จ แต่ query ไม่เจอ data

**วิธีแก้:**
1. ตรวจสอบว่า tables มีใน database:
   - `posts`
   - `categories`
   - `statuses`
2. ตรวจสอบว่า tables มีข้อมูลหรือไม่

---

## 📝 Checklist การแก้ไขปัญหา

- [ ] ตั้งค่า Environment Variables ใน Vercel แล้ว
- [ ] ใช้ `%40` แทน `@` ใน `DATABASE_URL`
- [ ] ไม่มี quote หรือ space ใน Environment Variables
- [ ] Redeploy Backend หลังจากตั้งค่า Environment Variables
- [ ] ตรวจสอบ Logs ใน Vercel เพื่อดู error ที่ละเอียด
- [ ] ตรวจสอบ Supabase Dashboard ว่า database ทำงานอยู่
- [ ] ทดสอบ API อีกครั้งหลัง redeploy

---

## 🧪 ทดสอบหลังแก้ไข

```bash
# 1. Health Check
curl https://blog-post-project-api-five.vercel.app/health
# Expected: {"status":"OK","message":"Server is running"}

# 2. Get Posts (ควรได้ข้อมูล posts)
curl https://blog-post-project-api-five.vercel.app/assignments
# Expected: {"data":[...]}

# 3. ถ้ายังมี error ให้ดู error message ที่ละเอียด
curl https://blog-post-project-api-five.vercel.app/assignments | jq '.'
```

---

## 💡 สิ่งที่ต้องทำตอนนี้

1. **Commit และ Push code ที่แก้ไข error handling แล้ว**
   ```bash
   cd blog-post-project-api
   git add .
   git commit -m "Improve database error handling and logging"
   git push
   ```

2. **ตรวจสอบ Environment Variables ใน Vercel**
   - ตรวจสอบว่าตั้งค่าทั้งหมดแล้ว
   - ตรวจสอบว่า format ถูกต้อง

3. **Redeploy ใน Vercel**
   - รอให้ auto-deploy จาก git push
   - หรือ manually redeploy

4. **ดู Logs หลังจาก redeploy**
   - จะเห็น error message ที่ละเอียดกว่า
   - ใช้ error message นี้เพื่อแก้ไขปัญหาต่อ

---

## 🔗 Links ที่มีประโยชน์

- Vercel Dashboard: https://vercel.com/dashboard
- Supabase Dashboard: https://app.supabase.com
- Vercel Environment Variables Docs: https://vercel.com/docs/concepts/projects/environment-variables

