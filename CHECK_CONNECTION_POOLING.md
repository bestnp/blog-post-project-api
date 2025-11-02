# 🔍 ตรวจสอบ Connection Pooling

> ปัญหา XX000 = Username/Password ผิด หรือ Connection Pooling ยังไม่เปิด

---

## 🔴 **Error**
```
"Tenant or user not found"
Code: XX000
Host: aws-0-ap-southeast-1.pooler.supabase.com:6543 ✅
```

---

## 🔍 **ตรวจสอบ Connection Pooling**

### **Step 1: ไปที่ Supabase Dashboard**

1. เปิด https://app.supabase.com
2. Login
3. เลือกโปรเจ็กต์ **ywzvkyrmlggwhnzrfpdt** (Blog Posts DB)

### **Step 2: ตรวจสอบ Connection Pooling**

1. คลิก **Settings** (⚙️) → **Database**
2. Scroll ลงไปหา **"Connection Pooling"**
3. ดูว่ามี **"Connection Pooling"** หรือไม่

**ถ้าเห็น "Connection Pooling":**
- ✅ Pooling enabled
- Click **"Connection Pooling"** → Copy **"Session mode"** connection string

**ถ้าไม่เห็น "Connection Pooling":**
- ❌ Pooling ไม่ได้ enable
- ต้องใช้ **Direct Connection** แทน!

---

## 🔧 **Solution A: ถ้า Connection Pooling Enabled**

**ใช้ Connection String จาก Supabase Dashboard:**
```
postgresql://postgres.ywzvkyrmlggwhnzrfpdt:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

**Replace `[PASSWORD]` ด้วย:** `_BlogPost01`

**Result:**
```
postgresql://postgres.ywzvkyrmlggwhnzrfpdt:_BlogPost01@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

---

## 🔧 **Solution B: ถ้า Connection Pooling NOT Enabled**

**ใช้ Direct Connection แทน:**

1. ไปที่ **Database** → **Connection string**
2. เลือก **"URI"** หรือ **"Connection pooling"**
3. Copy connection string
4. Replace password: `[PASSWORD]` → `_BlogPost01`

**Format:**
```
postgresql://postgres:_BlogPost01@db.ywzvkyrmlggwhnzrfpdt.supabase.co:5432/postgres
```

---

## 📋 **Action Items**

- [ ] ตรวจสอบว่ามี Connection Pooling ใน Supabase Dashboard
- [ ] Copy connection string จาก Supabase (ไม่ใช่ตั้งเอง)
- [ ] Replace password เท่านั้น
- [ ] Paste ใน Vercel Environment Variables
- [ ] Redeploy

---

## ⚠️ **Important**

**อย่าเดา connection string!**  
**ต้อง copy จาก Supabase Dashboard เท่านั้น!**

แต่ละ project มี connection string ไม่เหมือนกัน!

