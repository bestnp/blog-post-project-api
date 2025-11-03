# 🚀 Vercel Deployment Guide

> Complete guide for deploying the Blog Post API to Vercel

---

## 📋 **Overview**

This project uses **TypeScript directly** on Vercel without pre-compilation. Vercel automatically handles TypeScript compilation using `@vercel/node`.

---

## ⚙️ **Configuration**

### **vercel.json**
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/app.ts"
    }
  ]
}
```

**Key Points:**
- ✅ Uses `app.ts` directly (not compiled `dist/app.js`)
- ✅ Vercel handles TypeScript compilation automatically
- ✅ All routes are rewritten to the Express app

---

## 🔐 **Environment Variables**

**Location:** Vercel Dashboard → Settings → Environment Variables

### **Complete List (7 Variables)**

Add each variable with **Environment:** `Production`, `Preview`, `Development` (select all three).

---

#### **1. PORT**
```
Name: PORT
Value: 3001
Environment: Production, Preview, Development (เลือกทั้งหมด)
```

---

#### **2. NODE_ENV**
```
Name: NODE_ENV
Value: production
Environment: Production, Preview, Development (เลือกทั้งหมด)
```

---

#### **3. DATABASE_URL** ⚠️ IMPORTANT!
```
Name: DATABASE_URL
Value: postgresql://postgres.ywzvkyrmlggwhnzrfpdt:_BlogPost01@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
Environment: Production, Preview, Development (เลือกทั้งหมด)
```

⚠️ **Must use Connection Pooling** (`pooler.supabase.com:6543`) for Vercel Serverless

**Important:**
- **Username:** `postgres.ywzvkyrmlggwhnzrfpdt` (includes Project Reference ID)
- **Password:** `_BlogPost01`
- **Host:** `aws-1-ap-southeast-1.pooler.supabase.com`
- **Port:** `6543` (not `5432`)

---

#### **4. AUTH_DATABASE_URL** ⚠️ IMPORTANT!
```
Name: AUTH_DATABASE_URL
Value: postgresql://postgres.lyexkvqojyggrhfoqqqo:BlogPostAuth@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
Environment: Production, Preview, Development (เลือกทั้งหมด)
```

⚠️ **Must use Connection Pooling** (`pooler.supabase.com:6543`) for Vercel Serverless

**Important:**
- **Username:** `postgres.lyexkvqojyggrhfoqqqo` (includes Project Reference ID)
- **Password:** `BlogPostAuth`
- **Host:** `aws-1-ap-southeast-1.pooler.supabase.com`
- **Port:** `6543` (not `5432`)

---

#### **5. SUPABASE_URL**
```
Name: SUPABASE_URL
Value: https://lyexkvqojyggrhfoqqqo.supabase.co
Environment: Production, Preview, Development (เลือกทั้งหมด)
```

**Location:** Supabase Dashboard → Settings → API

---

#### **6. SUPABASE_ANON_KEY**
```
Name: SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5ZXhrdnFvanlnZ3JoZm9xcXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTUxNzcsImV4cCI6MjA3NzQ5MTE3N30.u1ClcJ-53iwRQSn3GM8kjadk299j3wLOkrcJQVVcO2Q
Environment: Production, Preview, Development (เลือกทั้งหมด)
```

**Location:** Supabase Dashboard → Settings → API → anon/public key

---

#### **7. SUPABASE_SERVICE_ROLE_KEY** ⚠️ REQUIRED FOR FILE UPLOADS!
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: (your-service-role-key-from-supabase)
Environment: Production, Preview, Development (เลือกทั้งหมด)
```

⚠️ **CRITICAL:** Required for file uploads (avatar, post images) to bypass RLS (Row Level Security) policies.

**Location:** Supabase Dashboard → Settings → API → service_role key (secret)

**⚠️ Security Note:**
- This key has **full access** to your Supabase project
- **Never** expose it in frontend code
- **Only** use in backend/server environments
- It bypasses Row Level Security (RLS) policies

**If using Vercel + Supabase Integration:** This key is automatically set. ✅

**If NOT using Integration:** You must manually add this environment variable.

---

#### **8. FRONTEND_URL**
```
Name: FRONTEND_URL
Value: https://your-frontend.vercel.app
Environment: Production, Preview, Development (เลือกทั้งหมด)
```

⚠️ **Important:** Replace `https://your-frontend.vercel.app` with your actual frontend URL

**Where to find:**
- Production URL: Vercel Dashboard → Your Frontend Project → Deployments → Production URL
- Or Domains tab in your Vercel Dashboard

---

## 🔌 **Vercel + Supabase Integration (Optional)**

**Recommended:** Use Vercel's official Supabase Integration for automatic environment variable setup.

### **Setup Steps:**

1. **Vercel Dashboard** → **Settings** → **Integrations**
2. Click **"Browse Marketplace"** → Search **"Supabase"**
3. Click **"Add Integration"**
4. Select **Vercel scope** → **CONTINUE**
5. Choose **"Specific Projects"** → Select your project → **Add Integration**
6. Select your **Supabase project** → **Submit**

### **Auto-Set Variables:**

After integration, Vercel automatically sets:
- `POSTGRES_URL` - Supavisor Transaction Mode
- `POSTGRES_PRISMA_URL` - Transaction Mode (Prisma)
- `POSTGRES_URL_NON_POOLING` - Supavisor Session Mode
- Plus: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, etc.

### **Code Update Required:**

**In `utils/db.ts`:**

```typescript
// Use POSTGRES_URL from Vercel Integration, or fallback to DATABASE_URL
const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
```

---

## 🚀 **Deployment Steps**

### **1. Initial Deployment:**

1. **Connect Repository:**
   - Vercel Dashboard → **Add New Project**
   - Import GitHub repository
   - Select **blog-post-project-api**

2. **Configure Project:**
   - Framework Preset: **Other**
   - Build Command: (leave empty - TypeScript handled by Vercel)
   - Output Directory: (leave empty)
   - Install Command: `npm install`

3. **Add Environment Variables:**
   - Add all 7 variables from above
   - Select all environments for each variable

4. **Deploy:**
   - Click **"Deploy"**
   - Wait for build to complete

---

### **2. Redeploy After Changes:**

**Method 1: Automatic (Recommended)**
- Push changes to GitHub
- Vercel auto-deploys on push to main/master

**Method 2: Manual**
- Vercel Dashboard → **Deployments**
- Click **"..."** (three dots) on latest deployment
- Click **"Redeploy"**

**Method 3: From Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel
```

---

## ✅ **Verification**

### **1. Health Check:**
```bash
curl https://your-api.vercel.app/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### **2. Get All Posts:**
```bash
curl https://your-api.vercel.app/assignments
```

**Expected Response:**
```json
{
  "data": [...]
}
```

### **3. If Database Connection Fails:**

Check error message:
- `ENOTFOUND` → Wrong hostname in `DATABASE_URL`
- `XX000` (Tenant not found) → Wrong username/password in `DATABASE_URL`
- `ECONNREFUSED` → Database server down or firewall blocking

**Common Issues:**
- ❌ Using Direct Connection (`db.*.supabase.co:5432`) instead of Pooling
- ❌ Missing username format (`postgres.PROJECT_REF`)
- ❌ Wrong region in hostname (`aws-1-ap-southeast-1`)

---

## 🌐 **Post-Deployment**

### **Base URLs:**

**Local Development:**
```
http://localhost:3001
```

**Vercel Production:**
```
https://your-api.vercel.app
```

### **Testing:**

📖 **See:** [POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md) for complete API testing guide

**Quick Test:**
1. Update Postman environment `baseUrl` to Vercel URL
2. Test `/health` endpoint
3. Test `/assignments` endpoint
4. Test authentication flows

---

## 📊 **Monitoring**

**Vercel Dashboard:**
- **Deployments** tab → View build logs and deployment status
- **Analytics** tab → View API usage and performance
- **Logs** tab → View real-time server logs

**Error Tracking:**
- Check deployment logs for build errors
- Check function logs for runtime errors
- Use Vercel CLI for local debugging: `vercel dev`

---

## 🐛 **Troubleshooting**

### **Issue: Build Fails**

**Possible causes:**
- Missing dependencies in `package.json`
- TypeScript compilation errors
- Missing environment variables

**Solution:**
1. Check build logs in Vercel Dashboard
2. Run `npm install` locally to verify dependencies
3. Run `tsc` locally to check TypeScript errors

---

### **Issue: Functions Timeout**

**Possible causes:**
- Database connection taking too long
- Missing connection pool configuration

**Solution:**
- Already configured in `utils/db.ts`:
  - `connectionTimeoutMillis: 10000`
  - `max: 20`
  - `idleTimeoutMillis: 30000`

---

### **Issue: Environment Variables Not Found**

**Possible causes:**
- Variables not added to correct environment
- Redeploy needed after adding variables

**Solution:**
1. Verify variables in Vercel Dashboard → Settings → Environment Variables
2. Ensure all 3 environments are selected (Production, Preview, Development)
3. Redeploy the project

---

## 📚 **Additional Resources**

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Connection Pooling:** https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler
- **Vercel + Supabase Integration:** https://supabase.com/partners/integrations/vercel

---

## ✅ **Summary**

**Quick Checklist:**
- [ ] `vercel.json` configured correctly
- [ ] All 7 environment variables added
- [ ] Connection Pooling URLs used (not Direct Connection)
- [ ] Integration installed (optional, recommended)
- [ ] Code updated to use `POSTGRES_URL` if using integration
- [ ] Initial deployment successful
- [ ] Health check passes
- [ ] API endpoints working
- [ ] Postman tests passing

---

**Happy Deploying! 🚀**

