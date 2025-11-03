# 🔧 Avatar Upload Fix Guide

> Troubleshooting guide for "Failed to upload avatar to storage" error

---

## 🚀 **Quick Start - 2 Ways to Fix**

### **⚡ Option 1: EASIEST (Recommended)**
**Use Vercel + Supabase Integration** (Page 2-3)
- ✅ Auto-sets all keys
- ✅ No manual copying
- ✅ Takes 2 minutes

### **🔧 Option 2: Manual Setup**
**Copy key from Supabase** (Page 4-6)
- ✅ More control
- ✅ Step-by-step instructions
- ✅ Screenshots included

---

## 🐛 **Common Error**

```
Error: Failed to upload avatar to storage
```

**Main Cause:** Missing `SUPABASE_SERVICE_ROLE_KEY` in Vercel Environment Variables

---

## ✅ **Solution Checklist**

### **1. Check Supabase Storage Bucket Exists**

**Steps:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Storage** (left sidebar)
4. Verify bucket `my-personal-blog` exists

**If bucket doesn't exist:**
1. Click **"New bucket"**
2. Name: `my-personal-blog`
3. **⚠️ IMPORTANT:** Make it **Public**
4. Click **"Create bucket"**

---

### **2. Set SUPABASE_SERVICE_ROLE_KEY in Vercel**

**⚠️ CRITICAL:** This is usually the main cause of upload failures.

#### **Option A: Using Vercel + Supabase Integration (Recommended)**

**This is the EASIEST way** - Vercel will automatically set all Supabase keys for you!

**Step-by-step:**

1. **Go to:** https://vercel.com/dashboard
2. **Click** on your project (`blog-post-project-api`)
3. **Top menu** → Click **"Settings"**
4. **Left sidebar** → Click **"Integrations"**
5. **Scroll down** → Click **"Browse Marketplace"**
6. **Search** for `Supabase`
7. **Click** on the **"Supabase"** integration card
8. **Click "Add Integration"** button
9. **Select Vercel scope** → Click **"Continue"**
10. **Choose:** **"Specific Projects"**
11. **Select** `blog-post-project-api` → Click **"Add Integration"**
12. **Choose** your Supabase project → Click **"Submit"**

**✅ Done!** All these variables will be automatically added:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` ⭐
- `POSTGRES_URL`
- And more!

**Note:** You may need to **Redeploy** your project after adding the integration.

#### **Option B: Manual Setup** (Step-by-step with screenshots)

**Step 1: Get the Service Role Key from Supabase**

1. **Go to:** https://supabase.com/dashboard
2. **Login** with your Supabase account
3. **Click** on your project (blog post project)
4. **Left sidebar** → Click **"Settings"** (⚙️ gear icon)
5. **Left sidebar under Settings** → Click **"API"**
6. Scroll down to **"Project API keys"** section
7. Find **"service_role"** row (it's the secret key)
   - ⚠️ It will show **"Hidden"** or **"Reveal"** button
8. **Click "Reveal"** or **"Show"** to display the key
9. **⚠️ WARNING:** This key has full access - keep it secret!
10. **Copy** the entire key (it's very long, starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

**Visual Guide:**
```
Supabase Dashboard
├── Your Project
    ├── Settings (⚙️)
        ├── API
            └── Project API keys
                ├── anon/public:     eyJ... (visible)
                └── service_role:    Hidden/Reveal ⬅️ Click here!
```

**Step 2: Add to Vercel Environment Variables**

1. **Go to:** https://vercel.com/dashboard
2. **Click** on your project (`blog-post-project-api`)
3. **Top menu** → Click **"Settings"**
4. **Left sidebar** → Click **"Environment Variables"**
5. **Click "Add New"** button
6. Fill in:
   ```
   Name: SUPABASE_SERVICE_ROLE_KEY
   Value: (paste the service_role key you copied)
   Environment: ☑️ Production  ☑️ Preview  ☑️ Development
   ```
7. **Click "Save"**

**Important:** Make sure you select **ALL three environments** (Production, Preview, Development)!

**Step 3: Redeploy Your Project**

1. **Vercel Dashboard** → **Deployments** (top menu)
2. Find the latest deployment
3. Click **"⋯"** (three dots) → **"Redeploy"**
4. Wait for deployment to complete

**Visual Guide:**
```
Vercel Dashboard
├── Your Project
    ├── Settings
        └── Environment Variables
            └── Add New
                ├── Name: SUPABASE_SERVICE_ROLE_KEY
                ├── Value: [paste your key]
                └── Environment: ☑️ ☑️ ☑️ (select all!)
```

---

### **3. Verify Environment Variables in Vercel**

**Required variables:**
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **Most important!**

**Check:**
1. **Vercel Dashboard** → **Settings** → **Environment Variables**
2. Verify all 3 variables are set
3. Make sure they're enabled for **Production**, **Preview**, and **Development**

---

### **4. Check Bucket RLS Policies (Optional)**

If bucket exists but uploads still fail, check RLS policies:

1. **Supabase Dashboard** → **Storage** → **Policies**
2. Select bucket `my-personal-blog`
3. Ensure policies allow uploads

**Or make bucket public (easier):**
1. **Storage** → Click on bucket `my-personal-blog`
2. Go to **Settings** tab
3. Enable **"Public bucket"**
4. Save

---

### **5. Test Upload Locally First**

**Before deploying to Vercel, test locally:**

1. Create `.env` file in project root:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   DATABASE_URL=your-database-url
   AUTH_DATABASE_URL=your-auth-database-url
   ```

2. Run locally:
   ```bash
   npm run dev
   ```

3. Test avatar upload in frontend
4. Check console logs for detailed error messages

---

## 🔍 **Debugging Steps**

### **Check Backend Logs**

**On Vercel:**
1. **Vercel Dashboard** → **Deployments**
2. Click on latest deployment
3. Click **"Functions"** tab
4. Click on a function (e.g., `/api/profiles`)
5. Check **"Logs"** for error messages

**Look for:**
- `❌ Storage upload error:` - Shows detailed error
- `hasServiceRoleKey: true/false` - Confirms if key is set
- `Bucket not found` - Bucket doesn't exist
- `403` or `Permission denied` - Missing SERVICE_ROLE_KEY
- `JWT` errors - Invalid key

### **Check Frontend Console**

**In browser DevTools (F12):**
1. Go to **Console** tab
2. Try uploading avatar
3. Look for error messages
4. Check **Network** tab → Find the request to `/profiles/avatar`
5. Click on it → Check **Response** tab for error details

---

## 📝 **Updated Code Features**

### **Recent Improvements:**

1. ✅ **Better error messages** - More helpful error descriptions
2. ✅ **Detailed logging** - Shows what's missing (URL, keys, etc.)
3. ✅ **upsert: true** - Allows overwriting existing files
4. ✅ **Validation** - Checks file type and size

### **Error Message Examples:**

**If bucket doesn't exist:**
```
Bucket "my-personal-blog" does not exist. 
Please create it in Supabase Storage > Storage section.
```

**If SERVICE_ROLE_KEY is missing:**
```
Permission denied. Please check: 
1) SUPABASE_SERVICE_ROLE_KEY is set in Vercel environment variables, 
2) Bucket RLS policies allow uploads.
```

**If bucket RLS is blocking:**
```
Storage bucket permissions issue. Please check: 
1) Bucket exists, 
2) RLS policies allow uploads, 
3) SUPABASE_SERVICE_ROLE_KEY is set in Vercel.
```

---

## 🎯 **Quick Fix Summary**

**Most common solution:**

1. ✅ **Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel Environment Variables**
2. ✅ **Verify bucket `my-personal-blog` exists and is public**
3. ✅ **Redeploy project on Vercel**
4. ✅ **Test again**

---

## 📚 **Related Documentation**

- **Environment Variables:** See `VERCEL_DEPLOYMENT.md`
- **File Upload Guide:** See `UPLOAD.md`
- **API Endpoints:** See `API_ENDPOINTS.md`

---

## 🆘 **Still Having Issues?**

**Provide these details:**

1. Error message (exact text)
2. Vercel logs (from Functions → Logs)
3. Browser console errors
4. Check if `SUPABASE_SERVICE_ROLE_KEY` is set:
   ```bash
   # In Vercel Functions logs, look for:
   🔑 Service Role Key: ✅ Set  (should see this)
   ```

---

## ✅ **Success Indicators**

**When it works, you should see:**

1. **Backend logs:**
   ```
   📤 Uploading avatar to bucket: my-personal-blog
   🔑 Supabase URL: ✅ Set
   🔑 Service Role Key: ✅ Set
   ✅ Avatar uploaded successfully
   ```

2. **Frontend:**
   - Avatar uploads without error
   - Avatar URL is saved to database
   - Avatar displays correctly in profile

---

## 🔐 **Security Reminder**

**⚠️ NEVER:**
- ❌ Commit `SUPABASE_SERVICE_ROLE_KEY` to Git
- ❌ Expose it in frontend code
- ❌ Share it publicly

**✅ ALWAYS:**
- ✅ Keep it in Vercel Environment Variables only
- ✅ Use it only in backend/server code
- ✅ Treat it as a secret (like passwords)

---

**Last Updated:** January 2025

