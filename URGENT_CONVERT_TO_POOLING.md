# 🚨 URGENT: ต้องหา Connection Pooling URL

> คุณได้ Direct Connection URLs จาก Supabase แต่ต้องใช้ Pooling URLs!

---

## ❌ **URLs ที่คุณได้ (Direct Connection):**

**DB:**
```
postgresql://postgres:_BlogPost01@db.ywzvkyrmlggwhnzrfpdt.supabase.co:5432/postgres
```

**Auth:**
```
postgresql://postgres:BlogPostAuth@db.lyexkvqojyggrhfoqqqo.supabase.co:5432/postgres
```

❌ **ไม่ทำงานบน Vercel!**

---

## ✅ **ต้องหา Connection Pooling URLs:**

### **วิธีที่ 1: Vercel Integration (แนะนำ)**

1. Vercel Dashboard → Settings → Integrations
2. Browse Marketplace → Supabase
3. Add Integration → เลือก Supabase project
4. Vercel จะ set `POSTGRES_URL` อัตโนมัติ

---

### **วิธีที่ 2: Copy จาก Supabase Dashboard**

1. ไปที่ https://app.supabase.com
2. Select project **blog-post-db**
3. ไปที่ Database
4. **หาปุ่ม "Connect" หรือ "Connection string"**
5. **Copy "Transaction Mode" หรือ "Session Mode"**

**หาปุ่ม Connect ที่:**
- ด้านบนของหน้า Database
- หรือใน Settings → Database
- หรือคลิก Ctrl/Cmd + F แล้วค้นหา "Connect"

---

## 📋 **Pooling URLs ที่ควรได้:**

Format ควรเป็น:
```
postgres://postgres.PROJECT_REF:PASSWORD@aws-0-[REGION].pooler.supabase.com:6543/postgres
                                                               ^^^^^^^^^^^^^^^^^^^^^^^^
                                                               Pooler host!
```

**ไม่ใช่:**
```
postgresql://postgres:PASSWORD@db.*.supabase.co:5432/postgres
                                     ^^^^^^^^^^^^^^^^
                                     Direct host
```

---

## 🔍 **ถ้ายังหาไม่เจอ:**

ส่งภาพหน้าจอ:
1. Supabase Dashboard → Database page
2. หรือ Settings → Database
3. เพื่อให้ช่วยหาจุดที่ถูกต้อง

---

## 🎯 **Critical:**

**Direct URLs ใช้กับ local เท่านั้น!**  
**Vercel ต้องใช้ Pooling URLs!**

