# 🔐 Vercel Environment Variables Setup

> Complete guide for setting up environment variables in Vercel

---

## 📋 **Required Environment Variables**

Add these in **Vercel Dashboard** → **Settings** → **Environment Variables**:

### **1. Server Configuration:**
```env
PORT=3001
NODE_ENV=production
```

### **2. Blog Posts Database:**
```env
DATABASE_URL=postgresql://postgres:_Blog%40post01@db.ywzvkyrmlggwhnzrfpdt.supabase.co:5432/postgres
```
> **Note:** `%40` is URL-encoded `@` symbol

### **3. Authentication Database:**
```env
AUTH_DATABASE_URL=postgresql://postgres:BlogPostAuth@db.lyexkvqojyggrhfoqqqo.supabase.co:5432/postgres
```

### **4. Supabase (Auth + Storage):**
```env
SUPABASE_URL=https://lyexkvqojyggrhfoqqqo.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5ZXhrdnFvanlnZ3JoZm9xcXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTUxNzcsImV4cCI6MjA3NzQ5MTE3N30.u1ClcJ-53iwRQSn3GM8kjadk299j3wLOkrcJQVVcO2Q
```

### **5. Frontend URL:**
```env
FRONTEND_URL=https://your-frontend-app.vercel.app
```
> Replace with your actual frontend URL

---

## 🎯 **Important Notes**

### **⚠️ Supabase Configuration:**
The system uses **ONE Supabase project** for both:
- Authentication (Auth service)
- File Storage (Storage service)

Use the **Authentication Supabase** credentials:
- Project: `lyexkvqojyggrhfoqqqo`
- URL: `https://lyexkvqojyggrhfoqqqo.supabase.co`

### **📊 Database Configuration:**
Two separate PostgreSQL databases:
1. **Blog Posts DB** (`DATABASE_URL`) - Storage for blog content
2. **Auth DB** (`AUTH_DATABASE_URL`) - Storage for user data and roles

---

## ✅ **How to Add in Vercel**

### **Step 1: Go to Vercel Dashboard**
- Visit your project on Vercel
- Click **Settings** → **Environment Variables**

### **Step 2: Add Each Variable**
- Click **Add New**
- Enter **Name** and **Value**
- Select **Environment**: Production, Preview, Development
- Click **Save**

### **Step 3: Redeploy**
- After adding all variables
- Go to **Deployments** tab
- Click **Redeploy** on latest deployment

---

## 🧪 **Testing After Deployment**

```bash
# 1. Health Check
curl https://your-app.vercel.app/health

# Expected: {"status":"OK","message":"Server is running"}

# 2. Get Posts
curl https://your-app.vercel.app/assignments

# 3. Test Authentication
curl -X POST https://your-app.vercel.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@blog.com","password":"admin123"}'

# Expected: {"message":"Signed in successfully","access_token":"..."}
```

---

## ❌ **Common Issues**

### **Issue 1: Database Connection Failed**
**Solution:**
- Check `DATABASE_URL` format
- Ensure `%40` is used for `@` symbol
- Verify database is accessible

### **Issue 2: Authentication Not Working**
**Solution:**
- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- Use Auth Supabase credentials
- Check if email confirmation is enabled

### **Issue 3: File Upload Failed**
**Solution:**
- Ensure Supabase Storage bucket exists: `my-personal-blog`
- Check bucket permissions
- Verify `SUPABASE_ANON_KEY` has storage access

---

## 📝 **Complete Checklist**

- [ ] PORT set to 3001
- [ ] NODE_ENV set to production
- [ ] DATABASE_URL (Blog Posts) configured
- [ ] AUTH_DATABASE_URL (Auth) configured
- [ ] SUPABASE_URL (Auth) configured
- [ ] SUPABASE_ANON_KEY (Auth) configured
- [ ] FRONTEND_URL configured
- [ ] All variables saved in Vercel
- [ ] Deployment redeployed
- [ ] Health check passed
- [ ] Login test passed

---

**Ready for Vercel deployment!** 🚀

