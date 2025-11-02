# 🔍 How to Find Database Connection String in Supabase

> Step-by-step guide to find the correct connection string

---

## 📍 **Where to Look**

### **Method 1: Database Sidebar (Easiest)**

1. In Supabase Dashboard, look at the **left sidebar**
2. Find and click **"Database"** icon
3. At the top of the Database page, look for a **"Connect"** button
4. Click **"Connect"**
5. Copy the **"Transaction Mode"** connection string

---

### **Method 2: Project Settings**

1. Click the **Settings** icon (⚙️) at the bottom left
2. Look for **"Database"** in the settings menu
3. Click **"Database"**
4. Scroll down to find **"Connection string"** or **"Connection pooling"**
5. Copy the connection string

---

### **Method 3: Settings → General**

1. Click **Settings** (⚙️) → **General**
2. Look for **"Database"** or **"Connection info"** section
3. Find the connection string there

---

## ✅ **What You're Looking For**

You should see something like this when you click "Connect":

```
Direct Connection:    postgresql://postgres:[PASSWORD]@db.ywzvkyrmlggwhnzrfpdt.supabase.co:5432/postgres
Session Mode:         postgres://postgres.ywzvkyrmlggwhnzrfpdt:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
Transaction Mode:     postgres://postgres.ywzvkyrmlggwhnzrfpdt:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**For Vercel, use:** Transaction Mode (port 6543)

---

## ❌ **Wrong Pages**

Don't look in:
- ❌ **API Settings** (REST endpoints)
- ❌ **Authentication** (Auth settings)
- ❌ **Storage** (File storage)
- ❌ **Table Editor** (Data tables)

---

## 🎯 **Right Page**

✅ **Database** or **Settings → Database**

The page should have:
- Database password section
- Connection pooling configuration
- Connection strings
- "Connect" button

---

**Keep looking in the left sidebar for "Database"!** ✅

