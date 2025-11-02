# 🔄 Manual Redeploy on Vercel

> ถ้า auto-deploy ไม่ทำงาน

---

## 🔍 **Problem**

Code updated but Vercel hasn't redeployed yet.

**Symptoms:**
- Still using old connection strings
- Still getting XX000 errors
- Latest deployment is old commit

---

## ✅ **Solution: Manual Redeploy**

### **Method 1: Vercel Dashboard**

1. Go to Vercel Dashboard
2. Click on your project **blog-post-project-api-five**
3. Go to **Deployments** tab
4. Find the deployment with commit `dd2cf0b` (latest one with Supabase Integration support)
5. Click the **"..."** (three dots) button
6. Click **"Redeploy"**

---

### **Method 2: Git Push Empty Commit**

```bash
git commit --allow-empty -m "Trigger Vercel redeploy"
git push
```

This forces Vercel to redeploy with current code.

---

### **Method 3: Trigger via Vercel CLI**

```bash
npx vercel --prod
```

This deploys current code to production.

---

## ⏰ **After Redeploy**

Wait 1-2 minutes, then test:

```bash
curl https://blog-post-project-api-five.vercel.app/health
curl https://blog-post-project-api-five.vercel.app/assignments
```

---

## 🎯 **Verify It Works**

**Check deployment logs:**

1. Vercel Dashboard → Deployments → Latest
2. Click on the deployment
3. View **Build Logs** and **Runtime Logs**
4. Should see: `✅ Connected to Blog Posts database`

**If you see connection errors in logs:**
- Check if `POSTGRES_URL` is set in Environment Variables
- Check if integration is properly installed
- Redeploy again

---

**Manual redeploy usually fixes the issue!** ✅

