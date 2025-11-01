# ⚡ แก้ไข ENOTFOUND Error - วิธีเร็วที่สุด

## 🔴 ปัญหา
```
Error: getaddrinfo ENOTFOUND db.ywzvkyrmlggwhnzrfpdt.supabase.co
Code: ENOTFOUND
```

## ✅ วิธีแก้ไข (ทำตามลำดับ)

### 1. ตรวจสอบ Supabase Project
- ไปที่ https://app.supabase.com
- ตรวจสอบว่า project active อยู่ (ถ้า pause ให้ resume)

### 2. ดึง Connection String ใหม่จาก Supabase

**Option A: ใช้ Connection Pooling (แนะนำสำหรับ Vercel)**
1. ไปที่ Supabase Dashboard → **Project Settings** → **Database** → **Connection Pooling**
2. Copy **Connection string** (Session mode)
3. Replace password: `[PASSWORD]` → `_Blog%40post01` (ใช้ `%40` แทน `@`)

**Option B: ใช้ Direct Connection**
1. ไปที่ Supabase Dashboard → **Project Settings** → **Database** → **Connection string**
2. Copy connection string
3. Replace password: `[PASSWORD]` → `_Blog%40post01`

### 3. อัพเดทใน Vercel
- Vercel Dashboard → **Settings** → **Environment Variables**
- แก้ไข `DATABASE_URL` ด้วย connection string ที่ได้
- **Redeploy**

### 4. ทดสอบ
```bash
curl https://blog-post-project-api-five.vercel.app/assignments
```

---

## 💡 Tip: Connection Pooling vs Direct Connection

| | Connection Pooling | Direct Connection |
|---|---|---|
| **URL Format** | `pooler.supabase.com:6543` | `db.*.supabase.co:5432` |
| **เหมาะกับ** | Serverless (Vercel) | Traditional servers |
| **Performance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **แนะนำ** | ✅ ใช่ | ❌ ไม่ |

---

## 📝 Example Connection Strings

### Connection Pooling (แนะนำ):
```
postgresql://postgres.ywzvkyrmlggwhnzrfpdt:_Blog%40post01@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### Direct Connection:
```
postgresql://postgres:_Blog%40post01@db.ywzvkyrmlggwhnzrfpdt.supabase.co:5432/postgres
```

**⚠️ สำคัญ:** ใช้ `%40` แทน `@` ใน password!

