# 🤔 ทำไม Local ใช้ได้ แต่ Vercel ไม่ได้?

> ใช้ DATABASE_URL คนละอัน!

---

## 🔍 **The Truth**

**Local และ Vercel ใช้ DATABASE_URL คนละอัน!**

### **Local (ในเครื่องคุณ)**

**File:** `.env`

**DATABASE_URL:**
```
postgresql://postgres:_BlogPost01@db.ywzvkyrmlggwhnzrfpdt.supabase.co:5432/postgres
```

**Type:** Direct Connection  
**Host:** `db.*.supabase.co`  
**Port:** `5432`  
**Works:** ✅ On your local machine

---

### **Vercel (Production)**

**Location:** Vercel Dashboard → Environment Variables

**DATABASE_URL (ที่คุณใส่):**
```
postgres://postgres.ywzvkyrmlggwhnzrfpdt:_BlogPost01@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
```

**Type:** Connection Pooling  
**Host:** `pooler.supabase.com`  
**Port:** `6543`  
**Works:** ❌ Because URL is wrong!

---

## ❓ **ทำไม URL ต่างกัน?**

### **Local**
- Your computer = persistent connection
- Can use Direct Connection
- Connects directly to database

### **Vercel (Serverless)**
- Short-lived serverless functions
- **Cannot** use Direct Connection
- **Must** use Connection Pooling
- Different authentication method

---

## ✅ **Solution**

**You MUST copy the correct Connection Pooling URL from Supabase Dashboard!**

**Not from .env file** (that's for local)  
**But from clicking "Connect" button** in Supabase Dashboard

---

## 📊 **Summary**

| | Local | Vercel |
|---|---|---|
| **DATABASE_URL** | Direct connection | Connection Pooling |
| **Host** | `db.*.supabase.co` | `pooler.supabase.com` |
| **Port** | `5432` | `6543` |
| **Where** | `.env` file | Vercel Dashboard |
| **Need** | Same `.env` | Copy from Supabase |

---

**Local และ Vercel ใช้คนละ URL!** 🎯

**You need 2 different DATABASE_URL values!**

