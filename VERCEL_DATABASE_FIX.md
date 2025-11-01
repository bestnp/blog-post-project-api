# 🔧 แก้ไข ENOTFOUND Error - Vercel Deployment

## 🔴 ปัญหา
```
Error: getaddrinfo ENOTFOUND db.ywzvkyrmlggwhnzrfpdt.supabase.co
Code: ENOTFOUND
```

**สาเหตุ:** ใช้ Direct Connection แทน Connection Pooling สำหรับ Vercel Serverless

---

## ✅ วิธีแก้ไข

### **ขั้นตอนที่ 1: ไปที่ Vercel Dashboard**

1. เปิด Vercel Dashboard → โปรเจ็กต์ของคุณ
2. ไปที่ **Settings** → **Environment Variables**

---

### **ขั้นตอนที่ 2: แก้ไข DATABASE_URL**

**❌ เดิม (Direct Connection - ไม่ทำงานกับ Vercel):**
```
postgresql://postgres:_Blog%40post01@db.ywzvkyrmlggwhnzrfpdt.supabase.co:5432/postgres
```

**✅ ใหม่ (Connection Pooling - ทำงานกับ Vercel):**
```
postgresql://postgres.ywzvkyrmlggwhnzrfpdt:_Blog%40post01@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

**การเปลี่ยนแปลง:**
- `db.ywzvkyrmlggwhnzrfpdt.supabase.co:5432` → `aws-0-ap-southeast-1.pooler.supabase.com:6543`
- `postgres:_Blog@post01` → `postgres.ywzvkyrmlggwhnzrfpdt:_Blog@post01`

---

### **ขั้นตอนที่ 3: แก้ไข AUTH_DATABASE_URL**

**❌ เดิม (Direct Connection):**
```
postgresql://postgres:BlogPostAuth@db.lyexkvqojyggrhfoqqqo.supabase.co:5432/postgres
```

**✅ ใหม่ (Connection Pooling):**
```
postgresql://postgres.lyexkvqojyggrhfoqqqo:BlogPostAuth@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

---

### **ขั้นตอนที่ 4: Redeploy**

1. ไปที่แท็บ **Deployments**
2. คลิก **"..."** ที่ deployment ล่าสุด
3. เลือก **Redeploy**
4. รอให้ deployment เสร็จ

---

## ✅ ทดสอบ

```bash
curl https://your-app.vercel.app/health
# Expected: {"status":"OK","message":"Server is running"}

curl https://your-app.vercel.app/assignments
# Expected: {"data":[...]}
```

---

## 💡 ทำไมต้องใช้ Connection Pooling?

| | Direct Connection | Connection Pooling |
|---|---|---|
| **Hostname** | `db.*.supabase.co:5432` | `pooler.supabase.com:6543` |
| **เหมาะกับ** | Traditional servers | Serverless (Vercel) |
| **DNS Resolution** | ❌ อาจไม่ work | ✅ Work ดี |
| **Performance** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **แนะนำ** | ❌ ไม่ | ✅ ใช่ |

---

## 📝 Checklist

- [ ] แก้ไข `DATABASE_URL` ใน Vercel
- [ ] แก้ไข `AUTH_DATABASE_URL` ใน Vercel
- [ ] ใช้ Connection Pooling (`pooler.supabase.com:6543`)
- [ ] เปลี่ยน username: `postgres` → `postgres.PROJECT_REF`
- [ ] เปลี่ยน port: `5432` → `6543`
- [ ] เปลี่ยน hostname: `db.*.supabase.co` → `aws-0-ap-southeast-1.pooler.supabase.com`
- [ ] Redeploy
- [ ] ทดสอบ `/health` endpoint

---

**🎉 หลังจากทำตามนี้แล้ว error จะหายไป!** ✅

